import React, { useState, useEffect } from 'react';
import ActivityForm from './ActivityForm';
import ResultArea from './ResultArea';
import HistoryChart from './HistoryChart';
import '../styles/HomePage.css';

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ✅ ADD: API URL for both development and production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch all activities on component mount
  const fetchActivities = async () => {
    try {
      // ✅ UPDATE: Use API_URL
      const response = await fetch(`${API_URL}/api/activities`);
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch latest result
  const fetchLatestResult = async () => {
    try {
      // ✅ UPDATE: Use API_URL
      const response = await fetch(`${API_URL}/api/activities/result`);
      const data = await response.json();
      if (data.success) {
        setCurrentResult(data.data);
      }
    } catch (error) {
      console.error('Error fetching result:', error);
    }
  };

  // Handle form submission
  const handleActivitySubmit = async (formData) => {
    setLoading(true);
    try {
      // ✅ UPDATE: Use API_URL
      const response = await fetch(`${API_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh both activities and result
        await Promise.all([fetchActivities(), fetchLatestResult()]);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting activity:', error);
      alert('Error submitting activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchActivities();
    fetchLatestResult();
  }, []);

  return (
    <div className="homepage">
      <div className="dashboard-container">
        {/* LEFT SIDE */}
        <div className="left-section">
          <ResultArea 
            result={currentResult} 
            loading={loading}
          />
          <HistoryChart 
            activities={activities}
            loading={loading}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <ActivityForm 
            onSubmit={handleActivitySubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
