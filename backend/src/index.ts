import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import walletRoutes from './routes/walletRoutes'
import referralRoutes from './routes/referralRoutes'
import taskRoutes from './routes/taskRoutes'
import paymentRoutes from './routes/paymentRoutes'
import adminRoutes from './routes/adminRoutes'

// Load environment variables
dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})

const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/referrals', referralRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Socket.io real-time updates
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })

  // Real-time wallet updates
  socket.on('subscribe_wallet', (userId: string) => {
    socket.join(`wallet:${userId}`)
  })

  // Real-time notifications
  socket.on('subscribe_notifications', (userId: string) => {
    socket.join(`notifications:${userId}`)
  })
})

// Make io accessible to routes
app.set('io', io)

// Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export { app, io }
