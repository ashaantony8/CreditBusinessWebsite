import { useEffect, useState } from 'react';

import useCheckboxFilter from './useFilter'; // Ensure the path is correct

const Filter = ({
  closeFilterHandler,
  isOpen,
  onFilterChange,
  initialFilters,
  dropdownData
}) => {
  const {
    filters: selectedFilters,
    handleCheckboxChange,
    isCheckboxChecked
  } = useCheckboxFilter(initialFilters);

  const handleApplyFilters = () => {
    onFilterChange(selectedFilters); // Pass selected filters to parent component
    closeFilterHandler();
  };

  useEffect(() => {
    const handleOutsideClick = event => {
      if (isOpen && !event.target.closest('#filter-icon')) {
        closeFilterHandler();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, closeFilterHandler]);

  // const [_, setFilterLength] = useState(1);

  useEffect(() => {
    Math.max(...dropdownData.map(dropdown => dropdown.items.length));
    // setFilterLength(maxLength);
  }, [dropdownData]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(
    Array(dropdownData.length).fill(false)
  );

  const handleToggleDropdown = index => {
    setIsDropdownOpen(prevState =>
      prevState.map((open, i) => (i === index ? !open : open))
    );
  };

  const calculateHeight = items => {
    const maxHeight = 140;
    const itemHeight = 25;
    const calculatedHeight = items.length * itemHeight;
    return `${calculatedHeight < maxHeight ? calculatedHeight : maxHeight}px`;
  };

  return (
    <div
      className={`ounded-md border-dimmed absolute top-full z-50 mt-2 min-w-[250px] -translate-x-1/2 transform overflow-hidden overflow-y-scroll border bg-gray-100 text-xs shadow-lg max-sm:min-w-[200px] md:text-sm ${
        isOpen ? 'block' : 'hidden'
      }`}
      // style={{
      //   height: `${Math.min((filterLength * 80), 360)}px`
      // }}
    >
      <div className="flex h-full flex-col">
        <ul className="mx-auto flex w-full flex-grow flex-col gap-2 overflow-y-auto">
          {dropdownData.map((dropdown, index) => (
            <li key={index}>
              <details
                className="group"
                open={isDropdownOpen[index]} // control the open state dynamically
                onToggle={() => handleToggleDropdown(index)} // function to toggle open state
              >
                <summary className="flex items-center justify-between gap-2 bg-white p-2 font-medium marker:content-none hover:cursor-pointer">
                  <span className="flex gap-2">{dropdown.title}</span>
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      isDropdownOpen[index] ? 'rotate-90' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </summary>
                <div
                  className={`px-4 pb-4 transition-all duration-300 ${
                    isDropdownOpen[index]
                      ? `h-[${calculateHeight(dropdown.items)}]`
                      : 'h-0'
                  } overflow-y-scroll`}
                >
                  {dropdown.items.map(item => (
                    <Checkbox
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      checked={isCheckboxChecked(dropdown.type, item.id)}
                      onChange={() =>
                        handleCheckboxChange(
                          dropdown.type,
                          item.id,
                          !isCheckboxChecked(dropdown.type, item.id)
                        )
                      }
                    />
                  ))}
                </div>
              </details>
            </li>
          ))}
        </ul>
        <button
          className="bg-[#1A439A] py-2 text-center font-medium text-white hover:bg-blue-800"
          onClick={handleApplyFilters}
        >
          {'Apply'}
        </button>
      </div>
    </div>
  );
};

const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex cursor-pointer items-center gap-2 py-1">
      <input
        type="checkbox"
        id={id}
        className="mr-2"
        onChange={onChange}
        checked={checked}
      />
      <label onClick={() => onChange(id)} className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default Filter;
