import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

interface Student {
  id: number;
  name: string;
  attendance: number;
  assignments: number;
  midterm: number;
  final: number;
  totalGrade: string;
  submitted: boolean;
}

interface Course {
  id: number;
  code: string;
  name: string;
  semester: string;
  studentsCount: number;
  submissionStatus: string;
  students: Student[];
}

export default function ResultSubmission() {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [submissionStatus, setSubmissionStatus] = useState<Record<number, string>>({});

    // Sample courses data for teacher
    const courses: Course[] = [
        { 
            id: 1, 
            code: "CS101", 
            name: "Introduction to Computer Science", 
            semester: "Spring 2023",
            studentsCount: 32,
            submissionStatus: "pending",
            students: [
                { id: 101, name: "Alice Johnson", attendance: 92, assignments: 87, midterm: 78, final: 85, totalGrade: "B+", submitted: false },
                { id: 102, name: "Bob Smith", attendance: 85, assignments: 92, midterm: 88, final: 90, totalGrade: "A-", submitted: false },
                { id: 103, name: "Carol Williams", attendance: 78, assignments: 81, midterm: 76, final: 79, totalGrade: "B", submitted: false },
                { id: 104, name: "David Brown", attendance: 95, assignments: 94, midterm: 92, final: 96, totalGrade: "A", submitted: false },
                { id: 105, name: "Emma Davis", attendance: 88, assignments: 85, midterm: 82, final: 84, totalGrade: "B+", submitted: false }
            ]
        },
        { 
            id: 2, 
            code: "CS202", 
            name: "Data Structures", 
            semester: "Spring 2023",
            studentsCount: 28,
            submissionStatus: "pending",
            students: [
                { id: 201, name: "Frank Miller", attendance: 90, assignments: 88, midterm: 85, final: 87, totalGrade: "B+", submitted: false },
                { id: 202, name: "Grace Taylor", attendance: 96, assignments: 95, midterm: 94, final: 92, totalGrade: "A", submitted: false },
                { id: 203, name: "Henry Wilson", attendance: 82, assignments: 79, midterm: 75, final: 80, totalGrade: "B-", submitted: false },
                { id: 204, name: "Isabella Moore", attendance: 91, assignments: 93, midterm: 88, final: 90, totalGrade: "A-", submitted: false },
                { id: 205, name: "Jack Anderson", attendance: 85, assignments: 84, midterm: 86, final: 83, totalGrade: "B", submitted: false }
            ]
        },
        { 
            id: 3, 
            code: "CS303", 
            name: "Algorithms", 
            semester: "Spring 2023",
            studentsCount: 25,
            submissionStatus: "pending",
            students: [
                { id: 301, name: "Karen Lee", attendance: 94, assignments: 92, midterm: 90, final: 91, totalGrade: "A-", submitted: false },
                { id: 302, name: "Leo Johnson", attendance: 87, assignments: 85, midterm: 82, final: 84, totalGrade: "B", submitted: false },
                { id: 303, name: "Mia Thompson", attendance: 79, assignments: 81, midterm: 76, final: 78, totalGrade: "B-", submitted: false },
                { id: 304, name: "Nathan Clark", attendance: 92, assignments: 90, midterm: 88, final: 89, totalGrade: "B+", submitted: false },
                { id: 305, name: "Olivia Martinez", attendance: 97, assignments: 96, midterm: 95, final: 97, totalGrade: "A", submitted: false }
            ]
        }
    ];

    const handleOpenModal = (course: Course) => {
        setSelectedCourse(course);
        openModal();
    };

    const handleSubmitResults = (courseId: number) => {
        setSubmissionStatus(prev => ({
            ...prev,
            [courseId]: 'submitted'
        }));
    };

    const handleFinalizeGrade = (courseId: number, studentId: number) => {
        setSelectedCourse(prev => {
            if (!prev || prev.id !== courseId) return prev;
            
            const updatedStudents = prev.students.map(student => {
                if (student.id === studentId) {
                    return { ...student, submitted: !student.submitted };
                }
                return student;
            });
            
            return { ...prev, students: updatedStudents };
        });
    };

    const handleSubmitAllGrades = () => {
        if (!selectedCourse) return;
        
        const allSubmitted = selectedCourse.students.map(student => ({
            ...student,
            submitted: true
        }));
        
        setSelectedCourse({
            ...selectedCourse,
            students: allSubmitted,
            submissionStatus: 'submitted'
        });
        
        setSubmissionStatus(prev => ({
            ...prev,
            [selectedCourse.id]: 'submitted'
        }));
        
        closeModal();
    };

    const getSubmissionStatusBadge = (status: string) => {
        if (status === "submitted") {
            return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Submitted</span>;
        } else if (status === "draft") {
            return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Draft</span>;
        } else {
            return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Pending</span>;
        }
    };

    const getGradeBadge = (grade: string) => {
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

    return (
        <>
            <PageMeta
                title="Result Submission"
                description="Submit final semester results to the university"
            />
            
            {/* Header Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Final Result Submission</h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Submit end-of-semester final results to the university registry
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submission Deadline</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">June 15, 2023</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Status Summary */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-5 lg:p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Submission Summary</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Progress of your result submissions
                    </p>
                    
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</h3>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {courses.length}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">courses</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Results Submitted</h3>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {Object.values(submissionStatus).filter(status => status === 'submitted').length}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">out of {courses.length}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Pending Submissions</h3>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {courses.length - Object.values(submissionStatus).filter(status => status === 'submitted').length}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">remaining</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-5 lg:p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Courses</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Select a course to submit final grades for all students
                    </p>
                </div>
                
                <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Course</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Semester</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Students</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-medium text-gray-900 dark:text-white">{course.code}: {course.name}</div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {course.semester}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {course.studentsCount} students
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getSubmissionStatusBadge(submissionStatus[course.id] || course.submissionStatus)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            onClick={() => handleOpenModal(course)}
                                            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                            disabled={submissionStatus[course.id] === 'submitted'}
                                        >
                                            {submissionStatus[course.id] === 'submitted' ? 'Submitted' : 'Submit Grades'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submit Grades Modal */}
            {selectedCourse && (
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Submit Final Grades: {selectedCourse.code} - {selectedCourse.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Review and finalize grades for all students before submission. Once submitted, grades cannot be changed.
                        </p>
                        
                        <div className="mt-6 max-h-[60vh] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Student</th>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Attendance</th>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Assignments</th>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Midterm</th>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Final</th>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Grade</th>
                                        <th scope="col" className="sticky top-0 bg-gray-50 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                                    {selectedCourse.students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {student.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {student.attendance}%
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {student.assignments}/100
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {student.midterm}/100
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {student.final}/100
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                                                {getGradeBadge(student.totalGrade)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                                                <button
                                                    onClick={() => handleFinalizeGrade(selectedCourse.id, student.id)}
                                                    className={`rounded px-3 py-1 text-xs font-medium ${
                                                        student.submitted
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {student.submitted ? "Finalized" : "Finalize"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 p-4 dark:border-gray-700">
                        <Button
                            onClick={closeModal}
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Close
                        </Button>
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => {
                                    // Mark all students as finalized
                                    selectedCourse.students.forEach(student => {
                                        handleFinalizeGrade(selectedCourse.id, student.id);
                                    });
                                }}
                                className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                            >
                                Finalize All
                            </Button>
                            <Button
                                onClick={() => handleSubmitAllGrades()}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                disabled={!selectedCourse.students.some(student => student.submitted)}
                            >
                                Submit to University
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}