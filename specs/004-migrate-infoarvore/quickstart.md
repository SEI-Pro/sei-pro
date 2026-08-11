# Quickstart: Migrar Informações Adicionais na Árvore

**Feature**: `004-migrate-infoarvore`  
**Date**: 2026-08-11

Guia de validação ponta a ponta. Sem código de implementação. Contratos: [panel-ui](./contracts/panel-ui.md), [section-preference](./contracts/section-preference.md), [acl-render-safety](./contracts/acl-render-safety.md), [feature-isolation](./contracts/feature-isolation.md). Modelo: [data-model.md](./data-model.md).

## Prerequisites

- Repo limpo buildável (`npm run build` / loadable `dist`)
- Extensão carregada no Chrome (modo desenvolvedor) apontando para `dist/`
- Sessão SEI real (4.1 e/ou 5.x conforme cobertura do projeto) com pelo menos um processo que tenha atribuição, marcador, interessados, assuntos e observação quando possível
- Opção **Informações adicionais na árvore do processo** visível na configuração da extensão

## Automated checks (cada fatia)

```bash
npm test -- tests/features/arvore-info
npm run policy:check
# opcional focado:
npm test -- tests/structure/sei-acl.test.js
npm test -- tests/structure/manifest-order.test.js
```

Esperado: verde; após fecho tipado, nenhum `@ts-nocheck` restante em `src/features/arvore-info/`.

## Smoke manual no SEI

> Inspecionar DOM no navegador integrado se necessário; **não** versionar HTML/screenshots do SEI.

### A — Ligar / desligar (P1)

1. Ligar a opção na configuração; abrir processo → árvore.
2. **Esperado**: painel junto à árvore com seções habilitadas (preenchidas ou estado vazio/indisponível explícito); sem duplicata do painel.
3. Desligar a opção; recarregar/abrir árvore de novo.
4. **Esperado**: painel ausente.

### B — Personalizar seções (P1)

1. Com a opção ligada, usar o fluxo atual de **Personalizar** o painel; desmarcar ~metade das seções; salvar.
2. Recarregar a árvore.
3. **Esperado**: só seções selecionadas visíveis.
4. Restaurar todas; recarregar.
5. **Esperado**: conjunto completo padrão de novo.

### C — Ações inline (P2, amostra)

Em processo onde a ação já funciona hoje, exercitar pelo menos:

- Uma edição de **Atribuição** (salvar e cancelar)
- Uma ação de **Marcador** ou **Acompanhamento** (se disponível)
- Abrir editor de **Anotação**, cancelar sem salvar; opcionalmente salvar se o ambiente permitir

**Esperado**: cancel restaura; sucesso atualiza a seção; falha induzida (ex.: offline momentâneo) não derruba as outras seções nem a árvore.

### D — Isolamento / DOM / CSS (P1 arquitetura)

1. Inspecionar o painel: controles são botões/controles nativos; sem `onclick` inline novos.
2. Confirmar estilos vindos do CSS da capacidade (não só regras órfãs no monolito como fonte).
3. Forçar falha de uma seção (toolbar ausente / URL inválida em ambiente de teste) → irmãs ok.
4. Revisar diff: enrichers de outras chaves não registrados pelo install de `arvore-info`; imports só exclusive + infra allowlisted.

## Pass / fail

| Scenario | Pass when |
|----------|-----------|
| A | SC-001 / SC-002 |
| B | SC-003 |
| C | SC-004 / SC-007 |
| D | SC-005 / SC-006 / SC-007 |
| Automação | FR-013 + policy 002 |

Falha bloqueia merge da fatia que tocou o comportamento correspondente. Registrar resultado no checklist de PR (H1–H6 / smoke UI).
