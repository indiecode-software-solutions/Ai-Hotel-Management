import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Users, ChevronRight, Check, Sparkles, Plane, Coffee, Wind, Shield, ArrowLeft } from 'lucide-react';
import './booking.css';

const BookingModal = ({ hotel, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomType: null,
    addons: []
  });

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const steps = [
    { id: 1, label: 'Stay Details' },
    { id: 2, label: 'Sanctuary' },
    { id: 3, label: 'Enhancements' },
    { id: 4, label: 'Review' }
  ];

  const roomTypes = [
    {
      id: 'junior-suite',
      name: 'Junior Suite',
      description: 'Mountain view with private balcony',
      price: 450,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'presidential',
      name: 'Presidential Wing',
      description: 'Full floor with private butler',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'ocean-villa',
      name: 'Ocean Villa',
      description: 'Direct lagoon access & infinity pool',
      price: 850,
      image: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const addons = [
    {
      id: 'heli',
      name: 'Heli-Transfer',
      description: 'Private arrival via rooftop pad',
      price: 450,
      icon: <Plane size={20} />
    },
    {
      id: 'chef',
      name: 'Private Chef',
      description: 'Custom 7-course tasting menu',
      price: 300,
      icon: <Coffee size={20} />
    },
    {
      id: 'spa',
      name: 'In-Room Spa',
      description: 'Deep tissue & aromatherapy',
      price: 180,
      icon: <Wind size={20} />
    },
    {
      id: 'security',
      name: 'Elite Security',
      description: '24/7 dedicated protection',
      price: 600,
      icon: <Shield size={20} />
    }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleAddon = (addon) => {
    setFormData(prev => {
      const exists = prev.addons.find(a => a.id === addon.id);
      if (exists) {
        return { ...prev, addons: prev.addons.filter(a => a.id !== addon.id) };
      } else {
        return { ...prev, addons: [...prev.addons, addon] };
      }
    });
  };

  const calculateTotal = () => {
    let total = formData.roomType ? formData.roomType.price : 0;
    formData.addons.forEach(a => total += a.price);
    return total;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-enter">
            <h3 className="step-title">When are you arriving?</h3>
            <div className="date-selection-grid">
              <div className="input-group">
                <label>Check In</label>
                <div className="premium-input-wrap" onClick={() => checkInRef.current?.showPicker()}>
                  <Calendar size={18} className="text-accent" />
                  <input 
                    ref={checkInRef}
                    type="date" 
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Check Out</label>
                <div className="premium-input-wrap" onClick={() => checkOutRef.current?.showPicker()}>
                  <Calendar size={18} className="text-accent" />
                  <input 
                    ref={checkOutRef}
                    type="date" 
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="input-group" style={{ marginTop: '30px' }}>
              <label>Number of Guests</label>
              <div className="premium-input-wrap">
                <Users size={18} className="text-accent" />
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-enter">
            <h3 className="step-title">Select your Sanctuary</h3>
            <div className="room-options-grid">
              {roomTypes.map(room => (
                <div 
                  key={room.id} 
                  className={`room-card ${formData.roomType?.id === room.id ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, roomType: room})}
                >
                  <div className="room-media">
                    <img src={room.image} alt={room.name} />
                  </div>
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>{room.description}</p>
                    <div className="room-price">${room.price} <small>/night</small></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-enter">
            <h3 className="step-title">Signature Enhancements</h3>
            <p className="step-subtitle">Curate your experience with our premium add-ons.</p>
            <div className="addons-grid">
              {addons.map(addon => {
                const isSelected = formData.addons.find(a => a.id === addon.id);
                return (
                  <div 
                    key={addon.id} 
                    className={`addon-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleAddon(addon)}
                  >
                    <div className="addon-icon">{addon.icon}</div>
                    <div className="addon-details">
                      <h5>{addon.name}</h5>
                      <p>{addon.description}</p>
                      <div className="addon-price">+${addon.price}</div>
                    </div>
                    <div className="addon-checkbox">
                      {isSelected && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-enter">
            <h3 className="step-title">Confirm Your Stay</h3>
            <div className="summary-card">
              <div className="summary-section">
                <div className="summary-item">
                  <span className="label">Destination</span>
                  <span className="value">{hotel?.title || 'Oasis Resort'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Dates</span>
                  <span className="value">{formData.checkIn} — {formData.checkOut}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Sanctuary</span>
                  <span className="value">{formData.roomType?.name || 'Standard'}</span>
                </div>
              </div>
              
              {formData.addons.length > 0 && (
                <div className="summary-section">
                  <label>Selected Enhancements</label>
                  <div className="summary-addons">
                    {formData.addons.map(a => (
                      <div key={a.id} className="summary-addon-pill">
                        {a.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="confirmation-notice">
              <Sparkles size={16} className="text-accent" />
              <span>Oasis AI has verified this booking for immediate confirmation.</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={(e) => e.target.className === 'booking-modal-overlay' && onClose()}>
      <div className="booking-modal-container">
        <div className="booking-modal-header">
          <div className="modal-header-info">
            <h2>{hotel?.title || 'Reservation'}</h2>
            <p>{hotel?.location || 'Select your experience'}</p>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="booking-stepper">
          {steps.map(s => (
            <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-number">{step > s.id ? <Check size={14} /> : s.id}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="booking-step-content">
          {renderStep()}
        </div>

        <div className="booking-modal-footer">
          <div className="total-estimate">
            <span className="total-label">Estimated Total</span>
            <span className="total-amount">${calculateTotal()}</span>
          </div>
          
          <div className="footer-actions">
            {step > 1 && (
              <button className="btn-back" onClick={prevStep}>
                <ArrowLeft size={18} /> Back
              </button>
            )}
            {step < 4 ? (
              <button 
                className="btn-next" 
                onClick={nextStep}
                disabled={step === 2 && !formData.roomType}
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button className="btn-next btn-confirm" onClick={onClose}>
                Confirm Reservation <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
