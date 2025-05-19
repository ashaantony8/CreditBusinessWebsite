import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import {
  deleteFieldAgentApi,
  listFieldAgentApi
} from '../../../api/userServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { fieldAgentTableHead } from '../../../utils/data';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import DeleteModals from '../common/DeleteModal';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import useDeleteApi from '../common/useDeleteApi';
import usePagination from '../common/usePagination';
import FiledAgentHeader from './FiledAgentHeader';
import FiledAgentModal from './FiledAgentModal';
import KpiModal from './KpiModal';

const FieldAgent = () => {
  const { showToast } = useToast();

  const [fieldAgents, setFieldAgents] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isIsKPIModalOpen, setIsKPIModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [isAction, setIsAction] = useState(false);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useSelector(authSelector);

  const {
    data,
    currentPage,
    totalPages,
    // filter,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    sortOrder,
    handleSort,
    // handleFilter,
    callPaginate,
    fetchFieldAdded,
    userPaginateException
  } = usePagination(listFieldAgentApi);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setFieldAgents(data);
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
  // sort code
  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');

  const handleSortColumn = column => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('agent_id', customerIdSortOrder);
    }
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const { deleteItem } = useDeleteApi(deleteFieldAgentApi); // Use the custom hook
  const handleDelete = async () => {
    const result = await deleteItem(agentId);
    if (result.success) {
      setFieldAgents(
        fieldAgents.filter(fieldAgent => fieldAgent.id !== agentId)
      );
      closeDeleteModal();
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const closeKpiModal = () => setIsKPIModalOpen(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  // filter code new
  // const [filtered, setFiltered] = useState({agent_status:[],});

  // const dropdownData = [
  //   {
  //     title: "Status",
  //     type: "agent_status",
  //     items: [
  //       { id: "Active", label: "Active" },
  //       { id: "In-Active", label: "In-Active" },
  //     ],
  //   },
  // ];
  // const initialFilters = {
  //   current_status: [],
  // };

  // const handleFilterChange = (newFilters) => {
  //   handleFilter({
  //     ...filter,
  //     agent_status: newFilters.current_status?.[0] || "",
  //   });
  // };
  // const handleFilterChange = (newFilters) => {
  //   setFiltered(newFilters);
  //   setIsLoading(true);
  //   handleFilter({
  //     ...filter,
  //     agent_status: newFilters.agent_status,
  //   });
  // };

  // for pagination new code
  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(true);
      callPaginate();
    }
  }, [isModalOpen]);

  return (
    <>
      <FiledAgentHeader
        title="Field Agent"
        onSearch={handleSearch}
        // onFilterChange={handleFilterChange}
        // dropdownData={dropdownData}
        // initialFilters={filtered}
        fetchFieldDetails={fetchFieldAdded}
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
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {fieldAgentTableHead.map(({ name, key }, index) => (
                    <th
                      key={index}
                      className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                      onClick={() => handleSortColumn(key)}
                    >
                      {name}
                      {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {fieldAgents?.length > 0 ? (
                  fieldAgents?.map(
                    (
                      {
                        id,
                        agent_id,
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
                        <td className="whitespace-nowrap px-6 py-4">
                          {agent_id || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {`${first_name || last_name ? `${first_name} ${last_name}` : 'N/A'}`}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {phone_number ? `+44 ${phone_number}` : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {email || 'N/A'}
                        </td>

                        <td className="relative whitespace-nowrap px-6 py-4">
                          {[Roles.Admin, Roles.Manager].includes(role) ? (
                            <div>
                              <img
                                src={threeDots}
                                onClick={() => {
                                  setAgentId(id);
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
                                    setIsKPIModalOpen={setIsKPIModalOpen}
                                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              key={index}
                              type="button"
                              className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                              onClick={() => {
                                setAgentId(id);
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
                      colSpan={fieldAgentTableHead.length}
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
              {fieldAgents?.length > 0 ? (
                fieldAgents.map(
                  (
                    {
                      id,
                      agent_id,
                      first_name,
                      last_name,
                      phone_number,
                      email
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-lg font-semibold text-gray-800">
                            {`${first_name || last_name ? `${first_name} ${last_name}` : 'N/A'}`}
                          </div>
                          <img
                            src={threeDots}
                            alt="Actions"
                            className="cursor-pointer"
                            onClick={() => {
                              setAgentId(id);
                              setActionLeadId(id);
                              setIsAction(prevState =>
                                actionLeadId !== id ? true : !prevState
                              );
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{'ID:'}</span>
                            <span className="block truncate">
                              {agent_id || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{'Phone:'}</span>
                            <span className="block truncate">
                              {phone_number ? `+44 ${phone_number}` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{'Email:'}</span>
                            <span className="block truncate">
                              {email || 'N/A'}
                            </span>
                          </div>
                        </div>
                        {isAction && actionLeadId === id && (
                          <div className="absolute right-0 top-0 z-20 mt-12">
                            <ActionModal
                              setIsAction={setIsAction}
                              setIsModalOpen={setIsModalOpen}
                              setIsDeleteModalOpen={setIsDeleteModalOpen}
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
        {isDeleteModalOpen && (
          <DeleteModals
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={handleDelete}
          />
        )}
        {agentId && (
          <FiledAgentModal
            isOpen={isModalOpen}
            onClose={closeModal}
            userData={agentId}
          />
        )}
        {isIsKPIModalOpen && (
          <KpiModal
            isOpen={isIsKPIModalOpen}
            onClose={closeKpiModal}
            agentId={agentId}
          />
        )}
      </div>
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

export default FieldAgent;
