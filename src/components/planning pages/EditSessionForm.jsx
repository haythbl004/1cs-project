import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const EditSessionForm = ({ scheduleId, seanceId, teacherId, onRemove}) => {
  const [formData, setFormData] = useState({
    date: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      setErrorMessage("Date is required");
      return;
    }

    try {
      const payload = {
        date: formData.date,
        seanceId: seanceId,
        teacherId: teacherId,
      };
       const request =await axios.post("http://localhost:3000/api/absence", payload, {
        withCredentials: true,
      });
      console.log("Absence added:", request.data);
       
      setSuccessMessage("Absence added successfully!");
      setFormData({ date: "" }); // Reset form
    } catch (err) {
      console.error("Failed to add absence:", err);
      setErrorMessage(err.response?.data?.error || "Failed to add absence");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/schedule/${scheduleId}/seances/${seanceId}`, {
        withCredentials: true,
      });
      setSuccessMessage("Session deleted successfully!");
      setShowDeleteConfirm(false);
      onRemove(); // Call parent function without parameters
    } catch (err) {
      console.error("Failed to delete session:", err);
      setErrorMessage(err.response?.data?.error || "Failed to delete session");
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      {(successMessage || errorMessage) && (
        <div
          className={`rounded-md p-3 border mb-6 ${
            successMessage ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
          }`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`h-5 w-5 mr-2 ${successMessage ? "text-green-500" : "text-red-500"}`}
            />
            <p className="text-sm font-medium text-gray-700">
              {successMessage || errorMessage}
            </p>
          </div>
        </div>
      )}

      <h3 className="text-lg font-medium mb-4">Add Absent Date</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Absent Date*</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Absent
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Remove Session
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this session? This action cannot be undone.
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

export default EditSessionForm;