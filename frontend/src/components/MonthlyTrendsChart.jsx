// import React, { useState, useEffect, useContext } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import moment from "moment";
// import { toast } from "react-toastify";

// const MonthlyTrendsChart = () => {
//   const { token, backendUrl } = useContext(AuthContext);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       if (!token) {
//         setError("Please log in to view trends");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch transactions from backend
//         const response = await axios.get(`${backendUrl}/api/transactions`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Process transactions to monthly aggregates
//         const transactions = response.data;
//         const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
//           const date = moment().subtract(i, "months");
//           return {
//             month: date.format("MMM"),
//             year: date.year(),
//             income: 0,
//             expenses: 0,
//             savings: 0,
//           };
//         }).reverse(); // Chronological order

//         transactions.forEach((tx) => {
//           const txDate = moment(tx.date);
//           const monthYear = txDate.format("MMM") + txDate.year();
//           const monthData = lastSixMonths.find(
//             (m) => m.month + m.year === monthYear
//           );
//           if (monthData) {
//             if (tx.type === "income") {
//               monthData.income += tx.amount;
//             } else if (tx.type === "expense") {
//               monthData.expenses += tx.amount;
//             } else if (tx.type === "savings") {
//               monthData.savings += tx.amount;
//             }
//           }
//         });

//         setChartData(lastSixMonths);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load trends data");
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [token]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[360px]">
//         <div className="flex items-center space-x-2">
//           <svg
//             className="animate-spin h-5 w-5 text-blue-600"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v8H4z"
//             ></path>
//           </svg>
//           <span className="text-gray-600">Loading trends...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[360px]">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   // No data state
//   if (chartData.length === 0) {
//     return (
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[360px]">
//         <p className="text-gray-600">No transaction data available.</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
//       role="region"
//       aria-labelledby="monthly-trends-title"
//     >
//       <h3
//         id="monthly-trends-title"
//         className="text-lg font-semibold text-gray-900 mb-4"
//       >
//         Monthly Financial Trends
//       </h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip
//             formatter={(value) => `₹${value.toFixed(2)}`}
//             labelFormatter={(label) => `Month: ${label}`}
//           />
//           <Legend />
//           <Area
//             type="monotone"
//             dataKey="income"
//             stackId="1"
//             stroke="#10B981"
//             fill="#10B981"
//             fillOpacity={0.3}
//             name="Income"
//           />
//           <Area
//             type="monotone"
//             dataKey="expenses"
//             stackId="2"
//             stroke="#EF4444"
//             fill="#EF4444"
//             fillOpacity={0.3}
//             name="Expenses"
//           />
//           <Area
//             type="monotone"
//             dataKey="savings"
//             stackId="3"
//             stroke="#8B5CF6"
//             fill="#8B5CF6"
//             fillOpacity={0.3}
//             name="Savings"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default MonthlyTrendsChart;
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
  const [selectedPeriod, setSelectedPeriod] = useState(6);

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
        const months = Array.from({ length: selectedPeriod }, (_, i) => {
          const date = moment().subtract(i, "months");
          return {
            month: date.format("MMM"),
            year: date.year(),
            fullDate: date.format("MMM YYYY"),
            income: 0,
            expenses: 0,
            savings: 0,
          };
        }).reverse(); // Chronological order

        transactions.forEach((tx) => {
          const txDate = moment(tx.date);
          const monthYear = txDate.format("MMM") + txDate.year();
          const monthData = months.find((m) => m.month + m.year === monthYear);
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

        setChartData(months);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trends data");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, selectedPeriod]);

  // Custom tooltip for better mobile experience
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
            <span className="text-gray-600 text-sm sm:text-base">
              Loading trends...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-3">📊</div>
            <p className="text-gray-600 text-sm sm:text-base">
              No transaction data available.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Start adding transactions to see trends
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals for summary cards
  const totals = chartData.reduce(
    (acc, month) => ({
      income: acc.income + month.income,
      expenses: acc.expenses + month.expenses,
      savings: acc.savings + month.savings,
    }),
    { income: 0, expenses: 0, savings: 0 }
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Monthly Financial Trends
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track your financial patterns over time
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Show:
            </span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards - Mobile optimized */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-green-600 text-xs sm:text-sm font-medium">
              Income
            </div>
            <div className="text-green-800 font-bold text-sm sm:text-lg">
              ₹{totals.income.toLocaleString()}
            </div>
          </div>
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-red-600 text-xs sm:text-sm font-medium">
              Expenses
            </div>
            <div className="text-red-800 font-bold text-sm sm:text-lg">
              ₹{totals.expenses.toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-purple-600 text-xs sm:text-sm font-medium">
              Savings
            </div>
            <div className="text-purple-800 font-bold text-sm sm:text-lg">
              ₹{totals.savings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 sm:p-6">
        <div className="h-[250px] sm:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
                width={40}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "20px",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Income"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
                name="Expenses"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stackId="3"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Savings"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer with insights */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Last updated: {moment().format("MMM DD, YYYY")}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Net savings: ₹{(totals.income - totals.expenses).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendsChart;
