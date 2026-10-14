import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency, formatCurrencyShort, getCategoryColor } from '../utils/helpers';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Download, Sparkles } from 'lucide-react';
import { transactionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 capitalize">{entry.name}:</span>
          <span className="font-amount font-medium text-slate-900 dark:text-white">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const { summary, monthlyData, categories, insights, loading, insightsLoading, generateInsights } = useAnalytics(selectedMonth, selectedYear);
  const [downloading, setDownloading] = useState(false);

  const prevMonth = () => {
    if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };
  const isCurrentMonth = selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();

  const netData = monthlyData.map(d => ({
    ...d,
    net: d.income - d.expenses,
  }));

  const downloadReport = async () => {
    try {
      setDownloading(true);
      const res = await transactionsAPI.getAll({ limit: 10000 });
      const transactions = res.data.transactions;
      if (!transactions.length) return toast.error("No transactions to export");
      
      const headers = ["Date,Type,Category,Amount,Description"];
      const csvData = transactions.map(t => 
        `${new Date(t.date).toISOString().split('T')[0]},${t.type},${t.category},${t.amount},"${t.description || ''}"`
      );
      
      const blob = new Blob([headers.concat(csvData).join("\n")], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FinFlow_Report_${MONTHS[selectedMonth - 1]}_${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
          <p className="text-slate-400 text-sm mt-0.5">Deep dive into your finances</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadReport} 
            disabled={downloading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            {downloading ? "Generating..." : "Export CSV"}
          </button>
          
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <button onClick={prevMonth} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-slate-800 dark:text-white w-28 text-center">
              {MONTHS[selectedMonth - 1]} {selectedYear}
            </span>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg text-indigo-600 dark:text-indigo-300">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI Financial Insights</h3>
          </div>
          <button 
            onClick={generateInsights}
            disabled={insightsLoading || loading}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {insightsLoading ? 'Generating...' : 'Generate Insights'}
          </button>
        </div>
        {insightsLoading ? (
           <div className="space-y-2 mt-3">
             <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded animate-pulse w-3/4" />
             <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded animate-pulse w-2/3" />
           </div>
        ) : insights && insights.length > 0 ? (
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 mt-3">
            {insights.map((insight, idx) => <li key={idx} className="leading-relaxed">{insight}</li>)}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Click the button above to generate personalized AI insights for this month.
          </p>
        )}
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Income', value: summary?.income, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: TrendingUp },
          { label: 'Expenses', value: summary?.expenses, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: TrendingDown },
          { label: 'Net Balance', value: summary?.balance, color: (summary?.balance ?? 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: TrendingUp },
          { label: 'Savings Rate', value: null, raw: `${summary?.savingsRate ?? 0}%`, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', icon: TrendingUp },
        ].map(({ label, value, raw, color, bg, icon: Icon }) => (
          <div key={label} className="card">
            <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            {loading ? (
              <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mt-1 w-3/4" />
            ) : (
              <p className={`font-amount text-xl font-bold mt-0.5 ${color}`}>
                {raw ?? formatCurrency(value)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Income vs Expenses bar chart (monthly) */}
      <div className="card mb-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">12-Month Overview</h3>
        <p className="text-xs text-slate-400 mb-5">Income, expenses, and net balance per month</p>
        {loading ? (
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={netData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => formatCurrencyShort(v)} width={45} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} name="income" />
              <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={28} name="expenses" />
              <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={2} dot={false} name="net" />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center gap-5 mt-3 justify-end">
          {[['#22c55e','Income'],['#f87171','Expenses'],['#6366f1','Net']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Top Spending Categories</h3>
          <p className="text-xs text-slate-400 mb-5">
            {MONTHS[selectedMonth - 1]} {selectedYear}
          </p>
          {loading ? (
            <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : !categories?.length ? (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No expense data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={categories.slice(0, 7)}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => formatCurrencyShort(v)} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip formatter={v => [formatCurrency(v), 'Spent']} contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #f1f5f9' }} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={20}>
                  {categories.slice(0, 7).map((cat, i) => (
                    <Cell key={i} fill={getCategoryColor(cat.category)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Expense Breakdown</h3>
          <p className="text-xs text-slate-400 mb-5">% of total monthly spend</p>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32" />
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : !categories?.length ? (
            <div className="flex items-center justify-center h-56 text-slate-400 text-sm">No expenses this month</div>
          ) : (
            <div className="space-y-4">
              {categories.slice(0, 7).map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(cat.category) }} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{cat.percentage}%</span>
                      <span className="font-amount text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.percentage}%`, backgroundColor: getCategoryColor(cat.category) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
