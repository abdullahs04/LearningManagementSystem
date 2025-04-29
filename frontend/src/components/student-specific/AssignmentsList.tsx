import { Link } from "react-router-dom";

// Define interfaces for the assignment data structure
interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
}

export default function AssignmentsList() {
  const assignments: Assignment[] = [
    {
      id: 1,
      title: "Software Engineering Principles", 
      course: "CS401",
      dueDate: "2023-06-15",
      status: "pending",
    },
    {
      id: 2,
      title: "Database Design Project",
      course: "CS302",
      dueDate: "2023-06-10",
      status: "pending",
    },
    {
      id: 3,
      title: "UI/UX Case Study",
      course: "CS405",
      dueDate: "2023-05-25",
      status: "overdue",
    },
    {
      id: 4,
      title: "Algorithm Analysis",
      course: "CS301",
      dueDate: "2023-05-28",
      status: "completed",
    },
    {
      id: 5,
      title: "Network Security Assessment",
      course: "CS450",
      dueDate: "2023-06-20",
      status: "pending",
    },
    {
      id: 6,
      title: "Mobile App Development",
      course: "CS410",
      dueDate: "2023-06-18",
      status: "pending",
    },
    {
      id: 7,
      title: "Data Structures Implementation",
      course: "CS201",
      dueDate: "2023-05-20",
      status: "overdue",
    },
    {
      id: 8,
      title: "Machine Learning Models",
      course: "CS460",
      dueDate: "2023-06-25",
      status: "pending",
    },
    {
      id: 9,
      title: "Operating Systems Project",
      course: "CS350",
      dueDate: "2023-05-15",
      status: "completed",
    },
    {
      id: 10,
      title: "Web Development Framework",
      course: "CS415",
      dueDate: "2023-06-12",
      status: "pending",
    },
    {
      id: 11,
      title: "Computer Graphics Rendering",
      course: "CS430",
      dueDate: "2023-05-18",
      status: "completed",
    },
    {
      id: 12,
      title: "Artificial Intelligence Ethics",
      course: "CS480",
      dueDate: "2023-06-30",
      status: "pending",
    },
    {
      id: 13,
      title: "Cloud Computing Architecture",
      course: "CS470",
      dueDate: "2023-06-08",
      status: "pending",
    },
    {
      id: 14,
      title: "Quantum Computing Basics",
      course: "CS490",
      dueDate: "2023-05-22",
      status: "overdue",
    },
    {
      id: 15,
      title: "Software Testing Methods",
      course: "CS402",
      dueDate: "2023-05-10",
      status: "completed",
    },
    {
      id: 16,
      title: "Cybersecurity Analysis",
      course: "CS455",
      dueDate: "2023-06-22",
      status: "pending",
    },
    {
      id: 17,
      title: "Embedded Systems Programming",
      course: "CS420",
      dueDate: "2023-06-05",
      status: "completed",
    },
    {
      id: 18,
      title: "Big Data Analytics",
      course: "CS475",
      dueDate: "2023-05-30",
      status: "overdue",
    },
    {
      id: 19,
      title: "Blockchain Technology",
      course: "CS485",
      dueDate: "2023-06-28",
      status: "pending",
    },
    {
      id: 20,
      title: "Human-Computer Interaction",
      course: "CS408",
      dueDate: "2023-05-12",
      status: "completed",
    },
    {
      id: 21,
      title: "Virtual Reality Development",
      course: "CS432",
      dueDate: "2023-06-17",
      status: "pending",
    },
    {
      id: 22,
      title: "Compiler Design",
      course: "CS440",
      dueDate: "2023-05-14",
      status: "completed",
    }
  ];

  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const completedAssignments = assignments.filter(a => a.status === "completed");
  const overdueAssignments = assignments.filter(a => a.status === "overdue");

  // Fixed the "arr" parameter type
  const getFirstThree = (arr: Assignment[]): Assignment[] => arr.slice(0, 3);

  // Fixed the "status" parameter type
  interface EmptyStateProps {
    status: string;
  }
  
  const EmptyState = ({ status }: EmptyStateProps) => (
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
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        No {status} assignments
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {status === "pending"
          ? "You're all caught up! No pending assignments right now."
          : status === "completed"
          ? "No assignments have been completed yet."
          : "Great job! You have no overdue assignments."}
      </p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            My Assignments
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Track your pending and completed assignments
          </p>
        </div>
        <Link to="/assignments" className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
          View All Assignments
        </Link>
      </div>

      {/* Pending Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pending Assignments ({pendingAssignments.length})
          </h4>
          {pendingAssignments.length > 3 && (
            <Link 
              to="/assignments?status=pending" 
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all pending
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {pendingAssignments.length > 0 ? (
            getFirstThree(pendingAssignments).map((assignment: Assignment) => (
              <Link 
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{assignment.title}</h5>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap ml-2 flex-shrink-0">
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
              </Link>
            ))
          ) : (
            <EmptyState status="pending" />
          )}
        </div>
      </div>

      {/* Overdue Assignments */}
      {overdueAssignments.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overdue Assignments ({overdueAssignments.length})
            </h4>
            {overdueAssignments.length > 3 && (
              <Link 
                to="/assignments?status=overdue" 
                className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
              >
                View all overdue
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {getFirstThree(overdueAssignments).map((assignment: Assignment) => (
              <Link 
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="block p-4 border border-red-200 rounded-lg dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{assignment.title}</h5>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full dark:bg-red-900/30 dark:text-red-400 whitespace-nowrap ml-2 flex-shrink-0">
                    Due date passed ({new Date(assignment.dueDate).toLocaleDateString()})
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Completed Assignments ({completedAssignments.length})
          </h4>
          {completedAssignments.length > 3 && (
            <Link 
              to="/assignments?status=completed" 
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all completed
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {completedAssignments.length > 0 ? (
            getFirstThree(completedAssignments).map((assignment: Assignment) => (
              <Link 
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 opacity-75 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{assignment.title}</h5>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
              </Link>
            ))
          ) : (
            <EmptyState status="completed" />
          )}
        </div>
      </div>
    </div>
  );
}