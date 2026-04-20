import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import Input from '../ui/Input';

export const Navbar = () => {
  return (
    <header className="app-navbar">
      
      <div className="nav-search-container">
        <div className="relative w-full">
          <Search size={18} className="nav-search-icon" />
          <Input placeholder="Search guests, bookings, rooms..." className="nav-search-input" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="nav-notification">
          <Bell size={22} />
          <span className="nav-notification-dot"></span>
        </div>

        <div className="nav-divider"></div>

        <div className="nav-profile">
          <div className="nav-avatar">
            <User size={18} />
          </div>
          <div>
            <div className="nav-user-name">Admin User</div>
            <div className="nav-user-role">Manager</div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
