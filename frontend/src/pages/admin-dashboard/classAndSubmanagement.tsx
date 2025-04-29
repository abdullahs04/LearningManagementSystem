import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function ClassAndStudentManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [newCourse, setNewCourse] = useState({ name: "", description: "", students: [], faculty: [] });
  const [dummyStudents] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ]);
  const [dummyFaculty] = useState([
    { id: 1, name: "Dr. Brown" },
    { id: 2, name: "Prof. Green" },
    { id: 3, name: "Dr. White" },
  ]);

  const handleCreateCourse = () => {
    openModal();
  };

  const handleSaveCourse = () => {
    const courseToAdd = { ...newCourse, id: Date.now() };
    setCourses([...courses, courseToAdd]);
    setNewCourse({ name: "", description: "", students: [], faculty: [] });
    closeModal();
  };

  const handleAddStudentToNewCourse = (student) => {
    setNewCourse((prev) => ({ ...prev, students: [...prev.students, student] }));
  };

  const handleAddFacultyToNewCourse = (faculty) => {
    setNewCourse((prev) => ({ ...prev, faculty: [...prev.faculty, faculty] }));
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageMeta
        title="Class and Student Management"
        description="Manage courses, students, and faculty members."
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Class and Student Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage courses, add or remove students and faculty members.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Courses List */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="p-5 lg:p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Courses</h2>
              <Button
                onClick={handleCreateCourse}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Create Course
              </Button>
            </div>
          </div>
          <div className="overflow-hidden">
            {filteredCourses.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredCourses.map((course) => (
                  <li key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center justify-between p-5 lg:p-6">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{course.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setSelectedCourse(course)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5 text-center text-gray-600 dark:text-gray-400">
                No courses found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Course Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Create New Course
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill in the details for the new course.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">Add Students</h4>
            <ul className="mt-2 space-y-2">
              {dummyStudents.map((student) => (
                <li key={student.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-white">{student.name}</span>
                  <Button
                    onClick={() => handleAddStudentToNewCourse(student)}
                    className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">Add Faculty</h4>
            <ul className="mt-2 space-y-2">
              {dummyFaculty.map((faculty) => (
                <li key={faculty.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-white">{faculty.name}</span>
                  <Button
                    onClick={() => handleAddFacultyToNewCourse(faculty)}
                    className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveCourse}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Save Course
            </Button>
            <Button
              onClick={closeModal}
              className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}