import { createSlice } from '@reduxjs/toolkit';

import { fundingStateType } from '../utils/types';
import { RootState } from '.';

export const initialState: fundingStateType = {
  currentStage: 0,
  currentHighestStage: 0,
  highestStage: 12,
  gocardlessButtonDisabled: false,
  isContractSend: false
};

const fundingStateSlice = createSlice({
  name: 'fundingStateSlice',
  initialState,
  reducers: {
    resetFundingState: () => initialState,
    updateCurrentStage: (state, action) => {
      state.currentStage = action.payload;
      state.currentHighestStage =
        state.currentHighestStage > state.currentStage
          ? state.currentHighestStage
          : action.payload;
      state.highestStage =
        action.payload > state.highestStage
          ? action.payload
          : state.highestStage;
    },
    updateGocardlessButton: (state, action) => {
      state.gocardlessButtonDisabled = action.payload;
    },
    updateIsContractSend: (state, action) => {
      state.isContractSend = action.payload;
    }
  }
});

export const {
  updateCurrentStage,
  resetFundingState,
  updateGocardlessButton,
  updateIsContractSend
} = fundingStateSlice.actions;

export const fundingStateSliceSelector = (state: RootState) => {
  return state.fundingStateReducer;
};

export default fundingStateSlice.reducer;
