# DEVELOPMENT — SEI Pro PRF

Documentação técnica para desenvolvimento e manutenção da extensão. Para informações de uso, veja o [README](./README.md).

---

## Ambiente

A extensão usa **Vite + CRXJS** para empacotar a camada `src/` (módulos ES) em `dist/`.
Scripts legados (`sei-functions-pro.js`, `init_*.js`, `lib/`) ainda vivem em `dist/` e
serão migrados incrementalmente na Fase 6.

**Instalação e build:**
```bash
npm install
npm run build    # gera/atualiza dist/ (carregar unpacked em chrome://extensions)
npm run dev      # Vite dev server com HMR (CRXJS)
```

**Testes unitários (dev-only, não vão para `dist/`):**
```bash
npm test
```

**Para desenvolver a camada core/sei (módulos ES):**
1. Edite arquivos em `src/core/` e `src/sei/`
2. Execute `npm run build`
3. Atualize a extensão em `chrome://extensions/` e recarregue a página do SEI

**Para desenvolver scripts legados** (`sei-pro.js`, `init_*.js`, etc.):
1. Edite diretamente em `dist/js/`
2. Execute `npm run build` (reempacota sem apagar legados — `emptyOutDir: false`)
3. Recarregue a extensão e a página do SEI

Execute `npm test` antes de fechar mudanças em utilitários do `src/core/`.

---

## Arquitetura em camadas (`dist/js/core/` e `dist/js/sei/`)

A migração arquitetural introduz fronteiras explícitas carregadas **antes** dos `init_*.js` via `manifest.json`:

| Camada | Arquivos | Responsabilidade |
|---|---|---|
| Namespace | `core/namespace.js` | `window.SeiPro` e aliases de estado |
| Runtime | `core/runtime.js` | `getUrlExtension`, manifest, path da extensão |
| Util | `core/util.js` | Funções puras (`compareVersionNumbers`, `getParamsUrlPro`, …) |
| Bootstrap | `core/bootstrap.js` | `_P`, `getPathExtensionPro`, session namespace |
| Config | `core/config.js` | `verifyConfigValue`, `getConfigValue` |
| UI | `core/ui.js` | `loadFontIcons`, `loadStyleDesign`, … |
| Messaging | `core/messaging.js` | Transporte `runtime.sendMessage` |
| Logger | `core/logger.js` | Log debug condicionado a `debugpage` |
| Storage/Net | `core/storage.js` | Fachadas delegadas ao service worker |
| SEI version | `sei/version.js` | Detecção SEI 4.x / 5.x |
| SEI adapter | `sei/adapter.js` | Seletores neutros por versão |
| SEI URLs | `sei/urls.js` | Parsing e construção de query strings |

Funções legadas permanecem como aliases globais (`getUrlExtension`, etc.) para compatibilidade incremental.

### Smoke test manual (gate entre fases)

Antes de fechar mudanças arquiteturais, validar no SEI:

- [ ] Lista de processos (agrupamento, favoritos, Kanban)
- [ ] Árvore de documentos (menus rápidos, upload)
- [ ] Editor de documentos (atalhos, auto-save)
- [ ] Visualização de documento (marca d'água, numeração)

---

## Estrutura

```
src/                               # Módulos ES (Fase 5) — fonte da camada core/sei
├── core/                          # namespace, runtime, util, config, storage, …
├── sei/                           # version, adapter, urls
├── content/core-stack.js          # entry point bundled nos content scripts
└── background/index.js            # service worker (ES module)

dist/                              # Saída do build + scripts legados
├── assets/                        # Bundles gerados (core-stack, background loader)
├── js/
│   ├── core/                      # Legado IIFE (substituído pelo bundle após build)
│   ├── sei/                       # Legado IIFE (substituído pelo bundle após build)
│   ├── sei-functions-pro.js       # Funções utilitárias, configuração, localStorage
│   ├── sei-pro.js                 # Lista de processos, Kanban, agrupamentos
│   ├── sei-pro-editor.js          # CKEditor — tabelas, atalhos, auto-save, IA
│   ├── sei-pro-arvore.js          # Árvore de documentos — menus, drag & drop
│   ├── sei-pro-ai.js              # IA — OpenAI, Gemini, Ollama
│   ├── sei-pro-all.js             # Funcionalidades em todas as páginas
│   ├── sei-pro-favoritos.js       # Favoritos
│   ├── sei-pro-projetos.js        # Projetos e Gantt
│   ├── sei-pro-atividades.js      # Kanban de atividades
│   ├── sei-pro-prescricoes.js     # Controle de prazos
│   ├── sei-pro-docs-lote.js       # Documentos em lote
│   ├── sei-pro-visualizacao.js    # Visualizador de documentos
│   ├── sei-pro-icons.js           # Definições de ícones dos menus rápidos
│   ├── sei-legis.js               # Legística (enumeração de normas)
│   ├── background.js              # Service worker (MV3)
│   ├── init.js                    # Inicialização — páginas de processos
│   ├── init_all.js                # Inicialização — todas as páginas
│   ├── init_arvore.js             # Inicialização — árvore de documentos
│   ├── init_db.js                 # Inicialização — configuração de host
│   └── lib/                       # Bibliotecas de terceiros
├── css/
├── html/                          # options.html (página de configurações)
├── icons/
│   └── lab/                       # Ícones da extensão (16, 32, 48, 128px)
├── config_hosts.json              # Configuração por host SEI
└── manifest.json
```

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
