import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import { listCompaniesApi } from '../../../api/loanServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { managementSliceSelector } from '../../../store/managementReducer';
import { UnitStatusBadgeClasses, unitTableHead } from '../../../utils/data';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const Units = () => {
  const { showToast } = useToast();

  const { user } = useSelector(managementSliceSelector);
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
    // setMode,
    // setCurrentStatus,
    userPaginateException
  } = usePagination(listCompaniesApi);
  const { role } = useSelector(authSelector);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitId, setUnitId] = useState(null);
  const [isAction, setIsAction] = useState(false);
  const [actionUnitId, setActionUnitId] = useState(null);
  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState({
    business_type: [],
    funding_purpose: []
  });
  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');

  const handleSortColumn = column => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('company_id', customerIdSortOrder);
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
      setCompanies(data);
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

  // const handleFilter = (filters: { [key: string]: string[] }) => {
  //   const modeOfApplication = filters.mode_of_application?.[0] || "";
  //   const currentStatus = filters.current_status?.[0] || "";

  //   console.log("Mode of application:", modeOfApplication);
  //   console.log("Current status:", currentStatus);

  //   setMode(modeOfApplication); // Set the mode of application
  //   setCurrentStatus(currentStatus); // Set the current status
  // };

  // const handleFilterChange = (newFilters) => {
  //   handleFilter(newFilters);
  //   const { mode_of_application } = newFilters;
  //   setMode(mode_of_application);
  //   console.log("newFilters", newFilters);
  // };

  const dropdownData = [
    {
      title: 'Business Type',
      type: 'business_type',
      items: [
        { id: 'Limited Company', label: 'Limited Company' },
        { id: 'Limited Partnership', label: 'Limited Partnership' },
        { id: 'Sole Trader', label: 'Sole Trader' }
      ]
    },
    {
      title: 'Funding Purpose',
      type: 'funding_purpose',
      items: [
        { id: 'Hire Staff', label: 'Hire Staf' },
        { id: 'Management Buyout', label: 'Management Buyout' },
        { id: 'Marketing', label: 'Marketing' },
        { id: 'Moving premises', label: 'Moving premises' },
        {
          id: 'Full-fill a order or contract',
          label: 'Full-fill a order or contract'
        },
        { id: 'Pay a due bill', label: 'Pay a due bill' },
        { id: 'Pay HMRC', label: 'Pay HMRC' },
        { id: 'Pay Staff', label: 'Pay Staff' },
        { id: 'Purchase Stock', label: 'Purchase Stock' },
        { id: 'Purchase equipment', label: 'Purchase equipment' },
        { id: 'Refinance Debt', label: 'Refinance Debt' },
        { id: 'Upgrade Website', label: 'Upgrade Website' },
        { id: 'Business Expansion', label: 'Business Expansion' },
        { id: 'Working Capital/Cash flow', label: 'Working Capital/Cash flow' }
      ]
    }
  ];

  const navigate = useNavigate();
  useEffect(() => {
    if (isModalOpen) {
      navigate(`/units/${unitId}`);
    }
  }, [isModalOpen]);

  const handleFilterChange = newFilters => {
    setFiltered(newFilters);
    setIsLoading(true);
    handleFilter({
      ...(user.id && { customer_id: user.id }),
      business_type: newFilters.business_type,
      funding_purpose: newFilters.funding_purpose
    });
  };

  // new code for pagination
  useEffect(() => {
    setIsLoading(true);
    if (user.id) handleFilter({ customer_id: user.id });
    else callPaginate();
  }, [user]);

  return (
    <>
      <Header
        title="Units"
        onFilterChange={handleFilterChange}
        dropdownData={dropdownData}
        initialFilters={filtered}
        onSearch={handleSearch}
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
                    {unitTableHead.map(
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
                  {companies?.length > 0 ? (
                    companies?.map(
                      (
                        {
                          id,
                          company_id,
                          company_name,
                          company_number,
                          // trading_style,
                          business_type,
                          funding_purpose,
                          company_status
                        },
                        index
                      ) => (
                        <tr
                          key={index}
                          className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            {company_id || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {company_name.trim().length > 7
                              ? company_name.trim().substring(0, 7) + '...'
                              : company_name.trim() || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{`${company_number || 'N/A'}`}</td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {trading_style}
                          </td> */}
                          <td className="whitespace-nowrap px-6 py-4">{`${funding_purpose || 'N/A'}`}</td>
                          <td className="whitespace-nowrap px-6 py-4">{`${business_type || 'N/A'}`}</td>
                          <td>
                            <span
                              className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                                UnitStatusBadgeClasses[
                                  company_status?.current_status
                                ]
                              }`}
                            >
                              {company_status?.current_status || 'N/A'}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap px-6 py-4">
                            {/* <img
                              src={threeDots}
                              onClick={() => {
                                setUnitId(id);
                                setActionUnitId(id);
                                setIsAction((prevState) =>
                                  actionUnitId !== id ? true : !prevState
                                );
                              }}
                              className="cursor-pointer"
                            />
                            {isAction && actionUnitId === id && (
                              <div className="absolute top-0 right-0 mt-8 z-10">
                                <ActionModal
                                  setIsAction={setIsAction}
                                  setIsModalOpen={setIsModalOpen}
                                />
                              </div>
                            )} */}
                            <button
                              type="button"
                              className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                              onClick={() => {
                                setUnitId(id);
                                setActionUnitId(id);
                                setIsModalOpen(true);
                              }}
                            >
                              {'View'}
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={unitTableHead.length}
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
                {companies?.length > 0 ? (
                  companies.map(
                    (
                      {
                        id,
                        company_id,
                        company_name,
                        company_number,
                        // trading_style,
                        business_type,
                        funding_purpose,
                        company_status
                      },
                      index
                    ) => (
                      <div key={index} className="container mx-auto pt-4">
                        <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="truncate text-lg font-semibold text-gray-800">
                              {company_name || 'N/A'}
                            </div>
                            <img
                              src={threeDots}
                              alt="Actions"
                              className="cursor-pointer"
                              onClick={() => {
                                setUnitId(id);
                                setActionUnitId(id);
                                setIsAction(prevState =>
                                  actionUnitId !== id ? true : !prevState
                                );
                                if (
                                  [Roles.Customer, Roles.Leads].includes(role)
                                ) {
                                  navigate(`/units/${unitId}`);
                                }
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">
                                {'Company ID:'}
                              </span>
                              <span className="block truncate">
                                {company_id || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Company Number:'}
                              </span>
                              <span className="block truncate">
                                {company_number || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Funding Purpose:'}
                              </span>
                              <span className="block truncate">
                                {funding_purpose || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Business Type:'}
                              </span>
                              <span className="block truncate">
                                {business_type || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Company Status:'}
                              </span>
                              <span
                                className={`mt-2 block inline-flex rounded-full px-3 text-xs leading-5 ${
                                  UnitStatusBadgeClasses[company_status]
                                }`}
                              >
                                {company_status || 'N/A'}
                              </span>
                            </div>
                          </div>
                          {isAction && actionUnitId === id && (
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
                      colSpan={unitTableHead.length}
                      className="px-6 py-4 text-center"
                    >
                      {'No data available'}
                    </td>
                  </div>
                )}
              </>
            )}
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
    </>
  );
};
export default Units;
