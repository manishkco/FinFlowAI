<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-brightgreen?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

<h1 align="center">💰 FinFlow</h1>

<p align="center">
  <strong>A production-ready, full-stack personal finance tracker built with the MERN stack.</strong><br/>
  Track income & expenses · Visualize spending habits · Gain financial insights
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Features

<table>
  <tr>
    <td>🔐 <strong>Secure Authentication</strong><br/>JWT tokens + bcrypt password hashing (12 rounds)</td>
    <td>💸 <strong>Transaction Management</strong><br/>Full CRUD — add, edit, delete income & expenses</td>
  </tr>
  <tr>
    <td>📊 <strong>Interactive Dashboard</strong><br/>Live stats for income, expenses, balance & savings rate</td>
    <td>📈 <strong>Analytics & Charts</strong><br/>Area, bar & pie charts with monthly breakdowns via Recharts</td>
  </tr>
  <tr>
    <td>🏷 <strong>Category Tracking</strong><br/>Categorize expenses and view breakdown by category</td>
    <td>🔎 <strong>Search, Filters & Pagination</strong><br/>Debounced search, type/category/date filters, paginated results</td>
  </tr>
  <tr>
    <td>🌙 <strong>Dark Mode</strong><br/>Persisted theme toggle stored in localStorage</td>
    <td>⚡ <strong>Blazing Fast</strong><br/>React 18 + Vite for near-instant hot reload</td>
  </tr>
  <tr>
    <td>📱 <strong>Fully Responsive</strong><br/>Mobile-first layout adapts to any screen size</td>
    <td>🧩 <strong>Clean Architecture</strong><br/>Separated contexts, custom hooks & modular components</td>
  </tr>
</table>

---

## 🛠 Tech Stack

| Layer              | Technology                                                                                                                                                                        |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Styling**        | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)                                                              |
| **Charts**         | ![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chart.js&logoColor=white)                                                                        |
| **State**          | Context API + Custom Hooks                                                                                                                                                        |
| **Backend**        | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |
| **Database**       | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logoColor=white) |
| **Authentication** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) + bcrypt                                                                     |
| **HTTP Client**    | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)                                                                                 |

---

## 📁 Project Structure

```
finance-tracker/
│
├── 🔧 backend/                          # Express REST API server
│   ├── config/
│   │   └── db.js                        # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js            # Signup, login, getMe, updateProfile
│   │   ├── transactionController.js     # CRUD operations for transactions
│   │   └── analyticsController.js       # Summary, monthly charts, categories
│   ├── middleware/
│   │   └── authMiddleware.js            # JWT verification & route protection
│   ├── models/
│   │   ├── User.js                      # User schema (name, email, password)
│   │   └── Transaction.js              # Transaction schema (type, amount, etc.)
│   ├── routes/
│   │   ├── authRoutes.js               # Auth endpoints
│   │   ├── transactionRoutes.js        # Transaction endpoints
│   │   └── analyticsRoutes.js          # Analytics endpoints
│   ├── .env.example                    # Environment variable template
│   ├── package.json
│   └── server.js                       # App entry point
│
└── ⚛️ frontend/                         # React SPA (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Auth/                    # ProtectedRoute wrapper
    │   │   ├── Dashboard/              # StatsGrid, Charts, RecentTransactions
    │   │   ├── Layout/                 # AppLayout (sidebar + header)
    │   │   └── Modals/                 # TransactionModal, ConfirmModal
    │   ├── context/
    │   │   ├── AuthContext.jsx          # Auth state & methods
    │   │   ├── TransactionContext.jsx   # Transaction state & CRUD
    │   │   └── ThemeContext.jsx         # Dark/light mode toggle
    │   ├── hooks/
    │   │   ├── useAnalytics.js          # Analytics data fetcher
    │   │   └── useDebounce.js           # Debounced search input
    │   ├── pages/                       # Login, Signup, Dashboard, Analytics, etc.
    │   ├── services/
    │   │   └── api.js                   # Axios instance + interceptors
    │   └── utils/
    │       └── helpers.js               # Formatters, constants, color maps
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
| :---------- | :------ |
| Node.js     | ≥ 18.x  |
| npm         | ≥ 9.x   |
| MongoDB     | ≥ 6.x *(local or [Atlas](https://cloud.mongodb.com))* |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/manishkco/FinFlow.git
cd finance-tracker
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_tracker
# For Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/finance_tracker

JWT_SECRET=pick_a_long_random_string_here_minimum_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

### 4️⃣ Run the Application

```bash
# Terminal 1 — Start backend
cd backend
npm run dev
# ✅ MongoDB Connected · 🚀 Server running on port 5000

# Terminal 2 — Start frontend
cd frontend
npm run dev
# ⚡ App running on http://localhost:5173
```

### 5️⃣ Open & Use

1. Navigate to **http://localhost:5173**
2. Click **"Create one"** to sign up
3. Start adding transactions and exploring the dashboard! 🎉

---

## 🔐 Authentication Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client     │────▶│   Express    │────▶│   MongoDB    │
│  (React)     │◀────│   Server     │◀────│   (Atlas)    │
└─────────────┘     └──────────────┘     └──────────────┘

1. User signs up → password hashed with bcrypt (12 rounds)
2. Server generates JWT token (expires in 7 days)
3. Token stored in localStorage
4. Axios interceptor attaches "Authorization: Bearer <token>" to every request
5. authMiddleware.js verifies token on protected routes
6. Token expired/invalid → 401 → auto-redirect to /login
```

---

## 🔄 Data Flow

```
User Action (e.g. "Add Expense")
        ↓
TransactionModal.jsx  →  form state
        ↓
TransactionContext.addTransaction()
        ↓
services/api.js  →  POST /api/transactions
        ↓
authMiddleware  →  verify JWT
        ↓
transactionController.createTransaction()
        ↓
Transaction.create()  →  MongoDB
        ↓
Response { success: true, transaction: {...} }
        ↓
Context: prepend to state → React re-renders → UI updates ✨
```

---

## 🔌 API Reference

### 🔑 Auth Endpoints

| Method | Endpoint             | Auth | Body / Notes                              |
| :----- | :------------------- | :--: | :---------------------------------------- |
| POST   | `/api/auth/signup`   |  ❌  | `{ name, email, password }`               |
| POST   | `/api/auth/login`    |  ❌  | `{ email, password }`                     |
| GET    | `/api/auth/me`       |  ✅  | Returns current user profile              |
| PUT    | `/api/auth/profile`  |  ✅  | `{ name, currency, monthlyBudget }`       |

### 💳 Transaction Endpoints

| Method | Endpoint                  | Auth | Body / Notes                                                                 |
| :----- | :------------------------ | :--: | :--------------------------------------------------------------------------- |
| GET    | `/api/transactions`       |  ✅  | Query: `?type=income&category=Food&search=...&page=1&limit=20&startDate=&endDate=` |
| POST   | `/api/transactions`       |  ✅  | `{ type, amount, category, description, date }`                              |
| PUT    | `/api/transactions/:id`   |  ✅  | Same as POST body                                                            |
| DELETE | `/api/transactions/:id`   |  ✅  | —                                                                            |

### 📊 Analytics Endpoints

| Method | Endpoint                     | Auth | Notes                                              |
| :----- | :--------------------------- | :--: | :------------------------------------------------- |
| GET    | `/api/analytics/summary`     |  ✅  | `?month=1&year=2025` — income, expenses, savings   |
| GET    | `/api/analytics/monthly`     |  ✅  | Last 12 months of income & expenses (for charts)   |
| GET    | `/api/analytics/categories`  |  ✅  | Expense breakdown by category for the month        |

---

## 🧩 Architecture Decisions

<details>
<summary><strong>Why Context API over Redux?</strong></summary>
<br/>
For a finance app of this scale, Context API provides sufficient state management with far less boilerplate. Redux adds unnecessary complexity unless the app has 10+ slices of deeply nested state.
</details>

<details>
<summary><strong>Why Vite instead of Create React App?</strong></summary>
<br/>
Vite is <strong>10–20× faster</strong> for development with near-instant hot module replacement. CRA is officially deprecated and no longer maintained.
</details>

<details>
<summary><strong>Why separate Auth & Transaction contexts?</strong></summary>
<br/>
<strong>Separation of concerns.</strong> Auth state is required globally (header, protected routes, layout), while Transaction state is scoped to protected pages only — mounted inside <code>ProtectedLayout</code> for optimal performance.
</details>

<details>
<summary><strong>Why Recharts?</strong></summary>
<br/>
Recharts is the most popular React charting library with a fully composable API — each axis, grid, and tooltip is a separate React component, making customization straightforward.
</details>

---

## ✅ Feature Checklist

- [x] JWT authentication (signup, login, logout)
- [x] Password hashing (bcrypt, 12 rounds)
- [x] Protected routes (frontend + backend)
- [x] Add / Edit / Delete transactions
- [x] Income & Expense transaction types
- [x] Category system (Food, Transport, Bills, etc.)
- [x] Debounced search
- [x] Filters — type, category, date range
- [x] Pagination
- [x] Dashboard stats (income, expenses, balance, savings rate)
- [x] Area chart — 12-month income vs expenses
- [x] Pie chart — expense breakdown by category
- [x] Bar charts on Analytics page
- [x] Monthly analytics with month selector
- [x] Dark mode (persisted in localStorage)
- [x] Responsive mobile layout
- [x] Loading skeleton screens
- [x] Toast notifications
- [x] Profile settings (name, currency, monthly budget)
- [x] Keyboard-accessible modals

---

## 🚢 Deployment

<details>
<summary><strong>🖥 Backend — Railway / Render</strong></summary>
<br/>

1. Push code to GitHub
2. Connect the repo on [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
4. **Build command:** `npm install`
5. **Start command:** `node server.js`
</details>

<details>
<summary><strong>🌐 Frontend — Vercel / Netlify</strong></summary>
<br/>

1. Connect GitHub repo on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. **Root directory:** `frontend`
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. Add env variable: `VITE_API_URL=https://your-backend.railway.app`
</details>

<details>
<summary><strong>🗄 Database — MongoDB Atlas</strong></summary>
<br/>

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` in Network Access (or your server IP)
4. Copy the connection string to your `MONGO_URI` env variable
</details>

---

## 🛡 Production Hardening

```bash
# Recommended packages for production
npm install helmet express-rate-limit compression morgan
```

| Package              | Purpose                                    |
| :------------------- | :----------------------------------------- |
| `helmet`             | Security headers (XSS, clickjacking, etc.) |
| `express-rate-limit` | Rate limiting to prevent brute force       |
| `compression`        | Gzip compression for faster responses      |
| `morgan`             | HTTP request logging                       |

> **Tip:** MongoDB indexes are already configured on `userId + date` and `userId + type` for optimal query performance.

---

## 📌 Roadmap

- [ ] 🔔 Budget alerts & smart notifications
- [ ] 📱 React Native mobile app
- [ ] 📤 Export reports (CSV / PDF)
- [ ] 🤖 AI-powered spending insights
- [ ] 🔗 Bank account integration (Plaid)
- [ ] 👥 Multi-user household budgeting

---

## 👨‍💻 Author

**Manish Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-manishkco-181717?style=flat-square&logo=github)](https://github.com/manishkco)

---

## ⭐ Support

If you found this project useful, please give it a **⭐ star** on GitHub — it means a lot!

<p align="center">
  <strong>Built with ❤️ using the MERN Stack</strong>
</p>
