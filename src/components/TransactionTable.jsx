import { useState } from "react";
import "./TransactionTable.css";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

export default function TransactionTable({ transactions, onTransactionUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const typeClassMap = {
    0: "amount-positive",   // Income
    1: "amount-negative",   // Expense
    2: "amount-transfer",   // Transfer
  };

  const typeMap = {
    0: "Income",   // Income
    1: "Expense",   // Expense
    2: "Transfer",   // Transfer
  };

  const [transaction, setTransaction] = useState();

  const onEditClick = (transactionId) => {
    setIsEditModalOpen(true);
    const transaction = transactions.find((tx) => tx.id === transactionId);
    setTransaction(transaction);
  }

  const onDeleteClick = (transactionId) => {
    setIsDeleteModalOpen(true);
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
                className={typeClassMap[tx.type]}
              >
                {tx.amount}$
              </td>
              <td>{typeMap[tx.type]}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onEditClick(tx.id)}>Edit</button>
                <button onClick={() => onDeleteClick(tx.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && (
        <EditTransactionModal
          onClose={() => setIsEditModalOpen(false)}
          transaction={transaction}
          onTransactionUpdate={onTransactionUpdate}
        />
      )}

{isDeleteModalOpen && (
        <DeleteTransactionModal
          onClose={() => setIsDeleteModalOpen(false)}
          transaction={transaction}
          onTransactionDelete={onTransactionUpdate}
        />
      )}
    </div>
  );
}
