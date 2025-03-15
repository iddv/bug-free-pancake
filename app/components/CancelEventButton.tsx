'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { cancelEvent } from '@/lib/api/events';
import { XCircle } from 'lucide-react';

interface CancelEventButtonProps {
  eventId: number;
  eventName?: string;
  onSuccess?: () => void;
}

export function CancelEventButton({ 
  eventId, 
  eventName = 'this event',
  onSuccess
}: CancelEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await cancelEvent(eventId);
      toast({
        title: 'Event cancelled',
        description: `You have successfully cancelled ${eventName}.`,
        variant: 'default',
      });
      setIsOpen(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Refresh the page to show updated event status
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to cancel event:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel the event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <XCircle className="h-4 w-4" />
        Cancel Event
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {eventName}? This action cannot be undone.
              All participants will be notified that the event has been cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              No, Keep Event
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 