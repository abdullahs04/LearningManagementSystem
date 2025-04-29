import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function TimetableAndExams() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    { id: 1, name: "Mathematics", code: "MATH101" },
    { id: 2, name: "Physics", code: "PHYS201" },
    { id: 3, name: "Chemistry", code: "CHEM301" },
    { id: 4, name: "Computer Science", code: "CS401" },
  ];

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    openModal();
  };

  const renderCourseDetails = () => {
    if (!selectedCourse) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {selectedCourse.name} ({selectedCourse.code})
        </h3>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Venue</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {["Monday", "Wednesday", "Friday"].map((day, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{day}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">10:00 AM - 12:00 PM</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Room 101</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <button className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Schedule</h4>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Venue</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              <tr>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">2023-12-15</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">9:00 AM - 12:00 PM</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Main Hall</td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <button className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Timetable and Exams"
        description="Manage class and exam schedules"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable and Exams</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Allocate time and venue for classes and exams
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Courses</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a course to manage its timetable and exam schedule
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleOpenModal(course)}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800"
              >
                <div className="rounded-full bg-blue-100 p-3 text-xl text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  📘
                </div>
                <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                  {course.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCourse && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {renderCourseDetails()}
          </div>
          <div className="flex justify-end gap-4 border-t border-gray-200 p-4 dark:border-gray-700">
            <Button
              onClick={closeModal}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={closeModal}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}