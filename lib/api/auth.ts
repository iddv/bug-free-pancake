'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export function useAuth() {
  return useContext(AuthContext);
}

// Helper functions for token management
const storeToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // This would be a real API call in production
        // For now, we'll simulate authentication with a stored token
        
        setUser({
          userId: '1',
          name: 'Test User',
          email: 'test@example.com'
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth validation error:', error);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    // For demo purposes, accept any credentials
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate login response
      const mockUser = {
        userId: '1',
        name: 'Test User',
        email
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      storeToken('mock-jwt-token');
      
      // Redirect to events page
      router.push('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate registration response
      const mockUser = {
        userId: '1',
        name,
        email
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      storeToken('mock-jwt-token');
      
      // Redirect to events page
      router.push('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  // The context value
  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to redirect if not authenticated
export function useRequireAuth(redirectUrl = '/login') {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [loading, isAuthenticated, router, redirectUrl]);

  return { user, loading };
} 