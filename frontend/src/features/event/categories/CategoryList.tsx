'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getBusinessCategories, deleteBusinessCategory } from '../lib/event-api';
import Link from 'next/link';

interface Category {
  id: string;
  categoryName: string;
  description: string;
}

const CategoryList = () => {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!getToken) return; // Ensure getToken is available
      try {
        const data = await getBusinessCategories(getToken);
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [getToken]);

  const handleDelete = async (id: string) => {
    if (!getToken) return; // Ensure getToken is available
    try {
      await deleteBusinessCategory(id, getToken);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={category.description} >
                {category.description}</TableCell>
                <TableCell>
                  <Link href={`/admin/event/categories/edit/${category.id}`} passHref>
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
