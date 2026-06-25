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

A meta é **fronteiras explícitas por camada**, no mundo isolado do content script
(decisão isolated-first: sem `world:"MAIN"`). Cada feature migrada segue:

| Camada | Onde | Regra |
|---|---|---|
| **domínio** | `domain.js` | funções puras, sem DOM/jQuery/chrome — 100% testável |
| **io** | `store.js` / `server.js` | efeitos (storage, rede, sessão) isolados |
| **view** | `panel.js`, `maps.js`, … | DOM vanilla; **eventos delegados** (sem `onclick` inline) |
| **entry** | `index.js` | bundle: instala módulos + `aliasGlobal` p/ compat com legado |

**Por que delegação, não `onclick` inline:** handlers inline executam no **mundo MAIN**
da página, que não enxerga as funções do content script (mundo isolado). Um
`addEventListener` registrado pelo content script roda no mundo isolado e funciona —
inclusive em iframes same-origin (anexar o listener ao `contentDocument`). Ver
`monitorados/panel.js` (dispatcher por `data-act`) e `monitorados/visualizacao.js`.

**Infra compartilhada vira primitivo, não duplicata:** ao migrar uma feature que usa
tablesorter/tagsInput/sortable/chosen/dialog, cria-se/usa-se um primitivo vanilla em
`src/shared/ui/`. A lógica de negócio compartilhada (etiquetas, seleção, preview de
prazo) permanece global até suas features migrarem. As features legadas seguem usando
os plugins jQuery em paralelo — duplicação temporária e esperada.

**Compat durante a transição:** cada função movida é preservada como global via
`aliasGlobal('nome', fn)` (em `src/core/global.js`), então os call-sites do legado
continuam funcionando sem edição. `tests/structure/no-duplicate-core.test.js` trava que
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
