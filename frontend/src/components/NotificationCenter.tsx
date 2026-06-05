import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { removeNotification } from '../store/slices/notificationSlice'

export const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.notifications)

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-300'
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-300'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
      case 'info':
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300'
    }
  }

  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            glass ${getTypeStyles(notification.type)}
            border px-4 py-3 rounded-lg
            animate-slide-in shadow-lg max-w-sm
          `}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="ml-4 text-lg hover:opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
