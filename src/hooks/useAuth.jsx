import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  };

  const signup = async (username, email, password) => {
    const response = await fetch('http://localhost:5001/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });

    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  };

  const logout = async () => {
    await fetch('http://localhost:5001/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
