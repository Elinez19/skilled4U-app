import apiHandler from "../../api/apiHandler";

export const registerCustomer = async (data: any) => {
  const response = await apiHandler.post("/auth/register/customer", data);
  return response.data;
};

export const loginCustomer = async (data: any) => {
  const response = await apiHandler.post("/auth/login", data);
  return response.data;
};

export const setupCustomerProfile = async (data: any) => {
  const response = await apiHandler.put("/auth/profile/customer", data);
  return response.data;
};

export const googleMobileAuth = async (data: any) => {
  const response = await apiHandler.post("/auth/google/mobile", data);
  return response.data;
};

export const getMe = async () => {
  const response = await apiHandler.get("/auth/me");
  return response.data;
};

const customerAuthService = {
  registerCustomer,
  loginCustomer,
  setupCustomerProfile,
  googleMobileAuth,
  getMe,
};

export default customerAuthService;
