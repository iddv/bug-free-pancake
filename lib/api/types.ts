/**
 * API Types for Social Sports integration
 */

// Sport types supported by the backend
export type SportType = 'PADEL' | 'TENNIS' | 'FOOTBALL' | 'BASKETBALL' | 'VOLLEYBALL';

// Skill level from 1-5
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

// Event status
export type EventStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

// Event participant
export interface Participant {
  userId: string;
  name: string;
  phoneNumber?: string;
  joinedAt: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

// Event data structure
export interface Event {
  eventId: string;
  sport: SportType;
  location: string;
  date: string; // ISO date string
  maxPlayers: number;
  currentPlayers: number;
  skillLevel: SkillLevel;
  bookingUrl?: string;
  createdBy: string;
  createdAt: string;
  status: EventStatus;
  participants: Participant[];
  whatsappGroupLink?: string;
  participantPhoneNumbers?: string[]; // For backwards compatibility with components
}

// Event creation request
export interface EventRequest {
  sport: SportType;
  location: string;
  date: string; // ISO date string
  maxPlayers: number;
  skillLevel: SkillLevel;
  bookingUrl?: string;
  creatorName: string;
  creatorPhone?: string;
}

// Join event request
export interface JoinEventRequest {
  userName: string;
  userPhone?: string;
}

// User profile
export interface UserProfile {
  userId: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  whatsappLinked: boolean;
  favoriteLocations?: string[];
  favoriteSports?: SportType[];
  preferredSkillLevel?: SkillLevel;
  createdAt: string;
  isPremium: boolean;
}

// User registration request
export interface UserRegistrationRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
} 