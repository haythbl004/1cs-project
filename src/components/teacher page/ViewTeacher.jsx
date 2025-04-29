import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ViewTeacher = ({ teacher, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Teacher Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <p className="mt-1">{teacher.firstName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <p className="mt-1">{teacher.lastName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1">{teacher.email || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Grade</label>
          <p className="mt-1">{teacher.gradeName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1">{teacher.role || 'N/A'}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onEdit(teacher)}
          className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Edit Teacher
        </button>
        <button
          onClick={() => onDelete(teacher.id)}
          className="bg-red-600 hover:cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete Teacher
        </button>
      </div>
    </div>
  );
};

export default ViewTeacher;