import { combineReducers } from 'redux';

import { AsyncReducers } from '../utils/types';
import auth from './auth';
import baseRouteReducer from './baseRouteSlice';
import fundingStateReducer from './fundingStateReducer';
import loanFormReducer from './loanFormReducer';
import { managementIdSlice, managementSlice } from './managementReducer';

const rootReducer = (asyncReducers: AsyncReducers) => {
  const combinedReducer = combineReducers({
    fundingStateReducer,
    loanFormReducer,
    managementReducer: managementSlice.reducer,
    managementIdReducer: managementIdSlice.reducer,
    baseRouteReducer,
    auth,
    ...asyncReducers
  });

  return combinedReducer;
};

export default rootReducer;
