import "./AccountCard.css";

export default function AccountCard({ name, balance, type }) {
  return (
    <div className="account-card">
      <h2>{name}</h2>
      <p className="account-balance">${balance}</p>
      <p className="account-type">{type}</p>
    </div>
  );
}
