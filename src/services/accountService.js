// import axios from "axios";
import API from "./api";
import { jwtDecode } from "jwt-decode";

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


export async function createAccount(account,token) {
  try {
    const decodedUser = jwtDecode(token);
    const userId = decodedUser["userId"];
    const response = await API.post(API_URL, {
      ...account,
      ownerId: userId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}