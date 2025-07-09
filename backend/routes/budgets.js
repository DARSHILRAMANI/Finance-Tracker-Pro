const express = require("express");
const auth = require("../middleware/auth");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all budgets for authenticated user
// @access  Private
router.get("/", auth, getBudgets);

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post("/", auth, createBudget);

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put("/:id", auth, updateBudget);

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete("/:id", auth, deleteBudget);

module.exports = router;
