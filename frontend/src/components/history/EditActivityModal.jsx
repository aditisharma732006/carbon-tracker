import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';

const EditActivityModal = ({ isOpen, onClose, activity, onSave, loading }) => {
  const [formData, setFormData] = useState({
    transportType: 'None',
    transportUnitKm: 0,
    electricityUnitKwh: 0,
    cookingType: 'None',
    foodType: 'None',
    shopping: 'None',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        transportType: activity.transportType || 'None',
        transportUnitKm: activity.transportUnitKm || 0,
        electricityUnitKwh: activity.electricityUnitKwh || 0,
        cookingType: activity.cookingType || 'None',
        foodType: activity.foodType || 'None',
        shopping: activity.shopping || 'None',
        date: activity.date ? new Date(activity.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      });
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(activity._id, {
      ...formData,
      transportUnitKm: parseFloat(formData.transportUnitKm) || 0,
      electricityUnitKwh: parseFloat(formData.electricityUnitKwh) || 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="metric-icon-wrap icon-green">
              <Edit3 size={18} />
            </div>
            <h3 className="modal-title">Edit Activity Record</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Transport Type</label>
                <select
                  name="transportType"
                  className="form-select"
                  value={formData.transportType}
                  onChange={handleChange}
                  required
                >
                  <option value="None">None</option>
                  <option value="Car">Car</option>
                  <option value="Electric Car">Electric Car</option>
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Distance (km)</label>
                <input
                  type="number"
                  name="transportUnitKm"
                  className="form-control"
                  value={formData.transportUnitKm}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Electricity (kWh)</label>
                <input
                  type="number"
                  name="electricityUnitKwh"
                  className="form-control"
                  value={formData.electricityUnitKwh}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cooking Type</label>
                <select
                  name="cookingType"
                  className="form-select"
                  value={formData.cookingType}
                  onChange={handleChange}
                  required
                >
                  <option value="None">None</option>
                  <option value="Gas">Gas</option>
                  <option value="Electric">Electric</option>
                  <option value="Induction">Induction</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Food Choice</label>
                <select
                  name="foodType"
                  className="form-select"
                  value={formData.foodType}
                  onChange={handleChange}
                  required
                >
                  <option value="None">None</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Fish">Fish</option>
                  <option value="Pork">Pork</option>
                  <option value="Beef">Beef</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Shopping Type</label>
                <select
                  name="shopping"
                  className="form-select"
                  value={formData.shopping}
                  onChange={handleChange}
                  required
                >
                  <option value="None">None</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Recalculate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal;
