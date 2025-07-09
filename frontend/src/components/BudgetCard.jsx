import React, { useState } from "react";
import moment from "moment";
import {
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Target,
} from "lucide-react";
import AddBudgetModel from "./AddBudgetModel";
import { toast } from "react-toastify"; // Updated import for toast notifications

const BudgetCard = ({ budget, onUpdate, onDelete, index, refreshBudgets }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!budget) return null;

  const budgeted = budget.budgeted || 0;
  const spent = budget.spent || 0;
  const progress = budgeted > 0 ? Math.min((spent / budgeted) * 100, 100) : 0;
  const remaining = budgeted - spent;

  const deadline = budget.deadline ? moment(budget.deadline) : null;
  const today = moment().startOf("day");

  const isExpired = deadline ? deadline.isBefore(today) : false;
  const daysRemaining = deadline ? deadline.diff(today, "days") : null;

  const getProgressColor = () => {
    if (isExpired) return "bg-slate-400";
    if (progress <= 50) return "bg-emerald-500";
    if (progress <= 75) return "bg-amber-500";
    if (progress <= 90) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return {
        text: "Expired",
        color: "bg-slate-50 text-slate-700 border border-slate-200",
        icon: AlertTriangle,
      };
    }
    if (progress > 100) {
      return {
        text: "Over Budget",
        color: "bg-red-50 text-red-700 border border-red-200",
        icon: AlertCircle,
      };
    }
    if (progress > 90) {
      return {
        text: "Near Limit",
        color: "bg-orange-50 text-orange-700 border border-orange-200",
        icon: AlertCircle,
      };
    }
    if (progress > 75) {
      return {
        text: "On Track",
        color: "bg-amber-50 text-amber-700 border border-amber-200",
        icon: TrendingUp,
      };
    }
    return {
      text: "Good",
      color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      icon: Target,
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  const handleUpdate = async (updatedBudget) => {
    try {
      await onUpdate(updatedBudget);
      setShowEditModal(false);
      if (refreshBudgets) {
        await refreshBudgets();
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border transition-all duration-300 ${
          isExpired
            ? "border-slate-200 shadow-sm opacity-75"
            : "border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 hover:-translate-y-1"
        }`}
      >
        {/* Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isExpired
                      ? "#f1f5f9"
                      : budget.color
                      ? `${budget.color}20`
                      : "#f1f5f9",
                  }}
                >
                  <DollarSign
                    className={`w-5 h-5 ${
                      isExpired ? "text-slate-400" : "text-slate-600"
                    }`}
                    style={{
                      color:
                        !isExpired && budget.color ? budget.color : undefined,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg sm:text-xl font-semibold truncate ${
                      isExpired ? "text-slate-500" : "text-slate-900"
                    }`}
                  >
                    {budget.category || "Unknown Category"}
                  </h3>
                  {budget.name && budget.name !== budget.category && (
                    <p
                      className={`text-sm truncate mt-1 ${
                        isExpired ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {budget.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{status.text}</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-bold ${
                    isExpired
                      ? "text-slate-500"
                      : progress > 100
                      ? "text-red-600"
                      : "text-slate-900"
                  }`}
                >
                  {progress.toFixed(0)}%
                </span>
                <span
                  className={`text-sm font-medium ${
                    isExpired ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  used
                </span>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-medium ${
                    isExpired ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      isExpired ? "text-slate-500" : "text-slate-900"
                    }`}
                  >
                    ₹{spent.toLocaleString()}
                  </span>
                  <span className="mx-1">of</span>
                  <span
                    className={`font-semibold ${
                      isExpired ? "text-slate-500" : "text-slate-900"
                    }`}
                  >
                    ₹{budgeted.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              {progress > 100 && (
                <div className="absolute -top-1 right-0 w-2 h-4 bg-red-500 rounded-full opacity-75" />
              )}
            </div>

            {/* Remaining/Over Budget */}
            <div className="flex items-center justify-between">
              {progress > 100 ? (
                <div
                  className={`flex items-center gap-1.5 font-medium ${
                    isExpired ? "text-slate-500" : "text-red-600"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    Over by ₹{(spent - budgeted).toLocaleString()}
                  </span>
                </div>
              ) : (
                <div
                  className={`font-medium ${
                    isExpired ? "text-slate-500" : "text-emerald-600"
                  }`}
                >
                  <span className="text-sm">
                    ₹{remaining.toLocaleString()} remaining
                  </span>
                </div>
              )}
              <div
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  isExpired
                    ? "text-slate-400 bg-slate-50"
                    : "text-slate-600 bg-slate-100"
                }`}
              >
                {budget.transactions?.length || 0} transactions
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock
                className={`w-4 h-4 ${
                  isExpired ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isExpired
                    ? "text-slate-500"
                    : daysRemaining > 7
                    ? "text-emerald-600"
                    : daysRemaining > 3
                    ? "text-amber-600"
                    : daysRemaining > 0
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {isExpired
                  ? "Expired"
                  : daysRemaining !== null
                  ? daysRemaining > 0
                    ? `${daysRemaining} day${
                        daysRemaining === 1 ? "" : "s"
                      } left`
                    : daysRemaining === 0
                    ? "Due today"
                    : "Past due"
                  : "No deadline"}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 text-sm ${
                isExpired ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {budget.deadline
                  ? moment(budget.deadline).format("MMM D")
                  : "No deadline"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {!isExpired && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(budget)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          {/* Expired State */}
          {isExpired && (
            <div className="text-center py-4 px-4 text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Budget Expired</span>
              </div>
              <p className="text-xs">This budget can no longer be modified</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditModal && (
        <AddBudgetModel
          isOpen={showEditModal}
          editingBudget={budget}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdate}
          refreshBudgets={refreshBudgets}
        />
      )}
    </>
  );
};

export default BudgetCard;
