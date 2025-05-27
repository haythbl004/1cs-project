import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import EditSessionForm from "./EditSessionForm";
import AddSessionForm from "./AddSessionForm";
import axios from "axios";

const Planning = ({ schedule, onViewModeChange, showAddForm, setShowAddForm, showEditForm, setShowEditForm }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = ["8:00-10:00", "9:30-11:00", "11:00-12:30", "14:00-15:30"];

  const [scheduleData, setScheduleData] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Saturday: {},
    Sunday: {},
  });
  const [editingSession, setEditingSession] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for re-fetching seances

  // Fetch seances on mount or when refreshTrigger changes
  const fetchSeances = async () => {
    try {
      console.log(`Fetching seances for scheduleId: ${schedule.id}`);
      const response = await axios.get(`http://localhost:3000/api/schedule/${schedule.id}/seances`, {
        withCredentials: true,
      });
      console.log('Raw API response:', response.data);
      const seances = response.data.seances || (Array.isArray(response.data) ? response.data : [response.data]);

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"];
      const newScheduleData = {
        Monday: {},
        Tuesday: {},
        Wednesday: {},
        Thursday: {},
        Saturday: {},
        Sunday: {},
      };

      const skippedSeances = [];
      seances.forEach((item, index) => {
        const { id, day, startTime, endTime, module, teacherId, location, type, group } = item.Seance || {};
        const { firstName, lastName } = item.User || {};

        // Normalize day to match days array (case-insensitive)
        const formattedDay = day && typeof day === 'string'
          ? day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
          : null;

        // Validate time slot
        const timeSlot = startTime && endTime && typeof startTime === 'string' && typeof endTime === 'string'
          ? (() => {
              try {
                const formattedStart = startTime.slice(0, 5).replace(/^0/, '');
                const formattedEnd = endTime.slice(0, 5).replace(/^0/, '');
                const slot = `${formattedStart}-${formattedEnd}`;
                return timeSlots.includes(slot) ? slot : null;
              } catch (error) {
                console.error(`Error formatting time slot for seance ${index}:`, error);
                return null;
              }
            })()
          : null;

        console.log(`Processing seance ${index}: Day=${formattedDay || 'Invalid'}, Time=${timeSlot || 'Invalid'}, Module=${module || 'N/A'}`);

        if (formattedDay && timeSlot && days.includes(formattedDay) && timeSlots.includes(timeSlot)) {
          newScheduleData[formattedDay][timeSlot] = newScheduleData[formattedDay][timeSlot] || [];
          newScheduleData[formattedDay][timeSlot].push({
            id, // Include seance ID
            module: module || 'N/A',
            teacherId: teacherId || null,
            teacherName: `${firstName || 'N/A'} ${lastName || ''}`.trim(),
            location: location || 'N/A',
            type: type || 'N/A',
            group: group || 'N/A',
          });
        } else {
          console.warn(`Skipping seance ${index}: Invalid day (${formattedDay}) or time slot (${timeSlot})`);
          skippedSeances.push({ index, day: formattedDay, time: timeSlot });
        }
      });

      if (skippedSeances.length > 0) {
        showNotification(`Skipped ${skippedSeances.length} invalid seance(s)`, 'warning');
      }

      console.log('Updated scheduleData:', newScheduleData);
      setScheduleData(newScheduleData);
    } catch (err) {
      console.error('Failed to fetch seances:', err);
      setNotification({ show: true, message: 'Failed to fetch seances', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSeances();
  }, [schedule.id, refreshTrigger]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const calculateRowHeight = (time) => {
    const hasMultipleSessions = days.some(
      (day) => (scheduleData[day]?.[time]?.length || 0) > 1
    );
    return hasMultipleSessions ? "auto" : "8rem";
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    onViewModeChange('planning-add');
  };

  const handleEditClick = (day, time, index) => {
    const session = scheduleData[day]?.[time]?.[index];
    if (session) {
      setEditingSession({
        day,
        time,
        index,
        id: session.id, // Pass seance ID
        teacherId: session.teacherId, // Pass teacher ID
      });
      setShowEditForm(true);
      setShowAddForm(false);
      onViewModeChange('planning-edit');
    }
  };

  const handleSaveSession = (formData, message, type, closeForm) => {
    if (!formData) {
      showNotification(message, type);
      return;
    }

    showNotification(message, type);
    if (closeForm) {
      setShowAddForm(false);
      setShowEditForm(false);
      onViewModeChange('planning');
    }
  };

  const handleRemoveSession = () => {
    const { day, time, index } = editingSession;

    setScheduleData((prev) => {
      const updatedSessions = prev[day][time].filter((_, idx) => idx !== index);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [time]: updatedSessions.length ? updatedSessions : undefined,
        },
      };
    });

    showNotification("Seance removed successfully!", "success");
    setShowEditForm(false);
    onViewModeChange('planning');
    setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  return (
    <div className="max-w-7xl mx-auto">
      {notification.show && (
        <div
          className={`rounded-md p-3 border mb-6 ${
            notification.type === "success"
              ? "bg-green-50 border-green-100"
              : "bg-red-50 border-red-100"
          }`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`flex-shrink-0 h-5 w-5 mr-2 ${
                notification.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            />
            <p className="text-sm font-medium text-gray-700">{notification.message}</p>
          </div>
        </div>
      )}
      {(showAddForm || showEditForm) ? (
        <>
          {showAddForm && (
            <AddSessionForm
              days={days}
              timeSlots={timeSlots}
              onSave={handleSaveSession}
              scheduleId={schedule.id}
              onClose={() => {
                setShowAddForm(false);
                onViewModeChange('planning');
              }}
              onSessionAdded={() => setRefreshTrigger((prev) => prev + 1)} // Trigger re-fetch
            />
          )}
          {showEditForm && editingSession && (
            <EditSessionForm
              scheduleId={schedule.id} // Pass schedule ID
              seanceId={editingSession.id} // Pass seance ID
              teacherId={editingSession.teacherId} // Pass teacher ID
              onRemove={handleRemoveSession}
            />
          )}
        </>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="block text-xl font-semibold">
                Weekly Planning for {schedule.promotion} - {schedule.semester}
              </span>
              <div className="text-sm text-gray-600 mt-1">
                <span>Educational Year: {schedule.educationalYear || 'N/A'}</span>
                <span className="mx-2">|</span>
                <span>Start Date: {schedule.startDate || 'N/A'}</span>
                <span className="mx-2">|</span>
                <span>End Date: {schedule.endDate || 'N/A'}</span>
              </div>
            </div>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Seance
            </button>
          </div>
          <div className="inline-block min-w-full align-middle border border-gray-200 rounded-lg">
            <div className="grid grid-flow-col auto-cols-fr">
              <div className="w-51 h-14 flex items-center justify-center bg-gray-50 border-r border-b border-gray-200 sticky left-0 z-10">
                <span className="font-medium text-gray-600">Time/Day</span>
              </div>
              {days.map((day) => (
                <div
                  key={day}
                  className="min-w-32 h-14 flex items-center justify-center bg-gray-50 font-medium text-gray-700 border-b border-r border-gray-200"
                >
                  {day}
                </div>
              ))}
            </div>

            {timeSlots.map((time) => {
              const rowHeight = calculateRowHeight(time);
              const hasMultipleSessions = days.some(
                (day) => (scheduleData[day]?.[time]?.length || 0) > 1
              );

              return (
                <div
                  key={time}
                  className="grid grid-flow-col auto-cols-fr"
                  style={{ minHeight: rowHeight }}
                >
                  <div
                    className={`w-51 flex items-center justify-center bg-gray-50 font-medium text-gray-700 border-r border-b border-gray-200 sticky left-0 z-10 ${
                      hasMultipleSessions ? "pt-2" : "items-center"
                    }`}
                  >
                    {time}
                  </div>
                  {days.map((day) => {
                    const sessions = scheduleData[day]?.[time] || [];
                    const bgColor = sessions.length ? "bg-gray-50" : "bg-white";

                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`min-w-32 p-2 flex flex-col border-b border-r border-gray-200 ${bgColor} ${
                          hasMultipleSessions ? "space-y-1" : "justify-center"
                        }`}
                      >
                        {sessions.length === 0 && (
                          <div className="text-gray-400 text-xs"></div>
                        )}
                        {sessions.map((session, index) => (
                          <div
                            key={index}
                            onClick={() => handleEditClick(day, time, index)}
                            className="p-2 rounded text-xs bg-blue-400 bg-opacity-30 hover:bg-blue-300 cursor-pointer"
                          >
                            <div className="font-medium truncate">{session.module}</div>
                            <div className="truncate">Teacher: {session.teacherName}</div>
                            <div className="truncate">Type: {session.type}</div>
                            <div className="truncate">Group: {session.group}</div>
                            <div className="truncate">Room: {session.location}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;