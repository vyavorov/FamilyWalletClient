import { useEffect, useState } from "react";
import {
  getCurrentBudgetSettings,
  setOrUpdateBudgetSettings,
  getBudgetOverview,
} from "../services/monthlyBudgetService";
import moment from "moment";
import API from "../services/api";

export default function MonthlyBudgetCard({ refreshTrigger }) {
  const [budget, setBudget] = useState(null);
  const [overview, setOverview] = useState(null);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [formData, setFormData] = useState({
    savingGoal: "",
    year: currentYear,
    month: currentMonth,
  });
  const [spendToday, setSpendToday] = useState(0);

  useEffect(() => {
    loadBudget();
  }, [refreshTrigger]);

  async function loadBudget() {
    try {
      const data = await getCurrentBudgetSettings();
      if (data) {
        setBudget(data);
        setFormData({
          savingGoal: data.savingGoal,
          year: currentYear,
          month: currentMonth,
        });
      }

      const overviewData = await getBudgetOverview();
      setOverview(overviewData);

      await fetchSpendToday();
    } catch (error) {
      console.error("Error loading budget settings or overview:", error);
    }
  }

  async function fetchSpendToday() {
    try {
      const today = moment().format("YYYY-MM-DD");
      const response = await API.get(`/Transaction/daily?date=${today}`);
      setSpendToday(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching daily spending:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await setOrUpdateBudgetSettings(formData);
      await loadBudget();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div className="card mt-4 p-4 border rounded shadow-sm">
      {!budget ? (
        <form onSubmit={handleSubmit}>
          <h4 className="mb-3">Задай цел за спестяване</h4>
          <div className="form-group">
            <label>Цел за спестяване</label>
            <input
              type="number"
              className="form-control"
              value={formData.savingGoal}
              onChange={(e) =>
                setFormData({ ...formData, savingGoal: +e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Запази
          </button>
        </form>
      ) : (
        <div>
          <h5>📅 Месечен бюджет</h5>
          <p>
            💸 Изхарчено днес: <strong>{spendToday.toFixed(2)} лв</strong>
          </p>
          {overview && (
            <>
              <p>
                🎯 Дневен бюджет:{" "}
                <strong>{overview.dailyBudget.toFixed(2)} лв</strong>
              </p>
              <p>
                📉 Оставащи средства за месеца:{" "}
                <strong>{overview.remainingAmount.toFixed(2)} лв</strong>
              </p>
              <p>📆 Оставащи дни: {overview.daysLeft}</p>
              <p>
                💸 Спестено за месеца:{" "}
                <strong>{overview.savingGoal.toFixed(2)} лв</strong>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
