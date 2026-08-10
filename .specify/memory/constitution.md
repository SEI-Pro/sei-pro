<!--
Sync Impact Report
- Version change: (template placeholders) → 1.0.0
- Modified principles: N/A (first ratification from template)
  - [PRINCIPLE_1_NAME] → I. Capacidade do Usuário Primeiro
  - [PRINCIPLE_2_NAME] → II. Contexto de Execução como Fronteira Primária
  - [PRINCIPLE_3_NAME] → III. Anti-Corrupção do SEI e Fronteiras de Confiança
  - [PRINCIPLE_4_NAME] → IV. Arquitetura Só Existe Se for Verificada
  - [PRINCIPLE_5_NAME] → V. Migração Honesta e Incremental
- Added sections:
  - Core Principles (I–V)
  - Direção de Produto e Integrações
  - Fluxo de Desenvolvimento e Spec Kit
  - Governance
- Removed sections: none (template placeholders replaced)
- Follow-up TODOs: none
-->

# SEI Pro PRF Constitution

## Core Principles

### I. Capacidade do Usuário Primeiro

O SEI Pro PRF existe para ampliar o que o usuário consegue fazer no SEI com menos
fricção: eficiência, clareza e decisão no contexto do processo. Toda feature MUST
corresponder a uma capacidade que o usuário reconhece e pode ligar/desligar — com
chave própria no schema de configuração (ou `null` justificado) e descrição em uma
frase, sem falar de arquivo, página do SEI ou implementação.

`pages/` e o mapeamento de funções/configurações são o insumo canônico para nomear
e fronteirizar capacidades. Feature nova MUST nascer nesse formato. É proibido
nomear ou agrupar por arquivo legado, por página do SEI ou por conveniência de
código. Revisão e consolidação de funcionalidades via Spec Kit MUST priorizar o
valor para o usuário final antes de detalhe técnico.

**Rationale:** a extensão herdou fronteiras do fork; só fronteira por capacidade
torna isolamento de falha, options e testes significativos.

### II. Contexto de Execução como Fronteira Primária

A extensão é um host de plugins Manifest V3 sobre o SEI. A fronteira arquitetural
primária MUST ser o contexto de execução (`service-worker`, content scripts por
página, mundo MAIN, `options`), não a camada. Cada contexto MUST ter raiz de
composição própria; comunicação entre contextos MUST ser serializável via
`platform/messaging`.

Dentro de cada contexto, a direção de dependência MUST ser
`entries → features → shared → core | sei | platform` — nunca o inverso, exceto
nas raízes de composição. Domínio puro MUST permanecer sem DOM, `window`,
`chrome.*`, jQuery ou `localStorage`. `chrome.*` MUST ficar em `platform/`,
`background/` e `options/`. Falha de uma feature MUST NOT derrubar o contexto.

**Rationale:** o MV3 impõe capacidades e ciclo de vida por contexto; camada sem
contexto é abstração falsa.

### III. Anti-Corrupção do SEI e Fronteiras de Confiança

Conhecimento de DOM, seletores, URLs e ramificação de versão do SEI MUST
concentrar-se em `src/sei/` (ACL). Dado do SEI (DOM, URL, título, respostas) MUST
ser tratado como entrada não confiável na fronteira — nunca no meio da feature.
HTML derivado de dado do SEI MUST NOT ser montado por concatenação; reexibição de
HTML do SEI MUST passar por sanitização centralizada no ACL.

Menor privilégio no manifest é obrigatório: sem permissão curinga de host, sem
`eval`, sem segredo em `storage.sync`. Content script MUST NOT falar com rede
externa; o service worker faz isso. Nada sai da máquina sem consentimento
explícito. Conteúdo de processo só vai a LLM ou sistema externo por ação
deliberada, com destino nomeado na interface; a instituição MUST poder restringir
provedores externos por configuração.

Permissão ou origem nova MUST exigir ADR com justificativa revisável pela Chrome
Web Store.

**Rationale:** a extensão manipula processos de órgão de segurança pública; a
superfície declarada tem de bater com a necessidade real.

### IV. Arquitetura Só Existe Se for Verificada

Toda regra de arquitetura declarada em ADR MUST ter verificação executável
(fitness function e/ou ratchet), ou não é regra. CI MUST ser portão obrigatório
de merge. Melhoria de métrica de dívida MUST baixar o baseline no mesmo commit;
aumento de baseline MUST quebrar o build.

Código novo MUST ser TypeScript verificado por `tsc --noEmit` em CI. Dívida de
tipagem MUST marcar-se com `@ts-nocheck` (contável), nunca com `any`/`as any`/
`@ts-ignore` espalhados. Arquivo tocado MUST perder `@ts-nocheck` no mesmo
commit. `dist/` MUST permanecer fora do versionamento e reproduzível a partir de
fonte limpa.

**Rationale:** regras em prosa divergiram do código nas duas direções; só máquina
impede regressão numa migração longa.

### V. Migração Honesta e Incremental

Duas arquiteturas ainda convivem. Trabalho MUST preservar a extensão utilizável
ao fim de cada fatia: uma fatia = um commit que passa no CI. Ao fatiar código sem
teste, MUST cobrir o comportamento atual antes de mover. Smoke manual no SEI real
MUST ser portão quando a fatia toca UI.

Maturidade de feature é contrato: `declared` é intenção, `wired` convive com
caminho paralelo, `exclusive` é instalada só pela raiz sem auto-boot legado. Só
`exclusive` conta como migrada. É proibido declarar migração por movimentação de
arquivo, tipar em lote o que será reescrito, passar legado verbatim pelo bundler,
ou abrir branch longa de refatoração sem entregas incrementais.

Legado e stranglers existem para serem esvaziados com condição de remoção
explícita (`aliasGlobal`, wrappers, núcleos residuais) — não para receber
comportamento novo.

**Rationale:** honestidade de estado é o que permite Spec Kit e ADRs governarem
o fim da transição sem autoengano.

## Direção de Produto e Integrações

A consolidação via Spec Kit MUST preceder expansão de escopo: revisar capacidades
existentes, fechar a migração arquitetural documentada em ADRs e
`docs/implementation-plan.md`, e só então especificar capacidades novas.

Integrações futuras (IA avançada no editor, gateway para o Spidr e outros
sistemas de workflow) MUST:

1. Aparecer como capacidades de usuário com fronteira, schema e consentimento
   explícitos (Princípios I e III).
2. Respeitar contextos MV3 e ports em `platform/` — a extensão é porta de
   entrada junto ao usuário no SEI, não um segundo monólito acoplado ao DOM.
3. Tratar Spidr (ou equivalente) como sistema externo atrás de contrato
   versionado; uso de Spidr como mecanismo de IA MUST ser decisão de produto
   especificada, não atalho de implementação.
4. Manter a extensão útil offline de integração: falha ou ausência do sistema
   externo MUST NOT impedir capacidades locais já estáveis.

Documentação de arquitetura (`docs/architecture.md`, ADRs, `DEVELOPMENT.md`) e
mapa de capacidades (`pages/`, `docs/capabilities-map.md`) MUST permanecer a
fonte de verdade técnica e de produto; Spec Kit especifica e planeja contra
esses artefatos, sem contradizê-los em silêncio.

## Fluxo de Desenvolvimento e Spec Kit

- Spec Kit (`/speckit-specify` → clarify → plan → tasks → implement) é o caminho
  padrão para capacidade nova ou revisão material de capacidade existente.
- ADR aceito vence prosa em `DEVELOPMENT.md` ou comentários; contradição é bug
  do texto operacional ou exige novo ADR.
- Código novo segue anatomia de feature autodescritiva (`feature.ts`, contexts,
  `install`, `api`); consumidores cross-feature usam só `.api`.
- CSS com prefixo `.seipro-` (BEM); sem handler inline novo; mundo isolado por
  padrão (exceção: ponte serializável do CKEditor).
- Guidance operacional de build, migração e checklist: `DEVELOPMENT.md`.
  Estado medido: `docs/architecture.md`. Ordem de fatias: `docs/implementation-plan.md`.

## Governance

Esta constituição prevalece sobre prática informal e sobre atalhos de
implementação. Emendas MUST:

1. Atualizar `.specify/memory/constitution.md` com versão semântica.
2. Registrar Sync Impact Report (comentário HTML no topo).
3. Ajustar ADRs ou abrir ADR novo quando a emenda mudar regra verificável.
4. Definir ou atualizar fitness function/ratchet quando a regra for binária ou
   de dívida.

Versionamento:

- **MAJOR:** remoção ou redefinição incompatível de princípio.
- **MINOR:** princípio/seção nova ou expansão material de guidance.
- **PATCH:** esclarecimento, redação, correção sem mudança semântica.

Compliance: PRs e revisões MUST checar aderência aos princípios e aos ADRs
citados; complexidade além do necessário MUST ser justificada. Revisão de
compliance ocorre a cada emenda da constituição e ao abrir especificação Spec
Kit que toque fronteira de capacidade, segurança ou integração externa.

**Version**: 1.0.0 | **Ratified**: 2026-08-10 | **Last Amended**: 2026-08-10
