import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { supabase } from '../../services/supabaseClient';
import { bookingService } from '../../services/bookingService';

export const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGuest, setNewGuest] = useState({
    full_name: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    fetchGuestsData();
  }, []);

  const fetchGuestsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all users and all bookings to calculate stats
      const [usersRes, bookings] = await Promise.all([
        supabase.from('users').select('*'),
        bookingService.getAllBookings()
      ]);

      const users = usersRes.data || [];

      // Calculate stats per user
      const guestsWithStats = users.map(user => {
        const userBookings = bookings.filter(b => b.guest_id === user.id && b.status !== 'cancelled');
        const stays = userBookings.length;
        const totalSpend = userBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
        
        // Sort bookings to find last stay
        userBookings.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));
        const lastStay = userBookings.length > 0 
          ? new Date(userBookings[0].check_in_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'N/A';

        // Determine tier based on spend
        let tier = 'Standard';
        if (totalSpend > 500000) tier = 'Diamond';
        else if (totalSpend > 100000) tier = 'Gold';
        else if (totalSpend > 20000) tier = 'Silver';

        return {
          ...user,
          stays,
          totalSpend,
          lastStay,
          tier
        };
      });

      // Sort by most stays
      guestsWithStats.sort((a, b) => b.stays - a.stays);
      setGuests(guestsWithStats);
    } catch (err) {
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('users')
        .insert([{ 
          full_name: newGuest.full_name, 
          email: newGuest.email,
          location: newGuest.location
        }]);
        
      if (error) throw error;
      
      setIsAddModalOpen(false);
      setNewGuest({ full_name: '', email: '', location: '' });
      fetchGuestsData(); // Refresh list
    } catch (err) {
      console.error('Error adding guest:', err);
      alert('Failed to add guest: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Guest Details',
      key: 'full_name',
      render: (val, item) => (
        <div className="flex items-center">
          <div className="cell-avatar">{(val || 'G').charAt(0)}</div>
          <div>
            <div className="cell-main">{val || 'Unknown Guest'}</div>
            <span className="cell-sub">{item.email} • {item.location || 'Location Unknown'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Stay History',
      key: 'stays',
      render: (val) => <span className="font-semibold text-primary">{val} Visits</span>
    },
    {
      header: 'Tier',
      key: 'tier',
      render: (val) => {
        const statusMap = {
          'Diamond': 'ai',
          'Gold': 'warning',
          'Silver': 'primary',
          'Standard': 'default'
        };
        return <Badge status={statusMap[val] || 'default'}>{val}</Badge>;
      }
    },
    { header: 'Last Stay', key: 'lastStay' },
    {
      header: 'Total Spend',
      key: 'totalSpend',
      render: (val) => <span className="font-bold text-accent">₹{val.toLocaleString('en-IN')}</span>
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-extrabold text-5xl tracking-tight mb-2">Guest Directory</h1>
          <p className="text-muted text-lg">Maintain detailed profiles and loyalty records for your clientele.</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={18} className="mr-2" />
          Add Guest
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
          <Input placeholder="Search by name, email, or location..." className="pl-12" />
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="border border-subtle">All Tiers</Button>
          <Button variant="ghost" className="border border-subtle">VIP Only</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : (
        <Table columns={columns} data={guests} />
      )}

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => e.target.className === 'admin-modal-overlay' && setIsAddModalOpen(false)}>
          <div className="admin-modal-container">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="admin-modal-close"
            >
              <X size={24} />
            </button>
            
            <h2 className="admin-modal-title">New Guest Profile</h2>
            
            <form onSubmit={handleAddGuestSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Full Name</label>
                <input 
                  type="text" required
                  className="admin-form-input"
                  placeholder="e.g. John Doe"
                  value={newGuest.full_name}
                  onChange={e => setNewGuest({...newGuest, full_name: e.target.value})}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email Address</label>
                <input 
                  type="email" required
                  className="admin-form-input"
                  placeholder="john@example.com"
                  value={newGuest.email}
                  onChange={e => setNewGuest({...newGuest, email: e.target.value})}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Location (Optional)</label>
                <input 
                  type="text" 
                  className="admin-form-input"
                  placeholder="e.g. Mumbai, MH"
                  value={newGuest.location}
                  onChange={e => setNewGuest({...newGuest, location: e.target.value})}
                />
              </div>

              <div className="admin-modal-actions">
                <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Create Guest'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Guests;
