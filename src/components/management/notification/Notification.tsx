import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { TbBell } from 'react-icons/tb';

import {
  adminNotificationApi,
  adminNotificationViewedApi,
  customerNotificationApi,
  customerNotificationViewedApi,
  fieldAgentNotificationApi,
  fieldAgentNotificationViewedApi,
  financeManagerNotificationApi,
  financeNotificationVieweApi,
  managerNotificationApi,
  managerNotificationViewedApi,
  underWriterNotificationApi,
  underWriterNotificationViewedApi
} from '../../../api/notificationServices';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { NotificationItem, NotificationProps } from '../../../utils/types';
import NotificationCard from './NotificationCard';
import NotificationHeader from './NotificationHeader';

const Notification: React.FC<NotificationProps> = ({
  whichUser,
  customerId
}) => {
  const { showToast } = useToast();
  const [notification, setNotifications] = useState<NotificationItem[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  // const fetchAgentNotificationApi = async (fieldAgentId?: number|string) => {
  //   try {
  //     const response = await fieldAgentNotificationApi(fieldAgentId);
  //     if (response.status_code >= 200 && response.status_code < 300) {
  //       setNotifications(response.data);
  //     } else {
  //       showToast(response.status_message, { type: NotificationType.Error });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //     showToast("Something went wrong!", { type: NotificationType.Error });
  //   }
  // };

  // const fetchCustomerNotificationApi = async (customerId?: number|string) => {
  //   try {
  //     const response = await customerNotificationApi(customerId);
  //     if (response.status_code >= 200 && response.status_code < 300) {
  //       setNotifications(response.data);
  //     } else {
  //       showToast(response.status_message, { type: NotificationType.Error });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //     showToast("Something went wrong!", { type: NotificationType.Error });
  //   }
  // };

  // const fetchunderWriterNotificationApi = async (underWriterId?: number|string) => {
  //   try {
  //     const response = await underWriterNotificationApi(underWriterId);
  //     if(response.status_code >= 200 && response.status_code < 300) {
  //       setNotifications(response.data);
  //     }else{
  //       showToast(response.status_message, {type:NotificationType.Error});
  //     }
  //   }catch (error) {
  //     console.log("Error fetching notifications:", error);
  //     showToast("Something went wrong!", { type: NotificationType.Error });

  //   }
  // }

  const fetchNotifications = async (userId?: number | string) => {
    try {
      let response;

      switch (whichUser) {
        case Roles.FieldAgent:
          response = await fieldAgentNotificationApi(userId);
          break;
        case Roles.Customer:
          response = await customerNotificationApi(userId);
          break;
        case Roles.UnderWriter:
          response = await underWriterNotificationApi(userId);
          break;
        case Roles.Admin:
          response = await adminNotificationApi(userId);
          break;
        case Roles.Manager:
          response = await managerNotificationApi(userId);
          break;
        case Roles.FinanceManager:
          response = await financeManagerNotificationApi(userId);
          break;
        default:
          throw new Error('Invalid user role');
      }

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
  useEffect(() => {
    fetchNotifications(customerId);
  }, [whichUser, customerId]);

  // viewed-notifications
  // const fieldAgentNotificationViewed = async (item: NotificationItem) => {
  //   try {
  //     setSelectedNotification(item);
  //     setModalIsOpen(true);
  //     const fieldAgentNotificationViewedApiResponse =
  //       await fieldAgentNotificationViewedApi({
  //         id: item.id,
  //         is_notified: true,
  //       });
  //     if (fieldAgentNotificationViewedApiResponse?.status_code === 200) {
  //       // setFieldAgentNotification(fieldAgentNotificationViewedApiResponse.data);
  //     } else {
  //       showToast(fieldAgentNotificationViewedApiResponse.status_message, {
  //         type: NotificationType.Error,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Exception", error);
  //     showToast("something wrong!", { type: NotificationType.Error });
  //   }
  // };

  // const customerNotificationViewed = async (item: NotificationItem) => {
  //   try {
  //     if (!customerId) {
  //       setSelectedNotification(item);
  //       setModalIsOpen(true);
  //       const fieldAgentNotificationViewedApiResponse =
  //         await customerNotificationViewedApi({
  //           id: item.id,
  //           is_notified: true,
  //         });
  //       if (fieldAgentNotificationViewedApiResponse?.status_code === 200) {
  //         // setFieldAgentNotification(fieldAgentNotificationViewedApiResponse.data);
  //       } else {
  //         showToast(fieldAgentNotificationViewedApiResponse.status_message, {
  //           type: NotificationType.Error,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Exception", error);
  //     showToast("something wrong!", { type: NotificationType.Error });
  //   }
  // };
  // const underWriterNotificationViewed = async (item: NotificationItem) => {
  //   try {
  //     // if (!customerId) {
  //       setSelectedNotification(item);
  //       setModalIsOpen(true);
  //       const fieldAgentNotificationViewedApiResponse =
  //         await underWriterNotificationViewedApi({
  //           id: item.id,
  //           is_notified: true,
  //         });
  //       if (fieldAgentNotificationViewedApiResponse?.status_code === 200) {
  //         // setFieldAgentNotification(fieldAgentNotificationViewedApiResponse.data);
  //       } else {
  //         showToast(fieldAgentNotificationViewedApiResponse.status_message, {
  //           type: NotificationType.Error,
  //         });
  //       }
  //     // }
  //   } catch (error) {
  //     console.log("Exception", error);
  //     showToast("something wrong!", { type: NotificationType.Error });
  //   }
  // };

  const handleNotificationViewed = async (item: NotificationItem) => {
    try {
      setSelectedNotification(item);
      setModalIsOpen(true);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === item.id
            ? { ...notification, is_notified: true }
            : notification
        )
      );
      let response;
      switch (whichUser) {
        case Roles.FieldAgent:
          response = await fieldAgentNotificationViewedApi({
            id: item.id,
            is_notified: true
          });
          break;
        case Roles.Customer:
          response = await customerNotificationViewedApi({
            id: item.id,
            is_notified: true
          });
          break;
        case Roles.UnderWriter:
          response = await underWriterNotificationViewedApi({
            id: item.id,
            is_notified: true
          });
          break;
        case Roles.Admin:
          response = await adminNotificationViewedApi({
            id: item.id,
            is_notified: true
          });
          break;
        case Roles.Manager:
          response = await managerNotificationViewedApi({
            id: item.id,
            is_notified: true
          });
          break;
        case Roles.FinanceManager:
          response = await financeNotificationVieweApi({
            id: item.id,
            is_notified: true
          });
          break;
        default:
          throw new Error('Invalid user role');
      }

      if (response?.status_code === 200) {
        // Handle success (e.g., update the notification state)
      } else {
        // showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error viewing notification:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  // useEffect(() => {
  //   if (whichUser === Roles.Customer) {
  //     if (role === Roles.Customer) {
  //       fetchCustomerNotificationApi();
  //     } else if (customerId) {
  //       fetchCustomerNotificationApi(customerId);
  //     }
  //   }
  //   if (whichUser === Roles.FieldAgent) {
  //     if (role === Roles.FieldAgent) {
  //       fetchAgentNotificationApi();
  //     } else if (customerId) {
  //       fetchAgentNotificationApi(customerId);
  //     }
  //   }
  //   if (whichUser === Roles.UnderWriter) {
  //     if(role === Roles.UnderWriter) {
  //       fetchunderWriterNotificationApi();
  //     }else if(customerId){
  //      fetchunderWriterNotificationApi(customerId);
  //     }
  //   }
  // }, [role, customerId, modalIsOpen]);

  return (
    <>
      <NotificationHeader />
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[74vh]">
        <div className="p-4">
          {notification.length > 0 ? (
            notification.map(item => (
              <div
                key={item.id}
                // onClick={() =>
                //   whichUser === Roles.FieldAgent
                //     ? fieldAgentNotificationViewed(item)
                //     : whichUser === Roles.Customer
                //     ? customerNotificationViewed(item)
                //     : whichUser === Roles.UnderWriter
                //     ? underWriterNotificationViewed(item)
                //     : null
                // }
                onClick={() => handleNotificationViewed(item)}
              >
                <NotificationCard Item={item} />
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center">{'No data available'}</div>
          )}
        </div>
      </div>
      {modalIsOpen && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setModalIsOpen(false)}
        />
      )}
    </>
  );
};

interface NotificationModalProps {
  notification: NotificationItem;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-auto bg-black bg-opacity-50">
      <div className="relative h-screen w-full overflow-auto rounded-lg bg-white p-6 md:w-1/2 lg:w-1/2 xl:w-2/5">
        <div className="absolute right-0 top-0 p-2">
          <button
            onClick={onClose}
            className="p-4 text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={32} />
          </button>
        </div>
        <div className="py-3 text-[21px] font-semibold">
          {'Notification Details'}
        </div>
        <div className="flex items-center text-start">
          <div className="container mx-auto pt-4">
            <div className="flex justify-between border border-[#C5C5C5] bg-[#FFFFFF] p-4">
              <div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center">
                      <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-white">
                        <TbBell
                          size={24}
                          color={notification.is_notified ? '' : 'blue'}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="px-4 text-[14px] font-medium text-black max-sm:text-[9px]">
                      {notification.notification_type}
                    </div>
                    <div className="px-4 py-1 text-[12px] font-light text-[#929292] max-sm:text-[9px]">
                      {notification.message}
                    </div>
                    <div className="px-4 text-[12px] font-light text-[#929292] max-sm:text-[9px]">
                      {moment(notification.created_on).format(
                        'MMM YYYY hh:mm A'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
