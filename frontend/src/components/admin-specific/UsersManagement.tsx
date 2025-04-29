import { Link } from "react-router-dom";

// TODO fix the functionality issues

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  course?: string;
  department?: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface EmptyStateProps {
  type: 'student' | 'teacher' | 'admin';
}

export default function UsersManagement() {
  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
      course: "CS401",
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "student",
      course: "CS302",
      status: "active",
      joinDate: "2023-02-10",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "teacher",
      department: "Computer Science",
      status: "active",
      joinDate: "2022-08-25",
    },
    {
      id: 4,
      name: "Emily Williams",
      email: "emily.williams@example.com",
      role: "student",
      course: "CS405",
      status: "inactive",
      joinDate: "2023-01-05",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      role: "admin",
      department: "IT Administration",
      status: "active",
      joinDate: "2021-11-20",
    },
    {
      id: 6,
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      role: "teacher",
      department: "Mathematics",
      status: "active",
      joinDate: "2022-07-14",
    },
    {
      id: 7,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      role: "student",
      course: "CS301",
      status: "active",
      joinDate: "2023-03-22",
    },
  ];

  const studentUsers = users.filter(user => user.role === "student");
  const teacherUsers = users.filter(user => user.role === "teacher");
  const adminUsers = users.filter(user => user.role === "admin");

  const getFirstThree = <T,>(arr: T[]): T[] => arr.slice(0, 3);

  const EmptyState = ({ type }: EmptyStateProps) => (
    <div className="p-6 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        No {type} users
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {type === "student"
          ? "No students are registered in the system."
          : type === "teacher"
          ? "No teachers are registered in the system."
          : "No administrators are registered in the system."}
      </p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Users Management
        </h3>
        <Link
          to="/add-user"
          className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Add New User
        </Link>
      </div>

      {/* Students Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Students ({studentUsers.length})
          </h4>
          {studentUsers.length > 3 && (
            <Link
              to="/users?role=student"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all students
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {studentUsers.length > 0 ? (
            getFirstThree(studentUsers).map((user) => (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{user.name}</h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "active" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Course: {user.course}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState type="student" />
          )}
        </div>
      </div>

      {/* Teachers Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Teachers ({teacherUsers.length})
          </h4>
          {teacherUsers.length > 3 && (
            <Link
              to="/users?role=teacher"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all teachers
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {teacherUsers.length > 0 ? (
            getFirstThree(teacherUsers).map((user) => (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{user.name}</h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "active" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dept: {user.department}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState type="teacher" />
          )}
        </div>
      </div>

      {/* Admins Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Administrators ({adminUsers.length})
          </h4>
          {adminUsers.length > 3 && (
            <Link
              to="/users?role=admin"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all admins
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {adminUsers.length > 0 ? (
            getFirstThree(adminUsers).map((user) => (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="block p-4 border border-blue-200 rounded-lg dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{user.name}</h5>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                    Administrator
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </Link>
            ))
          ) : (
            <EmptyState type="admin" />
          )}
        </div>
      </div>
    </div>
  );
}