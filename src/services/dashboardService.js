// import axios from "axios";
import API from "./api";

const API_URL = "https://localhost:7271/api/Dashboard";

export async function getDashboardData() {
    try {
        const response = await API.get(API_URL);
        return response.data;
    } catch (err) {
        console.error("Dashboard data fetch failed:", err.message);
        throw err;
    }
}
