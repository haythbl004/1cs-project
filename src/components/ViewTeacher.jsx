import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const ViewTeacher = ({ isOpen, onClose, teacher, onEdit, onDelete }) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Teacher Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <p className="mt-1">{teacher.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <p className="mt-1">{teacher.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{teacher.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <p className="mt-1">{teacher.gradeName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1">{teacher.role}</p>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit Teacher
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacher;