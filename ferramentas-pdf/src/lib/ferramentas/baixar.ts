/**
 * Entrega do arquivo pronto ao usuário.
 *
 * Duas armadilhas de navegador moram aqui, e as duas já custaram caro em
 * ferramentas parecidas:
 *
 * 1. Revogar a object URL logo depois do clique CANCELA o download no Safari,
 *    que ainda não terminou de ler o blob. Por isso a revogação é adiada.
 * 2. Cliques sucessivos em âncoras diferentes são bloqueados pelo Chrome como
 *    "download múltiplo" e simplesmente não acontecem no Safari. Saída com
 *    mais de um arquivo tem que sair em um ZIP único, nunca em N downloads.
 */

/** Object URLs vivas, para que nada vaze se a aba ficar aberta por horas. */
const urlsVivas = new Set<string>();

const ATRASO_REVOGACAO_MS = 60_000;

function registrarLimpezaGlobal() {
  if (typeof window === "undefined") return;
  if ((window as { __ferramentasLimpezaRegistrada?: boolean }).__ferramentasLimpezaRegistrada) {
    return;
  }
  (window as { __ferramentasLimpezaRegistrada?: boolean }).__ferramentasLimpezaRegistrada = true;
  window.addEventListener("beforeunload", revogarTudo);
}

/** Revoga todas as object URLs pendentes. Idempotente. */
export function revogarTudo(): void {
  for (const url of urlsVivas) URL.revokeObjectURL(url);
  urlsVivas.clear();
}

/**
 * Dispara o download de um blob com o nome informado.
 *
 * Retorna a object URL criada, para quem quiser exibir uma pré-visualização
 * antes de revogar.
 */
export function baixarBlob(blob: Blob, nomeArquivo: string): string {
  registrarLimpezaGlobal();

  const url = URL.createObjectURL(blob);
  urlsVivas.add(url);

  const ancora = document.createElement("a");
  ancora.href = url;
  ancora.download = nomeArquivo;
  ancora.rel = "noopener";
  ancora.style.display = "none";
  document.body.appendChild(ancora);
  ancora.click();
  ancora.remove();

  window.setTimeout(() => {
    if (urlsVivas.delete(url)) URL.revokeObjectURL(url);
  }, ATRASO_REVOGACAO_MS);

  return url;
}

/** Dispara o download de um PDF já serializado. */
export function baixarPdf(bytes: Uint8Array, nomeArquivo: string): string {
  // Uma cópia do buffer evita entregar ao Blob um ArrayBuffer compartilhado
  // (o caso do SharedArrayBuffer, que o construtor de Blob recusa).
  const copia = new Uint8Array(bytes);
  return baixarBlob(new Blob([copia], { type: "application/pdf" }), nomeArquivo);
}

/**
 * Empacota várias saídas num ZIP e dispara o download.
 *
 * Saída múltipla SEMPRE sai assim, nunca como N downloads seguidos: cliques
 * sucessivos em âncoras diferentes são bloqueados pelo Chrome como "download
 * múltiplo" e simplesmente não acontecem no Safari.
 *
 * Sem compressão (nível 0) de propósito: PDF já é um formato comprimido, e
 * tentar comprimi-lo de novo gasta tempo e memória para ganhar quase nada.
 */
export async function baixarZip(
  arquivos: { nome: string; bytes: Uint8Array }[],
  nomeZip: string,
): Promise<string> {
  const { zipSync } = await import("fflate");

  const entradas: Record<string, [Uint8Array, { level: 0 }]> = {};
  const usados = new Set<string>();

  for (const arquivo of arquivos) {
    // Nomes repetidos dentro de um ZIP fazem alguns extratores sobrescrever
    // silenciosamente. Desambiguamos com sufixo numérico.
    let nome = arquivo.nome;
    let n = 2;
    while (usados.has(nome)) {
      nome = arquivo.nome.replace(/(\.pdf)?$/i, `-${n}$1`);
      n += 1;
    }
    usados.add(nome);
    entradas[nome] = [arquivo.bytes, { level: 0 }];
  }

  const zip = zipSync(entradas, { level: 0 });
  return baixarBlob(new Blob([zip as BlobPart], { type: "application/zip" }), nomeZip);
}
