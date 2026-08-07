import { configureStore } from "@reduxjs/toolkit";

import locationReducer from "../services/features/location/locationSlice";

export const store = configureStore({
  reducer: {
    location: locationReducer,
    // Add reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 128,
      },
      immutableCheck: {
        warnAfter: 128,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
