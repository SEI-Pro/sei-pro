# Policy baseline — 003-capability-inventory-gaps

**Date**: 2026-08-10

## Counts (pre/post implement)

| Item | Value |
|------|-------|
| Feature descriptors | 37 |
| Maturity (from scan) | 14 exclusive / 17 wired / 6 declared (architecture.md) |
| `pages/*.md` | 78 |
| Schema keys | 74 |
| Allowlist `SCHEMA_FEATURE_WITHOUT_DESCRIPTOR` | `telemetry` |
| Allowlist `NULL_CONFIGKEY_ALLOWED` | 15 ids |
| Allowlist `CONFIG_KEY_FEATURE_OWNER_OVERRIDES` | 4 keys |
| Map anchors | inventory / gaps / exceptions in `docs/capabilities-map.md` |

## Commands

```bash
npx vitest run tests/structure/capability-coverage.test.js tests/structure/capabilities-map-inventory.test.js
node -e "import('./scripts/lib/parse-capabilities-map.mjs').then(m => console.log(m.parseCapabilitiesMap().inventory.entries.length))"
npm run verify
```

## Notes

- Parser: `scripts/lib/parse-capabilities-map.mjs`
- Allowlists: `scripts/lib/capability-coverage-allowlists.mjs`
- Pre-003 map was partial prose only; now expanded with machine anchors.
