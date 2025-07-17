// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const BudgetVsActualChart = ({ budgets }) => {
//   return (
//     <div
//       className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
//       role="region"
//       aria-labelledby="budget-vs-actual-title"
//     >
//       <h3
//         id="budget-vs-actual-title"
//         className="text-lg font-semibold text-gray-900 mb-4"
//       >
//         Budget vs Actual Spending
//       </h3>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart data={budgets}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="category" />
//           <YAxis />
//           <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
//           <Legend />
//           {budgets.map((budget, index) => (
//             <Bar
//               key={`budgeted-${budget.category}`}
//               dataKey={(data) =>
//                 data.category === budget.category ? data.budgeted : 0
//               }
//               fill={budget.color}
//               name={`${budget.category} Budgeted`}
//               stackId={`budgeted-${index}`}
//             />
//           ))}
//           <Bar dataKey="spent" fill="#EF4444" name="Spent" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default BudgetVsActualChart;
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BudgetVsActualChart = ({ budgets }) => {
  const [viewMode, setViewMode] = useState("comparison"); // comparison, percentage

  // Calculate totals and performance metrics
  const calculateMetrics = () => {
    if (!budgets || budgets.length === 0) return null;

    const totalBudgeted = budgets.reduce(
      (sum, budget) => sum + budget.budgeted,
      0
    );
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = totalBudgeted - totalSpent;
    const overallPerformance =
      totalBudgeted > 0
        ? ((totalBudgeted - totalSpent) / totalBudgeted) * 100
        : 0;

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      overallPerformance,
    };
  };

  const metrics = calculateMetrics();

  // Transform data for percentage view
  const getPercentageData = () => {
    return budgets.map((budget) => ({
      ...budget,
      spentPercentage:
        budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0,
    }));
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budget = budgets.find((b) => b.category === label);
      if (!budget) return null;

      const spentPercentage =
        budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;
      const remaining = budget.budgeted - budget.spent;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Budgeted: ₹{budget.budgeted.toLocaleString()}
            </p>
            <p className="text-sm text-red-600">
              Spent: ₹{budget.spent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Remaining: ₹{remaining.toLocaleString()}
            </p>
            <p className="text-sm font-medium">
              Used: {spentPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Get budget status color
  const getBudgetStatus = (budget) => {
    const percentage =
      budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;
    if (percentage <= 50)
      return { color: "text-green-600", bg: "bg-green-50", status: "Good" };
    if (percentage <= 80)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        status: "Warning",
      };
    if (percentage <= 100)
      return {
        color: "text-orange-600",
        bg: "bg-orange-50",
        status: "Near Limit",
      };
    return { color: "text-red-600", bg: "bg-red-50", status: "Over Budget" };
  };

  // No data state
  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Budget vs Actual Spending
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Compare your planned vs actual spending
          </p>
        </div>
        <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-3">💰</div>
            <p className="text-gray-600 text-sm sm:text-base">
              No budget data available.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Create budgets to track your spending
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Budget vs Actual Spending
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Compare your planned vs actual spending
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              View:
            </span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="comparison">Amount Comparison</option>
              <option value="percentage">Percentage Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-blue-600 text-xs sm:text-sm font-medium">
              Total Budget
            </div>
            <div className="text-blue-800 font-bold text-sm sm:text-lg">
              ₹{metrics.totalBudgeted.toLocaleString()}
            </div>
          </div>
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-red-600 text-xs sm:text-sm font-medium">
              Total Spent
            </div>
            <div className="text-red-800 font-bold text-sm sm:text-lg">
              ₹{metrics.totalSpent.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-lg text-center ${
              metrics.totalRemaining >= 0 ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div
              className={`text-xs sm:text-sm font-medium ${
                metrics.totalRemaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Remaining
            </div>
            <div
              className={`font-bold text-sm sm:text-lg ${
                metrics.totalRemaining >= 0 ? "text-green-800" : "text-red-800"
              }`}
            >
              ₹{Math.abs(metrics.totalRemaining).toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-purple-600 text-xs sm:text-sm font-medium">
              Performance
            </div>
            <div className="text-purple-800 font-bold text-sm sm:text-lg">
              {metrics.overallPerformance.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status Cards - Mobile optimized */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
        <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
          Category Status
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {budgets.map((budget, index) => {
            const status = getBudgetStatus(budget);
            const percentage =
              budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;

            return (
              <div
                key={index}
                className={`${status.bg} p-3 rounded-lg border border-gray-200`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {budget.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${status.color} bg-white`}
                  >
                    {status.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>₹{budget.spent.toLocaleString()}</span>
                    <span>₹{budget.budgeted.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage <= 50
                          ? "bg-green-500"
                          : percentage <= 80
                          ? "bg-yellow-500"
                          : percentage <= 100
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    {percentage.toFixed(1)}% used
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 sm:p-6">
        <div className="h-[250px] sm:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={viewMode === "percentage" ? getPercentageData() : budgets}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
                angle={window.innerWidth < 640 ? -45 : 0}
                textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                height={window.innerWidth < 640 ? 80 : 60}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
                width={50}
                tickFormatter={(value) =>
                  viewMode === "percentage"
                    ? `${value}%`
                    : `₹${(value / 1000).toFixed(0)}k`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "20px",
                }}
              />

              {viewMode === "comparison" ? (
                <>
                  <Bar
                    dataKey="budgeted"
                    fill="#3B82F6"
                    name="Budgeted"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="spent"
                    fill="#EF4444"
                    name="Spent"
                    radius={[2, 2, 0, 0]}
                  />
                </>
              ) : (
                <Bar
                  dataKey="spentPercentage"
                  fill="#8B5CF6"
                  name="% Used"
                  radius={[2, 2, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer with insights */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Categories:</span> {budgets.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Avg budget:</span> ₹
            {Math.round(
              metrics.totalBudgeted / budgets.length
            ).toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Budget efficiency:</span>{" "}
            {budgets.filter((b) => b.spent <= b.budgeted).length}/
            {budgets.length} on track
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetVsActualChart;
