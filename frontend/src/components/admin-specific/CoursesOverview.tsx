import { Link } from "react-router-dom";

export default function CoursesOverview() {
  const courses = [
    {
      id: 1,
      code: "CS401",
      title: "Software Engineering Principles",
      instructor: "Dr. Smith",
      students: 30,
      status: "active",
      startDate: "2023-01-15",
      rating: 4.7,
    },
    {
      id: 2,
      code: "CS302",
      title: "Database Design",
      instructor: "Prof. Johnson",
      students: 28,
      status: "active",
      startDate: "2023-01-10",
      rating: 4.2,
    },
    {
      id: 3,
      code: "CS405",
      title: "UI/UX Design",
      instructor: "Dr. Williams",
      students: 25,
      status: "active",
      startDate: "2023-01-25",
      rating: 4.9,
    },
    {
      id: 4,
      code: "CS301",
      title: "Algorithm Analysis",
      instructor: "Prof. Brown",
      students: 30,
      status: "upcoming",
      startDate: "2023-07-05",
      rating: null,
    },
    {
      id: 5,
      code: "CS450",
      title: "Network Security",
      instructor: "Dr. Garcia",
      students: 22,
      status: "completed",
      startDate: "2022-09-10",
      rating: 4.5,
    },
    {
      id: 6,
      code: "CS440",
      title: "Compiler Design",
      instructor: "Prof. Miller",
      students: 28,
      status: "completed",
      startDate: "2022-09-14",
      rating: 4.3,
    },
  ];

  const activeCourses = courses.filter(c => c.status === "active");
  const upcomingCourses = courses.filter(c => c.status === "upcoming");
  const popularCourses = [...courses].filter(c => c.rating).sort((a, b) => b.rating! - a.rating!).slice(0, 3);
  const getFirstThree = (arr: typeof courses) => arr.slice(0, 3);

  const EmptyState = ({ type }: { type: string }) => (
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
        No {type} courses
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {type === "active"
          ? "There are no active courses currently."
          : type === "upcoming"
            ? "No upcoming courses are scheduled."
            : "No popular courses found."}
      </p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Courses Overview
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Manage and monitor all courses in the system
          </p>
        </div>
        <Link
          to="/admin/courses/create"
          className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Create New Course
        </Link>
      </div>

      {/* Active Courses */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Courses ({activeCourses.length})
          </h4>
          {activeCourses.length > 3 && (
            <Link
              to="/admin/courses?status=active"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all active
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {activeCourses.length > 0 ? (
            getFirstThree(activeCourses).map((course) => (
              <Link
                key={course.id}
                to={`/admin/courses/${course.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{course.title}</h5>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Students: {course.students}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instructor: {course.instructor}</p>
              </Link>
            ))
          ) : (
            <EmptyState type="active" />
          )}
        </div>
      </div>

      {/* Upcoming Courses */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upcoming Courses ({upcomingCourses.length})
          </h4>
          {upcomingCourses.length > 3 && (
            <Link
              to="/admin/courses?status=upcoming"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all upcoming
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {upcomingCourses.length > 0 ? (
            getFirstThree(upcomingCourses).map((course) => (
              <Link
                key={course.id}
                to={`/admin/courses/${course.id}`}
                className="block p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{course.title}</h5>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                    Starts {new Date(course.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enrollment: {course.students} students
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instructor: {course.instructor}</p>
              </Link>
            ))
          ) : (
            <EmptyState type="upcoming" />
          )}
        </div>
      </div>

      {/* Popular Courses */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Popular Courses ({popularCourses.length})
          </h4>
          {popularCourses.length > 3 && (
            <Link
              to="/admin/courses?sort=popular"
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              View all popular
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {popularCourses.length > 0 ? (
            getFirstThree(popularCourses).map((course) => (
              <Link
                key={course.id}
                to={`/admin/courses/${course.id}/analytics`}
                className="block p-4 border border-blue-200 rounded-lg dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-800 dark:text-white/90">{course.title}</h5>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{course.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.students} enrolled
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instructor: {course.instructor}</p>
              </Link>
            ))
          ) : (
            <EmptyState type="popular" />
          )}
        </div>
      </div>
    </div>
  );
}
