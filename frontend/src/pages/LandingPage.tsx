import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { HeroSection } from '../components/HeroSection'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { StatBox } from '../components/StatBox'
import { motion } from 'framer-motion'
import { ParticleBackground } from '../components/ParticleBackground'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: '💰',
      title: 'Multiple Earning Opportunities',
      description: 'Earn through referrals, tasks, and daily check-ins',
    },
    {
      icon: '👥',
      title: 'Powerful Referral System',
      description: 'Build your network and earn unlimited commission',
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track your earnings and performance 24/7',
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Multiple payment methods with bank-grade security',
    },
  ]

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Total Payouts', value: '$2.5M+' },
    { label: 'Avg Daily Earnings', value: '$45' },
    { label: 'Commission Rate', value: '10%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker-bg via-dark-bg to-darker-bg">
      <ParticleBackground />
      <Header />

      {/* Hero Section */}
      <HeroSection
        title="Earn & Grow Your Wealth"
        subtitle="The ultimate platform for earning through multiple revenue streams. Referrals, tasks, and unlimited potential."
        cta={{ label: 'Start Earning Today', href: '/register' }}
      />

      {/* Stats Section */}
      <section className="py-20 container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</h3>
              <p className="text-muted-text">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-4">Why Choose Deripesa?</h2>
          <p className="text-muted-text text-lg max-w-2xl mx-auto">
            Experience the most advanced earning platform with industry-leading features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:border-secondary-500/50">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-text text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="glass bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-text mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning through Deripesa
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              Sign Up Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
              Already a Member?
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-500/20 py-8 mt-20">
        <div className="container text-center text-muted-text text-sm">
          <p>&copy; 2024 Deripesa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
