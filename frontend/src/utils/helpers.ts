export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals)
}

export const truncateString = (str: string, length: number = 30): string => {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const generateReferralLink = (code: string): string => {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
  return `${baseUrl}/register?ref=${code}`
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    return false
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}
