import React from 'react';
import { History, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentActivitiesTable = ({ activities = [], onDeleteClick }) => {
  const navigate = useNavigate();

  const getImpactBadge = (footprint) => {
    if (footprint < 10) return <span className="badge badge-low">Low ({footprint} kg)</span>;
    if (footprint < 20) return <span className="badge badge-moderate">Moderate ({footprint} kg)</span>;
    return <span className="badge badge-high">High ({footprint} kg)</span>;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <History size={18} style={{ color: '#059669' }} />
            Recent Activity Entries
          </h3>
          <p className="card-subtitle">Latest carbon footprint calculations</p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.8rem' }}
        >
          View All History
        </button>
      </div>

      {activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
          <Calendar size={28} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
          <p style={{ fontSize: '0.9rem' }}>No activity records logged yet.</p>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => navigate('/calculator')}
          >
            Calculate Your First Activity
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transport</th>
                <th>Electricity</th>
                <th>Food & Cooking</th>
                <th>Shopping</th>
                <th>Emissions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.slice(0, 5).map((act) => (
                <tr key={act._id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>
                    {new Date(act.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    {act.transportType !== 'None' ? (
                      <span>
                        {act.transportType} ({act.transportUnitKm} km)
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td>
                    {act.electricityUnitKwh > 0 ? (
                      <span>{act.electricityUnitKwh} kWh</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>0 kWh</span>
                    )}
                  </td>
                  <td>
                    <span>
                      {act.foodType !== 'None' ? act.foodType : 'None'} • {act.cookingType !== 'None' ? act.cookingType : 'None'}
                    </span>
                  </td>
                  <td>
                    {act.shopping !== 'None' ? (
                      <span>{act.shopping}</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td>{getImpactBadge(act.carbonFootprint)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onDeleteClick(act._id)}
                      title="Delete activity"
                      style={{
                        background: 'transparent',
                        color: '#94a3b8',
                        padding: 6,
                        borderRadius: 6,
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentActivitiesTable;
