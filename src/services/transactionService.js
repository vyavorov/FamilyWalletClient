// import axios from 'axios';
import API from "./api";
import { jwtDecode } from "jwt-decode";

const API_URL = 'https://localhost:7271/api/Transaction';

export async function getTransactions() {
  try {
    const response = await API.get(API_URL + '/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

const TRANSACTION_TYPES = {
  income: 0,  
  expense: 1, 
};

export async function createTransaction(transaction,token) {
  try {
    const decodedUser = jwtDecode(token);
    const userId = decodedUser["userId"];
    const response = await API.post(API_URL, {
      ...transaction,
      type: TRANSACTION_TYPES[transaction.type],
      userId: userId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}
