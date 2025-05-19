import { useEffect, useState } from 'react';
import { IoArrowDownSharp, IoArrowUpSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import { fieldAgentTargetApi } from '../../../api/userServices';
import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { KpiType } from '../../../utils/types';

const DashboardStatusCard = () => {
  const { role } = useSelector(authSelector);
  const { showToast } = useToast();
  const [fieldAgentTarget, setFieldAgentTarget] = useState<Partial<KpiType>>(
    []
  );
  const [statusItems, setStatusItems] = useState([]);

  const fetchDataFromApi = async () => {
    try {
      const response = await fieldAgentTargetApi();
      if (response.status_code >= 200 && response.status_code < 300) {
        setFieldAgentTarget(response.data);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch {
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (role === Roles.FieldAgent) {
      fetchDataFromApi();
    }
  }, [role]);

  useEffect(() => {
    if (fieldAgentTarget) {
      const statusItems = [
        {
          heading: fieldAgentTarget?.[0]?.title,
          label: fieldAgentTarget?.[0]?.duration,
          percentage: fieldAgentTarget?.[0]?.percentage,
          value: fieldAgentTarget?.[0]?.number_of_new_clients,
          is_trend_increasing: fieldAgentTarget?.[0]?.is_trend_increasing,
          target: fieldAgentTarget?.[0]?.target
        },
        {
          heading: fieldAgentTarget?.[1]?.title,
          label: fieldAgentTarget?.[1]?.duration,
          percentage: fieldAgentTarget?.[1]?.percentage,
          is_trend_increasing: fieldAgentTarget?.[1]?.is_trend_increasing,
          value: fieldAgentTarget?.[1]?.number_of_old_clients,
          target: fieldAgentTarget?.[1]?.target
        },
        {
          heading: fieldAgentTarget?.[2]?.title,
          label: fieldAgentTarget?.[2]?.duration,
          percentage: fieldAgentTarget?.[2]?.percentage,
          is_trend_increasing: fieldAgentTarget?.[2]?.is_trend_increasing,
          target: fieldAgentTarget?.[2]?.target,
          value: fieldAgentTarget?.[2]?.fund_disbursed
        }
      ];
      setStatusItems(statusItems);
    }
  }, [fieldAgentTarget]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statusItems.map((item, index) => (
        <div key={index} className="rounded border border-[#D3D3D3] p-4 shadow">
          <div className="py-1 text-[13px] font-medium text-[#1A439A]">
            {item?.heading}
          </div>
          <div className="text-[11px] font-light text-[#929292]">
            {item?.label}
          </div>
          <div className="flex text-[30px] font-light">
            {item?.value}{' '}
            <span
              className={`flex flex-wrap items-center px-3 text-[12px] font-medium ${
                item?.is_trend_increasing ? 'text-[#22CB53]' : 'text-[#B60000]'
              }`}
            >
              <a className="pr-1">
                {item?.is_trend_increasing ? (
                  <IoArrowUpSharp />
                ) : (
                  <IoArrowDownSharp />
                )}
              </a>
              {item?.percentage}
              {'%'}
            </span>
          </div>
          {index !== 1 && (
            <div className="text-[11px] font-medium text-[#929292]">
              {'Target: '}
              <a className="text-[#000000]">{item?.target}</a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardStatusCard;
