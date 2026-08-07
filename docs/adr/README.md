# ADRs — Architecture Decision Records

Registro das decisões de arquitetura do SEI Pro PRF. Cada ADR captura **uma** decisão,
o contexto medido que a motivou e as consequências aceitas.

Um ADR é imutável depois de aceito. Mudou de ideia? Escreva um novo ADR com status
`Substitui NNNN` e marque o antigo como `Substituído por NNNN`. Não reescreva história.

## Por que ADRs neste projeto

O projeto tinha regras de arquitetura em prosa (`docs/architecture.md`, `DEVELOPMENT.md`)
sem rastro de *por quê* e sem verificação. O resultado, medido em 2026-08-07, foi deriva
nas duas direções: regras descrevendo dívida que já não existia, e regras violadas em 136
lugares porque a regra estava errada, não o código. ADR + fitness function (ADR-0008)
existem para que isso não se repita: a decisão fica registrada com o motivo, e a máquina
cobra o cumprimento.

## Status

| Status | Significado |
|---|---|
| `Proposto` | Escrito, aguardando ratificação humana |
| `Aceito` | Decisão vigente. Vale como norma, mesmo que a implementação esteja em curso |
| `Substituído por NNNN` | Não vale mais |

**Aceito ≠ implementado.** O ADR registra a direção; o progresso da implementação vive nos
ratchets (ADR-0008) e em [`implementation-plan.md`](../implementation-plan.md).

## Índice

### Arquitetura-alvo

| ADR | Decisão |
|---|---|
| [0001](./0001-adotar-adrs.md) | Adotar ADRs como registro de decisões arquiteturais |
| [0002](./0002-fronteira-primaria-contexto-de-execucao.md) | A fronteira arquitetural primária é o contexto de execução, não a camada |
| [0003](./0003-anti-corruption-layer-sei.md) | Isolar o SEI atrás de um Anti-Corruption Layer em `src/sei/` |
| [0004](./0004-features-autodescritivas-manifest-gerado.md) | Features auto-descritivas; registry e `manifest.json` gerados |
| [0005](./0005-raiz-de-composicao-e-injecao-explicita.md) | Raiz de composição por contexto com injeção explícita; `SeiPro` vira fachada de compatibilidade |
| [0006](./0006-isolamento-de-falha-por-feature.md) | Isolar falhas de `install` por feature |
| [0007](./0007-fronteira-de-feature-por-capacidade.md) | Fronteira de feature por capacidade do usuário, não por página do SEI |

### Fundação de engenharia

| ADR | Decisão |
|---|---|
| [0008](./0008-fitness-functions-e-ratchets.md) | Regra de arquitetura só existe se for verificada por máquina |
| [0009](./0009-configuracao-como-schema-unico.md) | Configuração declarada num schema único, fonte de verdade compartilhada |
| [0011](./0011-dist-fora-do-versionamento.md) | `dist/` fora do controle de versão |
| [0014](./0014-typescript-para-codigo-novo.md) | TypeScript em toda a base por renomeação mecânica; dívida marcada com `@ts-nocheck` |
| [0015](./0015-fronteiras-de-confianca.md) | Fronteiras de confiança explícitas; todo dado do SEI é não confiável |

### Correções de regras existentes

| ADR | Decisão |
|---|---|
| [0012](./0012-aliasglobal-publicacao-vs-legado.md) | Separar publicação de namespace de alias legado; a regra antiga estava errada |
| [0013](./0013-remover-bus-nao-utilizado.md) | Remover o event bus enquanto não houver consumidor real |

### Substituídos

| ADR | Decisão | Situação |
|---|---|---|
| [0010](./0010-tipagem-gradual-jsdoc-checkjs.md) | Tipagem gradual com JSDoc + `checkJs` | Substituído por [0014](./0014-typescript-para-codigo-novo.md) |

## Formato

Novos ADRs seguem o template em [`_template.md`](./_template.md). Regras:

- **Contexto com evidência.** Número medido, caminho de arquivo, comando reproduzível.
  Sem "o código está confuso".
- **Uma decisão por ADR.** Se o título precisa de "e", provavelmente são dois ADRs.
- **Consequências incluem o que piora.** ADR sem custo declarado é propaganda.
- **Verificação obrigatória.** Como a máquina cobra isso? Se não houver resposta,
  a decisão é uma intenção, não uma norma (ADR-0008).
