# ADR-0005 — Raiz de composição por contexto com injeção explícita; `SeiPro` vira fachada de compatibilidade

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0002, ADR-0004, ADR-0006, ADR-0012

## Contexto

O objeto global `SeiPro` funciona hoje como **service locator**: o módulo não recebe seus
colaboradores, ele os busca em runtime num objeto global. Medido em 2026-08-07: **338**
referências a `SeiPro.` e **50** arquivos chamando `getSeiPro()`.

Isso inverte o Dependency Inversion Principle em vez de aplicá-lo. A dependência continua
concreta e agora também é invisível: a assinatura da função não diz do que ela precisa, e
a falta de uma dependência só aparece em runtime, na página do SEI, como `undefined`.

O próprio código de boot demonstra o problema. `src/app/boot.js` monta um objeto `deps` e o
passa para `install`, mas a checagem de configuração dentro dele ignora esse objeto e vai
buscar no global:

```9:18:src/app/boot.js
function isFeatureEnabled(configKey) {
    if (!configKey) return true;
    const config = getSeiPro().core && getSeiPro().core.config;
    if (!config || typeof config.verifyConfigValue !== 'function') return true;
```

Enquanto o global for o meio normal de obter um colaborador, não existe incentivo para
injetar nada: injetar dá mais trabalho e o global sempre funciona. É por isso que a
migração para ESM parou em 65% dos arquivos com `import` enquanto os globais seguiram
crescendo — os dois mecanismos coexistem e o mais fácil ganha.

O custo se paga também em teste: dos 184 arquivos de teste, os que tocam feature precisam
montar o namespace global antes (`tests/helpers/load-seipro.js`, `load-core.js`), em vez de
simplesmente passar um duplo de teste.

## Decisão

**Cada contexto de execução tem uma raiz de composição em `src/entries/<contexto>.js` que
constrói os adapters concretos e os injeta nas features.** A feature recebe o que precisa
como argumento e nunca busca dependência em global.

```js
// src/entries/lista.js — raiz de composição do contexto "lista"
import { createRuntime } from '../platform/runtime.js';
import { createStorage } from '../platform/storage.js';
import { createSeiAdapter } from '../sei/index.js';
import { createLogger } from '../platform/logger.js';
import { loadConfig } from '../core/config.js';
import { bootContext } from '../app/boot.js';

const deps = {
    storage: createStorage(),
    net: createNet(),
    messaging: createMessaging(),
    logger: createLogger({ scope: 'lista' }),
    sei: createSeiAdapter(),
    config: await loadConfig(),
    clock: { now: () => Date.now() },
    document
};

bootContext('lista', deps);
```

Regras operacionais:

- Ports em `src/platform/` são **factories** (`createX(...)`), não instaladores que mutam
  global. Cada port tem adapter real e adapter fake para teste.
- Nenhum módulo em `core/`, `sei/`, `platform/`, `shared/` ou `features/` chama
  `getSeiPro()`. Quem precisa de config, storage, logger ou relógio, recebe.
- `boot` repassa `deps` inteiro; a checagem de `configKey` usa `deps.config`, não global.
- Injetar o relógio (`clock`) e o `document` é regra, não zelo: é o que torna prazos,
  feriados e view testáveis sem congelar tempo global nem depender de jsdom implícito.

**`SeiPro` passa a ser exclusivamente uma fachada de compatibilidade** para call-sites
legados ainda não migrados. Consequências:

- É publicado em **um** lugar por contexto — a raiz de composição —, montado a partir do
  `deps` já construído. Nenhum módulo se auto-registra no global.
- Tem condição de morte explícita: quando o último bloco de manifest gordo morrer
  (ADR-0004), a fachada morre com ele.
- O contrato público de feature `SeiPro.features.<id>.api` (ADR-0004) continua válido
  enquanto houver consumidor legado; entre módulos migrados, a comunicação é por injeção
  ou por composição na raiz.

Migração incremental, por contexto, com ratchet decrescente sobre `getSeiPro()` (ADR-0008).

## Consequências

**Ganhamos:** DIP real — a assinatura passa a declarar as dependências, e a falta de uma é
erro de construção na raiz, não `undefined` numa página do SEI; teste sem montar namespace
global, passando fakes (o efeito colateral mais valioso: os 42 arquivos acima de 500 linhas
são difíceis de testar hoje sobretudo por causa disso); ordem de inicialização explícita e
legível num arquivo, em vez de emergente da ordem do manifest.

**Pagamos:** verbosidade na raiz de composição, e um período em que os dois mecanismos
coexistem — que é o risco central deste ADR, porque é exatamente o que travou a migração
anterior. Mitigação: o ratchet sobre `getSeiPro()` é o portão, não a boa vontade.

**Fica proibido:** `getSeiPro()` em código novo; port que se instala mutando global;
módulo que se auto-publica em `SeiPro`; ler configuração de global quando `deps.config`
está disponível.

## Verificação

- Ratchet de `getSeiPro()` em `src/`, baseline **50 arquivos**, só pode diminuir (ADR-0008).
- Ratchet de `SeiPro.`, baseline **338** ocorrências, só pode diminuir.
- `tests/structure/composition-root.test.js` — `getSeiPro()` e escrita em `SeiPro`
  aparecem apenas em `src/entries/`, `src/app/publish-feature.js` e arquivos
  `*legacy-api.js` (ADR-0012).
- `tests/structure/ports.test.js` — todo módulo em `src/platform/` exporta uma factory
  `createX` e tem um fake correspondente em `tests/fakes/`.

## Alternativas consideradas

**Container de DI (inversify e similares)** — peso e indireção injustificados para uma
extensão com um punhado de ports. Injeção manual na raiz de composição dá o mesmo
benefício sem dependência nova nem metaprogramação.

**Manter o service locator, mas com interface tipada** — melhora o autocomplete e não
resolve nada do que importa: a dependência continua implícita, o teste continua exigindo
namespace global, e a ordem de inicialização continua emergente.

**Big bang: remover todos os globais de uma vez** — inviável com 338 referências e 24
arquivos legados copiados verbatim que dependem deles por contrato. Strangler fig por
contexto é a única rota que mantém a extensão funcionando a cada passo.
