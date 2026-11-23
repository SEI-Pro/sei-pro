import { criarAdaptador } from "../../src/adaptador";
import { recurso as fontSize } from "../../src/recursos/font-size";
import { recurso as styleEditor } from "../../src/recursos/style-editor";
import type { Contexto, Recurso } from "../../src/recursos/tipos";
import { type CasoEditor, type FalsoCk4, nosDoisEditores, primeiroP, selecionarTexto, totalInseridos, ultimoInserido } from "../falsos";
import { checar, igual, secao } from "../util";

const ctxDe = (f: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(f.win),
  doc: f.doc,
  win: f.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});
const chama = (r: Recurso, f: { win: Window; doc: Document }, nome: string, ...a: unknown[]) =>
  (r.globais(ctxDe(f))[nome] as (...x: unknown[]) => void)(null, ...a);

/** Faz o tamanho de fonte do elemento ser `px` (o linkedom nao tem getComputedStyle). */
function tamanhoDa(el: Element, px: string): void {
  (el.ownerDocument.defaultView as unknown as { getComputedStyle: unknown }).getComputedStyle = () => ({ fontSize: px });
}

export async function verificarFontSizeStyleEditor(): Promise<void> {
  secao("recurso font-size");
  igual("font-size: unico global", Object.keys(fontSize.globais(ctxDe({ win: {} as Window, doc: {} as Document }))), ["changeFontSize"]);

  const casos: Array<[string, string, string, number | null]> = [
    ["up de 16px", "up", "16px", 18],
    ["down de 16px", "down", "16px", 14],
    ["down de 8px chega a 6px: fora do limite, nao altera", "down", "8px", null],
    ["down de 9px chega a 7px: limite exclusivo, nao altera", "down", "9px", null],
    ["up de 68px chega a 70px: limite exclusivo, nao altera", "up", "68px", null],
    ["up de 66px chega a 68px", "up", "66px", 68],
    ["tamanho ilegivel cai em 16px (up => 18)", "up", "normal", 18],
  ];
  for (const [rotulo, modo, atual, esperado] of casos) {
    await nosDoisEditores(`font-size ${rotulo}`, (c: CasoEditor) => {
      const p = primeiroP(c);
      tamanhoDa(p, atual);
      selecionarTexto(c, p, "texto", "<b>texto</b> &lt;i&gt;");
      chama(fontSize, c, "changeFontSize", modo);
      if (esperado === null) {
        checar(
          `font-size [CK${c.versao}] ${rotulo}`,
          totalInseridos(c) === 0 && (c.versao === 5 || (c.ed as FalsoCk4).instancia("txaEditor_1").estilos.length === 0),
        );
        return;
      }
      if (c.versao === 4) {
        const ed = (c.ed as FalsoCk4).instancia("txaEditor_1");
        igual(`font-size [CK4] ${rotulo}: CKEDITOR.style span com font-size`, (ed.estilos[0] as { def: unknown }).def, {
          element: "span",
          attributes: { style: `font-size: ${esperado}px` },
        });
        igual("font-size [CK4]: dois snapshots ao redor (um passo de desfazer)", ed.snapshots, 2);
      } else {
        igual(
          `font-size [CK5] ${rotulo}: o HTML selecionado vai dentro de um span (ja serializado, sem escapar de novo)`,
          ultimoInserido(c),
          `<span style="font-size: ${esperado}px"><b>texto</b> &lt;i&gt;</span>`,
        );
      }
    });
  }
  for (const [rotulo, html] of [
    ["vazia", ""],
    ["so espacos", "   "],
  ] as const) {
    await nosDoisEditores(`font-size selecao ${rotulo}`, (c: CasoEditor) => {
      c.doc.body.querySelector(".spro-aviso")?.remove();
      const p = primeiroP(c);
      tamanhoDa(p, "16px");
      selecionarTexto(c, p, html, html);
      chama(fontSize, c, "changeFontSize", "up");
      checar(
        `font-size [CK${c.versao}] selecao ${rotulo}: nada muda e avisa`,
        totalInseridos(c) === 0 && /Selecione um texto para alterar o tamanho da fonte/.test(c.doc.body.textContent ?? ""),
      );
    });
  }

  secao("recurso style-editor");
  const { paginaFalsa } = await import("../falsos");
  const { doc, win } = paginaFalsa("<div class='getNewStyleButton cke_button_off'></div>");
  const w = win as unknown as Record<string, unknown>;
  const guardado = new Map<string, string>();
  w.localStorage = {
    getItem: (k: string) => guardado.get(k) ?? null,
    setItem: (k: string, v: string) => guardado.set(k, String(v)),
    removeItem: (k: string) => guardado.delete(k),
  };
  const icones: string[] = [];
  w.insertFontIcon = (alvo: string) => icones.push(alvo);
  const head = doc.head;
  head.innerHTML = '<link data-style="seipro-fonticon"><style data-style="seipro-fonticon"></style>';
  const g = styleEditor.globais(ctxDe({ win, doc })) as Record<string, (...a: unknown[]) => void>;
  igual("style-editor: globais", Object.keys(g).sort(), ["getBoxStyleEditor", "updateStyleEditor"]);
  const botao = doc.querySelector(".getNewStyleButton") as Element;

  g.getBoxStyleEditor(null);
  igual(
    "liga: grava a chave, marca o botao on e poe as classes slim no body",
    [guardado.get("seiSlim_editor"), botao.className, doc.body.className],
    ["true", "getNewStyleButton cke_button_on", "seiSlim seiSlim_parent seiSlim_view"],
  );
  igual(
    "liga: recarrega o CSS da fonte de icones (remove o antigo e pede um novo)",
    [head.querySelectorAll('[data-style="seipro-fonticon"]').length, icones],
    [0, ["head"]],
  );
  g.getBoxStyleEditor(null);
  igual(
    "desliga: apaga a chave, botao off e tira as classes",
    [guardado.has("seiSlim_editor"), botao.className, doc.body.className],
    [false, "getNewStyleButton cke_button_off", ""],
  );

  // Estilo Avancado em outra aba muda a chave: o editor ABERTO acompanha pelo evento storage
  (styleEditor.iniciar as (c: Contexto) => void)(ctxDe({ win, doc }));
  const avisar = (newValue: string | null) => {
    const ev = new win.Event("storage") as Event & { key?: string; newValue?: string | null };
    ev.key = "seiSlim_editor";
    ev.newValue = newValue;
    win.dispatchEvent(ev);
  };
  avisar("true");
  igual(
    "storage de outra aba liga: classes slim, botao on e fonte de icones recarregada",
    [doc.body.className, botao.className, icones.length],
    ["seiSlim seiSlim_parent seiSlim_view", "getNewStyleButton cke_button_on", 2],
  );
  avisar(null);
  igual(
    "storage de outra aba desliga: tira as classes e o botao fica off",
    [doc.body.className, botao.className],
    ["", "getNewStyleButton cke_button_off"],
  );
  const antes = doc.body.className;
  const ev2 = new win.Event("storage") as Event & { key?: string; newValue?: string | null };
  ev2.key = "outra_chave";
  ev2.newValue = "true";
  win.dispatchEvent(ev2);
  igual("storage de outra chave e ignorado", doc.body.className, antes);
}
