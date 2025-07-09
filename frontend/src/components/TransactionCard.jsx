import React, { memo } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  X,
  Calendar,
  Tag,
  DollarSign,
  ArrowDown,
  ArrowUp,
  PiggyBank,
} from "lucide-react";
import { toast } from "react-toastify";

// Memoized Transaction Details Modal - Made responsive
const TransactionDetailsModal = memo(({ transaction, onClose }) => {
  const getTransactionIcon = (type) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "income":
        return <ArrowUp className={`${iconClass} text-emerald-500`} />;
      case "savings":
        return <PiggyBank className={`${iconClass} text-indigo-500`} />;
      default:
        return <ArrowDown className={`${iconClass} text-rose-500`} />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "income":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "savings":
        return "text-indigo-600 bg-indigo-50 border-indigo-100";
      default:
        return "text-rose-600 bg-rose-50 border-rose-100";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "income":
        return "Income";
      case "savings":
        return "Savings";
      default:
        return "Expense";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl p-0 w-full max-w-md mx-4 z-50 border border-gray-100 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border ${getTransactionColor(
                  transaction.type
                )}`}
              >
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Transaction Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {getTypeLabel(transaction.type)} • {transaction.date}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <h4 className="font-medium text-gray-500 mb-1 sm:mb-2 text-xs uppercase tracking-wider">
              Description
            </h4>
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              {transaction.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Type */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                {getTransactionIcon(transaction.type)}
                <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Type
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold ${getTransactionColor(
                  transaction.type
                )}`}
              >
                {getTypeLabel(transaction.type)}
              </span>
            </div>

            {/* Category */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Category
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 capitalize">
                {transaction.category}
              </p>
            </div>

            {/* Date */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Date
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {transaction.date}
              </p>
            </div>

            {/* Amount */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Amount
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-bold ${
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : transaction.type === "savings"
                    ? "text-indigo-600"
                    : "text-rose-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}₹
                {transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {transaction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

// Memoized Transaction Row - Made responsive
const TransactionRow = memo(({ transaction, onView, onEdit, onDelete }) => {
  const getTransactionIcon = (type) => {
    const iconClass = "h-3 w-3 sm:h-4 sm:w-4";
    switch (type) {
      case "income":
        return <ArrowUp className={`${iconClass} text-emerald-500`} />;
      case "savings":
        return <PiggyBank className={`${iconClass} text-indigo-500`} />;
      default:
        return <ArrowDown className={`${iconClass} text-rose-500`} />;
    }
  };

  const getTransactionBadge = (type) => {
    switch (type) {
      case "income":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "savings":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  const getAmountColor = (type) => {
    switch (type) {
      case "income":
        return "text-emerald-600";
      case "savings":
        return "text-indigo-600";
      default:
        return "text-rose-600";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150 group border-b border-gray-200 last:border-b-0">
      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex items-center justify-center mr-2 sm:mr-3 ${getTransactionBadge(
              transaction.type
            )} border`}
          >
            {getTransactionIcon(transaction.type)}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate">
              {transaction.description}
            </div>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs sm:text-xs font-medium ${getTransactionBadge(
                transaction.type
              )} border`}
            >
              {transaction.type === "income"
                ? "Income"
                : transaction.type === "savings"
                ? "Savings"
                : "Expense"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-600 font-medium capitalize truncate max-w-[80px] sm:max-w-none">
            {transaction.category}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-500">
            {transaction.date}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <span
          className={`text-xs sm:text-sm font-semibold ${getAmountColor(
            transaction.type
          )}`}
        >
          {transaction.type === "income" ? "+" : "-"}₹
          {transaction.amount.toLocaleString()}
        </span>
      </td>
      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1 max-w-[100px] sm:max-w-[160px]">
          {transaction.tags && transaction.tags.length > 0 ? (
            transaction.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs sm:text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 truncate"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-2xs sm:text-xs text-gray-400 italic">
              No tags
            </span>
          )}
          {transaction.tags?.length > 1 && (
            <span className="text-2xs sm:text-xs text-gray-400">
              +{transaction.tags.length - 1} more
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-0.5 sm:space-x-1">
          <button
            onClick={() => onView(transaction)}
            className="p-1 sm:p-1.5 text-gray-400 rounded-md"
            title="View details"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            className="p-1 sm:p-1.5 text-gray-400 rounded-md"
            title="Edit transaction"
          >
            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="p-1 sm:p-1.5 text-gray-400 rounded-md"
            title="Delete transaction"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

export { TransactionDetailsModal, TransactionRow };
