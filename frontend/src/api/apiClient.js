const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('eco_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If unauthorized, clear token if session expired
    if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/register')) {
      localStorage.removeItem('eco_token');
      localStorage.removeItem('eco_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=true';
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.msg || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};
