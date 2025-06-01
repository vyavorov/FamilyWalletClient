// import axios from "axios";
import API from "./api";

// const API_URL = "http://localhost:8080/api/Dashboard";
// const API_URL = "http://localhost:5095/api/Dashboard";
const API_URL = "http://213.91.236.205:5095/api/Dashboard";

export async function getDashboardData() {
  try {
    const response = await API.get(API_URL + "/summary");
    return response.data;
  } catch (err) {
    console.error("Dashboard data fetch failed:", err.message);
    throw err;
  }
}

export async function getMonthlyDashboard(year, month) {
  try {
    const response = await API.get(`/Dashboard/monthly`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Грешка при извличане на месечните данни:", error.message);
    throw error;
  }
}
