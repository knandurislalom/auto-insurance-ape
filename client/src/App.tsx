import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MuiThemeProvider from './components/MuiThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgentDashboard from './pages/AgentDashboard';
import ClaimIntakeFlow from './pages/ClaimIntakeFlow';
import ExistingClaims from './pages/ExistingClaims';
import './App.css';

function App() {
  return (
    <MuiThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Customer Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredUserType="customer">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/claim/new" 
              element={
                <ProtectedRoute requiredUserType="customer">
                  <ClaimIntakeFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/claims" 
              element={
                <ProtectedRoute requiredUserType="customer">
                  <ExistingClaims />
                </ProtectedRoute>
              } 
            />
            
            {/* Agent Routes */}
            <Route 
              path="/agent-dashboard" 
              element={
                <ProtectedRoute requiredUserType="agent">
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;
