# ADR-0001 — Adotar ADRs como registro de decisões arquiteturais

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0008

## Contexto

O projeto é um fork de [pedrohsoaresadv/sei-pro](https://github.com/pedrohsoaresadv/sei-pro)
em modernização. A arquitetura-alvo estava documentada em `docs/architecture.md` e
`DEVELOPMENT.md` como um conjunto de regras em prosa, sem registro do motivo de cada regra
nem de qual restrição a produziu.

Isso produziu três falhas observadas em 2026-08-07:

1. **Regras descrevendo dívida inexistente.** `DEVELOPMENT.md` listava
   `src/features/lista-processos/body.js` e `src/features/arvore/body.js` como monolitos
   ativos. Não existe nenhum arquivo `body.js` no repositório
   (`rg --files src -g 'body.js'` → vazio).
2. **Regras erradas apresentadas como violações.** "`aliasGlobal` só em `legacy-api.js`"
   é descumprida em 136 de 186 chamadas — e todas as 136 estão em `src/core/`,
   `src/platform/` e `src/sei/`, onde `aliasGlobal` é o mecanismo legítimo de publicação
   do núcleo, não dívida de legado (ver ADR-0012).
3. **Abstração documentada sem uso.** `src/platform/bus.js` é descrito como mecanismo de
   comunicação entre features; tem 1 emissor e 0 assinantes (ver ADR-0013).

Em todos os casos, quem lê o documento não consegue saber se está diante de uma decisão
vigente, de uma intenção antiga ou de um erro — porque não há data, motivo nem status.

Existe também uma decisão histórica valiosa registrada apenas como nota de rodapé: a
tentativa com Vite + CRXJS foi revertida porque minificava os arquivos legados in-place,
destruindo a fonte. Sem esse registro, alguém repete o erro.

## Decisão

Toda decisão que restringe estrutura, dependências, build, empacotamento, fronteiras de
módulo ou fronteiras de confiança é registrada como ADR em `docs/adr/`, numerado
sequencialmente, seguindo `_template.md`.

Consequências operacionais:

- `docs/architecture.md` deixa de ser a fonte das decisões e passa a ser um **mapa
  navegável**: descreve o estado atual medido e aponta para os ADRs.
- `DEVELOPMENT.md` continua sendo o manual operacional (build, checklist, como migrar
  uma feature). Não contém decisão arquitetural, apenas a aplica.
- ADR aceito é imutável. Reversão é um novo ADR que substitui o anterior.
- Decisões arquiteturais já tomadas e ainda vigentes foram retroativamente registradas
  em ADR-0002 a ADR-0013 nesta data, com o contexto medido no momento da escrita.

## Consequências

**Ganhamos:** rastro de *por quê*, o que permite revisar uma decisão sem arqueologia de
git; um lugar único onde "isto é norma" se distingue de "isto é intenção"; onboarding de
humano ou agente em cima de decisões datadas em vez de prosa sem dono.

**Pagamos:** overhead de escrita por decisão estrutural. Mitigado pelo escopo estreito —
ADR é para decisão que restringe estrutura, não para escolha de implementação local.

**Fica proibido:** introduzir regra de arquitetura nova diretamente em `DEVELOPMENT.md`
ou em comentário de código sem ADR correspondente; editar ADR aceito para mudar a decisão.

## Verificação

Teste de estrutura em `tests/structure/adr.test.js`:

- todo arquivo em `docs/adr/` casa `NNNN-*.md` e tem `Status:` entre os valores válidos;
- todo ADR está listado no índice do `README.md`;
- ADR marcado `Substituído por NNNN` aponta para um ADR existente.

## Alternativas consideradas

**Manter tudo em `DEVELOPMENT.md`** — é justamente o arranjo que produziu as três falhas
acima. Documento longo, sem data e sem status não distingue norma de intenção.

**RFCs em pull requests** — o histórico de discussão fica no GitHub, não no repositório,
e não é legível offline por agentes. Um fork mantido por equipe pequena não sustenta
processo de RFC.
