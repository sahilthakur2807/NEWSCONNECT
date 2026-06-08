import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, quote, quoteAuthor }) => {
  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
              </svg>
            </div>
            <span className="brand-name">NewsConnect</span>
          </Link>
          
          <div className="auth-quote-container">
            <h1 className="auth-quote">"{quote}"</h1>
            <p className="auth-quote-subtitle">{quoteAuthor}</p>
          </div>
          
          <div className="auth-footer">
            © NewsConnect
          </div>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-page-title">{title}</h2>
          <p className="auth-page-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
