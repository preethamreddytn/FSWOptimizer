import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
  LineChart, Line,
} from 'recharts'
import { RiBarChartGroupedLine, RiInformationLine } from 'react-icons/ri'

const MODEL_STATS = [
  {
    id: 'ann',
    name: 'Artificial Neural Network',
    short: 'ANN',
    color: '#6366f1',
    r2: 98.2,
    rmse: 2.3,
    mae: 1.8,
    mape: 1.1,
    desc: 'Multi-layer perceptron with 3 hidden layers (64→32→16 neurons). Trained with Adam optimizer, ReLU activation, dropout 0.2. Best overall performance.',
    pros: ['Highest accuracy', 'Handles non-linearity', 'Generalization'],
    cons: ['Black-box model', 'Longer training time'],
  },
  {
    id: 'rf',
    name: 'Random Forest',
    short: 'RF',
    color: '#10b981',
    r2: 96.7,
    rmse: 3.8,
    mae: 2.9,
    mape: 1.9,
    desc: 'Ensemble of 200 decision trees with bootstrap aggregation. Max depth 12, min samples split 5. Strong performer with feature importance.',
    pros: ['Feature importance', 'Robust to outliers', 'Fast inference'],
    cons: ['Higher memory usage', 'Less interpretable than DT'],
  },
  {
    id: 'dt',
    name: 'Decision Tree',
    short: 'DT',
    color: '#f59e0b',
    r2: 92.4,
    rmse: 6.1,
    mae: 4.7,
    mape: 3.2,
    desc: 'CART algorithm with Gini impurity. Max depth 8, min samples leaf 4. Fully interpretable tree structure.',
    pros: ['Fully interpretable', 'Very fast', 'No scaling needed'],
    cons: ['Prone to overfitting', 'Lower accuracy'],
  },
  {
    id: 'lr',
    name: 'Linear Regression',
    short: 'LR',
    color: '#8b5cf6',
    r2: 84.1,
    rmse: 10.4,
    mae: 8.2,
    mape: 5.6,
    desc: 'OLS linear regression with L2 regularization (Ridge). Used as the statistical baseline model.',
    pros: ['Most interpretable', 'Fastest training', 'Statistical baseline'],
    cons: ['Cannot capture non-linearity', 'Highest error'],
  },
]

const radarData = [
  { metric: 'R² Score', ANN: 98.2, RF: 96.7, DT: 92.4, LR: 84.1 },
  { metric: 'Low RMSE', ANN: 97, RF: 90, DT: 75, LR: 55 },
  { metric: 'Low MAE', ANN: 96, RF: 88, DT: 73, LR: 52 },
  { metric: 'Speed', ANN: 70, RF: 85, DT: 98, LR: 99 },
  { metric: 'Interpret.', ANN: 30, RF: 55, DT: 95, LR: 99 },
]

const errorData = MODEL_STATS.map(m => ({
  name: m.short,
  RMSE: m.rmse,
  MAE: m.mae,
  MAPE: m.mape,
}))

const r2Data = MODEL_STATS.map(m => ({ name: m.short, 'R² (%)': m.r2 }))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function Models() {
  const [active, setActive] = useState('ann')
  const activeModel = MODEL_STATS.find(m => m.id === active)

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="section-label mb-1">ML Models</p>
          <h1 className="text-3xl font-bold text-white">Model Comparison</h1>
          <p className="text-slate-400 text-sm mt-1">Performance metrics for all trained models on the FSW dataset</p>
        </motion.div>

        {/* Model selector cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {MODEL_STATS.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setActive(m.id)}
              className={`glass-card p-5 text-left transition-all duration-200 ${
                active === m.id
                  ? 'border-primary-500/40 ring-1 ring-primary-500/30'
                  : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">{m.short}</span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-md"
                  style={{ background: m.color + '22', color: m.color }}
                >
                  {m.r2}%
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">{m.name}</p>
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.r2}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: m.color }}
                />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-card p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: activeModel.color + '22' }}>
                <RiBarChartGroupedLine style={{ color: activeModel.color }} className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-white">{activeModel.name}</h2>
                <p className="text-xs text-slate-500">Regression Model</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed border-l-2 pl-4 py-1" style={{ borderColor: activeModel.color }}>
              {activeModel.desc}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'R² Score', value: `${activeModel.r2}%`, color: '#6366f1' },
                { label: 'RMSE', value: `${activeModel.rmse} MPa`, color: '#10b981' },
                { label: 'MAE', value: `${activeModel.mae} MPa`, color: '#f59e0b' },
                { label: 'MAPE', value: `${activeModel.mape}%`, color: '#8b5cf6' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-lg font-bold mt-0.5" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Pros/Cons */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">Advantages</p>
                {activeModel.pros.map(p => (
                  <div key={p} className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">Limitations</p>
                {activeModel.cons.map(c => (
                  <div key={c} className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Radar Chart */}
          <div className="lg:col-span-3 glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Multi-Dimensional Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 0, right: 30, bottom: 0, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="ANN" dataKey="ANN" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Radar name="RF" dataKey="RF" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <Radar name="DT" dataKey="DT" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} />
                <Radar name="LR" dataKey="LR" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.08} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Metrics + R² Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Error Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={errorData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Bar dataKey="RMSE" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MAE" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MAPE" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">R² Score Ranking</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={r2Data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="R² (%)" radius={[0, 6, 6, 0]}
                  fill="url(#r2Gradient)"
                />
                <defs>
                  <linearGradient id="r2Gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4338ca" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
