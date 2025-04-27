import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    if (userData && typeof userData === 'object') {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.error('Invalid user data provided to login:', userData);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};