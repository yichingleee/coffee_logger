# Coffee Logger

Coffee Logger is a Next.js 13 App Router project for tracking beans, brewing methods, grinders, and tasting logs. It ships with Supabase auth/storage helpers, Tailwind-based UI, and a dark “brew lab” aesthetic.

## Requirements

- Node.js 18+
- npm 9+ (ships with Node 18)
- A Supabase project (for auth + data) with the schema from `supabase/migrations`

You do **not** need Docker or a global Next.js install; everything runs through npm scripts.

## 1. Clone & Install

```bash
git clone <repo-url> coffee_logger
cd coffee_logger
npm install
```

> Tip: If npm asks about “found lockfile, do you want to install?”, choose Yes to keep dependency versions locked.

## 2. Environment Variables

Create a `.env.local` file in the project root. These variables are required by Supabase and Next.js server components:

```bash
cp .env.example .env.local   # if an example file exists
# otherwise create it manually:
echo "NEXT_PUBLIC_SUPABASE_URL=your-project-url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
```

At minimum you need:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= (only if running migrations/seeding)
```

Never commit `.env.local`; the `.gitignore` already keeps it out of git.

## 3. Supabase Setup

1. Install the Supabase CLI (`npm i -g supabase`).
2. Log in: `supabase login`.
3. Apply the migrations to your project:

```bash
supabase db push
# or run specific files:
supabase migration up --file supabase/migrations/001_initial_schema.sql
```

4. (Optional) Seed sample beans/logs:

```bash
supabase db seed --file supabase/seed_notion_beans.sql
```

## 4. Development Workflow

```bash
npm run dev       # starts Next.js on http://localhost:3000
npm run lint      # ESLint (extends next/core-web-vitals)
npm run build     # production build (runs type-check + lint)
npm start         # serves the production build
```

During development:

1. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).
2. Make UI changes and verify visually (the App Router supports hot reload).
3. Run `npm run lint` before committing to catch accessibility/performance issues flagged by `next/core-web-vitals`.
4. `npm run build` mirrors CI (type-check + lint + build); run it locally before pushing.

## 5. Logging In

The `/login` page is wired to Supabase Auth. You can sign up with email/password locally. If you need seed users, create them via the Supabase dashboard.

## 6. Project Structure

```
src/app/           # Next.js App Router routes
src/components/    # Reusable UI (brew wizard, timelines, dialogs, etc.)
src/context/       # Context providers (Units, etc.)
src/lib/           # Supabase helpers, actions, utilities
src/types/         # Database + domain typing
supabase/          # SQL migrations and seed scripts
public/            # Static assets
docs/              # Project & review docs
```

## 7. Troubleshooting

- **“ESLint couldn't find a configuration file”** – ensure `.eslintrc.json` exists (it should extend `next/core-web-vitals`). Reinstall node modules if necessary.
- **Supabase auth redirects to deployment URL** – update the URL in Supabase dashboard -> Authentication -> URL Configuration to match `http://localhost:3000`.
- **Dev server port already in use** – run `PORT=3100 npm run dev`.
- **Migrations failing** – run `supabase db reset` to wipe the local database and re-apply migrations, or inspect SQL files under `supabase/migrations`.

## 8. Deployment

1. Run `npm run build` locally; fix any errors.
2. Push to the `main` (or release) branch.
3. Deploy to Vercel/Netlify with the same environment variables you used locally.
4. Run Supabase migrations on the production database before exposing new schema-dependent features.

---

If you get stuck, create an issue in this repository with logs/screenshots. Happy brewing!