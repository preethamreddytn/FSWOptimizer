import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { loginAPI, signupAPI } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fsw_user')) || null
    } catch {
      return null
    }
  })

  const login = useCallback(async (email, password) => {
    try {
      const res = await loginAPI(email, password)
      const userData = res.user
      localStorage.setItem('fsw_user', JSON.stringify(userData))
      setUser(userData)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Invalid credentials' }
    }
  }, [])

  const loginGuest = useCallback(() => {
    const guestData = { id: 'guest', name: 'Guest User', email: 'guest@fsw.com', token: 'guest-token' }
    localStorage.setItem('fsw_user', JSON.stringify(guestData))
    setUser(guestData)
    toast.success('Logged in as Guest')
    return { ok: true }
  }, [])

  const signup = useCallback(async (name, email, password) => {
    try {
      const res = await signupAPI(name, email, password)
      const userData = res.user
      localStorage.setItem('fsw_user', JSON.stringify(userData))
      setUser(userData)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Signup failed' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fsw_user')
    setUser(null)
    toast.success('Signed out successfully')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, loginGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
