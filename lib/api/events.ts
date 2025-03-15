// API utilities for event operations
import { Event } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Helper function to get auth headers
const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

/**
 * Fetch events for the current user (events they're participating in)
 * @returns List of events the user is participating in
 */
export async function getUserEvents(): Promise<Event[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add auth header if token exists
  const authHeader = getAuthHeader();
  if ('Authorization' in authHeader && authHeader.Authorization) {
    headers['Authorization'] = authHeader.Authorization;
  }
  
  try {
    // Primary endpoint confirmed by backend team
    const response = await fetch(`${API_BASE_URL}/events/my-events`, { 
      method: 'GET',
      headers 
    });
    
    if (response.ok) {
      return response.json();
    }
    
    // Fallback endpoints if the primary one fails
    const fallbackEndpoints = [
      `${API_BASE_URL}/events/user`,
      `${API_BASE_URL}/users/me/events`
    ];
    
    for (const endpoint of fallbackEndpoints) {
      try {
        console.log(`Primary endpoint failed, trying fallback: ${endpoint}`);
        const fallbackResponse = await fetch(endpoint, { 
          method: 'GET',
          headers 
        });
        
        if (fallbackResponse.ok) {
          return fallbackResponse.json();
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
      }
    }
    
    throw new Error(`Failed to fetch user events: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Cancel an event by its ID
 * @param eventId - The ID of the event to cancel
 * @returns The cancelled event data
 */
export async function cancelEvent(eventId: number): Promise<Event> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add auth header if token exists
  const authHeader = getAuthHeader();
  if ('Authorization' in authHeader && authHeader.Authorization) {
    headers['Authorization'] = authHeader.Authorization;
  }
  
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/cancel`, {
    method: 'PUT',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel event: ${response.statusText}`);
  }

  return response.json();
} 