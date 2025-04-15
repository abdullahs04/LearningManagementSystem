import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

// Add type interfaces for better type safety
interface Student {
  id: number;
  name: string;
  submitted: boolean;
  submissionDate: string | null;
  grade: number | null;
  feedback: string | null;
}

interface Assignment {
  id: number;
  name: string;
  dueDate: string;
  totalPoints: number;
  submitted: number;
  graded: number;
  students: Student[];
}

interface Course {
  id: number;
  code: string;
  name: string;
  semester: string;
  students: number;
  assignments: Assignment[];
}

export default function Grading() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { isOpen: isCourseModalOpen, openModal: openCourseModal, closeModal: closeCourseModal } = useModal();
  const { isOpen: isAssignmentModalOpen, openModal: openAssignmentModal, closeModal: closeAssignmentModal } = useModal();
  const { isOpen: isStudentModalOpen, openModal: openStudentModal, closeModal: closeStudentModal } = useModal();

  // Sample courses data for a teacher
  const courses = [
    { 
      id: 1, 
      code: "CS101", 
      name: "Introduction to Computer Science", 
      semester: "Fall 2023",
      students: 48,
      assignments: [
        { 
          id: 1,
          name: "Assignment 1: Basic Programming",
          dueDate: "2023-10-15",
          totalPoints: 100,
          submitted: 45,
          graded: 42,
          students: [
            { id: 1, name: "Alice Johnson", submitted: true, submissionDate: "2023-10-14", grade: 85, feedback: "Good work, but could improve code organization." },
            { id: 2, name: "Bob Smith", submitted: true, submissionDate: "2023-10-15", grade: 92, feedback: "Excellent solution!" },
            { id: 3, name: "Charlie Davis", submitted: true, submissionDate: "2023-10-15", grade: 78, feedback: "Several logical errors in the implementation." },
            { id: 4, name: "Diana Wilson", submitted: false, submissionDate: null, grade: null, feedback: null },
          ]
        },
        { 
          id: 2,
          name: "Assignment 2: Data Structures",
          dueDate: "2023-11-05",
          totalPoints: 100,
          submitted: 46,
          graded: 38,
          students: [
            { id: 1, name: "Alice Johnson", submitted: true, submissionDate: "2023-11-03", grade: 90, feedback: "Very well organized solution." },
            { id: 2, name: "Bob Smith", submitted: true, submissionDate: "2023-11-04", grade: 88, feedback: "Good implementation but missing some edge cases." },
            { id: 3, name: "Charlie Davis", submitted: true, submissionDate: "2023-11-05", grade: 75, feedback: "Needs improvement in time complexity." },
            { id: 4, name: "Diana Wilson", submitted: true, submissionDate: "2023-11-05", grade: null, feedback: null },
          ]
        },
        { 
          id: 3,
          name: "Final Project: Building a Web App",
          dueDate: "2023-12-10",
          totalPoints: 200,
          submitted: 40,
          graded: 30,
          students: [
            { id: 1, name: "Alice Johnson", submitted: true, submissionDate: "2023-12-09", grade: 180, feedback: "Impressive project with excellent documentation!" },
            { id: 2, name: "Bob Smith", submitted: true, submissionDate: "2023-12-10", grade: 175, feedback: "Very good project, UI could use improvements." },
            { id: 3, name: "Charlie Davis", submitted: true, submissionDate: "2023-12-10", grade: null, feedback: null },
            { id: 4, name: "Diana Wilson", submitted: false, submissionDate: null, grade: null, feedback: null },
          ]
        }
      ]
    },
    { 
      id: 2, 
      code: "CS201", 
      name: "Data Structures and Algorithms", 
      semester: "Fall 2023",
      students: 35,
      assignments: [
        { 
          id: 1,
          name: "Assignment 1: Sorting Algorithms",
          dueDate: "2023-10-20",
          totalPoints: 100,
          submitted: 33,
          graded: 33,
          students: [
            { id: 5, name: "Edward Thompson", submitted: true, submissionDate: "2023-10-18", grade: 95, feedback: "Outstanding implementation of all algorithms." },
            { id: 6, name: "Fiona Garcia", submitted: true, submissionDate: "2023-10-19", grade: 87, feedback: "Good work but merge sort implementation has issues." },
            { id: 7, name: "George Martin", submitted: true, submissionDate: "2023-10-20", grade: 90, feedback: "Excellent analysis of time complexity." }
          ]
        },
        { 
          id: 2,
          name: "Assignment 2: Graph Algorithms",
          dueDate: "2023-11-15",
          totalPoints: 100,
          submitted: 32,
          graded: 30,
          students: [
            { id: 5, name: "Edward Thompson", submitted: true, submissionDate: "2023-11-14", grade: 88, feedback: "Good implementation of Dijkstra's algorithm." },
            { id: 6, name: "Fiona Garcia", submitted: true, submissionDate: "2023-11-15", grade: 92, feedback: "Excellent work on all graph algorithms." },
            { id: 7, name: "George Martin", submitted: true, submissionDate: "2023-11-15", grade: null, feedback: null }
          ]
        }
      ]
    },
    { 
      id: 3, 
      code: "CS350", 
      name: "Operating Systems", 
      semester: "Fall 2023",
      students: 28,
      assignments: [
        { 
          id: 1,
          name: "Assignment 1: Process Scheduling",
          dueDate: "2023-10-25",
          totalPoints: 100,
          submitted: 25,
          graded: 25,
          students: [
            { id: 8, name: "Hannah Lee", submitted: true, submissionDate: "2023-10-23", grade: 94, feedback: "Excellent implementation of all scheduling algorithms." },
            { id: 9, name: "Ian Wright", submitted: true, submissionDate: "2023-10-24", grade: 85, feedback: "Good work, but SRTF implementation has issues." },
            { id: 10, name: "Jessica Brown", submitted: true, submissionDate: "2023-10-25", grade: 90, feedback: "Very thorough analysis of results." }
          ]
        },
        { 
          id: 2,
          name: "Assignment 2: Memory Management",
          dueDate: "2023-11-20",
          totalPoints: 100,
          submitted: 26,
          graded: 22,
          students: [
            { id: 8, name: "Hannah Lee", submitted: true, submissionDate: "2023-11-18", grade: 89, feedback: "Good implementation of paging algorithms." },
            { id: 9, name: "Ian Wright", submitted: true, submissionDate: "2023-11-19", grade: null, feedback: null },
            { id: 10, name: "Jessica Brown", submitted: true, submissionDate: "2023-11-20", grade: 91, feedback: "Excellent analysis of fragmentation issues." }
          ]
        }
      ]
    }
  ];

  const handleOpenCourseModal = (course) => {
    setSelectedCourse(course);
    openCourseModal();
  };

  const handleOpenAssignmentModal = (assignment) => {
    setSelectedAssignment(assignment);
    closeCourseModal();
    openAssignmentModal();
  };

  const handleOpenStudentModal = (student) => {
    setSelectedStudent(student);
    closeAssignmentModal();
    openStudentModal();
  };

  const handleBackToAssignments = () => {
    closeStudentModal();
    openAssignmentModal();
  };
  // Render the courses list
  const renderCoursesList = () => {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Course</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Semester</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Students</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Assignments</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{course.code}: {course.name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                  {course.semester}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                  {course.students}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                  {course.assignments.length}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <Button
                    onClick={() => handleOpenCourseModal(course)}
                    className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    View Assignments
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render the assignments list for a course
  const renderAssignmentsList = () => {
    if (!selectedCourse) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedCourse.code}: {selectedCourse.name}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.submitted}/{selectedCourse.students} submitted ({getSubmissionRate(assignment)}%)
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.graded}/{assignment.submitted} graded ({getGradedRate(assignment)}%)
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-2 rounded-full bg-green-500 dark:bg-green-600" 
                          style={{ width: `${getGradedRate(assignment)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {selectedCourse.assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{assignment.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                    {assignment.totalPoints}
                  </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {assignment.submitted}/{selectedCourse.students} submitted ({getSubmissionRate(assignment)}%)
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {assignment.graded}/{assignment.submitted} graded ({getGradedRate(assignment)}%)
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div 
                                    className="h-2 rounded-full bg-green-500 dark:bg-green-600" 
                                    style={{ width: `${getGradedRate(assignment)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            };
          
            // Function to calculate submission rate
            const getSubmissionRate = (assignment: Assignment): number => {
              return Math.round((assignment.submitted / (selectedCourse?.students || 1)) * 100);
            };
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {assignment.submitted}/{selectedCourse.students} submitted ({getSubmissionRate(assignment)}%)
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {assignment.graded}/{assignment.submitted} graded ({getGradedRate(assignment)}%)
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div 
                            className="h-2 rounded-full bg-green-500 dark:bg-green-600" 
                            style={{ width: `${getGradedRate(assignment)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <Button
                        onClick={() => handleOpenAssignmentModal(assignment)}
                        className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        View Submissions
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <button 
                  </span>
                );
              } else if (student.grade !== null) {
                return (
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Graded
                  </span>
                );
              } else {
                return (
                  <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                    Needs Grading
                  </span>
                );
              }
            };
          
            // Function to go back to course assignments
            const handleBackToCourse = () => {
              closeAssignmentModal();
              openCourseModal();
            };
            </svg>
            Back to {selectedCourse.code} Assignments
          </button>
                    >
                      View Submissions
                    </Button>
                  </td>
                </tr>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</div>
            <div>Points: {selectedAssignment.totalPoints}</div>
            <div>Submissions: {selectedAssignment.submitted}/{selectedCourse.students}</div>
            <div>Graded: {selectedAssignment.graded}/{selectedAssignment.submitted}</div>
          </div>
        </div>

  // Render the student submissions for an assignment
  const renderStudentSubmissions = () => {
    if (!selectedAssignment) return null;
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <button 
            onClick={handleBackToCourse}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {selectedAssignment.students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
            Back to {selectedCourse.code} Assignments
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedAssignment.name}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400"></div>
            <div>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</div>
            <div>Points: {selectedAssignment.totalPoints}</div>
            <div>Submissions: {selectedAssignment.submitted}/{selectedCourse.students}</div>
            <div>Graded: {selectedAssignment.graded}/{selectedAssignment.submitted}</div>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Submission Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Grade</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]"></tbody>
              {selectedAssignment.students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getSubmissionStatusBadge(student)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                    {student.submitted ? new Date(student.submissionDate).toLocaleDateString() : "Not submitted"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                    {student.grade !== null ? `${student.grade}/${selectedAssignment.totalPoints}` : "Not graded"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {student.submitted && (
                      <div className="flex justify-center space-x-2">
                        <Button
                          onClick={() => handleOpenStudentModal(student)}
                          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          View
                        </Button>
                        <Button
                          className="inline-flex items-center justify-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          Download
                        </Button>
                        {student.grade === null && (
                          <Button
                            className="inline-flex items-center justify-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                          >
                            Grade
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render the student submission details
  const renderStudentSubmissionDetails = () => {
    if (!selectedStudent || !selectedAssignment) return null;
    
    return (
      <div className="space-y-6">
        <button 
          onClick={handleBackToAssignments}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Submissions
        </button>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedStudent.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedAssignment.name}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Submitted: {selectedStudent.submitted ? new Date(selectedStudent.submissionDate).toLocaleString() : "Not submitted"}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              {selectedStudent.grade !== null ? (
                <div className="rounded-md bg-green-50 px-4 py-2 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  <span className="text-lg font-bold">{selectedStudent.grade}/{selectedAssignment.totalPoints}</span>
                  <span className="text-sm"> Grade</span>
                </div>
              ) : (
                <Button
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Grade Submission
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Submission Preview</h4>
              <div className="rounded bg-white p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  [Student submission content would appear here. For now, this is a placeholder for the actual submission content.]
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Download Submission
                </Button>
                <Button
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Open in New Window
                </Button>
              </div>
            </div>
          </div>
          
          {selectedStudent.grade !== null && (
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Feedback</h4>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedStudent.feedback || "No feedback provided."}
                </p>
              </div>
            </div>
          )}
          
          {selectedStudent.grade === null && (
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Grade and Feedback</h4>
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Grade (out of {selectedAssignment.totalPoints})
                  </label>
                  <input
                    type="number"
                    max={selectedAssignment.totalPoints}
                    min={0}
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                    placeholder="Enter grade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Feedback
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                    placeholder="Enter feedback for the student"
                  ></textarea>
                </div>
                <Button
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Submit Grade
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <PageMeta
        title="Assignment Grading"
        description="Grade student assignments and manage course submissions"
      />
  
      {/* Header Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assignment Grading
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and grade student submissions for your courses
          </p>
        </div>
      </div>
  
      {/* Courses Overview */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Your Courses
        </h2>
        {renderCoursesList()}
      </div>
  
      {/* Course Assignments Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={closeCourseModal}>
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {renderAssignmentsList()}
        </div>
        <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
          <Button
            onClick={closeCourseModal}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Close
          </Button>
        </div>
      </Modal>
  
      {/* Assignment Submissions Modal */}
      <Modal isOpen={isAssignmentModalOpen} onClose={closeAssignmentModal}>
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {renderStudentSubmissions()}
        </div>
        <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
          <Button
            onClick={closeAssignmentModal}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Close
          </Button>
        </div>
      </Modal>
  
      {/* Student Submission Modal */}
      <Modal isOpen={isStudentModalOpen} onClose={closeStudentModal}>
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {renderStudentSubmissionDetails()}
        </div>
        <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
          <Button
            onClick={closeStudentModal}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
  