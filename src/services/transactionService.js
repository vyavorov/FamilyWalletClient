// import axios from 'axios';
import API from "./api";
import { jwtDecode } from "jwt-decode";

// const API_URL = 'http://localhost:5095/api/Transaction';
// const API_URL = 'http://localhost:8080/api/Transaction';
// const API_URL = 'http://localhost:5013/api/Transaction';
const API_URL = 'http://213.91.236.205:5095/api/Transaction';

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
  transfer: 2, 
};

export async function createTransaction(transaction,token) {
  try {
    const decodedUser = jwtDecode(token);
    const userId = decodedUser["userId"];
    const response = await API.post(API_URL, {
      ...transaction,
      // type: TRANSACTION_TYPES[transaction.type],
      userId: userId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);

      // Ако има обект с грешки, събираме ги в един string
      let errorMessage = "Transaction failed.";
      if (error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(" "); // Конвертира всички грешки в един string
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      return { success: false, message: errorMessage };
    }

    return { success: false, message: "A network error occurred. Please try again." };
  }
}

export async function editTransaction(transactionId, newTransactionData,token) {
  try {
    const decodedUser = jwtDecode(token);
    const userId = decodedUser["userId"];
    // const response = await API.put(`${API_URL}/${transactionId}`, {
    //   transactionDto: newTransactionData, 
    //   userId
    // });

    const response = await API.put(`${API_URL}/${transactionId}`, {
      ...newTransactionData,
      userId: userId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });


    return response.data;
  } catch (error) {
    console.error("Error editing transaction:", error);
    throw error;
  }
}

export async function deleteTransaction(transactionId,token) {
  try {
    const decodedUser = jwtDecode(token);
    const userId = decodedUser["userId"];

    const response = await API.delete(`${API_URL}/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error editing transaction:", error);
    throw error;
  }
}