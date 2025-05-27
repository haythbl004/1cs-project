import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBook, faClock, faGraduationCap, faCheckCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Dropdown = ({ label, options, selectedValue, onChange, name }) => {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedOption = options.find((option) => option.id.toString() === selectedId) || null;
    onChange(selectedOption);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
        <FontAwesomeIcon icon={faGraduationCap} className="mx-3 text-gray-400" />
        <select
          name={name}
          value={selectedValue?.id || ''}
          onChange={handleChange}
          className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ScheduleAdd = () => {
  const [newSchedule, setNewSchedule] = useState({
    promotion: null,
    semester: '',
    educationalYear: '',
    startDate: '',
    endDate: '',
  });
  const [promotionOptions, setPromotionOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/promotion', {
          withCredentials: true,
        });

        // Handle response data (single object or array)
        let promotions = [];
        if (Array.isArray(response.data)) {
          promotions = response.data;
        } else if (response.data?.Promotion) {
          promotions = [response.data];
        } else {
          console.warn('No promotions found in response');
        }

        // Transform promotions to match Dropdown options format
        const transformedPromotions = promotions
          .filter((item) => item.Promotion) // Ensure Promotion exists
          .map((item) => ({
            id: item.Promotion.id,
            name: `${item.Promotion.name} (${item.Speciality?.name || ''})`, // Display "" if Speciality is null/undefined
          }));

        setPromotionOptions(transformedPromotions);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
        setError('Failed to load promotions. Please try again.');
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromotionChange = (promotion) => {
    setNewSchedule((prev) => ({ ...prev, promotion }));
  };

  const saveNewSchedule = async () => {
    try {
      // Validate inputs
      if (!newSchedule.promotion?.id) {
        alert('Please select a promotion');
        return;
      }
      if (!newSchedule.semester) {
        alert('Please select a semester');
        return;
      }
      if (!newSchedule.educationalYear) {
        alert('Please enter an educational year');
        return;
      }
      if (!newSchedule.startDate) {
        alert('Please select a start date');
        return;
      }
      if (!newSchedule.endDate) {
        alert('Please select an end date');
        return;
      }

      const scheduleToAdd = {
        promotionId: newSchedule.promotion.id,
        semester: newSchedule.semester,
        educationalYear: newSchedule.educationalYear,
        startDate: newSchedule.startDate,
        endDate: newSchedule.endDate,
      };

      // Send POST request
      await axios.post('http://localhost:3000/api/schedule', scheduleToAdd, {
        withCredentials: true,
      });

      // Reset form
      setNewSchedule({
        promotion: null,
        semester: '',
        educationalYear: '',
        startDate: '',
        endDate: '',
      });

      setSuccessMessage('Schedule created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to create schedule:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create schedule. Please try again.';
      alert(errorMessage);
    }
  };


  if (loading) {
    return <div>Loading promotions...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div >
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
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Schedule</h2>
      <div className="space-y-4">
        <Dropdown
          label="Promotion"
          options={promotionOptions}
          selectedValue={newSchedule.promotion || null}
          onChange={handlePromotionChange}
          name="promotion"
        />
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
            <FontAwesomeIcon icon={faBook} className="mx-3 text-gray-400" />
            <select
              name="semester"
              value={newSchedule.semester}
              onChange={handleInputChange}
              className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select semester</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Educational Year</label>
          <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
            <FontAwesomeIcon icon={faClock} className="mx-3 text-gray-400" />
            <input
              type="text"
              name="educationalYear"
              value={newSchedule.educationalYear}
              onChange={handleInputChange}
              placeholder="Enter educational year (e.g., 2024/2025)"
              className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="mx-3 text-gray-400" />
              <input
                type="date"
                name="startDate"
                value={newSchedule.startDate}
                onChange={handleInputChange}
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="relative flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="mx-3 text-gray-400" />
              <input
                type="date"
                name="endDate"
                value={newSchedule.endDate}
                onChange={handleInputChange}
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={saveNewSchedule}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Create Schedule
        </button>
      </div>
    </div>
    </div>
  );
};

export default ScheduleAdd;