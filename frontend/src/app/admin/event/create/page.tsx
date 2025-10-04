
'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import EventForm from '@/features/event/create/EventForm';

const CreateEventPage = () => {
  const router = useRouter(); // Get the router instance

  // Define the success handler
  const handleSuccess = () => {
    router.push('/admin/event/allevents'); // Redirect to the all events page
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Event</h1>
      <EventForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateEventPage;
