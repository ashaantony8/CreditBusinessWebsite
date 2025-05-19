import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Roles } from '../../../utils/enums';
import { BulkUploadFundingsTableHead } from '../../../utils/data';
import Loader from '../../Loader';
import { useMediaQuery } from 'react-responsive';
import usePagination from '../common/usePagination';
import { listBulkuploadLoanApi } from '../../../api/loanServices';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../store/auth/userSlice';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import threeDots from '../../../assets/svg/threeDots.svg';
import ActionModal from '../common/ThreeDotAction';
import DeleteModals from '../common/DeleteModal';
import useToast from '../../../utils/hooks/toastify/useToast';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import { useNavigate } from 'react-router-dom';
import { BulkUploadFundingDetailsProps } from '../../../utils/types';
import UploadFundingModal from './UploadFundingModal';

const BulkUploadFunding: React.FC = () => {
  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSort,
    sortOrder,
    callPaginate,
    userPaginateException
  } = usePagination(listBulkuploadLoanApi);

  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [loans, setLoans] = useState<BulkUploadFundingDetailsProps[]>([]);
  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');

  const [isAction, setIsAction] = useState(false);
  const [actionLoanId, setActionLoanId] = useState(null);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const { role } = useSelector(authSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (isModalOpen) {
      navigate(`/bulk-upload-funding/${actionLoanId}`);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (userPaginateException) {
      showToast(userPaginateException as string, {
        type: NotificationType.Error
      });
      setIsLoading(false);
    }
  }, [userPaginateException]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setLoans(data);
    }
  }, [data]);

  useEffect(() => {
    callPaginate();
  }, []);

  const handleSortColumn = (column: string) => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('loan_number', customerIdSortOrder);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const handleDelete = async () => {
    closeDeleteModal();
  };

  const renderActionColumn = (id: string) => {
    return (
      <td className="relative whitespace-nowrap px-6 py-4">
        {[Roles.Admin].includes(role as Roles) ? (
          <div>
            <img
              src={threeDots}
              onClick={() => {
                setActionLoanId(id);
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
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {'View'}
          </button>
        )}
      </td>
    );
  };

  return (
    <>
      <Header title="Bulk Upload Funding" onAdd={() => setIsOpen(true)} />
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
          {(isLaptop || isTablet) && [Roles.Admin].includes(role as Roles) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {BulkUploadFundingsTableHead.map(
                    ({ name, key }: { name: string; key?: string }, index) => (
                      <th
                        key={index}
                        className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                        onClick={() => handleSortColumn(key || '')}
                      >
                        {name}
                        {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loans.length > 0 ? (
                  loans.map(
                    (
                      {
                        id,
                        created_on,
                        modified_on,
                        processed,
                        success,
                        message,
                        created_by,
                        modified_by
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {created_on
                            ? format(new Date(created_on), 'yyyy-MM-dd HH:mm')
                            : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {modified_on
                            ? format(new Date(modified_on), 'yyyy-MM-dd HH:mm')
                            : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {processed ? 'Yes' : 'No'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {success ? 'Yes' : 'No'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {message || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {created_by || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {modified_by || 'N/A'}
                        </td>
                        {renderActionColumn(id)}
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={BulkUploadFundingsTableHead.length}
                      className="px-6 py-4 text-center"
                    >
                      {'No data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {isMobile && [Roles.Admin].includes(role as Roles) && (
            <>
              {loans.length > 0 ? (
                loans.map((loan, index) => (
                  <div key={index} className="container mx-auto pt-4">
                    <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="truncate text-lg font-semibold text-gray-800">
                          {'Loan #'} {index + 1 || 'N/A'}
                        </div>
                        <img
                          src={threeDots}
                          alt="Actions"
                          className="cursor-pointer"
                          onClick={() => {
                            setActionLoanId(loan.id);
                            setIsAction(prevState =>
                              actionLoanId !== loan.id ? true : !prevState
                            );
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        {BulkUploadFundingsTableHead.map(key => (
                          <div key={key.name}>
                            <span className="font-medium">
                              {key.name.replace(/_/g, ' ').toUpperCase()}:
                            </span>
                            <span className="block truncate">
                              {key.name !== 'action'
                                ? loan[key.key] || 'N/A'
                                : null}
                            </span>
                          </div>
                        ))}
                      </div>
                      {isAction && actionLoanId === loan.id && (
                        <div className="absolute right-0 top-0 z-10 mt-8">
                          <ActionModal
                            setIsAction={setIsAction}
                            setIsModalOpen={setIsModalOpen}
                            setIsDeleteModalOpen={setIsDeleteModalOpen}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">
                  No data available
                </div>
              )}
            </>
          )}
        </div>{' '}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        goToPage={goToPage}
      />

      {isOpen && (
        <UploadFundingModal
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModals
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default BulkUploadFunding;
