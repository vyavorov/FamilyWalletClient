import axios from "axios";
import { logout } from "./authService";

const API = axios.create({
  baseURL: "https://localhost:7271/api",
});

const getTokenExpiration = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = JSON.parse(atob(base64));

    return jsonPayload.exp ? jsonPayload.exp * 1000 : null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    const expirationTime = getTokenExpiration(token);
    const currentTime = Date.now();

    if (expirationTime && expirationTime < currentTime) {
      console.warn("Token expired, logging out...");
      logout(); // Разлогваме потребителя
      return Promise.reject("Token expired");
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      logout();
    }
    return Promise.reject(error);
  }
);

export default API;
