'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { SportType } from '@/lib/api/types';
import { useCreateEvent } from '@/lib/api/hooks';

// Sample API response structure for event parsing
interface ParsedEvent {
  sportType: SportType;
  location: string;
  time: string; // ISO date string
  playerCount: number;
}

export function NaturalLanguageEventForm() {
  const [message, setMessage] = useState('');
  const [parsedEvent, setParsedEvent] = useState<ParsedEvent | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createEvent, loading: creating, error: createError, createdEvent } = useCreateEvent();

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

  // Parse event from natural language
  async function parseEventRequest() {
    if (!message.trim()) {
      setError('Please enter a description of your event');
      return;
    }

    try {
      setParsing(true);
      setError(null);
      
      const response = await fetch('/api/events/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse event');
      }
      
      const data = await response.json();
      setParsedEvent(data);
    } catch (err) {
      console.error('Error parsing event:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse event details');
    } finally {
      setParsing(false);
    }
  }

  // Create event from parsed data
  async function handleCreateEvent() {
    if (!parsedEvent) return;
    
    try {
      // Get user info - in a real app, this would come from authentication
      const creatorName = prompt('Your name:') || 'Anonymous';
      const creatorPhone = prompt('Your phone number (optional):') || undefined;
      
      const eventData = {
        sport: parsedEvent.sportType,
        location: parsedEvent.location,
        date: parsedEvent.time,
        maxPlayers: parsedEvent.playerCount + 1, // +1 to include the creator
        skillLevel: 3, // Default skill level
        creatorName,
        creatorPhone
      };
      
      await createEvent(eventData);
      
      // Reset form after successful creation
      setMessage('');
      setParsedEvent(null);
      
      // Show success message or redirect
      alert('Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Event in Natural Language</CardTitle>
        <CardDescription>
          Describe your event in plain language and we'll extract the details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Describe your event (e.g., I want to play tennis tomorrow at 3pm at Central Courts with 3 other people)"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          rows={4}
          className="mb-4"
        />
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {parsedEvent && (
          <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Parsed Event Details:</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {parsedEvent.sportType}
                </Badge>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{parsedEvent.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(parsedEvent.time)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2" />
                <span>{parsedEvent.playerCount + 1} players (including you)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={parseEventRequest} 
          disabled={parsing || !message.trim()}
        >
          {parsing ? 'Parsing...' : 'Parse Event'}
        </Button>
        
        {parsedEvent && (
          <Button 
            onClick={handleCreateEvent}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create This Event'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 