import { h } from "@comum/ui/dom";
import type { Adaptador, Editor } from "../adaptador";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { dica, formulario, grade, grupo } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Ditado por voz (porte de `ditado.js`): Web Speech API do navegador, adaptada do plugin CKWebSpeech. O texto
 * reconhecido entra pelo adaptador (CK4 e CK5), com os comandos de voz do legado (nova linha, novo paragrafo, ponto
 * final, desfazer, refazer e a pontuacao falada). O botao liga/desliga (`getBoxDitado`), o da engrenagem abre o dialogo de
 * idioma/cultura (`getBoxCtrDitado`) e o atalho Ctrl+Shift+Espaco faz o mesmo no corpo do editor.
 */

/** [nome do idioma, ...[codigo da cultura, nome da cultura?]] */
export type Idioma = readonly [string, ...Array<readonly [string, string?]>];

export const IDIOMAS: readonly Idioma[] = [
  ["Afrikaans", ["af-ZA"]],
  ["Bahasa Indonesia", ["id-ID"]],
  ["Bahasa Melayu", ["ms-MY"]],
  ["Català", ["ca-ES"]],
  ["Čeština", ["cs-CZ"]],
  ["Deutsch", ["de-DE"]],
  [
    "English",
    ["en-AU", "Australia"],
    ["en-CA", "Canada"],
    ["en-IN", "India"],
    ["en-NZ", "New Zealand"],
    ["en-ZA", "South Africa"],
    ["en-GB", "United Kingdom"],
    ["en-US", "United States"],
  ],
  [
    "Español",
    ["es-AR", "Argentina"],
    ["es-BO", "Bolivia"],
    ["es-CL", "Chile"],
    ["es-CO", "Colombia"],
    ["es-CR", "Costa Rica"],
    ["es-EC", "Ecuador"],
    ["es-SV", "El Salvador"],
    ["es-ES", "España"],
    ["es-US", "Estados Unidos"],
    ["es-GT", "Guatemala"],
    ["es-HN", "Honduras"],
    ["es-MX", "México"],
    ["es-NI", "Nicaragua"],
    ["es-PA", "Panamá"],
    ["es-PY", "Paraguay"],
    ["es-PE", "Perú"],
    ["es-PR", "Puerto Rico"],
    ["es-DO", "República Dominicana"],
    ["es-UY", "Uruguay"],
    ["es-VE", "Venezuela"],
  ],
  ["Euskara", ["eu-ES"]],
  ["Français", ["fr-FR"]],
  ["Galego", ["gl-ES"]],
  ["Hrvatski", ["hr_HR"]],
  ["IsiZulu", ["zu-ZA"]],
  ["Íslenska", ["is-IS"]],
  ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]],
  ["Magyar", ["hu-HU"]],
  ["Nederlands", ["nl-NL"]],
  ["Norsk bokmål", ["nb-NO"]],
  ["Polski", ["pl-PL"]],
  ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]],
  ["Română", ["ro-RO"]],
  ["Slovenčina", ["sk-SK"]],
  ["Suomi", ["fi-FI"]],
  ["Svenska", ["sv-SE"]],
  ["Türkçe", ["tr-TR"]],
  ["български", ["bg-BG"]],
  ["Pусский", ["ru-RU"]],
  ["Српски", ["sr-RS"]],
  ["한국어", ["ko-KR"]],
  [
    "中文",
    ["cmn-Hans-CN", "普通话 (中国大陆)"],
    ["cmn-Hans-HK", "普通话 (香港)"],
    ["cmn-Hant-TW", "中文 (台灣)"],
    ["yue-Hant-HK", "粵語 (香港)"],
  ],
  ["日本語", ["ja-JP"]],
  ["Lingua latīna", ["la"]],
];

/** Pontuacao falada -> texto; cada regra troca a PRIMEIRA ocorrencia (com espacos nas duas pontas), na ordem. */
const FALADO: ReadonlyArray<readonly [string, string]> = [
  [" abre parênteses ", "("],
  [" fecha parênteses ", ")"],
  [" abre colchete ", "["],
  [" fecha colchete ", "]"],
  [" abre aspas ", '"'],
  [" fecha aspas ", '"'],
  [" espaço ", " "],
  [" aspas ", '"'],
  [" travessão ", " – "],
  [" traço ", "- "],
  [" ponto e vírgula ", "; "],
  [" dois pontos ", ": "],
  [" 2 pontos ", ": "],
  [" ponto ", ". "],
  [" vírgula ", ", "],
];

/** Troca a pontuacao falada (`t` chega com um espaco em cada ponta) e devolve o trecho pronto para inserir. */
export function traduzirTranscricao(t: string): string {
  for (const [falado, sinal] of FALADO) if (t.includes(falado)) t = t.replace(falado, sinal);
  const primeiro = Array.from(t.trim())[0];
  const espaco = primeiro === "," || primeiro === ";" || primeiro === ":" || primeiro === "-" || primeiro === "." ? "" : " ";
  return espaco + t.trim();
}

/** Comandos de quebra; se mais de um aparecer na frase, o ultimo da lista decide o corte (como no legado). */
const QUEBRAS = ["nova linha", "ponto final", "novo parágrafo"] as const;

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  alertaBoxPro?(titulo: string, icone: string, texto: string): void;
  setParamEditor?(el: Element | null): void;
}

interface ResultadoFala {
  isFinal: boolean;
  [i: number]: { transcript: string };
}
export interface EventoFala {
  resultIndex: number;
  results?: ArrayLike<ResultadoFala>;
  error?: string;
}
/** A superficie da Web Speech API que o recurso usa. */
export interface Reconhecimento {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onerror: ((e: EventoFala) => void) | null;
  onend: (() => void) | null;
  onresult: ((e: EventoFala) => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  start(): void;
  stop(): void;
}
type ConstrutorFala = new () => Reconhecimento;

/** Culturas do idioma de indice `langVal` e a cultura atual. */
export interface Cultura {
  val: string;
  langVal: number;
}

/** Do que a fala depende: pagina, adaptador, base da extensao e o aviso de "indisponivel". */
interface Ambiente {
  win: Window;
  doc: Document;
  base: string;
  avisarIndisponivel(): void;
}

/** Ditado ligado a um editor (CKWebSpeechHandler + CKWebSpeech do legado, numa classe so). */
export class CkWebSpeech {
  _currentCulture: Cultura = { val: "pt-BR", langVal: 19 };
  _recognizing = false;
  _recognition: Reconhecimento | null = null;
  _start_timestamp = 0;

  constructor(
    readonly _langs: readonly Idioma[],
    cultura: string | undefined,
    private readonly amb: Ambiente,
    private readonly A: Adaptador,
    private editor: Editor | null,
  ) {
    this.iniciarServico();
    if (cultura !== undefined) this.setDialectByCulture(cultura);
  }

  isUnlockedService(): boolean {
    return "webkitSpeechRecognition" in this.amb.win || "SpeechRecognition" in this.amb.win;
  }

  private iniciarServico(): void {
    if (!this.isUnlockedService()) return;
    const w = this.amb.win as unknown as { webkitSpeechRecognition?: ConstrutorFala; SpeechRecognition?: ConstrutorFala };
    const Ctor = w.webkitSpeechRecognition ?? w.SpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = false;
    r.onstart = () => this.onStart();
    r.onerror = () => this.onError();
    r.onend = () => this.onEnd();
    r.onresult = (e) => this.onResult(e);
    r.onspeechstart = () => {
      /* sem alteracao de icone no inicio da fala */
    };
    r.onspeechend = () => this.updateIcons();
    this._recognition = r;
  }

  /** Botao da barra: o icone da engrenagem/microfone anima enquanto escuta, e o botao fica "ligado". */
  updateIcons(): void {
    const { doc, base } = this.amb;
    const ligado = this._recognizing;
    const fundo = ligado ? `url('${base}icons/editor/webspeech-enable.gif')` : `url('${base}icons/editor/webspeech.png')`;
    for (const el of doc.querySelectorAll<HTMLElement>(".cke_button__ditado_icon")) el.style.setProperty("background", fundo);
    for (const el of doc.querySelectorAll(".getDitadoButton")) {
      el.classList.add(ligado ? "cke_button_on" : "cke_button_off");
      el.classList.remove(ligado ? "cke_button_off" : "cke_button_on");
    }
  }

  onStart(): void {
    this._recognizing = true;
    this.updateIcons();
  }

  /** Nenhum erro (sem fala, microfone ausente, permissao negada) muda o estado: so refaz o icone. */
  onError(): void {
    this.updateIcons();
  }

  onEnd(): void {
    this._recognizing = false;
    this.updateIcons();
  }

  private ed(): Editor | null {
    this.editor ??= this.A.getInstance();
    return this.editor;
  }

  onResult(event: EventoFala): void {
    const editor = this.ed();
    if (typeof event.results === "undefined") {
      this._recognizing = false;
      if (this._recognition) {
        this._recognition.onend = null;
        this._recognition.stop();
      }
      this.updateIcons();
      return;
    }
    if (!editor) return;
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const r = event.results[i];
      if (!r?.isFinal) continue;
      this.inserirTranscricao(editor, ` ${r[0]?.transcript ?? ""} `);
    }
  }

  /** Escrever/desfazer num editor somente leitura nao faz nada (e o adaptador avisa). */
  private escrever(editor: Editor, texto: string): void {
    this.A.insertText(editor, texto);
  }
  private comando(editor: Editor, nome: string): void {
    if (this.A.somenteLeitura(editor)) {
      this.A.recusarEscrita();
      return;
    }
    this.A.execCommand(editor, nome);
  }

  private inserirTranscricao(editor: Editor, t: string): void {
    const separadores = QUEBRAS.filter((q) => t.includes(` ${q} `));
    if (separadores.length) {
      // o ultimo comando que casar decide o corte, como no legado
      const corte = separadores[separadores.length - 1] as string;
      const partes = t
        .trim()
        .split(corte)
        .filter((n) => n);
      if (!partes.length) {
        this.comando(editor, "enter");
        return;
      }
      partes.forEach((v, idx) => {
        if (v.trim() === "") return;
        const ponto = idx < partes.length - 1 ? "." : "";
        this.escrever(editor, traduzirTranscricao(v) + ponto);
        if (ponto !== "") this.comando(editor, "enter");
      });
      return;
    }
    const baixo = t.trim().toLocaleLowerCase();
    if (baixo === "desfazer") this.comando(editor, "undo");
    else if (baixo === "refazer") this.comando(editor, "redo");
    else this.escrever(editor, traduzirTranscricao(t));
  }

  /** Liga/desliga a escuta (sem suporte do navegador: avisa e sai). */
  toogleSpeech(): void {
    if (!this._recognition) {
      this.amb.avisarIndisponivel();
      return;
    }
    if (!this._recognizing) {
      this._recognition.lang = this._currentCulture.val;
      try {
        this._recognition.start();
      } catch {
        // ja iniciado (clique duplo): o onstart/onend ajustam o estado
      }
      this._start_timestamp = Date.now();
    } else {
      this._recognition.stop();
    }
  }

  setDialectByCulture(cultura: string): Cultura {
    for (let i = 0; i < this._langs.length; i++) {
      const idioma = this._langs[i] as Idioma;
      for (let j = 1; j < idioma.length; j++) {
        const codigo = (idioma[j] as readonly [string, string?])[0];
        if (codigo.toLowerCase() === cultura.toLowerCase()) {
          this._currentCulture = { val: codigo, langVal: i };
          return this._currentCulture;
        }
      }
    }
    return this._currentCulture;
  }

  setDialectByLanguage(langVal: number): void {
    const primeira = (this._langs[langVal]?.[1] as readonly [string, string?] | undefined)?.[0];
    if (primeira) this.setDialectByCulture(primeira);
  }

  getLanguages(): Array<[string, number]> {
    return this._langs.map((l, i) => [l[0], i] as [string, number]);
  }

  getCultures(langVal: number = this._currentCulture.langVal): Array<[string]> {
    const idioma = this._langs[langVal];
    if (!idioma) return [];
    return idioma.slice(1).map((c) => [(c as readonly [string, string?])[0]] as [string]);
  }

  /** Nome da cultura (`Brasil`), quando ha; so o codigo nao diz nada a quem escolhe. */
  nomeDaCultura(langVal: number, codigo: string): string {
    const idioma = this._langs[langVal];
    const c = idioma?.slice(1).find((x) => (x as readonly [string, string?])[0] === codigo) as readonly [string, string?] | undefined;
    return c?.[1] ?? "";
  }
}

type ComFala = Editor & { ckWebSpeech?: CkWebSpeech | null };

export const recurso: Recurso = {
  id: "ditado",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const ambiente: Ambiente = {
      win: c.win,
      doc: c.doc,
      base: c.base,
      avisarIndisponivel() {
        const texto = "Seu navegador não suporta reconhecimento de voz (webkitSpeechRecognition).";
        if (typeof w.alertaBoxPro === "function") w.alertaBoxPro("Ditado indisponível", "exclamation-triangle", texto);
        else avisarEditor(c.doc, texto);
      },
    };

    /** Cria (uma vez por editor) o ditado, o item "Ditado" do menu de contexto e o atalho Ctrl+Shift+Espaco. */
    function ensureCkWebSpeech(editor: Editor | null): CkWebSpeech | null {
      if (!editor) return null;
      const ed = editor as ComFala;
      if (ed.ckWebSpeech === undefined || ed.ckWebSpeech === null) {
        ed.ckWebSpeech = new CkWebSpeech(IDIOMAS, "pt-BR", ambiente, A, editor);

        try {
          A.addContextMenu(editor, () => {
            // SEI 5: o menu do SEI Pro substitui o do navegador; um item que responde a qualquer clique esconderia o
            // corretor ortografico em todo botao direito. La o ditado segue pelo botao da barra e pelo atalho.
            if (A.versao === 5) return [];
            if (!c.checkOpcao("ditado")) return [];
            return [{ label: "Ditado", action: () => ed.ckWebSpeech?.toogleSpeech() }];
          });
        } catch {
          // sem menu de contexto: o botao e o atalho continuam
        }

        try {
          const corpo = A.getBodyContainer(editor) as (HTMLElement & { __seiProDitadoKey?: boolean }) | null;
          if (corpo && !corpo.__seiProDitadoKey) {
            corpo.__seiProDitadoKey = true;
            corpo.addEventListener("keydown", (ev) => {
              const k = ev as KeyboardEvent;
              if (k.ctrlKey && k.shiftKey && (k.code === "Space" || k.key === " " || k.keyCode === 32)) {
                k.preventDefault();
                ed.ckWebSpeech?.toogleSpeech();
              }
            });
          }
        } catch {
          // corpo ainda indisponivel: so o botao e o menu
        }
      }
      return ed.ckWebSpeech ?? null;
    }

    /** O dialogo "Configuracoes do Ditado": idioma e cultura; OK grava a cultura escolhida. */
    function abrirDialogoDitado(ws: CkWebSpeech): void {
      const atual = ws._currentCulture;
      const limpar = (el: Element) => {
        while (el.firstChild) el.removeChild(el.firstChild);
      };
      const selIdioma = h(
        "select",
        { id: "wslanguages" },
        ...ws.getLanguages().map(([nome, idx]) => h("option", { value: String(idx), selected: idx === atual.langVal }, nome)),
      );
      const selCultura = h("select", { id: "wscultures" });
      const preencherCulturas = (langVal: number, escolhida: string) => {
        limpar(selCultura);
        for (const [codigo] of ws.getCultures(langVal)) {
          const nome = ws.nomeDaCultura(langVal, codigo);
          selCultura.append(h("option", { value: codigo, selected: codigo === escolhida }, nome ? `${codigo} – ${nome}` : codigo));
        }
      };
      preencherCulturas(atual.langVal, atual.val);
      // trocar o idioma refaz as culturas, com a primeira marcada
      selIdioma.addEventListener("change", () => {
        const langVal = Number.parseInt(selIdioma.value, 10);
        if (Number.isNaN(langVal)) return;
        preencherCulturas(langVal, ws.getCultures(langVal)[0]?.[0] ?? "");
      });

      const dialogo = abrirDialogo(c.doc, {
        titulo: "Configurações do Ditado",
        largura: 460,
        conteudo: formulario(
          grade("duas", grupo("Idioma", { para: "wslanguages" }, selIdioma), grupo("Cultura", { para: "wscultures" }, selCultura)),
          dica("Atalho: ", h("strong", {}, "Ctrl + Shift + Espaço"), " liga/desliga o ditado."),
          dica(
            "Comandos de voz: “nova linha”, “novo parágrafo” e “ponto final” quebram a linha; " +
              "“vírgula”, “ponto”, “dois pontos”, “ponto e vírgula”, “abre/fecha parênteses” e " +
              "“abre/fecha aspas” inserem a pontuação; “desfazer” e “refazer” voltam e refazem.",
          ),
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                id: "dialogDitadoOk",
                class: "spro-botao primario",
                onclick: () => {
                  const cultura = selCultura.value;
                  if (cultura) ws.setDialectByCulture(cultura);
                  dialogo.fechar();
                },
              },
              "OK",
            ),
          ),
        ),
      });
    }

    function initDitadoPro(): void {
      // as classes do plugin ja sao do modulo (sem estado a montar): fica por compatibilidade com o monolito
    }

    return {
      instanceDitadoPro(editor?: Editor | null) {
        ensureCkWebSpeech(editor || A.getInstance());
      },
      /** Botao do ditado: alterna o visual e liga/desliga a escuta. */
      getBoxDitado(this_: Element | null) {
        const botoes = [...c.doc.querySelectorAll(".getDitadoButton")];
        const desligado = botoes.some((b) => b.classList.contains("cke_button_off"));
        for (const b of botoes) {
          b.classList.add(desligado ? "cke_button_on" : "cke_button_off");
          b.classList.remove(desligado ? "cke_button_off" : "cke_button_on");
        }
        const editor = A.getInstance(this_);
        if (!editor) return;
        ensureCkWebSpeech(editor)?.toogleSpeech();
      },
      /** Botao de configuracoes do ditado: abre o dialogo de idioma e cultura. */
      getBoxCtrDitado(this_: Element | null) {
        if (typeof w.setParamEditor === "function") {
          try {
            w.setParamEditor(this_);
          } catch {
            // o parametro do editor e so conveniencia do monolito
          }
        }
        const editor = A.getInstance(this_);
        if (!editor) return;
        const ws = ensureCkWebSpeech(editor);
        if (ws) abrirDialogoDitado(ws);
      },
      /** Antes, o registro do dialogo CK4; agora so garante o plugin, respeitando o gate de 'revisaotexto'. */
      getDialogDitado() {
        if (c.checkOpcao("revisaotexto")) initDitadoPro();
      },
      initDitadoPro,
    };
  },
};
