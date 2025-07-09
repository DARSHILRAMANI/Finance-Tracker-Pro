const express = require("express");
const auth = require("../middleware/auth");
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

const router = express.Router();

// @route   GET /api/goals
// @desc    Get all goals for authenticated user
// @access  Private
router.get("/", auth, getGoals);

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post("/", auth, createGoal);

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put("/:id", auth, updateGoal);

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete("/:id", auth, deleteGoal);

module.exports = router;
