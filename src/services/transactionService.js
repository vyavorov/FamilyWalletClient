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