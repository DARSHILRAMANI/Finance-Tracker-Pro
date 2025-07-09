const moment = require("moment");
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

// Helper function to check goal progress and create notifications
const checkGoalProgress = async (
  userId,
  goalName,
  currentAmount,
  targetAmount,
  deadline
) => {
  try {
    if (!targetAmount || targetAmount <= 0) {
      return false;
    }

    const percentage = (currentAmount / targetAmount) * 100;
    const remaining = targetAmount - currentAmount;
    const daysUntilDeadline = moment(deadline).diff(moment(), "days");

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

    // Check deadline warnings
    if (daysUntilDeadline <= 30 && daysUntilDeadline > 0 && percentage < 80) {
      await createNotification(
        userId,
        "warning",
        `⏰ Deadline Alert: ${goalName} has ${daysUntilDeadline} days left. Current progress: ${percentage.toFixed(
          1
        )}%`
      );
    } else if (daysUntilDeadline <= 0 && percentage < 100) {
      await createNotification(
        userId,
        "error",
        `⏰ Deadline Passed: ${goalName} deadline has passed. Current progress: ${percentage.toFixed(
          1
        )}%`
      );
    }

    return true;
  } catch (error) {
    console.error("Error checking goal progress:", error);
    return false;
  }
};

const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

const createGoal = async (req, res, next) => {
  try {
    const { name, target, current, deadline, color } = req.body;

    if (!name || !target || !deadline || !color) {
      return res
        .status(400)
        .json({ message: "Name, target, deadline, and color are required" });
    }

    if (parseFloat(target) <= 0) {
      return res
        .status(400)
        .json({ message: "Target amount must be positive" });
    }

    if (!moment(deadline, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid deadline date" });
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return res
        .status(400)
        .json({ message: "Color must be a valid hex code (e.g., #FF6B6B)" });
    }

    const goalDeadline = new Date(deadline);
    const currentAmount = parseFloat(current) || 0;
    const targetAmount = parseFloat(target);

    // Check if deadline is in the past
    if (moment(goalDeadline).isBefore(moment(), "day")) {
      return res
        .status(400)
        .json({ message: "Deadline cannot be in the past" });
    }

    const goal = new Goal({
      user: req.user.id,
      name,
      target: targetAmount,
      current: currentAmount,
      deadline: goalDeadline,
      color,
    });

    await goal.save();

    // Create notification for goal creation
    const daysUntilDeadline = moment(goalDeadline).diff(moment(), "days");
    await createNotification(
      req.user.id,
      "success",
      `🎯 Goal Created: ${name} with target of ₹${targetAmount}. Deadline: ${daysUntilDeadline} days from now`
    );

    // Check initial progress if current amount is provided
    if (currentAmount > 0) {
      await checkGoalProgress(
        req.user.id,
        name,
        currentAmount,
        targetAmount,
        goalDeadline
      );
    }

    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, target, current, deadline, color } = req.body;

    if (!name || !target || !deadline || !color) {
      return res
        .status(400)
        .json({ message: "Name, target, deadline, and color are required" });
    }

    if (parseFloat(target) <= 0) {
      return res
        .status(400)
        .json({ message: "Target amount must be positive" });
    }

    if (!moment(deadline, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid deadline date" });
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return res
        .status(400)
        .json({ message: "Color must be a valid hex code" });
    }

    // Get the old goal to compare changes
    const oldGoal = await Goal.findOne({ _id: id, user: req.user.id });

    if (!oldGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const goalDeadline = new Date(deadline);
    const currentAmount = parseFloat(current) || 0;
    const targetAmount = parseFloat(target);

    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        name,
        target: targetAmount,
        current: currentAmount,
        deadline: goalDeadline,
        color,
      },
      { new: true, runValidators: true }
    );

    // Create notification for goal update
    let notificationMessage = `📝 Goal Updated: ${name}`;
    let changes = [];

    if (oldGoal.name !== name) {
      changes.push(`Name changed from "${oldGoal.name}" to "${name}"`);
    }

    if (oldGoal.target !== targetAmount) {
      changes.push(
        `Target changed from ₹${oldGoal.target} to ₹${targetAmount}`
      );
    }

    if (oldGoal.current !== currentAmount) {
      changes.push(
        `Current amount changed from ₹${oldGoal.current} to ₹${currentAmount}`
      );
    }

    if (!moment(oldGoal.deadline).isSame(moment(goalDeadline), "day")) {
      changes.push(
        `Deadline changed from ${moment(oldGoal.deadline).format(
          "YYYY-MM-DD"
        )} to ${moment(goalDeadline).format("YYYY-MM-DD")}`
      );
    }

    if (changes.length > 0) {
      notificationMessage += ` - ${changes.join(", ")}`;
    }

    await createNotification(req.user.id, "info", notificationMessage);

    // Check goal progress after update
    if (currentAmount > 0) {
      await checkGoalProgress(
        req.user.id,
        name,
        currentAmount,
        targetAmount,
        goalDeadline
      );
    }

    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Create notification for goal deletion
    const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
    await createNotification(
      req.user.id,
      "warning",
      `🗑️ Goal Deleted: ${goal.name} (${percentage.toFixed(1)}% complete - ₹${
        goal.current
      } of ₹${goal.target})`
    );

    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
