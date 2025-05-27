import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faSave } from '@fortawesome/free-solid-svg-icons';
import CustomDropdown from '../CustomDropdown';
import { useState } from 'react';

const EditTeacher = ({ teacher, gradeOptions, onSave, onCancel, setSuccessMessage, setUser, navigate }) => {
  const [selectedTeacher, setSelectedTeacher] = useState({
    ...teacher,
    grade: gradeOptions.find((g) => g.id === teacher.gradeId) || null,
    password: '', // Initialize password as empty
    paymentType: teacher.paymentType || '', // Initialize with teacher data or empty
    teacherType: teacher.teacherType || '',
    accountNumber: teacher.accountNumber || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (grade) => {
    setSelectedTeacher((prev) => ({ ...prev, grade }));
  };

  const saveEditedTeacher = async () => {
    try {
      const updatedTeacher = {
        id: selectedTeacher.id,
        firstName: selectedTeacher.firstName,
        lastName: selectedTeacher.lastName,
        email: selectedTeacher.email,
        role: 'teacher',
        gradeId: selectedTeacher.grade?.id,
        paymentType: selectedTeacher.paymentType,
        teacherType: selectedTeacher.teacherType,
        accountNumber: selectedTeacher.accountNumber,
      };
      await onSave(updatedTeacher, selectedTeacher.grade?.name);
      setSuccessMessage('Teacher updated successfully!');
      onCancel();
    } catch (err) {
      console.error('Failed to update teacher:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert(err.response?.data?.error || 'Failed to update teacher');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Teacher</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faUser} className="mx-3 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={selectedTeacher.firstName || ''}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faUser} className="mx-3 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={selectedTeacher.lastName || ''}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <CustomDropdown
          label="Grade"
          options={gradeOptions}
          selectedValue={selectedTeacher.grade || null}
          onChange={handleGradeChange}
          name="grade"
        />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faEnvelope} className="mx-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={selectedTeacher.email || ''}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex-1">
          </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <input
              type="text"
              name="paymentType"
              value={selectedTeacher.paymentType || ''}
              onChange={handleInputChange}
              placeholder="e.g. ccp"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Teacher Type</label>
            <input
              type="text"
              name="teacherType"
              value={selectedTeacher.teacherType || ''}
              onChange={handleInputChange}
              placeholder="e.g. permanent"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="number"
              name="accountNumber"
              value={selectedTeacher.accountNumber || ''}
              onChange={handleInputChange}
              placeholder="e.g. 321312"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={saveEditedTeacher}
          className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTeacher;