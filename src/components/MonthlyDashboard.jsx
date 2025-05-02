import React, { useEffect, useState } from "react";
import "./MonthlyDashboard.css";
import { getMonthlyDashboard } from "../services/dashboardService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyDashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [data, setData] = useState({
    income: 0,
    expenses: 0,
    byCategory: {},
    transactions: [],
  });
  const [error, setError] = useState(null);
  const chartData = Object.entries(data.byCategory).map(([key, value]) => ({
    name: key,
    value,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a0522d"];

  console.log("byCategory:", data.byCategory);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getMonthlyDashboard(year, month);
        setData({
          income: result.income,
          expenses: result.expenses,
          byCategory: result.byCategory,
          transactions: result.transactions,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDashboardData();
  }, [year, month]);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const saved = data.income - data.expenses;

  return (
    <div className="monthly-dashboard-container">
      <h1 className="monthly-dashboard-title">Месечен финансов отчет</h1>
      <div className="monthly-dashboard-controls">
        <label>
          Месец:
          <select value={month} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Година:
          <select value={year} onChange={handleYearChange}>
            {Array.from({ length: 5 }, (_, i) => {
              const y = currentDate.getFullYear() - 2 + i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      {error ? (
        <p className="monthly-dashboard-error">Грешка: {error}</p>
      ) : (
        <div className="monthly-dashboard-summary">
          <p>Приходи: {data.income.toFixed(2)} лв.</p>
          <p>Разходи: {data.expenses.toFixed(2)} лв.</p>
          <p>Спестено: {saved.toFixed(2)} лв.</p>
        </div>
      )}

<h3>Разходи по категории:</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <h3>Транзакции:</h3>
      <table className="monthly-dashboard-table">
        <thead>
          <tr>
            <th>Описание</th>
            <th>Сума</th>
            <th>Тип</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.amount.toFixed(2)} лв.</td>
              <td>{t.type === "Income" ? "Приход" : "Разход"}</td>
              <td>{new Date(t.date).toLocaleDateString("bg-BG")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyDashboard;
