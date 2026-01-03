# Repository Guidelines

## Project Structure & Module Organization
`src/app` houses the App Router; domain folders (dashboard, logs, pantry, etc.) include their own route, loading, and layout files. Shared UI lives in `src/components`, contexts in `src/context`, helpers/Supabase clients in `src/lib`, and types in `src/types`. Tailwind globals stay in `src/app/globals.css`, while `public/`, `supabase/`, and `scripts/` hold assets, SQL/migrations, and automation.

## Build, Test, and Development Commands
Install via `npm install`. Use `npm run dev` for hot reload during development, `npm run lint` to check code quality (configured in `.eslintrc.json`), and `npm run build && npm start` for production validation. Note: `npm run build` integrates ESLint and TypeScript checks—it will fail on lint errors. Apply Supabase migrations before testing branches that touch data.

## Standard Workflow
1. Start `npm run dev` to get rapid visual feedback (ignores lint errors, enabling fast iteration). 2. Verify the affected UI flow visually in the browser. 3. Run `npm run lint` to catch code quality issues. 4. Run `npm run build` for full production validation (type-check + lint + build). 5. Re-run data import scripts when migrations or pantry files change.

## Coding Style & Naming Conventions
Use TypeScript with React Server/Client components. Favor PascalCase component files (`src/components/BrewCard.tsx`), camelCase hooks/utilities, and SCREAMING_SNAKE_CASE only for environment constants. Keep components focused, extract reusable logic into `src/lib`, and rely on Tailwind utilities plus the CSS variables in `globals.css`; ESLint supplies formatting.

## Testing Guidelines
Every change must pass visual verification in `npm run dev`, then `npm run lint`, and finally `npm run build`. For UI changes, always test visually first—catch layout and interaction issues before worrying about lint. Colocate Jest + React Testing Library specs and Playwright `.spec.ts` files beside each route (for example `src/app/logs/__tests__/logs.spec.tsx`). Include screenshots or screen recordings for UI changes in PRs.

## Commit & Pull Request Guidelines
Write short, imperative commit subjects (`feat: add grinder calibration view`) and mention linked issues or migration IDs in the body. PRs should describe the user impact, list verification commands (`npm run dev`, `npm run lint`, `npm run build`), include visual evidence (screenshots/recordings) for UI tweaks, and stay tightly scoped.

## Supabase & Configuration Tips
Keep Supabase URL, anon key, and third-party tokens in `.env.local`. Run migrations from `supabase/migrations` sequentially, refresh pantry data with `scripts/parse_notion_to_sql.py` when beans or recipes change, and commit new migrations with the feature that depends on them.

## Architecture & Future Evolution
Favor self-contained domain modules under `src/app/<domain>` with their components, hooks, and loaders, while shared infrastructure lives in adapters (`src/lib/supabase`). Add feature flags or environment toggles for experiments and update `docs/` whenever a data contract changes.
