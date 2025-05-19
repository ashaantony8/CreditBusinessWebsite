import moment from 'moment';
import { IoIosArrowForward } from 'react-icons/io';
import { TbBell } from 'react-icons/tb';

const NotificationCard = ({ Item }) => {
  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between border border-[#C5C5C5] bg-[#FFFFFF] p-4">
        <div>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="mb-4 flex items-center">
                <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-white">
                  <TbBell size={24} color={Item.is_notified ? '' : 'blue'} />
                </div>
              </div>
            </div>
            <div>
              <div className="px-4 text-[14px] font-medium text-black max-sm:text-[9px]">
                {Item.notification_type}
              </div>
              <div className="px-4 py-1 text-[12px] font-light text-[#929292] max-sm:text-[9px]">
                {Item.message}
              </div>
              <div className="px-4 text-[12px] font-light text-[#929292] max-sm:text-[9px]">
                {moment(Item.created_on).format('MMM YYYY hh:mm A')}
              </div>
            </div>
          </div>
        </div>
        <div className="flex cursor-pointer items-center text-[#1A439A] max-sm:text-[11px]">
          {'view'}
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
