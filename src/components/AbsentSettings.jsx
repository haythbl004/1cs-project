import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faChevronRight,
  faCheckCircle,
  faCalendarXmark,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AbsentSettings = () => {
  const [absences, setAbsences] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', date: '' });
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch absences on component mount
  useEffect(() => {
    fetchAbsences();
  }, []);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchAbsences = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/absence', {
        withCredentials: true,
      });
      setAbsences(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch absences');
      console.error('Error fetching absences:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.date) {
      setErrorMessage('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/absence',
        {
          name: formData.name,
          date: formData.date,
        },
        { withCredentials: true }
      );
      setAbsences([...absences, response.data]);
      setFormData({ name: '', date: '' });
      setIsAdding(false);
      setSuccessMessage('Absence added successfully!');
    } catch (error) {
      setErrorMessage('Failed to add absence');
      console.error('Error adding absence:', error);
    }
  };

  const startEditing = (absence) => {
    setEditingId(absence.id);
    setFormData({
      name: absence.name,
      date: absence.date,
    });
  };

  const saveEdit = async () => {
    if (!formData.date) {
      setErrorMessage('Please fill the date field');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/absence/${editingId}`,
        {
          date: formData.date,
        },
        { withCredentials: true }
      );
      await fetchAbsences();
      setEditingId(null);
      setFormData({ name: '', date: '' });
      setSuccessMessage('Absence updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update absence');
      console.error('Error updating absence:', error);
    }
  };

  const resetView = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', date: '' });
  };

  const confirmDelete = (absence, e) => {
    e.stopPropagation();
    setAbsenceToDelete(absence);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/absence/${absenceToDelete.id}`, {
        withCredentials: true,
      });
      setAbsences(absences.filter((absence) => absence.id !== absenceToDelete.id));
      setAbsenceToDelete(null);
      setSuccessMessage('Absence deleted successfully!');
    } catch (error) {
      setErrorMessage('Failed to delete absence');
      console.error('Error deleting absence:', error);
    }
  };

  const cancelDelete = () => {
    setAbsenceToDelete(null);
  };

  return (
    <div className="space-y-6 relative">
      {(successMessage || errorMessage) && (
        <div
          className={`rounded-md p-3 border mb-6 ${
            successMessage ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
          }`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`h-5 w-5 mr-2 ${successMessage ? 'text-green-500' : 'text-red-500'}`}
            />
            <p className="text-sm font-medium text-gray-700">{successMessage || errorMessage}</p>
          </div>
        </div>
      )}

      {absenceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the absence <strong>{absenceToDelete.name}</strong> on{' '}
              <strong>{absenceToDelete.date}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 inline-flex items-center">
          <FontAwesomeIcon icon={faCalendarXmark} className="mr-3 text-blue-600" />
          <button
            onClick={resetView}
            className={`hover:text-blue-600 ${
              isAdding || editingId !== null ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            Absences
          </button>
          {(isAdding || editingId !== null) && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-gray-500 text-sm" />
              <span className="text-gray-600 font-medium">{editingId !== null ? 'Edit' : 'Add'}</span>
            </>
          )}
        </h2>
      </div>

      {(isAdding || editingId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">
            {editingId !== null ? 'Edit Absence' : 'Add New Absence'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {isAdding && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Absence Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter absence name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetView}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={editingId !== null ? saveEdit : handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {editingId !== null ? 'Save Changes' : 'Add Absence'}
            </button>
          </div>
        </div>
      )}

      {!isAdding && editingId === null && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {absences.length > 0 ? (
                  absences.map((absence) => (
                    <tr
                      key={absence.id}
                      onClick={() => startEditing(absence)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {absence.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {absence.date}
                      </td>
                      <td
                        className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(absence);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(absence, e)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No absences found. Add your first absence!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsentSettings;