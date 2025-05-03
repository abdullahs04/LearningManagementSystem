import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { PlusCircle, CheckCircle, CalendarDays,  Download, BookOpen, List, Hash, Tag, ChevronRight,  Trash2, Eye,  ClipboardEdit } from 'lucide-react';


enum GradableType {
  Assignment = "Assignment",
  Monthly = "Monthly",
  Sendup = "Sendup",
  Mocks = "Mocks",
  Weeklies = "Weeklies",
  TestSession = "Test Session",
  FullBook = "Full Book",
  HalfBook = "Half Book",
}

interface Student {
  id: number;
  name: string;
}

interface Course {
  id: number;
  code: string;
  name: string;
  semester: string;
  studentIds: number[];
}

interface GradableItem {
  id: number;
  courseId: number;
  type: GradableType;
  name: string;
  description?: string;
  dueDate?: string;
  totalPoints: number;
  creationDate: string;
  attachmentUrl?: string;
}

interface StudentResult {
  gradableItemId: number;
  studentId: number;
  submitted: boolean;
  submissionDate: string | null;
  score: number | null; 
  feedback: string | null; 
}

const sampleStudents: Student[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Davis" },
  { id: 4, name: "Diana Wilson" },
  { id: 5, name: "Edward Thompson" },
  { id: 6, name: "Fiona Garcia" },
  { id: 7, name: "George Martin" },
  { id: 8, name: "Hannah Lee" },
  { id: 9, name: "Ian Wright" },
  { id: 10, name: "Jessica Brown" },
];

const sampleCourses: Course[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    semester: "Fall 2023",
    studentIds: [1, 2, 3, 4],
  },
  {
    id: 2,
    code: "CS201",
    name: "Data Structures and Algorithms",
    semester: "Fall 2023",
    studentIds: [5, 6, 7],
  },
  {
    id: 3,
    code: "CS350",
    name: "Operating Systems",
    semester: "Fall 2023",
    studentIds: [8, 9, 10],
  },
];

const sampleGradableItems: GradableItem[] = [
  // From Grading.tsx (CS101)
  { id: 1, courseId: 1, type: GradableType.Assignment, name: "Assignment 1: Basic Programming", dueDate: "2023-10-15", totalPoints: 100, creationDate: new Date(2023, 9, 1).toISOString() },
  { id: 2, courseId: 1, type: GradableType.Assignment, name: "Assignment 2: Data Structures", dueDate: "2023-11-05", totalPoints: 100, creationDate: new Date(2023, 10, 1).toISOString() },
  { id: 3, courseId: 1, type: GradableType.Assignment, name: "Final Project: Building a Web App", dueDate: "2023-12-10", totalPoints: 200, creationDate: new Date(2023, 11, 1).toISOString() },
  // From ResultSubmission.tsx (Adapted)
  { id: 4, courseId: 1, type: GradableType.Weeklies, name: "Week 1 Quiz", totalPoints: 10, creationDate: new Date(2023, 9, 1).toISOString() }, // Merged with original assessment 1
  { id: 5, courseId: 1, type: GradableType.Monthly, name: "October Test", totalPoints: 50, creationDate: new Date(2023, 9, 15).toISOString() }, // Renamed from March test
  // From Grading.tsx (CS201)
  { id: 6, courseId: 2, type: GradableType.Assignment, name: "Assignment 1: Sorting Algorithms", dueDate: "2023-10-20", totalPoints: 100, creationDate: new Date(2023, 9, 10).toISOString() },
  { id: 7, courseId: 2, type: GradableType.Assignment, name: "Assignment 2: Graph Algorithms", dueDate: "2023-11-15", totalPoints: 100, creationDate: new Date(2023, 10, 10).toISOString() },
  // From ResultSubmission.tsx (Adapted)
  { id: 8, courseId: 2, type: GradableType.Weeklies, name: "Week 1 Algo Quiz", totalPoints: 15, creationDate: new Date(2023, 9, 5).toISOString() }, // Merged with original assessment 3
  // From Grading.tsx (CS350)
  { id: 9, courseId: 3, type: GradableType.Assignment, name: "Assignment 1: Process Scheduling", dueDate: "2023-10-25", totalPoints: 100, creationDate: new Date(2023, 9, 15).toISOString() },
  { id: 10, courseId: 3, type: GradableType.Assignment, name: "Assignment 2: Memory Management", dueDate: "2023-11-20", totalPoints: 100, creationDate: new Date(2023, 10, 15).toISOString() },
];

const sampleStudentResults: StudentResult[] = [
  // Results for GradableItem 1 (CS101 - Assignment 1)
  { gradableItemId: 1, studentId: 1, submitted: true, submissionDate: "2023-10-14", score: 85, feedback: "Good work, but could improve code organization." },
  { gradableItemId: 1, studentId: 2, submitted: true, submissionDate: "2023-10-15", score: 92, feedback: "Excellent solution!" },
  { gradableItemId: 1, studentId: 3, submitted: true, submissionDate: "2023-10-15", score: 78, feedback: "Several logical errors in the implementation." },
  { gradableItemId: 1, studentId: 4, submitted: false, submissionDate: null, score: null, feedback: null },
  // Results for GradableItem 2 (CS101 - Assignment 2)
  { gradableItemId: 2, studentId: 1, submitted: true, submissionDate: "2023-11-03", score: 90, feedback: "Very well organized solution." },
  { gradableItemId: 2, studentId: 2, submitted: true, submissionDate: "2023-11-04", score: 88, feedback: "Good implementation but missing some edge cases." },
  { gradableItemId: 2, studentId: 3, submitted: true, submissionDate: "2023-11-05", score: null, feedback: "Needs improvement in time complexity." }, // Needs grading
  { gradableItemId: 2, studentId: 4, submitted: true, submissionDate: "2023-11-05", score: null, feedback: null }, // Needs grading
  // Results for GradableItem 3 (CS101 - Final Project)
  { gradableItemId: 3, studentId: 1, submitted: true, submissionDate: "2023-12-09", score: 180, feedback: "Impressive project with excellent documentation!" },
  { gradableItemId: 3, studentId: 2, submitted: true, submissionDate: "2023-12-10", score: 175, feedback: "Very good project, UI could use improvements." },
  { gradableItemId: 3, studentId: 3, submitted: true, submissionDate: "2023-12-10", score: null, feedback: null }, // Needs grading
  { gradableItemId: 3, studentId: 4, submitted: false, submissionDate: null, score: null, feedback: null },
   // Results for GradableItem 4 (CS101 - Week 1 Quiz) - From ResultSubmission data
  { gradableItemId: 4, studentId: 1, submitted: true, submissionDate: "2023-10-01", score: 8, feedback: null },
  { gradableItemId: 4, studentId: 2, submitted: true, submissionDate: "2023-10-01", score: 9, feedback: null },
  { gradableItemId: 4, studentId: 3, submitted: true, submissionDate: "2023-10-01", score: 6, feedback: null },
  { gradableItemId: 4, studentId: 4, submitted: true, submissionDate: "2023-10-01", score: 7, feedback: null },
  // Results for GradableItem 6 (CS201 - Assignment 1)
  { gradableItemId: 6, studentId: 5, submitted: true, submissionDate: "2023-10-18", score: 95, feedback: "Outstanding implementation of all algorithms." },
  { gradableItemId: 6, studentId: 6, submitted: true, submissionDate: "2023-10-19", score: 87, feedback: "Good work but merge sort implementation has issues." },
  { gradableItemId: 6, studentId: 7, submitted: true, submissionDate: "2023-10-20", score: 90, feedback: "Excellent analysis of time complexity." },
   // Results for GradableItem 7 (CS201 - Assignment 2)
  { gradableItemId: 7, studentId: 5, submitted: true, submissionDate: "2023-11-14", score: 88, feedback: "Good implementation of Dijkstra's algorithm." },
  { gradableItemId: 7, studentId: 6, submitted: true, submissionDate: "2023-11-15", score: 92, feedback: "Excellent work on all graph algorithms." },
  { gradableItemId: 7, studentId: 7, submitted: true, submissionDate: "2023-11-15", score: null, feedback: null }, // Needs grading
  // Results for GradableItem 9 (CS350 - Assignment 1)
  { gradableItemId: 9, studentId: 8, submitted: true, submissionDate: "2023-10-23", score: 94, feedback: "Excellent implementation of all scheduling algorithms." },
  { gradableItemId: 9, studentId: 9, submitted: true, submissionDate: "2023-10-24", score: 85, feedback: "Good work, but SRTF implementation has issues." },
  { gradableItemId: 9, studentId: 10, submitted: true, submissionDate: "2023-10-25", score: 90, feedback: "Very thorough analysis of results." },
  // Results for GradableItem 10 (CS350 - Assignment 2)
  { gradableItemId: 10, studentId: 8, submitted: true, submissionDate: "2023-11-18", score: 89, feedback: "Good implementation of paging algorithms." },
  { gradableItemId: 10, studentId: 9, submitted: true, submissionDate: "2023-11-19", score: null, feedback: null }, // Needs grading
  { gradableItemId: 10, studentId: 10, submitted: true, submissionDate: "2023-11-20", score: 91, feedback: "Excellent analysis of fragmentation issues." },
];



export default function GradingAndAssessments() {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [gradableItems, setGradableItems] = useState<GradableItem[]>(sampleGradableItems);
  const [studentResults, setStudentResults] = useState<StudentResult[]>(sampleStudentResults);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedGradableItem, setSelectedGradableItem] = useState<GradableItem | null>(null);
  const [editingStudentResult, setEditingStudentResult] = useState<StudentResult | null>(null);
  const [currentBulkMarks, setCurrentBulkMarks] = useState<Record<number, { score: number | null; feedback: string | null }>>({});


  const { isOpen: isCreateItemModalOpen, openModal: openCreateItemModal, closeModal: closeCreateItemModal } = useModal();
  const { isOpen: isGradingModalOpen, openModal: openGradingModal, closeModal: closeGradingModal } = useModal();
  const { isOpen: isStudentDetailModalOpen, openModal: openStudentDetailModal, closeModal: closeStudentDetailModal } = useModal();

  const getStudentById = (id: number): Student | undefined => students.find(s => s.id === id);
  const getResultsForGradableItem = (itemId: number): StudentResult[] => {
      return studentResults.filter(r => r.gradableItemId === itemId);
  };
  const getStudentsForCourse = (courseId: number): Student[] => {
      const course = courses.find(c => c.id === courseId);
      if (!course) return [];
      return students.filter(s => course.studentIds.includes(s.id));
  };
  const getGradableItemsForCourse = (courseId: number): GradableItem[] => {
      return gradableItems
          .filter(item => item.courseId === courseId)
          .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  };
  const getStudentResult = (itemId: number, studentId: number): StudentResult | undefined => {
    return studentResults.find(r => r.gradableItemId === itemId && r.studentId === studentId);
  }

  const getItemStats = (item: GradableItem) => {
      const results = getResultsForGradableItem(item.id);
      const courseStudents = getStudentsForCourse(item.courseId).length;
      const submittedCount = results.filter(r => r.submitted).length;
      const gradedCount = results.filter(r => r.submitted && r.score !== null).length;
      const needsGradingCount = submittedCount - gradedCount;

      return {
          totalStudents: courseStudents,
          submittedCount,
          gradedCount,
          needsGradingCount,
          submissionRate: courseStudents > 0 ? Math.round((submittedCount / courseStudents) * 100) : 0,
          gradedRate: submittedCount > 0 ? Math.round((gradedCount / submittedCount) * 100) : 0,
      };
  };


  const handleSelectCourse = (course: Course) => {
      setSelectedCourse(course);
      setSelectedGradableItem(null);
      setEditingStudentResult(null);
  };

  const handleOpenCreateItem = () => {
      if (!selectedCourse) return;
      openCreateItemModal();
  }

  const handleCreateGradableItem = (newItemData: Omit<GradableItem, 'id' | 'creationDate'>) => {
      const newId = gradableItems.length > 0 ? Math.max(...gradableItems.map(a => a.id)) + 1 : 1;
      const creationDate = new Date().toISOString();
      const newItem: GradableItem = {
          ...newItemData,
          id: newId,
          creationDate,
      };
      setGradableItems(prev => [...prev, newItem].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()));

      const courseStudents = getStudentsForCourse(newItem.courseId);
      const initialResults: StudentResult[] = courseStudents.map(student => ({
        gradableItemId: newId,
        studentId: student.id,
        submitted: false,
        submissionDate: null,
        score: null,
        feedback: null,
      }));
      setStudentResults(prev => [...prev, ...initialResults]);

      closeCreateItemModal();
  };

   const handleDeleteGradableItem = (itemId: number) => {
     if (window.confirm("Are you sure you want to delete this item and all associated results? This cannot be undone.")) {
       setGradableItems(prev => prev.filter(item => item.id !== itemId));
       setStudentResults(prev => prev.filter(result => result.gradableItemId !== itemId));
       if(selectedGradableItem?.id === itemId) {
           setSelectedGradableItem(null);
           closeGradingModal(); // Close modal if the deleted item was open
       }
     }
   };
   const handleOpenGradingModal = (item: GradableItem) => {
       setSelectedGradableItem(item);
       const results = getResultsForGradableItem(item.id);
       const initialMarks: Record<number, { score: number | null; feedback: string | null }> = {};
       const courseStudents = getStudentsForCourse(item.courseId);
       courseStudents.forEach(student => {
           const result = results.find(r => r.studentId === student.id);
           initialMarks[student.id] = {
               score: result?.score ?? null,
               feedback: result?.feedback ?? null,
           };
       });

       setCurrentBulkMarks(initialMarks);
       openGradingModal();
   };

   const handleCloseGrading = () => {
       closeGradingModal();
       setCurrentBulkMarks({});
   };


   const handleBulkInputChange = (studentId: number, field: 'score' | 'feedback', value: string | number | null) => {
       if (selectedGradableItem && field === 'score') {
           const scoreVal = value === '' || value === null ? null : parseInt(String(value), 10);
            if (scoreVal !== null && (isNaN(scoreVal) || scoreVal < 0 || scoreVal > selectedGradableItem.totalPoints)) {
                return;
            }
            setCurrentBulkMarks(prev => ({
              ...prev,
              [studentId]: { ...prev[studentId], score: scoreVal }
            }));
       } else if (field === 'feedback') {
            setCurrentBulkMarks(prev => ({
              ...prev,
              [studentId]: { ...prev[studentId], feedback: String(value ?? '') }
            }));
       }
   };

  const handleSaveBulkChanges = () => {
    if (!selectedGradableItem) return;
    const itemId = selectedGradableItem.id;
    const courseStudents = getStudentsForCourse(selectedGradableItem.courseId);
    const updatedResultsForThisItem: StudentResult[] = [];

    courseStudents.forEach(student => {
        const currentData = currentBulkMarks[student.id];
        const existingResult = getStudentResult(itemId, student.id);

        const updatedResult: StudentResult = {
            gradableItemId: itemId,
            studentId: student.id,
            submitted: existingResult?.submitted || (currentData?.score !== null),
            submissionDate: existingResult?.submissionDate ?? ((currentData?.score !== null) ? new Date().toISOString() : null),
            score: currentData?.score ?? null,
            feedback: currentData?.feedback ?? null,
        };
        updatedResultsForThisItem.push(updatedResult);
    });


    setStudentResults(prevResults => [
        ...prevResults.filter(mark => mark.gradableItemId !== itemId),
        ...updatedResultsForThisItem
    ]);

    handleCloseGrading();
  };
  const handleOpenStudentDetail = (result: StudentResult) => {
    setEditingStudentResult(result);
    openStudentDetailModal();
  };

  const handleSaveStudentDetail = (updatedResult: StudentResult) => {
    setStudentResults(prev => prev.map(r =>
      (r.gradableItemId === updatedResult.gradableItemId && r.studentId === updatedResult.studentId)
        ? updatedResult
        : r
    ));
    closeStudentDetailModal();
    setEditingStudentResult(null);

     if (selectedGradableItem?.id === updatedResult.gradableItemId) {
       setCurrentBulkMarks(prev => ({
         ...prev,
         [updatedResult.studentId]: { score: updatedResult.score, feedback: updatedResult.feedback }
       }));
     }
  };

  const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
      } catch (e) {
        return 'Invalid Date';
      }
  };

   const formatDateTime = (dateString: string | null | undefined): string => {
      if (!dateString) return '-';
       try {
        return new Date(dateString).toLocaleString(undefined, {
             year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
       } catch (e) {
          return 'Invalid Date';
       }
   };

  // Badge for student submission status
  const getSubmissionStatusBadge = (result: StudentResult | undefined) => {
    if (!result || !result.submitted) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/20 dark:text-red-300">
          Not Submitted
        </span>
      );
    } else if (result.score !== null) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-300">
          Graded
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
          Needs Grading
        </span>
      );
    }
  };


  // Render list of courses
  const renderCourseList = () => (
      <div className="space-y-2">
          {courses.map((course) => (
              <button
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors duration-150 ease-in-out flex justify-between items-center ${
                      selectedCourse?.id === course.id
                          ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
              >
                  <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{course.code}: {course.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{course.semester} - {course.studentIds.length} students</div>
                  </div>
                  <ChevronRight size={18} className={`text-gray-400 transition-transform ${selectedCourse?.id === course.id ? 'translate-x-1' : ''}`}/>
              </button>
          ))}
      </div>
  );

  const renderCourseDetails = () => {
      if (!selectedCourse) {
          return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Select a course to view details.</div>;
      }
      const items = getGradableItemsForCourse(selectedCourse.id);
      return (
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCourse.code}: {selectedCourse.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCourse.semester}</p>
                </div>
                <Button onClick={handleOpenCreateItem} variant="primary" className="flex items-center gap-2">
                   <PlusCircle size={18} /> Create Item
                </Button>
              </div>
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-700">Gradable Items</h3>
                  {items.length === 0 ? (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No gradable items created for this course yet.</p>
                  ) : (
                      <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-800/50">
                                  <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Due Date</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Points</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                                  {items.map((item) => {
                                      const stats = getItemStats(item);
                                      return (
                                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                              <td className="whitespace-nowrap px-4 py-3">
                                                  <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                  {item.description && <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{item.description}</div>}
                                              </td>
                                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.type}</td>
                                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(item.dueDate)}</td>
                                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.totalPoints}</td>
                                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                  <div className="flex flex-col text-xs">
                                                      <span>{stats.submittedCount}/{stats.totalStudents} Submitted ({stats.submissionRate}%)</span>
                                                      <span>{stats.gradedCount}/{stats.submittedCount} Graded ({stats.gradedRate}%)</span>
                                                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                          <div className={`h-1.5 rounded-full ${stats.gradedRate > 0 ? 'bg-green-500' : ''}`} style={{ width: `${stats.gradedRate}%` }}></div>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium">
                                                  <div className="flex justify-center items-center gap-2">
                                                      <Button onClick={() => handleOpenGradingModal(item)} variant="outline" size="sm" className="gap-1">
                                                          <ClipboardEdit size={14}/> Grade
                                                      </Button>
                                                       {/* Add Edit/Delete buttons later */}
                                                      <Button onClick={() => handleDeleteGradableItem(item.id)} variant="outline" size="sm" aria-label="Delete Item" className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-500 dark:border-red-700 dark:hover:bg-red-900/20">
                                                          <Trash2 size={14}/>
                                                      </Button>
                                                  </div>
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>
          </div>
      );
  };

 const renderGradingModalContent = () => {
    if (!selectedGradableItem || !selectedCourse) return null;

    const courseStudents = getStudentsForCourse(selectedCourse.id);
    const itemStats = getItemStats(selectedGradableItem);


    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardEdit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
             Grade: {selectedGradableItem.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Course: {selectedCourse.name} | Type: {selectedGradableItem.type} | Total Points: {selectedGradableItem.totalPoints}
          </p>
           <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
             {itemStats.submittedCount}/{itemStats.totalStudents} Submitted | {itemStats.gradedCount}/{itemStats.submittedCount} Graded | {itemStats.needsGradingCount} Needs Grading
           </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
           {courseStudents.length > 0 ? (
             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                 <tr>
                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Student</th>
                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                   <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Score ({selectedGradableItem.totalPoints})</th>
                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Feedback</th>
                   <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                 {courseStudents.map(student => {
                   const result = getStudentResult(selectedGradableItem.id, student.id);
                   const currentEdit = currentBulkMarks[student.id] ?? { score: null, feedback: null };

                   return (
                     <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                       <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                         {student.name}
                       </td>
                       <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {getSubmissionStatusBadge(result)}
                          {result?.submitted && (
                              <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(result.submissionDate)}</div>
                          )}
                       </td>
                       <td className="whitespace-nowrap px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max={selectedGradableItem.totalPoints}
                            value={currentEdit.score ?? ''}
                            onChange={(e) => handleBulkInputChange(student.id, 'score', e.target.value)}
                            className="w-20 rounded-md border-gray-300 p-1.5 text-center shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm disabled:opacity-50"
                            placeholder={`/${selectedGradableItem.totalPoints}`}
                            disabled={!result?.submitted} // Disable if not submitted
                          />
                       </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={currentEdit.feedback ?? ''}
                            onChange={(e) => handleBulkInputChange(student.id, 'feedback', e.target.value)}
                            className="w-full rounded-md border-gray-300 p-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm disabled:opacity-50"
                            placeholder="Add feedback..."
                            disabled={!result?.submitted} // Disable if not submitted
                          />
                       </td>
                       <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                         <div className="flex justify-center gap-2">
                           {result?.submitted && (
                             <Button
                               variant="outline"
                               size="sm"
                               aria-label="View Details"
                               onClick={() => result && handleOpenStudentDetail(result)}
                               className="border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                             >
                               <Eye className="w-4 h-4" />
                             </Button>
                           )}
                           {/* Placeholder for Download */}
                           <Button
                              variant="outline"
                              size="sm"
                              aria-label="Download Submission"
                              disabled={!result?.submitted}
                              className="border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                              onClick={() => console.log(`Download for ${student.name}`)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                         </div>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           ) : (
             <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No students enrolled in this course.</p>
           )}
         </div>

         {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <Button onClick={handleCloseGrading} variant="outline">Cancel</Button>
          <Button onClick={handleSaveBulkChanges} variant="primary" className="flex items-center gap-1">
            <CheckCircle size={16}/> Save Changes
          </Button>
        </div>
      </div>
    );
 };


 // Render the modal for creating a new gradable item
 const renderCreateItemModalContent = () => {
     if (!selectedCourse) return null;

     return (
          <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const type = formData.get('type') as GradableType;
              const totalPoints = parseInt(formData.get('totalPoints') as string, 10);
              const name = formData.get('name') as string || `${type} - ${new Date().toLocaleDateString()}`; // Default name
              const description = formData.get('description') as string || undefined;
              const dueDate = formData.get('dueDate') as string || undefined;
              const attachmentUrl = formData.get('attachmentUrl') as string || undefined;

              if (type && !isNaN(totalPoints) && totalPoints > 0 && name) {
                 handleCreateGradableItem({
                    courseId: selectedCourse.id,
                    type,
                    name,
                    description,
                    dueDate: dueDate || undefined, // Ensure empty string becomes undefined
                    totalPoints,
                    attachmentUrl
                 });
              } else {
                  alert("Please fill in all required fields correctly (Type, Name, Total Points).");
              }
          }}>
            <div className="p-6">
              <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Create New Gradable Item for {selectedCourse.code}
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {/* Item Name (Required) */}
                 <div className="space-y-1">
                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                     Item Name <span className="text-red-500">*</span>
                   </label>
                   <div className="relative rounded-lg shadow-sm">
                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                           <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                       </div>
                       <input
                         type="text"
                         id="name"
                         name="name"
                         required
                         placeholder="e.g., Midterm Exam, Homework 3"
                         className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       />
                   </div>
                 </div>

                {/* Type and Total Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                       Type <span className="text-red-500">*</span>
                     </label>
                     <div className="relative rounded-lg shadow-sm">
                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                           <List className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                       </div>
                       <select
                           id="type"
                           name="type"
                           required
                           className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                           defaultValue={GradableType.Assignment} // Default to Assignment
                       >
                           {Object.values(GradableType).map(type => (
                           <option key={type} value={type}>{type}</option>
                           ))}
                       </select>
                     </div>
                   </div>
                   <div className="space-y-1">
                     <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                       Total Points <span className="text-red-500">*</span>
                     </label>
                     <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                           <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                           type="number"
                           id="totalPoints"
                           name="totalPoints"
                           required
                           min="1"
                           className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                           placeholder="e.g., 100"
                        />
                     </div>
                   </div>
                 </div>

                 {/* Due Date (Optional) */}
                  <div className="space-y-1">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                       Due Date (Optional)
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                       </div>
                       <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       />
                    </div>
                  </div>

                 {/* Description (Optional) */}
                 <div className="space-y-1">
                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                     Description / Instructions (Optional)
                   </label>
                   <div className="relative rounded-lg shadow-sm">
                      <textarea
                       id="description"
                       name="description"
                       rows={3}
                       placeholder="Enter any instructions, links, or description..."
                       className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                   </div>
                 </div>

                 {/* Attachment URL (Optional) */}
                 <div className="space-y-1">
                   <label htmlFor="attachmentUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                     Attachment URL (Optional)
                   </label>
                   <div className="relative rounded-lg shadow-sm">
                       <input
                         type="url"
                         id="attachmentUrl"
                         name="attachmentUrl"
                         placeholder="https://example.com/document.pdf"
                         className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       />
                   </div>
                 </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <Button onClick={closeCreateItemModal} variant="outline">
                Cancel
              </Button>
              <Button variant="primary" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Create Item
              </Button>
            </div>
          </form>
     );
 };

 // Render the modal for viewing/editing a single student's result details
 const renderStudentDetailModalContent = () => {
    if (!editingStudentResult || !selectedGradableItem) return null;

    const student = getStudentById(editingStudentResult.studentId);
    // Local state for the form within this modal
    const [currentScore, setCurrentScore] = useState<string>(editingStudentResult.score?.toString() ?? '');
    const [currentFeedback, setCurrentFeedback] = useState<string>(editingStudentResult.feedback ?? '');

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const scoreVal = e.target.value;
       if (scoreVal === '' || (/^\d+$/.test(scoreVal) && parseInt(scoreVal, 10) >= 0 && parseInt(scoreVal, 10) <= selectedGradableItem!.totalPoints)) {
         setCurrentScore(scoreVal);
       }
    };

    const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentFeedback(e.target.value);
    };

    const handleDetailSave = () => {
        const scoreValue = currentScore === '' ? null : parseInt(currentScore, 10);
        handleSaveStudentDetail({
            ...editingStudentResult,
            score: scoreValue,
            feedback: currentFeedback || null, // Ensure empty string becomes null
            // Re-affirm submission status based on score presence? Or keep original? Keep original for now.
            submitted: editingStudentResult.submitted || (scoreValue !== null),
            submissionDate: editingStudentResult.submissionDate ?? ((scoreValue !== null) ? new Date().toISOString() : null)
        });
    };


    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-4">
          Grade Details: {student?.name}
        </h3>
         <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Item: {selectedGradableItem.name}</p>
         <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Submitted: {formatDateTime(editingStudentResult.submissionDate)}</p>


         {/* Submission Preview Placeholder */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Submission Preview</h4>
            <div className="rounded bg-white p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
                [Student submission content/link would appear here. This is a placeholder.]
            </p>
            </div>
            <div className="mt-4 flex space-x-2">
            <Button
                size="sm"
                className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
                Download Submission
            </Button>
            {/* <Button
                 size="sm"
                 className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                Open in New Window
            </Button> */}
            </div>
        </div>

        {/* Grading Form */}
        <div className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               Grade (out of {selectedGradableItem.totalPoints})
             </label>
             <input
               type="number"
               value={currentScore}
               onChange={handleScoreChange}
               max={selectedGradableItem.totalPoints}
               min={0}
               className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
               placeholder="Enter score"
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               Feedback
             </label>
             <textarea
               rows={4}
               value={currentFeedback}
               onChange={handleFeedbackChange}
               className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
               placeholder="Enter feedback for the student"
             ></textarea>
           </div>
         </div>

         {/* Modal Actions */}
         <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-700">
            <Button onClick={() => { closeStudentDetailModal(); setEditingStudentResult(null); }} variant="outline">
                Cancel
            </Button>
            <Button onClick={handleDetailSave} variant="primary">
                Save Grade
            </Button>
         </div>
      </div>
    );
 };


  // --- Main Render ---

  return (
    <>
      <PageMeta
        title="Grading & Assessments"
        description="Manage course assignments, tests, and student results."
      />

      {/* Header */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grading & Assessments</h1>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Manage items and grade student submissions for your courses.
                  </p>
              </div>
              {/* Maybe add a global create button here later if needed */}
          </div>
      </div>

      {/* Main Layout: Course List | Course Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Course List Column */}
          <div className="md:col-span-1 lg:col-span-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 h-fit">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b pb-2 dark:border-gray-700 flex items-center gap-2">
                 <BookOpen size={18}/> Your Courses
              </h2>
              {renderCourseList()}
          </div>
          <div className="md:col-span-2 lg:col-span-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:p-6 min-h-[300px]">
              {renderCourseDetails()}
          </div>
      </div>
       <Modal isOpen={isCreateItemModalOpen} onClose={closeCreateItemModal}>
           {renderCreateItemModalContent()}
       </Modal>
       <Modal isOpen={isGradingModalOpen} onClose={handleCloseGrading}>
          {renderGradingModalContent()}
       </Modal>
      <Modal isOpen={isStudentDetailModalOpen} onClose={() => { closeStudentDetailModal(); setEditingStudentResult(null); }}>
         {renderStudentDetailModalContent()}
      </Modal>

    </>
  );
} 