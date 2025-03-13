import { useState, useEffect } from "react";
import "./AddTransactionModal.css";
import { createTransaction } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import { getAccounts } from "../services/accountService";

export default function AddTransactionModal({ onClose }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [type, setType] = useState("expense"); // income/expense
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

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

    const transactionData = {
      description,
      amount: parseFloat(amount),
      type,
      categoryId: category,
      accountId: account,
    };

    try {
      await createTransaction(transactionData);
      onClose(); // Затваряме модала
      window.location.reload(); // Рефрешваме данните (можем да го заменим с по-добро решение по-късно)
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Transaction</h2>
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
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
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

          <button type="submit">Save</button>
          <button type="button" className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
