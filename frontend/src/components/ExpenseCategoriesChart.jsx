// // src/components/ExpenseCategoriesChart.js
// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const ExpenseCategoriesChart = ({ categoryData }) => {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//         Expense Categories
//       </h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={categoryData}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={120}
//             paddingAngle={5}
//             dataKey="value"
//           >
//             {categoryData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ExpenseCategoriesChart;
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ExpenseCategoriesChart = ({ categoryData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Calculate total expenses
  const totalExpenses = categoryData.reduce(
    (sum, category) => sum + category.value,
    0
  );

  // Custom tooltip for better mobile experience
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: ₹{data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Share: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for mobile
  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index) => {
          const percentage = (
            (entry.payload.value / totalExpenses) *
            100
          ).toFixed(1);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                  {entry.value}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-semibold text-gray-800">
                  ₹{entry.payload.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Handle pie slice hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // No data state
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Expense Categories
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Breakdown of your spending by category
          </p>
        </div>
        <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-3">📊</div>
            <p className="text-gray-600 text-sm sm:text-base">
              No expense data available.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Start adding expenses to see categories
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sort categories by value for better display
  const sortedCategories = [...categoryData].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Expense Categories
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Breakdown of your spending by category
            </p>
          </div>

          {/* Total expenses display */}
          <div className="bg-red-50 px-3 py-2 rounded-lg">
            <div className="text-red-600 text-xs sm:text-sm font-medium">
              Total Expenses
            </div>
            <div className="text-red-800 font-bold text-sm sm:text-lg">
              ₹{totalExpenses.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Top categories summary - Mobile optimized */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
        <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
          Top Categories
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sortedCategories.slice(0, 3).map((category, index) => {
            const percentage = ((category.value / totalExpenses) * 100).toFixed(
              1
            );
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={index}
                className="bg-white p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{medals[index]}</span>
                  <span className="text-xs font-medium text-gray-500">
                    {percentage}%
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {category.name}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  ₹{category.value.toLocaleString()}
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
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={window.innerWidth < 640 ? 40 : 60}
                outerRadius={window.innerWidth < 640 ? 80 : 120}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={activeIndex === index ? "#374151" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter:
                        activeIndex === index ? "brightness(1.1)" : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <CustomLegend
          payload={categoryData.map((item) => ({
            value: item.name,
            color: item.color,
            payload: item,
          }))}
        />
      </div>

      {/* Footer with insights */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Categories:</span>{" "}
            {categoryData.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Avg per category:</span> ₹
            {Math.round(totalExpenses / categoryData.length).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCategoriesChart;
