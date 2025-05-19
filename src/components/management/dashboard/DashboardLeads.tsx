import { useEffect, useState } from 'react';

import { listAndSortLeadsApi } from '../../../api/userServices';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum
} from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import usePagination from '../common/usePagination';

const badgeClasses = {
  Inprogress: `bg-[#f8e2ca] text-[#F5891F] `,
  Submitted: ` bg-[#c7d0e3] text-[#1A439A]`,
  Agent_Submitted: ` bg-[#c7d0e3]  text-[#1A439A]`,
  Underwriter_Submitted: ` bg-[#c7d0e3]  text-[#1A439A]`,
  Admin_Cash_Disbursed: ` bg-[#c7d0e3]  text-[#1A439A]`,
  Amount_Credited: ` bg-[#c7d0e3]  text-[#1A439A]`,
  Completed: ` bg-[#c7d0e3]  text-[#1A439A]`,
  Funding_Closed: ` bg-[#c7d0e3]  text-[#1A439A]`,
  Manager_Approved: ` bg-[#f3ccc9] text-[#F02E23] `,
  Admin_Cash_Dispersed: ` bg-[#f3ccc9] text-[#F02E23] `,
  Manager_Rejected: ` bg-red-100 text-red-800 `,
  Admin_Rejected: ` bg-red-100 text-red-800 `,
  Underwriter_Returned: `  bg-red-100 text-red-800 `,
  Moved_To_Legal: `  bg-red-100 text-red-800 `
};

export const badgeClassesHead = [
  {
    name: 'Processing'
  }
];

const DashboardLeads = () => {
  const { showToast } = useToast();

  const [dashboardLeads, setDashboardLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data, callPaginate, userPaginateException } =
    usePagination(listAndSortLeadsApi);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setDashboardLeads(data);
    }
  }, [data]);

  useEffect(() => {
    if (userPaginateException) {
      showToast(userPaginateException as string, {
        type: NotificationType.Error
      });
      setIsLoading(false);
    }
  }, [userPaginateException]);

  // Limit to the first 4 leads
  const leadsToDisplay = dashboardLeads?.slice(0, 4);

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
  }, []);
  return (
    <>
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <div className="my-3">
        {leadsToDisplay ? (
          leadsToDisplay.map(lead => (
            <div
              key={lead.id}
              className="mb-3 flex justify-between border border-[#C5C5C5] bg-[#FFFFFF] px-4 pt-4"
            >
              <div>
                <div className="flex flex-wrap items-center">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center">
                      <span>
                        <img
                          src={lead.image || 'https://via.placeholder.com/40'}
                          alt=""
                          className="h-10 w-10 flex-shrink-0 self-center rounded-full border border-gray-300 bg-gray-500 md:justify-self-start"
                        />
                      </span>
                      <span className="px-2">
                        <p className="mb-1 text-[13px] font-semibold max-sm:text-[9px]">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-[10px] text-[#929292] max-sm:text-[8px]">
                          {lead.phone_number}
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`rounded-full px-3 text-xs leading-5 max-sm:text-[8px] ${
                    badgeClasses[
                      lead.loan_status?.current_status ||
                        FundingFromCurrentStatus.Inprogress
                    ]
                  }`}
                >
                  {FundingFromStatusEnum?.[lead.loan_status?.current_status] ||
                    FundingFromStatusEnum?.[
                      FundingFromCurrentStatus.Inprogress
                    ]}
                </span>

                {/* <div className="flex items-center text-[#1A439A] text-[13px] max-sm:text-[10px]">
              view
              <IoIosArrowForward />
            </div> */}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-4 text-center">{'No data available'}</div>
        )}
      </div>
    </>
  );
};

export default DashboardLeads;
