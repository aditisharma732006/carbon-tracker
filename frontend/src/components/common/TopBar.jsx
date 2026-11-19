import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, PlusCircle, Leaf, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const TopBar = ({ title, onMenuToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>

      <div className="topbar-right">
        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
        </button>

        <button
          className="btn-header-cta"
          onClick={() => navigate('/calculator')}
        >
          <PlusCircle size={17} />
          <span>Log Activity</span>
        </button>

        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 8,
            transition: 'background 0.15s ease',
          }}
          title="View Profile"
        >
          <div className="user-avatar" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
            {user?.name ? user.name[0].toUpperCase() : <Leaf size={16} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
