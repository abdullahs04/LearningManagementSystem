import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiVideo } from "react-icons/fi"; // Added for meeting icon

import {
  BoxCubeIcon,
  ChevronDownIcon,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";

import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  MessageSquare,
  Calendar,
  User,
  Users,
  School,
  GraduationCap,
  CalendarClock,
  DollarSign,
  Settings,
  BarChart,
  CheckCircle,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type UserRole = "admin" | "teacher" | "student";
const UserLoggedInIs: UserRole = "student"; 

type Course = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  description: string;
};

const StudentCoursesPlaceholder = [
  {
    name: "Course 1",
    icon: <UserCircleIcon />,
    path: "/course/1",
  },
  {
    name: "Course 2",
    icon: <UserCircleIcon />,
    path: "/courses",
  },
];

const TeacherCoursesPlaceholder = [
  {
    name: "Course 1",
    icon: <UserCircleIcon />,
    path: "/course/1",
  },
  {
    name: "Course 2",
    icon: <UserCircleIcon />,
    path: "/courses",
  },
];

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  meetingAction?: (courseId: string) => void; // Added meeting action
};

const AppSidebar: React.FC = () => {
  const [studentCourses, setStudentCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const navigate = useNavigate();
  
  const studentRfid = "6323678"; 

  // Function to handle meeting start/join
  const handleMeetingAction = (courseId: string) => {
    const roomId = `subject_${courseId}`;
    const userName = UserLoggedInIs === "teacher" 
      ? "Teacher" 
      : "Student"; // In real app, use actual user name
    
    const url = `https://localhost:8443/${roomId}?name=${encodeURIComponent(userName)}`;
    setMeetingUrl(url);
    setShowMeetingModal(true);
  };

  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (UserLoggedInIs !== "student") return;
      
      setLoadingCourses(true);
      setErrorCourses(null);
      
      try {
        const response = await axios.get(
          `http://193.203.162.232:10000/MyCourses/${studentRfid}/MyCourses`
        );
        
        if (response.data.success) {
          setStudentCourses(response.data.subjects);
        } else {
          setErrorCourses("Failed to load courses");
        }
      } catch (error) {
        setErrorCourses("Error fetching courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchStudentCourses();
  }, [studentRfid]);

  const getNavItems = (): NavItem[] => {
    if (UserLoggedInIs === "admin") {
      return [
        { icon: <LayoutDashboard size={18} />, name: "Overview", path: "admin-overview" },
        {
          icon: <Users size={18} />,
          name: "Staff Management",
          path: "/staff-management",
        },
        {
          icon: <School size={18} />,
          name: "Classroom & Subject Management",
          path: "/class-and-student-management",
        },
        { icon: <GraduationCap size={18} />, name: "Gradebook", path: "/gradebook" },
        {
          icon: <CalendarClock size={18} />,
          name: "Examinations & Timetable",
          path: "/timetable-and-exams",
        },
        {
          icon: <CheckCircle size={18} />,
          name: "Attendance Tracking",
          path: "/attendance-tracking",
        },
        {
          icon: <DollarSign size={18} />,
          name: "Fee Management",
          path: "/fee-management",
        },
        { icon: <User size={18} />, name: "User Profile", path: "/profile" },
        {
          icon: <Settings size={18} />,
          name: "System Settings",
          path: "/system-settings",
        },
      ];
    } else if (UserLoggedInIs === "teacher") {
      return [
        {
          icon: <LayoutDashboard size={18} />,
          name: "Overview",
          path: "/professor-overview",
        },
        {
          icon: <CalendarClock size={18} />,
          name: "TimeTable",
          path: "/timetable-professor",
        },
        {
          icon: <BookOpen size={18} />,
          name: "Courses",
          subItems: TeacherCoursesPlaceholder.map((course) => ({
            name: course.name,
            path: course.path,
            meetingAction: handleMeetingAction // Added meeting action
          })),
        },
        {
          icon: <ClipboardCheck size={18} />,
          name: "Grading & Assessment",
          path: "/assignments-grade",
        },
        {
          icon: <MessageSquare size={18} />,
          name: "Queries & Feedback",
          path: "/queries-and-feedback",
        },
        { icon: <User size={18} />, name: "User Profile", path: "/profile" },
      ];
    } else if (UserLoggedInIs === "student") {
      return [
        {
          icon: <LayoutDashboard size={18} />,
          name: "Overview",
          path: "/student-overview",
        },
        {
          icon: <ClipboardCheck size={18} />,
          name: "Attendance Record",
          path: "/attendance-records",
        },
        {
          icon: <BookOpen size={18} />,
          name: "Courses",
          subItems: loadingCourses
            ? [{ name: "Loading...", path: "#" }]
            : errorCourses
            ? [{ name: "Error loading courses", path: "#" }]
            : studentCourses.length > 0
            ? studentCourses.map((course) => ({
                name: course.name,
                path: `/course/${course.id}`,
                meetingAction: handleMeetingAction // Added meeting action
              }))
            : StudentCoursesPlaceholder.map((course) => ({
                name: course.name,
                path: course.path,
                meetingAction: handleMeetingAction // Added meeting action
              })),
        },
        {
          icon: <MessageSquare size={18} />,
          name: "Feedback & Reviews",
          path: "/feedback",
        },
        {
          icon: <BarChart size={18} />,
          name: "Results & Grades",
          path: "/grades",
        },
        {
          icon: <Calendar size={18} />,
          name: "TimeTable",
          path: "/timetable-student",
        },
        { icon: <User size={18} />, name: "Student Profile", path: "/profile" },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name} className="flex items-center justify-between">
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                    {/* Add meeting button for each course */}
                    {subItem.meetingAction && (
                      <button
                        onClick={() => subItem.meetingAction(subItem.path.split('/').pop() || '')}
                        className="p-1 text-blue-500 hover:text-blue-600"
                        title={UserLoggedInIs === "teacher" ? "Start Meeting" : "Join Meeting"}
                      >
                        <FiVideo size={16} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
          ${
            isExpanded || isMobileOpen
              ? "w-[290px]"
              : isHovered
              ? "w-[290px]"
              : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`py-8 flex ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link to="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <img
                  className="dark:hidden"
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  width={150}
                  height={40}
                />
                <img
                  className="hidden dark:block"
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  width={150}
                  height={40}
                />
              </>
            ) : (
              <img
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )}
          </Link>
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                ></h2>
                {renderMenuItems(navItems, "main")}
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">
                {UserLoggedInIs === "teacher" ? "Teaching" : "Attending"} Class Meeting
              </h3>
              <button 
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="flex-1">
              <iframe 
                src={meetingUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
                title="Class Meeting"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;