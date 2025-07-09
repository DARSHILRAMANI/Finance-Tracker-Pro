// // src/components/Analytics.js
// import React, { useMemo } from "react";
// import CashFlowTrendChart from "./CashFlowTrendChart";
// import SpendingByCategoryChart from "./SpendingByCategoryChart";
// import FinancialHealthScore from "./FinancialHealthScore";
// import { colors } from "../data/initialData";

// const Analytics = ({ transactions }) => {
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

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <CashFlowTrendChart />
//         <SpendingByCategoryChart categoryData={categoryData} />
//       </div>
//       <FinancialHealthScore />
//     </div>
//   );
// };

// export default Analytics;
import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CashFlowTrendChart from "./CashFlowTrendChart";
import SpendingByCategoryChart from "./SpendingByCategoryChart";
import FinancialHealthScore from "./FinancialHealthScore";
import { colors } from "../data/initialData";

// Shared event bus for transaction updates
const transactionEventBus = {
  listeners: [],
  emit: () => {
    transactionEventBus.listeners.forEach((callback) => callback());
  },
  subscribe: (callback) => {
    transactionEventBus.listeners.push(callback);
    return () => {
      transactionEventBus.listeners = transactionEventBus.listeners.filter(
        (cb) => cb !== callback
      );
    };
  },
};

const Analytics = () => {
  const { token, backendUrl } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`${backendUrl}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!Array.isArray(response.data)) {
        throw new Error(
          "Invalid response format: Expected an array of transactions."
        );
      }
      setTransactions(
        response.data.filter(
          (t) =>
            t.type &&
            ["income", "expense", "savings"].includes(t.type) &&
            typeof t.amount === "number" &&
            t.amount >= 0 &&
            t.date &&
            !isNaN(new Date(t.date).getTime())
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch transactions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and listen for transaction updates
  useEffect(() => {
    if (token) {
      fetchTransactions();
      const unsubscribe = transactionEventBus.subscribe(fetchTransactions);
      return () => unsubscribe();
    } else {
      setError("Authentication required to fetch transactions.");
      setIsLoading(false);
    }
  }, [token]);

  // Compute category data for SpendingByCategoryChart
  const categoryData = useMemo(() => {
    if (!transactions.length) return [];
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (t.category) {
          categoryTotals[t.category] =
            (categoryTotals[t.category] || 0) + t.amount;
        }
      });
    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  // Compute cash flow data for CashFlowTrendChart
  const cashFlowData = useMemo(() => {
    if (!transactions.length) return { labels: [], datasets: [] };
    const monthlyData = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (isNaN(date.getTime())) return;
      const monthKey = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, savings: 0 };
      }
      if (t.type === "income") {
        monthlyData[monthKey].income += t.amount;
      } else if (t.type === "expense") {
        monthlyData[monthKey].expense += t.amount;
      } else if (t.type === "savings") {
        monthlyData[monthKey].savings += t.amount;
      }
    });

    const labels = Object.keys(monthlyData).sort();
    const incomeData = labels.map((month) => monthlyData[month].income);
    const expenseData = labels.map((month) => monthlyData[month].expense);
    const savingsData = labels.map((month) => monthlyData[month].savings);
    const netCashFlow = labels.map(
      (month) => monthlyData[month].income - monthlyData[month].expense
    );

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: false,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "#F44336",
          backgroundColor: "rgba(244, 67, 54, 0.2)",
          fill: false,
        },
        {
          label: "Savings",
          data: savingsData,
          borderColor: "#2196F3",
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          fill: false,
        },
        {
          label: "Net Cash Flow",
          data: netCashFlow,
          borderColor: "#FFC107",
          backgroundColor: "rgba(255, 193, 7, 0.2)",
          fill: false,
        },
      ],
    };
  }, [transactions]);

  // Compute financial health metrics for FinancialHealthScore
  const financialHealthData = useMemo(() => {
    if (!transactions.length) {
      return {
        savingsRate: "0.0",
        expenseToIncomeRatio: "100.0",
        healthScore: "0.0",
      };
    }
    const totals = transactions.reduce(
      (acc, t) => {
        if (t.type === "income") {
          acc.income += t.amount;
        } else if (t.type === "expense") {
          acc.expense += t.amount;
        } else if (t.type === "savings") {
          acc.savings += t.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, savings: 0 }
    );

    const savingsRate =
      totals.income > 0 ? (totals.savings / totals.income) * 100 : 0;
    const expenseToIncomeRatio =
      totals.income > 0 ? (totals.expense / totals.income) * 100 : 100;
    const healthScore = Math.min(
      Math.max(100 - expenseToIncomeRatio + savingsRate * 2, 0),
      100
    );

    return {
      savingsRate: savingsRate.toFixed(1),
      expenseToIncomeRatio: expenseToIncomeRatio.toFixed(1),
      healthScore: healthScore.toFixed(1),
    };
  }, [transactions]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Financial Analytics
        </h2>
        <button
          onClick={fetchTransactions}
          className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading || !token}
        >
          Refresh
        </button>
      </div>
      {isLoading && (
        <div className="text-center text-gray-600">Loading analytics...</div>
      )}
      {error && (
        <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cashFlowData.labels.length ? (
            <CashFlowTrendChart data={cashFlowData} />
          ) : (
            <div className="text-center text-gray-600 p-4 bg-gray-100 rounded-lg">
              No cash flow data available.
            </div>
          )}
          {categoryData.length ? (
            <SpendingByCategoryChart categoryData={categoryData} />
          ) : (
            <div className="text-center text-gray-600 p-4 bg-gray-100 rounded-lg">
              No expense data available.
            </div>
          )}
        </div>
      )}
      {!isLoading && !error && (
        <FinancialHealthScore
          data={financialHealthData}
          hasTransactions={transactions.length > 0}
        />
      )}
    </div>
  );
};

export default Analytics;

// Export event bus for use in other components
export { transactionEventBus };
