const moment = require("moment");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
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

// Helper function to check budget limits and create notifications
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

// Helper function to check goal progress and create notifications
const checkGoalProgress = async (
  userId,
  goalName,
  currentAmount,
  targetAmount
) => {
  try {
    if (!targetAmount || targetAmount <= 0) {
      return false;
    }

    const percentage = (currentAmount / targetAmount) * 100;
    const remaining = targetAmount - currentAmount;

    // Create appropriate notifications based on goal progress
    if (percentage >= 100) {
      await createNotification(
        userId,
        "success",
        `🎉 Goal Achieved: ${goalName} is complete! You've saved ₹${currentAmount} (${percentage.toFixed(
          1
        )}%)`
      );
    } else if (percentage >= 75) {
      await createNotification(
        userId,
        "success",
        `🎯 Goal Progress: ${goalName} is at ${percentage.toFixed(
          1
        )}% (₹${currentAmount} of ₹${targetAmount}). Only ₹${remaining.toFixed(
          2
        )} remaining!`
      );
    } else if (percentage >= 50) {
      await createNotification(
        userId,
        "info",
        `📈 Goal Update: ${goalName} is halfway there! ${percentage.toFixed(
          1
        )}% complete (₹${currentAmount} of ₹${targetAmount})`
      );
    } else if (percentage >= 25) {
      await createNotification(
        userId,
        "info",
        `💰 Goal Progress: ${goalName} is at ${percentage.toFixed(
          1
        )}% (₹${currentAmount} of ₹${targetAmount}). Keep going!`
      );
    }

    return true;
  } catch (error) {
    console.error("Error checking goal progress:", error);
    return false;
  }
};

const updateBudgetSpent = async (
  userId,
  category,
  amount,
  transactionDate,
  operation = "add"
) => {
  try {
    const startOfMonth = moment(transactionDate).startOf("month").toDate();
    const endOfMonth = moment(transactionDate).endOf("month").toDate();

    const budget = await Budget.findOne({
      user: userId,
      category: { $regex: `^${category}$`, $options: "i" },
    });

    if (
      budget &&
      transactionDate >= startOfMonth &&
      transactionDate <= endOfMonth
    ) {
      const oldSpent = budget.spent;

      if (operation === "add") {
        budget.spent += amount;

        // Create notification for spending
        await createNotification(
          userId,
          "info",
          `💳 Expense Added: ₹${amount} spent on ${category}. Total spent: ₹${budget.spent}`
        );
      } else if (operation === "subtract") {
        budget.spent = Math.max(0, budget.spent - amount);

        // Create notification for spending reduction
        await createNotification(
          userId,
          "info",
          `↩️ Expense Removed: ₹${amount} removed from ${category}. Total spent: ₹${budget.spent}`
        );
      }

      await budget.save();
      console.log(`Updated budget for ${category}: spent = ${budget.spent}`);

      // Check budget limits after updating
      await checkBudgetLimit(userId, category, budget.spent, budget.budgeted);
    } else {
      console.log(
        `No budget found for ${category} or date outside current month`
      );

      // Notify user if no budget exists for this category
      if (!budget) {
        await createNotification(
          userId,
          "warning",
          `⚠️ No Budget Set: You spent ₹${amount} on ${category} but no budget exists for this category`
        );
      }
    }
  } catch (error) {
    console.error("Error updating budget spent:", error);

    // Create error notification
    await createNotification(
      userId,
      "error",
      `❌ Error updating budget for ${category}. Please try again.`
    );
  }
};

const updateGoalCurrent = async (userId, goalId, amount, operation = "add") => {
  try {
    if (!goalId) return;

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (goal) {
      const oldCurrent = goal.current;

      if (operation === "add") {
        goal.current += amount;

        // Create notification for goal contribution
        await createNotification(
          userId,
          "success",
          `🎯 Goal Contribution: ₹${amount} added to ${goal.name}. Progress: ₹${goal.current} of ₹${goal.target}`
        );
      } else if (operation === "subtract") {
        goal.current = Math.max(0, goal.current - amount);

        // Create notification for goal withdrawal
        await createNotification(
          userId,
          "warning",
          `⬇️ Goal Withdrawal: ₹${amount} removed from ${goal.name}. Progress: ₹${goal.current} of ₹${goal.target}`
        );
      }

      await goal.save();
      console.log(`Updated goal ${goal.name}: current = ${goal.current}`);

      // Check goal progress after updating
      await checkGoalProgress(userId, goal.name, goal.current, goal.target);
    } else {
      console.log(`No goal found for goalId ${goalId}`);

      // Notify user if goal not found
      await createNotification(
        userId,
        "error",
        `❌ Goal not found. Unable to update goal progress.`
      );
    }
  } catch (error) {
    console.error("Error updating goal current:", error);

    // Create error notification
    await createNotification(
      userId,
      "error",
      `❌ Error updating goal progress. Please try again.`
    );
  }
};

module.exports = {
  updateBudgetSpent,
  updateGoalCurrent,
  createNotification,
};
