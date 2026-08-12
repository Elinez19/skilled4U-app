import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunkWithHandler } from '@/services/api/axiosClient';
import customerProfileService from './customerProfileService';

const initialState = {
  profile: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getProfile = createAsyncThunkWithHandler(
  'customerProfile/getProfile',
  async (_, thunkAPI) => {
    return await customerProfileService.getProfile();
  }
);

export const updateProfile = createAsyncThunkWithHandler(
  'customerProfile/updateProfile',
  async (data: any, thunkAPI) => {
    return await customerProfileService.updateProfile(data);
  }
);

export const changePassword = createAsyncThunkWithHandler(
  'customerProfile/changePassword',
  async (data: any, thunkAPI) => {
    return await customerProfileService.changePassword(data);
  }
);

export const requestEmailChange = createAsyncThunkWithHandler(
  'customerProfile/requestEmailChange',
  async (data: any, thunkAPI) => {
    return await customerProfileService.requestEmailChange(data);
  }
);

export const confirmEmailChange = createAsyncThunkWithHandler(
  'customerProfile/confirmEmailChange',
  async (data: any, thunkAPI) => {
    return await customerProfileService.confirmEmailChange(data);
  }
);

export const requestDeleteAccount = createAsyncThunkWithHandler(
  'customerProfile/requestDeleteAccount',
  async (_, thunkAPI) => {
    return await customerProfileService.requestDeleteAccount();
  }
);

export const confirmDeleteAccount = createAsyncThunkWithHandler(
  'customerProfile/confirmDeleteAccount',
  async (data: any, thunkAPI) => {
    return await customerProfileService.confirmDeleteAccount(data);
  }
);

export const customerProfileSlice = createSlice({
  name: 'customerProfile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload.data?.user || null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.data?.user) {
          state.profile = action.payload.data.user;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(requestEmailChange.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestEmailChange.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(confirmEmailChange.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmEmailChange.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(confirmEmailChange.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(requestDeleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestDeleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(requestDeleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(confirmDeleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmDeleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(confirmDeleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetProfileState } = customerProfileSlice.actions;
export default customerProfileSlice.reducer;
