import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function AttendanceRecords() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Sample courses data - replace with your actual data source
  const courses = [
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Computer Science",
      totalClasses: 16,
      attendedClasses: 14,
    },
    {
      id: 2,
      code: "MATH201",
      name: "Calculus II",
      totalClasses: 18,
      attendedClasses: 15,
    },
    {
      id: 3,
      code: "PHY102",
      name: "Physics for Engineers",
      totalClasses: 14,
      attendedClasses: 12,
    },
    {
      id: 4,
      code: "ENG105",
      name: "Technical Writing",
      totalClasses: 12,
      attendedClasses: 10,
    },
    {
      id: 5,
      code: "CHEM101",
      name: "General Chemistry",
      totalClasses: 15,
      attendedClasses: 11,
    },
  ];

  // Sample detailed attendance for a course
  const classAttendance = [
    { classNo: 1, date: "2025-01-15", status: "present" },
    { classNo: 2, date: "2025-01-22", status: "present" },
    { classNo: 3, date: "2025-01-29", status: "absent" },
    { classNo: 4, date: "2025-02-05", status: "present" },
    { classNo: 5, date: "2025-02-12", status: "present" },
    { classNo: 6, date: "2025-02-19", status: "leave" },
    { classNo: 7, date: "2025-02-26", status: "present" },
    { classNo: 8, date: "2025-03-05", status: "present" },
    { classNo: 9, date: "2025-03-12", status: "present" },
    { classNo: 10, date: "2025-03-19", status: "absent" },
    { classNo: 11, date: "2025-03-26", status: "present" },
    { classNo: 12, date: "2025-04-02", status: "present" },
  ];

  const getAttendancePercentage = (attended: number, total: number): number => {
    return Math.round((attended / total) * 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "present":
        return "bg-green-500 dark:bg-green-600";
      case "absent":
        return "bg-red-500 dark:bg-red-600";
      case "leave":
        return "bg-yellow-500 dark:bg-yellow-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course);
    openModal();
  };

  return (
    <>
      <PageMeta
        title="Attendance Records"
        description="View your attendance records for all enrolled courses at LGS Students Dashboard."
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Attendance Records
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your attendance records for all enrolled courses. Click on a
              course to see your detailed attendance history.
            </p>

            {/* Summary Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/30">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Total Courses
                </h3>
                <p className="mt-2 text-2xl font-semibold text-blue-900 dark:text-blue-100">
                  {courses.length}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/30">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Average Attendance
                </h3>
                <p className="mt-2 text-2xl font-semibold text-blue-900 dark:text-blue-100">
                  {Math.round(
                    courses.reduce(
                      (acc, course) =>
                        acc +
                        getAttendancePercentage(
                          course.attendedClasses,
                          course.totalClasses
                        ),
                      0
                    ) / courses.length
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="p-5 lg:p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Enrolled Courses
            </h2>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between p-5 lg:p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {course.code}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {course.name}
                        </h3>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Classes: {course.attendedClasses}/
                          {course.totalClasses}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                              style={{
                                width: `${getAttendancePercentage(
                                  course.attendedClasses,
                                  course.totalClasses
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getAttendancePercentage(
                              course.attendedClasses,
                              course.totalClasses
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCourseSelect(course)}
                      className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      View Details
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Course Attendance Modal */}
      {selectedCourse && (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl">
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCourse.code}: {selectedCourse.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your attendance record for this course
              </p>
            </div>

            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
              <div className="mb-3 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                  Attendance Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {getAttendancePercentage(
                    selectedCourse.attendedClasses,
                    selectedCourse.totalClasses
                  )}
                  %
                </p>
              </div>
              <div className="flex gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                    Present
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {
                      classAttendance.filter(
                        (item) => item.status === "present"
                      ).length
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">
                    Absent
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {
                      classAttendance.filter((item) => item.status === "absent")
                        .length
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Leave
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {
                      classAttendance.filter((item) => item.status === "leave")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-12 gap-2 border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class
                </div>
                <div className="col-span-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </div>
                <div className="col-span-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </div>
              </div>
              <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                {classAttendance.map((item) => (
                  <div
                    key={item.classNo}
                    className="grid grid-cols-12 gap-2 border-b border-gray-200 p-3 last:border-b-0 dark:border-gray-700"
                  >
                    <div className="col-span-2 text-sm font-medium text-gray-900 dark:text-white">
                      {item.classNo}
                    </div>
                    <div className="col-span-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="col-span-6">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end">
              <Button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 bg-blue-900 px-3 py-1.5 text-sm light:text-gray-900 font-medium text-black hover:bg-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
