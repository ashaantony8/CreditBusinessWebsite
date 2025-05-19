import moment from 'moment';
import { createContext } from 'react';

import {
  applyNewLoaApi,
  customerLoanApi,
  filledFormsGetApi,
  updateFilledFormsApi
} from '../api/loanServices';
import { FundingFromCurrentStatus } from './enums';
import { NotificationType } from './hooks/toastify/enums';
import { QueryObject } from './types';

interface Address {
  full_address: string;
  Company_Name: string;
}

interface FormattedAddress {
  pincode: string;
  addressText: string;
  Company_Name: string;
}

export const lookUpAddressFormatter = (address: Address): FormattedAddress => {
  const addressText = address?.full_address || '';
  const Company_Name = address?.Company_Name || '';

  const keys = Object.keys(address);
  const pincode = address[keys[keys.length - 2]];

  return { pincode, addressText, Company_Name };
};

export const dateInSlashFromate = currentDate => {
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return currentDate.toLocaleDateString('en-US', options);
};

export const StayContext = createContext(null);

export const getStayExcludeDateIntervals = (
  PartnerStayDate,
  currentStayIndex
) => {
  const excludeDateIntervals = [];
  PartnerStayDate.forEach(({ start_date, end_date }, stayIndex) => {
    if (stayIndex !== currentStayIndex && start_date && end_date) {
      excludeDateIntervals.push({ start: start_date, end: end_date });
    }
  });
  return excludeDateIntervals;
};

export const getStayDateWithExcludeDateIntervals = directors => {
  const dateRanges = [];

  directors?.forEach((element, currentPartnerIndex) => {
    dateRanges[currentPartnerIndex] = [];
    element?.stay?.forEach(({ start_date, end_date }, currentStayIndex) => {
      dateRanges[currentPartnerIndex][currentStayIndex] = {
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        excludeDateIntervals: getStayExcludeDateIntervals(
          element.stay,
          currentStayIndex
        )
      };
    });
  });

  return dateRanges;
};

export const convertDateString = dateString => {
  const dateFormat = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';
  return moment(dateString, dateFormat).format('YYYY-MM-DD');
};

// convertImageLinkToFile is responsible for converting a single image URL to a file.

function getFileNameFromUrl(url) {
  if (url) {
    const parts = url?.split('/');
    const filenameWithExtension = parts[parts.length - 1];
    return filenameWithExtension;
  }
  return '';
}
function removeStringInFilename(filename) {
  return filename.replace(/_([^_]*)\./, '.');
}

export function getNameFromUrl(imageUrl) {
  const fileWithExtension = getFileNameFromUrl(imageUrl);
  const name = removeStringInFilename(fileWithExtension);
  return name;
}

export function getExtensionFromUrl(imageUrl: string): string {
  const fileWithExtension = getFileNameFromUrl(imageUrl);
  const extension = fileWithExtension.split('.').pop();
  return extension ? extension.toLowerCase() : '';
}

export const convertImageLinkToFile = async imageUrl => {
  try {
    const fileName = getNameFromUrl(imageUrl);
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error converting image to file:', error);
    throw new Error(error);
  }
};

export const fetchAndConvertFiles = async data => {
  try {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.startsWith('http')) {
        const file = await convertImageLinkToFile(value);
        data[key] = [file];
      }
      if (Array.isArray(value)) {
        data[key] = await Promise.all(
          value.map(async element => {
            if (
              typeof element.file === 'string' &&
              element.file.startsWith('http')
            ) {
              const file = await convertImageLinkToFile(element.file);
              return file;
            }
            return element;
          })
        );
      }
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchFilledForms = async (loanId: string) => {
  try {
    const filledFormsGetApiResponse = await filledFormsGetApi(loanId);
    return filledFormsGetApiResponse?.filled_forms_count;
  } catch (error) {
    console.log('error', error);
  }
};

export const truncateString = (str: string, limit: number): string => {
  if (typeof str !== 'string') return '';
  return str.trim().length > limit
    ? str.trim().substring(0, limit) + '...'
    : str.trim();
};

export const setFieldValuesForDisbursementAdvice = (data, setValue) => {
  setValue('unitName', data?.customer?.company_name);
};

export const updateFilledForms = async (loanId, payload) => {
  try {
    const updateFilledFormsApiResponse = await updateFilledFormsApi(
      loanId,
      payload
    );
    if (updateFilledFormsApiResponse.status_code === 200) {
      const filledFormsCount =
        updateFilledFormsApiResponse?.data?.filled_forms_count;
      return filledFormsCount;
    }
  } catch (error) {
    console.log('Exception', error);
  }
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const urlQueryCreate = (
  url: string,
  { filter = {}, search = [], sort = {}, pages_size, page }: QueryObject
): string => {
  const params = new URLSearchParams();

  // Append filter parameters, excluding those that are "", undefined, or null
  Object.entries(filter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Append each value individually if it's an array
      value.forEach(val => {
        if (val !== '' && val !== undefined && val !== null) {
          params.append(key, val);
        }
      });
    } else if (value !== '' && value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  // Append search parameters, excluding those that are "", undefined, or null
  search?.forEach(item => {
    if (item !== '' && item !== undefined && item !== null) {
      params.append('search', item);
    }
  });

  // Append sort parameters, excluding those that are "", undefined, or null
  Object.entries(sort).forEach(([key, value]) => {
    if (
      value !== '' &&
      value !== undefined &&
      value !== null &&
      key !== '' &&
      key !== undefined &&
      key !== null
    ) {
      params.append('sort_by', key);
      params.append('order', value);
    }
  });

  // Append pagination parameters, excluding those that are undefined or null
  if (pages_size !== undefined && pages_size !== null) {
    params.append('page_size', String(pages_size));
  }
  if (page !== undefined && page !== null) {
    params.append('page', String(page));
  }

  return `${url}?${params.toString()}`;
};

const fetchCustomerLoans = async (loanId?: string, customerId?: string) => {
  try {
    const loanGetApiResponse = await customerLoanApi(
      loanId || null,
      customerId || null
    );
    return loanGetApiResponse.data;
  } catch (error) {
    console.log('Exception', error);
  }
};

export const chkCustNewLoan = async (customerId?: string) => {
  try {
    const custLoansResponse = await fetchCustomerLoans(null, customerId);
    const isApplicableForNewLoan = custLoansResponse.every(
      ({ loan_status }) =>
        loan_status.current_status ===
          FundingFromCurrentStatus.AdminCashDisbursed ||
        loan_status.current_status === FundingFromCurrentStatus.FundingClosed
    );
    return {
      isApplicableForNewLoan,
      loanCount: custLoansResponse.length
    };
  } catch (error) {
    console.log('Exception', error);
  }
};

export const applyNewLoan = async (navigate, customerId?: string) => {
  try {
    const custLoansResponse = await applyNewLoaApi(customerId); // pass customer_id here
    if (
      custLoansResponse.status_code >= 200 &&
      custLoansResponse.status_code < 300
    ) {
      if (custLoansResponse?.data?.id) {
        navigate(`/funding-form/${custLoansResponse?.data?.id}`);
      } else {
        throw new Error(`Somethig went wrong`);
      }
    } else {
      throw new Error(`Unexpected status code`);
    }
  } catch (error) {
    console.log('Exception', error);
    throw error; // Rethrow the error to be caught by the calling function
  }
};

export const AffordabilityNextTab = value => {
  const array = ['general_form', 'gross_form', 'approval_form'];
  const valueIndex = array.indexOf(value);
  return array[valueIndex <= array.length ? valueIndex + 1 : -1];
};

export const AffordabilityPrevTab = value => {
  const array = ['general_form', 'gross_form', 'approval_form'];
  const valueIndex = array.indexOf(value);
  return array[valueIndex <= 0 ? 0 : valueIndex - 1];
};

export const AffordabilityCurrentTab = value => {
  const array = ['general_form', 'gross_form', 'approval_form'];
  const valueIndex = array.indexOf(value);
  return valueIndex + 1;
};

export const handleReportDownload = async (
  apiFunction,
  setTransactionData,
  showToast,
  filter
) => {
  try {
    const response = await apiFunction(filter || undefined);
    if (!response?.status_code) {
      setTransactionData(response);
    }
  } catch (error) {
    showToast('Download failed: ' + error.message, {
      type: NotificationType.Error
    });
  }
};
