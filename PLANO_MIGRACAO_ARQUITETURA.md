# Plano de Migração de Arquitetura — SEI Pro PRF

> Documento de planejamento técnico para evolução arquitetural da extensão.
> Versão base analisada: **1.7.16** · Data: **2026-06-17** · Atualizado: **2026-06-18** (§5.1 playbook)

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

> **Contrato de compatibilidade — `checkConfigValue` ✅ resolvido na Fase 6.** Antes
> `checkConfigValue`/`isDefaultEnabledConfigValue` viviam só no legado (`sei-functions-pro.js`),
> com semântica distinta ("default-enabled"). Foram **portados VERBATIM** para `core/config.js`
> (preservando a igualdade frouxa `== false` e a distinção `null` vs `false` da query jmespath —
> por isso não reusam `queryConfigValue`); a definição legada foi removida e o global preservado
> via `aliasGlobal`. `tests/structure/config-compat.test.js` foi **invertido**: agora trava que
> o core os provê e o legado não os redefine. Isso **destrava a quebra de `sei-functions-pro.js`**
> na Fase 6.

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
>
> **2ª fatia — `core/texto.js`.** Cluster de 6 utilitários puros de texto/string movido de
> `sei-functions-pro.js`: `escapeRegExp`, `escapeComponent`, `normalizeMojibakeUtf8`,
> `replaceTextToUrl`, `extractHexColor`, `pad`. Mesmo padrão (install + alias + remoção do
> legado + `texto.test.js`, 8 testes). **69 testes verdes.** Atenção registrada: a regex de
> `normalizeMojibakeUtf8` usa ranges `-¿` — preservada verbatim com escapes `\u`
> (reescrevê-la com caracteres literais mudaria a classe de caracteres e o comportamento).
>
> **3ª fatia — `core/cor.js`.** Conversão RGB↔hex (4 funções puras que se referenciam):
> `componentToHex`, `rgbToHex`, `rgbToHexString`, `hexToRgb`. Mesmo padrão + `cor.test.js`
> (6 testes). **75 testes verdes.** Acumulado da Fase 6: **18 funções** extraídas em 3 módulos
> (`validacao`, `texto`, `cor`).
>
> **4ª fatia — `core/datas.js`.** Formatação/duração de datas (5 funções): `getDatesFormatBR`,
> `randomDate`, `getRecentDateRow`, `calculeDatesDurationTemplate`, `calculeDatesDuration`.
> Primeira fatia com **dependência de lib vendor**: `moment` (+ plugin duration-format), lida
> como **global lazy** via `globalRef.moment` no momento da chamada (igual ao core com `$`).
> Os testes (`datas.test.js`, 10) carregam o `moment` REAL + plugin num contexto `vm` — mais
> fiel que stub. Excluídas de propósito `getDateSemantic`/`getDatesPreview`/`configDatesPreview`
> (puxam `getHolidayBetweenDates`/`jmespath`/DOM — acoplariam core↔legado; esperam um cluster
> de "feriados"). **85 testes verdes.** Acumulado: **23 funções** em 4 módulos.
>
> **5ª fatia — `core/feriados.js`.** Feriados nacionais BR + cálculo de Páscoa: `easterDay`,
> `getHolidaysBr`, `getHolidayBetweenDates`. Depende de `moment` e — só em
> `getHolidayBetweenDates` — de `$.merge`/`$.map` (a semântica de `$.map` descartando
> retornos null/undefined é intencional e preservada), ambos lidos como global lazy. Testes
> (`feriados.test.js`, 6) com `moment` real + stub mínimo de `$`. Esta fatia **destrava** o
> `getDateSemantic` (que dependia de `getHolidayBetweenDates`) para uma fatia futura — embora
> ele ainda puxe `jmespath` + plugins moment-weekday-calc. **91 testes verdes.** Acumulado:
> **26 funções** em 5 módulos (`validacao`, `texto`, `cor`, `datas`, `feriados`).
>
> **6ª fatia — `core/numeros.js`.** Números e matemática de array (8 funções puras):
> `arrayMax`, `arrayMin`, `toNumBr`, `isNumeric`, `roundToTwo`, `randomNumber`, `hasNumber`,
> `onlyNumber`. Sem dependências externas. `numeros.test.js` (8 testes). **99 testes verdes.**
> Acumulado: **34 funções** em 6 módulos.
>
> **7ª fatia — `getDateSemantic` → `core/datas.js`** (destravada pela fatia de feriados).
> Adicionada ao módulo `datas`, importando `getHolidayBetweenDates` de `feriados.js`
> (import **modular**, não via alias global) e usando o `calculeDatesDuration` local;
> `moment`/`jmespath` + plugins moment-weekday-calc (`isoWeekdayCalc`/`isoAddWeekdaysFromSet`)
> como globais lazy. Testes carregam todas as libs REAIS (moment + duration-format +
> weekday-calc + jmespath) num `vm`; cobrem o modo corrido (valores exatos) e o modo dias
> úteis (plugins + jmespath). **102 testes verdes.** Acumulado: **35 funções** em 6 módulos —
> e a 1ª fatia com **dependências internas entre módulos do core** (datas → feriados),
> mostrando que o padrão escala além de funções isoladas.
>
> **8ª leva — `core/serial.js` (novo) + extensões.** 12 funções puras: novo módulo
> `serial` (parse/serialização: `isJson`, `tryParseJsonObject`, `convertJsonBools`,
> `isBase64`); `texto` ganhou `extractEmails`, `extractAllTextBetweenQuotes`,
> `extractOnlyAlphaNum`, `joinAnd`; `numeros` ganhou `avgArray`, `reverseArray`, `toArray`,
> `decimalHourToMinute`. Sandbox de teste ganhou `btoa`/`atob` (faltavam no `vm`).
> **116 testes verdes.** Acumulado: **47 funções** em 7 módulos
> (`validacao`, `texto`, `cor`, `datas`, `feriados`, `numeros`, `serial`).
>
> **9ª leva — extensões puras.** +7 funções: `cor` (`addAlpha`, `getBrightnessColor`);
> `numeros` (`numberToLetter`); `texto` (`is_html`, `normalizeHTML`, `getHashTagsPro`,
> `normalizeNameTag` — esta importa `removeAcentos` de `util.js`, 2ª dependência inter-core).
> Cuidados pegos por teste: a regex zero-width de `normalizeNameTag` foi mantida com escapes
> `\u` explícitos; `addAlpha(_,0)` retorna `FF` (quirk `opacity||1`, verbatim). **123 testes
> verdes.** Acumulado: **54 funções** em 7 módulos.
>
> **10ª leva — feature "Controlar Prazos" (gerenciarprazos), 1ª fatia.** Início da
> migração **feature-orientada** (separar lógica pura de efeito DOM). O núcleo puro de
> cálculo de prazo `getRecalculaPrazo(data_ref, hora_format, prazo, config_unidade)` foi
> extraído de `sei-pro-atividades.js` para o novo `core/prazos.js` (importa
> `getHolidayBetweenDates` de `feriados`; `moment`+weekday-calc+`jmespath` lazy). A **camada
> de DOM** da feature (`setControlePrazo`, `addControlePrazo`, `initControlePrazo`,
> `updateTablePrazoProcesso`, `setPrazoMarcador`, `updateRecalculaPrazo`…) **permanece nos
> arquivos legados** chamando o core — é onde deve ficar (view layer). `prazos.test.js`
> (4 testes: dias corridos, dias úteis pulando fim de semana, feriado customizado).
> **127 testes verdes.** Acumulado: **55 funções** em 8 módulos. Marca a transição do
> "minério puro" para o desacoplamento por feature.
>
> **11ª leva — prazos, 2ª fatia (extração de bit puro de dentro do DOM).** `parsePrazoTag`
> — o parsing puro (regex) da string `onmouseover` do marcador de prazo (content / dateTo /
> dateTag) — foi extraído de **dentro** de `setControlePrazo` (sei-pro.js) para
> `core/prazos.js` (importa `removeAcentos` de `util`). O `setControlePrazo` agora chama
> `parsePrazoTag(_tag)` e mantém só o `moment(...)` + manipulação de DOM. Demonstra o passo
> seguinte do desacoplamento: **isolar lógica pura embutida em funções de DOM**, não só mover
> funções já puras. `prazos.test.js` +4 (com/sem hora, sem data, tag undefined). **131 testes
> verdes.** Acumulado: **56 funções** em 8 módulos.
>
> **Estado da feature "Controlar Prazos" (caso-guia da Fase 6).** O núcleo puro de prazos já
> vive em `src/core/prazos.js` (`getRecalculaPrazo`, `parsePrazoTag`), mas a feature ainda está
> **fisicamente espalhada** pelo legado — é o exemplo que o §5.1 usa para definir o método:
>
> | Arquivo legado | Ocorrências `Prazo` | Papel atual |
> |---|---:|---|
> | `sei-pro-atividades.js` | 55 | DOM/config da feature (`addControlePrazo`, `initControlePrazo`, `updateTablePrazoProcesso`, `updateRecalculaPrazo`, `changeAtivRecalcPrazoSwitch`, `configDatesSwitchChangePrazo`) |
> | `sei-functions-pro.js` | 44 | helpers de cálculo/config que o core ainda não absorveu |
> | `sei-pro.js` | 30 | `setControlePrazo` + `setPrazoMarcador` (marcador na lista de processos) |
> | `sei-pro-monitorados.js` | 4 | integração com monitorados |
> | `sei-pro-arvore.js` / `sei-pro-prescricoes.js` | 1 cada | consumo pontual |
>
> Próximas fatias de prazos seguem o **playbook do §5.1** abaixo.
>
> **12ª leva — prazos, fatia A (lógica pura embutida em view).** +3 funções puras extraídas
> para `core/prazos.js`, no padrão "isolar bit puro de dentro de função de DOM" (§5.1.3):
> - `parsePrazoTooltip(textTag)` — parse por regex do tooltip do marcador na lista de
>   processos (`ate DD/MM/YYYY` → `datePrazoDue`; data solta → `datePrazo`), extraído de
>   `updateTablePrazoProcesso` (`sei-functions-pro.js`). Importa `removeAcentos`; `moment` lazy.
> - `getDateBoxState(config, resultDate)` — cascata de decisão da etiqueta visual
>   (`date_seguinte`/`vencido`/`atrasado`/`hoje`/`entregue`…), extraída de `getDatesPreview`.
> - `getProgressPercent(config)` — cálculo do percentual de progresso (matemática de datas),
>   extraído de `getProgressPreview`; a montagem do SVG fica na view.
>
> Os 3 call-sites legados (`updateTablePrazoProcesso`, `getDatesPreview`, `getProgressPreview`)
> passaram a chamar o core; a montagem de HTML/SVG permanece na view. `prazos.test.js` +11
> (libs reais no `vm`). **142 testes verdes.** Acumulado: **59 funções** em 8 módulos. Restam
> da feature: portar `checkConfigValue` para `core/config` (destrava config/init) e apontar a
> view restante para o core — ver §5.1.5.
>
> **13ª leva — `checkConfigValue`/`isDefaultEnabledConfigValue` → `core/config.js`.** Porte
> VERBATIM da semântica "default-enabled" (recurso ligado a menos que explicitamente desligado),
> preservando a igualdade frouxa `== false` e a query jmespath que retorna `null` p/ ausente
> (por isso **não** reusa `queryConfigValue`, que colapsa ausente→`false`). Definições legadas
> removidas; globais preservados via `aliasGlobal`. `config-compat.test.js` invertido (core provê,
> legado não redefine) + 5 testes de comportamento em `config.test.js` (true/false explícito,
> ausente→true, nome default-enabled força true). **147 testes verdes.** Acumulado: **61 funções**
> em 8 módulos. Este é o **destravamento** das camadas C (config/switches) e D (init) da feature
> de prazos — e da quebra futura de `sei-functions-pro.js`.
>
> **14ª leva — feature "marcar como não visualizado" (`marcar_naolido`), núcleo puro.**
> Opção de config `marcar_naolido` ("Permitir marcar processos como Não Visualizado"). A feature
> tem 5 funções em `sei-functions-pro.js` (`setProcessoNaoLidoLoading`, `getSelectedProcessoNaoLido`,
> `failProcessoNaoLido`, `getProcessoNaoLido` — orquestrador AJAX) + o botão em `sei-pro.js`.
> A única lógica **genuinamente pura** é `isAjaxRedirectAction(xhr, action, origin)` — detecção
> de redirect do SEI via `xhr.responseURL` (usada 2× no orquestrador). Movida para
> **`sei/urls.js`** (interpreta URL de ação do SEI; usa `getParamsUrlPro`); legado removido,
> global via `aliasGlobal`. O resto (loading/seleção/alerta/orquestração AJAX + botão) é
> **view/DOM por definição** e permanece no legado chamando o alias (§5.1.1) — fica para
> `src/features/naolido/` quando o build bundlar `features/`. `urls.test.js` +5. **155 testes
> verdes.** Acumulado: **62 funções** em 8 módulos.
>
> > **Quirk travado por teste:** `getParamsUrlPro` só parseia URLs com `?` **e** `&` (ignora
> > param único). URLs de redirect do SEI sempre têm múltiplos params, então é seguro na prática;
> > os testes de `isAjaxRedirectAction` usam URLs realistas (com `&`) para refletir isso.
>
> **15ª leva — feature "Filtrar a página pela pesquisa rápida" (`filtrarpaginapelapesquisarapida`),
> núcleo puro.** Novo módulo **`core/quickfilter.js`** com o cluster puro coeso (5 funções) extraído
> de `sei-pro.js`: `normalizeFilterText`, `getFilterTokens` (normalização/tokenização do termo) e
> `getNormalizedIndexMap`, `mergeHighlightRanges`, `buildHighlightRanges` (cálculo das faixas de
> destaque em coords do texto **original**, tolerando diferença de comprimento por acentos via index
> map). Importa `removeAcentos`/`uniqPro` de `core/util`. Legados removidos; globais da página via
> `aliasGlobal` (`normalizeQuickPageFilterText`, `getQuickPageFilterTokens`, `getNormalizedIndexMap`,
> `mergeQuickPageHighlightRanges`, `buildQuickPageHighlightRanges`). A camada de DOM
> (`buildQuickPageFilterRowText`, `applyQuickPageFilterToControlTables`, TreeWalker/`highlight*`,
> `init*`) permanece no legado chamando o core. `quickfilter.test.js` +12. **167 testes verdes.**
> Acumulado: **67 funções** em 9 módulos.
>
> > **Quirk travado por teste:** `uniqPro` **ordena** o array (sort) antes de deduplicar — a ordem
> > dos tokens muda, mas é irrelevante para o matching (todo token precisa casar). Preservado verbatim.
> >
> **Unificação ÁRVORE ✅ (parte da mesma 15ª leva).** `sei-pro-arvore.js` tinha funções
> paralelas `QuickTree*` (mesma feature, dentro do iframe `ifrArvore`). Os 3 núcleos puros
> (`normalizeQuickTreeFilterText`, `getQuickTreeFilterTokens`, `buildQuickTreeHighlightRanges`)
> passaram a **delegar a `SeiPro.core.quickfilter`** via **facade-com-fallback** (delega ao bundle
> quando presente — caminho real no iframe, pois o bloco `init_arvore` do manifest carrega o
> core-stack lá; senão mantém o corpo legado como rede de segurança, respeitando o estilo defensivo
> do arquivo). Efeito colateral **positivo**: `buildQuickTreeHighlightRanges` usava coords do texto
> **normalizado** (sem index map) — um bug latente quando acentos mudam de tamanho; o core devolve
> coords **cruas**, compatível com o slice de `highlightQuickTreeTextNode` e **corrigindo** o caso.
> Para texto sem acento (nomes de documento típicos) o resultado é idêntico. `node --check` OK.
> **Pendente:** smoke test do filtro **na árvore** de um processo (gate de iframe — `SMOKE_TEST.md`).

> **16ª leva — feature "autopreencher senha no login" (`autopreenchersenha`).** Opção
> ("Autopreencher senha no login (SEI ≥ 4.0)"). A feature é quase toda DOM (esconde o
> `#pwdSenha` real, mostra/estiliza o campo visível, espelha o valor no change) e vive em
> `init_pwd.js` (`loadRepairPwdNewSei`). Os únicos bits **puros** são predicados de tipo de
> página: `isLoginPageNewSei` (`sip/login.php`) e o check inline `acao=documento_assinar`.
> Ambos extraídos para **`sei/urls.js`** como `isLoginPageNewSei(href)` /
> `isDocumentoAssinarPage(href)` (default `location.href`); `init_pwd.js` passou a usá-los pelos
> globais aliased. A camada DOM (`loadRepairPwdNewSei`) fica no legado (view). `urls.test.js` +5.
> **172 testes verdes.** Acumulado: **69 funções** em 9 módulos.
>
> > **Limpeza de código morto junto.** `init_db.js` tinha uma 2ª cópia (antiga, mais simples)
> > de `loadRepairPwdNewSei` com o **call-site já comentado** (dead code) — removida, junto com a
> > duplicação inline do check `sip/login.php`. A versão viva é a do `init_pwd.js`.
> >
> > **Smoke test pendente (login):** abrir a tela de login (SEI ≥ 4.0) com a opção ligada e
> > confirmar o autopreenchimento/máscara da senha; idem na tela `documento_assinar`.

> **17ª leva — feature "Mostrar anotação do processo na tela de controle de processos"
> (`mostraranotacaocontrole`), núcleo puro.** Novo módulo **`core/sticknote.js`** com o cluster
> puro (2 funções) extraído de `sei-pro.js`: `parseSticknoteHomeLabel` (parse por regex do rótulo
> `Anotação / <texto> / <usuário> em DD/MM/YYYY HH:MM`, importa `normalizeMojibakeUtf8` de
> `core/texto`) e `normalizeSticknoteHomeText` (normalização de quebras de linha/NBSP/espaços).
> Registrados via `installSticknote()` em `core-stack.js` (`SeiPro.core.sticknote` + `aliasGlobal`
> para os 2 nomes legados). Definições legadas removidas. A camada de DOM da feature
> (`replaceSticknoteHome`, `formatDadosAnotacaoHome`, `getSticknoteHome*`, `loadSticknoteHomePriority`
> via AJAX, `renderSticknoteHomeInline` — varredura das tabelas de processos, montagem de
> células/HTML, layout inline) **permanece em `sei-pro.js` chamando o core** (view por definição).
> `sticknote.test.js` +9. **181 testes verdes.** Acumulado: **71 funções** em 10 módulos
> (`validacao`, `texto`, `cor`, `datas`, `feriados`, `numeros`, `serial`, `quickfilter`, `prazos`,
> `sticknote`). Depois somou-se `parseSticknoteChecklistLine` (parse puro do item de checklist
> `[ ]`/`[X]`, antes embutido em `formatDadosAnotacaoHome`/`replaceSticknoteHome`), → **3 funções**
> no módulo; `sticknote.test.js` passou a 14. Acumulado parcial: **72 funções** em 10 módulos.
>
> > **Cuidado verbatim:** a regex de `parseSticknoteHomeLabel` (alternâncias `ç|c`/`ã|a`) e o
> > `.replace(/ /g, ' ')` (NBSP) foram preservados com escapes `\u` explícitos.
> >
> > **Smoke test (anotação) — PASSOU** em 2026-06-23 (Chrome, SEI 5.x produção PRF, via
> > Claude-in-Chrome): `SeiPro.core.sticknote` instalado, aliases ok, config `mostraranotacaocontrole`
> > ligada, 19 links de anotação / 19 células inline renderizadas, layout aplicado em 2 tabelas,
> > zero erros no console. Pendente apenas o console do **page-load** e Firefox/SEI 4.x.

> **18ª leva — feature "Enviar Múltiplos Documentos Externos" (`uploaddocsexternos`), núcleo
> puro.** Novo módulo **`core/docslote.js`** extraído de `sei-pro-docs-lote.js`. A feature é
> majoritariamente AJAX/jQuery/DOM/CSV (Papa) — a parte **pura** é o tratamento de caracteres:
> os 3 mapas (`docsLoteSpecialChars`, `docsLoteNormalCharsUtf8`, `docsLoteNormalCharsIso`,
> copiados **VERBATIM** com escapes `\u` e verificados byte-a-byte contra o legado) + 4 funções:
> `getDocsLoteNormalChars(encoding)`, `hasDocsLoteSpecialChars(text, encoding)`,
> `encodeDocsLoteSpecialChars(text)` e `parseDocsLoteDocTitle(docTitle)` (parse `nrSEI`/
> `nomeDocumento` do `<title>`). Registrados via `installDocsLote()` (`SeiPro.core.docslote` +
> `aliasGlobal` dos 3 mapas legados). Os call-sites ativos passaram a chamar o core:
> `docsLote_execute` (hasSpecialChars), `docsLote_editDocContent` (encode dos textareas/inputs +
> parse do título). Limpeza junto: removidas as declarações de mapa do legado e duas linhas
> mortas de `docsLote_normalChars`/`regex` em `docsLote_formNewDoc` (usadas só por código
> comentado). A camada de DOM/AJAX/diálogos/CSV permanece no legado chamando o core.
> `docslote.test.js` +12. **198 testes verdes.** Acumulado: **76 funções** em 11 módulos
> (`validacao`, `texto`, `cor`, `datas`, `feriados`, `numeros`, `serial`, `quickfilter`, `prazos`,
> `sticknote`, `docslote`).
>
> > **Smoke test pendente (docs em lote):** abrir o fluxo "Enviar Múltiplos Documentos Externos"
> > com a opção ligada, importar um CSV com nomes acentuados e gerar os documentos — confirmar
> > nomes na árvore e conteúdo com entidades HTML corretas (sem mojibake), nos dois ramos
> > SEI 4.x/5.x.

> **19ª leva — feature "Informações adicionais na árvore do processo" (`infoarvore`):
> avaliação + dedup.** Diferente das levas anteriores, **esta feature é view-by-definition**
> (§5.1.1): vive em `sei-pro-arvore-boot.js` (~2.230 linhas, IIFE auto-contido que roda DENTRO do
> iframe `ifrArvore`) e é quase inteiramente DOM/AJAX — painel lateral que busca e renderiza
> marcador, atribuição, acompanhamento, anotação, interessados, tipo/nível/assuntos. As funções
> `parse*`/`render*` recebem um **`document` já parseado** e o consultam (querySelector,
> createElement, listeners) — não há **lógica de domínio pura** testável sem navegador a extrair
> para o `core/`. É o mesmo "ponto de parada natural" documentado para Controlar Prazos (§5.1.5):
> manter no legado é o playbook sendo seguido, não dívida.
>
> **O ganho arquitetural disponível foi eliminar duplicação:** o boot tinha uma **cópia local
> byte-a-byte de `normalizeMojibakeUtf8`** (já existente em `core/texto`). Como o bloco
> `init_arvore` do manifest carrega o `core-stack.bundle.js` **no mesmo frame e mundo isolado**
> do boot (blocos 6 e 7, ambos `all_frames`, world default), `win.SeiPro.core.texto` é alcançável
> ali. A cópia local passou a **delegar** a `SeiPro.core.texto.normalizeMojibakeUtf8` via
> **facade-com-fallback** (mantém o corpo legado como rede de segurança contra corrida de carga —
> mesmo padrão da unificação da árvore na 15ª leva). Sem novas funções de core. `node --check` OK;
> **198 testes verdes** (a função delegada já é coberta por `texto.test.js`).
>
> > **Nota de cobertura:** `no-duplicate-core.test.js` só varre `function` de coluna 0; a cópia
> > do boot era **indentada** (dentro do IIFE), por isso passou batida — a dedup a remove de fato.
> >
> > **Smoke test (infoarvore dedup) — PASSOU** 2026-06-23 (Chrome, SEI 5.x): painel monta com
> > 9 seções, sem mojibake, delegação ao core OK.
>
> > ⚠️ **Revisão de estratégia (2026-06-23).** A conclusão "view-by-definition / dedup só" acima
> > foi **revista a pedido do usuário**: `infoarvore` é a funcionalidade **mais usada** e, sendo o
> > caso mais importante, justifica a migração completa para a nova arquitetura — ver **20ª leva**.

> **20ª leva — `infoarvore` migrada para `src/features/` (feature folder).** Decisão do usuário:
> migração **completa em etapas** + **reconciliação** dos caminhos old/new. Ativa o gatilho §5.1.2
> (build passa a bundlar `src/features/`). Feita em etapas, cada uma verde + smoke:
> - **A — Build enabler + porte verbatim.** `scripts/build.mjs` passou a ter **2 entry points**
>   (`core-stack` + `arvore-info`), gerando `dist/js/arvore-info.bundle.js` (IIFE, sem minificação).
>   O IIFE de `sei-pro-arvore-boot.js` foi para `src/features/arvore-info/index.js` **verbatim**;
>   `manifest.base.json` aponta para o bundle; arquivo legado **removido**. `manifest-order.test.js`
>   +2 (bundle referenciado; core-stack carrega antes no mesmo frame). Smoke PASSOU.
> - **B — `parse/` PURO + testes.** 5 módulos (`inline-payload`, `atribuicao`, `marcador`,
>   `consulta`, `anotacao`) com os kernels puros antes embutidos no DOM (extração de `Nos[0].acoes`/
>   `Nos[0].html` + unescape; heurística "atribuído para"; id de `acaoRemover`; mapa de acesso +
>   split nome/(unidade) de interessados; marcadores `[ ]`/`[X]`). `index.js` os **importa**
>   (bundler inlina). `tests/features/arvore-info/parse.test.js` +16. Smoke PASSOU.
> - **E — Reconciliação old/new.** Mapeado: as 4 seções editáveis (atribuição, marcador, tipo,
>   acompanhamento) já usavam **editores inline da própria feature**; o handoff ao diálogo legado
>   `parent.editDadosArvorePro` era **branch morto** (sem lápis de `nivel_acesso`). E1: removido o
>   branch morto + `watchDialogClose` (usado só por ele) do boot. E2: **deletadas 436 linhas** de
>   `sei-functions-pro.js` (`editDadosArvorePro`/`_`/`_AcompEsp` — diálogo jQuery UI + chosen).
>   Helpers compartilhados (`getRemoverMarcador`, `getAjaxLista*`, `getSelect/ListaAtribuicao*`)
>   **preservados** (usados por features vivas — traçado por call-site). `chosen.js` permanece (usado
>   em todo o resto). 216 testes verdes.
>
> - **C — `io.js` (fronteira de rede).** `fetchPage`(+cache/TTL/retry), `invalidatePage`,
>   `submitForm` extraídos para `io.js` como fábrica `createIo({win,log,warn,err})` (injetável →
>   testável). `index.js` instancia e mantém os call-sites idênticos. `io.test.js` +5 (fetch/DOMParser
>   stubados: cache compartilha 1 request, invalidate refaz, retry em "Failed to fetch", erro não-
>   transiente limpa cache). Semântica Latin-1 preservada.
> - **D (parcial) — utilitários de DOM auto-contidos.** Matemática de cursor → `dom/caret.js`
>   (fábrica `createCaret({doc,win})`, wrappers finos no `index.js`); `forceTrueConfirm` →
>   `dom/confirm.js`; `createMarcadorRemoveConfirmBox` **removido** (código morto, 0 usos);
>   2 leituras mortas de `.panelDadosArvorePro[bloco_interno]` removidas de `sei-functions-pro.js`.
>   **221 testes verdes.**
>
> **Estado:** `infoarvore` em `src/features/arvore-info/`: `parse/` ×5 (testado), `io.js` (testado),
> `dom/caret.js`, `dom/confirm.js`. Edição unificada; legado morto removido. **Todo o conteúdo
> separável e testável a seco já foi extraído.**
>
> **D (completa) — split por seção concluído (incremental, smoke por etapa).** A closure `initOnce`
> foi quebrada em módulos por seção, cada um recebendo um `ctx` com painel(éis) + deps de runtime
> (fetch/toolbar/refreshers/logger); a lógica pura vem de `parse/`. Extraídas, uma por vez, com
> build+test verdes e smoke não-destrutivo em produção (Chrome/SEI 5.x):
> - `sections/consulta.js` — Tipo/Nível/Assuntos/Observações/Interessados (read-only).
> - `sections/acompanhamento.js` — render + remoção inline (editor de adição fica no index).
> - `sections/marcador.js` — render + remoção inline (idem).
> - `sections/atribuicao.js` — fábrica `createAtribuicaoSection` (renderRows + editInline).
> - `sections/anotacao.js` — a maior: editor completo (edit/save/cancel/remove/prioridade/data/
>   checklist) + caret + round-trip texto↔DOM; cria seu próprio `createCaret`.
>
> **Resultado:** `index.js` **2.238 → 1.143 linhas** (-49%); restou só bootstrap/ciclo de vida/
> observer + scaffolding de painel/wiring de clique. `infoarvore` agora é: `parse/`×5 (testado),
> `io.js` (testado), `dom/caret.js`+`dom/confirm.js`, `sections/`×5. **221 testes verdes.**
> Smoke do split completo PASSOU (9 seções renderizam dos módulos novos; editor de Atribuição abre;
> console limpo). Bug pego no caminho: o import de `createAtribuicaoSection` faltava (esbuild não
> acusa identificador indefinido) — corrigido antes do smoke.
>
> **Bug de runtime corrigido pós-smoke — `submitForm` na Anotação.** O save/excluir/data da
> anotação chama `saveAnotacaoToServer → submitForm`, que **não fora repassado** no `ctx` de
> `installAnotacaoSection` (esbuild não acusa identificador indefinido). Sintoma reportado em
> produção: "Falha ao salvar anotação: submitForm is not defined". Corrigido (ctx + chamada).
> Para **travar a classe inteira do bug**, adicionado `tests/features/arvore-info/ctx-wiring.test.js`:
> para cada `sections/*.js`, toda `ctx.<chave>` usada precisa ser passada na chamada do index.js.
> **226 testes verdes.**
>
> **Validação de save em produção — OK (usuário, 2026-06-23):** salvar/excluir/inserir-data na
> anotação e remover marcador funcionaram; estado pós-remoção correto; console limpo. (Confirmado
> também que o "placeholder + 456 restantes" coexistindo é a UI normal do estado vazio — o contador
> de caracteres na barra de ações, não conteúdo stale.)
>
> **Pós-validação — limpeza + cobertura de DOM.** (1) `editMarcadorInline` (código morto, já
> desativado pelo próprio comentário no legado) **removido** (-117 linhas) → `index.js` **1.028**.
> (2) **jsdom** adicionado como devDependency; os parsers de documento SEI das 5 seções foram
> **promovidos a exports** (`parseMarcadorItems`, `parseAcompItems`, `getAcessoText`,
> `getInteressadosTexts`, `parseAtribuicaoItemsFromDoc`) e cobertos por
> `tests/features/arvore-info/sections-parse.test.js` (9 testes, fixtures de HTML real do SEI) —
> fecha a lacuna "camada de DOM não testada" que deixou passar o bug do `submitForm`. **235 testes
> verdes.**
>
> **Decisões finais de escopo (avaliação honesta, mantidas por design):**
> - **Editores `editTipo`/`editAcomp` + marcador-add + `openInlineEditor`/`submitViaIframe` ficam em
>   `index.js`** — são a camada de **orquestração/boot** da feature (no alvo, `index.js` = install/boot).
>   Movê-los só realocaria orquestração, com smoke destrutivo e sem ganho arquitetural.
> - **Fallbacks defensivos mantidos** (`normalizeMojibakeUtf8` facade-com-fallback; `stubParent`):
>   são resiliência contra corrida de carga no iframe (o "às vezes não carrega" relatado), **não**
>   legado-para-compat. Removê-los seria regressão.
> - **Sub-features adjacentes** que renderizam perto da árvore mas são **requisitos distintos** —
>   "Personalizar Menu" das seções (`iconsFlashPanelArvore` + UI em `sei-functions-pro.js`),
>   **atividades/kanban na árvore** (`panelDadosArvore_atividades`, jKanban) e `getInfoArvoreLastDoc`
>   (integração com upload) — **não** são dívida do `infoarvore`; cada uma é uma migração própria,
>   a fazer quando/se aquela funcionalidade for tocada.

- Dividir `sei-pro-atividades.js` e `sei-functions-pro.js` em pastas por responsabilidade:
  `features/kanban`, `features/gantt`, `core/config`, `core/dom`, `core/version`…
- **Atenção ao contrato `checkConfigValue`** (ver nota na Fase 5): ao mover/quebrar
  `sei-functions-pro.js`, portar `checkConfigValue` + `isDefaultEnabledConfigValue` para
  `core/config` antes de removê-los do legado, senão `config-compat.test.js` quebra (de
  propósito).
- **Risco:** alto isoladamente, **baixo agora** — chega protegido por testes, namespace,
  adapter e build prontos.

---

## 5.1 Playbook de quebra dos God Modules (o "norte")

Esta seção é o **método repetível** para a Fase 6. As 11 fatias já feitas (validacao →
prazos) provaram o padrão; aqui ele fica explícito para guiar as próximas — começando por
**Controlar Prazos**, que é o caso-guia.

### 5.1.1 Princípio: separar por *eixo de mudança*, não por arquivo

Um God module mistura responsabilidades que mudam por razões diferentes. A quebra agrupa o
código pelo que o faz mudar, em **três camadas** com dependência só de cima para baixo:

```
core (puro)  ←  feature/view (DOM, jQuery, estado)  ←  init (bootstrap por página)
   │                    │                                    │
 sem DOM,          orquestra o core,                  decide QUANDO a feature
 sem jQuery,       lê/escreve DOM,                    roda (matches do manifest),
 sem estado;       chama storage/net;                 injeta scripts.
 testável a seco   NÃO contém regra de cálculo pura
```

Regra de ouro: **toda lógica que dá para testar sem um navegador pertence ao `core/`.** O
resto (selecionar elemento, montar HTML, ligar evento, ler config do storage) é *view* e
fica na camada de feature.

### 5.1.2 O alvo por feature (`features/<nome>/`)

Cada feature vira uma pasta com fronteira explícita. Para prazos:

```
src/
  core/
    prazos.js            ✅ núcleo PURO: getRecalculaPrazo, parsePrazoTag (já existe)
  features/
    prazos/
      index.js           install(): registra a feature, expõe SeiPro.features.prazos
      view.js            DOM: setControlePrazo, setPrazoMarcador, updateTablePrazoProcesso
      config.js          config/switches: changeAtivRecalcPrazoSwitch, configDatesSwitchChangePrazo
      init.js            initControlePrazo / addControlePrazo (entrada da feature por página)
```

> **Restrição de build (importante).** Hoje o `build.mjs` bundla **só** `src/content/core-stack.js`
> (camada core/sei). A camada `features/` em `src/` **ainda não é bundlada** nem carregada pelo
> manifest. Então, na prática atual, a fatia de cada feature é:
> 1. **mover a lógica pura** para `src/core/<feature>.js` (entra no bundle, ganha teste); e
> 2. **deixar a camada de view no arquivo legado**, agora *chamando* o core (`SeiPro.core.<feature>`).
>
> A pasta `src/features/<nome>/` acima é o **destino final**; ela só passa a existir de fato
> quando a Fase 6 evoluir o build para também bundlar `features/` (decisão a tomar quando a
> primeira feature estiver com o core 100% extraído). Até lá, "feature folder" = *core extraído
> + view legada apontando para ele*. Não criar `src/features/` vazio antes do build suportá-lo.

### 5.1.3 O ciclo de uma fatia (repetir até o god module esvaziar)

Cada fatia é pequena, verde e commitável isoladamente:

1. **Identificar um cluster coeso** dentro do god module (funções que se chamam entre si e
   compartilham um tema). Preferir começar pelo **mais puro**.
2. **Classificar cada função do cluster:** pura → vai pro `core/`; toca DOM/jQuery/estado →
   fica na view (mas pode ter *bits puros embutidos* a extrair, como `parsePrazoTag` saiu de
   dentro de `setControlePrazo`).
3. **Mover a parte pura** para `src/core/<feature>.js`. Dependências de lib vendor (`moment`,
   `jmespath`) entram como **global lazy** via `globalRef.*` (nunca `import` de vendor).
   Dependências de outro módulo core entram como **import modular** (ex.: prazos → feriados).
4. **Registrar** no `install<Feature>()`: `SeiPro.core.<feature> = {...}` + `aliasGlobal(nome, fn)`
   para cada função (preserva o global legado — nada quebra). Encadear o `install` em
   `src/content/core-stack.js`.
5. **Remover a definição legada** e apontar os call-sites para o core/alias.
6. **Escrever o teste** (`tests/core/<feature>.test.js`) carregando libs REAIS no sandbox `vm`
   quando houver dependência de vendor — mais fiel que stub.
7. **`npm run build` + `npm test` verdes** e `node --check` nos arquivos tocados. Commitar a fatia.

### 5.1.4 Guard-rails (o que trava regressão)

- `no-duplicate-core.test.js` — garante definição **única**: ao remover a legada, a função
  migrada não pode reaparecer em dois lugares.
- `config-compat.test.js` — protege o contrato `checkConfigValue`/`isDefaultEnabledConfigValue`,
  **já portados para `core/config`** (fatia 13). O teste agora trava que o core os provê e o
  legado não os redefine.
- **Smoke test manual** (`SMOKE_TEST.md`) como gate de produção a cada fatia que toque view.
- Cuidado verbatim com **regex e quirks** (ranges mojibake, zero-width, `opacity||1`): copiar
  com escapes `\u`, nunca "limpar" — já documentado nas fatias 8–9.

### 5.1.5 Roteiro concreto para terminar "Controlar Prazos"

**Estado atual — núcleo puro da feature 100% extraído** (fatias 10–13):
`getRecalculaPrazo`, `parsePrazoTag`, `parsePrazoTooltip`, `getDateBoxState`, `getProgressPercent`
em `core/prazos.js`; o gate `checkConfigValue` agora é core-backed (`core/config.js`).

Fatias concluídas:
1. ✅ **`core/prazos.js` — cálculo/parse puros.** `getRecalculaPrazo` (fatia 10), `parsePrazoTag`
   (11), `parsePrazoTooltip`/`getDateBoxState`/`getProgressPercent` (12, extraídos de dentro de
   `updateTablePrazoProcesso`/`getDatesPreview`/`getProgressPreview`).
2. ✅ **View do marcador (`sei-pro.js`).** `setControlePrazo`/`updateTablePrazoProcesso`/
   `getProgressPreview` agora delegam ao core; só DOM+`moment` ficam na view.
3. ✅ **Gate de config.** `checkConfigValue`/`isDefaultEnabledConfigValue` portados (fatia 13).

**Conclusão (avaliação 2026-06-18): a feature atingiu o ponto de parada natural desta fase.**
O que resta NÃO tem extração limpa para o core e **deve permanecer no legado** — manter assim é
o playbook sendo seguido, não dívida:
- **Switch handlers** (`configDatesSwitchChangePrazo`, `changeAtivRecalcPrazoSwitch`): jQuery
  show/hide puro, **sem lógica de domínio**. View por definição (§5.1.1).
- **`getConfigDadosUnidade`** (`sei-pro-atividades.js`): lê **estado global mutável**
  (`arrayConfigAtividades`, `arrayConfigAtivUnidade` — reatribuídos em múltiplos pontos, ligados
  a `getOptionsPro`/`hybridStorageRestorePro`) e chama `getConfigDadosEntidade`. Trazê-lo ao core
  **arrastaria esse acoplamento para dentro do core** — proibido pelo playbook. Pertence a um
  **cluster futuro "config de atividades"**, não à fatia de prazos.
- **Orquestração** (`initControlePrazo`/`addControlePrazo`/`setPrazoMarcador`): init/dialog/AJAX —
  camada de view/bootstrap, fica no legado até `features/` ser bundlado.

**Gatilho para retomar:** quando o build evoluir para bundlar `src/features/` (§5.1.2), prazos é
a **candidata a inaugurar `src/features/prazos/`** — movendo a view legada (que já só chama o
core) para lá. Antes disso não há ganho arquitetural a extrair desta feature.

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
| 6 — Feature folders | Alto | Baixo (após 0–5) | 🟡 19 fatias feitas (76 fn em 11 módulos; 19ª = dedup); método em §5.1 |

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
