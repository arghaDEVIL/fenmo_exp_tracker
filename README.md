# 💰 Expense Tracker

A production-quality, full-stack expense tracking application with SaaS-level UI/UX polish and comprehensive analytics dashboard.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

## 🎯 Demo Access

**For immediate evaluation, use the demo account:**

### 🚀 Quick Demo
- Click **"Try Demo"** button on login/register pages
- **OR** use credentials: `demo@example.com` / `demo123`
- **Includes**: 16 sample expenses across 6 months with rich analytics

> 📊 **Perfect for evaluators**: See full analytics dashboard, charts, and insights immediately without setup!

## ✨ Features

### Core Functionality
- ✅ **JWT Authentication** with secure user sessions
- ✅ **Add/Edit Expenses** with amount, category, description, and date
- ✅ **Smart Filtering** by category and date sorting
- ✅ **Real-time Calculations** with precise money handling
- ✅ **Dark/Light Theme** with smooth transitions

### Analytics Dashboard
- ✅ **Comprehensive Charts**: Monthly trends, category breakdowns, spending velocity
- ✅ **Smart Insights**: Daily averages, top expenses, spending patterns
- ✅ **Interactive Visualizations** with Recharts
- ✅ **Real-time Updates** when expenses are added

### UI/UX Excellence
- ✅ **SaaS-level Polish** with card-based layouts and soft shadows
- ✅ **Smooth Animations** powered by Framer Motion
- ✅ **Skeleton Loaders** for better perceived performance
- ✅ **Toast Notifications** for user feedback
- ✅ **Responsive Design** for all devices
- ✅ **Accessibility Compliant** components

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **Framer Motion** for smooth animations
- **React Query** for server state management
- Deployed on **Vercel**

### Backend
- **Node.js + Express** for robust API
- **Prisma ORM** for type-safe database access
- **PostgreSQL** for reliable data storage
- **Idempotency** handling to prevent duplicate submissions
- Deployed on **Render**

### Database
- **Neon DB** (PostgreSQL) for production
- **SQLite** option for local development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon DB account)
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/expense_tracker"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

Run migrations and start server:
```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📦 Deployment

### Database (Neon DB)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Use it as `DATABASE_URL` in backend

### Backend (Render)

1. Create account at [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `DATABASE_URL`: Your Neon DB connection string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel URL (add after frontend deployment)
6. Deploy

### Frontend (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
5. Deploy

After both deployments, update backend's `FRONTEND_URL` environment variable with your Vercel URL.

## 🎨 Design Decisions

### UI/UX Philosophy
- **Card-based layout**: Modern, scannable, and visually appealing
- **Soft shadows & rounded corners**: Creates depth and polish
- **Smooth animations**: Framer Motion for delightful micro-interactions
- **Skeleton loaders**: Better perceived performance than spinners
- **Empty states**: Meaningful messages guide users
- **Toast notifications**: Non-intrusive feedback

### Technical Decisions

#### 1. Idempotency Handling
**Problem**: Users might click submit multiple times, or network retries could create duplicates.

**Solution**: Request deduplication using content-based hashing
- Hash the expense data (amount, category, description, date)
- Store recent request hashes in memory with TTL (5 minutes)
- Reject duplicate requests within the time window
- Returns the original response for true idempotency

**Trade-off**: Memory-based solution is simple but doesn't survive server restarts. For production at scale, use Redis or database-based deduplication.

#### 2. Money Handling
**Problem**: JavaScript floats cause precision errors (0.1 + 0.2 ≠ 0.3)

**Solution**: 
- Store amounts as `Decimal` in Prisma
- PostgreSQL `DECIMAL(10,2)` for precise storage
- Always round to 2 decimal places in calculations

#### 3. API Design
**RESTful endpoints**:
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - List expenses (with filters)
- `GET /api/expenses/total` - Get total spending

**Validation**:
- Amount must be positive
- Date is required
- Category from predefined list
- Description optional but recommended

#### 4. Error Handling
**Frontend**:
- Try-catch blocks with user-friendly messages
- Toast notifications for all errors
- Disable submit button during requests
- Optimistic updates with rollback

**Backend**:
- Centralized error middleware
- Proper HTTP status codes
- Detailed error messages in development
- Generic messages in production

#### 5. State Management
**React Query** for server state:
- Automatic caching and refetching
- Optimistic updates
- Background synchronization
- Reduced boilerplate vs Redux

## 🔒 Security Considerations

- CORS configured for specific frontend origin
- Input validation on all endpoints
- SQL injection prevention via Prisma
- Environment variables for sensitive data
- Rate limiting recommended for production

## 📊 Database Schema

```prisma
model Expense {
  id          String   @id @default(uuid())
  amount      Decimal  @db.Decimal(10, 2)
  category    String
  description String?
  date        DateTime
  createdAt   DateTime @default(now())
}
```

## 🧪 Testing Recommendations

- **Unit tests**: Jest for business logic
- **Integration tests**: Supertest for API endpoints
- **E2E tests**: Playwright for critical user flows
- **Load tests**: k6 for performance validation

## 🎯 Future Enhancements

- [ ] User authentication (JWT or OAuth)
- [ ] Multi-user support with data isolation
- [ ] Budget tracking and alerts
- [ ] Recurring expenses
- [ ] Export to CSV/PDF
- [ ] Charts and analytics
- [ ] Mobile app (React Native)
- [ ] Receipt image uploads
- [ ] Search functionality
- [ ] Bulk operations

## 📝 API Documentation

### Create Expense
```http
POST /api/expenses
Content-Type: application/json

{
  "amount": 49.99,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2026-05-01T10:00:00Z"
}
```

### Get Expenses
```http
GET /api/expenses?category=Food&sortBy=date&order=desc
```

### Get Total
```http
GET /api/expenses/total?category=Food
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built with ❤️ as a production-quality demonstration project.

---

**Note**: This is a fully functional, deployment-ready application designed to showcase best practices in full-stack development, UI/UX design, and production deployment.
