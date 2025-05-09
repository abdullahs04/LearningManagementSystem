import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { 
  FiEdit, FiUpload, FiDownload, FiFileText, 
  FiMessageSquare, FiUsers, FiBarChart2,
  FiX, FiSend, FiSearch, FiTrash2
} from "react-icons/fi";
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Enhanced Type Definitions
type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string;
  attachments: { name: string; size: string }[];
  comments: { user: string; text: string; date: string }[];
};

type Assignment = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: string;
  submissions: { studentId: string; file: string; submittedAt: string; grade: number }[];
};

type Material = {
  id: number;
  title: string;
  type: string;
  date: string;
  file?: string;
  link?: string;
};

type Grade = {
  assignmentId: number;
  studentId: string;
  score: number;
  feedback: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  progress: number;
};

type ScheduleWeek = {
  week: number;
  topic: string;
  readings: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  classSchedule: string;
  credits: number;
  announcements: Announcement[];
  assignments: Assignment[];
  materials: Material[];
  grades: Grade[];
  students: Student[];
  schedule: ScheduleWeek[];
};

// Complete Dummy Data
type UserRole = "student" | "teacher";
const DUMMY_USER_ROLE: UserRole = "student";
const DUMMY_COURSE: Course = {
  id: "cs101",
  title: "Introduction to Computer Science",
  description: "Comprehensive course covering programming fundamentals, algorithms, and data structures",
  instructor: "Dr. Jane Smith",
  classSchedule: "Mon/Wed/Fri 10:00 AM - 11:30 AM",
  credits: 3,
  announcements: [
    {
      id: 1,
      title: "Welcome to CS101",
      content: "Course orientation materials are now available. Please review the syllabus.",
      date: "2023-09-01",
      attachments: [{ name: "syllabus.pdf", size: "2.5MB" }],
      comments: [
        { user: "John Doe", text: "When is the first assignment due?", date: "2023-09-02" },
        { user: "Dr. Smith", text: "All assignments are listed in the course schedule", date: "2023-09-02" }
      ]
    }
  ],
  assignments: [
    {
      id: 1,
      title: "Python Basics",
      description: "Complete 10 programming exercises covering Python syntax",
      dueDate: "2023-09-15",
      maxScore: 100,
      status: "open",
      submissions: [
        { studentId: "s1", file: "john-doe-py.zip", submittedAt: "2023-09-14", grade: 85 }
      ]
    }
  ],
  materials: [
    { id: 1, title: "Lecture 1 Slides", type: "slides", date: "2023-09-01", file: "lecture1.pdf" },
    { id: 2, title: "Python Tutorial", type: "resource", date: "2023-09-01", link: "https://example.com" }
  ],
  grades: [
    { assignmentId: 1, studentId: "s1", score: 85, feedback: "Good implementation of basic concepts" }
  ],
  students: [
    { id: "s1", name: "John Doe", email: "john@example.com", progress: 65 },
    { id: "s2", name: "Jane Wilson", email: "jane@example.com", progress: 80 }
  ],
  schedule: [
    { week: 1, topic: "Introduction to Programming", readings: "Chapters 1-3" },
    { week: 2, topic: "Data Types and Variables", readings: "Chapter 4" }
  ]
};

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [courseData, setCourseData] = useState(DUMMY_COURSE);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isAssignmentModalOpen, setAssignmentModalOpen] = useState(false);

  const tabs = [
    "overview", "announcements", "assignments", 
    "materials", "grades", "communication", 
    "participants", "analytics"
  ];

  const handleNewAnnouncement = (announcement: Announcement) => {
    setCourseData(prev => ({
      ...prev,
      announcements: [announcement, ...prev.announcements]
    }));
  };

  const handleNewMaterial = (material: Material) => {
    setCourseData(prev => ({
      ...prev,
      materials: [material, ...prev.materials]
    }));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageMeta
        title={`${DUMMY_COURSE.title} | Learning Management System`}
        description={DUMMY_COURSE.description}
      />
      <PageBreadcrumb pageTitle={DUMMY_COURSE.title} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {DUMMY_COURSE.title}
                <span className="ml-4 text-sm font-normal text-gray-500">
                  {DUMMY_COURSE.credits} Credits
                </span>
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Instructor: {DUMMY_COURSE.instructor}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Schedule: {DUMMY_COURSE.classSchedule}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-4 py-2 rounded-lg">
                <p className="font-medium">Course Progress</p>
                <p className="text-2xl font-bold">68%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 rounded-full h-2 w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize flex items-center ${
                  activeTab === tab 
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab === 'analytics' && <FiFileText className="mr-2" />}
                {tab.replace(/_/g, ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && <CourseOverviewTab course={courseData} />}
          {activeTab === 'announcements' && (
            <AnnouncementsTab
              announcements={courseData.announcements}
              isTeacher={DUMMY_USER_ROLE === "teacher"}
              onNewAnnouncement={handleNewAnnouncement}
            />
          )}
          {activeTab === 'assignments' && (
            <AssignmentsTab 
              isTeacher={DUMMY_USER_ROLE === "teacher"}
              assignments={courseData.assignments}
              onNewAssignment={() => setAssignmentModalOpen(true)}
              onSelectAssignment={setSelectedAssignment}
            />
          )}
          {activeTab === 'materials' && (
            <MaterialsTab
              materials={courseData.materials}
              isTeacher={DUMMY_USER_ROLE === "teacher"}
              onNewMaterial={handleNewMaterial}
            />
          )}
          {activeTab === 'grades' && (
            <GradesTab 
              isTeacher={DUMMY_USER_ROLE === "teacher"} 
              grades={courseData.grades} 
              assignments={courseData.assignments} 
              students={courseData.students} 
            />
          )}
          {activeTab === 'communication' && (
            <CommunicationTab
              messages={[]}
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSend={handleSendMessage}
            />
          )}
          {activeTab === 'participants' && (
            <ParticipantsTab
              students={courseData.students}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isTeacher={DUMMY_USER_ROLE === "teacher"}
            />
          )}
          {activeTab === 'analytics' && <AnalyticsTab course={courseData} />}
        </div>

        {/* Modals */}
        {isAnnouncementModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">New Announcement</h3>
              <p>Announcement creation form would go here</p>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isAssignmentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">New Assignment</h3>
              <p>Assignment creation form would go here</p>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setAssignmentModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setAssignmentModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-2">{selectedAssignment.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedAssignment.description}</p>
              <div className="mb-4">
                <strong>Due Date:</strong> {selectedAssignment.dueDate}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Components implementation
function CourseOverviewTab({ course }: { course: Course }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Course Description</h3>
        <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Course Schedule</h3>
          <div className="space-y-4">
            {course.schedule.map((week, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium">Week {index + 1}: {week.topic}</h4>
                <p className="text-sm text-gray-500">Readings: {week.readings}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            <span>View Grades</span>
            <FiDownload className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            <span>Download Syllabus</span>
            <FiDownload className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            <span>Upcoming Assignments</span>
            <FiFileText className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignmentsTab({ 
  isTeacher, 
  assignments, 
  onNewAssignment, 
  onSelectAssignment 
}: { 
  isTeacher: boolean; 
  assignments: Assignment[]; 
  onNewAssignment: () => void; 
  onSelectAssignment: (assignment: Assignment) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Assignments</h3>
        {isTeacher && (
          <button 
            onClick={onNewAssignment}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600"
          >
            <FiEdit className="mr-2" /> Create Assignment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assignment => (
          <div 
            key={assignment.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectAssignment(assignment)}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-lg">{assignment.title}</h4>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full">
                {assignment.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{assignment.description}</p>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Due: {assignment.dueDate}</span>
              <span className="font-medium">Max Score: {assignment.maxScore}</span>
            </div>

            {!isTeacher && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Your Submission: {assignment.submissions?.length ? "Submitted" : "Pending"}</span>
                  <button className="text-blue-500 flex items-center">
                    <FiUpload className="mr-1" /> Upload
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GradesTab({ 
  isTeacher, 
  grades, 
  assignments, 
  students 
}: { 
  isTeacher: boolean; 
  grades: Grade[]; 
  assignments: Assignment[]; 
  students: Student[];
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Grades Overview</h3>
        {isTeacher && (
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-green-600">
            <FiDownload className="mr-2" /> Export Grades
          </button>
        )}
      </div>

      {isTeacher ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">Student</th>
                {assignments.map(assignment => (
                  <th key={assignment.id} className="px-6 py-4 text-left">
                    {assignment.title}
                    <p className="text-sm font-normal text-gray-500">{assignment.maxScore} points</p>
                  </th>
                ))}
                <th className="px-6 py-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const totalScore = assignments.reduce((sum: number, assignment) => {
                  const grade = grades.find(g => g.assignmentId === assignment.id && g.studentId === student.id);
                  return sum + (grade?.score || 0);
                }, 0);
                
                return (
                  <tr key={student.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4">{student.name}</td>
                    {assignments.map(assignment => {
                      const grade = grades.find(g => g.assignmentId === assignment.id && g.studentId === student.id);
                      return (
                        <td key={assignment.id} className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span>{grade?.score ?? '-'}</span>
                            {grade && (
                              <button className="text-blue-500 hover:text-blue-600">
                                <FiEdit />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 font-semibold">{totalScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-4">Performance Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-500">85%</div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">3/5</div>
                <div className="text-sm text-gray-500">Assignments Completed</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-red-500">2</div>
                <div className="text-sm text-gray-500">Pending Submissions</div>
              </div>
            </div>
          </div>

          {assignments.map(assignment => {
            const grade = grades.find(g => g.assignmentId === assignment.id);
            return (
              <div key={assignment.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold">{assignment.title}</h4>
                    <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                  </div>
                  <span className={`text-lg ${grade ? 'text-green-500' : 'text-gray-500'}`}>
                    {grade ? `${grade.score}/${assignment.maxScore}` : '–'}
                  </span>
                </div>
                {grade?.feedback && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-medium">Instructor Feedback:</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{grade.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AnnouncementsTab({ announcements, isTeacher, onNewAnnouncement }: {
  announcements: Announcement[];
  isTeacher: boolean;
  onNewAnnouncement: (a: Announcement) => void;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<{ [key: number]: string }>({});

  const handleSubmit = () => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
      attachments: [],
      comments: []
    };
    onNewAnnouncement(newAnnouncement);
    setModalOpen(false);
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Announcements</h3>
        {isTeacher && (
          <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
            <FiEdit className="mr-2" /> New Announcement
          </button>
        )}
      </div>

      <div className="space-y-6">
        {announcements.map(announcement => (
          <div key={announcement.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold">{announcement.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{announcement.date}</p>
              </div>
              {isTeacher && (
                <button className="text-red-500 hover:text-red-600">
                  <FiTrash2 />
                </button>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{announcement.content}</p>
            
            <div className="mt-6 border-t pt-4">
              {announcement.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 mb-4">
                  <div className="flex-1">
                    <div className="font-medium">{comment.user}</div>
                    <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
                    <div className="text-sm text-gray-500">{comment.date}</div>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded-lg"
                  value={comments[announcement.id] || ""}
                  onChange={(e) => setComments(prev => ({
                    ...prev,
                    [announcement.id]: e.target.value
                  }))}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Create New Announcement</h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 mb-4 border rounded h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MaterialsTab({ materials, isTeacher, onNewMaterial }: {
  materials: Material[];
  isTeacher: boolean;
  onNewMaterial: (m: Material) => void;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({});

  const handleUpload = () => {
    if (newMaterial.title && newMaterial.type) {
      onNewMaterial({
        id: Date.now(),
        title: newMaterial.title,
        type: newMaterial.type,
        date: new Date().toISOString(),
        file: newMaterial.file,
        link: newMaterial.link
      });
      setModalOpen(false);
      setNewMaterial({});
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Course Materials</h3>
        {isTeacher && (
          <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
            <FiUpload className="mr-2" /> Upload Material
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(material => (
          <div key={material.id} className="border dark:border-gray-700 rounded-xl p-4 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{material.title}</div>
              <span className="text-sm text-gray-500">{material.type}</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">{material.date}</div>
            {material.file ? (
              <a href="#" className="text-blue-500 flex items-center">
                <FiDownload className="mr-2" /> Download
              </a>
            ) : (
              <a href={material.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Open Link
              </a>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Upload New Material</h3>
            <select
              className="w-full p-2 mb-4 border rounded"
              value={newMaterial.type || ""}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">Select Type</option>
              <option value="slides">Slides</option>
              <option value="video">Video</option>
              <option value="resource">Resource</option>
            </select>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded"
              value={newMaterial.title || ""}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
            />
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="materialType"
                  value="file"
                  onChange={() => setNewMaterial(prev => ({ ...prev, link: undefined }))}
                />
                <span className="ml-2">File Upload</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="materialType"
                  value="link"
                  onChange={() => setNewMaterial(prev => ({ ...prev, file: undefined }))}
                />
                <span className="ml-2">External Link</span>
              </label>
            </div>
            {newMaterial.file !== undefined ? (
              <div className="border-dashed border-2 p-4 text-center">
                <FiUpload className="mx-auto text-gray-500 mb-2" />
                <p>Drag and drop files or click to upload</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files?.[0]?.name }))}
                />
              </div>
            ) : (
              <input
                type="url"
                placeholder="Enter URL"
                className="w-full p-2 border rounded"
                value={newMaterial.link || ""}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, link: e.target.value }))}
              />
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommunicationTab({ messages, newMessage, onMessageChange, onSend }: {
  messages: any[];
  newMessage: string;
  onMessageChange: (msg: string) => void;
  onSend: () => void;
}) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">Course Discussions</h3>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl max-w-[70%]">
              <div className="font-medium">Dr. Smith</div>
              <p className="text-gray-600 dark:text-gray-300">Welcome everyone! Feel free to ask questions here.</p>
              <div className="text-sm text-gray-500 mt-1">10:00 AM</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg"
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend()}
            />
            <button onClick={onSend} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
              <FiSend className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParticipantsTab({ students, searchQuery, onSearchChange, isTeacher }: {
  students: Student[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isTeacher: boolean;
}) {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Participants</h3>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-2">Actions</div>
        </div>
        {filteredStudents.map(student => (
          <div key={student.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0">
            <div className="col-span-4">{student.name}</div>
            <div className="col-span-4">{student.email}</div>
            <div className="col-span-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
            <div className="col-span-2 flex space-x-2">
              <button className="text-blue-500 hover:text-blue-600">
                <FiMessageSquare />
              </button>
              {isTeacher && (
                <button className="text-red-500 hover:text-red-600">
                  <FiX />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab({ course }: { course: Course }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">Course Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold mb-4">Assignment Performance</h4>
          <div className="h-80">
            <Bar
              data={{
                labels: course.assignments.map(a => a.title),
                datasets: [{
                  label: 'Average Score',
                  data: course.assignments.map(() => Math.floor(Math.random() * 100)),
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold mb-4">Student Progress</h4>
          <div className="h-80">
            <Line
              data={{
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: [{
                  label: 'Average Progress',
                  data: [20, 35, 45, 60, 75],
                  fill: false,
                  borderColor: 'rgba(59, 130, 246, 1)',
                  tension: 0.1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold mb-4">Material Access</h4>
          <div className="h-64">
            <Pie
              data={{
                labels: ['Lecture Slides', 'Resources', 'Videos', 'Readings'],
                datasets: [{
                  data: [65, 20, 10, 5],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(239, 68, 68, 0.5)'
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold mb-4">Participation Rate</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Discussions</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 rounded-full h-2 w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Assignments</span>
                <span>90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 rounded-full h-2 w-[90%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Material Access</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 rounded-full h-2 w-3/5"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Live Sessions</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 rounded-full h-2 w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold mb-4">Student Engagement</h4>
          <div className="space-y-4">
            {course.students.map(student => (
              <div key={student.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{student.name}</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2" 
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
