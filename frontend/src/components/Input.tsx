import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-light-text">{label}</label>}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-dark-bg/50 border border-primary-500/20
          text-light-text placeholder:text-muted-text
          focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20
          transition-all duration-300
          ${error ? 'border-red-500/50 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-muted-text text-sm mt-1">{helperText}</p>}
    </div>
  )
}
