import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Bookings from './pages/admin/Bookings';
import Guests from './pages/admin/Guests';
import Pricing from './pages/admin/Pricing';
import PricingEngine from './pages/admin/PricingEngine';
import Reviews from './pages/admin/Reviews';
import MarketAnalytics from './pages/admin/MarketAnalytics';
import SplashScreen from './components/ui/SplashScreen';

import Sidebar from './components/layout/Sidebar';
import GuestLanding from './pages/user/GuestLanding';
import GuestSearch from './pages/user/GuestSearch';
import VendorOnboarding from './pages/vendor/VendorOnboarding';

function AppContent() {
  const [splashState, setSplashState] = useState('visible'); // visible, animating, hidden
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
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

      <div className={!isAdminRoute && !isOnboardingRoute ? 'guest-app-container' : (splashState === 'hidden' ? 'app-content-stable' : `app-transition-container ${splashState}`)}>
        <Routes>
          {/* Guest / Public Routes (Now Root) */}
          <Route path="/" element={<GuestLanding />} />
          <Route path="/search" element={<GuestSearch />} />
          
          {/* Admin Routes (Now Prefixed) */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/guests" element={<Guests />} />
          <Route path="/admin/pricing" element={<PricingEngine />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/market-analytics" element={<MarketAnalytics />} />

          {/* Vendor Routes */}
          <Route path="/onboarding" element={<VendorOnboarding />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
