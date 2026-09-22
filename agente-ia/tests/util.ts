/**
 * Utilitários dos testes: mesma forma dos `verificar-*.ts` das Ferramentas de
 * PDF (sem framework), com o DOMParser do linkedom instalado no núcleo.
 */

import { DOMParser as DOMParserLinkedom } from "linkedom";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { definirAnalisador } from "@nucleo/sessao/dom";
import type { Pagina } from "@nucleo/sessao/http";

const parser = new DOMParserLinkedom();
definirAnalisador((html) => parser.parseFromString(html, "text/html") as unknown as Document);

let passou = 0;
let falhou = 0;

export function secao(nome: string): void {
  console.log(`\n== ${nome} ==`);
}

export function checar(nome: string, condicao: boolean, detalhe?: unknown): void {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
  } else {
    falhou += 1;
    console.log(`  FALHA ${nome}${detalhe !== undefined ? ` -- ${typeof detalhe === "string" ? detalhe : JSON.stringify(detalhe)}` : ""}`);
  }
}

export async function lanca(fn: () => unknown | Promise<unknown>): Promise<{ codigo?: string; message?: string } | null> {
  try {
    await fn();
    return null;
  } catch (e) {
    return e as { codigo?: string; message?: string };
  }
}

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Fixture capturada do SEI; a primeira linha é `<!-- url: ... -->`. */
export function fixture(nome: string): Pagina {
  const bruto = readFileSync(join(AQUI, "fixtures", nome), "utf8");
  const url = /^<!-- url: (.*?) -->/.exec(bruto)?.[1] ?? "https://sei.exemplo.gov.br/sei/controlador.php";
  const html = bruto.replace(/^<!-- url: .*? -->\n/, "");
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

export function resumo(): void {
  console.log(`\n${passou} ok, ${falhou} falha(s)\n`);
  if (falhou > 0) process.exit(1);
}
