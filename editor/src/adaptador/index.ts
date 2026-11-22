import { criarBackendCk4 } from "./ck4";
import { criarBackendCk5 } from "./ck5";
import type { Adaptador, Editor } from "./tipos";
import { detectarVersao } from "./versao";

export type { Adaptador, Editor, ItemMenu, Versao } from "./tipos";
export { detectarVersao } from "./versao";

/**
 * Fachada: escolhe o backend pela versao detectada e SO congela a escolha quando a resposta deixa de
 * ser "indeterminada" (0). Perguntar antes de o CK5 montar nao pode fixar o backend errado.
 */
export function criarAdaptador(win: Window): Adaptador {
  type Janela = Parameters<typeof criarBackendCk4>[0];
  let escolhido: Adaptador | null = null;
  const recusa: { fn?: () => void } = {};
  const backend = (): Adaptador | null => {
    if (escolhido) return escolhido;
    const v = detectarVersao(win);
    if (v === 5) escolhido = criarBackendCk5(win as Janela, recusa);
    else if (v === 4) escolhido = criarBackendCk4(win as Janela, recusa);
    return escolhido;
  };
  const exige = (): Adaptador => {
    const b = backend();
    if (!b) throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");
    return b;
  };
  const delega = <K extends keyof Adaptador>(k: K) =>
    ((...args: unknown[]) => (exige()[k] as (...a: unknown[]) => unknown)(...args)) as Adaptador[K];

  return {
    get versao() {
      return backend()?.versao ?? 0;
    },
    getInstance: (ref) => backend()?.getInstance(ref) ?? null,
    getAllInstances: () => backend()?.getAllInstances() ?? [],
    focus: delega("focus"),
    saveSnapshot: delega("saveSnapshot"),
    withEdit: delega("withEdit"),
    insertHtml: delega("insertHtml"),
    insertText: delega("insertText"),
    getSelectionElement: delega("getSelectionElement"),
    getSelectionParagraph: delega("getSelectionParagraph"),
    insertHtmlBefore: delega("insertHtmlBefore"),
    getToolbarContainer: delega("getToolbarContainer"),
    getBodyContainer: delega("getBodyContainer"),
    findInBody: delega("findInBody"),
    appendToBody: delega("appendToBody"),
    transformBodyHtml: delega("transformBodyHtml"),
    execCommand: delega("execCommand"),
    applyStyle: delega("applyStyle"),
    getData: delega("getData"),
    setData: delega("setData"),
    insertElement: delega("insertElement"),
    saveSelection: delega("saveSelection"),
    restoreSelection: delega("restoreSelection"),
    getSelectedText: delega("getSelectedText"),
    getSelectedHtml: delega("getSelectedHtml"),
    on: delega("on"),
    off: delega("off"),
    fire: delega("fire"),
    addContextMenu: delega("addContextMenu"),
    somenteLeitura: delega("somenteLeitura"),
    aoRecusarEscrita(fn) {
      recusa.fn = fn;
    },
    recusarEscrita() {
      recusa.fn?.();
    },
    waitReady(ms: number): Promise<Editor> {
      const inicio = Date.now();
      return new Promise((resolve, reject) => {
        const sondar = () => {
          const b = backend();
          if (b) return b.waitReady(Math.max(1, ms - (Date.now() - inicio))).then(resolve, reject);
          if (Date.now() - inicio > ms) return reject(new Error("Editor nao detectado (nem CK4 nem CK5)"));
          setTimeout(sondar, 100);
        };
        sondar();
      });
    },
  };
}
