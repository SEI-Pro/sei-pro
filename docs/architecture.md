# Arquitetura canônica — SEI Pro PRF

Fonte de verdade do design de alto nível. Detalhes operacionais de build, migração
e checklist diário continuam em [DEVELOPMENT.md](../DEVELOPMENT.md). O verificador
pós-implementação é [`.cursor/agents/architecture-verifier.md`](../.cursor/agents/architecture-verifier.md).

---

## Princípio

A extensão é um **host de plugins** sobre páginas do SEI:

1. **Contextos** — lista, árvore, editor, visualização, login, db, options, background
2. **Features** — plugins instaláveis (`configKey` + contextos)
3. **Ports de plataforma** — `storage`, `net`, `messaging`, `llm` em `platform/` / service worker

```
features → shared → core | sei | platform
app / entries → features
```

Nunca o inverso. Uma feature nunca importa internals de outra; só `SeiPro.features.<id>.api`
ou eventos do bus.

---

## Contrato público de feature

Toda feature publicada expõe **apenas**:

```js
SeiPro.features.<id> = Object.freeze({
  id,       // string estável (kebab ou camel do namespace)
  api,      // comandos/consultas estáveis para entries e outras features
  install   // (ctx?) => void | cleanup
});
```

Campos extras internos (`useCases`, `ports`, `view`, …) podem existir **dentro** da
feature ou sob `api`, mas consumidores cross-feature usam só `.api` / `.install`.

### Tiers internos (não são dois padrões concorrentes)

| Tier | Quando | Anatomia |
|------|--------|----------|
| **S (simples)** | Maioria das features | `domain` + `io` + `view` + `index` + opcional `legacy-api` + `style.css` |
| **C (complexo)** | Servidor, muitos handlers, várias UIs | Tier S + `application` / `ports` / `useCases` (ex.: atividades) |

A complexidade hexagonal é **interna**. O público continua `{ id, api, install }`.

Exemplos canônicos:

- Tier S: `src/features/monitorados/`, `src/features/login/`
- Tier C: `src/features/atividades/` (ver [atividades-architecture.md](./atividades-architecture.md))

### `legacy-api.js`

Único lugar com `aliasGlobal`. Dívida explícita com TODO e condição de remoção.
Não faz parte do contrato público moderno.

### Critério de “feature migrada”

- Domínio sem DOM / `window` / jQuery / `chrome.*` / `localStorage`
- IO concentra storage/rede/sessão e não chama view
- View vanilla, eventos delegados, CSS `.seipro-*`
- Sem `body.js` / monolito carregando o comportamento
- Superfície `{ id, api, install }` publicada
- Testes de domínio/IO + smoke SEI quando UI for afetada

Shells que só embrulham `body.js` **não** contam como migrados.

---

## Runtime: app (registry + boot)

```
src/app/
├── contexts.js           # contexto → matches, css, feature ids
├── feature-registry.js   # id, configKey, contexts, install
└── boot.js               # lê config e instala features do contexto
```

Entries em `src/entries/` são finas: `installCoreStack` (ou stack mínima) + `boot(contextId)`.

Piloto: contextos `login` e `db`. Demais contextos migraram incrementalmente; o
`core-stack.bundle.js` amplo permanece enquanto houver blocos legados no manifest.

Geração automática de manifest só depois de testes de snapshot de `matches` / ordem
de scripts (ver `tests/structure/manifest-contexts.test.js`).

---

## Comunicação

| Mecanismo | Uso |
|-----------|-----|
| `feature.api` | Chamada síncrona / comando entre features |
| `platform/bus.js` | Reação a eventos transversais nomeados |
| `legacy-api` / globais | Só call-sites ainda não migrados |

Eventos do bus (whitelist):

- `config:changed`
- `monitorados:updated`
- `process-list:refreshed`
- `atividades:response` (alias documentado do evento DOM legado quando migrar)

Não usar bus intra-feature. Não introduzir Redux/store global.

---

## Camadas e SOLID (aplicado)

| Camada | Pasta | Prática |
|--------|-------|---------|
| Domínio puro | `features/*/domain*`, `core/*` | SRP; vitest sem chrome/DOM |
| Aplicação | `index` / `application` | Orquestra domain + ports |
| Ports | `platform/*`, `features/*/io` | DIP — sem `chrome.*` direto na feature |
| Adapters | `background/*-handler`, `sei/*`, views | ISP — handlers pequenos |
| Composição | `src/app/boot`, `entries/*` | OCP — nova feature = registro |

`core/stack.js` instala **somente** núcleo puro + platform + sei. Helpers de feature
(`quickfilter`, `sticknote`, `docslote`, …) vivem em `shared/` ou na feature e são
instalados pelo entry/contexto ou pelo `core-stack` transitório — nunca como “core eterno”.

---

## Mundo isolado e CSS

- Código novo no isolated world. CKEditor em MAIN só via ponte serializável documentada.
- Sem novos `onclick`/`onchange` inline; não expandir `legacy-inline-bridge`.
- Classes `.seipro-*` (BEM). Sem Shadow DOM neste host.

---

## Roadmap de engenharia (ordem)

1. Contrato `{ id, api, install }` + tiers S/C (este doc)
2. Limpar `core/stack` (shared/feature modules)
3. `src/app/` piloto em `login` / `db`
4. Eliminar monolitos reais (`lista-processos/body.js`, `arvore/body.js`)
5. Unificar consumidores em `.api` + bus leve
6. Manifest enxuto por contexto + snapshots; gerar manifest depois
7. P6 CSS `.seipro-*` em lote por épico fechado

---

## O que não fazer

- Adotar Plasmo/WXT/CRXJS enquanto o legado ainda for majoritário
- Exigir Tier C em toda feature
- Declarar migração completa com `body.js` intacto
- Gerar manifest automaticamente sem snapshots
- Event bus genérico tipo Redux
