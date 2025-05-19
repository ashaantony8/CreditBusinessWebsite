import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';

import { addKpiApi } from '../../../api/userServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { ClientFormSchema } from '../../../utils/Schema';
import { ClientFormData } from '../../../utils/types';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
}

const KpiModal = ({ isOpen, onClose, agentId }: KpiModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientFormData>({
    resolver: yupResolver(ClientFormSchema)
  });

  const { showToast } = useToast();

  const onSubmit: SubmitHandler<ClientFormData> = async formData => {
    try {
      const response = await addKpiApi({ ...formData, field_agent: agentId });
      showToast(response.status_message, { type: NotificationType.Success });
      onClose();
      reset();
    } catch (error) {
      showToast(error.status_message || 'Something went wrong', {
        type: NotificationType.Error
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-md px-4 md:h-auto">
        <div className="relative bg-white shadow">
          <div className="flex justify-between px-6 pt-6">
            <p className="my-1 text-[20px] font-semibold">{'KPI'}</p>
            <button
              onClick={onClose}
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between px-6 pb-6 text-[#000000]"
          >
            <div className="grid py-4">
              <input
                {...register('number_of_client_target')}
                type="text"
                className="w-full appearance-none border-b border-stone-300 bg-white py-[4px] pt-4 text-base text-stone-500 placeholder:text-[12px] placeholder:font-light focus:outline-none"
                placeholder="Number of Client Targets"
              />
              {errors.number_of_client_target && (
                <p className="text-sm text-red-500">
                  {errors.number_of_client_target.message}
                </p>
              )}

              <input
                {...register('fund_disbursement_target')}
                type="text"
                className="w-full appearance-none border-b border-stone-300 bg-white py-[4px] pt-4 text-base text-stone-500 placeholder:text-[12px] placeholder:font-light focus:outline-none"
                placeholder="Fund Disbursement Target"
              />
              {errors.fund_disbursement_target && (
                <p className="text-sm text-red-500">
                  {errors.fund_disbursement_target.message}
                </p>
              )}
            </div>

            <div className="flex justify-center py-6">
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
  );
};

export default KpiModal;
