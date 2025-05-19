import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { deleteReferralAPI, listReferralApi } from '../../../api/userServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { managementSliceSelector } from '../../../store/managementReducer';
import {
  ReferralStatusBadgeClasses,
  refferalTableHead
} from '../../../utils/data';
import { ReferralStatus, ReferralStatusEnum } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import DeleteModals from '../common/DeleteModal';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import useDeleteApi from '../common/useDeleteApi';
import usePagination from '../common/usePagination';
import ReferralHeader from './ReferralHeader';
import ReferralModal from './ReferralModal';

const ReferralMain = () => {
  const { showToast } = useToast();
  const [referrals, setReferrals] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralId, setReferrald] = useState(null);
  const [isAction, setIsAction] = useState(false);
  const [actionLeadId, setActionLeadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const { user } = useSelector(managementSliceSelector);

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(listReferralApi);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setReferrals(data);
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

  const [filtered, setFiltered] = useState({
    referral_status: []
  });
  // Function to update referral status in the referrals
  const updateReferralStatus = updatedReferral => {
    setReferrals(prevReferrals =>
      prevReferrals.map(referral =>
        referral.id === updatedReferral.id
          ? { ...referral, referral_status: updatedReferral.referral_status }
          : referral
      )
    );
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { deleteItem } = useDeleteApi(deleteReferralAPI); // Use the custom hook
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    const result = await deleteItem(referralId);
    if (result.success) {
      setReferrals(referrals.filter(referral => referral.id !== referralId));
    }
    closeDeleteModal();
  };
  // filter code new
  const dropdownData = [
    {
      title: 'Referral Status',
      type: 'referral_status',
      items: [
        { id: 'Received_Benefit', label: 'Received Benefit' },
        { id: 'Referred', label: 'Referred' },
        { id: 'Loan_Sanctioned', label: 'Loan Sanctioned' }
      ]
    }
  ];

  const handleFilterChange = newFilters => {
    setIsLoading(true);
    setFiltered(newFilters);
    handleFilter({
      ...(user.id && { customer_id: user.id }),
      referral_status: newFilters.referral_status
    });
  };

  // pagination new code
  useEffect(() => {
    setIsLoading(true);
    if (user.id) handleFilter({ customer_id: user.id });
    else callPaginate();
  }, [user]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <ReferralHeader
        title="Referral"
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        dropdownData={dropdownData}
        initialFilters={filtered}
      />
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {refferalTableHead.map((leadTableHead, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                    >
                      {leadTableHead.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {referrals?.length > 0 ? (
                  referrals?.map(
                    (
                      {
                        id,
                        referral_id,
                        first_name,
                        last_name,
                        phone_number,
                        email,
                        business_name,
                        refered_by,
                        // assigned_field_agent,
                        assigned_manager,
                        referral_status
                        // referral
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {referral_id || 'N/A'}
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
                        <td className="px-6 py-4">
                          {business_name
                            ? business_name.length > 7
                              ? business_name.substring(0, 7) + '...'
                              : business_name
                            : 'N/A'}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          {`${refered_by.first_name || refered_by.last_name ? `${refered_by.first_name} ${refered_by.last_name}` : 'N/A'}`}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {assigned_field_agent}
                        </td> */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {assigned_manager || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`mt-2 inline-flex rounded-full px-3 text-xs leading-5 max-sm:text-[9px] ${
                              ReferralStatusBadgeClasses[referral_status] ||
                              ReferralStatusBadgeClasses[
                                ReferralStatus.Referred
                              ]
                            }`}
                          >
                            {ReferralStatusEnum[referral_status] ||
                              ReferralStatusEnum[ReferralStatus.Referred]}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap px-6 py-4">
                          <img
                            src={threeDots}
                            onClick={() => {
                              setReferrald(id);
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
                      colSpan={refferalTableHead.length}
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
              {referrals?.length > 0 ? (
                referrals.map(
                  (
                    {
                      id,
                      referral_id,
                      first_name,
                      last_name,
                      phone_number,
                      email,
                      business_name,
                      refered_by,
                      assigned_manager,
                      referral_status
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
                              setReferrald(id);
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
                              {referral_id || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Business Name:'}
                            </span>
                            <span className="block truncate">
                              {business_name || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{'Phone:'}</span>
                            <span className="block truncate">
                              {phone_number ? `+44 ${phone_number}` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Referred By:'}
                            </span>
                            <span className="block truncate">{`${refered_by.first_name || refered_by.last_name ? `${refered_by.first_name} ${refered_by.last_name}` : 'N/A'}`}</span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Assigned Manager:'}
                            </span>
                            <span className="block truncate">
                              {assigned_manager || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{'Email:'}</span>
                            <span className="block truncate">
                              {email || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Referral Status:'}
                            </span>

                            <span
                              className={`mt-2 block inline-flex truncate rounded-full px-3 text-xs leading-5 max-sm:text-[9px] ${
                                ReferralStatusBadgeClasses[referral_status] ||
                                ReferralStatusBadgeClasses[
                                  ReferralStatus.Referred
                                ]
                              }`}
                            >
                              {ReferralStatusEnum[referral_status] ||
                                ReferralStatusEnum[ReferralStatus.Referred]}
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
                <div className="container mx-auto pt-4">
                  <div className="border border-gray-300 bg-white p-4 text-center">
                    {'No data available'}
                  </div>
                </div>
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
        <ReferralModal
          isOpen={isModalOpen}
          onClose={closeModal}
          referral={referralId}
          updateReferralStatus={updateReferralStatus}
        />
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

export default ReferralMain;
