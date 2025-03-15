'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useJoinEvent } from '@/lib/api/hooks';
import { Event } from '@/lib/api/types';

interface JoinEventFormProps {
  event: Event;
  onSuccess?: () => void;
}

export function JoinEventForm({ event, onSuccess }: JoinEventFormProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { joinEvent, loading, error, success } = useJoinEvent();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await joinEvent(event.eventId, name, phoneNumber || undefined);
      
      // Reset form
      setName('');
      setPhoneNumber('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error joining event:', err);
    }
  };

  // Handle button click
  const handleButtonClick = () => {
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.requestSubmit();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join Event</CardTitle>
        <CardDescription>
          Enter your details to join "{event.location}" on {new Date(event.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            Failed to join event: {error.message}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            You've successfully joined the event!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Your Phone Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              placeholder="Optional"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your phone number is only used for event-related communications.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="button" 
          onClick={handleButtonClick}
          disabled={loading || !name.trim() || event.status !== 'CONFIRMED' || event.currentPlayers >= event.maxPlayers}
          className="w-full"
        >
          {loading ? 'Joining...' : 'Join Event'}
        </Button>
      </CardFooter>
    </Card>
  );
} 