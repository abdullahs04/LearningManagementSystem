import { useNavigate } from "react-router-dom";
import { BookOpen, User, Clock } from "lucide-react";

type CourseCardProps = {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  credits: number;
};

function CourseCard({ id, courseCode, courseName, instructor, credits }: CourseCardProps) {
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
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {credits} {credits === 1 ? "Credit" : "Credits"}
            </span>
          </div>
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
  const courses = [
    {
      id: "course-1",
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      instructor: "Dr. Jane Smith",
      credits: 3,
    },
    {
      id: "course-2",
      courseCode: "MATH201",
      courseName: "Calculus II",
      instructor: "Prof. John Doe",
      credits: 4,
    },
    {
      id: "course-3",
      courseCode: "PHY150",
      courseName: "Physics for Engineers",
      instructor: "Dr. Robert Johnson",
      credits: 4,
    },
    {
      id: "course-4",
      courseCode: "ENG102",
      courseName: "Technical Writing",
      instructor: "Prof. Lisa Brown",
      credits: 2,
    },
    {
      id: "course-5",
      courseCode: "BIO110",
      courseName: "Introduction to Biology",
      instructor: "Dr. Sarah Williams",
      credits: 3,
    },
    {
      id: "course-6",
      courseCode: "CHEM200",
      courseName: "Organic Chemistry",
      instructor: "Prof. Michael Chen",
      credits: 4,
    },
  ];

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