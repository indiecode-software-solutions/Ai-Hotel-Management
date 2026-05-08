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
          <header className="mb-12">
            <h2 className="text-5xl font-black text-white mb-4 tracking-tight">My Stays</h2>
            <p className="text-gray-400 text-lg">Your collection of luxury escapes and upcoming heritage experiences.</p>
          </header>

          {/* Tabs */}
          <div className="flex gap-8 mb-10 border-b border-white/5 pb-4">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`text-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'upcoming' ? 'text-accent-gold' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Ticket size={24} /> Upcoming Stays
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`text-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'past' ? 'text-accent-gold' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <History size={24} /> Past History
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-accent-gold" size={48} />
              <p className="text-gray-400 animate-pulse">Syncing your luxury timeline...</p>
            </div>
          ) : displayBookings.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <Sparkles className="mx-auto text-accent-gold mb-6 opacity-30" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">No bookings found</h3>
              <p className="text-gray-400 mb-8">Your next sanctuary is waiting to be discovered.</p>
              <Button variant="accent" onClick={() => navigate('/search')}>Explore Destinations</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {displayBookings.map((booking, idx) => (
                <div 
                  key={booking.id} 
                  className="stay-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-accent-gold/30 reveal-on-scroll"
                  style={{ animationDelay: `${idx * 0.1}s` }}
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
        
        .stay-card:hover .card-image {
          transform: scale(1.1) !important;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal-on-scroll {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MyStays;
