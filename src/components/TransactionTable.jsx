import { useState } from "react";
import "./TransactionTable.css";
import EditTransactionModal from "./EditTransactionModal";

export default function TransactionTable({ transactions, onTransactionUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(null);

  const [transaction, setTransaction] = useState();

  const onEditClick = (transactionId) => {
    setIsModalOpen(true);
    const transaction = transactions.find((tx) => tx.id === transactionId);
    setTransaction(transaction);
  }

  return (
    <div className="transaction-table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.description}</td>
              <td
                className={
                  tx.amount >= 0 ? "amount-positive" : "amount-negative"
                }
              >
                {tx.amount}$
              </td>
              <td>{tx.type}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onEditClick(tx.id)}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <EditTransactionModal
          onClose={() => setIsModalOpen(false)}
          transaction={transaction}
          onTransactionUpdate={onTransactionUpdate}
        />
      )}
    </div>
  );
}
