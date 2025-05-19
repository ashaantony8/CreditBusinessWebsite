import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'user',
  keyPrefix: '',
  storage: storageSession,
  whitelist: ['auth', 'fundingStateReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer({}));

const store = configureStore({
  reducer: persistedReducer
});

export type RootState = ReturnType<typeof store.getState>;
export const persistore = persistStore(store);
export default store;
