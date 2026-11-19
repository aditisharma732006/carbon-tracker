import React from 'react';
import { Target, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GoalProgressCard = ({ goalData }) => {
  const navigate = useNavigate();

  if (!goalData) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Target size={18} style={{ color: '#059669' }} />
              Carbon Reduction Target
            </h3>
            <p className="card-subtitle">Monthly emissions allowance</p>
          </div>
        </div>

        <div className="empty-state" style={{ padding: '24px 10px' }}>
          <div className="empty-state-icon" style={{ width: 48, height: 48, marginBottom: 12 }}>
            <Target size={22} />
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
            No Target Set for this Month
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: 16 }}>
            Set a monthly carbon target to track your progress and stay within sustainable limits.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/goals')}>
            Set Monthly Goal
          </button>
        </div>
      </div>
    );
  }

  const {
    targetEmissions = 0,
    actualEmissions = 0,
    percentUsed = 0,
    remainingAllowance = 0,
    overage = 0,
  } = goalData;

  const isExceeded = actualEmissions > targetEmissions;
  const isNear = percentUsed >= 85 && !isExceeded;

  let barColor = '#10b981';
  let badgeClass = 'badge-green';
  let statusText = 'Within Budget';

  if (isExceeded) {
    barColor = '#ef4444';
    badgeClass = 'badge-red';
    statusText = 'Target Exceeded';
  } else if (isNear) {
    barColor = '#f59e0b';
    badgeClass = 'badge-orange';
    statusText = 'Near Allowance';
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Target size={18} style={{ color: '#059669' }} />
            Monthly Reduction Goal
          </h3>
          <p className="card-subtitle">Tracking for {goalData.monthYear || 'Current Month'}</p>
        </div>
        <span className={`badge ${badgeClass}`}>
          {isExceeded ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
          {statusText}
        </span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {actualEmissions}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.9rem', marginLeft: 4 }}>
              / {targetEmissions} kg CO₂
            </span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: barColor }}>
            {percentUsed}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            height: 10,
            width: '100%',
            backgroundColor: '#e2e8f0',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, percentUsed)}%`,
              backgroundColor: barColor,
              borderRadius: 999,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: 12,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: '0.85rem',
        }}
      >
        <div>
          <div style={{ color: '#64748b' }}>Remaining Allowance</div>
          <div style={{ fontWeight: 700, color: isExceeded ? '#ef4444' : '#059669', fontSize: '1rem' }}>
            {isExceeded ? `0 kg (Exceeded by ${overage} kg)` : `${remainingAllowance} kg CO₂`}
          </div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Goal Status</div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
            {isExceeded ? 'Exceeded Budget' : 'On Track to Succeed'}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/goals')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'transparent',
          color: '#059669',
          fontSize: '0.875rem',
          fontWeight: 600,
          padding: '6px 0',
        }}
      >
        <span>Manage & adjust goal</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default GoalProgressCard;
