import axios from "axios";

const API_URL = "https://localhost:7271/api/Dashboard";

export async function getDashboardData() {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (err) {
        console.error("Dashboard data fetch failed:", err.message);
        throw err;
    }
}
