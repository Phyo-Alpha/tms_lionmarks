# FRI Portal

A comprehensive Future Readiness Index (FRI) platform for SBF (Singapore Business Federation) to help companies assess their future readiness, benchmark against industry peers, and receive actionable recommendations.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (package manager)
- [Docker](https://www.docker.com/) and Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (if running without Docker)

## Setup Instructions

1. **Install Dependencies**

   ```bash
   bun install
   ```

2. **Set up Environment Variables**

   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://postgres:postgres@localhost:5458/sbf
   TIMESCALE_DATABASE_URL=postgresql://timescaledb:password@localhost:5459/timescaledb
   # Authentication
   BETTER_AUTH_URL=http://localhost:3012
   # (don't use this in production)
   BETTER_AUTH_SECRET=frHdC4WBC2X3MprQuJNpJoWWe8ig9DDx

   # Email Configuration (Optional)
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   SMTP_FROM=your-email@domain.com

   # Docker Configuration (Optional)
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=sbf
   POSTGRES_PORT=5458
   TIMESCALE_PORT=5459

   NEXT_PUBLIC_SERVER_URL=http://localhost:3012
   ```

3. **Start Database Services**

   ```bash
   bun run docker:dev
   ```

   This will start:
   - PostgreSQL on port 5458
   - TimescaleDB on port 5459

4. **Run Database Migrations**

   ```bash
   bun run db:latest
   ```

   This will:
   - Generate authentication schema
   - Generate database migrations
   - Run all pending migrations

5. **Start Development Server**

   ```bash
   bun run dev
   ```

   This will start the Next.js development server on http://localhost:3012

6. **Seed Test Data (Optional)**

   To populate the database with mock survey data and test accounts:

   ```bash
   bun run db:seed
   ```

   **Test Account Credentials:**
   - **Admin Account**
     - Email: admin@sbf.com
     - Password: SBFAdmin@123

   - **User Account (BCG)**
     - Email: user1@bcg.com
     - Password: BCGUser1@123

## Project Structure

```
sbf/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (user)/           # User dashboard
│   │   ├── (admin)/          # Admin dashboard
│   │   └── api/              # API routes
│   ├── client/               # Client-side code
│   ├── server/               # Server-side code
│   └── db/                   # Database migrations
├── docker/                   # Docker configurations
└── public/                   # Static assets
```

## Development

### Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production with Turbopack
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run docker:dev` - Start Docker services
- `bun test` - Run unit tests for trainee schemas

### Trainee Management

- Admin users can manage learners at `/admin/learners` with full CRUD, search, status filters, and pagination.
- Courses are available at `/admin/courses`, supporting scheduling, capacity management, and publication state.
- Course registrations live at `/admin/registrations`, providing enrolment, conflict detection, and capacity validation.
- Query parameters for all admin tables are managed with [nuqs](https://github.com/47ng/nuqs) to allow sharable filtered views.
- Server-side protections prevent double enrolments, enforce course capacity, and block overlapping schedules.

### Database Management

- `bun run auth:gen` - Generate authentication schema
- `bun run db:gen` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:latest` - Generate and run latest migrations

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Elysia.js API with Better Auth
- **Database**: PostgreSQL + TimescaleDB
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Package Manager**: Bun
- **Authentication**: Better Auth with organization support

### Testing

- Execute `bun test` to run the Bun test suite.
- Current coverage focuses on trainee management schemas to ensure validation rules remain stable.

## API Documentation

### Access Points

- **API Base URL**: http://localhost:3012/api
- **OpenAPI Documentation**: http://localhost:3012/api/docs
- **OpenAPI JSON Spec**: http://localhost:3012/api/docs/json

## Contributing

1. Follow the established code quality standards
2. Use TypeScript for type safety
3. Follow the Git workflow with proper branch naming
4. Ensure all linting passes before committing
