import { Link2, ArrowRight } from 'lucide-react';

const Hero = () => {
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
        
        <div className="hero-input-group">
          <div className="input-with-icon">
            <Link2 className="input-icon" size={20} />
            <input type="text" placeholder="https://www.bbc.com/news/..." />
          </div>
          <button className="btn-join-discussion">
            Join discussion
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
