import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faEdit,
  faTrash,
  faPlus,
  faTimes,
  faCheckCircle,
  faAngleRight,
  faSearch,
  faCalendarTimes, // Added for absent icon
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import AddTeacher from './teacher page/AddTeacher';
import EditTeacher from './teacher page/EditTeacher';
import PrintHeureSupCart from './teacher page/PrintHeureSupCart';
import TeacherAbsen from './teacher page/TeacherAbsen'; // Import TeacherAbsen component

const TeacherManagement = ({ user, setUser }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const teachersPerPage = 4;
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
          paymentType: item.Teacher.paymentType,
          teacherType: item.Teacher.teacherType,
          accountNumber: item.Teacher.accountNumber,
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

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      teacher.firstName.toLowerCase().includes(searchLower) ||
      teacher.lastName.toLowerCase().includes(searchLower) ||
      teacher.email.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / teachersPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const indexOfFirstTeacher = (safePage - 1) * teachersPerPage;
  const indexOfLastTeacher = indexOfFirstTeacher + teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const handleNext = () => {
    if (safePage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (safePage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const viewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewMode('selectDates');
    setStartDate('');
    setEndDate('');
  };

  const viewTeacherAbsen = (teacher) => {
    setSelectedTeacher(teacher);
    setViewMode('absent');
  };

  const handleDateFormSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be after start date.');
      return;
    }
    setViewMode('Overtime Hours Report');
  };

  const editTeacher = (teacher) => {
    console.log('Editing teacher:', teacher);
    setSelectedTeacher(teacher);
    setViewMode('edit');
  };

  const saveEditedTeacher = async (updatedTeacher, gradeName) => {
    try {
      await axios.put('http://localhost:3000/api/teacher/update', updatedTeacher, {
        withCredentials: true,
      });
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === updatedTeacher.id
            ? {
                ...teacher,
                ...updatedTeacher,
                gradeId: updatedTeacher.gradeId,
                gradeName,
                paymentType: updatedTeacher.paymentType,
                teacherType: updatedTeacher.teacherType,
                accountNumber: updatedTeacher.accountNumber,
              }
            : teacher
        )
      );
      setSuccessMessage('Teacher updated successfully!');
    } catch (err) {
      console.error('Failed to update teacher:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert('Failed to update teacher: ' + (err.response?.data?.error || 'Unknown error'));
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
      if (currentTeachers.length === 1 && safePage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
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
    setViewMode('add');
  };

  const saveNewTeacher = async (teacherToAdd) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', teacherToAdd, {
        withCredentials: true,
      });

      console.log('New teacher added:', response.data);

      const fetchResponse = await axios.get('http://localhost:3000/api/teacher/get', {
        withCredentials: true,
      });
      const transformedTeachers = fetchResponse.data.map((item) => ({
        id: item.Teacher.id,
        firstName: item.User.firstName,
        lastName: item.User.lastName,
        email: item.User.email,
        gradeId: item.Teacher.gradeId,
        gradeName: item.Grade.GradeName,
        role: item.User.role,
        paymentType: item.Teacher.paymentType,
        teacherType: item.Teacher.teacherType,
        accountNumber: item.Teacher.accountNumber,
      }));

      setTeachers(transformedTeachers);
      setSuccessMessage('Teacher added successfully!');
      setViewMode('list');
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to add teacher:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        alert('Failed to add teacher: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
        <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-blue-600" />
        <button
          onClick={() => {
            setViewMode('list');
            setSelectedTeacher(null);
            setStartDate('');
            setEndDate('');
          }}
          className="hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          Teacher Management
        </button>
        {viewMode !== 'list' && (
          <>
            <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-500" />
            <span className="capitalize">
              {viewMode === 'selectDates'
                ? 'Select Date Range'
                : viewMode === 'absent'
                ? 'Teacher Absence'
                : viewMode}
            </span>
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

          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Teachers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden relative">
            <div className="overflow-x-auto">
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
                  {currentTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No teachers found.
                      </td>
                    </tr>
                  ) : (
                    currentTeachers.map((teacher) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-start items-center space-x-3">
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewTeacherAbsen(teacher);
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <FontAwesomeIcon icon={faCalendarTimes} className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredTeachers.length > teachersPerPage && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-end border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevious}
                    disabled={safePage === 1}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                      safePage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={safePage === totalPages}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                      safePage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'selectDates' && selectedTeacher && (
        <div className="w-full bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Select Date Range for {selectedTeacher.firstName} {selectedTeacher.lastName}
          </h2>
          <form onSubmit={handleDateFormSubmit}>
            <div className="mb-4">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('list');
                  setSelectedTeacher(null);
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === 'Overtime Hours Report' && selectedTeacher && (
        <PrintHeureSupCart
          teacher={selectedTeacher}
          teacherId={selectedTeacher.id}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {viewMode === 'edit' && selectedTeacher && (
        <EditTeacher
          teacher={selectedTeacher}
          gradeOptions={gradeOptions}
          onSave={saveEditedTeacher}
          onCancel={() => setViewMode('list')}
          setSuccessMessage={setSuccessMessage}
          setUser={setUser}
          navigate={navigate}
        />
      )}

      {viewMode === 'add' && (
        <AddTeacher
          gradeOptions={gradeOptions}
          onSave={saveNewTeacher}
          onCancel={() => setViewMode('list')}
          setSuccessMessage={setSuccessMessage}
          setUser={setUser}
          navigate={navigate}
        />
      )}

      {viewMode === 'absent' && selectedTeacher && (
        <TeacherAbsen
          teacher={selectedTeacher}
          setSuccessMessage={setSuccessMessage}
          setUser={setUser}
        />
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
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;