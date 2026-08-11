# Data Model: Migrar Informações Adicionais na Árvore

**Feature**: `004-migrate-infoarvore`  
**Date**: 2026-08-11

Modelo conceitual da capacidade (não schema de banco). Persistência existente é preservada.

## Entities

### Capability (`Informações adicionais na árvore`)

| Field | Notes |
|-------|--------|
| id | Capacidade de produto `arvore-info` |
| configKey | `infoarvore` (boolean, default true) |
| context | Contexto de execução `arvore` |
| maturity | `exclusive` (mantida; isolamento aprofundado) |

**Validation**: Chave única no schema; label orientada ao usuário; ligada/desligada controla montagem do painel.

### ProcessTreePanel

| Field | Notes |
|-------|--------|
| mountTarget | Âncora na UI da árvore onde o painel é inserido |
| sections | Lista ordenada de `PanelSection` |
| preference | `SectionPreference` aplicada no mount |
| processRef | Identidade do processo em visualização (ex.: id procedimento na URL/contexto) |

**Rules**: No máximo um painel por montagem; remount não duplica; com `infoarvore` off o painel não existe.

### PanelSection

| Field | Notes |
|-------|--------|
| id / `data-type` | Identificador estável (ex.: `responsaveis`, `marcador`, `anotacoes`, …) |
| label | Nome exibido / chave na personalização |
| mode | `read` \| `edit` (edit = ações inline já existentes) |
| state | Ver State Transitions |
| content | Dados normalizados da seção (texto, listas, metadados) — nunca HTML cru do SEI como fonte de verdade interna |

**Canonical section ids (comportamento atual a preservar)**:

| id | Label (preferência) | Mode |
|----|---------------------|------|
| `anotacoes` | Anotações | edit |
| `responsaveis` | Atribuição | edit |
| `marcador` | Marcador | edit |
| `acompanhamento_especial` | Acompanhamento Especial | edit |
| `tipo_procedimento` | Tipo de Procedimento | edit |
| `interessados` | Interessados | read |
| `nivel_acesso` | Nível de Acesso | read |
| `assuntos` | Assuntos | read |
| `observacoes` | Observações | read |

### SectionPreference

| Field | Notes |
|-------|--------|
| storageKey | `configViewFlashPanelArvorePro` (legado de produto — preservar) |
| enabledIds | Conjunto de ids de seção habilitados |
| default | Se ausente/inválido/vazio → todas as seções aplicáveis |

**Validation**: Ids desconhecidos ignorados; preferência não cria seções novas.

### SectionContent (normalized)

Representações internas tipadas por seção, derivadas de parse puro + IO:

- **Atribuição**: lista de responsáveis (sigla/nome), flag “não atribuído”
- **Marcador**: itens (texto, cor/ícone se houver, ação remover)
- **Acompanhamento**: itens / vazio explícito
- **Consulta-derived** (tipo, acesso, assuntos, obs, interessados): strings/listas normalizadas; mojibake corrigido na fronteira
- **Anotação**: texto/checklist, prioridade, carimbo (usuário/data) quando existir

### ProcessContext

| Field | Notes |
|-------|--------|
| procedureId | Do contexto/URL |
| toolbarActions | Links/ações disponíveis na toolbar da árvore (fonte de URLs de fetch) |
| inlinePayload | Dados inline da árvore (ex.: Nos) quando presentes |

Tratado como **entrada não confiável** na fronteira (ACL/parse).

## State Transitions — PanelSection

```text
hidden ──(preference enables + panel mount)──► loading
loading ──(data ok)──► ready
loading ──(empty)──► empty
loading ──(no toolbar/url/permission)──► unavailable
loading ──(fetch/parse/submit error)──► failed

ready|empty ──(user starts edit)──► editing
editing ──(cancel)──► ready|empty  (conteúdo anterior)
editing ──(save start)──► saving
saving ──(ok)──► ready|empty
saving ──(error)──► failed  (ou volta a ready com banner de falha — preservar UX atual)

qualquer estado ativo ──(preference disables | infoarvore off | unmount)──► hidden
```

**Invariants**:
- Transição a `failed`/`unavailable`/`empty` de uma seção NÃO altera estado das irmãs.
- `editing` cancela sem side-effect no processo.
- Refresh do painel pode recolocar seções habilitadas em `loading` sem duplicar nós DOM.

## Relationships

```text
Capability (infoarvore)
  └── ProcessTreePanel (0..1 por árvore montada)
        ├── SectionPreference (1)
        └── PanelSection (0..n filtradas)
              └── SectionContent (0..1 quando não hidden)
ProcessContext ──feeds──► PanelSection (via IO/parse)
```

## Out of model (explicit)

- Campos dinâmicos / inserção no editor (`DADOSPROCESSO`)
- Enrichers de árvore de outras chaves (`duaslinhas`, `numerar_documentos`, …) — fora da entidade Capability após extração
- Preferência de menus rápidos que não sejam o filtro do painel
