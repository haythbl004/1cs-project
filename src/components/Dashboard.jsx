import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher,
  faMoneyBillWave,
  faCalendarAlt,
  faUser,
  faCog,
  faSignOutAlt,
  faBars,
  faUniversity,
  faTimes,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import TeacherManagement from './TeacherManagement';
import Settings from './Settings';
import ScheduleManagement from './ScheduleManagement';
import Profile from './Profile';
import Home from './Home';

const Dashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // useEffect is now unconditional
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check authentication after hooks
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  <FontAwesomeIcon icon={faUniversity} className="mr-2 text-blue-600" />
                  University Dashboard
                </h1>
              </div>
            </div>
            <div className="flex">
              {/* Center - Navigation Links */}
              <div className="hidden md:flex md:items-center md:space-x-4 md:ml-6">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'home'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-selected={activeTab === 'home'}
                  role="tab"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('planning')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'planning'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-selected={activeTab === 'planning'}
                  role="tab"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Planning
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'teachers'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-selected={activeTab === 'teachers'}
                  role="tab"
                >
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                  Teachers
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'payment'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-selected={activeTab === 'payment'}
                  role="tab"
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                  Payment
                </button>
              </div>
              {/* Right side - User menu and mobile button */}
              <div className="flex items-center">
                {/* User dropdown */}
                <div className="ml-3 relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center hover:cursor-pointer text-blue-600">
                      <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                    </div>
                  </button>
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <a
                        onClick={() => {
                          setActiveTab('myProfile');
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        My Profile
                      </a>
                      <a
                        onClick={() => {
                          setActiveTab('settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faCog} className="mr-2" />
                        Settings
                      </a>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                {/* Mobile menu button */}
                <div className="-mr-2 flex items-center md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-controls="mobile-menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <span className="sr-only">Open main menu</span>
                    <FontAwesomeIcon
                      icon={isMobileMenuOpen ? faTimes : faBars}
                      className="h-6 w-6"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
            <button
                onClick={() => {
                  setActiveTab('planning');
                  setIsMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  activeTab === 'home'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                aria-selected={activeTab === 'home'}
                role="tab"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('planning');
                  setIsMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  activeTab === 'planning'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                aria-selected={activeTab === 'planning'}
                role="tab"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Planning
              </button>
              <button
                onClick={() => {
                  setActiveTab('teachers');
                  setIsMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  activeTab === 'teachers'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                aria-selected={activeTab === 'teachers'}
                role="tab"
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                Teachers
              </button>
              <button
                onClick={() => {
                  setActiveTab('payment');
                  setIsMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  activeTab === 'payment'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                aria-selected={activeTab === 'payment'}
                role="tab"
              >
                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                Payment
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'planning' && (
            <ScheduleManagement user={user} setUser={setUser} />
          )}

          {activeTab === 'teachers' && (
            <TeacherManagement user={user} setUser={setUser} />
          )}

          {activeTab === 'home' && <Home setActiveTab={setActiveTab}/>}

          {activeTab === 'settings' && <Settings />}

          {activeTab === 'myProfile' && (
            <Profile user={user} />
          )}

          {activeTab === 'payment' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500" />
                Payment Processing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Salary Payments</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Pending Payments</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Processed This Month</span>
                      <span className="font-medium">24</span>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                      Process Payments
                    </button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Payment History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>October 2023</span>
                      <span className="font-medium">$245,678</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>September 2023</span>
                      <span className="font-medium">$238,910</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;