import React from 'react'
import { motion } from 'framer-motion'

interface StatBoxProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: number
  color?: 'primary' | 'secondary' | 'accent'
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, icon, trend, color = 'primary' }) => {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/20 border-primary-500/30',
    secondary: 'from-secondary-500/20 to-secondary-600/20 border-secondary-500/30',
    accent: 'from-accent/20 to-secondary-500/20 border-accent/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`
        glass bg-gradient-to-br ${colorMap[color]}
        border rounded-2xl p-6
        hover:scale-105 transition-transform duration-300
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-text text-sm mb-2">{label}</p>
          <h3 className="text-3xl font-bold gradient-text">{value}</h3>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && <div className="text-4xl opacity-50">{icon}</div>}
      </div>
    </motion.div>
  )
}
