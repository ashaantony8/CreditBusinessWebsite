import { urlQueryCreate } from '../utils/helpers';
import { Delete, Get, Post } from './axios';

const baseUrl = '/finance_manage';
const finaceMangerUrl = `${baseUrl}/business_partner/`;
const businessPartnerGroupsGetUrl = `${baseUrl}/business_partner_groups/`;
const businessPartnerGroupsNonPaginatedGetUrl = `${baseUrl}/business_partner_groups_all/`;
// const finaceGeneralLedgerUrl=`${baseUrl}/general_ledger/?page=false`
const finaceGeneralLedgerUrl = `${baseUrl}/general_ledger`;
const finaceEntryUrl = `${baseUrl}/entry/  `;
const finaceEntryTypeListUrl = `${baseUrl}/entry_types/`;
const financeStatementUrl = `${baseUrl}/statement/`;
const bulkUploadEntryUrl = `${baseUrl}/import-excel/`;

const financePartnerApi = payload => {
  return Post({
    url: finaceMangerUrl,
    request: payload
  });
};

const financeListApi = QueryObject => {
  return Get({
    url: urlQueryCreate(finaceMangerUrl, QueryObject),
    request: {}
  });
};

const businessPartnerGroupsNonPaginatedGetApi = searchTerm => {
  return Get({
    url: searchTerm
      ? `${businessPartnerGroupsNonPaginatedGetUrl}?search=${searchTerm}`
      : businessPartnerGroupsNonPaginatedGetUrl,
    request: {}
  });
};

const entryTypeGetApi = () => {
  return Get({
    url: finaceEntryTypeListUrl,
    request: {}
  });
};

const generalLedgerGetApi = (searchTerm = '') => {
  const url = searchTerm
    ? `${finaceGeneralLedgerUrl}?search=${searchTerm}`
    : finaceGeneralLedgerUrl;
  return Get({
    url: url,
    request: {}
  });
};

const businessPartnerGetApi = (searchTerm = '') => {
  const url = searchTerm
    ? `${finaceMangerUrl}?search=${searchTerm}`
    : finaceMangerUrl;
  return Get({
    url: url,
    request: {}
  });
};

const financeEntryApi = payload => {
  return Post({
    url: finaceEntryUrl,
    request: payload
  });
};

const financeManagerPlApi = QueryObject => {
  const url = `${financeStatementUrl}profit_loss/`;
  const listUrl = urlQueryCreate(url, QueryObject);
  return Get({
    url: listUrl,
    request: {}
  });
};

const financeManagerTrialBalanceApi = QueryObject => {
  const url = `${financeStatementUrl}trial_balance/`;
  const listUrl = urlQueryCreate(url, QueryObject);
  return Get({
    url: listUrl,
    request: {}
  });
};

const financeManagerBpTrialBalanceApi = QueryObject => {
  const url = `${financeStatementUrl}bp_trial_balance/`;
  const listUrl = urlQueryCreate(url, QueryObject);

  return Get({
    url: listUrl,
    request: {}
  });
};

const financeManagerBalanceSheetApi = QueryObject => {
  const url = `${financeStatementUrl}balance_sheet/`;
  const listUrl = urlQueryCreate(url, QueryObject);

  return Get({
    url: listUrl,
    request: {}
  });
};

const financeManagerLedgerApi = async QueryObject => {
  const financeManagerLedgerUrl = urlQueryCreate(
    `${baseUrl}/ledger/`,
    QueryObject
  );
  return Get({ url: financeManagerLedgerUrl, request: {} });
};

const financeEntryDetailApi = id => {
  const financeEntryDetail = `${finaceEntryUrl}${id}/`;

  return Get({
    url: financeEntryDetail,
    request: {}
  });
};

const financeEntryGetApi = QueryObject => {
  const finaceEntryGetUrl = urlQueryCreate(finaceEntryUrl, QueryObject);
  return Get({
    url: finaceEntryGetUrl,
    request: {}
  });
};

//subcategory-create Api
const subCategoryPostApi = async (payload: {
  main_category: string;
  category_name: string;
}) => {
  const subCategoryUrl = `${baseUrl}/subcategory/`;
  return Post({ url: subCategoryUrl, request: payload });
};
//category list filtered Api
const subCategoryGetApi = async main_cat_id => {
  const subCategoryUrl = `${baseUrl}/subcategory/?main_cat_id=${main_cat_id}`;
  return Get({ url: subCategoryUrl, request: {} });
};
// General-Ledger create api
const generalLedgerPostApi = async (payload: {
  gl_name: string;
  gl_code: string;
  sub_category: string;
}) => {
  const generalLedgerUrl = `${baseUrl}/general_ledger/`;
  return Post({ url: generalLedgerUrl, request: payload });
};

//Main Category

const mainCategoryGetApi = async () => {
  const mainCategoryUrl = `${baseUrl}/maincategory/`;
  return Get({ url: mainCategoryUrl, request: {} });
};

//Entry post api
const financeEntryPostApi = async (payload: {
  entry_type: string;
  date: string;
  debit: {
    debit_account: string;
    debit_amount: number;
    narration: string;
  }[];
  credit: {
    credit_account: string;
    credit_amount: number;
  }[];
  narration: string;
}) => {
  const financeEntryUrl = `${baseUrl}/entry/`;
  return Post({
    url: financeEntryUrl,
    request: payload
  });
};

//business-partner-group-create Api
const bpGroupPostApi = async (payload: { group_name: string; id?: string }) => {
  const subCategoryUrl = `${businessPartnerGroupsGetUrl}`;
  return Post({ url: subCategoryUrl, request: payload });
};

const bpGroupDeleteApi = async groupId => {
  const subCategoryUrl = `${businessPartnerGroupsGetUrl}${groupId}/`;
  return Delete({ url: subCategoryUrl, request: {} });
};

const bpGroupGetApi = QueryObject => {
  const listUrl = urlQueryCreate(`${businessPartnerGroupsGetUrl}`, QueryObject);
  return Get({
    url: listUrl,
    request: {}
  });
};

const bulkUploadEntryPostApi = async payload => {
  return Post({
    url: bulkUploadEntryUrl,
    request: payload
  });
};

export {
  bpGroupDeleteApi,
  bpGroupGetApi,
  bpGroupPostApi,
  bulkUploadEntryPostApi,
  businessPartnerGetApi,
  businessPartnerGroupsNonPaginatedGetApi,
  entryTypeGetApi,
  financeEntryApi,
  financeEntryDetailApi,
  financeEntryGetApi,
  financeEntryPostApi,
  financeListApi,
  financeManagerBalanceSheetApi,
  financeManagerBpTrialBalanceApi,
  financeManagerLedgerApi,
  financeManagerPlApi,
  financeManagerTrialBalanceApi,
  financePartnerApi,
  generalLedgerGetApi,
  generalLedgerPostApi,
  mainCategoryGetApi,
  subCategoryGetApi,
  subCategoryPostApi
};
