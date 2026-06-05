import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.adminLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.reward.deleteMany()
  await prisma.userTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.withdrawal.deleteMany()
  await prisma.deposit.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.referralStat.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.user.deleteMany()
  await prisma.systemSetting.deleteMany()

  // Create admin user
  const hashedPassword = await bcryptjs.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@deripesa.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
      referralCode: 'ADMIN001',
    },
  })

  // Create admin wallet
  await prisma.wallet.create({
    data: {
      userId: admin.id,
      balance: 10000,
    },
  })

  // Create admin referral stats
  await prisma.referralStat.create({
    data: {
      userId: admin.id,
    },
  })

  // Create sample users
  const users = []
  for (let i = 1; i <= 5; i++) {
    const hashedPass = await bcryptjs.hash('user123', 10)
    const user = await prisma.user.create({
      data: {
        email: `user${i}@deripesa.com`,
        password: hashedPass,
        firstName: `User${i}`,
        lastName: `Test`,
        username: `user${i}`,
        role: 'USER',
        emailVerified: true,
        referralCode: `REF${i}${Math.random().toString(36).substring(7).toUpperCase()}`,
        referredById: i > 1 ? users[0].id : undefined,
      },
    })

    // Create wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 500 + i * 100,
        earnings: i * 50,
      },
    })

    // Create referral stats
    await prisma.referralStat.create({
      data: {
        userId: user.id,
        totalReferrals: i > 1 ? 2 : 0,
      },
    })

    users.push(user)
  }

  // Create sample tasks
  const tasks = []
  const taskTypes = ['VIDEO', 'SURVEY', 'ARTICLE', 'OFFER', 'CHECKIN']
  for (let i = 1; i <= 10; i++) {
    const task = await prisma.task.create({
      data: {
        title: `Task ${i}`,
        description: `Complete this task to earn rewards`,
        type: taskTypes[i % taskTypes.length],
        category: i % 2 === 0 ? 'Entertainment' : 'Education',
        reward: 5 + i * 2,
        status: 'ACTIVE',
      },
    })
    tasks.push(task)
  }

  // Create sample system settings
  await prisma.systemSetting.create({
    data: {
      key: 'referral_commission_l1',
      value: { rate: 0.1, percentage: 10 },
      description: 'Level 1 referral commission rate',
    },
  })

  await prisma.systemSetting.create({
    data: {
      key: 'referral_commission_l2',
      value: { rate: 0.05, percentage: 5 },
      description: 'Level 2 referral commission rate',
    },
  })

  await prisma.systemSetting.create({
    data: {
      key: 'referral_commission_l3',
      value: { rate: 0.02, percentage: 2 },
      description: 'Level 3 referral commission rate',
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
