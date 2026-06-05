# Deripesa Production-Ready Platform

A comprehensive, full-stack earning platform built with modern technologies. Earn through referrals, tasks, and multiple revenue streams.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Deripesa
```

2. Setup environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Fill in your API keys and credentials

# Frontend
cp frontend/.env.example frontend/.env
```

3. Run with Docker Compose
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: localhost:5432
- Redis: localhost:6379

### Manual Installation

**Backend:**
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
Deripesa/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & error handling
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration
│   │   └── index.ts         # Main server file
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Initial data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store & slices
│   │   ├── services/       # API integration
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   ├── styles/         # Global styles
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json
└── docker-compose.yml
```

## 🔐 Features

### Authentication
- User registration with email verification
- Secure JWT-based authentication
- Password encryption with bcryptjs
- Referral code registration
- Two-factor authentication ready

### Wallet System
- Real-time balance management
- Multiple deposit methods (Stripe, PayPal, M-Pesa, Flutterwave, Crypto)
- Withdrawal management with admin approval
- Transaction history and reporting
- Bonus balance tracking

### Referral System
- Unique referral codes per user
- Multi-level commission structure
- Leaderboard system
- Real-time referral tracking
- Claim rewards functionality

### Task System
- Multiple task types (Videos, Surveys, Articles, Offers)
- Daily task completion tracking
- Instant reward distribution
- Task categorization
- Performance analytics

### Admin Panel
- Comprehensive dashboard
- User management
- Withdrawal approval system
- Deposit monitoring
- Admin action logging

### Payment Integration
- **Stripe**: Credit card payments
- **PayPal**: Direct PayPal integration
- **M-Pesa**: Mobile money support
- **Flutterwave**: Multi-currency support
- **Crypto**: Blockchain payments

### Security
- JWT authentication
- Password encryption
- Rate limiting
- CSRF protection ready
- XSS prevention
- SQL injection prevention
- Secure session management

## 🎨 UI/UX Features

- Glassmorphism design
- Particle background animations
- Smooth page transitions
- Responsive design
- Dark/Light theme ready
- Premium animations
- Interactive components

## 🚀 Deployment

```bash
docker-compose up -d
```

## 📝 Environment Variables

See `.env.example` files in backend and frontend directories.

## 💬 Support

For support, please contact: support@deripesa.com

---

**Built with ❤️ for modern earners**