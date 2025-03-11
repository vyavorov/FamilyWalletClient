import axios from "axios";

const API_URL = "https://localhost:7271/api/Account";

export async function getAccounts() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}
