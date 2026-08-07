import apiHandler from "../../api/apiHandler";

export const getProfile = async () => {
  const response = await apiHandler.get("/providers/profile/me");
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await apiHandler.put("/providers/profile/update", data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await apiHandler.put("/providers/profile/change-password", data);
  return response.data;
};

export const requestEmailChange = async (data: any) => {
  const response = await apiHandler.post("/providers/profile/request-email-change", data);
  return response.data;
};

export const confirmEmailChange = async (data: any) => {
  const response = await apiHandler.put("/providers/profile/confirm-email-change", data);
  return response.data;
};

export const requestDeleteAccount = async () => {
  const response = await apiHandler.post("/providers/profile/request-delete-account");
  return response.data;
};

export const confirmDeleteAccount = async (data: any) => {
  const response = await apiHandler.delete("/providers/profile/confirm-delete-account", { data });
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
  requestDeleteAccount,
  confirmDeleteAccount,
};

export default profileService;
