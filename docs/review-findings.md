# Review Findings

## P1 – Restore `.env*` Ignore
- Path: `.gitignore` lines 33-35.
- Issue: The `.env` ignore rule was commented out, which means any `.env*` files (often containing Supabase/API secrets) will now be tracked and committed.
- Impact: Credentials stored locally would be exposed in git history, creating an immediate security regression.
- Needed Action: Reinstate the `.env*` ignore entries (or an equivalent safe pattern) so secret files remain untracked.

## P2 – Missing ESLint Configuration
- Path: `eslint.config.mjs` (file deleted).
- Issue: The lint script (`npm run lint`) still invokes `eslint`, but the configuration file was removed.
- Impact: Running the lint command will fail with “ESLint couldn't find a configuration file,” breaking local and CI lint workflows.
- Needed Action: Restore an ESLint configuration (either the previous file or an updated equivalent) or adjust the lint script to point to a valid config.
