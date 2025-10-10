// //i need to impkement the event form here to edit the event
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { getEventById } from '@/features/event/lib/event-api';
// import EventForm from '@/features/event/create/EventForm';

// interface Event {
//   id: string;
//   eventName: string;
//   description: string;
//   date: string;
//   time: string;
//   venueId: string;
//   organizerId: string;
//   categoryId: string;
//   hashtags: string[];
//   imagesUrl: string[];
//   eventStatus: string;
// }

// const EditEventPage: React.FC = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [event, setEvent] = useState<Event | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         if (id) {
//           const eventData = await getEventById(id);
//           setEvent(eventData);
//         }
//       } catch (error) {
//         console.error('Failed to fetch event:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvent();
//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!event) {
//     return <div>Event not found</div>;
//   }

//   return (
//     <div>
//       <h1>Edit Event</h1>
//       <EventForm event={event} />
//     </div>
//   );
// };

// export default EditEventPage;


'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById } from '@/features/event/lib/event-api';
import EventForm from '@/features/event/create/EventForm';

const EditEventPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!id) return;
    getEventById(id as string)
      .then((data) => setEvent(data || null))
      .catch(() => setEvent(null));
  }, [id]);

  if (event === null) return <div>Event not found.</div>;
  if (!event) return <div>Loading event details...</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <EventForm initialValues={event} onSuccess={() => router.push('/admin/event/allevents/')} />
    </div>
  );
};

export default EditEventPage;
