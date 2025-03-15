'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Import ErrorBoundary with client-side only rendering to avoid hydration issues
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), {
  ssr: false
});

export default function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
} 