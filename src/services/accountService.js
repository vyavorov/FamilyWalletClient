// import axios from "axios";
import API from "./api";

const API_URL = "https://localhost:7271/api/Account";

export async function getAccounts() {
  try {
    const response = await API.get(API_URL + "/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}
