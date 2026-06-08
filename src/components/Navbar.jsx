import { Search, Puzzle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-left">
          <Link to="/" className="logo-link">
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
          </Link>
          
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search rooms, articles, or sources..." />
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/extension" className="nav-link">
            <Puzzle size={18} />
            <span>Extension</span>
          </Link>
          
          {user ? (
            <div className="user-menu">
              <div className="user-avatar" title={user.username}>
                {getInitials(user.username)}
              </div>
              <button className="btn-icon" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-text">Sign in</Link>
              <Link to="/signup" className="btn-primary">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
