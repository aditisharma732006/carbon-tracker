import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  Target,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Trash2,
  Award,
} from 'lucide-react';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState(null);

  // Form state
  const [targetEmissions, setTargetEmissions] = useState('');
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const { showToast } = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      const [allRes, currRes] = await Promise.all([
        apiClient('/api/goals'),
        apiClient('/api/goals/current'),
      ]);

      if (allRes.success) setGoals(allRes.data || []);
      if (currRes.success && currRes.data) {
        setCurrentGoal(currRes.data);
        setTargetEmissions(currRes.data.targetEmissions);
        setNote(currRes.data.note || '');
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      showToast('Error loading reduction goals', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetEmissions || isNaN(targetEmissions) || parseFloat(targetEmissions) <= 0) {
      showToast('Please enter a valid target emissions number greater than 0', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await apiClient('/api/goals', {
        method: 'POST',
        body: JSON.stringify({
          targetEmissions: parseFloat(targetEmissions),
          monthYear,
          note,
        }),
      });

      if (res.success) {
        showToast('Carbon reduction target saved successfully!', 'success');
        fetchGoals();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save goal', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setGoalToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!goalToDelete) return;
    try {
      const res = await apiClient(`/api/goals/${goalToDelete}`, {
        method: 'DELETE',
      });
      if (res.success) {
        showToast('Goal removed successfully', 'success');
        fetchGoals();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete goal', 'error');
    } finally {
      setGoalToDelete(null);
    }
  };

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          borderRadius: 16,
          padding: '24px 32px',
          color: 'white',
          marginBottom: 28,
          boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Target size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Carbon Reduction Goals</h2>
        </div>
        <p style={{ color: '#d1fae5', fontSize: '0.925rem', maxWidth: 620 }}>
          Commit to monthly carbon emission caps. Monitor your real-time budget, avoid overshooting allowances, and celebrate sustainability milestones.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 28 }}>
        {/* Set / Update Goal Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Target size={18} style={{ color: '#059669' }} />
                Set Monthly Target
              </h3>
              <p className="card-subtitle">Define maximum carbon emissions budget</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="monthYear">
                Target Month
              </label>
              <input
                type="month"
                id="monthYear"
                className="form-control"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="targetEmissions">
                Target Allowance (kg CO₂)
              </label>
              <input
                type="number"
                id="targetEmissions"
                className="form-control"
                placeholder="e.g. 150"
                min="1"
                step="0.5"
                value={targetEmissions}
                onChange={(e) => setTargetEmissions(e.target.value)}
                required
              />
              <span className="form-hint">
                Typical eco-conscious monthly allowance is 100 - 250 kg CO₂
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="note">
                Personal Commitment Note (Optional)
              </label>
              <input
                type="text"
                id="note"
                className="form-control"
                placeholder="e.g. Carpool on Wednesdays and eat vegan on weekends"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%', padding: '12px' }}
            >
              <PlusCircle size={18} />
              <span>{saving ? 'Saving Goal...' : 'Save Monthly Target'}</span>
            </button>
          </form>
        </div>

        {/* Current Month Active Progress */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Award size={18} style={{ color: '#059669' }} />
                Active Month Performance
              </h3>
              <p className="card-subtitle">Status for {currentGoal?.monthYear || new Date().toISOString().slice(0, 7)}</p>
            </div>
            {currentGoal && (
              <span className={`badge ${currentGoal.status === 'Exceeded' ? 'badge-red' : currentGoal.status === 'Near Limit' ? 'badge-orange' : 'badge-green'}`}>
                {currentGoal.status === 'Exceeded' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                {currentGoal.status}
              </span>
            )}
          </div>

          {!currentGoal ? (
            <div className="empty-state" style={{ padding: '36px 16px' }}>
              <div className="empty-state-icon">
                <Target size={28} />
              </div>
              <h4 className="empty-state-title">No Goal Set for Current Month</h4>
              <p className="empty-state-text">
                Use the form on the left to establish your monthly carbon reduction cap.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {currentGoal.actualEmissions}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#64748b', marginLeft: 6 }}>
                    / {currentGoal.targetEmissions} kg CO₂
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: currentGoal.status === 'Exceeded' ? '#ef4444' : currentGoal.status === 'Near Limit' ? '#f59e0b' : '#059669',
                  }}
                >
                  {currentGoal.percentUsed}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: 12,
                  width: '100%',
                  backgroundColor: '#e2e8f0',
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, currentGoal.percentUsed)}%`,
                    backgroundColor: currentGoal.status === 'Exceeded' ? '#ef4444' : currentGoal.status === 'Near Limit' ? '#f59e0b' : '#10b981',
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  padding: 16,
                  backgroundColor: '#f8fafc',
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Remaining Budget</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: currentGoal.remainingAllowance > 0 ? '#059669' : '#e11d48' }}>
                    {currentGoal.remainingAllowance} kg CO₂
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities Recorded</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                    {currentGoal.activitiesCount} logs
                  </div>
                </div>
              </div>

              {currentGoal.note && (
                <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: 8 }}>
                  "{currentGoal.note}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Historical Goals Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Calendar size={18} style={{ color: '#059669' }} />
              Goal History & Milestones
            </h3>
            <p className="card-subtitle">Past and planned carbon reduction commitments</p>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <p style={{ color: '#64748b' }}>No historical targets recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Target Budget</th>
                  <th>Actual Emissions</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((g) => (
                  <tr key={g._id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{g.monthYear}</td>
                    <td>{g.targetEmissions} kg CO₂</td>
                    <td>{g.actualEmissions} kg CO₂</td>
                    <td>{g.percentUsed}%</td>
                    <td>
                      <span className={`badge ${g.status === 'Exceeded' ? 'badge-red' : g.status === 'Near Limit' ? 'badge-orange' : 'badge-green'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.825rem' }}>{g.note || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteClick(g._id)}
                        title="Delete Goal"
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this carbon reduction target?"
        confirmText="Yes, Delete Goal"
      />
    </div>
  );
};

export default GoalsPage;
