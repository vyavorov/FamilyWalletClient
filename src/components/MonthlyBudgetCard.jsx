import { useEffect, useState } from "react";
import {
  getCurrentBudgetSettings,
  setOrUpdateBudgetSettings,
} from "../services/monthlyBudgetService";
import moment from "moment";
import API from "../services/api";

export default function MonthlyBudgetCard() {
  const [budget, setBudget] = useState(null);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [formData, setFormData] = useState({
    expectedIncome: "",
    fixedExpenses: "",
    savingGoal: "",
    year: currentYear,
    month: currentMonth,
  });
  const [spendToday, setSpendToday] = useState(0);
  const [spendSoFar, setSpendSoFar] = useState(0);


  useEffect(() => {
    loadBudget();
  }, []);

  async function fetchSpendSoFar() {
  try {
    const response = await API.get("/Transaction/spent-so-far");
    setSpendSoFar(response.data.total || 0);
  } catch (error) {
    console.error("Error fetching total monthly spending:", error);
  }
}

  async function loadBudget() {
    try {
      const data = await getCurrentBudgetSettings();
      if (data) {
        setBudget(data);
        setFormData({
          expectedIncome: data.expectedIncome,
          fixedExpenses: data.fixedExpenses,
          savingGoal: data.savingGoal,
          year: currentYear,
          month: currentMonth,
        });
        await fetchSpendToday();
        await fetchSpendSoFar();
      }
    } catch (error) {
      console.error("Error loading budget settings:", error);
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

  const today = moment();
  const daysInMonth = today.daysInMonth();
  const daysLeft = daysInMonth - today.date() + 1;

  const spendable =
    (budget?.expectedIncome || 0) -
    (budget?.fixedExpenses || 0) -
    (budget?.savingGoal || 0);
  const remaining = spendable - spendSoFar;
  const dailyBudget = remaining / daysLeft;

  return (
    <div className="card mt-4 p-4 border rounded shadow-sm">
      {!budget ? (
        <form onSubmit={handleSubmit}>
          <h4 className="mb-3">Въведи месечен бюджет</h4>
          <div className="form-group">
            <label>Очакван приход</label>
            <input
              type="number"
              className="form-control"
              value={formData.expectedIncome}
              onChange={(e) =>
                setFormData({ ...formData, expectedIncome: +e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Сметки (фиксирани разходи)</label>
            <input
              type="number"
              className="form-control"
              value={formData.fixedExpenses}
              onChange={(e) =>
                setFormData({ ...formData, fixedExpenses: +e.target.value })
              }
              required
            />
          </div>
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
          <p>
            🎯 Дневен бюджет: <strong>{dailyBudget.toFixed(2)} лв</strong>
          </p>
          <p>
            📉 Оставащи средства за месеца:{" "}
            <strong>{remaining.toFixed(2)} лв</strong>
          </p>
          <p>📆 Оставащи дни: {daysLeft}</p>
        </div>
      )}
    </div>
  );
}
