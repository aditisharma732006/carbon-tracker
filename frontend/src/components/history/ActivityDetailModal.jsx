import React from 'react';
import { X, Cloud, Car, Zap, Flame, Utensils, ShoppingBag } from 'lucide-react';

const ActivityDetailModal = ({ isOpen, onClose, activity }) => {
  if (!isOpen || !activity) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="metric-icon-wrap icon-green">
              <Cloud size={18} />
            </div>
            <div>
              <h3 className="modal-title">Activity Calculation Details</h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {new Date(activity.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Footprint Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#064e3b' }}>
              {activity.carbonFootprint}
            </span>
            <span style={{ color: '#047857', fontWeight: 600 }}>kg CO₂ Total Footprint</span>
          </div>

          {/* Breakdown Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Car size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Transportation</span>
              </div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {activity.transportType} ({activity.transportUnitKm} km)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={16} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Electricity</span>
              </div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {activity.electricityUnitKwh} kWh
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Flame size={16} style={{ color: '#ef4444' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Cooking Method</span>
              </div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {activity.cookingType}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Utensils size={16} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Food & Diet</span>
              </div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {activity.foodType}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={16} style={{ color: '#8b5cf6' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Shopping</span>
              </div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {activity.shopping}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
