import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

// TODO : this will read from the struct saved
// TODO make UI constant with the overall frontend

export default function Grades() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Sample courses data with grades
  const courses = [
    { 
      id: 1, 
      code: "CS101", 
      name: "Introduction to Computer Science", 
      instructor: "Dr. Sarah Johnson", 
      status: "ongoing", 
      progress: 70,
      credits: 3,
      currentGrade: "B+",
      grades: {
        assignments: [
          { name: "Assignment 1", score: 85, totalPoints: 100 },
          { name: "Assignment 2", score: 92, totalPoints: 100 },
          { name: "Assignment 3", score: 78, totalPoints: 100 }
        ],
        quizzes: [
          { name: "Quiz 1", score: 18, totalPoints: 20 },
          { name: "Quiz 2", score: 16, totalPoints: 20 },
          { name: "Quiz 3", score: 19, totalPoints: 20 }
        ],
        midterm: { score: 76, totalPoints: 100 },
        final: null,
        labs: [
          { name: "Lab 1", score: 28, totalPoints: 30 },
          { name: "Lab 2", score: 27, totalPoints: 30 },
          { name: "Lab 3", score: 29, totalPoints: 30 }
        ]
      }
    },
    { 
      id: 2, 
      code: "MATH201", 
      name: "Calculus II", 
      instructor: "Prof. Robert Chen", 
      status: "ongoing", 
      progress: 65,
      credits: 4,
      currentGrade: "A-",
      grades: {
        assignments: [
          { name: "Problem Set 1", score: 94, totalPoints: 100 },
          { name: "Problem Set 2", score: 88, totalPoints: 100 }
        ],
        quizzes: [
          { name: "Quiz 1", score: 9, totalPoints: 10 },
          { name: "Quiz 2", score: 8, totalPoints: 10 }
        ],
        midterm: { score: 82, totalPoints: 100 },
        final: null,
        projects: [
          { name: "Application Project", score: 43, totalPoints: 50 }
        ]
      }
    },
    { 
      id: 3, 
      code: "PHY102", 
      name: "Physics for Engineers", 
      instructor: "Dr. Michael Williams", 
      status: "completed", 
      progress: 100,
      credits: 4,
      finalGrade: "A",
      grades: {
        assignments: [
          { name: "Problem Set 1", score: 95, totalPoints: 100 },
          { name: "Problem Set 2", score: 88, totalPoints: 100 },
          { name: "Problem Set 3", score: 92, totalPoints: 100 },
          { name: "Problem Set 4", score: 90, totalPoints: 100 }
        ],
        quizzes: [
          { name: "Quiz 1", score: 19, totalPoints: 20 },
          { name: "Quiz 2", score: 18, totalPoints: 20 },
          { name: "Quiz 3", score: 20, totalPoints: 20 },
          { name: "Quiz 4", score: 17, totalPoints: 20 }
        ],
        midterm: { score: 89, totalPoints: 100 },
        final: { score: 91, totalPoints: 100 },
        labs: [
          { name: "Lab 1", score: 47, totalPoints: 50 },
          { name: "Lab 2", score: 48, totalPoints: 50 },
          { name: "Lab 3", score: 49, totalPoints: 50 },
          { name: "Lab 4", score: 50, totalPoints: 50 }
        ]
      }
    },
    { 
      id: 4, 
      code: "ENG105", 
      name: "Technical Writing", 
      instructor: "Prof. Emily Rodriguez", 
      status: "completed", 
      progress: 100,
      credits: 3,
      finalGrade: "A-",
      grades: {
        assignments: [
          { name: "Essay 1", score: 87, totalPoints: 100 },
          { name: "Essay 2", score: 92, totalPoints: 100 },
          { name: "Research Paper", score: 85, totalPoints: 100 }
        ],
        quizzes: [
          { name: "Grammar Quiz 1", score: 18, totalPoints: 20 },
          { name: "Citation Quiz", score: 19, totalPoints: 20 }
        ],
        midterm: { score: 84, totalPoints: 100 },
        final: { score: 86, totalPoints: 100 },
        presentations: [
          { name: "Group Presentation", score: 92, totalPoints: 100 },
          { name: "Individual Presentation", score: 88, totalPoints: 100 }
        ]
      }
    },
    { 
      id: 5, 
      code: "CHEM101", 
      name: "General Chemistry", 
      instructor: "Dr. James Thompson", 
      status: "ongoing", 
      progress: 45,
      credits: 4,
      currentGrade: "B",
      grades: {
        assignments: [
          { name: "Problem Set 1", score: 82, totalPoints: 100 },
          { name: "Problem Set 2", score: 78, totalPoints: 100 }
        ],
        quizzes: [
          { name: "Quiz 1", score: 15, totalPoints: 20 },
          { name: "Quiz 2", score: 16, totalPoints: 20 }
        ],
        midterm: null,
        final: null,
        labs: [
          { name: "Lab 1", score: 46, totalPoints: 50 },
          { name: "Lab 2", score: 43, totalPoints: 50 }
        ]
      }
    },
    {
      id: 6,
      code: "HIST210",
      name: "World History",
      instructor: "Prof. David Clark",
      status: "completed",
      progress: 100,
      credits: 3,
      finalGrade: "B+",
      grades: {
        assignments: [
          { name: "Essay 1", score: 85, totalPoints: 100 },
          { name: "Essay 2", score: 82, totalPoints: 100 },
          { name: "Research Paper", score: 88, totalPoints: 100 }
        ],
        quizzes: [
          { name: "Quiz 1", score: 15, totalPoints: 20 },
          { name: "Quiz 2", score: 17, totalPoints: 20 },
          { name: "Quiz 3", score: 16, totalPoints: 20 }
        ],
        midterm: { score: 82, totalPoints: 100 },
        final: { score: 84, totalPoints: 100 },
        participation: { score: 90, totalPoints: 100 }
      }
    }
  ];

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    openModal();
  };

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</span>;
    } else {
      return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Ongoing</span>;
    }
  };

  const getGradeBadge = (grade) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";
    let darkBgColor = "dark:bg-gray-800";
    let darkTextColor = "dark:text-gray-300";

    if (grade) {
      if (grade.startsWith('A')) {
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        darkBgColor = "dark:bg-green-900/30";
        darkTextColor = "dark:text-green-300";
      } else if (grade.startsWith('B')) {
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        darkBgColor = "dark:bg-blue-900/30";
        darkTextColor = "dark:text-blue-300";
      } else if (grade.startsWith('C')) {
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        darkBgColor = "dark:bg-yellow-900/30";
        darkTextColor = "dark:text-yellow-300";
      } else if (grade.startsWith('D')) {
        bgColor = "bg-orange-100";
        textColor = "text-orange-800";
        darkBgColor = "dark:bg-orange-900/30";
        darkTextColor = "dark:text-orange-300";
      } else if (grade.startsWith('F')) {
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        darkBgColor = "dark:bg-red-900/30";
        darkTextColor = "dark:text-red-300";
      }
    }

    return (
      <span 
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor}`}
      >
        {grade}
      </span>
    );
  };

  const calculatePercentage = (score, totalPoints) => {
    return ((score / totalPoints) * 100).toFixed(1);
  };

  // Calculate GPA from courses
  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    const gradeValues = {
      'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };

    courses.forEach(course => {
      if (course.status === "completed") {
        totalPoints += gradeValues[course.finalGrade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';
  };

  // Progress bar color based on grade
  const getProgressBarColor = (grade) => {
    if (!grade) return "bg-gray-200 dark:bg-gray-700";
    
    if (grade.startsWith('A')) {
      return "bg-green-500 dark:bg-green-600";
    } else if (grade.startsWith('B')) {
      return "bg-blue-500 dark:bg-blue-600";
    } else if (grade.startsWith('C')) {
      return "bg-yellow-500 dark:bg-yellow-600";
    } else if (grade.startsWith('D')) {
      return "bg-orange-500 dark:bg-orange-600";
    } else if (grade.startsWith('F')) {
      return "bg-red-500 dark:bg-red-600";
    }
    
    return "bg-gray-200 dark:bg-gray-700";
  };

  // Render the detailed grade breakdown in the modal
  const renderGradeBreakdown = () => {
    if (!selectedCourse) return null;
    
    const grades = selectedCourse.grades;
    
    // Function to render a section of grades
    const renderGradeSection = (title, items) => {
      if (!items || (Array.isArray(items) && items.length === 0)) return null;
      
      return (
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Item</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Score</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                {Array.isArray(items) ? (
                  items.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{item.score} / {item.totalPoints}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-500 dark:text-gray-400">
                        {calculatePercentage(item.score, item.totalPoints)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{title}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{items.score} / {items.totalPoints}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-500 dark:text-gray-400">
                      {calculatePercentage(items.score, items.totalPoints)}%
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedCourse.code}: {selectedCourse.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Instructor: {selectedCourse.instructor}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {getStatusBadge(selectedCourse.status)}
              {selectedCourse.status === "completed" ? 
                getGradeBadge(selectedCourse.finalGrade) : 
                getGradeBadge(selectedCourse.currentGrade)}
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {selectedCourse.credits} {selectedCourse.credits === 1 ? 'Credit' : 'Credits'}
              </span>
            </div>
          </div>
          
          {selectedCourse.status === "completed" && (
            <div className="mt-4 rounded-md bg-green-50 px-4 py-2 text-green-800 dark:bg-green-900/20 dark:text-green-300 sm:mt-0">
              <span className="text-lg font-bold">{selectedCourse.finalGrade}</span>
              <span className="text-sm"> Final Grade</span>
            </div>
          )}
        </div>

        <div className="mx-auto h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {/* Render each type of grade section */}
        {renderGradeSection("Assignments", grades.assignments)}
        {renderGradeSection("Quizzes", grades.quizzes)}
        {renderGradeSection("Labs", grades.labs)}
        {renderGradeSection("Projects", grades.projects)}
        {renderGradeSection("Presentations", grades.presentations)}
        {renderGradeSection("Participation", grades.participation)}
        {grades.midterm && renderGradeSection("Midterm Exam", grades.midterm)}
        {grades.final && renderGradeSection("Final Exam", grades.final)}

        {/* Overall summary */}
        {selectedCourse.status === "completed" && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Grade Summary</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You completed this course with a final grade of <span className="font-medium text-gray-900 dark:text-white">{selectedCourse.finalGrade}</span>.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Grades and Results"
        description="View your course grades and detailed results"
      />
      
      {/* Header Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grades and Results</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                View your course grades, assignment scores, and overall performance.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cumulative GPA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateGPA()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Summary */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Semester Summary</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overall performance across all courses
          </p>
          
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Completed Courses</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.filter(course => course.status === "completed").length}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">out of {courses.length} total</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Credits Completed</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.filter(course => course.status === "completed").reduce((sum, course) => sum + course.credits, 0)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Course Grades</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a completed course to view detailed results
          </p>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Course</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Grade</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Progress</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900 dark:text-white">{course.code}: {course.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{course.instructor}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.status === "completed" ? 
                      getGradeBadge(course.finalGrade) : 
                      getGradeBadge(course.currentGrade)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="mr-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className={`h-2.5 rounded-full ${getProgressBarColor(course.status === "completed" ? course.finalGrade : course.currentGrade)}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{course.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {course.status === "completed" ? (
                      <Button
                        onClick={() => handleOpenModal(course)}
                        className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        View Result
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Grade Modal */}
      {selectedCourse && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {renderGradeBreakdown()}
          </div>
          <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
            <Button
              onClick={closeModal}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}