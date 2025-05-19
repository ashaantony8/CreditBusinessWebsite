import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import { listAndSortCustomerLoanApi } from '../../../api/loanServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { managementSliceSelector } from '../../../store/managementReducer';
// import { useDispatch } from "react-redux";
import {
  ApplicationStatusBadgeClasses,
  fundingTableHead
} from '../../../utils/data';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum,
  ModeOfApplication,
  Roles
} from '../../../utils/enums';
import { applyNewLoan, chkCustNewLoan } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import AssignFieldAgentModal from '../common/AssignFieldAgentModal';
import Header from '../common/Header';
// import AgentLeadModal from "./AgentLeadModal";
import Pagination from '../common/Pagination';
// import { resetFundingState } from "../../store/fundingStateReducer";
import ActionModal from '../common/ThreeDotAction';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const Fundings = () => {
  const { user, unit } = useSelector(managementSliceSelector);
  const { showToast } = useToast();

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    handleSort,
    sortOrder,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(listAndSortCustomerLoanApi);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanId, setLoanId] = useState(null);

  const [isAction, setIsAction] = useState(false);
  const [actionLoanId, setActionLoanId] = useState(null);
  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isEligibleNewLoan, setIsEligibleNewLoan] = useState<{
    isApplicableForNewLoan: boolean;
    loanCount: number;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filtered, setFiltered] = useState({
    mode_of_application: [],
    current_status: []
  });

  useEffect(() => {
    const checkEligibility = async user_id => {
      try {
        const eligibility = await chkCustNewLoan(user_id);
        setIsEligibleNewLoan(eligibility);
      } catch (error) {
        console.error('Failed to check eligibility:', error);
        setIsEligibleNewLoan(null); // or handle error state
      }
    };
    if (user.id) {
      checkEligibility(user.id);
    }
  }, [user]);

  const [loans, setLoans] = useState([]);
  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');

  const handleSortColumn = column => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('loan_number', customerIdSortOrder);
    }
  };

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setLoans(data);
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

  useEffect(() => {
    setIsLoading(true);
    if (user.id) handleFilter({ customer_id: user.id });
    else if (unit.id) handleFilter({ company_id: unit.id });
    else callPaginate();
  }, [user, unit]);

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setLoanId(null);
  //   dispatch(resetFundingState());
  // };

  // const handleFilter = (filters: { [key: string]: string[] }) => {
  //     const modeOfApplication = filters.mode_of_application?.[0] || "";
  //     const currentStatus = filters.current_status?.[0] || "";

  //     console.log("Mode of application:", modeOfApplication);
  //     console.log("Current status:", currentStatus);

  //     setMode(modeOfApplication); // Set the mode of application
  //     setCurrentStatus(currentStatus); // Set the current status
  //   };

  //   const handleFilterChange = (newFilters) => {
  //     handleFilter(newFilters);
  //     const { mode_of_application } = newFilters;
  //     setMode(mode_of_application);
  //     console.log("newFilters", newFilters);
  //   };

  const dropdownData = [
    {
      title: 'Mode of Application',
      type: 'mode_of_application',
      items: [
        { id: 'Self', label: 'Self' },
        { id: 'Representative', label: 'Representative' }
      ]
    },
    {
      title: 'Application Status',
      type: 'current_status',
      items: Object.keys(FundingFromStatusEnum).map(key => ({
        id: key,
        label: FundingFromStatusEnum[key]
      }))
    }
  ];

  const navigate = useNavigate();
  useEffect(() => {
    if (isModalOpen) {
      navigate(`/funding/${loanId}`);
    }
  }, [isModalOpen]);
  const { role } = useSelector(authSelector);

  const handleFilterChange = newFilters => {
    setFiltered(newFilters);
    setIsLoading(true);
    handleFilter({
      ...(user.id && { customer_id: user.id }),
      ...(unit.id && { customer_id: unit.id }),
      mode_of_application: newFilters.mode_of_application,
      loan_status: newFilters.current_status
    });
  };

  const handleAssignFieldAgent = async () => {
    setIsAssignAgentModalOpen(false);
  };

  const handleNewLoan = async () => {
    try {
      await applyNewLoan(navigate, user?.id);
    } catch {
      showToast('Failed to apply for a new Funding', {
        type: NotificationType.Error
      });
    }
  };

  return (
    <>
      <Header
        title="Funding"
        onFilterChange={handleFilterChange}
        dropdownData={dropdownData}
        initialFilters={filtered}
        onSearch={handleSearch}
        isEligibleNewLoan={isEligibleNewLoan}
        newLoanHandle={handleNewLoan}
      />
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) &&
            ![Roles.Customer, Roles.Leads].includes(role as Roles) && (
              <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
                <thead className="bg-[#D3D3D3]">
                  <tr>
                    {fundingTableHead.map(
                      (
                        { name, key }: { name: string; key?: string },
                        index
                      ) => (
                        <th
                          key={index}
                          className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                          onClick={() => handleSortColumn(key)}
                        >
                          {name}
                          {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loans?.length > 0 ? (
                    loans?.map(
                      ({ id, loan_number, customer, loan_status }, index) => (
                        <tr
                          key={index}
                          className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                        >
                                                    <td className="whitespace-nowrap px-6 py-4">
                            {loan_number || 'N/A'}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">{customer?.agent}</td> */}
                          <td className="px-6 py-4">
                            {customer?.company_name
                              ? customer?.company_name.trim().length > 7
                                ? customer?.company_name
                                    .trim()
                                    .substring(0, 7) + '...'
                                : customer?.company_name.trim()
                              : 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {customer?.phone_number
                              ? `+44 ${customer.phone_number}`
                              : 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {customer?.email || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {customer?.mode_of_application || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {customer?.agent_id || 'N/A'}
                          </td>
                          <td>
                            <span
                              className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                                ApplicationStatusBadgeClasses[
                                  loan_status?.current_status
                                ] ||
                                ApplicationStatusBadgeClasses[
                                  FundingFromCurrentStatus.Inprogress
                                ]
                              }`}
                            >
                              {FundingFromStatusEnum?.[
                                loan_status?.current_status
                              ] ||
                                FundingFromStatusEnum?.[
                                  FundingFromCurrentStatus.Inprogress
                                ]}
                            </span>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {loan_status?.filled_forms_count}
                          </td> */}
                          <td className="relative whitespace-nowrap px-6 py-4">
                            {[
                              Roles.Admin,
                              Roles.Manager,
                              Roles.UnderWriter
                            ].includes(role) &&
                            customer.agent_id === '' &&
                            [
                              ModeOfApplication.Representative,
                              ModeOfApplication.BackOffice
                            ].includes(customer.mode_of_application) ? (
                              <div>
                                <img
                                  src={threeDots}
                                  onClick={() => {
                                    setLoanId(id);
                                    setActionLoanId(id);
                                    setActionLeadId(customer.id);
                                    setIsAction(prevState =>
                                      actionLoanId !== id ? true : !prevState
                                    );
                                  }}
                                  className="cursor-pointer"
                                />
                                {isAction && actionLoanId === id && (
                                  <div className="absolute right-0 top-0 z-10 mt-8">
                                    <ActionModal
                                      setIsAction={setIsAction}
                                      setIsModalOpen={setIsModalOpen}
                                      setIsAssignAgentModalOpen={
                                        setIsAssignAgentModalOpen
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                                onClick={() => {
                                  setLoanId(id);
                                  setActionLeadId(customer.id);
                                  setIsModalOpen(true);
                                }}
                              >
                                {'View'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    )
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
            )}
          {isMobile &&
            ![Roles.Customer, Roles.Leads].includes(role as Roles) && (
              <>
                {loans?.length > 0 ? (
                  loans.map(
                    ({ id, loan_number, customer, loan_status }, index) => (
                      <div key={index} className="container mx-auto pt-4">
                        <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                          {/* Header Section */}
                          <div className="flex items-center justify-between">
                            <div className="truncate text-lg font-semibold text-gray-800">
                              {'Loan #'}
                              {loan_number || 'N/A'}
                            </div>
                            <img
                              src={threeDots}
                              alt="Actions"
                              className="cursor-pointer"
                              onClick={() => {
                                setLoanId(id);
                                setActionLoanId(id);
                                setIsAction(prevState =>
                                  actionLoanId !== id ? true : !prevState
                                );
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">
                                {'Company Name:'}
                              </span>
                              {customer?.company_name
                                ? customer?.company_name.trim().length > 7
                                  ? customer?.company_name
                                      .trim()
                                      .substring(0, 7) + '...'
                                  : customer?.company_name.trim()
                                : 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">{'Phone:'}</span>
                              <span className="block truncate">
                                {customer?.phone_number
                                  ? `+44 ${customer.phone_number}`
                                  : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">{'Email:'}</span>
                              <span className="block truncate">
                                {customer?.email || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Application Mode:'}
                              </span>
                              <span className="block truncate">
                                {customer?.mode_of_application || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">{'Agent ID:'}</span>
                              <span className="block truncate">
                                {customer?.agent_id || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">{'Status:'}</span>
                              <span
                                className={`block inline-flex rounded-full px-3 text-xs leading-5 ${
                                  ApplicationStatusBadgeClasses[
                                    loan_status?.current_status ||
                                      FundingFromCurrentStatus.Inprogress
                                  ]
                                }`}
                              >
                                {loan_status?.current_status
                                  ? FundingFromStatusEnum[
                                      loan_status.current_status
                                    ]
                                  : FundingFromStatusEnum[
                                      FundingFromCurrentStatus.Inprogress
                                    ]}
                              </span>
                            </div>
                          </div>
                          {isAction && actionLoanId === id && (
                            <div className="absolute right-0 top-0 z-20 mt-12">
                              <ActionModal
                                setIsAction={setIsAction}
                                setIsModalOpen={setIsModalOpen}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div>
                    <td
                      colSpan={fundingTableHead.length}
                      className="px-6 py-4 text-center"
                    >
                      {'No data available'}
                    </td>
                  </div>
                )}
              </>
            )}
          <div>
            {/* {isDeleteModalOpen && (
              <DeleteModals
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
              />
            )} */}

            {/* {loanId && isModalOpen && (
              <AgentLeadModal
                isOpen={isModalOpen}
                loanId={loanId}
                onClose={closeModal}
              />
            )} */}
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        goToPage={goToPage}
      />
      {isOpenAddLead && (
        <AddLead
          isOpenAddLead={isOpenAddLead}
          setIsOpenAddLead={setIsOpenAddLead}
        />
      )}

      {isAssignAgentModalOpen && (
        <AssignFieldAgentModal
          onClose={handleAssignFieldAgent}
          actionLeadId={actionLeadId}
        />
      )}
    </>
  );
};

export default Fundings;
