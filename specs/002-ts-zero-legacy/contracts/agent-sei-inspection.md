# Contract: Agent SEI Inspection (Ephemeral)

**Feature**: `002-ts-zero-legacy`  
**Actors**: Coding agents and humans granting browser access

## Purpose

When UI/DOM of a real SEI page matters, agents MUST inspect via the integrated browser under human-granted access, without inventing page structure and without persisting page content (FR-011, FR-012, FR-016, User Story 5).

## Protocol

1. **Need?** If the task changes SEI page UI/DOM and current evidence is insufficient → inspection required.  
2. **Ask**: Request human access to SEI in the integrated browser (or confirm an already authorized session).  
3. **Inspect**: Read live HTML/DOM/accessibility tree as needed for markup/selector decisions.  
4. **Implement**: Apply findings inside exclusive modern architecture only (FR-012).  
5. **Do not persist**: MUST NOT write SEI HTML, screenshots, or process content into the repo, fixtures, tickets, or other durable artifacts.  
6. **If blocked**: Do not invent DOM; deliver only work that does not depend on guessed structure, or wait for access.

## Pass / fail signals

| Signal | Pass | Fail |
|--------|------|------|
| Access when needed | Asked / used integrated browser | Guessed selectors/structure without evidence |
| Persistence | No SEI page files in PR/workdir artifacts | HTML/PNG/fixture of SEI pages added |
| Legacy copy | Observed host DOM only; implemented modernly | Copied legacy jQuery/handlers into new code |

## Non-goals

- Automating SEI login or storing credentials.
- Replacing ACL (`src/sei`) with ad-hoc selectors outside the architecture.
- Committing “redacted” HTML dumps (clarification A: ephemeral only).
