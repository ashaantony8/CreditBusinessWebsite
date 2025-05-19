import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

// import { useDispatch } from "react-redux";
import { deleteLeadApi, listAndSortLeadsApi } from '../../../api/userServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { leadTableHead } from '../../../utils/data';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import AssignFieldAgentModal from '../common/AssignFieldAgentModal';
// import { resetFundingState } from "../../store/fundingStateReducer";
import DeleteModals from '../common/DeleteModal';
import Header from '../common/Header';
// import AgentLeadModal from "./AgentLeadModal";
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import useDeleteApi from '../common/useDeleteApi';
import usePagination from '../common/usePagination';
import AddLead from './AddLead';

const Leads = () => {
  const { showToast } = useToast();

  // const dispatch = useDispatch();
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
    callPaginate,
    fetchLeadsAdded,
    userPaginateException
  } = usePagination(listAndSortLeadsApi);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAction, setIsAction] = useState(false);
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState([]);

  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');

  const handleSortColumn = column => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('customer_id', customerIdSortOrder);
    }
  };
  //   const handleSortColumn = (column) => {
  //     if (column === "id") {
  //         setCustomerIdSortOrder((prevState) => {
  //             const newSortOrder = prevState === 'asc' ? 'desc' : 'asc';
  //             handleSort('customer_id', newSortOrder);
  //             return newSortOrder;
  //         });
  //     }
  // };
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const { role } = useSelector(authSelector);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setLeads(data);
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
  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setLeadId(null);
  //   dispatch(resetFundingState());
  // };

  const { deleteItem } = useDeleteApi(deleteLeadApi);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    const result = await deleteItem(leadId);
    if (result.success) {
      // setLeads(leads.filter((lead) => lead.id !== result.id));
      // setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== result.id));
      setLeads(prevLeads =>
        prevLeads.filter(lead => {
          return lead.id !== result.id;
        })
      );
    }
    closeDeleteModal();
  };

  const handleAssignFieldAgent = async () => {
    setIsAssignAgentModalOpen(false);
  };

  // useEffect(() => {
  //   if (isModalOpen) {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }

  //   return () => {
  //     document.body.classList.remove("overflow-hidden");
  //   };
  // }, [isModalOpen]);

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
  }, [isAssignAgentModalOpen]);

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

  // const dropdownData = [
  //   {
  //     title: "Mode of Application",
  //     type: "mode_of_application",
  //     items: [
  //       { id: "Self", label: "Self" },
  //       { id: "Representative", label: "Representative" },
  //     ],
  //   },
  //   {
  //     title: "Application Status",
  //     type: "current_status",
  //     items: [
  //       { id: "Inprogress", label: "IN PROGRESS" },
  //       { id: "Submitted", label: "SUBMITTED" },
  //       { id: "Manager_Approved_Waiting", label: "MANAGER APPROVED" },
  //       { id: "Admin_Cash_Dispersed", label: "AMOUNT DISBURSED" },
  //       { id: "Admin_Rejected", label: "ADMIN REJECTED" },
  //       { id: "Manager_Approval_Waiting", label: "Manager Approval Waiting" },
  //       { id: "Admin_Cash_Dispersal_Waiting", label: "Admin Cash Dispersal Waiting" },
  //       { id: "defaultUser", label: "Default User" },
  //     ],
  //   },
  // ];

  const handleAdd = () => {
    setIsOpenAddLead(prevState => !prevState);
  };

  // const initialFilters = {
  //   mode_of_application: [],
  //   current_status: [],
  // };
  const navigate = useNavigate();
  useEffect(() => {
    if (isModalOpen) {
      navigate(`/leads/${leadId}`);
    }
  }, [isModalOpen]);

  return (
    <>
      <Header
        title="Leads"
        // onFilterChange={handleFilterChange}
        // dropdownData={dropdownData}
        // initialFilters={initialFilters}
        onSearch={handleSearch}
        onAdd={handleAdd}
        fetchLeadsDetails={fetchLeadsAdded}
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
                  {leadTableHead.map(
                    ({ name, key }: { name: string; key?: string }, index) => (
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
                {leads?.length > 0 ? (
                  leads?.map(
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
                        <td className="whitespace-nowrap px-6 py-4">
                          {customer_id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {' '}
                          {`${first_name || last_name ? `${first_name} ${last_name}` : 'N/A'}`}
                        </td>
                        {/* <td className="px-6 py-4 ">
                          {company_name.trim().length > 7
                            ? company_name.trim().substring(0, 7) + "..."
                            : company_name.trim()}
                        </td> */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {phone_number ? `+44 ${phone_number}` : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {email || 'N/A'}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {mode_of_application}
                        </td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">{agent}</td> */}
                        <td className="relative whitespace-nowrap px-6 py-4">
                          <img
                            src={threeDots}
                            onClick={() => {
                              setLeadId(id);
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
                                {...([Roles.Manager, Roles.Admin].includes(
                                  role
                                ) && { setIsDeleteModalOpen })}
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
                      colSpan={leadTableHead.length}
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
              {leads?.length > 0 ? (
                leads.map(
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
                    <div key={index} className="container mx-auto pt-4">
                      <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-lg font-semibold text-gray-900">
                            {`${first_name || last_name ? `${first_name} ${last_name}` : 'N/A'}`}
                          </div>
                          <img
                            src={threeDots}
                            alt="Actions"
                            className="cursor-pointer"
                            onClick={() => {
                              setLeadId(id);
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
                              {customer_id || 'N/A'}
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
                              {...([Roles.Manager, Roles.Admin].includes(
                                role
                              ) && { setIsDeleteModalOpen })}
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
                    colSpan={leadTableHead.length}
                    className="px-6 py-4 text-center"
                  >
                    {'No data available'}
                  </td>
                </div>
              )}
            </>
          )}
          <div>
            {isDeleteModalOpen && (
              <DeleteModals
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
              />
            )}

            {/* {leadId && isModalOpen && (
              <AgentLeadModal
                isOpen={isModalOpen}
                leadId={leadId}
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
      {isAssignAgentModalOpen && (
        <AssignFieldAgentModal
          onClose={handleAssignFieldAgent}
          actionLeadId={actionLeadId}
        />
      )}
      {isOpenAddLead && (
        <AddLead
          isOpenAddLead={isOpenAddLead}
          setIsOpenAddLead={setIsOpenAddLead}
        />
      )}
    </>
  );
};

export default Leads;
