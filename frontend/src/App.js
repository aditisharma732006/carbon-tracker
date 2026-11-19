import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import GoalsPage from './pages/GoalsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

// Main Design System Stylesheet
import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ToastContainer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute title="Executive Dashboard">
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calculator"
                element={
                  <ProtectedRoute title="Carbon Calculator">
                    <CalculatorPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute title="Activity Records & History">
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute title="Visual Intelligence & Analytics">
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/goals"
                element={
                  <ProtectedRoute title="Monthly Reduction Goals">
                    <GoalsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute title="Tailored Eco Recommendations">
                    <RecommendationsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute title="Monthly Carbon Audit Reports">
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute title="User Profile & Security">
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
