# MFE Dashboard

Host application for the micro-frontend demo. It mounts `about-app`, `products-app`, and `prices-app` on dashboard routes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Authentication Overview](#authentication-overview)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Vercel Deployment](#vercel-deployment)
- [Run All Apps From VS Code Workspace](#run-all-apps-from-vs-code-workspace)
- [Run Individual Apps](#run-individual-apps)
- [Open in Browser](#open-in-browser)
- [Demo Login](#demo-login)
- [Stop All Apps](#stop-all-apps)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 20+
- `pnpm` installed globally
- VS Code opened at the multi-root workspace containing:
  - `mfe-dashboard`
  - `mfe-about-app`
  - `mfe-products-app`
  - `mfe-prices-app`

## Authentication Overview

- Login is centralized in the dashboard host at `/login`.
- Dashboard routes `/`, `/about`, `/products`, and `/prices` require a valid JWT session cookie.
- JWT lifetime is 10 minutes.
- Passwords are stored as salted hashes in Postgres using Prisma.
- Direct access to `about-app`, `products-app`, or `prices-app` redirects to the dashboard login page.
- After login, the user is redirected back to the originally requested dashboard route.

## Environment Variables

Dashboard `.env.local`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mfe_dashboard?schema=public"
AUTH_JWT_SECRET="replace-with-a-long-random-secret"
AUTH_PASSWORD_SECRET="replace-with-a-long-random-pepper"
AUTH_DEMO_ADMIN_EMAIL="admin@example.com"
AUTH_DEMO_ADMIN_PASSWORD="admin"
NEXT_PUBLIC_DASHBOARD_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_MFE_BASE_DOMAIN=""
NEXT_PUBLIC_REMOTE_ABOUT_URL="http://localhost:4101/remote-entry.js"
NEXT_PUBLIC_REMOTE_PRODUCTS_URL="http://localhost:4102/remote-entry.js"
NEXT_PUBLIC_REMOTE_PRICES_URL="http://localhost:4103/remote-entry.js"
```

Each remote `.env.local`:

```bash
VITE_DASHBOARD_BASE_URL="http://localhost:3000"
```

You can copy the checked-in `.env.example` files in each app as a starting point.

## Database Setup

Run these commands in `mfe-dashboard` before starting the demo:

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate --name init-auth
pnpm prisma:seed
```

This creates the `users` table and seeds one demo admin account.

For Vercel + Prisma Postgres:

- Set `DATABASE_URL` to the direct Postgres connection string.
- Set `AUTH_JWT_SECRET` and `AUTH_PASSWORD_SECRET` in Vercel project settings.
- Run Prisma migration and seed against the target database before testing login.

## Vercel Deployment

Used `mfe.ee-ze.com` as the host dashboard domain, and deployed products app remote as a separate project/subdomain (`mfe-products.ee-ze.com`).

Domains:

- Dashboard host: `https://mfe.ee-ze.com`
- About remote: not deployed
- Products remote: `https://mfe-products.ee-ze.com/remote-entry.js`
- Prices remote: not deployed

Dashboard project environment variables (Vercel -> Settings -> Environment Variables):

- `NEXT_PUBLIC_MFE_BASE_DOMAIN=ee-ze.com`
- `NEXT_PUBLIC_DASHBOARD_BASE_URL=https://mfe.ee-ze.com`
- `AUTH_JWT_SECRET=<strong random value>`
- `AUTH_PASSWORD_SECRET=<strong random value>`
- `DATABASE_URL=<vercel postgres or direct postgres url>`
- `AUTH_DEMO_ADMIN_EMAIL=admin@example.com`
- `AUTH_DEMO_ADMIN_PASSWORD=admin`

Dashboard deploy behavior:

- `pnpm build` now runs `pnpm prisma:migrate:deploy` automatically before `next build`.
- On Vercel, this applies pending Prisma migrations during each deployment.
- Seeding is still manual (`pnpm prisma:seed`) and should not run on every deploy.

Remote project requirements (`about-app`, `products-app`, `prices-app`):

- Build command: `pnpm build`
- Install command: `pnpm install`
- Output directory: `dist`
- Environment variable: `VITE_DASHBOARD_BASE_URL=https://mfe.ee-ze.com`
- CORS header in each remote `vercel.json`:
  - `Access-Control-Allow-Origin: https://mfe.ee-ze.com`

After any env, domain, or header change:

1. Redeploy affected remote project(s).
2. Redeploy dashboard project.
3. Hard refresh browser (`Cmd+Shift+R`).

Production verification:

1. Open each remote entry URL and confirm it returns JavaScript:
   - `https://mfe-about.ee-ze.com/remote-entry.js`
   - `https://mfe-products.ee-ze.com/remote-entry.js`
   - `https://mfe-prices.ee-ze.com/remote-entry.js`
2. Open dashboard routes:
   - `https://mfe.ee-ze.com/about`
   - `https://mfe.ee-ze.com/products`
   - `https://mfe.ee-ze.com/prices`

## Run All Apps From VS Code Workspace

Use the preconfigured VS Code task from the workspace:

1. Open Command Palette: `Cmd+Shift+P`
2. Run: `Tasks: Run Task`
3. Select: `dev: all`

This starts all 4 apps in parallel:

- Dashboard: `http://localhost:3000`
- About remote: `http://localhost:4101`
- Products remote: `http://localhost:4102`
- Prices remote: `http://localhost:4103`

## Run Individual Apps

If needed, run one app at a time from `Tasks: Run Task`:

- `dev: dashboard`
- `dev: about-app`
- `dev: products-app`
- `dev: prices-app`

## Open in Browser

Open:

- `http://localhost:3000`

Unauthenticated users are redirected to:

- `http://localhost:3000/login`

Then verify routes:

- `/about`
- `/products`
- `/prices`

Opening a remote directly on `http://localhost:4101`, `http://localhost:4102`, or `http://localhost:4103` redirects to the dashboard login page.

## Demo Login

Default seeded credentials:

- Email: `admin@example.com`
- Password: `admin`

If you change `AUTH_DEMO_ADMIN_EMAIL` or `AUTH_DEMO_ADMIN_PASSWORD`, rerun:

```bash
pnpm prisma:seed
```

## Stop All Apps

Option 1 (VS Code):

- Open the Terminal panel and stop each running task terminal.

Option 2 (by ports):

```bash
for p in 3000 4101 4102 4103; do
  pids=$(lsof -ti tcp:$p)
  if [ -n "$pids" ]; then
    echo "$pids" | xargs kill
  fi
done
```

## Troubleshooting

- `Invalid email or password`:
  - Make sure you ran `pnpm prisma:migrate --name init-auth` and `pnpm prisma:seed` in `mfe-dashboard`.
- `Missing required environment variable`:
  - Check the dashboard `.env.local` for `AUTH_JWT_SECRET`, `AUTH_PASSWORD_SECRET`, and `DATABASE_URL`.
- Login expires after 10 minutes:
  - This is expected. The JWT session lifetime is intentionally set to 10 minutes.
- `Task not found: dev: all`:
  - Make sure you opened the multi-root workspace, not only a single folder.
- `EADDRINUSE` port errors:
  - A previous process is still running on that port. Stop terminals or kill by port.
- Remotes not loading:
  - Confirm `about-app`, `products-app`, and `prices-app` task terminals are running without build errors.
