# ADR-0012 — Separar publicação de namespace de alias legado; a regra antiga estava errada

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0005, ADR-0008
- **Corrige:** a regra "`aliasGlobal` só em `legacy-api.js`" de `docs/architecture.md` e
  `DEVELOPMENT.md`

## Contexto

A regra documentada era: **`aliasGlobal` só pode aparecer em `legacy-api.js`**, e o
verificador de arquitetura a classificava como BLOCKER.

Medido em 2026-08-07: `aliasGlobal` é chamado **186** vezes em 43 arquivos, e **136** dessas
chamadas estão fora de arquivos `*legacy-api.js`. Um descumprimento de 73%.

Ao olhar *onde*, fica claro que o problema não é o código. Todas as 136 estão em
`src/core/`, `src/platform/` e `src/sei/`:

| Arquivo | Chamadas |
|---|---|
| `src/core/texto.js` | 19 |
| `src/core/numeros.js` | 13 |
| `src/platform/webstore.js` | 10 |
| `src/platform/report.js` | 9 |
| `src/core/helpers.js`, `validacao.js` | 8 cada |
| `src/core/util.js` | 7 |
| `src/core/cor.js`, `datas.js`, `prazos.js`, `src/sei/urls.js` | 6 cada |
| … 12 outros arquivos de `core`/`platform`/`sei` | 1 a 5 cada |

Essas chamadas não são pontes para call-sites legados a remover. São o mecanismo pelo qual o
núcleo **se publica** para os 24 arquivos legados copiados verbatim e para os blocos de
manifest com 28 a 40 scripts, que dependem de nomes globais por contrato. O núcleo não tem
outra forma de ser consumido por eles.

Ou seja: a regra proibia o mecanismo de publicação do núcleo confundindo-o com dívida de
compatibilidade. Uma regra descumprida em 73% dos casos e classificada como BLOCKER não
protege nada — ela apenas ensina a equipe a ignorar o verificador, e esconde os 50 casos que
de fato são dívida.

## Decisão

Separar dois conceitos que estavam sob o mesmo nome, com regras diferentes para cada um.

**1. Publicação de namespace** — como `core`, `platform` e `sei` se expõem aos consumidores
legados que só falam global. É legítima, esperada, e não é dívida de feature.

- Permitida em `src/core/`, `src/platform/` e `src/sei/`.
- Feita por uma função com nome próprio, `publishGlobal(name, value)`, distinta de
  `aliasGlobal`, para que a intenção seja legível e mensurável separadamente.
- Morre junto com os blocos legados do manifest (ADR-0004), não antes.

**2. Alias legado** (`aliasGlobal`) — ponte de compatibilidade de uma **feature** para
call-sites que ainda não migraram. É dívida.

- Permitido **apenas** em `src/features/*/legacy-api.js`, `src/shared/*-legacy-api.js` e
  `src/entries/*/legacy-api.js`.
- Cada chamada exige TODO com **condição de remoção** — qual call-site precisa migrar.
- Nunca em `domain`, `io`, `view` ou `index` de feature.
- Baseline 50 chamadas, decrescente por ratchet (ADR-0008).

**3. `SeiPro` como fachada** (ADR-0005) — publicada apenas na raiz de composição, não por
auto-registro de módulo. Complementar às duas regras acima e o destino de longo prazo das
duas.

O verificador de arquitetura é corrigido: BLOCKER passa a ser `aliasGlobal` fora dos
arquivos `legacy-api`, ou `publishGlobal` fora de `core`/`platform`/`sei`.

## Consequências

**Ganhamos:** o número de violações passa a medir dívida real (50) em vez de ruído (186), o
que torna o ratchet significativo; a intenção de cada chamada fica legível no nome; o
verificador volta a ser confiável, o que importa mais que qualquer violação individual —
verificador que erra em 73% treina a equipe a ignorá-lo.

**Pagamos:** renomear 136 call-sites (mecânico, sem mudança de comportamento) e a
introdução de um segundo nome para algo parecido, que exige entender a distinção. Sem a
distinção, porém, não é possível medir dívida.

**Fica proibido:** `aliasGlobal` fora dos arquivos `legacy-api` autorizados;
`aliasGlobal` sem TODO com condição de remoção; `publishGlobal` fora de
`core`/`platform`/`sei`; auto-registro de módulo em `SeiPro` (ADR-0005).

## Verificação

- `tests/structure/globals.test.js` — `aliasGlobal` apenas nos arquivos `legacy-api`
  autorizados e sempre acompanhado de TODO; `publishGlobal` apenas em
  `src/core/`, `src/platform/`, `src/sei/`.
- Ratchet de `aliasGlobal`, baseline **50**, decrescente (ADR-0008).
- Ratchet de `publishGlobal`, baseline **136**, decrescente conforme os blocos legados do
  manifest morrem (ADR-0004).

## Alternativas consideradas

**Manter a regra e migrar as 136 chamadas para arquivos `legacy-api.js` em `core/`** —
cumpriria a letra da regra e pioraria o desenho: espalharia a publicação do núcleo por
arquivos-ponte artificiais e continuaria misturando publicação com dívida na mesma métrica.

**Simplesmente relaxar a regra para "`aliasGlobal` é permitido em `core`/`platform`/`sei`"**
— resolve o falso positivo e perde a distinção: as duas coisas continuariam contadas juntas,
e o ratchet de dívida não teria significado.

**Eliminar globais agora** — impossível enquanto existirem 24 arquivos legados copiados
verbatim que os consomem por contrato. É o destino (ADR-0005), não o próximo passo.
