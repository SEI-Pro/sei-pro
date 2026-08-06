# Editor Modernization Plan — SEI 4.1

Full migration of the document-editor surface to the current extension architecture, plus a
rebuilt AI layer.

**Status:** implementação de código das fases 1–8 concluída (updated 2026-07-30).
Phase 3 decomposition finished — `body.js` removed, modules under
`adapter` / `domain` / `io` / `view` / `commands` / `templates`, native `lib/domq.js` (no jQuery
library), Filerobot replaced by `shared/ui/image-crop`, jQuery UI dialogs by `shared/ui/modal`,
entry at `src/entries/editor.js`. F1–F7 estão implementadas e cobertas por testes.
**Target platform:** SEI 4.1 (CKEditor 4). SEI 5 is explicitly out of scope; see §1.3.
Phase 9 live smoke for editor §3 is recorded complete in `SMOKE_TEST.md` (2026-08-06).
**Explicitly excluded:** the `mod-wssei` REST web service. Enabling it at PRF requires
per-unit authorization, which is not viable. Every data path in this plan reads the SEI
frontend with the user's own session, exactly as the extension does today.

Implementation status:
- Phases 1–4 and 6–8 are complete in code: editor/AI/legis are ESM bundles, the shared LLM
  stack supports six provider types, streaming and six read tools are wired, access
  guardrails are in place, and Options manages local BYOK profiles.
- Phase 3 (editor decomposition) is complete: no `features/editor/body.js`; boot via
  `adapter.js` + `src/entries/editor.js` → `dist/js/sei-pro-editor.js`; legis bundled with
  the editor entry (no `init.js` getScript for legis/moment/QR on the editor path).
- Phase 5 delivered draft snapshots with selective restore/diff, review metadata with
  accept-all-mine, searchable process fields, checklist with navigation and citation checks,
  complete Ctrl+K palette, unit snippets, and semantic diff.
- The six read tools, including `buscar_legislacao`, are implemented.
- Cursor is not a native provider. It is documented as an OpenAI-compatible custom profile
  for any organization-provided compatible base URL.
- Phase 9 editor §3 smoke is recorded complete (2026-08-06); remaining cross-surface
  release hardening outside that gate stays a human checklist.

---

## 1. Scope and premises

### 1.1 What this plan covers

| Area | Today | After |
|---|---|---|
| `src/features/editor/sei-pro-editor.js` | 8,194 LOC copied verbatim by `legacyFiles` | deleted; feature decomposed under `src/features/editor/` and built by esbuild |
| `src/features/ai/sei-pro-ai.js` | 2,525 LOC copied verbatim | deleted; rewritten as `src/features/ai/` + shared `src/core/llm/` |
| `src/features/legis/sei-legis.js` | copied verbatim, loaded by the editor | migrated with the editor (it only exists to serve the editor toolbar) |
| Editor libraries | 8 libs, ~3.2 MB, mixed CDN/eager/lazy | 3 libs vendored and lazily loaded, ~0.8 MB |
| Editor bootstrap | `init.js` → 4 sequential `$.getScript` | one `src/entries/editor.js` bundle declared in the manifest |
| AI providers | OpenAI, Gemini, Ollama, no streaming, no tools | 6 provider adapters, streaming, tool calling, SEI-styled output |
| Tests | 1 domain test (89 LOC) | domain + io + view + structure + provider contract suites |

### 1.2 Non-negotiable constraints

These come from `DEVELOPMENT.md` and must hold for every commit in this plan.

1. `src/` is the only source of truth. `dist/` is generated; never edited by hand.
2. Isolated-first. The CKEditor 4 editor bundle is the documented `MAIN` exception
   (injected by `editor-loader.js` because CKEditor belongs to the page). It exposes no
   runtime/storage/LLM APIs and uses a two-operation bridge (`snapshot` / `insertHtml`).
   No inline `onclick`.
3. Dependency direction: `features → shared/ui → core / sei / platform`. Never the reverse.
4. `aliasGlobal` appears only in `legacy-api.js`, and every alias carries a removal condition.
5. All new CSS classes are prefixed `.seipro-`.
6. Layer rules: `domain.js` is pure; `io.js` never touches the DOM; `view.js` never calls `io.js`.
7. `npm test` runs `scripts/build.mjs` first and must stay green at every commit.

### 1.3 Why SEI 5 is dropped rather than fixed

`sei-pro-editor.js:8192` gates the entire toolbar behind `if (!isSEI5())`. The file contains
51 `isSEI5()` branches — CKEditor 5 markup, Font Awesome icons, `.ck-toolbar__items`
selectors — that no code path reaches, plus an empty SEI 5 branch in `initContextMenuPro`.
That is roughly 900 LOC of unreachable, untested code.

Decision: migrate the CKEditor 4 behaviour only, and delete the unreachable SEI 5 markup.
The version seam survives in a single place — `src/features/editor/adapter.js` — so adding
CKEditor 5 later means writing one adapter implementation, not re-threading 51 ternaries
through the feature. **Before phase 1 starts, confirm on a real PRF instance that the SEI 5
toolbar is genuinely absent today**; if it is somehow working, this decision changes.

---

## 2. Target structure

```
src/
├── core/
│   ├── llm/                          # NEW — shared, feature-agnostic LLM layer
│   │   ├── providers/
│   │   │   ├── openai.js             #   OpenAI + any OpenAI-compatible endpoint
│   │   │   ├── anthropic.js          #   Claude (browser-direct header)
│   │   │   ├── gemini.js             #   Google Generative Language
│   │   │   ├── moonshot.js           #   Kimi (thin preset over openai.js)
│   │   │   ├── ollama.js             #   local models
│   │   │   └── index.js              #   registry: id → adapter + capabilities
│   │   ├── protocol.js               #   normalized request/response/tool shapes (pure)
│   │   ├── sse.js                    #   SSE frame parser (pure, heavily tested)
│   │   ├── client.js                 #   send/stream/cancel over platform/net-stream
│   │   ├── tools.js                  #   tool registry + JSON-schema validation (pure)
│   │   ├── budget.js                 #   token estimation, context trimming (pure)
│   │   └── credentials.js            #   key storage/retrieval facade
│   └── markdown/
│       └── html-to-markdown.js       # NEW — SEI HTML → Markdown (pure, shared)
│
├── shared/
│   ├── sei-styles.js                 # NEW — SEI CSS style dictionary (shared with options)
│   ├── process-context.js            # NEW — assemble process context from existing readers
│   └── ui/
│       ├── image-crop.js             # NEW — replaces Filerobot
│       ├── command-palette.js        # NEW — Ctrl+K over feature commands
│       ├── stream-panel.js           # NEW — streaming output + accept/discard/stop
│       └── (modal, tabs, combobox, tags-input, sortable, file-queue — existing)
│
├── features/
│   ├── editor/
│   │   ├── adapter.js                # the only place that knows CKEditor 4 internals
│   │   ├── domain/                   # pure: text, numbering, references, sumario, sigilo…
│   │   ├── io/                       # process data, document fetch, drafts, uploads
│   │   ├── view/                     # toolbar, dialogs, context menu, palette wiring
│   │   ├── commands/                 # one module per toolbar action
│   │   ├── templates.js
│   │   ├── legacy-api.js
│   │   ├── index.js
│   │   └── style.css                 # .seipro-editor-*
│   ├── ai/
│   │   ├── domain/                   # prompt assembly, citation parsing, diff (pure)
│   │   ├── io/                       # context gathering, tool execution
│   │   ├── view/                     # panel, inline mode, consent, provider settings
│   │   ├── tools/                    # SEI read tools exposed to the model
│   │   ├── index.js
│   │   └── style.css                 # .seipro-ai-*
│   └── legis/                        # migrated with the editor
│
├── entries/
│   └── editor.js                     # NEW — single bundle for the editor context
│
├── platform/
│   └── net-stream.js                 # NEW — long-lived Port for streamed responses
│
└── background/
    └── llm-handler.js                # NEW — performs LLM calls, streams frames back

vendor/
├── katex/                            # replaces latex.codecogs.com
├── mammoth/                          # moved out of dist/js/lib
└── qrcode/                           # small ESM lib, lazy
```

---

## 3. Library strategy

| Library | Current | Action | Replacement |
|---|---|---|---|
| Filerobot Image Editor | 1.2 MB, removed | **Removed** | `shared/ui/image-crop.js` — canvas crop, rotate, resize, quality. Covers the real usage; ~200 LOC |
| Mammoth | 627 KB, `$.getScript` from `dist/js/lib` | **Keep, relocate** | move to `vendor/`, load through the shared lazy loader |
| jQuery UI | 247 KB, lazy | **Remove from the editor** | `shared/ui/modal.js` + `tabs.js` + `combobox.js` already exist; other features keep loading it until they migrate |
| CodeCogs LaTeX | remote PNG per equation | **Remove** | KaTeX vendored; renders locally, no third-party call, no raster |
| TinyURL | external POST | **Remove** | SEI permanent link + QR code already cover the need; removing it also removes an internal-URL leak |
| Moment.js | ~70 KB, eager | **Remove from the editor** | `core/datas.js` already exists and is tested |
| jquery-qrcode | 25 KB, eager | **Replace** | small ESM QR generator in `vendor/`, loaded on first use |
| jQuery 3.7.1 | core | **Keep** | still required by other legacy blocks; the migrated editor must not use it |
| DOMPurify | core | **Keep** | mandatory for every `innerHTML` path |
| CKEditor 4 | provided by the SEI page | **Keep** | not ours; accessed only through `features/editor/adapter.js` |
| PDF.js / Tesseract | legacy AI full-text/OCR dependencies | **Removed** | the structured document reader replaced the only planned consumer; neither library has a runtime consumer |

Net effect: roughly 2.4 MB of third-party code leaves the editor context, and the remaining
libraries all load lazily through one shared helper covered by
`tests/structure/lazy-feature-libs.test.js`.

---

## 4. AI architecture

### 4.1 Provider matrix and how the user authenticates

There is no browser-friendly OAuth login for LLM inference at any of these vendors. Every
one of them expects an API key, and the ChatGPT/Claude web sessions are not usable as an API
credential. The industry pattern for extensions is **BYOK — bring your own key** — and that
is what this plan adopts.

| Provider | Endpoint | Auth | Streaming | Tools | Browser CORS |
|---|---|---|---|---|---|
| OpenAI | `https://api.openai.com/v1/chat/completions` | `Authorization: Bearer` | SSE | yes | allowed |
| Anthropic (Claude) | `https://api.anthropic.com/v1/messages` | `x-api-key` + `anthropic-version: 2023-06-01` | SSE | yes | requires `anthropic-dangerous-direct-browser-access: true` |
| Google Gemini | `.../v1beta/models/{model}:streamGenerateContent` | key in query string | SSE | yes (function declarations) | allowed |
| Moonshot / Kimi | `https://api.moonshot.ai/v1/chat/completions` | `Authorization: Bearer` | SSE | yes | OpenAI-compatible; `kimi-k3` accepts top-level `reasoning_effort` and requires echoing `reasoning_content` back on multi-turn |
| Ollama / local | user URL, default `http://localhost:11434/v1` | optional Bearer | SSE | model-dependent | local |
| OpenAI-compatible (custom) | user-supplied base URL | Bearer | SSE | declared per profile | depends on the endpoint |

**About Cursor.** Cursor does not publish a chat-completions API. `api.cursor.com` exposes
the Cloud Agents API (`POST /v1/agents`, runs, SSE stream) plus the SDKs, and the docs state
explicitly that it is an agent-run API, not standalone model inference — it is built to work
on a repository, which does not map onto "draft this despacho". The correct way to
accommodate it, and anything else the user may want, is the **OpenAI-compatible (custom)**
profile: base URL, key, model list. That same slot covers OpenRouter, LiteLLM, an internal
PRF gateway, and Cursor itself if they ever ship a compatible endpoint. This is documented in
the options page rather than shipped as a broken "Cursor" button.

**Recommended default:** ship the custom-profile slot as a first-class option and treat a
gateway (LiteLLM or OpenRouter) as the recommended setup for an institution, because it
centralizes billing, model policy and audit — an individual key per servidor does not scale
inside PRF.

### 4.2 Where the call happens, and where the key lives

Today AI calls are `XMLHttpRequest` from the content script, with the key mirrored into
`localStorage`, inside a page the SEI itself controls. That is the wrong place for a secret.

Target:

```
content script (editor)          background service worker            provider
──────────────────────           ─────────────────────────            ────────
ai/io/generate.js
  └─ platform/net-stream.js  ──►  background/llm-handler.js       ──►  POST /v1/... (stream)
       Port "llm"                   reads key from chrome.storage.local
       receives frames         ◄──  parses SSE, forwards frames    ◄──  SSE
```

Rules:
- The API key never enters the content script or `localStorage`. `core/llm/credentials.js`
  in the content script only ever sees `{ providerId, hasKey: true, model }`.
- Keys live in `chrome.storage.local`, not `sync` — secrets should not replicate across every
  browser the servidor signs into. Optional at-rest encryption with WebCrypto behind a
  passphrase, for users who want it.
- Hosts are requested at runtime via `optional_host_permissions` when the user saves a
  provider profile, with the permission prompt triggered by that click. The static
  `host_permissions` list stays minimal.
- `src/background/fetch-handler.js` keeps its allowlist for one-shot fetches; the streaming
  path is a separate handler with its own allowlist derived from configured profiles.

### 4.3 Process context — structured, not OCR

The former process-context pipeline generated a PDF of the entire process, ran pdf.js, and
fell back to Tesseract OCR. That path was slow, lossy, and produced an unlabelled wall of
text; it is no longer shipped.

Replacement, using readers the extension already has:

1. `io/tree.js` — read the árvore (`arvore_montar`) into `{ id, numeroSEI, tipo, data, unidade, nivelAcesso, src }`. `setDataDocs` and `arvore-info/io.js#fetchPage` already do most of this.
2. `io/document.js` — fetch one document's HTML by `src` and convert with `core/markdown/html-to-markdown.js`: clean tables, drop empty columns, keep numbering.
3. `shared/process-context.js` — assemble a labelled context. Each chunk is prefixed with its SEI number, type, date and unit, so the model can cite `Despacho 2843449` precisely instead of paraphrasing.
4. `core/llm/budget.js` — estimate tokens and trim by relevance (recency + the documents the user named), never by blind truncation. Report to the user what was included and what was dropped.
5. Session cache keyed by process number, mirroring the existing `sessionStorage fulltext_*` behaviour but storing structured chunks.

This keeps the AI path structured and leaves no PDF+OCR dependency in the extension runtime.

### 4.4 Tool calling

The case that motivates this work — *"the servidor filed a requerimento in document 2843449;
draft the despacho denying it, grounded on documents X and Y"* — requires the model to fetch
what it needs instead of the user pre-selecting it. Tools are **read-only** in this plan.

| Tool | Arguments | Returns |
|---|---|---|
| `listar_documentos` | — | tree of the current process with type, date, unit, access level |
| `ler_documento` | `numero_sei` | document body as Markdown, subject to the access gate |
| `dados_processo` | — | tipo, especificação, interessados, assuntos, observações, autuação |
| `historico_processo` | — | andamentos from `procedimento_consultar_historico` |
| `buscar_legislacao` | `termo` | results from the existing legislation search |
| `documento_atual` | — | the text currently in the editor, with paragraph numbering |

Execution rules:
- Tools run in the content script, because they need the SEI session cookies. The background
  orchestrates the loop; the content script executes and returns results.
- Hard cap on iterations (default 8) and on total fetched documents (default 15), both
  configurable, both surfaced in the UI.
- Every tool call is shown live in the stream panel: *"reading Despacho 2843449…"*. No hidden
  fetching.
- No write tools. Creating documents, signing, tramitar — all remain manual. The extension
  already does these through the UI, and write-side agency is a different risk class that
  this plan deliberately does not open.

### 4.5 Output as SEI-styled HTML

The model must return HTML using the SEI style dictionary, not prose. `shared/sei-styles.js`
holds the dictionary (`Paragrafo_Numerado_Nivel1`, `Item_Nivel1..4`, `Item_Alinea_Letra`,
`Item_Inciso_Romano`, and the rest), used in three places: the AI system prompt, a manual
style picker in the toolbar, and validation before insertion.

Pipeline: model output → schema/style validation → DOMPurify with an allowlist restricted to
the SEI dictionary → insert through `features/editor/adapter.js`. Numbering always comes from
CSS classes, never from typed text.

### 4.6 Access-level gate

Ported from the consent model in `mcp-seipro`:

- Documents at `nivelAcesso` 1 (restrito) or 2 (sigiloso) never have their raw content sent
  to a provider without an explicit, per-document confirmation from the user.
- The confirmation dialog names the document, the access level, the legal hypothesis, and the
  provider that will receive it.
- Confirmed content is prefixed with a disclaimer in the prompt itself.
- Metadata (type, date, unit) is not gated; only body content.
- A local audit log records provider, model, document numbers sent, and timestamp — visible
  to the user, never transmitted.
- Local providers (Ollama, an internal gateway) can be marked as trusted in the options page,
  which relaxes the gate to a single session-level confirmation.

`PRIVACY_POLICY.md` must be updated in the same phase, not after.

---

## 5. Feature work beyond the migration

Items from the audit that are implemented as part of this plan.

| # | Item | Where |
|---|---|---|
| F1 | Restore auto-save as **local draft snapshots** in IndexedDB with a restore panel, instead of the silent SEI save that is commented out today | `editor/io/drafts.js` |
| F2 | Track-changes with author, timestamp, and accept-all-mine | `editor/domain/review.js` |
| F3 | Searchable process-field inserter with live preview, replacing the fixed list of ~20 fields | `editor/view/dados-processo.js` |
| F4 | Pre-signature checklist: broken references, unresolved `#tags`, empty required fields, pending revisions | `editor/domain/checklist.js` |
| F5 | Command palette (Ctrl+K) over every editor command; the 38-icon toolbar stops being the only entry point | `shared/ui/command-palette.js` |
| F6 | Unit-level snippets/templates with placeholders, stored like favoritos | `editor/io/snippets.js` |
| F7 | Semantic diff between the current draft and a previous document of the process | `editor/domain/diff.js` |
| F8 | Delete dead surface: auto-save button (old version), `helpLegisButtom`, `getDialogSumarioDocumento_`, `getDialogLatex`, the SEI 5 markup | phase 1 |

---

## 6. Execution plan

Ten phases. Each is a reviewable unit with its own tests and exit criteria. Phases 1–3 are
strictly sequential; 4–7 can be parallelized across sessions once phase 3 lands.

### Phase 0 — Baseline and safety net

**Do:**
- Run the manual smoke of `SMOKE_TEST.md §3` on a real SEI 4.1 instance and record the
  results. This is the only regression net for 8.2k legacy LOC.
- Confirm the SEI 5 finding (§1.3) empirically.
- Capture a behavioural inventory: for each of the 38 toolbar buttons, one line describing
  observed behaviour. This becomes the acceptance checklist for phases 3–5.
- Tag the commit (`pre-editor-migration`) for diffing and rollback.

**Exit:** smoke recorded in `SMOKE_TEST.md`; inventory committed as
`docs/editor-behaviour-inventory.md`.
**Size:** hours. **Risk if skipped:** every later phase becomes unverifiable.

### Phase 1 — Prune before migrating

Deleting code now means never migrating, testing or reviewing it later.

**Do:**
- Remove F8's dead surface, including the ~900 LOC of unreachable SEI 5 markup.
- Remove the CodeCogs and TinyURL calls, with their buttons.
- Make the QR code library lazy.
- Update `pages/SALVAMENTOAUTOMATICO.md` — it currently advertises a feature that is
  commented out — and note the F1 rebuild.

**Tests:** `npm test` green; `tests/structure/lazy-feature-libs.test.js` extended to assert
the QR library is not loaded eagerly.
**Exit:** `sei-pro-editor.js` under ~7,000 LOC with no behaviour change on the smoke checklist.
**Size:** ~1 day.

### Phase 2 — Shared foundations

Everything here is independent of the editor and testable in isolation, so it lands first.

**Do:**
- `src/core/llm/` — `protocol.js`, `sse.js`, `tools.js`, `budget.js`, provider adapters.
- `src/core/markdown/html-to-markdown.js`.
- `src/shared/sei-styles.js`.
- `src/platform/net-stream.js` + `src/background/llm-handler.js`.
- `src/shared/ui/image-crop.js`, `command-palette.js`, `stream-panel.js`.
- `vendor/katex`, `vendor/mammoth`, `vendor/qrcode` + the shared lazy loader.

**Tests:**
- `tests/core/llm/sse.test.js` — frame splitting, partial chunks, `[DONE]`, malformed input,
  Anthropic `input_json_delta` accumulation.
- `tests/core/llm/protocol.test.js` — normalization round-trip per provider.
- `tests/core/llm/providers/*.test.js` — request shape per provider against recorded fixtures;
  no network.
- `tests/core/llm/budget.test.js` — trimming keeps the named documents.
- `tests/core/markdown/html-to-markdown.test.js` — real SEI HTML fixtures, including tables
  with empty columns and numbered paragraphs.
- `tests/shared/ui/*.test.js` — jsdom for the three new primitives.
- `tests/structure/background-llm-handler.test.js` — mirrors the existing background handler
  structure tests.

**Exit:** all suites green; nothing wired into a page yet, so risk is zero.
**Size:** the second-largest phase.

### Phase 3 — Editor big-bang lift

Follow the pattern already used for `atividades`.

**Do:**
- `src/entries/editor.js` composing core + platform + the editor feature.
- Decompose into `adapter.js`, `domain/`, `io/`, `view/`, `commands/`, `templates.js`,
  `legacy-api.js`, `index.js`.
- Replace jQuery UI dialogs with `shared/ui/modal.js`; replace `moment` with `core/datas.js`;
  replace Filerobot with `shared/ui/image-crop.js`.
- Register the bundle in `scripts/build.mjs`, add it to the editor block in
  `manifest.base.json`, and remove `src/features/editor/sei-pro-editor.js` from `legacyFiles`.
- Delete the monolith.

**Tests:**
- `tests/features/editor/domain/*.test.js` — one suite per domain module.
- `tests/features/editor/io/*.test.js` — mocked fetch against SEI HTML fixtures.
- `tests/features/editor/view/*.test.js` — jsdom for toolbar assembly and delegation.
- `tests/structure/editor-legacy-api.test.js` — extended to the full alias surface.
- `tests/structure/editor-css-prefix.test.js` — all classes `.seipro-`.
- `tests/structure/manifest-order.test.js` — the editor block loads the new bundle in the
  right position.
- `tests/structure/no-duplicate-core.test.js` — nothing redefined in legacy files.

**Exit:** `legacyFiles` no longer contains the editor; the full 38-item behaviour checklist
passes on a real instance; `npm test` green.
**Size:** the largest phase. Do not split it across two releases — a half-migrated toolbar is
worse than either end state.

### Phase 4 — Legis migration

`sei-legis.js` exists only to serve the editor toolbar, so it follows immediately.

**Do:** decompose to `domain/io/view`, keep the external `seipro.app/legis/search.php`
endpoint behind `io.js` with a timeout and an offline fallback, add citation
short-form logic (`Lei nº 8.112, de 1990` on repeat references) as pure domain code.
**Tests:** domain suite for citation formatting and short-form rules; io suite with a mocked
endpoint including the failure path.
**Exit:** `sei-legis.js` out of `legacyFiles`.

### Phase 5 — Editor feature work

F1 through F7 from §5, one commit each, each with its own domain tests. F1 (draft snapshots)
and F4 (pre-signature checklist) first — they are the highest value per line of code and
neither depends on AI.

### Phase 6 — AI rewrite

**Do:**
- `src/features/ai/` rebuilt on `core/llm/`; the duplicated `sendRequestAI` inside the editor
  is deleted rather than ported.
- Streaming into `shared/ui/stream-panel.js` with stop, retry, accept, and discard.
- Inline mode (`+gpt` keyword) reimplemented on the same client.
- Structured process context (§4.3) replacing the PDF+OCR pipeline.
- Delete `sei-pro-ai.js` from `legacyFiles`.

**Tests:** prompt-assembly domain suite; a fake streaming provider exercising the full client;
cancel mid-stream; provider error and rate-limit paths; jsdom suite for the panel.
**Exit:** whole-document generation streams visibly and can be cancelled; no OCR in the path.

### Phase 7 — Tool calling and SEI-styled output

**Do:** the six read tools of §4.4, the orchestration loop with its caps, live display of each
call, output validation against `shared/sei-styles.js`, insertion through the adapter.
**Tests:** tool-schema validation; loop termination under a forced-loop model; refusal when
caps are hit; HTML validation rejecting non-dictionary classes; insertion round-trip in jsdom.
**Exit:** the motivating case works end to end without the user pre-selecting documents.

### Phase 8 — Guardrails, options, and documentation

**Do:**
- Access-level gate (§4.6) with per-document confirmation and the local audit log.
- New options section: provider profiles (id, base URL, key, model, trusted flag), caps,
  system instruction, keyword, runtime host-permission request on save.
- Fix the Ollama persistence gap in `external-config/index.js`.
- Update `PRIVACY_POLICY.md`, `pages/FERRAMENTASIA.md`, `DEVELOPMENT.md` (stack table),
  `README.md`, `CHANGELOG.md`.

**Tests:** `tests/options/domain.test.js` extended to the new profile shape;
`tests/structure/options-page.test.js`; a gate suite proving restricted content cannot reach a
provider without confirmation — this one is a hard gate, treat a failure as a release blocker.

### Phase 9 — Hardening and release

**Do:** full `SMOKE_TEST.md §3` rerun with new AI-specific items; performance check on editor
page load before and after; error-path review (provider down, key invalid, session expired
mid-tool-loop); `docs/engineering-loop-board.md` updated to close `E-editor-toolbar`.
**Exit:** smoke recorded, no `legacyFiles` entry for editor, ai, or legis, `npm test` green.

---

## 7. Testing strategy

| Layer | Tool | What it covers | Where |
|---|---|---|---|
| Pure domain | vitest | text extraction, numbering, references, citations, prompt assembly, token budget, SSE parsing, HTML→Markdown, style validation | `tests/features/editor/domain/`, `tests/core/llm/` |
| IO | vitest + fixtures | SEI HTML parsing, document fetch, drafts, provider request shapes | `tests/features/editor/io/`, `tests/core/llm/providers/` |
| View | vitest + jsdom | toolbar assembly, event delegation, modal behaviour, stream panel states | `tests/features/editor/view/`, `tests/shared/ui/` |
| Structure | vitest | legacy-api surface, CSS prefix, manifest order, no duplicate core, lazy libs, background handlers | `tests/structure/` |
| Contract | vitest | one recorded request/response fixture per provider, asserted against the adapter | `tests/core/llm/providers/` |
| Manual smoke | human | the 38-item behaviour checklist + AI flows on a real SEI 4.1 instance | `SMOKE_TEST.md` |

Rules: no network in any automated test; SEI HTML fixtures live in
`tests/fixtures/sei/` and come from real pages with identifying data removed; every provider
adapter ships with a fixture on the same commit; the access-gate suite is a release blocker.

---

## 8. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| CKEditor 4 timing — the current code polls with 9,000 ms retry budgets in nine places | Toolbar silently missing | `adapter.js` uses `MutationObserver` on the editor container instead of polling; one timing strategy, one place to fix |
| Big-bang phase 3 regression | High-traffic surface breaks | Phase 0 behaviour inventory as the acceptance checklist; single release, no half-migrated toolbar |
| Provider API drift | AI stops working after a vendor change | Adapters isolated behind `protocol.js`; contract fixtures fail loudly in CI |
| Cost and rate limits | Servidor exhausts a personal key on one long process | Token budget with a pre-flight estimate shown before sending; caps on documents and iterations |
| Restricted content leaking to a provider | Legal exposure under LGPD/LAI | §4.6 gate, blocking test, audit log, documented in the privacy policy |
| Model hallucinating a legal basis | Wrong despacho signed | Citations always resolve to a real SEI number or a real legislation link; unresolved citations are marked in the inserted HTML; output is a draft requiring review, stated in the UI |
| Scope creep into write tools | Different risk class entirely | Explicitly out of scope; revisit only after phases 0–9 ship and are in use |

---

## 9. Definition of done

- `scripts/build.mjs` has no `legacyFiles` entry for `editor`, `ai`, or `legis`.
- `src/entries/editor.js` is the only editor script the manifest loads, after `core-stack`.
- No editor code imports jQuery, jQuery UI, or Moment.
- Every editor and AI CSS class carries the `.seipro-` prefix.
- `legacy-api.js` is the only file in either feature calling `aliasGlobal`, and each alias has
  a written removal condition.
- Six provider profiles configurable from the options page; keys only in
  `chrome.storage.local`, only read by the background worker.
- Generation streams, can be cancelled, calls read tools with visible progress, and inserts
  SEI-styled HTML.
- Restricted-document content cannot reach a provider without explicit per-document
  confirmation, proven by a test.
- `SMOKE_TEST.md §3` fully recorded on SEI 4.1.
- `npm test` green.
