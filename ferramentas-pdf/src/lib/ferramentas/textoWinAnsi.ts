/**
 * Higienização de texto para as fontes padrão do PDF.
 *
 * As fontes padrão (Helvetica e companhia) são escritas em WinAnsi, que cobre
 * o português inteiro — acento, cedilha, til — e também a pontuação
 * tipográfica do bloco CP1252: travessão, meia-risca, aspas curvas,
 * reticências de um caractere. O que fica de fora é o resto do Unicode.
 *
 * O QUE ACONTECE COM O QUE FICA DE FORA, medido no `@cantoo/pdf-lib` instalado
 * e não deduzido: `encodeText` NÃO lança. Ele substitui o caractere por `?`
 * (byte 0x3F) e segue. O comentário que este módulo herdou do `ocr.ts` dizia
 * que uma palavra fora da tabela derrubaria a página inteira; não é o caso
 * neste fork. O sintoma real é mais discreto e igualmente indesejável: o texto
 * pesquisável do documento fica salpicado de interrogações que o usuário vê ao
 * copiar e não consegue explicar.
 *
 * Daí a divisão de trabalho aqui:
 *
 *   - EQUIVALENTES troca o que viraria `?` por algo legível — e nada além
 *     disso. Travessão e reticências NÃO entram nessa lista, porque WinAnsi já
 *     os representa e convertê-los para `-` e `...` seria perder fidelidade
 *     sem ganhar nada;
 *   - o filtro remove o que sobrou, preservando o resto da palavra: é melhor a
 *     busca encontrar "acao" do que encontrar "a?ao".
 *
 * As duas exceções à regra "só o que viraria `?`" são o espaço inseparável e o
 * hífen opcional. Os dois têm representação em WinAnsi, mas quebram a busca:
 * quem procura "R$ 1,00" com espaço comum não encontra a versão com U+00A0.
 */

/** Caracteres que a tabela WinAnsi consegue representar. */
const SUPORTADO = /^[\x20-\x7E\xA0-\xFF€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]*$/;

const EQUIVALENTES = new Map<string, string>([
  // Viram "?" sem isto.
  ["−", "-"], // − sinal de menos matemático
  ["‐", "-"], // ‐ hífen tipográfico
  ["‑", "-"], // ‑ hífen inseparável
  [" ", " "], // espaço inseparável estreito
  [" ", " "], // espaço fino
  [" ", " "], // espaço capilar
  ["​", ""], // espaço de largura zero
  ["ﬀ", "ff"],
  ["ﬁ", "fi"],
  ["ﬂ", "fl"],
  ["ﬃ", "ffi"],
  ["ﬄ", "ffl"],
  // Representáveis, mas quebram a busca.
  [" ", " "], // espaço inseparável
  ["­", ""], // hífen opcional
]);

/** Aplica as equivalências, sem filtrar nada. */
export function normalizarEquivalentes(texto: string): string {
  let saida = "";
  for (const c of texto) saida += EQUIVALENTES.get(c) ?? c;
  return saida;
}

/**
 * Deixa o texto escrevível com fonte padrão.
 *
 * Devolve string vazia quando não sobrou nada de útil.
 */
export function higienizarTexto(texto: string): string {
  const limpo = normalizarEquivalentes(texto).replace(/\s+/g, " ").trim();
  if (!limpo) return "";
  if (SUPORTADO.test(limpo)) return limpo;
  return [...limpo].filter((c) => SUPORTADO.test(c)).join("");
}

/** O caractere é representável em WinAnsi? */
export function suportadoEmWinAnsi(caractere: string): boolean {
  return SUPORTADO.test(caractere);
}
