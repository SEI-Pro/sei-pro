/**
 * Gerador de QR code (ISO 18004), pequeno e sem dependência: modo byte, correção de erro M, versões 1 a 10 (até 213
 * bytes), que sobra para o endereço de um processo. Substitui o `jquery-qrcode` do legado (que exigia jQuery e
 * montava a imagem por HTML). Devolve a matriz de módulos; quem desenha (SVG) está em `capa.ts`.
 *
 * Passos: bits de dados, blocos com Reed-Solomon (GF(256), polinômio 0x11D), entrelaçamento, padrões de função
 * (localizadores, alinhamento, sincronismo), posicionamento em zigue-zague, máscara de menor penalidade, informação de
 * formato e de versão (BCH). Conferido contra o `qrcode-generator` de Kazuhiko Arase (o mesmo do `jquery-qrcode`) em
 * `tests/verificar-capa.ts`.
 */

/** Blocos de dados por versão, nível M: [quantidade, bytes de dados por bloco] e bytes de correção por bloco. */
const BLOCOS_M: ReadonlyArray<{ blocos: ReadonlyArray<readonly [number, number]>; ec: number }> = [
  { blocos: [[1, 16]], ec: 10 },
  { blocos: [[1, 28]], ec: 16 },
  { blocos: [[1, 44]], ec: 26 },
  { blocos: [[2, 32]], ec: 18 },
  { blocos: [[2, 43]], ec: 24 },
  { blocos: [[4, 27]], ec: 16 },
  { blocos: [[4, 31]], ec: 18 },
  {
    blocos: [
      [2, 38],
      [2, 39],
    ],
    ec: 22,
  },
  {
    blocos: [
      [3, 36],
      [2, 37],
    ],
    ec: 22,
  },
  {
    blocos: [
      [4, 43],
      [1, 44],
    ],
    ec: 26,
  },
];

/** Posições do centro dos padrões de alinhamento, por versão (índice = versão - 1). */
const ALINHAMENTO: ReadonlyArray<readonly number[]> = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const G15 = 0x537;
const G15_MASCARA = 0x5412;
const G18 = 0x1f25;

// --- GF(256) -------------------------------------------------------------------------------------------------------

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255] ?? 0;
})();

const multiplicar = (a: number, b: number): number => (a === 0 || b === 0 ? 0 : (EXP[(LOG[a] ?? 0) + (LOG[b] ?? 0)] ?? 0));

/** Polinômio gerador de `n` símbolos de correção (coeficientes do termo de maior grau ao menor, sem o líder 1). */
function geradorRS(n: number): number[] {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const proximo = new Array<number>(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      proximo[j] = (proximo[j] ?? 0) ^ (g[j] ?? 0);
      proximo[j + 1] = (proximo[j + 1] ?? 0) ^ multiplicar(g[j] ?? 0, EXP[i] ?? 0);
    }
    g = proximo;
  }
  return g.slice(1);
}

/** Resto da divisão de `dados` x^n pelo gerador: os bytes de correção do bloco. */
function correcaoRS(dados: readonly number[], n: number): number[] {
  const g = geradorRS(n);
  const resto = new Array<number>(n).fill(0);
  for (const d of dados) {
    const fator = d ^ (resto.shift() ?? 0);
    resto.push(0);
    if (fator === 0) continue;
    for (let i = 0; i < n; i++) resto[i] = (resto[i] ?? 0) ^ multiplicar(g[i] ?? 0, fator);
  }
  return resto;
}

// --- Bits ----------------------------------------------------------------------------------------------------------

const digitoBch = (x: number): number => {
  let n = 0;
  while (x !== 0) {
    n++;
    x >>>= 1;
  }
  return n;
};

function bchFormato(dados: number): number {
  let d = dados << 10;
  while (digitoBch(d) - digitoBch(G15) >= 0) d ^= G15 << (digitoBch(d) - digitoBch(G15));
  return ((dados << 10) | d) ^ G15_MASCARA;
}

function bchVersao(versao: number): number {
  let d = versao << 12;
  while (digitoBch(d) - digitoBch(G18) >= 0) d ^= G18 << (digitoBch(d) - digitoBch(G18));
  return (versao << 12) | d;
}

const bytesDeDados = (v: number): number => (BLOCOS_M[v - 1]?.blocos ?? []).reduce((t, [n, d]) => t + n * d, 0);

/** Os codewords (dados + correção, entrelaçados) do texto na versão `v`. */
function codewords(bytes: Uint8Array, v: number): number[] {
  const capacidade = bytesDeDados(v);
  const bits: number[] = [];
  const poe = (valor: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((valor >>> i) & 1);
  };
  poe(0b0100, 4);
  poe(bytes.length, v < 10 ? 8 : 16);
  for (const b of bytes) poe(b, 8);
  const total = capacidade * 8;
  poe(0, Math.min(4, total - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);
  const dados: number[] = [];
  for (let i = 0; i < bits.length; i += 8) dados.push(Number.parseInt(bits.slice(i, i + 8).join(""), 2));
  for (let pad = 0; dados.length < capacidade; pad++) dados.push(pad % 2 === 0 ? 0xec : 0x11);

  const { blocos, ec } = BLOCOS_M[v - 1] as (typeof BLOCOS_M)[number];
  const dadosDosBlocos: number[][] = [];
  const ecDosBlocos: number[][] = [];
  let ponta = 0;
  for (const [qtd, tam] of blocos) {
    for (let k = 0; k < qtd; k++) {
      const parte = dados.slice(ponta, ponta + tam);
      ponta += tam;
      dadosDosBlocos.push(parte);
      ecDosBlocos.push(correcaoRS(parte, ec));
    }
  }
  const saida: number[] = [];
  const maior = Math.max(...dadosDosBlocos.map((b) => b.length));
  for (let i = 0; i < maior; i++) for (const b of dadosDosBlocos) if (i < b.length) saida.push(b[i] ?? 0);
  for (let i = 0; i < ec; i++) for (const b of ecDosBlocos) saida.push(b[i] ?? 0);
  return saida;
}

// --- Matriz --------------------------------------------------------------------------------------------------------

type Matriz = Array<Array<boolean | null>>;

function mascara(m: number, i: number, j: number): boolean {
  switch (m) {
    case 0:
      return (i + j) % 2 === 0;
    case 1:
      return i % 2 === 0;
    case 2:
      return j % 3 === 0;
    case 3:
      return (i + j) % 3 === 0;
    case 4:
      return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
    case 5:
      return ((i * j) % 2) + ((i * j) % 3) === 0;
    case 6:
      return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
    default:
      return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
  }
}

function localizador(m: Matriz, linha: number, coluna: number): void {
  const n = m.length;
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      if (linha + r < 0 || n <= linha + r || coluna + c < 0 || n <= coluna + c) continue;
      const escuro =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) || (c >= 0 && c <= 6 && (r === 0 || r === 6)) || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      (m[linha + r] as Array<boolean | null>)[coluna + c] = escuro;
    }
  }
}

function alinhamento(m: Matriz, v: number): void {
  const pos = ALINHAMENTO[v - 1] ?? [];
  for (const linha of pos) {
    for (const coluna of pos) {
      if ((m[linha] as Array<boolean | null>)[coluna] !== null) continue; // cai em cima de um localizador
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          (m[linha + r] as Array<boolean | null>)[coluna + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
        }
      }
    }
  }
}

function sincronismo(m: Matriz): void {
  for (let i = 8; i < m.length - 8; i++) {
    const linha = m[i] as Array<boolean | null>;
    if (linha[6] === null) linha[6] = i % 2 === 0;
    const l6 = m[6] as Array<boolean | null>;
    if (l6[i] === null) l6[i] = i % 2 === 0;
  }
}

function informacaoDeFormato(m: Matriz, mask: number, teste: boolean): void {
  const n = m.length;
  const bits = bchFormato((0 << 3) | mask); // nível M = 00
  for (let i = 0; i < 15; i++) {
    const escuro = !teste && ((bits >> i) & 1) === 1;
    if (i < 6) (m[i] as Array<boolean | null>)[8] = escuro;
    else if (i < 8) (m[i + 1] as Array<boolean | null>)[8] = escuro;
    else (m[n - 15 + i] as Array<boolean | null>)[8] = escuro;
  }
  for (let i = 0; i < 15; i++) {
    const escuro = !teste && ((bits >> i) & 1) === 1;
    if (i < 8) (m[8] as Array<boolean | null>)[n - i - 1] = escuro;
    else if (i < 9) (m[8] as Array<boolean | null>)[15 - i - 1 + 1] = escuro;
    else (m[8] as Array<boolean | null>)[15 - i - 1] = escuro;
  }
  (m[n - 8] as Array<boolean | null>)[8] = !teste; // módulo escuro fixo
}

function informacaoDeVersao(m: Matriz, v: number, teste: boolean): void {
  if (v < 7) return;
  const n = m.length;
  const bits = bchVersao(v);
  for (let i = 0; i < 18; i++) {
    const escuro = !teste && ((bits >> i) & 1) === 1;
    (m[Math.floor(i / 3)] as Array<boolean | null>)[(i % 3) + n - 8 - 3] = escuro;
    (m[(i % 3) + n - 8 - 3] as Array<boolean | null>)[Math.floor(i / 3)] = escuro;
  }
}

function posicionar(m: Matriz, dados: readonly number[], mask: number): void {
  const n = m.length;
  let incremento = -1;
  let linha = n - 1;
  let bit = 7;
  let byte = 0;
  for (let coluna = n - 1; coluna > 0; coluna -= 2) {
    if (coluna === 6) coluna--;
    for (;;) {
      for (let c = 0; c < 2; c++) {
        const alvo = m[linha] as Array<boolean | null>;
        if (alvo[coluna - c] !== null) continue;
        let escuro = false;
        if (byte < dados.length) escuro = (((dados[byte] ?? 0) >>> bit) & 1) === 1;
        if (mascara(mask, linha, coluna - c)) escuro = !escuro;
        alvo[coluna - c] = escuro;
        bit--;
        if (bit === -1) {
          byte++;
          bit = 7;
        }
      }
      linha += incremento;
      if (linha < 0 || n <= linha) {
        linha -= incremento;
        incremento = -incremento;
        break;
      }
    }
  }
}

function montar(dados: readonly number[], v: number, mask: number, teste: boolean): boolean[][] {
  const n = 17 + 4 * v;
  const m: Matriz = Array.from({ length: n }, () => new Array<boolean | null>(n).fill(null));
  localizador(m, 0, 0);
  localizador(m, n - 7, 0);
  localizador(m, 0, n - 7);
  alinhamento(m, v);
  sincronismo(m);
  informacaoDeFormato(m, mask, teste);
  informacaoDeVersao(m, v, teste);
  posicionar(m, dados, mask);
  return m.map((linha) => linha.map((x) => x === true));
}

/** Penalidade da máscara (regras N1 a N4 da norma); a de menor valor vence. */
function penalidade(m: boolean[][]): number {
  const n = m.length;
  const at = (r: number, c: number): boolean => (m[r] as boolean[])[c] === true;
  let total = 0;
  // N1: sequências de 5 ou mais módulos iguais, em linha e em coluna.
  for (let eixo = 0; eixo < 2; eixo++) {
    for (let a = 0; a < n; a++) {
      let corrida = 1;
      for (let b = 1; b < n; b++) {
        const igual = eixo === 0 ? at(a, b) === at(a, b - 1) : at(b, a) === at(b - 1, a);
        if (igual) corrida++;
        else {
          if (corrida >= 5) total += 3 + (corrida - 5);
          corrida = 1;
        }
      }
      if (corrida >= 5) total += 3 + (corrida - 5);
    }
  }
  // N2: blocos 2x2 de mesma cor.
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const x = at(r, c);
      if (x === at(r, c + 1) && x === at(r + 1, c) && x === at(r + 1, c + 1)) total += 3;
    }
  }
  // N3: padrão 1:1:3:1:1 (escuro claro escuro escuro escuro claro escuro) com quatro claros de um lado.
  const padrao = [true, false, true, true, true, false, true];
  const confere = (r: number, c: number, dr: number, dc: number): boolean => padrao.every((p, k) => at(r + dr * k, c + dc * k) === p);
  const claros = (r: number, c: number, dr: number, dc: number): boolean => {
    for (let k = 0; k < 4; k++) {
      const rr = r + dr * k;
      const cc = c + dc * k;
      if (rr < 0 || cc < 0 || rr >= n || cc >= n) return false;
      if (at(rr, cc)) return false;
    }
    return true;
  };
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (c + 6 < n && confere(r, c, 0, 1) && (claros(r, c - 4, 0, 1) || claros(r, c + 7, 0, 1))) total += 40;
      if (r + 6 < n && confere(r, c, 1, 0) && (claros(r - 4, c, 1, 0) || claros(r + 7, c, 1, 0))) total += 40;
    }
  }
  // N4: proporção de módulos escuros.
  let escuros = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (at(r, c)) escuros++;
  total += Math.floor(Math.abs((escuros * 100) / (n * n) - 50) / 5) * 10;
  return total;
}

/** O QR do texto como matriz de módulos (`true` = escuro), sem a zona de silêncio; `null` se o texto não cabe. */
export function gerarQr(texto: string): boolean[][] | null {
  const bytes = new TextEncoder().encode(texto);
  let versao = 0;
  for (let v = 1; v <= BLOCOS_M.length; v++) {
    const cabecalho = 4 + (v < 10 ? 8 : 16);
    if (Math.ceil((cabecalho + bytes.length * 8) / 8) <= bytesDeDados(v)) {
      versao = v;
      break;
    }
  }
  if (!versao) return null;
  const dados = codewords(bytes, versao);
  let melhor: boolean[][] | null = null;
  let menor = Number.POSITIVE_INFINITY;
  for (let mask = 0; mask < 8; mask++) {
    const m = montar(dados, versao, mask, false);
    const p = penalidade(m);
    if (p < menor) {
      menor = p;
      melhor = m;
    }
  }
  return melhor;
}

/**
 * Para os testes: as partes do gerador que se conferem sem um leitor de QR (formato BCH, bytes de correção, a matriz de
 * cada máscara). Não é API da capa.
 */
export const internosDoQr = {
  bchFormato,
  bchVersao,
  codewords,
  bytesDeDados,
  blocos: BLOCOS_M,
  expoente: (i: number): number => EXP[i] ?? 0,
  versaoDe(texto: string): number {
    const n = new TextEncoder().encode(texto).length;
    for (let v = 1; v <= BLOCOS_M.length; v++) if (Math.ceil((4 + (v < 10 ? 8 : 16) + n * 8) / 8) <= bytesDeDados(v)) return v;
    return 0;
  },
  /** A matriz com cada uma das 8 máscaras (a escolhida por `gerarQr` é uma delas). */
  porMascara(texto: string): boolean[][][] {
    const bytes = new TextEncoder().encode(texto);
    const v = this.versaoDe(texto);
    return Array.from({ length: 8 }, (_, m) => montar(codewords(bytes, v), v, m, false));
  },
};
