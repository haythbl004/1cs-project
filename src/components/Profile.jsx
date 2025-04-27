import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset password fields when exiting edit mode
    if (isEditing) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  const passwordsMatch = password === confirmPassword && password !== '';

  return (
    <div className=" bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-4">
          {isEditing ? (
            <span>
              My Profile <FontAwesomeIcon icon={faArrowRight} className="mx-2" /> Edit
            </span>
          ) : (
            'My Profile'
          )}
        </h1>
        <div className="bg-white rounded-lg shadow-xl p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  defaultValue={user.firstName || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  defaultValue={user.lastName || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={user.email || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  disabled={!passwordsMatch}
                  className={`flex items-center px-4 py-2 rounded text-white ${
                    passwordsMatch
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-gray-300 opacity-50 cursor-not-allowed filter blur-sm'
                  }`}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <p className="mt-1">{user.firstName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <p className="mt-1">{user.lastName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1">{user.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1">{user.role || 'N/A'}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
  );
};

export default Profile;