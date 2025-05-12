import { useState, useEffect } from 'react';
import axios from 'axios';

interface StudentData {
  student_name: string;
  phone_number: string;
  year: number;
  picture_url?: string;
}

interface Course {
  subject_id: string;
  subject_name: string;
  teacher_name?: string;
}

export default function UserInfoCard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRfid = "6323678"; 

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch student personal information
        const studentResponse = await axios.get(`http://193.203.162.232:10000/StudentProfile/get_student_info?rfid=${userRfid}`);
        setStudentData(studentResponse.data);

        // Fetch enrolled courses
        const coursesResponse = await axios.get(`http://193.203.162.232:10000/StudentAttendance/get_courses?rfid=${userRfid}`);
        setCourses(coursesResponse.data || []);

      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student information");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [userRfid]);

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  // Split student name into first and last name
  const nameParts = studentData.student_name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                RFID
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userRfid}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {studentData.phone_number || 'N/A'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Year
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Year {studentData.year || 'N/A'}
              </p>
            </div>
          </div>

          {courses.length > 0 && (
            <div className="mt-6">
              <h5 className="mb-3 text-md font-medium text-gray-800 dark:text-white/90">
                Enrolled Subjects
              </h5>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <div key={course.subject_id} className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {course.subject_name}
                    </p>
                    {course.teacher_name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Teacher: {course.teacher_name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {studentData.picture_url && (
          <div className="flex-shrink-0 lg:mt-0">
            <img
              src={studentData.picture_url}
              alt="Student profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}