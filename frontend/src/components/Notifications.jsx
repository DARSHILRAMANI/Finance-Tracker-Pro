import React, { useState, useEffect, useContext } from "react";
import { Bell, X, Trash2, Check, Clock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
const Notification = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const { token, backendUrl } = useContext(AuthContext);

  // Update local state when props change
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e) => {
    if (isOpen && !e.target.closest(".notification-container")) {
      setIsOpen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Remove from local state immediately for better UX
      setLocalNotifications((prev) => prev.filter((n) => n._id !== id));

      // Make API call
      const response = await fetch(`${backendUrl}/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Notification deleted successfully");
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
    } catch (error) {
      toast.error("Error deleting notification");
      console.error("Error deleting notification:", error);
      // Restore notification on error
      setLocalNotifications(notifications);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Update local state immediately
      setLocalNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );

      // Make API call
      const response = await fetch(
        `${backendUrl}/api/notifications/mark-as-read/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Notification marked as read");
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      toast.error("Error marking notification as read");
      console.error("Error marking notification as read:", error);
      // Restore original state on error
      setLocalNotifications(notifications);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Update local state immediately
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Make API call
      const response = await fetch(
        `${backendUrl}/api/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("All notifications marked as read");

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
    } catch (error) {
      toast.error("Error marking all notifications as read");
      console.error("Error marking all notifications as read:", error);
      setLocalNotifications(notifications);
    }
  };

  const handleClearAll = async () => {
    try {
      // Update local state immediately
      setLocalNotifications([]);

      // Make API call
      const response = await fetch(`${backendUrl}/api/notifications/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      toast.success("All notifications cleared");
      if (!response.ok) {
        throw new Error("Failed to clear all notifications");
      }
    } catch (error) {
      toast.error("Error clearing all notifications");
      console.error("Error clearing all notifications:", error);
      setLocalNotifications(notifications);
    }
  };

  const formatTimeAgo = (notification) => {
    const dateValue =
      notification.createdAt || notification.time || notification.date;
    if (!dateValue) return "No date";

    const notificationDate = new Date(dateValue);
    if (isNaN(notificationDate.getTime())) return "Invalid date";

    const now = new Date();
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return notificationDate.toLocaleDateString();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  return (
    <div className="relative notification-container">
      {/* Notification Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Action Buttons */}
            {localNotifications.length > 0 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Check className="h-4 w-4" />
                  <span>Mark all read</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {localNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {localNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {notification.title && (
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </h4>
                        )}
                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message || "No message"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification)}
                          </span>
                          {!notification.read && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification._id);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-gray-500">
                  You're all caught up! Check back later for new updates.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
