import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  editFinanceManagerApi,
  viewFinanceManagerApi
} from '../../../api/userServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

const FinanceManagerForm = ({ userData, userDetails, closeModal }) => {
  // Receive userData as props
  const [isEditing, setIsEditing] = useState(false);
  const { formState, handleSubmit, register, watch, setValue } = useForm();
  const { isDirty } = formState;
  const { showToast } = useToast();

  const fetchData = () => {
    if (userData) {
      viewFinanceManagerApi(userData)
        .then(response => {
          if (
            response &&
            response.status_code >= 200 &&
            response.status_code < 300
          ) {
            const data = response.data;
            setValue('first_name', data.first_name || '');
            setValue('last_name', data.last_name || '');
            setValue('dob', data.date_of_birth || '');
            setValue('email', data.email || '');
            setValue('phone_number', data.phone_number || '');
            setValue('address', data.address || '');
            setValue('assigned_manager', data.assigned_manager || '');
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
  }, [userData]);

  useEffect(() => {
    const subscription = watch(value => userDetails(value));
    return () => subscription.unsubscribe();
  }, [watch, userDetails]);

  const onSubmit = data => {
    if (isEditing) {
      if (!isDirty) {
        showToast('No changes to save', {
          type: NotificationType.warning // Corrected from 'warning' to 'Warning'
        });
        setIsEditing(false);
      } else {
        editFinanceManagerApi(userData, data)
          .then(response => {
            if (
              response &&
              response.status_code >= 200 &&
              response.status_code < 300
            ) {
              setIsEditing(false);
              fetchData();
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
    <>
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
                  {...register('first_name')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="mt-2 text-gray-700">{watch('first_name')}</div>
              )}
            </div>
            <div>
              <div className="font-light text-[#929292]">{'last name'}</div>
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
              <div className="font-light text-[#929292]">{'Address'}</div>{' '}
              {/* Fixed typo in "Address" */}
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

            <div>
              <div className="font-light text-[#929292]">{'Phone number'}</div>
              {isEditing ? (
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  {...register('phone_number')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="mt-2 text-gray-700">
                  {watch('phone_number')}
                </div>
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
              <div className="font-light text-[#929292]">
                {'Assigned Manager'}
              </div>
              {isEditing ? (
                <input
                  id="assigned_manager"
                  name="assigned_manager"
                  type="text"
                  {...register('assigned_manager')}
                  className="border-b-2 border-gray-400 p-1 focus:outline-none"
                />
              ) : (
                <div className="mt-2 text-gray-700">
                  {watch('assigned_manager')}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 flex justify-end px-8">
            <button className="focus:shadow-outline-blue mt-4 bg-[#1A439A] px-5 py-1 text-white transition duration-150 ease-in-out hover:bg-blue-900 focus:outline-none active:bg-blue-600">
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FinanceManagerForm;
