# Social Sports Landing Page

A modern landing page for a social sports application that connects players, organizes events, and builds communities. Built with Next.js, React, and Tailwind CSS.

![Social Sports Screenshot](public/socialsports.jpg)

## Features

- Responsive design that works on all devices
- Modern UI with Tailwind CSS
- Optimized performance with Next.js
- Client-side hydration for improved user experience
- Natural language event creation using NLP
- Backend API integration for event management
- User participation tracking
- Event filtering by sport type and date
- User-specific event views
- Event cancellation with confirmation
- User authentication (login/register)
- WhatsApp integration for event notifications
- Advanced UI components including calendar and time picker

## Frontend Components

The application includes the following key components:

### Event Creation
- **Natural Language Form**: Create events by describing them in plain English
- **Structured Form**: Detailed form with all event parameters
- **Tabbed Interface**: Switch between natural language and structured input methods

### Event Management
- **Event Listings**: View all upcoming sports events with filtering options
- **My Events**: View events you've created or joined
- **Event Details**: See comprehensive information about specific events
- **Join Event**: Easily join events with available slots
- **Cancel Event**: Cancel events you've created with confirmation dialog

### User Experience
- **Toast Notifications**: Receive feedback on actions like event cancellation
- **Confirmation Dialogs**: Prevent accidental actions with confirmation prompts
- **Filtering**: Filter events by sport type and date range
- **Responsive Design**: Optimized for all device sizes
- **Authentication**: User registration and login functionality
- **WhatsApp Integration**: Connect your WhatsApp account for event notifications

## Backend API Integration

The frontend integrates with a RESTful backend API that provides the following endpoints:

### Event Management Endpoints
- `GET /api/events` - List all upcoming events
- `GET /api/events/my-events` - List events for the current user
- `GET /api/events/{eventId}` - Get event by ID
- `POST /api/events` - Create new event
- `POST /api/events/parse` - Parse natural language event descriptions
- `POST /api/events/{eventId}/join` - Join an event
- `PUT /api/events/{eventId}/cancel` - Cancel an event
- `GET /api/events/sport-types` - Get available sport types

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user information

### WhatsApp Integration Endpoints
- `GET /api/whatsapp/status` - Get WhatsApp connection status
- `GET /api/whatsapp/qrcode` - Get QR code for WhatsApp connection

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font.

## Environment Variables

Copy the `.env.example` file to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Key environment variables:

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the backend API (default: http://localhost:8080/api)

## Project Structure

```
/app                     # Next.js app directory
  /components            # App-specific components
  /debug                 # Debug pages and utilities
  /events                # Event-related pages
    /[eventId]           # Event details page
      /join              # Join event page
    /create              # Create event page
    /my-events           # User-specific events page
  /login                 # Login page
  /register              # Registration page
  /simplified-home       # Alternative home page
  /page.tsx              # Landing page
/components              # React components
  /ui                    # Reusable UI components
    /button.tsx          # Button component
    /dialog.tsx          # Dialog component
    /toast.tsx           # Toast notification component
    /calendar.tsx        # Calendar component
    /time-picker.tsx     # Time picker component
    /form.tsx            # Form components
    /switch.tsx          # Switch component
  /AuthProvider.tsx      # Authentication provider
  /ClientAuthProvider.tsx # Client-side auth provider
  /CancelEventButton.tsx # Event cancellation button with confirmation
  /ErrorBoundary.tsx     # Error handling components
  /Header.tsx            # Application header
  /WhatsAppIntegration.tsx # WhatsApp integration component
/lib                     # Utility functions and hooks
  /api                   # API integration
    /client.ts           # API client
    /events.ts           # Event-specific API functions
    /hooks.ts            # React hooks for API
    /types.ts            # TypeScript types
    /auth.ts             # Authentication utilities
/public                  # Static files
  /mock-api              # Mock API data for development
/scripts                 # Utility scripts
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on AWS Amplify

This project is configured for deployment on AWS Amplify. To deploy the application:

1. Push your code to your Git repository
2. Log in to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home)
3. Click "New app" → "Host web app"
4. Connect your repository and branch
5. Configure build settings with the following build commands or use the included `amplify.yml` file

```bash
# Build commands for Next.js on Amplify
npm ci
npm run build
```

6. Set up environment variables in the Amplify Console (copy from `.env.example`)
7. Review and save your settings
8. Deploy the application

### Next.js on AWS Amplify Notes

- AWS Amplify fully supports Next.js applications
- For SSR (Server-Side Rendering) apps, Amplify automatically configures a serverless infrastructure
- Static assets are served through Amazon CloudFront CDN

For more information, see the [AWS Amplify documentation for Next.js](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html).
