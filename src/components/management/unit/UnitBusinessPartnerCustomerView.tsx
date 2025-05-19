import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { customerLinkedApi } from '../../../api/userServices';
import { managementSliceSelector } from '../../../store/managementReducer';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';

const UnitBusinessPartnerCustomerView: React.FC<{
  unitId?: number | string;
}> = ({ unitId }) => {
  const { showToast } = useToast();

  const { unit } = useSelector(managementSliceSelector);
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

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (unit.id || unitId) {
      setIsLoading(true);
      handleFilter({ company_id: unit.id || (unitId as string) });
    }
  }, [unit]);

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

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header onSearch={handleSearch} />
      <div className="mt-8 h-[60vh] w-full overflow-y-auto max-lg:h-[65vh]">
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-1 max-md:grid-cols-1">
          {customers?.length > 0 ? (
            customers.map(
              (
                {
                  customer_id,
                  first_name,
                  last_name,
                  company_name,
                  phone_number,
                  email
                },
                index
              ) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-2 rounded-lg border border-gray-400/40 bg-white p-4 shadow-md"
                >
                  <div className="bg-white-300 mb-2 flex flex-wrap items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold uppercase text-gray-700">
                          {first_name && first_name[0]}
                          {last_name && last_name[0]}
                        </div>
                        <div className="text-[12px] font-medium leading-6">
                          <p className="font-semibold text-[#929292]">
                            {'Customer'}
                          </p>
                          {`${first_name} ${last_name}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <a className="text-[13px] text-[#929292]">{'Phone'}</a>
                      <span className="ml-2 text-xs">
                        {phone_number && `+44 ${phone_number}`}
                      </span>
                    </div>
                  </div>

                  <hr />

                  <div className="mt-2 grid grid-cols-2 gap-4 text-[13px] text-gray-800">
                    <p className="mb-2 grid">
                      <strong>{'Customer ID:'}</strong> {customer_id || 'N/A'}
                    </p>
                    <p className="mb-2 grid">
                      <strong>{'Company Name:'}</strong> {company_name || 'N/A'}
                    </p>
                    <p className="mb-2 grid">
                      <strong>{'Email:'}</strong> {email || 'N/A'}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <h1>{'No Data Found'}</h1>
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
    </>
  );
};

export default UnitBusinessPartnerCustomerView;
