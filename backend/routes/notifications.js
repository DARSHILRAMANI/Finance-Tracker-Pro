const express = require("express");
const auth = require("../middleware/auth");
const {
  getNotifications,
  createNotification,
  deleteNotification,
  markAsReadNotification,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const Notification = require("../models/Notification"); // Assuming you have a Notification model

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for authenticated user
// @access  Private
router.get("/", auth, getNotifications);

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
router.post("/", auth, createNotification);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private

router.delete("/all", auth, deleteAllNotifications);

router.delete("/:id", auth, deleteNotification);

router.patch("/mark-as-read/:id", auth, markAsReadNotification);

router.patch("/mark-all-read", auth, markAllNotificationsAsRead);

module.exports = router;
