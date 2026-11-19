import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  BarChart3,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--text-main)' }}>
      {/* Header Navigation */}
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-surface)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="brand-icon-wrapper">
            <Leaf size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Eco<span style={{ color: '#059669' }}>Track</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: 1120,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'var(--color-primary-50)',
            color: '#059669',
            padding: '6px 16px',
            borderRadius: 999,
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: 24,
            border: '1px solid var(--border-color)',
          }}
        >
          <Leaf size={16} />
          <span>Next-Generation Carbon Intelligence Platform</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}
        >
          Measure, Understand & <br />
          <span style={{ color: '#059669' }}>Reduce Your Carbon Footprint</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          Track daily commute emissions, home electricity, food consumption, and consumer habits.
          Set reduction targets and unlock personalized sustainability action plans.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 10 }}
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Start Tracking Free'}</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/calculator')}
            className="btn btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 10 }}
          >
            <span>Try Carbon Calculator</span>
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '80px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Everything You Need for Personal Climate Action
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
              Rigorous emission factors, intuitive visual dashboards, and goal tracking tailored to your lifestyle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div className="card" style={{ padding: 28 }}>
              <div className="metric-icon-wrap icon-green" style={{ width: 44, height: 44, marginBottom: 16 }}>
                <BarChart3 size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                Advanced Visual Analytics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Interactive daily trends, category doughnut distributions, and 6-month comparisons powered by real data.
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div className="metric-icon-wrap icon-blue" style={{ width: 44, height: 44, marginBottom: 16 }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                Monthly Reduction Goals
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Define emissions caps, monitor real-time completion percentages, and get notified before exceeding limits.
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div className="metric-icon-wrap icon-amber" style={{ width: 44, height: 44, marginBottom: 16 }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                Tailored Eco Recommendations
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Rule-based suggestions pinpointing your highest emission sectors with estimated monthly savings.
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div className="metric-icon-wrap icon-purple" style={{ width: 44, height: 44, marginBottom: 16 }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                Secure Multi-User Privacy
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                JWT-secured sessions, encrypted passwords, and complete user-level data isolation for all activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '32px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© {new Date().getFullYear()} EcoTrack Platform. Designed for personal and collective environmental accountability.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
