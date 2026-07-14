---
name: sei-pro-prf-refactoring-loop
description: >-
  Maker/checker engineering loop for migrating SEI Pro PRF from legacy scripts
  to the src/ architecture (epics + P0–P7 ladder). Use when running Hermes cron
  migration or verification jobs for sei-pro-prf.
---

# SEI Pro PRF — refactoring loop skill

## Canonical docs (this repo)

- Policy: `docs/engineering-loop.md`
- Board + Epic queue: `docs/engineering-loop-board.md`
- Job prompts: `docs/engineering-loop-prompts.md`
- Architecture: `DEVELOPMENT.md`
- Next slice: `node scripts/engineering-loop-next.mjs`

## Mode

Detect from the user/cron message:

- **migration / maker** → use the Migration prompt in `docs/engineering-loop-prompts.md`
- **verification / checker** → use the Verification prompt in the same file

## Hard rules

1. `src/` is source of truth; never hand-edit `dist/`.
2. One slice per run; one functional commit tagged `[sei-pro-prf-loop]`.
3. Follow Epic queue + ladder P0–P7. **Do not** pick CSS micro-hooks while P1–P5 epic work is open.
4. P1+ must add/extend Vitest tests.
5. Never claim manual smoke passed without human/browser evidence.
6. Do not port code from `/home/tadeu/Repos/sei-pro-prf-arquitetura-extensoes`.

## Before selecting work

```bash
node scripts/engineering-loop-next.mjs
```

## Gates

```bash
git status --short
git diff --check
npm test
node scripts/engineering-loop-map.mjs --check
```

Checker additionally:

```bash
node scripts/engineering-loop-next.mjs --check-board
```

## Sync note

If this skill is copied into Hermes (`~/.hermes/skills/...`), keep it aligned with
`docs/engineering-loop-prompts.md` in the repository after policy changes.
