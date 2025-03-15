'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SimplifiedHomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Basic information to display
  const links = [
    { href: '/debug', label: 'Debug Page' },
    { href: '/test', label: 'Test Page' },
    { href: '/events', label: 'Events' },
    { href: '/login', label: 'Login' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Social Sports App - Simplified Home</h1>
      
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Environment Info</h2>
        <p><strong>Client-side rendering:</strong> {isMounted ? 'Working ✅' : 'Not working ❌'}</p>
        <p><strong>Current time:</strong> {new Date().toLocaleTimeString()}</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Navigation</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              style={{
                padding: '12px',
                backgroundColor: '#e2e8f0',
                borderRadius: '6px',
                color: '#1e293b',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Component Test</h2>
        <p style={{ marginBottom: '16px' }}>Testing if the Button component works:</p>
        <Button onClick={() => alert('Button clicked!')}>
          Click Me
        </Button>
      </div>
    </div>
  );
} 