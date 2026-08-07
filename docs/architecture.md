# Arquitetura — SEI Pro PRF

Mapa de navegação da arquitetura. **Este documento não contém decisões** — descreve o
estado atual medido e aponta para o ADR onde cada decisão vive.

| Documento | Papel |
|---|---|
| [`docs/adr/`](./adr/README.md) | **Decisões** arquiteturais, com motivo e verificação |
| [`docs/implementation-plan.md`](./implementation-plan.md) | **Ordem de execução**: fases, fatias, portões e riscos |
| [`DEVELOPMENT.md`](../DEVELOPMENT.md) | **Manual operacional**: build, migração de feature, checklist |
| este arquivo | **Mapa**: onde as coisas estão hoje e a distância até o alvo |

Por que essa separação: até 2026-08-07 as decisões viviam em prosa aqui e no
`DEVELOPMENT.md`, sem data, motivo nem verificação. O resultado foi deriva medida nas duas
direções — regra descumprida em 73% dos casos porque a regra estava errada, e regra
descrevendo dívida que já não existia. Ver [ADR-0001](./adr/0001-adotar-adrs.md).

---

## O que a extensão é

Um **host de plugins** sobre páginas do SEI, em Manifest V3. A fronteira arquitetural
primária é o **contexto de execução** (service worker, content script isolado, mundo MAIN,
página de options), porque é o MV3 que define capacidade e ciclo de vida; camadas
(Ports & Adapters) vêm depois, dentro de cada contexto.
Ver [ADR-0002](./adr/0002-fronteira-primaria-contexto-de-execucao.md).

```
entries → features → shared → core | sei | platform
```

Nunca o inverso. A única exceção são as raízes de composição em `src/entries/`, que por
definição conhecem tudo.

---

## Estado atual medido

Números de 2026-08-07, reproduzíveis pelos comandos em
`tests/structure/ratchets.test.js`. São os baselines dos ratchets
([ADR-0008](./adr/0008-fitness-functions-e-ratchets.md)) e a medida honesta da distância
até o alvo.

| Dimensão | Hoje | Alvo | ADR |
|---|---|---|---|
| Base tipada | ~384 `.ts` + 24 legados `.js`; **382** `@ts-nocheck` | tipagem sem `@ts-nocheck` | [0014](./adr/0014-typescript-para-codigo-novo.md) |
| Blocos de content script | 11 (maior **40**); `manifest:check` ok | 1 script/contexto gerado | [0004](./adr/0004-features-autodescritivas-manifest-gerado.md) |
| Features com `feature.ts` | **26 declaradas**; maturidade explícita (`declared` / `wired` / `exclusive`) | por capacidade, `exclusive` | [0004](./adr/0004-features-autodescritivas-manifest-gerado.md), [0007](./adr/0007-fronteira-de-feature-por-capacidade.md) |
| Features exclusivas | **3** (`login`, `external-config`, `nao-lido`) | crescente; só estas contam como migradas | [0004](./adr/0004-features-autodescritivas-manifest-gerado.md) |
| ACL `src/sei/` | selectors, pages, supports, parse | concentra o SEI | [0003](./adr/0003-anti-corruption-layer-sei.md) |
| Seletores fora do ACL | 58 | 0 | [0003](./adr/0003-anti-corruption-layer-sei.md) |
| Ramificação `isNewSEI`/`isSEI_5` | 46 | 0 fora de `src/sei/` | [0003](./adr/0003-anti-corruption-layer-sei.md) |
| jQuery `$(` | 91 (~4054 usos) | 0 | [0003](./adr/0003-anti-corruption-layer-sei.md) |
| `getSeiPro()` | 51 (352 refs `SeiPro.`) | 0 fora da raiz | [0005](./adr/0005-raiz-de-composicao-e-injecao-explicita.md) |
| `aliasGlobal` | **176** | 0 dívida; `publishGlobal` no núcleo | [0012](./adr/0012-aliasglobal-publicacao-vs-legado.md) |
| Arquivos > 500 linhas | 45 | decrescente | [0007](./adr/0007-fronteira-de-feature-por-capacidade.md) |
| Chaves no schema | **74** | schema único | [0009](./adr/0009-configuracao-como-schema-unico.md) |
| `console.*` cru | 503 / 93 arquivos | logger injetado | [0005](./adr/0005-raiz-de-composicao-e-injecao-explicita.md) |
| Event bus | **removido** | — | [0013](./adr/0013-remover-bus-nao-utilizado.md) |
| `https://*/*` | **removido** | — | [0015](./adr/0015-fronteiras-de-confianca.md) |
| Testes | 213 arquivos / **1159** testes | — | [0008](./adr/0008-fitness-functions-e-ratchets.md) |
| `dist/` reproduzível | ✅ | — | [0011](./adr/0011-dist-fora-do-versionamento.md) |
| CI | ✅ `.github/workflows/ci.yml` | portão obrigatório | [0008](./adr/0008-fitness-functions-e-ratchets.md) |

**Leitura honesta:** a base bundlada foi renomeada para TypeScript e as features têm
descritores; isso não equivale a base tipada nem a feature migrada. Uma feature só é
**exclusive** quando a raiz de composição a instala e não há auto-boot ou caminho legado
paralelo. O manifesto ainda carrega blocos legados gordos e ~382 arquivos estão sob
`@ts-nocheck`. Duas arquiteturas
ainda convivem — a moderna cresceu (ACL, schema, boot isolado, strangler de atividades); a
legada (24 cópias verbatim, ordem do manifest) ainda executa a maior parte do dia a dia.

---

## Onde as coisas estão

```
src/
├── app/          # registry + boot + publishFeature          → ADR-0004, ADR-0006
├── entries/      # raiz de composição por contexto            → ADR-0005
├── core/         # domínio puro: datas, texto, números, prazos, config
├── sei/          # ACL: versão, seletores, urls, parsing       → ADR-0003
├── platform/     # ports: storage, net, messaging, logger, runtime (único com chrome.*)
├── shared/       # helpers e primitivos de UI vanilla (shared/ui/)
├── config/       # schema + read + migrations                   → ADR-0009
├── features/     # 26 capacidades (incl. stranglers)           → ADR-0004, ADR-0007
├── options/      # página de configuração
├── background/   # service worker MV3 + handlers
├── bootstrap/    # init*.js legados (glue de carga, transitório)
└── content/      # core-stack.js (bundle amplo transitório)
```

Referências de leitura: `src/features/monitorados/` é a feature migrada mais próxima do
alvo; `src/features/editor/lib/domq.js` é o melhor padrão do repositório para sair de
dependência legada (fachada mínima + fitness function travando a regressão);
`src/features/atividades/` é o subsistema a dividir ([ADR-0007](./adr/0007-fronteira-de-feature-por-capacidade.md),
detalhe em [atividades-architecture.md](./atividades-architecture.md)).

---

## Contrato de feature

```js
// src/features/<id>/feature.js — descritor, fonte de verdade (ADR-0004)
export default { id, maturity, contexts, configKey, css, permissions, install, api };

// publicado em runtime para consumidores legados
SeiPro.features.<id> = Object.freeze({ id, api, install });
```

Consumidores cross-feature usam **só** `.api`. Complexidade interna
(`application/`, `ports/`, `useCases/`) é permitida e nunca exigida — e **não** é resposta
para arquivo grande, que é problema de fronteira ([ADR-0007](./adr/0007-fronteira-de-feature-por-capacidade.md)).

Anatomia e regras por camada: [`DEVELOPMENT.md`](../DEVELOPMENT.md).

`maturity` é um contrato verificável: `declared` só descreve a intenção, `wired` tem
instalação nova mas ainda convive com caminho paralelo, e `exclusive` é instalada apenas
pela raiz do contexto. Os registries de `login`, `db` e `lista` são gerados em build a
partir das capabilities `exclusive`; cada bundle importa somente o registry do próprio
contexto, evitando um catálogo global que aumentaria o acoplamento.

---

## Comunicação

| Necessidade | Mecanismo |
|---|---|
| Feature chama feature, mesmo contexto | `SeiPro.features.<id>.api`, ou ligação na raiz de composição |
| Atravessar contexto de execução | mensagem serializável via `platform/messaging.js` |
| Call-site legado ainda não migrado | `aliasGlobal` em `legacy-api.js`, com condição de remoção |

Não usar event bus. Removido em [ADR-0013](./adr/0013-remover-bus-nao-utilizado.md);
comunicação intra-contexto é `feature.api` ou ligação na raiz de composição.

**Atenção ao ler as regras acima e abaixo:** ADR aceito é norma para código novo, não
descrição do que já existe. `feature.js`, `publishGlobal`, o schema de configuração e as
raízes de composição por contexto são o alvo; a tabela de estado atual mede quanto falta.

---

## Regras não negociáveis

Cada uma tem verificação executável; regra sem verificação não é regra
([ADR-0008](./adr/0008-fitness-functions-e-ratchets.md)).

1. **`src/`, `vendor/` e `assets/` são a fonte da verdade.** `dist/` é saída gerada, fora
   do git, reproduzível byte a byte ([ADR-0011](./adr/0011-dist-fora-do-versionamento.md)).
   Asset novo entra por `scripts/asset-manifest.mjs`, nunca direto em `dist/`.
2. **Direção de dependência** nunca invertida; feature não importa internals de feature.
3. **Domínio puro**: sem DOM, `window`, `chrome.*`, jQuery ou `localStorage`.
4. **Conhecimento do SEI só em `src/sei/`**: nenhum seletor, URL ou ramificação de versão
   fora do ACL ([ADR-0003](./adr/0003-anti-corruption-layer-sei.md)).
5. **`chrome.*` só em `platform/`, `background/` e `options/`.**
6. **Mundo isolado por padrão**; a única exceção é a ponte serializável do CKEditor.
7. **Sem handler inline novo**; ações por `data-act` e delegação.
8. **CSS com prefixo `.seipro-`** (BEM).
9. **`aliasGlobal` só em `legacy-api.js`, com condição de remoção**; publicação de
   namespace do núcleo é `publishGlobal` e é outra coisa
   ([ADR-0012](./adr/0012-aliasglobal-publicacao-vs-legado.md)).
10. **Falha de feature não derruba o contexto** ([ADR-0006](./adr/0006-isolamento-de-falha-por-feature.md)).

---

## Roadmap

Resumo. Fatias, portões e riscos em
**[docs/implementation-plan.md](./implementation-plan.md)**. Ordem por valor, não por
facilidade.

1. **Fundação**: CI, fitness functions e ratchets sobre os baselines desta página
   ([0008](./adr/0008-fitness-functions-e-ratchets.md)), e a renomeação da base para
   TypeScript ([0014](./adr/0014-typescript-para-codigo-novo.md)). Sem isso, tudo abaixo
   regride.
2. **Segurança** ([0015](./adr/0015-fronteiras-de-confianca.md)) — remover permissão curinga,
   `eval` e segredo em `storage.sync`. Barato, imediato e independente do resto.
3. **ACL do SEI** ([0003](./adr/0003-anti-corruption-layer-sei.md)) — maior alavancagem:
   converte quebra do SEI de caçada em 42 arquivos para correção em uma pasta.
4. **Schema de configuração** ([0009](./adr/0009-configuracao-como-schema-unico.md)) —
   pré-requisito dos descritores de feature.
5. **Descritores + registry + manifest gerado** ([0004](./adr/0004-features-autodescritivas-manifest-gerado.md)) —
   mata os blocos de 40 scripts e a divergência entre fontes de verdade.
6. **Raiz de composição e injeção explícita, por contexto**
   ([0005](./adr/0005-raiz-de-composicao-e-injecao-explicita.md), [0006](./adr/0006-isolamento-de-falha-por-feature.md)).
7. **Refronteirização por capacidade**: dividir `atividades`, dissolver `sei-functions`
   ([0007](./adr/0007-fronteira-de-feature-por-capacidade.md)).
8. **Remoção dos `@ts-nocheck`** ([0014](./adr/0014-typescript-para-codigo-novo.md)), em
   paralelo com qualquer item acima: arquivo tocado entra no `strict` no mesmo commit.

Concluído: **resgate de `dist/`** ([0011](./adr/0011-dist-fora-do-versionamento.md)) — os 137
assets sem fonte foram movidos para `vendor/`, `src/css/` e `assets/`; `dist/` saiu do git e é
reproduzível byte a byte a partir de um clone limpo. **Ambiente em container** (`compose.yaml`)
e **verificação de tipos** (`npm run typecheck`) já disponíveis.

Portão de ambiente em toda fase que toque UI: smoke manual no SEI real
([`SMOKE_TEST.md`](../SMOKE_TEST.md)). Os testes não reproduzem o DOM nem a autenticação
do SEI.

---

## O que não fazer

- Adotar Plasmo/WXT/CRXJS enquanto o legado for majoritário — a tentativa com Vite + CRXJS
  foi revertida por minificar os legados in-place, destruindo a fonte
  ([ADR-0002](./adr/0002-fronteira-primaria-contexto-de-execucao.md)).
- Passar os 24 arquivos legados copiados verbatim pelo bundler.
- Gerar o manifest antes dos snapshots de `matches` estarem estáveis — erro de `matches`
  não quebra teste, quebra silenciosamente para o usuário
  ([ADR-0004](./adr/0004-features-autodescritivas-manifest-gerado.md)).
- Responder a arquivo grande com subpasta em vez de fronteira
  ([ADR-0007](./adr/0007-fronteira-de-feature-por-capacidade.md)).
- Confiar no `.ts` como se fosse garantia: o esbuild remove tipos **sem verificá-los**. Só
  `npm run typecheck` verifica ([ADR-0014](./adr/0014-typescript-para-codigo-novo.md)).
- Silenciar erro de tipo com `any`, `as any` ou `@ts-ignore` — a dívida se marca com
  `@ts-nocheck`, que é contável ([ADR-0014](./adr/0014-typescript-para-codigo-novo.md)).
- Tipar `atividades` e `sei-functions` antes da fase 5: 52% dos erros estão em código marcado
  para reescrita ([ADR-0014](./adr/0014-typescript-para-codigo-novo.md)).
- Tratar DOM do SEI como confiável, ou pedir permissão curinga de host
  ([ADR-0015](./adr/0015-fronteiras-de-confianca.md)).
- Comitar fixture capturada sem esqueletização — o git não esquece
  ([ADR-0015](./adr/0015-fronteiras-de-confianca.md)).
- Reintroduzir event bus sem dois consumidores reais
  ([ADR-0013](./adr/0013-remover-bus-nao-utilizado.md)).
- Declarar feature migrada com base em movimentação de arquivo.
- Criar regra de arquitetura sem verificação executável
  ([ADR-0008](./adr/0008-fitness-functions-e-ratchets.md)).
