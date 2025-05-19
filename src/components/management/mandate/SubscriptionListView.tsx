import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import {
  cancelMandate,
  listMandatesApi,
  renewFailedMandate
} from '../../../api/loanServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import {
  ApplicationStatusBadgeClasses,
  mandateStatusBadgeClasses,
  SubscriptionTableHead
} from '../../../utils/data';
import { FundingFromStatusEnum, MandateStatus } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import ConfirmModal from '../../fundingForms/modals/ConfirmModal';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import usePagination from '../common/usePagination';

const SubscriptionListView: React.FC<{ loanId?: string }> = ({ loanId }) => {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState({
    status: []
  });
  const [selectedMandate, setSelectedMandate] = useState(null);
  const [selectedMandateId, setSelectedMandateId] = useState(null);
  const [showRenewConfirmModal, setShowRenewConfirmModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [isAction, setIsAction] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    // handleSearch,
    sortOrder,
    // handleSort,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(listMandatesApi);

  const navigate = useNavigate();
  const { showToast } = useToast();

  // pagination new code
  useEffect(() => {
    setIsLoading(true);
    if (loanId) {
      handleFilter({
        loan_id: loanId
      });
    } else {
      callPaginate();
    }
  }, [loanId]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setList(data);
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

  const dropdownData = [
    {
      title: 'Status',
      type: 'status',
      items: [
        { id: 'pending_customer_approval', label: 'Pending Customer Approval' },
        { id: 'pending_submission', label: 'Pending Submission' },
        { id: 'submitted', label: 'Submitted' },
        { id: 'active', label: 'Active' },
        { id: 'suspended_by_payer', label: 'Suspended by Payer' },
        { id: 'failed', label: 'Failed' },
        { id: 'cancelled', label: 'Cancelled' },
        { id: 'expired', label: 'Expired' },
        { id: 'consumed', label: 'Consumed' },
        { id: 'blocked', label: 'Blocked' }
      ]
    }
  ];

  const handleFilterChange = newFilters => {
    setFiltered(newFilters);
    setIsLoading(true);
    handleFilter({
      ...(loanId && { loan_id: loanId }),
      status: newFilters.status
    });
  };

  const renewMandate = async () => {
    setShowRenewConfirmModal(false);
    try {
      const response = await renewFailedMandate(selectedMandateId);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        setIsLoading(true);
        callPaginate();
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch {
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const handleCancel = async () => {
    setShowCancelConfirmModal(false);
    try {
      const response = await cancelMandate(selectedMandateId);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        setIsLoading(true);
        callPaginate();
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch {
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    if (isModalOpen) {
      navigate(`${selectedMandate}`);
    }
  }, [isModalOpen]);

  return (
    <>
      {/* <div> */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header
        title="Mandates"
        onFilterChange={handleFilterChange}
        dropdownData={dropdownData}
        initialFilters={filtered}
        // onSearch={handleSearch}
      />
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {SubscriptionTableHead.map(({ name, key }, index) => (
                    <th
                      key={index}
                      className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                      // onClick={() => handleSortColumn(key)}
                    >
                      {name}
                      {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {list?.length > 0 ? (
                  list.map(
                    (
                      { id, loan_number, mandate_id, status, loan_status },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {mandate_id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {loan_number}
                        </td>
                        <td>
                          <span
                            className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                              ApplicationStatusBadgeClasses[loan_status]
                            }`}
                          >
                            {loan_status
                              ? FundingFromStatusEnum?.[loan_status]
                              : 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                              mandateStatusBadgeClasses[MandateStatus[status]]
                            }`}
                          >
                            {MandateStatus?.[status] || 'N/A'}
                          </span>
                        </td>

                        <td className="relative whitespace-nowrap px-6 py-4">
                          <img
                            src={threeDots}
                            onClick={() => {
                              setIsAction(prevState => !prevState);
                              setSelectedMandate(id);
                              setSelectedMandateId(mandate_id);
                            }}
                            className="cursor-pointer"
                          />
                          {isAction && selectedMandate === id && (
                            <div className="absolute right-0 top-0 z-10 mt-8">
                              <ActionModal
                                setIsAction={setIsAction}
                                setIsModalOpen={setIsModalOpen}
                                setRenew={
                                  [
                                    MandateStatus.failed,
                                    MandateStatus.cancelled,
                                    MandateStatus.expired
                                  ].includes(MandateStatus[status])
                                    ? setShowRenewConfirmModal
                                    : undefined
                                }
                                setCancel={
                                  MandateStatus[status] === MandateStatus.active
                                    ? setShowCancelConfirmModal
                                    : undefined
                                }
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={SubscriptionTableHead.length}
                      className="px-6 py-4 text-center"
                    >
                      {'No data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {isMobile && (
            <>
              {list?.length > 0 ? (
                list.map(
                  (
                    { id, loan_number, mandate_id, status, loan_status },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        {/* Header Section */}
                        <div className="flex items-center justify-between">
                          <div className="truncate text-lg font-semibold text-gray-800">
                            {'Mandate #'}
                            {mandate_id || 'N/A'}
                          </div>
                          <img
                            src={threeDots}
                            alt="Actions"
                            className="cursor-pointer"
                            onClick={() => {
                              setIsAction(prevState => !prevState);
                              setSelectedMandate(id);
                              setSelectedMandateId(mandate_id);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">
                              {'Loan Number:'}
                            </span>
                            <span className="block truncate">
                              {loan_number || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Funding Status:'}
                            </span>
                            <span
                              className={`block inline-flex rounded-full px-3 text-xs leading-5 ${
                                ApplicationStatusBadgeClasses[loan_status]
                              }`}
                            >
                              {loan_status
                                ? FundingFromStatusEnum[loan_status]
                                : 'N/A'}
                            </span>
                          </div>

                          <div>
                            <span className="font-medium">
                              {'Mandate Status'}
                            </span>
                            <span
                              className={`block inline-flex rounded-full px-3 text-xs leading-5 ${
                                mandateStatusBadgeClasses[MandateStatus[status]]
                              }`}
                            >
                              {MandateStatus?.[status] || 'N/A'}
                            </span>
                          </div>
                        </div>
                        {/* Action Modal */}
                        {isAction && selectedMandate === id && (
                          <div className="absolute right-0 top-0 z-20 mt-12">
                            <ActionModal
                              setIsAction={setIsAction}
                              setIsModalOpen={setIsModalOpen}
                              setRenew={
                                [
                                  MandateStatus.failed,
                                  MandateStatus.cancelled,
                                  MandateStatus.expired
                                ].includes(MandateStatus[status])
                                  ? setShowRenewConfirmModal
                                  : undefined
                              }
                              setCancel={
                                MandateStatus[status] === MandateStatus.active
                                  ? setShowCancelConfirmModal
                                  : undefined
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center">{'No data available'}</div>
              )}
            </>
          )}
        </div>
      </div>
      {showRenewConfirmModal && (
        <ConfirmModal
          isOpen={showRenewConfirmModal}
          head="Confirm Mandate Renewal"
          content="Renew mandate ?"
          onClose={() => {
            setShowRenewConfirmModal(false);
            setSelectedMandate(null);
          }}
          onSubmit={() => renewMandate()}
        />
      )}
      {showCancelConfirmModal && (
        <ConfirmModal
          isOpen={showCancelConfirmModal}
          head="Confirm Mandate Cancellation"
          content="Cancel mandate ?"
          onClose={() => {
            setShowCancelConfirmModal(false);
            setSelectedMandate(null);
          }}
          onSubmit={() => handleCancel()}
        />
      )}
      {/* </div> */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        goToPage={goToPage}
      />
    </>
  );
};

export default SubscriptionListView;
