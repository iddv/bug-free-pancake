'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEvents } from '@/lib/api/hooks';
import { SportType } from '@/lib/api/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

// Sport icons and colors
const sportIcons: Record<SportType, string> = {
  'PADEL': '🎾',
  'TENNIS': '🎾',
  'FOOTBALL': '⚽',
  'BASKETBALL': '🏀',
  'VOLLEYBALL': '🏐',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Events</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>Error loading events: {error.message}</p>
            <p className="text-sm mt-2">
              Note: This frontend is now configured to communicate with the Social Sports API, but the backend might not be running or accessible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
          <Link href="/events/create">
            <Button>Create Event</Button>
          </Link>
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
        ) : events && events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.eventId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      {sportIcons[event.sport]} {event.sport}
                    </Badge>
                    <Badge className={event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                      event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
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
                  {event.whatsappGroupLink && (
                    <div className="mt-3">
                      <a 
                        href={event.whatsappGroupLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 text-sm flex items-center"
                      >
                        <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16} className="mr-1" />
                        WhatsApp Group
                      </a>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/events/${event.eventId}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                  {event.status === 'CONFIRMED' && event.currentPlayers < event.maxPlayers && (
                    <Link href={`/events/${event.eventId}/join`}>
                      <Button>
                        <CheckCircle className="mr-1 h-4 w-4" /> Join
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-700 mb-4">No events found</h3>
            <p className="text-gray-500 mb-6">There are no upcoming events currently scheduled.</p>
            <Link href="/events/create">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        )}
        
        {/* Environment indicator that shows info about the backend connection */}
        <div className="mt-16 py-4 px-6 bg-gray-50 rounded-lg text-sm text-gray-500">
          <h3 className="font-medium mb-2">Backend Connection Status</h3>
          <p>The frontend is now configured to communicate with the Social Sports API at:</p>
          <code className="block bg-gray-100 p-2 rounded mt-2 mb-4">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}</code>
          <p>
            This page is making live API calls to display events from the backend. 
            If you're seeing placeholder data or an error message, make sure your Spring Boot application is running.
          </p>
        </div>
      </div>
    </div>
  );
} 