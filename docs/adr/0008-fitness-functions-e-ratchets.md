# ADR-0008 — Regra de arquitetura só existe se for verificada por máquina

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0001, todos os demais

## Contexto

Este é o ADR que sustenta os outros. Sem ele, os demais são intenção.

O projeto tinha um conjunto coerente de regras de arquitetura em prosa. A medição de
2026-08-07 mostra o que aconteceu com elas:

| Regra documentada | Realidade medida |
|---|---|
| `aliasGlobal` só em `legacy-api.js` | 136 de 186 chamadas fora — porque a regra estava errada (ADR-0012) |
| Contrato `{ id, api, install }` em toda feature | 9 de 22 features |
| `body.js` como monolito ativo a eliminar | 0 arquivos `body.js` — a dívida listada já não existia |
| Logging central por `platform/logger.js` | 492 `console.*` crus em 92 arquivos; 3 arquivos usando o logger |
| `bus.js` como mecanismo de comunicação | 1 emissor, 0 assinantes (ADR-0013) |

A deriva foi nas duas direções: regra violada em massa e regra descrevendo dívida
inexistente. Nenhuma das duas é detectável por leitura, e nenhuma foi detectada por meses.

Ao mesmo tempo, o projeto **já tem** o mecanismo certo e não o aplicou às regras que
importam: 49 arquivos em `tests/structure/` são fitness functions — testes que falham quando
alguém viola design, não comportamento. `tests/structure/editor-architecture.test.js` é o
caso exemplar: travou a saída do jQuery no editor, e por isso 30 arquivos do editor migraram
para `domq.js` sem regredir. Onde houve verificação, a regra se manteve.

Falta o portão. Não existe `.github/` no repositório: nenhum CI. Nenhum linter, formatter ou
checagem de tipos. Testes rodam se alguém lembrar de rodar.

## Decisão

**Toda regra de arquitetura declarada num ADR tem uma verificação executável, ou não é
regra.** A seção "Verificação" do template de ADR é obrigatória; um ADR sem ela só é aceito
com a justificativa explícita `Nenhuma — decisão de processo`.

Dois mecanismos.

**1. Fitness functions** (`tests/structure/`) para regras binárias: direção de dependência,
pureza de domínio, fronteira de `chrome.*`, contrato de descritor, seletor do SEI fora do
ACL. Falha é falha.

**2. Ratchets** para dívida herdada, que é grande demais para zerar de uma vez. Uma métrica
com baseline fixado em arquivo versionado, que **só pode diminuir**. Aumentar quebra o build;
diminuir exige atualizar o baseline no mesmo commit. É o que permite migração longa sem
regressão, e substitui a tabela de "violações conhecidas" que apodreceu.

Baselines iniciais, medidos em 2026-08-07 e registrados em
`tests/structure/ratchets.baseline.json`:

| Métrica | Baseline | ADR |
|---|---|---|
| Arquivos com `getSeiPro()` | 50 | 0005 |
| Ocorrências de `SeiPro.` | 338 | 0005 |
| Arquivos com jQuery `$(` | 91 | 0003 |
| Ocorrências de `$(` | 3611 | 0003 |
| Arquivos com seletor do SEI fora de `src/sei/` | 36 | 0003 |
| Arquivos com `controlador.php` fora de `src/sei/` | 37 | 0003 |
| Arquivos com ramificação `isNewSEI`/`isSEI_5` | 42 | 0003 |
| Ocorrências de `console.*` cru | 492 | — |
| Arquivos com `console.*` cru | 92 | — |
| Arquivos acima de 500 linhas | 42 | 0007 |
| Features fora do contrato canônico | 13 de 22 | 0004 |
| Scripts no maior bloco de content script | 40 | 0004 |
| Chamadas `aliasGlobal` de compatibilidade legada | 50 | 0012 |

**3. CI como portão.** `.github/workflows/ci.yml` roda em todo push e pull request:
`npm run build`, `npm test` (inclui fitness functions e ratchets), verificação de que o
manifest gerado bate com o commitado (ADR-0004), e `tsc --noEmit` do `checkJs` (ADR-0010).
Sem CI verde, nada entra.

O agente `.cursor/agents/architecture-verifier.md` continua útil como revisor de julgamento
— coisas que máquina não mede, como se a fronteira escolhida faz sentido. Mas ele deixa de
ser o guardião das regras mecânicas: essas o CI cobra. Um verificador que depende de o
agente ser invocado não é portão.

## Consequências

**Ganhamos:** regra que não apodrece, porque a divergência aparece no commit que a causa, não
meses depois; progresso de migração visível como número em vez de prosa; o baseline vira o
board de engenharia real; possibilidade de delegar migração a agentes com portão objetivo.

**Pagamos:** falso positivo custa tempo de quem está com a mão na massa — mitigado por lista
de exceções explícita, sempre com ADR ou TODO com condição de remoção, nunca por
enfraquecer a regra. Ratchet também tem custo de manutenção: baixar o baseline no mesmo
commit da melhoria é ruído no diff, aceito como o preço do travamento. E há o risco de
otimizar a métrica em vez do design (mover `console.log` para um wrapper trivial só para
baixar o número) — isso é responsabilidade da revisão humana, não do ratchet.

**Fica proibido:** aumentar um baseline (só diminui; aumento exige ADR explicando);
introduzir regra em ADR sem verificação; usar `skip` em fitness function sem TODO com
condição; fazer merge com CI vermelho.

## Verificação

Auto-referente, e de propósito:

- `tests/structure/ratchets.test.js` — recalcula cada métrica e compara com o baseline;
  falha se subiu; falha também se **desceu** sem o baseline ter sido atualizado, para que a
  melhoria seja registrada.
- `tests/structure/adr.test.js` (ADR-0001) — todo ADR aceito tem seção "Verificação"
  não vazia.
- CI é o portão de tudo isso.

## Alternativas consideradas

**Revisão humana e boa disciplina** — é o que existia. Falhou de forma medida: a tabela de
dívida ficou desatualizada nas duas direções e ninguém percebeu.

**ESLint com regras customizadas em vez de testes de estrutura** — melhor ergonomia no
editor para regras locais (`no-console`, imports proibidos), e vale adotar para essas. Mas
não expressa regra global de grafo ("nenhum arquivo fora de `src/sei/` conhece seletor do
SEI") nem ratchet numérico. Os dois mecanismos são complementares; `tests/structure/` é o
que sustenta as regras deste conjunto de ADRs.

**Metas de cobertura de código** — mede quantidade de teste, não conformidade de
arquitetura. 184 arquivos de teste convivem com `config-options.js` de 5458 linhas sem
nenhum teste; cobertura global não teria acusado isso.
