'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SportType, SkillLevel } from '@/lib/api/types';
import { useCreateEvent } from '@/lib/api/hooks';

// Define the form data structure
interface EventFormData {
  creatorPhoneNumber: string;
  creatorName: string;
  sportType: SportType | '';
  location: string;
  eventTime: string;
  participantLimit: number;
  skillLevel: SkillLevel;
  bookingLink: string;
}

export function EventCreationForm() {
  // State for form data and loading states
  const [formData, setFormData] = useState<EventFormData>({
    creatorPhoneNumber: '',
    creatorName: '',
    sportType: '',
    location: '',
    eventTime: '',
    participantLimit: 4,
    skillLevel: 3,
    bookingLink: ''
  });
  
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { createEvent, loading: creating, error: createError } = useCreateEvent();

  // Fetch sport types on component mount
  useEffect(() => {
    const fetchSportTypes = async () => {
      try {
        const response = await fetch('/api/events/sport-types');
        
        if (!response.ok) {
          throw new Error('Failed to fetch sport types');
        }
        
        const data = await response.json();
        setSportTypes(data);
      } catch (err) {
        console.error('Error fetching sport types:', err);
        // If API fails, use default sport types from the types.ts file
        setSportTypes(['PADEL', 'TENNIS', 'FOOTBALL', 'BASKETBALL', 'VOLLEYBALL']);
      }
    };
    
    fetchSportTypes();
  }, []);

  // Handle form input changes
  const handleChange = (
    field: keyof EventFormData,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.sportType) {
      setError('Please select a sport type');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare the event data in the format expected by the API
      const eventData = {
        sport: formData.sportType as SportType,
        location: formData.location,
        date: formData.eventTime,
        maxPlayers: formData.participantLimit,
        skillLevel: formData.skillLevel,
        bookingUrl: formData.bookingLink || undefined,
        creatorName: formData.creatorName,
        creatorPhone: formData.creatorPhoneNumber || undefined
      };
      
      await createEvent(eventData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        creatorPhoneNumber: '',
        creatorName: '',
        sportType: '',
        location: '',
        eventTime: '',
        participantLimit: 4,
        skillLevel: 3,
        bookingLink: ''
      });
      
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
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
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>Fill out the form to create a new sports event.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            Event created successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creatorName">Your Name</Label>
              <Input
                id="creatorName"
                value={formData.creatorName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('creatorName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creatorPhoneNumber">Your Phone Number</Label>
              <Input
                id="creatorPhoneNumber"
                value={formData.creatorPhoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('creatorPhoneNumber', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sportType">Sport</Label>
            <Select 
              value={formData.sportType} 
              onValueChange={(value: string) => handleChange('sportType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                {sportTypes.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
              placeholder="Where will the event take place?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventTime">Date & Time</Label>
            <Input
              id="eventTime"
              type="datetime-local"
              value={formData.eventTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('eventTime', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participantLimit">Number of Players</Label>
              <Input
                id="participantLimit"
                type="number"
                min="2"
                max="100"
                value={formData.participantLimit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('participantLimit', parseInt(e.target.value, 10))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level (1-5)</Label>
              <Select 
                value={formData.skillLevel.toString()} 
                onValueChange={(value: string) => handleChange('skillLevel', parseInt(value, 10) as SkillLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Beginner</SelectItem>
                  <SelectItem value="2">2 - Novice</SelectItem>
                  <SelectItem value="3">3 - Intermediate</SelectItem>
                  <SelectItem value="4">4 - Advanced</SelectItem>
                  <SelectItem value="5">5 - Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bookingLink">Booking Link (Optional)</Label>
            <Input
              id="bookingLink"
              value={formData.bookingLink}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('bookingLink', e.target.value)}
              placeholder="External booking URL if applicable"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="button" 
          onClick={handleButtonClick}
          disabled={loading || creating}
          className="w-full"
        >
          {loading || creating ? 'Creating Event...' : 'Create Event'}
        </Button>
      </CardFooter>
    </Card>
  );
} 