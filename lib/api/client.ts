// API client for the Social Sports backend
import { Event, EventRequest, JoinEventRequest } from './types';

// Configure the base URL for different environments
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // For DELETE requests or others that might not return content
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Event-related API methods
 */
export const eventsApi = {
  // Get all events
  getEvents: () => apiRequest<Event[]>('/events'),
  
  // Get a specific event by ID
  getEvent: (eventId: string) => apiRequest<Event>(`/events/${eventId}`),
  
  // Create a new event
  createEvent: (eventData: EventRequest) => apiRequest<Event>('/events', 'POST', eventData),
  
  // Join an event
  joinEvent: (eventId: string, joinRequest: JoinEventRequest) => 
    apiRequest<Event>(`/events/${eventId}/join`, 'POST', joinRequest),
  
  // Leave an event
  leaveEvent: (eventId: string, userId: string) => 
    apiRequest<Event>(`/events/${eventId}/leave/${userId}`, 'DELETE'),
  
  // Cancel an event (creator only)
  cancelEvent: (eventId: string) => apiRequest<void>(`/events/${eventId}`, 'DELETE'),
};

/**
 * User-related API methods
 */
export const usersApi = {
  // Register a new web user
  registerUser: (userData: any) => apiRequest<any>('/users/register', 'POST', userData),
  
  // Get user profile
  getUserProfile: (userId: string) => apiRequest<any>(`/users/${userId}`),
  
  // Update user profile
  updateUserProfile: (userId: string, userData: any) => 
    apiRequest<any>(`/users/${userId}`, 'PUT', userData),
};

/**
 * WhatsApp integration methods
 */
export const whatsappApi = {
  // Generate a QR code for WhatsApp integration
  getWhatsAppQrCode: () => apiRequest<{qrCodeUrl: string}>('/whatsapp/qrcode'),
  
  // Check status of WhatsApp connection
  getWhatsAppStatus: () => apiRequest<{connected: boolean, phoneNumber?: string}>('/whatsapp/status'),
  
  // Link web account with WhatsApp
  linkWhatsApp: (userId: string, phoneNumber: string) => 
    apiRequest<{success: boolean}>('/whatsapp/link', 'POST', { userId, phoneNumber }),
};

export default {
  events: eventsApi,
  users: usersApi,
  whatsapp: whatsappApi,
}; 