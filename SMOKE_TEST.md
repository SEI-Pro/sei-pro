# Smoke Test Manual — SEI Pro PRF

> Rede de segurança mínima para fechar fases da migração arquitetural
> (ver `DEVELOPMENT.md`). Os testes Vitest cobrem funções **puras**;
> **não** cobrem efeitos de DOM, carregamento de CSS por página, nem a ordem real de
> injeção dos content scripts. Este checklist cobre essa lacuna — foi a ausência dele
> que deixou a regressão do `loadStyleDesign` passar batida.

## Pré-requisitos (obrigatório antes de cada rodada)

1. `npm run build` — gera `dist/js/core-stack.bundle.js` + `dist/manifest.json`.
   **Carregar `dist/` sem buildar testa um bundle desatualizado.**
2. `npm test` — suite Vitest verde (pretest já roda o build).
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
- [x] **Projetos (Gantt)** — com `gerenciarprojetos` ligado: painel aparece na home; demo seed carrega; criar/editar etapa; arrastar barra confirma reprogramação; portfolio / filtro / export JSON abrem sem erro. Console sem referência a Google Sheets. _(2026-07-29 · v2.2.0)_
- [ ] Integração Google Sheets (se configurada para formularios/sync) ainda autentica.
- [ ] Notificação de novos processos (badge no ícone) atualiza.

### 2. Árvore de documentos (`init_arvore.js` — dentro do `ifrArvore`)
- [ ] Menus de ação rápida aparecem ao passar sobre os documentos.
- [ ] Upload via drag-and-drop (file-queue) abre e envia.
- [ ] Anotações e informações do documento exibem.
- [ ] Detecção de versão dentro do iframe OK (`parent.isNewSEI` — não migrado de propósito).
- [ ] **Filtro/realce rápido na árvore** (digitar no campo de pesquisa rápida realça/filtra os
      documentos da árvore) — valida `QuickTree*` delegando a `SeiPro.core.quickfilter` no iframe
      (Fase 6, 15ª leva). Testar termo **com acento** (ex.: "memória") confirma o realce correto.

### 3. Editor de documentos (`editor_montar` — CKEditor)
- [x] Barra de ferramentas SEI Pro carrega (estilos de tabela, copiar formatação).
- [x] Rascunhos locais são salvos; comparação, escolha de seções e restauração funcionam.
- [x] Links de legislação / notas de rodapé / QR code funcionam.
- [x] O botão **Assistente IA** está visível na barra; abre um painel lateral de conversa, com ações rápidas para analisar processo, redigir despacho, deferir, indeferir e revisar minuta.
- [x] O assistente recebe a árvore do processo, mostra as etapas de leitura e responde em streaming; uma nova instrução mantém a conversa aberta.
- [x] Atalhos de teclado respondem.
- [x] Parar interrompe também a preparação do contexto e as leituras pendentes; **Inserir no documento** só grava a minuta após clique explícito.
- [x] Documento restrito/sigiloso ou com acesso desconhecido exige confirmação; endpoint confiável confirma uma vez por sessão.
- [x] O histórico local de autorizações aparece em Configurações e pode ser baixado/limpo.
- [x] Checklist aponta tags, referências, citações, campos vazios e revisões; “Ir ao ponto” localiza a pendência.
- [x] `Ctrl+K` abre a paleta, pesquisa, favorita e executa ações de todas as categorias.
- [x] “Aceitar minhas” aceita somente revisões do usuário atual.
- [x] Inserção de dados do processo pesquisa sem acento e atualiza a prévia.
- [x] Trechos da unidade salvam, substituem placeholders e inserem texto escapado.
- [x] Comparação com documento anterior destaca inclusões e exclusões.
- [x] Abrir o mesmo documento em duas abas exibe aviso de edição concorrente.

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
- [ ] Auto-fill de senha funciona no SEI 4.0+ (`sip/login.php`) — valida
      `isLoginPageNewSei` em `SeiPro.sei.urls` (Fase 6, 16ª leva).
- [ ] Máscara/auto-fill da senha na tela `acao=documento_assinar` — valida `isDocumentoAssinarPage`.

---

## Foco específico por fase

| Fase | O que exercitar com atenção |
|---|---|
| 3 — Adapter de versão | Rodar **as duas** versões do SEI; conferir seletores/ramos que diferem entre 4.x e 5.x. |
| 4 — Storage/rede | Confirmar persistência (favoritos/config) e que o caminho service worker responde; testar erro de rede da IA. |
| 5 — Build | Carregar `dist/` **após `npm run build`**; conferir que o bundle carrega antes do jQuery sem erro de ordem. |
| 6 — Feature folders | Exercitar a feature movida; validar que os globais legados (`window.<fn>`) ainda existem via alias. |

## Risco conhecido a vigiar — fronteira CKEditor/IA

O CKEditor 4 pertence à página e, por isso, o adaptador do editor é injetado no mundo
`MAIN`. A IA, os perfis, as chaves, o armazenamento e as chamadas de modelo permanecem no
mundo isolado. A ponte `editor/ai-bridge.js` aceita somente duas operações:
`snapshot` (minuta, seleção e instantâneo serializável do processo) e `insertHtml`.

Não há shim de `chrome.runtime`, proxy de storage, chamada LLM ou porta do service worker
no mundo `MAIN`. Os testes `editor-loader-bridge`, `page-runtime` e `ai-bridge` bloqueiam
regressões dessa fronteira. Fique atento a:

> `A ponte isolada do editor ainda não está disponível`

que indica ordem de carga ou contexto incorreto. Qualquer nova operação nessa ponte exige
revisão de privacidade e teste estrutural; não se deve transportar chaves, perfis completos
ou APIs do navegador.

## Execuções registradas

### 2026-08-06 · Editor / IA v2.3.0 — ✅ PASSOU (confirmado)
Gate §3 (editor + assistente IA / streaming / consentimento / inserção / checklist /
paleta / rascunhos / legislação) exercitado manualmente no SEI. Checklist da seção 3
marcado como concluído.

### 2026-07-30 · Chrome (macOS) · SEI PRF produção — Editor v2.2.0 — ⚠️ PARCIAL
Build atual carregado por refresh do editor, sem alterar nem salvar a minuta. Validado:
- toolbar SEI Pro e seleção correta da seção CKEditor ativa;
- `Cmd+K`, busca da paleta e execução de comando da toolbar (diálogo de QR aberto e
  cancelado);
- painel de trechos vazio, painel de rascunhos vazio e seletor de documento anterior;
- checklist detectando quatro marcadores do modelo e oferecendo “Ir ao ponto”;
- nenhum erro novo no console após as correções encontradas durante a rodada.

A rodada revelou e corrigiu quatro regressões, agora cobertas por Vitest: seleção fora de
`<p>` no manipulador de teclado, comando da paleta escolhendo a primeira toolbar desabilitada,
ações da toolbar sem delegação após a remoção dos handlers inline e painel de trechos
recebendo o repositório de rascunhos.

Pendente nesta rodada: recarregar o manifesto da extensão no Chrome e repetir IA/streaming,
consentimento de documento protegido, auditoria e modo inline. O navegador automatizado não
permite controlar `chrome://extensions`; o DOM confirmou apenas a metade `MAIN` da ponte
(`mainInstalled=true`, sem `isolatedInstalled`). Também permanecem pendentes os fluxos que
alteram a minuta (salvar/inserir/restaurar) e o teste em Firefox.

### 2026-07-29 · Chrome (macOS) · SEI 5.x — Projetos (Gantt) v2.2.0 — ✅ PASSOU
Painel local-first na home com `gerenciarprojetos`; demo seed; criar/editar etapa; drag com confirmação; portfolio / filtro / export JSON. Console sem Google Sheets.

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
