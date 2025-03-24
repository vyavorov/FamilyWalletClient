import "./DeleteTransactionModal.css";
import { deleteTransaction } from "../services/transactionService";
import AuthContext from "../context/AuthContext";
import { useState, useEffect, useContext } from "react";

export default function DeleteTransactionModal({ onClose, transaction, onTransactionDelete }) {
  const { token } = useContext(AuthContext);
  const onDeleteHandler = async () => {
    try {
      const response = await deleteTransaction(transaction.id, token);
      if (response.success) {
        onClose();
        onTransactionDelete();
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Delete Transaction</h2>
          <p>Are you sure you want to delete this transaction?</p>
          <div className="modal-buttons">
            <button className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="button button-primary" onClick={onDeleteHandler}>Delete</button>
          </div>
        </div>
      </div>
      <div className="overlay"></div>
    </>
  );
}
