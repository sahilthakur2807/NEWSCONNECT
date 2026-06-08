import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Brief artificial delay for 1ms+ as requested for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500)); 

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) onClose();
        else setError(res.error);
      } else {
        const res = await signup(username, email, password);
        if (res.success) {
          setMode('login');
          setError('Signup successful! Please login.');
        } else {
          setError(res.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} disabled={loading}><X size={20} /></button>
        <h2 className="modal-title">{mode === 'login' ? 'Sign in' : 'Join NewsConnect'}</h2>
        
        {error && <div className={`auth-message ${error.includes('successful') ? 'success' : 'error'}`}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-action">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
              />
              <button 
                type="button" 
                className="input-action-btn" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Sign in' : 'Join now')}
          </button>
        </form>
        
        <div className="modal-footer">
          {mode === 'login' ? (
            <p>New here? <button onClick={() => setMode('signup')} disabled={loading}>Join now</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setMode('login')} disabled={loading}>Sign in</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
