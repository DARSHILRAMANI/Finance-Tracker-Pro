const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { type, message, time } = req.body;

    if (!type || !message || !time) {
      return res
        .status(400)
        .json({ message: "Type, message, and time are required" });
    }

    if (!["warning", "success", "info"].includes(type)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    const notification = new Notification({
      user: req.user.id,
      type,
      message,
      time,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  console.log("Deleting single notification for user:", req.user.id);
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

const markAsReadNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming auth middleware sets this

    const result = await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const deleteAllNotifications = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     const result = await Notification.deleteMany({ user: userId });

//     res.status(200).json({
//       message: "All notifications deleted",
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("Error deleting all notifications:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const deleteAllNotifications = async (req, res) => {
  try {
    // Use the correct syntax for newer Mongoose versions
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Make sure the field name matches your schema
    const result = await Notification.deleteMany({ user: userId });

    res.status(200).json({
      message: "All notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete error:", error); // Enable this to see the actual error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
  markAsReadNotification,
  markAllNotificationsAsRead,
  deleteAllNotifications,
};
