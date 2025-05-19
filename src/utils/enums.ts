export enum Roles {
  Leads = 'LEADS',
  Customer = 'CUSTOMER',
  FieldAgent = 'FIELDAGENT',
  UnderWriter = 'UNDERWRITER',
  Manager = 'MANAGER',
  Admin = 'ADMIN',
  FinanceManager = 'FINANCEMANAGER'
}

export enum FundingFromCurrentStatus {
  Inprogress = 'Inprogress',
  Submitted = 'Submitted',
  AgentSubmitted = 'Agent_Submitted',
  UnderwriterSubmitted = 'Underwriter_Submitted',
  ManagerApproved = 'Manager_Approved',
  AdminCashDisbursed = 'Admin_Cash_Disbursed',
  UnderwriterReturned = 'Underwriter_Returned',
  ManagerRejected = 'Manager_Rejected',
  AdminRejected = 'Admin_Rejected',
  AmountCredited = 'Amount_Credited',
  Completed = 'Completed',
  MovedToLegal = 'Moved_To_Legal',
  FundingClosed = 'Funding_Closed'
}

export enum FundingFromUpcomingStatus {
  GocardlessConsentWaiting = 'Gocardless_Consent_Waiting',
  SubmissionWaiting = 'Submission_Waiting',
  AgentSubmissionWaiting = 'Agent_Submission_Waiting',
  UnderwriterGocardlessSortingWaiting = 'Underwriter_Gocardless_Sorting_Waiting',
  UnderwriterAffordabilityWaiting = 'Underwriter_Affordability_Waiting',
  UnderwriterSubmissionWaiting = 'Underwriter_Submission_Waiting',
  ManagerAffordabilityWaiting = 'Manager_Affordability_Waiting',
  ManagerDisbursementWaiting = 'Manager_Disbursement_Waiting',
  ManagerApprovalWaiting = 'Manager_Approval_Waiting',
  AdminCashDisbursalWaiting = 'Admin_Cash_Disbursal_Waiting'
}

export enum FundingFromStatusEnum {
  Inprogress = 'Inprogress',
  Submitted = 'Submitted',
  Underwriter_Gocardless_Sorting_Completed = 'Underwriter Gocardless Sorting Completed',
  Agent_Submitted = 'Agent Submitted',
  Underwriter_Affordability_Completed = 'Underwriter Affordability Completed',
  Underwriter_Submitted = 'Underwriter Submitted',
  Manager_Affordability_Completed = 'Manager Affordability Completed',
  Manager_Disbursement_Completed = 'Manager Disbursement Completed',
  Manager_Approved = 'Manager Approved',
  Admin_Cash_Disbursed = 'Admin Cash Disbursed',
  Underwriter_Returned = 'Underwriter Returned',
  Manager_Rejected = 'Manager Rejected',
  Admin_Rejected = 'Admin Rejected',
  Amount_Credited = 'Amount Credited',
  Completed = 'Completed',
  Moved_To_Legal = 'Moved To Legal',
  Funding_Closed = 'Funding Closed'
}

export enum UnitStatusType {
  Active = 'Active',
  Inactive = 'Inactive'
}

export enum PapStatusType {
  Approved = 'approved',
  Pending = 'pending',
  Cancelled = 'cancelled',
  Closed = 'closed'
}

export enum CreditMonitoringStatusType {
  Failed = 'Failed',
  Success = 'Success'
}

export enum SubscriptionType {
  Approved = 'Approved',
  Pending = 'Pending'
}

// export enum ReferralStatus {
//   Referred = "Referred",
//   LoanSanctioned = "Loan_Sanctioned",
//   ReceivedBenefit = "Received_Benefit",
// }
// export enum ReferralStatusEnum {
//   Referred = "Referred",
//   Loan_Sanctioned = "Loan Sanctioned",
//   Received_Benefit = "Received Benefit",
// }
export enum ReferralStatus {
  Referred = 'Referred',
  LoanSanctioned = 'Loan_Sanctioned',
  ReceivedBenefit = 'Received_Benefit'
}

export enum ReferralStatusEnum {
  Referred = 'Referred',
  Loan_Sanctioned = 'Loan Sanctioned',
  Received_Benefit = 'Received Benefit'
}

export enum ModeOfApplication {
  Representative = 'Representative',
  Self = 'Self',
  BackOffice = 'Backoffice'
}

export enum contractStatus {
  processing = 'processing',
  sent = 'sent',
  resent = 'resent',
  opened = 'opened',
  signed = 'signed',
  signedByAll = 'signed_by_all',
  cancelled = 'cancelled',
  expired = 'expired',
  failed = 'failed',
  draft = 'draft'
}

export enum ApprovalType {
  CustomerProfile = 'customer_profile',
  UnitProfile = 'unit_profile',
  PhotoId = 'photo_id',
  AddressProof = 'address_proof'
}

export enum EntryType {
  'journal' = 'JV',
  'bank payment' = 'BP',
  'bank receipt' = 'BR',
  'cash payment' = 'CP',
  'cash receipt' = 'CR'
}

export enum MandateStatus {
  pending_customer_approval = 'Pending customer approval',
  pending_submission = 'Pending submission',
  submitted = 'Submitted',
  active = 'Active',
  suspended_by_payer = 'Suspended by payer',
  failed = 'Failed',
  cancelled = 'Cancelled',
  expired = 'Expired',
  consumed = 'Consumed',
  blocked = 'Blocked'
}

export enum MandateSubscriptionStatus {
  pending_customer_approval = 'Pending Customer Approval',
  customer_approval_denied = 'customer Approval Denied',
  active = 'Active',
  finished = 'Finished',
  cancelled = 'Cancelled',
  paused = 'Paused'
}

export enum BusinesTypeTextEnum {
  'Limited Company' = 'Director',
  'Limited Partnership' = 'Partner',
  'Sole Trader' = 'Proprietor'
}
