import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useQuery, useMutation } from '@tanstack/react-query'
import { taskAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'
import { useNotification } from '../hooks/useNotification'

const TasksPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { success, error } = useNotification()

  const { data: tasksData, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskAPI.getTasks(),
  })

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => taskAPI.completeTask({ taskId }),
    onSuccess: () => {
      success('Task completed successfully!')
      refetch()
    },
    onError: (err: any) => {
      error(err.response?.data?.message || 'Failed to complete task')
    },
  })

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const tasks = tasksData?.data?.data?.tasks || []

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return '🎥'
      case 'SURVEY':
        return '📋'
      case 'ARTICLE':
        return '📚'
      case 'OFFER':
        return '🎁'
      case 'CHECKIN':
        return '✅'
      default:
        return '⭐'
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
          <h1 className="text-4xl font-bold gradient-text mb-2">Earning Tasks</h1>
          <p className="text-muted-text">Complete tasks and earn rewards instantly</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task: any, i: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:border-primary-500/50 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{getTaskIcon(task.type)}</div>
                  <span className="bg-primary-500/20 border border-primary-500/30 px-3 py-1 rounded-full text-xs font-semibold text-primary-400">
                    {task.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                <p className="text-muted-text text-sm mb-4 flex-1">{task.description}</p>

                <div className="flex justify-between items-center mb-4 pt-4 border-t border-primary-500/10">
                  <span className="text-muted-text text-sm">Reward</span>
                  <span className="text-lg font-bold text-green-400">{formatCurrency(task.reward)}</span>
                </div>

                <Button
                  size="sm"
                  className="w-full"
                  isLoading={completeMutation.isPending}
                  onClick={() => completeMutation.mutate(task.id)}
                >
                  Complete Task
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-text text-lg">No tasks available at the moment</p>
            <p className="text-muted-text">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TasksPage
