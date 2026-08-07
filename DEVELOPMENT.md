# DEVELOPMENT — SEI Pro PRF

Manual operacional de desenvolvimento e manutenção da extensão. Para informações de uso,
veja o [README](./README.md).

**Este documento aplica decisões; não as toma.**

| Onde | O quê |
|---|---|
| [`docs/adr/`](./docs/adr/README.md) | **Decisões** arquiteturais, com motivo e verificação. Autoridade máxima |
| [`docs/implementation-plan.md`](./docs/implementation-plan.md) | **Ordem**: fases, fatias, portões e riscos |
| [`docs/architecture.md`](./docs/architecture.md) | **Mapa**: estado atual medido e distância até o alvo |
| este arquivo | **Como fazer**: build, anatomia de feature, checklist de migração |

Se algo aqui contradisser um ADR aceito, o ADR vence e o texto aqui é um bug.

---

## Ambiente

A extensão é empacotada com **esbuild** (`scripts/build.mjs`).

**Fontes da verdade** — todas versionadas:

| Pasta | Conteúdo |
|---|---|
| `src/` | código (ESM moderno + legados ainda não migrados) e `src/css/` |
| `vendor/` | bibliotecas de terceiros, cada uma com `VERSION.txt` |
| `assets/` | binários e dados nossos (ícones, `config_hosts.json`) |

`dist/` é **saída gerada, fora do git**, reproduzível byte a byte a partir de um clone
limpo. Nada em `dist/` é editado à mão nem commitado
([ADR-0011](./docs/adr/0011-dist-fora-do-versionamento.md)).

> Nota histórica: uma 1ª tentativa com **Vite + CRXJS** foi revertida porque minificava os
> arquivos legados in-place (destruindo a fonte). O esbuild atual nunca passa os legados
> pelo bundler — só os copia. Ver `scripts/build.mjs`.

**Instalação e build (obrigatório após clonar — `dist/` não vem no repo):**
```bash
npm install
npm run build    # gera dist/ (carregar unpacked em chrome://extensions)
npm run dev      # esbuild em watch sobre src/
```

**Adicionar um asset estático** (lib, CSS, ícone, dado): coloque a fonte em `vendor/<lib>/`
(com `VERSION.txt`), `src/css/` ou `assets/`, e declare o par fonte → dist em
**`scripts/asset-manifest.mjs`** — a única fonte desse mapeamento, compartilhada com o
build e com os testes. Nunca criar arquivo diretamente em `dist/`.

**Ferramentas de auditoria:**
```bash
node scripts/audit-dist-sources.mjs   # há asset em dist/ sem fonte no repo?
```

**Testes unitários (dev-only, não vão para `dist/`):**
```bash
npm test         # vitest (pretest roda o build)
```

**Fluxo de desenvolvimento (toda fonte vive em `src/`):**
1. Edite em `src/` (módulos ESM em `src/core`, `src/sei`, `src/features/<x>`, `src/shared`;
   ou os legados ainda não migrados em `src/features/<x>/*.js`, `src/shared/legacy/`, `src/bootstrap/`)
2. `npm run build`
3. Recarregue a extensão em `chrome://extensions/` e a página do SEI

Execute `npm test` antes de fechar mudanças.

### O build (`scripts/build.mjs`)

- **Bundles ESM** (esbuild, IIFE legível, sem minificação): `src/content/core-stack.js`,
  cada `src/entries/*.js`, os `index.js` das features bundladas
  (`arvore-info`, `quick-highlight`, `anotacao-controle`, `monitorados`, …) e
  `src/options/index.js` → `dist/js/options.bundle.js`.
- **Legados** (`legacyFiles`): copiados verbatim de `src/.../<nome>.js` para `dist/js/<nome>.js`.
  Não passam pelo bundler (compartilham ~1300 globais e dependem da ordem do manifest).
- **CSS de feature** (`featureCss`): `src/features/<x>/*.css` → `dist/css/`.
- **Options shell**: `src/options/options.html` + `page.css` → `dist/html/` (sem copiar JS legado).
- **Manifest**: `manifest.base.json` é a fonte; `dist/manifest.json` é cópia.

---

## Camada core/sei/platform (`src/`)

A stack é composta por `src/content/core-stack.js` → `installCoreStack()` (em `src/core/stack.js`),
carregada **primeiro** em cada bloco de content script via `manifest.json`:

| Camada | Arquivos | Responsabilidade |
|---|---|---|
| Namespace | `core/namespace.js`, `core/global.js` | `window.SeiPro`, `aliasGlobal`, aliases de estado |
| Runtime | `platform/runtime.js` | `getUrlExtension`, manifest, path da extensão |
| Util | `core/util.js` | Funções puras (`compareVersionNumbers`, `getParamsUrlPro`, …) |
| Config | `core/config.js` + `shared/config-defaults.js` | `verifyConfigValue`, `getConfigValue`, `checkConfigValue`; defaults shared with options UI |
| UI | `core/ui.js` | `loadFontIcons`, `loadStyleDesign`, … |
| Messaging/Storage/Net | `platform/messaging.js`, `storage.js`, `net.js` | fachadas delegadas ao service worker |
| Logger/Report | `platform/logger.js`, `report.js` | log/erro condicionados a `debugpage` |
| SEI version/adapter/urls | `sei/version.js`, `adapter.js`, `urls.js` | detecção 4/5, seletores neutros, parsing de URL |

Funções legadas permanecem como aliases globais (`getUrlExtension`, etc.) para compatibilidade incremental.

### Smoke test manual (gate entre fases)

Antes de fechar mudanças arquiteturais, validar no SEI:

- [ ] Lista de processos (agrupamento, favoritos, Kanban)
- [ ] Árvore de documentos (menus rápidos, upload)
- [ ] Editor de documentos (atalhos, auto-save)
- [ ] Visualização de documento (marca d'água, numeração)

---

## Estrutura

Tudo vive em `src/`. As features migradas são módulos ESM (vanilla, sem jQuery); as
ainda-legadas são scripts globais que o build copia verbatim para `dist/js/`.

```
src/
├── app/                           # contexts + feature-registry + boot + publish-feature
├── core/                          # núcleo PURO (datas, numeros, texto, validacao, config, …)
├── sei/                           # adapter de versão SEI 4/5, urls, tooltip
├── platform/                      # runtime, messaging, storage, net, bus, logger (chrome.* / SW)
├── content/core-stack.js          # stack + shared legacy helpers (transitório)
├── entries/                       # entries por contexto (login/db usam app/boot)
├── shared/                        # helpers compartilhados (quickfilter, sticknote, docslote, ui/)
│   ├── ui/                        # PRIMITIVOS vanilla reusáveis: modal, tags-input,
│   │                              #   sortable, sortable-table (substituem jQuery UI/plugins)
│   └── legacy/                    # legado fundacional ainda global (sei-functions-pro, icons)
├── features/
│   ├── monitorados/               # ★ FEATURE 100% MIGRADA — referência do padrão
│   │   ├── domain.js              #   núcleo puro (testável, sem DOM)
│   │   ├── store.js               #   IO (localStorage + remoto)
│   │   ├── dom.js                 #   helpers vanilla + delegação
│   │   ├── icon/panel/maps/datas/categorias/commands/…  # view + comandos
│   │   ├── index.js               #   entry do bundle (instala + aliasGlobal)
│   │   └── monitorados.css        #   CSS da feature
│   ├── arvore-info/ · quick-highlight/ · anotacao-controle/   # outras já bundladas
│   ├── editor/ · ai/ · legis/            # ESM; IA isolada e ponte CKEditor mínima
│   ├── atividades/                       # fatiada (P0–P1); chrome do painel em data-act
│   │   ├── domain.js · io.js · view.js · templates.js · state.js
│   │   ├── runtime.js · compat.js · modules.js · legacy-api.js · index.js
│   │   ├── server.js · data.js · charts.js · panel.js · reports-*.js
│   │   ├── config-*.js · afastamentos.js · kanban.js
│   │   └── activity-*.js · ratings.js · boot.js · style.css
│   ├── lista-processos/ · …              # other features at different migration stages
├── options/                       # ★ PÁGINA DE CONFIGURAÇÃO (extension page)
│   ├── domain.js · io.js · view.js · index.js  # vanilla ESM → options.bundle.js
│   ├── options.html · page.css                 # shell + estilos (sem jQuery)
│   └── (feature plugs: features/*/options.js)  # ex.: monitorados-options.bundle.js
├── bootstrap/                     # init*.js, getscript-isolated, init-flags (glue de carga)
└── background/background.js       # service worker (MV3)

vendor/                            # terceiros — um diretório por lib, com VERSION.txt
├── jquery/ · jquery-ui/ · ckeditor/ · moment/ · chart/ · dompurify/ · …
├── fontawesome/                   # subset Pro (CSS + webfonts/)
└── modallink/                     # ATENÇÃO: patch local, ver VERSION.txt

assets/                            # binários e dados nossos
└── icons/                         # ícones da extensão, menus, editor, whitelabels

dist/                              # SAÍDA GERADA — fora do git, não editar à mão
├── js/                            # bundles *.bundle.js + cópias dos legados + lib/
├── css/  html/  icons/  webfonts/  config_hosts.json  manifest.json
```

---

## Arquitetura-alvo e padrão de migração por feature

Estado medido e distância até o alvo: **[docs/architecture.md](./docs/architecture.md)**.
Motivo de cada regra abaixo: **[docs/adr/](./docs/adr/README.md)**.

### Princípios fundamentais

1. **Mundo isolado (isolated-first):** todo código novo roda no mundo isolado do content
   script. A exceção documentada do editor é o bundle CKEditor 4 injetado em `MAIN` via
   `editor-loader.js` (o CKEditor pertence à página). Esse bundle **não** recebe runtime,
   storage nem LLM; a IA isolada só troca duas operações serializáveis (`snapshot` e
   `insertHtml`). Sem `onclick` inline.
2. **Direção de dependência:** `entries` → `features` → `shared` → `core` / `sei` /
   `platform`. Nunca o contrário. `core/stack.js` **não deve importar nada de `features/`**
   nem instalar helpers de feature (`quickfilter`, `sticknote`, `docslote`).
3. **Contrato público:** descritor em `feature.js` como fonte de verdade e
   `SeiPro.features.<id> = { id, api, install }` publicado em runtime. Consumidores
   cross-feature usam só `.api` ([ADR-0004](./docs/adr/0004-features-autodescritivas-manifest-gerado.md)).
4. **Conhecimento do SEI só em `src/sei/`** ([ADR-0003](./docs/adr/0003-anti-corruption-layer-sei.md)):
   nenhum seletor, URL `controlador.php?acao=` ou ramificação `isNewSEI`/`isSEI_5` fora do
   anti-corruption layer. Parser do SEI devolve dados, nunca DOM ou jQuery.
5. **Dependência injetada, não localizada** ([ADR-0005](./docs/adr/0005-raiz-de-composicao-e-injecao-explicita.md)):
   sem `getSeiPro()` em código novo. Config, storage, logger, relógio e `document` chegam
   pelo `deps` construído na raiz de composição do contexto.
6. **`aliasGlobal` e `publishGlobal` são coisas diferentes**
   ([ADR-0012](./docs/adr/0012-aliasglobal-publicacao-vs-legado.md)): `aliasGlobal` é
   **dívida de feature** e só pode aparecer em `legacy-api.js`, sempre com TODO declarando a
   condição de remoção; `publishGlobal` é **publicação de namespace** do núcleo para os
   blocos legados e só pode aparecer em `src/core/`, `src/platform/`, `src/sei/`. Nenhum dos
   dois em domain, io, view ou index.
   *(A regra anterior — "`aliasGlobal` só em `legacy-api.js`", sem exceção — estava errada:
   era descumprida em 136 de 186 chamadas, todas legítimas.)*
7. **Falha de feature não derruba o contexto**
   ([ADR-0006](./docs/adr/0006-isolamento-de-falha-por-feature.md)): o boot isola o
   `install`. Sem `catch` que engole erro em silêncio.
8. **Fronteira de feature é capacidade do usuário**, não página do SEI nem arquivo legado
   herdado ([ADR-0007](./docs/adr/0007-fronteira-de-feature-por-capacidade.md)). Subpasta
   interna não é resposta para arquivo grande.
9. **CSS prefixado:** todas as classes de features usam prefixo `.seipro-`. Sem Shadow DOM
   (cria fricção com FontAwesome, jQuery UI e estilos do SEI).
10. **Entries + app boot:** cada contexto caminha para `src/entries/` + `src/app/boot`.
    O `core-stack.bundle.js` amplo continua enquanto houver blocos legados no manifest.
11. **Mudança nova já nasce na arquitetura nova:** identificar contexto SEI, config flag e
    superfície legada; depois domain / IO / view / CSS / contrato `{ id, api, install }`.
12. **Regra nova exige verificação executável**
    ([ADR-0008](./docs/adr/0008-fitness-functions-e-ratchets.md)). Sem fitness function ou
    ratchet, é intenção, não regra — e apodrece.

---

### Anatomia de uma feature migrada (Tier S)

```
src/features/<nome>/
├── domain.js          # lógica pura: sem DOM, sem chrome.*, sem jQuery
├── io.js              # efeitos: storage, rede, sessão (não chama view)
├── view.js            # DOM vanilla + delegação; classes .seipro-
├── templates.js       # opcional: markup
├── index.js           # publica { id, api, install }; compõe domain+io+view
├── legacy-api.js      # opcional: único aliasGlobal; TODO de remoção
└── style.css          # classes .seipro-*
```

Tier C (atividades, editor/ai quando necessário) adiciona `application` / `ports` /
`useCases` **internamente**; o público permanece `{ id, api, install }`.

**Exemplo de composição em `index.js`:**
```js
import { publishFeature } from '../../app/publish-feature.js';
import { ready } from '../../dom/index.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';
import './legacy-api.js'; // remove quando legado migrar

export function installMinhaFeature(ctx = {}) {
    const deps = {
        root: document,
        config: window.SeiPro && window.SeiPro.core && window.SeiPro.core.config,
        ...ctx
    };
    const dados = io.carregar(deps);
    const estado = domain.calcular(dados);
    ready(() => view.render(deps.root, estado));
}

publishFeature({
    id: 'minha-feature',
    api: { /* comandos/consultas estáveis */ },
    install: installMinhaFeature
});
```

**Exemplo de `legacy-api.js`:**
```js
// TODO: remover quando lista-processos migrar
import { aliasGlobal } from '../../core/global.js';
import { minhaFuncao } from './domain.js';
import { salvar } from './io.js';
import { renderizar } from './view.js';

aliasGlobal('minhaFuncao', minhaFuncao);
aliasGlobal('salvar', salvar);
aliasGlobal('renderizar', renderizar);
```

---

### Regras de camada

| Camada | Pode importar | Nunca importa |
|---|---|---|
| `domain.js` | nada externo (funções puras) | dom, chrome.*, getSeiPro, jQuery |
| `io.js` | `core/`, `platform/`, `sei/` | `view.js`, jQuery |
| `view.js` | `dom/index.js`, `shared/ui/`, `templates.js`, `core/` | `io.js`, jQuery |
| `templates.js` | `dom/index.js`, constantes da feature | `io.js`, jQuery, chrome.* |
| `index.js` | tudo da própria feature | features de outras features diretamente |
| `legacy-api.js` | domain, io, view, `core/global.js` | nada além disso |

Quando uma regra acima for impraticável por causa do legado, a exceção deve ficar no
menor arquivo possível e ser comentada como ponte temporária.

---

### HTML e templates

HTML criado pela extensão pertence à camada de view. Para markup pequeno, pode ficar em
`view.js`. Para painel, modal, tabela ou formulário maior, criar `templates.js` ou um
subarquivo de view (`panel.js`, `form.js`, `row.js`).

Regras:

- `domain.js` nunca monta HTML.
- `io.js` nunca retorna elemento DOM; retorna dados ou `Document` parseado quando estiver
  lendo uma página do SEI.
- Conteúdo vindo do usuário, rede ou página do SEI deve ser tratado como dado. Se virar
  `innerHTML`, sanitizar antes ou montar DOM com `el()`/`textContent`.
- Não usar `onclick`, `onchange` ou atributos inline novos. Usar `addEventListener` ou
  delegação com `on(root, 'click', '[data-act="..."]', handler)`.
- Ações em HTML gerado usam `data-act`, `data-id`, `data-*`; a view traduz para comandos.
- Correções em legado que ainda tenham `onclick="fn(this)"` devem **remover o atributo**
  e instalar delegação no mundo isolado (ex.: `nao-lido-marcar`, `panel-proc`). Não
  “consertar” com shim no MAIN nem ampliar a gramática de `legacy-inline-bridge` —
  a bridge só cobre o que ainda não foi migrado e falha com jQuery `.trigger('click')`.
- Em código legado, preferir chamar a função diretamente no isolated world em vez de
  `$el.trigger('click')` quando o botão ainda tinha (ou poderia ter) handler inline.

---

### CSS: prefixo obrigatório `.seipro-`

Toda classe criada por features deve usar o prefixo `.seipro-`:

```css
/* ✗ errado — pode colidir com SEI nativo */
.modal { … }
.btn-primary { … }
.header { … }

/* ✓ correto */
.seipro-modal { … }
.seipro-btn--primary { … }
.seipro-header { … }
```

Modificadores seguem BEM: `.seipro-btn--primary`, `.seipro-modal--open`.

---

### Comunicação entre features

Uma feature não deve importar internals de outra feature. Duas formas, ambas com uso real:

| Necessidade | Mecanismo |
|---|---|
| Feature chama feature, mesmo contexto | `SeiPro.features.<id>.api`, ou ligação explícita na raiz de composição do contexto |
| Atravessar contexto de execução (content script ↔ service worker ↔ options) | mensagem serializável via `platform/messaging.js` |

**Não usar event bus.** `src/platform/bus.js` está em remoção: tem 1 emissor, 0 assinantes e
um `catch` que engole erro de listener em silêncio
([ADR-0013](./docs/adr/0013-remover-bus-nao-utilizado.md)). Não adicionar consumidor novo.
Reintroduzir depois exige ADR e pelo menos dois consumidores reais.

---

### Infra compartilhada → `src/shared/ui/`

Ao migrar uma feature que usa jQuery UI / tablesorter / chosen / plugins legados:
criar ou reusar um primitivo vanilla em `src/shared/ui/`. Primitivos existentes:
`modal.js`, `sortable.js`, `sortable-table.js`, `tags-input.js`, `prazo-preview.js`,
`file-queue.js` (upload / drag-drop, substitui Dropzone).

Features legadas continuam usando os plugins jQuery em paralelo — duplicação temporária
e esperada durante a transição.

---

### Ordem de prioridade para migração

A ordem canônica é **[docs/implementation-plan.md](./docs/implementation-plan.md)**: fases,
fatias, portões e riscos. CSS `.seipro-*` é passo **em lote** por épico fechado, não a fila
principal.

> `docs/engineering-loop.md` e `docs/engineering-loop-board.md` eram citados aqui e **nunca
> existiram** no repositório — por isso `npm run loop:next` falha ao ler o board. Decidir
> entre apontar os scripts para o plano ou removê-los é a fatia 0.6 do plano.

Quando for migrar uma feature existente (humano ou maker), seguir nesta ordem:

1. **Tirar dependências de feature de dentro de `core/stack.js`** — `installMonitoradoStore`
   não deveria estar lá; mover para `shared/` ou para o entry do contexto que precisa dele.
2. **Mapear a superfície legada:** nomes globais, `onclick` existentes, config flags, blocos do
   manifest, CSS carregado e páginas SEI afetadas. (**P0**)
3. **Criar ou reaproveitar entry específico** em `src/entries/` quando o contexto já estiver
   pronto para bundle próprio. Se ainda depender do bloco legado, manter o bundle da feature
   no manifest atual e documentar a transição.
4. **Separar domain / io / view / templates / index / legacy-api** conforme anatomia acima.
   (**P1–P5** — cada passo com teste Vitest quando aplicável.)
5. **Substituir handlers inline novos por delegação**. Handlers inline antigos podem continuar
   só enquanto houver `legacy-api.js`.
6. **Prefixar todo CSS** da feature com `.seipro-` **em lote** e copiar no build via `featureCss`.
   (**P6** — proibido micro-hook unitário enquanto P1–P5 de épicos ativos estiverem abertos.)
7. **Remover definição duplicada do legado** depois de expor compatibilidade em `legacy-api.js`.
8. **Testar** domain/io com vitest; quando houver DOM relevante, usar jsdom/fixture; finalizar
   com smoke test manual no SEI real. (**P7**)
9. **Marcar `legacy-api.js`** com TODO explícito de remoção e condição de remoção.

Para feature nova, começar diretamente no formato novo. Não criar função solta em
`sei-functions-pro.js`, `sei-pro.js` ou `init*.js`.

---

### Checklist para próximos prompts

Ao receber uma tarefa sobre funcionalidade, seguir este roteiro antes de editar:

1. Identificar contexto SEI: lista de processos, árvore, editor, visualização, login,
   todas as páginas, background ou options.
2. Identificar se é feature nova, migração de legado ou correção pontual.
3. Localizar config flag e pontos globais chamados pelo legado.
4. Escolher o menor corte seguro: domain puro primeiro, depois IO, depois view/delegação,
   depois CSS, depois `legacy-api.js`.
5. Preservar comportamento e nomes globais durante a transição.
6. Atualizar `scripts/build.mjs` e `manifest.base.json` apenas quando a nova saída precisar
   ser carregada.
7. Rodar `npm test` quando a alteração tocar código; para docs, revisão textual basta.

Critério de pronto para considerar uma feature migrada:

- `domain.js` sem DOM/window/jQuery/chrome/localStorage.
- `io.js` concentra storage/rede/sessão e não chama view.
- `view.js` usa DOM vanilla, eventos delegados e CSS `.seipro-*`.
- HTML novo fica na view/templates, não misturado no domínio.
- `legacy-api.js` é o único arquivo da feature com `aliasGlobal`.
- Definições antigas equivalentes foram removidas dos arquivos legados ou explicitamente
  marcadas como pendentes.
- Há testes para domínio/IO e smoke test manual planejado para o fluxo SEI afetado.

---

### Registry, boot e manifest

Implementação em `src/app/` (piloto: `login` / `db`):

```
src/app/
├── contexts.js           # contexto SEI → feature ids, config keys
├── feature-registry.js   # id, configKey, contexts, install()
├── publish-feature.js    # publica { id, api, install } em SeiPro.features
└── boot.js               # carrega config e instala features do contexto
```

Entries finas chamam `boot(contextId)`. Snapshots de contextos em
`tests/structure/manifest-contexts.test.js`. Geração automática de manifest só depois
desses snapshots estarem estáveis.

---

### Dívida técnica

**A tabela manual de "violações conhecidas" foi removida em 2026-08-07.** Ela havia
derivado nas duas direções: listava `src/features/lista-processos/body.js` e
`arvore/body.js` como monolitos ativos quando não existe nenhum arquivo `body.js` no
repositório, e omitia dívida real e maior. Documento em prosa não sobrevive como inventário
de dívida.

A dívida agora é medida, não descrita:

- **Números atuais e alvo:** tabela de estado medido em
  [`docs/architecture.md`](./docs/architecture.md).
- **Travamento:** baselines em `tests/structure/ratchets.baseline.json`, que só podem
  diminuir ([ADR-0008](./docs/adr/0008-fitness-functions-e-ratchets.md)).
- **Motivo de cada item:** o ADR correspondente.

Dívida qualitativa que não reduz a número, e portanto continua em prosa:

| Área | Problema | Correção | ADR |
|---|---|---|---|
| `src/content/core-stack.js` | bundle amplo transitório; importa `monitorados/store-legacy-api` e instala helpers de feature | dissolver nas raízes de composição por contexto | [0005](./docs/adr/0005-raiz-de-composicao-e-injecao-explicita.md) |
| `src/platform/legacy-inline-bridge.js` | não cobre jQuery `.trigger('click')`, cadeias `$()`, `parent.fn` | dívida aceita só até o call-site migrar; **não expandir a gramática** | — |
| `onclick` inline em legado | handlers inline vazam para o MAIN world | `data-act` + delegação no mundo isolado | — |
| CSS de monolitos sem `.seipro-*` | classes sem prefixo podem colidir com o SEI | prefixar **em lote** por épico fechado | — |
| `src/features/editor/domain/*` (4 arquivos) | domínio toca `document` diretamente | mover leitura de DOM para view ou para o ACL | [0003](./docs/adr/0003-anti-corruption-layer-sei.md) |
| `src/features/atividades/` | subsistema de ~25 mil linhas tratado como feature | dividir por capacidade, teste de domínio **antes** do corte | [0007](./docs/adr/0007-fronteira-de-feature-por-capacidade.md) |
| `src/features/sei-functions/` | coleção sem coesão, nomeada pelo arquivo legado de origem | dissolver; a pasta desaparece, não é renomeada | [0007](./docs/adr/0007-fronteira-de-feature-por-capacidade.md) |
| `src/css/sei-pro.css` | 120 KB com estilos de todas as features num arquivo | fatiar em `src/features/<x>/style.css` conforme cada feature migrar | [0007](./docs/adr/0007-fronteira-de-feature-por-capacidade.md) |
| `vendor/*/VERSION.txt` com versão `desconhecida` | libs resgatadas de `dist/` sem registro de origem | confirmar versão e licença antes de qualquer atualização — não adivinhar | [0011](./docs/adr/0011-dist-fora-do-versionamento.md) |

**Já resolvido (não reabrir como fatia):** `core/stack.js` sem import de feature; `aliasGlobal` de features migradas em `*-legacy-api.js`; background fachada + handlers (`router`, `storage`, `fetch`, bug-report, notificações, install); **Atividades** (ESM fatiada, `handlers`/`view`/`domain`/`io`/`callAtiv`, P6 `.seipro-*`, zero handlers HTML inline incl. tooltips `data-tip`, namespace congelado `SeiPro.features.atividades = { api, useCases, ports }`, consumidores de primeira parte via `feature.api`; `legacy-api` aliasa só `ATIVIDADES_EXTERNAL_GLOBALS` em opt-in — dispatch interno via registry → handlers).

---

**Compat durante a transição:** as features mantêm seus aliases em `legacy-api.js`.
Para Atividades, a ponte só é instalada quando o host chama
`installAtividadesLegacyApi({ enabled: true })`; o caminho normal não publica
handlers nem aliases nomeados no root. `tests/structure/no-duplicate-core.test.js`
trava que um helper migrado não seja redefinido no legado.

> **Verificação:** os testes (vitest) cobrem domínio puro, IO, a view delegada em
> jsdom, o contrato `api/useCases/ports`, roteamento de respostas e consumidores
> migrados. **Não** reproduzem o DOM real/autenticação do SEI; o smoke manual no SEI
> continua sendo o gate de ambiente, enquanto os smoke checks automatizados impedem
> regressões de bundle e contrato.

---

## Stack

| Biblioteca | Uso |
|---|---|
| jQuery 3.7.1 | DOM e requisições |
| JMESPath | Consultas na configuração JSON |
| Moment.js | Compatibility for legacy date/deadline flows; the editor bundle does not use it |
| CKEditor | Editor de documentos (SEI 4.x) |
| Font Awesome Pro (subset WOFF2) | Ícones; somente as famílias e glifos usados pela extensão |
| frappe-gantt | Gráfico de Gantt (projetos) |
| jKanban | Board Kanban |
| Chart.js | Gráficos |
| (removido) Dropzone.js | Substituído por `src/shared/ui/file-queue.js` (vanilla) |
| DOMPurify | Sanitização de HTML |
| LLM stack (ESM) | `core/llm` (OpenAI, Anthropic, Gemini, Moonshot, Ollama, compatible endpoints), SSE, context budgeting, and tools |
| Editor / AI / Legis (ESM) | esbuild-generated bundles; `legacy-api.js` remains only as a bridge for old call sites |

---

## Configuração

General settings remain in `chrome.storage.sync` and are cached in `localStorage` as
`configBasePro` (JSON). AI profiles and keys live in `chrome.storage.local.llmProfiles`,
are not synchronized, and are read by the service worker. Main legacy configuration helpers:

```js
checkConfigValue(name)   // boolean — feature está ativa?
getConfigValue(name)     // valor configurado de uma feature
getOptionsPro(name)      // opção da extensão
localStorageRestorePro(key) // restaura JSON do localStorage
```

---

## Detecção de versão do SEI

```js
isNewSEI     // true para SEI 4.x+
isSEI_5      // true para SEI 5.x
compareVersionNumbers(v1, v2) // comparação semântica
```

---

## Compatibilidade Chrome / Firefox

```js
const isChrome = (typeof browser === 'undefined');
if (isChrome) { var browser = chrome; }
// Todas as chamadas de API usam browser.*
```

---

## Implementações PRF Dev

### Correção de race condition (`init.js`)

O SEI Pro original carregava `sei-pro.js` em paralelo com `sei-functions-pro.js`, causando `checkHostLimit is not defined` intermitentemente. Corrigido com `jQuery.Deferred`:

```js
var seiProFunctionsLoaded_init = $.Deferred().resolve();
if (typeof loadFunctionsPro === 'undefined')
    seiProFunctionsLoaded_init = $.getScript('js/sei-functions-pro.js');
seiProFunctionsLoaded_init.done(function() { $.getScript('js/sei-pro.js'); });
```

### AI providers (`core/llm`)

The ESM adapters support OpenAI, Anthropic, Gemini, Moonshot, Ollama, and OpenAI-compatible
endpoints. BYOK profiles are configured on the Options page, stored locally, and consumed
by the service worker for streaming requests.

### Service worker (`background.js`)

Registrado em `manifest.json` como `"background": { "service_worker": "js/background.js" }`. Abre aba na instalação/atualização. Requer permissão `tabs`.

---

## Publicação na Chrome Web Store

1. Gerar o pacote com `bash scripts/package-extension.sh`
2. Acessar `chrome.google.com/webstore/devconsole`
3. Upload do zip → preencher nome, descrição e screenshots
4. Em **Visibilidade** → **Privado**
5. Submeter para revisão (1–3 dias úteis)

**Descrição curta para a loja (132 chars):**
```
Ferramentas avançadas para o SEI da PRF. Gerencie processos, documentos e use IA diretamente no Sistema Eletrônico de Informações.
```

---

## Repositórios de referência

| Repo | Relevância |
|---|---|
| [pedrohsoaresadv/sei-pro](https://github.com/pedrohsoaresadv/sei-pro) | Base original |
| [godlikeb0b/sei-pro](https://github.com/godlikeb0b/sei-pro) | Implementação do Ollama |
| [tarcinwth/sei-amargosa](https://github.com/tarcinwth/sei-amargosa) | Referência de fork municipal |

---

## Histórico

Veja o [CHANGELOG](./CHANGELOG.md).
