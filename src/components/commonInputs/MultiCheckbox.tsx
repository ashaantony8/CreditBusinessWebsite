import React, { useEffect } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { MultiCheckBoxControllerProps } from '../../utils/types';

const MultiCheckBoxController: React.FC<{
  metaData: MultiCheckBoxControllerProps;
}> = ({ metaData }) => {
  const {
    name,
    label,
    options,
    isRequired = false,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    fieldClass = 'border p-2 ',
    wrapperClass = ' mb-4',
    optionLabelClass = 'text-[#00000]',
    icon
  } = metaData;

  const {
    control,
    formState: { errors }
  } = useFormContext();

  useEffect(() => {}, [errors]);

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  return (
    <div>
      <div
        className={` ${wrapperClass} ${
          fieldError && 'w-[100%] border-b-2 border-red-500'
        }`}
      >
        {' '}
        <div>
          <label htmlFor={name} className={labelClass}>
            {icon && icon()} {label}{' '}
            {isRequired && <span style={{ color: 'red' }}>{' *'}</span>}
          </label>
        </div>
        <div className="flex">
          {options.map(option => (
            <div
              key={`${name}.${option.key}`}
              className="ml-8 mr-4 mt-1 flex items-center"
            >
              <Controller
                name={`${name}.${option.key}`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id={`${name}.${option.key}`}
                    type="checkbox"
                    defaultChecked={field.value}
                    value={field.value}
                    disabled={isDisabled}
                    className={fieldClass}
                  />
                )}
              />

              <label
                htmlFor={`${name}.${option.key}`}
                className={optionLabelClass}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {fieldError?.[Object.keys(fieldError)[0]] && (
        <p className={errorClass}>
          {(fieldError[Object.keys(fieldError)[0]] as FieldError)?.message}
        </p>
      )}
    </div>
  );
};

export default MultiCheckBoxController;
