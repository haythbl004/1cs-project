import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faCheck,
  faUser,
  faEnvelope,
  faLock,
  faAngleRight, // Added for breadcrumb separator
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CustomDropdown = ({ label, options, selectedValue, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-2" ref={dropdownRef}>
        <button
          type="button"
          className="flex w-full items-center border border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`listbox-label-${name}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex-1 text-left truncate">{selectedValue?.name || `Select ${label}`}</span>
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="ml-2 size-5 text-gray-500 sm:size-4"
          />
        </button>
        {isOpen && (
          <ul
            className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
            role="listbox"
            aria-labelledby={`listbox-label-${name}`}
          >
            {options.map((option) => (
              <li
                key={option.id}
                className={`relative cursor-default py-2 pr-9 pl-3 select-none ${
                  selectedValue?.id === option.id ? 'bg-blue-200 text-black' : 'text-gray-900'
                }`}
                role="option"
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center">
                  <span
                    className={`ml-3 block truncate ${
                      selectedValue?.id === option.id ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {option.name}
                  </span>
                </div>
                {selectedValue?.id === option.id && (
                  <span
                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                      selectedValue?.id === option.id ? 'text-white' : 'text-indigo-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCheck} className="size-5 text-black" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const TeacherManagement = ({ user, setUser }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit', 'add'
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    grade: null,
    role: 'teacher',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/teacher/get', {
          withCredentials: true,
        });
        const transformedTeachers = response.data.map((item) => ({
          id: item.Teacher.id,
          firstName: item.User.firstName,
          lastName: item.User.lastName,
          email: item.User.email,
          gradeId: item.Teacher.gradeId,
          gradeName: item.Grade.GradeName,
          role: item.User.role,
        }));
        setTeachers(transformedTeachers);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          navigate('/login');
        } else {
          alert('Failed to fetch teachers');
        }
      }
    };

    const fetchGrades = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/grade/get', {
          withCredentials: true,
        });
        const transformedGrades = response.data.map((grade) => ({
          id: grade.id,
          name: grade.GradeName,
        }));
        setGradeOptions(transformedGrades);
      } catch (err) {
        console.error('Failed to fetch grades:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          navigate('/login');
        } else {
          alert('Failed to fetch grades');
        }
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchTeachers(), fetchGrades()]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, user, setUser]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const viewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewMode('view');
  };

  const editTeacher = (teacher) => {
    const selectedGrade = gradeOptions.find((g) => g.id === teacher.gradeId) || null;
    setSelectedTeacher({
      ...teacher,
      grade: selectedGrade,
    });
    setViewMode('edit');
  };

  const saveEditedTeacher = async () => {
    try {
      const updatedTeacher = {
        id: selectedTeacher.id,
        firstName: selectedTeacher.firstName,
        lastName: selectedTeacher.lastName,
        email: selectedTeacher.email,
        role: 'teacher',
        gradeID: selectedTeacher.grade?.id,
      };
      console.log(updatedTeacher)
      await axios.put('http://localhost:3000/api/teacher/update', updatedTeacher, {
        withCredentials: true,
      });
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === selectedTeacher.id
            ? { ...teacher, ...updatedTeacher, gradeId: updatedTeacher.gradeID, gradeName: selectedTeacher.grade?.name }
            : teacher
        )
      );
      setSuccessMessage('Teacher updated successfully!');
      setViewMode('list');
    } catch (err) {
      console.error('Failed to update teacher:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert('Failed to update teacher');
      }
    }
  };

  const confirmDelete = (id) => {
    setTeacherToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/teacher/delete/${teacherToDelete}`, {
        withCredentials: true,
      });
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherToDelete));
      if (selectedTeacher && selectedTeacher.id === teacherToDelete) {
        setSelectedTeacher(null);
        setViewMode('list');
      }
      setSuccessMessage('Teacher deleted successfully!');
      setShowDeleteConfirm(false);
      setTeacherToDelete(null);
    } catch (err) {
      console.error('Failed to delete teacher:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert('Failed to delete teacher');
      }
    }
  };

  const addNewTeacher = () => {
    setNewTeacher({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      grade: null,
      role: 'teacher',
    });
    setViewMode('add');
  };

  const saveNewTeacher = async () => {
    try {
      const teacherToAdd = {
        firstName: newTeacher.firstName,
        lastName: newTeacher.lastName,
        email: newTeacher.email,
        password: newTeacher.password,
        gradeID: newTeacher.grade?.id,
        role: 'teacher',
      };
      await axios.post('http://localhost:3000/api/auth/signup', teacherToAdd, {
        withCredentials: true,
      });
      const response = await axios.get('http://localhost:3000/api/teacher/get', {
        withCredentials: true,
      });
      const transformedTeachers = response.data.map((item) => ({
        id: item.Teacher.id,
        firstName: item.User.firstName,
        lastName: item.User.lastName,
        email: item.User.email,
        gradeId: item.Teacher.gradeId,
        gradeName: item.Grade.GradeName,
        role: item.User.role,
      }));
      setTeachers(transformedTeachers);
      setSuccessMessage('Teacher added successfully!');
      setViewMode('list');
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

  const handleInputChange = (e, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewTeacher((prev) => ({ ...prev, [name]: value }));
    } else {
      setSelectedTeacher((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGradeChange = (grade, isNew = false) => {
    if (isNew) {
      setNewTeacher((prev) => ({ ...prev, grade }));
    } else {
      setSelectedTeacher((prev) => ({ ...prev, grade }));
    }
  };

  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
        <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-blue-600" />
        <button
          onClick={() => setViewMode('list')}
          className="hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          Teacher Management
        </button>
        {viewMode !== 'list' && (
          <>
            <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-500" />
            <span className="capitalize">{viewMode}</span>
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="p-6">
      {renderBreadcrumb()}

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

      {viewMode === 'list' && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Teacher List</h2>
            <button
              onClick={addNewTeacher}
              className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Teacher
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No teachers found.
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className={`hover:bg-gray-100 cursor-pointer ${
                        selectedTeacher?.id === teacher.id ? 'bg-white' : ''
                      }`}
                      onClick={() => viewTeacher(teacher)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.gradeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            editTeacher(teacher);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(teacher.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'view' && selectedTeacher && (
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Teacher Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1">{selectedTeacher.firstName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1">{selectedTeacher.lastName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1">{selectedTeacher.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <p className="mt-1">{selectedTeacher.gradeName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1">{selectedTeacher.role || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => editTeacher(selectedTeacher)}
              className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit Teacher
            </button>
            <button
              onClick={() => confirmDelete(selectedTeacher.id)}
              className="bg-red-600 hover:cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Delete Teacher
            </button>
          </div>
        </div>
      )}

      {viewMode === 'edit' && selectedTeacher && (
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Teacher</h2>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mx-3 text-gray-400"
                />
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
                <FontAwesomeIcon
                  icon={faUser}
                  className="mx-3 text-gray-400"
                />
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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mx-3 text-gray-400"
                />
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
            <CustomDropdown
              label="Grade"
              options={gradeOptions}
              selectedValue={selectedTeacher.grade || null}
              onChange={(grade) => handleGradeChange(grade)}
              name="grade"
            />
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
              onClick={() => setViewMode('list')}
              className=" hover:bg-gray-50 hover:cursor-pointer text-white px-4 py-2 rounded-md flex items-center bg-white"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {viewMode === 'add' && (
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mx-3 text-gray-400"
                />
                <input
                  type="text"
                  name="firstName"
                  value={newTeacher.firstName}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Enter first name"
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mx-3 text-gray-400"
                />
                <input
                  type="text"
                  name="lastName"
                  value={newTeacher.lastName}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Enter last name"
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mx-3 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={newTeacher.email}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Enter email"
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <CustomDropdown
              label="Grade"
              options={gradeOptions}
              selectedValue={newTeacher.grade || null}
              onChange={(grade) => handleGradeChange(grade, true)}
              name="grade"
            />
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon
                  icon={faLock}
                  className="mx-3 text-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  value={newTeacher.password}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Enter password"
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              onClick={() => setViewMode('list')}
              className=" px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this teacher? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;