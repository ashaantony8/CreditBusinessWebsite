import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { listAndSortCustomerLoanApi } from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import {
  ApplicationStatusBadgeClasses,
  fundingDashBoardTableHead,
  fundingTableHead
} from '../../../utils/data';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum,
  Roles
} from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import AssignFieldAgentModal from '../common/AssignFieldAgentModal';
import usePagination from '../common/usePagination';

const DashboardAgentSubmissionList = () => {
  const { showToast } = useToast();

  const { data, handleFilter, userPaginateException } = usePagination(
    listAndSortCustomerLoanApi
  );
  const [funding, setFunding] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeLoanId] = useState(null);

  const { role } = useSelector(authSelector);

  useEffect(() => {
    let loanStatus;
    if (role === Roles.Admin) {
      loanStatus = 'Manager_Approved';
    } else if (role === Roles.Manager) {
      loanStatus = 'Underwriter_Submitted';
    } else if (role === Roles.FieldAgent) {
      loanStatus = 'Inprogress';
    } else if (role === Roles.UnderWriter) {
      loanStatus = 'Submitted';
    }
    setIsLoading(true);
    handleFilter({ loan_status: loanStatus });
  }, [role]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setFunding(data);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanId, setLoanId] = useState(null);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false);

  const handleAssignFieldAgent = async () => {
    setIsAssignAgentModalOpen(false);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isModalOpen && loanId) {
      navigate(`/funding/${loanId}`);
    }
  }, [isModalOpen, loanId]);
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
      <div className="w-full overflow-x-auto">
        <div className="rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-[#D4D4D4]">
              <tr>
                {fundingDashBoardTableHead.map(({ name }, index) => (
                  <th
                    key={index}
                    className="cursor-pointer px-6 py-4 text-left text-[11px] font-medium uppercase text-[#000000]"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {funding?.length > 0 ? (
                funding
                  .slice(0, 3)
                  .map(({ id, loan_number, customer, loan_status }, index) => (
                    <tr
                      key={index}
                      className={`text-[11px] font-normal text-[#000000] hover:bg-gray-200 max-sm:text-[10px] ${
                        activeLoanId === id ? 'bg-gray-300' : ''
                      }`}
                      onClick={() => {
                        setLoanId(id);
                        setActionLeadId(customer.id);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="px-6 py-4">{loan_number}</td>
                      <td className="px-6 py-4">
                        {customer?.company_name.trim().length > 7
                          ? `${customer.company_name.trim().substring(0, 15)}...`
                          : customer?.company_name.trim()}
                      </td>
                      <td className="px-6 py-4">
                        {customer?.phone_number &&
                          `+44 ${customer.phone_number}`}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`ml-4 inline-flex rounded-full px-2 text-xs leading-5 ${
                            ApplicationStatusBadgeClasses[
                              loan_status?.current_status
                            ] ||
                            ApplicationStatusBadgeClasses[
                              FundingFromCurrentStatus.Inprogress
                            ]
                          }`}
                        >
                          {FundingFromStatusEnum[loan_status?.current_status] ||
                            FundingFromStatusEnum[
                              FundingFromCurrentStatus.Inprogress
                            ]}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={fundingTableHead.length}
                    className="px-6 py-4 text-center"
                  >
                    {'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isAssignAgentModalOpen && (
          <AssignFieldAgentModal
            onClose={handleAssignFieldAgent}
            actionLeadId={actionLeadId}
          />
        )}
      </div>
    </>
  );
};

export default DashboardAgentSubmissionList;
