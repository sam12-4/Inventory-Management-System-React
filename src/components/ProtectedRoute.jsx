// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ requiresAuth }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated
  const location = useLocation();

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  if (!requiresAuth && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
