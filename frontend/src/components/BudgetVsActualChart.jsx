import React from "react";
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
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      role="region"
      aria-labelledby="budget-vs-actual-title"
    >
      <h3
        id="budget-vs-actual-title"
        className="text-lg font-semibold text-gray-900 mb-4"
      >
        Budget vs Actual Spending
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={budgets}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          <Legend />
          {budgets.map((budget, index) => (
            <Bar
              key={`budgeted-${budget.category}`}
              dataKey={(data) =>
                data.category === budget.category ? data.budgeted : 0
              }
              fill={budget.color}
              name={`${budget.category} Budgeted`}
              stackId={`budgeted-${index}`}
            />
          ))}
          <Bar dataKey="spent" fill="#EF4444" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetVsActualChart;
