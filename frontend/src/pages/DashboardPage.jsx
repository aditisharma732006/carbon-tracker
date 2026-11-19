import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../api/apiClient';
import SummaryCards from '../components/dashboard/SummaryCards';
import DailyTrendChart from '../components/dashboard/DailyTrendChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import GoalProgressCard from '../components/dashboard/GoalProgressCard';
import EcoRecommendationsCard from '../components/dashboard/EcoRecommendationsCard';
import RecentActivitiesTable from '../components/dashboard/RecentActivitiesTable';
import ConfirmModal from '../components/common/ConfirmModal';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { Sparkles, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [activities, setActivities] = useState([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [analyticsRes, goalRes, recsRes, activitiesRes] = await Promise.all([
        apiClient('/api/activities/analytics'),
        apiClient('/api/goals/current'),
        apiClient('/api/activities/recommendations'),
        apiClient('/api/activities?limit=5'),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (goalRes.success) setCurrentGoal(goalRes.data);
      if (recsRes.success) setRecommendationsData(recsRes);
      if (activitiesRes.success) setActivities(activitiesRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      showToast('Failed to load some dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDeleteClick = (id) => {
    setActivityToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      const res = await apiClient(`/api/activities/${activityToDelete}`, {
        method: 'DELETE',
      });

      if (res.success) {
        showToast('Activity record removed successfully', 'success');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete activity', 'error');
    } finally {
      setActivityToDelete(null);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
          borderRadius: 16,
          padding: '28px 32px',
          color: 'white',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#a7f3d0', marginBottom: 6 }}>
            <Sparkles size={16} />
            <span>Sustainability Intelligence</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {getGreeting()}, {user?.name || 'Climate Leader'}!
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '0.925rem', maxWidth: 580 }}>
            Track your daily emissions, stay within your monthly reduction target, and explore tailored tips to lower your footprint.
          </p>
        </div>

        <button
          onClick={() => navigate('/calculator')}
          className="btn"
          style={{
            backgroundColor: 'white',
            color: '#065f46',
            fontWeight: 700,
            padding: '12px 22px',
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <PlusCircle size={18} />
          <span>Log Daily Activity</span>
        </button>
      </div>

      {/* 1. Summary Statistics Cards */}
      <SummaryCards summary={analytics?.summary} />

      {/* 2. Visualizations Row 1: Daily Trend & Category Donut */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
          marginBottom: 28,
        }}
      >
        <DailyTrendChart data={analytics?.dailyTrend} />
        <CategoryDonutChart
          categoryTotals={analytics?.categoryTotals}
          chartData={analytics?.categoryChartData}
        />
      </div>

      {/* 3. Visualizations Row 2: Monthly Comparison Bar & Goal Progress */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
          marginBottom: 28,
        }}
      >
        <MonthlyBarChart data={analytics?.monthlyComparison} />
        <GoalProgressCard goalData={currentGoal} />
      </div>

      {/* 4. Row 3: Eco Recommendations & Recent Activities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
        }}
      >
        <EcoRecommendationsCard
          recommendations={recommendationsData?.recommendations}
          topContributor={recommendationsData?.topContributor}
        />
        <RecentActivitiesTable
          activities={activities}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Activity Record"
        message="Are you sure you want to delete this activity record? It will be permanently removed from your emission history and analytics."
        confirmText="Yes, Delete Record"
      />
    </div>
  );
};

export default DashboardPage;
