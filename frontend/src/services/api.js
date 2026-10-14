import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const transactionsAPI = {
  getAll: (params = {}) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  duplicate: (id) => api.post(`/transactions/${id}/duplicate`),
  bulkDelete: (data) => api.post('/transactions/bulk-delete', data),
  bulkImport: (formData) => api.post('/transactions/bulk-import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  scanReceipt: (formData) => api.post('/transactions/scan-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 8000 // 8 seconds strict timeout
  }),
};

export const analyticsAPI = {
  getSummary: (params = {}) => api.get('/analytics/summary', { params }),
  getMonthlyData: () => api.get('/analytics/monthly'),
  getCategoryBreakdown: (params = {}) => api.get('/analytics/categories', { params }),
};

export const aiAPI = {
  parseExpense: (data) => api.post('/ai/parse-expense', data),
  getInsights: () => api.get('/ai/insights'),
};

export default api;
