import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faChevronRight,
  faCheckCircle,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const HolidaySettings = () => {
  const [holidays, setHolidays] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch holidays on component mount
  useEffect(() => {
    fetchHolidays();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setErrorMessage('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/holiday',
        {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
        { withCredentials: true }
      );
      setHolidays([...holidays, response.data]);
      setFormData({ name: '', startDate: '', endDate: '' });
      setIsAdding(false);
      setSuccessMessage('Holiday added successfully!');
    } catch (error) {
      setErrorMessage('Failed to add holiday');
      console.error('Error adding holiday:', error);
    }
  };

  const startEditing = (holiday) => {
    setEditingId(holiday.id);
    setFormData({
      name: holiday.name,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
    });
  };

  const saveEdit = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setErrorMessage('Please fill all fields');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/holiday/${editingId}`,
        {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
        { withCredentials: true }
      );
      // Refetch holidays to ensure the UI reflects the latest backend data
      await fetchHolidays();
      setEditingId(null);
      setFormData({ name: '', startDate: '', endDate: '' });
      setSuccessMessage('Holiday updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update holiday');
      console.error('Error updating holiday:', error);
    }
  };

  const resetView = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', startDate: '', endDate: '' });
  };

  const confirmDelete = (holiday, e) => {
    e.stopPropagation();
    setHolidayToDelete(holiday);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/holiday/${holidayToDelete.id}`, {
        withCredentials: true,
      });
      setHolidays(holidays.filter((holiday) => holiday.id !== holidayToDelete.id));
      setHolidayToDelete(null);
      setSuccessMessage('Holiday deleted successfully!');
    } catch (error) {
      setErrorMessage('Failed to delete holiday');
      console.error('Error deleting holiday:', error);
    }
  };

  const cancelDelete = () => {
    setHolidayToDelete(null);
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

      {holidayToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the holiday <strong>{holidayToDelete.name}</strong> from{' '}
              <strong>{holidayToDelete.startDate}</strong> to{' '}
              <strong>{holidayToDelete.endDate}</strong>? This action cannot be undone.
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
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-blue-600" />
          <button
            onClick={resetView}
            className={`hover:text-blue-600 ${
              isAdding || editingId !== null ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            Holidays
          </button>
          {(isAdding || editingId !== null) && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-gray-500 text-sm" />
              <span className="text-gray-600 font-medium">{editingId !== null ? 'Edit' : 'Add'}</span>
            </>
          )}
        </h2>
        {!isAdding && editingId === null && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Holiday
          </button>
        )}
      </div>

      {(isAdding || editingId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">
            {editingId !== null ? 'Edit Holiday' : 'Add New Holiday'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter holiday name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
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
              {editingId !== null ? 'Save Changes' : 'Add Holiday'}
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
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holidays.length > 0 ? (
                  holidays.map((holiday) => (
                    <tr
                      key={holiday.id}
                      onClick={() => startEditing(holiday)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {holiday.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {holiday.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {holiday.endDate}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(holiday);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(holiday, e)}
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
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No holidays found. Add your first holiday!
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

export default HolidaySettings;