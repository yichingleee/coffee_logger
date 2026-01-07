# Vercel Deployment Plan

This plan assumes the repo is already on GitHub and uses Supabase.

## 1) Prep locally

1. Ensure env template exists and matches what you use locally:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (only if server-side admin/migrations are needed)
   - Optional: `NEXT_PUBLIC_BYPASS_AUTH` for non-auth previews
2. Run a quick build to catch TypeScript/lint issues:
   ```bash
   npm run build
   ```
3. Push your latest changes to the default branch (e.g., `main`).

## 2) Create the Vercel project

1. Go to https://vercel.com/new.
2. Import the GitHub repo for this project.
3. Framework preset should auto-detect **Next.js**.
4. Build settings (defaults are fine):
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## 3) Configure environment variables

In the Vercel project settings, add the following:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (only if needed server-side)
- Optional: `NEXT_PUBLIC_BYPASS_AUTH` (set to `true` only for preview builds if desired)

If you use different values for preview vs production, set them per environment.

## 4) Deploy

1. Click **Deploy** and wait for the build to finish.
2. Copy the production URL.

## 5) Update Supabase auth URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: set to the Vercel production URL.
- **Redirect URLs**: add the production URL and any preview URLs (if you want auth to work on previews).

## 6) Verify the app

1. Open the production URL in a browser.
2. Log in or sign up to verify auth flow.
3. Navigate through `/dashboard`, `/logs`, `/pantry`, and `/grinders` to confirm middleware-protected routes work.

## 7) Optional: Vercel CLI (useful for linking and preview)

```bash
npx vercel
```

Follow the prompts to link to the existing project. After linking, you can deploy preview builds via:

```bash
npx vercel --prebuilt
```

## 8) Ongoing workflow

- PRs will get automatic preview URLs from Vercel.
- Keep Supabase migrations in sync with production before enabling new data-dependent features.

