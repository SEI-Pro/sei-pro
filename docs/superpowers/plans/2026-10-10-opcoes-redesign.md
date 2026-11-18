# Redesign da página de opções — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a página de opções (`dist/html/options.*`, 1.172 linhas de HTML repetido + jQuery UI) por uma página com visual inspirado no seipro.app, gerada a partir de um schema declarativo, sem mudar o formato do que é gravado em `chrome.storage.sync`.

**Architecture:** Novo pacote TS `opcoes-pagina/` (mesmo padrão de `favoritos/` e `ordem-paineis/`: `src/`, `tests/`, `build.mjs`, esbuild) que gera um único `dist/html/options.js` (IIFE, ASCII). O schema (`schema.ts` + `schema-dados.ts`) é a fonte única das 73 opções; `render.ts` monta o DOM seguro via `h()` de `@comum/ui/dom`; `config.ts` coleta/aplica o `configGeral`; `perfis.ts` cuida da aba Base de Dados; `armazenamento.ts` e `dialogo.ts` cuidam de gravar/avisar. `options.html` vira esqueleto e `page.css` é reescrito com variáveis.

**Tech Stack:** TypeScript 5.9, esbuild 0.25, tsx, linkedom (testes), Biome. Sem jQuery, sem jQuery UI, sem jmespath, sem fontes externas.

**Spec:** `docs/superpowers/specs/2026-10-10-opcoes-redesign-design.md`

**Desvios deliberados da spec (avisar o usuário na entrega):**
1. A spec falava em `options-schema.js`/`options-render.js`/`options-storage.js` soltos em `dist/html/`. Pelo padrão do repo (todo módulo novo é um pacote TS com testes e bundle ASCII), o código-fonte fica em `opcoes-pagina/src/*.ts` e o bundle sai em `dist/html/options.js` — o mesmo nome que os 12 manifests já listam em `web_accessible_resources`, então **nenhum manifest muda**. As responsabilidades são as mesmas da spec.
2. A spec dizia 71 opções; o legado tem **73 controles** `itemConfigGeral_*` (66 em Geral + 7 em Complementos). O teste de paridade usa 73.
3. Remover jQuery UI obriga a trocar `alertaBoxPro` (dialog do jQuery UI) por `<dialog>` nativo e a reescrever a aba Base de Dados sem jQuery.

## Global Constraints

- Contrato de storage inalterado: chave `dataValues` em `chrome.storage.sync`; valor = `JSON.stringify([...perfis, { configGeral: [{name, value}, ...] }])`; `id` do controle = `"itemConfigGeral_" + data-name`.
- Limite de 8192 bytes por item do sync (`LIMITE_ITEM_SYNC`): aviso acima de 80%, bloqueio acima de 100%, mensagens do legado.
- **Nenhuma requisição a host externo** (nada de Google Fonts, CDN, imagem remota). Fontes do sistema (`system-ui`).
- `dist/html/options.js` só com bytes ASCII (esbuild `charset: "ascii"` + conferência byte a byte no `build.mjs`, como no `favoritos/build.mjs`).
- DOM seguro: texto entra por `h()` (nós de texto); proibido `innerHTML` com qualquer dado.
- Tema escuro por `prefers-color-scheme`; respeitar `prefers-reduced-motion`.
- A página roda em 3 contextos: aba própria, `default_popup` e `<iframe>` de 800 px dentro do SEI (`dist/js/sei-pro-all.js:922`). Deve funcionar de ~380 px a ~900 px de largura.
- Produtos: linhas `visivelEm: "lab"` só no `short_name === "SEI Pro Lab"`; `visivelEm: "fora-antaq"` escondidas em `"ANTAQ Pro"` e `"ANTT Pro"`. Linhas escondidas **continuam coletadas** (com o valor padrão) — o legado fazia assim.
- Estilo de código: Biome do pacote (aspas duplas, 2 espaços, 140 colunas). Commits terminam com a linha `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Fora de escopo: cópias whitelabel (`antaq/html`, `whitelabels/antt/antt-pro/html`, `whitelabels/conab/conab/html`), formato de storage, conteúdo novo nas abas além do que o CSS cobre.

## Review Focus

Entradas/condições que a spec implica e que nenhuma tarefa "óbvia" exercita; cada uma tem teste na tarefa dona:

1. **`dataValues` ausente, vazio, JSON corrompido ou sem `configGeral`** → a página abre com os padrões do schema e não lança (Task 4).
2. **Config gravada por versão antiga** (falta uma opção nova; sobra um `name` desconhecido) → a nova fica no padrão do schema, a desconhecida é ignorada, e ao salvar nada some além da desconhecida (Task 2).
3. **Linhas escondidas por produto ou por dependência continuam sendo coletadas** (ex.: `ferramentasia` no ANTAQ Pro; `newdocname` com `newdocdefault` desligado) (Task 2/3).
4. **`newdocsigilo` no formato `id|nivel|rotulo`**: o legado perdia `nivel` e `rotulo` ao salvar pela página (a option guardava só o `id`); aqui o valor completo faz round-trip (Task 2).
5. **Base de Dados:** formulário virgem não vira base; campo obrigatório vazio descarta só aquela base e avisa; remover a **última** base limpa o formulário em vez de apagar o storage inteiro (Task 5). Campos legados (`CLIENT_ID`, `API_KEY`, `spreadsheetId`) preservados no round-trip.

Também cobertos: busca com acento/caixa/`Esc`, switch por teclado, `homepage_url` com `/` final e ausente.

---

## Antes de começar (isolamento)

O working tree principal tem alterações de outra sessão (`_data/icones.yml`, `pages/FAVORITOS.md`...). Trabalhe em worktree e **nunca** use `git add -A`; sempre `git add <caminhos>`.

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro"
git worktree add .claude/worktrees/opcoes-redesign -b feat/opcoes-redesign
cd .claude/worktrees/opcoes-redesign
(cd sei-comum && npm ci)
(cd favoritos && npm ci)
```

Todos os caminhos abaixo são relativos à raiz do worktree.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `opcoes-pagina/package.json`, `tsconfig.json`, `biome.json`, `build.mjs` | Pacote, tipos, lint, bundle ASCII → `dist/html/options.js` |
| `opcoes-pagina/scripts/gerar-schema.mjs` | Ponto de partida único: extrai o schema do HTML legado. **Depois de gerado, o `schema-dados.ts` é mantido à mão; não rode de novo.** |
| `opcoes-pagina/scripts/preview.mjs` + `.preview/` | Página de pré-visualização com `chrome` falso (não vai para o git) |
| `opcoes-pagina/tests/fixtures/options-legado.html` | Cópia congelada do `options.html` legado (referência de paridade) |
| `opcoes-pagina/src/schema.ts` | Tipos (`Opcao`, `Secao`, `Dependencia`) e `todasAsOpcoes()` |
| `opcoes-pagina/src/schema-dados.ts` | As 73 opções em 3 seções + Complementos |
| `opcoes-pagina/src/manual.ts` | `urlManual(homepage, manual)` |
| `opcoes-pagina/src/config.ts` | `coletarConfigGeral`, `aplicarConfigGeral`, dependências, cores dos ícones, contagens |
| `opcoes-pagina/src/render.ts` | `contextoDoManifesto`, `montarLinha`, `montarGeral`, `montarComplementos` |
| `opcoes-pagina/src/busca.ts` | `normalizar`, `filtrar` |
| `opcoes-pagina/src/perfis.ts` | Aba Base de Dados (montar, restaurar, coletar) |
| `opcoes-pagina/src/armazenamento.ts` | `serializar`, `interpretar`, `medirEspaco`, `armazemSync`, arquivo de config |
| `opcoes-pagina/src/dialogo.ts` | `avisar()` com `<dialog>` |
| `opcoes-pagina/src/main.ts` | Cola: contexto, render, abas, busca, botões |
| `dist/html/options.html` | Esqueleto (UTF-8) |
| `dist/html/page.css` | Reescrito com variáveis |
| `dist/html/options.js` | **GERADO** |
| `favoritos/src/opcoes/main.ts` (+ teste, + bundle `dist/js/favoritos/opcoes.js`) | Âncora passa a ser `[data-opcao]` |

---

### Task 1: Pacote, fixture legada, schema e teste de paridade

**Files:**
- Create: `opcoes-pagina/package.json`, `opcoes-pagina/tsconfig.json`, `opcoes-pagina/biome.json`
- Create: `opcoes-pagina/tests/util.ts`, `opcoes-pagina/tests/verificar.ts`, `opcoes-pagina/tests/verificar-schema.ts`
- Create: `opcoes-pagina/tests/fixtures/options-legado.html`
- Create: `opcoes-pagina/scripts/gerar-schema.mjs`
- Create: `opcoes-pagina/src/schema.ts`, `opcoes-pagina/src/schema-dados.ts`

**Interfaces:**
- Produces (`src/schema.ts`):
  ```ts
  export type TipoControle = "chave" | "texto" | "numero" | "selecao";
  export interface Dependencia { de: string; quando: boolean; limparAoEsconder?: boolean }
  export interface Escolha { valor: string; rotulo: string }
  export interface Opcao {
    nome: string; rotulo: string; tipo: TipoControle; icone: string;
    manual?: string;                 // "FAVORITOS" (slug de /pages/) ou URL absoluta
    padrao?: boolean | string | number;
    dependencias?: Dependencia[];
    oculta?: boolean;                // escondida sempre (ainda coletada)
    visivelEm?: "lab" | "fora-antaq";
    min?: number; max?: number; maxLength?: number;
    escolhas?: Escolha[];
  }
  export interface Secao { id: string; titulo: string; opcoes: Opcao[] }
  export function todasAsOpcoes(): Opcao[]   // SECOES_GERAL (em ordem) e depois OPCOES_COMPLEMENTOS
  ```
- Produces (`src/schema-dados.ts`): `SECOES_GERAL: Secao[]` (ids `controle`, `editor`, `arvore`), `OPCOES_COMPLEMENTOS: Opcao[]`.

- [ ] **Step 1: Criar o pacote**

`opcoes-pagina/package.json`:
```json
{
  "name": "sei-pro-opcoes-pagina",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Pagina de opcoes do SEI Pro (html/options.html): schema, renderizador e armazenamento",
  "scripts": {
    "build": "npm run verificar && node build.mjs",
    "build:rapido": "node build.mjs",
    "tipos": "tsc --noEmit",
    "verificar": "tsx tests/verificar.ts",
    "checar": "biome check src tests",
    "preview": "node scripts/preview.mjs"
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

`opcoes-pagina/tsconfig.json` (cópia do `favoritos/tsconfig.json`, só com os aliases que usamos):
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
    "types": ["chrome", "node"],
    "baseUrl": ".",
    "paths": { "@comum/*": ["../sei-comum/src/*"] }
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

`opcoes-pagina/biome.json`: copiar `favoritos/biome.json` byte a byte.

```bash
cp favoritos/biome.json opcoes-pagina/biome.json
cd opcoes-pagina && npm install && cd ..
git check-ignore -v opcoes-pagina/package.json; echo "rc=$? (1 = nao ignorado, correto)"
```

- [ ] **Step 2: Congelar o HTML legado como fixture**

```bash
mkdir -p opcoes-pagina/tests/fixtures
git show HEAD:dist/html/options.html > opcoes-pagina/tests/fixtures/options-legado.html
wc -l opcoes-pagina/tests/fixtures/options-legado.html   # 1172
```

- [ ] **Step 3: Escrever o gerador do schema**

`opcoes-pagina/scripts/gerar-schema.mjs`:
```js
#!/usr/bin/env node
/**
 * PONTO DE PARTIDA, USO UNICO. Extrai o schema da pagina de opcoes legada
 * (tests/fixtures/options-legado.html) para src/schema-dados.ts. Depois de
 * gerado, o schema-dados.ts e mantido a mao: NAO rode de novo, sobrescreve.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";

const AQUI = dirname(fileURLToPath(import.meta.url));
const { document: doc } = parseHTML(readFileSync(join(AQUI, "../tests/fixtures/options-legado.html"), "latin1"));
const norm = (s) => s.replace(/\s+/g, " ").trim();

// Linhas que so aparecem quando outra chave esta ligada/desligada (o legado fazia isso em changeConfigGeral).
const NIVEL = { de: "newdocnivel", quando: false, limparAoEsconder: true };
const PADRAO_DOC = [{ de: "newdocdefault", quando: true }];
const DEPENDENCIAS = {
  reaberturaprogramada_periodo: [{ de: "reaberturaprogramada", quando: true }],
  anotacaocontrolecoluna: [{ de: "mostraranotacaocontrole", quando: true }],
  sortbeforeupload: [{ de: "uploaddocsexternos", quando: true, limparAoEsconder: true }],
  certidaosigilo_nomedoc: [{ de: "certidaosigilo", quando: true }],
  newdocname: PADRAO_DOC,
  newdocobs: PADRAO_DOC,
  newdocespec: PADRAO_DOC,
  newdocformat: PADRAO_DOC,
  newdoctoday: PADRAO_DOC,
  newdocnivel: PADRAO_DOC,
  newproc_selfunidade: PADRAO_DOC,
  newdocsigilo: [...PADRAO_DOC, NIVEL],
};

function opcaoDe(ctrl) {
  const linha = ctrl.closest("tr");
  const nome = ctrl.getAttribute("data-name");
  const tipoAttr = ctrl.getAttribute("type");
  const tipo = ctrl.tagName === "SELECT" ? "selecao" : tipoAttr === "checkbox" ? "chave" : tipoAttr === "number" ? "numero" : "texto";
  const icone = linha
    .querySelector("i.iconPopup")
    .className.split(/\s+/)
    .filter((c) => c && c !== "iconPopup" && !/Color$/.test(c))
    .join(" ");
  const href = linha.querySelector("a[href]")?.getAttribute("href");
  const o = { nome, rotulo: norm(linha.querySelector(".info").textContent), tipo, icone };
  if (href) o.manual = href.match(/\/pages\/([A-Z0-9]+)\.html$/)?.[1] ?? href;
  if (tipo === "chave") o.padrao = ctrl.hasAttribute("checked");
  if (tipo === "numero") {
    o.padrao = Number(ctrl.getAttribute("value"));
    o.min = Number(ctrl.getAttribute("min"));
    o.max = Number(ctrl.getAttribute("max"));
  }
  if (tipo === "texto") {
    o.padrao = ctrl.getAttribute("value") ?? "";
    if (ctrl.getAttribute("maxlength")) o.maxLength = Number(ctrl.getAttribute("maxlength"));
  }
  if (tipo === "selecao") {
    o.escolhas = [...ctrl.querySelectorAll("option")].map((op) => ({ valor: op.getAttribute("value") ?? "", rotulo: norm(op.textContent) }));
    o.padrao = o.escolhas[0]?.valor ?? "";
  }
  if (DEPENDENCIAS[nome]) o.dependencias = DEPENDENCIAS[nome];
  else if ((linha.getAttribute("style") ?? "").includes("display:none")) o.oculta = true;
  if (linha.classList.contains("lab")) o.visivelEm = "lab";
  if (linha.classList.contains("notatq")) o.visivelEm = "fora-antaq";
  return o;
}

const todos = [...doc.querySelectorAll('[id^="itemConfigGeral_"]')];
const complementos = todos.filter((c) => c.closest("#options-complements")).map(opcaoDe);
const IDS = ["controle", "editor", "arvore"];
const secoes = [...doc.querySelectorAll("#accordion > div")].map((corpo, i) => ({
  id: IDS[i],
  titulo: norm(corpo.previousElementSibling.textContent),
  opcoes: [...corpo.querySelectorAll('[id^="itemConfigGeral_"]')].map(opcaoDe),
}));

const nomes = new Set([...complementos, ...secoes.flatMap((s) => s.opcoes)].map((o) => o.nome));
for (const o of [...complementos, ...secoes.flatMap((s) => s.opcoes)])
  for (const d of o.dependencias ?? []) if (!nomes.has(d.de)) throw new Error(`${o.nome} depende de ${d.de}, que nao existe`);

const ts = `/**
 * As opcoes da pagina de configuracoes: fonte unica da verdade. Gerado uma vez a
 * partir do HTML legado (scripts/gerar-schema.mjs) e mantido a mao desde entao.
 * Ordem = ordem de exibicao. O \`nome\` e o data-name gravado em dataValues.
 */
import type { Opcao, Secao } from "./schema";

export const SECOES_GERAL: Secao[] = ${JSON.stringify(secoes, null, 2)};

export const OPCOES_COMPLEMENTOS: Opcao[] = ${JSON.stringify(complementos, null, 2)};
`;
writeFileSync(join(AQUI, "../src/schema-dados.ts"), ts);
console.log(`${complementos.length} complementos, ${secoes.map((s) => `${s.id}=${s.opcoes.length}`).join(" ")}`);
```

- [ ] **Step 4: Escrever `schema.ts` (tipos)**

`opcoes-pagina/src/schema.ts`:
```ts
/**
 * Contrato do schema das opcoes. Os dados ficam em schema-dados.ts.
 *
 * `nome` e o data-name gravado em dataValues; o id do controle e
 * "itemConfigGeral_" + nome (contrato com o storage e com favoritos/opcoes).
 */
import { OPCOES_COMPLEMENTOS, SECOES_GERAL } from "./schema-dados";

export type TipoControle = "chave" | "texto" | "numero" | "selecao";

export interface Dependencia {
  /** `nome` da chave de que a linha depende. */
  de: string;
  /** Valor da chave pai com que a linha aparece. */
  quando: boolean;
  /** Ao esconder por esta regra, a linha volta ao vazio/desmarcado (o legado fazia isso em 2 casos). */
  limparAoEsconder?: boolean;
}

export interface Escolha {
  valor: string;
  rotulo: string;
}

export interface Opcao {
  nome: string;
  rotulo: string;
  tipo: TipoControle;
  /** Classes do Font Awesome, sem cor (a cor vem do estado ligado/desligado). */
  icone: string;
  /** Slug de /pages/ (ex.: "FAVORITOS") ou URL absoluta. */
  manual?: string;
  padrao?: boolean | string | number;
  dependencias?: Dependencia[];
  /** Escondida sempre, mas ainda coletada e gravada. */
  oculta?: boolean;
  visivelEm?: "lab" | "fora-antaq";
  min?: number;
  max?: number;
  maxLength?: number;
  escolhas?: Escolha[];
}

export interface Secao {
  id: string;
  titulo: string;
  opcoes: Opcao[];
}

export { OPCOES_COMPLEMENTOS, SECOES_GERAL };

/** Geral (na ordem das secoes) e depois Complementos. */
export function todasAsOpcoes(): Opcao[] {
  return [...SECOES_GERAL.flatMap((s) => s.opcoes), ...OPCOES_COMPLEMENTOS];
}
```

- [ ] **Step 5: Gerar o schema e conferir**

```bash
node opcoes-pagina/scripts/gerar-schema.mjs
# esperado: "7 complementos, controle=25 editor=13 arvore=28"
(cd opcoes-pagina && npx biome check --write src && npx tsc --noEmit)
grep -c '"nome"' opcoes-pagina/src/schema-dados.ts   # 73
grep -n 'Prescri' opcoes-pagina/src/schema-dados.ts | head -2   # tem de mostrar "Prescrições" com acento (entidade decodificada)
```
Se `Prescri` aparecer como `Prescri&ccedil;...`, o linkedom não decodificou entidades: troque `norm(...)` por uma função que também decodifica `&xxx;` (use `parseHTML("<p>"+s+"</p>").document.querySelector("p").textContent`) e gere de novo.

- [ ] **Step 6: Escrever os utilitários e o teste de paridade (falhando antes dos dados corretos, passando agora)**

`opcoes-pagina/tests/util.ts`:
```ts
export { checar, disparar, escolher, instalarDom, resumo, secao, tique } from "../../sei-comum/tests/util";
```

`opcoes-pagina/tests/verificar-schema.ts`:
```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import { OPCOES_COMPLEMENTOS, SECOES_GERAL, todasAsOpcoes } from "../src/schema";
import { checar, secao } from "./util";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "options-legado.html");
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const nomeDe = (el: Element) => el.getAttribute("data-name") ?? "";

export function verificarSchema(): void {
  secao("schema: paridade com a pagina de opcoes legada");
  const { document: doc } = parseHTML(readFileSync(FIXTURE, "latin1")) as unknown as { document: Document };
  const legados = [...doc.querySelectorAll<HTMLElement>('[id^="itemConfigGeral_"]')];
  const schema = new Map(todasAsOpcoes().map((o) => [o.nome, o]));

  checar("73 opcoes no legado e no schema", legados.length === 73 && schema.size === 73 && todasAsOpcoes().length === 73, {
    legado: legados.length,
    schema: schema.size,
  });

  for (const el of legados) {
    const nome = nomeDe(el);
    const o = schema.get(nome);
    if (!o) {
      checar(`${nome}: existe no schema`, false);
      continue;
    }
    const linha = el.closest("tr") as Element;
    const tipoAttr = el.getAttribute("type");
    const tipo = el.tagName === "SELECT" ? "selecao" : tipoAttr === "checkbox" ? "chave" : tipoAttr === "number" ? "numero" : "texto";
    const padrao =
      tipo === "chave"
        ? el.hasAttribute("checked")
        : tipo === "numero"
          ? Number(el.getAttribute("value"))
          : tipo === "texto"
            ? (el.getAttribute("value") ?? "")
            : (el.querySelector("option")?.getAttribute("value") ?? "");
    const icone = (linha.querySelector("i.iconPopup")?.className ?? "")
      .split(/\s+/)
      .filter((c) => c && c !== "iconPopup" && !/Color$/.test(c))
      .join(" ");
    const href = linha.querySelector("a[href]")?.getAttribute("href") ?? undefined;
    const manual = href ? (/\/pages\/([A-Z0-9]+)\.html$/.exec(href)?.[1] ?? href) : undefined;

    checar(`${nome}: id`, el.getAttribute("id") === `itemConfigGeral_${nome}`);
    checar(`${nome}: tipo`, o.tipo === tipo, { schema: o.tipo, legado: tipo });
    checar(`${nome}: padrao`, o.padrao === padrao, { schema: o.padrao, legado: padrao });
    checar(`${nome}: rotulo`, o.rotulo === norm(linha.querySelector(".info")?.textContent ?? ""), o.rotulo);
    checar(`${nome}: icone`, o.icone === icone, { schema: o.icone, legado: icone });
    checar(`${nome}: manual`, o.manual === manual, { schema: o.manual, legado: manual });
    checar(`${nome}: visibilidade por produto`, (o.visivelEm === "lab") === linha.classList.contains("lab") && (o.visivelEm === "fora-antaq") === linha.classList.contains("notatq"));
    if (tipo === "selecao") checar(`${nome}: escolhas`, (o.escolhas?.length ?? -1) === el.querySelectorAll("option").length);
    if (tipo === "numero") checar(`${nome}: faixa`, o.min === Number(el.getAttribute("min")) && o.max === Number(el.getAttribute("max")));
  }

  const secoesLegado = [...doc.querySelectorAll("#accordion > div")].map((d) => [...d.querySelectorAll('[id^="itemConfigGeral_"]')].map(nomeDe));
  SECOES_GERAL.forEach((s, i) => checar(`secao ${s.id}: mesmas opcoes, mesma ordem`, JSON.stringify(s.opcoes.map((o) => o.nome)) === JSON.stringify(secoesLegado[i])));
  checar(
    "complementos: mesmas opcoes, mesma ordem",
    JSON.stringify(OPCOES_COMPLEMENTOS.map((o) => o.nome)) ===
      JSON.stringify([...doc.querySelectorAll('#options-complements [id^="itemConfigGeral_"]')].map(nomeDe)),
  );

  secao("schema: dependencias");
  const chaves = new Set(todasAsOpcoes().filter((o) => o.tipo === "chave").map((o) => o.nome));
  for (const o of todasAsOpcoes())
    for (const d of o.dependencias ?? []) checar(`${o.nome}: depende de chave existente (${d.de})`, chaves.has(d.de));
  const dep = (n: string) => JSON.stringify(schema.get(n)?.dependencias ?? []);
  checar("sortbeforeupload desmarca ao esconder", dep("sortbeforeupload") === JSON.stringify([{ de: "uploaddocsexternos", quando: true, limparAoEsconder: true }]));
  checar("newdocsigilo: newdocdefault ligado e newdocnivel desligado", dep("newdocsigilo").includes('"newdocnivel","quando":false'));
  checar("salvamentoautomatico fica oculta", schema.get("salvamentoautomatico")?.oculta === true);
}
```

`opcoes-pagina/tests/verificar.ts`:
```ts
import { resumo } from "./util";
import { verificarSchema } from "./verificar-schema";

verificarSchema();
resumo();
```

- [ ] **Step 7: Rodar**

Run: `cd opcoes-pagina && npm run verificar`
Expected: todas as linhas `ok`, final `N ok, 0 falha(s)`. Se `rotulo`/`icone` falhar por diferença de espaços/entidades, corrija o gerador (Step 5) e gere de novo antes de seguir.

- [ ] **Step 8: Commit**

```bash
git add opcoes-pagina/package.json opcoes-pagina/package-lock.json opcoes-pagina/tsconfig.json opcoes-pagina/biome.json \
  opcoes-pagina/scripts/gerar-schema.mjs opcoes-pagina/src opcoes-pagina/tests
git commit -m "Opcoes: pacote opcoes-pagina com schema das 73 opcoes e teste de paridade com o HTML legado" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: `manual.ts` e `config.ts` (coletar, aplicar, dependências, cores)

**Files:**
- Create: `opcoes-pagina/src/manual.ts`, `opcoes-pagina/src/config.ts`
- Create: `opcoes-pagina/tests/verificar-config.ts`
- Modify: `opcoes-pagina/tests/verificar.ts`

**Interfaces:**
- Consumes: `Opcao`, `Dependencia` (Task 1).
- Produces (`manual.ts`): `urlManual(homepage: string, manual: string): string`.
- Produces (`config.ts`):
  ```ts
  export const PREFIXO_ID = "itemConfigGeral_";
  export interface ItemConfig { name: string; value: boolean | string | number }
  export type Controle = HTMLInputElement | HTMLSelectElement;
  export function controleDe(raiz: ParentNode, nome: string): Controle | null;
  export function coletarConfigGeral(raiz: ParentNode): ItemConfig[];
  export function aplicarConfigGeral(raiz: ParentNode, itens: ItemConfig[]): void;
  export function atualizarDependencias(raiz: ParentNode): void;
  export function atualizarCores(raiz: ParentNode): void;
  export function atualizarContagens(raiz: ParentNode): void;
  ```
- **Contrato de DOM** (produzido pelo `render.ts` da Task 3, consumido aqui): cada opção é `div.opcao[data-opcao=<nome>][data-tipo=<tipo>]` contendo `i.ico` e um controle com `data-name=<nome>` e `data-tipo`; linhas dependentes levam `data-depende="de:quando(0|1):limpar(0|1),..."`; os painéis levam `data-aba="geral"` e `data-aba="complementos"`; seções são `details.secao` com `span.contagem` e linhas `div.opcao`. Linhas escondidas por dependência recebem o atributo `data-dep-oculta`; as escondidas por produto/`oculta`, o atributo `hidden`.

- [ ] **Step 1: `manual.ts`**

```ts
/** Slug de /pages/ vira a URL do manual do produto; URL absoluta passa direto. */
export function urlManual(homepage: string, manual: string): string {
  if (/^https?:\/\//.test(manual)) return manual;
  return `${homepage.replace(/\/+$/, "")}/pages/${manual}.html`;
}
```
(O legado concatenava `homepage_url` a hrefs que já eram absolutos desde `4487df2`, gerando `https://seipro.apphttps://seipro.app/pages/...`; guardar só o slug elimina isso.)

- [ ] **Step 2: Escrever o teste de `config` (falha: módulo não existe)**

O teste monta a página real com o `render.ts`, que só existe na Task 3. Para a Task 2 ficar testável sozinha, o teste usa um montador mínimo local que produz o contrato de DOM acima a partir do schema; na Task 3 ele é substituído pelo `render.ts` real (Step 7 da Task 3).

`opcoes-pagina/tests/verificar-config.ts`:
```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import { aplicarConfigGeral, atualizarContagens, coletarConfigGeral, controleDe, type ItemConfig } from "../src/config";
import { urlManual } from "../src/manual";
import { montarMinimo } from "./montar-minimo";
import { checar, instalarDom, secao } from "./util";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "options-legado.html");

/** O que o options.js legado (changeConfigGeral) devolveria para a pagina intocada, calculado direto do HTML legado. */
function esperadoDoLegado(): ItemConfig[] {
  const { document: d } = parseHTML(readFileSync(FIXTURE, "latin1")) as unknown as { document: Document };
  const nome = (e: Element) => e.getAttribute("data-name") as string;
  const chaves = (raiz: string) => [...d.querySelectorAll(`${raiz} input[name="infraAncoraSigla"]`)].map((e) => ({ name: nome(e), value: e.hasAttribute("checked") }));
  const naoVazios = (sel: string) => [...d.querySelectorAll(`#options-functions ${sel}`)].filter((e) => (e.getAttribute("value") ?? "") !== "");
  return [
    ...chaves("#options-functions"),
    ...chaves("#options-complements"),
    ...naoVazios('input[type="text"]').map((e) => ({ name: nome(e), value: e.getAttribute("value") as string })),
    ...naoVazios('input[type="number"]').map((e) => ({ name: nome(e), value: Number.parseInt(e.getAttribute("value") as string, 10) })),
    ...[...d.querySelectorAll("#options-functions select")]
      .map((e) => ({ name: nome(e), value: e.querySelector("option")?.getAttribute("value") ?? "" }))
      .filter((i) => i.value !== ""),
  ];
}

const nomes = (l: ItemConfig[]) => l.map((i) => i.name);
const valor = (l: ItemConfig[], n: string) => l.find((i) => i.name === n)?.value;

export function verificarConfig(): void {
  secao("manual: URL");
  checar("slug + homepage", urlManual("https://seipro.app", "FAVORITOS") === "https://seipro.app/pages/FAVORITOS.html");
  checar("homepage com barra final", urlManual("https://seipro.app/", "PRAZOS") === "https://seipro.app/pages/PRAZOS.html");
  checar("homepage do ANTAQ", urlManual("https://antaqgovbr.github.io/antaq-pro", "AGRUPAR") === "https://antaqgovbr.github.io/antaq-pro/pages/AGRUPAR.html");
  checar("URL absoluta passa direto", urlManual("https://seipro.app", "https://bit.ly/Guia-SEI-Pro-Atividades") === "https://bit.ly/Guia-SEI-Pro-Atividades");

  secao("config: pagina intocada = o que o legado gravava");
  instalarDom();
  const raiz = montarMinimo({ lab: true, foraAntaq: true });
  const atual = coletarConfigGeral(raiz);
  const legado = esperadoDoLegado();
  checar("mesmos itens, mesma ordem", JSON.stringify(atual) === JSON.stringify(legado), { atual: atual.length, legado: legado.length });
  // 62 chaves + 1 texto preenchido (certidaosigilo_nomedoc) + 3 numeros + 3 selects com valor (newdocsigilo, vazio, nao entra)
  checar("69 itens na pagina intocada", atual.length === 69, atual.length);

  secao("config: dependencias");
  const marcar = (r: ParentNode, n: string, v: boolean) => ((controleDe(r, n) as HTMLInputElement).checked = v);
  const oculta = (r: ParentNode, n: string) => (r.querySelector(`[data-opcao="${n}"]`) as Element).hasAttribute("data-dep-oculta");
  marcar(raiz, "reaberturaprogramada", false);
  coletarConfigGeral(raiz);
  checar("periodo escondido com a chave desligada", oculta(raiz, "reaberturaprogramada_periodo"));
  marcar(raiz, "reaberturaprogramada", true);
  coletarConfigGeral(raiz);
  checar("periodo aparece com a chave ligada", !oculta(raiz, "reaberturaprogramada_periodo"));
  marcar(raiz, "uploaddocsexternos", true);
  marcar(raiz, "sortbeforeupload", true);
  marcar(raiz, "uploaddocsexternos", false);
  const s1 = coletarConfigGeral(raiz);
  checar("sortbeforeupload some e desmarca com o pai desligado", oculta(raiz, "sortbeforeupload") && valor(s1, "sortbeforeupload") === false);
  marcar(raiz, "newdocdefault", false);
  const s2 = coletarConfigGeral(raiz);
  checar("newdocdefault desligado esconde a tabela, mas os campos continuam coletados", oculta(raiz, "newdocname") && nomes(s2).includes("newdocformat") && valor(s2, "newdocnivel") === true);

  secao("config: newdocsigilo (id|nivel|rotulo)");
  const r2 = montarMinimo({ lab: false, foraAntaq: true });
  aplicarConfigGeral(r2, [
    { name: "newdocnivel", value: false },
    { name: "newdocsigilo", value: "123|1|Informação restrita" },
  ]);
  const sel = controleDe(r2, "newdocsigilo") as HTMLSelectElement;
  checar("mostra o rotulo", (sel.querySelector("option")?.textContent ?? "") === "Informação restrita");
  checar("round-trip guarda o valor inteiro", valor(coletarConfigGeral(r2), "newdocsigilo") === "123|1|Informação restrita");
  marcar(r2, "newdocnivel", true);
  checar("nivel publico ligado limpa o sigilo", valor(coletarConfigGeral(r2), "newdocsigilo") === undefined);
  const r6 = montarMinimo({ lab: false, foraAntaq: true });
  aplicarConfigGeral(r6, [{ name: "newdocnivel", value: false }, { name: "newdocsigilo", value: "so-um-id" }]);
  checar("valor sem pipes e ignorado (como no legado): o select continua vazio", valor(coletarConfigGeral(r6), "newdocsigilo") === undefined);

  secao("config: aplicar");
  const r3 = montarMinimo({ lab: false, foraAntaq: true });
  const gravado: ItemConfig[] = [
    { name: "gerenciarfavoritos", value: false },
    { name: "debugpage", value: true },
    { name: "newdocname", value: "Anexo" },
    { name: "qualidadeimagens", value: 80 },
    { name: "citacaodoc", value: "citacaodoc_3" },
    { name: "opcao_que_nao_existe_mais", value: true },
  ];
  aplicarConfigGeral(r3, gravado);
  const depois = coletarConfigGeral(r3);
  checar("liga e desliga chaves", valor(depois, "gerenciarfavoritos") === false && valor(depois, "debugpage") === true);
  checar("texto, numero e selecao", valor(depois, "newdocname") === "Anexo" && valor(depois, "qualidadeimagens") === 80 && valor(depois, "citacaodoc") === "citacaodoc_3");
  checar("nome desconhecido e ignorado", !nomes(depois).includes("opcao_que_nao_existe_mais"));
  checar("opcao ausente da config antiga fica no padrao", valor(depois, "gerenciarprazos") === true && valor(depois, "ditado") === true);
  const r4 = montarMinimo({ lab: false, foraAntaq: true });
  aplicarConfigGeral(r4, depois);
  checar("coletar -> aplicar -> coletar e estavel", JSON.stringify(coletarConfigGeral(r4)) === JSON.stringify(depois));

  secao("config: icones e contagens");
  const ico = (r: ParentNode, n: string) => (r.querySelector(`[data-opcao="${n}"] .ico`) as Element).classList;
  checar("chave desligada: icone cinza", ico(r3, "gerenciarfavoritos").contains("desligado") && !ico(r3, "gerenciarfavoritos").contains("ligado"));
  checar("chave ligada: icone azul", ico(r3, "debugpage").contains("ligado"));
  checar("texto preenchido: icone azul", ico(r3, "newdocname").contains("ligado"));
  atualizarContagens(r3);
  const cont = (r3.querySelector('[data-secao="controle"] .contagem') as Element).textContent ?? "";
  checar("contagem 'N de M ativas'", /^\d+ de \d+ ativas$/.test(cont), cont);

  secao("config: linhas escondidas por produto continuam coletadas");
  const r5 = montarMinimo({ lab: false, foraAntaq: false });
  checar("ferramentasia escondida mas coletada", (r5.querySelector('[data-opcao="ferramentasia"]') as Element).hasAttribute("hidden") && valor(coletarConfigGeral(r5), "ferramentasia") === true);
  checar("gerenciarformularios (so Lab) coletado fora do Lab", valor(coletarConfigGeral(r5), "gerenciarformularios") === true);
}
```

`opcoes-pagina/tests/montar-minimo.ts` (montador provisório do contrato de DOM, para testar `config.ts` sem depender do `render.ts`; apagado na Task 3):
```ts
import { h } from "@comum/ui/dom";
import { PREFIXO_ID } from "../src/config";
import { OPCOES_COMPLEMENTOS, SECOES_GERAL, type Opcao } from "../src/schema";

export interface Ctx { lab: boolean; foraAntaq: boolean }

function linha(o: Opcao, c: Ctx): HTMLElement {
  const base = { id: PREFIXO_ID + o.nome, "data-name": o.nome, "data-tipo": o.tipo };
  const ctrl =
    o.tipo === "chave"
      ? h("input", { ...base, type: "checkbox", checked: o.padrao === true })
      : o.tipo === "selecao"
        ? h("select", base, ...(o.escolhas ?? []).map((e) => h("option", { value: e.valor }, e.rotulo)))
        : h("input", { ...base, type: o.tipo === "numero" ? "number" : "text", value: String(o.padrao ?? "") });
  const escondida = o.oculta || (o.visivelEm === "lab" && !c.lab) || (o.visivelEm === "fora-antaq" && !c.foraAntaq);
  const depende = o.dependencias?.map((d) => `${d.de}:${d.quando ? 1 : 0}:${d.limparAoEsconder ? 1 : 0}`).join(",");
  return h("div", { class: "opcao", "data-opcao": o.nome, "data-tipo": o.tipo, "data-depende": depende, hidden: escondida || undefined }, h("i", { class: "ico" }), ctrl);
}

export function montarMinimo(c: Ctx): HTMLElement {
  const raiz = h(
    "div",
    {},
    h(
      "div",
      { "data-aba": "geral" },
      ...SECOES_GERAL.map((s) => h("details", { class: "secao", "data-secao": s.id }, h("span", { class: "contagem" }), ...s.opcoes.map((o) => linha(o, c)))),
    ),
    h("div", { "data-aba": "complementos" }, ...OPCOES_COMPLEMENTOS.map((o) => linha(o, c))),
  );
  document.body.append(raiz);
  return raiz;
}
```

Em `tests/verificar.ts` adicionar:
```ts
import { verificarConfig } from "./verificar-config";
// ... depois de verificarSchema();
verificarConfig();
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `cd opcoes-pagina && npm run verificar`
Expected: erro de importação (`../src/config` não existe).

- [ ] **Step 4: Implementar `manual.ts` (Step 1) e `config.ts`**

`opcoes-pagina/src/config.ts`:
```ts
/**
 * O `configGeral` da pagina de opcoes: coletar o que o DOM mostra e aplicar o que
 * estava gravado. Os mesmos nomes, a mesma ordem e os mesmos tipos do options.js
 * legado (changeConfigGeral / restore_options), sem jQuery.
 *
 * Contrato de DOM (produzido por render.ts): ver o cabecalho daquele arquivo.
 */
import { h } from "@comum/ui/dom";

export const PREFIXO_ID = "itemConfigGeral_";

export interface ItemConfig {
  name: string;
  value: boolean | string | number;
}
export type Controle = HTMLInputElement | HTMLSelectElement;

export const controleDe = (raiz: ParentNode, nome: string): Controle | null => raiz.querySelector<Controle>(`[data-name="${nome}"]`);

const tipoDe = (c: Element): string => c.getAttribute("data-tipo") ?? "";
const nomeDe = (c: Element): string => c.getAttribute("data-name") ?? "";
const controlesDa = (raiz: ParentNode, aba: string): Controle[] => [...raiz.querySelectorAll<Controle>(`[data-aba="${aba}"] [data-name]`)];

/** Esvazia um controle como o legado fazia ao esconder uma linha dependente. */
function limpar(c: Controle): void {
  if (tipoDe(c) === "chave") (c as HTMLInputElement).checked = false;
  else if (c.tagName === "SELECT") c.replaceChildren(h("option", { value: "" }));
  else c.value = "";
}

interface Regra {
  de: string;
  quando: boolean;
  limpar: boolean;
}
const lerRegras = (v: string): Regra[] =>
  v
    .split(",")
    .filter(Boolean)
    .map((p) => {
      const [de, quando, lim] = p.split(":");
      return { de, quando: quando === "1", limpar: lim === "1" };
    });

/** Mostra/esconde as linhas que dependem de outra chave (atributo data-dep-oculta). */
export function atualizarDependencias(raiz: ParentNode): void {
  for (const linha of raiz.querySelectorAll<HTMLElement>("[data-depende]")) {
    const proprio = controleDe(linha, linha.getAttribute("data-opcao") ?? "");
    let visivel = true;
    for (const r of lerRegras(linha.getAttribute("data-depende") ?? "")) {
      const pai = controleDe(raiz, r.de) as HTMLInputElement | null;
      if ((pai?.checked ?? false) !== r.quando) {
        visivel = false;
        if (r.limpar && proprio) limpar(proprio);
      }
    }
    if (visivel) linha.removeAttribute("data-dep-oculta");
    else linha.setAttribute("data-dep-oculta", "");
  }
}

/** Icone azul (ligado) ou cinza (desligado) conforme o estado do controle. */
export function atualizarCores(raiz: ParentNode): void {
  for (const linha of raiz.querySelectorAll<HTMLElement>("[data-opcao]")) {
    const c = controleDe(linha, linha.getAttribute("data-opcao") ?? "");
    const ico = linha.querySelector(".ico");
    if (!c || !ico) continue;
    const ligado = tipoDe(c) === "chave" ? (c as HTMLInputElement).checked : c.value !== "";
    ico.classList.toggle("ligado", ligado);
    ico.classList.toggle("desligado", !ligado);
  }
}

/** "N de M ativas" no cabecalho de cada secao (so chaves visiveis no produto). */
export function atualizarContagens(raiz: ParentNode): void {
  for (const s of raiz.querySelectorAll<HTMLElement>("details.secao")) {
    const chaves = [...s.querySelectorAll<HTMLElement>('.opcao[data-tipo="chave"]')].filter((l) => !l.hasAttribute("hidden"));
    const ativas = chaves.filter((l) => (controleDe(l, l.getAttribute("data-opcao") ?? "") as HTMLInputElement | null)?.checked).length;
    const alvo = s.querySelector(".contagem");
    if (alvo) alvo.textContent = `${ativas} de ${chaves.length} ativas`;
  }
}

/** O mesmo array que o legado gravava em dataValues[].configGeral. */
export function coletarConfigGeral(raiz: ParentNode): ItemConfig[] {
  atualizarDependencias(raiz);
  const geral = controlesDa(raiz, "geral");
  const complementos = controlesDa(raiz, "complementos");
  const chaves = (cs: Controle[]): ItemConfig[] =>
    cs.filter((c) => tipoDe(c) === "chave").map((c) => ({ name: nomeDe(c), value: (c as HTMLInputElement).checked }));
  const preenchidos = (tipo: string) => geral.filter((c) => tipoDe(c) === tipo && c.value !== "");
  const numeros = preenchidos("numero")
    .map((c) => ({ name: nomeDe(c), value: Number.parseInt(c.value, 10) }))
    .filter((i) => !Number.isNaN(i.value));
  return [
    ...chaves(geral),
    ...chaves(complementos),
    ...preenchidos("texto").map((c) => ({ name: nomeDe(c), value: c.value })),
    ...numeros,
    ...preenchidos("selecao").map((c) => ({ name: nomeDe(c), value: c.value })),
  ];
}

/**
 * newdocsigilo guarda "id|nivel|rotulo" (lido pelo sei-functions-pro.js). O legado
 * criava a <option> com so o `id` e, ao salvar de novo, perdia nivel e rotulo; aqui o
 * valor inteiro e o value da <option>, e o rotulo e o texto.
 */
function definirSelecao(sel: HTMLSelectElement, nome: string, valor: unknown): void {
  if (typeof valor !== "string") return;
  if (nome === "newdocsigilo") {
    const partes = valor.split("|");
    if (partes.length < 3) return;
    sel.replaceChildren(h("option", { value: valor, selected: true }, partes[2]));
    return;
  }
  for (const o of sel.querySelectorAll("option")) o.selected = o.value === valor;
}

/** Aplica o que estava gravado. Item ausente fica no padrao; nome desconhecido e ignorado. */
export function aplicarConfigGeral(raiz: ParentNode, itens: ItemConfig[]): void {
  for (const { name, value } of itens) {
    const c = controleDe(raiz, name);
    if (!c) continue;
    const tipo = tipoDe(c);
    if (tipo === "chave") {
      if (typeof value === "boolean") (c as HTMLInputElement).checked = value;
    } else if (tipo === "selecao") definirSelecao(c as HTMLSelectElement, name, value);
    else if (value !== null && value !== undefined) c.value = String(value);
  }
  atualizarDependencias(raiz);
  atualizarCores(raiz);
  atualizarContagens(raiz);
}
```

- [ ] **Step 5: Rodar**

Run: `cd opcoes-pagina && npm run verificar && npm run tipos && npm run checar`
Expected: tudo `ok`, `0 falha(s)`, sem erro de tipos/lint. Se `classList.toggle(token, force)` ou `option.selected` não funcionarem no linkedom, troque por `add`/`remove` explícitos e `setAttribute("selected", "")`/`removeAttribute` — o contrato testado não muda.

- [ ] **Step 6: Commit**

```bash
git add opcoes-pagina/src/manual.ts opcoes-pagina/src/config.ts opcoes-pagina/tests
git commit -m "Opcoes: config.ts coleta e aplica o configGeral com a mesma ordem do legado; sigilo guarda o valor inteiro" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `render.ts` e `busca.ts`

**Files:**
- Create: `opcoes-pagina/src/render.ts`, `opcoes-pagina/src/busca.ts`
- Create: `opcoes-pagina/tests/verificar-render.ts`, `opcoes-pagina/tests/verificar-busca.ts`
- Delete: `opcoes-pagina/tests/montar-minimo.ts`
- Modify: `opcoes-pagina/tests/verificar-config.ts`, `opcoes-pagina/tests/verificar.ts`

**Interfaces:**
- Consumes: `Opcao`, `SECOES_GERAL`, `OPCOES_COMPLEMENTOS`; `PREFIXO_ID`; `urlManual`.
- Produces (`render.ts`):
  ```ts
  export interface Contexto { lab: boolean; foraAntaq: boolean; homepage: string }
  export function contextoDoManifesto(m: { short_name?: string; homepage_url?: string }): Contexto;
  export function montarLinha(o: Opcao, ctx: Contexto): HTMLElement;
  export function montarGeral(ctx: Contexto): HTMLElement;          // div.secoes[data-aba=geral]
  export function montarComplementos(ctx: Contexto): HTMLElement;   // div.secoes.plana[data-aba=complementos]
  ```
- Produces (`busca.ts`): `normalizar(s: string): string`; `filtrar(raiz: ParentNode, termo: string): number` (devolve quantas linhas casam).

- [ ] **Step 1: Escrever os testes (falham)**

`opcoes-pagina/tests/verificar-render.ts`:
```ts
import { PREFIXO_ID } from "../src/config";
import { contextoDoManifesto, montarComplementos, montarGeral, montarLinha } from "../src/render";
import { SECOES_GERAL, todasAsOpcoes } from "../src/schema";
import { checar, instalarDom, secao } from "./util";

const CTX = { lab: true, foraAntaq: true, homepage: "https://seipro.app" };

export function verificarRender(): void {
  secao("render: contexto do manifesto");
  checar("Lab", contextoDoManifesto({ short_name: "SEI Pro Lab" }).lab === true);
  checar("SEI Pro oficial: sem Lab, fora do ANTAQ", (() => { const c = contextoDoManifesto({ short_name: "SEI Pro" }); return !c.lab && c.foraAntaq; })());
  checar("ANTAQ Pro e ANTT Pro: nao e fora-antaq", !contextoDoManifesto({ short_name: "ANTAQ Pro" }).foraAntaq && !contextoDoManifesto({ short_name: "ANTT Pro" }).foraAntaq);
  checar("sem homepage_url cai em seipro.app", contextoDoManifesto({ short_name: "X" }).homepage === "https://seipro.app");

  secao("render: linha");
  instalarDom();
  const fav = todasAsOpcoes().find((o) => o.nome === "gerenciarfavoritos")!;
  const l = montarLinha(fav, CTX);
  const input = l.querySelector("input") as HTMLInputElement;
  checar("data-opcao e data-tipo", l.getAttribute("data-opcao") === "gerenciarfavoritos" && l.getAttribute("data-tipo") === "chave");
  checar("id segue o contrato do storage", input.getAttribute("id") === `${PREFIXO_ID}gerenciarfavoritos` && input.getAttribute("data-name") === "gerenciarfavoritos");
  checar("switch acessivel", input.getAttribute("type") === "checkbox" && input.getAttribute("role") === "switch");
  checar("rotulo aponta para o controle", (l.querySelector("label.rotulo") as Element).getAttribute("for") === input.getAttribute("id"));
  checar("padrao ligado", input.hasAttribute("checked"));
  const a = l.querySelector("a.manual") as Element;
  checar("manual abre em nova aba, sem opener", a.getAttribute("href") === "https://seipro.app/pages/FAVORITOS.html" && a.getAttribute("rel") === "noopener" && a.getAttribute("target") === "_blank");
  checar("icone sem classe de cor", (l.querySelector(".ico") as Element).className.includes("fa-") && !/Color/.test((l.querySelector(".ico") as Element).className));
  const sem = montarLinha(todasAsOpcoes().find((o) => o.nome === "gerenciarformularios")!, { ...CTX, lab: false });
  checar("linha so do Lab fica hidden fora do Lab", sem.hasAttribute("hidden") && !montarLinha(todasAsOpcoes().find((o) => o.nome === "gerenciarformularios")!, CTX).hasAttribute("hidden"));
  checar("ferramentasia hidden no ANTAQ", montarLinha(todasAsOpcoes().find((o) => o.nome === "ferramentasia")!, { ...CTX, foraAntaq: false }).hasAttribute("hidden"));
  checar("salvamentoautomatico sempre hidden", montarLinha(todasAsOpcoes().find((o) => o.nome === "salvamentoautomatico")!, CTX).hasAttribute("hidden"));
  const num = montarLinha(todasAsOpcoes().find((o) => o.nome === "qualidadeimagens")!, CTX).querySelector("input") as Element;
  checar("numero com faixa e valor", num.getAttribute("min") === "1" && num.getAttribute("max") === "100" && num.getAttribute("value") === "60");
  const sel = montarLinha(todasAsOpcoes().find((o) => o.nome === "citacaodoc")!, CTX).querySelector("select") as Element;
  checar("select com as 5 escolhas", sel.querySelectorAll("option").length === 5);
  checar("rotulo e texto, nunca HTML", (() => { const o = { ...fav, rotulo: "<img src=x onerror=alert(1)>" }; const e = montarLinha(o, CTX); return e.querySelector("img") === null && (e.querySelector("label.rotulo")?.textContent ?? "") === o.rotulo; })());

  secao("render: secoes");
  const geral = montarGeral(CTX);
  checar("data-aba geral", geral.getAttribute("data-aba") === "geral");
  const secoes = [...geral.querySelectorAll("details.secao")];
  checar("3 secoes na ordem", secoes.map((s) => s.getAttribute("data-secao")).join() === "controle,editor,arvore");
  checar("so a primeira abre", secoes.map((s) => s.hasAttribute("open")).join() === "true,false,false");
  checar("titulo na summary", (secoes[0].querySelector("summary .secao-titulo") as Element).textContent === SECOES_GERAL[0].titulo);
  checar("66 linhas em Geral", geral.querySelectorAll(".opcao").length === 66);
  checar("7 em Complementos", montarComplementos(CTX).querySelectorAll(".opcao").length === 7 && montarComplementos(CTX).getAttribute("data-aba") === "complementos");
  checar("sub-opcao leva data-depende", (geral.querySelector('[data-opcao="newdocsigilo"]') as Element).getAttribute("data-depende") === "newdocdefault:1:0,newdocnivel:0:1");
  checar("ids unicos", new Set([...geral.querySelectorAll("[id]")].map((e) => e.getAttribute("id"))).size === geral.querySelectorAll("[id]").length);
}
```

`opcoes-pagina/tests/verificar-busca.ts`:
```ts
import { montarComplementos, montarGeral } from "../src/render";
import { filtrar, normalizar } from "../src/busca";
import { checar, instalarDom, secao } from "./util";

const CTX = { lab: true, foraAntaq: true, homepage: "https://seipro.app" };
const ocultas = (r: ParentNode) => r.querySelectorAll(".opcao[data-busca-oculta]").length;

export function verificarBusca(): void {
  secao("busca");
  checar("normaliza acento e caixa", normalizar("  Árvore PRESCRIÇÕES ") === "arvore prescricoes");
  instalarDom();
  const raiz = document.createElement("div");
  raiz.append(montarGeral(CTX), montarComplementos(CTX));
  const secoes = [...raiz.querySelectorAll<HTMLElement>("details.secao")];
  const abertasAntes = secoes.map((s) => s.hasAttribute("open"));

  const n = filtrar(raiz, "prazos");
  checar("acha 'Controlar Prazos'", n >= 1 && (raiz.querySelector('[data-opcao="gerenciarprazos"]') as Element).hasAttribute("data-busca-oculta") === false);
  checar("esconde o que nao casa", ocultas(raiz) > 50);
  checar("abre a secao com resultado e esconde as sem", secoes[0].hasAttribute("open") && secoes[1].hasAttribute("data-busca-oculta") && secoes[2].hasAttribute("data-busca-oculta"));
  checar("sem acento acha 'Árvore'", filtrar(raiz, "arvore") > 3);
  checar("termo sem resultado devolve 0", filtrar(raiz, "zzzzzz") === 0);
  checar("limpar volta tudo e restaura as secoes abertas", filtrar(raiz, "") > 60 && ocultas(raiz) === 0 && secoes.map((s) => s.hasAttribute("open")).join() === abertasAntes.join() && secoes.every((s) => !s.hasAttribute("data-busca-oculta")));
}
```

Em `tests/verificar.ts` adicionar `verificarRender()` e `verificarBusca()`. Em `verificar-config.ts`, substituir o import de `montarMinimo` por um adaptador do render real e apagar `tests/montar-minimo.ts`:
```ts
import { montarComplementos, montarGeral } from "../src/render";
function montarMinimo(c: { lab: boolean; foraAntaq: boolean }): HTMLElement {
  const raiz = document.createElement("div");
  raiz.append(montarGeral({ ...c, homepage: "https://seipro.app" }), montarComplementos({ ...c, homepage: "https://seipro.app" }));
  document.body.append(raiz);
  return raiz;
}
```
(declare-o dentro de `verificar-config.ts`, no lugar do `import ... from "./montar-minimo"`).

Run: `cd opcoes-pagina && npm run verificar` → Expected: FAIL (módulos `render`/`busca` não existem).

- [ ] **Step 2: Implementar `render.ts`**

```ts
/**
 * Monta a pagina de opcoes a partir do schema, sem innerHTML (DOM seguro).
 *
 * Contrato de DOM (lido por config.ts, busca.ts e favoritos/opcoes):
 *   div.opcao[data-opcao=<nome>][data-tipo=<tipo>][data-depende?][hidden?]
 *     i.ico (ganha .ligado/.desligado)  label.rotulo[for=id]  a.manual | span.manual.vazio
 *     span.controle > (label.chave > input[role=switch] + span.trilho) | input | select
 *   O controle leva id="itemConfigGeral_<nome>", data-name e data-tipo.
 */
import { h } from "@comum/ui/dom";
import { PREFIXO_ID } from "./config";
import { urlManual } from "./manual";
import { OPCOES_COMPLEMENTOS, type Opcao, SECOES_GERAL } from "./schema";

export interface Contexto {
  /** So o "SEI Pro Lab" mostra as linhas visivelEm "lab". */
  lab: boolean;
  /** ANTAQ Pro e ANTT Pro escondem as linhas visivelEm "fora-antaq". */
  foraAntaq: boolean;
  homepage: string;
}

export function contextoDoManifesto(m: { short_name?: string; homepage_url?: string }): Contexto {
  const nome = m.short_name ?? "";
  return { lab: nome === "SEI Pro Lab", foraAntaq: nome !== "ANTAQ Pro" && nome !== "ANTT Pro", homepage: m.homepage_url || "https://seipro.app" };
}

function controle(o: Opcao): HTMLElement {
  const base = { id: PREFIXO_ID + o.nome, "data-name": o.nome, "data-tipo": o.tipo };
  if (o.tipo === "chave")
    return h(
      "label",
      { class: "chave" },
      h("input", { ...base, type: "checkbox", role: "switch", checked: o.padrao === true }),
      h("span", { class: "trilho", "aria-hidden": "true" }),
    );
  if (o.tipo === "selecao")
    return h("select", base, ...(o.escolhas ?? []).map((e) => h("option", { value: e.valor, selected: e.valor === o.padrao && e.valor !== "" }, e.rotulo)));
  if (o.tipo === "numero")
    return h("input", { ...base, type: "number", step: "1", min: String(o.min ?? 1), max: String(o.max ?? 100), value: String(o.padrao ?? "") });
  return h("input", {
    ...base,
    type: "text",
    autocomplete: "off",
    maxlength: o.maxLength ? String(o.maxLength) : undefined,
    value: String(o.padrao ?? ""),
  });
}

export function montarLinha(o: Opcao, ctx: Contexto): HTMLElement {
  const escondida = o.oculta === true || (o.visivelEm === "lab" && !ctx.lab) || (o.visivelEm === "fora-antaq" && !ctx.foraAntaq);
  const depende = o.dependencias?.map((d) => `${d.de}:${d.quando ? 1 : 0}:${d.limparAoEsconder ? 1 : 0}`).join(",");
  return h(
    "div",
    { class: "opcao", "data-opcao": o.nome, "data-tipo": o.tipo, "data-depende": depende, hidden: escondida || undefined },
    h("i", { class: `ico ${o.icone}`, "aria-hidden": "true" }),
    h("label", { class: "rotulo", for: PREFIXO_ID + o.nome }, o.rotulo),
    o.manual
      ? h(
          "a",
          { class: "manual", href: urlManual(ctx.homepage, o.manual), target: "_blank", rel: "noopener", title: "Abrir a documentacao", "aria-label": `Documentacao: ${o.rotulo}` },
          h("i", { class: "fas fa-info-circle", "aria-hidden": "true" }),
        )
      : h("span", { class: "manual vazio" }),
    h("span", { class: "controle" }, controle(o)),
  );
}

export function montarGeral(ctx: Contexto): HTMLElement {
  return h(
    "div",
    { class: "secoes", "data-aba": "geral" },
    ...SECOES_GERAL.map((s, i) =>
      h(
        "details",
        { class: "secao", "data-secao": s.id, open: i === 0 },
        h("summary", {}, h("span", { class: "secao-titulo" }, s.titulo), h("span", { class: "contagem" })),
        h("div", { class: "secao-corpo" }, ...s.opcoes.map((o) => montarLinha(o, ctx))),
      ),
    ),
  );
}

export function montarComplementos(ctx: Contexto): HTMLElement {
  return h("div", { class: "secoes plana", "data-aba": "complementos" }, h("div", { class: "secao-corpo cartao" }, ...OPCOES_COMPLEMENTOS.map((o) => montarLinha(o, ctx))));
}
```
Acentos nos textos de UI (`title`, `aria-label`): escrever com acento normal no `.ts` (UTF-8); o esbuild escapa na saída. Corrija "documentacao" → "documentação" nos três lugares ao digitar.

- [ ] **Step 3: Implementar `busca.ts`**

```ts
/** Busca por rotulo: sem acento, sem caixa. Abre as secoes com resultado e esconde as sem. */
export const normalizar = (s: string): string => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

const OCULTA = "data-busca-oculta";

/** Devolve quantas linhas casam. Termo vazio desfaz tudo e restaura as secoes como estavam. */
export function filtrar(raiz: ParentNode, termo: string): number {
  const alvo = normalizar(termo);
  const linhas = [...raiz.querySelectorAll<HTMLElement>(".opcao")];
  const secoes = [...raiz.querySelectorAll<HTMLElement>("details.secao")];
  if (alvo === "") {
    for (const l of linhas) l.removeAttribute(OCULTA);
    for (const s of secoes) {
      s.removeAttribute(OCULTA);
      const antes = s.getAttribute("data-aberta-antes");
      if (antes !== null) {
        if (antes === "1") s.setAttribute("open", "");
        else s.removeAttribute("open");
        s.removeAttribute("data-aberta-antes");
      }
    }
    return linhas.filter((l) => !l.hasAttribute("hidden")).length;
  }
  let achadas = 0;
  for (const l of linhas) {
    const casa = !l.hasAttribute("hidden") && normalizar(l.querySelector(".rotulo")?.textContent ?? "").includes(alvo);
    if (casa) {
      l.removeAttribute(OCULTA);
      achadas += 1;
    } else l.setAttribute(OCULTA, "");
  }
  for (const s of secoes) {
    if (s.getAttribute("data-aberta-antes") === null) s.setAttribute("data-aberta-antes", s.hasAttribute("open") ? "1" : "0");
    const tem = s.querySelector(`.opcao:not([${OCULTA}])`) !== null;
    if (tem) {
      s.removeAttribute(OCULTA);
      s.setAttribute("open", "");
    } else s.setAttribute(OCULTA, "");
  }
  return achadas;
}
```

- [ ] **Step 4: Rodar**

Run: `cd opcoes-pagina && npm run verificar && npm run tipos && npm run checar`
Expected: tudo `ok`; os testes de `config` agora rodam sobre o render real.

- [ ] **Step 5: Commit**

```bash
git add opcoes-pagina/src/render.ts opcoes-pagina/src/busca.ts opcoes-pagina/tests
git rm -q --cached opcoes-pagina/tests/montar-minimo.ts 2>/dev/null; rm -f opcoes-pagina/tests/montar-minimo.ts
git commit -m "Opcoes: renderizador do schema (DOM seguro) e busca por rotulo sem acento" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: `armazenamento.ts` e `dialogo.ts`

**Files:**
- Create: `opcoes-pagina/src/armazenamento.ts`, `opcoes-pagina/src/dialogo.ts`
- Create: `opcoes-pagina/tests/verificar-armazenamento.ts`
- Modify: `opcoes-pagina/tests/verificar.ts`

**Interfaces:**
- Consumes: `ItemConfig` (Task 2). `Perfil = Record<string, string>` é declarado em `perfis.ts` (Task 5); aqui o tipo é declarado localmente como `export type Perfil = Record<string, string>` em `armazenamento.ts` e `perfis.ts` o **importa** (evita ciclo).
- Produces (`armazenamento.ts`):
  ```ts
  export const LIMITE_ITEM_SYNC = 8192;
  export type Perfil = Record<string, string>;
  export interface Dados { perfis: Perfil[]; config: ItemConfig[] }
  export function serializar(d: Dados): string;
  export function interpretar(texto: string): Dados;            // nunca lanca
  export function medirEspaco(texto: string): { tamanho: number; estado: "ok" | "perto" | "estoura" };
  export function mensagemEstouro(tamanho: number): string;
  export interface Armazem { obter(): Promise<string>; gravar(texto: string): Promise<void> }
  export function armazemSync(api: ApiSync): Armazem;
  export function normalizarArquivo(texto: string): string;     // JSON.parse + stringify; lanca Error("Arquivo invalido") se nao for JSON
  export function baixarTexto(texto: string, nome?: string): void;
  ```
- Produces (`dialogo.ts`): `avisar(tipo: "ok" | "erro" | "atencao", texto: string): Promise<void>`.

- [ ] **Step 1: Escrever o teste (falha)**

`opcoes-pagina/tests/verificar-armazenamento.ts`:
```ts
import { type ApiSync, armazemSync, interpretar, LIMITE_ITEM_SYNC, medirEspaco, mensagemEstouro, normalizarArquivo, serializar } from "../src/armazenamento";
import { avisar } from "../src/dialogo";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const LEGADO =
  '[{"baseName":"Atividades","baseTipo":"atividades","conexaoTipo":"api","CLIENT_ID":"","API_KEY":"","spreadsheetId":"","URL_API":"https://x/api","KEY_USER":"abc"},{"configGeral":[{"name":"gerenciarfavoritos","value":true},{"name":"qualidadeimagens","value":60}]}]';

function apiFalsa(inicial = "", erro?: string): ApiSync & { mem: { dataValues: string } } {
  const mem = { dataValues: inicial };
  const runtime: { lastError?: { message: string } } = {};
  return {
    mem,
    runtime,
    storage: {
      sync: {
        get: (_k, cb) => cb({ dataValues: mem.dataValues }),
        set: (o, cb) => {
          if (erro) runtime.lastError = { message: erro };
          else Object.assign(mem, o);
          cb();
          runtime.lastError = undefined;
        },
      },
    },
  };
}

export async function verificarArmazenamento(): Promise<void> {
  secao("armazenamento: formato do dataValues");
  const d = interpretar(LEGADO);
  checar("le o dataValues que a versao anterior gravava", d.perfis.length === 1 && d.perfis[0].baseName === "Atividades" && d.config.length === 2);
  checar("serializar devolve o mesmo formato", serializar(d) === LEGADO);
  checar("vazio, lixo e nao-array nao lancam", ["", "not json", "{}", "null", '"x"', "[1,2]"].every((t) => { const x = interpretar(t); return x.perfis.length === 0 && x.config.length === 0; }));
  checar("sem configGeral: perfis ficam, config vazia", (() => { const x = interpretar('[{"baseName":"A"}]'); return x.perfis.length === 1 && x.config.length === 0; })());
  checar("item sem baseName nao e perfil", interpretar('[{"outra":1},{"configGeral":[]}]').perfis.length === 0);

  secao("armazenamento: limite de 8 KB");
  checar("pequeno ok", medirEspaco("abc").estado === "ok");
  checar("acima de 80% avisa", medirEspaco("a".repeat(Math.floor(LIMITE_ITEM_SYNC * 0.85))).estado === "perto");
  checar("acima do limite estoura", medirEspaco("a".repeat(LIMITE_ITEM_SYNC + 1)).estado === "estoura");
  checar("conta bytes, nao caracteres", medirEspaco("ã".repeat(5000)).tamanho === 10000);
  checar("mensagem do legado", mensagemEstouro(9000).includes("9000 de 8192 bytes"));

  secao("armazenamento: armazem do sync");
  const api = apiFalsa(LEGADO);
  const armazem = armazemSync(api);
  checar("obtem", (await armazem.obter()) === LEGADO);
  await armazem.gravar("[]");
  checar("grava", api.mem.dataValues === "[]");
  let msg = "";
  try { await armazemSync(apiFalsa("", "QUOTA_BYTES_PER_ITEM quota exceeded")).gravar("x"); } catch (e) { msg = (e as Error).message; }
  checar("erro do navegador vira rejeicao com a mensagem", msg.includes("QUOTA_BYTES_PER_ITEM"), msg);

  secao("armazenamento: arquivo importado");
  checar("normaliza JSON valido", normalizarArquivo(' [ {"a":1} ] ') === '[{"a":1}]');
  let invalido = false;
  try { normalizarArquivo("isto nao e json"); } catch (e) { invalido = (e as Error).message === "Arquivo invalido"; }
  checar("rejeita arquivo que nao e JSON", invalido);

  secao("dialogo");
  instalarDom();
  let fechou = false;
  const p = avisar("ok", "Salvo").then(() => { fechou = true; });
  const dlg = document.querySelector("dialog.aviso-ok") as HTMLDialogElement;
  checar("abre com o texto", !!dlg && (dlg.textContent ?? "").includes("Salvo") && dlg.hasAttribute("open"));
  disparar(dlg.querySelector("button") as Element, "click");
  await p;
  await tique();
  checar("OK fecha, resolve e remove do DOM", fechou && document.querySelector("dialog") === null);
}
```

Em `tests/verificar.ts`: `await verificarArmazenamento();` (a função é `async`; torne o runner top-level await: `await verificarArmazenamento();` antes de `resumo()`).

Run: `npm run verificar` → FAIL (módulos inexistentes).

- [ ] **Step 2: Implementar `armazenamento.ts`**

```ts
/**
 * Leitura e gravacao do dataValues no chrome.storage.sync. O formato e o do
 * legado: JSON.stringify([...perfis, { configGeral: [...] }]), tudo numa chave so.
 */
import type { ItemConfig } from "./config";

/** Limite do navegador para UM item do storage.sync (8 KB); toda a config vai numa chave so. */
export const LIMITE_ITEM_SYNC = 8192;

export type Perfil = Record<string, string>;
export interface Dados {
  perfis: Perfil[];
  config: ItemConfig[];
}

export function serializar(d: Dados): string {
  return JSON.stringify([...d.perfis, { configGeral: d.config }]);
}

/** Nunca lanca: dado ausente, corrompido ou de outra forma vira "sem nada gravado". */
export function interpretar(texto: string): Dados {
  const vazio: Dados = { perfis: [], config: [] };
  if (!texto) return vazio;
  let lista: unknown;
  try {
    lista = JSON.parse(texto);
  } catch {
    return vazio;
  }
  if (!Array.isArray(lista)) return vazio;
  const objetos = lista.filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x));
  const perfis = objetos.filter((x) => !!x.baseName) as Perfil[];
  const comConfig = objetos.find((x) => Array.isArray(x.configGeral));
  return { perfis, config: (comConfig?.configGeral as ItemConfig[] | undefined) ?? [] };
}

export function medirEspaco(texto: string): { tamanho: number; estado: "ok" | "perto" | "estoura" } {
  const tamanho = new TextEncoder().encode(texto).length;
  if (tamanho > LIMITE_ITEM_SYNC) return { tamanho, estado: "estoura" };
  if (tamanho > LIMITE_ITEM_SYNC * 0.8) return { tamanho, estado: "perto" };
  return { tamanho, estado: "ok" };
}

export const mensagemEstouro = (tamanho: number): string =>
  `As configurações passaram do espaço que o navegador reserva para sincronizá-las (${tamanho} de ${LIMITE_ITEM_SYNC} bytes). Remova uma base de dados que não use e salve de novo.`;

export interface ApiSync {
  runtime: { lastError?: { message?: string } };
  storage: {
    sync: {
      get(chaves: Record<string, unknown>, cb: (itens: Record<string, unknown>) => void): void;
      set(itens: Record<string, unknown>, cb: () => void): void;
    };
  };
}

export interface Armazem {
  obter(): Promise<string>;
  gravar(texto: string): Promise<void>;
}

/** O erro do navegador (cota, limite de escritas por hora) so aparece em lastError: sem olhar, a pagina dizia "salvo" sem ter salvo. */
export function armazemSync(api: ApiSync): Armazem {
  return {
    obter: () => new Promise((ok) => api.storage.sync.get({ dataValues: "" }, (i) => ok(String(i.dataValues ?? "")))),
    gravar: (texto) =>
      new Promise((ok, falhou) =>
        api.storage.sync.set({ dataValues: texto }, () => {
          const erro = api.runtime.lastError;
          if (erro) falhou(new Error(erro.message ?? "erro desconhecido"));
          else ok();
        }),
      ),
  };
}

export function normalizarArquivo(texto: string): string {
  try {
    return JSON.stringify(JSON.parse(texto));
  } catch {
    throw new Error("Arquivo invalido");
  }
}

export function baixarTexto(texto: string, nome = "config.json"): void {
  const url = URL.createObjectURL(new Blob([texto], { type: "application/json;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.style.visibility = "hidden";
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 3: Implementar `dialogo.ts`**

```ts
import { h } from "@comum/ui/dom";

export type TipoAviso = "ok" | "erro" | "atencao";
const ICONE: Record<TipoAviso, string> = { ok: "fa-check-circle", erro: "fa-exclamation-triangle", atencao: "fa-exclamation-triangle" };

/** Aviso modal nativo (substitui o dialog do jQuery UI). Resolve quando o usuario fecha (OK, Esc ou fundo). */
export function avisar(tipo: TipoAviso, texto: string): Promise<void> {
  return new Promise((resolver) => {
    const fechar = () => {
      dlg.remove();
      resolver();
    };
    const dlg = h(
      "dialog",
      { class: `aviso aviso-${tipo}` },
      h("p", {}, h("i", { class: `fas ${ICONE[tipo]}`, "aria-hidden": "true" }), " ", texto),
      h("div", { class: "aviso-acoes" }, h("button", { type: "button", class: "btn btn-primario", onclick: fechar }, "OK")),
    );
    dlg.addEventListener("close", fechar);
    document.body.append(dlg);
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  });
}
```

- [ ] **Step 4: Rodar**

Run: `cd opcoes-pagina && npm run verificar && npm run tipos && npm run checar`
Expected: tudo `ok`.

- [ ] **Step 5: Commit**

```bash
git add opcoes-pagina/src/armazenamento.ts opcoes-pagina/src/dialogo.ts opcoes-pagina/tests
git commit -m "Opcoes: armazenamento do dataValues (limite de 8 KB, erro do sync) e aviso em dialog nativo" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: `perfis.ts` (aba Base de Dados)

**Files:**
- Create: `opcoes-pagina/src/perfis.ts`, `opcoes-pagina/tests/verificar-perfis.ts`
- Modify: `opcoes-pagina/tests/verificar.ts`

**Interfaces:**
- Consumes: `Perfil` (de `armazenamento.ts`), `h`.
- Produces:
  ```ts
  export function montarPerfil(valores?: Perfil): HTMLElement;                    // fieldset.perfil
  export function restaurarPerfis(lista: HTMLElement, perfis: Perfil[]): void;    // sempre deixa >= 1 formulario
  export function adicionarPerfil(lista: HTMLElement): HTMLElement;
  export function ligarLista(lista: HTMLElement): void;                           // delegacao: subir, descer, remover, revelar senha
  export function coletarPerfis(lista: HTMLElement): { perfis: Perfil[]; descartados: number };
  ```
- Campos de cada perfil (`[data-campo=<nome>]`, classe `input-config-pro`): `baseName` (texto, obrigatório), `baseTipo` (select: atividades|openai|gemini, obrigatório), `conexaoTipo` (select: api, obrigatório), `URL_API` (texto), `KEY_USER` (senha). Campos legados sem UI (`CLIENT_ID`, `API_KEY`, `spreadsheetId`) ficam em `data-legado` (JSON) e voltam na coleta; a coleta emite sempre as 8 chaves do legado, na ordem `baseName, baseTipo, conexaoTipo, CLIENT_ID, API_KEY, spreadsheetId, URL_API, KEY_USER`.

- [ ] **Step 1: Escrever o teste (falha)**

`opcoes-pagina/tests/verificar-perfis.ts`:
```ts
import { adicionarPerfil, coletarPerfis, ligarLista, montarPerfil, restaurarPerfis } from "../src/perfis";
import { checar, disparar, instalarDom, secao } from "./util";

const campo = (p: Element, n: string) => p.querySelector(`[data-campo="${n}"]`) as HTMLInputElement;
const preencher = (p: Element, n: string, v: string) => { campo(p, n).value = v; };
const lista = () => { instalarDom(); const l = document.createElement("div"); document.body.append(l); ligarLista(l); return l; };
const perfis = (l: Element) => [...l.querySelectorAll(".perfil")];

export function verificarPerfis(): void {
  secao("perfis: formulario virgem");
  let l = lista();
  restaurarPerfis(l, []);
  checar("sem nada gravado ha um formulario em branco", perfis(l).length === 1);
  checar("formulario virgem nao vira base e nao conta como descartado", (() => { const r = coletarPerfis(l); return r.perfis.length === 0 && r.descartados === 0; })());

  secao("perfis: coletar e restaurar");
  const gravado = { baseName: "Atividades", baseTipo: "openai", conexaoTipo: "api", CLIENT_ID: "c", API_KEY: "k", spreadsheetId: "s", URL_API: "https://x/api", KEY_USER: "abc" };
  restaurarPerfis(l, [gravado, { ...gravado, baseName: "Outra", baseTipo: "gemini" }]);
  checar("um formulario por base", perfis(l).length === 2);
  checar("preenche os campos", campo(perfis(l)[0], "baseName").value === "Atividades" && campo(perfis(l)[1], "baseTipo").value === "gemini");
  const r = coletarPerfis(l);
  checar("round-trip identico, com as 8 chaves na ordem do legado", JSON.stringify(r.perfis[0]) === JSON.stringify(gravado) && r.perfis.length === 2 && r.descartados === 0);
  restaurarPerfis(l, [{ baseName: "So", baseTipo: "atividades", conexaoTipo: "api", URL_API: "", KEY_USER: "" } as never]);
  checar("campos legados ausentes saem como string vazia", JSON.stringify(Object.keys(coletarPerfis(l).perfis[0])) === JSON.stringify(["baseName", "baseTipo", "conexaoTipo", "CLIENT_ID", "API_KEY", "spreadsheetId", "URL_API", "KEY_USER"]) && coletarPerfis(l).perfis[0].CLIENT_ID === "");

  secao("perfis: obrigatorios");
  l = lista();
  restaurarPerfis(l, []);
  adicionarPerfil(l);
  preencher(perfis(l)[0], "baseName", "Boa");
  preencher(perfis(l)[1], "URL_API", "https://x");
  const c = coletarPerfis(l);
  checar("base valida entra; a sem nome e descartada e contada", c.perfis.length === 1 && c.perfis[0].baseName === "Boa" && c.descartados === 1);
  checar("campo obrigatorio vazio fica marcado", campo(perfis(l)[1], "baseName").classList.contains("campo-invalido"));
  preencher(perfis(l)[1], "baseName", "Agora");
  coletarPerfis(l);
  checar("marca some quando corrigido", !campo(perfis(l)[1], "baseName").classList.contains("campo-invalido"));

  secao("perfis: acoes");
  l = lista();
  restaurarPerfis(l, [{ ...gravado, baseName: "A" }, { ...gravado, baseName: "B" }, { ...gravado, baseName: "C" }]);
  const nomes = () => perfis(l).map((p) => campo(p, "baseName").value).join();
  disparar(perfis(l)[2].querySelector('[data-acao="subir"]') as Element, "click");
  checar("subir", nomes() === "A,C,B");
  disparar(perfis(l)[0].querySelector('[data-acao="descer"]') as Element, "click");
  checar("descer", nomes() === "C,A,B");
  disparar(perfis(l)[0].querySelector('[data-acao="subir"]') as Element, "click");
  checar("subir o primeiro nao faz nada", nomes() === "C,A,B");
  disparar(perfis(l)[1].querySelector('[data-acao="remover"]') as Element, "click");
  checar("remover", nomes() === "C,B");
  disparar(perfis(l)[0].querySelector('[data-acao="remover"]') as Element, "click");
  disparar(perfis(l)[0].querySelector('[data-acao="remover"]') as Element, "click");
  checar("remover a ultima limpa o formulario em vez de apagar tudo", perfis(l).length === 1 && campo(perfis(l)[0], "baseName").value === "" && coletarPerfis(l).perfis.length === 0);
  const senha = campo(perfis(l)[0], "KEY_USER");
  checar("chave de acesso comeca oculta", senha.getAttribute("type") === "password");
  disparar(perfis(l)[0].querySelector('[data-acao="revelar"]') as Element, "click");
  checar("revelar troca para texto e volta", campo(perfis(l)[0], "KEY_USER").getAttribute("type") === "text");
  disparar(perfis(l)[0].querySelector('[data-acao="revelar"]') as Element, "click");
  checar("oculta de novo", campo(perfis(l)[0], "KEY_USER").getAttribute("type") === "password");
  checar("ids dos campos nao se repetem entre bases", (() => { adicionarPerfil(l); const ids = [...l.querySelectorAll("[id]")].map((e) => e.id); return new Set(ids).size === ids.length; })());
  checar("montarPerfil sem valores", montarPerfil().classList.contains("perfil"));
}
```
Em `tests/verificar.ts`: `verificarPerfis();`. Run → FAIL.

- [ ] **Step 2: Implementar `perfis.ts`**

```ts
/**
 * Aba "Base de Dados": uma ou mais bases (perfis) de conexao. Mesma forma gravada
 * do legado (8 chaves por base). As linhas "sheets" (CLIENT_ID, API_KEY, spreadsheetId)
 * nao eram mais alcancaveis pela UI (o select so oferece "api"); seus valores, se
 * existirem, sao preservados em data-legado e devolvidos na coleta.
 */
import { h } from "@comum/ui/dom";
import type { Perfil } from "./armazenamento";

interface Campo {
  nome: string;
  rotulo: string;
  tipo: "texto" | "senha" | "selecao";
  obrigatorio?: boolean;
  dica?: string;
  escolhas?: [string, string][];
}

const CAMPOS: Campo[] = [
  { nome: "baseName", rotulo: "Nome da Base *", tipo: "texto", obrigatorio: true, dica: "Nome da Base" },
  {
    nome: "baseTipo",
    rotulo: "Tipo da Base de Dados *",
    tipo: "selecao",
    obrigatorio: true,
    escolhas: [["atividades", "Atividades"], ["openai", "Chat GPT (Open AI)"], ["gemini", "Gemini (Google)"]],
  },
  { nome: "conexaoTipo", rotulo: "Tipo da Conexão *", tipo: "selecao", obrigatorio: true, escolhas: [["api", "Servidor Web (API)"]] },
  { nome: "URL_API", rotulo: "URL do Servidor *", tipo: "texto", dica: "Insira o caminho para o servidor de API" },
  { nome: "KEY_USER", rotulo: "Chave de Acesso *", tipo: "senha", dica: "Insira a chave de acesso fornecida pelo administrador" },
];
const ORDEM_GRAVADA = ["baseName", "baseTipo", "conexaoTipo", "CLIENT_ID", "API_KEY", "spreadsheetId", "URL_API", "KEY_USER"];
const LEGADOS = ["CLIENT_ID", "API_KEY", "spreadsheetId"];

let contador = 0;

const botaoAcao = (acao: string, rotulo: string, icone: string): HTMLButtonElement =>
  h("button", { type: "button", class: "btn-icone", "data-acao": acao, "aria-label": rotulo, title: rotulo }, h("i", { class: `fas ${icone}`, "aria-hidden": "true" }));

function campoEl(c: Campo, n: number, valor: string): HTMLElement {
  const id = `perfil-${n}-${c.nome}`;
  const base = { id, "data-campo": c.nome, "data-name-input": c.nome, class: "input-config-pro", required: c.obrigatorio };
  const controle =
    c.tipo === "selecao"
      ? h("select", base, ...(c.escolhas ?? []).map(([v, t]) => h("option", { value: v, selected: v === valor }, t)))
      : h("input", { ...base, type: c.tipo === "senha" ? "password" : "text", placeholder: c.dica, value: valor, autocomplete: "off" });
  return h(
    "div",
    { class: "campo" },
    h("label", { for: id }, c.rotulo),
    c.tipo === "senha"
      ? h("span", { class: "campo-senha" }, controle, botaoAcao("revelar", "Mostrar ou ocultar a chave", "fa-eye"))
      : controle,
  );
}

export function montarPerfil(valores: Perfil = {}): HTMLElement {
  contador += 1;
  const n = contador;
  const legado = Object.fromEntries(LEGADOS.filter((k) => valores[k]).map((k) => [k, valores[k]]));
  return h(
    "fieldset",
    { class: "perfil", "data-legado": JSON.stringify(legado) },
    h(
      "div",
      { class: "perfil-topo" },
      h("h2", {}, "Base de Dados"),
      h("span", { class: "perfil-acoes" }, botaoAcao("subir", "Mover para cima", "fa-arrow-up"), botaoAcao("descer", "Mover para baixo", "fa-arrow-down"), botaoAcao("remover", "Remover esta base", "fa-trash-alt")),
    ),
    ...CAMPOS.map((c) => campoEl(c, n, valores[c.nome] ?? "")),
  );
}

export function adicionarPerfil(lista: HTMLElement): HTMLElement {
  const p = montarPerfil();
  lista.append(p);
  return p;
}

/** Sempre deixa pelo menos um formulario (em branco, esperando uma base nova). */
export function restaurarPerfis(lista: HTMLElement, perfis: Perfil[]): void {
  lista.replaceChildren(...perfis.filter((p) => p.baseName).map((p) => montarPerfil(p)));
  if (lista.children.length === 0) adicionarPerfil(lista);
}

const camposDe = (p: Element) => [...p.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-campo]")];

export function coletarPerfis(lista: HTMLElement): { perfis: Perfil[]; descartados: number } {
  const perfis: Perfil[] = [];
  let descartados = 0;
  for (const p of lista.querySelectorAll(".perfil")) {
    const campos = camposDe(p);
    // Formulario em que nenhum campo de texto foi preenchido (os selects ja vem com valor) e o formulario virgem: nao e base incompleta.
    if (campos.every((c) => c.tagName === "SELECT" || c.value.trim() === "")) continue;
    let faltando = 0;
    const valores: Perfil = { ...(JSON.parse(p.getAttribute("data-legado") || "{}") as Perfil) };
    for (const c of campos) {
      c.classList.remove("campo-invalido");
      if (c.required && c.value === "") {
        c.classList.add("campo-invalido");
        faltando += 1;
      } else valores[c.getAttribute("data-campo") as string] = c.value;
    }
    if (faltando > 0) descartados += 1;
    else perfis.push(Object.fromEntries(ORDEM_GRAVADA.map((k) => [k, valores[k] ?? ""])));
  }
  return { perfis, descartados };
}

/** Uma delegacao so para subir, descer, remover e revelar a chave. */
export function ligarLista(lista: HTMLElement): void {
  lista.addEventListener("click", (ev) => {
    const botao = (ev.target as Element).closest<HTMLElement>("[data-acao]");
    const perfil = botao?.closest<HTMLElement>(".perfil");
    if (!botao || !perfil) return;
    switch (botao.getAttribute("data-acao")) {
      case "subir": {
        const antes = perfil.previousElementSibling;
        if (antes) antes.before(perfil);
        break;
      }
      case "descer": {
        const depois = perfil.nextElementSibling;
        if (depois) depois.after(perfil);
        break;
      }
      case "remover":
        // Ultima base: so limpa o formulario. O legado tentava apagar todo o dataValues (inclusive as opcoes gerais), e esse ramo nunca rodava.
        if (lista.querySelectorAll(".perfil").length > 1) perfil.remove();
        else for (const c of camposDe(perfil)) if (c.tagName !== "SELECT") c.value = "";
        break;
      case "revelar": {
        const senha = perfil.querySelector<HTMLInputElement>('[data-campo="KEY_USER"]');
        if (!senha) break;
        const mostrando = senha.getAttribute("type") === "text";
        senha.setAttribute("type", mostrando ? "password" : "text");
        botao.querySelector("i")?.setAttribute("class", mostrando ? "fas fa-eye" : "fas fa-eye-slash");
        break;
      }
    }
  });
}
```
Os rótulos com acento ("Tipo da Conexão") ficam com acento no `.ts` (UTF-8).

- [ ] **Step 3: Rodar**

Run: `cd opcoes-pagina && npm run verificar && npm run tipos && npm run checar`
Expected: tudo `ok`. Se `c.required` não refletir `required: true` no linkedom, leia `c.hasAttribute("required")`.

- [ ] **Step 4: Commit**

```bash
git add opcoes-pagina/src/perfis.ts opcoes-pagina/tests
git commit -m "Opcoes: aba Base de Dados sem jQuery (mesma forma gravada; ultima base nao apaga o storage)" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Casca da página (HTML, CSS, `main.ts`, build, pré-visualização)

**Files:**
- Rewrite: `dist/html/options.html`, `dist/html/page.css`
- Create: `opcoes-pagina/src/main.ts`, `opcoes-pagina/build.mjs`
- Create: `opcoes-pagina/scripts/preview.mjs`
- Modify: `.gitignore` (acrescentar `opcoes-pagina/.preview/`)
- Generate: `dist/html/options.js`

**Interfaces:**
- Consumes: tudo das Tasks 1–5.
- Produces: a página funcionando. Ids estáveis no HTML: `#export`, `#import`, `#selectFiles`, `#abrirFerramentasPdf`, `.save`, `#new`, `#perfis`, `#geral-conteudo`, `#complementos-conteudo`, `#busca`, `#sem-resultado`.

- [ ] **Step 1: Escrever `options.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Configurações</title>
    <link rel="stylesheet" href="../css/fontawesome.pro.min.css">
    <link rel="stylesheet" href="page.css">
</head>
<body class="SEIPro">
    <header class="topo">
        <div class="pagina topo-in">
            <img class="icon-space" src="../icons/icon-32.png" alt="" width="32" height="32">
            <h1><span class="name-space"></span> <span class="sep" aria-hidden="true">|</span> Configurações</h1>
        </div>
    </header>
    <div class="barra-acoes" role="toolbar" aria-label="Ações das configurações">
        <div class="pagina barra-acoes-in">
            <button id="export" type="button" class="btn btn-secundario"><i class="fas fa-download" aria-hidden="true"></i><span class="btn-texto">Baixar configurações</span></button>
            <input type="file" id="selectFiles" accept="application/json,.json" hidden>
            <button id="import" type="button" class="btn btn-secundario"><i class="fas fa-file-upload" aria-hidden="true"></i><span class="btn-texto">Carregar configurações</span></button>
            <button id="abrirFerramentasPdf" type="button" class="btn btn-terciario"><i class="fas fa-file-pdf" aria-hidden="true"></i><span class="btn-texto">Ferramentas de PDF</span></button>
            <span class="espaco"></span>
            <button type="button" class="save btn btn-primario"><i class="fas fa-save" aria-hidden="true"></i> Salvar</button>
        </div>
    </div>
    <main class="pagina">
        <div class="abas" role="tablist" aria-label="Seções das configurações">
            <button type="button" role="tab" id="tab-geral" aria-controls="aba-geral" aria-selected="true"><i class="fas fa-cog" aria-hidden="true"></i> Geral</button>
            <button type="button" role="tab" id="tab-base" aria-controls="aba-base" aria-selected="false" tabindex="-1"><i class="fas fa-database" aria-hidden="true"></i> Base de Dados</button>
            <button type="button" role="tab" id="tab-complementos" aria-controls="aba-complementos" aria-selected="false" tabindex="-1"><i class="fas fa-puzzle-piece" aria-hidden="true"></i> Complementos</button>
        </div>
        <section id="aba-geral" role="tabpanel" aria-labelledby="tab-geral">
            <div class="busca">
                <label class="sr" for="busca">Buscar nas opções</label>
                <i class="fas fa-search" aria-hidden="true"></i>
                <input id="busca" type="search" placeholder="Buscar nas opções" autocomplete="off">
            </div>
            <p id="sem-resultado" class="sem-resultado" hidden>Nenhuma opção encontrada.</p>
            <div id="geral-conteudo"></div>
        </section>
        <section id="aba-base" role="tabpanel" aria-labelledby="tab-base" hidden>
            <div id="perfis"></div>
            <button id="new" type="button" class="btn btn-secundario"><i class="fas fa-database" aria-hidden="true"></i> Adicionar nova base</button>
        </section>
        <section id="aba-complementos" role="tabpanel" aria-labelledby="tab-complementos" hidden>
            <div id="complementos-conteudo"></div>
        </section>
    </main>
    <script src="options.js"></script>
    <script type="module" src="../js/favoritos/opcoes.js"></script>
</body>
</html>
```

- [ ] **Step 2: Escrever `main.ts`**

```ts
/**
 * Cola da pagina de opcoes (html/options.html): produto, render, abas, busca,
 * restaurar e os botoes. A logica fica nos modulos; aqui so se liga.
 */
import { type ApiSync, armazemSync, baixarTexto, interpretar, mensagemEstouro, medirEspaco, normalizarArquivo, serializar } from "./armazenamento";
import { filtrar } from "./busca";
import { aplicarConfigGeral, atualizarContagens, atualizarCores, atualizarDependencias, coletarConfigGeral } from "./config";
import { avisar } from "./dialogo";
import { adicionarPerfil, coletarPerfis, ligarLista, restaurarPerfis } from "./perfis";
import { contextoDoManifesto, montarComplementos, montarGeral } from "./render";

const api = (typeof browser !== "undefined" ? (browser as unknown) : chrome) as typeof chrome;
const $ = <T extends HTMLElement>(sel: string): T => document.querySelector(sel) as T;

function ligarAbas(): void {
  const abas = [...document.querySelectorAll<HTMLElement>('[role="tab"]')];
  const ativar = (alvo: HTMLElement): void => {
    for (const a of abas) {
      const ligado = a === alvo;
      a.setAttribute("aria-selected", String(ligado));
      a.tabIndex = ligado ? 0 : -1;
      const painel = document.getElementById(a.getAttribute("aria-controls") ?? "");
      if (painel) painel.hidden = !ligado;
    }
  };
  for (const a of abas) a.addEventListener("click", () => ativar(a));
  $('[role="tablist"]').addEventListener("keydown", (ev) => {
    const i = abas.findIndex((a) => a.getAttribute("aria-selected") === "true");
    const k = (ev as KeyboardEvent).key;
    const prox = k === "ArrowRight" ? abas[(i + 1) % abas.length] : k === "ArrowLeft" ? abas[(i - 1 + abas.length) % abas.length] : null;
    if (prox) {
      ativar(prox);
      prox.focus();
    }
  });
}

/** Secoes abertas/fechadas: so por sessao da aba (nada novo no sync). */
function lembrarSecoes(raiz: ParentNode): void {
  const chave = "seipro-opcoes-secoes";
  try {
    const salvo = JSON.parse(sessionStorage.getItem(chave) ?? "null") as Record<string, boolean> | null;
    for (const s of raiz.querySelectorAll<HTMLElement>("details.secao")) {
      const id = s.getAttribute("data-secao") ?? "";
      if (salvo && id in salvo) {
        if (salvo[id]) s.setAttribute("open", "");
        else s.removeAttribute("open");
      }
      s.addEventListener("toggle", () => {
        if (s.hasAttribute("data-aberta-antes")) return; // a busca mexe em "open"; isso nao e escolha do usuario
        try {
          const atual = JSON.parse(sessionStorage.getItem(chave) ?? "{}") as Record<string, boolean>;
          atual[id] = s.hasAttribute("open");
          sessionStorage.setItem(chave, JSON.stringify(atual));
        } catch {}
      });
    }
  } catch {}
}

async function iniciar(): Promise<void> {
  const manifesto = api.runtime.getManifest();
  const ctx = contextoDoManifesto(manifesto);
  $(".name-space").textContent = manifesto.short_name ?? "";
  document.title = `Configurações | ${manifesto.short_name ?? ""}`;
  const icone = manifesto.icons?.["32"];
  if (icone) $<HTMLImageElement>(".icon-space").src = `../${icone}`;

  const geral = montarGeral(ctx);
  const complementos = montarComplementos(ctx);
  $("#geral-conteudo").append(geral);
  $("#complementos-conteudo").append(complementos);
  const painel = document.body;
  lembrarSecoes(geral);
  ligarAbas();

  const lista = $("#perfis");
  ligarLista(lista);
  $("#new").addEventListener("click", () => adicionarPerfil(lista));

  const atualizar = (): void => {
    atualizarDependencias(painel);
    atualizarCores(painel);
    atualizarContagens(painel);
  };
  for (const alvo of [geral, complementos]) {
    alvo.addEventListener("change", atualizar);
    alvo.addEventListener("input", atualizar);
  }

  const busca = $<HTMLInputElement>("#busca");
  busca.addEventListener("input", () => {
    const n = filtrar(geral, busca.value);
    $("#sem-resultado").hidden = busca.value.trim() === "" || n > 0;
  });
  busca.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key !== "Escape" || busca.value === "") return;
    busca.value = "";
    busca.dispatchEvent(new Event("input"));
  });

  const armazem = armazemSync(api as unknown as ApiSync);
  const dados = interpretar(await armazem.obter());
  restaurarPerfis(lista, dados.perfis);
  aplicarConfigGeral(painel, dados.config);
  atualizar();

  /** Grava o que a tela mostra. Devolve o texto gravado, ou null se nao coube/falhou (o aviso ja foi dado). */
  async function gravar(): Promise<string | null> {
    const { perfis, descartados } = coletarPerfis(lista);
    const texto = serializar({ perfis, config: coletarConfigGeral(painel) });
    const espaco = medirEspaco(texto);
    if (espaco.estado === "estoura") {
      await avisar("erro", mensagemEstouro(espaco.tamanho));
      return null;
    }
    if (espaco.estado === "perto") console.warn(`SEI Pro: as configuracoes ocupam ${espaco.tamanho} de 8192 bytes do espaco de sincronizacao.`);
    try {
      await armazem.gravar(texto);
    } catch (e) {
      await avisar("erro", `Não foi possível salvar as configurações: ${(e as Error).message}`);
      return null;
    }
    if (descartados > 0) {
      await avisar("atencao", `As opções foram salvas, mas ${descartados} base(s) de dados ficaram de fora porque há campo obrigatório em branco (marcado em vermelho).`);
      return null;
    }
    return texto;
  }

  $(".save").addEventListener("click", async () => {
    if ((await gravar()) !== null) await avisar("ok", "Configurações salvas com sucesso!");
  });
  $("#export").addEventListener("click", async () => {
    const texto = await gravar();
    if (texto !== null) baixarTexto(texto);
  });
  $("#import").addEventListener("click", () => $<HTMLInputElement>("#selectFiles").click());
  $<HTMLInputElement>("#selectFiles").addEventListener("change", async (ev) => {
    const arquivo = (ev.target as HTMLInputElement).files?.[0];
    if (!arquivo) return;
    let texto: string;
    try {
      texto = normalizarArquivo(await arquivo.text());
    } catch {
      await avisar("erro", "O arquivo escolhido não é uma configuração do SEI Pro (JSON inválido).");
      return;
    }
    const espaco = medirEspaco(texto);
    if (espaco.estado === "estoura") return void (await avisar("erro", mensagemEstouro(espaco.tamanho)));
    try {
      await armazem.gravar(texto);
    } catch (e) {
      return void (await avisar("erro", `Não foi possível salvar as configurações: ${(e as Error).message}`));
    }
    await avisar("ok", "Configurações carregadas com sucesso!");
    location.reload();
  });
  // Quarto caminho para as Ferramentas de PDF. Abre em ABA, nunca no popup: o popup e destruido ao perder o foco e levaria junto o processamento em curso.
  $("#abrirFerramentasPdf").addEventListener("click", () => window.open(api.runtime.getURL("html/ferramentas-pdf.html"), "_blank"));
}

void iniciar();
```
(Os tipos `browser` e `chrome` globais: se o `tsc` reclamar de `browser`, declare `declare const browser: unknown;` no topo.)

- [ ] **Step 3: Escrever `build.mjs`**

```js
#!/usr/bin/env node
/** Build da pagina de opcoes: src/main.ts -> dist/html/options.js (IIFE, so ASCII). */
import { build } from "esbuild";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const saida = fileURLToPath(new URL("../dist/html/options.js", import.meta.url));
await build({
  entryPoints: [fileURLToPath(new URL("src/main.ts", import.meta.url))],
  outfile: saida,
  bundle: true,
  minify: true,
  format: "iife",
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  legalComments: "none",
  logLevel: "warning",
  banner: { js: "/* GERADO por opcoes-pagina/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
});
const bytes = await readFile(saida);
const i = bytes.findIndex((b) => b > 0x7f);
if (i >= 0) {
  console.error(`ERRO: byte nao-ASCII em dist/html/options.js (posicao ${i}): ${bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8")}`);
  process.exit(1);
}
console.log(`Opcoes: dist/html/options.js gerado (${Math.round((await stat(saida)).size / 1024)} KB).`);
```

- [ ] **Step 4: Reescrever `page.css`**

```css
/* Pagina de opcoes. Tokens do seipro.app (assets/css/seipro.css); fontes do sistema, nada externo. */
:root {
  --papel: #F5F3EE;
  --papel-2: #ECE8DF;
  --superficie: #FFFFFF;
  --tinta: #0F1E33;
  --tinta-2: #3C4A5E;
  --linha: #DDD7CB;
  --azul: #0B5F91;
  --azul-escuro: #073F61;
  --azul-claro: #E6EEF3;
  --verde: #7FB539;
  --cinza-icone: #A29D91;
  --cinza-trilho: #C9C3B6;
  --erro: #B3261E;
  --raio: 16px;
  --sombra: 0 1px 2px rgba(15, 30, 51, .06), 0 8px 24px rgba(15, 30, 51, .06);
  --texto: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --papel: #10171F;
    --papel-2: #18222D;
    --superficie: #17202A;
    --tinta: #E9EEF4;
    --tinta-2: #B3BFCC;
    --linha: #2B3947;
    --azul: #6BB4E6;
    --azul-escuro: #9ACDF0;
    --azul-claro: #1B2B3A;
    --cinza-icone: #6D7A88;
    --cinza-trilho: #3A4756;
    --erro: #F2A29C;
    --sombra: none;
  }
}
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; }
body { background: var(--papel); color: var(--tinta); font: 15px/1.5 var(--texto); -webkit-text-size-adjust: 100%; }
:focus-visible { outline: 3px solid var(--azul); outline-offset: 2px; border-radius: 4px; }
[hidden], [data-dep-oculta], [data-busca-oculta] { display: none !important; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.pagina { width: 100%; max-width: 880px; margin: 0 auto; padding: 0 16px; }
i.fa, i.fas, i.far { margin-right: 0; }

/* Titulo: linha propria, nunca dividida com botoes */
.topo { padding: 20px 0 8px; }
.topo-in { display: flex; align-items: center; gap: 14px; }
.topo img { border-radius: 8px; }
h1 { margin: 0; font-size: 26px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; }
h1 .sep { color: var(--cinza-icone); font-weight: 400; margin: 0 4px; }

/* Barra de acoes: linha abaixo do titulo, fica visivel ao rolar */
.barra-acoes { position: sticky; top: 0; z-index: 20; background: color-mix(in srgb, var(--papel) 92%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid var(--linha); }
.barra-acoes-in { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding-top: 10px; padding-bottom: 10px; }
.espaco { flex: 1; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 18px; border: 1px solid transparent; border-radius: 10px; font: 600 14px/1 var(--texto); cursor: pointer; color: var(--tinta); background: transparent; }
.btn-primario { background: var(--azul); color: #fff; }
.btn-primario:hover { background: var(--azul-escuro); }
@media (prefers-color-scheme: dark) { .btn-primario { color: #07202F; } .btn-primario:hover { color: #07202F; } }
.btn-secundario { background: var(--superficie); border-color: var(--linha); }
.btn-secundario:hover { border-color: var(--tinta-2); }
.btn-terciario { color: var(--azul); }
.btn-terciario:hover { background: var(--azul-claro); }
.btn-icone { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 0; border-radius: 8px; background: transparent; color: var(--tinta-2); cursor: pointer; }
.btn-icone:hover { background: var(--azul-claro); color: var(--azul); }

/* Abas */
.abas { display: flex; gap: 4px; margin-top: 20px; border-bottom: 1px solid var(--linha); overflow-x: auto; }
[role="tab"] { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: var(--tinta-2); font: 600 14px/1 var(--texto); cursor: pointer; white-space: nowrap; }
[role="tab"]:hover { color: var(--tinta); }
[role="tab"][aria-selected="true"] { color: var(--azul); border-bottom-color: var(--azul); }
[role="tabpanel"] { padding: 20px 0 48px; }

/* Busca */
.busca { position: relative; }
.busca i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--cinza-icone); pointer-events: none; }
.busca input { width: 100%; min-height: 44px; padding: 0 14px 0 40px; border: 1px solid var(--linha); border-radius: 10px; background: var(--superficie); color: var(--tinta); font: 15px var(--texto); }
.sem-resultado { margin: 16px 4px; color: var(--tinta-2); }

/* Secoes colapsaveis */
.secoes { display: grid; gap: 16px; margin-top: 16px; }
details.secao, .cartao { background: var(--superficie); border: 1px solid var(--linha); border-radius: var(--raio); box-shadow: var(--sombra); overflow: hidden; }
details.secao > summary { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 20px; cursor: pointer; list-style: none; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
details.secao > summary::-webkit-details-marker { display: none; }
details.secao > summary::before { content: ""; width: 8px; height: 8px; border-right: 2px solid var(--tinta-2); border-bottom: 2px solid var(--tinta-2); transform: rotate(-45deg); transition: transform .15s; flex-shrink: 0; }
details.secao[open] > summary::before { transform: rotate(45deg); }
.secao-titulo { flex: 1; }
.contagem { padding: 2px 10px; border-radius: 999px; background: var(--azul-claro); color: var(--azul); font-size: 12px; font-weight: 600; white-space: nowrap; }
.secao-corpo { border-top: 1px solid var(--linha); }

/* Linha de opcao */
.opcao { display: grid; grid-template-columns: 24px minmax(0, 1fr) 24px auto; align-items: center; gap: 12px; padding: 12px 20px; }
.opcao + .opcao { border-top: 1px solid var(--linha); }
.opcao[data-depende] { padding-left: 44px; background: var(--papel); }
.opcao .ico { font-size: 16px; text-align: center; color: var(--cinza-icone); }
.opcao .ico.ligado { color: var(--azul); }
.opcao .ico.desligado { color: var(--cinza-icone); }
.rotulo { cursor: pointer; line-height: 1.35; }
a.manual { display: inline-flex; width: 24px; justify-content: center; color: var(--cinza-icone); text-decoration: none; }
a.manual:hover { color: var(--azul); }
.controle { display: flex; justify-content: flex-end; min-width: 46px; }
.controle input[type="text"], .controle input[type="number"], .controle select { width: min(280px, 100%); min-height: 38px; padding: 0 10px; border: 1px solid var(--linha); border-radius: 8px; background: var(--superficie); color: var(--tinta); font: 14px var(--texto); }
.controle input[type="number"] { width: 110px; }

/* Toggle switch nativo */
.chave { position: relative; display: inline-block; width: 46px; height: 26px; }
.chave input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
.trilho { position: absolute; inset: 0; border-radius: 26px; background: var(--cinza-trilho); transition: background .2s; pointer-events: none; }
.trilho::after { content: ""; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, .3); transition: transform .2s; }
.chave input:checked + .trilho { background: var(--azul); }
.chave input:checked + .trilho::after { transform: translateX(20px); }
.chave input:focus-visible + .trilho { outline: 3px solid var(--azul); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .trilho, .trilho::after, details.secao > summary::before { transition: none; } }

/* Base de Dados */
#perfis { display: grid; gap: 16px; margin-bottom: 16px; }
.perfil { margin: 0; padding: 4px 20px 20px; background: var(--superficie); border: 1px solid var(--linha); border-radius: var(--raio); box-shadow: var(--sombra); }
.perfil-topo { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
.perfil-topo h2 { margin: 0; font-size: 17px; }
.perfil-acoes { display: flex; gap: 2px; }
.campo { display: grid; gap: 4px; margin-top: 12px; }
.campo label { font-size: 13px; font-weight: 600; color: var(--tinta-2); }
.campo input, .campo select { width: 100%; min-height: 40px; padding: 0 12px; border: 1px solid var(--linha); border-radius: 8px; background: var(--superficie); color: var(--tinta); font: 14px var(--texto); }
.campo-senha { display: flex; align-items: center; gap: 4px; }
.campo-invalido { border-color: var(--erro) !important; background: color-mix(in srgb, var(--erro) 10%, var(--superficie)); }

/* Aviso */
dialog.aviso { max-width: min(440px, calc(100vw - 32px)); padding: 24px; border: 1px solid var(--linha); border-radius: var(--raio); background: var(--superficie); color: var(--tinta); box-shadow: 0 24px 60px rgba(15, 30, 51, .28); }
dialog.aviso::backdrop { background: rgba(15, 30, 51, .45); }
dialog.aviso p { margin: 0 0 20px; font-size: 16px; }
dialog.aviso-ok p i { color: var(--verde); }
dialog.aviso-erro p i, dialog.aviso-atencao p i { color: var(--erro); }
.aviso-acoes { display: flex; justify-content: flex-end; }

/* Largura estreita: iframe do SEI com pouca largura e popup */
@media (max-width: 640px) {
  .btn-texto { display: none; }
  .btn { padding: 0 14px; }
  h1 { font-size: 21px; }
  .opcao { grid-template-columns: 24px minmax(0, 1fr) 24px; row-gap: 8px; }
  .opcao .controle { grid-column: 2 / -1; justify-content: flex-start; }
  .opcao .controle .chave { margin-left: 0; }
}
```
(`.btn-texto` some em ≤ 640 px: os botões ficam só com ícone; garantir `aria-label` neles — acrescente `aria-label="Baixar configurações"`, `"Carregar configurações"` e `"Ferramentas de PDF"` nos três botões do HTML.)

- [ ] **Step 5: Pré-visualização com `chrome` falso**

`opcoes-pagina/scripts/preview.mjs`:
```js
#!/usr/bin/env node
/**
 * Gera opcoes-pagina/.preview/options.html: o options.html real com um `chrome` falso
 * (storage em memoria, manifest do Lab) e <base> apontando para dist/html/. Serve para
 * ver a pagina fora da extensao. Uso:
 *   npm run build:rapido && npm run preview
 *   (na raiz do repo) python3 -m http.server 8765
 *   http://localhost:8765/opcoes-pagina/.preview/options.html?produto=SEI%20Pro%20Lab&seed=<dataValues urlencoded>
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SAIDA = join(RAIZ, "opcoes-pagina", ".preview");
mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "chrome-stub.js"),
  `(function () {
  var q = new URLSearchParams(location.search);
  var mem = { dataValues: q.get("seed") || "" };
  window.chrome = {
    runtime: {
      lastError: undefined,
      getManifest: function () { return { short_name: q.get("produto") || "SEI Pro Lab", homepage_url: "https://seipro.app", icons: { "32": "icons/icon-32.png" } }; },
      getURL: function (p) { return "../../dist/" + p; }
    },
    storage: { sync: {
      get: function (k, cb) { cb({ dataValues: mem.dataValues }); },
      set: function (o, cb) { Object.assign(mem, o); cb && cb(); }
    } }
  };
})();`,
);
const html = readFileSync(join(RAIZ, "dist", "html", "options.html"), "utf8")
  .replace("<head>", '<head>\n    <base href="../../dist/html/">\n    <script src="../../opcoes-pagina/.preview/chrome-stub.js"></script>');
writeFileSync(join(SAIDA, "options.html"), html);
console.log("Pre-visualizacao gerada em opcoes-pagina/.preview/options.html");
```
Acrescentar ao `.gitignore`: `opcoes-pagina/.preview/`.

- [ ] **Step 6: Build e verificação mecânica**

```bash
cd opcoes-pagina && npm run build && npm run tipos && npm run checar && cd ..
head -c 300 dist/html/options.js; echo
LC_ALL=C grep -c -P '[^\x00-\x7F]' dist/html/options.js    # esperado: 0
grep -c 'seipro.app\|fonts.g' dist/html/options.js        # seipro.app so como padrao de homepage; nenhum fonts.g
```
Expected: build OK, `0` bytes não-ASCII.

- [ ] **Step 7: Verificação visual (Chrome)**

```bash
cd opcoes-pagina && npm run preview && cd ..
python3 -m http.server 8765 &     # na raiz do worktree
```
Abrir `http://localhost:8765/opcoes-pagina/.preview/options.html` (Chrome DevTools MCP ou manual) e conferir, com captura de tela de cada item:
1. Título "SEI Pro Lab | Configurações" **inteiro, sem botão por cima**; barra de ações em linha própria; `Salvar` à direita.
2. 3 seções; a primeira aberta; contagens "N de M ativas"; ícones azuis nas ligadas, cinza nas desligadas; clicar num switch troca a cor do ícone e a contagem na hora.
3. Marcar "Reabertura programada" mostra o campo de horas; desmarcar esconde. "Selecionar valores padronizados" mostra/esconde o bloco; "Marcar nível público" desligado mostra "Hipótese legal".
4. Busca: digitar "prazo" filtra, "arvore" acha "Árvore"; `Esc` limpa.
5. Teclado: Tab chega a cada switch com foco visível; Espaço alterna; setas trocam de aba.
6. Larguras 380 px e 800 px; tema escuro (DevTools → Rendering → `prefers-color-scheme: dark`).
7. Base de Dados: preencher, adicionar 2ª base, subir/descer, remover, revelar a chave; Salvar com campo obrigatório vazio mostra o aviso e marca em vermelho.
8. Aba Network: **nenhuma** requisição a host que não seja `localhost` (`seed` com `?seed=` testa um `dataValues` real: copie um do storage de produção da sua máquina).
Ajustar o CSS onde algo estiver feio e repetir. Encerrar o servidor (`kill %1`).

- [ ] **Step 8: Commit**

```bash
git add opcoes-pagina/src/main.ts opcoes-pagina/build.mjs opcoes-pagina/scripts/preview.mjs .gitignore \
  dist/html/options.html dist/html/page.css dist/html/options.js
git commit -m "Opcoes: nova pagina (barra de acoes abaixo do titulo, secoes em cartoes, switches, busca) gerada do schema" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: `favoritos/opcoes` ancora em `[data-opcao]`

**Files:**
- Modify: `favoritos/src/opcoes/main.ts`
- Modify: `favoritos/tests/verificar-opcoes.ts`
- Regenerate: `dist/js/favoritos/opcoes.js`

**Interfaces:**
- Consumes: contrato `div.opcao[data-opcao]` (Task 3).
- Produces (`favoritos/src/opcoes/main.ts`): `export function encaixar(chave: HTMLInputElement, el: HTMLElement): HTMLElement | null` — insere o painel logo depois da linha da chave e devolve o wrapper (ou `null` se a chave não está numa `.opcao`).

- [ ] **Step 1: Teste (falha)** — acrescentar em `favoritos/tests/verificar-opcoes.ts` (no fim de `verificarOpcoes`, antes do `}` final), com o import `import { encaixar } from "../src/opcoes/main";`:

```ts
  secao("opcoes: encaixe na pagina nova");
  const doc = instalarDom('<html><body><div class="opcao" data-opcao="gerenciarfavoritos"><input type="checkbox" id="itemConfigGeral_gerenciarfavoritos" data-name="gerenciarfavoritos"></div><div class="opcao" data-opcao="gerenciarprojetos"></div></body></html>');
  const chaveDom = doc.getElementById("itemConfigGeral_gerenciarfavoritos") as HTMLInputElement;
  const conteudo = document.createElement("div");
  const wrapper = encaixar(chaveDom, conteudo);
  checar("o painel entra logo depois da linha da chave", wrapper !== null && wrapper === doc.querySelector('[data-opcao="gerenciarfavoritos"]')?.nextElementSibling && wrapper.contains(conteudo));
  checar("nao desloca a linha seguinte", wrapper?.nextElementSibling === doc.querySelector('[data-opcao="gerenciarprojetos"]'));
  const solta = doc.createElement("input");
  checar("chave fora de uma .opcao nao encaixa", encaixar(solta, conteudo) === null);
```
Run: `cd favoritos && npx tsx tests/verificar.ts` → FAIL (`encaixar` não existe).

- [ ] **Step 2: Implementar** — em `favoritos/src/opcoes/main.ts`:

Trocar o CSS (alinha com o novo layout; usa as variáveis da página com fallback):
```ts
const CSS = `.spro-fav-opcoes-linha{border-top:1px solid var(--linha,#ddd);background:var(--papel,#f7f7f7);padding:6px 20px 14px 44px}
.spro-fav-opcoes{display:grid;gap:6px;font-size:13px}
.spro-fav-opcoes fieldset{border:0;margin:0;padding:0;display:grid;gap:3px}
.spro-fav-opcoes legend{padding:0;margin-bottom:2px;font-weight:600}
.spro-fav-opcoes label{display:flex;gap:6px;align-items:center;cursor:pointer}
.spro-fav-opcoes-nota{margin:2px 0 0;opacity:.7}`;

/** Coloca o painel logo depois da linha (.opcao) da chave; null se a chave nao esta numa linha da pagina de opcoes. */
export function encaixar(chave: HTMLInputElement, el: HTMLElement): HTMLElement | null {
  const linha = chave.closest("[data-opcao]");
  if (!linha) return null;
  const nova = h("div", { class: "spro-fav-opcoes-linha" }, el);
  linha.after(nova);
  return nova;
}
```
e em `iniciar()` substituir o trecho do `closest("tr")`:
```ts
  const chave = document.getElementById("itemConfigGeral_gerenciarfavoritos") as HTMLInputElement | null;
  if (!temNovo || !chave) return;
  const el = await montarOpcoesExibicao({ sync: areaChrome(chrome.storage.sync, "sync"), lateralDisponivel: temPainelLateral(manifesto) });
  const nova = encaixar(chave, el);
  if (!nova) return;
  document.head.append(h("style", {}, CSS));
```
(remover as linhas `const linha = chave?.closest("tr")`, `const td = h("td"...)`, `const nova = h("tr"...)` e `linha.after(nova)`; o resto — `seguir`, `change`, `setInterval`, `seguir()` — fica.) O arquivo exporta `encaixar` mas continua executando `iniciar()` no import: guardar com `if (typeof chrome !== "undefined" && chrome.runtime?.getManifest)` antes de chamar, para o teste importar sem efeito colateral:
```ts
if (typeof chrome !== "undefined" && chrome.runtime?.getManifest) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void iniciar(), { once: true });
  else void iniciar();
}
```

- [ ] **Step 3: Rodar e regenerar o bundle**

```bash
cd favoritos && npx tsx tests/verificar.ts && npm run tipos && npm run checar && npm run build:rapido && cd ..
git status --short dist/js | cat
```
Expected: testes `ok`; só `dist/js/favoritos/opcoes.js` modificado em `dist/js` (os outros bundles saem byte-idênticos; se aparecer outro arquivo modificado, **não** o inclua no commit e avise).

- [ ] **Step 4: Commit**

```bash
git add favoritos/src/opcoes/main.ts favoritos/tests/verificar-opcoes.ts dist/js/favoritos/opcoes.js
git commit -m "Favoritos: a secao 'onde mostrar' encaixa na linha [data-opcao] da pagina de opcoes nova" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Verificação final na extensão real

**Files:** nenhum arquivo de código novo (correções só se algo falhar). Atualizar memória do projeto ao final.

- [ ] **Step 1: Suítes completas**

```bash
(cd opcoes-pagina && npm run verificar && npm run tipos && npm run checar)
(cd favoritos && npx tsx tests/verificar.ts && npm run tipos && npm run checar)
```
Expected: 0 falhas, sem erro de tipo/lint.

- [ ] **Step 2: Carregar `dist/` como extensão descompactada** (Chrome → `chrome://extensions` → modo desenvolvedor → "Carregar sem compactação" → pasta `dist` do worktree; ver memória `reference_mcp_chrome_extensao`: o MCP do DevTools abre sem extensões, então use o harness puppeteer com `installExtension` ou o Chrome normal). Abrir `chrome-extension://<id>/html/options.html` e conferir:
  1. Aparecem as opções **gravadas** (use um perfil com configuração real): alternar 2 chaves, mudar `newdocname` e `qualidadeimagens`, Salvar, recarregar a página → os valores permanecem.
  2. `chrome.storage.sync.get('dataValues')` (console da página) tem o mesmo formato de antes: array de perfis + `{configGeral:[...]}`.
  3. "Baixar configurações" baixa `config.json`; "Carregar configurações" com esse mesmo arquivo recarrega e mantém tudo; um arquivo `.txt` qualquer mostra o aviso de JSON inválido.
  4. Links `ⓘ` abrem `https://seipro.app/pages/<SLUG>.html` (um deles aberto de verdade).
  5. "Processos Monitorados" ligado mostra o bloco "Onde mostrar" **logo abaixo da linha**; desligar esconde.
  6. Em `sei-pro-all.js:922` a página aparece dentro do SEI (iframe 800 px) em *Infra → Configurar*: abrir um SEI de teste (memória `reference_sei_sp_treinamento`), conferir o layout dentro do iframe e que o `Salvar` continua visível ao rolar.
  7. Produto ANTAQ/ANTT: com um `manifest_antaq.json` (copiar para `dist/manifest.json` num worktree descartável) conferir que `ferramentasia` e `estudiofluxo` ficam escondidas e que "Gerenciar Formulários/NatJus" só aparecem no Lab.
  8. Console sem erros; aba Network sem host externo.

- [ ] **Step 3: Revisão de código da branch**

Pedir `code-review` (skill `code-review`, nível high) sobre `git diff master...feat/opcoes-redesign` e tratar o que for real.

- [ ] **Step 4: Atualizar a memória do projeto**

Atualizar `project_opcoes_redesign.md` (status: implementado na branch `feat/opcoes-redesign`, sem merge/release; pacote `opcoes-pagina/`; achados: links de manual do legado quebrados pelo prefixo do `homepage_url`, `newdocsigilo` perdia nível/rótulo ao salvar, remover a última base nunca limpava; pendência: portar whitelabels antaq/antt/conab para o schema).

- [ ] **Step 5: Entrega** — **sem merge e sem release**; o usuário decide (usar `superpowers:finishing-a-development-branch`). Se for para release: `pages/HISTORICO.md` precisa de entrada (memória `feedback_release_historico`).
