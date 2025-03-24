import { useState, useEffect, useContext } from "react";
import "./AddTransactionModal.css";
import { editTransaction } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import { getAccounts } from "../services/accountService";
import AuthContext from "../context/AuthContext";

export default function EditTransactionModal({ onClose, transaction, onTransactionUpdate}) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.categoryId);
  const [account, setAccount] = useState(transaction.accountId);
  const [type, setType] = useState(transaction.type);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { token } = useContext(AuthContext);
  const [error, setError] = useState('');
  const typeMap = {
    0: "income",   // Income
    1: "expense",   // Expense
    2: "transfer",   // Transfer
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        const accountsData = await getAccounts();
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!description || !amount || !category || !account) {
      setError("All fields are required.");
      return;
    }
    
    const transactionData = {
      id: transaction.id,
      description,
      amount: parseFloat(amount),
      type,
      categoryId: category || null,
      accountId: account || null,
      date: new Date().toISOString()
    };
    

    try {
      const response = await editTransaction(transaction.id,transactionData,token);
      if (response.success) {
        // onTransactionAdded();
        onClose();
        setError('');
        onTransactionUpdate();
      }
      else {
        setError(response.message);
        console.log(response.message);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);

    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Transaction</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Description:
            <input
              className="transaction-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Amount:
            <input
              className="transaction-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Type:
            <select value={typeMap[transaction.type]} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </label>

          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Account:
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Save</button>
          <button type="button" className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
