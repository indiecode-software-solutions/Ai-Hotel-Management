import React from 'react';
import Navbar from './Navbar';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-root">
      <div className="dashboard-main-container">
        <Navbar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
