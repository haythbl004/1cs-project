import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ViewHoliday = ({onBack}) => {
  const [holidays, setHolidays] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch holidays on component mount
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Clear error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/holiday', {
        withCredentials: true,
      });
      setHolidays(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch holidays');
      console.error('Error fetching holidays:', error);
    }
  };

  const handleBack = () => {
    onBack("home");

  };

  return (
    <div className="space-y-6 relativen p-7">
      {errorMessage && (
        <div className="rounded-md p-3 border mb-6 bg-red-50 border-red-100">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 inline-flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-blue-600" />
          Holidays
        </h2>
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {holidays.length > 0 ? (
                holidays.map((holiday) => (
                  <tr key={holiday.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {holiday.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {holiday.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {holiday.endDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No holidays found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewHoliday;