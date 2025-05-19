import { useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { DropdownControllerProps } from '../../utils/types';

const DropdownController: React.FC<{ metaData: DropdownControllerProps }> = ({
  metaData
}) => {
  const {
    key,
    options,
    name,
    // label,
    placeholder = 'Select',
    defaultValue,
    isRequired = false,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500 text-[10px]  my-1',
    fieldClass = 'border p-2',
    // wrapperClass = "flex flex-col mb-4",
    icon,
    hideLabel = false
  } = metaData;
  const {
    control,
    formState: { errors },
    trigger
  } = useFormContext();
  const [disabled, setIsDisabled] = useState(false);

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  return (
    <div className="relative rounded-lg bg-white">
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
            <select
              {...field}
              id={name}
              disabled={isDisabled}
              className={`${fieldClass}`}
              onChange={e => {
                setIsDisabled(true);
                field.onChange(e.target.value);
                trigger(name);
              }}
              style={{ paddingLeft: '2rem' }}
            >
              {!disabled && <option key={key}>{placeholder}</option>}
              {options?.map(item => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>

            {!hideLabel ? (
              <label
                htmlFor={name}
                className={` ${field.value ? '-top-2 text-sm' : 'top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm'} ${labelClass} `}
              >
                {placeholder}
                {isRequired && <span className="text-red-500">{' *'}</span>}
              </label>
            ) : null}
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

export default DropdownController;
