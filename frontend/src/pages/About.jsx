import { motion } from 'framer-motion'
import {
  RiToolsLine, RiFlashlightLine, RiBarChartLine,
  RiShieldCheckLine, RiSettings4Line, RiGlobalLine,
  RiBookOpenLine, RiTeamLine,
} from 'react-icons/ri'

const timeline = [
  { year: '1991', title: 'FSW Invented', desc: 'The Welding Institute (TWI), Cambridge, UK patents the Friction Stir Welding process.' },
  { year: '1996', title: 'First Industrial Use', desc: 'Boeing and Airbus adopt FSW for lightweight aerospace panel manufacturing.' },
  { year: '2004', title: 'Automotive Adoption', desc: 'Ford, General Motors begin using FSW for body panels and structural components.' },
  { year: '2012', title: 'NASA Space Launch', desc: 'NASA uses FSW in the Space Launch System and External Tank of the Space Shuttle.' },
  { year: '2021', title: 'ML Integration', desc: 'Research begins applying machine learning to optimize FSW parameters from experimental data.' },
  { year: '2025', title: 'This Platform', desc: 'AI-powered FSW parameter optimization with trained ANN, RF, DT, and LR models.' },
]

const parameters = [
  { label: 'Tool Rotational Speed', range: '400–1600 RPM', effect: 'Controls frictional heat generation and plasticized zone size', icon: RiSettings4Line, color: 'text-primary-400' },
  { label: 'Welding Speed', range: '20–100 mm/min', effect: 'Determines heat input per unit length and material flow rate', icon: RiFlashlightLine, color: 'text-accent-400' },
  { label: 'Axial (Plunge) Force', range: '5–15 kN', effect: 'Ensures tool contact and consolidation of the plasticized material', icon: RiShieldCheckLine, color: 'text-yellow-400' },
  { label: 'Tool Shoulder Diameter', range: '15–25 mm', effect: 'Defines the frictional contact area and dominant heat generation region', icon: RiToolsLine, color: 'text-purple-400' },
  { label: 'Tool Pin Geometry', range: 'Cylindrical / Tapered / Threaded', effect: 'Influences material flow, mixing, and weld nugget formation', icon: RiBarChartLine, color: 'text-red-400' },
]

const applications = [
  { sector: 'Aerospace', icon: <i className="fa-solid fa-plane"></i>, uses: ['Fuselage panels', 'Wing structures', 'Cryogenic tanks', 'Internal frame joints'], materials: 'AA2024, AA7075, AA2219' },
  { sector: 'Automotive', icon: <i className="fa-solid fa-car"></i>, uses: ['Door beams', 'Wheel rims', 'Chassis members', 'Battery enclosures (EV)'], materials: 'AA5083, AA6061, AA7075' },
  { sector: 'Marine', icon: <i className="fa-solid fa-sailboat"></i>, uses: ['Ship hull panels', 'Marine decking', 'Submarine structures'], materials: 'AA5083, AA5086' },
  { sector: 'Rail Transport', icon: <i className="fa-solid fa-train-subway"></i>, uses: ['Train carriage panels', 'Bogie frames', 'Floor structures'], materials: 'AA6061, AA7020' },
]

const team = [
  { name: 'Final Year Project', role: 'B.E. Mechanical Engineering', inst: 'Department of Mechanical Engineering' },
]

export default function About() {
  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="section-label mb-3">Research Project</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Development of Machine Learning Models<br />
            <span className="gradient-text text-3xl md:text-4xl">to Optimize FSW Process Parameters</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            A comprehensive research study applying supervised machine learning algorithms to predict
            and optimize weld quality in Friction Stir Welding — targeting tensile strength and joint efficiency.
          </p>
        </motion.div>

        {/* What is FSW — deep dive */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                <RiToolsLine className="text-primary-400 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white">The FSW Process</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Friction Stir Welding is a <span className="text-slate-200 font-medium">solid-state joining process</span> where a
              non-consumable rotating tool with a specially designed pin and shoulder is plunged into the interface
              between two clamped workpieces, and traversed along the joint line.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              The frictional heat generated between the tool shoulder and the workpiece causes the material to
              <span className="text-slate-200 font-medium"> soften without melting</span>, allowing plastic
              deformation and material mixing. As the tool advances, a solid-state weld is formed behind it.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unlike fusion welding, FSW produces <span className="text-slate-200 font-medium">no solidification defects</span>,
              porosity, or hot cracking — resulting in welds that can achieve up to 90–95% of the parent material's mechanical properties.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <RiBarChartLine className="text-accent-400 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white">Why ML Optimization?</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Traditional FSW parameter selection relies on <span className="text-slate-200 font-medium">empirical trial-and-error</span> experiments,
              which are time-consuming, material-wasteful, and expensive. Each combination of rotational speed,
              welding speed, axial force, and tool geometry requires separate physical testing.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Machine learning models trained on experimental datasets can
              <span className="text-slate-200 font-medium"> predict weld quality instantaneously</span>, map the entire
              parameter space, and identify optimal configurations without any physical experimentation.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: 'Time Saved', value: '~80%', color: 'text-primary-400' },
                { label: 'Cost Reduction', value: '~65%', color: 'text-accent-400' },
                { label: 'Accuracy', value: '98.2%', color: 'text-yellow-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Process Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <p className="section-label mb-2">Input Variables</p>
            <h2 className="text-3xl font-bold text-white">Key FSW Process Parameters</h2>
          </div>
          <div className="space-y-3">
            {parameters.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="glass-card p-5 flex flex-wrap md:flex-nowrap items-center gap-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0`}>
                  <p.icon className={`text-xl ${p.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">{p.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{p.effect}</p>
                </div>
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 flex-shrink-0 border border-white/10">
                  {p.range}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <p className="section-label mb-2">History</p>
            <h2 className="text-3xl font-bold text-white">FSW Technology Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
            <div className="space-y-5">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-16 pt-4 text-right hidden md:block">
                    <span className="text-xs font-mono font-bold text-primary-400">{t.year}</span>
                  </div>
                  <div className="hidden md:flex flex-col items-center pt-4">
                    <div className="w-3 h-3 rounded-full bg-primary-500 ring-4 ring-primary-500/20 z-10" />
                  </div>
                  <div className="glass-card p-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-primary-400 md:hidden">{t.year}</span>
                      <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <p className="section-label mb-2">Sectors</p>
            <h2 className="text-3xl font-bold text-white">Industrial Applications</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {applications.map((a, i) => (
              <motion.div
                key={a.sector}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <span className="text-3xl">{a.icon}</span>
                <h3 className="text-white font-bold mt-3 mb-2">{a.sector}</h3>
                <ul className="space-y-1 mb-3">
                  {a.uses.map(u => (
                    <li key={u} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      {u}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-slate-600 font-mono border-t border-white/5 pt-2">{a.materials}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center gradient-border"
        >
          <RiBookOpenLine className="text-4xl text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">About This Project</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
            This platform is the output of a final-year engineering research project focused on applying
            supervised machine learning — ANN, Random Forest, Decision Tree, and Linear Regression —
            to predict and optimize FSW process parameters. The models were trained and validated
            on experimental welding data from laboratory trials.
          </p>
          <div className="flex justify-center gap-6 flex-wrap text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><RiGlobalLine className="text-primary-400" /> Friction Stir Welding</span>
            <span className="flex items-center gap-1.5"><RiBarChartLine className="text-primary-400" /> Machine Learning</span>
            <span className="flex items-center gap-1.5"><RiTeamLine className="text-primary-400" /> Final Year Project</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
