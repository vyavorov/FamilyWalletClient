// import axios from "axios";
import API from "./api";

// const API_URL = "http://localhost:8080/api/Category";
// const API_URL = "http://localhost:5095/api/Category";
const API_URL = "http://213.91.236.205:5095/api/Category";

export async function getCategories() {
  try {
    const response = await API.get(API_URL + "/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function addCategory(category) {
  try {
    const response = await API.post("http://localhost:8080/api/Category", category);
    return response.data.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}
export async function deleteCategory(categoryId) {
  try {
    await API.delete(`${API_URL}/${categoryId}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
export async function updateCategory(categoryId, updatedCategory) {
  try {
    const response = await API.put(`${API_URL}/${categoryId}`, updatedCategory);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}
export async function getCategoryById(categoryId) {
  try {
    const response = await API.get(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
}
export async function getCategoryByName(categoryName) {
  try {
    const response = await API.get(`${API_URL}/name/${categoryName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by name:", error);
    throw error;
  }
}

