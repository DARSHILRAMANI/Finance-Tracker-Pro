// src/components/KeyMetrics.js
import React from "react";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";

const KeyMetrics = ({ totalIncome, totalExpenses, netWorth, savingsRate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalIncome.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{totalExpenses.toLocaleString()}
            </p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Worth</p>
            <p
              className={`text-2xl font-bold ${
                netWorth >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ₹{netWorth.toLocaleString()}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">{savingsRate}%</p>
          </div>
          <PiggyBank className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
