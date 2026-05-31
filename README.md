# forge-api-frontend

> React SPA consuming [forge-api](https://github.com/valentino/forge-api) — built as a learning project to demonstrate professional, enterprise-grade frontend architecture and patterns.

---

## Overview

Full-stack task management application. This repository contains the frontend, a React SPA that communicates with a Node.js/Express REST API via REST and WebSockets.

The project is not production-ready by design — it exists to demonstrate a professional frontend architecture with the patterns and tools used in enterprise environments.

---

## Tech Stack

| Category | Technology |
|---|---|
| UI Framework | React 18 + Vite |
| Language | TypeScript |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Styling | Tailwind CSS + Shadcn/ui |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| WebSockets | Socket.io-client |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |

---

## Architecture

### Feature-based with Colocation

The project follows a strict **feature-based architecture** where each feature is a self-contained module with its own components, hooks, API layer, types and utilities. Code lives as close as possible to where it is used (colocation principle).

```
src/
├── app/                        # Global config: providers, router, layout
│   ├── app.tsx
│   ├── layout.tsx
│   ├── provider.tsx
│   └── routes.tsx
├── features/
│   ├── auth/                   # Authentication feature
│   │   ├── api/                # TanStack Query hooks (useLogin, useRegister)
│   │   ├── components/         # LoginForm, RegisterForm, AuthGuard
│   │   ├── hooks/              # useAuth
│   │   ├── types/
│   │   └── index.ts            # Public API of the feature
│   ├── tasks/                  # Task management feature
│   │   ├── api/                # useTasks, useCreateTask, taskKeys
│   │   ├── components/         # TaskList, TaskCard, TaskFilters
│   │   ├── hooks/              # useTaskFilters, useTaskSearch
│   │   ├── types/
│   │   └── index.ts
│   ├── organizations/
│   ├── projects/
│   └── users/
├── shared/                     # Only what is used by 2+ features
│   ├── ui/                     # Shadcn components + generic UI
│   ├── hooks/                  # useDebounce, useLocalStorage
│   ├── utils/                  # withSuspense, date utils
│   └── types/                  # Global shared types
└── pages/                      # Route-level compositions (lazy loaded)
```

Each feature exposes a public API via `index.ts` (barrel export). Other features and pages only import from that entry point — never from internal paths.

---

## Patterns & Concepts

### State Management

Clear separation between **server state** and **client state**:

- **Server state** (data from the API) → TanStack Query. Handles caching, background refetching, invalidation and optimistic updates. Never duplicated in Zustand.
- **Client state** (UI state: sidebar open, selected item, active filters) → Zustand with granular selectors to prevent unnecessary re-renders.

### TanStack Query

- Structured `queryKeys` factories per feature for granular cache invalidation
- `staleTime` configured per query based on data volatility
- Optimistic updates on mutations with automatic rollback on error
- `useSuspenseQuery` (v5) for declarative loading with React Suspense
- `ReactQueryDevtools` included in development only via `import.meta.env.DEV`

### Code Splitting

Every page-level component is lazy loaded via `React.lazy` + `withSuspense` utility wrapper. Vite generates a separate chunk per route, keeping the initial bundle small. Chunks are loaded on demand as the user navigates.

```
dist/assets/
├── index-[hash].js         # Initial bundle (app shell)
├── LoginPage-[hash].js     # Loaded on /login
├── DashboardPage-[hash].js # Loaded on /dashboard
└── TasksPage-[hash].js     # Loaded on /tasks
```

### Suspense + Error Boundaries

Each major section is wrapped in an `ErrorBoundary > Suspense` pair. This isolates failures — an error in the Tasks section does not crash the Organizations section. Error Boundaries are the only place where React class components are used.

### Custom Hooks

Logic is extracted into custom hooks following the Single Responsibility Principle. Hooks are composed: `useTaskSearch` internally uses `useDebounce` and TanStack Query. Hooks that are generic and reusable across features live in `shared/hooks/`.

### TypeScript

- Discriminated unions for component props with multiple variants
- Generic components: `Select<T extends string | number>`
- `ComponentProps<typeof X>` to extend existing component types
- Zod schemas for form validation with inferred TypeScript types
- No `any` — `unknown` + type guards for external data

### Axios Interceptors

JWT access token is attached to every request via a request interceptor. On 401 responses, a response interceptor automatically attempts to refresh the token using the refresh token, retries the original request, and redirects to login if the refresh fails.

### WebSockets

Socket.io connection is managed in a `useSocket` custom hook with explicit cleanup on unmount. Real-time task updates from the server trigger TanStack Query cache invalidation, keeping the UI in sync without polling.

### Testing

Critical user flows are tested with Vitest + Testing Library, following the principle of testing behavior rather than implementation:

- Login flow end to end
- Create a task and verify it appears in the list
- Filter tasks by status

Each test renders components with a fresh `QueryClientProvider` to avoid state leaking between tests.

---

## Backend

This frontend consumes **forge-api**, a Node.js + TypeScript + Express + Prisma REST API.

- REST API with JWT authentication (access + refresh tokens)
- WebSocket server via Socket.io with Redis Adapter
- File storage via MinIO (S3-compatible)
- PostgreSQL database via Prisma ORM
- Redis for caching and rate limiting

→ [forge-api repository](https://github.com/valentino/forge-api)

---

## Related

- `forge-api` — Node.js + TypeScript + Express backend