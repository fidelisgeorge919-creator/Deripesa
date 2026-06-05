import { useQuery } from '@tanstack/react-query'
import { walletAPI } from '../services/api'

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletAPI.getBalance(),
  })
}

export const useTransactions = (page: number = 1) => {
  return useQuery({
    queryKey: ['transactions', page],
    queryFn: () => walletAPI.getTransactions({ page, limit: 20 }),
  })
}

export const useEarnings = () => {
  return useQuery({
    queryKey: ['earnings'],
    queryFn: () => walletAPI.getEarnings(),
  })
}
