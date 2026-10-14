const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../config/prisma');

// @route   POST /api/ai/parse-expense
// @desc    Parse an expense string into structured data
const parseExpense = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text input is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

    const prompt = `You are a financial parsing assistant. Extract the transaction details from the following text and return ONLY a valid JSON object with the following keys:
- amount: (number) the absolute amount of money.
- type: (string) deduce whether it is "expense" (e.g., spent, bought, paid) or "income" (e.g., earned, received, salary).
- category: (string) IF type is "expense", choose the best fit from: ['Food & Health', 'Entertainment', 'Shopping', 'Investment', 'Transport', 'Utilities', 'Subscription', 'Education', 'Travel', 'Other']. IF type is "income", choose the best fit from: ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Other'].
- description: (string) a brief description.
- date: (string) ISO date string, assume today if not specified. Today is ${new Date().toISOString()}.

Do not include markdown blocks like \`\`\`json. Just the raw JSON object.

Text: "${text}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textOut = response.text().trim();
    
    // Extract JSON block from the text using regex
    const jsonMatch = textOut.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in Gemini response: ' + textOut);
    }
    
    const jsonString = jsonMatch[0];
    const parsedData = JSON.parse(jsonString);

    res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    console.error('AI parsing error:', error);
    res.status(500).json({ success: false, message: `AI Error: ${error.message}` });
  }
};

// @route   GET /api/ai/insights
// @desc    Generate LLM-based insights from transaction history
const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch last 30 days of transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        date: { gte: thirtyDaysAgo },
      },
    });

    if (!transactions || transactions.length === 0) {
      return res.json({ 
        success: true, 
        insights: ["We need a bit more transaction history to generate meaningful insights for you!"] 
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const categories = {};

    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else {
        totalExpense += t.amount;
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

    const prompt = `You are an expert AI financial advisor. Based on the user's last 30 days of transactions, provide 3 to 4 actionable, natural-language insights and tips.
    
    User Financial Summary (Last 30 days):
    - Total Income: $${totalIncome.toFixed(2)}
    - Total Expenses: $${totalExpense.toFixed(2)}
    - Expense Breakdown by Category: ${JSON.stringify(categories)}
    
    Format the output as a clean JSON array of strings. Do not include markdown blocks like \`\`\`json. Just the raw array.
    Example: ["Insight 1", "Insight 2", "Insight 3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textOut = response.text().trim();
    
    const jsonMatch = textOut.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse insights array from Gemini.');
    }
    
    const insightsArray = JSON.parse(jsonMatch[0]);

    res.status(200).json({ success: true, insights: insightsArray });
  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate insights.' });
  }
};

module.exports = { parseExpense, getInsights };
