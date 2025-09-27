# Pool Design Consultant - AI-Driven Pool Design Services

## Overview

This is a modern web application for a pool design consultancy that combines AI-powered design tools with professional pool construction services. The application serves as a comprehensive platform where homeowners can explore pool design options, get cost estimates, view portfolios, and connect with the design team. It features a marketing-focused frontend showcasing services, packages, testimonials, and an interactive cost calculator, backed by a robust API for handling contact inquiries and cost calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring pool-themed colors (blues and oranges)
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Design System**: Custom theme with CSS variables for consistent branding across components

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON request/response format
- **Validation**: Zod schemas for request validation and type safety
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development**: Hot module replacement via Vite integration for seamless development experience

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Connection**: Neon serverless PostgreSQL for cloud database hosting
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios
- **Data Models**: Three main entities - users, contact inquiries, and cost calculations

### Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not yet implemented
- **Architecture**: Prepared for session-based authentication with user management capabilities
- **Security**: CORS and basic security middleware configured for API protection

### Frontend Component Structure
- **Layout Components**: Header with navigation, Footer with social links and company info
- **Marketing Sections**: Hero banner, trust indicators, service grid, portfolio showcase
- **Interactive Features**: Cost calculator with real-time estimates, contact forms with validation, Interactive Pool Showroom with authentic manufacturer catalogs
- **Design System**: Consistent use of cards, buttons, and forms following shadcn/ui patterns
- **Responsive Design**: Mobile-first approach with responsive breakpoints and layouts

### Interactive Pool Showroom
- **Material Categories**: Waterline Tile, Interior Finish, Coping, Decking, Lighting (20 authentic products total)
- **Manufacturer Partners**: NPT Pool, Oceanside Glasstile, PebbleTec, WetEdge, StoneScapes, Shades of Stone, Bedrosians, Belgard, Encore Coatings, Travertine Warehouse, Pentair, Hayward
- **Advanced Filtering**: Color, finish, size, salt-safe compatibility, freeze/thaw resistance, SRI rating
- **Real-Time Cost Estimation**: Material costs, labor complexity, and total project estimates based on pool dimensions
- **Selection Management**: Product comparison, selection persistence, import/export capabilities

### API Endpoints
- **Contact Management**: POST /api/contact for inquiries, GET /api/contact-inquiries for admin access
- **Cost Calculations**: POST /api/cost-calculation for estimates, GET /api/cost-calculations for admin access
- **Validation**: Zod schema validation on all endpoints with detailed error responses
- **Logging**: Request/response logging with performance metrics for API monitoring

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for UI and form management
- **Build Tools**: Vite for fast development and building, TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing without complex router overhead

### UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling Framework**: Tailwind CSS for utility-first styling approach
- **Design System**: shadcn/ui for pre-built, customizable components
- **Animations**: CSS transitions and Tailwind utilities for smooth interactions

### Backend Infrastructure  
- **Web Framework**: Express.js for HTTP server and API routing
- **Database**: Drizzle ORM with PostgreSQL for robust data persistence
- **Cloud Database**: Neon serverless PostgreSQL for scalable database hosting
- **Validation**: Zod for runtime type checking and schema validation

### Development and Build Tools
- **Package Manager**: npm for dependency management and script execution
- **Code Quality**: TypeScript for static type checking and better developer experience
- **Development**: Vite plugins for React, error overlays, and Replit integration
- **Build Process**: ESBuild for fast production builds with tree shaking

### Third-Party Services
- **Fonts**: Google Fonts (Inter) for consistent typography across the application
- **Images**: Unsplash for high-quality stock photography in portfolio sections
- **Email Service**: SendGrid integration temporarily disabled due to sender verification requirements. Contact forms save inquiries to database but email notifications are paused until kayne@pooldesignconsultant.com is verified as a sender in SendGrid dashboard.
- **Live Chat**: Crisp multi-channel chat widget integrated (Website ID: d4573884-3c5f-4fef-87bc-ebeb6c03e25f) providing web chat, WhatsApp, and Facebook Messenger support for real-time customer engagement and lead capture.
- **Deployment**: Configured for Replit deployment with appropriate build scripts