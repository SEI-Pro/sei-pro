import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as acorn from "acorn";

/**
 * Detector do contrato de nomes globais entre um modulo legado do editor e o resto do legado.
 *  - exportados: tudo que o modulo atribui a `window.<nome>`;
 *  - necessarios: os exportados que algum OUTRO arquivo vivo (monolito, outros modulos, demais
 *    `dist/js/*.js`) referencia como identificador ou como `window.<nome>`. Comentarios e chaves de
 *    objeto / propriedades `.nome` nao contam (acorn separa codigo vivo de comentario).
 */
interface No {
  type: string;
  name?: string;
  computed?: boolean;
  object?: No;
  property?: No;
  left?: No;
  key?: No;
  [k: string]: unknown;
}

const cacheAst = new Map<string, No | null>();
function analisar(arquivo: string): No | null {
  if (!cacheAst.has(arquivo)) {
    try {
      cacheAst.set(
        arquivo,
        acorn.parse(readFileSync(arquivo, "utf8"), { ecmaVersion: "latest", allowReturnOutsideFunction: true }) as unknown as No,
      );
    } catch {
      cacheAst.set(arquivo, null);
    }
  }
  return cacheAst.get(arquivo) ?? null;
}

function percorrer(n: unknown, visita: (no: No, pai: No | null) => void, pai: No | null = null): void {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) {
    for (const x of n) percorrer(x, visita, pai);
    return;
  }
  const no = n as No;
  if (typeof no.type === "string") visita(no, pai);
  for (const k of Object.keys(no)) if (k !== "type") percorrer(no[k], visita, typeof no.type === "string" ? no : pai);
}

export function exportadosDoModulo(arquivo: string): string[] {
  const out = new Set<string>();
  percorrer(analisar(arquivo), (no) => {
    const e = no.left;
    if (
      no.type === "AssignmentExpression" &&
      e?.type === "MemberExpression" &&
      e.object?.name === "window" &&
      !e.computed &&
      e.property?.name
    )
      out.add(e.property.name);
  });
  return [...out];
}

export function nomesReferenciados(arquivo: string, nomes: ReadonlySet<string>): Set<string> {
  const achados = new Set<string>();
  percorrer(analisar(arquivo), (no, pai) => {
    if (no.type !== "Identifier" || !no.name || !nomes.has(no.name)) return;
    if (pai?.type === "MemberExpression" && pai.property === no && !pai.computed) {
      // `window.nome` conta; `obj.nome` nao
      if (pai.object?.name === "window") achados.add(no.name);
      return;
    }
    if (pai?.type === "Property" && pai.key === no && !pai.computed) return; // chave de objeto
    achados.add(no.name);
  });
  return achados;
}

/** Arquivos vivos que podem chamar um modulo do editor: `dist/js/*.js` e `dist/js/modules/editor/*.js`. */
export function arquivosVivos(raizDist: string): string[] {
  const js = readdirSync(join(raizDist, "js"))
    .filter((f) => f.endsWith(".js"))
    .map((f) => join(raizDist, "js", f));
  const mods = readdirSync(join(raizDist, "js", "modules", "editor"))
    .filter((f) => f.endsWith(".js"))
    .map((f) => join(raizDist, "js", "modules", "editor", f));
  return [...js, ...mods];
}

export function contratoDoModulo(raizDist: string, id: string): { exportados: string[]; necessarios: string[] } {
  const arquivo = join(raizDist, "js", "modules", "editor", `${id}.js`);
  const exportados = exportadosDoModulo(arquivo);
  const procurados = new Set(exportados);
  const usados = new Set<string>();
  for (const f of arquivosVivos(raizDist)) {
    if (f === arquivo) continue;
    for (const n of nomesReferenciados(f, procurados)) usados.add(n);
  }
  return { exportados, necessarios: exportados.filter((n) => usados.has(n)) };
}
