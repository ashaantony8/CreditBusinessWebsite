// SearchBar.jsx
import { useCallback, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

import { debounce } from '../../../utils/hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce(value => onSearch(value)),
    [onSearch]
  );

  return (
    <div className="relative">
      <input
        className="focus:shadow-outline w-full appearance-none border-2 border-gray-300 px-4 py-3 pl-10 text-[12px] font-light leading-tight text-gray-800 transition-colors hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="absolute inset-y-0 left-0 flex items-center">
        <RiSearchLine className="ml-3 h-5 w-5 text-gray-400 hover:text-gray-500" />
      </div>
    </div>
  );
};

export default SearchBar;
