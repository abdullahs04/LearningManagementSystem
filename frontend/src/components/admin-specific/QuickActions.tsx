import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  UserPlus,
  FilePlus,
  Bell,
} from "lucide-react";

type ActionCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  path: string;
};

// TODO add respective feilds


function ActionCard({
  title,
  description,
  icon,
  bgColor,
  path,
}: ActionCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(path);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
    >
      <div className={`${bgColor} h-2 w-full`}></div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div
            className={`p-3 rounded-lg ${bgColor.replace(
              "bg-",
              "bg-opacity-20 text-"
            )}`}
          >
            {icon}
          </div>
          <h3 className="ml-3 text-lg font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>

        <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
          Go to {title}
        </button>
      </div>
    </div>
  );
}

export default function QuickActions() {
  const actions = [
    {
      id: "manage-courses",
      title: "Manage Courses",
      description: "Add, edit, or delete courses and manage course materials",
      icon: <BookOpen size={24} />,
      bgColor: "bg-blue-500",
      path: "/admin/courses",
    },
    {
      id: "manage-users",
      title: "Manage Users",
      description: "View, add, edit user accounts and manage permissions",
      icon: <Users size={24} />,
      bgColor: "bg-purple-500",
      path: "/admin/users",
    },
    {
      id: "reports",
      title: "Analytics & Reports",
      description: "View system statistics, student progress, and usage reports",
      icon: <BarChart3 size={24} />,
      bgColor: "bg-green-500",
      path: "/admin/reports",
    },
    {
      id: "add-student",
      title: "Add Student",
      description: "Quickly register new students to the system",
      icon: <UserPlus size={24} />,
      bgColor: "bg-amber-500",
      path: "/admin/users/new-student",
    },
    {
      id: "add-course",
      title: "Add Course",
      description: "Create a new course in the learning management system",
      icon: <FilePlus size={24} />,
      bgColor: "bg-red-500",
      path: "/admin/courses/new",
    },
    {
      id: "notifications",
      title: "Send Notifications",
      description: "Send announcements and notifications to users",
      icon: <Bell size={24} />,
      bgColor: "bg-indigo-500",
      path: "/admin/notifications",
    },
  ];

  return (
    <div className="bg-transparent">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {actions.map((action) => (
          <ActionCard key={action.id} {...action} />
        ))}
      </div>
    </div>
  );
}
