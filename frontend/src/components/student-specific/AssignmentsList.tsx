import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


interface Attachment {
  file_id: number;
  file_name: string;
  file_path: string;
}

interface Assignment {
  assignment_id: number;
  subject_id: number;
  subject_name: string;
  title: string;
  description: string;
  due_date: string;
  posted_date: string;
  status: "upcoming" | "active" | "submitted" | "graded";
  attachments: Attachment[];
}

export default function AssignmentsList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const studentRfid = "6323678";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `http://193.203.162.232:10000/assignments/get_assignment?student_rfid=${studentRfid}`
        );
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load assignments");
        setLoading(false);
        console.error("Error fetching assignments:", err);
      }
    };

    fetchAssignments();
  }, []);

  const upcomingAssignments = assignments.filter(
    (a) => a.status === "upcoming"
  );
  const activeAssignments = assignments.filter((a) => a.status === "active");
  const submittedAssignments = assignments.filter(
    (a) => a.status === "submitted"
  );
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  const getFirstThree = (arr: Assignment[]): Assignment[] => arr.slice(0, 3);

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
        {status === "active"
          ? "You're all caught up! No active assignments right now."
          : status === "upcoming"
          ? "No upcoming assignments found."
          : status === "submitted"
          ? "No assignments have been submitted yet."
          : "No assignments have been graded yet."}
      </p>
    </div>
  );

  const getStatusBadge = (status: string, dueDate: string) => {
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    
    switch (status) {
      case "upcoming":
        return (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap ml-2 flex-shrink-0">
            Due {dueDateObj.toLocaleDateString()}
          </span>
        );
      case "active":
        return (
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap ml-2 flex-shrink-0">
            Due {dueDateObj.toLocaleDateString()}
          </span>
        );
      case "submitted":
        return (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap ml-2 flex-shrink-0">
            Submitted
          </span>
        );
      case "graded":
        return (
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900/30 dark:text-purple-400 whitespace-nowrap ml-2 flex-shrink-0">
            Graded
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="text-center p-6 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            My Assignments
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Track your assignments by status
          </p>
        </div>
        <Link
          to="/assignments"
          className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          View All Assignments
        </Link>
      </div>

      {/* Active Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Assignments ({activeAssignments.length})
          </h4>
          {activeAssignments.length > 3 && (
            <Link
              to="/assignments?status=active"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all active
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {activeAssignments.length > 0 ? (
            getFirstThree(activeAssignments).map((assignment) => (
              <Link
                key={assignment.assignment_id}
                to={`/assignments/${assignment.assignment_id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">
                    {assignment.title}
                  </h5>
                  {getStatusBadge(assignment.status, assignment.due_date)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {assignment.subject_name}
                </p>
                {assignment.attachments.length > 0 && (
                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    {assignment.attachments.length} attachment
                    {assignment.attachments.length !== 1 ? "s" : ""}
                  </div>
                )}
              </Link>
            ))
          ) : (
            <EmptyState status="active" />
          )}
        </div>
      </div>

      {/* Upcoming Assignments */}
      {upcomingAssignments.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Upcoming Assignments ({upcomingAssignments.length})
            </h4>
            {upcomingAssignments.length > 3 && (
              <Link
                to="/assignments?status=upcoming"
                className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
              >
                View all upcoming
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {getFirstThree(upcomingAssignments).map((assignment) => (
              <Link
                key={assignment.assignment_id}
                to={`/assignments/${assignment.assignment_id}`}
                className="block p-4 border border-blue-200 rounded-lg dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">
                    {assignment.title}
                  </h5>
                  {getStatusBadge(assignment.status, assignment.due_date)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {assignment.subject_name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Submitted Assignments ({submittedAssignments.length})
          </h4>
          {submittedAssignments.length > 3 && (
            <Link
              to="/assignments?status=submitted"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all submitted
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {submittedAssignments.length > 0 ? (
            getFirstThree(submittedAssignments).map((assignment) => (
              <Link
                key={assignment.assignment_id}
                to={`/assignments/${assignment.assignment_id}`}
                className="block p-4 border border-green-200 rounded-lg dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">
                    {assignment.title}
                  </h5>
                  {getStatusBadge(assignment.status, assignment.due_date)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {assignment.subject_name}
                </p>
              </Link>
            ))
          ) : (
            <EmptyState status="submitted" />
          )}
        </div>
      </div>

      {/* Graded Assignments */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Graded Assignments ({gradedAssignments.length})
          </h4>
          {gradedAssignments.length > 3 && (
            <Link
              to="/assignments?status=graded"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all graded
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {gradedAssignments.length > 0 ? (
            getFirstThree(gradedAssignments).map((assignment) => (
              <Link
                key={assignment.assignment_id}
                to={`/assignments/${assignment.assignment_id}`}
                className="block p-4 border border-purple-200 rounded-lg dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">
                    {assignment.title}
                  </h5>
                  {getStatusBadge(assignment.status, assignment.due_date)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {assignment.subject_name}
                </p>
              </Link>
            ))
          ) : (
            <EmptyState status="graded" />
          )}
        </div>
      </div>
    </div>
  );
}