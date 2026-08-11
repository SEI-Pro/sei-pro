# Contract: ACL & Render Safety

**Feature**: `004-migrate-infoarvore`  
**Consumers**: `arvore-info` views/IO; `src/sei/`; structure tests ACL

## Purpose

Garantir que conhecimento do SEI e HTML derivado do SEI não contaminem o meio da feature (constituição III / FR-011).

## Rules

1. **Selectors & version forks** used by the panel MUST live in `src/sei/` (or be imported from there). Feature modules MUST NOT grow new hardcoded SEI selectors; existing allowlist entries in structure tests MUST shrink as code moves.
2. **Untrusted input**: DOM nodes, fetched HTML documents, URL params, and inline script payloads from SEI are untrusted at the boundary. Parse layers emit normalized strings/lists/objects.
3. **Render**:
   - Default: `textContent` / `createElement` / shared UI primitives.
   - Re-hosting SEI HTML fragments MUST go through **central ACL sanitization** — never string-concatenate SEI-derived HTML into `innerHTML`.
4. **Encoding**: Preserve correct display of Latin-1 SEI pages (current ISO-8859-1 decode behavior or equivalent) so users do not see mojibake regressions.
5. **Network**: Same-origin SEI `fetch` + credentialed session in the tree content script remains allowed; no new external hosts or permissions.

## Verification

- `tests/structure/sei-acl.test.js` (or successor): allowlist for `arvore-info` tends to empty
- Feature tests: parse fixtures → normalized content; render helpers refuse raw HTML concat paths
- Manual: strings com acentos/interessados especiais legíveis (quickstart)
