import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const TeacherAbsen = ({ teacher, setSuccessMessage, setUser }) => {
  const [absences, setAbsences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const [editingAbsenceId, setEditingAbsenceId] = useState(null);
  const [editedAbsenceDate, setEditedAbsenceDate] = useState('');

  useEffect(() => {
    const fetchAbsences = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/absence`, {
          withCredentials: true,
        });
        setAbsences(response.data);
      } catch (err) {
        console.error('Failed to fetch absences:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
        } else {
          alert('Failed to fetch absences');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbsences();
  }, [teacher, setUser]);

  const handleEdit = (absence) => {
    setEditingAbsenceId(absence.id);
    setEditedAbsenceDate(absence.absenceDate);
  };

  const handleSaveEdit = async (absenceId) => {
    if (!editedAbsenceDate) {
      alert('Please provide an absence date.');
      return;
    }

    try {
      const updatedAbsence = {
        absenceDate: editedAbsenceDate,
      };

      await axios.put(`http://localhost:3000/api/absence/${absenceId}`, updatedAbsence, {
        withCredentials: true,
      });

      setAbsences(
        absences.map((absence) =>
          absence.id === absenceId
            ? { ...absence, absenceDate: editedAbsenceDate }
            : absence
        )
      );
      setSuccessMessage('Absence date updated successfully!');
      setEditingAbsenceId(null);
      setEditedAbsenceDate('');
    } catch (err) {
      console.error('Failed to update absence:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
      } else {
        alert('Failed to update absence: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAbsenceId(null);
    setEditedAbsenceDate('');
  };

  const confirmDelete = (id) => {
    setAbsenceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/absence/${absenceToDelete}`, {
        withCredentials: true,
      });
      setAbsences(absences.filter((absence) => absence.id !== absenceToDelete));
      setSuccessMessage('Absence deleted successfully!');
      setShowDeleteConfirm(false);
      setAbsenceToDelete(null);
    } catch (err) {
      console.error('Failed to delete absence:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
      } else {
        alert('Failed to delete absence');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">
        Absence Records for {teacher.firstName} {teacher.lastName}
      </h2>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session Name
              </th>
              <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Absence Date
              </th>
              <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {absences.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No absences found.
                </td>
              </tr>
            ) : (
              absences.map((absence) => (
                <tr key={absence.id} >
                  <td className="w-1/3 px-6 py-4 whitespace-nowrap">{absence.sessionName}</td>
                  <td className="w-1/3 px-6 py-4 whitespace-nowrap">
                    {editingAbsenceId === absence.id ? (
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editedAbsenceDate}
                        onChange={(e) => setEditedAbsenceDate(e.target.value)}
                        required
                      />
                    ) : (
                      new Date(absence.absenceDate).toLocaleDateString()
                    )}
                  </td>
                  <td className={`w-1/3 px-6 py-4 text-sm font-medium flex items-center space-x-3 justify-start `}>
                    {editingAbsenceId === absence.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(absence.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(absence)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(absence.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this absence? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAbsen;