/**
 * Esquemas de parâmetros das tools: o subconjunto de JSON Schema que os
 * provedores (OpenAI, Anthropic, Gemini via OpenRouter) aceitam, com um
 * validador próprio.
 *
 * Por que validar aqui se o provedor já recebe o esquema: modelos erram
 * argumento (número como string, enum inventado, campo esquecido). Validar
 * antes de executar transforma o erro em resultado da tool — "campo X
 * obrigatório" —, e o modelo corrige sozinho na rodada seguinte, em vez de a
 * operação chegar ao SEI com lixo.
 *
 * Construtores curtos (`s.texto()`, `s.objeto({...})`) mantêm as definições
 * de tool legíveis sem trazer uma biblioteca inteira de validação.
 */

export type Esquema =
  | { type: "string"; description?: string; enum?: string[]; minLength?: number; maxLength?: number }
  | { type: "integer" | "number"; description?: string; minimum?: number; maximum?: number }
  | { type: "boolean"; description?: string }
  | { type: "array"; description?: string; items: Esquema; minItems?: number; maxItems?: number }
  | {
      type: "object";
      description?: string;
      properties: Record<string, Esquema>;
      required?: string[];
      additionalProperties?: false;
    }
  | { type: "object"; description?: string; additionalProperties: true };

type Desc = { descricao?: string };

export const s = {
  texto: (o: Desc & { enum?: string[]; min?: number; max?: number } = {}): Esquema => ({
    type: "string",
    ...(o.descricao ? { description: o.descricao } : {}),
    ...(o.enum ? { enum: o.enum } : {}),
    ...(o.min !== undefined ? { minLength: o.min } : {}),
    ...(o.max !== undefined ? { maxLength: o.max } : {}),
  }),
  inteiro: (o: Desc & { min?: number; max?: number } = {}): Esquema => ({
    type: "integer",
    ...(o.descricao ? { description: o.descricao } : {}),
    ...(o.min !== undefined ? { minimum: o.min } : {}),
    ...(o.max !== undefined ? { maximum: o.max } : {}),
  }),
  booleano: (o: Desc = {}): Esquema => ({ type: "boolean", ...(o.descricao ? { description: o.descricao } : {}) }),
  lista: (itens: Esquema, o: Desc & { min?: number; max?: number } = {}): Esquema => ({
    type: "array",
    items: itens,
    ...(o.descricao ? { description: o.descricao } : {}),
    ...(o.min !== undefined ? { minItems: o.min } : {}),
    ...(o.max !== undefined ? { maxItems: o.max } : {}),
  }),
  /** Objeto de forma livre (ex.: argumentos de outra tool dentro de um plano). */
  livre: (o: Desc = {}): Esquema => ({ type: "object", additionalProperties: true, ...(o.descricao ? { description: o.descricao } : {}) }),
  /** Campos com `?` no fim do nome são opcionais: `{ "texto?": s.texto() }`. */
  objeto: (campos: Record<string, Esquema>, o: Desc = {}): Esquema => {
    const properties: Record<string, Esquema> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(campos)) {
      const opcional = k.endsWith("?");
      const nome = opcional ? k.slice(0, -1) : k;
      properties[nome] = v;
      if (!opcional) required.push(nome);
    }
    return {
      type: "object",
      properties,
      ...(required.length ? { required } : {}),
      additionalProperties: false,
      ...(o.descricao ? { description: o.descricao } : {}),
    };
  },
};

/**
 * Valida e normaliza. Devolve a lista de erros (vazia = válido). Coage o que é
 * inequívoco (número em string, "true"/"false"), porque rejeitar isso só
 * custaria uma rodada a mais do modelo.
 */
export function validar(esq: Esquema, valor: unknown, caminho = "args"): { valor: unknown; erros: string[] } {
  const erros: string[] = [];
  const v = checarValor(esq, valor, caminho, erros);
  return { valor: v, erros };
}

function checarValor(esq: Esquema, v: unknown, cam: string, erros: string[]): unknown {
  switch (esq.type) {
    case "string": {
      if (typeof v === "number" || typeof v === "boolean") v = String(v);
      if (typeof v !== "string") return erros.push(`${cam}: esperado texto`), v;
      if (esq.enum && !esq.enum.includes(v)) erros.push(`${cam}: use um de ${esq.enum.join(", ")}`);
      if (esq.minLength !== undefined && v.length < esq.minLength) erros.push(`${cam}: m\u00EDnimo de ${esq.minLength} caracteres`);
      if (esq.maxLength !== undefined && v.length > esq.maxLength) erros.push(`${cam}: m\u00E1ximo de ${esq.maxLength} caracteres`);
      return v;
    }
    case "integer":
    case "number": {
      if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) v = Number(v);
      if (typeof v !== "number" || Number.isNaN(v)) return erros.push(`${cam}: esperado n\u00FAmero`), v;
      if (esq.type === "integer" && !Number.isInteger(v)) erros.push(`${cam}: esperado inteiro`);
      if (esq.minimum !== undefined && v < esq.minimum) erros.push(`${cam}: m\u00EDnimo ${esq.minimum}`);
      if (esq.maximum !== undefined && v > esq.maximum) erros.push(`${cam}: m\u00E1ximo ${esq.maximum}`);
      return v;
    }
    case "boolean": {
      if (v === "true") v = true;
      if (v === "false") v = false;
      if (typeof v !== "boolean") erros.push(`${cam}: esperado true ou false`);
      return v;
    }
    case "array": {
      if (typeof v === "string" && esq.items.type === "string") v = [v]; // "um item" vira lista de um
      if (!Array.isArray(v)) return erros.push(`${cam}: esperada lista`), v;
      if (esq.minItems !== undefined && v.length < esq.minItems) erros.push(`${cam}: m\u00EDnimo de ${esq.minItems} item(ns)`);
      if (esq.maxItems !== undefined && v.length > esq.maxItems) erros.push(`${cam}: m\u00E1ximo de ${esq.maxItems} itens`);
      return v.map((x, i) => checarValor(esq.items, x, `${cam}[${i}]`, erros));
    }
    case "object": {
      if (!v || typeof v !== "object" || Array.isArray(v)) return erros.push(`${cam}: esperado objeto`), v;
      if (!("properties" in esq)) return v;
      const o = v as Record<string, unknown>;
      const saida: Record<string, unknown> = {};
      for (const r of esq.required ?? []) if (o[r] === undefined || o[r] === null) erros.push(`${cam}.${r}: obrigat\u00F3rio`);
      for (const [k, x] of Object.entries(o)) {
        const sub = esq.properties[k];
        if (!sub) {
          erros.push(`${cam}.${k}: campo desconhecido (campos: ${Object.keys(esq.properties).join(", ")})`);
          continue;
        }
        if (x === null || x === undefined) continue;
        saida[k] = checarValor(sub, x, `${cam}.${k}`, erros);
      }
      return saida;
    }
  }
}
