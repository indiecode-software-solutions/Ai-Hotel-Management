import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

export const Bookings = () => {
  const columns = [
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
    { 
      header: 'Room', 
      key: 'room',
      render: (val) => <span className="font-semibold text-primary">{val}</span>
    },
    { header: 'Check In', key: 'checkIn' },
    { header: 'Check Out', key: 'checkOut' },
    { 
      header: 'Status', 
      key: 'status',
      render: (val) => <Badge status={val.toLowerCase()}>{val}</Badge>
    },
    { 
      header: 'Amount', 
      key: 'amount',
      render: (val) => <span className="font-bold text-accent">₹{val}</span>
    }
  ];

  const bookingsData = [
    { guest: 'Arjun Reddy', email: 'arjun.reddy@hyderabad.in', room: 'Suite 402', checkIn: 'Jan 12, 2024', checkOut: 'Jan 15, 2024', status: 'Confirmed', amount: '45,000' },
    { guest: 'Priya Sharma', email: 'p.sharma@bangalore.com', room: 'Deluxe 108', checkIn: 'Jan 13, 2024', checkOut: 'Jan 14, 2024', status: 'Pending', amount: '18,500' },
    { guest: 'Rahul Malhotra', email: 'rahul.m@mumbai.co.in', room: 'Executive 305', checkIn: 'Jan 14, 2024', checkOut: 'Jan 18, 2024', status: 'Confirmed', amount: '82,000' },
    { guest: 'Sanjay Gupta', email: 's.gupta@delhi.biz', room: 'Royal Wing', checkIn: 'Jan 15, 2024', checkOut: 'Jan 20, 2024', status: 'Active', amount: '1,25,000' },
    { guest: 'Vikram Singh', email: 'v.singh@chennai.org', room: 'Standard 212', checkIn: 'Jan 16, 2024', checkOut: 'Jan 17, 2024', status: 'Cancelled', amount: '12,000' },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-extrabold text-5xl tracking-tight mb-2">Booking Ledger</h1>
          <p className="text-muted text-lg">Manage and monitor all guest reservations across your property.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="accent">Export CSV</Button>
          <Button variant="primary">Add Booking</Button>
        </div>
      </div>

      <Table columns={columns} data={bookingsData} />
    </DashboardLayout>
  );
};

export default Bookings;

