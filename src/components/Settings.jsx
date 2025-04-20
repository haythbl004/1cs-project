import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GradeSettings from './GradeSettings';
import HolidaySettings from './HolidaySettings';
import CoefficientSettings from './CoefficientSettings';
import PromotionSettings from './PromotionSettings';
import SpecialitySettings from './SpecialitySettings';
import {
  faShieldAlt,
  faChartLine,
  faCalculator,
  faUmbrellaBeach,
  faStar
} from '@fortawesome/free-solid-svg-icons';


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('speciality');

  const renderContent = () => {
    switch (activeTab) {
      case 'speciality':
        return <SpecialitySettings />;
      case 'promotion':
        return <PromotionSettings />;
      case 'coefficient':
        return <CoefficientSettings />;
      case 'holiday':
        return <HolidaySettings />;
      case 'grade':
        return <GradeSettings />;
      default:
        return <SpecialitySettings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* White Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <SidebarItem
              active={activeTab === 'speciality'}
              onClick={() => setActiveTab('speciality')}
              icon={<FontAwesomeIcon icon={faShieldAlt} />}
              text="Speciality"
            />
            <SidebarItem
              active={activeTab === 'promotion'}
              onClick={() => setActiveTab('promotion')}
              icon={<FontAwesomeIcon icon={faChartLine} />}
              text="Promotion"
            />
            <SidebarItem
              active={activeTab === 'coefficient'}
              onClick={() => setActiveTab('coefficient')}
              icon={<FontAwesomeIcon icon={faCalculator} />}
              text="Coefficient"
            />
            <SidebarItem
              active={activeTab === 'holiday'}
              onClick={() => setActiveTab('holiday')}
              icon={<FontAwesomeIcon icon={faUmbrellaBeach} />}
              text="Holiday"
            />
            <SidebarItem
              active={activeTab === 'grade'}
              onClick={() => setActiveTab('grade')}
              icon={<FontAwesomeIcon icon={faStar} />}
              text="Grade"
            />
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        {renderContent()}
      </div>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, text }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-md transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className={`mr-3 ${active ? 'text-blue-500' : 'text-gray-500'}`}>
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </button>
  </li>
);
export default SettingsPage;