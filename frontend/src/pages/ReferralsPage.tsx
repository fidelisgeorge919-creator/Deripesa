import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { StatBox } from '../components/StatBox'
import { useQuery } from '@tanstack/react-query'
import { referralAPI } from '../services/api'
import { copyToClipboard, formatCurrency } from '../utils/helpers'
import { useNotification } from '../hooks/useNotification'

const ReferralsPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { success } = useNotification()
  
  const { data: statsData } = useQuery({
    queryKey: ['referral-stats'],
    queryFn: () => referralAPI.getStats(),
  })

  const { data: linkData } = useQuery({
    queryKey: ['referral-link'],
    queryFn: () => referralAPI.getLink(),
  })

  const { data: referralsData } = useQuery({
    queryKey: ['my-referrals'],
    queryFn: () => referralAPI.getReferrals(),
  })

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const stats = statsData?.data?.data
  const link = linkData?.data?.data
  const referrals = referralsData?.data?.data?.referrals || []

  const handleCopyLink = async () => {
    if (link?.referralLink) {
      const copied = await copyToClipboard(link.referralLink)
      if (copied) {
        success('Referral link copied!')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker-bg via-dark-bg to-darker-bg">
      <Header />

      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Referral Program</h1>
          <p className="text-muted-text">Earn 10% commission from your referrals</p>
        </motion.div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatBox
            label="Total Referrals"
            value={stats?.totalReferrals || 0}
            icon="👥"
            color="primary"
          />
          <StatBox
            label="Level 1 Referrals"
            value={stats?.level1Referrals || 0}
            icon="📍"
            color="secondary"
          />
          <StatBox
            label="Total Commission"
            value={formatCurrency(stats?.totalCommission || 0)}
            icon="💵"
            color="accent"
          />
          <StatBox
            label="Commission Earned"
            value={formatCurrency(stats?.level1Commission || 0)}
            icon="📈"
            color="primary"
          />
        </div>

        {/* Referral Link */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-12">
          <Card className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
            <h3 className="text-2xl font-bold mb-4">Your Referral Link</h3>
            <div className="flex gap-4 flex-col sm:flex-row">
              <input
                type="text"
                value={link?.referralLink || ''}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg bg-dark-bg/50 border border-primary-500/20 text-light-text font-mono text-sm"
              />
              <Button size="lg" onClick={handleCopyLink}>
                Copy Link
              </Button>
            </div>
            <p className="text-muted-text text-sm mt-4">
              Share this link with your friends and earn 10% from their activities
            </p>
          </Card>
        </motion.div>

        {/* Your Referrals */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <Card>
            <h3 className="text-2xl font-bold mb-6">Your Referrals</h3>
            {referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral: any, i: number) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex justify-between items-center py-4 border-b border-primary-500/10 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">
                        {referral.firstName} {referral.lastName}
                      </p>
                      <p className="text-muted-text text-sm">{referral.email}</p>
                    </div>
                    <p className="text-primary-400 font-semibold">Joined {new Date(referral.createdAt).toLocaleDateString()}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-text">No referrals yet. Share your link to get started!</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ReferralsPage
