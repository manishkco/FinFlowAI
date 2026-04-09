import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryColor, formatCurrency } from '../../utils/helpers';

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryBreakdown = ({ categories, totalExpenses, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-40 mb-6 animate-pulse" />
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse mb-4" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="card flex flex-col items-center justify-center py-12">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">No expense data for this period</p>
      </div>
    );
  }

  const pieData = categories.slice(0, 6).map(cat => ({
    name: cat.category,
    value: cat.total,
    color: getCategoryColor(cat.category),
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Expense Breakdown</h3>
          <p className="text-xs text-slate-400 mt-0.5">This month by category</p>
        </div>
        <span className="font-amount text-sm font-semibold text-red-500">
          {formatCurrency(totalExpenses)}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={90}
            innerRadius={40}
            dataKey="value"
            strokeWidth={2}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Amount']}
            contentStyle={{
              background: 'white',
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category list */}
      <div className="space-y-2 mt-2">
        {categories.slice(0, 5).map((cat) => (
          <div key={cat.category} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getCategoryColor(cat.category) }}
            />
            <span className="flex-1 text-xs text-slate-600 dark:text-slate-400 truncate">
              {cat.category}
            </span>
            <span className="text-xs text-slate-400">{cat.percentage}%</span>
            <span className="font-amount text-xs font-medium text-slate-700 dark:text-slate-300">
              {formatCurrency(cat.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
