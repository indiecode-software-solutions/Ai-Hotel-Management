import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Tags,
  MessageSquareQuote,
  Settings,
  Globe
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Bookings', icon: <CalendarDays size={20} />, path: '/admin/bookings' },
    { name: 'Guests', icon: <Users size={20} />, path: '/admin/guests' },
    { name: 'Pricing Engine', icon: <Tags size={20} />, path: '/admin/pricing' },
    { name: 'Reviews', icon: <MessageSquareQuote size={20} />, path: '/admin/reviews' },
    { name: 'Analytics', icon: <Globe size={20} />, path: '/admin/market-analytics' },
  ];

  return (
    <aside className="app-sidebar">
      <div className="px-8 mb-12">
        <h1 className="sidebar-logo">
          <span className="sidebar-logo-icon">✦</span>
          RAJ HERITAGE
        </h1>
      </div>

      <nav className="flex-1 flex flex-col px-4 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <span className="nav-link-icon">
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <a href="#settings" className="sidebar-settings">
          <Settings size={20} />
          Settings
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
