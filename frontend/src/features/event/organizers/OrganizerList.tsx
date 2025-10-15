'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getBusinessOrganizers, deleteBusinessOrganizer } from '../lib/event-api';
import Link from 'next/link';

interface Organizer {
  id: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const OrganizerList = () => {
  const { getToken } = useAuth();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrganizers = async () => {
      if (!getToken) return; // Ensure getToken is available
      try {
        const data = await getBusinessOrganizers(getToken);
        setOrganizers(data);
      } catch (error) {
        console.error('Failed to fetch organizers:', error);
      }
    };
    fetchOrganizers();
  }, [getToken]);

  const handleDelete = async (id: string) => {
    if (!getToken) return; // Ensure getToken is available
    try {
      await deleteBusinessOrganizer(id, getToken);
      setOrganizers(organizers.filter((organizer) => organizer.id !== id));
    } catch (error) {
      console.error('Failed to delete organizer:', error);
    }
  };

  const filteredOrganizers = organizers.filter((organizer) =>
    organizer.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizers</CardTitle>
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
              <TableHead>Organizer Name</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Contact Phone</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizers.map((organizer) => (
              <TableRow key={organizer.id}>
                <TableCell>{organizer.organizerName}</TableCell>
                <TableCell>{organizer.contactEmail}</TableCell>
                <TableCell>{organizer.contactPhone}</TableCell>
                <TableCell>{organizer.organization}</TableCell>
                <TableCell>
                  <Link href={`/admin/event/organizers/edit/${organizer.id}`} passHref>
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(organizer.id)}
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

export default OrganizerList;
