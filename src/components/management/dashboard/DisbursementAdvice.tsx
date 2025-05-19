import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { disbursementApi } from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import { updateCurrentStage } from '../../../store/fundingStateReducer';
import {
  DaBankDetailsFields,
  DaDirectorDetailsFields,
  DaFields,
  DaPresentLoanFields,
  DirectorsDefaultValuesDisbursementForm,
  GuarantorDetailsFields,
  loanFormCommonStyleConstant
} from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { formatDate, updateFilledForms } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { disbursementAdviseSchema } from '../../../utils/Schema';
import { arrayfield, LoanFromCommonProps } from '../../../utils/types';
import InputController from '../../commonInputs/Input';

const DisbursementAdvice: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId
  // fundingFormStatus
}) => {
  const { role } = useSelector(authSelector);
  const formRef = useRef<HTMLFormElement>(null);
  if (setRef) {
    setRef(formRef);
  }
  const methods = useForm({
    resolver: yupResolver(disbursementAdviseSchema),
    defaultValues: {
      directors_details: DirectorsDefaultValuesDisbursementForm
    }
  });

  const { handleSubmit, control, reset, getValues } = methods;
  const { fields: directors_details } = useFieldArray({
    control,
    name: 'directors_details'
  });

  const { showToast } = useToast();

  const dispatch = useDispatch();

  const fetchContractDetails = async loanId => {
    const response = await disbursementApi(loanId);
    if (response.status_code === 200) {
      const { data } = response;
      data.directors_details.forEach((_, i) => {
        data.directors_details[i].name =
          `${data.directors_details[i].first_name} ${data.directors_details[i].last_name}  `;
      });
      if (data.guarantors_details) {
        data.guarantors_details.name = `${data.guarantors_details.first_name} ${data.guarantors_details.last_name}  `;
      }

      data.customer_relation_start_date = formatDate(
        data.customer_relation_start_date
      );
      reset(data);
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const onSubmit = () => {
    showToast('Disbursement confirmed', { type: NotificationType.Success });
    updateFilledForms(loanId, {
      complete_disbursement_advice: true
    });
    setTimeout(() => {
      dispatch(updateCurrentStage(12));
    }, 1500);
  };

  useEffect(() => {
    if (loanId && [Roles.Manager, Roles.Admin].includes(role)) {
      // setValue("contractId", loanId);
      fetchContractDetails(loanId);
    }
  }, [loanId]);

  const activeContracts = getValues('active_contracts');
  return (
    <FormProvider {...methods}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="h-[80vh] w-full overflow-auto p-8"
      >
        <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
          {'Disbursement Advice'}
        </p>

        <>
          {/* <div className="grid grid-cols-3 gap-4  p-[2%] max-sm:justify-center  max-lg:grid-cols-1 max-sm:cols-1 ">
            {!loanId && (
              <SearchableDropdownController
                metaData={{
                  fieldClass: loanFormCommonStyleConstant.dropdown.fieldClass,
                  labelClass: loanFormCommonStyleConstant.dropdown.labelClass,
                  errorClass: loanFormCommonStyleConstant.dropdown.errorClass,
                  key: "contractId",
                  placeholder: "Contract Id",
                  isRequired: true,
                  name: `contractId`,
                  label: "Contract Id",
                  type: "dropdown",
                  options: loanIdList,
                  onChange: handleInputChange,
                  // onSelected: handleSelected,
                }}
              />
            )}
          </div> */}
          <div className="grid grid-cols-1 gap-4 p-4 max-sm:justify-center sm:grid-cols-2 lg:grid-cols-3">
            {DaFields.map((field: arrayfield, index) => {
              return (
                <div key={index} className="flex flex-col gap-4">
                  {field.key === 'active_contracts' ? (
                    activeContracts?.length > 0 ? (
                      activeContracts?.map((contract, contractIndex) => (
                        <div
                          key={contractIndex}
                          className="flex flex-col items-start gap-2 rounded-lg border p-4 shadow-md"
                        >
                          <p className="cursor-pointer text-sm text-gray-700">
                            {`Loan Number: ${contract.loan_number} | Outstanding Amount: £${contract.outstanding_amount}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        {'No Existing Contracts'}
                      </p>
                    )
                  ) : (
                    <InputController
                      metaData={{
                        fieldClass: loanFormCommonStyleConstant.text.fieldClass,
                        labelClass: loanFormCommonStyleConstant.text.labelClass,
                        errorClass: loanFormCommonStyleConstant.text.errorClass,
                        key: field.key,
                        placeholder: field.label,
                        isRequired: field?.required,
                        name: field.key,
                        label: field.label,
                        type: 'text',
                        isDisabled: field?.disabled
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
        <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
          {'Directors'}
        </p>
        <div>
          {directors_details.map(field => (
            <div
              key={field.id}
              className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center"
            >
              {DaDirectorDetailsFields.map((i: arrayfield, index) => (
                <InputController
                  key={i.key}
                  metaData={{
                    fieldClass: loanFormCommonStyleConstant.text.fieldClass,
                    labelClass: loanFormCommonStyleConstant.text.labelClass,
                    errorClass: loanFormCommonStyleConstant.text.errorClass,
                    key: i.key,
                    placeholder: i.label,
                    isRequired: i?.required,
                    name: `directors_details[${index}].${i.key}`,
                    label: i.label,
                    type: i.key === 'startDate' ? 'date' : 'text',
                    isDisabled: i?.disabled
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {getValues('guarantors_details') && (
          <>
            <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
              {'Guarantor'}
            </p>
            <div className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center">
              {GuarantorDetailsFields.map((i: arrayfield) => (
                <InputController
                  key={i.key}
                  metaData={{
                    fieldClass: loanFormCommonStyleConstant.text.fieldClass,
                    labelClass: loanFormCommonStyleConstant.text.labelClass,
                    errorClass: loanFormCommonStyleConstant.text.errorClass,
                    key: i.key,
                    placeholder: i.label,
                    isRequired: i?.required,
                    name: `guarantors_details.${i.key}`,
                    label: i.label,
                    type:
                      i.key === 'customer_relation_start_date'
                        ? 'date'
                        : 'text',
                    isDisabled: i?.disabled
                  }}
                />
              ))}
            </div>
          </>
        )}
        <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
          {'Present Loan Details'}
        </p>

        <div className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center">
          {DaPresentLoanFields.map((i: arrayfield, index) => (
            <InputController
              key={index}
              metaData={{
                fieldClass: loanFormCommonStyleConstant.text.fieldClass,
                labelClass: loanFormCommonStyleConstant.text.labelClass,
                errorClass: loanFormCommonStyleConstant.text.errorClass,
                key: i.key,
                placeholder: i.label,
                isRequired: i?.required,
                name: i.key,
                label: i.label,
                type: 'text',
                isDisabled: i?.disabled
              }}
            />
          ))}
        </div>

        <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
          {'Bank Account Details'}
        </p>

        <div className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center">
          {DaBankDetailsFields.map((i: arrayfield, index) => (
            <InputController
              key={index}
              metaData={{
                fieldClass: loanFormCommonStyleConstant.text.fieldClass,
                labelClass: loanFormCommonStyleConstant.text.labelClass,
                errorClass: loanFormCommonStyleConstant.text.errorClass,
                key: i.key,
                placeholder: i.label,
                isRequired: i?.required,
                name: `bank_account_details.${i.key}`,
                label: i.label,
                type: 'text',
                isDisabled: i?.disabled
              }}
            />
          ))}
        </div>

        {/* <button className="bg-blue-900 flex items-center justify-center hover:bg-blue-800 text-white text-[16px] font-medium py-2 px-4 border border-blue-700 rounded ">
          Submit
        </button> */}
      </form>
    </FormProvider>
  );
};

export default DisbursementAdvice;
