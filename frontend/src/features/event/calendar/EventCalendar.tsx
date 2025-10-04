import React, { useState, useEffect } from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import { DateTime } from 'luxon';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../lib/event-api';
import EventForm from '../create/EventForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@frontend/components/ui/scroll-area';

const localizer = luxonLocalizer(DateTime);

type SlotInfoType = {
  start: Date;
  end: Date;
  slots: Date[];
  action: string;
};

const EventCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfoType | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        // const formattedEvents = eventData.map(event => ({
        //   ...event,
        //   start: DateTime.fromISO(event.startDate).toJSDate(),
        //   end: DateTime.fromISO(event.endDate).toJSDate(),
        //   title: event.eventName,
        // }));
        const formattedEvents = eventData.map(event => ({
          ...event,
          start: DateTime.fromISO(`${event.startDate}T${event.startTime || '00:00'}`).toJSDate(),
          end: DateTime.fromISO(`${event.endDate}T${event.endTime || '23:59'}`).toJSDate(),
          title: event.eventName,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  // const handleSelectSlot = (slotInfo) => {
  //   setSelectedSlot(slotInfo);
  //   setIsDialogOpen(true);
  // };

  const handleSelectSlot = (slotInfo) => {
  const now = DateTime.now();
  const slotStart = DateTime.fromJSDate(slotInfo.start);

  if (slotStart < now) {
    // You can use a toast, snackbar, or alert here
    alert('Cannot create events in the past!');
    return;
  }

  setSelectedSlot(slotInfo);
  setIsDialogOpen(true);
};

  const handleEventCreated = () => {
    setIsDialogOpen(false);
    // Refresh events
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        const formattedEvents = eventData.map(event => ({
          ...event,
          start: DateTime.fromISO(event.startDate).toJSDate(),
          end: DateTime.fromISO(event.endDate).toJSDate(),
          title: event.eventName,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView={Views.MONTH}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <ScrollArea className="h-full">
              <EventForm
                initialValues={{
                  startDate: DateTime.fromJSDate(selectedSlot.start).toISODate(),
                  endDate: DateTime.fromJSDate(selectedSlot.end).toISODate(),
                  startTime: DateTime.fromJSDate(selectedSlot.start).toFormat('HH:mm'),
                  endTime: DateTime.fromJSDate(selectedSlot.end).toFormat('HH:mm'),
                }}
                onSuccess={handleEventCreated}
              />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;