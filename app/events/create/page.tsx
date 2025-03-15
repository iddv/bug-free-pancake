'use client';

import React from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NaturalLanguageEventForm } from '@/components/NaturalLanguageEventForm';
import { EventCreationForm } from '@/components/EventCreationForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold mt-4">Create New Event</h1>
          <p className="text-gray-600 mt-2">
            Create a new sports event by describing it in natural language or using the detailed form.
          </p>
        </div>

        <Tabs defaultValue="natural" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="natural">Natural Language</TabsTrigger>
            <TabsTrigger value="structured">Structured Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="natural" className="mt-6">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-8 text-sm text-blue-700">
              <p>
                <strong>Natural Language Event Creation:</strong> Simply describe your event in plain English. 
                For example: <em>"I want to play tennis tomorrow at 3pm at Central Courts with 3 other people"</em>
              </p>
            </div>
            <NaturalLanguageEventForm />
          </TabsContent>
          
          <TabsContent value="structured" className="mt-6">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-8 text-sm text-blue-700">
              <p>
                <strong>Structured Form:</strong> Fill out all the details for your event using the form below.
              </p>
            </div>
            <EventCreationForm />
          </TabsContent>
        </Tabs>

        <div className="mt-16 py-4 px-6 bg-gray-50 rounded-lg text-sm text-gray-500 max-w-4xl mx-auto">
          <h3 className="font-medium mb-2">How Event Creation Works</h3>
          <p>
            When you create an event, it will be visible to all users of the Social Sports app. 
            You can specify the sport type, location, date, time, and the number of participants needed.
          </p>
          <p className="mt-2">
            Users can join your event until it reaches the participant limit. Once created, you'll 
            receive notifications when people join your event.
          </p>
        </div>
      </div>
    </div>
  );
} 