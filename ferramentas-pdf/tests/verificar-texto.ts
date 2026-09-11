/**
 * Conferencia do texto que o usuario le.
 *
 * DOIS DEFEITOS QUE JA ACONTECERAM, e por isso viraram teste.
 *
 * 1. ACENTO FALTANDO. A regra de escapar acentos como `\uXXXX` vale para os
 *    scripts injetados no SEI, NAO para esta pagina -- que e UTF-8 e propria.
 *    Escrever sem acento "por seguranca" produziu telas com "Nao foi possivel
 *    desenhar a pagina" no meio de frases acentuadas. Nada falha: o texto
 *    simplesmente sai errado, e so um olho humano percebe.
 *
 *    A correcao automatizada foi PIOR: um script que acentuava tudo atingiu
 *    identificadores (`paginasProcessadas` -> `páginasProcessadas`) e
 *    nomes de classe CSS (`tarjar-pagina` -> `tarjar-página`), quebrando
 *    o preview inteiro. Dai este teste APONTAR, e nao corrigir.
 *
 * 2. A MARCA DO PROJETO DE ORIGEM. O nucleo veio de outro projeto, e duas
 *    linhas gravavam o nome dele em `/Creator` e `/Producer` -- ou seja, DENTRO
 *    de todo PDF tarjado que o usuario protocola -- alem de um `/CMapName`.
 *    Um `grep -i` pela marca sem acento nao encontra a forma acentuada; por
 *    isso aqui a busca cobre as duas, e varre tambem o `dist/` construido.
 *
 * O DISCRIMINADOR. Nem toda string e texto visivel: a maioria e nome de classe
 * ("fpdf-botao fpdf-botao--primario") ou de icone ("fas fa-marker"), onde o
 * acento seria justamente o defeito. A regra usada e a unica que separa os dois
 * casos sem lista manual: se TODA palavra da string for minuscula e ao menos
 * uma tiver hifen, e nome de classe. Frase de verdade nao tem hifen colado em
 * palavra minuscula ("ou escolha o arquivo do seu computador" passa pelo
 * crivo e e conferida).
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// `new URL(...).pathname` nao serve: o caminho deste projeto tem espaco
// ("SEI Pro") e voltaria com %20, fazendo todo existsSync dar falso.
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(RAIZ, "..", "dist");

let ok = 0;
const falhas: string[] = [];

function checar(o_que: string, condicao: boolean, detalhe = ""): void {
  if (condicao) ok += 1;
  else falhas.push(`${o_que}${detalhe ? ` -- ${detalhe}` : ""}`);
}

/* ------------------------------------------------------------------ *
 * 1. A marca do projeto de origem
 * ------------------------------------------------------------------ */

// Escrita em pedacos para que o proprio arquivo de teste nao case com a busca
// e vire o unico "achado" do varredor.
const MARCA = new RegExp("eutr" + "[oó]" + "pio", "i");

function arquivos(dir: string, aceita: (n: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  const saida: string[] = [];
  for (const nome of readdirSync(dir)) {
    if (nome === "node_modules" || nome === ".git") continue;
    const cam = join(dir, nome);
    if (statSync(cam).isDirectory()) saida.push(...arquivos(cam, aceita));
    else if (aceita(nome)) saida.push(cam);
  }
  return saida;
}

const paraMarca = [
  ...arquivos(join(RAIZ, "src"), (n) => n.endsWith(".ts")),
  ...arquivos(join(DIST, "js", "ferramentas-pdf"), (n) => n.endsWith(".js")),
  ...arquivos(join(DIST, "html"), (n) => n === "ferramentas-pdf.html"),
  ...arquivos(join(DIST, "css"), (n) => n === "ferramentas-pdf.css"),
];

checar("ha arquivos para varrer atras da marca de origem", paraMarca.length > 10, `${paraMarca.length}`);

for (const cam of paraMarca) {
  const txt = readFileSync(cam, "utf8");
  // `ó` escapado pelo esbuild tambem conta: e o que vai para o PDF.
  const escapado = txt.includes("Eutr\\xF3pio") || txt.includes("Eutr\\u00f3pio");
  checar(
    `sem a marca do projeto de origem: ${relative(RAIZ, cam)}`,
    !MARCA.test(txt) && !escapado,
  );
}

/* ------------------------------------------------------------------ *
 * 2. Acentos no texto visivel
 * ------------------------------------------------------------------ */

/**
 * So palavras que NAO existem sem acento em portugues.
 *
 * Ficaram de fora as ambiguas -- `esta`/`esta`, `tem`/`tem`, `e`/`e`, `so`/`so`,
 * `copia`/`copia` --, porque um teste que acusa o que esta certo deixa de ser
 * lido e vira ruido.
 */
const SEM_ACENTO: Record<string, string> = {
  pagina: "página", paginas: "páginas", nao: "não", sao: "são",
  voce: "você", opcao: "opção", opcoes: "opções",
  acao: "ação", acoes: "ações", numero: "número",
  numeros: "números", codigo: "código", basico: "básico",
  unico: "único", unica: "única", ultimo: "último", ultima: "última",
  proximo: "próximo", maximo: "máximo", minimo: "mínimo",
  possivel: "possível", impossivel: "impossível", disponivel: "disponível",
  invalido: "inválido", automatico: "automático", rapido: "rápido",
  pratico: "prático", publico: "público", selecionavel: "selecionável",
  selecionaveis: "selecionáveis", legivel: "legível", legiveis: "legíveis",
  extraivel: "extraível", extraiveis: "extraíveis", verificavel: "verificável",
  pesquisavel: "pesquisável", ate: "até", porem: "porém",
  tambem: "também", alem: "além", apos: "após", atraves: "através",
  memoria: "memória", historico: "histórico", relatorio: "relatório",
  diretorio: "diretório", usuario: "usuário", usuarios: "usuários",
  inicio: "início", sera: "será", serao: "serão", fara: "fará",
  farao: "farão", ira: "irá", irao: "irão", conteudo: "conteúdo",
  terao: "terão", excecao: "exceção", excecoes: "exceções",
  atencao: "atenção", informacao: "informação",
  informacoes: "informações", descricao: "descrição",
  descricoes: "descrições", verificacao: "verificação",
  verificacoes: "verificações", compressao: "compressão",
  dimensao: "dimensão", dimensoes: "dimensões", extracao: "extração",
  rotacao: "rotação", numeracao: "numeração",
  organizacao: "organização", aplicacao: "aplicação",
  operacao: "operação", posicao: "posição",
  posicoes: "posições", versao: "versão", versoes: "versões",
  conversao: "conversão", divisao: "divisão", sessao: "sessão",
  permissao: "permissão", confirmacao: "confirmação",
  configuracao: "configuração", maquina: "máquina",
  portugues: "português", necessario: "necessário",
  necessarios: "necessários", necessaria: "necessária",
  necessarias: "necessárias", distribuido: "distribuído",
  instalacoes: "instalações", parametros: "parâmetros",
  tipicos: "típicos", sensivel: "sensível", sensiveis: "sensíveis",
  reconstruida: "reconstruída", reconstruidas: "reconstruídas",
  alcanca: "alcança", entao: "então", tera: "terá",
  mao: "mão", area: "área", areas: "áreas", seguranca: "segurança",
  aparencia: "aparência", referencia: "referência",
  sucesso1: "", // marcador inofensivo: mantem o objeto aberto a insercoes
};
delete SEM_ACENTO.sucesso1;

/** Nome de classe/icone: toda palavra minuscula e ao menos uma com hifen. */
function pareceClasse(s: string): boolean {
  const palavras = s.trim().split(/\s+/);
  if (palavras.length === 0) return false;
  const todasMinusculas = palavras.every((p) => /^[a-z0-9_-]+$/.test(p));
  return todasMinusculas && palavras.some((p) => p.includes("-"));
}

/**
 * Tira as interpolacoes de um template, porque dentro delas ha CODIGO.
 *
 * Sem isto, `${acao.marcacoes.length} area(s)` acusava o identificador `acao`
 * como acento faltando -- e acentuar identificador foi exatamente o estrago que
 * este teste existe para impedir. O texto visivel que mora dentro de um ternario
 * (`${n === 1 ? "pagina" : "paginas"}`) nao se perde: sao literais proprios, e
 * o varredor os encontra por conta.
 */
function semInterpolacoes(s: string): string {
  let antes = s;
  for (let i = 0; i < 6; i += 1) {
    const depois = antes.replace(/\$\{[^{}]*\}/g, " ");
    if (depois === antes) break;
    antes = depois;
  }
  return antes;
}

/**
 * Chave, codigo de erro, slug de nome de arquivo ou parametro de URL.
 *
 * O criterio e a CAIXA, unica coisa que separa `"atencao"` (chave de um
 * Record) de `"Atencao"` (rotulo que aparece na tela), ja que ambos sao uma
 * palavra sem espaco. Codigo de erro (`SEI_SESSAO_EXPIRADA`) e sempre
 * maiusculo; chave e slug (`acao=documento_receber`, `-pesquisavel.pdf`) sao
 * sempre minusculos. Frase tem espaco, e por isso nunca cai aqui.
 */
function pareceIdentificador(s: string): boolean {
  const t = s.trim();
  if (/\s/.test(t)) return false;
  return /^[a-z0-9_.:=&?~-]+$/.test(t) || /^[A-Z0-9_]+$/.test(t);
}

/** Seletor CSS -- `a[href*="acao=..."]`, `[data-acao="..."]`. */
function pareceSeletor(s: string): boolean {
  return /\[[a-zA-Z-]+[*^$~|]?=/.test(s) || /^[a-z]*\[/.test(s.trim());
}

function semComentarios(txt: string): string {
  return txt
    .replace(/\/\*[\s\S]*?\*\//g, (m) => "\n".repeat((m.match(/\n/g) ?? []).length))
    .replace(/\/\/[^\n]*/g, "");
}

const ASPAS = /(["'])((?:\\.|(?!\1)[^\\\n])*)\1/g;
const CRASE = /`((?:\\.|[^\\`])*)`/g;

const fontes = arquivos(join(RAIZ, "src"), (n) => n.endsWith(".ts"));
checar("ha fontes para conferir acentuacao", fontes.length > 20, `${fontes.length}`);

let conferidas = 0;

for (const cam of fontes) {
  const txt = semComentarios(readFileSync(cam, "utf8"));
  for (const rx of [ASPAS, CRASE]) {
    rx.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rx.exec(txt))) {
      const cru = rx === ASPAS ? m[2] : m[1];
      if (!cru) continue;
      const s = semInterpolacoes(cru);
      if (s.trim().length < 3) continue;
      if (s.includes("/") || s.startsWith("@") || s.startsWith("#") || s.startsWith(".")) continue;
      if (pareceClasse(s) || pareceIdentificador(s) || pareceSeletor(s)) continue;
      if (!/[A-Za-zÀ-ÿ]{3}/.test(s)) continue;
      conferidas += 1;
      const linha = txt.slice(0, m.index).split("\n").length;
      for (const p of s.match(/[A-Za-zÀ-ÿ]+/g) ?? []) {
        const certo = SEM_ACENTO[p.toLowerCase()];
        if (!certo) continue;
        // `Pagina` no inicio da frase conta tanto quanto `pagina`.
        falhas.push(
          `acento faltando em ${relative(RAIZ, cam)}:${linha} -- "${p}" deveria ser "${certo}" | ${s.slice(0, 90)}`,
        );
      }
    }
  }
}

checar("o varredor encontrou texto visivel de verdade", conferidas > 100, `${conferidas} strings`);

/* ------------------------------------------------------------------ */

const total = ok + falhas.length;
if (falhas.length > 0) {
  console.error(`\nverificar-texto: ${ok} conferem, ${falhas.length} falham (de ${total})\n`);
  for (const f of falhas) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}
console.log(`verificar-texto: ${ok} conferem, 0 falham`);
