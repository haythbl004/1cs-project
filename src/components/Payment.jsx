import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faDownload, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '../components/planning pages/Dropdown'; // Updated import
import axios from 'axios';

const Payment = ({ setSuccessMessage, setUser, navigate }) => {
  const [formMode, setFormMode] = useState('payment-state');
  const [newPayment, setNewPayment] = useState({
    startDate: '',
    endDate: '',
    semester: null,
    paymentType: null,
    teacherType: null,
  });
  const [error, setError] = useState(null);

  const paymentTypeOptions = [
    { id: 'ccp', name: 'CCP' },
    { id: 'bank', name: 'Bank' },
  ];

  const semesterOptions = [
    { id: 1, name: 'Semester 1' },
    { id: 2, name: 'Semester 2' },
  ];

  const teacherTypeOptions = [
    { id: 'permanent', name: 'Permanent' },
    { id: 'outsider', name: 'Outsider' },
    { id: 'vacataire', name: 'Vacataire' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSemesterChange = (semester) => {
    setNewPayment((prev) => ({ ...prev, semester }));
    setError(null);
  };

  const handlePaymentTypeChange = (paymentType) => {
    setNewPayment((prev) => ({ ...prev, paymentType }));
    setError(null);
  };

  const handleTeacherTypeChange = (teacherType) => {
    setNewPayment((prev) => ({ ...prev, teacherType }));
    setError(null);
  };

  const handleModeChange = () => {
    setFormMode((prev) => (prev === 'payment-state' ? 'commitment' : 'payment-state'));
    setNewPayment((prev) => ({
      ...prev,
      paymentType: null,
      teacherType: null,
    }));
    setError(null);
  };

  const validateForm = (paymentData) => {
    if (!paymentData.startDate || !paymentData.endDate || !paymentData.semester) {
      return 'Please fill in all required fields (Start Date, End Date, Semester).';
    }
    if (new Date(paymentData.endDate) < new Date(paymentData.startDate)) {
      return 'End Date must be after Start Date.';
    }
    if (!semesterOptions.some((opt) => opt.id === paymentData.semester?.id)) {
      return 'Invalid semester selected.';
    }
    if (formMode === 'payment-state') {
      if (!paymentData.paymentType || !paymentTypeOptions.some((opt) => opt.id === paymentData.paymentType?.id)) {
        return 'Please select a valid Payment Type.';
      }
      if (!paymentData.teacherType || !teacherTypeOptions.some((opt) => opt.id === paymentData.teacherType?.id)) {
        return 'Please select a valid Teacher Type.';
      }
    }
    return null;
  };

  const downloadExcel = async (paymentData) => {
    try {
      const validationError = validateForm(paymentData);
      if (validationError) {
        setError(validationError);
        return;
      }

      const baseUrl =
        formMode === 'payment-state'
          ? 'http://localhost:3000/api/salary/payment-form'
          : 'http://localhost:3000/api/salary/engagement';

      const params = {
        startDate: paymentData.startDate,
        endDate: paymentData.endDate,
        semester: paymentData.semester.id,
        ...(formMode === 'payment-state' && {
          paymentType: paymentData.paymentType.id,
          teacherType: paymentData.teacherType.id,
        }),
      };

      const response = await axios.get(baseUrl, {
        params,
        withCredentials: true,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment_${formMode}_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setNewPayment({
        startDate: '',
        endDate: '',
        semester: null,
        paymentType: null,
        teacherType: null,
      });
      setSuccessMessage('Excel file downloaded successfully!');
      setError(null);
    } catch (err) {
      console.error('Failed to download Excel file:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUser(null);
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to download Excel file. Please try again.');
      }
    }
  };

  const handleDownload = async () => {
    await downloadExcel(newPayment);
  };

  return (
    <div className="p-7">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-600" />
        Payment Management
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="mb-4">
          <label className="inline-flex items-center cursor-pointer w-40">
            <span className="text-sm font-medium text-gray-700 truncate">
              {formMode === 'payment-state' ? 'Payment State' : 'Commitment'}
            </span>
            <input
              type="checkbox"
              checked={formMode === 'commitment'}
              onChange={handleModeChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors ml-auto">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  formMode === 'commitment' ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </label>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon icon={faCalendar} className="mx-3 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={newPayment.startDate}
                  onChange={handleInputChange}
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
                <FontAwesomeIcon icon={faCalendar} className="mx-3 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={newPayment.endDate}
                  onChange={handleInputChange}
                  className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
          <Dropdown
            label="Semester"
            options={semesterOptions}
            selectedValue={newPayment.semester || null}
            onChange={handleSemesterChange}
            placeholder="Select a semester"
            required
            className="w-full"
          />
          <Dropdown
            label="Payment Type"
            options={paymentTypeOptions}
            selectedValue={newPayment.paymentType || null}
            onChange={handlePaymentTypeChange}
            disabled={formMode === 'commitment'}
            placeholder="Select a payment type"
            required={formMode === 'payment-state'}
            className="w-full"
          />
          <Dropdown
            label="Teacher Type"
            options={teacherTypeOptions}
            selectedValue={newPayment.teacherType || null}
            onChange={handleTeacherTypeChange}
            disabled={formMode === 'commitment'}
            placeholder="Select a teacher type"
            required={formMode === 'payment-state'}
            className="w-full"
          />
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download Excel File
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;