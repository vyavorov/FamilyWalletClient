import axios from 'axios';

const API_URL = 'https://localhost:7271/api/Transaction';

export async function getTransactions() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

const TRANSACTION_TYPES = {
  income: 0,  // Ако enum в C# е дефиниран с 0 за income
  expense: 1, // Ако 1 е за expense
};

export async function createTransaction(transaction) {
  try {
    const userId = await axios.get(API_URL,)
    const response = await axios.post(API_URL, {
      ...transaction,
      type: TRANSACTION_TYPES[transaction.type],
      userId: 1, //TODO: implement user authentication
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
