import { useState, useEffect, useContext } from "react";
import "./AddTransactionModal.css";
import { editTransaction } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import { getAccounts } from "../services/accountService";
import AuthContext from "../context/AuthContext";
import Select from "react-select";

export default function EditTransactionModal({ onClose, transaction, onTransactionUpdate }) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.categoryId);
  const [account, setAccount] = useState(transaction.accountId);
  const [fromAccount, setFromAccount] = useState(transaction.fromAccountId);
  const [toAccount, setToAccount] = useState(transaction.toAccountId);
  const [type, setType] = useState(transaction.type);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");

  const typeOptions = [
    { value: 0, label: "Income" },
    { value: 1, label: "Expense" },
    { value: 2, label: "Transfer" },
  ];

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

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: `${a.name} — $${a.balance.toFixed(2)}`,
  }));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!description || !amount || (type !== 2 && !account) || (type === 2 && (!fromAccount || !toAccount))) {
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
      date: new Date().toISOString(),
      fromAccountId: fromAccount || null,
      toAccountId: toAccount || null,
    };

    try {
      const response = await editTransaction(transaction.id, transactionData, token);
      if (response.success) {
        onClose();
        setError("");
        onTransactionUpdate();
      } else {
        setError(response.message);
        console.log(response.message);
      }
    } catch (error) {
      console.error("Error editing transaction:", error);
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
            <Select
              className="react-select"
              classNamePrefix="select"
              options={typeOptions}
              value={typeOptions.find((t) => t.value === type)}
              onChange={(selected) => setType(selected.value)}
              placeholder="Select type"
            />
          </label>

          <label>
            Category:
            <Select
              className="react-select"
              classNamePrefix="select"
              options={categoryOptions}
              value={categoryOptions.find((c) => c.value === category)}
              onChange={(selected) => setCategory(selected.value)}
              placeholder="Select category"
            />
          </label>

          {type !== 2 && (
            <label>
              Account:
              <Select
                className="react-select"
                classNamePrefix="select"
                options={accountOptions}
                value={accountOptions.find((a) => a.value === account)}
                onChange={(selected) => setAccount(selected.value)}
                placeholder="Select account"
              />
            </label>
          )}

          {type === 2 && (
            <>
              <label>
                From account:
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={accountOptions}
                  value={accountOptions.find((a) => a.value === fromAccount)}
                  onChange={(selected) => setFromAccount(selected.value)}
                  placeholder="Select account"
                />
              </label>
              <label>
                To account:
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={accountOptions}
                  value={accountOptions.find((a) => a.value === toAccount)}
                  onChange={(selected) => setToAccount(selected.value)}
                  placeholder="Select account"
                />
              </label>
            </>
          )}

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
