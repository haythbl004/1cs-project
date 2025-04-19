import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const SpecialitySettings = () => {
  const initialSpecialities = [
    { id: 1, name: 'Computer Science', code: 'CS', department: 'Engineering' },
    { id: 2, name: 'Mathematics', code: 'MATH', department: 'Science' },
    { id: 3, name: 'Physics', code: 'PHY', department: 'Science' },
  ];

  const [specialities, setSpecialities] = useState(initialSpecialities);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', department: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [specialitiesToDelete, setSpecialitiesToDelete] = useState(null);

  // ... CRUD operations ...

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (!formData.rank || !formData.monthlySalary) return;
    
    const newRank = {
      id: initialSpecialities.length > 0 ? Math.max(...initialSpecialities.map(r => r.id)) + 1 : 1,
      rank: formData.rank,
      monthlySalary: parseFloat(formData.monthlySalary)
    };
    
    setSpecialities([...initialSpecialities, newRank]);
    setFormData({ rank: '', monthlySalary: '' });
    setIsAdding(false);
    setSuccessMessage('Academic rank added successfully!');
  };

  const startEditing = (rank) => {
    setEditingId(rank.id);
    setFormData({
      rank: rank.rank,
      monthlySalary: rank.monthlySalary.toString()
    });
  };

  const saveEdit = () => {
    if (!formData.rank || !formData.monthlySalary) return;
    
    setSpecialities(initialSpecialities.map(rank => 
      rank.id === editingId 
        ? { 
            ...rank, 
            rank: formData.rank, 
            monthlySalary: parseFloat(formData.monthlySalary) 
          } 
        : rank
    ));
    setEditingId(null);
    setFormData({ rank: '', monthlySalary: '' });
    setSuccessMessage('Academic rank updated successfully!');
  };

  const resetView = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ rank: '', monthlySalary: '' });
  };

  const confirmDelete = (rank, e) => {
    e.stopPropagation();
    setSpecialitiesToDelete(rank);
  };

  const handleDelete = () => {
    setRanks(ranks.filter(rank => rank.id !== specialitiesToDelete.id));
    setSpecialitiesToDelete(null);
    setSuccessMessage('Academic rank deleted successfully!');
  };

  const cancelDelete = () => {
    setSpecialitiesToDelete(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 border border-green-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="flex-shrink-0 h-5 w-5 text-green-500 mr-2"
            />
            <p className="text-sm font-medium text-gray-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {rankToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the <strong>{rankToDelete.rank}</strong> rank?
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
              className={`hover:text-blue-600 ${(isAdding || editingId !== null) ? 'cursor-pointer' : 'cursor-default'}`}
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
            Add New Rank
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-6">
            {editingId !== null ? 'Edit Academic Rank' : 'Add New Academic Rank'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Rank</label>
              <input
                type="text"
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Associate Professor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary ($)</label>
              <input
                type="number"
                name="monthlySalary"
                value={formData.monthlySalary}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 9000"
                min="0"
                step="100"
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
              {editingId !== null ? 'Save Changes' : 'Add Rank'}
            </button>
          </div>
        </div>
      )}

      {/* Ranks Table */}
      {!isAdding && editingId === null && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ranks.length > 0 ? (
                  ranks.map((rank) => (
                    <tr 
                      key={rank.id}
                      onClick={() => startEditing(rank)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rank.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rank.monthlySalary.toLocaleString()} DA
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(rank);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(rank, e)}
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
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No academic grades found. Add your first rank!
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