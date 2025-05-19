import { Get, Post } from './axios';

const baseUrl = '/user';
const addressProofEndPoind = 'loan/address_proof_details/';
const addressProofPost = 'loan/addressproof/';
const photoIdEndPoind = 'loan/photo_id_details/';
const photoIdEndPoindPost = 'loan/photoid/';
const customerDetailsEndPoind = `${baseUrl}/customer_details/`;
const customerOtherDocuments = 'loan/customer_other_documents/';
const customerBankStatementsDetailsUrl =
  'loan/customer_bank_statements_details/';

export const getAddressProofOptions = async unit_id => {
  return Get({
    url: unit_id
      ? `${addressProofEndPoind}?unit_id=${unit_id}`
      : addressProofEndPoind,
    request: {}
  });
};
export const postAddressProof = async (unit_id, formData) => {
  return Post({
    url: unit_id ? `${addressProofPost}?unit_id=${unit_id}` : addressProofPost,
    request: formData
  });
};
export const getPhotoId = async unit_id => {
  return Get({
    url: unit_id ? `${photoIdEndPoind}?unit_id=${unit_id}` : photoIdEndPoind,
    request: {}
  });
};

export const postPhotoId = async (unit_id, formData) => {
  return Post({
    url: unit_id
      ? `${photoIdEndPoindPost}?unit_id=${unit_id}`
      : photoIdEndPoindPost,
    request: formData
  });
};

export const getUserDetails = (leadId?: number | string) => {
  return Get({
    url: leadId
      ? `${customerDetailsEndPoind}?customer_id=${leadId}`
      : customerDetailsEndPoind,
    request: {}
  });
};

export const customerOtherDocumentsApi = (unit_id?: number | string) => {
  return Get({
    url: unit_id
      ? `${customerOtherDocuments}?unit_id=${unit_id}`
      : customerOtherDocuments,
    request: {}
  });
};

export const customerBankStatementApi = ({
  leadId,
  unitId
}: {
  leadId?: string;
  unitId?: string;
}) => {
  const queryParams = new URLSearchParams({
    ...(leadId && { customer_id: leadId }),
    ...(unitId && { unit_id: unitId })
  });

  return Get({
    url: `${customerBankStatementsDetailsUrl}?${queryParams.toString()}`,
    request: {}
  });
};
