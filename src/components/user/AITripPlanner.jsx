import React from 'react';
import { Sparkles, Cloud } from 'lucide-react';
import '../../styles/guest.css';
import plannerHero from '../../assets/Drone View.jpg';

const AITripPlanner = () => {
  return (
    <section id="destinations" className="section-container planner-section">
      <div className="planner-split-layout reveal-on-scroll">
        <div className="planner-left-col">
          <div className="planner-header-sticky">
            <div className="planner-visual">
              <img src={plannerHero} alt="Cinematic Escape" />
              <div className="visual-overlay"></div>
              
              <div className="planner-visual-content">
                <div className="planner-badge">
                  <Sparkles size={16} />
                  <span>External AI Planner</span>
                </div>
                <h2 className="section-heading">Design your perfect escape.</h2>
                <p className="section-description">We've integrated our exclusive community-driven AI planner to help you curate the ultimate South Indian heritage journey.</p>
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
          <div className="external-planner-embed-container">
            <iframe 
              src="https://travel-planner-ai-mu.vercel.app/" 
              title="Raj Heritage AI Trip Planner"
              className="external-planner-iframe"
              allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .external-planner-embed-container {
          width: 100%;
          height: 800px;
          background: var(--surface-elevated);
          border-radius: 0;
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .external-planner-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: white;
        }

        @media (max-width: 1024px) {
          .external-planner-embed-container {
            height: 600px;
          }
        }
      `}</style>
    </section>
  );
};

export default AITripPlanner;
