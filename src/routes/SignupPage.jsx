import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const res = await signup(username, email, password);
      if (res.success) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join the conversation today."
      quote="One conversation per news story."
      quoteAuthor="Paste any article URL and join everyone else reading the same story."
    >
      {error && <div className="auth-message error">{error}</div>}
      {success && <div className="auth-message success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
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
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Join now'}
        </button>
      </form>
      
      <div className="auth-footer-links">
        <p>Already have an account? <Link to="/login" className="text-primary">Sign in</Link></p>
        <Link to="/" className="back-home">
          <ArrowLeft size={16} />
          Back home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
