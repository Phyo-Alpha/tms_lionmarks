# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FRI Portal - A comprehensive Future Readiness Index platform for Singapore Business Federation (SBF) to help companies assess their future readiness, benchmark against industry peers, and receive actionable recommendations. The project includes a trainee management system with learner, course, and registration management capabilities.

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Elysia.js API framework
- **Database**: MySQL with Drizzle ORM (PostgreSQL for trainee management)
- **Authentication**: Better Auth with organization support
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun (v18+ recommended)
- **State Management**: Tanstack Query for server state
- **URL State**: NUQS for search parameters

## Development Commands

### Development Server
```bash
bun run dev                    # Start Next.js dev server on port 3012 with Turbopack
bun run build                  # Build for production with Turbopack
bun run start                  # Start production server
```

### Database Management
```bash
bun run docker:dev             # Start PostgreSQL (5458) and TimescaleDB (5459)
bun run db:gen                 # Generate database migrations
bun run db:migrate             # Run database migrations
bun run db:latest              # Generate and run all migrations
bun run db:seed                # Seed test data (admin@sbf.com / SBFAdmin@123)
bun run auth:gen               # Generate Better Auth schema
```

### Code Quality
```bash
bun run lint                   # Run ESLint and Prettier checks
bun run lint:eslint            # Run ESLint only
bun run lint:prettier          # Run Prettier check only
bun run pretty                 # Format code with Prettier
bun test                       # Run Bun test suite (trainee schemas)
```

## Project Architecture

### Directory Structure

```
src/
├── app/                       # Next.js App Router
│   ├── (auth)/                # Authentication pages (login, register, etc.)
│   ├── (user)/                # User dashboard routes
│   ├── admin/                 # Admin dashboard routes
│   │   ├── (admin)/           # Protected admin routes
│   │   └── login/             # Admin login
│   └── api/                   # API route handlers
├── client/                    # Client-side code
│   ├── components/            # Shared React components
│   ├── features/              # Feature-specific components
│   │   ├── admin/             # Admin feature modules
│   │   └── landing-page/      # Landing page components
│   ├── hooks/                 # Reusable React hooks
│   ├── lib/                   # Client utilities (eden, auth-client, utils)
│   └── services/              # Tanstack Query API abstraction
└── server/                    # Server-side code
    ├── api/                   # Elysia API endpoints
    │   ├── auth/              # Authentication endpoints
    │   ├── learners/          # Learner management
    │   ├── courses/           # Course catalog
    │   └── registrations/     # Course registrations
    ├── config/                # Environment configuration
    ├── db/                    # Database connection and schema
    │   └── schema/            # Drizzle schema definitions
    ├── helpers/               # Server utilities (email, responseWrapper, roleCheck)
    └── lib/                   # Server libraries (auth, s3, acra, microsoft-graph)
```

### Feature Development Structure

When implementing a feature:
- **Backend**: Create a feature folder in `src/server/api/` with `index.ts` (controller), `service.ts` (business logic), and `model.ts` (Zod schemas)
- **Frontend**: Create a folder in `src/app/` with components colocated with `page.tsx`
- **API Integration**: Add Tanstack Query hooks in `src/client/services/`

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components/Classes**: PascalCase (`UserProfile`)
- **Functions/Variables**: camelCase (`getUserProfile`)
- **Database Tables**: snake_case (`course_registration`)
- **Database Columns**: snake_case (`created_at`)

## Backend Patterns (Elysia.js)

### Controller-Service-Model Pattern

Each API feature follows this structure:

**Controller** (`index.ts`):
```typescript
import { Elysia } from "elysia";
import { Service } from "./service";
import { Model } from "./model";

export const feature = new Elysia({ prefix: "/feature" })
  .get("/items", async ({ query }) => {
    return Service.getItems(query);
  }, {
    query: Model.getItemsQuery,
    response: Model.getItemsResponse,
  });
```

**Service** (`service.ts`):
- Use `abstract class` with `static` methods for non-request-dependent logic
- DO NOT pass entire Elysia Context to services
- Extract only needed values via destructuring in controller
- For request-dependent logic, use Elysia plugins with `.macro()`

```typescript
export abstract class Service {
  static async getItems(query: Model.GetItemsQuery) {
    // Business logic here
  }
}
```

**Model** (`model.ts`):
```typescript
import { z } from "zod";

export namespace Model {
  export const getItemsQuery = z.object({
    page: z.coerce.number().default(1),
  });
  export type GetItemsQuery = z.infer<typeof getItemsQuery>;
}
```

### Request-Dependent Services

ONLY use Elysia instances when service needs request context (cookies, headers, status):

```typescript
const AuthService = new Elysia({ name: "Auth.Service" })
  .macro({
    isSignIn: {
      resolve({ cookie, status }) {
        if (!cookie.session.value) return status(401);
        return { session: cookie.session.value };
      },
    },
  });
```

## Frontend Patterns (Next.js + React)

### Tanstack Query Usage

**DO NOT** destructure mutations:
```typescript
// ❌ DON'T
const { mutate: login, isPending } = useMutation(authQueries.login());

// ✅ DO
const login = useMutation(authQueries.login());
```

**Use Query Factories** in `src/client/services/`:
```typescript
import { queryOptions } from "@tanstack/react-query";
import { eden } from "@/client/lib/eden";

export const todoQueries = {
  all: () => ["todos"] as const,
  list: (filters: string) => queryOptions({
    queryKey: [...todoQueries.all(), "list", filters],
    queryFn: () => eden.todos.get({ filters }),
  }),
  detail: (id: number) => queryOptions({
    queryKey: [...todoQueries.all(), "detail", id],
    queryFn: () => eden.todos[id].get(),
  }),
};
```

**Form Submissions**:
```typescript
const mutation = useMutation(authQueries.login());

const onSubmit = async (data: FormSchema) => {
  await mutation
    .mutateAsync(data, {
      onSuccess: () => router.push("/dashboard"),
    })
    .catch((error) => toast.error(error.message));
};
```

### URL State Management with NUQS

ALWAYS use NUQS for search parameters:

```typescript
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";

const [filters, setFilters] = useQueryStates({
  search: parseAsString,
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
});

// Update multiple params
setFilters({ search: "hello", page: 1 });
```

Server-side usage:
```typescript
import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
});

export default async function Page({ searchParams }) {
  const { q, page } = await searchParamsCache.parse(searchParams);
}
```

### API Calls with Eden

Use the Eden client for type-safe API calls:
```typescript
import { eden } from "@/client/lib/eden";

eden["survey-attempt"].get()
eden.survey.post({ title: "New Survey" })
```

## Database Schema

### Drizzle Configuration

- **Dialect**: MySQL for main database (configured via env vars)
- **PostgreSQL** for trainee management (via docker)
- **Schema Location**: `src/server/db/schema/`
- **Migrations Output**: `src/db/migrations/app/`

### Key Schema Files

- `auth-schema.ts` - Better Auth tables (auto-generated via `bun run auth:gen`)
- `trainee-schema.ts` - Learners, courses, and registrations with Zod validation schemas

### Environment Variables

Required environment variables (see `.env.example`):
- Database: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- Auth: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Optional: Microsoft Graph, S3 credentials

## Authentication

The project uses Better Auth:
- Configuration: `src/server/lib/auth.ts`
- Middleware: `src/server/lib/auth-middleware.ts`
- Client: `src/client/lib/auth-client.ts`
- Session helper: `src/client/lib/get-session.ts`

Login redirects to `/admin` after successful authentication.

## API Documentation

- **OpenAPI Docs**: http://localhost:3012/api/docs
- **OpenAPI JSON**: http://localhost:3012/api/docs/json
- API tags: Survey, Learners, Courses, Course Registrations, Better Auth

## Code Quality Standards

### TypeScript
- Strict type checking enabled
- No implicit `any` types
- Proper type definitions required
- JSDoc for functions/classes (explain "why", not "what")

### Comments
- Avoid inline comments unless necessary
- Use JSDoc for function/class documentation
- Focus on explaining intent and rationale

### Validation
- Use Zod schemas for all input validation
- Define schemas in `model.ts` files
- Extract TypeScript types with `z.infer<typeof schema>`

## Testing

- Test runner: Bun Test
- Run tests: `bun test`
- Current coverage: Trainee management schemas
- Test controllers using: `app.handle(new Request('http://localhost/path'))`

## Git Workflow

- Follow established code quality standards
- Use proper branch naming conventions
- Ensure linting passes before committing (Husky pre-commit hooks configured)
- Main branch: `main`
