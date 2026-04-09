import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { useAnalytics } from '../hooks/useAnalytics';
import StatsGrid from '../components/Dashboard/StatsGrid';
import OverviewChart from '../components/Dashboard/OverviewChart';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import TransactionModal from '../components/Modals/TransactionModal';
import { getGreeting, getCurrentMonthYear } from '../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, fetchTransactions, addTransaction } = useTransactions();
  const { month, year } = getCurrentMonthYear();
  const { summary, monthlyData, categories, loading: analyticsLoading, refetch } = useAnalytics(month, year);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions({ limit: 10, sort: '-date' });
  }, []);

  const handleAddTransaction = async (data) => {
    await addTransaction(data);
    // Refresh analytics after adding
    refetch();
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header greeting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats cards */}
      <StatsGrid summary={summary} loading={analyticsLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2">
          <OverviewChart data={monthlyData} loading={analyticsLoading} />
        </div>
        <CategoryBreakdown
          categories={categories}
          totalExpenses={summary?.expenses || 0}
          loading={analyticsLoading}
        />
      </div>

      {/* Recent transactions */}
      <RecentTransactions transactions={transactions} loading={false} />

      {/* Add transaction modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Floating action button (mobile) */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 z-10"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Dashboard;
