import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import { supabase } from '../../services/supabaseClient';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newBooking, setNewBooking] = useState({
    guest_id: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
    total_price: '',
    status: 'confirmed'
  });

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

  const handleExportCSV = () => {
    if (!bookings || bookings.length === 0) return;

    const headers = ['Booking ID', 'Guest Name', 'Guest Email', 'Room Type', 'Check In', 'Check Out', 'Status', 'Total Price'];
    
    const csvRows = bookings.map(b => {
      return [
        b.id,
        `"${b.users?.full_name || 'Unknown'}"`,
        `"${b.users?.email || 'N/A'}"`,
        `"${b.rooms?.type || 'N/A'}"`,
        b.check_in_date,
        b.check_out_date,
        b.status,
        b.total_price
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Raj_Heritage_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAddModal = async () => {
    setIsAddModalOpen(true);
    setIsNewGuest(false);
    setNewGuestName('');
    setNewGuestEmail('');
    setNewBooking({
      guest_id: '',
      room_id: '',
      check_in_date: '',
      check_out_date: '',
      total_price: '',
      status: 'confirmed'
    });
    
    try {
      const [fetchedRooms, { data: fetchedUsers }] = await Promise.all([
        roomService.getRooms(),
        supabase.from('users').select('id, full_name, email')
      ]);
      if (fetchedRooms) setRooms(fetchedRooms);
      if (fetchedUsers) setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching data for modal:', err);
    }
  };

  const handleAddBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalGuestId = newBooking.guest_id;

      if (isNewGuest) {
        // Try to insert new guest into public.users
        const { data: insertedGuest, error: guestError } = await supabase
          .from('users')
          .insert([{ full_name: newGuestName, email: newGuestEmail }])
          .select()
          .single();
          
        if (guestError) throw new Error("Failed to create new guest: " + guestError.message);
        finalGuestId = insertedGuest.id;
      }

      await bookingService.createBooking({
        ...newBooking,
        guest_id: finalGuestId,
        total_price: Number(newBooking.total_price)
      });
      setIsAddModalOpen(false);
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(err.message || 'Failed to create booking. Please make sure all fields are valid.');
    } finally {
      setIsSubmitting(false);
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
          <Button variant="accent" onClick={handleExportCSV}>Export CSV</Button>
          <Button variant="primary" onClick={openAddModal}>Add Booking</Button>
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

      {/* Add Booking Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => e.target.className === 'admin-modal-overlay' && setIsAddModalOpen(false)}>
          <div className="admin-modal-container">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="admin-modal-close"
            >
              <X size={24} />
            </button>
            
            <h2 className="admin-modal-title">New Booking</h2>
            
            <form onSubmit={handleAddBookingSubmit}>
              <div className="admin-form-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="admin-form-label mb-0">Guest</label>
                  <button type="button" className="text-xs text-accent hover:underline bg-transparent border-none p-0 cursor-pointer" onClick={() => setIsNewGuest(!isNewGuest)}>
                    {isNewGuest ? "Select Existing Guest" : "+ Add New Guest"}
                  </button>
                </div>
                
                {isNewGuest ? (
                  <div className="admin-form-row">
                    <input 
                      type="text" required
                      className="admin-form-input"
                      placeholder="Full Name"
                      value={newGuestName}
                      onChange={e => setNewGuestName(e.target.value)}
                    />
                    <input 
                      type="email" required
                      className="admin-form-input"
                      placeholder="Email Address"
                      value={newGuestEmail}
                      onChange={e => setNewGuestEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <select 
                    required={!isNewGuest}
                    className="admin-form-select"
                    value={newBooking.guest_id}
                    onChange={e => setNewBooking({...newBooking, guest_id: e.target.value})}
                  >
                    <option value="">Select a guest...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Room</label>
                <select 
                  required
                  className="admin-form-select"
                  value={newBooking.room_id}
                  onChange={e => setNewBooking({...newBooking, room_id: e.target.value})}
                >
                  <option value="">Select a room...</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.title} - ₹{r.price_per_night}/night</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group admin-form-row">
                <div>
                  <label className="admin-form-label">Check In</label>
                  <input 
                    type="date" required
                    className="admin-form-input"
                    value={newBooking.check_in_date}
                    onChange={e => setNewBooking({...newBooking, check_in_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Check Out</label>
                  <input 
                    type="date" required
                    className="admin-form-input"
                    value={newBooking.check_out_date}
                    onChange={e => setNewBooking({...newBooking, check_out_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Total Price (₹)</label>
                <input 
                  type="number" required min="0"
                  className="admin-form-input"
                  placeholder="e.g. 15000"
                  value={newBooking.total_price}
                  onChange={e => setNewBooking({...newBooking, total_price: e.target.value})}
                />
              </div>

              <div className="admin-modal-actions">
                <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Bookings;

