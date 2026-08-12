import { configureStore } from "@reduxjs/toolkit";

import locationReducer from "../services/features/location/locationSlice";
import authReducer from "../services/features/auth/authSlice";
import profileReducer from "../services/features/profile/profileSlice";
import customerAuthReducer from "../services/features/customerAuth/customerAuthSlice";
import customerProfileReducer from "../services/features/customerProfile/customerProfileSlice";

export const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
    profile: profileReducer,
    customerAuth: customerAuthReducer,
    customerProfile: customerProfileReducer,
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
