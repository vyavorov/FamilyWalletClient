import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getTransactions();
      if (data.length === 0) {
        setError("No transactions found.");
      }
      else {
        setTransactions(data);
      }
    } catch (err) {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Transactions</h1>
      <TransactionTable transactions={transactions} onTransactionUpdate={fetchData}/>
    </div>
  );
}
