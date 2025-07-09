import React, { useState, useEffect, useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

const MonthlyTrendsChart = () => {
  const { token, backendUrl } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setError("Please log in to view trends");
        setLoading(false);
        return;
      }

      try {
        // Fetch transactions from backend
        const response = await axios.get(`${backendUrl}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Process transactions to monthly aggregates
        const transactions = response.data;
        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
          const date = moment().subtract(i, "months");
          return {
            month: date.format("MMM"),
            year: date.year(),
            income: 0,
            expenses: 0,
            savings: 0,
          };
        }).reverse(); // Chronological order

        transactions.forEach((tx) => {
          const txDate = moment(tx.date);
          const monthYear = txDate.format("MMM") + txDate.year();
          const monthData = lastSixMonths.find(
            (m) => m.month + m.year === monthYear
          );
          if (monthData) {
            if (tx.type === "income") {
              monthData.income += tx.amount;
            } else if (tx.type === "expense") {
              monthData.expenses += tx.amount;
            } else if (tx.type === "savings") {
              monthData.savings += tx.amount;
            }
          }
        });

        setChartData(lastSixMonths);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trends data");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[360px]">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="text-gray-600">Loading trends...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[360px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[360px]">
        <p className="text-gray-600">No transaction data available.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      role="region"
      aria-labelledby="monthly-trends-title"
    >
      <h3
        id="monthly-trends-title"
        className="text-lg font-semibold text-gray-900 mb-4"
      >
        Monthly Financial Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="income"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stackId="2"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.3}
            name="Expenses"
          />
          <Area
            type="monotone"
            dataKey="savings"
            stackId="3"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.3}
            name="Savings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendsChart;
