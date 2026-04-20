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
      render: (val) => <span className="font-bold text-accent">${val}</span>
    }
  ];

  const bookingsData = [
    { guest: 'Alexander Wright', email: 'alex.w@icloud.com', room: 'Suite 402', checkIn: 'Oct 12, 2023', checkOut: 'Oct 15, 2023', status: 'Confirmed', amount: '1,250' },
    { guest: 'Elena Rodriguez', email: 'elena.rodriguez@gmail.com', room: 'Deluxe 108', checkIn: 'Oct 13, 2023', checkOut: 'Oct 14, 2023', status: 'Pending', amount: '450' },
    { guest: 'Marcus Chen', email: 'm.chen@techcorp.io', room: 'Executive 305', checkIn: 'Oct 14, 2023', checkOut: 'Oct 18, 2023', status: 'Confirmed', amount: '2,800' },
    { guest: 'Sophia Laurent', email: 'sophia.l@fashion.fr', room: 'Penthouse', checkIn: 'Oct 15, 2023', checkOut: 'Oct 20, 2023', status: 'Active', amount: '5,500' },
    { guest: 'Julian Barnes', email: 'j.barnes@outlook.com', room: 'Standard 212', checkIn: 'Oct 16, 2023', checkOut: 'Oct 17, 2023', status: 'Cancelled', amount: '200' },
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

