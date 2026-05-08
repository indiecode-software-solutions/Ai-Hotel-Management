import { supabase } from './supabaseClient';

export const bookingService = {
  // GUEST/ADMIN: Create a new booking
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // GUEST: Fetch their own bookings
  async getMyBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms(*)')
      .eq('guest_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  // ADMIN: Fetch all bookings across the hotel
  async getAllBookings(statusFilter = null) {
    let query = supabase
      .from('bookings')
      .select('*, users!guest_id(full_name, email), rooms(*)');
      
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // ADMIN: Update booking status (e.g., confirm, cancel, check_in)
  async updateBookingStatus(id, newStatus) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
