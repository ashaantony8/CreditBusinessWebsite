import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CiFilter } from 'react-icons/ci';
import { FiPlus } from 'react-icons/fi';
import { LiaUsersCogSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { addFieldAgentApi } from '../../../api/userServices';
import { authSelector } from '../../../store/auth/userSlice';
import {
  loanFormCommonStyleConstant,
  manageFieldAgent
} from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { ManageFieldAgentSchema } from '../../../utils/Schema';
import { ManageFieldAgentInterface } from '../../../utils/types';
import FieldRenderer from '../../commonInputs/FieldRenderer';
import Loader from '../../Loader';
import Filter from '../common/Filtex';
import Header, { HeaderProps } from '../common/Header';

//new code for filter access
type FiledAgentHeaderProps = HeaderProps;

const FieldAgentHeader: React.FC<FiledAgentHeaderProps> = ({
  onSearch,
  onFilterChange,
  dropdownData,
  initialFilters,
  fetchFieldDetails
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fieldRenderer = new FieldRenderer(
    manageFieldAgent,
    loanFormCommonStyleConstant,
    ManageFieldAgentSchema
  );
  const methods = useForm<ManageFieldAgentInterface>({
    resolver: yupResolver(ManageFieldAgentSchema)
  });
  const { role } = useSelector(authSelector);

  const { handleSubmit, reset } = methods;
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = async (data: ManageFieldAgentInterface) => {
    try {
      setIsLoading(true);
      const response = await addFieldAgentApi(data);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        toggleModal();
        await fetchFieldDetails();
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Failed to add field agent:', error);
      showToast('Failed to add field agent', { type: NotificationType.Error });
    }
    setIsLoading(false);
  };

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  // prevent bsckground scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      reset();
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen, reset]);

  const onError = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
  };
  const [isFilterOpened, setFilterOpened] = useState(false);

  // to close the filter component in the child component
  const setFilterHanlder = () => {
    setFilterOpened(false);
  };

  return (
    <FormProvider {...methods}>
      <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-gray-200 bg-white">
        <Header title="Field Agent" onSearch={onSearch} />
        {(isLaptop || isTablet) && (
          <div className="flex items-center pr-4">
            <>
              {[Roles.Admin, Roles.Manager].includes(role) && (
                <button
                  onClick={toggleModal}
                  className="flex items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
                  type="button"
                >
                  <FiPlus size={16} className="mr-2" />
                  {'Add'}
                </button>
              )}
              {onFilterChange && (
                // <div className="w-[150px] text-gray-900">
                <div className="group relative w-full">
                  <button
                    onClick={() => setFilterOpened(prevState => !prevState)}
                    className="text-site focus:border-brand peer flex items-center justify-between rounded bg-transparent px-3 py-2.5 font-semibold focus:outline-none focus:ring-0 md:text-sm"
                  >
                    <CiFilter className="ml-3 h-5 w-6 text-gray-400 hover:text-gray-500" />
                    <a className="text-[14px] tracking-wide text-[#929292]">
                      {'Filter'}
                    </a>
                  </button>

                  {isFilterOpened && (
                    <Filter
                      closeFilterHandler={setFilterHanlder}
                      isOpen={isFilterOpened}
                      onFilterChange={onFilterChange}
                      initialFilters={initialFilters}
                      dropdownData={dropdownData}
                    />
                  )}
                </div>
                // </div>
              )}
            </>
          </div>
        )}
        {isMobile && (
          <div className="flex items-center">
            {[Roles.Admin, Roles.Manager].includes(role) && (
              <>
                <button
                  onClick={toggleModal}
                  className="flex items-center rounded-lg border bg-transparent px-2 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
                  type="button"
                >
                  <FiPlus size={16} className="mr-2" />
                  {'Add'}
                </button>
                <CiFilter className="ml-3 h-5 w-6 text-gray-400 hover:text-gray-500" />
              </>
            )}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          {isLoading && (
            <div
              aria-hidden="true"
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
            >
              <Loader />
            </div>
          )}
          <div className="relative w-full max-w-md md:h-auto">
            <div className="relative bg-white px-2 shadow">
              <div className="flex justify-end px-4 pt-6">
                <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-[#1A439A]">
                  <LiaUsersCogSolid size={24} />
                </div>
                <p className="my-1 pl-2 text-[15px] font-medium">
                  {'Create Field Agent Form'}
                  <div className="text-[10.5px] text-[#656565]">
                    {'Hey! you can create a Field Agent from Here!'}
                  </div>
                </p>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <form
                className="px-2 pb-6 text-[#000000]"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="h-[350px] overflow-y-scroll py-4">
                  <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    <div className="">
                      {fieldRenderer.renderField(['first_name'])}
                    </div>
                    <div className="">
                      {fieldRenderer.renderField(['last_name'])}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['email'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['phone_number'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['address'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['description'])}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-2">
                  <input
                    type="submit"
                    value="SUBMIT"
                    className="w-full rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
};

export default FieldAgentHeader;
