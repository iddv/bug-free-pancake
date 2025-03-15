'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calendar, CheckCircle, MapPin } from 'lucide-react';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = 'http://localhost:8000'; // Change this to match your actual backend URL

// Helper function to check if an event is active
const isEventActive = (status: string): boolean => {
  return status === 'CONFIRMED' || 
         status === 'Open' || 
         status === 'OPEN' || 
         status === 'Confirmed';
};

// Helper function to check if an event is cancelled
const isEventCancelled = (status: string): boolean => {
  return status === 'CANCELLED' || 
         status === 'Cancelled';
};

export default function JoinEventPage({ 
  params 
}: { 
  params: { eventId: string } | Promise<{ eventId: string }> 
}) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const { eventId } = unwrappedParams;
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/events/${eventId}/join`);
    }
  }, [isAuthenticated, isLoading, router, eventId]);
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.statusText}`);
        }
        
        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch event'));
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchEvent();
    }
  }, [eventId, isAuthenticated]);

  const handleJoinEvent = async () => {
    if (!agreedToTerms) {
      setJoinError('You must agree to the terms and conditions.');
      return;
    }

    setSubmitting(true);
    setJoinError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join event');
      }

      // Success - redirect to event page
      router.push(`/events/${eventId}?joined=true`);
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : 'Failed to join event');
      console.error('Error joining event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  if (isLoading || (!isAuthenticated && isLoading)) {
    return <div className="min-h-screen bg-white p-8">Loading authentication...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Join Event</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Error loading event</h3>
            </div>
            <p>{error?.message || 'Event not found'}</p>
            <p className="text-sm mt-2">
              The event may have been removed or you may have followed an invalid link.
            </p>
            <Link href="/events" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Return to events listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if event is full, cancelled, or already joined
  const isFull = event.currentPlayers >= event.maxPlayers;
  const isCancelled = isEventCancelled(event.status);
  const isPast = new Date(event.date) < new Date();
  const hasJoined = event.participants?.some((p: any) => p.userId === user?.id);

  // Check if user can join
  const canJoin = !isFull && !isCancelled && !isPast && !hasJoined;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/events/${eventId}`} className="text-blue-600 hover:text-blue-800 inline-block mb-6">
          ← Back to event details
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Join Event</CardTitle>
            <CardDescription>
              You're joining the following event:
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-lg">{event.sport}</h3>
              <div className="mt-2 space-y-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
              </div>
            </div>
            
            {!canJoin && (
              <div className={`rounded-lg p-4 ${
                isCancelled ? 'bg-red-50 text-red-700' : 
                isFull ? 'bg-yellow-50 text-yellow-700' :
                isPast ? 'bg-gray-50 text-gray-700' : 
                'bg-blue-50 text-blue-700'
              }`}>
                <p className="font-medium">
                  {isCancelled ? 'This event has been cancelled.' :
                  isFull ? 'This event is already full.' :
                  isPast ? 'This event has already passed.' :
                  hasJoined ? 'You have already joined this event.' :
                  'You cannot join this event.'}
                </p>
              </div>
            )}
            
            {canJoin && (
              <div className="space-y-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="text-sm font-medium">
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-sm text-gray-500">
                      By joining this event, I confirm that I will attend and participate. 
                      I will notify the organizer if I cannot attend.
                    </p>
                  </div>
                </div>
                
                {joinError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <p>{joinError}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/events/${eventId}`)}
            >
              Cancel
            </Button>
            {canJoin && (
              <Button 
                onClick={handleJoinEvent}
                disabled={submitting || !agreedToTerms}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> 
                {submitting ? 'Joining...' : 'Confirm Join'}
              </Button>
            )}
            {!canJoin && (
              <Button
                onClick={() => router.push('/events')}
                variant="outline"
              >
                Browse Other Events
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 