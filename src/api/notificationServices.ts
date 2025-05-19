import { Get, Post } from './axios';

const baseUrl = '/notifications';

const fieldAgentUrl = `${baseUrl}/field_agent/`;
const fieldAgentNotificationViewedUrl = `${baseUrl}/field_agent/`;
const customerNotificationViewedUrl = `${baseUrl}/customer/`;
const underWriterUrl = `${baseUrl}/under_writer/`;
const underWriterNotificationViewedUrl = `${baseUrl}/under_writer/`;
const adminUrl = `${baseUrl}/admin/`;
const adminUrlNotificationViewedUrl = `${baseUrl}/admin/`;
const managerUrl = `${baseUrl}/manager/`;
const managerNotificationViewedUrl = `${baseUrl}/manager/`;
const financeManagerUrl = `${baseUrl}/finance_manager/`;
const financeManagerNotificationViewedUrl = `${baseUrl}/finance_manager/`;

const fieldAgentNotificationApi = (fieldAgentId?: number | string) => {
  return Get({
    url: fieldAgentId
      ? `${fieldAgentUrl}?field_agent_id=${fieldAgentId}`
      : fieldAgentUrl,
    request: {}
  });
};

const fieldAgentNotificationViewedApi = payload => {
  return Post({
    url: fieldAgentNotificationViewedUrl,
    request: payload
  });
};

const customerNotificationViewedApi = payload => {
  return Post({
    url: customerNotificationViewedUrl,
    request: payload
  });
};

const customerNotificationApi = (customerId?: number | string) => {
  return Get({
    url: customerId
      ? `${customerNotificationViewedUrl}?customer_id=${customerId}`
      : customerNotificationViewedUrl,
    request: {}
  });
};

const underWriterNotificationApi = (underWriterId?: number | string) => {
  return Get({
    url: underWriterId
      ? `${underWriterUrl}?under_writer_id=${underWriterId}`
      : underWriterUrl,
    request: {}
  });
};
const underWriterNotificationViewedApi = payload => {
  return Post({
    url: underWriterNotificationViewedUrl,
    request: payload
  });
};
const adminNotificationApi = (adminId?: number | string) => {
  return Get({
    url: adminId ? `${adminUrl}?admin_id=${adminId}` : adminUrl,
    request: {}
  });
};
const adminNotificationViewedApi = payload => {
  return Post({
    url: adminUrlNotificationViewedUrl,
    request: payload
  });
};
const managerNotificationApi = (managerId?: number | string) => {
  return Get({
    url: managerId ? `${managerUrl}?admin_id=${managerId}` : managerUrl,
    request: {}
  });
};
const managerNotificationViewedApi = payload => {
  return Post({
    url: managerNotificationViewedUrl,
    request: payload
  });
};
const financeManagerNotificationApi = (financeManagerId?: number | string) => {
  return Get({
    url: financeManagerId
      ? `${financeManagerUrl}?fm_id=${financeManagerId}`
      : financeManagerUrl,
    request: {}
  });
};
const financeNotificationVieweApi = payload => {
  return Post({
    url: financeManagerNotificationViewedUrl,
    request: payload
  });
};
export {
  adminNotificationApi,
  adminNotificationViewedApi,
  customerNotificationApi,
  customerNotificationViewedApi,
  fieldAgentNotificationApi,
  fieldAgentNotificationViewedApi,
  financeManagerNotificationApi,
  financeNotificationVieweApi,
  managerNotificationApi,
  managerNotificationViewedApi,
  underWriterNotificationApi,
  underWriterNotificationViewedApi
};
