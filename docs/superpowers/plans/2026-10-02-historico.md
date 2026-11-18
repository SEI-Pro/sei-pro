# Histórico de Processos Visitados (TS) — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever o Histórico de Processos Visitados como módulo TypeScript (`historico/`). Ele abre em **modal** no SEI e numa **aba nova da barra lateral**, com o visual do Favoritos, seletores inteligentes, busca, linha do tempo, ligação com os Favoritos, privacidade e uma ferramenta do Agente de IA.

**Architecture:**
- Pacote novo `historico/`, irmão de `favoritos/`, com o mesmo build (esbuild) e as mesmas provas (tsx + linkedom).
- A infraestrutura que os dois usam vai para o `sei-comum`, que não depende do núcleo, e para o `sei-nucleo`, que conhece o SEI:
  - para o `sei-comum`: ponte lateral, conexão do app com a aba, abrir processo, tema, aviso do app, CSV, shell da barra lateral e CSS de lista;
  - para o `sei-nucleo`: página viva e consulta do processo pela árvore já aberta.
- O app é uma página da extensão (`html/historico.html`) em dois modos: `#modo=modal`, num iframe sobre a tela do SEI, e `#modo=lateral`, no `painel.html`.
- O content script `init_historico.js` registra a visita no frame da árvore e, no topo, abre o modal e atende a barra lateral.

**Tech Stack:** TypeScript 5.9, esbuild 0.25 (`charset: "ascii"`), Biome 2, tsx + linkedom para as provas, `chrome.storage.local`, `chrome.runtime` (portas) e MV3 `side_panel`.

**Spec:** `docs/superpowers/specs/2026-10-02-historico-design.md` (ler antes de qualquer tarefa).

## Global Constraints

- **Worktree:** `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-historico`, na branch `feat/historico-ts`. **Nunca** `git add -A`: adicione por caminho explícito. Confira `git branch --show-current` antes de comitar.
- **Commits:** terminam com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. A mensagem é em português, sem acento (padrão do repo: "Historico: ...").
- **Idioma:** textos de interface, comentários e nomes em português do Brasil, como no Favoritos.
- **`dist/js/*.js` só com ASCII:**
  - nos arquivos gerados, o esbuild (`charset: "ascii"`) e o portão de bytes do `build.mjs` garantem isso;
  - nos arquivos legados editados à mão (`dist/js/sei-functions-pro.js`, `dist/background.js`), acento só como `\uXXXX`. Confira por bytes: `python3 -c "import sys;b=open(sys.argv[1],'rb').read();print([i for i,c in enumerate(b) if c>127][:5])" arquivo`.
- **Nada de regex com `̀-ͯ` escrito à mão** nos `.ts`: o Write/Edit converte o escape em caractere cru e o portão do build falha. Para busca sem acento, use `normalizarTexto` de `@comum/texto`.
- **DOM só por `h()`** de `@comum/ui/dom`, nunca `innerHTML` com dado do SEI.
- **Montar link do SEI à mão é proibido** (derruba a sessão). Para abrir processo, use `abrirProcesso` (linha da caixa ou pesquisa rápida).
- **Sigiloso:** nunca guardar especificação, interessados nem assuntos, e nunca fazer o GET de consulta. O agente nunca recebe sigiloso, nem o número.
- **Provas que não podem cair** (linha de base em 02/10/2026): `sei-comum` 163, `sei-nucleo` 99, `favoritos` 572 e `agente-ia` 1012. Cada pacote roda `npm run verificar`, `npm run tipos` e, onde existe, `npm run checar`.
- **Manifest:** só `dist/manifest.json` (Lab MV3) muda. Os outros manifests ficam intactos (são gitignored, exceto este).
- **Preferências do histórico:** em `chrome.storage.local` (`historico/preferencias`), não no `sync`.

## Review Focus

1. **Recarga da árvore em sequência.** Criar documento, assinar, voltar: a árvore recarrega 3 vezes em 1 minuto. O esperado é `vezes` sem mudar e **um único** GET de consulta. Coberto pelas provas da Tarefa 5 (`registrar` dentro de 30 min) e da Tarefa 9 (`tentouEm` segura o segundo GET).
2. **Processo que vira sigiloso depois de visitado.** A visita perde especificação, interessados e assuntos na próxima abertura e some do agente. Coberto pelas provas da Tarefa 5 (`registrar` e `completar` com nível sigiloso) e da Tarefa 16 (agente).
3. **Seleção com filtro trocado.** Selecionar 5, filtrar até sobrarem 2 e clicar "Remover": só os 2 visíveis saem. Coberto pela prova da Tarefa 11.
4. **Fechar o modal de todas as formas** (Esc, X, véu, abrir processo, extensão recarregada com a porta caindo). Em todas, a página do SEI volta a rolar e não fica camada invisível por cima. Coberto pelas provas da Tarefa 13.
5. **Busca com número formatado de outro jeito.** "50300.018905/2018-67", "50300018905201867" e "018905/2018" acham o mesmo processo, e "licitação 2024" **não** casa só pelo "2024" do número. Coberto pela prova da Tarefa 6.

---

## Mapa de arquivos

**sei-comum/src** (novos):
- `ponte/lateral.ts`: `PonteLateral`, `ligarLadoAba`, `EstadoAba`, `AbaLateral`, `Remetente`, com a chave do anúncio por parâmetro.
- `ponte/conexaoDaAba.ts`: `esperarConexaoDaAba(canal)`.
- `pagina/abrir.ts`: `abrirProcesso`, `localizarAbertura` (movidos de `favoritos/src/pagina/abrir.ts`).
- `pagina/tema.ts`: `temaEscuroLegado`, `corDoTemaSei`, `destaqueDaCorSei`.
- `ui/aviso.ts`: `avisar`, `mostrarAviso`, `definirEmissorDeAviso`, `AcaoAviso`, `EmissorAviso` (movidos de `favoritos/src/app/aviso.ts`).
- `csv.ts`: `gerarCsv`.
- `painel/shell.ts`: `montarAbas`, `DefAba`, `CHAVE_ABA`.
- `ui/lista.css`: classes `spro-lista-*` e `.spro-dialogo`.

**sei-nucleo/src:**
- `sessao/pagina.ts` (novo): `paginaDe`, `documentoTopo`.
- `dominio/processo.ts`: + `consultarDaArvore`, `MetadadosProcesso`.

**favoritos/src:** só troca de imports e o shell vira invólucro (`shell/painel.ts` e `shell/main.ts`). Saem `app/lateral.ts`, `pagina/lateral.ts`, `app/ponte.ts`, `pagina/abrir.ts` e `app/aviso.ts`. O `pagina/contexto.ts` e o `modelo/cores.ts` reexportam o que saiu deles.

**historico/** (novo):
- `package.json`, `tsconfig.json`, `biome.json`, `build.mjs`, `README.md`
- `estatico/historico.html`, `estatico/historico.css`
- `src/modelo/tipos.ts`, `constantes.ts`, `dias.ts`, `visita.ts`, `operacoes.ts`, `csv.ts`
- `src/repositorio.ts`, `src/preferencias.ts`
- `src/migracao/legado.ts`
- `src/pagina/main.ts`, `marca.ts`, `contexto.ts`, `captura.ts`, `migrar.ts`, `executor.ts`, `modal.ts`, `lateral.ts`
- `src/app/main.ts`, `app.ts`, `favoritos.ts`, `componentes/filtros.ts`, `componentes/item.ts`, `componentes/lista.ts`, `componentes/dialogos.ts`
- `tests/util.ts`, `tests/verificar.ts`, `tests/verificar-*.ts`

**dist/:** `manifest.json`, `background.js`, `js/sei-functions-pro.js`. Gerados: `js/init_historico.js`, `js/historico/app.js`, `html/historico.html`, `css/historico.css` e, regerados, `js/favoritos/*`, `js/init_favoritos.js`, `css/favoritos.css`, `css/painel.css`, `html/painel.html` e os bundles do agente.

**agente-ia/:** `src/tools/historico.ts` (novo), `src/tools/sei.ts`, `src/painel/sugestoes.ts`, `tsconfig.json`.

---

## FASE 0: extração (o Favoritos continua verde)

### Task 1: ponte, abrir, tema, aviso e CSV no sei-comum

**Files:**
- Create: `sei-comum/src/ponte/lateral.ts`, `sei-comum/src/ponte/conexaoDaAba.ts`, `sei-comum/src/pagina/abrir.ts`, `sei-comum/src/pagina/tema.ts`, `sei-comum/src/ui/aviso.ts`, `sei-comum/src/csv.ts`
- Create: `sei-comum/tests/verificar-lateral.ts` (ou acrescentar ao executor existente da sei-comum; veja `sei-comum/tests/verificar.ts`)
- Modify: `favoritos/src/app/main.ts`, `favoritos/src/app/app.ts`, `favoritos/src/pagina/main.ts`, `favoritos/src/pagina/executor.ts`, `favoritos/src/pagina/contexto.ts`, `favoritos/src/modelo/cores.ts`, `favoritos/src/app/csv.ts` e qualquer outro que importe os arquivos que saem (`grep -rn` antes de apagar)
- Delete: `favoritos/src/app/lateral.ts`, `favoritos/src/pagina/lateral.ts`, `favoritos/src/app/ponte.ts`, `favoritos/src/pagina/abrir.ts`, `favoritos/src/app/aviso.ts`
- Modify tests: `favoritos/tests/verificar-lateral.ts` e os outros que importavam os arquivos que saíram

**Interfaces:**
- Produces:
```ts
// @comum/ponte/lateral
export interface EstadoAba { visivel: boolean; foco: number; chave: string }
export interface AbaLateral extends AbaCandidata { rpc: Rpc; chave: string }
export interface Remetente { tab?: { id?: number; windowId?: number }; frameId?: number }
export interface DepsLadoApp { area: Area; chave: string; ouvirConexoes(cb: (porta: PortaRpc, r: Remetente) => void): void; janela: number; novoId(): string }
export class PonteLateral { constructor(d: DepsLadoApp); iniciar(): Promise<void>; atual(): AbaLateral | null; daChave(chave: string): AbaLateral | null; aoMudar(cb: () => void): () => void; encerrar(): Promise<void> }
export interface DepsLadoAba { area: Area; chave: string; conectar(): PortaRpc; tratadores: Record<string, Tratador>; estado(): EstadoAba }
export function ligarLadoAba(d: DepsLadoAba): { apresentar(): void; verificar(): void; parar(): void }
// @comum/ponte/conexaoDaAba
export function esperarConexaoDaAba(canal: string): Promise<Rpc>
// @comum/pagina/abrir
export type Abertura = { tipo: "linha"; link: HTMLAnchorElement } | { tipo: "pesquisa"; form: HTMLFormElement; campo: HTMLInputElement };
export function localizarAbertura(doc: Document, id: string): Abertura | null
export function abrirProcesso(doc: Document, id: string, protocolo: string, novaAba: boolean): "linha" | "pesquisa"
// @comum/pagina/tema
export function temaEscuroLegado(armazenamento: Pick<Storage, "getItem">): boolean
export function corDoTemaSei(doc: Document): string | undefined
export function destaqueDaCorSei(css: string): string | null
// @comum/ui/aviso
export interface AcaoAviso { rotulo: string; fazer(): void }
export type EmissorAviso = (texto: string, acao: AcaoAviso | undefined, ms: number) => boolean;
export function definirEmissorDeAviso(e: EmissorAviso | null): void
export function avisar(texto: string, acao?: AcaoAviso, ms?: number): void
export function mostrarAviso(doc: Document, texto: string, acao: AcaoAviso | undefined, ms: number): HTMLElement
// @comum/csv
export function gerarCsv(linhas: string[][]): string
```

- [ ] **Step 1: Mover o código sem mudar o comportamento.**
  - Os arquivos novos são cópias fiéis dos antigos, com uma diferença na ponte lateral: `CHAVE_LATERAL` deixa de ser importada e passa a ser `d.chave` (nos dois lados: anúncio, leitura e `aoMudar`). O resto do arquivo fica igual.
  - `esperarConexaoDaAba(canal)` compara `porta.name !== canal`, e o `console.info` vira `` `[SEI Pro] ${canal} conectado` ``.
  - Em `pagina/tema.ts` entram `temaEscuroLegado` e `corDoTemaSei` (de `favoritos/src/pagina/contexto.ts`) e `destaqueDaCorSei` (de `favoritos/src/modelo/cores.ts`, junto com os auxiliares privados que ele usar).
  - Em `ui/aviso.ts` entra o arquivo `favoritos/src/app/aviso.ts` inteiro.
  - Em `csv.ts` entra só `gerarCsv` (de `favoritos/src/app/csv.ts`); o `linhasCsv` fica no Favoritos.
- [ ] **Step 2: Religar o Favoritos.**
  - `favoritos/src/pagina/contexto.ts` passa a `export { temaEscuroLegado, corDoTemaSei } from "@comum/pagina/tema";`.
  - `favoritos/src/modelo/cores.ts` passa a `export { destaqueDaCorSei } from "@comum/pagina/tema";`.
  - Os outros importadores apontam para `@comum/...`.
  - `favoritos/src/app/main.ts`:
    - `new PonteLateral({ area: b.area, chave: CHAVE_LATERAL, janela, novoId: () => novoId(), ouvirConexoes: ... })`;
    - `esperarConexaoDaAba(CANAL_FAVORITOS)`.
  - `favoritos/src/pagina/main.ts`: `ligarLadoAba({ area, chave: CHAVE_LATERAL, conectar: ..., tratadores: ..., estado: ... })`.
  - A reexportação `chaveDoContexto` que vivia em `app/lateral.ts`: quem a usava passa a importar de `../modelo/escopo`.
- [ ] **Step 3: Escrever a prova nova na sei-comum** (`verificar-lateral.ts`, registrada no `sei-comum/tests/verificar.ts`). Ela confirma que a chave é parâmetro: duas pontes com chaves diferentes na mesma área não se enxergam.
```ts
import { areaMemoria } from "../src/armazenamento/area";
import { parDePortas } from "../src/ponte/parDePortas";
import { criarRpc, type PortaRpc } from "../src/ponte/rpc";
import { ligarLadoAba, PonteLateral, type Remetente } from "../src/ponte/lateral";
import { checar, secao } from "./util";

const tique = (ms = 5) => new Promise((r) => setTimeout(r, ms));

export async function verificarPonteLateralGenerica(): Promise<void> {
  secao("ponte lateral: a chave do anuncio e parametro");
  const area = areaMemoria();
  const ouvintes: Array<(p: PortaRpc, r: Remetente) => void> = [];
  const app = new PonteLateral({ area, chave: "x/lateral", janela: 1, novoId: () => "app1", ouvirConexoes: (cb) => ouvintes.push(cb) });
  await app.iniciar();
  checar("anuncia na chave pedida", "x/lateral" in (await area.obter("x/lateral")));
  let conectouY = 0;
  ligarLadoAba({ area, chave: "y/lateral", conectar: () => { conectouY++; return parDePortas()[0]; }, tratadores: {}, estado: () => ({ visivel: true, foco: 1, chave: "k" }) });
  await tique();
  checar("aba de outra chave nao conecta", conectouY === 0);
  ligarLadoAba({
    area, chave: "x/lateral",
    conectar: () => { const [daAba, doApp] = parDePortas(); for (const o of ouvintes) o(doApp, { tab: { id: 7, windowId: 1 }, frameId: 0 }); return daAba; },
    tratadores: {}, estado: () => ({ visivel: true, foco: 2, chave: "sei|ana" }),
  });
  await tique(20);
  checar("aba da mesma chave conecta e se apresenta", app.atual()?.chave === "sei|ana");
  await app.encerrar();
  checar("encerrar retira o proprio anuncio", !("x/lateral" in (await area.obter("x/lateral"))));
  void criarRpc;
}
```
- [ ] **Step 4: Ajustar as provas do Favoritos** que importavam os arquivos que saíram. `verificar-lateral.ts` importa de `@comum/ponte/lateral` e passa `chave: CHAVE_LATERAL` nos dois lados. As verificações continuam as mesmas.
- [ ] **Step 5: Rodar tudo.**
  - Em `sei-comum`: `npm run tipos && npm run checar && npm run verificar`. Esperado: 163 + as novas, 0 falhas.
  - Em `favoritos`: `npm run tipos && npm run checar && npm run verificar`. Esperado: 572 ok, 0 falhas.
  - Em `agente-ia`: `npm run tipos`. Ele importa `@favoritos/...` e não pode quebrar.
- [ ] **Step 6: Commit.**
```bash
git add sei-comum/src/ponte/lateral.ts sei-comum/src/ponte/conexaoDaAba.ts sei-comum/src/pagina sei-comum/src/ui/aviso.ts sei-comum/src/csv.ts sei-comum/tests favoritos/src favoritos/tests
git commit -m "sei-comum: ponte lateral, conexao da aba, abrir processo, tema, aviso e CSV saem do favoritos (chave do anuncio por parametro)"
```

### Task 2: shell da barra lateral genérico e a terceira aba

**Files:**
- Create: `sei-comum/src/painel/shell.ts`
- Modify: `favoritos/src/shell/painel.ts` (vira invólucro), `favoritos/src/shell/main.ts`, `favoritos/estatico/painel.css`, `favoritos/tests/verificar-shell.ts`, `dist/background.js`

**Interfaces:**
- Produces:
```ts
// @comum/painel/shell
export const CHAVE_ABA = "painelAba";
export interface DefAba {
  id: string; rotulo: string; icone: NomeIcone; caminho: string; titulo: string;
  /** Selo de pendências: chave no storage.local com um número; `dica(n)` vira o title do botão. */
  contador?: { chave: string; dica(n: number): string };
}
export interface DepsAbas { sessao: Area; local?: Area; abas: DefAba[]; url(caminho: string): string; abaDoEndereco?: string | null }
export function montarAbas(raiz: HTMLElement, d: DepsAbas): Promise<{ mostrar(aba: string): void; atual(): string }>
// favoritos/src/shell/painel.ts (invólucro, mesma assinatura de antes + temHistorico)
export type AbaPainel = "favoritos" | "historico" | "agente";
export interface DepsShell { sessao: Area; temAgente: boolean; temFavoritos?: boolean; temHistorico?: boolean; url(c: string): string; abaDoEndereco?: AbaPainel | null; local?: Area }
export const CHAVE_CONTADOR = "favoritos/contadorPainel";
export function montarShell(raiz: HTMLElement, d: DepsShell): Promise<{ mostrar(aba: AbaPainel): void; atual(): AbaPainel }>
```

- [ ] **Step 1: Escrever as provas novas em `favoritos/tests/verificar-shell.ts`** (as antigas continuam):
```ts
secao("painel lateral: tres abas na ordem Favoritos | Historico | Agente");
{
  const doc = instalarDom('<html><body><div id="painel"></div></body></html>');
  const raiz = doc.getElementById("painel")!;
  const shell = await montarShell(raiz, { sessao: areaMemoria({ painelAba: "historico" }), temAgente: true, temHistorico: true, url });
  const rotulos = [...raiz.querySelectorAll('[role="tab"]')].map((b) => b.getAttribute("aria-label"));
  checar("ordem das abas", JSON.stringify(rotulos) === JSON.stringify(["Favoritos", "Histórico", "Agente de IA"]), rotulos);
  checar("abre na aba historico pedida", shell.atual() === "historico");
  const f = raiz.querySelector("iframe") as HTMLIFrameElement;
  checar("iframe do historico em modo lateral", f.src.endsWith("html/historico.html#modo=lateral"));
}
{
  const doc = instalarDom('<html><body><div id="painel"></div></body></html>');
  const raiz = doc.getElementById("painel")!;
  await montarShell(raiz, { sessao: areaMemoria(), temAgente: true, url });
  checar("sem init_historico no manifest, nao ha aba Historico", !botao(raiz, "Histórico"));
}
```
- [ ] **Step 2: Rodar `npm run verificar` em favoritos.** Esperado: as provas novas FALHAM (não existe `temHistorico`).
- [ ] **Step 3: Implementar `montarAbas`.** É o corpo atual de `montarShell` generalizado:
  - `defs = d.abas`;
  - `valida` aceita os ids de `d.abas`;
  - o contador vale para qualquer aba com `contador`. O `aria-label` do botão fica `` `${rotulo} (${n})` `` com n > 0 e `rotulo` sem pendências; o `title` vem de `contador.dica(n)` e fica vazio com 0.
  - Sem abas, `atual()` devolve `""`.
- [ ] **Step 4: Transformar `montarShell` em invólucro.** Ele monta as `DefAba`, na ordem:
  - Favoritos, se `temFavoritos !== false`: `{ id: "favoritos", rotulo: "Favoritos", icone: "estrela", caminho: "html/favoritos.html#modo=lateral", titulo: "Favoritos do SEI Pro", contador: { chave: CHAVE_CONTADOR, dica: (n) => `${n} ${n === 1 ? "favorito pede" : "favoritos pedem"} atenção (lembrete ou novidade)` } }`;
  - Histórico, se `temHistorico === true`: `{ id: "historico", rotulo: "Histórico", icone: "historico", caminho: "html/historico.html#modo=lateral", titulo: "Histórico de processos visitados" }`;
  - Agente, se `temAgente`: a definição atual.

  Depois chama `montarAbas(raiz, { sessao, local, abas, url, abaDoEndereco })` e devolve o mesmo objeto com o tipo `AbaPainel`.
- [ ] **Step 5: Atualizar `favoritos/src/shell/main.ts`.**
  - `const temHistorico = (manifesto.content_scripts ?? []).some((c) => c.js?.includes("js/init_historico.js"));` e passar adiante;
  - `abaDoEndereco` passa a aceitar `"historico"`.
- [ ] **Step 6: Ajustar `favoritos/estatico/painel.css` para caber 3 abas** num painel de 320 px:
  - `.painel-abas button { min-width: 0; padding: 7px 10px 9px; }`;
  - o rótulo (`span` que não é `.painel-conta`) com `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
  - `@container`, ou `@media (max-width: 340px)` (o painel é a janela do iframe), esconde os rótulos e deixa só os ícones. O `aria-label` e um `title` igual ao rótulo continuam lá.
- [ ] **Step 7: `dist/background.js`, no listener de `abrirPainel`:**
```js
  var aba = msg.tipo === "abrirAgente" || msg.aba === "agente" ? "agente" : msg.aba === "historico" ? "historico" : "favoritos";
```
  Atualize também o comentário do bloco: "abas Favoritos | Historico | Agente".
- [ ] **Step 8: Rodar** favoritos `npm run tipos && npm run checar && npm run verificar` (572 + as novas, 0 falhas) e sei-comum `npm run tipos`. Depois o `node -e "new Function(require('fs').readFileSync('dist/background.js','utf8'))"` (sintaxe) e a conferência de bytes do `background.js`.
- [ ] **Step 9: Commit.**
```bash
git add sei-comum/src/painel favoritos/src/shell favoritos/estatico/painel.css favoritos/tests/verificar-shell.ts dist/background.js
git commit -m "Painel lateral: shell generico no sei-comum e aba Historico (quando o manifest tem init_historico)"
```

### Task 3: núcleo — página viva e consulta pela árvore aberta

**Files:**
- Create: `sei-nucleo/src/sessao/pagina.ts`
- Modify: `sei-nucleo/src/dominio/processo.ts`, `sei-nucleo/tests/verificar-dominio.ts` (ou um arquivo novo registrado no `sei-nucleo/tests/verificar.ts`), `favoritos/src/pagina/contexto.ts`

**Interfaces:**
- Produces:
```ts
// @nucleo/sessao/pagina
export function paginaDe(doc: Document, url?: string): Pagina
export function documentoTopo(): Document
// @nucleo/dominio/processo
export interface MetadadosProcesso { tipo: string; especificacao: string; assuntos: string[]; interessados: string[]; observacoes: string; editavel: boolean }
export function consultarDaArvore(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<MetadadosProcesso>
```

- [ ] **Step 1: Escrever a prova** com as fixtures reais `sei41/arvore.html` e `sei41/p_procedimento_alterar.html`.
  - Use o mesmo jeito de falsificar o `Http` que `sei-nucleo/tests/verificar-dominio.ts` já usa: leia o arquivo e copie o padrão.
  - O que a prova confirma:
    - `consultarDaArvore` faz **um** GET, no link `procedimento_alterar` da árvore;
    - devolve `tipo`, `especificacao`, `assuntos` e `interessados` iguais aos que `consultarProcesso` devolve para a mesma fixture;
    - não chama a pesquisa rápida nem `procedimento_trabalhar`.
  - Mais uma prova: árvore sem link de alterar nem de consultar → `ErroSei` com código `SEI_ACAO_INDISPONIVEL`.
- [ ] **Step 2: Rodar `npm run verificar` em sei-nucleo.** Esperado: FALHA (função inexistente).
- [ ] **Step 3: Implementar.**
  - `formularioProcesso` passa a receber `http: Http` no lugar de `sei: Sei` e usa `Formulario.abrir(http, ...)`.
  - `consultarDaArvore(http, arv, op)` chama `formularioProcesso` e monta `MetadadosProcesso` com as mesmas leituras de `consultarProcesso`.
  - `consultarProcesso` passa a usar `consultarDaArvore(sei.http, arv, op)`. A trava de sigiloso continua **só** em `consultarProcesso`.
  - O `alterarProcesso` (e quem mais chamava `formularioProcesso`) passa `sei.http`.
  - `sessao/pagina.ts` recebe `paginaDe` e `documentoTopo` de `favoritos/src/pagina/contexto.ts`, iguais.
  - `favoritos/src/pagina/contexto.ts` passa a `export { paginaDe, documentoTopo } from "@nucleo/sessao/pagina";` e mantém `contextoDe`.
- [ ] **Step 4: Rodar** sei-nucleo `npm run tipos && npm run verificar` (99 + as novas), favoritos `npm run tipos && npm run verificar` (572) e agente-ia `npm run tipos && npm run verificar` (1012).
- [ ] **Step 5: Commit.**
```bash
git add sei-nucleo/src sei-nucleo/tests favoritos/src/pagina/contexto.ts
git commit -m "Nucleo: consultarDaArvore (metadados pela arvore ja aberta, sem buscar de novo) e paginaDe/documentoTopo"
```

---

## FASE 1: modelo, repositório, migração e captura

### Task 4: pacote `historico/`, tipos, constantes e dias

**Files:**
- Create: `historico/package.json`, `historico/tsconfig.json`, `historico/biome.json`, `historico/README.md`, `historico/build.mjs` (por enquanto sem entradas de app e página: entram nas Tasks 12 a 14), `historico/src/modelo/tipos.ts`, `historico/src/modelo/constantes.ts`, `historico/src/modelo/dias.ts`, `historico/tests/util.ts`, `historico/tests/verificar.ts`, `historico/tests/verificar-dias.ts`

**Interfaces:**
- Produces (exato):
```ts
// historico/src/modelo/tipos.ts
export type Nivel = "publico" | "restrito" | "sigiloso";
export interface UnidadeVisita { id: string; sigla: string }
export interface Visita {
  id: string; protocolo: string; tipo?: string; especificacao?: string; interessados?: string[]; assuntos?: string[];
  nivel?: Nivel; unidades: UnidadeVisita[]; primeira: number; ultima: number; vezes: number;
  completadoEm?: number; tentouEm?: number; origem?: "legado";
}
export interface DadosVisita { id: string; protocolo: string; tipo?: string; nivel?: Nivel; unidade?: UnidadeVisita | null }
export interface DadosCompletos { tipo?: string; especificacao?: string; interessados?: string[]; assuntos?: string[]; nivel?: Nivel }
export type Limite = 500 | 1000 | 2000 | 5000;
export const LIMITES: readonly Limite[] = [500, 1000, 2000, 5000];
export type Ordem = "recentes" | "visitados" | "protocolo";
export const ORDENS: readonly Ordem[] = ["recentes", "visitados", "protocolo"];
export interface Preferencias { registrar: boolean; limite: Limite; ordem: Ordem; agruparPorDia: boolean }
export const PREFERENCIAS_PADRAO: Preferencias = { registrar: true, limite: 1000, ordem: "recentes", agruparPorDia: true };
export type Periodo = "hoje" | "ontem" | "7dias" | "30dias" | "antigos";
export const PERIODOS: readonly Periodo[] = ["hoje", "ontem", "7dias", "30dias", "antigos"];
export type Situacao = "favoritos" | "foraFavoritos" | "repetidos" | "publico" | "restrito" | "sigiloso";
export const SITUACOES: readonly Situacao[] = ["favoritos", "foraFavoritos", "repetidos", "publico", "restrito", "sigiloso"];
export interface Filtro { busca?: string; periodos?: Periodo[]; tipos?: string[]; unidades?: string[]; interessados?: string[]; assuntos?: string[]; situacoes?: Situacao[] }
export type PeriodoApagar = "hora" | "hoje" | "7dias" | "30dias" | "tudo";
export interface MetaHistorico { migradoEm?: number; migrados?: number; avisoMigracao?: boolean; apagarLegado?: boolean }
export interface ContextoHistorico {
  host: string; login: string; nome: string;
  unidade: { id: string; sigla: string; nome: string } | null;
  versao: string; temaEscuro: boolean; corTema?: string;
  /** Manifest com js/init_favoritos.js E opção gerenciarfavoritos ligada. */
  favoritosAtivo: boolean;
  /** O pacote tem painel lateral (side_panel/sidebar_action). */
  lateralDisponivel: boolean;
}
// historico/src/modelo/constantes.ts
export const CANAL_HISTORICO = "seipro-historico";
export const CANAL_LATERAL = "seipro-historico-lateral";
export const CHAVE_LATERAL = "historico/lateralAberto";
export const CHAVE_PREFERENCIAS = "historico/preferencias";
export const EVENTO_ABRIR = "spro-historico-abrir";
export const ATRIBUTO_ATIVO = "data-seipro-historico";
export const LEGADO_CHAVE = "dadosHistoricoProcessoPro";
export const INTERVALO_VISITA_MS = 30 * 60_000;
export const VALIDADE_COMPLETAR_MS = 12 * 3_600_000;
export const ESPERA_TENTATIVA_MS = 2 * 60_000;
export const MAX_UNIDADES = 10;
export const MAX_LISTA = 50;
export const PAGINA_LISTA = 200;
export const chaveEscopo = (host: string, login: string): string => `${host}|${login.trim().toLowerCase()}`;
export const prefixoVisitas = (escopo: string): string => `historico/${escopo}/v/`;
export const chaveMeta = (escopo: string): string => `historico/${escopo}/meta`;
// historico/src/modelo/dias.ts
export type Grupo = Periodo;
export const GRUPOS: readonly Grupo[];
export const ROTULO_PERIODO: Record<Periodo, string>; // hoje "Hoje", ontem "Ontem", 7dias "Últimos 7 dias", 30dias "Últimos 30 dias", antigos "Mais antigos"
export function inicioDoDia(ms: number): number
export function diasAtras(ms: number, agora: number): number
export function grupoDe(ms: number, agora: number): Grupo
export function periodosDe(ms: number, agora: number): Periodo[]
export function dataHora(ms: number): string   // "12/09/2026 10:05"
export function quando(ms: number, agora: number): string // "hoje às 14:32" | "ontem às 09:10" | "12/09/2026 às 10:00"
```

- [ ] **Step 1: Montar o pacote.**
  - `package.json`: o do favoritos, com `"name": "sei-pro-historico"` e a descrição "Histórico de processos visitados do SEI Pro"; mesmos scripts e devDependencies.
  - `tsconfig.json`: o do favoritos, com `paths` `"@historico/*": ["./src/*"]`, `"@favoritos/*": ["../favoritos/src/*"]`, `"@comum/*"`, `"@nucleo/*"`, `"@tarjar/*"` e `"@/*"`, iguais ao do favoritos.
  - `biome.json`: cópia do favoritos.
  - `tests/util.ts`: `export * from "../../favoritos/tests/util";`.
  - `tests/verificar.ts`: chama as suítes e termina com `resumo()`, como `favoritos/tests/verificar.ts`.
  - `README.md`: 10 linhas no estilo de `favoritos/README.md`.
  - `cd historico && npm install`.
- [ ] **Step 2: Escrever a prova `tests/verificar-dias.ts`.** As datas são locais (`new Date(a, m, d, h, mi)`), e por isso a prova não depende do fuso da máquina.
```ts
import { dataHora, diasAtras, grupoDe, periodosDe, quando } from "../src/modelo/dias";
import { checar, secao } from "./util";

const t = (d: number, h = 12, mi = 0) => new Date(2026, 9, d, h, mi).getTime(); // outubro/2026
export function verificarDias(): void {
  secao("historico: dias de calendario");
  const agora = t(2, 0, 5); // 02/10 00:05
  checar("23:59 de ontem e ontem, nao hoje", diasAtras(t(1, 23, 59), agora) === 1 && grupoDe(t(1, 23, 59), agora) === "ontem");
  checar("00:01 de hoje e hoje", grupoDe(t(2, 0, 1), agora) === "hoje");
  checar("futuro (relogio adiantado) conta como hoje", diasAtras(t(3), agora) === 0);
  checar("6 dias atras cai em 7dias", grupoDe(new Date(2026, 8, 26, 9).getTime(), agora) === "7dias");
  checar("7 dias atras cai em 30dias", grupoDe(new Date(2026, 8, 25, 9).getTime(), agora) === "30dias");
  checar("30 dias atras e antigos", grupoDe(new Date(2026, 8, 2, 9).getTime(), agora) === "antigos");
  checar("periodos de hoje sao cumulativos", JSON.stringify(periodosDe(t(2, 0, 1), agora)) === JSON.stringify(["hoje", "7dias", "30dias"]));
  checar("periodos de ontem", JSON.stringify(periodosDe(t(1), agora)) === JSON.stringify(["ontem", "7dias", "30dias"]));
  checar("periodos de 10 dias atras", JSON.stringify(periodosDe(new Date(2026, 8, 22).getTime(), agora)) === JSON.stringify(["30dias"]));
  checar("antigos nao entra em 30dias", JSON.stringify(periodosDe(new Date(2026, 7, 1).getTime(), agora)) === JSON.stringify(["antigos"]));
  checar("dataHora", dataHora(new Date(2026, 8, 12, 10, 5).getTime()) === "12/09/2026 10:05");
  checar("quando hoje", quando(t(2, 0, 1), agora) === "hoje às 00:01");
  checar("quando ontem", quando(t(1, 9, 10), agora) === "ontem às 09:10");
  checar("quando antes", quando(new Date(2026, 8, 12, 10, 0).getTime(), agora) === "12/09/2026 às 10:00");
  checar("virada de mes: 1o de outubro visto em 2 de outubro e ontem", grupoDe(t(1, 8), t(2, 8)) === "ontem");
}
```
- [ ] **Step 3: Rodar `npx tsx tests/verificar.ts`.** Esperado: FALHA (módulo inexistente).
- [ ] **Step 4: Implementar `tipos.ts`, `constantes.ts` e `dias.ts`.**
```ts
// dias.ts
import type { Periodo } from "./tipos";

export type Grupo = Periodo;
export const GRUPOS: readonly Grupo[] = ["hoje", "ontem", "7dias", "30dias", "antigos"];
export const ROTULO_PERIODO: Record<Periodo, string> = {
  hoje: "Hoje", ontem: "Ontem", "7dias": "Últimos 7 dias", "30dias": "Últimos 30 dias", antigos: "Mais antigos",
};
const DIA = 86_400_000;
export function inicioDoDia(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
/** Dias de calendário local entre a data de `ms` e a de `agora` (0 = hoje). O futuro conta como hoje. */
export function diasAtras(ms: number, agora: number): number {
  const n = Math.round((inicioDoDia(agora) - inicioDoDia(ms)) / DIA);
  return n < 0 ? 0 : n;
}
export function grupoDe(ms: number, agora: number): Grupo {
  const n = diasAtras(ms, agora);
  return n === 0 ? "hoje" : n === 1 ? "ontem" : n <= 6 ? "7dias" : n <= 29 ? "30dias" : "antigos";
}
/** Filtro: cumulativo ("Últimos 7 dias" inclui hoje e ontem). */
export function periodosDe(ms: number, agora: number): Periodo[] {
  const n = diasAtras(ms, agora);
  if (n >= 30) return ["antigos"];
  const p: Periodo[] = [];
  if (n === 0) p.push("hoje");
  if (n === 1) p.push("ontem");
  if (n <= 6) p.push("7dias");
  p.push("30dias");
  return p;
}
const dois = (n: number) => String(n).padStart(2, "0");
export function dataHora(ms: number): string {
  const d = new Date(ms);
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} ${dois(d.getHours())}:${dois(d.getMinutes())}`;
}
export function quando(ms: number, agora: number): string {
  const [data, hora] = dataHora(ms).split(" ");
  const n = diasAtras(ms, agora);
  return n === 0 ? `hoje às ${hora}` : n === 1 ? `ontem às ${hora}` : `${data} às ${hora}`;
}
```
- [ ] **Step 5: Rodar** `npm run tipos && npm run checar && npm run verificar`. Esperado: todas ok.
- [ ] **Step 6: Commit.**
```bash
git add historico/package.json historico/package-lock.json historico/tsconfig.json historico/biome.json historico/README.md historico/build.mjs historico/src/modelo historico/tests
git commit -m "Historico: pacote novo, tipos, constantes e dias de calendario"
```
(O `build.mjs` desta tarefa só tem o esqueleto e o portão ASCII, sem entradas. Ele é preenchido nas Tasks 12 a 14.)

### Task 5: modelo da visita

**Files:**
- Create: `historico/src/modelo/visita.ts`, `historico/tests/verificar-visita.ts`

**Interfaces:**
- Consumes: os tipos e constantes da Task 4.
- Produces:
```ts
export function semDadosSensiveis(v: Visita): Visita
export function registrar(anterior: Visita | undefined, d: DadosVisita, agora: number): Visita
export function completar(v: Visita, c: DadosCompletos, agora: number): Visita
export function precisaCompletar(v: Visita | undefined, agora: number): boolean
export function mesclarMigrada(atual: Visita | undefined, migrada: Visita): Visita
export function aPodar(visitas: Visita[], limite: number): string[]
export function visitaValida(v: unknown): v is Visita
```

- [ ] **Step 1: Escrever a prova `verificar-visita.ts`.**
```ts
import { aPodar, completar, mesclarMigrada, precisaCompletar, registrar, visitaValida } from "../src/modelo/visita";
import { checar, secao } from "./util";

const MIN = 60_000;
const GPF = { id: "110000001", sigla: "GPF" };
const SEAD = { id: "110000002", sigla: "SEAD" };
const D = { id: "123", protocolo: "50300.018905/2018-67", tipo: "Licitação", nivel: "publico" as const, unidade: GPF };

export function verificarVisita(): void {
  secao("historico: registrar visita");
  const v1 = registrar(undefined, D, 1_000 * MIN);
  checar("primeira visita", v1.vezes === 1 && v1.primeira === v1.ultima && v1.unidades[0]?.sigla === "GPF");
  const v2 = registrar(v1, D, 1_000 * MIN + 29 * MIN);
  checar("dentro de 30 min nao conta visita nova", v2.vezes === 1 && v2.ultima === 1_029 * MIN);
  const v3 = registrar(v2, { ...D, unidade: SEAD }, 1_029 * MIN + 31 * MIN);
  checar("depois de 30 min conta", v3.vezes === 2);
  checar("unidade mais recente primeiro, sem repetir", v3.unidades.map((u) => u.sigla).join() === "SEAD,GPF");
  const v4 = registrar(v3, { ...D, unidade: GPF }, 2_000 * MIN);
  checar("unidade repetida sobe para o inicio", v4.unidades.map((u) => u.sigla).join() === "GPF,SEAD");
  let muitas = v1;
  for (let i = 0; i < 15; i++) muitas = registrar(muitas, { ...D, unidade: { id: `u${i}`, sigla: `U${i}` } }, 3_000 * MIN + i);
  checar("guarda ate 10 unidades", muitas.unidades.length === 10 && muitas.unidades[0]?.sigla === "U14");
  checar("visita antiga recebida depois nao recua ultima", registrar(v4, D, 10 * MIN).ultima === v4.ultima && registrar(v4, D, 10 * MIN).primeira === 10 * MIN);
  const completa = completar(v4, { especificacao: "Pregão 12", interessados: ["ACME", "ACME", " "], assuntos: ["Compras"] }, 2_001 * MIN);
  checar("completar grava texto e limpa lista", completa.especificacao === "Pregão 12" && completa.interessados?.join() === "ACME" && completa.completadoEm === 2_001 * MIN);
  const virou = registrar(completa, { ...D, nivel: "sigiloso" }, 2_002 * MIN);
  checar("virou sigiloso: perde especificacao, interessados e assuntos", virou.nivel === "sigiloso" && !virou.especificacao && !virou.interessados && !virou.assuntos);
  const sig = completar(v4, { especificacao: "segredo", nivel: "sigiloso" }, 2_003 * MIN);
  checar("completar sigiloso nao guarda texto", sig.nivel === "sigiloso" && !sig.especificacao);

  secao("historico: quando completar");
  checar("sem completadoEm precisa", precisaCompletar(v4, 2_000 * MIN));
  checar("completado ha 1 h nao precisa", !precisaCompletar(completa, 2_061 * MIN));
  checar("completado ha 13 h precisa", precisaCompletar(completa, 2_001 * MIN + 13 * 60 * MIN));
  checar("sigiloso nunca precisa", !precisaCompletar(virou, 9_999_999 * MIN));
  checar("tentativa ha 1 min segura", !precisaCompletar({ ...v4, tentouEm: 1_999 * MIN }, 2_000 * MIN));
  checar("tentativa ha 3 min libera", precisaCompletar({ ...v4, tentouEm: 1_997 * MIN }, 2_000 * MIN));

  secao("historico: migrada e poda");
  const migrada = { ...registrar(undefined, D, 500 * MIN), especificacao: "Antiga", origem: "legado" as const };
  const m = mesclarMigrada(completa, migrada);
  checar("mescla: primeira mais antiga, ultima mais recente, texto do novo", m.primeira === 500 * MIN && m.ultima === completa.ultima && m.especificacao === "Pregão 12" && m.origem === undefined);
  checar("mescla sem atual devolve a migrada", mesclarMigrada(undefined, migrada) === migrada);
  const lista = [1, 5, 3, 4, 2].map((n) => ({ ...v1, id: String(n), ultima: n }));
  checar("poda tira as de ultima mais antiga", aPodar(lista, 3).sort().join() === "1,2");
  checar("abaixo do limite nao poda", aPodar(lista, 5).length === 0);
  checar("valida", visitaValida(v1) && !visitaValida({ id: 1 }) && !visitaValida(null));
}
```
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar `visita.ts`.**
```ts
import { ESPERA_TENTATIVA_MS, INTERVALO_VISITA_MS, MAX_LISTA, MAX_UNIDADES, VALIDADE_COMPLETAR_MS } from "./constantes";
import type { DadosCompletos, DadosVisita, UnidadeVisita, Visita } from "./tipos";

export function semDadosSensiveis(v: Visita): Visita {
  const { especificacao: _e, interessados: _i, assuntos: _a, ...resto } = v;
  return resto;
}

function unirUnidades(nova: UnidadeVisita | null | undefined, atuais: UnidadeVisita[]): UnidadeVisita[] {
  if (!nova?.id) return atuais.slice(0, MAX_UNIDADES);
  return [{ id: nova.id, sigla: nova.sigla }, ...atuais.filter((u) => u.id !== nova.id)].slice(0, MAX_UNIDADES);
}

export function registrar(anterior: Visita | undefined, d: DadosVisita, agora: number): Visita {
  const v: Visita = anterior
    ? {
        ...anterior,
        protocolo: d.protocolo || anterior.protocolo,
        unidades: unirUnidades(d.unidade, anterior.unidades ?? []),
        primeira: Math.min(anterior.primeira, agora),
        ultima: Math.max(anterior.ultima, agora),
        vezes: (anterior.vezes || 1) + (agora - anterior.ultima > INTERVALO_VISITA_MS ? 1 : 0),
      }
    : { id: d.id, protocolo: d.protocolo, unidades: unirUnidades(d.unidade, []), primeira: agora, ultima: agora, vezes: 1 };
  if (d.tipo) v.tipo = d.tipo;
  if (d.nivel) v.nivel = d.nivel;
  return v.nivel === "sigiloso" ? semDadosSensiveis(v) : v;
}

const limparLista = (l?: string[]): string[] | undefined => {
  const r = [...new Set((l ?? []).map((s) => s.trim()).filter(Boolean))].slice(0, MAX_LISTA);
  return r.length ? r : undefined;
};

export function completar(v: Visita, c: DadosCompletos, agora: number): Visita {
  const base: Visita = semDadosSensiveis({ ...v, completadoEm: agora });
  delete base.tentouEm;
  const nivel = c.nivel ?? v.nivel;
  if (nivel) base.nivel = nivel;
  if (c.tipo?.trim()) base.tipo = c.tipo.trim();
  if (nivel === "sigiloso") return base;
  const esp = c.especificacao?.trim();
  if (esp) base.especificacao = esp;
  const i = limparLista(c.interessados);
  if (i) base.interessados = i;
  const a = limparLista(c.assuntos);
  if (a) base.assuntos = a;
  return base;
}

export function precisaCompletar(v: Visita | undefined, agora: number): boolean {
  if (!v || v.nivel === "sigiloso") return false;
  if (v.tentouEm && agora - v.tentouEm < ESPERA_TENTATIVA_MS) return false;
  return !v.completadoEm || agora - v.completadoEm > VALIDADE_COMPLETAR_MS;
}

export function mesclarMigrada(atual: Visita | undefined, migrada: Visita): Visita {
  if (!atual) return migrada;
  const v: Visita = { ...migrada, ...atual, primeira: Math.min(atual.primeira, migrada.primeira), ultima: Math.max(atual.ultima, migrada.ultima) };
  if (!atual.origem) delete v.origem;
  return v.nivel === "sigiloso" ? semDadosSensiveis(v) : v;
}

export function aPodar(visitas: Visita[], limite: number): string[] {
  if (visitas.length <= limite) return [];
  return [...visitas].sort((a, b) => b.ultima - a.ultima || a.id.localeCompare(b.id)).slice(limite).map((v) => v.id);
}

export function visitaValida(v: unknown): v is Visita {
  const x = v as Partial<Visita> | null;
  return !!x && typeof x.id === "string" && !!x.id && typeof x.protocolo === "string" && typeof x.ultima === "number" && typeof x.primeira === "number";
}
```
- [ ] **Step 4: Rodar** `npm run tipos && npm run checar && npm run verificar`. Esperado: ok.
- [ ] **Step 5: Commit.** `git add historico/src/modelo/visita.ts historico/tests/verificar-visita.ts historico/tests/verificar.ts`, mensagem `Historico: modelo da visita (30 min, unidades, sigiloso, completar, migrada, poda)`.

### Task 6: busca, filtros, ordem, contagens, grupos e CSV

**Files:**
- Create: `historico/src/modelo/operacoes.ts`, `historico/src/modelo/csv.ts`, `historico/tests/verificar-operacoes.ts`

**Interfaces:**
- Produces:
```ts
export interface ApoioFiltro { agora: number; favoritos: ReadonlySet<string> | null }
export function digitos(s: string): string
export function casaBusca(v: Visita, busca: string): boolean
export function temSituacao(v: Visita, s: Situacao, a: ApoioFiltro): boolean
export function filtrar(visitas: Visita[], f: Filtro, a: ApoioFiltro): Visita[]
export function ordenar(visitas: Visita[], ordem: Ordem): Visita[]
export interface Contagens { periodos: Map<string, number>; tipos: Map<string, number>; unidades: Map<string, number>; interessados: Map<string, number>; assuntos: Map<string, number>; situacoes: Map<string, number> }
export function contar(visitas: Visita[], a: ApoioFiltro): Contagens
export function agrupar(visitas: Visita[], agora: number): Array<{ grupo: Grupo; itens: Visita[] }>
// csv.ts
export const NOME_NIVEL: Record<Nivel, string>; // publico "Público", restrito "Restrito", sigiloso "Sigiloso"
export function linhasCsv(visitas: Visita[]): string[][]
```

- [ ] **Step 1: Escrever a prova.**
```ts
import { gerarCsv } from "@comum/csv";
import { linhasCsv } from "../src/modelo/csv";
import { agrupar, casaBusca, contar, filtrar, ordenar } from "../src/modelo/operacoes";
import type { Visita } from "../src/modelo/tipos";
import { checar, secao } from "./util";

const agora = new Date(2026, 9, 2, 15).getTime();
const dia = (d: number, m = 9) => new Date(2026, m, d, 10).getTime();
const base = (id: string, x: Partial<Visita>): Visita => ({ id, protocolo: "", unidades: [], primeira: dia(1), ultima: dia(1), vezes: 1, ...x });
const V = [
  base("1", { protocolo: "50300.018905/2018-67", tipo: "Licitação", especificacao: "Pregão eletrônico 12/2024", interessados: ["ACME Ltda"], assuntos: ["Compras"], nivel: "publico", unidades: [{ id: "u1", sigla: "GPF" }], ultima: dia(2), vezes: 3 }),
  base("2", { protocolo: "50300.000111/2024-01", tipo: "Ofício", especificacao: "Resposta à CGU", nivel: "restrito", unidades: [{ id: "u2", sigla: "SEAD" }, { id: "u1", sigla: "GPF" }], ultima: dia(1) }),
  base("3", { protocolo: "50300.000222/2023-99", tipo: "Licitação", nivel: "sigiloso", unidades: [{ id: "u1", sigla: "GPF" }], ultima: dia(20, 8) }),
  base("4", { protocolo: "50300.000333/2025-10", tipo: "Processo Seletivo", interessados: ["Maria"], ultima: dia(1, 7) }),
];
const ap = { agora, favoritos: new Set(["2"]) };

export function verificarOperacoes(): void {
  secao("historico: busca");
  checar("numero formatado", casaBusca(V[0]!, "50300.018905/2018-67"));
  checar("so os digitos", casaBusca(V[0]!, "50300018905201867"));
  checar("pedaco do numero", casaBusca(V[0]!, "018905/2018"));
  checar("sem acento e sem caixa", casaBusca(V[0]!, "PREGAO eletronico"));
  checar("interessado", casaBusca(V[0]!, "acme"));
  checar("sigla da unidade", casaBusca(V[1]!, "sead"));
  checar("todas as palavras", !casaBusca(V[0]!, "pregao cgu"));
  checar("texto com ano nao casa so pelo numero", !casaBusca(V[3]!, "licitação 2025"));
  checar("busca vazia casa tudo", casaBusca(V[3]!, "  "));

  secao("historico: filtros (OU no campo, E entre campos)");
  const ids = (l: Visita[]) => l.map((v) => v.id).join();
  checar("tipo", ids(filtrar(V, { tipos: ["Licitação"] }, ap)) === "1,3");
  checar("tipo OU tipo", ids(filtrar(V, { tipos: ["Licitação", "Ofício"] }, ap)) === "1,2,3");
  checar("tipo E unidade", ids(filtrar(V, { tipos: ["Licitação"], unidades: ["SEAD"] }, ap)) === "");
  checar("unidade casa qualquer das unidades", ids(filtrar(V, { unidades: ["GPF"] }, ap)) === "1,2,3");
  checar("hoje", ids(filtrar(V, { periodos: ["hoje"] }, ap)) === "1");
  checar("ultimos 7 dias inclui hoje e ontem", ids(filtrar(V, { periodos: ["7dias"] }, ap)) === "1,2");
  checar("mais antigos", ids(filtrar(V, { periodos: ["antigos"] }, ap)) === "4");
  checar("nos favoritos", ids(filtrar(V, { situacoes: ["favoritos"] }, ap)) === "2");
  checar("fora dos favoritos", ids(filtrar(V, { situacoes: ["foraFavoritos"] }, ap)) === "1,3,4");
  checar("sem favoritos ativos, foraFavoritos nao filtra nada", filtrar(V, { situacoes: ["foraFavoritos"] }, { agora, favoritos: null }).length === 0);
  checar("visitados mais de uma vez", ids(filtrar(V, { situacoes: ["repetidos"] }, ap)) === "1");
  checar("sigilosos", ids(filtrar(V, { situacoes: ["sigiloso"] }, ap)) === "3");
  checar("interessado", ids(filtrar(V, { interessados: ["Maria"] }, ap)) === "4");

  secao("historico: ordem, contagens e grupos");
  checar("recentes", ids(ordenar(V, "recentes")) === "1,2,3,4");
  checar("mais visitados", ordenar(V, "visitados")[0]?.id === "1");
  checar("por numero", ids(ordenar(V, "protocolo")) === "2,3,4,1");
  const c = contar(V, ap);
  checar("contagem por tipo", c.tipos.get("Licitação") === 2);
  checar("contagem por unidade conta o processo uma vez", c.unidades.get("GPF") === 3);
  checar("contagem de periodo cumulativa", c.periodos.get("7dias") === 2 && c.periodos.get("hoje") === 1);
  checar("contagem de situacao", c.situacoes.get("favoritos") === 1 && c.situacoes.get("foraFavoritos") === 3);
  const g = agrupar(ordenar(V, "recentes"), agora);
  checar("grupos disjuntos na ordem", g.map((x) => `${x.grupo}:${x.itens.length}`).join() === "hoje:1,ontem:1,30dias:1,antigos:1");

  secao("historico: CSV");
  const csv = gerarCsv(linhasCsv([V[0]!]));
  checar("cabecalho e linha", csv.includes("Processo;Tipo;Especificação;Interessados;Assuntos;Nível de acesso;Última visita;Primeira visita;Visitas;Unidades"));
  checar("dados", csv.includes("50300.018905/2018-67;Licitação;Pregão eletrônico 12/2024;ACME Ltda;Compras;Público;02/10/2026 10:00;01/10/2026 10:00;3;GPF"));
}
```
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar.**
```ts
// operacoes.ts
import { normalizarTexto } from "@comum/texto";
import { GRUPOS, type Grupo, grupoDe, periodosDe } from "./dias";
import { type Filtro, type Ordem, SITUACOES, type Situacao, type Visita } from "./tipos";

export interface ApoioFiltro { agora: number; favoritos: ReadonlySet<string> | null }
export const digitos = (s: string): string => s.replace(/\D/g, "");
const NUMERICA = /^[\d.\-/\s]+$/;

function textoDeBusca(v: Visita): string {
  return normalizarTexto(
    [v.protocolo, v.tipo, v.especificacao, ...(v.interessados ?? []), ...(v.assuntos ?? []), ...v.unidades.map((u) => u.sigla)]
      .filter(Boolean)
      .join(" "),
  );
}

export function casaBusca(v: Visita, busca: string): boolean {
  const t = normalizarTexto(busca);
  if (!t) return true;
  const d = digitos(busca);
  if (NUMERICA.test(busca.trim()) && d.length >= 4) return digitos(v.protocolo).includes(d);
  const texto = textoDeBusca(v);
  return t.split(" ").every((p) => texto.includes(p));
}

export function temSituacao(v: Visita, s: Situacao, a: ApoioFiltro): boolean {
  switch (s) {
    case "favoritos": return !!a.favoritos?.has(v.id);
    case "foraFavoritos": return !!a.favoritos && !a.favoritos.has(v.id);
    case "repetidos": return v.vezes > 1;
    default: return v.nivel === s;
  }
}

const algum = <T>(sel: T[] | undefined, teste: (x: T) => boolean) => !sel?.length || sel.some(teste);

export function filtrar(visitas: Visita[], f: Filtro, a: ApoioFiltro): Visita[] {
  return visitas.filter((v) => {
    if (f.busca && !casaBusca(v, f.busca)) return false;
    if (f.periodos?.length) {
      const p = periodosDe(v.ultima, a.agora);
      if (!f.periodos.some((x) => p.includes(x))) return false;
    }
    return (
      algum(f.tipos, (t) => v.tipo === t) &&
      algum(f.unidades, (s) => v.unidades.some((u) => u.sigla === s)) &&
      algum(f.interessados, (i) => !!v.interessados?.includes(i)) &&
      algum(f.assuntos, (x) => !!v.assuntos?.includes(x)) &&
      algum(f.situacoes, (s) => temSituacao(v, s, a))
    );
  });
}

export function ordenar(visitas: Visita[], ordem: Ordem): Visita[] {
  const l = [...visitas];
  if (ordem === "visitados") return l.sort((a, b) => b.vezes - a.vezes || b.ultima - a.ultima);
  if (ordem === "protocolo") return l.sort((a, b) => a.protocolo.localeCompare(b.protocolo, "pt-BR", { numeric: true }));
  return l.sort((a, b) => b.ultima - a.ultima);
}

export interface Contagens { periodos: Map<string, number>; tipos: Map<string, number>; unidades: Map<string, number>; interessados: Map<string, number>; assuntos: Map<string, number>; situacoes: Map<string, number> }

export function contar(visitas: Visita[], a: ApoioFiltro): Contagens {
  const c: Contagens = { periodos: new Map(), tipos: new Map(), unidades: new Map(), interessados: new Map(), assuntos: new Map(), situacoes: new Map() };
  const mais = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
  for (const v of visitas) {
    for (const p of periodosDe(v.ultima, a.agora)) mais(c.periodos, p);
    if (v.tipo) mais(c.tipos, v.tipo);
    for (const s of new Set(v.unidades.map((u) => u.sigla))) mais(c.unidades, s);
    for (const i of new Set(v.interessados ?? [])) mais(c.interessados, i);
    for (const x of new Set(v.assuntos ?? [])) mais(c.assuntos, x);
    for (const s of SITUACOES) if (temSituacao(v, s, a)) mais(c.situacoes, s);
  }
  return c;
}

export function agrupar(visitas: Visita[], agora: number): Array<{ grupo: Grupo; itens: Visita[] }> {
  const m = new Map<Grupo, Visita[]>();
  for (const v of visitas) {
    const g = grupoDe(v.ultima, agora);
    const l = m.get(g);
    if (l) l.push(v);
    else m.set(g, [v]);
  }
  return GRUPOS.filter((g) => m.has(g)).map((g) => ({ grupo: g, itens: m.get(g)! }));
}
```
```ts
// csv.ts
import { dataHora } from "./dias";
import type { Nivel, Visita } from "./tipos";

export const NOME_NIVEL: Record<Nivel, string> = { publico: "Público", restrito: "Restrito", sigiloso: "Sigiloso" };

export function linhasCsv(visitas: Visita[]): string[][] {
  return [
    ["Processo", "Tipo", "Especificação", "Interessados", "Assuntos", "Nível de acesso", "Última visita", "Primeira visita", "Visitas", "Unidades"],
    ...visitas.map((v) => [
      v.protocolo, v.tipo ?? "", v.especificacao ?? "", (v.interessados ?? []).join(", "), (v.assuntos ?? []).join(", "),
      v.nivel ? NOME_NIVEL[v.nivel] : "", dataHora(v.ultima), dataHora(v.primeira), String(v.vezes), v.unidades.map((u) => u.sigla).join(", "),
    ]),
  ];
}
```
- [ ] **Step 4: Rodar.** Esperado: ok. Se a prova "por numero" falhar por causa do `localeCompare` numérico, confira os protocolos da prova: `2024-01` < `2023-99`? O compare numérico olha os segmentos na ordem (`50300`, `000111`, `000222`...), então "2,3,4,1" está certo: 000111 < 000222 < 000333 < 018905.
- [ ] **Step 5: Commit** (`Historico: busca, filtros, ordens, contagens, grupos por dia e CSV`).

### Task 7: repositório e preferências

**Files:**
- Create: `historico/src/repositorio.ts`, `historico/src/preferencias.ts`, `historico/tests/verificar-repositorio.ts`

**Interfaces:**
- Consumes: `Colecao` e `obterPorPrefixo` (`@comum/armazenamento/colecao`); `Area` e `areaMemoria` (`@comum/armazenamento/area`); as Tasks 4 a 6.
- Produces:
```ts
export function corteDoPeriodo(p: PeriodoApagar, agora: number): number
export class RepositorioHistorico {
  constructor(area: Area, escopo: string);
  readonly escopo: string;
  listar(): Promise<Visita[]>;                         // só as válidas (visitaValida), com unidades ?? []
  obter(id: string): Promise<Visita | undefined>;
  registrarVisita(d: DadosVisita, agora?: number): Promise<Visita>;
  completar(id: string, c: DadosCompletos, agora?: number): Promise<Visita | undefined>;
  marcarTentativa(id: string, agora?: number): Promise<void>;
  remover(ids: string[]): Promise<number>;
  apagarPeriodo(p: PeriodoApagar, agora?: number): Promise<number>;
  contar(): Promise<number>;                           // pelas chaves (getKeys) quando houver
  podar(limite: number): Promise<number>;
  importar(visitas: Visita[]): Promise<number>;
  meta(): Promise<MetaHistorico>;
  gravarMeta(m: Partial<MetaHistorico>): Promise<MetaHistorico>;  // undefined apaga o campo
  aoMudar(cb: () => void): () => void;                 // visitas OU meta
}
// preferencias.ts
export function lerPreferencias(area: Area): Promise<Preferencias>
export function gravarPreferencias(area: Area, m: Partial<Preferencias>): Promise<Preferencias>
```

- [ ] **Step 1: Escrever a prova** com `areaMemoria`, escopo `"sei.x.gov.br|ana"`:
  - registrar duas vezes o mesmo processo → `listar()` tem 1 item;
  - `contar()` = 1;
  - `completar` de id inexistente → `undefined`;
  - `marcarTentativa` grava `tentouEm`;
  - `apagarPeriodo("hora")` tira só a que foi há menos de 1 h;
  - `"hoje"` usa o início do dia local;
  - `"tudo"` tira todas **e não toca** `historico/<escopo>/meta` nem as visitas de outro escopo (`"sei.x.gov.br|bia"`);
  - `podar(2)` com 4 visitas deixa as 2 mais recentes e devolve 2;
  - `importar` mescla com a existente (`primeira` mais antiga);
  - `gravarMeta({ migradoEm: 1 })` e depois `gravarMeta({ apagarLegado: true })` mantêm os dois campos, e `gravarMeta({ apagarLegado: undefined })` o retira;
  - `aoMudar` dispara para gravação de visita e para gravação de meta, mas **não** para outra chave (`favoritos/x`);
  - um valor inválido gravado à mão na área (`{ id: 5 }`) não aparece em `listar()`.
  - Preferências: o padrão quando vazio; `limite: 300` (inválido) volta para 1000; `registrar: false` é lido; `gravarPreferencias` mescla.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar.**
```ts
import type { Area } from "@comum/armazenamento/area";
import { Colecao } from "@comum/armazenamento/colecao";
import { chaveMeta, prefixoVisitas } from "./modelo/constantes";
import { inicioDoDia } from "./modelo/dias";
import type { DadosCompletos, DadosVisita, MetaHistorico, PeriodoApagar, Visita } from "./modelo/tipos";
import { aPodar, completar, mesclarMigrada, registrar, visitaValida } from "./modelo/visita";

/** Início do período, no calendário local (dias por Date, não por 24 h fixas). */
export function corteDoPeriodo(p: PeriodoApagar, agora: number): number {
  if (p === "tudo") return Number.NEGATIVE_INFINITY;
  if (p === "hora") return agora - 3_600_000;
  const d = new Date(inicioDoDia(agora));
  if (p === "7dias") d.setDate(d.getDate() - 6);
  if (p === "30dias") d.setDate(d.getDate() - 29);
  return d.getTime();
}

export class RepositorioHistorico {
  private readonly col: Colecao<Visita>;
  private readonly kMeta: string;
  constructor(private readonly area: Area, readonly escopo: string) {
    this.col = new Colecao<Visita>(area, prefixoVisitas(escopo));
    this.kMeta = chaveMeta(escopo);
  }
  async listar(): Promise<Visita[]> {
    return (await this.col.listar()).filter(visitaValida).map((v) => ({ ...v, unidades: Array.isArray(v.unidades) ? v.unidades : [] }));
  }
  async obter(id: string): Promise<Visita | undefined> {
    const v = await this.col.obter(id);
    return visitaValida(v) ? { ...v, unidades: Array.isArray(v.unidades) ? v.unidades : [] } : undefined;
  }
  async registrarVisita(d: DadosVisita, agora = Date.now()): Promise<Visita> {
    const v = registrar(await this.obter(d.id), d, agora);
    await this.col.gravar(d.id, v);
    return v;
  }
  async completar(id: string, c: DadosCompletos, agora = Date.now()): Promise<Visita | undefined> {
    const atual = await this.obter(id);
    if (!atual) return undefined;
    const v = completar(atual, c, agora);
    await this.col.gravar(id, v);
    return v;
  }
  async marcarTentativa(id: string, agora = Date.now()): Promise<void> {
    const atual = await this.obter(id);
    if (atual) await this.col.gravar(id, { ...atual, tentouEm: agora });
  }
  async remover(ids: string[]): Promise<number> {
    const unicos = [...new Set(ids)];
    await this.col.apagar(unicos);
    return unicos.length;
  }
  async apagarPeriodo(p: PeriodoApagar, agora = Date.now()): Promise<number> {
    const corte = corteDoPeriodo(p, agora);
    const ids = (await this.listar()).filter((v) => v.ultima >= corte).map((v) => v.id);
    await this.col.apagar(ids);
    return ids.length;
  }
  async contar(): Promise<number> {
    if (this.area.chaves) return (await this.area.chaves()).filter((k) => k.startsWith(this.col.prefixo)).length;
    return (await this.listar()).length;
  }
  async podar(limite: number): Promise<number> {
    if ((await this.contar()) <= limite) return 0;
    const ids = aPodar(await this.listar(), limite);
    await this.col.apagar(ids);
    return ids.length;
  }
  async importar(visitas: Visita[]): Promise<number> {
    if (!visitas.length) return 0;
    const atuais = new Map((await this.listar()).map((v) => [v.id, v]));
    await this.col.gravarVarios(visitas.map((m) => [m.id, mesclarMigrada(atuais.get(m.id), m)]));
    return visitas.length;
  }
  async meta(): Promise<MetaHistorico> {
    const v = (await this.area.obter(this.kMeta))[this.kMeta];
    return v && typeof v === "object" ? { ...(v as MetaHistorico) } : {};
  }
  async gravarMeta(m: Partial<MetaHistorico>): Promise<MetaHistorico> {
    const nova: Record<string, unknown> = { ...(await this.meta()), ...m };
    for (const k of Object.keys(nova)) if (nova[k] === undefined) delete nova[k];
    await this.area.gravar({ [this.kMeta]: nova });
    return nova as MetaHistorico;
  }
  aoMudar(cb: () => void): () => void {
    return this.area.aoMudar((m) => {
      if (Object.keys(m).some((k) => k.startsWith(this.col.prefixo) || k === this.kMeta)) cb();
    });
  }
}
```
```ts
// preferencias.ts
import type { Area } from "@comum/armazenamento/area";
import { CHAVE_PREFERENCIAS } from "./modelo/constantes";
import { LIMITES, ORDENS, PREFERENCIAS_PADRAO, type Preferencias } from "./modelo/tipos";

export async function lerPreferencias(area: Area): Promise<Preferencias> {
  const v = (await area.obter(CHAVE_PREFERENCIAS))[CHAVE_PREFERENCIAS];
  const p = { ...PREFERENCIAS_PADRAO, ...(v && typeof v === "object" ? (v as Partial<Preferencias>) : {}) };
  return {
    registrar: p.registrar !== false,
    limite: LIMITES.includes(p.limite) ? p.limite : PREFERENCIAS_PADRAO.limite,
    ordem: ORDENS.includes(p.ordem) ? p.ordem : PREFERENCIAS_PADRAO.ordem,
    agruparPorDia: p.agruparPorDia !== false,
  };
}

export async function gravarPreferencias(area: Area, m: Partial<Preferencias>): Promise<Preferencias> {
  const nova = await lerPreferencias({ ...area, obter: async () => ({ [CHAVE_PREFERENCIAS]: { ...(await lerPreferencias(area)), ...m } }) } as Area);
  await area.gravar({ [CHAVE_PREFERENCIAS]: nova });
  return nova;
}
```
(Em `gravarPreferencias`, mescle e normalize pela mesma regra de `lerPreferencias`. Se achar o truque da área falsa obscuro, extraia uma função `normalizar(p: Partial<Preferencias>): Preferencias` e use nas duas.)
- [ ] **Step 4: Rodar.** Esperado: ok.
- [ ] **Step 5: Commit** (`Historico: repositorio (uma chave por processo, poda pelo total de chaves, apagar por periodo, meta) e preferencias locais`).

### Task 8: migração do histórico antigo

**Files:**
- Create: `historico/src/migracao/legado.ts`, `historico/tests/verificar-migracao.ts`

**Interfaces:**
- Produces:
```ts
export interface ResultadoMigracao { visitas: Visita[]; ignorados: number; total: number }
export function converterLegado(bruto: unknown): ResultadoMigracao
```

- [ ] **Step 1: Escrever a prova.** A entrada é a string JSON que o legado grava. Exemplo de item real, tirado de `setHistoryProcessosPro`:
```ts
const item = (id: string, data: string, x: Record<string, unknown> = {}) => ({
  datetime: data, data_geracao: "01/02/2024", id_procedimento: id, tipo_processo: "Licitação",
  protocolo: `50300.0000${id}/2024-00`, nivel_acesso: "0", assuntos: ["Compras", "Pregão"],
  observacoes: "anotacao interna", descricao: "Pregão 12", ...x,
});
```
  Casos:
  - entrada em string JSON e em array → mesmo resultado;
  - `datetime` "2024-03-05 14:07:09" vira `new Date(2024, 2, 5, 14, 7, 9).getTime()` em `primeira` e `ultima`;
  - `vezes: 1`, `unidades: []`, `origem: "legado"`;
  - `observacoes` não aparece em lugar nenhum do resultado (`JSON.stringify` não contém "anotacao interna");
  - `nivel_acesso: "2"` → `nivel: "sigiloso"`, sem especificação nem assuntos;
  - `"1"` → restrito; `0` (número) → publico; ausente → sem `nivel`;
  - sem id, id não numérico ("abc"), sem protocolo ou com data inválida → `ignorados` conta e o item sai;
  - o mesmo id duas vezes → fica uma visita, com a data mais recente em `ultima` e a mais antiga em `primeira`;
  - entrada inválida (`"{}"`, `null`, `"lixo"`) → `{ visitas: [], ignorados: 0, total: 0 }`;
  - `total` = o número de itens do array.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar.**
```ts
import { semDadosSensiveis } from "../modelo/visita";
import type { Nivel, Visita } from "../modelo/tipos";

export interface ResultadoMigracao { visitas: Visita[]; ignorados: number; total: number }
const DATA = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/;
const NIVEIS: Record<string, Nivel> = { "0": "publico", "1": "restrito", "2": "sigiloso" };

function data(v: unknown): number | null {
  const m = DATA.exec(String(v ?? ""));
  if (!m) return null;
  const t = new Date(+m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!, +(m[6] ?? 0)).getTime();
  return Number.isFinite(t) ? t : null;
}

export function converterLegado(bruto: unknown): ResultadoMigracao {
  let lista: unknown = bruto;
  if (typeof bruto === "string") {
    try { lista = JSON.parse(bruto); } catch { return { visitas: [], ignorados: 0, total: 0 }; }
  }
  if (!Array.isArray(lista)) return { visitas: [], ignorados: 0, total: 0 };
  const porId = new Map<string, Visita>();
  let ignorados = 0;
  for (const x of lista) {
    const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
    const id = String(o.id_procedimento ?? "").trim();
    const protocolo = String(o.protocolo ?? "").trim();
    const quando = data(o.datetime);
    if (!/^\d+$/.test(id) || !protocolo || quando === null) { ignorados++; continue; }
    const nivel = NIVEIS[String(o.nivel_acesso ?? "")];
    let v: Visita = { id, protocolo, unidades: [], primeira: quando, ultima: quando, vezes: 1, origem: "legado" };
    const tipo = typeof o.tipo_processo === "string" ? o.tipo_processo.trim() : "";
    if (tipo) v.tipo = tipo;
    if (nivel) v.nivel = nivel;
    const esp = typeof o.descricao === "string" ? o.descricao.trim() : "";
    if (esp) v.especificacao = esp;
    const assuntos = Array.isArray(o.assuntos) ? o.assuntos.map((a) => String(a).trim()).filter(Boolean) : [];
    if (assuntos.length) v.assuntos = [...new Set(assuntos)];
    if (nivel === "sigiloso") v = semDadosSensiveis(v);
    const ja = porId.get(id);
    porId.set(id, ja ? { ...(quando >= ja.ultima ? v : ja), primeira: Math.min(ja.primeira, quando), ultima: Math.max(ja.ultima, quando) } : v);
  }
  return { visitas: [...porId.values()], ignorados, total: lista.length };
}
```
- [ ] **Step 4: Rodar.** Esperado: ok.
- [ ] **Step 5: Commit** (`Historico: conversao do historico antigo (sem observacoes, sigilosos minimos, itens com defeito ignorados)`).

### Task 9: content script — marca, contexto, captura e migração

**Files:**
- Create: `historico/src/pagina/marca.ts`, `historico/src/pagina/contexto.ts`, `historico/src/pagina/captura.ts`, `historico/src/pagina/migrar.ts`, `historico/src/pagina/main.ts`, `historico/tests/verificar-captura.ts`
- Modify: `historico/build.mjs` (entrada `src/pagina/main.ts` → `dist/js/init_historico.js`, IIFE)

**Interfaces:**
- Consumes: `lerArvore`, `Arvore` (`@nucleo/dominio/arvore`); `consultarDaArvore` (`@nucleo/dominio/processo`); `criarHttp` (`@nucleo/sessao/http`); `paginaDe`, `documentoTopo` (`@nucleo/sessao/pagina`); `lerContexto` (`@nucleo/sei`); `temaEscuroLegado`, `corDoTemaSei` (`@comum/pagina/tema`); `lerOpcaoLegada` (`@comum/opcoes/legadas`); `temPainelLateral` (`@favoritos/modelo/exibicao`); as Tasks 4 a 8.
- Produces:
```ts
// marca.ts
export function marcarAtivo(doc: Document): void   // documentElement.setAttribute(ATRIBUTO_ATIVO, "1")
// contexto.ts
export function contextoHistorico(doc: Document, o: { temaEscuro: boolean; favoritosAtivo: boolean; lateralDisponivel: boolean; corTema?: string }, url?: string): ContextoHistorico | null
// captura.ts
export interface DepsCaptura {
  repo: RepositorioHistorico;
  ligado(): Promise<boolean>;            // historicoproc && preferencias.registrar
  limite(): Promise<number>;
  consultar(arv: Arvore): Promise<DadosCompletos>;
  agora(): number;
}
export function capturarVisita(arv: Arvore, unidade: UnidadeVisita | null, d: DepsCaptura): Promise<Visita | null>
// migrar.ts
export function migrarSeNecessario(repo: RepositorioHistorico, armazenamento: Pick<Storage, "getItem" | "removeItem">, agora?: number): Promise<number | null>
```

- [ ] **Step 1: Escrever a prova `verificar-captura.ts`.**
  - Use `telaSei("sei41/arvore.html")` para ter uma `Arvore` real (`lerArvore(pagina)`). Os demais dados são falsos: `areaMemoria`, `consultar` que conta as chamadas e devolve `{ especificacao: "Esp", interessados: ["X"], assuntos: ["Y"] }`.
  - Casos de `capturarVisita`:
    - ligado → grava a visita com protocolo, tipo e nível da fixture, a unidade passada, e faz **1** consulta;
    - segunda captura 1 min depois → `vezes` 1 e nenhuma consulta nova (`completadoEm` recente);
    - consulta que falha (rejeita) → a visita fica gravada, `tentouEm` marcado, e a próxima captura 1 min depois **não** consulta (espera de 2 min);
    - árvore com `nivel: "sigiloso"` (copie a `Arvore` e troque o nível) → grava sem consultar;
    - `ligado()` false → devolve null e não grava nada;
    - `limite()` 1 com outra visita já gravada → a mais antiga sai.
  - Casos de `migrarSeNecessario`, com `Storage` falso em memória:
    - sem chave antiga → grava `migradoEm` e devolve null;
    - com 2 itens → importa 2, grava `migradoEm` e `migrados: 2`, devolve 2 e **mantém** a chave antiga;
    - segunda chamada → null, sem reimportar;
    - com `meta.apagarLegado` → remove a chave antiga e limpa a flag.
  - Caso de `contextoHistorico`: com `telaSei("sei41/caixa.html")`, devolve host, login em minúsculas e unidade. Numa página sem usuário, devolve null.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar `captura.ts` e `migrar.ts`.**
```ts
// captura.ts
export async function capturarVisita(arv: Arvore, unidade: UnidadeVisita | null, d: DepsCaptura): Promise<Visita | null> {
  if (!arv.idProcedimento || !arv.protocolo || !(await d.ligado())) return null;
  const agora = d.agora();
  let v = await d.repo.registrarVisita({ id: arv.idProcedimento, protocolo: arv.protocolo, tipo: arv.tipo || undefined, nivel: arv.nivel, unidade }, agora);
  await d.repo.podar(await d.limite()).catch(() => 0);
  if (precisaCompletar(v, agora)) {
    await d.repo.marcarTentativa(v.id, agora);
    try {
      v = (await d.repo.completar(v.id, await d.consultar(arv), d.agora())) ?? v;
    } catch (e) {
      console.warn("[SEI Pro] histórico: não foi possível ler os dados do processo", e);
    }
  }
  return v;
}
```
```ts
// migrar.ts
export async function migrarSeNecessario(repo: RepositorioHistorico, armazenamento: Pick<Storage, "getItem" | "removeItem">, agora = Date.now()): Promise<number | null> {
  const meta = await repo.meta();
  if (meta.migradoEm) {
    if (meta.apagarLegado) {
      try { armazenamento.removeItem(LEGADO_CHAVE); } catch { /* sem acesso ao localStorage */ }
      await repo.gravarMeta({ apagarLegado: undefined });
    }
    return null;
  }
  let bruto: string | null = null;
  try { bruto = armazenamento.getItem(LEGADO_CHAVE); } catch { /* idem */ }
  if (!bruto) { await repo.gravarMeta({ migradoEm: agora }); return null; }
  const r = converterLegado(bruto);
  const n = await repo.importar(r.visitas);
  await repo.gravarMeta({ migradoEm: agora, migrados: n });
  return n;
}
```
- [ ] **Step 4: Implementar `marca.ts`, `contexto.ts` e o `main.ts`** (só captura e migração; o modal e a lateral entram nas Tasks 13 e 14).
  - `contexto.ts` espelha `favoritos/src/pagina/contexto.ts#contextoDe`: `lerContexto(paginaDe(doc, url))`; sem `usuario.login` devolve null; login em minúsculas; e soma os campos novos de `o`.
  - O `main.ts` segue o esqueleto de `favoritos/src/pagina/main.ts`:
```ts
marcarAtivo(document);
const global = window as unknown as { __seiProHistorico?: boolean };
if (!global.__seiProHistorico) {
  global.__seiProHistorico = true;
  const iniciar = () => void principal().catch((e) => console.warn("[SEI Pro] histórico:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}
const naArvore = (doc: Document) => !!doc.querySelector("#topmenu") && !!doc.querySelector("#divArvore");

async function principal(): Promise<void> {
  const noTopo = window === window.top;
  const arvore = naArvore(document);
  if (!arvore && !noTopo) return;
  if (!(await lerOpcaoLegada("historicoproc"))) return;
  const topo = documentoTopo();
  const manifesto = chrome.runtime.getManifest();
  const temFavoritos = (manifesto.content_scripts ?? []).some((c) => c.js?.includes("js/init_favoritos.js"));
  const ctx = contextoHistorico(topo, {
    temaEscuro: temaEscuroLegado(localStorage),
    favoritosAtivo: temFavoritos && (await lerOpcaoLegada("gerenciarfavoritos")),
    lateralDisponivel: temPainelLateral(manifesto),
    corTema: corDoTemaSei(topo),
  }, topo.location?.href);
  if (!ctx) return;
  const area = areaChrome(chrome.storage.local, "local");
  const repo = new RepositorioHistorico(area, chaveEscopo(ctx.host, ctx.login));
  if (arvore) {
    let arv: Arvore;
    try { arv = lerArvore(paginaDe(document, location.href)); } catch { arv = null as unknown as Arvore; }
    if (arv?.idProcedimento) {
      const http = criarHttp(location.href);
      void capturarVisita(arv, ctx.unidade ? { id: ctx.unidade.id, sigla: ctx.unidade.sigla } : null, {
        repo,
        ligado: async () => (await lerPreferencias(area)).registrar,
        limite: async () => (await lerPreferencias(area)).limite,
        consultar: async (a) => {
          const m = await consultarDaArvore(http, a);
          return { tipo: m.tipo, especificacao: m.especificacao, interessados: m.interessados, assuntos: m.assuntos };
        },
        agora: () => Date.now(),
      }).catch((e) => console.warn("[SEI Pro] histórico: captura", e));
    }
  }
  if (noTopo) void migrarSeNecessario(repo, localStorage).catch((e) => console.warn("[SEI Pro] histórico: migração", e));
}
```
  (A opção `historicoproc` já foi conferida antes, por isso `ligado` só olha a pausa.)
- [ ] **Step 5: Ligar o build.** `historico/build.mjs` = `favoritos/build.mjs` adaptado: limpa `dist/js/historico`, gera `dist/js/init_historico.js` (IIFE, banner "GERADO por historico/build.mjs"), aplica o portão ASCII e imprime os tamanhos. Rodar `npm run tipos && npm run checar && npm run verificar && node build.mjs`.
- [ ] **Step 6: Commit** (`Historico: content script (marca, captura na arvore com 1 GET a cada 12 h, migracao do historico antigo)`). Adicione `dist/js/init_historico.js` também.

---

## FASE 2: o app e o modal

### Task 10: componentes — barra de filtros, item e lista

**Files:**
- Create: `historico/src/app/componentes/filtros.ts`, `historico/src/app/componentes/item.ts`, `historico/src/app/componentes/lista.ts`, `historico/tests/verificar-componentes.ts`

**Interfaces:**
- Consumes: `criarCombo`, `OpcaoCombo` (`@comum/ui/combobox`); `criarMenu` (`@comum/ui/menu`); `h`, `icone` (`@comum/ui/dom`); as Tasks 4 a 6.
- Produces:
```ts
// filtros.ts
export interface EstadoFiltros { filtro: Filtro; ordem: Ordem; agrupar: boolean; contagens: Contagens; favoritosAtivo: boolean }
export interface AcoesFiltros { filtrar(f: Filtro): void; ordenar(o: Ordem): void; agrupar(v: boolean): void }
export interface BarraFiltros { el: HTMLElement; ativos: HTMLElement; atualizar(e: EstadoFiltros): void }
export function criarFiltros(inicial: EstadoFiltros, a: AcoesFiltros): BarraFiltros
// item.ts
export interface ApoioItem { agora: number; selecionado: boolean; favorito: boolean | null /* null = Favoritos inativo */ }
export interface AcoesItem { abrir(v: Visita, novaAba: boolean): void; alternarSelecao(v: Visita, marcado: boolean): void; alternarFavorito?(v: Visita): void; copiar(v: Visita): void; remover(v: Visita): void }
export function renderItem(v: Visita, a: ApoioItem, acoes: AcoesItem): HTMLLIElement
// lista.ts
export interface OpcoesLista { agora: number; agrupar: boolean; visiveis: number; selecao: ReadonlySet<string>; favoritos: ReadonlySet<string> | null; acoes: AcoesItem; mostrarMais(): void }
export function renderLista(visitas: Visita[], o: OpcoesLista): HTMLElement
```

- [ ] **Step 1: Escrever a prova** com `instalarDom()` e os utilitários `combo`, `escolherCombo` e `opcoesDoCombo` de `tests/util`:
  - **Rótulos dos seletores**, exatamente "Período", "Tipo", "Unidade", "Interessado", "Assunto", "Situação" e "Ordem". O botão "Agrupar por dia" tem `aria-pressed`.
  - **Período** oferece as 5 opções sempre, na ordem de `PERIODOS`, com contagem.
  - **Situação** esconde "Nos favoritos" e "Fora dos favoritos" com `favoritosAtivo: false`. "Sigilosos" só aparece com contagem > 0 ou quando está marcado.
  - **Fichas:** escolher Tipo = "Licitação" chama `filtrar({ tipos: ["Licitação"] })`. Depois de `atualizar`, `ativos` mostra a ficha "Licitação", e clicar nela chama `filtrar` sem `tipos`. Com 2 fichas aparece "Limpar filtros", que mantém só a `busca`.
  - **Agrupar por dia** some (`hidden`) quando `ordem !== "recentes"`.
  - **`renderItem`:**
    - o link do número chama `abrir(v, false)`, e com `ctrlKey`, `abrir(v, true)`;
    - a caixa de seleção tem `aria-label` `Selecionar <protocolo>`;
    - a estrela tem `aria-label` "Favoritar <protocolo>" ou "Tirar <protocolo> dos favoritos" e **não existe** com `favorito: null`;
    - o selo "sigiloso" ou "restrito" aparece;
    - a linha de apoio contém `quando(v.ultima, agora)`, "3 visitas" (com vezes 3), nada de visitas com vezes 1, a sigla da primeira unidade e "ACME, Beta +1" com 3 interessados;
    - o `title` da linha contém "Primeira visita: dd/mm/aaaa hh:mm";
    - o menu `Mais ações para <protocolo>` tem "Abrir em outra aba", "Copiar número", "Favoritar"/"Tirar dos favoritos" (só com Favoritos ativo) e "Remover do histórico".
  - **`renderLista`:**
    - com `agrupar` true, cabeçalhos `.spro-lista-grupo` com rótulo e contagem ("Hoje · 1");
    - com 250 visitas e `visiveis` 200, desenha 200 `li` e o botão "Mostrar mais 50", que chama `mostrarMais`;
    - com `agrupar` false, nenhum cabeçalho.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar.** Espelhe `favoritos/src/app/componentes/filtros.ts` e `item.ts`, com as mesmas técnicas:
  - **Seletores** montados uma vez e só atualizados (`combo.atualizar()`), para não fechar o que está aberto.
  - **Ficha** = `button.spro-lista-ficha`.
  - **Opções:**
    - Tipo, Unidade, Interessado e Assunto vêm das chaves das contagens, ordenadas por contagem decrescente e depois alfabeticamente, com `contagem`. As marcadas aparecem mesmo com contagem 0;
    - Período usa `ROTULO_PERIODO`, `busca: false`;
    - Situação usa os rótulos "Nos favoritos", "Fora dos favoritos", "Visitados mais de uma vez", "Públicos", "Restritos" e "Sigilosos", `busca: false`. As raras ("Visitados mais de uma vez", "Restritos", "Sigilosos") só aparecem com contagem > 0 ou marcadas; "Públicos" e as duas de favoritos (com Favoritos ativo) aparecem sempre.
  - **Ordem:** "Mais recentes" (descrição "Pela última visita"), "Mais visitados" ("Quantas vezes você abriu") e "Por número" ("Pelo número do processo").
  - **Classes CSS:**
    - barra: `spro-lista-filtros`;
    - fichas: `spro-lista-ativos`;
    - item: `li.spro-lista-item` (com `spro-lista-item-selecionado`);
    - caixa: `span.spro-lista-sel-caixa > input.spro-lista-sel`;
    - estrela: `button.spro-lista-estrela` (`aria-pressed`; ícone `estrelaCheia` em `#e0a100` quando favorito, `estrela` quando não);
    - número: `a.spro-lista-protocolo` (`href="#"`, `preventDefault`);
    - selo: `span.spro-pilula.spro-lista-selo` com `--tom:var(--spro-perigo)` no sigiloso e `--tom:var(--spro-aviso)` no restrito, e ícone `cadeado`;
    - texto principal: `div.spro-lista-principal`, com `span.spro-lista-tipo` e `strong.spro-lista-esp`;
    - apoio: `div.spro-lista-apoio`;
    - menu: `classe: "spro-botao-icone pequeno spro-lista-acao"`.
  - **Sigiloso sem especificação:** a linha principal mostra só o tipo; sem tipo, "(sem descrição)".
  - **Lista:** `ul.spro-lista` (ou uma `ul` por grupo, cada uma precedida de `h3.spro-lista-grupo`) e o botão `button.spro-botao.spro-lista-mais`.
- [ ] **Step 4: Rodar** `npm run tipos && npm run checar && npm run verificar`.
- [ ] **Step 5: Commit** (`Historico: componentes (seletores inteligentes, fichas, linha do processo, grupos por dia, mostrar mais)`).

### Task 11: AppHistorico (estado, busca, lote, menu, faixas, diálogos)

**Files:**
- Create: `historico/src/app/app.ts`, `historico/src/app/componentes/dialogos.ts`, `historico/tests/verificar-app.ts`

**Interfaces:**
- Consumes: as Tasks 4 a 7 e 10; `avisar` (`@comum/ui/aviso`); `gerarCsv` (`@comum/csv`); `criarMenu`; `fecharOrfaos` (`@comum/ui/flutuante`).
- Produces:
```ts
export type AbrirModal = (o: { titulo: string; conteudo: HTMLElement; icone?: NomeIcone; aoFechar?: () => void }) => { fechar(): void };
export interface FavoritosDoApp {
  ids(): Promise<Set<string>>;
  favoritar(v: Visita): Promise<{ lista: string; desfazer(): Promise<void> }>;
  tirar(id: string): Promise<{ desfazer(): Promise<void> } | null>;
  aoMudar(cb: () => void): () => void;
}
export interface DepsApp {
  modo: "modal" | "lateral";
  ctx: ContextoHistorico;
  area: Area;                                   // chrome.storage.local
  repo: RepositorioHistorico;
  rpc: Pick<Rpc, "chamar">;                     // abrirProcesso, fechar, apagarLegado
  favoritos: FavoritosDoApp | null;
  historicoLigado(): Promise<boolean>;
  abrirModal: AbrirModal;
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  copiar(texto: string): Promise<void>;
  agora(): number;
  fechar?(): void;                              // só no modal
  abrirLateral?(): void;                        // só no modal, com painel lateral no pacote
  abrirOpcoes(): void;
}
export class AppHistorico { constructor(raiz: HTMLElement, d: DepsApp); iniciar(): Promise<void>; destruir(): void; recarregar(): Promise<void> }
// dialogos.ts
export function montarApagar(o: { aoApagar(p: PeriodoApagar): void; aoCancelar(): void }): HTMLElement
export function montarLimite(o: { atual: Limite; total: number; aoSalvar(l: Limite): void; aoCancelar(): void }): HTMLElement
```

- [ ] **Step 1: Escrever a prova `verificar-app.ts`** com um `DepsApp` falso:
  - `areaMemoria` e um repositório com 5 visitas;
  - `rpc.chamar` que anota as chamadas;
  - `abrirModal` que anexa o conteúdo ao `document.body` e devolve `fechar`;
  - `confirmar` que responde o que a prova mandar;
  - `baixar` e `copiar` que anotam.

  Copie o estilo de `favoritos/tests/verificar-app.ts`. Casos:
  1. **Montagem:**
     - `iniciar()` desenha 5 itens;
     - o cabeçalho tem `h1`/`h2` "Histórico" e "5 processos" no modo modal, e não tem título no lateral;
     - o botão `aria-label="Fechar"` existe só no modal e chama `fechar`;
     - "Abrir na barra lateral" existe só com `abrirLateral`.
  2. **Busca:** digitar na `input[aria-label="Buscar no histórico"]` e esperar 200 ms filtra; Esc limpa; a tecla "/" no `document` foca a busca.
  3. **Seletores:** filtrar por Tipo reduz a lista. "Nada com esses filtros" aparece quando zera, e o botão "Limpar filtros" volta tudo.
  4. **Abrir:**
     - clicar no número → `rpc.chamar("abrirProcesso", { id, protocolo, novaAba: false })` e, **no modal**, `fechar()` em seguida;
     - Ctrl + clique → `novaAba: true` e **não** fecha.
  5. **Lote só com os visíveis:** marcar 3 itens, filtrar até sobrar 1 deles, e a barra de lote mostra "1 selecionado". Clicar "Remover do histórico" e confirmar remove **só** o visível; os 2 escondidos continuam no repositório.
  6. **Lote, outras ações:**
     - "Copiar números" → `copiar` com os protocolos separados por quebra de linha;
     - "Exportar CSV" → `baixar` com nome `historico-seipro-<AAAA-MM-DD>.csv` e conteúdo de `gerarCsv(linhasCsv(...))`.
  7. **Menu "Mais ações do histórico":**
     - "Pausar o registro" grava `registrar: false`, aparece a faixa "O registro está pausado", e o botão "Retomar" volta a `registrar: true`;
     - "Limite de processos…" com 1000 → 500, numa área com 600 visitas, avisa "100 processos mais antigos vão sair" e, ao salvar, `podar(500)` deixa 500;
     - "Apagar histórico…" → "Hoje" remove só as de hoje;
     - "Tudo" remove todas e chama `rpc.chamar("apagarLegado")`. Se a RPC rejeitar, grava `meta.apagarLegado: true`.
  8. **Faixa de migração:** `meta { migrados: 7 }` mostra "Histórico antigo trazido para cá: 7 processos", e "Entendi" grava `avisoMigracao: true` e some.
  9. **Desligado:** `historicoLigado()` false mostra "O histórico está desligado nas opções do SEI Pro." e o botão "Abrir opções" (chama `abrirOpcoes`), sem lista.
  10. **Ao vivo:** gravar uma visita nova no repositório (outra "aba") e, depois de `tique(60)`, ela aparece no topo, sem chamar `recarregar` à mão.
  11. **Agrupar:** com `agruparPorDia` true e ordem "recentes", aparecem cabeçalhos. Ordem "Mais visitados" grava a preferência e some com os cabeçalhos.
  12. **Remover pelo menu da linha** → o aviso "Removido do histórico" com o botão **Desfazer** regrava a visita (guarde a `Visita` antes de remover e grave de volta com `importar([v])`).
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar `app.ts`** espelhando a estrutura de `favoritos/src/app/app.ts`: o construtor monta o DOM fixo, `iniciar` lê e liga os ouvintes, `recarregar`/`agendarRecarga` (30 ms) cuidam das leituras, `redesenhar` só troca o corpo, e `destruir` desliga os ouvintes.

  **DOM (classes que o CSS da Task 12 usa):**
  ```
  #app
    .spro-lista-faixas                (pausado / migração)
    header.spro-lista-topo
      [modal] .spro-lista-titulo  ícone historico + h1 "Histórico" + span.spro-lista-total "N processos"
      .spro-lista-topo-acoes      [abrirLateral] botão "Abrir na barra lateral" (ícone painel) · menu ⋯ · [modal] X
    .spro-lista-ferramentas
      label.spro-lista-busca-caixa  ícone busca + input.spro-lista-busca + kbd.spro-lista-atalho "/"
      barra.el (seletores)
    barra.ativos
    .spro-lista-lote-lugar            (barra de lote quando há seleção)
    .spro-lista-corpo                 (renderLista / vazio / desligado)
  ```

  **Busca:** placeholder "Buscar número, tipo, especificação, interessado ou assunto", `aria-label` "Buscar no histórico", `aria-keyshortcuts` "/", espera de 150 ms, Esc limpa, e o atalho "/" fica fora de campos, diálogos e listas flutuantes (o mesmo teste do Favoritos).

  **Estado:** `todas: Visita[]`, `favs: Set<string> | null`, `filtro: Filtro`, `selecao: Set<string>`, `visiveis = PAGINA_LISTA` (volta a 200 a cada mudança de filtro ou busca), `prefs`, `meta`.

  **Seleção:** a cada redesenho, `selecao` = `selecao` ∩ ids filtrados.

  **Lote** (`div.spro-lista-lote`, com `strong` "N selecionado(s)"):
  - "Favoritar" (só com favoritos e não favoritos na seleção);
  - "Copiar números", "Exportar CSV" e "Remover do histórico" (perigo, com `confirmar("Remover N processos do histórico?", "Remover")`);
  - "Limpar seleção".

  **Cabeçalho:** "Selecionar todos os visíveis" é a caixa no topo da lista, como no Favoritos. Se o Favoritos não tiver isso, um botão "Selecionar visíveis" na barra de lote basta.

  **Menu ⋯ (`rotulo: "Mais ações do histórico"`):**
  - "Exportar CSV" (o filtrado);
  - "Pausar o registro" / "Retomar o registro";
  - "Apagar histórico…";
  - "Limite de processos…";
  - "-";
  - "Opções do SEI Pro".

  **Diálogos** (`dialogos.ts`):
  - **Apagar:** um grupo de opções com rótulos "Da última hora", "De hoje", "Dos últimos 7 dias", "Dos últimos 30 dias" e "Tudo". Embaixo, o parágrafo "Sai o processo inteiro se a última visita dele caiu no período (um processo visto há 20 dias e de novo hoje sai em “De hoje”)." e os botões "Cancelar" e "Apagar" (`spro-botao perigo`).
  - **Limite:** opções 500/1.000/2.000/5.000 e o texto "Hoje há N processos no histórico.". Ao escolher um limite menor que o total: "N processos mais antigos vão sair.". Botões "Cancelar" e "Salvar".
  - Ao apagar "Tudo": `repo.apagarPeriodo("tudo")`; depois `rpc.chamar("apagarLegado", undefined, 5000)`; em qualquer erro, `repo.gravarMeta({ apagarLegado: true })`. Aviso "Histórico apagado".

  **Abrir:**
  - `rpc.chamar("abrirProcesso", { id, protocolo, novaAba }, 15000)`;
  - se falhar, `avisar(erro.message)`;
  - no modal, sem `novaAba`, chama `d.fechar?.()` depois do sucesso.

  **Favoritos** (a ação é a mesma na estrela, no menu e no lote): `favoritar` → `avisar("Favoritado em <lista>", { rotulo: "Desfazer", fazer: desfazer })`. `tirar` → `avisar("Tirado dos favoritos", { rotulo: "Desfazer", ... })`.

  **Mensagens:**
  - vazio sem filtro: `div.spro-lista-vazio` com ícone `historico` 28, "Nenhum processo visitado ainda." e "Abra um processo no SEI e ele aparece aqui.";
  - vazio com filtro: "Nada com esses filtros." e o botão "Limpar filtros";
  - pausado: faixa `div.spro-lista-faixa` com ícone `alerta`, "O registro está pausado: nada novo entra no histórico." e o botão "Retomar".

  **Ouvintes:** `repo.aoMudar`, `favoritos?.aoMudar` e a área nas preferências (`CHAVE_PREFERENCIAS`) disparam `agendarRecarga`.
- [ ] **Step 4: Rodar** `npm run tipos && npm run checar && npm run verificar`.
- [ ] **Step 5: Commit** (`Historico: app (busca, seletores, lote so com os visiveis, pausar, limite, apagar por periodo, faixas, ao vivo)`).

### Task 12: CSS de lista no sei-comum, página e estilo do histórico

**Files:**
- Create: `sei-comum/src/ui/lista.css`, `historico/estatico/historico.html`, `historico/estatico/historico.css`
- Modify: `historico/build.mjs` (copia o HTML; `dist/css/historico.css` = `base.css` + `lista.css` + `historico.css`)

- [ ] **Step 1: Escrever `sei-comum/src/ui/lista.css`.** A base é `favoritos/estatico/favoritos.css`:
  - leia as regras de `.fav-topo`, `.fav-topo-acoes`, `.fav-ferramentas`, `.fav-busca-caixa`, `.fav-busca`, `.fav-atalho`, `.fav-ativos`, `.fav-ficha`, `.fav-limpar-filtros`, `.fav-lote*`, `.fav-corpo`, `.fav-item*`, `.fav-sel-caixa`, `.fav-protocolo`, `.fav-selo`, `.fav-principal`, `.fav-acao`, `.fav-vazio`, `.fav-faixas`/`.fav-faixa` e `.spro-dialogo`;
  - reescreva com os nomes `spro-lista-*` (tabela abaixo), **mesmas medidas, cores, raios, sombras e estados** (hover, focus-visible, selecionado);
  - acrescente `.spro-lista-grupo`: cabeçalho grudado (`position: sticky; top: 0`), 11.5 px, peso 650, `color: var(--spro-suave)`, `background: var(--spro-pagina)`, com a contagem em `span` mais fraco;
  - acrescente `.spro-lista-mais`: centralizado, margem 12 px;
  - acrescente `.spro-lista-estrela`: igual a um `spro-botao-icone pequeno`, `color: var(--spro-suave)`, e `#e0a100` com `aria-pressed="true"`;
  - acrescente `.spro-lista-apoio`: 12 px, `var(--spro-suave)`, uma linha com reticências;
  - **não** copie nada de pasta, etiqueta, prazo, alça de arrastar ou mapa.

  | Favoritos | Lista comum |
  |---|---|
  | `fav-topo` | `spro-lista-topo` |
  | `fav-ferramentas` | `spro-lista-ferramentas` |
  | `fav-busca-caixa` / `fav-busca` / `fav-atalho` | `spro-lista-busca-caixa` / `-busca` / `-atalho` |
  | `fav-ativos` / `fav-ficha` / `fav-limpar-filtros` | `spro-lista-ativos` / `-ficha` / `-limpar` |
  | `fav-lote*` | `spro-lista-lote*` |
  | `fav-corpo` | `spro-lista-corpo` |
  | `fav-item`, `fav-item-selecionado` | `spro-lista-item`, `-item-selecionado` |
  | `fav-sel-caixa`, `fav-sel` | `spro-lista-sel-caixa`, `-sel` |
  | `fav-protocolo`, `fav-selo` | `spro-lista-protocolo`, `-selo` |
  | `fav-principal`, `fav-acao` | `spro-lista-principal`, `-acao` |
  | `fav-vazio`, `fav-faixas`/`fav-faixa` | `spro-lista-vazio`, `-faixas`/`-faixa` |

- [ ] **Step 2: Escrever `historico/estatico/historico.html`** (como `favoritos.html`, com o título "Histórico do SEI Pro", `../css/historico.css`, `../js/historico/app.js` e `<div id="app" aria-live="polite">`).
- [ ] **Step 3: Escrever `historico/estatico/historico.css`.**
  - **Modo lateral** (`html[data-modo="lateral"]`): altura 100%, `#app` rolando por dentro, a barra de ferramentas e as fichas grudadas no topo, como `favoritos.css` faz no lateral.
  - **Modo modal:**
    - `html[data-modo="modal"], html[data-modo="modal"] body { background: transparent; margin: 0; height: 100%; overflow: hidden; }`;
    - `dialog.hist-modal { width: min(1100px, calc(100vw - 32px)); height: min(860px, calc(100vh - 32px)); padding: 0; display: flex; flex-direction: column; }` (só quando `[open]`);
    - `dialog.hist-modal::backdrop { background: rgb(16 24 40 / 45%); }`;
    - `#app` dentro do diálogo em coluna, com `.spro-lista-corpo` em `flex: 1; overflow: auto; min-height: 0`.
  - **Tema:** `html[data-tema="escuro"]` e `[data-cor-sei]` seguem as variáveis da `base.css`, como no embutido do Favoritos. Confira em `base.css` como `data-tema` e `--spro-cor-sei` são consumidos e repita.
  - **Largura:** abaixo de 520 px, os seletores quebram a linha e a busca ocupa a linha inteira.
- [ ] **Step 4: Atualizar `build.mjs`.** Ele copia `estatico/historico.html` para `dist/html/historico.html` e escreve `dist/css/historico.css` = cabeçalho "GERADO" + `base.css` + `lista.css` + `historico.css`. O `lista.css` também tem de entrar no `npm run checar` do sei-comum se o biome checar CSS (veja o `biome.json` da sei-comum).
- [ ] **Step 5: Conferir visualmente** com uma página de demonstração em `scratchpad`: abra `dist/html/historico.html#modo=lateral` num Chrome com a extensão carregada (ou num servidor de arquivos estáticos com um `chrome` falso). Se não der para ver aqui, registre e deixe a conferência para a Task 17. A prova automática desta tarefa é só o build passar e o `npm run checar`.
- [ ] **Step 6: Commit** (`Historico: CSS de lista no sei-comum (mesmo desenho do Favoritos) e pagina do historico (modal e lateral)`).

### Task 13: modo modal (app + content script + legado)

**Files:**
- Create: `historico/src/app/main.ts` (os dois modos; aqui só o modal funciona, o lateral entra na Task 14), `historico/src/pagina/modal.ts`, `historico/src/pagina/executor.ts`, `historico/tests/verificar-modal.ts`
- Modify: `historico/src/pagina/main.ts`, `historico/build.mjs` (entrada `src/app/main.ts` → `dist/js/historico/app.js`, ESM), `dist/js/sei-functions-pro.js`

**Interfaces:**
- Consumes: `esperarConexaoDaAba` (`@comum/ponte/conexaoDaAba`); `criarRpc`, `Rpc`, `Tratador` (`@comum/ponte/rpc`); `abrirProcesso` (`@comum/pagina/abrir`); `definirEmissorDeAviso`/`mostrarAviso` (`@comum/ui/aviso`); a Task 11.
- Produces:
```ts
// pagina/modal.ts
export interface ModalMontado { iframe: HTMLIFrameElement; fechar(): void }
export function montarModal(doc: Document, o: { urlApp: string; temaEscuro: boolean; aoFechar?: () => void }): ModalMontado
// pagina/executor.ts
export interface DepsExecutor { doc: Document; ctx: ContextoHistorico; armazenamento: Pick<Storage, "removeItem">; fechar?: () => void }
export function tratadoresHistorico(d: DepsExecutor): Record<string, Tratador>  // contexto, abrirProcesso, fechar, apagarLegado
// pagina/main.ts (topo)
function ligarModal(ctx: ContextoHistorico): void   // escuta EVENTO_ABRIR
```

- [ ] **Step 1: Escrever a prova `verificar-modal.ts`** (linkedom):
  - **`montarModal`:**
    - cria um `iframe[data-spro-historico-modal]` no `body` com `position:fixed`, `inset:0`, `z-index:2147483646`, `background:transparent` e `color-scheme` escuro ou claro;
    - trava a rolagem (`html` e `body` com `overflow: hidden`), guardando os valores anteriores (`body.style.overflow = "scroll"` antes da prova);
    - `fechar()` tira o iframe, devolve os valores **exatos** anteriores e chama `aoFechar`. Chamar `fechar()` duas vezes não lança.
  - **Content script do topo** (a função que `ligarModal` usa por dentro, exportada para a prova): disparar `new CustomEvent(EVENTO_ABRIR)` no `document` abre o modal. Disparar de novo com ele aberto **não** cria o segundo iframe.
  - **Esc no documento da página** com o modal aberto fecha.
  - **Porta caída:** simule com `parDePortas`, fechando a porta do lado do app. O iframe sai e a rolagem volta.
  - **`tratadoresHistorico`:**
    - `contexto` devolve `ctx`;
    - `abrirProcesso`, numa página com `#frmProtocoloPesquisaRapida` + `#txtPesquisaRapida`, preenche o campo e submete (use `telaSei("sei41/caixa.html")` ou um formulário mínimo);
    - `fechar` chama `d.fechar`;
    - `apagarLegado` remove `dadosHistoricoProcessoPro`.
  - **Foco devolvido:** com `#historicoProcessosPro` na página, fechar devolve o foco a ele.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar `pagina/modal.ts`.**
```ts
const CAMADA = "position:fixed;inset:0;left:0;top:0;width:100vw;height:100vh;max-width:none;max-height:none;margin:0;border:0;padding:0;z-index:2147483646;background:transparent;display:block;";
export function montarModal(doc: Document, o: { urlApp: string; temaEscuro: boolean; aoFechar?: () => void }): ModalMontado {
  const iframe = h("iframe", { src: o.urlApp, title: "Histórico de processos visitados", allow: "clipboard-write", "data-spro-historico-modal": "1", style: `${CAMADA}color-scheme:${o.temaEscuro ? "dark" : "light"};` });
  const travados: Array<[HTMLElement, string]> = [doc.documentElement, doc.body].filter((el): el is HTMLElement => !!el).map((el) => [el, el.style.overflow]);
  for (const [el] of travados) el.style.overflow = "hidden";
  (doc.body ?? doc.documentElement).append(iframe);
  iframe.addEventListener("load", () => iframe.focus());
  let fechado = false;
  return {
    iframe,
    fechar() {
      if (fechado) return;
      fechado = true;
      iframe.remove();
      for (const [el, v] of travados) el.style.overflow = v;
      o.aoFechar?.();
    },
  };
}
```
- [ ] **Step 4: Implementar o executor e ligar no `main.ts` do topo.**
  - `ligarModal(ctx)`:
    - escuta `EVENTO_ABRIR` no `document`;
    - abre com `montarModal(document, { urlApp: chrome.runtime.getURL("html/historico.html#modo=modal"), temaEscuro: ctx.temaEscuro, aoFechar })`;
    - a cada `load` do iframe, nova porta: `criarRpc(chrome.runtime.connect({ name: CANAL_HISTORICO }), tratadoresHistorico({ doc: document, ctx, armazenamento: localStorage, fechar }))`;
    - `rpc.aoFechar(fechar)`, com guarda contra reentrada (a flag `fechando`);
    - Esc no `document` da página enquanto aberto fecha;
    - o `aoFechar` devolve o foco a `#historicoProcessosPro` se existir.
  - Chame `ligarModal(ctx)` no ramo `noTopo` do `principal()`.
- [ ] **Step 5: Implementar `app/main.ts`, modo modal.** Espelha `favoritos/src/app/main.ts#iniciarEmbutido`:
  - `document.documentElement.dataset.modo = "modal"`;
  - `const rpc = await esperarConexaoDaAba(CANAL_HISTORICO)` (registrar o ouvinte **antes** de tudo);
  - `ctx = await rpc.chamar<ContextoHistorico>("contexto")`;
  - tema e cor: `dataset.tema` e `--spro-cor-sei`/`data-cor-sei`, iguais ao embutido.
  - O app é montado dentro de `<dialog class="spro-dialogo hist-modal" aria-label="Histórico de processos visitados">` com `showModal()`:
    - o `close` do diálogo → `rpc.chamar("fechar")`;
    - clique no próprio `<dialog>` fora do retângulo do conteúdo (véu) → `dlg.close()`;
    - o `cancel` (Esc) fecha **só** se não houver outro diálogo aberto por cima: o nativo já cuida, porque o Esc vai para o topo da pilha.
  - `abrirModal` dos diálogos internos: igual ao `favoritos/src/app/main.ts#abrirModal`, anexando ao `document.body`. Os diálogos são `<dialog>` modais irmãos, e o mais novo fica por cima na top layer.
  - Os outros campos de `DepsApp`:
    - `fechar: () => dlg.close()`;
    - `abrirOpcoes: () => chrome.runtime.openOptionsPage()`;
    - `historicoLigado: () => lerOpcaoLegada("historicoproc")`;
    - `abrirLateral` só se `ctx.lateralDisponivel`: `chrome.runtime.sendMessage({ tipo: "abrirPainel", aba: "historico" })` e depois `dlg.close()`. Se falhar, `window.open(chrome.runtime.getURL("html/painel.html#aba=historico"), "seiProPainel", "popup,width=420,height=760")`.
  - `favoritos`: `null` por enquanto (Task 15).
  - `baixar`, `copiar` e `confirmar`: iguais ao Favoritos.
  - `repo = new RepositorioHistorico(areaChrome(chrome.storage.local, "local"), chaveEscopo(ctx.host, ctx.login))`.
  - Avisos: os do app, sem emissor; o iframe cobre a tela, então o aviso já fica no rodapé dela.
  - Erro ao iniciar: `<p class="spro-lista-erro">Não foi possível abrir o histórico: …</p>` dentro do diálogo, e mesmo assim o diálogo abre (para dar para fechar).
- [ ] **Step 6: Legado `dist/js/sei-functions-pro.js`** (só ASCII; `ó` = ó).
  - No início de `getHistoryProcessosPro`, **depois** da linha `$(infraBarraS+'.barSuspenso').trigger('click');`:
```js
    // Historico novo (js/init_historico.js, SEI Pro Lab): o modal e dele.
    if (document.documentElement.hasAttribute('data-seipro-historico')) {
        document.dispatchEvent(new CustomEvent('spro-historico-abrir'));
        return;
    }
```
  - No início de `setHistoryProcessosPro`:
```js
    // Historico novo (js/init_historico.js): a captura e dele, pela arvore.
    if (document.documentElement.hasAttribute('data-seipro-historico')) return;
```
  - Confira a sintaxe com `node -e "new Function(require('fs').readFileSync('dist/js/sei-functions-pro.js','utf8'))"` e os bytes com o comando das Global Constraints.
- [ ] **Step 7: Build e provas.** Em historico, `npm run tipos && npm run checar && npm run verificar && node build.mjs`. No favoritos, `npm run verificar` (572).
- [ ] **Step 8: Commit** (`Historico: modal no SEI (item do menu do legado dispara o evento; iframe sobre a tela; fecha por Esc, X, veu ou porta caida)`), incluindo `dist/js/sei-functions-pro.js`, `dist/js/init_historico.js`, `dist/js/historico/app.js`, `dist/html/historico.html` e `dist/css/historico.css`.

---

## FASE 3: barra lateral

### Task 14: aba lateral (app + lado da aba + manifest)

**Files:**
- Create: `historico/src/pagina/lateral.ts`, `historico/tests/verificar-lateral.ts`
- Modify: `historico/src/app/main.ts` (modo lateral), `historico/src/pagina/main.ts`, `dist/manifest.json`

**Interfaces:**
- Consumes: `PonteLateral`, `ligarLadoAba` (`@comum/ponte/lateral`, Task 1); `CANAL_LATERAL`, `CHAVE_LATERAL` e `chaveEscopo` do histórico.
- Produces:
```ts
// pagina/lateral.ts
export function ligarPainelLateral(ctx: ContextoHistorico, area: Area, tratadores: Record<string, Tratador>): void
```

- [ ] **Step 1: Escrever a prova `verificar-lateral.ts`**, com a técnica de `favoritos/tests/verificar-lateral.ts`: `parDePortas`, uma `PonteLateral` com `chave: CHAVE_LATERAL` e `ligarLadoAba` com os tratadores do histórico.
  - A aba se apresenta com a chave `host|login`, **sem** a unidade: duas abas da mesma pessoa em unidades diferentes dão a mesma chave.
  - `daChave("sei|ana")` encaminha `abrirProcesso` para a aba certa.
  - Uma aba de outro login não recebe o pedido.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar `pagina/lateral.ts`** espelhando `ligarPainelLateral` de `favoritos/src/pagina/main.ts`, com estas diferenças:
  - `chave: CHAVE_LATERAL` (do histórico);
  - `conectar: () => chrome.runtime.connect({ name: CANAL_LATERAL })`;
  - `estado: () => ({ visivel, foco, chave: chaveEscopo(ctx.host, ctx.login) })`;
  - foco em `focus`/`visibilitychange` e `setInterval(verificar, 5000)`.
  - No `main.ts` do topo, chame com `tratadoresHistorico({ doc: document, ctx, armazenamento: localStorage })`, **sem** `fechar`.
- [ ] **Step 4: Implementar o modo lateral do `app/main.ts`**, espelhando `iniciarLateral` do Favoritos:
  - `dataset.modo = "lateral"`; o tema segue o sistema (sem `data-tema`);
  - **antes** de procurar a aba, se `!(await lerOpcaoLegada("historicoproc"))`, monta o app num estado só de "desligado". Pode ser `AppHistorico` com um `ctx` mínimo e `historicoLigado` falso, ou uma mensagem direta com o mesmo texto e o botão "Abrir opções";
  - `PonteLateral({ area, chave: CHAVE_LATERAL, janela, novoId, ouvirConexoes: (cb) => chrome.runtime.onConnect.addListener((p) => { if (p.name === CANAL_LATERAL) cb(p as unknown as PortaRpc, p.sender ?? {}); }) })`;
  - `reagir()` em fila: a chave da aba atual muda → `destruir()` o app montado e montar outro com o `contexto` dela (o mesmo cuidado de conferir a chave depois do `await`);
  - `rpc.chamar` vai para `ponte.daChave(montado.chave)`. Sem aba: `ErroRpc("SEM_ABA", "A aba do SEI deste histórico não está mais aberta nesta janela. Abra o SEI e tente de novo.")`;
  - sem aba nenhuma: `div.spro-lista-sem-aba` com ícone `historico` 28, "Abra o SEI nesta janela para ver seu histórico." e "Se o SEI já está aberto e nada aparece, recarregue a página dele (F5).";
  - o primeiro texto é "Procurando o SEI nesta janela…", com `setTimeout(reagir, 1500)`;
  - `pagehide` → `ponte.encerrar()`;
  - `fechar` e `abrirLateral` ficam ausentes no modo lateral.
- [ ] **Step 5: `dist/manifest.json`.**
  - Acrescente o content script logo depois do `init_favoritos.js`:
```json
{ "matches": ["*://*.br/sei/*", "*://*.br/sip/*"], "js": ["js/init_historico.js"], "all_frames": true, "run_at": "document_start" }
```
    Copie exatamente os `matches` e `exclude_matches` do bloco do `init_favoritos.js`, se houver diferença.
  - No WAR (o mesmo bloco que tem `html/favoritos.html`), acrescente `html/historico.html`, `js/historico/app.js` e `css/historico.css`.
  - Valide com `python3 -c "import json;json.load(open('dist/manifest.json'))"`.
- [ ] **Step 6: Build e provas** (historico, favoritos). Rode também o `node build.mjs` do favoritos: ele regera o `painel.js` com o shell da Task 2.
- [ ] **Step 7: Commit** (`Historico: aba na barra lateral (ponte pela chave SEI+login, ao vivo) e manifest do Lab`), com `dist/manifest.json` e os arquivos gerados.

---

## FASE 4: Favoritos e Agente

### Task 15: ligação com os Favoritos

**Files:**
- Create: `historico/src/app/favoritos.ts`, `historico/tests/verificar-favoritos.ts`
- Modify: `historico/src/app/main.ts` (os dois modos)

**Interfaces:**
- Consumes: `RepositorioFavoritos`, `moverEntreListas` se precisar (`@favoritos/repositorio`); `escoposDoContexto`, `rotuloDaLista` (`@favoritos/modelo/escopo`); `ContextoAba` (`@favoritos/modelo/tipos`); `idDispositivo` (`@comum/armazenamento/dispositivo`).
- Produces:
```ts
export function favoritosDoApp(area: Area, ctx: ContextoHistorico, carimbo: () => { agora: number; dispositivo: string }): FavoritosDoApp | null  // null se !ctx.favoritosAtivo
```

- [ ] **Step 1: Escrever a prova** (`areaMemoria`; `ctx` com a unidade GPF e `favoritosAtivo: true`):
  - `ids()` reúne os ativos das listas GPF e Pessoal, sem os que estão na lixeira;
  - `favoritar(v)` grava na lista **da unidade**, com protocolo, tipo, especificação e `sigiloso` = (`nivel === "sigiloso"`), e devolve `lista: "GPF"`;
  - sem unidade no `ctx`, grava na Pessoal (`lista: "Pessoal"`);
  - `desfazer()` do `favoritar` tira o favorito (sai de `ids()`);
  - `tirar(id)` tira de onde está e devolve `desfazer`, que restaura (`restaurar`);
  - `tirar` de quem não é favorito devolve null;
  - `aoMudar` dispara quando a lista Pessoal muda;
  - `favoritosAtivo: false` → `favoritosDoApp(...)` devolve null.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar.**
  - O `ContextoAba` do Favoritos é montado a partir do `ContextoHistorico`: `{ host, login, nome, unidade, versao, temaEscuro }`.
  - Os repositórios vêm de `escoposDoContexto(ctxFav)`: `unidade` (pode ser null) e `pessoal`.
  - `ids()`: `ativos()` dos dois.
  - `favoritar`: `(repos.unidade ?? repos.pessoal).adicionar({ id, protocolo, tipo, especificacao, sigiloso: v.nivel === "sigiloso" })`. O desfazer é `repo.remover([id])`.
  - `tirar`: procura com `contem` em cada lista e chama `remover([id])`. O desfazer é `restaurar([id])`.
  - `aoMudar`: liga nos dois e devolve uma função que desliga ambos.
- [ ] **Step 4: Ligar no `app/main.ts`:** `favoritos: favoritosDoApp(area, ctx, carimbo)` nos dois modos, com o `carimbo` de `idDispositivo(area)`, como no Favoritos. Confira na prova do app (Task 11) que estrela, filtro e lote já funcionam com o `FavoritosDoApp` falso. Se faltar alguma, complete aqui com prova.
- [ ] **Step 5: Rodar** historico e favoritos (`npm run verificar`), `npm run tipos` no agente-ia e `node build.mjs` no historico.
- [ ] **Step 6: Commit** (`Historico: estrela, filtro e favoritar em lote ligados aos Favoritos (lista da unidade, Desfazer)`).

### Task 16: ferramenta do Agente de IA

**Files:**
- Create: `agente-ia/src/tools/historico.ts`, `agente-ia/tests/verificar-historico.ts` (ou acrescentar ao arquivo de provas de ferramentas que testa `favoritos_listar`; procure com `grep -rn "favoritos_listar" agente-ia/tests`)
- Modify: `agente-ia/tsconfig.json` (path `"@historico/*": ["../historico/src/*"]`), `agente-ia/src/tools/sei.ts`, `agente-ia/src/painel/sugestoes.ts`

**Interfaces:**
- Consumes: `RepositorioHistorico` (`@historico/repositorio`); `filtrar`, `ordenar` (`@historico/modelo/operacoes`); `dataHora` (`@historico/modelo/dias`); `chaveEscopo` (`@historico/modelo/constantes`); `definirTool` e `s` do motor do agente; a operação `favoritos.escopo` que já existe.
- Produces:
```ts
export function definirAreaHistorico(f: () => Area): void   // para as provas
export const TOOL_HISTORICO: DefTool                        // nome "historico_listar"
export function historicoInstalado(): boolean               // manifest tem js/init_historico.js (false sem chrome)
```

- [ ] **Step 1: Escrever a prova**, copiando o jeito da prova de `favoritos_listar`: `ctx.sei` falso devolvendo `{ host, login, unidade }` e uma área em memória com 4 visitas (uma sigilosa, uma de 10 dias atrás e uma vista 3 vezes).
  - Sem argumentos: devolve as 3 não sigilosas, da mais recente para a mais antiga, com `sigilososOmitidos: 1`, e **nenhum** campo do sigiloso aparece no `JSON.stringify` do resultado (nem o número).
  - `periodo: "7dias"`: só as dos últimos 7 dias.
  - `busca` sem acento funciona.
  - `ordem: "visitados"`: a de 3 visitas vem primeiro.
  - `limite: 1`: 1 item e `cortados: 2`.
  - `limite: 999`: no máximo 200.
  - Cada item tem `protocolo`, `tipo`, `especificacao`, `ultimaVisita` (formato `dd/mm/aaaa hh:mm`), `vezes` e `unidade`, mais `interessados` e `assuntos` quando existem.
- [ ] **Step 2: Rodar.** Esperado: FALHA.
- [ ] **Step 3: Implementar** no molde de `agente-ia/src/tools/favoritos.ts`.
  - `descricao`: "Lista os processos que o usuário VISITOU no SEI (histórico do SEI Pro): número, tipo, especificação, interessados, assuntos, quando abriu pela última vez, quantas vezes e em qual unidade. Use para 'que processos eu vi ontem', 'retome o processo de licitação que abri semana passada', 'quais processos mais consultei'. Somente leitura; não abre nada no SEI. Processos sigilosos ficam de fora."
  - Parâmetros:
    - `busca?`;
    - `periodo?` (enum `hoje`, `ontem`, `7dias`, `30dias`, `todos`; padrão `todos`), aplicado como `filtrar(..., { periodos: [periodo] })` quando não é `todos`;
    - `tipo?` (texto: filtra com `normalizarTexto(v.tipo).includes(normalizarTexto(tipo))`);
    - `unidade?` (sigla, sem caixa);
    - `ordem?` (`recentes` | `visitados`);
    - `limite?` (número; padrão 30, mínimo 1, máximo 200).
  - `efeito: "leitura"`, `rotulo: () => "Ler o histórico de processos"`.
  - O escopo vem de `chaveEscopo(e.host, e.login)` com `e = await ctx.sei("favoritos.escopo")`.
- [ ] **Step 4: Registrar e sugerir.**
  - Em `sei.ts`: `export const TOOLS_SEI: DefTool[] = [TOOL_FAVORITOS, ...(historicoInstalado() ? [TOOL_HISTORICO] : []), ...]`. O `historicoInstalado` usa `try { return (chrome.runtime.getManifest().content_scripts ?? []).some((c) => c.js?.includes("js/init_historico.js")); } catch { return false; }`.
  - Em `sugestoes.ts`, uma sugestão nova perto da dos favoritos, com `cabe` = a mesma condição que a dos favoritos usa e `historicoInstalado()`:
    - `rotulo: "Processos que vi esta semana"`;
    - `descricao: "do histórico do SEI Pro"`;
    - prompt: "Liste os processos que visitei nos últimos 7 dias, do mais recente ao mais antigo, com tipo e especificação, e diga quais parecem pedir ação minha.".
  - Escreva os acentos em `\uXXXX` dentro das strings, como o arquivo já faz.
- [ ] **Step 5: Rodar** agente-ia `npm run tipos && npm run verificar` (1012 + as novas) e o build do agente (`npm run build:rapido`; confira se o portão ASCII dele passa). Rode também `npm run tipos` em historico e favoritos.
- [ ] **Step 6: Commit** (`Agente: ferramenta historico_listar (somente leitura, sem sigilosos) e sugestao 'Processos que vi esta semana'`), com os bundles regerados em `dist/js/agente*` (os que o build do agente gera).

---

## FASE 5: fechamento

### Task 17: build completo, provas ao vivo e acertos

**Files:** os que os acertos pedirem.

- [ ] **Step 1: Build de tudo, do zero.** `cd sei-comum && npm run verificar`, depois `cd ../sei-nucleo && npm run verificar`, depois `cd ../favoritos && npm run build`, depois `cd ../historico && npm run build`, depois `cd ../agente-ia && npm run build`. Esperado: tudo verde, e os portões ASCII passando.
- [ ] **Step 2: Conferências estáticas.**
  - **Bytes:** nenhum byte > 127 em `dist/js/init_historico.js`, `dist/js/historico/app.js`, `dist/js/sei-functions-pro.js` e `dist/background.js`.
  - **Manifest:** válido.
  - **DOM:** `node tools/check-dom-injection.mjs`, se existir. Inclua os arquivos gerados novos na lista `ARQUIVOS_GERADOS` dele: o `tools/` é ignorado pelo git, então a mudança fica só local.
  - **Cópias do iCloud:** `git status` limpo de arquivos "nome 2.ext".
- [ ] **Step 3: Provas ao vivo no SEI SP 4.1.5 de treinamento** (memória `reference_sei_sp_treinamento`: URL, credenciais e o harness Chrome na porta 9444 com a extensão de `dist/` carregada):
  1. Abrir 3 processos → a lateral (aba Histórico) mostra os 3 ao vivo, o mais recente no topo, com especificação e interessados depois de alguns segundos.
  2. Menu "Histórico de Processos Visitados" → o modal abre centralizado, a página do SEI não rola por trás, e o Esc fecha e devolve a rolagem.
  3. No modal, clicar num número → o processo abre e o modal fecha. Ctrl + clique abre em nova aba.
  4. Filtro Tipo + Período + busca por pedaço do número.
  5. Estrela → o processo aparece nos Favoritos (aba Favoritos do painel). Desfazer funciona.
  6. Pausar → abrir um processo novo não entra. Retomar.
  7. Migração: antes de carregar a versão nova, gravar no `localStorage` do SEI um `dadosHistoricoProcessoPro` de exemplo; ao abrir, a faixa "Histórico antigo trazido para cá" aparece.
  8. Tema escuro do SEI Pro (modal) e sistema escuro (lateral).
  9. Agente: "Que processos eu vi hoje?" usa `historico_listar`.

  Guarde as capturas em `scratchpad`. Defeito achado: prova automática que o reproduz, correção, commit.
- [ ] **Step 4: Revisão final da branch inteira** (subagente revisor, com a spec e este plano). Corrija os críticos e importantes com prova.
- [ ] **Step 5: Commit final dos acertos.** A branch fica pronta, **sem** merge, push nem release: o autor decide (memória `feedback_release_historico`: o HISTORICO.md só no release).
