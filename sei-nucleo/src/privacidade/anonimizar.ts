/**
 * Anonimização na fonte: nada de dado pessoal sai do navegador para um modelo
 * de IA sem passar por aqui.
 *
 * TRÊS CAMADAS, da mais precisa para a mais ampla:
 *
 * 1. Detectores validados do Tarjar (Ferramentas de PDF): CPF, e-mail,
 *    telefone, CEP, cartão, chave PIX, RG, PIS, título de eleitor, CNH e data
 *    de nascimento — com dígito verificador ou rótulo por perto, nas duas
 *    projeções (com e sem espaço). É a mesma detecção que tarja PDFs, com as
 *    mesmas taxas de falso positivo medidas lá.
 * 2. Rótulos: o que vem depois de "residente e domiciliado", "endereço",
 *    "filho(a) de", "nome da mãe", "agência/conta", "CID", "Sr./Sra." etc.
 *    Regex não reconhece nome de pessoa em texto livre; reconhece o CONTEXTO
 *    em que documentos oficiais escrevem nomes e endereços.
 * 3. Dicionário: nomes já conhecidos pelo núcleo (interessados do processo,
 *    contatos) são procurados literalmente, sem acento e sem caixa.
 *
 * PSEUDÔNIMOS REVERSÍVEIS. Cada valor vira um rótulo estável (`[CPF_1]`,
 * `[PESSOA_2]`): o mesmo CPF repetido recebe o mesmo rótulo, e o modelo
 * consegue raciocinar ("o requerente [PESSOA_2] é o mesmo do ofício"). Quando
 * o modelo escreve de volta — um despacho, uma anotação —, `reidratar` troca
 * os rótulos pelos valores reais ANTES de gravar no SEI. O dado real nunca
 * passa pelo modelo, e o documento sai correto.
 *
 * O mapa vive só na memória da conversa (painel do agente). Não é persistido
 * fora da sessão do navegador e nunca é enviado.
 */

import { detectarNoTexto, type TipoDado } from "@tarjar/ferramentas/tarjar/deteccao";
import { semAssinaturas } from "../links/links";

export type Categoria =
  | "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CEP" | "CARTAO" | "PIX" | "NASCIMENTO"
  | "RG" | "PIS" | "TITULO" | "CNH" | "PESSOA" | "ENDERECO" | "CONTA" | "SAUDE";

/**
 * Tipos do Tarjar usados aqui. PIS fica de fora pelo mesmo motivo que o Tarjar
 * o deixa desligado por padrão: com um dígito verificador só, 1 em cada 9
 * sequências de 11 dígitos passa — e o rótulo errado ("PIS" para um telefone)
 * confundiria o modelo. CNPJ é sempre DETECTADO (para ocupar a faixa e impedir
 * que o miolo dele vire CPF ou telefone), mas só é mascarado se pedido.
 */
const DO_TARJAR: Partial<Record<TipoDado, Categoria>> = {
  cpf: "CPF", cnpj: "CNPJ", email: "EMAIL", telefone: "TELEFONE", cep: "CEP", cartao: "CARTAO",
  "pix-aleatoria": "PIX", "data-nascimento": "NASCIMENTO", rg: "RG",
  "titulo-eleitor": "TITULO", cnh: "CNH",
};

/**
 * Números de protocolo do SEI (processo e documento) NÃO são dado pessoal e
 * são justamente o que o modelo usa para agir. Sem proteção, a busca
 * deslizante de telefone acharia 10 dígitos válidos dentro de
 * "50300.018905/2018-67". Eles saem do texto antes da detecção e voltam depois.
 */
const PROTOCOLO = /\b\d[\d.\-]{4,24}\/(?:19|20)\d{2}-\d{2}\b/g;
const FORMA_CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
/** CPF na forma escrita, mesmo com dígito verificador errado: um CPF real digitado errado segue sendo dado pessoal. */
const FORMA_CPF = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;
const MARCA = "\uE000";

export interface OpcoesAnonimizacao {
  /** CNPJ é dado de pessoa jurídica (fora da LGPD) e costuma ser útil ao trabalho. Padrão: não mascarar. */
  cnpj?: boolean;
  /** Nomes por contexto ("Sr.", "requerente", "filho de"...) e do dicionário. Padrão: sim. */
  nomes?: boolean;
}

// Nome próprio: 2 a 6 palavras capitalizadas, admitindo "da/de/do/dos/das/e".
const NOME = "[A-Z\u00C0-\u00DD][a-z\u00DF-\u00FF'\u00B4]+(?:\\s+(?:d[aeo]s?\\s+|e\\s+)?[A-Z\u00C0-\u00DD][a-z\u00DF-\u00FF'\u00B4]+){1,5}";

/** Regras por rótulo. `valor` é o grupo que será substituído. */
const ROTULOS: Array<{ cat: Categoria; re: RegExp }> = [
  {
    cat: "ENDERECO",
    re: /\b(?:residente(?:\s+e\s+domiciliad[oa])?|domiciliad[oa]|endere\u00E7[oa]d[oa]|endere\u00E7o(?:\s+residencial)?|logradouro|com\s+sede)\s*(?:em|na|no|:|,)?\s*((?:(?:Rua|R\.|Avenida|Av\.|Travessa|Tv\.|Alameda|Al\.|Rodovia|Estrada|Pra\u00E7a|Quadra|SQS|SQN|SHIS|SHIN|Setor|Conjunto|Lote|Ch\u00E1cara|S\u00EDtio|Fazenda)\b)[^\n;]{3,140}?)(?=[;\n]|,\s*(?:CEP|inscrit|portador|nascid|telefone|e-?mail|CPF|RG)|\.\s|$)/gi,
  },
  { cat: "PESSOA", re: new RegExp(`\\b(?:filh[oa]\\s+de|nome\\s+da\\s+m[\u00E3a]e|nome\\s+do\\s+pai|filia\u00E7\u00E3o)\\s*:?\\s*(${NOME}(?:\\s+e\\s+(?:de\\s+)?${NOME})?)`, "g") },
  { cat: "PESSOA", re: new RegExp(`\\b(?:Sr\\.?|Sra\\.?|Senhora?|requerente|interessad[oa]|cidad\u00E3o|cidad\u00E3|menor|paciente|segurad[oa]|benefici\u00E1ri[oa]|reclamante|denunciante|representante)\\s*:?\\s+(${NOME})`, "g") },
  {
    cat: "ENDERECO",
    re: /\b((?:Rua|Avenida|Av\.|Travessa|Alameda|Rodovia|Estrada|Pra\u00E7a)\s+[A-Z\u00C0-\u00DD0-9][^\n,;]{2,60},?\s*(?:n[\u00BA\u00B0o.]*\s*)?\d{1,6}(?:[^\n;.]{0,40}?(?:apto?\.?|apartamento|casa|bloco|sala)\s*\w+)?)/g,
  },
  { cat: "CONTA", re: /\b(?:ag\u00EAncia|agencia|ag\.|conta(?:\s+corrente|\s+poupan\u00E7a)?|c\/c)\s*(?:n[\u00BA\u00B0o.]*|n\u00FAmero)?\s*:?\s*([\dxX][\d.\-xX]{2,18})/gi },
  { cat: "SAUDE", re: /\b(CID(?:-?10|-?11)?\s*:?\s*[A-Z]\d{2}(?:\.\d{1,2})?)/g },
];

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036F]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Rótulo como o modelo o vê: `[CPF_1]`. */
const RE_ROTULO = /\[(CPF|CNPJ|EMAIL|TELEFONE|CEP|CARTAO|PIX|NASCIMENTO|RG|PIS|TITULO|CNH|PESSOA|ENDERECO|CONTA|SAUDE)_(\d+)\]/g;
/** Sem a flag global: `test` de regex global muda `lastIndex` e falha em dia sim, dia não. */
const TEM_ROTULO = new RegExp(RE_ROTULO.source);

export class Pseudonimos {
  private readonly porValor = new Map<string, string>();
  private readonly porRotulo = new Map<string, string>();
  private readonly contadores = new Map<Categoria, number>();
  private readonly pessoas = new Set<string>();

  constructor(private readonly opcoes: OpcoesAnonimizacao = {}) {}

  /** Nomes que devem ser mascarados onde aparecerem (interessados, contatos). */
  registrarPessoas(nomes: Iterable<string>): void {
    for (const n of nomes) {
      const limpo = n.replace(/\s+/g, " ").trim();
      // Nome de uma palavra só ou sigla de unidade não é pessoa identificável.
      if (limpo.split(" ").length >= 2 && !/^[A-Z0-9\-_.\/]+$/.test(limpo)) this.pessoas.add(limpo);
    }
  }

  private rotular(cat: Categoria, valor: string, canonico = valor): string {
    const chave = `${cat}:${normalizar(valor).replace(/[^\p{L}\p{N}@]/gu, "")}`;
    const existente = this.porValor.get(chave);
    if (existente) return existente;
    const n = (this.contadores.get(cat) ?? 0) + 1;
    this.contadores.set(cat, n);
    const rotulo = `[${cat}_${n}]`;
    this.porValor.set(chave, rotulo);
    this.porRotulo.set(rotulo, canonico.trim());
    return rotulo;
  }

  /** Texto seguro para o modelo. */
  anonimizar(texto: string): string {
    if (!texto) return texto;
    let t = semAssinaturas(texto);

    // Camada 3 primeiro: nome conhecido é o caso mais preciso.
    if (this.opcoes.nomes !== false) {
      for (const nome of [...this.pessoas].sort((a, b) => b.length - a.length)) {
        const alvo = normalizar(nome);
        if (!normalizar(t).includes(alvo)) continue;
        const re = new RegExp(escaparRegex(nome).replace(/\s+/g, "\\s+"), "gi");
        t = t.replace(re, () => this.rotular("PESSOA", nome));
        // Variante sem acento (texto digitado sem acentuação).
        const semAcento = nome.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
        if (semAcento !== nome) t = t.replace(new RegExp(escaparRegex(semAcento).replace(/\s+/g, "\\s+"), "gi"), () => this.rotular("PESSOA", nome));
      }
    }

    // Camada 2: rótulos de contexto.
    for (const { cat, re } of ROTULOS) {
      if (cat === "PESSOA" && this.opcoes.nomes === false) continue;
      t = t.replace(re, (todo: string, valor: string) => (valor && !TEM_ROTULO.test(valor) ? todo.replace(valor, this.rotular(cat, valor)) : todo));
    }

    // Camada 1: detectores validados, com os protocolos do SEI protegidos.
    const protocolos: string[] = [];
    t = t.replace(PROTOCOLO, (m) => (FORMA_CNPJ.test(m) ? m : `${MARCA}${"\uE001".repeat(protocolos.push(m))}${MARCA}`));
    t = t.replace(FORMA_CPF, (m) => this.rotular("CPF", m));
    const achados = detectarNoTexto(t, { tipos: Object.keys(DO_TARJAR) as TipoDado[] }).sort((a, b) => b.inicio - a.inicio);
    for (const a of achados) {
      const cat = DO_TARJAR[a.tipo];
      if (!cat || (cat === "CNPJ" && !this.opcoes.cnpj)) continue;
      t = t.slice(0, a.inicio) + this.rotular(cat, a.bruto) + t.slice(a.fim);
    }
    return t.replace(/\uE000(\uE001+)\uE000/g, (_, n: string) => protocolos[n.length - 1]);
  }

  /** Troca os rótulos pelos valores reais (para gravar no SEI o que o modelo escreveu). */
  reidratar(texto: string): string {
    return texto.replace(RE_ROTULO, (r) => this.porRotulo.get(r) ?? r);
  }

  /** Aplica `reidratar` em todas as strings de um valor (argumentos de tool). */
  reidratarValor<T>(v: T): T {
    if (typeof v === "string") return this.reidratar(v) as T;
    if (Array.isArray(v)) return v.map((x) => this.reidratarValor(x)) as T;
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, this.reidratarValor(x)])) as T;
    }
    return v;
  }

  /** Quantos valores de cada categoria foram mascarados (para o painel). */
  contagem(): Partial<Record<Categoria, number>> {
    return Object.fromEntries(this.contadores);
  }

  exportar(): { valores: Array<[string, string]>; rotulos: Array<[string, string]>; contadores: Array<[Categoria, number]>; pessoas: string[] } {
    return { valores: [...this.porValor], rotulos: [...this.porRotulo], contadores: [...this.contadores], pessoas: [...this.pessoas] };
  }

  static importar(dados: ReturnType<Pseudonimos["exportar"]>, opcoes?: OpcoesAnonimizacao): Pseudonimos {
    const p = new Pseudonimos(opcoes);
    for (const [k, v] of dados.valores) p.porValor.set(k, v);
    for (const [k, v] of dados.rotulos) p.porRotulo.set(k, v);
    for (const [k, v] of dados.contadores) p.contadores.set(k, v);
    for (const n of dados.pessoas) p.pessoas.add(n);
    return p;
  }
}
