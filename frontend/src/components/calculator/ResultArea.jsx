import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Leaf,
  Sparkles,
} from 'lucide-react';

const ResultArea = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #d1fae5',
            borderTopColor: '#059669',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Computing carbon footprint and generating eco recommendations...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
          <Leaf size={28} />
        </div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
          Ready to Calculate
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Fill in your transportation, energy, and consumption data above to compute your footprint.
        </p>
      </div>
    );
  }

  const { carbonFootprint = 0, level = 'Low', tips = [], lastUpdated } = result;

  const isLow = level === 'Low';
  const isModerate = level === 'Moderate';

  return (
    <div className="card" style={{ border: `1.5px solid ${isLow ? '#a7f3d0' : isModerate ? '#fde68a' : '#fecdd3'}` }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Sparkles size={18} style={{ color: '#059669' }} />
            Calculation Results
          </h3>
          <p className="card-subtitle">
            {lastUpdated ? `Computed for ${new Date(lastUpdated).toLocaleDateString()}` : 'Latest calculation'}
          </p>
        </div>
        <span
          className={`badge ${isLow ? 'badge-green' : isModerate ? 'badge-orange' : 'badge-red'}`}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
        >
          {isLow ? <CheckCircle2 size={14} /> : isModerate ? <AlertTriangle size={14} /> : <Flame size={14} />}
          {level} Impact Level
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          marginBottom: 16,
          padding: '16px 20px',
          backgroundColor: isLow ? '#f0fdf4' : isModerate ? '#fffbeb' : '#fff1f2',
          borderRadius: 12,
        }}
      >
        <span
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: isLow ? '#065f46' : isModerate ? '#b45309' : '#9f1239',
            letterSpacing: '-0.02em',
          }}
        >
          {carbonFootprint}
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569' }}>
          kg CO₂ emitted
        </span>
      </div>

      {/* Eco Tips Section */}
      {tips && tips.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Leaf size={16} style={{ color: '#059669' }} />
            Tailored Action Tips:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tips.map((tip, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  color: '#334155',
                  lineHeight: 1.4,
                }}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultArea;
