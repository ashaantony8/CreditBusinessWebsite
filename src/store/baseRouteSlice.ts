import { createSlice } from '@reduxjs/toolkit';

import store from '.';

const baseRouteSlice = createSlice({
  name: 'baseRoute',
  initialState: {
    history: []
  },
  reducers: {
    addBaseRoute: (state, action) => {
      const route = action.payload;
      if (!state.history.includes(route)) {
        state.history.push(route);
      }
    },
    resetBaseRoutes: state => {
      state.history = [];
    }
  }
});

export const { addBaseRoute, resetBaseRoutes } = baseRouteSlice.actions;

export const baseRouteSliceSelector = (
  state: ReturnType<typeof store.getState>
) => {
  return state.baseRouteReducer;
};
export default baseRouteSlice.reducer;
