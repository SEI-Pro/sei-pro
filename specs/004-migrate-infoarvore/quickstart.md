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

**Onde fica (não é a página de Opções da extensão e não há ícone de “raio”):**

1. Nas opções do SEI Pro, aba **Árvore e Visualização de Documentos**, ligue **Menu rápido na árvore de documentos** (não fica mais em Controle de Processos).
2. Recarregue a extensão/`dist` se acabou de alterar o código; abra (ou recarregue) um processo.
3. **No iframe da árvore** (painel esquerdo), **passe o mouse sobre o número do processo** no topo (ex.: `08675.003854/2026-64`) — o link raiz do processo.
4. Deve abrir um **menu flutuante** (toolbar) abaixo desse link, com atalhos do processo.
5. No fim desse menu (fundo cinza), clique **Personalizar Menu** (ícone de engrenagem).
6. No diálogo, aba **Painel** — marque/desmarque seções → feche → **recarregue a árvore**.

**Esperado**: só seções selecionadas visíveis; ao restaurar todas, o conjunto completo volta.

> Se o menu flutuante não abrir: confira `menurapido` ligado + rebuild/`dist` recarregado. No console do **iframe da árvore**, aviso `getToolbarPro: parent.dadosProcessoPro still missing — binding toolbar anyway` é OK (retry esgotou e o bind segue). Erros de `jquery.toolbar` / `initToolbarDocs` ainda bloqueiam o menu.
### C — Ações inline (P2, amostra)

Em processo onde a ação já funciona hoje, exercitar pelo menos:

- Uma edição de **Atribuição** via ícone de lápis **visível** (azul) ao lado do título da seção — salvar e cancelar
- Uma ação de **Marcador** ou **Acompanhamento** (se disponível)
- Abrir editor de **Anotação**, cancelar sem salvar; opcionalmente salvar se o ambiente permitir

**Esperado**: lápis legível (não “quadradinho” vazio); cancel restaura; sucesso atualiza a seção; falha não derruba as outras seções nem a árvore.

Logs `[SeiProTree] edit click` / `inline atrib: saved` no console são **normais** em sucesso. Aviso de iframe `allow-scripts` + `allow-same-origin` vem do sandbox do SEI/Chrome e não indica falha do painel.

### D — Isolamento / DOM / CSS (P1 arquitetura)

Não é um fluxo de negócio — é **checagem rápida de qualidade**:

1. **Selecionar o iframe da árvore no DevTools**
   - Abra DevTools (F12) na página do processo.
   - No topo do painel Console, abra o seletor de contexto (costuma mostrar `top`) e escolha o frame da árvore — em geral algo com `procedimento_visualizar` / `ifrArvore` / URL da árvore.
   - Alternativa: aba Elements → ache `<iframe id="ifrArvore">` (ou similar) → botão direito no `iframe` → *Open in Sources* / inspecione o documento interno.
2. **CSS da capacidade** (o check só por `styleSheets[].href` pode dar `[]` se a sheet for injetada sem URL legível — use o fallback)
   - Em Elements, no `<head>` **desse iframe**, procure `<link>`/`<style>` relacionados a `arvore-info` / Font Awesome.
   - No Console **já no contexto do iframe**, preferir:
     ```js
     // 1) links com href
     [...document.styleSheets].map(s => s.href).filter(Boolean).filter(h => /arvore-info|fontawesome/i.test(h))
     // 2) fallback: regras da própria capacidade (passa mesmo se href for null)
     ;[...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => /seipro-infoarvore/.test(r.selectorText||'')) } catch(e) { return false } })
     ```
     Esperado: (1) pelo menos uma URL **ou** (2) `true`. Visual: lápis azul / tipografia do painel ok.
3. **DOM nativo**
   - No painel, os lápis de editar devem ser `<button type="button" class="… seipro-infoarvore-pencil">` (não `onclick="…"` inline).
   - Atalho no console do iframe: `!!document.querySelector('button.seipro-infoarvore-pencil')` → `true` se Smoke C UI estiver presente.4. **Isolamento**
   - Visual: uma seção vazia/indisponível não apaga as outras (já observável no painel).

## Pass / fail

| Scenario | Pass when |
|----------|-----------|
| A | SC-001 / SC-002 |
| B | SC-003 |
| C | SC-004 / SC-007 |
| D | SC-005 / SC-006 / SC-007 |
| Automação | FR-013 + policy 002 |

Falha bloqueia merge da fatia que tocou o comportamento correspondente. Registrar resultado no checklist de PR (H1–H6 / smoke UI).
