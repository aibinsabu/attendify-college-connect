
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type Announcement = {
  id?: string;
  _id?: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string | Date;
  read?: string[];
};

type BusRouteAnnouncementsProps = {
  announcements: Announcement[];
};

const BusRouteAnnouncements: React.FC<BusRouteAnnouncementsProps> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>No announcements available at this time</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    // Sort by date (newest first)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Recent announcements for this route</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => {
            const id = announcement._id || announcement.id;
            return (
              <div key={id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{announcement.title}</h3>
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{announcement.message}</p>
                <div className="text-xs text-gray-500">
                  {typeof announcement.createdAt === 'string' 
                    ? format(new Date(announcement.createdAt), 'PPP p')
                    : format(announcement.createdAt, 'PPP p')}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusRouteAnnouncements;
