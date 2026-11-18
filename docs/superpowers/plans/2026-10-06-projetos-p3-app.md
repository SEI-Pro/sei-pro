# Gestor de Projetos em TS — P3: app embutido — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pôr o gestor de projetos novo na tela do SEI: o painel "Projetos" embutido no Controle de Processos (título com pílulas de alerta, abas, cabeçalho, Gantt com a lista de etapas alinhada, Lista, Todos, balão da etapa, filtro, menu ajustes, diálogos de projeto e etapa, concluir com 1 clique, primeiro uso, CSV e impressão), o content script que o monta e atende o app por RPC, o build com as saídas em `dist/`, o manifest Lab e a guarda do legado.

**Architecture:** O content script `projetos/src/pagina/` (IIFE `dist/js/init_projetos.js`) marca o `<html>`, monta o painel com `@comum/painel/embutido`, liga a porta do iframe e atende o app (contexto, altura, sobreposição, aviso, abrir processo/documento, conferir número SEI, processos da caixa, usuários da unidade) e pinta as pílulas de alerta no título. O app `projetos/src/app/` (ESM `dist/js/projetos/app.js`, `html/projetos.html#modo=embutido` e `#modo=impressao`) é um `AppProjetos` que junta os dois escopos da unidade (`RepositorioProjetos` do P2), desenha componentes puros (`app/componentes/`, `app/dialogos/`) e reaproveita a vista do Gantt entre redesenhos. A sincronia (P4) e o lateral (P5) entram por pontos de extensão (`ProvedorSincronia`, `ExtensoesMenu`, `focarProjeto`, `modo=lateral`).

**Tech Stack:** TypeScript 5.9 (`strict`, `noUncheckedIndexedAccess` no pacote; o content script num `tsconfig.pagina.json` sem ele, por causa do `sei-nucleo`), esbuild 0.25 (`charset: "ascii"`), tsx 4 + linkedom 0.18 (provas), Biome 2, Frappe Gantt 1.2.2 vendorizada (P2), `sei-comum` (painel embutido, RPC, diálogos, combobox, menu, flutuante, aviso, avatar, CSV), `sei-nucleo` (contexto, caixa, pesquisa rápida, `listarOpcoes`).

**Spec:** `docs/superpowers/specs/2026-10-06-projetos-design.md` (seções 3.1, 3.2, 3.4, 4.1, 4.3, 5.4, 7 e 9) e as telas aprovadas `docs/superpowers/specs/2026-10-06-projetos-telas/painel.html` (variante **B**) e `formularios.html` (textos e interações). Plano-mestre: `docs/superpowers/plans/2026-10-06-projetos-00-mapa.md` (fase P3). Pendências herdadas: `.superpowers/sdd/notas-fases.md` (seção P3).

**Como este plano foi escrito:** todo o código abaixo foi montado e rodado antes, numa cópia da worktree no scratchpad, com as tarefas 9 a 12 do plano P2 aplicadas por cima do código real (repositório com gravação única). Cada tarefa compila (`tsc`), passa no Biome, passa nas suas provas (as contagens esperadas estão em cada tarefa) e, a partir da Tarefa 13, no build. Depois o plano foi reconstruído a partir deste markdown, tarefa por tarefa, numa cópia limpa, e as contagens e as falhas esperadas conferiram.

## Global Constraints

- Idioma: código, nomes, comentários, textos de interface e mensagens em português do Brasil; título de commit sem acento (ex.: `Projetos: ...`, `Comum: ...`), terminando com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Git: trabalhar só na worktree `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos` (branch `feat/projetos-ts`); conferir `git branch --show-current`; **nunca `git add -A`** (adicionar por caminho); sem push, merge, release.
- `dist/js` gerado: só ASCII (esbuild `charset: "ascii"` + portão de bytes > 0x7f no `build.mjs`). JS legado editado à mão (`init.js`, `sei-pro-projetos.js`): sem acento (se precisar, `\uXXXX`), conferido por bytes (o grep BSD não detecta byte cru; as ferramentas Write/Edit convertem `\uXXXX` em caractere cru — conferir depois de editar). Nos fontes TS deste plano não há nenhuma sequência `\u` (BOM do CSV é `String.fromCharCode(0xfeff)`).
- DOM seguro: em TS só `h()`/`textContent`/`createElementNS`; proibido `innerHTML`, `outerHTML` (escrita), `insertAdjacentHTML`, atributos `on*` em string; no legado, nada de HTML novo vindo de dados.
- Sessão do SEI: nunca montar URL do SEI; abrir processo/documento só por links da própria página ou pela pesquisa rápida; **nunca carregar a árvore de processo em segundo plano** (marca "recebido") — a única leitura de árvore deste plano (lista completa de usuários) usa um processo da caixa já visualizado e não sigiloso (Decisão 4).
- SEI em HTTP: sem `crypto.randomUUID` direto e sem Web Locks — ids por `novoId()` de `@comum/id`.
- Privacidade: processo sigiloso nunca vai ao Texto Padrão nem ao Agente; no CSV o número sai em branco (também quando a etapa herdaria o do projeto); no painel o próprio usuário continua vendo.
- Datas: `DataISO` local (`hojeISO`/`deISO`); nunca `toISOString()` para data local; datas de formulário passam por `dataDeFormulario` (válida e entre 2000 e 2100) antes do modelo.
- Testes: tsx + linkedom, agregador `projetos/tests/verificar.ts`; **linha de base que não pode cair**: sei-comum 406 (vira 419 na Tarefa 1), sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054; projetos 393 ao fim do P2 (no ensaio).
- Portões: `npx tsc --noEmit` (e, a partir da Tarefa 12, `npm run tipos`, que roda também o `tsconfig.pagina.json`) e `npx biome check src tests` nos pacotes tocados; portão ASCII e DOM seguro do `build.mjs`; `node tools/check-dom-injection.mjs`; `node tools/patch-manifests.mjs --check` (o `tools/` é gitignored e foi copiado para a worktree).
- Manifest: só `dist/manifest.json` (Lab MV3) recebe o novo módulo; oficial e Firefox ficam como estão.
- Visual: tokens `--spro-*` e classes de `sei-comum/src/ui/base.css` e `lista.css`; layout, textos e comportamento das telas aprovadas (variante B; "Fase" no lugar de "Macroetapa"; botão de menu geral com o ícone `ajustes`); cabeçalho da lista 64 px e linha 36 px (`MEDIDAS`); tema do SEI (`data-tema` + cor da barra) no embutido; princípio "poucos botões, poucos passos, essencial à mostra e o resto recolhido com resumo".
- Chaves de armazenamento: `projetos/<host>|<login>|u:<idUnidade>/<un|eu>/<p|f|e|h|m>/<id>`; preferências em `projetos/preferencias`; usuários em `projetos/usuarios/<host>|u:<id>` (cache 1 dia).

## Review Focus

1. **Textos hostis em todo o app** — nome de projeto, fase, etapa, responsável, item de checklist e registro do histórico com `<img src=x onerror=...>`, aspas, `&`, acento e emoji aparecem como texto na aba, no "Mais N", no cabeçalho, na lista, na tabela, no Todos, no balão, nos diálogos, nos arquivados, no aviso, na impressão e no CSV (fórmula `= + - @` neutralizada; aspas protegidas). Provas: Tarefas 3, 4, 5, 6, 7, 8, 9, 10 e 11 (`HOSTIL` de `tests/cenarioGantt.ts`).
2. **Data de formulário impossível ou fora do calendário** — 30/02, "2026-13-40", ano 9999, término antes do início, "Começa em" vazio no modelo: nada chega ao modelo (`fimPorDuracao`/`deISO` não rodam com lixo), a mensagem aparece no diálogo e ele fica aberto. Provas: Tarefas 2 (`dataDeFormulario`), 8 e 9.
3. **Concluir, desfazer e informar documento fora de ordem** — conclusão de etapa já concluída não muda a data; "Desfazer" só reabre se a conclusão ainda é a de hoje; "Informar documento" troca a data e o número sem reabrir. Provas: Tarefa 11 (concluir, informar documento, desfazer) e Tarefa 7 (o balão de etapa concluída só oferece "Reabrir").
4. **Muitas mudanças de preferência seguidas e de dois contextos** — o content script grava `recolhido`, o app grava o resto; vários cliques seguidos (pílula de alerta grava vista, filtro e aba de uma vez) não podem perder nada. Provas: Tarefa 2 (gravar mescla) e Tarefa 11 (fila de gravação).
5. **Filtro ou fase recolhida escondendo o que se pede** — pílula de alerta sem etapa correspondente, filtro que não deixa nada, "Abrir no painel" de uma etapa escondida: mensagem com "Limpar filtro", nunca uma vista vazia sem explicação; a etapa pedida aparece (filtro limpo, fase aberta) e o balão abre. Provas: Tarefa 11.

## Decisões desta fase

1. **Uma tarefa de `sei-comum` antes do app** (compatível com Favoritos e Histórico, que não mudam): `esperarConexaoDaAba(canal, tratadores?)` (a aba também chama o app: pílula de alerta, "Abrir no painel" do P5); `ligarPortaDoPainel(...)` devolve também `rpc()`; aviso com mais de uma ação (`avisar(texto, [acao1, acao2])`, `avisoComAcoesNaPagina`, `tratadoresDoPainel({ avisarAcoes })`) para o "Informar documento" | "Desfazer" da tela 2; ícone `gantt` no `icone()` comum (diálogos, menus e, no P5, a aba do shell). A aba de versão anterior continua entendendo o aviso (vai também `acao`, a primeira).
2. **Dois tsconfig no pacote.** O `sei-nucleo` não segue `noUncheckedIndexedAccess` (28 erros se o `tsc` do projetos o percorrer). O `tsconfig.json` exclui `src/pagina` e `tests/pagina`; o `tsconfig.pagina.json` estende o do pacote sem a regra e inclui só eles. O agregador importa a suíte do content script por um caminho numa variável (o `tsc` não segue), então a contagem continua uma só. O app NUNCA importa de `src/pagina` (tipos da ponte em `src/ponte/tipos.ts`).
3. **O título do painel é do content script** (página do SEI): as pílulas "N atrasada(s)" e "N vence(m) nesta semana" são calculadas lá, com os mesmos `carregarUnidade`/`alertasDaUnidade` do app, aparecem também recolhido e, ao clicar, abrem o painel, rolam até ele e pedem `alerta { tipo }` ao app. O app abre o projeto se só um tem o alerta; senão, o Todos filtrado. Para "vence nesta semana" o filtro ganha o chip `semana` (`modelo/filtro.ts`, "Vence nesta semana · N").
4. **Usuários da unidade** (`usuariosDaUnidade`, spec 7): a lista completa vem do núcleo (`listarOpcoes(sei, "usuarios", …)`), que lê o formulário de atribuição a partir da árvore de um processo. Para não marcar nada como recebido, o processo escolhido é da caixa já carregada, **já visualizado** (sem `processoNaoVisualizado`) e não sigiloso: para ele o `receber` do SEI não grava andamento nem muda visualização. Só roda quando o usuário abre o diálogo da etapa (uma vez por carga do app) e o resultado fica 1 dia em `projetos/usuarios/<host>|u:<id>`. Junto, sem requisição, as atribuições que a caixa mostra e o próprio usuário. Sem processo seguro, fica a lista parcial e o texto livre. **Conferir ao vivo no P6.**
5. **Conferência do número SEI** (diálogo da etapa e "Informar documento"): pela pesquisa rápida (`procedimento_trabalhar`, que não chama `receber`), sem abrir a árvore. O título do documento só existe na árvore; aqui a conferência diz "Documento encontrado no processo <protocolo>" (o protocolo vem do `<title>` da tela). O título conferido pela árvore aberta é do P5.
6. **Menu ajustes do P3:** Projetos arquivados (só com arquivados), Mostrar lista de etapas, Mover dependentes ao arrastar, Ordenar por início/nome/cadastro (três itens marcáveis: o menu comum não tem submenu), Exportar planilha (CSV), Imprimir / salvar PDF. O que é do P4 (Sincronização…, Modelos de projeto…, Enviar/Receber projeto por arquivo…, Importar do servidor do Atividades…, Histórico de alterações) **não aparece** (nada de item desligado poluindo); entra pelas `ExtensoesMenu` (`sincronia`, `arquivo`, `fim`) no lugar da spec.
7. **Arquivados, Duplicar, Salvar como modelo e mudar "Quem vê" entram no P3**, porque o diálogo Editar projeto já os oferece e sem eles um projeto arquivado sumiria: diálogo simples de arquivados (Reativar, Excluir), nome do modelo, e `moverEntreEscopos` com confirmação do impacto. O consentimento do Texto Padrão da unidade é do P4.
8. **Estado da sincronia:** sem provedor (P3), "neste navegador" (tom `local`, dica "Os projetos ficam guardados neste navegador."). O P4 passa um `ProvedorSincronia`.
9. **Concluir não reconclui** (pendência do P2): o app relê a etapa antes de concluir e para se ela já está concluída; o balão de etapa concluída só oferece "Reabrir"; o "Desfazer" do aviso só reabre se `concluidaEm` ainda é a de hoje.
10. **Fase morta = sem fase** (pendência do P2): `etapasComFaseViva` tira da etapa o id de fase removida antes de qualquer tela; salvar a etapa grava sem ele. O histórico continua com o apoio real (o app só usa `editarEtapa`, que passa o apoio; nunca gera registro sozinho).
11. **Painel com id próprio** `projetosPro` (o legado usa `projetosGantt`); ordem: a do painel novo em `optionsPro.orderPanelHome` e, sem ela, a do legado; sem nenhuma, no fim do `#panelHomePro`.
12. **Balão e popover do filtro são `<dialog>` NÃO modal** (`componentes/camada.ts`) posicionados por `abrirFlutuante`: as listas dos seletores e menus abertos dentro deles moram neles (`destinoDaCamada`), então escolher uma opção não fecha o popover; Esc e clique fora fecham.
13. **A vista é reaproveitada**: com o mesmo projeto e o mesmo modo, um redesenho chama `VistaProjeto.atualizar` (a Frappe não remonta e a rolagem fica); esconder a lista ou mudar "mover dependentes" remonta. O cartão e o corpo são fixos (`AppProjetos` só troca abas, cabeçalho e o que muda no corpo). Filtro e fases recolhidas redesenham só o corpo (o popover fica aberto).
14. **Preferências gravadas em fila** (`AppProjetos.mudarPrefs`): ler-mesclar-gravar não corre em paralelo dentro do app; o content script grava só `recolhido`.
15. **Exportar CSV** exporta o que está na tela: a aba aberta (ou o portfólio), com o filtro aplicado às etapas; uma linha por etapa; nome `projeto-<nome>-<data>.csv` ou `projetos-<data>.csv`.
16. **Imprimir** abre `html/projetos.html#modo=impressao&host=…&login=…&unidade=…&projeto=…&escala=…&lista=…` numa janela nova (a página da extensão lê o armazenamento direto): título, Gantt só leitura e tabela, depois `window.print()`; o título da página vira o nome do projeto (nome do PDF).
17. **No P3 o content script só age na janela de topo do Controle de Processos** (e marca o `<html>` em todos os frames, no `document_start`). Caixa, árvore e lateral são do P5; o `#modo=lateral` mostra "Este modo do painel ainda não está disponível.".
18. **Falha da Frappe** (spec 9): a vista cai para a Lista com o aviso "O Gantt não abriu neste navegador; mostrando a lista." e fica assim até o usuário escolher "Gantt" de novo.
19. **Escala Mês/Ano é só leitura** (decisão 3 do P2): ao escolher uma delas, um aviso curto explica "Nesta escala as datas ficam só para leitura: arraste em Dia ou Semana.".
20. **O módulo respeita a opção antiga "Gerenciar Projetos"** (`lerOpcaoLegada("gerenciarprojetos")`), como os Favoritos respeitam "gerenciarfavoritos" (perfil de teste limpo tem todas as opções desligadas: ligar no P6).
21. **Legado:** `init.js` só carrega `sei-pro-projetos.js` se o `<html>` não tem `data-seipro-projetos` OU há servidor do Atividades (`configBasePro_atividades` com `URL_API` e `KEY_USER`); com os dois, o título do legado vira "Projetos (Atividades)". O `sei-pro-atividades.js` só chama `initProjetos` em fluxos do servidor, quando o legado está carregado.
22. **`api.ts` fica** como índice do núcleo (P2); o build do P3 empacota as entradas reais (`src/pagina/main.ts`, `src/app/main.ts`) e o portão estrito (nem a palavra `innerHTML`/`outerHTML`) vale para o `app.js`, que leva a Frappe; no content script vale o de escrita (o `paginaDe` do núcleo LÊ `outerHTML`).

## Estrutura de arquivos

```
sei-comum/src/ponte/conexaoDaAba.ts     (mod) tratadores do app
sei-comum/src/painel/embutido.ts        (mod) rpc() da porta; aviso com acoes
sei-comum/src/painel/aviso.ts           (mod) avisoComAcoesNaPagina, emissor com varias acoes
sei-comum/src/ui/aviso.ts               (mod) AcoesAviso, listaDeAcoes
sei-comum/src/ui/dom.ts                 (mod) icone "gantt"
sei-comum/tests/verificar-ponte-app.ts  provas da Tarefa 1
projetos/
  tsconfig.json (mod: exclui src/pagina), tsconfig.pagina.json, package.json (mod: tipos), build.mjs (saidas reais)
  estatico/projetos.html, projetos.css
  src/ponte/tipos.ts                    contrato da ponte (sem DOM, sem nucleo)
  src/modelo/filtro.ts                  (mod) chip "semana"
  src/app/
    main.ts             entrada (embutido, impressao; lateral = P5)
    app.ts              AppProjetos (orquestracao)
    dados.ts            dois escopos da unidade, fase morta, alertas
    preferencias.ts     spec 5.4
    formato.ts          datas, plurais, historico, dataDeFormulario
    sincronia.ts        ProvedorSincronia (P4) e SEM_SINCRONIA
    icones.ts           modelo, checklist, progresso, situacao
    impressao.ts        #modo=impressao
    componentes/        abas, menuAjustes, vazio, camada, cabecalho, filtro, vistaProjeto, tabelaEtapas,
                        vistaTodos, balaoEtapa
    dialogos/           campos, etapa, projeto, apoio (arquivados, informar documento, nome do modelo)
  src/arquivo/csv.ts    exportar planilha
  src/pagina/           main, marca, contexto, painel (+ pilulas), executor, usuarios, documento
  tests/                apoioApp.ts, ganttFalso.ts, verificar-app*.ts, verificar-estatico.ts, verificar-manifest.ts
  tests/pagina/         util.ts, verificar-pagina.ts (tsconfig.pagina.json)
dist/  js/init_projetos.js, js/projetos/app.js, html/projetos.html, css/projetos.css (gerados), manifest.json (mod),
       js/init.js (mod), js/sei-pro-projetos.js (mod)
tools/check-dom-injection.mjs (gitignored: mod local, nos dois clones)
```

## Interfaces exportadas (o que P4 e P5 consomem)

- **Ponte** (`src/ponte/tipos.ts`): `CANAL_PROJETOS = "seipro-projetos"`; `ContextoProjetos { host; login; nome; unidade: {id; sigla; nome} | null; versao; temaEscuro; corTema?; atividades }`; `ProcessoDaCaixa { protocolo; idProcedimento; tipo?; especificacao?; sigiloso }`; `UsuarioDaUnidade { login?; nome }`; `DocumentoConferido { numero; protocolo? }`; `TipoAlerta = "atrasadas" | "semana"`.
- **RPC app → aba** (`src/pagina/executor.ts`, `tratadoresProjetos(DepsExecutor)`): `contexto`, `altura {px}`, `sobrepor {ativo}`, `aviso {texto, acao?, acoes?, ms}` (→ boolean ou índice), `abrirProcesso {id, protocolo, novaAba}`, `abrirDocumento {numero}`, `conferirDocumento {numero}` → `DocumentoConferido | null`, `processosDaCaixa` → `ProcessoDaCaixa[]`, `usuariosDaUnidade` → `UsuarioDaUnidade[]`, `atividadesDisponivel` → boolean. O P4 acrescenta `sincronizarAgora`, `apagarDoSei`, `importarAtividades`; o P5, os do lateral.
- **RPC aba → app** (`src/app/main.ts`, fila até o app ficar pronto): `alerta {tipo}`, `focarProjeto {id, etapa?}`.
- **App** (`src/app/app.ts`): `new AppProjetos(DepsApp)` com `iniciar(): Promise<void>`, `destruir()`, `aoRedimensionar()`, `aplicarAlerta(tipo: TipoAlerta)`, `focarProjeto(id: string, etapa?: string): boolean`, `get aberto(): string`. `DepsApp { raiz; ctx; area; repos: Record<Vis, RepositorioProjetos>; rpc; abrirModal; confirmar; baixar; hoje(); agora(); imprimir?(ParametrosImpressao); montarGantt?; sincronia?: ProvedorSincronia; extensoesMenu?: ExtensoesMenu; importarAtividades?(); aoRedesenhar?(); largura?() }`.
- **Sincronia (P4)** (`src/app/sincronia.ts`): `ProvedorSincronia { estado(): EstadoSincronia; aoMudar(cb): () => void }`, `EstadoSincronia { rotulo; dica; tom: "local" | "ok" | "pendente" | "erro" }`, `SEM_SINCRONIA`.
- **Menu (P4)** (`src/app/componentes/menuAjustes.ts`): `ExtensoesMenu { sincronia?(): EntradaMenu[]; arquivo?(): EntradaMenu[]; fim?(): EntradaMenu[] }`; `criarMenuAjustes(() => OpcoesMenuAjustes)`.
- **Dados** (`src/app/dados.ts`): `ProjetoNaTela { projeto; vis; fases; etapas; resumo }`, `DadosUnidade { ativos; arquivados; modelos }`, `carregarUnidade(repos, hoje)`, `montarUnidade(porVis, hoje)`, `etapasComFaseViva(etapas, fases)`, `alertasDaUnidade(ativos, hoje) → { atrasadas; semana; comAtraso; comSemana }`.
- **Preferências** (`src/app/preferencias.ts`): `Preferencias` (inclui `modoLateral` e `soMinhas` para o P5), `lerPreferencias(area)`, `gravarPreferencias(area, parcial)`, `normalizarPreferencias`, `escalaDoProjeto`, `chaveAberto(host, login, unidade)`.
- **Componentes reaproveitáveis (P5)**: `conteudoDoBalao(DadosBalao, AcoesBalao, fechar)` e `abrirBalaoEtapa(ancora, d, a, aoFechar?)` (o P5 põe o conteúdo num Shadow DOM com o CSS como texto), `abrirDialogoEtapa(ContextoDialogoEtapa)`, `abrirDialogoProjeto(ContextoDialogoProjeto)`, `abrirInformarDocumento(...)`, `iconeSituacao(situacao, marco)`, `pilulaDaSituacao`, `campoProcesso`, `campoDocumento`.
- **Arquivo** (`src/arquivo/csv.ts`): `csvDosProjetos(itens, hoje)` (sigiloso em branco), `nomeDoCsv(nome | null, hoje)`. **Impressão** (`src/app/impressao.ts`): `ParametrosImpressao`, `hashDaImpressao`, `lerImpressao`, `montarImpressao`.
- **Content script (P5 estende `principal()`)**: `marcarAtivo`/`ATRIBUTO_ATIVO = "data-seipro-projetos"`, `contextoProjetos`, `atividadesConfigurado`, `montarPainelProjetos`, `pintarAlertas`, `ordemDoPainel`, `ID_PAINEL = "projetosPro"`, `processosDaCaixa`, `usuariosDaCaixa`, `usuariosDaUnidade`, `processoSeguroDaCaixa`, `conferirDocumento(pesquisar, numero)`.
- **sei-comum**: `esperarConexaoDaAba(canal, tratadores?)`, `ligarPortaDoPainel(...) → { fechar(); rpc(): Rpc | null }`, `avisar(texto, AcoesAviso, ms)`, `listaDeAcoes`, `avisoComAcoesNaPagina`, `AvisarComAcoes`, `tratadoresDoPainel({ …, avisarAcoes })`, `icone("gantt")`.

## Como rodar

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos"
npx tsx tests/verificar.ts   # ultima linha: "N ok, 0 falha(s)"
npx tsc --noEmit             # sem saida (a partir da Tarefa 12: npm run tipos)
npx biome check src tests    # sem erro
node build.mjs               # a partir da Tarefa 13: "portoes: ASCII e DOM seguro ok"
```

Provas acumuladas do projetos ao fim de cada tarefa (ensaio; base 393 = fim do P2): 1 → 393 (sei-comum 406 → 419) · 2 → 420 · 3 → 441 · 4 → 463 · 5 → 488 · 6 → 501 · 7 → 523 · 8 → 550 · 9 → 576 · 10 → 591 · 11 → 628 · 12 → 659 · 13 → 665 · 14 → 671. Os outros pacotes não mudam: sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054.

---
### Task 1: Comum — o app atende a aba, a porta do painel exposta, aviso com duas ações e ícone gantt

**Files:**
- Modify: `sei-comum/src/ponte/conexaoDaAba.ts`, `sei-comum/src/painel/embutido.ts`, `sei-comum/src/painel/aviso.ts`, `sei-comum/src/ui/aviso.ts`, `sei-comum/src/ui/dom.ts`, `sei-comum/tests/verificar.ts`
- Test: `sei-comum/tests/verificar-ponte-app.ts`

**Interfaces:**
- Consumes: `criarRpc`, `parDePortas`, `montarPainelEmbutido`, `mostrarAviso`, `avisoNaPagina` (existentes).
- Produces: `esperarConexaoDaAba(canal: string, tratadores?: Record<string, Tratador>): Promise<Rpc>`; `ligarPortaDoPainel(...): { fechar(): void; rpc(): Rpc | null }`; `type AcoesAviso = AcaoAviso | readonly AcaoAviso[] | undefined`, `listaDeAcoes(a): AcaoAviso[]`, `avisar(texto, acao?: AcoesAviso, ms?)`, `mostrarAviso(doc, texto, acao: AcoesAviso, ms)`; `type AvisarComAcoes = (texto, acoes: readonly string[], ms) => Promise<number>`, `avisoComAcoesNaPagina(doc, temaEscuro, prefixo?)`; `tratadoresDoPainel({ iframe; sobreposicao?; avisar?; avisarAcoes? })` (o `aviso` com `acoes` de 2 ou mais devolve o índice); `icone("gantt")`.

- [ ] **Step 1: Conferir a branch e o ponto de partida**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && (cd sei-comum && npx tsx tests/verificar.ts 2>&1 | tail -2) && (cd projetos && npx tsx tests/verificar.ts 2>&1 | tail -2)
```
Expected: `feat/projetos-ts`, `406 ok, 0 falha(s)` (sei-comum) e a contagem do fim do P2 no projetos (393 no ensaio).

- [ ] **Step 2: Escrever a prova que falha**

Arquivo completo `sei-comum/tests/verificar-ponte-app.ts`:

```ts
import { avisoComAcoesNaPagina, emissorDeAvisoPelaPagina } from "../src/painel/aviso";
import { ligarPortaDoPainel, montarPainelEmbutido, tratadoresDoPainel } from "../src/painel/embutido";
import { esperarConexaoDaAba } from "../src/ponte/conexaoDaAba";
import { parDePortas } from "../src/ponte/parDePortas";
import { criarRpc, type PortaRpc, type Rpc } from "../src/ponte/rpc";
import { mostrarAviso } from "../src/ui/aviso";
import { icone } from "../src/ui/dom";
import { botao, checar, disparar, instalarDom, secao, tique } from "./util";

type Ouvinte = (p: PortaRpc & { name: string; sender: unknown }) => void;

/** O `chrome` do app (página da extensão): só o que a conexão com a aba usa. */
function fingirChrome(aba: number): { conectar(p: PortaRpc, tabId: number, frameId?: number): void; restaurar(): void } {
  const g = globalThis as { chrome?: unknown };
  const antes = g.chrome;
  const ouvintes: Ouvinte[] = [];
  g.chrome = {
    tabs: { getCurrent: async () => ({ id: aba }) },
    runtime: { onConnect: { addListener: (cb: Ouvinte) => void ouvintes.push(cb) } },
  };
  return {
    conectar(p, tabId, frameId = 0) {
      for (const o of ouvintes) o({ ...p, name: "seipro-teste", sender: { tab: { id: tabId }, frameId } });
    },
    restaurar() {
      g.chrome = antes;
    },
  };
}

export async function verificarPonteApp(): Promise<void> {
  secao("ponte do app: a aba tambem chama o app");
  instalarDom();
  const cr = fingirChrome(7);
  const conexao = esperarConexaoDaAba("seipro-teste", { alerta: (a) => `recebi ${(a as { tipo?: string }).tipo}` });
  const [outraApp, outraAba] = parDePortas();
  let outraCaiu = false;
  outraAba.onDisconnect.addListener(() => {
    outraCaiu = true;
  });
  cr.conectar(outraApp, 9);
  const [app, aba] = parDePortas();
  cr.conectar(app, 7);
  const rpcApp = await conexao;
  await tique();
  checar("porta de outra aba e recusada", outraCaiu);
  const rpcAba = criarRpc(aba);
  checar("a aba chama um tratador do app", (await rpcAba.chamar<string>("alerta", { tipo: "atrasadas" })) === "recebi atrasadas");
  checar("o app continua chamando a aba", rpcApp.aberta);
  cr.restaurar();

  secao("ponte do app: porta do painel exposta para a aba");
  const doc = instalarDom('<html><body><form id="frmProcedimentoControlar"></form></body></html>');
  const mp = montarPainelEmbutido(doc, {
    id: "projetosPro",
    titulo: "Projetos",
    icone: () => icone("calendario", 20),
    urlApp: "chrome-extension://abc/html/projetos.html",
    tituloIframe: "Projetos do SEI Pro",
    prefixo: "spro-prj",
    rotulos: { mostrar: "Mostrar projetos", recolher: "Recolher projetos" },
    recolhido: false,
    ordem: null,
    aoRecolher: () => undefined,
  })!;
  let ladoApp: Rpc | null = null;
  const porta = ligarPortaDoPainel(
    mp,
    () => {
      const [a, b] = parDePortas();
      ladoApp = criarRpc(a, { focar: (x) => `foco em ${(x as { id?: string }).id}` });
      return b;
    },
    tratadoresDoPainel({ iframe: mp.iframe }),
  );
  checar("antes da carga, sem porta", porta.rpc() === null);
  disparar(mp.iframe, "load");
  checar("depois da carga, a aba chama o app", (await porta.rpc()?.chamar<string>("focar", { id: "p1" })) === "foco em p1");
  checar("o app tambem chama a aba", (ladoApp as Rpc | null)?.aberta === true);
  porta.fechar();
  checar("icone gantt (titulo do painel, abas e dialogos do Projetos)", icone("gantt", 20).querySelectorAll("path").length === 2);

  secao("aviso com duas acoes (concluir: Informar documento e Desfazer)");
  const docA = instalarDom();
  const feitos: string[] = [];
  const el = mostrarAviso(
    docA,
    "“Relatório” concluída hoje (06/10).",
    [
      { rotulo: "Informar documento", fazer: () => feitos.push("doc") },
      { rotulo: "Desfazer", fazer: () => feitos.push("desfazer") },
    ],
    50,
  );
  checar("dois botoes no aviso do app", el.querySelectorAll("button").length === 2);
  botao(el, "Desfazer")!.click();
  checar("o segundo botao faz a segunda acao e o aviso sai", feitos.join() === "desfazer" && !el.isConnected);
  const docP = instalarDom();
  const avisar = avisoComAcoesNaPagina(docP, false, "spro-prj");
  const r1 = avisar("Concluída.", ["Informar documento", "Desfazer"], 5000);
  botao(docP.body, "Informar documento")!.click();
  checar("na pagina, devolve o indice da acao clicada", (await r1) === 0 && !docP.querySelector(".spro-prj-aviso"));
  checar("sem clique, devolve -1", (await avisar("Concluída.", ["A", "B"], 10)) === -1);
  const trat = tratadoresDoPainel({ iframe: null, avisarAcoes: async (_t, acoes) => acoes.length - 1 });
  checar("a aba atende o aviso com acoes", (await trat.aviso?.({ texto: "x", acao: "A", acoes: ["A", "B"], ms: 100 })) === 1);
  const pedidos: unknown[] = [];
  const emitir = emissorDeAvisoPelaPagina(
    {
      chamar: async <T>(op: string, args?: unknown) => {
        pedidos.push([op, args]);
        return 1 as T;
      },
    },
    docP,
  );
  emitir(
    "Concluída.",
    [
      { rotulo: "Informar documento", fazer: () => feitos.push("doc2") },
      { rotulo: "Desfazer", fazer: () => feitos.push("desfazer2") },
    ],
    7000,
  );
  await tique();
  const args = (pedidos[0] as [string, { acoes?: string[]; acao?: string }])[1];
  checar(
    "o app manda os rotulos e faz a acao do indice que voltou",
    args.acoes?.join() === "Informar documento,Desfazer" && args.acao === "Informar documento" && feitos.at(-1) === "desfazer2",
  );
}
```

Em `sei-comum/tests/verificar.ts`, troque:

```ts
import { verificarPainelApp } from "./verificar-painel-app";
```

por:

```ts
import { verificarPainelApp } from "./verificar-painel-app";
import { verificarPonteApp } from "./verificar-ponte-app";
```

Em `sei-comum/tests/verificar.ts`, troque:

```ts
verificarAvatar();
resumo();
```

por:

```ts
verificarAvatar();
await verificarPonteApp();
resumo();
```

- [ ] **Step 3: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/sei-comum" && npx tsx tests/verificar.ts 2>&1 | grep -m1 Error
```
Expected: `SyntaxError: The requested module '../src/painel/aviso' does not provide an export named 'avisoComAcoesNaPagina'`.

- [ ] **Step 4: Implementar**

Arquivo completo `sei-comum/src/ponte/conexaoDaAba.ts`:

```ts
/**
 * O app (iframe abaixo da lista) aceita a porta do content script da PRÓPRIA
 * aba, do frame de topo. O `onConnect` chega a todas as páginas da extensão
 * (os iframes do painel em outras abas e o painel lateral também), e cada
 * uma recusa o que não é seu. Uma porta `chrome.runtime` não pode ser forjada
 * pela página do SEI, ao contrário de um `postMessage` com token na URL do iframe.
 *
 * Se `chrome.tabs.getCurrent` não responder dentro do iframe (prova P2), vale
 * a origem do pai (`document.referrer`), aceitando a primeira porta dessa origem.
 */

import { criarRpc, type Rpc, type Tratador } from "./rpc";

/** `tratadores`: o que a aba pode pedir ao app (o objeto é lido a cada pedido: dá para preencher depois). */
export function esperarConexaoDaAba(canal: string, tratadores: Record<string, Tratador> = {}): Promise<Rpc> {
  const minhaAba = (async () => {
    try {
      return (await chrome.tabs?.getCurrent?.())?.id;
    } catch {
      return undefined;
    }
  })();
  const origemPai = (() => {
    try {
      return new URL(document.referrer).origin;
    } catch {
      return "";
    }
  })();
  return new Promise((ok) => {
    let aceita = false;
    chrome.runtime.onConnect.addListener((porta) => {
      if (porta.name !== canal || aceita) return;
      void minhaAba.then((aba) => {
        const s = porta.sender;
        const daAba = aba !== undefined ? s?.tab?.id === aba : !!origemPai && !!s?.url && new URL(s.url).origin === origemPai;
        if (aceita || !daAba || s?.frameId !== 0) {
          porta.disconnect();
          return;
        }
        aceita = true;
        console.info(`[SEI Pro] ${canal} conectado`, aba !== undefined ? "pela aba" : "pela origem");
        ok(criarRpc(porta, tratadores));
      });
    });
  });
}
```

Arquivo completo `sei-comum/src/ui/aviso.ts`:

```ts
import { h, icone } from "./dom";

export interface AcaoAviso {
  rotulo: string;
  fazer(): void;
}

/** Uma ação, várias (o aviso de "concluída": "Informar documento" e "Desfazer") ou nenhuma. */
export type AcoesAviso = AcaoAviso | readonly AcaoAviso[] | undefined;

export function listaDeAcoes(a: AcoesAviso): AcaoAviso[] {
  if (a === undefined) return [];
  return "rotulo" in a ? [a] : [...a];
}

/**
 * Quem mostra o aviso fora do app, quando o app mora num iframe que não é o
 * lugar certo para ele (por exemplo, um iframe que cresce com o conteúdo: um
 * aviso preso ao rodapé dele ficaria fora da vista). O emissor mostra o aviso
 * na tela visível da página hospedeira. Devolve false para o app mostrar ele
 * mesmo.
 */
export type EmissorAviso = (texto: string, acao: AcoesAviso, ms: number) => boolean;

let emissor: EmissorAviso | null = null;

export function definirEmissorDeAviso(e: EmissorAviso | null): void {
  emissor = e;
}

/** Aviso curto (toast) no rodapé da tela, com uma ação opcional ("Desfazer") ou mais de uma. */
export function avisar(texto: string, acao?: AcoesAviso, ms = 7000): void {
  if (emissor?.(texto, acao, ms)) return;
  mostrarAviso(document, texto, acao, ms);
}

/**
 * Onde o aviso mora: dentro do `<dialog>` modal aberto de cima, quando há um.
 * Com `showModal()`, tudo fora do diálogo fica inerte: preso ao `body`, o
 * "Desfazer" não recebe o clique (que atravessa para a linha de baixo ou cai
 * no véu e fecha o modal). Mesma regra das listas flutuantes (flutuante.ts).
 * Diálogo aberto com `show()` não torna nada inerte: aí o aviso fica no `body`.
 * Sem `:modal` no navegador, vale o último `dialog[open]`.
 */
export function destinoDoAviso(doc: Document): HTMLElement {
  const abertos = [...doc.querySelectorAll<HTMLDialogElement>("dialog[open]")];
  let conheceModal = true;
  const modais = abertos.filter((d) => {
    try {
      return d.matches(":modal");
    } catch {
      conheceModal = false;
      return false;
    }
  });
  const dialogo = modais.at(-1) ?? (conheceModal ? undefined : abertos.at(-1));
  return dialogo ?? doc.body ?? doc.documentElement;
}

export function mostrarAviso(doc: Document, texto: string, acao: AcoesAviso, ms: number): HTMLElement {
  const fundo = doc.body ?? doc.documentElement;
  // Um aviso por vez, esteja o anterior no body ou num diálogo.
  for (const lugar of [fundo, ...doc.querySelectorAll("dialog")])
    for (const velho of [...lugar.children]) if (velho.classList.contains("spro-aviso")) velho.remove();
  const el: HTMLElement = h(
    "div",
    { class: "spro-aviso", role: "status" },
    icone("check", 16),
    h("span", {}, texto),
    ...listaDeAcoes(acao).map((a) =>
      h(
        "button",
        {
          type: "button",
          onclick: () => {
            el.remove();
            a.fazer();
          },
        },
        a.rotulo,
      ),
    ),
  );
  // Camada de cima (popover): por cima do véu de um diálogo aberto, e não escondido atrás dele.
  el.setAttribute("popover", "manual");
  const mostrar = () => {
    try {
      (el as HTMLElement & { showPopover?: () => void }).showPopover?.();
    } catch {
      /* navegador sem popover: fica como elemento fixo comum */
    }
  };
  const anexar = () => {
    const destino = destinoDoAviso(doc);
    destino.append(el);
    mostrar();
    // O diálogo fecha com o aviso na tela (o "Desfazer" ainda vale): o aviso desce para o próximo lugar.
    if (destino.localName === "dialog")
      destino.addEventListener(
        "close",
        () => {
          if (vivo && destino.contains(el)) anexar();
        },
        { once: true },
      );
  };
  let vivo = true;
  anexar();
  setTimeout(() => {
    vivo = false;
    el.remove();
  }, ms);
  return el;
}
```

Arquivo completo `sei-comum/src/painel/aviso.ts`:

```ts
/**
 * Aviso (toast) do painel embutido no rodapé da TELA do SEI: dentro do iframe,
 * que cresce com a lista, um aviso preso embaixo ficaria fora da vista.
 *
 * Lado da aba (`avisoNaPagina`): estilo em linha (a página do SEI não tem a
 * base visual) e cores fixas, legíveis nos dois temas; a promessa diz se o
 * usuário clicou a ação ("Desfazer"). A animação `<prefixo>-aviso` vem do CSS
 * do painel (embutido.ts, `instalarEstiloPainel`).
 * Lado do app (`emissorDeAvisoPelaPagina`): manda o aviso para a aba; com
 * diálogo sobreposto, ou se a aba não responde, o app mostra ele mesmo.
 */

import type { Rpc } from "../ponte/rpc";
import { type EmissorAviso, listaDeAcoes, mostrarAviso } from "../ui/aviso";
import { h } from "../ui/dom";

export type AvisarNaPagina = (texto: string, acao: string | undefined, ms: number) => Promise<boolean>;
/** Mais de uma ação: a promessa diz o índice da ação clicada, ou -1. */
export type AvisarComAcoes = (texto: string, acoes: readonly string[], ms: number) => Promise<number>;

const caixa = (prefixo: string) =>
  "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483646;display:flex;align-items:center;gap:12px;" +
  "max-width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:10px 10px 10px 16px;" +
  "font:13px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#f3f5f8;background:#1f2329;" +
  "border:1px solid rgb(255 255 255 / 8%);border-radius:12px;box-shadow:0 10px 24px -6px rgb(16 24 40 / 30%),0 24px 56px -12px rgb(16 24 40 / 35%);" +
  `animation:${prefixo}-aviso 220ms cubic-bezier(.2,.8,.2,1)`;
const BOTAO =
  "flex:none;padding:5px 10px;font:inherit;font-weight:600;color:#9cc3ff;background:rgb(255 255 255 / 7%);border:0;border-radius:6px;cursor:pointer";

/** Prefixo das classes do painel na página do SEI (entra em CSS: só letras minúsculas, dígitos e hífen). */
export function validarPrefixo(prefixo: string): string {
  if (!/^[a-z][a-z0-9-]*$/.test(prefixo)) throw new Error(`Prefixo de classe inválido: ${prefixo}`);
  return prefixo;
}

export function avisoComAcoesNaPagina(doc: Document, temaEscuro: boolean, prefixo = "spro-painel"): AvisarComAcoes {
  const classe = `${validarPrefixo(prefixo)}-aviso`;
  return (texto, acoes, ms) =>
    new Promise<number>((resolver) => {
      for (const velho of doc.querySelectorAll(`.${classe}`)) velho.remove();
      let feito = false;
      const terminar = (indice: number) => {
        if (feito) return;
        feito = true;
        el.remove();
        resolver(indice);
      };
      const el = h(
        "div",
        { class: classe, role: "status", style: caixa(prefixo) + (temaEscuro ? ";background:#2b3036" : "") },
        h("span", { style: "flex:1" }, texto),
        ...acoes.map((rotulo, i) => h("button", { type: "button", style: BOTAO, onclick: () => terminar(i) }, rotulo)),
      );
      (doc.body ?? doc.documentElement).append(el);
      setTimeout(() => terminar(-1), Math.max(10, Math.min(ms, 60_000)));
    });
}

export function avisoNaPagina(doc: Document, temaEscuro: boolean, prefixo = "spro-painel"): AvisarNaPagina {
  const avisar = avisoComAcoesNaPagina(doc, temaEscuro, prefixo);
  return (texto, acao, ms) => avisar(texto, acao ? [acao] : [], ms).then((i) => i === 0);
}

/** Emissor de avisos do app embutido (ui/aviso.ts `definirEmissorDeAviso`): o aviso vai para o rodapé da tela do SEI. */
export function emissorDeAvisoPelaPagina(rpc: Pick<Rpc, "chamar">, doc: Document = document): EmissorAviso {
  return (texto, acao, ms) => {
    // Com diálogo aberto, o iframe já cobre a tela: o aviso fica no próprio app.
    if (doc.documentElement.dataset.sobreposto) return false;
    const acoes = listaDeAcoes(acao);
    // `acao` (a primeira) continua indo: é o que uma aba de versão anterior entende.
    const rotulos = acoes.length > 1 ? acoes.map((a) => a.rotulo) : undefined;
    rpc
      .chamar<boolean | number>("aviso", { texto, acao: acoes[0]?.rotulo, acoes: rotulos, ms }, ms + 5000)
      .then((r) => {
        const i = typeof r === "number" ? r : r === true ? 0 : -1;
        acoes[i]?.fazer();
      })
      .catch(() => mostrarAviso(doc, texto, acao, ms));
    return true;
  };
}
```

Em `sei-comum/src/painel/embutido.ts`, troque:

```ts
import { type AvisarNaPagina, validarPrefixo } from "./aviso";
```

por:

```ts
import { type AvisarComAcoes, type AvisarNaPagina, validarPrefixo } from "./aviso";
```

Em `sei-comum/src/painel/embutido.ts`, troque:

```ts
  avisar?: AvisarNaPagina | null;
}): Record<string, Tratador> {
```

por:

```ts
  avisar?: AvisarNaPagina | null;
  /** Aviso com mais de uma ação ("Informar documento" e "Desfazer"): devolve o índice clicado. */
  avisarAcoes?: AvisarComAcoes | null;
}): Record<string, Tratador> {
```

Em `sei-comum/src/painel/embutido.ts`, troque:

```ts
    aviso: (args) => {
      const a = (args ?? {}) as { texto?: unknown; acao?: unknown; ms?: unknown };
      if (!d.avisar) return false;
      const ms = Number(a.ms);
      return d.avisar(
        String(a.texto ?? "").slice(0, 400),
        a.acao ? String(a.acao).slice(0, 40) : undefined,
        Number.isFinite(ms) ? ms : 7000,
      );
    },
```

por:

```ts
    aviso: (args) => {
      const a = (args ?? {}) as { texto?: unknown; acao?: unknown; acoes?: unknown; ms?: unknown };
      const n = Number(a.ms);
      const ms = Number.isFinite(n) ? n : 7000;
      const texto = String(a.texto ?? "").slice(0, 400);
      const acoes = Array.isArray(a.acoes) ? a.acoes.slice(0, 3).map((x) => String(x).slice(0, 40)) : [];
      if (acoes.length > 1 && d.avisarAcoes) return d.avisarAcoes(texto, acoes, ms);
      if (!d.avisar) return false;
      return d.avisar(texto, a.acao ? String(a.acao).slice(0, 40) : undefined, ms);
    },
```

Em `sei-comum/src/painel/embutido.ts`, troque:

```ts
  tratadores: Record<string, Tratador>,
): { fechar(): void } {
```

por:

```ts
  tratadores: Record<string, Tratador>,
): { fechar(): void; rpc(): Rpc | null } {
```

Em `sei-comum/src/painel/embutido.ts`, troque:

```ts
      rpc?.fechar();
      m.fechar();
    },
  };
}
```

por:

```ts
      rpc?.fechar();
      m.fechar();
    },
    // A aba também chama o app (Projetos: a pílula de alerta do título pede o filtro).
    rpc: () => (rpc?.aberta ? rpc : null),
  };
}
```

Em `sei-comum/src/ui/dom.ts`, troque:

```ts
    ["path", { d: "M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8" }],
  ],
} satisfies Record<string, Forma[]>;
```

por:

```ts
    ["path", { d: "M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8" }],
  ],
  gantt: [
    ["path", { d: "M4 5h9M7 12h11M4 19h7" }],
    ["path", { d: "M3 3v18" }],
  ],
} satisfies Record<string, Forma[]>;
```

- [ ] **Step 5: Rodar as provas do sei-comum e dos pacotes que o usam**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && for p in sei-comum favoritos historico; do (cd $p && echo "$p: $(npx tsx tests/verificar.ts 2>&1 | tail -2 | head -1)" && npx tsc --noEmit); done
```
Expected: `sei-comum: 419 ok, 0 falha(s)` (+13), `favoritos: 578 ok, 0 falha(s)`, `historico: 485 ok, 0 falha(s)`; nenhum erro de `tsc`.

- [ ] **Step 6: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/sei-comum" && npx biome check src tests
```
Expected: sem erro (os 8 avisos que já existiam continuam; nenhum nos arquivos desta tarefa).

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  sei-comum/src/ponte/conexaoDaAba.ts \
  sei-comum/src/painel/embutido.ts \
  sei-comum/src/painel/aviso.ts \
  sei-comum/src/ui/aviso.ts \
  sei-comum/src/ui/dom.ts \
  sei-comum/tests/verificar-ponte-app.ts \
  sei-comum/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Comum: app atende a aba, porta do painel exposta, aviso com duas acoes e icone gantt

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 2: Projetos — base do app: ponte, preferências, formato, dados da unidade e chip "vence nesta semana"

**Files:**
- Create: `projetos/src/ponte/tipos.ts`, `projetos/src/app/sincronia.ts`, `projetos/src/app/preferencias.ts`, `projetos/src/app/formato.ts`, `projetos/src/app/dados.ts`
- Modify: `projetos/src/modelo/filtro.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-base.ts`

**Interfaces:**
- Consumes (P2): `RepositorioProjetos.dados() → Dados`, `resumoDoProjeto`, `alertasDasEtapas`, `porOrdem`, `MODELOS_EMBUTIDOS`, `FILTRO_VAZIO`, `ehEscala`, `chaveEscopo`, `CHAVE_PREFERENCIAS`; `tests/apoioRepositorio.ts` (`novoRepo`, `ESCOPO_UN`, `ESCOPO_EU`), `tests/fabrica.ts`.
- Produces: os tipos da ponte (seção "Interfaces exportadas"); `ProvedorSincronia`, `EstadoSincronia`, `TomSincronia`, `SEM_SINCRONIA`; `Preferencias`, `Vista`, `PREFERENCIAS_PADRAO`, `ESCALA_PADRAO`, `normalizarPreferencias(x)`, `lerPreferencias(area)`, `gravarPreferencias(area, parcial)`, `escalaDoProjeto(p, id)`, `chaveAberto(host, login, unidade)`; `dataLonga`, `dataCurta(iso)`, `plural(n, um, varios)`, `textoDiasUteis(n)`, `textoDoRegistro(r, tipo?)`, `quandoRelativo(ms, agora)`, `resumoDoUltimoRegistro(r, agora)`, `dataDeFormulario(v): DataISO | null`; `ProjetoNaTela`, `ModeloNaTela`, `DadosUnidade`, `etapasComFaseViva`, `montarUnidade`, `carregarUnidade`, `AlertasUnidade`, `alertasDaUnidade`; `ChipSituacao` ganha `"semana"` (e `contarChips` devolve `semana`).

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-base.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { alertasDaUnidade, carregarUnidade, etapasComFaseViva, montarUnidade } from "../src/app/dados";
import { dataCurta, plural, quandoRelativo, resumoDoUltimoRegistro, textoDiasUteis, textoDoRegistro } from "../src/app/formato";
import {
  chaveAberto,
  escalaDoProjeto,
  gravarPreferencias,
  lerPreferencias,
  normalizarPreferencias,
  PREFERENCIAS_PADRAO,
} from "../src/app/preferencias";
import { SEM_SINCRONIA } from "../src/app/sincronia";
import { CHAVE_PREFERENCIAS } from "../src/modelo/constantes";
import { contarChips, FILTRO_VAZIO, filtrarEtapas } from "../src/modelo/filtro";
import type { Registro } from "../src/modelo/tipos";
import { MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { etapa, fase, HOJE, projeto } from "./fabrica";
import { checar, secao } from "./util";

const registro = (m: Partial<Registro>): Registro => ({
  id: "r1",
  alvo: "e1",
  projeto: "p1",
  quando: new Date(2026, 9, 4, 10).getTime(),
  por: "carla",
  nome: "Carla Dias",
  campo: "fim",
  atualizadoEm: 1,
  dispositivo: "d",
  ...m,
});

export async function verificarAppBase(): Promise<void> {
  secao("app: preferencias (spec 5.4)");
  const padrao = normalizarPreferencias(undefined);
  checar(
    "padroes: lista ligada, mover dependentes, inicio, Mes no Todos, Gantt",
    padrao.mostrarLista &&
      padrao.moverDependentes &&
      padrao.ordemEtapas === "inicio" &&
      padrao.escalaTodos === "Mês" &&
      padrao.vista === "gantt",
  );
  const lixo = normalizarPreferencias({
    mostrarLista: "sim",
    ordemEtapas: "aleatoria",
    escalas: { p1: "Dia", p2: "Década", p3: 7 },
    escalaTodos: "Semana",
    vista: "kanban",
    recolhidas: ["f1", 3, "f2"],
    filtro: { situacoes: ["atrasadas", "nada"], soMinhas: true, responsaveis: "x", fases: ["f1"] },
  });
  checar(
    "valores estranhos voltam ao padrao, os bons ficam",
    lixo.mostrarLista === true &&
      lixo.ordemEtapas === "inicio" &&
      JSON.stringify(lixo.escalas) === '{"p1":"Dia"}' &&
      lixo.escalaTodos === "Semana" &&
      lixo.vista === "gantt" &&
      lixo.recolhidas.join() === "f1,f2",
    lixo,
  );
  checar(
    "filtro gravado e conferido campo a campo",
    lixo.filtro.situacoes.join() === "atrasadas" &&
      lixo.filtro.soMinhas &&
      lixo.filtro.responsaveis.length === 0 &&
      lixo.filtro.fases.join() === "f1",
  );
  checar("escala do projeto sem registro: Semana", escalaDoProjeto(lixo, "p9") === "Semana" && escalaDoProjeto(lixo, "p1") === "Dia");
  const area = areaMemoria();
  await gravarPreferencias(area, { mostrarLista: false });
  await gravarPreferencias(area, { recolhido: true });
  const lidas = await lerPreferencias(area);
  checar("gravar mescla com o que ja estava", !lidas.mostrarLista && lidas.recolhido && lidas.moverDependentes);
  const grande = Object.fromEntries(Array.from({ length: 260 }, (_, i) => [`p${i}`, "Dia"]));
  await area.gravar({ [CHAVE_PREFERENCIAS]: { ...PREFERENCIAS_PADRAO, escalas: grande } });
  checar("mapa de escalas tem teto (nao cresce para sempre)", Object.keys((await lerPreferencias(area)).escalas).length === 200);
  checar("chave do projeto aberto por unidade", chaveAberto("sei.x.gov.br", "Ana", "110") === "sei.x.gov.br|ana|u:110");

  secao("app: formato");
  checar("data curta", dataCurta("2026-10-06") === "06/10");
  checar("plural", plural(1, "atrasada", "atrasadas") === "1 atrasada" && plural(3, "atrasada", "atrasadas") === "3 atrasadas");
  checar("dias uteis", textoDiasUteis(1) === "1 dia útil" && textoDiasUteis(23) === "23 dias úteis");
  checar("registro de termino", textoDoRegistro(registro({ antes: "2026-09-25", depois: "2026-10-02" })) === "término 25/09 → 02/10");
  checar("registro de criacao da etapa", textoDoRegistro(registro({ campo: "criacao", depois: "AIR" }), "etapa") === "criou a etapa");
  checar(
    "registro de conclusao e de reabertura",
    textoDoRegistro(registro({ campo: "conclusao", depois: "2026-10-06" })) === "concluiu (06/10)" &&
      textoDoRegistro(registro({ campo: "conclusao", antes: "2026-10-06" })) === "reabriu",
  );
  checar("registro de progresso", textoDoRegistro(registro({ campo: "progresso", antes: "20", depois: "60" })) === "progresso 20% → 60%");
  const agora = new Date(2026, 9, 6, 15).getTime();
  checar(
    "quando relativo",
    quandoRelativo(new Date(2026, 9, 6, 8).getTime(), agora) === "hoje" &&
      quandoRelativo(new Date(2026, 9, 5, 23).getTime(), agora) === "ontem" &&
      quandoRelativo(new Date(2026, 9, 4).getTime(), agora) === "há 2 dias" &&
      quandoRelativo(new Date(2026, 6, 1).getTime(), agora) === "em 01/07/2026",
  );
  checar("resumo do ultimo registro (tela 2)", resumoDoUltimoRegistro(registro({}), agora) === "Carla Dias alterou o término há 2 dias");

  secao("app: dados da unidade (dois escopos)");
  const fases = [fase({ id: "f1", projeto: "p1" })];
  const etapas = [etapa({ id: "e1", fase: "f1" }), etapa({ id: "e2", fase: "morta" })];
  checar(
    "fase morta vira sem fase",
    etapasComFaseViva(etapas, fases)
      .map((e) => e.fase ?? "-")
      .join() === "f1,-",
  );
  const u = montarUnidade(
    [
      {
        vis: "unidade",
        dados: {
          projetos: [projeto({ id: "p1", ordem: "a1" }), projeto({ id: "arq", ordem: "a0", arquivadoEm: 5 })],
          fases,
          etapas: [...etapas, etapa({ id: "x", projeto: "arq" })],
          modelos: [],
        },
      },
      {
        vis: "eu",
        dados: {
          projetos: [projeto({ id: "p2", ordem: "a0" })],
          fases: [],
          etapas: [etapa({ id: "e3", projeto: "p2", inicio: "2026-09-01", fim: "2026-09-30" })],
          modelos: [{ id: "m1", nome: "Meu modelo", fases: [], etapas: [], criadoEm: 1, atualizadoEm: 1, dispositivo: "d" }],
        },
      },
    ],
    HOJE,
  );
  checar("abas na ordem manual, misturando os escopos", u.ativos.map((p) => `${p.projeto.id}:${p.vis}`).join() === "p2:eu,p1:unidade");
  checar("arquivado fica de fora das abas", u.arquivados.map((p) => p.projeto.id).join() === "arq");
  checar("cada projeto leva so as suas etapas", u.ativos[1]?.etapas.length === 2 && u.ativos[1]?.etapas[1]?.fase === undefined);
  checar("resumo calculado", u.ativos[0]?.resumo.atrasadas === 1 && u.ativos[0]?.resumo.total === 1);
  checar("modelos: os 3 embutidos e depois os salvos", u.modelos.length === MODELOS_EMBUTIDOS.length + 1 && u.modelos.at(-1)?.vis === "eu");
  const al = alertasDaUnidade(u.ativos, HOJE);
  checar(
    "alertas somam os projetos ativos",
    al.atrasadas === 1 && al.comAtraso.join() === "p2" && al.semana === 2 && al.comSemana.join() === "p1",
  );
  const area2 = areaMemoria();
  const { repo: un } = novoRepo(ESCOPO_UN, area2, "u");
  const { repo: eu } = novoRepo(ESCOPO_EU, area2, "e");
  const p = await un.criarProjeto({ nome: "Da unidade" });
  await eu.criarProjeto({ nome: "Meu" });
  await un.criarEtapa({ projeto: p.id, nome: "Etapa", inicio: "2026-10-05", fim: "2026-10-09" });
  const lida = await carregarUnidade({ unidade: un, eu }, HOJE);
  checar(
    "carregar le os dois escopos do repositorio",
    lida.ativos.length === 2 && lida.ativos.some((x) => x.vis === "eu" && x.projeto.nome === "Meu"),
  );

  secao("app: chip 'vence nesta semana' no filtro");
  const lista = [
    etapa({ id: "sem", inicio: "2026-10-01", fim: "2026-10-09" }),
    etapa({ id: "prox", inicio: "2026-10-20", fim: "2026-10-30" }),
    etapa({ id: "feita", inicio: "2026-10-01", fim: "2026-10-08", concluidaEm: "2026-10-05" }),
  ];
  const so = filtrarEtapas(lista, { ...FILTRO_VAZIO, situacoes: ["semana"] }, HOJE, { login: "ana" });
  checar("filtro 'semana' traz so o que vence ate sexta", so.map((e) => e.id).join() === "sem");
  checar("contagem do chip", contarChips(lista, HOJE).semana === 1);

  secao("app: sincronia (ponto de extensao do P4)");
  checar("sem provedor: 'neste navegador'", SEM_SINCRONIA.estado().rotulo === "neste navegador" && SEM_SINCRONIA.estado().tom === "local");
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppBase } from "./verificar-app-base";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: o processo para com `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dados'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/ponte/tipos.ts`:

```ts
/**
 * O que atravessa a ponte entre a aba do SEI (content script) e o app do
 * painel (página da extensão). Sem DOM e sem `@nucleo`: o app importa daqui
 * sem puxar o núcleo do SEI para o pacote dele.
 */

/** Nome da porta `chrome.runtime.connect` do painel embutido. */
export const CANAL_PROJETOS = "seipro-projetos";

export interface ContextoProjetos {
  host: string;
  /** Em minúsculas. */
  login: string;
  /** Nome do usuário lido do SEI (vai para o histórico de alterações). */
  nome: string;
  unidade: { id: string; sigla: string; nome: string } | null;
  versao: string;
  /** Modo noturno do SEI Pro (o painel embutido segue o SEI). */
  temaEscuro: boolean;
  /** Cor da barra do SEI (destaque do painel). */
  corTema?: string;
  /** Há servidor do Atividades configurado (o legado convive; a importação é do P4). */
  atividades: boolean;
}

/** Processo da caixa já carregada (combo do diálogo; nenhuma requisição). */
export interface ProcessoDaCaixa {
  protocolo: string;
  idProcedimento: string;
  tipo?: string;
  /** Vazio para processo sigiloso (regra do núcleo). */
  especificacao?: string;
  sigiloso: boolean;
}

/** Responsável sugerido (usuários da unidade). */
export interface UsuarioDaUnidade {
  login?: string;
  nome: string;
}

/** Conferência de um número SEI pela pesquisa rápida (sem abrir a árvore). */
export interface DocumentoConferido {
  numero: string;
  /** Protocolo do processo onde o documento está. */
  protocolo?: string;
}

/** Pílula de alerta do título do painel. */
export type TipoAlerta = "atrasadas" | "semana";
```

Arquivo completo `projetos/src/app/sincronia.ts`:

```ts
/**
 * Ponto de extensão da sincronia (P4). O app só mostra o estado ao lado das
 * abas e redesenha quando ele muda; quem sincroniza (Texto Padrão, arquivo) é
 * o provedor. No P3 não há provedor: os projetos ficam neste navegador.
 */

export type TomSincronia = "local" | "ok" | "pendente" | "erro";

export interface EstadoSincronia {
  /** Texto curto ao lado das abas ("sincronizado", "pendente", "erro"). */
  rotulo: string;
  /** Dica (title) com o detalhe. */
  dica: string;
  tom: TomSincronia;
}

export interface ProvedorSincronia {
  estado(): EstadoSincronia;
  /** Avisa quando o estado muda; devolve a função de parar. */
  aoMudar(cb: () => void): () => void;
}

export const SEM_SINCRONIA: ProvedorSincronia = {
  estado: () => ({
    rotulo: "neste navegador",
    dica: "Os projetos ficam guardados neste navegador.",
    tom: "local",
  }),
  aoMudar: () => () => undefined,
};
```

Arquivo completo `projetos/src/app/preferencias.ts`:

```ts
/**
 * Preferências locais do gestor de projetos (spec 5.4), numa chave só do
 * `chrome.storage.local` (`projetos/preferencias`). Valem para este navegador:
 * não vão ao Texto Padrão. Tudo que vem do armazenamento é conferido campo a
 * campo (versão antiga ou dado estranho volta ao padrão).
 */

import type { Area } from "@comum/armazenamento/area";
import { type Escala, ehEscala } from "../gantt/escalas";
import { CHAVE_PREFERENCIAS } from "../modelo/constantes";
import { chaveEscopo } from "../modelo/escopo";
import { type ChipSituacao, FILTRO_VAZIO, type FiltroEtapas } from "../modelo/filtro";
import type { OrdemEtapas } from "../modelo/operacoes";

export type Vista = "gantt" | "lista";

export interface Preferencias {
  /** Lista de etapas à esquerda do Gantt (menu ajustes). */
  mostrarLista: boolean;
  /** Arrastar uma etapa leva as que dependem dela. */
  moverDependentes: boolean;
  ordemEtapas: OrdemEtapas;
  /** Escala por projeto (id → escala); sem registro, "Semana". */
  escalas: Record<string, Escala>;
  /** Escala da aba "Todos". */
  escalaTodos: Escala;
  vista: Vista;
  /** Aba aberta por unidade (`chaveAberto`) → id do projeto ou "todos". */
  abertos: Record<string, string>;
  /** Fases recolhidas (ids). */
  recolhidas: string[];
  filtro: FiltroEtapas;
  /** Painel lateral (P5). */
  modoLateral: "agenda" | "projetos";
  soMinhas: boolean;
  /** Painel embutido recolhido. */
  recolhido: boolean;
}

export const ESCALA_PADRAO: Escala = "Semana";

export const PREFERENCIAS_PADRAO: Preferencias = {
  mostrarLista: true,
  moverDependentes: true,
  ordemEtapas: "inicio",
  escalas: {},
  escalaTodos: "Mês",
  vista: "gantt",
  abertos: {},
  recolhidas: [],
  filtro: FILTRO_VAZIO,
  modoLateral: "agenda",
  soMinhas: false,
  recolhido: false,
};

/** Mapas e listas não crescem para sempre (projeto excluído deixa a entrada para trás). */
const TETO_MAPA = 200;
const TETO_LISTA = 500;
const CHIPS: readonly ChipSituacao[] = ["atrasadas", "andamento", "semana", "proximos30"];

const textos = (x: unknown, teto = TETO_LISTA): string[] =>
  Array.isArray(x) ? x.filter((v): v is string => typeof v === "string").slice(-teto) : [];

function mapa<T>(x: unknown, valido: (v: unknown) => v is T): Record<string, T> {
  if (!x || typeof x !== "object" || Array.isArray(x)) return {};
  const pares = Object.entries(x as Record<string, unknown>).filter((p): p is [string, T] => valido(p[1]));
  return Object.fromEntries(pares.slice(-TETO_MAPA));
}

function filtroDe(x: unknown): FiltroEtapas {
  const f = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  return {
    situacoes: textos(f.situacoes).filter((s): s is ChipSituacao => (CHIPS as readonly string[]).includes(s)),
    soMinhas: f.soMinhas === true,
    mostrarConcluidas: f.mostrarConcluidas !== false,
    responsaveis: textos(f.responsaveis),
    fases: textos(f.fases),
    etiquetas: textos(f.etiquetas),
  };
}

export function normalizarPreferencias(x: unknown): Preferencias {
  const p = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  const d = PREFERENCIAS_PADRAO;
  const bool = (v: unknown, padrao: boolean) => (typeof v === "boolean" ? v : padrao);
  return {
    mostrarLista: bool(p.mostrarLista, d.mostrarLista),
    moverDependentes: bool(p.moverDependentes, d.moverDependentes),
    ordemEtapas: p.ordemEtapas === "nome" || p.ordemEtapas === "cadastro" ? p.ordemEtapas : "inicio",
    escalas: mapa(p.escalas, ehEscala),
    escalaTodos: ehEscala(p.escalaTodos) ? p.escalaTodos : d.escalaTodos,
    vista: p.vista === "lista" ? "lista" : "gantt",
    abertos: mapa(p.abertos, (v): v is string => typeof v === "string"),
    recolhidas: textos(p.recolhidas),
    filtro: filtroDe(p.filtro),
    modoLateral: p.modoLateral === "projetos" ? "projetos" : "agenda",
    soMinhas: bool(p.soMinhas, d.soMinhas),
    recolhido: bool(p.recolhido, d.recolhido),
  };
}

export async function lerPreferencias(area: Area): Promise<Preferencias> {
  return normalizarPreferencias((await area.obter(CHAVE_PREFERENCIAS))[CHAVE_PREFERENCIAS]);
}

/** Lê, mescla e grava (o content script grava `recolhido`; o app, o resto). */
export async function gravarPreferencias(area: Area, parcial: Partial<Preferencias>): Promise<Preferencias> {
  const nova = normalizarPreferencias({ ...(await lerPreferencias(area)), ...parcial });
  await area.gravar({ [CHAVE_PREFERENCIAS]: nova });
  return nova;
}

export function escalaDoProjeto(p: Preferencias, id: string): Escala {
  return p.escalas[id] ?? ESCALA_PADRAO;
}

/** A aba aberta é lembrada por unidade (o mesmo navegador serve mais de um SEI e de uma unidade). */
export function chaveAberto(host: string, login: string, unidade: string): string {
  return chaveEscopo({ host, login, unidade, vis: "unidade" }).replace(/\/un$/, "");
}
```

Arquivo completo `projetos/src/app/formato.ts`:

```ts
/** Textos curtos do painel: datas, plurais e as linhas do histórico de alterações. */

import { type DataISO, deISO, diferencaDias, formatarData, hojeISO } from "@comum/datas/dias";
import type { CampoHistorico, Registro } from "../modelo/tipos";

export { formatarData as dataLonga };

/** "06/10". */
export function dataCurta(iso: DataISO): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function plural(n: number, um: string, varios: string): string {
  return `${n} ${n === 1 ? um : varios}`;
}

export function textoDiasUteis(n: number): string {
  return n === 1 ? "1 dia útil" : `${n} dias úteis`;
}

const ROTULO: Partial<Record<CampoHistorico, string>> = {
  nome: "nome",
  inicio: "início",
  fim: "término",
  responsavel: "responsável",
  progresso: "progresso",
  fase: "fase",
  dependencias: "dependências",
  processo: "processo",
  documento: "documento",
  base: "plano original",
};

const COM_ARTIGO: Partial<Record<CampoHistorico, string>> = {
  nome: "o nome",
  inicio: "o início",
  fim: "o término",
  responsavel: "o responsável",
  progresso: "o progresso",
  fase: "a fase",
  dependencias: "as dependências",
  processo: "o processo",
  documento: "o documento",
  base: "o plano original",
  visibilidade: "quem vê",
};

const ehData = (s: string | undefined): boolean => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

function valor(campo: CampoHistorico, v: string | undefined): string {
  if (v === undefined || v === "") return "—";
  if (ehData(v)) return dataCurta(v);
  if (campo === "progresso") return `${v}%`;
  if (campo === "base") {
    const [a = "", b = ""] = v.split("/");
    return ehData(a) && ehData(b) ? `${dataCurta(a)} a ${dataCurta(b)}` : v;
  }
  return v;
}

/** "término 25/09 → 02/10" (tela 2). `tipo` muda só a criação ("criou a etapa"). */
export function textoDoRegistro(r: Pick<Registro, "campo" | "antes" | "depois">, tipo?: "etapa" | "projeto" | "fase"): string {
  switch (r.campo) {
    case "criacao":
      return tipo ? `criou ${tipo === "fase" ? "a fase" : tipo === "etapa" ? "a etapa" : "o projeto"}` : "criou";
    case "exclusao":
      return "excluiu";
    case "restauracao":
      return "restaurou";
    case "conclusao":
      return r.depois ? `concluiu (${valor("conclusao", r.depois)})` : "reabriu";
    case "arquivamento":
      return r.depois === "arquivado" ? "arquivou" : "reativou";
    case "visibilidade":
      return `quem vê: ${valor(r.campo, r.antes)} → ${valor(r.campo, r.depois)}`;
    default:
      return `${ROTULO[r.campo] ?? r.campo} ${valor(r.campo, r.antes)} → ${valor(r.campo, r.depois)}`;
  }
}

/** "hoje", "ontem", "há 3 dias" (até 30) ou "em 01/07/2026". */
export function quandoRelativo(ms: number, agora: number): string {
  const dias = diferencaDias(hojeISO(new Date(ms)), hojeISO(new Date(agora)));
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias <= 30) return `há ${dias} dias`;
  return `em ${formatarData(hojeISO(new Date(ms)))}`;
}

/** Resumo da seção Histórico do diálogo da etapa: "Carla Dias alterou o término há 2 dias". */
export function resumoDoUltimoRegistro(r: Registro, agora: number): string {
  const quem = r.nome || r.por || "Alguém";
  let feito: string;
  if (r.campo === "criacao") feito = "criou a etapa";
  else if (r.campo === "conclusao") feito = r.depois ? "concluiu" : "reabriu";
  else if (r.campo === "exclusao") feito = "excluiu";
  else if (r.campo === "restauracao") feito = "restaurou";
  else feito = `alterou ${COM_ARTIGO[r.campo] ?? r.campo}`;
  return `${quem} ${feito} ${quandoRelativo(r.quando, agora)}`;
}

/** Data de formulário válida e dentro do calendário de feriados (2000 a 2100), ou null. */
export function dataDeFormulario(v: string): DataISO | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const ano = Number(v.slice(0, 4));
  if (ano < 2000 || ano > 2100) return null;
  return hojeISO(deISO(v)) === v ? v : null;
}
```

Arquivo completo `projetos/src/app/dados.ts`:

```ts
/**
 * O que o painel mostra da unidade atual: os projetos dos dois escopos
 * ("Toda a unidade" e "Só eu") juntos, cada um com as suas fases e etapas, o
 * resumo e os alertas. Puro sobre `Dados` do repositório (o content script usa
 * o mesmo cálculo para as pílulas do título).
 */

import { alertasDasEtapas } from "../modelo/alertas";
import { porOrdem } from "../modelo/operacoes";
import { type ResumoProjeto, resumoDoProjeto } from "../modelo/resumo";
import type { DataISO, Etapa, Fase, Modelo, Projeto, Vis } from "../modelo/tipos";
import { MODELOS_EMBUTIDOS } from "../modelos/embutidos";
import type { Dados, RepositorioProjetos } from "../repositorio";

export interface ProjetoNaTela {
  projeto: Projeto;
  vis: Vis;
  fases: Fase[];
  etapas: Etapa[];
  resumo: ResumoProjeto;
}

export type ModeloNaTela = Modelo & { vis?: Vis };

export interface DadosUnidade {
  /** Projetos ativos, na ordem das abas. */
  ativos: ProjetoNaTela[];
  arquivados: ProjetoNaTela[];
  /** Embutidos primeiro; depois os salvos (com o escopo). */
  modelos: ModeloNaTela[];
}

/** Etapa viva com fase removida aparece "sem fase" (o id morto fica gravado; a tela não usa). */
export function etapasComFaseViva(etapas: readonly Etapa[], fases: readonly Fase[]): Etapa[] {
  const vivas = new Set(fases.map((f) => f.id));
  return etapas.map((e) => {
    if (!e.fase || vivas.has(e.fase)) return e;
    const { fase: _morta, ...resto } = e;
    return resto;
  });
}

export function montarUnidade(porVis: ReadonlyArray<{ vis: Vis; dados: Dados }>, hoje: DataISO): DadosUnidade {
  const todos: ProjetoNaTela[] = [];
  const modelos: ModeloNaTela[] = [...MODELOS_EMBUTIDOS];
  for (const { vis, dados } of porVis) {
    for (const projeto of dados.projetos) {
      const fases = dados.fases.filter((f) => f.projeto === projeto.id);
      const etapas = etapasComFaseViva(
        dados.etapas.filter((e) => e.projeto === projeto.id),
        fases,
      );
      todos.push({ projeto, vis, fases, etapas, resumo: resumoDoProjeto(etapas, hoje) });
    }
    modelos.push(...dados.modelos.map((m) => ({ ...m, vis })));
  }
  todos.sort((a, b) => porOrdem(a.projeto, b.projeto));
  return {
    ativos: todos.filter((p) => p.projeto.arquivadoEm === undefined),
    arquivados: todos.filter((p) => p.projeto.arquivadoEm !== undefined),
    modelos,
  };
}

export async function carregarUnidade(repos: Readonly<Record<Vis, RepositorioProjetos>>, hoje: DataISO): Promise<DadosUnidade> {
  const [un, eu] = await Promise.all([repos.unidade.dados(), repos.eu.dados()]);
  return montarUnidade(
    [
      { vis: "unidade", dados: un },
      { vis: "eu", dados: eu },
    ],
    hoje,
  );
}

export interface AlertasUnidade {
  atrasadas: number;
  semana: number;
  /** Ids dos projetos com etapa atrasada (a pílula abre o projeto se for só um). */
  comAtraso: string[];
  comSemana: string[];
}

export function alertasDaUnidade(ativos: ReadonlyArray<Pick<ProjetoNaTela, "projeto" | "etapas">>, hoje: DataISO): AlertasUnidade {
  const saida: AlertasUnidade = { atrasadas: 0, semana: 0, comAtraso: [], comSemana: [] };
  for (const { projeto, etapas } of ativos) {
    if (projeto.arquivadoEm !== undefined) continue;
    const a = alertasDasEtapas(etapas, hoje);
    saida.atrasadas += a.atrasadas.length;
    saida.semana += a.semana.length;
    if (a.atrasadas.length) saida.comAtraso.push(projeto.id);
    if (a.semana.length) saida.comSemana.push(projeto.id);
  }
  return saida;
}
```

Em `projetos/src/modelo/filtro.ts`, troque:

```ts
 * Filtro das etapas (spec 3.1, como nos Favoritos): os chips de situação valem
 * qualquer um (Atrasadas ou Em andamento ou Próximos 30 dias); "Só as minhas"
```

por:

```ts
 * Filtro das etapas (spec 3.1, como nos Favoritos): os chips de situação valem
 * qualquer um (Atrasadas ou Em andamento ou Vence nesta semana ou Próximos 30
 * dias; "semana" é o filtro da pílula do título do painel); "Só as minhas"
```

Em `projetos/src/modelo/filtro.ts`, troque:

```ts
export type ChipSituacao = "atrasadas" | "andamento" | "proximos30";
```

por:

```ts
export type ChipSituacao = "atrasadas" | "andamento" | "semana" | "proximos30";
```

Em `projetos/src/modelo/filtro.ts`, troque:

```ts
    andamento: new Set(vivas.filter((e) => situacaoEtapa(e, hoje) === "andamento").map((e) => e.id)),
    proximos30: new Set(alertas.proximos30.map((e) => e.id)),
```

por:

```ts
    andamento: new Set(vivas.filter((e) => situacaoEtapa(e, hoje) === "andamento").map((e) => e.id)),
    semana: new Set(alertas.semana.map((e) => e.id)),
    proximos30: new Set(alertas.proximos30.map((e) => e.id)),
```

Em `projetos/src/modelo/filtro.ts`, troque:

```ts
    andamento: vivas.filter((e) => situacaoEtapa(e, hoje) === "andamento").length,
    proximos30: alertas.proximos30.length,
```

por:

```ts
    andamento: vivas.filter((e) => situacaoEtapa(e, hoje) === "andamento").length,
    semana: alertas.semana.length,
    proximos30: alertas.proximos30.length,
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `420 ok, 0 falha(s)` (+27 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/ponte/tipos.ts \
  projetos/src/app/sincronia.ts \
  projetos/src/app/preferencias.ts \
  projetos/src/app/formato.ts \
  projetos/src/app/dados.ts \
  projetos/src/modelo/filtro.ts \
  projetos/tests/verificar-app-base.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: base do app (ponte, preferencias, formato, dados da unidade, chip semana)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 3: Projetos — ícones, abas, menu ajustes e primeiro uso

**Files:**
- Create: `projetos/src/app/icones.ts`, `projetos/src/app/componentes/abas.ts`, `projetos/src/app/componentes/menuAjustes.ts`, `projetos/src/app/componentes/vazio.ts`
- Create (apoio às provas): `projetos/tests/apoioApp.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-abas.ts`

**Interfaces:**
- Consumes: `ProjetoNaTela` (T2), `EstadoSincronia`/`SEM_SINCRONIA` (T2), `rotuloDaVis`, `SituacaoEtapa`, `OrdemEtapas` (P2); `h`, `icone` (com `"gantt"`, T1), `criarMenu`, `EntradaMenu` (sei-comum).
- Produces: `NomeIconeProjetos = "modelo" | "checklist" | "progresso"`, `iconeProjetos(nome, tamanho?)`, `iconeSituacao(situacao, marco)` (classes `prj-st prj-st-<situacao>[ prj-st-marco]`); `OpcoesAbas`, `limiteDeAbas(largura)`, `indicadorDeSincronia(estado)`, `montarAbas(o)` (botões `role="tab"` com `data-aba`, menu "Mais N projetos"); `ExtensoesMenu`, `OpcoesMenuAjustes`, `criarMenuAjustes(estado)` (rótulo "Ajustes dos projetos"); `OpcoesVazio`, `montarVazio(o)`. Nas provas: `telaDoApp`, `tecla`, `texto`, `itensDoMenu`, `itemDoMenu`, `combo`, `opcoesDoCombo`, `escolherCombo`, `criarNoCombo`, `digitar`, `marcar`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/apoioApp.ts`:

```ts
/**
 * Utilitários das provas da interface (linkedom): menus, seletores, teclas e
 * o `<dialog>` que o linkedom não tem. Mesma forma dos utilitários do
 * Favoritos e do Histórico, sem importar o núcleo do SEI.
 */

import { instalarDom } from "./util";

type Proto = Record<string, unknown>;

/** Documento novo como `document` global, com `<dialog>` funcionando (showModal/close/open). */
export function telaDoApp(html = '<html><body><div id="app"></div></body></html>'): Document {
  const doc = instalarDom(html);
  const proto = Object.getPrototypeOf(doc.createElement("dialog")) as Proto;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  proto.showModal = function (this: HTMLElement) {
    this.setAttribute("open", "");
  };
  proto.close = function (this: HTMLElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Ev("close"));
  };
  Object.defineProperty(proto, "open", {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute("open");
    },
  });
  return doc;
}

/** Tecla do linkedom (o KeyboardEvent do Node não serve aos elementos dele). */
export function tecla(el: Element, key: string): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "key", { value: key });
  el.dispatchEvent(ev);
}

/** Texto visível de um elemento, sem espaços repetidos. */
export const texto = (el: Element | null | undefined): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** Itens do menu aberto pelo botão de rótulo `menu` (abre e fecha). */
export function itensDoMenu(raiz: ParentNode, menu: string): string[] {
  const b = raiz.querySelector<HTMLButtonElement>(`button[aria-haspopup="menu"][aria-label="${menu}"]`);
  if (!b) return [];
  b.click();
  const itens = [...b.ownerDocument.querySelectorAll(".spro-menu-pop [role='menuitem']")].map((i) =>
    texto(i.querySelector(".spro-menu-rotulo")),
  );
  b.click();
  return itens;
}

/** Abre o menu pelo rótulo do botão e clica o item pelo texto. */
export function itemDoMenu(raiz: ParentNode, menu: string, item: string): boolean {
  const b = raiz.querySelector<HTMLButtonElement>(`button[aria-haspopup="menu"][aria-label="${menu}"]`);
  if (!b) return false;
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const alvo = [...b.ownerDocument.querySelectorAll<HTMLButtonElement>(".spro-menu-pop [role='menuitem']")].find(
    (i) => texto(i.querySelector(".spro-menu-rotulo")) === item,
  );
  if (!alvo) {
    b.click();
    return false;
  }
  alvo.click();
  return true;
}

/** O seletor inteligente (combobox) pelo rótulo. */
export function combo(raiz: ParentNode, rotulo: string): HTMLButtonElement | null {
  return raiz.querySelector<HTMLButtonElement>(`button[role="combobox"][aria-label="${rotulo}"]`);
}

/** Opções que o seletor oferece agora (abre e fecha). */
export function opcoesDoCombo(raiz: ParentNode, rotulo: string): string[] {
  const b = combo(raiz, rotulo);
  if (!b) return [];
  b.click();
  const valores = [...b.ownerDocument.querySelectorAll(".spro-combo-pop [role='option']")].map((o) => o.getAttribute("data-valor") ?? "");
  b.click();
  return valores;
}

/** Escolhe uma opção do seletor: abre, clica e, na escolha múltipla, fecha de novo. */
export function escolherCombo(raiz: ParentNode, rotulo: string, valor: string): void {
  const b = combo(raiz, rotulo);
  if (!b) throw new Error(`seletor "${rotulo}" não encontrado`);
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const op = b.ownerDocument.querySelector<HTMLElement>(`.spro-combo-pop [role="option"][data-valor="${escaparValor(valor)}"]`);
  if (!op) throw new Error(`opção "${valor}" não encontrada em "${rotulo}"`);
  op.click();
  if (b.getAttribute("aria-expanded") === "true") b.click();
}

/** Digita no campo de busca do seletor aberto e clica "Criar “…”". */
export async function criarNoCombo(raiz: ParentNode, rotulo: string, valor: string): Promise<void> {
  const b = combo(raiz, rotulo);
  if (!b) throw new Error(`seletor "${rotulo}" não encontrado`);
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const doc = b.ownerDocument;
  const busca = doc.querySelector<HTMLInputElement>(".spro-combo-pop .spro-combo-busca");
  if (!busca) throw new Error(`seletor "${rotulo}" sem busca`);
  busca.value = valor;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  busca.dispatchEvent(new Ev("input", { bubbles: true }));
  const criar = doc.querySelector<HTMLButtonElement>(".spro-combo-pop .spro-combo-criar");
  if (!criar) throw new Error(`seletor "${rotulo}" sem "Criar"`);
  criar.click();
  await new Promise((r) => setTimeout(r, 5));
  if (b.getAttribute("aria-expanded") === "true") b.click();
}

/** Valor como aparece no seletor de atributo (aspas e barras escapadas). */
function escaparValor(v: string): string {
  return v.replace(/["\\]/g, "\\$&");
}

/** Muda o valor de um campo e avisa como o navegador ("input" e "change"). */
export function digitar(el: Element | null | undefined, valor: string): void {
  if (!el) throw new Error("campo não encontrado");
  (el as HTMLInputElement).value = valor;
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  el.dispatchEvent(new Ev("input", { bubbles: true }));
  el.dispatchEvent(new Ev("change", { bubbles: true }));
}

/** Marca uma caixa ou rádio como o navegador faz (o linkedom não reflete o atributo). */
export function marcar(el: Element | null | undefined, ligado = true): void {
  if (!el) throw new Error("campo não encontrado");
  (el as HTMLInputElement).checked = ligado;
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  el.dispatchEvent(new Ev("change", { bubbles: true }));
}
```

Arquivo completo `projetos/tests/verificar-app-abas.ts`:

```ts
import { limiteDeAbas, montarAbas } from "../src/app/componentes/abas";
import { criarMenuAjustes, type OpcoesMenuAjustes } from "../src/app/componentes/menuAjustes";
import { montarVazio } from "../src/app/componentes/vazio";
import type { ProjetoNaTela } from "../src/app/dados";
import { iconeProjetos, iconeSituacao } from "../src/app/icones";
import { SEM_SINCRONIA } from "../src/app/sincronia";
import { resumoDoProjeto } from "../src/modelo/resumo";
import type { Vis } from "../src/modelo/tipos";
import { itemDoMenu, itensDoMenu, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { etapa, HOJE, projeto } from "./fabrica";
import { botao, checar, secao } from "./util";

const naTela = (id: string, vis: Vis, nome = `Projeto ${id}`, etapas = [etapa({ id: `${id}-e`, projeto: id })]): ProjetoNaTela => ({
  projeto: projeto({ id, nome }),
  vis,
  fases: [],
  etapas,
  resumo: resumoDoProjeto(etapas, HOJE),
});

export async function verificarAppAbas(): Promise<void> {
  secao("app: icones");
  telaDoApp();
  const g = iconeProjetos("modelo", 20);
  checar(
    "icone do modelo em SVG, do tamanho pedido",
    g.tagName.toLowerCase() === "svg" && g.getAttribute("width") === "20" && !!g.querySelector("rect"),
  );
  const st = (s: Parameters<typeof iconeSituacao>[0], m = false) => iconeSituacao(s, m).getAttribute("class") ?? "";
  checar(
    "situacao da etapa pela classe (cor no CSS)",
    st("concluida").includes("prj-st-concluida") && st("atrasada").includes("prj-st-atrasada") && st("futura").includes("prj-st-futura"),
  );
  checar("marco e losango", !!iconeSituacao("andamento", true).querySelector("path") && st("andamento", true).includes("prj-st-marco"));

  secao("app: abas dos projetos");
  const doc = telaDoApp();
  const atrasado = naTela("p1", "unidade", HOSTIL, [etapa({ id: "a", projeto: "p1", inicio: "2026-09-01", fim: "2026-09-30" })]);
  const ativos = [atrasado, naTela("p2", "eu", "Plano 2027"), naTela("p3", "unidade"), naTela("p4", "unidade"), naTela("p5", "eu")];
  const escolhidos: string[] = [];
  let novos = 0;
  const menu = doc.createElement("button");
  const abas = montarAbas({
    ativos,
    aberto: "p5",
    limite: 3,
    sincronia: SEM_SINCRONIA.estado(),
    menu,
    aoEscolher: (id) => escolhidos.push(id),
    aoNovo: () => {
      novos += 1;
    },
  });
  doc.getElementById("app")!.append(abas);
  const tabs = [...abas.querySelectorAll<HTMLButtonElement>("[role='tab']")];
  checar("Todos e 3 projetos visiveis", tabs.length === 4 && texto(tabs[0]).startsWith("Todos") && texto(tabs[0]).endsWith("5"));
  checar(
    "o projeto aberto fica visivel mesmo alem do limite",
    tabs.at(-1)?.getAttribute("data-aba") === "p5" && tabs.at(-1)?.getAttribute("aria-selected") === "true",
  );
  checar(
    "nome hostil como texto, com ponto vermelho de atraso e percentual",
    texto(tabs[1]).includes(HOSTIL) &&
      !abas.querySelector("img") &&
      !!tabs[1]?.querySelector(".prj-aba-alerta") &&
      /\d+%$/.test(texto(tabs[1])),
  );
  checar(
    "icone do escopo: predio ou pessoa",
    tabs[1]?.title.endsWith("Toda a unidade") === true && tabs[3]?.title.endsWith("Só eu") === true,
  );
  checar("excesso no 'Mais N'", itensDoMenu(abas, "Mais 2 projetos").join() === "Projeto p3,Projeto p4");
  itemDoMenu(abas, "Mais 2 projetos", "Projeto p4");
  tabs[0]!.click();
  checar("escolher pelo 'Mais' e pela aba", escolhidos.join() === "p4,todos");
  botao(abas, "Novo projeto")!.click();
  checar("+ Novo projeto", novos === 1);
  checar(
    "estado da sincronia com dica",
    texto(abas.querySelector(".prj-sinc")) === "neste navegador" && !!abas.querySelector(".prj-sinc")?.getAttribute("title"),
  );
  checar("limite de abas pela largura (sem medida: 3)", limiteDeAbas(0) === 3 && limiteDeAbas(1200) === 4 && limiteDeAbas(300) === 1);

  secao("app: menu ajustes");
  const docM = telaDoApp();
  const feitos: string[] = [];
  const op: OpcoesMenuAjustes = {
    mostrarLista: true,
    moverDependentes: false,
    ordemEtapas: "nome",
    arquivados: 2,
    aoMostrarLista: (v) => feitos.push(`lista:${v}`),
    aoMoverDependentes: (v) => feitos.push(`mover:${v}`),
    aoOrdenar: (o) => feitos.push(`ordem:${o}`),
    aoExportar: () => feitos.push("csv"),
    aoImprimir: () => feitos.push("pdf"),
    aoArquivados: () => feitos.push("arq"),
  };
  const bm = criarMenuAjustes(() => op);
  docM.getElementById("app")!.append(bm);
  const itens = itensDoMenu(docM, "Ajustes dos projetos");
  checar(
    "itens do P3 na ordem da spec",
    itens.join("|") ===
      "Projetos arquivados|Mostrar lista de etapas|Mover dependentes ao arrastar|Ordenar por início|Ordenar por nome|Ordenar por cadastro|Exportar planilha (CSV)|Imprimir / salvar PDF",
    itens,
  );
  bm.click();
  const marcados = [...docM.querySelectorAll(".spro-menu-pop [role='menuitem']")]
    .filter((i) => i.querySelector(".spro-menu-icone svg"))
    .map((i) => texto(i));
  bm.click();
  checar(
    "marcaveis com o estado atual",
    marcados.includes("Mostrar lista de etapas") &&
      !marcados.includes("Mover dependentes ao arrastar") &&
      marcados.includes("Ordenar por nome"),
  );
  itemDoMenu(docM, "Ajustes dos projetos", "Mostrar lista de etapas");
  itemDoMenu(docM, "Ajustes dos projetos", "Mover dependentes ao arrastar");
  itemDoMenu(docM, "Ajustes dos projetos", "Ordenar por cadastro");
  itemDoMenu(docM, "Ajustes dos projetos", "Exportar planilha (CSV)");
  itemDoMenu(docM, "Ajustes dos projetos", "Imprimir / salvar PDF");
  itemDoMenu(docM, "Ajustes dos projetos", "Projetos arquivados");
  checar("cada item faz o seu", feitos.join() === "lista:false,mover:true,ordem:cadastro,csv,pdf,arq", feitos);
  const comExt = criarMenuAjustes(() => ({
    ...op,
    arquivados: 0,
    extensoes: {
      sincronia: () => [{ rotulo: "Sincronização…", fazer: () => undefined }],
      arquivo: () => [{ rotulo: "Enviar projeto por arquivo…", fazer: () => undefined }],
      fim: () => [{ rotulo: "Histórico de alterações", fazer: () => undefined }],
    },
  }));
  docM.getElementById("app")!.append(comExt);
  comExt.click();
  const rotulosExt = [...docM.querySelectorAll(".spro-menu-pop [role='menuitem']")].map((i) => texto(i.querySelector(".spro-menu-rotulo")));
  comExt.click();
  checar("sem arquivados, o item some", !rotulosExt.includes("Projetos arquivados"));
  checar(
    "extensoes do P4 entram no lugar delas",
    rotulosExt[0] === "Sincronização…" &&
      rotulosExt.at(-2) === "Enviar projeto por arquivo…" &&
      rotulosExt.at(-1) === "Histórico de alterações",
    rotulosExt,
  );

  secao("app: primeiro uso (vazio)");
  const docV = telaDoApp();
  const acoes: string[] = [];
  const vazio = montarVazio({ aoCriar: () => acoes.push("criar"), aoModelo: () => acoes.push("modelo") });
  docV.getElementById("app")!.append(vazio);
  checar(
    "titulo e texto da tela 2",
    texto(vazio.querySelector("h3")) === "Acompanhe um trabalho do começo ao fim" && texto(vazio).includes("plano anual"),
  );
  botao(vazio, "Criar projeto")!.click();
  botao(vazio, "Começar de um modelo")!.click();
  checar("criar e comecar de um modelo", acoes.join() === "criar,modelo");
  checar("sem servidor do Atividades (ou sem importacao), sem o link", !vazio.querySelector("a"));
  const comImportar = montarVazio({ aoCriar: () => undefined, aoModelo: () => undefined, aoImportar: () => acoes.push("importar") });
  (comImportar.querySelector("a") as HTMLAnchorElement).click();
  checar(
    "com importacao (P4), o link aparece e chama",
    acoes.at(-1) === "importar" && texto(comImportar.querySelector("a")) === "Importar meus projetos do servidor do Atividades",
  );
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBase } from "./verificar-app-base";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/componentes/…'` (o primeiro componente que falta).

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/icones.ts`:

```ts
/**
 * Ícones próprios do gestor de projetos (os comuns, inclusive o "gantt", vêm de
 * `@comum/ui/dom`): o modelo, o checklist e o progresso, e os ícones de
 * situação da etapa (tela 1). Tudo por `createElementNS`; as cores
 * de situação ficam no CSS (`.prj-st-*`), para valerem nos dois temas.
 */

import type { SituacaoEtapa } from "../modelo/situacao";

const NS = "http://www.w3.org/2000/svg";
type Forma = [string, Record<string, string>];

const FORMAS = {
  modelo: [
    ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }],
    ["path", { d: "M4 9.5h16M9.5 9.5V20" }],
  ],
  checklist: [["path", { d: "m4 7 2 2 3.5-3.5M4 15l2 2 3.5-3.5M13 8h7M13 16h7" }]],
  progresso: [
    ["path", { d: "M4 12a8 8 0 1 0 8-8" }],
    ["path", { d: "M12 4v8l5 3" }],
  ],
} satisfies Record<string, Forma[]>;

export type NomeIconeProjetos = keyof typeof FORMAS;

function svg(tamanho: number, caixa: string, attrs: Record<string, string>): SVGSVGElement {
  const el = document.createElementNS(NS, "svg");
  const base: Record<string, string> = {
    viewBox: caixa,
    width: String(tamanho),
    height: String(tamanho),
    "aria-hidden": "true",
    focusable: "false",
    ...attrs,
  };
  for (const [k, v] of Object.entries(base)) el.setAttribute(k, v);
  return el;
}

function forma(tag: string, attrs: Record<string, string>): SVGElement {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

export function iconeProjetos(nome: NomeIconeProjetos, tamanho = 18): SVGSVGElement {
  const el = svg(tamanho, "0 0 24 24", {
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "spro-icone",
  });
  for (const [tag, attrs] of FORMAS[nome] as Forma[]) el.append(forma(tag, attrs));
  return el;
}

/** Ícone de situação da linha da etapa (16 px): círculo cheio, metade, tracejado; losango no marco. */
export function iconeSituacao(situacao: SituacaoEtapa, marco: boolean): SVGSVGElement {
  const el = svg(16, "0 0 16 16", { class: `prj-st prj-st-${situacao}${marco ? " prj-st-marco" : ""}` });
  if (marco) {
    el.append(forma("path", { class: "prj-st-cor", d: situacao === "concluida" ? "M8 1.5 14.5 8 8 14.5 1.5 8z" : "M8 2 14 8 8 14 2 8z" }));
    return el;
  }
  if (situacao === "concluida") {
    el.append(
      forma("circle", { class: "prj-st-cor", cx: "8", cy: "8", r: "7" }),
      forma("path", { class: "prj-st-sinal", d: "m4.8 8.2 2.1 2.1 4.3-4.4" }),
    );
  } else if (situacao === "atrasada") {
    el.append(
      forma("circle", { class: "prj-st-cor", cx: "8", cy: "8", r: "7" }),
      forma("path", { class: "prj-st-sinal", d: "M8 4.2v4.6" }),
      forma("circle", { class: "prj-st-ponto", cx: "8", cy: "11.4", r: "1" }),
    );
  } else if (situacao === "andamento") {
    el.append(
      forma("circle", { class: "prj-st-cor", cx: "8", cy: "8", r: "6.2" }),
      forma("path", { class: "prj-st-meio", d: "M8 1.8a6.2 6.2 0 0 1 0 12.4z" }),
    );
  } else {
    el.append(forma("circle", { class: "prj-st-cor", cx: "8", cy: "8", r: "6.2" }));
  }
  return el;
}
```

Arquivo completo `projetos/src/app/componentes/abas.ts`:

```ts
/**
 * Linha das abas (tela 1): "Todos (N)" e uma aba por projeto ativo (prédio =
 * toda a unidade, pessoa = só eu; ponto vermelho com etapa atrasada;
 * percentual). O excesso vai para "Mais N ▾". À direita: "+ Novo projeto",
 * o estado da sincronia e o botão de ajustes.
 */

import { h, icone } from "@comum/ui/dom";
import { criarMenu } from "@comum/ui/menu";
import { rotuloDaVis } from "../../modelo/escopo";
import type { ProjetoNaTela } from "../dados";
import type { EstadoSincronia } from "../sincronia";

export interface OpcoesAbas {
  ativos: readonly ProjetoNaTela[];
  /** "todos" ou o id do projeto aberto. */
  aberto: string;
  /** Quantas abas de projeto cabem (`limiteDeAbas`). */
  limite: number;
  sincronia: EstadoSincronia;
  /** Botão do menu de ajustes (montado pelo app). */
  menu: HTMLElement;
  aoEscolher(id: string): void;
  aoNovo(): void;
}

/** Quantas abas de projeto cabem na largura (sem medida, como nos testes: 3). */
export function limiteDeAbas(largura: number): number {
  if (!largura) return 3;
  return Math.max(1, Math.floor((largura - 400) / 190));
}

/** As abas visíveis: as primeiras `limite`, com a aberta sempre entre elas (no lugar da última). */
function visiveis(ativos: readonly ProjetoNaTela[], aberto: string, limite: number): ProjetoNaTela[] {
  const primeiras = ativos.slice(0, limite);
  if (aberto === "todos" || primeiras.some((p) => p.projeto.id === aberto)) return primeiras;
  const escolhida = ativos.find((p) => p.projeto.id === aberto);
  return escolhida ? [...primeiras.slice(0, -1), escolhida] : primeiras;
}

function aba(p: ProjetoNaTela, selecionada: boolean, aoEscolher: (id: string) => void): HTMLButtonElement {
  return h(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": String(selecionada),
      "data-aba": p.projeto.id,
      title: `${p.projeto.nome} · ${rotuloDaVis(p.vis)}`,
      onclick: () => aoEscolher(p.projeto.id),
    },
    icone(p.vis === "unidade" ? "predio" : "pessoa", 15),
    h("span", { class: "prj-aba-nome" }, p.projeto.nome),
    p.resumo.atrasadas ? h("span", { class: "prj-aba-alerta", title: "Tem etapa atrasada" }) : null,
    h("span", { class: "prj-aba-prog" }, `${p.resumo.progresso}%`),
  );
}

/** "sincronizado", "pendente", "erro" ou "neste navegador", com a dica (title). */
export function indicadorDeSincronia(e: EstadoSincronia): HTMLElement {
  return h("span", { class: `prj-sinc prj-sinc-${e.tom}`, title: e.dica }, icone("nuvem", 15), e.rotulo);
}

export function montarAbas(o: OpcoesAbas): HTMLElement {
  const mostradas = visiveis(o.ativos, o.aberto, o.limite);
  const ids = new Set(mostradas.map((p) => p.projeto.id));
  const resto = o.ativos.filter((p) => !ids.has(p.projeto.id));
  const lista = h(
    "div",
    { class: "spro-segmentado prj-abas-lista", role: "tablist", "aria-label": "Projetos" },
    h(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": String(o.aberto === "todos"),
        "data-aba": "todos",
        title: "Todos os projetos (portfólio)",
        onclick: () => o.aoEscolher("todos"),
      },
      icone("camadas", 15),
      "Todos",
      h("span", { class: "prj-aba-prog" }, String(o.ativos.length)),
    ),
    ...mostradas.map((p) => aba(p, p.projeto.id === o.aberto, o.aoEscolher)),
  );
  if (resto.length)
    lista.append(
      criarMenu({
        rotulo: `Mais ${resto.length} ${resto.length === 1 ? "projeto" : "projetos"}`,
        icone: "chevron",
        texto: `Mais ${resto.length}`,
        classe: "prj-aba-mais",
        largura: 280,
        itens: () =>
          resto.map((p) => ({
            rotulo: p.projeto.nome,
            icone: p.vis === "unidade" ? "predio" : "pessoa",
            dica: `${p.resumo.progresso}%`,
            fazer: () => o.aoEscolher(p.projeto.id),
          })),
      }),
    );
  return h(
    "div",
    { class: "prj-abas" },
    lista,
    h(
      "button",
      { type: "button", class: "spro-botao fantasma prj-novo", title: "Novo projeto", onclick: o.aoNovo },
      icone("mais", 15),
      "Novo projeto",
    ),
    h("div", { class: "prj-abas-dir" }, indicadorDeSincronia(o.sincronia), o.menu),
  );
}
```

Arquivo completo `projetos/src/app/componentes/menuAjustes.ts`:

```ts
/**
 * Menu geral do painel (botão "ajustes", tela 1). Os itens são montados a cada
 * abertura, com o estado do momento. O que depende do P4 (Sincronização,
 * Modelos, Enviar/Receber, Importar do Atividades, Histórico de alterações)
 * entra pelas extensões; sem elas, não aparece (nada de item desligado).
 */

import { criarMenu, type EntradaMenu } from "@comum/ui/menu";
import type { OrdemEtapas } from "../../modelo/operacoes";

export interface ExtensoesMenu {
  /** No começo: "Sincronização…", "Modelos de projeto…". */
  sincronia?: () => EntradaMenu[];
  /** Depois de Exportar/Imprimir: enviar, receber, importar. */
  arquivo?: () => EntradaMenu[];
  /** No fim: "Histórico de alterações". */
  fim?: () => EntradaMenu[];
}

export interface OpcoesMenuAjustes {
  mostrarLista: boolean;
  moverDependentes: boolean;
  ordemEtapas: OrdemEtapas;
  arquivados: number;
  extensoes?: ExtensoesMenu;
  aoMostrarLista(v: boolean): void;
  aoMoverDependentes(v: boolean): void;
  aoOrdenar(o: OrdemEtapas): void;
  aoExportar(): void;
  aoImprimir(): void;
  aoArquivados(): void;
}

const ORDENS: ReadonlyArray<[OrdemEtapas, string]> = [
  ["inicio", "Ordenar por início"],
  ["nome", "Ordenar por nome"],
  ["cadastro", "Ordenar por cadastro"],
];

export function criarMenuAjustes(estado: () => OpcoesMenuAjustes): HTMLButtonElement {
  return criarMenu({
    rotulo: "Ajustes dos projetos",
    icone: "ajustes",
    largura: 270,
    itens: () => {
      const o = estado();
      const ext = o.extensoes ?? {};
      return [
        ...(ext.sincronia?.() ?? []),
        o.arquivados > 0 ? { rotulo: "Projetos arquivados", icone: "pasta", dica: String(o.arquivados), fazer: o.aoArquivados } : null,
        "-",
        {
          rotulo: "Mostrar lista de etapas",
          icone: o.mostrarLista ? "check" : undefined,
          fazer: () => o.aoMostrarLista(!o.mostrarLista),
        },
        {
          rotulo: "Mover dependentes ao arrastar",
          icone: o.moverDependentes ? "check" : undefined,
          fazer: () => o.aoMoverDependentes(!o.moverDependentes),
        },
        ...ORDENS.map(([valor, rotulo]) => ({
          rotulo,
          icone: o.ordemEtapas === valor ? ("check" as const) : undefined,
          fazer: () => o.aoOrdenar(valor),
        })),
        "-",
        { rotulo: "Exportar planilha (CSV)", icone: "planilha", fazer: o.aoExportar },
        { rotulo: "Imprimir / salvar PDF", icone: "documento", fazer: o.aoImprimir },
        ...(ext.arquivo?.() ?? []),
        "-",
        ...(ext.fim?.() ?? []),
      ];
    },
  });
}
```

Arquivo completo `projetos/src/app/componentes/vazio.ts`:

```ts
/** Primeiro uso (tela 2, cena 4): nenhum projeto ativo na unidade. */

import { h, icone } from "@comum/ui/dom";
import { iconeProjetos } from "../icones";

export interface OpcoesVazio {
  aoCriar(): void;
  aoModelo(): void;
  /** Só com servidor do Atividades configurado e a importação do P4. */
  aoImportar?: () => void;
}

const NS = "http://www.w3.org/2000/svg";

function desenho(): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({ width: "132", height: "70", viewBox: "0 0 132 70", fill: "none", "aria-hidden": "true" }))
    svg.setAttribute(k, v);
  const pecas: Array<[string, Record<string, string>]> = [
    ["rect", { class: "prj-vazio-ok", x: "4", y: "6", width: "48", height: "10", rx: "5" }],
    ["rect", { class: "prj-vazio-andamento", x: "40", y: "24", width: "56", height: "10", rx: "5" }],
    ["rect", { class: "prj-vazio-futura", x: "70", y: "42", width: "44", height: "10", rx: "5" }],
    ["path", { class: "prj-vazio-marco", d: "M122 47l6 6-6 6-6-6z" }],
    ["path", { class: "prj-vazio-seta", d: "M52 11h-6v18h-6" }],
    ["path", { class: "prj-vazio-seta", d: "M96 29h-6v18h-6" }],
    ["line", { class: "prj-vazio-hoje", x1: "64", y1: "0", x2: "64", y2: "70" }],
  ];
  for (const [tag, attrs] of pecas) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    svg.append(el);
  }
  return svg;
}

export function montarVazio(o: OpcoesVazio): HTMLElement {
  return h(
    "div",
    { class: "prj-vazio" },
    desenho(),
    h("h3", {}, "Acompanhe um trabalho do começo ao fim"),
    h(
      "p",
      {},
      "Divida em etapas, ponha as datas e veja tudo numa linha do tempo. Serve para uma revisão de norma, uma contratação, um plano anual…",
    ),
    h(
      "div",
      { class: "prj-vazio-botoes" },
      h("button", { type: "button", class: "spro-botao primario", onclick: o.aoCriar }, icone("mais", 15), "Criar projeto"),
      h("button", { type: "button", class: "spro-botao", onclick: o.aoModelo }, iconeProjetos("modelo", 15), "Começar de um modelo"),
    ),
    o.aoImportar
      ? h(
          "a",
          {
            href: "#",
            onclick: (ev: Event) => {
              ev.preventDefault();
              o.aoImportar?.();
            },
          },
          "Importar meus projetos do servidor do Atividades",
        )
      : null,
  );
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `441 ok, 0 falha(s)` (+21 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/icones.ts \
  projetos/src/app/componentes/abas.ts \
  projetos/src/app/componentes/menuAjustes.ts \
  projetos/src/app/componentes/vazio.ts \
  projetos/tests/apoioApp.ts \
  projetos/tests/verificar-app-abas.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: icones, abas, menu ajustes e primeiro uso

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 4: Projetos — camada flutuante, cabeçalho com os 5 controles e filtro em popover

**Files:**
- Create: `projetos/src/app/componentes/camada.ts`, `projetos/src/app/componentes/cabecalho.ts`, `projetos/src/app/componentes/filtro.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-cabecalho.ts`

**Interfaces:**
- Consumes: `ProjetoNaTela` (T2), `Vista` (T2), `dataLonga`, `plural` (T2), `ESCALAS`, `Escala` (P2), `FiltroEtapas`, `FILTRO_VAZIO`, `contarChips`, `criteriosAtivos`, `filtrarEtapas`, `chaveResponsavel`, `Eu`, `SEM_FASE` (P2/T2); `abrirFlutuante` (sei-comum), `criarCombo`.
- Produces: `OpcoesCamada`, `Camada { el: HTMLDialogElement; posicionar(); fechar() }`, `abrirCamada(ancora, conteudo, o)`; `OpcoesCabecalho`, `montarCabecalho(o)` (`modo: "projeto" | "todos"`; botões "Gantt"/"Lista", escala, "Hoje", o filtro recebido e o primário "Etapa"/"Novo projeto"; lápis "Editar projeto"; link `.prj-processo`); `OpcoesFiltro`, `BotaoFiltro { el; definir(f); fechar() }`, `criarBotaoFiltro(o)` (popover `dialog.prj-filtro-pop`, campos "Responsável", "Fase", "Etiqueta", botão "Limpar filtro"), `projetoNoFiltro(p, f, hoje, eu)`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-cabecalho.ts`:

```ts
import { montarCabecalho } from "../src/app/componentes/cabecalho";
import { abrirCamada } from "../src/app/componentes/camada";
import { criarBotaoFiltro, projetoNoFiltro } from "../src/app/componentes/filtro";
import type { ProjetoNaTela } from "../src/app/dados";
import { FILTRO_VAZIO, type FiltroEtapas } from "../src/modelo/filtro";
import { resumoDoProjeto } from "../src/modelo/resumo";
import { combo, escolherCombo, opcoesDoCombo, tecla, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { etapa, fase, HOJE, projeto } from "./fabrica";
import { botao, checar, secao, tique } from "./util";

export async function verificarAppCabecalho(): Promise<void> {
  secao("app: cabecalho do projeto e controles");
  const doc = telaDoApp();
  const etapas = [
    etapa({ id: "e1", inicio: "2026-09-01", fim: "2026-09-10", concluidaEm: "2026-09-10" }),
    etapa({ id: "e2", inicio: "2026-10-01", fim: "2026-12-10" }),
  ];
  const p: ProjetoNaTela = {
    projeto: projeto({ id: "p1", nome: HOSTIL, processo: { protocolo: "50300.001234/2026-11", idProcedimento: "77" } }),
    vis: "unidade",
    fases: [],
    etapas,
    resumo: resumoDoProjeto(etapas, HOJE),
  };
  const feitos: string[] = [];
  const filtroFalso = doc.createElement("button");
  filtroFalso.textContent = "Filtro";
  const cab = montarCabecalho({
    modo: "projeto",
    projeto: p,
    vista: "gantt",
    escala: "Semana",
    filtro: filtroFalso,
    aoVista: (v) => feitos.push(`vista:${v}`),
    aoEscala: (e) => feitos.push(`escala:${e}`),
    aoHoje: () => feitos.push("hoje"),
    aoPrimario: () => feitos.push("etapa"),
    aoEditarProjeto: () => feitos.push("editar"),
    aoAbrirProcesso: () => feitos.push("processo"),
  });
  doc.getElementById("app")!.append(cab);
  const meta = texto(cab.querySelector(".prj-meta"));
  checar(
    "processo, escopo, X de Y concluidas e termino",
    meta.includes("50300.001234/2026-11") &&
      meta.includes("Toda a unidade") &&
      meta.includes("1 de 2 etapas concluídas") &&
      meta.includes("termina em 10/12/2026"),
    meta,
  );
  (cab.querySelector(".prj-processo") as HTMLElement).click();
  botao(cab, "Editar projeto")!.click();
  botao(cab, "Lista")!.click();
  botao(cab, "Mês")!.click();
  botao(cab, "Hoje")!.click();
  botao(cab, "Etapa")!.click();
  checar("os 5 controles e o lapis", feitos.join() === "processo,editar,vista:lista,escala:Mês,hoje,etapa", feitos);
  checar(
    "vista e escala atuais marcadas",
    botao(cab, "Gantt")?.getAttribute("aria-pressed") === "true" && botao(cab, "Semana")?.getAttribute("aria-pressed") === "true",
  );
  const lista = montarCabecalho({
    modo: "projeto",
    projeto: p,
    vista: "lista",
    escala: "Semana",
    filtro: filtroFalso,
    aoVista: () => undefined,
    aoEscala: () => undefined,
    aoHoje: () => undefined,
    aoPrimario: () => undefined,
  });
  checar("na vista Lista: sem escala e sem Hoje", !botao(lista, "Hoje") && !botao(lista, "Semana") && !!botao(lista, "Etapa"));
  const todos = montarCabecalho({
    modo: "todos",
    totais: { ativos: 3, arquivados: 1 },
    vista: "gantt",
    escala: "Mês",
    filtro: filtroFalso,
    aoVista: () => undefined,
    aoEscala: () => undefined,
    aoHoje: () => undefined,
    aoPrimario: () => feitos.push("novo"),
  });
  checar(
    "Todos: totais e dica",
    texto(todos.querySelector(".prj-meta")) === "3 projetos ativos · 1 arquivado · clique num projeto para abrir",
  );
  botao(todos, "Novo projeto")!.click();
  checar("Todos: o primario vira + Novo projeto", feitos.at(-1) === "novo");

  secao("app: filtro (popover com chips e campos)");
  const docF = telaDoApp();
  const lista2 = [
    etapa({
      id: "atr",
      inicio: "2026-09-01",
      fim: "2026-10-02",
      responsavel: { login: "ana", nome: "Ana Lima" },
      fase: "f1",
      etiquetas: ["TI"],
    }),
    etapa({ id: "and", inicio: "2026-10-01", fim: "2026-10-20", responsavel: { nome: HOSTIL } }),
    etapa({ id: "ok", inicio: "2026-09-01", fim: "2026-09-02", concluidaEm: "2026-09-02" }),
  ];
  let atual: FiltroEtapas = FILTRO_VAZIO;
  const f = criarBotaoFiltro({
    filtro: atual,
    etapas: lista2,
    fases: [fase({ id: "f1", nome: "Instrução" })],
    hoje: HOJE,
    aoMudar: (n) => {
      atual = n;
      f.definir(n);
    },
  });
  docF.getElementById("app")!.append(f.el);
  checar("sem criterio: so 'Filtro'", texto(f.el) === "Filtro");
  f.el.click();
  const pop = () => docF.querySelector(".prj-filtro-pop");
  checar("abre o popover num dialog nao modal", pop()?.tagName.toLowerCase() === "dialog" && pop()?.hasAttribute("open") === true);
  const chips = () => [...(pop()?.querySelectorAll(".spro-chip") ?? [])].map((c) => `${texto(c)}=${c.getAttribute("aria-pressed")}`);
  checar(
    "chips com as contagens",
    chips().join("|") ===
      "Atrasadas · 1=false|Em andamento · 1=false|Vence nesta semana · 0=false|Próximos 30 dias · 1=false|Concluídas=true|Só as minhas=false",
    chips(),
  );
  botao(pop()!, "Atrasadas · 1")!.click();
  botao(pop()!, "Concluídas")!.click();
  checar("chip liga e popover continua aberto", atual.situacoes.join() === "atrasadas" && !atual.mostrarConcluidas && !!pop());
  checar("o botao mostra a contagem", texto(f.el) === "Filtro · 2");
  checar(
    "responsavel com nome hostil como texto",
    opcoesDoCombo(pop()!, "Responsável").length === 2 && !pop()?.querySelector("img") && !docF.querySelector(".spro-combo-pop img"),
  );
  escolherCombo(pop()!, "Fase", "f1");
  await tique();
  checar("o combo da fase fica dentro do popover e ele nao fecha", atual.fases.join() === "f1" && !!pop());
  checar("combo de etiqueta", opcoesDoCombo(pop()!, "Etiqueta").join() === "TI");
  botao(pop()!, "Limpar filtro")!.click();
  checar("limpar volta ao vazio", JSON.stringify(atual) === JSON.stringify(FILTRO_VAZIO) && texto(f.el) === "Filtro");
  tecla(pop()!, "Escape");
  checar("Esc fecha", !pop());
  const semFase = criarBotaoFiltro({ filtro: FILTRO_VAZIO, etapas: lista2, hoje: HOJE, aoMudar: () => undefined });
  docF.getElementById("app")!.append(semFase.el);
  semFase.el.click();
  checar("no Todos (sem fases): sem o campo Fase", !combo(pop()!, "Fase") && !!combo(pop()!, "Responsável"));
  semFase.fechar();

  secao("app: projeto no filtro do Todos");
  const comEtiqueta: ProjetoNaTela = { ...p, projeto: projeto({ id: "px", etiquetas: ["Licitação"] }) };
  checar("sem criterio, todos passam", projetoNoFiltro(p, FILTRO_VAZIO, HOJE, { login: "ana" }));
  checar("com chip, passa quem tem etapa", !projetoNoFiltro(p, { ...FILTRO_VAZIO, situacoes: ["atrasadas"] }, HOJE, { login: "ana" }));
  checar(
    "etiqueta do projeto vale (tipo de projeto do legado)",
    projetoNoFiltro(comEtiqueta, { ...FILTRO_VAZIO, etiquetas: ["licitacao"] }, HOJE, { login: "ana" }),
  );

  secao("app: camada flutuante (balao e popover)");
  const docC = telaDoApp();
  const ancora = docC.createElement("button");
  docC.getElementById("app")!.append(ancora);
  let fechou = 0;
  const c = abrirCamada(ancora, docC.createElement("p"), { classe: "prj-teste", aoFechar: () => (fechou += 1) });
  checar("camada no body, dialog aberto", docC.querySelector("dialog.prj-camada.prj-teste")?.parentElement === docC.body);
  c.fechar();
  c.fechar();
  checar("fechar uma vez so", fechou === 1 && !docC.querySelector(".prj-teste"));
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/componentes/cabecalho'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/componentes/camada.ts`:

```ts
/**
 * Camada flutuante do app (balão da etapa, popover do filtro): um `<dialog>`
 * NÃO modal posto por `abrirFlutuante`. Sendo um `dialog[open]`, as listas dos
 * seletores e dos menus abertos dentro dela moram nela (`destinoDaCamada`), e
 * escolher uma opção não conta como "clique fora". Esc e clique fora fecham.
 */

import { h } from "@comum/ui/dom";
import { abrirFlutuante } from "@comum/ui/flutuante";

export interface OpcoesCamada {
  classe: string;
  largura?: number;
  rotulo?: string;
  aoFechar?: () => void;
}

export interface Camada {
  el: HTMLDialogElement;
  posicionar(): void;
  fechar(): void;
}

export function abrirCamada(ancora: Element, conteudo: Node, o: OpcoesCamada): Camada {
  const el = h("dialog", { class: `prj-camada ${o.classe}`, open: true, "aria-label": o.rotulo }, conteudo);
  let aberta = true;
  const doc = ancora.ownerDocument;
  const esc = (ev: Event) => {
    if ((ev as KeyboardEvent).key === "Escape") fechar();
  };
  const flut = abrirFlutuante(ancora as HTMLElement, el, {
    largura: o.largura,
    larguraMinima: o.largura,
    alturaMaxima: 640,
    aoFechar: () => fechar(),
  });
  function fechar(): void {
    if (!aberta) return;
    aberta = false;
    doc.removeEventListener("keydown", esc, true);
    flut.fechar();
    o.aoFechar?.();
  }
  doc.addEventListener("keydown", esc, true);
  return { el, posicionar: () => flut.posicionar(), fechar };
}
```

Arquivo completo `projetos/src/app/componentes/cabecalho.ts`:

```ts
/**
 * Cabeçalho do cartão (tela 1): à esquerda o que identifica o projeto
 * (processo, quem vê, "X de Y etapas concluídas", término, lápis); à direita os
 * 5 controles: Gantt|Lista, escala e Hoje (só no Gantt), Filtro e o primário
 * ("+ Etapa" no projeto, "+ Novo projeto" no Todos).
 */

import { h, icone } from "@comum/ui/dom";
import { ESCALAS, type Escala } from "../../gantt/escalas";
import { rotuloDaVis } from "../../modelo/escopo";
import type { ProjetoNaTela } from "../dados";
import { dataLonga, plural } from "../formato";
import type { Vista } from "../preferencias";

export interface OpcoesCabecalho {
  modo: "projeto" | "todos";
  projeto?: ProjetoNaTela;
  totais?: { ativos: number; arquivados: number };
  vista: Vista;
  escala: Escala;
  /** Botão do filtro (componentes/filtro.ts): fica o mesmo enquanto o filtro muda. */
  filtro: HTMLElement;
  aoVista(v: Vista): void;
  aoEscala(e: Escala): void;
  aoHoje(): void;
  aoPrimario(): void;
  aoEditarProjeto?: () => void;
  aoAbrirProcesso?: (ev: MouseEvent) => void;
}

const sep = () => h("span", { class: "prj-sep", "aria-hidden": "true" }, " · ");

function metaDoProjeto(o: OpcoesCabecalho, p: ProjetoNaTela): HTMLElement {
  const partes: Array<Node | string> = [];
  const proc = p.projeto.processo;
  if (proc?.protocolo)
    partes.push(
      h(
        "a",
        {
          href: "#",
          class: "prj-processo",
          title: "Abrir o processo",
          onclick: (ev: Event) => {
            ev.preventDefault();
            o.aoAbrirProcesso?.(ev as MouseEvent);
          },
        },
        proc.protocolo,
      ),
      sep(),
    );
  partes.push(h("span", { class: "prj-vis" }, icone(p.vis === "unidade" ? "predio" : "pessoa", 14), rotuloDaVis(p.vis)), sep());
  const r = p.resumo;
  partes.push(r.total ? `${r.feitas} de ${plural(r.total, "etapa concluída", "etapas concluídas")}` : "sem etapas");
  if (r.fim) partes.push(sep(), `termina em ${dataLonga(r.fim)}`);
  partes.push(
    h(
      "button",
      {
        type: "button",
        class: "spro-botao-icone pequeno",
        "aria-label": "Editar projeto",
        title: "Editar projeto",
        onclick: () => o.aoEditarProjeto?.(),
      },
      icone("lapis", 15),
    ),
  );
  return h("div", { class: "prj-meta" }, ...partes);
}

function metaDoTodos(t: { ativos: number; arquivados: number }): HTMLElement {
  return h(
    "div",
    { class: "prj-meta" },
    icone("camadas", 14),
    plural(t.ativos, "projeto ativo", "projetos ativos"),
    ...(t.arquivados ? [sep(), plural(t.arquivados, "arquivado", "arquivados")] : []),
    sep(),
    "clique num projeto para abrir",
  );
}

function segmentado<T extends string>(
  rotulo: string,
  valores: readonly T[],
  atual: T,
  aoEscolher: (v: T) => void,
  icones?: Partial<Record<T, () => SVGSVGElement>>,
) {
  return h(
    "div",
    { class: "spro-segmentado", role: "group", "aria-label": rotulo },
    ...valores.map((v) =>
      h(
        "button",
        { type: "button", "aria-pressed": String(v === atual), onclick: () => aoEscolher(v) },
        icones?.[v]?.() ?? null,
        v === "gantt" ? "Gantt" : v === "lista" ? "Lista" : v,
      ),
    ),
  );
}

export function montarCabecalho(o: OpcoesCabecalho): HTMLElement {
  const gantt = o.vista === "gantt";
  const controles = h(
    "div",
    { class: "prj-ctl" },
    segmentado<Vista>("Vista", ["gantt", "lista"], o.vista, o.aoVista, {
      gantt: () => icone("gantt", 14),
      lista: () => icone("planilha", 14),
    }),
    gantt ? segmentado<Escala>("Escala", ESCALAS, o.escala, o.aoEscala) : null,
    gantt ? h("button", { type: "button", class: "spro-botao fantasma pequeno", onclick: o.aoHoje }, "Hoje") : null,
    o.filtro,
    h(
      "button",
      { type: "button", class: "spro-botao primario", onclick: o.aoPrimario },
      icone("mais", 15),
      o.modo === "todos" ? "Novo projeto" : "Etapa",
    ),
  );
  const meta = o.modo === "projeto" && o.projeto ? metaDoProjeto(o, o.projeto) : metaDoTodos(o.totais ?? { ativos: 0, arquivados: 0 });
  return h("div", { class: "prj-cab" }, meta, controles);
}
```

Arquivo completo `projetos/src/app/componentes/filtro.ts`:

```ts
/**
 * Filtro das etapas (tela 1): botão "Filtro" (com a contagem dos critérios
 * ligados) que abre um popover com os chips de situação e os campos
 * Responsável, Fase e Etiqueta (OU dentro do campo, E entre campos). O popover
 * fica aberto enquanto o usuário mexe; o app redesenha só a vista.
 */

import { normalizarTexto } from "@comum/texto";
import { criarCombo, type OpcaoCombo } from "@comum/ui/combobox";
import { h, icone } from "@comum/ui/dom";
import { SEM_FASE } from "../../modelo/constantes";
import {
  type ChipSituacao,
  chaveResponsavel,
  contarChips,
  criteriosAtivos,
  type Eu,
  FILTRO_VAZIO,
  type FiltroEtapas,
  filtrarEtapas,
} from "../../modelo/filtro";
import type { DataISO, Etapa, Fase } from "../../modelo/tipos";
import type { ProjetoNaTela } from "../dados";
import { abrirCamada, type Camada } from "./camada";

export interface OpcoesFiltro {
  filtro: FiltroEtapas;
  /** Base das contagens e das opções: as etapas do projeto (ou de todos os ativos, no Todos). */
  etapas: readonly Etapa[];
  /** Fases do projeto; sem elas (Todos), o campo Fase não aparece. */
  fases?: readonly Fase[];
  hoje: DataISO;
  aoMudar(f: FiltroEtapas): void;
}

export interface BotaoFiltro {
  el: HTMLButtonElement;
  /** Atualiza a contagem do botão (e o popover, se aberto). */
  definir(f: FiltroEtapas): void;
  fechar(): void;
}

const CHIPS: ReadonlyArray<[ChipSituacao, string, string]> = [
  ["atrasadas", "Atrasadas", "var(--spro-perigo)"],
  ["andamento", "Em andamento", "var(--spro-destaque)"],
  ["semana", "Vence nesta semana", "var(--spro-aviso)"],
  ["proximos30", "Próximos 30 dias", "var(--spro-aviso)"],
];

function chip(rotulo: string, cor: string, ligado: boolean, aoClicar: () => void): HTMLButtonElement {
  return h(
    "button",
    { type: "button", class: "spro-chip", style: `--cor:${cor}`, "aria-pressed": String(ligado), onclick: aoClicar },
    rotulo,
  );
}

function opcoesResponsavel(etapas: readonly Etapa[]): OpcaoCombo[] {
  const mapa = new Map<string, OpcaoCombo>();
  for (const e of etapas) {
    if (!e.responsavel) continue;
    const k = chaveResponsavel(e.responsavel);
    const o = mapa.get(k) ?? { valor: k, rotulo: e.responsavel.nome, contagem: 0 };
    o.contagem = (o.contagem ?? 0) + 1;
    mapa.set(k, o);
  }
  return [...mapa.values()].sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));
}

function opcoesEtiqueta(etapas: readonly Etapa[], extras: readonly string[] = []): OpcaoCombo[] {
  const mapa = new Map<string, OpcaoCombo>();
  for (const t of [...etapas.flatMap((e) => e.etiquetas), ...extras]) {
    const k = normalizarTexto(t);
    const o = mapa.get(k) ?? { valor: t, rotulo: t, contagem: 0 };
    o.contagem = (o.contagem ?? 0) + 1;
    mapa.set(k, o);
  }
  return [...mapa.values()].sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));
}

export function criarBotaoFiltro(o: OpcoesFiltro): BotaoFiltro {
  let filtro = o.filtro;
  let camada: Camada | null = null;
  const el = h("button", { type: "button", class: "spro-botao prj-filtro", "aria-haspopup": "dialog", "aria-expanded": "false" });
  const pintarBotao = () => {
    const n = criteriosAtivos(filtro);
    el.replaceChildren(icone("filtro", 15), n ? `Filtro · ${n}` : "Filtro");
    el.classList.toggle("prj-filtro-ativo", n > 0);
  };
  const mudar = (f: FiltroEtapas) => {
    filtro = f;
    o.aoMudar(f);
  };
  const conteudo = h("div", {});
  const desenhar = () => {
    const n = contarChips(o.etapas, o.hoje);
    const alternar = (s: ChipSituacao) =>
      mudar({ ...filtro, situacoes: filtro.situacoes.includes(s) ? filtro.situacoes.filter((x) => x !== s) : [...filtro.situacoes, s] });
    const campo = (rotulo: string, opcoes: OpcaoCombo[], valor: string[], aoMudar: (v: string[]) => void) =>
      criarCombo({ rotulo, opcoes, valor, multiplo: true, vazio: rotulo, aoMudar, larguraLista: 240 }).el;
    const fases: OpcaoCombo[] | null = o.fases
      ? [...o.fases.map((f) => ({ valor: f.id, rotulo: f.nome })), { valor: SEM_FASE, rotulo: "Sem fase" }]
      : null;
    conteudo.replaceChildren(
      h("h4", {}, "Mostrar"),
      h(
        "div",
        { class: "prj-chips" },
        ...CHIPS.map(([s, rotulo, cor]) => chip(`${rotulo} · ${n[s]}`, cor, filtro.situacoes.includes(s), () => alternar(s))),
        chip("Concluídas", "var(--spro-ok)", filtro.mostrarConcluidas, () =>
          mudar({ ...filtro, mostrarConcluidas: !filtro.mostrarConcluidas }),
        ),
        chip("Só as minhas", "var(--spro-novidade)", filtro.soMinhas, () => mudar({ ...filtro, soMinhas: !filtro.soMinhas })),
      ),
      h("h4", {}, "Por campo"),
      h(
        "div",
        { class: "prj-filtro-campos" },
        campo("Responsável", opcoesResponsavel(o.etapas), filtro.responsaveis, (v) => mudar({ ...filtro, responsaveis: v })),
        fases ? campo("Fase", fases, filtro.fases, (v) => mudar({ ...filtro, fases: v })) : null,
        campo("Etiqueta", opcoesEtiqueta(o.etapas), filtro.etiquetas, (v) => mudar({ ...filtro, etiquetas: v })),
      ),
      ...(criteriosAtivos(filtro)
        ? [
            h(
              "button",
              { type: "button", class: "spro-botao fantasma pequeno prj-filtro-limpar", onclick: () => mudar(FILTRO_VAZIO) },
              "Limpar filtro",
            ),
          ]
        : []),
    );
  };
  const fechar = () => camada?.fechar();
  el.addEventListener("click", () => {
    if (camada) return fechar();
    desenhar();
    el.setAttribute("aria-expanded", "true");
    camada = abrirCamada(el, conteudo, {
      classe: "prj-filtro-pop",
      largura: 320,
      rotulo: "Filtro das etapas",
      aoFechar: () => {
        camada = null;
        el.setAttribute("aria-expanded", "false");
      },
    });
  });
  pintarBotao();
  return {
    el,
    definir(f) {
      filtro = f;
      pintarBotao();
      if (camada) desenhar();
    },
    fechar,
  };
}

/**
 * Portfólio filtrado: o projeto passa se alguma etapa passa. A etiqueta do
 * PROJETO (o "Tipo de projeto" do legado) também vale para o campo Etiqueta.
 */
export function projetoNoFiltro(p: Pick<ProjetoNaTela, "projeto" | "etapas">, f: FiltroEtapas, hoje: DataISO, eu: Eu): boolean {
  if (!criteriosAtivos(f)) return true;
  const alvo = new Set(f.etiquetas.map(normalizarTexto));
  const doProjeto = p.projeto.etiquetas.some((t) => alvo.has(normalizarTexto(t)));
  const resto = doProjeto ? { ...f, etiquetas: [] } : f;
  return !criteriosAtivos(resto) || filtrarEtapas(p.etapas, resto, hoje, eu).length > 0;
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `463 ok, 0 falha(s)` (+22 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/componentes/camada.ts \
  projetos/src/app/componentes/cabecalho.ts \
  projetos/src/app/componentes/filtro.ts \
  projetos/tests/verificar-app-cabecalho.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: camada flutuante, cabecalho com os controles e filtro em popover

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 5: Projetos — vista do projeto (lista à esquerda alinhada ao Gantt) e vista Lista

**Files:**
- Create: `projetos/src/app/componentes/vistaProjeto.ts`, `projetos/src/app/componentes/tabelaEtapas.ts`
- Create (apoio às provas): `projetos/tests/ganttFalso.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-vista.ts`

**Interfaces:**
- Consumes (P2): `Linha`, `LinhaEtapa`, `LinhaFase`, `linhasDoProjeto`, `montarGantt`, `ControleGantt`, `OpcoesGantt`, `Escala`, `ROTULO_SITUACAO`, `ROTULO_MARCO`, `situacaoMarco`, `MudancaDeDatas`; `tests/ambienteGantt.ts`, `tests/cenarioGantt.ts`; `iconeSituacao` (T3), `dataLonga` (T2); `avatar` (sei-comum).
- Produces: `DadosVistaProjeto { linhas; mostrarLista; escala; hoje; moverDependentes; rolarPara? }`, `AcoesVistaProjeto { montarGantt?; aoClicarEtapa(id, ancora); aoAlternarFase(faseId); aoAdicionar(nome); validar(m); aoMudarDatas(m); aoRecusar(msg); aoFalharGantt(erro) }`, `class VistaProjeto { el; atualizar(d); rolarParaHoje(); focarNova(); destruir() }` (linhas `.prj-lin-etapa[data-id]`, `.prj-lin-fase[data-fase][aria-expanded]`, última `.prj-lin-nova input`); `TOM_SITUACAO`, `pilulaDaSituacao(l, hoje, extra?)`, `barraDeProgresso(pct, tom?)`, `montarTabelaEtapas(linhas, { hoje; aoClicar })`. Nas provas: `ganttFalso({ falhar? }) → { montar; a: Anotacoes; opcoes() }`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/ganttFalso.ts`:

```ts
/**
 * Controlador do Gantt de mentira para as provas do app: a Frappe de verdade
 * precisa do ambiente do linkedom com medidas (ambienteGantt.ts); aqui só se
 * anota o que o app pediu (montar, atualizar, escala, realce, hoje, destruir).
 */

import type { Escala } from "../src/gantt/escalas";
import type { Linha } from "../src/gantt/linhas";
import type { ControleGantt, montarGantt, OpcoesGantt } from "../src/gantt/montar";

export interface Anotacoes {
  montagens: number;
  linhas: Linha[][];
  escalas: Escala[];
  realces: string[];
  hoje: number;
  destruidos: number;
}

export function ganttFalso(o: { falhar?: boolean } = {}) {
  const a: Anotacoes = { montagens: 0, linhas: [], escalas: [], realces: [], hoje: 0, destruidos: 0 };
  let opcoes: OpcoesGantt | null = null;
  const montar: typeof montarGantt = (area, linhas, op): ControleGantt => {
    a.montagens += 1;
    opcoes = op;
    area.classList.add("spro-gantt");
    if (o.falhar) op.aoFalhar?.(new Error("Frappe quebrou"));
    else a.linhas.push([...linhas]);
    let escala = op.escala;
    return {
      get escala() {
        return escala;
      },
      gantt: null,
      trocarEscala(e) {
        escala = e;
        a.escalas.push(e);
      },
      atualizar(l) {
        a.linhas.push([...l]);
      },
      rolarParaHoje() {
        a.hoje += 1;
      },
      realcar(id, ligado) {
        a.realces.push(`${id}:${ligado}`);
      },
      destruir() {
        a.destruidos += 1;
      },
    };
  };
  return { montar, a, opcoes: () => opcoes };
}
```

Arquivo completo `projetos/tests/verificar-app-vista.ts`:

```ts
import { montarTabelaEtapas } from "../src/app/componentes/tabelaEtapas";
import { type DadosVistaProjeto, VistaProjeto } from "../src/app/componentes/vistaProjeto";
import { idLinhaFase, linhasDoProjeto } from "../src/gantt/linhas";
import { area, esperarQuadro, instalarAmbienteGantt } from "./ambienteGantt";
import { tecla, telaDoApp, texto } from "./apoioApp";
import { cenario, HOSTIL } from "./cenarioGantt";
import { HOJE } from "./fabrica";
import { ganttFalso } from "./ganttFalso";
import { checar, disparar, secao } from "./util";

const { fases, etapas } = cenario();
const linhas = (recolhidas: string[] = []) =>
  linhasDoProjeto({ projeto: "p1", fases, etapas }, { hoje: HOJE, ordem: "inicio", recolhidas: new Set(recolhidas) });

function dados(m: Partial<DadosVistaProjeto> = {}): DadosVistaProjeto {
  return { linhas: linhas(), mostrarLista: true, escala: "Semana", hoje: HOJE, moverDependentes: true, ...m };
}

export async function verificarAppVista(): Promise<void> {
  secao("app: vista do projeto (lista a esquerda + Gantt)");
  const doc = telaDoApp();
  const g = ganttFalso();
  const feitos: string[] = [];
  const vista = new VistaProjeto(dados(), {
    montarGantt: g.montar,
    aoClicarEtapa: (id) => feitos.push(`clique:${id}`),
    aoAlternarFase: (id) => feitos.push(`fase:${id}`),
    aoAdicionar: (nome) => feitos.push(`nova:${nome}`),
    validar: () => null,
    aoMudarDatas: () => undefined,
    aoRecusar: () => undefined,
    aoFalharGantt: () => feitos.push("falhou"),
  });
  doc.getElementById("app")!.append(vista.el);
  const lin = () => [...vista.el.querySelectorAll(".prj-lin:not(.prj-lin-nova)")];
  checar("uma linha da lista por linha do Gantt", lin().length === linhas().length && g.a.linhas[0]?.length === linhas().length);
  checar(
    "cabecalho da lista: Etapa e Resp.",
    [...vista.el.querySelectorAll(".prj-lista-cab span")].map((s) => texto(s)).join() === "Etapa,Resp.",
  );
  const e1 = vista.el.querySelector<HTMLElement>('.prj-lin[data-id="e1"]')!;
  checar(
    "nome hostil como texto e com title",
    texto(e1.querySelector(".prj-lin-nome")) === HOSTIL &&
      e1.querySelector(".prj-lin-nome")?.getAttribute("title") === HOSTIL &&
      !vista.el.querySelector("img"),
  );
  checar("icone de situacao na linha", !!e1.querySelector(".prj-st-atrasada"));
  const f1 = vista.el.querySelector<HTMLElement>('.prj-lin-fase[data-fase="f1"]')!;
  checar(
    "linha de fase com feitas/total",
    texto(f1.querySelector(".prj-lin-nome")) === "Instrução" &&
      texto(f1.querySelector(".prj-lin-conta")) === "0/2" &&
      f1.getAttribute("aria-expanded") === "true",
  );
  disparar(e1, "mouseenter");
  disparar(e1, "mouseleave");
  checar("passar o mouse realca a barra", g.a.realces.join() === "e1:true,e1:false");
  e1.click();
  tecla(e1, "Enter");
  f1.click();
  checar("clique e Enter abrem o balao; fase recolhe", feitos.join() === "clique:e1,clique:e1,fase:f1", feitos);
  const nova = vista.el.querySelector<HTMLInputElement>(".prj-lin-nova input")!;
  checar("ultima linha: 'Adicionar etapa… (Enter)'", nova.getAttribute("placeholder") === "Adicionar etapa… (Enter)");
  nova.value = "  Parecer final  ";
  tecla(nova, "Enter");
  nova.value = "   ";
  tecla(nova, "Enter");
  checar(
    "Enter cria com o nome (vazio nao cria)",
    feitos.at(-1) === "nova:Parecer final" && feitos.filter((f) => f.startsWith("nova:")).length === 1,
  );

  secao("app: vista do projeto atualiza sem remontar o Gantt");
  const recolhida = linhas(["f1"]);
  vista.atualizar(dados({ linhas: recolhida }));
  checar(
    "fase recolhida: some da lista e do Gantt, sem remontar",
    g.a.montagens === 1 &&
      g.a.linhas.at(-1)?.length === recolhida.length &&
      vista.el.querySelector('.prj-lin-fase[data-fase="f1"]')?.getAttribute("aria-expanded") === "false",
  );
  vista.atualizar(dados({ linhas: recolhida, escala: "Mês" }));
  checar("trocar escala", g.a.escalas.join() === "Mês" && g.a.montagens === 1);
  vista.rolarParaHoje();
  checar("Hoje rola o Gantt", g.a.hoje === 1);
  vista.atualizar(dados({ linhas: recolhida, escala: "Mês", mostrarLista: false }));
  checar(
    "esconder a lista remonta o Gantt sem a coluna",
    g.a.montagens === 2 && g.a.destruidos === 1 && !vista.el.querySelector(".prj-lista"),
  );
  checar("o Gantt sabe que a lista sumiu (rotulo da fase volta)", g.opcoes()?.mostrarLista === false);
  vista.destruir();
  checar("destruir", g.a.destruidos === 2);

  secao("app: falha da Frappe cai para a lista");
  const quebrado = ganttFalso({ falhar: true });
  const falhas: string[] = [];
  new VistaProjeto(dados(), {
    montarGantt: quebrado.montar,
    aoClicarEtapa: () => undefined,
    aoAlternarFase: () => undefined,
    aoAdicionar: () => undefined,
    validar: () => null,
    aoMudarDatas: () => undefined,
    aoRecusar: () => undefined,
    aoFalharGantt: () => falhas.push("falhou"),
  });
  checar("avisa o app", falhas.join() === "falhou");

  secao("app: vista Lista (tabela por fase)");
  const docL = telaDoApp();
  const cliques: string[] = [];
  const tab = montarTabelaEtapas(linhas(), { hoje: HOJE, aoClicar: (id) => cliques.push(id) });
  docL.getElementById("app")!.append(tab);
  const cab = [...tab.querySelectorAll("th")].map((t) => texto(t));
  checar("colunas da tela 1", cab.join("|") === "|Etapa|Responsável|Início|Término|Situação|Progresso", cab);
  const grupos = [...tab.querySelectorAll("tr.prj-tab-grupo")].map((t) => texto(t));
  checar("agrupada por fase", grupos.join("|") === "Instrução 0/2|Deliberação 1/2|Vazia 0/0", grupos);
  const marco = tab.querySelector<HTMLElement>('tr[data-id="m1"]')!;
  checar(
    "marco com pilula e sem termino nem progresso",
    texto(marco).includes("marco") && texto(marco.children[4]) === "—" && texto(marco.children[6]) === "",
  );
  const ok = tab.querySelector<HTMLElement>('tr[data-id="ok"]')!;
  checar("concluida: situacao e 100%", texto(ok.children[5]) === "Concluída" && texto(ok.children[6]) === "100%");
  checar(
    "nome hostil como texto na tabela",
    texto(tab.querySelector('tr[data-id="e1"] .prj-tab-nome')) === HOSTIL && !tab.querySelector("img"),
  );
  marco.click();
  checar("clique na linha abre o balao", cliques.join() === "m1");

  secao("app: vista do projeto com a Frappe de verdade (alinhamento)");
  const docG = instalarAmbienteGantt();
  const vg = new VistaProjeto(dados(), {
    aoClicarEtapa: (id) => cliques.push(`barra:${id}`),
    aoAlternarFase: () => undefined,
    aoAdicionar: () => undefined,
    validar: () => null,
    aoMudarDatas: () => undefined,
    aoRecusar: () => undefined,
    aoFalharGantt: () => undefined,
  });
  area(docG).append(vg.el);
  await esperarQuadro();
  const barras = vg.el.querySelectorAll(".bar-wrapper");
  const linhasLista = vg.el.querySelectorAll(".prj-lin:not(.prj-lin-nova)");
  checar(
    "mesmo numero de barras e de linhas da lista, na mesma ordem",
    barras.length === linhasLista.length &&
      [...barras].every((b, i) => {
        const l = linhasLista[i]!;
        const id = l.getAttribute("data-id") ?? idLinhaFase(l.getAttribute("data-fase") ?? "");
        return b.getAttribute("data-id") === id;
      }),
  );
  const barra = vg.el.querySelector('.bar-wrapper[data-id="e2"]')!;
  disparar(barra, "mouseover");
  checar(
    "passar o mouse na barra realca a linha da lista",
    vg.el.querySelector('.prj-lin[data-id="e2"]')?.classList.contains("prj-realce") === true,
  );
  disparar(barra, "mouseout");
  checar("e tira o realce ao sair", !vg.el.querySelector(".prj-realce"));
  vg.destruir();
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/componentes/tabelaEtapas'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/componentes/tabelaEtapas.ts`:

```ts
/** Vista Lista do projeto (tela 1): tabela agrupada por fase. */

import { h } from "@comum/ui/dom";
import type { Linha, LinhaEtapa } from "../../gantt/linhas";
import { ROTULO_MARCO, ROTULO_SITUACAO, type SituacaoEtapa, situacaoMarco } from "../../modelo/situacao";
import type { DataISO } from "../../modelo/tipos";
import { dataLonga } from "../formato";
import { iconeSituacao } from "../icones";

export const TOM_SITUACAO: Record<SituacaoEtapa, string> = {
  concluida: "var(--spro-ok)",
  atrasada: "var(--spro-perigo)",
  andamento: "var(--spro-destaque)",
  futura: "var(--spro-suave)",
};

export function pilulaDaSituacao(l: Pick<LinhaEtapa, "etapa" | "situacao">, hoje: DataISO, extra = ""): HTMLElement {
  const e = l.etapa;
  const rotulo = e.marco ? ROTULO_MARCO[situacaoMarco(e, hoje)] : ROTULO_SITUACAO[l.situacao];
  const tom = e.marco && !e.concluidaEm && l.situacao !== "atrasada" ? "var(--spro-novidade)" : TOM_SITUACAO[l.situacao];
  return h("span", { class: "spro-pilula", style: `--tom:${tom}` }, `${rotulo}${extra}`);
}

export function barraDeProgresso(pct: number, tom = "var(--spro-destaque)"): HTMLElement {
  return h("span", { class: "prj-barra" }, h("i", { style: `width:${Math.max(0, Math.min(100, pct))}%;background:${tom}` }));
}

export function montarTabelaEtapas(
  linhas: readonly Linha[],
  o: { hoje: DataISO; aoClicar(id: string, ancora: Element): void },
): HTMLElement {
  const corpo = h("tbody", {});
  for (const l of linhas) {
    if (l.tipo === "fase") {
      corpo.append(
        h(
          "tr",
          { class: "prj-tab-grupo" },
          h("td", { colspan: "7" }, l.fase.nome, h("span", { class: "prj-tab-conta" }, ` ${l.resumo.feitas}/${l.resumo.total}`)),
        ),
      );
      continue;
    }
    if (l.tipo !== "etapa") continue;
    const e = l.etapa;
    const tr = h(
      "tr",
      { class: "prj-tab-linha", "data-id": l.id, tabindex: "0" },
      h("td", { class: "prj-tab-st" }, iconeSituacao(l.situacao, e.marco)),
      h(
        "td",
        { class: "prj-tab-nome" },
        e.nome,
        e.marco ? h("span", { class: "spro-pilula prj-pilula-marco", style: "--tom:var(--spro-novidade)" }, "marco") : null,
      ),
      h("td", {}, e.responsavel?.nome ?? "—"),
      h("td", {}, dataLonga(e.inicio)),
      h("td", {}, e.marco ? "—" : dataLonga(e.fim)),
      h("td", {}, pilulaDaSituacao(l, o.hoje)),
      h("td", { class: "prj-tab-prog" }, ...(e.marco ? [] : [barraDeProgresso(l.progresso, TOM_SITUACAO[l.situacao]), `${l.progresso}%`])),
    );
    tr.addEventListener("click", () => o.aoClicar(l.id, tr));
    tr.addEventListener("keydown", (ev) => {
      if ((ev as KeyboardEvent).key === "Enter") o.aoClicar(l.id, tr);
    });
    corpo.append(tr);
  }
  return h(
    "table",
    { class: "prj-tabela" },
    h("thead", {}, h("tr", {}, ...["", "Etapa", "Responsável", "Início", "Término", "Situação", "Progresso"].map((t) => h("th", {}, t)))),
    corpo,
  );
}
```

Arquivo completo `projetos/src/app/componentes/vistaProjeto.ts`:

```ts
/**
 * Vista do projeto em Gantt (tela 1, variante B): a lista de etapas à
 * esquerda, alinhada às barras (cabeçalho 64 px, linha 36 px: `MEDIDAS`), e o
 * Gantt à direita. Linhas de fase recolhem; passar o mouse numa linha realça a
 * barra e vice-versa; a última linha cria a etapa ao teclar Enter. Atualizar
 * não remonta a Frappe (a rolagem fica); esconder a lista ou mudar "mover
 * dependentes" remonta.
 */

import { avatar } from "@comum/ui/avatar";
import { h, icone } from "@comum/ui/dom";
import type { Escala } from "../../gantt/escalas";
import type { Linha, LinhaEtapa, LinhaFase } from "../../gantt/linhas";
import { type ControleGantt, montarGantt } from "../../gantt/montar";
import type { DataISO, MudancaDeDatas } from "../../modelo/tipos";
import { iconeSituacao } from "../icones";

export interface DadosVistaProjeto {
  linhas: Linha[];
  mostrarLista: boolean;
  escala: Escala;
  hoje: DataISO;
  moverDependentes: boolean;
  /** Dia que aparece à esquerda ao montar (padrão: hoje). */
  rolarPara?: DataISO;
}

export interface AcoesVistaProjeto {
  /** Injetável nas provas (a Frappe de verdade precisa de medidas). */
  montarGantt?: typeof montarGantt;
  aoClicarEtapa(id: string, ancora: Element): void;
  aoAlternarFase(faseId: string): void;
  aoAdicionar(nome: string): void;
  validar(mudancas: MudancaDeDatas[]): string | null;
  aoMudarDatas(mudancas: MudancaDeDatas[]): void;
  aoRecusar(mensagem: string): void;
  /** A Frappe não montou (spec 9): o app cai para a vista Lista. */
  aoFalharGantt(erro: unknown): void;
}

const ativar = (el: HTMLElement, fazer: () => void): HTMLElement => {
  el.addEventListener("click", fazer);
  el.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key !== "Enter" && (ev as KeyboardEvent).key !== " ") return;
    ev.preventDefault();
    fazer();
  });
  return el;
};

export class VistaProjeto {
  readonly el: HTMLElement;
  private readonly area: HTMLElement;
  private coluna: HTMLElement | null = null;
  private controle: ControleGantt | null = null;

  constructor(
    private d: DadosVistaProjeto,
    private readonly acoes: AcoesVistaProjeto,
  ) {
    this.el = h("div", { class: "prj-vista" });
    this.area = h("div", { class: "prj-gantt" });
    // Realce cruzado: a barra (no SVG da Frappe) acende a linha da lista.
    this.area.addEventListener("mouseover", (ev) =>
      this.realcarLinha((ev.target as Element | null)?.closest?.(".bar-wrapper")?.getAttribute("data-id") ?? null),
    );
    this.area.addEventListener("mouseout", () => this.realcarLinha(null));
    this.montar();
  }

  private realcarLinha(id: string | null): void {
    for (const l of this.coluna?.querySelectorAll(".prj-realce") ?? []) l.classList.remove("prj-realce");
    if (!id || !this.coluna) return;
    const alvo = [...this.coluna.querySelectorAll(".prj-lin-etapa")].find((l) => l.getAttribute("data-id") === id);
    alvo?.classList.add("prj-realce");
  }

  private linhaFase(l: LinhaFase): HTMLElement {
    const el = h(
      "div",
      { class: "prj-lin prj-lin-fase", "data-fase": l.fase.id, role: "button", tabindex: "0", "aria-expanded": String(!l.recolhida) },
      h("span", { class: "prj-lin-seta" }, icone("chevron", 14)),
      h("span", { class: "prj-lin-nome", title: l.fase.nome }, l.fase.nome),
      h("span", { class: "prj-lin-conta" }, `${l.resumo.feitas}/${l.resumo.total}`),
    );
    return ativar(el, () => this.acoes.aoAlternarFase(l.fase.id));
  }

  private linhaEtapa(l: LinhaEtapa): HTMLElement {
    const e = l.etapa;
    const el = h(
      "div",
      {
        class: `prj-lin prj-lin-etapa${l.situacao === "concluida" ? " prj-concluida" : ""}`,
        "data-id": l.id,
        role: "button",
        tabindex: "0",
        "aria-haspopup": "dialog",
      },
      iconeSituacao(l.situacao, e.marco),
      h("span", { class: "prj-lin-nome", title: e.nome }, e.nome),
      e.responsavel ? avatar(e.responsavel.nome, { tamanho: 22 }) : h("span", { class: "prj-av-vazio" }),
    );
    el.addEventListener("mouseenter", () => this.controle?.realcar(l.id, true));
    el.addEventListener("mouseleave", () => this.controle?.realcar(l.id, false));
    return ativar(el, () => this.acoes.aoClicarEtapa(l.id, el));
  }

  private desenharColuna(): HTMLElement {
    const nova = h("input", { type: "text", placeholder: "Adicionar etapa… (Enter)", "aria-label": "Adicionar etapa", maxlength: "200" });
    nova.addEventListener("keydown", (ev) => {
      if ((ev as KeyboardEvent).key !== "Enter") return;
      ev.preventDefault();
      const nome = nova.value.trim();
      if (!nome) return;
      nova.value = "";
      this.acoes.aoAdicionar(nome);
    });
    return h(
      "div",
      { class: "prj-lista" },
      h("div", { class: "prj-lista-cab" }, h("span", {}, "Etapa"), h("span", {}, "Resp.")),
      ...this.d.linhas.map((l) =>
        l.tipo === "fase" ? this.linhaFase(l) : l.tipo === "etapa" ? this.linhaEtapa(l) : h("div", { class: "prj-lin" }),
      ),
      h("div", { class: "prj-lin prj-lin-nova" }, icone("mais", 14), nova),
    );
  }

  private montar(): void {
    this.controle?.destruir();
    this.coluna = this.d.mostrarLista ? this.desenharColuna() : null;
    this.el.classList.toggle("prj-sem-lista", !this.d.mostrarLista);
    this.el.replaceChildren(...(this.coluna ? [this.coluna] : []), this.area);
    const montar = this.acoes.montarGantt ?? montarGantt;
    this.controle = montar(this.area, this.d.linhas, {
      escala: this.d.escala,
      hoje: this.d.hoje,
      mostrarLista: this.d.mostrarLista,
      moverDependentes: this.d.moverDependentes,
      rolarPara: this.d.rolarPara,
      aoClicar: (id, ancora) => this.acoes.aoClicarEtapa(id, ancora),
      validar: (m) => this.acoes.validar(m),
      aoMudarDatas: (m) => this.acoes.aoMudarDatas(m),
      aoRecusar: (msg) => this.acoes.aoRecusar(msg),
      aoFalhar: (erro) => this.acoes.aoFalharGantt(erro),
    });
  }

  atualizar(d: DadosVistaProjeto): void {
    const remontar = d.mostrarLista !== this.d.mostrarLista || d.moverDependentes !== this.d.moverDependentes || !this.controle;
    const escalaMudou = d.escala !== this.d.escala;
    this.d = d;
    if (remontar) {
      this.montar();
      return;
    }
    if (escalaMudou) this.controle?.trocarEscala(d.escala);
    this.controle?.atualizar(d.linhas);
    if (this.d.mostrarLista) {
      const nova = this.desenharColuna();
      this.coluna?.replaceWith(nova);
      this.coluna = nova;
    }
  }

  rolarParaHoje(): void {
    this.controle?.rolarParaHoje();
  }

  /** Volta o foco à última linha (depois de criar uma etapa, para digitar a próxima). */
  focarNova(): void {
    this.el.querySelector<HTMLInputElement>(".prj-lin-nova input")?.focus({ preventScroll: true });
  }

  destruir(): void {
    this.controle?.destruir();
    this.controle = null;
  }
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `488 ok, 0 falha(s)` (+25 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/componentes/vistaProjeto.ts \
  projetos/src/app/componentes/tabelaEtapas.ts \
  projetos/tests/ganttFalso.ts \
  projetos/tests/verificar-app-vista.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: vista do projeto com lista alinhada ao Gantt e vista Lista

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 6: Projetos — Todos (portfólio) em Gantt e em lista

**Files:**
- Create: `projetos/src/app/componentes/vistaTodos.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-todos.ts`

**Interfaces:**
- Consumes: `linhasDoPortfolio`, `LinhaProjeto`, `montarGantt` (P2); `ProjetoNaTela` (T2); `barraDeProgresso` (T5); `ganttFalso` (T5).
- Produces: `DadosVistaTodos { itens; mostrarLista; escala; hoje }`, `AcoesVistaTodos { montarGantt?; aoAbrir(id); aoFalharGantt(erro) }`, `class VistaTodos { el; atualizar(d); rolarParaHoje(); destruir() }` (linhas `.prj-lin-projeto[data-id]`, Gantt só leitura), `montarTabelaProjetos(itens, { aoAbrir })`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-todos.ts`:

```ts
import { montarTabelaProjetos, VistaTodos } from "../src/app/componentes/vistaTodos";
import type { ProjetoNaTela } from "../src/app/dados";
import type { LinhaProjeto } from "../src/gantt/linhas";
import { resumoDoProjeto } from "../src/modelo/resumo";
import type { Etapa, Vis } from "../src/modelo/tipos";
import { tecla, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { etapa, HOJE, projeto } from "./fabrica";
import { ganttFalso } from "./ganttFalso";
import { checar, secao } from "./util";

const item = (id: string, vis: Vis, etapas: Etapa[], nome = `Projeto ${id}`): ProjetoNaTela => ({
  projeto: projeto({ id, nome }),
  vis,
  fases: [],
  etapas,
  resumo: resumoDoProjeto(etapas, HOJE),
});

export function verificarAppTodos(): void {
  secao("app: Todos (portfolio)");
  const doc = telaDoApp();
  const itens = [
    item("p1", "unidade", [etapa({ id: "a", projeto: "p1", inicio: "2026-09-01", fim: "2026-09-30" })], HOSTIL),
    item("p2", "eu", [
      etapa({ id: "b", projeto: "p2", inicio: "2026-09-01", fim: "2026-09-02", concluidaEm: "2026-09-02" }),
      etapa({ id: "c", projeto: "p2", inicio: "2026-10-01", fim: "2026-11-30" }),
    ]),
    item("p3", "unidade", []),
  ];
  const g = ganttFalso();
  const abertos: string[] = [];
  const v = new VistaTodos(
    { itens, mostrarLista: true, escala: "Mês", hoje: HOJE },
    { montarGantt: g.montar, aoAbrir: (id) => abertos.push(id), aoFalharGantt: () => undefined },
  );
  doc.getElementById("app")!.append(v.el);
  const lin = [...v.el.querySelectorAll<HTMLElement>(".prj-lin-projeto")];
  checar("uma linha por projeto, alinhada ao Gantt", lin.length === 3 && g.a.linhas[0]?.length === 3);
  checar("Gantt so leitura, na escala do Todos", g.opcoes()?.somenteLeitura === true && g.opcoes()?.escala === "Mês");
  const cls = (g.a.linhas[0] as LinhaProjeto[]).map((l) => `${l.id}:${l.resumo.situacao}`);
  checar("cor da barra pela situacao do projeto", cls.join() === "p1:atrasado,p2:andamento,p3:semEtapas", cls);
  checar("nome hostil como texto", texto(lin[0]?.querySelector(".prj-lin-nome")) === HOSTIL && !v.el.querySelector("img"));
  checar(
    "pilula: atrasadas ou feitas/total",
    texto(lin[0]?.querySelector(".spro-pilula")) === "1 atrasada" && texto(lin[1]?.querySelector(".spro-pilula")) === "1/2",
  );
  lin[1]!.click();
  tecla(lin[2]!, "Enter");
  g.opcoes()?.aoClicar?.("p1", v.el);
  checar("clique na linha, Enter ou na barra abre o projeto", abertos.join() === "p2,p3,p1");
  v.atualizar({ itens: itens.slice(0, 1), mostrarLista: true, escala: "Ano", hoje: HOJE });
  checar(
    "atualizar com filtro e escala, sem remontar",
    g.a.montagens === 1 && g.a.escalas.join() === "Ano" && g.a.linhas.at(-1)?.length === 1,
  );
  v.atualizar({ itens, mostrarLista: false, escala: "Ano", hoje: HOJE });
  checar("sem lista: so o Gantt", g.a.montagens === 2 && !v.el.querySelector(".prj-lista"));
  v.rolarParaHoje();
  v.destruir();
  checar("Hoje e destruir", g.a.hoje === 1 && g.a.destruidos === 2);

  secao("app: Todos em Lista");
  const docL = telaDoApp();
  const tab = montarTabelaProjetos(itens, { aoAbrir: (id) => abertos.push(id) });
  docL.getElementById("app")!.append(tab);
  checar("colunas", [...tab.querySelectorAll("th")].map((t) => texto(t)).join("|") === "Projeto|Onde|Início|Término|Etapas|Progresso");
  const l2 = tab.querySelector<HTMLElement>('tr[data-id="p2"]')!;
  checar(
    "linha do projeto",
    [...l2.children]
      .map((c) => texto(c))
      .join("|")
      .startsWith("Projeto p2|Só eu|01/09/2026|30/11/2026|1/2|"),
  );
  checar("projeto sem etapas: datas em branco", texto(tab.querySelector('tr[data-id="p3"]')?.children[2]) === "—");
  l2.click();
  checar("clique abre", abertos.at(-1) === "p2");
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/componentes/vistaTodos'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/componentes/vistaTodos.ts`:

```ts
/**
 * "Todos" (tela 1): o portfólio. À esquerda os projetos (escopo, nome, pílula
 * "N atrasada" ou "feitas/total"); à direita um Gantt só leitura com uma barra
 * por projeto (cor pela situação). Clique abre o projeto. Na vista Lista, a
 * tabela de projetos.
 */

import { h, icone } from "@comum/ui/dom";
import type { Escala } from "../../gantt/escalas";
import { linhasDoPortfolio } from "../../gantt/linhas";
import { type ControleGantt, montarGantt } from "../../gantt/montar";
import { rotuloDaVis } from "../../modelo/escopo";
import type { DataISO } from "../../modelo/tipos";
import type { ProjetoNaTela } from "../dados";
import { dataLonga, plural } from "../formato";
import { barraDeProgresso } from "./tabelaEtapas";

export interface DadosVistaTodos {
  itens: readonly ProjetoNaTela[];
  mostrarLista: boolean;
  escala: Escala;
  hoje: DataISO;
}

export interface AcoesVistaTodos {
  montarGantt?: typeof montarGantt;
  aoAbrir(id: string): void;
  aoFalharGantt(erro: unknown): void;
}

function pilula(p: ProjetoNaTela): HTMLElement {
  const r = p.resumo;
  return r.atrasadas
    ? h("span", { class: "spro-pilula", style: "--tom:var(--spro-perigo)" }, plural(r.atrasadas, "atrasada", "atrasadas"))
    : h("span", { class: "spro-pilula" }, `${r.feitas}/${r.total}`);
}

export class VistaTodos {
  readonly el: HTMLElement;
  private readonly area: HTMLElement;
  private controle: ControleGantt | null = null;
  private coluna: HTMLElement | null = null;

  constructor(
    private d: DadosVistaTodos,
    private readonly acoes: AcoesVistaTodos,
  ) {
    this.el = h("div", { class: "prj-vista prj-vista-todos" });
    this.area = h("div", { class: "prj-gantt" });
    this.montar();
  }

  private linha(p: ProjetoNaTela): HTMLElement {
    const el = h(
      "div",
      {
        class: "prj-lin prj-lin-projeto",
        "data-id": p.projeto.id,
        role: "button",
        tabindex: "0",
        title: `${p.projeto.nome} · ${rotuloDaVis(p.vis)}`,
      },
      h("span", { class: "prj-lin-escopo" }, icone(p.vis === "unidade" ? "predio" : "pessoa", 15)),
      h("span", { class: "prj-lin-nome" }, p.projeto.nome),
      pilula(p),
    );
    el.addEventListener("click", () => this.acoes.aoAbrir(p.projeto.id));
    el.addEventListener("keydown", (ev) => {
      if ((ev as KeyboardEvent).key === "Enter") this.acoes.aoAbrir(p.projeto.id);
    });
    el.addEventListener("mouseenter", () => this.controle?.realcar(p.projeto.id, true));
    el.addEventListener("mouseleave", () => this.controle?.realcar(p.projeto.id, false));
    return el;
  }

  private desenharColuna(): HTMLElement {
    return h(
      "div",
      { class: "prj-lista" },
      h("div", { class: "prj-lista-cab" }, h("span", {}, "Projeto"), h("span", {}, "Etapas")),
      ...this.d.itens.map((p) => this.linha(p)),
    );
  }

  private linhas() {
    return linhasDoPortfolio(
      this.d.itens.map((i) => ({ projeto: i.projeto, vis: i.vis, etapas: i.etapas })),
      this.d.hoje,
    );
  }

  private montar(): void {
    this.controle?.destruir();
    this.coluna = this.d.mostrarLista ? this.desenharColuna() : null;
    this.el.classList.toggle("prj-sem-lista", !this.d.mostrarLista);
    this.el.replaceChildren(...(this.coluna ? [this.coluna] : []), this.area);
    this.controle = (this.acoes.montarGantt ?? montarGantt)(this.area, this.linhas(), {
      escala: this.d.escala,
      hoje: this.d.hoje,
      mostrarLista: this.d.mostrarLista,
      moverDependentes: false,
      somenteLeitura: true,
      aoClicar: (id) => this.acoes.aoAbrir(id),
      aoFalhar: (e) => this.acoes.aoFalharGantt(e),
    });
  }

  atualizar(d: DadosVistaTodos): void {
    const remontar = d.mostrarLista !== this.d.mostrarLista || !this.controle;
    const escalaMudou = d.escala !== this.d.escala;
    this.d = d;
    if (remontar) {
      this.montar();
      return;
    }
    if (escalaMudou) this.controle?.trocarEscala(d.escala);
    this.controle?.atualizar(this.linhas());
    if (this.coluna) {
      const nova = this.desenharColuna();
      this.coluna.replaceWith(nova);
      this.coluna = nova;
    }
  }

  rolarParaHoje(): void {
    this.controle?.rolarParaHoje();
  }

  destruir(): void {
    this.controle?.destruir();
    this.controle = null;
  }
}

export function montarTabelaProjetos(itens: readonly ProjetoNaTela[], o: { aoAbrir(id: string): void }): HTMLElement {
  const corpo = h("tbody", {});
  for (const p of itens) {
    const r = p.resumo;
    const tr = h(
      "tr",
      { class: "prj-tab-linha", "data-id": p.projeto.id, tabindex: "0" },
      h("td", { class: "prj-tab-nome" }, p.projeto.nome),
      h("td", {}, rotuloDaVis(p.vis)),
      h("td", {}, r.inicio ? dataLonga(r.inicio) : "—"),
      h("td", {}, r.fim ? dataLonga(r.fim) : "—"),
      h("td", {}, `${r.feitas}/${r.total}`),
      h("td", { class: "prj-tab-prog" }, barraDeProgresso(r.progresso), `${r.progresso}%`),
    );
    tr.addEventListener("click", () => o.aoAbrir(p.projeto.id));
    tr.addEventListener("keydown", (ev) => {
      if ((ev as KeyboardEvent).key === "Enter") o.aoAbrir(p.projeto.id);
    });
    corpo.append(tr);
  }
  return h(
    "table",
    { class: "prj-tabela" },
    h("thead", {}, h("tr", {}, ...["Projeto", "Onde", "Início", "Término", "Etapas", "Progresso"].map((t) => h("th", {}, t)))),
    corpo,
  );
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `501 ok, 0 falha(s)` (+13 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/componentes/vistaTodos.ts \
  projetos/tests/verificar-app-todos.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: Todos (portfolio) em Gantt e em lista

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 7: Projetos — balão da etapa

**Files:**
- Create: `projetos/src/app/componentes/balaoEtapa.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-balao.ts`

**Interfaces:**
- Consumes: `abrirCamada`, `Camada` (T4); `pilulaDaSituacao` (T5); `iconeProjetos` (T3); `dataLonga`, `textoDiasUteis` (T2); `diasUteisDeAtraso`, `duracaoUteis`, `desvioUteis`, `replanejada`, `progressoDaEtapa`, `situacaoEtapa` (P2); `criarMenu` (sei-comum).
- Produces: `DadosBalao { etapa; projeto: ProjetoNaTela; hoje }`, `AcoesBalao { aoConcluir(); aoReabrir(); aoEditar(secao?: "historico"); aoProgresso(pct); aoAbrirDocumento(numero); aoAbrirProcesso(v, ev); aoDuplicar(); aoMoverFase(faseId | undefined); aoExcluir() }`, `conteudoDoBalao(d, a, fechar)`, `abrirBalaoEtapa(ancora, d, a, aoFechar?) → Camada` (`dialog.prj-balao`; menu "Mais ações da etapa"; toda ação fecha o balão antes).

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-balao.ts`:

```ts
import { type AcoesBalao, abrirBalaoEtapa } from "../src/app/componentes/balaoEtapa";
import type { ProjetoNaTela } from "../src/app/dados";
import { resumoDoProjeto } from "../src/modelo/resumo";
import type { Etapa } from "../src/modelo/tipos";
import { digitar, itemDoMenu, itensDoMenu, tecla, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { etapa, fase, HOJE, projeto } from "./fabrica";
import { botao, checar, secao } from "./util";

function cena(e: Etapa) {
  const fases = [fase({ id: "f1", nome: "Instrução" }), fase({ id: "f2", nome: "Deliberação" })];
  const p: ProjetoNaTela = {
    projeto: projeto({ id: "p1", processo: { protocolo: "50300.001234/2026-11", idProcedimento: "77" } }),
    vis: "unidade",
    fases,
    etapas: [e],
    resumo: resumoDoProjeto([e], HOJE),
  };
  const feitos: string[] = [];
  const acoes: AcoesBalao = {
    aoConcluir: () => feitos.push("concluir"),
    aoReabrir: () => feitos.push("reabrir"),
    aoEditar: (s) => feitos.push(`editar${s ? `:${s}` : ""}`),
    aoProgresso: (n) => feitos.push(`progresso:${n}`),
    aoAbrirDocumento: (n) => feitos.push(`doc:${n}`),
    aoAbrirProcesso: (v) => feitos.push(`proc:${v.protocolo}`),
    aoDuplicar: () => feitos.push("duplicar"),
    aoMoverFase: (f) => feitos.push(`fase:${f ?? "-"}`),
    aoExcluir: () => feitos.push("excluir"),
  };
  return { p, acoes, feitos };
}

export function verificarAppBalao(): void {
  secao("app: balao da etapa atrasada e replanejada");
  const doc = telaDoApp();
  const ancora = doc.createElement("button");
  doc.getElementById("app")!.append(ancora);
  const e = etapa({
    id: "e1",
    nome: HOSTIL,
    fase: "f1",
    inicio: "2026-09-01",
    fim: "2026-10-02",
    base: { inicio: "2026-09-01", fim: "2026-09-25" },
    responsavel: { nome: "Carla Dias" },
    checklist: [
      { id: "c1", texto: "a", feito: true },
      { id: "c2", texto: "b", feito: false },
    ],
    documento: { numero: "1240001", titulo: "Relatório de AIR 3/2026" },
  });
  const { p, acoes, feitos } = cena(e);
  const b = abrirBalaoEtapa(ancora, { etapa: e, projeto: p, hoje: HOJE }, acoes);
  const el = b.el;
  checar("balao num dialog nao modal", el.tagName.toLowerCase() === "dialog" && el.classList.contains("prj-balao"));
  checar("pilula com dias uteis de atraso", texto(el.querySelector(".spro-pilula")) === "Atrasada · 2 dias úteis");
  checar("nome hostil como texto", texto(el.querySelector("h3")) === HOSTIL && !el.querySelector("img"));
  checar("fase e responsavel", texto(el.querySelector(".prj-balao-sub")) === "Instrução · Carla Dias");
  const linhas = [...el.querySelectorAll(".prj-balao-li")].map((l) => texto(l));
  checar("datas e duracao em dias uteis", linhas[0]?.startsWith("01/09/2026 → 02/10/2026 · 23 dias úteis") === true, linhas);
  checar(
    "aviso de replanejamento",
    linhas[0]?.includes("Replanejada: o plano original terminava em 25/09/2026 (+5 dias úteis)") === true,
    linhas[0],
  );
  checar("checklist X de Y", linhas.includes("Checklist: 1 de 2 itens"));
  checar(
    "documento e processo como links",
    linhas.includes("Relatório de AIR 3/2026 (SEI 1240001)") && linhas.includes("50300.001234/2026-11"),
  );
  const links = [...el.querySelectorAll<HTMLAnchorElement>(".prj-balao-li a")];
  links[0]!.click();
  links[1]!.click();
  checar("abrir documento e processo", feitos.join() === "doc:1240001,proc:50300.001234/2026-11");
  const regua = el.querySelector<HTMLInputElement>("input[type='range']");
  checar("regua de progresso so com medida manual", !!regua && regua.value === "0");
  digitar(regua, "60");
  checar("a regua grava no change", feitos.at(-1) === "progresso:60" && texto(el.querySelector(".prj-balao-prog b")) === "60%");
  const abrir = () => abrirBalaoEtapa(ancora, { etapa: e, projeto: p, hoje: HOJE }, acoes).el;
  botao(el, "Concluir etapa")!.click();
  checar("toda acao fecha o balao", feitos.at(-1) === "concluir" && !doc.querySelector(".prj-balao"));
  botao(abrir(), "Editar")!.click();
  checar("editar", feitos.at(-1) === "editar");
  const menu = itensDoMenu(abrir(), "Mais ações da etapa");
  checar(
    "menu: duplicar, mover, historico, excluir",
    menu.join("|") === "Duplicar|Mover para “Deliberação”|Mover para “Sem fase”|Histórico|Excluir",
    menu,
  );
  itemDoMenu(doc.querySelector(".prj-balao")!, "Mais ações da etapa", "Mover para “Deliberação”");
  itemDoMenu(abrir(), "Mais ações da etapa", "Histórico");
  itemDoMenu(abrir(), "Mais ações da etapa", "Excluir");
  itemDoMenu(abrir(), "Mais ações da etapa", "Duplicar");
  checar("itens do menu", feitos.slice(-4).join() === "fase:f2,editar:historico,excluir,duplicar", feitos);
  tecla(abrir(), "Escape");
  checar("Esc fecha", !doc.querySelector(".prj-balao"));

  secao("app: balao de marco e de etapa concluida");
  const m = etapa({ id: "m1", marco: true, inicio: "2026-12-03", fim: "2026-12-03" });
  const cm = cena(m);
  const bm = abrirBalaoEtapa(ancora, { etapa: m, projeto: cm.p, hoje: HOJE }, cm.acoes);
  checar(
    "marco: pilula, uma data, sem regua",
    texto(bm.el.querySelector(".spro-pilula")) === "Marco" &&
      texto(bm.el.querySelector(".prj-balao-li")) === "03/12/2026" &&
      !bm.el.querySelector("input[type='range']"),
  );
  checar("sem fase", texto(bm.el.querySelector(".prj-balao-sub")) === "Sem fase");
  botao(bm.el, "Marcar como cumprido")!.click();
  checar("marcar como cumprido", cm.feitos.join() === "concluir");
  bm.fechar();
  const ok = etapa({ id: "ok", inicio: "2026-09-01", fim: "2026-09-10", concluidaEm: "2026-09-09", medida: "tempo" });
  const co = cena(ok);
  const bo = abrirBalaoEtapa(ancora, { etapa: ok, projeto: co.p, hoje: HOJE }, co.acoes);
  checar(
    "concluida: data da conclusao, sem regua nem nota de medida",
    texto(bo.el).includes("Concluída em 09/09/2026") && !bo.el.querySelector("input[type='range']") && !texto(bo.el).includes("pelo tempo"),
  );
  botao(bo.el, "Reabrir")!.click();
  checar("reabrir", co.feitos.join() === "reabrir");
  bo.fechar();
  const tempo = etapa({ id: "t", medida: "checklist", processo: { protocolo: "50300.000001/2026-01", sigiloso: true } });
  const ct = cena(tempo);
  const bt = abrirBalaoEtapa(ancora, { etapa: tempo, projeto: ct.p, hoje: HOJE }, ct.acoes);
  checar(
    "medida automatica: nota, sem regua; processo da etapa vence o do projeto",
    texto(bt.el).includes("Progresso calculado pelo checklist") &&
      !bt.el.querySelector("input[type='range']") &&
      texto(bt.el).includes("50300.000001/2026-01"),
  );
  bt.fechar();
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/componentes/balaoEtapa'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/componentes/balaoEtapa.ts`:

```ts
/**
 * Balão da etapa (tela 1): o dia a dia sem abrir formulário. Situação (com os
 * dias úteis de atraso), nome, "Fase · Responsável", datas e duração em dias
 * úteis, aviso de replanejamento, checklist, documento e processo (links que
 * abrem no SEI), régua de progresso (só com medida manual) e as ações:
 * Concluir / Marcar como cumprido / Reabrir, Editar e o menu (duplicar, mover
 * de fase, histórico, excluir). Esc ou clique fora fecha.
 */

import { h, icone } from "@comum/ui/dom";
import { criarMenu, type EntradaMenu } from "@comum/ui/menu";
import { diasUteisDeAtraso } from "../../modelo/alertas";
import { duracaoUteis } from "../../modelo/calendario";
import { desvioUteis, replanejada } from "../../modelo/linhaDeBase";
import { progressoDaEtapa } from "../../modelo/progresso";
import { situacaoEtapa } from "../../modelo/situacao";
import type { DataISO, Etapa, Vinculo } from "../../modelo/tipos";
import type { ProjetoNaTela } from "../dados";
import { dataLonga, textoDiasUteis } from "../formato";
import { iconeProjetos } from "../icones";
import { abrirCamada, type Camada } from "./camada";
import { pilulaDaSituacao } from "./tabelaEtapas";

export interface DadosBalao {
  etapa: Etapa;
  projeto: ProjetoNaTela;
  hoje: DataISO;
}

export interface AcoesBalao {
  /** Concluir (ou "Marcar como cumprido", no marco). */
  aoConcluir(): void;
  aoReabrir(): void;
  aoEditar(secao?: "historico"): void;
  aoProgresso(pct: number): void;
  aoAbrirDocumento(numero: string): void;
  aoAbrirProcesso(v: Vinculo, ev: MouseEvent): void;
  aoDuplicar(): void;
  aoMoverFase(faseId: string | undefined): void;
  aoExcluir(): void;
}

const linha = (ic: Element, ...conteudo: Array<Node | string | null>) =>
  h("div", { class: "prj-balao-li" }, ic, h("div", {}, ...conteudo.filter((c): c is Node | string => c !== null)));

const link = (texto: string, titulo: string, fazer: (ev: MouseEvent) => void) =>
  h(
    "a",
    {
      href: "#",
      title: titulo,
      onclick: (ev: Event) => {
        ev.preventDefault();
        fazer(ev as MouseEvent);
      },
    },
    texto,
  );

function datas(e: Etapa): HTMLElement {
  if (e.marco) return linha(icone("calendario", 15), dataLonga(e.inicio));
  const desvio = replanejada(e) ? desvioUteis(e) : 0;
  const aviso =
    desvio && e.base
      ? h(
          "small",
          {},
          `Replanejada: o plano original terminava em ${dataLonga(e.base.fim)} (${desvio > 0 ? `+${textoDiasUteis(desvio)}` : `${textoDiasUteis(-desvio)} antes`})`,
        )
      : null;
  return linha(
    icone("calendario", 15),
    `${dataLonga(e.inicio)} → ${dataLonga(e.fim)} · ${textoDiasUteis(duracaoUteis(e.inicio, e.fim))}`,
    aviso,
  );
}

function regua(e: Etapa, aoProgresso: (n: number) => void): HTMLElement {
  const valor = h("b", {}, `${e.progresso}%`);
  const r = h("input", { type: "range", min: "0", max: "100", step: "5", value: String(e.progresso), "aria-label": "Progresso" });
  r.addEventListener("input", () => {
    valor.textContent = `${r.value}%`;
  });
  r.addEventListener("change", () => {
    valor.textContent = `${r.value}%`;
    aoProgresso(Number(r.value));
  });
  return h("div", { class: "prj-balao-prog" }, h("span", {}, "Progresso"), r, valor);
}

function menuDaEtapa(d: DadosBalao, a: AcoesBalao): HTMLButtonElement {
  return criarMenu({
    rotulo: "Mais ações da etapa",
    classe: "spro-botao-icone pequeno",
    largura: 250,
    itens: (): EntradaMenu[] => [
      { rotulo: "Duplicar", icone: "copiar", fazer: a.aoDuplicar },
      ...d.projeto.fases
        .filter((f) => f.id !== d.etapa.fase)
        .map((f) => ({ rotulo: `Mover para “${f.nome}”`, icone: "mover" as const, fazer: () => a.aoMoverFase(f.id) })),
      d.etapa.fase ? { rotulo: "Mover para “Sem fase”", icone: "mover", fazer: () => a.aoMoverFase(undefined) } : null,
      { rotulo: "Histórico", icone: "historico", fazer: () => a.aoEditar("historico") },
      "-",
      { rotulo: "Excluir", icone: "lixeira", perigo: true, fazer: a.aoExcluir },
    ],
  });
}

export function conteudoDoBalao(d: DadosBalao, a: AcoesBalao, fechar: () => void): HTMLElement {
  const e = d.etapa;
  const situacao = situacaoEtapa(e, d.hoje);
  const atraso = situacao === "atrasada" ? diasUteisDeAtraso(e, d.hoje) : 0;
  const fase = d.projeto.fases.find((f) => f.id === e.fase)?.nome ?? "Sem fase";
  const processo = e.processo?.protocolo ? e.processo : d.projeto.projeto.processo;
  const feitos = e.checklist.filter((i) => i.feito).length;
  const aberta = !e.concluidaEm;
  const nota =
    aberta && !e.marco && e.medida === "tempo"
      ? "Progresso automático pelo tempo decorrido"
      : aberta && !e.marco && e.medida === "checklist"
        ? "Progresso calculado pelo checklist"
        : null;
  const principal = aberta
    ? h(
        "button",
        { type: "button", class: "spro-botao primario pequeno", onclick: a.aoConcluir },
        icone("check", 14),
        e.marco ? "Marcar como cumprido" : "Concluir etapa",
      )
    : h("button", { type: "button", class: "spro-botao pequeno", onclick: a.aoReabrir }, "Reabrir");
  return h(
    "div",
    { class: "prj-balao-corpo" },
    h(
      "button",
      {
        type: "button",
        class: "spro-botao-icone pequeno prj-balao-fechar",
        "aria-label": "Fechar",
        title: "Fechar (Esc)",
        onclick: fechar,
      },
      icone("fechar", 14),
    ),
    pilulaDaSituacao({ etapa: e, situacao }, d.hoje, atraso ? ` · ${textoDiasUteis(atraso)}` : ""),
    h("h3", {}, e.nome),
    h("div", { class: "prj-balao-sub" }, e.responsavel ? `${fase} · ${e.responsavel.nome}` : fase),
    datas(e),
    e.concluidaEm ? linha(icone("check", 15), `Concluída em ${dataLonga(e.concluidaEm)}`) : null,
    e.checklist.length ? linha(iconeProjetos("checklist", 15), `Checklist: ${feitos} de ${e.checklist.length} itens`) : null,
    e.documento
      ? linha(
          icone("documento", 15),
          link(
            e.documento.titulo ? `${e.documento.titulo} (SEI ${e.documento.numero})` : `Documento SEI ${e.documento.numero}`,
            "Abrir o documento no SEI",
            () => a.aoAbrirDocumento(e.documento!.numero),
          ),
        )
      : null,
    processo?.protocolo
      ? linha(
          icone(processo.sigiloso ? "cadeado" : "pasta", 15),
          link(processo.protocolo, "Abrir o processo", (ev) => a.aoAbrirProcesso(processo, ev)),
        )
      : null,
    aberta && !e.marco && e.medida === "manual" ? regua({ ...e, progresso: progressoDaEtapa(e, d.hoje) }, a.aoProgresso) : null,
    nota ? h("div", { class: "prj-balao-nota" }, nota) : null,
    h(
      "div",
      { class: "prj-balao-acoes" },
      principal,
      h("button", { type: "button", class: "spro-botao pequeno", onclick: () => a.aoEditar() }, icone("lapis", 14), "Editar"),
      menuDaEtapa(d, a),
    ),
  );
}

export function abrirBalaoEtapa(ancora: Element, d: DadosBalao, a: AcoesBalao, aoFechar?: () => void): Camada {
  let camada: Camada | null = null;
  const fechar = () => camada?.fechar();
  // Toda ação fecha o balão antes (o diálogo, o aviso ou o redesenho vêm depois).
  const fechando = <F extends (...args: never[]) => void>(f: F) =>
    ((...args: Parameters<F>) => {
      fechar();
      f(...args);
    }) as F;
  const acoes: AcoesBalao = {
    ...a,
    aoConcluir: fechando(a.aoConcluir),
    aoReabrir: fechando(a.aoReabrir),
    aoEditar: fechando(a.aoEditar),
    aoDuplicar: fechando(a.aoDuplicar),
    aoMoverFase: fechando(a.aoMoverFase),
    aoExcluir: fechando(a.aoExcluir),
  };
  camada = abrirCamada(ancora, conteudoDoBalao(d, acoes, fechar), { classe: "prj-balao", largura: 330, rotulo: d.etapa.nome, aoFechar });
  return camada;
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `523 ok, 0 falha(s)` (+22 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/componentes/balaoEtapa.ts \
  projetos/tests/verificar-app-balao.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: balao da etapa

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 8: Projetos — diálogo da etapa (essenciais + seções recolhidas com resumo)

**Files:**
- Create: `projetos/src/app/dialogos/campos.ts`, `projetos/src/app/dialogos/etapa.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-etapa.ts`

**Interfaces:**
- Consumes: `ProjetoNaTela` (T2), tipos da ponte (T2), `dataDeFormulario`, `dataCurta`, `textoDiasUteis`, `textoDoRegistro`, `resumoDoUltimoRegistro` (T2), `iconeProjetos` (T3); `duracaoUteis`, `chaveResponsavel`, `LIMITES`, `ErroValidacao` (P2); `criarCombo`, `AbrirModal`, `novoId`, `normalizarTexto` (sei-comum).
- Produces: `campo(rotulo, controle, o?)`, `linhaDeCampos(...)`, `Secao { el; resumir(); abrir() }`, `secao(id, ic, titulo, resumo, conteudo, aberta?)`, `caixaDeErros()`, `mensagensDoErro(e)`, `CampoProcesso { combo; vinculo() }`, `campoProcesso({ rotulo; atual?; vazio; processos; aoMudar? })`, `campoDocumento(valor, conferir?, aoMudar?) → { el; numero() }`; `ResultadoEtapa { nome; inicio; fim; marco; responsavel?; fase?; novaFase?; dependeDe; checklist; processo?; documento?; etiquetas; observacoes?; medida }`, `ContextoDialogoEtapa`, `abrirDialogoEtapa(c) → { fechar() }` (modal "Etapa"; combos "Responsável", "Fase", "Adicionar dependência", "Processo da etapa", "Etiquetas da etapa"; seções `data-secao` checklist, processo, etiquetas, observacoes, medida, historico).

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-etapa.ts`:

```ts
import type { AbrirModal } from "@comum/ui/dialogo";
import type { ProjetoNaTela } from "../src/app/dados";
import { abrirDialogoEtapa, type ContextoDialogoEtapa, type ResultadoEtapa } from "../src/app/dialogos/etapa";
import { chaveResponsavel } from "../src/modelo/filtro";
import { resumoDoProjeto } from "../src/modelo/resumo";
import type { Registro } from "../src/modelo/tipos";
import { ErroValidacao } from "../src/modelo/validacao";
import { combo, criarNoCombo, digitar, escolherCombo, marcar, opcoesDoCombo, tecla, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { etapa, fase, HOJE, projeto } from "./fabrica";
import { botao, checar, secao, tique } from "./util";

const fases = [fase({ id: "f1", nome: "Instrução" })];
const nota = etapa({ id: "nt", nome: "Nota técnica", fase: "f1", responsavel: { login: "ana", nome: "Ana Lima" } });
const air = etapa({
  id: "air",
  nome: "Relatório de AIR",
  fase: "f1",
  inicio: "2026-09-01",
  fim: "2026-10-02",
  dependeDe: ["nt"],
  responsavel: { nome: "Carla Dias" },
  medida: "checklist",
  checklist: [
    { id: "c1", texto: "Levantar dados", feito: true },
    { id: "c2", texto: "Matriz de impactos", feito: false },
  ],
  etiquetas: ["AIR"],
});
const p: ProjetoNaTela = {
  projeto: projeto({ id: "p1", processo: { protocolo: "50300.001234/2026-11", idProcedimento: "77" } }),
  vis: "unidade",
  fases,
  etapas: [nota, air],
  resumo: resumoDoProjeto([nota, air], HOJE),
};

function cena(m: Partial<ContextoDialogoEtapa> = {}) {
  const doc = telaDoApp();
  const modais: string[] = [];
  let fechados = 0;
  const abrirModal: AbrirModal = (o) => {
    modais.push(o.titulo);
    doc.body.append(o.conteudo);
    return {
      fechar: () => {
        fechados += 1;
        o.conteudo.remove();
        o.aoFechar?.();
      },
    };
  };
  const salvos: ResultadoEtapa[] = [];
  const t = { recusar: null as string[] | null, excluidos: 0 };
  const c: ContextoDialogoEtapa = {
    abrirModal,
    projeto: p,
    hoje: HOJE,
    agora: new Date(2026, 9, 6, 15).getTime(),
    usuarios: async () => [{ login: "bruno", nome: "Bruno Reis" }, { nome: HOSTIL }],
    processos: async () => [{ protocolo: "50300.009999/2026-01", idProcedimento: "99", sigiloso: true }],
    etiquetas: ["AIR", "Urgente"],
    salvar: async (r) => {
      if (t.recusar) throw new ErroValidacao(t.recusar);
      salvos.push(r);
    },
    ...m,
  };
  const dlg = abrirDialogoEtapa(c);
  return { doc, modais, salvos, t, dlg, fechados: () => fechados };
}

export async function verificarAppEtapa(): Promise<void> {
  secao("app: dialogo da etapa (nova)");
  const n = cena({ inicial: { inicio: "2026-10-12", fim: "2026-10-16" } });
  const corpo = () => n.doc.querySelector(".prj-form-etapa") as HTMLElement;
  checar("titulo Etapa", n.modais.join() === "Etapa");
  const campos = (sel: string) => corpo().querySelector<HTMLInputElement>(sel);
  checar(
    "datas iniciais da etapa nova",
    campos("input[name='inicio']")?.value === "2026-10-12" && campos("input[name='fim']")?.value === "2026-10-16",
  );
  checar("dias uteis ao lado (12/10 e feriado)", texto(corpo().querySelector(".prj-uteis")) === "4 dias úteis");
  checar(
    "secoes recolhidas com resumo; sem historico na nova",
    [...corpo().querySelectorAll(".prj-sec")]
      .map((s) => `${texto(s.querySelector(".prj-sec-tit"))}=${texto(s.querySelector(".prj-sec-res"))}`)
      .join("|") ===
      "Checklist=nenhum|Processo e documento=50300.001234/2026-11 · sem documento|Etiquetas=nenhuma|Observações=—|Como medir o progresso=eu informo",
  );
  checar("sem Excluir na nova", !botao(corpo(), "Excluir"));
  botao(corpo(), "Salvar")!.click();
  await tique();
  checar(
    "nome obrigatorio (nada salvo)",
    texto(corpo().querySelector(".prj-erros")) === "Informe o nome da etapa." && n.salvos.length === 0,
  );
  digitar(campos("input[name='nome']"), "Parecer");
  digitar(campos("input[name='fim']"), "2026-02-30");
  botao(corpo(), "Salvar")!.click();
  await tique();
  checar(
    "data impossivel barrada antes do modelo",
    texto(corpo().querySelector(".prj-erros")).includes("término válida") && n.salvos.length === 0,
  );
  checar("dias uteis com data invalida: travessao", texto(corpo().querySelector(".prj-uteis")) === "—");
  digitar(campos("input[name='fim']"), "2026-10-09");
  botao(corpo(), "Salvar")!.click();
  await tique();
  checar("termino antes do inicio barrado", texto(corpo().querySelector(".prj-erros")) === "O término não pode ser antes do início.");
  digitar(campos("input[name='fim']"), "2026-10-23");
  marcar(campos("input[name='marco']"));
  checar(
    "marco esconde o termino",
    (corpo().querySelector(".prj-campo-fim") as HTMLElement).hidden && (corpo().querySelector(".prj-uteis") as HTMLElement).hidden,
  );
  marcar(campos("input[name='marco']"), false);
  await tique();
  checar(
    "responsavel: usuarios da unidade e os ja usados no projeto",
    opcoesDoCombo(corpo(), "Responsável").join("|") ===
      ["", "login:bruno", chaveResponsavel({ nome: HOSTIL }), "login:ana", "nome:carla dias"].join("|"),
    opcoesDoCombo(corpo(), "Responsável"),
  );
  escolherCombo(corpo(), "Responsável", "login:bruno");
  await criarNoCombo(corpo(), "Fase", "Consulta pública");
  escolherCombo(corpo(), "Adicionar dependência", "nt");
  checar("dependencia vira chip com o nome", texto(corpo().querySelector(".prj-chip-x")) === "Nota técnica");
  (corpo().querySelector(".prj-sec[data-secao='checklist'] > button") as HTMLElement).click();
  const novo = corpo().querySelector<HTMLInputElement>(".prj-sec[data-secao='checklist'] input[type='text']")!;
  novo.value = "Revisão da chefia";
  tecla(novo, "Enter");
  checar(
    "checklist: item novo e resumo",
    texto(corpo().querySelector(".prj-sec[data-secao='checklist'] .prj-sec-res")) === "0 de 1 feitos",
  );
  escolherCombo(corpo(), "Processo da etapa", "50300.009999/2026-01");
  digitar(corpo().querySelector("input[name='documento']"), "SEI 1240001");
  await criarNoCombo(corpo(), "Etiquetas da etapa", "Jurídico");
  digitar(corpo().querySelector("textarea"), "  Ver com a PF  ");
  botao(corpo(), "Pelo tempo decorrido")!.click();
  botao(corpo(), "Salvar")!.click();
  await tique();
  const r = n.salvos[0];
  checar(
    "salva o resultado completo",
    !!r &&
      r.nome === "Parecer" &&
      r.inicio === "2026-10-12" &&
      r.fim === "2026-10-23" &&
      !r.marco &&
      r.responsavel?.login === "bruno" &&
      r.novaFase === "Consulta pública" &&
      r.fase === undefined &&
      r.dependeDe.join() === "nt" &&
      r.checklist.map((i) => i.texto).join() === "Revisão da chefia" &&
      r.processo?.protocolo === "50300.009999/2026-01" &&
      r.processo?.sigiloso === true &&
      r.documento?.numero === "1240001" &&
      r.etiquetas.join() === "Jurídico" &&
      r.observacoes === "Ver com a PF" &&
      r.medida === "tempo",
    r,
  );
  checar("fecha ao salvar", n.fechados() === 1 && !corpo());

  secao("app: dialogo da etapa (editar)");
  const historico: Registro[] = [
    {
      id: "r1",
      alvo: "air",
      projeto: "p1",
      quando: new Date(2026, 9, 4, 10).getTime(),
      por: "carla",
      nome: "Carla Dias",
      campo: "fim",
      antes: "2026-09-25",
      depois: "2026-10-02",
      atualizadoEm: 1,
      dispositivo: "d",
    },
    {
      id: "r0",
      alvo: "air",
      projeto: "p1",
      quando: new Date(2026, 7, 28).getTime(),
      por: "ana",
      nome: HOSTIL,
      campo: "criacao",
      depois: "x",
      atualizadoEm: 1,
      dispositivo: "d",
    },
  ];
  let excluiu = 0;
  const e = cena({
    etapa: air,
    historico: async () => historico,
    secaoAberta: "historico",
    conferirDocumento: async (num) => (num === "1240001" ? { numero: num, protocolo: "50300.001234/2026-11" } : null),
    excluir: async () => {
      excluiu += 1;
    },
  });
  await tique();
  const ce = () => e.doc.querySelector(".prj-form-etapa") as HTMLElement;
  checar("campos preenchidos", ce().querySelector<HTMLInputElement>("input[name='nome']")?.value === "Relatório de AIR");
  checar("dias uteis da etapa", texto(ce().querySelector(".prj-uteis")) === "23 dias úteis");
  checar("chip da dependencia", texto(ce().querySelector(".prj-chip-x")) === "Nota técnica");
  checar(
    "resumos preenchidos",
    texto(ce().querySelector(".prj-sec[data-secao='checklist'] .prj-sec-res")) === "1 de 2 feitos" &&
      texto(ce().querySelector(".prj-sec[data-secao='medida'] .prj-sec-res")) === "pelo checklist",
  );
  const hist = ce().querySelector(".prj-sec[data-secao='historico']")!;
  checar(
    "historico aberto com o resumo da tela 2",
    hist.classList.contains("prj-sec-aberta") && texto(hist.querySelector(".prj-sec-res")) === "Carla Dias alterou o término há 2 dias",
  );
  checar(
    "linhas do historico; nome hostil como texto",
    texto(hist.querySelector(".prj-hist div")) === "Carla Dias · 04/10 · término 25/09 → 02/10" &&
      texto(hist).includes(`${HOSTIL} · 28/08 · criou a etapa`) &&
      !hist.querySelector("img"),
  );
  checar("dependencia nao oferece a propria etapa", !opcoesDoCombo(ce(), "Adicionar dependência").includes("air"));
  digitar(ce().querySelector("input[name='documento']"), "1240001");
  await tique();
  checar("conferencia do numero SEI", texto(ce().querySelector(".prj-docok")) === "Documento encontrado no processo 50300.001234/2026-11");
  digitar(ce().querySelector("input[name='documento']"), "999");
  await tique();
  checar("numero nao encontrado", texto(ce().querySelector(".prj-docok")) === "Não encontrado no SEI: confira o número.");
  e.t.recusar = ["Dependência circular: “Relatório de AIR” → “Nota técnica” → “Relatório de AIR”."];
  botao(ce(), "Salvar")!.click();
  await tique();
  checar(
    "erro do repositorio aparece e o dialogo fica",
    texto(ce().querySelector(".prj-erros")).startsWith("Dependência circular") && !!ce(),
  );
  checar(
    "processo: sem escolha, herda o do projeto",
    combo(ce(), "Processo da etapa")?.textContent?.includes("processo do projeto") === true,
  );
  botao(ce(), "Excluir")!.click();
  await tique();
  checar("excluir fecha e chama", excluiu === 1 && !ce());
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dialogos/etapa'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/dialogos/campos.ts`:

```ts
/**
 * Peças dos formulários (tela 2): campo com rótulo, linha de campos, seção
 * recolhida com resumo à direita, caixa de erros e o campo de processo SEI
 * (seletor com os processos da caixa e qualquer número digitado).
 */

import { normalizarTexto } from "@comum/texto";
import { type Combo, criarCombo, type OpcaoCombo } from "@comum/ui/combobox";
import { h, icone } from "@comum/ui/dom";
import type { Vinculo } from "../../modelo/tipos";
import type { DocumentoConferido, ProcessoDaCaixa } from "../../ponte/tipos";

type Filho = Node | string | null | undefined | false;

export function campo(rotulo: string, controle: Node, o: { opcional?: string; dica?: string; classe?: string } = {}): HTMLElement {
  return h(
    "div",
    { class: `prj-campo${o.classe ? ` ${o.classe}` : ""}` },
    h("span", { class: "prj-rotulo" }, rotulo, o.opcional ? h("span", { class: "prj-opcional" }, ` ${o.opcional}`) : null),
    controle,
    o.dica ? h("div", { class: "prj-dica" }, o.dica) : null,
  );
}

export function linhaDeCampos(...filhos: Filho[]): HTMLElement {
  return h("div", { class: "prj-linha" }, ...filhos);
}

export interface Secao {
  el: HTMLElement;
  /** Recalcula o resumo à direita. */
  resumir(): void;
  abrir(): void;
}

/** Seção recolhida (tela 2): botão com ícone, título e resumo; o conteúdo aparece ao abrir. */
export function secao(id: string, ic: Element, titulo: string, resumo: () => string, conteudo: HTMLElement, aberta = false): Secao {
  const res = h("span", { class: "prj-sec-res" });
  const botao = h(
    "button",
    { type: "button", "aria-expanded": String(aberta) },
    h("span", { class: "prj-sec-seta" }, icone("chevron", 14)),
    ic,
    h("span", { class: "prj-sec-tit" }, titulo),
    res,
  );
  const el = h(
    "div",
    { class: `prj-sec${aberta ? " prj-sec-aberta" : ""}`, "data-secao": id },
    botao,
    h("div", { class: "prj-sec-conteudo" }, conteudo),
  );
  const alternar = (abrir: boolean) => {
    el.classList.toggle("prj-sec-aberta", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
  };
  botao.addEventListener("click", () => alternar(!el.classList.contains("prj-sec-aberta")));
  const resumir = () => {
    res.textContent = resumo();
  };
  resumir();
  return { el, resumir, abrir: () => alternar(true) };
}

export function caixaDeErros(): { el: HTMLElement; mostrar(m: readonly string[]): void } {
  const el = h("div", { class: "prj-erros", role: "alert", hidden: true });
  return {
    el,
    mostrar(m) {
      el.replaceChildren(...m.map((t) => h("div", {}, t)));
      el.hidden = !m.length;
    },
  };
}

/** Mensagens de um erro do repositório (ErroValidacao) ou de qualquer outro. */
export function mensagensDoErro(e: unknown): string[] {
  const m = (e as { mensagens?: unknown })?.mensagens;
  if (Array.isArray(m) && m.length) return m.map(String);
  return [`Não foi possível salvar: ${e instanceof Error ? e.message : String(e)}`];
}

const VALOR_DIGITADO = "digitado:";

/** Só os dígitos e a pontuação do número do processo; nada além de 40 caracteres. */
const protocoloLimpo = (t: string): string => t.replace(/[^\d./-]/g, "").slice(0, 40);

export interface CampoProcesso {
  combo: Combo;
  /** O vínculo escolhido; undefined = nenhum (no da etapa: herda o do projeto). */
  vinculo(): Vinculo | undefined;
}

/**
 * Seletor de processo: os da caixa (carregados quando chegam) e qualquer
 * número digitado ("Criar"). Processo sigiloso da caixa vem marcado; número
 * digitado que é de um processo da caixa herda os dados dele.
 */
export function campoProcesso(o: {
  rotulo: string;
  atual?: Vinculo;
  vazio: string;
  processos: () => Promise<ProcessoDaCaixa[]>;
  aoMudar?: () => void;
}): CampoProcesso {
  let caixa: ProcessoDaCaixa[] = [];
  const digitados = new Map<string, Vinculo>();
  const opcoes = (): OpcaoCombo[] => {
    const lista: OpcaoCombo[] = [{ valor: "", rotulo: o.vazio }];
    if (o.atual?.protocolo && !caixa.some((p) => p.protocolo === o.atual?.protocolo))
      lista.push({ valor: o.atual.protocolo, rotulo: o.atual.protocolo, icone: o.atual.sigiloso ? "cadeado" : "pasta" });
    for (const p of caixa)
      lista.push({
        valor: p.protocolo,
        rotulo: p.protocolo,
        descricao: p.sigiloso ? "Sigiloso" : [p.tipo, p.especificacao].filter(Boolean).join(" · ") || undefined,
        icone: p.sigiloso ? "cadeado" : "pasta",
      });
    for (const [valor, v] of digitados) lista.push({ valor, rotulo: v.protocolo, icone: "pasta" });
    return lista;
  };
  const combo = criarCombo({
    rotulo: o.rotulo,
    opcoes,
    valor: [o.atual?.protocolo ?? ""],
    vazio: o.vazio,
    icone: "pasta",
    busca: true,
    larguraLista: 320,
    criar: (texto) => {
      const protocolo = protocoloLimpo(texto);
      if (!protocolo) return null;
      const daCaixa = caixa.find((p) => normalizarTexto(p.protocolo) === normalizarTexto(protocolo));
      if (daCaixa) return { valor: daCaixa.protocolo, rotulo: daCaixa.protocolo };
      digitados.set(`${VALOR_DIGITADO}${protocolo}`, { protocolo });
      return { valor: `${VALOR_DIGITADO}${protocolo}`, rotulo: protocolo };
    },
    rotuloCriar: (t) => `Usar o número “${protocoloLimpo(t)}”`,
    aoMudar: () => o.aoMudar?.(),
  });
  void o
    .processos()
    .then((lista) => {
      caixa = lista;
      combo.atualizar();
    })
    .catch(() => undefined);
  return {
    combo,
    vinculo() {
      const v = combo.valor()[0] ?? "";
      if (!v) return undefined;
      const digitado = digitados.get(v);
      if (digitado) return digitado;
      const p = caixa.find((x) => x.protocolo === v);
      if (p) return { protocolo: p.protocolo, idProcedimento: p.idProcedimento, ...(p.sigiloso ? { sigiloso: true } : {}) };
      return o.atual?.protocolo === v ? o.atual : { protocolo: v };
    },
  };
}

/** Campo do número SEI com a conferência pela pesquisa rápida (sem abrir a árvore). */
export function campoDocumento(
  valor: string,
  conferir?: (numero: string) => Promise<DocumentoConferido | null>,
  aoMudar?: () => void,
): { el: HTMLElement; numero(): string } {
  const input = h("input", {
    type: "text",
    class: "spro-campo",
    name: "documento",
    inputmode: "numeric",
    placeholder: "Número SEI",
    maxlength: "30",
    value: valor,
  });
  const ok = h("div", { class: "prj-docok", hidden: true });
  const numero = () => input.value.replace(/\D/g, "");
  let pedido = 0;
  input.addEventListener("change", () => {
    aoMudar?.();
    const n = numero();
    const meu = ++pedido;
    if (!n || !conferir) {
      ok.hidden = true;
      return;
    }
    void conferir(n)
      .then((r) => {
        if (meu !== pedido) return;
        ok.hidden = false;
        ok.classList.toggle("prj-docok-falta", !r);
        ok.replaceChildren(
          ...(r
            ? [icone("check", 14), r.protocolo ? `Documento encontrado no processo ${r.protocolo}` : "Documento encontrado no SEI"]
            : [icone("alerta", 14), "Não encontrado no SEI: confira o número."]),
        );
      })
      .catch(() => {
        if (meu === pedido) ok.hidden = true;
      });
  });
  return { el: h("div", {}, input, ok), numero };
}
```

Arquivo completo `projetos/src/app/dialogos/etapa.ts`:

```ts
/**
 * Diálogo da etapa (tela 2): o essencial à mostra (nome, datas e dias úteis,
 * marco, responsável, fase, "Depende de") e o resto em seções recolhidas com
 * o resumo ao lado (checklist, processo e documento, etiquetas, observações,
 * como medir o progresso, histórico). Datas são conferidas aqui antes de ir ao
 * modelo (data impossível ou fora de 2000 a 2100 não passa); o resto da regra
 * (ciclo de dependência, limites) volta do repositório como `ErroValidacao`.
 */

import { hojeISO } from "@comum/datas/dias";
import { novoId } from "@comum/id";
import { normalizarTexto } from "@comum/texto";
import { criarCombo, type OpcaoCombo } from "@comum/ui/combobox";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import { duracaoUteis } from "../../modelo/calendario";
import { LIMITES } from "../../modelo/constantes";
import { chaveResponsavel } from "../../modelo/filtro";
import type { DataISO, DocumentoSei, Etapa, ItemChecklist, Medida, Registro, Responsavel, Vinculo } from "../../modelo/tipos";
import type { DocumentoConferido, ProcessoDaCaixa, UsuarioDaUnidade } from "../../ponte/tipos";
import type { ProjetoNaTela } from "../dados";
import { dataCurta, dataDeFormulario, resumoDoUltimoRegistro, textoDiasUteis, textoDoRegistro } from "../formato";
import { iconeProjetos } from "../icones";
import { caixaDeErros, campo, campoDocumento, campoProcesso, linhaDeCampos, mensagensDoErro, secao } from "./campos";

export interface ResultadoEtapa {
  nome: string;
  inicio: DataISO;
  fim: DataISO;
  marco: boolean;
  responsavel?: Responsavel;
  /** Id de fase existente (ausente = sem fase, ou fase nova em `novaFase`). */
  fase?: string;
  /** Nome da fase criada no combo (o app cria ao salvar). */
  novaFase?: string;
  dependeDe: string[];
  checklist: ItemChecklist[];
  /** Ausente = herda o processo do projeto. */
  processo?: Vinculo;
  documento?: DocumentoSei;
  etiquetas: string[];
  observacoes?: string;
  medida: Medida;
}

export interface ContextoDialogoEtapa {
  abrirModal: AbrirModal;
  projeto: ProjetoNaTela;
  /** Etapa sendo editada; ausente = etapa nova. */
  etapa?: Etapa;
  /** Datas da etapa nova ("+ Etapa"). */
  inicial?: { inicio: DataISO; fim: DataISO };
  hoje: DataISO;
  agora: number;
  usuarios(): Promise<UsuarioDaUnidade[]>;
  processos(): Promise<ProcessoDaCaixa[]>;
  /** Etiquetas já usadas no escopo (sugestões). */
  etiquetas: readonly string[];
  historico?: () => Promise<Registro[]>;
  conferirDocumento?: (numero: string) => Promise<DocumentoConferido | null>;
  /** Abre com uma seção aberta ("Histórico" pelo menu do balão). */
  secaoAberta?: "historico";
  salvar(r: ResultadoEtapa): Promise<void>;
  excluir?: () => Promise<void>;
}

const MEDIDAS: ReadonlyArray<[Medida, string, string]> = [
  ["manual", "Eu informo", "eu informo"],
  ["tempo", "Pelo tempo decorrido", "pelo tempo"],
  ["checklist", "Pelo checklist", "pelo checklist"],
];

const NOVA_FASE = "nova:";

export function abrirDialogoEtapa(c: ContextoDialogoEtapa): { fechar(): void } {
  const e = c.etapa;
  const doProjeto = c.projeto.etapas;
  const erros = caixaDeErros();

  // ---------- essenciais ----------
  const nome = h("input", { type: "text", class: "spro-campo", name: "nome", maxlength: String(LIMITES.nome), value: e?.nome ?? "" });
  const inicio = h("input", { type: "date", class: "spro-campo", name: "inicio", value: e?.inicio ?? c.inicial?.inicio ?? c.hoje });
  const fim = h("input", { type: "date", class: "spro-campo", name: "fim", value: e?.fim ?? c.inicial?.fim ?? c.hoje });
  const marco = h("input", { type: "checkbox", name: "marco", checked: !!e?.marco });
  const uteis = h("span", { class: "prj-uteis" });
  const campoFim = campo("Término", fim, { classe: "prj-campo-fim" });
  const pintarDatas = () => {
    const i = dataDeFormulario(inicio.value);
    const f = dataDeFormulario(fim.value);
    uteis.replaceChildren(icone("relogio", 14), i && f && f >= i ? textoDiasUteis(duracaoUteis(i, f)) : "—");
    campoFim.hidden = marco.checked;
    uteis.hidden = marco.checked;
  };
  for (const x of [inicio, fim]) x.addEventListener("input", pintarDatas);
  marco.addEventListener("change", pintarDatas);
  pintarDatas();

  // Responsável: usuários da unidade (pela aba) primeiro, depois os já usados no projeto, e texto livre.
  const pessoas = new Map<string, Responsavel>();
  const guardar = (r: Responsavel) => {
    const k = chaveResponsavel(r);
    if (!pessoas.has(k)) pessoas.set(k, r);
  };
  let daUnidade: UsuarioDaUnidade[] = [];
  const opcoesResp = (): OpcaoCombo[] => {
    const ordem: Responsavel[] = [
      ...daUnidade.map((u) => (u.login ? { login: u.login, nome: u.nome } : { nome: u.nome })),
      ...doProjeto.flatMap((x) => (x.responsavel ? [x.responsavel] : [])),
      ...pessoas.values(),
    ];
    const saida: OpcaoCombo[] = [{ valor: "", rotulo: "Sem responsável" }];
    const vistos = new Set<string>();
    for (const r of ordem) {
      const k = chaveResponsavel(r);
      if (vistos.has(k)) continue;
      vistos.add(k);
      guardar(r);
      saida.push({ valor: k, rotulo: r.nome, descricao: r.login });
    }
    return saida;
  };
  if (e?.responsavel) guardar(e.responsavel);
  const responsavel = criarCombo({
    rotulo: "Responsável",
    opcoes: opcoesResp,
    valor: [e?.responsavel ? chaveResponsavel(e.responsavel) : ""],
    vazio: "Sem responsável",
    icone: "pessoa",
    busca: true,
    criar: (texto) => {
      const r = { nome: texto.trim().slice(0, LIMITES.nome) };
      if (!r.nome) return null;
      guardar(r);
      return { valor: chaveResponsavel(r), rotulo: r.nome };
    },
    rotuloCriar: (t) => `Usar “${t.trim()}”`,
  });
  void c
    .usuarios()
    .then((lista) => {
      daUnidade = lista;
      responsavel.atualizar();
    })
    .catch(() => undefined);

  // Fase: combo que cria (a fase nova só nasce ao salvar).
  const fases: OpcaoCombo[] = [{ valor: "", rotulo: "Sem fase" }, ...c.projeto.fases.map((f) => ({ valor: f.id, rotulo: f.nome }))];
  const fase = criarCombo({
    rotulo: "Fase",
    opcoes: () => fases,
    valor: [e?.fase && c.projeto.fases.some((f) => f.id === e.fase) ? e.fase : ""],
    vazio: "Sem fase",
    icone: "camadas",
    busca: true,
    criar: (texto) => {
      const t = texto.trim().slice(0, LIMITES.nome);
      if (!t) return null;
      const igual = fases.find((f) => normalizarTexto(f.rotulo) === normalizarTexto(t));
      if (igual) return igual;
      const nova = { valor: `${NOVA_FASE}${t}`, rotulo: t };
      fases.push(nova);
      return nova;
    },
    rotuloCriar: (t) => `Criar a fase “${t.trim()}”`,
  });

  // Depende de: chips + "Adicionar…".
  let deps = [...(e?.dependeDe ?? [])].filter((d) => doProjeto.some((x) => x.id === d));
  const nomeDe = (id: string) => doProjeto.find((x) => x.id === id)?.nome ?? id;
  const chips = h("div", { class: "prj-chips-x" });
  const adicionar = criarCombo({
    rotulo: "Adicionar dependência",
    opcoes: () => doProjeto.filter((x) => x.id !== e?.id && !deps.includes(x.id)).map((x) => ({ valor: x.id, rotulo: x.nome })),
    vazio: "Adicionar…",
    busca: true,
    classe: "spro-combo-compacto",
    aoMudar: (v) => {
      const id = v[0];
      if (id && !deps.includes(id)) deps = [...deps, id];
      adicionar.definir([]);
      pintarDeps();
    },
  });
  const pintarDeps = () => {
    chips.replaceChildren(
      ...deps.map((id) =>
        h(
          "span",
          { class: "prj-chip-x" },
          nomeDe(id),
          h(
            "button",
            {
              type: "button",
              class: "spro-botao-icone pequeno",
              "aria-label": `Tirar “${nomeDe(id)}”`,
              onclick: () => {
                deps = deps.filter((d) => d !== id);
                pintarDeps();
              },
            },
            icone("fechar", 12),
          ),
        ),
      ),
      adicionar.el,
    );
  };
  pintarDeps();

  // ---------- seções ----------
  let itens: ItemChecklist[] = (e?.checklist ?? []).map((i) => ({ ...i }));
  const lista = h("div", { class: "prj-checklist" });
  const novoItem = h("input", {
    type: "text",
    class: "spro-campo",
    placeholder: "Adicionar item (Enter)",
    maxlength: String(LIMITES.checklistTexto),
  });
  const secChecklist = secao(
    "checklist",
    iconeProjetos("checklist", 16),
    "Checklist",
    () => (itens.length ? `${itens.filter((i) => i.feito).length} de ${itens.length} feitos` : "nenhum"),
    h("div", { class: "prj-sec-pilha" }, lista, novoItem),
  );
  const pintarItens = () => {
    lista.replaceChildren(
      ...itens.map((it) => {
        const caixa = h("input", { type: "checkbox", checked: it.feito, "aria-label": it.texto });
        caixa.addEventListener("change", () => {
          it.feito = caixa.checked;
          pintarItens();
        });
        return h(
          "div",
          { class: `prj-item${it.feito ? " prj-feito" : ""}` },
          caixa,
          h("span", {}, it.texto),
          h(
            "button",
            {
              type: "button",
              class: "spro-botao-icone pequeno",
              "aria-label": `Tirar “${it.texto}”`,
              onclick: () => {
                itens = itens.filter((x) => x !== it);
                pintarItens();
              },
            },
            icone("fechar", 12),
          ),
        );
      }),
    );
    secChecklist.resumir();
  };
  novoItem.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key !== "Enter") return;
    ev.preventDefault();
    const t = novoItem.value.trim();
    if (!t || itens.length >= LIMITES.checklistItens) return;
    itens = [...itens, { id: novoId(), texto: t, feito: false }];
    novoItem.value = "";
    pintarItens();
  });

  const doProjetoProc = c.projeto.projeto.processo;
  const proc = campoProcesso({
    rotulo: "Processo da etapa",
    atual: e?.processo,
    vazio: doProjetoProc?.protocolo ? "O processo do projeto" : "Sem processo",
    processos: c.processos,
    aoMudar: () => secProc.resumir(),
  });
  const documento = campoDocumento(e?.documento?.numero ?? "", c.conferirDocumento, () => secProc.resumir());
  const numeroDoc = () => documento.numero();
  const secProc = secao(
    "processo",
    icone("documento", 16),
    "Processo e documento",
    () => {
      const v = proc.vinculo() ?? doProjetoProc;
      const n = numeroDoc();
      return `${v?.protocolo || "sem processo"} · ${n ? `SEI ${n}` : "sem documento"}`;
    },
    h(
      "div",
      { class: "prj-sec-pilha" },
      campo("Processo", proc.combo.el, { dica: "Por padrão, o processo do projeto." }),
      campo("Documento relacionado", documento.el, { opcional: "(número SEI)" }),
    ),
  );

  const etiquetasBase = [...new Set([...c.etiquetas, ...(e?.etiquetas ?? [])])];
  const etiquetas = criarCombo({
    rotulo: "Etiquetas da etapa",
    opcoes: () => etiquetasBase.map((t) => ({ valor: t, rotulo: t })),
    valor: e?.etiquetas ?? [],
    multiplo: true,
    vazio: "Escolher ou criar etiqueta…",
    icone: "etiqueta",
    criar: (texto) => {
      const t = texto.trim().slice(0, LIMITES.etiquetaTexto);
      if (!t) return null;
      if (!etiquetasBase.includes(t)) etiquetasBase.push(t);
      return { valor: t, rotulo: t };
    },
    aoMudar: () => secEtiquetas.resumir(),
  });
  const secEtiquetas = secao(
    "etiquetas",
    icone("etiqueta", 16),
    "Etiquetas",
    () => etiquetas.valor().join(", ") || "nenhuma",
    etiquetas.el,
  );

  const obs = h("textarea", {
    class: "spro-campo",
    rows: "3",
    placeholder: "Anotações livres sobre a etapa",
    maxlength: String(LIMITES.observacoes),
    value: e?.observacoes ?? "",
  });
  const secObs = secao(
    "observacoes",
    icone("nota", 16),
    "Observações",
    () => {
      const t = obs.value.trim();
      return t ? (t.length > 40 ? `${t.slice(0, 40)}…` : t) : "—";
    },
    obs,
  );
  obs.addEventListener("input", () => secObs.resumir());

  let medida: Medida = e?.medida ?? "manual";
  const botoesMedida = MEDIDAS.map(([valor, rotulo]) =>
    h(
      "button",
      {
        type: "button",
        "aria-pressed": String(valor === medida),
        onclick: () => {
          medida = valor;
          for (const [i, b] of botoesMedida.entries()) b.setAttribute("aria-pressed", String(MEDIDAS[i]?.[0] === medida));
          secMedida.resumir();
        },
      },
      rotulo,
    ),
  );
  const secMedida = secao(
    "medida",
    iconeProjetos("progresso", 16),
    "Como medir o progresso",
    () => MEDIDAS.find(([v]) => v === medida)?.[2] ?? "",
    h(
      "div",
      { class: "prj-sec-pilha" },
      h("div", { class: "spro-segmentado" }, ...botoesMedida),
      h(
        "div",
        { class: "prj-dica" },
        "“Eu informo” usa a régua do balão. “Pelo tempo” vai de 0% no início a 100% no término (o legado chamava de automático).",
      ),
    ),
  );

  let registros: Registro[] = [];
  const listaHist = h("div", { class: "prj-hist" }, h("div", { class: "prj-dica" }, "Carregando…"));
  const secHist = e
    ? secao(
        "historico",
        icone("historico", 16),
        "Histórico",
        () => (registros[0] ? resumoDoUltimoRegistro(registros[0], c.agora) : "—"),
        listaHist,
        c.secaoAberta === "historico",
      )
    : null;
  if (e && c.historico)
    void c
      .historico()
      .then((todos) => {
        registros = todos.filter((r) => r.alvo === e.id);
        listaHist.replaceChildren(
          ...(registros.length
            ? registros.map((r) =>
                h(
                  "div",
                  {},
                  h("b", {}, r.nome || r.por || "Alguém"),
                  ` · ${dataCurta(hojeISO(new Date(r.quando)))} · ${textoDoRegistro(r, "etapa")}`,
                ),
              )
            : [h("div", { class: "prj-dica" }, "Nenhuma alteração registrada.")]),
        );
        secHist?.resumir();
      })
      .catch(() => listaHist.replaceChildren(h("div", { class: "prj-dica" }, "Não foi possível ler o histórico.")));

  // ---------- salvar ----------
  const validar = (): string[] => {
    const m: string[] = [];
    if (!nome.value.trim()) m.push("Informe o nome da etapa.");
    const i = dataDeFormulario(inicio.value);
    const f = marco.checked ? i : dataDeFormulario(fim.value);
    if (!i) m.push("Informe uma data de início válida (entre 2000 e 2100).");
    if (!marco.checked && !f) m.push("Informe uma data de término válida (entre 2000 e 2100).");
    if (i && f && f < i) m.push("O término não pode ser antes do início.");
    return m;
  };
  const resultado = (): ResultadoEtapa => {
    const i = dataDeFormulario(inicio.value)!;
    const valorFase = fase.valor()[0] ?? "";
    const chaveResp = responsavel.valor()[0] ?? "";
    const n = numeroDoc();
    const r: ResultadoEtapa = {
      nome: nome.value.trim(),
      inicio: i,
      fim: marco.checked ? i : dataDeFormulario(fim.value)!,
      marco: marco.checked,
      dependeDe: deps,
      checklist: itens,
      etiquetas: etiquetas.valor(),
      medida,
    };
    if (chaveResp) r.responsavel = pessoas.get(chaveResp);
    if (valorFase.startsWith(NOVA_FASE)) r.novaFase = valorFase.slice(NOVA_FASE.length);
    else if (valorFase) r.fase = valorFase;
    const v = proc.vinculo();
    if (v) r.processo = v;
    if (n) r.documento = n === e?.documento?.numero ? e.documento : { numero: n };
    if (obs.value.trim()) r.observacoes = obs.value.trim();
    return r;
  };
  let modal: { fechar(): void } | null = null;
  const salvar = h("button", { type: "button", class: "spro-botao primario" }, "Salvar");
  salvar.addEventListener("click", async () => {
    const m = validar();
    erros.mostrar(m);
    if (m.length) return;
    salvar.disabled = true;
    try {
      await c.salvar(resultado());
      modal?.fechar();
    } catch (erro) {
      erros.mostrar(mensagensDoErro(erro));
    } finally {
      salvar.disabled = false;
    }
  });
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-etapa" },
    campo("Nome", nome),
    linhaDeCampos(campo("Início", inicio), campoFim, uteis),
    h("label", { class: "prj-check" }, marco, "É um marco (uma data só, como “Publicação no DOU”)"),
    linhaDeCampos(campo("Responsável", responsavel.el), campo("Fase", fase.el)),
    campo("Depende de", chips, { opcional: "(só começa depois destas)" }),
    h("div", { class: "prj-secoes" }, secChecklist.el, secProc.el, secEtiquetas.el, secObs.el, secMedida.el, secHist?.el ?? null),
    erros.el,
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      e && c.excluir
        ? h(
            "button",
            {
              type: "button",
              class: "spro-botao fantasma perigo spro-esquerda",
              onclick: () => {
                modal?.fechar();
                void c.excluir?.();
              },
            },
            icone("lixeira", 15),
            "Excluir",
          )
        : null,
      h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
      salvar,
    ),
  );
  pintarItens();
  modal = c.abrirModal({ titulo: "Etapa", icone: "calendario", conteudo });
  return { fechar: () => modal?.fechar() };
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `550 ok, 0 falha(s)` (+27 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/dialogos/campos.ts \
  projetos/src/app/dialogos/etapa.ts \
  projetos/tests/verificar-app-etapa.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: dialogo da etapa com secoes recolhidas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 9: Projetos — diálogo do projeto (novo/editar, modelos) e diálogos de apoio

**Files:**
- Create: `projetos/src/app/dialogos/projeto.ts`, `projetos/src/app/dialogos/apoio.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-projeto.ts`

**Interfaces:**
- Consumes: `campo`, `campoProcesso`, `campoDocumento`, `caixaDeErros`, `linhaDeCampos`, `mensagensDoErro` (T8); `ProjetoNaTela`, `ModeloNaTela` (T2); `dataDeFormulario`, `dataCurta`, `dataLonga`, `plural` (T2); `previaDoModelo`, `MODELOS_EMBUTIDOS`, `LIMITES`, `ErroValidacao` (P2); `criarMenu`, `criarCombo` (sei-comum).
- Produces: `ResultadoProjeto { nome; processo?; vis; modelo?: { modelo; inicio } }`, `ContextoDialogoProjeto { abrirModal; hoje; sigla; projeto?; modelos; comecarDeModelo?; processos(); salvar(r); arquivar?; reativar?; duplicar?; salvarComoModelo?; excluir? }`, `abrirDialogoProjeto(c)` ("Novo projeto"/"Editar projeto"; menu "Mais ações do projeto"); `abrirArquivados({ abrirModal; arquivados; reativar(id); excluir(id) })`, `abrirInformarDocumento({ abrirModal; etapa; hoje; conferirDocumento?; salvar(numero | undefined, concluidaEm) })`, `pedirNomeDoModelo({ abrirModal; sugestao; salvar(nome) })`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-projeto.ts`:

```ts
import type { AbrirModal } from "@comum/ui/dialogo";
import type { ProjetoNaTela } from "../src/app/dados";
import { abrirArquivados, abrirInformarDocumento, pedirNomeDoModelo } from "../src/app/dialogos/apoio";
import { abrirDialogoProjeto, type ContextoDialogoProjeto, type ResultadoProjeto } from "../src/app/dialogos/projeto";
import { resumoDoProjeto } from "../src/modelo/resumo";
import { ErroValidacao } from "../src/modelo/validacao";
import { MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import { digitar, escolherCombo, itemDoMenu, itensDoMenu, marcar, opcoesDoCombo, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { etapa, HOJE, projeto } from "./fabrica";
import { botao, checar, secao, tique } from "./util";

function modais(doc: Document) {
  const titulos: string[] = [];
  const abrirModal: AbrirModal = (o) => {
    titulos.push(o.titulo);
    doc.body.append(o.conteudo);
    return {
      fechar: () => {
        o.conteudo.remove();
        o.aoFechar?.();
      },
    };
  };
  return { abrirModal, titulos };
}

const p1: ProjetoNaTela = {
  projeto: projeto({ id: "p1", nome: HOSTIL, processo: { protocolo: "50300.001234/2026-11", idProcedimento: "77" } }),
  vis: "unidade",
  fases: [],
  etapas: [etapa({ id: "e1" })],
  resumo: resumoDoProjeto([etapa({ id: "e1" })], HOJE),
};

export async function verificarAppProjeto(): Promise<void> {
  secao("app: novo projeto (em branco e de um modelo)");
  const doc = telaDoApp();
  const m = modais(doc);
  const salvos: ResultadoProjeto[] = [];
  let recusar: string[] | null = null;
  const base: ContextoDialogoProjeto = {
    abrirModal: m.abrirModal,
    hoje: HOJE,
    sigla: "TESTE",
    modelos: MODELOS_EMBUTIDOS,
    processos: async () => [
      { protocolo: "50300.004410/2026-02", idProcedimento: "44", tipo: "Licitação", especificacao: "Notebooks", sigiloso: false },
    ],
    salvar: async (r) => {
      if (recusar) throw new ErroValidacao(recusar);
      salvos.push(r);
    },
  };
  abrirDialogoProjeto(base);
  await tique();
  const f = () => doc.querySelector(".prj-form-projeto") as HTMLElement;
  checar("titulo e campos", m.titulos.at(-1) === "Novo projeto" && !!f().querySelector("input[name='nome']"));
  const cartoes = [...f().querySelectorAll(".prj-opcao")].map((c) => texto(c));
  checar(
    "Quem ve em cartoes com a sigla e a explicacao",
    cartoes[0] === "Toda a unidade (TESTE) Quem usa o SEI Pro na TESTE vê e edita. Fica no Texto Padrão da unidade." &&
      cartoes[1] === "Só eu Aparece só para você, nesta unidade. Dá para mudar depois.",
    cartoes,
  );
  checar(
    "comeca em branco (sem o bloco do modelo)",
    botao(f(), "Em branco")?.getAttribute("aria-pressed") === "true" && (f().querySelector(".prj-bloco-modelo") as HTMLElement).hidden,
  );
  botao(f(), "Criar projeto")!.click();
  await tique();
  checar("nome obrigatorio", texto(f().querySelector(".prj-erros")) === "Informe o nome do projeto." && !salvos.length);
  digitar(f().querySelector("input[name='nome']"), "  Pregão de notebooks ");
  escolherCombo(f(), "Processo SEI", "50300.004410/2026-02");
  marcar(f().querySelector("input[value='eu']"));
  botao(f(), "Criar projeto")!.click();
  await tique();
  checar(
    "em branco: nome, processo da caixa e Só eu",
    salvos[0]?.nome === "Pregão de notebooks" &&
      salvos[0]?.processo?.idProcedimento === "44" &&
      salvos[0]?.vis === "eu" &&
      !salvos[0]?.modelo,
    salvos[0],
  );
  checar("fecha ao criar", !f());

  abrirDialogoProjeto({ ...base, comecarDeModelo: true });
  await tique();
  checar(
    "pelo 'Comecar de um modelo': ja no modelo",
    botao(f(), "De um modelo")?.getAttribute("aria-pressed") === "true" && !(f().querySelector(".prj-bloco-modelo") as HTMLElement).hidden,
  );
  checar("modelos embutidos no seletor", opcoesDoCombo(f(), "Modelo").join() === MODELOS_EMBUTIDOS.map((x) => x.id).join());
  escolherCombo(f(), "Modelo", MODELOS_EMBUTIDOS[0]!.id);
  digitar(f().querySelector("input[name='comeca']"), "2026-08-03");
  const previa = texto(f().querySelector(".prj-previa"));
  checar(
    "previa: 9 etapas em 3 fases, termino e as 3 primeiras (tela 2)",
    previa.startsWith("9 etapas em 3 fases · datas em dias úteis, pulando feriados termina em 10/12/2026") &&
      previa.includes("Nota técnica preliminar 03/08 → 21/08") &&
      previa.includes("Análise jurídica 24/08 → 11/09") &&
      previa.endsWith("… e mais 6 etapas"),
    previa,
  );
  digitar(f().querySelector("input[name='comeca']"), "2026-13-40");
  checar("data invalida: a previa avisa", texto(f().querySelector(".prj-previa")) === "Informe uma data válida (entre 2000 e 2100).");
  digitar(f().querySelector("input[name='comeca']"), "2026-08-03");
  digitar(f().querySelector("input[name='nome']"), "Revisão da Resolução nº 5.432");
  recusar = ["Limite de 100 projetos ativos em “Toda a unidade”. Arquive ou exclua algum."];
  botao(f(), "Criar projeto")!.click();
  await tique();
  checar("erro do repositorio fica no dialogo", texto(f().querySelector(".prj-erros")).startsWith("Limite de 100") && !!f());
  recusar = null;
  botao(f(), "Criar projeto")!.click();
  await tique();
  checar(
    "de um modelo: leva o modelo e a data",
    salvos[1]?.modelo?.modelo.id === MODELOS_EMBUTIDOS[0]!.id && salvos[1]?.modelo?.inicio === "2026-08-03" && salvos[1]?.vis === "unidade",
  );

  secao("app: editar projeto");
  const feitos: string[] = [];
  abrirDialogoProjeto({
    ...base,
    projeto: p1,
    arquivar: async () => void feitos.push("arquivar"),
    duplicar: async () => void feitos.push("duplicar"),
    salvarComoModelo: () => void feitos.push("modelo"),
    excluir: async () => void feitos.push("excluir"),
  });
  await tique();
  checar(
    "titulo e nome hostil no campo",
    m.titulos.at(-1) === "Editar projeto" && (f().querySelector("input[name='nome']") as HTMLInputElement).value === HOSTIL,
  );
  checar("sem 'Comecar' ao editar", !botao(f(), "Em branco"));
  checar(
    "acoes no menu do rodape",
    itensDoMenu(f(), "Mais ações do projeto").join("|") === "Arquivar|Duplicar|Salvar como modelo…|Excluir",
  );
  itemDoMenu(f(), "Mais ações do projeto", "Salvar como modelo…");
  checar("salvar como modelo", feitos.join() === "modelo");
  marcar(f().querySelector("input[value='eu']"));
  botao(f(), "Salvar")!.click();
  await tique();
  checar(
    "editar: mudar Quem ve vai no resultado",
    salvos.at(-1)?.vis === "eu" && salvos.at(-1)?.processo?.protocolo === "50300.001234/2026-11",
  );
  abrirDialogoProjeto({
    ...base,
    projeto: { ...p1, projeto: { ...p1.projeto, arquivadoEm: 5 } },
    reativar: async () => void feitos.push("reativar"),
  });
  checar("arquivado: Reativar no lugar de Arquivar", itensDoMenu(f(), "Mais ações do projeto")[0] === "Reativar");
  itemDoMenu(f(), "Mais ações do projeto", "Reativar");
  await tique();
  checar("reativar fecha", feitos.at(-1) === "reativar" && !f());

  secao("app: projetos arquivados");
  const docA = telaDoApp();
  const ma = modais(docA);
  const arq: ProjetoNaTela = { ...p1, projeto: { ...p1.projeto, arquivadoEm: new Date(2026, 8, 30, 12).getTime() } };
  const acoes: string[] = [];
  abrirArquivados({
    abrirModal: ma.abrirModal,
    arquivados: [arq],
    reativar: async (id) => void acoes.push(`reativar:${id}`),
    excluir: async (id) => void acoes.push(`excluir:${id}`),
  });
  const lista = docA.querySelector(".prj-arquivados")!;
  checar(
    "lista com nome (texto) e data",
    texto(lista).includes(HOSTIL) && texto(lista).includes("arquivado em 30/09/2026") && !lista.querySelector("img"),
  );
  botao(lista, "Reativar")!.click();
  await tique();
  checar(
    "reativar tira da lista",
    acoes.join() === "reativar:p1" && texto(docA.querySelector(".prj-arquivados")) === "Nenhum projeto arquivado.",
  );

  secao("app: informar documento e nome do modelo");
  const docD = telaDoApp();
  const md = modais(docD);
  const docs: string[] = [];
  abrirInformarDocumento({
    abrirModal: md.abrirModal,
    etapa: etapa({ id: "x", concluidaEm: "2026-10-06" }),
    hoje: HOJE,
    conferirDocumento: async (n) => ({ numero: n, protocolo: "50300.001234/2026-11" }),
    salvar: async (numero, data) => void docs.push(`${numero}:${data}`),
  });
  checar("titulo da tela 2", md.titulos.at(-1) === "Documento que comprova a conclusão");
  const cd = docD.querySelector(".prj-form-documento")!;
  digitar(cd.querySelector("input[name='documento']"), "1240001");
  await tique();
  checar("conferencia", texto(cd.querySelector(".prj-docok")) === "Documento encontrado no processo 50300.001234/2026-11");
  digitar(cd.querySelector("input[name='concluida']"), "2026-10-05");
  botao(cd, "Salvar")!.click();
  await tique();
  checar("salva numero e data da conclusao", docs.join() === "1240001:2026-10-05" && !docD.querySelector(".prj-form-documento"));
  const nomes: string[] = [];
  pedirNomeDoModelo({ abrirModal: md.abrirModal, sugestao: "Revisão normativa", salvar: async (n) => void nomes.push(n) });
  const cm = docD.querySelector(".prj-form-modelo")!;
  checar("sugere o nome do projeto", (cm.querySelector("input") as HTMLInputElement).value === "Revisão normativa");
  botao(cm, "Salvar modelo")!.click();
  await tique();
  checar("salva o modelo com o nome", nomes.join() === "Revisão normativa");
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppProjeto } from "./verificar-app-projeto";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
await verificarAppProjeto();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dialogos/apoio'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/dialogos/projeto.ts`:

```ts
/**
 * Diálogo "Novo projeto" / "Editar projeto" (tela 2): nome; processo SEI
 * opcional (os da caixa + qualquer número); "Quem vê" em cartões (Toda a
 * unidade | Só eu); e, só no novo, "Começar": Em branco | De um modelo (modelo,
 * "Começa em" e a prévia em dias úteis). No editar, o rodapé ganha o menu com
 * Arquivar/Reativar, Duplicar, Salvar como modelo e Excluir.
 */

import { diferencaDias } from "@comum/datas/dias";
import { criarCombo } from "@comum/ui/combobox";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { criarMenu, type EntradaMenu } from "@comum/ui/menu";
import { LIMITES } from "../../modelo/constantes";
import type { DataISO, Modelo, Vinculo, Vis } from "../../modelo/tipos";
import { previaDoModelo } from "../../modelos/aplicar";
import type { ProcessoDaCaixa } from "../../ponte/tipos";
import type { ModeloNaTela, ProjetoNaTela } from "../dados";
import { dataCurta, dataDeFormulario, dataLonga, plural } from "../formato";
import { caixaDeErros, campo, campoProcesso, linhaDeCampos, mensagensDoErro } from "./campos";

export interface ResultadoProjeto {
  nome: string;
  processo?: Vinculo;
  vis: Vis;
  /** Só no novo, com "De um modelo". */
  modelo?: { modelo: Modelo; inicio: DataISO };
}

export interface ContextoDialogoProjeto {
  abrirModal: AbrirModal;
  hoje: DataISO;
  /** Sigla da unidade ("Toda a unidade (TESTE)"). */
  sigla: string;
  /** Projeto sendo editado; ausente = novo. */
  projeto?: ProjetoNaTela;
  modelos: readonly ModeloNaTela[];
  /** O "Começar de um modelo" do primeiro uso já abre no modelo. */
  comecarDeModelo?: boolean;
  processos(): Promise<ProcessoDaCaixa[]>;
  salvar(r: ResultadoProjeto): Promise<void>;
  arquivar?: () => Promise<void>;
  reativar?: () => Promise<void>;
  duplicar?: () => Promise<void>;
  salvarComoModelo?: () => void;
  excluir?: () => Promise<void>;
}

function cartao(valor: Vis, marcado: boolean, titulo: string, explica: string): HTMLElement {
  return h(
    "label",
    { class: "prj-opcao" },
    h("input", { type: "radio", name: "vis", value: valor, checked: marcado }),
    h("div", {}, h("b", {}, titulo), h("span", {}, ` ${explica}`)),
  );
}

function previa(modelo: Modelo, inicio: DataISO): HTMLElement {
  const p = previaDoModelo(modelo, inicio);
  const ini = p.primeiras.reduce((m, x) => (x.inicio < m ? x.inicio : m), p.primeiras[0]?.inicio ?? inicio);
  const fim = p.primeiras.reduce((m, x) => (x.fim > m ? x.fim : m), p.primeiras[0]?.fim ?? inicio);
  const span = Math.max(1, diferencaDias(ini, fim) + 1);
  const px = (dias: number) => `${Math.round((dias / span) * 120)}px`;
  const resto = p.etapas - p.primeiras.length;
  return h(
    "div",
    { class: "prj-previa" },
    h(
      "div",
      { class: "prj-previa-t" },
      h(
        "span",
        {},
        `${plural(p.etapas, "etapa", "etapas")} em ${plural(p.fases, "fase", "fases")} · datas em dias úteis, pulando feriados`,
      ),
      p.termina ? h("b", {}, ` termina em ${dataLonga(p.termina)}`) : null,
    ),
    ...p.primeiras.map((x) =>
      h(
        "div",
        { class: "prj-previa-e" },
        h("span", {
          class: "prj-previa-barra",
          style: `margin-left:${px(diferencaDias(ini, x.inicio))};width:${px(Math.max(1, diferencaDias(x.inicio, x.fim) + 1))}`,
        }),
        h("span", { class: "prj-previa-nome" }, x.nome),
        h("span", { class: "prj-previa-d" }, ` ${dataCurta(x.inicio)} → ${dataCurta(x.fim)}`),
      ),
    ),
    resto > 0 ? h("div", { class: "prj-previa-e prj-previa-mais" }, `… e mais ${plural(resto, "etapa", "etapas")}`) : null,
  );
}

export function abrirDialogoProjeto(c: ContextoDialogoProjeto): { fechar(): void } {
  const p = c.projeto?.projeto;
  const erros = caixaDeErros();
  const nome = h("input", { type: "text", class: "spro-campo", name: "nome", maxlength: String(LIMITES.nome), value: p?.nome ?? "" });
  const proc = campoProcesso({ rotulo: "Processo SEI", atual: p?.processo, vazio: "Nenhum", processos: c.processos });
  const visAtual: Vis = c.projeto?.vis ?? "unidade";
  const cartoes = h(
    "div",
    { class: "prj-opcoes", role: "radiogroup", "aria-label": "Quem vê" },
    cartao(
      "unidade",
      visAtual === "unidade",
      `Toda a unidade (${c.sigla})`,
      `Quem usa o SEI Pro na ${c.sigla} vê e edita. Fica no Texto Padrão da unidade.`,
    ),
    cartao("eu", visAtual === "eu", "Só eu", "Aparece só para você, nesta unidade. Dá para mudar depois."),
  );
  const visEscolhida = (): Vis => (cartoes.querySelector<HTMLInputElement>("input[value='eu']")?.checked ? "eu" : "unidade");

  // "Começar" (só no novo).
  let deModelo = !p && !!c.comecarDeModelo;
  const modelo = criarCombo({
    rotulo: "Modelo",
    opcoes: () =>
      c.modelos.map((m) => ({
        valor: m.id,
        rotulo: m.nome,
        descricao: `${plural(m.etapas.length, "etapa", "etapas")}${m.descricao ? ` · ${m.descricao}` : ""}`,
      })),
    valor: c.modelos[0] ? [c.modelos[0].id] : [],
    vazio: "Escolher um modelo…",
    busca: c.modelos.length > 7,
    larguraLista: 340,
    aoMudar: () => pintarPrevia(),
  });
  const comeca = h("input", { type: "date", class: "spro-campo", name: "comeca", value: c.hoje });
  const caixaPrevia = h("div", {});
  const modeloEscolhido = () => c.modelos.find((m) => m.id === modelo.valor()[0]);
  const pintarPrevia = () => {
    const m = modeloEscolhido();
    const inicio = dataDeFormulario(comeca.value);
    caixaPrevia.replaceChildren(
      !inicio
        ? h("div", { class: "prj-previa" }, "Informe uma data válida (entre 2000 e 2100).")
        : m
          ? previa(m, inicio)
          : h("div", { class: "prj-previa" }, "Escolha um modelo."),
    );
  };
  comeca.addEventListener("input", pintarPrevia);
  const bloco = h(
    "div",
    { class: "prj-form prj-bloco-modelo", hidden: !deModelo },
    linhaDeCampos(campo("Modelo", modelo.el, { classe: "prj-campo-largo" }), campo("Começa em", comeca)),
    caixaPrevia,
  );
  const botoesComecar = [
    h("button", { type: "button", "aria-pressed": String(!deModelo), onclick: () => comecar(false) }, "Em branco"),
    h("button", { type: "button", "aria-pressed": String(deModelo), onclick: () => comecar(true) }, "De um modelo"),
  ];
  const comecar = (m: boolean) => {
    deModelo = m;
    botoesComecar[0]?.setAttribute("aria-pressed", String(!m));
    botoesComecar[1]?.setAttribute("aria-pressed", String(m));
    bloco.hidden = !m;
  };
  pintarPrevia();

  let modal: { fechar(): void } | null = null;
  const fecharE = (f?: () => unknown) => () => {
    modal?.fechar();
    void f?.();
  };
  const validar = (): string[] => {
    const m: string[] = [];
    if (!nome.value.trim()) m.push("Informe o nome do projeto.");
    if (!p && deModelo) {
      if (!modeloEscolhido()) m.push("Escolha um modelo.");
      if (!dataDeFormulario(comeca.value)) m.push("Informe uma data válida (entre 2000 e 2100).");
    }
    return m;
  };
  const salvar = h("button", { type: "button", class: "spro-botao primario" }, p ? "Salvar" : "Criar projeto");
  salvar.addEventListener("click", async () => {
    const m = validar();
    erros.mostrar(m);
    if (m.length) return;
    const r: ResultadoProjeto = { nome: nome.value.trim(), vis: visEscolhida() };
    const v = proc.vinculo();
    if (v) r.processo = v;
    const md = modeloEscolhido();
    if (!p && deModelo && md) r.modelo = { modelo: md, inicio: dataDeFormulario(comeca.value)! };
    salvar.disabled = true;
    try {
      await c.salvar(r);
      modal?.fechar();
    } catch (e) {
      erros.mostrar(mensagensDoErro(e));
    } finally {
      salvar.disabled = false;
    }
  });
  const menu = p
    ? criarMenu({
        rotulo: "Mais ações do projeto",
        classe: "spro-botao-icone spro-esquerda",
        itens: (): EntradaMenu[] => [
          p.arquivadoEm === undefined
            ? { rotulo: "Arquivar", icone: "pasta", fazer: fecharE(c.arquivar) }
            : { rotulo: "Reativar", icone: "restaurar", fazer: fecharE(c.reativar) },
          { rotulo: "Duplicar", icone: "copiar", fazer: fecharE(c.duplicar) },
          { rotulo: "Salvar como modelo…", icone: "camadas", fazer: () => c.salvarComoModelo?.() },
          "-",
          { rotulo: "Excluir", icone: "lixeira", perigo: true, fazer: fecharE(c.excluir) },
        ],
      })
    : null;
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-projeto" },
    campo("Nome do projeto", nome),
    campo("Processo SEI", proc.combo.el, {
      opcional: "(opcional)",
      dica: "Sugere os processos da sua caixa; aceita qualquer número digitado.",
    }),
    campo("Quem vê", cartoes),
    p ? null : campo("Começar", h("div", { class: "spro-segmentado" }, ...botoesComecar)),
    p ? null : bloco,
    erros.el,
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      menu,
      h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
      salvar,
    ),
  );
  modal = c.abrirModal({ titulo: p ? "Editar projeto" : "Novo projeto", icone: "gantt", conteudo });
  return { fechar: () => modal?.fechar() };
}
```

Arquivo completo `projetos/src/app/dialogos/apoio.ts`:

```ts
/**
 * Diálogos pequenos do P3: projetos arquivados (reativar, excluir), o
 * documento que comprova a conclusão ("Informar documento", do aviso de
 * concluída) e o nome do modelo ("Salvar como modelo").
 */

import { hojeISO } from "@comum/datas/dias";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import { LIMITES } from "../../modelo/constantes";
import type { DataISO, Etapa } from "../../modelo/tipos";
import type { DocumentoConferido } from "../../ponte/tipos";
import type { ProjetoNaTela } from "../dados";
import { dataDeFormulario, dataLonga } from "../formato";
import { caixaDeErros, campo, campoDocumento, linhaDeCampos, mensagensDoErro } from "./campos";

export function abrirArquivados(c: {
  abrirModal: AbrirModal;
  arquivados: readonly ProjetoNaTela[];
  reativar(id: string): Promise<void>;
  excluir(id: string): Promise<void>;
}): { fechar(): void } {
  const lista = h("div", { class: "prj-arquivados" });
  let restantes = [...c.arquivados];
  const pintar = () => {
    lista.replaceChildren(
      ...(restantes.length
        ? restantes.map((p) => {
            const tirar = (fazer: (id: string) => Promise<void>) => async () => {
              await fazer(p.projeto.id);
              restantes = restantes.filter((x) => x !== p);
              pintar();
            };
            return h(
              "div",
              { class: "prj-arquivado" },
              icone(p.vis === "unidade" ? "predio" : "pessoa", 15),
              h(
                "div",
                { class: "prj-arquivado-nome" },
                h("b", {}, p.projeto.nome),
                h("span", {}, ` arquivado em ${dataLonga(hojeISO(new Date(p.projeto.arquivadoEm ?? 0)))}`),
              ),
              h("button", { type: "button", class: "spro-botao pequeno", onclick: tirar(c.reativar) }, "Reativar"),
              h("button", { type: "button", class: "spro-botao fantasma perigo pequeno", onclick: tirar(c.excluir) }, "Excluir"),
            );
          })
        : [h("p", { class: "prj-dica" }, "Nenhum projeto arquivado.")]),
    );
  };
  pintar();
  return c.abrirModal({ titulo: "Projetos arquivados", icone: "pasta", conteudo: lista });
}

export function abrirInformarDocumento(c: {
  abrirModal: AbrirModal;
  etapa: Etapa;
  hoje: DataISO;
  conferirDocumento?: (numero: string) => Promise<DocumentoConferido | null>;
  salvar(numero: string | undefined, concluidaEm: DataISO): Promise<void>;
}): { fechar(): void } {
  const erros = caixaDeErros();
  const doc = campoDocumento(c.etapa.documento?.numero ?? "", c.conferirDocumento);
  const data = h("input", { type: "date", class: "spro-campo", name: "concluida", value: c.etapa.concluidaEm ?? c.hoje });
  let modal: { fechar(): void } | null = null;
  const salvar = h("button", { type: "button", class: "spro-botao primario" }, "Salvar");
  salvar.addEventListener("click", async () => {
    const d = dataDeFormulario(data.value);
    if (!d) return erros.mostrar(["Informe uma data válida (entre 2000 e 2100)."]);
    try {
      await c.salvar(doc.numero() || undefined, d);
      modal?.fechar();
    } catch (e) {
      erros.mostrar(mensagensDoErro(e));
    }
  });
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-documento" },
    campo("Número SEI", doc.el),
    linhaDeCampos(campo("Concluída em", data), salvar),
    erros.el,
  );
  modal = c.abrirModal({ titulo: "Documento que comprova a conclusão", icone: "documento", conteudo });
  return { fechar: () => modal?.fechar() };
}

export function pedirNomeDoModelo(c: { abrirModal: AbrirModal; sugestao: string; salvar(nome: string): Promise<void> }): {
  fechar(): void;
} {
  const erros = caixaDeErros();
  const nome = h("input", { type: "text", class: "spro-campo", maxlength: String(LIMITES.nome), value: c.sugestao });
  let modal: { fechar(): void } | null = null;
  const salvar = h("button", { type: "button", class: "spro-botao primario" }, "Salvar modelo");
  salvar.addEventListener("click", async () => {
    if (!nome.value.trim()) return erros.mostrar(["Informe o nome do modelo."]);
    try {
      await c.salvar(nome.value.trim());
      modal?.fechar();
    } catch (e) {
      erros.mostrar(mensagensDoErro(e));
    }
  });
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-modelo" },
    campo("Nome do modelo", nome, { dica: "As datas viram dias úteis contados do início: dá para usar em outro projeto." }),
    erros.el,
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
      salvar,
    ),
  );
  modal = c.abrirModal({ titulo: "Salvar como modelo", icone: "camadas", conteudo });
  return { fechar: () => modal?.fechar() };
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `576 ok, 0 falha(s)` (+26 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/dialogos/projeto.ts \
  projetos/src/app/dialogos/apoio.ts \
  projetos/tests/verificar-app-projeto.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: dialogo do projeto com modelos, arquivados e informar documento

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 10: Projetos — exportar planilha (CSV) e imprimir / salvar PDF

**Files:**
- Create: `projetos/src/arquivo/csv.ts`, `projetos/src/app/impressao.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-csv.ts`

**Interfaces:**
- Consumes: `gerarCsv`, `formatarData`, `normalizarTexto` (sei-comum); `ProjetoNaTela`, `carregarUnidade` (T2); `montarTabelaEtapas` (T5), `montarTabelaProjetos` (T6); `linhasDoProjeto`, `linhasDoPortfolio`, `montarGantt`, `ehEscala`, `duracaoUteis`, `progressoDaEtapa`, `ROTULO_SITUACAO`, `ROTULO_MARCO` (P2).
- Produces: `csvDosProjetos(itens, hoje): string`, `nomeDoCsv(nomeDoProjeto | null, hoje): string`; `ParametrosImpressao { host; login; unidade; projeto; escala; lista }`, `hashDaImpressao(p)`, `lerImpressao(hash) → ParametrosImpressao | null`, `DepsImpressao { repos; hoje; montarGantt?; imprimir() }`, `montarImpressao(raiz, p, d): Promise<void>`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-csv.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import type { ProjetoNaTela } from "../src/app/dados";
import { hashDaImpressao, lerImpressao, montarImpressao } from "../src/app/impressao";
import { csvDosProjetos, nomeDoCsv } from "../src/arquivo/csv";
import { resumoDoProjeto } from "../src/modelo/resumo";
import { telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { HOSTIL } from "./cenarioGantt";
import { etapa, fase, HOJE, projeto } from "./fabrica";
import { ganttFalso } from "./ganttFalso";
import { checar, secao, tique } from "./util";

export async function verificarAppCsv(): Promise<void> {
  secao("app: exportar planilha (CSV)");
  const etapas = [
    etapa({
      id: "e1",
      nome: "=SOMA(A1)",
      fase: "f1",
      inicio: "2026-09-01",
      fim: "2026-10-02",
      responsavel: { nome: "Carla Dias" },
      processo: { protocolo: "50300.009999/2026-01", sigiloso: true },
      etiquetas: ["AIR", "TI"],
      observacoes: 'Diz "sim"; depois',
    }),
    etapa({
      id: "m1",
      nome: HOSTIL,
      marco: true,
      inicio: "2026-12-03",
      fim: "2026-12-03",
      concluidaEm: "2026-12-03",
      documento: { numero: "1240001" },
    }),
  ];
  const p: ProjetoNaTela = {
    projeto: projeto({ id: "p1", nome: "Revisão", processo: { protocolo: "50300.001234/2026-11" } }),
    vis: "unidade",
    fases: [fase({ id: "f1", nome: "Instrução" })],
    etapas,
    resumo: resumoDoProjeto(etapas, HOJE),
  };
  const sig: ProjetoNaTela = {
    ...p,
    projeto: projeto({ id: "p2", nome: "Sigiloso", processo: { protocolo: "50300.000777/2026-77", sigiloso: true } }),
    vis: "eu",
    etapas: [etapa({ id: "x", projeto: "p2" })],
  };
  const csv = csvDosProjetos([p, sig], HOJE);
  const BOM = String.fromCharCode(0xfeff);
  const linhas = csv.slice(1).split("\r\n");
  checar(
    "cabecalho das colunas",
    linhas[0] ===
      "Projeto;Quem vê;Processo;Fase;Etapa;Marco;Responsável;Início;Término;Dias úteis;Situação;Progresso (%);Concluída em;Documento SEI;Etiquetas;Observações",
  );
  checar("BOM para o Excel", csv.startsWith(BOM));
  const l1 = linhas[1] ?? "";
  checar("formula neutralizada", l1.includes(";'=SOMA(A1);"));
  checar(
    "processo sigiloso da etapa sai em branco (nem o do projeto entra no lugar)",
    !l1.includes("50300.009999") && l1.startsWith("Revisão;Toda a unidade;;Instrução;"),
    l1,
  );
  checar("aspas e ponto e virgula protegidos", l1.endsWith(';AIR, TI;"Diz ""sim""; depois"'), l1);
  checar("datas, dias uteis, situacao e progresso", l1.includes(";01/09/2026;02/10/2026;23;Atrasada;0;;;"), l1);
  const l2 = linhas[2] ?? "";
  checar(
    "marco: 'sim', sem termino; texto hostil como texto",
    l2.includes(`;"${HOSTIL.replace(/"/g, '""')}";sim;`) && l2.includes(";03/12/2026;;0;Marco cumprido;100;03/12/2026;1240001;"),
    l2,
  );
  checar("processo sigiloso do projeto em branco", (linhas[3] ?? "").startsWith("Sigiloso;Só eu;;"));
  checar(
    "nome do arquivo sem acento nem espaco",
    nomeDoCsv("Revisão da Resolução nº 5.432", HOJE) === "projeto-revisao-da-resolucao-n-5-432-2026-10-06.csv" &&
      nomeDoCsv(null, HOJE) === "projetos-2026-10-06.csv",
  );

  secao("app: imprimir / salvar PDF");
  const par = { host: "sei.x.gov.br", login: "ana", unidade: "110", projeto: "todos", escala: "Mês" as const, lista: true };
  const hash = hashDaImpressao(par);
  checar("parametros no endereco e de volta", JSON.stringify(lerImpressao(hash)) === JSON.stringify(par));
  checar("endereco estranho nao imprime", lerImpressao("#modo=impressao&host=x") === null && lerImpressao("#modo=embutido") === null);
  const area = areaMemoria();
  const { repo: un } = novoRepo(ESCOPO_UN, area, "u");
  const { repo: eu } = novoRepo(ESCOPO_EU, area, "e");
  const pr = await un.criarProjeto({ nome: HOSTIL });
  await un.criarEtapa({ projeto: pr.id, nome: "Etapa A", inicio: "2026-10-05", fim: "2026-10-09" });
  await eu.criarProjeto({ nome: "Meu" });
  const doc = telaDoApp();
  const g = ganttFalso();
  let impresso = 0;
  await montarImpressao(
    doc.getElementById("app")!,
    { ...par, host: "sei.x.gov.br", login: "ana" },
    { repos: { unidade: un, eu }, hoje: HOJE, montarGantt: g.montar, imprimir: () => (impresso += 1) },
  );
  await tique(20);
  const app = doc.getElementById("app")!;
  checar(
    "Todos: titulo, Gantt so leitura e tabela",
    texto(app.querySelector("h1")) === "Projetos" &&
      g.opcoes()?.somenteLeitura === true &&
      app.querySelectorAll("tr.prj-tab-linha").length === 2,
  );
  checar("abre a impressao do navegador", impresso === 1);
  const doc2 = telaDoApp();
  await montarImpressao(
    doc2.getElementById("app")!,
    { ...par, projeto: pr.id, escala: "Semana" },
    { repos: { unidade: un, eu }, hoje: HOJE, montarGantt: ganttFalso().montar, imprimir: () => undefined },
  );
  const app2 = doc2.getElementById("app")!;
  checar(
    "projeto: nome hostil como texto e etapas na tabela",
    texto(app2.querySelector("h1")) === HOSTIL && !app2.querySelector("img") && texto(app2).includes("Etapa A"),
  );
  const doc3 = telaDoApp();
  await montarImpressao(
    doc3.getElementById("app")!,
    { ...par, projeto: "sumiu" },
    { repos: { unidade: un, eu }, hoje: HOJE, imprimir: () => undefined },
  );
  checar("projeto que nao existe: aviso", texto(doc3.getElementById("app")) === "Projeto não encontrado nesta unidade.");
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppCsv } from "./verificar-app-csv";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppProjeto } from "./verificar-app-projeto";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
await verificarAppProjeto();
await verificarAppCsv();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/impressao'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/arquivo/csv.ts`:

```ts
/**
 * "Exportar planilha (CSV)" (spec 3.1): uma linha por etapa dos projetos da
 * aba aberta, com o filtro aplicado. Processo sigiloso sai em branco (spec 9),
 * inclusive quando a etapa herdaria o do projeto. `gerarCsv` (sei-comum) põe
 * o BOM, o separador ";" e neutraliza fórmulas (= + - @).
 */

import { gerarCsv } from "@comum/csv";
import { formatarData } from "@comum/datas/dias";
import { normalizarTexto } from "@comum/texto";
import type { ProjetoNaTela } from "../app/dados";
import { duracaoUteis } from "../modelo/calendario";
import { rotuloDaVis } from "../modelo/escopo";
import { progressoDaEtapa } from "../modelo/progresso";
import { ROTULO_MARCO, ROTULO_SITUACAO, situacaoEtapa, situacaoMarco } from "../modelo/situacao";
import type { DataISO, Etapa, Vinculo } from "../modelo/tipos";

const CABECALHO = [
  "Projeto",
  "Quem vê",
  "Processo",
  "Fase",
  "Etapa",
  "Marco",
  "Responsável",
  "Início",
  "Término",
  "Dias úteis",
  "Situação",
  "Progresso (%)",
  "Concluída em",
  "Documento SEI",
  "Etiquetas",
  "Observações",
];

/** O número do processo, ou vazio se é sigiloso. */
const numero = (v: Vinculo | undefined): string => (v && !v.sigiloso ? v.protocolo : "");

function linhaDaEtapa(p: ProjetoNaTela, e: Etapa, hoje: DataISO): string[] {
  const fase = p.fases.find((f) => f.id === e.fase)?.nome ?? "";
  const situacao = e.marco ? ROTULO_MARCO[situacaoMarco(e, hoje)] : ROTULO_SITUACAO[situacaoEtapa(e, hoje)];
  return [
    p.projeto.nome,
    rotuloDaVis(p.vis),
    numero(e.processo ?? p.projeto.processo),
    fase,
    e.nome,
    e.marco ? "sim" : "",
    e.responsavel?.nome ?? "",
    formatarData(e.inicio),
    e.marco ? "" : formatarData(e.fim),
    e.marco ? "0" : String(duracaoUteis(e.inicio, e.fim)),
    situacao,
    String(progressoDaEtapa(e, hoje)),
    e.concluidaEm ? formatarData(e.concluidaEm) : "",
    e.documento?.numero ?? "",
    e.etiquetas.join(", "),
    e.observacoes ?? "",
  ];
}

/** `itens` já vêm com as etapas que passam no filtro. Projeto sem etapas sai numa linha só. */
export function csvDosProjetos(itens: readonly ProjetoNaTela[], hoje: DataISO): string {
  const linhas: string[][] = [CABECALHO];
  for (const p of itens) {
    if (!p.etapas.length) {
      linhas.push([p.projeto.nome, rotuloDaVis(p.vis), numero(p.projeto.processo), ...CABECALHO.slice(3).map(() => "")]);
      continue;
    }
    for (const e of p.etapas) linhas.push(linhaDaEtapa(p, e, hoje));
  }
  return gerarCsv(linhas);
}

/** "projeto-<nome>-<data>.csv" (aba de um projeto) ou "projetos-<data>.csv" (Todos). */
export function nomeDoCsv(nomeDoProjeto: string | null, hoje: DataISO): string {
  if (!nomeDoProjeto) return `projetos-${hoje}.csv`;
  const base =
    normalizarTexto(nomeDoProjeto)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "projeto";
  return `projeto-${base}-${hoje}.csv`;
}
```

Arquivo completo `projetos/src/app/impressao.ts`:

```ts
/**
 * "Imprimir / salvar PDF" (spec 3.1): a mesma página do app em
 * `#modo=impressao&...`, numa janela nova, só leitura: título, o Gantt (da aba
 * aberta, na escala dela) e a tabela; depois abre a impressão do navegador.
 * Os parâmetros vão no endereço (a página da extensão lê o armazenamento direto).
 */

import { formatarData } from "@comum/datas/dias";
import { h } from "@comum/ui/dom";
import { type Escala, ehEscala } from "../gantt/escalas";
import { linhasDoPortfolio, linhasDoProjeto } from "../gantt/linhas";
import { montarGantt } from "../gantt/montar";
import { rotuloDaVis } from "../modelo/escopo";
import type { DataISO, Vis } from "../modelo/tipos";
import type { RepositorioProjetos } from "../repositorio";
import { montarTabelaEtapas } from "./componentes/tabelaEtapas";
import { montarTabelaProjetos } from "./componentes/vistaTodos";
import { carregarUnidade } from "./dados";
import { plural } from "./formato";

export interface ParametrosImpressao {
  host: string;
  login: string;
  unidade: string;
  /** "todos" ou o id do projeto. */
  projeto: string;
  escala: Escala;
  /** Lista de etapas à esquerda do Gantt. */
  lista: boolean;
}

export function hashDaImpressao(p: ParametrosImpressao): string {
  const q = new URLSearchParams({
    modo: "impressao",
    host: p.host,
    login: p.login,
    unidade: p.unidade,
    projeto: p.projeto,
    escala: p.escala,
    lista: p.lista ? "1" : "0",
  });
  return `#${q.toString()}`;
}

export function lerImpressao(hash: string): ParametrosImpressao | null {
  const q = new URLSearchParams(hash.replace(/^#/, ""));
  const escala = q.get("escala");
  const [host, login, unidade, projeto] = ["host", "login", "unidade", "projeto"].map((k) => q.get(k) ?? "");
  if (q.get("modo") !== "impressao" || !host || !login || !unidade || !projeto || !ehEscala(escala)) return null;
  return { host, login, unidade, projeto, escala, lista: q.get("lista") === "1" };
}

export interface DepsImpressao {
  repos: Readonly<Record<Vis, RepositorioProjetos>>;
  hoje: DataISO;
  montarGantt?: typeof montarGantt;
  /** `window.print` (depois de desenhar). */
  imprimir(): void;
}

export async function montarImpressao(raiz: HTMLElement, p: ParametrosImpressao, d: DepsImpressao): Promise<void> {
  const dados = await carregarUnidade(d.repos, d.hoje);
  const montar = d.montarGantt ?? montarGantt;
  const area = h("div", { class: "prj-gantt" });
  const opcoes = { escala: p.escala, hoje: d.hoje, mostrarLista: false, moverDependentes: false, somenteLeitura: true };
  if (p.projeto === "todos") {
    raiz.replaceChildren(
      h("h1", {}, "Projetos"),
      h(
        "p",
        { class: "prj-impressao-meta" },
        `${plural(dados.ativos.length, "projeto ativo", "projetos ativos")} · impresso em ${formatarData(d.hoje)}`,
      ),
      area,
      montarTabelaProjetos(dados.ativos, { aoAbrir: () => undefined }),
    );
    montar(
      area,
      linhasDoPortfolio(
        dados.ativos.map((i) => ({ projeto: i.projeto, vis: i.vis, etapas: i.etapas })),
        d.hoje,
      ),
      opcoes,
    );
  } else {
    const item = [...dados.ativos, ...dados.arquivados].find((x) => x.projeto.id === p.projeto);
    if (!item) {
      raiz.replaceChildren(h("p", {}, "Projeto não encontrado nesta unidade."));
      return;
    }
    const linhas = linhasDoProjeto(
      { projeto: item.projeto.id, fases: item.fases, etapas: item.etapas },
      { hoje: d.hoje, ordem: "inicio", recolhidas: new Set() },
    );
    const r = item.resumo;
    raiz.replaceChildren(
      h("h1", {}, item.projeto.nome),
      h(
        "p",
        { class: "prj-impressao-meta" },
        [
          item.projeto.processo?.protocolo,
          rotuloDaVis(item.vis),
          `${r.feitas} de ${plural(r.total, "etapa concluída", "etapas concluídas")}`,
          r.fim ? `termina em ${formatarData(r.fim)}` : null,
          `impresso em ${formatarData(d.hoje)}`,
        ]
          .filter(Boolean)
          .join(" · "),
      ),
      area,
      montarTabelaEtapas(linhas, { hoje: d.hoje, aoClicar: () => undefined }),
    );
    montar(area, linhas, { ...opcoes, mostrarLista: p.lista });
  }
  // As barras e os rótulos da Frappe se ajustam no quadro seguinte.
  setTimeout(() => d.imprimir(), 10);
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `591 ok, 0 falha(s)` (+15 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/arquivo/csv.ts \
  projetos/src/app/impressao.ts \
  projetos/tests/verificar-app-csv.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: exportar CSV e imprimir

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 11: Projetos — o app do painel embutido (AppProjetos)

**Files:**
- Create: `projetos/src/app/app.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app.ts`

**Interfaces:**
- Consumes: tudo das Tarefas 2 a 10 (assinaturas acima); do P2, `RepositorioProjetos` (`criarProjeto`, `criarProjetoDeModelo`, `editarProjeto`, `arquivarProjeto`, `reativarProjeto`, `removerProjeto`, `restaurarProjeto`, `duplicarProjeto`, `salvarComoModelo`, `criarFase`, `criarEtapa`, `editarEtapa`, `moverDatas`, `concluirEtapa`, `reabrirEtapa`, `removerEtapa`, `restaurarEtapa`, `obterEtapa`, `historico`, `aoMudar`), `moverEntreEscopos`, `completarComDependentes`, `violacoesDeDatas`, `datasDaEtapaNova`, `escalaEditavel`; `avisar` (T1), `fecharOrfaos`.
- Produces: `DepsApp`, `class AppProjetos` (seção "Interfaces exportadas").

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import type { AbrirModal } from "@comum/ui/dialogo";
import { AppProjetos } from "../src/app/app";
import type { ParametrosImpressao } from "../src/app/impressao";
import { lerPreferencias } from "../src/app/preferencias";
import type { ProvedorSincronia } from "../src/app/sincronia";
import type { LinhaEtapa } from "../src/gantt/linhas";
import type { ContextoProjetos } from "../src/ponte/tipos";
import { digitar, itemDoMenu, marcar, tecla, telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { HOSTIL } from "./cenarioGantt";
import { HOJE } from "./fabrica";
import { ganttFalso } from "./ganttFalso";
import { botao, checar, secao, tique } from "./util";

const CTX: ContextoProjetos = {
  host: "sei.x.gov.br",
  login: "ana",
  nome: "Ana Lima",
  unidade: { id: "110", sigla: "TESTE", nome: "Unidade de Teste" },
  versao: "4.1.5",
  temaEscuro: false,
  atividades: false,
};
const AGORA = new Date(2026, 9, 6, 15).getTime();

async function montar(o: { vazio?: boolean; falharGantt?: boolean; sincronia?: ProvedorSincronia } = {}) {
  const doc = telaDoApp();
  const area = areaMemoria();
  const { repo: un } = novoRepo(ESCOPO_UN, area, "u");
  const { repo: eu } = novoRepo(ESCOPO_EU, area, "e");
  const ids = { p: "", f: "", a: "", b: "", q: "" };
  if (!o.vazio) {
    const p = await un.criarProjeto({ nome: HOSTIL, processo: { protocolo: "50300.001234/2026-11", idProcedimento: "77" } });
    const f = await un.criarFase(p.id, "Instrução");
    const a = await un.criarEtapa({ projeto: p.id, nome: "Nota técnica", fase: f.id, inicio: "2026-09-01", fim: "2026-10-02" });
    const b = await un.criarEtapa({
      projeto: p.id,
      nome: "Análise",
      fase: f.id,
      inicio: "2026-10-05",
      fim: "2026-10-09",
      dependeDe: [a.id],
    });
    const q = await eu.criarProjeto({ nome: "Plano 2027" });
    Object.assign(ids, { p: p.id, f: f.id, a: a.id, b: b.id, q: q.id });
  }
  const chamadas: Array<[string, unknown]> = [];
  const rpc = {
    chamar: async <T>(op: string, args?: unknown): Promise<T> => {
      chamadas.push([op, args]);
      if (op === "processosDaCaixa" || op === "usuariosDaUnidade") return [] as T;
      return true as T;
    },
  };
  const modais: string[] = [];
  const abrirModal: AbrirModal = (m) => {
    modais.push(m.titulo);
    doc.body.append(m.conteudo);
    return {
      fechar: () => {
        m.conteudo.remove();
        m.aoFechar?.();
      },
    };
  };
  const t = {
    confirmar: true,
    confirmacoes: [] as string[],
    baixados: [] as Array<{ nome: string; conteudo: string }>,
    impressos: [] as ParametrosImpressao[],
  };
  const g = ganttFalso({ falhar: o.falharGantt });
  const app = new AppProjetos({
    raiz: doc.getElementById("app")!,
    ctx: CTX,
    area,
    repos: { unidade: un, eu },
    rpc,
    abrirModal,
    confirmar: async (texto) => {
      t.confirmacoes.push(texto);
      return t.confirmar;
    },
    baixar: (nome, conteudo) => void t.baixados.push({ nome, conteudo }),
    hoje: () => HOJE,
    agora: () => AGORA,
    imprimir: (p) => void t.impressos.push(p),
    montarGantt: g.montar,
    sincronia: o.sincronia,
    largura: () => 1000,
  });
  await app.iniciar();
  const raiz = doc.getElementById("app")!;
  return { doc, raiz, area, un, eu, ids, app, chamadas, modais, t, g };
}

const aviso = (doc: Document) => doc.querySelector(".spro-aviso");

export async function verificarApp(): Promise<void> {
  secao("app: primeiro uso");
  const v = await montar({ vazio: true });
  checar(
    "sem projetos: o vazio e o menu, sem abas",
    !!v.raiz.querySelector(".prj-vazio") &&
      !v.raiz.querySelector("[role='tab']") &&
      !!v.raiz.querySelector("button[aria-label='Ajustes dos projetos']"),
  );
  botao(v.raiz, "Criar projeto")!.click();
  const form = () => v.doc.querySelector(".prj-form-projeto") as HTMLElement;
  digitar(form().querySelector("input[name='nome']"), "Pregão");
  botao(form(), "Criar projeto")!.click();
  await tique(80);
  checar(
    "cria e abre o projeto novo",
    texto(v.raiz.querySelector("[role='tab'][aria-selected='true']")).startsWith("Pregão") && !!v.raiz.querySelector(".prj-vista"),
  );
  botao(v.raiz, "Novo projeto")!.click();
  botao(form(), "De um modelo")!.click();
  digitar(form().querySelector("input[name='nome']"), "Revisão");
  digitar(form().querySelector("input[name='comeca']"), "2026-08-03");
  botao(form(), "Criar projeto")!.click();
  await tique(80);
  const aberto = (await v.un.dados()).projetos.find((p) => p.nome === "Revisão");
  checar(
    "de um modelo: 9 etapas em 3 fases",
    (await v.un.dados()).etapas.filter((e) => e.projeto === aberto?.id).length === 9 && v.app.aberto === aberto?.id,
  );
  v.app.destruir();

  secao("app: abas, cabecalho e vista do projeto");
  const a = await montar();
  const abas = [...a.raiz.querySelectorAll("[role='tab']")].map((x) => texto(x));
  checar(
    "Todos e os dois escopos juntos",
    abas.length === 3 && abas[0] === "Todos2" && abas.some((x) => x.startsWith(HOSTIL)) && abas.some((x) => x.startsWith("Plano 2027")),
  );
  checar(
    "comeca no Todos (portfolio)",
    a.app.aberto === "todos" && texto(a.raiz.querySelector(".prj-meta")).startsWith("2 projetos ativos"),
  );
  (a.raiz.querySelector(`[role='tab'][data-aba='${a.ids.p}']`) as HTMLElement).click();
  await tique();
  checar(
    "abre o projeto e lembra por unidade",
    a.app.aberto === a.ids.p && (await lerPreferencias(a.area)).abertos["sei.x.gov.br|ana|u:110"] === a.ids.p,
  );
  checar("cabecalho: processo, escopo e contagem", texto(a.raiz.querySelector(".prj-meta")).includes("0 de 2 etapas concluídas"));
  (a.raiz.querySelector(".prj-processo") as HTMLElement).click();
  checar(
    "o link do processo pede a aba",
    JSON.stringify(a.chamadas.at(-1)) ===
      JSON.stringify(["abrirProcesso", { id: "77", protocolo: "50300.001234/2026-11", novaAba: false }]),
  );
  const linhas = a.g.a.linhas.at(-1) ?? [];
  checar(
    "lista e Gantt com as mesmas linhas",
    a.raiz.querySelectorAll(".prj-lin:not(.prj-lin-nova)").length === linhas.length && linhas.length === 3,
  );

  secao("app: concluir com 1 clique, informar documento e desfazer");
  (a.raiz.querySelector(`.prj-lin[data-id='${a.ids.a}']`) as HTMLElement).click();
  checar("balao abre", !!a.doc.querySelector(".prj-balao"));
  botao(a.doc.querySelector(".prj-balao")!, "Concluir etapa")!.click();
  await tique(80);
  checar("concluida com a data de hoje", (await a.un.obterEtapa(a.ids.a))?.concluidaEm === HOJE);
  const t1 = aviso(a.doc);
  checar(
    "aviso da tela 2 com as duas acoes",
    texto(t1?.querySelector("span")) === "“Nota técnica” concluída hoje (06/10)." &&
      !!botao(t1!, "Informar documento") &&
      !!botao(t1!, "Desfazer"),
  );
  botao(t1!, "Informar documento")!.click();
  await tique();
  const fd = a.doc.querySelector(".prj-form-documento") as HTMLElement;
  digitar(fd.querySelector("input[name='documento']"), "1240001");
  digitar(fd.querySelector("input[name='concluida']"), "2026-10-05");
  botao(fd, "Salvar")!.click();
  await tique(80);
  const conc = await a.un.obterEtapa(a.ids.a);
  checar("documento e data informados", conc?.documento?.numero === "1240001" && conc.concluidaEm === "2026-10-05");
  (a.raiz.querySelector(`.prj-lin[data-id='${a.ids.b}']`) as HTMLElement).click();
  botao(a.doc.querySelector(".prj-balao")!, "Concluir etapa")!.click();
  await tique(80);
  botao(aviso(a.doc)!, "Desfazer")!.click();
  await tique(80);
  checar("desfazer reabre", (await a.un.obterEtapa(a.ids.b))?.concluidaEm === undefined);

  secao("app: adicionar etapa pela ultima linha");
  const nova = a.raiz.querySelector<HTMLInputElement>(".prj-lin-nova input")!;
  nova.value = "Parecer";
  tecla(nova, "Enter");
  await tique(80);
  const criada = (await a.un.dados()).etapas.find((e) => e.nome === "Parecer");
  checar("cria depois da ultima etapa com 5 dias uteis", criada?.inicio === "2026-10-13" && criada.fim === "2026-10-19", criada);

  secao("app: arrastar no Gantt");
  const op = a.g.opcoes()!;
  checar(
    "recusa antes de gravar: dependente antes da predecessora",
    op.validar?.([{ id: a.ids.b, inicio: "2026-08-01", fim: "2026-08-05" }]) ===
      "“Análise” não pode começar antes de “Nota técnica”, da qual depende.",
  );
  op.aoMudarDatas?.([{ id: a.ids.a, inicio: "2026-09-08", fim: "2026-10-09" }]);
  await tique(80);
  checar("grava e leva a dependente junto (mover dependentes)", (await a.un.obterEtapa(a.ids.b))?.inicio === "2026-10-12");

  secao("app: filtro e alertas");
  a.raiz.querySelector<HTMLButtonElement>(".prj-filtro")!.click();
  botao(a.doc.querySelector(".prj-filtro-pop")!, "Concluídas")!.click();
  await tique();
  checar(
    "filtro tira as concluidas e o popover segue aberto",
    !a.raiz.querySelector(`.prj-lin[data-id='${a.ids.a}']`) &&
      !!a.doc.querySelector(".prj-filtro-pop") &&
      texto(a.raiz.querySelector(".prj-filtro")) === "Filtro · 1",
  );
  checar("filtro gravado nas preferencias", (await lerPreferencias(a.area)).filtro.mostrarConcluidas === false);
  a.app.aplicarAlerta("semana");
  await tique();
  checar(
    "pilula 'vence nesta semana': Todos filtrado (nenhum vence)",
    a.app.aberto === "todos" && texto(a.raiz.querySelector(".prj-nada p")) === "Nenhum projeto com etapas nesse filtro.",
  );
  botao(a.raiz.querySelector(".prj-nada")!, "Limpar filtro")!.click();
  await a.un.criarEtapa({ projeto: a.ids.p, nome: "Atrasada", inicio: "2026-09-01", fim: "2026-09-30" });
  await tique(80);
  a.app.aplicarAlerta("atrasadas");
  await tique();
  checar(
    "pilula 'atrasadas': um projeto so, abre ele filtrado",
    a.app.aberto === a.ids.p &&
      (a.g.a.linhas.at(-1) ?? [])
        .filter((l) => l.tipo === "etapa")
        .map((l) => (l as LinhaEtapa).etapa.nome)
        .join() === "Atrasada",
  );

  await tique();
  const gravadas = await lerPreferencias(a.area);
  checar(
    "varias preferencias seguidas, todas gravadas (fila)",
    gravadas.filtro.situacoes.join() === "atrasadas" && gravadas.abertos["sei.x.gov.br|ana|u:110"] === a.ids.p,
  );

  secao("app: menu ajustes, CSV e impressao");
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Mostrar lista de etapas");
  await tique();
  checar("esconder a lista", !a.raiz.querySelector(".prj-lista") && (await lerPreferencias(a.area)).mostrarLista === false);
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Exportar planilha (CSV)");
  checar(
    "baixa o CSV da aba aberta com o filtro",
    a.t.baixados[0]?.nome.startsWith("projeto-img-src-x-onerror") === true &&
      a.t.baixados[0]?.conteudo.includes("Atrasada") &&
      !a.t.baixados[0]?.conteudo.includes("Parecer"),
  );
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Imprimir / salvar PDF");
  checar(
    "imprimir manda os parametros da aba",
    a.t.impressos[0]?.projeto === a.ids.p && a.t.impressos[0]?.escala === "Semana" && a.t.impressos[0]?.lista === false,
  );

  secao("app: excluir etapa e projeto com desfazer");
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Mostrar lista de etapas");
  await tique();
  const linhaAt = [...a.raiz.querySelectorAll<HTMLElement>(".prj-lin-etapa")].find((l) => texto(l) === "Atrasada")!;
  linhaAt.click();
  itemDoMenu(a.doc.querySelector(".prj-balao")!, "Mais ações da etapa", "Excluir");
  await tique(80);
  checar("etapa excluida com aviso", texto(aviso(a.doc)?.querySelector("span")) === "Etapa “Atrasada” excluída.");
  botao(aviso(a.doc)!, "Desfazer")!.click();
  await tique(80);
  checar(
    "desfazer devolve a etapa",
    (await a.un.dados()).etapas.some((e) => e.nome === "Atrasada"),
  );
  botao(a.raiz, "Editar projeto")!.click();
  itemDoMenu(a.doc.querySelector(".prj-form-projeto")!, "Mais ações do projeto", "Excluir");
  await tique(80);
  checar(
    "confirma antes de excluir o projeto",
    a.t.confirmacoes.at(-1)?.startsWith(`Excluir o projeto “${HOSTIL}” e `) === true && !(await a.un.obterProjeto(a.ids.p)),
  );
  botao(aviso(a.doc)!, "Desfazer")!.click();
  await tique(80);
  checar("desfazer devolve o projeto", !!(await a.un.obterProjeto(a.ids.p)));

  secao("app: mudar quem ve e arquivar");
  a.app.focarProjeto(a.ids.p, a.ids.b);
  checar(
    "abrir no painel: projeto e balao da etapa",
    a.app.aberto === a.ids.p && texto(a.doc.querySelector(".prj-balao h3")) === "Análise",
  );
  a.app.focarProjeto(a.ids.q);
  await tique();
  botao(a.raiz, "Editar projeto")!.click();
  marcar(a.doc.querySelector(".prj-form-projeto input[value='unidade']"));
  botao(a.doc.querySelector(".prj-form-projeto")!, "Salvar")!.click();
  await tique(80);
  checar(
    "Só eu → Toda a unidade, com confirmacao",
    a.t.confirmacoes.at(-1)?.includes("toda a unidade (TESTE)") === true &&
      !!(await a.un.obterProjeto(a.ids.q)) &&
      !(await a.eu.obterProjeto(a.ids.q)),
  );
  botao(a.raiz, "Editar projeto")!.click();
  itemDoMenu(a.doc.querySelector(".prj-form-projeto")!, "Mais ações do projeto", "Arquivar");
  await tique(80);
  checar(
    "arquivado sai das abas e volta ao Todos",
    a.app.aberto === "todos" && ![...a.raiz.querySelectorAll("[role='tab']")].some((x) => texto(x).startsWith("Plano 2027")),
  );
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Projetos arquivados");
  botao(a.doc.querySelector(".prj-arquivados")!, "Reativar")!.click();
  await tique(80);
  checar(
    "reativar pelos arquivados",
    [...a.raiz.querySelectorAll("[role='tab']")].some((x) => texto(x).startsWith("Plano 2027")),
  );
  a.app.destruir();

  secao("app: falha da Frappe e sincronia");
  let avisarSinc: () => void = () => undefined;
  let estado = { rotulo: "pendente", dica: "Falta enviar", tom: "pendente" as const };
  const s = await montar({
    falharGantt: true,
    sincronia: {
      estado: () => estado,
      aoMudar: (cb) => {
        avisarSinc = cb;
        return () => undefined;
      },
    },
  });
  await tique();
  checar(
    "sem Gantt: cai para a lista com aviso",
    !!s.raiz.querySelector(".prj-tabela") &&
      texto(aviso(s.doc)?.querySelector("span")) === "O Gantt não abriu neste navegador; mostrando a lista.",
  );
  checar("estado do provedor ao lado das abas", texto(s.raiz.querySelector(".prj-sinc")) === "pendente");
  estado = { rotulo: "sincronizado", dica: "ok", tom: "pendente" };
  avisarSinc();
  checar("redesenha quando o estado muda", texto(s.raiz.querySelector(".prj-sinc")) === "sincronizado");
  checar("nome hostil nunca vira elemento", !s.raiz.querySelector("img") && !s.doc.querySelector("img"));
  s.app.destruir();
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarApp } from "./verificar-app";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppCsv } from "./verificar-app-csv";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppProjeto } from "./verificar-app-projeto";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
await verificarAppProjeto();
await verificarAppCsv();
await verificarApp();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/app'`.

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/app.ts`:

```ts
/**
 * O app do painel "Projetos" (html/projetos.html#modo=embutido): junta os dois
 * escopos da unidade, desenha abas, cabeçalho e a vista (Gantt com a lista,
 * Lista ou Todos) e faz as ações do dia a dia. Os dados vêm do repositório
 * (chrome.storage.local) e voltam a ser lidos a cada gravação (`aoMudar`), de
 * qualquer contexto. O que só a aba do SEI sabe (processos da caixa, usuários,
 * abrir processo ou documento) vem pelo RPC. A Frappe é reaproveitada entre
 * os redesenhos (a rolagem fica); o popover do filtro também.
 */

import type { Area } from "@comum/armazenamento/area";
import type { Rpc } from "@comum/ponte/rpc";
import { avisar } from "@comum/ui/aviso";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { fecharOrfaos } from "@comum/ui/flutuante";
import { csvDosProjetos, nomeDoCsv } from "../arquivo/csv";
import { escalaEditavel } from "../gantt/escalas";
import { linhasDoProjeto } from "../gantt/linhas";
import type { montarGantt } from "../gantt/montar";
import { completarComDependentes, violacoesDeDatas } from "../modelo/dependencias";
import { rotuloDaVis } from "../modelo/escopo";
import { criteriosAtivos, type Eu, FILTRO_VAZIO, type FiltroEtapas, filtrarEtapas } from "../modelo/filtro";
import { datasDaEtapaNova } from "../modelo/operacoes";
import type { DataISO, Etapa, MudancaDeDatas, Vinculo, Vis } from "../modelo/tipos";
import type { ContextoProjetos, DocumentoConferido, ProcessoDaCaixa, TipoAlerta, UsuarioDaUnidade } from "../ponte/tipos";
import { moverEntreEscopos, type RepositorioProjetos } from "../repositorio";
import { indicadorDeSincronia, limiteDeAbas, montarAbas } from "./componentes/abas";
import { abrirBalaoEtapa } from "./componentes/balaoEtapa";
import { montarCabecalho } from "./componentes/cabecalho";
import type { Camada } from "./componentes/camada";
import { type BotaoFiltro, criarBotaoFiltro, projetoNoFiltro } from "./componentes/filtro";
import { criarMenuAjustes, type ExtensoesMenu } from "./componentes/menuAjustes";
import { montarTabelaEtapas } from "./componentes/tabelaEtapas";
import { montarVazio } from "./componentes/vazio";
import { VistaProjeto } from "./componentes/vistaProjeto";
import { montarTabelaProjetos, VistaTodos } from "./componentes/vistaTodos";
import { alertasDaUnidade, carregarUnidade, type DadosUnidade, type ProjetoNaTela } from "./dados";
import { abrirArquivados, abrirInformarDocumento, pedirNomeDoModelo } from "./dialogos/apoio";
import { abrirDialogoEtapa, type ResultadoEtapa } from "./dialogos/etapa";
import { abrirDialogoProjeto, type ResultadoProjeto } from "./dialogos/projeto";
import { dataCurta, plural } from "./formato";
import type { ParametrosImpressao } from "./impressao";
import {
  chaveAberto,
  escalaDoProjeto,
  gravarPreferencias,
  lerPreferencias,
  normalizarPreferencias,
  PREFERENCIAS_PADRAO,
  type Preferencias,
} from "./preferencias";
import { type ProvedorSincronia, SEM_SINCRONIA } from "./sincronia";

export interface DepsApp {
  raiz: HTMLElement;
  ctx: ContextoProjetos;
  /** `chrome.storage.local` (preferências). */
  area: Area;
  repos: Readonly<Record<Vis, RepositorioProjetos>>;
  rpc: Pick<Rpc, "chamar">;
  abrirModal: AbrirModal;
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  hoje(): DataISO;
  agora(): number;
  /** Abre a página de impressão (main.ts: janela nova com `#modo=impressao`). */
  imprimir?: (p: ParametrosImpressao) => void;
  /** Injetável nas provas (a Frappe de verdade precisa de medidas). */
  montarGantt?: typeof montarGantt;
  /** P4: o Texto Padrão e o arquivo. Sem provedor, "neste navegador". */
  sincronia?: ProvedorSincronia;
  /** P4: itens do menu ajustes (Sincronização, Modelos, Enviar/Receber, Importar, Histórico). */
  extensoesMenu?: ExtensoesMenu;
  /** P4: "Importar meus projetos do servidor do Atividades" no primeiro uso. */
  importarAtividades?: () => void;
  aoRedesenhar?: () => void;
  /** Largura útil para as abas (sem medida: 3 abas). */
  largura?: () => number;
}

/** Erro de uma ação: a mensagem do repositório (ErroValidacao) ou a do erro. */
const mensagem = (e: unknown): string => {
  const m = (e as { mensagens?: unknown })?.mensagens;
  return Array.isArray(m) && m.length ? m.map(String).join(" ") : e instanceof Error ? e.message : String(e);
};

export class AppProjetos {
  private prefs: Preferencias = PREFERENCIAS_PADRAO;
  private dados: DadosUnidade = { ativos: [], arquivados: [], modelos: [] };
  private abertoAtual = "todos";
  private vista: VistaProjeto | VistaTodos | null = null;
  private chaveVista = "";
  private filtro: BotaoFiltro | null = null;
  private balao: Camada | null = null;
  private semGantt = false;
  private focarNova = false;
  private agendado: ReturnType<typeof setTimeout> | null = null;
  private paradas: Array<() => void> = [];
  private processosMemo: Promise<ProcessoDaCaixa[]> | null = null;
  private usuariosMemo: Promise<UsuarioDaUnidade[]> | null = null;
  private gravacao: Promise<unknown> = Promise.resolve();
  private readonly eu: Eu;
  private readonly chaveAba: string;
  private readonly slotTopo = h("div", { class: "prj-topo" });
  private readonly slotCab = h("div", {});
  private readonly corpo = h("div", { class: "prj-corpo" });
  private readonly cartao = h("div", { class: "prj-cartao" }, this.slotCab, this.corpo);
  private readonly slotVazio = h("div", {});

  constructor(private readonly d: DepsApp) {
    this.eu = { login: d.ctx.login, nome: d.ctx.nome };
    this.chaveAba = chaveAberto(d.ctx.host, d.ctx.login, d.ctx.unidade?.id ?? "");
  }

  /** "todos" ou o id do projeto aberto. */
  get aberto(): string {
    return this.abertoAtual;
  }

  async iniciar(): Promise<void> {
    this.prefs = await lerPreferencias(this.d.area);
    this.abertoAtual = this.prefs.abertos[this.chaveAba] ?? "todos";
    await this.recarregar();
    for (const r of Object.values(this.d.repos)) this.paradas.push(r.aoMudar(() => this.agendar()));
    this.paradas.push((this.d.sincronia ?? SEM_SINCRONIA).aoMudar(() => this.render()));
    this.d.raiz.replaceChildren(h("div", { class: "prj" }, this.slotTopo, this.cartao, this.slotVazio));
    this.render();
  }

  destruir(): void {
    for (const p of this.paradas) p();
    this.paradas = [];
    if (this.agendado) clearTimeout(this.agendado);
    this.balao?.fechar();
    this.descartarVista();
    this.d.raiz.replaceChildren();
  }

  /** A janela mudou de largura: as abas que cabem mudam. */
  aoRedimensionar(): void {
    this.render();
  }

  // ---------- dados ----------

  private agendar(): void {
    if (this.agendado) clearTimeout(this.agendado);
    this.agendado = setTimeout(() => {
      this.agendado = null;
      void this.recarregar().then(() => this.render());
    }, 30);
  }

  private async recarregar(): Promise<void> {
    this.dados = await carregarUnidade(this.d.repos, this.d.hoje());
    if (this.abertoAtual !== "todos" && !this.dados.ativos.some((p) => p.projeto.id === this.abertoAtual)) this.abertoAtual = "todos";
  }

  private projeto(id: string): ProjetoNaTela | undefined {
    return this.dados.ativos.find((p) => p.projeto.id === id) ?? this.dados.arquivados.find((p) => p.projeto.id === id);
  }

  private projetoAberto(): ProjetoNaTela | undefined {
    return this.abertoAtual === "todos" ? undefined : this.dados.ativos.find((p) => p.projeto.id === this.abertoAtual);
  }

  private repoDe(vis: Vis): RepositorioProjetos {
    return this.d.repos[vis];
  }

  private processos(): Promise<ProcessoDaCaixa[]> {
    this.processosMemo ??= this.d.rpc.chamar<ProcessoDaCaixa[]>("processosDaCaixa").catch(() => []);
    return this.processosMemo;
  }

  private usuarios(): Promise<UsuarioDaUnidade[]> {
    this.usuariosMemo ??= this.d.rpc.chamar<UsuarioDaUnidade[]>("usuariosDaUnidade", undefined, 60_000).catch(() => []);
    return this.usuariosMemo;
  }

  private conferirDocumento = (numero: string): Promise<DocumentoConferido | null> =>
    this.d.rpc.chamar<DocumentoConferido | null>("conferirDocumento", { numero }, 30_000);

  /** Na memória já; no armazenamento em fila (ler-mesclar-gravar não pode correr em paralelo). */
  private mudarPrefs(parcial: Partial<Preferencias>): void {
    this.prefs = normalizarPreferencias({ ...this.prefs, ...parcial });
    this.gravacao = this.gravacao.then(() => gravarPreferencias(this.d.area, parcial)).catch(() => undefined);
  }

  // ---------- desenho ----------

  private render(): void {
    this.balao?.fechar();
    const sinc = (this.d.sincronia ?? SEM_SINCRONIA).estado();
    const menu = criarMenuAjustes(() => ({
      mostrarLista: this.prefs.mostrarLista,
      moverDependentes: this.prefs.moverDependentes,
      ordemEtapas: this.prefs.ordemEtapas,
      arquivados: this.dados.arquivados.length,
      extensoes: this.d.extensoesMenu,
      aoMostrarLista: (v) => this.ajustar({ mostrarLista: v }),
      aoMoverDependentes: (v) => this.ajustar({ moverDependentes: v }),
      aoOrdenar: (o) => this.ajustar({ ordemEtapas: o }),
      aoExportar: () => this.exportar(),
      aoImprimir: () => this.imprimir(),
      aoArquivados: () => this.abrirArquivados(),
    }));
    if (!this.dados.ativos.length) {
      this.descartarVista();
      this.slotTopo.replaceChildren(
        h("div", { class: "prj-abas prj-abas-vazio" }, h("div", { class: "prj-abas-dir" }, indicadorDeSincronia(sinc), menu)),
      );
      this.cartao.hidden = true;
      this.slotVazio.replaceChildren(
        montarVazio({
          aoCriar: () => this.novoProjeto(false),
          aoModelo: () => this.novoProjeto(true),
          aoImportar: this.d.ctx.atividades ? this.d.importarAtividades : undefined,
        }),
      );
      this.depoisDeDesenhar();
      return;
    }
    this.slotVazio.replaceChildren();
    this.cartao.hidden = false;
    const largura = this.d.largura?.() ?? this.d.raiz.ownerDocument.documentElement.clientWidth ?? 0;
    this.slotTopo.replaceChildren(
      montarAbas({
        ativos: this.dados.ativos,
        aberto: this.abertoAtual,
        limite: limiteDeAbas(largura),
        sincronia: sinc,
        menu,
        aoEscolher: (id) => this.escolher(id),
        aoNovo: () => this.novoProjeto(false),
      }),
    );
    const p = this.projetoAberto();
    this.filtro?.fechar();
    this.filtro = criarBotaoFiltro({
      filtro: this.prefs.filtro,
      etapas: p ? p.etapas : this.dados.ativos.flatMap((x) => x.etapas),
      fases: p?.fases,
      hoje: this.d.hoje(),
      aoMudar: (f) => this.mudarFiltro(f),
    });
    const vista = this.semGantt ? "lista" : this.prefs.vista;
    const escala = p ? escalaDoProjeto(this.prefs, p.projeto.id) : this.prefs.escalaTodos;
    this.slotCab.replaceChildren(
      montarCabecalho({
        modo: p ? "projeto" : "todos",
        projeto: p,
        totais: { ativos: this.dados.ativos.length, arquivados: this.dados.arquivados.length },
        vista,
        escala,
        filtro: this.filtro.el,
        aoVista: (v) => {
          if (v === "gantt") this.semGantt = false;
          this.ajustar({ vista: v });
        },
        aoEscala: (e) => this.mudarEscala(e),
        aoHoje: () => this.vista?.rolarParaHoje(),
        aoPrimario: () => (p ? this.novaEtapa(p.projeto.id) : this.novoProjeto(false)),
        aoEditarProjeto: () => p && this.editarProjeto(p.projeto.id),
        aoAbrirProcesso: (ev) => p?.projeto.processo && this.abrirProcesso(p.projeto.processo, ev),
      }),
    );
    this.pintarCorpo();
    this.depoisDeDesenhar();
  }

  private depoisDeDesenhar(): void {
    fecharOrfaos();
    this.d.aoRedesenhar?.();
  }

  private descartarVista(): void {
    this.vista?.destruir();
    this.vista = null;
    this.chaveVista = "";
  }

  private semResultado(texto: string): void {
    this.descartarVista();
    this.corpo.replaceChildren(
      h(
        "div",
        { class: "prj-nada" },
        h("p", {}, texto),
        h("button", { type: "button", class: "spro-botao pequeno", onclick: () => this.mudarFiltro(FILTRO_VAZIO) }, "Limpar filtro"),
      ),
    );
  }

  /** Ids das etapas que passam no filtro (undefined = sem filtro). */
  private visiveis(p: ProjetoNaTela): Set<string> | undefined {
    if (!criteriosAtivos(this.prefs.filtro)) return undefined;
    return new Set(filtrarEtapas(p.etapas, this.prefs.filtro, this.d.hoje(), this.eu).map((e) => e.id));
  }

  private pintarCorpo(): void {
    const hoje = this.d.hoje();
    const vista = this.semGantt ? "lista" : this.prefs.vista;
    const p = this.projetoAberto();
    if (p) {
      const visiveis = this.visiveis(p);
      if (visiveis && !visiveis.size && p.etapas.length) {
        this.semResultado("Nenhuma etapa nesse filtro.");
        return;
      }
      const base = { projeto: p.projeto.id, fases: p.fases, etapas: p.etapas };
      if (vista === "lista") {
        this.descartarVista();
        this.corpo.replaceChildren(
          montarTabelaEtapas(linhasDoProjeto(base, { hoje, ordem: this.prefs.ordemEtapas, recolhidas: new Set(), visiveis }), {
            hoje,
            aoClicar: (id, ancora) => this.abrirBalao(p.projeto.id, id, ancora),
          }),
        );
        return;
      }
      const dados = {
        linhas: linhasDoProjeto(base, { hoje, ordem: this.prefs.ordemEtapas, recolhidas: new Set(this.prefs.recolhidas), visiveis }),
        mostrarLista: this.prefs.mostrarLista,
        escala: escalaDoProjeto(this.prefs, p.projeto.id),
        hoje,
        moverDependentes: this.prefs.moverDependentes,
      };
      const chave = `p:${p.projeto.id}`;
      if (this.vista instanceof VistaProjeto && this.chaveVista === chave && this.corpo.contains(this.vista.el))
        this.vista.atualizar(dados);
      else {
        this.descartarVista();
        const id = p.projeto.id;
        this.vista = new VistaProjeto(dados, {
          montarGantt: this.d.montarGantt,
          aoClicarEtapa: (etapa, ancora) => this.abrirBalao(id, etapa, ancora),
          aoAlternarFase: (f) => this.alternarFase(f),
          aoAdicionar: (nome) => void this.adicionarEtapa(id, nome),
          validar: (m) => this.validarArraste(id, m),
          aoMudarDatas: (m) => void this.moverDatas(id, m),
          aoRecusar: (msg) => avisar(msg),
          aoFalharGantt: () => this.falhouGantt(),
        });
        this.chaveVista = chave;
        this.corpo.replaceChildren(this.vista.el);
      }
      if (this.focarNova && this.vista instanceof VistaProjeto) {
        this.focarNova = false;
        this.vista.focarNova();
      }
      return;
    }
    const itens = this.dados.ativos.filter((x) => projetoNoFiltro(x, this.prefs.filtro, hoje, this.eu));
    if (!itens.length) {
      this.semResultado("Nenhum projeto com etapas nesse filtro.");
      return;
    }
    if (vista === "lista") {
      this.descartarVista();
      this.corpo.replaceChildren(montarTabelaProjetos(itens, { aoAbrir: (id) => this.escolher(id) }));
      return;
    }
    const dados = { itens, mostrarLista: this.prefs.mostrarLista, escala: this.prefs.escalaTodos, hoje };
    if (this.vista instanceof VistaTodos && this.chaveVista === "todos" && this.corpo.contains(this.vista.el)) this.vista.atualizar(dados);
    else {
      this.descartarVista();
      this.vista = new VistaTodos(dados, {
        montarGantt: this.d.montarGantt,
        aoAbrir: (id) => this.escolher(id),
        aoFalharGantt: () => this.falhouGantt(),
      });
      this.chaveVista = "todos";
      this.corpo.replaceChildren(this.vista.el);
    }
  }

  /** Spec 9: a Frappe não montou; a vista Lista assume, com um aviso discreto. */
  private falhouGantt(): void {
    if (this.semGantt) return;
    this.semGantt = true;
    avisar("O Gantt não abriu neste navegador; mostrando a lista.");
    queueMicrotask(() => this.render());
  }

  // ---------- navegação e preferências ----------

  private escolher(id: string): void {
    this.abertoAtual = id;
    this.mudarPrefs({ abertos: { ...this.prefs.abertos, [this.chaveAba]: id } });
    this.render();
  }

  private ajustar(parcial: Partial<Preferencias>): void {
    this.mudarPrefs(parcial);
    this.render();
  }

  private mudarEscala(e: Preferencias["escalaTodos"]): void {
    const p = this.projetoAberto();
    if (p) this.mudarPrefs({ escalas: { ...this.prefs.escalas, [p.projeto.id]: e } });
    else this.mudarPrefs({ escalaTodos: e });
    this.render();
    if (p && !escalaEditavel(e)) avisar("Nesta escala as datas ficam só para leitura: arraste em Dia ou Semana.", undefined, 5000);
  }

  private mudarFiltro(f: FiltroEtapas): void {
    this.mudarPrefs({ filtro: f });
    this.filtro?.definir(this.prefs.filtro);
    this.pintarCorpo();
    this.d.aoRedesenhar?.();
  }

  private alternarFase(faseId: string): void {
    const r = new Set(this.prefs.recolhidas);
    if (r.has(faseId)) r.delete(faseId);
    else r.add(faseId);
    this.mudarPrefs({ recolhidas: [...r] });
    this.pintarCorpo();
    this.d.aoRedesenhar?.();
  }

  /** Pílula do título do painel (pela aba): abre o projeto se só um tem o alerta; senão o Todos filtrado. */
  aplicarAlerta(tipo: TipoAlerta): void {
    const al = alertasDaUnidade(this.dados.ativos, this.d.hoje());
    const ids = tipo === "atrasadas" ? al.comAtraso : al.comSemana;
    this.abertoAtual = ids.length === 1 ? (ids[0] ?? "todos") : "todos";
    if (this.prefs.vista === "lista") this.mudarPrefs({ vista: "gantt" });
    this.mudarPrefs({
      filtro: { ...FILTRO_VAZIO, situacoes: [tipo === "atrasadas" ? "atrasadas" : "semana"] },
      abertos: { ...this.prefs.abertos, [this.chaveAba]: this.abertoAtual },
    });
    this.render();
  }

  /** "Abrir no painel" (P5: caixa, árvore, lateral): o projeto e, se vier, o balão da etapa. */
  focarProjeto(id: string, etapa?: string): boolean {
    const p = this.dados.ativos.find((x) => x.projeto.id === id);
    if (!p) return false;
    const e = etapa ? p.etapas.find((x) => x.id === etapa) : undefined;
    // A etapa pedida tem de aparecer: sai o filtro que a esconde e abre a fase dela.
    if (e && this.visiveis(p)?.has(e.id) === false) this.mudarPrefs({ filtro: FILTRO_VAZIO });
    if (e?.fase && this.prefs.recolhidas.includes(e.fase))
      this.mudarPrefs({ recolhidas: this.prefs.recolhidas.filter((f) => f !== e.fase) });
    this.escolher(id);
    if (e) {
      const alvo = [...this.corpo.querySelectorAll("[data-id]")].find(
        (el) => el.getAttribute("data-id") === e.id && !el.classList.contains("bar-wrapper"),
      );
      if (alvo) this.abrirBalao(id, e.id, alvo);
    }
    return true;
  }

  // ---------- projetos ----------

  private sigla(): string {
    return this.d.ctx.unidade?.sigla || "unidade";
  }

  private novoProjeto(deModelo: boolean): void {
    abrirDialogoProjeto({
      abrirModal: this.d.abrirModal,
      hoje: this.d.hoje(),
      sigla: this.sigla(),
      modelos: this.dados.modelos,
      comecarDeModelo: deModelo,
      processos: () => this.processos(),
      salvar: async (r) => {
        const repo = this.repoDe(r.vis);
        const dados = { nome: r.nome, processo: r.processo };
        const novo = r.modelo ? await repo.criarProjetoDeModelo(dados, r.modelo.modelo, r.modelo.inicio) : await repo.criarProjeto(dados);
        await this.recarregar();
        this.escolher(novo.id);
      },
    });
  }

  private editarProjeto(id: string): void {
    const p = this.projeto(id);
    if (!p) return;
    const repo = this.repoDe(p.vis);
    const nome = p.projeto.nome;
    abrirDialogoProjeto({
      abrirModal: this.d.abrirModal,
      hoje: this.d.hoje(),
      sigla: this.sigla(),
      projeto: p,
      modelos: this.dados.modelos,
      processos: () => this.processos(),
      salvar: (r) => this.salvarProjeto(p, r),
      arquivar: async () => {
        await repo.arquivarProjeto(id);
        avisar(`Projeto “${nome}” arquivado.`, {
          rotulo: "Desfazer",
          fazer: () => void repo.reativarProjeto(id).catch((e) => avisar(mensagem(e))),
        });
      },
      reativar: async () => {
        await repo.reativarProjeto(id).catch((e) => avisar(mensagem(e)));
      },
      duplicar: async () => {
        try {
          const copia = await repo.duplicarProjeto(id);
          await this.recarregar();
          this.escolher(copia.id);
        } catch (e) {
          avisar(mensagem(e));
        }
      },
      salvarComoModelo: () =>
        pedirNomeDoModelo({
          abrirModal: this.d.abrirModal,
          sugestao: nome,
          salvar: async (n) => {
            const m = await repo.salvarComoModelo(id, n);
            avisar(`Modelo “${m.nome}” salvo.`);
          },
        }),
      excluir: () => this.excluirProjeto(p),
    });
  }

  private async salvarProjeto(p: ProjetoNaTela, r: ResultadoProjeto): Promise<void> {
    const id = p.projeto.id;
    await this.repoDe(p.vis).editarProjeto(id, { nome: r.nome, processo: r.processo });
    if (r.vis === p.vis) return;
    const texto =
      r.vis === "unidade"
        ? `“${r.nome}” vai ficar visível para toda a unidade (${this.sigla()}): quem usa o SEI Pro nela vê e edita.`
        : `“${r.nome}” vai sair de “${rotuloDaVis("unidade")}” e ficar só para você, nesta unidade.`;
    if (!(await this.d.confirmar(texto, "Mudar"))) return;
    await moverEntreEscopos(this.repoDe(p.vis), this.repoDe(r.vis), id);
  }

  private async excluirProjeto(p: ProjetoNaTela): Promise<void> {
    const n = p.etapas.length;
    const texto = `Excluir o projeto “${p.projeto.nome}”${n ? ` e ${plural(n, "etapa", "etapas")}` : ""}?`;
    if (!(await this.d.confirmar(texto, "Excluir"))) return;
    const repo = this.repoDe(p.vis);
    await repo.removerProjeto(p.projeto.id);
    avisar(`Projeto “${p.projeto.nome}” excluído.`, {
      rotulo: "Desfazer",
      fazer: () => void repo.restaurarProjeto(p.projeto.id).catch((e) => avisar(mensagem(e))),
    });
  }

  private abrirArquivados(): void {
    abrirArquivados({
      abrirModal: this.d.abrirModal,
      arquivados: this.dados.arquivados,
      reativar: async (id) => {
        const p = this.projeto(id);
        if (!p) return;
        try {
          await this.repoDe(p.vis).reativarProjeto(id);
        } catch (e) {
          avisar(mensagem(e));
          throw e;
        }
      },
      excluir: async (id) => {
        const p = this.projeto(id);
        if (p) await this.excluirProjeto(p);
      },
    });
  }

  // ---------- etapas ----------

  private etiquetasEmUso(): string[] {
    return [...new Set(this.dados.ativos.flatMap((p) => [...p.projeto.etiquetas, ...p.etapas.flatMap((e) => e.etiquetas)]))];
  }

  private dialogoEtapa(p: ProjetoNaTela, etapa?: Etapa, secao?: "historico"): void {
    const repo = this.repoDe(p.vis);
    abrirDialogoEtapa({
      abrirModal: this.d.abrirModal,
      projeto: p,
      etapa,
      inicial: etapa ? undefined : datasDaEtapaNova(p.etapas, this.d.hoje()),
      hoje: this.d.hoje(),
      agora: this.d.agora(),
      usuarios: () => this.usuarios(),
      processos: () => this.processos(),
      etiquetas: this.etiquetasEmUso(),
      historico: () => repo.historico(p.projeto.id),
      conferirDocumento: this.conferirDocumento,
      secaoAberta: secao,
      salvar: (r) => this.salvarEtapa(p, r, etapa),
      excluir: etapa ? () => this.excluirEtapa(p, etapa) : undefined,
    });
  }

  private novaEtapa(projetoId: string): void {
    const p = this.projeto(projetoId);
    if (p) this.dialogoEtapa(p);
  }

  private async salvarEtapa(p: ProjetoNaTela, r: ResultadoEtapa, etapa?: Etapa): Promise<void> {
    const repo = this.repoDe(p.vis);
    const fase = r.novaFase ? (await repo.criarFase(p.projeto.id, r.novaFase)).id : r.fase;
    const campos = {
      nome: r.nome,
      inicio: r.inicio,
      fim: r.fim,
      marco: r.marco,
      fase,
      dependeDe: r.dependeDe,
      responsavel: r.responsavel,
      medida: r.medida,
      checklist: r.checklist,
      processo: r.processo,
      documento: r.documento,
      etiquetas: r.etiquetas,
      observacoes: r.observacoes,
    };
    if (etapa) await repo.editarEtapa(etapa.id, campos, this.d.hoje());
    else await repo.criarEtapa({ projeto: p.projeto.id, ...campos });
  }

  private async adicionarEtapa(projetoId: string, nome: string): Promise<void> {
    const p = this.projeto(projetoId);
    if (!p) return;
    try {
      this.focarNova = true;
      await this.repoDe(p.vis).criarEtapa({ projeto: projetoId, nome, ...datasDaEtapaNova(p.etapas, this.d.hoje()) });
    } catch (e) {
      this.focarNova = false;
      avisar(mensagem(e));
    }
  }

  private abrirBalao(projetoId: string, etapaId: string, ancora: Element): void {
    const p = this.projeto(projetoId);
    const e = p?.etapas.find((x) => x.id === etapaId);
    if (!p || !e) return;
    const repo = this.repoDe(p.vis);
    const hoje = this.d.hoje();
    const tentar = (f: () => Promise<unknown>) => void f().catch((erro) => avisar(mensagem(erro)));
    this.balao?.fechar();
    this.balao = abrirBalaoEtapa(
      ancora,
      { etapa: e, projeto: p, hoje },
      {
        aoConcluir: () => tentar(() => this.concluir(p, e)),
        aoReabrir: () =>
          tentar(async () => {
            await repo.reabrirEtapa(e.id);
            avisar(`“${e.nome}” reaberta.`);
          }),
        aoEditar: (s) => this.dialogoEtapa(p, e, s),
        aoProgresso: (n) => tentar(() => repo.editarEtapa(e.id, { progresso: Math.max(0, Math.min(100, Math.round(n))) }, hoje)),
        aoAbrirDocumento: (numero) => tentar(() => this.d.rpc.chamar("abrirDocumento", { numero })),
        aoAbrirProcesso: (v, ev) => this.abrirProcesso(v, ev),
        aoDuplicar: () =>
          tentar(async () => {
            await repo.criarEtapa({
              projeto: p.projeto.id,
              nome: `Cópia de ${e.nome}`.slice(0, 200),
              inicio: e.inicio,
              fim: e.fim,
              marco: e.marco,
              fase: e.fase,
              dependeDe: e.dependeDe,
              responsavel: e.responsavel,
              medida: e.medida,
              checklist: e.checklist.map((i) => ({ ...i, feito: false })),
              processo: e.processo,
              etiquetas: e.etiquetas,
              observacoes: e.observacoes,
            });
            avisar("Etapa duplicada.");
          }),
        aoMoverFase: (f) => tentar(() => repo.editarEtapa(e.id, { fase: f }, hoje)),
        aoExcluir: () => tentar(() => this.excluirEtapa(p, e)),
      },
      () => {
        this.balao = null;
      },
    );
  }

  /**
   * Concluir com 1 clique (data de hoje) + aviso "Informar documento" | "Desfazer".
   * Etapa que já está concluída não é concluída de novo (a data mudaria).
   */
  private async concluir(p: ProjetoNaTela, e: Etapa): Promise<void> {
    const repo = this.repoDe(p.vis);
    const hoje = this.d.hoje();
    const atual = await repo.obterEtapa(e.id);
    if (!atual || atual.concluidaEm) return;
    await repo.concluirEtapa(e.id, hoje);
    avisar(`“${e.nome}” ${e.marco ? "cumprido" : "concluída"} hoje (${dataCurta(hoje)}).`, [
      {
        rotulo: "Informar documento",
        fazer: () =>
          void repo.obterEtapa(e.id).then((viva) => {
            if (!viva) return;
            abrirInformarDocumento({
              abrirModal: this.d.abrirModal,
              etapa: viva,
              hoje,
              conferirDocumento: this.conferirDocumento,
              salvar: async (numero, data) => {
                await repo.concluirEtapa(
                  e.id,
                  data,
                  numero ? (numero === viva.documento?.numero ? viva.documento : { numero }) : undefined,
                );
              },
            });
          }),
      },
      {
        rotulo: "Desfazer",
        fazer: () =>
          void repo.obterEtapa(e.id).then((viva) => {
            // Só desfaz a conclusão de hoje (alguém pode ter mexido no meio).
            if (viva?.concluidaEm === hoje) return repo.reabrirEtapa(e.id);
          }),
      },
    ]);
  }

  private async excluirEtapa(p: ProjetoNaTela, e: Etapa): Promise<void> {
    const repo = this.repoDe(p.vis);
    await repo.removerEtapa(e.id);
    avisar(`Etapa “${e.nome}” excluída.`, {
      rotulo: "Desfazer",
      fazer: () => void repo.restaurarEtapa(e.id).catch((x) => avisar(mensagem(x))),
    });
  }

  /** Mudanças do arraste com as dependentes (preferência) e a recusa antes de gravar. */
  private completar(projetoId: string, m: MudancaDeDatas[]): MudancaDeDatas[] {
    const p = this.projeto(projetoId);
    return p && this.prefs.moverDependentes ? completarComDependentes(p.etapas, m) : m;
  }

  private validarArraste(projetoId: string, m: MudancaDeDatas[]): string | null {
    const p = this.projeto(projetoId);
    if (!p) return "O projeto não existe mais.";
    const todas = new Map(this.completar(projetoId, m).map((x) => [x.id, x]));
    const depois = p.etapas.map((e) => {
      const x = todas.get(e.id);
      return x ? { ...e, inicio: x.inicio, fim: e.marco ? x.inicio : x.fim } : e;
    });
    return violacoesDeDatas(depois, new Set(todas.keys()))[0] ?? null;
  }

  private async moverDatas(projetoId: string, m: MudancaDeDatas[]): Promise<void> {
    const p = this.projeto(projetoId);
    if (!p) return;
    try {
      await this.repoDe(p.vis).moverDatas(this.completar(projetoId, m), this.d.hoje());
    } catch (e) {
      avisar(mensagem(e));
      // O Gantt já mostra a barra no lugar novo: volta ao que está gravado.
      this.pintarCorpo();
    }
  }

  private abrirProcesso(v: Vinculo, ev?: MouseEvent): void {
    const novaAba = !!(ev?.ctrlKey || ev?.metaKey);
    void this.d.rpc
      .chamar("abrirProcesso", { id: v.idProcedimento ?? "", protocolo: v.protocolo, novaAba })
      .catch((e) => avisar(mensagem(e)));
  }

  // ---------- exportar e imprimir ----------

  /** O que está na tela: a aba aberta (ou o portfólio), com o filtro aplicado às etapas. */
  private itensNaTela(): ProjetoNaTela[] {
    const hoje = this.d.hoje();
    const p = this.projetoAberto();
    const base = p ? [p] : this.dados.ativos.filter((x) => projetoNoFiltro(x, this.prefs.filtro, hoje, this.eu));
    if (!criteriosAtivos(this.prefs.filtro)) return base;
    return base.map((x) => ({ ...x, etapas: filtrarEtapas(x.etapas, this.prefs.filtro, hoje, this.eu) }));
  }

  private exportar(): void {
    const hoje = this.d.hoje();
    const p = this.projetoAberto();
    this.d.baixar(nomeDoCsv(p?.projeto.nome ?? null, hoje), csvDosProjetos(this.itensNaTela(), hoje), "text/csv;charset=utf-8");
  }

  private imprimir(): void {
    const p = this.projetoAberto();
    if (!this.d.imprimir || !this.d.ctx.unidade) return;
    this.d.imprimir({
      host: this.d.ctx.host,
      login: this.d.ctx.login,
      unidade: this.d.ctx.unidade.id,
      projeto: p?.projeto.id ?? "todos",
      escala: p ? escalaDoProjeto(this.prefs, p.projeto.id) : this.prefs.escalaTodos,
      lista: this.prefs.mostrarLista,
    });
  }
}
```

- [ ] **Step 4: Rodar as provas (duas vezes: há esperas de 30 ms do redesenho)**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `628 ok, 0 falha(s)` (+37 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsc --noEmit && npx biome check src tests
```
Expected: o `tsc` sem saída; o Biome termina com `No fixes applied.` e sem erro (rode `npx biome check --write src tests` se só a formatação reclamar).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/app.ts \
  projetos/tests/verificar-app.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: app do painel embutido (orquestracao)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 12: Projetos — content script: painel, executor RPC, usuários, conferência e alertas no título

**Files:**
- Create: `projetos/tsconfig.pagina.json`, `projetos/src/pagina/marca.ts`, `projetos/src/pagina/contexto.ts`, `projetos/src/pagina/painel.ts`, `projetos/src/pagina/usuarios.ts`, `projetos/src/pagina/documento.ts`, `projetos/src/pagina/executor.ts`, `projetos/src/pagina/main.ts`
- Create (apoio às provas): `projetos/tests/pagina/util.ts`
- Modify: `projetos/tsconfig.json`, `projetos/package.json`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/pagina/verificar-pagina.ts`

**Interfaces:**
- Consumes: `lerContexto`, `Sei`, `paginaDe`, `lerCaixaDaPagina`, `ProcessoNaCaixa`, `listarOpcoes`, `Formulario`, `criarHttp`, `parametros`, `decodificarEntidades`, `ErroSei`, `Pagina` (sei-nucleo); `montarPainelEmbutido`, `instalarEstiloPainel`, `ordemLegada`, `ligarPortaDoPainel` (com `rpc()`, T1), `tratadoresDoPainel`, `avisoNaPagina`, `avisoComAcoesNaPagina`, `abrirProcesso` (`@comum/pagina/abrir`), `lerOpcaoLegada`, `temaEscuroLegado`, `corDoTemaSei`; `carregarUnidade`, `alertasDaUnidade`, `lerPreferencias`, `gravarPreferencias` (T2); `RepositorioProjetos`, `escoposDaUnidade`, `chaveUsuarios` (P2); `favoritos/tests/util.ts` (`telaSei`).
- Produces: `ATRIBUTO_ATIVO`, `marcarAtivo(doc)`; `contextoProjetos(doc, extras, url?)`, `atividadesConfigurado(armazenamento)`; `ID_PAINEL = "projetosPro"`, `ID_LEGADO = "projetosGantt"`, `ordemDoPainel(armazenamento)`, `OpcoesPainelProjetos`, `montarPainelProjetos(doc, o) → PainelMontado | null`, `pintarAlertas(titulo, { atrasadas; semana }, temaEscuro, aoClicar)`; `usuariosDaCaixa(doc)`, `usuarioDaOpcao(texto)`, `processoSeguroDaCaixa(doc)`, `DepsUsuarios`, `usuariosDaUnidade(d)`; `conferirDocumento(pesquisar, numero)`; `DepsExecutor`, `processosDaCaixa(doc)`, `tratadoresProjetos(d)`; o content script `src/pagina/main.ts`.

- [ ] **Step 1: Separar o tsconfig do content script**

Em `projetos/tsconfig.json`, troque:

```json
  "include": ["src/**/*.ts", "tests/**/*.ts"]
```

por:

```json
  "include": ["src/**/*.ts", "tests/**/*.ts"],
  "exclude": ["src/pagina", "tests/pagina"]
```

Arquivo completo `projetos/tsconfig.pagina.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noUncheckedIndexedAccess": false
  },
  "include": ["src/pagina/**/*.ts", "tests/pagina/**/*.ts"],
  "exclude": []
}
```

Em `projetos/package.json`, troque:

```json
    "tipos": "tsc --noEmit",
```

por:

```json
    "tipos": "tsc --noEmit && tsc --noEmit -p tsconfig.pagina.json",
```

- [ ] **Step 2: Escrever a prova que falha**

Arquivo completo `projetos/tests/pagina/util.ts`:

```ts
/**
 * Provas do content script: as telas reais do SEI (fixtures do núcleo) e os
 * mesmos contadores das outras provas do pacote (o módulo é o mesmo arquivo).
 * Ficam fora do tsconfig.json do pacote: o núcleo do SEI não segue
 * `noUncheckedIndexedAccess` (tsconfig.pagina.json).
 */

export { combo, telaSei, tique } from "../../../favoritos/tests/util";
export { botao, checar, disparar, instalarDom, lanca, secao } from "../util";
```

Arquivo completo `projetos/tests/pagina/verificar-pagina.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { avisoComAcoesNaPagina } from "@comum/painel/aviso";
import { ErroSei } from "@nucleo/sessao/erros";
import type { Pagina } from "@nucleo/sessao/http";
import { atividadesConfigurado, contextoProjetos } from "../../src/pagina/contexto";
import { conferirDocumento } from "../../src/pagina/documento";
import { processosDaCaixa, tratadoresProjetos } from "../../src/pagina/executor";
import { ATRIBUTO_ATIVO, marcarAtivo } from "../../src/pagina/marca";
import { ID_PAINEL, montarPainelProjetos, ordemDoPainel, pintarAlertas } from "../../src/pagina/painel";
import { processoSeguroDaCaixa, usuarioDaOpcao, usuariosDaCaixa, usuariosDaUnidade } from "../../src/pagina/usuarios";
import type { ContextoProjetos } from "../../src/ponte/tipos";
import { botao, checar, instalarDom, lanca, secao, telaSei, tique } from "./util";

const DIA = 86_400_000;

export async function verificarPagina(): Promise<void> {
  secao("pagina: marca para o legado e contexto");
  const { doc, pagina } = telaSei("sei41/caixa.html");
  marcarAtivo(doc);
  checar(
    "marca o <html> (o init.js le)",
    ATRIBUTO_ATIVO === "data-seipro-projetos" && doc.documentElement.hasAttribute("data-seipro-projetos"),
  );
  const ctx = contextoProjetos(doc, { temaEscuro: true, corTema: "#155b9c", atividades: false }, pagina.url);
  checar(
    "contexto do cabecalho do SEI",
    ctx?.host === "treinamento.sei.sp.gov.br" &&
      ctx.login === "pedro.soares" &&
      ctx.nome === "Pedro Soares" &&
      ctx.unidade?.id === "110000001" &&
      ctx.temaEscuro &&
      ctx.corTema === "#155b9c",
    ctx,
  );
  checar("sem usuario no cabecalho, sem contexto", contextoProjetos(instalarDom(), { temaEscuro: false, atividades: false }) === null);
  const loja = (v: string | null) => ({ getItem: () => v });
  checar(
    "servidor do Atividades: so com URL_API e KEY_USER",
    atividadesConfigurado(loja('{"URL_API":"https://x/api","KEY_USER":"k"}')) &&
      !atividadesConfigurado(loja('{"URL_API":"https://x/api"}')) &&
      !atividadesConfigurado(loja("nao e json")) &&
      !atividadesConfigurado(loja(null)),
  );

  secao("pagina: painel no Controle de Processos");
  const { doc: docP } = telaSei("sei41/caixa.html");
  let recolhidos: boolean[] = [];
  const mp = montarPainelProjetos(docP, {
    urlApp: "chrome-extension://abc/html/projetos.html#modo=embutido",
    temaEscuro: false,
    recolhido: false,
    ordem: null,
    aoRecolher: (r) => recolhidos.push(r),
  })!;
  checar(
    "painel proprio (id diferente do legado) no #panelHomePro",
    ID_PAINEL === "projetosPro" && mp.painel.id === "projetosPro" && mp.painel.parentElement?.id === "panelHomePro",
  );
  const titulo = mp.painel.querySelector(".spro-prj-titulo") as HTMLElement;
  checar("titulo Projetos com icone gantt", (titulo.textContent ?? "").includes("Projetos") && !!titulo.querySelector("svg path"));
  checar("iframe do app no modo embutido", mp.iframe.getAttribute("src")?.endsWith("#modo=embutido") === true);
  checar(
    "nao monta duas vezes",
    montarPainelProjetos(docP, { urlApp: "x", recolhido: false, ordem: null, aoRecolher: () => undefined }) === null,
  );
  const ordens = (o: unknown) => ({ getItem: () => JSON.stringify({ orderPanelHome: o }) });
  checar(
    "ordem: a do painel novo; sem ela, a do legado (projetosGantt)",
    ordemDoPainel(ordens([{ name: "projetosPro", index: 2 }])) === 2 &&
      ordemDoPainel(ordens([{ name: "projetosGantt", index: 4 }])) === 4 &&
      ordemDoPainel(ordens([])) === null,
  );
  const tipos: string[] = [];
  pintarAlertas(titulo, { atrasadas: 1, semana: 2 }, false, (t) => tipos.push(t));
  const pilulas = [...titulo.querySelectorAll(".spro-prj-pilula")].map((p) => p.textContent);
  checar("pilulas com plural certo", pilulas.join("|") === "1 atrasada|2 vencem nesta semana");
  botao(titulo, "2 vencem nesta semana")!.click();
  botao(titulo, "1 atrasada")!.click();
  checar("clique avisa o tipo", tipos.join() === "semana,atrasadas");
  pintarAlertas(titulo, { atrasadas: 0, semana: 0 }, false, () => undefined);
  checar(
    "sem alertas, sem pilulas (e sem caixa vazia ocupando lugar)",
    !titulo.querySelector(".spro-prj-pilula") && (titulo.querySelector(".spro-prj-alertas") as HTMLElement).hidden,
  );
  pintarAlertas(titulo, { atrasadas: 3, semana: 0 }, true, () => undefined);
  checar("modo noturno marca as pilulas", titulo.querySelector(".spro-prj-alertas")?.classList.contains("spro-prj-escuro") === true);
  (mp.painel.querySelector(".spro-prj-recolher") as HTMLButtonElement).click();
  checar(
    "recolher lembra (pilulas continuam no titulo)",
    recolhidos.join() === "true" && mp.corpo.hidden && !!titulo.querySelector(".spro-prj-pilula"),
  );
  recolhidos = [];

  secao("pagina: usuarios da unidade");
  const daCaixa = usuariosDaCaixa(doc);
  checar(
    "atribuicoes da caixa (login e nome)",
    daCaixa.some((u) => u.login === "pedro.soares" && u.nome === "Pedro Soares"),
    daCaixa,
  );
  checar(
    "opcao do SEI 'login - Nome'",
    JSON.stringify(usuarioDaOpcao("usuario02 - Usuario 02")) === '{"login":"usuario02","nome":"Usuario 02"}' &&
      usuarioDaOpcao("so nome")?.nome === "so nome",
  );
  const seguro = processoSeguroDaCaixa(doc);
  checar("processo para ler a lista completa: ja visualizado e nao sigiloso", !!seguro && !seguro.novo && !seguro.sigiloso);
  const area = areaMemoria();
  let buscas = 0;
  let falhar = false;
  const deps = (agora: number) => ({
    area,
    chave: "projetos/usuarios/x|u:1",
    agora,
    daCaixa: [{ login: "bruno", nome: "Bruno Reis" }],
    eu: { login: "ana", nome: "Ana Lima" },
    buscarCompleta: async () => {
      buscas += 1;
      if (falhar) throw new Error("sem processo");
      return [
        { login: "carla", nome: "Carla Dias" },
        { login: "ana", nome: "Ana Lima" },
      ];
    },
  });
  const u1 = await usuariosDaUnidade(deps(1_000));
  checar(
    "primeira vez: lista completa + caixa, eu primeiro, sem repetir",
    u1.map((u) => u.login).join() === "ana,bruno,carla" && buscas === 1,
    u1,
  );
  await usuariosDaUnidade(deps(1_000 + DIA - 1));
  checar("cache de 1 dia: nao busca de novo", buscas === 1);
  falhar = true;
  const u3 = await usuariosDaUnidade(deps(1_000 + DIA + 1));
  checar("venceu e a busca falhou: fica o que havia + caixa", buscas === 2 && u3.map((u) => u.login).join() === "ana,bruno,carla");
  await usuariosDaUnidade(deps(1_000 + DIA + 2));
  checar("sem lista completa, tenta de novo na proxima", buscas === 3);

  secao("pagina: conferir numero SEI pela pesquisa rapida");
  const { pagina: trab } = telaSei("sei41/trabalhar.html");
  const comUrl = (url: string): Pagina => ({ ...trab, url, html: trab.html, doc: trab.doc });
  const pedidos: string[] = [];
  const doc1 = await conferirDocumento(async (ref) => {
    pedidos.push(ref);
    return comUrl("https://sei.x/sei/controlador.php?acao=procedimento_trabalhar&id_protocolo=999&infra_hash=0");
  }, "SEI 1240001");
  checar(
    "documento: protocolo do processo pelo titulo da tela",
    pedidos.join() === "1240001" && doc1?.numero === "1240001" && doc1.protocolo === "99906.713-630.000032/2025-82",
    doc1,
  );
  checar(
    "numero de processo (nao de documento): nao serve",
    (await conferirDocumento(
      async () => comUrl("https://sei.x/sei/controlador.php?acao=procedimento_trabalhar&id_protocolo=148265"),
      "148265",
    )) === null,
  );
  checar(
    "nada encontrado: null",
    (await conferirDocumento(async () => {
      throw new ErroSei("SEI_NAO_ENCONTRADO", "Nada encontrado");
    }, "77")) === null,
  );
  checar(
    "sessao caiu: o erro sobe",
    (
      await lanca(() =>
        conferirDocumento(async () => {
          throw new ErroSei("SEI_SESSAO_EXPIRADA", "Sessao expirada");
        }, "77"),
      )
    )?.codigo === "SEI_SESSAO_EXPIRADA",
  );

  secao("pagina: executor RPC");
  const { doc: docE } = telaSei("sei41/caixa.html");
  const form = docE.querySelector("#frmProtocoloPesquisaRapida") as HTMLFormElement;
  const campo = docE.querySelector("#txtPesquisaRapida") as HTMLInputElement;
  const enviados: Array<{ valor: string; alvo: string | null }> = [];
  (form as unknown as { requestSubmit: () => void }).requestSubmit = () => {
    enviados.push({ valor: campo.value, alvo: form.getAttribute("target") });
  };
  const caixa = processosDaCaixa(docE);
  checar(
    "processos da caixa sem requisicao; sigiloso sem especificacao",
    caixa.length > 3 && caixa.every((p) => !p.sigiloso || !p.especificacao),
  );
  const CTX = { host: "h", login: "l", nome: "n", unidade: null, versao: "", temaEscuro: false, atividades: true } as ContextoProjetos;
  const trat = tratadoresProjetos({
    doc: docE,
    ctx: CTX,
    iframe: null,
    avisarAcoes: avisoComAcoesNaPagina(docE, false, "spro-prj"),
    usuarios: async () => [{ nome: "X" }],
    conferir: async (n) => ({ numero: n }),
  });
  checar("contexto e atividades", (await trat.contexto?.(null)) === CTX && (await trat.atividadesDisponivel?.(null)) === true);
  await trat.abrirDocumento?.({ numero: "SEI nº 1240001" });
  checar(
    "abrir documento: pesquisa rapida em aba nova",
    enviados[0]?.valor === "1240001" && enviados[0]?.alvo === "_blank" && form.getAttribute("target") !== "_blank",
  );
  checar(
    "abrir documento sem numero: erro claro",
    (await lanca(() => trat.abrirDocumento?.({ numero: "abc" })))?.codigo === "ARGUMENTO_INVALIDO",
  );
  checar(
    "usuarios e conferir passam adiante",
    JSON.stringify(await trat.usuariosDaUnidade?.(null)) === '[{"nome":"X"}]' &&
      JSON.stringify(await trat.conferirDocumento?.({ numero: "12" })) === '{"numero":"12"}',
  );
  const resposta = trat.aviso?.({
    texto: "Concluída.",
    acao: "Informar documento",
    acoes: ["Informar documento", "Desfazer"],
    ms: 5000,
  }) as Promise<number>;
  botao(docE.body, "Desfazer")!.click();
  checar("aviso com duas acoes na tela do SEI", (await resposta) === 1);
  await tique();
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarApp } from "./verificar-app";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppCsv } from "./verificar-app-csv";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppProjeto } from "./verificar-app-projeto";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
await verificarAppProjeto();
await verificarAppCsv();
await verificarApp();
// O content script importa o núcleo do SEI (tsconfig.pagina.json): caminho numa variável, para o tsc
// do pacote (com noUncheckedIndexedAccess) não seguir o import.
const suitePagina = "./pagina/verificar-pagina";
await ((await import(suitePagina)) as { verificarPagina(): Promise<void> }).verificarPagina();
resumo();
```

- [ ] **Step 3: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/pagina/contexto'`.

- [ ] **Step 4: Implementar**

Arquivo completo `projetos/src/pagina/marca.ts`:

```ts
/**
 * Sinal para o legado: com este atributo no <html>, o `init.js` não carrega o
 * `sei-pro-projetos.js` (salvo com servidor do Atividades, quando os dois
 * convivem). O content script roda no document_start, então o atributo existe
 * antes do `$(document).ready` do legado. Só o manifest Lab traz o módulo novo.
 */
export const ATRIBUTO_ATIVO = "data-seipro-projetos";

export function marcarAtivo(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_ATIVO, "1");
}
```

Arquivo completo `projetos/src/pagina/contexto.ts`:

```ts
/** Contexto da aba (spec 7): host, login, nome e unidade, lidos do cabeçalho do SEI. */

import { lerContexto } from "@nucleo/sei";
import { paginaDe } from "@nucleo/sessao/pagina";
import type { ContextoProjetos } from "../ponte/tipos";

export function contextoProjetos(
  doc: Document,
  extras: { temaEscuro: boolean; corTema?: string; atividades: boolean },
  url?: string,
): ContextoProjetos | null {
  const c = lerContexto(paginaDe(doc, url));
  if (!c.usuario.login) return null;
  const ctx: ContextoProjetos = {
    host: c.host,
    login: c.usuario.login.toLowerCase(),
    nome: c.usuario.nome,
    unidade: c.unidade.id ? { id: c.unidade.id, sigla: c.unidade.sigla, nome: c.unidade.nome } : null,
    versao: c.versao,
    temaEscuro: extras.temaEscuro,
    atividades: extras.atividades,
  };
  if (extras.corTema) ctx.corTema = extras.corTema;
  return ctx;
}

/** Servidor do Atividades configurado: o legado grava `configBasePro_atividades` com URL_API e KEY_USER. */
export function atividadesConfigurado(armazenamento: Pick<Storage, "getItem">): boolean {
  try {
    const c = JSON.parse(armazenamento.getItem("configBasePro_atividades") ?? "null") as { URL_API?: unknown; KEY_USER?: unknown } | null;
    return !!c && typeof c.URL_API === "string" && !!c.URL_API && !!c.KEY_USER;
  } catch {
    return false;
  }
}
```

Arquivo completo `projetos/src/pagina/painel.ts`:

```ts
/**
 * O painel "Projetos" abaixo da lista do Controle de Processos (montagem
 * genérica de `@comum/painel/embutido`) e as pílulas de alerta do título
 * ("N atrasada(s)", "N vence(m) nesta semana"), visíveis também com o painel
 * recolhido. A página do SEI não tem a base visual do SEI Pro: o estilo das
 * pílulas vai em linha numa folha própria, com cores fixas para os dois temas.
 */

import { instalarEstiloPainel, montarPainelEmbutido, ordemLegada, type PainelMontado } from "@comum/painel/embutido";
import { h, icone } from "@comum/ui/dom";
import type { TipoAlerta } from "../ponte/tipos";

export const ID_PAINEL = "projetosPro";
/** Id do painel legado (sei-pro-projetos.js): a ordem dele vale para o novo até o usuário mexer. */
export const ID_LEGADO = "projetosGantt";
const PREFIXO = "spro-prj";

export function ordemDoPainel(armazenamento: Pick<Storage, "getItem">): number | null {
  return ordemLegada(armazenamento, ID_PAINEL) ?? ordemLegada(armazenamento, ID_LEGADO);
}

function instalarEstilo(doc: Document): void {
  instalarEstiloPainel(doc, PREFIXO);
  if (doc.getElementById(`${PREFIXO}-alertas-estilo`)) return;
  const s = doc.createElement("style");
  s.id = `${PREFIXO}-alertas-estilo`;
  s.textContent = [
    `.${PREFIXO}-alertas{display:inline-flex;gap:6px;margin-left:10px}`,
    `.${PREFIXO}-pilula{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;font:600 12.5px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;border:0;border-radius:999px;cursor:pointer}`,
    `.${PREFIXO}-pilula:focus-visible{outline:2px solid #1a73e8;outline-offset:1px}`,
    `.${PREFIXO}-atrasadas{color:#b42318;background:rgb(209 53 43 / 12%)}`,
    `.${PREFIXO}-semana{color:#8a4b08;background:rgb(180 92 10 / 13%)}`,
    `.${PREFIXO}-escuro .${PREFIXO}-atrasadas{color:#ff7d73;background:rgb(255 125 115 / 16%)}`,
    `.${PREFIXO}-escuro .${PREFIXO}-semana{color:#e8b04a;background:rgb(232 176 74 / 16%)}`,
  ].join("\n");
  (doc.head ?? doc.documentElement).append(s);
}

export interface OpcoesPainelProjetos {
  urlApp: string;
  temaEscuro?: boolean;
  recolhido: boolean;
  ordem: number | null;
  aoRecolher(recolhido: boolean): void;
}

export function montarPainelProjetos(doc: Document, o: OpcoesPainelProjetos): PainelMontado | null {
  return montarPainelEmbutido(doc, {
    ...o,
    id: ID_PAINEL,
    titulo: "Projetos",
    tituloIframe: "Projetos do SEI Pro",
    prefixo: PREFIXO,
    rotulos: { mostrar: "Mostrar projetos", recolher: "Recolher projetos" },
    icone: () => {
      const g = icone("gantt", 22);
      g.setAttribute("style", `color:${o.temaEscuro ? "#79acff" : "#1f5fbf"}`);
      return g;
    },
    estilo: instalarEstilo,
    alturaInicial: 160,
  });
}

/** Pílulas do título; sem alerta, nenhuma (a caixa some). */
export function pintarAlertas(
  titulo: HTMLElement,
  a: { atrasadas: number; semana: number },
  temaEscuro: boolean,
  aoClicar: (t: TipoAlerta) => void,
): void {
  let caixa = titulo.querySelector<HTMLElement>(`.${PREFIXO}-alertas`);
  if (!caixa) {
    caixa = h("span", { class: `${PREFIXO}-alertas` });
    titulo.append(caixa);
  }
  caixa.classList.toggle(`${PREFIXO}-escuro`, temaEscuro);
  const pilula = (tipo: TipoAlerta, texto: string, dica: string) =>
    h("button", { type: "button", class: `${PREFIXO}-pilula ${PREFIXO}-${tipo}`, title: dica, onclick: () => aoClicar(tipo) }, texto);
  caixa.replaceChildren(
    ...(a.atrasadas
      ? [pilula("atrasadas", `${a.atrasadas} ${a.atrasadas === 1 ? "atrasada" : "atrasadas"}`, "Mostra as etapas atrasadas")]
      : []),
    ...(a.semana
      ? [pilula("semana", `${a.semana} ${a.semana === 1 ? "vence" : "vencem"} nesta semana`, "Etapas que vencem até sexta-feira")]
      : []),
  );
  caixa.hidden = !a.atrasadas && !a.semana;
}
```

Arquivo completo `projetos/src/pagina/usuarios.ts`:

```ts
/**
 * Usuários da unidade para o "Responsável" (spec 7): a lista completa vem do
 * formulário de atribuição do SEI (núcleo `opcoes.usuarios`), guardada por 1
 * dia; junto, sem requisição, as atribuições que a caixa já mostra e o próprio
 * usuário. A lista completa é lida a partir de um processo da caixa JÁ
 * VISUALIZADO e não sigiloso: abrir a árvore de um processo novo na unidade
 * gravaria "Processo recebido" em nome do usuário.
 */

import type { Area } from "@comum/armazenamento/area";
import { normalizarTexto } from "@comum/texto";
import { lerCaixaDaPagina, type ProcessoNaCaixa } from "@nucleo/dominio/caixa";
import { paginaDe } from "@nucleo/sessao/pagina";
import type { UsuarioDaUnidade } from "../ponte/tipos";

const DIA = 86_400_000;

/** Quem tem processo atribuído na página da caixa (`a.ancoraSigla` com "Atribuído para <nome>"). */
export function usuariosDaCaixa(doc: Document): UsuarioDaUnidade[] {
  const saida: UsuarioDaUnidade[] = [];
  for (const a of doc.querySelectorAll("a[href*='procedimento_atribuicao_listar']")) {
    const login = (a.textContent ?? "").trim();
    const nome = (a.getAttribute("title") ?? "").replace(/^Atribu\S*\s+para\s+/i, "").trim();
    if (login && nome) saida.push({ login: login.toLowerCase(), nome });
  }
  return saida;
}

/** Opção do seletor de atribuição do SEI: "login - Nome". */
export function usuarioDaOpcao(texto: string): UsuarioDaUnidade | null {
  const t = texto.trim();
  if (!t) return null;
  const m = /^(\S+)\s+-\s+(.+)$/.exec(t);
  return m ? { login: (m[1] ?? "").toLowerCase(), nome: (m[2] ?? "").trim() } : { nome: t };
}

/** Um processo da caixa que já foi visualizado e não é sigiloso (ler a árvore dele não muda nada no SEI). */
export function processoSeguroDaCaixa(doc: Document): ProcessoNaCaixa | null {
  try {
    return lerCaixaDaPagina(paginaDe(doc)).find((p) => !p.novo && !p.sigiloso && p.protocolo) ?? null;
  } catch {
    return null;
  }
}

const chave = (u: UsuarioDaUnidade) => (u.login ? `l:${u.login.toLowerCase()}` : `n:${normalizarTexto(u.nome)}`);

/** Sem repetir; o usuário atual primeiro, os outros pelo nome. */
function juntar(eu: UsuarioDaUnidade, outros: readonly UsuarioDaUnidade[]): UsuarioDaUnidade[] {
  const vistos = new Set([chave(eu)]);
  const resto: UsuarioDaUnidade[] = [];
  for (const u of outros) {
    const k = chave(u);
    if (vistos.has(k) || !u.nome) continue;
    vistos.add(k);
    resto.push(u);
  }
  return [eu, ...resto.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))];
}

const lista = (x: unknown): UsuarioDaUnidade[] =>
  Array.isArray(x)
    ? x.flatMap((u) =>
        u && typeof u === "object" && typeof (u as UsuarioDaUnidade).nome === "string"
          ? [
              {
                nome: (u as UsuarioDaUnidade).nome,
                ...(typeof (u as UsuarioDaUnidade).login === "string" ? { login: (u as UsuarioDaUnidade).login } : {}),
              },
            ]
          : [],
      )
    : [];

export interface DepsUsuarios {
  area: Area;
  /** `chaveUsuarios(host, idUnidade)`. */
  chave: string;
  agora: number;
  daCaixa: UsuarioDaUnidade[];
  eu: UsuarioDaUnidade;
  /** A lista do formulário de atribuição; null quando não há processo seguro para ler. */
  buscarCompleta?: () => Promise<UsuarioDaUnidade[] | null>;
}

export async function usuariosDaUnidade(d: DepsUsuarios): Promise<UsuarioDaUnidade[]> {
  const salvo = (await d.area.obter(d.chave))[d.chave] as { quando?: unknown; completa?: unknown; lista?: unknown } | undefined;
  const valido = !!salvo && typeof salvo.quando === "number" && d.agora - salvo.quando < DIA;
  const guardada = salvo ? lista(salvo.lista) : [];
  if (valido && salvo?.completa === true) return juntar(d.eu, [...guardada, ...d.daCaixa]);
  let base = guardada;
  let completa = false;
  try {
    const nova = await d.buscarCompleta?.();
    if (nova) {
      base = nova;
      completa = true;
    }
  } catch {
    /* sem processo seguro ou sem permissão: fica o que havia */
  }
  const final = juntar(d.eu, [...base, ...d.daCaixa]);
  await d.area.gravar({ [d.chave]: { quando: d.agora, completa, lista: final } });
  return final;
}
```

Arquivo completo `projetos/src/pagina/documento.ts`:

```ts
/**
 * Conferência do número SEI de um documento (diálogo da etapa e "Informar
 * documento"): a pesquisa rápida do cabeçalho leva a `procedimento_trabalhar`
 * do processo onde o documento está, e o título da tela traz o protocolo. Não
 * abre a árvore (que marcaria o processo como recebido).
 */

import { parametros } from "@nucleo/links/links";
import { decodificarEntidades } from "@nucleo/sessao/dom";
import type { Pagina } from "@nucleo/sessao/http";
import type { DocumentoConferido } from "../ponte/tipos";

export async function conferirDocumento(pesquisar: (ref: string) => Promise<Pagina>, numero: string): Promise<DocumentoConferido | null> {
  const n = numero.replace(/\D/g, "");
  if (!n) return null;
  let p: Pagina;
  try {
    p = await pesquisar(n);
  } catch (e) {
    if ((e as { codigo?: unknown }).codigo === "SEI_NAO_ENCONTRADO") return null;
    throw e;
  }
  const q = parametros(p.url);
  if (q.get("acao") !== "procedimento_trabalhar") return null;
  const arvore = decodificarEntidades(p.doc.querySelector("#ifrArvore")?.getAttribute("src") ?? "");
  const idProcedimento = parametros(arvore).get("id_procedimento") ?? "";
  const idProtocolo = q.get("id_protocolo") ?? "";
  // O mesmo id do processo: o número digitado é do processo, não de um documento.
  if (!idProtocolo || idProtocolo === idProcedimento) return null;
  const protocolo = /^SEI\s*-\s*(.+)$/.exec(p.doc.querySelector("title")?.textContent?.trim() ?? "")?.[1]?.trim();
  return protocolo ? { numero: n, protocolo } : { numero: n };
}
```

Arquivo completo `projetos/src/pagina/executor.ts`:

```ts
/**
 * O que o app do painel pede à aba do SEI (spec 7). Só o content script tem a
 * página: o cabeçalho (contexto), a caixa já carregada, a pesquisa rápida. Nada
 * aqui escreve no SEI; abrir processo ou documento é o mesmo gesto do usuário.
 */

import { abrirProcesso } from "@comum/pagina/abrir";
import type { AvisarComAcoes, AvisarNaPagina } from "@comum/painel/aviso";
import { tratadoresDoPainel } from "@comum/painel/embutido";
import type { Sobreposicao } from "@comum/painel/sobreposicao";
import { ErroRpc, type Tratador } from "@comum/ponte/rpc";
import { lerCaixaDaPagina } from "@nucleo/dominio/caixa";
import { paginaDe } from "@nucleo/sessao/pagina";
import type { ContextoProjetos, DocumentoConferido, ProcessoDaCaixa, UsuarioDaUnidade } from "../ponte/tipos";

export interface DepsExecutor {
  doc: Document;
  ctx: ContextoProjetos;
  iframe: HTMLIFrameElement | null;
  sobreposicao?: Sobreposicao | null;
  avisar?: AvisarNaPagina | null;
  avisarAcoes?: AvisarComAcoes | null;
  usuarios(): Promise<UsuarioDaUnidade[]>;
  conferir(numero: string): Promise<DocumentoConferido | null>;
}

/** Os processos da página da caixa que está na tela (sem requisição). */
export function processosDaCaixa(doc: Document): ProcessoDaCaixa[] {
  try {
    return lerCaixaDaPagina(paginaDe(doc)).map((p) => ({
      protocolo: p.protocolo,
      idProcedimento: p.idProcedimento,
      tipo: p.tipo || undefined,
      especificacao: p.sigiloso ? undefined : p.especificacao || undefined,
      sigiloso: p.sigiloso,
    }));
  } catch {
    return [];
  }
}

export function tratadoresProjetos(d: DepsExecutor): Record<string, Tratador> {
  return {
    contexto: () => d.ctx,
    // altura, sobrepor e aviso: os de todo painel embutido (sei-comum).
    ...tratadoresDoPainel(d),
    abrirProcesso: (args) => {
      const a = (args ?? {}) as { id?: unknown; protocolo?: unknown; novaAba?: unknown };
      return abrirProcesso(d.doc, String(a.id ?? ""), String(a.protocolo ?? ""), a.novaAba === true);
    },
    // Documento: a pesquisa rápida com o número SEI, numa aba nova (a tela atual fica).
    abrirDocumento: (args) => {
      const n = String((args as { numero?: unknown } | null)?.numero ?? "").replace(/\D/g, "");
      if (!n) throw new ErroRpc("ARGUMENTO_INVALIDO", "Informe o número SEI do documento.");
      return abrirProcesso(d.doc, "", n, true);
    },
    conferirDocumento: (args) => d.conferir(String((args as { numero?: unknown } | null)?.numero ?? "")),
    processosDaCaixa: () => processosDaCaixa(d.doc),
    usuariosDaUnidade: () => d.usuarios(),
    atividadesDisponivel: () => d.ctx.atividades,
  };
}
```

Arquivo completo `projetos/src/pagina/main.ts`:

```ts
/**
 * Content script do gestor de projetos (mundo isolado, todos os frames,
 * document_start). Primeiro marca o documento, de forma síncrona, para o
 * legado não carregar o sei-pro-projetos.js. No P3, só a janela de topo do
 * Controle de Processos faz algo: monta o painel embutido, atende o app pelo
 * RPC e pinta as pílulas de alerta no título. (Caixa, árvore e lateral: P5.)
 */

import { areaChrome } from "@comum/armazenamento/area";
import { hojeISO } from "@comum/datas/dias";
import { lerOpcaoLegada } from "@comum/opcoes/legadas";
import { corDoTemaSei, temaEscuroLegado } from "@comum/pagina/tema";
import { avisoComAcoesNaPagina, avisoNaPagina } from "@comum/painel/aviso";
import { ligarPortaDoPainel, type PainelMontado } from "@comum/painel/embutido";
import type { PortaRpc, Rpc } from "@comum/ponte/rpc";
import { listarOpcoes } from "@nucleo/dominio/opcoes";
import { Formulario } from "@nucleo/formulario/formulario";
import { Sei } from "@nucleo/sei";
import { criarHttp } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { alertasDaUnidade, carregarUnidade } from "../app/dados";
import { gravarPreferencias, lerPreferencias } from "../app/preferencias";
import { chaveUsuarios } from "../modelo/constantes";
import { escoposDaUnidade } from "../modelo/escopo";
import { CANAL_PROJETOS, type TipoAlerta, type UsuarioDaUnidade } from "../ponte/tipos";
import { RepositorioProjetos } from "../repositorio";
import { atividadesConfigurado, contextoProjetos } from "./contexto";
import { conferirDocumento } from "./documento";
import { tratadoresProjetos } from "./executor";
import { marcarAtivo } from "./marca";
import { montarPainelProjetos, ordemDoPainel, pintarAlertas } from "./painel";
import { processoSeguroDaCaixa, usuarioDaOpcao, usuariosDaCaixa, usuariosDaUnidade } from "./usuarios";

marcarAtivo(document);

const global = window as unknown as { __seiProProjetos?: boolean };
if (!global.__seiProProjetos) {
  // O mesmo arquivo injetado duas vezes (matches que se sobrepõem) não monta dois painéis.
  global.__seiProProjetos = true;
  const iniciar = () => void principal().catch((e) => console.warn("[SEI Pro] projetos:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}

async function principal(): Promise<void> {
  if (window !== window.top) return;
  if (!document.querySelector("#frmProcedimentoControlar")) return;
  if (!(await lerOpcaoLegada("gerenciarprojetos"))) return;
  const ctx = contextoProjetos(
    document,
    { temaEscuro: temaEscuroLegado(localStorage), corTema: corDoTemaSei(document), atividades: atividadesConfigurado(localStorage) },
    location.href,
  );
  if (!ctx?.unidade) return;
  const unidade = ctx.unidade;
  const area = areaChrome(chrome.storage.local, "local");
  const prefs = await lerPreferencias(area);
  const montado = montarPainelProjetos(document, {
    urlApp: chrome.runtime.getURL("html/projetos.html#modo=embutido"),
    temaEscuro: ctx.temaEscuro,
    recolhido: prefs.recolhido,
    ordem: ordemDoPainel(localStorage),
    aoRecolher: (r) => void gravarPreferencias(area, { recolhido: r }).catch(() => undefined),
  });
  if (!montado) return;
  const http = criarHttp(location.href);
  const tratadores = tratadoresProjetos({
    doc: document,
    ctx,
    iframe: montado.iframe,
    sobreposicao: montado.sobreposicao,
    avisar: avisoNaPagina(document, ctx.temaEscuro, "spro-prj"),
    avisarAcoes: avisoComAcoesNaPagina(document, ctx.temaEscuro, "spro-prj"),
    usuarios: () =>
      usuariosDaUnidade({
        area,
        chave: chaveUsuarios(ctx.host, unidade.id),
        agora: Date.now(),
        daCaixa: usuariosDaCaixa(document),
        eu: { login: ctx.login, nome: ctx.nome },
        buscarCompleta: () => usuariosPeloFormulario(document),
      }),
    conferir: (n) =>
      conferirDocumento(
        (ref) => Formulario.de(paginaDe(document), "#frmProtocoloPesquisaRapida", http).definir({ txtPesquisaRapida: ref }).enviar(),
        n,
      ),
  });
  // A cada carga do iframe, uma porta nova: o app só aceita a porta da própria aba (@comum/ponte/conexaoDaAba).
  const porta = ligarPortaDoPainel(montado, () => chrome.runtime.connect({ name: CANAL_PROJETOS }) as unknown as PortaRpc, tratadores);
  ligarAlertas(montado, ctx.temaEscuro, escoposDaUnidade(ctx.host, ctx.login, unidade.id), area, porta.rpc);
}

/** A lista completa (formulário de atribuição) a partir de um processo da caixa já visualizado, ou null. */
async function usuariosPeloFormulario(doc: Document): Promise<UsuarioDaUnidade[] | null> {
  const seguro = processoSeguroDaCaixa(doc);
  if (!seguro) return null;
  const sei = new Sei(location.href, () => paginaDe(doc));
  const opcoes = await listarOpcoes(sei, "usuarios", seguro.protocolo);
  return opcoes.map((o) => usuarioDaOpcao(o.nome)).filter((u): u is UsuarioDaUnidade => !!u);
}

/**
 * Pílulas do título: contam as etapas dos dois escopos da unidade e se refazem a
 * cada gravação. O clique abre o painel (se recolhido), rola até ele e pede ao
 * app o filtro; se o app ainda não ligou, tenta de novo por alguns segundos.
 */
function ligarAlertas(
  montado: PainelMontado,
  temaEscuro: boolean,
  escopos: ReturnType<typeof escoposDaUnidade>,
  area: ReturnType<typeof areaChrome>,
  rpc: () => Rpc | null,
): void {
  const titulo = montado.painel.querySelector<HTMLElement>(".spro-prj-titulo");
  if (!titulo) return;
  const leitura = () => ({ agora: Date.now(), dispositivo: "pagina" });
  const repos = {
    unidade: new RepositorioProjetos(area, escopos.unidade, leitura),
    eu: new RepositorioProjetos(area, escopos.eu, leitura),
  };
  const pedir = (tipo: TipoAlerta, tentativas = 30) => {
    const r = rpc();
    if (r) void r.chamar("alerta", { tipo }).catch(() => undefined);
    else if (tentativas > 0) setTimeout(() => pedir(tipo, tentativas - 1), 300);
  };
  const aoClicar = (tipo: TipoAlerta) => {
    if (montado.corpo.hidden) montado.painel.querySelector<HTMLButtonElement>(".spro-prj-recolher")?.click();
    montado.painel.scrollIntoView({ behavior: "smooth", block: "start" });
    pedir(tipo);
  };
  let agendado: ReturnType<typeof setTimeout> | null = null;
  const pintar = () => {
    if (agendado) clearTimeout(agendado);
    agendado = setTimeout(() => {
      agendado = null;
      const hoje = hojeISO();
      void carregarUnidade(repos, hoje)
        .then((d) => pintarAlertas(titulo, alertasDaUnidade(d.ativos, hoje), temaEscuro, aoClicar))
        .catch(() => undefined);
    }, 150);
  };
  for (const r of Object.values(repos)) r.aoMudar(pintar);
  pintar();
}
```

- [ ] **Step 5: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `659 ok, 0 falha(s)` (+31 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

- [ ] **Step 6: Portões (os dois tsconfig)**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: os dois `tsc` (pacote e `tsconfig.pagina.json`) sem saída; Biome sem erro.

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/tsconfig.json \
  projetos/tsconfig.pagina.json \
  projetos/package.json \
  projetos/src/pagina/marca.ts \
  projetos/src/pagina/contexto.ts \
  projetos/src/pagina/painel.ts \
  projetos/src/pagina/usuarios.ts \
  projetos/src/pagina/documento.ts \
  projetos/src/pagina/executor.ts \
  projetos/src/pagina/main.ts \
  projetos/tests/pagina/util.ts \
  projetos/tests/pagina/verificar-pagina.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: content script com painel, executor RPC e alertas no titulo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 13: Projetos — entrada do app, página, CSS e build com as saídas em `dist/`

**Files:**
- Create: `projetos/src/app/main.ts`, `projetos/estatico/projetos.html`, `projetos/estatico/projetos.css`
- Modify: `projetos/build.mjs` (troca o build de verificação em memória do P2 pelas saídas reais), `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-estatico.ts`
- Generated: `dist/js/init_projetos.js`, `dist/js/projetos/app.js`, `dist/html/projetos.html`, `dist/css/projetos.css`

**Interfaces:**
- Consumes: `AppProjetos` (T11), `hashDaImpressao`, `lerImpressao`, `montarImpressao` (T10), `CANAL_PROJETOS` (T2), `RepositorioProjetos`, `escoposDaUnidade`, `MEDIDAS` (P2); `esperarConexaoDaAba` com tratadores (T1), `observarAltura`, `sobreposicaoNoApp`, `emissorDeAvisoPelaPagina`, `definirEmissorDeAviso`, `criarAbrirModal`, `criarConfirmar`, `baixar`, `definirJanelaQueCresce`, `idDispositivo`, `areaChrome` (sei-comum).
- Produces: a página `html/projetos.html` (`#modo=embutido`, `#modo=impressao`, `#modo=lateral` = aviso até o P5), os tratadores do app `alerta` e `focarProjeto` (com fila até o app ficar pronto), o CSS completo do app e o build `node build.mjs` com os portões.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-estatico.ts`:

```ts
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MEDIDAS } from "../src/gantt/escalas";
import { checar, secao } from "./util";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Classes que só servem de gancho (provas, seletores do app), sem regra própria no CSS. */
const GANCHOS = new Set([
  "prj-bloco-modelo",
  "prj-campo-fim",
  "prj-corpo",
  "prj-form-documento",
  "prj-form-etapa",
  "prj-form-modelo",
  "prj-form-projeto",
  "prj-lin-projeto",
  "prj-topo",
  "prj-vista-todos",
]);

async function fontes(pasta: string): Promise<string[]> {
  const saida: string[] = [];
  for (const e of await readdir(pasta, { withFileTypes: true })) {
    const p = join(pasta, e.name);
    if (e.isDirectory()) saida.push(...(await fontes(p)));
    else if (e.name.endsWith(".ts")) saida.push(await readFile(p, "utf8"));
  }
  return saida;
}

export async function verificarEstatico(): Promise<void> {
  secao("estatico: pagina e CSS do app");
  const html = await readFile(join(RAIZ, "estatico/projetos.html"), "utf8");
  checar(
    "pagina carrega o CSS e o app (modulo)",
    html.includes('href="../css/projetos.css"') &&
      html.includes('<script type="module" src="../js/projetos/app.js">') &&
      html.includes('id="app"'),
  );
  const css = await readFile(join(RAIZ, "estatico/projetos.css"), "utf8");
  checar(
    "projetos.css so ASCII",
    [...css].every((c) => c.charCodeAt(0) <= 0x7f),
  );
  checar("sem @import (a pagina da extensao nao busca nada de fora)", !css.includes("@import"));
  const regra = (seletor: string) => new RegExp(`\\.${seletor}\\s*[{,.:\\[ >]`).test(css);
  checar(
    "cabecalho da lista com a altura do cabecalho do Gantt",
    new RegExp(`\\.prj-lista-cab \\{[^}]*height: ${MEDIDAS.cabecalho}px`).test(css),
  );
  checar("linha da lista com a altura da linha do Gantt", new RegExp(`\\.prj-lin \\{[^}]*height: ${MEDIDAS.linha}px`).test(css));
  const codigo = [...(await fontes(join(RAIZ, "src/app"))), ...(await fontes(join(RAIZ, "src/arquivo")))].join("\n");
  const usadas = [...new Set(codigo.match(/prj-[a-z0-9-]+/g) ?? [])];
  const semRegra = usadas.filter((c) => !GANCHOS.has(c) && (c.endsWith("-") ? !css.includes(`.${c}`) : !regra(c)));
  checar("toda classe prj-* do app tem regra no CSS (ou e gancho declarado)", semRegra.length === 0, semRegra);
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarApp } from "./verificar-app";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppCsv } from "./verificar-app-csv";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppProjeto } from "./verificar-app-projeto";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarEstatico } from "./verificar-estatico";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
await verificarAppProjeto();
await verificarAppCsv();
await verificarApp();
await verificarEstatico();
// O content script importa o núcleo do SEI (tsconfig.pagina.json): caminho numa variável, para o tsc
// do pacote (com noUncheckedIndexedAccess) não seguir o import.
const suitePagina = "./pagina/verificar-pagina";
await ((await import(suitePagina)) as { verificarPagina(): Promise<void> }).verificarPagina();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: o processo para com `Error: ENOENT: no such file or directory, open '…/projetos/estatico/projetos.html'`.

- [ ] **Step 3: Implementar a página, o CSS e a entrada do app**

Arquivo completo `projetos/estatico/projetos.html`:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Projetos do SEI Pro</title>
    <link rel="stylesheet" href="../css/projetos.css" />
  </head>
  <body>
    <div id="app" aria-live="polite"></div>
    <script type="module" src="../js/projetos/app.js"></script>
  </body>
</html>
```

Arquivo completo `projetos/estatico/projetos.css`:

```css
/*
 * App do gestor de projetos (html/projetos.html): painel embutido abaixo da lista do Controle de
 * Processos (tela 1, variante B), dialogos (tela 2) e impressao. Base em sei-comum/src/ui/base.css e
 * lista.css; o Gantt em estatico/gantt.css. Medidas que alinham a lista ao Gantt: cabecalho 64 px,
 * linha 36 px (src/gantt/escalas.ts, MEDIDAS). So ASCII (portao do build.mjs).
 */
html,
body {
  margin: 0;
  padding: 0;
  color: var(--spro-texto);
  font: 13px/1.45 var(--spro-fonte);
  -webkit-font-smoothing: antialiased;
}
html[data-modo="embutido"] body {
  background: var(--spro-fundo);
}
html[data-modo="impressao"] body {
  background: #ffffff;
}
#app {
  padding: 4px 2px 10px;
}

/* Dialogo do painel embutido por cima da tela inteira (@comum/painel/sobreposicao). */
html[data-sobreposto="sim"],
html[data-sobreposto="sim"] body {
  background: transparent;
}
html[data-sobreposto="sim"] #app {
  visibility: hidden;
}
html[data-sobreposto="abrindo"] dialog.spro-dialogo,
html[data-sobreposto="abrindo"] dialog.spro-dialogo::backdrop {
  opacity: 0;
}

/* ---------- Abas ---------- */
.prj {
  container-type: inline-size;
}
.prj-abas {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  min-width: 0;
}
.prj-abas-vazio {
  justify-content: flex-end;
}
.prj-abas-lista {
  flex-wrap: nowrap;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
}
.prj-abas-lista > button {
  min-height: 32px;
  padding: 0 12px;
  font-size: 13px;
}
.prj-aba-nome {
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prj-aba-prog {
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
.prj-abas-lista button[aria-selected="true"] .prj-aba-prog {
  color: var(--spro-destaque);
  background: var(--spro-destaque-suave);
}
.prj-aba-alerta {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--spro-perigo);
}
.prj-aba-mais {
  flex-direction: row-reverse;
}
.prj-novo {
  flex: none;
}
.prj-abas-dir {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.prj-sinc {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-right: 4px;
  font-size: 12px;
  color: var(--spro-fraco);
  white-space: nowrap;
}
.prj-sinc-pendente {
  color: var(--spro-aviso);
}
.prj-sinc-erro {
  color: var(--spro-perigo);
}
.prj-sinc-ok .spro-icone {
  color: var(--spro-ok);
}

/* ---------- Cartao, cabecalho e controles ---------- */
.prj-cartao {
  overflow: hidden;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-1);
}
.prj-cab {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--spro-borda);
}
.prj-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--spro-suave);
}
.prj-meta .spro-icone {
  color: var(--spro-suave);
}
.prj-vis {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.prj-processo {
  font-weight: 600;
  color: var(--spro-destaque);
  text-decoration: none;
}
.prj-processo:hover {
  text-decoration: underline;
}
.prj-sep {
  color: var(--spro-borda-forte);
}
.prj-ctl {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.prj-filtro {
  flex: none;
}
.prj-filtro-ativo {
  color: var(--spro-destaque);
  border-color: color-mix(in srgb, var(--spro-destaque) 45%, transparent);
}

/* ---------- Vista do projeto: lista (290 px) + Gantt ---------- */
.prj-vista {
  position: relative;
  display: flex;
}
.prj-lista {
  flex: none;
  width: 290px;
  background: var(--spro-fundo);
  border-right: 1px solid var(--spro-borda);
}
.prj-lista-cab {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  height: 64px;
  padding: 0 12px 8px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--spro-fraco);
  border-bottom: 1px solid var(--spro-borda);
}
.prj-lista-cab span:last-child {
  margin-left: auto;
}
.prj-lin {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 36px;
  padding: 0 10px 0 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--spro-borda) 60%, transparent);
  cursor: pointer;
}
.prj-lin:hover,
.prj-lin.prj-realce {
  background: var(--spro-destaque-suave);
}
.prj-lin:focus-visible {
  outline: none;
  box-shadow: inset var(--spro-anel);
}
.prj-lin-nome {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prj-lin-fase {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
}
.prj-lin-seta {
  display: inline-flex;
  transition: transform var(--spro-dur);
}
.prj-lin-fase[aria-expanded="false"] .prj-lin-seta {
  transform: rotate(-90deg);
}
.prj-lin-conta {
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: var(--spro-fraco);
}
.prj-lin-etapa.prj-concluida .prj-lin-nome {
  color: var(--spro-suave);
}
.prj-lin-escopo {
  display: inline-flex;
  color: var(--spro-suave);
}
.prj-lin-nova {
  color: var(--spro-fraco);
  border-bottom: 0;
  cursor: text;
}
.prj-lin-nova input {
  all: unset;
  flex: 1;
  min-width: 0;
  color: var(--spro-texto);
}
.prj-lin-nova input::placeholder {
  color: var(--spro-fraco);
}
.prj-av-vazio {
  flex: none;
  width: 22px;
  height: 22px;
}
.prj-gantt {
  flex: 1;
  min-width: 0;
}
.prj-sem-lista .prj-gantt {
  width: 100%;
}

/* Icone de situacao da etapa (16 px). */
.prj-st {
  flex: none;
}
.prj-st .prj-st-cor {
  fill: none;
  stroke-width: 1.6;
}
.prj-st-concluida .prj-st-cor,
.prj-st-atrasada .prj-st-cor {
  stroke: none;
}
.prj-st-concluida .prj-st-cor {
  fill: var(--spro-ok);
}
.prj-st-atrasada .prj-st-cor {
  fill: var(--spro-perigo);
}
.prj-st-andamento .prj-st-cor {
  stroke: var(--spro-destaque);
}
.prj-st-andamento .prj-st-meio {
  fill: var(--spro-destaque);
}
.prj-st-futura .prj-st-cor {
  stroke: var(--spro-borda-forte);
  stroke-dasharray: 2.4 2;
}
.prj-st-sinal {
  fill: none;
  stroke: #ffffff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.prj-st-ponto {
  fill: #ffffff;
}
.prj-st-marco.prj-st-andamento .prj-st-cor {
  stroke: var(--spro-novidade);
}
.prj-st-marco.prj-st-futura .prj-st-cor {
  stroke: var(--spro-novidade);
  stroke-dasharray: none;
}
.prj-st-marco.prj-st-atrasada .prj-st-cor {
  fill: none;
  stroke: var(--spro-perigo);
}

/* ---------- Vista Lista ---------- */
.prj-tabela {
  width: 100%;
  border-collapse: collapse;
}
.prj-tabela th {
  padding: 10px 12px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-align: left;
  text-transform: uppercase;
  color: var(--spro-fraco);
  border-bottom: 1px solid var(--spro-borda);
}
.prj-tabela td {
  padding: 8px 12px;
  white-space: nowrap;
  border-bottom: 1px solid color-mix(in srgb, var(--spro-borda) 60%, transparent);
}
.prj-tab-linha {
  cursor: pointer;
}
.prj-tab-linha:hover {
  background: var(--spro-destaque-suave);
}
.prj-tab-grupo td {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
}
.prj-tab-conta {
  font-weight: 600;
  letter-spacing: 0;
  color: var(--spro-fraco);
}
.prj-tab-st {
  width: 20px;
}
.prj-tab-nome {
  font-weight: 500;
  white-space: normal !important;
}
.prj-pilula-marco {
  margin-left: 6px;
}
.prj-barra {
  display: inline-block;
  width: 90px;
  height: 6px;
  margin-right: 6px;
  overflow: hidden;
  vertical-align: middle;
  background: var(--spro-fundo-3);
  border-radius: 3px;
}
.prj-barra i {
  display: block;
  height: 100%;
  background: var(--spro-destaque);
}
.prj-tab-prog {
  color: var(--spro-suave);
}
.prj-nada {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 26px 16px;
  color: var(--spro-suave);
}
.prj-nada p {
  margin: 0;
}

/* ---------- Camada flutuante (balao e popover do filtro): dialog nao modal ---------- */
dialog.prj-camada {
  position: fixed;
  z-index: 60;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: auto;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-3);
  scrollbar-width: thin;
}
.prj-filtro-pop {
  padding: 12px;
}
.prj-filtro-pop h4 {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--spro-fraco);
}
.prj-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.prj-filtro-campos {
  display: grid;
  gap: 6px;
}
.prj-filtro-campos .spro-combo {
  width: 100%;
}
.prj-filtro-limpar {
  margin-top: 10px;
}

/* Balao da etapa */
.prj-balao-corpo {
  position: relative;
  padding: 14px 16px 12px;
}
.prj-balao-fechar {
  position: absolute;
  top: 8px;
  right: 8px;
}
.prj-balao h3 {
  margin: 6px 26px 2px 0;
  font-size: 15px;
  overflow-wrap: anywhere;
}
.prj-balao-sub {
  margin-bottom: 10px;
  color: var(--spro-suave);
}
.prj-balao-li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 7px 0;
  line-height: 1.4;
}
.prj-balao-li > .spro-icone {
  margin-top: 1px;
  color: var(--spro-suave);
}
.prj-balao-li small {
  display: block;
  color: var(--spro-perigo);
}
.prj-balao-li a {
  font-weight: 500;
  color: var(--spro-destaque);
  text-decoration: none;
  overflow-wrap: anywhere;
}
.prj-balao-prog {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 4px;
  color: var(--spro-suave);
}
.prj-balao-prog input {
  flex: 1;
  accent-color: var(--spro-destaque);
}
.prj-balao-prog b {
  width: 38px;
  text-align: right;
  color: var(--spro-texto);
}
.prj-balao-nota {
  font-size: 12px;
  color: var(--spro-fraco);
}
.prj-balao-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--spro-borda);
}
.prj-balao-acoes > .spro-botao-icone {
  margin-left: auto;
}

/* ---------- Primeiro uso ---------- */
.prj-vazio {
  display: grid;
  justify-items: center;
  gap: 10px;
  box-sizing: border-box;
  padding: 30px 24px;
  text-align: center;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
}
.prj-vazio h3 {
  margin: 6px 0 0;
  font-size: 16px;
}
.prj-vazio p {
  max-width: 420px;
  margin: 0;
  line-height: 1.5;
  color: var(--spro-suave);
}
.prj-vazio-botoes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
}
.prj-vazio a {
  font-size: 12.5px;
  color: var(--spro-destaque);
  text-decoration: none;
}
.prj-vazio-ok {
  fill: color-mix(in srgb, var(--spro-ok) 40%, var(--spro-fundo));
}
.prj-vazio-andamento {
  fill: color-mix(in srgb, var(--spro-destaque) 45%, var(--spro-fundo));
}
.prj-vazio-futura {
  fill: var(--spro-fundo-3);
}
.prj-vazio-marco {
  fill: var(--spro-novidade);
}
.prj-vazio-seta {
  stroke: var(--spro-fraco);
  stroke-width: 1.2;
}
.prj-vazio-hoje {
  stroke: var(--spro-destaque);
  stroke-width: 1;
}

/* ---------- Formularios (tela 2) ---------- */
.prj-form {
  display: grid;
  gap: 14px;
}
.prj-campo {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.prj-campo > .spro-campo,
.prj-campo > .spro-combo,
.prj-campo-largo .spro-combo {
  box-sizing: border-box;
  width: 100%;
}
.prj-rotulo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--spro-suave);
}
.prj-opcional {
  font-weight: 400;
  color: var(--spro-fraco);
}
.prj-dica {
  font-size: 12px;
  line-height: 1.45;
  color: var(--spro-fraco);
}
.prj-linha {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
}
.prj-linha > .prj-campo {
  flex: 1 1 130px;
}
.prj-linha > .prj-campo-largo {
  flex: 2 1 220px;
}
.prj-uteis {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 10px;
  white-space: nowrap;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border-radius: var(--spro-raio);
}
.prj-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--spro-suave);
}
.prj-chips-x {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 3px 6px;
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
}
.prj-chip-x {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-height: 26px;
  padding: 0 2px 0 10px;
  font-size: 12.5px;
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
.spro-combo.spro-combo-compacto {
  min-height: 26px;
  border-color: transparent;
  box-shadow: none;
}
.prj-opcoes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.prj-opcao {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio);
}
.prj-opcao:hover {
  background: var(--spro-fundo-2);
}
.prj-opcao input {
  margin: 2px 0 0;
}
.prj-opcao b {
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
}
.prj-opcao span {
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-suave);
}
.prj-opcao:has(input:checked) {
  background: var(--spro-destaque-suave);
  border-color: color-mix(in srgb, var(--spro-destaque) 50%, transparent);
}
@container (max-width: 460px) {
  .prj-opcoes {
    grid-template-columns: 1fr;
  }
}
.prj-previa {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  font-size: 12.5px;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio);
}
.prj-previa-t {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}
.prj-previa-t b {
  color: var(--spro-texto);
  white-space: nowrap;
}
.prj-previa-e {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--spro-texto);
}
.prj-previa-barra {
  flex: none;
  height: 6px;
  background: color-mix(in srgb, var(--spro-destaque) 40%, var(--spro-fundo));
  border-radius: 3px;
}
.prj-previa-nome {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prj-previa-d {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  color: var(--spro-fraco);
}
.prj-previa-mais {
  color: var(--spro-fraco);
}

/* Secoes recolhidas com resumo */
.prj-secoes {
  overflow: hidden;
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
}
.prj-sec {
  border-top: 1px solid var(--spro-borda);
}
.prj-sec:first-child {
  border-top: 0;
}
.prj-sec > button {
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  cursor: pointer;
}
.prj-sec > button:hover {
  background: var(--spro-fundo-2);
}
.prj-sec > button:focus-visible {
  box-shadow: inset var(--spro-anel);
}
.prj-sec > button .spro-icone {
  color: var(--spro-suave);
}
.prj-sec-seta {
  display: inline-flex;
  transform: rotate(-90deg);
  transition: transform var(--spro-dur);
}
.prj-sec-aberta .prj-sec-seta {
  transform: none;
}
.prj-sec-tit {
  font-weight: 600;
}
.prj-sec-res {
  max-width: 260px;
  margin-left: auto;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--spro-fraco);
}
.prj-sec-conteudo {
  display: none;
  padding: 4px 12px 14px 38px;
}
.prj-sec-aberta .prj-sec-conteudo {
  display: grid;
  gap: 8px;
}
.prj-sec-pilha {
  display: grid;
  gap: 8px;
}
.prj-checklist {
  display: grid;
  gap: 4px;
}
.prj-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.prj-item span {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.prj-item.prj-feito span {
  text-decoration: line-through;
  color: var(--spro-fraco);
}
.prj-docok {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--spro-ok);
}
.prj-docok-falta {
  color: var(--spro-aviso);
}
.prj-hist {
  display: grid;
  gap: 6px;
  font-size: 12.5px;
  color: var(--spro-suave);
}
.prj-hist b {
  font-weight: 600;
  color: var(--spro-texto);
}
.prj-erros {
  padding: 8px 10px;
  font-size: 12.5px;
  color: var(--spro-perigo);
  background: color-mix(in srgb, var(--spro-perigo) 9%, transparent);
  border-radius: var(--spro-raio);
}
.prj-arquivados {
  display: grid;
  gap: 4px;
  min-width: 360px;
}
.prj-arquivado {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  border-bottom: 1px solid var(--spro-borda);
}
.prj-arquivado-nome {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.prj-arquivado-nome span {
  font-size: 12px;
  color: var(--spro-fraco);
}

/* ---------- Impressao ---------- */
.prj-impressao-meta {
  margin: 0 0 12px;
  color: var(--spro-suave);
}
html[data-modo="impressao"] #app {
  padding: 16px;
}
html[data-modo="impressao"] h1 {
  margin: 0 0 4px;
  font-size: 20px;
}
html[data-modo="impressao"] .prj-gantt {
  margin-bottom: 16px;
}
@media print {
  html[data-modo="impressao"] #app {
    padding: 0;
  }
  .spro-gantt .gantt-container {
    height: auto !important;
    overflow: visible !important;
  }
  .prj-tabela {
    break-inside: auto;
  }
  .prj-tabela tr {
    break-inside: avoid;
  }
}

/* Mensagem do app quando nao abre (sem unidade, endereco incompleto). */
.prj-erro {
  margin: 8px 4px;
  color: var(--spro-suave);
}
```

Arquivo completo `projetos/src/app/main.ts`:

```ts
/**
 * Entrada de html/projetos.html. Liga o app ao navegador: <dialog>, download,
 * janela de impressão e a ponte com a aba do SEI. Modos, pelo hash da URL:
 * - embutido (padrão): iframe abaixo da lista do Controle de Processos, ligado
 *   à PRÓPRIA aba (o content script conecta a cada carga do iframe);
 * - impressao: página só leitura, aberta pelo menu "Imprimir / salvar PDF";
 * - lateral: aba "Projetos" do painel lateral (P5).
 */

import { areaChrome } from "@comum/armazenamento/area";
import { idDispositivo } from "@comum/armazenamento/dispositivo";
import { hojeISO } from "@comum/datas/dias";
import { observarAltura } from "@comum/painel/altura";
import { emissorDeAvisoPelaPagina } from "@comum/painel/aviso";
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
import { esperarConexaoDaAba } from "@comum/ponte/conexaoDaAba";
import type { Tratador } from "@comum/ponte/rpc";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import { baixar, criarAbrirModal, criarConfirmar } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { definirJanelaQueCresce } from "@comum/ui/flutuante";
import { escoposDaUnidade } from "../modelo/escopo";
import { CANAL_PROJETOS, type ContextoProjetos, type TipoAlerta } from "../ponte/tipos";
import { RepositorioProjetos } from "../repositorio";
import { AppProjetos } from "./app";
import { hashDaImpressao, lerImpressao, montarImpressao } from "./impressao";

const html = document.documentElement;
const modo = new URLSearchParams(location.hash.slice(1)).get("modo") ?? "embutido";
html.dataset.modo = modo;
const raiz = document.getElementById("app")!;

// O que a aba pede ao app (pílula do título, "Abrir no painel" do P5). Registrado já, antes da porta;
// até o app ficar pronto, os pedidos esperam na fila.
let appAtual: AppProjetos | null = null;
const fila: Array<(app: AppProjetos) => void> = [];
const quandoPronto = (f: (app: AppProjetos) => void) => (appAtual ? f(appAtual) : fila.push(f));
const tratadores: Record<string, Tratador> = {
  alerta: (args) => {
    const tipo: TipoAlerta = (args as { tipo?: unknown } | null)?.tipo === "semana" ? "semana" : "atrasadas";
    quandoPronto((app) => app.aplicarAlerta(tipo));
    return true;
  },
  focarProjeto: (args) => {
    const a = (args ?? {}) as { id?: unknown; etapa?: unknown };
    quandoPronto((app) => app.focarProjeto(String(a.id ?? ""), a.etapa ? String(a.etapa) : undefined));
    return true;
  },
};
// Embutido: o ouvinte da porta é registrado já, antes do `load` do iframe, que é quando o content script conecta.
const conexao = modo === "embutido" ? esperarConexaoDaAba(CANAL_PROJETOS, tratadores) : null;

const mostrarErro = (e: unknown) =>
  raiz.replaceChildren(h("p", { class: "prj-erro" }, `Não foi possível abrir os projetos: ${e instanceof Error ? e.message : String(e)}`));

if (modo === "impressao") void iniciarImpressao().catch(mostrarErro);
else if (modo === "embutido") void iniciarEmbutido().catch(mostrarErro);
else raiz.replaceChildren(h("p", { class: "prj-erro" }, "Este modo do painel ainda não está disponível."));

async function iniciarEmbutido(): Promise<void> {
  const rpc = await conexao!;
  const ctx = await rpc.chamar<ContextoProjetos>("contexto");
  const unidade = ctx.unidade;
  if (!unidade) {
    raiz.replaceChildren(h("p", { class: "prj-erro" }, "Abra o SEI numa unidade para ver os projetos."));
    return;
  }
  // Painel abaixo da lista: segue o SEI (modo noturno do SEI Pro e a cor da barra do sistema).
  html.dataset.tema = ctx.temaEscuro ? "escuro" : "claro";
  if (ctx.corTema) {
    html.style.setProperty("--spro-cor-sei", ctx.corTema);
    html.dataset.corSei = "";
  }
  const altura = observarAltura(rpc);
  // A lista de um seletor ou menu aberto perto do fim do painel: o iframe cresce até ela caber.
  addEventListener("spro-popover", (ev) => altura.extra(Number((ev as CustomEvent<{ fundo?: number }>).detail?.fundo) || 0));
  definirJanelaQueCresce(() => html.dataset.sobreposto !== "sim");
  // Diálogo no meio da tela visível: a aba põe o iframe por cima de tudo enquanto há diálogo aberto.
  const sobrepor = sobreposicaoNoApp(rpc, altura);
  // Aviso no rodapé da TELA do SEI (o do iframe ficaria lá embaixo, fora da vista).
  definirEmissorDeAviso(emissorDeAvisoPelaPagina(rpc));
  const area = areaChrome(chrome.storage.local, "local");
  const dispositivo = await idDispositivo(area);
  const carimbo = () => ({ agora: Date.now(), dispositivo, por: ctx.login, nome: ctx.nome });
  const esc = escoposDaUnidade(ctx.host, ctx.login, unidade.id);
  const abrirModal = criarAbrirModal({ aoAbrir: sobrepor.abrir, aoFechar: sobrepor.fechar });
  const app = new AppProjetos({
    raiz,
    ctx,
    area,
    repos: { unidade: new RepositorioProjetos(area, esc.unidade, carimbo), eu: new RepositorioProjetos(area, esc.eu, carimbo) },
    rpc,
    abrirModal,
    confirmar: criarConfirmar(abrirModal),
    baixar,
    hoje: () => hojeISO(),
    agora: () => Date.now(),
    imprimir: (p) => void window.open(chrome.runtime.getURL(`html/projetos.html${hashDaImpressao(p)}`), "_blank"),
    aoRedesenhar: () => altura.medir(),
  });
  await app.iniciar();
  appAtual = app;
  for (const f of fila.splice(0)) f(app);
  let espera: ReturnType<typeof setTimeout> | undefined;
  addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(() => app.aoRedimensionar(), 200);
  });
}

async function iniciarImpressao(): Promise<void> {
  const p = lerImpressao(location.hash);
  if (!p) {
    raiz.replaceChildren(h("p", { class: "prj-erro" }, "Endereço de impressão incompleto."));
    return;
  }
  const area = areaChrome(chrome.storage.local, "local");
  const esc = escoposDaUnidade(p.host, p.login, p.unidade);
  // Só leitura: o carimbo nunca grava nada.
  const leitura = () => ({ agora: Date.now(), dispositivo: "impressao" });
  await montarImpressao(raiz, p, {
    repos: { unidade: new RepositorioProjetos(area, esc.unidade, leitura), eu: new RepositorioProjetos(area, esc.eu, leitura) },
    hoje: hojeISO(),
    imprimir: () => window.print(),
  });
  // O nome do PDF sugerido pelo navegador vem do título.
  document.title = raiz.querySelector("h1")?.textContent || "Projetos";
}
```

- [ ] **Step 4: Trocar o build pelas saídas reais**

Arquivo completo `projetos/build.mjs`:

```js
#!/usr/bin/env node
/**
 * Build do Projetos.
 *
 *   dist/js/init_projetos.js   content script (IIFE, mundo isolado, todos os frames, document_start)
 *   dist/js/projetos/app.js    app de html/projetos.html (ESM): painel embutido e impressao (lateral: P5)
 *   dist/html/projetos.html    copia de estatico/
 *   dist/css/projetos.css      sei-comum/src/ui/base.css + lista.css + estatico/projetos.css + estatico/gantt.css
 *
 * Portoes: JS so ASCII (o charset "ascii" do esbuild nao escapa caractere cru em regex literal, e o
 * grep BSD nao enxerga); DOM seguro (nenhuma escrita de innerHTML/outerHTML, nenhum insertAdjacentHTML,
 * nenhuma acao em atributo on*; no app, que leva a Frappe, nem a palavra innerHTML/outerHTML); os CSS
 * do pacote (estatico/) so ASCII.
 */
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");

// Opcoes comuns do esbuild (as mesmas do historico/build.mjs).
const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  // O fonte original da Frappe 1.2.2 tem dois metodos view_is (vale o segundo, como no pacote publicado).
  logOverride: { "duplicate-class-member": "silent" },
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por projetos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

const ENTRADAS = [
  { entrada: "src/pagina/main.ts", saida: "js/init_projetos.js", formato: "iife", estrito: false },
  { entrada: "src/app/main.ts", saida: "js/projetos/app.js", formato: "esm", estrito: true },
];

// Escrita de HTML cru em qualquer pacote; no app (com a Frappe vendorizada), nem a palavra.
const ESCRITA_HTML = /\.(innerHTML|outerHTML)\s*=(?!=)|insertAdjacentHTML/;
const PALAVRA_HTML = /innerHTML|outerHTML|insertAdjacentHTML/;
// on<evento>=" dentro de literal, como tools/check-dom-injection.mjs ("el.onclick = fn" nao casa).
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;

let falhou = false;
const erro = (m) => {
  console.error(`ERRO: ${m}`);
  falhou = true;
};

await rm(join(DIST, "js", "projetos"), { recursive: true, force: true });
await mkdir(join(DIST, "js", "projetos"), { recursive: true });
await mkdir(join(DIST, "html"), { recursive: true });
await mkdir(join(DIST, "css"), { recursive: true });

for (const { entrada, saida, formato } of ENTRADAS)
  await build({ ...comum, entryPoints: [resolve(AQUI, entrada)], outfile: join(DIST, saida), format: formato });

await copyFile(resolve(AQUI, "estatico/projetos.html"), join(DIST, "html", "projetos.html"));
const PROPRIOS = ["estatico/projetos.css", "estatico/gantt.css"];
const css = await Promise.all(
  ["../sei-comum/src/ui/base.css", "../sei-comum/src/ui/lista.css", ...PROPRIOS].map((f) => readFile(resolve(AQUI, f), "utf8")),
);
await writeFile(join(DIST, "css", "projetos.css"), `/* GERADO por projetos/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css.join("\n")}`);

for (const { saida, estrito } of ENTRADAS) {
  const bytes = await readFile(join(DIST, saida));
  const i = bytes.findIndex((b) => b > 0x7f);
  if (i >= 0) erro(`byte nao-ASCII em dist/${saida} (posicao ${i}): ${bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8")}`);
  const texto = bytes.toString("utf8");
  if ((estrito ? PALAVRA_HTML : ESCRITA_HTML).test(texto)) erro(`dist/${saida}: innerHTML/outerHTML/insertAdjacentHTML no pacote`);
  if (HANDLER.test(texto)) erro(`dist/${saida}: acao em atributo on* no pacote`);
}
for (const f of PROPRIOS) {
  const bytes = await readFile(resolve(AQUI, f));
  const j = bytes.findIndex((b) => b > 0x7f);
  if (j >= 0) erro(`byte nao-ASCII em ${f} (posicao ${j})`);
}

const kb = async (f) => `${Math.round((await stat(join(DIST, f))).size / 1024)} KB`;
console.log("\nProjetos -- build");
for (const f of [...ENTRADAS.map((e) => e.saida), "html/projetos.html", "css/projetos.css"]) console.log(`  ${f.padEnd(26)} ${await kb(f)}`);
if (falhou) process.exit(1);
console.log("  portoes: ASCII e DOM seguro ok");
```

- [ ] **Step 5: Rodar as provas e o build**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `665 ok, 0 falha(s)` (+6 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && node build.mjs
```
Expected (tamanhos do ensaio, podem variar alguns KB):
```
Projetos -- build
  js/init_projetos.js        84 KB
  js/projetos/app.js         181 KB
  html/projetos.html         0 KB
  css/projetos.css           70 KB
  portoes: ASCII e DOM seguro ok
```

- [ ] **Step 6: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: os dois `tsc` (pacote e `tsconfig.pagina.json`) sem saída; Biome sem erro.

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && LC_ALL=C grep -c '[^ -~	]' dist/js/init_projetos.js dist/js/projetos/app.js
```
Expected: `0` nos dois (conferência por bytes, além do portão do build).

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/main.ts \
  projetos/estatico/projetos.html \
  projetos/estatico/projetos.css \
  projetos/build.mjs \
  projetos/tests/verificar-estatico.ts \
  projetos/tests/verificar.ts \
  dist/js/init_projetos.js \
  dist/js/projetos/app.js \
  dist/html/projetos.html \
  dist/css/projetos.css
git commit -m "$(cat <<'EOF'
Projetos: entrada do app, pagina, CSS e build com saidas em dist

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

---
### Task 14: Projetos — manifest Lab, guarda do legado e "Projetos (Atividades)"

**Files:**
- Modify: `dist/manifest.json` (content script e WAR), `dist/js/init.js:489`, `dist/js/sei-pro-projetos.js:27`, `projetos/tests/verificar.ts`
- Modify (gitignored, local, nos dois clones): `tools/check-dom-injection.mjs` (`ARQUIVOS_GERADOS`)
- Test: `projetos/tests/verificar-manifest.ts`

**Interfaces:**
- Consumes: as saídas da Tarefa 13; `ATRIBUTO_ATIVO = "data-seipro-projetos"` (T12).
- Produces: o módulo ligado no pacote Lab (`js/init_projetos.js` com os mesmos `matches`/`exclude_matches` do `init_historico.js`, `all_frames`, `document_start`; WAR `html/projetos.html`, `js/projetos/app.js`, `css/projetos.css`); o legado só com servidor do Atividades quando o novo está ativo, com o título "Projetos (Atividades)".

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-manifest.ts`:

```ts
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checar, secao } from "./util";

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "dist");

interface ScriptDeConteudo {
  js?: string[];
  matches?: string[];
  exclude_matches?: string[];
  all_frames?: boolean;
  run_at?: string;
}

export async function verificarManifest(): Promise<void> {
  secao("manifest Lab e legado");
  const m = JSON.parse(await readFile(join(DIST, "manifest.json"), "utf8")) as {
    content_scripts: ScriptDeConteudo[];
    web_accessible_resources: Array<{ resources: string[] }>;
  };
  const de = (arquivo: string) => m.content_scripts.find((c) => c.js?.length === 1 && c.js[0] === arquivo);
  const novo = de("js/init_projetos.js");
  const historico = de("js/init_historico.js");
  checar(
    "content script novo com os mesmos matches do historico, todos os frames, document_start",
    !!novo &&
      !!historico &&
      JSON.stringify(novo.matches) === JSON.stringify(historico.matches) &&
      JSON.stringify(novo.exclude_matches) === JSON.stringify(historico.exclude_matches) &&
      novo.all_frames === true &&
      novo.run_at === "document_start",
  );
  const war = m.web_accessible_resources.flatMap((w) => w.resources);
  checar(
    "pagina, app e CSS acessiveis ao iframe",
    ["html/projetos.html", "js/projetos/app.js", "css/projetos.css"].every((r) => war.includes(r)),
  );
  const init = await readFile(join(DIST, "js", "init.js"));
  const texto = init.toString("utf8");
  checar(
    "init.js: legado so sem o modulo novo ou com servidor do Atividades",
    texto.includes("hasAttribute('data-seipro-projetos')") &&
      texto.includes("configBasePro_atividades") &&
      texto.includes('getUrlExtension("js/sei-pro-projetos.js")'),
  );
  checar(
    "init.js continua so ASCII",
    init.every((b) => b <= 0x7f),
  );
  const legado = await readFile(join(DIST, "js", "sei-pro-projetos.js"));
  checar("legado vira 'Projetos (Atividades)' quando os dois aparecem", legado.toString("utf8").includes("'Projetos (Atividades)'"));
  checar(
    "sei-pro-projetos.js continua so ASCII",
    legado.every((b) => b <= 0x7f),
  );
}
```

Arquivo completo `projetos/tests/verificar.ts` (o agregador como fica ao fim desta tarefa):

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarApp } from "./verificar-app";
import { verificarAppAbas } from "./verificar-app-abas";
import { verificarAppBalao } from "./verificar-app-balao";
import { verificarAppBase } from "./verificar-app-base";
import { verificarAppCabecalho } from "./verificar-app-cabecalho";
import { verificarAppCsv } from "./verificar-app-csv";
import { verificarAppEtapa } from "./verificar-app-etapa";
import { verificarAppProjeto } from "./verificar-app-projeto";
import { verificarAppTodos } from "./verificar-app-todos";
import { verificarAppVista } from "./verificar-app-vista";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarEstatico } from "./verificar-estatico";
import { verificarFiltro } from "./verificar-filtro";
import { verificarGantt } from "./verificar-gantt";
import { verificarLinhas } from "./verificar-linhas";
import { verificarManifest } from "./verificar-manifest";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";
import { verificarVendor } from "./verificar-vendor";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
await verificarVendor();
verificarLinhas();
await verificarGantt();
await verificarAppBase();
await verificarAppAbas();
await verificarAppCabecalho();
await verificarAppVista();
verificarAppTodos();
verificarAppBalao();
await verificarAppEtapa();
await verificarAppProjeto();
await verificarAppCsv();
await verificarApp();
await verificarEstatico();
await verificarManifest();
// O content script importa o núcleo do SEI (tsconfig.pagina.json): caminho numa variável, para o tsc
// do pacote (com noUncheckedIndexedAccess) não seguir o import.
const suitePagina = "./pagina/verificar-pagina";
await ((await import(suitePagina)) as { verificarPagina(): Promise<void> }).verificarPagina();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m3 -E "Error|FALHA"
```
Expected: quatro `FALHA` (content script novo, WAR, guarda do `init.js`, título do legado); as duas provas de ASCII passam.

- [ ] **Step 3: Manifest Lab**

Em `dist/manifest.json`, troque:

```json
      "all_frames": true,
      "run_at": "document_start"
    }
  ],
  "action": {
```

por:

```json
      "all_frames": true,
      "run_at": "document_start"
    },
    {
      "js": [
        "js/init_projetos.js"
      ],
      "matches": [
        "*://*.br/sei/*",
        "*://*.br/sip/*",
        "*://*.br/*/sei/*",
        "*://*.br/*/sip/*",
        "*://*.br/*controlador*.php?acao=*",
        "*://*.org/sei/*",
        "*://*.org/sip/*",
        "*://*.org/*controlador*.php?acao=*",
        "*://sip-sei.ans.gov.br/*"
      ],
      "exclude_matches": [
        "*://sei.antaq1.gov.br/*",
        "*://*.br/*login.php*",
        "*://*.br/sip/*controlador.php*",
        "*://*.br/sei/*controlador_externo.php*",
        "*://*.br/*/sip/*controlador.php*",
        "*://*.br/*/sei/*controlador_externo.php*",
        "*://*.org/*login.php*",
        "*://*.org/sip/*controlador.php*",
        "*://*.org/sei/*controlador_externo.php*",
        "*://sip-sei.ans.gov.br/login.php*",
        "*://sip-sei.ans.gov.br/controlador.php*",
        "*://sip-sei.ans.gov.br/controlador_externo.php*",
        "*://sistemas.unir.br/sip/*"
      ],
      "all_frames": true,
      "run_at": "document_start"
    }
  ],
  "action": {
```

Em `dist/manifest.json`, troque:

```json
        "css/historico.css",
```

por:

```json
        "css/historico.css",
        "html/projetos.html",
        "js/projetos/app.js",
        "css/projetos.css",
```

- [ ] **Step 4: Guarda do legado e título**

Em `dist/js/init.js`, troque:

```js
            if (typeof loadProjetosPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-projetos.js"));
```

por:

```js
            // Projetos novos (js/init_projetos.js, pacote Lab) marcam o <html>: o legado so carrega sem eles ou
            // com servidor do Atividades configurado (os dois convivem; o legado vira "Projetos (Atividades)").
            if (typeof loadProjetosPro === 'undefined' && (!document.documentElement.hasAttribute('data-seipro-projetos') || (function () {
                try { var c = JSON.parse(localStorage.getItem('configBasePro_atividades')); return !!(c && c.URL_API && c.KEY_USER); } catch (e) { return false; }
            })())) $.getScript(getUrlExtension("js/sei-pro-projetos.js"));
```

Em `dist/js/sei-pro-projetos.js`, troque:

```js
<i class="fa fa-tasks azulColor" style="margin: 0 5px; font-size: 1.1em;"></i> Projetos'+
```

por:

```js
<i class="fa fa-tasks azulColor" style="margin: 0 5px; font-size: 1.1em;"></i> '+(document.documentElement.hasAttribute('data-seipro-projetos') ? 'Projetos (Atividades)' : 'Projetos')+
```

(As duas trocas do legado são só ASCII. Depois de editar, confira por bytes no Step 6.)

- [ ] **Step 5: `check-dom-injection` passa a varrer os bundles novos (arquivo gitignored)**

Em `tools/check-dom-injection.mjs`, troque:

```js
  'dist/js/init_historico.js',
  'dist/js/historico/app.js'
];
```

por:

```js
  'dist/js/init_historico.js',
  'dist/js/historico/app.js',
  'dist/js/init_projetos.js',
  'dist/js/projetos/app.js'
];
```

Faça a mesma troca em `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro/tools/check-dom-injection.mjs` (o clone principal; spec 4.3). Nenhuma mudança no `tools/patch-manifests.mjs`: os recursos do Projetos não precisam entrar em `RECURSOS_NOVOS` (como os do Favoritos e do Histórico, só o manifest Lab os declara).

- [ ] **Step 6: Rodar as provas e todos os portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -3
```
Expected: `671 ok, 0 falha(s)` (+6 provas; base: 393 ao fim do P2 no ensaio — se o P2 fechou com outro número, some a diferença).

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && node tools/patch-manifests.mjs --check && node tools/check-dom-injection.mjs 2>/dev/null | tail -1 && LC_ALL=C grep -c '[^ -~	]' dist/js/init.js dist/js/sei-pro-projetos.js && node -e "for (const f of ['dist/js/init.js','dist/js/sei-pro-projetos.js']) new Function(require('fs').readFileSync(f,'utf8')); console.log('sintaxe ok')"
```
Expected: `0 manifest(s) precisam de ajuste, 1 ja em dia`, `check-dom-injection: 0 erro(s), 0 aviso(s)`, `0` nos dois arquivos legados e `sintaxe ok`.

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && (cd projetos && npm run tipos && npx biome check src tests && node build.mjs | tail -1) && for p in sei-comum sei-nucleo favoritos historico agente-ia; do (cd $p && echo "$p: $(npx tsx tests/verificar.ts 2>&1 | tail -2 | head -1)"); done
```
Expected: `portoes: ASCII e DOM seguro ok`; sei-comum 419, sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054 (todos `0 falha(s)`).

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  dist/manifest.json \
  dist/js/init.js \
  dist/js/sei-pro-projetos.js \
  projetos/tests/verificar-manifest.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: manifest Lab, guarda do legado e titulo Projetos (Atividades)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado (nunca `git add -A`).

(O `tools/check-dom-injection.mjs` é gitignored: fica fora do commit, mudado nos dois clones.)

---
## Auto-revisão (feita ao escrever o plano)

**1. Cobertura da spec.**
- 3.1 Título (ícone gantt, "Projetos", recolher, pílulas visíveis recolhido e clicáveis → filtro; abre o projeto se só um tem o alerta): T12 (`montarPainelProjetos`, `pintarAlertas`, `ligarAlertas`), T11 (`aplicarAlerta`), T13 (tratador `alerta`), T1 (porta nos dois sentidos). Abas (Todos (N), prédio/pessoa, nome, ponto vermelho, %, "Mais N ▾", "+ Novo projeto", estado da sincronia com dica, ajustes): T3. Menu ajustes: T3 + Decisão 6 (itens do P4 por extensão). Cabeçalho (processo que abre o processo, Toda a unidade/Só eu, "X de Y etapas concluídas", "termina em", lápis) e os 5 controles: T4. Vista Gantt com lista à esquerda 290 px, 64/36 px, fases recolhíveis com feitas/total, ícone de situação, avatar, realce cruzado, clique abre o balão, "Adicionar etapa… (Enter)" com 5 dias úteis depois da última: T5 + T11; opção "Mostrar lista de etapas": T3/T5/T11. Vista Lista (tabela por fase, pílula "marco"): T5. Todos (coluna com escopo/nome/pílula; Gantt por projeto com cor por situação; escala padrão Mês; clique abre; Lista com Projeto/Onde/Início/Término/Etapas/Progresso; primário "+ Novo projeto"): T6 + T4 + T11. Balão (pílula com dias úteis de atraso, "Fase · Responsável", datas e dias úteis, replanejamento, checklist X de Y, documento, processo, régua só manual, notas automáticas, Concluir/Cumprido/Reabrir, Editar, menu duplicar/mover/histórico/excluir, Esc e clique fora): T7. Filtro (chips com contagem, Concluídas, Só as minhas, Responsável/Fase/Etiqueta OU dentro e E entre, contagem no botão): T4 (+ chip "Vence nesta semana", Decisão 3).
- 3.2 Novo/Editar projeto (nome, processo da caixa + digitado, Quem vê em cartões, Em branco | De um modelo com prévia; Editar com Arquivar/Reativar, Duplicar, Salvar como modelo, Excluir): T9 + T11. Etapa (essenciais e as 6 seções com resumo; Excluir | Cancelar | Salvar): T8. Concluir com 1 clique + aviso "Informar documento"/"Desfazer" + mini-diálogo com número SEI e "Concluída em": T1 + T9 + T11. Primeiro uso (texto, "Criar projeto", "Começar de um modelo", link de importar só com servidor e importação): T3 + T11. Diálogos de apoio: arquivados (T9); Sincronização, Modelos, Importar, Receber, Histórico de alterações = P4 (pontos de extensão em T3/T11).
- 3.4 Tema: T13 (`data-tema` e `--spro-cor-sei` como os Favoritos; o iframe com `color-scheme` do tema, T12); cores por situação no CSS (T13) e no `gantt.css` (P2).
- 4.1 Saídas e organização: T13 (build, `html`, `css` = base + lista + projetos + gantt) e T12 (`pagina/`); `app/lateral/` e `pagina/{caixa,arvore,balao,sincronia,lateral,atividades}.ts` são do P4/P5.
- 4.3 Legado (guarda no `init.js`, "Projetos (Atividades)"), manifest Lab (content script + WAR), `check-dom-injection` (ARQUIVOS_GERADOS): T14. Shell do lateral, `background.js`, Agente: P5.
- 5.4 Preferências: T2 (todas as chaves, inclusive as do lateral). Regras usadas: concluir (Decisão 9), arraste com dependentes (T11 `completar` + `violacoesDeDatas`), validação no diálogo + `ErroValidacao` do repositório (T8/T9).
- 7 RPC: T12 (aba) e T13 (app); `sincronizarAgora`, `apagarDoSei`, `importarAtividades`, `focarProjeto` do lado da aba: P4/P5.
- 9 Erros: falha da Frappe (T5/T11), recusa do arraste (T11), mensagens do repositório nos diálogos (T8/T9), datas (T2/T8/T9). Quota do `storage.local` cheia: o erro do repositório vira aviso com a mensagem (T11 `mensagem`); o texto específico "espaço do navegador cheio" fica para o P4, junto com o resto do tratamento de armazenamento.

**2. Pendências herdadas (`notas-fases.md`, P3).** Validar entradas antes do modelo: `dataDeFormulario` (T2) nos diálogos (T8, T9) e no "Informar documento" (T9); a duração não é digitada no P3 (só datas). Fase morta = sem fase: `etapasComFaseViva` (T2). Apoio real no histórico: o app só usa `editarEtapa`/`moverDatas` (Decisão 10). `noUncheckedIndexedAccess` × núcleo: dois tsconfig (Decisão 2). Id do painel e ordem: Decisão 11. Concluir duas vezes: Decisão 9.

**3. Placeholders.** Todo passo de código traz o arquivo completo ou a troca exata (o texto de antes e o de depois); os comandos trazem a saída esperada; as contagens são as do ensaio.

**4. Tipos.** Os nomes e assinaturas usados nas tarefas seguintes são os do bloco "Produces" das anteriores e foram compilados juntos no ensaio (`tsc` dos dois tsconfig) e reconstruídos a partir deste markdown.

**5. Review Focus.** Cada linha tem prova na tarefa dona: textos hostis (T3–T11), datas de formulário (T2, T8, T9), concluir/desfazer (T7, T11), preferências em fila (T2, T11), filtro escondendo o pedido (T11).

**Riscos para o P6 (validação ao vivo):**
1. Usuários pela árvore de um processo já visualizado (Decisão 4): conferir no SEI SP 4.1.5 que nenhum andamento é gravado e que o vermelho da caixa não muda; se mudar, trocar `buscarCompleta` por `null` em `pagina/main.ts` (fica a lista parcial).
2. Alinhamento real da lista com a Frappe (64/36 px, rolagem horizontal, barra de rolagem) e a rolagem mantida no `atualizar` — só no navegador.
3. `<dialog>` não modal posicionado por `abrirFlutuante` (balão e filtro): estilos do navegador para `dialog` e a lista do seletor dentro dele.
4. `<title>` da tela `procedimento_trabalhar` no SEI 5 (a conferência mostra "Documento encontrado no SEI" se não achar o protocolo).
5. A opção antiga "Gerenciar Projetos" precisa estar ligada no perfil de teste (perfil limpo tem tudo desligado).
