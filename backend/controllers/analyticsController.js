const prisma = require('../config/prisma');

const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
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

const getMonthlyData = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: { gte: twelveMonthsAgo },
      },
      select: { type: true, amount: true, date: true }
    });

    // Build structured response for chart
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      // Calculate totals for this specific month
      const monthTx = transactions.filter(t => {
        const dDate = new Date(t.date);
        return dDate.getFullYear() === year && (dDate.getMonth() + 1) === month;
      });

      const income = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        year,
        month,
        income,
        expenses,
      });
    }

    res.json({ success: true, monthlyData: months });
  } catch (error) {
    console.error('Monthly data error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly data.' });
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const breakdown = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId: req.user.id,
        type: 'expense',
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
      _count: { category: true },
      orderBy: { _sum: { amount: 'desc' } }
    });

    const totalExpenses = breakdown.reduce((sum, cat) => sum + (cat._sum.amount || 0), 0);

    const categories = breakdown.map((cat) => ({
      category: cat.category,
      total: cat._sum.amount || 0,
      count: cat._count.category,
      percentage: totalExpenses > 0 ? (((cat._sum.amount || 0) / totalExpenses) * 100).toFixed(1) : 0,
    }));

    res.json({ success: true, categories, totalExpenses });
  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category breakdown.' });
  }
};

module.exports = { getSummary, getMonthlyData, getCategoryBreakdown };
