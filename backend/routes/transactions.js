const express = require("express");
const auth = require("../middleware/auth");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions for authenticated user
// @access  Private
router.get("/", auth, getTransactions);

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post("/", auth, createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put("/:id", auth, updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete("/:id", auth, deleteTransaction);

module.exports = router;
