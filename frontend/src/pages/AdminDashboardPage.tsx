import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { StatBox } from '../components/StatBox'
import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../services/api'
import { formatCurrency, formatDate } from '../utils/helpers'

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data: dashboardData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard(),
  })

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    navigate('/dashboard')
    return null
  }

  const stats = dashboardData?.data?.data?.stats || {}
  const recentUsers = dashboardData?.data?.data?.recentUsers || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker-bg via-dark-bg to-darker-bg">
      <Header />

      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-text">Platform analytics and management</p>
        </motion.div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatBox
            label="Total Users"
            value={stats.totalUsers || 0}
            icon="👥"
            color="primary"
          />
          <StatBox
            label="Total Transactions"
            value={stats.totalTransactions || 0}
            icon="💳"
            color="secondary"
          />
          <StatBox
            label="Total Deposits"
            value={formatCurrency(stats.totalDeposits || 0)}
            icon="💵"
            color="accent"
          />
          <StatBox
            label="Pending Withdrawals"
            value={stats.pendingWithdrawals || 0}
            icon="⏳"
            color="primary"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/10">
              <h3 className="text-xl font-bold mb-4">Total Deposits</h3>
              <p className="text-4xl font-bold gradient-text">{formatCurrency(stats.totalDeposits || 0)}</p>
              <p className="text-muted-text text-sm mt-2">Completed deposits</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/10">
              <h3 className="text-xl font-bold mb-4">Total Withdrawals</h3>
              <p className="text-4xl font-bold text-secondary-400">{formatCurrency(stats.totalWithdrawals || 0)}</p>
              <p className="text-muted-text text-sm mt-2">Completed withdrawals</p>
            </Card>
          </motion.div>
        </div>

        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <Card>
            <h3 className="text-xl font-bold mb-6">Recent User Registrations</h3>
            <div className="space-y-4">
              {recentUsers.map((user: any, i: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center py-4 border-b border-primary-500/10 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-text text-sm">{user.email}</p>
                  </div>
                  <p className="text-muted-text text-sm">{formatDate(user.createdAt)}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
