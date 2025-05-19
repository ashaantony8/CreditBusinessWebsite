import { createSlice } from '@reduxjs/toolkit';

import { LoanFormType } from '../utils/types';
import { RootState } from '.';

export const initialState: LoanFormType = {
  personalInformation: {},
  businessDetails: {},
  businessPremiseDetails: {},
  directorOrProprietorDetails: {},
  marketPreference: {},
  documentationUploads: {},
  guarantor: {},
  isSendOtp: false
};

const loanFormSlice = createSlice({
  name: 'loanFormSlice',
  initialState,
  reducers: {
    resetLoanForm: () => initialState,
    updatePersonalInformation: (state, action) => {
      state.personalInformation = action.payload;
    },
    updateBusinessDetails: (state, action) => {
      state.businessDetails = action.payload;
    },
    updateBusinessPremiseDetails: (state, action) => {
      state.businessPremiseDetails = action.payload;
    },
    updateDirectorOrProprietorDetails: (state, action) => {
      state.directorOrProprietorDetails = action.payload;
    },
    updateMarketPreference: (state, action) => {
      state.marketPreference = action.payload;
    },
    updateDocumentationUploads: (state, action) => {
      state.documentationUploads = action.payload;
    },
    updateGuarantor: (state, action) => {
      state.guarantor = action.payload;
    },
    updateIsSendOtp: (state, action) => {
      state.isSendOtp = action.payload;
    }
  }
});

export const {
  resetLoanForm,
  updatePersonalInformation,
  updateBusinessDetails,
  updateBusinessPremiseDetails,
  updateDirectorOrProprietorDetails,
  updateMarketPreference,
  updateDocumentationUploads,
  updateGuarantor,
  updateIsSendOtp
} = loanFormSlice.actions;

export const loanFormSliceSelector = (state: RootState) => {
  return state.loanFormReducer;
};

export default loanFormSlice.reducer;
