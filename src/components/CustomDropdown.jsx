import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCheck } from '@fortawesome/free-solid-svg-icons';

const CustomDropdown = ({ label, options, selectedValue, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-2" ref={dropdownRef}>
        <button
          type="button"
          className="flex w-full items-center border border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`listbox-label-${name}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex-1 text-left truncate">{selectedValue?.name || `Select ${label}`}</span>
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="ml-2 size-5 text-gray-500 sm:size-4"
          />
        </button>
        {isOpen && (
          <ul
            className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
            role="listbox"
            aria-labelledby={`listbox-label-${name}`}
          >
            {options.map((option) => (
              <li
                key={option.id}
                className={`relative cursor-default py-2 pr-9 pl-3 select-none ${
                  selectedValue?.id === option.id ? 'bg-blue-200 text-black' : 'text-gray-900'
                }`}
                role="option"
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center">
                  <span
                    className={`ml-3 block truncate ${
                      selectedValue?.id === option.id ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {option.name}
                  </span>
                </div>
                {selectedValue?.id === option.id && (
                  <span
                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                      selectedValue?.id === option.id ? 'text-white' : 'text-blue-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCheck} className="size-5 text-black" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;