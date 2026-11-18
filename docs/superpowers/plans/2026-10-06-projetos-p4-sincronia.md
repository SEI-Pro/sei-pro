# Gestor de Projetos em TS — P4: sincronia e colaboração — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer os projetos irem e voltarem do SEI e entre pessoas sem servidor: o Texto Padrão da unidade `[_SEIPRO_PRJ_UNIDADE]` (lido sempre, gravado depois do "Entendi") e o pessoal `[_SEIPRO_PRJ_<login>]` (desligado até o convite), o arquivo JSON e as cópias diárias, e os diálogos de apoio — Sincronização, Modelos de projeto, Histórico de alterações, Enviar/Receber projeto por arquivo e Importar do servidor do Atividades — ligados ao app do P3 pelos pontos de extensão.

**Architecture:** O motor genérico do `sei-comum` ganha a conferência do conteúdo anterior junto da gravação, a leitura no recuo de "indisponível", o "não criar texto vazio" e o "aguardando permissão"; o armazém do `sei-nucleo` lê sem o link de alterar, confere o anterior no formulário de alterar e resolve a duplicata da criação simultânea. No `projetos/`, o adaptador (`sincronia/textoPadrao.ts`) monta o envelope de um escopo sem nada sigiloso e podado; a aba (`pagina/sincronia.ts`) roda um controle por texto; o app recebe de `app/colaboracao/colaboracao.ts` o estado da sincronia, os itens do menu, as faixas e o repositório da unidade que pergunta o "Entendi" antes de gravar.

**Tech Stack:** TypeScript 5.9 (`strict`; `noUncheckedIndexedAccess` no pacote, `tsconfig.pagina.json` sem ela para o content script), esbuild 0.25 (`charset: "ascii"`), tsx 4 + linkedom 0.18 (provas), Biome 2, `sei-comum` (motor, controle, codec, arquivo, cópias, consentimento, diálogos, combobox, menu, aviso), `sei-nucleo` (armazém de Texto Padrão, Sei, página).

**Spec:** `docs/superpowers/specs/2026-10-06-projetos-design.md` (seções 3.2, 5.1, 5.4, 6, 7 e 9) e as telas aprovadas `docs/superpowers/specs/2026-10-06-projetos-telas/formularios.html` (diálogos de apoio). Plano-mestre: `docs/superpowers/plans/2026-10-06-projetos-00-mapa.md` (fase P4; Review Focus 1 e 2 são desta fase). Pendências herdadas: `.superpowers/sdd/notas-fases.md` (seção P4 e os itens "→ P4" das outras seções). Assinaturas do motor: `.superpowers/sdd/2026-10-06-projetos-p1-comum/final-fix-report.md`; API do núcleo do projetos: `.superpowers/sdd/2026-10-06-projetos-p2-nucleo/final-fix-report.md`.

**Como este plano foi escrito:** todo o código abaixo foi montado e rodado em cópias da worktree no scratchpad (git próprio; nada foi tocado na worktree). O primeiro ensaio partiu do P3 até a Tarefa 11 com as Tarefas 12 a 14 aplicadas a partir do plano P3; depois o P4 inteiro foi reaplicado sobre a worktree real em `8f75b79` (P3 até a Tarefa 13 comitada; a Tarefa 14 do P3 — manifest e guarda do legado — não toca em nada deste plano) e ajustado ao código real do P3 (o `pedidosDaAba` do `main.ts`, os repositórios só leitura do content script, a prova "nada lê a árvore" e o portão do build). Por fim o plano foi reaplicado a partir deste markdown, tarefa por tarefa, numa cópia limpa dessa base: cada tarefa compila (`tsc`, os dois tsconfig do projetos), passa no Biome e nas suas provas, e as falhas esperadas e as contagens abaixo saíram dessa reaplicação. **Base de contagem:** projetos 960 (worktree em `8f75b79`), sei-comum 419, sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054. A Tarefa 14 e a revisão final do P3 acrescentam provas ao projetos: se ele fechou com outro número, some a diferença a todas as contagens do projetos deste plano (as dos outros pacotes não dependem do P3). Conferido também sobre `47e1485` (P3 com a Tarefa 14): o plano inteiro aplica igual, o projetos parte de 973 e termina em 1242 (as mesmas +269).

## Global Constraints

- Idioma: código, nomes, comentários, textos de interface e mensagens em português do Brasil; título de commit sem acento (ex.: `Projetos: ...`, `Comum: ...`, `Nucleo: ...`), terminando com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Git: trabalhar só na worktree `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos` (branch `feat/projetos-ts`); conferir `git branch --show-current`; **nunca `git add -A`** (adicionar por caminho); sem push, merge, release.
- `dist/js` gerado: só ASCII (esbuild `charset: "ascii"` + portão de bytes > 0x7f no `build.mjs`). Nenhum JS legado é editado à mão nesta fase. Nos fontes TS deste plano não há nenhuma sequência `\u` (o Write/Edit converte `\uXXXX` em caractere cru); BOM é `0xfeff` por `charCodeAt`, e acento em regex não existe (comparação sem acento é `normalizarTexto` de `@comum/texto`). O `projetos.css` é só ASCII (a prova estática do P3 confere): comentários sem acento.
- DOM seguro: em TS só `h()`/`textContent`/`createElementNS`; proibido `innerHTML`, `outerHTML` (escrita), `insertAdjacentHTML`, atributos `on*` em string. Nome de projeto, de etapa, de modelo, sigla, motivo do texto inválido, campo do histórico: sempre texto.
- Sessão do SEI: nunca montar URL do SEI; o armazém de Texto Padrão só usa o link do MENU e os links da própria lista/linha (receita provada no P1 dos Favoritos); nunca carregar a árvore de processo.
- SEI em HTTP: sem `crypto.randomUUID` direto e sem Web Locks obrigatório — ids por `novoId()` de `@comum/id`, trava com recuo (`travarComLocks`/`travarEsperando`).
- Privacidade (spec 5.4 e 9): o número de processo sigiloso nunca vai ao Texto Padrão (nem pela pontuação diferente, nem pelo `idProcedimento`, nem em registro antigo do histórico, nem o documento de etapa sigilosa); no "Enviar projeto" vale a mesma regra; o arquivo e as cópias diárias são do próprio usuário e levam tudo.
- Nomes e tetos (spec 6.1): `[_SEIPRO_PRJ_UNIDADE]` e `[_SEIPRO_PRJ_<login>]` (login longo encurtado com `~` e 8 hexadecimais, `nomeDeTextoInterno`); descrição "Projetos da unidade (SEI Pro). Gerado automaticamente; não edite."; teto 100 KB, aviso 80 KB; lápides 180 dias (unidade) / 90 (pessoal); histórico 300 registros; rodada ao carregar o Controle de Processos (último puxar > 2 min ou pendência), ao focar a aba e 15 s depois de mudança local; trava `seipro-projetos-sync|<chave de status>`.
- Chaves de armazenamento: status `projetos/sync/tp/<chaveEscopo>`, arquivo `projetos/sync/arquivo/<host>|<login>`, consentimentos em `projetos/consentimento` (storage.sync, campo `textoPadrao`, chave `host|login|idUnidade|un` ou `…|eu`), relatório da leitura `projetos/sync/relatorio/<chaveEscopo>`, texto inválido substituído `projetos/sync/substituido/<chaveEscopo>`; banco IndexedDB `seipro-projetos` (depósitos `copias` e `arquivos`).
- Testes: tsx + linkedom, agregadores `tests/verificar.ts` de cada pacote; as suítes do content script do projetos ficam em `projetos/tests/pagina/` (tipadas pelo `tsconfig.pagina.json`) e entram no agregador pelo caminho numa variável, como a do P3. **Linha de base que não pode cair** (ensaio): sei-comum 419, sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054, projetos 960 (worktree em `8f75b79`).
- Portões: `npx tsc --noEmit` nos pacotes tocados (no projetos, `npm run tipos`, que roda os dois tsconfig) e `npx biome check src tests` (sei-comum, favoritos, projetos; o sei-nucleo não tem Biome); portão ASCII e DOM seguro do `build.mjs`; `node tools/check-dom-injection.mjs`; `node tools/patch-manifests.mjs --check` (o `tools/` é gitignored e já está na worktree).
- Bundles do projetos (`dist/js/init_projetos.js`, `dist/js/projetos/app.js`, `dist/css/projetos.css`): regerados uma vez, na Tarefa 13 (como no P3, as tarefas anteriores só mexem nos fontes).
- Favoritos sem regressão: o motor e o armazém mudam para todos, mas os Favoritos usam `releituras: 0` (nada de conferência), não passam `vazio`, `lerNoRecuo`, `lerSemConsentimento` nem `permitido` próprio: as 578 provas deles passam sem tocar em `favoritos/tests`. Os bundles de quem empacota o que muda são regerados (e comitados) na tarefa que muda: `dist/js/init_favoritos.js` e `dist/js/favoritos/app.js` na Tarefa 1; `dist/js/init_favoritos.js`, `dist/js/init_historico.js`, `dist/js/init_agente.js` e `dist/js/agente/painel.js` na Tarefa 2 (o `Sei` do núcleo).
- Visual: tokens `--spro-*` e classes de `sei-comum/src/ui/base.css`; diálogos no desenho dos Favoritos (seções com título curto, dica, uma linha de botões); toda classe `prj-*` nova ganha regra no `projetos/estatico/projetos.css` na mesma tarefa (a prova estática do P3 confere); princípio "poucos botões, poucos passos, essencial à mostra".

## Review Focus

1. **Texto Padrão de projetos editado à mão, de versão mais nova, perto ou acima do teto, ou uma bomba de gzip** — nenhum dado local se perde e nada é sobrescrito em silêncio: inválido → o texto antigo fica guardado neste navegador e é regravado com aviso; mais novo → não grava e pede para atualizar; acima do teto → não grava e explica o que fazer; descompactado acima de 8 MB → inválido sem montar o JSON. Provas: Tarefa 1 (codec e motor) e Tarefa 4 (adaptador com o motor de verdade).
2. **Dois usuários editando o mesmo projeto "Toda a unidade" quase ao mesmo tempo** — depois da próxima rodada de cada um, as duas alterações estão no texto e nos dois computadores; a cópia velha de um colega não ressuscita a exclusão; um terceiro que chega depois recebe tudo. Provas: Tarefa 4 (dois repositórios, dois motores, um texto em memória que confere a gravação, a rodada de um intercalada no meio da do outro) e Tarefa 2 (criação simultânea no servidor falso).
3. **Quem só lê o texto da unidade (sem o link de alterar) ou nem tem Textos Padrão** — nunca cria um segundo texto, continua lendo os projetos dos colegas no recuo de "indisponível", e o indicador fica calmo ("neste navegador", com o motivo na dica). Provas: Tarefa 2 (leitura sem alterar, gravar recusado sem cadastrar), Tarefa 1 (`lerNoRecuo`) e Tarefa 7 (estado).
4. **Processo sigiloso** — o número não sai em lugar nenhum que vá a outra pessoa (texto da unidade, texto pessoal, arquivo enviado), nem por registro antigo do histórico, nem pelo documento da etapa; quem tem o número não o perde na mescla e a própria cópia que volta do texto não vira um laço de releituras. Provas: Tarefa 3 (repositório), Tarefa 4 (envelope), Tarefa 5 (texto gravado pela aba) e Tarefa 10 (arquivo enviado).
5. **Arquivo de fora hostil** — JSON quebrado, formato errado (a cópia de tudo no "Receber", o projeto enviado no "Importar"), itens com tipo errado ou data impossível, listas enormes, servidor do Atividades com lixo: recusado inteiro, sem gravar nada e com uma mensagem que diz o que fazer. Provas: Tarefas 6, 10, 11 e 12.

## Decisões desta fase

1. **Conferência junto da gravação (núcleo + motor).** O armazém do núcleo ganha `gravarConferindo(html, { anterior, mesmo })`: abre o formulário de alterar (que traz o conteúdo de agora no `txaConteudo`), compara com o que a rodada leu e só posta se é o mesmo; se não, devolve `{ gravado: false, atual }`, que entra na próxima tentativa da mesma conta de releituras. Com um destino que confere, o motor dispensa a releitura separada (2 requisições a menos por gravação). A corrida que sobra dura o intervalo entre o GET do formulário e o POST. `releituras: 0` (Favoritos) nunca usa a conferência.
2. **Criação simultânea.** Depois de criar, o armazém relista; com duas linhas de mesmo nome, o texto é o de **menor id** (todos leem e gravam nele). Se o nosso ficou com o id maior, ele é excluído (só o nosso, conferido pelo conteúdo) e o conteúdo do outro volta para a mescla. Duplicata antiga na lista: todo mundo escolhe o menor id.
3. **Quem só lê.** A linha sem o link de alterar ainda é achada (ler usa só o de consultar); gravar nela dá `SEI_ACAO_INDISPONIVEL` (nunca cadastra um segundo texto). O motor, com `lerNoRecuo`, continua puxando a cada 2 min durante o dia de recuo, só sem gravar.
4. **Texto da unidade lido sem consentimento; gravado depois do "Entendi" (spec 6.1).** O controle da página ganha `lerSemConsentimento` (liga para ler desde o começo; o consentimento só libera a gravação, e a rodada vem na hora em que ele chega) e `permitido` próprio. Quando há o que gravar e não pode, o status fica com `aguardandoPermissao: true` e conta a puxada (sem reler a cada foco).
5. **O "Entendi" no app.** O `AppProjetos` recebe, no lugar do repositório da unidade, um `Proxy` que pergunta o aviso único antes de cada método que grava (`comConsentimento`); depois do "Entendi" passa direto. Nenhum ponto do P3 muda; sem o "Entendi", o erro (`ErroValidacao`) aparece onde o P3 já mostra os erros do repositório. Ficam de fora `lapidarMovidos` (o fim de "mover para Só eu": a cópia já foi; parar ali deixaria o projeto nos dois lugares) e `limpar`. O que entra na unidade por outro caminho (restaurar cópia, importar arquivo, mover para Só eu) e fica esperando aparece numa **faixa** com o "Entendi".
6. **Sem "apagar" para o texto da unidade** (pendência P1): ele é de todos. "Desligar e apagar do SEI" só existe para o pessoal (`apagarDoSei` → `SincroniaPagina.apagarPessoal`).
7. **Texto que não existe e nada a guardar não é criado** (`AdaptadorTexto.vazio`): ler o da unidade num lugar sem projetos não deixa um texto vazio na lista.
8. **Texto inválido (spec 6.1, pendência P1 `antesDeRegravarInvalido`).** O content script não alcança o IndexedDB da extensão (a cópia diária é do app), e regravar não muda os dados locais; o que se perde é o texto antigo. Então o gancho guarda o HTML substituído em `chrome.storage.local` (`projetos/sync/substituido/<escopo>`, o último por escopo, até 300 KB) e o diálogo oferece "Baixar o texto antigo". Se a gravação dele falhar, o motor não regrava (contrato do P1). A cópia diária segue sendo feita pelo app ao abrir.
9. **Teto do descompactado (pendência P2):** `decodificar(texto, limite = 8 MB)` lê o gzip aos pedaços e desiste ao passar; `lerConteudoTexto` devolve inválido ("descompactados passam do limite"). Vale para todos os módulos (os Favoritos nunca passam de 1 MB). Tetos de quantidade no envelope (`TETOS_ENVELOPE`: listas acima do que cabe em 100 KB = inválido) somam-se aos tetos do `importar` (P2).
10. **Privacidade dos sigilosos (pendências P2):** um processo marcado sigiloso em qualquer projeto ou etapa (viva ou lápide) é sigiloso em todo o envelope, comparado pela `chaveProtocolo`; o vínculo vai `{ protocolo: "", sigiloso: true }` (sem `idProcedimento`); etapa sigilosa (processo próprio sigiloso, ou nenhum processo próprio num projeto sigiloso) vai sem `documento`; registro "processo" antigo com o número vira "processo sigiloso" e registro "documento" de etapa sigilosa vira "documento de processo sigiloso". **Decisão do pendente "documento SEI de processo sigiloso no histórico": não vai.** Quem tem os números os mantém: `manterNumeroSigiloso` (P2) e `manterDocumentoSigiloso` (novo, com o sigilo do projeto calculado depois da mescla dos projetos).
11. **O laço da gravação do próprio importar (pendência P2 `aoMudar` sem origem).** A cópia que volta do texto tem o mesmo carimbo da local e pode vencer o desempate; com a restauração do número sigiloso ela fica igual à local. O `importar` não regrava o que ficaria igual (`jsonEstavel`), então não há aviso em `aoMudar` e o motor não agenda outra rodada. O que muda de verdade ainda custa uma leitura a mais (que acha tudo igual e para), como nos Favoritos.
12. **Lápides vão completas** (com a regra de sigilo) e são podadas na exportação: 180 dias na unidade, 90 no pessoal; histórico só os 300 mais recentes. Localmente, o app chama `limpar()` ao abrir.
13. **Relógio atrasado (pendência P2 re-review):** o adaptador conta, antes de importar, os itens com carimbo mais de 1 dia à frente (`contarFuturos`) e grava o relatório da leitura quando muda; o indicador vira "erro" com "o relógio deste computador parece atrasado: N alterações dos colegas ficaram de fora".
14. **Desistência branda (pendência P1):** a desistência pelas releituras ("um colega gravava ao mesmo tempo") aparece como "pendente", não "erro"; a nova tentativa já está armada (motor do P1).
15. **Base invertida (pendência P2):** a linha de base aceita término antes do início, como a etapa (`baseValida` com a mesma regra); **`criarProjetoDeModelo` sem faixa (pendência P2):** começo fora de 2000–2100, ou etapas que passariam de 2100, são recusados sem gravar.
16. **Assinatura do adaptador** só com as entidades (por id): sem `gerado`, `host`, `unidade`, `vis`, `login` (pendência P1, risco 4).
17. **Importação do Atividades: ids determinísticos** (`atvp<id>`, `atve<id>`, `atvf<id do projeto>-<hash do nome da macroetapa>`, `atvd<id da demanda>`) — duas pessoas da unidade importando o mesmo projeto não duplicam, e reimportar atualiza. Reimportar só mexe no que ainda está como veio (dispositivo `"atividades"`): o editado ou excluído aqui fica. Projeto que já está no outro escopo é atualizado lá. A chave `projetos/importacao/<host>|<login>` da spec 5.1 não é necessária (os ids e `origem.atividades` bastam) e não é usada. O processo de projeto do legado não traz o sigilo: entra comum (risco para a P6).
18. **Arquivo:** como nos Favoritos, `ControleArquivo` quando a página tem o seletor (no painel embutido o Chrome pode recusar o seletor dentro do iframe; o diálogo mostra o aviso); "Exportar tudo" e "Importar de um arquivo…" ficam na seção Arquivo do diálogo Sincronização (a spec 3.1 não os põe no menu). O lateral (P5) passa o mesmo controle.
19. **Enviar projeto:** com um projeto aberto, baixa direto; no Todos, escolhe o projeto. **Receber:** destino padrão "Toda a unidade" (pergunta o "Entendi"), cópia com ids novos, numa gravação só, e o arquivo com um item torto não grava nada.
20. **Excedentes do teto divergentes entre computadores** (pendência P2): aceito. O desempate é pelo id (determinístico); dois computadores com estados locais diferentes podem guardar excedentes diferentes, e o texto leva o que cada um tem dentro do teto.
21. **Vínculo e documento só com forma de número** (pendência da revisão da Tarefa 12 do P3: abrir processo/documento com dado compartilhado): o texto da unidade é de qualquer colega, e o número vai à pesquisa rápida quando alguém clica. `entidadeValida` passa a exigir `protocolo` só com dígitos, ponto, barra e hífen (até 40; vazio no sigiloso), `idProcedimento` só dígitos (até 20), `documento.numero` até 40 e `titulo` até 200; a importação do Atividades limpa o que vem do legado para caber.
22. **O content script dos Projetos não leva a classe `Sei`:** o P3 proíbe `new Sei(` em `src/pagina` (prova "nada lê a árvore") e o portão do build recusa no `init_projetos.js` as ações da árvore e da atribuição. O armazém de Texto Padrão do núcleo passa a receber `SeiDoTexto` (`http` + `linkMenu`), o `linkDoMenu` sai do `Sei` para `links/links.ts` (o `Sei.linkMenu` o chama, sem mudança para os Favoritos e o Agente) e `pagina/armazem.ts` monta só isso.
23. **Content script:** a sincronia roda na janela de topo do Controle de Processos (onde o P3 monta o painel); `ocultarTextosInternos` roda em todo frame. Outras telas e o lateral são do P5 (que monta `SincroniaPagina` igual).

### Pendências herdadas e onde ficam

| Pendência (`notas-fases.md`) | Onde |
|---|---|
| Motor com `antesDeRegravarInvalido` para cópia antes de regravar inválido | Decisão 8 · Tarefa 4 |
| Assinatura do adaptador ignora `gerado`/quem gravou | Decisão 16 · Tarefa 4 |
| Gravar com conferência do conteúdo anterior antes do POST | Decisão 1 · Tarefas 1 e 2 |
| `ler` do núcleo sem depender do link de alterar | Decisão 3 · Tarefa 2 |
| Leitura sem gravação no recuo "indisponível" do texto da unidade | Decisão 3 · Tarefa 1 |
| NÃO ligar "apagar" ao texto "Toda a unidade" | Decisão 6 · Tarefas 5, 8 e 13 |
| Criação simultânea → conferir duplicata | Decisão 2 · Tarefa 2 |
| Desistência por releituras mostrada de forma branda | Decisão 14 · Tarefa 7 |
| Teto do tamanho descompactado antes do `JSON.parse` | Decisão 9 · Tarefa 1 |
| Tetos de quantidade | Decisão 9 · Tarefa 4 (envelope) + P2 (`importar`) |
| Limpar número sigiloso de vínculos e de registros antigos | Decisão 10 · Tarefas 3 e 4 |
| Poda de lápides 180/90 e do histórico na exportação | Decisão 12 · Tarefa 4 |
| `aoMudar` sem origem → o importar não vira pendência local (laço) | Decisão 11 · Tarefa 3 |
| Relógio atrasado → aviso | Decisão 13 · Tarefas 4 e 7 |
| Base invertida | Decisão 15 · Tarefa 3 |
| `criarProjetoDeModelo` sem faixa de anos | Decisão 15 · Tarefa 3 |
| Documento SEI de processo sigiloso no histórico — decidir | Decisão 10 (não vai) · Tarefa 4 |
| `importar` exige entidades completas (lápide inclusive) | Decisão 12 (lápides completas) |
| Poda do histórico > 300 é gravação separada | Decisão 12 (a exportação já poda; local pelo `limpar`) |
| Excedentes do teto divergem entre computadores | Decisão 20 (aceito) |
| Passar `agora` à `entidadeValida` | P2 já passa no `importar`; `contarFuturos` usa a mesma folga |
| Abrir processo/documento com dado compartilhado sem validação (revisão da T12 do P3) | Decisão 21 · Tarefas 3 e 11 |

## Estrutura de arquivos

```
sei-comum/src/sincronia/codec.ts            (mod) teto do descompactado (ErroConteudoGrande, LIMITE_DESCOMPACTADO)
sei-comum/src/sincronia/textoPadraoCodec.ts (mod) lerConteudoTexto(html, limite)
sei-comum/src/sincronia/motor.ts            (mod) gravarConferindo, vazio, lerNoRecuo, aguardandoPermissao, mesmoConteudo exportado
sei-comum/src/sincronia/controlePagina.ts   (mod) lerSemConsentimento, permitido, lerNoRecuo, gravarConferindo repassado
sei-comum/tests/adaptadorTeste.ts           (mod) opcao vazio, destinoConferindo
sei-comum/tests/verificar-motor-unidade.ts  provas da Tarefa 1
sei-nucleo/src/dominio/textoPadrao.ts       (mod) ler sem alterar, gravarConferindo, duplicata, menor id
sei-nucleo/src/links/links.ts               (mod) linkDoMenu (o corpo do Sei.linkMenu)
sei-nucleo/src/sei.ts                       (mod) linkMenu chama linkDoMenu
sei-nucleo/src/index.ts                     (mod) exporta ConferenciaGravacao, ResultadoGravacao, SeiDoTexto, linkDoMenu
sei-nucleo/tests/verificar-texto-padrao-conferencia.ts  provas da Tarefa 2
projetos/
  src/repositorio.ts                        (mod) importar sem regravar o igual, manterDocumentoSigiloso, base, modelo na faixa
  src/sincronia/textoPadrao.ts              adaptador do motor: envelope, privacidade, poda, validacao, assinatura, relatorio
  src/sincronia/consentimento.ts            consentimento por texto no storage.sync
  src/sincronia/arquivo.ts                  todos os escopos: exportar/importar, arquivo ligado, copias diarias
  src/pagina/sincronia.ts                   SincroniaPagina: os dois controles da aba
  src/pagina/armazem.ts                     o armazem do nucleo com http + link do menu (sem a classe Sei)
  src/pagina/atividades.ts                  busca no servidor do Atividades (e o guardado pelo legado)
  src/pagina/executor.ts                    (mod) sincronizarAgora, apagarDoSei, importarAtividades
  src/pagina/main.ts                        (mod) ligarSincronia, ocultarTextosInternos em todo frame
  src/arquivo/projetoArquivo.ts             enviar/receber um projeto
  src/importacao/atividades.ts              mapeamento do legado (spec 6.3) e importacao idempotente
  src/app/colaboracao/estado.ts             EstadoDaSincronia (ProvedorSincronia do P3)
  src/app/colaboracao/consentir.ts          comConsentimento (Proxy), consentidor
  src/app/colaboracao/colaboracao.ts        Colaboracao: menu, faixas, dialogos, repositorios com o Entendi
  src/app/dialogos/consentimento.ts         aviso da unidade, consentimento do pessoal, faixas
  src/app/dialogos/sincronizacao.ts         dialogo Sincronizacao
  src/app/dialogos/modelos.ts               dialogo Modelos de projeto
  src/app/dialogos/historico.ts             dialogo Historico de alteracoes
  src/app/dialogos/arquivoProjeto.ts        Enviar e Receber projeto por arquivo
  src/app/dialogos/importar.ts              Importar do servidor do Atividades
  src/app/app.ts                            (mod) DepsApp.faixas, novoProjetoDeModelo, abrirProjeto
  src/app/main.ts                           (mod) monta a Colaboracao e passa ao AppProjetos
  estatico/projetos.css                     (mod) regras das classes novas (Tarefas 7 a 11)
  tests/                                    verificar-sincronia-*.ts, verificar-app-*.ts (P4), legadoAtividades.ts,
                                            verificar-arquivo-projeto.ts, verificar-importacao-atividades.ts
  tests/pagina/                             verificar-sincronia-pagina.ts, verificar-atividades-pagina.ts, verificar-executor-p4.ts
dist/  js/init_projetos.js, js/projetos/app.js, css/projetos.css, js/init_favoritos.js, js/favoritos/app.js (gerados)
```

## Interfaces exportadas (o que P5 consome)

- **Motor** (`@comum/sincronia/motor`): `ConferenciaTexto { anterior: string | null; mesmo(a, b): boolean }`, `ResultadoGravacao = { gravado: true } | { gravado: false; atual: string | null }`, `DestinoTexto.gravarConferindo?(html, c)`, `AdaptadorTexto.vazio?(env)`, `DepsMotorTexto.lerNoRecuo?`, `StatusSync.aguardandoPermissao?`, `mesmoConteudo(a, b)`. **Controle** (`@comum/sincronia/controlePagina`): `DepsControlePagina.lerSemConsentimento?`, `.permitido?`, `.lerNoRecuo?`; `ArmazemTexto.gravarConferindo?`. **Codec**: `decodificar(texto, limite?)`, `LIMITE_DESCOMPACTADO`, `ErroConteudoGrande`, `lerConteudoTexto(html, limite?)`.
- **Núcleo** (`@nucleo/dominio/textoPadrao`): `ArmazemTextoPadrao.gravarConferindo(html, c: ConferenciaGravacao, op?) → Promise<ResultadoGravacao>`; `TextoLocalizado.alterar?`; `SeiDoTexto`; `linkDoMenu(base, acao)` (`@nucleo/links/links`). **Aba** (`src/pagina/armazem.ts`): `armazemDoTexto(doc, url, vis, login)` — o P5 usa o mesmo nas outras telas (sem levar o `Sei` ao pacote).
- **Texto Padrão dos projetos** (`src/sincronia/textoPadrao.ts`): `nomeDoTexto(vis, login)`, `descricaoDoTexto(vis)`, `legivelProjetos(vis, sigla, nome)`, `adaptadorProjetos({ repo, area, sigla, nomeUsuario })`, `validarEnvelope(bruto, escopo)`, `paraOTexto(env, agora)` (o envelope sem sigilo e podado; o P5 pode reusar onde precisar do mesmo corte), `assinaturaProjetos`, `contarFuturos`, `chaveStatusTexto(escopo)`, `chaveRelatorio(escopo)`, `chaveSubstituido(escopo)`, `MENSAGEM_MUDOU`, `TETO_TEXTO`, `AVISO_TEXTO`, `RelatorioImportacao`, `TextoSubstituido`.
- **Consentimento** (`src/sincronia/consentimento.ts`): `CHAVE_CONSENTIMENTO`, `chaveDoConsentimento(host, login, idUnidade, vis)`, `consentimentoProjetos(sync, host, login, idUnidade, vis) → PortaConsentimento`.
- **Aba** (`src/pagina/sincronia.ts`): `new SincroniaPagina(DepsSincroniaPagina)` com `iniciar({ puxar })`, `puxar()`, `agora() → ResultadoSincronizar { unidade; eu | null }`, `apagarPessoal() → boolean`, `parar()`; `INTERVALO_PUXAR`. O P5 monta uma igual nas outras telas de topo (para o que o lateral grava chegar ao SEI sem o Controle de Processos aberto).
- **RPC app → aba** (acrescentados): `sincronizarAgora` → `ResultadoSincronizar`; `apagarDoSei` → `boolean` (só o pessoal); `importarAtividades` → `ProjetosDoAtividades { fonte: "servidor" | "cache"; projetos: unknown[]; aviso? }`. `DepsExecutor` ganha `sincronia?` e `atividades?`.
- **Arquivo e cópias** (`src/sincronia/arquivo.ts`): `EnvelopeArquivo`, `exportarTudo(area, dono, carimbo)`, `importarTudo(area, env, dono, carimbo)`, `lerEnvelopeArquivo(bruto)`, `controleArquivo(area, dono, carimbo) → ControleArquivo<EnvelopeArquivo>`, `copiasDosProjetos()`, `fazerCopiaDoDia(area, dono, armazem, hoje, carimbo)`, `restaurarCopia(...)`, `BANCO = "seipro-projetos"`.
- **App** (`src/app/colaboracao/colaboracao.ts`): `new Colaboracao(DepsColaboracao)` com `provedor: EstadoDaSincronia`, `repos` (unidade com o "Entendi"), `faixas: HTMLElement`, `extensoesMenu: ExtensoesMenu`, `consentirUnidade()`, `iniciar()`, `destruir()`, `aoGanharFoco()`, `importarAtividades()`, `abrirSincronizacao()`, `abrirModelos()`, `abrirHistorico()`, `enviarProjeto()`, `receberProjeto()`; `GanchosDoApp { aberto; abrirProjeto(id); novoProjetoDeModelo(id) }`. O lateral do P5 monta a mesma `Colaboracao` (com o `arquivo` ligado) e usa `provedor.estado()` no topo.
- **Estado** (`src/app/colaboracao/estado.ts`): `EstadoDaSincronia` (`iniciar`, `ler`, `situacao`, `estado`, `aoMudar`, `parar`), `estadoDaSincronia(situacao, agora)`, `linhaDoTexto(texto, agora)`, `avisoDoRelogio(relatorio)`.
- **AppProjetos** (P3, acrescentados): `DepsApp.faixas?: HTMLElement`; `novoProjetoDeModelo(id)`; `abrirProjeto(id): Promise<void>`.
- **Enviar/receber** (`src/arquivo/projetoArquivo.ts`) e **Atividades** (`src/importacao/atividades.ts`): `envelopeDoProjeto`, `lerEnvelopeDoProjeto`, `receberProjeto(repo, env)`; `projetosLegados`, `mapearProjeto`, `itensParaImportar`, `importarAtividades(repos, escolhidos, destino, hoje)`, `idDoLegado`.

## Como rodar

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos"
npx tsx tests/verificar.ts   # ultima linha: "N ok, 0 falha(s)"
npm run tipos                # os dois tsc, sem saida
npx biome check src tests    # sem erro
node build.mjs               # "portoes: ASCII e DOM seguro ok"
```

Os outros pacotes: `cd ../sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`; `cd ../sei-nucleo && npx tsx tests/verificar.ts && npx tsc --noEmit`; `cd ../favoritos && npx tsx tests/verificar.ts && node build.mjs`.

Provas acumuladas ao fim de cada tarefa (reaplicação; base projetos 960, sei-comum 419, sei-nucleo 110): 1 → sei-comum 447 (projetos 960) · 2 → sei-nucleo 125 · 3 → 980 · 4 → 1036 · 5 → 1048 · 6 → 1066 · 7 → 1097 · 8 → 1112 · 9 → 1129 · 10 → 1148 · 11 → 1191 · 12 → 1219 · 13 → 1229 (projetos). favoritos 578, historico 485 e agente-ia 1054 não mudam em nenhuma tarefa.

---

### Task 1: Comum — motor confere na gravação, lê no recuo, não cria texto vazio; codec com teto do descompactado

**Files:**
- Modify: `sei-comum/src/sincronia/codec.ts`, `sei-comum/src/sincronia/textoPadraoCodec.ts`, `sei-comum/src/sincronia/motor.ts`, `sei-comum/src/sincronia/controlePagina.ts`
- Modify (apoio às provas): `sei-comum/tests/adaptadorTeste.ts`, `sei-comum/tests/verificar.ts`
- Test: `sei-comum/tests/verificar-motor-unidade.ts`
- Regerados: `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes (P1): `MotorTextoPadrao`, `DepsMotorTexto`, `AdaptadorTexto`, `DestinoTexto`, `StatusSync`, `ValidacaoTexto`, `ControleTextoPadrao`, `DepsControlePagina`, `ArmazemTexto`, `PortaConsentimento`, `consentimentoNaArea`, `definirConsentimento`; nas provas `repoTeste`, `adaptadorTeste`, `destinoTeste`, `textoDeOutro`, `itensDoTexto`, `item`.
- Produces: `LIMITE_DESCOMPACTADO = 8 * 1024 * 1024`, `class ErroConteudoGrande`, `decodificar(texto, limite = LIMITE_DESCOMPACTADO)`, `lerConteudoTexto(html, limite = LIMITE_DESCOMPACTADO)`; `ConferenciaTexto { anterior: string | null; mesmo(a, b): boolean }`, `ResultadoGravacao`, `DestinoTexto.gravarConferindo?(html, c) → Promise<ResultadoGravacao>`, `AdaptadorTexto.vazio?(envelope) → boolean`, `DepsMotorTexto.lerNoRecuo?: boolean`, `StatusSync.aguardandoPermissao?: boolean`, `mesmoConteudo(a, b)` (exportado); `ArmazemTexto.gravarConferindo?`, `DepsControlePagina.lerSemConsentimento?`, `.permitido?`, `.lerNoRecuo?`. Nas provas: `adaptadorTeste(repo, { vazio? })`, `destinoConferindo(inicial?) → { html, lidas, gravadas, conferencias, aoConferir?, ler, gravar, gravarConferindo }`.

- [ ] **Step 1: Escrever a prova que falha**

Em `sei-comum/tests/adaptadorTeste.ts`, troque:

```ts
import type { AdaptadorTexto } from "../src/sincronia/motor";
```

por:

```ts
import type { AdaptadorTexto, ConferenciaTexto, ResultadoGravacao } from "../src/sincronia/motor";
```

Em `sei-comum/tests/adaptadorTeste.ts`, troque:

```ts
    antesDeRegravarInvalido?: AdaptadorTexto<EnvTeste>["antesDeRegravarInvalido"];
    aoExportar?: (c: ChamadaExportar) => void;
  } = {},
): AdaptadorTexto<EnvTeste> {
  const dono = o.dono ?? "pedro";
  return {
    ...(o.antesDeRegravarInvalido ? { antesDeRegravarInvalido: o.antesDeRegravarInvalido } : {}),
```

por:

```ts
    antesDeRegravarInvalido?: AdaptadorTexto<EnvTeste>["antesDeRegravarInvalido"];
    aoExportar?: (c: ChamadaExportar) => void;
    /** Ensina ao motor o "nada a guardar" (sem itens): sem texto no SEI, não cria. */
    vazio?: boolean;
  } = {},
): AdaptadorTexto<EnvTeste> {
  const dono = o.dono ?? "pedro";
  return {
    ...(o.antesDeRegravarInvalido ? { antesDeRegravarInvalido: o.antesDeRegravarInvalido } : {}),
    ...(o.vazio ? { vazio: (env: EnvTeste) => env.itens.length === 0 } : {}),
```

Em `sei-comum/tests/adaptadorTeste.ts`, troque:

```ts
/** O arquivo de teste: uma lista por dono (o mesmo arquivo pode ter sido escolhido por outro usuário). */
```

por:

```ts
/**
 * O Texto Padrão "no SEI" que confere na gravação (como o armazém do núcleo): `aoConferir` muda o texto
 * logo antes da n-ésima conferência, como um colega gravando (ou apagando) no meio.
 */
export function destinoConferindo(inicial: string | null = null) {
  const d = {
    html: inicial,
    lidas: 0,
    gravadas: 0,
    conferencias: 0,
    aoConferir: undefined as ((n: number) => Promise<void> | void) | undefined,
    async ler(): Promise<string | null> {
      d.lidas++;
      return d.html;
    },
    async gravar(html: string): Promise<void> {
      d.gravadas++;
      d.html = html;
    },
    async gravarConferindo(html: string, c: ConferenciaTexto): Promise<ResultadoGravacao> {
      d.conferencias++;
      await d.aoConferir?.(d.conferencias);
      if (!c.mesmo(d.html, c.anterior)) return { gravado: false, atual: d.html };
      d.gravadas++;
      d.html = html;
      return { gravado: true };
    },
  };
  return d;
}

/** O arquivo de teste: uma lista por dono (o mesmo arquivo pode ter sido escolhido por outro usuário). */
```

Arquivo completo `sei-comum/tests/verificar-motor-unidade.ts`:

```ts
/**
 * O texto que é de todos (o da unidade nos Projetos): conferência do conteúdo
 * anterior junto da gravação, nada de texto vazio criado à toa, leitura no
 * recuo de "indisponível", "aguardando permissão" e o teto do descompactado.
 */

import { areaMemoria } from "../src/armazenamento/area";
import { codificar, decodificar, ErroConteudoGrande, LIMITE_DESCOMPACTADO, paraParagrafos } from "../src/sincronia/codec";
import { consentimentoNaArea, definirConsentimento } from "../src/sincronia/consentimento";
import { ControleTextoPadrao } from "../src/sincronia/controlePagina";
import { type DestinoTexto, MotorTextoPadrao, type StatusSync } from "../src/sincronia/motor";
import { lerConteudoTexto } from "../src/sincronia/textoPadraoCodec";
import {
  adaptadorTeste,
  destinoConferindo,
  destinoTeste,
  type EnvTeste,
  item,
  itensDoTexto,
  repoTeste,
  textoDeOutro,
} from "./adaptadorTeste";
import { checar, lanca, secao, tique } from "./util";

const DIA = 86_400_000;
const CHAVE = "teste/sync/tp/a";

function montar(o: {
  destino: DestinoTexto;
  area?: ReturnType<typeof areaMemoria>;
  releituras?: number;
  vazio?: boolean;
  lerNoRecuo?: boolean;
  permitido?: () => Promise<boolean>;
}) {
  const area = o.area ?? areaMemoria();
  const repo = repoTeste();
  let agora = 10_000_000;
  const motor = new MotorTextoPadrao<EnvTeste>({
    adaptador: adaptadorTeste(repo, { vazio: o.vazio }),
    destino: o.destino,
    area,
    travar: (_n, fn) => fn(),
    agora: () => agora,
    atrasoEnvio: 10,
    releituras: o.releituras,
    lerNoRecuo: o.lerNoRecuo,
    permitido: o.permitido,
    // Nenhuma nova tentativa armada sobrevive à prova.
    temporizador: { definir: () => 0, cancelar: () => undefined },
  });
  return { area, repo, motor, avancar: (ms: number) => (agora += ms) };
}

const ids = (l: Array<{ id: string }>) =>
  l
    .map((i) => i.id)
    .sort()
    .join();

export async function verificarMotorUnidade(): Promise<void> {
  secao("codec: teto do tamanho descompactado");
  const bomba = await codificar({ x: "a".repeat(9 * 1024 * 1024) });
  checar("9 MB de JSON cabem em poucos KB de gzip", bomba.length < 40_000, bomba.length);
  const e1 = await lanca(() => decodificar(bomba));
  checar("decodificar recusa passar do limite (8 MB) sem montar o JSON", e1 instanceof ErroConteudoGrande, e1);
  checar("o limite padrao e de 8 MB", LIMITE_DESCOMPACTADO === 8 * 1024 * 1024);
  const pequeno = await codificar({ lista: Array.from({ length: 200 }, (_, i) => `item ${i}`) });
  checar("limite menor que o conteudo tambem recusa", (await lanca(() => decodificar(pequeno, 100))) instanceof ErroConteudoGrande);
  checar("dentro do limite, volta inteiro", ((await decodificar(pequeno, 1_000_000)) as { lista: string[] }).lista.length === 200);
  const lido = await lerConteudoTexto(paraParagrafos("Dados internos.", bomba));
  checar(
    "texto padrao com a bomba: invalido (o motor regrava a partir do local)",
    "invalido" in lido && /passam do limite/.test(lido.invalido),
    lido,
  );

  secao("motor: conferencia do conteudo anterior junto da gravacao");
  const d1 = destinoConferindo(await textoDeOutro([item("b1", 50)]));
  const m1 = montar({ destino: d1 });
  m1.repo.por("a1", "um", 100);
  const s1 = await m1.motor.sincronizar();
  checar(
    "le uma vez e grava conferindo (a releitura separada sai)",
    s1.estado === "ok" && d1.lidas === 1 && d1.conferencias === 1 && d1.gravadas === 1 && ids(await itensDoTexto(d1.html)) === "a1,b1",
    { s1, d1: { lidas: d1.lidas, conferencias: d1.conferencias, gravadas: d1.gravadas } },
  );
  const d2 = destinoConferindo(await textoDeOutro([item("b1", 50)]));
  const m2 = montar({ destino: d2 });
  m2.repo.por("a1", "um", 100);
  d2.aoConferir = async (n) => {
    if (n === 1) d2.html = await textoDeOutro([item("b1", 50), item("b2", 60)]);
  };
  const s2 = await m2.motor.sincronizar();
  checar(
    "o colega gravou entre a leitura e a gravacao: a conferencia devolve o atual, que entra na mescla",
    s2.estado === "ok" && m2.repo.itens.has("b2") && ids(await itensDoTexto(d2.html)) === "a1,b1,b2",
    await itensDoTexto(d2.html),
  );
  checar("sem ler de novo: o atual veio da propria conferencia", d2.lidas === 1 && d2.conferencias === 2 && d2.gravadas === 1, d2);
  const d3 = destinoConferindo(await textoDeOutro([item("b1", 50)]));
  const m3 = montar({ destino: d3 });
  m3.repo.por("a1", "um", 100);
  d3.aoConferir = async (n) => {
    d3.html = await textoDeOutro([item("b1", 50), item(`c${n}`, 70 + n)]);
  };
  const s3 = await m3.motor.sincronizar();
  checar(
    "texto mudando a cada conferencia: depois de 3 nao grava por cima, fica pendente e com erro brando",
    d3.conferencias === 3 && d3.gravadas === 0 && s3.estado === "erro" && s3.pendente && /mudou/.test(s3.mensagem ?? ""),
    s3,
  );
  const d4 = destinoConferindo(await textoDeOutro([item("b1", 50)]));
  const m4 = montar({ destino: d4 });
  m4.repo.por("a1", "um", 100);
  d4.aoConferir = (n) => {
    if (n === 1) d4.html = null;
  };
  await m4.motor.sincronizar();
  checar(
    "o texto sumiu no meio (colega excluiu): recria com o que ja estava mesclado",
    d4.gravadas === 1 && ids(await itensDoTexto(d4.html)) === "a1,b1",
    await itensDoTexto(d4.html),
  );
  const d5 = destinoConferindo(null);
  const m5 = montar({ destino: d5 });
  m5.repo.por("a1", "um", 100);
  d5.aoConferir = async (n) => {
    if (n === 1) d5.html = await textoDeOutro([item("b1", 50)]);
  };
  await m5.motor.sincronizar();
  checar(
    "criado por um colega no meio (nao existia na leitura): mescla o dele e grava por cima, sem duplicar",
    d5.gravadas === 1 && ids(await itensDoTexto(d5.html)) === "a1,b1" && m5.repo.itens.has("b1"),
    await itensDoTexto(d5.html),
  );
  const d6 = destinoConferindo(null);
  const m6 = montar({ destino: d6, releituras: 0 });
  m6.repo.por("a1", "um", 100);
  await m6.motor.sincronizar();
  checar("releituras: 0 (os Favoritos) grava sem conferir, mesmo com o destino que confere", d6.conferencias === 0 && d6.gravadas === 1);

  secao("motor: texto que nao existe e nada a guardar");
  const v1 = destinoTeste(null);
  const mv1 = montar({ destino: v1, vazio: true });
  const sv1 = await mv1.motor.sincronizar();
  checar("sem texto e sem itens: nao cria o texto", sv1.estado === "ok" && v1.gravadas === 0 && v1.html === null, { sv1, v1 });
  mv1.repo.por("a1", "um", 100);
  await mv1.motor.sincronizar({ forcar: true });
  checar("com um item: cria", v1.gravadas === 1 && ids(await itensDoTexto(v1.html)) === "a1");
  const v2 = destinoTeste(await textoDeOutro([]));
  const mv2 = montar({ destino: v2, vazio: true });
  await mv2.motor.sincronizar();
  checar("texto existente e vazio dos dois lados: igual, nao regrava", v2.gravadas === 0);

  secao("motor: leitura no recuo de indisponivel");
  const indisponivel: StatusSync = {
    estado: "indisponivel",
    quando: 1,
    pendente: false,
    indisponivelAte: 10_000_000 + DIA,
    mensagem: "Indisponível nesta unidade.",
  };
  const r1 = destinoTeste(await textoDeOutro([item("b1", 50)]));
  const mr1 = montar({ destino: r1, area: areaMemoria({ [CHAVE]: indisponivel }), lerNoRecuo: true });
  mr1.repo.por("a1", "um", 100);
  const sr1 = await mr1.motor.sincronizar();
  checar(
    "le e mescla o que os colegas gravaram, sem gravar",
    r1.lidas === 1 &&
      r1.gravadas === 0 &&
      mr1.repo.itens.has("b1") &&
      sr1.estado === "indisponivel" &&
      sr1.mensagem === indisponivel.mensagem,
    { sr1, r1 },
  );
  await mr1.motor.sincronizar();
  checar("logo depois nao le de novo (intervalo)", r1.lidas === 1);
  mr1.avancar(6 * 60_000);
  await mr1.motor.sincronizar();
  checar("depois do intervalo, le de novo", r1.lidas === 2 && r1.gravadas === 0);
  const r2 = destinoTeste(await textoDeOutro([item("b1", 50)]));
  const mr2 = montar({ destino: r2, area: areaMemoria({ [CHAVE]: indisponivel }) });
  await mr2.motor.sincronizar();
  checar("sem lerNoRecuo (os Favoritos): nao le durante o recuo", r2.lidas === 0);
  const r3 = destinoTeste(null);
  r3.erro = { codigo: "SEI_SESSAO_EXPIRADA", message: "x" };
  const mr3 = montar({ destino: r3, area: areaMemoria({ [CHAVE]: indisponivel }), lerNoRecuo: true });
  const sr3 = await mr3.motor.sincronizar();
  checar("erro na leitura do recuo: o estado fica indisponivel", sr3.estado === "indisponivel" && r3.lidas === 1, sr3);

  secao("motor: aguardando permissao");
  let pode = false;
  const p1 = destinoConferindo(await textoDeOutro([item("b1", 50)]));
  const mp1 = montar({ destino: p1, permitido: async () => pode });
  mp1.repo.por("a1", "um", 100);
  const sp1 = await mp1.motor.sincronizar();
  checar(
    "ha o que gravar e nao pode: nao grava, marca aguardando e conta a puxada",
    p1.gravadas === 0 &&
      sp1.estado === "nunca" &&
      sp1.aguardandoPermissao === true &&
      sp1.ultimoPuxar === 10_000_000 &&
      mp1.repo.itens.has("b1"),
    sp1,
  );
  pode = true;
  const sp2 = await mp1.motor.sincronizar({ forcar: true });
  checar(
    "com a permissao: grava, e a marca sai",
    p1.gravadas === 1 && sp2.estado === "ok" && !sp2.aguardandoPermissao && ids(await itensDoTexto(p1.html)) === "a1,b1",
    sp2,
  );

  secao("controle: texto lido por todos (le sem consentimento, grava com ele)");
  const area = areaMemoria();
  const prefs = areaMemoria();
  const repo = repoTeste();
  const remoto = destinoConferindo(await textoDeOutro([item("b1", 50)]));
  const porta = consentimentoNaArea({ area: prefs, chavePreferencias: "teste/preferencias", campo: "textoPadrao", chave: "k|un" });
  const c = new ControleTextoPadrao<EnvTeste>({
    area,
    adaptador: adaptadorTeste(repo),
    armazem: () => ({ ...remoto, excluir: async () => false }),
    consentimento: porta,
    aoMudarLocal: (cb) => repo.aoMudar(cb),
    travar: (_n, fn) => fn(),
    atrasoEnvio: 10,
    lerSemConsentimento: true,
  });
  await c.iniciar({ puxar: true });
  await tique(30);
  // A gravação da própria mescla agenda mais uma rodada, que acha tudo igual (uma leitura a mais, e para).
  checar("sem consentimento: le e mescla o do colega", remoto.lidas >= 1 && repo.itens.has("b1") && remoto.gravadas === 0, remoto);
  repo.por("a1", "um", 200);
  await tique(60);
  const st = (await area.obter(CHAVE))[CHAVE] as StatusSync | undefined;
  checar("mudanca local sem consentimento: nao grava e fica aguardando", remoto.gravadas === 0 && st?.aguardandoPermissao === true, st);
  await definirConsentimento(prefs, "teste/preferencias", "textoPadrao", "k|un", "ligado");
  await tique(60);
  checar(
    "consentiu: grava na hora o que esperava",
    remoto.gravadas === 1 && ids(await itensDoTexto(remoto.html)) === "a1,b1",
    await itensDoTexto(remoto.html),
  );
  await definirConsentimento(prefs, "teste/preferencias", "textoPadrao", "k|un", "desligado");
  await tique(30);
  checar("desligado: continua lendo (puxar responde)", (await c.puxar()) !== null);
  c.parar();
  let perguntas = 0;
  const repo2 = repoTeste();
  const remoto2 = destinoConferindo(null);
  const c2 = new ControleTextoPadrao<EnvTeste>({
    area: areaMemoria(),
    adaptador: adaptadorTeste(repo2),
    armazem: () => ({ ...remoto2, excluir: async () => false }),
    consentimento: porta,
    aoMudarLocal: (cb) => repo2.aoMudar(cb),
    travar: (_n, fn) => fn(),
    lerSemConsentimento: true,
    permitido: async () => {
      perguntas++;
      return true;
    },
  });
  repo2.por("a1", "um", 100);
  await c2.agora();
  checar("permitido proprio do modulo no lugar do consentimento", perguntas === 1 && remoto2.gravadas === 1);
  c2.parar();
}
```

Em `sei-comum/tests/verificar.ts`, troque:

```ts
import { verificarMotorTexto } from "./verificar-motor";
```

por:

```ts
import { verificarMotorTexto } from "./verificar-motor";
import { verificarMotorUnidade } from "./verificar-motor-unidade";
```

Em `sei-comum/tests/verificar.ts`, troque:

```ts
await verificarMotorTexto();
```

por:

```ts
await verificarMotorTexto();
await verificarMotorUnidade();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/sei-comum" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `SyntaxError: The requested module '../src/sincronia/codec' does not provide an export named 'ErroConteudoGrande'`

- [ ] **Step 3: Implementar**

Arquivo completo `sei-comum/src/sincronia/codec.ts`:

```ts
/**
 * Codificação para guardar dados num campo de texto do SEI (Texto Padrão):
 * JSON → gzip (CompressionStream) → base64url, em parágrafos de 2.000
 * caracteres, depois de um parágrafo legível que avisa o que é aquilo.
 *
 * Base64url só tem `[A-Za-z0-9_-]`: passa pelo filtro de XSS do SEI, sobrevive
 * ao Latin-1 e ao escape duplo que o SEI 5 aplica na leitura (prova P1). Um
 * parágrafo com qualquer outra coisa depois do legível significa que alguém
 * editou o texto: a leitura devolve `null` e quem chamou trata como inválido.
 *
 * A volta tem teto no tamanho DESCOMPACTADO (`LIMITE_DESCOMPACTADO`): poucos KB
 * de gzip podem virar centenas de MB (o Texto Padrão da unidade é de todos e
 * pode ser editado à mão), e o `JSON.parse` disso travaria a aba.
 */

const BLOCO = 2000;

/** 8 MB de JSON: dezenas de vezes o que cabe num Texto Padrão de 100 KB comprimido. */
export const LIMITE_DESCOMPACTADO = 8 * 1024 * 1024;

/** O conteúdo descompactado passou do limite: quem lê trata como texto inválido. */
export class ErroConteudoGrande extends Error {
  constructor(limite: number) {
    super(`O conteúdo descompactado passa de ${Math.round(limite / 1024 / 1024)} MB.`);
    this.name = "ErroConteudoGrande";
  }
}

async function transformar(bytes: Uint8Array, t: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const saida = new Blob([bytes as Uint8Array<ArrayBuffer>]).stream().pipeThrough(t);
  return new Uint8Array(await new Response(saida).arrayBuffer());
}

function paraBase64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64url(texto: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(texto)) throw new Error("Conteúdo fora do formato base64url.");
  const b64 = texto
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(texto.length / 4) * 4, "=");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function codificar(valor: unknown): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(valor));
  return paraBase64url(await transformar(json, new CompressionStream("gzip")));
}

/** Descompacta lendo aos pedaços e desiste (cancelando o fluxo) assim que passa de `limite` bytes. */
async function descompactar(bytes: Uint8Array, limite: number): Promise<Uint8Array> {
  const leitor = new Blob([bytes as Uint8Array<ArrayBuffer>]).stream().pipeThrough(new DecompressionStream("gzip")).getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.byteLength;
    if (total > limite) {
      await leitor.cancel().catch(() => undefined);
      throw new ErroConteudoGrande(limite);
    }
    partes.push(value);
  }
  const saida = new Uint8Array(total);
  let pos = 0;
  for (const p of partes) {
    saida.set(p, pos);
    pos += p.byteLength;
  }
  return saida;
}

export async function decodificar(texto: string, limite = LIMITE_DESCOMPACTADO): Promise<unknown> {
  const bytes = await descompactar(deBase64url(texto), limite);
  return JSON.parse(new TextDecoder().decode(bytes));
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function paraParagrafos(legivel: string, b64: string, bloco = BLOCO): string {
  const partes = [`<p>${escapar(legivel)}</p>`];
  for (let i = 0; i < b64.length; i += bloco) partes.push(`<p>${b64.slice(i, i + bloco)}</p>`);
  return partes.join("\n");
}

/** Desfaz até dois níveis de escape do HTML (o SEI 5 devolve o conteúdo escapado mais uma vez). */
function desescapar(html: string): string {
  let s = html;
  for (let i = 0; i < 2 && /&lt;\s*\/?p[\s>&]/i.test(s); i++) {
    s = s
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
  }
  return s;
}

/** Os blocos depois do parágrafo legível, juntos; `null` se não houver ou se algum foi editado. */
export function deParagrafos(html: string): string | null {
  const paragrafos = [...desescapar(html).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => (m[1] ?? "").trim());
  const blocos = paragrafos.slice(1);
  if (!blocos.length || !blocos.every((b) => /^[A-Za-z0-9_-]+$/.test(b))) return null;
  return blocos.join("");
}
```

Arquivo completo `sei-comum/src/sincronia/textoPadraoCodec.ts`:

```ts
/**
 * O lado "Texto Padrão" de toda sincronia do SEI Pro: o nome do texto, o
 * conteúdo gravado (um parágrafo legível + os blocos do codec) e a leitura de
 * volta. O envelope é de quem usa (Favoritos, Projetos): aqui ele só é
 * codificado e decodificado. A validação do envelope é do adaptador (motor.ts).
 */

import { hashCurto } from "../texto";
import { codificar, decodificar, deParagrafos, ErroConteudoGrande, LIMITE_DESCOMPACTADO, paraParagrafos } from "./codec";

/** Todo texto de dados do SEI Pro começa assim (e sai do seletor do SEI: controlePagina.ts). */
export const PREFIXO_TEXTO_INTERNO = "[_SEIPRO_";
/** O limite do campo "Nome" do Texto Padrão no SEI. */
export const LIMITE_NOME_TEXTO = 50;

/** O que o adaptador diz do envelope lido: bom, inválido (com o motivo) ou de versão mais nova do SEI Pro. */
export type ValidacaoTexto<E> = { ok: E } | { invalido: string } | { maisNovo: true };

export type LeituraTexto = { bruto: unknown } | { invalido: string };

/**
 * `[_SEIPRO_<SIGLA>_<chave>]` em até 50 caracteres. Chave longa (login com
 * domínio) fica com o começo, `~` e 8 hexadecimais do hash da chave inteira:
 * logins longos diferentes não colidem. A chave entra como veio: quem chama
 * decide a caixa (login em minúsculas, "UNIDADE" em maiúsculas).
 */
export function nomeDeTextoInterno(sigla: string, chave: string): string {
  const inicio = `${PREFIXO_TEXTO_INTERNO}${sigla}_`;
  const nome = `${inicio}${chave}]`;
  if (nome.length <= LIMITE_NOME_TEXTO) return nome;
  const cabe = LIMITE_NOME_TEXTO - inicio.length - 1 - 8 - 1;
  return `${inicio}${chave.slice(0, cabe)}~${hashCurto(chave).slice(0, 8)}]`;
}

export async function gerarConteudoTexto(legivel: string, envelope: unknown): Promise<string> {
  return paraParagrafos(legivel, await codificar(envelope));
}

/**
 * O JSON guardado no texto, ou o motivo de não haver um (texto editado, vazio, corrompido ou que
 * descompactado passaria de `limite` bytes).
 */
export async function lerConteudoTexto(html: string, limite = LIMITE_DESCOMPACTADO): Promise<LeituraTexto> {
  const b64 = deParagrafos(html);
  if (!b64) return { invalido: "o texto não tem os dados do SEI Pro (foi editado ou está vazio)" };
  try {
    return { bruto: await decodificar(b64, limite) };
  } catch (e) {
    if (e instanceof ErroConteudoGrande) return { invalido: "os dados do texto descompactados passam do limite" };
    return { invalido: "os dados do texto estão corrompidos" };
  }
}

/** Gravado por uma versão mais nova do SEI Pro: esta não entende o formato e não pode regravar por cima. */
export function versaoMaisNova(bruto: unknown, formato: string, versaoAtual: number): boolean {
  const b = bruto as { formato?: unknown; versao?: unknown } | null;
  return b?.formato === formato && typeof b.versao === "number" && b.versao > versaoAtual;
}
```

Arquivo completo `sei-comum/src/sincronia/motor.ts`:

```ts
/**
 * Motor genérico da sincronia de UM Texto Padrão (um escopo de um módulo):
 * puxar → validar → mesclar → (se mudou) reler → gravar. O módulo entra por um
 * adaptador (envelope, mesclagem, assinatura, teto, mensagens). A mesclagem é
 * a do módulo (vence a versão mais recente de cada entidade, com lápides), então
 * a rodada pode se repetir sem medo, em qualquer aba e em qualquer ordem.
 *
 * - Puxa no máximo a cada `intervaloPuxar` (5 min), salvo pendência local ou pedido do usuário.
 * - Mudança local marca "pendente" NA HORA (persistido: se a página fechar, a
 *   próxima carga envia) e envia `atrasoEnvio` (15 s) depois da última.
 *   Mudança feita durante uma rodada, depois do exportar, não se perde: cada
 *   mudança soma uma geração, e a rodada que não levou a geração atual termina
 *   ainda pendente e rearma o envio. O envio que acha a trava ocupada (outra
 *   aba, ou a rodada desta) também é rearmado.
 * - Texto inválido (editado à mão, corrompido, de outro escopo) nunca apaga
 *   nada: é regravado a partir do local, depois de `antesDeRegravarInvalido`
 *   (a hora da cópia do módulo; se ele falhar, não grava). De versão mais
 *   nova: não é tocado.
 * - Acima do teto não grava (e explica); acima do aviso grava e avisa.
 * - Sem permissão de Texto Padrão: "indisponível", e não insiste por um dia.
 * - Releitura: logo antes de gravar (já conferida a permissão), lê de novo e
 *   compara a carga (o escape a mais do SEI 5 não conta como mudança). Se
 *   outra pessoa (o texto da unidade é de todos) ou outro computador gravou no
 *   meio, mescla de novo e recalcula. São até `releituras` releituras (3), ou
 *   seja, até `releituras - 1` novas mesclas (2): se a última releitura ainda
 *   achar o texto mudado, não grava e fica pendente, com nova tentativa armada
 *   em espera crescente (15 s, 30 s, 1 min, 2 min, 4 min, teto de 5 min, mais
 *   um sorteio de até metade da espera, para dois usuários não voltarem
 *   juntos); a espera volta ao começo depois de uma rodada que deixa o texto em
 *   dia. Ninguém perde o que gravou. `releituras: 0` desliga (os Favoritos: um
 *   texto por pessoa).
 * - Uma trava por texto (Web Locks, quando a página tem) evita duas abas
 *   juntas; e o conteúdo igual ao remoto não é regravado.
 * - Destino que confere sozinho (`gravarConferindo`, o armazém do núcleo): a
 *   conferência do conteúdo anterior vai junto da gravação (lê o formulário de
 *   alterar e só posta se o texto ainda é o lido), no lugar da releitura; se
 *   mudou, devolve o atual, que entra na próxima tentativa da mesma conta.
 * - Texto que ainda não existe e não teria nada (`vazio`): não é criado.
 * - `lerNoRecuo`: durante o recuo de "indisponível" (quem pode ler mas não
 *   gravar), as puxadas continuam, só sem gravar.
 */

import type { Area } from "../armazenamento/area";
import { deParagrafos } from "./codec";
import { gerarConteudoTexto, lerConteudoTexto, type ValidacaoTexto } from "./textoPadraoCodec";
import type { Travar } from "./trava";

export interface StatusSync {
  estado: "ok" | "erro" | "indisponivel" | "nunca";
  /** Última tentativa. */
  quando: number;
  ultimoOk?: number;
  ultimoPuxar?: number;
  mensagem?: string;
  /** Bytes do último conteúdo gravado ou lido. */
  tamanho?: number;
  /** Há mudança local ainda não enviada. */
  pendente: boolean;
  indisponivelAte?: number;
  /** A última rodada tinha o que gravar, mas `permitido` disse não (o texto fica como estava). */
  aguardandoPermissao?: boolean;
}

/** O que o motor sabe do texto lido, para o destino conferir na hora de gravar. */
export interface ConferenciaTexto {
  /** O conteúdo da última leitura (null: o texto não existia). */
  anterior: string | null;
  /** A mesma carga? (o escape a mais do SEI 5 não conta como mudança) */
  mesmo(a: string | null, b: string | null): boolean;
}

/** `gravado: false`: o texto não era mais o `anterior`; `atual` é o que ele tem agora (null: sumiu). */
export type ResultadoGravacao = { gravado: true } | { gravado: false; atual: string | null };

export interface DestinoTexto {
  ler(): Promise<string | null>;
  gravar(html: string): Promise<void>;
  /** Grava só se o texto ainda é o `anterior` (conferido junto da gravação); senão devolve o atual. */
  gravarConferindo?(html: string, c: ConferenciaTexto): Promise<ResultadoGravacao>;
}

export interface MensagensMotor {
  maisNovo: string;
  grandeDemais(kb: number, tetoKb: number): string;
  pertoDoTeto(kb: number): string;
  invalidoRegravado(motivo: string): string;
  mudouDuranteGravacao: string;
}

export const MENSAGENS_MOTOR: MensagensMotor = {
  maisNovo:
    "Os dados no SEI foram gravados por uma versão mais nova do SEI Pro. Atualize a extensão neste computador; o texto não foi alterado.",
  grandeDemais: (kb, tetoKb) => `Os dados ficaram grandes demais para o Texto Padrão (${kb} KB de ${tetoKb} KB).`,
  pertoDoTeto: (kb) => `Os dados estão perto do limite do Texto Padrão (${kb} KB).`,
  invalidoRegravado: (motivo) => `O texto no SEI estava inválido (${motivo}) e foi regravado a partir deste computador.`,
  mudouDuranteGravacao: "O texto no SEI mudou enquanto era gravado (outra pessoa sincronizando). Nova tentativa na próxima rodada.",
};

/** O que o módulo ensina ao motor. Um adaptador por texto (escopo). */
export interface AdaptadorTexto<E> {
  /** Nome do módulo: a trava é `seipro-<modulo>-sync|<chaveStatus>`. */
  modulo: string;
  /** Onde o StatusSync deste texto fica na área local. */
  chaveStatus: string;
  /** Tamanho máximo do conteúdo (bytes do HTML): acima, não grava. */
  teto: number;
  /** Acima disto grava, mas avisa. */
  aviso: number;
  /** O parágrafo legível que abre o texto. */
  legivel(): string;
  /** O JSON lido do texto: envelope bom, inválido (motivo) ou de versão mais nova. */
  validar(bruto: unknown): ValidacaoTexto<E>;
  /** Mescla no armazenamento local (vence o mais recente; lápides valem). */
  importar(envelope: E): Promise<void>;
  /**
   * O envelope a gravar. `remoto`: o que o texto tem agora (null se não há ou é inválido);
   * `invalido`: true se o texto EXISTE mas é inválido (codec ou `validar`), false se não há
   * texto ou ele é bom; `agora`: para podar lápides.
   */
  exportar(c: { remoto: E | null; agora: number; invalido: boolean }): Promise<E>;
  /** Igual para o mesmo conteúdo em qualquer computador (sem quem gravou nem quando). */
  assinatura(envelope: E): string;
  /**
   * Logo antes de regravar por cima de um texto que existe mas é inválido (o codec recusou,
   * ou `validar` disse inválido), com o motivo e o HTML que vai ser substituído: a hora de
   * garantir a cópia (spec 6.1). Se lançar, o motor não grava (fica em erro, nada local muda).
   * Vem antes da releitura (que fica colada na gravação): se a releitura achar o texto mudado
   * e ele continuar inválido, é chamado de novo com o HTML novo; o da última chamada é o substituído.
   */
  antesDeRegravarInvalido?(motivo: string, html: string): Promise<void>;
  /** Nada a guardar: sem texto no SEI, o motor não cria um só para isto. */
  vazio?(envelope: E): boolean;
  mensagens?: Partial<MensagensMotor>;
}

/** Os envios agendados (setTimeout/clearTimeout por padrão); as provas trocam para ver as esperas. */
export interface Temporizador {
  definir(fn: () => void, ms: number): unknown;
  cancelar(id: unknown): void;
}

const TEMPORIZADOR_PADRAO: Temporizador = {
  definir: (fn, ms) => setTimeout(fn, ms),
  cancelar: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
};

export interface DepsMotorTexto<E> {
  adaptador: AdaptadorTexto<E>;
  destino: DestinoTexto;
  /** Área local (o StatusSync). */
  area: Area;
  /** Roda `fn` com a trava; devolve null se outra aba já está com ela. */
  travar: Travar;
  agora?: () => number;
  /** Envio depois da última mudança local (15 s); também a primeira espera depois de desistir. */
  atrasoEnvio?: number;
  /** Intervalo mínimo entre duas puxadas sem pendência (5 min). */
  intervaloPuxar?: number;
  /** Releituras antes de gravar (3, ou seja, até 2 novas mesclas); 0 desliga. */
  releituras?: number;
  /** Ainda pode gravar? (O usuário pode ter desligado durante a rodada.) */
  permitido?: () => Promise<boolean>;
  /** Os envios agendados (setTimeout/clearTimeout). */
  temporizador?: Temporizador;
  /** O sorteio do atraso da nova tentativa, em [0, 1) (Math.random). */
  aleatorio?: () => number;
  /** No recuo de "indisponível", continua puxando (sem gravar) a cada `intervaloPuxar`. */
  lerNoRecuo?: boolean;
}

const CINCO_MIN = 5 * 60_000;
const UM_DIA = 86_400_000;

export const nomeDaTrava = (modulo: string, chaveStatus: string): string => `seipro-${modulo}-sync|${chaveStatus}`;

/** A releitura compara a carga (os blocos do codec), que resiste ao escape a mais do SEI 5; sem carga (texto inválido), o HTML cru. */
export function mesmoConteudo(a: string | null, b: string | null): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  const ca = deParagrafos(a);
  const cb = deParagrafos(b);
  return ca !== null && cb !== null && ca === cb;
}

export function textoDoErro(e: unknown): { estado: StatusSync["estado"]; mensagem: string } {
  const codigo = (e as { codigo?: string } | null)?.codigo;
  if (codigo === "SEI_SESSAO_EXPIRADA") return { estado: "erro", mensagem: "Sessão do SEI expirada. Entre de novo no SEI." };
  if (codigo === "SEI_ACAO_INDISPONIVEL")
    return { estado: "indisponivel", mensagem: "Indisponível nesta unidade: o SEI não oferece Textos Padrão para você aqui." };
  return { estado: "erro", mensagem: e instanceof Error ? e.message : String(e) };
}

export class MotorTextoPadrao<E> {
  private espera: unknown;
  /** Soma 1 a cada mudança local: a rodada que exportou uma geração anterior termina pendente. */
  private geracao = 0;
  /** Desistências seguidas (texto mudando a cada releitura): a espera da nova tentativa dobra. */
  private desistencias = 0;
  /** `parar()` foi chamado: uma rodada que ainda termine não rearma o envio. */
  private parado = false;

  constructor(private readonly d: DepsMotorTexto<E>) {}

  private get temporizador(): Temporizador {
    return this.d.temporizador ?? TEMPORIZADOR_PADRAO;
  }

  private get atrasoEnvio(): number {
    return this.d.atrasoEnvio ?? 15_000;
  }

  private agora(): number {
    return this.d.agora?.() ?? Date.now();
  }

  async status(): Promise<StatusSync> {
    const k = this.d.adaptador.chaveStatus;
    const v = (await this.d.area.obter(k))[k] as StatusSync | undefined;
    return v ?? { estado: "nunca", quando: 0, pendente: false };
  }

  private async gravarStatus(m: Partial<StatusSync>): Promise<StatusSync> {
    // "Aguardando permissão" vale só para a rodada que o gravou.
    const novo = { ...(await this.status()), aguardandoPermissao: undefined, ...m };
    await this.d.area.gravar({ [this.d.adaptador.chaveStatus]: novo });
    return novo;
  }

  async marcarPendente(): Promise<void> {
    this.geracao++;
    const s = await this.status();
    if (!s.pendente) await this.gravarStatus({ pendente: true });
  }

  /** Mudança local: pendente na hora, envio `atrasoEnvio` depois da última. */
  agendarEnvio(): Promise<void> {
    this.parado = false;
    this.armar(this.atrasoEnvio);
    return this.marcarPendente();
  }

  parar(): void {
    this.parado = true;
    if (this.espera !== undefined) this.temporizador.cancelar(this.espera);
    this.espera = undefined;
  }

  private armar(ms: number): void {
    if (this.espera !== undefined) this.temporizador.cancelar(this.espera);
    this.espera = this.temporizador.definir(() => {
      this.espera = undefined;
      void this.enviarAgendado().catch(() => undefined);
    }, ms);
  }

  /** Arma de novo o envio, salvo se `parar()` veio no meio da rodada. */
  private rearmar(ms: number): void {
    if (!this.parado) this.armar(ms);
  }

  private async enviarAgendado(): Promise<void> {
    // Trava ocupada (outra aba, ou a rodada desta ainda em curso): sem rearmar, a mudança esperaria a próxima carga.
    if ((await this.executar(true)) === null) this.rearmar(this.atrasoEnvio);
  }

  async sincronizar(o: { forcar?: boolean } = {}): Promise<StatusSync> {
    this.parado = false;
    return (await this.executar(o.forcar === true)) ?? (await this.status());
  }

  /** null: a trava estava ocupada e a rodada não rodou. */
  private async executar(forcar: boolean): Promise<StatusSync | null> {
    const agora = this.agora();
    const s = await this.status();
    const intervalo = this.d.intervaloPuxar ?? CINCO_MIN;
    const a = this.d.adaptador;
    const nome = nomeDaTrava(a.modulo, a.chaveStatus);
    if (!forcar) {
      if (s.estado === "indisponivel" && (s.indisponivelAte ?? 0) > agora) {
        if (!this.d.lerNoRecuo || (s.ultimoPuxar && agora - s.ultimoPuxar < intervalo)) return s;
        return this.d.travar(nome, () => this.soLer(agora));
      }
      if (!s.pendente && s.ultimoPuxar && agora - s.ultimoPuxar < intervalo) return s;
    }
    return this.d.travar(nome, () => this.rodada(agora));
  }

  /** Recuo de "indisponível" com `lerNoRecuo`: lê e mescla, sem gravar; o estado e a mensagem ficam. */
  private async soLer(agora: number): Promise<StatusSync> {
    try {
      const remoto = await this.d.destino.ler();
      if (remoto !== null) {
        const r = await this.validar(remoto);
        if ("ok" in r) await this.d.adaptador.importar(r.ok);
      }
      return this.gravarStatus({ ultimoPuxar: agora, tamanho: remoto?.length });
    } catch {
      // Sem insistir: a próxima puxada é depois do intervalo.
      return this.gravarStatus({ ultimoPuxar: agora });
    }
  }

  /** O texto mudou a cada conferência: não grava, fica pendente e tenta de novo com espera crescente. */
  private async desistir(agora: number, m: MensagensMotor): Promise<StatusSync> {
    this.desistencias++;
    const s = await this.gravarStatus({
      estado: "erro",
      quando: agora,
      ultimoPuxar: agora,
      pendente: true,
      mensagem: m.mudouDuranteGravacao,
    });
    this.rearmar(this.esperaDepoisDeDesistir());
    return s;
  }

  /** 15 s, 30 s, 1 min, 2 min, 4 min, 5 min (teto), mais um sorteio de até metade da espera. */
  private esperaDepoisDeDesistir(): number {
    const espera = Math.min(this.atrasoEnvio * 2 ** Math.max(0, this.desistencias - 1), CINCO_MIN);
    return espera + Math.floor((this.d.aleatorio ?? Math.random)() * (espera / 2));
  }

  /**
   * Fim de rodada que deixou o texto em dia. Pendente (e com o envio rearmado) se houve
   * mudança local depois do exportar desta rodada: ela não está no que foi gravado.
   */
  private async concluir(geracao: number, m: Partial<StatusSync>): Promise<StatusSync> {
    this.desistencias = 0;
    let s = await this.gravarStatus({ ...m, pendente: this.geracao !== geracao });
    // Uma mudança entre a conta acima e a gravação do status pode ter tido a marca sobrescrita.
    if (!s.pendente && this.geracao !== geracao) s = await this.gravarStatus({ pendente: true });
    if (s.pendente) this.rearmar(this.atrasoEnvio);
    return s;
  }

  private async validar(html: string): Promise<ValidacaoTexto<E>> {
    const r = await lerConteudoTexto(html);
    return "invalido" in r ? r : this.d.adaptador.validar(r.bruto);
  }

  private async rodada(agora: number): Promise<StatusSync> {
    const a = this.d.adaptador;
    const m = { ...MENSAGENS_MOTOR, ...a.mensagens };
    const releituras = this.d.releituras ?? 3;
    try {
      let remoto = await this.d.destino.ler();
      for (let tentativa = 0; ; tentativa++) {
        let lido: E | null = null;
        let invalido: string | null = null;
        if (remoto !== null) {
          const r = await this.validar(remoto);
          if ("maisNovo" in r) return this.gravarStatus({ estado: "erro", quando: agora, ultimoPuxar: agora, mensagem: m.maisNovo });
          if ("ok" in r) {
            await a.importar(r.ok);
            lido = r.ok;
          } else {
            invalido = r.invalido;
          }
        }
        // O que mudar localmente daqui em diante não entra neste envelope.
        const geracao = this.geracao;
        const env = await a.exportar({ remoto: lido, agora, invalido: invalido !== null });
        if (remoto !== null && lido !== null && a.assinatura(env) === a.assinatura(lido)) {
          return this.concluir(geracao, {
            estado: "ok",
            quando: agora,
            ultimoOk: agora,
            ultimoPuxar: agora,
            mensagem: undefined,
            tamanho: remoto.length,
          });
        }
        if (remoto === null && a.vazio?.(env)) {
          return this.concluir(geracao, {
            estado: "ok",
            quando: agora,
            ultimoOk: agora,
            ultimoPuxar: agora,
            mensagem: undefined,
            tamanho: 0,
          });
        }
        const html = await gerarConteudoTexto(a.legivel(), env);
        const kb = Math.ceil(html.length / 1024);
        if (html.length > a.teto) {
          return this.gravarStatus({
            estado: "erro",
            quando: agora,
            ultimoPuxar: agora,
            tamanho: html.length,
            mensagem: m.grandeDemais(kb, Math.round(a.teto / 1024)),
          });
        }
        // Antes da releitura, para que ela fique colada na gravação.
        if (this.d.permitido && !(await this.d.permitido())) {
          return this.gravarStatus({
            estado: "nunca",
            quando: agora,
            ultimoPuxar: agora,
            pendente: false,
            mensagem: undefined,
            aguardandoPermissao: true,
          });
        }
        if (remoto !== null && invalido !== null) await a.antesDeRegravarInvalido?.(invalido, remoto);
        const conferir = releituras > 0 ? this.d.destino.gravarConferindo?.bind(this.d.destino) : undefined;
        if (releituras > 0 && !conferir) {
          const deNovo = await this.d.destino.ler();
          if (!mesmoConteudo(deNovo, remoto)) {
            if (tentativa + 1 >= releituras) return this.desistir(agora, m);
            remoto = deNovo;
            continue;
          }
        }
        if (conferir) {
          const r = await conferir(html, { anterior: remoto, mesmo: mesmoConteudo });
          if (!r.gravado) {
            if (tentativa + 1 >= releituras) return this.desistir(agora, m);
            remoto = r.atual;
            continue;
          }
        } else {
          await this.d.destino.gravar(html);
        }
        return this.concluir(geracao, {
          estado: "ok",
          quando: agora,
          ultimoOk: agora,
          ultimoPuxar: agora,
          tamanho: html.length,
          mensagem: invalido ? m.invalidoRegravado(invalido) : html.length > a.aviso ? m.pertoDoTeto(kb) : undefined,
        });
      }
    } catch (e) {
      const t = textoDoErro(e);
      return this.gravarStatus({
        estado: t.estado,
        mensagem: t.mensagem,
        quando: agora,
        indisponivelAte: t.estado === "indisponivel" ? agora + UM_DIA : undefined,
      });
    }
  }
}
```

Arquivo completo `sei-comum/src/sincronia/controlePagina.ts`:

```ts
/**
 * A sincronia por Texto Padrão do lado da aba do SEI (o content script tem a
 * sessão). Um controle por texto. Liga e desliga sozinho conforme o
 * consentimento daquele texto (porta do módulo), que o usuário decide no app:
 * - ao iniciar (o módulo diz se puxa: a caixa do Controle de Processos, por
 *   exemplo), ou se ficou pendência de uma carga anterior;
 * - qualquer mudança local (aqui, no app ou em outra aba) é enviada
 *   `atrasoEnvio` depois;
 * - `puxar()` ao ganhar foco; `agora()` e `apagar()` a pedido do app.
 *
 * Texto lido por todos (o da unidade nos Projetos, `lerSemConsentimento`): o
 * controle fica ligado desde o começo (lê e mescla o que os colegas gravaram) e
 * só a GRAVAÇÃO espera o consentimento; quando ele chega, a rodada vem na hora.
 */

import type { Area } from "../armazenamento/area";
import type { PortaConsentimento } from "./consentimento";
import {
  type AdaptadorTexto,
  type ConferenciaTexto,
  type DestinoTexto,
  MotorTextoPadrao,
  nomeDaTrava,
  type ResultadoGravacao,
  type StatusSync,
} from "./motor";
import { PREFIXO_TEXTO_INTERNO } from "./textoPadraoCodec";
import type { Travar, TravarEsperando } from "./trava";

/** Esconde os textos de dados do SEI Pro no seletor "Texto Padrão" ao gerar documento. É cosmético: o dado continua no SEI. */
export function ocultarTextosInternos(doc: Document): number {
  let n = 0;
  for (const o of doc.querySelectorAll<HTMLOptionElement>('select#selTextoPadrao option, select[name="selTextoPadrao"] option')) {
    if ((o.textContent ?? "").trim().startsWith(PREFIXO_TEXTO_INTERNO)) {
      o.remove();
      n++;
    }
  }
  return n;
}

export interface ArmazemTexto extends DestinoTexto {
  /** true se havia o texto e ele foi excluído. */
  excluir(): Promise<boolean>;
  /** Para conferir que o texto sumiu depois de excluir. */
  localizar?(): Promise<unknown>;
  gravarConferindo?(html: string, c: ConferenciaTexto): Promise<ResultadoGravacao>;
}

export interface DepsControlePagina<E> {
  /** Área local (o StatusSync). */
  area: Area;
  adaptador: AdaptadorTexto<E>;
  /** Criado só na primeira rodada (o armazém do núcleo monta o Sei da aba). */
  armazem: () => ArmazemTexto;
  consentimento: PortaConsentimento;
  /** Mudança nos dados locais deste texto (o repositório do escopo). */
  aoMudarLocal(cb: () => void): () => void;
  travar: Travar;
  /** A mesma trava, mas ESPERANDO a vez (o "apagar" não pode ser pulado). */
  travarEsperando?: TravarEsperando;
  atrasoEnvio?: number;
  intervaloPuxar?: number;
  releituras?: number;
  agora?: () => number;
  /** O texto é lido (e mesclado) mesmo sem consentimento; só a gravação espera o "ligado". */
  lerSemConsentimento?: boolean;
  /** Ainda pode gravar? Padrão: o consentimento deste texto está "ligado". */
  permitido?: () => Promise<boolean>;
  /** Durante o recuo de "indisponível", continua lendo (motor.ts). */
  lerNoRecuo?: boolean;
}

export class ControleTextoPadrao<E> {
  private motor: MotorTextoPadrao<E> | null = null;
  private pararMudancas: (() => void) | null = null;
  private pararConsentimento: (() => void) | null = null;
  private ultimoEstado: string | null = null;

  constructor(private readonly d: DepsControlePagina<E>) {}

  private criarMotor(): MotorTextoPadrao<E> {
    const armazem = this.d.armazem();
    const destino: DestinoTexto = { ler: () => armazem.ler(), gravar: (h) => armazem.gravar(h) };
    if (armazem.gravarConferindo) destino.gravarConferindo = (h, c) => armazem.gravarConferindo!(h, c);
    return new MotorTextoPadrao<E>({
      adaptador: this.d.adaptador,
      destino,
      area: this.d.area,
      travar: this.d.travar,
      agora: this.d.agora,
      atrasoEnvio: this.d.atrasoEnvio,
      intervaloPuxar: this.d.intervaloPuxar,
      releituras: this.d.releituras,
      lerNoRecuo: this.d.lerNoRecuo,
      // Conferido logo antes de gravar: quem desligou (ou mandou apagar) no meio de uma rodada não ganha o texto de volta.
      permitido: this.d.permitido ?? (async () => (await this.d.consentimento.estado()) === "ligado"),
    });
  }

  private rodar(forcar: boolean): Promise<StatusSync> {
    this.motor ??= this.criarMotor();
    return this.motor.sincronizar({ forcar });
  }

  private ligar(puxar: boolean): void {
    if (this.pararMudancas) return;
    this.motor ??= this.criarMotor();
    // As escritas da própria mesclagem também chegam aqui: custam uma leitura a mais depois,
    // que acha tudo igual e não regrava. Ignorá-las por janela de tempo engoliria mudança do usuário.
    this.pararMudancas = this.d.aoMudarLocal(() => void this.motor?.agendarEnvio());
    if (puxar) void this.rodar(false).catch(() => undefined);
  }

  private desligar(): void {
    this.pararMudancas?.();
    this.pararMudancas = null;
    this.motor?.parar();
  }

  private async pendenteGravado(): Promise<boolean> {
    const k = this.d.adaptador.chaveStatus;
    return ((await this.d.area.obter(k))[k] as StatusSync | undefined)?.pendente === true;
  }

  async iniciar(o: { puxar: boolean }): Promise<void> {
    const estado = await this.d.consentimento.estado();
    this.ultimoEstado = estado;
    if (estado === "ligado" || this.d.lerSemConsentimento) this.ligar(o.puxar || (await this.pendenteGravado()));
    // Iniciar de novo (mesmo duas chamadas cruzadas) troca o ouvinte do consentimento em vez de somar outro.
    this.pararConsentimento?.();
    this.pararConsentimento = this.d.consentimento.aoMudar(() => {
      void this.d.consentimento.estado().then((e) => {
        const antes = this.ultimoEstado;
        this.ultimoEstado = e;
        if (e === "ligado") {
          const estavaLigado = this.pararMudancas !== null;
          this.ligar(false);
          // Acabou de ligar (ou de consentir, no texto lido por todos): o que estava esperando vai agora.
          if (!estavaLigado || antes !== "ligado") void this.rodar(true).catch(() => undefined);
        } else if (!this.d.lerSemConsentimento) {
          this.desligar();
        }
      });
    });
  }

  /** A aba ganhou foco: puxa se a sincronia está ligada, respeitando o intervalo. null = desligada. */
  async puxar(): Promise<StatusSync | null> {
    if (!this.pararMudancas) return null;
    return this.rodar(false);
  }

  /** "Sincronizar agora", pedido pelo app. */
  agora(): Promise<StatusSync> {
    return this.rodar(true);
  }

  /** "Apagar meus dados do SEI": exclui o texto e desliga a sincronia deste texto. */
  async apagar(): Promise<boolean> {
    this.desligar();
    await this.d.consentimento.definir("desligado");
    const armazem = this.d.armazem();
    const fazer = async () => {
      let excluiu = await armazem.excluir();
      // Confere: uma rodada que terminou nesse meio tempo (outra aba) pode ter gravado o texto de novo.
      if (armazem.localizar && (await armazem.localizar())) excluiu = (await armazem.excluir()) || excluiu;
      return excluiu;
    };
    // Na mesma trava da rodada: espera a que está em curso terminar, e só então exclui.
    const nome = nomeDaTrava(this.d.adaptador.modulo, this.d.adaptador.chaveStatus);
    const excluiu = this.d.travarEsperando ? await this.d.travarEsperando(nome, fazer) : await fazer();
    await this.d.area.gravar({
      [this.d.adaptador.chaveStatus]: { estado: "nunca", quando: Date.now(), pendente: false } satisfies StatusSync,
    });
    return excluiu;
  }

  parar(): void {
    this.desligar();
    this.pararConsentimento?.();
  }
}
```

- [ ] **Step 4: Rodar as provas (o sei-comum e quem o usa)**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && (cd sei-comum && npx tsx tests/verificar.ts 2>&1 | tail -2) && (cd favoritos && npx tsx tests/verificar.ts 2>&1 | tail -2) && (cd historico && npx tsx tests/verificar.ts 2>&1 | tail -2) && (cd projetos && npx tsx tests/verificar.ts 2>&1 | tail -2)
```
Expected: `447 ok, 0 falha(s)` (sei-comum, +28); `578 ok, 0 falha(s)` (favoritos); `485 ok, 0 falha(s)` (historico); `960 ok, 0 falha(s)` (projetos, igual à base).

- [ ] **Step 5: Portões e bundles dos Favoritos**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && (cd sei-comum && npx tsc --noEmit && npx biome check src tests) && (cd favoritos && npx tsc --noEmit && node build.mjs | tail -3) && LC_ALL=C grep -c $'[\x80-\xff]' dist/js/init_favoritos.js dist/js/favoritos/app.js
```
Expected: `tsc` sem saída; Biome sem erro (os 8 avisos de antes); o build dos Favoritos termina sem `ERRO:`; as duas contagens de bytes acima de 0x7f são `0`. O bundle do Histórico não muda (ele não usa o motor).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  sei-comum/src/sincronia/codec.ts \
  sei-comum/src/sincronia/textoPadraoCodec.ts \
  sei-comum/src/sincronia/motor.ts \
  sei-comum/src/sincronia/controlePagina.ts \
  sei-comum/tests/adaptadorTeste.ts \
  sei-comum/tests/verificar-motor-unidade.ts \
  sei-comum/tests/verificar.ts \
  dist/js/init_favoritos.js \
  dist/js/favoritos/app.js
git commit -m "$(cat <<'EOF'
Comum: motor confere na gravacao, le no recuo e nao cria texto vazio; codec com teto do descompactado

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 2: Núcleo — armazém de Texto Padrão lê sem o link de alterar, confere o anterior, resolve a duplicata e vive sem o `Sei`

**Files:**
- Modify: `sei-nucleo/src/dominio/textoPadrao.ts`, `sei-nucleo/src/links/links.ts`, `sei-nucleo/src/sei.ts`, `sei-nucleo/src/index.ts`, `sei-nucleo/tests/verificar.ts`
- Test: `sei-nucleo/tests/verificar-texto-padrao-conferencia.ts`
- Regerados: `dist/js/init_favoritos.js`, `dist/js/init_historico.js`, `dist/js/init_agente.js`, `dist/js/agente/painel.js` (empacotam o `Sei`, cujo `linkMenu` passa a chamar `linkDoMenu`; o dos Favoritos também o armazém)

**Interfaces:**
- Consumes: `Formulario` (`abrir`, `de`, `valor`, `definir`, `enviar`, `pares`), `urlContem`, `Sei` (`http.obter`, `http.enviar`, `linkMenu`), `ErroSei`, `Pagina`, `OpcoesHttp`; nas provas `paginaSintetica`, `checar`, `lanca`, `secao` e as telas reais `tests/fixtures/sei41/texto_padrao_{listar,consultar,alterar,cadastrar}.html`.
- Produces: `linkDoMenu(base: Pick<Pagina, "doc" | "html">, acao): string` (o corpo do antigo `Sei.linkMenu`, que agora o chama); `SeiDoTexto = Pick<Sei, "http" | "linkMenu">` e `criarArmazemTextoPadrao(sei: SeiDoTexto, o)` (o content script dos Projetos monta só `{ http, linkMenu }`, sem a classe `Sei`, cujo código de árvore o portão do build do P3 recusa no pacote); `TextoLocalizado { id; consultar; alterar?: string }`; `ConferenciaGravacao { anterior: string | null; mesmo(a, b): boolean }`; `ResultadoGravacao = { gravado: true } | { gravado: false; atual: string | null }`; `ArmazemTextoPadrao.gravarConferindo(html, c, op?) → Promise<ResultadoGravacao>`. `ler` e `localizar` acham a linha sem o link de alterar; `gravar` nela → `SEI_ACAO_INDISPONIVEL`; com duas linhas de mesmo nome vale a de menor id. As formas casam com `ConferenciaTexto`/`ResultadoGravacao` do motor (Tarefa 1) por estrutura: o núcleo não importa o sei-comum.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `sei-nucleo/tests/verificar-texto-padrao-conferencia.ts`:

```ts
/**
 * O texto que é de todos (o da unidade nos Projetos), contra as telas reais do
 * SEI 4.1.5: quem só lê (sem o link de alterar), a conferência do conteúdo
 * anterior no formulário de alterar, o texto que sumiu e a criação simultânea
 * (duplicata). Servidor falso com vários textos de mesmo nome.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type ConferenciaGravacao, criarArmazemTextoPadrao } from "../src/dominio/textoPadrao";
import { linkDoMenu } from "../src/links/links";
import { Sei } from "../src/sei";
import { checar, lanca, paginaSintetica, secao } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ler = (n: string) => readFileSync(join(AQUI, "fixtures", "sei41", n), "utf8").replace(/^<!-- url: .*? -->\n/, "");
const NOME = "[_SEIPRO_PRJ_UNIDADE]";
const RAIZ = "https://sei.exemplo.gov.br/sei/";

interface Texto {
  id: string;
  conteudo: string;
  alterar: boolean;
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Servidor falso: `textos` com o nosso nome (vários = duplicata); `colega` cria o dele junto do nosso cadastro. */
function servidor(textos: Texto[], o: { colega?: "antes" | "depois" } = {}) {
  const estado = { textos, posts: [] as Array<{ acao: string; corpo: string }>, alterarAberto: "" };
  const listar0 = ler("texto_padrao_listar.html");
  const modelo = listar0.split("\n").find((l) => l.includes('value="901"')) ?? "";
  const linha = (t: Texto) => {
    let l = modelo.replace(/901/g, t.id).replace(/ASSINATURA 2/g, NOME);
    if (!t.alterar) l = l.replace(/<a href="controlador\.php\?acao=texto_padrao_interno_alterar[^"]*"[^>]*>[\s\S]*?<\/a>/, "");
    return l;
  };
  const proximoId = () => String(Math.max(949, ...estado.textos.map((t) => Number(t.id))) + 1);
  const resp = (url: string, html: string) => {
    const bytes = new Uint8Array([...html].map((c) => c.charCodeAt(0) & 0xff));
    return { url, status: 200, arrayBuffer: async () => bytes.buffer } as unknown as Response;
  };
  const comConteudo = (html: string, c: string) => html.replace(/(<textarea[^>]*name="txaConteudo"[^>]*>)[\s\S]*?(<\/textarea>)/, `$1${escapar(c)}$2`);
  const idDe = (u: string) => /id_texto_padrao_interno=(\d+)/.exec(u)?.[1] ?? "";
  const lista = () =>
    resp(`${RAIZ}controlador.php?acao=texto_padrao_interno_listar&infra_hash=1`, listar0.replace(modelo, estado.textos.map(linha).join("\n")));
  const fetch = (async (u: string, init?: RequestInit) => {
    const acao = /[?&]acao=(\w+)/.exec(u)?.[1] ?? "";
    const corpo = String(init?.body ?? "");
    const post = init?.method === "POST";
    if (post) estado.posts.push({ acao, corpo });
    const campo = (n: string) => new URLSearchParams(corpo).get(n) ?? "";
    if (acao === "texto_padrao_interno_listar") return lista();
    if (acao === "texto_padrao_interno_cadastrar" && post) {
      const doColega = () => estado.textos.push({ id: proximoId(), conteudo: "<p>K</p>", alterar: true });
      if (o.colega === "antes") doColega();
      estado.textos.push({ id: proximoId(), conteudo: campo("txaConteudo"), alterar: true });
      if (o.colega === "depois") doColega();
      return lista();
    }
    if (acao === "texto_padrao_interno_alterar" && post) {
      const t = estado.textos.find((x) => x.id === estado.alterarAberto);
      if (t) t.conteudo = campo("txaConteudo");
      return lista();
    }
    if (acao === "texto_padrao_interno_excluir") {
      estado.textos = estado.textos.filter((t) => t.id !== campo("hdnInfraItemId"));
      return lista();
    }
    if (acao === "texto_padrao_interno_cadastrar") return resp(u, ler("texto_padrao_cadastrar.html"));
    if (acao === "texto_padrao_interno_alterar") {
      estado.alterarAberto = idDe(u);
      const t = estado.textos.find((x) => x.id === estado.alterarAberto);
      return resp(u, comConteudo(ler("texto_padrao_alterar.html"), t?.conteudo ?? ""));
    }
    if (acao === "texto_padrao_interno_consultar") {
      const t = estado.textos.find((x) => x.id === idDe(u));
      return resp(u, comConteudo(ler("texto_padrao_consultar.html"), t?.conteudo ?? ""));
    }
    return resp(u, "<html><body>?</body></html>");
  }) as unknown as typeof globalThis.fetch;
  const menu = `<a href="controlador.php?acao=texto_padrao_interno_listar&infra_item_menu=162&infra_hash=${"0".repeat(64)}">Textos Padrão</a>`;
  const base = paginaSintetica(`<div id="infraMenu">${menu}</div><form id="frmProtocoloPesquisaRapida"></form>`, `${RAIZ}controlador.php?acao=procedimento_controlar`);
  const sei = new Sei(base.url, () => base, { fetch });
  return { armazem: criarArmazemTextoPadrao(sei, { nome: NOME, descricao: "Projetos da unidade (SEI Pro)." }), estado, sei, base };
}

/** O `<textarea>` volta escapado (como o SEI 5 faz); quem compara desfaz, como o `mesmoConteudo` do sei-comum. */
const desfazer = (s: string | null) => (s === null ? null : s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
const conferencia = (anterior: string | null): ConferenciaGravacao => ({ anterior, mesmo: (a, b) => desfazer(a) === desfazer(b) });
const posts = (s: { estado: { posts: Array<{ acao: string }> } }, acao: string) => s.estado.posts.filter((p) => p.acao === acao).length;

export async function verificarTextoPadraoConferencia(): Promise<void> {
  secao("texto padrao: quem so le (sem o link de alterar)");
  const s1 = servidor([{ id: "901", conteudo: "<p>C</p>", alterar: false }]);
  const achado = await s1.armazem.localizar();
  checar("localiza pela consulta, sem o alterar", achado?.id === "901" && !!achado.consultar && achado.alterar === undefined, achado);
  checar("le o conteudo", desfazer(await s1.armazem.ler()) === "<p>C</p>");
  const e1 = await lanca(() => s1.armazem.gravar("<p>N</p>"));
  checar(
    "gravar sem poder alterar: SEI_ACAO_INDISPONIVEL e nada de cadastrar outro",
    e1?.codigo === "SEI_ACAO_INDISPONIVEL" && posts(s1, "texto_padrao_interno_cadastrar") === 0,
    e1,
  );
  const e2 = await lanca(() => s1.armazem.gravarConferindo("<p>N</p>", conferencia("<p>C</p>")));
  checar("gravarConferindo idem", e2?.codigo === "SEI_ACAO_INDISPONIVEL");

  secao("texto padrao: conferencia do anterior no formulario de alterar");
  const s2 = servidor([{ id: "901", conteudo: "<p>C</p>", alterar: true }]);
  const r2 = await s2.armazem.gravarConferindo("<p>N</p>", conferencia(await s2.armazem.ler()));
  checar(
    "ainda e o lido: posta a alteracao",
    r2.gravado && s2.estado.textos[0]?.conteudo === "<p>N</p>" && posts(s2, "texto_padrao_interno_alterar") === 1,
    { r2, textos: s2.estado.textos },
  );
  const s3 = servidor([{ id: "901", conteudo: "<p>do colega</p>", alterar: true }]);
  const r3 = await s3.armazem.gravarConferindo("<p>N</p>", conferencia("<p>C</p>"));
  checar(
    "mudou desde a leitura: nao posta e devolve o atual",
    !r3.gravado && desfazer(r3.atual) === "<p>do colega</p>" && posts(s3, "texto_padrao_interno_alterar") === 0,
    r3,
  );
  const s4 = servidor([]);
  const r4 = await s4.armazem.gravarConferindo("<p>N</p>", conferencia("<p>C</p>"));
  checar(
    "sumiu desde a leitura: devolve null e nao cria ainda (o motor mescla antes)",
    !r4.gravado && r4.atual === null && posts(s4, "texto_padrao_interno_cadastrar") === 0,
    r4,
  );
  const s5 = servidor([]);
  const r5 = await s5.armazem.gravarConferindo("<p>N</p>", conferencia(null));
  checar(
    "nao existia e continua nao existindo: cria, e sem duplicata fica",
    r5.gravado && s5.estado.textos.length === 1 && s5.estado.textos[0]?.conteudo === "<p>N</p>",
    s5.estado.textos,
  );

  secao("texto padrao: dois usuarios criando ao mesmo tempo");
  const s6 = servidor([], { colega: "antes" });
  const r6 = await s6.armazem.gravarConferindo("<p>N</p>", conferencia(null));
  checar(
    "o colega criou primeiro (menor id): o nosso sai e o dele volta para a mescla",
    !r6.gravado && desfazer(r6.atual) === "<p>K</p>" && s6.estado.textos.length === 1 && s6.estado.textos[0]?.conteudo === "<p>K</p>",
    { r6, textos: s6.estado.textos },
  );
  checar(
    "a exclusao foi do nosso id",
    s6.estado.posts.some((p) => p.acao === "texto_padrao_interno_excluir" && /hdnInfraItemId=951/.test(p.corpo)),
    s6.estado.posts.map((p) => p.acao),
  );
  const s7 = servidor([], { colega: "depois" });
  const r7 = await s7.armazem.gravarConferindo("<p>N</p>", conferencia(null));
  checar(
    "o nosso ficou com o menor id: fica, e o do colega e ele quem apaga",
    r7.gravado && s7.estado.textos.length === 2 && posts(s7, "texto_padrao_interno_excluir") === 0,
    s7.estado.textos,
  );
  const s9 = servidor([
    { id: "960", conteudo: "<p>X</p>", alterar: true },
    { id: "955", conteudo: "<p>Y</p>", alterar: true },
  ]);
  const lido9 = await s9.armazem.ler();
  checar("duplicata antiga: ler escolhe o de menor id", desfazer(lido9) === "<p>Y</p>", lido9);
  await s9.armazem.gravarConferindo("<p>N</p>", conferencia(lido9));
  checar(
    "e grava nele, sem mexer no outro",
    s9.estado.textos.find((t) => t.id === "955")?.conteudo === "<p>N</p>" && s9.estado.textos.find((t) => t.id === "960")?.conteudo === "<p>X</p>",
    s9.estado.textos,
  );

  secao("texto padrao: so com o http e o link do menu (sem a classe Sei)");
  const s10 = servidor([{ id: "901", conteudo: "<p>C</p>", alterar: true }]);
  const leve = criarArmazemTextoPadrao(
    { http: s10.sei.http, linkMenu: (acao) => linkDoMenu(s10.base, acao) },
    { nome: NOME, descricao: "Projetos da unidade (SEI Pro)." },
  );
  checar("le pelo link do menu colhido da tela", desfazer(await leve.ler()) === "<p>C</p>");
  const semMenu = await lanca(() => linkDoMenu({ doc: s10.base.doc, html: "<html></html>" }, "nao_existe"));
  checar("acao fora do menu: SEI_ACAO_INDISPONIVEL", semMenu?.codigo === "SEI_ACAO_INDISPONIVEL", semMenu);
}
```

Arquivo completo `sei-nucleo/tests/verificar.ts`:

```ts
import { verificarBase } from "./verificar-base";
import { verificarDominio } from "./verificar-dominio";
import { verificarHistorico } from "./verificar-historico";
import { verificarPrivacidade } from "./verificar-privacidade";
import { verificarTextoPadrao } from "./verificar-texto-padrao";
import { verificarTextoPadraoConferencia } from "./verificar-texto-padrao-conferencia";
import { resumo } from "./util";

await verificarBase();
await verificarDominio();
await verificarHistorico();
await verificarPrivacidade();
await verificarTextoPadrao();
await verificarTextoPadraoConferencia();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/sei-nucleo" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `SyntaxError: The requested module '../src/links/links' does not provide an export named 'linkDoMenu'`

- [ ] **Step 3: Implementar**

Arquivo completo `sei-nucleo/src/dominio/textoPadrao.ts`:

```ts
/**
 * Armazém de dados num Texto Padrão da unidade (`texto_padrao_interno_*`).
 *
 * Genérico: guarda um HTML sob um nome. Quem usa (os favoritos, os projetos e,
 * no futuro, a Distribuição Automática ou configurações da unidade) decide o
 * formato do conteúdo. Receita provada ao vivo no SEI 4.1.5 e no 5.0.4 (prova
 * P1 do favoritos, `docs/superpowers/specs/2026-10-01-favoritos-provas.md`):
 * - a lista vem do link do MENU (o hash é da sessão; nada de montar URL);
 * - consultar e alterar pelos links da própria linha;
 * - criar pela URL do botão "Novo" da lista;
 * - excluir como a função `acaoExcluir` da página: `hdnInfraItemId` no
 *   formulário da lista, postado no link assinado que está no script;
 * - o conteúdo vai em `txaConteudo` como HTML, e o sucesso é provado pela
 *   volta à lista. No SEI 5 o `<textarea>` não tem id: lê-se pelo `name`.
 *
 * Texto que é de todos (o da unidade nos Projetos):
 * - ler só precisa do link de consultar (quem não pode alterar ainda lê);
 * - `gravarConferindo` lê o conteúdo no PRÓPRIO formulário de alterar, logo
 *   antes de postar, e só posta se ele ainda é o lido (senão devolve o atual);
 * - dois usuários criando ao mesmo tempo: o de menor id é o texto; quem ficou
 *   com o outro apaga o seu e mescla o do colega;
 * - com duplicata antiga na lista, todos leem e gravam o de menor id.
 */

import { Formulario, urlContem } from "../formulario/formulario";
import type { Sei } from "../sei";
import { ErroSei } from "../sessao/erros";
import type { OpcoesHttp, Pagina } from "../sessao/http";

export interface TextoLocalizado {
  id: string;
  consultar: string;
  /** Ausente quando o SEI não deixa este usuário alterar o texto (ele só lê). */
  alterar?: string;
}

/** O que o motor da sincronia sabe do texto lido (mesma forma da `ConferenciaTexto` do sei-comum). */
export interface ConferenciaGravacao {
  /** O conteúdo da última leitura (null: o texto não existia). */
  anterior: string | null;
  /** A mesma carga? Quem chama sabe comparar (o escape a mais do SEI 5 não conta). */
  mesmo(a: string | null, b: string | null): boolean;
}

/** `gravado: false`: o texto não era mais o `anterior`; `atual` é o que ele tem agora (null: sumiu). */
export type ResultadoGravacao = { gravado: true } | { gravado: false; atual: string | null };

export interface ArmazemTextoPadrao {
  localizar(op?: OpcoesHttp): Promise<TextoLocalizado | null>;
  /** O HTML guardado (já sem o escape do `<textarea>`), ou null se o texto não existe. */
  ler(op?: OpcoesHttp): Promise<string | null>;
  gravar(html: string, op?: OpcoesHttp): Promise<void>;
  /** Grava só se o texto ainda é o `anterior` (conferido no formulário de alterar); senão devolve o atual. */
  gravarConferindo(html: string, c: ConferenciaGravacao, op?: OpcoesHttp): Promise<ResultadoGravacao>;
  /** true se havia o texto e ele foi excluído. */
  excluir(op?: OpcoesHttp): Promise<boolean>;
}

const FORM_CADASTRO = "#frmTextoPadraoInternoCadastro";
const FORM_LISTA = "#frmTextoPadraoInternoLista";
const TEXTAREA = 'textarea[name="txaConteudo"], #txaConteudo';
/** Um teto para a paginação: nenhuma unidade tem tantos textos, e um laço sem fim travaria a aba. */
const MAX_PAGINAS = 40;

const desfazerAmp = (s: string | null | undefined) => (s ?? "").replace(/&amp;/g, "&");
const porId = (a: TextoLocalizado, b: TextoLocalizado) => Number(a.id) - Number(b.id);

/** O que o armazém usa do `Sei`: o HTTP da sessão e o link do menu (o content script dos Projetos monta só isso). */
export type SeiDoTexto = Pick<Sei, "http" | "linkMenu">;

export function criarArmazemTextoPadrao(sei: SeiDoTexto, o: { nome: string; descricao: string }): ArmazemTextoPadrao {
  const validar = () => {
    if (!o.nome.trim() || o.nome.length > 50) throw new ErroSei("ARGUMENTO_INVALIDO", "O nome do texto padrão deve ter de 1 a 50 caracteres.");
    if (o.descricao.length > 300) throw new ErroSei("ARGUMENTO_INVALIDO", "A descrição do texto padrão passa de 300 caracteres.");
  };

  const linhasNa = (p: Pagina) =>
    [...p.doc.querySelectorAll("table.infraTable tr")].filter((tr) =>
      [...tr.querySelectorAll("td")].some((td) => (td.textContent ?? "").trim() === o.nome),
    );

  const daLinha = (tr: Element): TextoLocalizado | null => {
    const id =
      tr.querySelector('input[type="checkbox"]')?.getAttribute("value") ??
      /acaoExcluir\(\s*['"](\d+)/.exec(tr.querySelector('a[onclick*="acaoExcluir"]')?.getAttribute("onclick") ?? "")?.[1];
    const consultar = desfazerAmp(tr.querySelector('a[href*="acao=texto_padrao_interno_consultar"]')?.getAttribute("href"));
    const alterar = desfazerAmp(tr.querySelector('a[href*="acao=texto_padrao_interno_alterar"]')?.getAttribute("href"));
    if (!id || !consultar) return null;
    return alterar ? { id, consultar, alterar } : { id, consultar };
  };

  /**
   * Percorre a lista (todas as páginas) até achar o texto. Devolve a página em que achou (ou a
   * última lida), a primeira (o botão "Novo") e, se há mais de uma linha com o nome, todas (menor id
   * primeiro): o achado é sempre o de menor id.
   */
  const percorrer = async (
    op?: OpcoesHttp,
  ): Promise<{ pagina: Pagina; primeira: Pagina; achado: TextoLocalizado | null; todos: TextoLocalizado[] }> => {
    validar();
    const primeira = await sei.http.obter(sei.linkMenu("texto_padrao_interno_listar"), op);
    let pagina = primeira;
    for (let n = 0; n < MAX_PAGINAS; n++) {
      const todos = linhasNa(pagina)
        .map(daLinha)
        .filter((t): t is TextoLocalizado => t !== null)
        .sort(porId);
      if (todos.length) return { pagina, primeira, achado: todos[0] ?? null, todos };
      // Há próxima página? O infra só desenha o "+" quando há.
      if (!/infraAcaoPaginar\(\s*['"]\+['"]/.test(pagina.html)) break;
      pagina = await Formulario.de(pagina, FORM_LISTA, sei.http)
        .definir({ hdnInfraPaginaAtual: String(n + 1) })
        .enviar(op);
    }
    return { pagina, primeira, achado: null, todos: [] };
  };

  const conteudoDe = async (t: TextoLocalizado, op?: OpcoesHttp): Promise<string> =>
    (await sei.http.obter(t.consultar, op)).doc.querySelector(TEXTAREA)?.textContent ?? "";

  const opEnvio = (op?: OpcoesHttp) => ({ ...op, modos: { txaConteudo: "html" as const }, sucesso: urlContem("texto_padrao_interno_listar") });

  const semAlterar = () => new ErroSei("SEI_ACAO_INDISPONIVEL", "O SEI não permite a você alterar este texto padrão nesta unidade.");

  const abrirAlterar = (t: TextoLocalizado, op?: OpcoesHttp): Promise<Formulario> => {
    if (!t.alterar) throw semAlterar();
    return Formulario.abrir(sei.http, t.alterar, FORM_CADASTRO, op);
  };

  const postarAlteracao = async (f: Formulario, html: string, op?: OpcoesHttp): Promise<void> => {
    await f.definir({ txaConteudo: html }).enviar({ ...opEnvio(op), botao: "sbmAlterarTextoPadraoInterno", operacao: "a alteração do texto padrão" });
  };

  const criar = async (primeira: Pagina, html: string, op?: OpcoesHttp): Promise<void> => {
    const novo = desfazerAmp(/location\.href\s*=\s*'([^']+)'/.exec(primeira.doc.querySelector("#btnNovo")?.getAttribute("onclick") ?? "")?.[1]);
    if (!novo) throw new ErroSei("SEI_ACAO_INDISPONIVEL", "O SEI não permite a você criar textos padrão nesta unidade.");
    const f = await Formulario.abrir(sei.http, novo, FORM_CADASTRO, op);
    await f
      .definir({ txtNome: o.nome, txtDescricao: o.descricao, txaConteudo: html })
      .enviar({ ...opEnvio(op), botao: "sbmCadastrarTextoPadraoInterno", operacao: "o cadastro do texto padrão" });
  };

  const excluirNa = async (pagina: Pagina, id: string, op?: OpcoesHttp): Promise<void> => {
    const url = desfazerAmp(/['"](controlador\.php\?acao=texto_padrao_interno_excluir[^'"]+)['"]/.exec(pagina.html)?.[1]);
    if (!url) throw new ErroSei("SEI_ACAO_INDISPONIVEL", "O SEI não oferece a exclusão de textos padrão para você nesta unidade.");
    const form = Formulario.de(pagina, FORM_LISTA, sei.http).definir({ hdnInfraItemId: id });
    await sei.http.enviar(url, form.pares(), { ...op, aceitarValidacao: true });
  };

  /**
   * Depois de criar: dois usuários criando juntos deixam duas linhas com o nome. O de menor id é o
   * texto. Se o nosso não é ele, o nosso sai e o conteúdo do outro volta para a próxima mescla.
   */
  const conferirDuplicata = async (html: string, c: ConferenciaGravacao, op?: OpcoesHttp): Promise<ResultadoGravacao> => {
    const { todos, pagina } = await percorrer(op);
    const [principal, ...outros] = todos;
    if (!principal || !outros.length) return { gravado: true };
    const doPrincipal = await conteudoDe(principal, op);
    if (c.mesmo(doPrincipal, html)) return { gravado: true };
    for (const t of outros) if (c.mesmo(await conteudoDe(t, op), html)) await excluirNa(pagina, t.id, op);
    return { gravado: false, atual: doPrincipal };
  };

  return {
    async localizar(op) {
      return (await percorrer(op)).achado;
    },

    async ler(op) {
      const { achado } = await percorrer(op);
      return achado ? conteudoDe(achado, op) : null;
    },

    async gravar(html, op) {
      const { achado, primeira } = await percorrer(op);
      if (achado) await postarAlteracao(await abrirAlterar(achado, op), html, op);
      else await criar(primeira, html, op);
    },

    async gravarConferindo(html, c, op) {
      const { achado, primeira } = await percorrer(op);
      if (achado) {
        const f = await abrirAlterar(achado, op);
        // O formulário de alterar traz o conteúdo de agora: a conferência fica colada no POST.
        const atual = f.valor("txaConteudo") ?? "";
        if (!c.mesmo(atual, c.anterior)) return { gravado: false, atual };
        await postarAlteracao(f, html, op);
        return { gravado: true };
      }
      // Existia e sumiu (um colega excluiu): o motor mescla de novo, com nada, antes de recriar.
      if (c.anterior !== null) return { gravado: false, atual: null };
      await criar(primeira, html, op);
      return conferirDuplicata(html, c, op);
    },

    async excluir(op) {
      const { achado, pagina } = await percorrer(op);
      if (!achado) return false;
      await excluirNa(pagina, achado.id, op);
      return true;
    },
  };
}
```

Em `sei-nucleo/src/links/links.ts`, troque:

```ts
 * dois links, que produzia hash inválido e encerrava a sessão).
 */

const RE_LINK = /controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;

/** Todos os links assinados de um HTML (em atributos, scripts ou texto), sem repetição. */
```

por:

```ts
 * dois links, que produzia hash inválido e encerrava a sessão).
 */

import { ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";

const RE_LINK = /controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;

/** Todos os links assinados de um HTML (em atributos, scripts ou texto), sem repetição. */
```

Em `sei-nucleo/src/links/links.ts`, troque:

```ts
export function semAssinaturas(texto: string): string {
  return texto.replace(/(controlador(?:_ajax)?\.php\?)[^\s"'<>]*/g, "$1\u2026").replace(/infra_hash=[0-9a-f]+/g, "infra_hash=\u2026");
}
```

por:

```ts
export function semAssinaturas(texto: string): string {
  return texto.replace(/(controlador(?:_ajax)?\.php\?)[^\s"'<>]*/g, "$1\u2026").replace(/infra_hash=[0-9a-f]+/g, "infra_hash=\u2026");
}

/**
 * Link assinado de um item do menu principal (ex.: `procedimento_controlar`), colhido da tela `base`
 * (uma tela com o menu). Procura primeiro no menu: a mesma ação aparece em outros lugares da tela com
 * parâmetros extras (ex.: `procedimento_controlar&tipo_filtro=M` é a caixa filtrada por marcador, e
 * usá-la mudaria a visão do usuário). Fora do `Sei` para quem só precisa do menu (o armazém de Texto
 * Padrão no content script dos Projetos, sem levar a árvore do processo para o pacote).
 */
export function linkDoMenu(base: Pick<Pagina, "doc" | "html">, acao: string): string {
  const menu = [...base.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")]
    .map((a) => a.getAttribute("href") ?? "")
    .join("\n");
  const candidatos = linksAssinados(menu).filter((l) => parametros(l).get("acao") === acao);
  const todos = candidatos.length ? candidatos : linksAssinados(base.html).filter((l) => parametros(l).get("acao") === acao);
  const l = todos.sort((a, b) => [...parametros(a).keys()].length - [...parametros(b).keys()].length)[0];
  if (!l) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O menu do SEI não oferece "${acao}" para este usuário.`);
  return l;
}
```

Em `sei-nucleo/src/sei.ts`, troque:

```ts

import { abrirArvore, type Arvore } from "./dominio/arvore";
import { Formulario } from "./formulario/formulario";
import { linksAssinados, parametros } from "./links/links";
import { analisarHtml, decodificarEntidades, textoDe } from "./sessao/dom";
import { ErroSei } from "./sessao/erros";
import { criarHttp, type DependenciasHttp, type Http, type OpcoesHttp, type Pagina } from "./sessao/http";
```

por:

```ts

import { abrirArvore, type Arvore } from "./dominio/arvore";
import { Formulario } from "./formulario/formulario";
import { linkDoMenu, linksAssinados, parametros } from "./links/links";
import { analisarHtml, decodificarEntidades, textoDe } from "./sessao/dom";
import { ErroSei } from "./sessao/erros";
import { criarHttp, type DependenciasHttp, type Http, type OpcoesHttp, type Pagina } from "./sessao/http";
```

Em `sei-nucleo/src/sei.ts`, troque:

```ts
    return lerContexto(this.base());
  }

  /** Link assinado de um item do menu principal (ex.: `procedimento_controlar`). */
  linkMenu(acao: string): string {
    // Procura primeiro no menu: a mesma ação aparece em outros lugares da tela
    // com parâmetros extras (ex.: `procedimento_controlar&tipo_filtro=M` é a
    // caixa filtrada por marcador, e usá-la mudaria a visão do usuário).
    const base = this.base();
    const menu = [...base.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")]
      .map((a) => a.getAttribute("href") ?? "")
      .join("\n");
    const candidatos = linksAssinados(menu).filter((l) => parametros(l).get("acao") === acao);
    const todos = candidatos.length ? candidatos : linksAssinados(base.html).filter((l) => parametros(l).get("acao") === acao);
    const l = todos.sort((a, b) => [...parametros(a).keys()].length - [...parametros(b).keys()].length)[0];
    if (!l) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O menu do SEI n\u00E3o oferece "${acao}" para este usu\u00E1rio.`);
    return l;
  }

  /** Recarrega a tela base (depois de trocar de unidade, por exemplo). */
```

por:

```ts
    return lerContexto(this.base());
  }

  /** Link assinado de um item do menu principal (ex.: `procedimento_controlar`): `linkDoMenu` na tela base. */
  linkMenu(acao: string): string {
    return linkDoMenu(this.base(), acao);
  }

  /** Recarrega a tela base (depois de trocar de unidade, por exemplo). */
```

Em `sei-nucleo/src/index.ts`, troque:

```ts
export { codificarLatin1, decodificarLatin1, paraLatin1Seguro } from "./sessao/codificacao";
export { definirAnalisador } from "./sessao/dom";
export { Formulario, lerLupa, serializarLupa, urlContem, normalizar, type ItemLupa, type Opcao } from "./formulario/formulario";
export { linksAssinados, linkDaAcao, parametros, semAssinaturas } from "./links/links";
export { abrirArvore, lerArvore, acaoNaArvore, type Arvore, type DocumentoArvore, type NivelAcesso } from "./dominio/arvore";
export { consultarProcesso, alterarProcesso, concluirProcesso, reabrirProcesso, type Processo, type AlteracaoProcesso } from "./dominio/processo";
export {
```

por:

```ts
export { codificarLatin1, decodificarLatin1, paraLatin1Seguro } from "./sessao/codificacao";
export { definirAnalisador } from "./sessao/dom";
export { Formulario, lerLupa, serializarLupa, urlContem, normalizar, type ItemLupa, type Opcao } from "./formulario/formulario";
export { linkDoMenu, linksAssinados, linkDaAcao, parametros, semAssinaturas } from "./links/links";
export { abrirArvore, lerArvore, acaoNaArvore, type Arvore, type DocumentoArvore, type NivelAcesso } from "./dominio/arvore";
export { consultarProcesso, alterarProcesso, concluirProcesso, reabrirProcesso, type Processo, type AlteracaoProcesso } from "./dominio/processo";
export {
```

Em `sei-nucleo/src/index.ts`, troque:

```ts
export { enviarProcesso, assinarDocumento, type Envio, type Assinatura } from "./dominio/tramitacao";
export { excluirDocumento, cancelarDocumento, cancelarAssinatura, darCiencia } from "./dominio/acoesDocumento";
export { pesquisar, type CriteriosPesquisa, type ResultadoPesquisa } from "./dominio/pesquisa";
export { criarArmazemTextoPadrao, type ArmazemTextoPadrao, type TextoLocalizado } from "./dominio/textoPadrao";
```

por:

```ts
export { enviarProcesso, assinarDocumento, type Envio, type Assinatura } from "./dominio/tramitacao";
export { excluirDocumento, cancelarDocumento, cancelarAssinatura, darCiencia } from "./dominio/acoesDocumento";
export { pesquisar, type CriteriosPesquisa, type ResultadoPesquisa } from "./dominio/pesquisa";
export {
  criarArmazemTextoPadrao,
  type ArmazemTextoPadrao,
  type ConferenciaGravacao,
  type ResultadoGravacao,
  type SeiDoTexto,
  type TextoLocalizado,
} from "./dominio/textoPadrao";
```

- [ ] **Step 4: Rodar as provas (o núcleo e quem usa o armazém)**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && (cd sei-nucleo && npx tsx tests/verificar.ts 2>&1 | tail -2) && (cd favoritos && npx tsx tests/verificar.ts 2>&1 | tail -2) && (cd agente-ia && npx tsx tests/verificar.ts 2>&1 | tail -2)
```
Expected: `125 ok, 0 falha(s)` (sei-nucleo, +15); `578 ok, 0 falha(s)`; `1054 ok, 0 falha(s)`.

- [ ] **Step 5: Portões e os bundles de quem empacota o núcleo**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && (cd sei-nucleo && npx tsc --noEmit) && (cd agente-ia && npx tsc --noEmit && node build.mjs | tail -1) && (cd favoritos && npx tsc --noEmit && node build.mjs | tail -1) && (cd historico && npx tsc --noEmit && node build.mjs | tail -1) && LC_ALL=C grep -c $'[\x80-\xff]' dist/js/init_favoritos.js dist/js/init_historico.js dist/js/init_agente.js dist/js/agente/painel.js && git status --short dist
```
Expected: os `tsc` sem saída; os três builds sem `ERRO:`; as quatro contagens `:0`; no `git status`, exatamente `dist/js/agente/painel.js`, `dist/js/init_agente.js`, `dist/js/init_favoritos.js` e `dist/js/init_historico.js` modificados. (O `sei-nucleo` não tem Biome; o `dist/js/sei-nucleo.js` não é versionado.)

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  sei-nucleo/src/dominio/textoPadrao.ts \
  sei-nucleo/src/links/links.ts \
  sei-nucleo/src/sei.ts \
  sei-nucleo/src/index.ts \
  sei-nucleo/tests/verificar-texto-padrao-conferencia.ts \
  sei-nucleo/tests/verificar.ts \
  dist/js/init_favoritos.js \
  dist/js/init_historico.js \
  dist/js/init_agente.js \
  dist/js/agente/painel.js
git commit -m "$(cat <<'EOF'
Nucleo: Texto Padrao le sem o link de alterar, confere o anterior, resolve a duplicata e dispensa o Sei

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 3: Projetos — o repositório pronto para a sincronia (sem laço, documento sigiloso, base, modelo e vínculo na forma)

**Files:**
- Modify: `projetos/src/repositorio.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-sincronia-repo.ts`

**Interfaces:**
- Consumes (P2): `RepositorioProjetos.importar(ent, anotacoes?) → ResultadoImportacao`, `entidadeValida(x, tipo, agora?)`, `manterNumeroSigiloso`, `criarProjetoDeModelo(d, modelo, inicio)`, `dataNaFaixa`, `LIMITE_DIAS_ETAPA`, `MODELOS_EMBUTIDOS`; `jsonEstavel` (`@comum/sincronia/assinatura`); nas provas `novoRepo`, `ESCOPO_UN`, `etapa`, `projeto`.
- Produces: `manterDocumentoSigiloso(vencedor: Etapa, local: Etapa | undefined, projetoSigiloso: boolean): Etapa`; `importar` deixa de regravar (e de avisar em `aoMudar`) o que ficaria igual ao local; base com término antes do início é aceita (a mesma regra da etapa); `criarProjetoDeModelo` recusa começo fora de 2000–2100 ("Use datas entre 2000 e 2100.") e etapas que passariam de 2100 ("Com esse começo, o projeto passaria de 2100."); `entidadeValida` só aceita vínculo com forma de número de processo (`/^[0-9./-]{0,40}$/`, `idProcedimento` só dígitos) e documento com número até 40 e título até 200.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-sincronia-repo.ts`:

```ts
/**
 * O que a sincronia pede ao repositório (P4): a importação não regrava o que
 * ficaria igual (senão cada rodada ouviria a própria gravação e leria de novo,
 * sem fim), o documento de etapa sigilosa que chega vazio fica, a linha de base
 * segue a regra da etapa e o modelo não passa de 2100.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { LIMITE_DIAS_ETAPA } from "../src/modelo/calendario";
import type { Etapa, Projeto } from "../src/modelo/tipos";
import { MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import { entidadeValida, manterDocumentoSigiloso } from "../src/repositorio";
import { ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { etapa, projeto } from "./fabrica";
import { checar, lanca, secao } from "./util";

/** O que o Texto Padrão leva de um vínculo sigiloso: nada do número. */
const semNumero = <T extends { processo?: { protocolo: string; sigiloso?: boolean } }>(x: T): T =>
  x.processo?.sigiloso ? { ...x, processo: { protocolo: "", sigiloso: true } } : x;

export async function verificarSincroniaRepo(): Promise<void> {
  secao("sincronia no repositorio: a importacao nao regrava o que ficaria igual");
  const area = areaMemoria();
  const { repo } = novoRepo(ESCOPO_UN, area, "s");
  const p = await repo.criarProjeto({ nome: "Sindicância", processo: { protocolo: "50300.000777/2026-10", sigiloso: true } });
  const e = await repo.criarEtapa({
    projeto: p.id,
    nome: "Oitiva",
    inicio: "2026-10-06",
    fim: "2026-10-09",
    documento: { numero: "1234567", titulo: "Termo" },
  });
  const ent = await repo.entidades();
  let avisos = 0;
  const parar = repo.aoMudar(() => avisos++);
  // A cópia que foi ao Texto Padrão: mesmos carimbos, sem o número do processo e sem o documento.
  const doTexto = {
    ...ent,
    p: ent.p.map(semNumero),
    e: ent.e.map((x) => {
      const { documento: _d, ...resto } = x;
      return resto as Etapa;
    }),
  };
  const r1 = await repo.importar(doTexto);
  checar(
    "a propria copia do Texto Padrao volta: nada gravado e nenhum aviso (sem laco de rodadas)",
    r1.novos === 0 && r1.atualizados === 0 && avisos === 0,
    { r1, avisos },
  );
  const local = await repo.obterEtapa(e.id);
  checar(
    "o numero do processo e o documento continuam aqui",
    (await repo.obterProjeto(p.id))?.processo?.protocolo === "50300.000777/2026-10" && local?.documento?.numero === "1234567",
    local,
  );
  const r2 = await repo.importar(await repo.entidades());
  checar("importar o proprio estado: nada gravado", r2.novos === 0 && r2.atualizados === 0 && avisos === 0);
  parar();

  secao("sincronia no repositorio: documento de etapa sigilosa que chega sem numero");
  const colega = {
    ...(local as Etapa),
    nome: "Oitiva das testemunhas",
    atualizadoEm: (local as Etapa).atualizadoEm + 50,
    dispositivo: "dev-b",
  };
  delete (colega as Partial<Etapa>).documento;
  await repo.importar({ e: [colega] });
  const depois = await repo.obterEtapa(e.id);
  checar(
    "o colega mudou o nome (projeto sigiloso): o nome vem, o documento daqui fica",
    depois?.nome === "Oitiva das testemunhas" && depois.documento?.numero === "1234567",
    depois,
  );
  const comum = etapa({ id: "x1", projeto: "p9", documento: { numero: "999" }, atualizadoEm: 10 });
  const semDoc = etapa({ id: "x1", projeto: "p9", atualizadoEm: 20 });
  checar("etapa comum: o colega tirou o documento e ele sai", manterDocumentoSigiloso(semDoc, comum, false).documento === undefined);
  const propria = etapa({ id: "x2", processo: { protocolo: "", sigiloso: true }, atualizadoEm: 20 });
  const propriaLocal = etapa({ id: "x2", processo: { protocolo: "50300.1/2026-1", sigiloso: true }, documento: { numero: "55" } });
  checar(
    "processo proprio sigiloso: o documento daqui fica",
    manterDocumentoSigiloso(propria, propriaLocal, false).documento?.numero === "55",
  );
  const propriaComum = etapa({ id: "x3", processo: { protocolo: "50300.2/2026-1" }, atualizadoEm: 20 });
  checar(
    "processo proprio NAO sigiloso num projeto sigiloso: vale o que chegou",
    manterDocumentoSigiloso(propriaComum, etapa({ id: "x3", documento: { numero: "66" } }), true).documento === undefined,
  );

  secao("sincronia no repositorio: linha de base com a regra da etapa");
  const torta = etapa({ id: "t1", inicio: "2026-10-10", fim: "2026-10-08", base: { inicio: "2026-10-10", fim: "2026-10-08" } });
  checar("etapa torta com a base torta (arraste do planejamento) e aceita", entidadeValida(torta, "e"));
  checar(
    "base de mais de ~10 anos continua recusada",
    !entidadeValida(etapa({ id: "t2", base: { inicio: "2000-01-01", fim: "2015-01-01" } }), "e") && LIMITE_DIAS_ETAPA < 5000,
  );
  const { repo: r3 } = novoRepo(ESCOPO_UN, areaMemoria(), "t");
  const pt: Projeto = projeto({ id: "pt" });
  const rt = await r3.importar({ p: [pt], e: [{ ...torta, projeto: "pt" }] });
  checar("e a importacao a aceita (os outros computadores tambem)", rt.novos === 2 && rt.ignorados === 0, rt);

  secao("sincronia no repositorio: processo e documento so com forma de numero (dado de colega)");
  const comProcesso = (processo: unknown) => projeto({ id: "pp", processo: processo as Projeto["processo"] });
  checar(
    "numero de processo comum e aceito",
    entidadeValida(comProcesso({ protocolo: "50300.000777/2026-10", idProcedimento: "77" }), "p"),
  );
  checar("vinculo sigiloso vazio (o do texto) e aceito", entidadeValida(comProcesso({ protocolo: "", sigiloso: true }), "p"));
  checar("protocolo com letras ou marcacao e recusado", !entidadeValida(comProcesso({ protocolo: "<img src=x onerror=alert(1)>" }), "p"));
  checar("protocolo de 41 caracteres e recusado", !entidadeValida(comProcesso({ protocolo: "1".repeat(41) }), "p"));
  checar("idProcedimento que nao e numero e recusado", !entidadeValida(comProcesso({ protocolo: "123", idProcedimento: "abc" }), "p"));
  checar(
    "documento com numero de 41 caracteres e recusado; titulo longo tambem",
    !entidadeValida(etapa({ id: "d1", documento: { numero: "1".repeat(41) } }), "e") &&
      !entidadeValida(etapa({ id: "d2", documento: { numero: "1", titulo: "t".repeat(201) } }), "e"),
  );

  secao("sincronia no repositorio: modelo nao passa de 2100");
  const modelo = MODELOS_EMBUTIDOS[0]!;
  const { repo: r4 } = novoRepo(ESCOPO_UN, areaMemoria(), "m");
  const fora = await lanca(() => r4.criarProjetoDeModelo({ nome: "Fora" }, modelo, "2101-01-03"));
  checar("comeco depois de 2100: recusado", /2000 e 2100/.test(String((fora as { mensagens?: string[] })?.mensagens)), fora);
  const passa = await lanca(() => r4.criarProjetoDeModelo({ nome: "Quase" }, modelo, "2100-12-20"));
  checar(
    "comeco em 20/12/2100 empurra etapas para 2101: recusado",
    /passaria de 2100/.test(String((passa as { mensagens?: string[] })?.mensagens)),
    passa,
  );
  checar("nada gravado", (await r4.dados()).projetos.length === 0);
  const ok = await r4.criarProjetoDeModelo({ nome: "Dentro" }, modelo, "2026-10-06");
  checar("comeco normal: cria", !!ok.id && (await r4.dados()).etapas.length === modelo.etapas.length);
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarSincroniaRepo } from "./verificar-sincronia-repo";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarEscopos();
```

por:

```ts
await verificarEscopos();
await verificarSincroniaRepo();
```

E deixe o Biome pôr o import no lugar (ordem alfabética):

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `SyntaxError: The requested module '../src/repositorio' does not provide an export named 'manterDocumentoSigiloso'`

- [ ] **Step 3: Implementar**

Em `projetos/src/repositorio.ts`, troque:

```ts
import { diferencaDias } from "@comum/datas/dias";
import { novoId } from "@comum/id";
import { indiceEntre, indiceValido } from "@comum/ordem/indice";
import { mesclar, purgarLapides, type Versionada } from "@comum/sincronia/entidade";
import { normalizarTexto } from "@comum/texto";
import { dataNaFaixa, LIMITE_DIAS_ETAPA } from "./modelo/calendario";
```

por:

```ts
import { diferencaDias } from "@comum/datas/dias";
import { novoId } from "@comum/id";
import { indiceEntre, indiceValido } from "@comum/ordem/indice";
import { jsonEstavel } from "@comum/sincronia/assinatura";
import { mesclar, purgarLapides, type Versionada } from "@comum/sincronia/entidade";
import { normalizarTexto } from "@comum/texto";
import { dataNaFaixa, LIMITE_DIAS_ETAPA } from "./modelo/calendario";
```

Em `projetos/src/repositorio.ts`, troque:

```ts
   */
  async criarProjetoDeModelo(d: DadosNovoProjeto, modelo: Modelo, inicio: DataISO): Promise<Projeto> {
    await this.exigirVagaDeProjeto();
    const c = this.carimbo();
    const p = novoProjeto(d, this.gerarId(), indiceEntre(maiorOrdem(await this.projetos.listar()), null), c);
    const problemas = [...problemasDoProjeto(p), ...problemasDoModelo(modelo)];
    if (problemas.length) throw new ErroValidacao([...new Set(problemas)]);
    const { fases, etapas } = aplicarModelo(modelo, inicio, { projeto: p.id, carimbo: c, novoId: this.gerarId });
    const conflitos = violacoesDeDatas(etapas);
    if (conflitos.length) throw new ErroValidacao(conflitos);
    await this.salvar(
```

por:

```ts
   */
  async criarProjetoDeModelo(d: DadosNovoProjeto, modelo: Modelo, inicio: DataISO): Promise<Projeto> {
    await this.exigirVagaDeProjeto();
    if (!dataNaFaixa(inicio)) throw new ErroValidacao(["Use datas entre 2000 e 2100."]);
    const c = this.carimbo();
    const p = novoProjeto(d, this.gerarId(), indiceEntre(maiorOrdem(await this.projetos.listar()), null), c);
    const problemas = [...problemasDoProjeto(p), ...problemasDoModelo(modelo)];
    if (problemas.length) throw new ErroValidacao([...new Set(problemas)]);
    const { fases, etapas } = aplicarModelo(modelo, inicio, { projeto: p.id, carimbo: c, novoId: this.gerarId });
    // O modelo empurra as datas em dias úteis: começando perto de 2100, a última etapa pode passar (e seria recusada lá fora).
    if (etapas.some((e) => !dataNaFaixa(e.inicio) || !dataNaFaixa(e.fim)))
      throw new ErroValidacao(["Com esse começo, o projeto passaria de 2100."]);
    const conflitos = violacoesDeDatas(etapas);
    if (conflitos.length) throw new ErroValidacao(conflitos);
    await this.salvar(
```

Em `projetos/src/repositorio.ts`, troque:

```ts
   * fica; dos que passariam a contar, entram os primeiros pelo id) e os 300
   * registros mais recentes; o excedente é ignorado e contado em `excedentes`.
   * Vínculo sigiloso que chega vazio (sem número) mantém o número que este
   * computador já tinha. Tudo vai num `area.gravar` só (um aviso em `aoMudar`);
   * `anotacoes` (registros do histórico a criar junto, com o carimbo) entram nessa
   * mesma gravação. Registros antigos daqui além dos 300 são podados depois.
   */
```

por:

```ts
   * fica; dos que passariam a contar, entram os primeiros pelo id) e os 300
   * registros mais recentes; o excedente é ignorado e contado em `excedentes`.
   * Vínculo sigiloso que chega vazio (sem número) mantém o número que este
   * computador já tinha, e etapa sigilosa que chega sem documento mantém o
   * documento daqui (o Texto Padrão não leva nenhum dos dois). O que a mescla
   * deixaria igual ao que já está aqui não é regravado: a sincronia ouve as
   * gravações, e regravar o mesmo a cada rodada viraria um laço de leituras.
   * Tudo vai num `area.gravar` só (um aviso em `aoMudar`);
   * `anotacoes` (registros do histórico a criar junto, com o carimbo) entram nessa
   * mesma gravação. Registros antigos daqui além dos 300 são podados depois.
   */
```

Em `projetos/src/repositorio.ts`, troque:

```ts
      soma.excedentes += r.excedentes;
      if (tipo === "h" && r.gravar.length) importouRegistros = true;
      itens = { ...itens, ...this.entradas(col, r.gravar) };
    };
    await mesclarCol(
      this.projetos,
      ent.p,
      "p",
      (l, v) => alemDoTeto(l, v, (x) => (vivo(x) && x.arquivadoEm === undefined ? "" : null), LIMITES.projetosAtivos),
      manterNumeroSigiloso,
    );
    await mesclarCol(this.fases, ent.f, "f", () => new Set());
    await mesclarCol(
      this.etapas,
      ent.e,
      "e",
      (l, v) => alemDoTeto(l, v, (x) => (vivo(x) ? x.projeto : null), LIMITES.etapasPorProjeto),
      manterNumeroSigiloso,
    );
    await mesclarCol(this.registros, ent.h, "h", registrosAlemDoTeto);
    await mesclarCol(this.modelos, ent.m, "m", (l, v) => alemDoTeto(l, v, (x) => (vivo(x) ? "" : null), LIMITES.modelos));
```

por:

```ts
      soma.excedentes += r.excedentes;
      if (tipo === "h" && r.gravar.length) importouRegistros = true;
      itens = { ...itens, ...this.entradas(col, r.gravar) };
      return r.gravar;
    };
    const projetosAqui = await this.projetos.listar();
    const projetosNovos = await mesclarCol(
      this.projetos,
      ent.p,
      "p",
      (l, v) => alemDoTeto(l, v, (x) => (vivo(x) && x.arquivadoEm === undefined ? "" : null), LIMITES.projetosAtivos),
      manterNumeroSigiloso,
    );
    // Projeto com processo sigiloso depois da mescla: as etapas dele sem processo próprio são sigilosas.
    const projetosFinais = new Map(projetosAqui.map((x) => [x.id, x]));
    for (const [id, x] of projetosNovos) projetosFinais.set(id, x);
    const sigilosos = new Set([...projetosFinais.values()].filter((x) => x.processo?.sigiloso).map((x) => x.id));
    await mesclarCol(this.fases, ent.f, "f", () => new Set());
    await mesclarCol(
      this.etapas,
      ent.e,
      "e",
      (l, v) => alemDoTeto(l, v, (x) => (vivo(x) ? x.projeto : null), LIMITES.etapasPorProjeto),
      (v, l) => manterDocumentoSigiloso(manterNumeroSigiloso(v, l), l, sigilosos.has(v.projeto)),
    );
    await mesclarCol(this.registros, ent.h, "h", registrosAlemDoTeto);
    await mesclarCol(this.modelos, ent.m, "m", (l, v) => alemDoTeto(l, v, (x) => (vivo(x) ? "" : null), LIMITES.modelos));
```

Em `projetos/src/repositorio.ts`, troque:

```ts
    for (const vencedor of vencedoras) {
      if (fora.has(vencedor.id)) continue;
      const atual = porId.get(vencedor.id);
      gravar.push([vencedor.id, combinar(vencedor, atual)]);
      if (atual) atualizados += 1;
      else novos += 1;
    }
```

por:

```ts
    for (const vencedor of vencedoras) {
      if (fora.has(vencedor.id)) continue;
      const atual = porId.get(vencedor.id);
      const final = combinar(vencedor, atual);
      // A cópia sem os dados sigilosos, com o mesmo carimbo, pode vencer o desempate e voltar igual ao local.
      if (atual && jsonEstavel(final) === jsonEstavel(atual)) continue;
      gravar.push([vencedor.id, final]);
      if (atual) atualizados += 1;
      else novos += 1;
    }
```

Em `projetos/src/repositorio.ts`, troque:

```ts
  return { ...vencedor, processo: semVazios({ ...v, protocolo: l.protocolo, idProcedimento: v.idProcedimento ?? l.idProcedimento }) };
}

/** Dependência repetida sai (a Frappe desenharia a seta duas vezes). Só copia quando há o que tirar. */
function sanear<T>(x: T, tipo: keyof Entidades): T {
  if (tipo !== "e") return x;
```

por:

```ts
  return { ...vencedor, processo: semVazios({ ...v, protocolo: l.protocolo, idProcedimento: v.idProcedimento ?? l.idProcedimento }) };
}

/**
 * Etapa sigilosa (processo próprio sigiloso, ou sem processo próprio num projeto sigiloso) que chegou
 * sem documento mantém o documento deste computador: o Texto Padrão não leva o número do documento de
 * um processo sigiloso (sincronia/textoPadrao.ts), e quem tinha não pode perdê-lo na mescla.
 */
export function manterDocumentoSigiloso(vencedor: Etapa, local: Etapa | undefined, projetoSigiloso: boolean): Etapa {
  if (vencedor.documento || !local?.documento) return vencedor;
  const sigilosa = vencedor.processo ? vencedor.processo.sigiloso === true : projetoSigiloso;
  return sigilosa ? { ...vencedor, documento: local.documento } : vencedor;
}

/** Dependência repetida sai (a Frappe desenharia a seta duas vezes). Só copia quando há o que tirar. */
function sanear<T>(x: T, tipo: keyof Entidades): T {
  if (tipo !== "e") return x;
```

Em `projetos/src/repositorio.ts`, troque:

```ts
  return diferencaDias(inicio, fim) <= LIMITE_DIAS_ETAPA;
}

const baseValida = (x: unknown): boolean => opcional(x, (b) => objeto(b) && datasValidas(b.inicio, b.fim, true));

/** `processo` opcional: objeto com `protocolo` texto, `idProcedimento` texto ou ausente, `sigiloso` booleano ou ausente. */
function vinculoValido(v: unknown): boolean {
  if (v === undefined) return true;
  if (!objeto(v)) return false;
  return texto(v.protocolo) && opcional(v.idProcedimento, texto) && opcional(v.sigiloso, (b) => typeof b === "boolean");
}

/** `documento` opcional: `numero` texto, `titulo` texto ou ausente. */
function documentoValido(d: unknown): boolean {
  if (d === undefined) return true;
  if (!objeto(d)) return false;
  return texto(d.numero) && opcional(d.titulo, texto);
}

/**
```

por:

```ts
  return diferencaDias(inicio, fim) <= LIMITE_DIAS_ETAPA;
}

/** A mesma regra da etapa: término antes do início não recusa (a base acompanha as datas no planejamento). */
const baseValida = (x: unknown): boolean => opcional(x, (b) => objeto(b) && datasValidas(b.inicio, b.fim, false));

/** Número de processo como o SEI escreve (dígitos, ponto, barra e hífen; vazio no sigiloso que veio do texto). */
const RE_PROTOCOLO = /^[0-9./-]{0,40}$/;
const RE_ID_PROCEDIMENTO = /^\d{1,20}$/;

/**
 * `processo` opcional: objeto com `protocolo` (forma de número de processo, até 40), `idProcedimento`
 * só dígitos ou ausente, `sigiloso` booleano ou ausente. Vem do texto da unidade (de qualquer colega) e
 * vai à pesquisa rápida quando alguém clica: nada além de número.
 */
function vinculoValido(v: unknown): boolean {
  if (v === undefined) return true;
  if (!objeto(v)) return false;
  return (
    texto(v.protocolo) &&
    RE_PROTOCOLO.test(v.protocolo) &&
    opcional(v.idProcedimento, (x) => texto(x) && RE_ID_PROCEDIMENTO.test(x)) &&
    opcional(v.sigiloso, (b) => typeof b === "boolean")
  );
}

/** `documento` opcional: `numero` texto de até 40, `titulo` texto de até 200 ou ausente. */
function documentoValido(d: unknown): boolean {
  if (d === undefined) return true;
  if (!objeto(d)) return false;
  return textoAte(40)(d.numero) && opcional(d.titulo, textoAte(LIMITES.nome));
}

/**
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2 && TZ=Asia/Tokyo npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `980 ok, 0 falha(s)` duas vezes (+20).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: os dois `tsc` sem saída; Biome sem erro.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/repositorio.ts \
  projetos/tests/verificar-sincronia-repo.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: importar nao regrava o igual, documento sigiloso fica, base, modelo e vinculo na forma

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 4: Projetos — adaptador do Texto Padrão (envelope sem sigilo, poda, validação, assinatura) e a corrida na unidade

**Files:**
- Create: `projetos/src/sincronia/textoPadrao.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-sincronia-texto.ts`, `projetos/tests/verificar-sincronia-corrida.ts`

**Interfaces:**
- Consumes: `AdaptadorTexto`, `MotorTextoPadrao`, `ConferenciaTexto`, `ResultadoGravacao` (Tarefa 1); `nomeDeTextoInterno`, `versaoMaisNova`, `gerarConteudoTexto`, `lerConteudoTexto`, `ValidacaoTexto`; `assinaturaEstavel`, `jsonEstavel`, `porId`, `purgarLapides`; do P2 `RepositorioProjetos` (`escopo`, `exportar(agora)`, `importar`, `carimboAtual`), `EnvelopeProjetos`, `Entidades`, `Escopo`, `chaveEscopo`, `excedentes`, `chaveProtocolo`, `chaveSyncTexto`, `DIAS_LAPIDE_UNIDADE` (180), `DIAS_LAPIDE_EU` (90), `FOLGA_RELOGIO_MS`, `LIMITES`.
- Produces: `TETO_TEXTO` (102400), `AVISO_TEXTO` (81920), `FORMATO`, `VERSAO`, `TETOS_ENVELOPE`, `SIGILOSO_PROCESSO`, `SIGILOSO_DOCUMENTO`, `MENSAGEM_MUDOU`; `nomeDoTexto(vis, login)`, `descricaoDoTexto(vis)`, `legivelProjetos(vis, sigla, nomeUsuario)`; `chaveRelatorio(escopo)`, `chaveSubstituido(escopo)`, `chaveStatusTexto(escopo)`; `RelatorioImportacao { quando; ignorados; excedentes; futuros }`, `TextoSubstituido { quando; motivo; html; cortado }`; `validarEnvelope(bruto, escopo): ValidacaoTexto<EnvelopeProjetos>`; `paraOTexto(env, agora): EnvelopeProjetos`; `assinaturaProjetos(env)`; `contarFuturos(ent, agora)`; `DepsAdaptador { repo; area; sigla; nomeUsuario }`; `adaptadorProjetos(d): AdaptadorTexto<EnvelopeProjetos>` (módulo "projetos", com `vazio` e `antesDeRegravarInvalido`).

- [ ] **Step 1: Escrever as provas que falham**

Arquivo completo `projetos/tests/verificar-sincronia-texto.ts`:

```ts
/**
 * O adaptador do Texto Padrão dos projetos (spec 6.1): nomes, validação,
 * privacidade dos sigilosos, poda, assinatura, relatório da leitura e, com o
 * motor genérico de verdade, o texto editado à mão, de versão mais nova e
 * perto ou acima do teto (Review Focus 1 do plano-mestre).
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { type DestinoTexto, MotorTextoPadrao, type StatusSync } from "@comum/sincronia/motor";
import { gerarConteudoTexto, lerConteudoTexto } from "@comum/sincronia/textoPadraoCodec";
import type { EnvelopeProjetos, Registro } from "../src/modelo/tipos";
import {
  adaptadorProjetos,
  assinaturaProjetos,
  chaveRelatorio,
  chaveSubstituido,
  contarFuturos,
  descricaoDoTexto,
  nomeDoTexto,
  paraOTexto,
  type RelatorioImportacao,
  SIGILOSO_DOCUMENTO,
  SIGILOSO_PROCESSO,
  TETO_TEXTO,
  type TextoSubstituido,
  validarEnvelope,
} from "../src/sincronia/textoPadrao";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { etapa, projeto } from "./fabrica";
import { checar, secao } from "./util";

const DIA = 86_400_000;
const AGORA = Date.UTC(2026, 9, 6, 12);
const SIGILO = "50300.000777/2026-10";

function envelope(m: Partial<EnvelopeProjetos> = {}): EnvelopeProjetos {
  return {
    formato: "seipro-projetos",
    versao: 1,
    host: ESCOPO_UN.host,
    unidade: ESCOPO_UN.unidade,
    vis: "unidade",
    gerado: AGORA,
    entidades: { p: [], f: [], e: [], h: [], m: [] },
    ...m,
  };
}

function registro(m: Partial<Registro> & { id: string }): Registro {
  return { alvo: "e1", projeto: "p1", quando: AGORA, por: "ana", campo: "nome", atualizadoEm: AGORA, dispositivo: "dev-a", ...m };
}

/** O Texto Padrão "no SEI", que confere a gravação como o armazém do núcleo. */
function noSei(html: string | null = null) {
  const t = {
    html,
    gravadas: 0,
    async ler() {
      return t.html;
    },
    async gravar(h: string) {
      t.gravadas++;
      t.html = h;
    },
  };
  return t;
}

function motorDe(
  repo: ReturnType<typeof novoRepo>["repo"],
  area: ReturnType<typeof areaMemoria>,
  destino: DestinoTexto,
  ajuste: Partial<ReturnType<typeof adaptadorProjetos>> = {},
) {
  return new MotorTextoPadrao<EnvelopeProjetos>({
    adaptador: { ...adaptadorProjetos({ repo, area, sigla: "SEPRO", nomeUsuario: "Ana Lima" }), ...ajuste },
    destino,
    area,
    travar: (_n, fn) => fn(),
    releituras: 3,
    temporizador: { definir: () => 0, cancelar: () => undefined },
  });
}

export async function verificarSincroniaTexto(): Promise<void> {
  secao("sincronia: nomes e descricoes dos textos");
  checar("o da unidade", nomeDoTexto("unidade", "Ana") === "[_SEIPRO_PRJ_UNIDADE]");
  checar("o pessoal, com o login em minusculas", nomeDoTexto("eu", " Ana.Lima ") === "[_SEIPRO_PRJ_ana.lima]");
  const longo = nomeDoTexto("eu", "fulano.de.tal.com.um.login.enorme@orgao.gov.br");
  checar("login longo: cabe nos 50 do SEI, com ~ e hash", longo.length <= 50 && longo.includes("~"), longo);
  checar("descricoes ate 300 caracteres", descricaoDoTexto("unidade").length < 300 && /unidade/.test(descricaoDoTexto("unidade")));

  secao("sincronia: validacao do envelope");
  checar("o da unidade casa", "ok" in validarEnvelope(envelope(), ESCOPO_UN));
  checar("outro SEI: invalido", "invalido" in validarEnvelope(envelope({ host: "outro.gov.br" }), ESCOPO_UN));
  checar("outra unidade: invalido", "invalido" in validarEnvelope(envelope({ unidade: "999" }), ESCOPO_UN));
  checar("visibilidade trocada: invalido", "invalido" in validarEnvelope(envelope({ vis: "eu", login: "ana" }), ESCOPO_UN));
  checar("pessoal de outro login: invalido", "invalido" in validarEnvelope(envelope({ vis: "eu", login: "bia" }), ESCOPO_EU));
  checar("pessoal sem login: invalido", "invalido" in validarEnvelope(envelope({ vis: "eu" }), ESCOPO_EU));
  checar("pessoal do proprio login (caixa diferente): ok", "ok" in validarEnvelope(envelope({ vis: "eu", login: "ANA" }), ESCOPO_EU));
  checar("versao 2: mais novo (nao e invalido)", "maisNovo" in validarEnvelope(envelope({ versao: 2 as 1 }), ESCOPO_UN));
  checar("outro formato: invalido", "invalido" in validarEnvelope({ formato: "seipro-favoritos", versao: 1 }, ESCOPO_UN));
  const torto = envelope();
  (torto.entidades as unknown as Record<string, unknown>).e = "nada";
  checar("lista que nao e lista: invalido", "invalido" in validarEnvelope(torto, ESCOPO_UN));
  const lotado = envelope();
  lotado.entidades.h = Array.from({ length: 5001 }, (_, i) => registro({ id: `r${i}` }));
  checar("itens demais (alem do que cabe em 100 KB): invalido", "invalido" in validarEnvelope(lotado, ESCOPO_UN));
  const parcial = validarEnvelope({ ...envelope(), entidades: { p: [] } }, ESCOPO_UN);
  checar("lista que falta vira lista vazia", "ok" in parcial && parcial.ok.entidades.m.length === 0);

  secao("sincronia: privacidade dos sigilosos no texto");
  const env = envelope({
    entidades: {
      p: [
        projeto({ id: "p1", processo: { protocolo: SIGILO, idProcedimento: "777", sigiloso: true } }),
        projeto({ id: "p2", processo: { protocolo: "50300.000001/2026-01" } }),
      ],
      f: [],
      e: [
        etapa({ id: "e1", projeto: "p1", documento: { numero: "1234567", titulo: "Termo" } }),
        etapa({ id: "e2", projeto: "p2", processo: { protocolo: "50300000777202610" }, documento: { numero: "7654321" } }),
        etapa({ id: "e3", projeto: "p2", documento: { numero: "1111111" } }),
      ],
      h: [
        registro({ id: "h1", alvo: "p1", projeto: "p1", campo: "processo", depois: SIGILO }),
        registro({ id: "h2", alvo: "e1", projeto: "p1", campo: "documento", depois: "1234567" }),
        registro({ id: "h3", alvo: "e3", projeto: "p2", campo: "documento", depois: "1111111" }),
        registro({ id: "h4", alvo: "p2", projeto: "p2", campo: "processo", depois: "50300.000001/2026-01" }),
      ],
      m: [],
    },
  });
  const saida = paraOTexto(env, AGORA);
  const json = JSON.stringify(saida);
  checar(
    "o numero sigiloso nao aparece em lugar nenhum (nem sem pontuacao)",
    !json.includes("000777") && !json.includes("777202610"),
    json,
  );
  checar("nem o idProcedimento", !json.includes('"777"'));
  checar(
    "o vinculo vai vazio e marcado",
    saida.entidades.p[0]?.processo?.protocolo === "" && saida.entidades.p[0]?.processo?.sigiloso === true,
    saida.entidades.p[0],
  );
  checar("o mesmo processo noutra etapa (sem a marca) tambem vai vazio", saida.entidades.e[1]?.processo?.protocolo === "");
  checar(
    "documento de etapa sigilosa (herdada do projeto ou propria) nao vai",
    saida.entidades.e[0]?.documento === undefined && saida.entidades.e[1]?.documento === undefined,
  );
  checar("documento de etapa comum vai", saida.entidades.e[2]?.documento?.numero === "1111111");
  checar(
    "registro antigo com o numero vira 'processo sigiloso'",
    saida.entidades.h.find((r) => r.id === "h1")?.depois === SIGILOSO_PROCESSO,
  );
  checar(
    "registro do documento da etapa sigilosa fica sem o numero",
    saida.entidades.h.find((r) => r.id === "h2")?.depois === SIGILOSO_DOCUMENTO,
  );
  checar(
    "os registros comuns ficam como estao",
    saida.entidades.h.find((r) => r.id === "h3")?.depois === "1111111" &&
      saida.entidades.h.find((r) => r.id === "h4")?.depois === "50300.000001/2026-01",
  );
  checar("o envelope de entrada nao muda", env.entidades.p[0]?.processo?.protocolo === SIGILO && !!env.entidades.e[0]?.documento);

  secao("sincronia: poda na exportacao");
  const velha = (dias: number) => AGORA - dias * DIA;
  const comLapides = envelope({
    entidades: {
      p: [projeto({ id: "p-ok" }), projeto({ id: "p-181", removidoEm: velha(181), atualizadoEm: velha(181) })],
      f: [],
      e: [etapa({ id: "e-100", removidoEm: velha(100), atualizadoEm: velha(100) })],
      h: Array.from({ length: 305 }, (_, i) => registro({ id: `h${String(i).padStart(3, "0")}`, quando: AGORA - i })),
      m: [],
    },
  });
  const podado = paraOTexto(comLapides, AGORA);
  checar(
    "unidade: lapide de 181 dias sai, a de 100 fica",
    !podado.entidades.p.some((x) => x.id === "p-181") && podado.entidades.e.length === 1,
  );
  checar(
    "historico: so os 300 mais recentes",
    podado.entidades.h.length === 300 && !podado.entidades.h.some((r) => r.id === "h304"),
    podado.entidades.h.length,
  );
  const pessoal = paraOTexto({ ...comLapides, vis: "eu", login: "ana" }, AGORA);
  checar("pessoal: lapide de 100 dias sai (prazo de 90)", pessoal.entidades.e.length === 0);

  secao("sincronia: assinatura e futuro");
  const a1 = assinaturaProjetos(envelope({ gerado: 1 }));
  checar("sem o 'gerado' (quem gravou e quando nao contam)", a1 === assinaturaProjetos(envelope({ gerado: 999 })));
  const ordemA = envelope({ entidades: { p: [projeto({ id: "a" }), projeto({ id: "b" })], f: [], e: [], h: [], m: [] } });
  const ordemB = envelope({ entidades: { p: [projeto({ id: "b" }), projeto({ id: "a" })], f: [], e: [], h: [], m: [] } });
  checar("a ordem das listas nao conta", assinaturaProjetos(ordemA) === assinaturaProjetos(ordemB));
  checar(
    "conta o que vem de mais de 1 dia no futuro",
    contarFuturos({ p: [projeto({ id: "x", atualizadoEm: AGORA + 2 * DIA })], e: [etapa({ id: "y", atualizadoEm: AGORA })] }, AGORA) === 1,
  );

  secao("sincronia: o adaptador com o motor (editado a mao, versao nova, teto)");
  const area = areaMemoria();
  const relogio = { agora: AGORA };
  const { repo } = novoRepo(ESCOPO_UN, area, "a", relogio);
  const p = await repo.criarProjeto({ nome: "Plano anual" });
  await repo.criarEtapa({ projeto: p.id, nome: "Diagnóstico", inicio: "2026-10-06", fim: "2026-10-09" });
  const editadoAMao = `${await gerarConteudoTexto("Dados", envelope())}\n<p>Colei isto aqui sem querer.</p>`;
  const sei1 = noSei(editadoAMao);
  const s1 = await motorDe(repo, area, sei1).sincronizar();
  const guardado = (await area.obter(chaveSubstituido(ESCOPO_UN)))[chaveSubstituido(ESCOPO_UN)] as TextoSubstituido | undefined;
  checar("editado a mao: o texto antigo fica guardado neste navegador", guardado?.html === editadoAMao && !guardado.cortado, guardado);
  checar(
    "e e regravado a partir do local, com aviso",
    sei1.gravadas === 1 && s1.estado === "ok" && /inválido/.test(s1.mensagem ?? "") && /guardado neste navegador/.test(s1.mensagem ?? ""),
    s1,
  );
  const lido = await lerConteudoTexto(sei1.html ?? "");
  checar(
    "o texto regravado tem os projetos daqui",
    "bruto" in lido && (lido.bruto as EnvelopeProjetos).entidades.p.some((x) => x.id === p.id),
  );
  checar("os dados locais ficaram como estavam", (await repo.dados()).etapas.length === 1);
  const maisNovo = await gerarConteudoTexto("Dados", envelope({ versao: 2 as 1 }));
  const sei2 = noSei(maisNovo);
  const s2 = await motorDe(repo, area, sei2).sincronizar({ forcar: true });
  checar(
    "versao mais nova: nao grava e pede para atualizar o SEI Pro",
    sei2.gravadas === 0 && sei2.html === maisNovo && s2.estado === "erro" && /versão mais nova/.test(s2.mensagem ?? ""),
    s2,
  );
  const sei3 = noSei(null);
  const s3 = await motorDe(repo, area, sei3, { teto: 400, aviso: 200 }).sincronizar({ forcar: true });
  checar(
    "acima do teto: nao grava e explica o que fazer",
    sei3.gravadas === 0 &&
      s3.estado === "erro" &&
      /passaram do limite/.test(s3.mensagem ?? "") &&
      /Exclua projetos/.test(s3.mensagem ?? ""),
    s3,
  );
  const sei4 = noSei(null);
  const s4 = await motorDe(repo, area, sei4, { aviso: 300 }).sincronizar({ forcar: true });
  checar("perto do teto: grava e avisa", sei4.gravadas === 1 && /perto do limite/.test(s4.mensagem ?? ""), s4);
  checar("o teto e de 100 KB", TETO_TEXTO === 102_400);

  secao("sincronia: texto que nao existe e escopo vazio");
  const areaV = areaMemoria();
  const { repo: vazio } = novoRepo(ESCOPO_UN, areaV, "v", { agora: AGORA });
  const sei5 = noSei(null);
  const s5 = await motorDe(vazio, areaV, sei5).sincronizar();
  checar("sem projetos da unidade: le e nao cria o texto", sei5.gravadas === 0 && s5.estado === "ok", s5);

  secao("sincronia: relatorio da leitura (relogio atrasado)");
  const areaR = areaMemoria();
  const { repo: r6 } = novoRepo(ESCOPO_UN, areaR, "r", { agora: AGORA });
  const doColega = envelope({
    entidades: { p: [projeto({ id: "futuro", atualizadoEm: AGORA + 3 * DIA })], f: [], e: [], h: [], m: [] },
  });
  await motorDe(r6, areaR, noSei(await gerarConteudoTexto("Dados", doColega))).sincronizar();
  const rel = (await areaR.obter(chaveRelatorio(ESCOPO_UN)))[chaveRelatorio(ESCOPO_UN)] as RelatorioImportacao | undefined;
  checar("o projeto do colega 3 dias no futuro fica de fora e e contado", rel?.futuros === 1 && rel.ignorados === 1, rel);
  checar("e nao entrou", (await r6.dados()).projetos.length === 0);
  const st = (await areaR.obter("projetos/sync/tp/sei.x.gov.br|ana|u:110/un"))["projetos/sync/tp/sei.x.gov.br|ana|u:110/un"] as
    | StatusSync
    | undefined;
  checar("o status fica na chave da spec (projetos/sync/tp/<escopo>)", !!st, st);
}
```

Arquivo completo `projetos/tests/verificar-sincronia-corrida.ts`:

```ts
/**
 * Review Focus 2 do plano-mestre: dois usuários editando o mesmo projeto
 * "Toda a unidade" quase ao mesmo tempo. Dois computadores (repositório e
 * motor próprios, relógios próprios) e UM Texto Padrão em memória que confere
 * a gravação como o armazém do núcleo; o gancho intercala a rodada de um no
 * meio da do outro. Depois da próxima rodada de cada um, as duas alterações
 * estão no texto e nos dois computadores; uma exclusão não ressuscita.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { type ConferenciaTexto, MotorTextoPadrao, type ResultadoGravacao } from "@comum/sincronia/motor";
import { lerConteudoTexto } from "@comum/sincronia/textoPadraoCodec";
import type { EnvelopeProjetos, Escopo } from "../src/modelo/tipos";
import { RepositorioProjetos } from "../src/repositorio";
import { adaptadorProjetos } from "../src/sincronia/textoPadrao";
import { checar, secao } from "./util";

const AGORA = Date.UTC(2026, 9, 6, 12);

/** O texto da unidade no SEI: um só para os dois computadores. */
function textoDaUnidade() {
  const t = {
    html: null as string | null,
    gravacoes: 0,
    /** Roda (uma vez) logo antes da próxima conferência: é o colega gravando no meio. */
    antesDaConferencia: undefined as (() => Promise<unknown>) | undefined,
  };
  const destino = {
    ler: async () => t.html,
    gravar: async (h: string) => {
      t.gravacoes++;
      t.html = h;
    },
    gravarConferindo: async (h: string, c: ConferenciaTexto): Promise<ResultadoGravacao> => {
      const colega = t.antesDaConferencia;
      t.antesDaConferencia = undefined;
      if (colega) await colega();
      if (!c.mesmo(t.html, c.anterior)) return { gravado: false, atual: t.html };
      t.gravacoes++;
      t.html = h;
      return { gravado: true };
    },
  };
  return { t, destino };
}

function computador(login: string, dispositivo: string, texto: ReturnType<typeof textoDaUnidade>, inicio: number) {
  const area = areaMemoria();
  const relogio = { agora: inicio };
  const escopo: Escopo = { host: "sei.x.gov.br", login, unidade: "110", vis: "unidade" };
  let n = 0;
  const repo = new RepositorioProjetos(
    area,
    escopo,
    () => ({ agora: ++relogio.agora, dispositivo, por: login, nome: login }),
    () => `${dispositivo}-${++n}`,
  );
  const motor = new MotorTextoPadrao<EnvelopeProjetos>({
    adaptador: adaptadorProjetos({ repo, area, sigla: "SEPRO", nomeUsuario: login }),
    destino: texto.destino,
    area,
    travar: (_n, fn) => fn(),
    agora: () => relogio.agora,
    releituras: 3,
    temporizador: { definir: () => 0, cancelar: () => undefined },
  });
  return { repo, motor, relogio, rodada: () => motor.sincronizar({ forcar: true }) };
}

async function noTexto(html: string | null): Promise<EnvelopeProjetos["entidades"]> {
  const r = html ? await lerConteudoTexto(html) : null;
  return r && "bruto" in r ? (r.bruto as EnvelopeProjetos).entidades : { p: [], f: [], e: [], h: [], m: [] };
}

export async function verificarSincroniaCorrida(): Promise<void> {
  secao("corrida na unidade: duas edicoes quase ao mesmo tempo");
  const texto = textoDaUnidade();
  const ana = computador("ana", "pc-ana", texto, AGORA);
  const bia = computador("bia", "pc-bia", texto, AGORA + 5);
  const p = await ana.repo.criarProjeto({ nome: "Revisão normativa" });
  const x = await ana.repo.criarEtapa({ projeto: p.id, nome: "Minuta", inicio: "2026-10-06", fim: "2026-10-09" });
  const y = await ana.repo.criarEtapa({ projeto: p.id, nome: "Consulta pública", inicio: "2026-10-13", fim: "2026-10-23" });
  const z = await ana.repo.criarEtapa({ projeto: p.id, nome: "Nota técnica", inicio: "2026-10-26", fim: "2026-10-30" });
  await ana.rodada();
  await bia.rodada();
  checar("a bia recebeu o projeto da ana", (await bia.repo.dados()).etapas.length === 3);

  await ana.repo.editarEtapa(x.id, { nome: "Minuta revisada" }, "2026-10-06");
  await bia.repo.editarEtapa(y.id, { inicio: "2026-10-14", fim: "2026-10-27" }, "2026-10-06");
  // A ana lê; antes da conferência dela, a rodada inteira da bia grava o texto.
  texto.t.antesDaConferencia = () => bia.rodada();
  const sAna = await ana.rodada();
  const t1 = await noTexto(texto.t.html);
  checar(
    "o texto tem as duas alteracoes (a conferencia da ana achou o da bia e mesclou)",
    t1.e.find((e) => e.id === x.id)?.nome === "Minuta revisada" && t1.e.find((e) => e.id === y.id)?.fim === "2026-10-27",
    t1.e.map((e) => [e.nome, e.inicio, e.fim]),
  );
  checar("sem desistencia nem erro", sAna.estado === "ok" && !sAna.pendente, sAna);
  checar("a ana ja tem a alteracao da bia", (await ana.repo.obterEtapa(y.id))?.fim === "2026-10-27");
  const gravacoes = texto.t.gravacoes;
  await bia.rodada();
  checar("a bia, na rodada seguinte, tem a da ana", (await bia.repo.obterEtapa(x.id))?.nome === "Minuta revisada");
  checar("e nao regrava (o texto ja estava em dia)", texto.t.gravacoes === gravacoes);
  const h = (await noTexto(texto.t.html)).h;
  checar(
    "o historico tem quem mudou o que (os dois)",
    h.some((r) => r.por === "ana" && r.campo === "nome") && h.some((r) => r.por === "bia" && r.campo === "fim"),
    h.map((r) => `${r.por}:${r.campo}`),
  );

  secao("corrida na unidade: exclusao nao ressuscita");
  await ana.repo.removerEtapa(z.id);
  await bia.repo.editarEtapa(y.id, { nome: "Consulta pública (30 dias)" }, "2026-10-06");
  // A bia (que ainda tem a etapa Z viva) lê; a ana exclui e grava antes da conferência dela.
  texto.t.antesDaConferencia = () => ana.rodada();
  await bia.rodada();
  const t2 = await noTexto(texto.t.html);
  const zNoTexto = t2.e.find((e) => e.id === z.id);
  checar(
    "a etapa excluida continua lapide no texto (a copia velha da bia nao a trouxe de volta)",
    zNoTexto?.removidoEm !== undefined,
    zNoTexto,
  );
  checar("a edicao da bia entrou junto", t2.e.find((e) => e.id === y.id)?.nome === "Consulta pública (30 dias)");
  checar("na bia, a etapa sumiu", (await bia.repo.obterEtapa(z.id)) === undefined);
  await ana.rodada();
  checar(
    "na ana, a edicao da bia chegou e a exclusao ficou",
    (await ana.repo.obterEtapa(y.id))?.nome === "Consulta pública (30 dias)" && (await ana.repo.obterEtapa(z.id)) === undefined,
  );
  const terceira = computador("caio", "pc-caio", texto, AGORA + 9);
  await terceira.rodada();
  checar("um terceiro, que chega depois, recebe tudo e sem a etapa excluida", (await terceira.repo.dados()).etapas.length === 2);
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarSincroniaCorrida } from "./verificar-sincronia-corrida";
import { verificarSincroniaTexto } from "./verificar-sincronia-texto";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarSincroniaRepo();
```

por:

```ts
await verificarSincroniaRepo();
await verificarSincroniaTexto();
await verificarSincroniaCorrida();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/sincronia/textoPadrao' imported from …/projetos/tests/verificar-sincronia-texto.ts` (ou `…-corrida.ts`: as duas importam o módulo que falta)

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/sincronia/textoPadrao.ts`:

```ts
/**
 * Os Textos Padrão do gestor de projetos (spec 6.1): o da unidade
 * `[_SEIPRO_PRJ_UNIDADE]`, de todos da unidade, e o pessoal
 * `[_SEIPRO_PRJ_<login>]`. Aqui fica o adaptador do motor genérico
 * (`@comum/sincronia/motor`): o envelope de UM escopo, a validação (mesmo SEI,
 * unidade e visibilidade e, no pessoal, o login; versão maior = "mais novo"),
 * a privacidade dos sigilosos, a poda e a assinatura.
 *
 * Privacidade (spec 5.4): o número de processo sigiloso nunca vai (o vínculo
 * vai vazio, marcado sigiloso), nem o documento de etapa sigilosa (processo
 * próprio sigiloso, ou nenhum processo próprio num projeto sigiloso); registros
 * antigos do histórico com o número de um processo que hoje é sigiloso vão com
 * "processo sigiloso". Quem tem os números os mantém na mescla
 * (`manterNumeroSigiloso`, `manterDocumentoSigiloso`).
 *
 * Poda na exportação: lápides de mais de 180 dias (unidade) ou 90 (pessoal) e
 * o histórico além dos 300 registros mais recentes ficam de fora.
 */

import type { Area } from "@comum/armazenamento/area";
import { assinaturaEstavel, jsonEstavel, porId } from "@comum/sincronia/assinatura";
import { purgarLapides } from "@comum/sincronia/entidade";
import type { AdaptadorTexto } from "@comum/sincronia/motor";
import { nomeDeTextoInterno, type ValidacaoTexto, versaoMaisNova } from "@comum/sincronia/textoPadraoCodec";
import { chaveSyncTexto, DIAS_LAPIDE_EU, DIAS_LAPIDE_UNIDADE, FOLGA_RELOGIO_MS, LIMITES } from "../modelo/constantes";
import { chaveEscopo } from "../modelo/escopo";
import { excedentes } from "../modelo/historico";
import type { Entidades, EnvelopeProjetos, Escopo, Etapa, Projeto, Registro, Vinculo, Vis } from "../modelo/tipos";
import { chaveProtocolo } from "../modelo/vinculos";
import type { RepositorioProjetos } from "../repositorio";

/** O CKEditor 5 baixa o conteúdo de todos os textos da unidade (como nos Favoritos). */
export const TETO_TEXTO = 100 * 1024;
export const AVISO_TEXTO = 80 * 1024;
export const FORMATO = "seipro-projetos";
export const VERSAO = 1;

/** Quantidades que nenhum texto legítimo de 100 KB alcança: acima, o texto é tratado como inválido. */
export const TETOS_ENVELOPE: Readonly<Record<keyof Entidades, number>> = { p: 2000, f: 20_000, e: 60_000, h: 5000, m: 500 };

export const SIGILOSO_PROCESSO = "processo sigiloso";
export const SIGILOSO_DOCUMENTO = "documento de processo sigiloso";

/** A desistência depois das releituras: o motor tenta de novo sozinho (o app mostra como "pendente"). */
export const MENSAGEM_MUDOU =
  "O texto mudou enquanto era gravado (um colega sincronizando ao mesmo tempo). O SEI Pro tenta de novo em instantes.";

/** `[_SEIPRO_PRJ_UNIDADE]` ou `[_SEIPRO_PRJ_<login>]` (login longo encurtado como nos Favoritos). */
export function nomeDoTexto(vis: Vis, login: string): string {
  return nomeDeTextoInterno("PRJ", vis === "unidade" ? "UNIDADE" : login.trim().toLowerCase());
}

export function descricaoDoTexto(vis: Vis): string {
  return vis === "unidade"
    ? "Projetos da unidade (SEI Pro). Gerado automaticamente; não edite."
    : "Projetos pessoais (SEI Pro). Gerado automaticamente; não edite.";
}

/** O parágrafo legível que abre o texto. */
export function legivelProjetos(vis: Vis, sigla: string, nomeUsuario: string): string {
  const de = vis === "unidade" ? `da unidade ${sigla}` : `de ${nomeUsuario}`;
  return `Dados internos do SEI Pro — projetos ${de}. Não use em documentos nem edite: o SEI Pro regrava este texto sozinho.`;
}

/** Chaves (chrome.storage.local) do que a sincronia deste escopo anota além do status. */
export const chaveRelatorio = (e: Escopo): string => `projetos/sync/relatorio/${chaveEscopo(e)}`;
export const chaveSubstituido = (e: Escopo): string => `projetos/sync/substituido/${chaveEscopo(e)}`;
export const chaveStatusTexto = (e: Escopo): string => chaveSyncTexto(chaveEscopo(e));

/** O que a última leitura do texto deixou de fora (o diálogo explica; `futuros` = relógio daqui atrasado). */
export interface RelatorioImportacao {
  quando: number;
  ignorados: number;
  excedentes: number;
  futuros: number;
}

/** O texto que estava inválido e foi regravado: guardado neste navegador (o último, por escopo). */
export interface TextoSubstituido {
  quando: number;
  motivo: string;
  html: string;
  cortado: boolean;
}

/** Até 300 KB do texto inválido ficam guardados (o storage.local tem 10 MB). */
const LIMITE_GUARDADO = 300 * 1024;

const LISTAS = ["p", "f", "e", "h", "m"] as const;

export function validarEnvelope(bruto: unknown, escopo: Escopo): ValidacaoTexto<EnvelopeProjetos> {
  // Gravado por uma versão mais nova do SEI Pro: não é "inválido", e esta versão não pode regravar por cima.
  if (versaoMaisNova(bruto, FORMATO, VERSAO)) return { maisNovo: true };
  const b = bruto as Partial<EnvelopeProjetos> | null;
  if (!b || typeof b !== "object" || b.formato !== FORMATO || b.versao !== VERSAO)
    return { invalido: "o texto não está no formato dos projetos" };
  if (b.host !== escopo.host || String(b.unidade) !== escopo.unidade || b.vis !== escopo.vis)
    return { invalido: "o texto é de outro SEI, de outra unidade ou de outra visibilidade" };
  if (escopo.vis === "eu" && (typeof b.login !== "string" || b.login.trim().toLowerCase() !== escopo.login.trim().toLowerCase()))
    return { invalido: "o texto é de outro usuário" };
  const ent = b.entidades as Partial<Record<keyof Entidades, unknown>> | undefined;
  if (!ent || typeof ent !== "object") return { invalido: "o texto não tem os projetos" };
  const entidades = {} as Record<keyof Entidades, unknown[]>;
  for (const k of LISTAS) {
    const lista = ent[k] ?? [];
    if (!Array.isArray(lista)) return { invalido: "o texto não tem os projetos" };
    if (lista.length > TETOS_ENVELOPE[k]) return { invalido: "o texto tem itens demais" };
    entidades[k] = lista;
  }
  return { ok: { ...(b as EnvelopeProjetos), entidades: entidades as unknown as Entidades } };
}

/** O envelope que vai ao Texto Padrão: sem números sigilosos e podado (lápides e histórico). */
export function paraOTexto(env: EnvelopeProjetos, agora: number): EnvelopeProjetos {
  const dias = env.vis === "unidade" ? DIAS_LAPIDE_UNIDADE : DIAS_LAPIDE_EU;
  const ent = env.entidades;
  const p = purgarLapides(ent.p, agora, dias);
  const f = purgarLapides(ent.f, agora, dias);
  const e = purgarLapides(ent.e, agora, dias);
  const m = purgarLapides(ent.m, agora, dias);
  const vivosH = purgarLapides(ent.h, agora, dias);
  const fora = new Set(excedentes(vivosH, LIMITES.historico));
  // Um processo marcado sigiloso em qualquer lugar (projeto ou etapa, viva ou lápide) é sigiloso em todos.
  const chaves = new Set<string>();
  for (const x of [...ent.p, ...ent.e]) {
    const v = x.processo;
    if (v?.sigiloso && typeof v.protocolo === "string" && chaveProtocolo(v.protocolo)) chaves.add(chaveProtocolo(v.protocolo));
  }
  const sigiloso = (v: Vinculo | undefined): boolean =>
    !!v && (v.sigiloso === true || (typeof v.protocolo === "string" && chaves.has(chaveProtocolo(v.protocolo))));
  const vazio: Vinculo = { protocolo: "", sigiloso: true };
  const projetosSigilosos = new Set(ent.p.filter((x) => sigiloso(x.processo)).map((x) => x.id));
  const etapaSigilosa = (x: Etapa): boolean => (x.processo ? sigiloso(x.processo) : projetosSigilosos.has(x.projeto));
  const etapasSigilosas = new Set(ent.e.filter(etapaSigilosa).map((x) => x.id));
  const textoDoProcesso = (t: string | undefined): string | undefined => {
    if (t === undefined) return t;
    const k = chaveProtocolo(t);
    return k && chaves.has(k) ? SIGILOSO_PROCESSO : t;
  };
  const projetos = p.map((x): Projeto => (sigiloso(x.processo) ? { ...x, processo: vazio } : x));
  const etapas = e.map((x): Etapa => {
    let y: Etapa = sigiloso(x.processo) ? { ...x, processo: vazio } : x;
    if (y.documento && etapaSigilosa(x)) {
      const { documento: _fora, ...resto } = y;
      y = resto;
    }
    return y;
  });
  const registros = vivosH
    .filter((r) => !fora.has(r.id))
    .map((r): Registro => {
      if (r.campo === "processo") {
        const antes = textoDoProcesso(r.antes);
        const depois = textoDoProcesso(r.depois);
        return antes === r.antes && depois === r.depois ? r : semIndefinidos({ ...r, antes, depois });
      }
      if (r.campo === "documento" && etapasSigilosas.has(r.alvo) && (r.antes || r.depois)) {
        return semIndefinidos({
          ...r,
          antes: r.antes ? SIGILOSO_DOCUMENTO : undefined,
          depois: r.depois ? SIGILOSO_DOCUMENTO : undefined,
        });
      }
      return r;
    });
  return { ...env, entidades: { p: projetos, f, e: etapas, h: registros, m } };
}

function semIndefinidos(r: Registro): Registro {
  const x = { ...r } as Record<string, unknown>;
  for (const k of ["antes", "depois"]) if (x[k] === undefined) delete x[k];
  return x as unknown as Registro;
}

/** Igual para o mesmo conteúdo em qualquer computador: sem `gerado`, listas pelo id. */
export function assinaturaProjetos(env: EnvelopeProjetos): string {
  const e = env.entidades;
  return assinaturaEstavel({ p: porId(e.p), f: porId(e.f), e: porId(e.e), h: porId(e.h), m: porId(e.m) });
}

/** Itens com carimbo mais de 1 dia à frente do relógio daqui: a importação os recusa (relógio atrasado?). */
export function contarFuturos(ent: Partial<Entidades>, agora: number): number {
  const teto = agora + FOLGA_RELOGIO_MS;
  let n = 0;
  for (const k of LISTAS) {
    for (const x of (ent[k] ?? []) as unknown[]) {
      const o = x as { atualizadoEm?: unknown; removidoEm?: unknown } | null;
      if ((typeof o?.atualizadoEm === "number" && o.atualizadoEm > teto) || (typeof o?.removidoEm === "number" && o.removidoEm > teto)) n++;
    }
  }
  return n;
}

export interface DepsAdaptador {
  repo: RepositorioProjetos;
  /** chrome.storage.local: relatório da leitura e cópia do texto inválido. */
  area: Area;
  sigla: string;
  nomeUsuario: string;
}

export function adaptadorProjetos(d: DepsAdaptador): AdaptadorTexto<EnvelopeProjetos> {
  const escopo = d.repo.escopo;
  const unidade = escopo.vis === "unidade";
  return {
    modulo: "projetos",
    chaveStatus: chaveStatusTexto(escopo),
    teto: TETO_TEXTO,
    aviso: AVISO_TEXTO,
    legivel: () => legivelProjetos(escopo.vis, d.sigla, d.nomeUsuario),
    validar: (bruto) => validarEnvelope(bruto, escopo),
    async importar(env) {
      const agora = d.repo.carimboAtual().agora;
      const futuros = contarFuturos(env.entidades, agora);
      const r = await d.repo.importar(env.entidades);
      const k = chaveRelatorio(escopo);
      const anterior = (await d.area.obter(k))[k] as RelatorioImportacao | undefined;
      const novo: RelatorioImportacao = { quando: agora, ignorados: r.ignorados, excedentes: r.excedentes, futuros };
      // Só grava quando muda (o "quando" não conta): uma escrita por rodada à toa acordaria todos os ouvintes.
      const sem = (x?: RelatorioImportacao) => (x ? jsonEstavel({ ...x, quando: 0 }) : "");
      if (sem(anterior) !== sem(novo) && (anterior || r.ignorados || futuros)) await d.area.gravar({ [k]: novo });
    },
    exportar: async ({ agora }) => paraOTexto(await d.repo.exportar(agora), agora),
    assinatura: assinaturaProjetos,
    vazio: (env) => LISTAS.every((k) => env.entidades[k].length === 0),
    async antesDeRegravarInvalido(motivo, html) {
      const guardado: TextoSubstituido = {
        quando: d.repo.carimboAtual().agora,
        motivo,
        html: html.slice(0, LIMITE_GUARDADO),
        cortado: html.length > LIMITE_GUARDADO,
      };
      await d.area.gravar({ [chaveSubstituido(escopo)]: guardado });
    },
    mensagens: {
      maisNovo:
        "Os projetos no SEI foram gravados por uma versão mais nova do SEI Pro. Atualize a extensão neste computador; o texto não foi alterado.",
      grandeDemais: (kb, tetoKb) =>
        unidade
          ? `Os projetos da unidade passaram do limite do Texto Padrão (${kb} KB de ${tetoKb} KB) e não foram gravados. Exclua projetos que não usa mais (os arquivados também ocupam espaço) ou leve alguns para “Só eu”.`
          : `Seus projetos passaram do limite do Texto Padrão (${kb} KB de ${tetoKb} KB) e não foram gravados. Exclua projetos que não usa mais (os arquivados também ocupam espaço).`,
      pertoDoTeto: (kb) => `Os projetos estão perto do limite do Texto Padrão (${kb} KB de 100 KB).`,
      invalidoRegravado: (motivo) =>
        `O texto no SEI estava inválido (${motivo}) e foi regravado a partir deste computador; o texto antigo ficou guardado neste navegador.`,
      mudouDuranteGravacao: MENSAGEM_MUDOU,
    },
  };
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2 && TZ=Asia/Tokyo npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1036 ok, 0 falha(s)` duas vezes (+56). A seção "corrida na unidade" é o Review Focus 2 do plano-mestre: as duas edições estão no texto depois da rodada de cada um, a exclusão não volta pela cópia velha da colega e o terceiro computador recebe tudo.

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: sem saída do `tsc`; Biome sem erro.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/sincronia/textoPadrao.ts \
  projetos/tests/verificar-sincronia-texto.ts \
  projetos/tests/verificar-sincronia-corrida.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: adaptador do Texto Padrao sem sigilo e podado, e a corrida na unidade

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 5: Projetos — a sincronia do lado da aba (dois textos, consentimento por texto)

**Files:**
- Create: `projetos/src/sincronia/consentimento.ts`, `projetos/src/pagina/sincronia.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/pagina/verificar-sincronia-pagina.ts`

**Interfaces:**
- Consumes: `ControleTextoPadrao` com `lerSemConsentimento`, `lerNoRecuo`, `releituras` (Tarefa 1); `ArmazemTexto`, `Travar`, `TravarEsperando`; `chaveConsentimento`, `consentimentoNaArea`, `PortaConsentimento`; `adaptadorProjetos` (Tarefa 4); `RepositorioProjetos` (P2).
- Produces: `CHAVE_CONSENTIMENTO = "projetos/consentimento"`, `chaveDoConsentimento(host, login, idUnidade, vis)` (`host|login|idUnidade|un` ou `…|eu`), `consentimentoProjetos(sync, host, login, idUnidade, vis): PortaConsentimento`; `INTERVALO_PUXAR = 120000`; `DepsSincroniaPagina { host; login; nomeUsuario; unidade: { id; sigla }; area; sync; repos; armazem(vis): ArmazemTexto; travar; travarEsperando?; atrasoEnvio? }`; `ResultadoSincronizar { unidade: StatusSync; eu: StatusSync | null }`; `class SincroniaPagina { consentimento(vis); iniciar({ puxar }); puxar(); agora(): Promise<ResultadoSincronizar>; apagarPessoal(): Promise<boolean>; parar() }`. O texto da unidade é lido sem consentimento e só gravado com ele; o pessoal não é nem lido sem ele; "apagar" só existe para o pessoal.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/pagina/verificar-sincronia-pagina.ts`:

```ts
/**
 * A sincronia do lado da aba (pagina/sincronia.ts): o texto da unidade lido sem
 * consentimento e gravado só depois do "Entendi"; o pessoal desligado até o
 * consentimento; "sincronizar agora" e "apagar" (só o pessoal); o número
 * sigiloso nunca chega ao texto.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { definirConsentimento } from "@comum/sincronia/consentimento";
import type { ConferenciaTexto, ResultadoGravacao, StatusSync } from "@comum/sincronia/motor";
import { gerarConteudoTexto } from "@comum/sincronia/textoPadraoCodec";
import type { EnvelopeProjetos, Vis } from "../../src/modelo/tipos";
import { INTERVALO_PUXAR, SincroniaPagina } from "../../src/pagina/sincronia";
import { RepositorioProjetos } from "../../src/repositorio";
import { CHAVE_CONSENTIMENTO, chaveDoConsentimento } from "../../src/sincronia/consentimento";
import { chaveStatusTexto } from "../../src/sincronia/textoPadrao";
import { checar, secao, tique } from "../util";

const AGORA = Date.UTC(2026, 9, 6, 12);
const HOST = "sei.x.gov.br";

function textoNoSei(html: string | null = null) {
  const t = {
    html,
    lidas: 0,
    gravadas: 0,
    excluido: false,
    async ler() {
      t.lidas++;
      return t.html;
    },
    async gravar(h: string) {
      t.gravadas++;
      t.html = h;
    },
    async gravarConferindo(h: string, c: ConferenciaTexto): Promise<ResultadoGravacao> {
      if (!c.mesmo(t.html, c.anterior)) return { gravado: false, atual: t.html };
      t.gravadas++;
      t.html = h;
      return { gravado: true };
    },
    async excluir() {
      const havia = t.html !== null;
      t.html = null;
      t.excluido = true;
      return havia;
    },
  };
  return t;
}

function montar(textos: Record<Vis, ReturnType<typeof textoNoSei>>) {
  const area = areaMemoria();
  const sync = areaMemoria();
  const relogio = { agora: AGORA };
  const repo = (vis: Vis) =>
    new RepositorioProjetos(area, { host: HOST, login: "ana", unidade: "110", vis }, () => ({
      agora: ++relogio.agora,
      dispositivo: "pc-ana",
      por: "ana",
      nome: "Ana Lima",
    }));
  const repos = { unidade: repo("unidade"), eu: repo("eu") };
  const s = new SincroniaPagina({
    host: HOST,
    login: "ana",
    nomeUsuario: "Ana Lima",
    unidade: { id: "110", sigla: "SEPRO" },
    area,
    sync,
    repos,
    armazem: (vis) => textos[vis],
    travar: (_n, fn) => fn(),
    atrasoEnvio: 10,
  });
  const consentir = (vis: Vis, v: "ligado" | "desligado") =>
    definirConsentimento(sync, CHAVE_CONSENTIMENTO, "textoPadrao", chaveDoConsentimento(HOST, "ana", "110", vis), v);
  const status = async (vis: Vis) => {
    const k = chaveStatusTexto(repos[vis].escopo);
    return (await area.obter(k))[k] as StatusSync | undefined;
  };
  return { s, repos, area, sync, consentir, status };
}

const doColega = (): EnvelopeProjetos => ({
  formato: "seipro-projetos",
  versao: 1,
  host: HOST,
  unidade: "110",
  vis: "unidade",
  gerado: AGORA,
  entidades: {
    p: [{ id: "pc1", nome: "Do colega", etiquetas: [], ordem: "a0", criadoEm: AGORA, atualizadoEm: AGORA, dispositivo: "pc-bia" }],
    f: [],
    e: [],
    h: [],
    m: [],
  },
});

export async function verificarSincroniaPagina(): Promise<void> {
  secao("pagina: o texto da unidade e lido sem consentimento");
  const un = textoNoSei(await gerarConteudoTexto("Dados", doColega()));
  const eu = textoNoSei(null);
  const m = montar({ unidade: un, eu });
  await m.s.iniciar({ puxar: true });
  await tique(40);
  checar("le e mescla o projeto do colega", (await m.repos.unidade.dados()).projetos.some((p) => p.id === "pc1") && un.gravadas === 0);
  checar("o pessoal, desligado, nem e lido", eu.lidas === 0);
  await m.repos.unidade.criarProjeto({ nome: "Meu da unidade", processo: { protocolo: "50300.000777/2026-10", sigiloso: true } });
  await tique(60);
  checar(
    "mudanca na unidade sem o 'Entendi': nao grava e fica aguardando",
    un.gravadas === 0 && (await m.status("unidade"))?.aguardandoPermissao === true,
  );
  await m.consentir("unidade", "ligado");
  await tique(60);
  checar("com o 'Entendi': grava na hora", un.gravadas === 1);
  checar("e o numero sigiloso nao foi junto", !(un.html ?? "").includes("000777") && un.html !== null);
  const r = await m.s.agora();
  checar("sincronizar agora: a unidade sim, o pessoal (desligado) nao", r.unidade.estado === "ok" && r.eu === null, r);

  secao("pagina: o texto pessoal so com consentimento");
  await m.repos.eu.criarProjeto({ nome: "Só meu" });
  await tique(40);
  checar("desligado: o pessoal nao vai", eu.gravadas === 0 && eu.lidas === 0);
  await m.consentir("eu", "ligado");
  await tique(60);
  checar("ligado: grava o pessoal", eu.gravadas === 1);
  const r2 = await m.s.agora();
  checar("sincronizar agora devolve os dois", r2.unidade.estado === "ok" && r2.eu?.estado === "ok", r2);
  const lidasAntes = un.lidas;
  await m.s.puxar();
  checar("puxar ao focar respeita os 2 min", un.lidas === lidasAntes && INTERVALO_PUXAR === 120_000);
  const apagou = await m.s.apagarPessoal();
  checar("apagar: so o pessoal, e desliga", apagou && eu.excluido && un.html !== null);
  const prefs = (await m.sync.obter(CHAVE_CONSENTIMENTO))[CHAVE_CONSENTIMENTO] as { textoPadrao: Record<string, string> };
  checar(
    "consentimentos por texto no storage.sync",
    prefs.textoPadrao[`${HOST}|ana|110|eu`] === "desligado" && prefs.textoPadrao[`${HOST}|ana|110|un`] === "ligado",
    prefs,
  );
  m.s.parar();
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await ((await import(suitePagina)) as { verificarPagina(): Promise<void> }).verificarPagina();
```

por:

```ts
await ((await import(suitePagina)) as { verificarPagina(): Promise<void> }).verificarPagina();
const suiteSincroniaPagina = "./pagina/verificar-sincronia-pagina";
await ((await import(suiteSincroniaPagina)) as { verificarSincroniaPagina(): Promise<void> }).verificarSincroniaPagina();
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/pagina/sincronia' imported from …/projetos/tests/pagina/verificar-sincronia-pagina.ts` (depois de todas as outras suítes passarem: a do content script é a última do agregador)

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/sincronia/consentimento.ts`:

```ts
/**
 * Consentimento dos Textos Padrão dos projetos, por pessoa, unidade e texto
 * (`host|login|idUnidade|un` e `…|eu`), no storage.sync (segue o perfil do
 * navegador, como nos Favoritos). O da unidade nasce do aviso único
 * ("Entendi", spec 6.1); o pessoal, do diálogo "Guardar no SEI" (convite).
 * Lido pelo content script (que grava no SEI) e pelo app (que pergunta).
 */

import type { Area } from "@comum/armazenamento/area";
import { chaveConsentimento, consentimentoNaArea, type PortaConsentimento } from "@comum/sincronia/consentimento";
import type { Vis } from "../modelo/tipos";

export const CHAVE_CONSENTIMENTO = "projetos/consentimento";
const CAMPO = "textoPadrao";

export function chaveDoConsentimento(host: string, login: string, idUnidade: string, vis: Vis): string {
  return chaveConsentimento(host, login, idUnidade, vis === "unidade" ? "un" : "eu");
}

export function consentimentoProjetos(sync: Area, host: string, login: string, idUnidade: string, vis: Vis): PortaConsentimento {
  return consentimentoNaArea({
    area: sync,
    chavePreferencias: CHAVE_CONSENTIMENTO,
    campo: CAMPO,
    chave: chaveDoConsentimento(host, login, idUnidade, vis),
  });
}
```

Arquivo completo `projetos/src/pagina/sincronia.ts`:

```ts
/**
 * Sincronia por Texto Padrão do lado da aba do SEI (o content script tem a
 * sessão): um controle por texto, com o adaptador dos projetos
 * (`sincronia/textoPadrao.ts`) e o motor genérico do sei-comum.
 *
 * - "Toda a unidade" (`[_SEIPRO_PRJ_UNIDADE]`): lido sempre, mesmo sem
 *   consentimento (são os projetos dos colegas); gravado só depois do aviso
 *   único ("Entendi"), que o app pergunta. No recuo de "indisponível" (quem lê
 *   mas não pode alterar) continua lendo. Não há "apagar" para ele: o texto é
 *   de todos.
 * - "Só eu" (`[_SEIPRO_PRJ_<login>]`): desligado por padrão; liga com o
 *   consentimento do diálogo do app; "apagar" exclui o texto e desliga.
 *
 * Puxa ao iniciar (o Controle de Processos), ao ganhar foco (no máximo a cada
 * 2 min) e com pendência; mudança local vai 15 s depois. As duas gravações
 * conferem o conteúdo lido no formulário de alterar (armazém do núcleo).
 */

import type { Area } from "@comum/armazenamento/area";
import { type ArmazemTexto, ControleTextoPadrao } from "@comum/sincronia/controlePagina";
import type { StatusSync } from "@comum/sincronia/motor";
import type { Travar, TravarEsperando } from "@comum/sincronia/trava";
import type { EnvelopeProjetos, Vis } from "../modelo/tipos";
import type { RepositorioProjetos } from "../repositorio";
import { consentimentoProjetos } from "../sincronia/consentimento";
import { adaptadorProjetos } from "../sincronia/textoPadrao";

export const INTERVALO_PUXAR = 2 * 60_000;

export interface DepsSincroniaPagina {
  host: string;
  login: string;
  nomeUsuario: string;
  unidade: { id: string; sigla: string };
  /** chrome.storage.local: os dados, o status e o relatório. */
  area: Area;
  /** chrome.storage.sync: o consentimento. */
  sync: Area;
  repos: Readonly<Record<Vis, RepositorioProjetos>>;
  /** O armazém do núcleo para o texto de cada escopo (criado só na primeira rodada). */
  armazem(vis: Vis): ArmazemTexto;
  travar: Travar;
  travarEsperando?: TravarEsperando;
  atrasoEnvio?: number;
}

export interface ResultadoSincronizar {
  unidade: StatusSync;
  /** null: o texto pessoal está desligado. */
  eu: StatusSync | null;
}

export class SincroniaPagina {
  private readonly controles: Record<Vis, ControleTextoPadrao<EnvelopeProjetos>>;

  constructor(private readonly d: DepsSincroniaPagina) {
    const controle = (vis: Vis) =>
      new ControleTextoPadrao<EnvelopeProjetos>({
        area: d.area,
        adaptador: adaptadorProjetos({ repo: d.repos[vis], area: d.area, sigla: d.unidade.sigla, nomeUsuario: d.nomeUsuario }),
        armazem: () => d.armazem(vis),
        consentimento: this.consentimento(vis),
        aoMudarLocal: (cb) => d.repos[vis].aoMudar(cb),
        travar: d.travar,
        travarEsperando: d.travarEsperando,
        atrasoEnvio: d.atrasoEnvio,
        intervaloPuxar: INTERVALO_PUXAR,
        // O texto da unidade é de todos: conferência na gravação; até 3 tentativas por rodada.
        releituras: 3,
        lerSemConsentimento: vis === "unidade",
        lerNoRecuo: vis === "unidade",
      });
    this.controles = { unidade: controle("unidade"), eu: controle("eu") };
  }

  consentimento(vis: Vis) {
    return consentimentoProjetos(this.d.sync, this.d.host, this.d.login, this.d.unidade.id, vis);
  }

  /** `puxar`: ler já (o Controle de Processos); sem ele, só com pendência de uma carga anterior. */
  async iniciar(o: { puxar: boolean }): Promise<void> {
    await this.controles.unidade.iniciar(o);
    await this.controles.eu.iniciar(o);
  }

  /** A aba ganhou foco: puxa os ligados, respeitando os 2 min. */
  async puxar(): Promise<void> {
    await Promise.all([this.controles.unidade.puxar(), this.controles.eu.puxar()]);
  }

  /** "Sincronizar agora" (RPC do app): a unidade sempre; o pessoal só se ligado. */
  async agora(): Promise<ResultadoSincronizar> {
    const unidade = await this.controles.unidade.agora();
    const eu = (await this.consentimento("eu").estado()) === "ligado" ? await this.controles.eu.agora() : null;
    return { unidade, eu };
  }

  /** "Desligar e apagar do SEI" (RPC do app): só o texto pessoal. O da unidade é de todos. */
  apagarPessoal(): Promise<boolean> {
    return this.controles.eu.apagar();
  }

  parar(): void {
    this.controles.unidade.parar();
    this.controles.eu.parar();
  }
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1048 ok, 0 falha(s)` (+12).

- [ ] **Step 5: Portões (os dois tsconfig)**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: sem saída do `tsc` (o `tsconfig.pagina.json` confere `src/pagina` e `tests/pagina`); Biome sem erro.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/sincronia/consentimento.ts \
  projetos/src/pagina/sincronia.ts \
  projetos/tests/pagina/verificar-sincronia-pagina.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: sincronia da aba com o texto da unidade lido sempre e o pessoal so com consentimento

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 6: Projetos — tudo do usuário num envelope: arquivo ligado, Exportar/Importar e cópias diárias

**Files:**
- Create: `projetos/src/sincronia/arquivo.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-sincronia-arquivo.ts`

**Interfaces:**
- Consumes: `AdaptadorArquivo`, `ControleArquivo`, `SincroniaArquivo`, `escolherArquivoSync`, `handlesNoIndexedDB`, `ArmazemCopias`, `Copia`, `copiasNoIndexedDB`, `copiasEmMemoria`, `fazerCopiaDoDia`, `recarimbarAtivos`, `Dono`, `obterPorPrefixo`, `assinaturaEstavel`, `porId` (sei-comum); `RepositorioProjetos` (`entidades`, `importar`), `chaveEscopo`, `chaveSyncArquivo`, `ResultadoImportacao` (P2); `TETOS_ENVELOPE` (Tarefa 4).
- Produces: `FORMATO_ARQUIVO`, `VERSAO_ARQUIVO`, `BANCO = "seipro-projetos"`; `EscopoNoArquivo { escopo; entidades }`, `EnvelopeArquivo { formato; versao; tipo: "copia"; gerado; escopos }`, `CopiaProjetos`, `ArmazemCopiasProjetos`; `chaveStatusArquivo(dono)`, `nomeDoArquivo(dono)`; `escoposDoUsuario(area, dono): Promise<Escopo[]>`; `exportarTudo(area, dono, carimbo)`; `lerEnvelopeArquivo(bruto): EnvelopeArquivo | null`; `importarTudo(area, env, dono, carimbo): Promise<ResultadoImportacao>`; `assinaturaArquivo(env)`; `adaptadorArquivoProjetos(area, dono, carimbo)`; `controleArquivo(area, dono, carimbo): ControleArquivo<EnvelopeArquivo>`; `copiasDosProjetos()`; `projetosNaCopia(env)`; `fazerCopiaDoDia(area, dono, armazem, hoje, carimbo): Promise<boolean>`; `restaurarCopia(area, copia, dono, carimbo): Promise<number>`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-sincronia-arquivo.ts`:

```ts
/**
 * Arquivo, cópias diárias e Exportar/Importar (spec 6.2): todos os escopos do
 * usuário num SEI (inclusive os números sigilosos, que são dele), mescla na
 * leitura, o que é de outro usuário fica, e restaurar traz de volta só o que
 * estava ativo na cópia.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { SincroniaArquivo } from "@comum/sincronia/arquivo";
import { copiasEmMemoria } from "@comum/sincronia/copias";
import type { Escopo } from "../src/modelo/tipos";
import { RepositorioProjetos } from "../src/repositorio";
import {
  adaptadorArquivoProjetos,
  type EnvelopeArquivo,
  escoposDoUsuario,
  exportarTudo,
  fazerCopiaDoDia,
  importarTudo,
  lerEnvelopeArquivo,
  nomeDoArquivo,
  restaurarCopia,
} from "../src/sincronia/arquivo";
import { checar, secao } from "./util";

const AGORA = Date.UTC(2026, 9, 6, 12);
const HOST = "sei.x.gov.br";
const DONO = { host: HOST, login: "Ana" };

function repos(area: ReturnType<typeof areaMemoria>, relogio = { agora: AGORA }) {
  const carimbo = () => ({ agora: ++relogio.agora, dispositivo: "pc-ana", por: "ana", nome: "Ana" });
  const de = (e: Partial<Escopo>) =>
    new RepositorioProjetos(area, { host: HOST, login: "ana", unidade: "110", vis: "unidade", ...e }, carimbo);
  return { carimbo, de };
}

export async function verificarSincroniaArquivo(): Promise<void> {
  secao("arquivo: todos os escopos do usuario neste SEI");
  const area = areaMemoria();
  const { carimbo, de } = repos(area);
  await de({}).criarProjeto({ nome: "Da unidade 110", processo: { protocolo: "50300.000777/2026-10", sigiloso: true } });
  await de({ vis: "eu" }).criarProjeto({ nome: "Meu na 110" });
  await de({ unidade: "220" }).criarProjeto({ nome: "Da unidade 220" });
  await new RepositorioProjetos(area, { host: HOST, login: "bia", unidade: "110", vis: "unidade" }, carimbo).criarProjeto({
    nome: "Da bia",
  });
  await new RepositorioProjetos(area, { host: "outro.gov.br", login: "ana", unidade: "110", vis: "unidade" }, carimbo).criarProjeto({
    nome: "Outro SEI",
  });
  const escopos = await escoposDoUsuario(area, DONO);
  checar(
    "acha os 3 escopos da ana neste SEI (e nao os da bia nem os do outro SEI)",
    escopos.map((e) => `${e.unidade}/${e.vis}`).join() === "110/eu,110/unidade,220/unidade",
    escopos,
  );
  const env = await exportarTudo(area, DONO, carimbo);
  checar("exporta os tres, com o formato da copia", env.tipo === "copia" && env.formato === "seipro-projetos" && env.escopos.length === 3);
  checar("leva o numero do sigiloso (o arquivo e do proprio usuario)", JSON.stringify(env).includes("50300.000777/2026-10"));
  checar("nome sugerido por login e SEI", nomeDoArquivo(DONO) === "projetos-seipro-ana-sei.x.gov.br.json");

  secao("arquivo: leitura e mescla");
  checar("le o envelope de volta", lerEnvelopeArquivo(JSON.parse(JSON.stringify(env)))?.escopos.length === 3);
  checar(
    "o do Texto Padrao (um escopo) nao e uma copia",
    lerEnvelopeArquivo({ formato: "seipro-projetos", versao: 1, host: HOST }) === null,
  );
  checar("escopo torto: recusado inteiro", lerEnvelopeArquivo({ ...env, escopos: [{ escopo: { host: HOST }, entidades: {} }] }) === null);
  const outraArea = areaMemoria();
  const r = await importarTudo(outraArea, env, DONO, repos(outraArea).carimbo);
  checar("importar mescla os tres escopos noutro navegador", r.novos >= 3 && (await escoposDoUsuario(outraArea, DONO)).length === 3, r);
  const daBia = await importarTudo(
    outraArea,
    { ...env, escopos: env.escopos.map((s) => ({ ...s, escopo: { ...s.escopo, login: "bia" } })) },
    DONO,
    repos(outraArea).carimbo,
  );
  checar(
    "o que e de outro login fica de fora",
    daBia.novos === 0 && (await escoposDoUsuario(outraArea, { host: HOST, login: "bia" })).length === 0,
  );

  secao("arquivo: a sincronia generica com o adaptador dos projetos");
  const noDisco = { conteudo: "", gravacoes: 0 };
  const arquivo = {
    ler: async () => noDisco.conteudo,
    gravar: async (c: string) => {
      noDisco.gravacoes++;
      noDisco.conteudo = c;
    },
  };
  const outros: EnvelopeArquivo = { ...env, escopos: [{ ...env.escopos[0]!, escopo: { ...env.escopos[0]!.escopo, login: "bia" } }] };
  noDisco.conteudo = JSON.stringify(outros);
  const sinc = new SincroniaArquivo({
    area,
    chaveStatus: "projetos/sync/arquivo/t",
    arquivo,
    adaptador: adaptadorArquivoProjetos(area, DONO, carimbo),
  });
  const s1 = await sinc.sincronizar();
  const gravado = JSON.parse(noDisco.conteudo) as EnvelopeArquivo;
  checar(
    "grava os escopos da ana e mantem os da bia que ja estavam no arquivo",
    s1.estado === "ok" &&
      gravado.escopos.length === 4 &&
      gravado.escopos.some((s) => s.escopo.login === "bia") &&
      /mantidos/.test(s1.mensagem ?? ""),
    s1,
  );
  const n = noDisco.gravacoes;
  await sinc.sincronizar();
  checar("sem mudanca, nao regrava", noDisco.gravacoes === n);
  noDisco.conteudo = "{ isto nao e json";
  const s3 = await sinc.sincronizar();
  checar(
    "arquivo ilegivel: regravado, sem apagar nada daqui",
    s3.estado === "ok" && /ilegível/.test(s3.mensagem ?? "") && (await escoposDoUsuario(area, DONO)).length === 3,
  );
  const futuro = JSON.stringify({ ...env, versao: 2 });
  noDisco.conteudo = futuro;
  const s4 = await sinc.sincronizar();
  checar("arquivo de versao mais nova: nao e tocado", s4.estado === "erro" && noDisco.conteudo === futuro);

  secao("copias diarias e restaurar");
  const copias = copiasEmMemoria<EnvelopeArquivo>();
  checar("a primeira do dia e feita", await fazerCopiaDoDia(area, DONO, copias, "2026-10-06", carimbo));
  checar("a segunda no mesmo dia nao", !(await fazerCopiaDoDia(area, DONO, copias, "2026-10-06", carimbo)));
  const [copia] = await copias.listar(DONO);
  checar("a copia conta os projetos ativos (os 3)", copia?.quantidade === 3, copia?.quantidade);
  for (let d = 7; d <= 21; d++) await fazerCopiaDoDia(area, DONO, copias, `2026-10-${String(d).padStart(2, "0")}`, carimbo);
  checar("ficam as 14 mais recentes", (await copias.listar(DONO)).length === 14);
  const un = de({});
  const [alvo] = (await un.dados()).projetos;
  await un.removerProjeto(alvo!.id);
  const novo = await un.criarProjeto({ nome: "Criado depois da copia" });
  const restaurados = await restaurarCopia(area, copia!, DONO, carimbo);
  checar(
    "restaurar traz de volta o excluido depois da copia e mantem o criado depois",
    restaurados >= 1 && !!(await un.obterProjeto(alvo!.id)) && !!(await un.obterProjeto(novo.id)),
    restaurados,
  );
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarSincroniaArquivo } from "./verificar-sincronia-arquivo";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarSincroniaCorrida();
```

por:

```ts
await verificarSincroniaCorrida();
await verificarSincroniaArquivo();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/sincronia/arquivo' imported from …/projetos/tests/verificar-sincronia-arquivo.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/sincronia/arquivo.ts`:

```ts
/**
 * Tudo o que o usuário tem num SEI (todas as unidades, "Toda a unidade" e "Só
 * eu", inclusive o número dos sigilosos: é dele), num envelope só (spec 6.2):
 * a cópia diária deste navegador, o arquivo numa pasta da nuvem e o
 * Exportar/Importar manual. Ler sempre MESCLA (vence o mais recente por
 * entidade); o que o arquivo tem de outro SEI ou de outro login fica.
 *
 * A mecânica do arquivo (File System Access, handle no IndexedDB do módulo,
 * permissão, regravação do ilegível) e a das cópias são as genéricas do
 * sei-comum, no banco `seipro-projetos`; aqui fica o envelope.
 */

import type { Area } from "@comum/armazenamento/area";
import { obterPorPrefixo } from "@comum/armazenamento/colecao";
import type { DataISO } from "@comum/datas/dias";
import { type AdaptadorArquivo, ControleArquivo, escolherArquivoSync, handlesNoIndexedDB } from "@comum/sincronia/arquivo";
import { assinaturaEstavel, porId } from "@comum/sincronia/assinatura";
import {
  type ArmazemCopias,
  type Copia,
  copiasNoIndexedDB,
  type Dono,
  fazerCopiaDoDia as fazerCopiaComum,
  recarimbarAtivos,
} from "@comum/sincronia/copias";
import { chaveSyncArquivo } from "../modelo/constantes";
import { chaveEscopo } from "../modelo/escopo";
import type { Carimbo, Entidades, Escopo, Vis } from "../modelo/tipos";
import { RepositorioProjetos, type ResultadoImportacao } from "../repositorio";
import { TETOS_ENVELOPE } from "./textoPadrao";

export const FORMATO_ARQUIVO = "seipro-projetos";
export const VERSAO_ARQUIVO = 1;
/** IndexedDB da extensão: depósitos `copias` e `arquivos` (sei-comum/sincronia/banco.ts). */
export const BANCO = "seipro-projetos";

export interface EscopoNoArquivo {
  escopo: Escopo;
  entidades: Entidades;
}

export interface EnvelopeArquivo {
  formato: typeof FORMATO_ARQUIVO;
  versao: typeof VERSAO_ARQUIVO;
  /** Distingue do envelope do Texto Padrão (um escopo) e do projeto enviado por arquivo. */
  tipo: "copia";
  gerado: number;
  escopos: EscopoNoArquivo[];
}

export type CopiaProjetos = Copia<EnvelopeArquivo>;
export type ArmazemCopiasProjetos = ArmazemCopias<EnvelopeArquivo>;

const LISTAS = ["p", "f", "e", "h", "m"] as const;
const mesmoDono = (e: Escopo, d: Dono) => e.host === d.host && e.login.trim().toLowerCase() === d.login.trim().toLowerCase();

export const chaveStatusArquivo = (d: Dono): string => chaveSyncArquivo(d.host, d.login);
export const nomeDoArquivo = (d: Dono): string => `projetos-seipro-${d.login.trim().toLowerCase()}-${d.host}.json`;

/** Os escopos que este usuário tem neste SEI (pelas chaves guardadas: `projetos/<host>|<login>|u:<id>/<un|eu>/…`). */
export async function escoposDoUsuario(area: Area, d: Dono): Promise<Escopo[]> {
  const login = d.login.trim().toLowerCase();
  const prefixo = `projetos/${d.host}|${login}|u:`;
  const achados = new Map<string, Escopo>();
  for (const k of Object.keys(await obterPorPrefixo(area, prefixo))) {
    const [unidade, vis] = k.slice(prefixo.length).split("/");
    if (!unidade || (vis !== "un" && vis !== "eu")) continue;
    const e: Escopo = { host: d.host, login, unidade, vis: (vis === "un" ? "unidade" : "eu") as Vis };
    achados.set(chaveEscopo(e), e);
  }
  return [...achados.values()].sort((a, b) => (chaveEscopo(a) < chaveEscopo(b) ? -1 : 1));
}

const repoDe = (area: Area, e: Escopo, carimbo: () => Carimbo) => new RepositorioProjetos(area, e, carimbo);

export async function exportarTudo(area: Area, d: Dono, carimbo: () => Carimbo): Promise<EnvelopeArquivo> {
  const escopos: EscopoNoArquivo[] = [];
  for (const e of await escoposDoUsuario(area, d)) escopos.push({ escopo: e, entidades: await repoDe(area, e, carimbo).entidades() });
  return { formato: FORMATO_ARQUIVO, versao: VERSAO_ARQUIVO, tipo: "copia", gerado: carimbo().agora, escopos };
}

const texto = (x: unknown): x is string => typeof x === "string" && x.length > 0 && x.length <= 300;

/** O envelope do JSON lido (forma e tetos), ou null se não é uma cópia de projetos. A forma de cada item é do `importar`. */
export function lerEnvelopeArquivo(bruto: unknown): EnvelopeArquivo | null {
  const b = bruto as Partial<EnvelopeArquivo> | null;
  if (!b || typeof b !== "object" || b.formato !== FORMATO_ARQUIVO || b.versao !== VERSAO_ARQUIVO || b.tipo !== "copia") return null;
  if (!Array.isArray(b.escopos) || b.escopos.length > 500) return null;
  const escopos: EscopoNoArquivo[] = [];
  for (const x of b.escopos as unknown[]) {
    const s = x as Partial<EscopoNoArquivo> | null;
    const e = s?.escopo as Partial<Escopo> | undefined;
    if (!e || !texto(e.host) || !texto(e.login) || !texto(e.unidade) || (e.vis !== "unidade" && e.vis !== "eu")) return null;
    const ent = s?.entidades as Partial<Record<keyof Entidades, unknown>> | undefined;
    if (!ent || typeof ent !== "object") return null;
    const entidades = {} as Record<keyof Entidades, unknown[]>;
    for (const k of LISTAS) {
      const lista = ent[k] ?? [];
      if (!Array.isArray(lista) || lista.length > TETOS_ENVELOPE[k]) return null;
      entidades[k] = lista;
    }
    escopos.push({ escopo: e as Escopo, entidades: entidades as unknown as Entidades });
  }
  return { formato: FORMATO_ARQUIVO, versao: VERSAO_ARQUIVO, tipo: "copia", gerado: Number(b.gerado) || 0, escopos };
}

/** Mescla o que é deste usuário neste SEI (o de outros fica no arquivo, intocado). */
export async function importarTudo(area: Area, env: EnvelopeArquivo, d: Dono, carimbo: () => Carimbo): Promise<ResultadoImportacao> {
  const soma: ResultadoImportacao = { novos: 0, atualizados: 0, ignorados: 0, excedentes: 0 };
  for (const s of env.escopos) {
    if (!mesmoDono(s.escopo, d)) continue;
    const e: Escopo = { ...s.escopo, login: s.escopo.login.trim().toLowerCase() };
    const r = await repoDe(area, e, carimbo).importar(s.entidades);
    soma.novos += r.novos;
    soma.atualizados += r.atualizados;
    soma.ignorados += r.ignorados;
    soma.excedentes += r.excedentes;
  }
  return soma;
}

/** Igual para o mesmo conteúdo em qualquer computador: escopos pela chave, listas pelo id, sem `gerado`. */
export function assinaturaArquivo(env: EnvelopeArquivo): string {
  return assinaturaEstavel(
    env.escopos
      .map((s) => ({
        k: chaveEscopo(s.escopo),
        p: porId(s.entidades.p),
        f: porId(s.entidades.f),
        e: porId(s.entidades.e),
        h: porId(s.entidades.h),
        m: porId(s.entidades.m),
      }))
      .sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0)),
  );
}

export function adaptadorArquivoProjetos(area: Area, d: Dono, carimbo: () => Carimbo): AdaptadorArquivo<EnvelopeArquivo> {
  return {
    formato: FORMATO_ARQUIVO,
    versao: VERSAO_ARQUIVO,
    ler: lerEnvelopeArquivo,
    importar: (env) => importarTudo(area, env, d, carimbo),
    async exportar(lido) {
      const meu = await exportarTudo(area, d, carimbo);
      // Escopos de outro SEI ou login (o mesmo arquivo escolhido em dois lugares): ficam como estão.
      const outros = (lido?.escopos ?? []).filter((s) => !mesmoDono(s.escopo, d));
      return { envelope: { ...meu, escopos: [...meu.escopos, ...outros] }, outros: outros.length };
    },
    assinatura: assinaturaArquivo,
    mensagens: {
      outros: (n) =>
        `O arquivo também tem ${n === 1 ? "projetos" : `${n} conjuntos de projetos`} de outro usuário ou outro SEI, que foram mantidos.`,
    },
  };
}

/** O arquivo ligado (Chrome/Edge): escolher, reconectar, sincronizar ao abrir e 15 s depois de mudar. */
export function controleArquivo(area: Area, d: Dono, carimbo: () => Carimbo): ControleArquivo<EnvelopeArquivo> {
  return new ControleArquivo<EnvelopeArquivo>({
    area,
    dono: d,
    chaveStatus: chaveStatusArquivo(d),
    handles: handlesNoIndexedDB(BANCO),
    escolher: (modo) => escolherArquivoSync(modo, nomeDoArquivo(d), "Projetos do SEI Pro"),
    adaptador: adaptadorArquivoProjetos(area, d, carimbo),
  });
}

export const copiasDosProjetos = (): ArmazemCopiasProjetos => copiasNoIndexedDB<EnvelopeArquivo>(BANCO);

/** Projetos ativos (não arquivados, sem lápide) numa cópia: é o que o diálogo mostra. */
export function projetosNaCopia(env: EnvelopeArquivo): number {
  return env.escopos.reduce((n, s) => n + s.entidades.p.filter((p) => p.removidoEm === undefined && p.arquivadoEm === undefined).length, 0);
}

/** A cópia de hoje, se ainda não há; só exporta quando vai mesmo copiar. */
export function fazerCopiaDoDia(
  area: Area,
  d: Dono,
  armazem: ArmazemCopiasProjetos,
  hoje: DataISO,
  carimbo: () => Carimbo,
): Promise<boolean> {
  return fazerCopiaComum(armazem, d, hoje, carimbo().agora, async () => {
    const envelope = await exportarTudo(area, d, carimbo);
    return { envelope, quantidade: projetosNaCopia(envelope) };
  });
}

/**
 * Restaurar não "volta no tempo": traz de volta o que estava ATIVO na cópia (projetos, fases, etapas
 * e modelos), com carimbo novo para vencer exclusões posteriores, e deixa em paz o que entrou depois.
 * O histórico mescla como está (só acrescenta).
 */
export async function restaurarCopia(area: Area, copia: CopiaProjetos, d: Dono, carimbo: () => Carimbo): Promise<number> {
  const c = carimbo();
  const env: EnvelopeArquivo = {
    ...copia.envelope,
    escopos: copia.envelope.escopos.map((s) => ({
      escopo: s.escopo,
      entidades: {
        p: recarimbarAtivos(s.entidades.p, c),
        f: recarimbarAtivos(s.entidades.f, c),
        e: recarimbarAtivos(s.entidades.e, c),
        h: s.entidades.h,
        m: recarimbarAtivos(s.entidades.m, c),
      },
    })),
  };
  const r = await importarTudo(area, env, d, () => c);
  return r.novos + r.atualizados;
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1066 ok, 0 falha(s)` (+18).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: sem saída do `tsc`; Biome sem erro.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/sincronia/arquivo.ts \
  projetos/tests/verificar-sincronia-arquivo.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: arquivo, exportar e importar e copias diarias com todos os escopos do usuario

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 7: Projetos — estado da sincronia no app, o "Entendi" da unidade e o convite do pessoal

**Files:**
- Create: `projetos/src/app/colaboracao/estado.ts`, `projetos/src/app/colaboracao/consentir.ts`, `projetos/src/app/dialogos/consentimento.ts`
- Modify: `projetos/estatico/projetos.css` (acrescenta ao fim), `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-colaboracao.ts`

**Interfaces:**
- Consumes: `ProvedorSincronia`, `EstadoSincronia`, `TomSincronia` (P3, `src/app/sincronia.ts`); `plural` (P3, `src/app/formato.ts`); `lerConsentimento`, `EstadoConsentimento`, `PortaConsentimento`, `StatusSync`; `CHAVE_CONSENTIMENTO`, `chaveDoConsentimento` (Tarefa 5); `chaveStatusTexto`, `chaveRelatorio`, `chaveSubstituido`, `nomeDoTexto`, `MENSAGEM_MUDOU`, `RelatorioImportacao`, `TextoSubstituido` (Tarefa 4); `ErroValidacao`, `RepositorioProjetos`, `moverEntreEscopos` (P2); `AbrirModal`, `h`; nas provas `telaDoApp`, `texto`, `HOSTIL`.
- Produces: `SituacaoTexto { vis; nome; consentimento; status?; relatorio?; substituido? }`, `SituacaoSincronia`; `avisoDoRelogio(r)`; `linhaDoTexto(t, agora)`; `estadoDaSincronia(s, agora): EstadoSincronia` (tons: local < ok < pendente < erro; indisponível = local; desistência = pendente; relógio atrasado = erro); `DepsEstado { area; sync; escopos; agora? }`; `class EstadoDaSincronia implements ProvedorSincronia { iniciar(); parar(); ler(); situacao(); estado(); aoMudar(cb) }`; `METODOS_QUE_GRAVAM`, `MENSAGEM_SEM_ENTENDI`, `comConsentimento(repo, consentir): RepositorioProjetos` (Proxy), `consentidor(porta, perguntar): () => Promise<boolean>` (uma pergunta só para várias gravações juntas); `avisoDaUnidade({ abrirModal; sigla; nomeTexto }): Promise<boolean>` (só "Entendi"), `pedirConsentimentoPessoal(...)`: Promise<boolean> ("Agora não" | "Ligar"), `faixaConvite({ aoLigar; aoRecusar })`, `faixaAguardando({ sigla; aoEntendi })`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-colaboracao.ts`:

```ts
/**
 * O estado da sincronia no app (ao lado das abas e na dica), os dois
 * consentimentos (aviso único da unidade, convite do pessoal) e o repositório
 * da unidade que pergunta o "Entendi" antes de gravar.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { consentimentoNaArea, definirConsentimento } from "@comum/sincronia/consentimento";
import type { StatusSync } from "@comum/sincronia/motor";
import type { AbrirModal } from "@comum/ui/dialogo";
import { comConsentimento, consentidor, MENSAGEM_SEM_ENTENDI } from "../src/app/colaboracao/consentir";
import {
  EstadoDaSincronia,
  estadoDaSincronia,
  linhaDoTexto,
  type SituacaoSincronia,
  type SituacaoTexto,
} from "../src/app/colaboracao/estado";
import { avisoDaUnidade, faixaAguardando, faixaConvite, pedirConsentimentoPessoal } from "../src/app/dialogos/consentimento";
import { moverEntreEscopos, RepositorioProjetos } from "../src/repositorio";
import { CHAVE_CONSENTIMENTO, chaveDoConsentimento } from "../src/sincronia/consentimento";
import { chaveRelatorio, chaveStatusTexto, MENSAGEM_MUDOU } from "../src/sincronia/textoPadrao";
import { telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { HOSTIL } from "./cenarioGantt";
import { botao, checar, lanca, secao, tique } from "./util";

const AGORA = Date.UTC(2026, 9, 6, 12);

function modais(doc: Document) {
  const abertos: Array<{ titulo: string; conteudo: HTMLElement; fechar(): void }> = [];
  const abrirModal: AbrirModal = (o) => {
    doc.body.append(o.conteudo);
    const m = {
      titulo: o.titulo,
      conteudo: o.conteudo,
      fechar: () => {
        o.conteudo.remove();
        o.aoFechar?.();
      },
    };
    abertos.push(m);
    return m;
  };
  return { abrirModal, abertos };
}

const st = (m: Partial<StatusSync>): StatusSync => ({ estado: "ok", quando: AGORA, ultimoOk: AGORA, pendente: false, ...m });
const texto_ = (vis: "unidade" | "eu", m: Partial<SituacaoTexto> = {}): SituacaoTexto => ({
  vis,
  nome: vis === "unidade" ? "[_SEIPRO_PRJ_UNIDADE]" : "[_SEIPRO_PRJ_ana]",
  consentimento: "nao-perguntado",
  ...m,
});
const situ = (u: Partial<SituacaoTexto> = {}, e: Partial<SituacaoTexto> = {}): SituacaoSincronia => ({
  unidade: texto_("unidade", u),
  eu: texto_("eu", e),
});

export async function verificarAppColaboracao(): Promise<void> {
  secao("app: estado da sincronia ao lado das abas");
  const e0 = estadoDaSincronia(situ(), AGORA);
  checar("nada ainda: neste navegador", e0.tom === "local" && e0.rotulo === "neste navegador", e0);
  const e1 = estadoDaSincronia(situ({ status: st({}) }), AGORA + 120_000);
  checar("unidade lida e gravada: sincronizado", e1.tom === "ok" && e1.rotulo === "sincronizado" && /há 2 min/.test(e1.dica), e1);
  checar("o pessoal desligado nao conta", /Só eu: Desligado/.test(e1.dica));
  checar("alteracoes a enviar: pendente", estadoDaSincronia(situ({ status: st({ pendente: true }) }), AGORA).tom === "pendente");
  const e3 = estadoDaSincronia(situ({ status: st({ estado: "nunca", aguardandoPermissao: true }) }), AGORA);
  checar("esperando o Entendi: pendente, com a explicacao", e3.tom === "pendente" && /Entendi/.test(e3.dica), e3);
  const e4 = estadoDaSincronia(situ({ status: st({ estado: "erro", pendente: true, mensagem: MENSAGEM_MUDOU }) }), AGORA);
  checar("desistiu porque um colega gravava junto: brando (pendente, nao erro)", e4.tom === "pendente" && /colega/.test(e4.dica), e4);
  const e5 = estadoDaSincronia(situ({ status: st({ estado: "erro", mensagem: "Sessão do SEI expirada." }) }), AGORA);
  checar("sessao expirada: erro com a mensagem", e5.tom === "erro" && /Sessão do SEI expirada/.test(e5.dica));
  const e6 = estadoDaSincronia(situ({ status: st({}), relatorio: { quando: AGORA, ignorados: 2, excedentes: 0, futuros: 2 } }), AGORA);
  checar(
    "relogio atrasado: erro, com o que fazer",
    e6.tom === "erro" && /relógio deste computador parece atrasado/.test(e6.dica) && /2 alterações/.test(e6.dica),
    e6,
  );
  const e7 = estadoDaSincronia(situ({ status: st({ estado: "indisponivel", mensagem: "Indisponível nesta unidade." }) }), AGORA);
  checar("indisponivel (sem Textos Padrao): neste navegador, com o motivo", e7.tom === "local" && /Indisponível/.test(e7.dica), e7);
  const e8 = estadoDaSincronia(situ({ status: st({}) }, { consentimento: "ligado", status: st({ estado: "erro", mensagem: "x" }) }), AGORA);
  checar("o pessoal ligado com erro pesa", e8.tom === "erro");
  checar(
    "linha do pessoal ligado sem rodada ainda",
    linhaDoTexto(texto_("eu", { consentimento: "ligado" }), AGORA) === "Ligado: falta abrir o Controle de Processos.",
  );

  secao("app: o provedor le o armazenamento e se refaz");
  const area = areaMemoria();
  const sync = areaMemoria();
  const prov = new EstadoDaSincronia({ area, sync, escopos: { unidade: ESCOPO_UN, eu: ESCOPO_EU }, agora: () => AGORA });
  let avisos = 0;
  prov.aoMudar(() => avisos++);
  await prov.iniciar();
  checar("sem nada gravado: neste navegador", prov.estado().tom === "local");
  await area.gravar({ [chaveStatusTexto(ESCOPO_UN)]: st({}) });
  await tique(10);
  checar("o status do content script muda o estado", prov.estado().tom === "ok" && avisos >= 2, { avisos, e: prov.estado() });
  await area.gravar({ [chaveRelatorio(ESCOPO_UN)]: { quando: AGORA, ignorados: 1, excedentes: 0, futuros: 1 } });
  await tique(10);
  checar("o relatorio tambem", prov.estado().tom === "erro");
  await definirConsentimento(sync, CHAVE_CONSENTIMENTO, "textoPadrao", chaveDoConsentimento(ESCOPO_EU.host, "ana", "110", "eu"), "ligado");
  await tique(10);
  checar("o consentimento (storage.sync) tambem", prov.situacao().eu.consentimento === "ligado");
  const antes = avisos;
  await area.gravar({ "projetos/outra/chave": 1 });
  await tique(10);
  checar("chave que nao e da sincronia nao relê", avisos === antes);
  prov.parar();

  secao("app: aviso unico da unidade e consentimento do pessoal");
  const doc = telaDoApp();
  const m = modais(doc);
  const r1 = avisoDaUnidade({ abrirModal: m.abrirModal, sigla: HOSTIL, nomeTexto: "[_SEIPRO_PRJ_UNIDADE]" });
  const aviso = m.abertos.at(-1)!;
  checar(
    "o aviso explica e tem so o Entendi",
    aviso.titulo === "Projetos de toda a unidade" &&
      texto(aviso.conteudo).includes("[_SEIPRO_PRJ_UNIDADE]") &&
      aviso.conteudo.querySelectorAll("button").length === 1 &&
      !aviso.conteudo.querySelector("img"),
    texto(aviso.conteudo),
  );
  botao(aviso.conteudo, "Entendi")?.click();
  checar("Entendi = sim", (await r1) === true);
  const r2 = avisoDaUnidade({ abrirModal: m.abrirModal, sigla: "SEPRO", nomeTexto: "[_SEIPRO_PRJ_UNIDADE]" });
  m.abertos.at(-1)!.fechar();
  checar("fechar pelo X = nao", (await r2) === false);
  const r3 = pedirConsentimentoPessoal({ abrirModal: m.abrirModal, sigla: "SEPRO", nomeTexto: "[_SEIPRO_PRJ_ana]" });
  checar(
    "o pessoal tem Agora nao e Ligar",
    !!botao(m.abertos.at(-1)!.conteudo, "Agora não") && !!botao(m.abertos.at(-1)!.conteudo, "Ligar"),
  );
  botao(m.abertos.at(-1)!.conteudo, "Ligar")?.click();
  checar("Ligar = sim", (await r3) === true);
  const r4 = pedirConsentimentoPessoal({ abrirModal: m.abrirModal, sigla: "SEPRO", nomeTexto: "[_SEIPRO_PRJ_ana]" });
  botao(m.abertos.at(-1)!.conteudo, "Agora não")?.click();
  checar("Agora nao = nao", (await r4) === false);
  const feitos: string[] = [];
  const conv = faixaConvite({ aoLigar: () => feitos.push("ligar"), aoRecusar: () => feitos.push("recusar") });
  botao(conv, "Ligar…")?.click();
  botao(conv, "Agora não")?.click();
  checar("faixa-convite: Ligar… e Agora nao", feitos.join() === "ligar,recusar" && /outro computador/.test(texto(conv)));
  const ag = faixaAguardando({ sigla: HOSTIL, aoEntendi: () => feitos.push("entendi") });
  botao(ag, "Entendi")?.click();
  checar("faixa de alteracoes esperando: Entendi, com a sigla como texto", feitos.at(-1) === "entendi" && !ag.querySelector("img"));

  secao("app: o repositorio da unidade pergunta o Entendi antes de gravar");
  const { repo } = novoRepo(ESCOPO_UN, areaMemoria(), "c");
  let perguntas = 0;
  let resposta = false;
  const prefs = areaMemoria();
  const porta = consentimentoNaArea({ area: prefs, chavePreferencias: CHAVE_CONSENTIMENTO, campo: "textoPadrao", chave: "k|un" });
  const pode = consentidor(porta, async () => {
    perguntas++;
    await tique(5);
    return resposta;
  });
  const un = comConsentimento(repo, pode);
  checar("continua sendo o repositorio (escopo, instanceof)", un instanceof RepositorioProjetos && un.escopo.vis === "unidade");
  await un.dados();
  checar("ler nao pergunta", perguntas === 0);
  const e = await lanca(() => un.criarProjeto({ nome: "Sem o entendi" }));
  checar(
    "sem o Entendi: nada gravado e a mensagem explica",
    String((e as { mensagens?: string[] })?.mensagens) === MENSAGEM_SEM_ENTENDI && (await repo.dados()).projetos.length === 0,
    e,
  );
  resposta = true;
  const [a, b] = await Promise.all([un.criarProjeto({ nome: "Um" }), un.criarProjeto({ nome: "Dois" })]);
  checar("duas gravacoes juntas: uma pergunta so", perguntas === 2 && !!a.id && !!b.id, perguntas);
  checar("o Entendi fica gravado", (await porta.estado()) === "ligado");
  await un.criarProjeto({ nome: "Três" });
  checar("depois, nao pergunta mais", perguntas === 2 && (await repo.dados()).projetos.length === 3);

  secao("app: sair da unidade nao fica pela metade");
  const areaM = areaMemoria();
  const { repo: crua } = novoRepo(ESCOPO_UN, areaM, "m");
  const { repo: pessoal } = novoRepo(ESCOPO_EU, areaM, "n");
  const mover = await crua.criarProjeto({ nome: "Vai para Só eu" });
  let perguntou = false;
  const unidade = comConsentimento(crua, async () => {
    perguntou = true;
    return false;
  });
  await moverEntreEscopos(unidade, pessoal, mover.id);
  checar(
    "mover para 'Só eu' sem o Entendi: a copia vai e a unidade fica com a lapide (o texto espera o Entendi)",
    !perguntou && !!(await pessoal.obterProjeto(mover.id)) && !(await crua.obterProjeto(mover.id)),
  );
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarAppColaboracao } from "./verificar-app-colaboracao";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarApp();
```

por:

```ts
await verificarApp();
await verificarAppColaboracao();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/colaboracao/consentir' imported from …/projetos/tests/verificar-app-colaboracao.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/colaboracao/estado.ts`:

```ts
/**
 * O estado da sincronia que o app mostra ao lado das abas (P3:
 * `ProvedorSincronia`) e no diálogo "Sincronização": junta o status dos dois
 * Textos Padrão (gravado pelo content script), o consentimento de cada um, o
 * relatório da última leitura (relógio atrasado) e a cópia de um texto
 * inválido que foi substituído. Lê do armazenamento e se refaz a cada mudança.
 */

import type { Area } from "@comum/armazenamento/area";
import { type EstadoConsentimento, lerConsentimento } from "@comum/sincronia/consentimento";
import type { StatusSync } from "@comum/sincronia/motor";
import type { Escopo, Vis } from "../../modelo/tipos";
import { CHAVE_CONSENTIMENTO, chaveDoConsentimento } from "../../sincronia/consentimento";
import {
  chaveRelatorio,
  chaveStatusTexto,
  chaveSubstituido,
  MENSAGEM_MUDOU,
  nomeDoTexto,
  type RelatorioImportacao,
  type TextoSubstituido,
} from "../../sincronia/textoPadrao";
import { plural } from "../formato";
import type { EstadoSincronia, ProvedorSincronia, TomSincronia } from "../sincronia";

export interface SituacaoTexto {
  vis: Vis;
  nome: string;
  consentimento: EstadoConsentimento;
  status?: StatusSync;
  relatorio?: RelatorioImportacao;
  substituido?: TextoSubstituido;
}

export type SituacaoSincronia = Record<Vis, SituacaoTexto>;

function haQuanto(ms: number, agora: number): string {
  const min = Math.max(0, Math.round((agora - ms) / 60_000));
  if (min < 1) return "agora há pouco";
  if (min < 60) return `há ${min} min`;
  if (min < 1440) return `há ${Math.round(min / 60)} h`;
  return `há ${Math.round(min / 1440)} dia(s)`;
}

/** O relógio daqui atrasado recusa o que os colegas gravaram (carimbo mais de 1 dia "no futuro"). */
export function avisoDoRelogio(r: RelatorioImportacao | undefined): string | null {
  if (!r?.futuros) return null;
  return `O relógio deste computador parece atrasado: ${plural(r.futuros, "alteração dos colegas ficou", "alterações dos colegas ficaram")} de fora. Acerte a data e a hora do computador.`;
}

/** A linha de situação de um texto ("Sincronizado há 2 min", "Erro: …"), para a dica e o diálogo. */
export function linhaDoTexto(t: SituacaoTexto, agora: number): string {
  const st = t.status;
  const relogio = avisoDoRelogio(t.relatorio);
  const com = (s: string) => (relogio ? `${s} ${relogio}` : s);
  if (t.vis === "eu" && t.consentimento !== "ligado") return "Desligado: os projetos de “Só eu” ficam neste navegador.";
  if (st?.aguardandoPermissao) return "Há alterações esperando o seu “Entendi” para ir ao SEI.";
  if (!st || st.estado === "nunca")
    return t.vis === "unidade" ? "Ainda não lido nesta unidade." : "Ligado: falta abrir o Controle de Processos.";
  if (st.estado === "indisponivel") return com(st.mensagem ?? "Indisponível nesta unidade.");
  if (st.estado === "erro") {
    if (st.mensagem === MENSAGEM_MUDOU) return com("Um colega gravou ao mesmo tempo; nova tentativa em instantes.");
    return com(`Erro: ${st.mensagem ?? "tente de novo"}`);
  }
  const quando = haQuanto(st.ultimoOk ?? st.quando, agora);
  return com(`Sincronizado ${quando}${st.pendente ? " · alterações a enviar" : ""}${st.mensagem ? ` · ${st.mensagem}` : ""}`);
}

const PESO: Record<TomSincronia, number> = { local: 0, ok: 1, pendente: 2, erro: 3 };

function tomDoTexto(t: SituacaoTexto): TomSincronia {
  const st = t.status;
  if (t.vis === "eu" && t.consentimento !== "ligado") return "local";
  if (avisoDoRelogio(t.relatorio)) return "erro";
  if (st?.aguardandoPermissao) return "pendente";
  if (!st || st.estado === "nunca" || st.estado === "indisponivel") return "local";
  // Desistir porque um colega gravava ao mesmo tempo não é erro: a nova tentativa já está armada.
  if (st.estado === "erro") return st.mensagem === MENSAGEM_MUDOU ? "pendente" : "erro";
  return st.pendente ? "pendente" : "ok";
}

const ROTULO: Record<TomSincronia, string> = { local: "neste navegador", ok: "sincronizado", pendente: "pendente", erro: "erro" };

export function estadoDaSincronia(s: SituacaoSincronia, agora: number): EstadoSincronia {
  const tons = [tomDoTexto(s.unidade), tomDoTexto(s.eu)];
  const tom = tons.reduce((a, b) => (PESO[b] > PESO[a] ? b : a), "local" as TomSincronia);
  const dica =
    tom === "local"
      ? `Os projetos ficam guardados neste navegador. Toda a unidade: ${linhaDoTexto(s.unidade, agora)}`
      : `Toda a unidade: ${linhaDoTexto(s.unidade, agora)}\nSó eu: ${linhaDoTexto(s.eu, agora)}`;
  return { rotulo: ROTULO[tom], dica, tom };
}

export interface DepsEstado {
  /** chrome.storage.local: status, relatório, texto substituído. */
  area: Area;
  /** chrome.storage.sync: consentimentos. */
  sync: Area;
  escopos: Readonly<Record<Vis, Escopo>>;
  agora?: () => number;
}

/** O provedor do app: lê tudo uma vez, guarda, e relê quando uma das chaves muda. */
export class EstadoDaSincronia implements ProvedorSincronia {
  private atual: SituacaoSincronia;
  private readonly ouvintes = new Set<() => void>();
  private paradas: Array<() => void> = [];

  constructor(private readonly d: DepsEstado) {
    const vazio = (vis: Vis): SituacaoTexto => ({ vis, nome: nomeDoTexto(vis, d.escopos[vis].login), consentimento: "nao-perguntado" });
    this.atual = { unidade: vazio("unidade"), eu: vazio("eu") };
  }

  private chaves(vis: Vis): string[] {
    const e = this.d.escopos[vis];
    return [chaveStatusTexto(e), chaveRelatorio(e), chaveSubstituido(e)];
  }

  async iniciar(): Promise<void> {
    await this.ler();
    const locais = new Set([...this.chaves("unidade"), ...this.chaves("eu")]);
    this.paradas.push(
      this.d.area.aoMudar((m) => {
        if (Object.keys(m).some((k) => locais.has(k))) void this.ler();
      }),
      this.d.sync.aoMudar((m) => {
        if (CHAVE_CONSENTIMENTO in m) void this.ler();
      }),
    );
  }

  parar(): void {
    for (const p of this.paradas.splice(0)) p();
    this.ouvintes.clear();
  }

  /** Relê tudo (o diálogo chama depois de "Sincronizar agora"). */
  async ler(): Promise<SituacaoSincronia> {
    const de = async (vis: Vis): Promise<SituacaoTexto> => {
      const e = this.d.escopos[vis];
      const [kStatus, kRel, kSub] = this.chaves(vis) as [string, string, string];
      const v = await this.d.area.obter([kStatus, kRel, kSub]);
      return {
        vis,
        nome: nomeDoTexto(vis, e.login),
        consentimento: await lerConsentimento(
          this.d.sync,
          CHAVE_CONSENTIMENTO,
          "textoPadrao",
          chaveDoConsentimento(e.host, e.login, e.unidade, vis),
        ),
        status: v[kStatus] as StatusSync | undefined,
        relatorio: v[kRel] as RelatorioImportacao | undefined,
        substituido: v[kSub] as TextoSubstituido | undefined,
      };
    };
    this.atual = { unidade: await de("unidade"), eu: await de("eu") };
    for (const o of [...this.ouvintes]) o();
    return this.atual;
  }

  situacao(): SituacaoSincronia {
    return this.atual;
  }

  estado(): EstadoSincronia {
    return estadoDaSincronia(this.atual, this.d.agora?.() ?? Date.now());
  }

  aoMudar(cb: () => void): () => void {
    this.ouvintes.add(cb);
    return () => {
      this.ouvintes.delete(cb);
    };
  }
}
```

Arquivo completo `projetos/src/app/colaboracao/consentir.ts`:

```ts
/**
 * A pergunta do "Entendi" antes de qualquer gravação em "Toda a unidade" feita
 * pelo app: o repositório da unidade que o app recebe é este, que pergunta
 * (uma vez; depois do "Entendi" passa direto) antes de cada método que grava.
 * Sem o "Entendi", nada muda e o erro diz por quê (o diálogo e o balão já
 * mostram as mensagens do repositório). Ler nunca pergunta.
 */

import type { PortaConsentimento } from "@comum/sincronia/consentimento";
import { ErroValidacao } from "../../modelo/validacao";
import type { RepositorioProjetos } from "../../repositorio";

/**
 * Os métodos do repositório que gravam (ler, listar e exportar passam direto). Ficam de fora
 * `lapidarMovidos` (o fim de "mover para Só eu": a cópia já está no "Só eu", e parar no meio deixaria o
 * projeto nos dois lugares; a saída da unidade espera o "Entendi" na sincronia, com a faixa) e
 * `limpar` (só apaga lápides velhas deste navegador, nada que vá ao SEI).
 */
export const METODOS_QUE_GRAVAM: ReadonlySet<string> = new Set([
  "criarProjeto",
  "editarProjeto",
  "arquivarProjeto",
  "reativarProjeto",
  "removerProjeto",
  "restaurarProjeto",
  "duplicarProjeto",
  "criarFase",
  "renomearFase",
  "removerFase",
  "criarEtapa",
  "editarEtapa",
  "moverDatas",
  "concluirEtapa",
  "reabrirEtapa",
  "removerEtapa",
  "restaurarEtapa",
  "redefinirPlanoOriginal",
  "criarProjetoDeModelo",
  "salvarComoModelo",
  "renomearModelo",
  "removerModelo",
  "importar",
  "anotarVisibilidade",
]);

export const MENSAGEM_SEM_ENTENDI = "Sem o “Entendi”, os projetos de “Toda a unidade” não mudam. Para um projeto só seu, escolha “Só eu”.";

/** O mesmo repositório, perguntando antes de gravar. `consentir` resolve true quando pode gravar. */
export function comConsentimento(repo: RepositorioProjetos, consentir: () => Promise<boolean>): RepositorioProjetos {
  return new Proxy(repo, {
    get(alvo, nome, receptor) {
      const v = Reflect.get(alvo, nome, receptor) as unknown;
      if (typeof v !== "function") return v;
      const metodo = (v as (...a: unknown[]) => unknown).bind(alvo);
      if (typeof nome !== "string" || !METODOS_QUE_GRAVAM.has(nome)) return metodo;
      return async (...args: unknown[]) => {
        if (!(await consentir())) throw new ErroValidacao([MENSAGEM_SEM_ENTENDI]);
        return metodo(...args);
      };
    },
  });
}

/**
 * O "pode gravar em Toda a unidade?" do app: com o consentimento já "ligado", sim sem perguntar;
 * senão pergunta (uma pergunta só, mesmo com várias gravações esperando juntas, como o arraste de
 * várias barras) e grava o "ligado" no "Entendi".
 */
export function consentidor(porta: PortaConsentimento, perguntar: () => Promise<boolean>): () => Promise<boolean> {
  let pergunta: Promise<boolean> | null = null;
  return async () => {
    if ((await porta.estado()) === "ligado") return true;
    pergunta ??= (async () => {
      try {
        const sim = await perguntar();
        if (sim) await porta.definir("ligado");
        return sim;
      } finally {
        pergunta = null;
      }
    })();
    return pergunta;
  };
}
```

Arquivo completo `projetos/src/app/dialogos/consentimento.ts`:

```ts
/**
 * Os dois consentimentos do Texto Padrão (spec 6.1), no desenho dos Favoritos:
 * - "Toda a unidade": aviso ÚNICO, só "Entendi" (vale como consentimento), na
 *   primeira gravação em "Toda a unidade" (criar, editar, mover, receber,
 *   importar) ou quando há alterações esperando por ele (faixa);
 * - "Só eu": faixa-convite ("Ligar…" | "Agora não") e o diálogo com os pontos.
 * Fechar pelo X ou Esc é "não": nada é gravado no SEI.
 */

import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";

const botao = (rotulo: string, classe: string, fazer: () => void) => h("button", { type: "button", class: classe, onclick: fazer }, rotulo);

/** "Entendi" = true; X ou Esc = false. */
export function avisoDaUnidade(c: { abrirModal: AbrirModal; sigla: string; nomeTexto: string }): Promise<boolean> {
  return new Promise((ok) => {
    let resposta = false;
    let modal: { fechar(): void } | null = null;
    const conteudo = h(
      "div",
      { class: "prj-consentimento" },
      h(
        "p",
        {},
        `Os projetos de “Toda a unidade” ficam guardados no próprio SEI, num Texto Padrão da ${c.sigla} chamado “${c.nomeTexto}”. Todos da unidade que usam o SEI Pro veem e editam esses projetos.`,
      ),
      h(
        "ul",
        {},
        h("li", {}, `Qualquer pessoa da ${c.sigla} pode abrir esse texto na lista de Textos Padrão.`),
        h("li", {}, "Não use esse texto em documentos e não o edite: o SEI Pro o regrava sozinho."),
        h("li", {}, "O número de processo sigiloso nunca vai para o SEI: fica só neste navegador."),
        h("li", {}, "Para um projeto só seu, escolha “Só eu”."),
      ),
      h(
        "div",
        { class: "spro-dialogo-rodape" },
        botao("Entendi", "spro-botao primario", () => {
          resposta = true;
          modal?.fechar();
        }),
      ),
    );
    modal = c.abrirModal({ titulo: "Projetos de toda a unidade", icone: "predio", conteudo, aoFechar: () => ok(resposta) });
  });
}

/** "Ligar" = true; "Agora não", X ou Esc = false. */
export function pedirConsentimentoPessoal(c: { abrirModal: AbrirModal; sigla: string; nomeTexto: string }): Promise<boolean> {
  return new Promise((ok) => {
    let resposta = false;
    let modal: { fechar(): void } | null = null;
    const conteudo = h(
      "div",
      { class: "prj-consentimento" },
      h(
        "p",
        {},
        `Seus projetos de “Só eu” ficam guardados no próprio SEI, num Texto Padrão chamado “${c.nomeTexto}”, e aparecem em qualquer computador em que você usar o SEI Pro. Antes de ligar:`,
      ),
      h(
        "ul",
        {},
        h("li", {}, `O texto fica visível na lista de Textos Padrão da ${c.sigla}: qualquer pessoa da unidade pode abri-lo.`),
        h("li", {}, "Não use esse texto em documentos e não o edite: o SEI Pro o regrava sozinho."),
        h("li", {}, "O número de processo sigiloso nunca vai para o SEI."),
        h("li", {}, "Para desligar, use “Sincronização…” no menu. Lá você também pode apagar o texto do SEI na hora."),
      ),
      h(
        "div",
        { class: "spro-dialogo-rodape" },
        botao("Agora não", "spro-botao", () => modal?.fechar()),
        botao("Ligar", "spro-botao primario", () => {
          resposta = true;
          modal?.fechar();
        }),
      ),
    );
    modal = c.abrirModal({ titulo: "Guardar no SEI", icone: "nuvem", conteudo, aoFechar: () => ok(resposta) });
  });
}

/** Faixa-convite do texto pessoal (só aparece com projeto "Só eu" e sem resposta ainda). */
export function faixaConvite(c: { aoLigar(): void; aoRecusar(): void }): HTMLElement {
  return h(
    "div",
    { class: "prj-faixa", role: "note", "data-faixa": "convite" },
    h("span", {}, "Guarde seus projetos pessoais no SEI para vê-los em outro computador."),
    botao("Ligar…", "spro-botao primario pequeno", c.aoLigar),
    botao("Agora não", "spro-botao pequeno", c.aoRecusar),
  );
}

/** Há alterações em "Toda a unidade" esperando o "Entendi" (vieram de um caminho sem a pergunta). */
export function faixaAguardando(c: { sigla: string; aoEntendi(): void }): HTMLElement {
  return h(
    "div",
    { class: "prj-faixa", role: "note", "data-faixa": "aguardando" },
    h(
      "span",
      {},
      `Os projetos de “Toda a unidade” ficam num Texto Padrão que toda a ${c.sigla} vê. Suas alterações ainda não foram gravadas no SEI.`,
    ),
    botao("Entendi", "spro-botao primario pequeno", c.aoEntendi),
  );
}
```

Acrescente ao fim de `projetos/estatico/projetos.css`:

```css
/* ---------- P4: faixas e consentimentos do Texto Padrao ---------- */
.prj-faixas {
  display: grid;
  gap: 8px;
  margin-bottom: 8px;
}
.prj-faixas:empty {
  display: none;
}
.prj-faixa {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
  padding: 10px 12px;
  font-size: 12.5px;
  background: var(--spro-destaque-suave);
  border: 1px solid color-mix(in srgb, var(--spro-destaque) 22%, transparent);
  border-radius: var(--spro-raio-g);
}
.prj-faixa > span {
  flex: 1 1 260px;
}
.prj-consentimento {
  display: grid;
  gap: 10px;
  max-width: 520px;
}
.prj-consentimento p,
.prj-consentimento ul {
  margin: 0;
}
.prj-consentimento ul {
  display: grid;
  gap: 4px;
  padding-left: 18px;
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1097 ok, 0 falha(s)` (+31). A prova estática do P3 ("toda classe prj-* do app tem regra no CSS") continua verde com as regras novas.

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests && LC_ALL=C grep -c $'[\x80-\xff]' estatico/projetos.css
```
Expected: sem saída do `tsc`; Biome sem erro; `0` (CSS só ASCII).

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/colaboracao/estado.ts \
  projetos/src/app/colaboracao/consentir.ts \
  projetos/src/app/dialogos/consentimento.ts \
  projetos/estatico/projetos.css \
  projetos/tests/verificar-app-colaboracao.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: estado da sincronia, o Entendi antes de gravar na unidade e o convite do texto pessoal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 8: Projetos — diálogo Sincronização (os dois textos, o arquivo e as cópias)

**Files:**
- Create: `projetos/src/app/dialogos/sincronizacao.ts`
- Modify: `projetos/estatico/projetos.css` (acrescenta ao fim), `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-sincronizacao.ts`

**Interfaces:**
- Consumes: `linhaDoTexto`, `SituacaoSincronia`, `SituacaoTexto` (Tarefa 7); `CopiaProjetos` (Tarefa 6); `TextoSubstituido` (Tarefa 4); `StatusArquivo` (sei-comum); `formatarData`, `hojeISO`, `h`, `plural`.
- Produces: `DepsSincronizacao { sigla; agora(); situacao(); sincronizar(); pessoal: { ligar(): Promise<boolean>; desligar(); apagar() }; arquivo: {...} | null; exportar(); importar(); copias: { listar(); restaurar(c) } | null; baixar(nome, conteudo, tipo); confirmar(texto, rotuloOk?) }`; `montarSincronizacao(d): Promise<HTMLElement>` com as seções `[data-secao="unidade" | "eu" | "arquivo" | "copias"]`, as linhas `[data-texto="unidade" | "eu"]`, "Sincronizar agora" só na seção da unidade (vale para os dois textos), nada de "apagar" na unidade, e "Baixar o texto antigo" quando um texto inválido foi substituído.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-sincronizacao.ts`:

```ts
/** O diálogo "Sincronização": as quatro seções, os botões de cada estado e o texto antigo guardado. */

import type { StatusArquivo } from "@comum/sincronia/arquivo";
import type { SituacaoSincronia } from "../src/app/colaboracao/estado";
import { type DepsSincronizacao, montarSincronizacao } from "../src/app/dialogos/sincronizacao";
import type { CopiaProjetos } from "../src/sincronia/arquivo";
import { telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { botao, checar, secao, tique } from "./util";

const AGORA = Date.UTC(2026, 9, 6, 12);

function deps(m: Partial<DepsSincronizacao> = {}, situ?: Partial<SituacaoSincronia>) {
  const feitos: string[] = [];
  const baixados: Array<{ nome: string; conteudo: string }> = [];
  let situacao: SituacaoSincronia = {
    unidade: {
      vis: "unidade",
      nome: "[_SEIPRO_PRJ_UNIDADE]",
      consentimento: "ligado",
      status: { estado: "ok", quando: AGORA, ultimoOk: AGORA, pendente: false },
    },
    eu: { vis: "eu", nome: "[_SEIPRO_PRJ_ana]", consentimento: "nao-perguntado" },
    ...situ,
  };
  const d: DepsSincronizacao = {
    sigla: "SEPRO",
    agora: () => AGORA + 60_000 * 3,
    situacao: async () => situacao,
    sincronizar: async () => void feitos.push("sincronizar"),
    pessoal: {
      ligar: async () => {
        feitos.push("ligar");
        situacao = { ...situacao, eu: { ...situacao.eu, consentimento: "ligado" } };
        return true;
      },
      desligar: async () => {
        feitos.push("desligar");
        situacao = { ...situacao, eu: { ...situacao.eu, consentimento: "desligado" } };
      },
      apagar: async () => void feitos.push("apagar"),
    },
    arquivo: null,
    exportar: async () => void feitos.push("exportar"),
    importar: async () => void feitos.push("importar"),
    copias: null,
    baixar: (nome, conteudo) => baixados.push({ nome, conteudo }),
    confirmar: async () => true,
    ...m,
  };
  return { d, feitos, baixados };
}

export async function verificarAppSincronizacao(): Promise<void> {
  secao("app: dialogo Sincronizacao");
  telaDoApp();
  const a = deps({ sigla: HOSTIL });
  const el = await montarSincronizacao(a.d);
  const secoes = [...el.querySelectorAll("section")].map((s) => s.getAttribute("data-secao"));
  checar("as secoes da spec (sem copias quando nao ha banco)", secoes.join() === "unidade,eu,arquivo", secoes);
  checar("a sigla aparece como texto", texto(el.querySelector("h3")).includes(HOSTIL) && !el.querySelector("img"));
  checar("a linha de situacao da unidade", /Sincronizado há 3 min/.test(texto(el.querySelector("[data-texto='unidade']"))));
  checar(
    "o pessoal desligado explica e oferece Ligar…",
    /Desligado/.test(texto(el.querySelector("[data-texto='eu']"))) && !!botao(el, "Ligar…"),
  );
  checar("o texto da unidade nao tem apagar (e de todos)", !texto(el.querySelector("[data-secao='unidade']")).includes("Apagar"));
  botao(el, "Sincronizar agora")?.click();
  await tique();
  botao(el, "Ligar…")?.click();
  await tique();
  checar("ligar repinta com Desligar e Desligar e apagar", !!botao(el, "Desligar") && !!botao(el, "Desligar e apagar do SEI"));
  botao(el, "Desligar e apagar do SEI")?.click();
  await tique();
  checar("acoes chegam a quem faz", a.feitos.join() === "sincronizar,ligar,apagar", a.feitos);
  botao(el, "Exportar tudo")?.click();
  botao(el, "Importar de um arquivo…")?.click();
  await tique();
  checar(
    "sem arquivo ligado: exportar e importar a mao",
    a.feitos.slice(-2).join() === "exportar,importar" && /não dá para manter/.test(texto(el)),
  );

  secao("app: Sincronizacao com o texto antigo, arquivo e copias");
  const status: StatusArquivo = { estado: "ok", quando: AGORA, nome: "projetos.json" };
  const copias: CopiaProjetos[] = [
    {
      id: "x|2026-10-06",
      dono: "x",
      dia: "2026-10-06",
      quando: AGORA,
      quantidade: 3,
      envelope: { formato: "seipro-projetos", versao: 1, tipo: "copia", gerado: 1, escopos: [] },
    },
  ];
  const restaurados: string[] = [];
  const b = deps(
    {
      arquivo: {
        status: async () => status,
        configurado: async () => true,
        escolher: async () => undefined,
        reconectar: async () => undefined,
        agora: async () => undefined,
        esquecer: async () => undefined,
      },
      copias: { listar: async () => copias, restaurar: async (c) => void restaurados.push(c.dia) },
    },
    {
      eu: {
        vis: "eu",
        nome: "[_SEIPRO_PRJ_ana]",
        consentimento: "ligado",
        status: { estado: "ok", quando: AGORA, pendente: false },
        substituido: { quando: AGORA, motivo: "o texto foi editado", html: "<p>antigo</p>", cortado: false },
      },
    },
  );
  const el2 = await montarSincronizacao(b.d);
  checar("com banco: a secao das copias", [...el2.querySelectorAll("section")].length === 4);
  checar(
    "arquivo ligado: o nome e a ultima sincronia",
    /Ligado a “projetos.json”/.test(texto(el2.querySelector("[data-secao='arquivo']"))),
  );
  checar("com o arquivo ligado, sem o exportar e importar a mao (um botao a menos)", !botao(el2, "Exportar tudo"));
  const aviso = el2.querySelector(".prj-sync-substituido");
  checar("o texto pessoal que estava invalido: avisa e oferece baixar o antigo", /estava inválido/.test(texto(aviso)));
  botao(el2, "Baixar o texto antigo")?.click();
  checar(
    "baixa o html guardado",
    b.baixados[0]?.conteudo === "<p>antigo</p>" && /projetos-texto-antigo-2026-10-06\.html/.test(b.baixados[0]?.nome ?? ""),
    b.baixados,
  );
  checar("a copia mostra o dia e os projetos", /06\/10\/2026 — 3 projetos/.test(texto(el2.querySelector(".prj-copias"))));
  botao(el2.querySelector(".prj-copias")!, "Restaurar")?.click();
  await tique();
  checar("restaurar (com confirmacao)", restaurados.join() === "2026-10-06");
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarAppSincronizacao } from "./verificar-app-sincronizacao";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarAppColaboracao();
```

por:

```ts
await verificarAppColaboracao();
await verificarAppSincronizacao();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dialogos/sincronizacao' imported from …/projetos/tests/verificar-app-sincronizacao.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/dialogos/sincronizacao.ts`:

```ts
/**
 * Diálogo "Sincronização" (spec 3.2, desenho do diálogo dos Favoritos): as
 * formas de não perder os projetos numa tela só — o Texto Padrão da unidade,
 * o Texto Padrão pessoal, o arquivo numa pasta da nuvem (com Exportar e
 * Importar, o caminho de quem não tem o arquivo ligado) e as cópias diárias
 * deste navegador. Poucos botões: "Sincronizar agora" (os dois textos) fica
 * no da unidade; o pessoal só liga, desliga e apaga.
 */

import { formatarData, hojeISO } from "@comum/datas/dias";
import type { StatusArquivo } from "@comum/sincronia/arquivo";
import { h } from "@comum/ui/dom";
import type { CopiaProjetos } from "../../sincronia/arquivo";
import type { TextoSubstituido } from "../../sincronia/textoPadrao";
import { linhaDoTexto, type SituacaoSincronia, type SituacaoTexto } from "../colaboracao/estado";
import { plural } from "../formato";

export interface DepsSincronizacao {
  sigla: string;
  agora(): number;
  /** Relê a situação dos dois textos (o content script grava o status). */
  situacao(): Promise<SituacaoSincronia>;
  /** "Sincronizar agora": os dois textos (o pessoal só se ligado), pela aba do SEI. */
  sincronizar(): Promise<void>;
  pessoal: {
    ligar(): Promise<boolean>;
    desligar(): Promise<void>;
    apagar(): Promise<void>;
  };
  arquivo: {
    status(): Promise<StatusArquivo | null>;
    configurado(): Promise<boolean>;
    escolher(modo: "novo" | "existente"): Promise<void>;
    reconectar(): Promise<void>;
    agora(): Promise<void>;
    esquecer(): Promise<void>;
  } | null;
  exportar(): Promise<void>;
  importar(): Promise<void>;
  copias: { listar(): Promise<CopiaProjetos[]>; restaurar(c: CopiaProjetos): Promise<void> } | null;
  baixar(nome: string, conteudo: string, tipo: string): void;
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
}

const botao = (rotulo: string, fazer: () => unknown, classe = "spro-botao") =>
  h("button", { type: "button", class: classe, onclick: () => void fazer() }, rotulo);

const dica = (t: string) => h("p", { class: "prj-dica" }, t);

function substituido(s: TextoSubstituido | undefined, baixar: DepsSincronizacao["baixar"]): HTMLElement | null {
  if (!s) return null;
  const dia = hojeISO(new Date(s.quando));
  return h(
    "p",
    { class: "prj-dica prj-sync-substituido" },
    `Em ${formatarData(dia)} o texto no SEI estava inválido (${s.motivo}) e foi regravado. `,
    h(
      "button",
      {
        type: "button",
        class: "spro-botao fantasma pequeno",
        onclick: () => baixar(`projetos-texto-antigo-${dia}.html`, s.html, "text/html;charset=utf-8"),
      },
      "Baixar o texto antigo",
    ),
  );
}

export async function montarSincronizacao(d: DepsSincronizacao): Promise<HTMLElement> {
  const linhaUn = h("p", { class: "prj-dica prj-sync-situacao", "data-texto": "unidade" });
  const linhaEu = h("p", { class: "prj-dica prj-sync-situacao", "data-texto": "eu" });
  const extrasUn = h("div", {});
  const extrasEu = h("div", {});
  const acoesEu = h("div", { class: "linha" });
  let situ: SituacaoSincronia;

  const pintarTexto = (t: SituacaoTexto, linha: HTMLElement, extras: HTMLElement) => {
    linha.textContent = linhaDoTexto(t, d.agora());
    extras.replaceChildren(...[substituido(t.substituido, d.baixar)].filter((x): x is HTMLElement => !!x));
  };
  const pintar = async () => {
    situ = await d.situacao();
    pintarTexto(situ.unidade, linhaUn, extrasUn);
    pintarTexto(situ.eu, linhaEu, extrasEu);
    const ligado = situ.eu.consentimento === "ligado";
    acoesEu.replaceChildren(
      ...(ligado
        ? [
            botao("Desligar", async () => {
              await d.pessoal.desligar();
              await pintar();
            }),
            botao(
              "Desligar e apagar do SEI",
              async () => {
                if (
                  await d.confirmar(`Apagar do SEI o texto “${situ.eu.nome}” e desligar? Os projetos continuam neste navegador.`, "Apagar")
                )
                  await d.pessoal.apagar();
                await pintar();
              },
              "spro-botao perigo",
            ),
          ]
        : [
            botao(
              "Ligar…",
              async () => {
                if (await d.pessoal.ligar()) await pintar();
              },
              "spro-botao primario",
            ),
            // Desligado não quer dizer apagado: um texto que ficou no SEI ainda pode ser excluído daqui.
            botao(
              "Apagar o texto do SEI",
              async () => {
                if (
                  await d.confirmar(
                    `Apagar do SEI o texto “${situ.eu.nome}”, se ele existir? Os projetos continuam neste navegador.`,
                    "Apagar",
                  )
                )
                  await d.pessoal.apagar();
                await pintar();
              },
              "spro-botao perigo",
            ),
          ]),
    );
  };
  await pintar();

  const secoes: HTMLElement[] = [
    h(
      "section",
      { class: "prj-sync-secao", "data-secao": "unidade" },
      h("h3", {}, `Texto Padrão da ${d.sigla}`),
      dica(
        `Os projetos de “Toda a unidade” ficam no texto “${situ!.unidade.nome}”, que todos da ${d.sigla} com SEI Pro leem e gravam. O número de processo sigiloso não vai.`,
      ),
      linhaUn,
      extrasUn,
      h(
        "div",
        { class: "linha" },
        botao("Sincronizar agora", async () => {
          await d.sincronizar();
          await pintar();
        }),
      ),
    ),
    h(
      "section",
      { class: "prj-sync-secao", "data-secao": "eu" },
      h("h3", {}, "Texto Padrão pessoal"),
      dica(`Seus projetos de “Só eu” podem ficar no texto “${situ!.eu.nome}”, para você vê-los em outro computador.`),
      linhaEu,
      extrasEu,
      acoesEu,
    ),
  ];

  const arq = h("section", { class: "prj-sync-secao", "data-secao": "arquivo" }, h("h3", {}, "Arquivo numa pasta da nuvem"));
  // Exportar e importar à mão: só quando não há arquivo ligado (com ele, seria um botão a mais para a mesma coisa).
  const manual = () =>
    h(
      "div",
      { class: "linha" },
      botao("Exportar tudo", () => d.exportar()),
      botao("Importar de um arquivo…", () => d.importar()),
    );
  if (d.arquivo) {
    const a = d.arquivo;
    const corpo = h("div", {});
    const pintarArquivo = async () => {
      const [st, ok] = await Promise.all([a.status(), a.configurado()]);
      const linha = !ok
        ? "Escolha um arquivo numa pasta que já sincroniza com a nuvem (OneDrive, Google Drive, Dropbox ou rede). Ele leva todos os seus projetos, de todas as unidades."
        : st?.estado === "ok"
          ? `Ligado a “${st.nome ?? "arquivo"}”. Última sincronia: ${new Date(st.quando).toLocaleString("pt-BR")}.${st.mensagem ? ` ${st.mensagem}` : ""}`
          : st?.estado === "permissao"
            ? `O navegador pede de novo a permissão de “${st.nome ?? "arquivo"}”.`
            : `Erro no arquivo: ${st?.mensagem ?? "tente de novo"}`;
      const acao = (f: () => Promise<void>) => async () => {
        await f();
        await pintarArquivo();
      };
      corpo.replaceChildren(
        dica(linha),
        h(
          "div",
          { class: "linha" },
          ...(ok
            ? [
                st?.estado === "permissao"
                  ? botao("Reconectar arquivo", acao(a.reconectar), "spro-botao primario")
                  : botao("Sincronizar agora", acao(a.agora)),
                botao(
                  "Trocar arquivo…",
                  acao(() => a.escolher("existente")),
                ),
                botao("Parar de usar o arquivo", acao(a.esquecer)),
              ]
            : [
                botao(
                  "Criar arquivo…",
                  acao(() => a.escolher("novo")),
                  "spro-botao primario",
                ),
                botao(
                  "Usar um arquivo existente…",
                  acao(() => a.escolher("existente")),
                ),
              ]),
        ),
        ...(ok ? [] : [dica("Ou exporte e importe à mão (importar sempre junta, nunca apaga):"), manual()]),
      );
    };
    await pintarArquivo();
    arq.append(corpo);
  } else {
    arq.append(
      dica(
        "Aqui não dá para manter um arquivo ligado (o navegador não permite). Exporte e importe à mão; importar sempre junta, nunca apaga.",
      ),
      manual(),
    );
  }
  secoes.push(arq);

  if (d.copias) {
    const c = d.copias;
    const lista = await c.listar();
    secoes.push(
      h(
        "section",
        { class: "prj-sync-secao", "data-secao": "copias" },
        h("h3", {}, "Cópias deste navegador"),
        dica("Uma por dia, as 14 mais recentes. Restaurar traz de volta o que estava na cópia e mantém o que entrou depois."),
        lista.length
          ? h(
              "ul",
              { class: "prj-copias" },
              ...lista.map((x) =>
                h(
                  "li",
                  {},
                  h("span", {}, `${formatarData(x.dia)} — ${plural(x.quantidade, "projeto", "projetos")}`),
                  botao("Restaurar", async () => {
                    if (await d.confirmar(`Restaurar a cópia de ${formatarData(x.dia)}?`, "Restaurar")) await c.restaurar(x);
                  }),
                ),
              ),
            )
          : dica("Ainda não há cópias."),
      ),
    );
  }

  return h("div", { class: "prj-form prj-sync" }, ...secoes);
}
```

Acrescente ao fim de `projetos/estatico/projetos.css`:

```css
/* ---------- P4: dialogo Sincronizacao ---------- */
.prj-sync {
  min-width: min(520px, 86vw);
}
.prj-sync-secao {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
}
.prj-sync-secao h3 {
  margin: 0;
  font-size: 13.5px;
}
.prj-sync-secao p {
  margin: 0;
}
.prj-sync-secao .linha {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.prj-sync-situacao {
  color: var(--spro-texto);
}
.prj-sync-substituido {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}
.prj-copias {
  display: grid;
  gap: 2px;
  max-height: 220px;
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}
.prj-copias li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 6px 5px 8px;
  border-radius: var(--spro-raio);
}
.prj-copias li:hover {
  background: var(--spro-fundo-2);
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1112 ok, 0 falha(s)` (+15).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests && LC_ALL=C grep -c $'[\x80-\xff]' estatico/projetos.css
```
Expected: sem saída do `tsc`; Biome sem erro; `0`.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/dialogos/sincronizacao.ts \
  projetos/estatico/projetos.css \
  projetos/tests/verificar-app-sincronizacao.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: dialogo Sincronizacao com os dois textos, o arquivo e as copias

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 9: Projetos — diálogos Modelos de projeto e Histórico de alterações

**Files:**
- Create: `projetos/src/app/dialogos/modelos.ts`, `projetos/src/app/dialogos/historico.ts`
- Modify: `projetos/estatico/projetos.css` (acrescenta ao fim), `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-modelos-historico.ts`

**Interfaces:**
- Consumes (P3): `ModeloNaTela`, `caixaDeErros`, `mensagensDoErro`, `plural`, `textoDoRegistro`, `criarCombo`; (P2) `ehEmbutido`, `rotuloDaVis`, `LIMITES`, `Registro`, `Vis`, `MODELOS_EMBUTIDOS`; nas provas `digitar`, `escolherCombo`.
- Produces: `ContextoModelos { abrirModal; modelos; confirmar; renomear(m, nome); excluir(m); criarProjeto(m) }`, `abrirModelos(c): { fechar }` (embutido: só "Criar projeto"; salvo: "Criar projeto", "Renomear" na própria linha, "Excluir" com confirmação; "Criar projeto" fecha este diálogo antes de pedir o novo); `RegistroNaTela extends Registro { vis }`, `NomesDoHistorico { alvo(id) → { tipo; nome } | undefined }`, `ContextoHistorico { abrirModal; projetos; registros(); nomes; projeto? }`, `linhaDoRegistro(r, nomes) → { quem; onde; oque }` (campo desconhecido pelo nome, cortado em 60), `abrirHistorico(c): Promise<{ fechar }>` (grupos por dia, do mais recente; filtro "Projeto").

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-modelos-historico.ts`:

```ts
/** Os diálogos "Modelos de projeto" e "Histórico de alterações". */

import type { AbrirModal } from "@comum/ui/dialogo";
import type { ModeloNaTela } from "../src/app/dados";
import { abrirHistorico, linhaDoRegistro, type NomesDoHistorico, type RegistroNaTela } from "../src/app/dialogos/historico";
import { abrirModelos } from "../src/app/dialogos/modelos";
import { ErroValidacao } from "../src/modelo/validacao";
import { MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import { digitar, escolherCombo, telaDoApp, texto } from "./apoioApp";
import { HOSTIL } from "./cenarioGantt";
import { botao, checar, secao, tique } from "./util";

function modais(doc: Document) {
  const abertos: Array<{ titulo: string; conteudo: HTMLElement; aberto: boolean }> = [];
  const abrirModal: AbrirModal = (o) => {
    doc.body.append(o.conteudo);
    const m = { titulo: o.titulo, conteudo: o.conteudo, aberto: true };
    abertos.push(m);
    return {
      fechar: () => {
        m.aberto = false;
        o.conteudo.remove();
        o.aoFechar?.();
      },
    };
  };
  return { abrirModal, abertos };
}

const salvo: ModeloNaTela = {
  id: "m1",
  nome: HOSTIL,
  fases: ["Fase"],
  etapas: [{ nome: "A", aPartirDe: 0, duracao: 2, marco: false, dependeDe: [], checklist: [] }],
  criadoEm: 1,
  atualizadoEm: 1,
  dispositivo: "d",
  vis: "unidade",
};

const reg = (m: Partial<RegistroNaTela> & { id: string }): RegistroNaTela => ({
  alvo: "e1",
  projeto: "p1",
  quando: new Date(2026, 9, 6, 14, 32).getTime(),
  por: "ana",
  nome: "Ana Lima",
  campo: "fim",
  antes: "2026-09-25",
  depois: "2026-10-02",
  atualizadoEm: 1,
  dispositivo: "d",
  vis: "unidade",
  ...m,
});

export async function verificarAppModelosHistorico(): Promise<void> {
  secao("app: dialogo Modelos de projeto");
  const doc = telaDoApp();
  const m = modais(doc);
  const feitos: string[] = [];
  let recusar = false;
  abrirModelos({
    abrirModal: m.abrirModal,
    modelos: [...MODELOS_EMBUTIDOS, salvo],
    confirmar: async () => true,
    renomear: async (x, nome) => {
      if (recusar) throw new ErroValidacao(["O nome pode ter até 200 caracteres."]);
      feitos.push(`renomear:${x.id}:${nome}`);
    },
    excluir: async (x) => void feitos.push(`excluir:${x.id}`),
    criarProjeto: (x) => feitos.push(`criar:${x.id}`),
  });
  const dlg = () => m.abertos.at(-1)!.conteudo;
  const linhas = [...dlg().querySelectorAll(".prj-modelo")];
  checar("os 3 embutidos e o salvo", linhas.length === 4, linhas.length);
  const embutido = linhas[0]!;
  checar(
    "embutido: so Criar projeto (nao renomeia nem exclui)",
    embutido.querySelectorAll("button").length === 1 && /exemplo do SEI Pro/.test(texto(embutido)),
  );
  const meu = dlg().querySelector(".prj-modelo[data-id='m1']")!;
  checar(
    "o salvo diz onde esta e tem Renomear e Excluir",
    /Toda a unidade/.test(texto(meu)) && !!botao(meu, "Renomear") && !!botao(meu, "Excluir"),
  );
  checar("nome hostil como texto", texto(meu.querySelector(".prj-modelo-nome")) === HOSTIL && !meu.querySelector("img"));
  botao(meu, "Renomear")?.click();
  const campo = meu.querySelector<HTMLInputElement>("input[aria-label='Nome do modelo']");
  recusar = true;
  digitar(campo, "Novo nome");
  botao(meu, "Salvar")?.click();
  await tique();
  checar(
    "renomear recusado: mostra o erro e fica editando",
    /200 caracteres/.test(texto(dlg().querySelector(".prj-erros"))) && !!meu.querySelector("input"),
  );
  recusar = false;
  botao(meu, "Salvar")?.click();
  await tique();
  checar(
    "renomear grava e volta a lista com o nome novo",
    feitos.at(-1) === "renomear:m1:Novo nome" && /Novo nome/.test(texto(dlg().querySelector(".prj-modelo[data-id='m1']"))),
  );
  botao(dlg().querySelector(".prj-modelo[data-id='m1']")!, "Excluir")?.click();
  await tique();
  checar("excluir (confirmado) tira da lista", feitos.at(-1) === "excluir:m1" && !dlg().querySelector(".prj-modelo[data-id='m1']"));
  botao(dlg().querySelector(".prj-modelo")!, "Criar projeto")?.click();
  checar(
    "Criar projeto fecha este dialogo e pede o Novo projeto no modelo",
    feitos.at(-1) === `criar:${MODELOS_EMBUTIDOS[0]!.id}` && !m.abertos.at(-1)!.aberto,
  );

  secao("app: dialogo Historico de alteracoes");
  const nomes: NomesDoHistorico = {
    alvo: (id) =>
      id === "e1"
        ? { tipo: "etapa", nome: HOSTIL }
        : id === "p1"
          ? { tipo: "projeto", nome: "Pregão" }
          : id === "p2"
            ? { tipo: "projeto", nome: "Plano" }
            : undefined,
  };
  const ontem = new Date(2026, 9, 5, 9, 5).getTime();
  const registros = [
    reg({ id: "r1" }),
    reg({ id: "r2", alvo: "p1", campo: "criacao", antes: undefined, depois: "Pregão", quando: ontem }),
    reg({
      id: "r3",
      alvo: "p2",
      projeto: "p2",
      campo: "custo" as RegistroNaTela["campo"],
      antes: "10",
      depois: "20",
      por: "bia",
      nome: undefined,
      vis: "eu",
    }),
    reg({ id: "r4", alvo: "sumiu", campo: "nome", antes: "x", depois: "y" }),
  ];
  await abrirHistorico({
    abrirModal: m.abrirModal,
    projetos: [
      { id: "p1", nome: "Pregão" },
      { id: "p2", nome: "Plano" },
    ],
    registros: async () => registros,
    nomes,
  });
  const h = () => m.abertos.at(-1)!.conteudo;
  const dias = [...h().querySelectorAll(".prj-historico-dia h4")].map((x) => texto(x));
  checar("agrupado por dia, do mais recente", dias.join() === "06/10/2026,05/10/2026", dias);
  const linhasH = [...h().querySelectorAll(".prj-historico-reg")].map((x) => texto(x));
  checar(
    "hora, quem, onde e o que",
    linhasH.some((l) => l.startsWith("14:32") && l.includes("Ana Lima") && l.includes("término 25/09 → 02/10")),
    linhasH,
  );
  checar("nome hostil do alvo como texto", !h().querySelector("img") && linhasH.some((l) => l.includes(HOSTIL)));
  checar(
    "campo que esta versao nao conhece: pelo nome, generico",
    linhasH.some((l) => l.includes("custo 10 → 20") && l.includes("bia")),
    linhasH,
  );
  checar(
    "alvo que sumiu",
    linhasH.some((l) => l.includes("Item que não existe mais")),
  );
  escolherCombo(h(), "Projeto", "p2");
  checar("filtrar por projeto", h().querySelectorAll(".prj-historico-reg").length === 1);
  escolherCombo(h(), "Projeto", "");
  checar("todos de novo", h().querySelectorAll(".prj-historico-reg").length === 4);
  await abrirHistorico({ abrirModal: m.abrirModal, projetos: [], registros: async () => [], nomes });
  checar("vazio explica", /Nenhuma alteração registrada/.test(texto(h())));
  const longo = linhaDoRegistro(reg({ id: "x", campo: "c".repeat(500) as RegistroNaTela["campo"] }), nomes);
  checar("campo desconhecido enorme e cortado", longo.oque.length < 120, longo.oque.length);
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarAppModelosHistorico } from "./verificar-app-modelos-historico";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarAppSincronizacao();
```

por:

```ts
await verificarAppSincronizacao();
await verificarAppModelosHistorico();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dialogos/historico' imported from …/projetos/tests/verificar-app-modelos-historico.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/dialogos/modelos.ts`:

```ts
/**
 * Diálogo "Modelos de projeto" (spec 3.2): a lista (os 3 embutidos e os
 * salvos, com onde estão), renomear e excluir (só os salvos) e "Criar
 * projeto", que fecha este diálogo e abre o "Novo projeto" já no modelo.
 * "Salvar como modelo" fica no Editar projeto (P3).
 */

import type { AbrirModal } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import { LIMITES } from "../../modelo/constantes";
import { rotuloDaVis } from "../../modelo/escopo";
import { ehEmbutido } from "../../modelos/embutidos";
import type { ModeloNaTela } from "../dados";
import { plural } from "../formato";
import { caixaDeErros, mensagensDoErro } from "./campos";

export interface ContextoModelos {
  abrirModal: AbrirModal;
  modelos: readonly ModeloNaTela[];
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  renomear(m: ModeloNaTela, nome: string): Promise<unknown>;
  excluir(m: ModeloNaTela): Promise<unknown>;
  /** Abre o "Novo projeto" com este modelo (este diálogo já fechou). */
  criarProjeto(m: ModeloNaTela): void;
}

function detalhe(m: ModeloNaTela): string {
  const onde = ehEmbutido(m.id) ? "exemplo do SEI Pro" : m.vis ? rotuloDaVis(m.vis) : "";
  return [`${plural(m.etapas.length, "etapa", "etapas")} em ${plural(m.fases.length, "fase", "fases")}`, onde, m.descricao ?? ""]
    .filter(Boolean)
    .join(" · ");
}

export function abrirModelos(c: ContextoModelos): { fechar(): void } {
  const erros = caixaDeErros();
  const lista = h("div", { class: "prj-modelos" });
  let modelos = [...c.modelos];
  let modal: { fechar(): void } | null = null;
  let ocupado = false;
  const tentar = async (fazer: () => Promise<void>) => {
    if (ocupado) return;
    ocupado = true;
    try {
      await fazer();
      erros.mostrar([]);
    } catch (e) {
      erros.mostrar(mensagensDoErro(e));
    } finally {
      ocupado = false;
    }
  };
  const pintar = () => {
    lista.replaceChildren(
      ...modelos.map((m) => {
        const nome = h("b", { class: "prj-modelo-nome" }, m.nome);
        const linha = h(
          "div",
          { class: "prj-modelo", "data-id": m.id },
          icone("camadas", 16),
          h("div", { class: "prj-modelo-texto" }, nome, h("span", { class: "prj-dica" }, detalhe(m))),
        );
        const criar = h(
          "button",
          {
            type: "button",
            class: "spro-botao primario pequeno",
            onclick: () => {
              modal?.fechar();
              c.criarProjeto(m);
            },
          },
          "Criar projeto",
        );
        if (ehEmbutido(m.id)) {
          linha.append(criar);
          return linha;
        }
        const renomear = h("button", { type: "button", class: "spro-botao pequeno" }, "Renomear");
        renomear.addEventListener("click", () => {
          const campo = h("input", {
            type: "text",
            class: "spro-campo",
            maxlength: String(LIMITES.nome),
            value: m.nome,
            "aria-label": "Nome do modelo",
          });
          const salvar = h("button", { type: "button", class: "spro-botao primario pequeno" }, "Salvar");
          const cancelar = h("button", { type: "button", class: "spro-botao pequeno", onclick: () => pintar() }, "Cancelar");
          salvar.addEventListener("click", () =>
            tentar(async () => {
              const novo = campo.value.trim();
              if (!novo) throw new Error("Informe o nome do modelo.");
              await c.renomear(m, novo);
              modelos = modelos.map((x) => (x === m ? { ...m, nome: novo } : x));
              pintar();
            }),
          );
          nome.replaceWith(campo);
          for (const b of linha.querySelectorAll("button")) b.remove();
          linha.append(salvar, cancelar);
          campo.focus();
        });
        const excluir = h(
          "button",
          {
            type: "button",
            class: "spro-botao fantasma perigo pequeno",
            onclick: () =>
              tentar(async () => {
                if (!(await c.confirmar(`Excluir o modelo “${m.nome}”? Os projetos criados com ele ficam.`, "Excluir"))) return;
                await c.excluir(m);
                modelos = modelos.filter((x) => x !== m);
                pintar();
              }),
          },
          "Excluir",
        );
        linha.append(criar, renomear, excluir);
        return linha;
      }),
    );
  };
  pintar();
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-modelos" },
    h("p", { class: "prj-dica" }, "Para guardar um projeto como modelo, use “Salvar como modelo…” no Editar projeto."),
    lista,
    erros.el,
  );
  modal = c.abrirModal({ titulo: "Modelos de projeto", icone: "camadas", conteudo });
  return { fechar: () => modal?.fechar() };
}
```

Arquivo completo `projetos/src/app/dialogos/historico.ts`:

```ts
/**
 * Diálogo "Histórico de alterações" (spec 3.2 e 5.4): quem mudou o quê, do
 * mais recente ao mais antigo, agrupado por dia e filtrável por projeto. Os
 * registros vêm dos dois escopos da unidade (os de "Toda a unidade" chegam
 * pelo Texto Padrão, com o nome de quem mudou). Campo que esta versão não
 * conhece (gravado por uma versão mais nova) aparece pelo nome, como texto.
 */

import { formatarData, hojeISO } from "@comum/datas/dias";
import { criarCombo } from "@comum/ui/combobox";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import type { Registro, Vis } from "../../modelo/tipos";
import { textoDoRegistro } from "../formato";

export interface RegistroNaTela extends Registro {
  vis: Vis;
}

export interface NomesDoHistorico {
  /** O que o registro alterou: projeto, fase ou etapa (vivos ou excluídos), pelo id. */
  alvo(id: string): { tipo: "projeto" | "fase" | "etapa"; nome: string } | undefined;
}

export interface ContextoHistorico {
  abrirModal: AbrirModal;
  projetos: ReadonlyArray<{ id: string; nome: string }>;
  registros(): Promise<RegistroNaTela[]>;
  nomes: NomesDoHistorico;
  /** Já filtrado num projeto (aberto pelo painel desse projeto). */
  projeto?: string;
}

const TODOS = "";
const MAX_CAMPO = 60;

const hora = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** A linha do registro; campo desconhecido entra pelo nome (curto), sempre como texto. */
export function linhaDoRegistro(r: Registro, nomes: NomesDoHistorico): { quem: string; onde: string; oque: string } {
  const alvo = nomes.alvo(r.alvo);
  const tipo = alvo?.tipo;
  const campo = typeof r.campo === "string" ? r.campo.slice(0, MAX_CAMPO) : "?";
  const oque = textoDoRegistro({ ...r, campo: campo as Registro["campo"] }, tipo);
  const onde = alvo ? `${tipo === "projeto" ? "Projeto" : tipo === "fase" ? "Fase" : "Etapa"} “${alvo.nome}”` : "Item que não existe mais";
  return { quem: r.nome || r.por || "Alguém", onde, oque };
}

export async function abrirHistorico(c: ContextoHistorico): Promise<{ fechar(): void }> {
  const todos = (await c.registros()).sort((a, b) => b.quando - a.quando || (a.id < b.id ? 1 : -1));
  const lista = h("div", { class: "prj-historico" });
  const pintar = (projeto: string) => {
    const regs = projeto ? todos.filter((r) => r.projeto === projeto) : todos;
    if (!regs.length) {
      lista.replaceChildren(h("p", { class: "prj-dica" }, "Nenhuma alteração registrada."));
      return;
    }
    const grupos = new Map<string, RegistroNaTela[]>();
    for (const r of regs) {
      const dia = hojeISO(new Date(r.quando));
      const g = grupos.get(dia) ?? [];
      g.push(r);
      grupos.set(dia, g);
    }
    lista.replaceChildren(
      ...[...grupos].map(([dia, rs]) =>
        h(
          "section",
          { class: "prj-historico-dia" },
          h("h4", {}, formatarData(dia)),
          ...rs.map((r) => {
            const l = linhaDoRegistro(r, c.nomes);
            return h(
              "div",
              { class: "prj-historico-reg" },
              h("span", { class: "prj-historico-hora" }, hora(r.quando)),
              icone(r.vis === "unidade" ? "predio" : "pessoa", 13),
              h("span", {}, h("b", {}, l.quem), ` · ${l.onde} · ${l.oque}`),
            );
          }),
        ),
      ),
    );
  };
  const filtro = criarCombo({
    rotulo: "Projeto",
    opcoes: () => [{ valor: TODOS, rotulo: "Todos os projetos" }, ...c.projetos.map((p) => ({ valor: p.id, rotulo: p.nome }))],
    valor: [c.projeto ?? TODOS],
    busca: c.projetos.length > 7,
    aoMudar: (v) => pintar(v[0] ?? TODOS),
  });
  pintar(c.projeto ?? TODOS);
  const conteudo = h("div", { class: "prj-form prj-form-historico" }, h("div", { class: "prj-linha" }, filtro.el), lista);
  return c.abrirModal({ titulo: "Histórico de alterações", icone: "historico", conteudo });
}
```

Acrescente ao fim de `projetos/estatico/projetos.css`:

```css
/* ---------- P4: Modelos de projeto e Historico de alteracoes ---------- */
.prj-form-modelos,
.prj-form-historico {
  min-width: min(520px, 86vw);
}
.prj-modelos {
  display: grid;
  gap: 2px;
}
.prj-modelo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  border-bottom: 1px solid var(--spro-borda);
}
.prj-modelo-texto {
  display: grid;
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.prj-modelo-nome {
  font-weight: 600;
}
.prj-modelo .spro-campo {
  flex: 1;
  min-width: 0;
}
.prj-historico {
  display: grid;
  gap: 12px;
  max-height: 60vh;
  overflow: auto;
}
.prj-historico-dia {
  display: grid;
  gap: 4px;
}
.prj-historico-dia h4 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--spro-suave);
}
.prj-historico-reg {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12.5px;
  overflow-wrap: anywhere;
}
.prj-historico-reg svg {
  flex: none;
  align-self: center;
  color: var(--spro-fraco);
}
.prj-historico-hora {
  flex: none;
  font-family: var(--spro-mono);
  color: var(--spro-fraco);
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1129 ok, 0 falha(s)` (+17).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests && LC_ALL=C grep -c $'[\x80-\xff]' estatico/projetos.css
```
Expected: sem saída do `tsc`; Biome sem erro; `0`.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/dialogos/modelos.ts \
  projetos/src/app/dialogos/historico.ts \
  projetos/estatico/projetos.css \
  projetos/tests/verificar-app-modelos-historico.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: dialogos Modelos de projeto e Historico de alteracoes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 10: Projetos — enviar e receber projeto por arquivo

**Files:**
- Create: `projetos/src/arquivo/projetoArquivo.ts`, `projetos/src/app/dialogos/arquivoProjeto.ts`
- Modify: `projetos/estatico/projetos.css` (acrescenta ao fim), `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-arquivo-projeto.ts`

**Interfaces:**
- Consumes: `paraOTexto` (Tarefa 4: o mesmo corte de sigilo do Texto Padrão); `novoProjeto`, `novaFase`, `novaEtapa`, `entidadeValida`, `RepositorioProjetos` (`projetos.listar`, `carimboAtual`, `importar` com anotações, `obterProjeto`, `escopo`), `ErroValidacao`, `LIMITES`, `rotuloDaVis` (P2); `indiceEntre`, `indiceValido`, `novoId`; (P3) `ProjetoNaTela`, `campo`, `caixaDeErros`, `mensagensDoErro`, `dataLonga`, `plural`, `criarCombo`; nas provas `marcar`.
- Produces: `FORMATO_PROJETO = "seipro-projeto"`, `VERSAO_PROJETO`, `LIMITE_ARQUIVO_PROJETO` (5 MB); `EtapaNoArquivo`, `EnvelopeProjeto { formato; versao; gerado; projeto: { nome; etiquetas; processo? }; fases; etapas }`; `envelopeDoProjeto({ projeto, fases, etapas }, agora)` (só o que está vivo; sem histórico, carimbos e sigilo); `nomeDoArquivoDoProjeto(nome)` (`<nome>.seipro-projeto.json`); `lerEnvelopeDoProjeto(bruto)`; `PreviaRecebido { nome; etapas; fases; inicio?; fim? }`, `previaDoRecebido(env)`; `receberProjeto(repo, env, gerarId?) → Promise<Projeto>` (ids novos, uma gravação, registro de criação; item torto recusa tudo); `abrirEnviarProjeto({ abrirModal; projetos; enviar(p) })`, `abrirReceberProjeto({ abrirModal; sigla; previa; receber(vis) })`.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-arquivo-projeto.ts`:

```ts
/**
 * Enviar e receber projeto por arquivo (spec 6.2): o arquivo não leva o
 * histórico nem nada sigiloso; receber cria uma cópia com ids novos, numa
 * gravação só, e o arquivo torto não grava nada. E os dois diálogos.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import type { AbrirModal } from "@comum/ui/dialogo";
import type { ProjetoNaTela } from "../src/app/dados";
import { abrirEnviarProjeto, abrirReceberProjeto } from "../src/app/dialogos/arquivoProjeto";
import {
  envelopeDoProjeto,
  lerEnvelopeDoProjeto,
  nomeDoArquivoDoProjeto,
  previaDoRecebido,
  receberProjeto,
} from "../src/arquivo/projetoArquivo";
import { resumoDoProjeto } from "../src/modelo/resumo";
import type { Vis } from "../src/modelo/tipos";
import { ErroValidacao } from "../src/modelo/validacao";
import { marcar, telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { HOSTIL } from "./cenarioGantt";
import { etapa, HOJE, projeto } from "./fabrica";
import { botao, checar, lanca, secao, tique } from "./util";

function modais(doc: Document) {
  const abertos: Array<{ titulo: string; conteudo: HTMLElement; aberto: boolean }> = [];
  const abrirModal: AbrirModal = (o) => {
    doc.body.append(o.conteudo);
    const m = { titulo: o.titulo, conteudo: o.conteudo, aberto: true };
    abertos.push(m);
    return {
      fechar: () => {
        m.aberto = false;
        o.conteudo.remove();
        o.aoFechar?.();
      },
    };
  };
  return { abrirModal, abertos };
}

export async function verificarArquivoProjeto(): Promise<void> {
  secao("enviar projeto: o que vai no arquivo");
  const { repo } = novoRepo(ESCOPO_UN, areaMemoria(), "o");
  const p = await repo.criarProjeto({ nome: "Sindicância", processo: { protocolo: "50300.000777/2026-10", sigiloso: true } });
  const f = await repo.criarFase(p.id, "Instrução");
  const e1 = await repo.criarEtapa({
    projeto: p.id,
    nome: "Oitiva",
    inicio: "2026-10-06",
    fim: "2026-10-09",
    fase: f.id,
    documento: { numero: "1234567" },
  });
  await repo.criarEtapa({
    projeto: p.id,
    nome: "Relatório",
    inicio: "2026-10-13",
    fim: "2026-10-16",
    dependeDe: [e1.id],
    checklist: [{ id: "c1", texto: "Revisar", feito: true }],
  });
  const morta = await repo.criarEtapa({ projeto: p.id, nome: "Excluída", inicio: "2026-10-06", fim: "2026-10-06" });
  await repo.removerEtapa(morta.id);
  const d = await repo.dados();
  const env = envelopeDoProjeto({ projeto: d.projetos[0]!, fases: d.fases, etapas: d.etapas }, 5);
  const json = JSON.stringify(env);
  checar("sem o numero sigiloso e sem o documento da etapa sigilosa", !json.includes("000777") && !json.includes("1234567"), json);
  checar("o vinculo vai marcado e vazio", env.projeto.processo?.protocolo === "" && env.projeto.processo?.sigiloso === true);
  checar("sem historico, sem carimbos, sem lapides", !("h" in env) && !json.includes("atualizadoEm") && env.etapas.length === 2);
  checar(
    "fases, dependencias e checklist vao",
    env.fases.length === 1 && env.etapas[1]?.dependeDe.length === 1 && env.etapas[1]?.checklist[0]?.texto === "Revisar",
  );
  checar(
    "nome do arquivo sem caracteres proibidos",
    nomeDoArquivoDoProjeto('A/B: "x"?') === "A B x.seipro-projeto.json" && nomeDoArquivoDoProjeto("").startsWith("projeto."),
  );

  secao("receber projeto: copia com ids novos");
  const lido = lerEnvelopeDoProjeto(JSON.parse(json));
  checar(
    "le o envelope",
    !!lido &&
      previaDoRecebido(lido).etapas === 2 &&
      previaDoRecebido(lido).inicio === "2026-10-06" &&
      previaDoRecebido(lido).fim === "2026-10-16",
  );
  checar("outro formato nao e projeto enviado", lerEnvelopeDoProjeto({ formato: "seipro-projetos", versao: 1 }) === null);
  checar("etapas demais: recusado", lerEnvelopeDoProjeto({ ...env, etapas: Array.from({ length: 301 }, () => env.etapas[0]) }) === null);
  const { repo: destino } = novoRepo(ESCOPO_EU, areaMemoria(), "n");
  const recebido = await receberProjeto(destino, lido!);
  const dd = await destino.dados();
  checar(
    "cria o projeto, as fases e as etapas com ids novos",
    recebido.id !== p.id && dd.etapas.length === 2 && dd.fases.length === 1 && !dd.etapas.some((e) => e.id === e1.id),
  );
  const rel = dd.etapas.find((e) => e.nome === "Relatório");
  const oit = dd.etapas.find((e) => e.nome === "Oitiva");
  checar("dependencia e fase apontam para os ids novos", rel?.dependeDe[0] === oit?.id && oit?.fase === dd.fases[0]?.id);
  checar(
    "registro de criacao no historico do destino",
    (await destino.historico(recebido.id)).some((r) => r.campo === "criacao"),
  );
  const outra = await receberProjeto(destino, lido!);
  checar("receber de novo cria outra copia (nao mescla)", outra.id !== recebido.id && (await destino.dados()).projetos.length === 2);
  const torto = { ...lido!, etapas: [{ ...lido!.etapas[0]!, inicio: "2026-13-45" }] };
  const { repo: vazio } = novoRepo(ESCOPO_UN, areaMemoria(), "t");
  const e = await lanca(() => receberProjeto(vazio, torto));
  checar("arquivo com item torto: nada gravado", e instanceof ErroValidacao && (await vazio.dados()).projetos.length === 0, e);
  const tipos = { ...lido!, etapas: [{ ...lido!.etapas[0]!, nome: 42 as unknown as string }] };
  checar("tipo errado tambem (sem lancar TypeError)", (await lanca(() => receberProjeto(vazio, tipos))) instanceof ErroValidacao);

  secao("enviar e receber: os dialogos");
  const doc = telaDoApp();
  const m = modais(doc);
  const pn = (id: string, nome: string): ProjetoNaTela => ({
    projeto: projeto({ id, nome }),
    vis: "unidade",
    fases: [],
    etapas: [etapa({ id: `${id}e`, projeto: id })],
    resumo: resumoDoProjeto([etapa({ id: `${id}e`, projeto: id })], HOJE),
  });
  const enviados: string[] = [];
  abrirEnviarProjeto({
    abrirModal: m.abrirModal,
    projetos: [pn("a", HOSTIL), pn("b", "Plano")],
    enviar: (x) => enviados.push(x.projeto.id),
  });
  const dlg = m.abertos.at(-1)!.conteudo;
  checar("escolher o projeto e a nota de privacidade", /sem o número de processo sigiloso/.test(texto(dlg)) && !dlg.querySelector("img"));
  botao(dlg, "Baixar arquivo")?.click();
  checar("baixar fecha e envia o escolhido (o primeiro)", enviados.join() === "a" && !m.abertos.at(-1)!.aberto);
  const pedidos: Vis[] = [];
  let falhar = false;
  abrirReceberProjeto({
    abrirModal: m.abrirModal,
    sigla: "SEPRO",
    previa: { nome: HOSTIL, etapas: 2, fases: 1, inicio: "2026-10-06", fim: "2026-10-16" },
    receber: async (vis) => {
      pedidos.push(vis);
      if (falhar) throw new ErroValidacao(["Limite de 100 projetos ativos em “Só eu”."]);
    },
  });
  const rec = m.abertos.at(-1)!.conteudo;
  checar(
    "previa: nome, etapas, fases e periodo",
    /2 etapas em 1 fase · de 06\/10\/2026 a 16\/10\/2026/.test(texto(rec)) && texto(rec.querySelector(".prj-previa b")) === HOSTIL,
  );
  marcar(rec.querySelector("input[value='eu']"));
  falhar = true;
  botao(rec, "Receber projeto")?.click();
  await tique();
  checar(
    "erro: mostra e fica aberto",
    /Limite de 100/.test(texto(rec.querySelector(".prj-erros"))) && m.abertos.at(-1)!.aberto && pedidos.join() === "eu",
  );
  falhar = false;
  botao(rec, "Receber projeto")?.click();
  await tique();
  checar("recebeu: fecha", !m.abertos.at(-1)!.aberto);
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarArquivoProjeto } from "./verificar-arquivo-projeto";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarAppModelosHistorico();
```

por:

```ts
await verificarAppModelosHistorico();
await verificarArquivoProjeto();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dialogos/arquivoProjeto' imported from …/projetos/tests/verificar-arquivo-projeto.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/arquivo/projetoArquivo.ts`:

```ts
/**
 * "Enviar projeto por arquivo" e "Receber projeto de arquivo" (spec 6.2): um
 * projeto, com as fases e as etapas vivas, em `<nome>.seipro-projeto.json`.
 * Sem o histórico e sem o número de processo sigiloso (nem o documento de
 * etapa sigilosa): a mesma regra do Texto Padrão (`paraOTexto`). Receber cria
 * uma CÓPIA com ids novos no escopo escolhido (não mescla com o original), numa
 * gravação só, e recusa o arquivo inteiro se algum item vier torto.
 */

import { novoId } from "@comum/id";
import { indiceEntre, indiceValido } from "@comum/ordem/indice";
import { LIMITES } from "../modelo/constantes";
import { rotuloDaVis } from "../modelo/escopo";
import { novaEtapa, novaFase, novoProjeto } from "../modelo/operacoes";
import type { DataISO, Etapa, Fase, Projeto, Vinculo } from "../modelo/tipos";
import { ErroValidacao } from "../modelo/validacao";
import { entidadeValida, type RepositorioProjetos } from "../repositorio";
import { paraOTexto } from "../sincronia/textoPadrao";

export const FORMATO_PROJETO = "seipro-projeto";
export const VERSAO_PROJETO = 1;
/** Um projeto tem no máximo 300 etapas; com folga para as fases e o texto, nada passa de 5 MB. */
export const LIMITE_ARQUIVO_PROJETO = 5 * 1024 * 1024;

/** A etapa como vai no arquivo: o que importa para recriá-la, sem carimbos nem histórico. */
export type EtapaNoArquivo = Pick<
  Etapa,
  | "id"
  | "fase"
  | "ordem"
  | "nome"
  | "inicio"
  | "fim"
  | "marco"
  | "dependeDe"
  | "responsavel"
  | "medida"
  | "progresso"
  | "checklist"
  | "processo"
  | "documento"
  | "etiquetas"
  | "observacoes"
  | "concluidaEm"
  | "base"
>;

export interface EnvelopeProjeto {
  formato: typeof FORMATO_PROJETO;
  versao: typeof VERSAO_PROJETO;
  gerado: number;
  projeto: { nome: string; etiquetas: string[]; processo?: Vinculo };
  fases: Array<Pick<Fase, "id" | "nome" | "ordem">>;
  etapas: EtapaNoArquivo[];
}

const CAMPOS_ETAPA = [
  "id",
  "fase",
  "ordem",
  "nome",
  "inicio",
  "fim",
  "marco",
  "dependeDe",
  "responsavel",
  "medida",
  "progresso",
  "checklist",
  "processo",
  "documento",
  "etiquetas",
  "observacoes",
  "concluidaEm",
  "base",
] as const;

function soCampos(e: Etapa): EtapaNoArquivo {
  const saida: Record<string, unknown> = {};
  for (const k of CAMPOS_ETAPA) if (e[k] !== undefined) saida[k] = e[k];
  return saida as EtapaNoArquivo;
}

/** O que vai no arquivo: o projeto e o que está vivo nele, sem nada sigiloso. */
export function envelopeDoProjeto(
  d: { projeto: Projeto; fases: readonly Fase[]; etapas: readonly Etapa[] },
  agora: number,
): EnvelopeProjeto {
  const limpo = paraOTexto(
    {
      formato: "seipro-projetos",
      versao: 1,
      host: "",
      unidade: "",
      vis: "unidade",
      gerado: agora,
      entidades: { p: [d.projeto], f: [...d.fases], e: [...d.etapas], h: [], m: [] },
    },
    agora,
  ).entidades;
  const p = limpo.p[0] ?? d.projeto;
  const projeto: EnvelopeProjeto["projeto"] = { nome: p.nome, etiquetas: [...p.etiquetas] };
  if (p.processo) projeto.processo = p.processo;
  return {
    formato: FORMATO_PROJETO,
    versao: VERSAO_PROJETO,
    gerado: agora,
    projeto,
    fases: limpo.f.filter((f) => f.removidoEm === undefined).map((f) => ({ id: f.id, nome: f.nome, ordem: f.ordem })),
    etapas: limpo.e.filter((e) => e.removidoEm === undefined).map(soCampos),
  };
}

/** "Revisão normativa.seipro-projeto.json", sem os caracteres que os sistemas de arquivo recusam. */
export function nomeDoArquivoDoProjeto(nome: string): string {
  const base =
    nome
      .replace(/[\\/:*?"<>|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "projeto";
  return `${base}.seipro-projeto.json`;
}

const objeto = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);

/** O envelope do arquivo (forma e tetos), ou null se não é um projeto enviado pelo SEI Pro. A forma de cada item é do `receber`. */
export function lerEnvelopeDoProjeto(bruto: unknown): EnvelopeProjeto | null {
  if (!objeto(bruto) || bruto.formato !== FORMATO_PROJETO || bruto.versao !== VERSAO_PROJETO) return null;
  const p = bruto.projeto;
  if (!objeto(p) || typeof p.nome !== "string" || !Array.isArray(p.etiquetas)) return null;
  if (!Array.isArray(bruto.fases) || !Array.isArray(bruto.etapas)) return null;
  if (bruto.etapas.length > LIMITES.etapasPorProjeto || bruto.fases.length > LIMITES.etapasPorProjeto) return null;
  if (!bruto.fases.every(objeto) || !bruto.etapas.every(objeto)) return null;
  return bruto as unknown as EnvelopeProjeto;
}

/** O que o diálogo mostra antes de receber. */
export interface PreviaRecebido {
  nome: string;
  etapas: number;
  fases: number;
  inicio?: DataISO;
  fim?: DataISO;
}

export function previaDoRecebido(env: EnvelopeProjeto): PreviaRecebido {
  const datas = env.etapas
    .flatMap((e) => [e.inicio, e.fim])
    .filter((d): d is DataISO => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d));
  datas.sort();
  return { nome: env.projeto.nome, etapas: env.etapas.length, fases: env.fases.length, inicio: datas[0], fim: datas.at(-1) };
}

/** Cria a cópia com ids novos no repositório (escopo) escolhido; o arquivo torto não grava nada. */
export async function receberProjeto(repo: RepositorioProjetos, env: EnvelopeProjeto, gerarId: () => string = novoId): Promise<Projeto> {
  const todos = await repo.projetos.listar();
  const ativos = todos.filter((p) => p.removidoEm === undefined && p.arquivadoEm === undefined);
  if (ativos.length >= LIMITES.projetosAtivos)
    throw new ErroValidacao([
      `Limite de ${LIMITES.projetosAtivos} projetos ativos em “${rotuloDaVis(repo.escopo.vis)}”. Arquive ou exclua algum.`,
    ]);
  const c = repo.carimboAtual();
  const maior = todos
    .map((p) => p.ordem)
    .filter((o) => typeof o === "string" && indiceValido(o))
    .sort()
    .at(-1);
  const pid = gerarId();
  const montado = montar(env, pid, maior ?? null, c, gerarId);
  if (!montado) throw new ErroValidacao(["O arquivo tem itens inválidos; nada foi recebido."]);
  const { p, fases, etapas } = montado;
  await repo.importar(
    { p: [p], f: fases, e: etapas },
    { registros: [{ alvo: pid, projeto: pid, campo: "criacao", depois: p.nome }], carimbo: c },
  );
  const recebido = await repo.obterProjeto(pid);
  if (!recebido) throw new ErroValidacao(["Não foi possível receber o projeto."]);
  return recebido;
}

/** As entidades novas, ou null se algum item do arquivo é torto (tipo errado, data impossível, texto longo). */
function montar(
  env: EnvelopeProjeto,
  pid: string,
  maior: string | null,
  c: ReturnType<RepositorioProjetos["carimboAtual"]>,
  gerarId: () => string,
): { p: Projeto; fases: Fase[]; etapas: Etapa[] } | null {
  try {
    const p = novoProjeto(
      { nome: env.projeto.nome, processo: env.projeto.processo, etiquetas: env.projeto.etiquetas },
      pid,
      indiceEntre(maior, null),
      c,
    );
    const idsFase = new Map(env.fases.map((f) => [f.id, gerarId()]));
    const fases = env.fases.map((f) => novaFase(pid, String(f.nome ?? ""), idsFase.get(f.id) as string, String(f.ordem ?? "a0"), c));
    const idsEtapa = new Map(env.etapas.map((e) => [e.id, gerarId()]));
    const etapas = env.etapas.map((e) =>
      novaEtapa(
        {
          ...e,
          projeto: pid,
          fase: e.fase ? idsFase.get(e.fase) : undefined,
          dependeDe: (Array.isArray(e.dependeDe) ? e.dependeDe : []).map((d) => idsEtapa.get(d)).filter((d): d is string => !!d),
          checklist: (Array.isArray(e.checklist) ? e.checklist : []).map((i) => ({ ...i, id: gerarId() })),
        },
        idsEtapa.get(e.id) as string,
        typeof e.ordem === "string" ? e.ordem : "a0",
        c,
      ),
    );
    const ok = entidadeValida(p, "p") && fases.every((f) => entidadeValida(f, "f")) && etapas.every((e) => entidadeValida(e, "e"));
    return ok ? { p, fases, etapas } : null;
  } catch {
    return null;
  }
}
```

Arquivo completo `projetos/src/app/dialogos/arquivoProjeto.ts`:

```ts
/**
 * "Enviar projeto por arquivo…" (escolher o projeto, quando o painel está no
 * Todos) e "Receber projeto de arquivo…" (prévia + "Receber em"), do menu
 * ajustes. Com um projeto aberto, enviar baixa direto (sem diálogo).
 */

import { criarCombo } from "@comum/ui/combobox";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import type { PreviaRecebido } from "../../arquivo/projetoArquivo";
import type { Vis } from "../../modelo/tipos";
import type { ProjetoNaTela } from "../dados";
import { dataLonga, plural } from "../formato";
import { caixaDeErros, campo, mensagensDoErro } from "./campos";

const NOTA_ENVIO = "O arquivo leva as fases e as etapas, sem o histórico e sem o número de processo sigiloso.";

export function abrirEnviarProjeto(c: { abrirModal: AbrirModal; projetos: readonly ProjetoNaTela[]; enviar(p: ProjetoNaTela): void }): {
  fechar(): void;
} {
  let modal: { fechar(): void } | null = null;
  const escolha = criarCombo({
    rotulo: "Projeto",
    opcoes: () =>
      c.projetos.map((p) => ({ valor: p.projeto.id, rotulo: p.projeto.nome, descricao: plural(p.etapas.length, "etapa", "etapas") })),
    valor: c.projetos[0] ? [c.projetos[0].projeto.id] : [],
    vazio: "Escolher um projeto…",
    busca: c.projetos.length > 7,
  });
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-enviar" },
    campo("Projeto", escolha.el, { dica: NOTA_ENVIO }),
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
      h(
        "button",
        {
          type: "button",
          class: "spro-botao primario",
          onclick: () => {
            const p = c.projetos.find((x) => x.projeto.id === escolha.valor()[0]);
            if (!p) return;
            modal?.fechar();
            c.enviar(p);
          },
        },
        "Baixar arquivo",
      ),
    ),
  );
  modal = c.abrirModal({ titulo: "Enviar projeto por arquivo", icone: "baixar", conteudo });
  return { fechar: () => modal?.fechar() };
}

function cartao(valor: Vis, marcado: boolean, titulo: string, explica: string): HTMLElement {
  return h(
    "label",
    { class: "prj-opcao" },
    h("input", { type: "radio", name: "destino", value: valor, checked: marcado }),
    h("div", {}, h("b", {}, titulo), h("span", {}, ` ${explica}`)),
  );
}

/** Prévia do arquivo e o destino; `receber` resolve = fecha; rejeitar = mostra o erro e fica. */
export function abrirReceberProjeto(c: {
  abrirModal: AbrirModal;
  sigla: string;
  previa: PreviaRecebido;
  receber(vis: Vis): Promise<unknown>;
}): { fechar(): void } {
  let modal: { fechar(): void } | null = null;
  const erros = caixaDeErros();
  const p = c.previa;
  const periodo = p.inicio && p.fim ? ` · de ${dataLonga(p.inicio)} a ${dataLonga(p.fim)}` : "";
  const cartoes = h(
    "div",
    { class: "prj-opcoes", role: "radiogroup", "aria-label": "Receber em" },
    cartao("unidade", true, `Toda a unidade (${c.sigla})`, `Quem usa o SEI Pro na ${c.sigla} vê e edita.`),
    cartao("eu", false, "Só eu", "Aparece só para você, nesta unidade."),
  );
  const destino = (): Vis => (cartoes.querySelector<HTMLInputElement>("input[value='eu']")?.checked ? "eu" : "unidade");
  const receber = h("button", { type: "button", class: "spro-botao primario" }, "Receber projeto");
  let ocupado = false;
  receber.addEventListener("click", async () => {
    if (ocupado) return;
    ocupado = true;
    receber.disabled = true;
    try {
      await c.receber(destino());
      modal?.fechar();
    } catch (e) {
      erros.mostrar(mensagensDoErro(e));
    } finally {
      ocupado = false;
      receber.disabled = false;
    }
  });
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-receber" },
    h(
      "div",
      { class: "prj-previa" },
      h("b", {}, p.nome),
      h("span", {}, ` ${plural(p.etapas, "etapa", "etapas")} em ${plural(p.fases, "fase", "fases")}${periodo}`),
    ),
    campo("Receber em", cartoes, { dica: "Vira um projeto novo (uma cópia): não junta com o original de quem enviou." }),
    erros.el,
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
      receber,
    ),
  );
  modal = c.abrirModal({ titulo: "Receber projeto de arquivo", icone: "subir", conteudo });
  return { fechar: () => modal?.fechar() };
}
```

Acrescente ao fim de `projetos/estatico/projetos.css`:

```css
/* ---------- P4: enviar e receber projeto por arquivo ---------- */
.prj-form-enviar,
.prj-form-receber {
  min-width: min(440px, 86vw);
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1148 ok, 0 falha(s)` (+19).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests && LC_ALL=C grep -c $'[\x80-\xff]' estatico/projetos.css
```
Expected: sem saída do `tsc`; Biome sem erro; `0`.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/arquivo/projetoArquivo.ts \
  projetos/src/app/dialogos/arquivoProjeto.ts \
  projetos/estatico/projetos.css \
  projetos/tests/verificar-arquivo-projeto.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: enviar e receber projeto por arquivo, sem sigilo e com ids novos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 11: Projetos — importar do servidor do Atividades (mapeamento, busca na aba, diálogo)

**Files:**
- Create: `projetos/src/importacao/atividades.ts`, `projetos/src/pagina/atividades.ts`, `projetos/src/app/dialogos/importar.ts`
- Create (apoio às provas): `projetos/tests/legadoAtividades.ts`
- Modify: `projetos/estatico/projetos.css` (acrescenta ao fim), `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-importacao-atividades.ts`, `projetos/tests/pagina/verificar-atividades-pagina.ts`

**Interfaces:**
- Consumes: `dataNaFaixa`, `LIMITE_DIAS_ETAPA`, `LIMITES`, `entidadeValida`, `RepositorioProjetos` (`entidades`, `importar`, `carimboAtual`), `Carimbo`, `Entidades` (P2); `diferencaDias`, `somarDias`, `indiceEntre`, `jsonEstavel`, `hashCurto`, `normalizarTexto`; (P3) `campo`, `caixaDeErros`, `mensagensDoErro`, `plural`. Formato do legado: `backend/functions.php` `listProjetos`/`listEtapas`/`getTitlesDemandasProjetos` (clone principal) e `dist/js/sei-pro-atividades.js` `getServerAtividades` (modo "panel", ação "demandas") e `localStorageStorePro("configBasePro_atividades", { URL_API, KEY_USER })` (JSON no `localStorage` do SEI).
- Produces: `DISPOSITIVO_ATIVIDADES = "atividades"`; `ProjetoLegado`, `EtapaLegada`, `DemandaLegada`; `diaLegado(x)`; `projetosLegados(bruto): ProjetoLegado[]`; `idDoLegado.{projeto,etapa,fase,item}`; `mapearProjeto(l, c, hoje, ordem): Pick<Entidades, "p" | "f" | "e">` (spec 6.3); `ItemImportavel { id; nome; unidade; etapas; arquivado }`, `itensParaImportar(lista, agora)`; `ResultadoImportacaoAtividades { novos; atualizados; iguais; noOutroEscopo; ignorados }`, `importarAtividades(repos, escolhidos, destino, hoje)`; na aba `ConfigAtividades { url; chave; perfil }`, `ProjetosDoAtividades { fonte: "servidor" | "cache"; projetos: unknown[]; aviso? }`, `lerConfigAtividades(ls)`, `projetosDoCache(ls)`, `corpoDaRequisicao(cfg, versaoSeiPro)`, `buscarProjetosAtividades(cfg, versaoSeiPro, buscar)`, `projetosDoAtividades(ls, versaoSeiPro, buscar)`; no app `ContextoImportar`, `abrirImportarAtividades(c)`. Nas provas: `projetoLegado`, `etapaLegada`, `projetoCompleto`, `SENTINELA`.

- [ ] **Step 1: Escrever as provas que falham**

Arquivo completo `projetos/tests/legadoAtividades.ts`:

```ts
/** Projetos como o servidor do Atividades devolve (`padrao.projetos`, backend/functions.php listProjetos/listEtapas). */

export const SENTINELA = "0000-00-00 00:00:00";

export function etapaLegada(m: Record<string, unknown> & { id_etapa: number }): Record<string, unknown> {
  return {
    id_projeto: 42,
    id_dependencia: false,
    id_demandas: false,
    id_demandas_titles: false,
    nome_etapa: `Etapa ${m.id_etapa}`,
    processo_sei: false,
    id_procedimento: false,
    config: [],
    responsavel: false,
    data_inicio_programado: "2026-03-02 00:00:00",
    data_fim_programado: "2026-03-13 00:00:00",
    data_inicio_progresso_automatico: SENTINELA,
    data_fim_progresso_automatico: SENTINELA,
    observacoes: false,
    macroetapa: false,
    grupo: false,
    etiqueta: false,
    data_inicio_execucao: SENTINELA,
    data_fim_execucao: false,
    progresso_execucao: false,
    documento_relacionado: false,
    id_documento_sei: false,
    documento_sei: false,
    ativo: true,
    data_inicio: "2026-02-20 10:00:00",
    data_fim: SENTINELA,
    datetime: "2026-02-20 10:00:00",
    primarykey: "id_etapa",
    ...m,
  };
}

export function projetoLegado(m: Record<string, unknown> & { id_projeto: number }): Record<string, unknown> {
  return {
    etapas: [],
    id_unidade: 7,
    sigla_unidade: "SEPRO",
    projetos_compartilhados: false,
    id_cadeia_valor: false,
    id_tipo_projeto: 3,
    tipo_projeto: "Normativo",
    config: [],
    nome_projeto: `Projeto ${m.id_projeto}`,
    processo_sei: "50300.000123/2026-01",
    id_procedimento: 9911,
    data_inicio: "2026-02-20 10:00:00",
    data_fim: SENTINELA,
    ativo: true,
    datetime: "2026-02-20 10:00:00",
    primarykey: "id_projeto",
    ...m,
  };
}

/** Um projeto com tudo o que o mapeamento da spec 6.3 cobre. */
export function projetoCompleto(): Record<string, unknown> {
  return projetoLegado({
    id_projeto: 42,
    nome_projeto: "Revisão da Resolução 1",
    etapas: [
      etapaLegada({
        id_etapa: 1,
        nome_etapa: "Minuta",
        macroetapa: "Instrução",
        grupo: "Jurídico",
        etiqueta: "urgente; revisão",
        responsavel: "Ana Lima",
        observacoes: "Ver parecer",
        documento_sei: "1234567",
        documento_relacionado: "Nota Técnica 5",
        data_inicio_execucao: "2026-03-03 09:00:00",
        data_fim_execucao: "2026-03-12 18:00:00",
        progresso_execucao: "100",
        id_demandas_titles: [
          { id_demanda: 900, nome_atividade: "Elaborar minuta", data_entrega: "2026-03-10 12:00:00" },
          { id_demanda: 901, nome_atividade: false, assunto: "Revisar", data_entrega: SENTINELA },
        ],
      }),
      etapaLegada({
        id_etapa: 2,
        nome_etapa: "Consulta pública",
        macroetapa: "Consulta",
        id_dependencia: 1,
        data_inicio_programado: "2026-03-16 00:00:00",
        data_fim_programado: "2026-04-15 00:00:00",
        data_inicio_progresso_automatico: "2026-03-16 00:00:00",
        processo_sei: "50300.000777/2026-02",
        id_procedimento: 7788,
      }),
      etapaLegada({
        id_etapa: 3,
        nome_etapa: "Sem datas",
        data_inicio_programado: SENTINELA,
        data_fim_programado: SENTINELA,
        id_dependencia: 99,
        macroetapa: "Instrução",
      }),
    ],
  });
}
```

Arquivo completo `projetos/tests/verificar-importacao-atividades.ts`:

```ts
/**
 * Importar do servidor do Atividades (spec 6.3): o mapeamento campo a campo,
 * a idempotência pelos ids (reimportar atualiza só o que ninguém mexeu, não
 * duplica, não ressuscita o excluído), o escopo onde o projeto já está, e o
 * diálogo.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import type { AbrirModal } from "@comum/ui/dialogo";
import { abrirImportarAtividades } from "../src/app/dialogos/importar";
import {
  DISPOSITIVO_ATIVIDADES,
  diaLegado,
  idDoLegado,
  importarAtividades,
  itensParaImportar,
  mapearProjeto,
  projetosLegados,
} from "../src/importacao/atividades";
import { entidadeValida } from "../src/repositorio";
import { marcar, telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { HOSTIL } from "./cenarioGantt";
import { HOJE } from "./fabrica";
import { etapaLegada, projetoCompleto, projetoLegado, SENTINELA } from "./legadoAtividades";
import { botao, checar, secao, tique } from "./util";

const C = { agora: Date.UTC(2026, 9, 6, 12), dispositivo: "pc-ana", por: "ana", nome: "Ana" };

export async function verificarImportacaoAtividades(): Promise<void> {
  secao("atividades: forma dos dados do servidor");
  const lista = projetosLegados([
    projetoCompleto(),
    { id_projeto: "x" },
    null,
    projetoLegado({ id_projeto: 43, etapas: [{ id_etapa: "nada" }] }),
  ]);
  checar("so os projetos com id numerico; etapa sem id sai", lista.length === 2 && lista[1]?.etapas.length === 0, lista.length);
  checar(
    "data sentinela e vazia",
    diaLegado(SENTINELA) === undefined && diaLegado("2026-03-02 00:00:00") === "2026-03-02" && diaLegado(false) === undefined,
  );
  checar("ano fora do calendario e vazio", diaLegado("1999-12-31 00:00:00") === undefined);

  secao("atividades: o mapeamento da spec 6.3");
  const m = mapearProjeto(lista[0]!, C, HOJE, "a0");
  const p = m.p[0]!;
  checar(
    "projeto: nome, processo, tipo como etiqueta e origem",
    p.id === "atvp42" &&
      p.nome === "Revisão da Resolução 1" &&
      p.processo?.protocolo === "50300.000123/2026-01" &&
      p.processo?.idProcedimento === "9911" &&
      p.etiquetas.join() === "Normativo" &&
      p.origem?.atividades === 42 &&
      p.arquivadoEm === undefined,
    p,
  );
  const [e1, e2, e3] = [m.e.find((e) => e.id === "atve1")!, m.e.find((e) => e.id === "atve2")!, m.e.find((e) => e.id === "atve3")!];
  checar(
    "executada: inicio e termino da execucao, programado como base, concluida",
    e1.inicio === "2026-03-03" &&
      e1.fim === "2026-03-12" &&
      e1.base?.inicio === "2026-03-02" &&
      e1.base?.fim === "2026-03-13" &&
      e1.concluidaEm === "2026-03-12",
    e1,
  );
  checar("progresso manual do legado", e1.medida === "manual" && e1.progresso === 100);
  checar(
    "macroetapa vira fase (criada pelo nome, uma so para o mesmo nome)",
    m.f.length === 2 && e1.fase === e3.fase && e1.fase === idDoLegado.fase(42, "Instrução"),
    m.f,
  );
  checar("grupo e etiqueta viram etiquetas", e1.etiquetas.join() === "Jurídico,urgente,revisão", e1.etiquetas);
  checar(
    "responsavel, observacoes e documento",
    e1.responsavel?.nome === "Ana Lima" &&
      e1.observacoes === "Ver parecer" &&
      e1.documento?.numero === "1234567" &&
      e1.documento.titulo === "Nota Técnica 5",
  );
  checar(
    "demandas viram checklist (feito com data de entrega)",
    e1.checklist.length === 2 &&
      e1.checklist[0]?.texto === "Demanda: Elaborar minuta" &&
      e1.checklist[0].feito &&
      !e1.checklist[1]?.feito &&
      e1.checklist[1]?.texto === "Demanda: Revisar",
    e1.checklist,
  );
  checar("dependencia dentro do projeto", e2.dependeDe.join() === "atve1");
  checar("dependencia para fora do projeto sai", e3.dependeDe.length === 0);
  checar("periodo de progresso automatico vira medida pelo tempo", e2.medida === "tempo");
  checar("processo da etapa", e2.processo?.protocolo === "50300.000777/2026-02");
  checar("etapa sem datas: o dia do projeto", e3.inicio === "2026-02-20" && e3.fim === "2026-02-20");
  checar(
    "tudo passa na validacao da sincronia",
    [
      ...m.p.map((x) => entidadeValida(x, "p", C.agora)),
      ...m.f.map((x) => entidadeValida(x, "f", C.agora)),
      ...m.e.map((x) => entidadeValida(x, "e", C.agora)),
    ].every(Boolean),
  );
  checar(
    "o dispositivo marca o que veio do Atividades",
    m.e.every((e) => e.dispositivo === DISPOSITIVO_ATIVIDADES),
  );
  const arq = mapearProjeto(
    projetosLegados([projetoLegado({ id_projeto: 50, data_fim: "2025-12-31 23:59:59", ativo: false })])[0]!,
    C,
    HOJE,
    "a0",
  );
  checar("data_fim preenchida e passada: arquivado", typeof arq.p[0]?.arquivadoEm === "number");
  const torta = mapearProjeto(
    projetosLegados([
      projetoLegado({
        id_projeto: 51,
        nome_projeto: HOSTIL,
        etapas: [etapaLegada({ id_etapa: 9, data_inicio_programado: "2026-05-10 00:00:00", data_fim_programado: "2026-05-01 00:00:00" })],
      }),
    ])[0]!,
    C,
    HOJE,
    "a0",
  );
  checar(
    "termino antes do inicio no legado: corrigido para o mesmo dia",
    torta.e[0]?.fim === "2026-05-10" && entidadeValida(torta.e[0], "e"),
  );
  checar("nome hostil fica como texto (dado)", torta.p[0]?.nome === HOSTIL);
  const sujo = mapearProjeto(
    projetosLegados([
      projetoLegado({
        id_projeto: 52,
        processo_sei: "SEI 50300.000123/2026-01",
        etapas: [etapaLegada({ id_etapa: 10, documento_sei: "nº 1234567", processo_sei: "sem numero" })],
      }),
    ])[0]!,
    C,
    HOJE,
    "a0",
  );
  checar(
    "so o numero passa: processo e documento limpos, processo sem numero sai",
    sujo.p[0]?.processo?.protocolo === "50300.000123/2026-01" &&
      sujo.e[0]?.documento?.numero === "1234567" &&
      sujo.e[0]?.processo === undefined &&
      entidadeValida(sujo.p[0], "p") &&
      entidadeValida(sujo.e[0], "e"),
    sujo,
  );
  const itens = itensParaImportar(
    [...lista, ...projetosLegados([projetoLegado({ id_projeto: 50, data_fim: "2025-12-31 23:59:59", ativo: false })])],
    C.agora,
  );
  checar(
    "itens do dialogo: nome, unidade, etapas, arquivado",
    itens[0]?.etapas === 3 && itens[0].unidade === "SEPRO" && itens.at(-1)?.arquivado === true,
    itens,
  );

  secao("atividades: importar e reimportar sem duplicar");
  const area = areaMemoria();
  const repos = { unidade: novoRepo(ESCOPO_UN, area, "u").repo, eu: novoRepo(ESCOPO_EU, area, "e").repo };
  const r1 = await importarAtividades(repos, lista, "unidade", HOJE);
  const d1 = await repos.unidade.dados();
  checar(
    "primeira vez: entram os projetos, fases e etapas",
    r1.novos === 2 && d1.projetos.length === 2 && d1.etapas.length === 3 && d1.fases.length === 2,
    r1,
  );
  checar(
    "com o registro de criacao",
    (await repos.unidade.historico("atvp42")).some((r) => r.campo === "criacao"),
  );
  const r2 = await importarAtividades(repos, lista, "unidade", HOJE);
  checar(
    "reimportar igual: nada gravado, nada duplicado",
    r2.iguais === 2 && r2.novos === 0 && (await repos.unidade.dados()).etapas.length === 3,
    r2,
  );
  await repos.unidade.editarEtapa("atve1", { nome: "Minuta (revisada aqui)" }, HOJE);
  await repos.unidade.removerEtapa("atve3");
  const mudou = projetosLegados([projetoCompleto()]);
  mudou[0]!.etapas[0]!.nome_etapa = "Minuta do servidor";
  mudou[0]!.etapas[1]!.nome_etapa = "Consulta (servidor)";
  const r3 = await importarAtividades(repos, mudou, "unidade", HOJE);
  checar(
    "reimportar: atualiza o que ninguem mexeu; o editado e o excluido aqui ficam",
    r3.atualizados === 1 &&
      (await repos.unidade.obterEtapa("atve2"))?.nome === "Consulta (servidor)" &&
      (await repos.unidade.obterEtapa("atve1"))?.nome === "Minuta (revisada aqui)" &&
      (await repos.unidade.obterEtapa("atve3")) === undefined,
    r3,
  );
  const r4 = await importarAtividades(repos, lista, "eu", HOJE);
  checar(
    "pedir para 'Só eu' o que ja esta na unidade: atualiza la, sem copiar",
    r4.noOutroEscopo === 2 && (await repos.eu.dados()).projetos.length === 0,
    r4,
  );

  secao("atividades: o dialogo");
  const doc = telaDoApp();
  const pedidos: Array<{ ids: number[]; vis: string }> = [];
  let fechado = false;
  const abrirModal: AbrirModal = (o) => {
    doc.body.append(o.conteudo);
    return {
      fechar: () => {
        fechado = true;
        o.conteudo.remove();
      },
    };
  };
  abrirImportarAtividades({
    abrirModal,
    sigla: "SEPRO",
    itens: [
      { id: 42, nome: HOSTIL, unidade: "SEPRO", etapas: 3, arquivado: false },
      { id: 50, nome: "Antigo", unidade: "SEPRO", etapas: 1, arquivado: true },
    ],
    jaImportados: new Set([42]),
    avisoCache: "O servidor do Atividades respondeu 500.",
    importar: async (ids, vis) => void pedidos.push({ ids, vis }),
  });
  const dlg = doc.body.querySelector(".prj-form-importar") as HTMLElement;
  checar("avisa que veio do guardado", /não respondeu \(O servidor do Atividades respondeu 500\.\)/.test(texto(dlg)));
  const linhas = [...dlg.querySelectorAll(".prj-importar-item")];
  checar(
    "os ativos ja marcados, o arquivado nao",
    linhas[0]!.querySelector<HTMLInputElement>("input")!.checked && !linhas[1]!.querySelector<HTMLInputElement>("input")!.checked,
  );
  checar("ja importado: atualiza", /já importado: atualiza/.test(texto(linhas[0])) && !linhas[0]?.querySelector("img"));
  checar("o resumo do que vem", /Vêm 1 projeto e 3 etapas/.test(texto(dlg.querySelector(".prj-importar-resumo"))));
  marcar(linhas[1]?.querySelector("input"));
  checar("marcar soma", /Vêm 2 projetos e 4 etapas/.test(texto(dlg.querySelector(".prj-importar-resumo"))));
  marcar(dlg.querySelector("input[value='eu']"));
  botao(dlg, "Importar")?.click();
  await tique();
  checar(
    "importa os marcados no destino escolhido e fecha",
    pedidos[0]?.ids.join() === "42,50" && pedidos[0]?.vis === "eu" && fechado,
    pedidos,
  );
}
```

Arquivo completo `projetos/tests/pagina/verificar-atividades-pagina.ts`:

```ts
/** A busca no servidor do Atividades, do lado da aba (pagina/atividades.ts), com um fetch falso. */

import {
  buscarProjetosAtividades,
  corpoDaRequisicao,
  lerConfigAtividades,
  projetosDoAtividades,
  projetosDoCache,
} from "../../src/pagina/atividades";
import { checar, lanca, secao } from "../util";

function armazenamento(v: Record<string, unknown>): Pick<Storage, "getItem"> {
  return { getItem: (k) => (k in v ? JSON.stringify(v[k]) : null) };
}

function servidor(resposta: unknown, status = 200) {
  const pedidos: Array<{ url: string; corpo: string }> = [];
  const buscar = (async (url: string, init?: RequestInit) => {
    pedidos.push({ url, corpo: String(init?.body ?? "") });
    return { ok: status >= 200 && status < 300, status, json: async () => resposta } as Response;
  }) as unknown as typeof fetch;
  return { buscar, pedidos };
}

export async function verificarAtividadesPagina(): Promise<void> {
  secao("pagina: configuracao do servidor do Atividades");
  const cfg = armazenamento({
    configBasePro_atividades: { URL_API: "https://atividades.orgao.gov.br/api/", KEY_USER: "chave-123" },
    optionsPro: { perfilAtividadesSelected: "SEPRO" },
  });
  const c = lerConfigAtividades(cfg);
  checar(
    "le endereco, chave e perfil",
    c?.url === "https://atividades.orgao.gov.br/api/" && c.chave === "chave-123" && c.perfil === "SEPRO",
    c,
  );
  checar("sem configuracao: null", lerConfigAtividades(armazenamento({})) === null);
  checar(
    "endereco que nao e http(s): null",
    lerConfigAtividades(armazenamento({ configBasePro_atividades: { URL_API: "javascript:alert(1)", KEY_USER: "k" } })) === null,
  );
  const corpo = corpoDaRequisicao(c!, "2.6.0");
  checar(
    "a mesma requisicao do painel legado, com os arquivados",
    corpo.get("action") === "demandas" &&
      corpo.get("hash") === "chave-123" &&
      corpo.get("projetos") === '{"vigentes":false}' &&
      corpo.get("version") === "2.6.0",
    corpo.toString(),
  );

  secao("pagina: busca e recuo no guardado");
  const ok = servidor({ status: 1, padrao: { projetos: [{ id_projeto: 1 }] } });
  const lista = await buscarProjetosAtividades(c!, "2.6.0", ok.buscar);
  checar(
    "POST no endereco configurado; devolve padrao.projetos",
    lista.length === 1 && ok.pedidos[0]?.url === c!.url && ok.pedidos[0]?.corpo.includes("hash=chave-123"),
  );
  const negado = servidor({ status: 0, status_txt: "Acesso negado." });
  checar(
    "status 0: o erro do servidor",
    (await lanca(() => buscarProjetosAtividades(c!, "1", negado.buscar)))?.message === "Acesso negado.",
  );
  const comCache = armazenamento({
    configBasePro_atividades: { URL_API: "https://atividades.orgao.gov.br/api/", KEY_USER: "k" },
    configDataAtividadesPadraoPro_projetos: [{ id_projeto: 7 }],
  });
  const r = await projetosDoAtividades(comCache, "1", servidor(null, 500).buscar);
  checar(
    "servidor falhou: o guardado pelo painel legado, com o motivo",
    r.fonte === "cache" && r.projetos.length === 1 && /500/.test(r.aviso ?? ""),
    r,
  );
  checar("cache le o array", projetosDoCache(comCache)?.length === 1);
  const semNada = await lanca(() => projetosDoAtividades(cfg, "1", servidor(null, 500).buscar));
  checar("sem servidor e sem guardado: o erro", /500/.test(semNada?.message ?? ""));
  checar(
    "sem configuracao: explica",
    /Não há servidor/.test((await lanca(() => projetosDoAtividades(armazenamento({}), "1", ok.buscar)))?.message ?? ""),
  );
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarImportacaoAtividades } from "./verificar-importacao-atividades";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarArquivoProjeto();
```

por:

```ts
await verificarArquivoProjeto();
await verificarImportacaoAtividades();
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await ((await import(suiteSincroniaPagina)) as { verificarSincroniaPagina(): Promise<void> }).verificarSincroniaPagina();
```

por:

```ts
await ((await import(suiteSincroniaPagina)) as { verificarSincroniaPagina(): Promise<void> }).verificarSincroniaPagina();
const suiteAtividadesPagina = "./pagina/verificar-atividades-pagina";
await ((await import(suiteAtividadesPagina)) as { verificarAtividadesPagina(): Promise<void> }).verificarAtividadesPagina();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/dialogos/importar' imported from …/projetos/tests/verificar-importacao-atividades.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/importacao/atividades.ts`:

```ts
/**
 * Importar do servidor do Atividades (spec 6.3): os projetos que o painel
 * legado lista (`padrao.projetos`, com `etapas`) viram projetos novos. O
 * mapeamento é puro; quem busca é o content script (pagina/atividades.ts).
 *
 * Idempotente pelos ids: projeto `atvp<id>`, etapa `atve<id>`, fase
 * `atvf<id do projeto>-<hash do nome>` (os mesmos em qualquer computador: duas
 * pessoas da unidade importando o mesmo projeto não duplicam) e `origem`
 * guarda o id legado. Reimportar atualiza só o que ninguém mexeu depois (o
 * item continua com o dispositivo "atividades"); o que foi editado ou
 * excluído aqui fica como está. Datas `0000-00-00…` = vazio.
 */

import { type DataISO, diferencaDias, somarDias } from "@comum/datas/dias";
import { indiceEntre } from "@comum/ordem/indice";
import { jsonEstavel } from "@comum/sincronia/assinatura";
import { hashCurto, normalizarTexto } from "@comum/texto";
import { dataNaFaixa, LIMITE_DIAS_ETAPA } from "../modelo/calendario";
import { LIMITES } from "../modelo/constantes";
import type { Carimbo, Entidades, Etapa, Fase, ItemChecklist, Projeto, Vinculo, Vis } from "../modelo/tipos";
import type { RepositorioProjetos } from "../repositorio";

/** O dispositivo do que veio do Atividades: editado aqui, passa a ser o do computador (e a reimportação não mexe). */
export const DISPOSITIVO_ATIVIDADES = "atividades";

export interface DemandaLegada {
  id_demanda?: unknown;
  nome_atividade?: unknown;
  assunto?: unknown;
  data_entrega?: unknown;
}

export interface EtapaLegada {
  id_etapa: number;
  id_dependencia?: unknown;
  nome_etapa?: unknown;
  processo_sei?: unknown;
  id_procedimento?: unknown;
  responsavel?: unknown;
  data_inicio_programado?: unknown;
  data_fim_programado?: unknown;
  data_inicio_progresso_automatico?: unknown;
  observacoes?: unknown;
  macroetapa?: unknown;
  grupo?: unknown;
  etiqueta?: unknown;
  data_inicio_execucao?: unknown;
  data_fim_execucao?: unknown;
  progresso_execucao?: unknown;
  documento_relacionado?: unknown;
  documento_sei?: unknown;
  id_demandas_titles?: unknown;
  data_inicio?: unknown;
}

export interface ProjetoLegado {
  id_projeto: number;
  nome_projeto?: unknown;
  sigla_unidade?: unknown;
  tipo_projeto?: unknown;
  processo_sei?: unknown;
  id_procedimento?: unknown;
  data_inicio?: unknown;
  data_fim?: unknown;
  ativo?: unknown;
  etapas: EtapaLegada[];
}

const objeto = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
const inteiro = (x: unknown): number | null => {
  const n = typeof x === "number" ? x : typeof x === "string" && /^\d{1,12}$/.test(x) ? Number(x) : Number.NaN;
  return Number.isSafeInteger(n) && n > 0 ? n : null;
};
const textoDe = (x: unknown, max: number): string => (typeof x === "string" || typeof x === "number" ? String(x).trim().slice(0, max) : "");
const sentinela = (x: unknown): boolean => typeof x !== "string" || !x.trim() || x.startsWith("0000-00-00");

/** "2026-10-06 14:00:00" → "2026-10-06" (vazio, sentinela ou fora de 2000–2100 → undefined). */
export function diaLegado(x: unknown): DataISO | undefined {
  if (sentinela(x)) return undefined;
  const d = (x as string).slice(0, 10);
  return dataNaFaixa(d) ? d : undefined;
}

/** "2026-10-06 14:00:00" → ms (hora local), ou undefined. */
function instanteLegado(x: unknown): number | undefined {
  if (sentinela(x)) return undefined;
  const ms = Date.parse((x as string).replace(" ", "T"));
  return Number.isFinite(ms) ? ms : undefined;
}

/** Só os projetos com a forma do legado (id numérico); etapas tortas saem, o resto do campo a campo é do mapeamento. */
export function projetosLegados(bruto: unknown): ProjetoLegado[] {
  if (!Array.isArray(bruto)) return [];
  const saida: ProjetoLegado[] = [];
  for (const x of bruto.slice(0, 1000)) {
    if (!objeto(x)) continue;
    const id = inteiro(x.id_projeto);
    if (id === null) continue;
    const etapas = (Array.isArray(x.etapas) ? x.etapas : [])
      .filter(objeto)
      .map((e) => ({ ...e, id_etapa: inteiro(e.id_etapa) }))
      .filter((e): e is EtapaLegada => e.id_etapa !== null)
      .slice(0, LIMITES.etapasPorProjeto);
    saida.push({ ...(x as object), id_projeto: id, etapas } as ProjetoLegado);
  }
  return saida;
}

export const idDoLegado = {
  projeto: (id: number): string => `atvp${id}`,
  etapa: (id: number): string => `atve${id}`,
  fase: (idProjeto: number, nome: string): string => `atvf${idProjeto}-${hashCurto(normalizarTexto(nome)).slice(0, 8)}`,
  item: (idDemanda: unknown, i: number): string => `atvd${inteiro(idDemanda) ?? `x${i}`}`,
};

/** Arquivado: `data_fim` preenchida (e já passada, se o servidor diz que não está ativo). */
function arquivadoEm(l: ProjetoLegado, agora: number): number | undefined {
  if (sentinela(l.data_fim)) return undefined;
  const quando = instanteLegado(l.data_fim);
  if (l.ativo === true && quando !== undefined && quando > agora) return undefined;
  return quando !== undefined && quando <= agora ? quando : agora;
}

/** Só o que é número de processo (dígitos, ponto, barra, hífen): o resto do texto do legado sai. */
function vinculo(processo: unknown, idProcedimento: unknown): Vinculo | undefined {
  const protocolo = textoDe(processo, 40).replace(/[^0-9./-]/g, "");
  if (!/\d/.test(protocolo)) return undefined;
  const id = inteiro(idProcedimento);
  return id ? { protocolo, idProcedimento: String(id) } : { protocolo };
}

function etiquetasDe(...valores: unknown[]): string[] {
  const todas = valores.flatMap((v) => textoDe(v, 400).split(/[,;]/)).map((t) => t.trim().slice(0, LIMITES.etiquetaTexto));
  return [...new Set(todas.filter((t) => t && t !== "false"))].slice(0, LIMITES.etiquetas);
}

function checklistDe(x: unknown): ItemChecklist[] {
  if (!Array.isArray(x)) return [];
  return x
    .filter(objeto)
    .slice(0, LIMITES.checklistItens)
    .map((d, i) => {
      const nome = textoDe((d as DemandaLegada).nome_atividade, 180) || textoDe((d as DemandaLegada).assunto, 180) || "sem nome";
      return {
        id: idDoLegado.item((d as DemandaLegada).id_demanda, i),
        texto: `Demanda: ${nome}`.slice(0, LIMITES.checklistTexto),
        feito: !sentinela((d as DemandaLegada).data_entrega),
      };
    });
}

/** O projeto legado como entidades novas (carimbo do Atividades), com as etapas em ordem de início. */
export function mapearProjeto(l: ProjetoLegado, c: Carimbo, hoje: DataISO, ordem: string): Pick<Entidades, "p" | "f" | "e"> {
  const pid = idDoLegado.projeto(l.id_projeto);
  const carimbo = { atualizadoEm: c.agora, dispositivo: DISPOSITIVO_ATIVIDADES, ...(c.por ? { alteradoPor: c.por } : {}) };
  const projeto: Projeto = {
    id: pid,
    nome: textoDe(l.nome_projeto, LIMITES.nome) || `Projeto ${l.id_projeto}`,
    etiquetas: etiquetasDe(l.tipo_projeto),
    ordem,
    criadoEm: instanteLegado(l.data_inicio) ?? 0,
    origem: { atividades: l.id_projeto },
    ...carimbo,
  };
  const processo = vinculo(l.processo_sei, l.id_procedimento);
  if (processo) projeto.processo = processo;
  const arquivo = arquivadoEm(l, c.agora);
  if (arquivo !== undefined) projeto.arquivadoEm = arquivo;
  const diaDoProjeto = diaLegado(l.data_inicio) ?? hoje;
  const fases = new Map<string, Fase>();
  let ordemFase: string | null = null;
  const etapasLegadas = [...l.etapas].sort((a, b) => {
    const da = diaLegado(a.data_inicio_programado) ?? "";
    const db = diaLegado(b.data_inicio_programado) ?? "";
    return da < db ? -1 : da > db ? 1 : a.id_etapa - b.id_etapa;
  });
  const ids = new Set(etapasLegadas.map((e) => e.id_etapa));
  let ordemEtapa: string | null = null;
  const etapas = etapasLegadas.map((e): Etapa => {
    const progIni = diaLegado(e.data_inicio_programado);
    const progFim = diaLegado(e.data_fim_programado);
    const execIni = diaLegado(e.data_inicio_execucao);
    const execFim = diaLegado(e.data_fim_execucao);
    const inicio = execIni ?? progIni ?? diaDoProjeto;
    let fim = execFim ?? progFim ?? inicio;
    if (fim < inicio) fim = inicio;
    if (diferencaDias(inicio, fim) > LIMITE_DIAS_ETAPA) fim = somarDias(inicio, LIMITE_DIAS_ETAPA);
    const base =
      progIni && progFim && progFim >= progIni && diferencaDias(progIni, progFim) <= LIMITE_DIAS_ETAPA
        ? { inicio: progIni, fim: progFim }
        : { inicio, fim };
    ordemEtapa = indiceEntre(ordemEtapa, null);
    const etapa: Etapa = {
      id: idDoLegado.etapa(e.id_etapa),
      projeto: pid,
      ordem: ordemEtapa,
      nome: textoDe(e.nome_etapa, LIMITES.nome) || `Etapa ${e.id_etapa}`,
      inicio,
      fim,
      marco: false,
      dependeDe: [],
      medida: sentinela(e.data_inicio_progresso_automatico) ? "manual" : "tempo",
      progresso: Math.min(100, Math.max(0, Math.round(Number(e.progresso_execucao) || 0))),
      checklist: checklistDe(e.id_demandas_titles),
      etiquetas: etiquetasDe(e.grupo, e.etiqueta),
      base,
      criadoEm: instanteLegado(e.data_inicio) ?? 0,
      origem: { atividades: e.id_etapa },
      ...carimbo,
    };
    const dep = inteiro(e.id_dependencia);
    if (dep !== null && dep !== e.id_etapa && ids.has(dep)) etapa.dependeDe = [idDoLegado.etapa(dep)];
    if (execFim) etapa.concluidaEm = execFim;
    const nomeFase = textoDe(e.macroetapa, LIMITES.nome);
    if (nomeFase && nomeFase !== "false") {
      const fid = idDoLegado.fase(l.id_projeto, nomeFase);
      if (!fases.has(fid)) {
        ordemFase = indiceEntre(ordemFase, null);
        fases.set(fid, { id: fid, projeto: pid, nome: nomeFase, ordem: ordemFase, ...carimbo });
      }
      etapa.fase = fid;
    }
    const responsavel = textoDe(e.responsavel, LIMITES.nome);
    if (responsavel && responsavel !== "false") etapa.responsavel = { nome: responsavel };
    const obs = textoDe(e.observacoes, LIMITES.observacoes);
    if (obs && obs !== "false") etapa.observacoes = obs;
    const doc = textoDe(e.documento_sei, 40).replace(/\D/g, "");
    if (doc) {
      const titulo = textoDe(e.documento_relacionado, LIMITES.nome);
      etapa.documento = titulo && titulo !== "false" ? { numero: doc, titulo } : { numero: doc };
    }
    const proc = vinculo(e.processo_sei, e.id_procedimento);
    if (proc) etapa.processo = proc;
    return etapa;
  });
  return { p: [projeto], f: [...fases.values()], e: etapas };
}

/** Uma linha do diálogo: o que o usuário escolhe. */
export interface ItemImportavel {
  id: number;
  nome: string;
  unidade: string;
  etapas: number;
  arquivado: boolean;
}

export function itensParaImportar(lista: readonly ProjetoLegado[], agora: number): ItemImportavel[] {
  return lista.map((l) => ({
    id: l.id_projeto,
    nome: textoDe(l.nome_projeto, LIMITES.nome) || `Projeto ${l.id_projeto}`,
    unidade: textoDe(l.sigla_unidade, 40),
    etapas: l.etapas.length,
    arquivado: arquivadoEm(l, agora) !== undefined,
  }));
}

export interface ResultadoImportacaoAtividades {
  /** Projetos que entraram pela primeira vez. */
  novos: number;
  /** Projetos já importados que tinham algo a atualizar. */
  atualizados: number;
  /** Já importados e sem nada novo (ou editados aqui, que não são tocados). */
  iguais: number;
  /** Ficaram no outro escopo ("Só eu" ou "Toda a unidade"), onde já estavam. */
  noOutroEscopo: number;
  ignorados: number;
}

const conteudo = (x: { atualizadoEm: number; dispositivo: string; alteradoPor?: string }) => {
  const { atualizadoEm: _a, dispositivo: _d, alteradoPor: _p, ...resto } = x;
  return jsonEstavel(resto);
};

/**
 * Grava os escolhidos: no escopo onde o projeto já está (se já foi importado) ou no `destino`.
 * Entra só o que é novo ou mudou no servidor E não foi mexido aqui.
 */
export async function importarAtividades(
  repos: Readonly<Record<Vis, RepositorioProjetos>>,
  escolhidos: readonly ProjetoLegado[],
  destino: Vis,
  hoje: DataISO,
): Promise<ResultadoImportacaoAtividades> {
  const r: ResultadoImportacaoAtividades = { novos: 0, atualizados: 0, iguais: 0, noOutroEscopo: 0, ignorados: 0 };
  const outro: Vis = destino === "unidade" ? "eu" : "unidade";
  const locais = { [destino]: await repos[destino].entidades(), [outro]: await repos[outro].entidades() } as Record<Vis, Entidades>;
  for (const l of escolhidos) {
    const pid = idDoLegado.projeto(l.id_projeto);
    const jaNoOutro = locais[outro].p.some((p) => p.id === pid && p.removidoEm === undefined);
    const vis = jaNoOutro ? outro : destino;
    if (jaNoOutro) r.noOutroEscopo++;
    const aqui = locais[vis];
    const repo = repos[vis];
    const c = repo.carimboAtual();
    const existente = aqui.p.find((p) => p.id === pid);
    const maior =
      aqui.p
        .map((p) => p.ordem)
        .sort()
        .at(-1) ?? null;
    const m = mapearProjeto(l, c, hoje, existente?.ordem ?? indiceEntre(maior, null));
    const porId = new Map<string, { atualizadoEm: number; dispositivo: string; alteradoPor?: string }>(
      [...aqui.p, ...aqui.f, ...aqui.e].map((x) => [x.id, x]),
    );
    // Novo, ou ainda como veio do Atividades e com conteúdo diferente; o que foi mexido aqui (ou excluído) fica.
    const entra = <T extends { id: string; atualizadoEm: number; dispositivo: string; alteradoPor?: string }>(x: T) => {
      const local = porId.get(x.id);
      return !local || (local.dispositivo === DISPOSITIVO_ATIVIDADES && conteudo(local) !== conteudo(x));
    };
    const lote = { p: m.p.filter(entra), f: m.f.filter(entra), e: m.e.filter(entra) };
    if (!lote.p.length && !lote.f.length && !lote.e.length) {
      r.iguais++;
      continue;
    }
    const res = await repo.importar(
      lote,
      existente ? undefined : { registros: [{ alvo: pid, projeto: pid, campo: "criacao", depois: m.p[0]!.nome }], carimbo: c },
    );
    r.ignorados += res.ignorados;
    if (existente) r.atualizados++;
    else r.novos++;
  }
  return r;
}
```

Arquivo completo `projetos/src/pagina/atividades.ts`:

```ts
/**
 * A busca dos projetos do servidor do Atividades, do lado da aba (spec 6.3):
 * a MESMA requisição do painel legado (`getServerAtividades` no modo "panel",
 * ação "demandas", com `projetos={"vigentes":false}` para trazer também os
 * arquivados), com o endereço e a chave que o legado gravou no localStorage do
 * SEI (`configBasePro_atividades`). A chave só vai para esse endereço, como no
 * legado. Se o servidor não responder, vale o que o painel legado guardou
 * (`configDataAtividadesPadraoPro_projetos`). A ação `view_projetos` do
 * servidor está quebrada (devolve só o último projeto) e não é usada.
 */

export interface ConfigAtividades {
  url: string;
  chave: string;
  /** Unidade escolhida no painel legado (`optionsPro.perfilAtividadesSelected`). */
  perfil: string;
}

export interface ProjetosDoAtividades {
  fonte: "servidor" | "cache";
  projetos: unknown[];
  /** Por que veio do guardado (o servidor falhou), para o diálogo explicar. */
  aviso?: string;
}

type Leitura = Pick<Storage, "getItem">;

function json(ls: Leitura, chave: string): unknown {
  try {
    return JSON.parse(ls.getItem(chave) ?? "null");
  } catch {
    return null;
  }
}

/** O endereço e a chave do legado, só se o endereço é http(s). */
export function lerConfigAtividades(ls: Leitura): ConfigAtividades | null {
  const c = json(ls, "configBasePro_atividades") as { URL_API?: unknown; KEY_USER?: unknown } | null;
  if (!c || typeof c.URL_API !== "string" || typeof c.KEY_USER !== "string" || !c.KEY_USER) return null;
  let url: URL;
  try {
    url = new URL(c.URL_API);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const opcoes = json(ls, "optionsPro") as { perfilAtividadesSelected?: unknown } | null;
  const perfil = typeof opcoes?.perfilAtividadesSelected === "string" ? opcoes.perfilAtividadesSelected : "";
  return { url: url.href, chave: c.KEY_USER, perfil };
}

/** O que o painel legado guardou da última carga (pode estar velho). */
export function projetosDoCache(ls: Leitura): unknown[] | null {
  const v = json(ls, "configDataAtividadesPadraoPro_projetos");
  return Array.isArray(v) ? v : null;
}

/** Os campos que o legado manda (jQuery serializa `false` como "false"). */
export function corpoDaRequisicao(cfg: ConfigAtividades, versaoSeiPro: string): URLSearchParams {
  return new URLSearchParams({
    action: "demandas",
    status: "ativas",
    lista: "self",
    self: "",
    hash: cfg.chave,
    version: versaoSeiPro,
    perfil: cfg.perfil,
    last_update: "false",
    id_programa: "false",
    projetos: JSON.stringify({ vigentes: false }),
    prescricoes: "false",
  });
}

/** POST no servidor do Atividades; devolve `padrao.projetos` (lista vazia sem a capacidade de ver projetos). */
export async function buscarProjetosAtividades(cfg: ConfigAtividades, versaoSeiPro: string, buscar: typeof fetch): Promise<unknown[]> {
  const r = await buscar(cfg.url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: corpoDaRequisicao(cfg, versaoSeiPro).toString(),
  });
  if (!r.ok) throw new Error(`O servidor do Atividades respondeu ${r.status}.`);
  const dados = (await r.json()) as { status?: unknown; status_txt?: unknown; padrao?: { projetos?: unknown } } | null;
  if (dados?.status === 0 || dados?.status === "0") {
    throw new Error(
      typeof dados.status_txt === "string" && dados.status_txt ? dados.status_txt : "O servidor do Atividades recusou o acesso.",
    );
  }
  const projetos = dados?.padrao?.projetos;
  return Array.isArray(projetos) ? projetos : [];
}

/** O servidor; se falhar, o guardado pelo painel legado; sem nenhum dos dois, o erro do servidor. */
export async function projetosDoAtividades(ls: Leitura, versaoSeiPro: string, buscar: typeof fetch): Promise<ProjetosDoAtividades> {
  const cfg = lerConfigAtividades(ls);
  if (!cfg) throw new Error("Não há servidor do Atividades configurado neste SEI.");
  try {
    return { fonte: "servidor", projetos: await buscarProjetosAtividades(cfg, versaoSeiPro, buscar) };
  } catch (e) {
    const guardados = projetosDoCache(ls);
    if (!guardados) throw e;
    return { fonte: "cache", projetos: guardados, aviso: e instanceof Error ? e.message : String(e) };
  }
}
```

Arquivo completo `projetos/src/app/dialogos/importar.ts`:

```ts
/**
 * Diálogo "Importar do servidor do Atividades" (spec 3.2 e 6.3): a lista dos
 * projetos com caixas (nome, unidade, etapas, arquivado; os ativos já
 * marcados), o destino ("Toda a unidade" por padrão) e o resumo do que vem.
 * Reimportar não duplica: os já importados aparecem como "atualiza".
 */

import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import type { ItemImportavel } from "../../importacao/atividades";
import type { Vis } from "../../modelo/tipos";
import { plural } from "../formato";
import { caixaDeErros, campo, mensagensDoErro } from "./campos";

export interface ContextoImportar {
  abrirModal: AbrirModal;
  sigla: string;
  itens: readonly ItemImportavel[];
  /** Ids legados que já estão aqui (reimportar atualiza). */
  jaImportados: ReadonlySet<number>;
  /** Veio do guardado pelo painel legado (o servidor falhou): o motivo. */
  avisoCache?: string;
  /** Resolve = fecha; rejeitar mostra o erro e deixa aberto. */
  importar(ids: number[], vis: Vis): Promise<unknown>;
}

function cartao(valor: Vis, marcado: boolean, titulo: string, explica: string): HTMLElement {
  return h(
    "label",
    { class: "prj-opcao" },
    h("input", { type: "radio", name: "destino-importar", value: valor, checked: marcado }),
    h("div", {}, h("b", {}, titulo), h("span", {}, ` ${explica}`)),
  );
}

export function abrirImportarAtividades(c: ContextoImportar): { fechar(): void } {
  let modal: { fechar(): void } | null = null;
  const erros = caixaDeErros();
  const resumo = h("p", { class: "prj-dica prj-importar-resumo" });
  const caixas = c.itens.map((it) => {
    const caixa = h("input", { type: "checkbox", value: String(it.id) });
    // A propriedade (e não o atributo): é o que o navegador lê depois, e o que o usuário muda.
    caixa.checked = !it.arquivado;
    caixa.addEventListener("change", () => pintarResumo());
    const detalhe = [
      it.unidade,
      plural(it.etapas, "etapa", "etapas"),
      it.arquivado ? "arquivado" : "",
      c.jaImportados.has(it.id) ? "já importado: atualiza" : "",
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      it,
      caixa,
      el: h("label", { class: "prj-importar-item" }, caixa, h("b", {}, it.nome), h("span", { class: "prj-dica" }, ` ${detalhe}`)),
    };
  });
  const escolhidos = () => caixas.filter((x) => x.caixa.checked).map((x) => x.it);
  const pintarResumo = () => {
    const e = escolhidos();
    resumo.textContent = e.length
      ? `Vêm ${plural(e.length, "projeto", "projetos")} e ${plural(
          e.reduce((n, x) => n + x.etapas, 0),
          "etapa",
          "etapas",
        )}. As demandas viram itens do checklist.`
      : "Marque ao menos um projeto.";
    importar.disabled = !e.length;
  };
  const cartoes = h(
    "div",
    { class: "prj-opcoes", role: "radiogroup", "aria-label": "Importar para" },
    cartao("unidade", true, `Toda a unidade (${c.sigla})`, `Quem usa o SEI Pro na ${c.sigla} vê e edita.`),
    cartao("eu", false, "Só eu", "Aparece só para você, nesta unidade."),
  );
  const destino = (): Vis => (cartoes.querySelector<HTMLInputElement>("input[value='eu']")?.checked ? "eu" : "unidade");
  const importar = h("button", { type: "button", class: "spro-botao primario" }, "Importar");
  let ocupado = false;
  importar.addEventListener("click", async () => {
    if (ocupado || !escolhidos().length) return;
    ocupado = true;
    importar.disabled = true;
    try {
      await c.importar(
        escolhidos().map((x) => x.id),
        destino(),
      );
      modal?.fechar();
    } catch (e) {
      erros.mostrar(mensagensDoErro(e));
    } finally {
      ocupado = false;
      importar.disabled = !escolhidos().length;
    }
  });
  pintarResumo();
  const conteudo = h(
    "div",
    { class: "prj-form prj-form-importar" },
    c.avisoCache
      ? h(
          "p",
          { class: "prj-dica prj-importar-cache" },
          `O servidor do Atividades não respondeu (${c.avisoCache}). Estes são os projetos que o painel antigo guardou neste navegador.`,
        )
      : null,
    c.itens.length
      ? h("div", { class: "prj-importar-lista" }, ...caixas.map((x) => x.el))
      : h("p", { class: "prj-dica" }, "O servidor não tem projetos para você."),
    campo("Importar para", cartoes, { dica: "Reimportar depois atualiza o que você não mexeu aqui; nada se duplica." }),
    resumo,
    erros.el,
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
      importar,
    ),
  );
  modal = c.abrirModal({ titulo: "Importar do servidor do Atividades", icone: "subir", conteudo });
  return { fechar: () => modal?.fechar() };
}
```

Acrescente ao fim de `projetos/estatico/projetos.css`:

```css
/* ---------- P4: importar do servidor do Atividades ---------- */
.prj-form-importar {
  min-width: min(520px, 86vw);
}
.prj-importar-lista {
  display: grid;
  gap: 2px;
  max-height: 40vh;
  overflow: auto;
}
.prj-importar-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 4px;
  border-bottom: 1px solid var(--spro-borda);
  cursor: pointer;
  overflow-wrap: anywhere;
}
.prj-importar-item input {
  flex: none;
}
.prj-importar-resumo {
  margin: 0;
  color: var(--spro-texto);
}
.prj-importar-cache {
  margin: 0;
  padding: 8px 10px;
  background: var(--spro-fundo-2);
  border-radius: var(--spro-raio);
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1191 ok, 0 falha(s)` (+43).

- [ ] **Step 5: Portões (os dois tsconfig)**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests && LC_ALL=C grep -c $'[\x80-\xff]' estatico/projetos.css
```
Expected: sem saída do `tsc`; Biome sem erro; `0`.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/importacao/atividades.ts \
  projetos/src/pagina/atividades.ts \
  projetos/src/app/dialogos/importar.ts \
  projetos/estatico/projetos.css \
  projetos/tests/legadoAtividades.ts \
  projetos/tests/verificar-importacao-atividades.ts \
  projetos/tests/pagina/verificar-atividades-pagina.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: importar do servidor do Atividades sem duplicar e sem mexer no que foi editado aqui

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 12: Projetos — a colaboração no app (menu, faixas, fluxos de ponta a ponta)

**Files:**
- Create: `projetos/src/app/colaboracao/colaboracao.ts`
- Modify: `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-colaboracao-fluxos.ts`

**Interfaces:**
- Consumes: tudo das Tarefas 4 a 11 (`EstadoDaSincronia`, `comConsentimento`, `consentidor`, `consentimentoProjetos`, `nomeDoTexto`, `avisoDaUnidade`, `pedirConsentimentoPessoal`, `faixaConvite`, `faixaAguardando`, `montarSincronizacao`, `abrirModelos`, `abrirHistorico`, `abrirEnviarProjeto`, `abrirReceberProjeto`, `abrirImportarAtividades`, `exportarTudo`, `importarTudo`, `lerEnvelopeArquivo`, `fazerCopiaDoDia`, `restaurarCopia`, `envelopeDoProjeto`, `lerEnvelopeDoProjeto`, `nomeDoArquivoDoProjeto`, `previaDoRecebido`, `receberProjeto`, `LIMITE_ARQUIVO_PROJETO`, `projetosLegados`, `itensParaImportar`, `importarAtividades`, `idDoLegado`); (P3) `ExtensoesMenu`, `carregarUnidade`, `ContextoProjetos`, `plural`; (sei-comum) `avisar`, `Rpc`, `ControleArquivo`, `EntradaMenu`, `AbrirModal`.
- Produces: `GanchosDoApp { readonly aberto: string; abrirProjeto(id): Promise<void>; novoProjetoDeModelo(id): void }`; `DepsColaboracao { ctx; area; sync; repos; rpc; abrirModal; confirmar; baixar; escolherArquivo(); hoje(); agora(); carimbo(); copias; arquivo; app(); aoRedesenhar? }`; `class Colaboracao { provedor; repos; faixas; extensoesMenu; consentirUnidade; iniciar(); destruir(); aoGanharFoco(); abrirSincronizacao(); abrirModelos(); abrirHistorico(); enviarProjeto(); receberProjeto(); importarAtividades() }`. O menu: "Sincronização…", "Modelos de projeto…" (começo); "Enviar projeto por arquivo…", "Receber projeto de arquivo…", "Importar do servidor do Atividades…" (só com servidor) depois de Exportar/Imprimir; "Histórico de alterações" (fim). `iniciar()` lê o estado, pinta as faixas, chama `limpar()` nos dois repositórios, faz a cópia do dia e sincroniza o arquivo ligado.

- [ ] **Step 1: Escrever a prova que falha**

Arquivo completo `projetos/tests/verificar-app-colaboracao-fluxos.ts`:

```ts
/**
 * A colaboração montada como o app usa (colaboracao.ts): os itens do menu, as
 * faixas, o "Entendi" antes de gravar na unidade e os fluxos de ponta a ponta
 * (Sincronização, exportar e importar, enviar e receber, Atividades, Modelos e
 * Histórico) com o RPC, o seletor de arquivo e o download falsos.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { definirConsentimento } from "@comum/sincronia/consentimento";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import type { AbrirModal } from "@comum/ui/dialogo";
import { Colaboracao, type GanchosDoApp } from "../src/app/colaboracao/colaboracao";
import { MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import type { ContextoProjetos } from "../src/ponte/tipos";
import { RepositorioProjetos } from "../src/repositorio";
import { CHAVE_CONSENTIMENTO, chaveDoConsentimento } from "../src/sincronia/consentimento";
import { chaveStatusTexto } from "../src/sincronia/textoPadrao";
import { telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN } from "./apoioRepositorio";
import { HOJE } from "./fabrica";
import { projetoCompleto } from "./legadoAtividades";
import { botao, checar, secao, tique } from "./util";

const AGORA = Date.UTC(2026, 9, 6, 12);

const CTX: ContextoProjetos = {
  host: ESCOPO_UN.host,
  login: "ana",
  nome: "Ana Lima",
  unidade: { id: "110", sigla: "SEPRO", nome: "Serviço de Projetos" },
  versao: "4.1.5",
  temaEscuro: false,
  atividades: true,
};

function montar(o: { atividades?: boolean; area?: ReturnType<typeof areaMemoria>; sincronizado?: unknown } = {}) {
  const doc = telaDoApp();
  const area = o.area ?? areaMemoria();
  const sync = areaMemoria();
  const relogio = { agora: AGORA };
  const carimbo = () => ({ agora: ++relogio.agora, dispositivo: "pc-ana", por: "ana", nome: "Ana Lima" });
  const repos = { unidade: new RepositorioProjetos(area, ESCOPO_UN, carimbo), eu: new RepositorioProjetos(area, ESCOPO_EU, carimbo) };
  const modais: Array<{ titulo: string; conteudo: HTMLElement; aberto: boolean }> = [];
  const abrirModal: AbrirModal = (m) => {
    doc.body.append(m.conteudo);
    const x = { titulo: m.titulo, conteudo: m.conteudo, aberto: true };
    modais.push(x);
    return {
      fechar: () => {
        if (!x.aberto) return;
        x.aberto = false;
        m.conteudo.remove();
        m.aoFechar?.();
      },
    };
  };
  const chamadas: string[] = [];
  const baixados: Array<{ nome: string; conteudo: string }> = [];
  const arquivos: string[] = [];
  const abertos: string[] = [];
  const doModelo: string[] = [];
  const app: GanchosDoApp = {
    aberto: "todos",
    abrirProjeto: async (id) => void abertos.push(id),
    novoProjetoDeModelo: (id) => doModelo.push(id),
  };
  const c = new Colaboracao({
    ctx: { ...CTX, atividades: o.atividades ?? true },
    area,
    sync,
    repos,
    rpc: {
      chamar: async <T>(op: string): Promise<T> => {
        chamadas.push(op);
        if (op === "importarAtividades") return { fonte: "servidor", projetos: [projetoCompleto()] } as T;
        return (o.sincronizado ?? { unidade: { estado: "ok" }, eu: null }) as T;
      },
    },
    abrirModal,
    confirmar: async () => true,
    baixar: (nome, conteudo) => baixados.push({ nome, conteudo }),
    escolherArquivo: async () => arquivos.shift() ?? null,
    hoje: () => HOJE,
    agora: () => AGORA,
    carimbo,
    copias: null,
    arquivo: null,
    app: () => app,
  });
  const ultimo = () => modais.at(-1)!;
  return { c, doc, area, sync, repos, modais, ultimo, chamadas, baixados, arquivos, avisos, abertos, doModelo, app };
}

/** O aviso é um só para a página (o emissor é global): todas as montagens anotam aqui. */
const avisos: string[] = [];

const rotulos = (itens: unknown[]) => itens.map((i) => (i && typeof i === "object" ? (i as { rotulo: string }).rotulo : String(i)));

export async function verificarAppColaboracaoFluxos(): Promise<void> {
  definirEmissorDeAviso((t) => {
    avisos.push(t);
    return true;
  });
  secao("colaboracao: menu ajustes do P4");
  const m = montar();
  await m.c.iniciar();
  const ext = m.c.extensoesMenu;
  checar("Sincronizacao e Modelos no comeco", rotulos(ext.sincronia?.() ?? []).join() === "Sincronização…,Modelos de projeto…");
  checar(
    "Enviar, Receber e Importar do Atividades (com servidor)",
    rotulos((ext.arquivo?.() ?? []).filter(Boolean)).join() ===
      "Enviar projeto por arquivo…,Receber projeto de arquivo…,Importar do servidor do Atividades…",
  );
  checar("Historico de alteracoes no fim", rotulos(ext.fim?.() ?? []).join() === "Histórico de alterações");
  const semServidor = montar({ atividades: false });
  checar(
    "sem servidor do Atividades, o item nao aparece",
    !(semServidor.c.extensoesMenu.arquivo?.() ?? []).filter(Boolean).some((i) => /Atividades/.test(rotulos([i])[0] ?? "")),
  );

  secao("colaboracao: faixas");
  checar("sem projeto 'Só eu': sem convite", m.c.faixas.children.length === 0);
  await m.repos.eu.criarProjeto({ nome: "Meu" });
  await tique(20);
  const convite = m.c.faixas.querySelector("[data-faixa='convite']");
  checar("com projeto 'Só eu' e sem resposta: o convite", !!convite);
  botao(convite!, "Agora não")?.click();
  await tique(20);
  checar(
    "Agora nao: o convite some (nao pergunta de novo)",
    !m.c.faixas.querySelector("[data-faixa='convite']") && m.c.provedor.situacao().eu.consentimento === "desligado",
  );
  await m.area.gravar({ [chaveStatusTexto(ESCOPO_UN)]: { estado: "nunca", quando: AGORA, pendente: false, aguardandoPermissao: true } });
  await tique(20);
  const ag = m.c.faixas.querySelector("[data-faixa='aguardando']");
  checar("alteracoes da unidade esperando: a faixa do Entendi", !!ag);
  botao(ag!, "Entendi")?.click();
  await tique(20);
  checar(
    "Entendi: liga o da unidade e a faixa some",
    m.c.provedor.situacao().unidade.consentimento === "ligado" && !m.c.faixas.querySelector("[data-faixa='aguardando']"),
  );

  secao("colaboracao: o Entendi antes de gravar na unidade");
  const g = montar();
  await g.c.iniciar();
  const criando = g.c.repos.unidade.criarProjeto({ nome: "Da unidade" });
  await tique(5);
  checar("criar na unidade abre o aviso", g.ultimo().titulo === "Projetos de toda a unidade");
  botao(g.ultimo().conteudo, "Entendi")?.click();
  const criado = await criando;
  checar("Entendi: grava", !!(await g.repos.unidade.obterProjeto(criado.id)));
  await g.c.repos.unidade.criarProjeto({ nome: "Outro" });
  checar("depois nao pergunta mais", g.modais.length === 1);
  await g.c.repos.eu.criarProjeto({ nome: "Pessoal" });
  checar("o 'Só eu' nunca pergunta", g.modais.length === 1);

  secao("colaboracao: Sincronizacao, exportar e importar");
  await g.c.abrirSincronizacao();
  checar("abre o dialogo", g.ultimo().titulo === "Sincronização");
  botao(g.ultimo().conteudo, "Sincronizar agora")?.click();
  await tique(10);
  checar("Sincronizar agora pede a aba", g.chamadas.includes("sincronizarAgora") && avisos.includes("Sincronizado."), avisos);
  const expirada = montar({
    sincronizado: {
      unidade: { estado: "erro", quando: 1, pendente: false, mensagem: "Sessão do SEI expirada. Entre de novo no SEI." },
      eu: null,
    },
  });
  await expirada.c.iniciar();
  await expirada.c.abrirSincronizacao();
  botao(expirada.ultimo().conteudo, "Sincronizar agora")?.click();
  await tique(10);
  checar("e, se nao deu certo, o aviso diz o motivo", avisos.at(-1) === "Sessão do SEI expirada. Entre de novo no SEI.", avisos.at(-1));
  expirada.c.destruir();
  botao(g.ultimo().conteudo, "Exportar tudo")?.click();
  await tique(10);
  const exportado = g.baixados.at(-1);
  checar(
    "exportar baixa a copia de tudo",
    /^projetos-seipro-ana-2026-10-06\.json$/.test(exportado?.nome ?? "") && /"tipo": "copia"/.test(exportado?.conteudo ?? ""),
    exportado?.nome,
  );
  const outro = montar();
  await outro.c.iniciar();
  outro.arquivos.push(exportado!.conteudo);
  await outro.c.abrirSincronizacao();
  botao(outro.ultimo().conteudo, "Importar de um arquivo…")?.click();
  await tique(20);
  checar(
    "importar noutro navegador junta tudo",
    (await outro.repos.unidade.dados()).projetos.length === 2 && (await outro.repos.eu.dados()).projetos.length === 1,
    outro.avisos,
  );
  outro.arquivos.push("{ nao e json");
  await outro.c.abrirSincronizacao();
  botao(outro.ultimo().conteudo, "Importar de um arquivo…")?.click();
  await tique(10);
  checar("arquivo que nao e JSON: avisa", outro.avisos.at(-1) === "O arquivo não é um JSON válido.");

  secao("colaboracao: enviar e receber projeto");
  const [pUn] = (await g.repos.unidade.dados()).projetos;
  (g.app as { aberto: string }).aberto = pUn!.id;
  await g.c.enviarProjeto();
  const enviado = g.baixados.at(-1);
  checar(
    "com um projeto aberto: baixa direto",
    /\.seipro-projeto\.json$/.test(enviado?.nome ?? "") && g.avisos.at(-1)?.includes("baixado") === true,
    enviado?.nome,
  );
  (g.app as { aberto: string }).aberto = "todos";
  await g.c.enviarProjeto();
  checar("no Todos: escolher o projeto", g.ultimo().titulo === "Enviar projeto por arquivo");
  const r = montar();
  await r.c.iniciar();
  await definirConsentimento(
    r.sync,
    CHAVE_CONSENTIMENTO,
    "textoPadrao",
    chaveDoConsentimento(ESCOPO_UN.host, "ana", "110", "unidade"),
    "ligado",
  );
  r.arquivos.push(enviado!.conteudo);
  await r.c.receberProjeto();
  checar("receber: a previa", r.ultimo().titulo === "Receber projeto de arquivo" && texto(r.ultimo().conteudo).includes(pUn!.nome));
  botao(r.ultimo().conteudo, "Receber projeto")?.click();
  await tique(20);
  const recebidos = (await r.repos.unidade.dados()).projetos;
  checar(
    "recebido na unidade, com id novo, e o app abre ele",
    recebidos.length === 1 && recebidos[0]?.id !== pUn!.id && r.abertos.at(-1) === recebidos[0]?.id,
    r.abertos,
  );
  r.arquivos.push(exportado!.conteudo);
  await r.c.receberProjeto();
  checar("a copia de tudo no Receber: explica onde importar", /Importar de um arquivo/.test(r.avisos.at(-1) ?? ""));

  secao("colaboracao: importar do Atividades, modelos e historico");
  r.c.importarAtividades();
  await tique(20);
  checar(
    "pede a aba e abre o dialogo",
    r.chamadas.includes("importarAtividades") && r.ultimo().titulo === "Importar do servidor do Atividades",
  );
  botao(r.ultimo().conteudo, "Importar")?.click();
  await tique(30);
  checar(
    "importa na unidade e abre o projeto",
    !!(await r.repos.unidade.obterProjeto("atvp42")) && r.abertos.at(-1) === "atvp42",
    r.avisos,
  );
  await r.c.abrirModelos();
  botao(r.ultimo().conteudo.querySelector(".prj-modelo")!, "Criar projeto")?.click();
  checar("Modelos: Criar projeto pede o Novo projeto no modelo", r.doModelo.at(-1) === MODELOS_EMBUTIDOS[0]!.id);
  await r.c.abrirHistorico();
  const linhas = [...r.ultimo().conteudo.querySelectorAll(".prj-historico-reg")].map((x) => texto(x));
  checar("Historico: os registros (recebido e importado)", linhas.length >= 2 && linhas.some((l) => l.includes("Ana Lima")), linhas);
  definirEmissorDeAviso(null);
  for (const x of [m, semServidor, g, outro, r]) x.c.destruir();
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarAppColaboracaoFluxos } from "./verificar-app-colaboracao-fluxos";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarImportacaoAtividades();
```

por:

```ts
await verificarImportacaoAtividades();
await verificarAppColaboracaoFluxos();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -m1 -E "Error|falha"
```
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/projetos/src/app/colaboracao/colaboracao' imported from …/projetos/tests/verificar-app-colaboracao-fluxos.ts`

- [ ] **Step 3: Implementar**

Arquivo completo `projetos/src/app/colaboracao/colaboracao.ts`:

```ts
/**
 * Sincronia e colaboração no app (P4): o que o `AppProjetos` (P3) recebe pelos
 * pontos de extensão — o estado da sincronia (`provedor`), os itens do menu
 * ajustes (`extensoesMenu`), as faixas (convite do texto pessoal e "Entendi"
 * pendente), o repositório da unidade que pergunta o "Entendi" antes de gravar
 * (`repos`) e a importação do Atividades — e os diálogos de apoio:
 * Sincronização, Modelos, Histórico, Enviar/Receber e Importar. O painel
 * lateral (P5) monta o mesmo objeto.
 *
 * Quem grava no SEI é a aba (content script): daqui saem só os pedidos
 * `sincronizarAgora`, `apagarDoSei` e `importarAtividades` pelo RPC.
 */

import type { Area } from "@comum/armazenamento/area";
import type { DataISO } from "@comum/datas/dias";
import type { Rpc } from "@comum/ponte/rpc";
import type { ControleArquivo } from "@comum/sincronia/arquivo";
import type { PortaConsentimento } from "@comum/sincronia/consentimento";
import type { StatusSync } from "@comum/sincronia/motor";
import { avisar } from "@comum/ui/aviso";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import type { EntradaMenu } from "@comum/ui/menu";
import {
  envelopeDoProjeto,
  LIMITE_ARQUIVO_PROJETO,
  lerEnvelopeDoProjeto,
  nomeDoArquivoDoProjeto,
  previaDoRecebido,
  receberProjeto,
} from "../../arquivo/projetoArquivo";
import { idDoLegado, importarAtividades, itensParaImportar, projetosLegados } from "../../importacao/atividades";
import { escoposDaUnidade } from "../../modelo/escopo";
import type { Carimbo, Entidades, Vis } from "../../modelo/tipos";
import type { ContextoProjetos } from "../../ponte/tipos";
import type { RepositorioProjetos } from "../../repositorio";
import {
  type ArmazemCopiasProjetos,
  type EnvelopeArquivo,
  exportarTudo,
  fazerCopiaDoDia,
  importarTudo,
  lerEnvelopeArquivo,
  restaurarCopia,
} from "../../sincronia/arquivo";
import { consentimentoProjetos } from "../../sincronia/consentimento";
import { nomeDoTexto } from "../../sincronia/textoPadrao";
import type { ExtensoesMenu } from "../componentes/menuAjustes";
import { carregarUnidade } from "../dados";
import { abrirEnviarProjeto, abrirReceberProjeto } from "../dialogos/arquivoProjeto";
import { avisoDaUnidade, faixaAguardando, faixaConvite, pedirConsentimentoPessoal } from "../dialogos/consentimento";
import { abrirHistorico, type NomesDoHistorico, type RegistroNaTela } from "../dialogos/historico";
import { abrirImportarAtividades } from "../dialogos/importar";
import { abrirModelos } from "../dialogos/modelos";
import { montarSincronizacao } from "../dialogos/sincronizacao";
import { plural } from "../formato";
import { comConsentimento, consentidor } from "./consentir";
import { EstadoDaSincronia } from "./estado";

/** O que a aba devolve no `sincronizarAgora` (pagina/sincronia.ts; o app não importa de `src/pagina`). */
interface RespostaSincronizar {
  unidade?: StatusSync;
  eu?: StatusSync | null;
}

/** O que a aba devolve no `importarAtividades` (pagina/atividades.ts). */
interface RespostaAtividades {
  fonte: "servidor" | "cache";
  projetos: unknown[];
  aviso?: string;
}

/** O que o app oferece de volta (o app é criado depois, com o que sai daqui). */
export interface GanchosDoApp {
  /** "todos" ou o id do projeto aberto. */
  readonly aberto: string;
  abrirProjeto(id: string): Promise<void>;
  novoProjetoDeModelo(id: string): void;
}

export interface DepsColaboracao {
  ctx: ContextoProjetos;
  /** chrome.storage.local (dados, status) e chrome.storage.sync (consentimentos). */
  area: Area;
  sync: Area;
  /** Os repositórios dos dois escopos da unidade, sem a pergunta (a pergunta é daqui). */
  repos: Readonly<Record<Vis, RepositorioProjetos>>;
  rpc: Pick<Rpc, "chamar">;
  abrirModal: AbrirModal;
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  /** O texto do arquivo escolhido, ou null se cancelou. */
  escolherArquivo(): Promise<string | null>;
  hoje(): DataISO;
  agora(): number;
  carimbo(): Carimbo;
  /** Cópias diárias (IndexedDB `seipro-projetos`); null sem banco. */
  copias: ArmazemCopiasProjetos | null;
  /** O arquivo ligado (File System Access); null onde o navegador não deixa. */
  arquivo: ControleArquivo<EnvelopeArquivo> | null;
  app(): GanchosDoApp | null;
  /** A altura do painel mudou (faixa entrou ou saiu). */
  aoRedesenhar?: () => void;
}

/** A cópia de tudo (todas as unidades) pode crescer; acima disto não é um arquivo de projetos. */
const LIMITE_COPIA = 50 * 1024 * 1024;

const mensagem = (e: unknown): string => {
  const m = (e as { mensagens?: unknown })?.mensagens;
  return Array.isArray(m) && m.length ? m.map(String).join(" ") : e instanceof Error ? e.message : String(e);
};

export class Colaboracao {
  readonly provedor: EstadoDaSincronia;
  /** O da unidade pergunta o "Entendi" antes de gravar; o "Só eu" é o mesmo. */
  readonly repos: Readonly<Record<Vis, RepositorioProjetos>>;
  readonly faixas: HTMLElement = h("div", { class: "prj-faixas" });
  readonly extensoesMenu: ExtensoesMenu;
  readonly consentirUnidade: () => Promise<boolean>;
  private readonly portas: Record<Vis, PortaConsentimento>;
  private paradas: Array<() => void> = [];
  private readonly sigla: string;

  constructor(private readonly d: DepsColaboracao) {
    const u = d.ctx.unidade;
    if (!u) throw new Error("Sem unidade: a sincronia dos projetos precisa de uma unidade do SEI.");
    this.sigla = u.sigla || "unidade";
    const esc = escoposDaUnidade(d.ctx.host, d.ctx.login, u.id);
    this.provedor = new EstadoDaSincronia({ area: d.area, sync: d.sync, escopos: esc, agora: d.agora });
    this.portas = {
      unidade: consentimentoProjetos(d.sync, d.ctx.host, d.ctx.login, u.id, "unidade"),
      eu: consentimentoProjetos(d.sync, d.ctx.host, d.ctx.login, u.id, "eu"),
    };
    this.consentirUnidade = consentidor(this.portas.unidade, () =>
      avisoDaUnidade({ abrirModal: d.abrirModal, sigla: this.sigla, nomeTexto: nomeDoTexto("unidade", d.ctx.login) }),
    );
    this.repos = { unidade: comConsentimento(d.repos.unidade, this.consentirUnidade), eu: d.repos.eu };
    this.extensoesMenu = {
      sincronia: (): EntradaMenu[] => [
        { rotulo: "Sincronização…", icone: "nuvem", fazer: () => void this.abrirSincronizacao() },
        { rotulo: "Modelos de projeto…", icone: "camadas", fazer: () => void this.abrirModelos() },
      ],
      arquivo: (): EntradaMenu[] => [
        { rotulo: "Enviar projeto por arquivo…", icone: "baixar", fazer: () => void this.enviarProjeto() },
        { rotulo: "Receber projeto de arquivo…", icone: "subir", fazer: () => void this.receberProjeto() },
        d.ctx.atividades
          ? { rotulo: "Importar do servidor do Atividades…", icone: "atualizar", fazer: () => this.importarAtividades() }
          : null,
      ],
      fim: (): EntradaMenu[] => [{ rotulo: "Histórico de alterações", icone: "historico", fazer: () => void this.abrirHistorico() }],
    };
  }

  private get dono() {
    return { host: this.d.ctx.host, login: this.d.ctx.login };
  }

  async iniciar(): Promise<void> {
    await this.provedor.iniciar();
    const repintar = () => void this.pintarFaixas().catch(() => undefined);
    this.paradas.push(
      this.provedor.aoMudar(repintar),
      this.d.repos.eu.aoMudar(repintar),
      this.d.repos.unidade.aoMudar(() => this.d.arquivo?.agendar()),
      this.d.repos.eu.aoMudar(() => this.d.arquivo?.agendar()),
    );
    await this.pintarFaixas();
    // Lápides velhas (180 dias na unidade, 90 no "Só eu") e o histórico além de 300 saem deste navegador.
    for (const r of Object.values(this.d.repos)) void r.limpar(this.d.agora()).catch(() => undefined);
    if (this.d.copias)
      void fazerCopiaDoDia(this.d.area, this.dono, this.d.copias, this.d.hoje(), () => this.d.carimbo()).catch((e) =>
        console.warn("[SEI Pro] projetos: cópia do dia não foi feita", e),
      );
    void this.d.arquivo?.sincronizar().catch(() => undefined);
  }

  destruir(): void {
    for (const p of this.paradas.splice(0)) p();
    this.provedor.parar();
    this.d.arquivo?.parar();
  }

  /** O app voltou a ficar visível: o arquivo pode ter sido mudado por outro computador. */
  aoGanharFoco(): void {
    void this.d.arquivo?.sincronizar().catch(() => undefined);
  }

  /** Convite do pessoal (com projeto "Só eu" e sem resposta) e o "Entendi" que falta (alterações esperando). */
  private async pintarFaixas(): Promise<void> {
    const s = this.provedor.situacao();
    const faixas: HTMLElement[] = [];
    if (s.unidade.status?.aguardandoPermissao && s.unidade.consentimento !== "ligado") {
      faixas.push(faixaAguardando({ sigla: this.sigla, aoEntendi: () => void this.portas.unidade.definir("ligado") }));
    }
    if (s.eu.consentimento === "nao-perguntado" && (await this.d.repos.eu.dados()).projetos.length > 0) {
      faixas.push(
        faixaConvite({
          aoLigar: () => void this.ligarPessoal(),
          aoRecusar: () => void this.portas.eu.definir("desligado"),
        }),
      );
    }
    this.faixas.replaceChildren(...faixas);
    this.d.aoRedesenhar?.();
  }

  private async ligarPessoal(): Promise<boolean> {
    const sim = await pedirConsentimentoPessoal({
      abrirModal: this.d.abrirModal,
      sigla: this.sigla,
      nomeTexto: nomeDoTexto("eu", this.d.ctx.login),
    });
    if (sim) await this.portas.eu.definir("ligado");
    return sim;
  }

  private async pedirAba(op: string, aviso: string): Promise<void> {
    try {
      await this.d.rpc.chamar(op, undefined, 120_000);
      avisar(aviso);
    } catch (e) {
      avisar(mensagem(e));
    }
  }

  /** O JSON do arquivo escolhido, com teto de tamanho (null: cancelou, grande demais ou ilegível, já avisado). */
  private async lerArquivo(limite: number): Promise<unknown | null> {
    const texto = await this.d.escolherArquivo();
    if (texto === null) return null;
    if (texto.length > limite) {
      avisar(`O arquivo passa de ${Math.round(limite / 1024 / 1024)} MB: não é um arquivo de projetos do SEI Pro.`);
      return null;
    }
    try {
      return JSON.parse(texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto);
    } catch {
      avisar("O arquivo não é um JSON válido.");
      return null;
    }
  }

  async abrirSincronizacao(): Promise<void> {
    let modal: { fechar(): void } | null = null;
    const a = this.d.arquivo;
    const conteudo = await montarSincronizacao({
      sigla: this.sigla,
      agora: this.d.agora,
      situacao: () => this.provedor.ler(),
      sincronizar: async () => {
        try {
          const r = await this.d.rpc.chamar<RespostaSincronizar | null>("sincronizarAgora", undefined, 120_000);
          // O resultado de cada texto: o primeiro que não deu certo explica; senão, "Sincronizado.".
          const ruim = [r?.unidade, r?.eu].find((s) => s && (s.estado === "erro" || s.estado === "indisponivel"));
          avisar(ruim ? (ruim.mensagem ?? "Não foi possível sincronizar agora.") : "Sincronizado.");
        } catch (e) {
          avisar(mensagem(e));
        }
      },
      pessoal: {
        ligar: () => this.ligarPessoal(),
        desligar: async () => {
          await this.portas.eu.definir("desligado");
          avisar("Texto pessoal desligado. Ele continua no SEI até você apagá-lo.");
        },
        apagar: () => this.pedirAba("apagarDoSei", "Texto pessoal apagado do SEI e sincronização desligada."),
      },
      arquivo: a
        ? {
            status: () => a.status(),
            configurado: () => a.configurado(),
            escolher: async (modo) => {
              try {
                await a.escolher(modo);
              } catch (e) {
                // Seletor cancelado não é erro; o resto (iframe sem permissão de seletor) vira aviso.
                if ((e as { name?: string }).name !== "AbortError") avisar(mensagem(e));
              }
            },
            reconectar: async () => void (await a.reconectar()),
            agora: async () => void (await a.sincronizar()),
            esquecer: () => a.esquecer(),
          }
        : null,
      exportar: async () => {
        const env = await exportarTudo(this.d.area, this.dono, () => this.d.carimbo());
        this.d.baixar(`projetos-seipro-${this.d.ctx.login}-${this.d.hoje()}.json`, JSON.stringify(env, null, 2), "application/json");
      },
      importar: async () => {
        const bruto = await this.lerArquivo(LIMITE_COPIA);
        if (bruto === null) return;
        const env = lerEnvelopeArquivo(bruto);
        if (!env) {
          avisar(
            lerEnvelopeDoProjeto(bruto)
              ? "Este arquivo é de um projeto enviado: use “Receber projeto de arquivo…” no menu."
              : "Este arquivo não é uma cópia dos projetos do SEI Pro.",
          );
          return;
        }
        const r = await importarTudo(this.d.area, env, this.dono, () => this.d.carimbo());
        modal?.fechar();
        avisar(`${plural(r.novos + r.atualizados, "item importado", "itens importados")}.`);
      },
      copias: this.d.copias
        ? {
            listar: () => this.d.copias!.listar(this.dono),
            restaurar: async (c) => {
              const n = await restaurarCopia(this.d.area, c, this.dono, () => this.d.carimbo());
              modal?.fechar();
              avisar(`${plural(n, "item restaurado", "itens restaurados")}.`);
            },
          }
        : null,
      baixar: this.d.baixar,
      confirmar: this.d.confirmar,
    });
    modal = this.d.abrirModal({ titulo: "Sincronização", icone: "nuvem", conteudo });
  }

  async abrirModelos(): Promise<void> {
    const dados = await carregarUnidade(this.d.repos, this.d.hoje());
    abrirModelos({
      abrirModal: this.d.abrirModal,
      modelos: dados.modelos,
      confirmar: this.d.confirmar,
      renomear: (m, nome) => this.repos[m.vis ?? "eu"].renomearModelo(m.id, nome),
      excluir: (m) => this.repos[m.vis ?? "eu"].removerModelo(m.id),
      criarProjeto: (m) => this.d.app()?.novoProjetoDeModelo(m.id),
    });
  }

  async abrirHistorico(): Promise<void> {
    const dados = await carregarUnidade(this.d.repos, this.d.hoje());
    const projetos = [...dados.ativos, ...dados.arquivados].map((p) => ({ id: p.projeto.id, nome: p.projeto.nome }));
    const todas: Record<Vis, Entidades> = { unidade: await this.d.repos.unidade.entidades(), eu: await this.d.repos.eu.entidades() };
    const alvos = new Map<string, { tipo: "projeto" | "fase" | "etapa"; nome: string }>();
    for (const ent of Object.values(todas)) {
      for (const p of ent.p) alvos.set(p.id, { tipo: "projeto", nome: p.nome });
      for (const f of ent.f) alvos.set(f.id, { tipo: "fase", nome: f.nome });
      for (const e of ent.e) alvos.set(e.id, { tipo: "etapa", nome: e.nome });
    }
    const nomes: NomesDoHistorico = { alvo: (id) => alvos.get(id) };
    const aberto = this.d.app()?.aberto;
    await abrirHistorico({
      abrirModal: this.d.abrirModal,
      projetos,
      nomes,
      projeto: aberto && aberto !== "todos" ? aberto : undefined,
      registros: async () => {
        const de = async (vis: Vis): Promise<RegistroNaTela[]> => (await this.d.repos[vis].historico()).map((r) => ({ ...r, vis }));
        return [...(await de("unidade")), ...(await de("eu"))];
      },
    });
  }

  async enviarProjeto(): Promise<void> {
    const dados = await carregarUnidade(this.d.repos, this.d.hoje());
    const baixar = (p: (typeof dados.ativos)[number]) => {
      const nome = nomeDoArquivoDoProjeto(p.projeto.nome);
      this.d.baixar(nome, JSON.stringify(envelopeDoProjeto(p, this.d.agora()), null, 2), "application/json");
      avisar(`Arquivo “${nome}” baixado. Envie para quem vai receber o projeto.`);
    };
    const aberto = this.d.app()?.aberto;
    const atual = dados.ativos.find((p) => p.projeto.id === aberto);
    if (atual) return baixar(atual);
    if (!dados.ativos.length) {
      avisar("Não há projeto para enviar.");
      return;
    }
    abrirEnviarProjeto({ abrirModal: this.d.abrirModal, projetos: dados.ativos, enviar: baixar });
  }

  async receberProjeto(): Promise<void> {
    const bruto = await this.lerArquivo(LIMITE_ARQUIVO_PROJETO);
    if (bruto === null) return;
    const env = lerEnvelopeDoProjeto(bruto);
    if (!env) {
      avisar(
        lerEnvelopeArquivo(bruto)
          ? "Este arquivo é uma cópia de todos os projetos: use “Importar de um arquivo…” em Sincronização."
          : "Este arquivo não é um projeto enviado pelo SEI Pro.",
      );
      return;
    }
    abrirReceberProjeto({
      abrirModal: this.d.abrirModal,
      sigla: this.sigla,
      previa: previaDoRecebido(env),
      receber: async (vis) => {
        const p = await receberProjeto(this.repos[vis], env);
        await this.d.app()?.abrirProjeto(p.id);
        avisar(`Projeto “${p.nome}” recebido.`);
      },
    });
  }

  /** "Importar do servidor do Atividades…" (menu e primeiro uso): a aba busca, o diálogo escolhe, o app grava. */
  importarAtividades(): void {
    void (async () => {
      let r: RespostaAtividades;
      try {
        r = await this.d.rpc.chamar<RespostaAtividades>("importarAtividades", undefined, 120_000);
      } catch (e) {
        avisar(mensagem(e));
        return;
      }
      const lista = projetosLegados(r.projetos);
      const ja = new Set<number>();
      for (const vis of ["unidade", "eu"] as const)
        for (const p of (await this.d.repos[vis].entidades()).p)
          if (p.origem?.atividades !== undefined && p.removidoEm === undefined) ja.add(p.origem.atividades);
      abrirImportarAtividades({
        abrirModal: this.d.abrirModal,
        sigla: this.sigla,
        itens: itensParaImportar(lista, this.d.agora()),
        jaImportados: ja,
        avisoCache: r.fonte === "cache" ? (r.aviso ?? "sem resposta") : undefined,
        importar: async (ids, vis) => {
          const escolhidos = lista.filter((l) => ids.includes(l.id_projeto));
          const res = await importarAtividades(this.repos, escolhidos, vis, this.d.hoje());
          const partes = [
            res.novos ? plural(res.novos, "projeto importado", "projetos importados") : "",
            res.atualizados ? plural(res.atualizados, "atualizado", "atualizados") : "",
            res.iguais ? plural(res.iguais, "já estava em dia", "já estavam em dia") : "",
          ].filter(Boolean);
          avisar(`${partes.join(", ") || "Nada a importar"}.`);
          const primeiro = escolhidos[0];
          if (res.novos && primeiro) await this.d.app()?.abrirProjeto(idDoLegado.projeto(primeiro.id_projeto));
        },
      });
    })();
  }
}
```

- [ ] **Step 4: Rodar as provas**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2
```
Expected: `1219 ok, 0 falha(s)` (+28).

- [ ] **Step 5: Portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npm run tipos && npx biome check src tests
```
Expected: sem saída do `tsc`; Biome sem erro.

- [ ] **Step 6: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/colaboracao/colaboracao.ts \
  projetos/tests/verificar-app-colaboracao-fluxos.ts \
  projetos/tests/verificar.ts
git commit -m "$(cat <<'EOF'
Projetos: colaboracao no app com o menu, as faixas e os dialogos de apoio

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

### Task 13: Projetos — ligar tudo no app e no content script, e as saídas em `dist/`

**Files:**
- Create: `projetos/src/pagina/armazem.ts`
- Modify: `projetos/src/app/app.ts`, `projetos/src/app/main.ts`, `projetos/src/pagina/executor.ts`, `projetos/src/pagina/main.ts`, `projetos/tests/verificar.ts`
- Test: `projetos/tests/verificar-app-p4.ts`, `projetos/tests/pagina/verificar-executor-p4.ts`
- Regerados: `dist/js/init_projetos.js`, `dist/js/projetos/app.js`, `dist/css/projetos.css`

**Interfaces:**
- Consumes: `Colaboracao` (Tarefa 12), `SincroniaPagina`, `ResultadoSincronizar` (Tarefa 5), `projetosDoAtividades`, `ProjetosDoAtividades` (Tarefa 11), `controleArquivo`, `copiasDosProjetos` (Tarefa 6), `nomeDoTexto`, `descricaoDoTexto` (Tarefa 4), `criarArmazemTextoPadrao` com `gravarConferindo`, `linkDoMenu` e `SeiDoTexto` (Tarefa 2), `criarHttp`, `paginaDe`, `ocultarTextosInternos`, `travarComLocks`, `travarEsperando`, `temSeletorDeArquivo`, `escolherArquivo` (sei-comum); do P3 `AppProjetos`, `DepsApp`, `tratadoresProjetos`, `DepsExecutor`, `principal()`.
- Produces: `DepsApp.faixas?: HTMLElement` (montado no topo do `.prj`, antes das abas); `AppProjetos.novoProjetoDeModelo(id)`, `AppProjetos.abrirProjeto(id): Promise<void>`; `DepsExecutor.sincronia?`, `DepsExecutor.atividades?`; tratadores `sincronizarAgora`, `apagarDoSei` (só o pessoal), `importarAtividades` (erros `SEM_SINCRONIA`, `SEM_ATIVIDADES`); `armazemDoTexto(doc, url, vis, login): ArmazemTexto` (o armazém do núcleo com `{ http, linkMenu }`, sem a classe `Sei`: a prova do P3 proíbe `new Sei(` em `src/pagina` e o portão do build recusa a árvore no pacote); no content script, `ligarSincronia(ctx, unidade, area, repos)` (os repositórios que o P3 já monta; lê ao abrir o Controle de Processos, puxa ao focar) e `ocultarTextosInternos` em todo frame.

- [ ] **Step 1: Escrever as provas que falham**

Arquivo completo `projetos/tests/verificar-app-p4.ts`:

```ts
/**
 * O app do painel com a colaboração ligada, como o main.ts monta (P4): os
 * itens do menu ajustes no lugar da spec, as faixas acima das abas, o estado da
 * sincronia, o "Novo projeto" já no modelo e o "Entendi" antes de criar um
 * projeto de toda a unidade.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import type { AbrirModal } from "@comum/ui/dialogo";
import { AppProjetos } from "../src/app/app";
import { Colaboracao } from "../src/app/colaboracao/colaboracao";
import { MODELOS_EMBUTIDOS } from "../src/modelos/embutidos";
import type { ContextoProjetos } from "../src/ponte/tipos";
import { chaveStatusTexto } from "../src/sincronia/textoPadrao";
import { digitar, itensDoMenu, telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
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
  atividades: true,
};
const AGORA = new Date(2026, 9, 6, 15).getTime();

export async function verificarAppP4(): Promise<void> {
  secao("app com a colaboracao: menu, faixas e estado");
  const doc = telaDoApp();
  definirEmissorDeAviso(() => true);
  const area = areaMemoria();
  const sync = areaMemoria();
  const { repo: un } = novoRepo(ESCOPO_UN, area, "u");
  const { repo: eu } = novoRepo(ESCOPO_EU, area, "e");
  await eu.criarProjeto({ nome: "Plano 2027" });
  const modais: Array<{ titulo: string; conteudo: HTMLElement }> = [];
  const abrirModal: AbrirModal = (m) => {
    doc.body.append(m.conteudo);
    modais.push({ titulo: m.titulo, conteudo: m.conteudo });
    return {
      fechar: () => {
        m.conteudo.remove();
        m.aoFechar?.();
      },
    };
  };
  const rpc = { chamar: async <T>(): Promise<T> => [] as T };
  let app: AppProjetos | null = null;
  const colab = new Colaboracao({
    ctx: CTX,
    area,
    sync,
    repos: { unidade: un, eu },
    rpc,
    abrirModal,
    confirmar: async () => true,
    baixar: () => undefined,
    escolherArquivo: async () => null,
    hoje: () => HOJE,
    agora: () => AGORA,
    carimbo: () => ({ agora: AGORA, dispositivo: "pc", por: "ana", nome: "Ana Lima" }),
    copias: null,
    arquivo: null,
    app: () => app,
  });
  app = new AppProjetos({
    raiz: doc.getElementById("app")!,
    ctx: CTX,
    area,
    repos: colab.repos,
    rpc,
    abrirModal,
    confirmar: async () => true,
    baixar: () => undefined,
    hoje: () => HOJE,
    agora: () => AGORA,
    montarGantt: ganttFalso().montar,
    largura: () => 1000,
    sincronia: colab.provedor,
    extensoesMenu: colab.extensoesMenu,
    importarAtividades: () => colab.importarAtividades(),
    faixas: colab.faixas,
  });
  await colab.iniciar();
  await app.iniciar();
  const raiz = doc.getElementById("app")!;
  const itens = itensDoMenu(raiz, "Ajustes dos projetos");
  checar(
    "o menu ajustes tem os itens do P4 no lugar da spec",
    itens[0] === "Sincronização…" &&
      itens[1] === "Modelos de projeto…" &&
      itens.includes("Enviar projeto por arquivo…") &&
      itens.includes("Receber projeto de arquivo…") &&
      itens.includes("Importar do servidor do Atividades…") &&
      itens.at(-1) === "Histórico de alterações",
    itens,
  );
  checar(
    "a faixa-convite (ha projeto 'Só eu') aparece acima das abas",
    raiz.querySelector(".prj > .prj-faixas [data-faixa='convite']") !== null,
  );
  await area.gravar({ [chaveStatusTexto(ESCOPO_UN)]: { estado: "ok", quando: AGORA, ultimoOk: AGORA, pendente: true } });
  await tique(40);
  checar(
    "o estado da sincronia ao lado das abas",
    texto(raiz.querySelector(".prj-sinc")) === "pendente",
    texto(raiz.querySelector(".prj-sinc")),
  );

  secao("app com a colaboracao: o Novo projeto no modelo e o Entendi ao criar na unidade");
  app.novoProjetoDeModelo(MODELOS_EMBUTIDOS[1]!.id);
  await tique(10);
  const dlg = modais.at(-1)!;
  checar(
    "abre o Novo projeto ja em 'De um modelo', com o modelo escolhido",
    dlg.titulo === "Novo projeto" && texto(dlg.conteudo).includes(MODELOS_EMBUTIDOS[1]!.nome),
  );
  digitar(dlg.conteudo.querySelector("input[name='nome']"), "Pregão de notebooks");
  botao(dlg.conteudo, "Criar projeto")?.click();
  await tique(20);
  checar("criar em 'Toda a unidade' pede o Entendi antes", modais.at(-1)?.titulo === "Projetos de toda a unidade");
  botao(modais.at(-1)!.conteudo, "Entendi")?.click();
  await tique(60);
  const criados = (await un.dados()).projetos;
  checar("depois do Entendi, o projeto e criado e aberto", criados.length === 1 && app.aberto === criados[0]?.id, {
    n: criados.length,
    aberto: app.aberto,
  });
  await app.abrirProjeto("nao-existe");
  checar("abrirProjeto de um id que nao esta ativo nao muda a aba", app.aberto === criados[0]?.id);
  app.destruir();
  colab.destruir();
  definirEmissorDeAviso(null);
}
```

Arquivo completo `projetos/tests/pagina/verificar-executor-p4.ts`:

```ts
/** Os pedidos do P4 que o app faz à aba (pagina/executor.ts): sincronizar agora, apagar o pessoal e o Atividades. */

import { armazemDoTexto } from "../../src/pagina/armazem";
import { tratadoresProjetos } from "../../src/pagina/executor";
import type { ContextoProjetos } from "../../src/ponte/tipos";
import { checar, instalarDom, lanca, secao } from "../util";

const CTX: ContextoProjetos = {
  host: "sei.x.gov.br",
  login: "ana",
  nome: "Ana",
  unidade: { id: "110", sigla: "TESTE", nome: "Teste" },
  versao: "4.1.5",
  temaEscuro: false,
  atividades: true,
};

export async function verificarExecutorP4(): Promise<void> {
  secao("pagina: os pedidos do P4 ao executor");
  const doc = instalarDom();
  const feitos: string[] = [];
  const base = { doc, ctx: CTX, iframe: null, usuarios: async () => [], conferir: async () => null };
  const t = tratadoresProjetos({
    ...base,
    sincronia: {
      agora: async () => {
        feitos.push("agora");
        return { unidade: { estado: "ok", quando: 1, pendente: false }, eu: null };
      },
      apagarPessoal: async () => {
        feitos.push("apagar");
        return true;
      },
    },
    atividades: async () => {
      feitos.push("atividades");
      return { fonte: "servidor", projetos: [] };
    },
  });
  await t.sincronizarAgora?.(undefined);
  await t.apagarDoSei?.(undefined);
  await t.importarAtividades?.(undefined);
  checar("cada pedido chega a quem faz", feitos.join() === "agora,apagar,atividades", feitos);
  const sem = tratadoresProjetos(base);
  const e1 = await lanca(() => sem.sincronizarAgora?.(undefined));
  const e2 = await lanca(() => sem.apagarDoSei?.(undefined));
  const e3 = await lanca(() => sem.importarAtividades?.(undefined));
  checar(
    "sem sincronia ou sem servidor: erro claro (o app mostra)",
    e1?.codigo === "SEM_SINCRONIA" && e2?.codigo === "SEM_SINCRONIA" && e3?.codigo === "SEM_ATIVIDADES",
    [e1, e2, e3],
  );
  const armazem = armazemDoTexto(doc, "https://sei.x.gov.br/sei/controlador.php?acao=procedimento_controlar", "unidade", "ana");
  checar(
    "o armazem do Texto Padrao da aba confere na gravacao (e exclui, para o apagar do pessoal)",
    typeof armazem.gravarConferindo === "function" && typeof armazem.excluir === "function" && typeof armazem.localizar === "function",
  );
}
```

Em `projetos/tests/verificar.ts`, troque:

```ts
import { resumo } from "./util";
```

por:

```ts
import { resumo } from "./util";
import { verificarAppP4 } from "./verificar-app-p4";
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await verificarAppColaboracaoFluxos();
```

por:

```ts
await verificarAppColaboracaoFluxos();
await verificarAppP4();
```

Em `projetos/tests/verificar.ts`, troque:

```ts
await ((await import(suiteAtividadesPagina)) as { verificarAtividadesPagina(): Promise<void> }).verificarAtividadesPagina();
```

por:

```ts
await ((await import(suiteAtividadesPagina)) as { verificarAtividadesPagina(): Promise<void> }).verificarAtividadesPagina();
const suiteExecutorP4 = "./pagina/verificar-executor-p4";
await ((await import(suiteExecutorP4)) as { verificarExecutorP4(): Promise<void> }).verificarExecutorP4();
```

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx biome check --write tests/verificar.ts
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | grep -E "FALHA|TypeError" | head -4
```
Expected:
```
  FALHA a faixa-convite (ha projeto 'Só eu') aparece acima das abas
TypeError: app.novoProjetoDeModelo is not a function
```

- [ ] **Step 3: O app recebe as faixas e oferece o "Novo projeto no modelo" e o "abrir projeto"**

As âncoras dos "troque" desta tarefa são do código do P3 em `8f75b79`. Antes de aplicar, confira se a Tarefa 14 ou a revisão final do P3 mexeram nesses trechos:

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git diff --stat 8f75b79 -- projetos/src/app/app.ts projetos/src/app/main.ts projetos/src/pagina/main.ts projetos/src/pagina/executor.ts
```
Expected: nada, ou só linhas fora dos trechos citados abaixo (se um "troque" não achar o texto, a mudança dele é a mesma no trecho que o P3 reescreveu).

Em `projetos/src/app/app.ts`, troque:

```ts
  extensoesMenu?: ExtensoesMenu;
  /** P4: "Importar meus projetos do servidor do Atividades" no primeiro uso. */
  importarAtividades?: () => void;
  aoRedesenhar?: () => void;
  /** Largura útil para as abas (sem medida: 3 abas). */
  largura?: () => number;
```

por:

```ts
  extensoesMenu?: ExtensoesMenu;
  /** P4: "Importar meus projetos do servidor do Atividades" no primeiro uso. */
  importarAtividades?: () => void;
  /** P4: faixas acima das abas (convite do texto pessoal, "Entendi" que falta). */
  faixas?: HTMLElement;
  aoRedesenhar?: () => void;
  /** Largura útil para as abas (sem medida: 3 abas). */
  largura?: () => number;
```

Em `projetos/src/app/app.ts`, troque:

```ts
    this.paradas.push((this.d.sincronia ?? SEM_SINCRONIA).aoMudar(() => this.render()));
    // O painel fica aberto de um dia para o outro: hoje, atrasos e a linha do Gantt mudam à meia-noite.
    this.relogio = setInterval(() => this.conferirDia(), this.d.conferirDiaMs ?? 60_000);
    this.d.raiz.replaceChildren(h("div", { class: "prj" }, this.slotTopo, this.cartao, this.slotVazio));
    this.render();
  }

```

por:

```ts
    this.paradas.push((this.d.sincronia ?? SEM_SINCRONIA).aoMudar(() => this.render()));
    // O painel fica aberto de um dia para o outro: hoje, atrasos e a linha do Gantt mudam à meia-noite.
    this.relogio = setInterval(() => this.conferirDia(), this.d.conferirDiaMs ?? 60_000);
    this.d.raiz.replaceChildren(h("div", { class: "prj" }, this.d.faixas ?? null, this.slotTopo, this.cartao, this.slotVazio));
    this.render();
  }

```

Em `projetos/src/app/app.ts`, troque:

```ts
    this.render();
  }

  /** "Abrir no painel" (P5: caixa, árvore, lateral): o projeto e, se vier, o balão da etapa. */
  focarProjeto(id: string, etapa?: string): boolean {
    const p = this.dados.ativos.find((x) => x.projeto.id === id);
```

por:

```ts
    this.render();
  }

  /** P4 (diálogo Modelos de projeto): o "Novo projeto" já no modelo escolhido. */
  novoProjetoDeModelo(id: string): void {
    this.novoProjeto(true, id);
  }

  /** P4 (receber, importar): relê (a gravação acabou de acontecer) e abre o projeto, se ele está ativo. */
  async abrirProjeto(id: string): Promise<void> {
    await this.recarregar();
    if (this.dados.ativos.some((p) => p.projeto.id === id)) this.escolher(id);
    else this.render();
  }

  /** "Abrir no painel" (P5: caixa, árvore, lateral): o projeto e, se vier, o balão da etapa. */
  focarProjeto(id: string, etapa?: string): boolean {
    const p = this.dados.ativos.find((x) => x.projeto.id === id);
```

Em `projetos/src/app/app.ts`, troque:

```ts
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
```

por:

```ts
    return this.d.ctx.unidade?.sigla || "unidade";
  }

  /** `modeloId` (P4, diálogo Modelos): já em "De um modelo", com ele escolhido (o primeiro da lista). */
  private novoProjeto(deModelo: boolean, modeloId?: string): void {
    const modelos = modeloId
      ? [...this.dados.modelos].sort((a, b) => Number(b.id === modeloId) - Number(a.id === modeloId))
      : this.dados.modelos;
    abrirDialogoProjeto({
      abrirModal: this.d.abrirModal,
      hoje: this.d.hoje(),
      sigla: this.sigla(),
      modelos,
      comecarDeModelo: deModelo || modeloId !== undefined,
      processos: () => this.processos(),
      salvar: async (r) => {
        const repo = this.repoDe(r.vis);
```

- [ ] **Step 4: O main.ts do app monta a Colaboracao e passa ao AppProjetos**

Em `projetos/src/app/main.ts`, troque:

```ts
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
import { esperarConexaoDaAba } from "@comum/ponte/conexaoDaAba";
import type { Rpc } from "@comum/ponte/rpc";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import { baixar, criarAbrirModal, criarConfirmar } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { definirJanelaQueCresce } from "@comum/ui/flutuante";
import { escoposDaUnidade } from "../modelo/escopo";
import { CANAL_PROJETOS, type ContextoProjetos } from "../ponte/tipos";
import { RepositorioProjetos } from "../repositorio";
import { AppProjetos } from "./app";
import { hashDaImpressao, lerImpressao, montarImpressao } from "./impressao";
import { pedidosDaAba } from "./pedidos";

```

por:

```ts
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
import { esperarConexaoDaAba } from "@comum/ponte/conexaoDaAba";
import type { Rpc } from "@comum/ponte/rpc";
import { temSeletorDeArquivo } from "@comum/sincronia/arquivo";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import { baixar, criarAbrirModal, criarConfirmar, escolherArquivo } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { definirJanelaQueCresce } from "@comum/ui/flutuante";
import { escoposDaUnidade } from "../modelo/escopo";
import { CANAL_PROJETOS, type ContextoProjetos } from "../ponte/tipos";
import { RepositorioProjetos } from "../repositorio";
import { controleArquivo, copiasDosProjetos } from "../sincronia/arquivo";
import { AppProjetos } from "./app";
import { Colaboracao } from "./colaboracao/colaboracao";
import { hashDaImpressao, lerImpressao, montarImpressao } from "./impressao";
import { pedidosDaAba } from "./pedidos";

```

Em `projetos/src/app/main.ts`, troque:

```ts
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
  pedidos.pronto(app);
  let espera: ReturnType<typeof setTimeout> | undefined;
  addEventListener("resize", () => {
```

por:

```ts
  const carimbo = () => ({ agora: Date.now(), dispositivo, por: ctx.login, nome: ctx.nome });
  const esc = escoposDaUnidade(ctx.host, ctx.login, unidade.id);
  const abrirModal = criarAbrirModal({ aoAbrir: sobrepor.abrir, aoFechar: sobrepor.fechar });
  const confirmar = criarConfirmar(abrirModal);
  // P4: a sincronia e a colaboração. O app recebe o repositório da unidade que pergunta o "Entendi".
  let app: AppProjetos | null = null;
  const colab = new Colaboracao({
    ctx,
    area,
    sync: areaChrome(chrome.storage.sync, "sync"),
    repos: { unidade: new RepositorioProjetos(area, esc.unidade, carimbo), eu: new RepositorioProjetos(area, esc.eu, carimbo) },
    rpc,
    abrirModal,
    confirmar,
    baixar,
    escolherArquivo: () => escolherArquivo(),
    hoje: () => hojeISO(),
    agora: () => Date.now(),
    carimbo,
    copias: typeof indexedDB === "undefined" ? null : copiasDosProjetos(),
    arquivo: temSeletorDeArquivo(window) ? controleArquivo(area, { host: ctx.host, login: ctx.login }, carimbo) : null,
    app: () => app,
    aoRedesenhar: () => altura.medir(),
  });
  app = new AppProjetos({
    raiz,
    ctx,
    area,
    repos: colab.repos,
    rpc,
    abrirModal,
    confirmar,
    baixar,
    hoje: () => hojeISO(),
    agora: () => Date.now(),
    imprimir: (p) => void window.open(chrome.runtime.getURL(`html/projetos.html${hashDaImpressao(p)}`), "_blank"),
    aoRedesenhar: () => altura.medir(),
    sincronia: colab.provedor,
    extensoesMenu: colab.extensoesMenu,
    importarAtividades: () => colab.importarAtividades(),
    faixas: colab.faixas,
  });
  await colab.iniciar();
  await app.iniciar();
  addEventListener("focus", () => colab.aoGanharFoco());
  pedidos.pronto(app);
  let espera: ReturnType<typeof setTimeout> | undefined;
  addEventListener("resize", () => {
```

- [ ] **Step 5: A aba atende os pedidos do P4 e liga a sincronia**

Arquivo completo `projetos/src/pagina/armazem.ts`:

```ts
/**
 * O armazém de Texto Padrão do núcleo para os textos dos projetos (P4), com só o que ele usa da
 * sessão: o HTTP e o link do MENU (`linkDoMenu`) colhido da tela. Sem a classe `Sei`, o pacote do
 * content script não leva a leitura da árvore de processo (o portão do build confere), e o armazém
 * só usa o menu e os links da própria lista de Textos Padrão: nunca URL montada.
 */

import type { ArmazemTexto } from "@comum/sincronia/controlePagina";
import { criarArmazemTextoPadrao } from "@nucleo/dominio/textoPadrao";
import { linkDoMenu } from "@nucleo/links/links";
import { criarHttp } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import type { Vis } from "../modelo/tipos";
import { descricaoDoTexto, nomeDoTexto } from "../sincronia/textoPadrao";

export function armazemDoTexto(doc: Document, url: string, vis: Vis, login: string): ArmazemTexto {
  const sessao = { http: criarHttp(url), linkMenu: (acao: string) => linkDoMenu(paginaDe(doc, url), acao) };
  const a = criarArmazemTextoPadrao(sessao, { nome: nomeDoTexto(vis, login), descricao: descricaoDoTexto(vis) });
  return {
    ler: () => a.ler(),
    gravar: (h) => a.gravar(h),
    gravarConferindo: (h, c) => a.gravarConferindo(h, c),
    excluir: () => a.excluir(),
    localizar: () => a.localizar(),
  };
}
```

Em `projetos/src/pagina/executor.ts`, troque:

```ts
import { lerCaixaDaPagina } from "@nucleo/dominio/caixa";
import { paginaDe } from "@nucleo/sessao/pagina";
import type { ContextoProjetos, DocumentoConferido, ProcessoDaCaixa, UsuarioDaUnidade } from "../ponte/tipos";

export interface DepsExecutor {
  doc: Document;
```

por:

```ts
import { lerCaixaDaPagina } from "@nucleo/dominio/caixa";
import { paginaDe } from "@nucleo/sessao/pagina";
import type { ContextoProjetos, DocumentoConferido, ProcessoDaCaixa, UsuarioDaUnidade } from "../ponte/tipos";
import type { ProjetosDoAtividades } from "./atividades";
import type { ResultadoSincronizar } from "./sincronia";

export interface DepsExecutor {
  doc: Document;
```

Em `projetos/src/pagina/executor.ts`, troque:

```ts
  avisarAcoes?: AvisarComAcoes | null;
  usuarios(): Promise<UsuarioDaUnidade[]>;
  conferir(numero: string): Promise<DocumentoConferido | null>;
}

/** Os processos da página da caixa que está na tela (sem requisição). */
```

por:

```ts
  avisarAcoes?: AvisarComAcoes | null;
  usuarios(): Promise<UsuarioDaUnidade[]>;
  conferir(numero: string): Promise<DocumentoConferido | null>;
  /** P4: a sincronia por Texto Padrão desta aba (só na janela de topo, com unidade). */
  sincronia?: { agora(): Promise<ResultadoSincronizar>; apagarPessoal(): Promise<boolean> } | null;
  /** P4: os projetos do servidor do Atividades (só com servidor configurado). */
  atividades?: (() => Promise<ProjetosDoAtividades>) | null;
}

/** Os processos da página da caixa que está na tela (sem requisição). */
```

Em `projetos/src/pagina/executor.ts`, troque:

```ts
    processosDaCaixa: () => processosDaCaixa(d.doc),
    usuariosDaUnidade: () => d.usuarios(),
    atividadesDisponivel: () => d.ctx.atividades,
  };
}
```

por:

```ts
    processosDaCaixa: () => processosDaCaixa(d.doc),
    usuariosDaUnidade: () => d.usuarios(),
    atividadesDisponivel: () => d.ctx.atividades,
    sincronizarAgora: () => {
      if (!d.sincronia) throw new ErroRpc("SEM_SINCRONIA", "A sincronia pelo Texto Padrão só funciona numa tela do SEI com unidade.");
      return d.sincronia.agora();
    },
    // Só o texto pessoal: o da unidade é de todos e não tem "apagar".
    apagarDoSei: () => {
      if (!d.sincronia) throw new ErroRpc("SEM_SINCRONIA", "A sincronia pelo Texto Padrão só funciona numa tela do SEI com unidade.");
      return d.sincronia.apagarPessoal();
    },
    importarAtividades: () => {
      if (!d.atividades) throw new ErroRpc("SEM_ATIVIDADES", "Não há servidor do Atividades configurado neste SEI.");
      return d.atividades();
    },
  };
}
```

Em `projetos/src/pagina/main.ts`, troque:

```ts

// Primeiro de tudo (efeito de importação): a marca do <html> antes de qualquer outro módulo.
import "./marcar";
import { areaChrome } from "@comum/armazenamento/area";
import { hojeISO } from "@comum/datas/dias";
import { lerOpcaoLegada } from "@comum/opcoes/legadas";
import { corDoTemaSei, temaEscuroLegado } from "@comum/pagina/tema";
import { avisoComAcoesNaPagina, avisoNaPagina } from "@comum/painel/aviso";
import { ligarPortaDoPainel } from "@comum/painel/embutido";
import type { PortaRpc } from "@comum/ponte/rpc";
import { Formulario } from "@nucleo/formulario/formulario";
import { criarHttp } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
```

por:

```ts

// Primeiro de tudo (efeito de importação): a marca do <html> antes de qualquer outro módulo.
import "./marcar";
import { type Area, areaChrome } from "@comum/armazenamento/area";
import { hojeISO } from "@comum/datas/dias";
import { lerOpcaoLegada } from "@comum/opcoes/legadas";
import { corDoTemaSei, temaEscuroLegado } from "@comum/pagina/tema";
import { avisoComAcoesNaPagina, avisoNaPagina } from "@comum/painel/aviso";
import { ligarPortaDoPainel } from "@comum/painel/embutido";
import type { PortaRpc } from "@comum/ponte/rpc";
import { ocultarTextosInternos } from "@comum/sincronia/controlePagina";
import { travarComLocks, travarEsperando } from "@comum/sincronia/trava";
import { Formulario } from "@nucleo/formulario/formulario";
import { criarHttp } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
```

Em `projetos/src/pagina/main.ts`, troque:

```ts
import { gravarPreferencias, lerPreferencias } from "../app/preferencias";
import { chaveUsuarios } from "../modelo/constantes";
import { escoposDaUnidade } from "../modelo/escopo";
import { CANAL_PROJETOS } from "../ponte/tipos";
import { RepositorioProjetos } from "../repositorio";
import { atividadesConfigurado, contextoProjetos } from "./contexto";
import { conferirDocumento } from "./documento";
import { tratadoresProjetos } from "./executor";
import { ligarAlertas, montarPainelProjetos, ordemDoPainel } from "./painel";
import { responsaveisUsados, usuariosDaCaixa, usuariosDaUnidade } from "./usuarios";

const global = window as unknown as { __seiProProjetos?: boolean };
if (!global.__seiProProjetos) {
  // O mesmo arquivo injetado duas vezes (matches que se sobrepõem) não monta dois painéis.
  global.__seiProProjetos = true;
  const iniciar = () => void principal().catch((e) => console.warn("[SEI Pro] projetos:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}
```

por:

```ts
import { gravarPreferencias, lerPreferencias } from "../app/preferencias";
import { chaveUsuarios } from "../modelo/constantes";
import { escoposDaUnidade } from "../modelo/escopo";
import type { Vis } from "../modelo/tipos";
import { CANAL_PROJETOS, type ContextoProjetos } from "../ponte/tipos";
import { RepositorioProjetos } from "../repositorio";
import { armazemDoTexto } from "./armazem";
import { projetosDoAtividades } from "./atividades";
import { atividadesConfigurado, contextoProjetos } from "./contexto";
import { conferirDocumento } from "./documento";
import { tratadoresProjetos } from "./executor";
import { ligarAlertas, montarPainelProjetos, ordemDoPainel } from "./painel";
import { SincroniaPagina } from "./sincronia";
import { responsaveisUsados, usuariosDaCaixa, usuariosDaUnidade } from "./usuarios";

const global = window as unknown as { __seiProProjetos?: boolean };
if (!global.__seiProProjetos) {
  // O mesmo arquivo injetado duas vezes (matches que se sobrepõem) não monta dois painéis.
  global.__seiProProjetos = true;
  const iniciar = () => {
    // Cosmético e barato, em todo frame: os textos de dados do SEI Pro não aparecem como modelo ao gerar documento.
    ocultarTextosInternos(document);
    void principal().catch((e) => console.warn("[SEI Pro] projetos:", e));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}
```

Em `projetos/src/pagina/main.ts`, troque:

```ts
    aoRecolher: (r) => void gravarPreferencias(area, { recolhido: r }).catch(() => undefined),
  });
  if (!montado) return;
  // Só leitura (pílulas e responsáveis já usados): o content script não grava projetos.
  const escopos = escoposDaUnidade(ctx.host, ctx.login, unidade.id);
  const carimbo = () => ({ agora: Date.now(), dispositivo: "pagina", por: ctx.login, nome: ctx.nome });
  const repos = {
    unidade: new RepositorioProjetos(area, escopos.unidade, carimbo),
    eu: new RepositorioProjetos(area, escopos.eu, carimbo),
  };
  const http = criarHttp(location.href);
  const tratadores = tratadoresProjetos({
    doc: document,
```

por:

```ts
    aoRecolher: (r) => void gravarPreferencias(area, { recolhido: r }).catch(() => undefined),
  });
  if (!montado) return;
  // Pílulas, responsáveis já usados e a mescla do que vem do SEI (P4): o content script não edita projetos.
  const escopos = escoposDaUnidade(ctx.host, ctx.login, unidade.id);
  const carimbo = () => ({ agora: Date.now(), dispositivo: "pagina", por: ctx.login, nome: ctx.nome });
  const repos = {
    unidade: new RepositorioProjetos(area, escopos.unidade, carimbo),
    eu: new RepositorioProjetos(area, escopos.eu, carimbo),
  };
  // P4: os Textos Padrão da unidade e o pessoal (lê ao abrir o Controle de Processos; grava 15 s depois de mudar).
  const sincronia = ligarSincronia(ctx, unidade, area, repos);
  const http = criarHttp(location.href);
  const tratadores = tratadoresProjetos({
    doc: document,
```

Em `projetos/src/pagina/main.ts`, troque:

```ts
    sobreposicao: montado.sobreposicao,
    avisar: avisoNaPagina(document, ctx.temaEscuro, "spro-prj"),
    avisarAcoes: avisoComAcoesNaPagina(document, ctx.temaEscuro, "spro-prj"),
    usuarios: async () => {
      const dados = await carregarUnidade(repos, hojeISO()).catch(() => null);
      return usuariosDaUnidade({
```

por:

```ts
    sobreposicao: montado.sobreposicao,
    avisar: avisoNaPagina(document, ctx.temaEscuro, "spro-prj"),
    avisarAcoes: avisoComAcoesNaPagina(document, ctx.temaEscuro, "spro-prj"),
    sincronia,
    atividades: ctx.atividades
      ? () => projetosDoAtividades(localStorage, chrome.runtime.getManifest().version, (u, i) => fetch(u, i))
      : null,
    usuarios: async () => {
      const dados = await carregarUnidade(repos, hojeISO()).catch(() => null);
      return usuariosDaUnidade({
```

Em `projetos/src/pagina/main.ts`, troque:

```ts
  const porta = ligarPortaDoPainel(montado, () => chrome.runtime.connect({ name: CANAL_PROJETOS }) as unknown as PortaRpc, tratadores);
  ligarAlertas(montado, { temaEscuro: ctx.temaEscuro, repos, rpc: porta.rpc, hoje: () => hojeISO() });
}
```

por:

```ts
  const porta = ligarPortaDoPainel(montado, () => chrome.runtime.connect({ name: CANAL_PROJETOS }) as unknown as PortaRpc, tratadores);
  ligarAlertas(montado, { temaEscuro: ctx.temaEscuro, repos, rpc: porta.rpc, hoje: () => hojeISO() });
}

/** P4: os dois Textos Padrão desta unidade, lidos e gravados por esta aba (pagina/sincronia.ts). */
function ligarSincronia(
  ctx: ContextoProjetos,
  unidade: { id: string; sigla: string },
  area: Area,
  repos: Readonly<Record<Vis, RepositorioProjetos>>,
): SincroniaPagina {
  const s = new SincroniaPagina({
    host: ctx.host,
    login: ctx.login,
    nomeUsuario: ctx.nome || ctx.login,
    unidade,
    area,
    sync: areaChrome(chrome.storage.sync, "sync"),
    repos,
    armazem: (vis) => armazemDoTexto(document, location.href, vis, ctx.login),
    travar: travarComLocks,
    travarEsperando,
  });
  void s.iniciar({ puxar: true }).catch((e) => console.warn("[SEI Pro] projetos: sincronia", e));
  const puxar = () => void s.puxar().catch(() => undefined);
  window.addEventListener("focus", puxar);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") puxar();
  });
  return s;
}
```

- [ ] **Step 6: Rodar as provas, o build e todos os portões**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos/projetos" && npx tsx tests/verificar.ts 2>&1 | tail -2 && npm run tipos && npx biome check src tests && node build.mjs | tail -5
```
Expected: `1229 ok, 0 falha(s)` (+10); os dois `tsc` sem saída; Biome sem erro; o build termina com `portoes: ASCII, DOM seguro e content script sem arvore/atribuicao ok`.

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && (cd favoritos && node build.mjs | tail -1) && (cd historico && node build.mjs | tail -1) && (cd agente-ia && node build.mjs | tail -1) && node tools/check-dom-injection.mjs && node tools/patch-manifests.mjs --check && LC_ALL=C grep -c $'[\x80-\xff]' dist/js/init_projetos.js dist/js/projetos/app.js dist/css/projetos.css && git status --short dist
```
Expected: `check-dom-injection: 0 erro(s), 0 aviso(s)`; `0 manifest(s) precisam de ajuste, 1 ja em dia`; três `:0`; no `git status`, só `dist/css/projetos.css`, `dist/js/init_projetos.js` e `dist/js/projetos/app.js` modificados (os dos Favoritos, do Histórico e do Agente já foram regerados nas Tarefas 1 e 2; se algum aparecer aqui, entra no commit).

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && for p in sei-comum sei-nucleo favoritos historico agente-ia; do (cd $p && echo "$p $(npx tsx tests/verificar.ts 2>&1 | tail -2 | head -1)"); done
```
Expected: `sei-comum 447 ok, 0 falha(s)`, `sei-nucleo 125 ok, 0 falha(s)`, `favoritos 578 ok, 0 falha(s)`, `historico 485 ok, 0 falha(s)`, `agente-ia 1054 ok, 0 falha(s)`.

- [ ] **Step 7: Commit**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos" && git branch --show-current && git add \
  projetos/src/app/app.ts \
  projetos/src/app/main.ts \
  projetos/src/pagina/armazem.ts \
  projetos/src/pagina/executor.ts \
  projetos/src/pagina/main.ts \
  projetos/tests/verificar-app-p4.ts \
  projetos/tests/pagina/verificar-executor-p4.ts \
  projetos/tests/verificar.ts \
  dist/js/init_projetos.js \
  dist/js/projetos/app.js \
  dist/css/projetos.css
git commit -m "$(cat <<'EOF'
Projetos: sincronia e colaboracao ligadas no app e na aba, com as saidas em dist

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: `feat/projetos-ts` e o commit criado.

---

## Riscos e decisões que a validação ao vivo (P6) confere

1. **A conferência no formulário de alterar** (Decisão 1): o `txaConteudo` do "alterar" tem de trazer o mesmo conteúdo (com o mesmo escape, ou o escape a mais que o `mesmoConteudo` desfaz) que o "consultar" no SEI 4.1.5 e no 5.0.4. Se não trouxer, toda gravação vira "mudou" e a rodada desiste (fica "pendente"). Para texto inválido a comparação é do HTML cru: conferir que um texto editado à mão é regravado. Recuo se falhar: voltar à releitura separada (passar `gravarConferindo` só quando a prova ao vivo der certo).
2. **Criação simultânea** (Decisão 2): dois usuários criando `[_SEIPRO_PRJ_UNIDADE]` juntos no SEI de homologação; a ordem dos ids na lista e a exclusão do próprio duplicado pelo link assinado da lista.
3. **Quem só lê** (Decisão 3): um usuário sem permissão de alterar textos da unidade (ou que não criou o texto) vê o link de consultar e não o de alterar? Conferir que o estado fica "neste navegador" com o motivo e que os projetos dos colegas aparecem.
4. **O "Entendi" no meio de um arraste no Gantt** (Decisão 5): o `moverDatas` é gravação; o aviso aparece por cima do painel e, recusado, a barra volta. Conferir que não fica preso nem pergunta duas vezes.
5. **Servidor do Atividades a partir do content script** (Tarefa 11): a mesma requisição do painel legado (CORS do servidor da ANTT, a chave, o `perfil`); a resposta grande (traz as demandas junto) e o recuo no guardado. O processo de projeto do legado entra sem a marca de sigilo (Decisão 17): conferir com o autor se é aceitável ou se a importação deve sugerir marcar.
6. **Arquivo ligado** (Decisão 18): no painel embutido o Chrome pode recusar o seletor dentro do iframe (o diálogo mostra o aviso); no lateral (P5) tem de funcionar como nos Favoritos.
7. **Tamanho real**: quantos projetos e etapas cabem em 100 KB, o tempo do CKEditor 5 (que baixa os textos da unidade) e a cota do `storage.sync` (8 KB por item) com o mapa de consentimentos crescendo por unidade e texto.
8. **O link do menu colhido da tela** (Decisão 22): o armazém do content script usa `linkDoMenu` sobre a tela atual (o Controle de Processos tem o menu); conferir no SEI 4.1.5 e no 5.0.4 que o item "Textos Padrão" está no menu da tela e que o P5, nas outras telas, monta o armazém só onde há menu.
9. **Relógio atrasado** (Decisão 13): simular um computador com o relógio dois dias atrás e ver o aviso; e o texto inválido substituído com o "Baixar o texto antigo".

## Auto-revisão (feita ao escrever o plano)

- **Cobertura da spec:** 6.1 (os dois textos, nomes, descrição, leitura automática da unidade, aviso único que vale como consentimento, convite e diálogo do pessoal, envelope e validação, versão maior, inválido com cópia e aviso, teto e aviso, rodada, trava, concorrência com releitura/conferência e lápides 180/90, indisponível) → Tarefas 1, 2, 4, 5, 7, 13; 6.2 (arquivo com todos os escopos, Exportar/Importar que mescla, cópias 14, enviar/receber com ids novos e sem sigilo, mover entre escopos com o "Entendi") → Tarefas 6, 7, 10, 12; 6.3 (importação idempotente, mapeamento campo a campo, recuo no guardado) → Tarefa 11; 3.2 (Sincronização, Modelos, Histórico, Importar, Receber; Arquivados já são do P3) → Tarefas 8 a 12; 3.1 (menu ajustes com os itens do P4 e o estado da sincronia) → Tarefas 7, 12, 13; 9 (erros mapeados no estado e no diálogo; sigilosos fora; nada de HTML de dados) → Tarefas 4, 7, 8. Fora daqui, como no plano-mestre: o lateral, a caixa, a árvore e o Agente (P5).
- **Pendências herdadas:** todas na tabela "Pendências herdadas e onde ficam", cada uma com decisão e tarefa.
- **Placeholders:** nenhum "TBD"/"depois"; todo passo de código tem o código; as contagens saíram do ensaio.
- **Tipos:** `ConferenciaTexto` (sei-comum) e `ConferenciaGravacao` (núcleo) têm a mesma forma (`anterior`, `mesmo`), assim como os dois `ResultadoGravacao`; `ResultadoSincronizar` é o retorno de `SincroniaPagina.agora()` e do RPC `sincronizarAgora`; `ProjetosDoAtividades` é o do RPC `importarAtividades` (no app, `RespostaAtividades` com a mesma forma, para o app não importar de `src/pagina`); `GanchosDoApp` casa com `AppProjetos` (`aberto`, `abrirProjeto`, `novoProjetoDeModelo`).
- **Base real:** o plano foi reaplicado inteiro sobre a worktree em `8f75b79`; a prova estática do CSS, a prova "nada lê a árvore" e o portão do content script do P3 continuam verdes (Decisões 21 e 22). As contagens partem de projetos 960.
- **Review Focus:** cada item tem as provas nas tarefas citadas (bomba de gzip e motor na 1; adaptador com o motor de verdade e a corrida na 4; quem só lê na 2, 1 e 7; sigilo na 3, 4, 5 e 10; arquivo hostil na 6, 10, 11 e 12).
