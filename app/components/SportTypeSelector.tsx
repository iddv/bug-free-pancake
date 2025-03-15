'use client';

import { useState, useEffect } from 'react';
import { eventsApi } from '@/lib/api/client';

interface SportTypeSelectorProps {
  selectedSportType: string;
  onChange: (sportType: string) => void;
}

export default function SportTypeSelector({ selectedSportType, onChange }: SportTypeSelectorProps) {
  const [sportTypes, setSportTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSportTypes = async () => {
      try {
        const types = await eventsApi.getSportTypes();
        setSportTypes(types);
      } catch (err) {
        console.error('Failed to fetch sport types:', err);
        setError('Failed to load sport types. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSportTypes();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="w-full">
      <label htmlFor="sportType" className="block text-sm font-medium text-gray-700 mb-1">
        Sport Type
      </label>
      <select
        id="sportType"
        name="sportType"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={selectedSportType}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a sport type</option>
        {sportTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
} 