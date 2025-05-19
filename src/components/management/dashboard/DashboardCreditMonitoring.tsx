import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { listFailedMandatesApi } from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import {
  creditMonitoringDashBoardTableHead,
  fundingDashBoardTableHead
} from '../../../utils/data';
import { CreditMonitoringStatusType, Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import usePagination from '../common/usePagination';
import { creditMonitoringStatusBadgeClasses } from '../creditMonitoring/CreditMonitoring';

const DashboardCreditMonitoring = () => {
  const { showToast } = useToast();

  const { data, handleFilter, userPaginateException } = usePagination(
    listFailedMandatesApi
  );
  const [funding, setFunding] = useState([]);
  const [activeLoanId] = useState(null);
  const [mandateId, setMandateId] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [isRecommendedForLegalAction, setIsRecommendedForLegalAction] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useSelector(authSelector);
  const navigate = useNavigate();

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
    if (isModalOpen) {
      navigate(`/default/${mandateId}`, {
        state: {
          loanId: contractId,
          isRecommendedForLegalAction: isRecommendedForLegalAction
        }
      });
    }
  }, [isModalOpen]);

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
                {creditMonitoringDashBoardTableHead.map(({ name }, index) => (
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
              {funding.length > 0 ? (
                funding
                  .slice(0, 3)
                  .map(
                    (
                      {
                        loan_number,
                        loan_status,
                        customer_loan,
                        mandate,
                        id,
                        created_on,
                        amount
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className={`text-[11px] font-normal text-[#000000] hover:bg-gray-200 max-sm:text-[10px] ${
                          activeLoanId === id ? 'bg-gray-300' : ''
                        }`}
                        onClick={() => {
                          setContractId(customer_loan);
                          setMandateId(mandate.id);
                          setIsRecommendedForLegalAction(
                            loan_status.current_status === 'Moved_To_Legal'
                          );
                          setIsModalOpen(true);
                        }}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {loan_number}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {dayjs(created_on).format('DD-MM-YY')}
                        </td>
                        <td className="px-6 py-4">{amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`ml-4 inline-flex rounded-full px-2 text-xs leading-5 ${
                              mandate?.status === 'failed' &&
                              creditMonitoringStatusBadgeClasses[
                                CreditMonitoringStatusType.Failed
                              ]
                            }`}
                          >
                            {mandate?.status === 'failed' &&
                              CreditMonitoringStatusType.Failed}
                          </span>
                        </td>
                      </tr>
                    )
                  )
              ) : (
                <tr>
                  <td
                    colSpan={fundingDashBoardTableHead.length}
                    className="px-6 py-4 text-center"
                  >
                    {'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardCreditMonitoring;
