import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EcoRecommendationsCard = ({ recommendations = [], topContributor = 'None' }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Sparkles size={18} style={{ color: '#059669' }} />
            Personalized Eco Actions
          </h3>
          <p className="card-subtitle">
            {topContributor !== 'None'
              ? `Prioritized for your ${topContributor} emissions`
              : 'Actionable tips tailored to your lifestyle'}
          </p>
        </div>
        <button
          onClick={() => navigate('/recommendations')}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.8rem' }}
        >
          View All
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
          <Lightbulb size={28} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
          <p style={{ fontSize: '0.875rem' }}>Log a few activities to generate personalized recommendations.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recommendations.slice(0, 3).map((rec, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ marginTop: 2, color: '#059669', flexShrink: 0 }}>
                <CheckCircle2 size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                    {rec.title}
                  </span>
                  <span className={`badge ${rec.priority === 'High' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.7rem' }}>
                    {rec.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                  {rec.description}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate('/recommendations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'transparent',
              color: '#059669',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '8px 0',
            }}
          >
            <span>Explore all customized eco tips</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EcoRecommendationsCard;
