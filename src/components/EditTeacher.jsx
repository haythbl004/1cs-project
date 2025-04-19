import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditTeacher = ({ isOpen, onClose, teacher, gradeOptions, onSave, customDropdown: CustomDropdown }) => {
  const [editedTeacher, setEditedTeacher] = useState(teacher || {});

  // Debug: Log to confirm props
  console.log('CustomDropdown in EditTeacher:', CustomDropdown);
  console.log('Grade Options in EditTeacher:', gradeOptions);

  if (!isOpen || !teacher) return null;

  // Fallback if CustomDropdown is undefined
  if (!CustomDropdown) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-red-600">CustomDropdown component is not available.</p>
        </div>
      </div>
    );
  }

  // Fallback if gradeOptions is empty
  if (!gradeOptions || gradeOptions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-red-600">No grades available to select.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher({ ...editedTeacher, [name]: value });
  };

  const handleGradeChange = (grade) => {
    console.log('Selected Grade:', grade); // Debug: Log selected grade
    setEditedTeacher({ ...editedTeacher, grade });
  };

  const handleSave = () => {
    console.log('Saving Edited Teacher Data:', editedTeacher); // Debug: Log data before saving
    onSave(editedTeacher);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Teacher</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={editedTeacher.firstName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={editedTeacher.lastName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editedTeacher.email || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <CustomDropdown
            label="Grade"
            options={gradeOptions}
            selectedValue={editedTeacher.grade}
            onChange={handleGradeChange}
            name="grade"
          />
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeacher;