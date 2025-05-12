import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import toast from "react-hot-toast";

interface Assessment {
  subject_name: string;
  quiz_number?: number;
  quiz_marks?: number;
  assessment_total: number;
  assessment_marks: number;
  sequence?: number;
  month_year?: string;
  average_of_quizzes?: number;
  total_marks?: number;
  percentage?: number;
  grade?: string;
}

interface AssessmentType {
  type: string;
  label: string;
}

interface Course {
  subject_id: string;
  subject_name: string;
  teacher_name?: string;
}

export default function Grades() {
  const userRfid = "6323678"; // Hardcoded for now, replace with actual user context
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [studyYear, setStudyYear] = useState("Year 1");
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [monthlyAssessments, setMonthlyAssessments] = useState<Record<string, Assessment[]>>({});
  const [otherAssessments, setOtherAssessments] = useState<Record<string, Record<string, Assessment[]>>>({});
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get current academic session (August to May)
  const getCurrentSession = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    if (currentMonth >= 8) {
      return `August ${currentYear} - May ${currentYear + 1}`;
    } else {
      return `August ${currentYear - 1} - May ${currentYear}`;
    }
  };

  // Calculate months passed in current session (August = 0, May = 9)
  const getMonthsPassed = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    if (currentMonth >= 8) {
      return currentMonth - 8;
    } else if (currentMonth <= 5) {
      return currentMonth + 4; 
    } else {
      return 9; 
    }
  };

  const monthsPassed = getMonthsPassed();
  const currentSession = getCurrentSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student's study year
        const yearResponse = await axios.get(`http://193.203.162.232:10000/metrics/get_student_year?rfid=${userRfid}`);
        setStudyYear(yearResponse.data.year || "Year 1");

        // Fetch enrolled courses
        const coursesResponse = await axios.get(`http://193.203.162.232:10000/StudentAttendance/get_courses?rfid=${userRfid}`);
        setCourses(coursesResponse.data || []);

        // Fetch assessment types
        const typesResponse = await axios.get("http://193.203.162.232:10000/result/get_assessment_types");
        const types = typesResponse.data.assessment_types.map((type: string) => ({
          type,
          label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));
        setAssessmentTypes(types);

        // Fetch overall percentage
        const percentageResponse = await axios.get(`http://193.203.162.232:10000/metrics/get_overall_percentage?rfid=${userRfid}`);
        setOverallPercentage(percentageResponse.data.overall_percentage || 0);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load academic data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRfid]);

  const fetchMonthlyAssessments = async (subjectId: string) => {
    try {
      const response = await axios.get(
        `http://193.203.162.232:10000/result/get_assessment_monthly?student_id=${userRfid}&subject_id=${subjectId}`
      );
      setMonthlyAssessments(response.data.assessments || {});
    } catch (error) {
      console.error("Error fetching monthly assessments:", error);
      toast.error("Failed to load monthly assessments");
    }
  };

  const fetchAssessmentsByType = async (type: string, subjectId: string) => {
    try {
      const response = await axios.get(
        `http://193.203.162.232:10000/result/get_assessment_else?student_id=${userRfid}&type=${type}&subject_id=${subjectId}`
      );
      setOtherAssessments(prev => ({
        ...prev,
        [type]: response.data.assessments || {}
      }));
    } catch (error) {
      console.error(`Error fetching ${type} assessments:`, error);
      toast.error(`Failed to load ${type} assessments`);
    }
  };

  const handleOpenModal = (course: Course, assessmentType?: string) => {
    setSelectedCourse(course);
    if (assessmentType) {
      setSelectedAssessmentType(assessmentType);
      if (assessmentType === "Monthly") {
        fetchMonthlyAssessments(course.subject_id);
      } else {
        fetchAssessmentsByType(assessmentType, course.subject_id);
      }
    }
    openModal();
  };

  const getYearBadge = (year: string) => {
    const yearColors: Record<string, string> = {
      "Year 1": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Year 2": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Year 3": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "Year 4": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          yearColors[year] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {year}
      </span>
    );
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColorClass = (percentage: number): string => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (percentage >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const renderAssessmentDetails = () => {
    if (!selectedCourse || !selectedAssessmentType) return null;

    const assessments = selectedAssessmentType === "Monthly" 
      ? monthlyAssessments 
      : otherAssessments[selectedAssessmentType];

    if (!assessments) return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading assessment data...
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedCourse.subject_name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {selectedAssessmentType} Assessments
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {getYearBadge(studyYear)}
            </div>
          </div>
        </div>

        <div className="mx-auto h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {Object.entries(assessments).map(([monthYear, monthAssessments]) => (
          <div key={monthYear} className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              {monthYear}
            </h4>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {selectedAssessmentType === "Monthly" ? (
                      <>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Quiz 1
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Quiz 2
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Quiz 3
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Avg of Quizzes
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Monthly Marks
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Total Marks
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                          Percentage
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                          Grade
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Marks Achieved
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Total Marks
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                          Percentage
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                          Grade
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                  {monthAssessments
                    .filter(a => a.subject_name === selectedCourse.subject_name)
                    .map((assessment, idx) => {
                      const percentage = assessment.percentage || 
                        (assessment.assessment_marks / assessment.assessment_total) * 100;
                      const grade = assessment.grade || getLetterGrade(percentage);

                      return (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          {selectedAssessmentType === "Monthly" ? (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.quiz_number === 1 ? `${assessment.quiz_marks}` : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.quiz_number === 2 ? `${assessment.quiz_marks}` : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.quiz_number === 3 ? `${assessment.quiz_marks}` : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.average_of_quizzes?.toFixed(1) || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.assessment_marks}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.total_marks}
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                <span className={`font-semibold ${getGradeColorClass(percentage)}`}>
                                  {percentage.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                <span className={`font-semibold ${getGradeColorClass(percentage)}`}>
                                  {grade}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.assessment_marks}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {assessment.assessment_total}
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                <span className={`font-semibold ${getGradeColorClass(percentage)}`}>
                                  {percentage.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                <span className={`font-semibold ${getGradeColorClass(percentage)}`}>
                                  {grade}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Academic Progress"
        description="View your academic progress and detailed results"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:border-gray-800 dark:bg-gradient-to-r dark:from-blue-900/10 dark:to-purple-900/10">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Academic Progress
                  </h1>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Track your assessments and academic performance
                  </p>
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
                  {studyYear}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentSession}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Overall Percentage
                </div>
                <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {overallPercentage}%
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Current Academic Year
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Academic Progress
                </div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {monthsPassed}/9 Months
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {Math.round((monthsPassed / 9) * 100)}% of session completed
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {studyYear} Progress
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {Math.round((monthsPassed / 9) * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                  style={{
                    width: `${Math.round((monthsPassed / 9) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Course Assessments
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a course to view detailed assessment results
              </p>
            </div>

            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Study Year
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      View Assessments
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                  {courses.map((course) => (
                    <tr key={course.subject_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {course.subject_name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getYearBadge(studyYear)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block text-left">
                          <select
                            onChange={(e) => handleOpenModal(course, e.target.value)}
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                          >
                            <option value="">Select Assessment Type</option>
                            {assessmentTypes.map((type) => (
                              <option key={type.type} value={type.type}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedCourse && (
            <Modal isOpen={isOpen} onClose={closeModal} size="lg">
              <div className="max-h-[80vh] overflow-y-auto p-6">
                {renderAssessmentDetails()}
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
      )}
    </>
  );
}