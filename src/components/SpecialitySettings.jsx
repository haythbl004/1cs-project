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
  faBook,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SpecialitySettings = ({ onBack, isBack }) => {
  const [specialities, setSpecialities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [specialityToDelete, setSpecialityToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSpecialities();
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/speciality', {
        withCredentials: true,
      });
      setSpecialities(response.data);
    } catch (error) {
      setErrorMessage('Error fetching specialities');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name) {
      setErrorMessage('Please fill the speciality name');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/speciality',
        { name: formData.name },
        { withCredentials: true }
      );

      setSpecialities([...specialities, response.data]);
      setFormData({ name: '' });
      setIsAdding(false);
      setSuccessMessage('Speciality added successfully!');
    } catch (error) {
      setErrorMessage('Error adding speciality');
      console.error(error);
    }
  };

  const startEditing = (speciality) => {
    setEditingId(speciality.id);
    setFormData({ name: speciality.name });
  };

  const saveEdit = async () => {
    if (!formData.name) {
      setErrorMessage('Please fill the speciality name');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/speciality/${editingId}`,
        { name: formData.name },
        { withCredentials: true }
      );

      setSpecialities(
        specialities.map((speciality) =>
          speciality.id === editingId ? { ...speciality, name: formData.name } : speciality
        )
      );

      setEditingId(null);
      setFormData({ name: '' });
      setSuccessMessage('Speciality updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating speciality');
      console.error(error);
    }
  };

  const resetView = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '' });
  };

  const confirmDelete = (speciality, e) => {
    e.stopPropagation();
    setSpecialityToDelete(speciality);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/speciality/${specialityToDelete.id}`, {
        withCredentials: true,
      });

      setSpecialities(specialities.filter((speciality) => speciality.id !== specialityToDelete.id));
      setSpecialityToDelete(null);
      setSuccessMessage('Speciality deleted successfully!');
    } catch (error) {
      setErrorMessage('Error deleting speciality');
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setSpecialityToDelete(null);
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

      {specialityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the <strong>{specialityToDelete.name}</strong> speciality?
              This action cannot be undone.
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
          <FontAwesomeIcon icon={faBook} className="mr-3 text-blue-600" />
          <button
            onClick={resetView}
            className={`hover:text-blue-600 ${
              isAdding || editingId !== null ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            Specialities
          </button>
          {(isAdding || editingId !== null) && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-gray-500 text-sm" />
              <span className="text-gray-600 font-medium">{editingId !== null ? 'Edit' : 'Add'}</span>
            </>
          )}
        </h2>
        {!isAdding && editingId === null && (
          <div className="flex space-x-3">
            {isBack && (
              <button
                onClick={() => onBack('home')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Home
              </button>
            )}
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Speciality
            </button>
          </div>
        )}
      </div>

      {(isAdding || editingId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">
            {editingId !== null ? 'Edit Speciality' : 'Add New Speciality'}
          </h3>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speciality Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Computer Science"
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
              {editingId !== null ? 'Save Changes' : 'Add Speciality'}
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
                    Speciality Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {specialities.length > 0 ? (
                  specialities.map((speciality) => (
                    <tr
                      key={speciality.id}
                      onClick={() => startEditing(speciality)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {speciality.name}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(speciality);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(speciality, e)}
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
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                      No specialities found. Add your first speciality!
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

export default SpecialitySettings;