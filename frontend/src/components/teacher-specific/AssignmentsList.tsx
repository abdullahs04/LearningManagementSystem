import { Link } from "react-router-dom";

export default function AssignmentsList() {
  const assignments = [
    {
      id: 1,
      title: "Software Engineering Principles",
      course: "CS401",
      dueDate: "2023-06-15",
      submissions: 24,
      totalStudents: 30,
    },
    {
      id: 2,
      title: "Database Design Project",
      course: "CS302",
      dueDate: "2023-06-10",
      submissions: 15,
      totalStudents: 28,
    },
    {
      id: 3,
      title: "UI/UX Case Study",
      course: "CS405",
      dueDate: "2023-05-25",
      submissions: 18,
      totalStudents: 25,
    },
    {
      id: 4,
      title: "Algorithm Analysis",
      course: "CS301",
      dueDate: "2023-05-28",
      submissions: 30,
      totalStudents: 30,
    },
    {
      id: 5,
      title: "Network Security Assessment",
      course: "CS450",
      dueDate: "2023-06-20",
      submissions: 5,
      totalStudents: 22,
    },
    {
      id: 22,
      title: "Compiler Design",
      course: "CS440",
      dueDate: "2023-05-14",
      submissions: 27,
      totalStudents: 28,
    },
  ];

  const currentDate = new Date();
  const upcomingAssignments = assignments.filter(a => new Date(a.dueDate) > currentDate);
  const pastAssignments = assignments.filter(a => new Date(a.dueDate) <= currentDate);
  const completeSubmissions = assignments.filter(a => a.submissions === a.totalStudents);

  const getFirstThree = (arr) => arr.slice(0, 3);

  const EmptyState = ({ type }) => (
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
        No {type} assignments
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {type === "upcoming"
          ? "You don't have any upcoming assignments scheduled."
          : type === "past"
          ? "No past assignments found."
          : "None of your assignments has complete submissions yet."}
      </p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Assignments Overview
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Track your course assignments and submissions
          </p>
        </div>
        <Link
          to="/create-assignment"
          className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Create New Assignment
        </Link>
      </div>

      {/* Upcoming Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upcoming Assignments ({upcomingAssignments.length})
          </h4>
          {upcomingAssignments.length > 3 && (
            <Link
              to="/assignments?type=upcoming"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all upcoming
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {upcomingAssignments.length > 0 ? (
            getFirstThree(upcomingAssignments).map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{assignment.title}</h5>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submissions: {assignment.submissions}/{assignment.totalStudents}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState type="upcoming" />
          )}
        </div>
      </div>

      {/* Past Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Past Assignments ({pastAssignments.length})
          </h4>
          {pastAssignments.length > 3 && (
            <Link
              to="/assignments?type=past"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all past
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {pastAssignments.length > 0 ? (
            getFirstThree(pastAssignments).map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignments/${assignment.id}/submissions`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{assignment.title}</h5>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    Closed on {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submissions: {assignment.submissions}/{assignment.totalStudents}
                  </p>
                </div>
                {assignment.submissions < assignment.totalStudents && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
                      style={{
                        width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
              </Link>
            ))
          ) : (
            <EmptyState type="past" />
          )}
        </div>
      </div>

      {/* Complete Submissions */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Complete Submissions ({completeSubmissions.length})
          </h4>
          {completeSubmissions.length > 3 && (
            <Link
              to="/assignments?status=complete"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all complete
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {completeSubmissions.length > 0 ? (
            getFirstThree(completeSubmissions).map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignments/${assignment.id}/submissions`}
                className="block p-4 border border-green-200 rounded-lg dark:border-green-900/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{assignment.title}</h5>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    100% Submitted
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
              </Link>
            ))
          ) : (
            <EmptyState type="complete" />
          )}
        </div>
      </div>
    </div>
  );
}
