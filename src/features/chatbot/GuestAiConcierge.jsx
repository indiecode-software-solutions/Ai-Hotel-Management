import React, { useState } from 'react';
import { Sparkles, Send, MapPin, Calendar, Coffee } from 'lucide-react';
import '../../styles/guest.css';

const GuestAiConcierge = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Welcome to Oasis. I am your AI Concierge. How can I assist you with your stay today?' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    { icon: <MapPin size={12} />, text: 'Local Attractions' },
    { icon: <Calendar size={12} />, text: 'Check Availability' },
    { icon: <Coffee size={12} />, text: 'Dining & Spa' }
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'I can certainly help with that! Let me fetch the best options for your request...'
      }]);
    }, 1000);
  };

  return (
    <div className="guest-ai-concierge">
      <div className="guest-ai-header">
        <div className="guest-ai-icon-wrap">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="guest-ai-title">AI Concierge</div>
          <div className="guest-ai-subtitle">Always here to help</div>
        </div>
      </div>

      <div className="guest-ai-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`guest-ai-msg ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="guest-ai-input-area">
        <input
          type="text"
          className="guest-ai-input"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="guest-ai-send" onClick={handleSend}>
          <Send size={14} />
        </button>
      </div>

      <div className="guest-ai-chips">
        {suggestions.map((s, i) => (
          <div key={i} className="guest-ai-chip flex items-center gap-1" onClick={() => {
            setInput(s.text);
          }}>
            {s.icon} {s.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestAiConcierge;
