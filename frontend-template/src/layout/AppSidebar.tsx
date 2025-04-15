import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

// TODO add logic to check which type of user logged in and show the menu accordingly
const UserLoggedInIs: "admin" | "teacher" | "student" = "teacher"; // or "user" or "teacher" or "student"

// TODO: the path will be decided later on how to implement,
//  the course icon and name will be set by the teacher or admin TO BE DECIDED

const StudentCourses = [
  {
    name: "Course 1",
    icon: <UserCircleIcon />,
    path: "/course-1",
  },
  {
    name: "Course 1",
    icon: <UserCircleIcon />,
    path: "/course-1",
  },
]

const TeacherCourses = [
  {
    name: "Course 1",
    icon: <UserCircleIcon />,
    path: "/course-1",
  },
  {
    name: "Course 1",
    icon: <UserCircleIcon />,
    path: "/course-1",
  },
]

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// TODO Define menu items based on user role and also fix the icons
const getNavItems = (): NavItem[] => {
  if (UserLoggedInIs === "admin") {
    return [
      {
        icon: <GridIcon />,
        name: "Overview",
        path: "/",
      },
  
      {
        icon: <UserCircleIcon />,
        name: "User Profile",
        path: "/profile",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Student Information System",
        path: "/students",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Staff Management",
        path: "/staff",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Classroom & Subject Management",
        path: "/classes",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Gradebook",
        path: "/grades",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Examinations & Timetable",
        path: "/exams",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Lesson Plans & Course Materials",
        path: "/lesson-plans",
      },
  
      // Attendance & Communication
      {
        icon: <UserCircleIcon />, 
        name: "Attendance Tracking",
        path: "/attendance",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Fee Management",
        path: "/fees",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Budgeting & Expenses",
        path: "/budget",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "Transport Management",
        path: "/transport",
      },
  
      // Reports & Analytics
      {
        icon: <UserCircleIcon />, 
        name: "Performance Analytics",
        path: "/analytics",
      },
  
      {
        icon: <UserCircleIcon />, 
        name: "System Settings",
        path: "/system-settings",
      },
    ];
  } else if (UserLoggedInIs === "teacher") {
    return [
      {
        icon: <UserCircleIcon />,
        name: "Overview",
        path: "/professor-overview",
      },
      {
        icon: <CalenderIcon />,
        name: "TimeTable",
        path: "/timetable-professor",
      },
      {
        icon: <UserCircleIcon />,
        name: "Courses",
        subItems: TeacherCourses.map((course) => ({
          icon: course.icon,
          name: course.name,
          path: course.path,
        })),
        },
      {
        icon: <CalenderIcon />,
        name: "Grading & Assessment",
        path: "/grading",
      },
      {
        icon: <CalenderIcon />,
        name: "Queries & Feedback",
        path: "/calendar",
      },
      {
        icon: <CalenderIcon />,
        name: "Results submission",
        path: "/calendar",
      },
      {
        icon: <UserCircleIcon />,
        name: "User Profile",
        path: "/profile",
      },
    ];
  } else if (UserLoggedInIs === "student") {
    return [
      {
      icon: <UserCircleIcon />,
      name: "Overview",
      path: "/student-overview",
      },
      {
      icon: <UserCircleIcon />,
      name: "Attendance Record",
      path: "/attendance-records",
      },
      {
      icon: <UserCircleIcon />,
      name: "Courses",
      subItems: StudentCourses.map((course) => ({
        icon: course.icon,
        name: course.name,
        path: course.path,
      })),
      },
      {
        icon: <UserCircleIcon />,
        name: "Feedback & Reviews",
        path: "/feedback",
      },
      {
      icon: <UserCircleIcon />,
      name: "Results & Grades",
      path: "/grades",
      },
      {
        icon: <UserCircleIcon />,
        name: "TimeTable",
        path: "/timetable-student",
      },
      {
      icon: <UserCircleIcon />,
      name: "Student Profile",
      path: "/profile",
      },
    ];
  }
  return [];
};

const navItems: NavItem[] = getNavItems();

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
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
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
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
              >
                
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
