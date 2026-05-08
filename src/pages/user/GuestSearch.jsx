import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Search, MapPin, Heart, ArrowLeft, Filter, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../../styles/guest.css';
import { generateAiResponse } from '../../services/aiService';
import RajHeritageGlobe from '../../components/ui/RajHeritageGlobe';
import BookingModal from '../../features/booking/BookingModal';
import AuthModal from '../../components/auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';

const VIBES = ['All', 'Heritage', 'Nature', 'Urban'];

const GuestSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeVibe, setActiveVibe] = useState('All');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await roomService.getRooms();
      // Map Supabase data to the UI format if necessary
      const formattedData = data.map(p => ({
        ...p,
        title: p.title || p.type, // Fallback if title is missing
        price: `₹${Number(p.base_price).toLocaleString('en-IN')}`,
        image: p.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
        rating: p.rating || 4.5,
        vibe: p.vibe || 'Heritage',
        coordinates: [p.latitude || 25.3500, p.longitude || 78.6400]
      }));
      setAllProperties(formattedData);
      
      if (initialQuery) {
        handleSearch(initialQuery, formattedData);
      } else {
        applyFilter('All', formattedData);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = (vibe, data = allProperties) => {
    let result = data;
    if (vibe !== 'All') {
      result = result.filter(p => p.vibe === vibe);
    }
    setFilteredProperties(result);
  };

  const handleVibeClick = (vibe) => {
    setActiveVibe(vibe);
    applyFilter(vibe);
  };

  const handleSearch = async (searchQuery, data = allProperties) => {
    const q = typeof searchQuery === 'string' ? searchQuery : query;
    if (!q.trim()) {
      applyFilter(activeVibe, data);
      return;
    }

    setSearchParams({ query: q });
    setIsThinking(true);
    setAiResponse(null);

    // We pass the context of our properties to the AI
    const context = `Available properties: ${data.map(p => `${p.title} in ${p.location} (Vibe: ${p.vibe})`).join(', ')}.`;
    const prompt = `The user is looking for: "${q}". Which of our available properties do you suggest and why?`;

    try {
      const response = await generateAiResponse(prompt, context);
      setAiResponse(response);
      
      const lowerQ = q.toLowerCase();
      let matchedVibe = activeVibe;
      if (lowerQ.includes('heritage') || lowerQ.includes('culture') || lowerQ.includes('palace')) matchedVibe = 'Heritage';
      else if (lowerQ.includes('nature') || lowerQ.includes('river') || lowerQ.includes('wildlife') || lowerQ.includes('mist')) matchedVibe = 'Nature';
      else if (lowerQ.includes('urban') || lowerQ.includes('city') || lowerQ.includes('business')) matchedVibe = 'Urban';
      
      if (matchedVibe !== activeVibe && matchedVibe !== 'All') {
        setActiveVibe(matchedVibe);
      }

      const mentionedProperties = data.filter(p => response.includes(p.title));
      
      if (mentionedProperties.length > 0) {
        setFilteredProperties(mentionedProperties);
      } else {
        applyFilter(matchedVibe !== 'All' ? matchedVibe : activeVibe, data);
      }

    } catch (error) {
      console.error(error);
      setAiResponse("I apologize, something went wrong while finding the perfect match.");
      applyFilter(activeVibe, data);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="guest-app-container split-view-container">
      {/* Top Navbar */}
      <nav className="search-navbar">
        <Link to="/" className="guest-logo">
          <Globe size={20} />
          <span>RAJ HERITAGE</span>
        </Link>
        
        <div className="search-navbar-center">
          <div className="compact-search-bar">
            <Sparkles size={16} className={isThinking ? 'animate-spin-slow' : 'text-accent'} />
            <input
              type="text"
              placeholder="Search destinations, vibes, or specific needs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="compact-search-trigger" onClick={handleSearch}>
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="search-navbar-right">
          {user ? (
            <>
              {user.user_metadata?.role === 'admin' && (
                <Link to="/admin" className="guest-auth-btn" style={{textDecoration: 'none'}}>Dashboard</Link>
              )}
              <button className="guest-auth-btn" onClick={signOut} style={{background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)'}}>Sign Out</button>
            </>
          ) : (
            <button className="guest-auth-btn" onClick={() => setIsAuthModalOpen(true)}>Sign In</button>
          )}
        </div>
      </nav>

      {/* Main Split View */}
      <div className="split-view-main">
        {/* Left Side: Results */}
        <div className="split-view-list">
          
          {/* AI Insights Section */}
          <div className="ai-insights-panel">
            <div className="insights-header">
              <Sparkles size={16} />
              <span>AI Concierge</span>
            </div>
            {isThinking ? (
              <div className="insights-body thinking">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
                <p>Analyzing your preferences to find the perfect sanctuary...</p>
              </div>
            ) : aiResponse ? (
              <div className="insights-body">
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>
            ) : (
              <div className="insights-body">
                <p>Tell me what you're looking for, and I'll curate the perfect selection of properties for you.</p>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="vibe-filters">
            <div className="filters-header">
              <Filter size={14} /> <span>Curated Vibes</span>
            </div>
            <div className="filters-scroll">
              {VIBES.map(vibe => (
                <button 
                   key={vibe} 
                  className={`vibe-btn ${activeVibe === vibe ? 'active' : ''}`}
                  onClick={() => handleVibeClick(vibe)}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Property Grid */}
          <div className="search-results-grid">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 w-full col-span-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                <p className="text-muted">Fetching live inventory...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map(hotel => (
                <div key={hotel.id} className="search-property-card">
                  <div className="search-property-media">
                    <img src={hotel.image} alt={hotel.title} />
                    <button className="search-like-btn"><Heart size={16} /></button>
                    <div className="search-price-badge">{hotel.price} <small>/nt</small></div>
                  </div>
                  <div className="search-property-info">
                    <div className="info-top">
                      <span className="vibe-tag">{hotel.vibe}</span>
                      <h4>{hotel.title}</h4>
                      <p className="location"><MapPin size={12} /> {hotel.location}</p>
                    </div>
                    <div className="info-bottom">
                      <div className="amenities-preview">
                        {(hotel.amenities || []).slice(0, 1).map((a, i) => <span key={i}>{a}</span>)}
                        {(hotel.amenities || []).length > 1 && <span className="more-tag">+{(hotel.amenities || []).length - 1}</span>}
                      </div>
                      <div className="rating">★ {hotel.rating}</div>
                    </div>
                    <button 
                      className="search-book-btn"
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsBookingOpen(true);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No properties match your current criteria.</p>
                <button className="reset-btn" onClick={() => { setQuery(''); setActiveVibe('All'); applyFilter('All'); }}>Reset Filters</button>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Map */}
        <div className="split-view-map">
          <RajHeritageGlobe properties={filteredProperties} />
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        hotel={selectedHotel}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default GuestSearch;
