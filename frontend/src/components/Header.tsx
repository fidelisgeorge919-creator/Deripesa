import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearAuth } from '../store/slices/authSlice'
import { useAuth } from '../hooks/useAuth'
import { Button } from './Button'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(clearAuth())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-primary-500/20">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white">
            D
          </div>
          <span className="font-bold text-xl hidden sm:inline gradient-text">Deripesa</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-muted-text hover:text-light-text transition-colors">
                Dashboard
              </Link>
              <Link to="/referrals" className="text-muted-text hover:text-light-text transition-colors">
                Referrals
              </Link>
              <Link to="/tasks" className="text-muted-text hover:text-light-text transition-colors">
                Tasks
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm">{user?.firstName}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-light-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 glass border-b border-primary-500/20 p-4 md:hidden">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link to="/dashboard" className="block px-4 py-2 text-muted-text hover:text-light-text">
                  Dashboard
                </Link>
                <Link to="/referrals" className="block px-4 py-2 text-muted-text hover:text-light-text">
                  Referrals
                </Link>
                <Link to="/tasks" className="block px-4 py-2 text-muted-text hover:text-light-text">
                  Tasks
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block px-4 py-2 text-muted-text hover:text-light-text">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 text-muted-text hover:text-light-text">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
