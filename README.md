# MFE Dashboard

Host application for the micro-frontend demo. It mounts `about-app`, `products-app`, and `prices-app` on dashboard routes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Run All Apps From VS Code Workspace](#run-all-apps-from-vs-code-workspace)
- [Run Individual Apps](#run-individual-apps)
- [Open in Browser](#open-in-browser)
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

Then verify routes:

- `/about`
- `/products`
- `/prices`

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

- `Task not found: dev: all`:
  - Make sure you opened the multi-root workspace, not only a single folder.
- `EADDRINUSE` port errors:
  - A previous process is still running on that port. Stop terminals or kill by port.
- Remotes not loading:
  - Confirm `about-app`, `products-app`, and `prices-app` task terminals are running without build errors.
