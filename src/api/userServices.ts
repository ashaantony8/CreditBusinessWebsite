import { urlQueryCreate } from '../utils/helpers';
import { Delete, Get, Patch, Post } from './axios';

const baseUrl = '/user';
// const listLeadsUrl = `${baseUrl}/leads/`;
// const listCustomerUrl = `${baseUrl}/customer/?${pageSize}`;
// const listFiledAgentUrl = `${baseUrl}/field-agent-profile/`;
// const listReferralUrl = `${baseUrl}/referral/`;
const addReferralUrl = `${baseUrl}/referral/`;
const deleteReferralUrl = `${baseUrl}/referral/`;
const addMangerUrl = `${baseUrl}/creditbmanager/`;
const addFiledAgentUrl = `${baseUrl}/field_agents/`;
const addFinanceManagerUrl = `${baseUrl}/creditbfinancemanager/`;
// const deleteFiledAgentUrl = `${baseUrl}/field-agents/`;
// const deleteCustomerUrl = `${baseUrl}/customer/`;
// const viewCustomerUrl = `${baseUrl}/customer_details/`;
// const deleteLeadUrl = `${baseUrl}/customer/`;
const listManagerUrl = `${baseUrl}/manager_list/`;
const deleteManagerUrl = `${baseUrl}/manager_details/?manager_id`;
const listAgentUrl = `${baseUrl}/field_agent_list/`;
const userProfileUrl = `${baseUrl}/user_profile/`;
const sendReferralMail = `${baseUrl}/referral_mail/`;
const fieldAgentTargetUrl = `${baseUrl}/field_agent_target/`;
const ContactUsUrl = `${baseUrl}/contact_us/`;
const RefreshToken = `${baseUrl}/token/refresh/`;
const addUnderWriterUrl = `${baseUrl}/creditbunderwriter/`;
const createCustomerUrl = `${baseUrl}/customer/`;
const adminListUrl = `${baseUrl}/admin_approval/`;
const admApproveUrl = `${baseUrl}/admin_approval/`;
const profilePictureUplodUrl = `${baseUrl}/profile/image/`;
const customerLinkedUrl = `${baseUrl}/lead_customer/`;
const customerProfilApprovalApi = `${baseUrl}/admin_approval/`;
const customerProfilRejectUrl = `${baseUrl}/admin_approval/`;
const fetchCustomersNonPaginatedUrl = `${baseUrl}/lead_customer_non_paginated/`;

// Agent
const addFieldAgentApi = async formData => {
  return Post({ url: addFiledAgentUrl, request: formData });
};

const deleteFieldAgentApi = async id => {
  const deleteFiledAgentUrl = `${baseUrl}/agent_details/?agent_id=${id}`;
  return Delete({ url: deleteFiledAgentUrl, request: {} });
};

const viewFieldAgentApi = async id => {
  const viewFieldrUrl = `${baseUrl}/agent_details/?agent_id=${id}`;
  return Get({ url: viewFieldrUrl, request: {} });
};

// const listFieldAgentApi = async ({url, searchQuery, sortOrder }) => {
//   const listFiledAgentUrl = url
//     ? `${url}&search=${searchQuery}`
//     : `${baseUrl}/field_agent_list/?${pageSize}&search=${searchQuery}&sort=id&order=asc&order=${sortOrder}`;
//   return Get({ url: listFiledAgentUrl, request: {} });
// };

//Field Agent List API
const listFieldAgentApi = async QueryObject => {
  const listFiledAgentUrl = urlQueryCreate(
    `${baseUrl}/field_agents/`,
    QueryObject
  );
  return Get({ url: listFiledAgentUrl, request: {} });
};

const editFieldAgentApi = async (id, formData) => {
  const addFiledAgentUrl = `${baseUrl}/agent_details/?agent_id=${id}`;
  return Patch({ url: addFiledAgentUrl, request: formData });
};

// Referral
const addReferralPostAPI = async formData => {
  return Post({ url: addReferralUrl, request: formData });
};
const deleteReferralAPI = async id => {
  return Delete({ url: `${deleteReferralUrl}${id}`, request: {} });
};

const sendReferralPostAPI = async formData => {
  return Post({ url: sendReferralMail, request: formData });
};

const viewReferralApi = async id => {
  const viewReferralrUrl = `${baseUrl}/referral/${id}/`;
  return Get({ url: viewReferralrUrl, request: {} });
};

const editReferralApi = async (id, formData) => {
  const editReferralrUrl = `${baseUrl}/referral/${id}/`;
  return Patch({ url: editReferralrUrl, request: formData });
};

// const listReferralApi = async ({url, searchQuery }) => {
//   const listReferralUrl = url
//     ? `${url}&search=${searchQuery}`
//     : `${baseUrl}/referral/?${pageSize}&search=${searchQuery}`;
//   return Get({ url: listReferralUrl, request: {} });
// };

//listReferralApi
const listReferralApi = async Queryobject => {
  const listReferralUrl = urlQueryCreate(`${baseUrl}/referral`, Queryobject);
  return Get({ url: listReferralUrl, request: {} });
};
// Mark as received benefitApi
const receivedBenefitApi = async id => {
  const receivedBenefitUrl = `${baseUrl}/referral_benefit/${id}/`;
  return Post({ url: receivedBenefitUrl, request: { benefit_received: true } });
};

// Manager
const addMangerAPI = async formData => {
  return Post({ url: addMangerUrl, request: formData });
};

// const listMangerAPI = async ({url, searchQuery} ) => {
//   const listMangerUrl = url
//     ? `${url}&search=${searchQuery}`
//     : `${baseUrl}/creditbmanager/?${pageSize}&search=${searchQuery}`;
//   return Get({ url: listMangerUrl, request: {} });
// };

//List Manager Api
const listMangerAPI = async Queryobject => {
  const listManagerUrl = urlQueryCreate(
    `${baseUrl}/creditbmanager/`,
    Queryobject
  );
  return Get({ url: listManagerUrl, request: {} });
};

const editManagerApi = async (id, formData) => {
  const editManagerrUrl = `${baseUrl}/manager_details/?manager_id=${id}`;
  return Patch({ url: editManagerrUrl, request: formData });
};

const sortManagerByIdApi = async (id, formData) => {
  const sortManagerByIdUrl = `${baseUrl} /managers/?ordering=${id}`;
  return Get({ url: sortManagerByIdUrl, request: formData });
};

const viewManagerApi = async id => {
  const viewManagerUrl = `${baseUrl}/manager_details/?manager_id=${id}`;
  return Get({ url: viewManagerUrl, request: {} });
};

const deleteManagerApi = async id => {
  return Delete({ url: `${deleteManagerUrl}=${id}`, request: {} });
};

const listAndSortLeadsApi = async QueryObject => {
  const listLeadsUrl = urlQueryCreate(`${baseUrl}/leads/`, QueryObject);
  return Get({ url: listLeadsUrl, request: {} });
};

const sortLeadsApi = async ({ searchQuery, sortColumn, sortOrder, mode }) => {
  const leadSorting = `${baseUrl}leads/?search=${searchQuery}&mode_of_app=${mode}&sort_field=${sortColumn}&sort_order=${sortOrder}`;
  return Get({ url: leadSorting, request: {} });
};

const deleteLeadApi = async id => {
  const deleteLeadsApi = `${baseUrl}/customer_details/?customer_id=${id}`;
  return Delete({ url: deleteLeadsApi, request: {} });
};

// Customer
// const listCustomerApi = async ({url, searchQuery} ) => {
//   const listCustomerUrl = url
//     ? `${url}&search=${searchQuery}`
//     : `${baseUrl}/customer/?${pageSize}&search=${searchQuery}`;
//   return Get({ url: listCustomerUrl, request: {} });
// };

const listCustomerApi = async QueryObject => {
  const listCustomerUrl = urlQueryCreate(`${baseUrl}/customer/`, QueryObject);
  return Get({ url: listCustomerUrl, request: {} });
};

const viewCustomerApi = async id => {
  const viewCustomerUrl = `${baseUrl}/customer_details/?customer_id=${id}`;
  return Get({ url: viewCustomerUrl, request: {} });
};

const sortCustomerIdApi = async id => {
  const sortCustomerIdUrl = `${baseUrl}/customer/?ordering=${id}`;
  return Get({ url: sortCustomerIdUrl, request: {} });
};

const filterCustomerIdApi = async status => {
  const filterCustomerIdUrl = `${baseUrl}customer/?app_status=${status}`;
  return Get({ url: filterCustomerIdUrl, request: {} });
};

const editCustomerApi = async (id, formData) => {
  const editCustomerUrl = `${baseUrl}/customer_details/?customer_id=${id}`;
  return Patch({ url: editCustomerUrl, request: formData });
};
const editCustomerProfileApi = async (id, formData) => {
  const customerProfileEditUrl = `${baseUrl}/customer/${id}/`;

  return Patch({ url: customerProfileEditUrl, request: formData });
};

const deleteCustomerApi = async id => {
  const deleteCustomersApi = `${baseUrl}/customer_details/?customer_id=${id}`;
  return Delete({ url: deleteCustomersApi, request: {} });
};

const listManagersApi = async ({ searchQuery }) => {
  return Get({ url: `${listManagerUrl}?search=${searchQuery}`, request: {} });
};

const listAgentsApi = async ({ searchQuery }) => {
  return Get({
    url: `${listAgentUrl}?search=${searchQuery || ''}`,
    request: {}
  });
};

const userProfileApi = async (id?: string | number) => {
  return Get({
    url: id ? `${userProfileUrl}?customer_id=${id}` : userProfileUrl,
    request: {}
  });
};
const userProfileEditApi = async formData => {
  return Post({
    url: userProfileUrl,
    request: formData
  });
};

const fieldAgentTargetApi = (fieldAgentId?: string) => {
  return Get({
    url: fieldAgentId
      ? `${fieldAgentTargetUrl}?field_agent_id=${fieldAgentId}`
      : fieldAgentTargetUrl,
    request: {}
  });
};

//Contact US

const contactUsApi = async formData => {
  return Post({ url: ContactUsUrl, request: formData });
};

//Refresh Token

const refreshTokenApi = async formData => {
  return Post({ url: RefreshToken, request: formData });
};

//underwriter

const addUnderWriterApi = async formData => {
  return Post({ url: addUnderWriterUrl, request: formData });
};

const deleteUnderwriterApi = async id => {
  const deleteUnderWritertUrl = `${baseUrl}/underwriter_details/?under_writer_id=${id}`;
  return Delete({ url: deleteUnderWritertUrl, request: {} });
};

const EditUnderwriterApi = async (id, formData) => {
  const editUnderWritertUrl = `${baseUrl}/underwriter_details/?underwriter_id=${id}`;
  return Patch({ url: editUnderWritertUrl, request: formData });
};

// const listUnderwriterApi = async (url, searchQuery = "",sortOrder="") => {
//   const listFiledAgentUrl = url
//     ? `${url}&search=${searchQuery}`
//     : `${baseUrl}/field_agent_list/?${pageSize}&search=${searchQuery}&sort=id&order=asc&order=${sortOrder}`;
//   return Get({ url: listFiledAgentUrl, request: {} });
// };

// const listUnderwriterApi = async () => {
//   const listFiledAgentUrl = `${baseUrl}/creditbunderwriter`;
//   return Get({ url: listFiledAgentUrl, request: {} });
// };

const listUnderwriterApi = async Queryobject => {
  const listUnderwriterUrl = urlQueryCreate(
    `${baseUrl}/creditbunderwriter`,
    Queryobject
  );
  return Get({ url: listUnderwriterUrl, request: {} });
};

const viewUnderwriterApi = async id => {
  const viewFiledAgentUrl = `${baseUrl}/underwriter_details/?underwriter_id=${id}`;
  return Get({ url: viewFiledAgentUrl, request: {} });
};
const createCustomerApi = async formData => {
  return Post({ url: createCustomerUrl, request: formData });
};

// const AdminListApi = async () => {
//   return Get({
//     url: admiListUrl,
//     request: {},
//   });
// };

// Approval List Api
const AdminListApi = async Queryobject => {
  const adminListPaginatedUrl = urlQueryCreate(adminListUrl, Queryobject);
  return Get({ url: adminListPaginatedUrl, request: {} });
};

const AdminListApiNonPaginated = async () => {
  //need to change
  return Get({
    url: adminListUrl,
    request: {}
  });
};

const AdminApproveApi = async formData => {
  return Post({ url: admApproveUrl, request: formData });
};

const customerApprovalApi = async id => {
  const customerApprovelListUrl = `${baseUrl}/admin_approval/?id=${id}`;
  return Get({ url: customerApprovelListUrl, request: {} });

  //Business partners list
};
// const listBusinessPartnersApi = async (
//   QueryObject
// ) => {
//   const listBusinessPartnersUrl = urlQueryCreate(`${baseUrl}/customer`, QueryObject);
// return Get({ url: listBusinessPartnersUrl, request: {} });
// };

const addKpiApi = async formData => {
  return Post({ url: fieldAgentTargetUrl, request: formData });
};

const listFinanceManagerApi = async QueryObject => {
  const listFiledAgentUrl = urlQueryCreate(
    `${baseUrl}/creditbfinancemanager/`,
    QueryObject
  );
  return Get({ url: listFiledAgentUrl, request: {} });
};
const deleteFinanceManagerApi = async id => {
  const deleteFiledAgentUrl = `${baseUrl}/finance_manager_details/?manager_id=${id}`;
  return Delete({ url: deleteFiledAgentUrl, request: {} });
};

const viewFinanceManagerApi = async id => {
  const viewFieldrUrl = `${baseUrl}/finance_manager_details/?manager_id=${id}`;
  return Get({ url: viewFieldrUrl, request: {} });
};

const editFinanceManagerApi = async (id, formData) => {
  const addFinanceManagerUrl = `${baseUrl}/finance_manager_details/?manager_id=${id}`;
  return Patch({ url: addFinanceManagerUrl, request: formData });
};

const addFinanceManagerApi = async formData => {
  return Post({ url: addFinanceManagerUrl, request: formData });
};
// profile picture upload
const profilePictureUploadApi = async formData => {
  return Post({ url: profilePictureUplodUrl, request: formData });
};

const customerLinkedApi = async QueryObject => {
  const unitCustomerLinkedUrl = urlQueryCreate(customerLinkedUrl, QueryObject);
  return Get({
    url: unitCustomerLinkedUrl,
    request: {}
  });
};

// customer-profile Approval Api
const customerProfileApproval = async formData => {
  return Post({ url: customerProfilApprovalApi, request: formData });
};

const customerProfileRejectApi = async formData => {
  return Post({ url: customerProfilRejectUrl, request: formData });
};
const fetchUnitCustomersNonPaginatedApi = (
  notInCompanyId,
  searchTerm = '',
  filter
) => {
  const queryFilter =
    filter === 'customer' ? 'CUSTOMER' : filter === 'lead' ? 'LEADS' : '';
  const url = `${fetchCustomersNonPaginatedUrl}${searchTerm ? `?not_in_company=${notInCompanyId}&search=${searchTerm}` : ''}${queryFilter ? `${searchTerm ? '&' : '?'}role=${queryFilter}` : ''}`;
  return Get({ url, request: {} });
};

const fetchCustomersNonPaginatedApi = (searchTerm = '', filter) => {
  const queryFilter =
    filter === 'customer' ? 'CUSTOMER' : filter === 'lead' ? 'LEADS' : '';
  const url = `${fetchCustomersNonPaginatedUrl}${searchTerm ? `?search=${searchTerm}` : ''}${queryFilter ? `${searchTerm ? '&' : '?'}role=${queryFilter}` : ''}`;
  return Get({ url, request: {} });
};

export {
  addFieldAgentApi,
  addFinanceManagerApi,
  addKpiApi,
  addMangerAPI,
  addReferralPostAPI,
  addUnderWriterApi,
  AdminApproveApi,
  AdminListApi,
  AdminListApiNonPaginated,
  contactUsApi,
  createCustomerApi,
  customerApprovalApi,
  customerLinkedApi,
  customerProfileApproval,
  customerProfileRejectApi,
  deleteCustomerApi,
  deleteFieldAgentApi,
  deleteFinanceManagerApi,
  deleteLeadApi,
  deleteManagerApi,
  deleteReferralAPI,
  deleteUnderwriterApi,
  editCustomerApi,
  editCustomerProfileApi,
  editFieldAgentApi,
  editFinanceManagerApi,
  editManagerApi,
  editReferralApi,
  EditUnderwriterApi,
  fetchCustomersNonPaginatedApi,
  fetchUnitCustomersNonPaginatedApi,
  fieldAgentTargetApi,
  filterCustomerIdApi,
  listAgentsApi,
  // listLeadsApi,
  listAndSortLeadsApi,
  listCustomerApi,
  listFieldAgentApi,
  listFinanceManagerApi,
  listManagersApi,
  listMangerAPI,
  listReferralApi,
  listUnderwriterApi,
  profilePictureUploadApi,
  receivedBenefitApi,
  refreshTokenApi,
  sendReferralPostAPI,
  sortCustomerIdApi,
  sortLeadsApi,
  sortManagerByIdApi,
  userProfileApi,
  // listBusinessPartnersApi,
  userProfileEditApi,
  viewCustomerApi,
  viewFieldAgentApi,
  viewFinanceManagerApi,
  viewManagerApi,
  viewReferralApi,
  viewUnderwriterApi
};
