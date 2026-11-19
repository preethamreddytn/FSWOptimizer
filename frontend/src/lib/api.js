import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('fsw_user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

export const predictAPI = (params) => api.post('/predict', params)
export const loginAPI = (email, password) => api.post('/login', { email, password })
export const signupAPI = (name, email, password) => api.post('/signup', { name, email, password })
export const modelsAPI = () => api.get('/models')
export const insightsAPI = () => api.get('/insights')

export default api
