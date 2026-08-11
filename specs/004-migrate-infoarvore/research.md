# Research: Migrar Informações Adicionais na Árvore

**Feature**: `004-migrate-infoarvore`  
**Date**: 2026-08-11

## R1 — O que “migrar” significa se já é `exclusive`

**Decision**: Tratar esta entrega como **aprofundamento** da capacidade `arvore-info`: comportamento preservado + isolamento real (TS sem `@ts-nocheck` no fecho tocado, CSS próprio, ACL, DOM seguro, install só do painel `infoarvore`). Não reabrir maturidade para `wired`.

**Rationale**: O mapa/descritor já marcam `exclusive` e o bundle legado foi removido; a dívida restante é porte verbatim (13/15 arquivos `@ts-nocheck`, `innerHTML`, CSS no monolito, enrichers alienígenas). Declaração sem isolamento contradiz constituição V.

**Alternatives considered**:
- Rebaixar para `wired` até “terminar” — rejeitado: caminho legado do painel já foi aposentado; rebaixar seria desonesto na outra direção.
- Só tipar sem mudar DOM/CSS — rejeitado: FR-009/FR-010/FR-011 exigem isolamento visual e render seguro.

## R2 — Enrichers `duaslinhas` / `numerar_documentos` / `urgente` / `tag` no mesmo `install`

**Decision**: Extrair esses enrichers do `installArvoreInfo` para a peer exclusive `arvore` (ou pipeline de árvore owned por `arvore`), mantendo o contrato `__SEI_PRO_TREE_BOOT__` / observação da árvore utilizável. `arvore-info.install` fica responsável pelo painel `infoarvore` (+ seções atuais do painel).

**Rationale**: FR-008 e constituição I exigem fronteira por capacidade/chave. Enrichers de outras chaves no install de `infoarvore` misturam fechos e impedem CSS/testes honestos.

**Alternatives considered**:
- Deixar colados e tipar tudo junto — rejeitado: aumenta escopo e mantém fronteira falsa.
- Migrar cada enricher em Spec Kit separado antes — possível, mas o mínimo necessário aqui é **tirá-los** do pacote `arvore-info`; dono = `arvore` (já exclusive).

## R3 — Anotação no painel vs `anotacao-controle`

**Decision**: Manter a seção de anotação **dentro** desta migração como comportamento observável de `infoarvore` (assumptions do spec). Não unificar com `mostraranotacaocontrole` / `anotacao-controle` nesta fatia. Mover estilos `seipro-anot-*` usados pelo painel para `arvore-info.css`.

**Rationale**: Spec assume preservação; split de produto independente fica para Spec Kit futuro.

**Alternatives considered**: Extrair anotação agora para outra feature — rejeitado: muda superfície/config sem pedido; risco de regressão.

## R4 — Preferência “Personalizar Menu” (`configViewFlashPanelArvorePro`)

**Decision**: Preservar a chave e o semântica atuais (ausente/vazio = todas as seções). Ler/escrever via fachada na feature (ou IO da árvore já usada), sem migrar a UI de personalização de `menus-rapidos` neste Spec Kit, salvo bug que impeça o painel de respeitar a preferência.

**Rationale**: FR-004 + FR-007: comportamento de produto estável; a UI de personalização é owned por menus, não pelo painel.

**Alternatives considered**: Migrar preferência para `chrome.storage`/schema — rejeitado neste escopo (mudança de persistência perceptível / migração de dados).

## R5 — Rede: `fetch` no content script vs `platform`

**Decision**: Manter `createIo` com `fetch` same-origin + credenciais + decode ISO-8859-1 + submit via iframe oculto, tipado e testável. Não forçar service-worker para páginas do próprio SEI nesta entrega.

**Rationale**: Tráfego é sessão SEI no frame; não é host externo (constituição III / ADR-0015). Pattern já isolado em `io.ts` com testes.

**Alternatives considered**: Proxy via background — complexidade sem ganho de segurança para same-origin SEI; fora do pedido.

## R6 — ACL e render seguro

**Decision**: Mover seletores/URLs/ramificações de versão usados pelo painel para `src/sei/`; views montam com `textContent` / `createElement` / primitivos `shared/ui`; fragmentos HTML do SEI só reexibidos via sanitização centralizada no ACL (nunca concat de string com dado SEI). Encolher allowlist em `sei-acl.test.js` conforme migra.

**Rationale**: FR-010/FR-011 + ADR-0003. Hoje há ~72 `innerHTML` e seletores allowlisted fora do ACL.

**Alternatives considered**: Sanitizar ad-hoc na feature — rejeitado: sanitização deve ser central no ACL.

## R7 — CSS

**Decision**: Criar `src/features/arvore-info/arvore-info.css` (classes `.seipro-*` / BEM) como fonte de verdade; migrar regras de `.panelDadosArvore*` de `sei-pro.css` / dark-mode de `sei-slim.css` / anotação de `arvore/style.css`; carregar o CSS pelo mecanismo moderno do contexto `arvore` (mesmo padrão de `monitorados.css` / `arvore/style.css`). Preferir classes a `style=` inline.

**Rationale**: FR-009; DEVELOPMENT.md / ADR-0007.

**Alternatives considered**: Só prefixar no monolito — rejeitado: monolito continua fonte de verdade.

## R8 — HTML/DOM “melhor”

**Decision**: Melhorias pontuais sem redesign: `<section>`/`<h*>`/listas para estrutura; `<button type="button">` para ações; labels associados em forms inline; foco ao abrir editor; sem handlers inline novos. Contenteditable da anotação permanece (já é o modelo atual), com caret helpers tipados.

**Rationale**: Spec P1 US4 + FR-010; usuário pediu melhores elementos HTML/DOM, não novo visual.

**Alternatives considered**: Substituir contenteditable por `<textarea>` — mudaria UX da checklist/anotação rica; fora sem clarify.

## R9 — Ordem de fatias

**Decision**:
1. Characterization gaps (preferência de seções, estados vazios) onde faltar teste.
2. Extrair enrichers não-`infoarvore` → `arvore`.
3. ACL selectors + tipagem de `parse/` + `io` (baixo risco UI).
4. CSS próprio + remoção das regras do monolito (smoke visual).
5. Reescrever mount/sections para DOM seguro seção a seção (smoke por seção tocada).
6. Remover fallback `SeiPro.core.texto` em favor de import `src/core/texto`.
7. Portão: zero `@ts-nocheck` restante em `arvore-info/`; allowlist ACL encolhida; quickstart smoke.

**Rationale**: Constituição V — cobrir antes de mover; UI por último com smoke.

## R10 — Mapa de capacidades / `DADOSPROCESSO`

**Decision**: Fora do runtime desta entrega. Opcional na mesma PR de docs: nota no mapa que `DADOSPROCESSO.md` não pertence ao fecho de `infoarvore` (gap de inventário / Spec futuro). Não bloquear migração do painel.

**Rationale**: Spec Out of Scope; 003 já cobre inventário — só honestidade documental.
