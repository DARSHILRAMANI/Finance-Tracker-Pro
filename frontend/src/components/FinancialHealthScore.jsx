import React from "react";

const FinancialHealthScore = ({ data, hasTransactions }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Financial Health Score
      </h3>
      {!hasTransactions ? (
        <div className="text-center text-gray-600">
          No transactions available to compute financial health.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {data.healthScore}
            </div>
            <div className="text-sm text-gray-500">Overall Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${data.healthScore}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {data.expenseToIncomeRatio}
            </div>
            <div className="text-sm text-gray-500">Expense-to-Income Ratio</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(data.expenseToIncomeRatio, 100)}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {data.savingsRate}
            </div>
            <div className="text-sm text-gray-500">Savings Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min(data.savingsRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialHealthScore;
