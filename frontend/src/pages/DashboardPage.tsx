import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { StatBox } from '../components/StatBox'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useWallet, useEarnings } from '../hooks/useWallet'
import { formatCurrency } from '../utils/helpers'

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { data: walletData } = useWallet()
  const { data: earningsData } = useEarnings()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const wallet = walletData?.data?.data
  const earnings = earningsData?.data?.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker-bg via-dark-bg to-darker-bg">
      <Header />

      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back!</h1>
          <p className="text-muted-text">Here's your earning summary</p>
        </motion.div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatBox
            label="Wallet Balance"
            value={formatCurrency(wallet?.balance || 0)}
            icon="💰"
            color="primary"
          />
          <StatBox
            label="Total Earnings"
            value={formatCurrency(earnings?.totalEarnings || 0)}
            icon="📈"
            color="secondary"
          />
          <StatBox
            label="Referral Earnings"
            value={formatCurrency(earnings?.referralEarnings || 0)}
            icon="👥"
            color="accent"
          />
          <StatBox
            label="Bonus Balance"
            value={formatCurrency(wallet?.bonusBalance || 0)}
            icon="🎁"
            color="secondary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <Card className="text-center hover:border-primary-500/50 cursor-pointer">
              <div className="text-5xl mb-4">💵</div>
              <h3 className="text-xl font-bold mb-2">Deposit Funds</h3>
              <p className="text-muted-text text-sm mb-4">Add money to your wallet</p>
              <Button variant="outline" size="sm" className="w-full">
                Deposit Now
              </Button>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center hover:border-secondary-500/50 cursor-pointer">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Complete Tasks</h3>
              <p className="text-muted-text text-sm mb-4">Earn rewards from tasks</p>
              <Button variant="outline" size="sm" className="w-full">
                View Tasks
              </Button>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center hover:border-accent/50 cursor-pointer">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
              <p className="text-muted-text text-sm mb-4">Get 10% commission</p>
              <Button variant="outline" size="sm" className="w-full">
                Get Link
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <Card>
            <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-primary-500/10 last:border-b-0">
                  <div>
                    <p className="font-medium">Task Reward</p>
                    <p className="text-muted-text text-sm">2 hours ago</p>
                  </div>
                  <p className="font-bold text-green-400">+$5.00</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
