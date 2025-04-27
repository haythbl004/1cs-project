import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ScheduleView = ({
  selectedSchedule,
  setViewMode,
  setSessions,
  setUser,
  navigate,
}) => {
  const viewSessions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/schedule/${selectedSchedule.id}/sessions`, {
        withCredentials: true,
      });
      setSessions(response.data);
      setViewMode('sessions');
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert('Failed to fetch sessions');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Schedule Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Promotion</label>
          <p className="mt-1">{selectedSchedule.promotionName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <p className="mt-1">{selectedSchedule.semester || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Educational Year</label>
          <p className="mt-1">{selectedSchedule.educationalYear || 'N/A'}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => setViewMode('edit')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Edit Schedule
        </button>
        <button
          onClick={() => setViewMode('deleteSchedule')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete Schedule
        </button>
        <button
          onClick={() => setViewMode('addSession')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Session
        </button>
        <button
          onClick={viewSessions}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          View Sessions
        </button>
      </div>
    </div>
  );
};

export default ScheduleView;