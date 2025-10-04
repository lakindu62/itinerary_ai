'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getVenues, deleteVenue } from '../lib/event-api';
import Link from 'next/link';

// Temporary Venue type definition
interface Venue {
  id: string;
  venueName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  capacity: number;
  facilities: string[];
}

const VenueList = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteVenue(id);
      setVenues(venues.filter((venue) => venue.id !== id));
    } catch (error) {
      console.error('Failed to delete venue:', error);
    }
  };

  const filteredVenues = venues.filter((venue) =>
    venue.venueName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Venues</CardTitle>
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
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Postal Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Facilities</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVenues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>{venue.venueName}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={venue.address}>
                  {venue.address}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis" 
                title={venue.city}>
                  {venue.city}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={venue.province}>
                  {venue.province}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={venue.postalCode}>
                  {venue.postalCode}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={venue.country}>
                  {venue.country}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis" >
                  {venue.capacity}</TableCell>
                <TableCell className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis" 
                title={venue.facilities.join(', ')}>
                  {venue.facilities.join(', ')}
                  </TableCell>
                <TableCell>
             <Link href={`/admin/event/venues/edit/${venue.id}`} passHref>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
              </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(venue.id)}
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

export default VenueList;