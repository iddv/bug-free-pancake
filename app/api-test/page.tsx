'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventsApi, testDataApi } from '@/lib/api/client';
import SportTypeSelector from '../components/SportTypeSelector';

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const [selectedSportType, setSelectedSportType] = useState('');
  const [testDataSummary, setTestDataSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const sportTypes = await eventsApi.getSportTypes();
      
      setApiStatus({
        success: true,
        message: 'Successfully connected to the backend API and retrieved sport types',
        data: sportTypes
      });
      
      // Also try to get test data summary
      try {
        const summary = await testDataApi.getTestDataSummary();
        setTestDataSummary(summary);
      } catch (testDataError) {
        console.warn('Could not fetch test data summary:', testDataError);
      }
    } catch (err) {
      console.error('API test failed:', err);
      setApiStatus({
        success: false,
        message: err instanceof Error ? err.message : 'An unknown error occurred'
      });
      setError('Failed to connect to the backend. Please check your .env.local file and ensure NEXT_PUBLIC_API_BASE_URL is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Backend API Connection</h2>
        <p className="mb-4">
          Current API URL: <code className="bg-gray-100 px-2 py-1 rounded">
            {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not configured'}
          </code>
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p><strong>Error:</strong> {error}</p>
            <p className="text-sm mt-1">
              Check your .env.local file and make sure you have the correct LocalTunnel URL from the backend team.
            </p>
          </div>
        )}
        
        <button
          onClick={testApiConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        {apiStatus && (
          <div className={`mt-4 p-4 rounded ${apiStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <h3 className="font-semibold">{apiStatus.success ? 'Success!' : 'Failed'}</h3>
            <p>{apiStatus.message}</p>
            {apiStatus.data && (
              <div className="mt-2">
                <h4 className="font-medium">Sport Types:</h4>
                <ul className="list-disc list-inside pl-2">
                  {apiStatus.data.map((sportType: string) => (
                    <li key={sportType}>{sportType}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      {testDataSummary && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Data Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium">Users</h3>
              <p className="text-2xl font-bold">{testDataSummary.users || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium">Events</h3>
              <p className="text-2xl font-bold">{testDataSummary.events || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-medium">Sport Types</h3>
              <p className="text-2xl font-bold">{testDataSummary.sportTypes || 0}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sport Type Selector Component Test</h2>
        <SportTypeSelector 
          selectedSportType={selectedSportType}
          onChange={setSelectedSportType}
        />
        
        {selectedSportType && (
          <p className="mt-4">
            Selected sport type: <strong>{selectedSportType}</strong>
          </p>
        )}
      </div>
      
      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
} 