import 'react-datepicker/dist/react-datepicker.css';

import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { CiMail, CiMobile3 } from 'react-icons/ci';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import home from '../../assets/svg/home.svg';
import city from '../../assets/svg/la_city.svg';
import pin from '../../assets/svg/pin.svg';
import user from '../../assets/svg/user.svg';
import { loanFormCommonStyleConstant } from '../../utils/constants';
import {
  getStayExcludeDateIntervals,
  lookUpAddressFormatter,
  StayContext
} from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { FundingFormFieldType } from '../../utils/types';
import AddressLookup from './AddressLookup';
import StayDetailsField from './partnerComponents/StayDetailsField';

const Partner = ({
  currentDirectorIndex,
  currentDirector,
  fieldRenderer,
  partnerType,
  PartnerError
}) => {
  const { methods } = useContext(StayContext);
  const { trigger } = methods;

  useEffect(() => {
    if (PartnerError) {
      trigger();
    }
  }, [PartnerError]);

  // return currentDirector.map(
  // (_, currentDirectorIndex) => {
  const directorConst: FundingFormFieldType[] = [
    {
      type: 'dropdown',
      options: ['Mr', 'Mrs', 'Miss'],
      // label: "Title",
      name: `${partnerType}[${currentDirectorIndex}].title`,
      placeholder: 'Title',
      defaultValue: currentDirector.title,
      icon: () => {
        return <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />;
      }
    },
    {
      type: 'text',
      // label: "FirstName",
      placeholder: 'First Name',
      name: `${partnerType}[${currentDirectorIndex}].first_name`,
      defaultValue: currentDirector.first_name,
      icon: () => {
        return <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />;
      }
    },
    {
      type: 'text',
      // label: "LastName",
      placeholder: 'Last Name',
      name: `${partnerType}[${currentDirectorIndex}].last_name`,
      defaultValue: currentDirector.last_name,
      icon: () => {
        return <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />;
      }
    },
    {
      type: 'tel',
      // label: "Phone Number",
      name: `${partnerType}[${currentDirectorIndex}].phone_number`,
      placeholder: 'Mobile Number',
      icon: () => {
        return (
          <div>
            <CiMobile3 className="h-5 w-5 rtl:rotate-[270deg]" />
          </div>
        );
      }
    },
    {
      name: `${partnerType}[${currentDirectorIndex}].email`,
      type: 'email',
      // label: "Email",
      placeholder: 'Email',
      icon: () => {
        return (
          <>
            <CiMail className="h-5 w-5 rtl:rotate-[270deg]" />
          </>
        );
      }
    },
    {
      type: 'radioButton',
      // label: "Own Any Other Property",
      name: `${partnerType}[${currentDirectorIndex}].owns_other_property`,
      options: ['Yes', 'No'],
      optionLabelClass: `flex   justify-between  items-center text-[#929292]
           -ml-2 `
    },
    {
      type: 'number',
      // label: "Number of Property Owned",
      name: `${partnerType}[${currentDirectorIndex}].owned_property_count`,
      placeholder: 'Number of property',

      min: 1,
      defaultValue: '1',
      icon: () => {
        return (
          <div>
            <img src={city} className="mb-[2px] h-5 w-5 rtl:rotate-[270deg]" />
          </div>
        );
      }
    }
  ];

  fieldRenderer.updateConstant([
    ...fieldRenderer.getConstant(),
    ...directorConst
  ]);

  // if (`${currentDirector.first_name}${currentDirector.last_name}` ===
  //       partnerSelect
  // ) {
  return (
    <div key={currentDirectorIndex}>
      <div className="pt-6">
        <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              {fieldRenderer.renderField(
                `${partnerType}[${currentDirectorIndex}].title`
              )}
            </div>
            <div className="col-span-4">
              {fieldRenderer.renderField(
                `${partnerType}[${currentDirectorIndex}].first_name`
              )}
            </div>
          </div>

          {fieldRenderer.renderField(
            `${partnerType}[${currentDirectorIndex}].last_name`
          )}
        </div>
        <div className="grid gap-4 py-6 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="relative">
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].phone_number`
            ])}
          </div>

          <div className="relative">
            {' '}
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].email`
            ])}
          </div>
        </div>
        <DateRangeSelector
          currentDirectorIndex={currentDirectorIndex}
          fieldRenderer={fieldRenderer}
          partnerType={partnerType}
          PartnerError={PartnerError}
          // currentDirector={currentDirector}
        />

        <div className="my-6 grid grid-cols-1 gap-4 rounded-lg border p-2">
          {' '}
          <div className="flex gap-2 p-1">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'Own Any Other Property ?'}
            </a>
          </div>{' '}
          <div>
            {' '}
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].owns_other_property`
            ])}
          </div>{' '}
        </div>

        <OwnedProperty
          currentDirectorIndex={currentDirectorIndex}
          fieldRenderer={fieldRenderer}
          partnerType={partnerType}
        />
      </div>
    </div>
  );
};

export const DateRangeSelector = ({
  fieldRenderer,
  currentDirectorIndex,
  partnerType,
  PartnerError
}) => {
  const { methods } = useContext(StayContext);

  const { setValue, watch, trigger, control, getValues, formState } = methods;

  const { append, replace } = useFieldArray({
    control,
    name: `${partnerType}[${currentDirectorIndex}].stay`
  });

  const [openDirectorIndex, setOpenDirectorIndex] = useState(-1);

  const { showToast } = useToast();

  const dateRangeFields = watch(`${partnerType}[${currentDirectorIndex}].stay`);

  if (dateRangeFields === undefined) {
    const initialData = [
      {
        start_date: null,
        end_date: null,
        address: '',
        pincode: '',
        house_ownership: '',
        excludeDateIntervals: []
      }
    ];
    setValue(`${partnerType}[${currentDirectorIndex}].stay`, initialData, {
      shouldValidate: true
    });
  }

  useEffect(() => {
    if (dateRangeFields.length === 0) {
      append({
        start_date: null,
        end_date: new Date(),
        excludeDateIntervals: []
      });
    }
  }, [dateRangeFields]);

  const toggleAccordion = (currentDirectorIndex: number) => {
    setOpenDirectorIndex(
      openDirectorIndex === currentDirectorIndex ? -1 : currentDirectorIndex
    );
    if (openDirectorIndex === currentDirectorIndex) {
      trigger(`${partnerType}[${currentDirectorIndex}].stay`);
      forceRerender();
    }
  };

  const addDateRange = () => {
    const currentStays = getValues(
      `${partnerType}[${currentDirectorIndex}].stay`
    );
    const lastStayIndex = currentStays.length - 1;
    const previousStartDate = currentStays[lastStayIndex]?.start_date;
    const threeYearsAgo = dayjs().subtract(3, 'years').startOf('day');
    const firstStayStartDate = dayjs(previousStartDate);

    if (!previousStartDate) {
      showToast(`Please check last date`, { type: NotificationType.Error });
      return;
    }
    if (firstStayStartDate.isBefore(threeYearsAgo)) {
      showToast(`Please provide address details for the past three years.`, {
        type: NotificationType.Error
      });
      return;
    }

    // Get the last available stay index
    const lastAvailableIndex = currentStays.length - 1;
    const lastStartDate = currentStays[lastAvailableIndex]?.start_date;

    // Set new start date as the day after the last end date
    const endDate = new Date(lastStartDate);
    endDate.setDate(endDate.getDate() - 1);

    // Append a new stay range to the fields
    append({
      start_date: null,
      end_date: endDate,
      excludeDateIntervals: getStayExcludeDateIntervals(
        currentStays,
        lastAvailableIndex + 1
      )
    });

    // trigger(`${partnerType}[${currentDirectorIndex}].stay`)
  };
  const [refresh, setRefresh] = useState(false);

  const forceRerender = () => {
    setRefresh(prev => !prev);
    setTimeout(() => {
      setRefresh(prev => !prev);
    }, 200);
  };
  const onResetDateRanges = () => {
    const initialData = [
      {
        start_date: null,
        end_date: new Date(),
        address: '',
        pincode: '',
        house_ownership: '',
        excludeDateIntervals: []
      }
    ];

    // Using replace method to reset the fields
    replace(initialData);

    // set the new data and trigger validation
    setValue(`${partnerType}[${currentDirectorIndex}].stay`, initialData, {
      shouldValidate: true
    });
    forceRerender();

    // Trigger the validation manually after the reset
    // setTimeout(() => {
    //   trigger(`${partnerType}`).then(() => {
    //     console.log(watch(), 'fields reset')
    //   })
    // }, 100)
  };

  //value from backend if tis already been filled once

  useEffect(() => {}, [formState.errors]);

  const errorIndex = formState.errors?.[partnerType]?.[currentDirectorIndex]
    ?.stay
    ? Object.keys(
        formState.errors?.[partnerType]?.[currentDirectorIndex]?.stay
      )[0]
    : null;

  console.log(
    PartnerError?.[partnerType]?.[currentDirectorIndex]?.stay,
    'error',
    errorIndex
  );

  if (refresh) return <div>{'Loading..'}</div>;
  return (
    <>
      <div>
        <a className="mb-4 flex flex-wrap px-2 text-[11px] font-medium text-[#1A439A]">
          {
            'please ensure that you provide your previous address(es) for atleast'
          }
          {'the last three years.*'}
        </a>

        {dateRangeFields &&
          dateRangeFields.map((i, index) => (
            <div>
              <div
                className="accordion-title mb-4 flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3"
                onClick={() => toggleAccordion(index)}
              >
                <span
                  className={`accordion flex items-center gap-2 text-[14px] font-semibold ${
                    openDirectorIndex === currentDirectorIndex
                      ? 'text-[#1A439A]'
                      : 'font w-[100%] text-black'
                  } `}
                >
                  <img src={home} className="h-4 w-4 rtl:rotate-[270deg]"></img>
                  {`Address ${
                    i?.start_date != null
                      ? dayjs(i?.start_date).format('DD/MMM/YYYY')
                      : '-'
                  }  -- ${
                    i?.end_date != null
                      ? dayjs(i?.end_date).format('DD/MMM/YYYY')
                      : '-'
                  }`}
                </span>

                <span className="accordion-arrow -ml-4 mb-2">
                  {openDirectorIndex === index ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </div>
              <div className="accordion-content bg-white">
                <div className="container mx-auto flex justify-center">
                  <div className="w-full rounded-lg">
                    <StayDetailsField
                      getValues={getValues}
                      setValue={setValue}
                      trigger={trigger}
                      // fields={fields}
                      watch={watch}
                      partnerType={partnerType}
                      currentDirectorIndex={currentDirectorIndex}
                      control={control}
                      openDirectorIndex={openDirectorIndex}
                      currentDateRange={i}
                      currentStayIndex={index}
                      formState={formState}
                      methods={methods}
                      fieldRenderer={fieldRenderer}
                      forceRerender={forceRerender}
                    />
                  </div>
                </div>
              </div>
              {formState.errors?.[partnerType]?.[currentDirectorIndex]?.stay
                ?.length > 0 &&
              openDirectorIndex != index &&
              parseInt(errorIndex) === index ? (
                <p className={loanFormCommonStyleConstant.date.errorClass}>
                  {'Something wrong ,Please check the details filled'}{' '}
                </p>
              ) : null}
            </div>
          ))}
        {/* no need for new date ranges addition if already filled */}
        <div className="flex items-center gap-2">
          {/* {isDateFilledUptoCurrentDate ? null : ( */}
          <button
            type="button"
            className="rounded bg-green-300 p-2"
            onClick={() => addDateRange()}
          >
            {'Add new Address'}
          </button>
          {/* )} */}

          <button
            type="button"
            className="rounded bg-gray-300 p-2"
            onClick={() => onResetDateRanges()}
          >
            {'Reset Address'}
          </button>
        </div>
      </div>
    </>
  );
};

export const OwnedProperty = ({
  currentDirectorIndex,
  fieldRenderer,
  partnerType
}) => {
  const { methods } = useContext(StayContext);
  const { watch, control, getValues } = methods;
  const { append, remove } = useFieldArray({
    control,
    name: `${partnerType}[${currentDirectorIndex}].owned_property`
  });

  const watchOwnedPropertyCount = watch(
    `${partnerType}[${currentDirectorIndex}].owned_property_count`,
    1
  );
  const watchowns_other_property = watch(
    `${partnerType}[${currentDirectorIndex}].owns_other_property`,
    'NO'
  );

  useEffect(() => {}, [watchowns_other_property]);

  Array.from(
    {
      length: watchOwnedPropertyCount
    },
    (_, currentDirectorIndex) => currentDirectorIndex
  ).forEach((_, ind) => {
    const ownedOtherPropertyConst: FundingFormFieldType[] = [
      {
        type: 'number',
        // label: "Postcode",
        name: `${partnerType}[${currentDirectorIndex}].owned_property[${ind}].pincode`,
        placeholder: 'Pincode',
        icon: () => {
          return (
            <div className="w-5 pr-2 text-gray-400">
              <img src={pin} />
            </div>
          );
        }
      },
      {
        // label: "Address",
        type: 'textarea',
        name: `${partnerType}[${currentDirectorIndex}].owned_property[${ind}].address`,
        rows: 3,
        placeholder: 'Address',
        icon: () => {
          return (
            <div className="w-7 pr-2 text-gray-400">
              <img src={city} />
            </div>
          );
        }
      }
    ];

    fieldRenderer.updateConstant([
      ...fieldRenderer.getConstant(),
      ...ownedOtherPropertyConst
    ]);
  });

  useEffect(() => {
    const currentDirectorsCount = getValues(
      `${partnerType}[${currentDirectorIndex}].owned_property`
    )?.length;
    if (watchOwnedPropertyCount > watchOwnedPropertyCount) {
      for (let i = currentDirectorsCount; i < watchOwnedPropertyCount; i++) {
        append({ address: '', pincode: '' });
      }
    } else if (watchOwnedPropertyCount < currentDirectorsCount) {
      for (let i = currentDirectorsCount; i > watchOwnedPropertyCount; i--) {
        remove(i - 1);
      }
    }
  }, [watchOwnedPropertyCount, append, remove]);

  return (
    <>
      {watchowns_other_property === 'Yes' && (
        <div>
          <div className="grid grid-cols-1 gap-4">
            {' '}
            <div className="flex gap-2 p-1">
              <AiOutlineQuestionCircle size={20} color="1A439A" />
              <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
                {'Number of property ?'}
              </a>
            </div>
            <div className="">
              {fieldRenderer.renderField([
                `${partnerType}[${currentDirectorIndex}].owned_property_count`
              ])}
            </div>{' '}
          </div>

          {Array.from(
            {
              length: watchOwnedPropertyCount
            },
            (_, currentDirectorIndex) => currentDirectorIndex
          ).map((_, ind) => {
            return (
              <div>
                <div className="my-4 p-2 text-[14px] font-medium text-black max-sm:text-[10px]">{`Property ${
                  ind + 1
                }`}</div>
                <PartnerOwnedAddress
                  ind={ind}
                  currentDirectorIndex={currentDirectorIndex}
                  fieldRenderer={fieldRenderer}
                  partnerType={partnerType}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Partner;

const PartnerOwnedAddress = ({
  ind,
  currentDirectorIndex,
  fieldRenderer,
  partnerType
}) => {
  {
    const { methods } = useContext(StayContext);
    const [address, setAddress] = useState(undefined);
    const { watch, setValue, trigger, formState } = methods;

    useEffect(() => {
      if (address) {
        const lookedUpData = lookUpAddressFormatter(address);
        setValue(
          `${partnerType}[${currentDirectorIndex}].owned_property[${ind}].pincode`,
          lookedUpData.pincode
        );
        setValue(
          `${partnerType}[${currentDirectorIndex}].owned_property[${ind}].address`,
          lookedUpData.addressText
        );
        trigger('address');
      }
    }, [address]);

    const [ownedPropertyError, setOwnedPropertyError] = useState(null);

    useEffect(() => {
      setOwnedPropertyError(
        formState?.errors?.[partnerType]?.[currentDirectorIndex]
          ?.owned_property?.[ind]
          ? formState?.errors?.[partnerType]?.[currentDirectorIndex]
              ?.owned_property?.[ind]
          : null
      );
    }, [formState]);

    return (
      <div>
        <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="">
            <AddressLookup
              setAddress={setAddress}
              value={watch(
                `${partnerType}[${currentDirectorIndex}].owned_property[${ind}].pincode`,
                ''
              )}
              methods={methods}
              pincodeKey={`${partnerType}[${currentDirectorIndex}].owned_property[${ind}].pincode`}
              error={ownedPropertyError?.pincode}
            />
          </div>
          <div className=" ">
            {fieldRenderer.renderField([
              `${partnerType}[${currentDirectorIndex}].owned_property[${ind}].address`
            ])}
          </div>
        </div>
      </div>
    );
  }
};
