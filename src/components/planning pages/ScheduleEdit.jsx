import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBook, faClock, faGraduationCap, faCheckCircle, faCalendar } from '@fortawesome/free-solid-svg-icons';
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

const ScheduleEdit = ({ scheduleId, scheduleinfo, setViewMode }) => {
  console.log("scheduleinfo", scheduleinfo);
  const [schedule, setSchedule] = useState({
    promotion: null,
    semester: scheduleinfo.semester || '',
    educationalYear: scheduleinfo.educationalYear || '',
    startDate: scheduleinfo.startDate || '',
    endDate: scheduleinfo.endDate || '',
  });
  const [promotionOptions, setPromotionOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      console.log("Using schedule info:", scheduleinfo);
      try {
        const promotionResponse = await axios.get('http://localhost:3000/api/promotion', {
          withCredentials: true,
        });

        let promotions = [];
        if (Array.isArray(promotionResponse.data)) {
          promotions = promotionResponse.data;
        } else if (promotionResponse.data?.Promotion) {
          promotions = [promotionResponse.data];
        } else {
          console.warn('No promotions found in response');
        }

        const transformedPromotions = promotions
          .filter((item) => item.Promotion)
          .map((item) => ({
            id: item.Promotion.id,
            name: `${item.Promotion.name} (${item.Speciality?.name || ''})`,
          }));

        setPromotionOptions(transformedPromotions);

        const selectedPromotion = transformedPromotions.find(
          (p) => p.id === scheduleinfo.promotionId
        ) || null;

        setSchedule((prev) => ({
          ...prev,
          promotion: selectedPromotion,
        }));

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
        setError('Failed to load promotions. Please try again.');
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [scheduleinfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromotionChange = (promotion) => {
    setSchedule((prev) => ({ ...prev, promotion }));
  };

  const saveEditedSchedule = async () => {
    try {
      // Validate inputs
      if (!schedule.promotion?.id) {
        alert('Please select a promotion');
        return;
      }
      if (!schedule.semester) {
        alert('Please select a semester');
        return;
      }
      if (!schedule.educationalYear) {
        alert('Please enter an educational year');
        return;
      }
      if (!schedule.startDate) {
        alert('Please enter a start date');
        return;
      }
      if (!schedule.endDate) {
        alert('Please enter an end date');
        return;
      }

      const scheduleToUpdate = {
        id: scheduleId,
        promotionId: schedule.promotion.id,
        semester: schedule.semester,
        educationalYear: schedule.educationalYear,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
      };

      await axios.put('http://localhost:3000/api/schedule', scheduleToUpdate, {
        withCredentials: true,
      });

      setSuccessMessage('Schedule updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        setViewMode('list');
      }, 3000);
    } catch (err) {
      console.error('Failed to update schedule:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update schedule. Please try again.';
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
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Schedule</h2>
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
      <div className="space-y-4">
        <Dropdown
          label="Promotion"
          options={promotionOptions}
          selectedValue={schedule.promotion || null}
          onChange={handlePromotionChange}
          name="promotion"
        />
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
            <FontAwesomeIcon icon={faBook} className="mx-3 text-gray-400" />
            <select
              name="semester"
              value={schedule.semester}
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
              value={schedule.educationalYear}
              onChange={handleInputChange}
              placeholder="Enter educational year (e.g., 2024/2025)"
              className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="relative flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faCalendar} className="mx-3 text-gray-400" />
              <input
                type="text"
                name="startDate"
                value={schedule.startDate}
                onChange={handleInputChange}
                placeholder="Enter start date (e.g., 10-09-2024)"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md shadow-sm">
              <FontAwesomeIcon icon={faCalendar} className="mx-3 text-gray-400" />
              <input
                type="text"
                name="endDate"
                value={schedule.endDate}
                onChange={handleInputChange}
                placeholder="Enter end date (e.g., 10-12-2024)"
                className="flex-1 block w-full border-none rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={saveEditedSchedule}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ScheduleEdit;