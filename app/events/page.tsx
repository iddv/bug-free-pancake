'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { SportType } from '@/lib/api/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Calendar, Users, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { UserIcon, UsersIcon, MapPinIcon, CalendarIcon, SearchIcon } from 'lucide-react';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

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

// Event type definition
type Event = {
  eventId: string;
  sport: string;
  location: string;
  date: string;
  currentPlayers: number;
  maxPlayers: number;
  skillLevel: number; // Changed from enum to number
  status: string; // Changed from enum to string to be more flexible
  createdBy: string;
  whatsappGroupLink?: string;
  participantPhoneNumbers?: string[]; // Added to track event participants
};

export default function EventsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [availableSports, setAvailableSports] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch events when mounted
    if (mounted) {
      fetchEvents();
    }
  }, [mounted]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // In case API is not available, show mock data for demo purposes
      let data: Event[] = [];
      
      try {
        const response = await fetch(`${API_BASE_URL}/events`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
          },
        });

        if (!response.ok) {
          // If API fails, use demo data instead
          console.warn(`API returned status: ${response.status}. Using demo data instead.`);
          data = getDemoEvents();
        } else {
          data = await response.json();
        }
      } catch (err) {
        console.warn("Error fetching from API. Using demo data instead:", err);
        data = getDemoEvents();
      }
      
      setEvents(data);
      setFilteredEvents(data);
      
      // Extract unique sports for filter
      const sports = [...new Set(data.map((event: any) => event.sport))];
      setAvailableSports(sports as string[]);
    } catch (error) {
      console.error('Error processing events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate demo data when API is unavailable
  const getDemoEvents = (): Event[] => {
    return [
      {
        eventId: "demo-1",
        sport: "PADEL",
        location: "Padel City Amsterdam",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        currentPlayers: 2,
        maxPlayers: 4,
        skillLevel: 3,
        status: "ACTIVE",
        createdBy: "demo-user",
        whatsappGroupLink: "https://chat.whatsapp.com/example1"
      },
      {
        eventId: "demo-2",
        sport: "TENNIS",
        location: "Tennis Park West",
        date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        currentPlayers: 1,
        maxPlayers: 4,
        skillLevel: 2,
        status: "ACTIVE",
        createdBy: "demo-user"
      },
      {
        eventId: "demo-3",
        sport: "FOOTBALL",
        location: "Sportpark Sloten",
        date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        currentPlayers: 8,
        maxPlayers: 10,
        skillLevel: 4,
        status: "ACTIVE",
        createdBy: "demo-user"
      }
    ];
  };

  // Apply filters when selectedSport, dateFilter, or searchTerm changes
  useEffect(() => {
    let filtered = [...events];
    
    if (selectedSport) {
      filtered = filtered.filter(event => event.sport === selectedSport);
    }
    
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (dateFilter === 'today') {
          return eventDate.getDate() === today.getDate() && 
                 eventDate.getMonth() === today.getMonth() && 
                 eventDate.getFullYear() === today.getFullYear();
        } else if (dateFilter === 'tomorrow') {
          return eventDate.getDate() === tomorrow.getDate() && 
                 eventDate.getMonth() === tomorrow.getMonth() && 
                 eventDate.getFullYear() === tomorrow.getFullYear();
        } else if (dateFilter === 'thisWeek') {
          return eventDate >= today && eventDate < nextWeek;
        }
        return true;
      });
    }
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(term) || 
        event.sport.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, selectedSport, dateFilter, searchTerm]);

  if (!mounted) {
    return <div className="min-h-screen bg-white p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Events</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>Error loading events: {error}</p>
            <p className="text-sm mt-2">
              Please try again later.
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
          <div>
            <h1 className="text-3xl font-bold">Explore Events</h1>
            <p className="text-gray-600 mt-1">Discover and join sports events in your area</p>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/events/my-events">
                  <Button variant="outline" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> My Events
                  </Button>
                </Link>
                <Link href="/events/create">
                  <Button>Create Event</Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button>Login to Create Events</Button>
              </Link>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <p className="text-blue-700 font-medium mb-1">Join our community!</p>
              <p className="text-sm text-blue-600">Log in or create an account to join and create events.</p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex mb-6 overflow-x-auto">
            <div className="flex space-x-2 border-b border-gray-200 w-full pb-2">
              <Link href="/events">
                <Button variant="ghost" className="rounded-none border-b-2 border-primary">
                  All Events
                </Button>
              </Link>
              <Link href="/events/my-events">
                <Button variant="ghost" className="rounded-none border-b-2 border-transparent">
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
        )}

        {/* Filters */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedSport === null ? 'default' : 'outline'}
                  className="cursor-pointer" 
                  onClick={() => setSelectedSport(null)}
                >
                  All
                </Badge>
                {availableSports.map(sport => (
                  <Badge 
                    key={sport}
                    variant={selectedSport === sport ? 'default' : 'outline'}
                    className="cursor-pointer" 
                    onClick={() => setSelectedSport(sport)}
                  >
                    {sportIcons[sport] || '🏆'} {sport}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="ml-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="flex gap-2">
                <Badge 
                  variant={dateFilter === null ? 'default' : 'outline'}
                  className="cursor-pointer" 
                  onClick={() => setDateFilter(null)}
                >
                  All Dates
                </Badge>
                <Badge 
                  variant={dateFilter === 'today' ? 'default' : 'outline'}
                  className="cursor-pointer" 
                  onClick={() => setDateFilter('today')}
                >
                  Today
                </Badge>
                <Badge 
                  variant={dateFilter === 'tomorrow' ? 'default' : 'outline'}
                  className="cursor-pointer" 
                  onClick={() => setDateFilter('tomorrow')}
                >
                  Tomorrow
                </Badge>
                <Badge 
                  variant={dateFilter === 'thisWeek' ? 'default' : 'outline'}
                  className="cursor-pointer" 
                  onClick={() => setDateFilter('thisWeek')}
                >
                  This Week
                </Badge>
              </div>
            </div>
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
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.eventId || `event-${Math.random()}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      {sportIcons[event.sport] || '🏆'} {event.sport || 'Unknown'}
                    </Badge>
                    <Badge className={
                      event.status === 'CONFIRMED' || event.status === 'Open' ? 'bg-green-100 text-green-800' : 
                      event.status === 'CANCELLED' || event.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                      event.status === 'Full' ? 'bg-orange-100 text-orange-800' : 
                      'bg-blue-100 text-blue-800'
                    }>
                      {event.status || 'Unknown'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{event.location || 'Unknown location'}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" /> 
                    {formatDate(event.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.currentPlayers || 0}/{event.maxPlayers || 0} players</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Skill level: {Array(event.skillLevel || 0).fill('★').join('')}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.location || 'Unknown location'}</span>
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
                  {(event.status === 'CONFIRMED' || event.status === 'Open') && 
                   event.currentPlayers < (event.maxPlayers || 0) && (
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
            <p className="text-gray-500 mb-6">
              {selectedSport || dateFilter 
                ? "No events match your current filters. Try adjusting them or creating a new event."
                : "There are no upcoming events currently scheduled."}
            </p>
            <Link href="/events/create">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 