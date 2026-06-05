import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, hover = true, className = '', ...props }) => {
  return (
    <div
      className={`
        glass rounded-2xl p-6
        ${hover ? 'hover:border-primary-500/50 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
