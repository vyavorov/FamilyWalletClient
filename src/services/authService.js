// import axios from "axios";
import API from "./api";
import { jwtDecode } from "jwt-decode";

// const API_URL = "https://localhost:7271/api/User";
const API_URL = "http://213.91.236.205:5095/User";

export async function login(email, password) {
    try {
      const response = await API.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      const decodedUser = jwtDecode(token);
      return { user: decodedUser, token };
    } catch (error) {
      throw new Error("Invalid email or password.");
    }
  }

export async function register(name, email, password) {
  try {
    const response = await API.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Пренасочване към login страницата
};