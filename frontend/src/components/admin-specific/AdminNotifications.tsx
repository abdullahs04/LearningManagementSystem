import { useState } from "react";
import {
  Bell,
  UserPlus,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
} from "lucide-react";

type NotificationType = "info" | "warning" | "success" | "error";

type NotificationProps = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

function NotificationItem({
  id,
  type,
  title,
  message,
  timestamp,
  read,
}: NotificationProps) {
  const [isRead, setIsRead] = useState(read);

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRead(true);
    // Here you would typically call an API to mark as read
  };

  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="text-blue-500" size={20} />;
      case "warning":
        return <AlertTriangle className="text-orange-500" size={20} />;
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "error":
        return <AlertTriangle className="text-red-500" size={20} />;
    }
  };

  const getBgColor = () => {
    return isRead ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-gray-700";
  };

  return (
    <div
      className={`${getBgColor()} border border-gray-100 dark:border-gray-700 rounded-lg p-4 mb-3 shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="mr-3">{getIcon()}</div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {message}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} className="mr-1" />
              {timestamp}
            </div>
          </div>
        </div>
        {!isRead && (
          <button
            onClick={handleMarkAsRead}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
          >
            <X size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminNotifications() {
  const notifications = [
    {
      id: "notif-1",
      type: "info" as NotificationType,
      title: "New User Registration",
      message: "5 new students have registered in the last 24 hours.",
      timestamp: "Just now",
      read: false,
    },
    {
      id: "notif-2",
      type: "warning" as NotificationType,
      title: "Course Capacity Alert",
      message: "CS101 is nearing maximum capacity with 45/50 students enrolled.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "notif-3",
      type: "success" as NotificationType,
      title: "Database Backup Complete",
      message: "Weekly system backup completed successfully.",
      timestamp: "5 hours ago",
      read: true,
    },
    {
      id: "notif-4",
      type: "error" as NotificationType,
      title: "System Error",
      message: "Error processing grade submissions for MATH201.",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "notif-5",
      type: "info" as NotificationType,
      title: "Upcoming Maintenance",
      message: "System maintenance scheduled for Saturday, 10 PM - 2 AM.",
      timestamp: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <Bell className="mr-2 text-blue-500" size={20} />
          Notifications
        </h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} {...notif} />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button className="w-full py-2 text-sm text-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          View all notifications
        </button>
      </div>
    </div>
  );
}
