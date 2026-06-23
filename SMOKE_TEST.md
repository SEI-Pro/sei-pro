# Smoke Test Manual — SEI Pro PRF

> Rede de segurança mínima para fechar fases da migração arquitetural
> (ver `PLANO_MIGRACAO_ARQUITETURA.md`). Os testes Vitest cobrem funções **puras**;
> **não** cobrem efeitos de DOM, carregamento de CSS por página, nem a ordem real de
> injeção dos content scripts. Este checklist cobre essa lacuna — foi a ausência dele
> que deixou a regressão do `loadStyleDesign` passar batida.

## Pré-requisitos (obrigatório antes de cada rodada)

1. `npm run build` — gera `dist/js/core-stack.bundle.js` + `dist/manifest.json`.
   **Carregar `dist/` sem buildar testa um bundle desatualizado.**
2. `npm test` — 58 testes verdes.
3. Carregar `dist/` como extensão desempacotada:
   - Chrome/Edge: `chrome://extensions` → "Carregar sem compactação".
   - Firefox: `about:debugging` → "Carregar extensão temporária".
4. Recarregar a extensão **e** dar refresh na página do SEI a cada mudança.
5. Manter o DevTools Console aberto: **zero erros** novos vindos de `SeiPro*` /
   `sei-*.js` é parte do critério de aprovação.

> Rodar idealmente nas duas versões alvo: **SEI 4.x** e **SEI 5.x** (o adapter de
> versão — Fase 3 — só se prova exercitando ambas).

## Gate por fase

Marque **todas** as seções aplicáveis antes de declarar uma fase concluída em produção.
Registre data, versão do SEI e navegador.

---

### 1. Lista de processos (`init.js` — controlador_externo / procedimento_controlar)
- [ ] Página carrega sem erro no console; estilo SEI Pro aplicado (não "SEI cru").
- [ ] Agrupamento de processos / projetos renderiza.
- [ ] Favoritos: marcar/desmarcar persiste após refresh.
- [ ] Prazos / contadores de data exibidos corretamente.
- [ ] Kanban abre e arrasta cartões.
- [ ] Integração Google Sheets (se configurada) ainda autentica.
- [ ] Notificação de novos processos (badge no ícone) atualiza.

### 2. Árvore de documentos (`init_arvore.js` — dentro do `ifrArvore`)
- [ ] Menus de ação rápida aparecem ao passar sobre os documentos.
- [ ] Upload via drag-and-drop (dropzone) abre e envia.
- [ ] Anotações e informações do documento exibem.
- [ ] Detecção de versão dentro do iframe OK (`parent.isNewSEI` — não migrado de propósito).
- [ ] **Filtro/realce rápido na árvore** (digitar no campo de pesquisa rápida realça/filtra os
      documentos da árvore) — valida `QuickTree*` delegando a `SeiPro.core.quickfilter` no iframe
      (Fase 6, 15ª leva). Testar termo **com acento** (ex.: "memória") confirma o realce correto.

### 3. Editor de documentos (`editor_montar` — CKEditor)
- [ ] Barra de ferramentas SEI Pro carrega (estilos de tabela, copiar formatação).
- [ ] Auto-save dispara e restaura conteúdo.
- [ ] Links de legislação / notas de rodapé / QR code funcionam.
- [ ] Ferramentas de IA abrem e respondem (revisão/escrita/ditado).
- [ ] Atalhos de teclado respondem.

### 4. Visualização de documento (`init_visualizacao.js` / `_html.js`)
- [ ] Numeração de parágrafos aparece.
- [ ] Marca d'água / marca de confidencialidade renderiza.
- [ ] Realce/filtro rápido de página funciona.
- [ ] CSS específico de visualização aplicado (regressão clássica do `loadStyleDesign`).

### 5. Todas as páginas (`init_all.js`)
- [ ] Dark mode liga/desliga e persiste.
- [ ] Ícones de fonte renderizam (não há "tofu"/quadrados).
- [ ] Estilo avançado aplicado sem quebrar o layout nativo.

### 6. Login (`init_pwd.js`)
- [ ] Auto-fill de senha funciona no SEI 4.0+.

---

## Foco específico por fase

| Fase | O que exercitar com atenção |
|---|---|
| 3 — Adapter de versão | Rodar **as duas** versões do SEI; conferir seletores/ramos que diferem entre 4.x e 5.x. |
| 4 — Storage/rede | Confirmar persistência (favoritos/config) e que o caminho service worker responde; testar erro de rede da IA. |
| 5 — Build | Carregar `dist/` **após `npm run build`**; conferir que o bundle carrega antes do jQuery sem erro de ordem. |
| 6 — Feature folders | Exercitar a feature movida; validar que os globais legados (`window.<fn>`) ainda existem via alias. |

## Risco conhecido a vigiar — fachadas no mundo MAIN

O core roda em dois mundos (isolado + MAIN da página). `SeiPro.core.messaging`/`storage`/
`net` **rejeitam no mundo MAIN** (não há `chrome.*` lá). Fique atento no console a erros
do tipo:

> `SeiPro.messaging: runtime de extensão indisponível (provável mundo MAIN). Ação "..." não pôde ser entregue ao service worker.`

Se aparecer, significa que um arquivo carregado via `$.getScript` tentou usar storage/SW
no mundo errado — anote **qual ação** e **qual feature** disparou; é o gatilho para
implementar a ponte MAIN→isolado (com validação de origem). Ver `PLANO_MIGRACAO_ARQUITETURA.md` §4.

## Execuções registradas

### 2026-06-18 · Chrome (macOS) · SEI 5.x produção PRF (`sei.prf.gov.br`) — ✅ PASSOU
Após `npm run build` + reload da extensão. Capturado o console (apenas erros + logs) em cada página:
- **Lista de processos** (`procedimento_controlar`): limpa. `checkHostLimit`, modais e
  `getProcessoUnidadePro` rodaram sem erro (eram a origem da regressão dos dois mundos).
- **Todas as páginas**: branding PRF, favoritos, marcadores, prazos, toolbar e dark mode renderizam.
- **Árvore / processo** (`procedimento_trabalhar`, iframe): limpa. Boot completo via
  `sei-pro-arvore-boot.js` — `parentReady via SeiProReady`, painel infoarvore (9 seções),
  toolbar (22 links), `fetchPage → controlador.php`, anotações/consulta/interessados.
- **Editor** (`editor_montar`, CKEditor): renderizou com toolbar e documento; zero erros.
- **Risco mundo MAIN**: nenhum erro de `messaging`/runtime indisponível em nenhuma página —
  ponte MAIN→isolado segue desnecessária.

> Pendente: repetir em Firefox e em SEI 4.x quando possível (o `world:"MAIN"` exige Firefox 128+).

## Critério de aprovação
Todas as caixas aplicáveis marcadas, **zero** erros novos no console, em pelo menos um
navegador Chromium **e** Firefox, nas versões de SEI alvo da mudança.
