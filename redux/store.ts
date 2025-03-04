import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import fileSystemReducer from './slices/fileSystemSlice';
import editorReducer from './slices/editorSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  fileSystem: fileSystemReducer,
  editor: editorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;