'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvent } from '@/lib/api/hooks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle, MapPin, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const { event, loading, error } = useEvent(eventId);
  const router = useRouter();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
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
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="mb-2">
                    {event.sport}
                  </Badge>
                  <Badge className={event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                            event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                    {event.status}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{event.location}</CardTitle>
                <div className="text-gray-600 mt-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Players</h3>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.currentPlayers}/{event.maxPlayers} players</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Skill Level</h3>
                  <div className="flex items-center">
                    <span className="text-lg">{Array(event.skillLevel).fill('★').join('')}{Array(5 - event.skillLevel).fill('☆').join('')}</span>
                    <span className="ml-2 text-sm text-gray-500">({event.skillLevel} out of 5)</span>
                  </div>
                </div>
                
                {event.bookingUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">External Booking</h3>
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
                
                {event.whatsappGroupLink && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">WhatsApp Group</h3>
                    <a 
                      href={event.whatsappGroupLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600"
                    >
                      <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} className="mr-2" />
                      Join WhatsApp Group
                    </a>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Participants</h3>
                  {event.participants && event.participants.length > 0 ? (
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-md overflow-hidden">
                      {event.participants.map((participant, index) => (
                        <li key={index} className="flex items-center justify-between px-4 py-3">
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            {participant.status === 'CONFIRMED' && (
                              <p className="text-xs text-gray-500">Joined: {new Date(participant.joinedAt).toLocaleDateString()}</p>
                            )}
                          </div>
                          <Badge className={
                            participant.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                            participant.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }>
                            {participant.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No participants yet</p>
                  )}
                </div>
                
                {event.status === 'CANCELLED' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-medium">This event has been cancelled.</p>
                  </div>
                )}
                
                {event.currentPlayers >= event.maxPlayers && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    <p className="font-medium">This event is fully booked.</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-gray-100 pt-6">
                <Button variant="outline" onClick={() => router.push('/events')}>
                  Back to Events
                </Button>
                
                {event.status === 'CONFIRMED' && event.currentPlayers < event.maxPlayers && (
                  <Button onClick={() => router.push(`/events/${event.eventId}/join`)}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Join Event
                  </Button>
                )}
              </CardFooter>
            </Card>
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