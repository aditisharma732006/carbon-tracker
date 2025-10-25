import React from 'react';

const HistoryChart = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="history-chart">
        <div className="loading">Loading history...</div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="history-chart">
        <div className="no-data">
          <h3>No records yet</h3>
          <p>Your activity history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-chart">
      <h3>Activity History</h3>
      <div className="history-list">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity._id} className="history-item">
            <div className="activity-date">
              {new Date(activity.date).toLocaleDateString()}
            </div>
            <div className="activity-details">
              <span className="footprint">{activity.carbonFootprint} kg CO₂</span>
              <span className="transport">{activity.transportType}</span>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > 5 && (
        <div className="history-more">
          +{activities.length - 5} more activities
        </div>
      )}
      
      <div className="history-stats">
        <div className="stat">
          <span className="stat-label">Total Activities:</span>
          <span className="stat-value">{activities.length}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;