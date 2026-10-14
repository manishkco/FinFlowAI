const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Keep this for local development
  'https://fin-flow-three-kappa.vercel.app' // Add your EXACT Vercel URL from the error
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const rateLimit = require('express-rate-limit');

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter Rate Limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 AI requests per hour
  message: { success: false, message: 'AI request limit reached. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limit to all /api routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Apply strict limit to scan-receipt specifically BEFORE the transaction routes handle it
app.use('/api/transactions/scan-receipt', aiLimiter);
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/ai', aiLimiter, require('./routes/aiRoutes')); // Stricter AI limits

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Finance Tracker API running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
