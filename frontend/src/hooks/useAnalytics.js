import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '../services/api';

export const useAnalytics = (month, year) => {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const [summaryRes, monthlyRes, catRes] = await Promise.all([
        analyticsAPI.getSummary(params),
        analyticsAPI.getMonthlyData(),
        analyticsAPI.getCategoryBreakdown(params),
      ]);

      setSummary(summaryRes.data.summary);
      setMonthlyData(monthlyRes.data.monthlyData);
      setCategories(catRes.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, monthlyData, categories, loading, error, refetch: fetch };
};
