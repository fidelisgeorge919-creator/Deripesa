import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { addNotification, removeNotification } from '../store/slices/notificationSlice'
import { AppDispatch } from '../store'

export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>()

  const notify = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
      const id = dispatch(
        addNotification({
          message,
          type,
          duration,
        })
      )

      if (duration > 0) {
        setTimeout(() => {
          dispatch(removeNotification(message))
        }, duration)
      }
    },
    [dispatch]
  )

  return {
    success: (message: string) => notify(message, 'success'),
    error: (message: string) => notify(message, 'error'),
    info: (message: string) => notify(message, 'info'),
    warning: (message: string) => notify(message, 'warning'),
  }
}
