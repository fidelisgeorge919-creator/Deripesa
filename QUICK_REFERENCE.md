# ⚡ DERIPESA - QUICK REFERENCE GUIDE

## 🚀 QUICK START (Choose One)

### Docker (Easiest)
```bash
cd Deripesa
docker-compose up -d
# Visit http://localhost:5173
```

### Manual
```bash
cd Deripesa
./install.sh          # Automated setup
npm run dev           # Start dev servers
```

### Production
```bash
# See DEPLOYMENT.md for AWS, Heroku, VPS, etc.
```

---

## 📂 IMPORTANT FILES BY USE CASE

### I Want to Modify...

**User Registration:**
- Backend: `backend/src/controllers/authController.ts` → `register()`
- Frontend: `frontend/src/pages/RegisterPage.tsx`
- Database: `backend/prisma/schema.prisma` → User model

**Login System:**
- Backend: `backend/src/controllers/authController.ts` → `login()`
- Frontend: `frontend/src/pages/LoginPage.tsx`
- Middleware: `backend/src/middleware/auth.ts`

**Wallet Display:**
- Backend: `backend/src/controllers/walletController.ts`
- Frontend: `frontend/src/pages/DashboardPage.tsx`
- Hook: `frontend/src/hooks/useWallet.ts`

**Referral System:**
- Backend: `backend/src/controllers/referralController.ts`
- Frontend: `frontend/src/pages/ReferralsPage.tsx`
- Database: `backend/prisma/schema.prisma` → ReferralStat

**Task System:**
- Backend: `backend/src/controllers/taskController.ts`
- Frontend: `frontend/src/pages/TasksPage.tsx`
- Database: `backend/prisma/schema.prisma` → Task, UserTask

**Payment Processing:**
- Backend: `backend/src/controllers/paymentController.ts`
- API: `frontend/src/services/api.ts` → paymentAPI

**Admin Panel:**
- Backend: `backend/src/controllers/adminController.ts`
- Frontend: `frontend/src/pages/AdminDashboardPage.tsx`
- Middleware: `backend/src/middleware/auth.ts` → adminMiddleware

**Styling/UI:**
- Globals: `frontend/src/styles/globals.css`
- Tailwind: `frontend/tailwind.config.js`
- Components: `frontend/src/components/`

**Database Schema:**
- File: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/`
- Seed: `backend/prisma/seed.ts`

---

## 🔧 COMMON COMMANDS

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database migrations
npx prisma migrate dev --name description
npx prisma migrate deploy
npx prisma db seed

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Rebuild images
docker-compose build --no-cache

# Access database
docker-compose exec db psql -U deripesa -d deripesa

# Access Redis
docker-compose exec cache redis-cli
```

### Git Operations
```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

---

## 🌍 ENVIRONMENT VARIABLES

### Backend `.env`
```env
DATABASE_URL=postgresql://deripesa:password@localhost:5432/deripesa
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=sk_test_xxxxx
PAYPAL_CLIENT_ID=xxxxx
MPESA_CONSUMER_KEY=xxxxx
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/wallet/balance` | Get wallet balance |
| GET | `/api/wallet/transactions` | Get transactions |
| GET | `/api/referrals/link` | Get referral link |
| GET | `/api/referrals/stats` | Get referral stats |
| GET | `/api/tasks` | Get available tasks |
| POST | `/api/tasks/complete` | Complete a task |
| POST | `/api/payments/deposit` | Initiate deposit |
| GET | `/api/admin/dashboard` | Admin dashboard |
| POST | `/api/admin/withdrawals/:id/approve` | Approve withdrawal |

See [API documentation](README.md#-api-endpoints) for complete list.

---

## 🔐 SECURITY QUICK TIPS

- Always use `.env` for secrets, never commit them
- Keep JWT_SECRET strong and unique
- Validate all user input
- Use HTTPS in production
- Rotate API keys regularly
- Enable rate limiting
- Monitor admin logs
- Back up database daily

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL running
psql postgres

# Check DATABASE_URL in .env
# Format: postgresql://user:password@host:port/database
```

### npm/node not found
```bash
# Install Node.js from nodejs.org
# Or use nvm: nvm install 20
```

### Docker issues
```bash
# Restart Docker daemon
docker daemon restart

# Clear all containers/images
docker system prune -a
```

### Build errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📱 TESTING LOCALLY

### Register New User
1. Go to http://localhost:5173/register
2. Fill in form with test data
3. Use referral code if available
4. Click register

### Test Wallet
1. Login with credentials
2. Go to Dashboard
3. Should see wallet balance
4. Complete a task to test earnings

### Test Referral
1. Go to Referrals page
2. Copy referral link
3. Open in new browser (incognito)
4. Register with referral code
5. See referral in list

### Test Admin
1. Database has admin user: admin@deripesa.com / password123
2. Login with admin credentials
3. You'll see admin link in header
4. Click to access admin dashboard

---

## 📊 FILE LOCATIONS CHEATSHEET

| Purpose | Location |
|---------|----------|
| Backend Server | `backend/src/index.ts` |
| Database Schema | `backend/prisma/schema.prisma` |
| Auth Logic | `backend/src/controllers/authController.ts` |
| Wallet Logic | `backend/src/controllers/walletController.ts` |
| Referral Logic | `backend/src/controllers/referralController.ts` |
| Task Logic | `backend/src/controllers/taskController.ts` |
| Payment Logic | `backend/src/controllers/paymentController.ts` |
| Admin Logic | `backend/src/controllers/adminController.ts` |
| API Routes | `backend/src/routes/` |
| Frontend App | `frontend/src/App.tsx` |
| Auth Page | `frontend/src/pages/RegisterPage.tsx` |
| Dashboard | `frontend/src/pages/DashboardPage.tsx` |
| Referrals | `frontend/src/pages/ReferralsPage.tsx` |
| Tasks | `frontend/src/pages/TasksPage.tsx` |
| Admin | `frontend/src/pages/AdminDashboardPage.tsx` |
| API Client | `frontend/src/services/api.ts` |
| Redux Store | `frontend/src/store/` |
| Components | `frontend/src/components/` |
| Styles | `frontend/src/styles/globals.css` |

---

## 🚀 DEPLOYMENT QUICK LINKS

- **Docker Compose**: Use `docker-compose up -d`
- **AWS**: See DEPLOYMENT.md → AWS section
- **Heroku**: See DEPLOYMENT.md → Heroku section
- **DigitalOcean**: See DEPLOYMENT.md → DigitalOcean section
- **VPS**: See DEPLOYMENT.md → VPS section

---

## 💡 USEFUL TIPS

### Development
- Backend auto-restarts on file changes (`nodemon`)
- Frontend hot module replacement (HMR) enabled
- Database has seed data for testing
- Admin account available: admin@deripesa.com

### Performance
- Frontend code is code-split by Vite
- Backend has Redis ready for caching
- Database queries optimized with indexes
- Static assets served via CDN in production

### Security
- All passwords hashed with bcryptjs
- JWT tokens expire after 24 hours
- Admin endpoints require middleware check
- Input validation on all forms and endpoints

---

## 📞 SUPPORT RESOURCES

- **Documentation**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **File Index**: See [FILE_INDEX.md](FILE_INDEX.md)
- **Checklist**: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

## ✨ WHAT YOU HAVE

✅ Full backend API (41 endpoints)
✅ Full frontend UI (7 pages)
✅ Complete database (12 tables)
✅ Authentication system
✅ Wallet management
✅ Referral system
✅ Task system
✅ Payment integration
✅ Admin panel
✅ Real-time features
✅ Docker deployment
✅ CI/CD pipeline

---

## 🎯 NEXT STEPS

1. **Local Testing**
   - Run `docker-compose up -d`
   - Test all features locally
   - Verify payments (use test keys)

2. **Configuration**
   - Update `.env` files
   - Configure payment gateways
   - Set up domain

3. **Deployment**
   - Choose hosting provider
   - Follow deployment guide
   - Monitor production

4. **Launch**
   - Go live
   - Monitor metrics
   - Support users

---

**Ready to launch your earning platform!** 🚀

For detailed information, see the comprehensive documentation files.
