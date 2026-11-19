import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../api/apiClient';
import {
  User,
  Calendar,
  Lock,
  Cloud,
  Award,
  Target,
  Save,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    profileImage: user?.profileImage || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [stats, setStats] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await apiClient('/api/auth/profile');
        if (res.success) {
          if (res.user) {
            setProfileData({
              name: res.user.name || '',
              location: res.user.location || '',
              profileImage: res.user.profileImage || '',
            });
          }
          if (res.stats) setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      }
    };
    fetchUserStats();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await apiClient('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (res.success && res.user) {
        updateUser(res.user);
        showToast('Profile information updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error updating profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await apiClient('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.success) {
        showToast('Password changed successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  ];

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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <User size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Account & Sustainability Profile</h2>
        </div>
        <p style={{ color: '#d1fae5', fontSize: '0.925rem' }}>
          Manage your personal credentials, contact information, and review lifetime climate action milestones.
        </p>
      </div>

      {/* Lifetime Stats Cards Row */}
      <div className="metrics-grid" style={{ marginBottom: 28 }}>
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Total Activities</span>
            <div className="metric-icon-wrap icon-blue">
              <Calendar size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value">{stats?.totalActivities || 0}</span>
            <span className="metric-unit">logged</span>
          </div>
          <div className="metric-footer">
            <span>Lifetime tracked records</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Lifetime Carbon Footprint</span>
            <div className="metric-icon-wrap icon-green">
              <Cloud size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value">{stats?.totalEmissions || 0}</span>
            <span className="metric-unit">kg CO₂</span>
          </div>
          <div className="metric-footer">
            <span>Cumulative environmental impact</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Average Per Activity</span>
            <div className="metric-icon-wrap icon-amber">
              <Award size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value">{stats?.averagePerActivity || 0}</span>
            <span className="metric-unit">kg CO₂</span>
          </div>
          <div className="metric-footer">
            <span>Average footprint per calculation</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Current Goal Progress</span>
            <div className="metric-icon-wrap icon-purple">
              <Target size={18} />
            </div>
          </div>
          <div>
            <span className="metric-value">
              {stats?.currentGoal ? `${stats.currentGoal.percentAchieved}%` : 'No Goal'}
            </span>
          </div>
          <div className="metric-footer">
            <span>
              {stats?.currentGoal
                ? `${stats.currentGoal.remaining} kg remaining allowance`
                : 'Set target in Goals tab'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Edit Profile Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <User size={18} style={{ color: '#059669' }} />
                Personal Information
              </h3>
              <p className="card-subtitle">Update your profile details and avatar</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            {/* Avatar Selector */}
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Profile Avatar</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="user-avatar" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Avatar" className="user-avatar-img" />
                  ) : (
                    user?.name ? user.name[0].toUpperCase() : 'U'
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {avatarPresets.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="Preset"
                      onClick={() => setProfileData((p) => ({ ...p, profileImage: imgUrl }))}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: profileData.profileImage === imgUrl ? '2px solid #059669' : '2px solid transparent',
                        transition: 'transform 0.15s ease',
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setProfileData((p) => ({ ...p, profileImage: '' }))}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                value={profileData.name}
                onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
              <span className="form-hint">Email address cannot be changed</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                City / Region
              </label>
              <input
                id="location"
                type="text"
                className="form-control"
                placeholder="e.g. Toronto, Canada"
                value={profileData.location}
                onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Member Since</label>
              <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileLoading}
              style={{ width: '100%', padding: 12 }}
            >
              <Save size={16} />
              <span>{profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Lock size={18} style={{ color: '#059669' }} />
                Security & Password
              </h3>
              <p className="card-subtitle">Keep your account protected</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                className="form-control"
                placeholder="Re-enter new password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={passwordLoading}
              style={{ width: '100%', padding: 12, marginTop: 14 }}
            >
              <Lock size={16} />
              <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
