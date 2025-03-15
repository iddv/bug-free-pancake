'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, set } from 'date-fns';
import { Calendar as CalendarIcon, AlertCircle, CheckCircle } from 'lucide-react';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = 'http://localhost:8000'; // Change this to match your actual backend URL

const formSchema = z.object({
  sport: z.string().min(1, { message: 'Please select a sport' }),
  location: z.string().min(5, { message: 'Location must be at least 5 characters' }),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string({ required_error: 'Please select a time' }),
  maxPlayers: z.number().min(2, { message: 'At least 2 players are required' }).max(50, { message: 'Maximum 50 players allowed' }),
  skillLevel: z.number().min(1, { message: 'Please select a skill level' }).max(5, { message: 'Maximum skill level is 5' }),
  whatsappGroup: z.boolean().default(false),
  whatsappGroupLink: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  bookingUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
}).refine(data => {
  if (data.whatsappGroup && !data.whatsappGroupLink) {
    return false;
  }
  return true;
}, {
  message: 'WhatsApp group link is required when WhatsApp group is enabled',
  path: ['whatsappGroupLink'],
});

export default function CreateEventPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/events/create');
    }
  }, [isAuthenticated, isLoading, router]);

  // Initialize form with schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sport: '',
      location: '',
      maxPlayers: 10,
      skillLevel: 3,
      whatsappGroup: false,
      whatsappGroupLink: '',
      bookingUrl: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to create events');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format date and time for API
      const timeComponents = values.time.split(':').map(Number);
      const eventDate = set(values.date, {
        hours: timeComponents[0],
        minutes: timeComponents[1],
        seconds: 0,
        milliseconds: 0,
      });

      const eventData = {
        sport: values.sport,
        location: values.location,
        date: eventDate.toISOString(),
        maxPlayers: values.maxPlayers,
        skillLevel: values.skillLevel,
        whatsappGroupLink: values.whatsappGroup ? values.whatsappGroupLink : null,
        bookingUrl: values.bookingUrl || null,
        createdBy: user.id,
      };

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      const responseData = await response.json();
      setSuccess(true);
      
      // Redirect to event page after short delay
      setTimeout(() => {
        router.push(`/events/${responseData.eventId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Error creating event:', err);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <p>Event created successfully! Redirecting...</p>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FOOTBALL">Football ⚽</SelectItem>
                          <SelectItem value="BASKETBALL">Basketball 🏀</SelectItem>
                          <SelectItem value="TENNIS">Tennis 🎾</SelectItem>
                          <SelectItem value="PADEL">Padel 🎾</SelectItem>
                          <SelectItem value="VOLLEYBALL">Volleyball 🏐</SelectItem>
                          <SelectItem value="BADMINTON">Badminton 🏸</SelectItem>
                          <SelectItem value="HOCKEY">Hockey 🏑</SelectItem>
                          <SelectItem value="CYCLING">Cycling 🚴</SelectItem>
                          <SelectItem value="RUNNING">Running 🏃</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location name or address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <TimePicker 
                          setTime={field.onChange}
                          time={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="maxPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Players: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={2}
                          max={50}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the maximum number of players for this event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level: {field.value} {Array(field.value).fill('★').join('')}</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        1 = Beginner, 5 = Advanced
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="whatsappGroup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">WhatsApp Group</FormLabel>
                      <FormDescription>
                        Create a WhatsApp group for event participants
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('whatsappGroup') && (
                <FormField
                  control={form.control}
                  name="whatsappGroupLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Group Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://chat.whatsapp.com/..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Paste the invitation link to your WhatsApp group
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="bookingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://booking-site.com/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      If you've made an external booking, you can add the link here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push('/events')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || success}>
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 