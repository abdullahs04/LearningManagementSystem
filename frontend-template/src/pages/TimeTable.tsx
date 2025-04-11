import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import PageMeta from "../components/common/PageMeta";

// TODO ask opinions on grey color and may shify to dark blue
// TODO update these static events to be get event from the terminal

interface TimetableEntry extends EventInput {
  extendedProps: {
    courseCode: string;
    courseTitle: string;
  };
}

const TimeTable: React.FC = () => {
  const [scheduleItems] = useState<TimetableEntry[]>([
    {
      id: "1",
      title: "CS101 - Software Engineering",
      start: new Date().setHours(9, 0, 0, 0),
      end: new Date().setHours(10, 30, 0, 0),
      backgroundColor: "#374151", // gray-700
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS101",
        courseTitle: "Software Engineering",
      },
    },
    {
      id: "2",
      title: "CS202 - Data Structures",
      start: new Date(Date.now() + 86400000).setHours(11, 0, 0, 0),
      end: new Date(Date.now() + 86400000).setHours(12, 30, 0, 0),
      backgroundColor: "#1F2937", // gray-800
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS202",
        courseTitle: "Data Structures",
      },
    },
    {
      id: "3",
      title: "CS303 - Digital Logic Lab",
      start: new Date(Date.now() + 172800000).setHours(14, 0, 0, 0),
      end: new Date(Date.now() + 172800000).setHours(17, 0, 0, 0),
      backgroundColor: "#111827", // gray-900
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS303",
        courseTitle: "Digital Logic Lab",
      },
    },
    {
      id: "4",
      title: "CS404 - Database Systems",
      start: new Date().setHours(13, 0, 0, 0),
      end: new Date().setHours(14, 30, 0, 0),
      backgroundColor: "#4B5563", // gray-600
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS404",
        courseTitle: "Database Systems",
      },
    },
    {
      id: "5",
      title: "CS505 - Algorithms",
      start: new Date(Date.now() + 86400000).setHours(14, 0, 0, 0),
      end: new Date(Date.now() + 86400000).setHours(15, 30, 0, 0),
      backgroundColor: "#4B5563", // gray-600
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS505",
        courseTitle: "Algorithms",
      },
    },
    {
      id: "6",
      title: "CS606 - Machine Learning",
      start: new Date(Date.now() + 259200000).setHours(10, 0, 0, 0), // 3 days ahead
      end: new Date(Date.now() + 259200000).setHours(11, 30, 0, 0),
      backgroundColor: "#1F2937", // gray-800
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS606",
        courseTitle: "Machine Learning",
      },
    },
    {
      id: "7",
      title: "CS707 - Computer Networks",
      start: new Date(Date.now() + 345600000).setHours(9, 0, 0, 0), // 4 days ahead
      end: new Date(Date.now() + 345600000).setHours(10, 30, 0, 0),
      backgroundColor: "#111827", // gray-900
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS707",
        courseTitle: "Computer Networks",
      },
    },
    {
      id: "8",
      title: "CS808 - Artificial Intelligence",
      start: new Date(Date.now() + 172800000).setHours(9, 0, 0, 0), // 2 days ahead
      end: new Date(Date.now() + 172800000).setHours(10, 30, 0, 0),
      backgroundColor: "#374151", // gray-700
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS808",
        courseTitle: "Artificial Intelligence",
      },
    },
    {
      id: "9",
      title: "CS909 - Cybersecurity",
      start: new Date(Date.now() + 345600000).setHours(13, 0, 0, 0), // 4 days ahead
      end: new Date(Date.now() + 345600000).setHours(14, 30, 0, 0),
      backgroundColor: "#6B7280", // gray-500
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS909",
        courseTitle: "Cybersecurity",
      },
    },
    {
      id: "10",
      title: "CS010 - Web Development",
      start: new Date(Date.now() + 432000000).setHours(15, 0, 0, 0), // 5 days ahead
      end: new Date(Date.now() + 432000000).setHours(16, 30, 0, 0),
      backgroundColor: "#4B5563", // gray-600
      textColor: "#FFFFFF",
      extendedProps: {
        courseCode: "CS010",
        courseTitle: "Web Development",
      },
    },
  ]);

  // Get today's schedule items only
  const todayItems = scheduleItems.filter(item => {
    const itemDate = new Date(item.start as number);
    const today = new Date();
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <>
      <PageMeta
        title="Student Timetable | Learning Management System"
        description="Student course timetable showing scheduled lectures, labs, and tutorials"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Today's Schedule</h2>
            {todayItems.length > 0 ? (
              <div className="space-y-4">
                {todayItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg shadow-sm transition-all hover:shadow-md"
                    style={{
                      backgroundColor: item.backgroundColor,
                      color: item.textColor,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{item.extendedProps.courseCode}</h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/20">
                        {new Date(item.start as number).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {" - "}
                        {new Date(item.end as number).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-1">{item.extendedProps.courseTitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-600 dark:text-gray-300">No classes scheduled for today</p>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="custom-timetable rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridWeek,timeGridDay",
                }}
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                events={scheduleItems}
                height="auto"
                aspectRatio={1.8}
                eventContent={(eventInfo) => {
                  const event = eventInfo.event;
                  return (
                    <div className="p-1 h-full">
                      <div className="font-medium text-sm">{event.extendedProps.courseCode}</div>
                      <div className="text-xs">{event.extendedProps.courseTitle}</div>
                      <div className="text-xs mt-1 opacity-90">
                        {event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS to fix calendar theme issues */}
      <style jsx global>{`
        .fc {
          --fc-border-color: rgba(229, 231, 235, 0.8);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(243, 244, 246, 0.5);
          --fc-event-border-color: transparent;
          --fc-today-bg-color: rgba(219, 234, 254, 0.3);
        }
        
        .dark .fc {
          --fc-border-color: rgba(55, 65, 81, 0.8);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(31, 41, 55, 0.5);
          --fc-event-border-color: transparent;
          --fc-today-bg-color: rgba(30, 58, 138, 0.2);
          --fc-button-text-color: #e5e7eb;
          --fc-button-bg-color: #4b5563;
          --fc-button-border-color: #6b7280;
          --fc-button-hover-bg-color: #374151;
          --fc-button-hover-border-color: #9ca3af;
          --fc-button-active-bg-color: #1f2937;
          color: #e5e7eb;
        }
        
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background-color: var(--fc-button-active-bg-color);
        }
        
        .fc .fc-col-header-cell {
          background-color: var(--fc-neutral-bg-color);
        }
        
        .fc .fc-timegrid-slot {
          height: 3em;
        }
        
        .fc .fc-event {
          border-radius: 6px;
          padding: 2px;
          margin: 1px;
          border-left-width: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .dark .fc-toolbar-title,
        .dark .fc th {
          color: #e5e7eb;
        }
      `}</style>
    </>
  );
};

export default TimeTable;