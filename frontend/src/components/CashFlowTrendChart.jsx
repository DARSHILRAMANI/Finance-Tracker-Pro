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
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 bg-opacity-90">
          <p className="text-sm font-semibold">{formatXAxis(label)}</p>
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

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cash Flow Trend</h3>
          <p className="text-sm text-gray-500">
            Track your income, expenses, savings, and net cash flow over time
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tickFormatter={formatXAxis}
            fontSize={12}
            stroke="#6b7280"
          />
          <YAxis
            fontSize={12}
            stroke="#6b7280"
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
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
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={hiddenLines["income"]}
            fill="url(#incomeGradient)"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={hiddenLines["expenses"]}
            fill="url(#expensesGradient)"
          />
          <Line
            type="monotone"
            dataKey="savings"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={hiddenLines["savings"]}
            fill="url(#savingsGradient)"
          />
          <Line
            type="monotone"
            dataKey="netCashFlow"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={hiddenLines["netCashFlow"]}
            fill="url(#netCashFlowGradient)"
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
  );
};

export default CashFlowTrendChart;
