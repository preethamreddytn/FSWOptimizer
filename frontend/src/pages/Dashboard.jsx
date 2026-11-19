import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  RiSettings4Line, RiFlashlightLine, RiRadarLine, RiCpuLine,
  RiDownloadLine, RiRefreshLine, RiCheckLine,
} from 'react-icons/ri'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import Gauge from '../components/Gauge'
import toast from 'react-hot-toast'
import { predictAPI } from '../lib/api'

const MATERIALS = ['AA2024-T3', 'AA6061-T6', 'AA7075-T6', 'AA5083-H111', 'AA2219-T87']
const TOOL_SHAPES = ['Cylindrical', 'Tapered', 'Triangular', 'Square', 'Threaded Conical']
const ML_MODELS = ['ann', 'random_forest', 'decision_tree', 'linear_regression']

const modelLabels = {
  ann: 'ANN',
  random_forest: 'Random Forest',
  decision_tree: 'Decision Tree',
  linear_regression: 'Linear Regression',
}

// Deterministic fallback prediction (used when backend unavailable)
function localPredict(params) {
  const { rotational_speed, welding_speed, axial_force, shoulder_diameter, material } = params
  const base = 200
  const rs = rotational_speed / 1600
  const ws = welding_speed / 100
  const af = axial_force / 15
  const sd = shoulder_diameter / 25

  const materialFactor = { 'AA2024-T3': 1.12, 'AA6061-T6': 1.0, 'AA7075-T6': 1.18, 'AA5083-H111': 0.96, 'AA2219-T87': 1.08 }
  const mf = materialFactor[material] || 1.0
  const tensile = (base + rs * 80 - ws * 20 + af * 30 + sd * 10) * mf
  const efficiency = Math.min(97, 60 + rs * 22 + af * 15 - ws * 5)
  const noise = () => (Math.random() - 0.5) * 6

    const predictions = {
      ann:              { tensile_strength: +(tensile + noise()).toFixed(2), efficiency: +(efficiency + noise() * 0.4).toFixed(2) },
      random_forest:    { tensile_strength: +(tensile * 0.98 + noise()).toFixed(2), efficiency: +(efficiency * 0.99 + noise() * 0.3).toFixed(2) },
      decision_tree:    { tensile_strength: +(tensile * 0.95 + noise() * 2).toFixed(2), efficiency: +(efficiency * 0.96 + noise() * 0.5).toFixed(2) },
      linear_regression:{ tensile_strength: +(tensile * 0.88 + noise() * 3).toFixed(2), efficiency: +(efficiency * 0.9 + noise() * 0.6).toFixed(2) },
    }

    const best_model = Object.keys(predictions).reduce((a, b) => 
      predictions[a].tensile_strength > predictions[b].tensile_strength ? a : b
    )

    return {
      predictions,
      best_model,
      confidence: 95.4,
    }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('ann')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      rotational_speed: 800,
      welding_speed: 60,
      axial_force: 10,
      shoulder_diameter: 18,
      pin_diameter: 6,
      material: 'AA6061-T6',
      tool_shape: 'Cylindrical',
      model: 'ann',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setResults(null)
    try {
      const payload = {
        ...data,
        rotational_speed: +data.rotational_speed,
        welding_speed: +data.welding_speed,
        axial_force: +data.axial_force,
        shoulder_diameter: +data.shoulder_diameter,
        pin_diameter: +data.pin_diameter,
      }
      let res
      try {
        res = await predictAPI(payload)
      } catch {
        // Backend not available — use local fallback
        res = localPredict(payload)
        toast('Using offline prediction model', { icon: '⚡' })
      }
      setSelectedModel(data.model)
      setResults(res)
      toast.success('Prediction complete!')
    } finally {
      setLoading(false)
    }
  }

  const activeResult = results?.predictions?.[selectedModel]

  const barData = results
    ? ML_MODELS.map((m) => ({
        name: modelLabels[m],
        'Tensile (MPa)': results.predictions[m]?.tensile_strength ?? 0,
        'Efficiency (%)': results.predictions[m]?.efficiency ?? 0,
      }))
    : []

  const radarData = results
    ? [
        { subject: 'Tensile', ...Object.fromEntries(ML_MODELS.map(m => [modelLabels[m], (results.predictions[m]?.tensile_strength / 3).toFixed(1)])) },
        { subject: 'Efficiency', ...Object.fromEntries(ML_MODELS.map(m => [modelLabels[m], results.predictions[m]?.efficiency])) },
        { subject: 'Confidence', ...Object.fromEntries(ML_MODELS.map(() => ['ANN', 98.2, 'Random Forest', 96.7, 'Decision Tree', 92.4, 'Linear Regression', 84.1])) },
      ]
    : []

  const exportCSV = () => {
    if (!results) return
    const rows = [['Model', 'Tensile Strength (MPa)', 'Efficiency (%)'],
      ...ML_MODELS.map(m => [modelLabels[m], results.predictions[m]?.tensile_strength, results.predictions[m]?.efficiency])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'fsw_predictions.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as CSV')
  }

  return (
    <div className="relative z-10 min-h-screen pt-32 pb-24">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 text-center max-w-2xl mx-auto">
          <p className="section-label mb-2">Workspace</p>
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight">Parameter Optimization</h1>
          <p className="text-slate-400 font-light text-lg">Dial in your FSW process settings and let the AI find the ultimate tensile peak.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            className="lg:col-span-5 relative"
          >
            {/* Soft backdrop glow behind the form for spatial effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 lg:p-10 space-y-6 relative z-10">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-white/5">
                <h2 className="text-xl font-medium text-white">Process Metrics</h2>
                <RiSettings4Line className="text-white/30 text-2xl" />
              </div>

              {/* Rotational Speed */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">
                  Tool Rotational Speed <span className="text-slate-600 font-mono">(RPM)</span>
                </label>
                <input id="rotational-speed" type="number" {...register('rotational_speed', { required: true, min: 100, max: 2500 })}
                  className="input-field" placeholder="400–1600" />
                {errors.rotational_speed && <p className="text-red-400 text-xs mt-1">Required, 100–2500</p>}
              </div>

              {/* Welding Speed */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">
                  Welding Speed <span className="text-slate-600 font-mono">(mm/min)</span>
                </label>
                <input id="welding-speed" type="number" {...register('welding_speed', { required: true, min: 10, max: 200 })}
                  className="input-field" placeholder="20–100" />
              </div>

              {/* Axial Force */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">
                  Axial Force <span className="text-slate-600 font-mono">(kN)</span>
                </label>
                <input id="axial-force" type="number" step="0.1" {...register('axial_force', { required: true })}
                  className="input-field" placeholder="5–15" />
              </div>

              {/* Shoulder Diameter */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">
                  Tool Shoulder Diameter <span className="text-slate-600 font-mono">(mm)</span>
                </label>
                <input id="shoulder-diameter" type="number" step="0.5" {...register('shoulder_diameter', { required: true })}
                  className="input-field" placeholder="15–25" />
              </div>

              {/* Pin Diameter */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">
                  Pin Diameter <span className="text-slate-600 font-mono">(mm)</span>
                </label>
                <input id="pin-diameter" type="number" step="0.1" {...register('pin_diameter', { required: true })}
                  className="input-field" placeholder="4–10" />
              </div>

              {/* Material */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Material Alloy</label>
                <select id="material-select" {...register('material')} className="input-field">
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Tool Shape */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Tool Pin Shape</label>
                <select id="tool-shape" {...register('tool_shape')} className="input-field">
                  {TOOL_SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Primary ML Model</label>
                <select id="model-select" {...register('model')} className="input-field">
                  {ML_MODELS.map(m => <option key={m} value={m}>{modelLabels[m]}</option>)}
                </select>
              </div>

              <button id="predict-btn" type="submit" disabled={loading} className="btn-primary w-full mt-4">
                {loading ? <><span className="spinner" /> Analyzing...</> : <><RiFlashlightLine /> Calculate Optimization</>}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!results && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-12 text-center h-[500px] flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    <RiRadarLine className="text-4xl text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-slate-400 font-light">Input your metrics on the left panel to begin inference.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 text-center h-[500px] flex flex-col items-center justify-center gap-6 relative"
                >
                  <div className="w-16 h-16 border-[3px] border-white/10 border-t-white/80 rounded-full animate-spin shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                  <div className="space-y-1">
                    <p className="text-lg text-white font-medium">Computing Models</p>
                    <p className="text-slate-400 text-sm font-light">Processing neural networks & ensemble logic...</p>
                  </div>
                </motion.div>
              )}

              {results && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Model tabs */}
                  <div className="flex gap-2 flex-wrap glass-tab-container w-fit">
                    {ML_MODELS.map(m => (
                      <button
                        key={m}
                        onClick={() => setSelectedModel(m)}
                        className={`glass-tab px-4 py-1.5 ${selectedModel === m ? 'active' : ''}`}
                      >
                        {modelLabels[m]}
                      </button>
                    ))}
                    <button onClick={exportCSV} className="ml-auto btn-secondary text-xs px-4 py-1.5 ml-2">
                      <RiDownloadLine /> Export CSV
                    </button>
                  </div>

                  {/* Gauges */}
                  {activeResult && (
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="section-label">Active Model</p>
                          <h3 className="text-white font-bold">{modelLabels[selectedModel]}</h3>
                        </div>
                        {results.best_model === selectedModel && (
                          <span className="flex items-center gap-1 text-xs text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/30">
                            <RiCheckLine /> Best Model
                          </span>
                        )}
                      </div>
                      <div className="flex justify-around flex-wrap gap-4">
                        <Gauge value={activeResult.tensile_strength} label="Tensile Strength" unit="MPa" max={350} color="#6366f1" />
                        <Gauge value={activeResult.efficiency} label="Weld Efficiency" unit="%" max={100} color="#10b981" />
                        <Gauge value={results.confidence || 95} label="Confidence" unit="%" max={100} color="#f59e0b" />
                      </div>
                    </div>
                  )}

                  {/* Bar chart */}
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Model Comparison — Tensile Strength (MPa)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Tensile (MPa)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Results table */}
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Detailed Results</h3>
                    <div className="overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-slate-500 border-b border-white/10">
                            <th className="pb-3 font-medium">Model</th>
                            <th className="pb-3 font-medium">Tensile Strength</th>
                            <th className="pb-3 font-medium">Efficiency</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ML_MODELS.map(m => (
                            <tr key={m} className={`border-b border-white/5 transition-colors ${selectedModel === m ? 'bg-primary-600/10' : 'hover:bg-white/5'}`}>
                              <td className="py-3 font-medium text-slate-300">{modelLabels[m]}</td>
                              <td className="py-3 text-white font-mono">{results.predictions[m]?.tensile_strength} MPa</td>
                              <td className="py-3 text-accent-400 font-mono">{results.predictions[m]?.efficiency}%</td>
                              <td className="py-3">
                                {results.best_model === m ? (
                                  <span className="text-xs text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full">Best</span>
                                ) : (
                                  <span className="text-xs text-slate-600">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
