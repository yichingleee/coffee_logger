# Tech Debt Tracker

| ID | Area | Description | Priority | Status |
|----|------|-------------|----------|--------|
| TD-001 | Testing | No unit or integration tests; only smoke tests exist | High | Open |
| TD-002 | CI/CD | No GitHub Actions workflow; relies on manual `npm run check` | Medium | Open |
| TD-003 | Auth | `NEXT_PUBLIC_BYPASS_AUTH` env var bypasses middleware; fine for dev but risky if leaked | Low | Open |
