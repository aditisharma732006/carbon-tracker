import React from 'react';

const ResultArea = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="result-area">
        <div className="loading">Calculating your carbon footprint...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-area">
        <div className="no-data">
          <h3>No data yet</h3>
          <p>Submit your first activity to see your footprint</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-area">
      <div className="result-card">
        <h3>Your Carbon Footprint</h3>
        <div className={`footprint-value ${result.level.toLowerCase()}`}>
          {result.carbonFootprint} kg CO₂
        </div>
        <div className={`footprint-level ${result.level.toLowerCase()}`}>
          {result.level} Impact
        </div>
        
        <div className="eco-tips">
          <h4>🌱 Eco Tips for You:</h4>
          <ul>
            {result.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        
        <div className="last-updated">
          Last updated: {new Date(result.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ResultArea;