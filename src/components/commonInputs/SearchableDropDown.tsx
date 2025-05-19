import React, { useEffect, useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { DropdownControllerProps } from '../../utils/types';

const SearchableDropdownController: React.FC<{
  metaData: DropdownControllerProps;
}> = ({ metaData }) => {
  const {
    // key,
    options,
    name,
    placeholder = 'Select',
    defaultValue,
    isRequired = false,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500 text-[10px]  my-1',
    fieldClass = 'border p-2',
    icon,
    onChange,
    onSelected
  } = metaData;

  const {
    control,
    formState: { errors },
    trigger
  } = useFormContext();

  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleInputChange = async e => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    if (onChange) {
      await onChange(value);
    }
    trigger(name);
  };

  const handleSelect = value => {
    setInputValue(value);
    setShowSuggestions(false);
    if (onSelected) {
      onSelected(value);
    }
    trigger(name);
  };

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  return (
    <div className="rounded-lg bg-white">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div className="relative bg-inherit">
            {icon && (
              <span className="absolute bottom-3 left-1 px-1 text-[#737373]">
                {icon()}
              </span>
            )}
            <input
              {...field}
              id={name}
              disabled={isDisabled}
              className={`${fieldClass} w-full`}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder}
              style={{ paddingLeft: icon ? '2rem' : undefined }}
              autoComplete="off"
            />
            {showSuggestions && (
              <ul className="absolute left-0 right-0 z-20 max-h-40 overflow-y-auto border border-gray-300 bg-white">
                {filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 text-[10px] hover:bg-gray-200"
                    onClick={() => handleSelect(option.id)}
                  >
                    {option.id}
                  </li>
                ))}
                {filteredOptions.length === 0 && (
                  <li className="p-2">{'No options found'}</li>
                )}
              </ul>
            )}
            <label
              htmlFor={name}
              className={` ${inputValue ? '-top-3 text-sm' : 'top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm'} ${labelClass} `}
            >
              {placeholder}
              {isRequired && <span className="text-red-500">{' *'}</span>}
            </label>
          </div>
        )}
      />
      {fieldError && (
        <p className={errorClass}>
          {fieldError ? (fieldError as FieldError)?.message : ''}
        </p>
      )}
    </div>
  );
};

export default SearchableDropdownController;
