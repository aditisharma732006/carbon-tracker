import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = {
  Transportation: '#10b981',
  Electricity: '#f59e0b',
  Cooking: '#ef4444',
  Food: '#3b82f6',
  Shopping: '#8b5cf6',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          background: 'white',
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          fontSize: '0.85rem',
        }}
      >
        <span style={{ fontWeight: 600, color: data.payload.color || '#0f172a' }}>
          {data.name}:
        </span>{' '}
        <span style={{ fontWeight: 700 }}>{data.value} kg CO₂</span>
      </div>
    );
  }
  return null;
};

const CategoryDonutChart = ({ categoryTotals, chartData }) => {
  const hasData = chartData && chartData.length > 0;
  const total = hasData ? chartData.reduce((acc, curr) => acc + curr.value, 0) : 0;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <PieIcon size={18} style={{ color: '#059669' }} />
            Category Distribution
          </h3>
          <p className="card-subtitle">Breakdown by emission sector</p>
        </div>
      </div>

      {!hasData ? (
        <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No categorized activities recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ width: 220, height: 220, margin: '0 auto', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || entry.color || '#10b981'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {Math.round(total)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>kg CO₂</div>
            </div>
          </div>

          {/* Legend list */}
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chartData.map((cat) => {
              const percentage = total > 0 ? Math.round((cat.value / total) * 100) : 0;
              const color = COLORS[cat.name] || cat.color || '#10b981';
              return (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ color: '#334155', fontWeight: 500 }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{cat.value} kg</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', width: 34, textAlign: 'right' }}>
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDonutChart;
