import { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import AccountCard from "../components/AccountCard";
import "./AccountsPage.css";
import AddAccountModal from "../components/AddAccountModal";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    updateAccountData();
  }, []);

  async function updateAccountData() {
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

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h1 className="accounts-title">Accounts</h1>

      <button className="add-account-btn" onClick={() => setIsModalOpen(true)}>
        + Add Account
      </button>
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
      {isModalOpen && (
        <AddAccountModal
          onAccountAdded={updateAccountData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
