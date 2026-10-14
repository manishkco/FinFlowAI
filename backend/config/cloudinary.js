const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'finance_receipts',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

// Setup multer upload middleware
const upload = multer({ storage });

// A separate multer config for memory storage (CSV, receipts)
const uploadMemory = multer({ storage: multer.memoryStorage() });

module.exports = { cloudinary, upload, uploadMemory };
