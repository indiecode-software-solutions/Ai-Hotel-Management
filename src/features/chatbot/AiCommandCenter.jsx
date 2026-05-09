import React, { useState, useEffect } from 'react';
import { Sparkles, Send, TrendingUp, IndianRupee, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAiResponse } from '../../services/aiService';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';

const AiCommandCenter = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [metrics, setMetrics] = useState({ occupancy: 0, revpar: 0, demand: 'Medium' });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [rooms, bookings] = await Promise.all([
          roomService.getRooms(),
          bookingService.getAllBookings()
        ]);

        const totalRooms = rooms.length || 1; // Prevent division by zero
        const today = new Date().setHours(0, 0, 0, 0);

        // Find bookings active today
        const activeBookings = bookings.filter(b => {
          const checkIn = new Date(b.check_in_date).setHours(0, 0, 0, 0);
          const checkOut = new Date(b.check_out_date).setHours(0, 0, 0, 0);
          // A booking is active if check-in is today or earlier, and check-out is after today
          return checkIn <= today && checkOut > today && b.status !== 'cancelled';
        });

        const bookedRoomsCount = activeBookings.length;
        const occupancyRate = (bookedRoomsCount / totalRooms) * 100;

        let todayRevenue = 0;
        activeBookings.forEach(b => {
          const checkIn = new Date(b.check_in_date).setHours(0, 0, 0, 0);
          const checkOut = new Date(b.check_out_date).setHours(0, 0, 0, 0);
          const nights = Math.max(1, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
          const dailyRate = Number(b.total_price) / nights;
          todayRevenue += dailyRate;
        });

        const revpar = todayRevenue / totalRooms;

        let demand = 'Low';
        if (occupancyRate >= 80) demand = 'High';
        else if (occupancyRate >= 50) demand = 'Medium';

        setMetrics({
          occupancy: Math.round(occupancyRate),
          revpar: Math.round(revpar),
          demand
        });
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  const suggestions = [
    "Show today's bookings",
    "Optimize pricing",
    "Analyze guest reviews",
    "Check occupancy trends"
  ];

  const handleSearch = async (text = query) => {
    if (!text.trim()) return;
    
    setIsThinking(true);
    setResponse(null);
    
    try {
      const todayString = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const context = `Admin Dashboard Context: Today is ${todayString}. Occupancy is ${metrics.occupancy}%. RevPAR is ₹${metrics.revpar}. Demand is ${metrics.demand}.`;
      
      const res = await generateAiResponse(text, context);
      setResponse(res);
    } catch (error) {
      setResponse("Failed to connect to AI command. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  const insights = [
    { label: 'Occupancy', value: isLoadingMetrics ? '...' : `${metrics.occupancy}%`, icon: <TrendingUp size={14} />, color: 'var(--action-primary)' },
    { label: 'RevPAR', value: isLoadingMetrics ? '...' : `₹${metrics.revpar.toLocaleString()}`, icon: <IndianRupee size={14} />, color: 'var(--action-accent)' },
    { label: 'Demand', value: isLoadingMetrics ? '...' : metrics.demand, icon: <AlertCircle size={14} />, color: metrics.demand === 'High' ? '#ef4444' : metrics.demand === 'Medium' ? '#f59e0b' : '#10b981' }
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 🚀 AI HEADING */}
      <div className="flex items-center gap-3 mb-2">
        <div className="ai-icon-box">
          <Sparkles size={20} color="var(--surface-base)" className={isThinking ? 'animate-pulse' : ''} />
        </div>
        <div>
          <h2 className="text-primary font-extrabold mb-0 text-2xl ai-text-shadow">AI Command Center</h2>
          <p className="text-muted mb-0 text-sm ai-sub-shadow">Interactive Intelligence at your service</p>
        </div>
      </div>

      {/* 💬 INPUT AREA */}
      <div className="relative w-full">
        <input 
          type="text" 
          placeholder="Ask anything about your hotel..." 
          className="ai-search-input w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="ai-send-btn" onClick={() => handleSearch()}>
          <Send size={18} />
        </button>
      </div>

      {/* 🤖 AI RESPONSE */}
      {response && (
        <div className="ai-response-panel p-5 rounded-2xl border border-subtle bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
             <Sparkles size={14} className="text-accent" />
             <span className="text-accent uppercase text-[10px] font-bold tracking-widest">Raj Heritage AI Analysis</span>
          </div>
          <div className="text-primary text-sm leading-relaxed mb-0 ai-markdown">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* 💡 QUICK ACTIONS */}
      <div className="flex flex-wrap gap-3">
        {suggestions.map((text, i) => (
          <button key={i} className="ai-chip" onClick={() => { setQuery(text); handleSearch(text); }}>
            {text}
          </button>
        ))}
      </div>

      {/* 📊 AI INSIGHTS */}
      <div className="ai-insights-panel grid grid-cols-3 gap-5">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex ai-insight-icon" style={{ 
              color: insight.color, 
              background: `${insight.color}20` 
            }}>
              {insight.icon}
            </div>
            <div>
              <div className="text-muted uppercase text-xs tracking-wider">{insight.label}</div>
              <div className="text-primary font-bold text-base">{insight.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiCommandCenter;
