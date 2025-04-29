
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSessionForm = ({ days, timeSlots, onSave, sessionId, onClose, onSessionAdded }) => {
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    teacherId: '',
    room: '',
    type: '',
    group: '',
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Session type options
  const sessionTypes = ['cours', 'td', 'tp'];

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/teacher/get');
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to fetch teachers');
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      day: '',
      time: '',
      subject: '',
      teacherId: '',
      room: '',
      type: '',
      group: '',
    });
  };

  // Convert time slot (e.g., "8:00-10:00") to startTime and endTime
  const parseTimeSlot = (timeSlot) => {
    const [start, end] = timeSlot.split('-');
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    };
    return {
      startTime: formatTime(start),
      endTime: formatTime(end),
    };
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = ['day', 'time', 'subject', 'type', 'group'];
    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        onSave(null, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`, 'error', false);
        return false;
      }
    }
    if (!Number.isInteger(Number(formData.group)) || Number(formData.group) < 1) {
      onSave(null, 'Group must be a positive integer', 'error', false);
      return false;
    }
    return true;
  };

  // Handle form submission (Add Session)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const { startTime, endTime } = parseTimeSlot(formData.time);
    const selectedTeacher = teachers.find((t) => t.User.id === Number(formData.teacherId));
    const payload = {
      day: formData.day.toLowerCase(),
      startTime,
      endTime,
      location: formData.room || 'N/A',
      type: formData.type,
      module: formData.subject,
      group: Number(formData.group),
      teacherId: formData.teacherId ? Number(formData.teacherId) : null,
    };

    try {
      await axios.post(`http://localhost:3000/api/schedule/${sessionId}/seances`, payload);
      onSave(
        {
          ...formData,
          teacherName: selectedTeacher ? `${selectedTeacher.User.firstName} ${selectedTeacher.User.lastName}` : 'N/A',
        },
        'Session added successfully!',
        'success',
        false
      );
      onSessionAdded(); // Trigger re-fetch
      resetForm();
    } catch (err) {
      console.error('Error adding session:', err);
      onSave(null, 'Failed to add session', 'error', false);
    }
  };

  // Handle save and close
  const handleSave = async () => {
    onClose(); // Close the form
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium mb-2">Add New Session</h3>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Day*</label>
          <select
            name="day"
            value={formData.day}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject*</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter subject"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">Select teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.User.id} value={teacher.User.id}>
                {`${teacher.User.firstName} ${teacher.User.lastName}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter room number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select type</option>
            {sessionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group*</label>
          <input
            type="number"
            name="group"
            value={formData.group}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter group number"
            min="1"
            required
          />
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          Add Session
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSessionForm;
