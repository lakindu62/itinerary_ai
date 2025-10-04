
'use client';

import EventCalendar from '@frontend/features/event/calendar/EventCalendar';

const EventCalendarPage = () => {
  return (
    <div className='p-8'>
      <h1 className="text-2xl font-bold">Event Calendar</h1>
      <EventCalendar />
    </div>
  );
};

export default EventCalendarPage;
