<p align="center">
  <img src="https://img.shields.io/badge/FinFlow_AI-Personal_Finance_Tracker-6366f1?style=for-the-badge&logo=sparkles&logoColor=white" alt="FinFlow AI" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License MIT" />
</p>

<h1 align="center">💸 FinFlow AI</h1>

<p align="center">
  <strong>A production-ready, AI-powered full-stack personal finance tracker.</strong><br/>
  Track income & expenses · Scan receipts with Gemini Vision · Get personalized AI insights · Visualize your wealth
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-ai-capabilities">AI Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Features

<table>
  <tr>
    <td>🔐 <strong>Secure Authentication</strong><br/>JWT via HttpOnly cookies + bcrypt (12 rounds)</td>
    <td>💸 <strong>Transaction Management</strong><br/>Full CRUD — add, edit, delete, duplicate income & expenses</td>
  </tr>
  <tr>
    <td>📊 <strong>Interactive Dashboard</strong><br/>Live stats — income, expenses, balance & savings rate</td>
    <td>📈 <strong>Analytics & Charts</strong><br/>Bar, area & line charts with 12-month breakdowns via Recharts</td>
  </tr>
  <tr>
    <td>🤖 <strong>AI Expense Parsing</strong><br/>Type naturally — "spent 250 on groceries" → auto-fills form</td>
    <td>🧾 <strong>Smart Receipt Scanning</strong><br/>Upload a receipt → Gemini Vision extracts amount, merchant & category</td>
  </tr>
  <tr>
    <td>💡 <strong>AI Financial Insights</strong><br/>Personalized tips generated from your last 30 days of spending</td>
    <td>📂 <strong>CSV Bulk Import & Export</strong><br/>Import hundreds of transactions via CSV · Export reports from Analytics</td>
  </tr>
  <tr>
    <td>🏷️ <strong>Category Tracking</strong><br/>Categorize transactions, view breakdowns with % shares</td>
    <td>🔎 <strong>Search, Filters & Pagination</strong><br/>Debounced search, type / category / date-range filters, paginated results</td>
  </tr>
  <tr>
    <td>🌙 <strong>Dark Mode</strong><br/>Persistent theme toggle stored in localStorage</td>
    <td>📱 <strong>Fully Responsive</strong><br/>Mobile-first layout — works on all screen sizes</td>
  </tr>
  <tr>
    <td>⚡ <strong>Blazing Fast</strong><br/>React 18 + Vite — near-instant HMR in development</td>
    <td>🛡️ <strong>Rate Limited & Secure</strong><br/>Per-route rate limiting — stricter limits on AI endpoints</td>
  </tr>
</table>

---

## 🤖 AI Capabilities

FinFlow AI integrates **Google Gemini** directly into your finance workflow:

### 1. 🗣️ Natural Language Expense Entry
Type a sentence like `"paid 120 for Uber ride"` and Gemini extracts:

| Field | Extracted Value |
|:---|:---|
| Amount | `120` |
| Type | `expense` |
| Category | `Transport` |
| Description | `Uber ride` |
| Date | Today (if not mentioned) |

The form is **auto-populated** — you just review and hit Save.

### 2. 🧾 Receipt Scanning (Gemini Vision)
Upload a photo of any receipt — processed **entirely in-memory** (no file stored on server). Gemini reads:
- Store / merchant name
- Total amount paid
- Best-fit category
- Date of purchase

### 3. 💡 Personalized Financial Insights
Click **"Generate Insights"** on the Analytics page — Gemini analyzes your last 30 days of real spending data and returns **3–4 actionable, personalized tips**.

> **AI Rate Limiting:** All AI endpoints (`/api/ai/*` and `/api/transactions/scan-receipt`) are capped at **50 requests/hour per IP** to protect your Gemini API quota.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS v3 |
| **Charts** | Recharts (Bar, Line, Area, Cell) |
| **Icons** | Lucide React |
| **State Management** | Context API + Custom Hooks |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios (with interceptors) |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js + Express.js |
| **ORM** | **Prisma** (schema-first, type-safe queries) |
| **Database** | **PostgreSQL** |
| **Authentication** | JWT (HttpOnly cookie) + bcrypt (12 rounds) |
| **AI** | Google Gemini (`gemini-flash-lite-latest`) — text & vision |
| **File Uploads** | Multer (in-memory storage) |
| **Image CDN** | Cloudinary (optional — for receipt storage) |
| **Security** | express-rate-limit, CORS, cookie-parser, express-validator |

---

## 📁 Project Structure

```
FinFlowWithAI/
│
├── 🔧 backend/                              # Express REST API
│   ├── config/
│   │   ├── prisma.js                        # Prisma client singleton
│   │   └── cloudinary.js                    # Multer + Cloudinary config
│   ├── controllers/
│   │   ├── authController.js                # Signup, login, logout, getMe, updateProfile
│   │   ├── transactionController.js         # CRUD + duplicate + bulk delete/import + receipt scan
│   │   ├── analyticsController.js           # Summary, monthly data, category breakdown
│   │   └── aiController.js                  # Gemini AI — parse expense text + generate insights
│   ├── middleware/
│   │   └── authMiddleware.js                # JWT verification (cookie + Bearer header)
│   ├── prisma/
│   │   └── schema.prisma                    # Prisma schema — User + Transaction (PostgreSQL)
│   ├── routes/
│   │   ├── authRoutes.js                    # /api/auth/*  + express-validator
│   │   ├── transactionRoutes.js             # /api/transactions/* + multer
│   │   ├── analyticsRoutes.js               # /api/analytics/*
│   │   └── aiRoutes.js                      # /api/ai/* (strict rate limit)
│   ├── .env.example                         # Environment variable template
│   ├── server.js                            # App entry point — middleware, CORS, rate limiting
│   └── package.json
│
└── ⚛️  frontend/                             # React SPA (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   └── ProtectedRoute.jsx        # Guards authenticated-only pages
    │   │   ├── Dashboard/
    │   │   │   ├── StatsGrid.jsx             # Income / Expense / Balance / Savings cards
    │   │   │   ├── OverviewChart.jsx         # Area chart — 12-month income vs expenses
    │   │   │   ├── CategoryBreakdown.jsx     # Spending by category
    │   │   │   └── RecentTransactions.jsx    # Latest transactions list
    │   │   ├── Layout/
    │   │   │   └── AppLayout.jsx             # Sidebar + header shell
    │   │   └── Modals/
    │   │       ├── TransactionModal.jsx      # Add / Edit transaction (with AI text input)
    │   │       └── ConfirmModal.jsx          # Delete confirmation dialog
    │   ├── context/
    │   │   ├── AuthContext.jsx               # Auth state — login, signup, logout, updateUser
    │   │   ├── TransactionContext.jsx        # Transaction CRUD + pagination state
    │   │   └── ThemeContext.jsx              # Dark / light mode toggle (persisted)
    │   ├── hooks/
    │   │   ├── useAnalytics.js               # Fetches summary, monthly data, categories & insights
    │   │   └── useDebounce.js                # Debounced search input hook
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Transactions.jsx              # Full list with search, filter, bulk ops, pagination
    │   │   ├── Analytics.jsx                 # Charts + AI insights + CSV export
    │   │   └── Settings.jsx                  # Profile, currency, budget, appearance, security
    │   ├── services/
    │   │   └── api.js                        # Axios instance + auth interceptors
    │   └── utils/
    │       └── helpers.js                    # formatCurrency, getInitials, getCategoryColor, etc.
    ├── .env.example                          # Frontend env variable template
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🗄 Database Schema

FinFlow AI uses **Prisma ORM with PostgreSQL**.

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String        @id @default(uuid())
  name          String
  email         String        @unique
  password      String
  currency      String        @default("USD")
  monthlyBudget Float         @default(0)
  avatar        String        @default("")
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  transactions  Transaction[]
}

model Transaction {
  id          String   @id @default(uuid())
  type        String   // "income" or "expense"
  amount      Float
  category    String
  description String   @default("")
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@index([userId, type])
}
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version / Notes |
| :---------- | :-------------- |
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| PostgreSQL | ≥ 14 local **or** free cloud: [Supabase](https://supabase.com) / [Neon](https://neon.tech) / [Railway](https://railway.app) |
| Google Gemini API Key | [Get free key →](https://aistudio.google.com/app/apikey) |
| Cloudinary Account | [Free tier →](https://cloudinary.com) *(optional)* |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/FinFlowAI.git
cd FinFlowAI
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend (new terminal)
cd frontend && npm install
```

### 3️⃣ Configure Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL — local or cloud connection string
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/finflow?schema=public"

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary (optional — for receipt image CDN)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 4️⃣ Set Up the Database

```bash
cd backend

# Generate the Prisma client
npx prisma generate

# Push schema to your PostgreSQL database (creates all tables)
npx prisma db push
```

> 💡 **Using a cloud DB?** Grab the connection string from [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app) — all have generous free tiers. Paste it as your `DATABASE_URL`.

### 5️⃣ Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# ✅ Server running on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# ⚡ App running on http://localhost:5173
```

> 💡 The Vite proxy in `frontend/vite.config.js` forwards all `/api` calls to your backend port. Make sure the `PORT` in your `.env` matches the proxy target.

### 6️⃣ Open & Explore

1. Navigate to **[http://localhost:5173](http://localhost:5173)**
2. Click **"Create one"** to sign up
3. Add your first transaction — or try the **🤖 AI input** by typing a purchase in plain English!

---

## 🔐 Authentication Flow

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  React App   │────▶│  Express Server  │────▶│  Prisma + PostgreSQL │
│  (Frontend)  │◀────│  (Backend)       │◀────│  (Database)          │
└──────────────┘     └──────────────────┘     └──────────────────────┘

1. User signs up   → password hashed with bcrypt (12 salt rounds)
2. Server creates  → Prisma user record in PostgreSQL
3. Server issues   → JWT token (expires: 7 days)
4. Token stored    → HttpOnly cookie (+ Authorization: Bearer header fallback)
5. Every request   → authMiddleware verifies JWT → Prisma user lookup
6. Expired token   → 401 Unauthorized → auto-redirect to /login
7. Logout          → cookie cleared via POST /api/auth/logout
```

---

## 🔄 AI Data Flow — Natural Language Expense Entry

```
User types: "spent 500 on dinner with friends"
        ↓
TransactionModal.jsx  →  POST /api/ai/parse-expense  { text: "..." }
        ↓
aiController.parseExpense()  →  sends prompt to Gemini API
        ↓
Gemini returns JSON:
  { amount: 500, type: "expense", category: "Food & Health", description: "Dinner with friends", date: "..." }
        ↓
Form fields auto-populated  →  user reviews & confirms
        ↓
POST /api/transactions  →  authMiddleware → Prisma creates record in PostgreSQL
        ↓
TransactionContext prepends to local state  →  React re-renders  →  UI updates ✨
```

---

## 🔌 API Reference

> **Base URL (local):** `http://localhost:5000/api`
>
> **Authentication:** JWT sent as an **HttpOnly cookie** on every request. Also accepts `Authorization: Bearer <token>` header.

### 🔑 Auth — `/api/auth`

| Method | Endpoint | Auth | Body / Notes |
| :----- | :------- | :--: | :----------- |
| `POST` | `/signup` | ❌ | `{ name, email, password }` — validated with express-validator |
| `POST` | `/login` | ❌ | `{ email, password }` — sets HttpOnly JWT cookie |
| `POST` | `/logout` | ❌ | Clears the JWT cookie |
| `GET` | `/me` | ✅ | Returns the current authenticated user |
| `PUT` | `/profile` | ✅ | `{ name, currency, monthlyBudget }` |

### 💳 Transactions — `/api/transactions`

| Method | Endpoint | Body / Query | Notes |
| :----- | :------- | :----------- | :---- |
| `GET` | `/` | `?type=&category=&search=&page=1&limit=20&startDate=&endDate=` | Paginated, filtered |
| `POST` | `/` | `{ type, amount, category, description?, date? }` | Create transaction |
| `PUT` | `/:id` | Same fields (partial update supported) | Update transaction |
| `DELETE` | `/:id` | — | Delete transaction |
| `POST` | `/:id/duplicate` | — | Clone with today's date |
| `POST` | `/bulk-delete` | `{ ids: ["id1", "id2"] }` | Delete multiple at once |
| `POST` | `/bulk-import` | `multipart/form-data` — field: `file` (`.csv`) | Import from CSV |
| `POST` | `/scan-receipt` | `multipart/form-data` — field: `receipt` (image) | AI receipt scan *(50 req/hr)* |

### 📊 Analytics — `/api/analytics`

| Method | Endpoint | Query | Response |
| :----- | :------- | :---- | :------- |
| `GET` | `/summary` | `?month=1&year=2025` | `{ income, expenses, balance, savingsRate, transactionCount }` |
| `GET` | `/monthly` | — | Last 12 months `[{ label, year, month, income, expenses }]` |
| `GET` | `/categories` | `?month=1&year=2025` | `[{ category, total, count, percentage }]` ordered by spend |

### 🤖 AI — `/api/ai` *(50 req / hour per IP)*

| Method | Endpoint | Body | Response |
| :----- | :------- | :--- | :------- |
| `POST` | `/parse-expense` | `{ text: "spent 200 on groceries" }` | `{ data: { amount, type, category, description, date } }` |
| `GET` | `/insights` | — | `{ insights: ["tip 1", "tip 2", "tip 3"] }` |

---

## 🗂 CSV Import Format

```csv
type,amount,category,description,date
expense,250,Food & Health,Grocery shopping,2025-01-15
income,5000,Salary,January salary,2025-01-01
expense,120,Transport,Uber ride,2025-01-10
```

| Column | Required | Notes |
| :----- | :------: | :---- |
| `type` | ✅ | `income` or `expense` |
| `amount` | ✅ | Numeric value |
| `category` | ✅ | Any string |
| `description` | ❌ | Defaults to empty string |
| `date` | ❌ | ISO date — defaults to today |

---

## 🧩 Architecture Decisions

<details>
<summary><strong>Why Prisma + PostgreSQL?</strong></summary>
<br/>
<strong>Prisma ORM</strong> provides type-safe, auto-completed queries with a schema-first approach — one <code>schema.prisma</code> file is the single source of truth for the entire data model. <strong>PostgreSQL</strong> is the industry-standard relational database offering:
<ul>
  <li>ACID compliance and strong data integrity</li>
  <li>Excellent support for indexes, joins, and aggregations (used heavily in analytics)</li>
  <li>Free cloud hosting via Supabase, Neon, or Railway</li>
  <li>Native JSON support for flexible future extensions</li>
</ul>
</details>

<details>
<summary><strong>Why HttpOnly cookies for JWT?</strong></summary>
<br/>
HttpOnly cookies cannot be read by JavaScript — immune to XSS attacks. <code>SameSite: strict</code> prevents CSRF. A <code>Authorization: Bearer</code> header fallback is also supported for API clients like Postman or mobile apps.
</details>

<details>
<summary><strong>Why in-memory receipt scanning?</strong></summary>
<br/>
Receipts are processed using Multer's <code>memoryStorage</code>. The image buffer is base64-encoded and sent directly to <strong>Gemini Vision</strong> — no file written to disk, no Cloudinary upload during scan. Ultra-fast and zero storage cost. Cloudinary config is present for future extensions if you want to persist receipt images.
</details>

<details>
<summary><strong>Why Context API over Redux?</strong></summary>
<br/>
The app has three clean, separated concerns: Auth, Transactions, and Theme. Context API + custom hooks handles these with minimal boilerplate. Redux would add unnecessary complexity for this scope.
</details>

<details>
<summary><strong>Why Vite over Create React App?</strong></summary>
<br/>
Vite is <strong>10–20× faster</strong> for dev startup and HMR. CRA is officially deprecated and unmaintained.
</details>

<details>
<summary><strong>Why separate rate limits for AI vs general routes?</strong></summary>
<br/>

| Route group | Limit |
|:---|:---|
| All `/api/*` | 200 requests / 15 minutes |
| `/api/ai/*` | 50 requests / 1 hour |
| `/api/transactions/scan-receipt` | 50 requests / 1 hour |

AI routes call the external Gemini API which has its own quota. Stricter limits protect against accidental or malicious key exhaustion.
</details>

---

## ✅ Feature Checklist

- [x] JWT authentication via HttpOnly cookie (signup, login, logout)
- [x] Password hashing with bcrypt (12 salt rounds)
- [x] Input validation with express-validator
- [x] Protected routes — frontend (`ProtectedRoute`) + backend (`authMiddleware`)
- [x] Add / Edit / Delete transactions
- [x] Duplicate a transaction (clones with today's date)
- [x] Bulk delete transactions (array of IDs)
- [x] Bulk CSV import (`Prisma createMany`)
- [x] CSV export from Analytics page (client-side Blob)
- [x] Income & Expense transaction types
- [x] Category system (Food & Health, Transport, Shopping, Entertainment, etc.)
- [x] 🤖 AI natural-language expense parsing (Gemini)
- [x] 🧾 AI receipt scanning via Gemini Vision (in-memory)
- [x] 💡 AI personalized financial insights (30-day history)
- [x] Debounced search across description and category
- [x] Filters — type, category, date range
- [x] Server-side pagination (`skip` + `take`)
- [x] Dashboard stats — income, expenses, balance, savings rate
- [x] Area chart — 12-month income vs expenses
- [x] Bar chart — monthly income vs expenses (Analytics)
- [x] Horizontal bar chart — top spending categories
- [x] Expense breakdown with progress bars & % share
- [x] Monthly analytics with prev/next month navigation
- [x] Dark mode (persisted via ThemeContext + localStorage)
- [x] Responsive mobile-first layout
- [x] Loading skeleton screens
- [x] Toast notifications (react-hot-toast)
- [x] Profile settings — name, currency, monthly budget
- [x] Per-route rate limiting — 200/15min general · 50/hr AI
- [x] CORS configured for dev + production origins
- [x] Prisma ORM with PostgreSQL — indexed on `(userId, date)` and `(userId, type)`

---

## 🚢 Deployment

<details>
<summary><strong>🗄 Database — Supabase / Neon / Railway (PostgreSQL)</strong></summary>
<br/>

All three offer **free PostgreSQL** hosting:

| Provider | Free Tier | Notes |
|:---|:---|:---|
| [Supabase](https://supabase.com) | 500 MB | Recommended — generous free tier |
| [Neon](https://neon.tech) | 3 GB | Serverless PostgreSQL |
| [Railway](https://railway.app) | $5 credit/mo | Same platform you'd host backend |

1. Create a PostgreSQL database on your chosen provider
2. Copy the **connection string** (looks like `postgresql://user:pass@host:5432/db`)
3. Set it as `DATABASE_URL` in your backend environment variables
4. Run migrations: `npx prisma db push`

</details>

<details>
<summary><strong>🖥 Backend — Railway / Render</strong></summary>
<br/>

1. Push your code to GitHub
2. Connect repo on [Railway](https://railway.app) or [Render](https://render.com)
3. Set root directory to `backend`
4. Set environment variables:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/finflow
JWT_SECRET=your_production_secret
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

5. **Build command:** `npm install && npx prisma generate && npx prisma db push`
6. **Start command:** `node server.js`

</details>

<details>
<summary><strong>🌐 Frontend — Vercel / Netlify</strong></summary>
<br/>

1. Connect your GitHub repo on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. **Root directory:** `frontend`
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Update `allowedOrigins` in `backend/server.js` to include your Vercel URL.

</details>

---

## 🛡 Security Summary

| Protection | Implementation |
| :--- | :--- |
| Password storage | bcrypt, 12 salt rounds |
| Token delivery | HttpOnly + Secure + SameSite=Strict cookie |
| Route protection | `authMiddleware.js` — JWT verify + Prisma user lookup |
| Input validation | `express-validator` on auth routes |
| Rate limiting | 200 req/15min (general) · 50 req/hr (AI) |
| CORS | Whitelist-only origins |
| SQL injection | Not possible — Prisma uses parameterized queries |
| Cascade delete | `onDelete: Cascade` — deleting a user removes all their data |

---

## 📌 Roadmap

- [ ] 🔔 Budget alerts when monthly spend exceeds limit
- [ ] 📤 Export reports as PDF
- [ ] 📱 React Native mobile app
- [ ] 🔗 Bank account integration (Plaid API)
- [ ] 📅 Recurring / scheduled transactions
- [ ] 👥 Multi-user household budgeting
- [ ] 🌍 Multi-currency with live exchange rates

---

## 👨‍💻 Author

**Manish Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-manishkco-181717?style=flat-square&logo=github)](https://github.com/manishkco)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you found **FinFlow AI** useful, please give it a **⭐ star** on GitHub — it helps a lot!

<p align="center">
  <strong>Built with ❤️ using Node.js · Prisma · PostgreSQL · React · Google Gemini AI</strong>
</p>
