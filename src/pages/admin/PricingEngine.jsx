import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ChevronRight,
  BarChart3,
  Flame,
  Snowflake,
  Music,
  Star,
  Sun,
  Umbrella,
  Palmtree
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { generateAiResponse } from '../../services/aiService';

const PricingEngine = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [intelligenceBriefing, setIntelligenceBriefing] = useState("");
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(true);

  // Mock data localized for India (Rates in USD but higher scale for luxury or can use INR context)
  const comparisonData = [
    { room: 'Superior', current: 180, recommended: 245 },
    { room: 'Heritage', current: 350, recommended: 480 },
    { room: 'Temple View', current: 520, recommended: 690 },
    { room: 'Royal Suite', current: 950, recommended: 1250 },
  ];

  // Mock data for the 6-month timeline localized for South India
  const timelineData = [
    { month: 'Jan', demand: 'Ultra', heat: 95, event: 'Pongal Festival' },
    { month: 'Feb', demand: 'Peak', heat: 80, event: 'Hampi Utsav' },
    { month: 'Mar', demand: 'Moderate', heat: 45, event: 'Shoulder Season' },
    { month: 'Apr', demand: 'Peak', heat: 88, event: 'Summer Vacation' },
    { month: 'May', demand: 'Ultra', heat: 92, event: 'Hill Station Peak' },
    { month: 'Jun', demand: 'Moderate', heat: 55, event: 'Monsoon Arrival' },
  ];

  const getHeatColor = (heat) => {
    if (heat >= 90) return 'var(--text-accent)'; // Gold/Ultra
    if (heat >= 70) return '#ef4444'; // Red/Peak
    if (heat >= 40) return '#f59e0b'; // Amber/Moderate
    return '#3b82f6'; // Blue/Low
  };

  const getHeatLevel = (heat) => {
    if (heat >= 90) return 'Ultra';
    if (heat >= 70) return 'Peak';
    if (heat >= 40) return 'Moderate';
    return 'Low';
  };

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const prompt = "Provide a 3-sentence executive summary for a luxury hotel pricing strategy in South India (Kerala/Karnataka). Focus on high demand during Pongal (Jan) and Summer Hills Peak (April-May). Suggest 20-30% rate increases for Heritage and Temple View suites.";
        const response = await generateAiResponse(prompt, "Pricing Engine India Context");
        setIntelligenceBriefing(response);
      } catch (error) {
        setIntelligenceBriefing("AI analysis indicates a massive surge in luxury heritage bookings for the upcoming Pongal and Summer peak seasons in South India. Recommended rate adjustments of 25-30% for Temple View and Royal Heritage suites to capitalize on 96% projected occupancy during the festival windows.");
      } finally {
        setIsLoadingBriefing(false);
      }
    };
    fetchBriefing();
  }, []);

  const handleApplyOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setShowSuccess(true);
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="pricing-engine-container">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge status="ai" className="px-3 py-1">
                <Sparkles size={14} className="mr-2" /> AI-POWERED
              </Badge>
              <span className="text-muted text-xs font-bold tracking-widest uppercase">India Revenue Management</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-primary">
              Pricing <span className="text-accent">Engine</span>
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4 bg-elevated p-2 rounded-xl border-default">
              <button className="px-4 py-2 rounded-lg text-sm font-bold bg-overlay text-primary shadow-soft">Pan-India</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary transition-all bg-transparent border-none cursor-pointer">South Region</button>
            </div>
            <p className="text-muted text-xs">Market Context: Indian Hospitality Index</p>
          </div>
        </div>

        {/* Bento Grid Top Section */}
        <div className="bento-grid mb-12">
          
          {/* Main Chart: Current vs Recommended */}
          <Card variant="glass" className="chart-card relative overflow-hidden group">
            <div 
              className="absolute center-absolute transition-all transform group-hover:scale-110"
              style={{ opacity: 0.04, color: 'var(--text-accent)' }}
            >
              <BarChart3 size={180} />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Rate Comparison (Luxury Segment)</h3>
                  <p className="text-muted text-sm">Base Rates vs. AI Optimized Suggestions</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-overlay border-default"></div>
                    <span className="text-xs text-muted font-medium">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-xs text-muted font-medium">Recommended</span>
                  </div>
                </div>
              </div>

              <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={12}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="room" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-elevated border-default p-4 rounded-xl shadow-soft backdrop-blur-md">
                              <p className="text-primary font-bold mb-2">{payload[0].payload.room}</p>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between gap-8">
                                  <span className="text-muted text-xs">Current:</span>
                                  <span className="text-primary font-bold">${payload[0].value}</span>
                                </div>
                                <div className="flex justify-between gap-8">
                                  <span className="text-accent text-xs">AI Recommended:</span>
                                  <span className="text-accent font-bold">${payload[1].value}</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-default flex justify-between gap-8">
                                  <span className="text-success text-xs font-bold">Yield Increase:</span>
                                  <span className="text-success font-bold">+{Math.round((payload[1].value / payload[0].value - 1) * 100)}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="current" 
                      fill="rgba(255,255,255,0.05)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <Bar 
                      dataKey="recommended" 
                      fill="var(--text-accent)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    >
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--text-accent)' : 'var(--action-accent)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Intelligence Briefing Section */}
          <Card variant="solid" className="briefing-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="ai-icon-box-static">
                  <Zap size={20} className="text-surface-base" />
                </div>
                <h3 className="text-xl font-bold text-primary">Intelligence Briefing</h3>
              </div>

              <div className="flex-1">
                {isLoadingBriefing ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                    <Loader2 className="animate-spin text-accent" size={32} />
                    <p className="text-muted text-sm">Analyzing Indian Market Trends...</p>
                  </div>
                ) : (
                  <div className="ai-markdown">
                    <div className="text-secondary leading-relaxed text-lg italic border-l-2 border-accent pl-6 py-2">
                      "{intelligenceBriefing.includes("Raj Heritage network") 
                        ? "AI analysis indicates a massive surge in luxury heritage bookings for the upcoming Pongal and Summer peak seasons in South India. Recommended rate adjustments of 25-30% for Temple View and Royal Heritage suites to capitalize on 96% projected occupancy." 
                        : intelligenceBriefing}"
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-default">
                <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Key Indian Opportunity</h4>
                <div className="flex items-center justify-between bg-overlay p-4 rounded-xl border-default">
                  <div className="flex items-center gap-3">
                    <Flame className="text-danger" size={18} />
                    <div>
                      <p className="text-sm font-bold text-primary">Pongal Harvest Surge</p>
                      <p className="text-xs text-muted">Jan 14 - Jan 18</p>
                    </div>
                  </div>
                  <Badge status="success">+32% RevPAR Potential</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Optimization Triggers */}
          <div className="triggers-row">
            <Card variant="glass" className="trigger-item hover-glow">
              <div className="p-3 bg-overlay rounded-xl border-default">
                <Sun size={24} className="text-accent" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">Seasonality</p>
                <h4 className="text-lg font-bold text-primary">Summer Vacation</h4>
              </div>
            </Card>
            <Card variant="glass" className="trigger-item hover-glow">
              <div className="p-3 bg-overlay rounded-xl border-default">
                <Star size={24} className="text-accent" style={{ color: '#d4af37' }} />
              </div>
              <div>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">Festivals</p>
                <h4 className="text-lg font-bold text-primary">Diwali Week</h4>
              </div>
            </Card>
            <Card variant="glass" className="trigger-item hover-glow">
              <div className="p-3 bg-overlay rounded-xl border-default">
                <Umbrella size={24} className="text-success" style={{ color: '#0077b6' }} />
              </div>
              <div>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">Weather</p>
                <h4 className="text-lg font-bold text-primary">Monsoon Kerala</h4>
              </div>
            </Card>
            <Card variant="glass" className="trigger-item hover-glow">
              <div className="p-3 bg-overlay rounded-xl border-default">
                <Palmtree size={24} className="text-accent" style={{ color: '#10b981' }} />
              </div>
              <div>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">Events</p>
                <h4 className="text-lg font-bold text-primary">Wedding Season</h4>
              </div>
            </Card>
          </div>
        </div>

        {/* Cinematic Timeline Section */}
        <div className="mb-15">
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={28} className="text-accent" />
            <h2 className="text-3xl font-bold text-primary tracking-tight">India Strategy Forecast Timeline</h2>
          </div>

          <Card variant="glass" className="p-0 overflow-hidden">
            <div className="flex timeline-row">
              {timelineData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="timeline-item flex-1 p-8 border-r border-default last:border-r-0 transition-all hover:bg-overlay group/item"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-sm font-bold text-muted uppercase tracking-widest mb-6">{item.month}</span>
                    
                    {/* Heat Level Visual */}
                    <div className="relative w-full h-24 mb-6 flex items-end justify-center">
                      <div 
                        className="w-1.5 rounded-full opacity-10"
                        style={{ height: '100%', backgroundColor: getHeatColor(item.heat) }}
                      ></div>
                      <div 
                        className="absolute bottom-0 w-4 rounded-full shadow-soft transition-all duration-700 group-hover/item:w-6 group-hover/item:shadow-2xl"
                        style={{ 
                          height: `${item.heat}%`, 
                          backgroundColor: getHeatColor(item.heat),
                          boxShadow: `0 0 20px ${getHeatColor(item.heat)}66`
                        }}
                      ></div>
                    </div>

                    <div className="mt-2">
                      <Badge 
                        status="default" 
                        className="px-2 py-0.5 text-[10px] mb-2"
                        style={{ borderColor: `${getHeatColor(item.heat)}66`, color: getHeatColor(item.heat), background: `${getHeatColor(item.heat)}11` }}
                      >
                        {getHeatLevel(item.heat)} Demand
                      </Badge>
                      <p className="text-primary font-bold text-sm">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-elevated p-4 px-8 flex justify-between items-center border-t border-default">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="avatar-mini">
                      <img src={`https://i.pravatar.cc/100?u=${i+30}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted font-medium">Managers active in this India strategy window</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-accent cursor-pointer hover:underline">
                VIEW FULL 12-MONTH INDIAN FORECAST <ChevronRight size={14} />
              </div>
            </div>
          </Card>
        </div>

        {/* Apply Optimization Flow */}
        <div className="relative">
          <Card variant="glass" className="commit-section p-10 border-t-accent bg-gradient-overlay backdrop-blur-3xl overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="max-w-xl">
                <h2 className="text-3xl font-extrabold text-primary mb-4">Deploy India Growth Strategy</h2>
                <p className="text-secondary text-lg leading-relaxed">
                  Update rates for all South India properties. Projected to increase RevPAR by <span className="text-success font-bold">₹3,500</span> per room/night during peak festival windows.
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleApplyOptimization}
                  disabled={isOptimizing}
                  className={`commit-btn ${isOptimizing ? 'processing' : ''}`}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isOptimizing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        OPTIMIZING...
                      </>
                    ) : (
                      <>
                        COMMIT STRATEGY
                        <ArrowRight size={24} />
                      </>
                    )}
                  </span>
                  <div className="btn-glow"></div>
                </button>
                <p className="text-muted text-xs font-medium uppercase tracking-wider">
                  Impact: <span className="text-success font-bold">+₹8.5 Cr Revenue Growth</span>
                </p>
              </div>
            </div>

            {/* Decorative Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
          </Card>
        </div>

        {/* Success Overlay Modal */}
        {showSuccess && (
          <div className="modal-overlay">
            <div className="success-modal scale-in">
              <div className="success-icon-box animate-bounce">
                <CheckCircle2 size={48} className="text-accent" />
              </div>
              <h2 className="text-4xl font-black text-primary mb-4">India Strategy Live</h2>
              <p className="text-muted text-lg mb-10">
                Dynamic pricing models for Diwali, Pongal, and Summer Peak are now live across all Indian distribution channels.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="metric-box">
                  <p className="text-xs text-muted uppercase font-bold mb-1">Projected Revenue</p>
                  <p className="text-3xl font-black text-success">₹12.4 Cr</p>
                  <p className="text-[10px] text-muted">Next 6 Months</p>
                </div>
                <div className="metric-box">
                  <p className="text-xs text-muted uppercase font-bold mb-1">Avg Rate Increase</p>
                  <p className="text-3xl font-black text-accent">+22.5%</p>
                  <p className="text-[10px] text-muted">Luxury Heritage</p>
                </div>
              </div>

              <Button 
                variant="accent" 
                className="w-full py-6 text-lg font-bold"
                onClick={() => setShowSuccess(false)}
              >
                RETURN TO DASHBOARD
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .pricing-engine-container {
          animation: pageEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }

        .chart-card { grid-column: span 7; }
        .briefing-card { grid-column: span 5; }
        .triggers-row { 
          grid-column: span 12; 
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .ai-icon-box-static {
          background: var(--gradient-accent);
          padding: 8px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trigger-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .hover-glow:hover {
          border-color: var(--action-accent);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .avatar-mini {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--surface-base);
          background: var(--surface-overlay);
          overflow: hidden;
        }

        .avatar-mini img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .commit-section {
          border-top: 4px solid var(--action-accent);
        }

        .commit-btn {
          position: relative;
          background: var(--gradient-accent);
          color: var(--surface-base);
          border: none;
          padding: 20px 40px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }

        .commit-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
        }

        .commit-btn.processing {
          background: var(--surface-overlay);
          color: var(--text-accent);
          cursor: wait;
        }

        .btn-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .commit-btn:hover .btn-glow {
          transform: translateX(100%);
        }

        .orb {
          position: absolute;
          width: 256px;
          height: 256px;
          background: var(--action-accent);
          opacity: 0.05;
          filter: blur(80px);
          border-radius: 50%;
          z-index: 0;
        }

        .orb-1 { bottom: -128px; right: -128px; }
        .orb-2 { top: -128px; left: -128px; animation-delay: 1s; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
        }

        .success-modal {
          background: var(--surface-base);
          border: 1px solid var(--border-default);
          width: 100%;
          max-width: 560px;
          padding: 48px;
          border-radius: 32px;
          text-align: center;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        .success-icon-box {
          width: 96px;
          height: 96px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
        }

        .metric-box {
          background: var(--surface-elevated);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--border-subtle);
        }

        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 1200px) {
          .chart-card, .briefing-card { grid-column: span 12; }
          .triggers-row { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .triggers-row { grid-template-columns: 1fr; }
          .timeline-row { flex-direction: column; }
          .timeline-item { border-r: none; border-bottom: 1px solid var(--border-default); }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default PricingEngine;
