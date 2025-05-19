import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFieldArrayUpdate,
  UseFormClearErrors,
  UseFormReturn
} from 'react-hook-form';
import { AnyAction, Reducer } from 'redux';
import yup from 'yup';

import { ApprovalType, FundingFromCurrentStatus, Roles } from './enums';
import {
  affordabilityGrossSchema,
  cashReceiptSchema,
  paymentArrangementPlanSchema,
  subscriptiontSchema
} from './Schema';

export interface FormData {
  firstName: string;
  lastName: string;
  age: number;
}

export type personalInformationType = {
  pincode: string;
  address: string;
  title: 'Mr' | 'Mrs' | 'Miss';
  first_name: string;
  last_name: string;
  is_major: boolean;
  email: string;
  phone_number: string;
  fund_request_amount: number;
  fund_request_duration_weeks: number;
  is_otp_verified: boolean;
  agree_terms_and_conditions: boolean | undefined;
  repayment_day_of_week:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  agree_communication_authorization: boolean | undefined;
  company: {
    company_name: string;
    business_type: 'Limited Company' | 'Limited Partnership' | 'Sole Trader';
    trading_style: string;
    company_number: string;
    funding_purpose:
      | 'Hire Staff'
      | 'Management Buyout'
      | 'Marketing'
      | 'Moving premises'
      | 'Full-fill a order or contract'
      | 'Pay a due bill'
      | 'Pay HMRC'
      | 'Pay Staff'
      | 'Purchase Stock'
      | 'Purchase equipment'
      | 'Refinance Debt'
      | 'Upgrade Website'
      | 'Business Expansion'
      | 'Working Capital/Cash flow'
      | 'Other (please specify)';
    other_funding_purpose?: string;
    company_status?: string;
  };
  agree_authorization: boolean | undefined;
  is_pending_threatened_or_recently: boolean | undefined;
  mode_of_application: 'Self' | 'Representative' | undefined;
  representatives: string;
};

export type PremiseDetailsType = {
  address_line: string;
  town_city: string;
  post_code: string;
  premise_type: 'Freehold' | 'Leasehold' | 'Lease';
  start_date?: string;
  end_date?: string;
  document?: File[];
};

export type BusinessPremiseDetailsType = {
  registered_address: PremiseDetailsType;
  trading_same_as_registered?: boolean;
  trading_address?: PremiseDetailsType;
};

export type NameSubSchemaType = {
  title?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  owns_other_property?: 'Yes' | 'No';
  stay_validated?: boolean;
  stay?: {
    pincode?: string;
    address?: string;
    house_ownership?: string;
    start_date?: string;
    end_date?: string;
  }[];
};

export type DirectorOrProprietorDetailsType = {
  directors: NameSubSchemaType[];
};

type MarketingPreferencesSubType = {
  email: boolean;
  post: boolean;
  sms: boolean;
  social_media: boolean;
  telephone: boolean;
};

export type MarketingPreferencesType = {
  receiving_marketing_info: MarketingPreferencesSubType;
  sending_marketing_information: MarketingPreferencesSubType;
  third_party_sharing: MarketingPreferencesSubType;
};

export type DocumentationUploadsType = {
  photo?: File;
  passport?: File;
  driving_license?: File;
  council_tax: File;
  utility_bill: File;
  lease_deed?: File;
  // business_account_statements?: File[];
  other_files?: File[];
  document_upload_self_declaration?: boolean;
};

// export type ProfileUploadsType = {
//   photoId: File | null;
//   addressProof: File | null;
//   title: string;
//   firstName: string;
//   lastName: string;
//   // utility_bill_of_trading_business: File[];
//   // lease_deed: File[];
//   // business_account_statement: File[];
//   // other_files: File[];
//   // document_upload_self_declaration: boolean;

// };

export interface GuarantorTypeSubSchemaType {
  title?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  owns_other_property?: 'Yes' | 'No';
  stay_validated?: boolean;
  stay?: {
    pincode?: string;
    address?: string;
    house_ownership?: string;
    start_date?: string;
    end_date?: string;
  }[];
}
export type GuarantorType = {
  guarantors: GuarantorTypeSubSchemaType[];
};

export type LoanFormType = {
  personalInformation: Partial<personalInformationType>;
  // additionalInformation: Partial<AdditionalInformationType>;
  businessDetails: Partial<BusinessDetailsType>;
  businessPremiseDetails: Partial<BusinessPremiseDetailsType>;
  directorOrProprietorDetails: Partial<DirectorOrProprietorDetailsType>;
  marketPreference: Partial<MarketingPreferencesType>;
  documentationUploads: Partial<DocumentationUploadsType>;
  guarantor: Partial<GuarantorType>;
  isSendOtp: boolean;
};

export type fundingStateType = {
  currentStage: number;
  currentHighestStage: number;
  highestStage: number;
  gocardlessButtonDisabled: boolean;
  isContractSend?: boolean;
};

export type ProfileType = {
  title?: string;
  firstName?: string;
  lastName?: string;
  photoId?: File | null;
  addressProof?: File | null;
  name?: string;
  image?: string;
  description?: string;
  location?: string;
  businessName?: string;
  drivingLicence: File;
  utilityBill: File;
  councilTax: File;
  paymentDetails: File;
  // profileUploadsType: Partial<ProfileUploadsType>;
};
export interface BankDetails {
  bank_name?: string;
  account_holder_name?: string;
  account_number?: string;
  sort_code?: string;
}

export interface ReferralAddFormData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  business_name?: string;
  bank_details?: BankDetails;
}
export interface ProfileEditFormData {
  // image?: string;
  first_name: string;
  last_name: string;
  email: string;
  number: string;
  company_name: string;
  date_of_birth: string;
  address: string;
  description: string;
  risk_score: string;
  credit_score: string;
}

export interface ManageFieldAgentInterface {
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  description?: string;
  address?: string;
  phone_number?: string;
  assigned_manager?: string;
}

export interface ManageFinanceManagerInterface {
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  description?: string;
  address?: string;
  phone_number?: string;
  assigned_manager?: string;
}
export interface MangeUnderWriterInterface {
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  description?: string;
  address?: string;
  phone_number?: string;
  // date_of_birth?: string;
}

export interface ManageManagerInterface {
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  description?: string;
  address?: string;
  phone_number?: string;
  // assigned_manager?: string;
}

export interface AssignFieldAgentFormFieldType {
  field_agent_id: string;
}
export interface ContactFormData {
  name?: string;
  email?: string;
  phone_number?: string;
  howDidYouFindUs?: string;
}

export type InputFieldType = {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  options?: (string[] | number[]) | { key: string; label: string | number }[];
  date?: boolean;
};

export type BusinessDetailsType = {
  business_type: 'Limited Company' | 'Limited Partnership' | 'Sole Trader';
  number_of_directors: number;
  start_trading_date?: string;
  is_profitable: string;
  accepts_card_payment: string;
  average_weekly_card_sales: number;
  average_monthly_turnover: number;
  business_sector: string;
  other_business_name: string;
  has_started_trading: string;
  directors: NameSubSchemaType[];
};
export interface CommonClassesInterface {
  labelClass?: string;
  errorClass?: string;
  fieldClass?: string;
  wrapperClass?: string;
  optionLabelClass?: string;
}

export type CommonStyleConstant = {
  password?: CommonClassesInterface;
  text?: CommonClassesInterface;
  email?: CommonClassesInterface;
  textarea?: CommonClassesInterface;
  tel?: CommonClassesInterface;
  number?: CommonClassesInterface;
  dropdown?: CommonClassesInterface;
  checkbox?: CommonClassesInterface;
  radioButton?: CommonClassesInterface;
  range?: CommonClassesInterface;
  file?: CommonClassesInterface;
  multiCheckbox?: CommonClassesInterface;
  date?: CommonClassesInterface;
};

export interface fileClassesInterface {
  text?: CommonClassesInterface;
}

export type FundingFormFieldType =
  | RangeControllerProps
  | InputControllerProps
  | DropdownControllerProps
  | DateControllerProps
  | TextAreaControllerProps
  | fileControllerProps
  | CheckBoxControllerProps
  | RadioButtonControllerProps
  | MultiCheckBoxControllerProps;

export interface RangeControllerProps extends Partial<CommonClassesInterface> {
  type: 'range';
  key?: string;
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  min?: number;
  max?: number;
  icon?: () => JSX.Element;
  showInput?: boolean;
  isDecimal?: boolean;
}

export interface InputControllerProps extends Partial<CommonClassesInterface> {
  type: 'number' | 'text' | 'email' | 'tel' | 'range' | 'password' | 'date';
  key?: string;
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  min?: number;
  max?: number;
  icon?: () => JSX.Element;
  isFractional?: boolean;
  events?: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface DropdownControllerProps
  extends Partial<CommonClassesInterface> {
  type: 'dropdown';
  key?: string;
  name: string;
  label?: string;
  placeholder?: string;
  options?: string[] | number[];
  isId?: boolean;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  icon?: () => JSX.Element;
  onChange?: (inputValue: string) => void;
  onSelected?: (selectedValue: string) => void;
  hideLabel?: boolean;
  disabled?: boolean;
}

export interface DateControllerProps extends Partial<CommonClassesInterface> {
  type: 'date';
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  min?: string | Date;
  max?: string | Date;
  excludeDateIntervals?: { start: Date; end: Date }[];
  icon?: () => JSX.Element;
  filterDates?: (date: undefined) => boolean;
}

export interface TextAreaControllerProps
  extends Partial<CommonClassesInterface> {
  type: 'textarea';
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  multiline?: number;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  icon?: () => JSX.Element;
}

export interface fileControllerProps extends Partial<CommonClassesInterface> {
  type: 'file';
  name: string;
  label?: string;
  memTypes?: string;
  placeholder?: string;
  rows?: number;
  key?: string;
  isMultiple?: boolean;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: () => JSX.Element;
}

export interface CheckBoxControllerProps
  extends Partial<CommonClassesInterface> {
  type: 'checkbox';
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: boolean;
  isDisabled?: boolean;
  icon?: () => JSX.Element;
  onChange?: Dispatch<SetStateAction<boolean>>;
}

export interface SubscriptionCreatePropType {
  setShowCreateView?: Dispatch<SetStateAction<boolean>>;
}

export interface RadioButtonControllerProps
  extends Partial<CommonClassesInterface> {
  type: 'radioButton';
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  options?: string[] | number[];
  icon?: () => JSX.Element;
}

export interface MultiCheckBoxControllerProps
  extends Partial<CommonClassesInterface> {
  type: 'multiCheckbox';
  name: string;
  label?: string;
  options: { key: string; label: string | number }[];
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  icon?: () => JSX.Element;
}

export interface LoanFromCommonProps {
  setRef?: Dispatch<
    MutableRefObject<HTMLFormElement> | SetStateAction<HTMLFormElement>
  >;
  leadId?: number | string;
  loanId: string;
  lead?: Partial<Customer>;
  setIsSubmitConfirmModal?: Dispatch<SetStateAction<boolean>>;
  fundingFormStatus?: FundingFromCurrentStatus;
  setStatueUpdate?: Dispatch<SetStateAction<boolean>>;
}
export interface ProfileDetailsProps {
  setProfile?: Dispatch<SetStateAction<UserProfile>>;
  profile?: Partial<UserProfile>;
  id?: string;
  is_approved?: boolean;
  type?: ApprovalType;
  customerId?: number;
  documentType?: string;
  setIsModalOpen?: (value: boolean) => void;
}
export interface UnitProfileDetailsProps {
  setProfile?: Dispatch<SetStateAction<UserProfile>>;
  profile?: {
    changes?: Partial<UnitProfileDetails>;
    company?: Partial<UnitProfileDetails>;
    id?: string;
    is_approved?: boolean;
    type?: ApprovalType;
    rejection_reason?: string;
    is_admin_reject: boolean;
  };
  setIsModalOpen: (value: boolean) => void;
}

export interface FundingSuccessModalInterface {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  head: string;
  content: string;
  setRemark?: Dispatch<SetStateAction<string>>;
}
export interface FundingApproveOrRejectModalInterface {
  role: string;
  setAdminReviewRequired?: (value: boolean) => void;
  isApprove?: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  head: string;
  content: string;
  setRemarks?: Dispatch<string>;
  setRateOfInterest?: Dispatch<number>;
  rateOfInterest?: number;
  remarks: string;
}

export interface ThreeDotActionModalInterface {
  setIsAction: (value: boolean) => void;
  setIsModalOpen?: (value: boolean) => void;
  setIsDeleteModalOpen?: (value: boolean) => void;
  setIsAssignAgentModalOpen?: (value: boolean) => void;
  setIsKPIModalOpen?: (value: boolean) => void;
  setCancel?: (value: boolean) => void;
  setRenew?: (value: boolean) => void;
  setIsEditModalOpen?: (value: boolean) => void;
  setIsUnlinkModalOpen?: (value: boolean) => void;
}
export interface CustomDatePickerProps {
  metaData: InputFieldType;
}

export interface AsyncReducers {
  [key: string]: Reducer<unknown, AnyAction>;
}

export type userSliceInitialState = {
  role?: Roles;
  id?: number | undefined;
  email?: string;
  last_name?: string;
  addressProofData?: object;
  photoIdData?: object;
  image?: string;
  location?: string;
  first_name?: string;
  phone_number?: string;
};

export type SessionSliceType = {
  accessToken: string;
  refreshToken: string;
  signedIn: boolean;
};

export interface ProtectedRouteProps {
  allowedRole?: string;
}

export type UserDetailsType = {
  name: string;
  email: string;
};

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  email: string;
  password?: string;
  confirmPassword?: string;
}

interface LoanStatus {
  id: number;
  interest: number;
  is_intrest_changed: boolean;
  approved_date: string;
  applied_date: string;
  approved_by_manager: boolean;
  manager_approve_date: string;
  admin_review_required: boolean;
  approved_by_admin: boolean;
  admin_approve_date: string;
  current_status: string;
  reject_reason: string;
  is_identity_verification_mail_send: boolean;
}

export interface Customer {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  image: string;
  address?: string;
  gender: string;
  date_of_birth: string;
  company_name: string;
  location: string;
  description: string;
  agent: string | number;
  loan_status: LoanStatus;
  mode_of_application: string;
  gocardless_status: boolean;
}

export interface LoanData {
  id: string;
  customer: Customer;
  loan_status: LoanStatus;
  created_on: string;
  modified_on: string;
  deleted_at: string | null;
  created_by: string | null;
  modified_by: string | null;
  personal_detail: number;
  additional_detail: number;
  business_detail: number;
  business_premis_detail: number;
  marketing_preference: number;
  documents: number;
  guarantor: number;
  bank_details: number;
  signable_contract: string | null;
  profileChanges: string;
  photoIdChanges: string;
  addressProofChanges: string;
}

export interface UnitData {
  id: string;
  customer: Customer;
  company_name: string;
  company_status: string;
  business_type: string;
  trading_style: string;
  company_number: string;
  funding_purpose: string;
  other_funding_purpose: string;
}

interface LoanStatus {
  id: number;
  interest: number;
  is_interest_changed: boolean;
  approved_date: string;
  applied_date: string;
  approved_by_manager: boolean;
  manager_approve_date: string;
  admin_review_required: boolean;
  approved_by_admin: boolean;
  admin_approve_date: string;
  current_status: string;
  reject_reason: string;
  is_identity_verification_mail_send: boolean;
  filled_forms_count?: number;
}
interface Stay {
  id: number;
  pincode: string;
  address: string;
  house_ownership: string;
  start_date: string;
  end_date: string;
}

interface Director {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  owns_other_property: string;
  owned_property_count: number;
  owned_property: undefined[];
  stay: Stay[];
}

export interface TrustIdStatusInterface {
  id: number;
  send_kyc_mail: boolean;
  kyc_status: boolean;
  customer: Director;
  certificate: string;
  document_Verification?: string;
  liveness_check?: string;
  face_match?: string;
  kyc_aml_check?: string;
}

// type FieldAgent = {
//   id: number;
//   first_name: string;
//   last_name: string;
//   phone_number: string;
//   email: string;
//   description: string;
//   address: string;
//   assigned_manager: number;
//   image: string;
// };

export type KpiType = {
  title: string;
  duration: string;
  percentage: number;
  number_of_new_clients: number;
  fund_disbursed: number;
  number_of_old_clients: number;
  is_trend_increasing: boolean;
  target: number;
}[];

export interface NotificationProps {
  whichUser?: Roles;
  customerId?: number | string;
}

export interface NotificationItem {
  id: number;
  notification_type: string;
  message: string;
  created_on: string;
  is_notified: boolean;
}

interface LoanStatus {
  id: number;
  interest: number;
  is_intrest_changed: boolean;
  approved_date: string;
  applied_date: string;
  approved_by_manager: boolean;
  manager_approve_date: string;
  admin_review_required: boolean;
  approved_by_admin: boolean;
  admin_approve_date: string;
  current_status: string;
  reject_reason: string;
  is_identity_verification_mail_send: boolean;
  upcoming_status?: string;
}

export type UserProfile = {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  description: string;
  email: string;
  image: string;
  gender: string;
  date_of_birth: string;
  company_name: string;
  location: string;
  agent: string;
  loan_status: LoanStatus;
  mode_of_application: string;
  gocardless_status: boolean;
  customer?: Customer;
  changes?: Partial<Customer>;
  business_type: string;
  customer_id?: string;
  agent_id?: string;
  credit_score: string;
  risk_score: string;
  is_admin_reject: boolean;
  rejection_reason?: string;
  is_admin_approved: boolean;
  role: Roles;
};

export type UnitProfileDetails = {
  id: string;
  company_id: number;
  title: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  description: string;
  email: string;
  image: string;
  gender: string;
  date_of_birth: string;
  company_name: string;
  location: string;
  agent: string;

  mode_of_application: string;
  company_status: string;
  customer?: string;
  business_type: string;
  funding_purpose: string;
  trading_style: string;
  company_number: string;
  other_funding_purpose: string;
};

export interface arrayfield {
  key: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}

interface RemarkUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface Remark {
  id: string;
  created_by: RemarkUser;
  created_on: string;
  remarks: string;
  remark_type: FundingFromCurrentStatus;
}

export interface Comment {
  id: string;
  created_by: RemarkUser;
  created_on: string;
  comment: string;
  comments: string;
  comment_type: FundingFromCurrentStatus;
}

export type MakeOfferProps = {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
};

export interface QueryObject {
  filter?: Record<string, string>;
  search?: string[];
  sort?: Record<string, 'asc' | 'desc' | ''>;
  pages_size?: number;
  page?: number;
  date_from?: Date;
  date_to?: Date;
}

export interface Subcategory {
  id: string;
  gl_name: string;
  gl_code: string;
}

export interface Category {
  id: string;
  category_name: string;
  subcategories: Subcategory[];
  gl_code?: string;
}

export interface ClientFormData {
  number_of_client_target?: number;
  fund_disbursement_target?: number;
}

export interface UwVerifyProps {
  loanId: string;
  activeStage: number;
}

export interface ApprovalListProps {
  type?: ApprovalType;
  userId?: string;
  unitId?: string;
  whichUser?: Roles;
  isUnit?: boolean;
}

export type FilterData = {
  type: ApprovalType;
  customer_id?: string;
  unit_id?: string;
};

export interface RowType {
  name?: string;
  index?: string;
  amount?: number;
  narrative?: string;
  loanId?: string;
  gl_code?: string;
  bp_code?: string;
  account_name?: string;
  transition_type?: string;
  loan_entry_type?: string;
  id?: string;
  isCustomer?: string;
  partner_code?: string;
  partner_name?: string;
}

export interface EntryType {
  rows?: RowType[];
  date?: string;
  entryType?: string;
}
export interface TableFormProps {
  control: Control<FieldValues>;
  watchRows: RowType[];
  fields: RowType[];
  getValues: (string) => FieldValues;
  update: UseFieldArrayUpdate<EntryType>;
  isDetailsView: boolean;
  trigger?: () => Promise<boolean>;
  errors?: FieldErrors;
  setIsSubmitDisabled?: (disabled: boolean) => void;
  clearErrors?: UseFormClearErrors<FieldValues>;
}

export interface PartnerInfo {
  index: number;
  type: string;

  id: string;
  display: string;
  partner_code: string;
  partner_name: string;
}

export interface GLSelectModalProps {
  selectedCell?: PartnerInfo;
  close: () => void;
  getValues?: (string) => unknown;
  update?: UseFieldArrayUpdate<EntryType>;
  onLoanIdsReceived?: (ids: string[]) => void;
  clearErrors?: (string) => void;
  isForTable?: boolean;
  setSelectedGl?: Dispatch<SetStateAction<PartnerInfo>>;
}

export interface UnitCustomerSelectModalProps {
  close: () => void;
  link: (selectedCustomerIds: string[]) => void;
  notInCompanyId: string;
}
export interface FundingSelectModalProps {
  close: () => void;
  handleSelect: (selectedCustomerIds: {
    id?: string;
    loan_number?: number;
  }) => void;
}

export interface AddEntryProps {
  setShowLedger?: (show: boolean) => void; // Adjust the type based on your function's signature
  selectedEntry?: string; // Assuming entry_id is a string, change if it's a different type
}

export interface FooterData {
  balance?: string;
  credit?: string;
  debit?: string;
  opening_balance?: string;
  closing_balance?: string;
}
export interface ProfitAndLoss {
  credit?: string;
  debit?: string;
  opening_balance?: string;
  closing_balance?: string;
}
export interface BalanceSheetProps {
  main_category: string;
  sub_category: string;
  gl_code: string;
  gl_name: string;
  opening_balance: string;
  debit: string;
  credit: string;
  closing_balance: string;
}

export interface StatementBpTrialBalanceProps {
  partner_type: string;
  partner_code: string;
  partner_name: string;
  opening_balance: string;
  debit: string;
  credit: string;
  closing_balance: string;
}

export interface LedgerProps {
  date: string;
  transaction_no: string;
  entry_type: string;
  narration: string;
  debit_amount: string;
  credit_amount: string;
  balance: string;
}

export interface ProfitAndLossAccountProps {
  main_category_name: string;
  category_name: string;
  gl_code: string;
  gl_name: string;
  opening_balance: string;
  debit: string;
  credit: string;
  closing_balance: string;
}

export interface TrialBalanceProps {
  main_category_name: string;
  category_name: string;
  gl_code: string;
  gl_name: string;
  opening_balance: string;
  debit: string;
  credit: string;
  closing_balance: string;
}

export type FundingCardProps = {
  customerId: string;
  setSelectedFundingId: Dispatch<SetStateAction<string>>;
  setSelectedMenu: Dispatch<SetStateAction<string>>;
  setSelectedCompanyId: Dispatch<SetStateAction<string>>;
  unitId?: string;
  setMenuHistory: Dispatch<SetStateAction<unknown>>;
};

export type PapOptionalKeys<T> = {
  [K in keyof T]: T[K] extends Record<string, string> | undefined ? K : string;
}[keyof T];

export type paymentArrangementPlanType = yup.InferType<
  typeof paymentArrangementPlanSchema
>;

export type cashReceiptType = yup.InferType<typeof cashReceiptSchema>;

export type affordabilityGrossType = yup.InferType<
  typeof affordabilityGrossSchema
>;

export type subscriptionType = yup.InferType<typeof subscriptiontSchema>;

export type AddSubscriptionModalType = {
  toggleModal: () => void;
  methods: UseFormReturn<subscriptionType>;
  nextPossibleChargeDate?: string;
};

// Define Offer Interface
export interface Offer {
  id: string;
  offer_date: string;
  offer_amount: number;
  offer_number_of_weeks: number;
  offer_weekly_payment_amount: number;
  applied_loan_amount: number;
  applied_fund_duration_weeks: number;
  is_expired: boolean;
  offer_accepted?: boolean;
  offer_rejected?: boolean;
}

export interface BulkUploadFundingDetailsProps {
  id: string;
  created_on: string;
  modified_on: string;
  file: string;
  total_new_loans: number;
  updated_loans: number;
  processed: boolean;
  success: boolean;
  message: string | null;
  created_by: string | null;
  modified_by: string | null;
}
