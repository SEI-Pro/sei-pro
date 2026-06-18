# Plano de Migração de Arquitetura — SEI Pro PRF

> Documento de planejamento técnico para evolução arquitetural da extensão.
> Versão base analisada: **1.7.16** · Data: **2026-06-17**

---

## 1. Contexto

A extensão **SEI Pro PRF** é um fork da extensão SEI Pro original, adaptado às necessidades
da PRF. Por ter crescido por acréscimo, acumulou dívida arquitetural. Este documento
registra o **diagnóstico baseado em evidências** e um **plano de migração faseado**,
incremental e de baixo risco, mantendo o `dist/` funcional a cada passo.

**Restrições do projeto (do CLAUDE.md):**
- Não há build system, package manager nem framework de testes.
- Todo o código-fonte vive em `dist/` e é carregado pelo navegador como está.
- Suporta Chrome, Firefox e Edge (Manifest V3), SEI 4.0+ e 5.x.

---

## 2. Diagnóstico (evidências verificadas)

### 2.1 Escala
| Arquivo | Linhas | Funções top-level |
|---|---:|---:|
| `sei-pro-atividades.js` | 26.758 | 488 |
| `sei-functions-pro.js` | 14.358 | 594 |
| `sei-pro-editor.js` | 8.259 | 205 |
| `sei-pro.js` | 4.226 | 151 |
| **Total do projeto** | **~70.657** | **~1.300+** |

### 2.2 Problemas confirmados

1. **~1.300 funções no escopo global puro.**
   Em `sei-functions-pro.js`, a IIFE inicial fecha na linha 109; as 594 funções e 99
   `var/const` restantes vivem em escopo global (coluna 0), sem encapsulamento.

2. **Duplicação real por copy-paste (achado mais grave).**
   - **29 nomes de função** definidos em mais de um arquivo.
   - `getUrlExtension` — helper "core" citado no CLAUDE.md — **copiado em 5 arquivos**
     (`init_all.js`, `init_db.js`, `init.js`, `init_arvore.js`, `init_visualizacao.js`).
   - `getParamsUrlPro`, `capitalizeFirstLetter`, entre outros, duplicados entre arquivos.
   - **Não existe um módulo compartilhado real** — há cópias que podem divergir.

3. **Ramificação de versão espalhada (~263 pontos).**
   `isNewSEI` aparece **194 vezes** e `isSEI_5` **69 vezes** no projeto. Cada uma é um
   `if` a revisitar a cada mudança do SEI.

4. **Storage e rede dispersos.**
   16 chamadas diretas a `chrome/browser.storage` e 26 a `fetch/ajax` espalhadas pelos
   content scripts. O service worker (`background.js`, 251 linhas) está subutilizado.

5. **God modules.**
   `sei-pro-atividades.js` (488 funções) e `sei-functions-pro.js` (594 funções) misturam
   config, storage, detecção de versão, DOM, rede e utilidades.

### 2.3 Violações de SOLID

| Princípio | Violação |
|---|---|
| **SRP** | `sei-functions-pro.js` é um "God module": tudo em um arquivo. |
| **OCP** | Suporte a nova versão do SEI exige editar 263 `if (isNewSEI/isSEI_5)`. |
| **DIP** | Lógica de negócio depende direto de `chrome.storage`, jQuery e DOM concreto. |
| **Acoplamento** | Qualquer arquivo lê/escreve globais de qualquer outro; ordem no manifest é dependência implícita. |

### 2.4 Conclusão — a tese central

Arquitetura atual = **monólito global carregado por content scripts**, com dependência forte
de ordem no `manifest`, DOM do SEI, jQuery, storage e rede espalhados.

**O problema principal não é "não usar classes" nem "não ter SOLID".** SOLID, aqui, é
sintoma — não causa. A causa raiz é a **falta de fronteiras claras entre camadas**:

```
core  ·  adapters do SEI  ·  features  ·  storage/rede  ·  bootstrapping
```

Reformular o objetivo como "estabelecer essas fronteiras" (em vez de perseguir um checklist
de SOLID) aponta diretamente para a solução: **separação de camadas**. Cada violação de
SOLID listada em 2.3 desaparece como consequência natural de criar essas fronteiras.

Funciona hoje, mas cada feature aumenta acoplamento e risco de regressão. Retorno de
refatorar é alto.

---

## 3. Princípios da migração

1. **Incremental, sem big-bang.** `dist/` permanece funcional após cada commit.
2. **Rede de segurança primeiro.** Sem testes, refator é cego.
3. **Valor a cada fase.** Dá para pausar entre quaisquer fases.
4. **Compatibilidade preservada.** Aliases temporários evitam quebrar chamadas antigas.
5. **Ordem por retorno/risco.** Fases 0, 1 e 3 são as de melhor relação custo/benefício.

---

## 4. Arquitetura-alvo

A meta é evoluir para uma estrutura com **fronteiras explícitas por camada**, sem big-bang:

```
dist/js/
  core/
    runtime.js        shim browser/chrome, getURL, manifest
    config.js         checkConfigValue, getConfigValue, options
    storage.js        abstrações sync/local/session
    messaging.js      wrapper de runtime.sendMessage (transporte)
    logger.js
  sei/
    version.js        detecta SEI 4/5
    adapter.js        seletores e diferenças por versão
    urls.js           parsing/construção de URLs do SEI
  features/
    processos/
    arvore/
    editor/
    atividades/
    favoritos/
    projetos/
    ai/
  init/
    all.js
    main-list.js
    tree.js
    editor.js
    viewer.js
```

A camada **`sei/`** é intencionalmente separada de `core/`: as diferenças de versão do SEI
são um eixo de mudança independente do resto e merecem isolamento próprio.

### 4.1 Namespace sem build (ponte até a Fase de bundler)

Mesmo antes de adotar um bundler, dá para simular essas fronteiras com namespaces globais
controlados, carregados em ordem pelo `manifest`:

```js
window.SeiPro = window.SeiPro || {};
SeiPro.core = SeiPro.core || {};
SeiPro.sei = SeiPro.sei || {};
SeiPro.features = SeiPro.features || {};
```

Isso entrega as fronteiras lógicas desde cedo e **desacopla o build (Fase 5) das demais
fases** — o bundler passa a ser uma troca de mecanismo, não um pré-requisito.

### 4.2 Decisão: storage/rede via messaging

`core/messaging.js` é o **transporte** (wrapper de `runtime.sendMessage`).
`core/storage.js` e a fachada de rede são as **APIs de domínio** que os content scripts
consomem — e que **podem** delegar a execução real ao service worker via `messaging`.

São abordagens **concorrentes, não complementares**: storage/rede roda no content script
*ou* é delegado ao service worker. A migração (Fase 4) deve escolher explicitamente —
caso contrário "storage" e "messaging" viram mais uma fronteira ambígua. Recomendação:
delegar ao service worker (`background.js`, hoje subutilizado) para centralizar credenciais,
CORS e quotas num só lugar.

---

## 5. Plano faseado

### Fase 0 — Rede de segurança (pré-requisito)
**Objetivo:** poder refatorar com confiança.
- Adicionar **Vitest** (dev-only; não vai para `dist/`).
- Escrever testes para funções **puras** já existentes:
  `compareVersionNumbers`, `getParamsUrlPro`, parsing de datas/feriados, queries de config.
- **Saída:** ~30–40 testes cobrindo os utilitários mais reusados.
- **Risco:** nenhum (não toca código de produção).

> **Interdependência Fase 0 ↔ Fase 1.** As funções puras vivem hoje em escopo global,
> dentro de arquivos de 14k–26k linhas acoplados ao DOM/jQuery — não há como importá-las
> isoladamente para testar. Na prática, **testar `getParamsUrlPro` exige antes movê-la
> para `core/`** (Fase 1). Por isso as Fases 0 e 1 andam juntas: extrair um helper puro e
> escrever seu teste no mesmo passo. Não trate a Fase 0 como 100% independente.

> **Guard-rail de regressão.** Como não há testes de integração para um monólito acoplado
> ao DOM, há um **smoke test manual mínimo por página do SEI** (lista de processos, árvore,
> editor, visualização) como *gate* entre cada fase — registrado em **`SMOKE_TEST.md`**.
> Execute-o (após `npm run build`) antes de fechar qualquer fase em produção.

### Fase 1 — Eliminar duplicação (maior retorno imediato)
**Objetivo:** uma única definição por função.
- Consolidar as **29 funções duplicadas**. Começar por `getUrlExtension` (5 cópias).
- Criar `js/seipro-core.js`, carregado **primeiro** em todos os content scripts do
  `manifest.json`; remover as cópias dos `init_*.js`.
- **Saída:** `grep` de nomes duplicados volta vazio.
- **Risco:** baixo (protegido pela Fase 0).

### Fase 2 — Namespace único ✅ concluída
**Objetivo:** acabar com globais soltos.
- Introduzir `window.SeiPro = { state, config, version, dom, util, net, storage }`
  (já há embrião: `SeiProReady`, `SeiProTree`).
- Migrar os `var` globais de estado compartilhado de `sei-functions-pro.js` para
  `SeiPro.state`, mantendo os globais legados funcionando.
- **Saída:** estado compartilhado acessível via `SeiPro.state.*`.
- **Risco:** médio (fazer por lotes).

> **Implementado.** O bloco de estado mutável compartilhado de `sei-functions-pro.js`
> (31 globais: `dadosProcessoPro`, `configGeralObj`, `ganttProject`, flags de UI, etc.)
> é registrado via `SeiPro.linkStateAll([...])`. O helper `SeiPro.linkState` (em
> `core/namespace.js`) cria um **link vivo** com `Object.defineProperty` (get/set) entre
> `SeiPro.state.<name>` e o global legado — não um snapshot. Isso evita o bug de
> divergência quando o código legado **reatribui** (`globalVar = novoValor`): ambos os
> lados ficam sempre em sincronia. O `var` legado continua sendo o backing store único.
> Coberto por `tests/core/namespace.test.js` (live sync nos dois sentidos + idempotência).

### Fase 3 — Adapter de versão do SEI (resolve OCP) ✅ concluída (migração + smoke)
**Objetivo:** isolar diferenças SEI 4.x/5.x.
- Criar `SeiPro.version` / `seiAdapter` encapsulando as ~263 ramificações
  `isNewSEI`/`isSEI_5`, expondo seletores neutros (ex.: `SeiPro.dom.divInformacao()`).
- Substituir os `if (isNewSEI)` por chamadas ao adapter, arquivo por arquivo.
- **Benefício:** próxima versão do SEI = um arquivo a editar, não 263 pontos.
- **Risco:** médio; altíssimo valor de manutenção.

> **Implementado — 219 call-sites migrados.** O adapter expõe predicados neutros:
> `SeiPro.sei.adapter.isNewSEI()`, `.isSEI5()`, `.atLeast(v)` e `.pick(novo, legado)`,
> cobertos por testes. Os usos do identificador global `isNewSEI`/`isSEI_5` foram
> substituídos por `SeiPro.sei.adapter.isNewSEI()` / `.isSEI5()` em **10 arquivos**:
> `sei-functions-pro.js` (69), `sei-pro-editor.js` (51), `sei-pro.js` (29),
> `sei-pro-all.js` (26), `sei-pro-atividades.js` (24), `sei-pro-favoritos.js` (10),
> `sei-pro-docs-lote.js` (5), `init.js` (3), `init_all.js` (1), `init_db.js` (1).
>
> **Por que a forma `isNewSEI() ? A : B` e não `pick(A, B)` em massa:** `pick(A, B)`
> avalia **ambos** os ramos de imediato; trocar uma ternária por `pick` muda a semântica
> quando algum ramo tem efeito colateral, chama função ou acessa DOM que só existe numa
> versão. A substituição do **predicado** (`isNewSEI` → `SeiPro.sei.adapter.isNewSEI()`)
> preserva a avaliação preguiçosa e é semanticamente idêntica — roteando o call-site pelo
> adapter sem risco. `pick`/`atLeast` ficam disponíveis para casos de seleção pura de valor.
>
> **Decisões de escopo (intencionalmente fora do lote):**
> - **Linhas de declaração** dos globais legados (`var isNewSEI = ...` em `init.js`,
>   `init_all.js`, `sei-functions-pro.js`) **permanecem** — são o backing store ligado a
>   `SeiPro.state` via `aliasState`; o adapter lê esse estado.
> - `sei-pro-arvore.js` **não migrado**: roda dentro do iframe `ifrArvore` e lê
>   `parent.isNewSEI` (a detecção válida está na janela-pai). O adapter no contexto do
>   iframe não detecta versão de forma confiável, então os `parent.isNewSEI` ficam como estão.
> - `sei-pro-ai.js` (2 sites) e `sei-pro-arvore-boot.js` ficam para um próximo lote.
>
> **Verificação:** `node --check` OK nos 10 arquivos; `npm test` verde. **Smoke test em
> produção (Chrome, SEI 5.x PRF) executado em 2026-06-18 — PASSOU** (lista, árvore, editor;
> ver SMOKE_TEST.md). Pendente apenas Firefox/SEI 4.x.

### Fase 4 — Centralizar storage e rede ✅ storage · 🟡 rede remota (piloto feito)
**Objetivo:** aplicar DIP nas dependências externas.
- Fachadas `SeiPro.storage` e `SeiPro.net` encapsulando `chrome.storage` e `fetch`,
  delegando ao **service worker** (`background.js`) via `core/messaging.js`
  (ver decisão em §4.2 — delegação, não execução no content script).
- Migrar as chamadas dispersas.
- **Objetivo secundário — reduzir jQuery na camada de rede.** A fachada `SeiPro.net` deve
  ser baseada em `fetch`, **não** apenas um wrapper de `$.ajax`. Embrulhar `$.ajax`
  perpetuaria a dependência do jQuery; migrar para `fetch` aqui é o primeiro passo para
  desacoplar a rede do jQuery sem mexer no resto da UI.
- **Risco:** médio.

> **Implementado (storage).** Todos os acessos diretos a `chrome/browser.storage`
> em `init.js` (`showAutoReportNoticePro`, get/set local) e `init_db.js`
> (`setOptionsSEIPro`, `getOptionsSEIPro`, transição de base — 5 call-sites) passam pela
> fachada `SeiPro.core.storage`, que delega ao service worker. Padrão adotado:
> **facade-com-fallback** (tenta a fachada; cai para `chrome/browser.storage` direto se o
> namespace ainda não carregou), idêntico ao `loadConfigPro` pré-existente. Em `init_db.js`
> os helpers `storageSyncGetPro`/`storageSyncSetPro` centralizam esse padrão. Verificação:
> `grep` por `chrome/browser.storage` fora de `core/`+`background.js` retorna apenas os
> fallbacks; `node --check` OK nos arquivos editados.
>
> **Em andamento (rede remota) — piloto feito.** A fachada `SeiPro.core.net.fetch`
> delega ao service worker via `core/messaging.js`. Dois ajustes de infra:
> 1. **Allowlist do SW ativada.** `SEI_PRO_FETCH_ALLOWED_HOSTS` (em `background.js` e
>    `src/background/index.js`) deixou de ser vazia: contém `generativelanguage.googleapis.com`.
>    A lista é mantida **enxuta** — só entra host que um call-site migrado realmente usa
>    (o SW roda com host permissions; allowlist aberta = proxy cross-origin para qualquer
>    script injetado).
> 2. **Semântica da fachada corrigida.** `fetchRequest` antes **lançava** em qualquer
>    `response.ok === false`, descartando o body — quebrando o caminho de erro de APIs que
>    retornam a mensagem no corpo (ex.: Gemini num 400). Agora resolve qualquer resposta
>    HTTP completa (incl. 4xx/5xx) e só rejeita em falha de **transporte** (URL bloqueada,
>    erro de rede), espelhando a semântica de `fetch()`. Coberto por `tests/core/net.test.js`.
>
> **Piloto migrado:** `resolveCaptchaAI` (`sei-functions-pro.js`) — POST JSON ao Gemini
> `generateContent`, antes via `XMLHttpRequest` direto. Agora usa `SeiPro.core.net.fetch`
> com **facade-com-fallback** (cai para o XHR legado se o namespace não carregou). Escolhido
> por ser auto-contido e ter corpo JSON replicável byte-a-byte (sem a serialização de
> form-array do jQuery, que torna `$.ajax` arriscado de migrar às cegas).
>
> **Pendente.** As demais ~130 chamadas `$.ajax`/`fetch` são em maioria **same-origin** ao
> próprio SEI (precisam da sessão in-page — **não** devem ir ao SW). As remotas restantes:
> Google Apps Script (Sheets, `script.google.com`), busca de legislação (`seipro.app/legis`,
> com serialização form-array do jQuery — exige cuidado) e o **streaming** de IA
> (OpenAI/Gemini via XHR incremental) — este último **não** migra para a fachada one-shot
> atual sem antes a fachada suportar streaming. Próximo lote vai junto da saída gradual do
> jQuery na rede.
>
> Os dois `fetch` restantes em `init.js`/`init_db.js` carregam **recursos locais da
> extensão** (`chrome-extension://…` via `getUrlExtension`) e **intencionalmente não** passam
> pela fachada — rotear leitura de arquivo local pelo SW não traz benefício.

> **RISCO CONHECIDO (dois mundos × fachadas de extensão).** O bundle roda em dois
> mundos (decisão documentada em `src/content/core-stack.js`): isolado (tem `chrome.*`)
> e MAIN da página (arquivos via `$.getScript`; **não** tem `chrome.*`). As fachadas
> `SeiPro.core.messaging`/`storage`/`net` dependem de `chrome.runtime`/`chrome.storage`
> e por isso **rejeitam no mundo MAIN** (erro explícito desde `messaging.js`). Hoje não
> quebra porque os call-sites migrados rodam no mundo isolado. Quando um call-site do
> mundo MAIN precisar de storage/SW, a solução é uma **ponte MAIN→isolado**
> (`window.postMessage`/CustomEvent). Ela **não** foi construída ainda de propósito: uma
> ponte incondicional deixaria scripts da própria página do SEI forjarem requisições que
> o mundo isolado repassaria ao SW (escalada de privilégio). A ponte deve vir com um
> call-site real e **validação de origem/envelope**, não especulativamente. Vigiar no
> smoke test (`SMOKE_TEST.md`).

### Fase 5 — Build step (habilitador de módulos) ✅ concluída (esbuild)
**Objetivo:** permitir `import/export` reais.
- Bundlar a camada `core/`+`sei/` (ESM em `src/`) num único IIFE legível.
- Substituir os 12 scripts `js/core/*`+`js/sei/*` por um bundle no manifest.
- **Risco:** médio-alto (por isso vem depois, com o código já limpo).

> **Implementado com esbuild (não Vite/CRXJS).** A 1ª tentativa (Vite + `@crxjs`) foi
> **revertida** porque usava `outDir === dist/` e o plugin minificava os arquivos legados
> **in-place**, destruindo a fonte legível (`sei-functions-pro.js` 14.358 → 22 linhas). A
> 2ª tentativa corrige a causa raiz com um build cirúrgico:
>
> - **`npm run build`** (`scripts/build.mjs`) roda **esbuild** bundlando **apenas**
>   `src/content/core-stack.js` → `dist/js/core-stack.bundle.js` (formato **IIFE, sem
>   minificação** — 744 linhas legíveis) e copia `manifest.base.json` → `dist/manifest.json`.
>   **Nenhum** arquivo legado, lib vendor, CSS ou o service worker passa pelo bundler — a
>   fonte legível nunca é sobrescrita in-place. `npm run dev` faz o mesmo em watch.
> - O **manifest** (`manifest.base.json`, fonte única; `dist/manifest.json` é cópia) passou
>   a referenciar **`js/core-stack.bundle.js`** como primeiro script de cada um dos 9 blocos
>   de content script, no lugar dos 12 `js/core/*`+`js/sei/*`. O bundle é carregado **antes**
>   do jQuery (verificado: nenhum módulo core usa `$` em tempo de install; só leituras lazy).
> - **`src/` é a fonte única** da camada core/sei (ESM com `import`/`export`). Os diretórios
>   duplicados `dist/js/core/` e `dist/js/sei/` (IIFE) foram **removidos** — resolvendo a
>   duplicação `src/core` vs `dist/js/core` apontada na deferral anterior.
> - **Service worker fora do escopo desta fase** (decisão explícita): `dist/js/background.js`
>   permanece verbatim como fonte da verdade; `src/background/index.js` (ESM dormente) será
>   reconciliado e bundlado num lote futuro.
> - **Testes:** `pretest` roda o build; os helpers Vitest (`load-core`, `load-seipro`) agora
>   carregam o **bundle** num sandbox `vm` em vez dos IIFE por-arquivo. Testes estruturais
>   atualizados (ordem do manifest exige o bundle; dedup deriva nomes migrados de
>   `src/` via `aliasGlobal`). 47 testes verdes.
> - **`scripts/generate-manifest-base.mjs` removido** (obsoleto — expandia os 12 scripts;
>   o `build.mjs` o substitui).
> - **`src/background/index.js` REMOVIDO (reconciliação feita).** Era funcionalmente
>   idêntico ao `dist/js/background.js` (só diferia em `var` vs `let/const` e estilo), sem
>   nenhum consumidor (build/manifest/testes não o referenciavam) — armadilha de divergência.
>   Deletado; `dist/js/background.js` é a fonte única do SW. Bundlá-lo via esbuild fica como
>   opção futura *se* ele passar a importar módulos de `core/`; hoje não importa nada.
>
> **Regressão corrigida durante a revisão — `loadStyleDesign`.** A consolidação das 5 cópias
> divergentes de `loadStyleDesign` numa única função parametrizada (`core/ui.js`) deixou os
> call-sites chamando-a **sem argumentos**, perdendo classes por página (`seiSlim_arvore`,
> `seiSlim_parent`/`seiSlim_view`, `seiBtnRight`/`seiIconLabel`, `seiSlim_html` + CSS extra de
> dark-mode + `initRepareBgTableColor()`). Os 4 `init_*.js` passaram a passar
> `(undefined, secondClass, options)` e o ramo `htmlExtras` foi portado ao core. Travado por
> `tests/core/ui.test.js` (a suíte não cobria efeitos de classe/DOM — por isso passou batido).
>
> **Smoke test executado em 2026-06-18 (Chrome, SEI 5.x produção PRF) — PASSOU.** Lista de
> processos, árvore (iframe) e editor carregaram sem erros no console após `npm run build` +
> reload (ver SMOKE_TEST.md). Confirmou também a correção do bug de dois mundos (bundle no
> `world:"MAIN"` + `getUrlExtension` resiliente). Pendente apenas Firefox/SEI 4.x.

> **Contrato de compatibilidade — `checkConfigValue`.** O `core/config.js` expõe
> `verifyConfigValue` e `getConfigValue`, mas **não** `checkConfigValue` — esta tem semântica
> distinta ("default-enabled" via `isDefaultEnabledConfigValue`) e segue só no legado
> (`sei-functions-pro.js`). Há ~9 usos; a extensão depende do legado permanecer carregado.
> Aceitável hoje; vira risco na Fase 6 (ao quebrar `sei-functions-pro.js`). Travado por
> `tests/structure/config-compat.test.js`.

### Fase 6 — Quebrar God modules em feature folders 🟡 piloto feito
**Objetivo:** SRP de verdade.

> **Piloto extraído — `core/validacao.js`.** Cluster coeso de 8 funções **puras**
> (validação/máscara de identificadores e texto) foi movido de `sei-functions-pro.js`
> para `src/core/validacao.js`: `validaCPF`, `extractCPFs`, `maskCPF`, `maskCNPJ`,
> `maskPEN`, `validateEmail`, `escapeHtml`, `isValidHttpUrl`. Registrado via
> `installValidacao()` em `core-stack.js` (`SeiPro.core.validacao` + `aliasGlobal` para
> cada nome — globais legados preservados). As 8 definições legadas foram removidas;
> `no-duplicate-core.test.js` agora as guarda. Coberto por `tests/core/validacao.test.js`
> (adicionado `URL` ao sandbox do `load-core.js`). **58 testes verdes.** Demonstra o padrão
> repetível para o resto da Fase 6: identificar cluster puro → mover para `src/` → alias →
> remover legado → testar.

- Dividir `sei-pro-atividades.js` e `sei-functions-pro.js` em pastas por responsabilidade:
  `features/kanban`, `features/gantt`, `core/config`, `core/dom`, `core/version`…
- **Atenção ao contrato `checkConfigValue`** (ver nota na Fase 5): ao mover/quebrar
  `sei-functions-pro.js`, portar `checkConfigValue` + `isDefaultEnabledConfigValue` para
  `core/config` antes de removê-los do legado, senão `config-compat.test.js` quebra (de
  propósito).
- **Risco:** alto isoladamente, **baixo agora** — chega protegido por testes, namespace,
  adapter e build prontos.

---

## 6. Resumo de retorno × risco

| Fase | Retorno | Risco | Recomendação |
|---|---|---|---|
| 0 — Testes | Alto | Nenhum | **Começar aqui** |
| 1 — Duplicação | Alto | Baixo | **Começar aqui** |
| 2 — Namespace | Médio | Médio | Sequência |
| 3 — Adapter versão | Alto | Médio | **Alto valor** |
| 4 — Storage/rede | Médio | Médio | Sequência |
| 5 — Build | Habilitador | Médio-alto | Quando limpo |
| 6 — Feature folders | Alto | Baixo (após 0–5) | 🟡 piloto `core/validacao.js` feito |

---

## 7. Próximos passos sugeridos
1. Iniciar **Fase 0 + Fase 1** juntas (Vitest + consolidar `getUrlExtension` como PoC).
2. Validar o ganho com a equipe antes de avançar para a Fase 2.
3. Tratar a **Fase 3 (adapter de versão)** como prioridade estratégica de manutenção.

---

## 8. Arquitetura de referência (MV3)
Não há padrão "oficial" único, mas a comunidade de extensões MV3 converge para:
- **Camada de mensageria** entre content scripts e service worker, centralizando rede/storage.
- **Build step** (esbuild/Vite + `@crxjs`) para módulos, tree-shaking e empacotamento.
- **Adapter pattern** para diferenças de ambiente/versão.
- **Feature folders** — cada funcionalidade como módulo isolado com sua própria init.
