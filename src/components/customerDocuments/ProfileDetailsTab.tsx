import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GrLocation } from 'react-icons/gr';

import { editCustomerApi, viewCustomerApi } from '../../api/userServices';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';

const ProfileDetailsTab = ({ customerData, setCustomerData, closeModal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, watch, formState } = useForm();
  const { showToast } = useToast();
  const { isDirty } = formState;

  const fetchData = () => {
    if (customerData) {
      viewCustomerApi(customerData)
        .then(response => {
          if (
            response &&
            response.status_code >= 200 &&
            response.status_code < 300
          ) {
            const data = response.data;

            setValue('first_name', data.first_name || '');
            setValue('last_name', data.last_name || '');
            setValue('date_of_birth', data.date_of_birth || '');
            setValue('email', data.email || '');
            setValue('phone_number', data.phone_number || '');
            setValue('address', data.address || '');
            setValue('location', data.location || '');
          } else {
            showToast(response.status_message, {
              type: NotificationType.Error
            });
          }
        })
        .catch(error => {
          showToast(error.status_message, {
            type: NotificationType.Error
          });
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [customerData]);

  useEffect(() => {
    const subscription = watch(value => setCustomerData(value));
    return () => subscription.unsubscribe();
  }, [watch, setCustomerData]);

  const onSubmit = data => {
    if (isEditing) {
      if (!isDirty) {
        showToast('No changes to save', {
          type: NotificationType.warning // Corrected from 'warning' to 'Warning'
        });
        setIsEditing(false);
      } else {
        editCustomerApi(customerData, data)
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mx-auto h-96 border bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
          <div className="text-[#929292]">{'Name'}</div>
          {isEditing ? (
            <input
              type="text"
              {...register('first_name')}
              className="border-b-2 border-gray-400 p-1 focus:outline-none"
            />
          ) : (
            <div className="font-medium">{watch('first_name')}</div>
          )}
        </div>
        <div className="col-span-1 p-4 sm:col-span-1"></div>
        <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
          <div className="text-[#929292]">{'LastName'}</div>
          {isEditing ? (
            <input
              type="text"
              {...register('last_name')}
              className="border-b-2 border-gray-400 p-1 focus:outline-none"
            />
          ) : (
            <div className="font-medium">{watch('last_name')}</div>
          )}
        </div>

        <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
          <div className="text-[#929292]">{'Date of Birth'}</div>
          {isEditing ? (
            <input
              type="text"
              {...register('date_of_birth')}
              className="border-b-2 border-gray-400 p-1 focus:outline-none"
            />
          ) : (
            <div className="font-medium">{watch('date_of_birth')}</div>
          )}
        </div>
        <div className="col-span-1 p-4 sm:col-span-1"></div>
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
          <div className="text-[#929292]">{'Phone Number'}</div>
          {isEditing ? (
            <input
              type="text"
              {...register('phone_number')}
              className="border-b-2 border-gray-400 p-1 focus:outline-none"
            />
          ) : (
            <div className="font-medium">{watch('phone_number')}</div>
          )}
        </div>
        <div className="col-span-1 p-4 sm:col-span-1"></div>
        <div className="col-span-1 p-4 text-[14px] font-medium text-[#1A449A] sm:col-span-1">
          {'Set Current location'}
        </div>
        <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
          <a className="mb-[2px] font-medium">
            <GrLocation />
          </a>
          {isEditing ? (
            <input
              type="text"
              {...register('location')}
              className="border-b-2 border-gray-400 p-1 focus:outline-none"
            />
          ) : (
            <div className="font-medium">{watch('location')}</div>
          )}
        </div>
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
  );
};

export default ProfileDetailsTab;
