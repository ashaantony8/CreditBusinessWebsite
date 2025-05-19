import { createSlice } from '@reduxjs/toolkit';

import { Roles } from '../../utils/enums';
import { userSliceInitialState } from '../../utils/types';
import { RootState } from '..';

export const initialState: userSliceInitialState = {
  role: Roles.Leads,
  id: undefined,
  email: '',
  first_name: '',
  last_name: '',
  addressProofData: {},
  photoIdData: {},
  image: '',
  phone_number: undefined
};

export const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
    setAddressProof: (state, action) => {
      state.addressProofData = action.payload;
    },
    setPhotoId: (state, action) => {
      state.photoIdData = action.payload;
    },
    userLoggedOut: () => initialState
  }
});

export const { setUser, setAddressProof, setPhotoId, userLoggedOut } =
  userSlice.actions;
export const authSelector = (state: RootState) => state.auth.user;

export default userSlice.reducer;
