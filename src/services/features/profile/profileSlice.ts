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
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
