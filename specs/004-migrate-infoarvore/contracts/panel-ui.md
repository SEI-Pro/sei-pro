# Contract: Panel UI

**Feature**: `004-migrate-infoarvore`  
**Consumers**: Implementers, smoke testers, PR reviewers (H-checklist UI)

## Purpose

Definir a superfície observável do painel de informações adicionais na árvore — o que o usuário vê e como interage — independente de arquivos internos.

## Surface

| Element | Contract |
|---------|----------|
| Panel root | Presente iff config `infoarvore` ligada e árvore pronta; um único root por montagem |
| Sections | Ordem estável documentada em [data-model.md](../data-model.md); só ids habilitados pela preferência |
| Section chrome | Título/rótulo legível; corpo com estado explícito |
| Interactive controls | Elementos nativos adequados (`button`, `select`, etc.); sem handlers HTML inline novos |
| Loading | Estado transitório visível por seção (“carregando…”) |
| Empty / unavailable / failed | Mensagens distintas o bastante para não parecerem “bug mudo” |
| Edit flows | Cancel restaura conteúdo anterior; sucesso atualiza só a seção (e invalida cache se aplicável) sem reload full-page obrigatório |

## Non-goals

- Visual redesign (cores/spacing novos além do necessário ao mover CSS)
- Novas seções ou novos campos de produto

## Verification

- Smoke: [quickstart.md](../quickstart.md) cenários A–C
- Code review: FR-010 (DOM nativo) + ausência de `onclick=` novos no fecho
- Automated: testes de preferência/filtro; asserts de estrutura DOM em harness onde existirem
