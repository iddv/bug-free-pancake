'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, User, AlertCircle } from 'lucide-react';
import { CancelEventButton } from '@/components/CancelEventButton';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = 'http://localhost:8000'; // Change this to match your actual backend URL

interface EventParticipant {
  userId: string;
  name: string;
  joinedAt: string;
}

interface EventDetail {
  eventId: string;
  sport: string;
  location: string;
  date: string;
  currentPlayers: number;
  maxPlayers: number;
  skillLevel: number;
  status: string;
  createdBy: string;
  whatsappGroupLink: string | null;
  bookingUrl?: string | null;
  createdAt: string;
  participants: EventParticipant[];
}

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

// Sport icons and colors
const sportIcons: Record<string, string> = {
  'PADEL': '🎾',
  'TENNIS': '🎾',
  'FOOTBALL': '⚽',
  'BASKETBALL': '🏀',
  'VOLLEYBALL': '🏐',
  'HOCKEY': '🏑',
  'BADMINTON': '🏸',
  'CYCLING': '🚴',
  'RUNNING': '🏃',
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

export default function EventDetailPage({ 
  params 
}: { 
  params: { eventId: string } | Promise<{ eventId: string }> 
}) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const { eventId } = unwrappedParams;
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

    fetchEvent();
  }, [eventId]);

  // Handle successful cancel event
  const handleSuccessfulCancel = async () => {
    // Refetch the event data to get the updated status
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch updated event: ${response.statusText}`);
      }
      
      const eventData = await response.json();
      setEvent(eventData);
    } catch (err) {
      console.error('Error refetching event after cancellation:', err);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white p-8">Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Event Details</h1>
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

  const isCreator = user?.id === event.createdBy;
  const hasJoined = event.participants?.some(p => p.userId === user?.id);
  const isFull = event.currentPlayers >= event.maxPlayers;
  const isPast = new Date(event.date) < new Date();
  const canJoin = isAuthenticated && !hasJoined && !isFull && !isPast && isEventActive(event.status);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            ← Back to Events
          </Link>
          {isCreator && isEventActive(event.status) && (
            <CancelEventButton eventId={event.eventId} onSuccess={handleSuccessfulCancel} />
          )}
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {sportIcons[event.sport] || '🏆'} {event.sport}
                </Badge>
                <CardTitle className="text-3xl">{event.location}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-1" /> 
                  {formatDate(event.date)}
                </CardDescription>
              </div>
              <Badge className={
                isEventActive(event.status) ? 'bg-green-100 text-green-800' : 
                isEventCancelled(event.status) ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'
              }>
                {event.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {event.currentPlayers}/{event.maxPlayers} players 
                  {isFull && <span className="text-orange-600 ml-1">(Full)</span>}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <span>Skill level: {Array(event.skillLevel).fill('★').join('')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-3">Extra Info</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {event.whatsappGroupLink && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium mb-2">WhatsApp Group</h4>
                  <a 
                    href={event.whatsappGroupLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 flex items-center hover:text-green-800"
                  >
                    <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} className="mr-2" />
                    Join WhatsApp Group
                  </a>
                </div>
              )}
              {event.bookingUrl && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium mb-2">Court Booking</h4>
                  <a 
                    href={event.bookingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 flex items-center hover:text-blue-800"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    View Booking Details
                  </a>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-3">Participants ({event.participants.length})</h3>
            <div className="border border-gray-200 rounded-lg divide-y">
              {event.participants.map((participant) => (
                <div key={participant.userId} className="p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(participant.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {participant.userId === event.createdBy && (
                    <Badge variant="outline">Creator</Badge>
                  )}
                </div>
              ))}
              {event.participants.length === 0 && (
                <div className="p-3 text-gray-500 text-center">
                  No one has joined this event yet
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mb-2">Login to join this event</p>
              )}
              {isAuthenticated && hasJoined && (
                <Badge variant="outline" className="mr-2">You've joined this event</Badge>
              )}
              {isPast && (
                <Badge variant="outline" className="bg-gray-100">This event has passed</Badge>
              )}
            </div>
            <div className="flex gap-3">
              {canJoin && (
                <Link href={`/events/${event.eventId}/join`}>
                  <Button>Join Event</Button>
                </Link>
              )}
              {!canJoin && !isAuthenticated && (
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 