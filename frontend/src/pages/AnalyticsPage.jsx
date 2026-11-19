import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  PieChart as PieIcon,
  Flame,
  Zap,
  Car,
  Utensils,
  ShoppingBag,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient('/api/activities/analytics');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        showToast('Error loading visual analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [showToast]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div
          style={{
            width: 44,
            height: 44,
            border: '3px solid #d1fae5',
            borderTopColor: '#059669',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#64748b' }}>Processing carbon datasets & visual charts...</p>
      </div>
    );
  }

  const { summary, categoryTotals, categoryChartData, dailyTrend, monthlyComparison } = data || {};

  return (
    <div>
      {/* Overview Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Lifetime Carbon Footprint</span>
            <div className="metric-icon-wrap icon-green">
              <BarChart3 size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value">{summary?.totalEmissions || 0}</span>
            <span className="metric-unit">kg CO₂</span>
          </div>
          <div className="metric-footer">
            <span>{summary?.totalActivities || 0} total calculations logged</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Daily Average Intensity</span>
            <div className="metric-icon-wrap icon-amber">
              <Zap size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value">{summary?.averageDailyEmissions || 0}</span>
            <span className="metric-unit">kg/day</span>
          </div>
          <div className="metric-footer">
            <span>Normal sustainable target &lt; 8.0 kg</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Month-over-Month Delta</span>
            <div className="metric-icon-wrap icon-blue">
              {summary?.monthlyComparisonPercent <= 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
            </div>
          </div>
          <div>
            <span
              className="metric-value"
              style={{ color: summary?.monthlyComparisonPercent <= 0 ? '#059669' : '#e11d48' }}
            >
              {summary?.monthlyComparisonPercent > 0 ? `+${summary?.monthlyComparisonPercent}` : summary?.monthlyComparisonPercent || 0}%
            </span>
          </div>
          <div className="metric-footer">
            <span>Compared to prior calendar month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Highest Emission Domain</span>
            <div className="metric-icon-wrap icon-rose">
              <Flame size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value" style={{ fontSize: '1.4rem' }}>
              {summary?.highestCategory || 'None'}
            </span>
          </div>
          <div className="metric-footer">
            <span className="badge badge-amber">Prime focus for reduction</span>
          </div>
        </div>
      </div>

      {/* Sector Breakdown Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div className="card" style={{ padding: 16, borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', marginBottom: 6 }}>
            <Car size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Transport</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {categoryTotals?.Transportation || 0} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>kg</span>
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', marginBottom: 6 }}>
            <Zap size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Electricity</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {categoryTotals?.Electricity || 0} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>kg</span>
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', marginBottom: 6 }}>
            <Flame size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Cooking</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {categoryTotals?.Cooking || 0} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>kg</span>
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6', marginBottom: 6 }}>
            <Utensils size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Food & Diet</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {categoryTotals?.Food || 0} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>kg</span>
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8b5cf6', marginBottom: 6 }}>
            <ShoppingBag size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Shopping</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {categoryTotals?.Shopping || 0} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>kg</span>
          </div>
        </div>
      </div>

      {/* Main Multi-sector Timeline Chart */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <BarChart3 size={18} style={{ color: '#059669' }} />
              Multi-Sector Emission Timeline
            </h3>
            <p className="card-subtitle">14-day stacked view across transportation, electricity, food, and shopping</p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'transport', 'electricity', 'food', 'cooking', 'shopping'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              {activeCategory === 'all' || activeCategory === 'transport' ? (
                <Area type="monotone" dataKey="transport" stackId="1" stroke="#10b981" fill="#10b981" name="Transport" />
              ) : null}
              {activeCategory === 'all' || activeCategory === 'electricity' ? (
                <Area type="monotone" dataKey="electricity" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Electricity" />
              ) : null}
              {activeCategory === 'all' || activeCategory === 'cooking' ? (
                <Area type="monotone" dataKey="cooking" stackId="1" stroke="#ef4444" fill="#ef4444" name="Cooking" />
              ) : null}
              {activeCategory === 'all' || activeCategory === 'food' ? (
                <Area type="monotone" dataKey="food" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Food" />
              ) : null}
              {activeCategory === 'all' || activeCategory === 'shopping' ? (
                <Area type="monotone" dataKey="shopping" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Shopping" />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row: Doughnut and Monthly Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <PieIcon size={18} style={{ color: '#059669' }} />
                Lifetime Category Composition
              </h3>
              <p className="card-subtitle">Relative distribution across all calculations</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryChartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <BarChart3 size={18} style={{ color: '#059669' }} />
                Historical 6-Month Trajectory
              </h3>
              <p className="card-subtitle">Monthly emissions in kg CO₂</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="monthName" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="emissions" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
