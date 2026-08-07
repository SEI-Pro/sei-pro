# ADR-0007 — Fronteira de feature por capacidade do usuário, não por página do SEI

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0004, ADR-0009

## Contexto

As pastas em `src/features/` herdaram suas fronteiras dos arquivos legados do fork
original, não de uma decisão de design. Isso produziu os dois extremos ao mesmo tempo.

**Features gigantes.** `src/features/atividades/` tem cerca de 25 mil linhas, com 14
arquivos acima de 800 linhas:

| Arquivo | Linhas |
|---|---|
| `config-options.js` | 5458 |
| `config-panel.js` | 2743 |
| `activity-actions.js` | 2411 |
| `activity-work.js` | 2362 |
| `afastamentos.js` | 2074 |
| `activity-form.js` | 1948 |
| `config-table.js` | 1875 |

Isso não é uma feature; é um subsistema com pelo menos quatro capacidades distintas
(registro de atividades, afastamentos, avaliações, e um administrador de configuração de
5458 linhas que é praticamente um produto separado). Nenhum desses quatro arquivos maiores
tem teste dedicado.

**Feature que é saco de gatos.** `src/features/sei-functions/` reúne 14 arquivos grandes
sem coesão temática — `batch-capa.js` (1484), `notifications-process.js` (1277),
`editor-captcha.js` (1003), `tags-menus.js` (854), `image-docs.js` (699),
`media-viewers.js` (517). O nome descreve o arquivo legado de origem
(`sei-functions-pro.js`), não uma capacidade.

A resposta anterior a arquivos grandes foi organizacional: o "tier C" do
`docs/architecture.md`, que adiciona `application/`, `ports/` e `useCases/` **dentro** da
feature. Isso arruma a gaveta sem mudar a fronteira: `atividades` continua sendo uma
unidade de 25 mil linhas que se instala, versiona e quebra junto.

Existe um mapa de capacidades pronto e não usado como insumo de design: os ~80 arquivos em
`pages/` (`ACOESEMLOTE.md`, `CONTADORPROCESSOICONE.md`, `PRAZOS.md`, …) descrevem as
funcionalidades do ponto de vista do usuário, e os CSVs em
`docs/mapping-funcoes-configuracoes/` já ligam função a opção de configuração.

## Decisão

**Uma feature corresponde a uma capacidade que o usuário reconhece e liga/desliga.**

Teste de fronteira, ambos obrigatórios:

1. Tem uma chave de configuração própria no schema (ADR-0009) que o usuário ativa e
   desativa na página de options.
2. Dá para descrever em uma frase para o usuário final, sem falar de arquivo, página ou
   implementação.

Se uma pasta não passa nos dois, ela não é uma feature: é um subsistema a dividir
(`atividades`) ou uma coleção a dissolver (`sei-functions`).

Consequências operacionais:

- **`atividades` é dividida** em features com fronteira própria, sendo a administração de
  configuração a primeira separação óbvia. Cada uma com seu descritor (ADR-0004) e sua
  `configKey`.
- **`sei-functions` é dissolvida.** Cada cluster migra para uma feature nomeada pela
  capacidade. A pasta desaparece; não é renomeada.
- **`pages/` e os CSVs de `docs/mapping-funcoes-configuracoes/` são o insumo canônico** para
  nomear features e escolher fronteiras. Nome de feature reflete o vocabulário do usuário,
  não o do arquivo legado.
- Feature nova nasce nesse formato. Não se adiciona função a `sei-functions`.
- Um subsistema legítimo pode ter complexidade interna (`application/`, `ports/`), mas isso
  é decisão interna e **não é justificativa para fronteira grande**.

## Consequências

**Ganhamos:** unidade de mudança do tamanho da unidade de decisão do usuário — o que faz o
isolamento de falha (ADR-0006) significar algo, porque "atividades caiu" hoje significa
metade do produto; features testáveis, porque uma capacidade tem contrato enunciável;
página de options que reflete a estrutura do código sem tradução.

**Pagamos:** a divisão de `atividades` é o trabalho mais arriscado do roadmap — 25 mil
linhas sem teste nos arquivos maiores, e o smoke manual é o único portão de comportamento
real. Precisa ser fatiada por capacidade, com teste de domínio escrito **antes** do corte,
nunca por movimentação de arquivo em lote. Também aumenta o número de pastas, o que só é
ganho se os descritores forem gerados (ADR-0004) — à mão, seria mais um lugar para divergir.

**Fica proibido:** feature nomeada por arquivo legado ou por página do SEI; adicionar
comportamento novo a `sei-functions`; usar "tier C" como resposta a arquivo grande;
dividir subsistema movendo arquivo sem antes cobrir o domínio com teste.

## Verificação

- `tests/structure/feature-descriptor.test.js` (ADR-0004) — toda feature tem `configKey`
  presente no schema (ADR-0009) ou `null` justificado no descritor.
- Ratchet de arquivos acima de 500 linhas em `src/`, baseline **42**, só pode diminuir
  (ADR-0008).
- Ratchet de linhas em `src/features/sei-functions/`, decrescente até a pasta não existir.
- `tests/structure/capability-coverage.test.js` — toda `configKey` do schema é reivindicada
  por exatamente um descritor de feature; toda feature tem página correspondente em `pages/`
  ou marca explicitamente `undocumented: true`.

## Alternativas consideradas

**Manter as fronteiras e resolver tamanho com subpastas (tier C)** — é o estado atual.
Organiza sem desacoplar: a unidade de instalação, versionamento e falha continua a mesma.

**Uma feature por página do SEI** — parece natural pelo manifest, mas várias capacidades
atravessam páginas (monitorados aparece em lista e árvore) e várias páginas hospedam
capacidades independentes. Página é contexto de execução (ADR-0002), não fronteira de
domínio.

**Dividir `atividades` por camada técnica** (uma feature de UI, uma de dados) — cria
fronteiras que não correspondem a nenhuma decisão do usuário e maximiza o acoplamento
entre as partes resultantes.
