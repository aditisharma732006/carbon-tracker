import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        showToast(`Welcome back, ${result.user?.name}!`, 'success');
        navigate(from, { replace: true });
      } else {
        setError(result.error);
        showToast(result.error, 'error');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-icon-wrapper" style={{ width: 44, height: 44 }}>
              <Leaf size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Eco<span style={{ color: '#059669' }}>Track</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: 16 }}>
            Sign In to Your Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
            Access your personalized carbon dashboard and reduction goals
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#e11d48',
                fontSize: '0.85rem',
                marginBottom: 20,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: 10 }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#059669', fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
