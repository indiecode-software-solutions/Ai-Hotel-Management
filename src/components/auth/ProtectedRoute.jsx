import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SplashScreen from '../ui/SplashScreen';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading state or the splash screen while checking auth
    return <SplashScreen currentState="visible" />;
  }

  if (!user) {
    // Redirect them to the home page (which has the Auth Modal) if not logged in
    // Optionally we can pass state to trigger the modal open
    return <Navigate to="/" state={{ from: location, openAuth: true }} replace />;
  }

  if (requireAdmin && user.user_metadata?.role !== 'admin') {
    // If they are logged in but not an admin, don't let them see the admin routes
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
