import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currencyCode = null) => {
  const currency = currencyCode || localStorage.getItem('currency') || 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

// Format short currency (no cents for large numbers)
export const formatCurrencyShort = (amount) => {
  if (Math.abs(amount) >= 1000) {
    const currency = localStorage.getItem('currency') || 'USD';
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
    const parts = formatter.formatToParts(0);
    const symbol = parts.find(p => p.type === 'currency')?.value || '$';
    
    return symbol + (amount / 1000).toFixed(1) + 'k';
  }
  return formatCurrency(amount);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

// Format date for input[type="date"]
export const toInputDate = (date) => {
  if (!date) return format(new Date(), 'yyyy-MM-dd');
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

// Category colors for charts and badges
export const CATEGORY_COLORS = {
  'Food & Health': '#f97316',
  'Food': '#f97316',
  'Health': '#fb923c',
  'Entertainment': '#a855f7',
  'Shopping': '#3b82f6',
  'Investment': '#22c55e',
  'Transport': '#06b6d4',
  'Utilities': '#64748b',
  'Salary': '#10b981',
  'Freelance': '#6366f1',
  'Business': '#0ea5e9',
  'Other': '#94a3b8',
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#94a3b8';
};

// Expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Health',
  'Entertainment',
  'Shopping',
  'Investment',
  'Transport',
  'Utilities',
  'Subscription',
  'Education',
  'Travel',
  'Other',
];

// Income categories
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Gift',
  'Other',
];

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Get initials from name
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Current month/year
export const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

// Compress image before uploading
export const compressImage = (file, maxWidth = 1000) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleSize = maxWidth / img.width;
        
        if (scaleSize >= 1) {
          // If image is smaller than maxWidth, return original file
          return resolve(file);
        }

        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.8);
      };
    };
  });
};
