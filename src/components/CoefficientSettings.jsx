import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faChevronRight,
  faCheckCircle,
  faCalculator,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CoefficientSettings = () => {
  const [coefficients, setCoefficients] = useState([]);
  const [editingSeanceType, setEditingSeanceType] = useState(null);
  const [formData, setFormData] = useState({ value: '' });
  const [coefficientToDelete, setCoefficientToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch coefficients on component mount
  useEffect(() => {
    fetchCoefficients();
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

  const fetchCoefficients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/seanceTypeCoefficient', {
        withCredentials: true,
      });
      // Extract the coefficients array from the response
      setCoefficients(response.data.coefficients);
    } catch (error) {
      setErrorMessage('Failed to fetch coefficients');
      console.error('Error fetching coefficients:', error.response?.data || error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (coefficient) => {
    setEditingSeanceType(coefficient.seanceType);
    setFormData({
      value: coefficient.value.toString(),
    });
  };

  const saveEdit = async () => {
    // Validate input
    if (!formData.value) {
      setErrorMessage('Please fill the coefficient value');
      return;
    }

    const parsedValue = parseFloat(formData.value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      setErrorMessage('Coefficient value must be a positive number');
      return;
    }

    try {
      // Send both seanceType and value in the request body
      const response = await axios.put(
        `http://localhost:3000/api/seanceTypeCoefficient`,
        {
          seanceType: editingSeanceType,
          value: parsedValue,
        },
        { withCredentials: true }
      );
      setCoefficients(
        coefficients.map((coefficient) =>
          coefficient.seanceType === editingSeanceType ? response.data : coefficient
        )
      );
      setEditingSeanceType(null);
      setFormData({ value: '' });
      setSuccessMessage('Coefficient updated successfully!');
    } catch (error) {
      const serverMessage =
        error.response?.data?.message || 'Failed to update coefficient';
      setErrorMessage(serverMessage);
      console.error('Error updating coefficient:', error.response?.data || error);
    }
  };

  const resetView = () => {
    setEditingSeanceType(null);
    setFormData({ value: '' });
  };

  const confirmDelete = (coefficient, e) => {
    e.stopPropagation();
    setCoefficientToDelete(coefficient);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/seanceTypeCoefficient/${coefficientToDelete.seanceType}`,
        { withCredentials: true }
      );
      setCoefficients(
        coefficients.filter(
          (coefficient) => coefficient.seanceType !== coefficientToDelete.seanceType
        )
      );
      setCoefficientToDelete(null);
      setSuccessMessage('Coefficient deleted successfully!');
    } catch (error) {
      const serverMessage =
        error.response?.data?.message || 'Failed to delete coefficient';
      setErrorMessage(serverMessage);
      console.error('Error deleting coefficient:', error.response?.data || error);
    }
  };

  const cancelDelete = () => {
    setCoefficientToDelete(null);
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
            <p className="text-sm font-medium text-gray-700">
              {successMessage || errorMessage}
            </p>
          </div>
        </div>
      )}

      {coefficientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the <strong>{coefficientToDelete.seanceType}</strong>{' '}
              coefficient? This action cannot be undone.
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
          <FontAwesomeIcon icon={faCalculator} className="mr-3 text-blue-600" />
          <button
            onClick={resetView}
            className={`hover:text-blue-600 ${
              editingSeanceType !== null ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            Coefficients
          </button>
          {editingSeanceType !== null && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-gray-500 text-sm" />
              <span className="text-gray-600 font-medium">Edit</span>
            </>
          )}
        </h2>
      </div>

      {editingSeanceType !== null && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">Edit Coefficient</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seance Type</label>
              <input
                type="text"
                value={editingSeanceType}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient Value</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1.5"
                min="0.1"
                step="0.1"
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
              onClick={saveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {editingSeanceType === null && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seance Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coefficient Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coefficients.length > 0 ? (
                  coefficients.map((coefficient) => (
                    <tr
                      key={coefficient.seanceType}
                      onClick={() => startEditing(coefficient)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {coefficient.seanceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coefficient.value}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(coefficient);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(coefficient, e)}
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
                      No coefficients found.
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

export default CoefficientSettings;