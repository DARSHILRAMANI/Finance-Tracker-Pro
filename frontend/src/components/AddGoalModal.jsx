import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Calendar, X, Loader2 } from "lucide-react";
import { categories } from "../data/initialData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddGoalModal = ({
  setShowGoalModal,
  editingGoal,
  refreshGoals,
  onClose,
  onSubmit,
}) => {
  const { token, backendUrl } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "0",
    deadline: "",
    color: "#FF6B6B",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with editing data if provided
  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name || "",
        target: editingGoal.target?.toString() || "",
        current: editingGoal.current?.toString() || "0",
        deadline: editingGoal.deadline
          ? new Date(editingGoal.deadline).toISOString().split("T")[0]
          : "",
        color: editingGoal.color || "#FF6B6B",
      });
    }
  }, [editingGoal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (setShowGoalModal) {
      setShowGoalModal(false);
    }
  };

  const fetchAllGoals = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching goals:", err);
      toast.error("Failed to fetch goals. Please try again.");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validation
    if (!formData.name || !formData.target || !formData.deadline) {
      setError("Name, target amount, and deadline are required");
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(formData.target) <= 0) {
      setError("Target amount must be positive");
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(formData.current) < 0) {
      setError("Current amount cannot be negative");
      setIsSubmitting(false);
      return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      setError("Color must be a valid hex code (e.g., #FF6B6B)");
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
      if (!editingGoal) {
        const allGoals = await fetchAllGoals();
        const duplicateActiveGoal = allGoals.find((goal) => {
          if (goal.name !== formData.name) return false;
          const goalDeadline = new Date(goal.deadline);
          goalDeadline.setHours(0, 0, 0, 0);
          return goalDeadline >= today;
        });

        if (duplicateActiveGoal) {
          const deadlineDate = new Date(
            duplicateActiveGoal.deadline
          ).toLocaleDateString();
          setError(
            `A goal for "${formData.name}" already exists with an active deadline (${deadlineDate}). You can only create a new goal for this category after the current one expires.`
          );
          setIsSubmitting(false);
          return;
        }
      }

      const goalData = {
        name: formData.name,
        target: parseFloat(formData.target),
        current: parseFloat(formData.current),
        deadline: formData.deadline,
        color: formData.color,
      };

      let promise;
      if (editingGoal) {
        promise = axios.put(
          `${backendUrl}/api/goals/${editingGoal._id}`,
          goalData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        promise = axios.post(`${backendUrl}/api/goals`, goalData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.promise(promise, {
        pending: editingGoal ? "Updating goal..." : "Creating goal...",
        success: {
          render() {
            return editingGoal
              ? "Goal updated successfully!"
              : "Goal created successfully!";
          },
          icon: "✅",
        },
        error: {
          render({ data }) {
            return (
              data?.response?.data?.message ||
              (editingGoal ? "Failed to update goal" : "Failed to create goal")
            );
          },
          icon: "❌",
        },
      });

      await promise;
      await refreshGoals();
      handleClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        `Failed to ${editingGoal ? "update" : "add"} goal`;
      setError(errorMessage);
      console.error("Goal error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-xl font-bold text-gray-900">
            {editingGoal ? "Edit Goal" : "Add Goal"}
          </h3>
          <button
            onClick={handleClose}
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
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
              required
            >
              <option value="">Select a category</option>
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
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  className="pl-8 w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  name="current"
                  value={formData.current}
                  onChange={handleChange}
                  className="pl-8 w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
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
                className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 pl-12 font-medium"
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
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium flex items-center justify-center min-w-[140px] shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Processing...
                </>
              ) : editingGoal ? (
                "Update Goal"
              ) : (
                "Add Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
