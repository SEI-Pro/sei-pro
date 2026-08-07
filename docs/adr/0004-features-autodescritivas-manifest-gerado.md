# ADR-0004 — Features auto-descritivas; registry e `manifest.json` gerados

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0002, ADR-0005, ADR-0007, ADR-0009

## Contexto

Adicionar ou mover uma feature hoje exige editar três a cinco lugares independentes, sem
nada que verifique a coerência entre eles:

1. `manifest.base.json` — 701 linhas mantidas à mão, definindo em qual bloco o script
   entra e em que ordem;
2. `scripts/build.mjs` — a lista de bundles e a lista de CSS a copiar;
3. `src/app/contexts.js` — o mapa contexto → feature ids;
4. `src/app/register-pilot-features.js` — o registro com `configKey` e `install` (removido
   na implementação incremental; substituído por registries gerados por contexto);
5. a página de options — a chave de configuração que liga a feature.

O resultado medido em 2026-08-07 é duas fontes de verdade que já divergiram. O registry
tem **2 features registradas de 22 pastas** em `src/features/`. O `manifest.base.json` tem
11 blocos de content script assim distribuídos:

| Bloco | Scripts | Contexto |
|---|---|---|
| 1 | 28 | catch-all `*.br/sei/*` |
| 4 | **40** | lista de processos |
| 5 | **40** | lista, iframe |
| 6, 8, 10 | 29 cada | árvore, árvore iframe, visualização HTML |
| 11 | 10 | editor |
| 2, 3, 7, 9 | 1 cada | db, login, arvore-info, quick-highlight |

Os quatro blocos de 1 script são as features migradas. Os blocos de 28 a 40 scripts são a
arquitetura real: composição por ordem de carregamento, com ~1300 globais compartilhados
servindo de contrato implícito entre arquivos.

Só 9 arquivos chamam `publishFeature()`, e o contrato `{ id, api, install }` é cumprido de
forma estrita por 9 das 22 features. As demais publicam formatos ad hoc: `projetos` expõe
só `api` sem `id` nem `install`; `ai`, `editor` e `legis` publicam sacos de métodos;
`controlar-prazos` e `nao-lido` não publicam nada.

A causa raiz não é falta de disciplina — é que o metadado da feature vive **fora** da
feature. Enquanto o registry for escrito à mão em um arquivo central, ele vai divergir do
manifest, e enquanto o manifest for escrito à mão, os blocos gordos não têm pressão para
diminuir.

## Decisão

**Inverter a relação: a feature declara a si mesma; registry e manifest são derivados.**

Cada feature exporta um descritor junto do código, e ele é a única fonte de verdade sobre
onde e quando a feature roda:

```js
// src/features/<id>/feature.js
export default {
    id: 'monitorados',              // estável, kebab-case; nunca muda
    contexts: ['lista', 'arvore'],  // contextos de ADR-0002
    configKey: 'monitorarprocessos',// chave do schema de ADR-0009; null = sempre ativa
    css: ['monitorados.css'],
    permissions: [],                // permissões que a feature exige, para auditoria
    install: installMonitorados,
    api: { /* superfície pública estável */ }
};
```

Derivados, todos gerados por `scripts/`:

- **Registry** — montado por varredura de `src/features/*/feature.js`. `src/app/contexts.js`
  e `register-pilot-features.js` deixam de existir como listas mantidas à mão; o mapa
  contexto → features passa a ser a projeção inversa dos descritores.
- **`manifest.json`** — gerado a partir do registry: um bundle por contexto, mais o CSS
  declarado pelas features daquele contexto, mais os `matches` que vêm de `src/sei/pages.js`
  (ADR-0003). Alvo: **um script por bloco**, contra os 40 atuais.
- **Entradas do build** — `scripts/build.mjs` deriva a lista de bundles dos contextos, em
  vez de mantê-la à mão.
- **Página de options** — deriva a lista de features exibidas dos descritores cruzados com
  o schema de configuração (ADR-0009), eliminando a divergência silenciosa entre feature
  existente e feature configurável.

O contrato público publicado em runtime continua `SeiPro.features.<id> = { id, api, install }`
via `publishFeature()` — para consumidores cross-feature, `.api` é a única superfície.
Complexidade interna (`application/`, `ports/`, `useCases/`) permanece interna e não é
exigida de nenhuma feature.

**Sequência obrigatória.** A geração do manifest só entra depois de os snapshots de
`matches` e de ordem de scripts estarem estáveis
(`tests/structure/manifest-contexts.test.js`), porque um erro em `matches` não quebra
teste — quebra silenciosamente para o usuário, sem a extensão nem carregar.

## Consequências

**Ganhamos:** OCP de fato — adicionar feature é criar uma pasta com um descritor, sem tocar
manifest, build ou registry; impossibilidade estrutural de divergência entre "feature
existe", "feature carrega" e "feature é configurável"; blocos de manifest enxutos, com
ganho direto de tempo de carregamento em toda página do SEI; auditoria de permissões por
feature, útil para a revisão da Chrome Web Store.

**Pagamos:** um passo de geração no build, com o risco clássico de artefato gerado
divergir da fonte — mitigado por `--check` em CI (falha se o manifest commitado não é o
que a geração produz), no mesmo padrão dos scripts `loop:map:check` já existentes. Também
pagamos a migração dos blocos gordos, que é o trabalho mais longo do roadmap e precisa do
smoke manual como portão a cada contexto.

**Fica proibido:** adicionar bloco de content script à mão depois de a geração entrar;
manter lista de features em arquivo central; feature sem descritor; gerar manifest antes
dos snapshots de `matches`.

### Implementação incremental

O primeiro registry manual do piloto foi removido. Hoje o build gera e verifica um arquivo
por contexto exclusivo (`src/generated/login-feature-registry.ts`,
`src/generated/db-feature-registry.ts`, `src/generated/lista-feature-registry.ts`,
`src/generated/arvore-feature-registry.ts`, `src/generated/documento-feature-registry.ts`,
`src/generated/visualizacao-feature-registry.ts` e
`src/generated/editor-feature-registry.ts`). Login, db, arvore e as sete capacidades
modernas da lista, `arvore-info`, `quick-highlight`, `visualizacao` e `editor` deixaram de
ser `wired`: suas entries importam diretamente o registry gerado, enquanto contextos ainda
não migrados permanecem `declared` ou `wired` e continuam usando o caminho legado até uma
fatia posterior. As páginas de `options` e o service worker têm entries próprias, mas não
participam do registry de features porque não são contextos de página de capacidade.

## Verificação

- `tests/structure/feature-descriptor.test.js` — **toda** pasta em `src/features/` tem
  `feature.js` válido: `id` kebab-case único e igual ao nome da pasta, `contexts` contendo
  apenas contextos conhecidos, `configKey` existente no schema (ADR-0009) ou `null`,
  `install` função. Substitui o teste atual, que cobre só 7 features piloto + atividades.
  Ratchet de conformidade, baseline 9 de 22 (ADR-0008).
- `tests/structure/manifest-generated.test.js` — o `manifest.base.json` commitado é
  idêntico ao gerado a partir do registry.
- `tests/structure/manifest-contexts.test.js` — snapshot de `matches` e ordem de scripts
  por contexto (já existe; passa a ser pré-requisito da geração).
- Ratchet do maior bloco de content script: baseline 40 scripts, só pode diminuir.
- `npm run build -- --check` em CI (ADR-0008).

## Alternativas consideradas

**Manter manifest à mão e apenas popular o registry** — mantém as duas fontes de verdade e
portanto a divergência. Foi o que se tentou; o registry parou em 2 de 22.

**Adotar WXT/Plasmo, que geram manifest a partir de convenção de arquivos** — resolveria
isso de fábrica, mas assume controle do bundling, o que colide com a decisão de copiar os
legados verbatim (reversão de Vite + CRXJS). Reavaliar quando os blocos gordos morrerem.

**Descritor em JSON separado do código** (`feature.json`) — perderia o `install` e a
`api`, forçando um segundo ponto de ligação entre metadado e implementação: exatamente o
acoplamento que este ADR remove.
