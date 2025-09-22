"use client";

import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search hotels, bookings, or guests..."
              className="pl-10 bg-gray-50 border-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 ml-4">
          {/* Quick Actions */}
          <Button 
            size="sm"
            onClick={() => router.push('/hotels/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </div>

          {/* Profile */}
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">N</span>
          </div>
        </div>
      </div>
    </header>
  );
}