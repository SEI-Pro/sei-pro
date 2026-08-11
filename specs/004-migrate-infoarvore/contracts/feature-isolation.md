# Contract: Feature Isolation

**Feature**: `004-migrate-infoarvore`  
**Consumers**: Policy 002 / `policy:check`; PR reviewers; implementers

## Purpose

Definir o fecho moderno honesto da capacidade `infoarvore` ao fim desta entrega.

## Invariants

1. **Descriptor**: `src/features/arvore-info/feature.ts` permanece `maturity: 'exclusive'`, `configKey: 'infoarvore'`, `contexts: ['arvore']`.
2. **Install ownership**: `install` da capacidade monta/atualiza **somente** o painel e seções de `infoarvore`. Enrichers de outras chaves (`duaslinhas`, `numerar_documentos`, `urgente`, `tag`, …) MUST NOT permanecer registrados por esse install.
3. **No legacy coupling**: Módulos do fecho MUST NOT importar features não-`exclusive` nem loaders legados; apenas peers exclusive necessários + infra allowlisted ([shared-modern-infra](../../002-ts-zero-legacy/contracts/shared-modern-infra.md)).
4. **Typing debt**: Ao merge, **0** `@ts-nocheck` em arquivos sob `src/features/arvore-info/` tocados pela entrega; alvo da entrega = **0** no diretório inteiro da capacidade.
5. **CSS source of truth**: Estilos do painel/seções vivem em CSS da feature (`arvore-info.css` ou equivalente); monolito `sei-pro.css` / CSS de outra feature NÃO MUST ser a fonte de verdade visual desta capacidade.
6. **Failure isolation**: Erro em uma seção ou no install NÃO derruba o boot do contexto `arvore` nem peers.
7. **Core deps**: Usar `src/core` por import ESM; MUST NOT depender de `win.SeiPro.core.*` como caminho primário.

## Explicit non-fecho (separate capabilities / future specs)

- Inserção de dados do processo no editor (`DADOSPROCESSO`)
- `anotacao-controle` / `mostraranotacaocontrole` como produto independente
- Opções da árvore que não sejam o painel (após extração dos enrichers)

## Verification

- `npm run policy:check` + structure tests de registry/manifest
- Grep/CI: zero `@ts-nocheck` em `src/features/arvore-info/`
- Review: install não registra enrichers alienígenas; CSS da feature carregado no contexto
- Quickstart cenário D (arquitetura)
