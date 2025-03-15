'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show header on landing page which has its own header
  if (pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    logout();
    // Close menu if it's open
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/socialsports.jpg" 
            alt="Social Sports Logo" 
            width={40} 
            height={40} 
            className="mr-2"
          />
          <span className="font-semibold text-primary">Social Sports</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/events" 
            className={`transition-colors hover:text-primary ${
              pathname.includes('/events') ? 'text-primary font-medium' : 'text-gray-700'
            }`}
          >
            Events
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                href="/events/my-events" 
                className={`transition-colors hover:text-primary ${
                  pathname === '/events/my-events' ? 'text-primary font-medium' : 'text-gray-700'
                }`}
              >
                My Events
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-primary">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {user?.name || user?.email}
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="text-primary h-6 w-6" />
          ) : (
            <Menu className="text-primary h-6 w-6" />
          )}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md md:hidden">
            <nav className="flex flex-col py-3 px-4">
              <Link 
                href="/events" 
                className={`py-2 ${
                  pathname.includes('/events') ? 'text-primary font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/events/my-events" 
                    className={`py-2 ${
                      pathname === '/events/my-events' ? 'text-primary font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Events
                  </Link>
                  <div className="py-2 text-sm text-gray-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {user?.name || user?.email}
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="py-2 text-left text-gray-700 hover:text-primary flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 