import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import AiCommandCenter from '../../features/chatbot/AiCommandCenter';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import { Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [bookingsData, roomsData] = await Promise.all([
        bookingService.getAllBookings(),
        roomService.getRooms()
      ]);
      setBookings(bookingsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const checkInsToday = bookings.filter(b => b.check_in_date === todayStr).length;
  const activeBookings = bookings.filter(b => b.status === 'checked_in' || b.status === 'confirmed').length;
  const occupancyRate = rooms.length > 0 ? Math.round((activeBookings / rooms.length) * 100) : 0;
  
  const totalRevenue = bookings
    .filter(b => ['confirmed', 'checked_in', 'checked_out'].includes(b.status))
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  const stats = [
    { label: 'Today\'s Check-ins', value: checkInsToday.toString(), status: 'Live' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, status: activeBookings > 0 ? 'Active' : 'Neutral' },
    { label: 'Sentiments', value: '4.9', status: 'Excellent', badgeType: 'ai' },
    { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}k`, status: '+15.2%' },
  ];

  const arrivalColumns = [
    { 
      header: 'Guest', 
      key: 'guest',
      render: (val, item) => (
        <div className="flex items-center">
          <div className="cell-avatar">{val.charAt(0)}</div>
          <div>
            <div className="cell-main">{val}</div>
            <span className="cell-sub">{item.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Room', key: 'room' },
    { 
      header: 'Status', 
      key: 'status',
      render: (val) => <Badge status={val.toLowerCase()}>{val}</Badge>
    }
  ];

  const recentArrivals = bookings.slice(0, 5).map(b => ({
    guest: b.users?.full_name || 'Unknown Guest',
    email: b.users?.email || 'N/A',
    room: b.rooms?.title || b.rooms?.type || 'TBD',
    status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
  }));

  return (
    <DashboardLayout>
      {/* 🎯 HERO SECTION (AI COMMAND CENTER) */}
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-glass-container animate-hero">
          <AiCommandCenter />
        </div>
      </div>

      {/* QUICK STATS (SECONDARY HIERARCHY) */}
      <div className="grid grid-cols-4 gap-10 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} variant="glass" className="p-8">
            <h3 className="text-muted font-semibold mb-5 uppercase text-sm tracking-widest">
              {stat.label}
            </h3>
            <div className="text-primary font-extrabold mb-5 text-5xl tracking-tight">
              {isLoading ? <Loader2 className="animate-spin text-accent" size={24} /> : stat.value}
            </div>
            <Badge status={stat.badgeType || 'success'}>{stat.status}</Badge>
          </Card>
        ))}
      </div>

      <div className="mt-0">
        <Card variant="solid" className="p-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-extrabold mb-3 text-4xl">Recent Arrivals</h2>
              <p className="text-muted text-lg">Your guests are your priority. View latest check-ins and housekeeping status.</p>
            </div>
            <Button variant="accent">View Full Ledger</Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="animate-spin text-accent" size={48} />
            </div>
          ) : (
            <Table columns={arrivalColumns} data={recentArrivals} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

