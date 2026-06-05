import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 hover:shadow-lg hover:shadow-secondary-500/50',
    outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
