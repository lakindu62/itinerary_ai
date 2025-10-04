
'use client';

import React, { useState } from 'react';
import HashtagList from '@/features/event/hashtags/HashtagList';
import HashtagForm from '@/features/event/hashtags/HashtagForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const HashtagsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Here you might want to trigger a re-fetch of the hashtags list
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Hashtags</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Hashtag</Button>
          </DialogTrigger>
          <DialogContent className="max-w-screen-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new Hashtag</DialogTitle>
            </DialogHeader>
            <HashtagForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <HashtagList />
    </div>
  );
};

export default HashtagsPage;
