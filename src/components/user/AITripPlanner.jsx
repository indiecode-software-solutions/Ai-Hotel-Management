import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, CheckCircle2, Loader2, Plane, Hotel, MapPin, Users, DollarSign, CloudSun, Send, Plus, Trash2, Edit3, Cloud } from 'lucide-react';
import '../../styles/guest.css';

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

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setItinerary(null);
    
    // Mock API call to simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setItinerary({
        destination: "Kyoto & Tokyo, Japan",
        duration: `${duration} Days`,
        vibe: `${selectedStyle} & Futuristic`,
        guests: `${guests} Travelers`,
        costEstimate: "$4,500 - $6,000",
        weather: "68°F (Sunny)",
        heroImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
        days: [
          {
            day: "Day 1-3: Kyoto Heritage",
            activities: [
              "Check-in at The Bamboo Sanctuary (5-star ryokan)", 
              "Private Tea Ceremony in Gion", 
              "VIP Fushimi Inari Shrine Twilight Tour"
            ],
            icon: <Hotel className="text-accent" size={20} />,
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80"
          },
          {
            day: "Day 4: The Transit",
            activities: [
              "Shinkansen First Class to Tokyo", 
              "Exclusive Bento Box Tasting curated by a Michelin chef", 
              "Evening Arrival at Shinjuku & Neo Luxe Tower Check-in"
            ],
            icon: <Plane className="text-accent" size={20} />
          },
          {
            day: "Day 5-7: Neon Tokyo",
            activities: [
              "Helicopter City Tour over Shibuya", 
              "Akihabara Tech Tour with Private Guide", 
              "15-Course Omakase Dining Experience"
            ],
            icon: <MapPin className="text-accent" size={20} />,
            image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80"
          }
        ]
      });
    }, 2500);
  };

  const handleStartManual = () => {
    setItinerary({
      destination: "Custom Destination",
      duration: `${duration} Days`,
      vibe: selectedStyle,
      guests: `${guests} Travelers`,
      costEstimate: "TBD",
      weather: "Check Forecast",
      heroImage: "https://images.unsplash.com/photo-1506929113614-bb4847321e0f?auto=format&fit=crop&w=1200&q=80",
      days: [
        {
          day: "Day 1",
          activities: [],
          icon: <MapPin className="text-accent" size={20} />
        }
      ]
    });
  };

  const handleAdjust = () => {
    if (!adjustPrompt.trim()) return;
    setIsAdjusting(true);
    setTimeout(() => {
      setIsAdjusting(false);
      setAdjustPrompt('');
    }, 1500);
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
      icon: <MapPin className="text-accent" size={20} />
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
              <img src="https://images.unsplash.com/photo-1667403206492-a7fc384d46a6?auto=format&fit=crop&w=1200&q=80" alt="Cinematic Escape" />
              <div className="visual-overlay"></div>
              
              <div className="planner-visual-content">
                <div className="planner-badge">
                  <Sparkles size={16} />
                  <span>AI Trip Planner</span>
                </div>
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
                    placeholder="E.g., A romantic getaway blending ancient temples with futuristic cityscapes..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="planner-controls">
                    <div className="planner-suggestions">
                      <button onClick={() => setPrompt("A wellness retreat in Bali focusing on yoga, vegan food, and beach sunsets.")}>Wellness in Bali</button>
                      <button onClick={() => setPrompt("A luxury shopping and culinary tour in Paris.")}>Paris Luxe</button>
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
                  {itinerary.days.map((day, idx) => (
                    <div key={idx} className="timeline-day stagger-item reveal-active" style={{animationDelay: `${idx * 0.1}s`}}>
                      <div className="day-icon">{day.icon}</div>
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
                  ))}
                  
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
