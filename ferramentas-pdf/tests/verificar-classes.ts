/**
 * Verificação das classes de CSS.
 *
 * POR QUE ISTO EXISTE: uma classe escrita com acento no código (`tarjar-página`
 * em vez de `tarjar-pagina`) não casa com a regra da folha de estilo, e o
 * efeito não se parece nem um pouco com a causa. Foi o que aconteceu: a página
 * do visualizador perdeu `position: relative`, e as tarjas — posicionadas de
 * forma absoluta — subiram para o topo do documento, por cima do cabeçalho da
 * ferramenta. Nenhum erro no console, e a lista de detecções funcionando
 * normalmente ao lado.
 *
 * A conferência vale para qualquer erro de digitação em nome de classe, não só
 * para acento.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(AQUI, "..", "src");
const CSS_PAGINA = resolve(AQUI, "..", "..", "dist", "css", "ferramentas-pdf.css");

let passou = 0;
let falhou = 0;

function checar(nome: string, condicao: boolean, detalhe?: string) {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
  } else {
    falhou += 1;
    console.log(`  FALHA ${nome}${detalhe ? ` -- ${detalhe}` : ""}`);
  }
}

function arquivosTs(dir: string): string[] {
  const saida: string[] = [];
  for (const item of readdirSync(dir)) {
    const caminho = join(dir, item);
    if (statSync(caminho).isDirectory()) saida.push(...arquivosTs(caminho));
    else if (item.endsWith(".ts")) saida.push(caminho);
  }
  return saida;
}

/** Classes que o código aplica: `class: "..."` e `classList.toggle("...")`. */
function classesUsadas(): Map<string, string> {
  const usadas = new Map<string, string>();
  for (const arquivo of arquivosTs(SRC)) {
    // Sem comentarios: os exemplos de uso escritos na documentacao do codigo
    // nao sao classes de verdade.
    const texto = readFileSync(arquivo, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const curto = arquivo.slice(SRC.length + 1);

    // Aspas simples ou duplas: a lista inteira e literal.
    for (const m of texto.matchAll(/class:\s*["']([^"']+)["']/g)) {
      for (const c of m[1].split(/\s+/)) if (c) usadas.set(c, curto);
    }
    for (const m of texto.matchAll(/classList\.\w+\(\s*"([^"]+)"/g)) {
      usadas.set(m[1], curto);
    }
    // Template: so as partes LITERais valem. `${...}` monta o resto em tempo de
    // execucao e nao da para conferir aqui -- tentar conferir produziria nomes
    // truncados como "fpdf-pagina${p.removida", que nao sao classe nenhuma.
    for (const m of texto.matchAll(/class:\s*`([^`]+)`/g)) {
      const semInterpolacao = m[1].replace(/\$\{[^}]*\}/g, " ");
      for (const c of semInterpolacao.split(/\s+/)) {
        // Nome terminado em separador e prefixo truncado por interpolacao
        // (`fpdf-pdfa__item--${...}`): a classe final so existe em execucao.
        if (c && /^[a-zA-Z][\w-]*$/.test(c) && !/[-_]$/.test(c)) usadas.set(c, curto);
      }
    }
  }
  return usadas;
}

/** Classes definidas na folha de estilo da página. */
function classesDefinidas(): Set<string> {
  const css = readFileSync(CSS_PAGINA, "utf8");
  const definidas = new Set<string>();
  for (const m of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) definidas.add(m[1]);
  return definidas;
}

const usadas = classesUsadas();
const definidas = classesDefinidas();

/**
 * Classes que vêm de fora desta folha: Font Awesome, camada de texto do pdf.js
 * e utilitárias do próprio SEI Pro.
 */
const DE_FORA = new Set([
  "fas", "far", "fad", "fab", "fal", "fa-spin", "fa-fw",
  "textLayer", "endOfContent", "markedContent",
  "sr-only",
]);
const ehDeFora = (c: string) => DE_FORA.has(c) || c.startsWith("fa-");

console.log("\n== classes de CSS ==");
console.log(`  (${usadas.size} usadas no código, ${definidas.size} definidas na folha)`);

checar("a folha de estilo foi lida", definidas.size > 50, `${definidas.size} classes`);

const semRegra = [...usadas.entries()]
  .filter(([c]) => !ehDeFora(c) && !definidas.has(c))
  .sort();

checar(
  "toda classe usada existe na folha de estilo",
  semRegra.length === 0,
  semRegra.length ? semRegra.map(([c, f]) => `${c} (${f})`).join(", ") : undefined,
);

// Trava específica: acento em nome de classe nunca é intencional, e foi o que
// derrubou o visualizador de tarja uma vez.
const acentuadas = [...usadas.keys()].filter((c) => /[^\x20-\x7E]/.test(c));
checar(
  "nenhum nome de classe tem acento",
  acentuadas.length === 0,
  acentuadas.join(", "),
);

console.log("\n== chaves de dataset e nomes de atributo ==");
// A MESMA causa das classes, com efeito ainda mais dificil de enxergar: a
// pagina era criada com `dataset: { página: ... }` e o observador procurava
// `dataset.pagina`. Nunca encontrava, o desenho nunca era pedido, e o
// visualizador ficava em branco -- sem erro nenhum, com a lista de deteccoes
// funcionando normalmente ao lado.
const acentuado = /[^\x20-\x7E]/;
const problemas: string[] = [];

for (const arquivo of arquivosTs(SRC)) {
  const texto = readFileSync(arquivo, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const curto = arquivo.slice(SRC.length + 1);

  // Chaves dentro de `dataset: { ... }`.
  for (const m of texto.matchAll(/dataset:\s*\{([^}]*)\}/g)) {
    for (const par of m[1].split(",")) {
      const chave = par.split(":")[0]?.trim();
      if (chave && acentuado.test(chave)) problemas.push(`${curto}: dataset.${chave}`);
    }
  }
  // Leitura por `dataset.x` e seletores `[data-x]`.
  for (const m of texto.matchAll(/dataset\.([A-Za-z\u00C0-\u017F_]+)/g)) {
    if (acentuado.test(m[1])) problemas.push(`${curto}: dataset.${m[1]}`);
  }
  for (const m of texto.matchAll(/\[data-([A-Za-z\u00C0-\u017F-]+)/g)) {
    if (acentuado.test(m[1])) problemas.push(`${curto}: [data-${m[1]}]`);
  }
}

checar(
  "nenhuma chave de dataset ou atributo tem acento",
  problemas.length === 0,
  problemas.join(", "),
);

console.log("\n== montagem das ferramentas ==");
// O painel de opcoes de algumas ferramentas pede um `sincronizar()` durante a
// propria construcao (o Dividir ajusta quais campos aparecem). Se a moldura
// chamar o painel ANTES de criar os elementos que o sincronizar le, o modulo
// morre com "Cannot access ... before initialization" e a tela fica parada em
// "Carregando..." -- foi o que aconteceu com o Dividir.
const moldura = readFileSync(new URL("../src/ui/moldura.ts", import.meta.url), "utf8");

checar(
  "a moldura tem guarda de montagem",
  /let montado = false/.test(moldura) && /if \(!montado\) return/.test(moldura),
);
checar(
  "e so libera depois de montar tudo",
  moldura.indexOf("montado = true") > moldura.indexOf("const opcoesPainel"),
);
checar(
  "e sincroniza uma vez ao final",
  /montado = true[\s\S]{0,400}sincronizar\(\);/.test(moldura),
);

console.log("\n== o atributo hidden vence o display das classes ==");
// O navegador aplica `[hidden] { display: none }` na folha dele, que PERDE para
// qualquer regra de classe. Como a interface usa `display` em quase todo
// contêiner, esconder um elemento não bastava: a área de preview e o painel de
// ocorrências continuavam na tela, vazios, antes de haver documento.
const folha = readFileSync(CSS_PAGINA, "utf8");
checar(
  "a folha reafirma o [hidden] com !important",
  /\[hidden\][\s\S]{0,80}display:\s*none\s*!important/.test(folha),
);

// E vale conferir quem depende disso: todo elemento que o código esconde e que
// tem display definido por classe.
const escondidos = new Set<string>();
for (const arquivo of arquivosTs(SRC)) {
  const texto = readFileSync(arquivo, "utf8");
  for (const m of texto.matchAll(/class:\s*"([\w-]+)"[^)]{0,200}hidden:\s*true/g)) {
    escondidos.add(m[1]);
  }
  for (const m of texto.matchAll(/(\w+)\.hidden\s*=/g)) {
    escondidos.add(m[1]);
  }
}
checar(
  "há elementos que dependem da regra",
  escondidos.size > 0,
  `${escondidos.size} encontrados`,
);

console.log(`\n${passou} conferem, ${falhou} falham\n`);
process.exit(falhou === 0 ? 0 : 1);
