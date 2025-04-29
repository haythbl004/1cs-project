import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faEdit,
  faSave,
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faUserGraduate,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const passwordsMatch = password === confirmPassword && password !== '';
  const hasChanges =
    firstName !== (user.firstName || '') ||
    lastName !== (user.lastName || '') ||
    email !== (user.email || '') ||
    password !== '';

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccessMessage('');
    if (isEditing) {
      // Reset fields when exiting edit mode
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSave = async () => {
    if (!hasChanges) {
      setError('No changes to save.');
      return;
    }
    if (password && !passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const updateData = {};
      if (firstName !== user.firstName) updateData.firstName = firstName;
      if (lastName !== user.lastName) updateData.lastName = lastName;
      if (email !== user.email) updateData.email = email;
      if (password && passwordsMatch) updateData.password = password;

      const response = await axios.put(
        'http://localhost:3000/api/auth/update-profile',
        updateData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Profile updated:', response.data);

      setSuccessMessage('Profile updated successfully!');
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccessMessage('');
        setIsEditing(false)
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
          <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-blue-600" />
          <button
            onClick={() => setIsEditing(false)}
            className="hover:text-blue-600 transition-colors hover:cursor-pointer"
          >
            My Profile
          </button>
          {isEditing && (
            <>
              <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-500" />
              <span className="capitalize">Edit</span>
            </>
          )}
        </div>
        {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                {error}
              </div>
            )}
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                {/* First Name and Last Name on the same line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="Enter email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="Enter new password"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="Confirm new password"
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || (password && !passwordsMatch)}
                    className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition duration-150 ${
                      hasChanges && (!password || passwordsMatch)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-300 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* First Name */}
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-gray-900">{user.firstName || 'N/A'}</p>
                  </div>
                </div>

                {/* Last Name */}
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-gray-900">{user.lastName || 'N/A'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-3" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{user.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-gray-900">{user.role || 'N/A'}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-150"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;