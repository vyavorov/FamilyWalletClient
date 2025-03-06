import "./BalanceCard.css";

export default function BalanceCard({ title, amount, type }) {
  return (
    <div className="balance-card">
      <h2>{title}</h2>
      <p className={`balance-amount ${type}`}>{amount}</p>
    </div>
  );
}
