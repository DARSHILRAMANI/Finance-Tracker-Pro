const Budget = require("../models/Budget");
const Notification = require("../models/Notification");

// Helper function to create notifications
const createNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({
      user: userId,
      type: type,
      message: message,
      time: new Date().toLocaleString(),
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

// const createBudget = async (req, res, next) => {
//   try {
//     const { category, budgeted, color } = req.body;

//     if (!category || !budgeted || !color) {
//       return res
//         .status(400)
//         .json({ message: "Category, budgeted amount, and color are required" });
//     }

//     if (parseFloat(budgeted) <= 0) {
//       return res
//         .status(400)
//         .json({ message: "Budgeted amount must be positive" });
//     }

//     if (!/^#[0-9A-F]{6}$/i.test(color)) {
//       return res
//         .status(400)
//         .json({ message: "Color must be a valid hex code (e.g., #3B82F6)" });
//     }

//     const budget = new Budget({
//       user: req.user.id,
//       category,
//       budgeted: parseFloat(budgeted),
//       color,
//       spent: 0,
//     });

//     await budget.save();

//     // Create notification for budget creation
//     await createNotification(
//       req.user.id,
//       "success",
//       `Budget created successfully for ${category} with limit ₹${budgeted}`
//     );

//     res.status(201).json(budget);
//   } catch (error) {
//     next(error);
//   }
// };

const createBudget = async (req, res, next) => {
  try {
    const { category, budgeted, spent, deadline, color } = req.body;

    if (!category || !budgeted || !deadline || !color) {
      return res.status(400).json({
        message: "Category, budgeted amount, deadline, and color are required",
      });
    }

    if (parseFloat(budgeted) <= 0) {
      return res.status(400).json({
        message: "Budgeted amount must be positive",
      });
    }

    if (spent && parseFloat(spent) < 0) {
      return res.status(400).json({
        message: "Spent amount cannot be negative",
      });
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        message: "Color must be a valid hex code (e.g., #3B82F6)",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      return res.status(400).json({
        message: "Deadline cannot be in the past",
      });
    }

    const budget = new Budget({
      user: req.user.id,
      category,
      budgeted: parseFloat(budgeted),
      spent: spent ? parseFloat(spent) : 0,
      deadline,
      color,
    });

    await budget.save();

    await createNotification(
      req.user.id,
      "success",
      `Budget created successfully for ${category} with limit ₹${budgeted}`
    );

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};
const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Create notification for budget deletion
    await createNotification(
      req.user.id,
      "warning",
      `Budget deleted for ${budget.category} (₹${budget.budgeted})`
    );

    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, budgeted, color, spent, deadline } = req.body; // Added spent parameter

    if (!category || !budgeted || !color) {
      return res
        .status(400)
        .json({ message: "Category, budgeted amount, and color are required" });
    }

    if (budgeted <= 0) {
      return res
        .status(400)
        .json({ message: "Budgeted amount must be positive" });
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return res
        .status(400)
        .json({ message: "Color must be a valid hex code (e.g., #3B82F6)" });
    }

    // Get the old budget to compare changes
    const oldBudget = await Budget.findOne({ _id: id, user: req.user.id });

    if (!oldBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Prepare update data
    const updateData = {
      category,
      budgeted: parseFloat(budgeted),
      color,
      deadline, // Include deadline in the update
    };

    // If spent amount is provided, update it as well
    if (spent !== undefined && spent !== null) {
      updateData.spent = parseFloat(spent);
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Create notification for budget update
    let notificationMessage = `Budget updated for ${category}`;

    if (oldBudget.budgeted !== parseFloat(budgeted)) {
      notificationMessage += ` - Limit changed from ₹${oldBudget.budgeted} to ₹${budgeted}`;
    }

    if (oldBudget.category !== category) {
      notificationMessage += ` - Category changed from ${oldBudget.category} to ${category}`;
    }

    await createNotification(req.user.id, "info", notificationMessage);

    // Check budget limit ONLY when updating budget
    // This will check against the current spent amount (either existing or newly provided)
    const currentSpent =
      updateData.spent !== undefined ? updateData.spent : budget.spent;

    if (currentSpent > 0) {
      await checkBudgetLimit(
        req.user.id,
        budget.category,
        currentSpent,
        budget.budgeted
      );
    }

    res.status(200).json(budget);
  } catch (error) {
    next(error);
  }
};

// Enhanced budget limit checking - ONLY called from updateBudget
const checkBudgetLimit = async (
  userId,
  category,
  currentSpent,
  budgetedAmount
) => {
  try {
    if (!budgetedAmount || budgetedAmount <= 0) {
      return false;
    }

    const percentage = (currentSpent / budgetedAmount) * 100;
    const remaining = budgetedAmount - currentSpent;

    // Create appropriate notifications based on spending percentage
    if (percentage >= 100) {
      await createNotification(
        userId,
        "error",
        `🚨 Budget Exceeded: ${category} spending is ${percentage.toFixed(
          1
        )}% (₹${currentSpent} of ₹${budgetedAmount}). Over budget by ₹${Math.abs(
          remaining
        ).toFixed(2)}`
      );
    } else if (percentage >= 90) {
      await createNotification(
        userId,
        "warning",
        `⚠️ Budget Alert: ${category} spending is at ${percentage.toFixed(
          1
        )}% (₹${currentSpent} of ₹${budgetedAmount}). Only ₹${remaining.toFixed(
          2
        )} remaining`
      );
    } else if (percentage >= 75) {
      await createNotification(
        userId,
        "info",
        `📊 Budget Update: ${category} spending is at ${percentage.toFixed(
          1
        )}% (₹${currentSpent} of ₹${budgetedAmount}). ₹${remaining.toFixed(
          2
        )} remaining`
      );
    }

    return true;
  } catch (error) {
    console.error("Error checking budget limit:", error);
    return false;
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  // checkBudgetLimit is now internal to updateBudget only - not exported
};
