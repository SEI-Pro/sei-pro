# Agente de IA do SEI Pro — especificação de desenho

Data: 22/09/2026 · Status: aprovado em conversa (seções 1 e 2), seções 3–6 decididas sob delegação do autor.

## 1. Objetivo

Substituir as "Ferramentas de IA" (chat OpenAI/Gemini de 2024) por um **agente** que roda
inteiro no navegador: o usuário descreve o que quer ("mude para restrito todos os ofícios
deste processo que citam CPF", "crie um despacho para cada linha desta planilha", "o que está
parado há mais de 30 dias na minha caixa?"), o modelo escolhe e aciona ferramentas que operam
o SEI pela sessão já aberta do usuário, sem API WSSEI, sem backend e sem fluxo pré-fixado.

## 2. Decisões tomadas

| Tema | Decisão |
|---|---|
| Chave do LLM | Cada usuário traz a sua (OpenRouter). Fica em `chrome.storage.local`, nunca no mundo da página, nunca sincronizada. |
| Interface | Painel lateral (`chrome.sidePanel`; Firefox `sidebar_action` em fase posterior). |
| Autonomia | Leitura livre. Escrita só por **plano aprovado**; irreversíveis pedem confirmação própria; assinatura exige senha digitada pelo humano. |
| Sigilo | Processo sigiloso: o agente **não carrega**. Documento sigiloso: nenhuma tool lê conteúdo. Restrito: consentimento por conversa. |
| Dados pessoais | Anonimização **na fonte**, antes de qualquer texto sair para o LLM (seção 9). |
| IA antiga | Substituída de vez (`sei-pro-ai.js` e IA do editor saem em versão seguinte). |
| Motor | Próprio, em TypeScript, sem dependências, com ergonomia do Claude Agent SDK. |
| Código novo | Biblioteca independente (`sei-nucleo`) que o legado poderá adotar; o código atual é só referência de descoberta. |

## 3. Arquitetura

```
sei-nucleo/                 BIBLIOTECA DO SEI (TS, sem UI, sem jQuery, sem agente)
  src/sessao/                 http (fetch + ISO-8859-1), erros tipados, versão, contexto
  src/formulario/             motor único de formulário (abrir → definir → enviar → validar)
  src/links/                  resolvedor de links assinados (infra_hash) com cache
  src/dominio/                processo, documento, arvore, historico, marcador, anotacao,
                              atribuicao, acompanhamento, andamento, envio, pesquisa, bloco…
  src/privacidade/            detecção de dados pessoais + pseudonimização reversível
  dist → dist/js/sei-nucleo.js (IIFE, window.SeiNucleo) para o legado migrar

agente-ia/                  MOTOR + PAINEL + PONTE
  src/motor/                  loop, provedor OpenRouter, registro de tools, plano, hooks, skills
  src/tools/                  adaptadores finos: esquema + política → chamada ao sei-nucleo
  src/ponte/                  RPC painel ⇄ aba do SEI (porta chrome.runtime)
  src/painel/                 UI do side panel
  src/skills/                 instruções carregadas sob demanda (markdown embutido)
  dist → dist/html/agente.html + dist/js/agente/*.js + dist/js/init_agente.js
         + dist/js/sei-pro-agente-pagina.js (mundo da página, só editor)
```

### Onde cada coisa roda

```
┌─ Painel lateral (página da extensão) ─────────────────────────┐
│ UI · motor · chave OpenRouter · pseudônimos · plano/aprovação │
└──────────────▲────────────────────────────────────────────────┘
               │ porta chrome.runtime "seipro-agente" (aberta pela aba)
┌──────────────┴──────────── aba do SEI ─────────────────────────┐
│ init_agente.js — MUNDO ISOLADO                                  │
│   sei-nucleo inteiro (fetch same-origin leva os cookies)        │
│   gate de sigilo · anonimização · execução das operações        │
│        │ postMessage (só para o que exige o DOM vivo)            │
│ sei-pro-agente-pagina.js — MUNDO DA PÁGINA                      │
│   CKEditor aberto (ler/escrever via SeiProEditorAdapter)        │
└─────────────────────────────────────────────────────────────────┘
```

Por que o núcleo roda no mundo isolado: `fetch` de content script para a mesma origem leva os
cookies da sessão; a página (e qualquer script do SEI) não enxerga o agente, a chave nem os
dados em trânsito. O mundo da página só é tocado para o editor aberto.

O painel **nunca** executa operação do SEI: ele pede à aba. Assim a sessão, os cookies e o
`infra_hash` ficam sempre do lado do SEI.

## 4. `sei-nucleo` — a biblioteca

### 4.1 Princípios

1. Só `fetch`, `DOMParser`, `TextDecoder`. Zero jQuery, zero iframe oculto, zero `this_`.
2. Toda função é `async`, recebe dados e devolve dados. Testável com linkedom.
3. **Um** motor de formulário; **um** resolvedor de links; **uma** codificação.
4. Diferenças de versão (3.x / 4.x / 5.x) declaradas em tabelas de estratégia, não em `if` espalhado.
5. Escrita só retorna sucesso com **prova** (URL de destino, `resultado=1`, releitura).
6. Erros tipados (`ErroSei` com `codigo`), nunca string solta.
7. TSDoc em toda função pública: tela do SEI, ação, versões testadas, função legada que substitui.

### 4.2 Camada de sessão

```ts
interface Sessao {                  // criada uma vez por aba
  base: URL;                        // .../sei/
  versao: VersaoSei;                // {maior, menor, patch, rotulo}
  unidade: {id, sigla};
  usuario: {login, nome};
  obter(url, op?): Promise<Pagina>; // GET, decodifica ISO-8859-1, detecta sessão expirada
  enviar(url, campos, op?): Promise<Pagina>; // POST x-www-form-urlencoded; charset=ISO-8859-1
}
interface Pagina { url: string /*responseURL*/; html: string; doc: Document; }
```

- Codificação: `codificarLatin1(campos)` substitui `escape`/`escapeComponent`/`procLote_paraLatin1`:
  normaliza travessão/aspas curvas para equivalentes Latin-1 e percent-encoda bytes 0–255;
  caractere fora do Latin-1 vira entidade numérica HTML (o SEI renderiza) em vez de `?`.
- Detecção de sessão expirada: redirecionamento para `sip/login.php` ou formulário de login → `SEI_SESSAO_EXPIRADA`.
- Mensagens de validação do SEI (`#txaInfraValidacao`, `alert(...)` em script de retorno) → `SEI_VALIDACAO`.

### 4.3 Resolvedor de links assinados

`links.acao(nome, escopo)` devolve **um** URL com `infra_hash` válido, procurando em ordem:
menu principal, barra do processo (`Nos[0].acoes`), ações do documento (`Nos[i].acoes`), scripts
inline, `action` de formulários. Cache por (escopo, ação) enquanto a sessão/unidade não muda.
Nunca concatena dois links (bug que derrubava a sessão). Único URL sem hash aceito pelo SEI:
`controlador.php?acao=procedimento_trabalhar&id_procedimento=N` (ponto de entrada do processo).

### 4.4 Motor de formulário

```ts
const f = await Formulario.abrir(sessao, url, '#frmDocumentoCadastro');
f.definir({ txtDescricao: '…', rdoNivelAcesso: '1', hdnIdHipoteseLegal: '34' });
f.definirLupa('Interessados', [{id:'10', texto:'Fulano'}]);   // selX + hdnX (id±texto¥)
const r = await f.enviar({ botao: 'sbmSalvar', sucesso: urlContem('acao_origem=documento_gerar') });
```

Coleta todos os campos submetíveis como um navegador faria (inputs habilitados, radios/checkboxes
marcados, selects), aplica as alterações, codifica em Latin-1, envia ao `action` e valida.

### 4.5 Domínio (F1 em negrito)

| Módulo | Funções |
|---|---|
| contexto | **`lerContextoTela`**, **`unidades`**, `trocarUnidade` |
| processo | **`localizar`** (protocolo→id), **`consultar`**, **`alterar`**, `criar`, `concluir`, `reabrir`, `enviar`, `marcarNaoLido`, `sobrestar` |
| arvore | **`documentos`** (com pastas), **`linksDoProcesso`** |
| documento | **`ler`** (HTML→texto; externo→PDF/texto), **`criar`**, **`alterar`**, `editarConteudo`, `duplicar`, `excluir`, `cancelarAssinatura`, `assinar`, `darCiencia`, `anexar` |
| historico | **`andamentos`** (paginado, resumido/completo) |
| caixa | **`listarProcessos`** (recebidos/gerados, paginação removida) |
| marcador | **`listar`**, **`definir`**, **`remover`** |
| anotacao, andamento, atribuicao, acompanhamento | **`definir`/`registrar`/`atribuir`/`incluir`/`remover`** |
| opcoes | **`tiposProcesso`**, **`tiposDocumento`**, **`hipotesesLegais`**, **`usuariosUnidade`**, **`unidades`**, **`gruposAcompanhamento`**, **`textosPadrao`** |
| pesquisa | `pesquisar` (F2) |
| bloco | F3 |

A tabela de migração função-legada → função-nova fica em `sei-nucleo/MIGRACAO.md`.

## 5. Catálogo de tools (aprovado)

Aceitam **listas**, recebem referências humanas (protocolo, nº SEI), devolvem JSON enxuto e
paginado. Toda escrita implementa `previsualizar()` (antes → depois, sem gravar).

Efeitos: 🔍 leitura · ✏️ escrita reversível · ⚠️ irreversível · 🔏 assinatura.

- Contexto: `contexto_tela` 🔍 F1 · `sei_opcoes` 🔍 F1 · `unidade_trocar` ✏️ F2
- Processos: `processos_listar` 🔍 F1 · `processos_pesquisar` 🔍 F2 · `processo_consultar` 🔍 F1 ·
  `processo_historico` 🔍 F1 · `processo_alterar` ✏️ F1 · `processo_marcador` ✏️ F1 ·
  `processo_anotacao` ✏️ F1 · `processo_andamento` ✏️ F1 · `processo_atribuir` ✏️ F1 ·
  `processo_acompanhamento` ✏️ F1 · `processo_criar` ✏️ F2 · `processo_nao_lido` ✏️ F2 ·
  `processo_concluir`/`processo_reabrir` ✏️ F2 · `processo_enviar` ⚠️ F2 · `processo_sobrestar` ✏️ F3 ·
  `processo_ciencia` ✏️ F3
- Documentos: `documentos_listar` 🔍 F1 · `documento_ler` 🔍 F1 · `documento_criar` ✏️ F1 ·
  `documento_alterar` ✏️ F1 · `documento_editar` ✏️ F2 · `documento_duplicar` ✏️ F2 ·
  `documento_anexar` ✏️ F2 · `documento_ciencia` ✏️ F2 · `documento_cancelar_assinatura` ⚠️ F2 ·
  `documento_excluir` ⚠️ F2 · `documento_assinar` 🔏 F2
- Editor aberto: `editor_ler` 🔍 F1 · `editor_escrever` ✏️ F1
- Blocos (F3): `blocos_listar`, `bloco_consultar`, `bloco_criar`, `bloco_itens`, `bloco_situacao`, `bloco_assinar`
- Motor: `plano_propor`, `tarefas`, `perguntar`, `arquivo_gerar`

## 6. Motor do agente

### 6.1 Loop

```
usuário → [system + skills ativas + histórico compactado + tools] → OpenRouter (SSE)
  ├─ texto → painel (streaming)
  └─ tool_calls → para cada chamada:
        hook antesDaTool (sigilo, orçamento, política)
        leitura → executa na aba → resultado (anonimizado) → volta ao modelo
        escrita → vira plano de 1 passo (ou o modelo chama plano_propor) → aprovação → execução
  repete até o modelo responder sem tool_calls, o usuário parar, ou limite de passos (40)
```

- Provedor: `POST https://openrouter.ai/api/v1/chat/completions`, `stream: true`,
  `tools`, `parallel_tool_calls: true`, `usage: {include: true}`,
  `provider: {data_collection: "deny"}`. Cabeçalhos `X-Title: SEI Pro`, `HTTP-Referer`.
- Modelo padrão `anthropic/claude-sonnet-5`; seletor lista ao vivo `GET /api/v1/models`
  filtrando `supported_parameters ∋ "tools"`, com preço por milhão.
- Cancelamento: `AbortController` para o LLM e sinal de cancelamento repassado à aba.
- Retentativa com recuo exponencial em 429/5xx (3x); erro do provedor exibido em linguagem simples.

### 6.2 Registro de tools (ergonomia do Agent SDK)

```ts
export const processoMarcador = definirTool({
  nome: 'processo_marcador',
  descricao: '…',                      // escrita para o modelo: quando usar, quando não usar
  parametros: esquema.objeto({…}),     // JSON Schema subset, validado antes de executar
  efeito: 'escrita',                   // leitura | escrita | irreversivel | assinatura
  previsualizar: (args, ctx) => …,     // só escrita
  executar: (args, ctx) => …,          // chama a aba via ctx.sei.<op>
});
```

Validador de esquema próprio (subset: object, string, number, integer, boolean, array, enum,
required, min/max) — erros de argumento voltam ao modelo como resultado da tool para ele corrigir.

### 6.3 Plano aprovado

- `plano_propor({objetivo, passos:[{tool, args, rotulo}]})`. Args podem referenciar saídas de
  passos anteriores: `"$1.documentos[0].id"`.
- O motor chama `previsualizar` de cada passo e mostra um cartão: tabela antes → depois, total
  de itens, marcas ⚠️/🔏. Botões: **Aprovar**, **Aprovar até o passo N**, **Recusar** (com
  motivo opcional, que volta ao modelo).
- Execução **determinística** pelo motor, sem voltar ao LLM entre itens; progresso por item;
  primeira falha de passo interrompe os passos seguintes (itens independentes de um mesmo passo
  continuam e são relatados). O resultado consolidado volta ao modelo.
- Irreversível: dentro do plano, exige marcar "Entendo que não dá para desfazer" antes de aprovar.
- Assinatura: o cartão pede cargo e senha; a senha vai direto do painel para a aba e é
  descartada após o uso. O modelo só recebe "assinado"/"falhou: motivo".
- Chamada direta de tool de escrita ⇒ o motor a trata como plano de um passo.

### 6.4 Hooks

`antesDaTool(nome, args, ctx) → permitir | negar(motivo) | pedirConsentimento(tipo)`,
`depoisDaTool(nome, resultado, ctx) → resultado'`. Implementados: gate de sigilo, consentimento
de restrito, anonimização, auditoria (registro local de toda escrita com data, tool, itens,
resultado — exportável).

### 6.5 Contexto e custo

- System prompt curto: papel, regras de segurança, convenções (datas, protocolo, nº SEI), como
  usar plano. Instruções longas ficam em **skills** carregadas por `skill_ler(nome)` quando o
  modelo precisa: `redacao-oficial` (estilos CSS do SEI, `ancoraSei`), `tramitacao`, `lote`,
  `pesquisa`, `prazos`, e os antigos prompts prontos (resumo, parecer, base legal, linguagem
  simples, dados sensíveis) viram **atalhos** no painel.
- Resultado de tool truncado em ~12 mil caracteres com `continuar` (cursor).
- Compactação: acima de 60% da janela do modelo, os resultados de tools antigos viram resumo
  de uma linha; o texto das mensagens é preservado.
- Medidor de custo: `usage.cost` do OpenRouter somado por conversa.

### 6.6 Contexto da tela no prompt

A cada mensagem o motor injeta um bloco curto `<tela>`: unidade, processo aberto (protocolo, tipo,
nível), documento visualizado, quantos processos marcados, se há editor aberto. O modelo decide
se aprofunda com `contexto_tela`/`processo_consultar`.

## 7. Ponte

- Canal `seipro-agente`. Direção: a aba abre a porta para o painel (mesma técnica das
  Ferramentas de PDF: evita a permissão `tabs`).
- Pedido `{id, op, args}`; resposta `{id, ok, dados | erro:{codigo, mensagem}}`; progresso
  `{id, progresso:{feito,total,rotulo}}`; cancelamento `{id, cancelar:true}`.
- Cada aba se apresenta com `{abaId, host, visivel, processo?, unidade}` e reapresenta em foco,
  `hashchange` e navegação. O painel usa a aba visível mais recente e mostra qual está usando;
  com mais de uma, o usuário escolhe.
- Prazos por operação (leitura 60 s, escrita 120 s por item, upload 15 min).

## 8. Painel (UI)

- Cabeçalho: aba/unidade/processo em uso, modelo, custo da conversa, nova conversa.
- Conversa com streaming; cartões de tool colapsáveis (nome humano, argumentos resumidos,
  duração, itens); cartão de plano (seção 6.3); cartão de consentimento de restrito; lista de
  tarefas fixada quando o modelo usa `tarefas`.
- Composer: texto, anexar arquivo (CSV/XLSX/PDF/DOCX → disponível às tools; CSV entra no modo
  `modelo + dados[]`), atalhos, botão parar.
- Configuração (primeira abertura): chave OpenRouter (validada com `GET /api/v1/key`), modelo,
  aviso de privacidade, opção "anonimizar também nomes de interessados" (ligada por padrão).
- Estado da conversa em `chrome.storage.session` (sobrevive a recarregar a aba; some ao fechar
  o navegador). Nada vai para `storage.sync`.
- Visual alinhado às Ferramentas de PDF (mesma paleta, tema claro/escuro).

## 9. Privacidade e segurança

### 9.1 Sigilo (bloqueio estrutural)

- `contexto_tela` detecta processo sigiloso (ícone/`hdnIdSigilosos`/nível no cabeçalho). Aba em
  processo sigiloso ⇒ a ponte responde `SEI_SIGILOSO` a **qualquer** operação e o painel mostra
  "O agente não atua em processos sigilosos".
- `processo.consultar` e `arvore.documentos` marcam nível de acesso. Documento/processo
  sigiloso ⇒ `documento.ler` recusa **no núcleo** (antes de baixar o conteúdo) e as listagens
  devolvem só `{protocolo, sigiloso: true}` sem especificação/descrição.

### 9.2 Restrito (consentimento)

Primeira leitura de conteúdo restrito na conversa ⇒ o hook pausa e o painel pede
consentimento ("Permitir enviar ao modelo o conteúdo de documentos restritos nesta conversa").
Recusado ⇒ a tool devolve `CONTEUDO_RESTRITO_NAO_AUTORIZADO` e o modelo trabalha só com metadados.

### 9.3 Anonimização na fonte (diretriz do autor)

Todo texto que vai para o LLM passa por `privacidade.anonimizar()` num ponto único: a
**fronteira de saída do motor** (painel), antes de entrar no histórico enviado ao provedor —
mensagem do usuário, conteúdo de documento, histórico, especificações, anotações e qualquer
resultado de tool. (Decisão revista na implementação: o mapa de pseudônimos e a reidratação
vivem no painel, e o texto de PDF só existe depois do pdf.js, que roda no painel. O dado não
sai do navegador antes da anonimização; o bloqueio de sigilo continua no núcleo, na aba.)

- **Detectores validados** (reaproveitados do Tarjar, `ferramentas-pdf/src/lib/ferramentas/tarjar/`):
  CPF, CNPJ, e-mail, telefone, CEP, cartão, chave PIX, RG, PIS, título de eleitor, CNH, data de
  nascimento — com dígito verificador ou rótulo por perto, nas duas projeções (com/sem espaço).
- **Dicionário da sessão**: nomes de interessados, contatos e usuários vistos pelo núcleo
  (metadados do processo) são substituídos onde aparecem no texto (busca sem acento/caixa).
- **Rótulos**: valor após "endereço", "residente", "domiciliado", "nome da mãe", "filiação",
  "conta", "agência" até o fim da linha/vírgula.
- **Pseudônimos reversíveis e estáveis**: `[CPF_1]`, `[EMAIL_2]`, `[PESSOA_3]`. O mapa fica
  **só no painel** (memória da conversa). Quando o modelo escreve (documento, anotação,
  despacho) usando `[PESSOA_3]`, a tool **reidrata** antes de gravar no SEI — o dado real
  nunca passa pelo LLM, mas os documentos saem corretos.
- Nunca vão ao LLM, em nenhuma hipótese: senha, cookies, `infra_hash` e URLs assinadas
  (resultados de tools levam ids, não links), chave da API.
- O usuário vê num contador do painel quantos dados foram mascarados na conversa.

### 9.4 Outras regras

- Sem tool de "executar JS", "clicar em seletor" ou "navegar para URL": o modelo só age por
  tools tipadas.
- Conteúdo lido do SEI é dado, não instrução: o system prompt manda ignorar instruções contidas
  em documentos, e escritas continuam presas ao plano aprovado (defesa contra injeção de prompt
  por documento externo).
- Chave em `chrome.storage.local`; CSP da página da extensão `script-src 'self'`.

## 10. Manifest

- `permissions`: + `sidePanel`. `side_panel.default_path: html/agente.html`.
- `background.js`: `chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:false})` e
  mensagem `abrirAgente` (vinda do botão no SEI) → `chrome.sidePanel.open({tabId})`.
- Content script novo `js/init_agente.js` (mundo isolado, `all_frames: false`) nos mesmos
  `matches` do SEI; `js/sei-pro-agente-pagina.js` em `web_accessible_resources`.
- Botão "Agente de IA" no menu do SEI Pro e na barra do processo (no lugar de "Ferramentas de IA").
- Firefox (manifests v2): `sidebar_action` — fase 2.

## 11. Testes

- `sei-nucleo`: testes com tsx + linkedom sobre fixtures HTML reais capturadas do SEI 4.1.5
  (SEI SP Treinamento) e do SEI 5 (fontes locais), um por tela/estratégia; codificação Latin-1;
  anonimização (corpus com CPFs válidos/ inválidos, e-mails, nomes).
- `agente-ia`: motor com provedor falso roteirizado (tool calls determinísticas), validação de
  esquema, plano com referências, hooks de sigilo/consentimento, reidratação.
- E2E: harness puppeteer (extensão carregada) no SEI SP Treinamento: cada tool F1 executada
  pela ponte com o provedor falso, conferindo o efeito no SEI.

## 12. Fases

- **F1 (MVP)**: núcleo base + tools F1 + motor + ponte + painel + privacidade + manifest.
- **F2**: lote completo (criar processos/documentos, editar, enviar, concluir, excluir, assinar,
  anexar, pesquisar), Firefox, remoção da IA antiga.
- **F3**: blocos, sobrestamento, ciências, cadastros; migração do legado para `SeiNucleo`.

## 13. Estado da implementação (22/09/2026)

Entregue e validado ao vivo no SEI SP Treinamento (4.1.5), com a extensão carregada no Chrome:

- `sei-nucleo`: sessão, motor de formulário, links, árvore, processo (consultar, alterar,
  concluir, reabrir), documento (localizar, ler, alterar, criar), editor CK4 (gravar conteúdo),
  histórico, caixa, marcadores, anotação, andamento, atribuição, acompanhamento (prévia),
  opções, privacidade. 76 verificações offline sobre telas reais.
- `agente-ia`: motor, provedor OpenRouter (SSE), ponte, 18 tools do SEI + 4 do motor, painel
  lateral, manifest (`sidePanel`) e abertura pelo menu do SEI. 20 verificações offline; dois
  cenários ponta a ponta com o OpenRouter simulado por interceptação (consulta + anotação;
  sigilo de 2 documentos + criação de despacho num único plano).
- Mudança de escopo em F1: `editor_ler`/`editor_escrever` (editor aberto) ficaram para F2; o
  conteúdo é gravado pelo servidor (`documento_editar`, `documento_criar` com conteúdo).
  `processo_concluir`/`processo_reabrir` (F2) foram antecipados.
- Não validado: chamada real ao OpenRouter (sem chave nesta máquina), editor CK5 do SEI 5 ao
  vivo, Firefox.

### Atualização (22/09/2026, tarde)

- Validado com modelo real (`anthropic/claude-sonnet-5` via OpenRouter): leitura com tools em
  paralelo (14 s, US$ 0,04); marcador + anotação num plano (US$ 0,12); criar despacho, assinar e
  enviar para outra unidade mantendo aberto (67 s, US$ 0,17).
- F2 antecipada: `processo_enviar` (irreversível) e `documento_assinar` (cartão pede cargo e senha;
  senha nunca vai ao modelo — coberto por teste). Plano sem nenhuma mudança real não pede aprovação.
- Robustez observada: a aba recarregou no meio de uma assinatura; a operação tinha sido concluída
  no SEI, e a prévia idempotente ("você já assinou") evitou assinatura duplicada na nova tentativa.
