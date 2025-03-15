// API client for the Social Sports backend
import { Event, EventRequest, JoinEventRequest } from './types';

// Configure the base URL for different environments
// Ensure the URL ends with /api but doesn't duplicate it
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

// Get auth token from localStorage (client-side only)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: Record<string, any>,
  requiresAuth: boolean = true
): Promise<T> {
  // Use the environment variable for the API base URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (requiresAuth) {
      // If we require auth but don't have a token, throw an error
      throw new Error('Authentication required. Please login again.');
    }
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Clear token if it's invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        throw new Error('Authentication required. Please login again.');
      }
      
      // Special handling for 403 and 404 errors in WhatsApp endpoints
      if ((response.status === 403 || response.status === 404) && endpoint.includes('/whatsapp')) {
        console.warn(`WhatsApp endpoint ${endpoint} returned ${response.status} - Service unavailable or not configured`);
        // For WhatsApp QR code, return an empty response instead of throwing
        if (endpoint === '/whatsapp/qrcode') {
          return { qrCodeUrl: '' } as unknown as T;
        }
      }
      
      // Handle other HTTP errors
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
  
  // Get all events for the current user
  getMyEvents: () => apiRequest<Event[]>('/events/my-events'),
  
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
  cancelEvent: (eventId: string, reason?: string) => 
    apiRequest<Event>(`/events/${eventId}/cancel`, 'POST', { reason }),
    
  // Parse natural language event description
  parseEventDescription: (message: string) => 
    apiRequest<any>('/events/parse', 'POST', { message }, false),
    
  // Get available sport types
  getSportTypes: () => apiRequest<string[]>('/events/sport-types', 'GET', undefined, false),
};

/**
 * User-related API methods
 */
export const usersApi = {
  // Register a new user
  registerUser: (userData: any) => 
    apiRequest<any>('/users/register', 'POST', userData, false),
  
  // Login user
  loginUser: (credentials: { email: string; password: string }) => 
    apiRequest<{ token: string; user: any }>('/users/login', 'POST', credentials, false),
  
  // Get current user profile
  getCurrentUser: () => apiRequest<any>('/users/me'),
  
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
  getWhatsAppQrCode: async () => {
    try {
      return await apiRequest<{qrCodeUrl: string}>('/whatsapp/qrcode');
    } catch (error) {
      // If we get a 403 or 404 error, return an empty QR code instead of throwing
      if (error instanceof Error && (error.message.includes('403') || error.message.includes('404'))) {
        console.warn('WhatsApp QR code endpoint returned error, using empty response');
        return { qrCodeUrl: '' };
      }
      throw error;
    }
  },
  
  // Check status of WhatsApp connection
  getWhatsAppStatus: () => apiRequest<{connected: boolean, phoneNumber?: string}>('/whatsapp/status'),
  
  // Link web account with WhatsApp
  linkWhatsApp: (userId: string, phoneNumber: string) => 
    apiRequest<{success: boolean}>('/whatsapp/link', 'POST', { userId, phoneNumber }),
};

/**
 * Test data API methods
 */
export const testDataApi = {
  // Get summary of test data
  getTestDataSummary: () => apiRequest<any>('/test-data/summary', 'GET', undefined, false),
};

/**
 * Platform statistics API methods
 */
export const statsApi = {
  // Get platform statistics
  getPlatformStats: () => apiRequest<{
    activePlayers: number;
    gamesWeekly: number;
    padelVenues: number;
    playerRating: number;
  }>('/stats', 'GET', undefined, false),
};

export default {
  events: eventsApi,
  users: usersApi,
  whatsapp: whatsappApi,
  testData: testDataApi,
  stats: statsApi,
}; 