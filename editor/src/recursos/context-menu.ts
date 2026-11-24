import type { Editor, ItemMenu } from "../adaptador/tipos";
import type { Contexto, Recurso } from "./tipos";

/**
 * Menu de contexto (botao direito) do editor (porte de `context-menu.js`). Monta os itens do SEI Pro:
 *   - Bloquear Edicao        (`menuBlockEdition`) -> alvo em <p> com selecao (so no SEI 4)
 *   - Adicionar Estilo / Duplicar Tabela / Classificar A -> Z / Z -> A (`tableSorterPro`) -> alvo dentro de <tr>
 *   - Copiar formatacao      (`menuCopyStyle`, de copy-style.ts)
 *   - Inteligencia artificial (`menuPlataformAI`) e Formatar/Editar Imagem (`editImgPro`): ficam no monolito
 *
 * Os itens passam por `adaptador.addContextMenu(editor, construtor)`: no CK4 entram no menu nativo; no CK5 (e no
 * CK4 sem menu nativo) vao para o menu proprio do adaptador. O alvo e o elemento clicado (valido no iframe do CK4
 * e na editavel do CK5). As acoes usam DOM nativo dentro de `withEdit` (um passo de desfazer).
 *
 * Diferencas sobre o legado: (1) as acoes que escrevem recusam e avisam em secao somente leitura (o legado alterava
 * o DOM sem checar); (2) a copia da tabela no CK4 e feita por `cloneNode` (o legado reserializava o HTML e o
 * reescrevia por jQuery); (3) o item "Ditado" nao e daqui (e do recurso `ditado`).
 */

/** O que o monolito (e outros recursos) deixa em `window` e este recurso usa em tempo de clique/boot (todos opcionais). */
interface Monolito {
  hasSelection?(editor: Editor): boolean;
  alertaBoxPro?(titulo: string, icone: string, texto: string): void;
  openDialogSyleTable?(editor: Editor): void;
  getSyleSelectedTable?(this_?: Element | null): void;
  menuCopyStyle?(editor: Editor): void;
  menuPlataformAI?(editor: Editor): void;
  editImgPro?(editor: Editor): void;
  restrictConfigValue?(nome: string): boolean;
}

type EditorMarcado = Editor & { __seiProCtxIniciado?: boolean; readOnly?: boolean };

const CLASSE_NOVA_LINHA = "Texto_Justificado_Recuo_Primeira_Linha";
/** Trava contra laco no encadeamento de paragrafos do "Bloquear Edicao". */
const LIMITE_PARAGRAFOS = 5000;

/** `closest` tolerante: o alvo do contextmenu pode ser um no de texto ou nulo. */
export function maisProximo(alvo: Node | null | undefined, seletor: string): Element | null {
  if (!alvo) return null;
  const el = alvo.nodeType === 1 ? (alvo as Element) : alvo.parentElement;
  return el?.closest ? el.closest(seletor) : null;
}

/** Indice (em `childNodes`) da celula da coluna `coluna` (conta so elementos); sem ela, o primeiro no (como o legado). */
function indiceDaCelula(linha: Element, coluna: number): number {
  let vistos = -1;
  const nos = linha.childNodes;
  for (let i = 0; i < nos.length; i++) {
    if (nos[i]?.nodeType === 1) {
      vistos++;
      if (vistos === coluna) return i;
    }
  }
  return 0;
}

const textoDaCelula = (no: Node | undefined): string => ((no as HTMLElement | undefined)?.textContent ?? "").trim();

/** Compara duas linhas pela coluna: vazias vao para o fim; numeros em sequencia natural (`numeric`). */
export function compararLinhas(a: Element, b: Element, coluna: number, ordem: "asc" | "desc"): number {
  const ta = textoDaCelula(a.childNodes[indiceDaCelula(a, coluna)]);
  const tb = textoDaCelula(b.childNodes[indiceDaCelula(b, coluna)]);
  if (!ta) return tb ? 1 : 0;
  if (!tb) return -1;
  return ordem === "desc" ? tb.localeCompare(ta, undefined, { numeric: true }) : ta.localeCompare(tb, undefined, { numeric: true });
}

export const recurso: Recurso = {
  id: "context-menu",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;

    /** Ha selecao nao colapsada: o helper do monolito quando existe; senao, o texto selecionado do adaptador. */
    const temSelecao = (editor: Editor): boolean => {
      if (typeof w.hasSelection === "function") {
        try {
          return !!w.hasSelection(editor);
        } catch {
          // cai no teste do adaptador
        }
      }
      return A.getSelectedText(editor).length > 0;
    };

    /** Escrita em secao somente leitura: avisa (pelo adaptador) e nao escreve. */
    const recusar = (editor: Editor): boolean => {
      if (!A.somenteLeitura(editor)) return false;
      A.recusarEscrita();
      return true;
    };

    function abrirDialogoEstiloTabela(editor: Editor): void {
      if (typeof w.openDialogSyleTable === "function") w.openDialogSyleTable(editor);
      else if (typeof w.getSyleSelectedTable === "function") w.getSyleSelectedTable(null); // pelo fluxo do botao da barra
    }

    /** A tabela do alvo; na falta, a da selecao. */
    const tabelaDe = (editor: Editor, alvo: Element | null): HTMLTableElement | null => {
      const t = maisProximo(alvo, "table") ?? maisProximo(A.getSelectionElement(editor), "table");
      return t as HTMLTableElement | null;
    };

    /** Insere uma copia da tabela logo apos ela, separada por um paragrafo vazio. */
    function duplicarTabela(editor: Editor, alvo: Element | null): void {
      const tabela = tabelaDe(editor, alvo);
      if (!tabela || recusar(editor)) return;
      // criado no documento do destino: o corpo do CK4 e um iframe (outro documento)
      const doc = A.versao === 5 ? c.doc : tabela.ownerDocument;
      const linha = doc.createElement("p");
      linha.className = CLASSE_NOVA_LINHA;
      linha.append(doc.createElement("br"));
      A.withEdit(editor, () => {
        if (A.versao === 5) {
          // O CK5 reconcilia o DOM da editavel: a copia so persiste inserida pelo model, antes do irmao seguinte.
          A.insertHtmlBefore(editor, tabela.nextElementSibling ?? tabela, linha.outerHTML + tabela.outerHTML);
        } else {
          tabela.after(linha, tabela.cloneNode(true));
        }
      });
    }

    /** Ordena as linhas do `<tbody>` pela coluna da celula clicada (`ordem`: asc | desc). */
    function ordenarTabela(editor: Editor, alvo: Element | null, ordem: "asc" | "desc"): void {
      const celula = maisProximo(alvo, "td,th") ?? maisProximo(A.getSelectionElement(editor), "td,th");
      const tabela = maisProximo(alvo, "table") ?? maisProximo(A.getSelectionElement(editor), "table");
      if (!celula || !tabela || recusar(editor)) return;
      let coluna = 0;
      for (let irmao = celula.previousElementSibling; irmao; irmao = irmao.previousElementSibling) coluna++;
      const corpo = tabela.querySelector("tbody") ?? tabela;
      A.withEdit(editor, () => {
        const linhas = Array.from(corpo.childNodes).filter((n): n is Element => n.nodeType === 1);
        linhas.sort((a, b) => compararLinhas(a, b, coluna, ordem));
        for (const linha of linhas) corpo.appendChild(linha); // reanexar reordena no lugar
      });
    }

    /** Alterna `contenteditable=false` do `<p>` da selecao ate (inclusive) o `<p>` onde ela termina. */
    function bloquearEdicao(editor: Editor, alvo: Element | null): void {
      if (A.versao === 5) {
        if (typeof w.alertaBoxPro === "function") {
          w.alertaBoxPro("Info", "info-circle", "Bloquear Edição ainda não está disponível no editor do SEI 5.");
        }
        return;
      }
      const inicio = maisProximo(alvo, "p") ?? A.getSelectionParagraph(editor);
      if (!inicio || recusar(editor)) return;
      let fim: Element = inicio;
      try {
        const corpo = A.getBodyContainer(editor);
        const doc = corpo?.ownerDocument;
        const sel = doc?.getSelection?.() ?? doc?.defaultView?.getSelection?.() ?? null;
        const p = maisProximo(sel?.focusNode, "p");
        if (p) fim = p;
      } catch {
        // usa o paragrafo de inicio
      }
      A.withEdit(editor, () => {
        let p: Element | null = inicio;
        for (let guarda = 0; p && guarda < LIMITE_PARAGRAFOS; guarda++) {
          const travado = p.getAttribute("contenteditable") === "false";
          p.setAttribute("contenteditable", travado ? "true" : "false");
          if (p === fim) break;
          p = p.nextElementSibling;
        }
      });
    }

    /** "Bloquear Edicao": alvo dentro de um <p> e ha selecao. No SEI 5 nao ha item (a acao so avisaria). */
    function menuBlockEdition(editor: Editor): void {
      if (!editor) return;
      A.addContextMenu(editor, (alvo): ItemMenu[] => {
        if (A.versao === 5) return [];
        if (maisProximo(alvo, "p") && temSelecao(editor)) {
          return [{ label: "Bloquear Edição", action: () => bloquearEdicao(editor, alvo) }];
        }
        return [];
      });
    }

    /** Menu da tabela: alvo dentro de um <tr>. */
    function tableSorterPro(editor: Editor): void {
      if (!editor) return;
      A.addContextMenu(editor, (alvo): ItemMenu[] => {
        if (!maisProximo(alvo, "tr")) return [];
        return [
          { label: "Adicionar Estilo", action: () => abrirDialogoEstiloTabela(editor) },
          { label: "Duplicar Tabela", action: () => duplicarTabela(editor, alvo) },
          { label: "Classificar A → Z", action: () => ordenarTabela(editor, alvo, "asc") },
          { label: "Classificar Z → A", action: () => ordenarTabela(editor, alvo, "desc") },
        ];
      });
    }

    function iniciarEditor(editor: Editor | null): void {
      const ed = editor as EditorMarcado | null;
      if (!ed || ed.__seiProCtxIniciado) return;
      ed.__seiProCtxIniciado = true;
      tableSorterPro(ed);
      if (typeof w.menuCopyStyle === "function") w.menuCopyStyle(ed);
      menuBlockEdition(ed);
      const temFerramentasIA = typeof w.restrictConfigValue === "function" ? !!w.restrictConfigValue("ferramentasia") : false;
      if (temFerramentasIA && typeof w.menuPlataformAI === "function") w.menuPlataformAI(ed);
      if (c.checkOpcao("editarimagens") && typeof w.editImgPro === "function") w.editImgPro(ed);
    }

    /** Boot: registra os menus em toda secao editavel (CK4 com secoes tem uma instancia por secao). */
    function initContextMenuPro(): void {
      let editores = (A.getAllInstances() || []).filter((ed) => ed && !(ed as EditorMarcado).readOnly);
      if (!editores.length) {
        const unico = A.getInstance();
        if (unico) editores = [unico];
      }
      for (const ed of editores) iniciarEditor(ed);
    }

    return { menuBlockEdition, tableSorterPro, initContextMenuPro };
  },
};
