import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  registerCustomer,
  loginCustomer,
  setupCustomerProfile,
  googleMobileAuth,
  getMe,
  reset,
  logout
} from '../services/features/customerAuth/customerAuthSlice';

export const useCustomerAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.customerAuth
  );

  const handleRegister = useCallback((data: any) => {
    return dispatch(registerCustomer(data)).unwrap();
  }, [dispatch]);

  const handleLogin = useCallback((data: any) => {
    return dispatch(loginCustomer(data)).unwrap();
  }, [dispatch]);

  const handleProfileSetup = useCallback((data: any) => {
    return dispatch(setupCustomerProfile(data)).unwrap();
  }, [dispatch]);

  const handleGoogleAuth = useCallback((data: any) => {
    return dispatch(googleMobileAuth(data)).unwrap();
  }, [dispatch]);

  const fetchCurrentUser = useCallback(() => {
    return dispatch(getMe()).unwrap();
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const resetAuthState = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    isError,
    isSuccess,
    message,
    handleRegister,
    handleLogin,
    handleProfileSetup,
    handleGoogleAuth,
    fetchCurrentUser,
    handleLogout,
    resetAuthState,
  };
};
