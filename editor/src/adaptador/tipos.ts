/**
 * Contrato do adaptador do editor (CKEditor 4 e 5). Espelha o `SeiProEditorAdapter` legado
 * (`dist/js/sei-pro-editor-adapter.js`): os recursos falam so com isto, nunca com `CKEDITOR.*`.
 */

export type Versao = 4 | 5;

/** Instancia do CKEditor (CK4: uma por secao; CK5: uma, multi-root). Opaca para os recursos. */
export type Editor = object;

/** Item de menu de contexto. `label`/`action` (e nao rotulo/acao) porque o registro de construtores e compartilhado com o legado. */
export interface ItemMenu {
  label: string;
  action: () => void;
}

export interface DefinicaoEstilo {
  element: string;
  attributes?: Record<string, string>;
}

export interface Adaptador {
  /** 4, 5 ou 0 enquanto indeterminado. */
  readonly versao: Versao | 0;
  getInstance(ref?: Element | null): Editor | null;
  getAllInstances(): Editor[];
  focus(e: Editor): void;
  saveSnapshot(e: Editor): void;
  /** Uma acao = um passo de desfazer (CK4: snapshot antes e depois; CK5: um `model.change`). */
  withEdit(e: Editor, fn: () => void): void;
  insertHtml(e: Editor, html: string): void;
  insertText(e: Editor, texto: string): void;
  getSelectionElement(e: Editor): Element | null;
  getSelectionParagraph(e: Editor): Element | null;
  insertHtmlBefore(e: Editor, ref: Element, html: string): void;
  getToolbarContainer(e: Editor): HTMLElement | null;
  getBodyContainer(e: Editor): HTMLElement | null;
  findInBody(e: Editor, seletor: string): HTMLElement[];
  appendToBody(e: Editor, html: string): void;
  transformBodyHtml(e: Editor, fn: (html: string) => string): void;
  execCommand(e: Editor, comando: string, valor?: unknown): void;
  applyStyle(e: Editor, def: DefinicaoEstilo): void;
  getData(e: Editor): string;
  setData(e: Editor, html: string): void;
  insertElement(e: Editor, html: string): void;
  saveSelection(e: Editor): unknown;
  restoreSelection(e: Editor, token: unknown): void;
  getSelectedText(e: Editor): string;
  getSelectedHtml(e: Editor): string;
  on(e: Editor, evento: string, fn: (...a: unknown[]) => void): void;
  off(e: Editor, evento: string, fn: (...a: unknown[]) => void): void;
  fire(e: Editor, evento: string, dados?: unknown): void;
  addContextMenu(e: Editor, construtor: (alvo: Element | null) => ItemMenu[]): void;
  /** Resolve quando o editor esta pronto; rejeita no tempo limite. */
  waitReady(ms: number): Promise<Editor>;
  /** Registra quem e avisado quando uma escrita e IGNORADA por cair em secao somente leitura (uma chamada por tentativa). */
  aoRecusarEscrita(fn: () => void): void;
  /** A secao/instancia e somente leitura (CK4 `readOnly`; CK5 raiz com `somenteLeitura`). */
  somenteLeitura(e: Editor): boolean;
}
