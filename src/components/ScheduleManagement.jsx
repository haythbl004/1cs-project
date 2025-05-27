import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faAngleRight } from '@fortawesome/free-solid-svg-icons';

// Import required components
import ScheduleList from './planning pages/ScheduleList';
import ScheduleAdd from './planning pages/ScheduleAdd';
import ScheduleEdit from './planning pages/ScheduleEdit';
import Planning from './planning pages/Planning';

const ScheduleManagement = ({ user, setUser }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit', 'planning', 'planning-add', 'planning-edit'
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setErrorMessage('Unauthorized access. Admin role required.');
    }
  }, [user]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleAddSchedule = () => {
    setViewMode('add');
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setViewMode('edit');
  };

  const handleViewPlanning = (schedule) => {
    setSelectedSchedule(schedule);
    setViewMode('planning');
  };

  const handlePlanningViewModeChange = (mode) => {
    setViewMode(mode); // Update viewMode for 'planning', 'planning-add', or 'planning-edit'
  };

  const renderBreadcrumb = () => {
    const modes = {
      list: 'Schedule List',
      add: 'Add Schedule',
      edit: 'Edit Schedule',
      planning: 'Planning Management',
      'planning-add': 'Add',
      'planning-edit': 'Edit',
    };

    return (
      <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600" />
        <button
          onClick={() => setViewMode('list')}
          className="hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          Schedule Management
        </button>
        {viewMode !== 'list' && (
          <>
            <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-500" />
            {(viewMode === 'planning' || viewMode === 'planning-add' || viewMode === 'planning-edit') && (
              <>
                <button
                  onClick={() => {
                    setViewMode('planning');
                    setShowAddForm(false);
                    setShowEditForm(false);
                  }}
                  className="hover:text-blue-600 transition-colors hover:cursor-pointer"
                >
                  Planning Management
                </button>
                {(viewMode === 'planning-add' || viewMode === 'planning-edit') && (
                  <>
                    <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-500" />
                    <span>{modes[viewMode]}</span>
                  </>
                )}
              </>
            )}
            {viewMode !== 'planning' && viewMode !== 'planning-add' && viewMode !== 'planning-edit' && (
              <span>{modes[viewMode]}</span>
            )}
          </>
        )}
      </div>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6">
        {renderBreadcrumb()}
        <div className="rounded-md bg-red-50 p-3 border border-red-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="flex-shrink-0 h-5 w-5 text-red-500 mr-2"
            />
            <p className="text-sm font-medium text-gray-700">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {renderBreadcrumb()}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-3 border border-red-100 mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="flex-shrink-0 h-5 w-5 text-red-500 mr-2"
            />
            <p className="text-sm font-medium text-gray-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schedule List</h2>
            <button
              onClick={handleAddSchedule}
              className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Schedule
            </button>
          </div>
          <ScheduleList
            user={user}
            setUser={setUser}
            onEditSchedule={handleEditSchedule}
            onViewPlanning={handleViewPlanning}
          />
        </div>
      )}

      {viewMode === 'add' && (
        <ScheduleAdd user={user} setUser={setUser} />
      )}

      {viewMode === 'edit' && selectedSchedule && (
        <ScheduleEdit
          scheduleId={selectedSchedule.id}
          scheduleinfo={selectedSchedule}
          setViewMode={setViewMode}
        />
      )}

      {(viewMode === 'planning' || viewMode === 'planning-add' || viewMode === 'planning-edit') && selectedSchedule && (
        <Planning
          user={user}
          setUser={setUser}
          schedule={selectedSchedule}
          onViewModeChange={handlePlanningViewModeChange}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;