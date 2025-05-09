import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { Tab } from '@headlessui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUserGraduate, FaUserTie, FaCalendarAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Types for better type safety
type AttendanceStatus = "present" | "absent" | "leave" | "late";

interface AttendanceRecord {
  id: number;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

interface Student {
  id: number;
  name: string;
  registrationNo: string;
  attendanceRecords: AttendanceRecord[];
}

interface Staff {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  attendanceRecords: AttendanceRecord[];
}

interface Course {
  id: number;
  code: string;
  name: string;
  instructor: string;
  department: string;
  students: Student[];
  classes: {
    id: number;
    date: string;
    topic: string;
  }[];
}

export default function AttendanceTracking() {
  // States
  const [activeTab, setActiveTab] = useState<'students' | 'staff' | 'general'>('students');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  //const [isAttendanceMarkingOpen, setIsAttendanceMarkingOpen] = useState(false);
  //const [unmarkedOnly, setUnmarkedOnly] = useState(true);
  
  // Modal hooks
  const courseDetailsModal = useModal();
  const studentDetailsModal = useModal();
  const staffDetailsModal = useModal();
  const bulkUploadModal = useModal();
  //const attendanceMarkingModal = useModal();

  // Sample data - would be replaced with API calls in a real application
  const courses: Course[] = [
    {
      id: 1, 
      code: "CS101", 
      name: "Introduction to Computer Science",
      instructor: "Dr. Robert Smith",
      department: "Computer Science",
      students: [
        {id: 1, name: "John Doe", registrationNo: "2021-CS-01", attendanceRecords: []},
        {id: 2, name: "Jane Smith", registrationNo: "2021-CS-02", attendanceRecords: []},
        {id: 3, name: "Alex Johnson", registrationNo: "2021-CS-03", attendanceRecords: []},
      ],
      classes: [
        {id: 1, date: "2023-09-01", topic: "Course Introduction"},
        {id: 2, date: "2023-09-08", topic: "Basic Programming Concepts"},
        {id: 3, date: "2023-09-15", topic: "Data Types & Variables"},
      ]
    },
    {
      id: 2, 
      code: "MATH201", 
      name: "Calculus II",
      instructor: "Dr. Maria Garcia",
      department: "Mathematics",
      students: [
        {id: 1, name: "John Doe", registrationNo: "2021-CS-01", attendanceRecords: []},
        {id: 4, name: "Sarah Wilson", registrationNo: "2021-MATH-01", attendanceRecords: []},
        {id: 5, name: "Michael Brown", registrationNo: "2021-MATH-02", attendanceRecords: []},
      ],
      classes: [
        {id: 1, date: "2023-09-02", topic: "Integration Techniques"},
        {id: 2, date: "2023-09-09", topic: "Applications of Integration"},
        {id: 3, date: "2023-09-16", topic: "Sequences and Series"},
      ]
    },
    {
      id: 3, 
      code: "PHY102", 
      name: "Physics for Engineers",
      instructor: "Dr. James Wilson",
      department: "Physics",
      students: [
        {id: 3, name: "Alex Johnson", registrationNo: "2021-CS-03", attendanceRecords: []},
        {id: 6, name: "Emily Davis", registrationNo: "2021-PHY-01", attendanceRecords: []},
        {id: 7, name: "David Taylor", registrationNo: "2021-PHY-02", attendanceRecords: []},
      ],
      classes: [
        {id: 1, date: "2023-09-03", topic: "Mechanics"},
        {id: 2, date: "2023-09-10", topic: "Thermodynamics"},
        {id: 3, date: "2023-09-17", topic: "Electromagnetism"},
      ]
    },
  ];

  const staff: Staff[] = [
    {
      id: 1,
      name: "Dr. Robert Smith",
      employeeId: "EMP-001",
      department: "Computer Science",
      attendanceRecords: [
        {id: 1, date: "2023-09-01", status: "present"},
        {id: 2, date: "2023-09-02", status: "present"},
        {id: 3, date: "2023-09-03", status: "present"},
        {id: 4, date: "2023-09-04", status: "absent", remarks: "Sick leave"},
        {id: 5, date: "2023-09-05", status: "present"},
      ]
    },
    {
      id: 2,
      name: "Dr. Maria Garcia",
      employeeId: "EMP-002",
      department: "Mathematics",
      attendanceRecords: [
        {id: 1, date: "2023-09-01", status: "present"},
        {id: 2, date: "2023-09-02", status: "present"},
        {id: 3, date: "2023-09-03", status: "leave", remarks: "Conference attendance"},
        {id: 4, date: "2023-09-04", status: "leave", remarks: "Conference attendance"},
        {id: 5, date: "2023-09-05", status: "present"},
      ]
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      employeeId: "EMP-003",
      department: "Physics",
      attendanceRecords: [
        {id: 1, date: "2023-09-01", status: "late", remarks: "Traffic delay"},
        {id: 2, date: "2023-09-02", status: "present"},
        {id: 3, date: "2023-09-03", status: "present"},
        {id: 4, date: "2023-09-04", status: "present"},
        {id: 5, date: "2023-09-05", status: "present"},
      ]
    },
  ];

  // Generate some attendance data for students
  useEffect(() => {
    courses.forEach(course => {
      course.students.forEach(student => {
        course.classes.forEach((classSession, index) => {
          // Random attendance generation for demonstration
          const statuses: AttendanceStatus[] = ["present", "absent", "leave", "late"];
          const randomStatus = Math.random() < 0.85 
            ? "present" 
            : statuses[Math.floor(Math.random() * statuses.length)];
          
          student.attendanceRecords.push({
            id: index + 1,
            date: classSession.date,
            status: randomStatus,
            remarks: randomStatus !== "present" ? "Auto-generated" : undefined
          });
        });
      });
    });
  }, []);

  // Utility functions
  const getAttendancePercentage = (records: AttendanceRecord[]): number => {
    if (records.length === 0) return 0;
    const present = records.filter(r => r.status === "present" || r.status === "late").length;
    return Math.round((present / records.length) * 100);
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    switch(status) {
      case "present":
        return "bg-green-500 dark:bg-green-600";
      case "absent":
        return "bg-red-500 dark:bg-red-600";
      case "leave":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "late":
        return "bg-orange-500 dark:bg-orange-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  const getDepartments = (): string[] => {
    const departments = new Set<string>();
    courses.forEach(course => {
      departments.add(course.department);
    });
    staff.forEach(s => {
      departments.add(s.department);
    });
    return Array.from(departments);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    courseDetailsModal.openModal();
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    studentDetailsModal.openModal();
  };

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    staffDetailsModal.openModal();
  };

  // Filtered data
  const filteredCourses = courses.filter(course => 
    (selectedDepartment === "all" || course.department === selectedDepartment) &&
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     course.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStaff = staff.filter(s => 
    (selectedDepartment === "all" || s.department === selectedDepartment) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Attendance overview data for charts
  const studentAttendanceData = courses.map(course => ({
    name: course.code,
    attendance: course.students.reduce((acc, student) => 
      acc + getAttendancePercentage(student.attendanceRecords), 0) / course.students.length
  }));

  const staffAttendanceData = [
    { name: 'Present', value: staff.reduce((acc, s) => 
      acc + s.attendanceRecords.filter(r => r.status === "present").length, 0) },
    { name: 'Late', value: staff.reduce((acc, s) => 
      acc + s.attendanceRecords.filter(r => r.status === "late").length, 0) },
    { name: 'Absent', value: staff.reduce((acc, s) => 
      acc + s.attendanceRecords.filter(r => r.status === "absent").length, 0) },
    { name: 'Leave', value: staff.reduce((acc, s) => 
      acc + s.attendanceRecords.filter(r => r.status === "leave").length, 0) },
  ];

  const COLORS = ['#4caf50', '#ff9800', '#f44336', '#ffeb3b'];

  return (
    <>
      <PageMeta
        title="Attendance Tracking"
        description="Comprehensive attendance management system for students and staff."
      />
      
      <div className="space-y-6">
        {/* Header with summary stats */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Tracking System</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage attendance records for both students and staff across all departments.
            </p>
            
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/30">
                <div className="flex items-center">
                  <FaUserGraduate className="text-blue-600 dark:text-blue-400 mr-3 h-8 w-8" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Students</h3>
                    <p className="mt-1 text-2xl font-semibold text-blue-900 dark:text-blue-100">
                      {new Set(courses.flatMap(c => c.students.map(s => s.id))).size}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/30">
                <div className="flex items-center">
                  <FaUserTie className="text-purple-600 dark:text-purple-400 mr-3 h-8 w-8" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Total Staff</h3>
                    <p className="mt-1 text-2xl font-semibold text-purple-900 dark:text-purple-100">{staff.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/30">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-green-600 dark:text-green-400 mr-3 h-8 w-8" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Courses</h3>
                    <p className="mt-1 text-2xl font-semibold text-green-900 dark:text-green-100">{courses.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/30">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-amber-100 p-2 dark:bg-amber-800">
                    <div className="h-4 w-4 rounded-full bg-amber-500 dark:bg-amber-400"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Avg. Student Attendance</h3>
                    <p className="mt-1 text-2xl font-semibold text-amber-900 dark:text-amber-100">
                      {Math.round(studentAttendanceData.reduce((acc, item) => acc + item.attendance, 0) / studentAttendanceData.length)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts overview */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Attendance Overview</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Line chart for student attendance by course */}
            <div className="h-72 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">Student Attendance by Course</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={studentAttendanceData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    name="Attendance %" 
                    stroke="#2563EB" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Pie chart for staff attendance */}
            <div className="h-72 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">Staff Attendance Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={staffAttendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {staffAttendanceData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Tabs for Students and Staff Attendance */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="p-5 lg:p-6">
            <Tab.Group onChange={(index) => setActiveTab(index === 0 ? 'students' : index === 1 ? 'staff' : 'general')}>
              <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-colors
                    ${selected 
                      ? 'bg-white text-blue-700 shadow dark:bg-gray-700 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-white/[0.12] dark:text-gray-400 dark:hover:bg-gray-700/[0.5]'
                    }`
                  }
                >
                  Student Attendance
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-colors
                    ${selected 
                      ? 'bg-white text-blue-700 shadow dark:bg-gray-700 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-white/[0.12] dark:text-gray-400 dark:hover:bg-gray-700/[0.5]'
                    }`
                  }
                >
                  Staff Attendance
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-colors
                    ${selected 
                      ? 'bg-white text-blue-700 shadow dark:bg-gray-700 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-white/[0.12] dark:text-gray-400 dark:hover:bg-gray-700/[0.5]'
                    }`
                  }
                >
                  General Attendance
                </Tab>
              </Tab.List>
              
              {/* Filter and search controls */}
              <div className="my-4 flex flex-wrap gap-3 sm:flex-row">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder={activeTab === 'students' ? "Search courses..." : activeTab === 'staff' ? "Search staff..." : "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <select
                  className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {getDepartments().map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <input
                  type="date"
                  className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                
                <Button
                  onClick={bulkUploadModal.openModal}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Bulk Upload</span>
                </Button>
              </div>
              
              <Tab.Panels>
                {/* Students attendance panel */}
                <Tab.Panel>
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Course Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Course Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Students
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Classes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {filteredCourses.map((course) => (
                          <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                {course.code}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                              {course.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              {course.department}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              {course.students.length}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              {course.classes.length}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <Button
                                onClick={() => handleCourseSelect(course)}
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                              >
                                Manage Attendance
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>
                
                {/* Staff attendance panel */}
                <Tab.Panel>
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Employee ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Attendance Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {filteredStaff.map((staffMember) => (
                          <tr key={staffMember.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                              {staffMember.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                {staffMember.employeeId}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              {staffMember.department}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div 
                                    className="h-2 rounded-full bg-blue-600 dark:bg-blue-500" 
                                    style={{ width: `${getAttendancePercentage(staffMember.attendanceRecords)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {getAttendancePercentage(staffMember.attendanceRecords)}%
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <Button
                                onClick={() => handleStaffSelect(staffMember)}
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>

                {/* General attendance panel */}
                <Tab.Panel>
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Attendance Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {filteredCourses.flatMap(course => course.students).map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                {student.registrationNo}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              {courses.find(course => course.students.includes(student))?.department}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div 
                                    className="h-2 rounded-full bg-blue-600 dark:bg-blue-500" 
                                    style={{ width: `${getAttendancePercentage(student.attendanceRecords)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {getAttendancePercentage(student.attendanceRecords)}%
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <Button
                                onClick={() => handleStudentSelect(student)}
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>

      {/* Course Attendance Modal */}
      {selectedCourse && (
        <Modal isOpen={courseDetailsModal.isOpen} onClose={courseDetailsModal.closeModal}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCourse.code}: {selectedCourse.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Department: {selectedCourse.department} | Instructor: {selectedCourse.instructor}
              </p>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Students Enrolled: {selectedCourse.students.length}</h4>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <FaPlus className="h-3 w-3" /> Add Class
                </Button>
                <Button
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => {}}
                >
                  Export Data
                </Button>
              </div>
            </div>
            
            {/* Class selection for attendance */}
            <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Select Class Session:</h5>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.classes.map((classSession) => (
                  <Button
                    key={classSession.id}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    onClick={() => {}}
                  >
                    {new Date(classSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Student attendance table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Reg. No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Overall Attendance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {selectedCourse.students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                        {student.registrationNo}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div 
                              className="h-2 rounded-full bg-blue-600 dark:bg-blue-500" 
                              style={{ width: `${getAttendancePercentage(student.attendanceRecords)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getAttendancePercentage(student.attendanceRecords)}%
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStudentSelect(student)} 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {}}
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={courseDetailsModal.closeModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Student Attendance Details Modal */}
      {selectedStudent && (
        <Modal isOpen={studentDetailsModal.isOpen} onClose={studentDetailsModal.closeModal}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedStudent.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Registration No: {selectedStudent.registrationNo}
              </p>
            </div>
            
            <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Attendance Rate</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {getAttendancePercentage(selectedStudent.attendanceRecords)}%
                  </p>
                </div>
                <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-0">
                  <div className="text-center">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400">Present</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStudent.attendanceRecords.filter(item => item.status === "present").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">Absent</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStudent.attendanceRecords.filter(item => item.status === "absent").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Leave</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStudent.attendanceRecords.filter(item => item.status === "leave").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Late</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStudent.attendanceRecords.filter(item => item.status === "late").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Attendance Records */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {selectedStudent.attendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {record.remarks || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsEditModalOpen(true)} 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {}}
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={studentDetailsModal.closeModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Staff Attendance Details Modal */}
      {selectedStaff && (
        <Modal isOpen={staffDetailsModal.isOpen} onClose={staffDetailsModal.closeModal}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedStaff.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Employee ID: {selectedStaff.employeeId} | Department: {selectedStaff.department}
              </p>
            </div>
            
            <div className="mb-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Attendance Rate</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {getAttendancePercentage(selectedStaff.attendanceRecords)}%
                  </p>
                </div>
                <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-0">
                  <div className="text-center">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400">Present</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStaff.attendanceRecords.filter(item => item.status === "present").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">Absent</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStaff.attendanceRecords.filter(item => item.status === "absent").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Leave</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStaff.attendanceRecords.filter(item => item.status === "leave").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Late</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStaff.attendanceRecords.filter(item => item.status === "late").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Attendance Records */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {selectedStaff.attendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {record.remarks || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsEditModalOpen(true)} 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={staffDetailsModal.closeModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Bulk Upload Modal */}
      <Modal isOpen={bulkUploadModal.isOpen} onClose={bulkUploadModal.closeModal}>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Bulk Upload Attendance
          </h3>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Method
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="uploadMethod" defaultChecked className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Excel/CSV File</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="uploadMethod" className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Manual Entry</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Course/Department
            </label>
            <select className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="">Select a course or department</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.code}: {course.name}</option>
              ))}
              {getDepartments().map(dept => (
                <option key={dept} value={`dept-${dept}`}>Department: {dept}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Excel or CSV files only</p>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </div>
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" />
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={bulkUploadModal.closeModal}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Record Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Edit Attendance Record
          </h3>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input 
              type="date" 
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="late">Late</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remarks
            </label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Add any remarks or notes here"
            ></textarea>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Add Class Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Add New Class
          </h3>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input 
              type="date" 
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Topic
            </label>
            <input 
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Class topic or description" 
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Add Class
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
