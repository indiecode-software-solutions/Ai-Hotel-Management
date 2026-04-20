import React, { useState } from 'react';
import { Sparkles, Send, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAiResponse } from '../../services/aiService';

const AiCommandCenter = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

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
      const res = await generateAiResponse(text, "Admin Dashboard Context: Today is Saturday. Occupancy is 88%. RevPAR is $240. Next big event: Tech Conference on Monday.");
      setResponse(res);
    } catch (error) {
      setResponse("Failed to connect to AI command. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  const insights = [
    { label: 'Occupancy', value: '+12%', icon: <TrendingUp size={14} />, color: 'var(--action-primary)' },
    { label: 'RevPAR', value: '+$42', icon: <DollarSign size={14} />, color: 'var(--action-accent)' },
    { label: 'Demand', value: 'High', icon: <AlertCircle size={14} />, color: '#ef4444' }
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 🚀 AI HEADING */}
      <div className="flex items-center gap-3 mb-2">
        <div className="ai-icon-box">
          <Sparkles size={20} color="var(--surface-base)" className={isThinking ? 'animate-pulse' : ''} />
        </div>
        <div>
          <h2 className="text-primary font-extrabold mb-0 text-2xl">AI Command Center</h2>
          <p className="text-muted mb-0 text-sm">Interactive Intelligence at your service</p>
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
             <span className="text-accent uppercase text-[10px] font-bold tracking-widest">Oasis AI Analysis</span>
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
