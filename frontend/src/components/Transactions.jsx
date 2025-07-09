import React, { useState, useCallback, memo, useContext } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import AddTransactionModal from "./AddTransactionModal";
import { TransactionDetailsModal, TransactionRow } from "./TransactionCard";
import { categories } from "../data/initialData";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify"; // Import toast for notifications

const Transactions = ({
  transactions,
  setTransactions,
  showAddTransaction,
  setShowAddTransaction,
}) => {
  const { token, backendUrl } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create axios instance with base config
  const api = axios.create({
    baseURL: `${backendUrl}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Memoize filtered and sorted transactions (newest first)
  const filteredTransactions = React.useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? [...transactions]
        : transactions.filter((t) => t.category === selectedCategory);

    return filtered.sort((a, b) => {
      // Combine date and time comparison in one step
      const timestampA = new Date(a.date).getTime();
      const timestampB = new Date(b.date).getTime();

      if (timestampB !== timestampA) {
        return timestampB - timestampA; // Newest first
      }

      // Tertiary: If same timestamp, compare creation time
      return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
    });
  }, [transactions, selectedCategory]);

  // Handle API errors
  const handleApiError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    setError(errorMessage);
    setIsLoading(false);
    setTimeout(() => setError(null), 5000);
  };

  // Delete transaction handler
  const handleDeleteTransaction = useCallback(
    async (id) => {
      if (!token) {
        setError("Authentication required");
        return;
      }

      setIsLoading(true);
      try {
        await api.delete(`/transactions/${id}`);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast.success("Transaction deleted successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete transaction"
        );
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, setTransactions, api]
  );

  // Edit transaction handler
  const handleEditTransaction = useCallback(
    (transaction) => {
      setEditingTransaction(transaction);
      setShowAddTransaction(true);
    },
    [setShowAddTransaction]
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowAddTransaction(false);
    setEditingTransaction(null);
  }, [setShowAddTransaction]);

  // Handle transaction submission
  const handleTransactionSubmit = useCallback(
    async (transactionData) => {
      if (!token) {
        setError("Authentication required");
        return;
      }

      setIsLoading(true);
      try {
        let response;
        if (editingTransaction) {
          response = await api.put(
            `/transactions/${editingTransaction._id}`,
            transactionData
          );
          toast.success("Transaction updated successfully");
        } else {
          response = await api.post("/transactions", transactionData);
          toast.success("Transaction added successfully");
        }

        setTransactions((prev) => {
          if (editingTransaction) {
            return prev.map((t) =>
              t.id === editingTransaction.id ? response.data : t
            );
          } else {
            // New transactions will automatically appear first due to the sort
            return [...prev, response.data];
          }
        });

        handleModalClose();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to save transaction"
        );
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [editingTransaction, token, setTransactions, handleModalClose, api]
  );

  // View transaction handler
  const handleViewTransaction = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  }, []);

  // Close details handler
  const handleCloseDetails = useCallback(() => {
    setShowTransactionDetails(false);
  }, []);

  return (
    <div className="px-4 sm:px-0">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg mx-4 max-w-sm w-full text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 mx-4 sm:mx-0 text-sm">
          {error}
        </div>
      )}

      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          All Transactions
        </h2>

        {/* Mobile-friendly controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowAddTransaction(true);
            }}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onView={handleViewTransaction}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-8 text-sm"
                  >
                    No transactions found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
            >
              {/* Transaction Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description || transaction.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {transaction.category}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-3">
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {transaction.tags && transaction.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {transaction.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleViewTransaction(transaction)}
                  className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditTransaction(transaction)}
                  className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500 text-sm">
              No transactions found for this category.
            </p>
          </div>
        )}
      </div>

      {showAddTransaction && (
        <AddTransactionModal
          transactions={transactions}
          onSubmit={handleTransactionSubmit}
          onClose={handleModalClose}
          editingTransaction={editingTransaction}
          isLoading={isLoading}
        />
      )}

      {showTransactionDetails && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default memo(Transactions);
