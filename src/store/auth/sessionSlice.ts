import { createSlice } from '@reduxjs/toolkit';

import { SessionSliceType } from '../../utils/types';
import { RootState } from '..';

const initialState: SessionSliceType = {
  accessToken: '',
  refreshToken: '',
  signedIn: false
};

export const sessionSlice = createSlice({
  name: 'auth/session',
  initialState,
  reducers: {
    onSignInSuccess: (state, action) => {
      state.signedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    onSignOutSuccess: () => initialState,
    setToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    }
  }
});

export const sessionSliceSelector = (state: RootState) => {
  return state.auth.session;
};
export const { onSignInSuccess, onSignOutSuccess, setToken } =
  sessionSlice.actions;

export default sessionSlice.reducer;
