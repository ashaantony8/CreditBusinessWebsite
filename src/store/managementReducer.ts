import { createSelector, createSlice } from '@reduxjs/toolkit';
import { LoanData, UnitData, UserProfile } from '../utils/types';
import { RootState } from '.';

export const initialState: {
  user: Partial<UserProfile>;
  loan: Partial<LoanData>;
  unit?: Partial<UnitData>;
} = {
  user: {},
  loan: {},
  unit: {}
};

export const managementSlice = createSlice({
  name: 'managementSlice',
  initialState,
  reducers: {
    resetManagement: () => initialState,
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateLoan: (state, action) => {
      state.loan = action.payload;
    },
    updateUnit: (state, action) => {
      state.unit = action.payload;
    }
  }
});

export const managementIdSlice = createSlice({
  name: 'managementIdSlice',
  initialState: { customerId: null },
  reducers: {
    resetManagementId: () => {
      return { customerId: null };
    },
    updateId: (state, action) => {
      state.customerId = action.payload;
    }
  }
});

export const { resetManagement, updateUser, updateLoan, updateUnit } =
  managementSlice.actions;

export const { updateId, resetManagementId } = managementIdSlice.actions;

// export const managementSliceSelector = (state: RootState) => {
//   return {...state.managementReducer,...state.managementIdReducer};
// };
export const managementSliceSelector = createSelector(
  (state: RootState) => state.managementReducer,
  (state: RootState) => state.managementIdReducer,
  (managementReducer, managementIdReducer) => ({
    ...managementReducer,
    ...managementIdReducer
  })
);
