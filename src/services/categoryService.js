import axios from "axios";

const API_URL = "https://localhost:7271/api/Category"; // Замени с твоя API URL

export async function getCategories() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
