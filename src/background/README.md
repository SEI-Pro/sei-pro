# background — ainda NÃO migrado para `src/`

Não procure aqui a fonte do service worker. **A fonte da verdade é
[`dist/js/background.js`](../../dist/js/background.js)** — mantida verbatim e
referenciada pelo `manifest.base.json` como `js/background.js`.

## Por quê

A migração para `src/` (camada core+sei bundlada por esbuild — Fase 5) cobre só os
**content scripts** (`src/content/core-stack.js`). O service worker ficou de fora
de propósito: hoje ele não importa nenhum módulo de `core/`, então bundlá-lo via
esbuild não traria ganho — só um segundo entrypoint e risco.

Existia aqui um `index.js` (reescrita ESM dormente). Foi **removido** porque era
funcionalmente idêntico ao `dist/js/background.js`, sem nenhum consumidor
(build/manifest/testes não o referenciavam) — uma armadilha de divergência (risco
de editar a fonte errada). Ver `PLANO_MIGRACAO_ARQUITETURA.md` §5 Fase 5.

## Quando migrar

Vale trazer o background para `src/` e adicioná-lo ao `scripts/build.mjs` **se** ele
passar a compartilhar módulos com `core/` (ex.: a allowlist de hosts, o wrapper de
storage). Aí o ganho de reúso justifica o segundo entrypoint do bundler.
