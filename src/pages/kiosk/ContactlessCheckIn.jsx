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
      // Fetch bookings that are confirmed but not yet checked in
      const { data, error } = await supabase
        .from('bookings')
        .select('*, users!guest_id(full_name, email), rooms(*)')
        .eq('status', 'confirmed');
      
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
    }
  };

  const handleCheckIn = async () => {
    if (!match) return;
    setIsCheckingIn(true);
    try {
      await bookingService.updateBookingStatus(match.id, 'checked_in');
      setTimeout(() => {
        setMatch({ ...match, status: 'checked_in' });
        setIsCheckingIn(false);
      }, 1500);
    } catch (err) {
      console.error("Check-in failed:", err);
      setError("System failed to update your status. Please see staff.");
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
            <div className="welcome-view">
              <h1>Welcome Home.</h1>
              <p>Step closer for instant, contactless check-in.</p>
              <button className="btn-start-scan" onClick={startVideo}>
                <Camera size={24} />
                <span>Start Identity Verification</span>
              </button>
            </div>
          ) : match ? (
            <div className="match-view">
              {match.status === 'checked_in' ? (
                <div className="success-state">
                  <div className="success-icon">
                    <UserCheck size={60} />
                  </div>
                  <h2>Check-in Complete!</h2>
                  <p>Namaste, <strong>{match.users?.full_name}</strong>. Your sanctuary is ready.</p>
                  <div className="room-info-card">
                    <span className="label">Your Room</span>
                    <span className="value">{match.rooms?.title}</span>
                  </div>
                  <button className="btn-reset" onClick={() => { setMatch(null); setIsScanning(false); fetchActiveBookings(); }}>
                    New Guest
                  </button>
                </div>
              ) : (
                <div className="confirm-state">
                  <div className="verification-ring">
                    <UserCheck className="text-accent" size={40} />
                  </div>
                  <h2 className="identity-title">Identity Verified</h2>
                  <div className="guest-profile">
                    <h3 className="guest-name">{match.users?.full_name}</h3>
                    <p className="guest-email">{match.users?.email}</p>
                  </div>
                  
                  <div className="booking-details-grid">
                    <div className="detail-card">
                      <span className="detail-label">Assigned Sanctuary</span>
                      <span className="detail-value">{match.rooms?.title}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Departure Date</span>
                      <span className="detail-value">{match.check_out_date}</span>
                    </div>
                  </div>

                  <button className="btn-checkin" onClick={handleCheckIn} disabled={isCheckingIn}>
                    {isCheckingIn ? (
                      <><Loader2 className="animate-spin" size={20} /> Authorizing Neural Link...</>
                    ) : (
                      <><LogIn size={20} /> Confirm & Enter Sanctuary</>
                    )}
                  </button>
                  <button className="btn-cancel" onClick={() => { setMatch(null); startVideo(); }}>
                    Incorrect Profile? Re-scan
                  </button>
                </div>
              )}
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
