import { useEffect, useState } from 'react';

const useCheckboxFilter = initialState => {
  const [filters, setFilters] = useState(initialState);

  useEffect(() => {
    setFilters(initialState); // Sync state with new initial filters when they change
  }, [initialState]);

  const handleCheckboxChange = (type, id, checked) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: checked
        ? [...prevFilters[type], id]
        : prevFilters[type].filter(item => item !== id)
    }));
  };

  const isCheckboxChecked = (type, id) => filters[type]?.includes(id) || false;

  return {
    filters,
    handleCheckboxChange,
    isCheckboxChecked
  };
};

export default useCheckboxFilter;
