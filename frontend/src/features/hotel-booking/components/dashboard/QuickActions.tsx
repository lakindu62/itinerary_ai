"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Hotel, 
  Bed, 
  FileText, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface QuickActionsProps {
  onCreateHotel?: () => void;
  onCreateRoom?: () => void;
  onViewReports?: () => void;
  onViewConflicts?: () => void;
  onViewAnalytics?: () => void;
  conflictsCount?: number;
}

export default function QuickActions({ 
  onCreateHotel,
  onCreateRoom,
  onViewReports,
  onViewConflicts,
  onViewAnalytics,
  conflictsCount = 0
}: QuickActionsProps) {
  const actions = [
    {
      title: 'Create New Hotel',
      description: 'Add a new hotel to your portfolio',
      icon: Hotel,
      color: 'bg-blue-50 text-blue-600',
      onClick: onCreateHotel,
    },
    {
      title: 'Add Room',
      description: 'Create rooms for your hotels',
      icon: Bed,
      color: 'bg-green-50 text-green-600',
      onClick: onCreateRoom,
    },
    {
      title: 'Generate Reports',
      description: 'Download booking and revenue reports',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      onClick: onViewReports,
    },
    {
      title: 'Resolve Conflicts',
      description: `${conflictsCount} booking conflicts need attention`,
      icon: AlertTriangle,
      color: conflictsCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600',
      onClick: onViewConflicts,
      badge: conflictsCount > 0 ? conflictsCount : undefined,
    },
    {
      title: 'View Analytics',
      description: 'Detailed performance metrics',
      icon: BarChart3,
      color: 'bg-orange-50 text-orange-600',
      onClick: onViewAnalytics,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-dark-brown">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={action.onClick}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-md ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-dark-brown flex items-center">
                    {action.title}
                    {action.badge && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}