import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
  requestDeleteAccount,
  confirmDeleteAccount,
  resetProfileState
} from '../services/features/customerProfile/customerProfileSlice';

export const useCustomerProfile = () => {
  const dispatch = useAppDispatch();
  const { profile, isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.customerProfile
  );

  const fetchProfile = useCallback(() => {
    return dispatch(getProfile()).unwrap();
  }, [dispatch]);

  const handleUpdateProfile = useCallback((data: any) => {
    return dispatch(updateProfile(data)).unwrap();
  }, [dispatch]);

  const handleChangePassword = useCallback((data: any) => {
    return dispatch(changePassword(data)).unwrap();
  }, [dispatch]);

  const handleRequestEmailChange = useCallback((data: any) => {
    return dispatch(requestEmailChange(data)).unwrap();
  }, [dispatch]);

  const handleConfirmEmailChange = useCallback((data: any) => {
    return dispatch(confirmEmailChange(data)).unwrap();
  }, [dispatch]);

  const handleRequestDeleteAccount = useCallback(() => {
    return dispatch(requestDeleteAccount()).unwrap();
  }, [dispatch]);

  const handleConfirmDeleteAccount = useCallback((data: any) => {
    return dispatch(confirmDeleteAccount(data)).unwrap();
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetProfileState());
  }, [dispatch]);

  return {
    profile,
    isLoading,
    isError,
    isSuccess,
    message,
    fetchProfile,
    handleUpdateProfile,
    handleChangePassword,
    handleRequestEmailChange,
    handleConfirmEmailChange,
    handleRequestDeleteAccount,
    handleConfirmDeleteAccount,
    resetState,
  };
};
