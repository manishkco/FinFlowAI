const prisma = require('../config/prisma');
const csv = require('csv-parser');
const stream = require('stream');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const formatTransaction = (t) => ({
  _id: t.id,
  type: t.type,
  amount: t.amount,
  category: t.category,
  description: t.description,
  date: t.date,
  createdAt: t.createdAt,
});

const getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sort = '-date',
    } = req.query;

    const where = { userId: req.user.id };

    if (type && ['income', 'expense'].includes(type)) {
      where.type = type;
    }

    if (category) {
      where.category = { contains: category };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate + 'T23:59:59');
    }

    if (search) {
      where.OR = [
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort logic mapping
    const orderBy = sort === '-date' ? { date: 'desc' } : { date: 'asc' };

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      count: transactions.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      transactions: transactions.map(formatTransaction),
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions.' });
  }
};

const createTransaction = async (req, res) => {
  const { type, amount, category, description, date } = req.body;

  if (!type || !amount || !category) {
    return res.status(400).json({
      success: false,
      message: 'Type, amount, and category are required.',
    });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type,
        amount: parseFloat(amount),
        category,
        description: description || '',
        date: date ? new Date(date) : new Date(),
      }
    });

    res.status(201).json({ success: true, transaction: formatTransaction(transaction) });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ success: false, message: 'Failed to create transaction.' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        type: type || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        category: category || undefined,
        description: description !== undefined ? description : undefined,
        date: date ? new Date(date) : undefined,
      }
    });

    res.json({ success: true, transaction: formatTransaction(transaction) });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ success: false, message: 'Failed to update transaction.' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    await prisma.transaction.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete transaction.' });
  }
};

// --- NEW ADVANCED FEATURES ---

// 1. Bulk Delete
const bulkDeleteTransactions = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of transaction IDs.' });
    }

    await prisma.transaction.deleteMany({
      where: {
        id: { in: ids },
        userId: req.user.id, // Security: ensure they only delete their own
      },
    });

    res.json({ success: true, message: 'Transactions deleted successfully.' });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to bulk delete transactions.' });
  }
};

// 2. Duplicate Transaction
const duplicateTransaction = async (req, res) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    // Create a copy with today's date
    const duplicated = await prisma.transaction.create({
      data: {
        userId: existing.userId,
        type: existing.type,
        amount: existing.amount,
        category: existing.category,
        description: existing.description ? existing.description + ' (Copy)' : 'Copy',
        date: new Date(),
      }
    });

    res.status(201).json({ success: true, transaction: formatTransaction(duplicated), message: 'Transaction duplicated.' });
  } catch (error) {
    console.error('Duplicate transaction error:', error);
    res.status(500).json({ success: false, message: 'Failed to duplicate transaction.' });
  }
};

// 3. Bulk CSV Import
const bulkImportTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a CSV file.' });
    }

    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase().trim() }))
      .on('data', (data) => {
        // Basic mapping assuming headers: type, amount, category, description, date
        if (data.amount && data.type && data.category) {
          results.push({
            userId: req.user.id,
            type: data.type.toLowerCase() === 'income' ? 'income' : 'expense',
            amount: parseFloat(data.amount) || 0,
            category: data.category,
            description: data.description || '',
            date: data.date ? new Date(data.date) : new Date(),
          });
        }
      })
      .on('end', async () => {
        try {
          if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid rows found in CSV.' });
          }

          await prisma.transaction.createMany({
            data: results,
          });

          res.status(201).json({ success: true, message: `${results.length} transactions imported successfully.` });
        } catch (dbError) {
          console.error('Database insertion error during CSV import:', dbError);
          res.status(500).json({ success: false, message: 'Failed to insert imported transactions into the database.' });
        }
      })
      .on('error', (err) => {
        console.error('CSV Parsing error:', err);
        res.status(500).json({ success: false, message: 'Failed to parse CSV file.' });
      });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, message: 'Failed to import transactions.' });
  }
};

// 4. Smart Receipt Scanning (In-Memory for ultra-fast response)
const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a receipt image.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    
    const prompt = `You are an AI trained to extract financial data from receipts. Analyze this receipt and return a JSON object with:
    - amount: (number) total amount paid.
    - merchant: (string) name of the store or merchant (use this for description).
    - category: (string) one of ['Food & Health', 'Entertainment', 'Shopping', 'Investment', 'Transport', 'Utilities', 'Subscription', 'Education', 'Travel', 'Other'].
    - date: (string) ISO date string.
    
    Return ONLY valid JSON.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse receipt data.');
    }

    const data = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      data: {
        amount: data.amount,
        description: data.merchant,
        category: data.category,
        date: data.date,
        type: 'expense',
      }
    });

  } catch (error) {
    console.error('Scan receipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to scan receipt.' });
  }
};

module.exports = { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  bulkDeleteTransactions,
  duplicateTransaction,
  bulkImportTransactions,
  scanReceipt
};
