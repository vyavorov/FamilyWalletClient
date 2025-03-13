import "./HomePage.css";
import BalanceCard from "../components/BalanceCard";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import AddTransactionModal from "../components/AddTransactionModal";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="dashboard-title">Dashboard</h1>

      <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>+ Add Transaction</button>

      <div className="dashboard-cards">
        <BalanceCard title="Total Balance" amount={dashboardData.totalBalance} type="total" />
        <BalanceCard title="Income" amount={dashboardData.income} type="income" />
        <BalanceCard title="Expenses" amount={dashboardData.expense} type="expense" />
      </div>

      {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
