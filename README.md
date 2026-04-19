# Saaszo

Saaszo is a Turbo monorepo with a Next.js frontend and a NestJS backend.

## Apps

- `apps/home`: main Next.js app on `http://localhost:3000`
- `apps/invoice`: invoice Next.js app, mounted under `/invoice` and running on `http://localhost:3001` in local development
- `apps/backend`: NestJS backend

## Getting Started

```sh
npm install
npm run dev
```

That starts both apps in parallel through Turbo.

## Useful Commands

```sh
npm run dev
npm run build
npm run lint
npm run check-types
```

## Frontend and Backend Wiring

The frontend expects the API at `http://localhost:3001` by default and reads
`NEXT_PUBLIC_API_URL` if you want to point it somewhere else.

The backend enables CORS and exposes:

- `GET /api`
- `GET /api/health`

## Vercel Multi-Zone Setup

Deploy the two Next.js apps as separate Vercel projects from this monorepo:

- `apps/home` with its Root Directory set to `apps/home`
- `apps/invoice` with its Root Directory set to `apps/invoice`

In the `home` project, set `INVOICE_APP_ORIGIN` to the full deployed origin of
the invoice zone, for example `https://invoice.example.com`.

The localhost fallback is only for local development. On Vercel, `apps/home`
must rewrite `/invoice` and `/invoice-static` to the deployed `apps/invoice`
project, so set `INVOICE_APP_ORIGIN` for both preview and production
environments as needed.
