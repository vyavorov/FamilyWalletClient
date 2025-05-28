import { useState } from "react";
import "./TransactionTable.css";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

export default function TransactionTable({ transactions, onTransactionUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const typeClassMap = {
    0: "amount-positive",
    1: "amount-negative",
    2: "amount-transfer",
  };

  const typeMap = {
    0: "Приход",
    1: "Разход",
    2: "Трансфер",
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
            <th>Описание</th>
            <th>Сума</th>
            <th>Тип</th>
            <th>Дата</th>
            <th>Действия</th>
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
                <button onClick={() => onEditClick(tx.id)}>Редактирай</button>
                <button onClick={() => onDeleteClick(tx.id)}>Изтрий</button>
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
