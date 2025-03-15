'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { register, error, isLoading, isAuthenticated, clearError } = useAuth();

  // Clear error when component unmounts or when inputs change
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Update local error state from auth context
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleInputChange = () => {
    // Clear error message when user starts typing
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    const success = await register(name, email, password);
    if (success) {
      // No need to redirect here as the isAuthenticated effect will handle it
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Sign up for Social Sports to create and join events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleInputChange();
                }}
                placeholder="John Doe"
                required
                className={formError ? "border-red-300 focus:border-red-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                placeholder="your.email@example.com"
                required
                className={formError ? "border-red-300 focus:border-red-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
                required
                className={formError ? "border-red-300 focus:border-red-500" : ""}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  handleInputChange();
                }}
                required
                className={formError ? "border-red-300 focus:border-red-500" : ""}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 