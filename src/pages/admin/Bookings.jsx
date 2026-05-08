import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { bookingService } from '../../services/bookingService';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Guest', 
      key: 'users',
      render: (val, item) => (
        <div className="flex items-center">
          <div className="cell-avatar">{(val?.full_name || 'G').charAt(0)}</div>
          <div>
            <div className="cell-main">{val?.full_name || 'Unknown Guest'}</div>
            <span className="cell-sub">{val?.email || 'no-email@guest.com'}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Room', 
      key: 'rooms',
      render: (val) => <span className="font-semibold text-primary">{val?.type || 'N/A'}</span>
    },
    { 
      header: 'Check In', 
      key: 'check_in_date',
      render: (val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    { 
      header: 'Check Out', 
      key: 'check_out_date',
      render: (val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (val) => <Badge status={val.toLowerCase()}>{val}</Badge>
    },
    { 
      header: 'Amount', 
      key: 'total_price',
      render: (val) => <span className="font-bold text-accent">₹{Number(val).toLocaleString('en-IN')}</span>
    }
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
          <Button variant="primary" onClick={() => {/* Add booking modal logic here later */}}>Add Booking</Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : (
        <Table columns={columns} data={bookings} />
      )}
    </DashboardLayout>
  );
};

export default Bookings;

