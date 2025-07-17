// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const CashFlowTrendChart = ({ data }) => {
//   // State to manage line visibility
//   const [hiddenLines, setHiddenLines] = useState({});

//   // Format x-axis labels (e.g., "2025-05" to "May 2025")
//   const formatXAxis = (tick) => {
//     try {
//       const [year, month] = tick.split("-");
//       const date = new Date(year, parseInt(month) - 1);
//       return date.toLocaleString("en-US", { month: "short", year: "numeric" });
//     } catch {
//       return tick;
//     }
//   };

//   // Format tooltip values as INR
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(value);
//   };

//   // Custom tooltip component
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 bg-opacity-90">
//           <p className="text-sm font-semibold">{formatXAxis(label)}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-xs" style={{ color: entry.color }}>
//               {entry.name}: {formatCurrency(entry.value)}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Handle legend click to toggle line visibility
//   const handleLegendClick = (dataKey) => {
//     setHiddenLines((prev) => ({
//       ...prev,
//       [dataKey]: !prev[dataKey],
//     }));
//   };

//   // Convert data to Recharts format
//   const chartData = data.labels.map((month, index) => ({
//     month,
//     income: data.datasets[0].data[index] || 0,
//     expenses: data.datasets[1].data[index] || 0,
//     savings: data.datasets[2].data[index] || 0,
//     netCashFlow: data.datasets[3].data[index] || 0,
//   }));

//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h3 className="text-xl font-bold text-gray-900">Cash Flow Trend</h3>
//           <p className="text-sm text-gray-500">
//             Track your income, expenses, savings, and net cash flow over time
//           </p>
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height={350}>
//         <LineChart
//           data={chartData}
//           margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
//         >
//           <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
//           <XAxis
//             dataKey="month"
//             tickFormatter={formatXAxis}
//             fontSize={12}
//             stroke="#6b7280"
//           />
//           <YAxis
//             fontSize={12}
//             stroke="#6b7280"
//             tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
//           />
//           <Tooltip content={<CustomTooltip />} />
//           <Legend
//             onClick={(e) => handleLegendClick(e.dataKey)}
//             formatter={(value) => (
//               <span
//                 className={`text-sm ${
//                   hiddenLines[value] ? "text-gray-400" : "text-gray-700"
//                 } cursor-pointer hover:text-gray-900 transition-colors`}
//               >
//                 {value}
//               </span>
//             )}
//           />
//           <Line
//             type="monotone"
//             dataKey="income"
//             stroke="#10B981"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//             hide={hiddenLines["income"]}
//             fill="url(#incomeGradient)"
//           />
//           <Line
//             type="monotone"
//             dataKey="expenses"
//             stroke="#EF4444"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//             hide={hiddenLines["expenses"]}
//             fill="url(#expensesGradient)"
//           />
//           <Line
//             type="monotone"
//             dataKey="savings"
//             stroke="#8B5CF6"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//             hide={hiddenLines["savings"]}
//             fill="url(#savingsGradient)"
//           />
//           <Line
//             type="monotone"
//             dataKey="netCashFlow"
//             stroke="#F59E0B"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//             hide={hiddenLines["netCashFlow"]}
//             fill="url(#netCashFlowGradient)"
//           />
//           {/* Gradient definitions */}
//           <defs>
//             <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//               <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
//             </linearGradient>
//             <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
//               <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
//             </linearGradient>
//             <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//               <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//             </linearGradient>
//             <linearGradient
//               id="netCashFlowGradient"
//               x1="0"
//               y1="0"
//               x2="0"
//               y2="1"
//             >
//               <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
//               <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CashFlowTrendChart;
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CashFlowTrendChart = ({ data }) => {
  // State to manage line visibility
  const [hiddenLines, setHiddenLines] = useState({});

  // Format x-axis labels (e.g., "2025-05" to "May 2025")
  const formatXAxis = (tick) => {
    try {
      const [year, month] = tick.split("-");
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    } catch {
      return tick;
    }
  };

  // Format x-axis labels for mobile (shorter format)
  const formatXAxisMobile = (tick) => {
    try {
      const [year, month] = tick.split("-");
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleString("en-US", { month: "short" });
    } catch {
      return tick;
    }
  };

  // Format tooltip values as INR
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-700 bg-opacity-90 text-xs sm:text-sm">
          <p className="text-xs sm:text-sm font-semibold mb-1">
            {formatXAxis(label)}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle legend click to toggle line visibility
  const handleLegendClick = (dataKey) => {
    setHiddenLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  // Convert data to Recharts format
  const chartData = data.labels.map((month, index) => ({
    month,
    income: data.datasets[0].data[index] || 0,
    expenses: data.datasets[1].data[index] || 0,
    savings: data.datasets[2].data[index] || 0,
    netCashFlow: data.datasets[3].data[index] || 0,
  }));

  // Mobile legend component
  const MobileLegend = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
      {[
        { key: "income", label: "Income", color: "#10B981" },
        { key: "expenses", label: "Expenses", color: "#EF4444" },
        { key: "savings", label: "Savings", color: "#8B5CF6" },
        { key: "netCashFlow", label: "Net Cash Flow", color: "#F59E0B" },
      ].map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => handleLegendClick(key)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm transition-all ${
            hiddenLines[key]
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              hiddenLines[key] ? "opacity-40" : ""
            }`}
            style={{ backgroundColor: color }}
          />
          <span className={hiddenLines[key] ? "line-through" : ""}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-[1.01]">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          Cash Flow Trend
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Track your income, expenses, savings, and net cash flow
        </p>
      </div>

      {/* Mobile Legend */}
      <div className="block sm:hidden">
        <MobileLegend />
      </div>

      {/* Chart Container */}
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={300} minWidth={320}>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tickFormatter={
                window.innerWidth < 640 ? formatXAxisMobile : formatXAxis
              }
              fontSize={10}
              stroke="#6b7280"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              fontSize={10}
              stroke="#6b7280"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Desktop Legend */}
            <Legend
              wrapperStyle={{
                display: window.innerWidth < 640 ? "none" : "block",
              }}
              onClick={(e) => handleLegendClick(e.dataKey)}
              formatter={(value) => (
                <span
                  className={`text-sm ${
                    hiddenLines[value] ? "text-gray-400" : "text-gray-700"
                  } cursor-pointer hover:text-gray-900 transition-colors`}
                >
                  {value}
                </span>
              )}
            />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 4 }}
              hide={hiddenLines["income"]}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 4 }}
              hide={hiddenLines["expenses"]}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 4 }}
              hide={hiddenLines["savings"]}
            />
            <Line
              type="monotone"
              dataKey="netCashFlow"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 4 }}
              hide={hiddenLines["netCashFlow"]}
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="netCashFlowGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile Summary Stats */}
      <div className="block sm:hidden mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-green-50 p-2 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Income</span>
          </div>
          <p className="text-green-800 font-semibold">
            {formatCurrency(chartData[chartData.length - 1]?.income || 0)}
          </p>
        </div>
        <div className="bg-red-50 p-2 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">Expenses</span>
          </div>
          <p className="text-red-800 font-semibold">
            {formatCurrency(chartData[chartData.length - 1]?.expenses || 0)}
          </p>
        </div>
        <div className="bg-purple-50 p-2 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-700 font-medium">Savings</span>
          </div>
          <p className="text-purple-800 font-semibold">
            {formatCurrency(chartData[chartData.length - 1]?.savings || 0)}
          </p>
        </div>
        <div className="bg-amber-50 p-2 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-amber-700 font-medium">Net Flow</span>
          </div>
          <p className="text-amber-800 font-semibold">
            {formatCurrency(chartData[chartData.length - 1]?.netCashFlow || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowTrendChart;
