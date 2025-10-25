import React, { useState } from 'react';

const ActivityForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    transportType: 'None',
    transportUnitKm: '',
    electricityUnitKwh: '',
    cookingType: 'None',
    foodType: 'None',
    shopping: 'None'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numeric fields to numbers
    const submitData = {
      ...formData,
      transportUnitKm: parseFloat(formData.transportUnitKm) || 0,
      electricityUnitKwh: parseFloat(formData.electricityUnitKwh) || 0
    };
    
    onSubmit(submitData);
    
    // Reset form after submission (optional)
    setFormData({
      transportType: 'None',
      transportUnitKm: '',
      electricityUnitKwh: '',
      cookingType: 'None',
      foodType: 'None',
      shopping: 'None'
    });
  };

  return (
    <div className="activity-form-container">
      <h2>Add Your Daily Activities</h2>
      <form onSubmit={handleSubmit} className="activity-form">
        
        {/* Transportation */}
        <div className="form-group">
          <label htmlFor="transportType">Transportation Type</label>
          <select
            id="transportType"
            name="transportType"
            value={formData.transportType}
            onChange={handleChange}
            required
          >
            <option value="None">No Transportation</option>
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Bike">Bike</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Electric Car">Electric Car</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transportUnitKm">Distance (km)</label>
          <input
            type="number"
            id="transportUnitKm"
            name="transportUnitKm"
            value={formData.transportUnitKm}
            onChange={handleChange}
            min="0"
            step="0.1"
            placeholder="Enter distance in km"
            required
          />
        </div>

        {/* Electricity */}
        <div className="form-group">
          <label htmlFor="electricityUnitKwh">Electricity Usage (kWh)</label>
          <input
            type="number"
            id="electricityUnitKwh"
            name="electricityUnitKwh"
            value={formData.electricityUnitKwh}
            onChange={handleChange}
            min="0"
            step="0.1"
            placeholder="Enter electricity in kWh"
            required
          />
        </div>

        {/* Cooking */}
        <div className="form-group">
          <label htmlFor="cookingType">Cooking Type</label>
          <select
            id="cookingType"
            name="cookingType"
            value={formData.cookingType}
            onChange={handleChange}
            required
          >
            <option value="None">No Cooking</option>
            <option value="Gas">Gas</option>
            <option value="Electric">Electric</option>
            <option value="Induction">Induction</option>
          </select>
        </div>

        {/* Food */}
        <div className="form-group">
          <label htmlFor="foodType">Food Type</label>
          <select
            id="foodType"
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            required
          >
            <option value="None">No Food</option>
            <option value="Chicken">Chicken</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Fish">Fish</option>
            <option value="Pork">Pork</option>
          </select>
        </div>

        {/* Shopping */}
        <div className="form-group">
          <label htmlFor="shopping">Shopping Type</label>
          <select
            id="shopping"
            name="shopping"
            value={formData.shopping}
            onChange={handleChange}
            required
          >
            <option value="None">No Shopping</option>
            <option value="Clothes">Clothes</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Plastic">Plastic</option>
            <option value="Groceries">Groceries</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Calculate Carbon Footprint'}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;