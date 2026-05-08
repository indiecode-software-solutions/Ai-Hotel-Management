import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Users, ChevronRight, Check, Sparkles, Plane, Coffee, Wind, Shield, ArrowLeft, Loader2, CreditCard, Lock } from 'lucide-react';
import './booking.css';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import room1 from '../../assets/Super Deluxe Room.jpeg';
import room2 from '../../assets/DSC00831 (1).JPG';
import room3 from '../../assets/Garden.png';

const BookingModal = ({ hotel, isOpen, onClose, initialData }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success'
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
    { id: 4, label: 'Review' },
    { id: 5, label: 'Checkout' }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchRooms();
      
      if (initialData) {
        setFormData(prev => ({
          ...prev,
          checkIn: initialData.checkIn || prev.checkIn,
          checkOut: initialData.checkOut || prev.checkOut,
          guests: initialData.guests || prev.guests
        }));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialData]);

  const fetchRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const data = await roomService.getRooms({ status: 'available' });
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const roomTypes = rooms.map(room => ({
    id: room.id,
    name: room.title || room.type,
    description: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.type,
    price: room.base_price,
    image: room.image_url || room1
  }));

  const addons = [
    {
      id: 'ayurveda',
      name: 'Ayurvedic Spa',
      description: 'Deep tissue & traditional aromatherapy',
      price: 4500,
      icon: <Wind size={20} />
    },
    {
      id: 'temple-tour',
      name: 'Private Temple Tour',
      description: 'Guided VIP tour of ancient Hampi ruins',
      price: 3000,
      icon: <Sparkles size={20} />
    },
    {
      id: 'breakfast',
      name: 'Plantation Breakfast',
      description: 'Authentic South Indian estate breakfast',
      price: 1800,
      icon: <Coffee size={20} />
    },
    {
      id: 'transfer',
      name: 'Airport Transfer',
      description: 'Luxury SUV pick-up from Hyderabad/Bangalore',
      price: 6000,
      icon: <Plane size={20} />
    }
  ];

  if (!isOpen) return null;

  const nextStep = () => {
    if (step === 4) {
      setStep(5);
      return;
    }
    setStep(prev => Math.min(prev + 1, 5));
  };
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

  const getNumberOfNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const checkInDate = new Date(formData.checkIn).setHours(0, 0, 0, 0);
    const checkOutDate = new Date(formData.checkOut).setHours(0, 0, 0, 0);
    const diffTime = checkOutDate - checkInDate;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = getNumberOfNights();
    let total = formData.roomType ? formData.roomType.price * nights : 0;
    formData.addons.forEach(a => total += a.price);
    return total;
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please log in to proceed.');
      return;
    }

    if (!formData.checkIn || !formData.checkOut || !formData.roomType) {
      alert('Missing stay details. Please go back and complete the dates and room selection.');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment system is loading. Please wait or refresh.');
      return;
    }

    setIsSubmitting(true);
    const totalAmount = calculateTotal();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "Raj Heritage Hospitality",
      description: `Reservation for ${formData.roomType?.name}`,
      image: "https://uukigchhhmmiocsxwhyc.supabase.co/storage/v1/object/public/hotel-assets/logo.png",
      handler: async function (response) {
        setPaymentStatus('processing');
        try {
          const bookingData = {
            guest_id: user.id,
            room_id: formData.roomType.id,
            check_in_date: formData.checkIn,
            check_out_date: formData.checkOut,
            total_price: totalAmount,
            status: 'confirmed',
            payment_id: response.razorpay_payment_id
          };

          await bookingService.createBooking(bookingData);
          setPaymentStatus('success');
          setIsSubmitting(false);
        } catch (error) {
          console.error('Error finalizing booking:', error);
          alert('Payment successful, but booking failed. Please contact support.');
          setIsSubmitting(false);
        }
      },
      prefill: {
        name: user.full_name || "",
        email: user.email || "",
        contact: ""
      },
      theme: {
        color: "#d4af37"
      },
      modal: {
        ondismiss: function() {
          setIsSubmitting(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
            {(!formData.checkIn || !formData.checkOut) && (
              <p className="validation-warning" style={{ color: 'var(--text-accent)', fontSize: '0.75rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8 }}>
                <Lock size={12} /> Selection of arrival & departure dates is required to reveal sanctuaries.
              </p>
            )}
            <div className="input-group" style={{ marginTop: '20px' }}>
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
              {isLoadingRooms ? (
                <div className="loading-state">
                  <Loader2 className="animate-spin text-accent" size={40} />
                  <p>Unveiling your sanctuaries...</p>
                </div>
              ) : roomTypes.length === 0 ? (
                <div className="empty-state">
                  <p>No sanctuaries available for your selected dates.</p>
                </div>
              ) : (
                roomTypes.map(room => (
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
                      <div className="room-price">₹{room.price.toLocaleString()} <small>/night</small></div>
                    </div>
                  </div>
                ))
              )}
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
                      <div className="addon-price">+₹{addon.price.toLocaleString()}</div>
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
            <h3 className="step-title">Review Your Sanctuary</h3>
            <div className="summary-card">
              <div className="summary-section">
                <div className="summary-item">
                  <span className="label">Destination</span>
                  <span className="value">{hotel?.title || 'Raj Heritage Hospitality'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Dates</span>
                  <span className="value">{formData.checkIn} — {formData.checkOut} ({getNumberOfNights()} Night{getNumberOfNights() > 1 ? 's' : ''})</span>
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
              <span>Raj Heritage AI has verified this booking for immediate confirmation.</span>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-enter payment-step">
            {paymentStatus === 'success' ? (
              <div className="payment-success-state">
                <div className="success-icon-wrap">
                  <Check size={40} />
                </div>
                <h3>Reservation Confirmed!</h3>
                <p>Your payment was successful and your sanctuary is waiting.</p>
                <div className="success-details">
                  <div className="detail-row">
                    <span>Amount Paid</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Booking ID</span>
                    <span>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                </div>
                <button className="btn-done" onClick={onClose}>Return to Home</button>
              </div>
            ) : (
              <>
                <h3 className="step-title">Secure Checkout</h3>
                <div className="checkout-breakdown">
                  <div className="checkout-item">
                    <span>{formData.roomType?.name} ({getNumberOfNights()} Night{getNumberOfNights() > 1 ? 's' : ''})</span>
                    <span>₹{((formData.roomType?.price || 0) * getNumberOfNights()).toLocaleString()}</span>
                  </div>
                  {formData.addons.map(a => (
                    <div key={a.id} className="checkout-item addon">
                      <span>{a.name}</span>
                      <span>₹{a.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="checkout-total">
                    <span>Total Amount</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="payment-security">
                  <Lock size={16} />
                  <span>Secured by Razorpay. 256-bit SSL Encryption.</span>
                </div>

                <div className="payment-methods-preview">
                  <CreditCard size={24} />
                  <div className="method-labels">
                    <span>UPI, Cards, Netbanking</span>
                    <small>Test Environment Enabled</small>
                  </div>
                </div>
              </>
            )}
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

        {paymentStatus !== 'success' && (
          <div className="booking-modal-footer">
            <div className="total-estimate">
              <span className="total-label">Final Amount</span>
              <span className="total-amount">₹{calculateTotal().toLocaleString()}</span>
            </div>
            
            <div className="footer-actions">
              {step > 1 && !isSubmitting && (
                <button className="btn-back" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
              )}
              {step < 5 ? (
                <button 
                  className="btn-next" 
                  onClick={nextStep}
                  disabled={
                    (step === 1 && (!formData.checkIn || !formData.checkOut)) || 
                    (step === 2 && !formData.roomType)
                  }
                >
                  {step === 4 ? 'Proceed to Checkout' : 'Continue'} <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  className="btn-next btn-confirm" 
                  onClick={handlePayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    <>Pay ₹{calculateTotal().toLocaleString()} <CreditCard size={18} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
