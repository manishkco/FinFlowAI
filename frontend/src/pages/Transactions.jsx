import { useRef } from 'react';
import { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Pencil, Trash2,
  ArrowUpRight, ArrowDownRight, X, ChevronLeft, ChevronRight, Upload, Copy
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import TransactionModal from '../components/Modals/TransactionModal';
import ConfirmModal from '../components/Modals/ConfirmModal';
import { formatCurrency, formatDate, getCategoryColor, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/helpers';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const Transactions = () => {
  const {
    transactions, pagination, loading,
    filters, fetchTransactions,
    addTransaction, updateTransaction, deleteTransaction, bulkDeleteTransactions, duplicateTransaction, bulkImportTransactions,
    updateFilters, clearFilters,
  } = useTransactions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Fetch when filters or page change
  useEffect(() => {
    fetchTransactions({ search: debouncedSearch, page });
    setSelectedIds([]);
  }, [filters, debouncedSearch, page]);

  const handleBulkImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await bulkImportTransactions(file);
      e.target.value = '';
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
      setDeleteLoading(true);
      try {
        await bulkDeleteTransactions(selectedIds);
        setSelectedIds([]);
        toast.success("Transactions deleted");
      } catch {
        toast.error("Failed to delete transactions");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleDuplicate = async (id) => {
    await duplicateTransaction(id);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(transactions.map(t => t._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAdd = async (data) => {
    await addTransaction(data);
  };

  const handleEdit = async (data) => {
    await updateTransaction(editData._id, data);
    setEditData(null);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTransaction(deleteTarget._id);
      toast.success('Transaction deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (transaction) => {
    setEditData(transaction);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const activeFilterCount = [filters.type, filters.category, filters.startDate, filters.endDate]
    .filter(Boolean).length;

  const allCategories = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])].sort();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {pagination.total} total transaction{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={deleteLoading}
              className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleBulkImport} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by category or description…"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              className="input pl-10"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="label text-xs">Type</label>
              <select
                value={filters.type}
                onChange={(e) => { updateFilters({ type: e.target.value }); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="label text-xs">Category</label>
              <select
                value={filters.category}
                onChange={(e) => { updateFilters({ category: e.target.value }); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All categories</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">From date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => { updateFilters({ startDate: e.target.value }); setPage(1); }}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="label text-xs">To date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => { updateFilters({ endDate: e.target.value }); setPage(1); }}
                className="input text-sm"
              />
            </div>
            {activeFilterCount > 0 && (
              <div className="col-span-2 sm:col-span-4 flex justify-end">
                <button
                  onClick={() => { clearFilters(); setPage(1); }}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X size={12} /> Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-20" />
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-20" />
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse w-16" />
                <div className="flex gap-1">
                  <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🧾</div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">No transactions found</p>
            <p className="text-slate-400 text-sm mt-1">
              {activeFilterCount > 0 || searchInput
                ? 'Try adjusting your filters'
                : 'Add your first transaction to get started'}
            </p>
            {activeFilterCount === 0 && !searchInput && (
              <button onClick={() => setModalOpen(true)} className="btn-primary mt-4 text-sm inline-flex items-center gap-2">
                <Plus size={15} /> Add Transaction
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-3 w-10">
      <input type="checkbox" onChange={handleSelectAll} checked={transactions.length > 0 && selectedIds.length === transactions.length} className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
    </th>
    {['Date', 'Category', 'Description', 'Amount', 'Type', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selectedIds.includes(t._id)} onChange={() => toggleSelect(t._id)} className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(t.category) }}
                          />
                          <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                            {t.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {t.description || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`font-amount text-sm font-semibold ${
                          t.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-500 dark:text-red-400'
                        }`}>
                          {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                          {t.type === 'income'
                            ? <ArrowUpRight size={11} />
                            : <ArrowDownRight size={11} />}
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDuplicate(t._id)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-50 dark:divide-slate-800">
              {transactions.map((t) => (
                <div key={t._id} className="flex items-center gap-3 p-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(t.category) + '20', color: getCategoryColor(t.category) }}
                  >
                    {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.category}</p>
                    <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-amount text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                    </p>
                    <div className="flex gap-1 justify-end mt-1">
                      <button onClick={() => openEdit(t)} className="p-1 text-slate-400 hover:text-blue-500">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteTarget(t)} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={editData ? handleEdit : handleAdd}
        editData={editData}
      />
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message={deleteTarget ? `Delete "${deleteTarget.category}" — ${formatCurrency(deleteTarget.amount)}?` : ''}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 z-10"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Transactions;
