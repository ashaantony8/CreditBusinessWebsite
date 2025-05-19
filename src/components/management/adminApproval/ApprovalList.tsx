import './style.css';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { AdminListApi } from '../../../api/userServices';
import { authSelector } from '../../../store/auth/userSlice';
import { managementSliceSelector } from '../../../store/managementReducer';
import { approvalTableHead } from '../../../utils/data';
import { ApprovalType, Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
// import { useSelector } from "react-redux";
// import { managementSliceSelector } from "../../../store/managementReducer";
import { ApprovalListProps, FilterData } from '../../../utils/types';
import Loader from '../../Loader';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
// import Header from "../common/Header";
import ApprovalDetail from './ApprovalDetail';
export const approvalListBadgeClasses = {
  Pending: ` bg-[#c7d0e3] text-[#1A439A]`,
  Approved: ` bg-[#f3ccc9] text-[#F02E23] `,
  Rejected: ` bg-red-100 text-[#ed1532]`
};

const ApprovalList: React.FC<ApprovalListProps> = ({
  type,
  userId,
  unitId,
  isUnit = false
}) => {
  const { role } = useSelector(authSelector);
  const { showToast } = useToast();

  const authUser = useSelector(authSelector);
  const managementUser = useSelector(managementSliceSelector).user;

  const user = [Roles.Customer, Roles.Leads].includes(role as Roles)
    ? authUser
    : managementUser;

  const customerId = userId || user?.id;

  const [approvals, setApprovals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [approvalType, setApprovalType] = useState<ApprovalType>(
    type
      ? type
      : isUnit
        ? ApprovalType.UnitProfile
        : ApprovalType.CustomerProfile
  );
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
    handleSort,
    handleFilter,
    // callPaginate,
    userPaginateException
  } = usePagination(AdminListApi);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setApprovals(data);
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

  const handleSortColumn = column => {
    if (column === 'id') {
      setIsLoading(true);
      handleSort();
    }
  };
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    const filter: FilterData = { type: approvalType };
    if (customerId) {
      filter.customer_id = `${customerId}`;
    }
    if (unitId) {
      filter.unit_id = unitId;
    }

    filter.type = approvalType; // will remove
    setIsLoading(true);
    if (approvalType) {
      handleFilter(filter);
    } else {
      // callPaginate()
      handleFilter(filter);
    }
  }, [customerId, unitId, approvalType, isModalOpen]);

  const approvalTypes = isUnit
    ? [
        { key: ApprovalType.UnitProfile, value: 'Unit Profile', id: 1 },
        { key: ApprovalType.AddressProof, value: 'Address Proof', id: 2 },
        { key: ApprovalType.PhotoId, value: 'PhotoId', id: 3 }
      ]
    : [
        { key: ApprovalType.CustomerProfile, value: 'Customer Profile', id: 1 },
        { key: ApprovalType.UnitProfile, value: 'Unit Profile', id: 2 },
        { key: ApprovalType.AddressProof, value: 'Address Proof', id: 3 },
        { key: ApprovalType.PhotoId, value: 'PhotoId', id: 4 }
      ];
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
      {isModalOpen ? (
        <ApprovalDetail
          selectedType={selectedType}
          selectedApproval={selectedApproval}
          setIsModalOpen={setIsModalOpen}
        />
      ) : (
        <>
          {/* <div className="h-[70%]"> */}
          <div className="sticky top-0 z-10 mb-2 flex h-12 items-center justify-between border-b border-gray-200 bg-white pr-8">
            <div className="w-full px-4">
              <p className="text-[20px] font-semibold text-black max-sm:text-[18px]">
                {[Roles.Customer, Roles.Leads].includes(role)
                  ? 'Pending Approvals'
                  : 'Approval List'}
              </p>

              {/* <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {approvalTypes.map((type) => (
                  <li key={type.id} className="me-2 cursor-pointer">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setApprovalType(type.key);
                      }}
                      className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                        approvalType === type.key
                          ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                      aria-current={approvalType === type.key ? "page" : undefined}
                    >
                      {type.value}
                    </a>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
          <ul className="scrollbar-hide -mb-px flex overflow-x-auto whitespace-nowrap text-center text-sm font-medium text-gray-500">
            {approvalTypes.map(type => (
              <li
                key={type.id}
                className="me-2 flex-shrink-0 cursor-pointer p-3"
              >
                <a
                  onClick={e => {
                    e.preventDefault();
                    setApprovalType(type.key);
                  }}
                  className={`group inline-flex items-center justify-center rounded-t-lg border-b-2 pb-2 ${
                    approvalType === type.key
                      ? 'border-blue-900 text-blue-900'
                      : 'border-transparent hover:border-gray-300 hover:text-gray-600'
                  }`}
                  aria-current={approvalType === type.key ? 'page' : undefined}
                >
                  {type.value}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex h-[70%] flex-1 flex-col overflow-y-auto bg-white">
            <div className="px-2 max-sm:p-4">
              {(isLaptop || isTablet) && (
                <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
                  <thead className="bg-[#D3D3D3]">
                    <tr>
                      {[
                        ...approvalTableHead.slice(0, 1), // First item before conditional headers
                        ...(approvalType === ApprovalType.CustomerProfile
                          ? !userId
                            ? [
                                { name: 'Customer Id' },
                                { name: 'Email' },
                                { name: 'Name' }
                              ]
                            : [] // Conditional headers for CustomerProfile
                          : !unitId
                            ? [{ name: 'Company Id' }, { name: 'Company Name' }]
                            : []), // Conditional headers for others
                        ...approvalTableHead.slice(1) // Remaining items after index 1
                      ].map(({ name }, index) => (
                        <th
                          key={index}
                          className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                          onClick={() => handleSortColumn(index)}
                        >
                          {name}
                          {index === 0 && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {approvals?.length > 0 ? (
                      approvals.map((approval, index) => (
                        <tr
                          key={index}
                          className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            {index + 1}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {approval.type || "N/A"}
                          </td> */}
                          {approvalType === ApprovalType.CustomerProfile
                            ? !userId && (
                                <>
                                  <td className="relative whitespace-nowrap px-6 py-4">
                                    {approval?.customer?.customer_id || 'N/A'}
                                  </td>
                                  <td className="relative whitespace-nowrap px-6 py-4">
                                    {approval?.customer?.email || 'N/A'}
                                  </td>
                                  <td className="relative whitespace-nowrap px-6 py-4">
                                    {approval?.customer?.first_name ||
                                    approval?.customer?.last_name
                                      ? `${approval?.customer?.first_name} ${approval.customer.last_name}`
                                      : 'N/A'}
                                  </td>
                                </>
                              )
                            : !unitId && (
                                <>
                                  <td className="relative whitespace-nowrap px-6 py-4">
                                    {approval?.company?.company_id || 'N/A'}
                                  </td>
                                  <td className="relative whitespace-nowrap px-6 py-4">
                                    {approval?.company?.company_name || 'N/A'}
                                  </td>
                                </>
                              )}

                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                                approvalListBadgeClasses[
                                  approval.is_admin_approved
                                    ? 'Approved'
                                    : approval.is_admin_reject
                                      ? 'Rejected'
                                      : 'Pending'
                                ]
                              }`}
                            >
                              {approval.is_admin_approved === true
                                ? 'Approved'
                                : approval.is_admin_reject
                                  ? 'Rejected'
                                  : 'Pending'}
                            </span>
                          </td>

                          <td className="relative whitespace-nowrap px-6 py-4">
                            <button
                              type="button"
                              className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                              onClick={() => {
                                setSelectedType(
                                  approval.type || ApprovalType.UnitProfile
                                );
                                setSelectedApproval(approval);
                                setIsModalOpen(true);
                              }}
                            >
                              {'View'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={approvalTableHead.length}
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
                  {approvals?.length > 0 ? (
                    approvals.map((approval, index) => (
                      <div key={index} className="container mx-auto pt-4">
                        <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="truncate text-lg font-semibold text-gray-900">
                              {index + 1}
                            </div>
                            <div className="py-1 text-[9px]">
                              <span
                                className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                                  approvalListBadgeClasses[
                                    approval.is_approved
                                      ? 'Approved'
                                      : 'Pending'
                                  ]
                                }`}
                              >
                                {approval.is_approved ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            {approvalType === ApprovalType.CustomerProfile
                              ? !userId && (
                                  <>
                                    <div>
                                      <span className="font-medium">
                                        {'Customer ID:'}
                                      </span>
                                      <span className="block truncate">
                                        {approval?.customer?.customer_id ||
                                          'N/A'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        {'Email:'}
                                      </span>
                                      <span className="block truncate">
                                        {approval?.customer?.email || 'N/A'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        {'Customer Name:'}
                                      </span>
                                      <span className="block truncate">
                                        {approval?.customer?.first_name ||
                                        approval?.customer?.last_name
                                          ? `${approval?.customer?.first_name} ${approval?.customer?.last_name}`
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </>
                                )
                              : !unitId && (
                                  <>
                                    <div>
                                      <span className="font-medium">
                                        {'Company ID:'}
                                      </span>
                                      <span className="block truncate">
                                        {approval?.company?.company_id || 'N/A'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        {'Company Name:'}
                                      </span>
                                      <span className="block truncate">
                                        {approval?.company?.company_name ||
                                          'N/A'}
                                      </span>
                                    </div>
                                  </>
                                )}
                            <div className="relative mt-4 flex items-center text-[#1A439A] max-sm:text-[11px]">
                              <button
                                type="button"
                                className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                                onClick={() => {
                                  setSelectedType(
                                    approval.type || ApprovalType.UnitProfile
                                  );
                                  setSelectedApproval(approval);
                                  setIsModalOpen(true);
                                }}
                              >
                                {'View'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">{'No data available'}</div>
                  )}
                </>
              )}
            </div>
            {/* {isDeleteModalOpen && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
              />
            )} */}
          </div>
          {/* </div> */}
        </>
      )}{' '}
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

export default ApprovalList;
