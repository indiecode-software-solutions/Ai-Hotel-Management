import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Download, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  History,
  Ticket,
  Star
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { generateWelcomeMessage } from '../../services/aiService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const MyStays = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [welcomeMessages, setWelcomeMessages] = useState({});
  const [isGenerating, setIsGenerating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.stay-reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [bookings, isLoading]); // Re-run when content changes

  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCountdown = (date) => {
    const target = new Date(date);
    const now = new Date();
    const diff = target - now;
    
    if (diff <= 0) return 'Arrived';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Starts Today' : `${days} days to go`;
  };

  const handleGenerateWelcome = async (booking) => {
    setIsGenerating(prev => ({ ...prev, [booking.id]: true }));
    try {
      const message = await generateWelcomeMessage(booking);
      setWelcomeMessages(prev => ({ ...prev, [booking.id]: message }));
    } catch (error) {
      console.error('Error generating welcome message:', error);
    } finally {
      setIsGenerating(prev => ({ ...prev, [booking.id]: false }));
    }
  };

  const downloadReceipt = (booking) => {
    // Mock receipt download - open a new window with a printable view
    const receiptContent = `
      <html>
        <head>
          <title>Receipt - Raj Heritage</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1a1a1a; }
            .header { border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 24px; font-weight: bold; color: #d4af37; }
            .details { margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">✦ RAJ HERITAGE</div>
            <h1>Digital Receipt</h1>
          </div>
          <div class="details">
            <div class="row"><span>Booking ID:</span> <span>${booking.id.slice(0, 8).toUpperCase()}</span></div>
            <div class="row"><span>Guest:</span> <span>Me</span></div>
            <div class="row"><span>Room:</span> <span>${booking.rooms?.title}</span></div>
            <div class="row"><span>Dates:</span> <span>${booking.check_in_date} to ${booking.check_out_date}</span></div>
            <hr/>
            <div class="row" style="font-weight: bold; font-size: 20px;">
              <span>Total Paid:</span> <span>₹${booking.total_price.toLocaleString()}</span>
            </div>
          </div>
          <div class="footer">
            Thank you for choosing Raj Heritage Hospitality.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    win.document.write(receiptContent);
    win.document.close();
  };

  const upcomingBookings = bookings.filter(b => new Date(b.check_in_date) >= new Date().setHours(0,0,0,0));
  const pastBookings = bookings.filter(b => new Date(b.check_in_date) < new Date().setHours(0,0,0,0));

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="guest-app-container" style={{ background: '#0b0f1a', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav className="guest-navbar scrolled">
        <div className="navbar-left">
          <Link to="/" className="guest-logo">
            <ArrowLeft size={20} className="mr-2" />
            <span>BACK TO HOME</span>
          </Link>
        </div>
        <div className="navbar-right">
          <h1 className="text-accent-gold font-bold tracking-widest text-sm uppercase">Guest Portal</h1>
        </div>
      </nav>

      <main className="section-container pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <header className="mb-16 stay-reveal">
            <span className="text-accent-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Guest History</span>
            <h2 className="text-6xl font-black text-white mb-4 tracking-tighter">My Stays</h2>
            <p className="text-gray-400 text-lg font-light max-w-xl leading-relaxed">Your collection of luxury escapes and upcoming heritage experiences, curated by AI.</p>
          </header>

          {/* Premium Glass Tabs */}
          <div className="glass-tabs-container mb-12 stay-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="glass-tabs-pill">
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              >
                <Ticket size={18} />
                <span>Upcoming Stays</span>
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              >
                <History size={18} />
                <span>Past History</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 stay-reveal">
              <div className="relative">
                <Loader2 className="animate-spin text-accent-gold" size={64} />
                <div className="absolute inset-0 blur-2xl bg-accent-gold/20 animate-pulse"></div>
              </div>
              <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Syncing your luxury timeline...</p>
            </div>
          ) : displayBookings.length === 0 ? (
            <div className="empty-state-card stay-reveal" style={{ transitionDelay: '0.4s' }}>
              <div className="empty-glow"></div>
              <Sparkles className="text-accent-gold mb-8 opacity-50" size={80} />
              <h3 className="text-3xl font-bold text-white mb-4">No sanctuaries found</h3>
              <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">Your next legendary stay is just a search away. Let our AI find your perfect match.</p>
              <button className="explore-btn" onClick={() => navigate('/search')}>
                Explore Destinations <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {displayBookings.map((booking, idx) => (
                <div 
                  key={booking.id} 
                  className="stay-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-accent-gold/30 stay-reveal"
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Media Section */}
                    <div className="w-full md:w-80 h-64 md:h-auto relative overflow-hidden">
                      <img 
                        src={booking.rooms?.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80'} 
                        alt={booking.rooms?.title}
                        className="w-full h-full object-cover transition-transform duration-700 card-image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <Badge status={activeTab === 'upcoming' ? 'success' : 'default'}>
                          {activeTab === 'upcoming' ? 'CONFIRMED' : 'COMPLETED'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-3xl font-extrabold text-white mb-1">{booking.rooms?.title}</h3>
                            <div className="flex items-center text-gray-400 gap-2 text-sm uppercase tracking-widest">
                              <MapPin size={14} /> {booking.rooms?.location || 'Orchha, MP'}
                            </div>
                          </div>
                          {activeTab === 'upcoming' && (
                            <div className="text-right">
                              <div className="text-accent-gold font-black text-2xl tracking-tighter">
                                {calculateCountdown(booking.check_in_date)}
                              </div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Countdown</div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/5 rounded-xl text-accent-gold"><Calendar size={20} /></div>
                            <div>
                              <div className="text-[10px] text-gray-500 uppercase">Check-in</div>
                              <div className="text-white font-bold">{booking.check_in_date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/5 rounded-xl text-accent-gold"><Clock size={20} /></div>
                            <div>
                              <div className="text-[10px] text-gray-500 uppercase">Status</div>
                              <div className="text-white font-bold">{booking.status}</div>
                            </div>
                          </div>
                        </div>

                        {/* AI Welcome Box */}
                        {activeTab === 'upcoming' && (
                          <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-2 text-accent-gold mb-3">
                              <Sparkles size={18} />
                              <span className="text-xs font-bold uppercase tracking-widest">AI Concierge Welcome</span>
                            </div>
                            {welcomeMessages[booking.id] ? (
                              <p className="text-white/90 italic leading-relaxed text-sm">
                                "{welcomeMessages[booking.id]}"
                              </p>
                            ) : (
                              <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm italic">Unlock your personalized pre-trip experience.</p>
                                <button 
                                  onClick={() => handleGenerateWelcome(booking)}
                                  disabled={isGenerating[booking.id]}
                                  className="text-accent-gold hover:text-white transition-colors text-xs font-bold underline decoration-dotted"
                                >
                                  {isGenerating[booking.id] ? 'Curating message...' : 'Generate Welcome'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-2xl font-bold text-white">
                          ₹{Number(booking.total_price).toLocaleString()}
                        </div>
                        <div className="flex gap-4">
                          {activeTab === 'past' && (
                            <button 
                              onClick={() => downloadReceipt(booking)}
                              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-all border border-white/10"
                            >
                              <Download size={18} /> Receipt
                            </button>
                          )}
                          <button className="p-3 bg-accent-gold hover:bg-white text-black rounded-xl transition-all">
                            <ChevronRight size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .text-accent-gold { color: var(--accent-gold); }
        .bg-accent-gold { background-color: var(--accent-gold); }
        .border-accent-gold { border-color: var(--accent-gold); }
        
        .glass-tabs-container {
          display: flex;
          justify-content: flex-start;
        }

        .glass-tabs-pill {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          padding: 6px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          gap: 4px;
        }

        .tab-btn {
          padding: 10px 24px;
          border-radius: 100px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
          background: var(--text-primary);
          color: var(--surface-base);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
        }

        .empty-state-card {
          position: relative;
          padding: 80px 40px;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          overflow: hidden;
        }

        .empty-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .explore-btn {
          background: transparent;
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 14px 32px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 auto;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .explore-btn:hover {
          background: var(--accent-gold);
          color: var(--surface-base);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
        }

        .stay-card:hover .card-image {
          transform: scale(1.1) !important;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        
        .stay-reveal {
          opacity: 0;
          filter: blur(10px);
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity, filter;
        }

        .stay-reveal.revealed {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default MyStays;
