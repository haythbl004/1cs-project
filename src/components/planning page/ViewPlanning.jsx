import { useState, useEffect } from "react";
import axios from "axios";

const ViewPlanning = ({ sessionId }) => {
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
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch sessions on mount
  const fetchSessions = async () => {
    try {
      console.log(`Fetching sessions for sessionId: ${sessionId}`);
      const response = await axios.get(`http://localhost:3000/api/schedule/sessions/${sessionId}/seances`);
      const sessions = Array.isArray(response.data) ? response.data : [response.data];
      console.log('Fetched sessions:', sessions);

      const newScheduleData = {
        Monday: {},
        Tuesday: {},
        Wednesday: {},
        Thursday: {},
        Saturday: {},
        Sunday: {},
      };

      sessions.forEach((item, index) => {
        const { day, startTime, endTime, module, teacherId, location, type, group } = item.Seance || {};
        const { firstName, lastName } = item.User || {};
        const formattedDay = day ? day.charAt(0).toUpperCase() + day.slice(1) : '';
        const timeSlot = startTime && endTime ? `${startTime.slice(0, 5).replace(/^0/, '')}-${endTime.slice(0, 5).replace(/^0/, '')}` : '';

        console.log(`Processing session ${index}: Day=${formattedDay}, Time=${timeSlot}, Module=${module}`);

        if (days.includes(formattedDay) && timeSlots.includes(timeSlot)) {
          newScheduleData[formattedDay][timeSlot] = newScheduleData[formattedDay][timeSlot] || [];
          newScheduleData[formattedDay][timeSlot].push({
            module,
            teacherId,
            teacherName: `${firstName || 'N/A'} ${lastName || ''}`.trim(),
            location,
            type,
            group,
          });
        } else {
          console.warn(`Skipping session ${index}: Invalid day (${formattedDay}) or time slot (${timeSlot})`);
        }
      });

      console.log('Updated scheduleData:', newScheduleData);
      setScheduleData(newScheduleData);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setNotification({ show: true, message: 'Failed to fetch sessions', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [sessionId]);

  const calculateRowHeight = (time) => {
    const hasMultipleSessions = days.some(
      (day) => (scheduleData[day]?.[time]?.length || 0) > 1
    );
    return hasMultipleSessions ? "auto" : "8rem";
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-gray-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Weekly Planning</span>
        </div>
        <div className="inline-block min-w-full align-middle border border-gray-200 rounded-lg">
          <div className="grid grid-flow-col auto-cols-fr">
            <div className="w-48.5 h-14 flex items-center justify-center bg-gray-50 border-r border-b border-gray-200 sticky left-0 z-10">
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
                  className={`w-48.5 flex items-center justify-center bg-gray-50 font-medium text-gray-700 border-r border-b border-gray-200 sticky left-0 z-10 ${
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
                          className="p-2 rounded text-xs bg-blue-400 bg-opacity-30"
                        >
                          <div className="font-medium truncate">{session.module}</div>
                          <div className="truncate">Teacher: {session.teacherName}</div>
                          <div className="truncate">Type: {session.type}</div>
                          <div className="truncate">Group: {session.group}</div>
                          <div className="truncate text-gray-500">Location: {session.location}</div>
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
    </div>
  );
};

export default ViewPlanning;