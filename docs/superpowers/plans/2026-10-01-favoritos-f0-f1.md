# Favoritos em TypeScript — Plano F0 + F1 (fundação e favoritos locais)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir, no pacote Lab, o favoritos legado (`dist/js/sei-pro-favoritos.js`) por um favoritos novo em TypeScript, com os dados em `chrome.storage.local`. A lista fica por unidade, mais a lista Pessoal, e aparece abaixo da tabela do Controle de Processos. Junto saem as bibliotecas compartilhadas que as próximas migrações vão usar.

**Architecture:** São três pacotes irmãos, no molde do `agente-ia/`:
- `sei-comum/` (novo, sem conhecimento do SEI): datas e feriados, UI (`h`/`icone`), armazenamento por chave, mesclagem por entidade, índice fracionário, opções legadas e RPC sobre portas.
- `sei-nucleo/` (existe): ganha o id da unidade e a leitura da caixa a partir da tela já aberta.
- `favoritos/` (novo): a funcionalidade, em duas partes que só conversam pelo `chrome.storage` e por uma porta `chrome.runtime`:
  - um content script (`init_favoritos.js`, em todos os frames, no `document_start`) que põe as estrelas e embute o app;
  - um app (`html/favoritos.html`, página da extensão num iframe abaixo da lista).

**Tech Stack:** TypeScript 5.9 strict (+ `noUncheckedIndexedAccess`), esbuild 0.25 (`charset: "ascii"`, alvo chrome116/firefox115), testes `tsx` + `linkedom` sem framework (`checar()`), Biome 2 (lint + formatação, só nos pacotes novos) e `fractional-indexing` 3.

**Spec:** `docs/superpowers/specs/2026-10-01-favoritos-design.md`. Leia as seções 2, 3, 5, 6, 7.1, 7.2, 7.5, 8.2, 9.4, 11 e 13 antes de começar.

**Ensaio (01/10/2026):** o código das Tarefas 2 a 19 foi extraído deste plano para um diretório de rascunho e executado, com a Tarefa 8 aplicada numa cópia do `sei-nucleo`. Resultado:

| Pacote | Testes | `tsc` | Biome |
|---|---|---|---|
| `sei-comum` | 83 ok | limpo | limpo |
| `sei-nucleo` | 88 ok | limpo | — |
| `favoritos` | 192 ok | limpo | limpo |

O `build.mjs` gerou 42 KB de content script e 54 KB de app, sem acento cru. Os erros que o ensaio achou já estão corrigidos aqui: o tipo do `rpc.ts`, o `!important` do `[hidden]` e o `checked` do linkedom. O que o ensaio não cobre é o que só existe ao vivo: as Tarefas 19 (P2 e roteiro no SEI) e 20 (P1).

**Escopo deste plano:** F0 (fundação) e F1 (favoritos locais). Ficam para os planos seguintes, cada um escrito sobre o que este entregar:
- **F2:** painel lateral com abas e página de opções; prova P3 (agente dentro de iframe).
- **F3:** Texto Padrão e arquivo; prova P4 (File System Access). Também o codec gzip/base64 e o `sei-nucleo/dominio/textoPadrao.ts`.
- **F4:** o que mudou, lembretes, documentos favoritos, Enviar Processo, estrela na Pesquisa e mapa.
- **F5 e F6.**

Mudança em relação à seção 13 do spec: a estrela nos resultados da Pesquisa foi para a F4, porque o `lerResultados` do núcleo não traz o `id_procedimento`. A prova P1 (Texto Padrão) **fica neste plano** (Tarefa 20), porque não depende de código e reduz o risco da F3.

## Global Constraints

- **Lab primeiro:** só `dist/manifest.json` (o pacote Lab) ganha o content script novo. `manifest_seipro.json` e os manifests dos órgãos não mudam nesta etapa.
- **Base local:** `chrome.storage.local`. O favoritos novo **não grava nada** no `localStorage` do SEI. Ele só lê o legado (`configDataFavoritesPro`, `optionsPro`, `darkModePro`) e nunca o apaga.
- **Uma chave por entidade:**
  - `favoritos/<escopo>/f/<id>`, `favoritos/<escopo>/p/<id>`, `favoritos/<escopo>/e/<id>` e `favoritos/<escopo>/meta`;
  - preferências em `chrome.storage.sync`, chave `favoritos/preferencias`;
  - id do dispositivo em `seipro/dispositivo`.
- **Escopo:** `host|login|u:<idUnidade>` ou `host|login|pessoal`, com o login em minúsculas.
- **Mesclagem:** vence o maior `atualizadoEm`; o empate se resolve pelo `dispositivo`. As lápides (`removidoEm`) duram 90 dias, e a Lixeira mostra os últimos 30.
- **Nunca montar link do SEI** (derruba a sessão). Só se usam links que a página já tem ou a pesquisa rápida da própria tela.
- **Favoritar não faz requisição ao SEI:** os dados vêm da tela. Nada abre a árvore em segundo plano, porque `arvore_montar.php:420` chama `ProcedimentoRN::receber`.
- **Sigiloso:** pode ser favoritado, mas sem especificação.
- **DOM seguro:** nada de `innerHTML`, `insertAdjacentHTML`, `document.write` nem atributo `on*`. Tudo se monta por `h()` e `icone()`. Ler `outerHTML` é permitido.
- **Testes e build:**
  - testes em `tests/verificar-*.ts`, com `tsx` + `linkedom` e `checar()`;
  - `npm run build` só gera se os testes passarem;
  - arquivos gerados levam o banner `GERADO por ... NAO EDITE` e nunca se editam à mão.
- **Biome** nos pacotes novos: rode `npx biome check --write src tests` antes de cada commit e confira com `npm run checar`.
- **Idioma e estilo:**
  - código, nomes, comentários e commits em pt-BR;
  - o comentário explica o porquê;
  - dentro das bibliotecas (`sei-comum`, `sei-nucleo`), imports relativos.
- **Legado em `dist/js/*.js`:** só ASCII. Comentário sem acento; texto com acento vai como `\uXXXX`.
- **Datas civis:** formato `AAAA-MM-DD`, sempre no **fuso local**. Nunca use `toISOString()` para obter a data.
- **Limites:** até 8 etiquetas por favorito; nota com até 2.000 caracteres.
- **Commits:**
  - `git add` por caminho (nunca `-A`);
  - mensagem no formato `Area: descricao`, sem acento;
  - termine com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
  - confira `git branch --show-current` antes de comitar.

## Review Focus

1. **"Hoje" perto da meia-noite.** Entre 21h e 23h59 em Brasília, `toISOString()` já marca o dia seguinte. Prazos e "hoje" devem usar a data local. O teste fica na Tarefa 2.
2. **Dados legados malformados.** Categoria com aspas, `id_procedimento` numérico ou repetido, `configdate` nulo, `etiquetas` nulo, `order` nulo ou -1, JSON inválido e BOM: a migração não quebra, deduplica e mantém a ordem. O teste fica na Tarefa 12.
3. **Duas escritas ao mesmo tempo.** A estrela no content script e uma edição no app (ou duas abas) gravando juntas não perdem itens da lista. No mesmo item, vale a última gravação. O teste fica na Tarefa 11.
4. **SEI sem `#lnkInfraUnidade`.** No SEI 3, o id e a sigla vêm do `#selInfraUnidades`; sem cabeçalho, da URL; sem id nenhum, só existe a lista Pessoal, sem quebrar. Os testes ficam nas Tarefas 8 e 9.
5. **Linhas que chegam depois e linhas sigilosas.** A paginação infinita do legado acrescenta linhas: elas ganham estrela, sem duplicar. Uma linha sigilosa favorita sem especificação. O teste fica na Tarefa 13.

---

## Mapa de arquivos

```
sei-comum/                         (novo; biblioteca, sem SEI)
  package.json, tsconfig.json, biome.json, README.md
  src/datas/dias.ts                hojeISO, deISO, somarDias, diferencaDias, ehDiaUtil, somarDiasUteis, diasUteisEntre, formatarData
  src/datas/feriados.ts            pascoa, feriadosNacionais, conjuntoDeFeriados
  src/texto.ts                     normalizarTexto, hashCurto
  src/ui/dom.ts                    h, icone, NomeIcone
  src/ui/base.css                  tokens (claro/escuro) e componentes básicos
  src/armazenamento/area.ts        Area, areaChrome, areaMemoria
  src/armazenamento/colecao.ts     Colecao<T> (uma chave por entidade)
  src/armazenamento/dispositivo.ts idDispositivo
  src/sincronia/entidade.ts        Versionada, vence, mesclar, purgarLapides
  src/ordem/indice.ts              indiceEntre, indicesEntre
  src/opcoes/legadas.ts            opcaoLegadaLigada, lerOpcaoLegada
  src/ponte/rpc.ts                 PortaRpc, criarRpc, ErroRpc, Tratador
  src/ponte/parDePortas.ts         par de portas em memória (testes)
  tests/util.ts, tests/verificar.ts, tests/verificar-*.ts

sei-nucleo/ (existe)
  src/sei.ts                       + ContextoSei.unidade.id, lerIdUnidade
  src/dominio/caixa.ts             + lerLinhaCaixa, lerCaixaDaPagina, documentoNovo
  src/index.ts                     + exports
  tests/util.ts                    + paginaSintetica
  tests/verificar-dominio.ts       + casos

favoritos/                         (novo; a funcionalidade)
  package.json, tsconfig.json, biome.json, build.mjs, README.md
  estatico/favoritos.html, estatico/favoritos.css
  src/tipos.d.ts                   import de .css como texto
  src/modelo/constantes.ts         canal, chaves, limites
  src/modelo/tipos.ts              Favorito, Pasta, Etiqueta, Prazo, Escopo, ContextoAba, Preferencias, DadosProcesso
  src/modelo/escopo.ts             chaveEscopo, escoposDoContexto
  src/modelo/operacoes.ts          novoFavorito, editar, remover, restaurar, filtrar, ordenar
  src/modelo/prazo.ts              calcularPrazo, vencimentoDe, feriadosPara
  src/repositorio.ts               RepositorioFavoritos, moverEntreListas
  src/preferencias.ts              lerPreferencias, gravarPreferencias
  src/arquivo.ts                   Envelope, exportarTudo, lerEnvelope, importarEnvelope
  src/migracao/legado.ts           converterLegado, converterConfigDate
  src/migracao/fontes.ts           lerLegadoLocal, lerArquivoAntigo
  src/pagina/main.ts               entrada do content script
  src/pagina/marca.ts              data-seipro-favoritos (o legado se desliga)
  src/pagina/contexto.ts           paginaDe, documentoTopo, contextoDe, temaEscuroLegado
  src/pagina/esperar.ts            esperar
  src/pagina/estilo.ts             CSS das estrelas na página do SEI
  src/pagina/estrela.ts            criarEstrela, atualizarEstrela
  src/pagina/servico.ts            ServicoFavoritosPagina
  src/pagina/estrelasCaixa.ts      Controle de Processos
  src/pagina/estrelasListas.ts     blocos, acompanhamento, sobrestados
  src/pagina/estrelaArvore.ts      topo da árvore
  src/pagina/balao.ts              cadastro rápido ao favoritar
  src/pagina/painel.ts             painel embutido (iframe) abaixo da lista
  src/pagina/abrir.ts              abrir processo sem montar link
  src/pagina/executor.ts           operações que o app pede à aba
  src/app/main.ts                  entrada do app (favoritos.html)
  src/app/ponte.ts                 aceitar a porta da própria aba
  src/app/altura.ts                altura do iframe
  src/app/app.ts                   AppFavoritos (estado + orquestração)
  src/app/aviso.ts                 avisos (toast)
  src/app/csv.ts                   gerarCsv, linhasCsv
  src/app/prazoForm.ts             valores do formulário <-> Prazo
  src/app/componentes/item.ts      renderItem
  src/app/componentes/lista.ts     renderLista, vizinhosAoSoltar, vizinhosAoMover
  src/app/componentes/filtros.ts   renderFiltros, renderLote
  src/app/componentes/editor.ts    montarEditor
  src/app/componentes/gerenciar.ts montarGerenciar
  src/app/componentes/lixeira.ts   montarLixeira
  src/app/componentes/migracao.ts  montarMigracao
  tests/util.ts, tests/verificar.ts, tests/verificar-*.ts

dist/ (gerado pelo build, versionado como o do agente)
  js/init_favoritos.js, js/favoritos/app.js, html/favoritos.html, css/favoritos.css

legado (edição mínima)
  dist/js/init.js                  não carrega sei-pro-favoritos.js quando o novo está ativo
  dist/js/sei-pro.js               guarda em appendStarOnProcess
  dist/manifest.json               content script + web_accessible_resources
```

---

### Tarefa 1: Worktree, dependências e documentos

**Files:**
- Create: worktree `../sei-pro-favoritos` na branch `feat/favoritos-ts`, a partir do `master`
- Create (cópia): `docs/superpowers/specs/2026-10-01-favoritos-design.md`, `docs/superpowers/plans/2026-10-01-favoritos-f0-f1.md`

**Interfaces:**
- Consumes: nada.
- Produces: o diretório de trabalho de todas as tarefas seguintes, `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-favoritos` (chamado de `$W` daqui em diante).

Contexto: outra sessão usa o clone principal, que estava na branch `feat/mcp-e-rotinas` em 01/10/2026, e duas sessões no mesmo clone se atropelam. Por isso o trabalho vai numa worktree própria. Spec e plano estão **não rastreados** no clone principal e precisam ser copiados.

- [ ] **Step 1: Criar a worktree a partir do master**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro"
git fetch --all --prune
git worktree add "../sei-pro-favoritos" -b feat/favoritos-ts master
cd "../sei-pro-favoritos" && git branch --show-current
```
Expected: `feat/favoritos-ts`

- [ ] **Step 2: Copiar spec, plano e ferramentas locais**

```bash
W="/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-favoritos"
P="/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro"
mkdir -p "$W/docs/superpowers/specs" "$W/docs/superpowers/plans"
cp "$P/docs/superpowers/specs/2026-10-01-favoritos-design.md" "$W/docs/superpowers/specs/"
cp "$P/docs/superpowers/plans/2026-10-01-favoritos-f0-f1.md" "$W/docs/superpowers/plans/"
# tools/ e gitignored: a worktree nasce sem ele
cp -R "$P/tools" "$W/tools"
```

- [ ] **Step 3: Instalar as dependências dos pacotes existentes**

```bash
cd "$W/sei-nucleo" && npm install && npm run tipos && npm run verificar
cd "$W/ferramentas-pdf" && npm install
cd "$W/agente-ia" && npm install && npm run tipos
```
Expected: `sei-nucleo` termina com `N ok, 0 falha(s)`, e `tsc` sai sem erros nos dois pacotes.

- [ ] **Step 4: Conferir que `node_modules` já é ignorado**

```bash
cd "$W" && mkdir -p sei-comum/node_modules && git check-ignore sei-comum/node_modules && rmdir sei-comum/node_modules
```
Expected: imprime `sei-comum/node_modules`. Se não imprimir, acrescente `node_modules/` ao `.gitignore` da raiz e inclua o arquivo no commit.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add docs/superpowers/specs/2026-10-01-favoritos-design.md docs/superpowers/plans/2026-10-01-favoritos-f0-f1.md
git commit -m "Favoritos: spec e plano F0+F1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 2: `sei-comum` — esqueleto, datas, feriados e texto

**Files:**
- Create: `sei-comum/package.json`, `sei-comum/tsconfig.json`, `sei-comum/biome.json`, `sei-comum/README.md`
- Create: `sei-comum/src/datas/dias.ts`, `sei-comum/src/datas/feriados.ts`, `sei-comum/src/texto.ts`
- Test: `sei-comum/tests/util.ts`, `sei-comum/tests/verificar.ts`, `sei-comum/tests/verificar-datas.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type DataISO = string`
  - `hojeISO(agora?: Date): DataISO`, `deISO(iso): Date`
  - `somarDias(iso, n): DataISO`, `diferencaDias(a, b): number` (b − a)
  - `ehDiaUtil(iso, feriados: ReadonlySet<DataISO>): boolean`
  - `somarDiasUteis(iso, n, feriados): DataISO`, `diasUteisEntre(a, b, feriados): number`
  - `formatarData(iso): string` (dd/mm/aaaa)
  - `interface Feriado { data: DataISO; nome: string }`
  - `pascoa(ano): DataISO`, `feriadosNacionais(ano): Feriado[]`, `conjuntoDeFeriados(anos: Iterable<number>, extras?: Feriado[]): Set<DataISO>`
  - `normalizarTexto(s): string`, `hashCurto(s): string` (FNV-1a, 8 hex)
  - Dos testes: `secao`, `checar`, `lanca`, `instalarDom`, `disparar`, `escolher`, `botao`, `resumo`

- [ ] **Step 1: Criar `package.json`, `tsconfig.json`, `biome.json` e `README.md`**

`sei-comum/package.json`:
```json
{
  "name": "sei-comum",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Pecas genericas do SEI Pro (UI, datas, armazenamento, sincronia, opcoes, ponte), sem conhecimento do SEI",
  "scripts": {
    "tipos": "tsc --noEmit",
    "verificar": "tsx tests/verificar.ts",
    "checar": "biome check src tests"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.2.0",
    "@types/chrome": "^0.0.300",
    "@types/node": "^22.20.4",
    "linkedom": "^0.18.13",
    "tsx": "^4.19.2",
    "typescript": "^5.9.3"
  }
}
```

`sei-comum/tsconfig.json`:
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
    "types": ["chrome", "node"]
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

`sei-comum/biome.json` (o mesmo arquivo vale para `favoritos/`):
```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "formatter": { "indentStyle": "space", "indentWidth": 2, "lineWidth": 140 },
  "javascript": { "formatter": { "quoteStyle": "double", "trailingCommas": "all" } },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true, "style": { "noNonNullAssertion": "off" } }
  }
}
```

`sei-comum/README.md`:
```markdown
# sei-comum

Peças genéricas do SEI Pro que não sabem nada do SEI: datas e feriados, construção
de DOM sem `innerHTML`, armazenamento uma-chave-por-entidade, mesclagem por
entidade (vence o mais recente), índice fracionário para ordem manual, leitura das
opções antigas (`dataValues`) e RPC sobre portas.

O que fala com o SEI fica no `sei-nucleo`. Os pacotes de funcionalidade
(`favoritos/`, `agente-ia/`) importam daqui pelo alias `@comum/*`.

    npm install && npm run tipos && npm run verificar && npm run checar
```

Depois: `cd "$W/sei-comum" && npm install`.

- [ ] **Step 2: Escrever os utilitários de teste**

`sei-comum/tests/util.ts`:
```ts
/**
 * Utilitários dos testes, na mesma forma dos `verificar-*.ts` do agente e do
 * núcleo: sem framework, um `checar()` por expectativa e saída 1 se algo falhar.
 */

import { DOMParser } from "linkedom";

let passou = 0;
let falhou = 0;

export function secao(nome: string): void {
  console.log(`\n== ${nome} ==`);
}

export function checar(nome: string, condicao: boolean, detalhe?: unknown): void {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
    return;
  }
  falhou += 1;
  const extra = detalhe === undefined ? "" : ` -- ${typeof detalhe === "string" ? detalhe : JSON.stringify(detalhe)}`;
  console.log(`  FALHA ${nome}${extra}`);
}

export async function lanca(fn: () => unknown | Promise<unknown>): Promise<{ codigo?: string; message?: string } | null> {
  try {
    await fn();
    return null;
  } catch (e) {
    return e as { codigo?: string; message?: string };
  }
}

/** `h()` e `icone()` usam o `document` global; nos testes ele vem do linkedom. */
export function instalarDom(html = "<html><body></body></html>"): Document {
  const doc = new DOMParser().parseFromString(html, "text/html") as unknown as Document;
  (globalThis as { document?: Document }).document = doc;
  return doc;
}

/** Evento do próprio linkedom (o `Event` do Node não serve aos elementos dele). */
export function disparar(el: Element, tipo: string): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  el.dispatchEvent(new Ev(tipo, { bubbles: true }));
}

/** `select.value` é só leitura no linkedom: marcar a opção é o equivalente à escolha do usuário. */
export function escolher(sel: HTMLSelectElement, valor: string): void {
  for (const o of sel.querySelectorAll("option")) {
    if (o.getAttribute("value") === valor) o.setAttribute("selected", "");
    else o.removeAttribute("selected");
  }
  disparar(sel, "change");
}

export function botao(raiz: ParentNode, texto: string): HTMLButtonElement | undefined {
  return [...raiz.querySelectorAll("button")].find((b) => (b.textContent ?? "").trim() === texto || b.getAttribute("aria-label") === texto) as
    | HTMLButtonElement
    | undefined;
}

export function resumo(): void {
  console.log(`\n${passou} ok, ${falhou} falha(s)\n`);
  if (falhou > 0) process.exit(1);
}
```

`sei-comum/tests/verificar.ts`. As tarefas seguintes acrescentam uma linha **antes** de `resumo()`:
```ts
import { verificarDatas } from "./verificar-datas";
import { resumo } from "./util";

verificarDatas();
resumo();
```

- [ ] **Step 3: Escrever o teste das datas (falhando)**

`sei-comum/tests/verificar-datas.ts`:
```ts
import { conjuntoDeFeriados, feriadosNacionais, pascoa } from "../src/datas/feriados";
import { deISO, diasUteisEntre, diferencaDias, ehDiaUtil, formatarData, hojeISO, somarDias, somarDiasUteis } from "../src/datas/dias";
import { hashCurto, normalizarTexto } from "../src/texto";
import { checar, secao } from "./util";

export function verificarDatas(): void {
  secao("datas: fuso local");
  // 22h30 em Brasília já é dia 02 em UTC: toISOString() erraria o "hoje".
  checar("hoje as 22h30 continua sendo o dia local", hojeISO(new Date(2026, 9, 1, 22, 30)) === "2026-10-01", hojeISO(new Date(2026, 9, 1, 22, 30)));
  checar("hoje logo depois da meia-noite", hojeISO(new Date(2026, 0, 5, 0, 5)) === "2026-01-05");
  checar("deISO cai ao meio-dia local", deISO("2026-10-01").getHours() === 12);
  checar("formatar", formatarData("2026-10-01") === "01/10/2026");

  secao("datas: aritmetica");
  checar("virada de mes", somarDias("2026-02-28", 1) === "2026-03-01");
  checar("virada de ano para tras", somarDias("2026-01-01", -1) === "2025-12-31");
  checar("diferenca", diferencaDias("2026-10-01", "2026-10-11") === 10);
  checar("diferenca negativa", diferencaDias("2026-10-11", "2026-10-01") === -10);

  secao("feriados");
  checar("pascoa 2026", pascoa(2026) === "2026-04-05", pascoa(2026));
  checar("pascoa 2027", pascoa(2027) === "2027-03-28", pascoa(2027));
  const f26 = feriadosNacionais(2026).map((f) => f.data);
  for (const d of ["2026-02-16", "2026-02-17", "2026-04-03", "2026-06-04", "2026-10-12", "2026-11-20"]) {
    checar(`2026 tem ${d}`, f26.includes(d));
  }
  const f27 = feriadosNacionais(2027).map((f) => f.data);
  checar("carnaval e corpus christi 2027", f27.includes("2027-02-08") && f27.includes("2027-02-09") && f27.includes("2027-05-27"));
  const feriados = conjuntoDeFeriados([2026, 2027]);
  checar("conjunto inclui 20/11", feriados.has("2026-11-20"));

  secao("dias uteis");
  checar("sabado nao e util", !ehDiaUtil("2026-10-03", feriados));
  checar("12/10 nao e util", !ehDiaUtil("2026-10-12", feriados));
  checar("quinta e util", ehDiaUtil("2026-10-01", feriados));
  checar("sexta antes do carnaval + 1 util = quarta de cinzas", somarDiasUteis("2026-02-13", 1, feriados) === "2026-02-18", somarDiasUteis("2026-02-13", 1, feriados));
  checar("sexta 09/10 + 1 util pula o feriado de segunda", somarDiasUteis("2026-10-09", 1, feriados) === "2026-10-13");
  checar("virada de ano com feriado", somarDiasUteis("2026-12-30", 3, feriados) === "2027-01-05", somarDiasUteis("2026-12-30", 3, feriados));
  checar("zero dias uteis devolve a data", somarDiasUteis("2026-10-01", 0, feriados) === "2026-10-01");
  checar("menos 1 util na segunda volta para sexta", somarDiasUteis("2026-10-05", -1, feriados) === "2026-10-02");
  checar("uteis entre (exclusivo, inclusivo)", diasUteisEntre("2026-02-13", "2026-02-18", feriados) === 1);
  checar("uteis entre ao contrario e negativo", diasUteisEntre("2026-02-18", "2026-02-13", feriados) === -1);
  checar("uteis de 01/10 a 13/10", diasUteisEntre("2026-10-01", "2026-10-13", feriados) === 7, diasUteisEntre("2026-10-01", "2026-10-13", feriados));

  secao("texto");
  checar("normaliza acento, caixa e espacos", normalizarTexto("  Fiscalização   Ágil ") === "fiscalizacao agil", normalizarTexto("  Fiscalização   Ágil "));
  checar("hash FNV-1a conhecido", hashCurto("a") === "e40c292c", hashCurto("a"));
  checar("hash distingue", hashCurto("a") !== hashCurto("b"));
}
```

- [ ] **Step 4: Rodar e ver falhar**

Run: `cd "$W/sei-comum" && npm run verificar`
Expected: FAIL, com erro de módulo não encontrado (`../src/datas/feriados`).

- [ ] **Step 5: Implementar**

`sei-comum/src/datas/dias.ts`:
```ts
/**
 * Datas civis ("AAAA-MM-DD") no fuso LOCAL do navegador.
 *
 * Prazo de servidor público é contado em dias do calendário de Brasília, não em
 * instantes UTC. `toISOString()` devolve o dia seguinte a partir das 21h, e o
 * prazo "vence hoje" viraria "vencido" à noite. Por isso tudo aqui passa por
 * `getFullYear/getMonth/getDate`, e as contas usam o meio-dia, que não sofre
 * com horário de verão.
 */

export type DataISO = string;

const dois = (n: number) => String(n).padStart(2, "0");

export function hojeISO(agora: Date = new Date()): DataISO {
  return `${agora.getFullYear()}-${dois(agora.getMonth() + 1)}-${dois(agora.getDate())}`;
}

export function deISO(iso: DataISO): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Data inválida: ${iso}`);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
}

export function somarDias(iso: DataISO, n: number): DataISO {
  const d = deISO(iso);
  d.setDate(d.getDate() + n);
  return hojeISO(d);
}

/** b − a, em dias corridos. */
export function diferencaDias(a: DataISO, b: DataISO): number {
  return Math.round((deISO(b).getTime() - deISO(a).getTime()) / 86_400_000);
}

export function ehDiaUtil(iso: DataISO, feriados: ReadonlySet<DataISO>): boolean {
  const dia = deISO(iso).getDay();
  return dia !== 0 && dia !== 6 && !feriados.has(iso);
}

/** Soma n dias úteis (n negativo volta). A própria data não conta. */
export function somarDiasUteis(iso: DataISO, n: number, feriados: ReadonlySet<DataISO>): DataISO {
  const passo = n < 0 ? -1 : 1;
  let atual = iso;
  let faltam = Math.abs(n);
  while (faltam > 0) {
    atual = somarDias(atual, passo);
    if (ehDiaUtil(atual, feriados)) faltam -= 1;
  }
  return atual;
}

/** Dias úteis depois de `a` até `b` (inclusive); negativo quando b < a. */
export function diasUteisEntre(a: DataISO, b: DataISO, feriados: ReadonlySet<DataISO>): number {
  if (a === b) return 0;
  const sinal = b > a ? 1 : -1;
  let atual = a;
  let conta = 0;
  while (atual !== b) {
    atual = somarDias(atual, sinal);
    if (ehDiaUtil(sinal > 0 ? atual : somarDias(atual, 1), feriados)) conta += 1;
  }
  return conta * sinal;
}

export function formatarData(iso: DataISO): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
```

Atenção: quando `b < a`, conta-se cada dia útil do intervalo (b, a] andando para trás. Por isso, ao recuar, o dia testado é o que acabou de ficar para trás (`somarDias(atual, 1)`). O caso `diasUteisEntre("2026-02-18", "2026-02-13")` tem de dar −1 (só a quarta, 18).

`sei-comum/src/datas/feriados.ts`:
```ts
/**
 * Feriados nacionais, os mesmos de `getHolidaysBr` do legado
 * (sei-functions-pro.js): os prazos migrados não mudam de data. Carnaval e
 * Corpus Christi são ponto facultativo federal, mas o legado sempre os contou
 * como feriado, e quem tinha prazo em dias úteis se acostumou a isso.
 */

import { type DataISO, somarDias } from "./dias";

export interface Feriado {
  data: DataISO;
  nome: string;
}

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
export function pascoa(ano: number): DataISO {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function feriadosNacionais(ano: number): Feriado[] {
  const p = pascoa(ano);
  const fixo = (mmdd: string, nome: string): Feriado => ({ data: `${ano}-${mmdd}`, nome });
  return [
    fixo("01-01", "Confraternização Universal"),
    { data: somarDias(p, -48), nome: "Carnaval" },
    { data: somarDias(p, -47), nome: "Carnaval" },
    { data: somarDias(p, -2), nome: "Paixão de Cristo" },
    { data: p, nome: "Páscoa" },
    fixo("04-21", "Tiradentes"),
    fixo("05-01", "Dia do Trabalho"),
    { data: somarDias(p, 60), nome: "Corpus Christi" },
    fixo("09-07", "Independência do Brasil"),
    fixo("10-12", "Nossa Senhora Aparecida"),
    fixo("11-02", "Finados"),
    fixo("11-15", "Proclamação da República"),
    fixo("11-20", "Dia Nacional de Zumbi e da Consciência Negra"),
    fixo("12-25", "Natal"),
  ].sort((x, y) => (x.data < y.data ? -1 : 1));
}

export function conjuntoDeFeriados(anos: Iterable<number>, extras: Feriado[] = []): Set<DataISO> {
  const s = new Set<DataISO>();
  for (const ano of anos) for (const f of feriadosNacionais(ano)) s.add(f.data);
  for (const f of extras) s.add(f.data);
  return s;
}
```

`sei-comum/src/texto.ts`:
```ts
/** Sem acento, sem caixa, espaços únicos: para busca e para comparar nomes. */
export function normalizarTexto(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * FNV-1a de 32 bits em hexadecimal. Serve para ids estáveis derivados de nome
 * (a migração gera a mesma pasta em qualquer máquina), não para segurança.
 */
export function hashCurto(texto: string): string {
  let h = 0x811c9dc5;
  for (const ch of texto) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `cd "$W/sei-comum" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: `... ok, 0 falha(s)`; `tsc` e Biome sem erros.

Se o caso "uteis entre ao contrario" falhar, a culpa é do dia testado ao recuar. Corrija só esse detalhe do `diasUteisEntre`; o teste reflete a regra (b, a].

- [ ] **Step 7: Commit**

```bash
cd "$W"
git add sei-comum/package.json sei-comum/package-lock.json sei-comum/tsconfig.json sei-comum/biome.json sei-comum/README.md sei-comum/src sei-comum/tests
git commit -m "sei-comum: datas no fuso local, feriados nacionais e normalizacao de texto

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 3: `sei-comum/ui` — `h()`, `icone()` e CSS base

**Files:**
- Create: `sei-comum/src/ui/dom.ts`, `sei-comum/src/ui/base.css`
- Test: `sei-comum/tests/verificar-ui.ts`; modify `sei-comum/tests/verificar.ts`

**Interfaces:**
- Consumes: `instalarDom` (Tarefa 2).
- Produces:
  - `type Filho = Node | string | null | undefined | false`
  - `h<K>(tag: K, attrs?: Record<string, string | boolean | ((ev: Event) => void) | undefined>, ...filhos: Filho[]): HTMLElementTagNameMap[K]`
  - `type NomeIcone`
  - `icone(nome: NomeIcone, tamanho?: number): SVGSVGElement`

O `h()` é uma cópia de `agente-ia/src/painel/dom.ts`, com a mesma correção do `<textarea>`. O agente continua com o dele; trocar o import do agente é tarefa separada (spec, seção 10).

- [ ] **Step 1: Escrever o teste (falhando)**

`sei-comum/tests/verificar-ui.ts`:
```ts
import { h, icone, NOMES_ICONES } from "../src/ui/dom";
import { checar, disparar, instalarDom, secao } from "./util";

export function verificarUi(): void {
  instalarDom();
  secao("ui: h");
  checar("textarea mostra o valor", h("textarea", { value: "Nota\nlonga" }).value === "Nota\nlonga");
  checar("classe", h("div", { class: "a b" }).className === "a b");
  checar("booleano verdadeiro vira atributo vazio", h("button", { disabled: true }).getAttribute("disabled") === "");
  checar("booleano falso nao entra", !h("button", { disabled: false }).hasAttribute("disabled"));
  checar("undefined nao entra", !h("div", { title: undefined }).hasAttribute("title"));
  checar("texto vira no de texto, nunca HTML", h("p", {}, "<b>x</b>").textContent === "<b>x</b>" && h("p", {}, "<b>x</b>").children.length === 0);
  let cliques = 0;
  const b = h("button", { onclick: () => (cliques += 1) }, "ok");
  b.click();
  checar("on* vira ouvinte, nao atributo", cliques === 1 && !b.hasAttribute("onclick"));
  const sel = h("select", { onchange: () => (cliques += 10) }, h("option", { value: "1" }, "um"));
  disparar(sel, "change");
  checar("onchange funciona", cliques === 11);

  secao("ui: icone");
  const svg = icone("estrela", 20);
  checar("svg com viewBox e oculto do leitor de tela", svg.getAttribute("viewBox") === "0 0 24 24" && svg.getAttribute("aria-hidden") === "true");
  checar("tamanho", svg.getAttribute("width") === "20");
  checar("todo icone desenha algo", NOMES_ICONES.every((n) => icone(n).childNodes.length > 0), NOMES_ICONES.filter((n) => icone(n).childNodes.length === 0));
}
```

Em `sei-comum/tests/verificar.ts`, acrescente `import { verificarUi } from "./verificar-ui";` e a chamada `verificarUi();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/sei-comum" && npm run verificar`
Expected: FAIL (`../src/ui/dom` não existe).

- [ ] **Step 3: Implementar `dom.ts`**

`sei-comum/src/ui/dom.ts`:
```ts
/**
 * DOM sem framework e SEM innerHTML: texto que vem do SEI ou do usuário entra
 * sempre como nó de texto. É o contrato do DOM seguro (spec do Firefox): um
 * nome de pasta `<img onerror=...>` não tem como virar código.
 *
 * Mesmo `h()` do agente (agente-ia/src/painel/dom.ts), com a mesma correção:
 * `<textarea>` NÃO tem atributo `value` (o valor inicial é o conteúdo), e com
 * setAttribute a caixa abria vazia, como se a nota tivesse sumido.
 */

export type Filho = Node | string | null | undefined | false;
type Atributo = string | boolean | ((ev: Event) => void) | undefined;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, Atributo> = {},
  ...filhos: Filho[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (typeof v === "function") el.addEventListener(k.replace(/^on/, ""), v);
    else if (v === true) el.setAttribute(k, "");
    else if (k === "class") el.className = v;
    else if (k === "value" && tag === "textarea") (el as HTMLTextAreaElement).value = v;
    else el.setAttribute(k, v);
  }
  for (const f of filhos) if (f !== null && f !== undefined && f !== false) el.append(f);
  return el;
}

/**
 * Ícones em SVG desenhados no DOM: sem fonte de ícones (o SEI Pro dependia do
 * FontAwesome da página) e sem emoji, que muda de forma a cada sistema. O traço
 * usa `currentColor`, então acompanha a cor do botão e o modo escuro.
 */
type Forma = [string, Record<string, string>];
const preenchido = { fill: "currentColor", stroke: "none" };
const CONTORNO_ESTRELA = "M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z";

const ICONES = {
  estrela: [["path", { d: CONTORNO_ESTRELA }]],
  estrelaCheia: [["path", { d: CONTORNO_ESTRELA, fill: "currentColor" }]],
  pasta: [["path", { d: "M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" }]],
  etiqueta: [
    ["path", { d: "M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z" }],
    ["circle", { cx: "8", cy: "8", r: "1.4", ...preenchido }],
  ],
  relogio: [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "M12 7.2V12l3.2 1.9" }]],
  nota: [["path", { d: "M6 3.5h9l3.5 3.5v13.5H6z" }], ["path", { d: "M9 11h6" }], ["path", { d: "M9 15h6" }]],
  lixeira: [
    ["path", { d: "M4.5 6.5h15" }],
    ["path", { d: "M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" }],
    ["path", { d: "M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5" }],
  ],
  lapis: [["path", { d: "M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z" }], ["path", { d: "M15 6l3 3" }]],
  fechar: [["path", { d: "M18 6 6 18" }], ["path", { d: "M6 6l12 12" }]],
  mais: [["path", { d: "M12 5v14" }], ["path", { d: "M5 12h14" }]],
  busca: [["circle", { cx: "11", cy: "11", r: "6.5" }], ["path", { d: "M20.5 20.5l-4.8-4.8" }]],
  baixar: [["path", { d: "M12 3.5v11" }], ["path", { d: "M7.5 10.2 12 14.7l4.5-4.5" }], ["path", { d: "M4.5 19.5h15" }]],
  subir: [["path", { d: "M12 14.5v-11" }], ["path", { d: "M7.5 7.8 12 3.3l4.5 4.5" }], ["path", { d: "M4.5 19.5h15" }]],
  copiar: [
    ["rect", { x: "8.5", y: "8.5", width: "12", height: "12", rx: "2" }],
    ["path", { d: "M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" }],
  ],
  restaurar: [["path", { d: "M9 14 4 9l5-5" }], ["path", { d: "M4 9h9a7 7 0 0 1 7 7v4" }]],
  check: [["path", { d: "M20 6.5 9.2 17.3 4 12.1" }]],
  alerta: [
    ["path", { d: "M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z" }],
    ["path", { d: "M12 9.5v4" }],
    ["circle", { cx: "12", cy: "16.8", r: "1", ...preenchido }],
  ],
  menu: [
    ["circle", { cx: "5", cy: "12", r: "1.4", ...preenchido }],
    ["circle", { cx: "12", cy: "12", r: "1.4", ...preenchido }],
    ["circle", { cx: "19", cy: "12", r: "1.4", ...preenchido }],
  ],
  alca: [
    ["circle", { cx: "9", cy: "6", r: "1.3", ...preenchido }],
    ["circle", { cx: "15", cy: "6", r: "1.3", ...preenchido }],
    ["circle", { cx: "9", cy: "12", r: "1.3", ...preenchido }],
    ["circle", { cx: "15", cy: "12", r: "1.3", ...preenchido }],
    ["circle", { cx: "9", cy: "18", r: "1.3", ...preenchido }],
    ["circle", { cx: "15", cy: "18", r: "1.3", ...preenchido }],
  ],
  ajustes: [
    ["path", { d: "M4 7h5" }],
    ["path", { d: "M13 7h7" }],
    ["circle", { cx: "11", cy: "7", r: "2.1" }],
    ["path", { d: "M4 17h9" }],
    ["path", { d: "M17 17h3" }],
    ["circle", { cx: "15", cy: "17", r: "2.1" }],
  ],
  setaCima: [["path", { d: "M12 19V6" }], ["path", { d: "M6 12l6-6 6 6" }]],
  setaBaixo: [["path", { d: "M12 5v13" }], ["path", { d: "M18 12l-6 6-6-6" }]],
  recolher: [["path", { d: "M6 15l6-6 6 6" }]],
  expandir: [["path", { d: "M6 9l6 6 6-6" }]],
} satisfies Record<string, Forma[]>;

export type NomeIcone = keyof typeof ICONES;
export const NOMES_ICONES = Object.keys(ICONES) as NomeIcone[];

export function icone(nome: NomeIcone, tamanho = 18): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  const base: Record<string, string> = {
    viewBox: "0 0 24 24",
    width: String(tamanho),
    height: String(tamanho),
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false",
    class: "spro-icone",
  };
  for (const [k, v] of Object.entries(base)) svg.setAttribute(k, v);
  for (const [tag, attrs] of ICONES[nome] as Forma[]) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    svg.append(el);
  }
  return svg;
}
```

- [ ] **Step 4: Criar `base.css`**

`sei-comum/src/ui/base.css`:
```css
/*
 * Base visual dos módulos novos do SEI Pro. Tokens no :root, com o modo escuro
 * em duas formas: forçado por data-tema (o painel embutido segue a página do
 * SEI, que só é escura se o usuário ligou o modo noturno do SEI Pro) ou pelo
 * sistema, quando ninguém forçou nada. `:host` faz os mesmos tokens valerem
 * dentro de Shadow DOM (o balão que o content script abre na página do SEI).
 */
:root, :host {
  --spro-fundo: #ffffff;
  --spro-fundo-2: #f4f6f8;
  --spro-texto: #1f2328;
  --spro-suave: #5c6670;
  --spro-borda: #d5dbe1;
  --spro-destaque: #155e9e;
  --spro-destaque-texto: #ffffff;
  --spro-perigo: #b42318;
  --spro-aviso: #9a6700;
  --spro-ok: #1a7f37;
  --spro-estrela: #e0a100;
  --spro-raio: 6px;
  --spro-fonte: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color-scheme: light;
}
:root[data-tema="escuro"], :host([data-tema="escuro"]) {
  --spro-fundo: #1d2125;
  --spro-fundo-2: #262b30;
  --spro-texto: #e6e9ec;
  --spro-suave: #a3adb7;
  --spro-borda: #3a4148;
  --spro-destaque: #6cb2f0;
  --spro-destaque-texto: #0b1a27;
  --spro-perigo: #ff8a80;
  --spro-aviso: #f0c35c;
  --spro-ok: #6fd28a;
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-tema]), :host(:not([data-tema])) {
    --spro-fundo: #1d2125;
    --spro-fundo-2: #262b30;
    --spro-texto: #e6e9ec;
    --spro-suave: #a3adb7;
    --spro-borda: #3a4148;
    --spro-destaque: #6cb2f0;
    --spro-destaque-texto: #0b1a27;
    --spro-perigo: #ff8a80;
    --spro-aviso: #f0c35c;
    --spro-ok: #6fd28a;
    color-scheme: dark;
  }
}
/* [hidden] perde para display de classe; o agente aprendeu isso do jeito difícil. */
/* biome-ignore lint/complexity/noImportantStyles: [hidden] precisa vencer o display das classes */
[hidden] { display: none !important; }
.spro-icone { flex: none; vertical-align: middle; }
.spro-botao {
  display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; font: inherit; font-size: 13px;
  color: var(--spro-texto); background: var(--spro-fundo-2); border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio); cursor: pointer;
}
.spro-botao:hover { border-color: var(--spro-destaque); }
.spro-botao.primario { background: var(--spro-destaque); color: var(--spro-destaque-texto); border-color: var(--spro-destaque); }
.spro-botao.perigo { color: var(--spro-perigo); }
.spro-botao-icone {
  display: inline-flex; align-items: center; justify-content: center; padding: 4px; color: var(--spro-suave);
  background: none; border: 0; border-radius: var(--spro-raio); cursor: pointer;
}
.spro-botao-icone:hover { color: var(--spro-texto); background: var(--spro-fundo-2); }
.spro-campo {
  font: inherit; font-size: 13px; color: var(--spro-texto); background: var(--spro-fundo); padding: 4px 8px;
  border: 1px solid var(--spro-borda); border-radius: var(--spro-raio); min-width: 0;
}
.spro-campo:focus, .spro-botao:focus-visible, .spro-botao-icone:focus-visible { outline: 2px solid var(--spro-destaque); outline-offset: 1px; }
.spro-chip {
  display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; font-size: 12px; border-radius: 999px;
  background: var(--cor, var(--spro-fundo-2)); color: #1f2328; border: 1px solid rgb(0 0 0 / 8%); cursor: pointer;
}
.spro-chip[aria-pressed="false"] { background: transparent; color: var(--spro-suave); border-style: dashed; }
dialog.spro-dialogo {
  color: var(--spro-texto); background: var(--spro-fundo); border: 1px solid var(--spro-borda); border-radius: 10px;
  padding: 0; width: min(560px, calc(100vw - 24px)); max-height: calc(100vh - 24px); font-family: var(--spro-fonte);
}
dialog.spro-dialogo::backdrop { background: rgb(0 0 0 / 35%); }
dialog.spro-dialogo > header {
  display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--spro-borda);
}
dialog.spro-dialogo > header h2 { margin: 0; font-size: 15px; }
.spro-dialogo-corpo { padding: 12px 14px; display: grid; gap: 10px; }
.spro-dialogo-rodape { display: flex; justify-content: flex-end; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--spro-borda); }
.spro-aviso {
  position: fixed; left: 50%; bottom: 12px; transform: translateX(-50%); z-index: 10; display: flex; gap: 10px; align-items: center;
  padding: 8px 12px; color: var(--spro-fundo); background: var(--spro-texto); border-radius: var(--spro-raio); font-size: 13px;
}
.spro-aviso button { color: inherit; background: none; border: 0; text-decoration: underline; cursor: pointer; font: inherit; }
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd "$W/sei-comum" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 6: Commit**

```bash
cd "$W"
git add sei-comum/src/ui sei-comum/tests/verificar-ui.ts sei-comum/tests/verificar.ts
git commit -m "sei-comum: h(), icones SVG e CSS base com tema escuro

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 4: `sei-comum/armazenamento` — área, coleção e dispositivo

**Files:**
- Create: `sei-comum/src/armazenamento/area.ts`, `sei-comum/src/armazenamento/colecao.ts`, `sei-comum/src/armazenamento/dispositivo.ts`
- Test: `sei-comum/tests/verificar-armazenamento.ts`; modify `sei-comum/tests/verificar.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type Mudancas = Record<string, { novo?: unknown; antigo?: unknown }>`
  - `interface Area { obter(chaves?: string | string[] | null): Promise<Record<string, unknown>>; gravar(itens: Record<string, unknown>): Promise<void>; remover(chaves: string | string[]): Promise<void>; aoMudar(cb: (m: Mudancas) => void): () => void }`
  - `areaChrome(area: chrome.storage.StorageArea, nome: "local" | "sync" | "session"): Area`
  - `areaMemoria(inicial?: Record<string, unknown>): Area`
  - `class Colecao<T> { constructor(area: Area, prefixo: string); chave(id): string; listar(): Promise<T[]>; obter(id): Promise<T | undefined>; gravar(id, v: T): Promise<void>; gravarVarios(itens: Array<[string, T]>): Promise<void>; apagar(ids: string[]): Promise<void>; aoMudar(cb: () => void): () => void }`
  - `idDispositivo(area: Area, chave?: string): Promise<string>`, com chave padrão `seipro/dispositivo`

- [ ] **Step 1: Escrever o teste (falhando)**

`sei-comum/tests/verificar-armazenamento.ts`:
```ts
import { areaMemoria } from "../src/armazenamento/area";
import { Colecao } from "../src/armazenamento/colecao";
import { idDispositivo } from "../src/armazenamento/dispositivo";
import { checar, secao } from "./util";

export async function verificarArmazenamento(): Promise<void> {
  secao("armazenamento: area em memoria");
  const area = areaMemoria({ outro: 1 });
  const vistos: string[][] = [];
  const parar = area.aoMudar((m) => vistos.push(Object.keys(m)));
  await area.gravar({ a: { x: 1 }, b: 2 });
  checar("obter uma chave", (await area.obter("a")).a !== undefined);
  checar("obter tudo", Object.keys(await area.obter(null)).sort().join() === "a,b,outro");
  const lido = (await area.obter("a")).a as { x: number };
  lido.x = 99;
  checar("devolve copia, nao a referencia guardada", ((await area.obter("a")).a as { x: number }).x === 1);
  await area.remover("b");
  checar("remover", !("b" in (await area.obter(null))));
  checar("aviso com as chaves mudadas", JSON.stringify(vistos) === JSON.stringify([["a", "b"], ["b"]]), vistos);
  parar();
  await area.gravar({ c: 1 });
  checar("parar de ouvir", vistos.length === 2);

  secao("armazenamento: colecao por prefixo");
  const col = new Colecao<{ id: string; n: number }>(area, "fav/u1/f/");
  const outra = new Colecao<{ id: string; n: number }>(area, "fav/u1/p/");
  let avisos = 0;
  col.aoMudar(() => (avisos += 1));
  await col.gravar("10", { id: "10", n: 1 });
  await col.gravarVarios([
    ["11", { id: "11", n: 2 }],
    ["12", { id: "12", n: 3 }],
  ]);
  await outra.gravar("p1", { id: "p1", n: 0 });
  checar("lista so o proprio prefixo", (await col.listar()).length === 3 && (await outra.listar()).length === 1);
  checar("obter por id", (await col.obter("11"))?.n === 2);
  await col.apagar(["10", "12"]);
  checar("apagar varios", (await col.listar()).map((i) => i.id).join() === "11");
  checar("aviso so do proprio prefixo", avisos === 3, avisos);
  await col.gravarVarios([]);
  checar("gravarVarios vazio nao grava", avisos === 3);

  secao("armazenamento: dispositivo");
  const id1 = await idDispositivo(area);
  const id2 = await idDispositivo(area);
  checar("id do dispositivo e estavel", id1 === id2 && id1.length >= 16, [id1, id2]);
}
```

Em `verificar.ts`: `import { verificarArmazenamento } from "./verificar-armazenamento";`, e troque o corpo por chamadas com `await`. O arquivo é ESM, então `await` no topo é permitido:
```ts
verificarDatas();
verificarUi();
await verificarArmazenamento();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/sei-comum" && npm run verificar`
Expected: FAIL (módulo `../src/armazenamento/area` ausente).

- [ ] **Step 3: Implementar**

`sei-comum/src/armazenamento/area.ts`:
```ts
/**
 * Área de chave-valor com a forma do `chrome.storage`, para os módulos não
 * dependerem do navegador nos testes. Os dados vivem no `chrome.storage.local`,
 * que sobrevive à limpeza de cache e de dados de site (só a desinstalação
 * apaga). Essa é a primeira defesa contra a perda de favoritos relatada pelos
 * usuários, que guardavam tudo no localStorage da página do SEI.
 */

export type Mudancas = Record<string, { novo?: unknown; antigo?: unknown }>;

export interface Area {
  obter(chaves?: string | string[] | null): Promise<Record<string, unknown>>;
  gravar(itens: Record<string, unknown>): Promise<void>;
  remover(chaves: string | string[]): Promise<void>;
  /** Avisa mudanças feitas por QUALQUER contexto (outra aba, o app, o content script). */
  aoMudar(cb: (m: Mudancas) => void): () => void;
}

export function areaChrome(area: chrome.storage.StorageArea, nome: "local" | "sync" | "session"): Area {
  return {
    obter: (chaves = null) => area.get(chaves) as Promise<Record<string, unknown>>,
    gravar: (itens) => area.set(itens),
    remover: (chaves) => area.remove(chaves),
    aoMudar(cb) {
      const ouvinte = (m: Record<string, chrome.storage.StorageChange>, n: string) => {
        if (n === nome) cb(m as Mudancas);
      };
      chrome.storage.onChanged.addListener(ouvinte);
      return () => chrome.storage.onChanged.removeListener(ouvinte);
    },
  };
}

export function areaMemoria(inicial: Record<string, unknown> = {}): Area {
  const dados = new Map<string, unknown>(Object.entries(structuredClone(inicial)));
  const ouvintes = new Set<(m: Mudancas) => void>();
  const avisar = (m: Mudancas) => {
    if (Object.keys(m).length) for (const o of [...ouvintes]) o(m);
  };
  return {
    async obter(chaves = null) {
      const lista = chaves === null ? [...dados.keys()] : typeof chaves === "string" ? [chaves] : chaves;
      const saida: Record<string, unknown> = {};
      for (const k of lista) if (dados.has(k)) saida[k] = structuredClone(dados.get(k));
      return saida;
    },
    async gravar(itens) {
      const m: Mudancas = {};
      for (const [k, v] of Object.entries(itens)) {
        m[k] = { antigo: dados.get(k), novo: structuredClone(v) };
        dados.set(k, structuredClone(v));
      }
      avisar(m);
    },
    async remover(chaves) {
      const m: Mudancas = {};
      for (const k of typeof chaves === "string" ? [chaves] : chaves) {
        if (!dados.has(k)) continue;
        m[k] = { antigo: dados.get(k) };
        dados.delete(k);
      }
      avisar(m);
    },
    aoMudar(cb) {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
  };
}
```

`sei-comum/src/armazenamento/colecao.ts`:
```ts
/**
 * Entidades guardadas UMA POR CHAVE (`<prefixo><id>`). Gravar um favorito não
 * reescreve a lista inteira: o content script (estrela) e o app (edição), ou
 * duas abas, mexendo em itens diferentes ao mesmo tempo não se atropelam. No
 * legado era tudo um objeto só, e quem gravava por último apagava o resto.
 */

import type { Area } from "./area";

export class Colecao<T> {
  constructor(
    private readonly area: Area,
    readonly prefixo: string,
  ) {}

  chave(id: string): string {
    return this.prefixo + id;
  }

  async listar(): Promise<T[]> {
    const tudo = await this.area.obter(null);
    return Object.entries(tudo)
      .filter(([k]) => k.startsWith(this.prefixo))
      .map(([, v]) => v as T);
  }

  async obter(id: string): Promise<T | undefined> {
    const k = this.chave(id);
    return (await this.area.obter(k))[k] as T | undefined;
  }

  async gravar(id: string, valor: T): Promise<void> {
    await this.area.gravar({ [this.chave(id)]: valor });
  }

  async gravarVarios(itens: Array<[string, T]>): Promise<void> {
    if (!itens.length) return;
    await this.area.gravar(Object.fromEntries(itens.map(([id, v]) => [this.chave(id), v])));
  }

  async apagar(ids: string[]): Promise<void> {
    if (ids.length) await this.area.remover(ids.map((id) => this.chave(id)));
  }

  aoMudar(cb: () => void): () => void {
    return this.area.aoMudar((m) => {
      if (Object.keys(m).some((k) => k.startsWith(this.prefixo))) cb();
    });
  }
}
```

`sei-comum/src/armazenamento/dispositivo.ts`:
```ts
/**
 * Id aleatório deste navegador. Serve só para desempatar duas gravações no
 * mesmo milissegundo, sempre na mesma direção nos dois lados da sincronia. Se
 * dois contextos o criarem juntos, um deles usa o id "perdedor" até recarregar,
 * sem efeito prático.
 */

import type { Area } from "./area";

export async function idDispositivo(area: Area, chave = "seipro/dispositivo"): Promise<string> {
  const atual = (await area.obter(chave))[chave];
  if (typeof atual === "string" && atual) return atual;
  const novo = crypto.randomUUID();
  await area.gravar({ [chave]: novo });
  return novo;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/sei-comum" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`. Se o `tsc` reclamar do retorno de `area.get` em `@types/chrome` 0.0.300, mantenha o `as Promise<Record<string, unknown>>` já presente.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add sei-comum/src/armazenamento sei-comum/tests/verificar-armazenamento.ts sei-comum/tests/verificar.ts
git commit -m "sei-comum: area chave-valor, colecao por prefixo e id do dispositivo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 5: `sei-comum` — mesclagem por entidade e índice fracionário

**Files:**
- Create: `sei-comum/src/sincronia/entidade.ts`, `sei-comum/src/ordem/indice.ts`
- Modify: `sei-comum/package.json` (dependência `fractional-indexing`)
- Test: `sei-comum/tests/verificar-entidade.ts`; modify `sei-comum/tests/verificar.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `interface Versionada { id: string; atualizadoEm: number; dispositivo: string; removidoEm?: number }`
  - `vence(a: Versionada, b: Versionada): boolean`
  - `mesclar<T extends Versionada>(...listas: T[][]): T[]`
  - `purgarLapides<T extends Versionada>(lista: T[], agora: number, dias?: number): T[]` (padrão: 90 dias)
  - `indiceEntre(antes?: string | null, depois?: string | null): string`
  - `indicesEntre(antes: string | null, depois: string | null, n: number): string[]`
  - Regra: índices se comparam com `<` e `>`, **nunca** com `localeCompare`.

- [ ] **Step 1: Instalar a dependência**

Run: `cd "$W/sei-comum" && npm install fractional-indexing@^3.2.0`
Expected: `package.json` ganha `"dependencies": { "fractional-indexing": "^3.2.0" }`.

- [ ] **Step 2: Escrever o teste (falhando)**

`sei-comum/tests/verificar-entidade.ts`:
```ts
import { indiceEntre, indicesEntre } from "../src/ordem/indice";
import { mesclar, purgarLapides, type Versionada, vence } from "../src/sincronia/entidade";
import { checar, secao } from "./util";

type Item = Versionada & { v?: string };
const it = (id: string, atualizadoEm: number, dispositivo = "A", extra: Partial<Item> = {}): Item => ({ id, atualizadoEm, dispositivo, ...extra });

export function verificarEntidade(): void {
  secao("mesclagem: vence o mais recente");
  checar("mais recente vence", vence(it("1", 2), it("1", 1)) && !vence(it("1", 1), it("1", 2)));
  checar("empate decidido pelo dispositivo, nos dois sentidos", vence(it("1", 5, "B"), it("1", 5, "A")) && !vence(it("1", 5, "A"), it("1", 5, "B")));

  const a = [it("1", 10, "A", { v: "a1" }), it("2", 5, "A", { v: "a2" })];
  const b = [it("1", 12, "B", { v: "b1" }), it("3", 1, "B", { v: "b3" })];
  const c = [it("2", 7, "C", { removidoEm: 7 }), it("3", 1, "A", { v: "c3" })];
  const ref = JSON.stringify(mesclar(a, b, c));
  const ordens = [
    [a, b, c],
    [c, b, a],
    [b, a, c],
    [b, c, a],
    [c, a, b],
    [a, c, b],
  ];
  checar("comutativa (qualquer ordem dos lados)", ordens.every((o) => JSON.stringify(mesclar(...o)) === ref));
  checar("idempotente", JSON.stringify(mesclar(mesclar(a, b, c), a, b)) === ref);
  const m = mesclar(a, b, c);
  checar("edicao mais nova vence", m.find((i) => i.id === "1")?.v === "b1");
  checar("lapide mais nova vence item antigo", m.find((i) => i.id === "2")?.removidoEm === 7);
  checar("empate em tudo resolve igual", m.find((i) => i.id === "3")?.v === "b3", m.find((i) => i.id === "3"));
  const revivido = mesclar([it("9", 3, "A", { removidoEm: 3 })], [it("9", 4, "A")]);
  checar("item re-adicionado depois da lapide volta", revivido[0]?.removidoEm === undefined);

  secao("lapides");
  const dia = 86_400_000;
  const agora = 100 * dia;
  const l = [it("1", 1, "A", { removidoEm: agora - 91 * dia }), it("2", 1, "A", { removidoEm: agora - 89 * dia }), it("3", 1)];
  checar("purga so lapide com mais de 90 dias", purgarLapides(l, agora).map((i) => i.id).join() === "2,3");

  secao("indice fracionario");
  const x = indiceEntre(null, null);
  const y = indiceEntre(x, null);
  const z = indiceEntre(x, y);
  checar("ordem crescente com < (nunca localeCompare)", x < z && z < y, [x, z, y]);
  let esq = x;
  const dir = y;
  let ok = true;
  for (let i = 0; i < 50; i++) {
    const n = indiceEntre(esq, dir);
    ok &&= esq < n && n < dir;
    esq = n;
  }
  checar("50 insercoes no mesmo intervalo", ok);
  const varios = indicesEntre(null, null, 5);
  checar("n indices ja ordenados", varios.length === 5 && varios.every((v, i) => i === 0 || (varios[i - 1] ?? "") < v), varios);
}
```

Em `verificar.ts`: importe e chame `verificarEntidade();` antes de `resumo()`.

- [ ] **Step 3: Rodar e ver falhar**

Run: `cd "$W/sei-comum" && npm run verificar`
Expected: FAIL (módulos ausentes).

- [ ] **Step 4: Implementar**

`sei-comum/src/sincronia/entidade.ts`:
```ts
/**
 * A regra de toda sincronia do SEI Pro: por ENTIDADE, vence a gravação mais
 * recente. O empate se decide pelo id do dispositivo e, no limite, pelo
 * conteúdo, sempre na mesma direção. Remoção é uma lápide (`removidoEm`), que
 * mescla como qualquer edição: assim a remoção feita num computador não
 * "ressuscita" quando o outro, que ainda tinha o item, sincroniza.
 *
 * Comutativa, associativa e idempotente: "puxar, mesclar, empurrar" pode se
 * repetir quantas vezes for preciso, em qualquer ordem.
 */

export interface Versionada {
  id: string;
  atualizadoEm: number;
  dispositivo: string;
  removidoEm?: number;
}

export function vence(a: Versionada, b: Versionada): boolean {
  if (a.atualizadoEm !== b.atualizadoEm) return a.atualizadoEm > b.atualizadoEm;
  if (a.dispositivo !== b.dispositivo) return a.dispositivo > b.dispositivo;
  return JSON.stringify(a) > JSON.stringify(b);
}

export function mesclar<T extends Versionada>(...listas: T[][]): T[] {
  const porId = new Map<string, T>();
  for (const lista of listas) {
    for (const item of lista) {
      const atual = porId.get(item.id);
      if (!atual || vence(item, atual)) porId.set(item.id, item);
    }
  }
  return [...porId.values()].sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
}

export function purgarLapides<T extends Versionada>(lista: T[], agora: number, dias = 90): T[] {
  const limite = agora - dias * 86_400_000;
  return lista.filter((i) => i.removidoEm === undefined || i.removidoEm >= limite);
}
```

`sei-comum/src/ordem/indice.ts`:
```ts
/**
 * Ordem manual por índice fracionário: mover um favorito grava SÓ ele, com uma
 * chave entre as dos vizinhos, e a ordem mescla como qualquer campo. O legado
 * renumerava a lista toda a cada arraste, e numa sincronia isso gera conflito
 * em todos os itens.
 *
 * Compare as chaves com `<` e `>`. `localeCompare` usa colação de idioma e
 * embaralha maiúsculas e minúsculas.
 */

import { generateKeyBetween, generateNKeysBetween } from "fractional-indexing";

export function indiceEntre(antes?: string | null, depois?: string | null): string {
  return generateKeyBetween(antes ?? null, depois ?? null);
}

export function indicesEntre(antes: string | null, depois: string | null, n: number): string[] {
  return generateNKeysBetween(antes, depois, n);
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd "$W/sei-comum" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 6: Commit**

```bash
cd "$W"
git add sei-comum/package.json sei-comum/package-lock.json sei-comum/src/sincronia sei-comum/src/ordem sei-comum/tests/verificar-entidade.ts sei-comum/tests/verificar.ts
git commit -m "sei-comum: mesclagem por entidade com lapides e indice fracionario

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 6: `sei-comum/opcoes` — opções legadas

**Files:**
- Create: `sei-comum/src/opcoes/legadas.ts`
- Test: `sei-comum/tests/verificar-opcoes.ts`; modify `sei-comum/tests/verificar.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `opcaoLegadaLigada(dataValues: unknown, nome: string): boolean`
  - `lerOpcaoLegada(nome: string, sync?: Pick<chrome.storage.StorageArea, "get">): Promise<boolean>`

Regra a reproduzir, de `checkConfigValue` em `dist/js/sei-functions-pro.js`:
1. `configBasePro` é o JSON de `dataValues` (uma lista de perfis).
2. Pega-se o primeiro `configGeral` da lista e, nele, o `value` do item com o `name` procurado.
3. O resultado é **falso só quando esse valor `== false`** (false, 0, "") **e** a lista não está vazia.
4. Ausente ou `null` conta como ligado.

- [ ] **Step 1: Escrever o teste (falhando)**

`sei-comum/tests/verificar-opcoes.ts`:
```ts
import { lerOpcaoLegada, opcaoLegadaLigada } from "../src/opcoes/legadas";
import { checar, secao } from "./util";

const dv = (configGeral: Array<{ name: string; value: unknown }>) => JSON.stringify([{ baseTipo: "x" }, { configGeral }]);

export async function verificarOpcoes(): Promise<void> {
  secao("opcoes legadas (mesma regra de checkConfigValue)");
  checar("desligada", !opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: false }]), "gerenciarfavoritos"));
  checar("ligada", opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: true }]), "gerenciarfavoritos"));
  checar("ausente conta como ligada", opcaoLegadaLigada(dv([{ name: "outra", value: false }]), "gerenciarfavoritos"));
  checar("valor nulo conta como ligado", opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: null }]), "gerenciarfavoritos"));
  checar("zero desliga, como no == false", !opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: 0 }]), "gerenciarfavoritos"));
  checar("sem configuracao, tudo ligado", opcaoLegadaLigada("", "gerenciarfavoritos") && opcaoLegadaLigada("[]", "gerenciarfavoritos"));
  checar("JSON quebrado nao derruba (fica ligado)", opcaoLegadaLigada("{quebrado", "gerenciarfavoritos"));
  checar("aceita a lista ja analisada", !opcaoLegadaLigada([{ configGeral: [{ name: "a", value: false }] }], "a"));
  const falso = { get: async () => ({ dataValues: dv([{ name: "a", value: false }]) }) } as unknown as Pick<chrome.storage.StorageArea, "get">;
  checar("lerOpcaoLegada le do sync", (await lerOpcaoLegada("a", falso)) === false);
}
```

Em `verificar.ts`: `await verificarOpcoes();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/sei-comum" && npm run verificar`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`sei-comum/src/opcoes/legadas.ts`:
```ts
/**
 * Opções da página de opções antiga (`chrome.storage.sync.dataValues`): uma
 * STRING JSON com a lista de perfis, e um deles traz
 * `configGeral: [{name, value}]`. O módulo novo tem de respeitar o liga/desliga
 * do usuário exatamente como `checkConfigValue` (sei-functions-pro.js): opção
 * ausente conta como LIGADA, e só `value == false` desliga.
 */

export function opcaoLegadaLigada(dataValues: unknown, nome: string): boolean {
  let perfis: unknown = dataValues;
  if (typeof dataValues === "string") {
    if (!dataValues.trim()) return true;
    try {
      perfis = JSON.parse(dataValues);
    } catch {
      return true;
    }
  }
  if (!Array.isArray(perfis) || perfis.length === 0) return true;
  const geral = perfis.map((p) => (p as { configGeral?: unknown } | null)?.configGeral).find(Array.isArray) as
    | Array<{ name?: unknown; value?: unknown }>
    | undefined;
  const valor = geral?.find((o) => o?.name === nome)?.value;
  return !(valor === false || valor === 0 || valor === "");
}

export async function lerOpcaoLegada(
  nome: string,
  sync: Pick<chrome.storage.StorageArea, "get"> = chrome.storage.sync,
): Promise<boolean> {
  const itens = (await sync.get("dataValues")) as { dataValues?: unknown };
  return opcaoLegadaLigada(itens.dataValues, nome);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/sei-comum" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add sei-comum/src/opcoes sei-comum/tests/verificar-opcoes.ts sei-comum/tests/verificar.ts
git commit -m "sei-comum: leitura das opcoes antigas com a regra do checkConfigValue

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 7: `sei-comum/ponte` — RPC sobre portas

**Files:**
- Create: `sei-comum/src/ponte/rpc.ts`, `sei-comum/src/ponte/parDePortas.ts`
- Test: `sei-comum/tests/verificar-rpc.ts`; modify `sei-comum/tests/verificar.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `interface PortaRpc { postMessage(m: unknown): void; onMessage: { addListener(cb: (m: unknown) => void): void }; onDisconnect: { addListener(cb: () => void): void }; disconnect(): void }`, que é compatível com `chrome.runtime.Port`
  - `type Tratador = (args: unknown) => unknown | Promise<unknown>`
  - `class ErroRpc extends Error { readonly codigo: string }`
  - `interface Rpc { chamar<T = unknown>(op: string, args?: unknown, prazoMs?: number): Promise<T>; aoFechar(cb: () => void): void; fechar(): void; readonly aberta: boolean }`
  - `criarRpc(porta: PortaRpc, tratadores?: Record<string, Tratador>): Rpc`
  - `parDePortas(): [PortaRpc, PortaRpc]`, que imita o `chrome.runtime.Port`: `disconnect()` avisa só o outro lado

- [ ] **Step 1: Escrever o teste (falhando)**

`sei-comum/tests/verificar-rpc.ts`:
```ts
import { parDePortas } from "../src/ponte/parDePortas";
import { criarRpc, ErroRpc } from "../src/ponte/rpc";
import { checar, lanca, secao } from "./util";

export async function verificarRpc(): Promise<void> {
  secao("rpc: pedido e resposta");
  const [pa, pb] = parDePortas();
  const lado = criarRpc(pb, {
    soma: (a) => {
      const { x, y } = a as { x: number; y: number };
      return x + y;
    },
    lenta: () => new Promise(() => undefined),
    falha: () => {
      throw Object.assign(new Error("sessao acabou"), { codigo: "SEI_SESSAO_EXPIRADA" });
    },
  });
  const cliente = criarRpc(pa);
  checar("resposta", (await cliente.chamar<number>("soma", { x: 2, y: 3 })) === 5);
  const e1 = await lanca(() => cliente.chamar("nao_existe"));
  checar("operacao desconhecida", e1?.codigo === "OP_DESCONHECIDA", e1);
  const e2 = await lanca(() => cliente.chamar("falha"));
  checar("codigo do erro atravessa a ponte", e2?.codigo === "SEI_SESSAO_EXPIRADA" && e2?.message === "sessao acabou", e2);
  const e3 = await lanca(() => cliente.chamar("lenta", undefined, 20));
  checar("prazo esgotado", e3?.codigo === "PRAZO", e3);

  secao("rpc: queda da conexao");
  let fechou = false;
  lado.aoFechar(() => (fechou = true));
  const pendente = cliente.chamar("lenta", undefined, 5_000);
  cliente.fechar();
  const e4 = await lanca(() => pendente);
  checar("fechar rejeita o que estava pendente", e4?.codigo === "DESCONECTADO", e4);
  await new Promise((r) => setTimeout(r, 0));
  checar("o outro lado e avisado", fechou && !lado.aberta);
  const e5 = await lanca(() => cliente.chamar("soma", { x: 1, y: 1 }));
  checar("chamar depois de fechado falha na hora", e5 instanceof ErroRpc && e5.codigo === "DESCONECTADO");
}
```

Em `verificar.ts`: `await verificarRpc();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/sei-comum" && npm run verificar`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`sei-comum/src/ponte/rpc.ts`:
```ts
/**
 * RPC sobre uma porta (`chrome.runtime.Port` ou o par em memória dos testes).
 * Os dois lados podem chamar e atender. Cada chamada tem prazo, e o erro
 * atravessa com o `codigo` (por exemplo os de ErroSei do núcleo), porque quem
 * chama decide pelo código, nunca pelo texto.
 */

export interface PortaRpc {
  postMessage(m: unknown): void;
  onMessage: { addListener(cb: (m: unknown) => void): void };
  onDisconnect: { addListener(cb: () => void): void };
  disconnect(): void;
}

export type Tratador = (args: unknown) => unknown | Promise<unknown>;

export class ErroRpc extends Error {
  constructor(
    readonly codigo: string,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroRpc";
  }
}

export interface Rpc {
  chamar<T = unknown>(op: string, args?: unknown, prazoMs?: number): Promise<T>;
  aoFechar(cb: () => void): void;
  fechar(): void;
  readonly aberta: boolean;
}

interface Pedido {
  rpc: "pedido";
  id: number;
  op: string;
  args: unknown;
}
interface Resposta {
  rpc: "resposta";
  id: number;
  ok: boolean;
  valor?: unknown;
  erro?: { codigo: string; mensagem: string };
}

export function criarRpc(porta: PortaRpc, tratadores: Record<string, Tratador> = {}): Rpc {
  let seq = 0;
  let aberta = true;
  const pendentes = new Map<number, { ok: (v: unknown) => void; erro: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();
  const aoFechar: Array<() => void> = [];

  const encerrar = () => {
    if (!aberta) return;
    aberta = false;
    for (const [, p] of pendentes) {
      clearTimeout(p.timer);
      p.erro(new ErroRpc("DESCONECTADO", "A conexão com a aba do SEI caiu."));
    }
    pendentes.clear();
    for (const cb of aoFechar) cb();
  };

  const responder = (r: Resposta) => {
    if (aberta) porta.postMessage(r);
  };

  porta.onMessage.addListener((m) => {
    // Forma solta: a mensagem vem de fora e é conferida campo a campo.
    // (`Partial<Pedido & Resposta>` vira `never`, porque rpc não pode ser "pedido" e "resposta".)
    const msg = m as { rpc?: unknown; id?: unknown; op?: unknown; args?: unknown; ok?: unknown; valor?: unknown; erro?: Resposta["erro"] } | null;
    if (msg?.rpc === "resposta" && typeof msg.id === "number") {
      const p = pendentes.get(msg.id);
      if (!p) return;
      pendentes.delete(msg.id);
      clearTimeout(p.timer);
      if (msg.ok) p.ok(msg.valor);
      else p.erro(new ErroRpc(msg.erro?.codigo ?? "ERRO", msg.erro?.mensagem ?? "Falha."));
      return;
    }
    if (msg?.rpc !== "pedido" || typeof msg.id !== "number" || typeof msg.op !== "string") return;
    const id = msg.id;
    const op = msg.op;
    void (async () => {
      try {
        const t = tratadores[op];
        if (!t) throw new ErroRpc("OP_DESCONHECIDA", `Operação desconhecida: ${op}`);
        responder({ rpc: "resposta", id, ok: true, valor: await t(msg.args) });
      } catch (e) {
        const codigo = (e as { codigo?: unknown }).codigo;
        responder({
          rpc: "resposta",
          id,
          ok: false,
          erro: { codigo: typeof codigo === "string" ? codigo : "ERRO", mensagem: e instanceof Error ? e.message : String(e) },
        });
      }
    })();
  });
  porta.onDisconnect.addListener(encerrar);

  return {
    get aberta() {
      return aberta;
    },
    chamar<T>(op: string, args?: unknown, prazoMs = 15_000): Promise<T> {
      if (!aberta) return Promise.reject(new ErroRpc("DESCONECTADO", "A conexão com a aba do SEI caiu."));
      const id = ++seq;
      return new Promise<T>((ok, erro) => {
        const timer = setTimeout(() => {
          pendentes.delete(id);
          erro(new ErroRpc("PRAZO", `A aba do SEI não respondeu a tempo (${op}).`));
        }, prazoMs);
        pendentes.set(id, { ok: ok as (v: unknown) => void, erro, timer });
        porta.postMessage({ rpc: "pedido", id, op, args } satisfies Pedido);
      });
    },
    aoFechar(cb) {
      aoFechar.push(cb);
    },
    fechar() {
      if (!aberta) return;
      porta.disconnect();
      encerrar();
    },
  };
}
```

`sei-comum/src/ponte/parDePortas.ts`:
```ts
/**
 * Duas portas ligadas, em memória, com a semântica do `chrome.runtime.Port`:
 * entrega assíncrona, cópia estruturada, e `disconnect()` avisa SÓ o outro
 * lado. Existe para os testes dos módulos que usam `criarRpc`.
 */

import type { PortaRpc } from "./rpc";

export function parDePortas(): [PortaRpc, PortaRpc] {
  type Lado = { msg: Set<(m: unknown) => void>; fim: Set<() => void>; aberta: boolean };
  const novo = (): Lado => ({ msg: new Set(), fim: new Set(), aberta: true });
  const a = novo();
  const b = novo();
  const porta = (eu: Lado, outro: Lado): PortaRpc => ({
    postMessage(m) {
      if (!eu.aberta || !outro.aberta) return;
      const copia = structuredClone(m);
      queueMicrotask(() => {
        if (outro.aberta) for (const o of outro.msg) o(copia);
      });
    },
    onMessage: { addListener: (cb) => void eu.msg.add(cb) },
    onDisconnect: { addListener: (cb) => void eu.fim.add(cb) },
    disconnect() {
      if (!eu.aberta) return;
      eu.aberta = false;
      if (!outro.aberta) return;
      outro.aberta = false;
      queueMicrotask(() => {
        for (const f of outro.fim) f();
      });
    },
  });
  return [porta(a, b), porta(b, a)];
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/sei-comum" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add sei-comum/src/ponte sei-comum/tests/verificar-rpc.ts sei-comum/tests/verificar.ts
git commit -m "sei-comum: RPC sobre portas com prazo, erro tipado e queda de conexao

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 8: `sei-nucleo` — id da unidade e caixa lida da tela

**Files:**
- Modify: `sei-nucleo/src/sei.ts` (`ContextoSei`, `lerContexto`, novo `lerIdUnidade`)
- Modify: `sei-nucleo/src/dominio/caixa.ts` (`lerLinhaCaixa`, `lerCaixaDaPagina`, `documentoNovo`)
- Modify: `sei-nucleo/src/index.ts` (exports)
- Test: `sei-nucleo/tests/util.ts` (`paginaSintetica`), `sei-nucleo/tests/verificar-dominio.ts`

**Interfaces:**
- Consumes: as fixtures `sei41/caixa.html`.
- Produces:
  - `ContextoSei.unidade: { id: string; sigla: string; nome: string }`
  - `lerIdUnidade(pagina: Pagina): string` (vazio quando não acha)
  - `ProcessoNaCaixa.documentoNovo: boolean`
  - `lerLinhaCaixa(tr: Element, grupo: "recebidos" | "gerados"): ProcessoNaCaixa | null`
  - `lerCaixaDaPagina(p: Pagina): ProcessoNaCaixa[]`

- [ ] **Step 1: Acrescentar `paginaSintetica` aos utilitários do núcleo**

Em `sei-nucleo/tests/util.ts`, depois de `fixture()`:
```ts
/** Tela montada à mão, para casos que nenhuma fixture cobre (SEI 3, linha com sinal raro). */
export function paginaSintetica(corpo: string, url = "https://sei.exemplo.gov.br/sei/controlador.php"): Pagina {
  const html = `<html><body>${corpo}</body></html>`;
  let doc: Document | null = null;
  return {
    url,
    status: 200,
    html,
    get doc() {
      return (doc ??= parser.parseFromString(html, "text/html") as unknown as Document);
    },
  };
}
```

- [ ] **Step 2: Escrever os testes (falhando)**

Em `sei-nucleo/tests/verificar-dominio.ts`:
- troque os imports de `../src/sei` por `import { lerContexto, lerIdUnidade, lerVersao } from "../src/sei";`;
- acrescente `import { lerCaixaDaPagina } from "../src/dominio/caixa";` e `paginaSintetica` ao import de `./util`;
- logo depois da linha `checar("unidade e usuario", ...)`, inclua:

```ts
  checar("id da unidade pelo link de troca", ctx.unidade.id === "110000001", ctx.unidade);
  const sei3 = paginaSintetica(
    '<a id="lnkUsuarioSistema" title="Fulano (fulano/ORG)"></a><select id="selInfraUnidades"><option value="7">OUTRA</option><option value="123" selected>GPF</option></select>',
    "https://sei.exemplo.gov.br/sei/controlador.php?acao=procedimento_controlar",
  );
  checar("SEI 3: id e sigla pelo seletor", lerIdUnidade(sei3) === "123" && lerContexto(sei3).unidade.sigla === "GPF", lerContexto(sei3).unidade);
  checar(
    "id pela URL quando nao ha cabecalho",
    lerIdUnidade(paginaSintetica("<p></p>", "https://x/sei/controlador.php?acao=x&infra_unidade_atual=555&infra_hash=0")) === "555",
  );
  checar("sem nada, id vazio (sem quebrar)", lerIdUnidade(paginaSintetica("<p></p>")) === "");

  secao("caixa lida da tela (sem requisicao)");
  const linhas = lerCaixaDaPagina(caixa);
  const sigilosa = linhas.find((l) => l.idProcedimento === "157584");
  checar("le as linhas da tela", linhas.length > 0 && !!sigilosa, linhas.length);
  checar("sigiloso sem especificacao", sigilosa?.sigiloso === true && sigilosa.especificacao === "", sigilosa);
  checar("sem exclamacao nao ha documento novo", sigilosa?.documentoNovo === false);
  const comNovo = paginaSintetica(
    '<table id="tblProcessosRecebidos"><caption>(1 registro)</caption><tr id="P9"><td><input type="checkbox" value="9" title="1.1/2026" aria-label="Tipo Teste / Especificação X"></td><td><a href="javascript:void(0);" aria-label="Um documento foi incluído ou assinado neste processo"><img src="svg/exclamacao.svg?5" class="imagemStatus"></a></td><td><a class="processoVisualizado" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=9">1.1/2026</a></td><td>(fulano)</td></tr></table>',
  );
  const novo = lerCaixaDaPagina(comNovo)[0];
  checar("documento novo pela exclamacao", novo?.documentoNovo === true && novo.especificacao === "X", novo);
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `cd "$W/sei-nucleo" && npm run verificar`
Expected: FAIL (`lerIdUnidade` e `lerCaixaDaPagina` não exportados).

- [ ] **Step 4: Implementar em `sei.ts`**

Em `sei-nucleo/src/sei.ts`, troque `unidade: { sigla: string; nome: string };` em `ContextoSei` por:
```ts
  /** `id` é o `infra_unidade_atual` (vazio se a tela não o mostra). */
  unidade: { id: string; sigla: string; nome: string };
```

Acrescente antes de `lerContexto`:
```ts
/**
 * id da unidade atual. SEI 4/5: o link de troca de unidade (`#lnkInfraUnidade`)
 * traz `infra_unidade_atual` no onclick. Sem cabeçalho, vale a URL da tela. No
 * SEI 3 a unidade é o `#selInfraUnidades`.
 */
export function lerIdUnidade(pagina: Pagina): string {
  const onclick = pagina.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick") ?? "";
  const doLink = /infra_unidade_atual=(\d+)/.exec(onclick)?.[1];
  if (doLink) return doLink;
  const daUrl = /[?&]infra_unidade_atual=(\d+)/.exec(pagina.url)?.[1];
  if (daUrl) return daUrl;
  return pagina.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value") ?? "";
}
```

Em `lerContexto`, troque a linha `unidade: { sigla: ..., nome: ... },` por:
```ts
    unidade: {
      id: lerIdUnidade(pagina),
      sigla: textoDe(unidade) || textoDe(d.querySelector("#selInfraUnidades option[selected]")),
      nome: unidade?.getAttribute("title") ?? "",
    },
```

- [ ] **Step 5: Implementar em `caixa.ts`**

Em `sei-nucleo/src/dominio/caixa.ts`:

1. Na interface `ProcessoNaCaixa`, acrescente:
```ts
  /** Ícone de exclamação: documento incluído ou assinado desde a última visita da unidade. */
  documentoNovo: boolean;
```

2. Troque o corpo do laço de `lerTabela` pela chamada a uma função exportada nova:
```ts
/**
 * Uma linha da caixa (`tr#P<id>`). É exportada porque o content script do
 * favoritos lê a MESMA tela que o usuário vê, sem requisição nenhuma, e põe
 * a estrela na linha.
 */
export function lerLinhaCaixa(tr: Element, grupo: "recebidos" | "gerados"): ProcessoNaCaixa | null {
  const chk = tr.querySelector("input[type=checkbox]");
  const link = tr.querySelector("a[href*='procedimento_trabalhar']");
  if (!chk || !link) return null;
  const rotulo = chk.getAttribute("aria-label") ?? "";
  const sigiloso = /^Sigiloso\b/.test(rotulo) || /Sigiloso/.test(link.getAttribute("class") ?? "");
  const tds = [...tr.querySelectorAll("td")];
  const sinais = sigiloso ? [] : [...(tds[1]?.querySelectorAll("a[aria-label]") ?? [])].map((a) => a.getAttribute("aria-label") ?? "");
  return {
    idProcedimento: chk.getAttribute("value") ?? parametros(link.getAttribute("href") ?? "").get("id_procedimento") ?? "",
    protocolo: chk.getAttribute("title") ?? textoDe(link),
    grupo,
    tipo: /Tipo (.*?)(?: \/ Especifica|$)/.exec(rotulo)?.[1]?.trim() ?? "",
    // Especificação de processo sigiloso não sai daqui (regra do agente).
    especificacao: sigiloso ? "" : (/Especifica\S* (.*)$/.exec(rotulo)?.[1]?.trim() ?? ""),
    sigiloso,
    novo: /NaoVisualizado/.test(link.getAttribute("class") ?? ""),
    atribuido: textoDe(tds[tds.length - 1]).replace(/^\(|\)$/g, ""),
    sinais,
    documentoNovo: !!tds[1]?.querySelector("img[src*='exclamacao']") || sinais.some((s) => /documento foi inclu/i.test(s)),
  };
}

function lerTabela(p: Pagina, grupo: "recebidos" | "gerados"): { itens: ProcessoNaCaixa[]; total: number } {
  const id = grupo === "recebidos" ? "#tblProcessosRecebidos" : "#tblProcessosGerados";
  const tabela = p.doc.querySelector(id);
  const total = Number(/\((\d+)\s+registro/.exec(textoDe(tabela?.querySelector("caption")))?.[1] ?? 0);
  const itens: ProcessoNaCaixa[] = [];
  for (const tr of tabela?.querySelectorAll("tr[id^='P']") ?? []) {
    const item = lerLinhaCaixa(tr, grupo);
    if (item) itens.push(item);
  }
  return { itens, total };
}

/** Processos da caixa na tela JÁ CARREGADA (só a página visível de cada grupo), sem requisição. */
export function lerCaixaDaPagina(p: Pagina): ProcessoNaCaixa[] {
  return [...lerTabela(p, "recebidos").itens, ...lerTabela(p, "gerados").itens];
}
```

3. Em `sei-nucleo/src/index.ts`:
   - troque a linha da caixa por `export { lerCaixaDaPagina, lerLinhaCaixa, listarCaixa, type ProcessoNaCaixa } from "./dominio/caixa";`;
   - acrescente `lerIdUnidade` ao export de `./sei`.

- [ ] **Step 6: Rodar e ver passar, também no agente**

```bash
cd "$W/sei-nucleo" && npm run tipos && npm run verificar
cd "$W/agente-ia" && npm run tipos && npm run verificar
```
Expected: os dois terminam com `0 falha(s)` e o `tsc` fica limpo. O agente usa `ContextoSei`. Se algum literal de teste reclamar de `id` ausente (por exemplo `verificar-editar-conteudo.ts`, que monta `{ unidade: { sigla: "GPF" } }`), acrescente `id: ""` nesse literal.

- [ ] **Step 7: Commit**

```bash
cd "$W"
git add sei-nucleo/src/sei.ts sei-nucleo/src/dominio/caixa.ts sei-nucleo/src/index.ts sei-nucleo/tests/util.ts sei-nucleo/tests/verificar-dominio.ts
git commit -m "sei-nucleo: id da unidade no contexto e caixa lida da tela com documento novo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Se o Step 6 exigiu ajuste num teste do agente, inclua esse arquivo no `git add`.

---

### Tarefa 9: `favoritos` — esqueleto, tipos, escopo e operações

**Files:**
- Create: `favoritos/package.json`, `favoritos/tsconfig.json`, `favoritos/biome.json` (cópia do de `sei-comum`), `favoritos/README.md`, `favoritos/src/tipos.d.ts`
- Create: `favoritos/src/modelo/constantes.ts`, `favoritos/src/modelo/tipos.ts`, `favoritos/src/modelo/cores.ts`, `favoritos/src/modelo/escopo.ts`, `favoritos/src/modelo/operacoes.ts`
- Test: `favoritos/tests/util.ts`, `favoritos/tests/verificar.ts`, `favoritos/tests/verificar-modelo.ts`

**Interfaces:**
- Consumes:
  - `DataISO` (Tarefa 2), `Versionada` (Tarefa 5), `normalizarTexto` e `hashCurto` (Tarefa 2);
  - dos testes: `secao`, `checar`, `lanca`, `instalarDom`, `disparar`, `escolher`, `botao`, `resumo` (Tarefa 2).
- Produces:
  - constantes `CANAL_FAVORITOS`, `CHAVE_PREFERENCIAS`, `DIAS_LIXEIRA`, `DIAS_LAPIDE`, `MAX_ETIQUETAS`, `MAX_NOTA`, `SEM_PASTA`, `chaveMigracao(host, login)`, `chaveUltimaUnidade(host, login)`;
  - os tipos de `tipos.ts`, abaixo;
  - `PALETA`, `corPadrao(nome)`, `corDoTexto(hex)`;
  - `chaveEscopo(e)`, `escoposDoContexto(ctx)`, `rotuloDaLista(e)`;
  - `novoFavorito(d, ordem, c)`, `editar(item, m, c)`, `remover(item, c)`, `restaurar(item, c)`, `porOrdem(a, b)`, `filtrar(lista, f, apoio)`, `ordenar(lista, modo, resumo)`;
  - nos testes: `telaSei(nome): { pagina, doc }` e `tique(ms?)`.

Nota sobre o `tsconfig`: aqui **não** se liga `noUncheckedIndexedAccess`. O `tsc` também confere o código-fonte do `sei-nucleo` que o favoritos importa, e o núcleo ainda não passa nessa regra. A `sei-comum` liga, e o código dela continua valendo aqui. Ligue também neste pacote quando o núcleo passar.

- [ ] **Step 1: Criar o pacote**

`favoritos/package.json`:
```json
{
  "name": "sei-pro-favoritos",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Favoritos do SEI Pro: lista pessoal de processos por unidade e lista Pessoal",
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

`favoritos/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["chrome", "node"],
    "baseUrl": ".",
    "paths": {
      "@favoritos/*": ["./src/*"],
      "@comum/*": ["../sei-comum/src/*"],
      "@nucleo/*": ["../sei-nucleo/src/*"],
      "@tarjar/*": ["../ferramentas-pdf/src/lib/*"],
      "@/*": ["../ferramentas-pdf/src/*"]
    }
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

`favoritos/src/tipos.d.ts`:
```ts
/** O build importa CSS como texto (loader "text" do esbuild) para o Shadow DOM do balão. */
declare module "*.css" {
  const texto: string;
  export default texto;
}
```

`favoritos/README.md`:
```markdown
# Favoritos do SEI Pro

Lista pessoal de processos: uma por unidade do usuário e uma lista Pessoal, que
acompanha o usuário em qualquer unidade. Os dados ficam em `chrome.storage.local`
(uma chave por favorito). Spec: `docs/superpowers/specs/2026-10-01-favoritos-design.md`.

- `src/pagina/` content script (`dist/js/init_favoritos.js`, todos os frames,
  document_start): estrelas, balão e painel embutido no Controle de Processos.
- `src/app/` página `dist/html/favoritos.html`, aberta como iframe abaixo da lista.
- `src/modelo/`, `src/repositorio.ts`, `src/migracao/` sem DOM, cobertos por `tests/`.

    npm install && npm run tipos && npm run checar && npm run build
```

Depois: `cp ../sei-comum/biome.json biome.json && npm install`.

- [ ] **Step 2: Utilitários de teste**

`favoritos/tests/util.ts`:
```ts
/**
 * Mesmos utilitários da sei-comum (o contador de falhas é um só, porque o
 * módulo é o mesmo arquivo), mais as telas reais do SEI das fixtures do núcleo.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { definirAnalisador } from "@nucleo/sessao/dom";
import type { Pagina } from "@nucleo/sessao/http";
import { DOMParser } from "linkedom";

export { botao, checar, disparar, escolher, instalarDom, lanca, resumo, secao } from "../../sei-comum/tests/util";

const parser = new DOMParser();
definirAnalisador((html) => parser.parseFromString(html, "text/html") as unknown as Document);

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "sei-nucleo", "tests", "fixtures");

/** Tela real do SEI (fixture do núcleo) como Pagina e como Document, que vira o `document` global. */
export function telaSei(nome: string): { pagina: Pagina; doc: Document } {
  const bruto = readFileSync(join(FIXTURES, nome), "utf8");
  const url = /^<!-- url: (.*?) -->/.exec(bruto)?.[1] ?? "https://sei.exemplo.gov.br/sei/controlador.php";
  const html = bruto.replace(/^<!-- url: .*? -->\n/, "");
  const doc = parser.parseFromString(html, "text/html") as unknown as Document;
  (globalThis as { document?: Document }).document = doc;
  return { pagina: { url, status: 200, html, doc }, doc };
}

/** Deixa as promessas e os setTimeout(0) correrem. */
export const tique = (ms = 5): Promise<void> => new Promise((r) => setTimeout(r, ms));
```

`favoritos/tests/verificar.ts` (cada tarefa acrescenta uma linha antes de `resumo()`):
```ts
import { verificarModelo } from "./verificar-modelo";
import { resumo } from "./util";

verificarModelo();
resumo();
```

- [ ] **Step 3: Escrever o teste (falhando)**

`favoritos/tests/verificar-modelo.ts`:
```ts
import { corDoTexto, corPadrao, PALETA } from "../src/modelo/cores";
import { chaveEscopo, escoposDoContexto } from "../src/modelo/escopo";
import { editar, filtrar, novoFavorito, ordenar, remover, restaurar } from "../src/modelo/operacoes";
import type { ContextoAba, Etiqueta, Favorito } from "../src/modelo/tipos";
import { checar, secao } from "./util";

export const CTX: ContextoAba = {
  host: "sei.antaq.gov.br",
  login: "Pedro.Soares",
  nome: "Pedro",
  unidade: { id: "110000001", sigla: "GPF", nome: "Gerência" },
  versao: "5.0.4",
  temaEscuro: false,
};

export function verificarModelo(): void {
  secao("escopo");
  const { unidade, pessoal } = escoposDoContexto(CTX);
  checar("chave da unidade (login minusculo)", unidade !== null && chaveEscopo(unidade) === "sei.antaq.gov.br|pedro.soares|u:110000001", unidade && chaveEscopo(unidade));
  checar("chave pessoal", chaveEscopo(pessoal) === "sei.antaq.gov.br|pedro.soares|pessoal");
  checar("sem unidade na tela, so a Pessoal (Review Focus 4)", escoposDoContexto({ ...CTX, unidade: null }).unidade === null);
  checar("unidade sem id tambem nao vira escopo", escoposDoContexto({ ...CTX, unidade: { id: "", sigla: "X", nome: "" } }).unidade === null);

  secao("cores");
  checar("cor padrao vem da paleta e e estavel", PALETA.includes(corPadrao("Urgente")) && corPadrao("Urgente") === corPadrao(" urgente "));
  checar("texto escuro em fundo claro, claro em fundo escuro", corDoTexto("#fff9c4") === "#1f2328" && corDoTexto("#123456") === "#ffffff");

  secao("operacoes");
  const c = { agora: 1000, dispositivo: "D1" };
  const sig = novoFavorito({ id: "9", protocolo: "1/2026", tipo: "T", especificacao: "segredo", sigiloso: true }, "a0", c);
  checar("sigiloso sem especificacao", sig.sigiloso === true && sig.especificacao === undefined && sig.tipo === "T");
  const f = novoFavorito({ id: "1", protocolo: "50300.018905/2018-67", tipo: "Fiscalização", especificacao: "Porto X" }, "a0", c);
  checar("novo favorito carimbado", f.criadoEm === 1000 && f.atualizadoEm === 1000 && f.dispositivo === "D1" && f.etiquetas.length === 0 && !("sigiloso" in f));
  const e = editar(f, { titulo: "Meu título", nota: undefined }, { agora: 2000, dispositivo: "D2" });
  checar("editar carimba e tira chaves vazias", e.titulo === "Meu título" && e.atualizadoEm === 2000 && e.dispositivo === "D2" && !("nota" in e));
  checar("editar nao muda o original", f.titulo === undefined);
  const r = remover(e, { agora: 3000, dispositivo: "D1" });
  checar("remover vira lapide", r.removidoEm === 3000 && r.atualizadoEm === 3000);
  const v = restaurar(r, { agora: 4000, dispositivo: "D1" });
  checar("restaurar tira a lapide", !("removidoEm" in v) && v.atualizadoEm === 4000);

  secao("filtro e busca");
  const et: Etiqueta = { id: "e1", nome: "Urgência", cor: "#fff", atualizadoEm: 1, dispositivo: "D" };
  const lista: Favorito[] = [
    { ...f, id: "1", titulo: "Fiscalização do porto", etiquetas: ["e1"], pasta: "p1", ordem: "a1" },
    { ...f, id: "2", protocolo: "00000.000004/2025-54", tipo: "Contrato", especificacao: "Limpeza", etiquetas: [], ordem: "a0", nota: "ligar para o fiscal" },
    { ...f, id: "3", protocolo: "1/2026", ordem: "a2", removidoEm: 5 },
  ];
  const apoio = { etiquetas: new Map([["e1", et]]), resumo: () => undefined };
  const ids = (l: Favorito[]) => l.map((x) => x.id).join();
  checar("busca ignora acento e caixa", ids(filtrar(lista, { busca: "fiscalizacao" }, apoio)) === "1");
  checar("busca pelo numero do protocolo", ids(filtrar(lista, { busca: "018905" }, apoio)) === "1");
  checar("busca pela etiqueta", ids(filtrar(lista, { busca: "urgencia" }, apoio)) === "1");
  checar("busca com dois termos na nota", ids(filtrar(lista, { busca: "FISCAL ligar" }, apoio)) === "2");
  checar("lapide nunca aparece", !filtrar(lista, {}, apoio).some((x) => x.id === "3"));
  checar("filtro por pasta", ids(filtrar(lista, { pasta: "p1" }, apoio)) === "1");
  checar("filtro sem pasta", ids(filtrar(lista, { pasta: "__sem__" }, apoio)) === "2");
  checar("filtro por etiqueta", ids(filtrar(lista, { etiqueta: "e1" }, apoio)) === "1");
  checar("filtro sem prazo", ids(filtrar(lista, { prazo: "semPrazo" }, apoio)) === "1,2");

  secao("ordenacao");
  checar("manual pela chave com <", ids(ordenar(lista, "manual", () => undefined)) === "2,1,3");
  checar("protocolo numerico", ids(ordenar(lista.slice(0, 2), "protocolo", () => undefined)) === "2,1");
  const resumo = (x: Favorito) => (x.id === "1" ? { situacao: "noPrazo" as const, texto: "", dica: "", ordem: 3 } : undefined);
  checar("por prazo, sem prazo por ultimo", ids(ordenar(lista.slice(0, 2), "prazo", resumo)) === "1,2");
  checar("inclusao mais recente primeiro", ids(ordenar([{ ...lista[0]!, criadoEm: 1 }, { ...lista[1]!, criadoEm: 2 }], "inclusao", () => undefined)) === "2,1");
}
```

- [ ] **Step 4: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (módulos de `src/modelo` ausentes).

- [ ] **Step 5: Implementar o modelo**

`favoritos/src/modelo/constantes.ts`:
```ts
/** Nome da porta entre o content script (a aba do SEI) e o app do favoritos. */
export const CANAL_FAVORITOS = "seipro-favoritos";
/** Em `chrome.storage.sync`: pequeno, acompanha a conta do navegador. */
export const CHAVE_PREFERENCIAS = "favoritos/preferencias";
export const DIAS_LIXEIRA = 30;
export const DIAS_LAPIDE = 90;
/** O mesmo teto do legado. */
export const MAX_ETIQUETAS = 8;
export const MAX_NOTA = 2000;
/** Valor do filtro "sem pasta" (nenhum id real começa com "__"). */
export const SEM_PASTA = "__sem__";
export const chaveMigracao = (host: string, login: string): string => `favoritos/migracao/${host}|${login}`;
export const chaveUltimaUnidade = (host: string, login: string): string => `favoritos/ultimaUnidade/${host}|${login}`;
```

`favoritos/src/modelo/tipos.ts`:
```ts
import type { DataISO } from "@comum/datas/dias";
import type { Versionada } from "@comum/sincronia/entidade";

export type TipoLista = "unidade" | "pessoal";

/** Quem é e onde está o usuário, lido do cabeçalho do SEI pelo content script. */
export interface ContextoAba {
  host: string;
  /** Sempre em minúsculas. */
  login: string;
  nome: string;
  /** null quando a tela não mostra a unidade: só a lista Pessoal funciona. */
  unidade: { id: string; sigla: string; nome: string } | null;
  versao: string;
  /** Modo noturno do SEI Pro (legado) ligado na página. */
  temaEscuro: boolean;
}

export interface Escopo {
  host: string;
  login: string;
  lista: TipoLista;
  unidade?: { id: string; sigla: string };
}

/** O que a tela do SEI informa sobre um processo, sem requisição. */
export interface DadosProcesso {
  id: string;
  protocolo: string;
  tipo?: string;
  especificacao?: string;
  /** true/false quando a tela informa; undefined quando não sabe (mantém o que havia). */
  sigiloso?: boolean;
}

/** Porta do `configdate` legado, com nomes legíveis (spec 6.2). */
export interface Prazo {
  referencia:
    | { de: "data"; data: DataISO }
    | { de: "documento"; idDocumento: string; data: DataISO }
    | { de: "novoDocumento"; tipos: string[]; desde: DataISO };
  /** n negativo: antes da referência. */
  vencimento?: { em: "data"; data: DataISO } | { em: "dias"; n: number; contagem: "corridos" | "uteis" };
  /** "ate": quanto falta para a data; "desde"/"desdeUteis": quanto passou desde ela. */
  exibicao: "ate" | "desde" | "desdeUteis";
}

export type SituacaoPrazo = "noPrazo" | "hoje" | "atrasado" | "semVencimento" | "aguardando";

export interface ResumoPrazo {
  situacao: SituacaoPrazo;
  vencimento?: DataISO;
  texto: string;
  dica: string;
  /** Para ordenar por prazo: dias até vencer (negativo = atrasado). */
  ordem: number;
}

export interface Favorito extends Versionada {
  /** id_procedimento. */
  id: string;
  protocolo: string;
  /** Apelido do usuário (substitui a "especificação própria" do legado). */
  titulo?: string;
  /** Cache do que a tela do SEI mostrou, para exibir e buscar. */
  tipo?: string;
  especificacao?: string;
  pasta?: string;
  etiquetas: string[];
  nota?: string;
  prazo?: Prazo;
  /** Mapa (ganha tela na F4); preservado na migração. */
  local?: { lat: number; lng: number };
  /** Índice fracionário (comparar com < e >). */
  ordem: string;
  sigiloso?: true;
  criadoEm: number;
}

export type MudancasFavorito = Partial<Omit<Favorito, "id" | "atualizadoEm" | "dispositivo" | "criadoEm">>;

export interface Pasta extends Versionada {
  nome: string;
  cor?: string;
  ordem: string;
}

export interface Etiqueta extends Versionada {
  nome: string;
  cor: string;
  /** Nome do ícone do legado (FontAwesome), guardado para a F4. */
  icone?: string;
}

export type ModoOrdem = "manual" | "prazo" | "protocolo" | "inclusao";

export interface Filtro {
  busca?: string;
  pasta?: string;
  etiqueta?: string;
  prazo?: SituacaoPrazo | "semPrazo";
}

export interface Preferencias {
  exibir: "abaixo" | "lateral" | "ambos";
  perguntarAoFavoritar: boolean;
  textoPadrao: "nao-perguntado" | "ligado" | "desligado";
  recolhido: boolean;
  agruparPorPasta: boolean;
  ordem: ModoOrdem;
  faixaUnidadeDispensada: boolean;
}

export const PREFERENCIAS_PADRAO: Preferencias = {
  exibir: "abaixo",
  perguntarAoFavoritar: true,
  textoPadrao: "nao-perguntado",
  recolhido: false,
  agruparPorPasta: false,
  ordem: "manual",
  faixaUnidadeDispensada: false,
};

export interface Carimbo {
  agora: number;
  dispositivo: string;
}
```

`favoritos/src/modelo/cores.ts`:
```ts
import { hashCurto, normalizarTexto } from "@comum/texto";

/** Tons claros: o texto da etiqueta fica escuro e legível nos dois temas. */
export const PALETA = ["#bfd5e8", "#c8e6c9", "#ffe0b2", "#f8bbd0", "#d1c4e9", "#b2ebf2", "#fff9c4", "#d7ccc8"];

export function corPadrao(nome: string): string {
  const i = Number.parseInt(hashCurto(normalizarTexto(nome)).slice(0, 6), 16) % PALETA.length;
  return PALETA[i] ?? "#bfd5e8";
}

/** Cor do texto sobre a cor da etiqueta (as do legado podem ser escuras). */
export function corDoTexto(hex: string): string {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex);
  if (!m) return "#1f2328";
  const [r, g, b] = [m[1], m[2], m[3]].map((x) => Number.parseInt(x ?? "0", 16));
  return (r! * 299 + g! * 587 + b! * 114) / 1000 > 140 ? "#1f2328" : "#ffffff";
}
```

`favoritos/src/modelo/escopo.ts`:
```ts
/**
 * Escopo = de quem e de qual lista. A chave entra no nome de cada entrada do
 * `chrome.storage` (`favoritos/<chave>/f/<id>`). O login vai em minúsculas,
 * porque é o mesmo usuário com ou sem caixa, e o SEI 4.1.5+ mexe no prefixo do
 * cookie, não no título do usuário (memória "login_sei_prefixo_cookie").
 */

import type { ContextoAba, Escopo } from "./tipos";

export function chaveEscopo(e: Escopo): string {
  const login = e.login.trim().toLowerCase();
  return `${e.host}|${login}|${e.lista === "pessoal" ? "pessoal" : `u:${e.unidade?.id ?? ""}`}`;
}

export function escoposDoContexto(ctx: ContextoAba): { unidade: Escopo | null; pessoal: Escopo } {
  const base = { host: ctx.host, login: ctx.login.trim().toLowerCase() };
  return {
    unidade: ctx.unidade?.id ? { ...base, lista: "unidade", unidade: { id: ctx.unidade.id, sigla: ctx.unidade.sigla } } : null,
    pessoal: { ...base, lista: "pessoal" },
  };
}

export function rotuloDaLista(e: Escopo): string {
  return e.lista === "pessoal" ? "Pessoal" : e.unidade?.sigla || "Unidade";
}
```

`favoritos/src/modelo/operacoes.ts`:
```ts
/**
 * Operações puras sobre favoritos: nada aqui toca o armazenamento nem o DOM.
 * Toda edição recebe o carimbo (quando, de onde), que é o que a mesclagem usa.
 */

import type { Versionada } from "@comum/sincronia/entidade";
import { normalizarTexto } from "@comum/texto";
import { SEM_PASTA } from "./constantes";
import type { Carimbo, DadosProcesso, Etiqueta, Favorito, Filtro, ModoOrdem, ResumoPrazo } from "./tipos";

/** Chaves com `undefined` saem do objeto: o storage guarda menos e o "apagar campo" fica explícito. */
function semVazios<T extends object>(o: T): T {
  for (const k of Object.keys(o)) if ((o as Record<string, unknown>)[k] === undefined) delete (o as Record<string, unknown>)[k];
  return o;
}

export function novoFavorito(d: DadosProcesso, ordem: string, c: Carimbo): Favorito {
  return semVazios({
    id: d.id,
    protocolo: d.protocolo,
    tipo: d.tipo || undefined,
    especificacao: d.sigiloso ? undefined : d.especificacao || undefined,
    sigiloso: d.sigiloso ? (true as const) : undefined,
    etiquetas: [],
    ordem,
    criadoEm: c.agora,
    atualizadoEm: c.agora,
    dispositivo: c.dispositivo,
  });
}

export function editar<T extends Versionada>(item: T, mudancas: Partial<Omit<T, "id" | "atualizadoEm" | "dispositivo">>, c: Carimbo): T {
  return semVazios({ ...item, ...mudancas, atualizadoEm: c.agora, dispositivo: c.dispositivo } as T);
}

export function remover<T extends Versionada>(item: T, c: Carimbo): T {
  return editar(item, { removidoEm: c.agora } as Partial<Omit<T, "id" | "atualizadoEm" | "dispositivo">>, c);
}

export function restaurar<T extends Versionada>(item: T, c: Carimbo): T {
  return editar(item, { removidoEm: undefined } as Partial<Omit<T, "id" | "atualizadoEm" | "dispositivo">>, c);
}

/** Ordem manual: chave fracionária com < e >, desempate pelo id. */
export function porOrdem(a: { ordem: string; id: string }, b: { ordem: string; id: string }): number {
  if (a.ordem !== b.ordem) return a.ordem < b.ordem ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

export interface ApoioFiltro {
  etiquetas: ReadonlyMap<string, Etiqueta>;
  resumo: (f: Favorito) => ResumoPrazo | undefined;
}

export function filtrar(lista: Favorito[], f: Filtro, apoio: ApoioFiltro): Favorito[] {
  const termos = normalizarTexto(f.busca ?? "")
    .split(" ")
    .filter(Boolean);
  return lista.filter((fav) => {
    if (fav.removidoEm !== undefined) return false;
    if (f.pasta === SEM_PASTA) {
      if (fav.pasta) return false;
    } else if (f.pasta && fav.pasta !== f.pasta) return false;
    if (f.etiqueta && !fav.etiquetas.includes(f.etiqueta)) return false;
    if (f.prazo) {
      const r = apoio.resumo(fav);
      if (f.prazo === "semPrazo" ? !!r : r?.situacao !== f.prazo) return false;
    }
    if (!termos.length) return true;
    const alvo = normalizarTexto(
      [fav.protocolo, fav.protocolo.replace(/\D/g, ""), fav.titulo, fav.tipo, fav.especificacao, fav.nota, ...fav.etiquetas.map((id) => apoio.etiquetas.get(id)?.nome)]
        .filter(Boolean)
        .join(" "),
    );
    return termos.every((t) => alvo.includes(t));
  });
}

export function ordenar(lista: Favorito[], modo: ModoOrdem, resumo: (f: Favorito) => ResumoPrazo | undefined): Favorito[] {
  const copia = [...lista];
  if (modo === "manual") return copia.sort(porOrdem);
  if (modo === "inclusao") return copia.sort((a, b) => b.criadoEm - a.criadoEm || porOrdem(a, b));
  if (modo === "protocolo") return copia.sort((a, b) => a.protocolo.localeCompare(b.protocolo, "pt-BR", { numeric: true }) || porOrdem(a, b));
  const chave = (f: Favorito) => resumo(f)?.ordem ?? Number.POSITIVE_INFINITY;
  return copia.sort((a, b) => {
    const d = chave(a) - chave(b);
    return Number.isNaN(d) || d === 0 ? porOrdem(a, b) : d;
  });
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 7: Commit**

```bash
cd "$W"
git add favoritos/package.json favoritos/package-lock.json favoritos/tsconfig.json favoritos/biome.json favoritos/README.md favoritos/src favoritos/tests
git commit -m "Favoritos: pacote novo com modelo, escopo por unidade e pessoal, filtro e ordem

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 10: `favoritos` — cálculo de prazo

**Files:**
- Create: `favoritos/src/modelo/prazo.ts`
- Test: `favoritos/tests/verificar-prazo.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `diasUteisEntre`, `diferencaDias`, `formatarData`, `somarDias`, `somarDiasUteis` e `conjuntoDeFeriados` (Tarefa 2); `Prazo` e `ResumoPrazo` (Tarefa 9).
- Produces:
  - `vencimentoDe(p: Prazo, feriados): DataISO | undefined`
  - `feriadosPara(p: Prazo, hoje: DataISO): Set<DataISO>`
  - `calcularPrazo(p: Prazo, hoje: DataISO, feriados?): ResumoPrazo`

Mudança de comportamento em relação ao legado, que é proposital: o legado só descontava os feriados no vencimento em dias úteis quando a exibição também era "dias úteis" (`getDateSemantic` montava `arrayFeriados` só com `workday && countdays`). Aqui os feriados **sempre** contam em dias úteis.

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-prazo.ts`:
```ts
import { calcularPrazo, feriadosPara, vencimentoDe } from "../src/modelo/prazo";
import type { Prazo } from "../src/modelo/tipos";
import { checar, secao } from "./util";

const HOJE = "2026-10-01"; // quinta-feira
const P = (x: Omit<Prazo, "exibicao"> & Partial<Pick<Prazo, "exibicao">>): Prazo => ({ exibicao: "ate", ...x });

export function verificarPrazo(): void {
  secao("prazo: com vencimento");
  const corridos = calcularPrazo(P({ referencia: { de: "data", data: "2026-09-28" }, vencimento: { em: "dias", n: 5, contagem: "corridos" } }), HOJE);
  checar("corridos: vence em 2 dias", corridos.texto === "vence em 2 dias" && corridos.situacao === "noPrazo" && corridos.vencimento === "2026-10-03", corridos);
  const uteis = calcularPrazo(P({ referencia: { de: "data", data: "2026-10-09" }, vencimento: { em: "dias", n: 1, contagem: "uteis" } }), HOJE);
  checar("uteis pula o feriado de 12/10", uteis.vencimento === "2026-10-13" && uteis.texto === "vence em 7 dias úteis", uteis);
  const atrasado = calcularPrazo(P({ referencia: { de: "data", data: "2026-09-01" }, vencimento: { em: "data", data: "2026-09-29" } }), HOJE);
  checar("atrasado", atrasado.situacao === "atrasado" && atrasado.texto === "2 dias de atraso" && atrasado.ordem < 0, atrasado);
  const hoje = calcularPrazo(P({ referencia: { de: "data", data: "2026-09-01" }, vencimento: { em: "data", data: HOJE } }), HOJE);
  checar("vence hoje", hoje.situacao === "hoje" && hoje.texto === "vence hoje" && hoje.ordem === 0, hoje);
  const antes = P({ referencia: { de: "data", data: "2026-10-20" }, vencimento: { em: "dias", n: -3, contagem: "corridos" } });
  checar("n negativo conta para tras", vencimentoDe(antes, new Set()) === "2026-10-17");

  secao("prazo: so a data (prazo simples do legado)");
  const futura = calcularPrazo(P({ referencia: { de: "data", data: "2026-10-04" } }), HOJE);
  checar("data futura", futura.texto === "em 3 dias" && futura.situacao === "noPrazo", futura);
  const passada = calcularPrazo(P({ referencia: { de: "data", data: "2026-09-30" } }), HOJE);
  checar("data passada", passada.texto === "há 1 dia" && passada.situacao === "atrasado", passada);

  secao("prazo: contagem desde");
  const desde = calcularPrazo(P({ referencia: { de: "data", data: "2026-09-21" }, exibicao: "desde" }), HOJE);
  checar("dias corridos desde", desde.texto === "10 dias desde 21/09/2026" && desde.situacao === "semVencimento", desde);
  const desdeUteis = calcularPrazo(P({ referencia: { de: "data", data: "2026-09-24" }, exibicao: "desdeUteis" }), HOJE);
  checar("dias uteis desde", desdeUteis.texto === "5 dias úteis desde 24/09/2026", desdeUteis);

  secao("prazo: casos especiais");
  const aguardando = calcularPrazo(P({ referencia: { de: "novoDocumento", tipos: ["Ofício"], desde: "2026-09-01" } }), HOJE);
  checar("aguardando novo documento", aguardando.situacao === "aguardando" && aguardando.dica.includes("Ofício"), aguardando);
  const virada = P({ referencia: { de: "data", data: "2026-12-30" }, vencimento: { em: "dias", n: 3, contagem: "uteis" } });
  checar("virada de ano usa os feriados do ano seguinte", vencimentoDe(virada, feriadosPara(virada, "2026-12-30")) === "2027-01-05");
  const ordem = [atrasado, hoje, corridos, desde].map((r) => r.ordem);
  checar("ordem: atrasado, hoje, no prazo, sem vencimento", ordem.every((o, i) => i === 0 || (ordem[i - 1] ?? 0) < o), ordem);
}
```

Em `verificar.ts`: `verificarPrazo();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (`../src/modelo/prazo` ausente).

- [ ] **Step 3: Implementar**

`favoritos/src/modelo/prazo.ts`:
```ts
/**
 * Situação de um prazo num dia (`hoje`, no fuso local). Reproduz o que o
 * legado mostrava (getDateSemantic/getDatesPreview), com nomes legíveis e
 * sem moment.js. Diferença proposital: dias úteis SEMPRE descontam feriados.
 */

import { type DataISO, diasUteisEntre, diferencaDias, formatarData, somarDias, somarDiasUteis } from "@comum/datas/dias";
import { conjuntoDeFeriados } from "@comum/datas/feriados";
import type { Prazo, ResumoPrazo } from "./tipos";

const unidade = (n: number, uteis: boolean) => {
  const um = Math.abs(n) === 1;
  if (uteis) return um ? "dia útil" : "dias úteis";
  return um ? "dia" : "dias";
};

export function vencimentoDe(p: Prazo, feriados: ReadonlySet<DataISO>): DataISO | undefined {
  if (!p.vencimento || p.referencia.de === "novoDocumento") return undefined;
  if (p.vencimento.em === "data") return p.vencimento.data;
  return p.vencimento.contagem === "uteis"
    ? somarDiasUteis(p.referencia.data, p.vencimento.n, feriados)
    : somarDias(p.referencia.data, p.vencimento.n);
}

/** Feriados de todos os anos que a conta atravessa, com um ano de folga. */
export function feriadosPara(p: Prazo, hoje: DataISO): Set<DataISO> {
  const inicio = p.referencia.de === "novoDocumento" ? p.referencia.desde : p.referencia.data;
  const anos = [inicio, hoje, p.vencimento?.em === "data" ? p.vencimento.data : hoje].map((d) => Number(d.slice(0, 4)));
  const de = Math.min(...anos);
  const ate = Math.max(...anos) + 1;
  return conjuntoDeFeriados(Array.from({ length: ate - de + 1 }, (_, i) => de + i));
}

export function calcularPrazo(p: Prazo, hoje: DataISO, feriados: ReadonlySet<DataISO> = feriadosPara(p, hoje)): ResumoPrazo {
  if (p.referencia.de === "novoDocumento") {
    return {
      situacao: "aguardando",
      texto: "aguardando documento",
      dica: `A contagem começa no próximo documento assinado: ${p.referencia.tipos.join(", ")}.`,
      ordem: Number.MAX_SAFE_INTEGER,
    };
  }
  const inicio = p.referencia.data;
  const venc = vencimentoDe(p, feriados);
  if (venc) {
    const uteis = p.vencimento?.em === "dias" && p.vencimento.contagem === "uteis";
    const dica = `Vence em ${formatarData(venc)} (contagem a partir de ${formatarData(inicio)}).`;
    if (venc === hoje) return { situacao: "hoje", vencimento: venc, texto: "vence hoje", dica, ordem: 0 };
    if (venc < hoje) {
      // Vencimento no sábado lido no domingo daria "0 dias úteis de atraso": mínimo de 1.
      const atraso = Math.max(1, Math.abs(uteis ? diasUteisEntre(venc, hoje, feriados) : diferencaDias(venc, hoje)));
      return { situacao: "atrasado", vencimento: venc, texto: `${atraso} ${unidade(atraso, uteis)} de atraso`, dica, ordem: -diferencaDias(venc, hoje) };
    }
    const faltam = uteis ? diasUteisEntre(hoje, venc, feriados) : diferencaDias(hoje, venc);
    return { situacao: "noPrazo", vencimento: venc, texto: `vence em ${faltam} ${unidade(faltam, uteis)}`, dica, ordem: diferencaDias(hoje, venc) };
  }
  if (p.exibicao === "ate") {
    const d = diferencaDias(hoje, inicio);
    const dica = `Data: ${formatarData(inicio)}.`;
    if (d === 0) return { situacao: "hoje", vencimento: inicio, texto: "hoje", dica, ordem: 0 };
    if (d < 0) return { situacao: "atrasado", vencimento: inicio, texto: `há ${-d} ${unidade(d, false)}`, dica, ordem: d };
    return { situacao: "noPrazo", vencimento: inicio, texto: `em ${d} ${unidade(d, false)}`, dica, ordem: d };
  }
  const uteis = p.exibicao === "desdeUteis";
  const passados = uteis ? diasUteisEntre(inicio, hoje, feriados) : diferencaDias(inicio, hoje);
  return {
    situacao: "semVencimento",
    texto: `${passados} ${unidade(passados, uteis)} desde ${formatarData(inicio)}`,
    dica: `Contando desde ${formatarData(inicio)}.`,
    ordem: Number.MAX_SAFE_INTEGER - 1,
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add favoritos/src/modelo/prazo.ts favoritos/tests/verificar-prazo.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: calculo de prazo (vencimento, dias uteis com feriados, contagem desde)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 11: `favoritos` — repositório e preferências

**Files:**
- Create: `favoritos/src/repositorio.ts`, `favoritos/src/preferencias.ts`
- Test: `favoritos/tests/verificar-repositorio.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `Area`, `areaMemoria` e `Colecao` (Tarefa 4); `indiceEntre` (Tarefa 5); `vence`, `purgarLapides` e `Versionada` (Tarefa 5); `normalizarTexto` (Tarefa 2); o modelo, `porOrdem` e `corPadrao` (Tarefa 9).
- Produces:
  - `class RepositorioFavoritos`:
    - `constructor(area: Area, escopo: Escopo, carimbo: () => Carimbo)` e as propriedades `favoritos: Colecao<Favorito>`, `pastas: Colecao<Pasta>`, `etiquetas: Colecao<Etiqueta>` e `escopo`
    - `registrar(): Promise<void>`
    - `todos(): Promise<Favorito[]>`, `ativos(): Promise<Favorito[]>`, `obter(id)`, `contem(id): Promise<boolean>`
    - `adicionar(d: DadosProcesso): Promise<Favorito>`, `editar(id, m: MudancasFavorito): Promise<Favorito>`
    - `remover(ids): Promise<number>`, `restaurar(ids): Promise<number>`
    - `mover(id, anteriorId: string | null, posteriorId: string | null): Promise<void>`
    - `pastasAtivas(): Promise<Pasta[]>`, `criarPasta(nome, cor?): Promise<Pasta>`, `editarPasta(id, m)`, `removerPasta(id)`
    - `etiquetasAtivas(): Promise<Etiqueta[]>`, `criarEtiqueta(nome, cor?): Promise<Etiqueta>`, `editarEtiqueta(id, m)`, `removerEtiqueta(id)`
    - `importar(d: { favoritos?; pastas?; etiquetas? }): Promise<{ novos: number; atualizados: number }>`
    - `limpar(agora?)` e `aoMudar(cb): () => void`
  - `moverEntreListas(origem, destino, id): Promise<Favorito | null>`
  - `lerPreferencias(sync: Area): Promise<Preferencias>` e `gravarPreferencias(sync, m): Promise<Preferencias>`

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-repositorio.ts`:
```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { PALETA } from "../src/modelo/cores";
import { escoposDoContexto } from "../src/modelo/escopo";
import { porOrdem } from "../src/modelo/operacoes";
import { gravarPreferencias, lerPreferencias } from "../src/preferencias";
import { moverEntreListas, RepositorioFavoritos } from "../src/repositorio";
import { checar, secao } from "./util";
import { CTX } from "./verificar-modelo";

export async function verificarRepositorio(): Promise<void> {
  const area = areaMemoria();
  let relogio = 1000;
  const carimboA = () => ({ agora: ++relogio, dispositivo: "A" });
  const esc = escoposDoContexto(CTX);
  const repo = new RepositorioFavoritos(area, esc.unidade!, carimboA);
  const pessoal = new RepositorioFavoritos(area, esc.pessoal, carimboA);

  secao("repositorio: adicionar e remover");
  await repo.adicionar({ id: "1", protocolo: "1/2026", tipo: "T" });
  await repo.adicionar({ id: "2", protocolo: "2/2026" });
  const p1 = await repo.obter("1");
  const p2 = await repo.obter("2");
  checar("o segundo vai para o fim da ordem manual", !!p1 && !!p2 && p1.ordem < p2.ordem, [p1?.ordem, p2?.ordem]);
  checar("listas isoladas por escopo", (await pessoal.ativos()).length === 0 && (await repo.ativos()).length === 2);
  await repo.editar("1", { pasta: "px", nota: "lembrar", etiquetas: ["e1", "e1", "e2"] });
  checar("etiquetas sem repeticao", (await repo.obter("1"))?.etiquetas.join() === "e1,e2");
  checar("remover devolve quantos removeu", (await repo.remover(["1", "nao-existe"])) === 1);
  checar("removido sai dos ativos e vira lapide", !(await repo.contem("1")) && (await repo.obter("1"))?.removidoEm !== undefined);
  const volta = await repo.adicionar({ id: "1", protocolo: "1/2026" });
  checar(
    "re-favoritar devolve pasta e nota, no fim da lista",
    volta.pasta === "px" && volta.nota === "lembrar" && volta.removidoEm === undefined && volta.ordem > (p2?.ordem ?? ""),
    volta,
  );
  await repo.editar("1", { nota: "", titulo: "   " });
  const semNota = await repo.obter("1");
  checar("nota e titulo vazios somem", !!semNota && !("nota" in semNota) && !("titulo" in semNota));
  await repo.adicionar({ id: "2", protocolo: "2/2026", especificacao: "segredo", sigiloso: true });
  await repo.adicionar({ id: "2", protocolo: "2/2026", especificacao: "vazou?" });
  const s = await repo.obter("2");
  checar("sigilo desconhecido mantem o sigilo de antes", s?.sigiloso === true && s.especificacao === undefined, s);

  secao("repositorio: ordem manual");
  await repo.adicionar({ id: "3", protocolo: "3/2026" });
  await repo.mover("3", null, "2");
  const ordemIds = (await repo.ativos()).sort(porOrdem).map((f) => f.id).join();
  checar("mover para o topo grava so o movido", ordemIds === "3,2,1", ordemIds);

  secao("repositorio: pastas e etiquetas");
  const pasta = await repo.criarPasta("Contratos");
  checar("pasta repetida devolve a existente", (await repo.criarPasta(" contratos ")).id === pasta.id);
  await repo.editar("2", { pasta: pasta.id });
  await repo.removerPasta(pasta.id);
  checar("remover pasta tira a pasta dos favoritos", (await repo.obter("2"))?.pasta === undefined && (await repo.pastasAtivas()).length === 0);
  const et = await repo.criarEtiqueta("Urgente");
  checar("etiqueta nova ganha cor da paleta", PALETA.includes(et.cor));
  await repo.editar("3", { etiquetas: [et.id] });
  await repo.removerEtiqueta(et.id);
  checar("remover etiqueta tira dos favoritos", (await repo.obter("3"))?.etiquetas.length === 0);

  secao("repositorio: importar mescla");
  const atual3 = (await repo.obter("3"))!;
  const r = await repo.importar({ favoritos: [{ ...atual3, titulo: "velho", atualizadoEm: 1 }, { ...atual3, id: "4", protocolo: "4/2026" }] });
  checar("importar nao pisa edicao mais nova e traz o novo", r.novos === 1 && r.atualizados === 0 && (await repo.obter("3"))?.titulo === undefined, r);

  secao("repositorio: lapides antigas");
  await repo.limpar(relogio + 91 * 86_400_000);
  checar("limpeza apaga lapide com mais de 90 dias", (await repo.pastas.listar()).length === 0 && (await repo.etiquetas.listar()).length === 0);

  secao("repositorio: duas escritas ao mesmo tempo (Review Focus 3)");
  const repoB = new RepositorioFavoritos(area, esc.unidade!, () => ({ agora: ++relogio, dispositivo: "B" }));
  await Promise.all([repo.adicionar({ id: "10", protocolo: "10/2026" }), repoB.adicionar({ id: "11", protocolo: "11/2026" })]);
  checar("itens diferentes gravados juntos: nenhum se perde", (await repo.contem("10")) && (await repo.contem("11")));
  await Promise.all([repo.editar("10", { nota: "de A" }), repoB.editar("10", { titulo: "de B" })]);
  const final = await repo.obter("10");
  const ativos = (await repo.ativos()).length;
  checar("mesmo item: uma versao inteira vence e a lista fica intacta", !!final && (final.nota === "de A") !== (final.titulo === "de B") && ativos === 6, { final, ativos });

  secao("repositorio: mover entre listas");
  await repo.editar("11", { titulo: "Pessoal!", pasta: "zz", nota: "n" });
  const movido = await moverEntreListas(repo, pessoal, "11");
  checar(
    "vai para a Pessoal com titulo e nota, sem a pasta da unidade",
    movido?.titulo === "Pessoal!" && movido.nota === "n" && movido.pasta === undefined && !(await repo.contem("11")) && (await pessoal.contem("11")),
    movido,
  );

  secao("repositorio: aviso de mudanca");
  let avisos = 0;
  const parar = repo.aoMudar(() => (avisos += 1));
  await repo.editar("10", { titulo: "x" });
  parar();
  await repo.editar("10", { titulo: "y" });
  checar("aoMudar avisa e para", avisos === 1, avisos);

  secao("preferencias");
  const sync = areaMemoria();
  checar("padrao quando nada foi gravado", (await lerPreferencias(sync)).exibir === "abaixo");
  await gravarPreferencias(sync, { recolhido: true });
  const pref = await lerPreferencias(sync);
  checar("grava so o que mudou e mantem o resto", pref.recolhido && pref.perguntarAoFavoritar && pref.ordem === "manual", pref);
}
```

Em `verificar.ts`, troque para chamadas assíncronas:
```ts
verificarModelo();
verificarPrazo();
await verificarRepositorio();
resumo();
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (`../src/repositorio` ausente).

- [ ] **Step 3: Implementar**

`favoritos/src/repositorio.ts`:
```ts
/**
 * Favoritos de UM escopo (usuário + unidade, ou a lista Pessoal) no
 * `chrome.storage.local`, uma chave por entidade. Remover grava lápide
 * (Lixeira de 30 dias, e a sincronia da F3 não ressuscita o removido).
 * A ordem manual é fracionária: mover grava só o item movido.
 */

import type { Area } from "@comum/armazenamento/area";
import { Colecao } from "@comum/armazenamento/colecao";
import { indiceEntre } from "@comum/ordem/indice";
import { purgarLapides, type Versionada, vence } from "@comum/sincronia/entidade";
import { normalizarTexto } from "@comum/texto";
import { DIAS_LAPIDE, MAX_ETIQUETAS, MAX_NOTA } from "./modelo/constantes";
import { corPadrao } from "./modelo/cores";
import { chaveEscopo } from "./modelo/escopo";
import { editar, novoFavorito, remover, restaurar } from "./modelo/operacoes";
import type { Carimbo, DadosProcesso, Escopo, Etiqueta, Favorito, MudancasFavorito, Pasta } from "./modelo/tipos";

const maiorOrdem = (itens: Array<{ ordem: string }>): string | null =>
  itens.reduce<string | null>((m, i) => (m === null || i.ordem > m ? i.ordem : m), null);

const porNome = (a: { nome: string }, b: { nome: string }) => a.nome.localeCompare(b.nome, "pt-BR");

export class RepositorioFavoritos {
  readonly favoritos: Colecao<Favorito>;
  readonly pastas: Colecao<Pasta>;
  readonly etiquetas: Colecao<Etiqueta>;
  private readonly chaveMeta: string;

  constructor(
    private readonly area: Area,
    readonly escopo: Escopo,
    private readonly carimbo: () => Carimbo,
  ) {
    const base = `favoritos/${chaveEscopo(escopo)}/`;
    this.favoritos = new Colecao<Favorito>(area, `${base}f/`);
    this.pastas = new Colecao<Pasta>(area, `${base}p/`);
    this.etiquetas = new Colecao<Etiqueta>(area, `${base}e/`);
    this.chaveMeta = `${base}meta`;
  }

  /** Guarda o escopo por extenso (com a sigla da unidade) para a exportação montar o arquivo. */
  async registrar(): Promise<void> {
    await this.area.gravar({ [this.chaveMeta]: { escopo: this.escopo } });
  }

  todos(): Promise<Favorito[]> {
    return this.favoritos.listar();
  }

  async ativos(): Promise<Favorito[]> {
    return (await this.todos()).filter((f) => f.removidoEm === undefined);
  }

  obter(id: string): Promise<Favorito | undefined> {
    return this.favoritos.obter(id);
  }

  async contem(id: string): Promise<boolean> {
    const f = await this.obter(id);
    return !!f && f.removidoEm === undefined;
  }

  async proximaOrdem(): Promise<string> {
    return indiceEntre(maiorOrdem(await this.todos()), null);
  }

  async adicionar(d: DadosProcesso): Promise<Favorito> {
    const c = this.carimbo();
    const atual = await this.obter(d.id);
    let f: Favorito;
    if (!atual) {
      f = novoFavorito(d, await this.proximaOrdem(), c);
    } else {
      const sigiloso = d.sigiloso === undefined ? atual.sigiloso : d.sigiloso ? (true as const) : undefined;
      const m: MudancasFavorito = {
        protocolo: d.protocolo || atual.protocolo,
        tipo: d.tipo || atual.tipo,
        sigiloso,
        especificacao: sigiloso ? undefined : d.especificacao || atual.especificacao,
      };
      // Re-favoritar o que estava na lixeira devolve pasta, etiquetas e nota de antes, no fim da lista.
      if (atual.removidoEm !== undefined) Object.assign(m, { removidoEm: undefined, ordem: await this.proximaOrdem() });
      f = editar(atual, m, c);
    }
    await this.favoritos.gravar(f.id, f);
    return f;
  }

  async editar(id: string, mudancas: MudancasFavorito): Promise<Favorito> {
    const atual = await this.obter(id);
    if (!atual) throw new Error(`O favorito ${id} não existe nesta lista.`);
    const m: MudancasFavorito = { ...mudancas };
    if (m.etiquetas) m.etiquetas = [...new Set(m.etiquetas)].slice(0, MAX_ETIQUETAS);
    if (typeof m.nota === "string") m.nota = m.nota.slice(0, MAX_NOTA).trim() ? m.nota.slice(0, MAX_NOTA) : undefined;
    if (typeof m.titulo === "string") m.titulo = m.titulo.trim() || undefined;
    const f = editar(atual, m, this.carimbo());
    await this.favoritos.gravar(id, f);
    return f;
  }

  async remover(ids: string[]): Promise<number> {
    const c = this.carimbo();
    const alvos = (await Promise.all(ids.map((id) => this.obter(id)))).filter((f): f is Favorito => !!f && f.removidoEm === undefined);
    await this.favoritos.gravarVarios(alvos.map((f) => [f.id, remover(f, c)]));
    return alvos.length;
  }

  async restaurar(ids: string[]): Promise<number> {
    const c = this.carimbo();
    const alvos = (await Promise.all(ids.map((id) => this.obter(id)))).filter((f): f is Favorito => !!f && f.removidoEm !== undefined);
    await this.favoritos.gravarVarios(alvos.map((f) => [f.id, restaurar(f, c)]));
    return alvos.length;
  }

  async mover(id: string, anteriorId: string | null, posteriorId: string | null): Promise<void> {
    const a = anteriorId ? await this.obter(anteriorId) : undefined;
    const b = posteriorId ? await this.obter(posteriorId) : undefined;
    let ordem: string;
    try {
      ordem = indiceEntre(a?.ordem ?? null, b?.ordem ?? null);
    } catch {
      // Chaves iguais vindas de dois computadores: o item fica logo depois do anterior.
      ordem = indiceEntre(a?.ordem ?? null, null);
    }
    await this.editar(id, { ordem });
  }

  async pastasAtivas(): Promise<Pasta[]> {
    return (await this.pastas.listar()).filter((p) => p.removidoEm === undefined).sort((x, y) => porOrdemPasta(x, y));
  }

  async criarPasta(nome: string, cor?: string): Promise<Pasta> {
    const limpo = nome.trim();
    if (!limpo) throw new Error("Informe o nome da pasta.");
    const todas = await this.pastas.listar();
    const igual = todas.find((p) => p.removidoEm === undefined && normalizarTexto(p.nome) === normalizarTexto(limpo));
    if (igual) return igual;
    const c = this.carimbo();
    const p: Pasta = { id: crypto.randomUUID(), nome: limpo, ordem: indiceEntre(maiorOrdem(todas), null), atualizadoEm: c.agora, dispositivo: c.dispositivo };
    if (cor) p.cor = cor;
    await this.pastas.gravar(p.id, p);
    return p;
  }

  async editarPasta(id: string, m: Partial<Pick<Pasta, "nome" | "cor" | "ordem">>): Promise<void> {
    const atual = await this.pastas.obter(id);
    if (atual) await this.pastas.gravar(id, editar(atual, m, this.carimbo()));
  }

  async removerPasta(id: string): Promise<void> {
    const atual = await this.pastas.obter(id);
    if (!atual) return;
    const c = this.carimbo();
    await this.pastas.gravar(id, remover(atual, c));
    const afetados = (await this.todos()).filter((f) => f.pasta === id);
    await this.favoritos.gravarVarios(afetados.map((f) => [f.id, editar(f, { pasta: undefined }, c)]));
  }

  async etiquetasAtivas(): Promise<Etiqueta[]> {
    return (await this.etiquetas.listar()).filter((e) => e.removidoEm === undefined).sort(porNome);
  }

  async criarEtiqueta(nome: string, cor?: string): Promise<Etiqueta> {
    const limpo = nome.trim();
    if (!limpo) throw new Error("Informe o nome da etiqueta.");
    const igual = (await this.etiquetas.listar()).find((e) => e.removidoEm === undefined && normalizarTexto(e.nome) === normalizarTexto(limpo));
    if (igual) return igual;
    const c = this.carimbo();
    const e: Etiqueta = { id: crypto.randomUUID(), nome: limpo, cor: cor ?? corPadrao(limpo), atualizadoEm: c.agora, dispositivo: c.dispositivo };
    await this.etiquetas.gravar(e.id, e);
    return e;
  }

  async editarEtiqueta(id: string, m: Partial<Pick<Etiqueta, "nome" | "cor" | "icone">>): Promise<void> {
    const atual = await this.etiquetas.obter(id);
    if (atual) await this.etiquetas.gravar(id, editar(atual, m, this.carimbo()));
  }

  async removerEtiqueta(id: string): Promise<void> {
    const atual = await this.etiquetas.obter(id);
    if (!atual) return;
    const c = this.carimbo();
    await this.etiquetas.gravar(id, remover(atual, c));
    const afetados = (await this.todos()).filter((f) => f.etiquetas.includes(id));
    await this.favoritos.gravarVarios(afetados.map((f) => [f.id, editar(f, { etiquetas: f.etiquetas.filter((x) => x !== id) }, c)]));
  }

  /** Mescla entidades vindas de fora (arquivo, migração): vence a versão mais recente de cada uma. */
  async importar(d: { favoritos?: Favorito[]; pastas?: Pasta[]; etiquetas?: Etiqueta[] }): Promise<{ novos: number; atualizados: number }> {
    const r = await this.mesclarEm(this.favoritos, d.favoritos ?? []);
    await this.mesclarEm(this.pastas, d.pastas ?? []);
    await this.mesclarEm(this.etiquetas, d.etiquetas ?? []);
    return r;
  }

  private async mesclarEm<T extends Versionada>(col: Colecao<T>, itens: T[]): Promise<{ novos: number; atualizados: number }> {
    const atuais = new Map((await col.listar()).map((i) => [i.id, i]));
    const gravar: Array<[string, T]> = [];
    let novos = 0;
    let atualizados = 0;
    for (const item of itens) {
      const atual = atuais.get(item.id);
      if (!atual) {
        novos += 1;
        gravar.push([item.id, item]);
      } else if (vence(item, atual)) {
        atualizados += 1;
        gravar.push([item.id, item]);
      }
    }
    await col.gravarVarios(gravar);
    return { novos, atualizados };
  }

  /** Apaga de vez as lápides com mais de 90 dias (a sincronia da F3 já as terá propagado). */
  async limpar(agora = Date.now()): Promise<void> {
    for (const col of [this.favoritos, this.pastas, this.etiquetas] as Array<Colecao<Versionada>>) {
      const todos = await col.listar();
      const manter = new Set(purgarLapides(todos, agora, DIAS_LAPIDE).map((i) => i.id));
      await col.apagar(todos.filter((i) => !manter.has(i.id)).map((i) => i.id));
    }
  }

  aoMudar(cb: () => void): () => void {
    const parar = [this.favoritos.aoMudar(cb), this.pastas.aoMudar(cb), this.etiquetas.aoMudar(cb)];
    return () => {
      for (const p of parar) p();
    };
  }
}

function porOrdemPasta(a: Pasta, b: Pasta): number {
  if (a.ordem !== b.ordem) return a.ordem < b.ordem ? -1 : 1;
  return porNome(a, b);
}

/**
 * Leva um favorito da lista da unidade para a Pessoal, ou o contrário. Pasta e
 * etiquetas são de cada lista e ficam para trás; título, nota, prazo e mapa vão junto.
 */
export async function moverEntreListas(origem: RepositorioFavoritos, destino: RepositorioFavoritos, id: string): Promise<Favorito | null> {
  const f = await origem.obter(id);
  if (!f || f.removidoEm !== undefined) return null;
  await destino.adicionar({ id: f.id, protocolo: f.protocolo, tipo: f.tipo, especificacao: f.especificacao, sigiloso: f.sigiloso });
  const copiado = await destino.editar(id, { titulo: f.titulo, nota: f.nota, prazo: f.prazo, local: f.local, pasta: undefined, etiquetas: [] });
  await origem.remover([id]);
  return copiado;
}
```

`favoritos/src/preferencias.ts`:
```ts
import type { Area } from "@comum/armazenamento/area";
import { CHAVE_PREFERENCIAS } from "./modelo/constantes";
import { PREFERENCIAS_PADRAO, type Preferencias } from "./modelo/tipos";

export async function lerPreferencias(sync: Area): Promise<Preferencias> {
  const v = (await sync.obter(CHAVE_PREFERENCIAS))[CHAVE_PREFERENCIAS];
  return { ...PREFERENCIAS_PADRAO, ...(v && typeof v === "object" ? (v as Partial<Preferencias>) : {}) };
}

export async function gravarPreferencias(sync: Area, m: Partial<Preferencias>): Promise<Preferencias> {
  const nova = { ...(await lerPreferencias(sync)), ...m };
  await sync.gravar({ [CHAVE_PREFERENCIAS]: nova });
  return nova;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

Se "re-favoritar devolve pasta e nota" falhar porque a lápide some antes, confira que `adicionar` lê o item com `obter`, que traz a lápide, e não com `contem`.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add favoritos/src/repositorio.ts favoritos/src/preferencias.ts favoritos/tests/verificar-repositorio.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: repositorio por escopo com lapides, ordem fracionaria, pastas e etiquetas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 12: `favoritos` — migração dos favoritos antigos

**Files:**
- Create: `favoritos/src/migracao/legado.ts`, `favoritos/src/migracao/fontes.ts`
- Test: `favoritos/tests/verificar-migracao.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `indicesEntre` (Tarefa 5); `hashCurto` e `normalizarTexto` (Tarefa 2); `corPadrao` e `MAX_ETIQUETAS` (Tarefa 9); os tipos.
- Produces:
  - `interface ResultadoMigracao { favoritos: Favorito[]; pastas: Pasta[]; etiquetas: Etiqueta[]; ignorados: number; total: number }`
  - `converterLegado(bruto: unknown, opcoes: { agora: number }): ResultadoMigracao`
  - `converterConfigDate(cd: unknown): Prazo | undefined`
  - `lerLegadoLocal(armazenamento: Pick<Storage, "getItem">): unknown | null`
  - `lerArquivoAntigo(prazoMs?: number): Promise<unknown | null>`

Regra central: o que vem do legado entra com a **versão mais velha possível** (`atualizadoEm: 1`, `dispositivo: "legado"`). Se o usuário editar depois no favoritos novo e a migração rodar de novo (menu "Importar favoritos antigos"), a edição dele vence. Uma remoção feita depois também não ressuscita. Os ids de pasta e etiqueta derivam do nome (`leg-<hash>`), então a mesma migração feita em dois computadores gera as mesmas pastas.

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-migracao.ts`:
```ts
import { converterConfigDate, converterLegado } from "../src/migracao/legado";
import { lerLegadoLocal } from "../src/migracao/fontes";
import { PALETA } from "../src/modelo/cores";
import { porOrdem } from "../src/modelo/operacoes";
import { checar, secao } from "./util";

const LEGADO = {
  favorites: [
    {
      id_procedimento: "150098",
      processo: "012.00000178/2025-23",
      tipo_procedimento: "Expediente",
      descricao: "Dilação de prazo",
      order: 2,
      categoria: "Contratos 'urgentes'",
      etiquetas: ["urgente"],
      andamento: [{ datahora: "2026-09-01 10:00:00" }],
    },
    { id_procedimento: 150099, processo: "012.00000179/2025-23", order: null, categoria: "", etiquetas: null, configdate: null },
    {
      id_procedimento: "150100",
      processo: "012.00000180/2025-23",
      order: 1,
      categoria: "contratos 'URGENTES'",
      configdate: { date: "2026-10-04", setdate: true, newdoc: true, newdoclist: [] },
    },
    {
      id_procedimento: "150098",
      processo: "012.00000178/2025-23",
      tipo_procedimento: "Expediente",
      descricao: "Versão repetida mais nova",
      order: 2,
      categoria: "Contratos 'urgentes'",
      etiquetas: ["urgente", "Fiscalização"],
      latlng: [-15.8, -47.86],
    },
    { processo: "sem id" },
    "lixo",
  ],
  config: { colortags: [{ name: "fiscalizacao", value: "#bfd5e8", icon: "tag" }, { name: "urgente", value: "nao-e-cor" }] },
};

export function verificarMigracao(): void {
  secao("migracao: dados reais e malformados (Review Focus 2)");
  const r = converterLegado(LEGADO, { agora: 5000 });
  checar("conta e ignora o que nao tem id ou protocolo", r.total === 6 && r.ignorados === 2, { total: r.total, ignorados: r.ignorados });
  checar("deduplica pelo id (a ultima ocorrencia vence)", r.favoritos.length === 3);
  const f98 = r.favoritos.find((f) => f.id === "150098");
  checar("id numerico vira texto", r.favoritos.some((f) => f.id === "150099"));
  checar("descricao vira especificacao e tipo e mantido", f98?.especificacao === "Versão repetida mais nova" && f98.tipo === "Expediente", f98);
  checar("andamento e outros caches nao entram", f98 !== undefined && !("andamento" in f98));
  checar("mapa preservado", f98?.local?.lat === -15.8 && f98.local.lng === -47.86);
  const ordem = [...r.favoritos].sort(porOrdem).map((f) => f.id).join();
  checar("ordem do legado; sem ordem vai para o fim", ordem === "150100,150098,150099", ordem);
  checar("categoria com aspas e caixa diferente vira UMA pasta", r.pastas.length === 1 && r.favoritos.filter((f) => f.pasta === r.pastas[0]?.id).length === 2);
  const fisc = r.etiquetas.find((e) => e.nome === "Fiscalização");
  const urg = r.etiquetas.find((e) => e.nome === "urgente");
  checar("cor da etiqueta vem do colortags pelo nome normalizado", fisc?.cor === "#bfd5e8" && fisc.icone === "tag", fisc);
  checar("cor invalida no legado cai na paleta", !!urg && PALETA.includes(urg.cor), urg);
  checar("etiquetas nulas viram lista vazia", r.favoritos.find((f) => f.id === "150099")?.etiquetas.length === 0);
  checar("versao mais velha possivel", r.favoritos.every((f) => f.atualizadoEm === 1 && f.dispositivo === "legado" && f.criadoEm === 5000));
  const r2 = converterLegado(LEGADO, { agora: 9999 });
  checar("ids de pasta e etiqueta estaveis entre computadores", r2.pastas[0]?.id === r.pastas[0]?.id && r2.etiquetas.map((e) => e.id).join() === r.etiquetas.map((e) => e.id).join());
  checar("o EM BREVE de fabrica vira prazo pela data", JSON.stringify(r.favoritos.find((f) => f.id === "150100")?.prazo) === JSON.stringify({ referencia: { de: "data", data: "2026-10-04" }, exibicao: "ate" }));
  checar("aceita texto com BOM", converterLegado(`﻿${JSON.stringify(LEGADO)}`, { agora: 1 }).favoritos.length === 3);
  checar("JSON invalido nao quebra", converterLegado("{quebrado", { agora: 1 }).favoritos.length === 0);
  checar("nulo nao quebra", converterLegado(null, { agora: 1 }).total === 0);

  secao("migracao: configdate -> prazo");
  const base = { date: "2026-09-01 10:00:00", dateDue: "2026-09-06", countdown: true, countdays: false, workday: false, duenumber: 5, duecounter: "util", duemode: "depois" };
  checar(
    "N dias uteis",
    JSON.stringify(converterConfigDate({ ...base, setdate: true, duedate: true })) ===
      JSON.stringify({ referencia: { de: "data", data: "2026-09-01" }, vencimento: { em: "dias", n: 5, contagem: "uteis" }, exibicao: "ate" }),
    converterConfigDate({ ...base, setdate: true, duedate: true }),
  );
  checar("vencimento em data fixa", JSON.stringify(converterConfigDate({ ...base, duesetdate: true })?.vencimento) === JSON.stringify({ em: "data", data: "2026-09-06" }));
  checar("a partir de documento", JSON.stringify(converterConfigDate({ ...base, selectdoc: true, listdocs: 160223 })?.referencia) === JSON.stringify({ de: "documento", idDocumento: "160223", data: "2026-09-01" }));
  checar("a partir de novo documento", converterConfigDate({ ...base, newdoc: true, newdoclist: ["Ofício"] })?.referencia.de === "novoDocumento");
  checar("antes com numero positivo vira negativo", (converterConfigDate({ ...base, duedate: true, duemode: "antes", duenumber: 3 })?.vencimento as { n: number } | undefined)?.n === -3);
  checar("contagem em dias uteis desde", converterConfigDate({ ...base, countdays: true, workday: true })?.exibicao === "desdeUteis");
  checar("data invalida nao vira prazo", converterConfigDate({ date: "ontem" }) === undefined && converterConfigDate(null) === undefined);

  secao("migracao: leitura do localStorage antigo");
  const loja = (v: string | null) => ({ getItem: (k: string) => (k === "configDataFavoritesPro" ? v : null) });
  checar("le e analisa", (lerLegadoLocal(loja(JSON.stringify(LEGADO))) as typeof LEGADO).favorites.length === 6);
  checar("ausente ou quebrado devolve null", lerLegadoLocal(loja(null)) === null && lerLegadoLocal(loja("{x")) === null);
}
```

Em `verificar.ts`: `verificarMigracao();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (módulos de `src/migracao` ausentes).

- [ ] **Step 3: Implementar**

`favoritos/src/migracao/legado.ts`:
```ts
/**
 * Converte o `configDataFavoritesPro` do legado (localStorage da página do SEI)
 * para o modelo novo. O legado tolerava quase tudo (id número ou texto, ordem
 * nula, categoria com aspas, configdate ausente), e a conversão também precisa
 * tolerar. Nada daqui grava: quem chama decide para qual lista levar.
 *
 * Versão "mais velha possível" (atualizadoEm 1): repetir a migração nunca
 * desfaz o que o usuário editou ou removeu depois no favoritos novo.
 */

import { indicesEntre } from "@comum/ordem/indice";
import { hashCurto, normalizarTexto } from "@comum/texto";
import { MAX_ETIQUETAS } from "../modelo/constantes";
import { corPadrao } from "../modelo/cores";
import type { Etiqueta, Favorito, Pasta, Prazo } from "../modelo/tipos";

export interface ResultadoMigracao {
  favoritos: Favorito[];
  pastas: Pasta[];
  etiquetas: Etiqueta[];
  ignorados: number;
  total: number;
}

const VERSAO_LEGADO = { atualizadoEm: 1, dispositivo: "legado" } as const;
const ISO = /^\d{4}-\d{2}-\d{2}/;

type Obj = Record<string, unknown>;
const objeto = (v: unknown): Obj | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : null);
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const texto = (v: unknown): string => (typeof v === "string" ? v.trim() : typeof v === "number" && Number.isFinite(v) ? String(v) : "");
const corValida = (v: unknown): string | undefined => (typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v) ? v : undefined);
const dataDe = (v: unknown): string | undefined => {
  const t = texto(v);
  return ISO.test(t) ? t.slice(0, 10) : undefined;
};

function analisar(bruto: unknown): Obj | null {
  if (typeof bruto !== "string") return objeto(bruto);
  try {
    return objeto(JSON.parse(bruto.replace(/^﻿/, "")));
  } catch {
    return null;
  }
}

export function converterConfigDate(bruto: unknown): Prazo | undefined {
  const cd = objeto(bruto);
  const data = cd ? dataDe(cd.date) : undefined;
  if (!cd || !data) return undefined;
  const tipos = lista(cd.newdoclist).map(texto).filter(Boolean);
  const referencia: Prazo["referencia"] =
    cd.newdoc && tipos.length
      ? { de: "novoDocumento", tipos, desde: data }
      : cd.selectdoc && texto(cd.listdocs)
        ? { de: "documento", idDocumento: texto(cd.listdocs), data }
        : { de: "data", data };
  let vencimento: Prazo["vencimento"];
  const dataFixa = dataDe(cd.dateDue);
  const n = Number(cd.duenumber);
  if (cd.duesetdate && dataFixa) vencimento = { em: "data", data: dataFixa };
  else if (cd.duedate && Number.isFinite(n)) {
    vencimento = { em: "dias", n: cd.duemode === "antes" ? -Math.abs(n) : n, contagem: cd.duecounter === "util" ? "uteis" : "corridos" };
  }
  const exibicao: Prazo["exibicao"] = cd.countdays ? (cd.workday ? "desdeUteis" : "desde") : "ate";
  return vencimento ? { referencia, vencimento, exibicao } : { referencia, exibicao };
}

export function converterLegado(bruto: unknown, opcoes: { agora: number }): ResultadoMigracao {
  const raiz = analisar(bruto);
  const itens = lista(raiz?.favorites);
  const cores = new Map<string, { cor?: string; icone?: string }>();
  for (const t of lista(objeto(raiz?.config)?.colortags)) {
    const o = objeto(t);
    const nome = texto(o?.name);
    if (nome) cores.set(normalizarTexto(nome), { cor: corValida(o?.value), icone: texto(o?.icon) || undefined });
  }

  let ignorados = 0;
  const porId = new Map<string, Obj>();
  for (const item of itens) {
    const o = objeto(item);
    const id = texto(o?.id_procedimento);
    if (!o || !id || !texto(o.processo)) {
      ignorados += 1;
      continue;
    }
    porId.delete(id);
    porId.set(id, o);
  }

  const ordemLegada = (o: Obj) => {
    const n = Number(o.order);
    return o.order !== null && Number.isFinite(n) && n >= 0 ? n : Number.MAX_SAFE_INTEGER;
  };
  const ordenados = [...porId.entries()].map(([id, o], i) => ({ id, o, i })).sort((a, b) => ordemLegada(a.o) - ordemLegada(b.o) || a.i - b.i);
  const ordens = indicesEntre(null, null, ordenados.length);

  const pastas = new Map<string, Pasta>();
  const etiquetas = new Map<string, Etiqueta>();
  const idPasta = (nome: string): string | undefined => {
    const chave = normalizarTexto(nome);
    if (!chave) return undefined;
    if (!pastas.has(chave)) pastas.set(chave, { id: `leg-${hashCurto(chave)}`, nome: nome.trim(), ordem: "", ...VERSAO_LEGADO });
    return pastas.get(chave)?.id;
  };
  const idEtiqueta = (nome: string): string | undefined => {
    const chave = normalizarTexto(nome);
    if (!chave) return undefined;
    if (!etiquetas.has(chave)) {
      const c = cores.get(chave);
      const e: Etiqueta = { id: `leg-${hashCurto(chave)}`, nome: nome.trim(), cor: c?.cor ?? corPadrao(chave), ...VERSAO_LEGADO };
      if (c?.icone) e.icone = c.icone;
      etiquetas.set(chave, e);
    }
    return etiquetas.get(chave)?.id;
  };

  const favoritos = ordenados.map(({ id, o }, i): Favorito => {
    const f: Favorito = {
      id,
      protocolo: texto(o.processo),
      etiquetas: [...new Set(lista(o.etiquetas).map(texto).filter(Boolean).map(idEtiqueta))].filter((x): x is string => !!x).slice(0, MAX_ETIQUETAS),
      ordem: ordens[i] ?? "",
      criadoEm: opcoes.agora,
      ...VERSAO_LEGADO,
    };
    const tipo = texto(o.tipo_procedimento);
    const espec = texto(o.descricao);
    const pasta = idPasta(texto(o.categoria));
    const prazo = converterConfigDate(o.configdate);
    const ll = lista(o.latlng).map(Number);
    if (tipo) f.tipo = tipo;
    if (espec) f.especificacao = espec;
    if (pasta) f.pasta = pasta;
    if (prazo) f.prazo = prazo;
    if (ll.length === 2 && ll.every(Number.isFinite)) f.local = { lat: ll[0]!, lng: ll[1]! };
    return f;
  });

  const ordensPastas = indicesEntre(null, null, pastas.size);
  const listaPastas = [...pastas.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((p, i) => ({ ...p, ordem: ordensPastas[i] ?? "" }));
  return { favoritos, pastas: listaPastas, etiquetas: [...etiquetas.values()], ignorados, total: itens.length };
}
```

`favoritos/src/migracao/fontes.ts`:
```ts
/**
 * Onde o legado guardava os favoritos, na origem do SEI (o content script do
 * mundo isolado enxerga o mesmo localStorage da página). Nada aqui apaga o que
 * existe: o dado antigo fica intacto por algumas versões, como rede de segurança.
 */

export function lerLegadoLocal(armazenamento: Pick<Storage, "getItem">): unknown | null {
  const bruto = armazenamento.getItem("configDataFavoritesPro");
  if (!bruto) return null;
  try {
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

type EntradaArquivo = { file(ok: (f: File) => void, erro: () => void): void };
type SistemaArquivos = { root: { getFile(nome: string, o: object, ok: (e: EntradaArquivo) => void, erro: () => void): void } };
type PedirFs = (tipo: number, tamanho: number, ok: (fs: SistemaArquivos) => void, erro: () => void) => void;

/**
 * Cópia que o legado gravava em `configPro.json` (FileSystem API antiga,
 * PERSISTENT) e que ele mesmo nunca conseguiu restaurar, por causa de um
 * `JSON.parse` duplo em sei-functions-pro.js:1547. Em navegador sem a API ou
 * sem o arquivo, devolve null.
 */
export function lerArquivoAntigo(prazoMs = 2000): Promise<unknown | null> {
  const pedir = (window as unknown as { webkitRequestFileSystem?: PedirFs }).webkitRequestFileSystem;
  if (!pedir) return Promise.resolve(null);
  return new Promise((ok) => {
    const limite = setTimeout(() => ok(null), prazoMs);
    const nada = () => {
      clearTimeout(limite);
      ok(null);
    };
    try {
      pedir(
        1,
        0,
        (fs) =>
          fs.root.getFile(
            "configPro.json",
            {},
            (entrada) =>
              entrada.file(async (arquivo) => {
                try {
                  const conteudo = JSON.parse(await arquivo.text());
                  clearTimeout(limite);
                  ok(conteudo);
                } catch {
                  nada();
                }
              }, nada),
            nada,
          ),
        nada,
      );
    } catch {
      nada();
    }
  });
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add favoritos/src/migracao favoritos/tests/verificar-migracao.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: migracao dos favoritos antigos (localStorage e configPro.json) sem desfazer edicoes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 13: `favoritos/pagina` — contexto, serviço e estrelas

**Files:**
- Create: `favoritos/src/pagina/marca.ts`, `contexto.ts`, `esperar.ts`, `estilo.ts`, `estrela.ts`, `servico.ts`, `estrelasCaixa.ts`, `estrelasListas.ts`, `estrelaArvore.ts` (todos em `favoritos/src/pagina/`)
- Test: `favoritos/tests/verificar-pagina.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes:
  - do núcleo: `lerContexto` (Tarefa 8), `lerLinhaCaixa` (Tarefa 8), `lerArvore`, `parametros`, `textoDe`, `Pagina`;
  - `h` e `icone` (Tarefa 3);
  - `RepositorioFavoritos` (Tarefa 11) e os tipos.
- Produces:
  - `ATRIBUTO_ATIVO = "data-seipro-favoritos"`, `marcarAtivo(doc)`
  - `paginaDe(doc, url?): Pagina`, `documentoTopo(): Document`, `contextoDe(doc, temaEscuro, url?): ContextoAba | null`, `temaEscuroLegado(armazenamento): boolean`
  - `esperar<T>(achar, prazoMs, intervaloMs?): Promise<T | null>`
  - `instalarEstilo(doc)`, `criarEstrela(ativo, aoClicar): HTMLButtonElement`, `atualizarEstrela(b, ativo)`
  - `class ServicoFavoritosPagina { constructor(d: DepsServico); carregar(); ativo(id); alternar(d: DadosProcesso, ancora: HTMLElement): Promise<boolean>; aoMudar(cb): () => void }`, com `interface DepsServico { unidade: RepositorioFavoritos | null; pessoal: RepositorioFavoritos; aoAdicionar?: (f: Favorito, repo: RepositorioFavoritos, ancora: HTMLElement) => void }`
  - `instalarEstrelasCaixa(doc, servico): { atualizar(): void; desligar(): void }`
  - `dadosDaLinhaLista(tr): DadosProcesso | null`, `instalarEstrelasListas(doc, servico): { atualizar(): void; desligar(): void }`
  - `dadosDaArvore(doc, url): DadosProcesso | null`, `instalarEstrelaArvore(doc, servico, url): Promise<boolean>`

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-pagina.ts`:
```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { escoposDoContexto } from "../src/modelo/escopo";
import { contextoDe, temaEscuroLegado } from "../src/pagina/contexto";
import { dadosDaArvore, instalarEstrelaArvore } from "../src/pagina/estrelaArvore";
import { instalarEstrelasCaixa } from "../src/pagina/estrelasCaixa";
import { dadosDaLinhaLista, instalarEstrelasListas } from "../src/pagina/estrelasListas";
import { ATRIBUTO_ATIVO, marcarAtivo } from "../src/pagina/marca";
import { ServicoFavoritosPagina } from "../src/pagina/servico";
import { RepositorioFavoritos } from "../src/repositorio";
import { checar, instalarDom, secao, telaSei, tique } from "./util";

const URL_CAIXA = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_controlar&infra_unidade_atual=110000001";

export async function verificarPagina(): Promise<void> {
  secao("pagina: contexto e marca");
  const { doc: caixa } = telaSei("sei41/caixa.html");
  const ctx = contextoDe(caixa, false, URL_CAIXA);
  checar(
    "contexto lido do cabecalho",
    ctx?.login === "pedro.soares" && ctx.unidade?.id === "110000001" && ctx.unidade.sigla === "TESTE" && ctx.host === "treinamento.sei.sp.gov.br",
    ctx,
  );
  marcarAtivo(caixa);
  checar("marca o documento para o legado se desligar", caixa.documentElement.getAttribute(ATRIBUTO_ATIVO) === "1");
  checar("tema escuro do legado", temaEscuroLegado({ getItem: (k) => (k === "darkModePro" ? "1" : null) }) && !temaEscuroLegado({ getItem: () => null }));

  secao("pagina: servico");
  const area = areaMemoria();
  const esc = escoposDoContexto(ctx!);
  let relogio = 1;
  const carimbo = () => ({ agora: ++relogio, dispositivo: "T" });
  const repos = { unidade: new RepositorioFavoritos(area, esc.unidade!, carimbo), pessoal: new RepositorioFavoritos(area, esc.pessoal, carimbo) };
  const adicionados: string[] = [];
  const servico = new ServicoFavoritosPagina({ ...repos, aoAdicionar: (f) => adicionados.push(f.id) });
  await servico.carregar();
  const ancora = caixa.createElement("span");
  const ligou = await servico.alternar({ id: "77", protocolo: "77/2026" }, ancora);
  checar("alternar adiciona na lista da unidade e avisa", ligou && (await repos.unidade.contem("77")) && servico.ativo("77") && adicionados.join() === "77");
  const desligou = !(await servico.alternar({ id: "77", protocolo: "77/2026" }, ancora));
  checar("alternar de novo remove", desligou && !(await repos.unidade.contem("77")) && !servico.ativo("77"));
  await repos.pessoal.adicionar({ id: "55", protocolo: "55/2026" });
  await servico.carregar();
  checar("estrela acesa se esta em qualquer das duas listas", servico.ativo("55"));
  await servico.alternar({ id: "55", protocolo: "55/2026" }, ancora);
  checar("apagar a estrela tira de qualquer lista", !(await repos.pessoal.contem("55")));
  const soPessoal = new ServicoFavoritosPagina({ unidade: null, pessoal: repos.pessoal });
  await soPessoal.alternar({ id: "88", protocolo: "88/2026" }, ancora);
  checar("sem unidade vai para a Pessoal", await repos.pessoal.contem("88"));

  secao("pagina: estrelas na caixa (Review Focus 5)");
  const servicoCaixa = new ServicoFavoritosPagina(repos);
  await servicoCaixa.carregar();
  const caixaUI = instalarEstrelasCaixa(caixa, servicoCaixa);
  const linhas = [...caixa.querySelectorAll("#tblProcessosRecebidos tr[id^='P'], #tblProcessosGerados tr[id^='P']")];
  const comEstrela = linhas.filter((tr) => tr.querySelectorAll("td")[1]?.querySelector(".spro-fav-estrela"));
  checar("toda linha da caixa ganha estrela na 2a coluna", linhas.length > 0 && comEstrela.length === linhas.length, [linhas.length, comEstrela.length]);
  const estrelaSigilosa = caixa.querySelector("tr#P157584 .spro-fav-estrela") as HTMLButtonElement;
  estrelaSigilosa.click();
  await tique();
  const favSig = await repos.unidade.obter("157584");
  checar(
    "linha sigilosa favorita sem especificacao e sem requisicao",
    favSig?.sigiloso === true && favSig.especificacao === undefined && favSig.protocolo === "034.00000265/2026-31",
    favSig,
  );
  caixaUI.atualizar();
  checar("a estrela acende", estrelaSigilosa.getAttribute("aria-pressed") === "true");
  const modelo = caixa.querySelector("tr#P157584")!;
  const nova = modelo.cloneNode(true) as Element;
  nova.id = "P999";
  nova.querySelector(".spro-fav-estrela")?.remove();
  nova.querySelector("input[type=checkbox]")?.setAttribute("value", "999");
  modelo.parentElement!.append(nova);
  caixaUI.atualizar();
  caixaUI.atualizar();
  checar("linha que chega depois ganha UMA estrela", nova.querySelectorAll(".spro-fav-estrela").length === 1);
  caixaUI.desligar();

  secao("pagina: estrelas em blocos, acompanhamento e sobrestados");
  const docLista = instalarDom(
    '<html><body><form id="frmRelBlocoProtocoloLista"><table class="infraTable"><tr><th>a</th></tr><tr><td></td><td></td><td><a class="protocoloNormal" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=4321&infra_hash=0">50300.000001/2026-01</a></td></tr></table></form></body></html>',
  );
  const linhaBloco = docLista.querySelectorAll("tr")[1]!;
  const dl = dadosDaLinhaLista(linhaBloco);
  checar("dados da linha do bloco", dl?.id === "4321" && dl.protocolo === "50300.000001/2026-01" && dl.sigiloso === false, dl);
  instalarEstrelasListas(docLista, servicoCaixa).atualizar();
  checar("estrela na 3a coluna", !!linhaBloco.querySelectorAll("td")[2]?.querySelector(".spro-fav-estrela"));

  secao("pagina: estrela na arvore");
  const urlArvore = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";
  const { doc: arvore } = telaSei("sei41/arvore.html");
  const da = dadosDaArvore(arvore, urlArvore);
  checar("dados do processo lidos da arvore ja carregada", da?.id === "148265" && !!da.protocolo && da.sigiloso === false, da);
  // O SEI desenha o nó do processo no #topmenu por JavaScript; aqui ele é montado à mão.
  const no = arvore.createElement("a");
  no.setAttribute("target", "ifrVisualizacao");
  no.textContent = da?.protocolo ?? "";
  arvore.querySelector("#topmenu")!.append(no);
  checar("estrela ao lado do numero", (await instalarEstrelaArvore(arvore, servicoCaixa, urlArvore)) && no.nextElementSibling?.classList.contains("spro-fav-estrela") === true);
  checar("nao duplica", !(await instalarEstrelaArvore(arvore, servicoCaixa, urlArvore)));
}
```

Em `verificar.ts`: `await verificarPagina();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (módulos de `src/pagina` ausentes).

- [ ] **Step 3: Implementar marca, contexto, esperar, estilo e estrela**

`favoritos/src/pagina/marca.ts`:
```ts
/**
 * Sinal para o legado: com este atributo no <html>, o `init.js` não carrega o
 * `sei-pro-favoritos.js`. O content script novo roda no document_start, então o
 * atributo existe antes do `$(document).ready` do legado. Só o manifest Lab traz
 * o content script novo; no pacote oficial nada muda até o lançamento.
 */
export const ATRIBUTO_ATIVO = "data-seipro-favoritos";

export function marcarAtivo(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_ATIVO, "1");
}
```

`favoritos/src/pagina/contexto.ts`:
```ts
import { lerContexto } from "@nucleo/sei";
import type { Pagina } from "@nucleo/sessao/http";
import type { ContextoAba } from "../modelo/tipos";

/** A tela que o usuário já tem aberta, no formato que o núcleo lê, sem requisição. */
export function paginaDe(doc: Document, url = doc.location?.href ?? "https://sei.invalido/sei/controlador.php"): Pagina {
  return {
    url,
    status: 200,
    get html() {
      return doc.documentElement.outerHTML;
    },
    doc,
  };
}

/** O cabeçalho (usuário, unidade) está na janela de topo; os iframes do SEI são da mesma origem. */
export function documentoTopo(): Document {
  try {
    return window.top?.document ?? document;
  } catch {
    return document;
  }
}

export function contextoDe(doc: Document, temaEscuro: boolean, url?: string): ContextoAba | null {
  const c = lerContexto(paginaDe(doc, url));
  if (!c.usuario.login) return null;
  return {
    host: c.host,
    login: c.usuario.login.toLowerCase(),
    nome: c.usuario.nome,
    unidade: c.unidade.id ? { id: c.unidade.id, sigla: c.unidade.sigla, nome: c.unidade.nome } : null,
    versao: c.versao,
    temaEscuro,
  };
}

/** Modo noturno do SEI Pro: o legado guarda no localStorage da origem do SEI. */
export function temaEscuroLegado(armazenamento: Pick<Storage, "getItem">): boolean {
  try {
    return !!armazenamento.getItem("darkModePro");
  } catch {
    return false;
  }
}
```

`favoritos/src/pagina/esperar.ts`:
```ts
/** Espera um elemento que o SEI desenha por JavaScript depois do carregamento (o topo da árvore). */
export function esperar<T>(achar: () => T | null | undefined, prazoMs: number, intervaloMs = 200): Promise<T | null> {
  const inicio = Date.now();
  return new Promise((ok) => {
    const tentar = () => {
      const v = achar();
      if (v) return ok(v);
      if (Date.now() - inicio >= prazoMs) return ok(null);
      setTimeout(tentar, intervaloMs);
    };
    tentar();
  });
}
```

`favoritos/src/pagina/estilo.ts`:
```ts
/**
 * CSS mínimo das estrelas, injetado uma vez por documento. As classes têm o
 * prefixo `spro-fav-` para não colidir com o SEI nem com o legado. Uma folha
 * nova em dist/css exigiria mexer nos manifests de todos os pacotes.
 */
const ID = "spro-fav-estilo";
const CSS = `.spro-fav-estrela{background:none;border:0;padding:0 3px;margin:0 2px;cursor:pointer;color:#8a8a8a;vertical-align:middle;line-height:0}
.spro-fav-estrela:hover{color:#5f5f5f}
.spro-fav-estrela[aria-pressed="true"]{color:#e0a100}
.spro-fav-estrela:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.spro-fav-titulo{display:flex!important;align-items:center;gap:6px}
.spro-fav-recolher{margin-left:auto;background:none;border:0;cursor:pointer;color:inherit;line-height:0;padding:2px}`;

export function instalarEstilo(doc: Document): void {
  if (doc.getElementById(ID)) return;
  const s = doc.createElement("style");
  s.id = ID;
  s.textContent = CSS;
  (doc.head ?? doc.documentElement).append(s);
}
```

`favoritos/src/pagina/estrela.ts`:
```ts
import { h, icone } from "@comum/ui/dom";

/** Botão de verdade (teclado, leitor de tela), no lugar do <i onclick> do legado. */
export function criarEstrela(ativo: boolean, aoClicar: (b: HTMLButtonElement) => void): HTMLButtonElement {
  const b = h("button", { type: "button", class: "spro-fav-estrela" });
  b.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    aoClicar(b);
  });
  atualizarEstrela(b, ativo);
  return b;
}

export function atualizarEstrela(b: HTMLButtonElement, ativo: boolean): void {
  if (b.getAttribute("aria-pressed") === String(ativo) && b.firstChild) return;
  const rotulo = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
  b.setAttribute("aria-pressed", String(ativo));
  b.setAttribute("aria-label", rotulo);
  b.title = rotulo;
  b.replaceChildren(icone(ativo ? "estrelaCheia" : "estrela", 16));
}
```

- [ ] **Step 4: Implementar o serviço e as estrelas**

`favoritos/src/pagina/servico.ts`:
```ts
/**
 * O que as estrelas da página precisam: saber se um processo é favorito (em
 * qualquer das duas listas) e alternar. Favoritar NÃO faz requisição ao SEI:
 * os dados vêm da tela. O legado abria um iframe oculto, esperava até 45 s e
 * desistia em silêncio (sugestão #1397), e abrir a árvore de processo da caixa
 * faz o SEI registrar o recebimento (arvore_montar.php:420).
 */

import type { DadosProcesso, Favorito } from "../modelo/tipos";
import type { RepositorioFavoritos } from "../repositorio";

export interface DepsServico {
  unidade: RepositorioFavoritos | null;
  pessoal: RepositorioFavoritos;
  aoAdicionar?: (f: Favorito, repo: RepositorioFavoritos, ancora: HTMLElement) => void;
}

export class ServicoFavoritosPagina {
  private ids = new Set<string>();
  private readonly ouvintes = new Set<() => void>();
  private agendado = false;

  constructor(private readonly d: DepsServico) {
    for (const r of [d.unidade, d.pessoal]) r?.aoMudar(() => this.agendarRecarga());
  }

  async carregar(): Promise<void> {
    const listas = await Promise.all([this.d.unidade ? this.d.unidade.ativos() : Promise.resolve([]), this.d.pessoal.ativos()]);
    this.ids = new Set(listas.flat().map((f) => f.id));
    this.avisar();
  }

  ativo(id: string): boolean {
    return this.ids.has(id);
  }

  aoMudar(cb: () => void): () => void {
    this.ouvintes.add(cb);
    return () => this.ouvintes.delete(cb);
  }

  async alternar(d: DadosProcesso, ancora: HTMLElement): Promise<boolean> {
    if (this.ids.has(d.id)) {
      await Promise.all([this.d.unidade?.remover([d.id]), this.d.pessoal.remover([d.id])]);
      this.ids.delete(d.id);
      this.avisar();
      return false;
    }
    const repo = this.d.unidade ?? this.d.pessoal;
    const f = await repo.adicionar(d);
    this.ids.add(d.id);
    this.avisar();
    this.d.aoAdicionar?.(f, repo, ancora);
    return true;
  }

  private avisar(): void {
    for (const o of [...this.ouvintes]) o();
  }

  /** Uma operação dispara vários avisos do storage (favorito, pasta...): recarrega uma vez só. */
  private agendarRecarga(): void {
    if (this.agendado) return;
    this.agendado = true;
    setTimeout(() => {
      this.agendado = false;
      void this.carregar();
    }, 30);
  }
}
```

`favoritos/src/pagina/estrelasCaixa.ts`:
```ts
/**
 * Estrela em cada linha do Controle de Processos (mesma coluna do legado, a
 * dos ícones), INCLUSIVE em processo não visualizado: favoritar não abre nada.
 * O MutationObserver cobre as linhas que a paginação infinita do legado
 * acrescenta depois.
 */

import { lerLinhaCaixa } from "@nucleo/dominio/caixa";
import type { DadosProcesso } from "../modelo/tipos";
import { atualizarEstrela, criarEstrela } from "./estrela";
import { instalarEstilo } from "./estilo";
import type { ServicoFavoritosPagina } from "./servico";

const LINHAS = "#tblProcessosRecebidos tr[id^='P'], #tblProcessosGerados tr[id^='P'], #tblProcessosDetalhado tr[id^='P']";

export function instalarEstrelasCaixa(doc: Document, servico: ServicoFavoritosPagina): { atualizar(): void; desligar(): void } {
  instalarEstilo(doc);
  const atualizar = () => {
    for (const tr of doc.querySelectorAll(LINHAS)) {
      const existente = tr.querySelector<HTMLButtonElement>(".spro-fav-estrela");
      if (existente) {
        atualizarEstrela(existente, servico.ativo(tr.id.slice(1)));
        continue;
      }
      const linha = lerLinhaCaixa(tr, tr.closest("#tblProcessosGerados") ? "gerados" : "recebidos");
      const td = tr.querySelectorAll("td")[1];
      if (!linha || !td || !linha.idProcedimento) continue;
      const dados: DadosProcesso = {
        id: linha.idProcedimento,
        protocolo: linha.protocolo,
        tipo: linha.tipo || undefined,
        especificacao: linha.especificacao || undefined,
        sigiloso: linha.sigiloso,
      };
      td.prepend(criarEstrela(servico.ativo(dados.id), (b) => void servico.alternar(dados, b)));
    }
  };
  let pendente = false;
  const observador =
    typeof MutationObserver === "function"
      ? new MutationObserver(() => {
          if (pendente) return;
          pendente = true;
          setTimeout(() => {
            pendente = false;
            atualizar();
          }, 50);
        })
      : null;
  const alvo = doc.querySelector("#frmProcedimentoControlar") ?? doc.body;
  if (observador && alvo) observador.observe(alvo, { childList: true, subtree: true });
  const pararServico = servico.aoMudar(atualizar);
  atualizar();
  return {
    atualizar,
    desligar() {
      observador?.disconnect();
      pararServico();
    },
  };
}
```

O `atualizar` usa `tr.id.slice(1)` para a estrela existente, e é por isso que a linha nova do teste troca o `id` da `tr`.

`favoritos/src/pagina/estrelasListas.ts`:
```ts
/** Blocos, Acompanhamento Especial e sobrestados: estrela na 3a coluna, como no legado (sei-pro-all.js). */

import { parametros } from "@nucleo/links/links";
import { textoDe } from "@nucleo/sessao/dom";
import type { DadosProcesso } from "../modelo/tipos";
import { atualizarEstrela, criarEstrela } from "./estrela";
import { instalarEstilo } from "./estilo";
import type { ServicoFavoritosPagina } from "./servico";

const TABELAS = "#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable";

export function dadosDaLinhaLista(tr: Element): DadosProcesso | null {
  const link = tr.querySelectorAll("td")[2]?.querySelector("a[href*='acao=procedimento_trabalhar']");
  if (!link) return null;
  const id = parametros(link.getAttribute("href") ?? "").get("id_procedimento");
  const protocolo = textoDe(link);
  if (!id || !protocolo) return null;
  return { id, protocolo, sigiloso: /Sigiloso/i.test(link.getAttribute("class") ?? "") };
}

export function instalarEstrelasListas(doc: Document, servico: ServicoFavoritosPagina): { atualizar(): void; desligar(): void } {
  instalarEstilo(doc);
  const atualizar = () => {
    for (const tabela of doc.querySelectorAll(TABELAS)) {
      for (const tr of tabela.querySelectorAll("tr")) {
        const dados = dadosDaLinhaLista(tr);
        const td = tr.querySelectorAll("td")[2];
        if (!dados || !td) continue;
        const existente = td.querySelector<HTMLButtonElement>(".spro-fav-estrela");
        if (existente) atualizarEstrela(existente, servico.ativo(dados.id));
        else td.prepend(criarEstrela(servico.ativo(dados.id), (b) => void servico.alternar(dados, b)));
      }
    }
  };
  const parar = servico.aoMudar(atualizar);
  atualizar();
  return { atualizar, desligar: parar };
}
```

`favoritos/src/pagina/estrelaArvore.ts`:
```ts
/**
 * Estrela no topo da árvore, ao lado do número. Os dados (id, protocolo, tipo,
 * nível) vêm dos literais `Nos[]` que a própria árvore já trouxe, lidos pelo
 * `lerArvore` do núcleo sobre a página aberta. Nenhuma requisição.
 */

import { lerArvore } from "@nucleo/dominio/arvore";
import type { DadosProcesso } from "../modelo/tipos";
import { paginaDe } from "./contexto";
import { atualizarEstrela, criarEstrela } from "./estrela";
import { esperar } from "./esperar";
import { instalarEstilo } from "./estilo";
import type { ServicoFavoritosPagina } from "./servico";

const NO_DO_PROCESSO = '#topmenu a[target="ifrVisualizacao"], #topmenu a[target="ifrConteudoVisualizacao"]';

export function dadosDaArvore(doc: Document, url: string): DadosProcesso | null {
  try {
    const a = lerArvore(paginaDe(doc, url));
    return { id: a.idProcedimento, protocolo: a.protocolo, tipo: a.tipo || undefined, sigiloso: a.nivel === "sigiloso" };
  } catch {
    return null;
  }
}

export async function instalarEstrelaArvore(doc: Document, servico: ServicoFavoritosPagina, url: string): Promise<boolean> {
  const dados = dadosDaArvore(doc, url);
  if (!dados) return false;
  const no = await esperar(() => doc.querySelector(NO_DO_PROCESSO), 10_000);
  if (!no || no.parentElement?.querySelector(".spro-fav-estrela")) return false;
  instalarEstilo(doc);
  const estrela = criarEstrela(servico.ativo(dados.id), (b) => void servico.alternar(dados, b));
  no.after(estrela);
  servico.aoMudar(() => atualizarEstrela(estrela, servico.ativo(dados.id)));
  return true;
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

Se "dados do processo lidos da arvore" falhar, imprima `lerArvore(paginaDe(arvore, urlArvore))` no teste. O `lerArvore` já é validado com essa mesma fixture em `sei-nucleo/tests`, então o erro mais provável é o `url` passado.

- [ ] **Step 6: Commit**

```bash
cd "$W"
git add favoritos/src/pagina favoritos/tests/verificar-pagina.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: estrelas na caixa, listas e arvore sem requisicao ao SEI

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 14: `favoritos/pagina` — balão ao favoritar (#651, #656)

**Files:**
- Create: `favoritos/src/pagina/balao.ts`
- Test: `favoritos/tests/verificar-balao.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `h` e `icone` (Tarefa 3); `MAX_NOTA` e os tipos (Tarefa 9).
- Produces:
  - `interface DepsBalao { favorito: Favorito; lista: TipoLista; siglaUnidade: string | null; pastas: Pasta[]; etiquetas: Etiqueta[]; temaEscuro: boolean; editar(m: MudancasFavorito): Promise<Favorito>; criarPasta(nome): Promise<Pasta>; criarEtiqueta(nome): Promise<Etiqueta>; moverPara(lista: TipoLista): Promise<void>; fechar(): void }`
  - `montarBalao(d: DepsBalao): HTMLElement`
  - `abrirBalao(ancora: HTMLElement, d: Omit<DepsBalao, "fechar">, cssBase: string): () => void`, em que `cssBase` é o texto de `base.css`, passado pelo `pagina/main.ts`

O balão não bloqueia nada: grava a cada mudança e fecha com Esc, com clique fora ou em "Pronto". Vive num Shadow DOM, para o CSS do SEI não o desfigurar.

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-balao.ts`:
```ts
import type { MudancasFavorito } from "../src/modelo/tipos";
import type { Etiqueta, Favorito, Pasta } from "../src/modelo/tipos";
import { type DepsBalao, montarBalao } from "../src/pagina/balao";
import { botao, checar, disparar, escolher, instalarDom, secao, tique } from "./util";

export async function verificarBalao(): Promise<void> {
  instalarDom();
  secao("balao ao favoritar");
  const fav: Favorito = { id: "1", protocolo: "1/2026", etiquetas: [], ordem: "a0", criadoEm: 1, atualizadoEm: 1, dispositivo: "D" };
  const pasta: Pasta = { id: "pA", nome: "Contratos", ordem: "a0", atualizadoEm: 1, dispositivo: "D" };
  const et: Etiqueta = { id: "eA", nome: "Urgente", cor: "#ffe0b2", atualizadoEm: 1, dispositivo: "D" };
  const chamadas: Array<[string, unknown]> = [];
  let fechou = 0;
  let atual = fav;
  const deps: DepsBalao = {
    favorito: fav,
    lista: "unidade",
    siglaUnidade: "GPF",
    pastas: [pasta],
    etiquetas: [et],
    temaEscuro: false,
    editar: async (m) => {
      chamadas.push(["editar", m]);
      atual = { ...atual, ...m } as Favorito;
      return atual;
    },
    criarPasta: async (nome) => {
      chamadas.push(["criarPasta", nome]);
      return { ...pasta, id: "pB", nome };
    },
    criarEtiqueta: async (nome) => {
      chamadas.push(["criarEtiqueta", nome]);
      return { ...et, id: "eB", nome };
    },
    moverPara: async (l) => {
      chamadas.push(["mover", l]);
    },
    fechar: () => {
      fechou += 1;
    },
  };
  const ultimaEdicao = () => [...chamadas].reverse().find((c) => c[0] === "editar")?.[1] as MudancasFavorito | undefined;
  const el = montarBalao(deps);

  escolher(el.querySelector("select")!, "pA");
  await tique();
  checar("trocar a pasta grava", ultimaEdicao()?.pasta === "pA", ultimaEdicao());
  escolher(el.querySelector("select")!, "");
  await tique();
  checar("sem pasta grava vazio", !!ultimaEdicao() && "pasta" in ultimaEdicao()! && ultimaEdicao()?.pasta === undefined);

  const nomePasta = el.querySelector('input[aria-label="Nova pasta"]') as HTMLInputElement;
  nomePasta.value = "Licitações";
  botao(el, "Criar")!.click();
  await tique();
  checar("nova pasta e criada e escolhida", chamadas.some((c) => c[0] === "criarPasta" && c[1] === "Licitações") && ultimaEdicao()?.pasta === "pB");

  botao(el, "Urgente")!.click();
  await tique();
  checar("marcar etiqueta grava a lista", JSON.stringify(ultimaEdicao()?.etiquetas) === JSON.stringify(["eA"]));
  const nomeEtiqueta = el.querySelector('input[aria-label="Nova etiqueta"]') as HTMLInputElement;
  nomeEtiqueta.value = "Diligência";
  botao(el, "Adicionar")!.click();
  await tique();
  checar("nova etiqueta e criada e marcada", JSON.stringify(ultimaEdicao()?.etiquetas) === JSON.stringify(["eA", "eB"]), ultimaEdicao());

  const nota = el.querySelector("textarea")!;
  nota.value = "ligar amanhã";
  disparar(nota, "change");
  await tique();
  checar("nota grava ao sair do campo", ultimaEdicao()?.nota === "ligar amanhã");

  botao(el, "Pessoal")!.click();
  await tique();
  checar("escolher a Pessoal move", chamadas.some((c) => c[0] === "mover" && c[1] === "pessoal"));
  botao(el, "Pronto")!.click();
  checar("Pronto fecha", fechou === 1);
  checar("sem unidade nao oferece a troca de lista", !botao(montarBalao({ ...deps, siglaUnidade: null }), "Pessoal"));
}
```

Em `verificar.ts`: `await verificarBalao();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (`../src/pagina/balao` ausente).

- [ ] **Step 3: Implementar**

`favoritos/src/pagina/balao.ts`:
```ts
/**
 * Cadastro rápido ao favoritar (sugestões #651 e #656): pasta, etiquetas, nota
 * e a escolha da lista, sem bloquear a tela. Cada mudança grava na hora.
 * Shadow DOM: o CSS do SEI (e o do legado) não alcança o balão.
 */

import { h, icone } from "@comum/ui/dom";
import { MAX_NOTA } from "../modelo/constantes";
import type { Etiqueta, Favorito, MudancasFavorito, Pasta, TipoLista } from "../modelo/tipos";

export interface DepsBalao {
  favorito: Favorito;
  lista: TipoLista;
  /** Sigla da unidade; null quando só existe a Pessoal. */
  siglaUnidade: string | null;
  pastas: Pasta[];
  etiquetas: Etiqueta[];
  temaEscuro: boolean;
  editar(m: MudancasFavorito): Promise<Favorito>;
  criarPasta(nome: string): Promise<Pasta>;
  criarEtiqueta(nome: string): Promise<Etiqueta>;
  /** Quem chama fecha este balão e abre outro, já na outra lista. */
  moverPara(lista: TipoLista): Promise<void>;
  fechar(): void;
}

const ESTILO_BALAO = `:host{all:initial}
.fav-balao{box-sizing:border-box;width:320px;display:grid;gap:6px;padding:10px 12px;font:13px/1.4 var(--spro-fonte);color:var(--spro-texto);background:var(--spro-fundo);border:1px solid var(--spro-borda);border-radius:10px;box-shadow:0 8px 24px rgb(0 0 0 / 18%)}
.fav-balao label{font-size:12px;color:var(--spro-suave)}
.fav-balao-topo{display:flex;align-items:center;gap:6px;color:var(--spro-estrela)}
.fav-balao-topo strong{color:var(--spro-texto);flex:1}
.fav-balao-linha,.fav-balao-chips,.fav-balao-listas{display:flex;flex-wrap:wrap;gap:6px}
.fav-balao-linha .spro-campo{flex:1}
.fav-balao-rodape{display:flex;justify-content:flex-end}
textarea.spro-campo{resize:vertical}`;

export function montarBalao(d: DepsBalao): HTMLElement {
  let fav = d.favorito;
  let etiquetas = [...d.etiquetas];
  const salvar = async (m: MudancasFavorito) => {
    fav = await d.editar(m);
  };

  const escolherLista = (rotulo: string, lista: TipoLista) =>
    h(
      "button",
      {
        type: "button",
        class: "spro-chip",
        "aria-pressed": String(d.lista === lista),
        onclick: () => {
          if (d.lista !== lista) void d.moverPara(lista);
        },
      },
      rotulo,
    );
  const listas = d.siglaUnidade
    ? h("div", { class: "fav-balao-listas", role: "group", "aria-label": "Lista" }, escolherLista(d.siglaUnidade, "unidade"), escolherLista("Pessoal", "pessoal"))
    : null;

  const pasta = h(
    "select",
    { class: "spro-campo", "aria-label": "Pasta", onchange: () => void salvar({ pasta: pasta.value || undefined }) },
    h("option", { value: "", selected: !fav.pasta }, "(sem pasta)"),
    ...d.pastas.map((p) => h("option", { value: p.id, selected: p.id === fav.pasta }, p.nome)),
  );
  const novaPasta = h("input", { class: "spro-campo", placeholder: "Nova pasta", "aria-label": "Nova pasta", maxlength: "60" });
  const criarPasta = h(
    "button",
    {
      type: "button",
      class: "spro-botao",
      onclick: async () => {
        const nome = novaPasta.value.trim();
        if (!nome) return;
        const p = await d.criarPasta(nome);
        for (const o of pasta.querySelectorAll("option")) o.removeAttribute("selected");
        pasta.append(h("option", { value: p.id, selected: true }, p.nome));
        novaPasta.value = "";
        await salvar({ pasta: p.id });
      },
    },
    "Criar",
  );

  const chips = h("div", { class: "fav-balao-chips" });
  const desenharChips = () =>
    chips.replaceChildren(
      ...etiquetas.map((e) =>
        h(
          "button",
          {
            type: "button",
            class: "spro-chip",
            style: `--cor:${e.cor}`,
            "aria-pressed": String(fav.etiquetas.includes(e.id)),
            onclick: async () => {
              const marcada = fav.etiquetas.includes(e.id);
              await salvar({ etiquetas: marcada ? fav.etiquetas.filter((x) => x !== e.id) : [...fav.etiquetas, e.id] });
              desenharChips();
            },
          },
          e.nome,
        ),
      ),
    );
  desenharChips();
  const novaEtiqueta = h("input", { class: "spro-campo", placeholder: "Nova etiqueta", "aria-label": "Nova etiqueta", maxlength: "40" });
  const criarEtiqueta = h(
    "button",
    {
      type: "button",
      class: "spro-botao",
      onclick: async () => {
        const nome = novaEtiqueta.value.trim();
        if (!nome) return;
        const e = await d.criarEtiqueta(nome);
        etiquetas = [...etiquetas.filter((x) => x.id !== e.id), e];
        novaEtiqueta.value = "";
        await salvar({ etiquetas: [...new Set([...fav.etiquetas, e.id])] });
        desenharChips();
      },
    },
    "Adicionar",
  );

  const nota = h("textarea", {
    class: "spro-campo",
    rows: "2",
    maxlength: String(MAX_NOTA),
    placeholder: "Nota pessoal",
    "aria-label": "Nota",
    value: fav.nota ?? "",
  });
  nota.addEventListener("change", () => void salvar({ nota: nota.value }));

  return h(
    "div",
    { class: "fav-balao", role: "dialog", "aria-label": `Favorito ${fav.protocolo}` },
    h(
      "div",
      { class: "fav-balao-topo" },
      icone("estrelaCheia", 16),
      h("strong", {}, "Favoritado"),
      listas,
      h("button", { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", onclick: () => d.fechar() }, icone("fechar", 14)),
    ),
    h("label", {}, "Pasta"),
    h("div", { class: "fav-balao-linha" }, pasta),
    h("div", { class: "fav-balao-linha" }, novaPasta, criarPasta),
    h("label", {}, "Etiquetas"),
    chips,
    h("div", { class: "fav-balao-linha" }, novaEtiqueta, criarEtiqueta),
    h("label", {}, "Nota"),
    nota,
    h("div", { class: "fav-balao-rodape" }, h("button", { type: "button", class: "spro-botao primario", onclick: () => d.fechar() }, "Pronto")),
  );
}

let aberto: (() => void) | null = null;

/**
 * `cssBase` é o texto de `sei-comum/src/ui/base.css`. Ele chega como parâmetro
 * porque só o `pagina/main.ts` importa `.css` (loader "text" do esbuild): assim
 * os testes, que rodam o código-fonte no tsx, nunca tropeçam num import de CSS.
 */
export function abrirBalao(ancora: HTMLElement, d: Omit<DepsBalao, "fechar">, cssBase: string): () => void {
  aberto?.();
  const doc = ancora.ownerDocument;
  const v = doc.defaultView;
  const host = doc.createElement("div");
  if (d.temaEscuro) host.setAttribute("data-tema", "escuro");
  const raiz: ParentNode = host.attachShadow({ mode: "open" });
  const estilo = doc.createElement("style");
  estilo.textContent = `${cssBase}\n${ESTILO_BALAO}`;
  const fora = (ev: Event) => {
    if (!ev.composedPath().includes(host)) fechar();
  };
  const tecla = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") fechar();
  };
  function fechar() {
    host.remove();
    doc.removeEventListener("pointerdown", fora, true);
    doc.removeEventListener("keydown", tecla, true);
    if (aberto === fechar) aberto = null;
  }
  const caixa = montarBalao({ ...d, fechar });
  raiz.append(estilo, caixa);
  const r = ancora.getBoundingClientRect();
  const esquerda = Math.max(8, Math.min(r.left, (v?.innerWidth ?? 1024) - 340)) + (v?.scrollX ?? 0);
  host.style.cssText = `position:absolute;z-index:2147483000;left:${Math.round(esquerda)}px;top:${Math.round(r.bottom + (v?.scrollY ?? 0) + 4)}px`;
  doc.body.append(host);
  doc.addEventListener("pointerdown", fora, true);
  doc.addEventListener("keydown", tecla, true);
  caixa.querySelector("select")?.focus();
  aberto = fechar;
  return fechar;
}
```

`tests/util` instala o linkedom como `document`. O `abrirBalao` (Shadow DOM e posição) não entra no teste de unidade: ele é conferido ao vivo na Tarefa 19.

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`. Nenhum arquivo de `src/` alcançado pelos testes pode importar `.css`; só o `pagina/main.ts` (Tarefa 15) importa.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add favoritos/src/pagina/balao.ts favoritos/tests/verificar-balao.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: balao de cadastro rapido ao favoritar (pasta, etiquetas, nota e lista)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 15: `favoritos/pagina` — painel embutido, abrir processo e operações da aba

**Files:**
- Create: `favoritos/src/pagina/abrir.ts`, `favoritos/src/pagina/painel.ts`, `favoritos/src/pagina/executor.ts`
- Test: `favoritos/tests/verificar-painel.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `h` e `icone` (Tarefa 3); `ErroRpc`, `Tratador`, `criarRpc` e `parDePortas` (Tarefa 7); `lerLegadoLocal` (Tarefa 12); `instalarEstilo` (Tarefa 13); `ContextoAba` (Tarefa 9).
- Produces:
  - `type Abertura = { tipo: "linha"; link: HTMLAnchorElement } | { tipo: "pesquisa"; form: HTMLFormElement; campo: HTMLInputElement }`
  - `localizarAbertura(doc, id): Abertura | null`
  - `abrirProcesso(doc, id, protocolo, novaAba): "linha" | "pesquisa"`
  - `ordemLegada(armazenamento): number | null`, `inserirNaOrdem(container, painel, ordem)`
  - `montarPainel(doc, o: { urlApp: string; recolhido: boolean; ordem: number | null; aoRecolher(r: boolean): void }): { painel; iframe; corpo } | null`
  - `tratadoresDaAba(d: { doc; ctx; iframe: HTMLIFrameElement | null; armazenamento; lerArquivo?: () => Promise<unknown | null> }): Record<string, Tratador>`, com as operações `contexto`, `altura` ({px}), `abrirProcesso` ({id, protocolo, novaAba}) e `lerLegado` (→ {local, arquivo})

O painel novo usa o mesmo `id="favoritesPro"` do legado, dentro do mesmo `#panelHomePro`. Assim a ordem que o usuário já escolheu entre os painéis (`optionsPro.orderPanelHome`, reordenada pelo `sortable` do legado) continua valendo.

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-painel.ts`:
```ts
import { parDePortas } from "@comum/ponte/parDePortas";
import { criarRpc } from "@comum/ponte/rpc";
import { abrirProcesso, localizarAbertura } from "../src/pagina/abrir";
import { tratadoresDaAba } from "../src/pagina/executor";
import { inserirNaOrdem, montarPainel, ordemLegada } from "../src/pagina/painel";
import { checar, instalarDom, lanca, secao, telaSei } from "./util";
import { CTX } from "./verificar-modelo";

export async function verificarPainel(): Promise<void> {
  secao("abrir processo sem montar link");
  const { doc: caixa } = telaSei("sei41/caixa.html");
  const pelaLinha = localizarAbertura(caixa, "157584");
  checar("processo da caixa abre pelo link da propria linha", pelaLinha?.tipo === "linha" && pelaLinha.link.getAttribute("href")?.includes("id_procedimento=157584") === true);
  checar("fora da caixa, pela pesquisa rapida", localizarAbertura(caixa, "1")?.tipo === "pesquisa");

  const doc = instalarDom(
    '<html><body><form id="frmProtocoloPesquisaRapida" target=""><input id="txtPesquisaRapida"></form><form id="frmProcedimentoControlar"></form></body></html>',
  );
  const form = doc.querySelector("form") as HTMLFormElement;
  let enviados = 0;
  let alvoNoEnvio = "";
  (form as unknown as { requestSubmit: () => void }).requestSubmit = () => {
    enviados += 1;
    alvoNoEnvio = form.getAttribute("target") ?? "";
  };
  checar("pesquisa rapida com o protocolo", abrirProcesso(doc, "9", "50300.000009/2026-09", false) === "pesquisa" && enviados === 1);
  checar("o numero vai no campo", (doc.querySelector("#txtPesquisaRapida") as HTMLInputElement).value === "50300.000009/2026-09");
  abrirProcesso(doc, "9", "50300.000009/2026-09", true);
  checar("nova aba usa target _blank e devolve o original", alvoNoEnvio === "_blank" && (form.getAttribute("target") ?? "") === "");
  const semPesquisa = instalarDom("<html><body></body></html>");
  checar("sem pesquisa rapida, erro claro", (await lanca(() => abrirProcesso(semPesquisa, "9", "x", false)))?.codigo === "SEM_PESQUISA");

  secao("painel embutido abaixo da lista");
  checar("ordem do legado lida do optionsPro", ordemLegada({ getItem: () => JSON.stringify({ orderPanelHome: [{ name: "favoritesPro", index: 3 }] }) }) === 3);
  checar("sem ordem guardada", ordemLegada({ getItem: () => null }) === null && ordemLegada({ getItem: () => "{x" }) === null);
  const docP = instalarDom('<html><body><form id="frmProcedimentoControlar"></form></body></html>');
  const recolhidos: boolean[] = [];
  const m = montarPainel(docP, { urlApp: "chrome-extension://abc/html/favoritos.html", recolhido: false, ordem: null, aoRecolher: (r) => recolhidos.push(r) });
  checar("cria #panelHomePro depois do formulario e o painel dentro", docP.querySelector("#frmProcedimentoControlar + #panelHomePro > #favoritesPro") !== null);
  checar("iframe do app com permissao de copiar", m?.iframe.getAttribute("src") === "chrome-extension://abc/html/favoritos.html" && m.iframe.getAttribute("allow") === "clipboard-write");
  (docP.querySelector(".spro-fav-recolher") as HTMLButtonElement).click();
  checar("recolher esconde e grava a preferencia", m?.corpo.hidden === true && recolhidos.join() === "true");
  checar("nao monta duas vezes", montarPainel(docP, { urlApp: "x", recolhido: false, ordem: null, aoRecolher: () => undefined }) === null);

  const docO = instalarDom('<html><body><div id="c"><div class="panelHomePro" id="a" data-order="1"></div><div class="panelHomePro" id="b" data-order="5"></div></div></body></html>');
  const novo = docO.createElement("div");
  novo.id = "n";
  inserirNaOrdem(docO.querySelector("#c")!, novo, 3);
  checar("entra na posicao da ordem salva", [...docO.querySelectorAll("#c > div")].map((d) => d.id).join() === "a,n,b");

  secao("operacoes que o app pede a aba");
  const docE = instalarDom('<html><body><table><tr id="P5"><td></td><td><a href="controlador.php?acao=procedimento_trabalhar&id_procedimento=5">5/2026</a></td></tr></table></body></html>');
  const iframe = docE.createElement("iframe");
  const loja = { getItem: (k: string) => (k === "configDataFavoritesPro" ? JSON.stringify({ favorites: [{ id_procedimento: "1", processo: "1/2026" }] }) : null) };
  const [ladoApp, ladoAba] = parDePortas();
  criarRpc(ladoAba, tratadoresDaAba({ doc: docE, ctx: CTX, iframe, armazenamento: loja }));
  const app = criarRpc(ladoApp);
  checar("contexto", (await app.chamar<typeof CTX>("contexto")).login === CTX.login);
  await app.chamar("altura", { px: 345.4 });
  checar("altura do iframe segue o conteudo", iframe.style.height === "345px", iframe.style.height);
  await app.chamar("altura", { px: 10 });
  checar("altura minima", iframe.style.height === "80px");
  checar("abre pela linha", (await app.chamar("abrirProcesso", { id: "5", protocolo: "5/2026" })) === "linha");
  const legado = await app.chamar<{ local: { favorites: unknown[] }; arquivo: unknown }>("lerLegado");
  checar("le os favoritos antigos do localStorage", legado.local.favorites.length === 1 && legado.arquivo === null);
}
```

Em `verificar.ts`: `await verificarPainel();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (módulos ausentes).

- [ ] **Step 3: Implementar**

`favoritos/src/pagina/abrir.ts`:
```ts
/**
 * Abrir um favorito SEM montar link. Montar a URL do SEI à mão derruba a
 * sessão (SEI 5), porque o `infra_hash` assina os parâmetros. Há dois caminhos
 * seguros: o link que a própria página já tem na linha da caixa, ou a pesquisa
 * rápida do cabeçalho, o mesmo que o usuário faria digitando o número.
 */

import { ErroRpc } from "@comum/ponte/rpc";

export type Abertura = { tipo: "linha"; link: HTMLAnchorElement } | { tipo: "pesquisa"; form: HTMLFormElement; campo: HTMLInputElement };

export function localizarAbertura(doc: Document, id: string): Abertura | null {
  const limpo = id.replace(/\D/g, "");
  const link = limpo ? doc.querySelector<HTMLAnchorElement>(`tr[id="P${limpo}"] a[href*="procedimento_trabalhar"]`) : null;
  if (link) return { tipo: "linha", link };
  const form = doc.querySelector<HTMLFormElement>("#frmProtocoloPesquisaRapida");
  const campo = doc.querySelector<HTMLInputElement>("#txtPesquisaRapida");
  return form && campo ? { tipo: "pesquisa", form, campo } : null;
}

export function abrirProcesso(doc: Document, id: string, protocolo: string, novaAba: boolean): "linha" | "pesquisa" {
  const a = localizarAbertura(doc, id);
  if (!a) throw new ErroRpc("SEM_PESQUISA", "Esta tela do SEI não tem a pesquisa rápida para abrir o processo.");
  if (a.tipo === "linha") {
    if (novaAba) doc.defaultView?.open(a.link.href, "_blank", "noopener");
    else a.link.click();
    return "linha";
  }
  const alvoAntes = a.form.getAttribute("target");
  a.campo.value = protocolo;
  if (novaAba) a.form.setAttribute("target", "_blank");
  try {
    if (typeof a.form.requestSubmit === "function") a.form.requestSubmit();
    else a.form.submit();
  } finally {
    if (alvoAntes === null) a.form.removeAttribute("target");
    else a.form.setAttribute("target", alvoAntes);
  }
  return "pesquisa";
}
```

`favoritos/src/pagina/painel.ts`:
```ts
/**
 * O painel "Favoritos" abaixo da lista do Controle de Processos. É um iframe
 * da própria extensão (html/favoritos.html), e não HTML injetado: o app roda
 * na origem da extensão (chrome.storage direto, CSS isolado do SEI) e é o
 * MESMO app do painel lateral da F2. Container e id são os do legado
 * (#panelHomePro, #favoritesPro), para valer a ordem entre painéis que o
 * usuário já escolheu.
 */

import { h, icone } from "@comum/ui/dom";
import { instalarEstilo } from "./estilo";

export function ordemLegada(armazenamento: Pick<Storage, "getItem">): number | null {
  try {
    const op = JSON.parse(armazenamento.getItem("optionsPro") ?? "{}") as { orderPanelHome?: unknown };
    if (!Array.isArray(op.orderPanelHome)) return null;
    const item = op.orderPanelHome.find((i) => (i as { name?: unknown })?.name === "favoritesPro") as { index?: unknown } | undefined;
    const n = Number(item?.index);
    return item && Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Mesma regra de `orderDivPanel` (sei-pro.js): antes do primeiro painel de ordem maior. */
export function inserirNaOrdem(container: Element, painel: Element, ordem: number | null): void {
  if (ordem !== null) {
    for (const outro of [...container.children]) {
      if (!outro.classList.contains("panelHomePro")) continue;
      const n = Number.parseInt(outro.getAttribute("data-order") ?? "", 10);
      if (Number.isFinite(n) && n > ordem) {
        outro.before(painel);
        return;
      }
    }
  }
  container.append(painel);
}

export interface OpcoesPainel {
  urlApp: string;
  recolhido: boolean;
  ordem: number | null;
  aoRecolher(recolhido: boolean): void;
}

export function montarPainel(doc: Document, o: OpcoesPainel): { painel: HTMLElement; iframe: HTMLIFrameElement; corpo: HTMLElement } | null {
  const form = doc.querySelector("#frmProcedimentoControlar");
  // #tblMarcadores: caixa filtrada por marcador, onde o legado também não punha painéis.
  if (!form || doc.querySelector("#tblMarcadores") || doc.querySelector("#favoritesPro")) return null;
  instalarEstilo(doc);
  let container = doc.querySelector("#panelHomePro");
  if (!container) {
    container = h("div", { id: "panelHomePro", style: "display: inline-block; width: 100%;" });
    form.after(container);
  }
  const iframe = h("iframe", {
    src: o.urlApp,
    title: "Favoritos do SEI Pro",
    allow: "clipboard-write",
    style: "width: 100%; height: 120px; border: 0; display: block;",
  });
  const corpo = h("div", { class: "spro-fav-corpo", hidden: o.recolhido }, iframe);
  const recolher = h("button", { type: "button", class: "spro-fav-recolher" });
  const pintar = () => {
    const fechado = corpo.hidden;
    const rotulo = fechado ? "Mostrar favoritos" : "Recolher favoritos";
    recolher.setAttribute("aria-expanded", String(!fechado));
    recolher.setAttribute("aria-label", rotulo);
    recolher.title = rotulo;
    recolher.replaceChildren(icone(fechado ? "expandir" : "recolher", 16));
  };
  recolher.addEventListener("click", () => {
    corpo.hidden = !corpo.hidden;
    pintar();
    o.aoRecolher(corpo.hidden);
  });
  pintar();
  const estrela = icone("estrelaCheia", 16);
  estrela.setAttribute("style", "color:#e0a100");
  const titulo = h("div", { class: "infraBarraLocalizacao titlePanelHome spro-fav-titulo" }, estrela, h("span", {}, "Favoritos"), recolher);
  const painel = h(
    "div",
    { class: "panelHomePro", id: "favoritesPro", "data-order": o.ordem === null ? "" : String(o.ordem), style: "display: inline-block; width: 100%;" },
    titulo,
    corpo,
  );
  inserirNaOrdem(container, painel, o.ordem);
  return { painel, iframe, corpo };
}
```

`favoritos/src/pagina/executor.ts`:
```ts
/**
 * O que o app (iframe ou, na F2, o painel lateral) pede à aba do SEI. Só o
 * content script tem a página: o cabeçalho (contexto), os links assinados e o
 * localStorage antigo. As operações são poucas e não escrevem nada no SEI.
 */

import type { Tratador } from "@comum/ponte/rpc";
import { lerLegadoLocal } from "../migracao/fontes";
import type { ContextoAba } from "../modelo/tipos";
import { abrirProcesso } from "./abrir";

export interface DepsExecutor {
  doc: Document;
  ctx: ContextoAba;
  iframe: HTMLIFrameElement | null;
  armazenamento: Pick<Storage, "getItem">;
  lerArquivo?: () => Promise<unknown | null>;
}

export function tratadoresDaAba(d: DepsExecutor): Record<string, Tratador> {
  return {
    contexto: () => d.ctx,
    altura: (args) => {
      const px = Number((args as { px?: unknown } | null)?.px);
      if (d.iframe && Number.isFinite(px)) d.iframe.style.height = `${Math.max(80, Math.min(Math.round(px), 20000))}px`;
      return true;
    },
    abrirProcesso: (args) => {
      const a = (args ?? {}) as { id?: unknown; protocolo?: unknown; novaAba?: unknown };
      return abrirProcesso(d.doc, String(a.id ?? ""), String(a.protocolo ?? ""), a.novaAba === true);
    },
    lerLegado: async () => ({ local: lerLegadoLocal(d.armazenamento), arquivo: d.lerArquivo ? await d.lerArquivo() : null }),
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

Se "fora da caixa, pela pesquisa rapida" falhar, confira se a fixture `caixa.html` tem `#frmProtocoloPesquisaRapida`; o núcleo já usa essa tela para `localizar`. Se não tiver, troque o caso por uma tela sintética.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add favoritos/src/pagina/abrir.ts favoritos/src/pagina/painel.ts favoritos/src/pagina/executor.ts favoritos/tests/verificar-painel.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: painel embutido abaixo da lista, abrir processo sem montar link e operacoes da aba

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 16: `favoritos/app` — item, lista, filtros, lote e CSV

**Files:**
- Create: `favoritos/src/app/csv.ts`, `favoritos/src/app/componentes/item.ts`, `favoritos/src/app/componentes/lista.ts`, `favoritos/src/app/componentes/filtros.ts`
- Test: `favoritos/tests/verificar-lista.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `h` e `icone` (Tarefa 3); `formatarData` (Tarefa 2); `corDoTexto`, `SEM_PASTA` e os tipos (Tarefa 9).
- Produces:
  - `gerarCsv(linhas: string[][]): string`, `linhasCsv(itens, apoio: { pastas; etiquetas; resumo; lista: string }): string[][]`
  - `interface ApoioItem { pastas: ReadonlyMap<string, Pasta>; etiquetas: ReadonlyMap<string, Etiqueta>; resumo?: ResumoPrazo; selecionado: boolean; arrastavel: boolean; outraLista: string | null }`
  - `interface AcoesItem { abrir(f, novaAba: boolean): void; editar(f): void; alternarSelecao(f, marcado: boolean): void; remover(f): void; moverLista(f): void; moverOrdem(f, direcao: -1 | 1): void }`
  - `renderItem(f, apoio, acoes): HTMLLIElement`
  - `vizinhosAoSoltar(ids, movido, alvo, depois): [string | null, string | null]`, `vizinhosAoMover(ids, id, direcao): [string | null, string | null] | null`
  - `interface OpcoesLista { itens; agrupar: boolean; pastas: Pasta[]; apoio(f): ApoioItem; acoes: AcoesItem; reordenar?(id, anteriorId, posteriorId): void; vazio: string }`, `renderLista(o): HTMLElement`
  - `interface AcoesFiltros { filtrar(f: Filtro): void; ordenar(m: ModoOrdem): void; agrupar(v: boolean): void; selecionarTodos(): void }`, `renderFiltros(e, a): HTMLElement`
  - `interface AcoesLote { moverPasta(id: string | undefined): void; etiquetar(id: string): void; copiar(): void; csv(): void; remover(): void; limpar(): void; outraLista: { rotulo: string; mover(): void } | null }`, `renderLote(qtd, pastas, etiquetas, a): HTMLElement`

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-lista.ts`:
```ts
import { gerarCsv, linhasCsv } from "../src/app/csv";
import { type AcoesItem, type ApoioItem, renderItem } from "../src/app/componentes/item";
import { renderLista, vizinhosAoMover, vizinhosAoSoltar } from "../src/app/componentes/lista";
import { renderFiltros, renderLote } from "../src/app/componentes/filtros";
import type { Etiqueta, Favorito, Pasta } from "../src/modelo/tipos";
import { botao, checar, disparar, escolher, instalarDom, secao } from "./util";

const fav = (x: Partial<Favorito> & { id: string }): Favorito => ({ protocolo: `${x.id}/2026`, etiquetas: [], ordem: `a${x.id}`, criadoEm: 1, atualizadoEm: 1, dispositivo: "D", ...x });

export function verificarLista(): void {
  instalarDom();
  const pasta: Pasta = { id: "p1", nome: "Contratos", ordem: "a0", atualizadoEm: 1, dispositivo: "D" };
  const et: Etiqueta = { id: "e1", nome: "Urgente", cor: "#ffe0b2", atualizadoEm: 1, dispositivo: "D" };
  const removida: Etiqueta = { ...et, id: "e2", nome: "Velha", removidoEm: 5 };
  const pastas = new Map([[pasta.id, pasta]]);
  const etiquetas = new Map([
    [et.id, et],
    [removida.id, removida],
  ]);
  const feito: string[] = [];
  const acoes: AcoesItem = {
    abrir: (f, nova) => feito.push(`abrir:${f.id}:${nova}`),
    editar: (f) => feito.push(`editar:${f.id}`),
    alternarSelecao: (f, m) => feito.push(`sel:${f.id}:${m}`),
    remover: (f) => feito.push(`remover:${f.id}`),
    moverLista: (f) => feito.push(`lista:${f.id}`),
    moverOrdem: (f, d) => feito.push(`ordem:${f.id}:${d}`),
  };
  const apoio = (x: Partial<ApoioItem> = {}): ApoioItem => ({ pastas, etiquetas, selecionado: false, arrastavel: false, outraLista: "Pessoal", ...x });

  secao("app: item");
  const f1 = fav({ id: "1", protocolo: "50300.000001/2026-01", tipo: "Fiscalização", especificacao: "Porto", pasta: "p1", etiquetas: ["e1", "e2"], nota: "ligar" });
  const li = renderItem(f1, apoio({ resumo: { situacao: "atrasado", texto: "2 dias de atraso", dica: "d", ordem: -2 } }), acoes);
  checar("protocolo e titulo pelo tipo e especificacao", li.querySelector(".fav-protocolo")?.textContent === "50300.000001/2026-01" && li.querySelector(".fav-titulo")?.textContent === "Fiscalização · Porto");
  checar("pasta e so as etiquetas vivas", li.querySelector(".fav-pasta")?.textContent === "Contratos" && li.querySelectorAll(".fav-etiqueta").length === 1);
  checar("prazo com a classe da situacao", li.querySelector(".fav-prazo-atrasado")?.textContent === "2 dias de atraso");
  checar("nota indicada com o texto no title", li.querySelector(".fav-nota")?.getAttribute("title") === "ligar");
  (li.querySelector(".fav-protocolo") as HTMLElement).click();
  (li.querySelector(".fav-titulo") as HTMLElement).click();
  const sel = li.querySelector("input.fav-sel") as HTMLInputElement;
  // No linkedom, `checked` não reflete o atributo: marca-se como o navegador faz.
  sel.checked = true;
  disparar(sel, "change");
  botao(li, "Mover para Pessoal")!.click();
  botao(li, "Mover para cima")!.click();
  botao(li, "Remover")!.click();
  checar("acoes do item", feito.join() === "abrir:1:false,editar:1,sel:1:true,lista:1,ordem:1:-1,remover:1", feito);
  checar("titulo do usuario vence e sem descricao ha aviso", renderItem(fav({ id: "2", titulo: "Meu" }), apoio(), acoes).querySelector(".fav-titulo")?.textContent === "Meu" && renderItem(fav({ id: "3" }), apoio(), acoes).querySelector(".fav-titulo")?.textContent === "(sem descrição)");
  checar("sem outra lista nao oferece mover", !botao(renderItem(fav({ id: "4" }), apoio({ outraLista: null }), acoes), "Mover para Pessoal"));
  checar("sigiloso sinalizado", renderItem(fav({ id: "5", sigiloso: true }), apoio(), acoes).querySelector(".fav-selo")?.textContent === "sigiloso");

  secao("app: lista");
  checar("vazia mostra o convite", renderLista({ itens: [], agrupar: false, pastas: [], apoio: () => apoio(), acoes, vazio: "Nada aqui" }).textContent === "Nada aqui");
  const itens = [fav({ id: "1", pasta: "p1" }), fav({ id: "2" }), fav({ id: "3", pasta: "p1" })];
  const grupos = renderLista({ itens, agrupar: true, pastas: [pasta], apoio: () => apoio(), acoes, vazio: "" });
  checar("agrupada: pasta primeiro, sem pasta por ultimo, com contagem", [...grupos.querySelectorAll("h3")].map((x) => x.textContent).join("|") === "Contratos (2)|Sem pasta (1)");
  const arrastavel = renderLista({ itens, agrupar: false, pastas: [], apoio: () => apoio({ arrastavel: true }), acoes, reordenar: () => undefined, vazio: "" });
  checar("modo manual: itens arrastaveis", arrastavel.querySelectorAll('li[draggable="true"]').length === 3);
  const ids = ["a", "b", "c", "d"];
  checar("soltar antes de c", JSON.stringify(vizinhosAoSoltar(ids, "a", "c", false)) === JSON.stringify(["b", "c"]));
  checar("soltar depois de d", JSON.stringify(vizinhosAoSoltar(ids, "a", "d", true)) === JSON.stringify(["d", null]));
  checar("mover para cima", JSON.stringify(vizinhosAoMover(ids, "c", -1)) === JSON.stringify(["a", "b"]));
  checar("mover o primeiro para cima nao faz nada", vizinhosAoMover(ids, "a", -1) === null);
  checar("mover para baixo", JSON.stringify(vizinhosAoMover(ids, "b", 1)) === JSON.stringify(["c", "d"]));

  secao("app: filtros e lote");
  const pedidos: string[] = [];
  const filtros = renderFiltros(
    { filtro: {}, ordem: "manual", agrupar: false, pastas: [pasta], etiquetas: [et] },
    { filtrar: (f) => pedidos.push(`f:${JSON.stringify(f)}`), ordenar: (m) => pedidos.push(`o:${m}`), agrupar: (v) => pedidos.push(`g:${v}`), selecionarTodos: () => pedidos.push("todos") },
  );
  escolher(filtros.querySelector('select[aria-label="Pasta"]') as HTMLSelectElement, "p1");
  escolher(filtros.querySelector('select[aria-label="Ordem"]') as HTMLSelectElement, "prazo");
  const agrupar = filtros.querySelector('input[type="checkbox"]') as HTMLInputElement;
  agrupar.checked = true;
  disparar(agrupar, "change");
  botao(filtros, "Selecionar todos")!.click();
  checar("filtros pedem o que o usuario escolheu", pedidos.join() === 'f:{"pasta":"p1"},o:prazo,g:true,todos', pedidos);
  const lote: string[] = [];
  const barra = renderLote(2, [pasta], [et], {
    moverPasta: (id) => lote.push(`p:${id}`),
    etiquetar: (id) => lote.push(`e:${id}`),
    copiar: () => lote.push("copiar"),
    csv: () => lote.push("csv"),
    remover: () => lote.push("remover"),
    limpar: () => lote.push("limpar"),
    outraLista: { rotulo: "Pessoal", mover: () => lote.push("lista") },
  });
  checar("contagem", barra.textContent?.includes("2 selecionados") === true);
  escolher(barra.querySelector('select[aria-label="Mover para pasta"]') as HTMLSelectElement, "__sem__");
  escolher(barra.querySelector('select[aria-label="Etiquetar"]') as HTMLSelectElement, "e1");
  for (const r of ["Mover para Pessoal", "Copiar números", "Baixar CSV", "Remover selecionados", "Limpar seleção"]) botao(barra, r)!.click();
  checar("acoes em lote", lote.join() === "p:undefined,e:e1,lista,copiar,csv,remover,limpar", lote);

  secao("app: CSV");
  const csv = gerarCsv([
    ["Processo", "Nota"],
    ["1/2026", 'disse "ok"; depois'],
    ["2/2026", "=HYPERLINK(1)"],
  ]);
  checar("BOM, separador ; e aspas escapadas", csv.startsWith("﻿Processo;Nota\r\n") && csv.includes('"disse ""ok""; depois"'));
  checar("celula que parece formula e neutralizada", csv.includes("'=HYPERLINK(1)"));
  const linhas = linhasCsv([f1], { pastas, etiquetas, resumo: () => undefined, lista: "GPF" });
  checar("linhas do CSV", linhas.length === 2 && linhas[1]?.[4] === "Contratos" && linhas[1]?.[5] === "Urgente" && linhas[1]?.[9] === "GPF", linhas);
}
```

Em `verificar.ts`: `verificarLista();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL.

- [ ] **Step 3: Implementar `csv.ts` e `item.ts`**

`favoritos/src/app/csv.ts`:
```ts
/**
 * CSV para planilha brasileira: separador ";", BOM para o Excel ler UTF-8 e
 * aspas quando preciso. Célula que começa com = + - @ é neutralizada com
 * apóstrofo: uma nota digitada como fórmula não pode virar fórmula na planilha.
 */

import { formatarData } from "@comum/datas/dias";
import type { Etiqueta, Favorito, Pasta, ResumoPrazo } from "../modelo/tipos";

export function gerarCsv(linhas: string[][]): string {
  const campo = (bruto: string) => {
    const v = /^[=+\-@\t\r]/.test(bruto) ? `'${bruto}` : bruto;
    return /[;"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };
  return `﻿${linhas.map((l) => l.map(campo).join(";")).join("\r\n")}`;
}

export interface ApoioCsv {
  pastas: ReadonlyMap<string, Pasta>;
  etiquetas: ReadonlyMap<string, Etiqueta>;
  resumo: (f: Favorito) => ResumoPrazo | undefined;
  lista: string;
}

export function linhasCsv(itens: Favorito[], a: ApoioCsv): string[][] {
  const cabecalho = ["Processo", "Título", "Tipo", "Especificação", "Pasta", "Etiquetas", "Prazo", "Vencimento", "Nota", "Lista"];
  return [
    cabecalho,
    ...itens.map((f) => {
      const r = a.resumo(f);
      return [
        f.protocolo,
        f.titulo ?? "",
        f.tipo ?? "",
        f.especificacao ?? "",
        (f.pasta && a.pastas.get(f.pasta)?.nome) || "",
        f.etiquetas
          .map((id) => a.etiquetas.get(id))
          .filter((e): e is Etiqueta => !!e && e.removidoEm === undefined)
          .map((e) => e.nome)
          .join(", "),
        r?.texto ?? "",
        r?.vencimento ? formatarData(r.vencimento) : "",
        f.nota ?? "",
        a.lista,
      ];
    }),
  ];
}
```

`favoritos/src/app/componentes/item.ts`:
```ts
import { h, icone } from "@comum/ui/dom";
import { corDoTexto } from "../../modelo/cores";
import type { Etiqueta, Favorito, Pasta, ResumoPrazo } from "../../modelo/tipos";

export interface ApoioItem {
  pastas: ReadonlyMap<string, Pasta>;
  etiquetas: ReadonlyMap<string, Etiqueta>;
  resumo?: ResumoPrazo;
  selecionado: boolean;
  arrastavel: boolean;
  /** Rótulo da outra lista ("Pessoal" ou a sigla), ou null quando só existe uma. */
  outraLista: string | null;
}

export interface AcoesItem {
  abrir(f: Favorito, novaAba: boolean): void;
  editar(f: Favorito): void;
  alternarSelecao(f: Favorito, marcado: boolean): void;
  remover(f: Favorito): void;
  moverLista(f: Favorito): void;
  moverOrdem(f: Favorito, direcao: -1 | 1): void;
}

const itemMenu = (rotulo: string, fazer: () => void, classe?: string) =>
  h(
    "button",
    {
      type: "button",
      role: "menuitem",
      class: classe,
      onclick: (ev) => {
        (ev.currentTarget as HTMLElement | null)?.closest("details")?.removeAttribute("open");
        fazer();
      },
    },
    rotulo,
  );

export function renderItem(f: Favorito, a: ApoioItem, acoes: AcoesItem): HTMLLIElement {
  const titulo = f.titulo || [f.tipo, f.especificacao].filter(Boolean).join(" · ") || "(sem descrição)";
  const pasta = f.pasta ? a.pastas.get(f.pasta) : undefined;
  const etiquetas = f.etiquetas.map((id) => a.etiquetas.get(id)).filter((e): e is Etiqueta => !!e && e.removidoEm === undefined);
  return h(
    "li",
    { class: "fav-item", "data-id": f.id, draggable: a.arrastavel ? "true" : undefined },
    h("input", {
      type: "checkbox",
      class: "fav-sel",
      "aria-label": `Selecionar ${f.protocolo}`,
      checked: a.selecionado,
      onchange: (ev) => acoes.alternarSelecao(f, (ev.target as HTMLInputElement).checked),
    }),
    a.arrastavel ? h("span", { class: "fav-alca", title: "Arraste para reordenar", "aria-hidden": "true" }, icone("alca", 14)) : h("span"),
    h(
      "div",
      { class: "fav-principal" },
      h(
        "a",
        {
          class: "fav-protocolo",
          href: "#",
          title: "Abrir o processo (Ctrl+clique abre em outra aba)",
          onclick: (ev) => {
            ev.preventDefault();
            const m = ev as MouseEvent;
            acoes.abrir(f, !!(m.ctrlKey || m.metaKey));
          },
        },
        f.protocolo,
      ),
      f.sigiloso ? h("span", { class: "fav-selo", title: "Processo sigiloso" }, "sigiloso") : null,
      h("button", { type: "button", class: "fav-titulo", title: "Editar favorito", onclick: () => acoes.editar(f) }, titulo),
    ),
    h(
      "div",
      { class: "fav-meta" },
      pasta ? h("span", { class: "fav-pasta" }, icone("pasta", 13), pasta.nome) : null,
      ...etiquetas.map((e) => h("span", { class: "fav-etiqueta", style: `--cor:${e.cor};--cor-texto:${corDoTexto(e.cor)}` }, e.nome)),
      a.resumo ? h("span", { class: `fav-prazo fav-prazo-${a.resumo.situacao}`, title: a.resumo.dica }, icone("relogio", 13), a.resumo.texto) : null,
      f.nota ? h("span", { class: "fav-nota", title: f.nota, "aria-label": `Nota: ${f.nota}` }, icone("nota", 14)) : null,
    ),
    h(
      "details",
      { class: "fav-menu" },
      h("summary", { title: "Mais ações", "aria-label": `Mais ações para ${f.protocolo}` }, icone("menu", 16)),
      h(
        "div",
        { class: "fav-menu-lista", role: "menu" },
        itemMenu("Editar", () => acoes.editar(f)),
        a.outraLista ? itemMenu(`Mover para ${a.outraLista}`, () => acoes.moverLista(f)) : null,
        itemMenu("Mover para cima", () => acoes.moverOrdem(f, -1)),
        itemMenu("Mover para baixo", () => acoes.moverOrdem(f, 1)),
        itemMenu("Remover", () => acoes.remover(f), "perigo"),
      ),
    ),
  );
}
```

- [ ] **Step 4: Implementar `lista.ts` e `filtros.ts`**

`favoritos/src/app/componentes/lista.ts`:
```ts
import { h } from "@comum/ui/dom";
import { SEM_PASTA } from "../../modelo/constantes";
import type { Favorito, Pasta } from "../../modelo/tipos";
import { type AcoesItem, type ApoioItem, renderItem } from "./item";

/** Vizinhos (anterior, posterior) de onde o item foi solto, já sem ele mesmo na lista. */
export function vizinhosAoSoltar(ids: string[], movido: string, alvo: string, depois: boolean): [string | null, string | null] {
  const resto = ids.filter((id) => id !== movido);
  const i = resto.indexOf(alvo);
  if (i < 0) return [resto[resto.length - 1] ?? null, null];
  return depois ? [alvo, resto[i + 1] ?? null] : [resto[i - 1] ?? null, alvo];
}

/** Para "Mover para cima/baixo" (teclado e menu): null quando já está na ponta. */
export function vizinhosAoMover(ids: string[], id: string, direcao: -1 | 1): [string | null, string | null] | null {
  const i = ids.indexOf(id);
  if (i < 0) return null;
  if (direcao < 0) return i === 0 ? null : [ids[i - 2] ?? null, ids[i - 1] ?? null];
  return i === ids.length - 1 ? null : [ids[i + 1] ?? null, ids[i + 2] ?? null];
}

export interface OpcoesLista {
  itens: Favorito[];
  agrupar: boolean;
  pastas: Pasta[];
  apoio: (f: Favorito) => ApoioItem;
  acoes: AcoesItem;
  reordenar?: (id: string, anteriorId: string | null, posteriorId: string | null) => void;
  vazio: string;
}

export function renderLista(o: OpcoesLista): HTMLElement {
  if (!o.itens.length) return h("p", { class: "fav-vazio" }, o.vazio);
  if (!o.agrupar) return listaSimples(o.itens, o);
  const grupos = new Map<string, Favorito[]>();
  for (const f of o.itens) {
    const chave = f.pasta && o.pastas.some((p) => p.id === f.pasta) ? f.pasta : SEM_PASTA;
    grupos.set(chave, [...(grupos.get(chave) ?? []), f]);
  }
  const secoes = [...o.pastas.map((p) => [p.id, p.nome] as const), [SEM_PASTA, "Sem pasta"] as const]
    .filter(([id]) => grupos.has(id))
    .map(([id, nome]) => {
      const lista = grupos.get(id) ?? [];
      return h("section", { class: "fav-grupo" }, h("h3", {}, `${nome} (${lista.length})`), listaSimples(lista, { ...o, reordenar: undefined }));
    });
  return h("div", {}, ...secoes);
}

function listaSimples(itens: Favorito[], o: OpcoesLista): HTMLElement {
  const ul = h("ul", { class: "fav-lista" }, ...itens.map((f) => renderItem(f, o.apoio(f), o.acoes)));
  if (o.reordenar) ativarArrasto(ul, itens.map((f) => f.id), o.reordenar);
  return ul;
}

function ativarArrasto(ul: HTMLElement, ids: string[], reordenar: NonNullable<OpcoesLista["reordenar"]>): void {
  let movido: string | null = null;
  const item = (ev: Event) => (ev.target as Element | null)?.closest?.("li.fav-item") as HTMLElement | null;
  const depoisDe = (ev: DragEvent, li: HTMLElement) => {
    const r = li.getBoundingClientRect();
    return ev.clientY > r.top + r.height / 2;
  };
  const limparMarcas = () => {
    for (const el of ul.querySelectorAll(".alvo-antes, .alvo-depois")) el.classList.remove("alvo-antes", "alvo-depois");
  };
  ul.addEventListener("dragstart", (ev) => {
    const li = item(ev);
    movido = li?.dataset.id ?? null;
    li?.classList.add("arrastando");
    (ev as DragEvent).dataTransfer?.setData("text/plain", movido ?? "");
  });
  ul.addEventListener("dragover", (ev) => {
    const li = item(ev);
    if (!movido || !li) return;
    ev.preventDefault();
    limparMarcas();
    li.classList.add(depoisDe(ev as DragEvent, li) ? "alvo-depois" : "alvo-antes");
  });
  ul.addEventListener("drop", (ev) => {
    ev.preventDefault();
    const li = item(ev);
    const alvo = li?.dataset.id;
    limparMarcas();
    if (!movido || !li || !alvo || alvo === movido) return;
    const [antes, depois] = vizinhosAoSoltar(ids, movido, alvo, depoisDe(ev as DragEvent, li));
    reordenar(movido, antes, depois);
  });
  ul.addEventListener("dragend", () => {
    movido = null;
    limparMarcas();
    ul.querySelector(".arrastando")?.classList.remove("arrastando");
  });
}
```

`favoritos/src/app/componentes/filtros.ts`:
```ts
import { h, icone, type NomeIcone } from "@comum/ui/dom";
import { SEM_PASTA } from "../../modelo/constantes";
import type { Etiqueta, Filtro, ModoOrdem, Pasta } from "../../modelo/tipos";

type Opcao = readonly [valor: string, texto: string];

function seletor(rotulo: string, valor: string, opcoes: Opcao[], mudar: (v: string) => void): HTMLSelectElement {
  const s: HTMLSelectElement = h(
    "select",
    { class: "spro-campo", "aria-label": rotulo, onchange: () => mudar(s.value ?? "") },
    ...opcoes.map(([v, t]) => h("option", { value: v, selected: v === valor }, t)),
  );
  return s;
}

export interface AcoesFiltros {
  filtrar(f: Filtro): void;
  ordenar(m: ModoOrdem): void;
  agrupar(v: boolean): void;
  selecionarTodos(): void;
}

export function renderFiltros(
  e: { filtro: Filtro; ordem: ModoOrdem; agrupar: boolean; pastas: Pasta[]; etiquetas: Etiqueta[] },
  a: AcoesFiltros,
): HTMLElement {
  return h(
    "div",
    { class: "fav-filtros" },
    seletor("Pasta", e.filtro.pasta ?? "", [["", "Todas as pastas"], [SEM_PASTA, "Sem pasta"], ...e.pastas.map((p) => [p.id, p.nome] as const)], (v) =>
      a.filtrar({ ...e.filtro, pasta: v || undefined }),
    ),
    seletor("Etiqueta", e.filtro.etiqueta ?? "", [["", "Todas as etiquetas"], ...e.etiquetas.map((x) => [x.id, x.nome] as const)], (v) =>
      a.filtrar({ ...e.filtro, etiqueta: v || undefined }),
    ),
    seletor(
      "Prazo",
      e.filtro.prazo ?? "",
      [
        ["", "Qualquer prazo"],
        ["atrasado", "Atrasados"],
        ["hoje", "Vencem hoje"],
        ["noPrazo", "No prazo"],
        ["semPrazo", "Sem prazo"],
      ],
      (v) => a.filtrar({ ...e.filtro, prazo: (v || undefined) as Filtro["prazo"] }),
    ),
    seletor(
      "Ordem",
      e.ordem,
      [
        ["manual", "Minha ordem"],
        ["prazo", "Por prazo"],
        ["protocolo", "Por número"],
        ["inclusao", "Mais recentes"],
      ],
      (v) => a.ordenar(v as ModoOrdem),
    ),
    h(
      "label",
      { class: "fav-agrupar" },
      h("input", { type: "checkbox", checked: e.agrupar, onchange: (ev) => a.agrupar((ev.target as HTMLInputElement).checked) }),
      "Agrupar por pasta",
    ),
    h("button", { type: "button", class: "spro-botao", onclick: () => a.selecionarTodos() }, "Selecionar todos"),
  );
}

export interface AcoesLote {
  moverPasta(id: string | undefined): void;
  etiquetar(id: string): void;
  copiar(): void;
  csv(): void;
  remover(): void;
  limpar(): void;
  outraLista: { rotulo: string; mover(): void } | null;
}

const botaoIcone = (nome: NomeIcone, rotulo: string, fazer: () => void, classe = "") =>
  h("button", { type: "button", class: `spro-botao ${classe}`.trim(), "aria-label": rotulo, title: rotulo, onclick: fazer }, icone(nome, 15), rotulo);

export function renderLote(qtd: number, pastas: Pasta[], etiquetas: Etiqueta[], a: AcoesLote): HTMLElement {
  // Select de ação: escolher dispara e o campo volta ao rótulo.
  const acao = (rotulo: string, opcoes: Opcao[], fazer: (v: string) => void) => seletor(rotulo, "", [["", `${rotulo}…`], ...opcoes], (v) => v && fazer(v));
  return h(
    "div",
    { class: "fav-lote", role: "toolbar", "aria-label": "Ações nos selecionados" },
    h("strong", {}, `${qtd} selecionado${qtd === 1 ? "" : "s"}`),
    acao("Mover para pasta", [[SEM_PASTA, "(sem pasta)"], ...pastas.map((p) => [p.id, p.nome] as const)], (v) => a.moverPasta(v === SEM_PASTA ? undefined : v)),
    acao(
      "Etiquetar",
      etiquetas.map((e) => [e.id, e.nome] as const),
      (v) => a.etiquetar(v),
    ),
    a.outraLista ? h("button", { type: "button", class: "spro-botao", onclick: () => a.outraLista?.mover() }, `Mover para ${a.outraLista.rotulo}`) : null,
    botaoIcone("copiar", "Copiar números", () => a.copiar()),
    botaoIcone("baixar", "Baixar CSV", () => a.csv()),
    botaoIcone("lixeira", "Remover selecionados", () => a.remover(), "perigo"),
    h("button", { type: "button", class: "spro-botao", onclick: () => a.limpar() }, "Limpar seleção"),
  );
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

O `botao()` dos testes procura pelo texto **ou** pelo `aria-label`. Os botões com ícone têm os dois iguais de propósito.

- [ ] **Step 6: Commit**

```bash
cd "$W"
git add favoritos/src/app/csv.ts favoritos/src/app/componentes/item.ts favoritos/src/app/componentes/lista.ts favoritos/src/app/componentes/filtros.ts favoritos/tests/verificar-lista.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: item, lista com arraste, filtros, acoes em lote e CSV seguro

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 17: `favoritos/app` — editor, gerenciar, lixeira, migração e arquivo

**Files:**
- Create: `favoritos/src/app/prazoForm.ts`, `favoritos/src/app/componentes/editor.ts`, `favoritos/src/app/componentes/gerenciar.ts`, `favoritos/src/app/componentes/lixeira.ts`, `favoritos/src/app/componentes/migracao.ts`, `favoritos/src/arquivo.ts`
- Test: `favoritos/tests/verificar-dialogos.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: `calcularPrazo` (Tarefa 10); `RepositorioFavoritos` (Tarefa 11); `Area` e `areaMemoria` (Tarefa 4); `h` e `icone` (Tarefa 3); os tipos.
- Produces:
  - `type ModoPrazo = "nenhum" | "data" | "dias" | "contagem"`
  - `interface ValoresPrazo { modo; referencia: DataISO; vencimento: DataISO; n: number; contagem: "corridos" | "uteis"; sentido: "depois" | "antes" }`
  - `valoresDoPrazo(p, hoje): ValoresPrazo`, `prazoDosValores(v): Prazo | undefined`
  - `interface DepsEditor { favorito; pastas; etiquetas; hoje: DataISO; salvar(m: MudancasFavorito): Promise<void>; criarPasta(nome): Promise<Pasta>; criarEtiqueta(nome): Promise<Etiqueta>; fechar(): void }`, `montarEditor(d): HTMLElement`
  - `interface DepsGerenciar { listar(): Promise<{ pastas: Pasta[]; etiquetas: Etiqueta[] }>; criarPasta(nome); editarPasta(id, m); removerPasta(id); criarEtiqueta(nome); editarEtiqueta(id, m); removerEtiqueta(id); confirmar(texto): Promise<boolean> }`, `montarGerenciar(d): Promise<HTMLElement>`
  - `naLixeira(itens, agora): Favorito[]`, `montarLixeira(itens, agora, d: { restaurar(id): Promise<void>; voltar(): void }): HTMLElement`
  - `interface DepsMigracao { quantidade: number; amostra: string[]; siglaUnidade: string | null; trazer(destino: TipoLista): Promise<void>; adiar(): Promise<void> }`, `montarMigracao(d): HTMLElement`
  - `interface Envelope { formato: "seipro-favoritos"; versao: 1; escopos: EscopoExportado[]; gravadoEm: number; dispositivo: string; revisao: number }` e `EscopoExportado { escopo; favoritos; pastas; etiquetas }`
  - `exportarTudo(area, host, login, c: Carimbo): Promise<Envelope>`
  - `lerEnvelope(bruto): { envelope: Envelope; descartados: number } | null`
  - `importarEnvelope(area, env, carimbo, dono: { host; login }): Promise<{ novos; atualizados; deOutro }>`

O formato do arquivo é o **mesmo** da sincronia por arquivo da F3 (spec, seção 6.4). Esta tarefa já entrega o backup manual, que funciona em qualquer navegador; a F3 só automatiza.

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-dialogos.ts`:
```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { montarEditor } from "../src/app/componentes/editor";
import { montarGerenciar } from "../src/app/componentes/gerenciar";
import { montarLixeira, naLixeira } from "../src/app/componentes/lixeira";
import { montarMigracao } from "../src/app/componentes/migracao";
import { prazoDosValores, valoresDoPrazo } from "../src/app/prazoForm";
import { exportarTudo, importarEnvelope, lerEnvelope } from "../src/arquivo";
import { escoposDoContexto } from "../src/modelo/escopo";
import type { Etiqueta, Favorito, MudancasFavorito, Pasta } from "../src/modelo/tipos";
import { RepositorioFavoritos } from "../src/repositorio";
import { botao, checar, disparar, escolher, instalarDom, secao, tique } from "./util";
import { CTX } from "./verificar-modelo";

const HOJE = "2026-10-01";
const fav = (x: Partial<Favorito> & { id: string }): Favorito => ({ protocolo: `${x.id}/2026`, etiquetas: [], ordem: "a0", criadoEm: 1, atualizadoEm: 1, dispositivo: "D", ...x });

export async function verificarDialogos(): Promise<void> {
  instalarDom();
  secao("prazo no formulario");
  const vazio = valoresDoPrazo(undefined, HOJE);
  checar("sem prazo comeca em nenhum, com a data de hoje", vazio.modo === "nenhum" && vazio.referencia === HOJE);
  const dias = prazoDosValores({ ...vazio, modo: "dias", n: 3, contagem: "uteis", sentido: "antes" });
  checar("N dias antes vira n negativo", JSON.stringify(dias) === JSON.stringify({ referencia: { de: "data", data: HOJE }, vencimento: { em: "dias", n: -3, contagem: "uteis" }, exibicao: "ate" }), dias);
  checar("ida e volta", JSON.stringify(valoresDoPrazo(dias, HOJE)) === JSON.stringify({ ...vazio, modo: "dias", n: 3, contagem: "uteis", sentido: "antes" }));
  checar("prazo simples do legado abre como data limite", valoresDoPrazo({ referencia: { de: "data", data: "2026-10-04" }, exibicao: "ate" }, HOJE).modo === "data");
  checar("so contar desde", prazoDosValores({ ...vazio, modo: "contagem", contagem: "uteis" })?.exibicao === "desdeUteis");
  checar("dados incompletos nao viram prazo", prazoDosValores({ ...vazio, modo: "dias", n: 0 }) === undefined && prazoDosValores({ ...vazio, modo: "data", vencimento: "" }) === undefined);

  secao("editor do favorito");
  const pasta: Pasta = { id: "p1", nome: "Contratos", ordem: "a0", atualizadoEm: 1, dispositivo: "D" };
  const et: Etiqueta = { id: "e1", nome: "Urgente", cor: "#ffe0b2", atualizadoEm: 1, dispositivo: "D" };
  const salvos: MudancasFavorito[] = [];
  let fechou = false;
  const deps = {
    pastas: [pasta],
    etiquetas: [et],
    hoje: HOJE,
    salvar: async (m: MudancasFavorito) => {
      salvos.push(m);
    },
    criarPasta: async (nome: string) => ({ ...pasta, id: "p2", nome }),
    criarEtiqueta: async (nome: string) => ({ ...et, id: "e2", nome }),
    fechar: () => {
      fechou = true;
    },
  };
  const docLegado = fav({ id: "1", prazo: { referencia: { de: "documento", idDocumento: "160223", data: "2026-09-01" }, exibicao: "ate" } });
  const ed = montarEditor({ ...deps, favorito: docLegado });
  checar("prazo de documento do legado e explicado", ed.textContent?.includes("versão anterior") === true);
  (ed.querySelector('input[aria-label="Título"]') as HTMLInputElement).value = "Porto";
  escolher(ed.querySelector('select[aria-label="Pasta"]') as HTMLSelectElement, "p1");
  botao(ed, "Urgente")!.click();
  botao(ed, "Salvar")!.click();
  await tique();
  checar("salva titulo, pasta e etiquetas", salvos[0]?.titulo === "Porto" && salvos[0]?.pasta === "p1" && salvos[0]?.etiquetas?.join() === "e1" && fechou, salvos[0]);
  checar("prazo intocado nao e regravado (preserva o do legado)", !!salvos[0] && !("prazo" in salvos[0]));
  const ed2 = montarEditor({ ...deps, favorito: fav({ id: "2" }) });
  escolher(ed2.querySelector('select[aria-label="Prazo"]') as HTMLSelectElement, "data");
  const venc = ed2.querySelector('input[aria-label="Vence em"]') as HTMLInputElement;
  venc.value = "2026-10-05";
  disparar(venc, "change");
  checar("previa do prazo", ed2.querySelector(".fav-previa")?.textContent?.includes("vence em 4 dias") === true, ed2.querySelector(".fav-previa")?.textContent);
  botao(ed2, "Salvar")!.click();
  await tique();
  checar("prazo alterado e salvo", JSON.stringify(salvos[1]?.prazo?.vencimento) === JSON.stringify({ em: "data", data: "2026-10-05" }), salvos[1]);

  secao("gerenciar pastas e etiquetas");
  const feito: string[] = [];
  let lista = { pastas: [pasta], etiquetas: [et] };
  const g = await montarGerenciar({
    listar: async () => lista,
    criarPasta: async (n) => {
      feito.push(`+p:${n}`);
      lista = { ...lista, pastas: [...lista.pastas, { ...pasta, id: "p9", nome: n }] };
    },
    editarPasta: async (id, m) => void feito.push(`~p:${id}:${JSON.stringify(m)}`),
    removerPasta: async (id) => void feito.push(`-p:${id}`),
    criarEtiqueta: async (n) => void feito.push(`+e:${n}`),
    editarEtiqueta: async (id, m) => void feito.push(`~e:${id}:${JSON.stringify(m)}`),
    removerEtiqueta: async (id) => void feito.push(`-e:${id}`),
    confirmar: async () => true,
  });
  const nomePasta = g.querySelector('input[aria-label="Nome da pasta Contratos"]') as HTMLInputElement;
  nomePasta.value = "Contratos 2026";
  disparar(nomePasta, "change");
  await tique();
  botao(g, "Excluir a etiqueta Urgente")!.click();
  await tique();
  (g.querySelector('input[aria-label="Nova pasta"]') as HTMLInputElement).value = "Licitações";
  botao(g, "Criar pasta")!.click();
  await tique();
  checar("renomear, excluir e criar", feito.join() === '~p:p1:{"nome":"Contratos 2026"},-e:e1,+p:Licitações', feito);
  checar("redesenha com o que voltou do armazenamento", !!g.querySelector('input[aria-label="Nome da pasta Licitações"]'));

  secao("lixeira");
  const agora = 100 * 86_400_000;
  const itens = [fav({ id: "1", removidoEm: agora - 1 }), fav({ id: "2", removidoEm: agora - 31 * 86_400_000 }), fav({ id: "3" })];
  checar("so removidos dos ultimos 30 dias", naLixeira(itens, agora).map((f) => f.id).join() === "1");
  const restaurados: string[] = [];
  const lx = montarLixeira(itens, agora, { restaurar: async (id) => void restaurados.push(id), voltar: () => undefined });
  botao(lx, "Restaurar 1/2026")!.click();
  await tique();
  checar("restaurar", restaurados.join() === "1");

  secao("migracao: dialogo");
  const escolhas: string[] = [];
  const mg = montarMigracao({ quantidade: 42, amostra: ["1/2026"], siglaUnidade: "GPF", trazer: async (d) => void escolhas.push(d), adiar: async () => void escolhas.push("adiar") });
  checar("explica quantos e de onde", mg.textContent?.includes("42") === true);
  botao(mg, "Trazer para GPF")!.click();
  botao(mg, "Trazer para Pessoal")!.click();
  botao(mg, "Agora não")!.click();
  await tique();
  checar("tres escolhas", escolhas.join() === "unidade,pessoal,adiar");

  secao("arquivo: exportar e importar");
  const area = areaMemoria();
  let t = 1;
  const carimbo = () => ({ agora: ++t, dispositivo: "X" });
  const esc = escoposDoContexto(CTX);
  const ru = new RepositorioFavoritos(area, esc.unidade!, carimbo);
  const rp = new RepositorioFavoritos(area, esc.pessoal, carimbo);
  await ru.registrar();
  await rp.registrar();
  await ru.adicionar({ id: "1", protocolo: "1/2026" });
  await rp.adicionar({ id: "2", protocolo: "2/2026" });
  await ru.criarPasta("Contratos");
  const env = await exportarTudo(area, CTX.host, "pedro.soares", carimbo());
  checar("exporta as duas listas do usuario", env.escopos.length === 2 && env.formato === "seipro-favoritos" && env.versao === 1);
  const lido = lerEnvelope(JSON.parse(JSON.stringify(env)));
  checar("le o proprio arquivo sem descartar nada", lido?.descartados === 0);
  const outra = areaMemoria();
  const r = await importarEnvelope(outra, lido!.envelope, carimbo, { host: CTX.host, login: "pedro.soares" });
  checar("importa num navegador limpo", r.novos === 2 && (await new RepositorioFavoritos(outra, esc.pessoal, carimbo).contem("2")), r);
  const deOutro = await importarEnvelope(areaMemoria(), lido!.envelope, carimbo, { host: CTX.host, login: "fulano" });
  checar("arquivo de outro usuario nao entra", deOutro.novos === 0 && deOutro.deOutro === 2);
  const sujo = JSON.parse(JSON.stringify(env));
  sujo.escopos[0].favoritos.push({ id: "x" });
  sujo.escopos[0].favoritos[0].prazo = { referencia: "quebrado" };
  const lidoSujo = lerEnvelope(sujo);
  checar("item quebrado e descartado e prazo quebrado some", lidoSujo?.descartados === 1 && lidoSujo.envelope.escopos[0]?.favoritos[0]?.prazo === undefined, lidoSujo?.descartados);
  checar("formato desconhecido", lerEnvelope({ formato: "outro" }) === null && lerEnvelope(null) === null);
}
```

Em `verificar.ts`: `await verificarDialogos();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL.

- [ ] **Step 3: Implementar `prazoForm.ts` e `editor.ts`**

`favoritos/src/app/prazoForm.ts`:
```ts
/**
 * Ponte entre o formulário de prazo (quatro modos simples) e o `Prazo` do
 * modelo. O prazo simples do legado (só uma data) abre como "Até uma data".
 */

import type { DataISO } from "@comum/datas/dias";
import type { Prazo } from "../modelo/tipos";

export type ModoPrazo = "nenhum" | "data" | "dias" | "contagem";

export interface ValoresPrazo {
  modo: ModoPrazo;
  referencia: DataISO;
  vencimento: DataISO;
  n: number;
  contagem: "corridos" | "uteis";
  sentido: "depois" | "antes";
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function valoresDoPrazo(p: Prazo | undefined, hoje: DataISO): ValoresPrazo {
  const base: ValoresPrazo = { modo: "nenhum", referencia: hoje, vencimento: hoje, n: 5, contagem: "corridos", sentido: "depois" };
  if (!p) return base;
  const ref = p.referencia.de === "novoDocumento" ? p.referencia.desde : p.referencia.data;
  if (p.vencimento?.em === "data") return { ...base, modo: "data", referencia: ref, vencimento: p.vencimento.data };
  if (p.vencimento?.em === "dias") {
    return { ...base, modo: "dias", referencia: ref, n: Math.abs(p.vencimento.n), contagem: p.vencimento.contagem, sentido: p.vencimento.n < 0 ? "antes" : "depois" };
  }
  if (p.exibicao === "ate") return { ...base, modo: "data", referencia: ref, vencimento: ref };
  return { ...base, modo: "contagem", referencia: ref, contagem: p.exibicao === "desdeUteis" ? "uteis" : "corridos" };
}

export function prazoDosValores(v: ValoresPrazo): Prazo | undefined {
  if (v.modo === "nenhum" || !ISO.test(v.referencia)) return undefined;
  const referencia = { de: "data" as const, data: v.referencia };
  if (v.modo === "data") return ISO.test(v.vencimento) ? { referencia, vencimento: { em: "data", data: v.vencimento }, exibicao: "ate" } : undefined;
  if (v.modo === "dias") {
    const n = Math.trunc(Math.abs(v.n));
    if (!Number.isFinite(n) || n === 0) return undefined;
    return { referencia, vencimento: { em: "dias", n: v.sentido === "antes" ? -n : n, contagem: v.contagem }, exibicao: "ate" };
  }
  return { referencia, exibicao: v.contagem === "uteis" ? "desdeUteis" : "desde" };
}
```

`favoritos/src/app/componentes/editor.ts`:
```ts
import type { DataISO } from "@comum/datas/dias";
import { h } from "@comum/ui/dom";
import { MAX_NOTA } from "../../modelo/constantes";
import { calcularPrazo } from "../../modelo/prazo";
import type { Etiqueta, Favorito, MudancasFavorito, Pasta } from "../../modelo/tipos";
import { type ModoPrazo, prazoDosValores, type ValoresPrazo, valoresDoPrazo } from "../prazoForm";

export interface DepsEditor {
  favorito: Favorito;
  pastas: Pasta[];
  etiquetas: Etiqueta[];
  hoje: DataISO;
  salvar(m: MudancasFavorito): Promise<void>;
  criarPasta(nome: string): Promise<Pasta>;
  criarEtiqueta(nome: string): Promise<Etiqueta>;
  fechar(): void;
}

const campo = (rotulo: string, ...filhos: Array<Node | null>) => h("label", {}, rotulo, ...filhos);

export function montarEditor(d: DepsEditor): HTMLElement {
  const f = d.favorito;
  const titulo = h("input", {
    class: "spro-campo",
    value: f.titulo ?? "",
    maxlength: "200",
    "aria-label": "Título",
    placeholder: [f.tipo, f.especificacao].filter(Boolean).join(" · ") || "Como você quer chamar este processo",
  });

  const pasta: HTMLSelectElement = h(
    "select",
    { class: "spro-campo", "aria-label": "Pasta" },
    h("option", { value: "", selected: !f.pasta }, "(sem pasta)"),
    ...d.pastas.map((p) => h("option", { value: p.id, selected: p.id === f.pasta }, p.nome)),
  );
  const novaPasta = h("input", { class: "spro-campo", placeholder: "Nova pasta", "aria-label": "Nova pasta", maxlength: "60" });
  const criarPasta = h(
    "button",
    {
      type: "button",
      class: "spro-botao",
      onclick: async () => {
        const nome = novaPasta.value.trim();
        if (!nome) return;
        const p = await d.criarPasta(nome);
        for (const o of pasta.querySelectorAll("option")) o.removeAttribute("selected");
        pasta.append(h("option", { value: p.id, selected: true }, p.nome));
        novaPasta.value = "";
      },
    },
    "Criar pasta",
  );

  const marcadas = new Set(f.etiquetas);
  let etiquetas = [...d.etiquetas];
  const chips = h("div", { class: "fav-balao-chips" });
  const desenharChips = () =>
    chips.replaceChildren(
      ...etiquetas.map((e) =>
        h(
          "button",
          {
            type: "button",
            class: "spro-chip",
            style: `--cor:${e.cor}`,
            "aria-pressed": String(marcadas.has(e.id)),
            onclick: () => {
              if (marcadas.has(e.id)) marcadas.delete(e.id);
              else marcadas.add(e.id);
              desenharChips();
            },
          },
          e.nome,
        ),
      ),
    );
  desenharChips();
  const novaEtiqueta = h("input", { class: "spro-campo", placeholder: "Nova etiqueta", "aria-label": "Nova etiqueta", maxlength: "40" });
  const criarEtiqueta = h(
    "button",
    {
      type: "button",
      class: "spro-botao",
      onclick: async () => {
        const nome = novaEtiqueta.value.trim();
        if (!nome) return;
        const e = await d.criarEtiqueta(nome);
        etiquetas = [...etiquetas.filter((x) => x.id !== e.id), e];
        marcadas.add(e.id);
        novaEtiqueta.value = "";
        desenharChips();
      },
    },
    "Adicionar etiqueta",
  );

  const nota = h("textarea", { class: "spro-campo", rows: "4", maxlength: String(MAX_NOTA), "aria-label": "Nota", value: f.nota ?? "" });

  // Prazo: só é regravado se o usuário mexer nele. Assim o prazo "a partir do
  // documento X" ou "do próximo documento" que veio do legado não se perde ao
  // editar só a nota.
  const v = valoresDoPrazo(f.prazo, d.hoje);
  let prazoAlterado = false;
  const opcoes = (valor: string, lista: Array<[string, string]>) => lista.map(([val, t]) => h("option", { value: val, selected: val === valor }, t));
  const modo: HTMLSelectElement = h(
    "select",
    { class: "spro-campo", "aria-label": "Prazo" },
    ...opcoes(v.modo, [
      ["nenhum", "Sem prazo"],
      ["data", "Até uma data"],
      ["dias", "N dias a partir de uma data"],
      ["contagem", "Só contar os dias desde uma data"],
    ]),
  );
  const referencia = h("input", { type: "date", class: "spro-campo", "aria-label": "A partir de", value: v.referencia });
  const vencimento = h("input", { type: "date", class: "spro-campo", "aria-label": "Vence em", value: v.vencimento });
  const n = h("input", { type: "number", min: "1", max: "3650", class: "spro-campo", "aria-label": "Quantidade de dias", value: String(v.n) });
  const contagem: HTMLSelectElement = h(
    "select",
    { class: "spro-campo", "aria-label": "Contagem" },
    ...opcoes(v.contagem, [
      ["corridos", "dias corridos"],
      ["uteis", "dias úteis"],
    ]),
  );
  const sentido: HTMLSelectElement = h(
    "select",
    { class: "spro-campo", "aria-label": "Sentido" },
    ...opcoes(v.sentido, [
      ["depois", "depois"],
      ["antes", "antes"],
    ]),
  );
  const grupoRef = campo("A partir de", referencia);
  const grupoVenc = campo("Vence em", vencimento);
  const grupoDias = h("div", { class: "linha" }, n, sentido);
  const grupoContagem = campo("Contar em", contagem);
  const previa = h("p", { class: "fav-previa", "aria-live": "polite" });
  const ler = (): ValoresPrazo => ({
    modo: (modo.value ?? "nenhum") as ModoPrazo,
    referencia: referencia.value,
    vencimento: vencimento.value,
    n: Number(n.value),
    contagem: (contagem.value ?? "corridos") as ValoresPrazo["contagem"],
    sentido: (sentido.value ?? "depois") as ValoresPrazo["sentido"],
  });
  const atualizar = () => {
    const m = ler().modo;
    grupoRef.hidden = m === "nenhum";
    grupoVenc.hidden = m !== "data";
    grupoDias.hidden = m !== "dias";
    grupoContagem.hidden = m !== "dias" && m !== "contagem";
    const p = prazoDosValores(ler());
    previa.textContent = p ? `${calcularPrazo(p, d.hoje).texto}. ${calcularPrazo(p, d.hoje).dica}` : m === "nenhum" ? "Sem prazo." : "Preencha as datas.";
  };
  for (const el of [modo, referencia, vencimento, n, contagem, sentido]) {
    el.addEventListener("change", () => {
      prazoAlterado = true;
      atualizar();
    });
  }
  atualizar();
  const avisoLegado =
    f.prazo && f.prazo.referencia.de !== "data"
      ? h("p", { class: "fav-previa" }, "Este prazo foi configurado na versão anterior a partir de um documento. Ele é mantido enquanto você não mexer no prazo.")
      : null;

  return h(
    "div",
    { class: "fav-form" },
    campo("Título", titulo),
    h("div", { class: "linha" }, campo("Pasta", pasta), novaPasta, criarPasta),
    h("div", {}, h("span", { class: "fav-rotulo" }, "Etiquetas"), chips, h("div", { class: "linha" }, novaEtiqueta, criarEtiqueta)),
    campo("Nota pessoal", nota),
    h("fieldset", { class: "fav-prazo-campos" }, h("legend", {}, "Prazo"), avisoLegado, modo, grupoRef, grupoVenc, grupoDias, grupoContagem, previa),
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      h("button", { type: "button", class: "spro-botao", onclick: () => d.fechar() }, "Cancelar"),
      h(
        "button",
        {
          type: "button",
          class: "spro-botao primario",
          onclick: async () => {
            const m: MudancasFavorito = { titulo: titulo.value, pasta: pasta.value || undefined, etiquetas: [...marcadas], nota: nota.value };
            if (prazoAlterado) m.prazo = prazoDosValores(ler());
            await d.salvar(m);
            d.fechar();
          },
        },
        "Salvar",
      ),
    ),
  );
}
```

- [ ] **Step 4: Implementar gerenciar, lixeira e migração**

`favoritos/src/app/componentes/gerenciar.ts`:
```ts
import { h, icone } from "@comum/ui/dom";
import type { Etiqueta, Pasta } from "../../modelo/tipos";

export interface DepsGerenciar {
  listar(): Promise<{ pastas: Pasta[]; etiquetas: Etiqueta[] }>;
  criarPasta(nome: string): Promise<unknown>;
  editarPasta(id: string, m: Partial<Pick<Pasta, "nome" | "cor">>): Promise<void>;
  removerPasta(id: string): Promise<void>;
  criarEtiqueta(nome: string): Promise<unknown>;
  editarEtiqueta(id: string, m: Partial<Pick<Etiqueta, "nome" | "cor">>): Promise<void>;
  removerEtiqueta(id: string): Promise<void>;
  confirmar(texto: string): Promise<boolean>;
}

/** Renomear, trocar a cor e excluir pastas e etiquetas desta lista. Redesenha a cada ação. */
export async function montarGerenciar(d: DepsGerenciar): Promise<HTMLElement> {
  const raiz = h("div", { class: "fav-form" });
  const acao = (fazer: () => Promise<unknown>) => async () => {
    await fazer();
    await desenhar();
  };
  const linha = (tipo: "pasta" | "etiqueta", item: { id: string; nome: string; cor?: string }) => {
    const nome = h("input", { class: "spro-campo", value: item.nome, maxlength: "60", "aria-label": `Nome da ${tipo} ${item.nome}` });
    nome.addEventListener("change", acao(() => (tipo === "pasta" ? d.editarPasta(item.id, { nome: nome.value }) : d.editarEtiqueta(item.id, { nome: nome.value }))));
    const cor = h("input", { type: "color", value: item.cor ?? "#bfd5e8", "aria-label": `Cor da ${tipo} ${item.nome}` });
    cor.addEventListener("change", acao(() => (tipo === "pasta" ? d.editarPasta(item.id, { cor: cor.value }) : d.editarEtiqueta(item.id, { cor: cor.value }))));
    const aviso = tipo === "pasta" ? `Excluir a pasta "${item.nome}"? Os favoritos dela ficam sem pasta.` : `Excluir a etiqueta "${item.nome}"? Ela sai de todos os favoritos.`;
    const excluir = h(
      "button",
      {
        type: "button",
        class: "spro-botao-icone",
        "aria-label": `Excluir a ${tipo} ${item.nome}`,
        title: "Excluir",
        onclick: acao(async () => {
          if (await d.confirmar(aviso)) await (tipo === "pasta" ? d.removerPasta(item.id) : d.removerEtiqueta(item.id));
        }),
      },
      icone("lixeira", 16),
    );
    return h("div", { class: "linha" }, nome, cor, excluir);
  };
  const criar = (tipo: "pasta" | "etiqueta") => {
    const nome = h("input", { class: "spro-campo", placeholder: tipo === "pasta" ? "Nova pasta" : "Nova etiqueta", "aria-label": tipo === "pasta" ? "Nova pasta" : "Nova etiqueta" });
    const botao = h(
      "button",
      {
        type: "button",
        class: "spro-botao",
        onclick: acao(async () => {
          const v = nome.value.trim();
          if (v) await (tipo === "pasta" ? d.criarPasta(v) : d.criarEtiqueta(v));
        }),
      },
      tipo === "pasta" ? "Criar pasta" : "Criar etiqueta",
    );
    return h("div", { class: "linha" }, nome, botao);
  };
  async function desenhar(): Promise<void> {
    const { pastas, etiquetas } = await d.listar();
    raiz.replaceChildren(
      h("h3", {}, "Pastas"),
      ...pastas.map((p) => linha("pasta", p)),
      criar("pasta"),
      h("h3", {}, "Etiquetas"),
      ...etiquetas.map((e) => linha("etiqueta", e)),
      criar("etiqueta"),
    );
  }
  await desenhar();
  return raiz;
}
```

`favoritos/src/app/componentes/lixeira.ts`:
```ts
import { formatarData, hojeISO } from "@comum/datas/dias";
import { h, icone } from "@comum/ui/dom";
import { DIAS_LIXEIRA } from "../../modelo/constantes";
import type { Favorito } from "../../modelo/tipos";

export function naLixeira(itens: Favorito[], agora: number): Favorito[] {
  const limite = agora - DIAS_LIXEIRA * 86_400_000;
  return itens.filter((f) => f.removidoEm !== undefined && f.removidoEm >= limite).sort((a, b) => (b.removidoEm ?? 0) - (a.removidoEm ?? 0));
}

export function montarLixeira(itens: Favorito[], agora: number, d: { restaurar(id: string): Promise<void>; voltar(): void }): HTMLElement {
  const lista = naLixeira(itens, agora);
  const linhas = lista.map((f) => {
    const li: HTMLLIElement = h(
      "li",
      { class: "fav-item" },
      h("span"),
      h("span"),
      h("div", { class: "fav-principal" }, h("strong", {}, f.protocolo), h("span", {}, f.titulo || f.tipo || "")),
      h("span", { class: "fav-pasta" }, `removido em ${formatarData(hojeISO(new Date(f.removidoEm ?? agora)))}`),
      h(
        "button",
        {
          type: "button",
          class: "spro-botao",
          "aria-label": `Restaurar ${f.protocolo}`,
          onclick: async () => {
            await d.restaurar(f.id);
            li.remove();
          },
        },
        icone("restaurar", 14),
        "Restaurar",
      ),
    );
    return li;
  });
  return h(
    "div",
    {},
    h("div", { class: "linha fav-lixeira-topo" }, h("button", { type: "button", class: "spro-botao", onclick: () => d.voltar() }, "Voltar à lista"), h("span", { class: "fav-previa" }, `Os removidos ficam aqui por ${DIAS_LIXEIRA} dias.`)),
    lista.length ? h("ul", { class: "fav-lista" }, ...linhas) : h("p", { class: "fav-vazio" }, "A lixeira está vazia."),
  );
}
```

`favoritos/src/app/componentes/migracao.ts`:
```ts
import { h } from "@comum/ui/dom";
import type { TipoLista } from "../../modelo/tipos";

export interface DepsMigracao {
  quantidade: number;
  amostra: string[];
  siglaUnidade: string | null;
  trazer(destino: TipoLista): Promise<void>;
  adiar(): Promise<void>;
}

export function montarMigracao(d: DepsMigracao): HTMLElement {
  return h(
    "div",
    { class: "fav-form" },
    h("p", {}, `Encontramos ${d.quantidade} favoritos da versão anterior do SEI Pro neste navegador (por exemplo: ${d.amostra.join(", ")}).`),
    h(
      "p",
      { class: "fav-previa" },
      "Na versão nova, cada unidade tem a sua lista e há uma lista Pessoal, que aparece em todas. Os dados antigos continuam guardados: nada é apagado.",
    ),
    h(
      "div",
      { class: "spro-dialogo-rodape" },
      h("button", { type: "button", class: "spro-botao", onclick: () => void d.adiar() }, "Agora não"),
      h("button", { type: "button", class: "spro-botao", onclick: () => void d.trazer("pessoal") }, "Trazer para Pessoal"),
      d.siglaUnidade ? h("button", { type: "button", class: "spro-botao primario", onclick: () => void d.trazer("unidade") }, `Trazer para ${d.siglaUnidade}`) : null,
    ),
  );
}
```

- [ ] **Step 5: Implementar `arquivo.ts`**

`favoritos/src/arquivo.ts`:
```ts
/**
 * Arquivo de favoritos (.json): o backup manual da F1 e, na F3, o formato da
 * sincronia por arquivo (spec 6.4). Leva TODAS as listas do usuário (cada
 * unidade e a Pessoal), legível e indentado, para quem quiser conferir.
 * Importar sempre MESCLA (vence a versão mais recente), nunca substitui. O
 * legado substituía tudo e sem validar.
 */

import type { Area } from "@comum/armazenamento/area";
import type { Carimbo, Escopo, Etiqueta, Favorito, Pasta } from "./modelo/tipos";
import { RepositorioFavoritos } from "./repositorio";

export interface EscopoExportado {
  escopo: Escopo;
  favoritos: Favorito[];
  pastas: Pasta[];
  etiquetas: Etiqueta[];
}

export interface Envelope {
  formato: "seipro-favoritos";
  versao: 1;
  escopos: EscopoExportado[];
  gravadoEm: number;
  dispositivo: string;
  revisao: number;
}

type Obj = Record<string, unknown>;
const objeto = (v: unknown): Obj | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : null);
const ehTexto = (v: unknown): v is string => typeof v === "string";
const ehNumero = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export async function exportarTudo(area: Area, host: string, login: string, c: Carimbo): Promise<Envelope> {
  const tudo = await area.obter(null);
  const prefixo = `favoritos/${host}|${login.toLowerCase()}|`;
  const escopos: EscopoExportado[] = [];
  for (const [chave, valor] of Object.entries(tudo)) {
    const escopo = objeto(valor)?.escopo;
    if (!chave.startsWith(prefixo) || !chave.endsWith("/meta") || !escopo) continue;
    const base = chave.slice(0, -"meta".length);
    const pegar = (sub: string) => Object.entries(tudo).filter(([k]) => k.startsWith(base + sub)).map(([, v]) => v);
    escopos.push({ escopo: escopo as Escopo, favoritos: pegar("f/") as Favorito[], pastas: pegar("p/") as Pasta[], etiquetas: pegar("e/") as Etiqueta[] });
  }
  return { formato: "seipro-favoritos", versao: 1, escopos, gravadoEm: c.agora, dispositivo: c.dispositivo, revisao: 0 };
}

const versionada = (o: Obj) => ehTexto(o.id) && o.id !== "" && ehNumero(o.atualizadoEm) && ehTexto(o.dispositivo) && (o.removidoEm === undefined || ehNumero(o.removidoEm));

function prazoValido(v: unknown): boolean {
  const p = objeto(v);
  const r = objeto(p?.referencia);
  if (!p || !r || !["ate", "desde", "desdeUteis"].includes(String(p.exibicao))) return false;
  const datas = r.de === "novoDocumento" ? [r.desde] : r.de === "data" || r.de === "documento" ? [r.data] : [];
  if (!datas.length || !datas.every((d) => ehTexto(d) && ISO.test(d))) return false;
  const venc = objeto(p.vencimento);
  return p.vencimento === undefined || (venc?.em === "data" && ehTexto(venc.data) && ISO.test(venc.data)) || (venc?.em === "dias" && ehNumero(venc.n));
}

/** Favorito utilizável, ou null. Campos opcionais quebrados são descartados, não o favorito inteiro. */
function favorito(v: unknown): Favorito | null {
  const o = objeto(v);
  if (!o || !versionada(o) || !ehTexto(o.protocolo) || !ehTexto(o.ordem) || !ehNumero(o.criadoEm) || !Array.isArray(o.etiquetas)) return null;
  const f = { ...o, etiquetas: o.etiquetas.filter(ehTexto) } as Obj;
  if (f.prazo !== undefined && !prazoValido(f.prazo)) delete f.prazo;
  for (const k of ["titulo", "tipo", "especificacao", "pasta", "nota"]) if (f[k] !== undefined && !ehTexto(f[k])) delete f[k];
  return f as unknown as Favorito;
}

const pasta = (v: unknown): Pasta | null => {
  const o = objeto(v);
  return o && versionada(o) && ehTexto(o.nome) && ehTexto(o.ordem) ? (o as unknown as Pasta) : null;
};
const etiqueta = (v: unknown): Etiqueta | null => {
  const o = objeto(v);
  return o && versionada(o) && ehTexto(o.nome) && ehTexto(o.cor) ? (o as unknown as Etiqueta) : null;
};
const escopoValido = (v: unknown): v is Escopo => {
  const o = objeto(v);
  if (!o || !ehTexto(o.host) || !ehTexto(o.login)) return false;
  return o.lista === "pessoal" || (o.lista === "unidade" && ehTexto(objeto(o.unidade)?.id) && objeto(o.unidade)?.id !== "");
};

export function lerEnvelope(bruto: unknown): { envelope: Envelope; descartados: number } | null {
  const o = objeto(bruto);
  if (!o || o.formato !== "seipro-favoritos" || o.versao !== 1 || !Array.isArray(o.escopos)) return null;
  let descartados = 0;
  const filtrar = <T>(lista: unknown, ler: (v: unknown) => T | null): T[] => {
    const l = Array.isArray(lista) ? lista : [];
    const bons = l.map(ler).filter((x): x is T => x !== null);
    descartados += l.length - bons.length;
    return bons;
  };
  const escopos: EscopoExportado[] = [];
  for (const e of o.escopos) {
    const eo = objeto(e);
    if (!eo || !escopoValido(eo.escopo)) {
      descartados += 1;
      continue;
    }
    escopos.push({ escopo: eo.escopo, favoritos: filtrar(eo.favoritos, favorito), pastas: filtrar(eo.pastas, pasta), etiquetas: filtrar(eo.etiquetas, etiqueta) });
  }
  return {
    envelope: {
      formato: "seipro-favoritos",
      versao: 1,
      escopos,
      gravadoEm: ehNumero(o.gravadoEm) ? o.gravadoEm : 0,
      dispositivo: ehTexto(o.dispositivo) ? o.dispositivo : "",
      revisao: ehNumero(o.revisao) ? o.revisao : 0,
    },
    descartados,
  };
}

/** Só entram as listas DO PRÓPRIO usuário: o arquivo de um colega não vira favoritos invisíveis. */
export async function importarEnvelope(
  area: Area,
  env: Envelope,
  carimbo: () => Carimbo,
  dono: { host: string; login: string },
): Promise<{ novos: number; atualizados: number; deOutro: number }> {
  let novos = 0;
  let atualizados = 0;
  let deOutro = 0;
  for (const e of env.escopos) {
    if (e.escopo.host !== dono.host || e.escopo.login.toLowerCase() !== dono.login.toLowerCase()) {
      deOutro += 1;
      continue;
    }
    const repo = new RepositorioFavoritos(area, e.escopo, carimbo);
    await repo.registrar();
    const r = await repo.importar(e);
    novos += r.novos;
    atualizados += r.atualizados;
  }
  return { novos, atualizados, deOutro };
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

Se "previa do prazo" falhar, confira a conta: `prazoDosValores` monta `{ referencia: hoje (2026-10-01), vencimento: 2026-10-05 }`, e `calcularPrazo` deve dar "vence em 4 dias".

- [ ] **Step 7: Commit**

```bash
cd "$W"
git add favoritos/src/app/prazoForm.ts favoritos/src/app/componentes/editor.ts favoritos/src/app/componentes/gerenciar.ts favoritos/src/app/componentes/lixeira.ts favoritos/src/app/componentes/migracao.ts favoritos/src/arquivo.ts favoritos/tests/verificar-dialogos.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: editor com prazo, pastas e etiquetas, lixeira, migracao e arquivo .json que mescla

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 18: `favoritos/app` — o app montado (estado, abas, menu, migração, faixa de unidade)

**Files:**
- Create: `favoritos/src/app/app.ts`, `favoritos/src/app/aviso.ts`
- Test: `favoritos/tests/verificar-app.ts`; modify `favoritos/tests/verificar.ts`

**Interfaces:**
- Consumes: as Tarefas 9 a 17, além de `Rpc` (Tarefa 7) e `Area` (Tarefa 4).
- Produces:
  - `type AbrirModal = (o: { titulo: string; conteudo: HTMLElement; aoFechar?: () => void }) => { fechar(): void }`
  - `interface DepsApp { rpc: Pick<Rpc, "chamar">; ctx: ContextoAba; area: Area; sync: Area; repos: { unidade: RepositorioFavoritos | null; pessoal: RepositorioFavoritos }; carimbo: () => Carimbo; abrirModal: AbrirModal; confirmar(texto): Promise<boolean>; baixar(nome, conteudo, tipo): void; copiar(texto): Promise<void>; escolherArquivo(): Promise<string | null>; hoje(): DataISO }`
  - `class AppFavoritos { constructor(raiz: HTMLElement, d: DepsApp); iniciar(): Promise<void>; recarregar(): Promise<void> }`
  - `avisar(texto, acao?: { rotulo: string; fazer(): void }): void`

Tudo que toca o navegador (`<dialog>`, download, área de transferência, seletor de arquivo) chega por `DepsApp`. Por isso o app inteiro roda no teste com linkedom; só o `app/main.ts` (Tarefa 19) liga esses pontos ao Chrome.

- [ ] **Step 1: Escrever o teste (falhando)**

`favoritos/tests/verificar-app.ts`:
```ts
import { areaMemoria } from "@comum/armazenamento/area";
import { type AbrirModal, AppFavoritos, type DepsApp } from "../src/app/app";
import { chaveMigracao, chaveUltimaUnidade } from "../src/modelo/constantes";
import { escoposDoContexto } from "../src/modelo/escopo";
import { RepositorioFavoritos } from "../src/repositorio";
import { botao, checar, disparar, instalarDom, secao, tique } from "./util";
import { CTX } from "./verificar-modelo";

function montar(extra: Partial<DepsApp> = {}, inicial: Record<string, unknown> = {}) {
  const doc = instalarDom('<html><body><div id="app"></div></body></html>');
  const area = areaMemoria(inicial);
  const sync = areaMemoria();
  let t = 1000;
  const carimbo = () => ({ agora: ++t, dispositivo: "X" });
  const esc = escoposDoContexto(CTX);
  const repos = { unidade: new RepositorioFavoritos(area, esc.unidade!, carimbo), pessoal: new RepositorioFavoritos(area, esc.pessoal, carimbo) };
  const chamadas: Array<[string, unknown]> = [];
  const modais: Array<{ titulo: string; conteudo: HTMLElement; fechado: boolean }> = [];
  const baixados: string[] = [];
  const copiados: string[] = [];
  const abrirModal: AbrirModal = (o) => {
    const m = { titulo: o.titulo, conteudo: o.conteudo, fechado: false };
    modais.push(m);
    return {
      fechar: () => {
        m.fechado = true;
        o.aoFechar?.();
      },
    };
  };
  const deps: DepsApp = {
    rpc: {
      chamar: (async (op: string, args?: unknown) => {
        chamadas.push([op, args]);
        return op === "lerLegado" ? { local: null, arquivo: null } : true;
      }) as DepsApp["rpc"]["chamar"],
    },
    ctx: CTX,
    area,
    sync,
    repos,
    carimbo,
    abrirModal,
    confirmar: async () => true,
    baixar: (nome) => void baixados.push(nome),
    copiar: async (texto) => void copiados.push(texto),
    escolherArquivo: async () => null,
    hoje: () => "2026-10-01",
    ...extra,
  };
  const raiz = doc.getElementById("app")!;
  return { doc, raiz, area, repos, chamadas, modais, baixados, copiados, app: new AppFavoritos(raiz, deps) };
}

export async function verificarApp(): Promise<void> {
  secao("app montado: lista, abas e mudancas de outro contexto");
  const a = montar();
  await a.repos.unidade.adicionar({ id: "1", protocolo: "50300.000001/2026-01", tipo: "Fiscalização" });
  await a.repos.unidade.adicionar({ id: "2", protocolo: "50300.000002/2026-02", tipo: "Contrato" });
  await a.app.iniciar();
  const itens = () => a.raiz.querySelectorAll("li.fav-item").length;
  checar("lista os favoritos da unidade", itens() === 2, itens());
  checar("abas com contagem", !!botao(a.raiz, "GPF (2)") && !!botao(a.raiz, "Pessoal (0)"));
  await a.repos.unidade.adicionar({ id: "3", protocolo: "50300.000003/2026-03" });
  await tique(80);
  checar("favorito gravado pela estrela (outro contexto) aparece sozinho", itens() === 3);

  (a.raiz.querySelector('li[data-id="1"] .fav-protocolo') as HTMLElement).click();
  checar("clicar no numero pede a aba para abrir", a.chamadas.some(([op, x]) => op === "abrirProcesso" && (x as { id: string }).id === "1"));

  const busca = a.raiz.querySelector('input[type="search"]') as HTMLInputElement;
  busca.value = "contrato";
  disparar(busca, "input");
  await tique(220);
  checar("busca filtra", itens() === 1);
  busca.value = "";
  disparar(busca, "input");
  await tique(220);

  secao("app montado: selecao e lote");
  const sel = a.raiz.querySelector('li[data-id="2"] input.fav-sel') as HTMLInputElement;
  // No linkedom, `checked` não reflete o atributo: marca-se como o navegador faz.
  sel.checked = true;
  disparar(sel, "change");
  botao(a.raiz, "Copiar números")!.click();
  await tique();
  checar("copia os numeros selecionados", a.copiados.join() === "50300.000002/2026-02");
  botao(a.raiz, "Baixar CSV")!.click();
  checar("baixa o CSV com nome da lista e data", a.baixados.includes("favoritos-GPF-2026-10-01.csv"), a.baixados);
  botao(a.raiz, "Remover selecionados")!.click();
  await tique(80);
  checar("remover manda para a lixeira", !(await a.repos.unidade.contem("2")) && itens() === 2);
  checar("aviso com desfazer", !!botao(a.raiz, "Desfazer"));
  botao(a.raiz, "Desfazer")!.click();
  await tique(80);
  checar("desfazer devolve", (await a.repos.unidade.contem("2")) && itens() === 3);

  secao("app montado: editar");
  (a.raiz.querySelector('li[data-id="1"] .fav-titulo') as HTMLElement).click();
  const modal = a.modais[a.modais.length - 1]!;
  checar("editar abre o dialogo do processo", modal.titulo.includes("50300.000001/2026-01"));
  (modal.conteudo.querySelector('input[aria-label="Título"]') as HTMLInputElement).value = "Porto de Santos";
  botao(modal.conteudo, "Salvar")!.click();
  await tique(80);
  checar("salvar grava e a lista mostra o titulo", (await a.repos.unidade.obter("1"))?.titulo === "Porto de Santos" && (a.raiz.textContent ?? "").includes("Porto de Santos"));

  secao("app montado: Pessoal e lixeira");
  botao(a.raiz, "Pessoal (0)")!.click();
  await tique(80);
  checar("aba Pessoal vazia convida a usar a estrela", (a.raiz.querySelector(".fav-vazio")?.textContent ?? "").includes("estrela"));
  botao(a.raiz, "GPF (3)")!.click();
  await tique(80);
  botao(a.raiz, "Lixeira")!.click();
  await tique(20);
  checar("lixeira abre (vazia depois do desfazer)", (a.raiz.textContent ?? "").includes("A lixeira está vazia."));

  secao("app montado: troca de unidade");
  const b = montar({}, { [chaveUltimaUnidade(CTX.host, CTX.login.toLowerCase())]: { id: "999", sigla: "SFC" } });
  await b.app.iniciar();
  const faixa = b.raiz.querySelector(".fav-faixa")?.textContent ?? "";
  checar("faixa explica a troca de unidade", faixa.includes("GPF") && faixa.includes("SFC"), faixa);
  const c = montar({}, { [chaveUltimaUnidade(CTX.host, CTX.login.toLowerCase())]: { id: "110000001", sigla: "GPF" } });
  await c.app.iniciar();
  checar("mesma unidade, sem faixa", !c.raiz.querySelector(".fav-faixa"));

  secao("app montado: migracao dos favoritos antigos");
  const legado = { favorites: [{ id_procedimento: "70", processo: "70/2026", categoria: "Contratos" }] };
  const m = montar({
    rpc: { chamar: (async (op: string) => (op === "lerLegado" ? { local: legado, arquivo: null } : true)) as DepsApp["rpc"]["chamar"] },
  });
  await m.app.iniciar();
  const dlg = m.modais[0];
  checar("oferece trazer os antigos na primeira vez", dlg?.titulo === "Favoritos da versão anterior");
  botao(dlg!.conteudo, "Trazer para GPF")!.click();
  await tique(80);
  checar("traz para a unidade e marca a migracao", (await m.repos.unidade.contem("70")) && !!(await m.area.obter(chaveMigracao(CTX.host, "pedro.soares")))[chaveMigracao(CTX.host, "pedro.soares")]);
  const m2 = montar(
    { rpc: { chamar: (async (op: string) => (op === "lerLegado" ? { local: legado, arquivo: null } : true)) as DepsApp["rpc"]["chamar"] } },
    { [chaveMigracao(CTX.host, "pedro.soares")]: { adiadoEm: 1 } },
  );
  await m2.app.iniciar();
  checar("nao pergunta de novo depois de respondido", m2.modais.length === 0);
}
```

Em `verificar.ts`: `await verificarApp();` antes de `resumo()`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd "$W/favoritos" && npm run verificar`
Expected: FAIL (`../src/app/app` ausente).

- [ ] **Step 3: Implementar `aviso.ts` e `app.ts`**

`favoritos/src/app/aviso.ts`:
```ts
import { h } from "@comum/ui/dom";

/** Aviso curto no topo do app (dentro do iframe, um aviso preso embaixo ficaria fora da vista). */
export function avisar(texto: string, acao?: { rotulo: string; fazer(): void }, ms = 7000): void {
  const raiz = document.getElementById("app") ?? document.body;
  raiz.querySelector(".spro-aviso")?.remove();
  const el: HTMLElement = h(
    "div",
    { class: "spro-aviso", role: "status" },
    texto,
    acao
      ? h(
          "button",
          {
            type: "button",
            onclick: () => {
              el.remove();
              acao.fazer();
            },
          },
          acao.rotulo,
        )
      : null,
  );
  raiz.prepend(el);
  setTimeout(() => el.remove(), ms);
}
```

`favoritos/src/app/app.ts`:
```ts
/**
 * O app do favoritos: estado da tela e orquestração. Não toca o navegador
 * direto (diálogo, download, área de transferência, arquivo e a aba do SEI
 * chegam por `DepsApp`), e por isso roda inteiro nos testes com linkedom.
 */

import type { Area } from "@comum/armazenamento/area";
import type { DataISO } from "@comum/datas/dias";
import type { Rpc } from "@comum/ponte/rpc";
import { h, icone } from "@comum/ui/dom";
import { exportarTudo, importarEnvelope, lerEnvelope } from "../arquivo";
import { converterLegado } from "../migracao/legado";
import { CHAVE_PREFERENCIAS, chaveMigracao, chaveUltimaUnidade } from "../modelo/constantes";
import { filtrar, ordenar } from "../modelo/operacoes";
import { calcularPrazo } from "../modelo/prazo";
import {
  type Carimbo,
  type ContextoAba,
  type Etiqueta,
  type Favorito,
  type Filtro,
  type Pasta,
  type Preferencias,
  PREFERENCIAS_PADRAO,
  type ResumoPrazo,
  type TipoLista,
} from "../modelo/tipos";
import { gravarPreferencias, lerPreferencias } from "../preferencias";
import { moverEntreListas, type RepositorioFavoritos } from "../repositorio";
import { avisar } from "./aviso";
import { gerarCsv, linhasCsv } from "./csv";
import { montarEditor } from "./componentes/editor";
import { renderFiltros, renderLote } from "./componentes/filtros";
import { montarGerenciar } from "./componentes/gerenciar";
import type { AcoesItem } from "./componentes/item";
import { renderLista, vizinhosAoMover } from "./componentes/lista";
import { montarLixeira } from "./componentes/lixeira";
import { montarMigracao } from "./componentes/migracao";

export type AbrirModal = (o: { titulo: string; conteudo: HTMLElement; aoFechar?: () => void }) => { fechar(): void };

export interface DepsApp {
  rpc: Pick<Rpc, "chamar">;
  ctx: ContextoAba;
  area: Area;
  sync: Area;
  repos: { unidade: RepositorioFavoritos | null; pessoal: RepositorioFavoritos };
  carimbo: () => Carimbo;
  abrirModal: AbrirModal;
  confirmar(texto: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  copiar(texto: string): Promise<void>;
  escolherArquivo(): Promise<string | null>;
  hoje(): DataISO;
}

export class AppFavoritos {
  private lista: TipoLista;
  private visao: "lista" | "lixeira" = "lista";
  private todos: Favorito[] = [];
  private pastas: Pasta[] = [];
  private etiquetas: Etiqueta[] = [];
  private contagem = { unidade: 0, pessoal: 0 };
  private filtro: Filtro = {};
  private readonly selecao = new Set<string>();
  private prefs: Preferencias = { ...PREFERENCIAS_PADRAO };
  private recargaAgendada = false;
  private readonly el: { faixas: HTMLElement; abas: HTMLElement; filtros: HTMLElement; lote: HTMLElement; corpo: HTMLElement };

  constructor(
    raiz: HTMLElement,
    private readonly d: DepsApp,
  ) {
    this.lista = d.repos.unidade ? "unidade" : "pessoal";
    const busca = h("input", { type: "search", class: "spro-campo fav-busca", placeholder: "Buscar por número, título, tipo, etiqueta ou nota", "aria-label": "Buscar nos favoritos" });
    let espera: ReturnType<typeof setTimeout> | undefined;
    busca.addEventListener("input", () => {
      clearTimeout(espera);
      espera = setTimeout(() => this.filtrar({ ...this.filtro, busca: busca.value || undefined }), 150);
    });
    this.el = {
      faixas: h("div", { class: "fav-faixas" }),
      abas: h("div", { class: "fav-abas", role: "tablist", "aria-label": "Listas" }),
      filtros: h("div"),
      lote: h("div", { hidden: true }),
      corpo: h("div", { class: "fav-corpo" }),
    };
    raiz.replaceChildren(
      this.el.faixas,
      h("header", { class: "fav-topo" }, this.el.abas, this.menu()),
      h("div", { class: "fav-ferramentas" }, busca, this.el.filtros),
      this.el.lote,
      this.el.corpo,
    );
  }

  private get repo(): RepositorioFavoritos {
    return (this.lista === "unidade" ? this.d.repos.unidade : null) ?? this.d.repos.pessoal;
  }

  private get sigla(): string {
    return this.d.ctx.unidade?.sigla || "Unidade";
  }

  /** O content script já entrega minúsculo; aqui se garante, porque as chaves dependem disso. */
  private get login(): string {
    return this.d.ctx.login.toLowerCase();
  }

  private get outra(): { repo: RepositorioFavoritos; rotulo: string } | null {
    const u = this.d.repos.unidade;
    if (!u) return null;
    return this.lista === "unidade" ? { repo: this.d.repos.pessoal, rotulo: "Pessoal" } : { repo: u, rotulo: this.sigla };
  }

  async iniciar(): Promise<void> {
    this.prefs = await lerPreferencias(this.d.sync);
    await Promise.all([this.d.repos.unidade?.registrar(), this.d.repos.pessoal.registrar()]);
    await this.recarregar();
    for (const r of [this.d.repos.unidade, this.d.repos.pessoal]) r?.aoMudar(() => this.agendarRecarga());
    this.d.sync.aoMudar((m) => {
      if (CHAVE_PREFERENCIAS in m) {
        void lerPreferencias(this.d.sync).then((p) => {
          this.prefs = p;
          this.redesenhar();
        });
      }
    });
    await this.verificarFaixaUnidade();
    await this.oferecerMigracao(false);
    void this.repo.limpar().catch(() => undefined);
  }

  private agendarRecarga(): void {
    if (this.recargaAgendada) return;
    this.recargaAgendada = true;
    setTimeout(() => {
      this.recargaAgendada = false;
      void this.recarregar();
    }, 30);
  }

  async recarregar(): Promise<void> {
    const [todos, pastas, etiquetas, daUnidade, pessoais] = await Promise.all([
      this.repo.todos(),
      this.repo.pastasAtivas(),
      this.repo.etiquetasAtivas(),
      this.d.repos.unidade ? this.d.repos.unidade.ativos() : Promise.resolve([]),
      this.d.repos.pessoal.ativos(),
    ]);
    this.todos = todos;
    this.pastas = pastas;
    this.etiquetas = etiquetas;
    this.contagem = { unidade: daUnidade.length, pessoal: pessoais.length };
    for (const id of [...this.selecao]) if (!todos.some((f) => f.id === id && f.removidoEm === undefined)) this.selecao.delete(id);
    this.redesenhar();
  }

  private readonly resumo = (f: Favorito): ResumoPrazo | undefined => (f.prazo ? calcularPrazo(f.prazo, this.d.hoje()) : undefined);

  private visiveis(): Favorito[] {
    const apoio = { etiquetas: new Map(this.etiquetas.map((e) => [e.id, e])), resumo: this.resumo };
    return ordenar(filtrar(this.todos, this.filtro, apoio), this.prefs.ordem, this.resumo);
  }

  private filtrar(f: Filtro): void {
    this.filtro = f;
    this.redesenhar();
  }

  private redesenhar(): void {
    this.desenharAbas();
    this.el.filtros.replaceChildren(
      renderFiltros(
        { filtro: this.filtro, ordem: this.prefs.ordem, agrupar: this.prefs.agruparPorPasta, pastas: this.pastas, etiquetas: this.etiquetas },
        {
          filtrar: (f) => this.filtrar(f),
          ordenar: (m) => void gravarPreferencias(this.d.sync, { ordem: m }),
          agrupar: (v) => void gravarPreferencias(this.d.sync, { agruparPorPasta: v }),
          selecionarTodos: () => {
            for (const f of this.visiveis()) this.selecao.add(f.id);
            this.redesenhar();
          },
        },
      ),
    );
    if (this.visao === "lixeira") {
      this.el.lote.hidden = true;
      this.el.corpo.replaceChildren(
        montarLixeira(this.todos, Date.now(), {
          restaurar: async (id) => {
            await this.repo.restaurar([id]);
          },
          voltar: () => {
            this.visao = "lista";
            this.redesenhar();
          },
        }),
      );
      return;
    }
    const itens = this.visiveis();
    this.desenharLote(itens);
    const pastas = new Map(this.pastas.map((p) => [p.id, p]));
    const etiquetas = new Map(this.etiquetas.map((e) => [e.id, e]));
    const manual = this.prefs.ordem === "manual" && !this.prefs.agruparPorPasta;
    const temAlgum = this.todos.some((f) => f.removidoEm === undefined);
    this.el.corpo.replaceChildren(
      renderLista({
        itens,
        agrupar: this.prefs.agruparPorPasta,
        pastas: this.pastas,
        apoio: (f) => ({ pastas, etiquetas, resumo: this.resumo(f), selecionado: this.selecao.has(f.id), arrastavel: manual, outraLista: this.outra?.rotulo ?? null }),
        acoes: this.acoesItem(itens.map((f) => f.id)),
        reordenar: manual ? (id, antes, depois) => void this.repo.mover(id, antes, depois) : undefined,
        vazio: temAlgum
          ? "Nenhum favorito com esses filtros."
          : "Nenhum favorito nesta lista ainda. Clique na estrela ao lado de um processo, no Controle de Processos ou na árvore, para guardá-lo aqui.",
      }),
    );
  }

  private desenharAbas(): void {
    const aba = (lista: TipoLista, rotulo: string) =>
      h(
        "button",
        {
          type: "button",
          role: "tab",
          class: "spro-botao",
          "aria-selected": String(this.lista === lista && this.visao === "lista"),
          onclick: () => {
            this.lista = lista;
            this.visao = "lista";
            this.selecao.clear();
            this.filtro = { busca: this.filtro.busca };
            void this.recarregar();
          },
        },
        rotulo,
      );
    this.el.abas.replaceChildren(
      ...(this.d.repos.unidade ? [aba("unidade", `${this.sigla} (${this.contagem.unidade})`)] : []),
      aba("pessoal", `Pessoal (${this.contagem.pessoal})`),
    );
  }

  private selecionados(): Favorito[] {
    return this.todos.filter((f) => this.selecao.has(f.id) && f.removidoEm === undefined);
  }

  private desenharLote(visiveis: Favorito[]): void {
    const qtd = visiveis.filter((f) => this.selecao.has(f.id)).length;
    this.el.lote.hidden = qtd === 0;
    if (!qtd) {
      this.el.lote.replaceChildren();
      return;
    }
    const outra = this.outra;
    this.el.lote.replaceChildren(
      renderLote(qtd, this.pastas, this.etiquetas, {
        moverPasta: (pasta) => void this.emLote((f) => this.repo.editar(f.id, { pasta })),
        etiquetar: (id) => void this.emLote((f) => this.repo.editar(f.id, { etiquetas: [...f.etiquetas, id] })),
        copiar: () => void this.d.copiar(this.selecionados().map((f) => f.protocolo).join("\n")).then(() => avisar("Números copiados.")),
        csv: () => this.baixarCsv(this.selecionados()),
        remover: () => void this.remover(this.selecionados().map((f) => f.id)),
        limpar: () => {
          this.selecao.clear();
          this.redesenhar();
        },
        outraLista: outra ? { rotulo: outra.rotulo, mover: () => void this.moverParaOutra(this.selecionados().map((f) => f.id)) } : null,
      }),
    );
  }

  private async emLote(fazer: (f: Favorito) => Promise<unknown>): Promise<void> {
    for (const f of this.selecionados()) await fazer(f);
  }

  private acoesItem(ids: string[]): AcoesItem {
    return {
      abrir: (f, novaAba) => void this.d.rpc.chamar("abrirProcesso", { id: f.id, protocolo: f.protocolo, novaAba }).catch((e: Error) => avisar(e.message)),
      editar: (f) => this.abrirEditor(f),
      alternarSelecao: (f, marcado) => {
        if (marcado) this.selecao.add(f.id);
        else this.selecao.delete(f.id);
        this.desenharLote(this.visiveis());
      },
      remover: (f) => void this.remover([f.id]),
      moverLista: (f) => void this.moverParaOutra([f.id]),
      moverOrdem: (f, direcao) => {
        const v = vizinhosAoMover(ids, f.id, direcao);
        if (!v) return;
        if (this.prefs.ordem !== "manual") void gravarPreferencias(this.d.sync, { ordem: "manual" });
        void this.repo.mover(f.id, v[0], v[1]);
      },
    };
  }

  private async remover(ids: string[]): Promise<void> {
    const repo = this.repo;
    const n = await repo.remover(ids);
    this.selecao.clear();
    avisar(`${n} ${n === 1 ? "favorito foi" : "favoritos foram"} para a lixeira.`, { rotulo: "Desfazer", fazer: () => void repo.restaurar(ids) });
  }

  private async moverParaOutra(ids: string[]): Promise<void> {
    const outra = this.outra;
    if (!outra) return;
    for (const id of ids) await moverEntreListas(this.repo, outra.repo, id);
    this.selecao.clear();
    avisar(`Movido para ${outra.rotulo}.`);
  }

  private baixarCsv(itens: Favorito[]): void {
    const rotulo = this.lista === "unidade" ? this.sigla : "Pessoal";
    const csv = gerarCsv(
      linhasCsv(itens, { pastas: new Map(this.pastas.map((p) => [p.id, p])), etiquetas: new Map(this.etiquetas.map((e) => [e.id, e])), resumo: this.resumo, lista: rotulo }),
    );
    this.d.baixar(`favoritos-${rotulo}-${this.d.hoje()}.csv`, csv, "text/csv;charset=utf-8");
  }

  private abrirEditor(f: Favorito): void {
    let modal: { fechar(): void } | null = null;
    const conteudo = montarEditor({
      favorito: f,
      pastas: this.pastas,
      etiquetas: this.etiquetas,
      hoje: this.d.hoje(),
      salvar: async (m) => {
        await this.repo.editar(f.id, m);
      },
      criarPasta: (nome) => this.repo.criarPasta(nome),
      criarEtiqueta: (nome) => this.repo.criarEtiqueta(nome),
      fechar: () => modal?.fechar(),
    });
    modal = this.d.abrirModal({ titulo: `Favorito ${f.protocolo}`, conteudo });
  }

  private async abrirGerenciar(): Promise<void> {
    const repo = this.repo;
    const conteudo = await montarGerenciar({
      listar: async () => ({ pastas: await repo.pastasAtivas(), etiquetas: await repo.etiquetasAtivas() }),
      criarPasta: (n) => repo.criarPasta(n),
      editarPasta: (id, m) => repo.editarPasta(id, m),
      removerPasta: (id) => repo.removerPasta(id),
      criarEtiqueta: (n) => repo.criarEtiqueta(n),
      editarEtiqueta: (id, m) => repo.editarEtiqueta(id, m),
      removerEtiqueta: (id) => repo.removerEtiqueta(id),
      confirmar: (t) => this.d.confirmar(t),
    });
    this.d.abrirModal({ titulo: `Pastas e etiquetas — ${this.lista === "unidade" ? this.sigla : "Pessoal"}`, conteudo });
  }

  private menu(): HTMLElement {
    const detalhes = h("details", { class: "fav-menu-topo" });
    const item = (rotulo: string, fazer: () => void) =>
      h(
        "button",
        {
          type: "button",
          role: "menuitem",
          onclick: () => {
            detalhes.removeAttribute("open");
            fazer();
          },
        },
        rotulo,
      );
    const perguntar = h("input", {
      type: "checkbox",
      onchange: (ev) => void gravarPreferencias(this.d.sync, { perguntarAoFavoritar: (ev.target as HTMLInputElement).checked }),
    });
    void lerPreferencias(this.d.sync).then((p) => {
      perguntar.checked = p.perguntarAoFavoritar;
    });
    detalhes.append(
      h("summary", { title: "Opções", "aria-label": "Opções dos favoritos" }, icone("ajustes", 18)),
      h(
        "div",
        { class: "fav-menu-lista", role: "menu" },
        item("Pastas e etiquetas", () => void this.abrirGerenciar()),
        item("Lixeira", () => {
          this.visao = "lixeira";
          this.redesenhar();
        }),
        item("Exportar arquivo (.json)", () => void this.exportar()),
        item("Importar arquivo", () => void this.importar()),
        item("Trazer favoritos da versão anterior", () => void this.oferecerMigracao(true)),
        h("label", { class: "fav-menu-opcao" }, perguntar, "Perguntar pasta e etiquetas ao favoritar"),
      ),
    );
    return detalhes;
  }

  private async exportar(): Promise<void> {
    const env = await exportarTudo(this.d.area, this.d.ctx.host, this.login, this.d.carimbo());
    this.d.baixar(`favoritos-seipro-${this.login}-${this.d.hoje()}.json`, JSON.stringify(env, null, 2), "application/json");
  }

  private async importar(): Promise<void> {
    const texto = await this.d.escolherArquivo();
    if (!texto) return;
    let bruto: unknown;
    try {
      bruto = JSON.parse(texto.replace(/^﻿/, ""));
    } catch {
      avisar("O arquivo escolhido não é um JSON válido.");
      return;
    }
    const lido = lerEnvelope(bruto);
    if (lido) {
      const r = await importarEnvelope(this.d.area, lido.envelope, this.d.carimbo, { host: this.d.ctx.host, login: this.login });
      const extra = [lido.descartados ? `${lido.descartados} itens ilegíveis ignorados` : "", r.deOutro ? `${r.deOutro} listas de outro usuário ignoradas` : ""].filter(Boolean).join("; ");
      avisar(`${r.novos} novos e ${r.atualizados} atualizados.${extra ? ` (${extra})` : ""}`);
      return;
    }
    if (Array.isArray((bruto as { favorites?: unknown })?.favorites)) {
      await this.mostrarMigracao([bruto], true);
      return;
    }
    avisar("Este arquivo não é um arquivo de favoritos do SEI Pro.");
  }

  private async oferecerMigracao(forcar: boolean): Promise<void> {
    const chave = chaveMigracao(this.d.ctx.host, this.login);
    if (!forcar && (await this.d.area.obter(chave))[chave]) return;
    let fontes: { local?: unknown; arquivo?: unknown };
    try {
      fontes = await this.d.rpc.chamar("lerLegado", undefined, 5000);
    } catch {
      if (forcar) avisar("Não foi possível ler os favoritos antigos nesta tela.");
      return;
    }
    await this.mostrarMigracao([fontes.local, fontes.arquivo], forcar);
  }

  /** Fontes em ordem de preferência: o que já está na primeira não é trazido de novo das seguintes. */
  private async mostrarMigracao(fontes: unknown[], forcar: boolean): Promise<void> {
    const chave = chaveMigracao(this.d.ctx.host, this.login);
    const agora = Date.now();
    const vistos = new Set<string>();
    const lotes = fontes.map((b) => {
      const r = converterLegado(b, { agora });
      const favoritos = r.favoritos.filter((f) => !vistos.has(f.id));
      for (const f of favoritos) vistos.add(f.id);
      return { ...r, favoritos };
    });
    if (!vistos.size) {
      if (forcar) avisar("Não há favoritos da versão anterior neste navegador.");
      return;
    }
    let modal: { fechar(): void } | null = null;
    const conteudo = montarMigracao({
      quantidade: vistos.size,
      amostra: lotes.flatMap((l) => l.favoritos.map((f) => f.protocolo)).slice(0, 3),
      siglaUnidade: this.d.repos.unidade ? this.sigla : null,
      trazer: async (destino) => {
        const repo = (destino === "unidade" ? this.d.repos.unidade : null) ?? this.d.repos.pessoal;
        let novos = 0;
        for (const l of lotes) novos += (await repo.importar(l)).novos;
        await this.d.area.gravar({ [chave]: { em: Date.now(), quantidade: vistos.size, destino } });
        modal?.fechar();
        avisar(`${novos} favoritos trazidos para ${destino === "unidade" ? this.sigla : "Pessoal"}.`);
      },
      adiar: async () => {
        await this.d.area.gravar({ [chave]: { adiadoEm: Date.now() } });
        modal?.fechar();
      },
    });
    modal = this.d.abrirModal({ titulo: "Favoritos da versão anterior", conteudo });
  }

  private async verificarFaixaUnidade(): Promise<void> {
    const u = this.d.ctx.unidade;
    if (!u) return;
    const chave = chaveUltimaUnidade(this.d.ctx.host, this.login);
    const ultima = (await this.d.area.obter(chave))[chave] as { id?: string; sigla?: string } | undefined;
    await this.d.area.gravar({ [chave]: { id: u.id, sigla: u.sigla } });
    if (!ultima?.id || ultima.id === u.id || this.prefs.faixaUnidadeDispensada) return;
    const faixa: HTMLElement = h(
      "div",
      { class: "fav-faixa", role: "note" },
      h("span", {}, `Você está na unidade ${u.sigla}: estes são os favoritos desta unidade. Os da ${ultima.sigla ?? "unidade anterior"} continuam guardados, e a lista Pessoal aparece em todas.`),
      h("button", { type: "button", class: "spro-botao", onclick: () => faixa.remove() }, "Entendi"),
      h(
        "button",
        {
          type: "button",
          class: "spro-botao",
          onclick: () => {
            faixa.remove();
            void gravarPreferencias(this.d.sync, { faixaUnidadeDispensada: true });
          },
        },
        "Não mostrar de novo",
      ),
    );
    this.el.faixas.append(faixa);
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd "$W/favoritos" && npm run verificar && npm run tipos && npx biome check --write src tests && npm run checar`
Expected: todas as checagens `ok`.

Se algum caso falhar por tempo (`tique`), aumente o `tique` do teste, nunca o `setTimeout` do código. As recargas são agendadas a 30 ms e a busca a 150 ms.

- [ ] **Step 5: Commit**

```bash
cd "$W"
git add favoritos/src/app/app.ts favoritos/src/app/aviso.ts favoritos/tests/verificar-app.ts favoritos/tests/verificar.ts
git commit -m "Favoritos: app montado (listas, lote, editar, lixeira, migracao e aviso de troca de unidade)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 19: Ligar tudo — entradas, build, manifest Lab, legado desligado e validação ao vivo (prova P2)

**Files:**
- Create: `favoritos/src/app/ponte.ts`, `favoritos/src/app/altura.ts`, `favoritos/src/app/main.ts`, `favoritos/src/pagina/main.ts`, `favoritos/build.mjs`, `favoritos/estatico/favoritos.html`, `favoritos/estatico/favoritos.css`
- Modify: `dist/manifest.json` (content script novo e `web_accessible_resources`)
- Modify: `dist/js/init.js`, na linha que faz `$.getScript(getUrlExtension("js/sei-pro-favoritos.js"))`
- Modify: `dist/js/sei-pro.js`, na linha `if (checkConfigValue('gerenciarfavoritos')) appendStarOnProcess();`
- Generated (versionados): `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`, `dist/html/favoritos.html`, `dist/css/favoritos.css`
- Create: `docs/superpowers/specs/2026-10-01-favoritos-provas.md` (resultado das provas ao vivo)

**Interfaces:**
- Consumes: tudo das tarefas anteriores.
- Produces: o pacote Lab com o favoritos novo no lugar do antigo.

- [ ] **Step 1: A ponte e a altura do app**

`favoritos/src/app/ponte.ts`:
```ts
/**
 * O app (iframe abaixo da lista) aceita a porta do content script da PRÓPRIA
 * aba, do frame de topo. O `onConnect` chega a todas as páginas da extensão
 * (os iframes do favoritos em outras abas e o painel lateral também), e cada
 * uma recusa o que não é seu. Uma porta `chrome.runtime` não pode ser forjada
 * pela página do SEI, ao contrário de um `postMessage` com token na URL do iframe.
 *
 * Se `chrome.tabs.getCurrent` não responder dentro do iframe (prova P2), vale
 * a origem do pai (`document.referrer`), aceitando a primeira porta dessa origem.
 */

import { criarRpc, type Rpc } from "@comum/ponte/rpc";
import { CANAL_FAVORITOS } from "../modelo/constantes";

export function esperarConexaoDaAba(): Promise<Rpc> {
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
      if (porta.name !== CANAL_FAVORITOS || aceita) return;
      void minhaAba.then((aba) => {
        const s = porta.sender;
        const daAba = aba !== undefined ? s?.tab?.id === aba : !!origemPai && !!s?.url && new URL(s.url).origin === origemPai;
        if (aceita || !daAba || s?.frameId !== 0) {
          porta.disconnect();
          return;
        }
        aceita = true;
        console.info("[SEI Pro] favoritos conectado", aba !== undefined ? "pela aba" : "pela origem");
        ok(criarRpc(porta));
      });
    });
  });
}
```

`favoritos/src/app/altura.ts`:
```ts
import type { Rpc } from "@comum/ponte/rpc";

/**
 * O iframe abaixo da lista cresce com o conteúdo (a página do SEI rola, não o
 * iframe). Enquanto um <dialog> está aberto, pede-se uma altura mínima: o
 * diálogo vive dentro do iframe e seria cortado.
 */
export function observarAltura(rpc: Pick<Rpc, "chamar">): { minimo(px: number): void } {
  const app = document.getElementById("app") ?? document.body;
  let minimo = 0;
  let ultima = 0;
  const enviar = () => {
    const px = Math.max(Math.ceil(app.getBoundingClientRect().height) + 4, minimo);
    if (px === ultima) return;
    ultima = px;
    void rpc.chamar("altura", { px }).catch(() => undefined);
  };
  new ResizeObserver(enviar).observe(app);
  enviar();
  return {
    minimo(px) {
      minimo = px;
      enviar();
    },
  };
}
```

- [ ] **Step 2: Entrada do app e página estática**

`favoritos/src/app/main.ts`:
```ts
/**
 * Entrada de html/favoritos.html. Liga o app ao navegador: <dialog>, download,
 * área de transferência, seletor de arquivo e a porta com a aba do SEI.
 */

import { areaChrome } from "@comum/armazenamento/area";
import { idDispositivo } from "@comum/armazenamento/dispositivo";
import { hojeISO } from "@comum/datas/dias";
import { h, icone } from "@comum/ui/dom";
import { escoposDoContexto } from "../modelo/escopo";
import type { ContextoAba } from "../modelo/tipos";
import { RepositorioFavoritos } from "../repositorio";
import { observarAltura } from "./altura";
import { type AbrirModal, AppFavoritos } from "./app";
import { esperarConexaoDaAba } from "./ponte";

// O ouvinte da porta é registrado já, antes do `load` do iframe, que é quando o content script conecta.
const conexao = esperarConexaoDaAba();

void iniciar().catch((e) => {
  document.getElementById("app")?.replaceChildren(h("p", { class: "fav-erro" }, `Não foi possível abrir os favoritos: ${e instanceof Error ? e.message : String(e)}`));
});

async function iniciar(): Promise<void> {
  const rpc = await conexao;
  const ctx = await rpc.chamar<ContextoAba>("contexto");
  document.documentElement.dataset.tema = ctx.temaEscuro ? "escuro" : "claro";
  const area = areaChrome(chrome.storage.local, "local");
  const sync = areaChrome(chrome.storage.sync, "sync");
  const dispositivo = await idDispositivo(area);
  const carimbo = () => ({ agora: Date.now(), dispositivo });
  const esc = escoposDoContexto(ctx);
  const repos = {
    unidade: esc.unidade ? new RepositorioFavoritos(area, esc.unidade, carimbo) : null,
    pessoal: new RepositorioFavoritos(area, esc.pessoal, carimbo),
  };
  const altura = observarAltura(rpc);

  const abrirModal: AbrirModal = ({ titulo, conteudo, aoFechar }) => {
    const dlg = h("dialog", { class: "spro-dialogo", "aria-label": titulo });
    const fechar = () => {
      if (dlg.open) dlg.close();
    };
    dlg.append(
      h("header", {}, h("h2", {}, titulo), h("button", { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", onclick: fechar }, icone("fechar", 16))),
      h("div", { class: "spro-dialogo-corpo" }, conteudo),
    );
    dlg.addEventListener("close", () => {
      dlg.remove();
      altura.minimo(0);
      aoFechar?.();
    });
    document.body.append(dlg);
    altura.minimo(640);
    dlg.showModal();
    return { fechar };
  };

  const confirmar = (texto: string) =>
    new Promise<boolean>((ok) => {
      let resposta = false;
      let modal: { fechar(): void } | null = null;
      const corpo = h(
        "div",
        {},
        h("p", {}, texto),
        h(
          "div",
          { class: "spro-dialogo-rodape" },
          h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
          h(
            "button",
            {
              type: "button",
              class: "spro-botao perigo",
              onclick: () => {
                resposta = true;
                modal?.fechar();
              },
            },
            "Confirmar",
          ),
        ),
      );
      modal = abrirModal({ titulo: "Confirmar", conteudo: corpo, aoFechar: () => ok(resposta) });
    });

  const baixar = (nome: string, conteudo: string, tipo: string) => {
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    const a = h("a", { href: url, download: nome });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  const escolherArquivo = () =>
    new Promise<string | null>((ok) => {
      const i = h("input", { type: "file", accept: ".json,application/json" });
      i.addEventListener("change", async () => ok(i.files?.[0] ? await i.files[0].text() : null));
      i.addEventListener("cancel", () => ok(null));
      i.click();
    });

  const app = new AppFavoritos(document.getElementById("app")!, {
    rpc,
    ctx,
    area,
    sync,
    repos,
    carimbo,
    abrirModal,
    confirmar,
    baixar,
    copiar: (texto) => navigator.clipboard.writeText(texto),
    escolherArquivo,
    hoje: () => hojeISO(),
  });
  await app.iniciar();
}
```

`favoritos/estatico/favoritos.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Favoritos do SEI Pro</title>
    <link rel="stylesheet" href="../css/favoritos.css" />
  </head>
  <body>
    <div id="app" aria-live="polite"></div>
    <script type="module" src="../js/favoritos/app.js"></script>
  </body>
</html>
```

`favoritos/estatico/favoritos.css` (vem depois do `base.css` no arquivo gerado):
```css
html, body { margin: 0; padding: 0; background: var(--spro-fundo); color: var(--spro-texto); font: 13px/1.4 var(--spro-fonte); }
#app { padding: 8px 10px 12px; display: grid; gap: 8px; }
.fav-topo { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.fav-abas { display: flex; gap: 4px; flex-wrap: wrap; }
.fav-abas [aria-selected="true"] { border-color: var(--spro-destaque); color: var(--spro-destaque); font-weight: 600; }
.fav-ferramentas, .fav-filtros { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.fav-busca { flex: 1 1 240px; }
.fav-agrupar, .fav-menu-opcao { display: inline-flex; gap: 4px; align-items: center; font-size: 12px; color: var(--spro-suave); }
.fav-lote { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 6px 8px; background: var(--spro-fundo-2); border-radius: var(--spro-raio); }
.fav-lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.fav-item {
  display: grid; grid-template-columns: auto auto minmax(0, 1fr) auto auto; gap: 8px; align-items: center;
  padding: 6px 8px; border: 1px solid transparent; border-radius: var(--spro-raio);
}
.fav-item:hover { background: var(--spro-fundo-2); }
.fav-item.arrastando { opacity: 0.5; }
.fav-item.alvo-antes { box-shadow: inset 0 2px 0 var(--spro-destaque); }
.fav-item.alvo-depois { box-shadow: inset 0 -2px 0 var(--spro-destaque); }
.fav-alca { cursor: grab; color: var(--spro-suave); display: inline-flex; }
.fav-principal { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; min-width: 0; }
.fav-protocolo { font-weight: 600; color: var(--spro-destaque); text-decoration: none; white-space: nowrap; }
.fav-protocolo:hover { text-decoration: underline; }
.fav-titulo {
  all: unset; cursor: pointer; color: var(--spro-texto); max-width: 100%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.fav-titulo:focus-visible { outline: 2px solid var(--spro-destaque); border-radius: 3px; }
.fav-selo { font-size: 11px; padding: 0 6px; border-radius: 999px; background: var(--spro-fundo-2); color: var(--spro-suave); }
.fav-meta { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; justify-content: flex-end; }
.fav-pasta { display: inline-flex; gap: 3px; align-items: center; color: var(--spro-suave); font-size: 12px; }
.fav-etiqueta { padding: 0 7px; border-radius: 999px; font-size: 11px; background: var(--cor); color: var(--cor-texto, #1f2328); }
.fav-prazo { display: inline-flex; gap: 3px; align-items: center; font-size: 12px; padding: 0 6px; border-radius: 999px; background: var(--spro-fundo-2); }
.fav-prazo-atrasado { color: var(--spro-perigo); }
.fav-prazo-hoje { color: var(--spro-aviso); font-weight: 600; }
.fav-prazo-noPrazo { color: var(--spro-ok); }
.fav-nota { color: var(--spro-suave); display: inline-flex; }
.fav-menu, .fav-menu-topo { position: relative; }
.fav-menu summary, .fav-menu-topo summary {
  list-style: none; cursor: pointer; display: inline-flex; padding: 3px; border-radius: var(--spro-raio); color: var(--spro-suave);
}
.fav-menu summary::-webkit-details-marker, .fav-menu-topo summary::-webkit-details-marker { display: none; }
.fav-menu-lista {
  position: absolute; right: 0; z-index: 5; min-width: 220px; display: grid; padding: 4px;
  background: var(--spro-fundo); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio); box-shadow: 0 6px 18px rgb(0 0 0 / 15%);
}
.fav-menu-lista button { all: unset; padding: 6px 10px; border-radius: 4px; cursor: pointer; }
.fav-menu-lista button:hover, .fav-menu-lista button:focus-visible { background: var(--spro-fundo-2); }
.fav-menu-lista .perigo { color: var(--spro-perigo); }
.fav-menu-opcao { padding: 6px 10px; }
.fav-grupo h3 { margin: 10px 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--spro-suave); }
.fav-vazio { color: var(--spro-suave); padding: 12px 4px; margin: 0; }
.fav-faixa {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 8px 10px;
  background: var(--spro-fundo-2); border-left: 3px solid var(--spro-destaque); border-radius: var(--spro-raio);
}
.fav-faixa span { flex: 1 1 300px; }
.fav-form { display: grid; gap: 10px; }
.fav-form label { display: grid; gap: 3px; font-size: 12px; color: var(--spro-suave); }
.fav-form .linha { display: flex; flex-wrap: wrap; gap: 6px; align-items: end; }
.fav-form fieldset { border: 1px solid var(--spro-borda); border-radius: var(--spro-raio); display: grid; gap: 6px; }
.fav-form h3 { margin: 4px 0 0; font-size: 13px; }
.fav-rotulo { font-size: 12px; color: var(--spro-suave); }
.fav-balao-chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 4px 0; }
.fav-previa { margin: 0; color: var(--spro-suave); font-size: 12px; }
.fav-erro { color: var(--spro-perigo); }
.spro-aviso { position: sticky; top: 0; left: auto; bottom: auto; transform: none; justify-self: center; }
@media (max-width: 520px) {
  .fav-item { grid-template-columns: auto minmax(0, 1fr) auto; }
  .fav-alca { display: none; }
  .fav-meta { grid-column: 2 / 3; justify-content: flex-start; }
}
```

- [ ] **Step 3: Entrada do content script**

`favoritos/src/pagina/main.ts`:
```ts
/**
 * Content script do favoritos (mundo isolado, todos os frames, document_start).
 * Primeiro marca o documento, de forma síncrona, para o legado não carregar o
 * sei-pro-favoritos.js. Depois, já com o DOM, decide o que fazer pela tela:
 * caixa (estrelas + painel no topo), árvore (estrela no número) ou listas
 * (blocos, acompanhamento, sobrestados).
 */

import { type Area, areaChrome } from "@comum/armazenamento/area";
import { idDispositivo } from "@comum/armazenamento/dispositivo";
import { lerOpcaoLegada } from "@comum/opcoes/legadas";
import { criarRpc, type Rpc } from "@comum/ponte/rpc";
import cssBase from "@comum/ui/base.css";
import { lerArquivoAntigo } from "../migracao/fontes";
import { CANAL_FAVORITOS } from "../modelo/constantes";
import { escoposDoContexto } from "../modelo/escopo";
import type { ContextoAba, Favorito, TipoLista } from "../modelo/tipos";
import { gravarPreferencias, lerPreferencias } from "../preferencias";
import { moverEntreListas, RepositorioFavoritos } from "../repositorio";
import { abrirBalao } from "./balao";
import { contextoDe, documentoTopo, temaEscuroLegado } from "./contexto";
import { instalarEstrelaArvore } from "./estrelaArvore";
import { instalarEstrelasCaixa } from "./estrelasCaixa";
import { instalarEstrelasListas } from "./estrelasListas";
import { tratadoresDaAba } from "./executor";
import { marcarAtivo } from "./marca";
import { montarPainel, ordemLegada } from "./painel";
import { ServicoFavoritosPagina } from "./servico";

marcarAtivo(document);

const global = window as unknown as { __seiProFavoritos?: boolean };
if (!global.__seiProFavoritos) {
  global.__seiProFavoritos = true;
  const iniciar = () => void principal().catch((e) => console.warn("[SEI Pro] favoritos:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}

type Repos = { unidade: RepositorioFavoritos | null; pessoal: RepositorioFavoritos };

function qualTela(doc: Document): "caixa" | "arvore" | "listas" | null {
  if (doc.querySelector("#frmProcedimentoControlar")) return "caixa";
  if (doc.querySelector("#topmenu") && doc.querySelector("#divArvore")) return "arvore";
  if (doc.querySelector("#frmRelBlocoProtocoloLista, #frmAcompanhamentoLista, #frmProcedimentoSobrestar")) return "listas";
  return null;
}

async function principal(): Promise<void> {
  const tela = qualTela(document);
  if (!tela) return;
  if (!(await lerOpcaoLegada("gerenciarfavoritos"))) return;
  const topo = documentoTopo();
  const ctx = contextoDe(topo, temaEscuroLegado(localStorage), topo.location?.href);
  if (!ctx) return;
  const area = areaChrome(chrome.storage.local, "local");
  const sync = areaChrome(chrome.storage.sync, "sync");
  const dispositivo = await idDispositivo(area);
  const carimbo = () => ({ agora: Date.now(), dispositivo });
  const esc = escoposDoContexto(ctx);
  const repos: Repos = {
    unidade: esc.unidade ? new RepositorioFavoritos(area, esc.unidade, carimbo) : null,
    pessoal: new RepositorioFavoritos(area, esc.pessoal, carimbo),
  };
  const servico = new ServicoFavoritosPagina({ ...repos, aoAdicionar: (f, repo, ancora) => void perguntar(f, repo, ancora, repos, ctx, sync) });
  await servico.carregar();
  if (tela === "caixa") {
    instalarEstrelasCaixa(document, servico);
    if (window === window.top) await instalarPainel(ctx, sync);
  } else if (tela === "arvore") {
    await instalarEstrelaArvore(document, servico, location.href);
  } else {
    instalarEstrelasListas(document, servico);
  }
}

async function perguntar(f: Favorito, repo: RepositorioFavoritos, ancora: HTMLElement, repos: Repos, ctx: ContextoAba, sync: Area): Promise<void> {
  if (!(await lerPreferencias(sync)).perguntarAoFavoritar) return;
  const lista: TipoLista = repo === repos.unidade ? "unidade" : "pessoal";
  const [pastas, etiquetas] = await Promise.all([repo.pastasAtivas(), repo.etiquetasAtivas()]);
  abrirBalao(
    ancora,
    {
      favorito: f,
      lista,
      siglaUnidade: repos.unidade ? (ctx.unidade?.sigla ?? "Unidade") : null,
      pastas,
      etiquetas,
      temaEscuro: ctx.temaEscuro,
      editar: (m) => repo.editar(f.id, m),
      criarPasta: (nome) => repo.criarPasta(nome),
      criarEtiqueta: (nome) => repo.criarEtiqueta(nome),
      moverPara: async (destino) => {
        const alvo = destino === "unidade" ? repos.unidade : repos.pessoal;
        if (!alvo || alvo === repo) return;
        const movido = await moverEntreListas(repo, alvo, f.id);
        // Reabre o balão já na outra lista (abrirBalao fecha o anterior).
        if (movido) await perguntar(movido, alvo, ancora, repos, ctx, sync);
      },
    },
    cssBase,
  );
}

async function instalarPainel(ctx: ContextoAba, sync: Area): Promise<void> {
  const prefs = await lerPreferencias(sync);
  if (prefs.exibir === "lateral") return;
  const montado = montarPainel(document, {
    urlApp: chrome.runtime.getURL("html/favoritos.html"),
    recolhido: prefs.recolhido,
    ordem: ordemLegada(localStorage),
    aoRecolher: (r) => void gravarPreferencias(sync, { recolhido: r }),
  });
  if (!montado) return;
  const tratadores = tratadoresDaAba({ doc: document, ctx, iframe: montado.iframe, armazenamento: localStorage, lerArquivo: () => lerArquivoAntigo() });
  let rpc: Rpc | null = null;
  // A cada carga do iframe, uma porta nova: o app só aceita a porta da própria aba (app/ponte.ts).
  montado.iframe.addEventListener("load", () => {
    rpc?.fechar();
    rpc = criarRpc(chrome.runtime.connect({ name: CANAL_FAVORITOS }), tratadores);
  });
}
```

- [ ] **Step 4: `build.mjs`**

`favoritos/build.mjs`:
```js
#!/usr/bin/env node
/**
 * Build do Favoritos.
 *
 *   dist/js/init_favoritos.js  content script (IIFE, mundo isolado, todos os frames)
 *   dist/js/favoritos/app.js   app de html/favoritos.html (ESM)
 *   dist/html/favoritos.html   copia de estatico/
 *   dist/css/favoritos.css     sei-comum/src/ui/base.css + estatico/favoritos.css
 *
 * CSS importado no codigo (o balao em Shadow DOM) entra como texto (loader "text").
 */
import { build } from "esbuild";
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");

const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por favoritos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

await rm(join(DIST, "js", "favoritos"), { recursive: true, force: true });
await mkdir(join(DIST, "js", "favoritos"), { recursive: true });

await build({ ...comum, entryPoints: [resolve(AQUI, "src/app/main.ts")], outfile: join(DIST, "js", "favoritos", "app.js"), format: "esm" });
await build({ ...comum, entryPoints: [resolve(AQUI, "src/pagina/main.ts")], outfile: join(DIST, "js", "init_favoritos.js"), format: "iife" });

await copyFile(resolve(AQUI, "estatico/favoritos.html"), join(DIST, "html", "favoritos.html"));
const css = [await readFile(resolve(AQUI, "../sei-comum/src/ui/base.css"), "utf8"), await readFile(resolve(AQUI, "estatico/favoritos.css"), "utf8")].join("\n");
await writeFile(join(DIST, "css", "favoritos.css"), `/* GERADO por favoritos/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css}`);

const kb = async (f) => `${Math.round((await stat(join(DIST, f))).size / 1024)} KB`;
console.log("\nFavoritos -- build");
for (const f of ["js/init_favoritos.js", "js/favoritos/app.js", "css/favoritos.css"]) console.log(`  ${f.padEnd(26)} ${await kb(f)}`);
```

Run: `cd "$W/favoritos" && npm run tipos && npx biome check --write src tests && npm run checar && npm run build`
Expected: os testes passam e o build lista os três arquivos. O content script deve ficar abaixo de ~80 KB; se passar disso, confira se o bundle não puxou `sei-nucleo/src/index.ts` inteiro, porque os imports precisam ser por módulo (`@nucleo/sei`, `@nucleo/dominio/caixa`...).

- [ ] **Step 5: Portões do código gerado**

```bash
cd "$W"
LC_ALL=C grep -c $'[\xc0-\xff]' dist/js/init_favoritos.js dist/js/favoritos/app.js
grep -rnE 'innerHTML|insertAdjacentHTML|document\.write|outerHTML\s*=' favoritos/src sei-comum/src | grep -vE ':[0-9]+:\s*(\*|//)'
```
Expected:
- `0` para os dois arquivos gerados, isto é, nenhum acento cru (no ensaio de 01/10/2026 o build deu 42 KB de content script e 54 KB de app);
- **nenhuma** linha no grep de DOM.

O segundo `grep` descarta comentários: o `dom.ts` diz "SEM innerHTML" num comentário. Ler `outerHTML` em `pagina/contexto.ts` é permitido; o grep só pega atribuição.

- [ ] **Step 6: Desligar o legado quando o novo está ativo (só ASCII)**

Em `dist/js/init.js`, troque a linha
```js
            if (typeof loadFavoritosPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-favoritos.js"));
```
por
```js
            // Favoritos novos (js/init_favoritos.js, pacote Lab) marcam o <html> no document_start: o legado fica de fora.
            if (typeof loadFavoritosPro === 'undefined' && !document.documentElement.hasAttribute('data-seipro-favoritos')) $.getScript(getUrlExtension("js/sei-pro-favoritos.js"));
```

Em `dist/js/sei-pro.js`, troque
```js
                if (checkConfigValue('gerenciarfavoritos')) appendStarOnProcess();
```
por
```js
                if (checkConfigValue('gerenciarfavoritos') && typeof appendStarOnProcess === 'function') appendStarOnProcess();
```

Os outros pontos de chamada já testam se as funções existem (`initPanelFavorites` em `sei-pro.js`, `initAppendIconFavorites` em `sei-pro-all.js`, `parent.insertIconFavorites` em `sei-pro-arvore.js`, `checkPageFavoritosVisualizacao` em `sei-functions-pro.js`). Sem o arquivo carregado, ficam quietos. Conferir: `grep -n "sei-pro-favoritos\|appendStarOnProcess()" dist/js/init.js dist/js/sei-pro.js`.

Depois: `LC_ALL=C grep -c $'[\xc0-\xff]' dist/js/init.js dist/js/sei-pro.js` deve dar o **mesmo** número que antes da edição (o comentário novo não tem acento).

- [ ] **Step 7: Manifest Lab**

Em `dist/manifest.json`, logo depois do bloco do `js/init_agente.js` em `content_scripts`, acrescente:
```json
    {
      "js": [
        "js/init_favoritos.js"
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
```
Copie `matches` e `exclude_matches` do bloco do `init_agente.js` que estiver no arquivo, caso tenham mudado desde 01/10/2026.

Na lista `resources` de `web_accessible_resources` onde está `"html/fluxos.html"`, acrescente:
```json
        "html/favoritos.html",
        "js/favoritos/app.js",
        "css/favoritos.css",
```

Conferir: `node -e "JSON.parse(require('fs').readFileSync('dist/manifest.json','utf8')); console.log('ok')"` deve imprimir `ok`. Os outros manifests (`manifest_seipro.json`, os dos órgãos e os do Firefox) **não** mudam nesta etapa.

- [ ] **Step 8: Validação ao vivo, prova P2 (SEI SP 4.1.5)**

Ambiente e harness:
- SEI SP de Treinamento; credenciais e armadilhas na memória `reference_sei_sp_treinamento.md`.
- Chrome for Testing com puppeteer-core em daemon, na porta 9444, com `browser.installExtension("$W/dist")`; a receita está em `reference_mcp_chrome_extensao.md`.
- Scripts no scratchpad da sessão, **nunca** no repositório.

Atenção: a automação **não** abre páginas da extensão pela URL (memória de 01/10/2026). Os checks abaixo vão na página do SEI; o que é dentro do iframe, quando o harness não alcançar, entra no checklist manual do Step 9.

Roteiro (cada item com `page.evaluate` na aba do SEI, filtrando a aba pelo host):
1. Logar e chegar ao Controle de Processos.
2. `document.documentElement.getAttribute("data-seipro-favoritos") === "1"`.
3. Legado fora: `typeof window.loadFavoritosPro === "undefined"` e `!document.querySelector("#favoriteTablePro")`.
4. Estrelas: `document.querySelectorAll("#tblProcessosRecebidos .spro-fav-estrela, #tblProcessosGerados .spro-fav-estrela").length` igual ao número de linhas `tr[id^="P"]`.
5. Painel: `#panelHomePro > #favoritesPro iframe` existe, e o `src` começa com `chrome-extension://`.
6. O iframe carregou: `page.frames().find(f => f.url().startsWith("chrome-extension://"))` existe, e a altura do iframe ficou **diferente de 120px** depois de 3 s. Isso prova que o app conectou e pediu altura, ou seja, que porta e `contexto` funcionaram.
7. Clique numa estrela com `elementHandle.click()` (gesto real), registrando `page.on("request")`: **zero** requisições ao host do SEI até 2 s depois, e a estrela com `aria-pressed="true"`. Repita numa linha `.processoNaoVisualizado`, se houver, e confira que ela **continua** não visualizada.
8. Abra um processo e, no frame da árvore, confira a estrela ao lado do número.
9. Num bloco interno, na lista de blocos ou no Acompanhamento Especial, confira as estrelas na 3ª coluna.
10. Recarregue e confira que os favoritos continuam lá, porque saíram do `chrome.storage`.

**Ponto de decisão**: se o item 5 ou o 6 falhar porque o iframe da extensão não carrega (por exemplo, `chrome-error://`, CSP do SEI, `ERR_BLOCKED_BY_CLIENT`), **pare e reporte ao autor**. O recuo do spec (desenhar a lista no content script com Shadow DOM, reaproveitando `app/componentes`) muda a Tarefa 19 e precisa de um plano revisado. Se só o `chrome.tabs.getCurrent` falhar dentro do iframe, a ponte já aceita pela origem; registre isso no relatório.

Repita o roteiro no **SEI MJ de homologação 5.0.4** (`hmlsei.mj.gov.br`, **nunca** `sei.mj.gov.br`). O autor faz o login na janela do harness.

Registre o resultado em `docs/superpowers/specs/2026-10-01-favoritos-provas.md`, na seção "P2 — iframe da extensão no SEI": versões, o que passou, o que falhou e as capturas de tela no scratchpad.

- [ ] **Step 9: Checklist manual do autor (Chrome do dia a dia, extensão Lab descompactada)**

Peça ao autor para carregar `$W/dist` e marcar cada item na mesma seção do relatório de provas:
- [ ] Abrir o Controle de Processos. Com favoritos antigos neste navegador, aparece o diálogo "Favoritos da versão anterior". "Trazer para <sigla>" traz todos, e o `localStorage.configDataFavoritesPro` continua lá, intacto.
- [ ] Estrela numa linha: o balão abre com pasta, etiquetas e nota. "Pessoal" move e reabre o balão. Esc e clique fora fecham.
- [ ] No painel: buscar, filtrar, agrupar por pasta, arrastar para reordenar, "Mover para cima" pelo menu, selecionar vários, copiar números, baixar CSV (que abre no Excel com acentos certos), remover e desfazer, Lixeira e restaurar.
- [ ] Editar: título, pasta nova, etiqueta nova, nota, prazo "N dias úteis" com a prévia certa. O diálogo não fica cortado.
- [ ] Exportar o `.json`, apagar um favorito, importar o `.json`: o favorito volta e nada se duplica.
- [ ] Trocar de unidade: a faixa aparece uma vez, a lista é a da outra unidade e a Pessoal continua.
- [ ] Modo noturno do SEI Pro ligado: o painel segue escuro.
- [ ] Desligar "Processos Favoritos" nas opções: some tudo (estrelas e painel), sem erro no console.

- [ ] **Step 10: Commit**

```bash
cd "$W"
git add favoritos/src/app/ponte.ts favoritos/src/app/altura.ts favoritos/src/app/main.ts favoritos/src/pagina/main.ts favoritos/build.mjs favoritos/estatico \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/html/favoritos.html dist/css/favoritos.css \
  dist/js/init.js dist/js/sei-pro.js dist/manifest.json docs/superpowers/specs/2026-10-01-favoritos-provas.md
git commit -m "Favoritos: novo favoritos no pacote Lab (estrelas, painel embutido, migracao) e legado desligado

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 20: Prova P1 — Texto Padrão no 4.1.5 e no 5.0.4 (prepara a F3)

**Files:**
- Create: `sei-nucleo/tests/fixtures/sei41/texto_padrao_listar.html`, `texto_padrao_cadastrar.html`, `texto_padrao_alterar.html`, `texto_padrao_consultar.html`
- Create: `sei-nucleo/tests/fixtures/sei5/` (as mesmas quatro telas, do SEI MJ de homologação)
- Modify: `docs/superpowers/specs/2026-10-01-favoritos-provas.md` (seção "P1 — Texto Padrão")

**Interfaces:**
- Consumes: `sei-nucleo` (`Sei`, `Formulario`, `linkMenu`), via bundle IIFE gerado no scratchpad.
- Produces: fixtures reais e o relatório com o limite de tamanho, o comportamento do filtro de XSS com base64 e a paginação. É a entrada do plano da F3.

**Esta tarefa grava no SEI** (cria e exclui textos padrão de teste) nos dois ambientes de **teste**. Antes do Step 2, peça confirmação explícita ao autor. Use só a unidade TESTE e nomes `[_SEIPRO_PROVA_<n>]`.

- [ ] **Step 1: Gerar o núcleo para injetar na página**

Run: `cd "$W/sei-nucleo" && node build.mjs --saida "<scratchpad>/sei-nucleo.js"`
Expected: `ok <scratchpad>/sei-nucleo.js` (sem minificar, por causa do `--saida`).

O bundle é injetado na aba do SEI com `page.evaluate(conteudoDoArquivo)`. Script de `127.0.0.1` trava pela permissão de rede local (memória do agente). Na página: `const sei = new SeiNucleo.Sei(location.href, () => ({ url: location.href, status: 200, html: document.documentElement.outerHTML, doc: document }))`.

- [ ] **Step 2: Capturar as quatro telas e salvar as fixtures**

Peça confirmação ao autor antes de seguir. Depois:
1. `const lista = await sei.http.obter(sei.linkMenu("texto_padrao_interno_listar"))`. Salve `lista.html` com a primeira linha `<!-- url: ... -->`.
2. Na lista, ache o link de "Novo" (`#btnNovo`, URL no onclick) e abra o cadastro; salve.
3. Crie `[_SEIPRO_PROVA_1]` com conteúdo `<p>prova</p>`, usando `Formulario.de(cadastro, "#frmTextoPadraoInternoCadastro", sei.http).definir({ txtNome, txtDescricao, txaConteudo }).enviar({ botao: "sbmCadastrarTextoPadraoInterno", modos: { txaConteudo: "html" }, sucesso: p => p.url.includes("texto_padrao_interno_listar") })`.
4. Na lista nova, pegue os links de consultar e de alterar da linha **pelo nome exato** e salve as duas telas.
5. Antes de gravar as fixtures, troque todo `infra_hash=[0-9a-f]+` por zeros, **como nas fixtures que já existem**.

- [ ] **Step 3: Medir o limite e o filtro de XSS**

Para cada tamanho de conteúdo em base64url (10 KB, 60 KB, 120 KB, 250 KB e 1 MB):
- gere uma string aleatória `[A-Za-z0-9_-]`;
- quebre em `<p>` de 2.000 caracteres;
- altere `[_SEIPRO_PROVA_1]` pelo formulário de alteração (`sbmAlterarTextoPadraoInterno`);
- leia de volta pelo `consultar` (`#txaConteudo`) e compare **byte a byte**, juntando os `<p>`.

Registre o maior tamanho que voltou idêntico e a mensagem do SEI quando falhar (validação, exceção, truncamento).

Teste também, uma vez cada, um conteúdo com JSON cru (`<p>{"a":"<b>&"}</p>`) e um com acentos e travessão no `<p>` legível. O objetivo é confirmar o que o spec diz sobre `validarXss` e o Latin-1.

Por fim, conte quantos textos padrão a unidade tem e se a lista paginou. O SEI guarda a página atual na sessão (comentário em `sei-functions-pro.js:4227`): confira se o GET da lista volta na página 1.

- [ ] **Step 4: Limpar**

Exclua `[_SEIPRO_PROVA_1]` pela ação de excluir da própria lista. O `onclick` de exclusão da linha traz a URL assinada e a confirmação. Confira que ele sumiu da lista. Repita os Steps 2 a 4 no SEI MJ de homologação 5.0.4, com as fixtures em `sei-nucleo/tests/fixtures/sei5/`.

- [ ] **Step 5: Relatório e commit**

Escreva a seção "P1 — Texto Padrão" em `docs/superpowers/specs/2026-10-01-favoritos-provas.md`:
- versões testadas;
- limite medido (por ambiente);
- comportamento com JSON cru, acentos e base64;
- paginação;
- campos e botões do formulário;
- diferenças entre 4.1.5 e 5.0.4;
- o que muda no spec da F3 (por exemplo, o teto de 100 KB).

```bash
cd "$W"
git add sei-nucleo/tests/fixtures/sei41/texto_padrao_*.html sei-nucleo/tests/fixtures/sei5 docs/superpowers/specs/2026-10-01-favoritos-provas.md
git commit -m "Provas: Texto Padrao no SEI 4.1.5 e 5.0.4 (limite, filtro XSS, paginacao) e fixtures

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Depois deste plano

- **Memória:** atualizar `project_favoritos_ts.md` com o que foi entregue, o resultado das provas P1 e P2 e a branch `feat/favoritos-ts`.
- **DOM seguro, plano 2:** a branch `fix/dom-seguro-plano-2` prevê converter o `sei-pro-favoritos.js` (camadas 3 a 7). Com este plano, esse arquivo será **removido** na F6. Combine com o autor tirá-lo do plano 2.
- **Próximos planos:** F2 (painel com abas + opções; prova P3), F3 (Texto Padrão + arquivo automático; prova P4), F4 (o que mudou, lembretes, documentos favoritos, Enviar Processo, Pesquisa, mapa), F5 (Agente) e F6 (lançamento e remoção do legado). Cada um parte do código e das provas deste.
