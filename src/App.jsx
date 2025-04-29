import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          withCredentials: true,
        });
        const userData = response.data?.user;
        if (userData && userData.role === 'admin') {
          setUser(userData); // Restore user state
        }
      } catch (err) {
        console.log('No active session found:', err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Log user state changes
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            user && user.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Protected route */}
        <Route
          path="/admin/dashboard"
          element={
            user && user.role === 'admin' ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate
              to={user && user.role === 'admin' ? '/admin/dashboard' : '/login'}
              replace
            />
          }
        />

        {/* 404 page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;