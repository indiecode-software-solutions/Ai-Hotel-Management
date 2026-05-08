import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Bookings from './pages/admin/Bookings';
import Guests from './pages/admin/Guests';
import PricingEngine from './pages/admin/PricingEngine';
import Reviews from './pages/admin/Reviews';
import MarketAnalytics from './pages/admin/MarketAnalytics';
import RoomInventory from './pages/admin/RoomInventory';
import MyStays from './pages/user/MyStays';
import SplashScreen from './components/ui/SplashScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Sidebar from './components/layout/Sidebar';
import GuestLanding from './pages/user/GuestLanding';
import GuestSearch from './pages/user/GuestSearch';
import VendorOnboarding from './pages/vendor/VendorOnboarding';
import AiChatWidget from './components/ui/AiChatWidget';

function AppContent() {
  const [splashState, setSplashState] = useState('visible'); // visible, animating, hidden
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isGuestPortalRoute = location.pathname.startsWith('/my-stays');
  const isOnboardingRoute = location.pathname === '/onboarding' || location.pathname.startsWith('/onboarding/');

  React.useEffect(() => {
    if (splashState !== 'hidden') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [splashState]);

  return (
    <>
      {splashState !== 'hidden' && (
        <SplashScreen 
          onStartSplit={() => setSplashState('animating')}
          onComplete={() => setSplashState('hidden')}
          currentState={splashState}
        />
      )}

      {/* Put Sidebar at the root - only for Admin routes */}
      {splashState !== 'visible' && isAdminRoute && <Sidebar />}

      <div className={!isAdminRoute && !isOnboardingRoute && !isGuestPortalRoute ? 'guest-app-container' : (splashState === 'hidden' || isAdminRoute || isGuestPortalRoute ? 'app-content-stable' : `app-transition-container ${splashState}`)}>
        <Routes>
          {/* Guest / Public Routes (Now Root) */}
          <Route path="/" element={<GuestLanding />} />
          <Route path="/search" element={<GuestSearch />} />
          <Route path="/my-stays" element={<ProtectedRoute><MyStays /></ProtectedRoute>} />
          
          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin={true}><Bookings /></ProtectedRoute>} />
          <Route path="/admin/guests" element={<ProtectedRoute requireAdmin={true}><Guests /></ProtectedRoute>} />
          <Route path="/admin/rooms" element={<ProtectedRoute requireAdmin={true}><RoomInventory /></ProtectedRoute>} />
          <Route path="/admin/pricing" element={<ProtectedRoute requireAdmin={true}><PricingEngine /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute requireAdmin={true}><Reviews /></ProtectedRoute>} />
          <Route path="/admin/market-analytics" element={<ProtectedRoute requireAdmin={true}><MarketAnalytics /></ProtectedRoute>} />

          {/* Vendor Routes */}
          <Route path="/onboarding" element={<VendorOnboarding />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global AI Chat Assistant for Guests */}
        {!isAdminRoute && !isOnboardingRoute && splashState === 'hidden' && (
          <AiChatWidget />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
