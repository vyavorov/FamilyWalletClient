import API from "./api";

// const API_URL = "http://localhost:5095/api/Dashboard";
// const API_URL = "http://localhost:8080/api/MonthlyBudget";
// const API_URL = "http://localhost:5013/api/MonthlyBudget";
const API_URL = "http://213.91.236.205:5095/api/MonthlyBudget";

export async function getCurrentBudgetSettings() {
  try {
    const response = await API.get(`${API_URL}/current`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current budget settings:", error);
    throw error;
  }
}

export async function setOrUpdateBudgetSettings(data) {
  try {
    await API.post(`${API_URL}/set-or-update`, data);
  } catch (error) {
    console.error("Error saving budget settings:", error);
    throw error;
  }
}

export async function getBudgetOverview() {
  try {
    const response = await API.get(`${API_URL}/overview`);
    return response.data;
  } catch (error) {
    console.error("Error fetching budget overview:", error);
    throw error;
  }
}