import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { roomService } from '../../services/roomService';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Camera, 
  Sparkles, 
  IndianRupee,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

const RoomInventory = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Standard',
    base_price: '',
    capacity: 2,
    vibe: '',
    description: '',
    image_url: '',
    status: 'available',
    amenities: []
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        title: room.title || '',
        type: room.type || 'Standard',
        base_price: room.base_price || '',
        capacity: room.capacity || 2,
        vibe: room.vibe || '',
        description: room.description || '',
        image_url: room.image_url || '',
        status: room.status || 'available',
        amenities: room.amenities || []
      });
    } else {
      setEditingRoom(null);
      setFormData({
        title: '',
        type: 'Standard',
        base_price: '',
        capacity: 2,
        vibe: '',
        description: '',
        image_url: '',
        status: 'available',
        amenities: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, formData);
      } else {
        await roomService.createRoom(formData);
      }
      fetchRooms();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Failed to save room. Check console for details.');
    }
  };

  const toggleStatus = async (room) => {
    const statuses = ['available', 'maintenance', 'booked'];
    const currentIndex = statuses.indexOf(room.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    try {
      await roomService.updateRoom(room.id, { status: nextStatus });
      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: nextStatus } : r));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriceAdjustment = async (room, adjustment) => {
    const newPrice = Math.max(0, Number(room.base_price) + adjustment);
    try {
      await roomService.updateRoom(room.id, { base_price: newPrice });
      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, base_price: newPrice } : r));
    } catch (error) {
      console.error('Error adjusting price:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roomColumns = [
    {
      header: 'Room Details',
      key: 'details',
      render: (_, room) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-overlay flex-shrink-0">
            {room.image_url ? (
              <img src={room.image_url} alt={room.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <Camera size={20} />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-primary">{room.title || 'Unnamed Room'}</div>
            <div className="text-xs text-muted flex items-center gap-1">
              <Sparkles size={12} className="text-accent" /> {room.vibe || 'No vibe set'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      key: 'type',
      render: (val) => <span className="font-medium text-secondary">{val}</span>
    },
    {
      header: 'Base Price',
      key: 'base_price',
      render: (val, room) => (
        <div className="flex items-center gap-3">
          <div className="font-bold text-primary flex items-center">
            <IndianRupee size={14} />{Number(val).toLocaleString()}
          </div>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => handlePriceAdjustment(room, 500)}
              className="price-adjust-btn plus"
            >
              +500
            </button>
            <button 
              onClick={() => handlePriceAdjustment(room, -500)}
              className="price-adjust-btn minus"
            >
              -500
            </button>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val, room) => (
        <div 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => toggleStatus(room)}
        >
          <Badge status={val === 'available' ? 'success' : val === 'maintenance' ? 'warning' : 'primary'}>
            {val.toUpperCase()}
          </Badge>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, room) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenModal(room)}
            className="action-icon-btn edit"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(room.id)}
            className="action-icon-btn delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Room Inventory</h1>
            <p className="text-muted text-lg">Manage your luxury suites, toggle availability, and adjust pricing instantly.</p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" /> Add New Room
          </Button>
        </div>

        {/* Filters & Search */}
        <Card variant="glass" className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search rooms by name or type..." 
                className="custom-input pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost">
              <Filter size={18} className="mr-2" /> Filters
            </Button>
          </div>
        </Card>

        {/* Room List Table */}
        <Card variant="solid" className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="animate-spin text-accent" size={48} />
            </div>
          ) : (
            <Table columns={roomColumns} data={filteredRooms} />
          )}
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="text-2xl font-bold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={handleCloseModal} className="modal-close-btn">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body custom-scrollbar">
              <div className="modal-form-grid">
                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Room Title</label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Royal Heritage Suite" 
                    className="custom-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Room Type</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="custom-input appearance-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Base Price (₹)</label>
                  <input 
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    placeholder="25000" 
                    className="custom-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Capacity</label>
                  <input 
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="2" 
                    className="custom-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Vibe</label>
                  <input 
                    name="vibe"
                    value={formData.vibe}
                    onChange={handleInputChange}
                    placeholder="e.g. Heritage, Modern, Cozy" 
                    className="custom-input"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Image URL</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/..." 
                      className="custom-input flex-1"
                    />
                    {formData.image_url && (
                      <div className="w-12 h-12 rounded-lg border border-border-subtle overflow-hidden">
                        <img src={formData.image_url} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the room's unique features..." 
                    className="custom-input min-h-[120px] resize-none py-4"
                  />
                </div>
              </div>
            </form>

            <div className="modal-footer">
              <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>
                {editingRoom ? 'Update Room' : 'Create Room'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out forwards;
        }

        .modal-container {
          background: var(--surface-base);
          border: 1px solid var(--border-default);
          border-radius: 24px;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          padding: 32px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--surface-elevated);
        }

        .modal-close-btn {
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .modal-close-btn:hover {
          color: var(--text-primary);
        }

        .modal-body {
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .col-span-full {
          grid-column: span 2;
        }

        .modal-footer {
          padding: 32px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          background: var(--surface-elevated);
        }

        .rotate-45 {
          transform: rotate(45deg);
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .price-adjust-btn {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          background: var(--surface-overlay);
          cursor: pointer;
          transition: all 0.2s;
        }

        .price-adjust-btn.plus {
          color: var(--text-accent);
        }

        .price-adjust-btn.plus:hover {
          background: var(--action-accent);
          color: var(--surface-base);
        }

        .price-adjust-btn.minus {
          color: var(--text-muted);
        }

        .price-adjust-btn.minus:hover {
          background: var(--text-muted);
          color: var(--surface-base);
        }

        .action-icon-btn {
          padding: 8px;
          border-radius: 10px;
          border: 1px solid var(--border-subtle);
          background: var(--surface-overlay);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon-btn:hover {
          border-color: var(--border-default);
          transform: translateY(-2px);
        }

        .action-icon-btn.edit:hover {
          color: var(--action-primary);
          background: rgba(0, 119, 182, 0.1);
          border-color: var(--action-primary);
        }

        .action-icon-btn.delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default RoomInventory;
