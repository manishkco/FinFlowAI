import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI, aiAPI } from '../services/api';

export const useAnalytics = (month, year) => {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
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

  const generateInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const insightsRes = await aiAPI.getInsights().catch(e => ({ data: { insights: ['Failed to load insights.'] } }));
      setInsights(insightsRes.data?.insights || []);
    } catch (err) {
      setInsights(['Failed to load insights.']);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    setInsights([]); // Reset insights when month/year changes
  }, [fetchAnalytics]);

  return { 
    summary, 
    monthlyData, 
    categories, 
    insights, 
    loading, 
    insightsLoading,
    error, 
    refetch: fetchAnalytics,
    generateInsights 
  };
};
