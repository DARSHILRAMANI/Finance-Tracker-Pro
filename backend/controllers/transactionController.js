const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const { updateBudgetSpent, updateGoalCurrent } = require("../utils/helpers");

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// const createTransaction = async (req, res, next) => {
//   try {
//     const { type, amount, category, description, date, tags, goalId } =
//       req.body;

//     if (!type || !amount || !category || !description || !date) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided" });
//     }

//     if (!["income", "expense", "savings"].includes(type)) {
//       return res.status(400).json({ message: "Invalid transaction type" });
//     }

//     if (amount <= 0) {
//       return res.status(400).json({ message: "Amount must be positive" });
//     }

//     if (
//       type === "savings" &&
//       goalId &&
//       !(await Goal.findOne({ _id: goalId, user: req.user.id }))
//     ) {
//       return res.status(400).json({ message: "Invalid goal ID" });
//     }

//     const transactionDate = new Date(date);
//     const transaction = new Transaction({
//       user: req.user.id,
//       type,
//       amount,
//       category,
//       description,
//       date: transactionDate,
//       tags: tags || [],
//       goalId: type === "savings" ? goalId || null : null,
//     });

//     await transaction.save();

//     if (type === "expense") {
//       await updateBudgetSpent(
//         req.user.id,
//         category,
//         amount,
//         transactionDate,
//         "add"
//       );
//     } else if (type === "savings" && goalId) {
//       await updateGoalCurrent(req.user.id, goalId, amount, "add");
//     }

//     res.status(201).json(transaction);
//   } catch (error) {
//     next(error);
//   }
// };
// const createTransaction = async (req, res, next) => {
//   try {
//     console.log("📥 Incoming request body:", req.body);
//     console.log("👤 Authenticated user ID:", req.user?.id);

//     const { type, amount, category, description, date, tags, goalId } =
//       req.body;

//     if (!type || !amount || !category || !description || !date) {
//       console.log("❌ Missing required fields");
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided" });
//     }

//     if (!["income", "expense", "savings"].includes(type)) {
//       console.log("❌ Invalid type:", type);
//       return res.status(400).json({ message: "Invalid transaction type" });
//     }

//     if (amount <= 0) {
//       console.log("❌ Invalid amount:", amount);
//       return res.status(400).json({ message: "Amount must be positive" });
//     }

//     if (type === "savings" && goalId) {
//       console.log("🔍 Checking goal for ID:", goalId);

//       const goal = await Goal.findOne({ _id: goalId, user: req.user.id });
//       if (!goal) {
//         console.log("❌ Goal not found or doesn't belong to user");
//         return res.status(400).json({ message: "Invalid goal ID" });
//       }

//       console.log("✅ Goal found:", goal);
//     }

//     const transactionDate = new Date(date);
//     console.log("🕒 Parsed transaction date:", transactionDate);

//     const transaction = new Transaction({
//       user: req.user.id,
//       type,
//       amount,
//       category,
//       description,
//       date: transactionDate,
//       tags: tags || [],
//       goalId: type === "savings" ? goalId || null : null,
//     });

//     console.log("💾 Saving transaction:", transaction);
//     await transaction.save();
//     console.log("✅ Transaction saved:", transaction._id);

//     if (type === "expense") {
//       console.log("📊 Updating budget spent...");
//       await updateBudgetSpent(
//         req.user.id,
//         category,
//         amount,
//         transactionDate,
//         "add"
//       );
//       console.log("✅ Budget updated");
//     } else if (type === "savings" && goalId) {
//       console.log("🎯 Updating goal current amount...");
//       await updateGoalCurrent(req.user.id, goalId, amount, "add");
//       console.log("✅ Goal updated");
//     }

//     res.status(201).json(transaction);
//   } catch (error) {
//     console.error("❗ Error in createTransaction:", error);
//     next(error);
//   }
// };
const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date, tags, goalId } =
      req.body;

    if (!type || !amount || !category || !description || !date) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (!["income", "expense", "savings"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    if (type === "savings" && goalId) {
      const goal = await Goal.findOne({ _id: goalId, user: req.user.id });
      if (!goal) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
    }

    const transactionDate = new Date(date);

    const transaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: transactionDate,
      tags: tags || [],
      goalId: type === "savings" ? goalId || null : null,
    });

    await transaction.save();

    if (type === "expense") {
      await updateBudgetSpent(
        req.user.id,
        category,
        amount,
        transactionDate,
        "add"
      );
    } else if (type === "savings" && goalId) {
      await updateGoalCurrent(req.user.id, goalId, amount, "add");
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error("❗ Error in createTransaction:", error);
    next(error);
  }
};
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date, tags, goalId } =
      req.body;

    const oldTransaction = await Transaction.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!oldTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Revert old transaction effects
    if (oldTransaction.type === "expense") {
      await updateBudgetSpent(
        req.user.id,
        oldTransaction.category,
        oldTransaction.amount,
        oldTransaction.date,
        "subtract"
      );
    } else if (oldTransaction.type === "savings" && oldTransaction.goalId) {
      await updateGoalCurrent(
        req.user.id,
        oldTransaction.goalId,
        oldTransaction.amount,
        "subtract"
      );
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        type,
        amount,
        category,
        description,
        date: new Date(date),
        tags,
        goalId,
      },
      { new: true, runValidators: true }
    );

    // Apply new transaction effects
    if (type === "expense") {
      await updateBudgetSpent(
        req.user.id,
        category,
        amount,
        new Date(date),
        "add"
      );
    } else if (type === "savings" && goalId) {
      await updateGoalCurrent(req.user.id, goalId, amount, "add");
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    console.log("Deleting transaction...", req.params);
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.type === "expense") {
      await updateBudgetSpent(
        req.user.id,
        transaction.category,
        transaction.amount,
        transaction.date,
        "subtract"
      );
    } else if (transaction.type === "savings" && transaction.goalId) {
      await updateGoalCurrent(
        req.user.id,
        transaction.goalId,
        transaction.amount,
        "subtract"
      );
    }

    await Transaction.deleteOne({ _id: id });
    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
