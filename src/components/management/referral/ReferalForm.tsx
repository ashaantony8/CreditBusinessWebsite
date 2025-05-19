import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  editReferralApi,
  receivedBenefitApi,
  sendReferralPostAPI,
  viewReferralApi
} from '../../../api/userServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

const ReferralForm = ({
  referalData,
  referralDetails,
  closeModal,
  updateReferralStatus
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { formState, handleSubmit, register, watch, setValue } = useForm();

  const { showToast } = useToast();

  useEffect(() => {
    const subscription = watch(value => referralDetails(value));
    return () => subscription.unsubscribe();
  }, [watch, referralDetails]);

  const fetchData = () => {
    if (referalData) {
      viewReferralApi(referalData)
        .then(response => {
          if (
            response &&
            response.status_code >= 200 &&
            response.status_code < 300
          ) {
            const data = response.data;

            setValue('rfirst_name', data.refered_by.first_name || '');
            setValue('rlast_name', data.refered_by.last_name || '');
            setValue('role', data.refered_by.role || '');

            setValue(
              'holder_name',
              data.bank_details.account_holder_name || ''
            );
            setValue('bank_name', data.bank_details.bank_name || '');

            setValue('first_name', data.first_name || '');
            setValue('last_name', data.last_name || '');
            setValue('phone_number', data.phone_number || '');
            setValue('email', data.email || '');
            setValue('business_name', data.business_name || '');
            setValue('referral_status', data.referral_status || '');
          } else {
            console.error(
              'Unexpected response format or status code:',
              response
            );
          }
        })
        .catch(error => {
          console.error('Error fetching customer data:', error);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [referalData]);

  const { isDirty } = formState;

  const onSubmit = data => {
    if (isEditing) {
      if (!isDirty) {
        showToast('No changes to save', {
          type: NotificationType.warning
        });
        setIsEditing(false);
      } else {
        editReferralApi(referalData, data)
          .then(response => {
            if (
              response &&
              response.status_code >= 200 &&
              response.status_code < 300
            ) {
              setIsEditing(false);
              fetchData(); // Refresh the data after saving
              showToast(response.status_message, {
                type: NotificationType.Success
              });
              setTimeout(() => closeModal(), 2000);
            } else {
              showToast(response.status_message, {
                type: NotificationType.Error
              });
            }
          })
          .catch(error => {
            console.error('Error saving customer data:', error);
            showToast(error.status_message, { type: NotificationType.Error });
          });
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleSendEmail = () => {
    const email = watch('email');
    if (!email) {
      showToast('Email is required', { type: NotificationType.Error });
      return;
    }

    const payload = {
      email: email
    };
    sendReferralPostAPI(payload)
      .then(response => {
        if (response && response.status_code === 200) {
          showToast(response.status_message, {
            type: NotificationType.Success
          });
        } else {
          showToast(response.status_message, {
            type: NotificationType.Error
          });
        }
      })
      .catch(error => {
        showToast(error.status_message, { type: NotificationType.Error });
      });
  };

  const handleMarkAsReceived = async () => {
    try {
      const response = await receivedBenefitApi(referalData);
      if (response) {
        // update the referal status
        updateReferralStatus({
          id: referalData,
          referral_status: 'Received_Benefit'
        });
        showToast(response.status_message, { type: NotificationType.Success });
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        showToast('Response Error', { type: NotificationType.Error });
      }
    } catch {
      showToast('Something went wrong.', { type: NotificationType.Error });
    }
  };
  return (
    <>
      <div className="container mx-auto bg-white p-4 pb-8">
        <p className="pr-4 text-[20px] font-semibold text-[#000000] max-sm:text-[18px]">
          {' '}
          {'Referal Status Heading'}
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container mx-auto mt-4 border bg-white p-4"
        >
          <h2 className="font-bold">{'Refered By..'}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
              <div className="text-[#929292]">{'Full Name'}</div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    {...register('rfirst_name')}
                    className="border-b-2 border-gray-400 p-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    {...register('rlast_name')}
                    className="border-b-2 border-gray-400 p-1 focus:outline-none"
                  />
                </>
              ) : (
                // <div className="font-medium">{watch("first_name")}</div>
                <div className="font-medium">
                  {`${watch('rfirst_name') || ''} ${watch('rlast_name') || ''}`}
                </div>
              )}
            </div>

            <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
              <div className="text-[#929292]">{'Email Address'}</div>
              {isEditing ? (
                <input
                  type="email"
                  {...register('email')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('email')}</div>
              )}
            </div>
            <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
              <div className="text-[#929292]">{'Role'}</div>
              {isEditing ? (
                <input
                  type="text"
                  {...register('role')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('role')}</div>
              )}
            </div>
          </div>
          {/* bank details */}
          {/* Bank Details Section */}
          <h2 className="mt-8 font-bold">{'Bank Details'}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Bank Holder Name */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Bank Holder Name'}</div>
              {isEditing ? (
                <input
                  type="text"
                  {...register('holder_name')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('holder_name')}</div>
              )}
            </div>

            {/* Bank Name */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Bank Name'}</div>
              {isEditing ? (
                <input
                  type="text"
                  {...register('bank_name')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('bank_name')}</div>
              )}
            </div>
          </div>

          {/* Referral Detail s Section */}
          <h2 className="mt-8">{'Referral Details'}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Fullname */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Fullname'}</div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    {...register('first_name')}
                    className="border-b-2 border-gray-400 p-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    {...register('last_name')}
                    className="border-b-2 border-gray-400 p-1 focus:outline-none"
                  />
                </>
              ) : (
                // <div className="font-medium">{watch("first_name")}</div>
                <div className="font-medium">
                  {`${watch('first_name') || ''} ${watch('last_name') || ''}`}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Phone Number'}</div>
              {isEditing ? (
                <input
                  type="number"
                  {...register('phone_number')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('phone_number')}</div>
              )}
            </div>

            {/* Email */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Email'}</div>
              {isEditing ? (
                <input
                  type="email"
                  {...register('email')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('email')}</div>
              )}
            </div>

            {/* Business Name */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Business Name'}</div>
              {isEditing ? (
                <input
                  type="text"
                  {...register('business_name')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('business_name')}</div>
              )}
            </div>

            {/* Referral */}
            <div className="col-span-1 p-4 text-[13px]">
              <div className="text-[#929292]">{'Referral'}</div>
              {isEditing ? (
                <input
                  type="text"
                  {...register('referral_status')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="font-medium">{watch('referral_status')}</div>
              )}
            </div>
            {/* <div className="col-span-1 sm:col-span-1 p-4 text-[13px]">
    <div className="text-[#929292]">Referral</div>
    {isEditing ? (
      <input
        type="text"
        {...register("referral_status")}
        className="border-b-2 border-gray-400 p-1 focus:outline-none"
      />
    ) : (
      <div className="font-medium">{watch("referral_status")}</div>
    )}
  </div> */}
          </div>

          <div className="mt-8 flex justify-end px-8">
            <button
              type="submit"
              className="focus:shadow-outline-blue mt-4 bg-[#1A439A] px-5 py-1 text-white transition duration-150 ease-in-out hover:bg-blue-900 focus:outline-none active:bg-blue-600"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </form>

        <div className="mt-3 flex justify-between">
          <button
            className="focus:shadow-outline-blue mt-4 border border-[#1A439A] px-5 py-1 text-[#1A439A] transition duration-150 ease-in-out hover:bg-blue-900 hover:text-white focus:outline-none active:bg-blue-600"
            onClick={() => handleSendEmail()}
          >
            {'Send email'}
          </button>
          <button
            onClick={handleMarkAsReceived}
            className="focus:shadow-outline-blue mt-4 border border-[#1A439A] px-5 py-1 text-[#1A439A] transition duration-150 ease-in-out hover:bg-blue-900 hover:text-white focus:outline-none active:bg-blue-600"
          >
            {'Mark as Received Benefits'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReferralForm;
