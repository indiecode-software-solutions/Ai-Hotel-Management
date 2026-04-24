import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Search, MapPin, Heart, ArrowLeft, Filter, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../../styles/guest.css';
import { generateAiResponse } from '../../services/aiService';
import RajHeritageGlobe from '../../components/ui/RajHeritageGlobe';
import BookingModal from '../../features/booking/BookingModal';
import prop1 from '../../assets/Rajmahal (1).jpg';
import prop2 from '../../assets/Lawn.jpeg';
import prop3 from '../../assets/Full View.jpg';
import prop4 from '../../assets/Rajmahal (3).jpg';
import prop5 from '../../assets/Drone View 1.jpg';
import prop6 from '../../assets/Pool Side View.jpeg';

// Mock Database
const MOCK_PROPERTIES = [
  { id: 1, title: 'Raj Mahal', location: 'Orchha, Madhya Pradesh', price: '₹24,500', image: prop1, amenities: ['Heritage View', 'Infinity Pool', 'Ayurvedic Spa'], vibe: 'Heritage', rating: 4.9, coordinates: [25.3500, 78.6400] },
  { id: 2, title: 'Raj Vila', location: 'Orchha, Madhya Pradesh', price: '₹18,200', image: prop2, amenities: ['Lush Gardens', 'Private Plunge Pool', 'Riverside Yoga'], vibe: 'Nature', rating: 4.8, coordinates: [25.3520, 78.6420] },
  { id: 3, title: 'Raj Mahal The Palace', location: 'Orchha, Madhya Pradesh', price: '₹32,890', image: prop3, amenities: ['Royal Suite', 'Fine Dining', 'Elite Butler'], vibe: 'Heritage', rating: 4.9, coordinates: [25.3510, 78.6410] },
  { id: 4, title: 'Betwa Retreat', location: 'Orchha, Madhya Pradesh', price: '₹12,500', image: prop4, amenities: ['River View', 'Tent Stay', 'Cultural Walk'], vibe: 'Nature', rating: 4.6, coordinates: [25.3490, 78.6380] },
  { id: 5, title: 'Sheesh Mahal', location: 'Orchha, Madhya Pradesh', price: '₹22,000', image: prop5, amenities: ['Palace Decor', 'Museum Access', 'Royal Dining'], vibe: 'Heritage', rating: 4.7, coordinates: [25.3505, 78.6405] },
  { id: 6, title: 'Bundelkhand Riverside', location: 'Orchha, Madhya Pradesh', price: '₹28,480', image: prop6, amenities: ['Riverfront', 'Private Ghat', 'History Tours'], vibe: 'Heritage', rating: 4.8, coordinates: [25.3480, 78.6370] },
];

const VIBES = ['All', 'Heritage', 'Nature', 'Urban'];

const GuestSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeVibe, setActiveVibe] = useState('All');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState(MOCK_PROPERTIES);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      filterProperties('All');
    }
  }, []); // Run once on mount

  const filterProperties = (vibe) => {
    let result = MOCK_PROPERTIES;
    if (vibe !== 'All') {
      result = result.filter(p => p.vibe === vibe);
    }
    setFilteredProperties(result);
  };

  const handleVibeClick = (vibe) => {
    setActiveVibe(vibe);
    filterProperties(vibe);
  };

  const handleSearch = async (searchQuery) => {
    const q = typeof searchQuery === 'string' ? searchQuery : query;
    if (!q.trim()) {
      filterProperties(activeVibe);
      return;
    }

    setSearchParams({ query: q });
    setIsThinking(true);
    setAiResponse(null);

    // We pass the context of our properties to the AI
    const context = `Available properties: ${MOCK_PROPERTIES.map(p => `${p.title} in ${p.location} (Vibe: ${p.vibe})`).join(', ')}.`;
    const prompt = `The user is looking for: "${q}". Which of our available properties do you suggest and why?`;

    try {
      const response = await generateAiResponse(prompt, context);
      setAiResponse(response);
      
      // Attempt to auto-select vibe based on query if it matches one
      const lowerQ = q.toLowerCase();
      let matchedVibe = activeVibe;
      if (lowerQ.includes('heritage') || lowerQ.includes('culture') || lowerQ.includes('palace')) matchedVibe = 'Heritage';
      else if (lowerQ.includes('nature') || lowerQ.includes('river') || lowerQ.includes('wildlife') || lowerQ.includes('mist')) matchedVibe = 'Nature';
      else if (lowerQ.includes('urban') || lowerQ.includes('city') || lowerQ.includes('business')) matchedVibe = 'Urban';
      
      if (matchedVibe !== activeVibe && matchedVibe !== 'All') {
        setActiveVibe(matchedVibe);
      }

      // If AI specifically mentions properties, show them. Otherwise filter by vibe.
      const mentionedProperties = MOCK_PROPERTIES.filter(p => response.includes(p.title));
      
      if (mentionedProperties.length > 0) {
        setFilteredProperties(mentionedProperties);
      } else {
        filterProperties(matchedVibe !== 'All' ? matchedVibe : activeVibe);
      }

    } catch (error) {
      console.error(error);
      setAiResponse("I apologize, something went wrong while finding the perfect match.");
      filterProperties(activeVibe);
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
          <button className="guest-auth-btn">Sign In</button>
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
            {filteredProperties.length > 0 ? (
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
                        {hotel.amenities.slice(0, 1).map((a, i) => <span key={i}>{a}</span>)}
                        {hotel.amenities.length > 1 && <span className="more-tag">+{hotel.amenities.length - 1}</span>}
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
                <button className="reset-btn" onClick={() => { setQuery(''); setActiveVibe('All'); filterProperties('All'); }}>Reset Filters</button>
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
    </div>
  );
};

export default GuestSearch;
