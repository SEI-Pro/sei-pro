# background — service worker (MV3)

**Fonte da verdade:** `src/background/` (não editar `dist/js/background*.js` à mão).
O build copia estes arquivos verbatim para `dist/js/` via `scripts/build.mjs`.

## Layout atual

| Arquivo | Papel |
|---|---|
| `background.js` | Fachada fina: `importScripts` + listeners `onInstalled` / `onMessage` |
| `router.js` | Roteamento de mensagens → handlers |
| `storage-handler.js` | `storageGet` / `storageSet` / `storageRemove` |
| `fetch-handler.js` | proxy `fetch` com validação de host |
| `bug-report-handler.js` | `enviarRelatorioBug` |
| `process-notification-handler.js` | badge / notificações de processos |
| `install-handler.js` | welcome page + flag `InstallOrUpdate` |

Ainda é **classic SW** (`importScripts`), não ESM bundlado. Isso é intencional enquanto
os handlers não compartilham módulos ESM com `core/`.

## Arquitetura

Contrato geral: `DEVELOPMENT.md` (camadas, isolated-first, `legacy-api`).
Programa de migração: `docs/engineering-loop.md` + board.
