'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getHashtags, deleteHashtag } from '../lib/event-api';
import Link from 'next/link';

interface Hashtag {
  id: string;
  hashtagName: string;
}

const HashtagList = () => {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const data = await getHashtags();
        setHashtags(data);
      } catch (error) {
        console.error('Failed to fetch hashtags:', error);
      }
    };
    fetchHashtags();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteHashtag(id);
      setHashtags(hashtags.filter((hashtag) => hashtag.id !== id));
    } catch (error) {
      console.error('Failed to delete hashtag:', error);
    }
  };

  const filteredHashtags = hashtags.filter((hashtag) =>
    hashtag.hashtagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hashtags</CardTitle>
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
              <TableHead>Hashtag Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHashtags.map((hashtag) => (
              <TableRow key={hashtag.id}>
                <TableCell>#{hashtag.hashtagName}</TableCell>
                <TableCell>
                  <Link href={`/admin/event/hashtags/edit/${hashtag.id}`} passHref>
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(hashtag.id)}
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

export default HashtagList;