import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
  Flame,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';

const RecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await apiClient('/api/activities/recommendations');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        showToast('Error loading recommendations', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
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
        <p style={{ color: '#64748b' }}>Analyzing personal emissions data for recommendations...</p>
      </div>
    );
  }

  const recommendations = data?.recommendations || [];
  const filteredRecs = filter === 'All'
    ? recommendations
    : recommendations.filter((r) => r.category.toLowerCase().includes(filter.toLowerCase()));

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Transportation':
        return <Car size={20} style={{ color: '#10b981' }} />;
      case 'Electricity':
        return <Zap size={20} style={{ color: '#f59e0b' }} />;
      case 'Food':
        return <Utensils size={20} style={{ color: '#3b82f6' }} />;
      case 'Shopping':
        return <ShoppingBag size={20} style={{ color: '#8b5cf6' }} />;
      case 'Cooking':
        return <Flame size={20} style={{ color: '#ef4444' }} />;
      default:
        return <Sparkles size={20} style={{ color: '#059669' }} />;
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          borderRadius: 16,
          padding: '24px 32px',
          color: 'white',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Sparkles size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Personalized Eco Recommendations
          </h2>
        </div>
        <p style={{ color: '#d1fae5', fontSize: '0.925rem', maxWidth: 640 }}>
          {data?.hasData
            ? `Calculated from your logged activities. Your largest footprint contributor is ${data.topContributor} (${data.topContributorPercent}%). Focus on these targeted changes for maximum impact.`
            : 'Start logging your daily commute and utility consumption to see customized reduction strategies.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {['All', 'Transportation', 'Electricity', 'Food', 'Shopping', 'Cooking'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards */}
      {filteredRecs.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <Info size={28} />
          </div>
          <h4 className="empty-state-title">No Recommendations Available</h4>
          <p className="empty-state-text">
            No specific recommendations found for "{filter}". Record more activities in this category to generate insights.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {filteredRecs.map((rec, index) => (
            <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getCategoryIcon(rec.category)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {rec.category}
                    </span>
                  </div>

                  <span
                    className={`badge ${rec.priority === 'High' ? 'badge-red' : rec.priority === 'Medium' ? 'badge-orange' : 'badge-green'}`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.3 }}>
                  {rec.title}
                </h3>

                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 16 }}>
                  {rec.description}
                </p>

                {rec.action && (
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      marginBottom: 16,
                      fontSize: '0.825rem',
                      color: '#334155',
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong style={{ color: '#0f172a' }}>Recommended Step: </strong>
                      {rec.action}
                    </div>
                  </div>
                )}
              </div>

              {rec.potentialSavings && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#ecfdf5',
                    borderRadius: 8,
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: '#065f46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendingDown size={14} /> Potential Savings:
                  </span>
                  <span style={{ color: '#047857', fontWeight: 800 }}>{rec.potentialSavings}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
