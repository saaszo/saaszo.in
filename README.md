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

## Cloudflare Workers Setup

For Cloudflare, prefer `Workers` over `Pages` for this repo.

- Cloudflare's current Next.js guidance routes full-stack or SSR Next.js apps to Workers with `@opennextjs/cloudflare`.
- Pages is the static-only path for Next.js. If these apps stay simple today but grow server features later, Workers avoids a second migration.
- This repo is already split into two deployable apps, so the lowest-risk Cloudflare setup is one Worker per app: `saaszo-home` and `saaszo-invoice`.

### Files added for Cloudflare

- `apps/home/wrangler.jsonc`
- `apps/home/open-next.config.ts`
- `apps/invoice/wrangler.jsonc`
- `apps/invoice/open-next.config.ts`

### Monorepo commands

Run these from the repo root:

```sh
npm run cf:build:invoice
npm run cf:check:invoice
npm run cf:preview:invoice
npm run cf:deploy:invoice
```

```sh
npm run cf:build:home
npm run cf:check:home
npm run cf:preview:home
INVOICE_APP_ORIGIN=https://saaszo-invoice.<your-workers-subdomain>.workers.dev npm run cf:deploy:home
```

### Deployment order

1. Deploy `apps/invoice` first.
2. Set `INVOICE_APP_ORIGIN` to the public `workers.dev` URL or custom domain for the invoice Worker.
3. Deploy `apps/home`.

### Account requirements

- You need either a `workers.dev` subdomain or a Cloudflare zone with custom domains before public deployment will work.
- If you want to use `workers.dev`, claim the account subdomain from the Workers & Pages dashboard first.
