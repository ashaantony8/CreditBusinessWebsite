import 'react-datepicker/dist/react-datepicker.css';

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import date from '../../../assets/svg/system-uicons_calendar-date.svg';
import { loanFormCommonStyleConstant } from '../../../utils/constants';
import {
  getStayExcludeDateIntervals,
  lookUpAddressFormatter
} from '../../../utils/helpers';
import AddressLookup from '../AddressLookup';
import { getStayArray } from './StayArray';

const StayDetailsField = ({
  // fields,
  watch,
  currentDateRange,
  currentStayIndex,
  openDirectorIndex,
  partnerType,
  currentDirectorIndex,
  control,
  getValues,
  setValue,
  trigger,
  formState,
  methods,
  fieldRenderer,
  forceRerender
}) => {
  const currentDate = new Date();
  const prevThreeYearDate = new Date();

  prevThreeYearDate.setFullYear(currentDate.getFullYear() - 3);
  // const lastStayIndex = fields.length - 1;

  // const watchedStartDate = useWatch({
  //   control,
  //   name: `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`, // Watch the specific field
  // });

  const [stayError, setStayError] = useState(null);
  const [address, setAddress] = useState(undefined);

  const stayArrayConst = getStayArray(
    partnerType,
    currentDirectorIndex,
    currentStayIndex
  );

  fieldRenderer.updateConstant([
    ...fieldRenderer.getConstant(),
    ...stayArrayConst
  ]);

  const handleStartDateChange = () => {
    trigger(
      `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`
    );
    forceRerender();
  };

  const handleEndDateChange = currentStayIndex => {
    // Get all stay fields for the current director from the form
    const currentStayFields = getValues(
      `${partnerType}[${currentDirectorIndex}].stay`
    );

    // Compute the new excludeDateIntervals based on the updated stay data
    const excludeDateIntervals = getStayExcludeDateIntervals(
      currentStayFields,
      currentStayIndex
    );

    // Update the excludeDateIntervals in the form state
    setValue(
      `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].excludeDateIntervals`,
      excludeDateIntervals
    );

    // Optionally trigger validation if needed
    trigger(
      `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`
    );
    forceRerender();
  };

  useEffect(() => {
    if (address) {
      const lookedUpData = lookUpAddressFormatter(address);
      setValue(
        `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].pincode`,
        lookedUpData.pincode
      );
      setValue(
        `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].address`,
        lookedUpData.addressText
      );
      trigger(
        `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].address`
      );
    }
  }, [address]);

  useEffect(() => {
    setStayError(
      formState.errors?.directors &&
        formState.errors.directors[currentDirectorIndex]?.stay &&
        formState.errors.directors[currentDirectorIndex].stay[currentStayIndex]
        ? formState.errors.directors[currentDirectorIndex].stay[
            currentStayIndex
          ]
        : null
    );
  }, [formState]);

  {
    console.log(
      'inside stay details form',
      `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`
    );
  }

  return (
    <div>
      <div
        key={currentStayIndex}
        style={{
          display: openDirectorIndex === currentStayIndex ? 'block ' : 'none'
        }}
      >
        <div className="grid gap-4 py-6 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="">
            <div className="relative bg-inherit">
              <div className="rounded-lg bg-white">
                <Controller
                  name={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="relative bg-inherit">
                        <div className="absolute bottom-3 left-1 px-1 text-[#737373]">
                          <img src={date} className="w-6 pr-1 text-gray-400" />
                        </div>
                        <DatePicker
                          {...field}
                          selected={field.value}
                          onChange={date => {
                            field.onChange(date); // Update end_date in the form
                            handleEndDateChange(currentStayIndex); // Custom function to handle date updates
                          }} // Call field.onChange to update the form state
                          selectsEnd
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          wrapperClassName="w-full"
                          startDate={currentDateRange.start_date} // Assuming currentDateRange is properly updated
                          endDate={field.value}
                          excludeDateIntervals={
                            currentDateRange.excludeDateIntervals
                          }
                          placeholderText="Select end date"
                          className={
                            loanFormCommonStyleConstant.date.fieldClass
                          }
                          // minDate={currentDateRange.start_date}
                          maxDate={currentDateRange.start_date}
                          disabled={true} // Disabled if it's not the last stay index
                        />
                        <label
                          htmlFor={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`}
                          className={
                            loanFormCommonStyleConstant.date.labelClass
                          }
                        >
                          {'To date / end'}
                        </label>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            {stayError?.end_date && (
              <p className={loanFormCommonStyleConstant.date.errorClass}>
                {stayError?.end_date.message || ''}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-white">
            <div className="relative bg-inherit">
              <div className="rounded-lg bg-white">
                <Controller
                  name={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`}
                  control={control}
                  render={({ field }) => (
                    <div className="relative bg-inherit">
                      <div className="absolute bottom-3 left-1 px-1 text-[#737373]">
                        <img src={date} className="w-6 pr-1 text-gray-400" />
                      </div>
                      <DatePicker
                        {...field}
                        selected={field.value ? new Date(field.value) : null}
                        selectsStart
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        onChange={date => {
                          field.onChange(date);
                          handleStartDateChange();
                        }}
                        startDate={field.value}
                        endDate={currentDateRange.end_date}
                        excludeDateIntervals={
                          currentDateRange.excludeDateIntervals
                        }
                        placeholderText="Select start date"
                        className={loanFormCommonStyleConstant.date.fieldClass}
                        maxDate={currentDateRange.end_date}
                        //disable start date picking  except for first one
                        // disabled={currentStayIndex != 0}
                        wrapperClassName="w-full "
                      />
                      <label
                        htmlFor={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`}
                        className={loanFormCommonStyleConstant.date.labelClass}
                      >
                        {'Start date / from'}
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
            {stayError?.start_date && (
              <p className={loanFormCommonStyleConstant.date.errorClass}>
                {stayError?.start_date.message || ''}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="">
            <AddressLookup
              setAddress={setAddress}
              value={watch(
                `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].pincode`,
                ''
              )}
              methods={methods}
              pincodeKey={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].pincode`}
              error={stayError?.pincode}
            />
          </div>
          <div className=" ">
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].address`
            ])}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 py-6">
          {' '}
          <div className="flex gap-2 p-1">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'Property ?'}
            </a>
          </div>
          <div className=" ">
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].house_ownership`
            ])}
          </div>{' '}
        </div>
      </div>
    </div>
  );
};

export default StayDetailsField;
