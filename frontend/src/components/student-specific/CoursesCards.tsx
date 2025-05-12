import { useNavigate } from "react-router-dom";
import { BookOpen, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

type CourseCardProps = {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
};

function CourseCard({ id, courseCode, courseName, instructor }: CourseCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/courses/${id}`);
  };

  const getColor = () => {
    const colors = [
      "from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800",
      "from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800",
      "from-green-500 to-green-700 hover:from-green-600 hover:to-green-800",
      "from-red-500 to-red-700 hover:from-red-600 hover:to-red-800",
      "from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800"
    ];
    let hash = 0;
    for (let i = 0; i < courseCode.length; i++) {
      hash += courseCode.charCodeAt(i);
    }
    return colors[hash % colors.length];
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
    >
      <div className={`bg-gradient-to-r ${getColor()} h-3 w-full`}></div>
      <div className="flex flex-col p-6 flex-1">
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-mono text-sm dark:bg-gray-700 dark:text-gray-200">
            {courseCode}
          </span>
        </div>
        
        <h3 className="mt-4 text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 dark:text-white dark:group-hover:text-blue-400">
          {courseName}
        </h3>
        
        <div className="mt-4 flex-1">
          <div className="flex items-center">
            <User size={16} className="text-gray-500 dark:text-gray-400" />
            <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              {instructor}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            <BookOpen size={16} className="mr-2" />
            View Course Details
          </button>
        </div>
      </div>
    </div>
  );
}


export default function CoursesCards() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentRfid = "6323678"; 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://193.203.162.232:10000/MyCourses/${studentRfid}/MyCourses`);
        if (res.data.success) {
          const formattedCourses = res.data.subjects.map((subject, index) => ({
            id: `course-${index + 1}`,
            courseCode: subject.code,
            courseName: subject.name,
            instructor: subject.instructor,
          }));
          setCourses(formattedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading courses...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}