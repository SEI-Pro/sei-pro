/**
 * Os documentos que o menu conhece: os da árvore que o quadro já tem (`lerArvore`) e os das pastas que o SEI abre
 * sob demanda. Numa pasta fechada o SEI só traz os documentos quando o usuário a abre: submete o formulário para o
 * `#ifrPasta` e o `onload` dele insere os nós na página. A resposta (com os `Nos[n].acoes` de cada documento) fica no
 * documento desse iframe, e é de lá que se lê, sem requisição nenhuma.
 */
import { type DocumentoArvore, lerDocumentosDaPagina } from "@nucleo/dominio/arvore";

export class DocumentosDaTela {
  private readonly porId = new Map<string, DocumentoArvore>();

  constructor(inicial: readonly DocumentoArvore[]) {
    for (const d of inicial) this.porId.set(d.id, d);
  }

  obter(id: string): DocumentoArvore | null {
    return this.porId.get(id) ?? null;
  }

  todos(): DocumentoArvore[] {
    return [...this.porId.values()];
  }

  /** Soma um documento lido do DOM (o modelo não o conhece); o que já existe não é trocado. */
  somar(d: DocumentoArvore): void {
    if (!this.porId.has(d.id)) this.porId.set(d.id, d);
  }

  tamanho(): number {
    return this.porId.size;
  }

  /** Soma os documentos de uma resposta de pasta (os mais novos vencem). Devolve quantos entraram. */
  somarDaPasta(html: string): number {
    if (!html?.includes("infraArvoreNo")) return 0;
    let n = 0;
    try {
      for (const d of lerDocumentosDaPagina({ html })) {
        this.porId.set(d.id, d);
        n += 1;
      }
    } catch {
      // resposta que não é uma pasta: fica como estava
    }
    return n;
  }

  /**
   * Lê o que o `#ifrPasta` tem agora. A resposta do SEI é JavaScript puro que o navegador interpreta como texto
   * de comentário: os `Nos[n]` estão nos nós de comentário do documento do iframe.
   */
  lerDoIframe(doc: Document): number {
    try {
      const ifr = doc.getElementById("ifrPasta") as HTMLIFrameElement | null;
      const d = ifr?.contentDocument;
      return d ? this.somarDaPasta(textoDosComentarios(d)) : 0;
    } catch {
      return 0;
    }
  }

  /** Acompanha as pastas abertas depois: cada carga do `#ifrPasta` soma os documentos novos. Devolve o desligador. */
  acompanharPastas(doc: Document, aoSomar?: () => void): () => void {
    const ifr = doc.getElementById("ifrPasta");
    if (!ifr) return () => {};
    const aoCarregar = () => {
      // O `onload` do SEI (processarPasta) roda no mesmo evento; a leitura do iframe não depende dele.
      if (this.lerDoIframe(doc) > 0) aoSomar?.();
    };
    ifr.addEventListener("load", aoCarregar);
    return () => ifr.removeEventListener("load", aoCarregar);
  }
}

/** O id do documento a que um âncora da árvore pertence (`anchorImg123`, `anchor123-456`), ou null. */
export function idDoNo(id: string | null | undefined, prefixo: "anchorImg" | "anchor"): string | null {
  if (!id?.startsWith(prefixo)) return null;
  const resto = id.slice(prefixo.length);
  return /^\d+(?:-\d+)?$/.test(resto) ? resto : null;
}

/** O texto de todos os comentários de um documento (a resposta de uma pasta vem inteira dentro deles). */
export function textoDosComentarios(d: Document): string {
  const partes: string[] = [];
  const visitar = (no: Node) => {
    for (const filho of Array.from(no.childNodes)) {
      if (filho.nodeType === 8) partes.push((filho as Comment).data);
      else if (filho.nodeType === 1) visitar(filho);
    }
  };
  visitar(d);
  return partes.join("\n");
}
