import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { assignAgentPostAPI } from '../../../api/loanServices';
import { listAgentsApi } from '../../../api/userServices';
import share from '../../../assets/images/share.png';
import {
  assignFieldAgentformFields,
  loanFormCommonStyleConstant
} from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { AssignFieldAgentformSchema } from '../../../utils/Schema';
import { AssignFieldAgentFormFieldType } from '../../../utils/types';
import FieldRenderer from '../../commonInputs/FieldRenderer';
import Loader from '../../Loader';

const AssignFieldAgentModal = ({ onClose, actionLeadId }) => {
  const fieldRenderer = new FieldRenderer(
    assignFieldAgentformFields,
    loanFormCommonStyleConstant,
    AssignFieldAgentformSchema
  );
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [agents, setAgents] = useState([]);
  const [agentIds, setAgentIds] = useState([]);

  const methods = useForm({
    resolver: yupResolver(AssignFieldAgentformSchema)
  });

  const { handleSubmit } = methods;
  const onSubmit = async (data: AssignFieldAgentFormFieldType) => {
    try {
      setIsLoading(true);
      const payload = {
        customer_id: actionLeadId,
        field_agent_id: agents.filter(
          item => item?.agent_id == data.field_agent_id
        )?.[0]?.id
      };
      const response = await assignAgentPostAPI(payload);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        onClose();
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const listAgentsApiResponse = await listAgentsApi({ searchQuery: '' });

      if (listAgentsApiResponse?.status_code == 200) {
        setAgents(listAgentsApiResponse.data);
        setAgentIds(listAgentsApiResponse.data.map(item => item?.agent_id));
      } else {
        showToast(listAgentsApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <FormProvider {...methods}>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
      >
        <div className="relative w-full max-w-md px-4 md:h-auto">
          <div className="relative bg-white shadow">
            <div className="flex justify-end px-6 pt-6">
              <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-white">
                <img src={share} alt="Share" />
              </div>
              <p className="my-1 pl-4 text-[15px] font-medium">
                {'Assign Agent Form'}
                <div className="text-[10.5px] text-[#656565]">
                  {'Assign agent to leads'}
                </div>
              </p>
              <button
                onClick={onClose}
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="grid items-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-[350px] overflow-y-scroll px-6 pb-6 text-[#000000]"
                action="#"
              >
                {isLoading && (
                  <div
                    aria-hidden="true"
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
                  >
                    <Loader />
                  </div>
                )}
                <div className="w-full py-4">
                  {fieldRenderer.renderField(['field_agent_id'], {
                    options: agentIds,
                    type: 'dropdown'
                  })}
                </div>

                <div className="flex justify-center pb-6">
                  <button
                    type="submit"
                    className="w-80 rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800"
                  >
                    {'SUBMIT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AssignFieldAgentModal;
