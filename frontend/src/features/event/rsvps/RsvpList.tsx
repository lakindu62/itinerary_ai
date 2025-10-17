'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRsvps, deleteRsvp } from '../lib/event-api';
import { Trash2 } from 'lucide-react';

interface Event {
  id: string;
  eventName: string;
}

interface Rsvp {
  id: string;
  event: Event;
  userId: string;
  rsvpStatus: string;
  guestCount: number;
}

const RsvpList = () => {
  const { getToken } = useAuth();
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('userId');

  useEffect(() => {
    const fetchRsvps = async () => {
      if (!getToken) return; // Ensure getToken is available
      try {
        const data = await getRsvps(getToken);
        setRsvps(data);
      } catch (error) {
        console.error('Failed to fetch rsvps:', error);
      }
    };
    fetchRsvps();
  }, [getToken]);

  const handleDelete = async (id: string) => {
    if (!getToken) return;
    try {
      await deleteRsvp(id, getToken);
      setRsvps(rsvps.filter((rsvp) => rsvp.id !== id));
    } catch (error) {
      console.error('Failed to delete rsvp:', error);
    }
  };

  const filteredRsvps = rsvps.filter((rsvp) => {
    if (filter === 'userId') {
      return rsvp.userId.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filter === 'eventName') {
      return rsvp.event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSVPs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mr-2"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="userId">User ID</SelectItem>
              <SelectItem value="eventName">Event Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>User Id</TableHead>
              <TableHead>Guest Count</TableHead>
              <TableHead>Rsvp Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRsvps.map((rsvp) => (
              <TableRow key={rsvp.id}>
                <TableCell>{rsvp.event.eventName}</TableCell>
                <TableCell>{rsvp.userId}</TableCell>
                <TableCell>{rsvp.guestCount}</TableCell>
                <TableCell>{rsvp.rsvpStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(rsvp.id)}
                  >
                    <Trash2 className="h-4 w-4" /> 

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

export default RsvpList;