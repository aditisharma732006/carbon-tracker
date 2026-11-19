import React, { useState, useMemo } from 'react';
import {
  Car,
  Zap,
  Flame,
  Utensils,
  ShoppingBag,
  Calendar,
  Calculator,
  RefreshCw,
} from 'lucide-react';

// Exact emission factors preserved from backend
const emissionFactors = {
  transport: {
    'None': 0,
    'Car': 0.21,
    'Bus': 0.09,
    'Train': 0.04,
    'Bike': 0,
    'Motorcycle': 0.11,
    'Electric Car': 0.05
  },
  electricity: 0.5,
  cooking: {
    'None': 0,
    'Gas': 2.0,
    'Electric': 1.2,
    'Induction': 0.4
  },
  food: {
    'None': 0,
    'Beef': 3.3,
    'Chicken': 1.4,
    'Vegetarian': 0.8,
    'Vegan': 0.5,
    'Fish': 1.8,
    'Pork': 2.0
  },
  shopping: {
    'None': 0,
    'Clothes': 15.0,
    'Electronics': 50.0,
    'Furniture': 80.0,
    'Plastic': 2.0,
    'Groceries': 5.0
  }
};

const ActivityForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    transportType: 'Car',
    transportUnitKm: '15',
    electricityUnitKwh: '8',
    cookingType: 'Gas',
    foodType: 'Chicken',
    shopping: 'Groceries',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Instant live calculation estimate
  const liveFootprint = useMemo(() => {
    let total = 0;
    const km = parseFloat(formData.transportUnitKm) || 0;
    const kwh = parseFloat(formData.electricityUnitKwh) || 0;

    total += km * (emissionFactors.transport[formData.transportType] || 0);
    total += kwh * emissionFactors.electricity;
    total += emissionFactors.cooking[formData.cookingType] || 0;
    total += emissionFactors.food[formData.foodType] || 0;
    total += emissionFactors.shopping[formData.shopping] || 0;

    return Math.round(total * 100) / 100;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      transportUnitKm: parseFloat(formData.transportUnitKm) || 0,
      electricityUnitKwh: parseFloat(formData.electricityUnitKwh) || 0,
    };

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      transportType: 'None',
      transportUnitKm: '0',
      electricityUnitKwh: '0',
      cookingType: 'None',
      foodType: 'None',
      shopping: 'None',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Calculator size={18} style={{ color: '#059669' }} />
            Carbon Footprint Calculator
          </h3>
          <p className="card-subtitle">
            Enter your daily activities to calculate exact carbon emissions
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-outline btn-sm"
          title="Reset fields"
        >
          <RefreshCw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {/* 1. Transportation */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="metric-icon-wrap icon-green" style={{ width: 28, height: 28 }}>
                <Car size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Transportation
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label" htmlFor="transportType">
                Vehicle Mode
              </label>
              <select
                id="transportType"
                name="transportType"
                className="form-select"
                value={formData.transportType}
                onChange={handleChange}
                required
              >
                <option value="None">None (Walking / Staying Home)</option>
                <option value="Car">Car (Petrol / Diesel - 0.21 kg/km)</option>
                <option value="Electric Car">Electric Car (0.05 kg/km)</option>
                <option value="Bus">Public Bus (0.09 kg/km)</option>
                <option value="Train">Subway / Train (0.04 kg/km)</option>
                <option value="Motorcycle">Motorcycle (0.11 kg/km)</option>
                <option value="Bike">Bicycle (0.00 kg/km)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="transportUnitKm">
                Distance Travelled (km)
              </label>
              <input
                type="number"
                id="transportUnitKm"
                name="transportUnitKm"
                className="form-control"
                value={formData.transportUnitKm}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* 2. Electricity Usage */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="metric-icon-wrap icon-amber" style={{ width: 28, height: 28 }}>
                <Zap size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Electricity Consumption
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label" htmlFor="electricityUnitKwh">
                Electricity Usage (kWh)
              </label>
              <input
                type="number"
                id="electricityUnitKwh"
                name="electricityUnitKwh"
                className="form-control"
                value={formData.electricityUnitKwh}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Enter kWh"
                required
              />
              <span className="form-hint">Emission factor: 0.50 kg CO₂ per kWh</span>
            </div>
          </div>

          {/* 3. Cooking Energy */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="metric-icon-wrap icon-rose" style={{ width: 28, height: 28 }}>
                <Flame size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Cooking Method
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="cookingType">
                Primary Cooking Fuel
              </label>
              <select
                id="cookingType"
                name="cookingType"
                className="form-select"
                value={formData.cookingType}
                onChange={handleChange}
                required
              >
                <option value="None">None (Dining Out / Cold Food)</option>
                <option value="Gas">LPG Gas (2.00 kg CO₂/day)</option>
                <option value="Electric">Electric Stove (1.20 kg CO₂/day)</option>
                <option value="Induction">Induction Cooktop (0.40 kg CO₂/day)</option>
              </select>
            </div>
          </div>

          {/* 4. Food & Diet */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="metric-icon-wrap icon-blue" style={{ width: 28, height: 28 }}>
                <Utensils size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Diet & Food Choice
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="foodType">
                Main Meal Type
              </label>
              <select
                id="foodType"
                name="foodType"
                className="form-select"
                value={formData.foodType}
                onChange={handleChange}
                required
              >
                <option value="None">None</option>
                <option value="Vegan">Vegan (0.50 kg CO₂/day)</option>
                <option value="Vegetarian">Vegetarian (0.80 kg CO₂/day)</option>
                <option value="Chicken">Chicken / Poultry (1.40 kg CO₂/day)</option>
                <option value="Fish">Fish / Seafood (1.80 kg CO₂/day)</option>
                <option value="Pork">Pork (2.00 kg CO₂/day)</option>
                <option value="Beef">Beef / Red Meat (3.30 kg CO₂/day)</option>
              </select>
            </div>
          </div>

          {/* 5. Shopping & Consumer Goods */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="metric-icon-wrap icon-purple" style={{ width: 28, height: 28 }}>
                <ShoppingBag size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Purchases & Shopping
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="shopping">
                Purchase Category
              </label>
              <select
                id="shopping"
                name="shopping"
                className="form-select"
                value={formData.shopping}
                onChange={handleChange}
                required
              >
                <option value="None">No Major Shopping</option>
                <option value="Plastic">Plastic & Disposables (2.00 kg)</option>
                <option value="Groceries">General Groceries (5.00 kg)</option>
                <option value="Clothes">Apparel & Footwear (15.00 kg)</option>
                <option value="Electronics">Electronics / Gadgets (50.00 kg)</option>
                <option value="Furniture">Furniture & Home Decor (80.00 kg)</option>
              </select>
            </div>
          </div>

          {/* 6. Activity Date */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="metric-icon-wrap icon-green" style={{ width: 28, height: 28 }}>
                <Calendar size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Activity Date
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="date">
                Date of Record
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Action Bar */}
        <div
          style={{
            marginTop: 24,
            padding: '16px 20px',
            backgroundColor: '#ecfdf5',
            borderRadius: 12,
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 600, textTransform: 'uppercase' }}>
              Estimated Footprint
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064e3b' }}>
                {liveFootprint}
              </span>
              <span style={{ color: '#047857', fontWeight: 600 }}>kg CO₂</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '12px 28px', fontSize: '1rem' }}
          >
            <Calculator size={18} />
            <span>{loading ? 'Calculating & Saving...' : 'Save & Calculate Footprint'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
