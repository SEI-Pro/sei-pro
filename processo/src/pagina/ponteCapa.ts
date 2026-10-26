/**
 * O lado do quadro da árvore na conversa com a capa (ver `capa/ponte.ts`): a árvore é a dona da escrita da loja, então é
 * ela quem carrega as fatias que a capa lê e quem coleta o histórico completo quando o usuário clica em "Calcular".
 * A coleta só começa por esse clique (spec 8.2); o progresso volta em `data-spro-capa-coleta` no <html> da árvore.
 */
import { textoDaColeta, textoDaContagem } from "../capa/ponte";
import { obterHistorico } from "../gantt/coleta";
import {
  ATRIBUTO_COLETA,
  ATRIBUTO_CONTAGEM,
  EVENTO_CAPA_CALCULAR,
  EVENTO_CAPA_CANCELAR,
  EVENTO_CAPA_CONTAR,
  EVENTO_CAPA_PARAR_CONTAGEM,
  EVENTO_CAPA_PEDIR,
} from "../modelo/constantes";
import type { NomeFatia } from "../modelo/tipos";
import { mensagemDeLeitura } from "./comum";
import type { ContextoProcesso } from "./contexto";
import { criarFila, type EstadoFila, type Fila, type OpcoesFila } from "./pastas/fila";

/** As fatias de que a capa precisa (só as do cadastro; o resto do cache a capa só lê, se houver). */
export const FATIAS_DA_CAPA: readonly NomeFatia[] = ["dadosProcesso", "marcador"];

const cancelado = (e: unknown): boolean => !!e && typeof e === "object" && (e as { codigo?: unknown }).codigo === "CANCELADO";

/**
 * O que a fila de pastas diz, na linguagem do "Contar tudo": contando (feitas de total), parou (restam N), erro (sessão,
 * falhas, outra carga em curso) ou pronto (nenhuma pasta fechada sobrou).
 */
export function contagemDaFila(e: EstadoFila): Parameters<typeof textoDaContagem>[0] {
  if (e.fase === "carregando" || e.fase === "pausada") return { fase: "contando", feito: e.feitas, total: e.total };
  if (e.fase === "concluida") {
    return e.falhas.length
      ? { fase: "erro", mensagem: `${e.falhas.length === 1 ? "1 pasta não carregou" : `${e.falhas.length} pastas não carregaram`}.` }
      : "pronto";
  }
  if (e.fase === "parada" || e.fase === "teto") return { fase: "parou", restantes: e.restantes };
  if (e.fase === "interrompida") {
    if (e.motivo === "sessao") return { fase: "erro", mensagem: "A sessão do SEI expirou." };
    if (e.motivo === "ocupada") return { fase: "erro", mensagem: "Outra carga de pastas está em andamento." };
    return { fase: "erro", mensagem: `${e.falhas.length} pastas não carregaram.` };
  }
  return { fase: "parada" };
}

export function ligarPonteDaCapa(doc: Document, obterCtx: () => Promise<ContextoProcesso | null>, opcoesFila: OpcoesFila = {}): () => void {
  let controle: AbortController | null = null;
  const marcar = (e: Parameters<typeof textoDaColeta>[0]): void => {
    const t = textoDaColeta(e);
    if (t === null) doc.documentElement?.removeAttribute(ATRIBUTO_COLETA);
    else doc.documentElement?.setAttribute(ATRIBUTO_COLETA, t);
  };

  const aoPedir = () => {
    void obterCtx()
      .then((ctx) => {
        if (!ctx || ctx.sigiloso) return;
        for (const n of FATIAS_DA_CAPA) if (ctx.loja.ler(n).estado !== "pronto") ctx.recarregar(n);
      })
      .catch((e) => console.warn("[SEI Pro] capa do processo:", e));
  };

  const aoCalcular = () => {
    if (controle) return; // uma coleta por vez
    const c = new AbortController();
    controle = c;
    marcar({ fase: "coletando", feito: 0, total: 0 });
    void obterCtx()
      .then(async (ctx) => {
        if (!ctx || ctx.sigiloso) throw new Error("O histórico não está disponível para este processo.");
        await obterHistorico(ctx, {
          sinal: c.signal,
          aoProgresso: (feito, total) => marcar({ fase: "coletando", feito, total }),
        });
        marcar("pronto");
      })
      .catch((e) => {
        if (cancelado(e) || c.signal.aborted) marcar({ fase: "parada" });
        else marcar({ fase: "erro", mensagem: mensagemDeLeitura(e) });
      })
      .finally(() => {
        controle = null;
      });
  };

  const aoCancelar = () => controle?.abort();

  // --- "Contar tudo": a fila de pastas (uma por vez, o mesmo clique do usuário) e o re-fechamento do que ela abriu ---
  let fila: Fila | null = null;
  let desfazerFila: (() => void) | null = null;
  /** O usuário parou: o que a fila ainda emitir (a pasta em carga termina e é re-fechada) não apaga o "parou". */
  let paradoPeloUsuario = false;
  const marcarContagem = (e: Parameters<typeof textoDaContagem>[0]): void => {
    const t = textoDaContagem(e);
    if (t === null) doc.documentElement?.removeAttribute(ATRIBUTO_CONTAGEM);
    else doc.documentElement?.setAttribute(ATRIBUTO_CONTAGEM, t);
  };
  const soltarFila = (): void => {
    desfazerFila?.();
    desfazerFila = null;
    fila?.destruir();
    fila = null;
  };
  const aoContar = () => {
    paradoPeloUsuario = false;
    if (fila) {
      // Já existe uma rodada parada ou interrompida: "Continuar" / "Tentar de novo" retoma as pastas que faltam.
      const fase = fila.estado().fase;
      if (fase === "carregando" || fase === "pausada") return;
      fila.continuar();
      return;
    }
    const f = criarFila(doc, { abrirCarregadas: false, ...opcoesFila });
    fila = f;
    let encerrando = false;
    desfazerFila = f.aoMudar((e) => {
      if (encerrando || paradoPeloUsuario) return; // o encerramento (re-fechar as pastas) não apaga o resultado já anotado
      const c = contagemDaFila(e);
      marcarContagem(c);
      // Acabou: as pastas que a fila abriu voltam a ficar fechadas (o conteúdo continua no DOM do SEI, e a capa o conta).
      if (e.fase === "concluida" && fila === f) {
        encerrando = true;
        f.encerrar(true);
        encerrando = false;
        if (c === "pronto") soltarFila();
      }
    });
    f.iniciar();
    // Nada a carregar (todas as pastas já vieram): não há o que acompanhar.
    if (f.estado().fase === "ociosa") {
      soltarFila();
      marcarContagem("pronto");
    }
  };
  const aoPararContagem = () => {
    const f = fila;
    if (!f) return;
    f.parar();
    // Devolve as pastas que a fila abriu; a que está em carga é fechada quando terminar. O que já veio continua contado.
    f.encerrar(true);
    paradoPeloUsuario = true;
    // A fila continua viva até a pasta em carga terminar e ser re-fechada; "Continuar" a retoma (`continuar()`).
    marcarContagem({ fase: "parou", restantes: f.pendentes().length });
  };

  doc.addEventListener(EVENTO_CAPA_PEDIR, aoPedir);
  doc.addEventListener(EVENTO_CAPA_CALCULAR, aoCalcular);
  doc.addEventListener(EVENTO_CAPA_CANCELAR, aoCancelar);
  doc.addEventListener(EVENTO_CAPA_CONTAR, aoContar);
  doc.addEventListener(EVENTO_CAPA_PARAR_CONTAGEM, aoPararContagem);
  return () => {
    soltarFila();
    doc.documentElement?.removeAttribute(ATRIBUTO_CONTAGEM);
    doc.removeEventListener(EVENTO_CAPA_CONTAR, aoContar);
    doc.removeEventListener(EVENTO_CAPA_PARAR_CONTAGEM, aoPararContagem);
    doc.removeEventListener(EVENTO_CAPA_PEDIR, aoPedir);
    doc.removeEventListener(EVENTO_CAPA_CALCULAR, aoCalcular);
    doc.removeEventListener(EVENTO_CAPA_CANCELAR, aoCancelar);
  };
}
