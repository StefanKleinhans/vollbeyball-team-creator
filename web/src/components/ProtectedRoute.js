import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="container">
        <div className="error">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;