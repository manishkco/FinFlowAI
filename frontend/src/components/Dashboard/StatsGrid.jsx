import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const StatCard = ({ title, value, icon: Icon, color, change, loading }) => {
  const colorMap = {
    green: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
        <div className={`p-2 rounded-xl ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>

      {loading ? (
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-3/4 mb-2" />
      ) : (
        <p className="font-amount text-2xl font-semibold text-slate-900 dark:text-white mb-1">
          {formatCurrency(value)}
        </p>
      )}

      {change !== undefined && !loading && (
        <p className={`text-xs flex items-center gap-1 ${
          change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
        }`}>
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
};

const StatsGrid = ({ summary, loading }) => {
  const stats = [
    {
      title: 'Monthly Income',
      value: summary?.income || 0,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Monthly Expenses',
      value: summary?.expenses || 0,
      icon: TrendingDown,
      color: 'red',
    },
    {
      title: 'Net Balance',
      value: summary?.balance || 0,
      icon: Wallet,
      color: summary?.balance >= 0 ? 'blue' : 'red',
    },
    {
      title: 'Savings Rate',
      value: null,
      icon: PiggyBank,
      color: 'purple',
      raw: summary?.savingsRate,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.title} className="card">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
            <div className={`p-2 rounded-xl ${
              stat.color === 'green' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
              stat.color === 'red' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
              stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
              'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              <stat.icon size={18} />
            </div>
          </div>

          {loading ? (
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-3/4 mb-1" />
          ) : (
            <p className="font-amount text-2xl font-semibold text-slate-900 dark:text-white">
              {stat.raw !== undefined
                ? `${stat.raw}%`
                : formatCurrency(stat.value)}
            </p>
          )}

          {!loading && stat.title === 'Savings Rate' && (
            <p className="text-xs text-slate-400 mt-1">of income saved</p>
          )}
          {!loading && stat.title === 'Net Balance' && (
            <p className={`text-xs mt-1 ${summary?.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {summary?.balance >= 0 ? '↑ Positive balance' : '↓ Overspending'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
