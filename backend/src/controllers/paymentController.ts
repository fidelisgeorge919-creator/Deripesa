import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, asyncHandler, sendSuccess } from '../utils/errors'
import { generateRandomToken } from '../utils/auth'
import Stripe from 'stripe'
import axios from 'axios'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export const initiateDeposit = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { amount, paymentMethod } = req.body

  if (!amount || !paymentMethod) {
    throw new AppError('Amount and payment method required', 400)
  }

  if (amount < 1) {
    throw new AppError('Minimum deposit amount is $1', 400)
  }

  // Create deposit record
  const deposit = await prisma.deposit.create({
    data: {
      userId: req.user.id,
      amount,
      paymentMethod,
      paymentProvider: paymentMethod.toUpperCase(),
      reference: generateRandomToken(16),
      status: 'PENDING',
    },
  })

  let paymentData: any = { depositId: deposit.id }

  // Handle different payment methods
  if (paymentMethod === 'STRIPE') {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Deripesa Account Deposit',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/deposit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/deposit/cancel`,
      customer_email: req.user.email,
    })

    await prisma.deposit.update({
      where: { id: deposit.id },
      data: { stripePaymentId: session.id },
    })

    paymentData.checkoutUrl = session.url
  } else if (paymentMethod === 'MPESA') {
    // M-Pesa STK Push implementation
    try {
      const accessToken = await getMpesaAccessToken()
      const mpesaResponse = await initiateMpesaSTK(
        req.user.phone || '',
        amount,
        deposit.reference,
        accessToken
      )

      if (mpesaResponse.ResponseCode === '0') {
        await prisma.deposit.update({
          where: { id: deposit.id },
          data: { mpesaCheckoutId: mpesaResponse.CheckoutRequestID },
        })

        paymentData.checkoutRequestId = mpesaResponse.CheckoutRequestID
      }
    } catch (error) {
      throw new AppError('Failed to initiate M-Pesa payment', 500)
    }
  }

  sendSuccess(res, paymentData, 'Deposit initiated successfully')
})

export const verifyDeposit = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { sessionId, depositId } = req.body

  if (!depositId) {
    throw new AppError('Deposit ID required', 400)
  }

  const deposit = await prisma.deposit.findUnique({
    where: { id: depositId },
  })

  if (!deposit) {
    throw new AppError('Deposit not found', 404)
  }

  if (deposit.userId !== req.user.id) {
    throw new AppError('Unauthorized', 403)
  }

  let isVerified = false

  // Verify payment based on provider
  if (deposit.paymentProvider === 'STRIPE' && sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === 'paid') {
      isVerified = true
    }
  }

  if (isVerified) {
    // Update deposit and wallet
    await prisma.deposit.update({
      where: { id: deposit.id },
      data: { status: 'COMPLETED' },
    })

    await prisma.wallet.update({
      where: { userId: req.user.id },
      data: {
        balance: { increment: deposit.amount },
        totalDeposited: { increment: deposit.amount },
      },
    })

    // Create transaction
    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'DEPOSIT',
        amount: deposit.amount,
        description: `Deposit via ${deposit.paymentProvider}`,
        status: 'COMPLETED',
      },
    })
  }

  sendSuccess(res, { verified: isVerified }, isVerified ? 'Deposit verified' : 'Deposit verification failed')
})

export const initiateWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { amount, paymentMethod, bankName, accountNumber, accountHolder } = req.body

  if (!amount || !paymentMethod) {
    throw new AppError('Amount and payment method required', 400)
  }

  if (amount < 10) {
    throw new AppError('Minimum withdrawal amount is $10', 400)
  }

  // Check wallet balance
  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.id },
  })

  if (!wallet || wallet.balance < amount) {
    throw new AppError('Insufficient balance', 400)
  }

  // Create withdrawal record
  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId: req.user.id,
      amount,
      paymentMethod,
      bankName,
      accountNumber,
      accountHolder,
      status: 'PENDING',
    },
  })

  // Deduct from wallet temporarily
  await prisma.wallet.update({
    where: { userId: req.user.id },
    data: { balance: { decrement: amount } },
  })

  sendSuccess(res, {
    withdrawalId: withdrawal.id,
    status: 'PENDING',
    amount,
  }, 'Withdrawal request submitted')
})

// Helper functions
const getMpesaAccessToken = async (): Promise<string> => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  return response.data.access_token
}

const initiateMpesaSTK = async (
  phone: string,
  amount: number,
  reference: string,
  accessToken: string
): Promise<any> => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
  const password = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}${process.env.MPESA_CONSUMER_SECRET}${timestamp}`
  ).toString('base64')

  const response = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.floor(amount),
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BACKEND_URL}/api/payments/mpesa-callback`,
      AccountReference: reference,
      TransactionDesc: 'Deripesa Deposit',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return response.data
}
