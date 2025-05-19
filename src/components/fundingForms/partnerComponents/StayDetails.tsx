import 'react-datepicker/dist/react-datepicker.css';

import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import date from '../../../assets/svg/system-uicons_calendar-date.svg';
import { loanFormCommonStyleConstant } from '../../../utils/constants';
import {
  getStayExcludeDateIntervals,
  lookUpAddressFormatter,
  StayContext
} from '../../../utils/helpers';
import AddressLookup from '../AddressLookup';
import { getStayArray } from './StayArray';

const StayDetails = ({
  currentStayIndex,
  currentDirectorIndex,
  fieldRenderer,
  partnerType,
  currentStay,
  openDirectorIndex
}) => {
  const { dateRanges, setDateRanges, methods } = useContext(StayContext);
  const [address, setAddress] = useState(undefined);
  const [stayError, setStayError] = useState(null);

  const { control, trigger, watch, setValue, formState } = methods;

  const currentDate = new Date();
  const prevThreeYearDate = new Date();

  prevThreeYearDate.setFullYear(currentDate.getFullYear() - 3);

  const stayArrayConst = getStayArray(
    partnerType,
    currentDirectorIndex,
    currentStayIndex
  );

  fieldRenderer.updateConstant([
    ...fieldRenderer.getConstant(),
    ...stayArrayConst
  ]);

  //setting address against each period of date
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

  const [currentStayDate, setCurrentStayDate] = useState(
    (currentStay?.end_date && new Date(currentStay?.end_date)) || undefined
  );

  const [currentStayStartDate, setCurrentStayStartDate] = useState(
    (currentStay?.start_date && new Date(currentStay?.start_date)) || undefined
  );

  useEffect(() => {
    if (currentStayDate) {
      handleEndDateChange(currentStayDate);
    }
  }, [currentStayDate]);

  useEffect(() => {
    if (currentStayStartDate) {
      handleStartDateChange(currentStayStartDate);
    }
  }, [currentStayStartDate]);

  const handleStartDateChange = date => {
    const newDateRanges = [...dateRanges];
    setValue(
      `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`,
      date,
      { shouldValidate: true }
    );
    newDateRanges[currentDirectorIndex][currentStayIndex].start_date = date;
    const excludeDateIntervals = getStayExcludeDateIntervals(
      newDateRanges[currentDirectorIndex],
      currentStayIndex
    );
    newDateRanges[currentDirectorIndex][currentStayIndex].excludeDateIntervals =
      excludeDateIntervals;
    setDateRanges(newDateRanges);
  };

  const handleEndDateChange = date => {
    const newDateRanges = [...dateRanges];
    setValue(
      `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`,
      date,
      { shouldValidate: true }
    );
    newDateRanges[currentDirectorIndex][currentStayIndex].end_date = date;
    const excludeDateIntervals = getStayExcludeDateIntervals(
      newDateRanges[currentDirectorIndex],
      currentStayIndex
    );
    newDateRanges[currentDirectorIndex][currentStayIndex].excludeDateIntervals =
      excludeDateIntervals;
    setDateRanges(newDateRanges);
  };

  //   sets error
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

  const lastStayIndex = dateRanges[currentDirectorIndex].length - 1;
  const currentDateRange = dateRanges[currentDirectorIndex][currentStayIndex];

  return (
    <>
      <div
        key={currentStayIndex}
        style={{
          display: openDirectorIndex === currentStayIndex ? 'block ' : 'none'
        }}
      >
        <div className="grid gap-4 py-6 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="rounded-lg bg-white">
            <div className="relative bg-inherit">
              <div className="absolute bottom-3 left-1 px-1 text-[#737373]">
                <img src={date} className="w-6 pr-1 text-gray-400" />
              </div>
              <label
                className={loanFormCommonStyleConstant.date.labelClass}
              ></label>
              <Controller
                name={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={currentDateRange.start_date}
                    selectsStart
                    onChange={date => setCurrentStayStartDate(date)}
                    startDate={currentDateRange.start_date}
                    endDate={currentDateRange.end_date}
                    excludeDateIntervals={currentDateRange.excludeDateIntervals}
                    placeholderText="Select start date"
                    className={loanFormCommonStyleConstant.date.fieldClass}
                    //   minDate={currentStayIndex === 0 ?  prevThreeYearDate : null}
                    maxDate={currentStayIndex === 0 ? prevThreeYearDate : null}
                    //disable start date picking  except for first one
                    disabled={currentStayIndex != 0}
                    wrapperClassName="w-full "
                  />
                )}
              />
            </div>
            {stayError?.start_date && (
              <p className={loanFormCommonStyleConstant.date.errorClass}>
                {stayError?.start_date.message || ''}
              </p>
            )}
          </div>
          <div className="">
            <div className="relative bg-inherit">
              <div className="absolute bottom-3 left-1 px-1 text-[#737373]">
                <img src={date} className="w-6 pr-1 text-gray-400" />
              </div>
              <label
                className={loanFormCommonStyleConstant.date.labelClass}
              ></label>

              <Controller
                name={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`}
                control={control}
                render={({ field }) => {
                  //   if (field?.value) {
                  //     field.value = field.value || new Date(field.value)
                  //   }

                  return (
                    <DatePicker
                      {...field}
                      selected={currentDateRange.end_date}
                      onChange={date => setCurrentStayDate(date)}
                      selectsEnd
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      wrapperClassName="w-full "
                      startDate={currentDateRange.start_date}
                      endDate={currentDateRange.end_date}
                      excludeDateIntervals={
                        currentDateRange.excludeDateIntervals
                      }
                      placeholderText="Select end date"
                      className={loanFormCommonStyleConstant.date.fieldClass}
                      //   minDate={prevThreeYearDate}
                      maxDate={currentDate}
                      //todo add disable for everything except last one in the array.
                      disabled={lastStayIndex != currentStayIndex}
                    />
                  );
                }}
              />
            </div>
            {stayError?.end_date && (
              <p className={loanFormCommonStyleConstant.date.errorClass}>
                {stayError?.end_date.message || ''}
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
            <Controller
              name={`${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].address`}
              control={control}
              render={({ field }) => <input {...field} type="text" />}
            />
            {/* 
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].address`
            ])} */}
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
    </>
  );
};

export default StayDetails;
