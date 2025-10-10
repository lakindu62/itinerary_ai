'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getEvents, deleteEvent } from '../lib/event-api';

interface EventItem {
  id: string;
  eventName: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  eventStatus?: 'active' | 'inactive';
  venue?: { id: string; venueName: string } | null;
  organizer?: { id: string; organizerName: string } | null;
  category?: { id: string; categoryName: string } | null;
}

const EventList = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const filtered = events.filter(e =>
    e.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search by event name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Times</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.eventName}</TableCell>
                <TableCell>
                  {e.startDate}
                  {e.endDate ? ` → ${e.endDate}` : ''}
                </TableCell>
                <TableCell>
                  {e.startTime || '-'}
                  {e.endTime ? ` → ${e.endTime}` : ''}
                </TableCell>
                <TableCell>{e.eventStatus || '-'}</TableCell>
                <TableCell>{e.venue?.venueName || '-'}</TableCell>
                <TableCell>{e.organizer?.organizerName || '-'}</TableCell>
                <TableCell>{e.category?.categoryName || '-'}</TableCell>
                <TableCell>
                  <Link href={`/admin/event/edit/${e.id}`} passHref>
                    <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventList;


