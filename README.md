# Saaszo

Saaszo is a Turbo monorepo with a Next.js frontend and a NestJS backend.

## Apps

- `apps/web`: Next.js App Router frontend on `http://localhost:3000`
- `apps/api`: NestJS backend on `http://localhost:3001/api`

## Shared Packages

- `packages/ui`: shared React components
- `packages/eslint-config`: shared flat ESLint configs
- `packages/typescript-config`: shared TypeScript presets

## Getting Started

```sh
npm install
npm run dev
```

That starts both apps in parallel through Turbo.

## Useful Commands

```sh
npm run dev
npm run dev:web
npm run dev:api
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
