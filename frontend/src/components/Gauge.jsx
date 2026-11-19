import { motion } from 'framer-motion'

/**
 * SVG circular gauge
 * @param {number} value - 0..100
 * @param {string} label
 * @param {string} unit
 * @param {string} color - hex or named
 * @param {number} max
 */
export default function Gauge({ value = 0, label = '', unit = '', color = '#6366f1', max = 100 }) {
  const pct = Math.min(value / max, 1)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="160" height="160" className="-rotate-90">
          {/* Track */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
          {/* Fill */}
          <motion.circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-white/50">{unit}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">{label}</span>
    </div>
  )
}
