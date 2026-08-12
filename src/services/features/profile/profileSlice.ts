import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunkWithHandler } from '../../../utils/asyncThunkWrapper';
import profileService from './profileService';

const initialState = {
  profile: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getProfile = createAsyncThunkWithHandler(
  'profile/getProfile',
  async (_) => {
    return await profileService.getProfile();
  }
);

export const updateProfile = createAsyncThunkWithHandler(
  'profile/updateProfile',
  async (data: any) => {
    return await profileService.updateProfile(data);
  }
);

export const changePassword = createAsyncThunkWithHandler(
  'profile/changePassword',
  async (data: any) => {
    return await profileService.changePassword(data);
  }
);

export const requestEmailChange = createAsyncThunkWithHandler(
  'profile/requestEmailChange',
  async (data: any) => {
    return await profileService.requestEmailChange(data);
  }
);

export const confirmEmailChange = createAsyncThunkWithHandler(
  'profile/confirmEmailChange',
  async (data: any) => {
    return await profileService.confirmEmailChange(data);
  }
);

export const requestDeleteAccount = createAsyncThunkWithHandler(
  'profile/requestDeleteAccount',
  async () => {
    return await profileService.requestDeleteAccount();
  }
);

export const confirmDeleteAccount = createAsyncThunkWithHandler(
  'profile/confirmDeleteAccount',
  async (data: any) => {
    return await profileService.confirmDeleteAccount(data);
  }
);

export const profileSlice = createSlice({
  name: 'profile',
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
        state.profile = action.payload.data.user;
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
        // Optionally update profile state with updated user data
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

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
