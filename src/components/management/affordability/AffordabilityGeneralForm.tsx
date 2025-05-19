import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { postAffordabilityApi } from '../../../api/loanServices';
import { updateCurrentStage } from '../../../store/fundingStateReducer';
import {
  affordabilityApprovalFields,
  fieldClass,
  labelClass
} from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { affordabilityApprovalSchema } from '../../../utils/Schema';
import InputController from '../../commonInputs/Input';
import Loader from '../../Loader';
import { Dispatch, SetStateAction } from 'react';

type Stay = {
  id: number;
  pincode: string;
  address: string;
  house_ownership: string;
  start_date: string;
  end_date: string;
};

type Director = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  owns_other_property: string;
  owned_property_count: number;
  owned_property: unknown[];
  stay: Stay[];
  stay_validated: boolean;
  credit_score: string;
  risk_score: string;
};

type Guarantor = {
  id: number;
  stay: Stay[];
  owned_property: unknown[];
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  guarantor_agreement: boolean;
  is_completed: boolean;
  underwriter_verified: boolean;
  owns_other_property: string;
  owned_property_count: number;
  stay_validated: boolean;
  customer: string;
};

type ExistingContract = {
  loan_id: string;
  outstanding_amount: number;
  loan_number: number;
};

type DataType = {
  id: string;
  directors: Director[];
  guarantors: Guarantor;
  existing_contracts: ExistingContract[];
  total_sales: number;
  total_expenses_considered: number;
  net_sales: number;
  total_liabilities: number;
  gross_affordability_weekly: number;
  net_investment_into_business: number;
  net_affordability_weekly: number;
  sales_for_period_of_statement: number;
  ideal_limit: number;
  max_limit: number;
  cash_sales_not_reflected: number;
  corrected_net_sales: number;
  corrected_gross_affordability: number;
  corrected_net_affordability: number;
  corrected_net_affordability_ideal_amount: number;
  corrected_net_affordability_max_amount: number;
  final_release_amount: number;
  final_release_amount_by_approver: number;
  created_on: string;
  modified_on: string;
  deleted_at: string;
  statement_start_date: string;
  statement_end_date: string;
  period_of_statement: number;
  credit_summation: string;
  debit_summation: string;
  card_sales: string;
  cash_sales: string;
  other_receipts: string;
  ignored_transactions: string;
  previous_sales: string;
  payments: string;
  purchases: string;
  wages: string;
  other_expenses: string;
  paypoint_payzone: string;
  c4b_existing_monthly: string;
  liabilities: string;
  other_monthly_liabilities: string;
  profit_margin: string;
  self_withdrawals: string;
  self_business_contribution: string;
  sales_as_per_till_report: string;
  period_of_till_report_days: number;
  repayment_term: number;
  merchant_factor: string;
  recommended_amount: string;
  remarks: string;
  amount_to_be_adjusted: string;
  sales_as_per_till_report_by_approver: string;
  approved_amount: string;
  remarks_by_approver: string;
  amount_to_be_adjusted_by_approver: string;
  created_by: string;
  modified_by: string;
  company: string;
  customer_loan: string;
};

// Type for individual form fields
type AffordabilityApprovalField = {
  key: string;
  label: string;
  type: 'number' | 'text' | 'email' | 'tel' | 'range' | 'password' | 'date';
  autoFilled: boolean;
};

// Type for the form data
type FormData = {
  [key: string]: string | number; // Modify as needed to match the actual field types
};

// Component props type
type AffordabilityApprovalFormProps = {
  data: { [key: string]: DataType }; // Replace 'any' with a more specific type if possible
  loanId: string;
  setRef: (ref: React.RefObject<HTMLFormElement>) => void;
  fetchData: () => void;
  setAffordabilityActiveStage: Dispatch<SetStateAction<boolean>>;
};

const AffordabilityApprovalForm = ({
  data,
  loanId,
  setRef
}: AffordabilityApprovalFormProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);

  const methods = useForm<FormData>({
    resolver: yupResolver(affordabilityApprovalSchema)
  });

  const { setValue, handleSubmit } = methods;

  // Set the data into the form fields
  const setData = useCallback(() => {
    affordabilityApprovalFields.forEach((field: AffordabilityApprovalField) => {
      const value = data[field.key];
      if (typeof value === 'string' || typeof value === 'number') {
        setValue(field.key, value);
      } else if (typeof value === 'object') {
        setValue(field.key, JSON.stringify(value));
      }
    });
  }, [data, setValue]);

  const dispatch = useDispatch();

  // Form submission handler
  const onSubmit: SubmitHandler<FormData> = async formData => {
    setIsLoading(true);
    try {
      const response = await postAffordabilityApi(formData, loanId);

      if (response?.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });

        setTimeout(() => {
          dispatch(updateCurrentStage(11));
        }, 1500);
      } else {
        console.log('error', response.status_message);
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  // Effect to populate the form when data changes
  useEffect(() => {
    if (data) setData();
  }, [data, setData]);

  return (
    <div className="h-[70vh] overflow-auto max-lg:h-[60vh]">
      <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
        {'Affordability Approval'}
      </p>
      <FormProvider {...methods}>
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center">
            {affordabilityApprovalFields.map(
              (field: AffordabilityApprovalField, index) => (
                <InputController
                  key={index}
                  metaData={{
                    fieldClass: `${fieldClass} ${field.autoFilled && 'bg-gray-200 text-gray-500 cursor-not-allowed'}`,
                    labelClass: labelClass,
                    key: field.key,
                    placeholder: field.label,
                    isRequired: !field.autoFilled,
                    name: field.key,
                    label: field.label,
                    type: field?.type,
                    isFractional: true,
                    isDisabled: field.autoFilled
                  }}
                />
              )
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AffordabilityApprovalForm;
