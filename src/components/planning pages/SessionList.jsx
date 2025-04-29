import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faCheck,
  faPlus,
  faTrash,
  faTimes,
  faSave,
  faEye,
  faLock,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SessionList = ({ user, setUser, schedule, onViewPlanning, onViewPlanningDetails }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editForm, setEditForm] = useState({ startDate: '', endDate: '' });
  const [newSessionForm, setNewSessionForm] = useState({ startDate: '', endDate: '' });
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 4; // Same as patientsPerPage in Pending component

  useEffect(() => {
    console.log('SessionList: useEffect triggered', { user, schedule });
    if (!user || user.role !== 'admin') {
      setErrorMessage('Unauthorized access. Admin role required.');
      setIsLoading(false);
      console.log('SessionList: Unauthorized access', { user });
      return;
    }

    if (!schedule || !schedule.id) {
      setErrorMessage('No schedule provided.');
      setIsLoading(false);
      console.log('SessionList: Invalid schedule', { schedule });
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/schedule/${schedule.id}/sessions`,
          { withCredentials: true }
        );
        const data = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
        setSessions(data);
        setCurrentPage(1); // Reset to first page when sessions are fetched
        console.log('SessionList: Sessions fetched', data);
      } catch (err) {
        console.error('SessionList: Failed to fetch sessions:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          setErrorMessage('Authentication failed. Please log in again.');
        } else {
          setErrorMessage('Failed to fetch sessions');
        }
      } finally {
        setIsLoading(false);
        console.log('SessionList: Loading complete');
      }
    };

    fetchSessions();
  }, [user, setUser, schedule]);

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
  const totalPages = Math.max(1, Math.ceil(sessions.length / sessionsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const indexOfFirstSession = (safePage - 1) * sessionsPerPage;
  const indexOfLastSession = indexOfFirstSession + sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

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

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/schedule/sessions/${sessionId}`, {
        withCredentials: true,
      });
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      setSuccessMessage('Session deleted successfully!');
      // Adjust current page if necessary after deletion
      if (currentSessions.length === 1 && safePage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      console.log('SessionList: Session deleted', sessionId);
    } catch (err) {
      console.error('SessionList: Failed to delete session:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        setErrorMessage('Authentication failed. Please log in again.');
      } else {
        setErrorMessage(err.response?.data?.error || 'Failed to delete session');
      }
    }
  };

  const handleEditSession = (session) => {
    setEditingSessionId(session.id);
    setEditForm({
      startDate: session.startDate,
      endDate: session.finishDate || '',
    });
    console.log('SessionList: Editing session', session.id);
  };

  const handleUpdateSession = async (sessionId) => {
    if (!editForm.startDate || !editForm.endDate) {
      setErrorMessage('Please select both start and end dates');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(editForm.startDate) || !dateRegex.test(editForm.endDate)) {
      setErrorMessage('Invalid date format. Please select valid dates.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/schedule/sessions/${sessionId}?startDate=${editForm.startDate}&endDate=${editForm.endDate}`,
        {},
        { withCredentials: true }
      );
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, startDate: editForm.startDate, finishDate: editForm.endDate }
            : session
        )
      );
      setEditingSessionId(null);
      setEditForm({ startDate: '', endDate: '' });
      setSuccessMessage('Session updated successfully!');
      console.log('SessionList: Session updated', sessionId);
    } catch (err) {
      console.error('SessionList: Failed to update session:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        setErrorMessage('Authentication failed. Please log in again.');
      } else {
        setErrorMessage(err.response?.data?.error || 'Failed to update session');
      }
    }
  };

  const handleCloseSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to close this session?')) {
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/schedule/sessions/${sessionId}/closeSession`,
        {},
        { withCredentials: true }
      );
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, closed: true } : session
        )
      );
      setSuccessMessage('Session closed successfully!');
      console.log('SessionList: Session closed', sessionId);
    } catch (err) {
      console.error('SessionList: Failed to close session:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        setErrorMessage('Authentication failed. Please log in again.');
      } else {
        setErrorMessage(err.response?.data?.error || 'Failed to close session');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditForm({ startDate: '', endDate: '' });
    console.log('SessionList: Edit cancelled');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSessionInputChange = (e) => {
    const { name, value } = e.target;
    setNewSessionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!newSessionForm.startDate || !newSessionForm.endDate) {
      setErrorMessage('Please select both start and end dates');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newSessionForm.startDate) || !dateRegex.test(newSessionForm.endDate)) {
      setErrorMessage('Invalid date format. Please select valid dates.');
      return;
    }
    console.log('SessionList: Creating new session', newSessionForm);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/schedule/${schedule.id}/createSession?startDate=${newSessionForm.startDate}&endDate=${newSessionForm.endDate}`,
        {},
        { withCredentials: true }
      );

      const newSession = {
        id: response.data.id || Date.now().toString(),
        startDate: newSessionForm.startDate,
        finishDate: newSessionForm.endDate,
        closed: false,
        ...response.data,
      };

      setSessions((prev) => [...prev, newSession]);
      setNewSessionForm({ startDate: '', endDate: '' });
      setShowNewSessionForm(false);
      setSuccessMessage('Session created successfully!');
      console.log('SessionList: Session created', newSession.id);
    } catch (err) {
      console.error('SessionList: Failed to create session:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        setErrorMessage('Authentication failed. Please log in again.');
      } else {
        setErrorMessage(err.response?.data?.error || 'Failed to create session');
      }
    }
  };

  const handleRowClick = (session) => {
    if (editingSessionId !== session.id) {
      handleEditSession(session);
    }
  };

  const handleAddClick = (e, session) => {
    e.stopPropagation();
    console.log('SessionList: handleAddClick triggered for session', session.id);
    onViewPlanning(schedule, session);
  };

  const handleViewPlanningDetails = (e, session) => {
    e.stopPropagation();
    console.log('SessionList: handleViewPlanningDetails triggered for session', session.id);
    onViewPlanningDetails(schedule, session);
  };

  console.log('SessionList: Rendering with state', {
    isLoading,
    user: user ? { id: user.id, role: user.role } : null,
    scheduleId: schedule?.id,
    sessionsLength: sessions.length,
  });

  if (isLoading) {
    console.log('SessionList: Rendering loading state');
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin' || !schedule || !schedule.id) {
    console.log('SessionList: Rendering unauthorized/invalid state', { user, schedule });
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

  console.log('SessionList: Rendering session table');
  return (
    <div className="p-6">
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 border border-green-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCheck}
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

      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Session List for {schedule.promotion} - {schedule.semester} ({schedule.educationalYear})
          </h2>
          <button
            onClick={() => setShowNewSessionForm(!showNewSessionForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Session
          </button>
        </div>

        {showNewSessionForm && (
          <form onSubmit={handleCreateSession} className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Add New Session</h3>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mx-3 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={newSessionForm.startDate}
                    onChange={handleNewSessionInputChange}
                    className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mx-3 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={newSessionForm.endDate}
                    onChange={handleNewSessionInputChange}
                    className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Create Session
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Finish Date
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Closed
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSessions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No sessions found for this schedule.
                    </td>
                  </tr>
                ) : (
                  currentSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(session)}
                    >
                      {editingSessionId === session.id ? (
                        <>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="mx-3 text-gray-400"
                              />
                              <input
                                type="date"
                                name="startDate"
                                value={editForm.startDate}
                                onChange={handleInputChange}
                                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </td>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="mx-3 text-gray-400"
                              />
                              <input
                                type="date"
                                name="endDate"
                                value={editForm.endDate}
                                onChange={handleInputChange}
                                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </td>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                            {session.closed ? 'Yes' : 'No'}
                          </td>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-start items-center space-x-2">
                            <button
                              onClick={() => handleUpdateSession(session.id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Save Changes"
                              aria-label="Save Changes"
                            >
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Cancel"
                              aria-label="Cancel"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap">{session.startDate}</td>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                            {session.finishDate || 'N/A'}
                          </td>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                            {session.closed ? 'Yes' : 'No'}
                          </td>
                          <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-start items-center space-x-2">
                            {session.closed ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete Session"
                                  aria-label="Delete Session"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button
                                  onClick={(e) => handleViewPlanningDetails(e, session)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="View Planning"
                                  aria-label="View Planning"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete Session"
                                  aria-label="Delete Session"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button
                                  onClick={(e) => handleAddClick(e, session)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="View Planning"
                                  aria-label="View Planning"
                                >
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCloseSession(session.id);
                                  }}
                                  className="text-green-600 hover:text-green-800 p-1"
                                  title="Close Session"
                                  aria-label="Close Session"
                                >
                                  <FontAwesomeIcon icon={faLock} />
                                </button>
                              </>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sessions.length > sessionsPerPage && (
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
    </div>
  );
};

export default SessionList;