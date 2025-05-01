import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";

import { Bell, CheckCircle, Clock } from "lucide-react";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const [notifications, setNotifications] = useState([]);

  // Fetch user info
  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      if (!user?.email) return null; // Prevent unnecessary API call
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email, // Ensures query runs only when email is available
  });

  // Function to load unread notifications
  const loadUnreadNotifications = async (userId) => {
    const res = await axiosBase.get(`/notifications/unread/${userId}`);
    return res.data.notifications;
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      if (!userInfo?._id) return;

      // await axiosBase.put(`/notifications/mark-read/${notificationId}`)

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      if (!userInfo?._id) return;

      // await axiosBase.put(`/notifications/mark-all-read/${userInfo._id}`)

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Function to format date in a more readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Fetch unread notifications when userInfo is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userInfo?._id) {
        const loadedNotifications = await loadUnreadNotifications(userInfo._id);
        setNotifications(loadedNotifications);
      }
    };

    fetchNotifications();
  }, [userInfo]);

  if (isLoading) {
    return (
      <div className="w-[350px] absolute top-12 -right-4 bg-white rounded-lg shadow-lg animate-pulse">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center text-lg font-bold">
            <Bell className="mr-2 h-5 w-5" />
            Loading notifications...
          </div>
        </div>
        <div className="h-[200px] flex items-center justify-center">
          <Clock className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[350px] absolute top-14 -right-[90px] bg-white rounded-lg shadow-lg max-h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-100 text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        <div className="p-4">
          {notifications.length > 0 ? (
            <div className="space-y-0">
              {notifications.map((notification, index) => (
                <div key={notification._id}>
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div
                        className={`h-2 w-2 rounded-full absolute -left-1 ${
                          notification.isRead ? "bg-gray-300" : "bg-green-500"
                        }`}
                      />
                      <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-1 text-gray-500">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && (
                    <div className="h-px bg-gray-100 my-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium">All caught up!</h3>
              <p className="text-sm text-gray-500 mt-1">
                You have no new notifications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
