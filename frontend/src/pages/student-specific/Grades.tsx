import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function Grades() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [view, setView] = useState("all"); // "all", "year1", "year2", etc.

  // Enhanced sample courses data with multiple years
  const courses = [
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Sarah Johnson",
      studyYear: "Year 1",
      status: "completed",
      grades: {
        monthly: [
          { name: "Monthly Test 1", score: 85, totalPoints: 100 },
          { name: "Monthly Test 2", score: 92, totalPoints: 100 },
        ],
        mocks: [
          { name: "Mock Exam 1", score: 78, totalPoints: 100 },
          { name: "Mock Exam 2", score: 82, totalPoints: 100 },
        ],
        standups: [
          { name: "Standup Presentation 1", score: 45, totalPoints: 50 },
          { name: "Standup Presentation 2", score: 48, totalPoints: 50 },
        ],
        testSessions: [
          { name: "Session 1", score: 28, totalPoints: 30 },
          { name: "Session 2", score: 27, totalPoints: 30 },
          { name: "Session 3", score: 29, totalPoints: 30 },
        ],
        weekly: [
          { name: "Week 1", score: 18, totalPoints: 20 },
          { name: "Week 2", score: 17, totalPoints: 20 },
        ],
        halfBook: { score: 88, totalPoints: 100 },
        fullBook: { score: 92, totalPoints: 100 },
      },
    },
    {
      id: 2,
      code: "MATH120",
      name: "Calculus I",
      instructor: "Prof. Robert Chen",
      studyYear: "Year 1",
      status: "in-progress",
      grades: {
        monthly: [
          { name: "Monthly Test 1", score: 76, totalPoints: 100 },
          { name: "Monthly Test 2", score: 81, totalPoints: 100 },
        ],
        mocks: [{ name: "Mock Exam 1", score: 72, totalPoints: 100 }],
        weekly: [
          { name: "Week 1", score: 16, totalPoints: 20 },
          { name: "Week 2", score: 18, totalPoints: 20 },
          { name: "Week 3", score: 17, totalPoints: 20 },
        ],
        halfBook: { score: 82, totalPoints: 100 },
      },
    },
    {
      id: 3,
      code: "PHYS101",
      name: "Physics Fundamentals",
      instructor: "Dr. Lisa Wong",
      studyYear: "Year 1",
      status: "upcoming",
      grades: {
        monthly: [{ name: "Monthly Test 1", score: 79, totalPoints: 100 }],
        weekly: [{ name: "Week 1", score: 17, totalPoints: 20 }],
      },
    },
  ];

  const studyYears = [...new Set(courses.map((course) => course.studyYear))];
  const filteredCourses =
    view === "all"
      ? courses
      : courses.filter((course) => course.studyYear === view);

  const handleOpenModal = (course: Course) => {
    setSelectedCourse(course);
    openModal();
  };

  const getYearBadge = (year: string) => {
    const yearColors = {
      "Year 1":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Year 2":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Year 3":
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "Year 4":
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };

    const isValidYear = (y: string): y is keyof typeof yearColors => {
      return y in yearColors;
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isValidYear(year)
            ? yearColors[year]
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {year}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        label: "Completed",
      },
      "in-progress": {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        label: "In Progress",
      },
      upcoming: {
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        label: "Upcoming",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      label: "Unknown",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const calculatePercentage = (score: number, totalPoints: number) => {
    return ((score / totalPoints) * 100).toFixed(1);
  };

  type Course = {
    id: number;
    code: string;
    name: string;
    instructor: string;
    studyYear: string;
    status: string;
    grades: {
      monthly?: Array<{ name: string; score: number; totalPoints: number }>;
      mocks?: Array<{ name: string; score: number; totalPoints: number }>;
      standups?: Array<{ name: string; score: number; totalPoints: number }>;
      testSessions?: Array<{
        name: string;
        score: number;
        totalPoints: number;
      }>;
      weekly?: Array<{ name: string; score: number; totalPoints: number }>;
      halfBook?: { score: number; totalPoints: number };
      fullBook?: { score: number; totalPoints: number };
      [key: string]:
        | Array<{ name: string; score: number; totalPoints: number }>
        | { score: number; totalPoints: number }
        | undefined;
    };
  };

  const calculateCoursePercentage = (course: Course) => {
    let totalScore = 0;
    let totalPossible = 0;

    Object.values(course.grades).forEach((assessment) => {
      if (Array.isArray(assessment)) {
        assessment.forEach((item) => {
          totalScore += item.score;
          totalPossible += item.totalPoints;
        });
      } else if (assessment && typeof assessment === "object") {
        totalScore += assessment.score;
        totalPossible += assessment.totalPoints;
      }
    });

    return totalPossible > 0
      ? ((totalScore / totalPossible) * 100).toFixed(1)
      : "0";
  };

  const getLetterGrade = (percentage: number | string): string => {
    const num = parseFloat(percentage.toString());
    if (num >= 90) return "A";
    if (num >= 80) return "B";
    if (num >= 70) return "C";
    if (num >= 60) return "D";
    return "F";
  };

  const getGradeColorClass = (percentage: number | string): string => {
    const num = parseFloat(percentage.toString());
    if (num >= 90) return "text-green-600 dark:text-green-400";
    if (num >= 80) return "text-blue-600 dark:text-blue-400";
    if (num >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (num >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const calculateOverallGPA = () => {
    const completedCourses = courses.filter(
      (c) => c.status === "completed" || c.status === "in-progress"
    );
    if (completedCourses.length === 0) return "N/A";

    const totalPercentage = completedCourses.reduce((sum, course) => {
      return sum + parseFloat(calculateCoursePercentage(course));
    }, 0);

    return (totalPercentage / completedCourses.length).toFixed(1) + "%";
  };

  const renderGradeBreakdown = () => {
    if (!selectedCourse) return null;

    const grades = selectedCourse.grades;
    const coursePercentage = calculateCoursePercentage(selectedCourse);
    const letterGrade = getLetterGrade(coursePercentage);

    const renderGradeSection = (
      title: string,
      items:
        | Array<{ name: string; score: number; totalPoints: number }>
        | { score: number; totalPoints: number }
        | undefined
    ) => {
      if (!items || (Array.isArray(items) && items.length === 0)) return null;

      return (
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                {Array.isArray(items) ? (
                  items.map((item, index) => {
                    const itemPercentage = calculatePercentage(
                      item.score,
                      item.totalPoints
                    );
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {item.score} / {item.totalPoints}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                          <span
                            className={`font-semibold ${getGradeColorClass(
                              itemPercentage
                            )}`}
                          >
                            {itemPercentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {items.score} / {items.totalPoints}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                      <span
                        className={`font-semibold ${getGradeColorClass(
                          calculatePercentage(items.score, items.totalPoints)
                        )}`}
                      >
                        {calculatePercentage(items.score, items.totalPoints)}%
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const getPerformanceTrend = () => {
      if (grades.monthly && grades.monthly.length >= 2) {
        const recent = grades.monthly[grades.monthly.length - 1].score;
        const previous = grades.monthly[grades.monthly.length - 2].score;

        if (recent > previous) {
          return {
            text: "Improving",
            icon: "📈",
            color: "text-green-600 dark:text-green-400",
          };
        } else if (recent < previous) {
          return {
            text: "Declining",
            icon: "📉",
            color: "text-red-600 dark:text-red-400",
          };
        }
      }
      return {
        text: "Stable",
        icon: "➖",
        color: "text-blue-600 dark:text-blue-400",
      };
    };

    const trend = getPerformanceTrend();

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedCourse.code}: {selectedCourse.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Instructor: {selectedCourse.instructor}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {getYearBadge(selectedCourse.studyYear)}
              {getStatusBadge(selectedCourse.status)}
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 text-center">
              <div className="text-xl font-bold mb-1">Overall Grade</div>
              <div className="flex flex-col items-center">
                <div
                  className={`text-3xl font-bold ${getGradeColorClass(
                    coursePercentage
                  )}`}
                >
                  {letterGrade}
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {coursePercentage}%
                </div>
                <div
                  className={`mt-2 text-sm font-medium ${trend.color} flex items-center`}
                >
                  <span className="mr-1">{trend.icon}</span> {trend.text}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {renderGradeSection("Monthly Tests", grades.monthly)}
        {renderGradeSection("Mock Exams", grades.mocks)}
        {renderGradeSection("Standup Presentations", grades.standups)}
        {renderGradeSection("Test Sessions", grades.testSessions)}
        {renderGradeSection("Weekly Assessments", grades.weekly)}
        {renderGradeSection("Half Book Exam", grades.halfBook)}
        {renderGradeSection("Full Book Exam", grades.fullBook)}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Academic Progress"
        description="View your academic progress and detailed results"
      />

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:border-gray-800 dark:bg-gradient-to-r dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Academic Progress
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Track your monthly tests, mock exams, and book assessments
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
                Filter by:
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setView("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    view === "all"
                      ? "bg-blue-600 text-white dark:bg-blue-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                  }`}
                >
                  All Years
                </button>
                {studyYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setView(year)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      view === year
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Current Study Year
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Year 1
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              2024-2025 Academic Year
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Overall GPA
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {calculateOverallGPA()}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Across All Courses
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Course Completion
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {courses.filter((c) => c.status === "completed").length}/
              {courses.length}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Courses Completed
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Year 1 Progress
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {Math.round(
                (courses.filter((c) => c.status === "completed").length /
                  courses.length) *
                  100
              )}
              %
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
              style={{
                width: `${
                  (courses.filter((c) => c.status === "completed").length /
                    courses.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Course Progress
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a course to view detailed assessment results
          </p>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Study Year
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {filteredCourses.map((course) => {
                const percentage = calculateCoursePercentage(course);
                const letterGrade = getLetterGrade(percentage);
                return (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {course.code}: {course.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {course.instructor}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getYearBadge(course.studyYear)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <span
                          className={`text-xl font-bold mr-2 ${getGradeColorClass(
                            percentage
                          )}`}
                        >
                          {letterGrade}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        onClick={() => handleOpenModal(course)}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredCourses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No courses found for the selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCourse && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {renderGradeBreakdown()}
          </div>
          <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
            <Button
              onClick={closeModal}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
