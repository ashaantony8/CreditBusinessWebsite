import { FundingFromCurrentStatus } from '../utils/enums';
import { urlQueryCreate } from '../utils/helpers';
import { Delete, Get, Patch, Post, Put } from './axios';

const baseUrl = '/loan';
const manageLoanBaseUrl = '/manage_loan';
const loanUrl = `${baseUrl}/customer_loan/`;
const personalInformationUrl = `${baseUrl}/personal_informations/`;
const businessDetailsUrl = `${baseUrl}/business_details/`;
const businessPremiseDetailsUrl = `${baseUrl}/business_premise_detail/`;
const directorUrl = `${baseUrl}/director/`;
const marketPreferenceUrl = `${baseUrl}/consent/`;
const documentUploadUrl = `${baseUrl}/documents/`;
const guarantorAPIUrl = `${baseUrl}/guarantor/`;
const trustIdStatusUrl = `${baseUrl}/trustid_status/`;
const sendTrustIdGuestLinkUrl = `${baseUrl}/send_trustid_guestlink/`;
const userTrustIdStatusUrl = `${baseUrl}/user_trustid_status/`;
const userSendTrustIdGuestLinkUrl = `${baseUrl}/user_send_trustid_guestlink/`;
const addressLookupAPIUrl = `${baseUrl}/address_lookup/`;
const addressSidLookupAPIUrl = `${baseUrl}/address_lookup_sid/`;
const companyAddressLookupAPIUrl = `${baseUrl}/company_address_lookup/`;
const companyAddressSidLookupAPIUrl = `${baseUrl}/company_address_lookup_sid/`;
const filledFormsGetUrl = `${baseUrl}/filledforms/`;
const submitLoanUrl = `${baseUrl}/submit_loan/`;
const approveLoanUrl = `${baseUrl}/approve_loan/`;
const rejectLoanUrl = `${baseUrl}/reject_loan/`;
const assignAgentUrl = `${baseUrl}/assign_agent/`;
const gocardlessBankListUrl = `${baseUrl}/banks/`;
const createRequisitionLinkUrl = `${baseUrl}/requisition/`;
const confirmBankAccountUrl = `${baseUrl}/confirm_bank_account/`;
const gocardlessStatementUrl = `${baseUrl}/gocardless_statement/`;
const gocardlessStatementGroupedUrl = `${baseUrl}/process_transactions/`;
const affordabilityUrl = `${baseUrl}/affordability/`;
const sendContractEmailUrl = `${baseUrl}/send_contract_email/`;
const reSendContractEmailUrl = `${baseUrl}/send_contract_reminder_email/`;
const getContractUrl = `${baseUrl}/contract/`;
const paymentUrl = `${baseUrl}/payments/`;
// const companyUrl = `${baseUrl}/company/`;
const companyDetailsUrl = `${baseUrl}/company/`;
const getLoanIdsUrl = `${baseUrl}/loans/`;
const updateFilledFormsUrl = `${baseUrl}/update_filled_forms/`;
const fundLoanRemarksUrl = `${baseUrl}/remarks/`;
const fundLoanCommentsUrl = `${baseUrl}/comments/`;
const loanOfferUrl = `${manageLoanBaseUrl}/loan-offer/`;
const loanOfferDecisionUrl = `${manageLoanBaseUrl}/loan-offer-decision/`;
const viewLoanOffersUrl = `${manageLoanBaseUrl}/view-loan-offers/`;
const unitProfileUrl = `${baseUrl}/company/`;
const instantPayUrl = `${baseUrl}/instant_payment/`;
const underwriterVerifyUrl = `${baseUrl}/underwriter_verify/`;
const applyNewLoanUrl = `${baseUrl}/apply_new_loan/`;
const papUrl = `${manageLoanBaseUrl}/payment_arrangement_plan/`;
const primaryBankAccountUrl = `${baseUrl}/primary_bank_accout/`;
const customerPaymentUrl = `${baseUrl}/customer_payments/`;
const disbursementUrl = `${baseUrl}/disbursement/`;
const creditMonitoringUrl = `${manageLoanBaseUrl}/credit_monitoring/`;
const cashReceiptUrl = `${manageLoanBaseUrl}/cash_payment_receipt/`;
const listGoodStandingReportUrl = `${manageLoanBaseUrl}/good_standing_report/`;
const defaultUserReportUrl = `${manageLoanBaseUrl}/default_user_report/`;
const listGoodStandingReportDownloadUrl = `${manageLoanBaseUrl}/good_standing_report/download`;
const defaultUserReportDownloadUrl = `${manageLoanBaseUrl}/default_user_report/download`;
const bankDetailsUrl = `${baseUrl}/bank_details/`;
const customerReportUrl = `${manageLoanBaseUrl}/customer_report/`;
const paymentReportUrl = `${manageLoanBaseUrl}/payment_report/`;
const fundingReportUrl = `${manageLoanBaseUrl}/funding_report/`;
const pendingDueReportUrl = `${manageLoanBaseUrl}/pending_due_report/`;
const outStandingReportUrl = `${manageLoanBaseUrl}/outstanding_report/`;
const snapshotReportUrl = `${manageLoanBaseUrl}/snapshot_report/`;
const defaultReportUrl = `${manageLoanBaseUrl}/default_report/`;
const customerReportDownloadUrlUrl = `${manageLoanBaseUrl}/customer_report/download/`;
const goodStandingReportDownloadUrlUrl = `${manageLoanBaseUrl}/good_standing_report/download/`;
const defaultReportDownloadUrlUrl = `${manageLoanBaseUrl}/default_report/download/`;
const pendingDueReportDownloadUrlUrl = `${manageLoanBaseUrl}/pending_due_report/download/`;
const paymentReportDownloadUrlUrl = `${manageLoanBaseUrl}/payment_report/download/`;
const fundingReportDownloadUrlUrl = `${manageLoanBaseUrl}/funding_report/download/`;
const outStandingReportDownloadUrlUrl = `${manageLoanBaseUrl}/outstanding_report/download/`;
const snapShotReportDownloadUrlUrl = `${manageLoanBaseUrl}/snapshot_report/download`;
const expiredContractsReportUrlUrl = `${manageLoanBaseUrl}/expired_contracts_report`;
const expiredContractsReportDownloadUrl = `${manageLoanBaseUrl}/expired_contracts_report/download`;
const expiringContractsReportUrl = `${manageLoanBaseUrl}/expiring_contracts_report`;
const expiringContractsReportDownloadUrl = `${manageLoanBaseUrl}/expiring_contracts_report/download`;
const summaryReportUrl = `${manageLoanBaseUrl}/summary_report/`;
const agentPerformanceReportUrl = `${manageLoanBaseUrl}/agent_performance_report/`;
const agentReportUrl = `${manageLoanBaseUrl}/agent_report/`;
const summaryReportDownloadUrl = `${manageLoanBaseUrl}/summary_report/download`;
const agentPerformanceReportDownloadUrl = `${manageLoanBaseUrl}/agent_performance_report/download`;
const agentReportDownloadUrl = `${manageLoanBaseUrl}/agent_report/download`;
const photoIdApprovalApi = `${baseUrl}/photo_id_changes_approval/`;
const referralReportUrl = `${manageLoanBaseUrl}/refferal_report`;
const referralReportDownloadUrl = `${manageLoanBaseUrl}/refferal_report/download`;
const addressProofApprovalApi = `${baseUrl}/address-proof-changes-approval/`;
const unitProfileApprovalApi = `${baseUrl}/company_approval/`;
const photoIdRejectUrl = `${baseUrl}/photo_id_changes_approval/`;
const addressProofRejectUrl = `${baseUrl}/address-proof-changes-approval/`;
const unitProfileRejectUrl = `${baseUrl}/company_approval/`;
const transactionCategoryUrl = `${baseUrl}/transaction_category/`;
const sendPapContractUrl = `${manageLoanBaseUrl}/send_pap_contract_email/`;
const downloadBankStatementUrl = `${baseUrl}/download_transactions/`;
const bpAddRemoveUrl = `${baseUrl}/add_remove_unit_customers/`;
const addMandateSubscriptionUrl = `${manageLoanBaseUrl}/add_gocardless_subscription/`; //need to change the url
const bulkuploadLoanUrl = `${manageLoanBaseUrl}/import_loan_data/`;

const loanGetApi = (loanId: string) => {
  return Get({
    url: `${loanUrl}${loanId}`,
    request: {}
  });
};

const instantPayGetApi = (paymentId: string, payload) => {
  return Post({
    url: `${instantPayUrl}${paymentId}/`,
    request: payload
  });
};

const personalInformationPostAPI = (payload, loanId: string) => {
  return Post({
    url: `${personalInformationUrl}${loanId}/`,
    request: payload
  });
};

const personalInformationGetAPI = (loanId: string) => {
  return Get({
    url: `${personalInformationUrl}${loanId}`,
    request: {}
  });
};

const businessDetailsPostAPI = (payload, loanId: string) => {
  const data = Post({
    url: `${businessDetailsUrl}${loanId}/`,
    request: payload
  });
  return data;
};

const businessDetailsGetAPI = (loanId: string) => {
  return Get({
    url: `${businessDetailsUrl}${loanId}`,
    request: {}
  });
};

const businessPremiseDetailsPostAPI = (payload, loanId: string) => {
  const data = Post({
    url: `${businessPremiseDetailsUrl}${loanId}/`,
    request: payload
  });
  return data;
};

const businessPremiseDetailsGetAPI = (loanId: string) => {
  return Get({
    url: `${businessPremiseDetailsUrl}${loanId}`,
    request: {}
  });
};

const marketPreferencePostAPI = (payload, loanId: string) => {
  const data = Post({
    url: `${marketPreferenceUrl}${loanId}/`,
    request: payload
  });
  return data;
};

const marketPreferenceGetAPI = (loanId: string) => {
  return Get({
    url: `${marketPreferenceUrl}${loanId}`,
    request: {}
  });
};

const retrieveDirectorGetAPI = (loanId: string) => {
  return Get({
    url: `${directorUrl}${loanId}`,
    request: {}
  });
};

const directorDetailsPutAPI = (payload, loanId: string) => {
  return Put({
    url: `${directorUrl}${loanId}/`,
    request: payload
  });
};

const documentUploadGetAPI = async (loanId: string) => {
  return Get({
    url: `${documentUploadUrl}${loanId}`,
    request: {}
  });
};

const documentUploadPostAPI = async (payload, loanId: string) => {
  return Post({
    url: `${documentUploadUrl}${loanId}/`,
    request: payload
  });
};

const guarantorGetAPI = (loanId: string) => {
  return Get({
    url: `${guarantorAPIUrl}${loanId}`,
    request: {}
  });
};

const guarantorPostAPI = (payload, loanId: string) => {
  const data = Post({
    url: `${guarantorAPIUrl}${loanId}/`,
    request: payload
  });
  return data;
};

const trustIdStatusApi = (loanId: string) => {
  return Get({
    url: `${trustIdStatusUrl}${loanId}`,
    request: {}
  });
};

const sendTrustIdGuestlinkApi = (loanId: string) => {
  return Post({
    url: `${sendTrustIdGuestLinkUrl}${loanId}/`,
    request: {}
  });
};

const userTrustIdStatusApi = (customerId: string | number) => {
  return Get({
    url: `${userTrustIdStatusUrl}${customerId}`,
    request: {}
  });
};
const userSendTrustIdGuestlinkApi = (customerId: string | number) => {
  return Post({
    url: `${userSendTrustIdGuestLinkUrl}${customerId}/`,
    request: {}
  });
};

const addressLookupAPI = payload => {
  return Post({ url: addressLookupAPIUrl, request: payload });
};

const addressSidLookupAPI = payload => {
  return Post({ url: addressSidLookupAPIUrl, request: payload });
};

const companyAddressLookupAPI = payload => {
  return Post({ url: companyAddressLookupAPIUrl, request: payload });
};

const companyAddressSidLookupAPI = payload => {
  return Post({ url: companyAddressSidLookupAPIUrl, request: payload });
};

const filledFormsGetApi = loanId => {
  return Get({
    url: `${filledFormsGetUrl}${loanId}`,
    request: {}
  });
};

const updateFilledFormsApi = (loanId, payload) => {
  return Post({ url: `${updateFilledFormsUrl}${loanId}/`, request: payload });
};

const fetchCustomerApi = leadId => {
  return Get({
    url: `${baseUrl}/${leadId}/`,
    request: {}
  });
};

const submitLoanApi = (loanId: string, payload?: { remarks: string }) => {
  return Post({
    url: `${submitLoanUrl}${loanId}/`,
    request: payload || {}
  });
};

const approveLoanApi = (payload, loanId: string) => {
  return Post({
    url: `${approveLoanUrl}${loanId}/`,
    request: payload
  });
};

const rejectLoanApi = (payload, loanId) => {
  return Post({
    url: `${rejectLoanUrl}${loanId}/`,
    request: payload
  });
};

const assignAgentPostAPI = payload => {
  return Post({
    url: assignAgentUrl,
    request: payload
  });
};

const customerLoanApi = (leadId?: string | number, customerId?: string) => {
  return Get({
    url: leadId
      ? `${loanUrl}${leadId}${customerId ? `/?customer_id=${customerId}` : ''}`
      : customerId
        ? `${loanUrl}?customer_id=${customerId}`
        : loanUrl,
    request: {}
  });
};

const listAndSortCustomerLoanApi = async QueryObject => {
  const loanPaginareUrl = urlQueryCreate(loanUrl, QueryObject);

  return Get({ url: loanPaginareUrl, request: {} });
};

const listBulkuploadLoanApi = async QueryObject => {
  const listBulkuploadLoanPaginatedUrl = urlQueryCreate(
    bulkuploadLoanUrl,
    QueryObject
  );

  return Get({ url: listBulkuploadLoanPaginatedUrl, request: {} });
};

const bulkuploadLoanPostApi = async formData => {
  return Post({ url: bulkuploadLoanUrl, request: formData });
};

const bulkuploadLoanGetApi = async id => {
  return Get({ url: `${bulkuploadLoanUrl}${id}/`, request: {} });
};

const gocardlessBankListApi = () => {
  return Get({
    url: gocardlessBankListUrl,
    request: {}
  });
};

const createRequisitionLinkApi = (payload, loanId) => {
  return Post({
    url: `${createRequisitionLinkUrl}${loanId}/?request_from=web`,
    request: payload
  });
};

const confirmBankAccountGetApi = loanId => {
  return Get({
    url: `${confirmBankAccountUrl}${loanId}?request_from=web`,
    request: {}
  });
};
const confirmBankAccountPostApi = (payload, loanId) => {
  return Post({
    url: `${confirmBankAccountUrl}${loanId}/`,
    request: payload
  });
};

const gocardlessStatementApi = (loanId: string) => {
  return Get({
    url: `${gocardlessStatementUrl}${loanId}`,
    request: {}
  });
};

const fetchgocardlessStatementGroupedApi = (loanId: string) => {
  return Get({
    url: `${gocardlessStatementGroupedUrl}${loanId}`,
    request: {}
  });
};

const gocardlessStatementGroupedApi = (payload, loanId: string) => {
  return Post({
    url: `${gocardlessStatementGroupedUrl}${loanId}/`,
    request: payload
  });
};

const fetchAffordabilityApi = (loanId: string) => {
  return Get({
    url: `${affordabilityUrl}${loanId}/`,
    request: {}
  });
};

const postAffordabilityApi = (payload, loanId: string) => {
  return Post({
    url: `${affordabilityUrl}${loanId}/`,
    request: payload
  });
};

const sendContractEmailApi = (loanId: string) => {
  return Post({
    url: `${sendContractEmailUrl}${loanId}/`,
    request: {}
  });
};

const reSendContractEmailApi = (loanId: string) => {
  return Post({
    url: `${reSendContractEmailUrl}${loanId}/`,
    request: {}
  });
};

const getContractApi = (loanId: string) => {
  return Get({
    url: `${getContractUrl}${loanId}`,
    request: {}
  });
};

const getPaymentApi = (loanId: string) => {
  return Get({
    url: `${paymentUrl}${loanId}`,
    request: {}
  });
};

const getLoanDetails = (loanId: string | number) => {
  return Get({
    url: `${loanUrl}${loanId}`,
    request: {}
  });
};

const getLoanIds = (query: string) => {
  return Get({
    url: `${getLoanIdsUrl}?search=${query}&loan_status=${FundingFromCurrentStatus.AdminCashDisbursed}`,
    request: {}
  });
};

// const listCompaniesApi = async (
//  { url,
//   searchQuery,
//   sortOrder,
//   mode,
//   status,
//   id}
// ) => {
//   const companyUrl = url
//     ? `${url}&search=${searchQuery}&sort_order=${sortOrder}&mode_of_app=${mode}`
//     : `${baseUrl}/company/?${id?`customer_id=${id}`:""}&${pageSize}&search=${searchQuery}&mode_of_app=${mode}&sort_field=id&sort_order=${sortOrder}&app_status=${status}`;
//   return Get({ url: companyUrl, request: {} });
// };

// company list api
const listCompaniesApi = async QueryObject => {
  const companyUrl = urlQueryCreate(`${baseUrl}/company`, QueryObject);
  return Get({ url: companyUrl, request: {} });
};

const companyDetailsApi = async (unitId?: string) => {
  return Get({
    url: `${companyDetailsUrl}${unitId}`,
    request: {}
  });
};

const getFundLoanRemarksApi = async (loanId?: string) => {
  return Get({
    url: `${fundLoanRemarksUrl}${loanId}`,
    request: {}
  });
};

const sendFundLoanRemarksApi = async (payload, loanId?: string) => {
  return Post({
    url: `${fundLoanRemarksUrl}${loanId}/`,
    request: payload
  });
};

const getFundLoanCommentsApi = async (loanId?: string) => {
  return Get({
    url: `${fundLoanCommentsUrl}${loanId}`,
    request: {}
  });
};

const sendFundLoanCommentsApi = async (payload, loanId?: string) => {
  return Post({
    url: `${fundLoanCommentsUrl}${loanId}/`,
    request: payload
  });
};

const loanOfferApi = async (payload, loanId?: string) => {
  return Post({
    url: `${loanOfferUrl}${loanId}/`,
    request: payload
  });
};

const loanOfferDecisionApi = async payload => {
  return Post({
    url: loanOfferDecisionUrl,
    request: payload
  });
};

const viewLoanOffersApi = async (loanId?: string) => {
  return Get({
    url: loanId
      ? `${viewLoanOffersUrl}?loan_id=${loanId}`
      : `${viewLoanOffersUrl}`,
    request: {}
  });
};

const editUnitProfileApi = async (unit_id, formData) => {
  const customerProfileEditUrl = `${unitProfileUrl}${unit_id}/`;

  return Patch({ url: customerProfileEditUrl, request: formData });
};

const uwVerifyGetApi = (loanId: string) => {
  return Get({
    url: `${underwriterVerifyUrl}${loanId}`,
    request: {}
  });
};

const uwVerifyPostApi = (loanId: string, payload) => {
  return Post({
    url: `${underwriterVerifyUrl}${loanId}/`,
    request: payload
  });
};

const applyNewLoaApi = customerId => {
  return Post({
    url: customerId
      ? `${applyNewLoanUrl}?customer_id=${customerId}`
      : applyNewLoanUrl,
    request: {}
  });
};

const fetchDataForPapCreation = loan_id => {
  return Get({
    url: `${manageLoanBaseUrl}/pap_combined_data/?contract_id=${loan_id}`,
    request: {}
  });
};

const fetchDataForMandateCreation = loan_id => {
  return Get({
    url: `${manageLoanBaseUrl}/mandate_combined_data/?contract_id=${loan_id}`,
    request: {}
  });
};

const fetchDataForCashPaymentCreation = loan_id => {
  return Get({
    url: `${manageLoanBaseUrl}/cash_payment_combined_data/?contract_id=${loan_id}`,
    request: {}
  });
};

const listPapApi = async QueryObject => {
  const listPapUrl = urlQueryCreate(papUrl, QueryObject);
  return Get({ url: listPapUrl, request: {} });
};

const addNewPap = payload => {
  return Post({
    url: `${papUrl}`,
    request: payload
  });
};

const addNewMandateSubscription = (mandateId, payload) => {
  return Post({
    url: `${addMandateSubscriptionUrl}${mandateId}/`,
    request: payload
  });
};

const primaryBankAccountApi = (bankId, payload) => {
  return Post({
    url: `${primaryBankAccountUrl}${bankId}/`,
    request: payload
  });
};

const getPapPlanById = planID => {
  return Get({
    url: `${papUrl}${planID}`,
    request: {}
  });
};

const getApprovedPapPlanById = planID => {
  return Get({
    url: `${manageLoanBaseUrl}/approved_paps/${planID}/`,
    request: {}
  });
};

const approvePapPlan = payload => {
  return Post({
    url: `${papUrl}approve/`,
    request: payload
  });
};

const cancelPapPlan = payload => {
  return Post({
    url: `${papUrl}cancel/`,
    request: payload
  });
};

const deletePapPlan = planID => {
  return Delete({
    url: `${papUrl}${planID}`,
    request: {}
  });
};

const listMandatesApi = async QueryObject => {
  const listFailedMandatesUrl = urlQueryCreate(
    `${manageLoanBaseUrl}/gocardless_mandates/`,
    QueryObject
  );
  return Get({ url: listFailedMandatesUrl, request: {} });
};
const fetchMandateByIdApi = async id => {
  return Get({
    url: `${manageLoanBaseUrl}/gocardless_mandates/${id}`,
    request: {}
  });
};

const listFailedMandatesApi = async QueryObject => {
  const listFailedMandatesUrl = urlQueryCreate(
    creditMonitoringUrl,
    QueryObject
  );
  return Get({ url: listFailedMandatesUrl, request: {} });
};

const fetchCreditMonitoringByIdApi = async id => {
  return Get({ url: `${creditMonitoringUrl}${id}`, request: {} });
};

const listFailedMandatesForLoanApi = loanId => {
  return Get({
    url: `${creditMonitoringUrl}?loan_id=${loanId}`,
    request: {}
  });
};

const listDefaultComments = (loanId: string, mandateId: string) => {
  return Get({
    url: `${manageLoanBaseUrl}/credit_monitoring_comments/${loanId}/${mandateId}`,
    request: {}
  });
};

const postDefaultComment = (loanId: string, mandateId: string, payload) => {
  return Post({
    url: `${manageLoanBaseUrl}/credit_monitoring_comments/${loanId}/${mandateId}/`,
    request: payload
  });
};

const moveToLegalApi = (id: string) => {
  return Post({
    url: `loan/loan_move_to_legal/${id}/`,
    request: {}
  });
};

const recommendForLegalApi = (id: string, payload) => {
  return Post({
    url: `${manageLoanBaseUrl}/recomment_to_legal/${id}/`,
    request: payload
  });
};

const renewFailedMandate = (id: string) => {
  return Post({
    url: `${manageLoanBaseUrl}/update_gocardless_mandate/${id}/?action=reinstate`,
    request: {}
  });
};

const cancelMandate = (id: string) => {
  return Post({
    url: `${manageLoanBaseUrl}/update_gocardless_mandate/${id}/?action=cancel`,
    request: {}
  });
};

const cancelSubscription = (id: string) => {
  return Post({
    url: `${manageLoanBaseUrl}/update_gocardless_subscription/${id}/?action=cancel`,
    request: {}
  });
};

const getCustomerPaymentApi = (customerId?: string) => {
  return Get({
    url: customerId ? `${customerPaymentUrl}${customerId}` : customerPaymentUrl,
    request: {}
  });
};

const getSubscriptionsUnderMandate = (mandateId?: string) => {
  return Get({
    url: `${manageLoanBaseUrl}/mandate_subscriptions/${mandateId}`,
    request: {}
  });
};

const disbursementApi = (loanId?: string) => {
  return Get({
    url: `${disbursementUrl}${loanId}`,
    request: {}
  });
};

const disbursementPostApi = (payload, loanId?: string) => {
  return Post({
    url: `${disbursementUrl}${loanId}/`,
    request: payload
  });
};

const listCashReceiptsApi = QueryObject => {
  const listCashReceiptsPaginatedUrl = urlQueryCreate(
    cashReceiptUrl,
    QueryObject
  );
  return Get({
    url: `${listCashReceiptsPaginatedUrl}`,
    request: {}
  });
};

const createCashReceiptsApi = payload => {
  return Post({
    url: `${cashReceiptUrl}`,
    request: payload
  });
};

const getReceiptById = id => {
  return Get({
    url: `${cashReceiptUrl}${id}/`,
    request: {}
  });
};

const approveReceipt = payload => {
  return Post({
    url: `${cashReceiptUrl}approve/`,
    request: payload
  });
};

const listGoodStandingReportApi = async QueryObject => {
  const listGoodStandingReportPaginatedUrl = urlQueryCreate(
    listGoodStandingReportUrl,
    QueryObject
  );
  return Get({ url: listGoodStandingReportPaginatedUrl, request: {} });
};

const defaultUserReportApi = async QueryObject => {
  const defaultUserReportPaginatedUrl = urlQueryCreate(
    defaultUserReportUrl,
    QueryObject
  );
  return Get({ url: defaultUserReportPaginatedUrl, request: {} });
};

const listGoodStandingReportDownloadApi = () => {
  return Get({ url: listGoodStandingReportDownloadUrl, request: {} });
};

const defaultUserReportDownloadApi = () => {
  return Get({ url: defaultUserReportDownloadUrl, request: {} });
};

const CustomerReportGetApi = async QueryObject => {
  const manageLoanUrl = urlQueryCreate(customerReportUrl, QueryObject);
  return Get({
    url: `${manageLoanUrl}`,
    request: {}
  });
};
// const defaultUserReportGetApi = async QueryObject => {
//   const defaultUserUrl = urlQueryCreate(defaultUserReportUrl, QueryObject)
//   return Get({
//     url: `${defaultUserUrl}`,
//     request: {}
//   })
// }

const paymentGetApi = async QueryObject => {
  const paymentUrl = urlQueryCreate(paymentReportUrl, QueryObject);
  return Get({
    url: `${paymentUrl}`,
    request: {}
  });
};

const fundingGetApi = async QueryObject => {
  const fundingUrl = urlQueryCreate(fundingReportUrl, QueryObject);
  return Get({
    url: `${fundingUrl}`,
    request: {}
  });
};

const bankDetailsPostApi = (payload, loanId: string) => {
  return Post({ url: `${bankDetailsUrl}${loanId}/`, request: payload });
};

const pendingDueGetApi = async QueryObject => {
  const pendingDueUrl = urlQueryCreate(pendingDueReportUrl, QueryObject);
  return Get({
    url: `${pendingDueUrl}`,
    request: {}
  });
};

const outStandingDueGetApi = async QueryObject => {
  const outStandingDueUrl = urlQueryCreate(outStandingReportUrl, QueryObject);
  return Get({
    url: `${outStandingDueUrl}`,
    request: {}
  });
};

const snapShotGetApi = async QueryObject => {
  const snapShotUrl = urlQueryCreate(snapshotReportUrl, QueryObject);
  return Get({
    url: `${snapShotUrl}`,
    request: {}
  });
};

const defaultUserGetApi = async QueryObject => {
  const defaultUserUrl = urlQueryCreate(defaultReportUrl, QueryObject);
  return Get({
    url: `${defaultUserUrl}`,
    request: {}
  });
};

const expiredContractsGetApi = async QueryObject => {
  const expiredContractsUrl = urlQueryCreate(
    expiredContractsReportUrlUrl,
    QueryObject
  );
  return Get({
    url: `${expiredContractsUrl}`,
    request: {}
  });
};

const expiringContractsGetApi = async QueryObject => {
  const expiringContractsUrl = urlQueryCreate(
    expiringContractsReportUrl,
    QueryObject
  );
  return Get({
    url: `${expiringContractsUrl}`,
    request: {}
  });
};

const summaryReportGetApi = async queryObject => {
  const summaryUrl = urlQueryCreate(summaryReportUrl, queryObject);

  return Get({
    url: summaryUrl,
    request: {}
  });
};

const agentPerformanceReportGetApi = async queryObject => {
  const agentPerformanceUrl = urlQueryCreate(
    agentPerformanceReportUrl,
    queryObject
  );

  return Get({
    url: agentPerformanceUrl,
    request: {}
  });
};
const agentReportGetApi = async queryObject => {
  const agentUrl = urlQueryCreate(agentReportUrl, queryObject);

  return Get({
    url: agentUrl,
    request: {}
  });
};

const referralReportGetApi = async queryObject => {
  const referralUrl = urlQueryCreate(referralReportUrl, queryObject);

  return Get({
    url: referralUrl,
    request: {}
  });
};

const customerReportDownloadApi = () => {
  return Get({ url: customerReportDownloadUrlUrl, request: {} });
};

const goodStandingReportDownloadApi = () => {
  return Get({ url: goodStandingReportDownloadUrlUrl, request: {} });
};
const defaultReportDownloadApi = () => {
  return Get({ url: defaultReportDownloadUrlUrl, request: {} });
};

const pendingDueReportDownloadApi = () => {
  return Get({ url: pendingDueReportDownloadUrlUrl, request: {} });
};

const paymentReportDownloadApi = () => {
  return Get({ url: paymentReportDownloadUrlUrl, request: {} });
};

const fundingReportDownloadApi = () => {
  return Get({ url: fundingReportDownloadUrlUrl, request: {} });
};

const outStandingReportDownloadApi = () => {
  return Get({ url: outStandingReportDownloadUrlUrl, request: {} });
};

const snapShotReportDownloadApi = () => {
  return Get({ url: snapShotReportDownloadUrlUrl, request: {} });
};

const expiredContractsReportDownloadApi = () => {
  return Get({ url: expiredContractsReportDownloadUrl, request: {} });
};

const expiringContractsReportDownloadApi = () => {
  return Get({ url: expiringContractsReportDownloadUrl, request: {} });
};

const summaryReportDownloadApi = queryObject => {
  const summaryReportDownload = urlQueryCreate(
    summaryReportDownloadUrl,
    queryObject
  );

  return Get({
    url: summaryReportDownload,
    request: {}
  });
};

const agentPerformanceReportDownloadApi = () => {
  return Get({ url: agentPerformanceReportDownloadUrl, request: {} });
};

const agentReportDownloadApi = queryObject => {
  const agentReportDownload = urlQueryCreate(
    agentReportDownloadUrl,
    queryObject
  );

  return Get({ url: agentReportDownload, request: {} });
};

const referralReportDownloadApi = () => {
  return Get({ url: referralReportDownloadUrl, request: {} });
};
const financeEntryDetailApi = id => {
  const financeEntryDetail = `/finance_manage/entry/${id}/`;

  return Get({
    url: financeEntryDetail,
    request: {}
  });
};
// Approval Apis
const photoIdDocApprovalApi = async formData => {
  return Post({ url: photoIdApprovalApi, request: formData });
};
const addressProofApproval = async formData => {
  return Post({ url: addressProofApprovalApi, request: formData });
};
const unitProfileApproval = async formData => {
  return Post({ url: unitProfileApprovalApi, request: formData });
};

// Reject Apis
const photoIdRejectApi = async formData => {
  return Post({ url: photoIdRejectUrl, request: formData });
};
const addressProofRejectApi = async formData => {
  return Post({ url: addressProofRejectUrl, request: formData });
};
const unitProfileRejectApi = async formData => {
  return Post({ url: unitProfileRejectUrl, request: formData });
};

const transactionCategoryApi = () => {
  return Get({ url: transactionCategoryUrl, request: {} });
};

const transactionCategoryPostApi = payload => {
  return Post({ url: transactionCategoryUrl, request: payload });
};

const sendPapContractApi = loanId => {
  return Post({
    url: `${sendPapContractUrl}${loanId}/`,
    request: {}
  });
};

const downloadBankStatementApi = statementId => {
  return Get({ url: `${downloadBankStatementUrl}${statementId}`, request: {} });
};

const bpAddRemoveApi = async payload => {
  return Post({ url: `${bpAddRemoveUrl}`, request: payload });
};

export {
  addNewMandateSubscription,
  addNewPap,
  addressLookupAPI,
  addressProofApproval,
  addressProofRejectApi,
  addressSidLookupAPI,
  agentPerformanceReportDownloadApi,
  agentPerformanceReportGetApi,
  agentReportDownloadApi,
  agentReportGetApi,
  applyNewLoaApi,
  approveLoanApi,
  approvePapPlan,
  approveReceipt,
  assignAgentPostAPI,
  bankDetailsPostApi,
  bpAddRemoveApi,
  businessDetailsGetAPI,
  businessDetailsPostAPI,
  businessPremiseDetailsGetAPI,
  businessPremiseDetailsPostAPI,
  cancelMandate,
  cancelPapPlan,
  cancelSubscription,
  companyAddressLookupAPI,
  companyAddressSidLookupAPI,
  companyDetailsApi,
  confirmBankAccountGetApi,
  confirmBankAccountPostApi,
  createCashReceiptsApi,
  createRequisitionLinkApi,
  customerLoanApi,
  customerReportDownloadApi,
  CustomerReportGetApi,
  defaultReportDownloadApi,
  defaultUserGetApi,
  defaultUserReportApi,
  defaultUserReportDownloadApi,
  deletePapPlan,
  directorDetailsPutAPI,
  disbursementApi,
  disbursementPostApi,
  documentUploadGetAPI,
  documentUploadPostAPI,
  downloadBankStatementApi,
  editUnitProfileApi,
  expiredContractsGetApi,
  expiredContractsReportDownloadApi,
  expiringContractsGetApi,
  expiringContractsReportDownloadApi,
  fetchAffordabilityApi,
  fetchCreditMonitoringByIdApi,
  fetchCustomerApi,
  fetchDataForCashPaymentCreation,
  fetchDataForMandateCreation,
  fetchDataForPapCreation,
  fetchgocardlessStatementGroupedApi,
  fetchMandateByIdApi,
  filledFormsGetApi,
  financeEntryDetailApi,
  fundingGetApi,
  fundingReportDownloadApi,
  getApprovedPapPlanById,
  getContractApi,
  getCustomerPaymentApi,
  getFundLoanCommentsApi,
  getFundLoanRemarksApi,
  getLoanDetails,
  getLoanIds,
  getPapPlanById,
  getPaymentApi,
  getReceiptById,
  getSubscriptionsUnderMandate,
  gocardlessBankListApi,
  gocardlessStatementApi,
  gocardlessStatementGroupedApi,
  goodStandingReportDownloadApi,
  guarantorGetAPI,
  guarantorPostAPI,
  instantPayGetApi,
  listAndSortCustomerLoanApi,
  listCashReceiptsApi,
  listCompaniesApi,
  listDefaultComments,
  listFailedMandatesApi,
  listFailedMandatesForLoanApi,
  listGoodStandingReportApi,
  listGoodStandingReportDownloadApi,
  listMandatesApi,
  listPapApi,
  loanGetApi,
  loanOfferApi,
  loanOfferDecisionApi,
  marketPreferenceGetAPI,
  marketPreferencePostAPI,
  moveToLegalApi,
  outStandingDueGetApi,
  outStandingReportDownloadApi,
  // defaultUserReportGetApi,
  paymentGetApi,
  paymentReportDownloadApi,
  pendingDueGetApi,
  pendingDueReportDownloadApi,
  personalInformationGetAPI,
  personalInformationPostAPI,
  photoIdDocApprovalApi,
  photoIdRejectApi,
  postAffordabilityApi,
  postDefaultComment,
  primaryBankAccountApi,
  recommendForLegalApi,
  referralReportDownloadApi,
  referralReportGetApi,
  rejectLoanApi,
  renewFailedMandate,
  reSendContractEmailApi,
  retrieveDirectorGetAPI,
  sendContractEmailApi,
  sendFundLoanCommentsApi,
  sendFundLoanRemarksApi,
  sendPapContractApi,
  sendTrustIdGuestlinkApi,
  snapShotGetApi,
  snapShotReportDownloadApi,
  submitLoanApi,
  summaryReportDownloadApi,
  summaryReportGetApi,
  transactionCategoryApi,
  transactionCategoryPostApi,
  trustIdStatusApi,
  unitProfileApproval,
  unitProfileRejectApi,
  updateFilledFormsApi,
  userSendTrustIdGuestlinkApi,
  userTrustIdStatusApi,
  uwVerifyGetApi,
  uwVerifyPostApi,
  viewLoanOffersApi,
  listBulkuploadLoanApi,
  bulkuploadLoanPostApi,
  bulkuploadLoanGetApi
};
