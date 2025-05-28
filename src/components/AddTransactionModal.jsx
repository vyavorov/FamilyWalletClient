import { useState, useEffect, useContext } from "react";
import "./AddTransactionModal.css";
import { createTransaction } from "../services/transactionService";
import { getCategories, addCategory } from "../services/categoryService";
import { getAccounts } from "../services/accountService";
import AuthContext from "../context/AuthContext";
import Select from "react-select";
import { jwtDecode } from "jwt-decode";

export default function AddTransactionModal({ onClose, onTransactionAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [type, setType] = useState("разход");
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const categoryOptionsWithAdd = [
    ...categoryOptions,
    { value: "__add_new__", label: "➕ Добави нова категория" },
  ];

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: `${a.name} — $${a.balance.toFixed(2)}`,
  }));

  const typeOptions = [
    { value: "приход", label: "Приход" },
    { value: "разход", label: "Разход" },
    { value: "трансфер", label: "Трансфер" },
  ];

  const TRANSACTION_TYPES = {
    приход: 0,
    разход: 1,
    трансфер: 2,
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

  async function handleAddCategory() {
    const decodedToken = jwtDecode(token);
    const newCat = {
      name: newCategoryName,
      userId: decodedToken.userId,
      familyGroupId: decodedToken.familyGroupId,
    };

    try {
      const createdCategory = await addCategory(newCat);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      setCategory(createdCategory.id);
      setShowCategoryModal(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Описание:
            <input
              className="transaction-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Сума:
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
              if (newType === "приход" || newType === "income") {
                const salaryCategory = categoryOptions.find(
                  (c) =>
                    c.label.toLowerCase() === "заплата" ||
                    c.label.toLowerCase() === "salary"
                );
                if (salaryCategory) {
                  setCategory(salaryCategory.value);
                }
              }
              if (newType === "трансфер" || newType === "transfer") {
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
            placeholder="Избери тип"
          />

          <label>
            Категория:
            <Select
              className="react-select"
              classNamePrefix="select"
              options={categoryOptionsWithAdd}
              value={categoryOptionsWithAdd.find((c) => c.value === category)}
              onChange={(selected) => {
                if (selected.value === "__add_new__") {
                  setShowCategoryModal(true);
                } else {
                  setCategory(selected.value);
                }
              }}
              placeholder="Select category"
            />
          </label>

          {type !== "transfer" && (
            <label>
              Сметка:
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
                От сметка:
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={accountOptions}
                  value={accountOptions.find((a) => a.value === fromAccount)}
                  onChange={(selected) => setFromAccount(selected.value)}
                  placeholder="Избери от сметка"
                />
              </label>

              <label>
                Към сметка:
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={accountOptions}
                  value={accountOptions.find((a) => a.value === toAccount)}
                  onChange={(selected) => setToAccount(selected.value)}
                  placeholder="Избери към сметка"
                />
              </label>
            </>
          )}

          {error && <p className="error-message">{error}</p>}
          <button type="submit">Запази</button>
          <button type="button" className="close-btn" onClick={onClose}>
            Откажи
          </button>
        </form>

        {showCategoryModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Добави нова категория</h3>
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button onClick={handleAddCategory}>Add</button>
              <button onClick={() => setShowCategoryModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
