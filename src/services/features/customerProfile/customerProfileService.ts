import apiHandler from "../../api/apiHandler";

export const getProfile = async () => {
  const response = await apiHandler.get("/customer/profile/me");
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await apiHandler.put("/customer/profile/update", data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await apiHandler.put("/customer/profile/change-password", data);
  return response.data;
};

export const requestEmailChange = async (data: any) => {
  const response = await apiHandler.post("/customer/profile/request-email-change", data);
  return response.data;
};

export const confirmEmailChange = async (data: any) => {
  const response = await apiHandler.put("/customer/profile/confirm-email-change", data);
  return response.data;
};

export const requestDeleteAccount = async () => {
  const response = await apiHandler.post("/customer/profile/request-delete-account");
  return response.data;
};

export const confirmDeleteAccount = async (data: any) => {
  const response = await apiHandler.delete("/customer/profile/confirm-delete-account", { data });
  return response.data;
};

const customerProfileService = {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
  requestDeleteAccount,
  confirmDeleteAccount,
};

export default customerProfileService;
