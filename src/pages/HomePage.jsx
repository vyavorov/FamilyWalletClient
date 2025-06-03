import "./HomePage.css";
import BalanceCard from "../components/BalanceCard";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import AddTransactionModal from "../components/AddTransactionModal";
import MonthlyBudgetCard from "../components/MonthlyBudgetCard";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  async function updateDashboardData() {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
      setRefreshKey(prev => prev + 1);

    } catch (err) {
      console.error("Error updating dashboard data:", err);
    }
  }
  
  useEffect(() => {
    updateDashboardData();
  }, []);

  return (
    <div>
      <h1 className="dashboard-title">Дашборд</h1>

      <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>+ Добави транзакция</button>

<div className="dashboard-cards">
  <BalanceCard title="Баланс (без спестявания)" amount={dashboardData.balanceWithoutSavingGoal} type="total" />
  <BalanceCard title="Приходи за месеца" amount={dashboardData.income} type="income" />
  <BalanceCard title="Разходи за месеца" amount={dashboardData.expense} type="expense" />
  {/* <BalanceCard title="🎯 Желана цел за спестяване" amount={dashboardData.savingGoal} type="neutral" />
  <BalanceCard title="💰 Спестено досега" amount={dashboardData.realSavings} type="neutral" /> */}
</div>


    <MonthlyBudgetCard refreshTrigger={refreshKey}/>
      {isModalOpen && <AddTransactionModal onTransactionAdded={updateDashboardData} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
