import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { RiCpuLine, RiMailLine, RiLockLine, RiUserLine, RiArrowRightLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, signup, loginGuest } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await login(data.email, data.password)
      } else {
        res = await signup(data.name, data.email, data.password)
      }
      if (res.ok) {
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
        navigate('/dashboard')
      } else {
        toast.error(res.error || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => { setMode(m); reset() }

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <RiCpuLine className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-white">FSW<span className="text-white/50">-ML</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {mode === 'login' ? 'Access ML predictions and analytics' : 'Start optimizing FSW parameters'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="glass-tab-container mb-6">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`glass-tab ${mode === m ? 'active' : ''}`}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="signup-name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Dr. John Smith"
                  className="input-field pl-9"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="auth-email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="engineer@lab.com"
                className="input-field pl-9"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="auth-password"
                type={showPwd ? 'text' : 'password'}
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                placeholder="••••••••"
                className="input-field pl-9 pr-10"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <RiArrowRightLine />
              </>
            )}
          </button>

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => {
                loginGuest();
                navigate('/dashboard');
              }}
              className="btn-secondary w-full justify-center mt-3 text-sm tracking-wide"
            >
              Sign in as Guest
            </button>
          )}
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
            className="text-white hover:text-[#ff0053] font-semibold underline transition-colors">
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
