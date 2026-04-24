import React, { useState, useEffect } from 'react';
import { Sparkles, Search, ArrowRight, MapPin, Globe, ShieldCheck, Heart, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../../styles/guest.css';
import { generateAiResponse } from '../../services/aiService';
import BookingModal from '../../features/booking/BookingModal';
import AITripPlanner from '../../components/user/AITripPlanner';

const GuestLanding = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const featuredHotels = [
    {
      title: 'The Sapphire Resort',
      location: 'Maldives, Indian Ocean',
      price: '$540',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      amenities: ['Private Beach', 'Infinity Pool', 'Heliport'],
      badge: 'Most Booked'
    },
    {
      title: 'Azure Garden Villas',
      location: 'Bali, Indonesia',
      price: '$420',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      amenities: ['Yoga Studio', 'Eco-Smart', 'Spa & Wellness'],
      badge: 'AI Choice'
    },
    {
      title: 'The Metropolis Luxe',
      location: 'New York City, USA',
      price: '$890',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      amenities: ['Sky Deck', 'Fine Dining', 'Concierge'],
      badge: 'Trending'
    }
  ];

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(aiQuery)}`);
  };

  const openBooking = (hotel) => {
    setSelectedHotel(hotel);
    setIsBookingOpen(true);
  };

  return (
    <div className="guest-app-container">
      {/* Cinematic Navigation */}
      <nav className={`guest-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          <Link to="/" className="guest-logo">
            <Globe size={20} />
            <span>RAJ HERITAGE</span>
          </Link>
        </div>
        <div className="navbar-center">
          <div className="guest-nav-links">
            <a href="#destinations" className="guest-nav-link">Destinations</a>
            <a href="#hotels" className="guest-nav-link">Collections</a>
            <a href="#about" className="guest-nav-link">Philosophy</a>
          </div>
        </div>
        <div className="navbar-right">
          <Link to="/onboarding" className="partner-link">Partnership</Link>
          <button className="guest-auth-btn">Sign In</button>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Cinematic Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>
        <div className="menu-content">
          <div className="menu-header">
            <Link to="/" className="guest-logo" onClick={() => setIsMenuOpen(false)}>
              <Globe size={24} />
              <span>RAJ HERITAGE</span>
            </Link>
            <button className="menu-close-btn" onClick={() => setIsMenuOpen(false)}>
              <X size={32} />
            </button>
          </div>
          
          <nav className="mobile-nav-links">
            <a href="#destinations" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <span className="link-num">01</span>
              <span className="link-text">Destinations</span>
            </a>
            <a href="#hotels" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <span className="link-num">02</span>
              <span className="link-text">Collections</span>
            </a>
            <a href="#about" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <span className="link-num">03</span>
              <span className="link-text">Philosophy</span>
            </a>
            <Link to="/onboarding" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <span className="link-num">04</span>
              <span className="link-text">Partnership</span>
            </Link>
          </nav>

          <div className="menu-footer">
            <div className="social-links">
              <span>Instagram</span>
              <span>Twitter</span>
              <span>LinkedIn</span>
            </div>
            <button className="mobile-auth-btn">Sign In to Raj Heritage</button>
          </div>
        </div>
      </div>

      {/* Immersive Hero Section */}
      <section className="hero-viewport">
        <div 
          className="hero-visual-layer"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="hero-video-fallback"></div>
          <div className="hero-overlay-gradient"></div>
        </div>

        <div 
          className="hero-content-layer"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <div className="hero-text-wrap">
            <span className="hero-eyebrow fade-in-up">The Future of Hospitality</span>
            <h1 className="hero-headline fade-in-up delay-1">
              Curating <span className="text-italic">sanctuaries</span> for the modern nomad.
            </h1>
          </div>

          <div className="hero-search-wrap fade-in-up delay-2">
            <div className="search-glass-container">
              <div className="search-input-field">
                <Sparkles size={20} className="text-accent" />
                <input
                  type="text"
                  placeholder="Where should your next story begin?"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                />
                <button className="search-trigger" onClick={handleAiSearch}>
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div className="search-suggestions">
              <button onClick={() => navigate('/search?query=Villas+in+Bali')}>Bali</button>
              <button onClick={() => navigate('/search?query=Penthouses+in+NYC')}>New York</button>
              <button onClick={() => navigate('/search?query=Resorts+in+Maldives')}>Maldives</button>
              <button onClick={() => navigate('/search?query=Suites+in+Paris')}>Paris</button>
            </div>
          </div>

          <div className="hero-scroll-indicator fade-in-up delay-3">
            <span>Discover More</span>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section id="hotels" className="section-container">
        <div className="section-intro reveal-on-scroll">
          <div className="intro-text">
            <span className="section-tag">Our Collection</span>
            <h2 className="section-heading">Hand-picked Excellence</h2>
          </div>
          <Link to="/search" className="action-link">
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="property-grid reveal-on-scroll">
          {featuredHotels.map((hotel, i) => (
            <div key={i} className="property-card stagger-item">
              <div className="property-media">
                <img src={hotel.image} alt={hotel.title} />
                <div className="property-overlay">
                  <div className="price-label">{hotel.price} <small>/night</small></div>
                  <button className="like-btn"><Heart size={18} /></button>
                </div>

                <div className="details-header-overlay">
                  <h3>{hotel.title}</h3>
                  <div className="location-tag">
                    <MapPin size={12} /> {hotel.location}
                  </div>
                </div>
              </div>
              <div className="property-details">
                <div className="details-footer">
                  <div className="amenity-list">
                    {hotel.amenities.slice(0, 1).map((a, j) => (
                      <span key={j}>{a}</span>
                    ))}
                    {hotel.amenities.length > 1 && <span>+{hotel.amenities.length - 1}</span>}
                  </div>
                  <button 
                    className="reserve-action"
                    onClick={() => openBooking(hotel)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Trip Planner */}
      <AITripPlanner />

      {/* Brand Philosophy Section */}
      <section id="about" className="section-container bg-dark-accent">
        <div className="philosophy-layout">
          <div className="philosophy-image reveal-on-scroll">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" alt="Luxury Hospitality" />
            <div className="image-accent-glow"></div>
          </div>
          <div className="philosophy-content reveal-on-scroll">
            <span className="section-tag">Our Philosophy</span>
            <h2 className="section-heading">Where intelligence meets elegance.</h2>
            <p className="section-description">
              Raj Heritage Hospitality isn't just a booking platform; it's a filtration system for the world's most exceptional hospitality. We use artificial intelligence to understand the nuance of your desires, matching you with spaces that don't just house you, but inspire you.
            </p>
            <div className="feature-badges reveal-on-scroll">
              <div className="badge-item stagger-item">
                <div className="badge-icon"><ShieldCheck size={24} /></div>
                <span>Verified Partners</span>
              </div>
              <div className="badge-item stagger-item">
                <div className="badge-icon"><Sparkles size={24} /></div>
                <span>AI Matching</span>
              </div>
              <div className="badge-item stagger-item">
                <div className="badge-icon"><Globe size={24} /></div>
                <span>Global Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="guest-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Globe size={24} />
            <span>RAJ HERITAGE</span>
          </div>
          <div className="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
          <p className="copyright">© 2026 Raj Heritage Hospitality. All rights reserved.</p>
        </div>
      </footer>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        hotel={selectedHotel}
      />
    </div>
  );
};

export default GuestLanding;
