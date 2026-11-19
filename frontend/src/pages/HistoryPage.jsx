import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import ActivityDetailModal from '../components/history/ActivityDetailModal';
import EditActivityModal from '../components/history/EditActivityModal';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  Search,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Cloud,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [activities, setActivities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statistics, setStatistics] = useState({ totalFootprint: 0, averageFootprint: 0 });
  const [loading, setLoading] = useState(true);

  // Filters and search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search,
        category,
        sortBy,
        sortOrder,
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      });

      const res = await apiClient(`/api/activities?${params.toString()}`);
      if (res.success) {
        setActivities(res.data || []);
        setTotalCount(res.totalCount || 0);
        setTotalPages(res.totalPages || 1);
        if (res.statistics) setStatistics(res.statistics);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      showToast('Failed to fetch activity records', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category, startDate, endDate, sortBy, sortOrder, showToast]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // View details
  const handleView = (act) => {
    setSelectedActivity(act);
    setDetailModalOpen(true);
  };

  // Edit record
  const handleEdit = (act) => {
    setSelectedActivity(act);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    setEditLoading(true);
    try {
      const res = await apiClient(`/api/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });

      if (res.success) {
        showToast('Activity updated and footprint recalculated!', 'success');
        setEditModalOpen(false);
        fetchActivities();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update activity', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete record
  const handleDeleteClick = (id) => {
    setActivityToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;
    try {
      const res = await apiClient(`/api/activities/${activityToDelete}`, {
        method: 'DELETE',
      });
      if (res.success) {
        showToast('Activity record removed successfully', 'success');
        fetchActivities();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete activity', 'error');
    } finally {
      setActivityToDelete(null);
    }
  };

  const getImpactBadge = (footprint) => {
    if (footprint < 10) return <span className="badge badge-low">Low ({footprint} kg)</span>;
    if (footprint < 20) return <span className="badge badge-moderate">Moderate ({footprint} kg)</span>;
    return <span className="badge badge-high">High ({footprint} kg)</span>;
  };

  return (
    <div>
      {/* Top Banner with Total Emissions for current filtered set */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '20px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          marginBottom: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="metric-icon-wrap icon-green" style={{ width: 44, height: 44 }}>
            <Cloud size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              Filtered Emissions Total
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                {statistics.totalFootprint}
              </span>
              <span style={{ color: '#059669', fontWeight: 600 }}>kg CO₂</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: 8 }}>
                ({totalCount} records matching filters)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/calculator')}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <PlusCircle size={18} />
          <span>Record New Activity</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by vehicle, food, cooking..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: 36 }}
            />
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>
              <option value="Transport">Transportation</option>
              <option value="Electricity">Electricity</option>
              <option value="Food">Food & Diet</option>
              <option value="Cooking">Cooking</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              title="Start Date"
            />
          </div>

          {/* Date Range End */}
          <div>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              title="End Date"
            />
          </div>

          {/* Sorting */}
          <div>
            <select
              className="form-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
                setCurrentPage(1);
              }}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="carbonFootprint-desc">Emissions (Highest First)</option>
              <option value="carbonFootprint-asc">Emissions (Lowest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: '3px solid #d1fae5',
                borderTopColor: '#059669',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 12px',
              }}
            />
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading activity records...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={28} />
            </div>
            <h4 className="empty-state-title">No Activities Found</h4>
            <p className="empty-state-text">
              No carbon calculation entries match your selected search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setStartDate('');
                setEndDate('');
              }}
              className="btn btn-outline btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transport Mode</th>
                    <th>Electricity</th>
                    <th>Cooking</th>
                    <th>Food Choice</th>
                    <th>Shopping</th>
                    <th>Footprint</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => (
                    <tr key={act._id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>
                        {new Date(act.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        {act.transportType !== 'None' ? (
                          <span>
                            {act.transportType} ({act.transportUnitKm} km)
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>None</span>
                        )}
                      </td>
                      <td>{act.electricityUnitKwh} kWh</td>
                      <td>{act.cookingType}</td>
                      <td>{act.foodType}</td>
                      <td>{act.shopping}</td>
                      <td>{getImpactBadge(act.carbonFootprint)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <button
                            onClick={() => handleView(act)}
                            title="View details"
                            className="btn btn-outline btn-sm"
                            style={{ padding: 6 }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleEdit(act)}
                            title="Edit entry"
                            className="btn btn-outline btn-sm"
                            style={{ padding: 6 }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(act._id)}
                            title="Delete entry"
                            className="btn btn-outline btn-sm"
                            style={{ padding: 6, color: '#e11d48' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 20,
                  marginTop: 20,
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Page {currentPage} of {totalPages}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ActivityDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        activity={selectedActivity}
      />

      <EditActivityModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        activity={selectedActivity}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Activity Record"
        message="Are you sure you want to delete this activity record? It will be permanently removed from your emission history."
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default HistoryPage;
