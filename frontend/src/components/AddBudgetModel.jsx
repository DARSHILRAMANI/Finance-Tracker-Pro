import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { categories } from "../data/initialData";
import { Calendar, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AddBudgetModal = ({
  setShowBudgetModal,
  editingBudget,
  refreshBudgets,
  onClose,
  onSubmit,
}) => {
  const { token, backendUrl } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    category: "",
    budgeted: "",
    spent: "0",
    deadline: "",
    color: "#3B82F6",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with editing data if provided
  useEffect(() => {
    console.log(editingBudget);
    if (editingBudget) {
      setFormData({
        category: editingBudget.category || "",
        budgeted: editingBudget.budgeted?.toString() || "",
        spent: editingBudget.spent?.toString() || "0",
        deadline: editingBudget.deadline
          ? new Date(editingBudget.deadline).toISOString().split("T")[0]
          : "",
        color: editingBudget.color || "#3B82F6",
      });
    }
  }, [editingBudget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to fetch all budgets from backend
  const fetchAllBudgets = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching budgets:", err);
      toast.error("Failed to fetch budgets");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!formData.category || !formData.budgeted || !formData.deadline) {
      setError("Category, budgeted amount, and deadline are required");
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(formData.budgeted) <= 0) {
      setError("Budgeted amount must be positive");
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(formData.spent) < 0) {
      setError("Spent amount cannot be negative");
      setIsSubmitting(false);
      return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      setError("Color must be a valid hex code (e.g., #3B82F6)");
      setIsSubmitting(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(formData.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      setError("Deadline cannot be in the past");
      setIsSubmitting(false);
      return;
    }

    try {
      // Only check for duplicates when adding a new budget (not editing)
      if (!editingBudget) {
        // Step 1: Fetch all budgets from backend
        const allBudgets = await fetchAllBudgets();

        // Step 2: Check for duplicate budgets with active (future) deadlines
        const duplicateActiveBudget = allBudgets.find((budget) => {
          // Compare budget category with user input
          if (budget.category !== formData.category) return false;

          const budgetDeadline = new Date(budget.deadline);
          budgetDeadline.setHours(0, 0, 0, 0); // Reset time to start of day

          // Return true if deadline is today or in the future (active budget)
          // If deadline has passed (< today), returns false - allows new budget creation
          return budgetDeadline >= today;
        });

        // Step 3: Block creation if duplicate active budget found
        if (duplicateActiveBudget) {
          const deadlineDate = new Date(
            duplicateActiveBudget.deadline
          ).toLocaleDateString();
          setError(
            `A budget for "${formData.category}" already exists with an active deadline (${deadlineDate}). You can only create a new budget for this category after the current one expires.`
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Step 4: If no duplicate active budget (or editing existing), proceed to create/update budget
      const budgetData = {
        category: formData.category,
        budgeted: parseFloat(formData.budgeted),
        spent: parseFloat(formData.spent),
        deadline: formData.deadline,
        color: formData.color,
      };

      if (editingBudget) {
        const updatePromise = axios.put(
          `${backendUrl}/api/budgets/${editingBudget._id}`,
          budgetData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await toast.promise(updatePromise, {
          loading: "Updating budget...",
          success: "Budget updated successfully!",
          error: "Failed to update budget",
        });
      } else {
        const createPromise = axios.post(
          `${backendUrl}/api/budgets`,
          budgetData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await toast.promise(createPromise, {
          loading: "Creating budget...",
          success: "Budget created successfully!",
          error: "Failed to create budget",
        });
      }

      // Step 5: Refresh budgets and close modal
      await refreshBudgets();
      const closeFunction = onClose || (() => setShowBudgetModal(false));
      closeFunction();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        `Failed to ${editingBudget ? "update" : "add"} budget`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Budget error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-900">
            {editingBudget ? "Edit Budget" : "Add Budget"}
          </h3>
          <button
            onClick={onClose || (() => setShowBudgetModal(false))}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budgeted Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  name="budgeted"
                  value={formData.budgeted}
                  onChange={handleChange}
                  className="pl-8 w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Spent Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  name="spent"
                  value={formData.spent}
                  onChange={handleChange}
                  className="pl-8 w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline
            </label>
            <div className="relative">
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12 font-medium"
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Calendar size={18} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Theme
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-12 w-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
                required
              />
              <div className="flex-1">
                <span className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
                  {formData.color.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end space-x-3 border-t">
            <button
              type="button"
              onClick={onClose || (() => setShowBudgetModal(false))}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center justify-center min-w-[140px] shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Processing...
                </>
              ) : editingBudget ? (
                "Update Budget"
              ) : (
                "Add Budget"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
