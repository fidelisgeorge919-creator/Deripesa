import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api'
import { setUser, setToken } from '../store/slices/authSlice'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useNotification } from '../hooks/useNotification'
import { validateEmail, validatePassword } from '../utils/helpers'
import { Header } from '../components/Header'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { success, error } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
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

    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Valid email is required'
    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase and number'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      error('Please fix the errors above')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode || undefined,
      })

      const { user, token } = response.data.data

      dispatch(setUser(user))
      dispatch(setToken(token))

      success('Account created successfully!')
      navigate('/dashboard')
    } catch (err: any) {
      error(err.response?.data?.message || 'Registration failed')
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-muted-text mb-6">Join thousands of earners on Deripesa</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Doe"
                />
              </div>

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

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
              />

              <Input
                label="Referral Code (Optional)"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="REF123456"
              />

              <Button type="submit" size="lg" className="w-full mt-6" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            <p className="text-center text-muted-text mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
