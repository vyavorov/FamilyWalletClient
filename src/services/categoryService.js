// import axios from "axios";
import API from "./api";

const API_URL = "http://localhost:8080/api/Category";
// const API_URL = "http://localhost:5095/api/Category";
// const API_URL = "http://213.91.236.205:5095/api/Category";

export async function getCategories() {
  try {
    const response = await API.get(API_URL + "/expenses/ordered");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
