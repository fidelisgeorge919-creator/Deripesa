import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let apiClient: AxiosInstance | null = null

export const getApiClient = (): AxiosInstance => {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor
    apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  return apiClient
}

// Auth API
export const authAPI = {
  register: (data: any) => getApiClient().post('/auth/register', data),
  login: (data: any) => getApiClient().post('/auth/login', data),
  getProfile: () => getApiClient().get('/auth/profile'),
  updateProfile: (data: any) => getApiClient().put('/auth/profile', data),
}

// Wallet API
export const walletAPI = {
  getBalance: () => getApiClient().get('/wallet/balance'),
  getTransactions: (params?: any) => getApiClient().get('/wallet/transactions', { params }),
  getEarnings: () => getApiClient().get('/wallet/earnings'),
  getDepositHistory: (params?: any) => getApiClient().get('/wallet/deposits', { params }),
  getWithdrawalHistory: (params?: any) => getApiClient().get('/wallet/withdrawals', { params }),
}

// Referral API
export const referralAPI = {
  getReferrals: (params?: any) => getApiClient().get('/referrals/my-referrals', { params }),
  getStats: () => getApiClient().get('/referrals/stats'),
  getLink: () => getApiClient().get('/referrals/link'),
  getLeaderboard: (params?: any) => getApiClient().get('/referrals/leaderboard', { params }),
  claimReward: () => getApiClient().post('/referrals/claim-reward', {}),
}

// Task API
export const taskAPI = {
  getTasks: (params?: any) => getApiClient().get('/tasks', { params }),
  getTaskById: (id: string) => getApiClient().get(`/tasks/${id}`),
  completeTask: (data: any) => getApiClient().post('/tasks/complete', data),
  getCompletedTasks: (params?: any) => getApiClient().get('/tasks/completed', { params }),
}

// Payment API
export const paymentAPI = {
  initiateDeposit: (data: any) => getApiClient().post('/payments/deposit', data),
  verifyDeposit: (data: any) => getApiClient().post('/payments/verify-deposit', data),
  initiateWithdrawal: (data: any) => getApiClient().post('/payments/withdrawal', data),
}

// Admin API
export const adminAPI = {
  getDashboard: () => getApiClient().get('/admin/dashboard'),
  getUsers: (params?: any) => getApiClient().get('/admin/users', { params }),
  suspendUser: (userId: string) => getApiClient().post(`/admin/users/${userId}/suspend`, {}),
  activateUser: (userId: string) => getApiClient().post(`/admin/users/${userId}/activate`, {}),
  getPendingWithdrawals: (params?: any) => getApiClient().get('/admin/withdrawals/pending', { params }),
  approveWithdrawal: (withdrawalId: string) => getApiClient().post(`/admin/withdrawals/${withdrawalId}/approve`, {}),
  rejectWithdrawal: (withdrawalId: string, data: any) =>
    getApiClient().post(`/admin/withdrawals/${withdrawalId}/reject`, data),
}
