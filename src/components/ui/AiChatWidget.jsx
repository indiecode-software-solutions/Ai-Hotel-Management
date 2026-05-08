import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { chatWithAssistant } from '../../services/aiService';

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am your Raj Heritage AI Concierge. How may I assist you with your booking or stay today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Format history for OpenRouter (excluding the initial hardcoded welcome if needed, but it's fine to include)
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      let aiResponse = await chatWithAssistant(apiMessages);
      
      // Parse for Agentic Actions
      const bookingRegex = /\[ACTION:OPEN_BOOKING:(.*?)]/;
      const bookingMatch = aiResponse.match(bookingRegex);
      
      if (bookingMatch) {
        try {
          const payload = JSON.parse(bookingMatch[1]);
          aiResponse = aiResponse.replace(bookingMatch[0], '').trim();
          window.dispatchEvent(new CustomEvent('ai-action-book', { detail: payload }));
        } catch (e) {
          console.error("Failed to parse booking payload", e);
        }
      } else if (aiResponse.includes('[ACTION:OPEN_BOOKING]')) {
        aiResponse = aiResponse.replace('[ACTION:OPEN_BOOKING]', '').trim();
        window.dispatchEvent(new CustomEvent('ai-action-book'));
      }
      
      if (aiResponse.includes('[ACTION:SCROLL_COLLECTION]')) {
        aiResponse = aiResponse.replace('[ACTION:SCROLL_COLLECTION]', '').trim();
        window.dispatchEvent(new CustomEvent('ai-action-scroll'));
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="ai-chat-widget">
      {/* Chat Button (FAB) */}
      <button 
        className={`ai-chat-fab ${isOpen ? 'hidden' : 'flex'}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? 'active' : ''}`}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="flex items-center gap-3">
            <div className="ai-chat-avatar">
              <Sparkles size={16} className="text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-primary m-0 leading-tight">Raj Heritage Concierge</h4>
              <p className="text-xs text-muted m-0">AI Assistant • Online</p>
            </div>
          </div>
          <button className="ai-chat-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message-wrapper ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar">
                  <Sparkles size={12} />
                </div>
              )}
              <div className="chat-bubble">
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="message-avatar user">
                  <User size={12} />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="chat-message-wrapper ai-message">
              <div className="message-avatar">
                <Sparkles size={12} />
              </div>
              <div className="chat-bubble typing-indicator">
                <Loader2 size={16} className="animate-spin text-accent" />
                <span className="text-xs text-muted">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ai-chat-input-area">
          <form onSubmit={handleSend} className="ai-chat-form">
            <input 
              type="text" 
              placeholder="Ask about rooms, bookings..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiChatWidget;
