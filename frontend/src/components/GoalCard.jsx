import React, { useState } from "react";
import {
  Target,
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import moment from "moment";
import AddGoalModal from "./AddGoalModal";
import { toast } from "react-toastify";

const GoalCard = ({ goal, onUpdate, onDelete, refreshGoals }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!goal) return null;

  const current = goal.current || 0;
  const target = goal.target || 0;
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = target - current;

  const deadline = goal.deadline ? moment(goal.deadline) : null;
  const today = moment().startOf("day");

  const isExpired = deadline ? deadline.isBefore(today) : false;
  const daysRemaining = deadline ? deadline.diff(today, "days") : null;

  const formattedDeadline = deadline
    ? deadline.format("MMM DD, YYYY")
    : "No deadline";

  const getProgressColor = () => {
    if (isExpired) return "bg-gray-400";
    if (progress >= 100) return "bg-teal-500";
    if (progress >= 75) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-400";
    if (progress >= 25) return "bg-orange-400";
    return "bg-rose-500";
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return {
        text: "Expired",
        color: "bg-gray-100 text-gray-800 border border-gray-200",
        icon: AlertTriangle,
      };
    }
    if (progress >= 100) {
      return {
        text: "Completed",
        color: "bg-teal-100 text-teal-800 border border-teal-100",
        icon: TrendingUp,
      };
    }
    if (progress >= 75) {
      return {
        text: "Almost There",
        color: "bg-emerald-100 text-emerald-800 border border-emerald-100",
        icon: TrendingUp,
      };
    }
    if (progress >= 50) {
      return {
        text: "On Track",
        color: "bg-amber-100 text-amber-800 border border-amber-100",
        icon: Target,
      };
    }
    if (progress >= 25) {
      return {
        text: "Making Progress",
        color: "bg-orange-100 text-orange-800 border border-orange-100",
        icon: Target,
      };
    }
    return {
      text: "Getting Started",
      color: "bg-rose-100 text-rose-800 border border-rose-100",
      icon: Target,
    };
  };

  const getDaysRemainingColor = () => {
    if (isExpired) return "text-gray-600";
    if (!daysRemaining) return "text-gray-500";
    if (daysRemaining > 30) return "text-teal-600";
    if (daysRemaining > 7) return "text-amber-500";
    if (daysRemaining > 0) return "text-orange-500";
    return "text-rose-600";
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  const handleUpdate = async (updatedGoal) => {
    try {
      await onUpdate(updatedGoal);
      setShowEditModal(false);
      if (refreshGoals) {
        await refreshGoals();
      }
    } catch (error) {
      toast.error("Failed to update goal. Please try again.");
      console.error("Failed to update goal:", error);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl border p-6 ${
          isExpired
            ? "border-gray-300 shadow-sm"
            : "border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        }`}
      >
        {/* Header with goal name and status */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target
                className={`w-5 h-5 ${
                  isExpired ? "text-gray-500" : "text-indigo-500"
                }`}
              />
              <h3
                className={`text-xl font-bold ${
                  isExpired ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {goal.name || "Unnamed Goal"}
              </h3>
            </div>
            {goal.description && (
              <p
                className={`text-sm ml-7 ${
                  isExpired ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {goal.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {status.text}
            </div>
            <div
              className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
              style={{
                backgroundColor: isExpired
                  ? "#9CA3AF"
                  : goal.color || "#6B7280",
                opacity: isExpired ? 0.7 : 1,
              }}
            />
          </div>
        </div>

        {/* Progress amounts */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <DollarSign
                className={`w-4 h-4 ${
                  isExpired ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <div
                className={`text-sm ${
                  isExpired ? "text-gray-500" : "text-gray-600"
                }`}
              >
                <span
                  className={`font-bold ${
                    isExpired ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  ₹{current.toLocaleString()}
                </span>
                <span className="mx-1">of</span>
                <span
                  className={`font-bold ${
                    isExpired ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  ₹{target.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  isExpired ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {progress.toFixed(0)}%
              </div>
              <div
                className={`text-xs ${
                  isExpired ? "text-gray-400" : "text-gray-500"
                }`}
              >
                complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Remaining amount */}
          <div className="flex justify-between items-center text-sm">
            <div className={isExpired ? "text-gray-500" : "text-gray-700"}>
              {remaining > 0 ? (
                <>
                  <span className="font-semibold">
                    ₹{remaining.toLocaleString()}
                  </span>{" "}
                  remaining
                </>
              ) : (
                <span
                  className={`font-semibold ${
                    isExpired ? "text-gray-600" : "text-teal-600"
                  }`}
                >
                  Goal achieved! 🎉
                </span>
              )}
            </div>
            <div
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                isExpired
                  ? "text-gray-500 bg-gray-100"
                  : "text-gray-500 bg-gray-100"
              }`}
            >
              {isExpired
                ? "Expired"
                : progress >= 100
                ? "Completed"
                : "In Progress"}
            </div>
          </div>
        </div>

        {/* Timeline and deadline */}
        <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4 mb-5">
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 ${
                isExpired ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span className={`font-medium ${getDaysRemainingColor()}`}>
              {isExpired
                ? "Expired"
                : daysRemaining !== null
                ? daysRemaining > 0
                  ? `${daysRemaining} day${
                      daysRemaining === 1 ? "" : "s"
                    } remaining`
                  : daysRemaining === 0
                  ? "Due today"
                  : "Deadline passed"
                : "No deadline set"}
            </span>
          </div>
          <div
            className={`flex items-center gap-1 ${
              isExpired ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{formattedDeadline}</span>
          </div>
        </div>

        {/* Action buttons - only show if not expired */}
        {!isExpired && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 hover:border-indigo-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => onDelete?.(goal)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 hover:border-rose-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-20"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}

        {/* Expired message */}
        {isExpired && (
          <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 rounded-lg">
            This goal has expired and can no longer be modified
          </div>
        )}
      </div>

      {/* Edit Goal Modal */}
      {showEditModal && (
        <AddGoalModal
          setShowGoalModal={setShowEditModal}
          editingGoal={goal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdate}
          refreshGoals={refreshGoals}
        />
      )}
    </>
  );
};

export default GoalCard;
