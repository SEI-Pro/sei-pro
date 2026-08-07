# background — service worker (MV3)

**Fonte da verdade:** handlers em `src/background/` e a raiz de composição em
`src/entries/background.js` (não editar `dist/js/background*.js` à mão). O build
empacota a entry em `dist/js/background.js` e copia os handlers classic verbatim.

## Layout atual

| Arquivo | Papel |
|---|---|
| `../entries/background.js` | Raiz de composição: `importScripts` + listeners `onInstalled` / `onMessage` |
| `router.js` | Roteamento de mensagens → handlers |
| `storage-handler.js` | `storageGet` / `storageSet` / `storageRemove` |
| `fetch-handler.js` | proxy `fetch` com validação de host |
| `llm-handler.ts` | streaming/completion de provedores LLM, bundled em `js/llm-handler.js` |
| `bug-report-handler.js` | `enviarRelatorioBug` |
| `process-notification-handler.js` | badge / notificações de processos |
| `install-handler.js` | welcome page + flag `InstallOrUpdate` |

Ainda é **classic SW** (`importScripts`), não ESM bundlado. Isso é intencional enquanto
os handlers não compartilham módulos ESM com `core/`.

## Arquitetura

Contrato geral: `DEVELOPMENT.md` (camadas, isolated-first, `legacy-api`).
Decisões: [`docs/adr/`](../../docs/adr/README.md).
Programa de migração: [`docs/implementation-plan.md`](../../docs/implementation-plan.md).
