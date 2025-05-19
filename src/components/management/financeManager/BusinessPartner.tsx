import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { financeListApi } from '../../../api/financeManagerServices';
import { businessPartnersHead } from '../../../utils/data';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddOrEditBusinessPartner from './AddOrEditBusinessPartner';

interface BusinessPartnerData {
  id?: string;
  group?: string;
  groupName?: string;

  name?: string;
  email?: string;
  mobile?: string;
  glId?: string;
  glName?: string;
  gl_code?: string;
}

const BusinessPartner: React.FC = () => {
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingPartner, setEditingPartner] =
    useState<BusinessPartnerData | null>(null);
  const [businessPartners, setBusinessPartners] = useState<
    BusinessPartnerData[]
  >([]);
  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    sortOrder,
    // handleSort,
    callPaginate,
    // fetchUnderWriterAdded
    userPaginateException
  } = usePagination(financeListApi);

  useEffect(() => {
    if (data) {
      const fetchedPartners = data.map(partner => ({
        id: partner.partner_code,
        group: partner.partner_type.id,
        groupName: partner.partner_type.group_name,
        name: partner.partner_name,
        email: partner.email,
        mobile: partner.phone_number,
        glName: `${partner.gl_account.gl_code} - ${partner.gl_account.gl_name}`,
        glId: partner.gl_account.id
      }));
      setBusinessPartners(fetchedPartners);
      setIsLoading(false);
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
    callPaginate();
  }, []);

  useEffect(() => {
    if (!isAddEditModalOpen) {
      setEditingPartner(null);
    }
  }, [isAddEditModalOpen]);

  const handleEdit = (partner: BusinessPartnerData) => {
    setEditingPartner(partner);
    setIsAddEditModalOpen(true);
  };

  const handleAddEditModalOpen = () => {
    setIsAddEditModalOpen(true);
  };

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      <Header
        title="Business Partner"
        onAdd={handleAddEditModalOpen}
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
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {businessPartnersHead?.map(({ name, key }, index) => (
                    <th
                      key={index}
                      className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                    >
                      {name}
                      {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {businessPartners.length > 0 ? (
                  businessPartners.map((partner, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      onClick={() => handleEdit(partner)}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {partner.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {partner.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {partner.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {partner.mobile}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {partner.groupName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {partner.glName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={businessPartnersHead?.length}
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
              {businessPartners.length > 0 ? (
                businessPartners.map((partner, index) => (
                  <div key={index} className="container mx-auto pt-4">
                    <div className="mb-4 flex items-center justify-between border border-[#C5C5C5] bg-[#FFFFFF] p-4">
                      <div className="flex items-center font-medium">
                        <div>
                          <div className="text-[10px]"> {partner.id}</div>
                          <div className="text-[12px] font-medium">
                            {' '}
                            {partner.name}
                          </div>
                          <div className="py-1 text-[9px]">{partner.email}</div>
                          <div className="text-[9px]">{partner.mobile}</div>
                          <div className="py-1 text-[9px]">
                            {' '}
                            {partner.groupName}
                          </div>
                          <div className="text-[9px]">{partner.glName}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <td
                    colSpan={businessPartnersHead?.length}
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

      <AddOrEditBusinessPartner
        setBusinessPartners={setBusinessPartners}
        businessPartners={businessPartners}
        editingPartner={editingPartner}
        setIsAddEditModalOpen={setIsAddEditModalOpen}
        isAddEditModalOpen={isAddEditModalOpen}
      />

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

export default BusinessPartner;
