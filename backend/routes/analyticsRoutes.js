const express = require('express');
const router = express.Router();
const { getSummary, getMonthlyData, getCategoryBreakdown } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyData);
router.get('/categories', getCategoryBreakdown);

module.exports = router;
