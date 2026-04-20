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
  const isGuestRoute = location.pathname === '/booking' || location.pathname.startsWith('/booking/');
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
      {splashState !== 'visible' && !isGuestRoute && !isOnboardingRoute && <Sidebar />}

      <div className={isGuestRoute || isOnboardingRoute ? 'guest-app-container' : (splashState === 'hidden' ? 'app-content-stable' : `app-transition-container ${splashState}`)}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/pricing" element={<PricingEngine />} />
          <Route path="/pricing-old" element={<Pricing />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/market-analytics" element={<MarketAnalytics />} />

          {/* Guest Routes (Renamed to Booking) */}
          <Route path="/booking" element={<GuestLanding />} />
          <Route path="/booking/search" element={<GuestSearch />} />
          <Route path="/booking/*" element={<Navigate to="/booking" replace />} />

          {/* Vendor Routes */}
          <Route path="/onboarding" element={<VendorOnboarding />} />

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
