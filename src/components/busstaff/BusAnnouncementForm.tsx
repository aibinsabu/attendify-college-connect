
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { API } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

type AnnouncementFormProps = {
  routeId: string;
  onSuccess?: () => void;
};

const BusAnnouncementForm: React.FC<AnnouncementFormProps> = ({ routeId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      message: '',
      priority: 'medium'
    }
  });
  
  const onSubmit = async (data: any) => {
    // Get user ID safely - check for both id and _id properties
    const userId = user?._id || user?.id;
    
    if (!userId) {
      toast.error('You must be logged in to create announcements');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await API.busRoute.addAnnouncement(routeId, {
        title: data.title,
        message: data.message,
        priority: data.priority,
        createdBy: userId
      });
      
      toast.success('Announcement created successfully');
      reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Bus Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title</Label>
            <Input
              id="title"
              placeholder="Enter announcement title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter announcement message"
              rows={4}
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select defaultValue="medium" name="priority">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Announcement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusAnnouncementForm;
