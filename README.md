# ⚡ Frequency Wave

Africa's tech-entertainment movement — where Web3 meets culture. This repo contains the full-stack events platform:

- **Public site** (`/`) — festival-style landing page: adaptive hero with live countdown, events (upcoming/past), program, sponsorship tiers, sponsors, newsletter, contact. Event detail pages at `/events/[slug]`.
- **Admin dashboard** (`/admin`) — password-protected mission control: create/edit/publish events, agenda items, ticket tiers, sponsors, and view newsletter subscribers + contact messages.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Drizzle ORM · PostgreSQL

## Getting started

```bash
pnpm install
cp .env.example .env          # then fill in values (also mirror to .env.local)
createdb frequency_wave       # local Postgres
pnpm db:push                  # apply schema
pnpm db:seed                  # seed initial events
pnpm dev                      # http://localhost:3000
```

### Environment variables

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Signs admin session cookies (`openssl rand -hex 32`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin dashboard login |

### Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm db:push` | Push Drizzle schema to Postgres |
| `pnpm db:seed` | Seed events (skips if data exists) |
| `pnpm db:studio` | Drizzle Studio DB browser |

## Content model

Events have a `status` (`draft` → `published` → optionally `cancelled`). Only **published** events appear on the public site; they auto-sort into *Upcoming* vs *Past* by start date. Mark one upcoming event `featured` to pin it as the hero billboard with countdown.

The previous static site lives in `legacy/` for reference.
