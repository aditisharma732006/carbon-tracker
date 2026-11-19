import React from 'react';
import {
  Cloud,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Flame,
  Award,
} from 'lucide-react';

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const {
    totalEmissions = 0,
    todayEmissions = 0,
    weeklyEmissions = 0,
    monthlyEmissions = 0,
    averageDailyEmissions = 0,
    highestCategory = 'None',
    monthlyComparisonPercent = 0,
  } = summary;

  return (
    <div className="metrics-grid">
      {/* Total Lifetime Emissions */}
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">Total Footprint</span>
          <div className="metric-icon-wrap icon-green">
            <Cloud size={18} />
          </div>
        </div>
        <div>
          <span className="metric-value">{totalEmissions}</span>
          <span className="metric-unit">kg CO₂</span>
        </div>
        <div className="metric-footer">
          <span>Across all recorded entries</span>
        </div>
      </div>

      {/* Today's Footprint */}
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">Today's Emissions</span>
          <div className="metric-icon-wrap icon-blue">
            <Clock size={18} />
          </div>
        </div>
        <div>
          <span className="metric-value">{todayEmissions}</span>
          <span className="metric-unit">kg CO₂</span>
        </div>
        <div className="metric-footer">
          <span>{todayEmissions === 0 ? 'No activities today' : 'Activities logged today'}</span>
        </div>
      </div>

      {/* Past 7 Days */}
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">Last 7 Days</span>
          <div className="metric-icon-wrap icon-amber">
            <Calendar size={18} />
          </div>
        </div>
        <div>
          <span className="metric-value">{weeklyEmissions}</span>
          <span className="metric-unit">kg CO₂</span>
        </div>
        <div className="metric-footer">
          <span>Weekly cumulative footprint</span>
        </div>
      </div>

      {/* Monthly Footprint & Comparison */}
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">This Month</span>
          <div className="metric-icon-wrap icon-purple">
            <Calendar size={18} />
          </div>
        </div>
        <div>
          <span className="metric-value">{monthlyEmissions}</span>
          <span className="metric-unit">kg CO₂</span>
        </div>
        <div className="metric-footer">
          {monthlyComparisonPercent !== 0 ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: monthlyComparisonPercent < 0 ? '#059669' : '#e11d48',
                fontWeight: 600,
              }}
            >
              {monthlyComparisonPercent < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {Math.abs(monthlyComparisonPercent)}% {monthlyComparisonPercent < 0 ? 'lower' : 'higher'} vs last month
            </span>
          ) : (
            <span>Current calendar month</span>
          )}
        </div>
      </div>

      {/* Daily Average */}
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">Daily Average</span>
          <div className="metric-icon-wrap icon-green">
            <Award size={18} />
          </div>
        </div>
        <div>
          <span className="metric-value">{averageDailyEmissions}</span>
          <span className="metric-unit">kg/day</span>
        </div>
        <div className="metric-footer">
          <span>Based on active tracking days</span>
        </div>
      </div>

      {/* Highest Category */}
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">Top Impact Source</span>
          <div className="metric-icon-wrap icon-rose">
            <Flame size={18} />
          </div>
        </div>
        <div>
          <span className="metric-value" style={{ fontSize: '1.4rem' }}>
            {highestCategory}
          </span>
        </div>
        <div className="metric-footer">
          <span className="badge badge-amber">Largest contributor</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
