import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/guest.css'; // Will use existing glassmorphism styles or add new ones

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signInWithEmail(email, password);
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await signUpWithEmail(email, password, {
          data: { role: 'guest' } // Default role for new signups
        });
        if (signUpError) throw signUpError;
        // In Supabase, usually signup requires email confirmation unless disabled.
        // For now, we'll assume it works and they can login or are logged in.
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Note: Google sign in redirects, so it will leave the page.
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal glass-panel fade-in-up">
        <button className="auth-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>{isLogin ? 'Sign in to access your curated sanctuaries.' : 'Join Raj Heritage for exclusive experiences.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <Mail size={18} className="auth-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <Lock size={18} className="auth-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            {!loading && <LogIn size={18} style={{marginLeft: '8px'}}/>}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button 
          className="auth-google-btn" 
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <Globe size={18} />
          Google
        </button>

        <div className="auth-footer">
          {isLogin ? (
            <p>New to Raj Heritage? <button onClick={() => setIsLogin(false)}>Sign Up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
