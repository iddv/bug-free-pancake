'use client';

import { useCallback, useEffect, useState } from 'react';
import { eventsApi, usersApi, whatsappApi } from './client';
import { Event, UserProfile } from './types';

/**
 * Hook for fetching all events
 */
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

/**
 * Hook for fetching a single event
 */
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      const data = await eventsApi.getEvent(eventId);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch event ${eventId}`));
      console.error(`Error fetching event ${eventId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch: fetchEvent };
}

/**
 * Hook for joining an event
 */
export function useJoinEvent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const joinEvent = useCallback(async (eventId: string, name: string, phone?: string) => {
    try {
      setLoading(true);
      setSuccess(false);
      await eventsApi.joinEvent(eventId, { userName: name, userPhone: phone });
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to join event'));
      setSuccess(false);
      console.error('Error joining event:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { joinEvent, loading, error, success };
}

/**
 * Hook for creating an event
 */
export function useCreateEvent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);

  const createEvent = useCallback(async (eventData: any) => {
    try {
      setLoading(true);
      const data = await eventsApi.createEvent(eventData);
      setCreatedEvent(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create event'));
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createEvent, loading, error, createdEvent };
}

/**
 * Hook for WhatsApp QR code
 */
export function useWhatsAppQrCode() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQrCode = useCallback(async () => {
    try {
      setLoading(true);
      const data = await whatsappApi.getWhatsAppQrCode();
      setQrCode(data.qrCodeUrl);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch WhatsApp QR code'));
      console.error('Error fetching QR code:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQrCode();
  }, [fetchQrCode]);

  return { qrCode, loading, error, refresh: fetchQrCode };
}

/**
 * Hook for user profile
 */
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await usersApi.getUserProfile(userId);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
} 