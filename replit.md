# Wanda Estates - Luxury Real Estate Website

## Overview

Wanda Estates is a luxury real estate website for a Marbella-based property agency. The application is a full-stack web application built with React on the frontend and Express.js on the backend, featuring a modern UI with multilingual support, property listings, contact forms, and an AI-powered chatbot for customer inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Internationalization**: i18next with react-i18next for multilingual support (7 languages: EN, ES, NL, SV, PL, FR, DE)
- **Animations**: Framer Motion for property card animations
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod for type-safe validation
- **Development**: tsx for TypeScript execution, Vite dev server integration

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: 
  - `users` - User accounts with username/password
  - `contact_inquiries` - Customer contact form submissions
- **Migrations**: Drizzle Kit with migrations output to `/migrations` directory

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route page components
│   │   ├── lib/         # Utilities and i18n config
│   │   └── hooks/       # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── chatbot.ts    # AI chatbot integration
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle database schema
└── attached_assets/  # Static images and videos
```

### Key Design Decisions

1. **Monorepo Structure**: Client and server code coexist with shared schema definitions, enabling type safety across the stack.

2. **Memory Storage Fallback**: The storage layer uses in-memory storage (MemStorage) as a fallback when database is not available, making development easier.

3. **Bilingual Design**: The site prioritizes Spanish and English for the Marbella luxury real estate market, with additional European languages for international buyers.

4. **Component Library**: Uses shadcn/ui (new-york style) for consistent, accessible UI components with Tailwind CSS integration.

## External Dependencies

### Third-Party Services
- **Perplexity AI**: Powers the chatbot functionality for real-time customer inquiries (requires PERPLEXITY_API_KEY)
- **PostgreSQL Database**: Primary data storage (requires DATABASE_URL)

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack Query, Framer Motion, i18next, Lucide icons
- **Backend**: Express, Drizzle ORM, Zod, connect-pg-simple for sessions
- **Build**: Vite, esbuild, TypeScript, Tailwind CSS

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `PERPLEXITY_API_KEY` - For AI chatbot functionality (optional)

### Static Assets
- Custom logo at `/wanda_logo_horizontal.png`
- Generated images in `attached_assets/generated_images/`
- Generated videos in `attached_assets/generated_videos/`