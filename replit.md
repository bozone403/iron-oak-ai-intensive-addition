# Iron & Oak Strategic Solutions

## Overview

Iron & Oak Strategic Solutions is a strategic consulting firm website built as a modern, production-ready web application. The platform showcases the firm's services in strategic architecture, operational systems, AI integration, and governance design. The application features a sophisticated dark-themed design system with emerald accents, emphasizing clarity and precision in alignment with elite consulting aesthetics.

The website includes core pages (Home, About, Services, Projects, Contact) with a fully functional lead capture system, admin dashboard for managing inquiries, and legal pages. All content is final and production-ready with no placeholders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server. The application follows a component-based architecture with client-side routing via Wouter.

**UI Component System**: Built on Radix UI primitives with shadcn/ui design system, providing accessible, composable components. The design follows a "New York" style variant with comprehensive component coverage (40+ UI components including dialogs, forms, cards, navigation, etc.).

**Styling Approach**: Tailwind CSS with CSS variables for theming, supporting dark mode as the primary interface. Custom design tokens define colors, spacing, and typography following sophisticated minimalism principles inspired by elite consulting firms. The color system uses HSL values for precise control over backgrounds (near-black base), text hierarchy, and emerald accent colors for strategic emphasis.

**State Management**: TanStack Query (React Query) handles server state, data fetching, and caching. Form state managed through React Hook Form with Zod schema validation.

**Routing Strategy**: File-based routing using Wouter for lightweight client-side navigation without the overhead of larger routing solutions.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript. The server handles both API routes and static file serving in production.

**Development Setup**: Vite middleware integration for hot module replacement during development. The server distinguishes between development and production modes, serving the built client application in production.

**API Design**: RESTful API endpoints for lead management with JSON request/response format. Error handling middleware captures and standardizes error responses.

**Request Logging**: Custom middleware logs API requests with method, path, status code, duration, and truncated response data for debugging.

### Data Storage Solutions

**Primary Storage**: File-based JSON storage for lead data, writing to `/data/leads.json`. This approach was chosen for simplicity and immediate deployment without database provisioning requirements.

**Database Schema Preparation**: Drizzle ORM configured with PostgreSQL schema definitions (users, leads tables) using Neon serverless database connection. While the schema exists, the current implementation uses file storage, allowing for easy migration to PostgreSQL when needed.

**Data Models**: Type-safe schemas defined with Drizzle and Zod for validation. Lead model includes fields for name, email, organization, objective, message, timestamp, and IP tracking.

### External Dependencies

**UI Component Libraries**: 
- Radix UI suite for accessible primitives (accordion, dialog, dropdown, popover, etc.)
- Lucide React for consistent iconography
- Class Variance Authority for component variant management

**Form Handling**:
- React Hook Form for performant form state management
- Hookform Resolvers for schema validation integration
- Zod for runtime type validation

**Database & ORM**:
- Drizzle ORM for type-safe database queries
- Drizzle Kit for schema migrations
- Neon serverless PostgreSQL (configured but not actively used)
- Connect-pg-simple for session storage (future use)

**Development Tools**:
- Replit-specific plugins for cartographer, dev banner, and runtime error overlay
- TypeScript for type safety across the stack
- ESBuild for production server bundling

**Styling & Design**:
- Tailwind CSS with PostCSS and Autoprefixer
- Google Fonts (Inter, Playfair Display, JetBrains Mono)
- CLSX and Tailwind Merge for conditional class composition

**Utilities**:
- Date-fns for date formatting
- Nanoid for unique ID generation
- Embla Carousel for interactive showcases

The architecture prioritizes rapid deployment, type safety, and maintainability while providing a clear upgrade path from file-based storage to PostgreSQL when scaling requirements demand it.