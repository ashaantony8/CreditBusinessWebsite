import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loanGetApi } from '../../api/loanServices';
import { authSelector } from '../../store/auth/userSlice';
import { FundingFromCurrentStatus, Roles } from '../../utils/enums';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { LoanData } from '../../utils/types';

interface Detail {
  label: string;
  value: string | number | boolean | undefined;
  valueClass?: string;
}

interface Details {
  [Roles.Customer]: Detail[];
  [Roles.Leads]: Detail[];
  common: Detail[];
}

const badgeClasses = {
  Inprogress: `text-[#F5891F] `,
  Submitted: `text-[#1A439A]`,
  Agent_Submitted: `text-[#1A439A]`,
  Underwriter_Submitted: `text-[#1A439A]`,
  Manager_Approved: `text-[#F02E23] `,
  Admin_Cash_Dispersed: `text-[#F02E23] `,
  Manager_Rejected: `text-red-800 `,
  Admin_Rejected: `text-red-800 `,
  Underwriter_Returned: `text-red-800 `,
  Moved_To_Legal: `text-red-800 `,
  Admin_Cash_Disbursed: `text-[#1A439A]`,
  Amount_Credited: `text-[#1A439A]`,
  Completed: `text-[#1A439A]`,
  Funding_Closed: `text-[#1A439A]`
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '-';
  }
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const LoanDetails: React.FC<{
  fundingId: string;
  setFunding?: React.Dispatch<React.SetStateAction<Partial<LoanData>>>;
}> = ({ fundingId, setFunding }) => {
  const { role } = useSelector(authSelector);

  const { showToast } = useToast();

  const [loan, setLoan] = useState<Partial<LoanData>>({});

  const fetchLoan = async () => {
    try {
      const loanGetApiResponse = await loanGetApi(fundingId);
      if (loanGetApiResponse?.status_code == 200) {
        setLoan(loanGetApiResponse.data);
        setFunding(loanGetApiResponse.data);
      } else {
        showToast(loanGetApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('Something went wrong!', { type: NotificationType.Error });
      console.log('error', error);
    }
  };
  useEffect(() => {
    fetchLoan();
  }, []);

  const loanStatus = loan?.loan_status;

  const details: Details = {
    [Roles.Customer]: [
      // { label: "Manager Approval Updated At:", value: formatDate(loanStatus?.manager_approve_date) },
      // { label: "Admin Approval Updated At:", value: formatDate(loanStatus?.admin_approve_date) },
      // { label: "Interest Changed or Not:", value: loanStatus?.is_intrest_changed ? "Yes" : "No" },
      // { label: "Approved Date:", value: formatDate(loanStatus?.approved_date) },
      {
        label: 'Manager Approved:',
        value: loanStatus?.approved_by_manager || 'Pending'
      },
      ...(loanStatus?.approved_by_manager
        ? [
            {
              label: 'Manager Approved Date:',
              value: formatDate(loanStatus?.manager_approve_date)
            }
          ]
        : []),
      {
        label: 'Admin Approved:',
        value: loanStatus?.approved_by_admin || 'pending'
      },
      ...(loanStatus?.approved_by_admin
        ? [
            {
              label: 'Admin Approved Date:',
              value: formatDate(loanStatus?.admin_approve_date)
            }
          ]
        : [])
    ],
    [Roles.Leads]: [
      {
        label: 'Expected Completion Date:',
        value: formatDate('2024-06-19T14:57:50.635654Z'),
        valueClass: 'text-orange-500'
      },
      ...([
        FundingFromCurrentStatus.AdminRejected,
        FundingFromCurrentStatus.ManagerRejected,
        FundingFromCurrentStatus.Inprogress,
        FundingFromCurrentStatus.AdminCashDisbursed
      ].includes(loanStatus?.current_status as FundingFromCurrentStatus)
        ? [{ label: 'Admin Reject Reason', value: loanStatus?.reject_reason }]
        : []),
      ...(loanStatus?.current_status === FundingFromCurrentStatus.AdminRejected
        ? [{ label: 'Admin Reject Reason', value: loanStatus?.reject_reason }]
        : []),
      ...(loanStatus?.current_status ===
      FundingFromCurrentStatus.ManagerRejected
        ? [{ label: 'Manager Reject Reason', value: loanStatus?.reject_reason }]
        : [])
    ],
    common: [
      ...(loanStatus?.current_status !== FundingFromCurrentStatus.Inprogress
        ? [
            {
              label: 'Applied Date:',
              value: formatDate(loanStatus?.applied_date)
            }
          ]
        : []),

      // { label: "Applied Date:", value: formatDate(loanStatus?.applied_date) },
      // { label: "Interest:", value: loanStatus?.interest },
      {
        label: 'Application Status:',
        value: loanStatus?.current_status?.replace(/_/g, ' '),
        valueClass: loanStatus?.current_status
          ? `${badgeClasses[loanStatus.current_status]}`
          : ''
      }
      // { label: "Manager ID:", value: firstLoan?.customer?.manager },
      // { label: "Field Agent ID:", value: firstLoan?.customer?.agent },
    ]
  };

  const currentDetails =
    role === Roles.Customer
      ? [...details.common, ...details[Roles.Customer]]
      : [...details.common, ...details[Roles.Leads]];
  const navigate = useNavigate();

  return (
    <div className="container bg-white">
      <div className="flex justify-end">
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-[#BABABA] px-4 py-2 text-white hover:bg-[#1A439A]"
          onClick={() => {
            navigate(`/funding-form/${loan.id}`);
          }}
        >
          {'Go to Application'}
        </button>
      </div>
      <div className="h-[20rem] w-4/5 bg-[#FFFFFF] p-4 max-sm:w-[90%]">
        <div className="mb-4 p-4">
          <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
            {currentDetails.map((item, index) => (
              <div key={index} className="text-[13px]">
                <div className="py-2 text-[#929292]">{item.label}</div>
                <div className={`font-medium ${item.valueClass || ''}`}>
                  {item.value || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
