import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const res = await login(email, password);
      if (res.success) navigate('/');
      else setError(res.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to join discussions."
      quote="The story you're reading right now — someone else is too."
      quoteAuthor="Join the live discussion on any article from across the web."
    >
      {error && <div className="auth-message error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
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
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
        </button>
      </form>
      
      <div className="auth-footer-links">
        <p>New here? <Link to="/signup" className="text-primary">Create one</Link></p>
        <Link to="/" className="back-home">
          <ArrowLeft size={16} />
          Back home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
