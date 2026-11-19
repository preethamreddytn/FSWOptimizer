import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, Legend,
} from 'recharts'
import { RiLineChartLine } from 'react-icons/ri'

// Simulated experimental data patterns
const genTrend = (base, slope, noise, count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    x: +(base + i * slope + (Math.random() - 0.5) * noise).toFixed(2),
  }))

const rpmVsTensile = [
  { rpm: 400, tensile: 148 }, { rpm: 500, tensile: 167 }, { rpm: 600, tensile: 185 },
  { rpm: 700, tensile: 201 }, { rpm: 800, tensile: 213 }, { rpm: 900, tensile: 221 },
  { rpm: 1000, tensile: 226 }, { rpm: 1100, tensile: 224 }, { rpm: 1200, tensile: 219 },
  { rpm: 1400, tensile: 208 }, { rpm: 1600, tensile: 193 },
]

const speedVsEfficiency = [
  { speed: 20, eff: 71 }, { speed: 30, eff: 78 }, { speed: 40, eff: 83 },
  { speed: 50, eff: 87 }, { speed: 60, eff: 89 }, { speed: 70, eff: 88 },
  { speed: 80, eff: 85 }, { speed: 90, eff: 81 }, { speed: 100, eff: 76 },
]

const forceVsStrength = [
  { force: 5, ann: 162, rf: 158 }, { force: 6, ann: 174, rf: 170 },
  { force: 7, ann: 185, rf: 182 }, { force: 8, ann: 196, rf: 193 },
  { force: 9, ann: 207, rf: 203 }, { force: 10, ann: 217, rf: 212 },
  { force: 11, ann: 224, rf: 220 }, { force: 12, ann: 228, rf: 225 },
  { force: 13, ann: 229, rf: 227 }, { force: 14, ann: 226, rf: 224 },
  { force: 15, ann: 219, rf: 217 },
]

const materialComparison = [
  { material: 'AA2024', tensile: 247, efficiency: 92 },
  { material: 'AA6061', tensile: 213, efficiency: 89 },
  { material: 'AA7075', tensile: 261, efficiency: 94 },
  { material: 'AA5083', tensile: 198, efficiency: 85 },
  { material: 'AA2219', tensile: 228, efficiency: 91 },
]

// Simple heatmap using divs
const heatmapData = [
  ['RPM', 'Speed', 'Force', 'Shoulder', 'Pin', 'Tensile'],
  [1, 0.72, 0.65, 0.48, 0.31, 0.88],
  [0.72, 1, 0.54, 0.39, 0.25, 0.76],
  [0.65, 0.54, 1, 0.41, 0.28, 0.71],
  [0.48, 0.39, 0.41, 1, 0.62, 0.59],
  [0.31, 0.25, 0.28, 0.62, 1, 0.43],
  [0.88, 0.76, 0.71, 0.59, 0.43, 1],
]

const correlColor = (v) => {
  if (v >= 0.8) return 'bg-primary-600 text-white'
  if (v >= 0.6) return 'bg-primary-800 text-primary-200'
  if (v >= 0.4) return 'bg-surface-600 text-slate-300'
  return 'bg-surface-700 text-slate-500'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.fill }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

const Section = ({ title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="glass-card p-6"
  >
    <h3 className="text-sm font-semibold text-white mb-0.5">{title}</h3>
    {subtitle && <p className="text-xs text-slate-500 mb-4">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    {children}
  </motion.div>
)

export default function Insights() {
  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="section-label mb-1">Data Analytics</p>
          <h1 className="text-3xl font-bold text-white">Process Insights</h1>
          <p className="text-slate-400 text-sm mt-1">Parameter correlations and trends from experimental FSW data</p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Experiments', value: '527', sub: 'Validated records', color: 'text-primary-400' },
            { label: 'Optimal RPM', value: '900–1100', sub: 'Peak strength zone', color: 'text-accent-400' },
            { label: 'Best Material', value: 'AA7075', sub: 'Highest tensile', color: 'text-yellow-400' },
            { label: 'Avg. Efficiency', value: '87.3%', sub: 'Across all samples', color: 'text-purple-400' },
          ].map(({ label, value, sub, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* RPM vs Tensile */}
          <Section title="RPM vs Tensile Strength" subtitle="Optimal rotational speed around 900–1100 RPM" delay={0.05}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={rpmVsTensile} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="rpmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="rpm" tick={{ fill: '#64748b', fontSize: 10 }} label={{ value: 'RPM', fill: '#64748b', fontSize: 10, position: 'insideBottom', offset: -3 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} label={{ value: 'MPa', fill: '#64748b', fontSize: 10, angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tensile" stroke="#6366f1" fill="url(#rpmGrad)" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="Tensile (MPa)" />
              </AreaChart>
            </ResponsiveContainer>
          </Section>

          {/* Welding Speed vs Efficiency */}
          <Section title="Welding Speed vs Weld Efficiency" subtitle="Efficiency peaks around 60–70 mm/min" delay={0.1}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={speedVsEfficiency} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="speed" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[60, 95]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="eff" stroke="#10b981" fill="url(#speedGrad)" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Efficiency (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </Section>

          {/* Axial Force — ANN vs RF */}
          <Section title="Axial Force vs Tensile Strength (ANN vs RF)" subtitle="Model prediction comparison across force range" delay={0.15}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={forceVsStrength} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="force" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Line type="monotone" dataKey="ann" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="ANN" />
                <Line type="monotone" dataKey="rf" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Random Forest" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          {/* Material comparison */}
          <Section title="Material Alloy Comparison" subtitle="Tensile strength and efficiency across alloys" delay={0.2}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={materialComparison} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="material" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Bar dataKey="tensile" name="Tensile (MPa)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="efficiency" name="Efficiency (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* Correlation Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-0.5">Parameter Correlation Heatmap</h3>
          <p className="text-xs text-slate-500 mb-5">Pearson correlation coefficients between FSW parameters and output</p>
          <div className="overflow-auto">
            <div className="min-w-[480px]">
              {heatmapData.map((row, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className={`flex-1 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all
                        ${i === 0 || j === 0
                          ? 'bg-white/5 text-slate-400 font-semibold text-[10px]'
                          : correlColor(cell)
                        }`}
                    >
                      {i === 0 || j === 0 ? cell : typeof cell === 'number' ? cell.toFixed(2) : cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-xs text-slate-500">Correlation:</span>
            {[
              { label: 'Strong (≥0.8)', cls: 'bg-primary-600' },
              { label: 'Moderate (0.6–0.8)', cls: 'bg-primary-800' },
              { label: 'Weak (0.4–0.6)', cls: 'bg-surface-600' },
              { label: 'Low (<0.4)', cls: 'bg-surface-700' },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${cls}`} />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
