import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import walletReducer from './slices/walletSlice'
import notificationReducer from './slices/notificationSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    notifications: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
