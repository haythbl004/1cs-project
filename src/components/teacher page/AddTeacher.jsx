import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faSave } from '@fortawesome/free-solid-svg-icons';
import CustomDropdown from '../CustomDropdown'; // Assuming CustomDropdown is in the same directory
import axios from 'axios';

const AddTeacher = ({ gradeOptions, onSave, onCancel, setSuccessMessage, setUser, navigate }) => {
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    grade: null,
    role: 'teacher',
    paymentType: '',
    teacherType: '',
    accountNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (grade) => {
    setNewTeacher((prev) => ({ ...prev, grade }));
  };

  const addTeacher = async (teacherData) => {
    try {
      const payload = {
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        password: teacherData.password,
        gradeID: teacherData.grade?.id,
        role: 'teacher',
        paymentType: teacherData.paymentType,
        teacherType: teacherData.teacherType,
        accountNumber: teacherData.accountNumber,
      };

      await axios.post('http://localhost:3000/api/auth/signup', payload, {
        withCredentials: true,
      });

      // Clear the form after successful add
      setNewTeacher({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        grade: null,
        role: 'teacher',
        paymentType: '',
        teacherType: '',
        accountNumber: '',
      });

      setSuccessMessage('Teacher added successfully!');
      if (onSave) onSave(payload); // Pass payload to onSave to update parent
      onCancel();
    } catch (err) {
      console.error('Failed to add teacher:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert(err.response?.data?.error || 'Failed to add teacher');
      }
    }
  };

  const saveNewTeacher = async () => {
    await addTeacher(newTeacher);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faUser} className="mx-3 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={newTeacher.firstName}
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
                value={newTeacher.lastName}
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
          selectedValue={newTeacher.grade || null}
          onChange={handleGradeChange}
          name="grade"
        />
        <div className="relative flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faEnvelope} className="mx-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={newTeacher.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faLock} className="mx-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={newTeacher.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <input
              type="text"
              name="paymentType"
              value={newTeacher.paymentType}
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
              value={newTeacher.teacherType}
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
              value={newTeacher.accountNumber}
              onChange={handleInputChange}
              placeholder="e.g. 321312"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={saveNewTeacher}
          className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Add Teacher
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

export default AddTeacher;