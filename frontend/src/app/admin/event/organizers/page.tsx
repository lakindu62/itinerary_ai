
'use client';

import React, { useState } from 'react';
import OrganizerList from '@/features/event/organizers/OrganizerList';
import OrganizerForm from '@/features/event/organizers/OrganizerForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const OrganizersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Here you might want to trigger a re-fetch of the organizers list
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Organizers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Organizer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-screen-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new Organizer</DialogTitle>
            </DialogHeader>
            <OrganizerForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <OrganizerList />
    </div>
  );
};

export default OrganizersPage;
