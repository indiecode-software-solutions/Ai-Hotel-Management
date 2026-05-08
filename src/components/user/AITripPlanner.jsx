import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, CheckCircle2, Loader2, Plane, Hotel, MapPin, Users, DollarSign, CloudSun, Send, Plus, Trash2, Edit3, Cloud } from 'lucide-react';
import '../../styles/guest.css';
import { generateAiResponse } from '../../services/aiService';
import plannerHero from '../../assets/Drone View.jpg';
import day1Img from '../../assets/Rajmahal (2).jpg';
import day5Img from '../../assets/Drone View Pool Side.jpg';

const AITripPlanner = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [mode, setMode] = useState('ai'); // 'ai' or 'manual'
  
  // Extra parameters
  const [guests, setGuests] = useState(2);
  const [duration, setDuration] = useState(7);
  const [selectedStyle, setSelectedStyle] = useState('Luxury');
  const travelStyles = ['Luxury', 'Adventure', 'Cultural', 'Wellness', 'Romantic'];

  const [adjustPrompt, setAdjustPrompt] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const [newActivityInputs, setNewActivityInputs] = useState({});

  const iconMap = {
    hotel: Hotel,
    plane: Plane,
    mapPin: MapPin,
    calendar: Calendar,
    sparkles: Sparkles
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setItinerary(null);
    
    try {
      const systemPrompt = `You are a luxury travel planner for Raj Heritage Hospitality. 
      Generate a detailed travel itinerary in JSON format.
      The JSON must follow this exact structure:
      {
        "destination": "Name of destination",
        "duration": "Number of Days (e.g., 5 Days)",
        "vibe": "Travel Style (e.g., Luxury, Adventure)",
        "guests": "Number of Travelers",
        "costEstimate": "Estimated cost in INR (e.g., ₹85,000)",
        "weather": "Current weather vibe (e.g., 72°F Mist)",
        "days": [
          {
            "day": "Day X: Title",
            "activities": ["Activity 1", "Activity 2"],
            "icon": "hotel" | "plane" | "mapPin"
          }
        ]
      }
      Focus on South India (Karnataka, Hyderabad) destinations like Coorg, Hampi, Mysore, or Gokarna.
      Return ONLY the raw JSON string without any markdown formatting or extra text.`;

      const userMessage = `Create a ${duration}-day ${selectedStyle} trip for ${guests} people based on this prompt: "${prompt}"`;
      
      const response = await generateAiResponse(userMessage, systemPrompt);
      
      if (response.includes("Raj Heritage network is currently experiencing high demand")) {
        throw new Error("AI Service unavailable");
      }

      // Clean the response if AI wraps it in markdown blocks
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("Invalid AI response format");
      }

      const cleanJson = response.substring(jsonStart, jsonEnd);
      const data = JSON.parse(cleanJson);
      
      setItinerary({
        ...data,
        heroImage: plannerHero,
        days: data.days.map((day, idx) => ({
          ...day,
          image: idx === 0 ? day1Img : (idx === data.days.length - 1 ? day5Img : null)
        }))
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      // Fallback to a basic itinerary or error state if needed
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartManual = () => {
    setItinerary({
      destination: "Custom Destination",
      duration: `${duration} Days`,
      vibe: selectedStyle,
      guests: `${guests} Travelers`,
      costEstimate: "TBD",
      weather: "Check Forecast",
      heroImage: plannerHero,
      days: [
        {
          day: "Day 1",
          activities: [],
          icon: "mapPin"
        }
      ]
    });
  };

  const handleAdjust = async () => {
    if (!adjustPrompt.trim() || !itinerary) return;
    setIsAdjusting(true);
    try {
      const systemPrompt = `You are a luxury travel planner for Raj Heritage Hospitality. 
      The user wants to adjust their current itinerary.
      Return the COMPLETELY UPDATED itinerary in the same JSON format as before.
      
      Current Itinerary:
      ${JSON.stringify(itinerary, null, 2)}

      Return ONLY the raw JSON string.`;

      const userMessage = `Adjust the itinerary based on this request: "${adjustPrompt}"`;
      
      const response = await generateAiResponse(userMessage, systemPrompt);
      
      if (response.includes("Raj Heritage network is currently experiencing high demand")) {
        throw new Error("AI Service unavailable");
      }

      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("Invalid AI response format");
      }

      const cleanJson = response.substring(jsonStart, jsonEnd);
      const data = JSON.parse(cleanJson);
      
      setItinerary({
        ...data,
        heroImage: plannerHero,
        days: data.days.map((day, idx) => ({
          ...day,
          image: idx === 0 ? day1Img : (idx === data.days.length - 1 ? day5Img : null)
        }))
      });
      setAdjustPrompt('');
    } catch (error) {
      console.error("AI Adjustment Error:", error);
    } finally {
      setIsAdjusting(false);
    }
  };

  // Manual Editing Functions
  const removeActivity = (dayIndex, actIndex) => {
    const updatedItinerary = { ...itinerary };
    updatedItinerary.days[dayIndex].activities.splice(actIndex, 1);
    setItinerary(updatedItinerary);
  };

  const addActivity = (dayIndex) => {
    const val = newActivityInputs[dayIndex];
    if (!val || !val.trim()) return;
    const updatedItinerary = { ...itinerary };
    updatedItinerary.days[dayIndex].activities.push(val.trim());
    setItinerary(updatedItinerary);
    setNewActivityInputs(prev => ({ ...prev, [dayIndex]: '' }));
  };

  const addNewDay = () => {
    const updatedItinerary = { ...itinerary };
    updatedItinerary.days.push({
      day: `Day ${updatedItinerary.days.length + 1}`,
      activities: [],
      icon: "mapPin"
    });
    setItinerary(updatedItinerary);
  };

  const updateDestination = (e) => {
    setItinerary({...itinerary, destination: e.target.value});
  };

  return (
    <section id="destinations" className="section-container planner-section">
      <div className="planner-split-layout reveal-on-scroll">
        <div className="planner-left-col">
          <div className="planner-header-sticky">
            <div className="planner-visual">
              <img src={plannerHero} alt="Cinematic Escape" />
              <div className="visual-overlay"></div>
              
              <div className="planner-visual-content">
                <a 
                  href="https://travel-planner-ai-mu.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="planner-badge clickable"
                >
                  <Sparkles size={16} />
                  <span>AI Trip Planner</span>
                </a>
                <h2 className="section-heading">Design your perfect escape.</h2>
                <p className="section-description">Describe your dream vacation for an AI-curated experience, or build it manually from scratch.</p>
              </div>

              {/* Animated Decorations */}
              <div className="visual-decorations">
                <div className="decoration-cloud cloud-1"><Cloud size={40} strokeWidth={1} /></div>
                <div className="decoration-cloud cloud-2"><Cloud size={60} strokeWidth={1} /></div>
                <div className="decoration-balloon balloon-1">
                  <svg width="40" height="55" viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M50 10 C25 10 10 35 10 55 C10 80 40 100 45 110 L55 110 C60 100 90 80 90 55 C90 35 75 10 50 10 Z" />
                    <path d="M20 45 Q50 40 80 45" opacity="0.4" />
                    <path d="M15 70 Q50 65 85 70" opacity="0.4" />
                    <rect x="42" y="120" width="16" height="10" rx="2" />
                    <line x1="45" y1="110" x2="43" y2="120" />
                    <line x1="55" y1="110" x2="57" y2="120" />
                  </svg>
                </div>
                <div className="decoration-balloon balloon-2">
                  <svg width="25" height="35" viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M50 10 C25 10 10 35 10 55 C10 80 40 100 45 110 L55 110 C60 100 90 80 90 55 C90 35 75 10 50 10 Z" />
                    <rect x="42" y="120" width="16" height="10" rx="2" />
                    <line x1="45" y1="110" x2="43" y2="120" />
                    <line x1="55" y1="110" x2="57" y2="120" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="planner-right-col">
          <div className="planner-workspace scrollable-workspace">
            {!itinerary ? (
            <div className="planner-input-area">
              <div className="planner-mode-tabs">
                <button className={`mode-tab ${mode === 'ai' ? 'active' : ''}`} onClick={() => setMode('ai')}><Sparkles size={16}/> AI Magic</button>
                <button className={`mode-tab ${mode === 'manual' ? 'active' : ''}`} onClick={() => setMode('manual')}><Edit3 size={16}/> Manual Builder</button>
              </div>

              <div className="planner-params">
                <div className="param-group">
                  <label>Travel Style</label>
                  <div className="style-pills">
                    {travelStyles.map(style => (
                      <button 
                        key={style} 
                        className={`style-pill ${selectedStyle === style ? 'active' : ''}`}
                        onClick={() => setSelectedStyle(style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="param-group-row">
                  <div className="param-item">
                    <label><Users size={16}/> Guests</label>
                    <input type="number" min="1" max="10" value={guests} onChange={e => setGuests(e.target.value)} />
                  </div>
                  <div className="param-item">
                    <label><Calendar size={16}/> Duration (Days)</label>
                    <input type="number" min="1" max="30" value={duration} onChange={e => setDuration(e.target.value)} />
                  </div>
                </div>
              </div>

              {mode === 'ai' ? (
                <>
                  <textarea 
                    className="planner-textarea"
                    placeholder="E.g., A heritage escape blending Hampi temples with Coorg coffee estates..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="planner-controls">
                    <div className="planner-suggestions">
                      <button onClick={() => setPrompt("A wellness retreat in Coorg focusing on yoga, coffee estate walks, and sunsets.")}>Wellness in Coorg</button>
                      <button onClick={() => setPrompt("A luxury heritage tour in Hampi and Mysore.")}>Heritage Luxe</button>
                    </div>
                    <button 
                      className="generate-btn" 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                    >
                      {isGenerating ? (
                        <><Loader2 className="animate-spin" size={20} /> Crafting...</>
                      ) : (
                        <>Generate <ArrowRight size={20} /></>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="manual-start-area">
                  <p className="manual-hint">Start with a blank canvas and build your itinerary day by day.</p>
                  <button className="generate-btn manual-btn" onClick={handleStartManual}>
                    <Plus size={20} /> Create Blank Itinerary
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="itinerary-result fade-in">
              <div className="itinerary-hero" style={{backgroundImage: `url(${itinerary.heroImage})`}}>
                <div className="hero-overlay"></div>
                <button className="reset-planner-btn hero-reset" onClick={() => setItinerary(null)}>
                  Start Over
                </button>
                <div className="hero-content">
                  <input 
                    className="editable-title-input" 
                    value={itinerary.destination} 
                    onChange={updateDestination} 
                    placeholder="Enter Destination..."
                  />
                  <div className="itinerary-tags">
                    <span className="itag"><Calendar size={14} /> {itinerary.duration}</span>
                    <span className="itag"><Users size={14} /> {itinerary.guests}</span>
                    <span className="itag"><Sparkles size={14} /> {itinerary.vibe}</span>
                    <span className="itag"><DollarSign size={14} /> {itinerary.costEstimate}</span>
                    <span className="itag"><CloudSun size={14} /> {itinerary.weather}</span>
                  </div>
                </div>
              </div>
              
              <div className="itinerary-body">
                <div className="itinerary-timeline manual-enabled">
                  {itinerary.days.map((day, idx) => {
                    const DayIcon = iconMap[day.icon] || MapPin;
                    return (
                      <div key={idx} className="timeline-day stagger-item reveal-active" style={{animationDelay: `${idx * 0.1}s`}}>
                        <div className="day-icon"><DayIcon size={20} className="text-accent" /></div>
                        <div className="day-content">
                          <input 
                            className="editable-day-title" 
                            value={day.day} 
                            onChange={(e) => {
                              const updated = {...itinerary};
                              updated.days[idx].day = e.target.value;
                              setItinerary(updated);
                            }}
                          />
                          <ul className="editable-activities">
                            {day.activities.map((act, i) => (
                              <li key={i}>
                                <CheckCircle2 size={14} className="text-accent flex-shrink-0" /> 
                                <span>{act}</span>
                                <button className="delete-act-btn" onClick={() => removeActivity(idx, i)}><Trash2 size={14}/></button>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="add-activity-row">
                            <input 
                              type="text" 
                              placeholder="Add manual activity..." 
                              value={newActivityInputs[idx] || ''}
                              onChange={(e) => setNewActivityInputs({...newActivityInputs, [idx]: e.target.value})}
                              onKeyDown={(e) => e.key === 'Enter' && addActivity(idx)}
                            />
                            <button onClick={() => addActivity(idx)}><Plus size={16}/></button>
                          </div>
  
                          {day.image && (
                            <div className="day-image">
                              <img src={day.image} alt={day.day} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="add-day-container">
                    <button className="add-day-btn" onClick={addNewDay}>
                      <Plus size={18}/> Add Another Day
                    </button>
                  </div>
                </div>

                <div className="itinerary-adjuster">
                  <div className="adjuster-header">
                    <Sparkles size={16} className="text-accent" />
                    <span>AI Refinement (Optional)</span>
                  </div>
                  <div className="adjuster-input">
                    <input 
                      type="text" 
                      placeholder="E.g., Make it more budget friendly, or add more museum visits..."
                      value={adjustPrompt}
                      onChange={e => setAdjustPrompt(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAdjust()}
                    />
                    <button onClick={handleAdjust} disabled={isAdjusting || !adjustPrompt.trim()}>
                      {isAdjusting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="itinerary-action">
                  <button className="book-itinerary-btn">Secure This Journey</button>
                  <button className="secondary-action-btn">Save to Profile</button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITripPlanner;
