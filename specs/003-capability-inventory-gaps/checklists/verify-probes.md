# Verify probes — 003-capability-inventory-gaps

Intentional faults (revert after observing). Expected: structure tests fail closed.

| Probe | Action | Expect |
|-------|--------|--------|
| Phantom feature | Add inventory entry with `descriptorId: "no-such-feature"` | C2 fail |
| Orphan page | Add `pages/_ORPHAN_PROBE.md` without map reference or gap evidence | C5 fail |
| Drop known gap | Remove `gap-telemetry-folder` from gaps YAML | C8 fail |
| Illegal maturity gap | Add `type: maturity` for an `exclusive` capability with no FR-013 evidence | C9 fail |
| Undocumented allowlist | Add null-configKey feature id without exceptions entry | C7 / coverage fail |

Green path: `npm run verify` with map intact.
