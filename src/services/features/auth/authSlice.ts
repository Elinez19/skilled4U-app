import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunkWithHandler } from '@/services/api/axiosClient';
import authService from './authService';

export const providerLogin = createAsyncThunkWithHandler(
  'auth/providerLogin',
  async (data: any, thunkAPI) => {
    return await authService.providerLogin(data);
  }
);

export const providerRegister = createAsyncThunkWithHandler(
  'auth/providerRegister',
  async (data: any, thunkAPI) => {
    return await authService.providerRegister(data);
  }
);

export const verifyProvider = createAsyncThunkWithHandler(
  'auth/verifyProvider',
  async (data: any, thunkAPI) => {
    return await authService.verifyProvider(data);
  }
);

export const setupProfile = createAsyncThunkWithHandler(
  'auth/setupProfile',
  async (data: any, thunkAPI) => {
    return await authService.setupProfile(data);
  }
);

export const resendVerification = createAsyncThunkWithHandler(
  'auth/resendVerification',
  async (data: any, thunkAPI) => {
    return await authService.resendVerification(data);
  }
);

export const getAccessToken = createAsyncThunkWithHandler(
  'auth/getAccessToken',
  async (_, thunkAPI) => {
    return await authService.getAccessToken();
  }
);

export const forgotPassword = createAsyncThunkWithHandler(
  'auth/forgotPassword',
  async (data: any, thunkAPI) => {
    return await authService.forgotPassword(data);
  }
);

export const resetPassword = createAsyncThunkWithHandler(
  'auth/resetPassword',
  async (data: any, thunkAPI) => {
    return await authService.resetPassword(data);
  }
);

export const logout = createAsyncThunkWithHandler(
  'auth/logout',
  async (_, thunkAPI) => {
    return await authService.logout();
  }
);

interface AuthState {
  user: any | null;
  token: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(providerLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(providerLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || null;
      })
      .addCase(providerLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
