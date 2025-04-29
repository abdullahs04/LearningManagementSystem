import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function Gradebook() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  // Sample data - replace with actual data source
  const students = [
    { id: 1, name: "John Doe", courses: [
      { code: "CS101", grade: "A", professor: "Dr. Smith" },
      { code: "MATH201", grade: "B+", professor: "Dr. Johnson" }
    ] },
    { id: 2, name: "Jane Smith", courses: [
      { code: "CS101", grade: "B", professor: "Dr. Smith" },
      { code: "MATH201", grade: "A", professor: "Dr. Johnson" }
    ] },
    { id: 3, name: "Alice Johnson", courses: [
      { code: "CS101", grade: "A-", professor: "Dr. Smith" },
      { code: "MATH201", grade: "B", professor: "Dr. Johnson" }
    ] },
    { id: 4, name: "Bob Brown", courses: [
      { code: "PHYS101", grade: "B+", professor: "Dr. Lee" },
      { code: "CHEM101", grade: "A", professor: "Dr. Taylor" }
    ] },
    { id: 5, name: "Charlie Green", courses: [
      { code: "CS101", grade: "C", professor: "Dr. Smith" },
      { code: "MATH201", grade: "B", professor: "Dr. Johnson" }
    ] },
    { id: 6, name: "Diana White", courses: [
      { code: "BIO101", grade: "A", professor: "Dr. Adams" },
      { code: "CHEM101", grade: "A-", professor: "Dr. Taylor" }
    ] }
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    openModal();
  };

  const handleDownloadResults = (student) => {
    alert(`Downloading results for ${student.name}`);
  }; // Simulate download functionality

  return (
    <>
      <PageMeta
        title="Gradebook"
        description="View and manage end-of-semester results for students."
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gradebook</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage the end-of-semester results for all students. Click on a student to view or generate their detailed results.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <input
            type="text"
            placeholder="Search for a student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Students List */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="p-5 lg:p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Students</h2>
          </div>
          <div className="overflow-hidden">
            {filteredStudents.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredStudents.map((student) => (
                  <li key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center justify-between p-5 lg:p-6">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleStudentSelect(student)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          View Results
                        </Button>
                        <Button
                          onClick={() => handleDownloadResults(student)}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                          Download Results
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5 text-center text-gray-600 dark:text-gray-400">
                No students found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Results Modal */}
      {selectedStudent && (
        <Modal isOpen={isOpen} onClose={closeModal} size="lg">
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {selectedStudent.name}'s Results
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                End-of-semester grades for enrolled courses.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-12 gap-2 border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="col-span-4 text-sm font-medium text-gray-700 dark:text-gray-300">Course</div>
                <div className="col-span-4 text-sm font-medium text-gray-700 dark:text-gray-300">Grade</div>
                <div className="col-span-4 text-sm font-medium text-gray-700 dark:text-gray-300">Professor</div>
              </div>
              <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                {selectedStudent.courses.map((course) => (
                  <div
                    key={course.code}
                    className="grid grid-cols-12 gap-2 border-b border-gray-200 p-3 last:border-b-0 dark:border-gray-700"
                  >
                    <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-white">
                      {course.code}
                    </div>
                    <div className="col-span-4 text-sm text-gray-600 dark:text-gray-400">
                      {course.grade}
                    </div>
                    <div className="col-span-4 text-sm text-gray-600 dark:text-gray-400">
                      {course.professor}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end">
              <Button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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