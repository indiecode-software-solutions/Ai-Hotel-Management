import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Search, MapPin, Heart, ArrowLeft, Filter, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../../styles/guest.css';
import { generateAiResponse } from '../../services/aiService';
import OasisGlobe from '../../components/ui/OasisGlobe';
import BookingModal from '../../features/booking/BookingModal';

// Mock Database
const MOCK_PROPERTIES = [
  { id: 1, title: 'The Sapphire Resort', location: 'Maldives, Indian Ocean', price: '$540', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80', amenities: ['Private Beach', 'Infinity Pool', 'Heliport'], vibe: 'Tropical', rating: 4.9, coordinates: [3.2028, 73.2207] },
  { id: 2, title: 'Azure Garden Villas', location: 'Bali, Indonesia', price: '$420', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', amenities: ['Yoga Studio', 'Eco-Smart', 'Spa & Wellness'], vibe: 'Minimalist', rating: 4.8, coordinates: [-8.4095, 115.1889] },
  { id: 3, title: 'The Metropolis Luxe', location: 'New York City, USA', price: '$890', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', amenities: ['Sky Deck', 'Fine Dining', 'Concierge'], vibe: 'Industrial', rating: 4.7, coordinates: [40.7128, -74.0060] },
  { id: 4, title: 'Neon Nights Loft', location: 'Tokyo, Japan', price: '$350', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', amenities: ['Smart Home', 'City View', 'Game Room'], vibe: 'Industrial', rating: 4.6, coordinates: [35.6762, 139.6503] },
  { id: 5, title: 'Desert Mirage', location: 'Dubai, UAE', price: '$1200', image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=800&q=80', amenities: ['Private Chef', 'Pool', 'Dune Buggy'], vibe: 'Minimalist', rating: 4.9, coordinates: [25.2048, 55.2708] },
  { id: 6, title: 'Rainforest Canopy Retreat', location: 'Costa Rica', price: '$480', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80', amenities: ['Eco-Tours', 'Hot Springs', 'Wildlife'], vibe: 'Tropical', rating: 4.8, coordinates: [9.7489, -83.7534] },
];

const VIBES = ['All', 'Minimalist', 'Industrial', 'Tropical'];

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
      if (lowerQ.includes('minimal')) matchedVibe = 'Minimalist';
      else if (lowerQ.includes('industrial') || lowerQ.includes('city') || lowerQ.includes('urban')) matchedVibe = 'Industrial';
      else if (lowerQ.includes('tropic') || lowerQ.includes('beach') || lowerQ.includes('nature')) matchedVibe = 'Tropical';
      
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
          <span>OASIS HOSPITALITY</span>
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
          <OasisGlobe properties={filteredProperties} />
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
