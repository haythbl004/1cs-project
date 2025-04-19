
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useState , useEffect} from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

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
