import { useState, useEffect, useContext } from "react";
import "./AddTransactionModal.css";
import { createAccount } from "../services/accountService";
import AuthContext from "../context/AuthContext";

export default function AddAccountModal({ onClose, onAccountAdded }) {
  const [title, setTitle] = useState("");
  const [balance, setBalance] = useState(0);
  const { token } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    const accountData = {
      name: title,
      balance: parseFloat(balance),
    };
    

    try {
      await createAccount(accountData,token);
      onAccountAdded();
      onClose();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Account</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              className="account-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Balance:
            <input
              className="account-balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
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
