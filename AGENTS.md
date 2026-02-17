# Coffee Logger - Agent Guide

## Quick Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build (includes type-check + lint) | `npm run build` |
| Smoke tests | `npm run test:smoke` |
| Full gate | `npm run check` |
| Doc lint | `npm run lint:docs` |

## Standard Workflow

1. `npm run dev` — iterate visually
2. Verify UI flow in browser
3. `npm run lint` — code quality
4. `npm run build` — production validation
5. `npm run test:smoke` — runtime route check

## Project Layout

```
src/app/<domain>/      Domain routes (dashboard, logs, pantry, grinders, methods)
src/components/        Shared UI components
src/context/           React contexts (UnitContext)
src/lib/               Helpers, Supabase clients, server actions
src/types/             TypeScript types (auto-generated + domain)
supabase/migrations/   SQL migrations (apply sequentially)
scripts/               Automation (smoke tests, data import, doc lint)
```

## Conventions

- TypeScript, React Server/Client components
- PascalCase component files, camelCase utilities, SCREAMING_SNAKE for env constants
- Tailwind utilities + CSS variables from `src/app/globals.css`
- Commits: short imperative subjects (`feat: add grinder view`)
- PRs: describe user impact, include visual evidence for UI changes

## Key Docs

| Topic | Location |
|-------|----------|
| Product spec | [docs/product-specs/spec.md](docs/product-specs/spec.md) |
| Design system | [docs/design-docs/design-system.md](docs/design-docs/design-system.md) |
| Active plans | [docs/exec-plans/active/](docs/exec-plans/active/) |
| Completed plans | [docs/exec-plans/completed/](docs/exec-plans/completed/) |
| Tech debt | [docs/exec-plans/tech-debt-tracker.md](docs/exec-plans/tech-debt-tracker.md) |
| Generated docs | [docs/generated/](docs/generated/) |

## Supabase

- Env vars in `.env.local` (see `.env.example`)
- Run migrations from `supabase/migrations/` before testing data changes
- Refresh seed data: `python scripts/parse_notion_to_sql.py`
- Commit new migrations with the feature that depends on them
- Avoid pinning platform-specific SWC packages (breaks Vercel builds)
