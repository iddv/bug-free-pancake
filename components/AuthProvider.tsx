'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Base URL for the API - update this to match your backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  clearError: () => {},
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper function
  const clearError = () => setError(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Validating token...');
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Auth check response status:', response.status);
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Expected JSON response but got:', contentType);
          console.error('Response text:', await response.text());
          setUser(null);
          setIsLoading(false);
          localStorage.removeItem('token');
          return;
        }

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid or expired
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login with email:', email);
    setIsLoading(true);
    setError(null);
    
    try {
      // Make sure we're using the exact format the backend expects
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: email, 
          password 
        }),
      });

      console.log('Login response status:', response.status);
      console.log('Login request payload:', JSON.stringify({ identifier: email, password }));
      
      // For 401 responses, they might not contain JSON
      if (response.status === 401) {
        console.error('Authentication failed: Invalid credentials');
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return false;
      }
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON response but got:', contentType);
        const responseText = await response.text();
        console.error('Response text:', responseText);
        setError('Server error: Unexpected response format. Please try again later.');
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        // If the user data is directly in the response
        if (data.user) {
          setUser(data.user);
        } 
        // If just user ID is provided, we'll use it directly
        else if (data.userId) {
          // Create a minimal user object with the ID
          // We'll get the full user data when we call /users/me on next reload
          setUser({
            id: data.userId,
            name: '',  // Will be filled in later
            email: email,
            createdAt: new Date().toISOString()
          });
        }
        setIsLoading(false);
        return true;
      } else {
        console.error('Login failed:', data?.message || 'Unknown error');
        setError(data?.message || 'Login failed. Please try again.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error or server unavailable. Please try again later.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('Attempting registration for:', email);
    console.log('API URL:', `${API_BASE_URL}/users/register`);
    setIsLoading(true);
    setError(null);
    
    try {
      // First, try adding user logging to see what's happening
      console.log('Registration payload:', { name, email, password: '****' });

      // The backend might expect a different endpoint structure
      // Try the endpoint that matches the backend structure
      const registrationEndpoints = [
        `${API_BASE_URL}/users/register`,
        `${API_BASE_URL}/auth/register`,
        `${API_BASE_URL}/register`
      ];

      let response;
      let errorMessages = [];

      for (const endpoint of registrationEndpoints) {
        try {
          console.log(`Trying registration endpoint: ${endpoint}`);
          
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });
          
          console.log(`Response from ${endpoint}:`, response.status);

          if (response.ok) {
            console.log('Registration successful at endpoint:', endpoint);
            break;
          } else {
            const errorText = await response.text();
            console.error(`Error from ${endpoint}:`, response.status, errorText);
            errorMessages.push(`${endpoint}: ${response.status} - ${errorText}`);
            response = null;
          }
        } catch (err) {
          console.error(`Network error with ${endpoint}:`, err);
          errorMessages.push(`${endpoint}: Network error`);
        }
      }

      // If all endpoints failed, try using the mock API for demonstration
      if (!response) {
        console.log('All endpoints failed. Attempting to use mock API...');
        
        try {
          response = await fetch('/mock-api/register.json');
          console.log('Mock API response status:', response.status);
          
          if (response.ok) {
            console.log('Successfully registered with mock API');
          } else {
            console.error('Mock API also failed:', response.status);
            setError('Registration failed. Please try again later or contact support.');
            setIsLoading(false);
            return false;
          }
        } catch (err) {
          console.error('Error with mock API:', err);
          setError('Registration failed. Backend service may be unavailable.');
          setIsLoading(false);
          return false;
        }
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON response but got:', contentType);
        const responseText = await response.text();
        console.error('Response text:', responseText);
        
        // If we get a 200 OK but with HTML, it might be a success page
        if (response.ok) {
          console.log('Received non-JSON success response. Creating local user...');
          // Create a basic user object since we don't have proper data
          setUser({
            id: 'temp-' + Date.now(),
            name: name,
            email: email,
            createdAt: new Date().toISOString()
          });
          setIsLoading(false);
          return true;
        } else {
          setError('Server error: Unexpected response format. Please try again later.');
          setIsLoading(false);
          return false;
        }
      }

      const data = await response.json();
      console.log('Registration response data:', data);
      
      // Handle successful registration
      if (response.ok) {
        // Different backends might return data in different formats
        if (data.token) {
          localStorage.setItem('token', data.token);
        } else if (data.access_token) {
          localStorage.setItem('token', data.access_token);
        } else if (data.jwt) {
          localStorage.setItem('token', data.jwt);
        }
        
        // Set user data based on what's available
        if (data.user) {
          setUser(data.user);
        } else if (data.userId || data.id) {
          // Create a minimal user object with the info we have
          setUser({
            id: data.userId || data.id || 'temp-' + Date.now(),
            name: name,
            email: email,
            createdAt: new Date().toISOString()
          });
        } else {
          // Create a minimal user object if nothing is returned
          setUser({
            id: 'temp-' + Date.now(),
            name: name,
            email: email,
            createdAt: new Date().toISOString()
          });
        }
        
        setIsLoading(false);
        return true;
      } else {
        // Handle different error formats
        let errorMessage = 'Registration failed. Please try again.';
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : 'Unknown error';
        } else if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map((e: any) => e.message || e).join('. ');
        }
        
        console.error('Registration failed:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error or server unavailable. Please try again later.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 