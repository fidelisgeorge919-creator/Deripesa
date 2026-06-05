import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Wallet {
  id: string
  balance: number
  bonusBalance: number
  earnings: number
  referralEarnings: number
}

export interface WalletState {
  wallet: Wallet | null
  isLoading: boolean
  error: string | null
}

const initialState: WalletState = {
  wallet: null,
  isLoading: false,
  error: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallet = action.payload
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.wallet) {
        state.wallet.balance = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setWallet, updateBalance, setLoading, setError } = walletSlice.actions
export default walletSlice.reducer
