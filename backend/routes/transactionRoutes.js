const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  bulkDeleteTransactions,
  duplicateTransaction,
  bulkImportTransactions,
  scanReceipt
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadMemory } = require('../config/cloudinary');

// All routes are protected
router.use(protect);

// Bulk Operations
router.post('/bulk-delete', bulkDeleteTransactions);
router.post('/bulk-import', uploadMemory.single('file'), bulkImportTransactions);

// Smart AI Scanner (In-memory for speed)
router.post('/scan-receipt', uploadMemory.single('receipt'), scanReceipt);

// Single Transaction routes
router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.post('/:id/duplicate', duplicateTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
