import React, { useState, useEffect } from 'react';
import ActivityForm from '../components/calculator/ActivityForm';
import ResultArea from '../components/calculator/ResultArea';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalculatorPage = () => {
  const [currentResult, setCurrentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load latest result if exists
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await apiClient('/api/activities/result');
        if (res.success && res.data) {
          setCurrentResult(res.data);
        }
      } catch (err) {
        console.error('Failed to load latest result:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleActivitySubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await apiClient('/api/activities', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success && res.data) {
        setCurrentResult(res.data.result);
        showToast('Activity recorded and carbon footprint calculated!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error recording activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <History size={16} />
          <span>View All History</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, alignItems: 'start' }}>
        <div style={{ flex: 1.5 }}>
          <ActivityForm onSubmit={handleActivitySubmit} loading={loading} />
        </div>
        <div style={{ flex: 1 }}>
          <ResultArea result={currentResult} loading={loading || initialLoading} />
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
