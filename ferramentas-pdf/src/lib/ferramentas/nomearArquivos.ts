/**
 * Nomes de arquivo de saída.
 *
 * O nome vai para o sistema de arquivos do usuário, então precisa sobreviver
 * ao Windows (que recusa \ / : * ? " < > | e caracteres de controle), a nomes
 * longos e à acentuação decomposta que vem do macOS.
 */

/** Caracteres recusados pelo Windows. */
const PROIBIDOS = /[\\/:*?"<>|]/g;

/** Caracteres de controle (U+0000 a U+001F), que também quebram o download. */
const CONTROLE = /[\u0000-\u001F]/g;

const TAMANHO_MAXIMO = 80;

/** Remove a extensão .pdf final, se houver. */
export function semExtensaoPdf(nome: string): string {
  return nome.replace(/\.pdf$/i, "");
}

/**
 * Higieniza um nome de arquivo preservando a leitura em português.
 *
 * Mantém acentos, mas normaliza para NFC: o macOS entrega "ção" decomposto em
 * dois pontos de código, e alguns sistemas exibem isso como "çao".
 */
export function higienizarNome(nome: string, padrao = "documento"): string {
  const limpo = nome
    .normalize("NFC")
    .replace(CONTROLE, "")
    .replace(PROIBIDOS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, TAMANHO_MAXIMO)
    // O Windows também recusa ponto ou espaço no fim do nome.
    .replace(/[. ]+$/, "");
  return limpo.length > 0 ? limpo : padrao;
}

/**
 * Nome sugerido para o resultado de uma união.
 *
 * Usa o nome do primeiro arquivo como raiz, porque é a peça que abre o
 * documento e é assim que quem protocola costuma identificar o conjunto.
 */
export function nomeParaUniao(nomePrimeiro: string | undefined): string {
  const raiz = higienizarNome(semExtensaoPdf(nomePrimeiro ?? ""), "documento");
  return `${raiz}-unificado.pdf`;
}
