import React from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  subtitle?: string
  cta?: { label: string; href: string }
}

export const HeroSection: React.FC<HeroProps> = ({ title, subtitle, cta }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10 container text-center max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-text mb-12 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {cta && (
          <motion.a
            href={cta.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/50"
          >
            {cta.label}
          </motion.a>
        )}
      </div>
    </section>
  )
}
