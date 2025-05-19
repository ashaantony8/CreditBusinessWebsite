import moment from 'moment';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
// import { IoIosArrowForward } from "react-icons/io";
import { TbBell } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import {
  fieldAgentNotificationApi,
  fieldAgentNotificationViewedApi
} from '../../../api/notificationServices';
import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { NotificationItem, NotificationProps } from '../../../utils/types';
// import NotificationHeader from "./notificationHeader";
import NotificationCard from '../notification/NotificationCard';

const DashboardNotification: React.FC<NotificationProps> = ({ customerId }) => {
  const { showToast } = useToast();
  const [fieldAgentNotification, setFieldAgentNotification] = useState<
    NotificationItem[]
  >([]);
  const { role } = useSelector(authSelector);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const fetchDataFromApi = async (fieldAgentId?: number | string) => {
    try {
      const response = await fieldAgentNotificationApi(fieldAgentId);
      if (response.status_code >= 200 && response.status_code < 300) {
        setFieldAgentNotification(response.data);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const fieldAgentNotificationViewed = async (item: NotificationItem) => {
    try {
      setSelectedNotification(item);
      setModalIsOpen(true);
      const fieldAgentNotificationViewedApiResponse =
        await fieldAgentNotificationViewedApi({
          id: item.id,
          is_notified: true
        });
      if (fieldAgentNotificationViewedApiResponse?.status_code === 200) {
        // setFieldAgentNotification(fieldAgentNotificationViewedApiResponse.data);
      } else {
        showToast(fieldAgentNotificationViewedApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (role === Roles.FieldAgent) {
      fetchDataFromApi();
    } else if (customerId) {
      fetchDataFromApi(customerId);
    }
  }, [role, customerId, modalIsOpen]);

  return (
    <>
      <div className="flex h-[490px] flex-1 flex-col overflow-y-auto bg-white">
        <div className="-mt-1 px-4">
          {fieldAgentNotification.length > 0 ? (
            fieldAgentNotification.map(item => (
              <div
                key={item.id}
                onClick={() => fieldAgentNotificationViewed(item)}
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
        <p className="py-3 text-[21px] font-semibold">
          {'Notification Details'}
        </p>
        <div className="flex items-center text-start">
          <div className="container mx-auto pt-4">
            <div className="flex justify-between border border-[#C5C5C5] bg-[#FFFFFF] p-4">
              <div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center">
                      <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-white">
                        <TbBell size={24} color="#1A439A" />
                      </div>
                    </div>
                  </div>
                  <p>
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
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotification;
