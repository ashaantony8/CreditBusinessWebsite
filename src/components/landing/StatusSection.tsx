import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { customerLoanApi } from '../../api/loanServices';
import form from '../../assets/svg/form.svg';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum
} from '../../utils/enums';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';

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

const StatusSection = () => {
  const { showToast } = useToast();
  const [loanSubmissionDate, setLoanSubmissionDate] = useState(null);
  const navigate = useNavigate();
  const initialDate = moment(loanSubmissionDate || new Date());
  const newDate = initialDate.add(5, 'days');
  
  const [fundingFormStatus, setFundingFormStatus] = useState('Inprogress');
  const [formattedDate, setFormattedDate] = useState(newDate.format('MMMM D, YYYY'));

  const fetchTrustId = async () => {
    try {
      const trustIdStatusApiResponse = await customerLoanApi(null);
      if (Object.keys(trustIdStatusApiResponse?.data).length === 0) {
        return;
      } else if (
        trustIdStatusApiResponse.status_code >= 200 &&
        trustIdStatusApiResponse.status_code < 300
      ) {
        setFundingFormStatus(
          trustIdStatusApiResponse?.data?.[0]?.loan_status?.current_status
        );
        setFormattedDate(
          trustIdStatusApiResponse?.data?.[0]?.expected_completion_date
        )
        setLoanSubmissionDate(trustIdStatusApiResponse?.data?.created_on);
      } else {
        showToast(trustIdStatusApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    fetchTrustId();
  }, []);
  return (
    <div className="">
      <div className="container mx-auto -mt-12 lg:px-12 max-sm:mt-0">
        {' '}
        <div className="my-4 flex w-auto flex-wrap items-center bg-[#FFFFFF] p-4 shadow-md">
          <div className="mr-1 pr-2">
            <div className="inline-block h-[35px] w-[35px] rounded-lg bg-[#d5dceb] p-[10px] text-white">
              <img src={form} className="w-[36px]" />
            </div>
          </div>
          <div
            className="relative flex-1 cursor-pointer"
            onClick={() => {
              navigate(`/funding-form`);
            }}
          >
            <div className="text-[13px] font-semibold text-[#02002E]">
              {'Your Application status'}
            </div>
            {fundingFormStatus !== FundingFromCurrentStatus.Inprogress && (
              <div className="text-[12px] font-light text-[#929292]">
                {'Expected Completion Date:'}{' '}
                <span className="text-[12px] font-light text-[#000000]">
                  {formattedDate}
                </span>
              </div>
            )}
          </div>
          <div>
            <span
              className={`mb-6 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-2 max-sm:px-2 ${badgeClasses[fundingFormStatus]}`}
            >
              {FundingFromStatusEnum?.[fundingFormStatus]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSection;
