import { Link } from 'react-router-dom'
import { RiCpuLine, RiGithubFill, RiTwitterXLine, RiLinkedinBoxLine } from 'react-icons/ri'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#291a29]/80 backdrop-blur-md mt-auto">
      <div className="page-container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-[#ff0053] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,83,0.4)]">
                <RiCpuLine className="text-white text-lg" />
              </div>
              <span className="font-bold text-white tracking-tight">
                FSW<span className="text-[#ff0053] font-medium">-ML</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm font-light leading-relaxed">
              Applying machine learning to optimize solid-state welding processes. 
              Eliminate destructive testing with millimeter-accurate AI parameter inference.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/models" className="text-slate-400 hover:text-white transition-colors">ML Models</Link></li>
              <li><Link to="/insights" className="text-slate-400 hover:text-white transition-colors">Data Insights</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">Methodology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <RiGithubFill size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <RiTwitterXLine size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <RiLinkedinBoxLine size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm font-light">
            &copy; {currentYear} FSW-ML Optimizer. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-light">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-light">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
