import React from "react";

const BudgetOverview = ({ budgets }) => {
  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.budgeted) * 100;
    if (percentage > 100) return "over";
    if (percentage > 80) return "warning";
    return "good";
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      role="region"
      aria-labelledby="budget-overview-title"
    >
      <h3
        id="budget-overview-title"
        className="text-lg font-semibold text-gray-900 mb-6"
      >
        Budget Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div
            key={budget.category}
            className="p-4 border border-gray-200 rounded-lg"
            aria-label={`Budget for ${budget.category}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">{budget.category}</h4>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  getBudgetStatus(budget) === "over"
                    ? "bg-red-100 text-red-600"
                    : getBudgetStatus(budget) === "warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {getBudgetStatus(budget) === "over"
                  ? "Over Budget"
                  : getBudgetStatus(budget) === "warning"
                  ? "Close to Limit"
                  : "On Track"}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent: ₹{budget.spent.toFixed(2)}</span>
                <span>Budget: ₹{budget.budgeted.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (budget.spent / budget.budgeted) * 100,
                      100
                    )}%`,
                    backgroundColor: budget.color,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                ₹
                {(budget.budgeted - budget.spent > 0
                  ? budget.budgeted - budget.spent
                  : 0
                ).toFixed(2)}{" "}
                remaining
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetOverview;
