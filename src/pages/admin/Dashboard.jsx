import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import AiCommandCenter from '../../features/chatbot/AiCommandCenter';

export const Dashboard = () => {
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

  const recentArrivals = [
    { guest: 'Alexander Wright', email: 'alex.w@icloud.com', room: 'Suite 402', status: 'Confirmed' },
    { guest: 'Elena Rodriguez', email: 'elena.rodriguez@gmail.com', room: 'Deluxe 108', status: 'Pending' },
    { guest: 'Marcus Chen', email: 'm.chen@techcorp.io', room: 'Executive 305', status: 'Confirmed' },
  ];

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
        {[
          { label: 'Today\'s Check-ins', value: '14', status: '+2.5%' },
          { label: 'Occupancy Rate', value: '86%', status: '+4%' },
          { label: 'Sentiments', value: '4.9', status: 'Excellent', badgeType: 'ai' },
          { label: 'RevPAR Index', value: '112', status: '+15.2%' },
        ].map((stat, i) => (
          <Card key={i} variant="glass" className="p-8">
            <h3 className="text-muted font-semibold mb-5 uppercase text-sm tracking-widest">
              {stat.label}
            </h3>
            <div className="text-primary font-extrabold mb-5 text-5xl tracking-tight">
              {stat.value}
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
          
          <Table columns={arrivalColumns} data={recentArrivals} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

