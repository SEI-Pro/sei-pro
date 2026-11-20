/** Cria, no processo, o documento com a comparação marcada (o "Criar Novo Documento" do comparador). */
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import { criarDocumento, type DocumentoLocalizado, tiposDocumento } from "@nucleo/dominio/documento";
import { editarSecoes } from "@nucleo/dominio/editor";
import type { Sei } from "@nucleo/sei";
import { analisarHtml } from "@nucleo/sessao/dom";
import { ErroSei } from "@nucleo/sessao/erros";

export interface PedidoComparativo {
  /** Protocolo do processo (referência aceita por `sei.arvore`). */
  processo: string;
  tipoId: string;
  tipoNome?: string;
  /** HTML do resultado (documento completo); só o corpo vai para o documento novo. */
  html: string;
  nivel: "publico" | "restrito";
  hipotese?: string;
}

export interface Dependencias {
  criar: typeof criarDocumento;
  arvore: (sei: Sei, processo: string) => Promise<Arvore>;
  editar: typeof editarSecoes;
}

const padrao: Dependencias = { criar: criarDocumento, arvore: (sei, processo) => sei.arvore(processo), editar: editarSecoes };

export const tiposParaCriar = tiposDocumento;

/**
 * O comparativo nunca pode ficar mais aberto que o que ele mostra: restrito se o processo ou qualquer dos dois
 * documentos for restrito, com a hipótese legal do primeiro que tiver uma (sem hipótese o SEI recusa com mensagem clara).
 */
export function nivelDoComparativo(arvore: Arvore, docs: DocumentoArvore[]): { nivel: "publico" | "restrito"; hipotese?: string } {
  const restritos = docs.filter((d) => d.nivel === "restrito");
  if (arvore.nivel !== "restrito" && !restritos.length) return { nivel: "publico" };
  const hipotese = restritos.find((d) => d.hipotese)?.hipotese ?? (arvore.nivel === "restrito" ? arvore.hipotese : undefined);
  return hipotese ? { nivel: "restrito", hipotese } : { nivel: "restrito" };
}

export async function criarComparativo(
  sei: Sei,
  p: PedidoComparativo,
  deps: Dependencias = padrao,
  sinal?: AbortSignal,
): Promise<{ idDocumento: string; numero: string }> {
  const r = await deps.criar(
    sei,
    p.processo,
    { tipo: p.tipoNome ?? p.tipoId, tipoId: p.tipoId, nivel: p.nivel, ...(p.hipotese ? { hipotese: p.hipotese } : {}) },
    { aplicar: true, sinal },
  );
  const idDocumento = String(r.dados?.idDocumento ?? "");
  const numero = String(r.dados?.numero ?? "");
  if (!idDocumento)
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", "A resposta do SEI não trouxe o id do documento criado. Confira a árvore do processo.");
  const corpo = analisarHtml(p.html).body?.innerHTML ?? "";
  try {
    const arvore = await deps.arvore(sei, p.processo);
    const noNovo = arvore.documentos.find((d) => d.id === idDocumento);
    if (!noNovo) throw new ErroSei("SEI_RESPOSTA_INESPERADA", "o documento novo não apareceu na árvore do processo.");
    const local: DocumentoLocalizado = { arvore, documento: noNovo };
    let gravado = false;
    await deps.editar(
      sei,
      local,
      (s) => {
        if (gravado || s.somenteLeitura) return null;
        gravado = true;
        return corpo;
      },
      { aplicar: true, sinal },
      { documentoNovo: true },
    );
  } catch (e) {
    const motivo = e instanceof Error ? e.message : String(e);
    throw new ErroSei(
      e instanceof ErroSei ? e.codigo : "SEI_REDE",
      `O documento ${numero || `(id ${idDocumento})`} foi criado, mas não foi possível gravar a comparação nele: ${motivo}`,
    );
  }
  return { idDocumento, numero };
}
