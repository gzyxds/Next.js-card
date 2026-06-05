# Next.js Better Auth Template

A starter template for authentication built with Next.js 16, Better Auth, shadcn/ui, and Supabase PostgreSQL.

## Features

- **Email & Password Authentication** — Sign up, sign in with email and password
- **OAuth Social Login** — GitHub, Google, Discord, Slack out of the box
- **Dynamic Provider Discovery** — Easily add new OAuth providers with minimal code changes
- **Protected Routes** — Cookie check via `proxy.ts` + server-side session validation on protected pages
- **User Dashboard** — Profile info and session details

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Authentication | [Better Auth](https://www.better-auth.com/) |
| UI | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| Database | [Supabase](https://supabase.com/) PostgreSQL |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |

## Project Structure

```
proxy.ts                         # Route interceptor (cookie-based check)
drizzle.config.ts                # Drizzle Kit config
app/
  api/auth/[...all]/route.ts     # Better Auth API handler
  (public)/
    login/                       # Sign in page
    register/                    # Sign up page
  (protected)/
    dashboard/                   # User dashboard (server-side auth)
  page.tsx                       # Landing page
  not-found.tsx                  # 404 page
  layout.tsx                     # Root layout
  globals.css                    # Global styles (Tailwind + shadcn theme)
components/
  auth/
    social-login-button.tsx      # Dynamic OAuth buttons
    provider-icons.tsx           # Provider SVG icons
    logout-button.tsx            # Sign out button
  ui/                            # shadcn/ui components
lib/
  auth.ts                        # Better Auth server config
  auth-client.ts                 # Better Auth client
  providers.ts                   # OAuth provider dynamic discovery
  db/
    index.ts                     # Drizzle database instance
    schema.ts                    # Database schema
  utils.ts                       # Utility functions (cn)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project (for PostgreSQL database)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@host:port/database

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000  # Change to your domain in production

# OAuth Providers (configure to enable, leave empty to disable)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
```

### 3. Push database schema

```bash
npm run db:push
```

### 4. Start development server

```bash
npm run dev
```

Open `http://localhost:3000` to see the app.

## Adding a New OAuth Provider

This template supports dynamic provider discovery. To add a new provider (e.g., Twitter):

1. Add the provider's `clientId` and `clientSecret` env vars to `.env`:

   ```env
   TWITTER_CLIENT_ID=your-client-id
   TWITTER_CLIENT_SECRET=your-client-secret
   ```

2. Register the provider in `lib/providers.ts` by adding an entry to the `allProviders` array.

3. Add the provider icon in `components/auth/provider-icons.tsx`.

The login and register pages will automatically display the new provider button.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:push` | Push schema directly to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## Route Overview

| Path | Auth Required | Description |
|---|---|---|
| `/` | No | Landing page |
| `/login` | No | Sign in page (redirects to `/dashboard` if already logged in) |
| `/register` | No | Sign up page (redirects to `/dashboard` if already logged in) |
| `/dashboard` | Yes | User dashboard (redirects to `/login` if not logged in) |

## License

MIT
