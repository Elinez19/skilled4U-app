import apiHandler from "@/services/api/apiHandler";

export const providerLogin = async (data: any) => {
  const response = await apiHandler.post("/providers/auth/login", data);
  return response.data;
};

export const providerRegister = async (data: any) => {
  const response = await apiHandler.post("/providers/auth/register", data);
  return response.data;
};

export const verifyProvider = async (data: any) => {
  const response = await apiHandler.post("/providers/auth/verify-provider", data);
  return response.data;
};

export const setupProfile = async (data: any) => {
  const response = await apiHandler.put("/providers/auth/profile-setup", data);
  return response.data;
};

export const resendVerification = async (data: any) => {
  const response = await apiHandler.post("/providers/auth/resend-verification", data);
  return response.data;
};

export const getAccessToken = async () => {
  const response = await apiHandler.post("/providers/auth/get-access-token");
  return response.data;
};

export const forgotPassword = async (data: any) => {
  const response = await apiHandler.post("/providers/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await apiHandler.put("/providers/auth/reset-password", data);
  return response.data;
};

export const logout = async () => {
  const response = await apiHandler.post("/providers/auth/logout");
  return response.data;
};

const authService = {
  providerLogin,
  providerRegister,
  verifyProvider,
  setupProfile,
  resendVerification,
  getAccessToken,
  forgotPassword,
  resetPassword,
  logout
};

export default authService;
