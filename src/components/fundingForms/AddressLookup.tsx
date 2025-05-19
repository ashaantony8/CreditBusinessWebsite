import { useCallback, useEffect, useRef, useState } from 'react';

import {
  addressLookupAPI,
  addressSidLookupAPI,
  companyAddressLookupAPI,
  companyAddressSidLookupAPI
} from '../../api/loanServices';
import build from '../../assets/svg/build.svg';
import home from '../../assets/svg/form-home.svg';
import { loanFormCommonStyleConstant } from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import Loader from '../Loader';

const AddressLookup = ({
  setAddress,
  methods,
  value,
  pincodeKey,
  error,
  isCompanyLookup = false
}) => {
  const { trigger, formState, setValue } = methods;
  const [addressList, setAddressList] = useState([]);
  const [lookupError, setError] = useState(undefined);
  const [loader, setLoader] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [pincode, setPincode] = useState(undefined);
  const [inputVale, setInputVale] = useState('');
  const { showToast } = useToast();

  const formRef = useRef(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleInputChangeDebounced = debounce(value => {
    setPincode(value.toUpperCase());
  }, 300);

  const lookUp = async () => {
    if (!formState.errors.pincode && pincode) {
      setShowDropDown(true);
      setLoader(true);
      setError(undefined);
      try {
        const result = isCompanyLookup
          ? await companyAddressLookupAPI({
              address: pincode
            })
          : await addressLookupAPI({
              address: pincode
            });

        if (result.status_code === 200) {
          if (result.data.Results?.NumItems >= 1) {
            setAddressList(result.data.Results.Items);
            setLoader(false);
          } else {
            setError(result.data.StatusDetails.Description);
          }
        } else if (result.status_code === 422) {
          showToast(result.status_message, { type: NotificationType.Error });
        }
      } catch (err) {
        console.log('err', err);
        setError('something wrong');
        setLoader(false);
      }
    } else {
      if (formState.errors.pincode && !isCompanyLookup) {
        setError(formState.errors.pincode.message);
      }
      setAddressList([]);
    }
  };

  useEffect(() => {
    lookUp();
  }, [pincode]);

  useEffect(() => {
    setInputVale(value);
  }, [value]);

  const handleSid = async item => {
    try {
      setLoader(true);
      setInputVale(item.ItemText);

      const result = isCompanyLookup
        ? await companyAddressSidLookupAPI({
            address_sid: item.Sid
          })
        : await addressSidLookupAPI({
            address_sid: item.Sid
          });

      if (result.status_code === 200) {
        if (result.data.Results.NumItems > 1) {
          setAddressList(result.data.Results.Items);
          setLoader(false);
        } else {
          const address = result.data.Results.Items[0];

          if (isCompanyLookup) {
            setInputVale(item.ItemText);
            //additionally send company status key to api from lookup directly
            setValue('company.company_status', address.Company_Status);
            setValue('company.company_number', address.Company_Number);
            setValue('company.company_name', address.Company_Name);
            trigger('company.company_number');
          } else {
            setInputVale(
              address[Object.keys(address)[Object.keys(address).length - 2]]
            );
          }
          setAddress(address);
          setLoader(false);
          setShowDropDown(false);
        }
      } else if (result.status_code === 422) {
        setInputVale('');
        showToast(result.status_message, { type: NotificationType.Error });
        setLoader(false);
        setShowDropDown(false);
      } else {
        setError('something wrong');
        setLoader(false);
        setShowDropDown(false);
      }
    } catch (err) {
      console.log(err);
      setError('something wrong');
      setLoader(false);
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    if (formState.errors[pincodeKey]) {
      setError(formState.errors[pincodeKey]?.message);
    }
  }, [lookupError]);

  const closeOpenDropdown = useCallback(
    e => {
      if (
        formRef.current &&
        showDropDown &&
        !formRef.current.contains(e.target)
      ) {
        setShowDropDown(false);
      }
    },
    [showDropDown]
  );

  useEffect(() => {
    document.addEventListener('mousedown', closeOpenDropdown);
  }, [closeOpenDropdown]);

  return (
    <div className="rounded-lg bg-white">
      <div className="relative bg-inherit">
        {isCompanyLookup ? (
          <input
            className={`${loanFormCommonStyleConstant.text.fieldClass} ${lookupError || (error && 'border-2 border-red-500')}`}
            placeholder=""
            value={inputVale}
            onChange={e => {
              handleInputChangeDebounced(e.target.value);
              setInputVale(e.target.value);
              setValue(pincodeKey, e.target.value);
              trigger(pincodeKey);
            }}
            style={{ paddingLeft: '2.5rem' }}
          />
        ) : (
          <textarea
            id={isCompanyLookup ? 'Company Name' : 'Postcode'}
            className={`${loanFormCommonStyleConstant.textarea.fieldClass} ${lookupError || (error && 'border-2 border-red-500')}`}
            placeholder=""
            value={inputVale}
            rows={isCompanyLookup ? 1 : 3}
            onChange={e => {
              handleInputChangeDebounced(e.target.value);
              setInputVale(e.target.value);
              setValue(pincodeKey, e.target.value);
              trigger(pincodeKey);
            }}
            style={{ paddingLeft: '2.5rem' }}
          />
        )}
        {isCompanyLookup ? (
          <div className="pointer-events-none absolute left-2 top-5 h-4 w-4 -translate-y-1/2 transform text-gray-500">
            <img src={build} className="h-4 w-4 rtl:rotate-[270deg]"></img>
          </div>
        ) : (
          <div className="pointer-events-none absolute left-2 top-5 h-4 w-4 -translate-y-1/2 transform text-gray-500">
            <img src={home} className="h-4 w-4 rtl:rotate-[270deg]"></img>
          </div>
        )}
        <label
          htmlFor={isCompanyLookup ? 'Company Name' : 'Postcode'}
          className={` ${
            isCompanyLookup
              ? loanFormCommonStyleConstant.text.labelClass
              : loanFormCommonStyleConstant.textarea.labelClass
          }`}
        >
          {isCompanyLookup ? 'Company Name' : 'Postcode'}{' '}
          <span className="text-red-500">{' *'}</span>
        </label>
        {/* </div> */}

        {lookupError || error ? (
          <p className="text-[10px] text-red-500">
            {lookupError || error.message}
          </p>
        ) : (
          showDropDown &&
          (loader ? (
            <div role="status" className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <div
              ref={formRef}
              className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
            >
              {addressList.map((item, index) => (
                <p
                  key={index}
                  className="block cursor-pointer px-4 py-2 transition duration-200 ease-in-out hover:bg-gray-200"
                  onClick={() => handleSid(item)}
                >
                  {item.ItemText}
                </p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressLookup;
