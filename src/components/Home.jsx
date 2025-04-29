import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher,
  faBook,
  faCalendarAlt,
  faChartLine,
  faHome,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import HolidaySettings from './HolidaySettings';
import PromotionSettings from './PromotionSettings';
import CoefficientSettings from './CoefficientSettings';
import SpecialitySettings from './SpecialitySettings';

const Home = ({ setActiveTab }) => {
  // State for API data
  const [teachersCount, setTeachersCount] = useState(0);
  const [specialitiesCount, setSpecialitiesCount] = useState(0);
  const [promotionsCount, setPromotionsCount] = useState(0);
  const [schedulesCount, setSchedulesCount] = useState(0);
  const [holidays, setHolidays] = useState([]);
  // State to track active settings view
  const [activeSettings, setActiveSettings] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResponse = await axios.get('http://localhost:3000/api/teacher/get', {
          withCredentials: true,
        });
        setTeachersCount(teachersResponse.data.length || 0);

        const specialitiesResponse = await axios.get('http://localhost:3000/api/speciality', {
          withCredentials: true,
        });
        setSpecialitiesCount(specialitiesResponse.data.length || 0);

        const promotionsResponse = await axios.get('http://localhost:3000/api/promotion', {
          withCredentials: true,
        });
        setPromotionsCount(promotionsResponse.data.length || 0);

        const schedulesResponse = await axios.get('http://localhost:3000/api/schedule', {
          withCredentials: true,
        });
        setSchedulesCount(schedulesResponse.data.schedules.length || 0);

        const holidaysResponse = await axios.get('http://localhost:3000/api/holiday', {
          withCredentials: true,
        });
        setHolidays(holidaysResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to render the main dashboard content
  const renderMainContent = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Administrator!</h2>
        <p className="opacity-90">Your comprehensive dashboard for managing academic operations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
              <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Teachers</p>
              <p className="text-2xl font-bold">{teachersCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 text-white mr-4">
              <FontAwesomeIcon icon={faBook} size="lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Specialities</p>
              <p className="text-2xl font-bold">{specialitiesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
              <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Schedule</p>
              <p className="text-2xl font-bold">{schedulesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500 text-white mr-4">
              <FontAwesomeIcon icon={faGraduationCap} size="lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Promotions</p>
              <p className="text-2xl font-bold">{promotionsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faHome} className="mr-2 text-blue-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                onClick={() => setActiveTab('teachers')}
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600 mb-2" size="lg" />
                <span>Manage Teachers</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
                onClick={() => setActiveSettings('holidays')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 mb-2" size="lg" />
                <span>Holidays</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors"
                onClick={() => setActiveSettings('promotions')}
              >
                <FontAwesomeIcon icon={faGraduationCap} className="text-purple-600 mb-2" size="lg" />
                <span>Promotions</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
                onClick={() => setActiveSettings('coefficients')}
              >
                <FontAwesomeIcon icon={faChartLine} className="text-yellow-600 mb-2" size="lg" />
                <span>Coefficients</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                onClick={() => setActiveTab('planning')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="text-red-600 mb-2" size="lg" />
                <span>Schedule Management</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                onClick={() => setActiveSettings('specialities')}
              >
                <FontAwesomeIcon icon={faBook} className="text-indigo-600 mb-2" size="lg" />
                <span>Speciality</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 h-72 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600" />
                Upcoming Holidays
              </h3>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline underline-offset-2"
              >
                View All →
              </a>
            </div>

            <div className="space-y-3 flex-grow">
              {holidays.map((holiday, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-800">{holiday.name}</h4>
                  <div className="flex flex-wrap gap-x-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Start:</span>{' '}
                      {new Date(holiday.startDate).toISOString().split('T')[0]}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">End:</span>{' '}
                      {new Date(holiday.endDate).toISOString().split('T')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  // Function to render the active settings component
  const renderSettingsContent = () => {
    switch (activeSettings) {
      case 'holidays':
        return <HolidaySettings onBack={() => setActiveSettings(null)} />;
      case 'promotions':
        return <PromotionSettings onBack={() => setActiveSettings(null)} />;
      case 'coefficients':
        return <CoefficientSettings onBack={() => setActiveSettings(null)} />;
      case 'specialities':
        return <SpecialitySettings onBack={() => setActiveSettings(null)} />;
      default:
        return renderMainContent();
    }
  };

  return <div className="bg-gray-100">{renderSettingsContent()}</div>;
};

export default Home;