import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiFlashlightLine, RiBarChartLine, RiSettings4Line,
  RiArrowRightLine, RiShieldCheckLine, RiCpuLine, RiRadarLine,
} from 'react-icons/ri'
import AnimatedCounter from '../components/AnimatedCounter'
import { useAuth } from '../context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }),
}

const features = [
  {
    icon: RiCpuLine,
    title: 'ML-Driven Predictions',
    desc: 'Four trained models (ANN, RF, DT, LR) predict tensile strength and weld efficiency in milliseconds.',
  },
  {
    icon: RiSettings4Line,
    title: 'Parameter Optimization',
    desc: 'Input rotational speed, welding speed, axial force, and material — get optimized recommendations.',
  },
  {
    icon: RiBarChartLine,
    title: 'Comparative Analysis',
    desc: 'Side-by-side model performance metrics with interactive charts and error bounds.',
  },
]

const applications = [
  { label: 'Aerospace', icon: <i className="fa-solid fa-plane"></i>, desc: 'Fuselage panels, stringers' },
  { label: 'Automotive', icon: <i className="fa-solid fa-car"></i>, desc: 'Chassis, body panels' },
  { label: 'Marine', icon: <i className="fa-solid fa-sailboat"></i>, desc: 'Ship hulls, decking' },
  { label: 'Rail Transport', icon: <i className="fa-solid fa-train-subway"></i>, desc: 'Train carriages, frames' },
]

const stats = [
  { value: 98.2, suffix: '%', decimals: 1, label: 'Accuracy R²' },
  { value: 4, suffix: '+', decimals: 0, label: 'ML Models' },
  { value: 2.3, suffix: '%', decimals: 1, label: 'Min. Error' },
  { value: 500, suffix: '+', decimals: 0, label: 'Records' },
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="relative z-10 min-h-screen">
      {/* PROFESSIONAL HERO SECTION */}
      <section className="relative pt-32 pb-24 border-b border-slate-200 overflow-hidden">
        <div className="page-container relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="show" className="flex flex-col items-center gap-6">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold tracking-wide text-white border border-white/20 shadow-sm backdrop-blur-md">
              <RiCpuLine className="text-white text-sm" />
              <span>Machine Learning meets FSW</span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
              Design optimal joints. <br/>
              <span className="gradient-text">Predicted to perfection.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Supercharge your Friction Stir Welding parameters with ultra-fast AI predictions. 
              Less trial and error, stronger engineering.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex gap-4 items-center justify-center mt-6">
              <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="btn-primary">
                <span>Start Prediction</span>
                <RiArrowRightLine />
              </button>
              <button onClick={() => navigate('/about')} className="btn-secondary">
                Explore Methodology
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-12 relative z-10">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {stats.map((st, i) => (
              <motion.div 
                key={st.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i*0.1 }} viewport={{ once: true }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={st.value} suffix={st.suffix} decimals={st.decimals} duration={2000} />
                </div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ALIGNED FEATURES OVERVIEW */}
      <section className="py-24 relative z-10">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-lg text-slate-300">Enterprise-grade tooling for solid-state process optimization.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
                className="glass-card p-8 h-full shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                  <f.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-300 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS - PROFESSIONAL GRID */}
      <section className="py-24 relative z-10">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Heavy Industries</h2>
            <p className="text-lg text-slate-300">Applied engineering across the board.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {applications.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass-card p-8 flex flex-col items-center shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl text-white mb-6 border border-white/20">
                  {a.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{a.label}</h3>
                <p className="text-sm text-slate-300 font-light">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 relative z-10">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-16 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Optimize in seconds.
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-lg mx-auto font-light">
              Enter your parameters and let our trained algorithms calculate the exact joint limits.
            </p>
            <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="btn-primary text-base px-10 py-4">
              Launch Dashboard
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
