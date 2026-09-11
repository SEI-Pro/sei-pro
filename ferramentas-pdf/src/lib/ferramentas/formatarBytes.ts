/** Formatação de tamanho de arquivo em português do Brasil. */

const UNIDADES = ["B", "KB", "MB", "GB"] as const;

/**
 * Formata bytes para leitura humana, com vírgula decimal.
 *
 *   formatarBytes(0)        // "0 B"
 *   formatarBytes(1536)     // "1,5 KB"
 *   formatarBytes(10485760) // "10 MB"
 */
export function formatarBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  let valor = bytes;
  let i = 0;
  while (valor >= 1024 && i < UNIDADES.length - 1) {
    valor /= 1024;
    i += 1;
  }
  // Bytes inteiros não ganham casa decimal; acima disso, uma casa basta.
  const casas = i === 0 || valor >= 100 ? 0 : 1;
  const numero = valor
    .toFixed(casas)
    // "10,0 MB" soa a precisão que não existe: valor redondo sai sem decimal.
    .replace(/\.0$/, "")
    .replace(".", ",");
  return `${numero} ${UNIDADES[i]}`;
}

/**
 * Faixa de tamanho para telemetria. O tamanho exato de um arquivo é
 * praticamente um identificador dele, então nunca sai daqui em bytes.
 */
export function faixaDeTamanho(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return "<1MB";
  if (mb < 5) return "1-5MB";
  if (mb < 20) return "5-20MB";
  return ">20MB";
}
