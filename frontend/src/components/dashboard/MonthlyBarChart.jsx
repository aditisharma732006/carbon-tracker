import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
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
        <div style={{ fontWeight: 600, color: '#0f172a' }}>{label}</div>
        <div style={{ color: '#059669', fontWeight: 700 }}>
          {payload[0].value} kg CO₂
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyBarChart = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <BarChart2 size={18} style={{ color: '#059669' }} />
            Monthly Comparison
          </h3>
          <p className="card-subtitle">Last 6 months total carbon footprint</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="emissions"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
