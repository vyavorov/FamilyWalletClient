import "./HomePage.css";
import BalanceCard from "../components/BalanceCard";

export default function HomePage() {
  return (
    <div>
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-cards">
        <BalanceCard title="Total Balance" amount="$5,200" type="total" />
        <BalanceCard title="Income" amount="$3,000" type="income" />
        <BalanceCard title="Expenses" amount="$1,800" type="expense" />
      </div>
    </div>
  );
}
