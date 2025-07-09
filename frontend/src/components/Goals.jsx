import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import { Target } from "lucide-react";
import GoalCard from "./GoalCard";
import AddGoalModal from "./AddGoalModal";
import { toast } from "react-toastify";

const Goals = () => {
  const { token, backendUrl } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const refreshGoals = async () => {
    if (!token) {
      setError("Please log in to view goals");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load goals");
      setLoading(false);
    }
  };

  const deleteGoal = async (goal) => {
    try {
      await axios.delete(`${backendUrl}/api/goals/${goal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Goal deleted successfully");
      setGoals((prevGoals) => prevGoals.filter((g) => g._id !== goal._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting goal");
      console.error(
        "Error deleting goal:",
        error.response?.data || error.message
      );
    }
  };

  // const updateGoal = async (updatedGoal) => {
  //   // Placeholder for future goal update logic
  //   console.log("Update goal requested:", updatedGoal);
  // };
  const updateGoal = async (updatedGoal) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/goals/${updatedGoal._id}`,
        updatedGoal,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Goal updated successfully");
      const newGoal = response.data;

      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal._id === newGoal._id ? newGoal : goal))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating goal");
      console.error(
        "Error updating goal:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    refreshGoals();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600">Loading goals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const activeGoals = goals.filter((goal) => {
    if (!goal.deadline) return false;
    const deadline = moment(goal.deadline);
    const today = moment().startOf("day");
    const expirationDate = moment(deadline).add(2, "days");
    return today.isSameOrBefore(expirationDate, "day");
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Financial Goals
        </h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Target className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {activeGoals.length === 0 ? (
        <div className="bg-white p-4 sm:p-6 rounded-md border text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            No active goals. Add a goal to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
              refreshGoals={refreshGoals}
            />
          ))}
        </div>
      )}

      {showAddGoal && (
        <AddGoalModal
          setShowAddGoal={setShowAddGoal}
          refreshGoals={refreshGoals}
          onClose={() => {
            setShowAddGoal(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
};

export default Goals;
