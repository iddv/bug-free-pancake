'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = 'http://localhost:8000'; // Change this to match your actual backend URL

interface CancelEventButtonProps {
  eventId: string;
  onSuccess?: () => void;
}

export function CancelEventButton({ eventId, onSuccess }: CancelEventButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel event');
      }

      // Success
      setIsDialogOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel event');
      console.error('Error cancelling event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" className="text-red-600 hover:text-red-800" onClick={handleCancelClick}>
        Cancel Event
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Nevermind
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmCancel}
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