// import React, { useMemo, useState, useCallback, useContext } from "react";
// import {
//   PlusCircle,
//   Edit2,
//   Trash2,
//   TrendingUp,
//   TrendingDown,
//   Wallet,
//   Calendar,
//   Tag,
//   MoreVertical,
// } from "lucide-react";
// import axios from "axios";
// import KeyMetrics from "./KeyMetrics";
// import MonthlyTrendsChart from "./MonthlyTrendsChart";
// import ExpenseCategoriesChart from "./ExpenseCategoriesChart";
// import AddTransactionModal from "./AddTransactionModal";
// import { colors } from "../data/initialData";
// import { AuthContext } from "../context/AuthContext";
// import { toast } from "react-toastify";

// const Dashboard = ({
//   transactions,
//   setTransactions,
//   totalIncome,
//   totalExpenses,
//   netWorth,
//   savingsRate,
//   showAddTransaction,
//   setShowAddTransaction,
// }) => {
//   const [showTransactionDetails, setShowTransactionDetails] = useState(false);
//   const [editingTransaction, setEditingTransaction] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const { token, backendUrl } = useContext(AuthContext);

//   const categoryData = useMemo(() => {
//     const categoryTotals = {};
//     transactions
//       .filter((t) => t.type === "expense")
//       .forEach((t) => {
//         categoryTotals[t.category] =
//           (categoryTotals[t.category] || 0) + t.amount;
//       });
//     return Object.entries(categoryTotals).map(([name, value], index) => ({
//       name,
//       value,
//       color: colors[index % colors.length],
//     }));
//   }, [transactions]);

//   // Helper function to get auth token
//   const getAuthToken = () => {
//     return token || localStorage.getItem("authToken");
//   };

//   // Helper function to handle API errors
//   const handleApiError = (error) => {
//     if (error.response?.status === 401) {
//       return "Authentication failed. Please log in again.";
//     }
//     return (
//       error.response?.data?.message || "An error occurred. Please try again."
//     );
//   };

//   const handleModalClose = useCallback(() => {
//     setShowAddTransaction(false);
//     setEditingTransaction(null);
//     setError(null);
//   }, [setShowAddTransaction]);

//   const handleTransactionSubmit = useCallback(
//     async (transactionData) => {
//       const authToken = getAuthToken();
//       if (!authToken) {
//         setError("Authentication required. Please log in.");
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         let response;
//         if (editingTransaction) {
//           // Update existing transaction
//           response = await axios.put(
//             `${backendUrl}/api/transactions/${
//               editingTransaction._id || editingTransaction.id
//             }`,
//             transactionData,
//             {
//               headers: {
//                 Authorization: `Bearer ${authToken}`,
//               },
//             }
//           );
//         } else {
//           // Create new transaction
//           response = await axios.post(
//             `${backendUrl}/transactions`,
//             transactionData,
//             {
//               headers: {
//                 Authorization: `Bearer ${authToken}`,
//               },
//             }
//           );
//           toast.success("Transaction added successfully");
//         }

//         // Update local state
//         setTransactions((prev) => {
//           if (editingTransaction) {
//             return prev.map((t) =>
//               (t._id || t.id) ===
//               (editingTransaction._id || editingTransaction.id)
//                 ? {
//                     ...response.data,
//                     id: response.data._id || response.data.id,
//                   }
//                 : t
//             );
//           } else {
//             // Add new transaction to the beginning of the list
//             return [
//               { ...response.data, id: response.data._id || response.data.id },
//               ...prev,
//             ];
//           }
//         });

//         handleModalClose();
//       } catch (error) {
//         const errorMessage = handleApiError(error);
//         setError(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [editingTransaction, setTransactions, handleModalClose]
//   );

//   const handleEditTransaction = useCallback(
//     (transaction) => {
//       setEditingTransaction(transaction);
//       setShowAddTransaction(true);
//       setActiveDropdown(null);
//     },
//     [setShowAddTransaction]
//   );

//   const handleDeleteTransaction = useCallback(
//     async (transactionId) => {
//       if (window.confirm("Are you sure you want to delete this transaction?")) {
//         const authToken = getAuthToken();
//         if (!authToken) {
//           setError("Authentication required. Please log in.");
//           return;
//         }

//         setIsLoading(true);
//         try {
//           await axios.delete(`${backendUrl}/transactions/${transactionId}`, {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           });

//           setTransactions((prev) =>
//             prev.filter((t) => (t._id || t.id) !== transactionId)
//           );
//           toast.success("Transaction deleted successfully");
//         } catch (error) {
//           const errorMessage = handleApiError(error);
//           setError(errorMessage);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//       setActiveDropdown(null);
//     },
//     [setTransactions]
//   );

//   const getTransactionIcon = (type) => {
//     switch (type) {
//       case "income":
//         return (
//           <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//         );
//       case "savings":
//         return <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />;
//       default:
//         return <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
//     }
//   };

//   const getTransactionColor = (type) => {
//     switch (type) {
//       case "income":
//         return "text-emerald-600";
//       case "savings":
//         return "text-purple-600";
//       default:
//         return "text-red-500";
//     }
//   };

//   const toggleDropdown = (transactionId) => {
//     setActiveDropdown(activeDropdown === transactionId ? null : transactionId);
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8">
//       {error && (
//         <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
//           <p className="text-red-600 font-medium text-sm sm:text-base">
//             {error}
//           </p>
//         </div>
//       )}

//       <KeyMetrics
//         totalIncome={totalIncome}
//         totalExpenses={totalExpenses}
//         netWorth={netWorth}
//         savingsRate={savingsRate}
//       />

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         <MonthlyTrendsChart transactions={transactions} />
//         <ExpenseCategoriesChart categoryData={categoryData} />
//       </div>

//       <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//               Recent Transactions
//             </h3>
//             <button
//               onClick={() => setShowAddTransaction(true)}
//               className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
//               disabled={isLoading}
//             >
//               <PlusCircle className="h-4 w-4" />
//               <span className="font-medium">Add Transaction</span>
//             </button>
//           </div>
//         </div>

//         <div className="p-3 sm:p-6">
//           <div className="space-y-2 sm:space-y-3">
//             {transactions.slice(0, 5).map((transaction, index) => (
//               <div
//                 key={transaction._id || transaction.id}
//                 className="group flex items-center justify-between p-3 sm:p-5 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md"
//               >
//                 <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
//                   <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
//                     {getTransactionIcon(transaction.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
//                       <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
//                         {transaction.description}
//                       </p>
//                       <div
//                         className={`text-sm sm:text-lg font-bold ${getTransactionColor(
//                           transaction.type
//                         )} sm:hidden`}
//                       >
//                         {transaction.type === "income" ? "+" : "-"}₹
//                         {transaction.amount.toLocaleString()}
//                       </div>
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
//                       <span className="flex items-center space-x-1">
//                         <Tag className="h-3 w-3" />
//                         <span>{transaction.category}</span>
//                       </span>
//                       <span className="flex items-center space-x-1">
//                         <Calendar className="h-3 w-3" />
//                         <span>{transaction.date}</span>
//                       </span>
//                     </div>
//                     {transaction.tags && transaction.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mt-2">
//                         {transaction.tags.map((tag) => (
//                           <span
//                             key={tag}
//                             className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2 sm:space-x-4">
//                   {/* Desktop amount display */}
//                   <div
//                     className={`hidden sm:block text-lg font-bold ${getTransactionColor(
//                       transaction.type
//                     )}`}
//                   >
//                     {transaction.type === "income" ? "+" : "-"}₹
//                     {transaction.amount.toLocaleString()}
//                   </div>

//                   {/* Desktop action buttons */}
//                   <div className="hidden sm:flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <button
//                       onClick={() => handleEditTransaction(transaction)}
//                       className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                       disabled={isLoading}
//                       title="Edit transaction"
//                     >
//                       <Edit2 className="h-4 w-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteTransaction(transaction._id)}
//                       className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
//                       disabled={isLoading}
//                       title="Delete transaction"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>

//                   {/* Mobile dropdown menu */}
//                   <div className="relative sm:hidden">
//                     <button
//                       onClick={() =>
//                         toggleDropdown(transaction._id || transaction.id)
//                       }
//                       className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
//                       disabled={isLoading}
//                     >
//                       <MoreVertical className="h-4 w-4" />
//                     </button>

//                     {activeDropdown === (transaction._id || transaction.id) && (
//                       <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//                         <button
//                           onClick={() => handleEditTransaction(transaction)}
//                           className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
//                           disabled={isLoading}
//                         >
//                           <Edit2 className="h-3 w-3" />
//                           <span>Edit</span>
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleDeleteTransaction(
//                               transaction._id || transaction.id
//                             )
//                           }
//                           className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
//                           disabled={isLoading}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                           <span>Delete</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {transactions.length === 0 && (
//             <div className="text-center py-8 sm:py-12">
//               <div className="flex justify-center mb-4">
//                 <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
//                   <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
//                 </div>
//               </div>
//               <p className="text-gray-500 text-base sm:text-lg font-medium">
//                 No transactions yet
//               </p>
//               <p className="text-gray-400 mt-1 text-sm sm:text-base">
//                 Add your first transaction to get started!
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Fixed add button for mobile */}
//       <div className="fixed bottom-6 right-6 sm:hidden">
//         <button
//           onClick={() => setShowAddTransaction(true)}
//           className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
//           disabled={isLoading}
//         >
//           <PlusCircle className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Close dropdown when clicking outside */}
//       {activeDropdown && (
//         <div
//           className="fixed inset-0 z-5"
//           onClick={() => setActiveDropdown(null)}
//         />
//       )}

//       {showAddTransaction && (
//         <AddTransactionModal
//           transactions={transactions}
//           setTransactions={setTransactions}
//           onClose={handleModalClose}
//           onSubmit={handleTransactionSubmit}
//           isLoading={isLoading}
//           editingTransaction={editingTransaction}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import React, { useMemo, useState, useCallback, useContext } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Tag,
  MoreVertical,
} from "lucide-react";
import axios from "axios";
import KeyMetrics from "./KeyMetrics";
import MonthlyTrendsChart from "./MonthlyTrendsChart";
import ExpenseCategoriesChart from "./ExpenseCategoriesChart";
import AddTransactionModal from "./AddTransactionModal";
import { colors } from "../data/initialData";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = ({
  transactions,
  setTransactions,
  totalIncome,
  totalExpenses,
  netWorth,
  savingsRate,
  showAddTransaction,
  setShowAddTransaction,
}) => {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { token, backendUrl } = useContext(AuthContext);

  const categoryData = useMemo(() => {
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  const getAuthToken = () => {
    return token || localStorage.getItem("authToken");
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      return "Authentication failed. Please log in again.";
    }
    return (
      error.response?.data?.message || "An error occurred. Please try again."
    );
  };

  const handleModalClose = useCallback(() => {
    setShowAddTransaction(false);
    setEditingTransaction(null);
    setError(null);
  }, [setShowAddTransaction]);

  const handleTransactionSubmit = useCallback(
    async (transactionData) => {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let response;
        if (editingTransaction) {
          // Update existing transaction
          response = await axios.put(
            `${backendUrl}/api/transactions/${editingTransaction._id}`,
            transactionData,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          toast.success("Transaction updated successfully");
        } else {
          // Create new transaction
          response = await axios.post(
            `${backendUrl}/api/transactions`,
            transactionData,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Update local state
        if (editingTransaction) {
          setTransactions((prev) =>
            prev.map((t) =>
              t._id === editingTransaction._id ? response.data : t
            )
          );
        } else {
          setTransactions((prev) => [response.data, ...prev]);
        }

        handleModalClose();
      } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
        console.error("Transaction error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [editingTransaction, backendUrl, handleModalClose, setTransactions]
  );

  const handleEditTransaction = useCallback(
    (transaction) => {
      setEditingTransaction(transaction);
      setShowAddTransaction(true);
      setActiveDropdown(null);
    },
    [setShowAddTransaction]
  );

  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      if (!transactionId) {
        toast.error("Invalid transaction ID");
        return;
      }

      if (window.confirm("Are you sure you want to delete this transaction?")) {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication required. Please log in.");
          return;
        }

        setIsLoading(true);
        try {
          await axios.delete(
            `${backendUrl}/api/transactions/${transactionId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          setTransactions((prev) =>
            prev.filter((t) => t._id !== transactionId)
          );
          toast.success("Transaction deleted successfully");
        } catch (error) {
          const errorMessage = handleApiError(error);
          toast.error(errorMessage);
          console.error("Delete error:", error);
        } finally {
          setIsLoading(false);
        }
      }
      setActiveDropdown(null);
    },
    [backendUrl, setTransactions]
  );

  const getTransactionIcon = (type) => {
    switch (type) {
      case "income":
        return (
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
        );
      case "savings":
        return <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />;
      default:
        return <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "income":
        return "text-emerald-600";
      case "savings":
        return "text-purple-600";
      default:
        return "text-red-500";
    }
  };

  const toggleDropdown = (transactionId) => {
    setActiveDropdown(activeDropdown === transactionId ? null : transactionId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <KeyMetrics
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netWorth={netWorth}
        savingsRate={savingsRate}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <MonthlyTrendsChart transactions={transactions} />
        <ExpenseCategoriesChart categoryData={categoryData} />
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Recent Transactions
            </h3>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowAddTransaction(true);
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="font-medium">Add Transaction</span>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction._id}
                className="group flex items-center justify-between p-3 sm:p-5 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {transaction.description}
                      </p>
                      <div
                        className={`text-sm sm:text-lg font-bold ${getTransactionColor(
                          transaction.type
                        )} sm:hidden`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                      <span className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{transaction.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transaction.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div
                    className={`hidden sm:block text-lg font-bold ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </div>

                  <div className="hidden sm:flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                      title="Edit transaction"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                      title="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative sm:hidden">
                    <button
                      onClick={() => toggleDropdown(transaction._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeDropdown === transaction._id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => {
                            handleEditTransaction(transaction);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteTransaction(transaction._id);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="flex justify-center mb-4">
                <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
                  <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 text-base sm:text-lg font-medium">
                No transactions yet
              </p>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Add your first transaction to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={() => {
            setEditingTransaction(null);
            setShowAddTransaction(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          disabled={isLoading}
        >
          <PlusCircle className="h-6 w-6" />
        </button>
      </div>

      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}

      {showAddTransaction && (
        <AddTransactionModal
          onClose={handleModalClose}
          onSubmit={handleTransactionSubmit}
          isLoading={isLoading}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default Dashboard;
