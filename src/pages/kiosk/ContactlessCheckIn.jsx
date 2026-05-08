import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, ShieldCheck, UserCheck, Loader2, AlertCircle, RefreshCw, LogIn } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { supabase } from '../../services/supabaseClient';
import './kiosk.css';

const ContactlessCheckIn = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const videoRef = useRef();
  const canvasRef = useRef();
  const scanTimerRef = useRef();

  useEffect(() => {
    loadModels();
    fetchActiveBookings();
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
    } catch (err) {
      console.error("Error loading face models:", err);
      setError("Failed to load biometric sensors. Please contact reception.");
    }
  };

  const fetchActiveBookings = async () => {
    try {
      // Fetch bookings that are confirmed OR checked_in
      const { data, error } = await supabase
        .from('bookings')
        .select('*, users!guest_id(full_name, email), rooms(*)')
        .in('status', ['confirmed', 'checked_in']);
      
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const startVideo = () => {
    setIsScanning(true);
    setMatch(null);
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error(err);
        setError("Camera access denied. Please allow camera access to continue.");
      });
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
    clearInterval(scanTimerRef.current);
  };

  const handlePlay = () => {
    scanTimerRef.current = setInterval(async () => {
      if (!videoRef.current || !modelsLoaded || match) return;

      const detections = await faceapi.detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const descriptor = detections[0].descriptor;
        findMatch(descriptor);
      }
    }, 1000);
  };

  const findMatch = (descriptor) => {
    // Find booking where face_descriptor is close to current descriptor
    let bestMatch = null;
    let minDistance = 0.6; // face-api threshold for "same person" is typically 0.6

    bookings.forEach(booking => {
      if (booking.face_descriptor) {
        // Descriptor is stored as JSON array, convert back to Float32Array
        const savedDescriptor = new Float32Array(booking.face_descriptor);
        const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);
        
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = booking;
        }
      }
    });

    if (bestMatch) {
      setMatch(bestMatch);
      stopVideo();
      // Automatically trigger the status transition
      handleStatusTransition(bestMatch);
    }
  };

  const handleStatusTransition = async (booking) => {
    setIsCheckingIn(true);
    const newStatus = booking.status === 'checked_in' ? 'checked_out' : 'checked_in';
    
    try {
      await bookingService.updateBookingStatus(booking.id, newStatus);
      // Wait for animation feel
      setTimeout(() => {
        setMatch({ ...booking, status: newStatus });
        setIsCheckingIn(false);
      }, 2000);
    } catch (err) {
      console.error("Transition failed:", err);
      setError("System failure during status update. Please see staff.");
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-glass">
        <div className="kiosk-header">
          <div className="hotel-logo">
            <ShieldCheck className="text-accent" size={32} />
            <span>RAJ HERITAGE KIOSK</span>
          </div>
          <div className="status-badge">
            <div className={`status-dot ${modelsLoaded ? 'online' : 'offline'}`} />
            {modelsLoaded ? 'Biometric System Online' : 'Initializing Sensors...'}
          </div>
        </div>

        <div className="kiosk-content">
          {!isScanning && !match ? (
            <div className="welcome-view cinematic">
              <div className="ai-core">
                <div className="core-inner" />
                <div className="core-ring" />
                <div className="core-particles" />
              </div>
              <h1 className="welcome-title">Welcome Home.</h1>
              <p className="welcome-subtitle">Step into the light for instant biometric verification.</p>
              <button className="btn-start-scan premium" onClick={startVideo}>
                <div className="btn-glow" />
                <Camera size={20} />
                <span>Begin Identity Scan</span>
              </button>
            </div>
          ) : match ? (
            <div className="match-view">
              {match.status === 'checked_in' || match.status === 'checked_out' ? (
                <div className={`success-view-cinematic ${match.status}`}>
                  <div className="success-header">
                    <div className="success-icon-wrap">
                      {match.status === 'checked_in' ? <UserCheck size={48} /> : <LogIn size={48} style={{ transform: 'rotate(180deg)' }} />}
                    </div>
                    <h2 className="success-title">{match.status === 'checked_in' ? 'Sanctuary Authorized' : 'Journey Concluded'}</h2>
                    <p className="success-subtitle">
                      Namaste, <strong>{match.users?.full_name}</strong>. 
                      You have been successfully {match.status.replace('_', ' ')}.
                    </p>
                  </div>

                  <div className="booking-details-grid">
                    <div className="detail-card glass">
                      <span className="detail-label">{match.status === 'checked_in' ? 'Assigned Sanctuary' : 'Previous Sanctuary'}</span>
                      <span className="detail-value">{match.rooms?.title}</span>
                    </div>
                    <div className="detail-card glass">
                      <span className="detail-label">Status</span>
                      <span className="detail-value text-accent">{match.status === 'checked_in' ? 'ACCESS GRANTED' : 'CLEARED'}</span>
                    </div>
                  </div>

                  <button className="btn-reset-minimal" onClick={() => { setMatch(null); setIsScanning(false); fetchActiveBookings(); }}>
                    Return to Welcome Screen
                  </button>
                </div>
              ) : isCheckingIn ? (
                <div className="processing-state">
                  <div className="scanning-ring" />
                  <h2>Authenticating...</h2>
                  <p>Matching biometric signature for {match.users?.full_name}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="scanning-view">
              <div className="video-container">
                <video ref={videoRef} autoPlay muted onPlay={handlePlay} />
                <div className="face-scanner-overlay">
                  <div className="scan-line" />
                  <div className="scanner-corners" />
                </div>
              </div>
              <div className="scanning-info">
                <Loader2 className="animate-spin" size={24} />
                <span>Scanning for authorized guests...</span>
              </div>
              <button className="btn-stop" onClick={stopVideo}>Cancel</button>
            </div>
          )}

          {error && (
            <div className="error-overlay">
              <AlertCircle size={40} />
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}
        </div>

        <div className="kiosk-footer">
          <p>© 2026 Raj Heritage Hospitality • Neural Link Enabled</p>
          <div className="secure-badges">
            <RefreshCw size={14} />
            <span>Auto-refreshing bookings...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactlessCheckIn;
