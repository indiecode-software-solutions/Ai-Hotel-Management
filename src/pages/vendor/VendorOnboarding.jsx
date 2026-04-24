import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'hotel',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    description: '',
    amenities: []
  });
  const navigate = useNavigate();

  const steps = [
    { 
      number: 1, 
      title: 'Property Profile', 
      desc: 'Tell us about your property and brand',
      icon: 'business'
    },
    { 
      number: 2, 
      title: 'Location Details', 
      desc: 'Help guests find your sanctuary',
      icon: 'location_on'
    },
    { 
      number: 3, 
      title: 'Luxury Amenities', 
      desc: 'Showcase your high-end offerings',
      icon: 'pool'
    }
  ];

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity) => {
    const newAmenities = formData.amenities.includes(amenity.name)
      ? formData.amenities.filter(a => a !== amenity.name)
      : [...formData.amenities, amenity.name];
    setFormData({ ...formData, amenities: newAmenities });
  };

  const availableAmenities = [
    { name: 'Swimming Pool', icon: 'pool' },
    { name: 'Infinity Pool', icon: 'waves' },
    { name: 'Private Beach', icon: 'beach_access' },
    { name: 'Spa & Wellness', icon: 'spa' },
    { name: 'Fitness Center', icon: 'fitness_center' },
    { name: 'Yoga Studio', icon: 'self_improvement' },
    { name: 'Fine Dining', icon: 'restaurant' },
    { name: 'Cocktail Bar', icon: 'local_bar' },
    { name: 'Wine Cellar', icon: 'wine_bar' },
    { name: 'Concierge Service', icon: 'support_agent' },
    { name: 'Valet Parking', icon: 'local_parking' },
    { name: 'Chauffeur Service', icon: 'directions_car' },
    { name: 'Heliport', icon: 'local_airport' },
    { name: 'Private Cinema', icon: 'theaters' },
    { name: 'Free WiFi', icon: 'wifi' },
    { name: 'Room Service', icon: 'room_service' },
    { name: 'Business Center', icon: 'business_center' },
    { name: 'Tennis Courts', icon: 'sports_tennis' }
  ];

  return (
    <div className="onboarding-page">
      {/* Left Side Panel */}
      <div className="onboarding-side-panel">
        <div className="side-panel-content">
          <div className="onboarding-brand">
            <i className="material-icons">hotel_class</i>
            RAJ HERITAGE PARTNERS
          </div>

          <div className="stepper-container">
            {steps.map((s) => (
              <div 
                key={s.number} 
                className={`step-item ${step === s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {step > s.number ? <i className="material-icons" style={{fontSize: '18px'}}>check</i> : s.number}
                </div>
                <div className="step-info">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="side-panel-footer">
            <p>© 2026 Raj Heritage Hospitality Group.</p>
            <p>Trusted by 5,000+ luxury properties worldwide.</p>
          </div>
        </div>
      </div>

      {/* Right Side Main Content */}
      <div className="onboarding-main-content">
        {step === 1 && (
          <div className="step-content">
            <div className="form-header">
              <h1>Property Profile</h1>
              <p>Start your journey by defining your property's identity.</p>
            </div>
            
            <div className="onboarding-form-grid">
              <div className="form-group full-width">
                <label>Property Name</label>
                <input 
                  type="text" 
                  name="propertyName" 
                  className="form-control"
                  value={formData.propertyName} 
                  onChange={handleChange} 
                  placeholder="e.g. The Sapphire Resort"
                />
              </div>

              <div className="form-group">
                <label>Property Type</label>
                <select 
                  name="propertyType" 
                  className="form-control"
                  value={formData.propertyType} 
                  onChange={handleChange}
                >
                  <option value="hotel">Boutique Hotel</option>
                  <option value="resort">Luxury Resort</option>
                  <option value="villa">Private Villa</option>
                  <option value="apartment">Serviced Apartment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="concierge@example.com"
                />
              </div>

              <div className="form-group full-width">
                <label>Property Description</label>
                <textarea 
                  name="description" 
                  className="form-control"
                  style={{ height: '120px', resize: 'none' }}
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Briefly describe what makes your property unique..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <div className="form-header">
              <h1>Location Details</h1>
              <p>Guests want to know where their next adventure begins.</p>
            </div>
            
            <div className="onboarding-form-grid">
              <div className="form-group full-width">
                <label>Street Address</label>
                <input 
                  type="text" 
                  name="address" 
                  className="form-control"
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="123 Luxury Way"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  className="form-control"
                  value={formData.city} 
                  onChange={handleChange} 
                  placeholder="Maldives"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  name="country" 
                  className="form-control"
                  value={formData.country} 
                  onChange={handleChange} 
                  placeholder="Indian Ocean"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <div className="form-header">
              <h1>Luxury Amenities</h1>
              <p>Select the high-end features that define your guest experience.</p>
            </div>
            
            <div className="amenities-container">
              {availableAmenities.map(amenity => (
                <div 
                  key={amenity.name}
                  className={`amenity-card ${formData.amenities.includes(amenity.name) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  <i className="material-icons">{amenity.icon}</i>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="completion-container">
            <div className="success-badge">
              <i className="material-icons">verified_user</i>
            </div>
            <div className="form-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1>Application Submitted</h1>
              <p>Your property is now being reviewed by our curation team.</p>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Thank you for choosing Raj Heritage Hospitality. We maintain a high standard for our partners to ensure the best experience for our guests. You'll receive an email notification once your property is live on our platform.
            </p>
            <button 
              className="btn-primary" 
              style={{ margin: '40px auto 0' }}
              onClick={() => navigate('/admin')}
            >
              Go to Dashboard
              <i className="material-icons">arrow_forward</i>
            </button>
          </div>
        )}

        {step < totalSteps && (
          <div className="onboarding-footer">
            <button 
              className="btn-ghost" 
              onClick={handleBack} 
              style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              <i className="material-icons">arrow_back</i>
              Previous
            </button>
            <button className="btn-primary" onClick={handleNext}>
              {step === 3 ? 'Complete Setup' : 'Save and Continue'}
              <i className="material-icons">arrow_forward</i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOnboarding;
