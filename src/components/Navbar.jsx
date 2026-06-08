import { Search, Puzzle, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-left">
          <div className="logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
              </svg>
            </div>
            <div className="logo-text">
              <span className="brand-name">NewsConnect</span>
              <span className="brand-tagline">DISCUSS THE NEWS</span>
            </div>
          </div>
          
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search rooms, articles, or sources..." />
          </div>
        </div>

        <div className="navbar-right">
          <a href="#" className="nav-link">
            <Puzzle size={18} />
            <span>Extension</span>
          </a>
          <button className="btn-text">Sign in</button>
          <button className="btn-primary">Join</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
