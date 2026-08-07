import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

const apiHandler = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
apiHandler.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiHandler.interceptors.response.use(
  (response) => response,
  async (error) => {
    // You can handle global errors here like token refresh, logout on 401, etc.
    return Promise.reject(error);
  }
);

export default apiHandler;
