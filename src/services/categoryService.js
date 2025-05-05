// import axios from "axios";
import API from "./api";

const API_URL = "https://localhost:7271/api/Category";

export async function getCategories() {
  try {
    const response = await API.get(API_URL + "/expenses/ordered");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
