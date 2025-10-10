
'use client';

import React, { useState } from 'react';
import CategoryList from '@/features/event/categories/CategoryList';
import CategoryForm from '@/features/event/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CategoriesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Here you might want to trigger a re-fetch of the categories list
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-screen-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <CategoryList />
    </div>
  );
};

export default CategoriesPage;
