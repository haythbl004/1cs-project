import { useState } from 'react';

const Dropdown = ({ label, options, selectedValue, onChange, className = '', disabled = false, placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        <button
          type="button"
          className={`w-full border border-gray-300 rounded-md py-2 px-3 text-left bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'
          } ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          style={{ minWidth: '200px' }} // Ensure consistent width
        >
          <span className="block truncate">
            {selectedValue ? selectedValue.name : placeholder}
          </span>
        </button>
        {isOpen && !disabled && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.id}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-gray-900"
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;