# 💰 FinFlow — Full-Stack Personal Finance Tracker

A production-ready MERN stack application converted from plain HTML/CSS/JS.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State | Context API + Hooks |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| HTTP | Axios |

---

## 📁 Project Structure

```
finance-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # signup, login, getMe, updateProfile
│   │   ├── transactionController.js  # CRUD for transactions
│   │   └── analyticsController.js   # summary, monthly chart, categories
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification, protect routes
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password hash)
│   │   └── Transaction.js         # Transaction schema (userId, type, amount...)
│   ├── routes/
│   │   ├── authRoutes.js          # POST /auth/signup, /auth/login, GET /auth/me
│   │   ├── transactionRoutes.js   # GET/POST /transactions, PUT/DELETE /:id
│   │   └── analyticsRoutes.js     # GET /analytics/summary|monthly|categories
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   └── ProtectedRoute.jsx    # Redirects unauthenticated users
    │   │   ├── Dashboard/
    │   │   │   ├── StatsGrid.jsx         # 4 summary stat cards
    │   │   │   ├── OverviewChart.jsx     # Area chart: income vs expenses
    │   │   │   ├── CategoryBreakdown.jsx # Pie chart + category list
    │   │   │   └── RecentTransactions.jsx # Mini transactions list
    │   │   ├── Layout/
    │   │   │   └── AppLayout.jsx         # Sidebar + header shell
    │   │   └── Modals/
    │   │       ├── TransactionModal.jsx  # Add/Edit transaction form
    │   │       └── ConfirmModal.jsx      # Delete confirmation
    │   ├── context/
    │   │   ├── AuthContext.jsx           # user, login, logout, signup
    │   │   ├── TransactionContext.jsx    # transactions, CRUD, filters
    │   │   └── ThemeContext.jsx          # dark/light mode toggle
    │   ├── hooks/
    │   │   ├── useAnalytics.js           # fetches summary + charts + categories
    │   │   └── useDebounce.js            # debounces search input
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx             # Main overview page
    │   │   ├── Transactions.jsx          # Full CRUD table with filters
    │   │   ├── Analytics.jsx             # Deep dive charts
    │   │   └── Settings.jsx              # Profile + theme toggle
    │   ├── services/
    │   │   └── api.js                    # Axios instance + all API calls
    │   └── utils/
    │       └── helpers.js                # formatCurrency, categories, colors...
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+
- **MongoDB** — either:
  - Local: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
  - Cloud: Free cluster at [MongoDB Atlas](https://cloud.mongodb.com)

---

### Step 1 — Clone and install

```bash
# Clone the project
git clone <your-repo-url>
cd finance-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure backend environment

```bash
cd backend

# Copy the example env file
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_tracker
# For Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/finance_tracker

JWT_SECRET=pick_a_long_random_string_here_minimum_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

---

### Step 3 — Run the backend

```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
# You'll see: ✅ MongoDB Connected + 🚀 Server running on port 5000
```

---

### Step 4 — Run the frontend

```bash
# In a new terminal
cd frontend
npm run dev
# App starts on http://localhost:5173
```

---

### Step 5 — Open the app

1. Go to **http://localhost:5173**
2. Click **"Create one"** to sign up with any email + password
3. You'll land on the dashboard — start adding transactions!

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | `{ name, email, password }` |
| POST | `/api/auth/login` | ❌ | `{ email, password }` |
| GET | `/api/auth/me` | ✅ | — |
| PUT | `/api/auth/profile` | ✅ | `{ name, currency, monthlyBudget }` |

### Transactions

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/transactions` | ✅ | Supports: `?type=income&category=Food&search=...&page=1&limit=20&startDate=&endDate=` |
| POST | `/api/transactions` | ✅ | `{ type, amount, category, description, date }` |
| PUT | `/api/transactions/:id` | ✅ | Same as POST body |
| DELETE | `/api/transactions/:id` | ✅ | — |

### Analytics

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/analytics/summary` | ✅ | `?month=1&year=2025` — returns income/expenses/balance/savingsRate |
| GET | `/api/analytics/monthly` | ✅ | Last 12 months of income + expenses for chart |
| GET | `/api/analytics/categories` | ✅ | Expense breakdown by category for the month |

---

## 🔐 How Authentication Works

```
1. User signs up → password is hashed with bcrypt (12 rounds)
2. Server returns JWT token (expires in 7 days)
3. Token stored in localStorage
4. Every API request: Axios interceptor adds "Authorization: Bearer <token>"
5. Backend: authMiddleware.js verifies token on every protected route
6. If token expired/invalid → 401 → Axios interceptor redirects to /login
7. User data never stored in plain text
```

---

## 🔄 Data Flow Diagram

```
User Action (e.g. "Add Expense")
        ↓
TransactionModal.jsx  (form state)
        ↓
TransactionContext.addTransaction()
        ↓
services/api.js  → POST /api/transactions
        ↓
transactionRoutes.js → authMiddleware (verify JWT)
        ↓
transactionController.createTransaction()
        ↓
Transaction.create()  →  MongoDB
        ↓
Response { success: true, transaction: {...} }
        ↓
TransactionContext: prepend to transactions[]
        ↓
React re-renders → UI updates instantly ✨
```

---

## 🧩 Key Design Decisions

### Why Context API (not Redux)?
For a finance app of this scale, Context API is sufficient and far simpler. Redux adds boilerplate without meaningful benefit unless you have 10+ slices of complex state.

### Why Vite (not Create React App)?
Vite is **10-20x faster** for development. Hot reload is near-instant. CRA is deprecated.

### Why separate AuthContext + TransactionContext?
Separation of concerns. Auth state is needed globally (header, protected routes, layout). Transaction state is only needed inside protected pages — so it's only mounted there, inside `ProtectedLayout`.

### Why Recharts?
Recharts is the most widely-used React chart library, has great TypeScript support, and is fully composable — each axis, grid, tooltip is a separate React component.

---

## 🚢 Deployment

### Backend (Railway / Render)
1. Push to GitHub
2. Connect repo on [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
4. Build command: `npm install`, Start: `node server.js`

### Frontend (Vercel / Netlify)
1. Connect GitHub repo on [Vercel](https://vercel.com)
2. Root directory: `frontend`
3. Build: `npm run build`, Output: `dist`
4. Add env variable: `VITE_API_URL=https://your-backend.railway.app`
5. Update `vite.config.js` proxy to use `VITE_API_URL`

### MongoDB Atlas (Production DB)
1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist `0.0.0.0/0` in Network Access (or your server IP)
4. Copy the connection string to `MONGO_URI`

---

## ✅ Feature Checklist

- [x] JWT authentication (signup, login, logout)
- [x] Password hashing (bcrypt, 12 rounds)
- [x] Protected routes (frontend + backend)
- [x] Add / Edit / Delete transactions
- [x] Income & Expense types
- [x] Category system
- [x] Search transactions (debounced)
- [x] Filter by type, category, date range
- [x] Pagination
- [x] Dashboard stats (income, expenses, balance, savings rate)
- [x] Area chart — 12 months income vs expenses
- [x] Pie chart — expense breakdown by category
- [x] Bar charts on Analytics page
- [x] Monthly analytics with month selector
- [x] Dark mode (persisted to localStorage)
- [x] Responsive mobile layout
- [x] Loading skeletons
- [x] Toast notifications
- [x] Profile settings (name, currency, monthly budget)
- [x] Keyboard-accessible modals

---

## 📦 Production Tips

1. **Rate limiting** — add `express-rate-limit` to prevent brute force on `/auth` routes
2. **Helmet** — add `helmet` middleware for security headers
3. **Compression** — add `compression` middleware for gzip
4. **MongoDB indexes** — already added on `userId + date` and `userId + type`
5. **Environment** — never expose `JWT_SECRET` or `MONGO_URI` in client code

```bash
# Add to backend for production hardening
npm install helmet express-rate-limit compression morgan
```
