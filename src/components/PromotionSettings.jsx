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
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const PromotionSettings = () => {
  const [promotions, setPromotions] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialityId: '',
  });
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSpecialities().then(fetchPromotions);
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

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/promotion', {
        withCredentials: true,
      });
      console.log('GET /api/promotion response:', response.data);
      setPromotions(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch promotions');
      console.error('Error fetching promotions:', error);
    }
  };

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/speciality', {
        withCredentials: true,
      });
      setSpecialities(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch specialities');
      console.error('Error fetching specialities:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.specialityId || isNaN(parseInt(formData.specialityId))) {
      setErrorMessage('Please fill all fields correctly');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/promotion',
        {
          name: formData.name,
          specialityId: parseInt(formData.specialityId),
        },
        { withCredentials: true }
      );
      console.log('POST /api/promotion response:', response.data);

      const newPromotion = {
        Promotion: {
          id: response.data.Promotion?.id || response.data.id,
          name: response.data.Promotion?.name || response.data.name,
          specialityId: response.data.Promotion?.specialityId || response.data.specialityId,
        },
        Speciality: {
          id: response.data.Speciality?.id || parseInt(formData.specialityId),
          name:
            response.data.Speciality?.name ||
            specialities.find((spec) => spec.id === parseInt(formData.specialityId))?.name ||
            'Unknown',
        },
      };
      setPromotions([...promotions, newPromotion]);
      setFormData({ name: '', specialityId: '' });
      setIsAdding(false);
      setSuccessMessage('Promotion added successfully!');
    } catch (error) {
      setErrorMessage('Failed to add promotion');
      console.error('Error adding promotion:', error);
    }
  };

  const startEditing = (promotion) => {
    setEditingId(promotion.Promotion.id);
    setFormData({
      name: promotion.Promotion.name,
      specialityId: promotion.Speciality.id.toString(),
    });
  };

  const saveEdit = async () => {
    if (!formData.name || !formData.specialityId || isNaN(parseInt(formData.specialityId))) {
      setErrorMessage('Please fill all fields correctly');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/promotion/${editingId}`,
        {
          name: formData.name,
          specialityId: parseInt(formData.specialityId),
        },
        { withCredentials: true }
      );
      console.log('PUT /api/promotion response:', response.data);

      const updatedPromotion = {
        Promotion: {
          id: response.data.Promotion?.id || response.data.id,
          name: response.data.Promotion?.name || response.data.name,
          specialityId: response.data.Promotion?.specialityId || response.data.specialityId,
        },
        Speciality: {
          id: response.data.Speciality?.id || parseInt(formData.specialityId),
          name:
            response.data.Speciality?.name ||
            specialities.find((spec) => spec.id === parseInt(formData.specialityId))?.name ||
            'Unknown',
        },
      };
      setPromotions(
        promotions.map((promotion) =>
          promotion.Promotion.id === editingId ? updatedPromotion : promotion
        )
      );
      setEditingId(null);
      setFormData({ name: '', specialityId: '' });
      setSuccessMessage('Promotion updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update promotion');
      console.error('Error updating promotion:', error);
    }
  };

  const resetView = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', specialityId: '' });
  };

  const confirmDelete = (promotion, e) => {
    e.stopPropagation();
    setPromotionToDelete(promotion.Promotion);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/promotion/${promotionToDelete.id}`, {
        withCredentials: true,
      });
      setPromotions(promotions.filter((promotion) => promotion.Promotion.id !== promotionToDelete.id));
      setPromotionToDelete(null);
      setSuccessMessage('Promotion deleted successfully!');
    } catch (error) {
      setErrorMessage('Failed to delete promotion');
      console.error('Error deleting promotion:', error);
    }
  };

  const cancelDelete = () => {
    setPromotionToDelete(null);
  };

  return (
    <div className="space-y-6 relative">
      {(successMessage || errorMessage) && (
        <div className={`rounded-md p-3 border mb-6 ${successMessage ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
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

      {promotionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the <strong>{promotionToDelete.name}</strong> promotion?
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
          <FontAwesomeIcon icon={faStar} className="mr-3 text-blue-600" />
          <button
            onClick={resetView}
            className={`hover:text-blue-600 ${isAdding || editingId !== null ? 'cursor-pointer' : 'cursor-default'}`}
          >
            Promotions
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
            Add New Promotion
          </button>
        )}
      </div>

      {(isAdding || editingId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">
            {editingId !== null ? 'Edit Promotion' : 'Add New Promotion'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Senior Consultant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speciality</label>
              <select
                name="specialityId"
                value={formData.specialityId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Speciality</option>
                {specialities.map((speciality) => (
                  <option key={speciality.id} value={speciality.id}>
                    {speciality.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
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
              {editingId !== null ? 'Save Changes' : 'Add Promotion'}
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
                    Promotion Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speciality
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.length > 0 ? (
                  promotions.map((promotion, index) => (
                    <tr
                      key={promotion.Promotion?.id || index}
                      onClick={() => promotion.Promotion && startEditing(promotion)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {promotion.Promotion?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promotion.Speciality?.name || 'N/A'}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              promotion.Promotion && startEditing(promotion);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => promotion.Promotion && confirmDelete(promotion, e)}
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
                      No promotions found. Add your first promotion!
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

export default PromotionSettings;