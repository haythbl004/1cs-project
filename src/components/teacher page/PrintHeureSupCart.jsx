import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faClock, faPrint } from '@fortawesome/free-solid-svg-icons';
import CustomDropdown from '../CustomDropdown'; // Assuming CustomDropdown is in the same directory

const PrintHeureSupCart = ({ gradeOptions }) => {
  const [teacherInfo, setTeacherInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: null,
    overtimeHours: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (grade) => {
    setTeacherInfo((prev) => ({ ...prev, grade }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center text-2xl font-bold text-gray-800 mb-6 no-print">
        <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600" />
        <span>Teacher Overtime Form</span>
      </div>

      {/* Print-only content */}
      <div className="print-only hidden bg-white p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Teacher Overtime Information</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium">Full Name:</span> {teacherInfo.firstName} {teacherInfo.lastName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {teacherInfo.email || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Grade:</span> {teacherInfo.grade?.name || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Overtime Hours:</span> {teacherInfo.overtimeHours || '0'} hours
          </div>
        </div>
      </div>

      {/* Form content (hidden when printing) */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg mx-auto no-print">
        <h2 className="text-xl font-semibold mb-4">Enter Teacher Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon icon={faUser} className="mx-3 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={teacherInfo.firstName}
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
                  value={teacherInfo.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faEnvelope} className="mx-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={teacherInfo.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <CustomDropdown
            label="Grade"
            options={gradeOptions}
            selectedValue={teacherInfo.grade || null}
            onChange={handleGradeChange}
            name="grade"
          />
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Overtime Hours</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faClock} className="mx-3 text-gray-400" />
              <input
                type="number"
                name="overtimeHours"
                value={teacherInfo.overtimeHours}
                onChange={handleInputChange}
                placeholder="Enter overtime hours"
                min="0"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintHeureSupCart;