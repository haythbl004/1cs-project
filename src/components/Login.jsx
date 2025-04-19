import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faLock, 
  faTimesCircle, 
  faSpinner,
  faUniversity,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );


      const role = response.data?.user?.role;
      const user = response.data?.user;
      setUser(user);  // Update authentication state

      if (!role || role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }


      setSuccessMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard'); // Corrected from '/dashboard'
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Login failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
          <FontAwesomeIcon 
            icon={faUniversity} 
            className="text-3xl text-indigo-600" 
          />
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
          University System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Restricted access to authorized personnel only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 border-l-4 border-indigo-600">
          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 border border-green-100 mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" 
                />
                <p className="text-sm font-medium text-green-700">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-100 mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={faTimesCircle} 
                  className="flex-shrink-0 h-5 w-5 text-red-500 mr-2" 
                />
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faUserShield} 
                    className="h-5 w-5 text-gray-400" 
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
                  placeholder="admin@university.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="h-5 w-5 text-gray-400" 
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-device"
                  name="remember-device"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-device" className="ml-2 block text-xs text-gray-700">
                  Remember this device
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full hover:cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon 
                      icon={faSpinner} 
                      className="animate-spin mr-2 h-4 w-4" 
                    />
                    Authenticating...
                  </>
                ) : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;