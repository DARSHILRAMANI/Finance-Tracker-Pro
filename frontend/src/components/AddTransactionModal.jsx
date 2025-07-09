import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { categories } from "../data/initialData";
import { Calendar, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AddTransactionModal = ({
  setTransactions,
  setShowAddTransaction,
  editingTransaction,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { token, backendUrl } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    goalId: null,
  });

  const [goals, setGoals] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with editing data if provided
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type || "expense",
        amount: editingTransaction.amount?.toString() || "",
        category: editingTransaction.category || "",
        description: editingTransaction.description || "",
        date: editingTransaction.date
          ? new Date(editingTransaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        tags: editingTransaction.tags?.join(", ") || "",
        goalId: editingTransaction.goalId || null,
      });
    }
  }, [editingTransaction]);

  // Fetch goals when component mounts
  const fetchGoals = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch goals. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Goal fetch error:", err);
    } finally {
      setIsLoadingGoals(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Helper to get active goal id for selected category
  const getActiveGoalIdForCategory = useCallback(
    (category) => {
      if (!category) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeGoal = goals.find((goal) => {
        if (goal.name !== category) return false;

        const deadline = new Date(goal.deadline);
        deadline.setHours(0, 0, 0, 0);

        return deadline >= today;
      });

      const activeGoalsCount = goals.filter(
        (goal) =>
          goal.name === category &&
          new Date(goal.deadline).setHours(0, 0, 0, 0) >= today
      ).length;

      if (activeGoalsCount > 1) {
        toast.warn(
          `Multiple active goals found for category "${category}". Using the first one.`
        );
      }

      return activeGoal ? activeGoal._id : null;
    },
    [goals]
  );

  // When category changes, update category and goalId
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const activeGoalId = getActiveGoalIdForCategory(selectedCategory);

    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      goalId: activeGoalId,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.amount || !formData.category) {
      const errorMsg = "Amount and category are required";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        goalId: formData.goalId || null,
      };

      await onSubmit(transactionData);

      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to process transaction. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Transaction error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-8 w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoadingGoals}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {isLoadingGoals && (
              <p className="mt-1 text-xs text-gray-500">
                Loading categories...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="food, shopping, etc."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Calendar size={16} />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[120px]"
              disabled={isSubmitting || isLoadingGoals}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Processing...
                </>
              ) : editingTransaction ? (
                "Update"
              ) : (
                "Add Transaction"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
