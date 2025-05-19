import React, { useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import eye from '../../assets/svg/eye.svg';
import eyeClose from '../../assets/svg/eye-close.svg';
import { InputControllerProps } from '../../utils/types';

const PasswordController: React.FC<{ metaData: InputControllerProps }> = ({
  metaData
}) => {
  const {
    key,
    name,
    placeholder,
    type,
    isRequired = false,
    defaultValue,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    fieldClass = 'border p-2 pl-10',
    // wrapperClass = "flex flex-col mb-4 relative",
    min,
    max,
    icon
  } = metaData;

  const {
    control,
    formState: { errors },
    setValue,
    trigger
  } = useFormContext();

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle show/hide password state
  };

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
              key={key}
              id={name}
              {...field}
              placeholder=" "
              type={showPassword ? 'text' : type}
              disabled={isDisabled}
              className={`${fieldClass} border focus:outline-0 ${!isDisabled && 'border-[#1a459a33]'} peer focus-within:border-[#1A449A] ${
                fieldError && 'border-2 border-red-500'
              }`}
              min={min}
              max={max}
              onChange={e => {
                setValue(name, e.target.value);
                trigger(name);
              }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <div className="w-6 pr-2 text-gray-400">
                  <img src={eye} />
                </div>
              ) : (
                <div className="w-6 pr-2 text-gray-400">
                  <img src={eyeClose} />
                </div>
              )}
            </span>
            {/* {icon && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500">
                {icon()}
              </div>
            )} */}
            <label htmlFor={name} className={`${labelClass} `}>
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

export default PasswordController;
