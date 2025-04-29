import React from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Clock, CheckCircle, AlertCircle, FileText, LogIn, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function ActivityItem({ activity }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    switch (activity.type) {
      case "enrollment":
      case "course_creation":
        navigate(`/courses/${activity.entityId}`);
        break;
      case "submission":
      case "grade_update":
        navigate(`/assignments/${activity.entityId}`);
        break;
      case "user_registration":
      case "login":
        navigate(`/users/${activity.user.id}`);
        break;
      default:
        break;
    }
  };

  const getIcon = () => {
    switch (activity.type) {
      case "login":
        return <LogIn className="text-blue-500" />;
      case "enrollment":
        return <BookOpen className="text-green-500" />;
      case "submission":
        return <FileText className="text-yellow-500" />;
      case "course_creation":
        return <BookOpen className="text-purple-500" />;
      case "user_registration":
        return <User className="text-teal-500" />;
      case "grade_update":
        return <CheckCircle className="text-orange-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{activity.user.name}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
        {activity.entityName && (
          <div className="mt-1 flex items-center">
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
              {activity.entityName}
            </span>
          </div>
        )}
      </div>
      {activity.status && (
        <div className={`ml-2 ${activity.status === "success" ? "text-green-500" : activity.status === "failed" ? "text-red-500" : "text-yellow-500"}`}>
          {activity.status === "success" ? <CheckCircle size={16} /> : 
           activity.status === "failed" ? <AlertCircle size={16} /> :
           <Clock size={16} />}
        </div>
      )}
    </div>
  );
}

export default function RecentActivities() {
  // Sample recent activities data
  const activities = [
    {
      id: "act-1",
      type: "login",
      user: { id: "user-1", name: "John Smith", role: "admin" },
      description: "Logged in to the system",
      timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      status: "success"
    },
    {
      id: "act-2",
      type: "enrollment",
      user: { id: "user-2", name: "Emily Johnson", role: "student" },
      description: "Enrolled in a new course",
      timestamp: new Date(Date.now() - 35 * 60000), // 35 minutes ago
      entityId: "course-3",
      entityName: "PHY150 - Physics for Engineers",
      status: "success"
    },
    {
      id: "act-3",
      type: "submission",
      user: { id: "user-3", name: "Michael Brown", role: "student" },
      description: "Submitted an assignment",
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      entityId: "assignment-5",
      entityName: "Week 3 Problem Set - MATH201",
      status: "success"
    },
    {
      id: "act-4",
      type: "course_creation",
      user: { id: "user-4", name: "Dr. Lisa Wilson", role: "instructor" },
      description: "Created a new course",
      timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
      entityId: "course-7",
      entityName: "CS301 - Data Structures and Algorithms",
      status: "success"
    },
    {
      id: "act-5",
      type: "user_registration",
      user: { id: "user-5", name: "Alex Rodriguez", role: "student" },
      description: "Registered a new account",
      timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
      status: "pending"
    },
    {
      id: "act-6",
      type: "grade_update",
      user: { id: "user-6", name: "Prof. Robert Chen", role: "instructor" },
      description: "Updated grades for 28 students",
      timestamp: new Date(Date.now() - 28 * 3600000), // 28 hours ago
      entityId: "assignment-3",
      entityName: "Midterm Exam - BIO110",
      status: "success"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Clock size={18} className="mr-2 text-blue-500" /> Recent Activities
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View All
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}