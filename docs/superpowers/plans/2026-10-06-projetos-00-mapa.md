# Gestor de Projetos em TS — plano-mestre (mapa das fases)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement each phase plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o gestor de projetos legado por um gestor novo em TypeScript (pacote `projetos/`), com Gantt (Frappe 1.2.2 ajustada), painel embutido no Controle de Processos, aba no painel lateral, integração com caixa/árvore do SEI, sincronia por Texto Padrão (unidade e pessoal) + arquivo JSON, importação do Atividades e ferramenta do Agente — no mesmo padrão e visual dos Favoritos e do Histórico.

**Architecture:** Pacote novo `projetos/` (molde `historico/`) gera um content script IIFE (`init_projetos.js`) e um app ESM em página da extensão (`html/projetos.html`, modos embutido/lateral/impressão). O motor de sincronia, os diálogos e a montagem do painel embutido saem dos Favoritos para o `sei-comum` (Favoritos e Histórico migram). A Frappe Gantt entra como cópia do fonte ajustada (sem `innerHTML`).

**Tech Stack:** TypeScript 5.9, esbuild 0.25 (`charset: "ascii"`), tsx + linkedom (testes), Biome 2, Chrome MV3 (Lab), Frappe Gantt 1.2.2 (MIT, vendorizada).

**Spec:** `docs/superpowers/specs/2026-10-06-projetos-design.md` (+ telas de referência em `docs/superpowers/specs/2026-10-06-projetos-telas/`).

## Fases (cada uma com plano próprio, escrito sobre o código real das anteriores)

| Fase | Plano | Entrega |
|---|---|---|
| P1 Fundação comum | `2026-10-06-projetos-p1-comum.md` | Motor de sincronia genérico (Texto Padrão, arquivo, cópias, assinatura, trava, consentimento, controle de página), `ui/dialogo.ts`, `painel/embutido.ts` (+ altura, sobreposição, aviso), `ui/avatar.ts` no `sei-comum`; Favoritos e Histórico migrados sem regressão |
| P2 Núcleo do projetos | `2026-10-06-projetos-p2-nucleo.md` | Pacote `projetos/` (build, testes, portões), Frappe vendorizada e ajustada, modelo (tipos, calendário, situação, progresso, dependências, linha de base, validação, filtro, alertas, histórico), repositório por escopo, modelos embutidos/aplicar, wrapper do Gantt (escalas pt-BR, linhas, decorações) |
| P3 App embutido | `2026-10-06-projetos-p3-app.md` | Content script com painel embutido + executor RPC; app `#modo=embutido`: título/alertas, abas, cabeçalho, vista Gantt (lista + Gantt), Lista, Todos, balão, filtro, menu ajustes, diálogos projeto/etapa/concluir, vazio, CSV, impressão; manifest Lab + guarda do legado |
| P4 Sincronia e colaboração | `2026-10-06-projetos-p4-sincronia.md` | Adaptador do projetos (envelope, sigilosos), Textos Padrão unidade/pessoal (aviso único, convite), arquivo, cópias, diálogo Sincronização, histórico de alterações, enviar/receber, mover escopo, modelos (diálogo, salvar como), arquivados, importação do Atividades |
| P5 Lateral, SEI e Agente | `2026-10-06-projetos-p5-integracao.md` | Aba lateral (agenda, projetos, mini-Gantt, contador), ponte lateral, `background.js`; caixa (ícone + balão); árvore (ícone, faixa, balão com concluir com documento e adicionar a projeto); `projetos_listar` no Agente; título "Projetos (Atividades)" no legado; `check-dom-injection`; rascunho da ajuda |
| P6 Validação ao vivo | `2026-10-06-projetos-p6-validacao.md` | Harness com a extensão; roteiro no SEI SP 4.1.5 (treinamento) e SEI 5 MJ homologação; correções; revisão final da branch |

Ordem de execução: P1 → P2 → P3 → P4 → P5 → P6 (o plano de P2 pode ser escrito enquanto P1 executa; os demais
são escritos depois que a fase anterior termina, lendo o código real).

## Global Constraints

- Idioma: código, nomes, comentários, textos de interface e mensagens em português do Brasil; título de commit sem acento (ex.: `Projetos: ...`, `Comum: ...`), terminando com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Git: trabalhar só na worktree `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos` (branch `feat/projetos-ts`); conferir `git branch --show-current`; **nunca `git add -A`** (adicionar por caminho); sem push, merge, release.
- `dist/js` gerado: só ASCII (esbuild `charset: "ascii"` + portão de bytes > 0x7f no `build.mjs`). JS legado editado à mão (`init.js`, `sei-pro-projetos.js`, `background.js`): acentos como `\uXXXX`, conferidos por bytes (o grep BSD não detecta byte cru; as ferramentas Write/Edit convertem `\uXXXX` em caractere cru — conferir depois de editar).
- DOM seguro: em TS só `h()`/`textContent`/`createElementNS`; proibido `innerHTML`, `outerHTML`, `insertAdjacentHTML`, atributos `on*` em string; no legado, `htmlPro`/`data-spro-*`.
- Sessão do SEI: nunca montar URL do SEI; abrir processo/documento só por links da própria página ou pela pesquisa rápida; **nunca carregar a árvore de processo em segundo plano** (marca "recebido").
- SEI em HTTP: sem `crypto.randomUUID` e sem Web Locks — usar `novoId()` de `@comum/id` e trava com recuo.
- Privacidade: processo sigiloso nunca vai ao Texto Padrão nem ao Agente; no CSV e no "Enviar projeto" o número sai em branco.
- Testes: tsx + linkedom, agregador `tests/verificar.ts` por pacote; **linha de base que não pode cair**: sei-comum 178, sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054 provas (todas ok em 06/10/2026, master 658a0fc).
- Portões: `npx tsc --noEmit` e `npx biome check src tests` nos pacotes tocados; portão ASCII do build; `node tools/check-dom-injection.mjs`; `node tools/patch-manifests.mjs --check` (o `tools/` é gitignored e foi copiado para a worktree).
- Manifest: só `dist/manifest.json` (Lab MV3) recebe o novo módulo; oficial e Firefox ficam como estão.
- Frappe Gantt 1.2.2 (MIT) vendorizada em `projetos/src/vendor/frappe-gantt/` com `LICENSE` e `AJUSTES.md`; o bundle final não contém `innerHTML`/`outerHTML`/`insertAdjacentHTML`.
- Visual: tokens `--spro-*` e classes de `sei-comum/src/ui/base.css` e `lista.css`; layout, textos e comportamento conforme as telas de referência aprovadas; botão de menu geral com o ícone `ajustes`; princípio "poucos botões, poucos passos, essencial à mostra e o resto recolhido com resumo".
- Nomes de Texto Padrão: `[_SEIPRO_PRJ_UNIDADE]` (toda a unidade) e `[_SEIPRO_PRJ_<login>]` (só eu; login longo encurtado como nos Favoritos); teto 100 KB, aviso a 80 KB.
- Chaves de armazenamento: `projetos/<host>|<login>|u:<idUnidade>/<un|eu>/<p|f|e|h|m>/<id>` e `…/meta`; preferências em `projetos/preferencias`.

## Review Focus

1. **Texto Padrão de projetos editado à mão, de versão mais nova, ou perto do teto** — nenhum dado local se perde, nada é sobrescrito em silêncio (inválido → cópia diária + regravação com aviso; mais novo → não grava e avisa; acima do teto → não grava e explica). Provas no P1 (motor) e P4 (adaptador).
2. **Dois usuários editando o mesmo projeto "Toda a unidade" quase ao mesmo tempo** — após a próxima rodada de cada um, as duas alterações estão no Texto Padrão; uma exclusão não ressuscita (lápide 180 dias). Prova no P4 com dois repositórios e um armazém de Texto Padrão em memória intercalando leituras/gravações.
3. **Datas nas bordas** — etapa de 1 dia, marco, início = término, término em fim de semana/feriado, virada de ano, fuso (DataISO local, nunca `toISOString()` em data local → dia errado), progresso pelo tempo sem divisão por zero. Provas no P2 (modelo/calendário).
4. **Textos hostis** — nomes com `<img src=x onerror=...>`, aspas, `&`, acentos e emoji em projeto, fase, etapa, checklist, responsável e etiqueta aparecem como texto no Gantt, na lista, nos balões (Shadow DOM), no lateral e no CSV (fórmulas `= + - @` neutralizadas). Provas no P2 (vendor/gantt), P3 (app) e P5 (balões).
5. **Troca de unidade/login com painel e lateral abertos; SEI 4.1 (árvore aninhada) e SEI 5** — o lateral remonta e nunca grava no escopo antigo; ícones da caixa e da árvore não duplicam a cada mutação do DOM. Provas no P3/P5 (fixtures) e roteiro ao vivo no P6.
