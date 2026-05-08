import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SplashScreen from '../ui/SplashScreen';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // DEVELOPER MODE: All authentication and role restrictions are disabled
  return children;

  /*
  if (loading) {
    // Show a loading state or the splash screen while checking auth
    return <SplashScreen currentState="visible" />;
  }

  if (!user) {
    // Redirect them to the home page (which has the Auth Modal) if not logged in
    // Optionally we can pass state to trigger the modal open
    return <Navigate to="/" state={{ from: location, openAuth: true }} replace />;
  }

  // FOR DEVELOPMENT: Admin restriction bypassed
  
  if (requireAdmin && user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
  */
};

export default ProtectedRoute;
