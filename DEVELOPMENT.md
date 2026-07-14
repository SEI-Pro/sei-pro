# DEVELOPMENT — SEI Pro PRF

Documentação técnica para desenvolvimento e manutenção da extensão. Para informações de uso, veja o [README](./README.md).

---

## Ambiente

A extensão é empacotada com **esbuild** (`scripts/build.mjs`). **`src/` é a fonte única
da verdade**; `dist/` contém **apenas saída gerada** (bundles ESM + cópias verbatim dos
scripts legados ainda não migrados + CSS + manifest). Nada em `dist/` é editado à mão.

> Nota histórica: uma 1ª tentativa com **Vite + CRXJS** foi revertida porque minificava os
> arquivos legados in-place (destruindo a fonte). O esbuild atual nunca passa os legados
> pelo bundler — só os copia. Ver `scripts/build.mjs`.

**Instalação e build:**
```bash
npm install
npm run build    # gera/atualiza dist/ (carregar unpacked em chrome://extensions)
npm run dev      # esbuild em watch sobre src/
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
  cada `src/entries/*.js` e os `index.js` das features bundladas
  (`arvore-info`, `quick-highlight`, `anotacao-controle`, `monitorados`).
- **Legados** (`legacyFiles`): copiados verbatim de `src/.../<nome>.js` para `dist/js/<nome>.js`.
  Não passam pelo bundler (compartilham ~1300 globais e dependem da ordem do manifest).
- **CSS de feature** (`featureCss`): `src/features/<x>/*.css` → `dist/css/`.
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
| Config | `core/config.js` | `verifyConfigValue`, `getConfigValue`, `checkConfigValue` |
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
├── core/                          # núcleo PURO (datas, numeros, texto, validacao, config, …)
├── sei/                           # adapter de versão SEI 4/5, urls, tooltip
├── platform/                      # runtime, messaging, storage, net, logger (chrome.* / SW)
├── content/core-stack.js          # composição core+sei+platform (bundle carregado em todo bloco)
├── entries/                       # entries por contexto de página (db, login, …)
├── shared/
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
│   ├── atividades/ · lista-processos/ · editor/ · ai/ · …     # ainda legadas (1 .js global)
├── bootstrap/                     # init*.js, getscript-isolated, init-flags (glue de carga)
└── background/background.js       # service worker (MV3)

dist/                              # SAÍDA GERADA — não editar à mão
├── js/                            # bundles *.bundle.js + cópias dos legados + lib/
├── css/  html/  icons/  config_hosts.json  manifest.json
```

---

## Arquitetura-alvo e padrão de migração por feature

### Princípios fundamentais

1. **Mundo isolado (isolated-first):** todo código novo roda no mundo isolado do content
   script. Sem `world:"MAIN"`. Sem `onclick` inline (handlers inline executam no mundo MAIN
   e não enxergam funções do content script).
2. **Direção de dependência:** `features` → `shared/ui` → `core` / `sei` / `platform`.
   Nunca o contrário. `core/stack.js` **não deve importar nada de `features/`**.
3. **`aliasGlobal` só em `legacy-api.js`:** nunca espalhado em domain, io ou view.
   É dívida explícita, não padrão permanente.
4. **CSS prefixado:** todas as classes de features usam prefixo `.seipro-`. Sem Shadow DOM
   (cria fricção com FontAwesome, jQuery UI e estilos do SEI).
5. **Entries específicos por contexto:** cada contexto de página deve caminhar para seu
   próprio entry em `src/entries/`, carregando só o que precisa. O `core-stack.bundle.js`
   amplo continua existindo enquanto houver blocos legados no manifest.
6. **Mudança nova já nasce na arquitetura nova:** ao pedir uma feature ou correção, primeiro
   identificar o contexto SEI, a config flag e a superfície legada; depois separar domínio,
   IO, view, CSS e compatibilidade global conforme o contrato abaixo.

---

### Anatomia de uma feature migrada

```
src/features/<nome>/
├── domain.js          # lógica pura: sem DOM, sem chrome.*, sem jQuery
│                      #   → 100% testável com vitest/jsdom
│                      #   → recebe dados, retorna dados
├── io.js              # efeitos colaterais: storage, rede, sessão
│                      #   → recebe dependências explícitas quando viável
│                      #   → pode usar platform/core/sei; não chama view
├── view.js            # DOM vanilla (ou sub-arquivos: panel.js, icon.js, …)
│                      #   → recebe root/ctx quando possível; document só na borda
│                      #   → eventos delegados via on() de src/dom/index.js
│                      #   → classes CSS sempre com prefixo .seipro-
├── templates.js       # opcional: HTML/DOM factory da feature
│                      #   → markup estático/gerado fica aqui ou em view.js
│                      #   → nunca em domain.js ou io.js
├── index.js           # entry do bundle: compõe domain + io + view
│                      #   → instala a feature no contexto (setup, observers)
│                      #   → importa e chama legacy-api.js se houver legado
├── legacy-api.js      # (se houver legado chamando esta feature)
│                      #   → único arquivo que usa aliasGlobal()
│                      #   → reexporta funções de domain/io/view como globais
│                      #   → marcado com TODO: remover quando legado migrar
└── style.css          # CSS da feature; classes todas prefixadas .seipro-
```

**Exemplo de composição em `index.js`:**
```js
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

Preferência: dependência explícita no `index.js` ou na entry do contexto. Uma feature não
deve importar internals de outra feature.

Ainda não há event bus oficial no projeto. Se uma mudança realmente transversal aparecer
(ex.: várias features precisam reagir a `monitorados:updated`), criar primeiro um bus pequeno
em `src/platform/bus.js`, instalar na stack/entry e documentar os eventos aqui. Não introduzir
bus para chamada dentro da mesma feature.

Formato sugerido para eventos transversais, quando o bus existir:

```js
bus.emit('monitorados:updated', { items });

bus.on('monitorados:updated', ({ items }) => view.atualizarIcones(items));
```

Eventos candidatos, ainda não implementados como bus: `monitorados:updated`,
`config:changed`, `process-list:refreshed`.

---

### Infra compartilhada → `src/shared/ui/`

Ao migrar uma feature que usa jQuery UI / tablesorter / chosen / plugins legados:
criar ou reusar um primitivo vanilla em `src/shared/ui/`. Primitivos existentes:
`modal.js`, `sortable.js`, `sortable-table.js`, `tags-input.js`, `prazo-preview.js`.

Features legadas continuam usando os plugins jQuery em paralelo — duplicação temporária
e esperada durante a transição.

---

### Ordem de prioridade para migração

O loop automatizado (Hermes) segue **épicos + escada P0–P7** em `docs/engineering-loop.md`
e a fila em `docs/engineering-loop-board.md` (programa E2). CSS `.seipro-*` é o passo **P6
em lote**, não a fila principal.

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

### Evolução para registry e manifest gerado

Alvo de médio prazo: substituir manifest manual duplicado e `init*.js` por um catálogo
de contextos e features:

```
src/app/
├── contexts.js          # contexto SEI → matches, css, libs, entry, features
├── feature-registry.js  # id, configKey, contexts, install()
└── boot.js              # carrega config e instala features do contexto
```

Essa mudança deve ser incremental. Primeiro aplicar em um contexto pequeno (`login`/`db`)
ou em uma nova entry de processo; depois expandir para lista, árvore, visualização e editor.
Antes de gerar manifest automaticamente, criar testes de snapshot/estrutura para garantir
ordem de scripts, `matches`, `exclude_matches`, CSS e permissões.

---

### Violations conhecidas (dívida técnica a corrigir)

| Arquivo | Problema | Correção |
|---|---|---|
| `src/core/stack.js:42` | importa `features/monitorados/store.js` — direção errada | mover `installMonitoradoStore` para os entries que precisam |
| `src/features/*/index.js` (vários) | `aliasGlobal` espalhado fora de `legacy-api.js` | consolidar em `legacy-api.js` |
| `src/features/*/*.css` e `src/shared/ui/*.css` | classes sem prefixo `.seipro-` | renomear sistematicamente quando tocar na feature |
| `src/background/background.js` | monolítico (router + storage + fetch + notify) | extrair `background/router.js`, `storage-handler.js`, etc. antes de crescer mais |

---

**Compat durante a transição:** cada função movida é preservada como global via
`aliasGlobal` (somente em `legacy-api.js`), então os call-sites do legado continuam
funcionando sem edição. `tests/structure/no-duplicate-core.test.js` trava que
um helper migrado não seja redefinido no legado.

> **Verificação:** os testes (vitest) cobrem domínio puro, IO e os primitivos de
> `shared/ui` (jsdom). **Não** cobrem a view montada no DOM real do SEI nem os contratos
> de globais legados — por isso o smoke test manual no SEI continua sendo o gate final.

---

## Stack

| Biblioteca | Uso |
|---|---|
| jQuery 3.7.1 | DOM e requisições |
| JMESPath | Consultas na configuração JSON |
| Moment.js | Manipulação de datas e prazos |
| CKEditor | Editor de documentos (SEI 4.x) |
| Font Awesome Pro | Ícones |
| frappe-gantt | Gráfico de Gantt (projetos) |
| jKanban | Board Kanban |
| Chart.js | Gráficos |
| Dropzone.js | Upload drag & drop |
| PDF.js | Leitura de PDFs |
| Tesseract.js | OCR |
| DOMPurify | Sanitização de HTML |

---

## Configuração

Configurações do usuário são salvas via `chrome.storage.sync` e cacheadas em `localStorage` como `configBasePro` (JSON). Funções principais:

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

### Suporte a Ollama (`sei-pro-ai.js`)

Portado de [godlikeb0b/sei-pro](https://github.com/godlikeb0b/sei-pro). Adiciona `perfilOllama`, `modelsOllama`, `loadAIPromptsToStorage()` e resolve `getModelAI` para 3 plataformas. Ver `sei-pro-ai.js` linhas 11–100 para detalhes.

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
