import { supabase } from './supabaseClient';

export const roomService = {
  // Fetch all rooms (for guests searching or admins viewing inventory)
  async getRooms(filters = {}) {
    let query = supabase.from('rooms').select('*');
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get a single room by ID
  async getRoomById(id) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  // ADMIN: Add a new room
  async createRoom(roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // ADMIN: Update room details
  async updateRoom(id, roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .update(roomData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // ADMIN: Delete a room
  async deleteRoom(id) {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
