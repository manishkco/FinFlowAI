const Transaction = require('../models/Transaction');

// @route   GET /api/analytics/summary
// @desc    Get dashboard summary (income, expenses, balance, savings rate)
// @access  Private
const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      summary: {
        income,
        expenses,
        balance,
        savingsRate: parseFloat(savingsRate),
        transactionCount: transactions.length,
        month: targetMonth + 1,
        year: targetYear,
      },
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch summary.' });
  }
};

// @route   GET /api/analytics/monthly
// @desc    Get monthly income/expense data for chart (last 12 months)
// @access  Private
const getMonthlyData = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);

    const data = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Build structured response for chart
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      const incomeEntry = data.find(
        (e) => e._id.year === year && e._id.month === month && e._id.type === 'income'
      );
      const expenseEntry = data.find(
        (e) => e._id.year === year && e._id.month === month && e._id.type === 'expense'
      );

      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        year,
        month,
        income: incomeEntry ? incomeEntry.total : 0,
        expenses: expenseEntry ? expenseEntry.total : 0,
      });
    }

    res.json({ success: true, monthlyData: months });
  } catch (error) {
    console.error('Monthly data error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly data.' });
  }
};

// @route   GET /api/analytics/categories
// @desc    Get expense breakdown by category for current month
// @access  Private
const getCategoryBreakdown = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const breakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalExpenses = breakdown.reduce((sum, cat) => sum + cat.total, 0);

    const categories = breakdown.map((cat) => ({
      category: cat._id,
      total: cat.total,
      count: cat.count,
      percentage: totalExpenses > 0 ? ((cat.total / totalExpenses) * 100).toFixed(1) : 0,
    }));

    res.json({ success: true, categories, totalExpenses });
  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category breakdown.' });
  }
};

module.exports = { getSummary, getMonthlyData, getCategoryBreakdown };
