import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/helpers';

const RecentTransactions = ({ transactions = [], loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-40 animate-pulse" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28 animate-pulse mb-1" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse" />
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {!transactions.length ? (
        <div className="text-center py-10">
          <div className="text-3xl mb-2">💳</div>
          <p className="text-slate-400 text-sm">No transactions yet</p>
          <p className="text-slate-400 text-xs mt-1">Add your first income or expense</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {transactions.slice(0, 8).map((t) => (
            <div
              key={t._id}
              className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              {/* Category color dot + icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                style={{ backgroundColor: getCategoryColor(t.category) + '22', color: getCategoryColor(t.category) }}
              >
                {t.type === 'income'
                  ? <ArrowUpRight size={16} />
                  : <ArrowDownRight size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {t.category}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {t.description || formatDate(t.date)}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`font-amount text-sm font-semibold ${
                  t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-500 dark:text-red-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
