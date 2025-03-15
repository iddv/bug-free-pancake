'use client';

import React from 'react';
import Link from 'next/link';
import { useEvent } from '@/lib/api/hooks';
import { JoinEventForm } from '@/components/JoinEventForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JoinEventPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const { event, loading, error, refetch } = useEvent(eventId);
  const router = useRouter();

  // Handle successful join
  const handleJoinSuccess = () => {
    // Wait a moment for the API to update, then refetch event data
    setTimeout(() => {
      refetch();
    }, 500);
  };

  // Format date for display
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold mt-4">Join Event</h1>
        </div>

        {loading ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p>Loading event details...</p>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <p>Error loading event: {error.message}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push('/events')}
                  >
                    Return to Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : event ? (
          <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="mb-2">
                      {event.sport}
                    </Badge>
                    <Badge className={event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                              event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-4">{event.location}</h2>
                  
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{event.currentPlayers}/{event.maxPlayers} players</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span>Skill level: {Array(event.skillLevel).fill('★').join('')}</span>
                    </div>
                  </div>
                  
                  {event.bookingUrl && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-2">External booking link:</p>
                      <a 
                        href={event.bookingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {event.bookingUrl}
                      </a>
                    </div>
                  )}
                  
                  {event.currentPlayers >= event.maxPlayers && (
                    <div className="mt-6 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                      This event is fully booked.
                    </div>
                  )}
                  
                  {event.status === 'CANCELLED' && (
                    <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                      This event has been cancelled.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <JoinEventForm event={event} onSuccess={handleJoinSuccess} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p>Event not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push('/events')}
            >
              Return to Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 