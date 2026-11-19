import React from 'react';
  import { NavLink, useNavigate } from 'react-router-dom';
  import { useAuth } from '../../context/AuthContext';
  import {
    LayoutDashboard,
    Calculator,
    History,
    BarChart3,
    Target,
    Sparkles,
    FileText,
    User,
    LogOut,
    Leaf,
    X,
  } from 'lucide-react';

  const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    const getInitials = (name) => {
      if (!name) return 'U';
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              zIndex: 45,
            }}
          />
        )}

        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
          {/* Brand header */}
          <div className="sidebar-brand">
            <div className="brand-icon-wrapper">
              <Leaf size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="brand-title">
                Eco<span>Track</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Carbon Intelligence</div>
            </div>
            {isOpen && (
              <button
                onClick={onClose}
                className="modal-close-btn"
                style={{ display: 'flex' }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <div className="nav-section-title">Core Platform</div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/calculator"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Calculator size={18} />
              <span>Log Activity</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <History size={18} />
              <span>Activity History</span>
            </NavLink>

            <div className="nav-section-title" style={{ marginTop: 8 }}>Insights & Planning</div>

            <NavLink
              to="/analytics"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/goals"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Target size={18} />
              <span>Carbon Goals</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Sparkles size={18} />
              <span>Eco Suggestions</span>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <FileText size={18} />
              <span>Monthly Reports</span>
            </NavLink>

            <div className="nav-section-title" style={{ marginTop: 8 }}>Account</div>

            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <User size={18} />
              <span>Profile & Stats</span>
            </NavLink>
          </nav>

          {/* User profile footer */}
          <div className="sidebar-footer">
            <div className="sidebar-user-card">
              <div className="user-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="user-avatar-img" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.name || 'User'}</div>
                <div className="user-email">{user?.email || 'user@ecotrack.io'}</div>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  padding: 6,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  };

  export default Sidebar;
