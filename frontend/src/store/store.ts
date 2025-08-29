import { configureStore } from '@reduxjs/toolkit';
import { analysisApi } from './../api/analysisApi';

export const store = configureStore({
  reducer: {
    [analysisApi.reducerPath]: analysisApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(analysisApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;