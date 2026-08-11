# Contract: Section Preference

**Feature**: `004-migrate-infoarvore`  
**Consumers**: Painel `arvore-info`; UI de personalização existente (`menus-rapidos` / flash menu mode `panel`)

## Purpose

Congelar o contrato da preferência de quais seções do painel aparecem, para preservar FR-004 sem migrar a UI de personalização neste Spec Kit.

## Storage

| Key | Location | Semantics |
|-----|----------|-----------|
| `configViewFlashPanelArvorePro` | localStorage do host SEI (via helpers já usados pela árvore/menus) | Seleção do usuário para o painel |

## Read semantics (panel)

1. Se chave ausente, vazia ou inválida → **habilitar todas** as seções canônicas aplicáveis.
2. Se presente → habilitar apenas ids reconhecidos; ids desconhecidos ignorados.
3. Preferência NÃO cria seções novas nem altera `infoarvore` on/off.

## Write semantics (this feature)

- Esta entrega **não** é dona da UI “Personalizar Menu”.
- MUST continuar a **respeitar** writes feitos pelo fluxo atual de personalização.
- MUST NOT renomear a storage key sem Spec/migração explícita (fora de escopo).

## Canonical ids

Ver tabela em [data-model.md](../data-model.md) (`PanelSection`).

## Verification

- Unit: dado preferência mockada, mount filtra seções corretamente
- Smoke: quickstart cenário B
- Regressão: default (sem chave) mostra o conjunto completo atual
