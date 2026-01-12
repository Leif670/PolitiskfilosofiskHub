# Politisk Filosofisk Online Forum

Portfolio-projekt bygget med Next.js + Postgres + custom auth (email/password og magic-link).

## Quick start

1) Installer afhængigheder

```bash
npm install
```

2) Opsæt miljøvariabler

Lav en `.env` baseret på `.env.example`:

```bash
cp .env.example .env
```

3) Kør migrationer og seed data

```bash
npm run db:migrate
npm run db:seed
```

4) Start appen

```bash
npm run dev
```

Åbn http://localhost:3000

## Demo-login

Seed-scriptet opretter brugere, bl.a.:

- Email: `demo@demo.local`
- Password: `demo1234`

## Auth-flow

- Email/password: `/api/auth/register` og `/api/auth/login`
- Magic-link: `/api/auth/magic-link` (i dev logges link til console)
- Verificering: `/api/auth/magic-link/verify?token=...`
- Email-bekræftelse: `/api/auth/verify-email` og `/api/auth/verify-email/confirm?token=...`

Email-bekræftelse kræves for at stemme og tilføje argumenter.

## Database

Postgres bruges via Prisma. Skemaet findes i `prisma/schema.prisma`.

## Deployment (cloud)

1) Opret en hosted Postgres (fx Supabase, Neon, Render)
2) Sæt env vars i hosting:

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_URL` (fuld URL til din app)
- `RESEND_API_KEY` og `EMAIL_FROM` (hvis du vil sende rigtige emails)

3) Kør migrationer i produktion:

```bash
npx prisma migrate deploy
```

## Scripts

- `npm run db:migrate` – kør lokale migrationer
- `npm run db:seed` – seed demo-data
- `npm run db:generate` – generér Prisma client
