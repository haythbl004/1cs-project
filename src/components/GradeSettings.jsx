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
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const GradeSettings = () => {
  const [grades, setGrades] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    gradeName: '',
    pricePerHour: '',
    charge: '',
  });
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch grades on component mount
  useEffect(() => {
    fetchGrades();
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

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/grade/get', {
        withCredentials: true,
        headers: { 'Cache-Control': 'no-cache' },
      });
      console.log('Raw API Response:', JSON.stringify(response.data, null, 2));
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid API response: Expected an array');
      }
      const grades = response.data.map((grade, index) => {
        console.log(`Grade ${index} Keys:`, Object.keys(grade));
        return {
          id: grade.id ?? grade._id ?? `temp-id-${index}`,
          gradeName: grade.GradeName ?? 'Unnamed Grade',
          pricePerHour: Number(grade.PricePerHour) || 0,
          charge: Number(grade.charge) || 0,
        };
      });
      console.log('Mapped Grades:', grades);
      setGrades(grades);
      if (grades.length === 0) {
        setErrorMessage('No grades found in the database.');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch grades. Please check the server.');
      console.error('Error fetching grades:', error.message, error.response?.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.gradeName.trim() || !formData.pricePerHour || !formData.charge) {
      setErrorMessage('Please fill all fields');
      return;
    }
    const pricePerHour = parseFloat(formData.pricePerHour);
    const charge = parseFloat(formData.charge);
    if (isNaN(pricePerHour) || isNaN(charge) || pricePerHour < 0 || charge < 0) {
      setErrorMessage('Price per hour and charge must be non-negative numbers');
      return;
    }

    try {
      const payload = {
        gradeName: formData.gradeName.trim(),
        pricePerHour,
        charge,
      };
      console.log('Add Grade Payload:', payload);
      const response = await axios.post(
        'http://localhost:3000/api/grade/create',
        payload,
        { withCredentials: true }
      );
      console.log('Add Grade Response:', response.data);
      await fetchGrades();
      setFormData({ gradeName: '', pricePerHour: '', charge: '' });
      setIsAdding(false);
      setSuccessMessage('Grade added successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to add grade';
      setErrorMessage(`Failed to add grade: ${errorMsg}`);
      console.error('Error adding grade:', error.message, error.response?.data);
    }
  };

  const startEditing = (grade) => {
    setEditingId(grade.id);
    setFormData({
      gradeName: grade.gradeName || '',
      pricePerHour: grade.pricePerHour !== undefined ? String(grade.pricePerHour) : '',
      charge: grade.charge !== undefined ? String(grade.charge) : '',
    });
  };

  const saveEdit = async () => {
    if (!formData.gradeName.trim() || !formData.pricePerHour || !formData.charge) {
      setErrorMessage('Please fill all fields');
      return;
    }
    const pricePerHour = parseFloat(formData.pricePerHour);
    const charge = parseFloat(formData.charge);
    if (isNaN(pricePerHour) || isNaN(charge) || pricePerHour < 0 || charge < 0) {
      setErrorMessage('Price per hour and charge must be non-negative numbers');
      return;
    }

    try {
      const payload = {
        id: editingId,
        gradeName: formData.gradeName.trim(),
        pricePerHour,
        charge,
      };
      console.log('Update Grade Payload:', payload);
      const response = await axios.put(
        'http://localhost:3000/api/grade/update',
        payload,
        { withCredentials: true }
      );
      console.log('Update Grade Response:', response.data);
      await fetchGrades();
      setEditingId(null);
      setFormData({ gradeName: '', pricePerHour: '', charge: '' });
      setSuccessMessage('Grade updated successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update grade';
      setErrorMessage(`Failed to update grade: ${errorMsg}`);
      console.error('Error updating grade:', error.message, error.response?.data);
    }
  };

  const resetView = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ gradeName: '', pricePerHour: '', charge: '' });
  };

  const confirmDelete = (grade, e) => {
    e.stopPropagation();
    setGradeToDelete(grade);
  };

  const handleDelete = async () => {
    try {
      const payload = { id: gradeToDelete.id };
      console.log('Delete Grade Payload:', payload);
      const response = await axios.delete('http://localhost:3000/api/grade/delete', {
        data: payload,
        withCredentials: true,
      });
      console.log('Delete Grade Response:', response.data);
      await fetchGrades();
      setGradeToDelete(null);
      setSuccessMessage('Grade deleted successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete grade';
      setErrorMessage(`Failed to delete grade: ${errorMsg}`);
      console.error('Error deleting grade:', error.message, error.response?.data);
    }
  };

  const cancelDelete = () => {
    setGradeToDelete(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Success/Error Message */}
      {(successMessage || errorMessage) && (
        <div
          className={`rounded-md p-3 border mb-6 ${
            successMessage ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
          }`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`flex-shrink-0 h-5 w-5 ${
                successMessage ? 'text-green-500' : 'text-red-500'
              } mr-2`}
            />
            <p className="text-sm font-medium text-gray-700">
              {successMessage || errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {gradeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the <strong>{gradeToDelete.gradeName}</strong> grade?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 inline-flex items-center">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-blue-600" />
          <button
            onClick={resetView}
            className={`hover:text-blue-600 ${
              isAdding || editingId !== null ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            Academic Grades
          </button>
          {(isAdding || editingId !== null) && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-gray-500 text-sm" />
              <span className="text-gray-600 font-medium">
                {editingId !== null ? 'Edit' : 'Add'}
              </span>
            </>
          )}
        </h2>
        {!isAdding && editingId === null && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Grade
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">
            {editingId !== null ? 'Edit Academic Grade' : 'Add New Academic Grade'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Name</label>
              <input
                type="text"
                name="gradeName"
                value={formData.gradeName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Associate Professor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour (DA)</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500"
                min="0"
                step="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Charge (DA)</label>
              <input
                type="number"
                name="charge"
                value={formData.charge}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1000"
                min="0"
                step="10"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetView}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={editingId !== null ? saveEdit : handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {editingId !== null ? 'Save Changes' : 'Add Grade'}
            </button>
          </div>
        </div>
      )}

      {/* Grades Table */}
      {!isAdding && editingId === null && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Per Hour (DA)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charge
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.length > 0 ? (
                  grades.map((grade) => (
                    <tr
                      key={grade.id}
                      onClick={() => startEditing(grade)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {grade.gradeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.pricePerHour}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.charge}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(grade);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(grade, e)}
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
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No academic grades found. Add your first grade!
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

export default GradeSettings;