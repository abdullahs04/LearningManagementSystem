import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventInput } from "@fullcalendar/core";
import PageMeta from "../components/common/PageMeta";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

// TODO update these static events to be get event from the terminal

const Calendar: React.FC = () => {
  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Event Conf.",
      start: new Date().toISOString().split("T")[0],
      extendedProps: { calendar: "Danger" },
    },
    {
      id: "2",
      title: "Meeting",
      start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      extendedProps: { calendar: "Success" },
    },
    {
      id: "3",
      title: "Workshop",
      start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
      extendedProps: { calendar: "Primary" },
    },
  ]);

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventContent={renderEventContent}
          />
        </div>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;