import { h } from "@comum/ui/dom";
import type { Editor } from "../adaptador/tipos";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { caixa, criarAbas, formulario, grade, grupo } from "../ui/formulario";
import { comoBotao } from "../ui/teclado";
import { escaparHtml } from "../util/html";
import { imagemParaDataUri } from "../util/imagem";
import { urlHttpValida } from "../util/url";
import { qualidadePadrao } from "./image-quality";
import type { Contexto, Recurso } from "./tipos";

/**
 * Enviar imagem (porte de `image-base64.js`): dialogo de duas abas ("Imagem" e "Propriedades") para trazer imagens do
 * computador (varios arquivos, arrastar e soltar) ou de uma URL, ajustar tamanho, margens, borda, alinhamento, filtro e
 * qualidade, e inserir `<img src="data:...">` no documento. Com uma imagem selecionada (menu de contexto do CK4, barra
 * da imagem no SEI 5) o mesmo dialogo a reformata ("Aplicar"), pre-preenchido a partir dela.
 *
 * CK4: a imagem entra por `insertElement` (ou os atributos da selecionada sao trocados no lugar) e depois o `qualityImages`
 * do monolito comprime as imagens ainda nao tratadas. CK5 (SEI 5): so `src`, `alt` e a largura ficam na `<img>`; margens,
 * borda, filtro e alinhamento vao num `<span>` em volta (o GHS guarda como `htmlSpan`); a recompressao e feita aqui, por canvas.
 */

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  qualidadeImagens?: unknown;
  qualityImages?(origem: Element, destino: Element, qualidade: number): void;
}

/** Modelo do CKEditor 5 (so o que a troca da imagem em bloco/em linha usa). */
interface NoModelo {
  name: string;
  is?(tipo: string): boolean;
  getChildren(): Iterable<NoModelo>;
  getAttributes(): Iterable<[string, unknown]>;
  getAttributeKeys(): Iterable<string>;
}
interface EditorCk5 {
  model: {
    change(fn: (w: { removeAttribute(k: string, e: unknown): void; setAttribute(k: string, v: unknown, e: unknown): void }) => void): void;
    insertContent(conteudo: unknown, onde?: unknown): void;
    createRangeOn(e: unknown): unknown;
  };
  editing: {
    view: { domConverter: { mapDomToView(el: Element): unknown } };
    mapper: { toModelElement(v: unknown): NoModelo | null };
  };
  data: { toModel(view: unknown, contexto?: string): NoModelo; processor: { toView(html: string): unknown } };
}

/** O que o dialogo monta: `src` + atributos + estilos (CSS por declaracao, ja com `;`). */
interface Spec {
  src: string;
  attrs: Record<string, string>;
  css: string[];
}

interface Estado {
  /** Proporcao largura/altura usada pelo "Travar Proporcoes". */
  imgScal: number;
  lock: boolean;
  /** Valores que o dialogo preencheu sozinho com o tamanho natural da imagem (para saber se o usuario mexeu). */
  autoW: string;
  autoH: string;
  /** Ultima URL ja carregada na previa (`change` e `blur` disparam juntos). */
  ultimaUrl: string;
}

const MSG_SO_IMAGEM = "Escolha um arquivo de imagem.";
const MSG_SEM_IMAGEM = "Escolha uma imagem ou informe a URL.";
const MSG_URL_INVALIDA = "Informe uma URL de imagem válida (http ou https).";
const MSG_URL_NAO_CONVERTIDA =
  "Não foi possível converter a imagem da URL em base64 (o servidor da imagem não permite a cópia). Baixe a imagem e envie o arquivo.";
const MSG_BLOCO =
  "Na imagem centralizada (em bloco) o SEI 5 guarda só o tamanho e o texto alternativo. " +
  "Para margens, borda, filtro e alinhamento, escolha antes “Texto ao redor” na barra da imagem.";

/** Tamanho legivel (o `infraFormatarTamanhoBytes` do SEI). */
export function formatarTamanhoBytes(bytes: number): string {
  if (bytes > 1099511627776) return `${Math.round((bytes / 1099511627776) * 100) / 100} Tb`;
  if (bytes > 1073741824) return `${Math.round((bytes / 1073741824) * 100) / 100} Gb`;
  if (bytes > 1048576) return `${Math.round((bytes / 1048576) * 100) / 100} Mb`;
  return `${Math.round((bytes / 1024) * 100) / 100} Kb`;
}

/** Bytes de um base64 (sem decodificar); `null` se nao for base64 valido. */
export function bytesDoBase64(b64: string): number | null {
  const limpo = b64.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(limpo)) return null;
  const preenchimento = limpo.endsWith("==") ? 2 : limpo.endsWith("=") ? 1 : 0;
  return Math.floor((limpo.length * 3) / 4) - preenchimento;
}

/** Declaracoes do atributo `style` (nome -> valor), sem depender do CSSOM (que o linkedom nao tem completo). */
export function lerEstilo(el: Element): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const parte of (el.getAttribute("style") ?? "").split(";")) {
    const i = parte.indexOf(":");
    if (i < 0) continue;
    const nome = parte.slice(0, i).trim().toLowerCase();
    if (nome) mapa.set(nome, parte.slice(i + 1).trim());
  }
  return mapa;
}

/** `<img ...>` por texto: nomes fixos e valores escapados (o HTML nunca nasce de texto cru). */
function tagImg(src: string, attrs: Record<string, string>, estilo: string): string {
  let s = `<img src="${escaparHtml(src)}"`;
  for (const [nome, valor] of Object.entries(attrs)) {
    if (valor === "") {
      if (nome === "alt") s += ' alt=""';
      continue;
    }
    s += ` ${nome}="${escaparHtml(valor)}"`;
  }
  if (estilo) s += ` style="${escaparHtml(estilo)}"`;
  return `${s}>`;
}

/** Campos do dialogo: id sem prefixo, atributo da imagem, CSS (`#` = o valor), e o minimo (so os inteiros). */
const CAMPOS: ReadonlyArray<{ k: string; attr: string; css: string; minimo?: number }> = [
  { k: "width", attr: "width", css: "width:#;", minimo: 1 },
  { k: "height", attr: "height", css: "height:#;", minimo: 1 },
  { k: "maxwidth", attr: "maxwidth", css: "max-width:#;object-fit: contain;", minimo: 1 },
  { k: "maxheight", attr: "maxheight", css: "max-height:#;object-fit: contain;", minimo: 1 },
  { k: "vmargin", attr: "vspace", css: "margin-top:#;margin-bottom:#;", minimo: 0 },
  { k: "hmargin", attr: "hspace", css: "margin-left:#;margin-right:#;", minimo: 0 },
  { k: "align", attr: "align", css: "" },
  { k: "filter", attr: "filter", css: "" },
  { k: "border", attr: "border", css: "border:# solid black;", minimo: 0 },
];
const CSS_FILTRO: Record<string, string> = {
  grayscale: "filter:grayscale(1);",
  blur: "filter:blur(3px);",
  shadow: "filter:drop-shadow(2px 4px 6px black);",
  invert: "filter:invert(1);",
  sepia: "filter:sepia(1);",
};
const ALINHAMENTOS: Array<[string, string]> = [
  ["none", "Não definido"],
  ["top", "Superior"],
  ["bottom", "Inferior"],
  ["left", "Esquerda"],
  ["right", "Direita"],
];
const FILTROS: Array<[string, string]> = [
  ["none", "Não definido"],
  ["grayscale", "Escala de Cinza"],
  ["blur", "Borrado"],
  ["shadow", "Caixa Sombreada"],
  ["invert", "Cores Invertidas"],
  ["sepia", "Envelhecido"],
];

const estaMarcado = (el: HTMLInputElement | null): boolean =>
  el ? (typeof el.checked === "boolean" ? el.checked : el.hasAttribute("checked")) : false;

export const recurso: Recurso = {
  id: "image-base64",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);

    /** Qualidade configurada (%, 0 a 100); `padrao` quando o monolito nao a definiu. */
    const qualidadeConfigurada = (padrao: number): number => {
      const n = Number.parseFloat(String(w.qualidadeImagens));
      return Number.isNaN(n) ? padrao : n;
    };

    /** `new Image()` da pagina (injetavel nos testes); sem ela, um `<img>` solto. */
    const novaImagem = (): HTMLImageElement => {
      const Ctor = (c.win as unknown as { Image?: new () => HTMLImageElement }).Image;
      return Ctor ? new Ctor() : (c.doc.createElement("img") as HTMLImageElement);
    };
    const converterParaDataUri = (src: string): Promise<string> =>
      (c.imagemParaDataUri ?? ((s: string) => imagemParaDataUri(c.win as Window & typeof globalThis, s)))(src);

    // ---------- Acesso aos campos do dialogo ----------
    const campo = (box: ParentNode, id: string) => box.querySelector<HTMLInputElement>(`#${id}`);
    const ler = (box: ParentNode, id: string): string => campo(box, id)?.value ?? "";
    const colocar = (box: ParentNode, id: string, valor: string): void => {
      const el = campo(box, id);
      if (el) el.value = valor;
    };
    /** So preenche com texto nao vazio; no `<select>`, so se a opcao existir. */
    const poSe = (box: ParentNode, id: string, valor: string | null | undefined): void => {
      if (typeof valor !== "string" || valor === "") return;
      const el = campo(box, id);
      if (!el) return;
      if (el.tagName === "SELECT" && ![...el.querySelectorAll("option")].some((o) => o.getAttribute("value") === valor)) return;
      el.value = valor;
    };
    const carregando = (box: ParentNode, texto: string): void => {
      const el = box.querySelector("#b64_loading");
      if (el) el.textContent = texto;
    };

    // ---------- Dimensoes ----------
    function lerDimensoes(box: ParentNode) {
      const bruto = (id: string) => ler(box, id);
      const num = (v: string) => {
        const n = Number.parseInt(v, 10);
        return Number.isNaN(n) ? 0 : n;
      };
      const [rw, rh] = [bruto("b64_width"), bruto("b64_height")];
      return { w: num(rw), h: num(rh), uw: rw.includes("%") ? "%" : "px", uh: rh.includes("%") ? "%" : "px" };
    }

    /** Recalcula largura/altura mantendo a proporcao. */
    function recalcular(box: ParentNode, estado: Estado, origem: "width" | "height"): void {
      const o = lerDimensoes(box);
      let unidade = "px";
      if (origem === "width") {
        if (o.uw === "%") unidade = "%";
        o.h = Math.round(o.w / estado.imgScal);
      } else {
        if (o.uh === "%") unidade = "%";
        o.w = Math.round(o.h * estado.imgScal);
      }
      colocar(box, "b64_width", unidade === "%" ? `${o.w}%` : String(o.w));
      colocar(box, "b64_height", unidade === "%" ? `${o.h}%` : String(o.h));
    }

    /** Normaliza o campo para inteiro, mantendo o "%". */
    function normalizarInteiro(box: ParentNode, id: string): void {
      const v = ler(box, id);
      const n = Number.parseInt(v, 10);
      colocar(box, id, `${Number.isNaN(n) ? 0 : n}${v.includes("%") ? "%" : ""}`);
    }

    // ---------- Previa ----------
    function carregarPrevia(box: ParentNode, estado: Estado, src: string): void {
      if (typeof src !== "string" || !src) {
        carregando(box, "");
        return;
      }
      const preview = box.querySelector("#b64_preview");
      const img = novaImagem();
      carregando(box, "Carregando...");
      img.onload = () => {
        carregando(box, "");
        const larg = img.naturalWidth || img.width || 0;
        const alt = img.naturalHeight || img.height || 0;
        // largura/altura ainda vazias: usa o tamanho natural (e a proporcao dele para o "Travar Proporcoes")
        const semLarg = !ler(box, "b64_width");
        const semAlt = !ler(box, "b64_height");
        if (semLarg) {
          colocar(box, "b64_width", String(larg));
          estado.autoW = String(larg);
        }
        if (semAlt) {
          colocar(box, "b64_height", String(alt));
          estado.autoH = String(alt);
        }
        if (semLarg && semAlt && larg > 0 && alt > 0) estado.imgScal = larg / alt;
        img.classList.add("previewImage");
        img.setAttribute("alt", "");
        if (!img.getAttribute("data-width")) img.setAttribute("data-width", String(larg));
        if (!img.getAttribute("data-height")) img.setAttribute("data-height", String(alt));
        preview?.append(img);
      };
      img.onerror = () => carregando(box, "");
      img.onabort = () => carregando(box, "");
      img.src = src;
      // fora do documento (URL): embute como data URI; se o servidor nao permitir, a previa fica com a URL e a insercao a recusa
      if (!/^data:/i.test(src)) {
        void converterParaDataUri(src).then(
          (dataUri) => {
            img.setAttribute("src", dataUri);
          },
          () => {},
        );
      }
    }

    /** Le os arquivos de imagem e gera as previas. */
    function tratarArquivos(box: ParentNode, estado: Estado, arquivos: ArrayLike<File> | null | undefined): void {
      if (!arquivos?.length) return;
      carregando(box, "Carregando...");
      const Leitor = (c.win as unknown as { FileReader?: new () => FileReader }).FileReader;
      let lendo = false;
      let recusado = false;
      for (const f of Array.from(arquivos)) {
        if (f?.type && !/image.*/.test(f.type)) {
          recusado = true;
          continue;
        }
        if (!Leitor) continue;
        lendo = true;
        const fr = new Leitor();
        fr.onload = () => {
          carregando(box, "");
          carregarPrevia(box, estado, String(fr.result ?? ""));
        };
        fr.onerror = () => carregando(box, "");
        fr.onabort = () => carregando(box, "");
        try {
          fr.readAsDataURL(f);
        } catch {
          carregando(box, "");
        }
      }
      if (!lendo) {
        carregando(box, "");
        if (recusado) avisar(MSG_SO_IMAGEM);
      }
    }

    // ---------- Imagem selecionada ----------
    function imagemSelecionada(ed: Editor): Element | null {
      const el = A.getSelectionElement(ed);
      if (el?.tagName && el.tagName.toLowerCase() === "img") return el;
      // cursor logo apos/dentro de um wrapper de imagem
      return el?.querySelector?.("img") ?? null;
    }

    function preencherDaImagem(box: ParentNode, estado: Estado, img: Element): void {
      const src = img.getAttribute("src");
      const natural = img as unknown as { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number };
      if (typeof src === "string" && src.startsWith("data:")) {
        const bytes = bytesDoBase64(src.slice(src.indexOf(",") + 1));
        const rotulo = box.querySelector("#b64_imglength");
        if (bytes !== null && rotulo) rotulo.textContent = `Tamanho da imagem: ${formatarTamanhoBytes(bytes)}`;
      }

      let largura: string | null = img.getAttribute("width");
      let altura: string | null = img.getAttribute("height");
      if ((largura === null || altura === null) && natural.naturalWidth) {
        largura = String(natural.width || natural.naturalWidth);
        altura = String(natural.height || natural.naturalHeight || "");
      }
      if (largura !== null && altura !== null) {
        colocar(box, "b64_width", largura);
        colocar(box, "b64_height", altura);
        const lw = Number.parseInt(largura, 10);
        const lh = Number.parseInt(altura, 10);
        estado.imgScal = !Number.isNaN(lw) && !Number.isNaN(lh) && lh > 0 && lw > 0 ? lw / lh : 1;
      }

      if (typeof src === "string") {
        if (src.startsWith("data:")) carregarPrevia(box, estado, src);
        else {
          colocar(box, "b64_url", src);
          estado.ultimaUrl = src;
        }
      }

      poSe(box, "b64_alt", img.getAttribute("alt"));
      poSe(box, "b64_hmargin", img.getAttribute("hspace"));
      poSe(box, "b64_vmargin", img.getAttribute("vspace"));
      poSe(box, "b64_border", img.getAttribute("border"));
      poSe(box, "b64_maxwidth", img.getAttribute("maxwidth"));
      poSe(box, "b64_maxheight", img.getAttribute("maxheight"));
      poSe(box, "b64_filter", img.getAttribute("filter"));

      const q = img.getAttribute("quality");
      if (typeof q === "string" && q !== "") {
        const n = Math.round(Number.parseFloat(q) * 100);
        if (!Number.isNaN(n)) colocar(box, "b64_quality", String(n));
      }

      switch (img.getAttribute("align")) {
        case "top":
        case "text-top":
          colocar(box, "b64_align", "top");
          break;
        case "baseline":
        case "bottom":
        case "text-bottom":
          colocar(box, "b64_align", "bottom");
          break;
        case "left":
          colocar(box, "b64_align", "left");
          break;
        case "right":
          colocar(box, "b64_align", "right");
          break;
      }
    }

    /** SEI 5: a formatacao fica no `<span style>` em volta do widget da imagem. */
    function preencherEstilosCk5(box: ParentNode, img: Element): void {
      const widget = img.closest?.(".ck-widget");
      const pai = widget?.parentElement;
      if (pai?.tagName !== "SPAN" || !pai.getAttribute("style")) return;
      const st = lerEstilo(pai);
      const px = (v: string | undefined) => {
        const n = Number.parseInt(v ?? "", 10);
        return Number.isNaN(n) ? "" : String(n);
      };
      const borda = st.get("border");
      const [larguraBorda, estiloBorda] = borda ? borda.split(/\s+/) : [st.get("border-top-width"), st.get("border-top-style")];
      if (estiloBorda && estiloBorda !== "none") poSe(box, "b64_border", px(larguraBorda));
      poSe(box, "b64_hmargin", px(st.get("margin-left")));
      poSe(box, "b64_vmargin", px(st.get("margin-top")));
      poSe(box, "b64_maxwidth", px(st.get("max-width")));
      poSe(box, "b64_maxheight", px(st.get("max-height")));
      const f = st.get("filter") ?? "";
      const filtro = /invert/.test(f)
        ? "invert"
        : /grayscale/.test(f)
          ? "grayscale"
          : /blur/.test(f)
            ? "blur"
            : /drop-shadow/.test(f)
              ? "shadow"
              : /sepia/.test(f)
                ? "sepia"
                : "";
      poSe(box, "b64_filter", filtro);
      const flutua = st.get("float");
      const vertical = st.get("vertical-align");
      poSe(
        box,
        "b64_align",
        flutua === "left" || flutua === "right" ? flutua : vertical === "top" || vertical === "bottom" ? vertical : "",
      );
    }

    // ---------- Montagem do que vai para o documento ----------
    /** Atributos + CSS a partir dos campos do dialogo. `null` se a previa nao tem `src`. */
    function montarSpec(box: ParentNode, estado: Estado, previa: Element, selecionada: Element | null): Spec | null {
      const src = previa.getAttribute("src");
      if (typeof src !== "string" || src === "") return null;
      const dataW = previa.getAttribute("data-width");
      const dataH = previa.getAttribute("data-height");
      const spec: Spec = { src, attrs: { alt: ler(box, "b64_alt").trim() }, css: [] };
      let maxLarg = false;
      let maxAlt = false;

      for (const { k, attr, css, minimo } of CAMPOS) {
        const bruto = ler(box, `b64_${k}`);
        let valor: string | null = bruto;
        let atributo = bruto;
        let cssValor = bruto;
        let modelo = css;
        if (k === "align") {
          if (bruto === "top" || bruto === "bottom") modelo = "vertical-align:#;";
          else if (bruto === "left" || bruto === "right") modelo = "float:#;";
          else valor = null;
        } else if (k === "filter") {
          if (CSS_FILTRO[bruto]) modelo = CSS_FILTRO[bruto];
          else valor = null;
        }
        if (minimo !== undefined) {
          const n = Number.parseInt(bruto, 10);
          if (Number.isNaN(n) || n < minimo) valor = null;
          else if (bruto.includes("%")) {
            atributo = `${n}%`;
            cssValor = `${n}%`;
          } else {
            atributo = String(n);
            cssValor = `${n}px`;
          }
        }
        if (valor === null) continue;
        // imagem nova com o tamanho que o dialogo preencheu sozinho: cada arquivo mantem o seu tamanho natural
        if (k === "width" && dataW && !selecionada && bruto === estado.autoW) spec.attrs.width = dataW;
        else if (k === "height" && dataH && !selecionada && bruto === estado.autoH) spec.attrs.height = dataH;
        else {
          spec.attrs[attr] = atributo;
          spec.css.push(modelo.replace(/#/g, cssValor));
          if (k === "maxwidth") maxLarg = true;
          if (k === "maxheight") maxAlt = true;
        }
      }
      // max-width descarta height; max-height descarta width
      if (maxLarg) delete spec.attrs.height;
      if (maxAlt) delete spec.attrs.width;

      const configurada = qualidadeConfigurada(60);
      const digitada = ler(box, "b64_quality").trim();
      let q = digitada !== "" ? Number.parseInt(digitada, 10) * 0.01 : configurada * 0.01;
      if (Number.isNaN(q)) q = configurada * 0.01;
      q = Math.round(Math.min(1, Math.max(0, q)) * 100) / 100;
      if (configurada > 0) spec.attrs.quality = String(q);
      return spec;
    }

    /** SEI 5: HTML no formato que o CK5 preserva (ver o cabecalho). `comSpan=false`: imagem em bloco. */
    function htmlCk5(spec: Spec, comSpan: boolean): { html: string; estilos: string[] } {
      const larg = spec.attrs.width;
      const estiloImg = larg ? `width:${/%$/.test(larg) ? larg : `${Number.parseInt(larg, 10)}px`};` : "";
      const img = tagImg(spec.src, { alt: spec.attrs.alt ?? "" }, estiloImg);
      // borda/margem zero nao entram: sem elas o span some quando o usuario remove a formatacao
      const estilos = spec.css
        .filter((d) => !/^(width|height):/.test(d) && !/^(border|margin)[^:]*:0(px|%)?[ ;]/.test(d))
        .map((d) => d.replace(/object-fit:\s*contain;?/g, ""))
        .filter((d) => d);
      if (!comSpan || !estilos.length) return { html: img, estilos };
      if (estilos.some((d) => /^(margin|border)/.test(d))) estilos.unshift("display:inline-block;");
      return { html: `<span style="${escaparHtml(estilos.join(""))}">${img}</span>`, estilos };
    }

    /** Recompressao em JPEG por canvas (o `qualityImages` do monolito, que no CK4 troca o `src` direto no DOM). */
    function comprimir(src: string, q: number): Promise<string> {
      return new Promise((resolve) => {
        if (!/^data:image\/(png|jpe?g|webp|bmp)/i.test(src) || !(q > 0 && q < 1)) return resolve(src);
        const tmp = novaImagem();
        tmp.onload = () => {
          try {
            const canvas = c.doc.createElement("canvas") as HTMLCanvasElement;
            canvas.width = tmp.naturalWidth;
            canvas.height = tmp.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(src);
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tmp, 0, 0);
            const saida = canvas.toDataURL("image/jpeg", q);
            resolve(saida.length < src.length ? saida : src);
          } catch {
            resolve(src);
          }
        };
        tmp.onerror = () => resolve(src);
        tmp.onabort = () => resolve(src);
        tmp.src = src;
      });
    }

    /** Elemento do model da imagem do DOM (CK5), ou null. */
    function modeloDaImagem(ed: EditorCk5, img: Element): NoModelo | null {
      try {
        const widget = img.closest?.(".ck-widget");
        const visao = widget ? ed.editing.view.domConverter.mapDomToView(widget) : null;
        return visao ? ed.editing.mapper.toModelElement(visao) : null;
      } catch {
        return null;
      }
    }

    /**
     * CK5: o DOM da imagem e so a vista (setAttribute nela nao entra no model e se perde ao salvar). Converte o HTML do dialogo
     * num elemento do mesmo tipo (imageInline/imageBlock) e copia os atributos dele para a imagem do model.
     */
    function atualizarImagemCk5(ed: EditorCk5, selecionada: Element, html: string): boolean {
      try {
        const modelEl = modeloDaImagem(ed, selecionada);
        if (!modelEl || !/^image/.test(modelEl.name)) return false;
        const contexto = modelEl.name === "imageBlock" ? "$root" : "$block";
        const frag = ed.data.toModel(ed.data.processor.toView(html), contexto);
        let novo = null as NoModelo | null;
        const procurar = (n: NoModelo): void => {
          if (novo || !n.is?.("element")) return;
          if (/^image/.test(n.name)) {
            novo = n;
            return;
          }
          for (const f of n.getChildren()) procurar(f);
        };
        for (const f of frag.getChildren()) procurar(f);
        const achado = novo as NoModelo | null;
        if (!achado) return false;
        ed.model.change((writer) => {
          if (achado.name !== modelEl.name) {
            ed.model.insertContent(frag, ed.model.createRangeOn(modelEl));
            return;
          }
          const manter = new Set<string>();
          for (const [k] of achado.getAttributes()) manter.add(k);
          for (const antigo of Array.from(modelEl.getAttributeKeys())) if (!manter.has(antigo)) writer.removeAttribute(antigo, modelEl);
          for (const [k, v] of achado.getAttributes()) writer.setAttribute(k, v, modelEl);
        });
        return true;
      } catch (e) {
        console.warn("[SEIPro] Formatar imagem (SEI 5):", e instanceof Error ? e.message : e);
        return false;
      }
    }

    async function aplicarCk5(ed: Editor, spec: Spec, selecionada: Element | null): Promise<void> {
      const ck5 = ed as unknown as EditorCk5;
      const modelEl = selecionada ? modeloDaImagem(ck5, selecionada) : null;
      const emBloco = modelEl?.name === "imageBlock";
      // recomprime so imagem nova ou trocada: reformatar a mesma imagem nao a degrada de novo
      const trocada = !selecionada || selecionada.getAttribute("src") !== spec.src;
      const q = trocada ? Number.parseFloat(spec.attrs.quality ?? "") : Number.NaN;
      spec.src = await comprimir(spec.src, q);
      const r = htmlCk5(spec, !emBloco);
      if (selecionada && atualizarImagemCk5(ck5, selecionada, r.html)) {
        if (emBloco && r.estilos.length) avisar(MSG_BLOCO);
        return;
      }
      A.withEdit(ed, () => A.insertHtml(ed, r.html));
    }

    function aplicarCk4(ed: Editor, spec: Spec, selecionada: Element | null): void {
      A.withEdit(ed, () => {
        if (selecionada && typeof selecionada.setAttribute === "function") {
          // atualiza a imagem selecionada no lugar
          selecionada.setAttribute("src", spec.src);
          for (const [nome, valor] of Object.entries(spec.attrs)) if (valor !== "") selecionada.setAttribute(nome, valor);
          if (spec.css.length) selecionada.setAttribute("style", spec.css.join(""));
        } else A.insertElement(ed, tagImg(spec.src, spec.attrs, spec.css.join("")));
      });
      // compressao do monolito nas imagens ainda nao tratadas
      const configurada = qualidadeConfigurada(0);
      if (configurada > 0 && typeof w.qualityImages === "function") {
        setTimeout(() => {
          try {
            for (const img of A.findInBody(ed, "img")) {
              if (img.getAttribute("data-cke-quality-applied")) continue;
              const qAttr = img.getAttribute("quality");
              w.qualityImages?.(img, img, qAttr ? Number.parseFloat(qAttr) : configurada * 0.01);
              img.setAttribute("data-cke-quality-applied", "1");
            }
          } catch {
            // sem a compressao a imagem entra do mesmo jeito
          }
        }, 0);
      }
    }

    async function aplicar(ed: Editor, spec: Spec, selecionada: Element | null): Promise<void> {
      if (A.versao === 5 && "model" in ed) await aplicarCk5(ed, spec, selecionada);
      else aplicarCk4(ed, spec, selecionada);
    }

    /** Insere (ou reformata) o que esta na previa. `true` quando o dialogo pode fechar. */
    async function inserirDaPrevia(box: ParentNode, estado: Estado, ed: Editor, selecionada: Element | null): Promise<boolean> {
      // secao somente leitura: o adaptador recusa (e avisa); o dialogo continua aberto para nao perder o trabalho
      if (A.somenteLeitura(ed)) {
        A.recusarEscrita();
        return false;
      }
      const previas = [...box.querySelectorAll("#b64_preview img.previewImage")];
      if (!previas.length) {
        // so a URL preenchida, sem previa carregada
        const url = ler(box, "b64_url").trim();
        if (!url) {
          avisar(MSG_SEM_IMAGEM);
          return false;
        }
        if (!urlHttpValida(url) && !/^data:image\//i.test(url)) {
          avisar(MSG_URL_INVALIDA);
          return false;
        }
        const img = c.doc.createElement("img");
        img.setAttribute("src", url);
        const spec = montarSpec(box, estado, img, selecionada);
        if (spec) await aplicar(ed, spec, selecionada);
        return true;
      }
      let inseriu = false;
      for (const previa of previas) {
        // URL http que nao virou base64 (o servidor nao permite a copia): fica de fora
        if (urlHttpValida(previa.getAttribute("src") ?? "")) continue;
        const spec = montarSpec(box, estado, previa, selecionada);
        if (!spec) continue;
        await aplicar(ed, spec, selecionada);
        inseriu = true;
      }
      if (!inseriu) {
        avisar(MSG_URL_NAO_CONVERTIDA);
        return false;
      }
      return true;
    }

    // ---------- Dialogo ----------
    const entrada = (id: string, extra: Record<string, string> = {}) => h("input", { type: "text", id, autocomplete: "off", ...extra });
    const seletor = (id: string, opcoes: Array<[string, string]>) =>
      h("select", { id }, ...opcoes.map(([valor, texto]) => h("option", { value: valor }, texto)));

    function openDialogUploadImgBase64(editorOuRef?: unknown, imgInformada?: unknown): void {
      const instancia =
        editorOuRef !== null &&
        typeof editorOuRef === "object" &&
        ("model" in editorOuRef || "insertElement" in editorOuRef || "getSelection" in editorOuRef);
      const ed: Editor | null = instancia ? (editorOuRef as Editor) : A.getInstance((editorOuRef as Element | null | undefined) ?? null);
      if (!ed) return;

      const aceitaArquivos = typeof (c.win as unknown as { FileReader?: unknown }).FileReader !== "undefined";
      const informada = imgInformada && (imgInformada as Node).nodeType === 1 ? (imgInformada as Element) : null;
      const selecionada = informada ?? imagemSelecionada(ed);
      const estado: Estado = { imgScal: 1, lock: true, autoW: "", autoH: "", ultimaUrl: "" };

      // --- aba Imagem ---
      const urlCampo = entrada("b64_url", { spellcheck: "false", placeholder: "https://…" });
      const urlMarca = aceitaArquivos ? caixa({ id: "b64_urlcheckbox" }, "URL da Imagem:") : null;
      const fonte: HTMLElement[] = [];
      let zona: HTMLElement | null = null;
      let arquivo: HTMLInputElement | null = null;
      if (aceitaArquivos) {
        arquivo = h("input", { type: "file", id: "b64_file", accept: "image/*", multiple: true, style: "display:none;" });
        const seletorDeArquivos = arquivo;
        zona = h(
          "div",
          {
            id: "b64_dropzone",
            class: "spro-zona dropFilePro",
            role: "button",
            tabindex: "0",
            ...comoBotao((ev) => {
              // o clique do proprio seletor sobe ate a zona: ignora
              if ((ev.target as Element | null)?.getAttribute?.("id") === "b64_file") return;
              if (typeof seletorDeArquivos.click === "function") seletorDeArquivos.click();
            }),
          },
          h("span", {}, "Arraste arquivos para cá ou clique para selecionar"),
          arquivo,
        );
        fonte.push(grupo(null, {}, caixa({ id: "b64_filecheckbox", checked: "checked" }, "Navegar neste computador:"), zona));
        fonte.push(grupo(null, { para: "b64_url" }, urlMarca as HTMLElement, urlCampo));
      } else fonte.push(grupo("URL da Imagem:", { para: "b64_url" }, urlCampo));

      const painelImagem = formulario(
        ...fonte,
        h("div", { id: "b64_loading", class: "spro-dica", role: "status", "aria-live": "polite" }),
        h("div", { id: "b64_preview", class: "spro-previa lista dropFilePro", "data-vazio": "Nenhuma imagem selecionada" }),
      );
      painelImagem.id = "b64TabSource";

      // --- aba Propriedades ---
      const larg = entrada("b64_width");
      const alt = entrada("b64_height");
      const qualidade = h("input", {
        type: "number",
        id: "b64_quality",
        min: "1",
        max: "100",
        value: String(qualidadePadrao(w.qualidadeImagens)),
      });
      const painelProps = formulario(
        grupo("Texto Alternativo", { para: "b64_alt", largo: true }, entrada("b64_alt")),
        grade(
          "tres",
          grupo("Largura", { para: "b64_width" }, larg),
          grupo("Altura", { para: "b64_height" }, alt),
          grupo(null, {}, caixa({ id: "b64_lock", checked: "checked" }, "Travar Proporções")),
        ),
        grade(
          "tres",
          grupo("Margem Vertical", { para: "b64_vmargin" }, entrada("b64_vmargin", { value: "0" })),
          grupo("Margem Horizontal", { para: "b64_hmargin" }, entrada("b64_hmargin", { value: "0" })),
          grupo("Borda", { para: "b64_border" }, entrada("b64_border", { value: "0" })),
        ),
        grade(
          "tres",
          grupo("Largura Máxima", { para: "b64_maxwidth" }, entrada("b64_maxwidth", { value: "0" })),
          grupo("Altura Máxima", { para: "b64_maxheight" }, entrada("b64_maxheight", { value: "0" })),
          grupo("Alinhamento", { para: "b64_align" }, seletor("b64_align", ALINHAMENTOS)),
        ),
        grade(
          "tres",
          grupo("Qualidade da Imagem (1 = baixa / 100 = alta)", { para: "b64_quality" }, qualidade),
          grupo("Filtro", { para: "b64_filter" }, seletor("b64_filter", FILTROS)),
          grupo(null, {}, h("div", { id: "b64_imglength", class: "spro-dica" })),
        ),
      );
      painelProps.id = "b64TabProps";

      const abas = criarAbas(
        "b64",
        [
          ["source", "Imagem"],
          ["props", "Propriedades"],
        ],
        { source: painelImagem, props: painelProps },
      );
      const botao = h("button", { type: "button", class: "spro-botao primario" }, selecionada ? "Aplicar" : "Inserir");
      const raiz = h(
        "div",
        { id: "dialogUploadImgBase64Pro", class: "spro-form seipro-b64-dialog" },
        h("div", { id: "b64Tabs" }, abas.barra, h("div", {}, ...abas.paineis)),
        h("div", { class: "spro-dialogo-rodape" }, botao),
      );

      // --- eventos ---
      if (zona && arquivo) {
        zona.addEventListener("dragover", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        });
        zona.addEventListener("drop", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          tratarArquivos(raiz, estado, (ev as DragEvent).dataTransfer?.files);
        });
        arquivo.addEventListener("change", () => tratarArquivos(raiz, estado, arquivo?.files));
      }
      const aoMudarUrl = () => {
        const v = urlCampo.value.trim();
        if (urlMarca) {
          const marca = urlMarca.querySelector("input");
          if (marca) {
            if (typeof marca.checked === "boolean") marca.checked = !!v;
            else if (v) marca.setAttribute("checked", "checked");
            else marca.removeAttribute("checked");
          }
        }
        if (!v || v === estado.ultimaUrl) return;
        estado.ultimaUrl = v;
        carregarPrevia(raiz, estado, v);
      };
      urlCampo.addEventListener("change", aoMudarUrl);
      urlCampo.addEventListener("blur", aoMudarUrl);

      campo(raiz, "b64_lock")?.addEventListener("change", () => {
        estado.lock = estaMarcado(campo(raiz, "b64_lock"));
        if (estado.lock) recalcular(raiz, estado, "width");
      });
      for (const ev of ["input", "keyup"]) {
        larg.addEventListener(ev, () => estado.lock && recalcular(raiz, estado, "width"));
        alt.addEventListener(ev, () => estado.lock && recalcular(raiz, estado, "height"));
        for (const id of ["b64_vmargin", "b64_hmargin", "b64_border", "b64_maxwidth", "b64_maxheight"])
          campo(raiz, id)?.addEventListener(ev, () => normalizarInteiro(raiz, id));
      }

      // pre-preenche a partir da imagem selecionada
      if (selecionada) {
        preencherDaImagem(raiz, estado, selecionada);
        if (A.versao === 5) preencherEstilosCk5(raiz, selecionada);
      }

      botao.addEventListener("click", () => {
        if (botao.hasAttribute("disabled")) return;
        botao.setAttribute("disabled", "");
        void inserirDaPrevia(raiz, estado, ed, selecionada)
          .then((fechar) => {
            if (fechar) dialogo.fechar();
          })
          .catch((e) => avisar(`Não foi possível inserir a imagem: ${e instanceof Error ? e.message : String(e)}`))
          .finally(() => botao.removeAttribute("disabled"));
      });

      const dialogo = abrirDialogo(c.doc, { titulo: "Imagem", largura: 760, conteudo: raiz });
      abas.selecionar(selecionada ? "props" : "source");
    }

    return {
      /** Compat com o `initFunctions` do legado: o dialogo abre sob demanda, entao nao ha o que preparar. */
      initDialogUploadImgBase64: () => {},
      getDialogUploadImgBase64: () => {},
      openDialogUploadImgBase64,
    };
  },
};
