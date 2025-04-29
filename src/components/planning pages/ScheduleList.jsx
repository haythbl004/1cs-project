import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ScheduleList = ({ user, setUser, onEditSchedule, onViewSessions }) => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5; // Same as patientsPerPage in Pending component

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setErrorMessage('Unauthorized access. Admin role required.');
      setIsLoading(false);
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/schedule', {
          withCredentials: true,
        });
        const transformedSchedules = response.data.schedules.map((item) => ({
          id: item.Schedule.id,
          semester: item.Schedule.semester,
          promotion: item.Promotion.name,
          promotionId: item.Schedule.promotionId,
          educationalYear: item.Schedule.educationalYear,
        }));
        setSchedules(transformedSchedules);
        setCurrentPage(1); // Reset to first page when schedules are fetched
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          setErrorMessage('Authentication failed. Please log in again.');
        } else {
          setErrorMessage('Failed to fetch schedules');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [user, setUser]);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(schedules.length / schedulesPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const indexOfFirstSchedule = (safePage - 1) * schedulesPerPage;
  const indexOfLastSchedule = indexOfFirstSchedule + schedulesPerPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const handleNext = () => {
    if (safePage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (safePage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/schedule/${scheduleId}`, {
        withCredentials: true,
      });
      setSchedules((prev) => prev.filter((schedule) => schedule.id !== scheduleId));
      setSuccessMessage('Schedule deleted successfully!');
      // Adjust current page if necessary after deletion
      if (currentSchedules.length === 1 && safePage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        setErrorMessage('Authentication failed. Please log in again.');
      } else {
        setErrorMessage(err.response?.data?.error || 'Failed to delete schedule');
      }
    }
  };

  const handleRowClick = (schedule, event) => {
    if (event.target.closest('button')) {
      return;
    }
    onViewSessions(schedule);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-3 border border-red-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="flex-shrink-0 h-5 w-5 text-red-500 mr-2"
            />
            <p className="text-sm font-medium text-gray-700">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 border border-green-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="flex-shrink-0 h-5 w-5 text-green-500 mr-2"
            />
            <p className="text-sm font-medium text-gray-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-3 border border-red-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="flex-shrink-0 h-5 w-5 text-red-500 mr-2"
            />
            <p className="text-sm font-medium text-gray-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Educational Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSchedules.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No schedules found.
                  </td>
                </tr>
              ) : (
                currentSchedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={(event) => handleRowClick(schedule, event)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{schedule.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{schedule.promotion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{schedule.educationalYear}</td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-start items-center space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEditSchedule(schedule)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Schedule"
                      >
                        <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Schedule"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {schedules.length > schedulesPerPage && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-end border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={handlePrevious}
                disabled={safePage === 1}
                className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                  safePage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={safePage === totalPages}
                className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                  safePage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleList;