import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunkWithHandler } from '@/services/api/axiosClient';
import customerAuthService from './customerAuthService';

export const registerCustomer = createAsyncThunkWithHandler(
  'customerAuth/registerCustomer',
  async (data: any, thunkAPI) => {
    return await customerAuthService.registerCustomer(data);
  }
);

export const loginCustomer = createAsyncThunkWithHandler(
  'customerAuth/loginCustomer',
  async (data: any, thunkAPI) => {
    return await customerAuthService.loginCustomer(data);
  }
);

export const setupCustomerProfile = createAsyncThunkWithHandler(
  'customerAuth/setupCustomerProfile',
  async (data: any, thunkAPI) => {
    return await customerAuthService.setupCustomerProfile(data);
  }
);

export const googleMobileAuth = createAsyncThunkWithHandler(
  'customerAuth/googleMobileAuth',
  async (data: any, thunkAPI) => {
    return await customerAuthService.googleMobileAuth(data);
  }
);

export const getMe = createAsyncThunkWithHandler(
  'customerAuth/getMe',
  async (_, thunkAPI) => {
    return await customerAuthService.getMe();
  }
);

interface CustomerAuthState {
  user: any | null;
  token: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: CustomerAuthState = {
  user: null,
  token: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || null;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(loginCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || null;
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(setupCustomerProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setupCustomerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data?.user || state.user;
      })
      .addCase(setupCustomerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(googleMobileAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleMobileAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || null;
      })
      .addCase(googleMobileAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data?.user || null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, logout } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
