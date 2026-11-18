# Gestor de Projetos em TS — P2: núcleo do pacote `projetos/` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o pacote `projetos/` (build, provas, portões) com o modelo de dados, o repositório por escopo, os modelos de projeto, a Frappe Gantt 1.2.2 vendorizada e ajustada e o wrapper do Gantt — tudo provado com tsx + linkedom, sem interface e sem nada em `dist/`.

**Architecture:** Funções puras em `src/modelo/` (tipos da spec 5.2, calendário de dias úteis, situação, progresso, resumos, alertas, dependências, linha de base, validação, operações com carimbo, histórico, filtro, vínculos) sob um `RepositorioProjetos` por escopo (uma chave por entidade no `chrome.storage.local`, lápides, histórico, mesclagem por entidade com `mesclar` do `sei-comum`). `src/modelos/` aplica e salva modelos em dias úteis. `src/gantt/` transforma dados em linhas e tarefas e monta a Frappe ajustada (`src/vendor/frappe-gantt/`), com decorações no gancho `after_render` e um controlador para o app. `src/api.ts` junta a API pública e é a entrada do build de verificação, que roda em memória.

**Tech Stack:** TypeScript 5.9 (`strict`, `noUncheckedIndexedAccess`), esbuild 0.25 (`charset: "ascii"`), tsx 4 + linkedom 0.18 (provas), Biome 2, Frappe Gantt 1.2.2 (MIT, vendorizada), `sei-comum` (`armazenamento`, `sincronia/entidade`, `ordem/indice`, `datas`, `id`, `texto`, `tests/util`).

**Spec:** `docs/superpowers/specs/2026-10-06-projetos-design.md` (seções 3, 4.1, 5 e 8) e a tela aprovada `docs/superpowers/specs/2026-10-06-projetos-telas/painel.html` (uso da Frappe, medidas, escalas). Plano-mestre: `docs/superpowers/plans/2026-10-06-projetos-00-mapa.md` (fase P2).

**Como este plano foi escrito:** todo o código abaixo foi montado e rodado antes, fora da worktree, tarefa por tarefa: cada tarefa compila (`tsc`), passa no Biome, passa nas suas provas (as contagens esperadas estão em cada tarefa) e no build. As edições incrementais do repositório (Tarefas 8 e 9) e o aplicador dos ajustes da Frappe (Tarefa 10) foram conferidos byte a byte contra o resultado esperado.

## Global Constraints

- Idioma: código, nomes, comentários, textos de interface e mensagens em português do Brasil; título de commit sem acento (ex.: `Projetos: modelo de situacao e progresso`), terminando com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Git: trabalhar só na worktree `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos` (branch `feat/projetos-ts`); conferir `git branch --show-current`; **nunca `git add -A`** (adicionar por caminho); sem push, merge, release. Neste P2 só nasce a pasta `projetos/`: nada em `dist/`, no manifest, em `sei-comum`, `sei-nucleo`, `favoritos`, `historico` ou `agente-ia`.
- Independência do P1 (que roda em paralelo): usar só o que já existe no `sei-comum` em 06/10/2026 — `armazenamento/area`, `armazenamento/colecao`, `sincronia/entidade`, `ordem/indice`, `datas/dias`, `datas/feriados`, `id`, `texto` e `tests/util`. Nada de Texto Padrão, diálogo ou painel embutido nesta fase.
- JS gerado só ASCII: esbuild `charset: "ascii"` + portão de bytes > 0x7f no `build.mjs`; o `estatico/gantt.css` também só ASCII.
- DOM seguro: em TS só `h()`/`textContent`/`createElementNS`; proibido `innerHTML`, `outerHTML`, `insertAdjacentHTML`, atributos `on*` em string. Vale para a Frappe vendorizada: o pacote gerado não contém essas palavras.
- SEI em HTTP: sem `crypto.randomUUID` direto e sem Web Locks — ids por `novoId()` de `@comum/id` (é o padrão do repositório).
- Privacidade: processo sigiloso nunca vai ao Texto Padrão nem ao Agente. No P2: o histórico (que irá ao Texto Padrão da unidade no P4) escreve "processo sigiloso" no lugar do número, e a mesclagem mantém o número local quando o vínculo chega vazio.
- Datas: `DataISO` ("AAAA-MM-DD") sempre local (`hojeISO`/`deISO` de `@comum/datas/dias`; `dataDe`/`meiaNoite` do calendário); nunca `toISOString()` para data local. As provas rodam com `TZ=America/Sao_Paulo` forçado por `tests/fuso.ts` (importado primeiro).
- Testes: tsx + linkedom, agregador `projetos/tests/verificar.ts`; **linha de base que não pode cair** nos outros pacotes (o P2 não mexe neles): sei-comum 178, sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054.
- Portões do pacote: `npx tsc --noEmit`, `npx biome check src tests`, `node build.mjs` (ASCII + DOM seguro sobre o pacote em memória). Na raiz, `node tools/check-dom-injection.mjs` continua passando (o P2 não gera arquivo em `dist/`).
- Frappe Gantt 1.2.2 (MIT) vendorizada em `projetos/src/vendor/frappe-gantt/` com `LICENSE` e `AJUSTES.md`; o bundle final não contém `innerHTML`/`outerHTML`/`insertAdjacentHTML`.
- Visual: o `gantt.css` usa só os tokens `--spro-*` de `sei-comum/src/ui/base.css` (nenhuma cor fixa nas regras do SEI Pro) e as medidas da tela 1 (cabeçalho 64 px, linha 36 px: `bar_height` 22, `padding` 14, `upper_header_height` 28, `lower_header_height` 26).
- Chaves de armazenamento: `projetos/<host>|<login>|u:<idUnidade>/<un|eu>/<p|f|e|h|m>/<id>` e `…/meta`; preferências em `projetos/preferencias`.
- Limites (spec 5.4): nome ≤ 200; checklist ≤ 50 itens (≤ 200 caracteres); etiquetas ≤ 10 (≤ 40); observações ≤ 2.000; 100 projetos ativos por escopo; 300 etapas por projeto; histórico ≤ 300 registros por escopo; modelos ≤ 50 por escopo; lápides 180 dias (toda a unidade) e 90 (só eu).

## Review Focus

1. **Datas nas bordas** (Review Focus 3 do plano-mestre) — etapa de 1 dia, marco, início = término, término em fim de semana ou feriado, virada de ano, fuso (23h30 em Brasília, quando `toISOString()` já é o dia seguinte), progresso pelo tempo sem divisão por zero, "vence nesta semana" num sábado: dia certo e número certo. Provas: Tarefa 2 (calendário e fuso), Tarefa 3 (progresso, alertas), Tarefa 5 (etapa nova), Tarefa 9 (modelo começando no sábado e atravessando o ano).
2. **Textos hostis** (Review Focus 4 do plano-mestre) — nome com `<img src=x onerror=...>`, aspas, `&`, acento e emoji aparece como texto no rótulo do Gantt (nenhum `<img>` nasce) e o pacote não contém `innerHTML`. Provas: Tarefa 10 (rótulo da Frappe ajustada, varredura do pacote), Tarefa 12 (wrapper com o nome hostil).
3. **Arraste na escala Semana com dependentes fora da tela** — posição em pixels fracionários (64/7 px por dia) e dependente numa fase recolhida ou filtrada: datas inteiras corretas, nada de `TypeError` da Frappe (dependência ausente), o dependente escondido anda junto, uma recusa devolve a barra ao lugar. Provas: Tarefa 4 (`completarComDependentes`), Tarefa 11 (dependência escondida sai da tarefa), Tarefa 12 (arraste de +3 dias e recusa).
4. **Dado de fora malformado** — arquivo ou Texto Padrão editado à mão: data impossível (30/02), campo faltando, `null`, chave de ordem inválida, término antes do início, etapa de 14 anos: é ignorado na mesclagem ou desenhado sem desalinhar a lista do Gantt, e a gravação seguinte funciona. Provas: Tarefa 8 (`entidadeValida`, ordem inválida), Tarefa 11 (tarefas sempre desenháveis).
5. **Processo sigiloso** — o número nunca entra num registro do histórico e sobrevive à mesclagem quando o vínculo chega vazio. Provas: Tarefa 5 (registro "processo sigiloso"), Tarefa 8 (`manterNumeroSigiloso` e mesclagem).

## Decisões desta fase

1. **Build do P2 em memória.** O `build.mjs` empacota `src/api.ts` (toda a API pública; a partir da Tarefa 12 também a Frappe, pelo wrapper) com as opções do `historico/build.mjs`, sem gravar em `dist/`, e roda os portões ASCII e DOM seguro sobre o resultado. Motivo: o manifest ainda não conhece o módulo, e um arquivo gerado sem uso confundiria a revisão e o `check-dom-injection`. O P3 troca `ENTRADAS` pelas saídas reais (`dist/js/init_projetos.js`, `dist/js/projetos/app.js`, `dist/html/projetos.html`, `dist/css/projetos.css`).
2. **`src/api.ts`** é o índice da API pública (reexporta os módulos); os módulos importam uns aos outros pelo caminho.
3. **Arrastar só nas escalas Dia e Semana** (`readonly_dates` em Mês e Ano). Na 1.2.2, `date_utils.add` faz `parseInt` da quantidade: em Mês/Ano a data do arraste volta para o dia 1 (conferido ao escrever o plano: +4 px na escala Mês levou uma barra de 12/10 para 01/10).
4. **Datas do arraste lidas da posição da barra** em dias inteiros (`Math.round(x / pxPorDia)`), não das datas que a Frappe calcula (ela trunca dias fracionários). A confirmação é no `mouseup` do documento (a Frappe avisa `on_date_change` a cada passo do mouse); todas as barras de etapa são comparadas com as linhas, então dependentes movidos pela Frappe entram no mesmo lote.
5. **Dependências.** Regra dura = a da Frappe: uma etapa não começa antes do INÍCIO da etapa da qual depende; vale também no modelo (`violacoesDeDatas`) e no repositório (`moverDatas`), junto com "término antes do início" e "marco com duas datas". Dependência para etapa fora da tela (fase recolhida, filtro) sai da tarefa da Frappe (senão `update_bar_position` quebra) e `completarComDependentes` leva as escondidas junto quando "mover dependentes" está ligado.
6. **Situação "em andamento"** também com progresso manual > 0 antes do início (tela 2: "ou ao mexer no progresso"); a linha de base continua presa às datas (spec 5.4).
7. **"Próximos 30 dias" exclui concluídas**, como "atrasadas" e "vence nesta semana" (o chip e a agenda mostram trabalho pendente).
8. **Linhas da vista do projeto:** etapas sem fase primeiro, sem cabeçalho; depois cada fase na ordem manual. Fase vazia aparece (sem filtro) com a barra invisível em hoje; com filtro, fase sem etapa visível some. Portfólio: só projetos ativos (arquivado fica no diálogo dos arquivados).
9. **Etapa nova pela última linha** ("Adicionar etapa… (Enter)"): começa no primeiro dia útil depois do término da última etapa (sem etapas: hoje ou o próximo dia útil) e dura 5 dias úteis (`datasDaEtapaNova`).
10. **Duplicar projeto** recomeça a execução (sem conclusão, sem documento, progresso manual 0, checklist desmarcado, base = datas) com o nome "Cópia de <nome>".
11. **Remoções:** remover projeto grava lápide no projeto, nas fases e nas etapas com o mesmo instante; `restaurarProjeto` devolve só o que saiu junto. Remover fase deixa as etapas sem fase. Remover etapa mantém o id nas dependências das outras (ignorado enquanto ela estiver removida; volta a valer se for restaurada).
12. **`importar` exige entidades completas** (lápide inclusive). Se o P4 quiser mandar registro mínimo ao Texto Padrão, ele estende `entidadeValida` e a função de combinação.
13. **Frappe:** além dos 7 itens da spec 8, dois ajustes de robustez — 8 (rolagem sem texto superior: a escala Ano quebrava com `TypeError`) e 9 (`destroy()` tira o ouvinte de `mouseup` que a 1.2.2 deixava no `document` para sempre). `innerText` também vira `textContent` (1e). O aviso de `view_is` duplicado, que vem do fonte original, é silenciado no build.
14. **Feriados:** só os nacionais de `@comum/datas/feriados`, pré-calculados de 2000 a 2100 (`FERIADOS`, cerca de 1.400 datas); toda função de dias úteis aceita outro conjunto (provas).
15. **Fora desta fase:** preferências locais (`projetos/preferencias`; aqui só a chave), CSV, envelope com privacidade, Texto Padrão, mini-Gantt, interface — P3 a P5.

## Estrutura de arquivos

```
projetos/
  package.json, tsconfig.json, biome.json   (molde: historico/)
  build.mjs                                 build de verificacao em memoria + portoes
  estatico/gantt.css                        CSS da Frappe (dist) + tokens --spro-* e classes de situacao
  src/api.ts                                API publica (entrada do build)
  src/modelo/
    tipos.ts          entidades da spec 5.2 + Escopo, Carimbo, Entidades, EnvelopeProjetos, MudancaDeDatas
    constantes.ts     LIMITES, lapides, SEM_FASE, chaves da spec 5.1
    escopo.ts         chaves por escopo
    calendario.ts     dias uteis, feriados, DataISO local
    situacao.ts       situacao da etapa e do marco + rotulos
    progresso.ts      manual, pelo tempo, pelo checklist
    alertas.ts        atrasadas, vence nesta semana, proximos 30 dias, dias uteis de atraso
    resumo.ts         resumo de fase e de projeto
    dependencias.ts   ciclo, dependentes, deslocar, completar, violacoes de datas
    linhaDeBase.ts    regra da base, desvio
    validacao.ts      mensagens, limpeza de texto, ErroValidacao
    operacoes.ts      criar/editar/remover/restaurar/concluir com carimbo, ordenacao, etapa nova
    historico.ts      registros por campo
    filtro.ts         chips e campos
    vinculos.ts       indice protocolo -> vinculos
  src/repositorio.ts                        RepositorioProjetos + mover entre escopos, indice, mesclagem
  src/modelos/embutidos.ts, aplicar.ts, salvar.ts
  src/gantt/escalas.ts, linhas.ts, tarefas.ts, decorar.ts, montar.ts
  src/vendor/frappe-gantt/                  index.js, bar.js, arrow.js, svg_utils.js, date_utils.js, defaults.js,
                                            tipos.d.ts, index.d.ts, date_utils.d.ts, LICENSE, AJUSTES.md
  tests/util.ts, fuso.ts, fabrica.ts, apoioRepositorio.ts, ambienteGantt.ts, cenarioGantt.ts
  tests/verificar.ts + verificar-<suite>.ts
```

## Interfaces exportadas (o que P3, P4 e P5 consomem)

Todas também saem por `projetos/src/api.ts`. Alias para os outros pacotes: `@projetos/*` → `projetos/src/*`.

- **Tipos** (`modelo/tipos.ts`): `DataISO`, `Vis = "unidade" | "eu"`, `Escopo { host; login; unidade; vis }`, `Entidade` (= `Versionada` + `alteradoPor?`), `Vinculo { protocolo; idProcedimento?; sigiloso? }`, `Projeto`, `Fase`, `Etapa`, `Medida`, `ItemChecklist`, `Responsavel { login?; nome }`, `DocumentoSei { numero; titulo? }`, `LinhaDeBase`, `Registro`, `CampoHistorico`, `EtapaModelo`, `Modelo`, `Carimbo { agora; dispositivo; por?; nome? }`, `Entidades { p; f; e; h; m }`, `EnvelopeProjetos { formato: "seipro-projetos"; versao: 1; host; unidade; vis; login?; gerado; entidades }`, `MudancaDeDatas { id; inicio; fim }`.
- **Constantes e escopo:** `LIMITES`, `DIAS_LAPIDE_UNIDADE` (180), `DIAS_LAPIDE_EU` (90), `DIAS_ETAPA_NOVA` (5), `SEM_FASE`, `CHAVE_PREFERENCIAS`, `CHAVE_CONTADOR_PAINEL`, `CHAVE_LATERAL`, `chaveSyncTexto(chaveDoEscopo)`, `chaveSyncArquivo(host, login)`, `chaveUsuarios(host, idUnidade)`, `chaveImportacao(host, login)`; `chaveEscopo(e)`, `baseDoEscopo(e)`, `prefixoDe(e, "p"|"f"|"e"|"h"|"m")`, `chaveMeta(e)`, `escoposDaUnidade(host, login, unidade) → { unidade, eu }`, `rotuloDaVis(vis)`.
- **Calendário:** `FERIADOS`, `dataValida(x)`, `dataDe(date)`, `meiaNoite(iso)`, `ehUtil(iso)`, `proximoUtil(iso)`, `duracaoUteis(inicio, fim)`, `fimPorDuracao(inicio, n)`, `uteisEntre(a, b)`, `somarUteis(iso, n)`, `feriadosNoPeriodo(inicio, fim) → Feriado[]`, `sextaDaSemana(hoje)` (todas com `feriados` opcional).
- **Derivados:** `situacaoEtapa(e, hoje) → "concluida"|"atrasada"|"andamento"|"futura"`, `situacaoMarco(e, hoje) → "cumprido"|"atrasado"|"futuro"`, `ROTULO_SITUACAO`, `ROTULO_MARCO`; `progressoDaEtapa(e, hoje)`, `progressoPeloTempo(inicio, fim, hoje)`, `progressoPeloChecklist(itens)`; `resumoDeEtapas(etapas, hoje) → ResumoFase`, `resumoDoProjeto(etapas, hoje) → ResumoProjeto { inicio?; fim?; progresso; feitas; total; atrasadas; semana; situacao }`; `alertasDasEtapas(etapas, hoje) → { atrasadas; semana; proximos30 }`, `diasUteisDeAtraso(e, hoje)`.
- **Dependências e base:** `encontrarCiclo(etapas)`, `mensagemDeCiclo(ciclo, nomes)`, `validarDependencias(etapa, doProjeto) → string | null`, `dependentesTransitivos(etapas, id)`, `deslocarDependentes(etapas, id, dias)`, `completarComDependentes(etapas, mudancas)`, `violacoesDeDatas(etapas, ids?) → string[]`; `baseInicial`, `aplicarDatas(e, inicio, fim, hoje)`, `redefinirBase(e)`, `replanejada(e)`, `desvioUteis(e)`.
- **Validação e operações:** `ErroValidacao { mensagens: string[] }`, `nomeLimpo`, `etiquetasLimpas`, `checklistLimpo`, `problemasDoProjeto`, `problemasDaEtapa`, `problemasDoModelo`; `semVazios`, `editar(item, mudancas, c)`, `remover(item, c)`, `restaurar(item, c)`, `porOrdem`, `compararEtapas("inicio"|"nome"|"cadastro")`, `novoProjeto(d, id, ordem, c)`, `novaFase(projeto, nome, id, ordem, c)`, `novaEtapa(d, id, ordem, c)`, `concluir(e, hoje, c, documento?)`, `reabrir(e, c)`, `datasDaEtapaNova(etapas, hoje)`; tipos `DadosNovoProjeto`, `DadosNovaEtapa`, `OrdemEtapas`.
- **Histórico:** `registrosDeEtapa(antes, depois, apoio?)`, `registrosDeProjeto(antes, depois)`, `registrosDeFase(antes, depois)`, `carimbarRegistros(novos, c, novoId)`, `excedentes(registros, limite)`, `textoDoVinculo(v)`; tipos `RegistroNovo`, `ApoioHistorico`.
- **Filtro:** `FiltroEtapas { situacoes; soMinhas; mostrarConcluidas; responsaveis; fases; etiquetas }`, `FILTRO_VAZIO`, `filtrarEtapas(etapas, f, hoje, eu)`, `contarChips(etapas, hoje)`, `criteriosAtivos(f)`, `chaveResponsavel(r)`, `ehMinha(e, eu)`.
- **Vínculos:** `VinculoProcesso { vis; projeto; papel: "projeto"|"etapa"; etapas }`, `chaveProtocolo(p)`, `indiceDeProcessos(escopos) → Map<string, VinculoProcesso[]>`.
- **Repositório:** `new RepositorioProjetos(area: Area, escopo: Escopo, carimbo: () => Carimbo, gerarId = novoId)` com `registrar()`, `entidades()`, `dados() → Dados { projetos; fases; etapas; modelos }`, `historico(projeto?)`, `obterProjeto`, `criarProjeto(d)`, `editarProjeto(id, MudancasProjeto)`, `arquivarProjeto`, `reativarProjeto`, `removerProjeto`, `restaurarProjeto`, `duplicarProjeto`, `criarFase(projeto, nome)`, `renomearFase`, `removerFase`, `obterEtapa`, `criarEtapa(DadosNovaEtapa)`, `editarEtapa(id, MudancasEtapa, hoje)`, `moverDatas(mudancas, hoje)`, `concluirEtapa(id, hoje, documento?)`, `reabrirEtapa`, `removerEtapa`, `restaurarEtapa`, `redefinirPlanoOriginal(projeto)`, `criarProjetoDeModelo(d, modelo, inicio)`, `salvarComoModelo(projeto, nome, descricao?)`, `renomearModelo`, `removerModelo`, `exportar(agora?) → EnvelopeProjetos`, `importar(Partial<Entidades>) → { novos; atualizados; ignorados }`, `limpar(agora?)`, `vinculos()`, `carimboAtual()`, `anotarVisibilidade(...)`, `aoMudar(cb) → parar`; funções `moverEntreEscopos(origem, destino, id)`, `indiceDosEscopos(repos)`, `entidadeValida(x, tipo)`, `manterNumeroSigiloso(vencedor, local)`. Erros de regra saem como `ErroValidacao`.
- **Modelos:** `MODELOS_EMBUTIDOS` (3), `PREFIXO_EMBUTIDO`, `ehEmbutido(id)`, `datasDoModelo(modelo, inicio)`, `previaDoModelo(modelo, inicio) → { etapas; fases; termina?; primeiras }`, `aplicarModelo(modelo, inicio, ctx) → { fases; etapas }`, `modeloDoProjeto(dados, nome, id, c, descricao?)`.
- **Gantt:** `Escala = "Dia"|"Semana"|"Mês"|"Ano"`, `ESCALAS`, `MODOS`, `MEDIDAS { barra: 22; espaco: 14; cabecalhoSuperior: 28; cabecalhoInferior: 26; cabecalho: 64; linha: 36 }`, `escalaEditavel(e)`, `ehEscala(x)`; `Linha = LinhaFase | LinhaEtapa | LinhaProjeto`, `idLinhaFase(id)`, `linhasDoProjeto({ projeto, fases, etapas }, { hoje; ordem; recolhidas; visiveis? })`, `linhasDoPortfolio(itens, hoje)`; `tarefasDoGantt(linhas)`, `classesDaLinha(l)`; `decorar`, `decorarBarra`, `pxPorDia`, `xDaData`, `CLASSE_DECORACAO`; `montarGantt(area, linhas, OpcoesGantt) → ControleGantt { escala; gantt; trocarEscala(e); atualizar(linhas); rolarParaHoje(); realcar(id, ligado); destruir() }`, `OpcoesGantt { escala; hoje; mostrarLista; moverDependentes; somenteLeitura?; rolarPara?; aoClicar?(id, ancora); validar?(mudancas) → string|null; aoMudarDatas?(mudancas); aoRecusar?(msg); aoFalhar?(erro) }`, `opcoesFrappe`, `datasDaBarra`, `COR_FERIADO`. CSS: `projetos/estatico/gantt.css` (a área recebe a classe `spro-gantt`).

Notas de uso para as próximas fases:
- P3: depois de `aoMudarDatas`, o app grava (`completarComDependentes` + `repo.moverDatas`) e chama `controle.atualizar(novasLinhas)`; se o repositório recusar (`ErroValidacao`), chama `controle.atualizar(linhasAntigas)` para desfazer e mostra a mensagem. A coluna da lista usa `MEDIDAS` para alinhar com o Gantt. `montarGantt` com `aoFalhar` cobre a spec 9 (cair para a vista Lista).
- P3 que importar `@nucleo/*`: o `projetos/tsconfig.json` tem `noUncheckedIndexedAccess` e o `sei-nucleo` não; o `tsc` do projetos vai checar os arquivos do núcleo com a regra mais estrita (avaliar no P3).
- P4: o envelope de `exportar()` leva tudo, inclusive números de sigilosos; o adaptador tira o número antes de ir ao Texto Padrão (vínculo `{ protocolo: "", sigiloso: true }`), e o `importar` já preserva o local.

## Como rodar

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos"
npx tsx tests/verificar.ts   # ultima linha: "N ok, 0 falha(s)"
npx tsc --noEmit             # sem saida
npx biome check src tests    # "No fixes applied." e sem erro
node build.mjs               # "portoes: ASCII e DOM seguro ok"
```

Provas acumuladas ao fim de cada tarefa: 1 → 14 · 2 → 50 · 3 → 93 · 4 → 121 · 5 → 174 · 6 → 188 · 7 → 229 · 8 → 261 · 9 → 290 · 10 → 320 · 11 → 344 · 12 → 373.

---
### Task 1: Esqueleto do pacote `projetos/` com tipos, constantes e escopo

**Files:**
- Create: `projetos/package.json`, `projetos/tsconfig.json`, `projetos/biome.json`, `projetos/build.mjs`
- Create: `projetos/src/api.ts`, `projetos/src/modelo/tipos.ts`, `projetos/src/modelo/constantes.ts`, `projetos/src/modelo/escopo.ts`
- Test: `projetos/tests/util.ts`, `projetos/tests/fuso.ts`, `projetos/tests/fabrica.ts`, `projetos/tests/verificar-escopo.ts`, `projetos/tests/verificar.ts`

**Interfaces:**
- Consumes: `@comum/datas/dias` (`DataISO`), `@comum/sincronia/entidade` (`Versionada`), `sei-comum/tests/util.ts` (`checar`, `secao`, `lanca`, `disparar`, `resumo`, `instalarDom`).
- Produces: todos os tipos da seção "Interfaces exportadas" (`Escopo`, `Entidade`, `Projeto`, `Fase`, `Etapa`, `Registro`, `CampoHistorico`, `Modelo`, `EtapaModelo`, `Carimbo`, `Entidades`, `EnvelopeProjetos`, `MudancaDeDatas`…); `LIMITES`, `DIAS_LAPIDE_UNIDADE = 180`, `DIAS_LAPIDE_EU = 90`, `DIAS_ETAPA_NOVA = 5`, `SEM_FASE = "__sem__"`, chaves da spec 5.1; `chaveEscopo(e: Escopo): string`, `baseDoEscopo(e)`, `prefixoDe(e, tipo: "p"|"f"|"e"|"h"|"m")`, `chaveMeta(e)`, `escoposDaUnidade(host, login, unidade): { unidade: Escopo; eu: Escopo }`, `rotuloDaVis(vis): string`; nos testes, `HOJE = "2026-10-06"`, `C: Carimbo` e as fábricas `etapa({ id, ... })`, `projeto({ id, ... })`, `fase({ id, ... })`; o portão `node build.mjs`.

- [ ] **Step 1: Conferir a branch e as dependências do sei-comum**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && ls sei-comum/node_modules/linkedom/package.json sei-comum/node_modules/fractional-indexing/package.json
```

Expected: `feat/projetos-ts` e os dois caminhos. Se algum faltar: `cd sei-comum && npm install`.

- [ ] **Step 2: Criar a configuração do pacote (molde: `historico/`)**

`projetos/package.json`:

```json
{
  "name": "sei-pro-projetos",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Gestor de projetos do SEI Pro (Gantt, etapas, modelos), sem servidor",
  "scripts": {
    "build": "npm run verificar && node build.mjs",
    "build:rapido": "node build.mjs",
    "tipos": "tsc --noEmit",
    "verificar": "tsx tests/verificar.ts",
    "checar": "biome check src tests"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.2.0",
    "@types/chrome": "^0.0.300",
    "@types/node": "^22.20.4",
    "esbuild": "^0.25.0",
    "linkedom": "^0.18.13",
    "tsx": "^4.19.2",
    "typescript": "^5.9.3"
  }
}
```

Diferenças para o `historico/tsconfig.json`: aliases `@projetos/*`, `@comum/*`, `@nucleo/*` (sem `@favoritos`, `@tarjar`) e `noUncheckedIndexedAccess` (como o `sei-comum`).

`projetos/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["chrome", "node"],
    "baseUrl": ".",
    "paths": {
      "@projetos/*": ["./src/*"],
      "@comum/*": ["../sei-comum/src/*"],
      "@nucleo/*": ["../sei-nucleo/src/*"]
    }
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

O Biome ignora o vendor (fonte de terceiros, formatado com outro estilo):

`projetos/biome.json`:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "files": { "includes": ["**", "!src/vendor/**"] },
  "formatter": { "indentStyle": "space", "indentWidth": 2, "lineWidth": 140 },
  "javascript": { "formatter": { "quoteStyle": "double", "trailingCommas": "all" } },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true, "style": { "noNonNullAssertion": "off" } }
  }
}
```

- [ ] **Step 3: Instalar as devDependencies**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm install && npx tsc --version && npx biome --version
```

Expected: `added … packages`, `Version 5.9.x` e `Version: 2.x`. (`package-lock.json` e `node_modules/` são ignorados pelo `.gitignore` da raiz.)

- [ ] **Step 4: Escrever as provas e os utilitários de teste**

Os utilitários vêm do `sei-comum` (mesma forma das outras suítes):

`projetos/tests/util.ts`:

```ts
export * from "../../sei-comum/tests/util";
```

Fuso fixo de Brasília em todas as provas (importado primeiro pelo agregador):

`projetos/tests/fuso.ts`:

```ts
/**
 * Fuso de Brasília em TODAS as provas (importado primeiro pelo verificar.ts):
 * as provas de data usam 23h30, quando `toISOString()` já está no dia seguinte.
 */
process.env.TZ = "America/Sao_Paulo";
```

Fábricas de entidades usadas por todas as suítes seguintes:

`projetos/tests/fabrica.ts`:

```ts
/** Entidades de teste com valores padrão: cada prova muda só o que importa para ela. */

import type { Carimbo, Etapa, Fase, Projeto } from "../src/modelo/tipos";

export const HOJE = "2026-10-06"; // terça-feira
export const C: Carimbo = { agora: 1_000, dispositivo: "dev-a", por: "ana", nome: "Ana Lima" };

export function etapa(m: Partial<Etapa> & { id: string }): Etapa {
  return {
    projeto: "p1",
    ordem: "a0",
    nome: `Etapa ${m.id}`,
    inicio: "2026-10-05",
    fim: "2026-10-09",
    marco: false,
    dependeDe: [],
    medida: "manual",
    progresso: 0,
    checklist: [],
    etiquetas: [],
    criadoEm: 1,
    atualizadoEm: 1,
    dispositivo: "dev-a",
    ...m,
  };
}

export function projeto(m: Partial<Projeto> & { id: string }): Projeto {
  return { nome: `Projeto ${m.id}`, etiquetas: [], ordem: "a0", criadoEm: 1, atualizadoEm: 1, dispositivo: "dev-a", ...m };
}

export function fase(m: Partial<Fase> & { id: string }): Fase {
  return { projeto: "p1", nome: `Fase ${m.id}`, ordem: "a0", atualizadoEm: 1, dispositivo: "dev-a", ...m };
}
```

`projetos/tests/verificar-escopo.ts`:

```ts
import {
  CHAVE_PREFERENCIAS,
  chaveImportacao,
  chaveSyncArquivo,
  chaveSyncTexto,
  chaveUsuarios,
  DIAS_LAPIDE_EU,
  DIAS_LAPIDE_UNIDADE,
  LIMITES,
} from "../src/modelo/constantes";
import { baseDoEscopo, chaveEscopo, chaveMeta, escoposDaUnidade, prefixoDe, rotuloDaVis } from "../src/modelo/escopo";
import type { Escopo } from "../src/modelo/tipos";
import { checar, secao } from "./util";

export function verificarEscopo(): void {
  secao("projetos: escopo e chaves de armazenamento");
  const un: Escopo = { host: "sei.x.gov.br", login: " Ana.Lima ", unidade: "110", vis: "unidade" };
  const eu: Escopo = { ...un, vis: "eu" };
  checar("chave do escopo da unidade (login em minusculas)", chaveEscopo(un) === "sei.x.gov.br|ana.lima|u:110/un");
  checar("chave do escopo so eu", chaveEscopo(eu) === "sei.x.gov.br|ana.lima|u:110/eu");
  checar("base com barra final", baseDoEscopo(un) === "projetos/sei.x.gov.br|ana.lima|u:110/un/");
  checar("prefixo de etapas", prefixoDe(un, "e") === "projetos/sei.x.gov.br|ana.lima|u:110/un/e/");
  checar("chave da meta", chaveMeta(eu) === "projetos/sei.x.gov.br|ana.lima|u:110/eu/meta");
  const dois = escoposDaUnidade("sei.x.gov.br", "ANA", "110");
  checar("os dois escopos da unidade", dois.unidade.vis === "unidade" && dois.eu.vis === "eu" && dois.eu.login === "ana");
  checar("rotulos", rotuloDaVis("unidade") === "Toda a unidade" && rotuloDaVis("eu") === "Só eu");
  checar("preferencias", CHAVE_PREFERENCIAS === "projetos/preferencias");
  checar("sync do Texto Padrao por escopo", chaveSyncTexto(chaveEscopo(un)) === "projetos/sync/tp/sei.x.gov.br|ana.lima|u:110/un");
  checar("sync do arquivo por login", chaveSyncArquivo("sei.x.gov.br", "ANA") === "projetos/sync/arquivo/sei.x.gov.br|ana");
  checar("cache de usuarios por unidade", chaveUsuarios("sei.x.gov.br", "110") === "projetos/usuarios/sei.x.gov.br|u:110");
  checar("mapa da importacao", chaveImportacao("sei.x.gov.br", "Ana") === "projetos/importacao/sei.x.gov.br|ana");
  checar("lapides: 180 dias na unidade, 90 no so eu", DIAS_LAPIDE_UNIDADE === 180 && DIAS_LAPIDE_EU === 90);
  checar(
    "limites da spec 5.4",
    LIMITES.nome === 200 &&
      LIMITES.checklistItens === 50 &&
      LIMITES.checklistTexto === 200 &&
      LIMITES.etiquetas === 10 &&
      LIMITES.etiquetaTexto === 40 &&
      LIMITES.observacoes === 2000 &&
      LIMITES.projetosAtivos === 100 &&
      LIMITES.etapasPorProjeto === 300 &&
      LIMITES.historico === 300 &&
      LIMITES.modelos === 50,
  );
}
```

Agregador (cada tarefa seguinte acrescenta a sua suíte):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarEscopo } from "./verificar-escopo";

verificarEscopo();
resumo();
```

- [ ] **Step 5: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/constantes' imported from …/projetos/tests/verificar-escopo.ts`.

- [ ] **Step 6: Implementar tipos, constantes e escopo**

`projetos/src/modelo/tipos.ts`:

```ts
/**
 * Tipos do gestor de projetos (spec 5.2). Toda entidade guardada é `Versionada`
 * (carimbo da mesclagem por entidade, `@comum/sincronia/entidade`) e leva quem a
 * alterou por último (`alteradoPor`, o login). Datas civis são `DataISO`
 * ("AAAA-MM-DD", fuso local; nunca `toISOString()`).
 */

import type { DataISO } from "@comum/datas/dias";
import type { Versionada } from "@comum/sincronia/entidade";

export type { DataISO };

/** "unidade": Texto Padrão compartilhado da unidade; "eu": só o usuário (nesta unidade). */
export type Vis = "unidade" | "eu";

export interface Escopo {
  host: string;
  /** Sempre em minúsculas na chave (ver `chaveEscopo`). */
  login: string;
  /** id da unidade no SEI. */
  unidade: string;
  vis: Vis;
}

export interface Entidade extends Versionada {
  /** Login de quem gravou a versão atual (o histórico guarda o resto). */
  alteradoPor?: string;
}

export interface Vinculo {
  protocolo: string;
  idProcedimento?: string;
  /** Sigiloso: o número nunca vai ao Texto Padrão nem ao Agente (vai como vínculo vazio). */
  sigiloso?: boolean;
}

export interface Projeto extends Entidade {
  nome: string;
  processo?: Vinculo;
  /** Texto livre (o "Tipo de projeto" e o "Grupo" do legado viram etiquetas). */
  etiquetas: string[];
  /** Índice fracionário (ordem das abas). */
  ordem: string;
  criadoEm: number;
  arquivadoEm?: number;
  origem?: { atividades?: number };
}

export interface Fase extends Entidade {
  projeto: string;
  nome: string;
  ordem: string;
}

export type Medida = "manual" | "tempo" | "checklist";

export interface ItemChecklist {
  id: string;
  texto: string;
  feito: boolean;
}

export interface Responsavel {
  login?: string;
  nome: string;
}

export interface DocumentoSei {
  /** Número SEI. */
  numero: string;
  titulo?: string;
}

export interface LinhaDeBase {
  inicio: DataISO;
  fim: DataISO;
}

export interface Etapa extends Entidade {
  projeto: string;
  fase?: string;
  ordem: string;
  nome: string;
  inicio: DataISO;
  /** Inclusive. Marco: igual ao início. */
  fim: DataISO;
  marco: boolean;
  /** Ids de etapas do MESMO projeto. */
  dependeDe: string[];
  responsavel?: Responsavel;
  medida: Medida;
  /** 0 a 100; só vale com medida "manual". */
  progresso: number;
  checklist: ItemChecklist[];
  processo?: Vinculo;
  documento?: DocumentoSei;
  etiquetas: string[];
  observacoes?: string;
  concluidaEm?: DataISO;
  /** Plano original (spec 5.4). */
  base?: LinhaDeBase;
  criadoEm: number;
  origem?: { atividades?: number };
}

/** Registro de alteração: só se acrescenta; a mescla é a união. */
export interface Registro extends Entidade {
  /** id da entidade alterada (projeto, fase ou etapa). */
  alvo: string;
  projeto: string;
  quando: number;
  /** Login. */
  por: string;
  /** Nome do usuário lido do SEI. */
  nome?: string;
  campo: CampoHistorico;
  antes?: string;
  depois?: string;
}

export type CampoHistorico =
  | "criacao"
  | "exclusao"
  | "restauracao"
  | "nome"
  | "inicio"
  | "fim"
  | "responsavel"
  | "conclusao"
  | "progresso"
  | "fase"
  | "dependencias"
  | "processo"
  | "documento"
  | "arquivamento"
  | "visibilidade"
  | "base";

export interface EtapaModelo {
  nome: string;
  /** Índice em `Modelo.fases`. */
  fase?: number;
  /** Dias úteis contados do início do projeto (0 = o primeiro dia). */
  aPartirDe: number;
  /** Dias úteis ocupados (inclusive). Marco: 0. */
  duracao: number;
  marco: boolean;
  /** Índices em `Modelo.etapas`. */
  dependeDe: number[];
  checklist: string[];
}

export interface Modelo extends Entidade {
  nome: string;
  descricao?: string;
  fases: string[];
  etapas: EtapaModelo[];
  criadoEm: number;
}

/** Quando, de onde e por quem: é o que a mesclagem e o histórico usam. */
export interface Carimbo {
  agora: number;
  dispositivo: string;
  /** Login de quem grava (vira `alteradoPor`). */
  por?: string;
  /** Nome do usuário (vai para o `Registro`). */
  nome?: string;
}

/** Tudo de um escopo, inclusive lápides (sincronia, arquivo). */
export interface Entidades {
  p: Projeto[];
  f: Fase[];
  e: Etapa[];
  h: Registro[];
  m: Modelo[];
}

/** Envelope do Texto Padrão e do arquivo (spec 6.1). */
export interface EnvelopeProjetos {
  formato: "seipro-projetos";
  versao: 1;
  host: string;
  unidade: string;
  vis: Vis;
  /** Só no escopo "eu". */
  login?: string;
  /** Quando foi gerado (ms). */
  gerado: number;
  entidades: Entidades;
}

/** Mudança de datas (arraste no Gantt ou deslocamento de dependentes). */
export interface MudancaDeDatas {
  id: string;
  inicio: DataISO;
  fim: DataISO;
}
```

`projetos/src/modelo/constantes.ts`:

```ts
/** Limites da spec 5.4 e chaves de armazenamento da spec 5.1. */

export const LIMITES = {
  nome: 200,
  checklistItens: 50,
  checklistTexto: 200,
  etiquetas: 10,
  etiquetaTexto: 40,
  observacoes: 2000,
  projetosAtivos: 100,
  etapasPorProjeto: 300,
  historico: 300,
  modelos: 50,
} as const;

/** Lápides: a unidade tem usuários eventuais, que não podem ressuscitar exclusões (spec 6.1). */
export const DIAS_LAPIDE_UNIDADE = 180;
export const DIAS_LAPIDE_EU = 90;

/** Etapa nova pela última linha da lista: duração em dias úteis (spec 3.1). */
export const DIAS_ETAPA_NOVA = 5;

/** Valor do filtro de fase para as etapas sem fase (nenhum id real começa com "__"). */
export const SEM_FASE = "__sem__";

export const PREFIXO = "projetos/";
export const CHAVE_PREFERENCIAS = "projetos/preferencias";
export const CHAVE_CONTADOR_PAINEL = "projetos/contadorPainel";
export const CHAVE_LATERAL = "projetos/lateralAberto";
export const chaveSyncTexto = (chaveDoEscopo: string): string => `projetos/sync/tp/${chaveDoEscopo}`;
export const chaveSyncArquivo = (host: string, login: string): string => `projetos/sync/arquivo/${host}|${login.trim().toLowerCase()}`;
export const chaveUsuarios = (host: string, idUnidade: string): string => `projetos/usuarios/${host}|u:${idUnidade}`;
export const chaveImportacao = (host: string, login: string): string => `projetos/importacao/${host}|${login.trim().toLowerCase()}`;
```

`projetos/src/modelo/escopo.ts`:

```ts
/**
 * Escopo = de quem, em qual unidade e para quem é visível. A chave entra no
 * nome de cada entrada do `chrome.storage.local`:
 * `projetos/<host>|<login>|u:<idUnidade>/<un|eu>/<p|f|e|h|m>/<id>` (spec 5.1).
 * O login vai em minúsculas (o mesmo usuário com ou sem caixa).
 */

import type { Escopo, Vis } from "./tipos";

export type TipoEntidade = "p" | "f" | "e" | "h" | "m";

export function chaveEscopo(e: Escopo): string {
  return `${e.host}|${e.login.trim().toLowerCase()}|u:${e.unidade}/${e.vis === "unidade" ? "un" : "eu"}`;
}

/** Prefixo de tudo do escopo (com a barra final). */
export function baseDoEscopo(e: Escopo): string {
  return `projetos/${chaveEscopo(e)}/`;
}

export function prefixoDe(e: Escopo, tipo: TipoEntidade): string {
  return `${baseDoEscopo(e)}${tipo}/`;
}

export function chaveMeta(e: Escopo): string {
  return `${baseDoEscopo(e)}meta`;
}

/** Os dois escopos da unidade atual (o painel mostra os dois juntos). */
export function escoposDaUnidade(host: string, login: string, unidade: string): { unidade: Escopo; eu: Escopo } {
  const base = { host, login: login.trim().toLowerCase(), unidade };
  return { unidade: { ...base, vis: "unidade" }, eu: { ...base, vis: "eu" } };
}

export function rotuloDaVis(vis: Vis): string {
  return vis === "unidade" ? "Toda a unidade" : "Só eu";
}
```

- [ ] **Step 7: API pública e build de verificação (em memória, nada em `dist/`)**

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/constantes";
export * from "./modelo/escopo";
export type * from "./modelo/tipos";
```

O `build.mjs` usa as mesmas opções do `historico/build.mjs`, mas com `write: false`: empacota a API pública e roda os portões sobre o resultado (Decisão 1). As Tarefas 10 e 12 o completam.

`projetos/build.mjs`:

```js
#!/usr/bin/env node
/**
 * Build do Projetos.
 *
 * Fase P2 (nucleo): nada vai para dist/. O manifest ainda nao conhece o modulo e um arquivo
 * gerado sem uso confundiria a revisao. O build empacota EM MEMORIA a API publica
 * (src/api.ts: modelo, repositorio, modelos, wrapper do Gantt e a Frappe ajustada) e roda
 * os portoes sobre o resultado:
 *   - JS so ASCII (regra do projeto para JS da extensao; o esbuild ja escapa, o portao confere);
 *   - sem innerHTML/outerHTML/insertAdjacentHTML nem acao em atributo on* (DOM seguro).
 * O P3 troca ENTRADAS pelas saidas reais (dist/js/init_projetos.js, dist/js/projetos/app.js,
 * dist/html/projetos.html, dist/css/projetos.css) e passa a gravar em dist/.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const AQUI = dirname(fileURLToPath(import.meta.url));

// Opcoes comuns do esbuild (as mesmas do historico/build.mjs).
const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por projetos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

const ENTRADAS = [{ nome: "api (verificacao P2)", entrada: "src/api.ts", formato: "esm", saida: ".verificacao/api.js" }];

const PROIBIDO = /innerHTML|outerHTML|insertAdjacentHTML/;
// on<evento>=" dentro de literal, como tools/check-dom-injection.mjs ("el.onclick = fn" nao casa).
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;

let falhou = false;
const erro = (m) => {
  console.error(`ERRO: ${m}`);
  falhou = true;
};

console.log("\nProjetos -- build (P2: verificacao em memoria; nada vai para dist/)");
for (const { nome, entrada, formato, saida } of ENTRADAS) {
  const r = await build({ ...comum, entryPoints: [resolve(AQUI, entrada)], format: formato, write: false, outfile: resolve(AQUI, saida) });
  for (const f of r.outputFiles) {
    const i = f.contents.findIndex((b) => b > 0x7f);
    if (i >= 0) erro(`byte nao-ASCII em ${nome} (posicao ${i}): ${Buffer.from(f.contents.subarray(Math.max(0, i - 40), i + 10)).toString("utf8")}`);
    if (PROIBIDO.test(f.text)) erro(`${nome}: innerHTML/outerHTML/insertAdjacentHTML no pacote`);
    if (HANDLER.test(f.text)) erro(`${nome}: acao em atributo on* no pacote`);
    console.log(`  ${nome.padEnd(26)} ${Math.round(f.contents.length / 1024)} KB (em memoria)`);
  }
}

if (falhou) process.exit(1);
console.log("  portoes: ASCII e DOM seguro ok");
```

- [ ] **Step 8: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `14 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho (cerca de 1 KB) e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 9: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/package.json \
  projetos/tsconfig.json \
  projetos/biome.json \
  projetos/build.mjs \
  projetos/src/api.ts \
  projetos/src/modelo/tipos.ts \
  projetos/src/modelo/constantes.ts \
  projetos/src/modelo/escopo.ts \
  projetos/tests/util.ts \
  projetos/tests/fuso.ts \
  projetos/tests/fabrica.ts \
  projetos/tests/verificar-escopo.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: esqueleto do pacote, tipos, constantes e escopo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 2: Calendário de dias úteis e datas locais

**Files:**
- Create: `projetos/src/modelo/calendario.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-calendario.ts`

**Interfaces:**
- Consumes: `@comum/datas/dias` (`DataISO`, `deISO`, `hojeISO`, `somarDias`, `somarDiasUteis`, `diasUteisEntre`, `ehDiaUtil`), `@comum/datas/feriados` (`conjuntoDeFeriados`, `feriadosNacionais`, `Feriado`).
- Produces: `FERIADOS: ReadonlySet<DataISO>` (2000–2100), `dataValida(x: unknown): x is DataISO`, `dataDe(d: Date): DataISO`, `meiaNoite(iso): Date`, `ehUtil(iso, feriados?)`, `proximoUtil(iso, feriados?)`, `duracaoUteis(inicio, fim, feriados?): number` (inclusive; 0 se `fim < inicio`), `fimPorDuracao(inicio, duracao, feriados?)`, `uteisEntre(a, b, feriados?)`, `somarUteis(iso, n, feriados?)`, `feriadosNoPeriodo(inicio, fim): Feriado[]`, `sextaDaSemana(hoje)`.

- [ ] **Step 1: Escrever as provas**

`projetos/tests/verificar-calendario.ts`:

```ts
import {
  dataDe,
  dataValida,
  duracaoUteis,
  ehUtil,
  FERIADOS,
  feriadosNoPeriodo,
  fimPorDuracao,
  meiaNoite,
  proximoUtil,
  sextaDaSemana,
  uteisEntre,
} from "../src/modelo/calendario";
import { checar, secao } from "./util";

export function verificarCalendario(): void {
  secao("projetos: calendario e dias uteis");
  checar("feriados cobrem 2000 a 2100", FERIADOS.has("2000-01-01") && FERIADOS.has("2100-12-25"));
  checar("12/10/2026 (segunda) e feriado", !ehUtil("2026-10-12"));
  checar("sabado nao e util", !ehUtil("2026-10-10"));
  checar("terca comum e util", ehUtil("2026-10-06"));
  checar("proximoUtil de dia util e ele mesmo", proximoUtil("2026-10-06") === "2026-10-06");
  checar("proximoUtil de sabado pula domingo e o feriado de segunda", proximoUtil("2026-10-10") === "2026-10-13");
  checar("duracao inclusiva (tela 2: 01/09 a 02/10 = 23 dias uteis)", duracaoUteis("2026-09-01", "2026-10-02") === 23);
  checar("etapa de 1 dia util dura 1", duracaoUteis("2026-10-06", "2026-10-06") === 1);
  checar("etapa so no fim de semana dura 0", duracaoUteis("2026-10-10", "2026-10-11") === 0);
  checar("termino antes do inicio dura 0", duracaoUteis("2026-10-09", "2026-10-05") === 0);
  checar("termino num feriado nao conta o feriado", duracaoUteis("2026-10-08", "2026-10-12") === 2);
  checar("fimPorDuracao(1) e o proprio dia", fimPorDuracao("2026-10-06", 1) === "2026-10-06");
  checar("fimPorDuracao(5) pula o feriado de 12/10", fimPorDuracao("2026-10-07", 5) === "2026-10-14");
  checar("fimPorDuracao comecando no sabado comeca na terca 13/10", fimPorDuracao("2026-10-10", 1) === "2026-10-13");
  checar("fimPorDuracao(0) vale 1", fimPorDuracao("2026-10-06", 0) === "2026-10-06");
  checar("virada de ano: 31/12 + 2 dias uteis pula 01/01 e o fim de semana", fimPorDuracao("2026-12-31", 2) === "2027-01-04");
  checar("virada de ano: duracao de 31/12 a 04/01 e 2", duracaoUteis("2026-12-31", "2027-01-04") === 2);
  checar("uteisEntre 02/10 e 06/10 = 2 (a tela mostra '2 dias uteis' de atraso)", uteisEntre("2026-10-02", "2026-10-06") === 2);
  checar("uteisEntre ao contrario e negativo", uteisEntre("2026-10-06", "2026-10-02") === -2);
  const carnaval = feriadosNoPeriodo("2027-02-01", "2027-02-28");
  checar("carnaval de 2027 em 08 e 09/02", carnaval.map((f) => f.data).join() === "2027-02-08,2027-02-09", carnaval);
  checar(
    "feriadosNoPeriodo atravessa o ano",
    feriadosNoPeriodo("2026-12-20", "2027-01-05")
      .map((f) => f.data)
      .join() === "2026-12-25,2027-01-01",
  );
  checar("feriadosNoPeriodo invertido e vazio", feriadosNoPeriodo("2026-12-31", "2026-01-01").length === 0);
  checar("sexta da semana de uma terca", sextaDaSemana("2026-10-06") === "2026-10-09");
  checar("sexta da semana de uma segunda", sextaDaSemana("2026-10-05") === "2026-10-09");
  checar("sexta da semana de um sabado ja passou", sextaDaSemana("2026-10-10") === "2026-10-09");
  checar("sexta da semana de um domingo ja passou", sextaDaSemana("2026-10-11") === "2026-10-09");
  checar("sexta da semana na virada do ano", sextaDaSemana("2026-12-29") === "2027-01-01");

  secao("projetos: datas locais (fuso)");
  const noite = new Date(2026, 9, 6, 23, 30);
  checar("toISOString as 23h30 de Brasilia ja e o dia seguinte (a armadilha)", noite.toISOString().slice(0, 10) === "2026-10-07");
  checar("dataDe as 23h30 continua no dia local", dataDe(noite) === "2026-10-06");
  checar("dataDe a 00h05 e o proprio dia", dataDe(new Date(2026, 9, 6, 0, 5)) === "2026-10-06");
  const m = meiaNoite("2026-10-06");
  checar("meiaNoite e 00:00 local do mesmo dia", m.getHours() === 0 && m.getDate() === 6 && m.getMonth() === 9);
  checar("dataValida aceita data real", dataValida("2026-02-28"));
  checar("dataValida recusa 30 de fevereiro", !dataValida("2026-02-30"));
  checar("dataValida recusa formato brasileiro", !dataValida("06/10/2026"));
  checar("dataValida recusa nao-texto", !dataValida(20261006));
  checar("29/02 so em ano bissexto", dataValida("2028-02-29") && !dataValida("2027-02-29"));
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarEscopo } from "./verificar-escopo";

verificarEscopo();
verificarCalendario();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/calendario' imported from …/projetos/tests/verificar-calendario.ts`.

- [ ] **Step 3: Implementar**

Regras: `DataISO` sempre local (`dataDe` usa `getFullYear/getMonth/getDate`; `meiaNoite` é 00:00 local, o que a Frappe usa); duração inclusiva (a tela 2 mostra 01/09–02/10/2026 = 23 dias úteis); `fimPorDuracao` começa no próximo dia útil e conta a duração inclusive; `sextaDaSemana` usa a semana de segunda a domingo (no sábado e no domingo a sexta já passou).

`projetos/src/modelo/calendario.ts`:

```ts
/**
 * Dias úteis do projeto: segunda a sexta, menos os feriados nacionais
 * (`@comum/datas/feriados`, os mesmos dos prazos dos Favoritos). Tudo em
 * `DataISO` local: `deISO` usa o meio-dia (sem efeito de horário de verão) e
 * `dataDe` lê getFullYear/getMonth/getDate. `toISOString()` daria o dia
 * seguinte a partir das 21h em Brasília.
 */

import { type DataISO, deISO, diasUteisEntre, ehDiaUtil, hojeISO, somarDias, somarDiasUteis } from "@comum/datas/dias";
import { conjuntoDeFeriados, type Feriado, feriadosNacionais } from "@comum/datas/feriados";

export const ANO_MIN = 2000;
export const ANO_MAX = 2100;

function anos(de: number, ate: number): number[] {
  return Array.from({ length: ate - de + 1 }, (_, i) => de + i);
}

/** Feriados nacionais de 2000 a 2100 (cerca de 1.400 datas, calculadas uma vez). */
export const FERIADOS: ReadonlySet<DataISO> = conjuntoDeFeriados(anos(ANO_MIN, ANO_MAX));

const RE_DATA = /^\d{4}-\d{2}-\d{2}$/;

/** "AAAA-MM-DD" que existe no calendário (2026-02-30 não passa). */
export function dataValida(iso: unknown): iso is DataISO {
  if (typeof iso !== "string" || !RE_DATA.test(iso)) return false;
  return hojeISO(deISO(iso)) === iso;
}

/** Date (qualquer hora) → dia civil LOCAL. */
export function dataDe(d: Date): DataISO {
  return hojeISO(d);
}

/** Dia civil → meia-noite local (o que a Frappe usa para posicionar barras). */
export function meiaNoite(iso: DataISO): Date {
  const d = deISO(iso);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function ehUtil(iso: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): boolean {
  return ehDiaUtil(iso, feriados);
}

/** A própria data, se for dia útil; senão o próximo dia útil. */
export function proximoUtil(iso: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): DataISO {
  let d = iso;
  while (!ehDiaUtil(d, feriados)) d = somarDias(d, 1);
  return d;
}

/** Dias úteis em [inicio, fim], inclusive. 0 quando fim < inicio ou não há dia útil no período. */
export function duracaoUteis(inicio: DataISO, fim: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): number {
  if (fim < inicio) return 0;
  return (ehDiaUtil(inicio, feriados) ? 1 : 0) + diasUteisEntre(inicio, fim, feriados);
}

/**
 * Término de uma etapa que começa em `inicio` e dura `duracao` dias úteis
 * (inclusive). O início vai para o próximo dia útil; duração < 1 vale 1.
 */
export function fimPorDuracao(inicio: DataISO, duracao: number, feriados: ReadonlySet<DataISO> = FERIADOS): DataISO {
  const comeco = proximoUtil(inicio, feriados);
  const n = Math.max(1, Math.floor(duracao));
  return n === 1 ? comeco : somarDiasUteis(comeco, n - 1, feriados);
}

/** Dias úteis depois de `a` até `b` (inclusive); negativo quando b < a. */
export function uteisEntre(a: DataISO, b: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): number {
  return diasUteisEntre(a, b, feriados);
}

export function somarUteis(iso: DataISO, n: number, feriados: ReadonlySet<DataISO> = FERIADOS): DataISO {
  return somarDiasUteis(iso, n, feriados);
}

/** Feriados (com nome) entre duas datas, inclusive: para o destaque do Gantt na escala Dia. */
export function feriadosNoPeriodo(inicio: DataISO, fim: DataISO): Feriado[] {
  if (fim < inicio) return [];
  const de = Number(inicio.slice(0, 4));
  const ate = Number(fim.slice(0, 4));
  return anos(de, ate)
    .flatMap((ano) => feriadosNacionais(ano))
    .filter((f) => f.data >= inicio && f.data <= fim);
}

/** Sexta-feira da semana (segunda a domingo) de `hoje`. */
export function sextaDaSemana(hoje: DataISO): DataISO {
  const dia = deISO(hoje).getDay(); // 0 = domingo
  const desdeSegunda = (dia + 6) % 7;
  return somarDias(hoje, 4 - desdeSegunda);
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/escopo";
export type * from "./modelo/tipos";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `50 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelo/calendario.ts \
  projetos/tests/verificar-calendario.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: calendario de dias uteis e datas locais

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 3: Situação, progresso, alertas e resumos

**Files:**
- Create: `projetos/src/modelo/situacao.ts`, `projetos/src/modelo/progresso.ts`, `projetos/src/modelo/alertas.ts`, `projetos/src/modelo/resumo.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-situacao.ts`

**Interfaces:**
- Consumes: Tarefa 2 (`duracaoUteis`, `uteisEntre`, `sextaDaSemana`, `FERIADOS`), `@comum/datas/dias` (`somarDias`), tipos da Tarefa 1.
- Produces: `SituacaoEtapa`, `SituacaoMarco`, `situacaoEtapa(e, hoje)`, `situacaoMarco(e, hoje)`, `ROTULO_SITUACAO`, `ROTULO_MARCO`; `progressoPeloTempo(inicio, fim, hoje, feriados?)`, `progressoPeloChecklist(itens)`, `progressoDaEtapa(e, hoje, feriados?)`; `Alertas<T> { atrasadas; semana; proximos30 }`, `alertasDasEtapas(etapas, hoje)`, `diasUteisDeAtraso(e, hoje, feriados?)`; `SituacaoProjeto`, `ResumoFase { inicio?; fim?; progresso; feitas; total }`, `ResumoProjeto` (+ `atrasadas`, `semana`, `situacao`), `resumoDeEtapas(etapas, hoje)`, `resumoDoProjeto(etapas, hoje)`.

- [ ] **Step 1: Escrever as provas**

`projetos/tests/verificar-situacao.ts`:

```ts
import { alertasDasEtapas, diasUteisDeAtraso } from "../src/modelo/alertas";
import { progressoDaEtapa, progressoPeloChecklist, progressoPeloTempo } from "../src/modelo/progresso";
import { resumoDeEtapas, resumoDoProjeto } from "../src/modelo/resumo";
import { situacaoEtapa, situacaoMarco } from "../src/modelo/situacao";
import { etapa, HOJE } from "./fabrica";
import { checar, secao } from "./util";

const ids = (l: Array<{ id: string }>) => l.map((e) => e.id).join();

export function verificarSituacao(): void {
  secao("projetos: situacao da etapa e do marco");
  checar("concluida vence tudo", situacaoEtapa(etapa({ id: "a", fim: "2026-01-01", concluidaEm: "2026-01-02" }), HOJE) === "concluida");
  checar("termino ontem e atrasada", situacaoEtapa(etapa({ id: "a", inicio: "2026-10-01", fim: "2026-10-05" }), HOJE) === "atrasada");
  checar("termino hoje ainda nao e atrasada", situacaoEtapa(etapa({ id: "a", inicio: "2026-10-01", fim: HOJE }), HOJE) === "andamento");
  checar("inicio hoje e em andamento", situacaoEtapa(etapa({ id: "a", inicio: HOJE, fim: "2026-10-09" }), HOJE) === "andamento");
  checar("inicio amanha e a iniciar", situacaoEtapa(etapa({ id: "a", inicio: "2026-10-07", fim: "2026-10-09" }), HOJE) === "futura");
  checar(
    "progresso manual antes do inicio poe em andamento (tela 2)",
    situacaoEtapa(etapa({ id: "a", inicio: "2026-10-07", fim: "2026-10-09", progresso: 10 }), HOJE) === "andamento",
  );
  checar(
    "progresso pelo tempo nao antecipa o andamento",
    situacaoEtapa(etapa({ id: "a", inicio: "2026-10-07", fim: "2026-10-09", medida: "tempo", progresso: 10 }), HOJE) === "futura",
  );
  const marco = (m: Parameters<typeof etapa>[0]) => etapa({ marco: true, ...m });
  checar("marco cumprido", situacaoMarco(marco({ id: "m", inicio: HOJE, fim: HOJE, concluidaEm: HOJE }), HOJE) === "cumprido");
  checar(
    "marco de ontem nao cumprido e atrasado",
    situacaoMarco(marco({ id: "m", inicio: "2026-10-05", fim: "2026-10-05" }), HOJE) === "atrasado",
  );
  checar("marco de hoje ainda e futuro", situacaoMarco(marco({ id: "m", inicio: HOJE, fim: HOJE }), HOJE) === "futuro");

  secao("projetos: progresso");
  checar("pelo tempo antes do inicio = 0", progressoPeloTempo("2026-10-07", "2026-10-09", HOJE) === 0);
  checar("pelo tempo no dia do inicio = 0", progressoPeloTempo(HOJE, "2026-10-09", HOJE) === 0);
  checar("pelo tempo no dia do termino = 100", progressoPeloTempo("2026-10-01", HOJE, HOJE) === 100);
  checar("pelo tempo depois do termino = 100", progressoPeloTempo("2026-09-01", "2026-09-30", HOJE) === 100);
  checar("pelo tempo 1 dia: antes 0", progressoPeloTempo("2026-10-07", "2026-10-07", HOJE) === 0);
  checar("pelo tempo 1 dia: no dia 100 (sem divisao por zero)", progressoPeloTempo(HOJE, HOJE, HOJE) === 100);
  checar("pelo tempo no meio: 15 de 22 dias uteis = 68", progressoPeloTempo("2026-09-15", "2026-10-15", HOJE) === 68);
  checar("pelo tempo so em fim de semana nao vira NaN", progressoPeloTempo("2026-10-10", "2026-10-11", "2026-10-10") === 0);
  checar("checklist vazio = 0", progressoPeloChecklist([]) === 0);
  checar("checklist 2 de 3 = 67", progressoPeloChecklist([{ feito: true }, { feito: true }, { feito: false }]) === 67);
  checar("concluida = 100 mesmo com manual 30", progressoDaEtapa(etapa({ id: "a", progresso: 30, concluidaEm: HOJE }), HOJE) === 100);
  checar("manual acima de 100 vira 100", progressoDaEtapa(etapa({ id: "a", progresso: 150 }), HOJE) === 100);
  checar("manual negativo vira 0", progressoDaEtapa(etapa({ id: "a", progresso: -5 }), HOJE) === 0);
  checar("manual NaN vira 0", progressoDaEtapa(etapa({ id: "a", progresso: Number.NaN }), HOJE) === 0);
  checar(
    "medida checklist usa os itens",
    progressoDaEtapa(
      etapa({
        id: "a",
        medida: "checklist",
        progresso: 90,
        checklist: [
          { id: "1", texto: "x", feito: true },
          { id: "2", texto: "y", feito: false },
        ],
      }),
      HOJE,
    ) === 50,
  );

  secao("projetos: resumos de fase e projeto");
  const curta = etapa({ id: "a", inicio: "2026-09-28", fim: "2026-10-02", concluidaEm: "2026-10-02" }); // 5 dias uteis, 100
  const longa = etapa({ id: "b", inicio: "2026-10-07", fim: "2026-10-28" }); // 15 dias uteis (12/10 feriado), 0
  const m = etapa({ id: "m", marco: true, inicio: "2026-10-30", fim: "2026-10-30" });
  const r = resumoDeEtapas([curta, longa, m], HOJE);
  checar("progresso ponderado: (5*100 + 15*0)/20 = 25, marco pesa 0", r.progresso === 25, r);
  checar("inicio e termino do resumo", r.inicio === "2026-09-28" && r.fim === "2026-10-30");
  checar("feitas/total", r.feitas === 1 && r.total === 3);
  const marcos = [
    etapa({ id: "m1", marco: true, inicio: "2026-10-01", fim: "2026-10-01", concluidaEm: "2026-10-01" }),
    etapa({ id: "m2", marco: true, inicio: "2026-10-20", fim: "2026-10-20" }),
  ];
  checar("so marcos: fracao de cumpridos", resumoDeEtapas(marcos, HOJE).progresso === 50);
  checar(
    "sem etapas: progresso 0 e sem datas",
    (() => {
      const v = resumoDeEtapas([], HOJE);
      return v.progresso === 0 && v.total === 0 && v.inicio === undefined;
    })(),
  );
  checar("removidas nao contam", resumoDeEtapas([curta, { ...longa, removidoEm: 5 }], HOJE).total === 1);
  checar("projeto sem etapas", resumoDoProjeto([], HOJE).situacao === "semEtapas");
  checar("projeto concluido", resumoDoProjeto([curta], HOJE).situacao === "concluido");
  const atrasada = etapa({ id: "x", inicio: "2026-09-01", fim: "2026-10-02" });
  const rp = resumoDoProjeto([curta, longa, atrasada], HOJE);
  checar("projeto atrasado e contagem", rp.situacao === "atrasado" && rp.atrasadas === 1, rp);
  checar("projeto em andamento", resumoDoProjeto([curta, longa], HOJE).situacao === "andamento");
  checar("projeto a iniciar", resumoDoProjeto([longa], HOJE).situacao === "aIniciar");

  secao("projetos: alertas");
  const lista = [
    etapa({ id: "atr", inicio: "2026-09-01", fim: "2026-10-02" }),
    etapa({ id: "mar", marco: true, inicio: "2026-10-05", fim: "2026-10-05" }),
    etapa({ id: "hoj", inicio: "2026-10-01", fim: HOJE }),
    etapa({ id: "sex", inicio: "2026-10-01", fim: "2026-10-09" }),
    etapa({ id: "seg", inicio: "2026-10-01", fim: "2026-10-13" }),
    etapa({ id: "d30", inicio: "2026-11-05", fim: "2026-11-20" }),
    etapa({ id: "d31", inicio: "2026-11-06", fim: "2026-11-20" }),
    etapa({ id: "ok", inicio: "2026-09-01", fim: "2026-10-02", concluidaEm: "2026-10-02" }),
    etapa({ id: "rem", inicio: "2026-09-01", fim: "2026-10-02", removidoEm: 9 }),
  ];
  const a = alertasDasEtapas(lista, HOJE);
  checar("atrasadas: com marco, sem concluida e sem removida", ids(a.atrasadas) === "atr,mar", ids(a.atrasadas));
  checar("vence nesta semana: de hoje ate sexta", ids(a.semana) === "hoj,sex", ids(a.semana));
  checar(
    "proximos 30 dias: inicio ou termino ate hoje+30 (05/11 entra, 06/11 nao)",
    ids(a.proximos30) === "hoj,sex,seg,d30",
    ids(a.proximos30),
  );
  checar("no sabado nada vence nesta semana", alertasDasEtapas([etapa({ id: "s", fim: "2026-10-10" })], "2026-10-10").semana.length === 0);
  checar("atraso em dias uteis (tela: 2)", diasUteisDeAtraso(lista[0]!, HOJE) === 2);
  checar("sem atraso = 0", diasUteisDeAtraso(lista[2]!, HOJE) === 0);
  checar("concluida nao tem atraso", diasUteisDeAtraso(lista[7]!, HOJE) === 0);
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarEscopo } from "./verificar-escopo";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/alertas' imported from …/projetos/tests/verificar-situacao.ts`.

- [ ] **Step 3: Implementar**

Regras (spec 5.3): concluída → 100; pelo tempo = dias úteis ANTES de hoje / dias úteis totais (0 no início, 100 a partir do término; total 0 → 0, sem divisão); checklist vazio → 0; resumo ponderado pela duração em dias úteis, marco pesa 0, etapa comum pesa pelo menos 1, só marcos → fração de cumpridos; alertas ignoram concluídas e lápides (Decisão 7). `resumo.ts` importa `alertas.ts` (não o contrário).

`projetos/src/modelo/situacao.ts`:

```ts
/**
 * Situação da etapa (spec 5.3), sempre calculada, nunca gravada. Datas como
 * "AAAA-MM-DD" comparam certo com < e >.
 */

import type { DataISO, Etapa } from "./tipos";

export type SituacaoEtapa = "concluida" | "atrasada" | "andamento" | "futura";
export type SituacaoMarco = "cumprido" | "atrasado" | "futuro";

type BaseSituacao = Pick<Etapa, "inicio" | "fim" | "concluidaEm" | "marco" | "medida" | "progresso">;

export function situacaoEtapa(e: BaseSituacao, hoje: DataISO): SituacaoEtapa {
  if (e.concluidaEm) return "concluida";
  if (e.fim < hoje) return "atrasada";
  if (e.inicio <= hoje) return "andamento";
  // Tela 2: "entra em andamento sozinha na data de início (ou ao mexer no progresso)".
  if (!e.marco && e.medida === "manual" && e.progresso > 0) return "andamento";
  return "futura";
}

export function situacaoMarco(e: BaseSituacao, hoje: DataISO): SituacaoMarco {
  if (e.concluidaEm) return "cumprido";
  if (e.fim < hoje) return "atrasado";
  return "futuro";
}

export const ROTULO_SITUACAO: Record<SituacaoEtapa, string> = {
  concluida: "Concluída",
  atrasada: "Atrasada",
  andamento: "Em andamento",
  futura: "A iniciar",
};

export const ROTULO_MARCO: Record<SituacaoMarco, string> = {
  cumprido: "Marco cumprido",
  atrasado: "Marco atrasado",
  futuro: "Marco",
};
```

`projetos/src/modelo/progresso.ts`:

```ts
/**
 * Progresso da etapa (spec 5.3): concluída = 100; manual = o informado;
 * pelo tempo = dias úteis decorridos / dias úteis totais (0 antes do início,
 * 100 a partir do término); pelo checklist = feitos / total. Nunca divide por zero.
 */

import { somarDias } from "@comum/datas/dias";
import { duracaoUteis, FERIADOS } from "./calendario";
import type { DataISO, Etapa } from "./tipos";

const limitar = (n: number): number => Math.min(100, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));

export function progressoPeloTempo(inicio: DataISO, fim: DataISO, hoje: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): number {
  if (hoje < inicio) return 0;
  if (hoje >= fim) return 100;
  const total = duracaoUteis(inicio, fim, feriados);
  if (total === 0) return 0;
  // Decorridos: dias úteis ANTES de hoje (no primeiro dia ainda é 0%).
  const decorridos = duracaoUteis(inicio, somarDias(hoje, -1), feriados);
  return limitar((decorridos / total) * 100);
}

export function progressoPeloChecklist(itens: ReadonlyArray<{ feito: boolean }>): number {
  if (!itens.length) return 0;
  return limitar((itens.filter((i) => i.feito).length / itens.length) * 100);
}

type BaseProgresso = Pick<Etapa, "inicio" | "fim" | "concluidaEm" | "medida" | "progresso" | "checklist">;

export function progressoDaEtapa(e: BaseProgresso, hoje: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): number {
  if (e.concluidaEm) return 100;
  if (e.medida === "tempo") return progressoPeloTempo(e.inicio, e.fim, hoje, feriados);
  if (e.medida === "checklist") return progressoPeloChecklist(e.checklist);
  return limitar(e.progresso);
}
```

`projetos/src/modelo/alertas.ts`:

```ts
/**
 * Alertas (spec 5.3): atrasadas = não concluídas com término antes de hoje
 * (marcos incluídos); "vence nesta semana" = não concluídas com
 * hoje <= término <= sexta desta semana; "próximos 30 dias" = não concluídas
 * que começam ou terminam entre hoje e hoje + 30 dias corridos.
 */

import { somarDias } from "@comum/datas/dias";
import { FERIADOS, sextaDaSemana, uteisEntre } from "./calendario";
import type { DataISO, Etapa } from "./tipos";

export interface Alertas<T> {
  atrasadas: T[];
  semana: T[];
  proximos30: T[];
}

type BaseAlerta = Pick<Etapa, "inicio" | "fim" | "concluidaEm" | "removidoEm">;

export function alertasDasEtapas<T extends BaseAlerta>(etapas: readonly T[], hoje: DataISO): Alertas<T> {
  const sexta = sextaDaSemana(hoje);
  const limite30 = somarDias(hoje, 30);
  const saida: Alertas<T> = { atrasadas: [], semana: [], proximos30: [] };
  for (const e of etapas) {
    if (e.removidoEm !== undefined || e.concluidaEm) continue;
    if (e.fim < hoje) saida.atrasadas.push(e);
    if (e.fim >= hoje && e.fim <= sexta) saida.semana.push(e);
    const comeca = e.inicio >= hoje && e.inicio <= limite30;
    const termina = e.fim >= hoje && e.fim <= limite30;
    if (comeca || termina) saida.proximos30.push(e);
  }
  return saida;
}

/** Dias úteis de atraso ("Atrasada · 2 dias úteis"): 0 se não está atrasada. */
export function diasUteisDeAtraso(e: BaseAlerta, hoje: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): number {
  if (e.concluidaEm || e.fim >= hoje) return 0;
  return Math.max(0, uteisEntre(e.fim, hoje, feriados));
}
```

`projetos/src/modelo/resumo.ts`:

```ts
/**
 * Resumos derivados (spec 5.3): projeto e fase a partir das suas etapas.
 * Progresso = média ponderada pela duração em dias úteis; marco pesa 0; etapa
 * comum pesa pelo menos 1 (a que cai só em fim de semana não some da conta).
 * Só marcos: a fração de cumpridos.
 */

import { alertasDasEtapas } from "./alertas";
import { duracaoUteis, FERIADOS } from "./calendario";
import { progressoDaEtapa } from "./progresso";
import { situacaoEtapa } from "./situacao";
import type { DataISO, Etapa } from "./tipos";

export type SituacaoProjeto = "concluido" | "atrasado" | "andamento" | "aIniciar" | "semEtapas";

export interface ResumoFase {
  inicio?: DataISO;
  fim?: DataISO;
  progresso: number;
  feitas: number;
  total: number;
}

export interface ResumoProjeto extends ResumoFase {
  atrasadas: number;
  /** Vencem até a sexta desta semana. */
  semana: number;
  situacao: SituacaoProjeto;
}

const ativas = (etapas: readonly Etapa[]) => etapas.filter((e) => e.removidoEm === undefined);

export function resumoDeEtapas(etapas: readonly Etapa[], hoje: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): ResumoFase {
  const lista = ativas(etapas);
  if (!lista.length) return { progresso: 0, feitas: 0, total: 0 };
  let inicio = lista[0]!.inicio;
  let fim = lista[0]!.fim;
  let soma = 0;
  let peso = 0;
  let feitas = 0;
  for (const e of lista) {
    if (e.inicio < inicio) inicio = e.inicio;
    if (e.fim > fim) fim = e.fim;
    if (e.concluidaEm) feitas += 1;
    const p = e.marco ? 0 : Math.max(1, duracaoUteis(e.inicio, e.fim, feriados));
    soma += p * progressoDaEtapa(e, hoje, feriados);
    peso += p;
  }
  const progresso = peso > 0 ? Math.round(soma / peso) : Math.round((feitas / lista.length) * 100);
  return { inicio, fim, progresso, feitas, total: lista.length };
}

export function resumoDoProjeto(etapas: readonly Etapa[], hoje: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): ResumoProjeto {
  const base = resumoDeEtapas(etapas, hoje, feriados);
  const lista = ativas(etapas);
  const alertas = alertasDasEtapas(lista, hoje);
  let situacao: SituacaoProjeto;
  if (!lista.length) situacao = "semEtapas";
  else if (base.feitas === lista.length) situacao = "concluido";
  else if (alertas.atrasadas.length) situacao = "atrasado";
  else if (lista.some((e) => situacaoEtapa(e, hoje) !== "futura")) situacao = "andamento";
  else situacao = "aIniciar";
  return { ...base, atrasadas: alertas.atrasadas.length, semana: alertas.semana.length, situacao };
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/escopo";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `93 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelo/situacao.ts \
  projetos/src/modelo/progresso.ts \
  projetos/src/modelo/alertas.ts \
  projetos/src/modelo/resumo.ts \
  projetos/tests/verificar-situacao.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: situacao, progresso, alertas e resumos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 4: Dependências (ciclo, dependentes, violações) e linha de base

**Files:**
- Create: `projetos/src/modelo/dependencias.ts`, `projetos/src/modelo/linhaDeBase.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-dependencias.ts`

**Interfaces:**
- Consumes: Tarefa 2 (`uteisEntre`, `FERIADOS`), `@comum/datas/dias` (`diferencaDias`, `somarDias`), `Etapa`, `MudancaDeDatas`, `LinhaDeBase`.
- Produces: `encontrarCiclo(etapas): string[] | null` (lista fechada, ex. `["a","c","b","a"]`), `mensagemDeCiclo(ciclo, nomes): string`, `validarDependencias(etapa: Pick<Etapa,"id"|"projeto"|"dependeDe">, doProjeto: Etapa[]): string | null` (ciclo começa pela etapa editada), `dependentesTransitivos(etapas, id): string[]`, `deslocarDependentes(etapas, id, dias): MudancaDeDatas[]`, `completarComDependentes(etapas, mudancas): MudancaDeDatas[]`, `violacoesDeDatas(etapas, ids?): string[]`; `baseInicial(inicio, fim)`, `aplicarDatas(e, inicio, fim, hoje): { inicio; fim; base }`, `redefinirBase(e)`, `replanejada(e): boolean`, `desvioUteis(e, feriados?)`.

- [ ] **Step 1: Escrever as provas**

`projetos/tests/verificar-dependencias.ts`:

```ts
import {
  completarComDependentes,
  dependentesTransitivos,
  deslocarDependentes,
  encontrarCiclo,
  mensagemDeCiclo,
  validarDependencias,
  violacoesDeDatas,
} from "../src/modelo/dependencias";
import { aplicarDatas, baseInicial, desvioUteis, redefinirBase, replanejada } from "../src/modelo/linhaDeBase";
import { etapa, HOJE } from "./fabrica";
import { checar, secao } from "./util";

export function verificarDependencias(): void {
  secao("projetos: dependencias e ciclo");
  const a = etapa({ id: "a", nome: "Nota técnica" });
  const b = etapa({ id: "b", nome: "Análise jurídica", dependeDe: ["a"] });
  const c = etapa({ id: "c", nome: "Minuta", dependeDe: ["b"] });
  checar("sem ciclo", encontrarCiclo([a, b, c]) === null);
  const ciclo = encontrarCiclo([{ ...a, dependeDe: ["c"] }, b, c]);
  checar("ciclo a -> c -> b -> a", ciclo?.join() === "a,c,b,a", ciclo);
  const nomes = new Map([a, b, c].map((e) => [e.id, e.nome]));
  checar(
    "mensagem nomeia o ciclo",
    mensagemDeCiclo(ciclo!, nomes) === "Dependência circular: “Nota técnica” → “Minuta” → “Análise jurídica” → “Nota técnica”.",
    mensagemDeCiclo(ciclo!, nomes),
  );
  checar("dependencia de id que nao existe nao e ciclo", encontrarCiclo([{ ...a, dependeDe: ["zzz"] }]) === null);
  checar(
    "depender de si mesma",
    validarDependencias({ id: "a", projeto: "p1", dependeDe: ["a"] }, [a]) === "Uma etapa não pode depender dela mesma.",
  );
  checar(
    "depender de outro projeto",
    validarDependencias({ id: "n", projeto: "p1", dependeDe: ["x"] }, [a, etapa({ id: "x", projeto: "p2" })]) ===
      "Uma etapa só pode depender de etapas do mesmo projeto.",
  );
  checar(
    "depender de etapa removida",
    validarDependencias({ id: "n", projeto: "p1", dependeDe: ["a"] }, [{ ...a, removidoEm: 5 }]) ===
      "Uma etapa só pode depender de etapas do mesmo projeto.",
  );
  checar(
    "editar a para depender de c fecha o ciclo e nomeia",
    validarDependencias({ id: "a", projeto: "p1", dependeDe: ["c"] }, [a, b, c])?.startsWith("Dependência circular: “Nota técnica”") ===
      true,
  );
  checar("etapa nova sem ciclo passa", validarDependencias({ id: "nova", projeto: "p1", dependeDe: ["a", "b"] }, [a, b, c]) === null);

  secao("projetos: dependentes e deslocamento");
  const d = etapa({ id: "d", dependeDe: ["b", "c"] });
  checar("transitivos em largura sem repetir", dependentesTransitivos([a, b, c, d], "a").join() === "b,c,d");
  checar("folha nao tem dependentes", dependentesTransitivos([a, b, c, d], "d").length === 0);
  const desl = deslocarDependentes([a, b, c], "a", 3);
  checar(
    "deslocar 3 dias corridos",
    desl.map((m) => `${m.id}:${m.inicio}:${m.fim}`).join() === "b:2026-10-08:2026-10-12,c:2026-10-08:2026-10-12",
    desl,
  );
  checar("deslocar 0 nao muda nada", deslocarDependentes([a, b, c], "a", 0).length === 0);
  checar(
    "removida nao anda",
    deslocarDependentes([a, { ...b, removidoEm: 1 }, c], "a", 2)
      .map((m) => m.id)
      .join() === "c",
  );
  const comp = completarComDependentes(
    [a, b, c],
    [
      { id: "a", inicio: "2026-10-07", fim: "2026-10-13" },
      { id: "b", inicio: "2026-10-07", fim: "2026-10-13" },
    ],
  );
  checar(
    "completar: c (escondida) anda +2 junto de a; b fica como veio",
    comp.map((m) => `${m.id}:${m.inicio}`).join() === "a:2026-10-07,b:2026-10-07,c:2026-10-07",
    comp,
  );
  checar(
    "violacao: comecar antes da etapa da qual depende",
    violacoesDeDatas([a, { ...b, inicio: "2026-10-01" }]).join() ===
      "“Análise jurídica” não pode começar antes de “Nota técnica”, da qual depende.",
  );
  checar(
    "violacao: termino antes do inicio",
    violacoesDeDatas([{ ...a, fim: "2026-10-01" }]).join() === "“Nota técnica” termina antes de começar.",
  );
  checar("violacao: marco com duas datas", violacoesDeDatas([{ ...a, marco: true }]).join() === "O marco “Nota técnica” tem uma data só.");
  checar("violacoes filtradas por ids", violacoesDeDatas([{ ...a, fim: "2026-10-01" }, b], new Set(["b"])).length === 0);

  secao("projetos: linha de base");
  checar("base inicial copia as datas", baseInicial("2026-10-07", "2026-10-09").fim === "2026-10-09");
  const plan = etapa({ id: "p", inicio: "2026-10-07", fim: "2026-10-09", base: { inicio: "2026-10-07", fim: "2026-10-09" } });
  const r1 = aplicarDatas(plan, "2026-10-13", "2026-10-16", HOJE);
  checar("em planejamento a base anda junto", r1.base.inicio === "2026-10-13" && r1.base.fim === "2026-10-16");
  const andando = etapa({ id: "q", inicio: "2026-09-01", fim: "2026-09-25", base: { inicio: "2026-09-01", fim: "2026-09-25" } });
  const r2 = aplicarDatas(andando, "2026-09-01", "2026-10-02", HOJE);
  checar("depois de comecar a base fica", r2.base.fim === "2026-09-25" && r2.fim === "2026-10-02");
  checar("inicio hoje ja conta como comecada", aplicarDatas({ ...plan, inicio: HOJE }, HOJE, "2026-10-20", HOJE).base.fim === "2026-10-09");
  const semBase = aplicarDatas({ inicio: "2026-09-01", fim: "2026-09-25" }, "2026-09-01", "2026-10-02", HOJE);
  checar("sem base e ja comecada: base nasce das datas de antes", semBase.base.fim === "2026-09-25");
  const replan = { ...andando, fim: "2026-10-02" };
  checar("replanejada", replanejada(replan) && !replanejada(andando) && !replanejada({ inicio: "x", fim: "y" }));
  checar("desvio da tela 1: 25/09 -> 02/10 = +5 dias uteis", desvioUteis(replan) === 5);
  checar("sem base, desvio 0", desvioUteis({ fim: "2026-10-02" }) === 0);
  checar("redefinir plano original", redefinirBase(replan).fim === "2026-10-02");
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/dependencias' imported from …/projetos/tests/verificar-dependencias.ts`.

- [ ] **Step 3: Implementar**

Regras (spec 5.4 e Decisão 5): dependência só dentro do projeto e entre etapas vivas; mensagem com os nomes entre aspas curvas e setas ("Dependência circular: “A” → “B” → “A”."); deslocamento em dias corridos; na linha de base, "em planejamento" é o início ANTES da mudança depois de hoje (a etapa que começa hoje já congela a base); sem base e já começada, a base nasce das datas de antes.

`projetos/src/modelo/dependencias.ts`:

```ts
/**
 * Dependências entre etapas do MESMO projeto (spec 5.4): sem ciclo; arrastar
 * com "mover dependentes" desloca as dependentes pelos mesmos dias corridos.
 * As mensagens nomeiam as etapas, para o usuário achar o problema.
 */

import { diferencaDias, somarDias } from "@comum/datas/dias";
import type { Etapa, MudancaDeDatas } from "./tipos";

type No = Pick<Etapa, "id" | "dependeDe">;

const aspas = (nome: string): string => `“${nome}”`;

/** Um ciclo de dependências, como lista de ids que começa e termina na mesma etapa; null se não há. */
export function encontrarCiclo(etapas: readonly No[]): string[] | null {
  const deps = new Map(etapas.map((e) => [e.id, e.dependeDe]));
  const cor = new Map<string, 1 | 2>(); // 1 = na pilha, 2 = terminado
  const pilha: string[] = [];
  const visitar = (id: string): string[] | null => {
    cor.set(id, 1);
    pilha.push(id);
    for (const d of deps.get(id) ?? []) {
      if (!deps.has(d)) continue;
      const c = cor.get(d);
      if (c === 1) return [...pilha.slice(pilha.indexOf(d)), d];
      if (c === undefined) {
        const achou = visitar(d);
        if (achou) return achou;
      }
    }
    pilha.pop();
    cor.set(id, 2);
    return null;
  };
  for (const e of etapas) {
    if (cor.has(e.id)) continue;
    const achou = visitar(e.id);
    if (achou) return achou;
  }
  return null;
}

export function mensagemDeCiclo(ciclo: readonly string[], nomes: ReadonlyMap<string, string>): string {
  return `Dependência circular: ${ciclo.map((id) => aspas(nomes.get(id) ?? id)).join(" → ")}.`;
}

/**
 * Confere as dependências de UMA etapa (nova ou editada) contra as do projeto.
 * Devolve a mensagem do problema ou null.
 */
export function validarDependencias(etapa: Pick<Etapa, "id" | "projeto" | "dependeDe">, doProjeto: readonly Etapa[]): string | null {
  if (etapa.dependeDe.includes(etapa.id)) return "Uma etapa não pode depender dela mesma.";
  const vivas = new Map(doProjeto.filter((e) => e.removidoEm === undefined).map((e) => [e.id, e]));
  for (const d of etapa.dependeDe) {
    const alvo = vivas.get(d);
    if (!alvo || alvo.projeto !== etapa.projeto) return "Uma etapa só pode depender de etapas do mesmo projeto.";
  }
  const grafo = [...vivas.values()].filter((e) => e.id !== etapa.id).map((e) => ({ id: e.id, dependeDe: e.dependeDe }));
  grafo.push({ id: etapa.id, dependeDe: etapa.dependeDe });
  const achado = encontrarCiclo(grafo);
  if (!achado) return null;
  // O ciclo começa pela etapa que está sendo editada: é por ela que o usuário procura.
  const aberto = achado.slice(0, -1);
  const i = Math.max(0, aberto.indexOf(etapa.id));
  const ciclo = [...aberto.slice(i), ...aberto.slice(0, i)];
  ciclo.push(ciclo[0]!);
  const nomes = new Map([...vivas.values()].map((e) => [e.id, e.nome]));
  if (!nomes.has(etapa.id)) nomes.set(etapa.id, "esta etapa");
  return mensagemDeCiclo(ciclo, nomes);
}

/** Dependentes diretos e indiretos de `id`, em ordem de largura (sem repetir). */
export function dependentesTransitivos(etapas: readonly No[], id: string): string[] {
  const filhos = new Map<string, string[]>();
  for (const e of etapas) for (const d of e.dependeDe) filhos.set(d, [...(filhos.get(d) ?? []), e.id]);
  const vistos = new Set<string>([id]);
  const fila = [id];
  const saida: string[] = [];
  while (fila.length) {
    const atual = fila.shift()!;
    for (const f of filhos.get(atual) ?? []) {
      if (vistos.has(f)) continue;
      vistos.add(f);
      saida.push(f);
      fila.push(f);
    }
  }
  return saida;
}

/** Datas novas das dependentes de `id` deslocadas `dias` corridos (positivo = para frente). */
export function deslocarDependentes(etapas: readonly Etapa[], id: string, dias: number): MudancaDeDatas[] {
  if (!dias) return [];
  const porId = new Map(etapas.map((e) => [e.id, e]));
  return dependentesTransitivos(etapas, id).flatMap((d) => {
    const e = porId.get(d);
    if (!e || e.removidoEm !== undefined) return [];
    return [{ id: d, inicio: somarDias(e.inicio, dias), fim: somarDias(e.fim, dias) }];
  });
}

/**
 * Completa as mudanças de um arraste com "mover dependentes" ligado: dependente
 * que não estava na tela (fase recolhida, filtro) anda o mesmo número de dias
 * corridos da primeira etapa movida da qual depende. As já presentes ficam como vieram.
 */
export function completarComDependentes(etapas: readonly Etapa[], mudancas: readonly MudancaDeDatas[]): MudancaDeDatas[] {
  const porId = new Map(etapas.map((e) => [e.id, e]));
  const saida = new Map(mudancas.map((m) => [m.id, m]));
  for (const m of mudancas) {
    const antes = porId.get(m.id);
    if (!antes) continue;
    const dias = diferencaDias(antes.inicio, m.inicio);
    for (const d of deslocarDependentes(etapas, m.id, dias)) if (!saida.has(d.id)) saida.set(d.id, d);
  }
  return [...saida.values()];
}

/**
 * Problemas de datas nas etapas `ids` (todas, se ausente): término antes do
 * início, marco com duas datas, e etapa que começa antes de uma etapa da qual
 * depende (a mesma regra que a Frappe aplica ao arrastar).
 */
export function violacoesDeDatas(etapas: readonly Etapa[], ids?: ReadonlySet<string>): string[] {
  const vivas = etapas.filter((e) => e.removidoEm === undefined);
  const porId = new Map(vivas.map((e) => [e.id, e]));
  const saida: string[] = [];
  for (const e of vivas) {
    if (ids && !ids.has(e.id)) continue;
    if (e.fim < e.inicio) saida.push(`${aspas(e.nome)} termina antes de começar.`);
    if (e.marco && e.fim !== e.inicio) saida.push(`O marco ${aspas(e.nome)} tem uma data só.`);
    for (const d of e.dependeDe) {
      const dep = porId.get(d);
      if (dep && e.inicio < dep.inicio) saida.push(`${aspas(e.nome)} não pode começar antes de ${aspas(dep.nome)}, da qual depende.`);
    }
  }
  return saida;
}
```

`projetos/src/modelo/linhaDeBase.ts`:

```ts
/**
 * Linha de base = plano original (spec 5.4). Nasce com as datas da etapa.
 * Enquanto a etapa não começou (início ANTES da mudança depois de hoje), mudar
 * as datas leva a base junto. Depois de começar, a base fica: o desvio é a
 * diferença em dias úteis entre o término original e o atual.
 */

import { FERIADOS, uteisEntre } from "./calendario";
import type { DataISO, Etapa, LinhaDeBase } from "./tipos";

export function baseInicial(inicio: DataISO, fim: DataISO): LinhaDeBase {
  return { inicio, fim };
}

/** Datas novas de uma etapa já gravada, com a regra da base aplicada. */
export function aplicarDatas(
  e: Pick<Etapa, "inicio" | "fim" | "base">,
  inicio: DataISO,
  fim: DataISO,
  hoje: DataISO,
): { inicio: DataISO; fim: DataISO; base: LinhaDeBase } {
  const emPlanejamento = e.inicio > hoje;
  if (emPlanejamento) return { inicio, fim, base: { inicio, fim } };
  return { inicio, fim, base: e.base ?? { inicio: e.inicio, fim: e.fim } };
}

/** "Redefinir plano original": a base passa a ser as datas atuais. */
export function redefinirBase(e: Pick<Etapa, "inicio" | "fim">): LinhaDeBase {
  return { inicio: e.inicio, fim: e.fim };
}

export function replanejada(e: Pick<Etapa, "inicio" | "fim" | "base">): boolean {
  return !!e.base && (e.base.inicio !== e.inicio || e.base.fim !== e.fim);
}

/** Dias úteis entre o término original e o atual (positivo = atrasou o plano). 0 sem base. */
export function desvioUteis(e: Pick<Etapa, "fim" | "base">, feriados: ReadonlySet<DataISO> = FERIADOS): number {
  if (!e.base) return 0;
  return uteisEntre(e.base.fim, e.fim, feriados);
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/linhaDeBase";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `121 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelo/dependencias.ts \
  projetos/src/modelo/linhaDeBase.ts \
  projetos/tests/verificar-dependencias.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: dependencias (ciclo, dependentes) e linha de base

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 5: Validação, operações com carimbo e histórico de alterações

**Files:**
- Create: `projetos/src/modelo/validacao.ts`, `projetos/src/modelo/operacoes.ts`, `projetos/src/modelo/historico.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-operacoes.ts`

**Interfaces:**
- Consumes: Tarefas 1–4 (`LIMITES`, `DIAS_ETAPA_NOVA`, `dataValida`, `proximoUtil`, `fimPorDuracao`, `FERIADOS`, `baseInicial`), `@comum/texto` (`normalizarTexto`), `@comum/datas/dias` (`somarDias`).
- Produces: `ErroValidacao` (`mensagens: string[]`), `nomeLimpo`, `etiquetasLimpas`, `checklistLimpo`, `problemasDoProjeto(p)`, `problemasDaEtapa(e)`, `problemasDoModelo(m)`; `OrdemEtapas`, `semVazios`, `editar<T extends Entidade>(item, mudancas, c: Carimbo): T` (recarimba e grava `alteradoPor = c.por`), `remover`, `restaurar`, `porOrdem`, `compararEtapas(ordem)`, `DadosNovoProjeto`, `novoProjeto(d, id, ordem, c)`, `novaFase(projeto, nome, id, ordem, c)`, `DadosNovaEtapa`, `novaEtapa(d, id, ordem, c)` (marco → `fim = inicio`; base nasce com as datas), `concluir(e, hoje, c, documento?)`, `reabrir(e, c)`, `datasDaEtapaNova(etapas, hoje, feriados?)`; `RegistroNovo`, `ApoioHistorico`, `SEM_APOIO`, `textoDoVinculo(v)`, `registrosDeEtapa(antes, depois, apoio?)`, `registrosDeProjeto(antes, depois)`, `registrosDeFase(antes, depois)`, `carimbarRegistros(novos, c, novoId)`, `excedentes(registros, limite)`.

- [ ] **Step 1: Escrever as provas**

`projetos/tests/verificar-operacoes.ts`:

```ts
import { carimbarRegistros, excedentes, registrosDeEtapa, registrosDeFase, registrosDeProjeto } from "../src/modelo/historico";
import {
  compararEtapas,
  concluir,
  datasDaEtapaNova,
  editar,
  novaEtapa,
  novaFase,
  novoProjeto,
  porOrdem,
  reabrir,
  remover,
  restaurar,
} from "../src/modelo/operacoes";
import type { Registro } from "../src/modelo/tipos";
import {
  checklistLimpo,
  etiquetasLimpas,
  nomeLimpo,
  problemasDaEtapa,
  problemasDoModelo,
  problemasDoProjeto,
} from "../src/modelo/validacao";
import { C, etapa, fase, HOJE, projeto } from "./fabrica";
import { checar, secao } from "./util";

export function verificarOperacoes(): void {
  secao("projetos: validacao");
  const base = { nome: "Etapa", inicio: "2026-10-05", fim: "2026-10-09", progresso: 0, checklist: [], etiquetas: [] };
  checar("etapa valida", problemasDaEtapa(base).length === 0);
  checar("nome vazio", problemasDaEtapa({ ...base, nome: "   " }).join() === "Informe o nome da etapa.");
  checar("nome com 201 caracteres", problemasDaEtapa({ ...base, nome: "x".repeat(201) }).join() === "O nome pode ter até 200 caracteres.");
  checar("nome com 200 caracteres passa", problemasDaEtapa({ ...base, nome: "x".repeat(200) }).length === 0);
  checar("30 de fevereiro", problemasDaEtapa({ ...base, inicio: "2026-02-30" }).join() === "Informe datas válidas.");
  checar("termino antes do inicio", problemasDaEtapa({ ...base, fim: "2026-10-01" }).join() === "O término não pode ser antes do início.");
  checar("inicio igual ao termino passa", problemasDaEtapa({ ...base, fim: base.inicio }).length === 0);
  checar("progresso 101", problemasDaEtapa({ ...base, progresso: 101 }).join() === "O progresso vai de 0 a 100.");
  const itens = (n: number, t = "item") => Array.from({ length: n }, (_, i) => ({ id: String(i), texto: t, feito: false }));
  checar("51 itens de checklist", problemasDaEtapa({ ...base, checklist: itens(51) }).join() === "O checklist pode ter até 50 itens.");
  checar("item com 201 caracteres", problemasDaEtapa({ ...base, checklist: itens(1, "y".repeat(201)) }).length === 1);
  checar(
    "11 etiquetas",
    problemasDaEtapa({ ...base, etiquetas: Array.from({ length: 11 }, (_, i) => `e${i}`) }).join() === "Use até 10 etiquetas.",
  );
  checar(
    "etiqueta com 41",
    problemasDaEtapa({ ...base, etiquetas: ["z".repeat(41)] }).join() === "Cada etiqueta pode ter até 40 caracteres.",
  );
  checar(
    "observacoes com 2001",
    problemasDaEtapa({ ...base, observacoes: "o".repeat(2001) }).join() === "As observações podem ter até 2.000 caracteres.",
  );
  checar("projeto sem nome", problemasDoProjeto({ nome: "", etiquetas: [] }).join() === "Informe o nome do projeto.");
  checar(
    "modelo com fase inexistente",
    problemasDoModelo({
      nome: "M",
      fases: [],
      etapas: [{ nome: "x", fase: 0, aPartirDe: 0, duracao: 1, marco: false, dependeDe: [], checklist: [] }],
    }).join() === "Etapa do modelo aponta para uma fase que não existe.",
  );
  checar("nomeLimpo junta espacos", nomeLimpo("  Revisão   da  norma ") === "Revisão da norma");
  checar(
    "etiquetasLimpas sem repetidas por acento e caixa",
    etiquetasLimpas(["Licitação", "licitacao", " ", "TI"]).join() === "Licitação,TI",
  );
  checar(
    "checklistLimpo tira item vazio",
    checklistLimpo([
      { id: "1", texto: "  ", feito: false },
      { id: "2", texto: " a ", feito: true },
    ])
      .map((i) => i.texto)
      .join() === "a",
  );

  secao("projetos: operacoes com carimbo");
  const p = novoProjeto({ nome: "  Revisão  ", etiquetas: ["TI", "ti"] }, "p1", "a0", C);
  checar(
    "novo projeto limpo e carimbado",
    p.nome === "Revisão" && p.etiquetas.join() === "TI" && p.alteradoPor === "ana" && p.criadoEm === 1_000,
  );
  checar("novo projeto sem chaves undefined", !("processo" in p) && !("arquivadoEm" in p));
  const e = novaEtapa({ projeto: "p1", nome: "Marco", inicio: "2026-10-07", fim: "2026-10-20", marco: true }, "e1", "a0", C);
  checar("marco: fim = inicio e base de um dia", e.fim === "2026-10-07" && e.base?.fim === "2026-10-07");
  checar(
    "etapa nova: medida manual, progresso 0, base com as datas",
    e.medida === "manual" && e.progresso === 0 && e.base?.inicio === "2026-10-07",
  );
  const e2 = novaEtapa(
    { projeto: "p1", nome: "X", inicio: "2026-10-07", fim: "2026-10-09", dependeDe: ["a", "a"], progresso: 140 },
    "e2",
    "a1",
    C,
  );
  checar("dependencias sem repetir e progresso limitado", e2.dependeDe.join() === "a" && e2.progresso === 100);
  const C2 = { agora: 2_000, dispositivo: "dev-b", por: "bia" };
  const ed = editar(e2, { nome: "Y" }, C2);
  checar(
    "editar recarimba e troca alteradoPor",
    ed.atualizadoEm === 2_000 && ed.dispositivo === "dev-b" && ed.alteradoPor === "bia" && ed.nome === "Y",
  );
  checar("editar sem 'por' mantem o alteradoPor anterior", editar(ed, { nome: "Z" }, { agora: 3, dispositivo: "x" }).alteradoPor === "bia");
  checar("editar com undefined apaga o campo", !("observacoes" in editar({ ...e2, observacoes: "o" }, { observacoes: undefined }, C2)));
  const rem = remover(e2, C2);
  checar("remover grava lapide", rem.removidoEm === 2_000);
  checar("restaurar tira a lapide", !("removidoEm" in restaurar(rem, { ...C2, agora: 3_000 })));
  const conc = concluir(e2, HOJE, C2, { numero: "1234567" });
  checar("concluir com a data de hoje e documento", conc.concluidaEm === HOJE && conc.documento?.numero === "1234567");
  checar("reabrir tira a conclusao", !("concluidaEm" in reabrir(conc, C2)));
  checar("nova fase", novaFase("p1", " Instrução ", "f1", "a0", C).nome === "Instrução");
  checar(
    "porOrdem desempata pelo id",
    [fase({ id: "b" }), fase({ id: "a" })]
      .sort(porOrdem)
      .map((x) => x.id)
      .join() === "a,b",
  );
  const x = etapa({ id: "x", nome: "beta", inicio: "2026-10-05", criadoEm: 3 });
  const y = etapa({ id: "y", nome: "Álvaro", inicio: "2026-10-07", criadoEm: 1 });
  const z = etapa({ id: "z", nome: "carta", inicio: "2026-10-05", fim: "2026-10-06", criadoEm: 2 });
  checar(
    "ordenar por inicio (e termino)",
    [x, y, z]
      .sort(compararEtapas("inicio"))
      .map((i) => i.id)
      .join() === "z,x,y",
  );
  checar(
    "ordenar por nome em pt-BR",
    [x, y, z]
      .sort(compararEtapas("nome"))
      .map((i) => i.id)
      .join() === "y,x,z",
  );
  const nova = datasDaEtapaNova([etapa({ id: "a", fim: "2026-10-09" }), etapa({ id: "b", fim: "2026-12-01", removidoEm: 1 })], HOJE);
  checar("etapa nova: depois da ultima (12/10 feriado) com 5 dias uteis", nova.inicio === "2026-10-13" && nova.fim === "2026-10-19", nova);
  const primeira = datasDaEtapaNova([], HOJE);
  checar("etapa nova sem etapas: hoje + 5 dias uteis", primeira.inicio === HOJE && primeira.fim === "2026-10-13", primeira);
  checar("etapa nova num sabado comeca na terca 13/10", datasDaEtapaNova([], "2026-10-10").inicio === "2026-10-13");
  checar(
    "ordenar por cadastro",
    [x, y, z]
      .sort(compararEtapas("cadastro"))
      .map((i) => i.id)
      .join() === "y,z,x",
  );

  secao("projetos: historico de alteracoes");
  const apoio = {
    nomeDaFase: (id: string) => ({ f1: "Instrução", f2: "Deliberação" })[id],
    nomeDaEtapa: (id: string) => ({ a: "Nota" })[id],
  };
  const antes = etapa({ id: "e", nome: "AIR", fim: "2026-10-09", fase: "f1", progresso: 10 });
  const depois = {
    ...antes,
    nome: "Relatório de AIR",
    fim: "2026-10-16",
    fase: "f2",
    progresso: 40,
    dependeDe: ["a"],
    responsavel: { nome: "Carla Dias" },
    processo: { protocolo: "50300.000001/2026-11", sigiloso: true },
    documento: { numero: "1234567" },
    concluidaEm: HOJE,
  };
  const regs = registrosDeEtapa(antes, depois, apoio);
  const campos = regs.map((r) => r.campo).join();
  checar(
    "um registro por campo mudado",
    campos === "nome,fim,responsavel,conclusao,progresso,fase,dependencias,processo,documento",
    campos,
  );
  checar("fase pelo nome", regs.find((r) => r.campo === "fase")?.depois === "Deliberação");
  checar("processo sigiloso nao vaza o numero", regs.find((r) => r.campo === "processo")?.depois === "processo sigiloso");
  checar("dependencias pelos nomes", regs.find((r) => r.campo === "dependencias")?.depois === "Nota");
  checar(
    "criacao",
    registrosDeEtapa(undefined, antes)
      .map((r) => `${r.campo}:${r.depois}`)
      .join() === "criacao:AIR",
  );
  checar(
    "exclusao",
    registrosDeEtapa(antes, { ...antes, removidoEm: 5 })
      .map((r) => r.campo)
      .join() === "exclusao",
  );
  checar(
    "restauracao",
    registrosDeEtapa({ ...antes, removidoEm: 5 }, antes)
      .map((r) => r.campo)
      .join() === "restauracao",
  );
  checar("nada mudou, nada registrado", registrosDeEtapa(antes, { ...antes, atualizadoEm: 9 }).length === 0);
  checar(
    "progresso fora do manual nao registra",
    registrosDeEtapa({ ...antes, medida: "tempo" }, { ...antes, medida: "tempo", progresso: 90 }).length === 0,
  );
  checar(
    "redefinir plano original registra a base",
    registrosDeEtapa(
      { ...antes, base: { inicio: "2026-10-05", fim: "2026-10-07" } },
      { ...antes, base: { inicio: "2026-10-05", fim: "2026-10-09" } },
    )
      .map((r) => r.campo)
      .join() === "base",
  );
  checar(
    "arquivar projeto",
    registrosDeProjeto(projeto({ id: "p" }), projeto({ id: "p", arquivadoEm: 5 }))
      .map((r) => `${r.campo}:${r.depois}`)
      .join() === "arquivamento:arquivado",
  );
  checar(
    "renomear fase",
    registrosDeFase(fase({ id: "f", nome: "A" }), fase({ id: "f", nome: "B" }))
      .map((r) => r.depois)
      .join() === "B",
  );
  let n = 0;
  const carimbados = carimbarRegistros(regs.slice(0, 2), C, () => `r${++n}`);
  checar(
    "carimbar: id, quando, por e nome",
    carimbados[0]?.id === "r1" && carimbados[0]?.quando === 1_000 && carimbados[0]?.por === "ana" && carimbados[0]?.nome === "Ana Lima",
  );
  const muitos: Registro[] = Array.from({ length: 5 }, (_, i) => ({ ...carimbados[0]!, id: `h${i}`, quando: i }));
  checar("excedentes: os mais antigos saem", excedentes(muitos, 3).sort().join() === "h0,h1");
  checar("excedentes dentro do limite: nada", excedentes(muitos, 5).length === 0);
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/historico' imported from …/projetos/tests/verificar-operacoes.ts`.

- [ ] **Step 3: Implementar**

Molde das operações: `favoritos/src/modelo/operacoes.ts` (`semVazios`, `editar`, `remover`, `restaurar`, `porOrdem`). O histórico gera um registro por campo relevante (spec 5.4); progresso só com medida manual; base só quando as datas não mudaram ("Redefinir plano original"); processo sigiloso vira o texto "processo sigiloso" (Review Focus 5); `excedentes` devolve os ids além dos 300 mais recentes (sem lápide: o histórico só acrescenta).

`projetos/src/modelo/validacao.ts`:

```ts
/**
 * Validação dos dados que o usuário digita (spec 5.4 e 9). Devolve a lista de
 * mensagens; vazia = válido. O repositório lança `ErroValidacao` com ela, e o
 * diálogo mostra as mensagens como vieram.
 */

import { normalizarTexto } from "@comum/texto";
import { dataValida } from "./calendario";
import { LIMITES } from "./constantes";
import type { Etapa, ItemChecklist, Modelo, Projeto } from "./tipos";

export class ErroValidacao extends Error {
  constructor(readonly mensagens: string[]) {
    super(mensagens.join(" "));
    this.name = "ErroValidacao";
  }
}

/** Espaços nas pontas fora e espaços repetidos viram um. */
export function nomeLimpo(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Sem vazias e sem repetidas (comparando sem acento e sem caixa); a primeira grafia fica. */
export function etiquetasLimpas(lista: readonly string[]): string[] {
  const vistas = new Set<string>();
  const saida: string[] = [];
  for (const bruta of lista) {
    const e = nomeLimpo(bruta);
    const chave = normalizarTexto(e);
    if (!e || vistas.has(chave)) continue;
    vistas.add(chave);
    saida.push(e);
  }
  return saida;
}

/** Itens sem texto saem; o texto perde os espaços das pontas. */
export function checklistLimpo(itens: readonly ItemChecklist[]): ItemChecklist[] {
  return itens.map((i) => ({ ...i, texto: nomeLimpo(i.texto) })).filter((i) => i.texto);
}

function problemasDoNome(nome: string, vazio: string): string[] {
  const n = nomeLimpo(nome);
  if (!n) return [vazio];
  if (n.length > LIMITES.nome) return [`O nome pode ter até ${LIMITES.nome} caracteres.`];
  return [];
}

function problemasDasEtiquetas(etiquetas: readonly string[]): string[] {
  const saida: string[] = [];
  if (etiquetas.length > LIMITES.etiquetas) saida.push(`Use até ${LIMITES.etiquetas} etiquetas.`);
  if (etiquetas.some((e) => e.length > LIMITES.etiquetaTexto))
    saida.push(`Cada etiqueta pode ter até ${LIMITES.etiquetaTexto} caracteres.`);
  return saida;
}

export function problemasDoProjeto(p: Pick<Projeto, "nome" | "etiquetas">): string[] {
  return [...problemasDoNome(p.nome, "Informe o nome do projeto."), ...problemasDasEtiquetas(p.etiquetas)];
}

export function problemasDaEtapa(
  e: Pick<Etapa, "nome" | "inicio" | "fim" | "progresso" | "checklist" | "etiquetas" | "observacoes">,
): string[] {
  const saida = problemasDoNome(e.nome, "Informe o nome da etapa.");
  if (!dataValida(e.inicio) || !dataValida(e.fim)) saida.push("Informe datas válidas.");
  else if (e.fim < e.inicio) saida.push("O término não pode ser antes do início.");
  if (!Number.isFinite(e.progresso) || e.progresso < 0 || e.progresso > 100) saida.push("O progresso vai de 0 a 100.");
  if (e.checklist.length > LIMITES.checklistItens) saida.push(`O checklist pode ter até ${LIMITES.checklistItens} itens.`);
  if (e.checklist.some((i) => i.texto.length > LIMITES.checklistTexto))
    saida.push(`Cada item do checklist pode ter até ${LIMITES.checklistTexto} caracteres.`);
  saida.push(...problemasDasEtiquetas(e.etiquetas));
  if ((e.observacoes ?? "").length > LIMITES.observacoes) saida.push("As observações podem ter até 2.000 caracteres.");
  return saida;
}

export function problemasDoModelo(m: Pick<Modelo, "nome" | "fases" | "etapas">): string[] {
  const saida = problemasDoNome(m.nome, "Informe o nome do modelo.");
  if (m.etapas.length > LIMITES.etapasPorProjeto) saida.push(`Um modelo pode ter até ${LIMITES.etapasPorProjeto} etapas.`);
  for (const e of m.etapas) {
    if (!nomeLimpo(e.nome)) saida.push("Toda etapa do modelo precisa de nome.");
    if (e.aPartirDe < 0 || e.duracao < 0) saida.push("As durações do modelo não podem ser negativas.");
    if (e.fase !== undefined && (e.fase < 0 || e.fase >= m.fases.length))
      saida.push("Etapa do modelo aponta para uma fase que não existe.");
  }
  return [...new Set(saida)];
}
```

`projetos/src/modelo/operacoes.ts`:

```ts
/**
 * Operações puras (molde: `favoritos/src/modelo/operacoes.ts`): nada aqui toca
 * o armazenamento nem o DOM. Toda gravação recebe o carimbo (quando, de onde,
 * quem), que é o que a mesclagem e o histórico usam.
 */

import { somarDias } from "@comum/datas/dias";
import { FERIADOS, fimPorDuracao, proximoUtil } from "./calendario";
import { DIAS_ETAPA_NOVA } from "./constantes";
import { baseInicial } from "./linhaDeBase";
import type {
  Carimbo,
  DataISO,
  DocumentoSei,
  Entidade,
  Etapa,
  Fase,
  ItemChecklist,
  LinhaDeBase,
  Medida,
  Projeto,
  Responsavel,
  Vinculo,
} from "./tipos";
import { checklistLimpo, etiquetasLimpas, nomeLimpo } from "./validacao";

export type OrdemEtapas = "inicio" | "nome" | "cadastro";

type Mudancas<T> = Partial<Omit<T, "id" | "atualizadoEm" | "dispositivo">>;

/** Chaves com `undefined` saem do objeto: o storage guarda menos e "apagar campo" fica explícito. */
export function semVazios<T extends object>(o: T): T {
  for (const k of Object.keys(o)) if ((o as Record<string, unknown>)[k] === undefined) delete (o as Record<string, unknown>)[k];
  return o;
}

export function editar<T extends Entidade>(item: T, mudancas: Mudancas<T>, c: Carimbo): T {
  return semVazios({
    ...item,
    ...mudancas,
    atualizadoEm: c.agora,
    dispositivo: c.dispositivo,
    alteradoPor: c.por ?? item.alteradoPor,
  } as T);
}

export function remover<T extends Entidade>(item: T, c: Carimbo): T {
  return editar(item, { removidoEm: c.agora } as Mudancas<T>, c);
}

export function restaurar<T extends Entidade>(item: T, c: Carimbo): T {
  return editar(item, { removidoEm: undefined } as Mudancas<T>, c);
}

/** Ordem manual: chave fracionária com < e >, desempate pelo id. */
export function porOrdem(a: { ordem: string; id: string }, b: { ordem: string; id: string }): number {
  if (a.ordem !== b.ordem) return a.ordem < b.ordem ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/** Ordenação das etapas escolhida no menu (spec 3.1): início, nome ou cadastro. */
export function compararEtapas(ordem: OrdemEtapas): (a: Etapa, b: Etapa) => number {
  if (ordem === "nome") return (a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }) || porOrdem(a, b);
  if (ordem === "cadastro") return (a, b) => a.criadoEm - b.criadoEm || porOrdem(a, b);
  return (a, b) => (a.inicio !== b.inicio ? (a.inicio < b.inicio ? -1 : 1) : a.fim !== b.fim ? (a.fim < b.fim ? -1 : 1) : porOrdem(a, b));
}

export interface DadosNovoProjeto {
  nome: string;
  processo?: Vinculo;
  etiquetas?: string[];
  origem?: { atividades?: number };
  arquivadoEm?: number;
}

export function novoProjeto(d: DadosNovoProjeto, id: string, ordem: string, c: Carimbo): Projeto {
  return semVazios({
    id,
    nome: nomeLimpo(d.nome),
    processo: d.processo,
    etiquetas: etiquetasLimpas(d.etiquetas ?? []),
    ordem,
    criadoEm: c.agora,
    arquivadoEm: d.arquivadoEm,
    origem: d.origem,
    atualizadoEm: c.agora,
    dispositivo: c.dispositivo,
    alteradoPor: c.por,
  });
}

export function novaFase(projeto: string, nome: string, id: string, ordem: string, c: Carimbo): Fase {
  return semVazios({
    id,
    projeto,
    nome: nomeLimpo(nome),
    ordem,
    atualizadoEm: c.agora,
    dispositivo: c.dispositivo,
    alteradoPor: c.por,
  });
}

export interface DadosNovaEtapa {
  projeto: string;
  nome: string;
  inicio: DataISO;
  fim: DataISO;
  fase?: string;
  marco?: boolean;
  dependeDe?: string[];
  responsavel?: Responsavel;
  medida?: Medida;
  progresso?: number;
  checklist?: ItemChecklist[];
  processo?: Vinculo;
  documento?: DocumentoSei;
  etiquetas?: string[];
  observacoes?: string;
  concluidaEm?: DataISO;
  /** Sem base, ela nasce com as datas da etapa (a importação traz o programado do legado). */
  base?: LinhaDeBase;
  origem?: { atividades?: number };
}

export function novaEtapa(d: DadosNovaEtapa, id: string, ordem: string, c: Carimbo): Etapa {
  const marco = !!d.marco;
  const fim = marco ? d.inicio : d.fim;
  const base = d.base ?? baseInicial(d.inicio, fim);
  return semVazios({
    id,
    projeto: d.projeto,
    fase: d.fase,
    ordem,
    nome: nomeLimpo(d.nome),
    inicio: d.inicio,
    fim,
    marco,
    dependeDe: [...new Set(d.dependeDe ?? [])],
    responsavel: d.responsavel,
    medida: d.medida ?? "manual",
    progresso: Math.min(100, Math.max(0, Math.round(d.progresso ?? 0))),
    checklist: checklistLimpo(d.checklist ?? []),
    processo: d.processo,
    documento: d.documento,
    etiquetas: etiquetasLimpas(d.etiquetas ?? []),
    observacoes: d.observacoes?.trim() ? d.observacoes : undefined,
    concluidaEm: d.concluidaEm,
    base: marco ? { inicio: base.inicio, fim: base.inicio } : base,
    criadoEm: c.agora,
    origem: d.origem,
    atualizadoEm: c.agora,
    dispositivo: c.dispositivo,
    alteradoPor: c.por,
  });
}

/** Concluir com 1 clique: a data de hoje (spec 3.2); o documento é opcional. */
export function concluir(e: Etapa, hoje: DataISO, c: Carimbo, documento?: DocumentoSei): Etapa {
  return editar(e, { concluidaEm: hoje, documento: documento ?? e.documento }, c);
}

export function reabrir(e: Etapa, c: Carimbo): Etapa {
  return editar(e, { concluidaEm: undefined }, c);
}

/**
 * "Adicionar etapa… (Enter)" (spec 3.1): começa no primeiro dia útil depois do
 * término da última etapa (sem etapas: hoje, ou o próximo dia útil) e dura 5
 * dias úteis.
 */
export function datasDaEtapaNova(
  etapas: ReadonlyArray<Pick<Etapa, "fim" | "removidoEm">>,
  hoje: DataISO,
  feriados: ReadonlySet<DataISO> = FERIADOS,
): { inicio: DataISO; fim: DataISO } {
  const ultimo = etapas.reduce<DataISO | undefined>(
    (m, e) => (e.removidoEm === undefined && (m === undefined || e.fim > m) ? e.fim : m),
    undefined,
  );
  const inicio = proximoUtil(ultimo ? somarDias(ultimo, 1) : hoje, feriados);
  return { inicio, fim: fimPorDuracao(inicio, DIAS_ETAPA_NOVA, feriados) };
}
```

`projetos/src/modelo/historico.ts`:

```ts
/**
 * Histórico de alterações (spec 5.4): cada edição local vira registros por
 * campo relevante. Os valores são texto (datas em "AAAA-MM-DD"; a tela formata).
 * Processo sigiloso entra como "processo sigiloso": o registro vai para o
 * Texto Padrão da unidade e o número não pode ir junto.
 */

import type { CampoHistorico, Carimbo, Etapa, Fase, Projeto, Registro, Vinculo } from "./tipos";

export interface RegistroNovo {
  alvo: string;
  projeto: string;
  campo: CampoHistorico;
  antes?: string;
  depois?: string;
}

export interface ApoioHistorico {
  nomeDaFase(id: string): string | undefined;
  nomeDaEtapa(id: string): string | undefined;
}

export const SEM_APOIO: ApoioHistorico = { nomeDaFase: () => undefined, nomeDaEtapa: () => undefined };

export function textoDoVinculo(v: Vinculo | undefined): string | undefined {
  if (!v) return undefined;
  return v.sigiloso ? "processo sigiloso" : v.protocolo || undefined;
}

function ciclo<T extends { removidoEm?: number }>(
  antes: T | undefined,
  depois: T | undefined,
  alvo: string,
  projeto: string,
  nome: (x: T) => string,
): RegistroNovo[] | null {
  if (!antes && depois) return [{ alvo, projeto, campo: "criacao", depois: nome(depois) }];
  if (antes && depois && antes.removidoEm === undefined && depois.removidoEm !== undefined)
    return [{ alvo, projeto, campo: "exclusao", antes: nome(antes) }];
  if (antes && depois && antes.removidoEm !== undefined && depois.removidoEm === undefined)
    return [{ alvo, projeto, campo: "restauracao", depois: nome(depois) }];
  if (!antes || !depois) return [];
  return null;
}

function campo(saida: RegistroNovo[], alvo: string, projeto: string, c: CampoHistorico, antes?: string, depois?: string): void {
  if ((antes ?? "") !== (depois ?? "")) saida.push({ alvo, projeto, campo: c, antes, depois });
}

export function registrosDeEtapa(antes: Etapa | undefined, depois: Etapa | undefined, apoio: ApoioHistorico = SEM_APOIO): RegistroNovo[] {
  const ref = depois ?? antes;
  if (!ref) return [];
  const pronto = ciclo(antes, depois, ref.id, ref.projeto, (e) => e.nome);
  if (pronto) return pronto;
  const a = antes!;
  const d = depois!;
  const saida: RegistroNovo[] = [];
  const reg = (c: CampoHistorico, x?: string, y?: string) => campo(saida, d.id, d.projeto, c, x, y);
  reg("nome", a.nome, d.nome);
  reg("inicio", a.inicio, d.inicio);
  if (!d.marco) reg("fim", a.fim, d.fim);
  reg("responsavel", a.responsavel?.nome, d.responsavel?.nome);
  reg("conclusao", a.concluidaEm, d.concluidaEm);
  if (d.medida === "manual" && a.progresso !== d.progresso) reg("progresso", String(a.progresso), String(d.progresso));
  const nomeFase = (id?: string) => (id ? (apoio.nomeDaFase(id) ?? "") : undefined);
  reg("fase", nomeFase(a.fase), nomeFase(d.fase));
  const deps = (ids: string[]) =>
    ids.length
      ? ids
          .map((id) => apoio.nomeDaEtapa(id) ?? id)
          .sort((x, y) => x.localeCompare(y, "pt-BR"))
          .join("; ")
      : undefined;
  if ([...a.dependeDe].sort().join() !== [...d.dependeDe].sort().join()) reg("dependencias", deps(a.dependeDe), deps(d.dependeDe));
  reg("processo", textoDoVinculo(a.processo), textoDoVinculo(d.processo));
  reg("documento", a.documento?.numero, d.documento?.numero);
  const datasIguais = a.inicio === d.inicio && a.fim === d.fim;
  const textoBase = (e: Etapa) => (e.base ? `${e.base.inicio}/${e.base.fim}` : undefined);
  if (datasIguais) reg("base", textoBase(a), textoBase(d));
  return saida;
}

export function registrosDeProjeto(antes: Projeto | undefined, depois: Projeto | undefined): RegistroNovo[] {
  const ref = depois ?? antes;
  if (!ref) return [];
  const pronto = ciclo(antes, depois, ref.id, ref.id, (p) => p.nome);
  if (pronto) return pronto;
  const a = antes!;
  const d = depois!;
  const saida: RegistroNovo[] = [];
  campo(saida, d.id, d.id, "nome", a.nome, d.nome);
  campo(saida, d.id, d.id, "processo", textoDoVinculo(a.processo), textoDoVinculo(d.processo));
  if ((a.arquivadoEm === undefined) !== (d.arquivadoEm === undefined))
    saida.push({ alvo: d.id, projeto: d.id, campo: "arquivamento", depois: d.arquivadoEm === undefined ? "reativado" : "arquivado" });
  return saida;
}

export function registrosDeFase(antes: Fase | undefined, depois: Fase | undefined): RegistroNovo[] {
  const ref = depois ?? antes;
  if (!ref) return [];
  const pronto = ciclo(antes, depois, ref.id, ref.projeto, (f) => f.nome);
  if (pronto) return pronto;
  const saida: RegistroNovo[] = [];
  campo(saida, ref.id, ref.projeto, "nome", antes!.nome, depois!.nome);
  return saida;
}

export function carimbarRegistros(novos: readonly RegistroNovo[], c: Carimbo, novoId: () => string): Registro[] {
  return novos.map((r) => {
    const reg: Registro = {
      id: novoId(),
      ...r,
      quando: c.agora,
      por: c.por ?? "",
      atualizadoEm: c.agora,
      dispositivo: c.dispositivo,
    };
    if (c.nome) reg.nome = c.nome;
    if (c.por) reg.alteradoPor = c.por;
    if (reg.antes === undefined) delete reg.antes;
    if (reg.depois === undefined) delete reg.depois;
    return reg;
  });
}

/** Os `limite` mais recentes ficam; os ids dos outros saem (sem lápide: o histórico só acrescenta). */
export function excedentes(registros: readonly Registro[], limite: number): string[] {
  const vivos = registros.filter((r) => r.removidoEm === undefined);
  if (vivos.length <= limite) return [];
  const ordenados = [...vivos].sort((x, y) => y.quando - x.quando || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
  return ordenados.slice(limite).map((r) => r.id);
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `174 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelo/validacao.ts \
  projetos/src/modelo/operacoes.ts \
  projetos/src/modelo/historico.ts \
  projetos/tests/verificar-operacoes.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: validacao, operacoes com carimbo e historico

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 6: Filtro das etapas (chips e campos)

**Files:**
- Create: `projetos/src/modelo/filtro.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-filtro.ts`

**Interfaces:**
- Consumes: `alertasDasEtapas` (Tarefa 3), `situacaoEtapa` (Tarefa 3), `SEM_FASE` (Tarefa 1), `normalizarTexto` (`@comum/texto`).
- Produces: `ChipSituacao = "atrasadas"|"andamento"|"proximos30"`, `FiltroEtapas { situacoes; soMinhas; mostrarConcluidas; responsaveis; fases; etiquetas }`, `FILTRO_VAZIO`, `Eu { login; nome? }`, `chaveResponsavel(r): string` (`login:<login>` ou `nome:<sem acento>`), `ehMinha(e, eu)`, `criteriosAtivos(f): number`, `filtrarEtapas(etapas, f, hoje, eu)`, `contarChips(etapas, hoje): Record<ChipSituacao, number>`.

- [ ] **Step 1: Escrever as provas**

`projetos/tests/verificar-filtro.ts`:

```ts
import { SEM_FASE } from "../src/modelo/constantes";
import { chaveResponsavel, contarChips, criteriosAtivos, ehMinha, FILTRO_VAZIO, filtrarEtapas } from "../src/modelo/filtro";
import { etapa, HOJE } from "./fabrica";
import { checar, secao } from "./util";

export function verificarFiltro(): void {
  secao("projetos: filtro das etapas");
  const eu = { login: "ana", nome: "Ana Lima" };
  const lista = [
    etapa({
      id: "atr",
      inicio: "2026-09-01",
      fim: "2026-10-02",
      responsavel: { login: "ANA", nome: "Ana Lima" },
      fase: "f1",
      etiquetas: ["Licitação"],
    }),
    etapa({ id: "and", inicio: "2026-10-01", fim: "2026-10-20", responsavel: { nome: "Bruno Reis" }, fase: "f1" }),
    etapa({ id: "fut", inicio: "2026-12-01", fim: "2026-12-20", responsavel: { nome: "ana lima" }, fase: "f2", etiquetas: ["TI"] }),
    etapa({ id: "ok", inicio: "2026-09-01", fim: "2026-09-10", concluidaEm: "2026-09-10" }),
    etapa({ id: "rem", inicio: "2026-09-01", fim: "2026-09-10", removidoEm: 3 }),
  ];
  const ids = (f: typeof FILTRO_VAZIO) =>
    filtrarEtapas(lista, f, HOJE, eu)
      .map((e) => e.id)
      .join();
  checar("sem filtro: todas as vivas", ids(FILTRO_VAZIO) === "atr,and,fut,ok");
  checar("chips: OU entre situacoes", ids({ ...FILTRO_VAZIO, situacoes: ["atrasadas", "andamento"] }) === "atr,and");
  checar("ocultar concluidas", ids({ ...FILTRO_VAZIO, mostrarConcluidas: false }) === "atr,and,fut");
  checar("so as minhas: login sem caixa ou nome sem acento", ids({ ...FILTRO_VAZIO, soMinhas: true }) === "atr,fut");
  checar("fase: OU dentro do campo", ids({ ...FILTRO_VAZIO, fases: ["f2", SEM_FASE] }) === "fut,ok");
  checar("etiqueta sem acento e sem caixa", ids({ ...FILTRO_VAZIO, etiquetas: ["licitacao"] }) === "atr");
  checar(
    "E entre campos: fase f1 e responsavel Bruno",
    ids({ ...FILTRO_VAZIO, fases: ["f1"], responsaveis: [chaveResponsavel({ nome: "Bruno Reis" })] }) === "and",
  );
  checar("E entre chip e campo: atrasadas na fase f2 = nenhuma", ids({ ...FILTRO_VAZIO, situacoes: ["atrasadas"], fases: ["f2"] }) === "");
  checar("chave do responsavel por login", chaveResponsavel({ login: "ANA", nome: "x" }) === "login:ana");
  checar("chave do responsavel por nome", chaveResponsavel({ nome: "Álvaro  Souza" }) === "nome:alvaro souza");
  checar("ehMinha sem responsavel", !ehMinha({}, eu));
  checar(
    "criterios ativos",
    criteriosAtivos({ ...FILTRO_VAZIO, situacoes: ["atrasadas", "andamento"], mostrarConcluidas: false, fases: ["f1", "f2"] }) === 4,
  );
  checar("filtro vazio tem 0 criterios", criteriosAtivos(FILTRO_VAZIO) === 0);
  const n = contarChips(lista, HOJE);
  checar("numeros dos chips", n.atrasadas === 1 && n.andamento === 1 && n.proximos30 === 1, n);
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarFiltro } from "./verificar-filtro";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/filtro' imported from …/projetos/tests/verificar-filtro.ts`.

- [ ] **Step 3: Implementar**

Semântica (spec 3.1, como nos Favoritos): chips de situação valem qualquer um; "Só as minhas" e "Concluídas" restringem; dentro de um campo vale qualquer valor; entre campos, todos. Etiquetas e nomes comparados sem acento e sem caixa.

`projetos/src/modelo/filtro.ts`:

```ts
/**
 * Filtro das etapas (spec 3.1, como nos Favoritos): os chips de situação valem
 * qualquer um (Atrasadas ou Em andamento ou Próximos 30 dias); "Só as minhas"
 * e "Concluídas" (mostrar/ocultar) restringem; nos campos (responsável, fase,
 * etiqueta) vale qualquer valor dentro do campo, e os campos se somam (E).
 */

import { normalizarTexto } from "@comum/texto";
import { alertasDasEtapas } from "./alertas";
import { SEM_FASE } from "./constantes";
import { situacaoEtapa } from "./situacao";
import type { DataISO, Etapa, Responsavel } from "./tipos";

export type ChipSituacao = "atrasadas" | "andamento" | "proximos30";

export interface FiltroEtapas {
  situacoes: ChipSituacao[];
  soMinhas: boolean;
  mostrarConcluidas: boolean;
  /** Chaves de `chaveResponsavel`. */
  responsaveis: string[];
  /** Ids de fase; `SEM_FASE` = as sem fase. */
  fases: string[];
  /** Etiquetas como digitadas (comparadas sem acento e sem caixa). */
  etiquetas: string[];
}

export const FILTRO_VAZIO: FiltroEtapas = {
  situacoes: [],
  soMinhas: false,
  mostrarConcluidas: true,
  responsaveis: [],
  fases: [],
  etiquetas: [],
};

export interface Eu {
  login: string;
  nome?: string;
}

/** Mesma pessoa = mesmo login; sem login, mesmo nome (sem acento e sem caixa). */
export function chaveResponsavel(r: Responsavel): string {
  return r.login ? `login:${r.login.trim().toLowerCase()}` : `nome:${normalizarTexto(r.nome)}`;
}

export function ehMinha(e: Pick<Etapa, "responsavel">, eu: Eu): boolean {
  const r = e.responsavel;
  if (!r) return false;
  if (r.login) return r.login.trim().toLowerCase() === eu.login.trim().toLowerCase();
  return !!eu.nome && normalizarTexto(r.nome) === normalizarTexto(eu.nome);
}

/** Quantos critérios estão ligados (o botão "Filtro" mostra o número). */
export function criteriosAtivos(f: FiltroEtapas): number {
  return (
    f.situacoes.length +
    (f.soMinhas ? 1 : 0) +
    (f.mostrarConcluidas ? 0 : 1) +
    (f.responsaveis.length ? 1 : 0) +
    (f.fases.length ? 1 : 0) +
    (f.etiquetas.length ? 1 : 0)
  );
}

export function filtrarEtapas<T extends Etapa>(etapas: readonly T[], f: FiltroEtapas, hoje: DataISO, eu: Eu): T[] {
  const vivas = etapas.filter((e) => e.removidoEm === undefined);
  const alertas = alertasDasEtapas(vivas, hoje);
  const porChip: Record<ChipSituacao, Set<string>> = {
    atrasadas: new Set(alertas.atrasadas.map((e) => e.id)),
    andamento: new Set(vivas.filter((e) => situacaoEtapa(e, hoje) === "andamento").map((e) => e.id)),
    proximos30: new Set(alertas.proximos30.map((e) => e.id)),
  };
  const etiquetas = new Set(f.etiquetas.map(normalizarTexto));
  return vivas.filter((e) => {
    if (!f.mostrarConcluidas && e.concluidaEm) return false;
    if (f.soMinhas && !ehMinha(e, eu)) return false;
    if (f.situacoes.length && !f.situacoes.some((s) => porChip[s].has(e.id))) return false;
    if (f.responsaveis.length && !(e.responsavel && f.responsaveis.includes(chaveResponsavel(e.responsavel)))) return false;
    if (f.fases.length && !f.fases.includes(e.fase ?? SEM_FASE)) return false;
    if (etiquetas.size && !e.etiquetas.some((x) => etiquetas.has(normalizarTexto(x)))) return false;
    return true;
  });
}

/** Números dos chips ("Atrasadas · N"), sobre todas as etapas vivas. */
export function contarChips(etapas: readonly Etapa[], hoje: DataISO): Record<ChipSituacao, number> {
  const vivas = etapas.filter((e) => e.removidoEm === undefined);
  const alertas = alertasDasEtapas(vivas, hoje);
  return {
    atrasadas: alertas.atrasadas.length,
    andamento: vivas.filter((e) => situacaoEtapa(e, hoje) === "andamento").length,
    proximos30: alertas.proximos30.length,
  };
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/filtro";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `188 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelo/filtro.ts \
  projetos/tests/verificar-filtro.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: filtro das etapas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 7: Repositório por escopo — projetos, fases, etapas e histórico

**Files:**
- Create: `projetos/src/repositorio.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/apoioRepositorio.ts`, `projetos/tests/verificar-repositorio.ts`

**Interfaces:**
- Consumes: `@comum/armazenamento/area` (`Area`, `areaMemoria`), `@comum/armazenamento/colecao` (`Colecao`, `obterPorPrefixo`), `@comum/id` (`novoId`), `@comum/ordem/indice` (`indiceEntre`, `indiceValido`), `@comum/texto`; Tarefas 1–5 (`LIMITES`, `baseDoEscopo`, `prefixoDe`, `chaveMeta`, `rotuloDaVis`, `validarDependencias`, `violacoesDeDatas`, `aplicarDatas`, `baseInicial`, `redefinirBase`, `replanejada`, operações, histórico, validação).
- Produces: `Dados { projetos; fases; etapas; modelos }`, `MudancasProjeto = Partial<Pick<Projeto,"nome"|"processo"|"etiquetas">>`, `MudancasEtapa` (nome, inicio, fim, marco, fase, dependeDe, responsavel, medida, progresso, checklist, processo, documento, etiquetas, observacoes — `undefined` apaga), `class RepositorioProjetos(area, escopo, carimbo: () => Carimbo, gerarId = novoId)` com coleções públicas `projetos`, `fases`, `etapas`, `registros`, `modelos` e os métodos `registrar`, `entidades(): Promise<Entidades>`, `dados(): Promise<Dados>`, `historico(projeto?)`, `obterProjeto`, `criarProjeto`, `editarProjeto`, `arquivarProjeto`, `reativarProjeto`, `removerProjeto`, `restaurarProjeto`, `duplicarProjeto`, `criarFase`, `renomearFase`, `removerFase`, `obterEtapa`, `criarEtapa`, `editarEtapa(id, m, hoje)`, `moverDatas(mudancas, hoje)`, `concluirEtapa(id, hoje, documento?)`, `reabrirEtapa`, `removerEtapa`, `restaurarEtapa`, `redefinirPlanoOriginal(projeto): Promise<number>`, `aoMudar(cb): () => void`. Regra violada → `throw new ErroValidacao([...])` sem gravar nada. Nos testes: `ESCOPO_UN`, `ESCOPO_EU`, `novoRepo(escopo?, area?, prefixoId?, relogio?)`.

- [ ] **Step 1: Escrever as provas**

Repositório de teste com relógio que anda 1 ms por gravação (dois repositórios podem dividir o mesmo relógio, como o `Date.now()` de um navegador) e ids previsíveis:

`projetos/tests/apoioRepositorio.ts`:

```ts
/** Repositório de teste: área em memória, relógio que anda 1 ms por gravação e ids previsíveis. */

import { type Area, areaMemoria } from "@comum/armazenamento/area";
import type { Escopo } from "../src/modelo/tipos";
import { RepositorioProjetos } from "../src/repositorio";

export const ESCOPO_UN: Escopo = { host: "sei.x.gov.br", login: "ana", unidade: "110", vis: "unidade" };
export const ESCOPO_EU: Escopo = { ...ESCOPO_UN, vis: "eu" };

/** Relógio que dois repositórios podem compartilhar (como o Date.now() de um navegador). */
export interface Relogio {
  agora: number;
}

export function novoRepo(escopo: Escopo = ESCOPO_UN, area: Area = areaMemoria(), prefixoId = "id", relogio: Relogio = { agora: 1_000 }) {
  let n = 0;
  const repo = new RepositorioProjetos(
    area,
    escopo,
    () => ({ agora: ++relogio.agora, dispositivo: "dev-a", por: escopo.login, nome: "Ana Lima" }),
    () => `${prefixoId}${++n}`,
  );
  return { repo, area, relogio: () => relogio.agora };
}
```

`projetos/tests/verificar-repositorio.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { LIMITES } from "../src/modelo/constantes";
import { ErroValidacao } from "../src/modelo/validacao";
import { ESCOPO_EU, novoRepo } from "./apoioRepositorio";
import { HOJE } from "./fabrica";
import { checar, lanca, secao } from "./util";

const mensagens = (e: unknown) => (e instanceof ErroValidacao ? e.mensagens.join(" | ") : String(e));

export async function verificarRepositorio(): Promise<void> {
  secao("projetos: repositorio - projetos");
  const { repo, area } = novoRepo();
  const p = await repo.criarProjeto({ nome: "  Revisão da Resolução  ", etiquetas: ["Normativo"] });
  checar("chave por escopo e tipo", Object.keys(await area.obter(null)).includes(`projetos/sei.x.gov.br|ana|u:110/un/p/${p.id}`));
  checar("nome limpo e alteradoPor", p.nome === "Revisão da Resolução" && p.alteradoPor === "ana");
  const erroNome = await lanca(() => repo.criarProjeto({ nome: " " }));
  checar("projeto sem nome e recusado", mensagens(erroNome) === "Informe o nome do projeto.");
  const ed = await repo.editarProjeto(p.id, { nome: "Revisão 5.432", processo: { protocolo: "50300.001234/2026-11" } });
  checar("editar projeto", ed.nome === "Revisão 5.432" && ed.processo?.protocolo === "50300.001234/2026-11");
  checar("arquivar", (await repo.arquivarProjeto(p.id)).arquivadoEm !== undefined);
  checar("reativar", (await repo.reativarProjeto(p.id)).arquivadoEm === undefined);

  secao("projetos: repositorio - fases e etapas");
  const f1 = await repo.criarFase(p.id, "Instrução");
  checar("criarFase reusa a de mesmo nome (sem acento/caixa)", (await repo.criarFase(p.id, " instrucao ")).id === f1.id);
  const e1 = await repo.criarEtapa({ projeto: p.id, nome: "Nota técnica", inicio: "2026-10-07", fim: "2026-10-09", fase: f1.id });
  const e2 = await repo.criarEtapa({ projeto: p.id, nome: "Análise", inicio: "2026-10-13", fim: "2026-10-16", dependeDe: [e1.id] });
  checar("etapas ganham ordem crescente", e1.ordem < e2.ordem);
  checar("base nasce com as datas", e1.base?.inicio === "2026-10-07" && e1.base?.fim === "2026-10-09");
  const erroCiclo = await lanca(() => repo.editarEtapa(e1.id, { dependeDe: [e2.id] }, HOJE));
  checar(
    "ciclo recusado com os nomes",
    mensagens(erroCiclo) === "Dependência circular: “Nota técnica” → “Análise” → “Nota técnica”.",
    mensagens(erroCiclo),
  );
  const erroDatas = await lanca(() => repo.editarEtapa(e1.id, { fim: "2026-10-01" }, HOJE));
  checar("termino antes do inicio recusado", mensagens(erroDatas) === "O término não pode ser antes do início.");
  const erroFase = await lanca(() => repo.criarEtapa({ projeto: p.id, nome: "x", inicio: HOJE, fim: HOJE, fase: "nao-existe" }));
  checar("fase inexistente recusada", mensagens(erroFase) === "A fase escolhida não existe mais.");
  const planejada = await repo.editarEtapa(e1.id, { inicio: "2026-10-08", fim: "2026-10-14" }, HOJE);
  checar("em planejamento a base anda junto", planejada.base?.inicio === "2026-10-08" && planejada.base?.fim === "2026-10-14");
  const comResp = await repo.editarEtapa(e1.id, { responsavel: { nome: "Carla Dias" }, observacoes: "obs" }, HOJE);
  checar("responsavel gravado", comResp.responsavel?.nome === "Carla Dias");
  const semResp = await repo.editarEtapa(e1.id, { responsavel: undefined, observacoes: "  " }, HOJE);
  checar("responsavel: undefined apaga; observacao em branco some", !("responsavel" in semResp) && !("observacoes" in semResp));
  const marco = await repo.editarEtapa(e2.id, { marco: true }, HOJE);
  checar("virar marco iguala o termino ao inicio", marco.fim === marco.inicio && marco.marco);
  const andando = await repo.editarEtapa(e1.id, { inicio: "2026-10-01", fim: "2026-10-14" }, "2026-10-07");
  const replan = await repo.editarEtapa(e1.id, { fim: "2026-10-21" }, "2026-10-07");
  checar(
    "depois de comecar a base congela",
    andando.base?.fim === "2026-10-14" && replan.base?.fim === "2026-10-14" && replan.fim === "2026-10-21",
  );
  checar(
    "redefinir plano original",
    (await repo.redefinirPlanoOriginal(p.id)) === 1 && (await repo.obterEtapa(e1.id))?.base?.fim === "2026-10-21",
  );

  secao("projetos: repositorio - concluir, arrastar, remover");
  const conc = await repo.concluirEtapa(e1.id, HOJE, { numero: "1234567" });
  checar("concluir com data de hoje e documento", conc.concluidaEm === HOJE && conc.documento?.numero === "1234567");
  checar("reabrir", (await repo.reabrirEtapa(e1.id)).concluidaEm === undefined);
  const e3 = await repo.criarEtapa({ projeto: p.id, nome: "Minuta", inicio: "2026-11-02", fim: "2026-11-06", dependeDe: [e1.id] });
  const movidas = await repo.moverDatas([{ id: e3.id, inicio: "2026-11-09", fim: "2026-11-13" }], HOJE);
  checar("moverDatas grava e leva a base (planejamento)", movidas[0]?.inicio === "2026-11-09" && movidas[0]?.base?.inicio === "2026-11-09");
  const erroArraste = await lanca(() => repo.moverDatas([{ id: e3.id, inicio: "2026-09-01", fim: "2026-09-05" }], HOJE));
  checar("arraste para antes da dependencia recusado", mensagens(erroArraste).includes("não pode começar antes de “Nota técnica”"));
  checar("arraste recusado nao gravou", (await repo.obterEtapa(e3.id))?.inicio === "2026-11-09");
  const marcoArr = await repo.moverDatas([{ id: e2.id, inicio: "2026-10-20", fim: "2026-10-22" }], HOJE);
  checar("arrastar marco mantem uma data so", marcoArr[0]?.fim === "2026-10-20");
  await repo.removerEtapa(e3.id);
  checar("remover etapa grava lapide (sai dos dados)", !(await repo.dados()).etapas.some((e) => e.id === e3.id));
  checar("restaurar etapa", (await repo.restaurarEtapa(e3.id))?.removidoEm === undefined);
  await repo.removerFase(f1.id);
  checar("remover fase deixa a etapa sem fase", (await repo.obterEtapa(e1.id))?.fase === undefined);
  await repo.removerProjeto(p.id);
  const d0 = await repo.dados();
  checar("remover projeto leva fases e etapas", !d0.projetos.length && !d0.etapas.length);
  await repo.restaurarProjeto(p.id);
  const d1 = await repo.dados();
  checar("desfazer devolve projeto e etapas removidas junto", d1.projetos.length === 1 && d1.etapas.length === 3, d1.etapas.length);
  checar("etapa removida antes nao volta junto", (await repo.etapas.obter(e3.id))?.removidoEm === undefined);

  secao("projetos: repositorio - duplicar e historico");
  const dup = await repo.duplicarProjeto(p.id);
  const dd = await repo.dados();
  const copias = dd.etapas.filter((e) => e.projeto === dup.id);
  checar("duplicar: nome e quantidade de etapas", dup.nome === "Cópia de Revisão 5.432" && copias.length === 3);
  const minuta = copias.find((e) => e.nome === "Minuta");
  const nota = copias.find((e) => e.nome === "Nota técnica");
  checar("duplicar remapeia dependencias", !!nota && minuta?.dependeDe.join() === nota.id);
  checar(
    "duplicar recomeca a execucao",
    copias.every((e) => !e.concluidaEm && !e.documento),
  );
  const hist = await repo.historico(p.id);
  checar("historico do projeto em ordem decrescente", hist.length > 5 && hist[0]!.quando >= hist[hist.length - 1]!.quando);
  checar(
    "historico tem por e nome",
    hist.every((r) => r.por === "ana" && r.nome === "Ana Lima"),
  );
  checar(
    "historico registra a conclusao",
    hist.some((r) => r.campo === "conclusao" && r.depois === HOJE),
  );

  secao("projetos: repositorio - limites");
  const { repo: cheio } = novoRepo(ESCOPO_EU, areaMemoria());
  for (let i = 0; i < LIMITES.projetosAtivos; i++) await cheio.criarProjeto({ nome: `P${i}` });
  const erroLimite = await lanca(() => cheio.criarProjeto({ nome: "mais um" }));
  checar("101o projeto ativo recusado", mensagens(erroLimite) === "Limite de 100 projetos ativos em “Só eu”. Arquive ou exclua algum.");
  const primeiro = (await cheio.dados()).projetos[0]!;
  await cheio.arquivarProjeto(primeiro.id);
  checar("arquivado libera vaga", (await cheio.criarProjeto({ nome: "agora cabe" })).nome === "agora cabe");
  checar("reativar sem vaga e recusado", mensagens(await lanca(() => cheio.reativarProjeto(primeiro.id))).startsWith("Limite de 100"));
  const { repo: r2 } = novoRepo();
  const pp = await r2.criarProjeto({ nome: "Grande" });
  for (let i = 0; i < LIMITES.etapasPorProjeto; i++)
    await r2.etapas.gravar(`x${i}`, {
      id: `x${i}`,
      projeto: pp.id,
      ordem: "a0",
      nome: "x",
      inicio: HOJE,
      fim: HOJE,
      marco: false,
      dependeDe: [],
      medida: "manual",
      progresso: 0,
      checklist: [],
      etiquetas: [],
      criadoEm: 1,
      atualizadoEm: 1,
      dispositivo: "d",
    });
  checar(
    "301a etapa recusada",
    mensagens(await lanca(() => r2.criarEtapa({ projeto: pp.id, nome: "y", inicio: HOJE, fim: HOJE }))) ===
      "Um projeto pode ter até 300 etapas.",
  );
  const { repo: r3 } = novoRepo();
  const p3 = await r3.criarProjeto({ nome: "Hist" });
  for (let i = 0; i < 310; i++) await r3.editarProjeto(p3.id, { nome: `Hist ${i}` });
  checar("historico podado em 300 registros", (await r3.historico()).length === LIMITES.historico);
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarFiltro } from "./verificar-filtro";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/repositorio' imported from …/projetos/tests/apoioRepositorio.ts`.

- [ ] **Step 3: Implementar o repositório (parte 1)**

Molde: `favoritos/src/repositorio.ts` (uma chave por entidade; `maiorOrdem` ignora chave de ordem inválida). Cada gravação: carimbo → valida → grava → registra no histórico (`anotar`, que poda em 300). As Tarefas 8 e 9 acrescentam seções a este arquivo.

`projetos/src/repositorio.ts`:

```ts
/**
 * Projetos de UM escopo (host + login + unidade + "unidade"/"eu") no
 * `chrome.storage.local`, uma chave por entidade (molde:
 * `favoritos/src/repositorio.ts`). Remover grava lápide; toda gravação leva o
 * carimbo (quando, dispositivo, quem) e gera os registros do histórico.
 */

import type { Area } from "@comum/armazenamento/area";
import { Colecao, obterPorPrefixo } from "@comum/armazenamento/colecao";
import { novoId } from "@comum/id";
import { indiceEntre, indiceValido } from "@comum/ordem/indice";
import { normalizarTexto } from "@comum/texto";
import { LIMITES } from "./modelo/constantes";
import { validarDependencias, violacoesDeDatas } from "./modelo/dependencias";
import { baseDoEscopo, chaveMeta, prefixoDe, rotuloDaVis } from "./modelo/escopo";
import {
  type ApoioHistorico,
  carimbarRegistros,
  excedentes,
  type RegistroNovo,
  registrosDeEtapa,
  registrosDeFase,
  registrosDeProjeto,
} from "./modelo/historico";
import { aplicarDatas, baseInicial, redefinirBase, replanejada } from "./modelo/linhaDeBase";
import {
  concluir,
  type DadosNovaEtapa,
  type DadosNovoProjeto,
  editar,
  novaEtapa,
  novaFase,
  novoProjeto,
  porOrdem,
  reabrir,
  remover,
  restaurar,
  semVazios,
} from "./modelo/operacoes";
import type {
  Carimbo,
  DataISO,
  DocumentoSei,
  Entidade,
  Entidades,
  Escopo,
  Etapa,
  Fase,
  Modelo,
  MudancaDeDatas,
  Projeto,
  Registro,
} from "./modelo/tipos";
import { checklistLimpo, ErroValidacao, etiquetasLimpas, nomeLimpo, problemasDaEtapa, problemasDoProjeto } from "./modelo/validacao";

/** O que está vivo no escopo (sem lápides), numa leitura só. */
export interface Dados {
  projetos: Projeto[];
  fases: Fase[];
  etapas: Etapa[];
  modelos: Modelo[];
}

export type MudancasProjeto = Partial<Pick<Projeto, "nome" | "processo" | "etiquetas">>;
export type MudancasEtapa = Partial<
  Pick<
    Etapa,
    | "nome"
    | "inicio"
    | "fim"
    | "marco"
    | "fase"
    | "dependeDe"
    | "responsavel"
    | "medida"
    | "progresso"
    | "checklist"
    | "processo"
    | "documento"
    | "etiquetas"
    | "observacoes"
  >
>;

// Chave inválida (dado antigo ou editado à mão) não entra na conta: senão nada novo grava.
const maiorOrdem = (itens: ReadonlyArray<{ ordem: string }>): string | null =>
  itens.reduce<string | null>((m, i) => (indiceValido(i.ordem) && (m === null || i.ordem > m) ? i.ordem : m), null);

const vivo = <T extends { removidoEm?: number }>(x: T | undefined): x is T => !!x && x.removidoEm === undefined;

export class RepositorioProjetos {
  readonly projetos: Colecao<Projeto>;
  readonly fases: Colecao<Fase>;
  readonly etapas: Colecao<Etapa>;
  readonly registros: Colecao<Registro>;
  readonly modelos: Colecao<Modelo>;
  private readonly base: string;

  constructor(
    private readonly area: Area,
    readonly escopo: Escopo,
    private readonly carimbo: () => Carimbo,
    private readonly gerarId: () => string = novoId,
  ) {
    this.base = baseDoEscopo(escopo);
    this.projetos = new Colecao<Projeto>(area, prefixoDe(escopo, "p"));
    this.fases = new Colecao<Fase>(area, prefixoDe(escopo, "f"));
    this.etapas = new Colecao<Etapa>(area, prefixoDe(escopo, "e"));
    this.registros = new Colecao<Registro>(area, prefixoDe(escopo, "h"));
    this.modelos = new Colecao<Modelo>(area, prefixoDe(escopo, "m"));
  }

  /** Guarda o escopo por extenso (a exportação e o arquivo usam). */
  async registrar(): Promise<void> {
    await this.area.gravar({ [chaveMeta(this.escopo)]: { escopo: this.escopo } });
  }

  /** Tudo do escopo, com lápides, numa leitura só (sincronia, arquivo). */
  async entidades(): Promise<Entidades> {
    const tudo = Object.entries(await obterPorPrefixo(this.area, this.base));
    const de = <T>(t: string) => tudo.filter(([k]) => k.startsWith(`${this.base}${t}/`)).map(([, v]) => v as T);
    return { p: de<Projeto>("p"), f: de<Fase>("f"), e: de<Etapa>("e"), h: de<Registro>("h"), m: de<Modelo>("m") };
  }

  /** O que está vivo: projetos, fases e etapas na ordem manual; modelos pelo nome. */
  async dados(): Promise<Dados> {
    const t = await this.entidades();
    return {
      projetos: t.p.filter(vivo).sort(porOrdem),
      fases: t.f.filter(vivo).sort(porOrdem),
      etapas: t.e.filter(vivo).sort(porOrdem),
      modelos: t.m.filter(vivo).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    };
  }

  // ---------- histórico ----------

  /** Registros vivos, do mais recente ao mais antigo (de um projeto, se informado). */
  async historico(projeto?: string): Promise<Registro[]> {
    return (await this.registros.listar())
      .filter((r) => vivo(r) && (!projeto || r.projeto === projeto))
      .sort((a, b) => b.quando - a.quando || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  }

  private async anotar(novos: RegistroNovo[], c: Carimbo): Promise<void> {
    if (!novos.length) return;
    const regs = carimbarRegistros(novos, c, this.gerarId);
    await this.registros.gravarVarios(regs.map((r) => [r.id, r]));
    const sobra = excedentes(await this.registros.listar(), LIMITES.historico);
    await this.registros.apagar(sobra);
  }

  private async apoio(projeto: string): Promise<ApoioHistorico> {
    const [fases, etapas] = await Promise.all([this.fases.listar(), this.etapas.listar()]);
    const nf = new Map(fases.filter((f) => f.projeto === projeto).map((f) => [f.id, f.nome]));
    const ne = new Map(etapas.filter((e) => e.projeto === projeto).map((e) => [e.id, e.nome]));
    return { nomeDaFase: (id) => nf.get(id), nomeDaEtapa: (id) => ne.get(id) };
  }

  // ---------- projetos ----------

  private async exigirVagaDeProjeto(): Promise<void> {
    const ativos = (await this.projetos.listar()).filter((p) => vivo(p) && p.arquivadoEm === undefined);
    if (ativos.length >= LIMITES.projetosAtivos)
      throw new ErroValidacao([
        `Limite de ${LIMITES.projetosAtivos} projetos ativos em “${rotuloDaVis(this.escopo.vis)}”. Arquive ou exclua algum.`,
      ]);
  }

  async obterProjeto(id: string): Promise<Projeto | undefined> {
    const p = await this.projetos.obter(id);
    return vivo(p) ? p : undefined;
  }

  private async exigirProjeto(id: string): Promise<Projeto> {
    const p = await this.obterProjeto(id);
    if (!p) throw new ErroValidacao(["O projeto não existe mais."]);
    return p;
  }

  async criarProjeto(d: DadosNovoProjeto): Promise<Projeto> {
    await this.exigirVagaDeProjeto();
    const c = this.carimbo();
    const p = novoProjeto(d, this.gerarId(), indiceEntre(maiorOrdem(await this.projetos.listar()), null), c);
    const problemas = problemasDoProjeto(p);
    if (problemas.length) throw new ErroValidacao(problemas);
    await this.projetos.gravar(p.id, p);
    await this.anotar(registrosDeProjeto(undefined, p), c);
    return p;
  }

  async editarProjeto(id: string, m: MudancasProjeto): Promise<Projeto> {
    const atual = await this.exigirProjeto(id);
    const mud: MudancasProjeto = { ...m };
    if (typeof mud.nome === "string") mud.nome = nomeLimpo(mud.nome);
    if (mud.etiquetas) mud.etiquetas = etiquetasLimpas(mud.etiquetas);
    const problemas = problemasDoProjeto({ ...atual, ...mud });
    if (problemas.length) throw new ErroValidacao(problemas);
    const c = this.carimbo();
    const p = editar(atual, mud, c);
    await this.projetos.gravar(id, p);
    await this.anotar(registrosDeProjeto(atual, p), c);
    return p;
  }

  async arquivarProjeto(id: string): Promise<Projeto> {
    const atual = await this.exigirProjeto(id);
    if (atual.arquivadoEm !== undefined) return atual;
    const c = this.carimbo();
    const p = editar(atual, { arquivadoEm: c.agora }, c);
    await this.projetos.gravar(id, p);
    await this.anotar(registrosDeProjeto(atual, p), c);
    return p;
  }

  async reativarProjeto(id: string): Promise<Projeto> {
    const atual = await this.exigirProjeto(id);
    if (atual.arquivadoEm === undefined) return atual;
    await this.exigirVagaDeProjeto();
    const c = this.carimbo();
    const p = editar(atual, { arquivadoEm: undefined }, c);
    await this.projetos.gravar(id, p);
    await this.anotar(registrosDeProjeto(atual, p), c);
    return p;
  }

  /** Lápide no projeto, nas fases e nas etapas vivas dele, com o MESMO instante (o "Desfazer" usa). */
  async removerProjeto(id: string): Promise<void> {
    const atual = await this.exigirProjeto(id);
    const c = this.carimbo();
    const [fases, etapas] = await Promise.all([this.fases.listar(), this.etapas.listar()]);
    await this.fases.gravarVarios(fases.filter((f) => vivo(f) && f.projeto === id).map((f) => [f.id, remover(f, c)]));
    await this.etapas.gravarVarios(etapas.filter((e) => vivo(e) && e.projeto === id).map((e) => [e.id, remover(e, c)]));
    const p = remover(atual, c);
    await this.projetos.gravar(id, p);
    await this.anotar(registrosDeProjeto(atual, p), c);
  }

  /** Desfaz `removerProjeto`: volta o projeto e o que foi removido junto com ele. */
  async restaurarProjeto(id: string): Promise<Projeto | undefined> {
    const atual = await this.projetos.obter(id);
    if (!atual || atual.removidoEm === undefined) return atual;
    const quando = atual.removidoEm;
    const c = this.carimbo();
    const [fases, etapas] = await Promise.all([this.fases.listar(), this.etapas.listar()]);
    await this.fases.gravarVarios(fases.filter((f) => f.projeto === id && f.removidoEm === quando).map((f) => [f.id, restaurar(f, c)]));
    await this.etapas.gravarVarios(etapas.filter((e) => e.projeto === id && e.removidoEm === quando).map((e) => [e.id, restaurar(e, c)]));
    const p = restaurar(atual, c);
    await this.projetos.gravar(id, p);
    await this.anotar(registrosDeProjeto(atual, p), c);
    return p;
  }

  /**
   * Cópia com ids novos ("Cópia de ..."): mesmas fases, etapas e dependências; a
   * execução recomeça (sem conclusão, progresso manual 0, checklist desmarcado,
   * sem documento, base = datas).
   */
  async duplicarProjeto(id: string): Promise<Projeto> {
    const origem = await this.exigirProjeto(id);
    await this.exigirVagaDeProjeto();
    const c = this.carimbo();
    const { fases, etapas } = await this.dados();
    const p = novoProjeto(
      { nome: `Cópia de ${origem.nome}`.slice(0, LIMITES.nome), processo: origem.processo, etiquetas: origem.etiquetas },
      this.gerarId(),
      indiceEntre(maiorOrdem(await this.projetos.listar()), null),
      c,
    );
    const novasFases = new Map<string, Fase>();
    for (const f of fases.filter((x) => x.projeto === id)) novasFases.set(f.id, novaFase(p.id, f.nome, this.gerarId(), f.ordem, c));
    const doProjeto = etapas.filter((e) => e.projeto === id);
    const novosIds = new Map(doProjeto.map((e) => [e.id, this.gerarId()]));
    const novas = doProjeto.map((e) =>
      novaEtapa(
        {
          projeto: p.id,
          nome: e.nome,
          inicio: e.inicio,
          fim: e.fim,
          fase: e.fase ? novasFases.get(e.fase)?.id : undefined,
          marco: e.marco,
          dependeDe: e.dependeDe.map((d) => novosIds.get(d)).filter((d): d is string => !!d),
          responsavel: e.responsavel,
          medida: e.medida,
          checklist: e.checklist.map((i) => ({ ...i, id: this.gerarId(), feito: false })),
          processo: e.processo,
          etiquetas: e.etiquetas,
          observacoes: e.observacoes,
        },
        novosIds.get(e.id)!,
        e.ordem,
        c,
      ),
    );
    await this.projetos.gravar(p.id, p);
    await this.fases.gravarVarios([...novasFases.values()].map((f) => [f.id, f]));
    await this.etapas.gravarVarios(novas.map((e) => [e.id, e]));
    await this.anotar(registrosDeProjeto(undefined, p), c);
    return p;
  }

  // ---------- fases ----------

  /** "Combo que cria": se já existe fase viva com o mesmo nome (sem acento e sem caixa), devolve ela. */
  async criarFase(projeto: string, nome: string): Promise<Fase> {
    await this.exigirProjeto(projeto);
    const limpo = nomeLimpo(nome);
    if (!limpo) throw new ErroValidacao(["Informe o nome da fase."]);
    if (limpo.length > LIMITES.nome) throw new ErroValidacao([`O nome pode ter até ${LIMITES.nome} caracteres.`]);
    const todas = await this.fases.listar();
    const igual = todas.find((f) => vivo(f) && f.projeto === projeto && normalizarTexto(f.nome) === normalizarTexto(limpo));
    if (igual) return igual;
    const c = this.carimbo();
    const f = novaFase(projeto, limpo, this.gerarId(), indiceEntre(maiorOrdem(todas.filter((x) => x.projeto === projeto)), null), c);
    await this.fases.gravar(f.id, f);
    await this.anotar(registrosDeFase(undefined, f), c);
    return f;
  }

  async renomearFase(id: string, nome: string): Promise<Fase> {
    const atual = await this.fases.obter(id);
    if (!vivo(atual)) throw new ErroValidacao(["A fase não existe mais."]);
    const limpo = nomeLimpo(nome);
    if (!limpo) throw new ErroValidacao(["Informe o nome da fase."]);
    const c = this.carimbo();
    const f = editar(atual, { nome: limpo.slice(0, LIMITES.nome) }, c);
    await this.fases.gravar(id, f);
    await this.anotar(registrosDeFase(atual, f), c);
    return f;
  }

  /** As etapas da fase ficam sem fase (não somem). */
  async removerFase(id: string): Promise<void> {
    const atual = await this.fases.obter(id);
    if (!vivo(atual)) return;
    const c = this.carimbo();
    const afetadas = (await this.etapas.listar()).filter((e) => vivo(e) && e.fase === id);
    await this.etapas.gravarVarios(afetadas.map((e) => [e.id, editar(e, { fase: undefined }, c)]));
    const f = remover(atual, c);
    await this.fases.gravar(id, f);
    await this.anotar(registrosDeFase(atual, f), c);
  }

  // ---------- etapas ----------

  async obterEtapa(id: string): Promise<Etapa | undefined> {
    const e = await this.etapas.obter(id);
    return vivo(e) ? e : undefined;
  }

  private async etapasDoProjeto(projeto: string): Promise<Etapa[]> {
    return (await this.etapas.listar()).filter((e) => vivo(e) && e.projeto === projeto);
  }

  private async conferirEtapa(e: Etapa, doProjeto: Etapa[]): Promise<void> {
    const problemas = problemasDaEtapa(e);
    const dep = validarDependencias(e, doProjeto);
    if (dep) problemas.push(dep);
    if (e.fase) {
      const f = await this.fases.obter(e.fase);
      if (!vivo(f) || f.projeto !== e.projeto) problemas.push("A fase escolhida não existe mais.");
    }
    if (problemas.length) throw new ErroValidacao(problemas);
  }

  async criarEtapa(d: DadosNovaEtapa): Promise<Etapa> {
    await this.exigirProjeto(d.projeto);
    const doProjeto = await this.etapasDoProjeto(d.projeto);
    if (doProjeto.length >= LIMITES.etapasPorProjeto)
      throw new ErroValidacao([`Um projeto pode ter até ${LIMITES.etapasPorProjeto} etapas.`]);
    const c = this.carimbo();
    const e = novaEtapa(d, this.gerarId(), indiceEntre(maiorOrdem(doProjeto), null), c);
    await this.conferirEtapa(e, doProjeto);
    await this.etapas.gravar(e.id, e);
    await this.anotar(registrosDeEtapa(undefined, e), c);
    return e;
  }

  async editarEtapa(id: string, m: MudancasEtapa, hoje: DataISO): Promise<Etapa> {
    const atual = await this.obterEtapa(id);
    if (!atual) throw new ErroValidacao(["A etapa não existe mais."]);
    const mud: MudancasEtapa = { ...m };
    if (typeof mud.nome === "string") mud.nome = nomeLimpo(mud.nome);
    if (mud.etiquetas) mud.etiquetas = etiquetasLimpas(mud.etiquetas);
    if (mud.checklist) mud.checklist = checklistLimpo(mud.checklist);
    if (mud.dependeDe) mud.dependeDe = [...new Set(mud.dependeDe)];
    if (typeof mud.progresso === "number") mud.progresso = Math.round(mud.progresso);
    if (typeof mud.observacoes === "string" && !mud.observacoes.trim()) mud.observacoes = undefined;
    const marco = mud.marco ?? atual.marco;
    const inicio = mud.inicio ?? atual.inicio;
    const fim = marco ? inicio : (mud.fim ?? atual.fim);
    const datas = inicio !== atual.inicio || fim !== atual.fim ? aplicarDatas(atual, inicio, fim, hoje) : { inicio, fim, base: atual.base };
    const final: MudancasEtapa & Pick<Etapa, "base"> = { ...mud, ...datas, marco };
    const doProjeto = await this.etapasDoProjeto(atual.projeto);
    await this.conferirEtapa(semVazios({ ...atual, ...final }), doProjeto);
    const c = this.carimbo();
    const e = editar(atual, final, c);
    await this.etapas.gravar(id, e);
    await this.anotar(registrosDeEtapa(atual, e, await this.apoio(atual.projeto)), c);
    return e;
  }

  /**
   * Datas de um arraste no Gantt (ou de dependentes deslocadas). Aplica a regra
   * da linha de base; recusa (sem gravar nada) se sobrar violação de datas.
   */
  async moverDatas(mudancas: readonly MudancaDeDatas[], hoje: DataISO): Promise<Etapa[]> {
    const todas = (await this.etapas.listar()).filter(vivo);
    const porId = new Map(todas.map((e) => [e.id, e]));
    const novas = new Map<string, Etapa>();
    for (const m of mudancas) {
      const atual = porId.get(m.id);
      if (!atual) continue;
      const fim = atual.marco ? m.inicio : m.fim;
      novas.set(m.id, { ...atual, ...aplicarDatas(atual, m.inicio, fim, hoje) });
    }
    if (!novas.size) return [];
    const depois = todas.map((e) => novas.get(e.id) ?? e);
    const problemas = violacoesDeDatas(depois, new Set(novas.keys()));
    if (problemas.length) throw new ErroValidacao(problemas);
    const c = this.carimbo();
    const gravadas = [...novas.values()].map((e) => editar(porId.get(e.id)!, { inicio: e.inicio, fim: e.fim, base: e.base }, c));
    await this.etapas.gravarVarios(gravadas.map((e) => [e.id, e]));
    const registros = gravadas.flatMap((e) => registrosDeEtapa(porId.get(e.id), e));
    await this.anotar(registros, c);
    return gravadas;
  }

  async concluirEtapa(id: string, hoje: DataISO, documento?: DocumentoSei): Promise<Etapa> {
    const atual = await this.obterEtapa(id);
    if (!atual) throw new ErroValidacao(["A etapa não existe mais."]);
    const c = this.carimbo();
    const e = concluir(atual, hoje, c, documento);
    await this.etapas.gravar(id, e);
    await this.anotar(registrosDeEtapa(atual, e), c);
    return e;
  }

  async reabrirEtapa(id: string): Promise<Etapa> {
    const atual = await this.obterEtapa(id);
    if (!atual) throw new ErroValidacao(["A etapa não existe mais."]);
    const c = this.carimbo();
    const e = reabrir(atual, c);
    await this.etapas.gravar(id, e);
    await this.anotar(registrosDeEtapa(atual, e), c);
    return e;
  }

  async removerEtapa(id: string): Promise<void> {
    const atual = await this.obterEtapa(id);
    if (!atual) return;
    const c = this.carimbo();
    const e = remover(atual, c);
    await this.etapas.gravar(id, e);
    await this.anotar(registrosDeEtapa(atual, e), c);
  }

  async restaurarEtapa(id: string): Promise<Etapa | undefined> {
    const atual = await this.etapas.obter(id);
    if (!atual || atual.removidoEm === undefined) return atual;
    const c = this.carimbo();
    const e = restaurar(atual, c);
    await this.etapas.gravar(id, e);
    await this.anotar(registrosDeEtapa(atual, e), c);
    return e;
  }

  /** "Redefinir plano original" (menu do projeto): a base de cada etapa replanejada passa a ser as datas atuais. */
  async redefinirPlanoOriginal(projeto: string): Promise<number> {
    const alvos = (await this.etapasDoProjeto(projeto)).filter((e) => replanejada(e) || !e.base);
    if (!alvos.length) return 0;
    const c = this.carimbo();
    const gravadas = alvos.map((e) => editar(e, { base: e.base ? redefinirBase(e) : baseInicial(e.inicio, e.fim) }, c));
    await this.etapas.gravarVarios(gravadas.map((e) => [e.id, e]));
    await this.anotar(
      gravadas.flatMap((e, i) => registrosDeEtapa(alvos[i], e)),
      c,
    );
    return gravadas.length;
  }

  aoMudar(cb: () => void): () => void {
    const parar = [this.projetos, this.fases, this.etapas, this.registros, this.modelos].map((col) =>
      (col as Colecao<Entidade>).aoMudar(cb),
    );
    return () => {
      for (const p of parar) p();
    };
  }
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/filtro";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
export * from "./repositorio";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `229 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/repositorio.ts \
  projetos/tests/apoioRepositorio.ts \
  projetos/tests/verificar-repositorio.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: repositorio por escopo (projetos, fases, etapas, historico)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 8: Envelope, mesclagem, limpeza de lápides, índice de processos e mover entre escopos

**Files:**
- Create: `projetos/src/modelo/vinculos.ts`
- Modify: `projetos/src/repositorio.ts` (imports; métodos `carimboAtual`, `anotarVisibilidade`; seção "sincronia, arquivo, limpeza"; funções no fim), `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-escopos.ts`

**Interfaces:**
- Consumes: `RepositorioProjetos` (Tarefa 7), `@comum/sincronia/entidade` (`mesclar`, `purgarLapides`, `Versionada`), `dataValida` (Tarefa 2), `DIAS_LAPIDE_UNIDADE`/`DIAS_LAPIDE_EU` (Tarefa 1), `excedentes` (Tarefa 5).
- Produces: `VinculoProcesso { vis; projeto; papel: "projeto"|"etapa"; etapas }`, `chaveProtocolo(p): string` (só dígitos), `indiceDeProcessos(escopos: Array<{ vis; projetos; etapas }>): Map<string, VinculoProcesso[]>`; no repositório: `exportar(agora?): Promise<EnvelopeProjetos>`, `importar(ent: Partial<Entidades>): Promise<{ novos; atualizados; ignorados }>`, `limpar(agora?): Promise<number>`, `vinculos(): Promise<Map<string, VinculoProcesso[]>>`, `carimboAtual(): Carimbo`, `anotarVisibilidade(p, antes, depois, c)`; funções `manterNumeroSigiloso(vencedor, local)`, `entidadeValida(x, tipo: keyof Entidades): boolean`, `indiceDosEscopos(repos)`, `moverEntreEscopos(origem, destino, id): Promise<Projeto>`.

- [ ] **Step 1: Escrever as provas**

`projetos/tests/verificar-escopos.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { chaveProtocolo, indiceDeProcessos } from "../src/modelo/vinculos";
import { entidadeValida, indiceDosEscopos, manterNumeroSigiloso, moverEntreEscopos } from "../src/repositorio";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { etapa, HOJE, projeto } from "./fabrica";
import { checar, secao } from "./util";

const DIA = 86_400_000;

export async function verificarEscopos(): Promise<void> {
  secao("projetos: exportar e importar envelope");
  const area = areaMemoria();
  const navegador = { agora: 1_000 };
  const { repo: un } = novoRepo(ESCOPO_UN, area, "u", navegador);
  const { repo: eu } = novoRepo(ESCOPO_EU, area, "e", navegador);
  const p = await un.criarProjeto({ nome: "Pregão", processo: { protocolo: "50300.004410/2026-02" } });
  const f = await un.criarFase(p.id, "Planejamento");
  const e1 = await un.criarEtapa({ projeto: p.id, nome: "ETP", inicio: "2026-10-07", fim: "2026-10-20", fase: f.id });
  const e2 = await un.criarEtapa({
    projeto: p.id,
    nome: "TR",
    inicio: "2026-10-21",
    fim: "2026-10-30",
    processo: { protocolo: "50300.009999/2026-01" },
  });
  await un.removerEtapa(e2.id);
  const env = await un.exportar(5_000);
  checar(
    "envelope da unidade sem login",
    env.formato === "seipro-projetos" && env.versao === 1 && env.vis === "unidade" && env.login === undefined,
  );
  checar(
    "envelope leva lapides",
    env.entidades.e.some((e) => e.id === e2.id && e.removidoEm !== undefined),
  );
  checar("envelope do 'eu' leva o login", (await eu.exportar()).login === "ana");
  const { repo: outro } = novoRepo(ESCOPO_UN, areaMemoria(), "o");
  const r1 = await outro.importar(env.entidades);
  checar(
    "importar num repositorio vazio",
    r1.novos === env.entidades.p.length + 1 + 2 + env.entidades.h.length && r1.atualizados === 0,
    r1,
  );
  checar(
    "importar de novo nao muda nada (idempotente)",
    (await outro.importar(env.entidades)).novos === 0 && (await outro.importar(env.entidades)).atualizados === 0,
  );
  const maisNova = { ...e1, nome: "ETP revisado", atualizadoEm: e1.atualizadoEm + 100 };
  const maisVelha = { ...e1, nome: "ETP antigo", atualizadoEm: e1.atualizadoEm - 100 };
  checar(
    "versao mais nova vence",
    (await outro.importar({ e: [maisNova] })).atualizados === 1 && (await outro.obterEtapa(e1.id))?.nome === "ETP revisado",
  );
  checar(
    "versao mais velha perde",
    (await outro.importar({ e: [maisVelha] })).atualizados === 0 && (await outro.obterEtapa(e1.id))?.nome === "ETP revisado",
  );
  const lixo = await outro.importar({ e: [{ id: "x" } as never, { ...e1, id: "y", inicio: "2026-02-30" }], p: [null as never] });
  checar("malformado e data impossivel sao ignorados", lixo.ignorados === 3 && lixo.novos === 0, lixo);
  checar(
    "lapide que chega remove",
    (await outro.dados()).etapas.every((e) => e.id !== e2.id),
  );

  secao("projetos: sigiloso que chega sem numero");
  const local = projeto({ id: "s", processo: { protocolo: "50300.000001/2026-11", sigiloso: true, idProcedimento: "77" } });
  const vazio = projeto({ id: "s", nome: "Novo nome", processo: { protocolo: "", sigiloso: true }, atualizadoEm: 9 });
  const r = manterNumeroSigiloso(vazio, local);
  checar(
    "mantem o numero e o id local",
    r.processo?.protocolo === "50300.000001/2026-11" && r.processo.idProcedimento === "77" && r.nome === "Novo nome",
  );
  checar("sem copia local fica vazio", manterNumeroSigiloso(vazio, undefined).processo?.protocolo === "");
  checar(
    "nao sigiloso passa como veio",
    manterNumeroSigiloso(projeto({ id: "s", processo: { protocolo: "" } }), local).processo?.protocolo === "",
  );
  const { repo: rs } = novoRepo(ESCOPO_UN, areaMemoria(), "s");
  await rs.importar({ p: [local] });
  await rs.importar({ p: [vazio] });
  checar("na mesclagem o numero local fica", (await rs.obterProjeto("s"))?.processo?.protocolo === "50300.000001/2026-11");
  const { repo: ro } = novoRepo(ESCOPO_UN, areaMemoria(), "q");
  await ro.importar({ p: [projeto({ id: "torto", ordem: "zz!!" })] });
  checar(
    "chave de ordem invalida importada nao impede criar",
    (await ro.criarProjeto({ nome: "Depois do torto" })).nome === "Depois do torto",
  );
  checar("entidadeValida aceita etapa completa", entidadeValida(etapa({ id: "a" }), "e"));
  checar("entidadeValida recusa etapa sem datas", !entidadeValida({ ...etapa({ id: "a" }), fim: undefined }, "e"));

  secao("projetos: limpeza de lapides");
  const { repo: rl, relogio } = novoRepo(ESCOPO_UN, areaMemoria(), "l");
  const pl = await rl.criarProjeto({ nome: "Velho" });
  await rl.removerProjeto(pl.id);
  const removidoEm = relogio();
  checar("unidade: lapide de 179 dias fica", (await rl.limpar(removidoEm + 179 * DIA)) === 0);
  checar("unidade: lapide de 181 dias sai", (await rl.limpar(removidoEm + 181 * DIA)) === 1 && !(await rl.projetos.obter(pl.id)));
  const { repo: rle, relogio: relogioEu } = novoRepo(ESCOPO_EU, areaMemoria(), "m");
  const pe = await rle.criarProjeto({ nome: "Meu" });
  await rle.removerProjeto(pe.id);
  checar("so eu: lapide de 91 dias sai", (await rle.limpar(relogioEu() + 91 * DIA)) === 1);

  secao("projetos: indice de processos");
  checar("chaveProtocolo so digitos", chaveProtocolo("50300.004410/2026-02") === "50300004410202602");
  const pa = projeto({ id: "pa", processo: { protocolo: "50300.004410/2026-02" } });
  const pb = projeto({ id: "pb", arquivadoEm: 5, processo: { protocolo: "50300.004410/2026-02" } });
  const ea = etapa({ id: "ea", projeto: "pa" });
  const eb = etapa({ id: "eb", projeto: "pa", processo: { protocolo: "50300.000777/2026-00" } });
  const ec = etapa({ id: "ec", projeto: "pc", processo: { protocolo: "50300.000777/2026-00" } });
  const pc = projeto({ id: "pc" });
  const idx = indiceDeProcessos([
    { vis: "unidade", projetos: [pa, pb], etapas: [ea, eb] },
    { vis: "eu", projetos: [pc], etapas: [ec, { ...etapa({ id: "ed", projeto: "pc", processo: { protocolo: "1" } }), removidoEm: 1 }] },
  ]);
  const doProjeto = idx.get("50300004410202602");
  checar(
    "processo do projeto: papel projeto com as etapas sem processo proprio",
    doProjeto?.length === 1 && doProjeto[0]?.papel === "projeto" && doProjeto[0]?.etapas.map((e) => e.id).join() === "ea",
  );
  const deEtapa = idx.get("50300000777202600");
  checar(
    "processo de etapa nos dois escopos",
    deEtapa?.map((v) => `${v.vis}:${v.projeto.id}:${v.papel}`).join() === "unidade:pa:etapa,eu:pc:etapa",
  );
  checar("arquivado e lapide ficam fora", !idx.has("1") && !doProjeto?.some((v) => v.projeto.id === "pb"));
  const juntos = await indiceDosEscopos([un, eu]);
  checar(
    "indiceDosEscopos junta os repositorios",
    juntos
      .get("50300004410202602")?.[0]
      ?.etapas.map((e) => e.id)
      .join() === e1.id,
  );

  secao("projetos: mover entre escopos");
  let avisos = 0;
  const parar = eu.aoMudar(() => avisos++);
  const movido = await moverEntreEscopos(un, eu, p.id);
  parar();
  checar("aoMudar avisa as gravacoes", avisos > 0);
  checar("mesmo id no destino", movido.id === p.id);
  const de = await eu.dados();
  checar("fases e etapas vivas foram junto", de.fases.length === 1 && de.etapas.length === 1 && de.etapas[0]?.fase === f.id);
  checar("origem ficou sem o projeto", !(await un.dados()).projetos.length && !(await un.dados()).etapas.length);
  const hist = await eu.historico(p.id);
  checar(
    "historico foi junto e registra a visibilidade",
    hist[0]?.campo === "visibilidade" &&
      hist[0]?.antes === "Toda a unidade" &&
      hist[0]?.depois === "Só eu" &&
      hist.some((x) => x.campo === "criacao"),
  );
  checar("historico saiu da origem", !(await un.historico(p.id)).length);
  checar(
    "mover projeto que nao existe e recusado",
    await moverEntreEscopos(un, eu, "nada").then(
      () => false,
      () => true,
    ),
  );
  checar("datas do mover nao mudam", de.etapas[0]?.inicio === "2026-10-07" && HOJE === "2026-10-06");
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelo/vinculos' imported from …/projetos/tests/verificar-escopos.ts`.

- [ ] **Step 3: Implementar o índice de processos**

Processo do projeto leva as etapas sem processo próprio (papel "projeto"); processo só de etapa leva só as ligadas (papel "etapa"); arquivados e lápides ficam fora; a chave é só dígitos.

`projetos/src/modelo/vinculos.ts`:

```ts
/**
 * Índice protocolo → vínculos, para o ícone da caixa e da árvore (spec 7):
 * um processo é "do projeto" (processo do projeto; as etapas sem processo
 * próprio vão junto) ou "de etapa" (só as etapas ligadas a ele). Projetos
 * arquivados e lápides ficam fora.
 */

import type { Etapa, Projeto, Vinculo, Vis } from "./tipos";

export interface VinculoProcesso {
  vis: Vis;
  projeto: Projeto;
  papel: "projeto" | "etapa";
  etapas: Etapa[];
}

/** Só os dígitos: "50300.001234/2026-11" e "50300001234202611" são o mesmo processo. */
export function chaveProtocolo(protocolo: string): string {
  return protocolo.replace(/\D/g, "");
}

const chaveDe = (v: Vinculo | undefined): string => (v?.protocolo ? chaveProtocolo(v.protocolo) : "");

export function indiceDeProcessos(
  escopos: ReadonlyArray<{ vis: Vis; projetos: readonly Projeto[]; etapas: readonly Etapa[] }>,
): Map<string, VinculoProcesso[]> {
  const indice = new Map<string, VinculoProcesso[]>();
  const pegar = (chave: string, vis: Vis, projeto: Projeto, papel: VinculoProcesso["papel"]): VinculoProcesso => {
    const lista = indice.get(chave) ?? [];
    let v = lista.find((x) => x.projeto.id === projeto.id && x.vis === vis);
    if (!v) {
      v = { vis, projeto, papel, etapas: [] };
      lista.push(v);
      indice.set(chave, lista);
    }
    if (papel === "projeto") v.papel = "projeto";
    return v;
  };
  for (const esc of escopos) {
    const projetos = new Map(esc.projetos.filter((p) => p.removidoEm === undefined && p.arquivadoEm === undefined).map((p) => [p.id, p]));
    for (const p of projetos.values()) {
      const k = chaveDe(p.processo);
      if (k) pegar(k, esc.vis, p, "projeto");
    }
    for (const e of esc.etapas) {
      const p = projetos.get(e.projeto);
      if (!p || e.removidoEm !== undefined) continue;
      const k = chaveDe(e.processo) || chaveDe(p.processo);
      if (!k) continue;
      pegar(k, esc.vis, p, e.processo ? "etapa" : "projeto").etapas.push(e);
    }
  }
  return indice;
}
```

- [ ] **Step 4: Acrescentar ao repositório**

Em cada troca e inserção abaixo, deixe uma linha em branco entre o trecho novo e a linha seguinte (como no resto do arquivo).

(a) Substitua o bloco inteiro de imports de `projetos/src/repositorio.ts` (do primeiro `import` até a linha antes de `/** O que está vivo no escopo (sem lápides), numa leitura só. */`) por:

```ts
import type { Area } from "@comum/armazenamento/area";
import { Colecao, obterPorPrefixo } from "@comum/armazenamento/colecao";
import { novoId } from "@comum/id";
import { indiceEntre, indiceValido } from "@comum/ordem/indice";
import { mesclar, purgarLapides, type Versionada } from "@comum/sincronia/entidade";
import { normalizarTexto } from "@comum/texto";
import { dataValida } from "./modelo/calendario";
import { DIAS_LAPIDE_EU, DIAS_LAPIDE_UNIDADE, LIMITES } from "./modelo/constantes";
import { validarDependencias, violacoesDeDatas } from "./modelo/dependencias";
import { baseDoEscopo, chaveMeta, prefixoDe, rotuloDaVis } from "./modelo/escopo";
import {
  type ApoioHistorico,
  carimbarRegistros,
  excedentes,
  type RegistroNovo,
  registrosDeEtapa,
  registrosDeFase,
  registrosDeProjeto,
} from "./modelo/historico";
import { aplicarDatas, baseInicial, redefinirBase, replanejada } from "./modelo/linhaDeBase";
import {
  concluir,
  type DadosNovaEtapa,
  type DadosNovoProjeto,
  editar,
  novaEtapa,
  novaFase,
  novoProjeto,
  porOrdem,
  reabrir,
  remover,
  restaurar,
  semVazios,
} from "./modelo/operacoes";
import type {
  Carimbo,
  DataISO,
  DocumentoSei,
  Entidade,
  Entidades,
  EnvelopeProjetos,
  Escopo,
  Etapa,
  Fase,
  Modelo,
  MudancaDeDatas,
  Projeto,
  Registro,
  Vinculo,
} from "./modelo/tipos";
import { checklistLimpo, ErroValidacao, etiquetasLimpas, nomeLimpo, problemasDaEtapa, problemasDoProjeto } from "./modelo/validacao";
import { indiceDeProcessos, type VinculoProcesso } from "./modelo/vinculos";
```

(b) Logo antes da linha `  // ---------- histórico ----------`, insira:

```ts
  /** Carimbo para gravações feitas fora da classe (mover entre escopos). */
  carimboAtual(): Carimbo {
    return this.carimbo();
  }

  /** Registro "visibilidade" (mover entre "Só eu" e "Toda a unidade"). */
  async anotarVisibilidade(p: Projeto, antes: string, depois: string, c: Carimbo): Promise<void> {
    await this.anotar([{ alvo: p.id, projeto: p.id, campo: "visibilidade", antes, depois }], c);
  }
```

(c) Logo antes da linha `  aoMudar(cb: () => void): () => void {` (último método da classe), insira a seção de sincronia. A mesclagem usa `mesclar` do `sei-comum`, que devolve o próprio objeto vencedor: se é o local, nada a gravar.

```ts
  // ---------- sincronia, arquivo, limpeza ----------

  /** Envelope do escopo com TUDO (lápides inclusive). A privacidade dos sigilosos é do adaptador da sincronia (P4). */
  async exportar(agora: number = Date.now()): Promise<EnvelopeProjetos> {
    const env: EnvelopeProjetos = {
      formato: "seipro-projetos",
      versao: 1,
      host: this.escopo.host,
      unidade: this.escopo.unidade,
      vis: this.escopo.vis,
      gerado: agora,
      entidades: await this.entidades(),
    };
    if (this.escopo.vis === "eu") env.login = this.escopo.login.trim().toLowerCase();
    return env;
  }

  /**
   * Mescla entidades vindas de fora (Texto Padrão, arquivo, outro escopo): por
   * entidade vence a gravação mais recente (`mesclar` do sei-comum). Item
   * malformado é ignorado. Vínculo sigiloso que chega vazio (sem número) mantém
   * o número que este computador já tinha.
   */
  async importar(ent: Partial<Entidades>): Promise<{ novos: number; atualizados: number; ignorados: number }> {
    const soma = { novos: 0, atualizados: 0, ignorados: 0 };
    const somar = (r: typeof soma) => {
      soma.novos += r.novos;
      soma.atualizados += r.atualizados;
      soma.ignorados += r.ignorados;
    };
    somar(await this.mesclarEm(this.projetos, ent.p ?? [], "p", manterNumeroSigiloso));
    somar(await this.mesclarEm(this.fases, ent.f ?? [], "f"));
    somar(await this.mesclarEm(this.etapas, ent.e ?? [], "e", manterNumeroSigiloso));
    somar(await this.mesclarEm(this.registros, ent.h ?? [], "h"));
    somar(await this.mesclarEm(this.modelos, ent.m ?? [], "m"));
    return soma;
  }

  private async mesclarEm<T extends Versionada>(
    col: Colecao<T>,
    itens: readonly unknown[],
    tipo: keyof Entidades,
    combinar: (vencedor: T, local: T | undefined) => T = (v) => v,
  ): Promise<{ novos: number; atualizados: number; ignorados: number }> {
    const locais = await col.listar();
    const validos = itens.filter((x) => entidadeValida(x, tipo)) as T[];
    const porId = new Map(locais.map((i) => [i.id, i]));
    const gravar: Array<[string, T]> = [];
    let novos = 0;
    let atualizados = 0;
    // `mesclar` devolve o próprio objeto vencedor: se é o local, nada a gravar.
    for (const vencedor of mesclar(locais, validos)) {
      const atual = porId.get(vencedor.id);
      if (vencedor === atual) continue;
      gravar.push([vencedor.id, combinar(vencedor, atual)]);
      if (atual) atualizados += 1;
      else novos += 1;
    }
    await col.gravarVarios(gravar);
    return { novos, atualizados, ignorados: itens.length - validos.length };
  }

  /**
   * Apaga de vez as lápides velhas (180 dias na unidade, 90 no "só eu": um
   * usuário eventual da unidade não pode ressuscitar exclusões) e poda o
   * histórico em 300 registros. Devolve quantas chaves saíram.
   */
  async limpar(agora: number = Date.now()): Promise<number> {
    const dias = this.escopo.vis === "unidade" ? DIAS_LAPIDE_UNIDADE : DIAS_LAPIDE_EU;
    let total = 0;
    for (const col of [this.projetos, this.fases, this.etapas, this.registros, this.modelos] as Array<Colecao<Versionada>>) {
      const todos = await col.listar();
      const manter = new Set(purgarLapides(todos, agora, dias).map((i) => i.id));
      const sair = todos.filter((i) => !manter.has(i.id)).map((i) => i.id);
      await col.apagar(sair);
      total += sair.length;
    }
    const sobra = excedentes(await this.registros.listar(), LIMITES.historico);
    await this.registros.apagar(sobra);
    return total + sobra.length;
  }

  /** Índice protocolo → vínculos deste escopo (para juntar os dois escopos, use `indiceDosEscopos`). */
  async vinculos(): Promise<Map<string, VinculoProcesso[]>> {
    const d = await this.dados();
    return indiceDeProcessos([{ vis: this.escopo.vis, projetos: d.projetos, etapas: d.etapas }]);
  }
```

(d) No fim do arquivo (depois do `}` da classe), acrescente:

```ts
/** Vínculo sigiloso que chegou sem número (Texto Padrão) mantém o número deste computador. */
export function manterNumeroSigiloso<T extends { processo?: Vinculo }>(vencedor: T, local: T | undefined): T {
  const v = vencedor.processo;
  const l = local?.processo;
  if (!v?.sigiloso || v.protocolo || !l?.sigiloso || !l.protocolo) return vencedor;
  return { ...vencedor, processo: semVazios({ ...v, protocolo: l.protocolo, idProcedimento: v.idProcedimento ?? l.idProcedimento }) };
}

const texto = (x: unknown): x is string => typeof x === "string";

/** Forma mínima de cada tipo (arquivo editado à mão ou de versão estranha não entra). */
export function entidadeValida(x: unknown, tipo: keyof Entidades): boolean {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (!texto(o.id) || !o.id || typeof o.atualizadoEm !== "number" || !Number.isFinite(o.atualizadoEm) || !texto(o.dispositivo))
    return false;
  if (o.removidoEm !== undefined && typeof o.removidoEm !== "number") return false;
  switch (tipo) {
    case "p":
      return texto(o.nome) && Array.isArray(o.etiquetas) && texto(o.ordem);
    case "f":
      return texto(o.projeto) && texto(o.nome) && texto(o.ordem);
    case "e":
      return (
        texto(o.projeto) &&
        texto(o.nome) &&
        texto(o.ordem) &&
        dataValida(o.inicio) &&
        dataValida(o.fim) &&
        Array.isArray(o.dependeDe) &&
        Array.isArray(o.checklist) &&
        Array.isArray(o.etiquetas)
      );
    case "h":
      return texto(o.alvo) && texto(o.projeto) && typeof o.quando === "number" && texto(o.campo);
    case "m":
      return texto(o.nome) && Array.isArray(o.fases) && Array.isArray(o.etapas);
  }
}

/** Junta o índice dos escopos da unidade (o painel e a caixa mostram os dois). */
export async function indiceDosEscopos(repos: readonly RepositorioProjetos[]): Promise<Map<string, VinculoProcesso[]>> {
  const dados = await Promise.all(repos.map(async (r) => ({ vis: r.escopo.vis, ...(await r.dados()) })));
  return indiceDeProcessos(dados);
}

/**
 * "Quem vê" mudou: leva projeto, fases, etapas e registros para o outro escopo
 * (mesmos ids, carimbo novo, para vencer na mesclagem) e deixa lápide no de
 * origem. Registra a mudança de visibilidade no histórico do destino.
 */
export async function moverEntreEscopos(origem: RepositorioProjetos, destino: RepositorioProjetos, id: string): Promise<Projeto> {
  const p = await origem.obterProjeto(id);
  if (!p) throw new ErroValidacao(["O projeto não existe mais."]);
  if (p.arquivadoEm === undefined) {
    const ativos = (await destino.dados()).projetos.filter((x) => x.arquivadoEm === undefined);
    if (ativos.length >= LIMITES.projetosAtivos)
      throw new ErroValidacao([
        `Limite de ${LIMITES.projetosAtivos} projetos ativos em “${rotuloDaVis(destino.escopo.vis)}”. Arquive ou exclua algum.`,
      ]);
  }
  const d = await origem.dados();
  const fases = d.fases.filter((f) => f.projeto === id);
  const etapas = d.etapas.filter((e) => e.projeto === id);
  const registros = await origem.historico(id);
  const cDestino = destino.carimboAtual();
  const recarimbar = <T extends Entidade>(x: T): T => editar(x, {} as Partial<Omit<T, "id" | "atualizadoEm" | "dispositivo">>, cDestino);
  await destino.importar({ p: [recarimbar(p)], f: fases.map(recarimbar), e: etapas.map(recarimbar), h: registros.map(recarimbar) });
  await destino.anotarVisibilidade(p, rotuloDaVis(origem.escopo.vis), rotuloDaVis(destino.escopo.vis), cDestino);
  const cOrigem = origem.carimboAtual();
  await origem.etapas.gravarVarios(etapas.map((e) => [e.id, remover(e, cOrigem)]));
  await origem.fases.gravarVarios(fases.map((f) => [f.id, remover(f, cOrigem)]));
  await origem.registros.gravarVarios(registros.map((r) => [r.id, remover(r, cOrigem)]));
  await origem.projetos.gravar(p.id, remover(p, cOrigem));
  return (await destino.obterProjeto(id))!;
}
```

- [ ] **Step 5: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/filtro";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
export * from "./modelo/vinculos";
export * from "./repositorio";
```

- [ ] **Step 6: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `261 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelo/vinculos.ts \
  projetos/src/repositorio.ts \
  projetos/tests/verificar-escopos.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: envelope, mesclagem, limpeza, indice de processos e mover escopo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 9: Modelos de projeto — embutidos, aplicar e salvar como modelo

**Files:**
- Create: `projetos/src/modelos/embutidos.ts`, `projetos/src/modelos/aplicar.ts`, `projetos/src/modelos/salvar.ts`
- Modify: `projetos/src/repositorio.ts` (imports; seção "modelos"), `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-modelos.ts`

**Interfaces:**
- Consumes: Tarefa 2 (`proximoUtil`, `somarUteis`, `fimPorDuracao`, `duracaoUteis`, `uteisEntre`, `FERIADOS`), Tarefa 5 (`novaFase`, `novaEtapa`, `compararEtapas`, `porOrdem`, `nomeLimpo`, `problemasDoModelo`), `@comum/ordem/indice` (`indicesEntre`), `RepositorioProjetos` (Tarefas 7–8).
- Produces: `MODELOS_EMBUTIDOS: readonly Modelo[]` (Revisão normativa 9 etapas/3 fases; Contratação por pregão eletrônico 11/3; Plano anual 12/4), `PREFIXO_EMBUTIDO = "embutido:"`, `ehEmbutido(id)`; `DatasDaEtapa`, `datasDoModelo(modelo, inicio, feriados?)`, `PreviaModelo { etapas; fases; termina?; primeiras }`, `previaDoModelo(modelo, inicio, feriados?)`, `ContextoModelo { projeto; carimbo; novoId; feriados? }`, `aplicarModelo(modelo, inicio, ctx): { fases; etapas }`; `modeloDoProjeto(dados, nome, id, c, descricao?, feriados?): Modelo`; no repositório `criarProjetoDeModelo(d, modelo, inicio)`, `salvarComoModelo(projeto, nome, descricao?)`, `renomearModelo(id, nome)`, `removerModelo(id)` (limite 50).

- [ ] **Step 1: Escrever as provas**

A prova principal: a "Revisão normativa" começando em 03/08/2026 dá exatamente as datas da tela 1 (e a prévia da tela 2: "9 etapas em 3 fases … termina em 10/12/2026"); salvar e aplicar de volta devolve os mesmos dias úteis.

`projetos/tests/verificar-modelos.ts`:

```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { LIMITES } from "../src/modelo/constantes";
import { validarDependencias, violacoesDeDatas } from "../src/modelo/dependencias";
import { ErroValidacao } from "../src/modelo/validacao";
import { aplicarModelo, datasDoModelo, previaDoModelo } from "../src/modelos/aplicar";
import { ehEmbutido, MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import { modeloDoProjeto } from "../src/modelos/salvar";
import { ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { C } from "./fabrica";
import { checar, lanca, secao } from "./util";

const [REVISAO, PREGAO, ANUAL] = MODELOS_EMBUTIDOS;

export async function verificarModelos(): Promise<void> {
  secao("projetos: modelos embutidos");
  checar("3 modelos embutidos", MODELOS_EMBUTIDOS.length === 3 && MODELOS_EMBUTIDOS.every((m) => ehEmbutido(m.id)));
  checar(
    "revisao: 9 etapas em 3 fases",
    REVISAO!.etapas.length === 9 && REVISAO!.fases.join() === "Instrução,Consulta pública,Deliberação",
  );
  checar("pregao: 11 etapas em 3 fases", PREGAO!.etapas.length === 11 && PREGAO!.fases.join() === "Planejamento,Seleção,Contrato");
  checar("plano anual: 4 trimestres", ANUAL!.fases.length === 4 && ANUAL!.etapas.length === 12);
  let n = 0;
  for (const m of MODELOS_EMBUTIDOS) {
    const { etapas } = aplicarModelo(m, "2026-01-05", { projeto: "p", carimbo: C, novoId: () => `x${++n}` });
    checar(
      `${m.nome}: sem violacao de datas nem ciclo`,
      violacoesDeDatas(etapas).length === 0 && etapas.every((e) => validarDependencias(e, etapas) === null),
    );
  }

  secao("projetos: aplicar modelo (dias uteis e feriados)");
  const datas = datasDoModelo(REVISAO!, "2026-08-03");
  const texto = datas.map((d) => `${d.inicio.slice(5)}>${d.fim.slice(5)}`).join(" ");
  checar(
    "revisao em 03/08/2026 da as datas da tela 1",
    texto === "08-03>08-21 08-24>09-11 09-01>09-25 09-15>09-15 09-15>10-15 10-16>11-06 11-09>11-27 12-03>12-03 12-10>12-10",
    texto,
  );
  const pv = previaDoModelo(REVISAO!, "2026-08-03");
  checar("previa: 9 etapas em 3 fases, termina 10/12/2026", pv.etapas === 9 && pv.fases === 3 && pv.termina === "2026-12-10");
  checar(
    "previa: 3 primeiras etapas",
    pv.primeiras.map((e) => e.nome).join() === "Nota técnica preliminar,Análise jurídica,Relatório de AIR",
  );
  checar("comecar num sabado vai para o proximo dia util", datasDoModelo(REVISAO!, "2026-10-10")[0]?.inicio === "2026-10-13");
  checar(
    "virada de ano: 31/12 + 1 dia util pula 01/01",
    datasDoModelo({ etapas: [{ ...REVISAO!.etapas[0]!, aPartirDe: 1 }] }, "2026-12-31")[0]?.inicio === "2027-01-04",
  );
  checar("modelo sem etapas: previa sem termino", previaDoModelo({ fases: [], etapas: [] }, "2026-10-06").termina === undefined);
  let k = 0;
  const { fases, etapas } = aplicarModelo(REVISAO!, "2026-08-03", { projeto: "p1", carimbo: C, novoId: () => `n${++k}` });
  checar("fases em ordem", fases.map((f) => f.nome).join() === REVISAO!.fases.join() && fases[0]!.ordem < fases[1]!.ordem);
  const minuta = etapas.find((e) => e.nome === "Minuta final")!;
  const air = etapas.find((e) => e.nome === "Relatório de AIR")!;
  checar("dependencias remapeadas para ids novos", minuta.dependeDe.length === 2 && minuta.dependeDe.includes(air.id));
  checar("checklist vira itens nao feitos", air.checklist.length === 3 && air.checklist.every((i) => !i.feito && i.id));
  checar(
    "marco com uma data",
    etapas.filter((e) => e.marco).every((e) => e.inicio === e.fim),
  );
  checar("etapa ligada a fase", air.fase === fases[0]!.id);
  const ruim = { ...REVISAO!, etapas: [{ ...REVISAO!.etapas[0]!, dependeDe: [0, 7, -1] }] };
  checar(
    "indice invalido e auto-dependencia saem",
    aplicarModelo(ruim, "2026-08-03", { projeto: "p", carimbo: C, novoId: () => `z${++k}` }).etapas[0]?.dependeDe.length === 0,
  );

  secao("projetos: salvar como modelo (ida e volta)");
  const volta = modeloDoProjeto({ fases, etapas }, "Minha revisão", "m1", C);
  const ida = REVISAO!.etapas.map((e) => `${e.aPartirDe}/${e.duracao}`).join();
  checar("ida e volta: mesmos dias uteis e duracoes", volta.etapas.map((e) => `${e.aPartirDe}/${e.duracao}`).join() === ida);
  checar(
    "ida e volta: mesmas dependencias",
    JSON.stringify(volta.etapas.map((e) => e.dependeDe)) === JSON.stringify(REVISAO!.etapas.map((e) => e.dependeDe)),
  );
  checar("ida e volta: fases e checklist", volta.fases.join() === REVISAO!.fases.join() && volta.etapas[2]?.checklist.length === 3);
  checar("modelo de projeto vazio", modeloDoProjeto({ fases: [], etapas: [] }, "Vazio", "m2", C).etapas.length === 0);

  secao("projetos: modelos no repositorio");
  const { repo } = novoRepo(ESCOPO_UN, areaMemoria(), "r");
  const p = await repo.criarProjetoDeModelo({ nome: "Revisão 2026" }, PREGAO!, "2026-10-06");
  const d = await repo.dados();
  checar(
    "projeto de modelo com fases e etapas",
    d.fases.length === 3 && d.etapas.length === 11 && d.etapas.every((e) => e.projeto === p.id),
  );
  const salvo = await repo.salvarComoModelo(p.id, "  Meu pregão ", "uso interno");
  checar(
    "salvar como modelo grava no escopo",
    salvo.nome === "Meu pregão" && (await repo.dados()).modelos.length === 1 && salvo.etapas.length === 11,
  );
  checar("renomear modelo", (await repo.renomearModelo(salvo.id, "Pregão TI")).nome === "Pregão TI");
  const erro = await lanca(() => repo.renomearModelo(salvo.id, ""));
  checar("modelo sem nome recusado", erro instanceof ErroValidacao && erro.mensagens.join() === "Informe o nome do modelo.");
  await repo.removerModelo(salvo.id);
  checar("remover modelo", (await repo.dados()).modelos.length === 0);
  for (let i = 0; i < LIMITES.modelos; i++) await repo.salvarComoModelo(p.id, `M${i}`);
  const cheio = await lanca(() => repo.salvarComoModelo(p.id, "mais um"));
  checar("51o modelo recusado", cheio instanceof ErroValidacao && cheio.mensagens.join() === "Limite de 50 modelos. Exclua algum.");
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
import { verificarModelos } from "./verificar-modelos";
import { verificarOperacoes } from "./verificar-operacoes";
import { verificarRepositorio } from "./verificar-repositorio";
import { verificarSituacao } from "./verificar-situacao";

verificarEscopo();
verificarCalendario();
verificarSituacao();
verificarDependencias();
verificarOperacoes();
verificarFiltro();
await verificarRepositorio();
await verificarEscopos();
await verificarModelos();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/modelos/aplicar' imported from …/projetos/tests/verificar-modelos.ts`.

- [ ] **Step 3: Implementar os modelos**

Textos neutros, sem nome de pessoa (spec 5.4). `aPartirDe` = dias úteis contados do primeiro dia útil do projeto; `duracao` = dias úteis inclusive (marco 0).

`projetos/src/modelos/embutidos.ts`:

```ts
/**
 * Os 3 modelos de exemplo (spec 5.4), sempre disponíveis e nunca gravados:
 * textos neutros, sem nome de pessoa. Datas em dias úteis a partir do início
 * (`aPartirDe`) e duração em dias úteis (marco: 0). A "Revisão normativa"
 * começando em 03/08/2026 dá exatamente as datas da tela 1.
 */

import type { EtapaModelo, Modelo } from "../modelo/tipos";

const etapa = (
  nome: string,
  fase: number,
  aPartirDe: number,
  duracao: number,
  dependeDe: number[] = [],
  checklist: string[] = [],
): EtapaModelo => ({
  nome,
  fase,
  aPartirDe,
  duracao,
  marco: false,
  dependeDe,
  checklist,
});

const marco = (nome: string, fase: number, aPartirDe: number, dependeDe: number[] = []): EtapaModelo => ({
  nome,
  fase,
  aPartirDe,
  duracao: 0,
  marco: true,
  dependeDe,
  checklist: [],
});

const embutido = (id: string, nome: string, descricao: string, fases: string[], etapas: EtapaModelo[]): Modelo => ({
  id,
  nome,
  descricao,
  fases,
  etapas,
  criadoEm: 0,
  atualizadoEm: 0,
  dispositivo: "embutido",
});

export const PREFIXO_EMBUTIDO = "embutido:";

export const MODELOS_EMBUTIDOS: readonly Modelo[] = [
  embutido(
    `${PREFIXO_EMBUTIDO}revisao-normativa`,
    "Revisão normativa",
    "Instrução, consulta pública e deliberação de uma norma.",
    ["Instrução", "Consulta pública", "Deliberação"],
    [
      etapa("Nota técnica preliminar", 0, 0, 15),
      etapa("Análise jurídica", 0, 15, 14, [0]),
      etapa(
        "Relatório de AIR",
        0,
        21,
        18,
        [0],
        ["Levantar dados do setor", "Identificar alternativas regulatórias", "Analisar custos e benefícios"],
      ),
      marco("Aviso de consulta publicado", 1, 30, [1]),
      etapa("Período de contribuições", 1, 30, 22, [3]),
      etapa("Consolidação das contribuições", 1, 52, 15, [4]),
      etapa("Minuta final", 2, 67, 14, [5, 2]),
      marco("Reunião de Diretoria", 2, 84, [6]),
      marco("Publicação no DOU", 2, 89, [7]),
    ],
  ),
  embutido(
    `${PREFIXO_EMBUTIDO}pregao-eletronico`,
    "Contratação por pregão eletrônico",
    "Planejamento, seleção do fornecedor e contrato.",
    ["Planejamento", "Seleção", "Contrato"],
    [
      etapa("Documento de formalização da demanda", 0, 0, 5),
      etapa("Estudo técnico preliminar", 0, 5, 15, [0]),
      etapa("Pesquisa de preços", 0, 10, 10, [0]),
      etapa("Termo de referência", 0, 20, 10, [1]),
      etapa("Parecer jurídico", 0, 30, 10, [3, 2]),
      marco("Edital publicado", 1, 40, [4]),
      marco("Sessão pública do pregão", 1, 50, [5]),
      etapa("Julgamento e habilitação", 1, 50, 5, [6]),
      marco("Adjudicação e homologação", 1, 55, [7]),
      marco("Contrato assinado", 2, 60, [8]),
      etapa("Designação da fiscalização", 2, 60, 3, [9]),
    ],
  ),
  embutido(
    `${PREFIXO_EMBUTIDO}plano-anual`,
    "Plano anual",
    "Um ano de trabalho dividido em trimestres.",
    ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"],
    [0, 1, 2, 3].flatMap((t) => {
      const base = t * 63;
      const i = t * 3;
      const anterior = t === 0 ? [] : [i - 1];
      return [
        etapa(`Planejamento do ${t + 1}º trimestre`, t, base, 5, anterior),
        etapa(`Execução do ${t + 1}º trimestre`, t, base + 5, 55, [i]),
        marco(`Relatório do ${t + 1}º trimestre`, t, base + 60, [i + 1]),
      ];
    }),
  ),
];

export function ehEmbutido(id: string): boolean {
  return id.startsWith(PREFIXO_EMBUTIDO);
}
```

`projetos/src/modelos/aplicar.ts`:

```ts
/**
 * Modelo → projeto (spec 3.2): a primeira etapa começa no primeiro dia útil a
 * partir da data escolhida; cada etapa começa `aPartirDe` dias úteis depois e
 * dura `duracao` dias úteis, pulando fins de semana e feriados nacionais.
 */

import { indicesEntre } from "@comum/ordem/indice";
import { FERIADOS, fimPorDuracao, proximoUtil, somarUteis } from "../modelo/calendario";
import { novaEtapa, novaFase } from "../modelo/operacoes";
import type { Carimbo, DataISO, Etapa, Fase, Modelo } from "../modelo/tipos";

export interface DatasDaEtapa {
  inicio: DataISO;
  fim: DataISO;
}

export function datasDoModelo(modelo: Pick<Modelo, "etapas">, inicio: DataISO, feriados: ReadonlySet<DataISO> = FERIADOS): DatasDaEtapa[] {
  const base = proximoUtil(inicio, feriados);
  return modelo.etapas.map((e) => {
    const ini = e.aPartirDe > 0 ? somarUteis(base, Math.floor(e.aPartirDe), feriados) : base;
    return { inicio: ini, fim: e.marco ? ini : fimPorDuracao(ini, e.duracao, feriados) };
  });
}

export interface PreviaModelo {
  etapas: number;
  fases: number;
  termina?: DataISO;
  primeiras: Array<{ nome: string } & DatasDaEtapa>;
}

/** Prévia do diálogo "Novo projeto": N etapas em M fases, término e as 3 primeiras. */
export function previaDoModelo(
  modelo: Pick<Modelo, "etapas" | "fases">,
  inicio: DataISO,
  feriados: ReadonlySet<DataISO> = FERIADOS,
): PreviaModelo {
  const datas = datasDoModelo(modelo, inicio, feriados);
  const termina = datas.reduce<DataISO | undefined>((m, d) => (m === undefined || d.fim > m ? d.fim : m), undefined);
  const previa: PreviaModelo = {
    etapas: modelo.etapas.length,
    fases: modelo.fases.length,
    primeiras: modelo.etapas.slice(0, 3).map((e, i) => ({ nome: e.nome, ...datas[i]! })),
  };
  if (termina) previa.termina = termina;
  return previa;
}

export interface ContextoModelo {
  projeto: string;
  carimbo: Carimbo;
  novoId: () => string;
  feriados?: ReadonlySet<DataISO>;
}

/** Fases e etapas novas (ids novos; dependências e fases remapeadas; índices inválidos descartados). */
export function aplicarModelo(modelo: Modelo, inicio: DataISO, ctx: ContextoModelo): { fases: Fase[]; etapas: Etapa[] } {
  const c = ctx.carimbo;
  const ordensF = modelo.fases.length ? indicesEntre(null, null, modelo.fases.length) : [];
  const fases = modelo.fases.map((nome, i) => novaFase(ctx.projeto, nome, ctx.novoId(), ordensF[i]!, c));
  const ids = modelo.etapas.map(() => ctx.novoId());
  const ordensE = modelo.etapas.length ? indicesEntre(null, null, modelo.etapas.length) : [];
  const datas = datasDoModelo(modelo, inicio, ctx.feriados ?? FERIADOS);
  const etapas = modelo.etapas.map((e, i) =>
    novaEtapa(
      {
        projeto: ctx.projeto,
        nome: e.nome,
        inicio: datas[i]!.inicio,
        fim: datas[i]!.fim,
        marco: e.marco,
        fase: e.fase !== undefined ? fases[e.fase]?.id : undefined,
        dependeDe: e.dependeDe.filter((d) => d !== i && d >= 0 && d < ids.length).map((d) => ids[d]!),
        checklist: e.checklist.map((texto) => ({ id: ctx.novoId(), texto, feito: false })),
      },
      ids[i]!,
      ordensE[i]!,
      c,
    ),
  );
  return { fases, etapas };
}
```

`projetos/src/modelos/salvar.ts`:

```ts
/**
 * "Salvar como modelo" (spec 3.2): o projeto vira um modelo com datas
 * relativas em dias úteis, contadas do primeiro dia útil da primeira etapa.
 * Aplicar o modelo de volta na mesma data devolve as mesmas datas.
 */

import { duracaoUteis, FERIADOS, proximoUtil, uteisEntre } from "../modelo/calendario";
import { compararEtapas, porOrdem } from "../modelo/operacoes";
import type { Carimbo, DataISO, Etapa, EtapaModelo, Fase, Modelo } from "../modelo/tipos";
import { nomeLimpo } from "../modelo/validacao";

export function modeloDoProjeto(
  dados: { fases: readonly Fase[]; etapas: readonly Etapa[] },
  nome: string,
  id: string,
  c: Carimbo,
  descricao?: string,
  feriados: ReadonlySet<DataISO> = FERIADOS,
): Modelo {
  const fases = dados.fases.filter((f) => f.removidoEm === undefined).sort(porOrdem);
  const indiceFase = new Map(fases.map((f, i) => [f.id, i]));
  const etapas = dados.etapas.filter((e) => e.removidoEm === undefined).sort(compararEtapas("inicio"));
  const indiceEtapa = new Map(etapas.map((e, i) => [e.id, i]));
  const base = etapas.length ? proximoUtil(etapas[0]!.inicio, feriados) : undefined;
  const lista: EtapaModelo[] = etapas.map((e) => {
    const em: EtapaModelo = {
      nome: e.nome,
      aPartirDe: base ? Math.max(0, uteisEntre(base, proximoUtil(e.inicio, feriados), feriados)) : 0,
      duracao: e.marco ? 0 : Math.max(1, duracaoUteis(e.inicio, e.fim, feriados)),
      marco: e.marco,
      dependeDe: e.dependeDe.map((d) => indiceEtapa.get(d)).filter((d): d is number => d !== undefined),
      checklist: e.checklist.map((i) => i.texto),
    };
    const f = e.fase !== undefined ? indiceFase.get(e.fase) : undefined;
    if (f !== undefined) em.fase = f;
    return em;
  });
  const m: Modelo = {
    id,
    nome: nomeLimpo(nome),
    fases: fases.map((f) => f.nome),
    etapas: lista,
    criadoEm: c.agora,
    atualizadoEm: c.agora,
    dispositivo: c.dispositivo,
  };
  if (descricao?.trim()) m.descricao = descricao.trim();
  if (c.por) m.alteradoPor = c.por;
  return m;
}
```

- [ ] **Step 4: Acrescentar ao repositório**

Nas duas trocas abaixo, deixe uma linha em branco entre o trecho novo e a linha seguinte (como no resto do arquivo).

(a) Substitua o bloco inteiro de imports de `projetos/src/repositorio.ts` (do primeiro `import` até a linha antes de `/** O que está vivo no escopo (sem lápides), numa leitura só. */`) por:

```ts
import type { Area } from "@comum/armazenamento/area";
import { Colecao, obterPorPrefixo } from "@comum/armazenamento/colecao";
import { novoId } from "@comum/id";
import { indiceEntre, indiceValido } from "@comum/ordem/indice";
import { mesclar, purgarLapides, type Versionada } from "@comum/sincronia/entidade";
import { normalizarTexto } from "@comum/texto";
import { dataValida } from "./modelo/calendario";
import { DIAS_LAPIDE_EU, DIAS_LAPIDE_UNIDADE, LIMITES } from "./modelo/constantes";
import { validarDependencias, violacoesDeDatas } from "./modelo/dependencias";
import { baseDoEscopo, chaveMeta, prefixoDe, rotuloDaVis } from "./modelo/escopo";
import {
  type ApoioHistorico,
  carimbarRegistros,
  excedentes,
  type RegistroNovo,
  registrosDeEtapa,
  registrosDeFase,
  registrosDeProjeto,
} from "./modelo/historico";
import { aplicarDatas, baseInicial, redefinirBase, replanejada } from "./modelo/linhaDeBase";
import {
  concluir,
  type DadosNovaEtapa,
  type DadosNovoProjeto,
  editar,
  novaEtapa,
  novaFase,
  novoProjeto,
  porOrdem,
  reabrir,
  remover,
  restaurar,
  semVazios,
} from "./modelo/operacoes";
import type {
  Carimbo,
  DataISO,
  DocumentoSei,
  Entidade,
  Entidades,
  EnvelopeProjetos,
  Escopo,
  Etapa,
  Fase,
  Modelo,
  MudancaDeDatas,
  Projeto,
  Registro,
  Vinculo,
} from "./modelo/tipos";
import {
  checklistLimpo,
  ErroValidacao,
  etiquetasLimpas,
  nomeLimpo,
  problemasDaEtapa,
  problemasDoModelo,
  problemasDoProjeto,
} from "./modelo/validacao";
import { indiceDeProcessos, type VinculoProcesso } from "./modelo/vinculos";
import { aplicarModelo } from "./modelos/aplicar";
import { modeloDoProjeto } from "./modelos/salvar";
```

(b) Logo antes da linha `  // ---------- sincronia, arquivo, limpeza ----------`, insira:

```ts
  // ---------- modelos ----------

  /** Projeto novo a partir de um modelo (embutido ou salvo), começando em `inicio`. */
  async criarProjetoDeModelo(d: DadosNovoProjeto, modelo: Modelo, inicio: DataISO): Promise<Projeto> {
    const p = await this.criarProjeto(d);
    const c = this.carimbo();
    const { fases, etapas } = aplicarModelo(modelo, inicio, { projeto: p.id, carimbo: c, novoId: this.gerarId });
    await this.fases.gravarVarios(fases.map((f) => [f.id, f]));
    await this.etapas.gravarVarios(etapas.map((e) => [e.id, e]));
    return p;
  }

  async salvarComoModelo(projeto: string, nome: string, descricao?: string): Promise<Modelo> {
    await this.exigirProjeto(projeto);
    const vivos = (await this.modelos.listar()).filter(vivo);
    if (vivos.length >= LIMITES.modelos) throw new ErroValidacao([`Limite de ${LIMITES.modelos} modelos. Exclua algum.`]);
    const d = await this.dados();
    const c = this.carimbo();
    const m = modeloDoProjeto(
      { fases: d.fases.filter((f) => f.projeto === projeto), etapas: d.etapas.filter((e) => e.projeto === projeto) },
      nome,
      this.gerarId(),
      c,
      descricao,
    );
    const problemas = problemasDoModelo(m);
    if (problemas.length) throw new ErroValidacao(problemas);
    await this.modelos.gravar(m.id, m);
    return m;
  }

  async renomearModelo(id: string, nome: string): Promise<Modelo> {
    const atual = await this.modelos.obter(id);
    if (!vivo(atual)) throw new ErroValidacao(["O modelo não existe mais."]);
    const proposta = { ...atual, nome: nomeLimpo(nome) };
    const problemas = problemasDoModelo(proposta);
    if (problemas.length) throw new ErroValidacao(problemas);
    const m = editar(atual, { nome: proposta.nome }, this.carimbo());
    await this.modelos.gravar(id, m);
    return m;
  }

  async removerModelo(id: string): Promise<void> {
    const atual = await this.modelos.obter(id);
    if (vivo(atual)) await this.modelos.gravar(id, remover(atual, this.carimbo()));
  }
```

- [ ] **Step 5: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/filtro";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
export * from "./modelo/vinculos";
export * from "./modelos/aplicar";
export * from "./modelos/embutidos";
export * from "./modelos/salvar";
export * from "./repositorio";
```

- [ ] **Step 6: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `290 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/modelos/embutidos.ts \
  projetos/src/modelos/aplicar.ts \
  projetos/src/modelos/salvar.ts \
  projetos/src/repositorio.ts \
  projetos/tests/verificar-modelos.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: modelos embutidos, aplicar e salvar como modelo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 10: Frappe Gantt 1.2.2 vendorizada com os ajustes da spec 8

**Files:**
- Create: `projetos/src/vendor/frappe-gantt/{index.js, bar.js, arrow.js, svg_utils.js, date_utils.js, defaults.js}` (cópia ajustada de `src/` do pacote npm), `LICENSE`, `AJUSTES.md`, `tipos.d.ts`, `index.d.ts`, `date_utils.d.ts`
- Modify: `projetos/build.mjs` (silencia o aviso `duplicate-class-member` do fonte original), `projetos/tests/verificar.ts`
- Test: `projetos/tests/ambienteGantt.ts`, `projetos/tests/verificar-vendor.ts`

**Interfaces:**
- Consumes: pacote npm `frappe-gantt@1.2.2` (sha1 do tarball `36bf15e74e179ac707341b663a49493a05a7fdf5`), `esbuild` (prova do pacote), `linkedom` (`parseHTML`).
- Produces: `import Gantt, { type TarefaFrappe, type ModoDeVisao, type OpcoesFrappe, type BarraFrappe, type FeriadoFrappe } from "../vendor/frappe-gantt/index"` e `import dateUtils from "../vendor/frappe-gantt/date_utils"` (`parse`, `diff`, `convert_scales`, `add`). Contrato ajustado: `custom_class` com várias classes; `view_mode` respeitado com `view_modes`; `after_render(gantt, barra?)` (sem barra no fim do `render`; com barra no fim de `Bar.update_label_position`); `popup: false` sempre (módulo fora); `destroy()`; nenhum `innerHTML`. Nos testes: `instalarAmbienteGantt(): Document`, `esperarQuadro()`, `area(doc)`.

- [ ] **Step 1: Baixar o pacote e conferir a integridade**

O pacote é dado de fora: vai para uma pasta própria e vazia, e nada dele roda.

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && D="${TMPDIR:-/tmp}/seipro-frappe-1.2.2" && rm -rf "$D" && mkdir -p "$D" \
  && npm pack frappe-gantt@1.2.2 --pack-destination "$D" \
  && shasum -a 1 "$D/frappe-gantt-1.2.2.tgz" \
  && tar -xzf "$D/frappe-gantt-1.2.2.tgz" -C "$D" && ls "$D/package/src" "$D/package/dist"
```

Expected: `36bf15e74e179ac707341b663a49493a05a7fdf5  …/frappe-gantt-1.2.2.tgz` (o `dist.shasum` publicado no npm) e as listas `arrow.js bar.js date_utils.js defaults.js index.js popup.js styles svg_utils.js` e `frappe-gantt.css frappe-gantt.es.js frappe-gantt.umd.js`. Se o sha1 for outro, PARE.

- [ ] **Step 2: Escrever as provas**

Ambiente linkedom para a Frappe (sem layout): `getBBox` mede texto por 6 px/caractere, `scrollTo` não faz nada, medidas do elemento são 0 (a rolagem guarda o valor), `requestAnimationFrame` vira `setTimeout(0)`, e `classList.add` recusa token com espaço, como o navegador — é o que prova o ajuste 2 (o linkedom aceitaria):

`projetos/tests/ambienteGantt.ts`:

```ts
/**
 * Ambiente linkedom para a Frappe Gantt. O linkedom não tem layout: `getBBox`
 * mede o texto por 6 px/caractere, `scrollTo` não faz nada, as medidas do
 * elemento são 0 (a rolagem guarda o valor) e
 * `requestAnimationFrame` vira `setTimeout(0)` (use `esperarQuadro()`). O
 * `classList.add` recusa token com espaço, como o navegador (prova do ajuste 2).
 */

import { parseHTML } from "linkedom";

type Global = Record<string, unknown>;

export function instalarAmbienteGantt(): Document {
  const { window, document } = parseHTML("<!doctype html><html><body><div id='area'></div></body></html>");
  const g = globalThis as unknown as Global;
  g.window = window;
  g.document = document;
  g.HTMLElement = window.HTMLElement;
  g.SVGElement = window.SVGElement;
  if (typeof (globalThis as Global).navigator === "undefined")
    Object.defineProperty(globalThis, "navigator", { value: { userAgent: "linkedom" }, configurable: true });
  g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(Date.now()), 0);
  const svgProto = window.SVGElement.prototype as unknown as Record<string, unknown>;
  svgProto.getBBox = function (this: Element) {
    const largura = this.tagName.toLowerCase() === "text" ? (this.textContent ?? "").length * 6 : Number(this.getAttribute("width")) || 0;
    return { x: Number(this.getAttribute("x")) || 0, y: Number(this.getAttribute("y")) || 0, width: largura, height: 12 };
  };
  const htmlProto = window.HTMLElement.prototype as unknown as Record<string, unknown>;
  htmlProto.scrollTo = () => {};
  // Sem layout, o linkedom devolve undefined e a Frappe faria contas com NaN (data inválida).
  Object.defineProperty(htmlProto, "scrollLeft", {
    get(this: { _rolagem?: number }) {
      return this._rolagem ?? 0;
    },
    set(this: { _rolagem?: number }, v: number) {
      this._rolagem = v;
    },
    configurable: true,
  });
  for (const medida of ["clientWidth", "offsetWidth", "scrollWidth"])
    Object.defineProperty(htmlProto, medida, { get: () => 0, configurable: true });
  const tokens = Object.getPrototypeOf(document.createElement("div").classList) as Record<string, unknown>;
  if (!tokens.__estrito) {
    const add = tokens.add as (...t: string[]) => void;
    tokens.add = function (this: unknown, ...t: string[]) {
      for (const x of t) if (/\s/.test(x)) throw new Error(`InvalidCharacterError: "${x}" tem espaço`);
      return add.apply(this, t);
    };
    tokens.__estrito = true;
  }
  return document as unknown as Document;
}

/** Deixa rodar os `requestAnimationFrame` pendentes (rótulos e decorações por barra). */
export function esperarQuadro(): Promise<void> {
  return new Promise((r) => setTimeout(r, 5));
}

export function area(doc: Document): HTMLElement {
  return doc.getElementById("area") as HTMLElement;
}
```

Provas do vendor: arquivos e cabeçalhos, licença, `AJUSTES.md`, varredura do pacote gerado pelo esbuild (sem `innerHTML`/`outerHTML`/`insertAdjacentHTML`, sem `on*="`, só ASCII, sem o módulo popup) e o comportamento ajustado em linkedom:

`projetos/tests/verificar-vendor.ts`:

```ts
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import Gantt, { type BarraFrappe, type TarefaFrappe } from "../src/vendor/frappe-gantt/index";
import { area, esperarQuadro, instalarAmbienteGantt } from "./ambienteGantt";
import { checar, secao } from "./util";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VENDOR = join(RAIZ, "src/vendor/frappe-gantt");
const PROIBIDO = /innerHTML|outerHTML|insertAdjacentHTML/;
// on<evento>=" dentro de literal (o mesmo critério de tools/check-dom-injection.mjs); "el.onclick = fn" não casa.
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;

const MODOS = [
  { name: "Dia", padding: "7d", step: "1d", column_width: 28, date_format: "YYYY-MM-DD", lower_text: "D", upper_text: "MMMM" },
  { name: "Semana", padding: "14d", step: "7d", column_width: 64, date_format: "YYYY-MM-DD", lower_text: "D", upper_text: "MMMM" },
];

const tarefa = (m: Partial<TarefaFrappe> & { id: string }): TarefaFrappe => ({
  name: m.id,
  start: "2026-10-05",
  end: "2026-10-09",
  progress: 0,
  ...m,
});

export async function verificarVendor(): Promise<void> {
  secao("projetos: Frappe Gantt vendorizada - fonte e pacote");
  const arquivos = (await readdir(VENDOR)).sort();
  checar(
    "arquivos do vendor (sem popup.js)",
    arquivos.join() ===
      "AJUSTES.md,LICENSE,arrow.js,bar.js,date_utils.d.ts,date_utils.js,defaults.js,index.d.ts,index.js,svg_utils.js,tipos.d.ts",
    arquivos,
  );
  for (const f of arquivos.filter((a) => a.endsWith(".js"))) {
    const texto = await readFile(join(VENDOR, f), "utf8");
    checar(
      `${f}: // @ts-nocheck e cabecalho de origem`,
      texto.startsWith("// @ts-nocheck\n") && texto.includes("Frappe Gantt 1.2.2") && texto.includes("SEI Pro"),
    );
    checar(`${f}: sem innerHTML/outerHTML/insertAdjacentHTML`, !PROIBIDO.test(texto));
  }
  const licenca = await readFile(join(VENDOR, "LICENSE"), "utf8");
  checar("LICENSE MIT original", licenca.includes("The MIT License (MIT)") && licenca.includes("Frappe Technologies"));
  const ajustes = await readFile(join(VENDOR, "AJUSTES.md"), "utf8");
  checar(
    "AJUSTES.md descreve os ajustes 1 a 9",
    [1, 2, 3, 4, 5, 6, 7, 8, 9].every((n) => ajustes.includes(`## ${n}.`)),
  );
  const r = await build({
    stdin: { contents: 'import Gantt from "./src/vendor/frappe-gantt/index"; globalThis.__g = Gantt;', resolveDir: RAIZ, loader: "ts" },
    bundle: true,
    minify: true,
    write: false,
    format: "esm",
    charset: "ascii",
    target: ["chrome116", "firefox115"],
    logLevel: "silent",
  });
  const pacote = r.outputFiles[0]?.text ?? "";
  checar("pacote gerado", pacote.length > 20_000, pacote.length);
  checar("pacote sem innerHTML/outerHTML/insertAdjacentHTML", !PROIBIDO.test(pacote));
  checar("pacote sem acao em atributo on*", !HANDLER.test(pacote));
  checar(
    "pacote so ASCII",
    [...pacote].every((ch) => ch.charCodeAt(0) <= 0x7f),
  );
  checar("pacote sem o modulo popup nem o popup padrao (ajuste 1f)", !pacote.includes("set_details") && !pacote.includes("<br/>"));

  secao("projetos: Frappe Gantt vendorizada - comportamento (linkedom)");
  const doc = instalarAmbienteGantt();
  const a = area(doc);
  let geral = 0;
  const porBarra: string[] = [];
  const hostil = '<img src=x onerror="alert(1)">';
  const g = new Gantt(
    a,
    [
      tarefa({ id: "e1", name: hostil, custom_class: "st-andamento realce" }),
      tarefa({ id: "e2", start: "2026-10-12", end: "2026-10-16", dependencies: "e1" }),
    ],
    {
      view_modes: MODOS,
      view_mode: "Semana",
      popup: false,
      infinite_padding: false,
      after_render: (_g: Gantt, b?: BarraFrappe) => (b ? porBarra.push(b.task.id) : geral++),
    },
  );
  checar("view_mode informado e respeitado (ajuste 3)", g.config.view_mode.name === "Semana");
  const grupo = a.querySelector('.bar-wrapper[data-id="e1"]');
  checar("custom_class com duas classes (ajuste 2)", !!grupo?.classList.contains("st-andamento") && !!grupo?.classList.contains("realce"));
  const rotulo = grupo?.querySelector(".bar-label");
  checar(
    "rotulo com HTML aparece como texto (ajuste 1a)",
    rotulo?.textContent === hostil && rotulo.children.length === 0 && !a.querySelector("img"),
  );
  checar("gancho after_render no fim do render (ajuste 4)", geral === 1);
  await esperarQuadro();
  checar("gancho after_render por barra depois do rotulo", porBarra.sort().join() === "e1,e2");
  checar("hachura criada com createElementNS (ajuste 1d)", !!g.$svg.querySelector("pattern#diagonalHatch path"));
  checar("seta do ajuste com textContent (ajuste 1c)", g.$container.querySelector(".adjust")?.textContent === "←");
  checar("textos da escala com textContent (ajuste 1e)", (g.$container.querySelector(".lower-text")?.textContent ?? "") !== "");
  const g2 = new Gantt(doc.createElement("div"), [tarefa({ id: "x" })], {
    view_modes: MODOS,
    view_mode: "Inexistente",
    infinite_padding: false,
  });
  checar("view_mode inexistente cai no primeiro", g2.config.view_mode.name === "Dia");
  g.destroy();
  checar("destroy tira o conteiner (ajuste 9)", !a.querySelector(".gantt-container"));
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
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
resumo();
```

- [ ] **Step 3: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/vendor/frappe-gantt/index' imported from …/projetos/tests/verificar-vendor.ts`.

- [ ] **Step 4: Escrever o `AJUSTES.md`** (é a fonte única das trocas: o Step 5 aplica exatamente os trechos daqui)

`projetos/src/vendor/frappe-gantt/AJUSTES.md`:

````markdown
# Frappe Gantt 1.2.2 -- ajustes do SEI Pro

Origem: pacote npm `frappe-gantt@1.2.2` (sha1 do tarball `36bf15e74e179ac707341b663a49493a05a7fdf5`),
pasta `src/`. Licenca MIT original em `LICENSE`. Cada arquivo `.js` daqui comeca com `// @ts-nocheck`
e um cabecalho com a origem. Spec: `docs/superpowers/specs/2026-10-06-projetos-design.md`, secao 8.

Arquivos copiados: `index.js`, `bar.js`, `arrow.js`, `svg_utils.js`, `date_utils.js`, `defaults.js`.
Fora: `popup.js` (ajuste 1f) e `styles/` (ajuste 6). `arrow.js` e `date_utils.js` ficam como vieram
(so o cabecalho).

## 1. Sem innerHTML, outerHTML nem insertAdjacentHTML

Contrato do DOM seguro do SEI Pro: nada de HTML vindo de dado. O nome da etapa (`<img onerror=...>`) vira texto. `innerText` tambem sai: o linkedom das provas nao tem o setter, e `textContent` faz o mesmo aqui.

### 1a -- `svg_utils.js`: createSVG aceita textContent (rotulos sem HTML)

Original:

```js
        } else if (attr === 'innerHTML') {
            elem.innerHTML = attrs.innerHTML;
        } else if
```

Novo:

```js
        } else if (attr === 'textContent') {
            // SEI Pro (ajuste 1a): texto entra como no de texto, nunca como HTML
            elem.textContent = attrs.textContent;
        } else if
```

### 1a -- `bar.js`: createSVG aceita textContent (rotulos sem HTML)

Original:

```js
            innerHTML: this.task.name,
```

Novo:

```js
            textContent: this.task.name, // SEI Pro (ajuste 1a)
```

### 1b -- `index.js`: Esvaziar com replaceChildren()

Original:

```js
    clear() {
        this.$svg.innerHTML = '';
```

Novo:

```js
    clear() {
        this.$svg.replaceChildren(); // SEI Pro (ajuste 1b)
```

### 1b -- `bar.js`: Esvaziar com replaceChildren()

Original:

```js
        this.bar_group.innerHTML = '';
        this.handle_group.innerHTML = '';
```

Novo:

```js
        this.bar_group.replaceChildren(); // SEI Pro (ajuste 1b)
        this.handle_group.replaceChildren();
```

### 1c -- `index.js`: Setas do botao de ajuste com textContent

Original:

```js
        this.$adjust.innerHTML = '&larr;';
    }
```

Novo:

```js
        this.$adjust.textContent = '\u2190'; // SEI Pro (ajuste 1c)
    }
```

### 1c -- `index.js`: Setas do botao de ajuste com textContent

Original:

```js
                this.$adjust.innerHTML = '&larr;';
```

Novo:

```js
                this.$adjust.textContent = '\u2190'; // SEI Pro (ajuste 1c)
```

### 1c -- `index.js`: Setas do botao de ajuste com textContent

Original:

```js
                this.$adjust.innerHTML = '&rarr;';
```

Novo:

```js
                this.$adjust.textContent = '\u2192'; // SEI Pro (ajuste 1c)
```

### 1d -- `index.js`: Padrao diagonalHatch com createElementNS

Original:

```js
        this.layers.grid.innerHTML += `<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M-1,1 l2,-2
                   M0,4 l4,-4
                   M3,5 l2,-2"
                style="stroke:grey; stroke-width:0.3" />
        </pattern>`;
```

Novo:

```js
        // SEI Pro (ajuste 1d): padrao criado com createElementNS, sem HTML em texto
        const $hachura = createSVG('pattern', {
            id: 'diagonalHatch',
            patternUnits: 'userSpaceOnUse',
            width: 4,
            height: 4,
            append_to: this.layers.grid,
        });
        createSVG('path', {
            d: 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2',
            style: 'stroke:grey; stroke-width:0.3',
            append_to: $hachura,
        });
```

### 1e -- `index.js`: Textos da escala com textContent (innerText nao existe no linkedom)

Original:

```js
                $lower_text.innerText = date.lower_text;
```

Novo:

```js
                $lower_text.textContent = date.lower_text; // SEI Pro (ajuste 1e)
```

### 1e -- `index.js`: Textos da escala com textContent (innerText nao existe no linkedom)

Original:

```js
                $upper_text.innerText = date.upper_text;
```

Novo:

```js
                $upper_text.textContent = date.upper_text; // SEI Pro (ajuste 1e)
```

### 1f -- `index.js`: Modulo popup fora (popup: false e balao proprio)

Original:

```js
import Popup from './popup';
```

Novo:

```js
(linha removida)
```

### 1f -- `index.js`: Modulo popup fora (popup: false e balao proprio)

Original:

```js
    show_popup(opts) {
        if (this.options.popup === false) return;
        if (!this.popup) {
            this.popup = new Popup(
                this.$popup_wrapper,
                this.options.popup,
                this,
            );
        }
        this.popup.show(opts);
    }
```

Novo:

```js
    // SEI Pro (ajuste 1f): modulo popup removido (o SEI Pro usa balao proprio)
    show_popup() {}
```

### 1f -- `defaults.js`: Modulo popup fora (popup: false e balao proprio)

Original:

```js
    popup: (ctx) => {
        ctx.set_title(ctx.task.name);
        if (ctx.task.description) ctx.set_subtitle(ctx.task.description);
        else ctx.set_subtitle('');

        const start_date = date_utils.format(
            ctx.task._start,
            'MMM D',
            ctx.chart.options.language,
        );
        const end_date = date_utils.format(
            date_utils.add(ctx.task._end, -1, 'second'),
            'MMM D',
            ctx.chart.options.language,
        );
        const word = ctx.task.actual_duration === 1 ? 'day' : 'days';

        ctx.set_details(
            `${start_date} - ${end_date} (${ctx.task.actual_duration} ${word}${ctx.task.ignored_duration ? ' + ' + ctx.task.ignored_duration + ' excluded' : ''})<br/>Progress: ${Math.floor(ctx.task.progress * 100) / 100}%`,
        );
    },
```

Novo:

```js
    popup: false, // SEI Pro (ajuste 1f): sem popup da biblioteca
```

## 2. custom_class com varias classes

A 1.2.2 faz `classList.add(custom_class)`, e o navegador lanca `InvalidCharacterError` com espaco no token. O wrapper manda `st-marco st-atrasada`.

### 2 -- `bar.js`: custom_class com varias classes separadas por espaco

Original:

```js
        if (this.task.custom_class) {
            this.group.classList.add(this.task.custom_class);
        } else {
            this.group.classList = ['bar-wrapper'];
        }
```

Novo:

```js
        // SEI Pro (ajuste 2): custom_class aceita varias classes separadas por espaco
        this.group.setAttribute('class', 'bar-wrapper');
        for (const cls of String(this.task.custom_class || '')
            .split(/\s+/)
            .filter(Boolean))
            this.group.classList.add(cls);
```

## 3. view_mode informado e respeitado

A 1.2.2 forca `view_modes[0]` sempre que `view_modes` e passado (a tela de referencia precisava de um `change_view_mode` extra, que desenha duas vezes).

### 3 -- `index.js`: view_mode informado e respeitado com view_modes

Original:

```js
            // automatically set the view mode to the first option
            options.view_mode = options.view_modes[0];
```

Novo:

```js
            // SEI Pro (ajuste 3): respeita o view_mode informado; so cai no primeiro se ele nao existir
            const pedido =
                typeof options.view_mode === 'string'
                    ? options.view_mode
                    : options.view_mode?.name;
            options.view_mode =
                options.view_modes.find((m) => m && m.name === pedido) ||
                options.view_modes[0];
```

## 4. Gancho after_render(gantt, barra?)

As decoracoes (losango do marco, fase fina, linha de base) precisam rodar depois do desenho e depois de cada `update_label_position`, que a Frappe chama num `requestAnimationFrame` e a cada passo do arraste (senao o rotulo volta para o lugar dela).

### 4 -- `index.js`: Gancho after_render(gantt, barra?)

Original:

```js
        this.set_dimensions();
        this.set_scroll_position(this.options.scroll_to);
    }
```

Novo:

```js
        this.set_dimensions();
        this.set_scroll_position(this.options.scroll_to);
        this.notificar_desenho(); // SEI Pro (ajuste 4)
    }

    // SEI Pro (ajuste 4): gancho pos-desenho. Sem barra: fim do render (desenho inteiro).
    // Com barra: fim de Bar.update_label_position (depois do desenho da barra, do refresh e de cada passo de arraste).
    notificar_desenho(bar) {
        if (typeof this.options.after_render === 'function')
            this.options.after_render(this, bar);
    }
```

### 4 -- `bar.js`: Gancho after_render(gantt, barra?)

Original:

```js
                label.setAttribute(
                    'x',
                    bar.getX() + barWidth / 2 - labelWidth / 2,
                );
            }
        }
    }
```

Novo:

```js
                label.setAttribute(
                    'x',
                    bar.getX() + barWidth / 2 - labelWidth / 2,
                );
            }
        }
        this.gantt.notificar_desenho(this); // SEI Pro (ajuste 4)
    }
```

## 5. Idioma pt-BR

`language: "pt-BR"` ja funciona (meses por `Intl`). As escalas em portugues (Dia, Semana, Mes, Ano) ficam no wrapper, em `src/gantt/escalas.ts`. Nenhuma mudanca no fonte.

## 6. Licenca, cabecalho e CSS

Licenca MIT preservada em `LICENSE`; cabecalho de origem em cada arquivo. O `import './styles/gantt.css'` sai do `index.js`: o CSS da biblioteca (de `dist/frappe-gantt.css`) vai para `projetos/estatico/gantt.css`, junto dos tokens `--spro-*`.

### 6 -- `index.js`: CSS fora do JS (vai para projetos/estatico/gantt.css)

Original:

```js
import './styles/gantt.css';
```

Novo:

```js
(linha removida)
```

## 7. Tipos minimos

`tipos.d.ts` descreve so o que o wrapper usa; `index.d.ts` e `date_utils.d.ts` reexportam dele para o TypeScript achar os tipos ao importar os `.js`. O Biome ignora `src/vendor/`.

## 8. Rolagem tolerante a escala sem texto superior

Na escala Ano o texto superior e vazio; a 1.2.2 procura o elemento pelo texto e quebra com `TypeError` em `$el.clientWidth` (no render e na rolagem).

### 8 -- `index.js`: Rolagem tolerante a escala sem texto superior (Ano)

Original:

```js
        let $el = this.upperTexts.find(
            (el) => el.textContent === current_upper,
        );

        // Recalculate
        this.current_date = date_utils.add(
```

Novo:

```js
        let $el = this.upperTexts.find(
            (el) => el.textContent === current_upper,
        );
        if (!$el) return; // SEI Pro (ajuste 8): escala sem texto superior nesta data

        // Recalculate
        this.current_date = date_utils.add(
```

### 8 -- `index.js`: Rolagem tolerante a escala sem texto superior (Ano)

Original:

```js
        $el = this.upperTexts.find((el) => el.textContent === current_upper);
        $el.classList.add('current-upper');
        this.$current = $el;
```

Novo:

```js
        $el = this.upperTexts.find((el) => el.textContent === current_upper);
        if (!$el) return; // SEI Pro (ajuste 8)
        $el.classList.add('current-upper');
        this.$current = $el;
```

### 8 -- `index.js`: Rolagem tolerante a escala sem texto superior (Ano)

Original:

```js
                ((e.currentTarget.scrollLeft + $el.clientWidth) /
```

Novo:

```js
                ((e.currentTarget.scrollLeft + ($el ? $el.clientWidth : 0)) / // SEI Pro (ajuste 8)
```

### 8 -- `index.js`: Rolagem tolerante a escala sem texto superior (Ano)

Original:

```js
            if ($el !== this.$current) {
```

Novo:

```js
            if ($el && $el !== this.$current) { // SEI Pro (ajuste 8)
```

## 9. destroy() sem ouvinte esquecido

A 1.2.2 poe um ouvinte anonimo de `mouseup` no `document` e nunca tira; o painel recria o Gantt a cada mudanca, e os ouvintes (com o Gantt antigo preso neles) se acumulariam.

### 9 -- `index.js`: destroy() sem ouvinte esquecido no document

Original:

```js
        document.addEventListener('mouseup', () => {
            is_dragging = false;
            is_resizing_left = false;
            is_resizing_right = false;
            this.$container
                .querySelector('.visible')
                ?.classList?.remove?.('visible');
        });
```

Novo:

```js
        // SEI Pro (ajuste 9): ouvinte guardado para o destroy() tirar do document
        this._ao_soltar_documento = () => {
            is_dragging = false;
            is_resizing_left = false;
            is_resizing_right = false;
            this.$container
                .querySelector('.visible')
                ?.classList?.remove?.('visible');
        };
        document.addEventListener('mouseup', this._ao_soltar_documento);
```

### 9 -- `index.js`: destroy() sem ouvinte esquecido no document

Original:

```js
        this.popup?.hide?.();
    }
}
```

Novo:

```js
        this.popup?.hide?.();
    }

    // SEI Pro (ajuste 9): desmonta sem deixar ouvinte no document (o painel recria o Gantt a cada mudanca)
    destroy() {
        document.removeEventListener('mouseup', this._ao_soltar_documento);
        this.$container.remove();
    }
}
```
````

- [ ] **Step 5: Copiar o fonte e aplicar os ajustes**

Salve o aplicador FORA do repositório (pasta própria, não versionar) — ele lê o `AJUSTES.md`, confere que cada trecho original aparece exatamente uma vez, troca, põe o cabeçalho `// @ts-nocheck` + origem em cada arquivo e copia a licença:

```bash
mkdir -p "${TMPDIR:-/tmp}/seipro-ajustes" && echo "${TMPDIR:-/tmp}/seipro-ajustes/aplicar-ajustes-frappe.mjs"
```

Grave neste caminho (o que o comando imprimiu):

````js
// Aplica os ajustes do SEI Pro na Frappe Gantt 1.2.2 (fora do repositorio; nao versionar).
// Uso: node aplicar-ajustes-frappe.mjs <pasta src/ do pacote npm> <projetos/src/vendor/frappe-gantt>
// Le o AJUSTES.md da pasta de destino: cada secao "### " traz o arquivo, o trecho Original e o Novo.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [origem, destino] = process.argv.slice(2);
if (!origem || !destino) throw new Error("uso: node aplicar-ajustes-frappe.mjs <src do pacote> <pasta do vendor>");
const ARQUIVOS = ["index.js", "bar.js", "arrow.js", "svg_utils.js", "date_utils.js", "defaults.js"];
const textos = Object.fromEntries(ARQUIVOS.map((a) => [a, readFileSync(join(origem, a), "utf8")]));
const md = readFileSync(join(destino, "AJUSTES.md"), "utf8");
let trocas = 0;
for (const secao of md.split(/^### /m).slice(1)) {
  const arquivo = /`([a-z_]+\.js)`/.exec(secao)?.[1];
  const [velho, novo] = [...secao.matchAll(/```js\n([\s\S]*?)\n```/g)].map((m) => m[1]);
  if (!arquivo || velho === undefined || novo === undefined) throw new Error(`secao mal formada: ${secao.slice(0, 60)}`);
  const [de, para] = novo === "(linha removida)" ? [`${velho}\n`, ""] : [velho, novo];
  const vezes = textos[arquivo].split(de).length - 1;
  if (vezes !== 1) throw new Error(`${arquivo}: trecho encontrado ${vezes} vezes: ${de.slice(0, 60)}`);
  textos[arquivo] = textos[arquivo].replace(de, () => para);
  trocas += 1;
}
for (const a of ARQUIVOS) {
  const cabecalho = [
    "// @ts-nocheck",
    "/*",
    ` * Frappe Gantt 1.2.2 (MIT, https://github.com/frappe/gantt): copia de src/${a} do pacote npm.`,
    " * Ajustado para o SEI Pro (ver AJUSTES.md nesta pasta; licenca original em LICENSE).",
    " */",
    "",
  ].join("\n");
  writeFileSync(join(destino, a), cabecalho + textos[a]);
}
copyFileSync(join(dirname(origem), "license.txt"), join(destino, "LICENSE"));
console.log(`ok: ${trocas} trocas em ${ARQUIVOS.length} arquivos`);
````

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && D="${TMPDIR:-/tmp}/seipro-frappe-1.2.2" && mkdir -p src/vendor/frappe-gantt \
  && node "${TMPDIR:-/tmp}/seipro-ajustes/aplicar-ajustes-frappe.mjs" "$D/package/src" src/vendor/frappe-gantt \
  && ls src/vendor/frappe-gantt && grep -c "SEI Pro" src/vendor/frappe-gantt/*.js
```

Expected: `ok: 24 trocas em 6 arquivos`; a pasta com `AJUSTES.md LICENSE arrow.js bar.js date_utils.js defaults.js index.js svg_utils.js`; contagem de `SEI Pro` por arquivo: arrow 1, bar 5, date_utils 1, defaults 2, index 18, svg_utils 2. (Repositório no iCloud: se aparecer `index 2.js` ou parecido, apague a cópia.)

- [ ] **Step 6: Tipos mínimos** (o TypeScript acha `index.d.ts` e `date_utils.d.ts` ao lado dos `.js`; os dois só reexportam de `tipos.d.ts`)

`projetos/src/vendor/frappe-gantt/tipos.d.ts`:

```ts
/**
 * Tipos minimos da Frappe Gantt 1.2.2 ajustada: so o que o wrapper do SEI Pro (src/gantt/) usa.
 * A biblioteca e JS puro; estes tipos descrevem o contrato, nao a implementacao inteira.
 */

export interface TarefaFrappe {
  id: string;
  name: string;
  /** "AAAA-MM-DD" (meia-noite local). */
  start: string;
  /** "AAAA-MM-DD", inclusive (a biblioteca soma 24 h). */
  end: string;
  progress: number;
  /** Ids separados por virgula. A biblioteca troca por array ao montar. */
  dependencies?: string | string[];
  /** Varias classes separadas por espaco (ajuste 2). */
  custom_class?: string;
  _start?: Date;
  _end?: Date;
  _index?: number;
}

export type TextoDaEscala = string | ((data: Date, anterior: Date | null, idioma: string) => string);

export interface ModoDeVisao {
  name: string;
  padding?: string | [string, string];
  step: string;
  column_width?: number;
  date_format?: string;
  lower_text?: TextoDaEscala;
  upper_text?: TextoDaEscala;
  thick_line?: (data: Date) => boolean;
  upper_text_frequency?: number;
  snap_at?: string;
}

export interface FeriadoFrappe {
  /** "AAAA-MM-DD". */
  date: string;
  name: string;
}

export interface OpcoesFrappe {
  language?: string;
  view_modes?: ModoDeVisao[];
  /** Respeitado mesmo com view_modes (ajuste 3). */
  view_mode?: string;
  bar_height?: number;
  padding?: number;
  upper_header_height?: number;
  lower_header_height?: number;
  bar_corner_radius?: number;
  arrow_curve?: number;
  container_height?: "auto" | number;
  today_button?: boolean;
  view_mode_select?: boolean;
  /** Sempre false: o modulo popup foi removido (ajuste 1f). */
  popup?: false;
  readonly?: boolean;
  readonly_dates?: boolean;
  readonly_progress?: boolean;
  move_dependencies?: boolean;
  infinite_padding?: boolean;
  lines?: "both" | "vertical" | "horizontal" | "none";
  /** "AAAA-MM-DD", "today", "start", "end" ou null (inicio). */
  scroll_to?: string | null;
  /** Cor CSS -> "weekend" ou lista de feriados com nome. */
  holidays?: Record<string, "weekend" | FeriadoFrappe[]>;
  on_click?: (tarefa: TarefaFrappe) => void;
  on_date_change?: (tarefa: TarefaFrappe, inicio: Date, fim: Date) => void;
  on_view_change?: (modo: ModoDeVisao) => void;
  /** Gancho pos-desenho (ajuste 4): sem barra no fim do render; com barra depois de cada atualizacao da barra. */
  after_render?: (gantt: Gantt, barra?: BarraFrappe) => void;
}

export interface BarraFrappe {
  task: TarefaFrappe;
  group: SVGGElement;
  bar_group: SVGGElement;
  $bar: SVGRectElement;
  $bar_progress?: SVGRectElement;
  /** Linha da barra (constante; o atributo y do $bar pode ter sido mudado pela decoracao). */
  y: number;
  height: number;
}

export interface UtilitariosDeData {
  parse(data: string | Date): Date;
  diff(a: Date, b: Date, escala?: string): number;
  convert_scales(periodo: string, para: string): number;
  add(data: Date, quantidade: number, escala: string): Date;
}

export declare const utilitariosDeData: UtilitariosDeData;

export default class Gantt {
  constructor(area: HTMLElement, tarefas: TarefaFrappe[], opcoes: OpcoesFrappe);
  options: OpcoesFrappe;
  config: { column_width: number; step: number; unit: string; header_height: number; view_mode: ModoDeVisao };
  gantt_start: Date;
  gantt_end: Date;
  bars: BarraFrappe[];
  tasks: TarefaFrappe[];
  $container: HTMLElement;
  $svg: SVGSVGElement;
  change_view_mode(modo?: string, manterPosicao?: boolean): void;
  scroll_current(): void;
  get_bar(id: string): BarraFrappe | undefined;
  /** Ajuste 9: tira o ouvinte do document e o conteiner da pagina. */
  destroy(): void;
}
```

`projetos/src/vendor/frappe-gantt/index.d.ts`:

```ts
export { default } from "./tipos";
export type * from "./tipos";
```

`projetos/src/vendor/frappe-gantt/date_utils.d.ts`:

```ts
import { utilitariosDeData } from "./tipos";
export default utilitariosDeData;
```

- [ ] **Step 7: Build sem o aviso do fonte original** (arquivo inteiro; muda só o `logOverride` em `comum`: a Frappe 1.2.2 tem dois métodos `view_is` e vale o segundo, como no pacote publicado)

`projetos/build.mjs`:

```js
#!/usr/bin/env node
/**
 * Build do Projetos.
 *
 * Fase P2 (nucleo): nada vai para dist/. O manifest ainda nao conhece o modulo e um arquivo
 * gerado sem uso confundiria a revisao. O build empacota EM MEMORIA a API publica
 * (src/api.ts: modelo, repositorio, modelos, wrapper do Gantt e a Frappe ajustada) e roda
 * os portoes sobre o resultado:
 *   - JS so ASCII (regra do projeto para JS da extensao; o esbuild ja escapa, o portao confere);
 *   - sem innerHTML/outerHTML/insertAdjacentHTML nem acao em atributo on* (DOM seguro).
 * O P3 troca ENTRADAS pelas saidas reais (dist/js/init_projetos.js, dist/js/projetos/app.js,
 * dist/html/projetos.html, dist/css/projetos.css) e passa a gravar em dist/.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const AQUI = dirname(fileURLToPath(import.meta.url));

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

const ENTRADAS = [{ nome: "api (verificacao P2)", entrada: "src/api.ts", formato: "esm", saida: ".verificacao/api.js" }];

const PROIBIDO = /innerHTML|outerHTML|insertAdjacentHTML/;
// on<evento>=" dentro de literal, como tools/check-dom-injection.mjs ("el.onclick = fn" nao casa).
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;

let falhou = false;
const erro = (m) => {
  console.error(`ERRO: ${m}`);
  falhou = true;
};

console.log("\nProjetos -- build (P2: verificacao em memoria; nada vai para dist/)");
for (const { nome, entrada, formato, saida } of ENTRADAS) {
  const r = await build({ ...comum, entryPoints: [resolve(AQUI, entrada)], format: formato, write: false, outfile: resolve(AQUI, saida) });
  for (const f of r.outputFiles) {
    const i = f.contents.findIndex((b) => b > 0x7f);
    if (i >= 0) erro(`byte nao-ASCII em ${nome} (posicao ${i}): ${Buffer.from(f.contents.subarray(Math.max(0, i - 40), i + 10)).toString("utf8")}`);
    if (PROIBIDO.test(f.text)) erro(`${nome}: innerHTML/outerHTML/insertAdjacentHTML no pacote`);
    if (HANDLER.test(f.text)) erro(`${nome}: acao em atributo on* no pacote`);
    console.log(`  ${nome.padEnd(26)} ${Math.round(f.contents.length / 1024)} KB (em memoria)`);
  }
}

if (falhou) process.exit(1);
console.log("  portoes: ASCII e DOM seguro ok");
```

- [ ] **Step 8: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `320 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 9: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/vendor/frappe-gantt/index.js \
  projetos/src/vendor/frappe-gantt/bar.js \
  projetos/src/vendor/frappe-gantt/arrow.js \
  projetos/src/vendor/frappe-gantt/svg_utils.js \
  projetos/src/vendor/frappe-gantt/date_utils.js \
  projetos/src/vendor/frappe-gantt/defaults.js \
  projetos/src/vendor/frappe-gantt/LICENSE \
  projetos/src/vendor/frappe-gantt/AJUSTES.md \
  projetos/src/vendor/frappe-gantt/tipos.d.ts \
  projetos/src/vendor/frappe-gantt/index.d.ts \
  projetos/src/vendor/frappe-gantt/date_utils.d.ts \
  projetos/build.mjs \
  projetos/tests/ambienteGantt.ts \
  projetos/tests/verificar-vendor.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: Frappe Gantt 1.2.2 vendorizada e ajustada (sem innerHTML)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 11: Gantt — escalas em português, linhas e tarefas

**Files:**
- Create: `projetos/src/gantt/escalas.ts`, `projetos/src/gantt/linhas.ts`, `projetos/src/gantt/tarefas.ts`
- Modify: `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/cenarioGantt.ts`, `projetos/tests/verificar-linhas.ts`

**Interfaces:**
- Consumes: tipos do vendor (`ModoDeVisao`, `TarefaFrappe`, Tarefa 10), `compararEtapas`/`porOrdem` (Tarefa 5), `progressoDaEtapa`, `situacaoEtapa`, `resumoDeEtapas`, `resumoDoProjeto` (Tarefa 3), `somarDias`.
- Produces: `Escala = "Dia"|"Semana"|"Mês"|"Ano"`, `ESCALAS`, `MESES`, `MEDIDAS { barra: 22; espaco: 14; cabecalhoSuperior: 28; cabecalhoInferior: 26; cabecalho: 64; linha: 36 }`, `MODOS: ModoDeVisao[]` (como na tela 1), `escalaEditavel(e)` (Dia e Semana), `ehEscala(x)`; `LinhaFase { tipo: "fase"; id: "fase-<id>"; fase; resumo; recolhida; inicio; fim }`, `LinhaEtapa { tipo: "etapa"; id; etapa; situacao; progresso; dependeDe /* só as na tela */ }`, `LinhaProjeto { tipo: "projeto"; id; projeto; vis; resumo; inicio; fim }`, `Linha`, `idLinhaFase(id)`, `OpcoesLinhas { hoje; ordem; recolhidas; visiveis? }`, `linhasDoProjeto({ projeto, fases, etapas }, op): Linha[]`, `linhasDoPortfolio(itens, hoje): LinhaProjeto[]`; `classesDaLinha(l)` (`st-<situacao>`, `st-marco st-<situacao>`, `st-fase [st-vazia]`, `st-proj st-…`), `tarefasDoGantt(linhas): TarefaFrappe[]` (uma tarefa válida por linha). Nos testes: `HOSTIL`, `cenario()`.

- [ ] **Step 1: Escrever as provas**

Cenário comum às provas do Gantt (etapa solta, três fases — uma vazia —, marco, concluída, etapa replanejada e um nome hostil):

`projetos/tests/cenarioGantt.ts`:

```ts
/** Projeto de exemplo do Gantt: etapa solta, 3 fases (uma vazia), marco, concluída e um nome hostil. */

import { etapa, fase } from "./fabrica";

export const HOSTIL = '<img src=x onerror="alert(1)"> & "aspas" ção 🙂';

export function cenario() {
  const fases = [
    fase({ id: "f1", nome: "Instrução", ordem: "a0" }),
    fase({ id: "f2", nome: "Deliberação", ordem: "a1" }),
    fase({ id: "f3", nome: "Vazia", ordem: "a2" }),
  ];
  const etapas = [
    etapa({ id: "solta", nome: "Etapa solta", inicio: "2026-10-01", fim: "2026-10-02" }),
    etapa({
      id: "e1",
      nome: HOSTIL,
      fase: "f1",
      inicio: "2026-09-01",
      fim: "2026-10-02",
      base: { inicio: "2026-09-01", fim: "2026-09-25" },
    }),
    etapa({ id: "e2", nome: "Análise", fase: "f1", inicio: "2026-10-05", fim: "2026-10-09", dependeDe: ["e1"] }),
    etapa({ id: "m1", nome: "Reunião", fase: "f2", marco: true, inicio: "2026-10-20", fim: "2026-10-20", dependeDe: ["e2"] }),
    etapa({ id: "ok", nome: "Feita", fase: "f2", inicio: "2026-09-01", fim: "2026-09-05", concluidaEm: "2026-09-05" }),
  ];
  return { fases, etapas };
}
```

`projetos/tests/verificar-linhas.ts`:

```ts
import { ESCALAS, escalaEditavel, MEDIDAS, MODOS } from "../src/gantt/escalas";
import { idLinhaFase, type Linha, linhasDoPortfolio, linhasDoProjeto } from "../src/gantt/linhas";
import { classesDaLinha, tarefasDoGantt } from "../src/gantt/tarefas";
import { cenario } from "./cenarioGantt";
import { etapa, fase, HOJE, projeto } from "./fabrica";
import { checar, secao } from "./util";

export function verificarLinhas(): void {
  secao("projetos: escalas do Gantt");
  checar("4 escalas em portugues", ESCALAS.join() === "Dia,Semana,Mês,Ano" && MODOS.map((m) => m.name).join() === ESCALAS.join());
  checar(
    "cabecalho 64 e linha 36 (alinham com a lista)",
    MEDIDAS.cabecalho === MEDIDAS.cabecalhoSuperior + MEDIDAS.cabecalhoInferior + 10 && MEDIDAS.linha === MEDIDAS.barra + MEDIDAS.espaco,
  );
  const semana = MODOS[1]!;
  const sup = semana.upper_text as (d: Date, a: Date | null, l: string) => string;
  const inf = semana.lower_text as (d: Date, a: Date | null, l: string) => string;
  checar("semana: texto inferior dd/mm", inf(new Date(2026, 9, 6), null, "pt-BR") === "06/10");
  checar(
    "semana: mes so quando muda",
    sup(new Date(2026, 9, 6), new Date(2026, 8, 29), "pt-BR") === "Outubro" &&
      sup(new Date(2026, 9, 13), new Date(2026, 9, 6), "pt-BR") === "",
  );
  const dia = MODOS[0]!.upper_text as (d: Date, a: Date | null, l: string) => string;
  checar("dia: mes e ano", dia(new Date(2026, 2, 2), null, "pt-BR") === "Março 2026");
  checar(
    "arrastar so em Dia e Semana",
    escalaEditavel("Dia") && escalaEditavel("Semana") && !escalaEditavel("Mês") && !escalaEditavel("Ano"),
  );

  secao("projetos: linhas do projeto e do portfolio");
  const { fases, etapas } = cenario();
  const ids = (ls: Linha[]) => ls.map((l) => l.id).join();
  const base = { hoje: HOJE, ordem: "inicio" as const, recolhidas: new Set<string>() };
  const todas = linhasDoProjeto({ projeto: "p1", fases, etapas }, base);
  checar(
    "soltas primeiro; fases na ordem; fase vazia aparece",
    ids(todas) === `solta,${idLinhaFase("f1")},e1,e2,${idLinhaFase("f2")},ok,m1,${idLinhaFase("f3")}`,
    ids(todas),
  );
  const f1 = todas.find((l) => l.tipo === "fase" && l.fase.id === "f1");
  checar(
    "resumo da fase: feitas/total e datas",
    f1?.tipo === "fase" && f1.resumo.total === 2 && f1.inicio === "2026-09-01" && f1.fim === "2026-10-09",
  );
  const vazia = todas.find((l) => l.tipo === "fase" && l.fase.id === "f3");
  checar("fase vazia tem barra em hoje", vazia?.tipo === "fase" && vazia.inicio === HOJE && vazia.fim === HOJE);
  const recolhida = linhasDoProjeto({ projeto: "p1", fases, etapas }, { ...base, recolhidas: new Set(["f1"]) });
  checar(
    "fase recolhida esconde as etapas",
    ids(recolhida) === `solta,${idLinhaFase("f1")},${idLinhaFase("f2")},ok,m1,${idLinhaFase("f3")}`,
  );
  const m1 = recolhida.find((l) => l.id === "m1");
  checar("dependencia de etapa escondida sai da linha", m1?.tipo === "etapa" && m1.dependeDe.length === 0);
  const filtrada = linhasDoProjeto({ projeto: "p1", fases, etapas }, { ...base, visiveis: new Set(["e2"]) });
  checar("com filtro, fase sem etapa visivel some", ids(filtrada) === `${idLinhaFase("f1")},e2`);
  checar(
    "ordem por nome",
    ids(linhasDoProjeto({ projeto: "p1", fases: [], etapas }, { ...base, ordem: "nome" })).startsWith("e1,e2,solta"),
  );
  checar(
    "removida nao aparece",
    !ids(linhasDoProjeto({ projeto: "p1", fases, etapas: [...etapas, etapa({ id: "x", removidoEm: 1 })] }, base)).includes("x"),
  );
  const outros = linhasDoProjeto(
    { projeto: "p1", fases: [...fases, fase({ id: "fx", projeto: "p2" })], etapas: [...etapas, etapa({ id: "ex", projeto: "p2" })] },
    base,
  );
  checar("fase e etapa de outro projeto nao entram", !ids(outros).includes("fx") && !ids(outros).includes("ex"));
  const port = linhasDoPortfolio(
    [
      { projeto: projeto({ id: "p1" }), vis: "unidade", etapas },
      { projeto: projeto({ id: "p2" }), vis: "eu", etapas: [] },
      { projeto: projeto({ id: "p3", arquivadoEm: 5 }), vis: "eu", etapas: [] },
    ],
    HOJE,
  );
  checar(
    "portfolio: uma linha por projeto ativo, inclusive sem etapas (arquivado fora)",
    port.length === 2 && port[1]?.inicio === HOJE && port[1]?.resumo.situacao === "semEtapas",
  );

  secao("projetos: tarefas da Frappe");
  const t = tarefasDoGantt(todas);
  checar("uma tarefa por linha (alinhamento)", t.length === todas.length);
  const te1 = t.find((x) => x.id === "e1");
  checar("classe por situacao", te1?.custom_class === "st-atrasada");
  checar("classe do marco", t.find((x) => x.id === "m1")?.custom_class === "st-marco st-futura");
  checar("classe da fase vazia", t.find((x) => x.id === idLinhaFase("f3"))?.custom_class === "st-fase st-vazia");
  checar("classe do projeto", classesDaLinha(port[1]!) === "st-proj st-vazia" && classesDaLinha(port[0]!) === "st-proj st-atrasada");
  checar("dependencias como texto", t.find((x) => x.id === "e2")?.dependencies === "e1");
  const torta = tarefasDoGantt(
    linhasDoProjeto(
      {
        projeto: "p1",
        fases: [],
        etapas: [etapa({ id: "t", inicio: "2026-10-09", fim: "2026-10-01" }), etapa({ id: "l", inicio: "2026-01-01", fim: "2040-01-01" })],
      },
      base,
    ),
  );
  checar("termino antes do inicio vira 1 dia (a Frappe descartaria)", torta.find((x) => x.id === "t")?.end === "2026-10-09");
  checar("mais de 10 anos e cortado no desenho", (torta.find((x) => x.id === "l")?.end ?? "") < "2036-01-01");
}
```

Registrar a suíte no agregador (arquivo inteiro):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
import { verificarCalendario } from "./verificar-calendario";
import { verificarDependencias } from "./verificar-dependencias";
import { verificarEscopo } from "./verificar-escopo";
import { verificarEscopos } from "./verificar-escopos";
import { verificarFiltro } from "./verificar-filtro";
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
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/gantt/escalas' imported from …/projetos/tests/verificar-linhas.ts`.

- [ ] **Step 3: Implementar**

Regras: cada linha vira exatamente uma tarefa válida, senão a lista à esquerda desalinha do Gantt (a Frappe descarta tarefa sem data, com término antes do início ou com mais de 10 anos); ids de fase com `fase-` (a Frappe usa o id em seletor CSS: sem `:` nem espaço); dependência para etapa fora da tela sai (Decisão 5); Decisão 8 para a ordem das linhas.

`projetos/src/gantt/escalas.ts`:

```ts
/**
 * Escalas do Gantt em português (Dia, Semana, Mês, Ano), como na tela 1. As
 * medidas (cabeçalho 64 px = 28 + 26 + 10; linha 36 px = 22 + 14) alinham a
 * coluna da lista à esquerda com as linhas do Gantt.
 */

import type { ModoDeVisao } from "../vendor/frappe-gantt/index";

export type Escala = "Dia" | "Semana" | "Mês" | "Ano";

export const ESCALAS: readonly Escala[] = ["Dia", "Semana", "Mês", "Ano"];

export const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const maiuscula = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
const mes = (d: Date): string => maiuscula(MESES[d.getMonth()] ?? "");
const dois = (n: number): string => String(n).padStart(2, "0");

/** Medidas que a coluna da lista (P3) repete para ficar alinhada. */
export const MEDIDAS = {
  barra: 22,
  espaco: 14,
  cabecalhoSuperior: 28,
  cabecalhoInferior: 26,
  /** 28 + 26 + 10 (a Frappe soma 10). */
  cabecalho: 64,
  /** 22 + 14. */
  linha: 36,
} as const;

export const MODOS: ModoDeVisao[] = [
  {
    name: "Dia",
    padding: "7d",
    step: "1d",
    column_width: 28,
    date_format: "YYYY-MM-DD",
    lower_text: (d) => String(d.getDate()),
    upper_text: (d, ant) => (!ant || d.getMonth() !== ant.getMonth() ? `${mes(d)} ${d.getFullYear()}` : ""),
    thick_line: (d) => d.getDay() === 1,
  },
  {
    name: "Semana",
    padding: "14d",
    step: "7d",
    column_width: 64,
    date_format: "YYYY-MM-DD",
    lower_text: (d) => `${dois(d.getDate())}/${dois(d.getMonth() + 1)}`,
    upper_text: (d, ant) => (!ant || d.getMonth() !== ant.getMonth() ? mes(d) : ""),
    thick_line: (d) => d.getDate() <= 7,
    upper_text_frequency: 4,
  },
  {
    name: "Mês",
    padding: "1m",
    step: "1m",
    column_width: 120,
    date_format: "YYYY-MM",
    lower_text: (d) => mes(d),
    upper_text: (d, ant) => (!ant || d.getFullYear() !== ant.getFullYear() ? String(d.getFullYear()) : ""),
    thick_line: (d) => d.getMonth() % 3 === 0,
    snap_at: "1d",
  },
  {
    name: "Ano",
    padding: "1y",
    step: "1y",
    column_width: 160,
    date_format: "YYYY",
    lower_text: (d) => String(d.getFullYear()),
    upper_text: "",
    snap_at: "7d",
  },
];

/**
 * Arrastar só em Dia e Semana: na 1.2.2, em Mês e Ano a biblioteca converte a
 * posição em data com `parseInt` de meses/anos fracionários e devolve o dia 1
 * (prova no experimento do plano P2). Nessas escalas as datas ficam só leitura.
 */
export function escalaEditavel(e: Escala): boolean {
  return e === "Dia" || e === "Semana";
}

export function ehEscala(x: unknown): x is Escala {
  return typeof x === "string" && (ESCALAS as readonly string[]).includes(x);
}
```

`projetos/src/gantt/linhas.ts`:

```ts
/**
 * Linhas da vista do projeto (lista à esquerda + Gantt à direita, uma linha
 * para cada, na mesma ordem) e do portfólio ("Todos": uma linha por projeto).
 * Puro: sem DOM e sem Frappe. Etapas sem fase vêm primeiro, sem cabeçalho;
 * depois cada fase (na ordem manual) com as suas etapas, se não recolhida.
 */

import { compararEtapas, type OrdemEtapas, porOrdem } from "../modelo/operacoes";
import { progressoDaEtapa } from "../modelo/progresso";
import { type ResumoFase, type ResumoProjeto, resumoDeEtapas, resumoDoProjeto } from "../modelo/resumo";
import { type SituacaoEtapa, situacaoEtapa } from "../modelo/situacao";
import type { DataISO, Etapa, Fase, Projeto, Vis } from "../modelo/tipos";

export interface LinhaFase {
  tipo: "fase";
  /** "fase-<id>": a Frappe usa o id em seletor CSS (sem ":" nem espaço). */
  id: string;
  fase: Fase;
  resumo: ResumoFase;
  recolhida: boolean;
  /** Datas da barra-resumo (fase vazia: hoje, e a barra fica invisível). */
  inicio: DataISO;
  fim: DataISO;
}

export interface LinhaEtapa {
  tipo: "etapa";
  id: string;
  etapa: Etapa;
  situacao: SituacaoEtapa;
  progresso: number;
  /** Só as dependências que estão na tela (a Frappe quebra ao arrastar com dependência ausente). */
  dependeDe: string[];
}

export interface LinhaProjeto {
  tipo: "projeto";
  id: string;
  projeto: Projeto;
  vis: Vis;
  resumo: ResumoProjeto;
  inicio: DataISO;
  fim: DataISO;
}

export type Linha = LinhaFase | LinhaEtapa | LinhaProjeto;

export const idLinhaFase = (faseId: string): string => `fase-${faseId}`;

export interface OpcoesLinhas {
  hoje: DataISO;
  ordem: OrdemEtapas;
  /** Ids de fases recolhidas. */
  recolhidas: ReadonlySet<string>;
  /** Ids das etapas que passam no filtro; ausente = todas. Com filtro, fase sem etapa visível some. */
  visiveis?: ReadonlySet<string>;
}

/** Fases e etapas podem vir do escopo inteiro: só as do `projeto` entram. */
export function linhasDoProjeto(dados: { projeto: string; fases: readonly Fase[]; etapas: readonly Etapa[] }, op: OpcoesLinhas): Linha[] {
  const fases = dados.fases.filter((f) => f.removidoEm === undefined && f.projeto === dados.projeto).sort(porOrdem);
  const idsFases = new Set(fases.map((f) => f.id));
  const vivas = dados.etapas.filter((e) => e.removidoEm === undefined && e.projeto === dados.projeto);
  const mostradas = op.visiveis ? vivas.filter((e) => op.visiveis!.has(e.id)) : vivas;
  const ordenar = compararEtapas(op.ordem);
  const linhaEtapa = (e: Etapa, naTela: ReadonlySet<string>): LinhaEtapa => ({
    tipo: "etapa",
    id: e.id,
    etapa: e,
    situacao: situacaoEtapa(e, op.hoje),
    progresso: progressoDaEtapa(e, op.hoje),
    dependeDe: e.dependeDe.filter((d) => naTela.has(d)),
  });
  const soltas = mostradas.filter((e) => !e.fase || !idsFases.has(e.fase)).sort(ordenar);
  const grupos = fases.map((f) => ({
    fase: f,
    todas: vivas.filter((e) => e.fase === f.id),
    mostradas: mostradas.filter((e) => e.fase === f.id).sort(ordenar),
  }));
  const naTela = new Set<string>([
    ...soltas.map((e) => e.id),
    ...grupos.filter((g) => !op.recolhidas.has(g.fase.id)).flatMap((g) => g.mostradas.map((e) => e.id)),
  ]);
  const linhas: Linha[] = soltas.map((e) => linhaEtapa(e, naTela));
  for (const g of grupos) {
    if (op.visiveis && !g.mostradas.length) continue;
    const resumo = resumoDeEtapas(g.todas, op.hoje);
    const recolhida = op.recolhidas.has(g.fase.id);
    linhas.push({
      tipo: "fase",
      id: idLinhaFase(g.fase.id),
      fase: g.fase,
      resumo,
      recolhida,
      inicio: resumo.inicio ?? op.hoje,
      fim: resumo.fim ?? op.hoje,
    });
    if (!recolhida) for (const e of g.mostradas) linhas.push(linhaEtapa(e, naTela));
  }
  return linhas;
}

/**
 * "Todos": uma linha por projeto ativo (arquivado fica no diálogo dos
 * arquivados; projeto sem etapas aparece, com a barra invisível em hoje).
 */
export function linhasDoPortfolio(
  itens: ReadonlyArray<{ projeto: Projeto; vis: Vis; etapas: readonly Etapa[] }>,
  hoje: DataISO,
): LinhaProjeto[] {
  return itens
    .filter((i) => i.projeto.removidoEm === undefined && i.projeto.arquivadoEm === undefined)
    .map((i) => {
      const resumo = resumoDoProjeto(
        i.etapas.filter((e) => e.projeto === i.projeto.id),
        hoje,
      );
      return {
        tipo: "projeto",
        id: i.projeto.id,
        projeto: i.projeto,
        vis: i.vis,
        resumo,
        inicio: resumo.inicio ?? hoje,
        fim: resumo.fim ?? hoje,
      };
    });
}
```

`projetos/src/gantt/tarefas.ts`:

```ts
/**
 * Linhas → tarefas da Frappe. Cada linha vira exatamente UMA tarefa válida,
 * senão a lista à esquerda desalinha do Gantt: a Frappe descarta tarefa sem
 * data, com término antes do início ou com mais de 10 anos.
 */

import { somarDias } from "@comum/datas/dias";
import type { DataISO } from "../modelo/tipos";
import type { TarefaFrappe } from "../vendor/frappe-gantt/index";
import type { Linha } from "./linhas";

/** Teto de desenho (a Frappe recusa mais de 10 anos). */
const TETO_DIAS = 3650;

export function classesDaLinha(l: Linha): string {
  if (l.tipo === "fase") return l.resumo.total ? "st-fase" : "st-fase st-vazia";
  if (l.tipo === "projeto") {
    const s = l.resumo.situacao;
    const st =
      s === "concluido"
        ? "st-concluida"
        : s === "atrasado"
          ? "st-atrasada"
          : s === "andamento"
            ? "st-andamento"
            : s === "aIniciar"
              ? "st-futura"
              : "st-vazia";
    return `st-proj ${st}`;
  }
  return l.etapa.marco ? `st-marco st-${l.situacao}` : `st-${l.situacao}`;
}

function datasDesenhaveis(inicio: DataISO, fim: DataISO): { start: DataISO; end: DataISO } {
  const end = fim < inicio ? inicio : fim;
  const teto = somarDias(inicio, TETO_DIAS);
  return { start: inicio, end: end > teto ? teto : end };
}

export function tarefasDoGantt(linhas: readonly Linha[]): TarefaFrappe[] {
  return linhas.map((l) => {
    if (l.tipo === "etapa") {
      return {
        id: l.id,
        name: l.etapa.nome,
        ...datasDesenhaveis(l.etapa.inicio, l.etapa.fim),
        progress: l.etapa.marco ? 0 : l.progresso,
        dependencies: l.dependeDe.join(","),
        custom_class: classesDaLinha(l),
      };
    }
    const nome = l.tipo === "fase" ? l.fase.nome : l.projeto.nome;
    const progresso = l.resumo.progresso;
    return {
      id: l.id,
      name: nome,
      ...datasDesenhaveis(l.inicio, l.fim),
      progress: progresso,
      dependencies: "",
      custom_class: classesDaLinha(l),
    };
  });
}
```

- [ ] **Step 4: Expor na API pública** (arquivo inteiro)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./gantt/escalas";
export * from "./gantt/linhas";
export * from "./gantt/tarefas";
export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/filtro";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
export * from "./modelo/vinculos";
export * from "./modelos/aplicar";
export * from "./modelos/embutidos";
export * from "./modelos/salvar";
export * from "./repositorio";
```

- [ ] **Step 5: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `344 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/gantt/escalas.ts \
  projetos/src/gantt/linhas.ts \
  projetos/src/gantt/tarefas.ts \
  projetos/tests/cenarioGantt.ts \
  projetos/tests/verificar-linhas.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: escalas, linhas e tarefas do Gantt

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

### Task 12: Gantt — decorações, controlador `montarGantt` e `gantt.css`

**Files:**
- Create: `projetos/src/gantt/decorar.ts`, `projetos/src/gantt/montar.ts`, `projetos/estatico/gantt.css`
- Modify: `projetos/build.mjs` (portão ASCII do CSS), `projetos/src/api.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-gantt.ts`

**Interfaces:**
- Consumes: Frappe ajustada (`Gantt`, `BarraFrappe`, `OpcoesFrappe`, `dateUtils`, Tarefa 10), Tarefa 11 (`Linha`, `MODOS`, `MEDIDAS`, `escalaEditavel`, `tarefasDoGantt`), `replanejada` (Tarefa 4), `meiaNoite`, `dataDe`, `feriadosNoPeriodo` (Tarefa 2), `MudancaDeDatas`.
- Produces: `CLASSE_DECORACAO = "spro-deco"`, `RAIO_MARCO`, `OpcoesDecoracao { mostrarLista }`, `pxPorDia(g)`, `xDaData(g, iso)`, `decorarBarra(g, barra, linha, op)`, `decorar(g, linhas: Map, op)`; `COR_FERIADO`, `OpcoesGantt`, `ControleGantt { readonly escala; readonly gantt; trocarEscala(e); atualizar(linhas); rolarParaHoje(); realcar(id, ligado); destruir() }`, `datasDaBarra(g, barra): { inicio; fim }`, `opcoesFrappe(op, linhas): OpcoesFrappe`, `montarGantt(area: HTMLElement, linhas, op: OpcoesGantt): ControleGantt` (a área ganha a classe `spro-gantt`); CSS `projetos/estatico/gantt.css`.

- [ ] **Step 1: Escrever as provas**

O arraste é simulado pelo caminho da própria Frappe (`mousedown` na barra, `mousemove` e `mouseup` no SVG com `offsetX` à mão); +3 dias na escala Semana usam `3 × 64/7 + 1` px (posição fracionária, Review Focus 3).

`projetos/tests/verificar-gantt.ts`:

```ts
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MODOS } from "../src/gantt/escalas";
import { idLinhaFase, linhasDoProjeto } from "../src/gantt/linhas";
import { COR_FERIADO, montarGantt, opcoesFrappe } from "../src/gantt/montar";
import type { MudancaDeDatas } from "../src/modelo/tipos";
import { area, esperarQuadro, instalarAmbienteGantt } from "./ambienteGantt";
import { cenario, HOSTIL } from "./cenarioGantt";
import { HOJE } from "./fabrica";
import { checar, disparar, secao } from "./util";

export async function verificarGantt(): Promise<void> {
  const { fases, etapas } = cenario();
  const todas = linhasDoProjeto({ projeto: "p1", fases, etapas }, { hoje: HOJE, ordem: "inicio", recolhidas: new Set<string>() });

  secao("projetos: opcoes da Frappe");
  const oDia = opcoesFrappe({ escala: "Dia", hoje: HOJE, moverDependentes: true }, todas);
  const feriados = oDia.holidays?.[COR_FERIADO];
  checar(
    "Dia: fim de semana e feriados com nome",
    oDia.holidays?.["var(--g-weekend-highlight-color)"] === "weekend" &&
      Array.isArray(feriados) &&
      feriados.some((f) => f.date === "2026-10-12" && f.name === "Nossa Senhora Aparecida"),
  );
  const oMes = opcoesFrappe({ escala: "Mês", hoje: HOJE, moverDependentes: false, rolarPara: "2026-09-01" }, todas);
  checar(
    "Mês: sem destaque, datas so leitura, escala pedida",
    Object.keys(oMes.holidays ?? {}).length === 0 && oMes.readonly_dates === true && oMes.view_mode === "Mês",
  );
  checar(
    "popup desligado e progresso so leitura",
    oMes.popup === false && oMes.readonly_progress === true && oMes.move_dependencies === false && oMes.scroll_to === "2026-09-01",
  );
  checar("modos copiados (a Frappe altera o objeto)", oMes.view_modes?.[0] !== MODOS[0]);

  secao("projetos: montar o Gantt (linkedom)");
  const doc = instalarAmbienteGantt();
  const a = area(doc);
  const cliques: string[] = [];
  const mudancas: MudancaDeDatas[][] = [];
  const recusas: string[] = [];
  let recusar: string | null = null;
  const ctl = montarGantt(a, todas, {
    escala: "Semana",
    hoje: HOJE,
    mostrarLista: true,
    moverDependentes: true,
    aoClicar: (id) => cliques.push(id),
    validar: () => recusar,
    aoMudarDatas: (m) => mudancas.push(m),
    aoRecusar: (msg) => recusas.push(msg),
  });
  await esperarQuadro();
  const barras = a.querySelectorAll(".bar-wrapper");
  checar("uma barra por linha", barras.length === todas.length);
  checar("area ganha a classe do gantt.css", a.classList.contains("spro-gantt"));
  checar("escala inicial respeitada", ctl.escala === "Semana" && ctl.gantt?.config.view_mode.name === "Semana");
  const g1 = a.querySelector('.bar-wrapper[data-id="e1"]');
  checar("nome hostil aparece como texto no Gantt", g1?.querySelector(".bar-label")?.textContent === HOSTIL && !a.querySelector("img"));
  checar(
    "linha de base com 'plano original'",
    g1?.querySelector(".spro-base") !== null && g1?.querySelector(".spro-base-txt")?.textContent === "plano original",
  );
  checar("sem replanejamento, sem linha de base", !a.querySelector('.bar-wrapper[data-id="e2"] .spro-base'));
  const gm = a.querySelector('.bar-wrapper[data-id="m1"]');
  checar("marco em losango", gm?.querySelector("path.spro-marco") !== null && gm?.classList.contains("st-marco") === true);
  const gf = a.querySelector(`.bar-wrapper[data-id="${idLinhaFase("f1")}"]`);
  checar(
    "fase fina (5 px) e sem rotulo com a lista",
    gf?.querySelector(".bar")?.getAttribute("height") === "5" && gf?.querySelector(".bar-label")?.getAttribute("display") === "none",
  );
  checar(
    "decorar de novo nao duplica",
    (() => {
      ctl.atualizar(todas);
      return a.querySelectorAll('.bar-wrapper[data-id="m1"] .spro-marco').length === 1;
    })(),
  );
  await esperarQuadro();
  ctl.realcar("e2", true);
  checar("realcar liga a classe", a.querySelector('.bar-wrapper[data-id="e2"]')?.classList.contains("realce") === true);
  disparar(a.querySelector('.bar-wrapper[data-id="e2"]')!, "click");
  disparar(a.querySelector(`.bar-wrapper[data-id="${idLinhaFase("f1")}"]`)!, "click");
  checar("clique em etapa avisa; em fase nao", cliques.join() === "e2");

  // Arraste pelo caminho da Frappe: mousedown na barra, mousemove e mouseup no SVG (offsetX à mão).
  const evento = (tipo: string, offsetX: number): Event => {
    const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
    const ev = new Ev(tipo, { bubbles: true });
    Object.defineProperty(ev, "offsetX", { value: offsetX });
    return ev;
  };
  const arrastar = (id: string, dx: number): void => {
    a.querySelector(`.bar-wrapper[data-id="${id}"]`)!.dispatchEvent(evento("mousedown", 100));
    const svg = a.querySelector("svg.gantt")!;
    svg.dispatchEvent(evento("mousemove", 100 + dx));
    svg.dispatchEvent(evento("mouseup", 100 + dx));
  };
  const umDia = (ctl.gantt?.config.column_width ?? 64) / 7;
  arrastar("e2", 3 * umDia + 1);
  const lote = mudancas[0] ?? [];
  checar(
    "arraste: e2 +3 dias corridos e o marco dependente junto",
    lote.map((m) => `${m.id}:${m.inicio}:${m.fim}`).join() === "e2:2026-10-08:2026-10-12,m1:2026-10-23:2026-10-23",
    lote,
  );
  disparar(a.querySelector('.bar-wrapper[data-id="e2"]')!, "click");
  checar("clique logo depois do arraste e ignorado", cliques.join() === "e2");
  // O app grava e redesenha; aqui as linhas continuam as de antes (como se a gravação tivesse falhado).
  ctl.atualizar(todas);
  recusar = "“Análise” não pode começar antes de “Nota”.";
  const xAntes = ctl.gantt?.get_bar("e2")?.$bar.getAttribute("x");
  arrastar("e2", 7 * umDia + 1);
  checar(
    "recusa: avisa e redesenha como estava",
    recusas.join() === recusar && mudancas.length === 1 && ctl.gantt?.get_bar("e2")?.$bar.getAttribute("x") === xAntes,
  );
  disparar(doc.documentElement, "mouseup");
  checar("soltar sem arraste nao faz nada", mudancas.length === 1 && recusas.length === 1);

  ctl.trocarEscala("Mês");
  checar("trocar escala: Mês e datas so leitura", ctl.gantt?.config.view_mode.name === "Mês" && ctl.gantt?.options.readonly_dates === true);
  ctl.trocarEscala("Dia");
  checar("Dia destaca feriado", !!a.querySelector(".holiday-highlight"));
  ctl.rolarParaHoje();
  ctl.destruir();
  checar("destruir esvazia a area", a.children.length === 0 && ctl.gantt === null);

  secao("projetos: gantt.css");
  const css = await readFile(resolve(dirname(fileURLToPath(import.meta.url)), "../estatico/gantt.css"), "utf8");
  checar("traz o CSS da Frappe", css.includes(".gantt-container {") && css.includes(".gantt .bar-label {"));
  checar(
    "traz as regras do SEI Pro",
    [
      ".spro-gantt .gantt-container {",
      ".st-atrasada .bar",
      ".st-vazia .bar",
      ".spro-marco",
      ".spro-base-txt",
      ".bar-wrapper.realce .bar",
    ].every((s) => css.includes(s)),
  );
  checar(
    "cores so por tokens --spro-* nas regras do SEI Pro",
    !css.slice(css.indexOf("SEI Pro: Frappe nas cores")).match(/#[0-9a-f]{3,6}\b/i),
  );
  checar("sem @import e so ASCII", !css.includes("@import") && [...css].every((ch) => ch.charCodeAt(0) <= 0x7f));

  secao("projetos: falha da Frappe");
  const outra = doc.createElement("div");
  const original = (globalThis as Record<string, unknown>).HTMLElement;
  (globalThis as Record<string, unknown>).HTMLElement = class {};
  let falha: unknown = null;
  const quebrado = montarGantt(outra, todas, {
    escala: "Semana",
    hoje: HOJE,
    mostrarLista: true,
    moverDependentes: true,
    aoFalhar: (e) => (falha = e),
  });
  (globalThis as Record<string, unknown>).HTMLElement = original;
  checar(
    "excecao ao montar chama aoFalhar e deixa a area vazia",
    falha instanceof Error && outra.children.length === 0 && quebrado.gantt === null,
  );
  checar(
    "sem aoFalhar a excecao sobe",
    (() => {
      (globalThis as Record<string, unknown>).HTMLElement = class {};
      try {
        montarGantt(doc.createElement("div"), todas, { escala: "Semana", hoje: HOJE, mostrarLista: true, moverDependentes: true });
        return false;
      } catch {
        return true;
      } finally {
        (globalThis as Record<string, unknown>).HTMLElement = original;
      }
    })(),
  );
  const vazio = montarGantt(doc.createElement("div"), [], { escala: "Semana", hoje: HOJE, mostrarLista: false, moverDependentes: true });
  checar("projeto sem linhas monta sem erro", vazio.gantt !== null);
  vazio.destruir();
}
```

Registrar a suíte no agregador (arquivo inteiro, versão final):

`projetos/tests/verificar.ts`:

```ts
import "./fuso";
import { resumo } from "./util";
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
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts
```

Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/gantt/montar' imported from …/projetos/tests/verificar-gantt.ts`.

- [ ] **Step 3: Implementar as decorações**

Desenhadas no gancho `after_render` (ajuste 4): sem barra, todas; com barra, só ela (depois de cada `update_label_position`, que a Frappe chama num `requestAnimationFrame` e a cada passo do arraste — por isso o rótulo do marco e da fase é reposicionado aqui). Idempotente: apaga a decoração anterior da barra. Posições pela mesma conta da Frappe (`date_utils.diff` e `convert_scales`).

`projetos/src/gantt/decorar.ts`:

```ts
/**
 * Decorações por cima da Frappe, desenhadas no gancho `after_render` (ajuste 4):
 * marco em losango, fase como barra-resumo fina (rótulo acima quando a lista
 * está escondida) e linha de base (traço cinza fino sob a barra com "plano
 * original") quando a etapa foi replanejada. Tudo por `createElementNS` e
 * `textContent`; cada chamada apaga a decoração anterior da barra (idempotente).
 */

import { diferencaDias } from "@comum/datas/dias";
import { meiaNoite } from "../modelo/calendario";
import { replanejada } from "../modelo/linhaDeBase";
import type { DataISO } from "../modelo/tipos";
import dateUtils from "../vendor/frappe-gantt/date_utils";
import type Gantt from "../vendor/frappe-gantt/index";
import type { BarraFrappe } from "../vendor/frappe-gantt/index";
import type { Linha } from "./linhas";

const NS = "http://www.w3.org/2000/svg";
export const CLASSE_DECORACAO = "spro-deco";
/** Meia diagonal do losango do marco, em px. */
export const RAIO_MARCO = 9;

export interface OpcoesDecoracao {
  /** Com a lista à esquerda, o rótulo da fase sai do Gantt (a lista já mostra). */
  mostrarLista: boolean;
}

/** Largura de um dia na escala atual (mês = 30 dias e ano = 365, como a Frappe mede as barras). */
export function pxPorDia(g: Gantt): number {
  return g.config.column_width / dateUtils.convert_scales(g.config.view_mode.step, "day");
}

/** Posição horizontal de um dia, pela mesma conta que a Frappe usa para o início das barras. */
export function xDaData(g: Gantt, iso: DataISO): number {
  return (dateUtils.diff(meiaNoite(iso), g.gantt_start, g.config.unit) / g.config.step) * g.config.column_width;
}

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

const numero = (el: Element, attr: string): number => Number(el.getAttribute(attr)) || 0;

export function decorarBarra(g: Gantt, barra: BarraFrappe, linha: Linha | undefined, op: OpcoesDecoracao): void {
  for (const velho of [...barra.group.querySelectorAll(`.${CLASSE_DECORACAO}`)]) velho.remove();
  if (!linha) return;
  const x = numero(barra.$bar, "x");
  const largura = numero(barra.$bar, "width");
  const { y, height: altura } = barra;
  const rotulo = barra.group.querySelector<SVGTextElement>(".bar-label");

  if (linha.tipo === "fase") {
    for (const r of [barra.$bar, barra.$bar_progress]) {
      if (!r) continue;
      r.setAttribute("y", String(y + altura / 2 + 2));
      r.setAttribute("height", "5");
      r.setAttribute("rx", "2.5");
      r.setAttribute("ry", "2.5");
    }
    if (rotulo) {
      if (op.mostrarLista) rotulo.setAttribute("display", "none");
      else {
        rotulo.removeAttribute("display");
        rotulo.classList.add("big");
        rotulo.setAttribute("x", String(x + 2));
        rotulo.setAttribute("y", String(y + altura / 2 - 6));
      }
    }
    return;
  }

  if (linha.tipo !== "etapa") return;
  const e = linha.etapa;
  if (e.marco) {
    const cx = x + largura / 2;
    const cy = y + altura / 2;
    const s = RAIO_MARCO;
    const losango = svg("path", {
      class: `${CLASSE_DECORACAO} spro-marco`,
      d: `M${cx} ${cy - s}L${cx + s} ${cy}L${cx} ${cy + s}L${cx - s} ${cy}Z`,
    });
    barra.group.insertBefore(losango, barra.group.firstChild);
    if (rotulo) {
      rotulo.classList.add("big");
      rotulo.setAttribute("x", String(cx + s + 6));
    }
  }
  if (e.base && replanejada(e)) {
    const xb = xDaData(g, e.base.inicio);
    const wb = (diferencaDias(e.base.inicio, e.base.fim) + 1) * pxPorDia(g);
    barra.group.append(
      svg("rect", { class: `${CLASSE_DECORACAO} spro-base`, x: xb, y: y + altura + 2, width: wb, height: 3, rx: 1.5, ry: 1.5 }),
    );
    const texto = svg("text", { class: `${CLASSE_DECORACAO} spro-base-txt`, x: xb + wb + 4, y: y + altura + 3.5 });
    texto.textContent = "plano original";
    barra.group.append(texto);
  }
}

export function decorar(g: Gantt, linhas: ReadonlyMap<string, Linha>, op: OpcoesDecoracao): void {
  for (const b of g.bars) decorarBarra(g, b, linhas.get(b.task.id), op);
}
```

- [ ] **Step 4: Implementar o controlador**

Decisões 3 e 4: `readonly_dates` fora de Dia/Semana; `on_date_change` só marca "pendente"; no `mouseup` do documento as datas de todas as barras de etapa são lidas da posição (dias inteiros) e comparadas com as linhas; `validar` recusa → redesenha como estava e chama `aoRecusar`; clique até 400 ms depois de um arraste é ignorado; `atualizar` mantém a rolagem; `destruir` tira o ouvinte do documento. Feriados (com nome) e fim de semana destacados só na escala Dia; cópia de `MODOS` a cada montagem (a Frappe altera o objeto do modo).

`projetos/src/gantt/montar.ts`:

```ts
/**
 * Monta a Frappe Gantt (ajustada) numa área e devolve um controlador. O app
 * (P3) só fala com este módulo: escala, linhas, rolar para hoje, realce,
 * clique e mudança de datas. Arraste: a Frappe avisa `on_date_change` a cada
 * passo do mouse; aqui só se marca "pendente" e, ao soltar o botão, as datas
 * de TODAS as barras de etapa são relidas da posição (em dias inteiros) e
 * comparadas com as linhas. Recusa (`validar`) redesenha como estava.
 */

import { somarDias } from "@comum/datas/dias";
import { dataDe, feriadosNoPeriodo } from "../modelo/calendario";
import type { DataISO, MudancaDeDatas } from "../modelo/tipos";
import Gantt, { type BarraFrappe, type OpcoesFrappe } from "../vendor/frappe-gantt/index";
import { decorar, decorarBarra, pxPorDia } from "./decorar";
import { type Escala, escalaEditavel, MEDIDAS, MODOS } from "./escalas";
import type { Linha } from "./linhas";
import { tarefasDoGantt } from "./tarefas";

export const COR_FERIADO = "color-mix(in srgb, var(--spro-aviso) 14%, var(--spro-fundo))";
/** Clique logo depois de soltar um arraste é o fim do arraste, não um pedido de balão. */
const PAUSA_CLIQUE_MS = 400;

export interface OpcoesGantt {
  escala: Escala;
  hoje: DataISO;
  /** Com a lista à esquerda, a fase não repete o nome no Gantt. */
  mostrarLista: boolean;
  /** Preferência "Mover dependentes ao arrastar" (spec 5.4). */
  moverDependentes: boolean;
  /** Portfólio e impressão: sem arrastar nem redimensionar. */
  somenteLeitura?: boolean;
  /** Dia que aparece à esquerda ao montar; padrão: hoje. */
  rolarPara?: DataISO;
  /** Clique numa etapa ou projeto (fase não chama). `ancora` = o grupo SVG da barra. */
  aoClicar?: (id: string, ancora: Element) => void;
  /** Mensagem para recusar o arraste (o Gantt volta como estava); null aceita. */
  validar?: (mudancas: MudancaDeDatas[]) => string | null;
  aoMudarDatas?: (mudancas: MudancaDeDatas[]) => void;
  aoRecusar?: (mensagem: string) => void;
  /** Exceção da Frappe ao montar (spec 9: o app cai para a vista Lista). Sem ela, a exceção sobe. */
  aoFalhar?: (erro: unknown) => void;
}

export interface ControleGantt {
  readonly escala: Escala;
  /** A instância da Frappe (null depois de falhar ou destruir). */
  readonly gantt: Gantt | null;
  trocarEscala(e: Escala): void;
  /** Redesenha com linhas novas, mantendo a rolagem horizontal. */
  atualizar(linhas: readonly Linha[]): void;
  rolarParaHoje(): void;
  realcar(id: string, ligado: boolean): void;
  destruir(): void;
}

/** Datas de uma barra pela posição, em dias inteiros (só Dia e Semana; lá 1 coluna = 1 ou 7 dias). */
export function datasDaBarra(g: Gantt, barra: BarraFrappe): { inicio: DataISO; fim: DataISO } {
  const px = pxPorDia(g);
  const x = Number(barra.$bar.getAttribute("x")) || 0;
  const largura = Number(barra.$bar.getAttribute("width")) || px;
  const inicio = somarDias(dataDe(g.gantt_start), Math.round(x / px));
  return { inicio, fim: somarDias(inicio, Math.max(1, Math.round(largura / px)) - 1) };
}

function intervalo(linhas: readonly Linha[], hoje: DataISO): { inicio: DataISO; fim: DataISO } {
  let inicio = hoje;
  let fim = hoje;
  for (const l of linhas) {
    const i = l.tipo === "etapa" ? l.etapa.inicio : l.inicio;
    const f = l.tipo === "etapa" ? l.etapa.fim : l.fim;
    if (i < inicio) inicio = i;
    if (f > fim) fim = f;
  }
  return { inicio, fim };
}

/** Opções fixas da Frappe para o SEI Pro (exportada para as provas). */
export function opcoesFrappe(
  op: Pick<OpcoesGantt, "escala" | "hoje" | "moverDependentes" | "somenteLeitura" | "rolarPara">,
  linhas: readonly Linha[],
): OpcoesFrappe {
  const { inicio, fim } = intervalo(linhas, op.hoje);
  const feriados =
    op.escala === "Dia" ? feriadosNoPeriodo(somarDias(inicio, -31), somarDias(fim, 31)).map((f) => ({ date: f.data, name: f.nome })) : [];
  return {
    language: "pt-BR",
    // Cópia: a Frappe altera o objeto do modo (padding vira par, texto vazio vira função).
    view_modes: MODOS.map((m) => ({ ...m })),
    view_mode: op.escala,
    bar_height: MEDIDAS.barra,
    padding: MEDIDAS.espaco,
    upper_header_height: MEDIDAS.cabecalhoSuperior,
    lower_header_height: MEDIDAS.cabecalhoInferior,
    bar_corner_radius: 5,
    arrow_curve: 6,
    container_height: "auto",
    today_button: false,
    view_mode_select: false,
    popup: false,
    readonly: !!op.somenteLeitura,
    readonly_dates: !escalaEditavel(op.escala),
    readonly_progress: true,
    move_dependencies: op.moverDependentes,
    infinite_padding: false,
    lines: "both",
    scroll_to: op.rolarPara ?? op.hoje,
    holidays: op.escala === "Dia" ? { "var(--g-weekend-highlight-color)": "weekend", [COR_FERIADO]: feriados } : {},
  };
}

export function montarGantt(area: HTMLElement, linhas: readonly Linha[], op: OpcoesGantt): ControleGantt {
  let escala = op.escala;
  let atuais: readonly Linha[] = linhas;
  let mapa = new Map(atuais.map((l) => [l.id, l]));
  let gantt: Gantt | null = null;
  let pendente = false;
  let ultimoArraste = 0;
  const doc = area.ownerDocument;
  const dec = { mostrarLista: op.mostrarLista };

  const confirmar = (g: Gantt): void => {
    const mudancas: MudancaDeDatas[] = [];
    for (const b of g.bars) {
      const l = mapa.get(b.task.id);
      if (l?.tipo !== "etapa") continue;
      const d = datasDaBarra(g, b);
      const fim = l.etapa.marco ? d.inicio : d.fim;
      if (d.inicio !== l.etapa.inicio || fim !== l.etapa.fim) mudancas.push({ id: l.id, inicio: d.inicio, fim });
    }
    ultimoArraste = Date.now();
    if (!mudancas.length) {
      desenhar(true);
      return;
    }
    const recusa = op.validar?.(mudancas) ?? null;
    if (recusa) {
      desenhar(true);
      op.aoRecusar?.(recusa);
      return;
    }
    op.aoMudarDatas?.(mudancas);
  };

  const aoSoltar = (): void => {
    if (!pendente || !gantt) return;
    pendente = false;
    confirmar(gantt);
  };

  function desenhar(manterRolagem: boolean): void {
    const rolagem = manterRolagem ? gantt?.$container.scrollLeft : undefined;
    gantt?.destroy();
    gantt = null;
    area.replaceChildren();
    try {
      gantt = new Gantt(area, tarefasDoGantt(atuais), {
        ...opcoesFrappe({ ...op, escala }, atuais),
        on_click: (t) => {
          if (Date.now() - ultimoArraste < PAUSA_CLIQUE_MS) return;
          const l = mapa.get(t.id);
          if (!l || l.tipo === "fase") return;
          op.aoClicar?.(t.id, gantt?.get_bar(t.id)?.group ?? area);
        },
        on_date_change: () => {
          pendente = true;
        },
        after_render: (g, barra) => (barra ? decorarBarra(g, barra, mapa.get(barra.task.id), dec) : decorar(g, mapa, dec)),
      });
      if (rolagem !== undefined) gantt.$container.scrollLeft = rolagem;
    } catch (erro) {
      gantt = null;
      area.replaceChildren();
      if (!op.aoFalhar) throw erro;
      op.aoFalhar(erro);
    }
  }

  // Escopo do gantt.css (tokens --spro-* e classes de situação).
  area.classList.add("spro-gantt");
  doc.addEventListener("mouseup", aoSoltar);
  desenhar(false);

  return {
    get escala() {
      return escala;
    },
    get gantt() {
      return gantt;
    },
    trocarEscala(e) {
      if (e === escala) return;
      escala = e;
      desenhar(false);
    },
    atualizar(novas) {
      atuais = novas;
      mapa = new Map(atuais.map((l) => [l.id, l]));
      desenhar(true);
    },
    rolarParaHoje() {
      gantt?.scroll_current();
    },
    realcar(id, ligado) {
      gantt?.get_bar(id)?.group.classList.toggle("realce", ligado);
    },
    destruir() {
      doc.removeEventListener("mouseup", aoSoltar);
      gantt?.destroy();
      gantt = null;
      area.replaceChildren();
    },
  };
}
```

- [ ] **Step 5: CSS do Gantt** (a parte da Frappe vem do `dist/frappe-gantt.css` do pacote baixado na Tarefa 10, formatada pelo esbuild; se a pasta `$D` sumiu, repita o Step 1 da Tarefa 10)

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && D="${TMPDIR:-/tmp}/seipro-frappe-1.2.2" && test -f "$D/package/dist/frappe-gantt.css" && mkdir -p estatico \
  && { printf '%s\n' "/*" " * Frappe Gantt 1.2.2 (MIT, https://github.com/frappe/gantt): dist/frappe-gantt.css do pacote npm," " * formatado pelo esbuild. Ajustes do SEI Pro (tokens --spro-*, situacoes, marco, base) no fim." " */"; \
       npx esbuild "$D/package/dist/frappe-gantt.css" --loader:.css=css --log-level=error; } > estatico/gantt.css \
  && wc -l estatico/gantt.css
```

Expected: `342 estatico/gantt.css`. Depois acrescente as regras do SEI Pro (só tokens `--spro-*`, cores por situação da spec 3.4, fase fina, marco, linha de base, realce; escopo `.spro-gantt`, a classe que `montarGantt` põe na área):

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && cat >> estatico/gantt.css <<'EOF'

/* ---------- SEI Pro: Frappe nas cores e na fonte do SEI Pro (spec 3.4) ---------- */
.spro-gantt .gantt-container {
  --g-arrow-color: var(--spro-fraco);
  --g-bar-color: var(--spro-fundo-3);
  --g-bar-border: transparent;
  --g-tick-color-thick: var(--spro-borda-forte);
  --g-tick-color: var(--spro-borda);
  --g-border-color: color-mix(in srgb, var(--spro-borda) 60%, transparent);
  --g-text-muted: var(--spro-suave);
  --g-text-light: var(--spro-destaque-texto);
  --g-text-dark: var(--spro-texto);
  --g-progress-color: var(--spro-borda-forte);
  --g-header-background: var(--spro-fundo);
  --g-row-color: var(--spro-fundo);
  --g-row-border-color: var(--spro-borda);
  --g-today-highlight: var(--spro-destaque);
  --g-weekend-highlight-color: var(--spro-fundo-2);
  --g-weekend-label-color: var(--spro-fundo-3);
  --g-actions-background: var(--spro-fundo-3);
  --g-handle-color: var(--spro-suave);
  font-family: var(--spro-fonte);
  border-radius: 0;
}
.spro-gantt .gantt .bar-label {
  font-family: var(--spro-fonte);
  font-size: 12px;
  font-weight: 500;
}
.spro-gantt .gantt .bar-wrapper .bar {
  outline: none;
}
.spro-gantt .gantt-container .upper-text {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--spro-texto);
}
.spro-gantt .gantt-container .lower-text {
  color: var(--spro-suave);
  font-size: 11.5px;
}

/* Situacao da etapa: em andamento = destaque, atrasada = perigo, concluida = ok, a iniciar = fundo-3 */
.spro-gantt .gantt .bar-wrapper.st-andamento .bar {
  fill: color-mix(in srgb, var(--spro-destaque) 16%, var(--spro-fundo));
}
.spro-gantt .gantt .bar-wrapper.st-andamento .bar-progress {
  fill: color-mix(in srgb, var(--spro-destaque) 45%, var(--spro-fundo));
}
.spro-gantt .gantt .bar-wrapper.st-atrasada .bar {
  fill: color-mix(in srgb, var(--spro-perigo) 15%, var(--spro-fundo));
}
.spro-gantt .gantt .bar-wrapper.st-atrasada .bar-progress {
  fill: color-mix(in srgb, var(--spro-perigo) 42%, var(--spro-fundo));
}
.spro-gantt .gantt .bar-wrapper.st-concluida .bar {
  fill: color-mix(in srgb, var(--spro-ok) 16%, var(--spro-fundo));
}
.spro-gantt .gantt .bar-wrapper.st-concluida .bar-progress {
  fill: color-mix(in srgb, var(--spro-ok) 40%, var(--spro-fundo));
}
.spro-gantt .gantt .bar-wrapper.st-futura .bar {
  fill: var(--spro-fundo-3);
}

/* Fase: barra-resumo fina, sem clique nem alca */
.spro-gantt .gantt .bar-wrapper.st-fase {
  pointer-events: none;
}
.spro-gantt .gantt .bar-wrapper.st-fase .bar {
  fill: var(--spro-borda-forte);
}
.spro-gantt .gantt .bar-wrapper.st-fase .bar-progress {
  fill: var(--spro-suave);
}
.spro-gantt .gantt .bar-wrapper.st-fase .bar-label {
  fill: var(--spro-suave);
  font-weight: 700;
  font-size: 10.5px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Fase vazia e projeto sem etapas: a linha existe (alinhamento), a barra nao aparece */
.spro-gantt .gantt .bar-wrapper.st-vazia .bar,
.spro-gantt .gantt .bar-wrapper.st-vazia .bar-progress {
  opacity: 0;
}

/* Marco: losango (novidade; cumprido = ok; atrasado = perigo), sem redimensionar */
.spro-gantt .gantt .bar-wrapper.st-marco .bar,
.spro-gantt .gantt .bar-wrapper.st-marco .bar-progress {
  opacity: 0;
}
.spro-gantt .gantt .bar-wrapper.st-marco .bar-label {
  fill: var(--spro-texto);
}
.spro-gantt .gantt .bar-wrapper.st-marco .handle,
.spro-gantt .gantt .bar-wrapper.st-fase .handle,
.spro-gantt .gantt .bar-wrapper.st-proj .handle {
  display: none;
}
.spro-gantt .gantt .spro-marco {
  fill: var(--spro-novidade);
  stroke: var(--spro-fundo);
  stroke-width: 1.5;
}
.spro-gantt .gantt .st-concluida .spro-marco {
  fill: var(--spro-ok);
}
.spro-gantt .gantt .st-atrasada .spro-marco {
  fill: var(--spro-perigo);
}

/* Linha de base: traco cinza fino sob a barra, com "plano original" */
.spro-gantt .gantt .spro-base {
  fill: var(--spro-fraco);
  opacity: 0.75;
}
.spro-gantt .gantt .spro-base-txt {
  fill: var(--spro-fraco);
  font-size: 9.5px;
  dominant-baseline: central;
  font-family: var(--spro-fonte);
}

/* Realce ao passar o mouse na linha da lista; projeto no portfolio */
.spro-gantt .gantt .bar-wrapper.realce .bar {
  stroke: var(--spro-destaque);
  stroke-width: 2;
}
.spro-gantt .gantt .bar-wrapper.st-proj .bar-label {
  font-weight: 600;
}
EOF
wc -l estatico/gantt.css
```

Expected: `476 estatico/gantt.css`.

- [ ] **Step 6: Portão ASCII do CSS no build** (arquivo inteiro, versão final do P2)

`projetos/build.mjs`:

```js
#!/usr/bin/env node
/**
 * Build do Projetos.
 *
 * Fase P2 (nucleo): nada vai para dist/. O manifest ainda nao conhece o modulo e um arquivo
 * gerado sem uso confundiria a revisao. O build empacota EM MEMORIA a API publica
 * (src/api.ts: modelo, repositorio, modelos, wrapper do Gantt e a Frappe ajustada) e roda
 * os portoes sobre o resultado:
 *   - JS so ASCII (regra do projeto para JS da extensao; o esbuild ja escapa, o portao confere);
 *   - sem innerHTML/outerHTML/insertAdjacentHTML nem acao em atributo on* (DOM seguro);
 *   - estatico/gantt.css so ASCII.
 * O P3 troca ENTRADAS pelas saidas reais (dist/js/init_projetos.js, dist/js/projetos/app.js,
 * dist/html/projetos.html, dist/css/projetos.css) e passa a gravar em dist/.
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const AQUI = dirname(fileURLToPath(import.meta.url));

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

const ENTRADAS = [{ nome: "api (verificacao P2)", entrada: "src/api.ts", formato: "esm", saida: ".verificacao/api.js" }];

const PROIBIDO = /innerHTML|outerHTML|insertAdjacentHTML/;
// on<evento>=" dentro de literal, como tools/check-dom-injection.mjs ("el.onclick = fn" nao casa).
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;

let falhou = false;
const erro = (m) => {
  console.error(`ERRO: ${m}`);
  falhou = true;
};

console.log("\nProjetos -- build (P2: verificacao em memoria; nada vai para dist/)");
for (const { nome, entrada, formato, saida } of ENTRADAS) {
  const r = await build({ ...comum, entryPoints: [resolve(AQUI, entrada)], format: formato, write: false, outfile: resolve(AQUI, saida) });
  for (const f of r.outputFiles) {
    const i = f.contents.findIndex((b) => b > 0x7f);
    if (i >= 0) erro(`byte nao-ASCII em ${nome} (posicao ${i}): ${Buffer.from(f.contents.subarray(Math.max(0, i - 40), i + 10)).toString("utf8")}`);
    if (PROIBIDO.test(f.text)) erro(`${nome}: innerHTML/outerHTML/insertAdjacentHTML no pacote`);
    if (HANDLER.test(f.text)) erro(`${nome}: acao em atributo on* no pacote`);
    console.log(`  ${nome.padEnd(26)} ${Math.round(f.contents.length / 1024)} KB (em memoria)`);
  }
}

const css = await readFile(resolve(AQUI, "estatico/gantt.css"));
const j = css.findIndex((b) => b > 0x7f);
if (j >= 0) erro(`byte nao-ASCII em estatico/gantt.css (posicao ${j})`);
console.log(`  ${"estatico/gantt.css".padEnd(26)} ${Math.round(css.length / 1024)} KB`);

if (falhou) process.exit(1);
console.log("  portoes: ASCII e DOM seguro ok");
```

- [ ] **Step 7: Expor na API pública** (arquivo inteiro, versão final do P2)

`projetos/src/api.ts`:

```ts
/**
 * API pública do núcleo do gestor de projetos (fase P2). É a entrada do build
 * de verificação (`build.mjs`) e o índice do que o app (P3), a sincronia (P4)
 * e a integração com o SEI e o Agente (P5) consomem. Os módulos importam uns
 * aos outros pelo caminho; este arquivo só junta tudo.
 */

export * from "./gantt/decorar";
export * from "./gantt/escalas";
export * from "./gantt/linhas";
export * from "./gantt/montar";
export * from "./gantt/tarefas";
export * from "./modelo/alertas";
export * from "./modelo/calendario";
export * from "./modelo/constantes";
export * from "./modelo/dependencias";
export * from "./modelo/escopo";
export * from "./modelo/filtro";
export * from "./modelo/historico";
export * from "./modelo/linhaDeBase";
export * from "./modelo/operacoes";
export * from "./modelo/progresso";
export * from "./modelo/resumo";
export * from "./modelo/situacao";
export type * from "./modelo/tipos";
export * from "./modelo/validacao";
export * from "./modelo/vinculos";
export * from "./modelos/aplicar";
export * from "./modelos/embutidos";
export * from "./modelos/salvar";
export * from "./repositorio";
```

- [ ] **Step 8: Rodar as provas e os portões**

Run:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts | tail -2 && npx tsc --noEmit && npx biome check src tests && node build.mjs
```

Expected: a suíte termina com `373 ok, 0 falha(s)`; `tsc` sem saída; Biome com `No fixes applied.` e sem erro; o build imprime `api (verificacao P2)` com o tamanho (cerca de 93 KB), `estatico/gantt.css` (12 KB) e `portoes: ASCII e DOM seguro ok`. Se o Biome acusar só formatação, rode `npx biome check --write src tests` e repita.

- [ ] **Step 9: Conferir que nada fora de `projetos/` mudou e que o fuso não importa**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git status --short && node tools/check-dom-injection.mjs > /dev/null && echo dom-ok \
  && cd projetos && TZ=UTC npx tsx tests/verificar.ts | tail -2 && TZ=Asia/Tokyo npx tsx tests/verificar.ts | tail -2
```

Expected: `git status` só com os arquivos desta tarefa em `projetos/` (e, se ainda não versionados, os planos em `docs/superpowers/plans/`) — nada em `dist/`, `sei-comum/`, `sei-nucleo/`, `favoritos/`, `historico/`, `agente-ia/`; `dom-ok`; e `373 ok, 0 falha(s)` nos dois fusos (o `tests/fuso.ts` força Brasília).

- [ ] **Step 10: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/gantt/decorar.ts \
  projetos/src/gantt/montar.ts \
  projetos/estatico/gantt.css \
  projetos/build.mjs \
  projetos/tests/verificar-gantt.ts \
  projetos/src/api.ts \
  projetos/tests/verificar.ts \
  && git commit -m "$(cat <<'EOF'
Projetos: wrapper do Gantt (decoracao, controlador) e gantt.css

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

## Auto-revisão (feita ao escrever o plano)

**1. Cobertura da spec.**

| Spec | Onde |
|---|---|
| 4.1 pacote: `package.json`, `build.mjs` com portão ASCII, `tsconfig.json` com `@comum/*`, `@nucleo/*`, `@projetos/*` e `noUncheckedIndexedAccess`, `biome.json` ignorando `src/vendor/`, `tests/` com tsx + linkedom, `estatico/gantt.css` | Tarefas 1, 10, 12 (`projetos.html`, `projetos.css` e as saídas reais em `dist/` são do P3) |
| 5.1 escopo e chaves (`p`, `f`, `e`, `h`, `m`, `meta`, demais chaves) | Tarefa 1 (`escopo.ts`, `constantes.ts`), Tarefa 7 (coleções, `registrar`) |
| 5.2 entidades, `Versionada` + `alteradoPor`, ordem fracionária | Tarefa 1 (tipos), Tarefa 5 (`editar` grava `alteradoPor`), Tarefas 7 e 9 (`indiceEntre`, `indicesEntre`) |
| 5.3 situação, progresso, resumo de projeto e de fase, alertas, dias úteis | Tarefas 2 e 3 |
| 5.4 linha de base | Tarefa 4; Tarefa 7 (`editarEtapa`, `moverDatas`, `redefinirPlanoOriginal`) |
| 5.4 dependências: só no projeto, sem ciclo (mensagem com nomes), mover dependentes | Tarefas 4, 7, 11, 12 |
| 5.4 marco (`fim = inicio`, arrasta e não redimensiona) | Tarefa 5 (`novaEtapa`), Tarefa 7 (editar, `moverDatas`), Tarefa 12 (losango, alças escondidas no CSS, `fim = inicio` no arraste) |
| 5.4 validação e limites | Tarefa 5 (mensagens), Tarefa 7 (100 ativos, 300 etapas, 300 registros), Tarefa 9 (50 modelos) |
| 5.4 histórico de alterações (por campo, `por`, `nome`) | Tarefa 5, Tarefa 7, Tarefa 8 (visibilidade) |
| 5.4 privacidade de sigilosos | Tarefa 5 (histórico), Tarefa 8 (mesclagem) |
| 5.4 modelos embutidos (3, textos neutros) | Tarefa 9 |
| 5.4 preferências locais | só a chave (Tarefa 1); a leitura/gravação é do P3, que tem a interface |
| 6.1 lápides de 180 dias (unidade) e 90 (só eu); 6.2 mover entre "Só eu" e "Toda a unidade" | Tarefa 8 |
| 8, itens 1 a 7, e "o bundle não contém innerHTML/outerHTML/insertAdjacentHTML nem on*=" | Tarefa 10 (`AJUSTES.md` 1–7, provas em linkedom, varredura do pacote); portão no `build.mjs` (Tarefas 1 e 12) |
| 9: ciclo nomeado, arraste inválido desfeito com aviso, falha da Frappe cai para a Lista | Tarefa 4; Tarefa 12 (`validar` + `aoRecusar`, `aoFalhar`) |
| Tela 1: escalas Dia/Semana/Mês/Ano, medidas 64/36, fase fina, losango, "plano original", feriados na escala Dia | Tarefas 11 e 12 |

**2. Placeholders:** varrido — nenhum marcador de pendência nem "implementar depois"; todo passo de código traz o arquivo inteiro ou o trecho exato com a âncora de inserção.

**3. Consistência de tipos:** cada um dos 12 estágios foi compilado com `tsc --noEmit` (strict + `noUncheckedIndexedAccess`), passou no Biome, nas provas e no build ao escrever o plano; os nomes que atravessam tarefas foram conferidos (`MudancaDeDatas` T1 → T4/T7/T12; `ErroValidacao` T5 → T7/T8/T9; `Linha` T11 → T12; `BarraFrappe`/`ModoDeVisao`/`TarefaFrappe` T10 → T11/T12; `RepositorioProjetos` T7 → T8/T9).

**4. Review Focus:** as cinco linhas têm prova na tarefa dona do código (indicadas em cada linha).
