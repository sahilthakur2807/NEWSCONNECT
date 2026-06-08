import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, ArrowRight, Loader2 } from 'lucide-react';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to join or create the discussion room.');
      }

      const room = await response.json();
      navigate(`/room/${room.id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="badge-container">
          <div className="badge">
            <span className="badge-dot"></span>
            <span>Live discussions happening right now</span>
          </div>
        </div>
        
        <h1 className="hero-title">
          One conversation <br />
          <span className="text-primary">per news story.</span>
        </h1>
        
        <p className="hero-subtitle">
          Paste any article URL — from BBC, Reuters, NDTV, anywhere — <br />
          and join everyone else reading the same story.
        </p>
        
        <form onSubmit={handleJoin} className="hero-input-group">
          <div className="input-with-icon">
            <Link2 className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="https://www.bbc.com/news/..." 
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="btn-join-discussion" disabled={loading}>
            {loading ? (
              <>
                Joining...
                <Loader2 size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Join discussion
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {error && <p className="hero-error-message">{error}</p>}
      </div>
    </section>
  );
};

export default Hero;
