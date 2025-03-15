'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, MapPin, Calendar, Users } from 'lucide-react';
import { getUserEvents } from '@/lib/api/events';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

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

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return 'Date not specified';
  }
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date format';
  }
};

type Event = {
  eventId: string;
  sport: string;
  location: string;
  date: string;
  currentPlayers: number;
  maxPlayers: number;
  skillLevel: number;
  status: string;
  createdBy: string;
  whatsappGroupLink?: string;
  participantPhoneNumbers?: string[];
};

export default function MyEventsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not authenticated and auth is done loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/events/my-events');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isAuthenticated || !user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use our new API service function
        const eventsData = await getUserEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch your events. Using demo data instead.');
        // Use mock data when there's an error
        setEvents(getMockEvents());
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMyEvents();
    }
  }, [isAuthenticated, user]);

  // Function to get mock events for testing/demo
  const getMockEvents = (): Event[] => {
    // Get the current user ID
    const currentUserId = user?.id || 'unknown-user';
    
    // Common events pool
    const allMockEvents = [
      {
        eventId: "my-event-1",
        sport: "PADEL",
        location: "Padel City Amsterdam",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        currentPlayers: 3,
        maxPlayers: 4,
        skillLevel: 3,
        status: "CONFIRMED",
        createdBy: currentUserId, // Current user created this event
        whatsappGroupLink: "https://chat.whatsapp.com/example1",
        participantPhoneNumbers: [currentUserId, "other-user-1", "other-user-2"] // User is a participant
      },
      {
        eventId: "my-event-2",
        sport: "TENNIS",
        location: "Tennis Park East",
        date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
        currentPlayers: 2,
        maxPlayers: 4,
        skillLevel: 4,
        status: "OPEN",
        createdBy: "other-user-1", // Created by someone else
        participantPhoneNumbers: [currentUserId, "other-user-1"] // But user joined
      },
      {
        eventId: "my-event-3",
        sport: "FOOTBALL",
        location: "Soccer Field Central",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday (past event)
        currentPlayers: 11,
        maxPlayers: 11,
        skillLevel: 2,
        status: "COMPLETED",
        createdBy: "other-user-2",
        participantPhoneNumbers: [currentUserId, "other-user-1", "other-user-2", "other-user-3"] // User is part of this completed event
      },
      {
        eventId: "not-my-event-1",
        sport: "BASKETBALL",
        location: "Downtown Courts",
        date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        currentPlayers: 6,
        maxPlayers: 10,
        skillLevel: 3,
        status: "OPEN",
        createdBy: "other-user-3",
        participantPhoneNumbers: ["other-user-1", "other-user-2", "other-user-3"] // User is NOT in this event
      }
    ];
    
    // Filter events to only include those where the current user is a participant
    return allMockEvents.filter(event => 
      event.participantPhoneNumbers && 
      event.participantPhoneNumbers.includes(currentUserId)
    );
  };

  const refetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const eventsData = await getUserEvents();
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to refresh events. Using demo data instead.');
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  };

  // Determine grouped events (past and upcoming)
  const currentDate = new Date();
  const upcomingEvents = events.filter(
    event => new Date(event.date) >= currentDate && !isEventCancelled(event.status)
  );
  const pastEvents = events.filter(
    event => new Date(event.date) < currentDate || isEventCancelled(event.status)
  );

  // Skip rendering if not authenticated and still loading
  if (isLoading && !isAuthenticated) {
    return <div className="min-h-screen bg-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-gray-600 mt-1">Manage your events and participation</p>
          </div>
          <div className="flex gap-3">
            <Link href="/events/create">
              <Button>Create Event</Button>
            </Link>
          </div>
        </div>

        <div className="flex mb-6 overflow-x-auto">
          <div className="flex space-x-2 border-b border-gray-200 w-full pb-2">
            <Link href="/events">
              <Button variant="ghost" className="rounded-none border-b-2 border-transparent">
                All Events
              </Button>
            </Link>
            <Link href="/events/my-events">
              <Button variant="ghost" className="rounded-none border-b-2 border-primary">
                My Events
              </Button>
            </Link>
            <Link href="/events/create">
              <Button variant="ghost" className="rounded-none border-b-2 border-transparent">
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-gray-100" />
                <CardContent className="py-4">
                  <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
                  <div className="h-4 bg-gray-100 rounded mb-3 w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="h-8 bg-gray-100 rounded w-1/4" />
                  <div className="h-8 bg-gray-100 rounded w-1/4" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="flex justify-center items-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h3 className="text-lg font-medium">Error loading your events</h3>
            </div>
            <p className="mb-4">{error}</p>
            <Button onClick={refetchEvents}>Try Again</Button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-lg mb-8">
            <h3 className="text-xl font-medium text-gray-700 mb-4">You haven't joined any events yet</h3>
            <p className="text-gray-500 mb-6">
              Browse available events or create your own to get started
            </p>
            <Link href="/events">
              <Button className="mr-4">Browse Events</Button>
            </Link>
            <Link href="/events/create">
              <Button variant="outline">Create Event</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <Card key={event.eventId} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="mb-2">
                            {event.sport}
                          </Badge>
                          <Badge className={
                            isEventActive(event.status) ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {event.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{event.location}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" /> 
                          {formatDate(event.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{event.currentPlayers}/{event.maxPlayers} players</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>Skill level: {Array(event.skillLevel).fill('★').join('')}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link href={`/events/${event.eventId}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                        {event.createdBy === user?.id && (
                          <Badge variant="secondary">Created by You</Badge>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Past Events</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <Card key={event.eventId} className="overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="mb-2">
                            {event.sport}
                          </Badge>
                          <Badge className={
                            isEventCancelled(event.status) ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }>
                            {isEventCancelled(event.status) ? 'Cancelled' : 'Completed'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{event.location}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" /> 
                          {formatDate(event.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{event.currentPlayers}/{event.maxPlayers} players</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>Skill level: {Array(event.skillLevel).fill('★').join('')}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link href={`/events/${event.eventId}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                        {event.createdBy === user?.id && (
                          <Badge variant="secondary">Created by You</Badge>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 