import { criarAbrirModal, criarConfirmar } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { abrirDialogo, garantirEstiloBase } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { caixa, criarAbas, formulario, grupo } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Inserir conteudo externo (porte de `importar-doc.js`): documento HTML ou Word (.docx) de um arquivo local, Google Docs
 * (link publico) e Google Planilhas (link "Publicar na Web"). O .docx vira HTML pelo mammoth (carregado sob demanda); o
 * HTML passa pela limpeza Word -> SEI e entra no editor, no lugar de todo o documento ou antes do paragrafo do cursor.
 *
 * No CK4 o Google Docs/Planilhas segue pela esteira do monolito (`loadGoogleDocs`: DocsToSEI, CSS em classes do SEI, imagens
 * em base64), que depende do iframe; no CK5 nao ha iframe e entra so a limpeza basica (links, scripts, estilos).
 */

const MSG_GOOGLE = "Nenhum documento encontrado! Confira se o documento está acessível por qualquer pessoa na internet e tente novamente.";
const URL_DOCS = "https://docs.google.com/feeds/download/documents/export/Export?id=";
const URL_PLANILHA = "https://docs.google.com/spreadsheets/d/e/";

export type ModoGoogle = "docs" | "sheets";

interface Mammoth {
  convertToHtml(entrada: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages?: unknown[] }>;
}

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  mammoth?: Mammoth;
  setParamEditor?(el: Element | null): void;
  loadGoogleDocs?(url: string, iframe: unknown, modo: ModoGoogle): void;
  iframeEditor?: unknown;
  replaceDadosEditor?(el: Element | null): void;
  enableButtonSavePro?(): void;
}

interface Opcoes {
  /** Troca o documento inteiro (e nao so insere antes do paragrafo do cursor). */
  substituir: boolean;
  /** Roda a troca das #hashtags depois de inserir. */
  trocarCampos: boolean;
  /** Le o .html como Windows-1252 (arquivos do Word com acento quebrado). */
  windows1252: boolean;
}

function removerComentarios(no: Node): void {
  for (const filho of [...no.childNodes]) {
    if (filho.nodeType === 8) filho.parentNode?.removeChild(filho);
    else removerComentarios(filho);
  }
}

function desembrulhar(el: Element): void {
  while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
  el.parentNode?.removeChild(el);
}

/**
 * Limpeza do HTML que vem do Word, sobre uma STRING (vale igual no CK4 e no CK5): tira cabecalho/estilo/script, marcas do
 * Office e comentarios; `p.MsoNormal` vira classe do SEI; `<del>` vira texto riscado vermelho e `<ins>` sublinhado azul.
 */
export function wordParaSei(html: string, analisar: (h: string) => Document): string {
  const doc = analisar(`<!doctype html><html><body>${html}</body></html>`);
  const corpo = doc.body;
  for (const el of corpo.querySelectorAll("link, script, style, meta")) el.parentNode?.removeChild(el);
  for (const el of corpo.querySelectorAll("o\\:p")) el.parentNode?.removeChild(el);
  for (const a of corpo.querySelectorAll("a.msocomanchor")) a.parentNode?.removeChild(a);
  for (const d of corpo.querySelectorAll('div[style="mso-element:comment-list"]')) d.parentNode?.removeChild(d);
  removerComentarios(corpo);

  for (const p of corpo.querySelectorAll("p.MsoNormal")) {
    const classe = p.getAttribute("align") === "center" ? "Texto_Centralizado" : "Texto_Justificado_Recuo_Primeira_Linha";
    p.classList.remove("MsoNormal");
    p.removeAttribute("align");
    p.removeAttribute("style");
    p.classList.add(classe);
    for (const sp of [...p.querySelectorAll("span")]) desembrulhar(sp);
    const marcar = (alvo: Element, estilo: string, tag: "s" | "u") => {
      // vazio ou so espaco (inclusive &nbsp;): some sem deixar marca
      if ((alvo.textContent ?? "").replace(/\u00a0/g, " ").trim() !== "" || alvo.querySelector("*")) {
        const envoltorio = doc.createElement("span");
        envoltorio.setAttribute("style", estilo);
        const marca = doc.createElement(tag);
        while (alvo.firstChild) marca.append(alvo.firstChild);
        envoltorio.append(marca);
        alvo.parentNode?.insertBefore(envoltorio, alvo);
        alvo.parentNode?.insertBefore(doc.createTextNode(" "), alvo);
      }
      alvo.parentNode?.removeChild(alvo);
    };
    for (const del of [...p.querySelectorAll("del")]) marcar(del, "color:#FF0000;", "s");
    for (const ins of [...p.querySelectorAll("ins")]) marcar(ins, "color:#0000FF;", "u");
  }
  for (const sec of [...corpo.querySelectorAll(".WordSection1")]) desembrulhar(sec);
  return corpo.innerHTML;
}

/** Limpeza basica do HTML publicado pelo Google (CK5, sem a esteira do CK4): sem script/estilo e com os links diretos. */
export function googleParaSeiBasico(html: string, analisar: (h: string) => Document): string {
  const doc = analisar(html);
  const corpo = doc.body ?? doc.documentElement;
  for (const el of corpo.querySelectorAll("link, script, style, meta, title")) el.parentNode?.removeChild(el);
  for (const a of corpo.querySelectorAll("a[href]")) {
    let href = a.getAttribute("href") ?? "";
    if (href.includes("https://www.google.com/url?q=")) {
      try {
        const destino = new URL(href).searchParams.get("q");
        if (destino) href = destino;
      } catch {
        // endereco torto: fica como esta
      }
    }
    a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noreferrer");
  }
  return corpo.innerHTML;
}

export const recurso: Recurso = {
  id: "importar-doc",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const analisar = (html: string): Document =>
      new (c.win as unknown as { DOMParser: typeof DOMParser }).DOMParser().parseFromString(html, "text/html");
    const buscar = (url: string): Promise<Response> => (c.fetch ?? c.win.fetch.bind(c.win))(url);

    /** Carrega o mammoth (.docx -> HTML) na pagina, uma vez. */
    let carregandoMammoth: Promise<void> | null = null;
    function garantirMammoth(): Promise<void> {
      if (w.mammoth) return Promise.resolve();
      carregandoMammoth ??= new Promise<void>((ok) => {
        const s = c.doc.createElement("script");
        s.src = `${c.base}js/lib/mammoth.browser.min.js`;
        s.onload = () => ok();
        s.onerror = () => ok();
        c.doc.head.append(s);
      });
      return carregandoMammoth;
    }

    async function confirmarSubstituicao(): Promise<boolean> {
      garantirEstiloBase(c.doc);
      return criarConfirmar(criarAbrirModal())(
        "Substituir todo o conteúdo atual do documento pelo conteúdo importado?",
        "Substituir",
        "Voltar",
      );
    }

    /** Poe o HTML no editor (todo o documento ou antes do paragrafo do cursor) e depois limpa o que veio do Word. */
    function loadFileImportEditor(result: string, opcoes: Pick<Opcoes, "substituir">, editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      A.withEdit(ed, () => {
        if (opcoes.substituir) A.setData(ed, result);
        else {
          const p = A.getSelectionParagraph(ed);
          if (p) A.insertHtmlBefore(ed, p, result);
          else A.insertHtml(ed, result);
        }
      });
      // fora do model.change (o CK5 nao deixa mexer no DOM do editavel la dentro): espera a reconciliacao
      setTimeout(() => {
        wordToSEI(ed);
        w.enableButtonSavePro?.();
      }, 0);
    }

    function wordToSEI(editorOuIframe?: unknown): void {
      const candidato = editorOuIframe as { model?: unknown; name?: unknown } | null | undefined;
      const ed = candidato && (candidato.model || candidato.name) ? (candidato as object) : A.getInstance();
      if (!ed) return;
      A.transformBodyHtml(ed, (html) => wordParaSei(html, analisar));
    }

    async function lerArquivoHtml(arquivo: File, windows1252: boolean): Promise<string> {
      const bytes = await arquivo.arrayBuffer();
      return new TextDecoder(windows1252 ? "windows-1252" : "utf-8").decode(bytes);
    }

    async function converterDocxParaHtml(arquivo: File): Promise<string | null> {
      await garantirMammoth();
      if (!w.mammoth) {
        avisar("Conversor de Word não carregado. Tente novamente em instantes.");
        return null;
      }
      const r = await w.mammoth.convertToHtml({ arrayBuffer: await arquivo.arrayBuffer() });
      return r.value;
    }

    /** Importa um arquivo local: .docx pelo mammoth, .html/.htm direto. Devolve se inseriu. */
    async function handleFileImport(arquivo: File, opcoes: Opcoes, editor?: object): Promise<boolean> {
      const ext = arquivo.name.split(".").pop()?.toLowerCase() ?? "";
      if (ext !== "docx" && ext !== "html" && ext !== "htm") {
        avisar("Formato não suportado. Use um arquivo .docx ou .html");
        return false;
      }
      if (opcoes.substituir && !(await confirmarSubstituicao())) return false;
      try {
        const html = ext === "docx" ? await converterDocxParaHtml(arquivo) : await lerArquivoHtml(arquivo, opcoes.windows1252);
        if (html === null) return false;
        loadFileImportEditor(html, opcoes, editor);
        if (opcoes.trocarCampos) setTimeout(() => w.replaceDadosEditor?.(null), 500);
        return true;
      } catch {
        avisar("Não foi possível ler o arquivo. Confira se ele não está corrompido.");
        return false;
      }
    }

    /** Google Docs/Planilhas pelo endereco publico. CK4: esteira do monolito. CK5: busca o HTML e insere com a limpeza basica. */
    async function importGoogleByUrl(url: string, modo: ModoGoogle, substituir: boolean, editor?: object): Promise<boolean> {
      const ed = editor ?? A.getInstance();
      if (A.versao === 4 && typeof w.loadGoogleDocs === "function" && w.iframeEditor) {
        w.loadGoogleDocs(url, w.iframeEditor, modo);
        return true;
      }
      if (!ed) {
        avisar("Editor não encontrado.");
        return false;
      }
      if (substituir && !(await confirmarSubstituicao())) return false;
      try {
        const resposta = await buscar(url);
        const dados = resposta.ok ? await resposta.text() : "";
        if (!dados) {
          avisar(MSG_GOOGLE);
          return false;
        }
        loadFileImportEditor(googleParaSeiBasico(dados, analisar), { substituir }, ed);
        return true;
      } catch {
        avisar(MSG_GOOGLE);
        return false;
      }
    }

    function getGoogleDocs(url: string, substituir: boolean, editor?: object): Promise<boolean> {
      const m = /\/d\/(.*?)(\/|$)/.exec(url);
      if (!m) {
        avisar("Endereço do documento inválido!");
        return Promise.resolve(false);
      }
      return importGoogleByUrl(`${URL_DOCS}${m[1]}&exportFormat=html`, "docs", substituir, editor);
    }

    function getGoogleSheets(url: string, substituir: boolean, editor?: object): Promise<boolean> {
      const m = /\/e\/(.*?)(\/|$)/.exec(url);
      if (!m) {
        avisar("Endereço da planilha inválido!");
        return Promise.resolve(false);
      }
      return importGoogleByUrl(`${URL_PLANILHA}${m[1]}/pubhtml`, "sheets", substituir, editor);
    }

    function importDocPro(this_: Element | null): void {
      // CK4: popula idEditor/oEditor/iframeEditor para a esteira do monolito (no CK5 e no-op)
      try {
        w.setParamEditor?.(this_);
      } catch {
        // sem o auxiliar: so o fluxo de arquivo funciona
      }
      const ed = A.getInstance(this_);
      if (!ed) return;
      void garantirMammoth();

      const arquivo = h("input", { type: "file", id: "fileInputImportHTMLDocx", accept: ".docx,.html,.htm" });
      const marcar = (id: string, texto: string, marcado: boolean) => caixa({ id, ...(marcado ? { checked: "checked" } : {}) }, texto);
      const aba1 = formulario(
        grupo("Arquivo do computador", { para: "fileInputImportHTMLDocx", dica: "Aceita Word (.docx) e HTML (.html)." }, arquivo),
        grupo(
          "Opções",
          {},
          marcar("replaceText", "Substituir todo o documento pelo conteúdo externo", true),
          marcar("replaceTags", "Substituir campos dinâmicos no documento (se disponível)", true),
          marcar("importWord", "Corrigir erros de codificação de documentos Word (acentos quebrados em .html)", false),
        ),
      );
      const urlDocs = h("input", {
        type: "text",
        id: "urlGDocs",
        placeholder: "https://docs.google.com/document/d/…",
        autocomplete: "off",
        spellcheck: "false",
      });
      const aba2 = formulario(
        grupo("Endereço do Google Docs", { para: "urlGDocs" }, urlDocs),
        marcar("replaceTextDocs", "Substituir todo o documento pelo conteúdo externo", true),
        h(
          "div",
          { class: "spro-aviso-inline" },
          h(
            "span",
            {},
            "Antes de importar, confira se o documento está acessível por qualquer pessoa na internet. ",
            h(
              "a",
              { class: "spro-link", href: "https://seipro.app/pages/INSERIRDOC.html", target: "_blank", rel: "noopener noreferrer" },
              "Veja a ajuda",
            ),
            ".",
          ),
        ),
      );
      const urlPlanilha = h("input", {
        type: "text",
        id: "urlGSheets",
        placeholder: "https://docs.google.com/spreadsheets/d/e/…",
        autocomplete: "off",
        spellcheck: "false",
      });
      const aba3 = formulario(
        grupo("Endereço do Google Planilhas (Publicar na Web)", { para: "urlGSheets" }, urlPlanilha),
        marcar("replaceTextSheets", "Substituir todo o documento pelo conteúdo externo", true),
        h(
          "div",
          { class: "spro-aviso-inline" },
          h(
            "span",
            {},
            "Antes de importar, confira se a planilha está publicada na web. O endereço publicado é diferente do endereço da planilha. ",
            h(
              "a",
              { class: "spro-link", href: "https://seipro.app/pages/INSERIRPLANILHA.html", target: "_blank", rel: "noopener noreferrer" },
              "Veja a ajuda",
            ),
            ".",
          ),
        ),
      );

      let ativa = "arquivo";
      const abas = criarAbas(
        "imp",
        [
          ["arquivo", "Word ou HTML"],
          ["docs", "Google Docs"],
          ["sheets", "Google Planilhas"],
        ],
        { arquivo: aba1, docs: aba2, sheets: aba3 },
        (id) => {
          ativa = id;
        },
      );

      const marcado = (id: string) => estaMarcado(c.doc.querySelector<HTMLInputElement>(`#${id}`));
      const inserir = h("button", { type: "button", class: "spro-botao primario" }, "Inserir");
      inserir.addEventListener("click", () => {
        void (async () => {
          let feito = false;
          if (ativa === "arquivo") {
            const f = (arquivo as HTMLInputElement).files?.[0];
            if (!f) return void avisar("Escolha um arquivo .docx ou .html.");
            feito = await handleFileImport(
              f,
              { substituir: marcado("replaceText"), trocarCampos: marcado("replaceTags"), windows1252: marcado("importWord") },
              ed,
            );
          } else if (ativa === "docs") {
            const u = urlDocs.value.trim();
            if (!u) return void avisar("Informe o endereço do Google Docs.");
            feito = await getGoogleDocs(u, marcado("replaceTextDocs"), ed);
          } else {
            const u = urlPlanilha.value.trim();
            if (!u) return void avisar("Informe o endereço da planilha publicada.");
            feito = await getGoogleSheets(u, marcado("replaceTextSheets"), ed);
          }
          if (feito) dialogo.fechar();
        })();
      });
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Inserir conteúdo externo",
        largura: 640,
        conteudo: h(
          "div",
          { class: "spro-form" },
          abas.barra,
          h("div", {}, ...abas.paineis),
          h("div", { class: "spro-dialogo-rodape" }, inserir),
        ),
      });
      abas.selecionar("arquivo");
      arquivo.focus({ preventScroll: true });
    }

    return {
      importDocPro,
      getGoogleDocs: (url: string, _box?: unknown, editor?: object) =>
        getGoogleDocs(url, marcadoSeExistir(c.doc, "replaceTextDocs"), editor),
      getGoogleSheets: (url: string, _box?: unknown, editor?: object) =>
        getGoogleSheets(url, marcadoSeExistir(c.doc, "replaceTextSheets"), editor),
      importGoogleByUrl: (url: string, modo: ModoGoogle, editor?: object) =>
        importGoogleByUrl(url, modo, marcadoSeExistir(c.doc, modo === "sheets" ? "replaceTextSheets" : "replaceTextDocs"), editor),
      handleFileImport: (arquivos: ArrayLike<File>, _box?: unknown, editor?: object) =>
        arquivos[0]
          ? handleFileImport(
              arquivos[0],
              {
                substituir: marcadoSeExistir(c.doc, "replaceText"),
                trocarCampos: marcadoSeExistir(c.doc, "replaceTags"),
                windows1252: marcadoSeExistir(c.doc, "importWord"),
              },
              editor,
            )
          : Promise.resolve(false),
      converterDocxParaHtml: (arquivos: ArrayLike<File>, _box?: unknown, editor?: object) =>
        arquivos[0]
          ? handleFileImport(
              arquivos[0],
              { substituir: marcadoSeExistir(c.doc, "replaceText"), trocarCampos: false, windows1252: false },
              editor,
            )
          : Promise.resolve(false),
      loadFileImportHTML: (arquivos: ArrayLike<File>, _box?: unknown, editor?: object) =>
        arquivos[0]
          ? handleFileImport(
              arquivos[0],
              {
                substituir: marcadoSeExistir(c.doc, "replaceText"),
                trocarCampos: marcadoSeExistir(c.doc, "replaceTags"),
                windows1252: marcadoSeExistir(c.doc, "importWord"),
              },
              editor,
            )
          : Promise.resolve(false),
      loadFileImportEditor: (result: string, _box?: unknown, editor?: object) =>
        loadFileImportEditor(result, { substituir: marcadoSeExistir(c.doc, "replaceText") }, editor),
      wordToSEI,
    };
  },
};

/** Checkbox marcado: a propriedade no navegador; o atributo onde a propriedade nao existe (ambientes de teste). */
function estaMarcado(el: HTMLInputElement | null): boolean {
  if (!el) return false;
  return typeof el.checked === "boolean" ? el.checked : el.hasAttribute("checked");
}

/** Compat com quem chamava sem passar opcoes: le o checkbox do dialogo (marcado por padrao quando o dialogo nao existe). */
function marcadoSeExistir(doc: Document, id: string): boolean {
  const el = doc.querySelector<HTMLInputElement>(`#${id}`);
  return el ? estaMarcado(el) : id.startsWith("replaceText");
}
