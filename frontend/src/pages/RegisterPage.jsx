import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.location
      );

      if (result.success) {
        showToast('Registration successful! Welcome to EcoTrack.', 'success');
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error);
        showToast(result.error, 'error');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
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
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-icon-wrapper" style={{ width: 44, height: 44 }}>
              <Leaf size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Eco<span style={{ color: '#059669' }}>Track</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: 14 }}>
            Create Your EcoTrack Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
            Start measuring and reducing your personal carbon emissions
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
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <User
                  size={18}
                  style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                City / Location <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                />
                <MapPin
                  size={18}
                  style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Lock
                    size={18}
                    style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    placeholder="Re-enter"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Lock
                    size={18}
                    style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: 10 }}
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
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
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#059669', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
