const express = require('express');
const router = express.Router();
const { parseExpense, getInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/parse-expense', protect, parseExpense);
router.get('/insights', protect, getInsights);

module.exports = router;
