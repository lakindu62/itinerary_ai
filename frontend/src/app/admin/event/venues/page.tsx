
'use client';

import React, { useState } from 'react';
import VenueList from '@/features/event/venues/VenueList';
import VenueForm from '@/features/event/venues/VenueForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const VenuesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Here you might want to trigger a re-fetch of the venues list
    // For now, we can just close the dialog
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Venues</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Venue</Button>
          </DialogTrigger>
          <DialogContent className="max-w-screen-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new Venue</DialogTitle>
            </DialogHeader>
            <VenueForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <VenueList />
    </div>
  );
};

export default VenuesPage;
