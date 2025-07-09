import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import moment from "moment";
import BudgetCard from "./BudgetCard";
import BudgetVsActualChart from "./BudgetVsActualChart";
import AddBudgetModal from "./AddBudgetModel";
import { useCallback } from "react";
import { toast } from "react-toastify"; // Updated import for toast notifications

const Budgets = () => {
  const { token, backendUrl } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const refreshBudgets = useCallback(async () => {
    if (!token) {
      setError("Please log in to view budgets");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${backendUrl}/api/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBudgets(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load budgets");
      console.error("Error fetching budgets:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteBudget = async (budget) => {
    try {
      await axios.delete(`${backendUrl}/api/budgets/${budget._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshBudgets();
      toast.success("Budget deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting budget");
      console.error(
        "Error deleting budget:",
        error.response?.data || error.message
      );
    }
  };

  const updateBudget = (budget) => {
    setEditingBudget(budget);
    setShowAddBudget(true);
  };

  useEffect(() => {
    refreshBudgets();
  }, [token]);

  const activeBudgets = budgets.filter((budget) => {
    if (!budget || !budget.deadline) return false;
    const deadlineDate = moment(budget.deadline);
    if (!deadlineDate.isValid()) return false;
    const expirationDate = moment(deadlineDate).add(2, "days").startOf("day");
    const today = moment().startOf("day");
    return today.isSameOrBefore(expirationDate, "day");
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-sm sm:text-base">
            Loading budgets...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={refreshBudgets}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Budgets</h2>
        <button
          onClick={() => {
            setEditingBudget(null);
            setShowAddBudget(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:px-6 rounded-xl shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm sm:text-base w-full sm:w-auto"
        >
          + Add Budget
        </button>
      </div>

      {activeBudgets.length === 0 ? (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            No active budgets. Add a budget to get started!
          </p>
          {budgets.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              You have {budgets.length} total budget(s), but none are currently
              active.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {activeBudgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                refreshBudgets={refreshBudgets}
                onUpdate={updateBudget}
                onDelete={deleteBudget}
              />
            ))}
          </div>
          <div className="mt-6">
            <BudgetVsActualChart budgets={activeBudgets} />
          </div>
        </>
      )}

      {showAddBudget && (
        <AddBudgetModal
          setShowBudgetModal={setShowAddBudget}
          editingBudget={editingBudget}
          refreshBudgets={refreshBudgets}
          onClose={() => {
            setShowAddBudget(false);
            setEditingBudget(null);
          }}
        />
      )}
    </div>
  );
};

export default Budgets;
