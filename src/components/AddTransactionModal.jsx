import { useState, useEffect, useContext } from "react";
import "./AddTransactionModal.css";
import { createTransaction } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import { getAccounts } from "../services/accountService";
import AuthContext from "../context/AuthContext";
import Select from "react-select";

export default function AddTransactionModal({ onClose, onTransactionAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [type, setType] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");

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

  const fromAccountOptions = accountOptions;
  const toAccountOptions = accountOptions;

  const typeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
    { value: "transfer", label: "Transfer" },
  ];

  const TRANSACTION_TYPES = {
    income: 0,
    expense: 1,
    transfer: 2,
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !description ||
      !amount ||
      !category ||
      (!account && !fromAccount && !toAccount)
    ) {
      setError("All fields are required.");
      return;
    }

    const transactionData = {
      description,
      amount: parseFloat(amount),
      type: TRANSACTION_TYPES[type],
      categoryId: category || null,
      accountId: account || null,
      date: new Date().toISOString(),
      fromAccountId: fromAccount || null,
      toAccountId: toAccount || null,
    };

    try {
      const response = await createTransaction(transactionData, token);
      if (response.success) {
        onTransactionAdded();
        onClose();
        setError("");
      } else {
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
          <Select
            className="react-select"
            classNamePrefix="select"
            options={typeOptions}
            value={typeOptions.find((t) => t.value === type)}
            onChange={(selected) => {
              const newType = selected.value;
              setType(newType);
              if (newType === "income") {
                const salaryCategory = categoryOptions.find(
                  (c) =>
                    c.label.toLowerCase() === "заплата" ||
                    c.label.toLowerCase() === "salary"
                );
                if (salaryCategory) {
                  setCategory(salaryCategory.value);
                }
              }

              if (newType === "transfer") {
                const transferCategory = categoryOptions.find(
                  (c) =>
                    c.label.toLowerCase() === "трансфер" ||
                    c.label.toLowerCase() === "transfer"
                );
                if (transferCategory) {
                  setCategory(transferCategory.value);
                }
              }
            }}
            placeholder="Select type"
          />

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

          {type !== "transfer" && (
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

          {type === "transfer" && (
            <>
              <label>
                From account:
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={fromAccountOptions}
                  value={fromAccountOptions.find(
                    (a) => a.value === fromAccount
                  )}
                  onChange={(selected) => setFromAccount(selected.value)}
                  placeholder="Select account"
                />
              </label>

              <label>
                To account:
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={toAccountOptions}
                  value={toAccountOptions.find((a) => a.value === toAccount)}
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
