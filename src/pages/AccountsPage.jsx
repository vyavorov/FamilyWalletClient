import { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import AccountCard from "../components/AccountCard";
import "./AccountsPage.css";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAccounts();
        if (data.length === 0) {
          setError("No accounts found.");
        }
        setAccounts(data);
      } catch (err) {
        setError("Failed to load accounts.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="accounts-title">Accounts</h1>

      <div className="accounts-grid">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            name={account.name}
            balance={account.balance}
            type={account.type}
          />
        ))}
      </div>
    </div>
  );
}
