import moment from 'moment';
import { useEffect, useState } from 'react';
import { TbBell } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  customerNotificationApi,
  fieldAgentNotificationApi
} from '../../api/notificationServices';
import { authSelector } from '../../store/auth/userSlice';
import { Roles } from '../../utils/enums';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { NotificationItem } from '../../utils/types';

const HeaderNotification = ({
  setUnReadedNotifications,
  whichUser,
  isNotificationOpen,
  setNotificationOpen
}) => {
  const { showToast } = useToast();
  const [notification, setNotifications] = useState<NotificationItem[]>([]);
  const { role } = useSelector(authSelector);
  const [modalIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAgentNotificationApi = async () => {
    try {
      const response = await fieldAgentNotificationApi(null);
      if (response.status_code >= 200 && response.status_code < 300) {
        setNotifications(response.data);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const fetchCustomerNotificationApi = async () => {
    try {
      const response = await customerNotificationApi();
      if (response.status_code >= 200 && response.status_code < 300) {
        const unReadedNotifications = response?.data?.filter(item => {
          return item?.is_notified === false;
        });
        setNotifications(unReadedNotifications);

        setUnReadedNotifications(unReadedNotifications.length > 0);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  // const fieldAgentNotificationViewed = async (item: NotificationItem) => {
  //   try {
  //     setSelectedNotification(item);
  //     setModalIsOpen(true);
  //     const fieldAgentNotificationViewedApiResponse = await fieldAgentNotificationViewedApi({"id": item.id, "is_notified": true}
  //     );
  //     if (fieldAgentNotificationViewedApiResponse?.status_code === 200) {
  //       // setFieldAgentNotification(fieldAgentNotificationViewedApiResponse.data);
  //     } else {
  //       showToast(fieldAgentNotificationViewedApiResponse.status_message, {
  //         type: NotificationType.Error,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Exception",error);
  //     showToast("something wrong!", { type: NotificationType.Error });
  //   }
  // };

  // const customerNotificationViewed = async (item: NotificationItem) => {
  //   try {
  //     setSelectedNotification(item);
  //     setModalIsOpen(true);
  //     const fieldAgentNotificationViewedApiResponse = await customerNotificationViewedApi({"id": item.id, "is_notified": true});
  //     if (fieldAgentNotificationViewedApiResponse?.status_code === 200) {
  //       // setFieldAgentNotification(fieldAgentNotificationViewedApiResponse.data);
  //     } else {
  //       showToast(fieldAgentNotificationViewedApiResponse.status_message, {
  //         type: NotificationType.Error,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Exception",error);
  //     showToast("something wrong!", { type: NotificationType.Error });
  //   }
  // };

  useEffect(() => {
    if (whichUser === Roles.Customer) {
      fetchCustomerNotificationApi();
    }
    if (whichUser === Roles.FieldAgent) {
      fetchAgentNotificationApi();
    }
  }, [role, modalIsOpen]);

  useEffect(() => {
    const handleOutsideClick = event => {
      if (isNotificationOpen && !event.target.closest('#notification-icon')) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isNotificationOpen]);

  return (
    <>
      {isNotificationOpen && (
        <div className="border border-[#C5C5C5] bg-[#FFFFFF] p-2">
          {notification?.slice(0, 3)?.map(Item => (
            <div className=" ">
              <div
                key={Item.id}
                className="flex items-center border-b border-[#C5C5C5]"
              >
                <div className="flex items-center">
                  <div className="inline-block h-[36px] w-[36px] rounded-lg bg-[#d5dceb] p-2 text-white">
                    <TbBell
                      size={20}
                      color={Item.is_notified ? '#1A439A' : ''}
                    />
                  </div>
                </div>

                <span className="my-2">
                  <div className="px-4 text-[12px] font-medium text-black max-sm:text-[9px]">
                    {Item.notification_type}
                  </div>
                  <div className="px-4 py-1 text-[10px] font-light text-[#656565] max-sm:text-[9px]">
                    {Item.message}
                  </div>
                  <div className="px-4 text-[10px] font-light text-[#656565] max-sm:text-[9px]">
                    {moment(Item.created_on).format('MMM YYYY hh:mm A')}
                  </div>
                </span>
              </div>
            </div>
          ))}
          <div
            className="py-2 text-center font-medium uppercase text-[#1A439A] max-sm:text-[9px]"
            onClick={() => {
              navigate(`/notification`);
            }}
          >
            {' '}
            {'view all'}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNotification;
