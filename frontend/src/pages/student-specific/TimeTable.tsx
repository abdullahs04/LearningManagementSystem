import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";
import toast from "react-hot-toast";


interface TimetableEntry extends EventInput {
  extendedProps: {
    courseCode: string;
    courseTitle: string;
  };
}

const TimeTableStudent: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"day" | "week">("week");

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        
       
        const endpoint = view === "week" 
          ? "http://193.203.162.232:10000/timetable/get_weekly_timetable" 
          : "http://193.203.162.232:10000/timetable/get_timetable";
        
        const response = await axios.post(endpoint, {
          rfid: "6323678", // Replace with actual RFID
        });

        if (response.data.status === "success") {
          const formattedEvents = response.data.timetable.map((event: any) => ({
            ...event,
            extendedProps: {
              courseCode: event.extendedProps?.courseCode || "N/A",
              courseTitle: event.extendedProps?.courseTitle || event.title
            }
          }));
          setScheduleItems(formattedEvents);
        } else {
          toast.error("Failed to load timetable");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        toast.error("Error loading timetable data");
      } finally {
        setLoading(false);
      }
    };


    fetchTimetable();
    
  }, [view, "6323678"]);


  const todayItems = scheduleItems.filter((item) => {
    if (!item.start) return false;
    const itemDate = new Date(item.start as number);
    const today = new Date();
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  });

  const handleViewChange = (view: string) => {
    if (view === "timeGridDay") {
      setView("day");
    } else if (view === "timeGridWeek") {
      setView("week");
    }
  };

  return (
    <>
      <PageMeta
        title="Student Timetable | Learning Management System"
        description="Student course timetable showing scheduled lectures, labs, and tutorials"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/3 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Today's Schedule
              </h2>
              {todayItems.length > 0 ? (
                <div className="space-y-4">
                  {todayItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg shadow-sm transition-all hover:shadow-md"
                      style={{
                        backgroundColor: item.backgroundColor || "#4B5563",
                        color: item.textColor || "#FFFFFF",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">
                          {item.extendedProps.courseCode}
                        </h3>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/20">
                          {new Date(item.start as number).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(item.end as number).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-1">{item.extendedProps.courseTitle}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    No classes scheduled for today
                  </p>
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
                  datesSet={() => {
                    // You could implement date range fetching here if needed
                  }}
                  viewDidMount={(info) => handleViewChange(info.view.type)}
                  eventContent={(eventInfo) => {
                    const event = eventInfo.event;
                    return (
                      <div className="p-1 h-full">
                        <div className="font-medium text-sm">
                          {event.extendedProps.courseCode}
                        </div>
                        <div className="text-xs">
                          {event.extendedProps.courseTitle}
                        </div>
                        <div className="text-xs mt-1 opacity-90">
                          {event.start?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -
                          {event.end?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS to fix calendar theme issues */}
      <style>{`
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

export default TimeTableStudent;