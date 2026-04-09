import { createContext, useContext, useState, useCallback } from 'react';
import { transactionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ type: '', category: '', search: '', startDate: '', endDate: '' });

  // Fetch transactions with optional params
  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await transactionsAPI.getAll({ ...filters, ...params });
      setTransactions(data.transactions);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Add new transaction and prepend to list
  const addTransaction = useCallback(async (transactionData) => {
    const { data } = await transactionsAPI.create(transactionData);
    setTransactions((prev) => [data.transaction, ...prev]);
    return data.transaction;
  }, []);

  // Update existing transaction in-place
  const updateTransaction = useCallback(async (id, transactionData) => {
    const { data } = await transactionsAPI.update(id, transactionData);
    setTransactions((prev) =>
      prev.map((t) => (t._id === id ? data.transaction : t))
    );
    return data.transaction;
  }, []);

  // Remove transaction from list
  const deleteTransaction = useCallback(async (id) => {
    await transactionsAPI.delete(id);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ type: '', category: '', search: '', startDate: '', endDate: '' });
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        pagination,
        loading,
        filters,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used inside TransactionProvider');
  return ctx;
};
