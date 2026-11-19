import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          padding: '10px 14px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#059669', fontWeight: 700 }}>
          {payload[0].value} kg CO₂
        </div>
      </div>
    );
  }
  return null;
};

const DailyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b' }}>No trend data available yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <TrendingUp size={18} style={{ color: '#059669' }} />
            Daily Carbon Emissions Trend
          </h3>
          <p className="card-subtitle">Last 14 days emission timeline (kg CO₂)</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="formattedDate"
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
            <Area
              type="monotone"
              dataKey="emissions"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorEmissions)"
              dot={{ r: 3, fill: '#059669', strokeWidth: 1, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyTrendChart;
