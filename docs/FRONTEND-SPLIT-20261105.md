# SaaSzo / Invoice frontend split — 5 November 2026

## Confirmed source structure
- apps/home/src/app/dashboard/page.tsx contains the central customer workspace: overview, branches, team and settings. Its PRODUCTS registry currently lists Invoice only. Public product-directory links do not bypass or expand this authenticated access registry.
- apps/home/src/components/dashboard/dashboard-shell.tsx only displays Platform Admin to workspaceUser.role === super_admin.
- apps/home/src/app/dashboard/platform/page.tsx independently guards that role and contains platform tools/plans/subscription/organisation management.
- These are central account/platform administration, not verified replacements for each product's operational screens. POS admin must therefore remain until the equivalent workflows are intentionally moved.

## Result
- www.saaszo.in root: suite homepage for Invoice, POS, HRMS, Task, Seller, Connect and Engage, with links into the existing central auth and dashboard.
- invoice.saaszo.in root: dedicated Invoice marketing landing, carrying over the existing hero illustration and billing/product positioning into sections for features, businesses, platforms and FAQ. Copied artwork is namespaced under public/invoice-marketing.
- Public root metadata/canonical URLs are distinct. Invoice public root no longer redirects based on its session marker; /login and /dashboard retain their existing auth guards. Other auth, SSO, onboarding and dashboard implementations are preserved.
- Unverified customer counts/ratings/testimonials, a fake demo-submission confirmation and unavailable download links from the old marketing source are not presented as verified/live functionality on the new landing. Public mobile releases are marked pending.
- Original marketing supporting components in home remain where other existing routes may use them. Canonical landing page ownership is now split; this is not a wholesale relocation of the home app's authentication/dashboard code.
- Build repair: purchases-workspace amount_paid referenced a nonexistent totals.grandTotal field in pre-existing dirty work. A one-token correction uses the actual totals.total field without replacing surrounding user edits.

## Backups
/Users/pankaj/Desktop/Saaszo/_backups/site-split-20261105/home-before.tar.gz
/Users/pankaj/Desktop/Saaszo/_backups/site-split-20261105/invoice-before.tar.gz

These preserve pre-change source, including existing Invoice edits. No .env or private credentials were copied into the public artwork directories.

## Validation and delivery
- Both production builds passed, including TypeScript and route generation.
- Local root pages and Invoice /login returned HTTP 200; unauthenticated Invoice /dashboard returned 307 to product login.
- Canonical URLs checked in rendered HTML.
- Browser checked both desktop pages, Invoice at 390px, and existing Invoice login. No authenticated production login or financial operation was performed.
- React review: pages are server components, page-only CSS modules isolate styles, focus indicators/reduced-motion support included, no fake request forms or synthetic production metrics added.
- Changes are local. No GitHub push, Vercel deployment or DNS change performed. Live domain behavior remains unchanged until deployment.
