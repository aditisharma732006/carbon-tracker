import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('eco_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('eco_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify and fetch latest user profile on startup
  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('eco_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient('/api/auth/profile');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('eco_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Initial session validation failed:', err.message);
      // If unauthorized, token is cleared by apiClient
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success && data.token) {
        localStorage.setItem('eco_token', data.token);
        localStorage.setItem('eco_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // Register handler
  const register = async (name, email, password, location = '') => {
    try {
      const data = await apiClient('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, location }),
      });

      if (data.success && data.token) {
        localStorage.setItem('eco_token', data.token);
        localStorage.setItem('eco_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('eco_token');
    localStorage.removeItem('eco_user');
    setToken(null);
    setUser(null);
  };

  // Profile update
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('eco_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
        refreshProfile: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
