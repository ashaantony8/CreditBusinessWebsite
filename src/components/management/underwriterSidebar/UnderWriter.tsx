import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import {
  deleteUnderwriterApi,
  listUnderwriterApi
} from '../../../api/userServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { underwriterTableHead } from '../../../utils/data';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
// import KpiModal from "./KpiModal";
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import DeleteModals from '../common/DeleteModal';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import useDeleteApi from '../common/useDeleteApi';
import usePagination from '../common/usePagination';
import UnderwriterHeader from './UnderWriterHeader';
import UnderwriterModal from './UnderWriterModal';

const Underwriter = () => {
  const { showToast } = useToast();

  const [underwriters, setUnderwriters] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  //   const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [underwriterId, setUnderwriterId] = useState(null);
  const [isAction, setIsAction] = useState(false);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    sortOrder,
    handleSort,
    callPaginate,
    fetchUnderWriterAdded,
    userPaginateException
  } = usePagination(listUnderwriterApi);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setUnderwriters(data);
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

  // for sorting
  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');

  const handleSortColumn = column => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('under_writer_id', customerIdSortOrder);
    }
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const { deleteItem } = useDeleteApi(deleteUnderwriterApi);
  const handleDelete = async () => {
    const result = await deleteItem(underwriterId);
    if (result.success) {
      setUnderwriters(
        underwriters.filter(underwriter => underwriter.id !== underwriterId)
      );
      closeDeleteModal();
    }
  };
  // const closeKpiModal = () => setIsKPIModalOpen(false);
  const closeModal = () => setIsModalOpen(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(true);
      callPaginate();
    }
  }, [isModalOpen]);

  return (
    <>
      <UnderwriterHeader
        onSearch={handleSearch}
        underwriterHeaderDetails={fetchUnderWriterAdded}
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
                  {underwriterTableHead.map(({ name, key }, index) => (
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
                {underwriters?.length > 0 ? (
                  underwriters.map(
                    (
                      {
                        id,
                        under_writer_id,
                        first_name,
                        last_name,
                        phone_number,
                        email
                        // is_active,
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {under_writer_id || 'N/A'}
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
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {is_active}
                        </td> */}
                        <td className="relative whitespace-nowrap px-6 py-4">
                          <img
                            src={threeDots}
                            onClick={() => {
                              setUnderwriterId(id);
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
                                // setIsKPIModalOpen={setIsKPIModalOpen}
                                setIsDeleteModalOpen={setIsDeleteModalOpen}
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
                      colSpan={underwriterTableHead.length}
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
              {underwriters?.length > 0 ? (
                underwriters.map(
                  (
                    {
                      id,
                      under_writer_id,
                      first_name,
                      last_name,
                      phone_number,
                      email,
                      is_active
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
                              setUnderwriterId(id);
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
                              {under_writer_id || 'N/A'}
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
                          <div>
                            <span className="font-medium">{'Status:'}</span>
                            <span className="block truncate">
                              {is_active || 'N/A'}
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
        {underwriterId && (
          <UnderwriterModal
            isOpen={isModalOpen}
            onClose={closeModal}
            userData={underwriterId}
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

export default Underwriter;
