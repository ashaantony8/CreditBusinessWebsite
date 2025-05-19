import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { editManagerApi, viewManagerApi } from '../../../api/userServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

const ManagerForm = ({ managerData, managerDetail, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToast();

  // Initialize formState and setFormData with react-hook-form
  const { formState, handleSubmit, register, watch, setValue } = useForm();
  const { isDirty } = formState;

  // State to hold form data

  const fetchData = async () => {
    if (managerData) {
      try {
        const response = await viewManagerApi(managerData);
        if (
          response &&
          response.status_code >= 200 &&
          response.status_code < 300
        ) {
          const data = response.data;
          // Set initial form data using setValue
          setValue('first_name', data.first_name || '');
          setValue('last_name', data.last_name || '');
          setValue('email', data.email || '');
          setValue('phoneNumber', data.phone_number || '');
          setValue('businessName', data.business_name || '');
          setValue('address', data.address || '');
        } else {
          showToast(response.status_message, {
            type: NotificationType.Error
          });
        }
      } catch (error) {
        showToast(error.status_message, {
          type: NotificationType.Error
        });
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [managerData]);

  // Update parent component with form data on form changes
  useEffect(() => {
    const subscription = watch(value => managerDetail(value));
    return () => subscription.unsubscribe();
  }, [watch, managerDetail]);

  // Handle form submission for editing manager data
  const onSubmit = data => {
    if (isEditing) {
      if (!isDirty) {
        showToast('No changes to save', {
          type: NotificationType.warning // Corrected from 'warning' to 'Warning'
        });
        setIsEditing(false);
      } else {
        editManagerApi(managerData, data)
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
              setTimeout(() => onClose(), 2000);
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
    <div className="container mx-auto h-96 border bg-white p-4 pb-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 grid grid-cols-1 gap-6 text-[13px] font-semibold sm:grid-cols-2">
          <div>
            <div className="font-light text-[#929292]">{'First Name'}</div>
            {isEditing ? (
              <input
                id="first_name"
                name="first_name"
                type="text"
                {...register('first_name')} // Register input with react-hook-form
                className="border-b-2 border-gray-400 p-1 focus:outline-none"
              />
            ) : (
              <div className="mt-2 text-gray-700">{watch('first_name')}</div>
            )}
          </div>

          <div>
            <div className="font-light text-[#929292]">{'Last Name'}</div>
            {isEditing ? (
              <input
                id="last_name"
                name="last_name"
                type="text"
                {...register('last_name')}
                className="border-b-2 border-gray-400 p-1 focus:outline-none"
              />
            ) : (
              <div className="mt-2 text-gray-700">{watch('last_name')}</div>
            )}
          </div>

          <div>
            <div className="font-light text-[#929292]">{'Phone Number'}</div>
            {isEditing ? (
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                {...register('phoneNumber')}
                className="border-b-2 border-gray-400 p-1 focus:outline-none"
              />
            ) : (
              <div className="mt-2 text-gray-700">{watch('phoneNumber')}</div>
            )}
          </div>

          <div>
            <div className="font-light text-[#929292]">{'Email'}</div>
            {isEditing ? (
              <input
                id="email"
                name="email"
                type="email"
                {...register('email')}
                className="border-b-2 border-gray-400 p-1 focus:outline-none"
              />
            ) : (
              <div className="mt-2 text-gray-700">{watch('email')}</div>
            )}
          </div>

          <div>
            <div className="font-light text-[#929292]">{'Business Name'}</div>
            {isEditing ? (
              <input
                id="businessName"
                name="businessName"
                type="text"
                {...register('businessName')}
                className="border-b-2 border-gray-400 p-1 focus:outline-none"
              />
            ) : (
              <div className="mt-2 text-gray-700">{watch('businessName')}</div>
            )}
          </div>

          <div>
            <div className="font-light text-[#929292]">{'Address'}</div>
            {isEditing ? (
              <input
                id="address"
                name="address"
                type="text"
                {...register('address')}
                className="border-b-2 border-gray-400 p-1 focus:outline-none"
              />
            ) : (
              <div className="mt-2 text-gray-700">{watch('address')}</div>
            )}
          </div>
        </div>

        <div className="mt-16 flex justify-end px-4">
          <button
            type="submit" // Ensure button type is submit for form submission
            className="focus:shadow-outline-blue mt-4 bg-[#1A439A] px-5 py-1 text-white transition duration-150 ease-in-out hover:bg-blue-900 focus:outline-none active:bg-blue-600"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerForm;
