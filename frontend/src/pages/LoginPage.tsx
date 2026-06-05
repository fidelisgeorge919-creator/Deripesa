import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api'
import { setUser, setToken } from '../store/slices/authSlice'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useNotification } from '../hooks/useNotification'
import { validateEmail } from '../utils/helpers'
import { Header } from '../components/Header'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { success, error } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Valid email is required'
    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      error('Please fill all fields correctly')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.login(formData)

      const { user, token } = response.data.data

      dispatch(setUser(user))
      dispatch(setToken(token))

      success('Login successful!')

      if (user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker-bg via-dark-bg to-darker-bg">
      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 border border-primary-500/20">
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-muted-text mb-6">Log in to your Deripesa account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
              />

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-darker-bg text-muted-text">Or</span>
              </div>
            </div>

            <p className="text-center text-muted-text">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
