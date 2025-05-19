import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import { bpAddRemoveApi } from '../../../api/loanServices';
import {
  customerLinkedApi
  // listBusinessPartnersApi,
} from '../../../api/userServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { managementSliceSelector } from '../../../store/managementReducer';
import { unitCustomerLinkedTableHead } from '../../../utils/data';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import UnlinkModals from '../common/UnlinkModal';
import usePagination from '../common/usePagination';
import UnitCustomerSelectModal from './UnitCustomerSelectModal';

function UnitBusinessPartner() {
  const { showToast } = useToast();

  const { unit } = useSelector(managementSliceSelector);
  // const isUnitHasAnyLoan = false;
  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    handleFilter,
    userPaginateException
  } = usePagination(customerLinkedApi);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [customers, setCustomers] = useState([]);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [isAction, setIsAction] = useState(false);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filtered, setFiltered] = useState({ role: [] });
  const [openSelectCustomerModal, setOpenSelectCustomerModal] = useState(false);

  const closeUnlinkModal = () => setIsUnlinkModalOpen(false);

  useEffect(() => {
    if (unit.id) {
      setIsLoading(true);
      handleFilter({ company_id: unit.id });
    }
  }, [unit, isUnlinkModalOpen, openSelectCustomerModal]);

  const navigate = useNavigate();

  const handleUnlink = async () => {
    const payload = {
      unit_id: unit.id,
      remove_customers: [customerId]
    };
    try {
      const response = await bpAddRemoveApi(payload);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast('User UnLinked Successfully.', {
          type: NotificationType.Success
        });
        closeUnlinkModal();
      } else {
        showToast('Something went wrong.', {
          type: NotificationType.Error
        });
      }
    } catch {
      showToast('Something went wrong.', {
        type: NotificationType.Error
      });
    }
  };

  const handleLink = async selectedCustomers => {
    const payload = {
      unit_id: unit.id,
      add_customers: selectedCustomers
    };
    // payload.remove_customers.push(customerId)

    try {
      const response = await bpAddRemoveApi(payload);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast('User Linked Successfully.', {
          type: NotificationType.Success
        });
        setOpenSelectCustomerModal(false);
      } else {
        showToast('Something went wrong.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log(error);
      showToast('Something went wrong.', {
        type: NotificationType.Error
      });
    }
  };

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setCustomers(data);
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
    if (isModalOpen) {
      navigate(`/customer/${customerId}`);
    }
  }, [isModalOpen]);

  const dropdownData = [
    {
      title: 'Role',
      type: 'role',
      items: [
        { id: 'LEADS', label: 'Lead' },
        { id: 'CUSTOMER', label: 'Customer' }
      ]
    }
  ];

  const handleFilterChange = newFilters => {
    setFiltered(newFilters);
    setIsLoading(true);
    handleFilter({
      ...(unit.id && { company_id: unit.id }),
      role: newFilters.role
    });
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header
        title="Customers Linked "
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        dropdownData={dropdownData}
        initialFilters={filtered}
        onAdd={() => setOpenSelectCustomerModal(true)}
      />
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <>
              <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
                <thead className="bg-[#D3D3D3]">
                  <tr>
                    {unitCustomerLinkedTableHead.map(({ name }, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customers?.length > 0 ? (
                    customers?.map(
                      (
                        {
                          id,
                          customer_id,
                          first_name,
                          last_name,
                          phone_number,
                          email
                        },
                        index
                      ) => (
                        <tr
                          key={index}
                          className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                        >
                          {/* <td className="px-6 py-4 whitespace-nowrap">{id}</td> */}
                          <td className="whitespace-nowrap px-6 py-4">{`${customer_id} `}</td>
                          <td className="px-6 py-4">
                            {`${first_name} ${last_name}`}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {phone_number && `+44 ${phone_number}`}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            {email}
                          </td>
                          <td className="relative whitespace-nowrap px-6 py-4">
                            <img
                              src={threeDots}
                              onClick={() => {
                                setCustomerId(id);
                                setActionLeadId(id);
                                setIsAction(prevState =>
                                  actionLeadId !== id ? true : !prevState
                                );
                              }}
                              className="cursor-pointer"
                            />
                            {isAction && actionLeadId === id && (
                              <div className="absolute right-0 top-0 z-10 mt-8">
                                <ActionModal
                                  setIsAction={setIsAction}
                                  setIsModalOpen={setIsModalOpen}
                                  setIsUnlinkModalOpen={setIsUnlinkModalOpen}
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
                        colSpan={unitCustomerLinkedTableHead.length}
                        className="px-6 py-4 text-center"
                      >
                        {'No data available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {isMobile && (
            <>
              {customers?.length > 0 ? (
                customers.map(
                  (
                    {
                      id,
                      customer_id,
                      first_name,
                      last_name,
                      company_name,
                      phone_number,
                      email
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="relative mb-4 flex items-center justify-between rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        {/* Customer Information Section */}
                        <div className="flex flex-col gap-2 text-gray-700">
                          <div className="text-xs font-medium text-gray-500">
                            {customer_id || 'N/A'}
                          </div>
                          <div className="text-base font-semibold text-gray-800">
                            {`${first_name || ''} ${last_name || ''}`.trim() ||
                              'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {company_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {phone_number ? `+44 ${phone_number}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {email || 'N/A'}
                          </div>
                        </div>

                        {/* Actions Section */}
                        <div className="relative flex items-center text-[#1A439A]">
                          <img
                            src={threeDots}
                            alt="Actions"
                            className="cursor-pointer"
                            onClick={() => {
                              setCustomerId(id);
                              setActionLeadId(id);
                              setIsAction(prevState =>
                                actionLeadId !== id ? true : !prevState
                              );
                            }}
                          />
                          {isAction && actionLeadId === id && (
                            <div className="absolute right-0 top-0 z-10 mt-8">
                              <ActionModal
                                setIsAction={setIsAction}
                                setIsModalOpen={setIsModalOpen}
                                setIsUnlinkModalOpen={setIsUnlinkModalOpen}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="py-4 text-center text-gray-500">
                  {'No data available'}
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
      {isUnlinkModalOpen && (
        <UnlinkModals
          isOpen={isUnlinkModalOpen}
          onClose={closeUnlinkModal}
          onUnlink={handleUnlink}
        />
      )}
      {openSelectCustomerModal && (
        <UnitCustomerSelectModal
          close={() => {
            setOpenSelectCustomerModal(false);
          }}
          link={handleLink}
          notInCompanyId={unit.id}
        />
      )}
    </>
  );
}

export default UnitBusinessPartner;
