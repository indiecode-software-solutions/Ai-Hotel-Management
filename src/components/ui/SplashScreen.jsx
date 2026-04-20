import React, { useEffect, useState, useRef } from 'react';

const SplashScreen = ({ onStartSplit, onComplete, currentState }) => {
  const [isSplitting, setIsSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageUrl = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // Store callbacks in refs so the effect doesn't re-run when they change
  const onStartSplitRef = useRef(onStartSplit);
  const onCompleteRef = useRef(onComplete);
  onStartSplitRef.current = onStartSplit;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Progress Bar Animation (0 to 100 in ~3 seconds)
    const totalDuration = 3000;
    const intervalTime = 30;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(nextProgress);
      if (currentStep >= steps) clearInterval(progressInterval);
    }, intervalTime);

    // Door Open Timers
    const splitTimer = setTimeout(() => {
      setIsSplitting(true);
      if (onStartSplitRef.current) onStartSplitRef.current();
    }, 3500);

    const completeTimer = setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current();
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(splitTimer);
      clearTimeout(completeTimer);
    };
  }, []); // Empty deps — runs once, never resets

  return (
    <div className="splash-doors-container">
      {/* Background/Doors Container */}
      <div className="absolute inset-0 flex">
        {/* Left Door */}
        <div className={`splash-door left ${isSplitting ? 'open' : ''}`}>
          <img src={imageUrl} alt="" className="splash-door-img" />
          <div className="splash-door-overlay"></div>
        </div>

        {/* Right Door */}
        <div className={`splash-door right ${isSplitting ? 'open' : ''}`}>
          <img src={imageUrl} alt="" className="splash-door-img" />
          <div className="splash-door-overlay"></div>
        </div>
      </div>

      {/* Centered Logo */}
      <div className={`splash-logo-container ${isSplitting ? 'hidden' : ''}`}>
        <h1 className="splash-logo-text">
          Hotel Cavelle
        </h1>

        <p className="splash-tagline">
          Redefining Hospitality
        </p>
      </div>

      {/* Loader */}
      <div className={`splash-loader-container ${isSplitting ? 'hidden' : ''}`}>
        <div className="splash-loader-text">LOADING <span style={{ width: '3ch', display: 'inline-block', textAlign: 'right' }}>{progress}%</span></div>
        <div className="splash-loader-track">
          <div className="splash-loader-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
