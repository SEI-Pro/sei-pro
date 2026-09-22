# Agente de IA do SEI Pro — plano de implementação (F1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) — o autor
> delegou a execução sem supervisão. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** entregar a F1 do agente: biblioteca `sei-nucleo`, motor/painel/ponte `agente-ia`,
privacidade na fonte e as tools F1, validadas no SEI SP Treinamento (4.1.5).

**Architecture:** `sei-nucleo` (TS puro, fetch/DOMParser) roda no mundo isolado da aba do SEI;
`agente-ia` roda no side panel e fala com a aba por porta `chrome.runtime`; só o editor aberto
é tocado no mundo da página.

**Tech Stack:** TypeScript 5.9, esbuild 0.25, tsx + linkedom para testes, sem dependências de runtime.

**Spec:** `docs/superpowers/specs/2026-09-22-agente-ia-sei-design.md`

## Global Constraints

- Saída JS em `dist/js/**` com `charset: "ascii"` (acentos como `\uXXXX`).
- Alvos `chrome109`, `firefox115`, como as Ferramentas de PDF.
- Nenhuma dependência de runtime; libs só em devDependencies.
- Nenhum `infra_hash`, cookie, senha ou chave em texto enviado ao LLM.
- Processo sigiloso: nenhuma operação; documento sigiloso: nenhum conteúdo.
- Todo texto para o LLM passa por `anonimizar()` dentro da aba.
- Escrita só retorna ok com prova (URL de destino, `resultado=1` ou releitura).
- Sem commits sem autorização do autor (working tree apenas).
- Nunca "Enviar" processo nem assinar no SEI de produção; testes de escrita só no SEI SP Treinamento.

---

### Task 0: Fixtures reais do SEI SP (4.1.5)

**Files:** Create `sei-nucleo/tests/fixtures/sei41/*.html` (gravadas em ISO-8859-1 → UTF-8)

- [ ] Logar no SEI SP com o Chrome DevTools MCP, abrir o processo de teste
      `99906.713-630.000032/2025-82`.
- [ ] Salvar HTML de: `procedimento_controlar` (caixa), `procedimento_trabalhar`,
      `arvore_visualizar` do processo (barra `Nos[0].acoes`), árvore (`procedimento_visualizar`),
      `procedimento_alterar`, `documento_alterar`, `documento_visualizar` (um despacho),
      `procedimento_consultar_historico` (resumido), `andamento_marcador_gerenciar`,
      `andamento_marcador_cadastrar`, `procedimento_atribuicao_cadastrar`, `anotacao_registrar`,
      `atividade_registrar` (atualizar andamento), `acompanhamento_cadastrar`,
      `documento_escolher_tipo`, `documento_cadastro` (form de um tipo), e a resposta de sucesso
      de cada POST exercitado.
- [ ] Anonimizar nomes reais nas fixtures antes de gravar.

### Task 1: Scaffold + codificação Latin-1

**Files:** Create `sei-nucleo/{package.json,tsconfig.json,build.mjs,README.md}`,
`sei-nucleo/src/sessao/codificacao.ts`, `sei-nucleo/tests/verificar.ts`, `sei-nucleo/tests/util.ts`

**Produces:** `codificarLatin1(campos: [string,string][]): string`, `decodificarLatin1(buf: ArrayBuffer): string`,
`paraLatin1Seguro(texto: string): string`.

- [ ] Teste: `ação` → `a%E7%E3o`; `+` → `%2B`; espaço → `+`; travessão `—` → `-`; aspas curvas → retas;
      `€` → `&#8364;`; emoji → `&#128512;`; `\r\n` preservado como `%0D%0A`.
- [ ] Implementar; rodar `npx tsx tests/verificar.ts` → verde.

### Task 2: Sessão, páginas e erros

**Files:** `sei-nucleo/src/sessao/{erros.ts,http.ts,versao.ts,sessao.ts}`

**Produces:**
```ts
class ErroSei extends Error { codigo: CodigoErro; detalhe?: string }
type CodigoErro = 'SEI_SESSAO_EXPIRADA'|'SEI_VALIDACAO'|'SEI_SEM_PERMISSAO'|'SEI_NAO_ENCONTRADO'
  |'SEI_SIGILOSO'|'SEI_ACAO_INDISPONIVEL'|'SEI_RESPOSTA_INESPERADA'|'SEI_REDE'|'CANCELADO';
interface Pagina { url: string; html: string; doc: Document }
interface Http { obter(url: string, op?: OpcoesHttp): Promise<Pagina>;
                 enviar(url: string, campos: [string,string][], op?: OpcoesHttp): Promise<Pagina> }
function criarHttp(base: URL, deps?: {fetch?: typeof fetch; parser?: (html:string)=>Document}): Http
function lerVersao(doc: Document): VersaoSei
```
- [ ] Testes com `fetch` falso: resposta de login → `SEI_SESSAO_EXPIRADA`; `#txaInfraValidacao`
      / `alert('...')` no retorno → `SEI_VALIDACAO` com a mensagem; decodificação Latin-1.
- [ ] Implementar e passar.

### Task 3: Motor de formulário

**Files:** `sei-nucleo/src/formulario/formulario.ts`

**Produces:**
```ts
class Formulario { static abrir(http: Http, url: string, seletor: string): Promise<Formulario>
  static de(pagina: Pagina, seletor: string): Formulario
  campos(): [string,string][]; valor(nome: string): string|undefined;
  definir(v: Record<string,string|null>): this; definirLupa(sufixo: string, itens: {id:string;texto:string}[]): this;
  enviar(op?: {botao?: string; sucesso?: (p: Pagina)=>boolean}): Promise<Pagina> }
const urlContem: (trecho: string) => (p: Pagina) => boolean
```
- [ ] Testes sobre fixtures `procedimento_alterar` e `documento_cadastro`: coleta igual à de um
      navegador (radio marcado, select selecionado, disabled fora); `definirLupa` gera
      `id±texto¥…`; `enviar` sem prova de sucesso → `SEI_RESPOSTA_INESPERADA`.

### Task 4: Links assinados e árvore

**Files:** `sei-nucleo/src/links/links.ts`, `sei-nucleo/src/dominio/arvore.ts`

**Produces:**
```ts
function linksDoTexto(html: string): string[]           // controlador.php?acao=... com infra_hash
function linkDaAcao(fonte: string|Document, acao: string): string|null  // um só, nunca junta
interface NoArvore { id: string; tipo: 'PROCESSO'|'DOCUMENTO'|'PASTA'|string; nome: string;
  numero?: string; acoes: string; src?: string; icone?: string; tooltip?: string }
function lerNosArvore(html: string): NoArvore[]
async function abrirProcesso(http, idProcedimento): Promise<ProcessoAberto> // trabalhar → árvore
interface ProcessoAberto { id: string; protocolo: string; html: string; nos: NoArvore[];
  acao(nome: string): string|null; paginaArvore: Pagina }
```
- [ ] Testes com a fixture da árvore: nós de documento com número SEI, id, nível (ícone de
      restrito/sigiloso), assinatura; pastas; `acao('procedimento_alterar')` único.

### Task 5: Domínio F1 — leitura

**Files:** `sei-nucleo/src/dominio/{contexto,processo,documento,historico,caixa,opcoes}.ts`

**Produces:** `lerContextoTela(doc, url)`, `localizarProcesso(http, protocolo)`, `consultarProcesso`,
`listarDocumentos`, `lerDocumento` (HTML→texto markdown leve), `andamentos`, `listarProcessosCaixa`,
`opcoes.*`. Tipos exportados em `sei-nucleo/src/tipos.ts`.
- [ ] Um teste por parser sobre as fixtures; bloqueio de sigiloso em `lerDocumento`.

### Task 6: Domínio F1 — escrita

**Files:** `sei-nucleo/src/dominio/{marcador,anotacao,andamento,atribuicao,acompanhamento}.ts`,
edições em `processo.ts`/`documento.ts` (`alterarProcesso`, `criarDocumento`, `alterarDocumento`).
Cada escrita expõe `previsualizar` (lê o estado atual) e `executar` (grava + prova).
- [ ] Testes de montagem de campos sobre fixtures; validação ao vivo na Task 13.

### Task 7: Privacidade

**Files:** Modify `ferramentas-pdf/src/lib/ferramentas/tarjar/deteccao.ts` (extrair núcleo sem
geometria: `detectarIntervalos(base, opcoes, aceitar)`); Create `sei-nucleo/src/privacidade/{anonimizar.ts,rotulos.ts}`

**Produces:**
```ts
class Pseudonimos { anonimizar(texto: string, extras?: {pessoas?: string[]}): string;
  reidratar(texto: string): string; contagem(): Record<string, number>; exportar(); importar() }
```
- [ ] Testes: CPF válido vira `[CPF_1]` e o mesmo CPF repetido reusa o rótulo; CPF inválido fica;
      e-mail, telefone, CNPJ; nome de interessado (sem acento/caixa); rótulo "residente e domiciliado";
      `reidratar(anonimizar(x)) === x` para os trechos substituídos; `infra_hash` removido.
- [ ] `cd ferramentas-pdf && npm run verificar:tarjar` continua verde.

### Task 8: Motor — esquema, registro, provedor, loop, plano

**Files:** `agente-ia/src/motor/{esquema.ts,tools.ts,provedor.ts,sse.ts,motor.ts,plano.ts,contexto.ts}`

**Produces:**
```ts
function definirTool<A>(d: DefTool<A>): DefTool<A>
type Efeito = 'leitura'|'escrita'|'irreversivel'|'assinatura'
interface Provedor { conversar(req: PedidoLLM, sinal: AbortSignal, aoTexto:(t:string)=>void): Promise<RespostaLLM> }
function criarProvedorOpenRouter(chave: string, modelo: string): Provedor
class Motor { constructor(o: {provedor; tools; hooks; ui: InterfaceMotor})
  enviar(texto: string): Promise<void>; parar(): void; historico(): Mensagem[] }
interface InterfaceMotor { texto(delta); toolIniciada(c); toolTerminada(c, r);
  aprovarPlano(p: PlanoPrevisto): Promise<DecisaoPlano>; consentir(tipo): Promise<boolean>;
  pedirSenha(p): Promise<{cargo:string; senha:string}|null>; perguntar(q): Promise<string> }
```
- [ ] Testes: validador de esquema; parser SSE com tool_calls fragmentados; loop com provedor
      falso (leitura → resposta; escrita → plano → aprovado → executado sem novo LLM; recusado →
      motivo volta ao modelo); referências `$1.x`; limite de passos; hook nega sigiloso.

### Task 9: Ponte e tools F1

**Files:** `agente-ia/src/ponte/{protocolo.ts,init-agente.ts,cliente.ts,pagina-agente.ts,operacoes.ts}`,
`agente-ia/src/tools/*.ts`, `agente-ia/src/skills/*.md`

- [ ] Protocolo com id/progresso/cancelamento; operações = funções do núcleo + gate de sigilo +
      anonimização; editor via mundo da página.
- [ ] Tools F1 com descrições para o modelo; teste de contrato (todo esquema válido, toda escrita
      com `previsualizar`).

### Task 10: Painel

**Files:** `agente-ia/src/painel/*.ts`, `agente-ia/painel.html`, `agente-ia/painel.css`, build →
`dist/html/agente.html`, `dist/js/agente/painel.js`, `dist/css/agente.css`

- [ ] Configuração (chave, modelo), conversa com streaming, cartões de tool/plano/consentimento/
      senha, tarefas, custo, anexos CSV.

### Task 11: Manifest, background e botão

**Files:** Modify `dist/manifest.json`, `dist/background.js`, `dist/js/sei-pro-all.js` (link no menu),
`dist/js/sei-functions-pro.js` (ícone na barra do processo)

### Task 12: Documentação

**Files:** `sei-nucleo/README.md`, `sei-nucleo/MIGRACAO.md`, `agente-ia/README.md`, `pages/AGENTEIA.md`

### Task 13: Validação E2E no SEI SP

- [ ] Harness puppeteer com a extensão; cada tool F1 via ponte com provedor falso; conferir
      efeito na tela; GIF opcional.
