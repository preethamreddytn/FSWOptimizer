import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiBarChartGroupedLine,
  RiLineChartLine, RiInformationLine, RiLogoutBoxLine,
  RiMenuLine, RiCloseLine, RiCpuLine,
} from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { to: '/models', label: 'Models', icon: RiBarChartGroupedLine },
  { to: '/insights', label: 'Insights', icon: RiLineChartLine },
  { to: '/about', label: 'About', icon: RiInformationLine },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'py-3'
            : 'py-5'
        )}
      >
        <div className="page-container relative z-20">
          <div className={clsx(
            "flex items-center justify-between px-6 transition-all duration-500 mx-auto",
            scrolled ? 'h-14 rounded-full bg-white/5 backdrop-blur-[30px] border border-white/10 shadow-lg max-w-4xl' : 'h-16 max-w-7xl'
          )}
          style={{ boxShadow: scrolled ? 'inset 0 1px 1px rgba(255,255,255,0.1)' : 'none' }}>
            
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#ff0053] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,83,0.4)] group-hover:scale-105 transition-transform duration-300">
                <RiCpuLine className="text-white text-lg" />
              </div>
              <span className="font-bold text-white tracking-tight">
                FSW<span className="text-[#ff0053] font-medium hidden sm:inline">-ML</span>
              </span>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 rounded-full text-sm transition-all duration-300 relative',
                      isActive
                        ? 'text-white font-semibold bg-white/10 shadow-inner border border-white/10'
                        : 'text-slate-400 font-medium hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-xs text-slate-400 hidden lg:inline-block">
                    Welcome, <span className="text-white capitalize font-semibold">{user.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white hover:text-[#ff0053] hover:bg-[#ff0053]/10 transition-all duration-300 bg-white/5 border border-white/10 shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#ff0053] hover:bg-[#e6004b] transition-all duration-300 shadow-[0_0_15px_rgba(255,0,83,0.4)] border border-transparent"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu btn */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="fixed inset-x-4 top-24 z-40 bg-[#291a29]/90 backdrop-blur-[30px] border border-white/10 rounded-3xl md:hidden overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-4 rounded-2xl text-sm transition-all duration-200',
                      isActive ? 'text-white font-bold bg-white/10 shadow-sm' : 'text-slate-400 font-medium hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <Icon className="text-lg opacity-70" />
                  {label}
                </NavLink>
              ))}
              
              <div className="h-px bg-slate-200 my-2 mx-4" />
              
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-sm text-red-600 hover:bg-red-50 font-medium transition-all"
                >
                  <RiLogoutBoxLine className="text-lg opacity-70" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center px-4 py-4 mt-2 rounded-2xl text-sm font-bold text-white bg-slate-900"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
