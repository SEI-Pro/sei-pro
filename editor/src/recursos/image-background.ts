import { h } from "@comum/ui/dom";
import type { Editor } from "../adaptador/tipos";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { botaoTexto, caixa, campoComSufixo, formulario, grade, grupo } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Imagem de fundo da pagina (porte de `image-background.js`): o dialogo carrega uma imagem (PNG, JPG ou SVG),
 * mostra a previa da pagina ao vivo e grava no INICIO do documento um paragrafo-ancora `.imgBgAncora` com um
 * `<style>` (`@page`/`@media print`) que aplica fundo, margens, fonte, escala, cabecalho e rodape na impressao.
 *
 * Os formatos de HTML/CSS gerados NAO mudam: documentos antigos continuam sendo lidos por `getImagemBgOnEditor`
 * (a configuracao fica nos `data-*` da ancora e a imagem no `url(...)` do `<style>`).
 *
 * Armadilha do CK5 (por isso o rotulo visivel): o `<style>` vira um raw element invisivel e sem widget; um `<p>` que
 * so tenha o `<style>` fica com altura zero, sem cursor, e nao da para apagar. O rotulo vem ANTES do `<style>` e
 * `normalizeImgBgAncora` o devolve a documentos que ja foram salvos sem ele.
 */

/** O rotulo e o titulo de recuperacao sao texto que o SEI grava: nao mudar. */
export const ROTULO_ANCORA = "🖨️ * CONFIGURAÇÕES DE IMPRESSÃO";
const TITULO_RECUPERADO = "Configurações de impressão (rótulo recuperado pelo SEI Pro)";
const SELETOR_STYLE = 'style[data-style="seipro-imagebg-print"]';
const ID_DIALOGO = "dialogPageImageBackground";

type Opcao = readonly [valor: string, rotulo: string];

const LAYOUTS: readonly Opcao[] = [
  ["landscape", "Paisagem"],
  ["portrait", "Retrato"],
];
const PAPEIS: readonly Opcao[] = [
  ["A5", "A5"],
  ["A4", "A4"],
  ["A3", "A3"],
  ["tabloid", "Tabloid"],
  ["letter", "Letter"],
  ["legal", "Legal"],
];
const MARGENS: readonly Opcao[] = [
  ["3cm 2cm 3cm 2cm", "Padrão (3cm 2cm)"],
  ["0cm", "Nenhuma (0cm)"],
  ["1cm 1cm 1cm 1cm", "Mínima (1cm)"],
];
const PADDINGS: readonly Opcao[] = [
  ["3cm 2cm 3cm 2cm", "Padrão (3cm 2cm)"],
  ["0cm", "Nenhuma (0cm)"],
  ["1cm 1cm 1cm 1cm", "Mínima (1cm)"],
];
const FONTES: readonly string[] = [
  "Helvetica",
  "Arial",
  "Arial Black",
  "Calibri",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Impact",
  "Gill Sans",
  "Times New Roman",
  "Georgia",
  "Palatino",
  "Baskerville",
  "Andalé Mono",
  "Courier",
  "Lucida",
  "Monaco",
  "Bradley Hand",
  "Brush Script MT",
  "Luminari",
  "Comic Sans MS",
];
const POSICOES: readonly Opcao[] = [
  ["top center", "Topo Centralizada ∸"],
  ["top right", "Top Direito ◳"],
  ["top left", "Top Esquerdo ◰"],
  ["bottom center", "Inferior Centralizado ⩦"],
  ["bottom right", "Inferior Direito ◲"],
  ["bottom left", "Inferior Esquerdo ◱"],
  ["center center", "Meio Direito ⟥"],
  ["center left", "Meio Esquerdo ⟤"],
];
const DISPOSICOES: readonly Opcao[] = [
  ["cover", "Capa (cover)"],
  ["contain", "Contida (contain)"],
];
const REPETICOES: readonly Opcao[] = [
  ["no-repeat", "Sem repetição"],
  ["repeat-x", "Repetição horizontal"],
  ["repeat-y", "Repetição vertical"],
  ["repeat", "Repetição vertical e horizontal"],
  ["round", "Comprimida ou estivada"],
  ["space", "Repetição em corte"],
];
const UTILIZACOES: readonly Opcao[] = [
  ["background", "Imagem de fundo"],
  ["page_cover", "Imagem como capa de livro"],
];

/** A configuracao gravada nos `data-*` da ancora (os nomes seguem o legado). */
export interface ConfigImgBg {
  primeirapg: boolean;
  cabecalho: string;
  rodape: string;
  visivel: boolean;
  reducao: boolean;
  layout: string;
  papel: string;
  margem: string;
  padding: string;
  escala: string;
  fonte: string;
  posicao: string;
  disposicao: string;
  utilizacao: string;
  repeticao: string;
}

/** Os valores de "Restaurar padroes" (e do que falta numa ancora antiga). */
export const PADRAO_IMGBG: Readonly<ConfigImgBg> = {
  primeirapg: false,
  cabecalho: "",
  rodape: "",
  visivel: true,
  reducao: true,
  layout: "portrait",
  papel: "A4",
  margem: "0cm",
  padding: "3cm 2cm 3cm 2cm",
  escala: "100",
  fonte: "Calibri",
  posicao: "top center",
  disposicao: "contain",
  utilizacao: "background",
  repeticao: "no-repeat",
};

/** Largura x altura da previa em px (retrato); a paisagem inverte. */
const TAMANHOS_PAGINA: Record<string, readonly [number, number]> = {
  A5: [148, 210],
  A4: [210, 297],
  A3: [297, 420],
  tabloid: [279, 432],
  letter: [215.9, 279.4],
  legal: [216, 356],
};

/** Altura do `padding-top` que faz a capa ocupar a folha toda (impressao). */
const ALTURA_CAPA: Record<string, string> = {
  "A4 landscape": "21cm",
  "A4 portrait": "29.7cm",
  "letter landscape": "21.59cm",
  "letter portrait": "27.94cm",
  "legal landscape": "21.6cm",
  "legal portrait": "35.6cm",
  "tabloid landscape": "27.9cm",
  "tabloid portrait": "43.2cm",
  "A5 landscape": "14.8cm",
  "A5 portrait": "21cm",
  "A3 landscape": "29.7cm",
  "A3 portrait": "42cm",
};

const LOREM: readonly string[] = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut mi lacus. Nulla et metus finibus, pretium enim at, ultrices dui. Aliquam ut mauris convallis, eleifend orci quis, pulvinar augue. Aenean ultrices malesuada ante, non tempor sem placerat in. Nunc ultrices odio ut lorem gravida volutpat. Praesent sed arcu sollicitudin, molestie urna eget, consectetur nulla. Ut sed orci mollis, consequat tortor sed, congue leo.",
  "Donec ac auctor libero, eu rutrum libero. Nunc sollicitudin felis tempor, convallis augue vitae, tincidunt elit. In quis volutpat erat. Phasellus feugiat purus porta libero vehicula sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.",
  "Sed convallis ante leo, eu rhoncus nisi dignissim a. Nullam convallis magna sed magna consectetur, nec gravida velit suscipit. Donec sit amet mi ut massa dapibus imperdiet nec quis eros. Vestibulum fringilla mattis metus at lobortis.",
];

const valoresDe = (ops: readonly Opcao[]): string[] => ops.map((o) => o[0]);
const escolhaValida = (v: unknown, validos: readonly string[], padrao: string): string =>
  typeof v === "string" && validos.includes(v) ? v : padrao;

/** Escala em % (numero positivo); qualquer outra coisa volta a 100 (o valor entra no CSS gravado no documento). */
export function escalaValida(v: unknown): string {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && n > 0 && n <= 1000 ? String(n) : PADRAO_IMGBG.escala;
}

/** Cada campo volta a um valor que o dialogo oferece (a ancora de um documento pode trazer lixo); texto e booleanos como vieram. */
export function normalizarConfig(p: Partial<Record<keyof ConfigImgBg, unknown>>): ConfigImgBg {
  const d = PADRAO_IMGBG;
  const bool = (v: unknown, padrao: boolean) => (typeof v === "boolean" ? v : padrao);
  const texto = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
  return {
    primeirapg: bool(p.primeirapg, d.primeirapg),
    cabecalho: texto(p.cabecalho),
    rodape: texto(p.rodape),
    visivel: bool(p.visivel, d.visivel),
    reducao: bool(p.reducao, d.reducao),
    layout: escolhaValida(p.layout, valoresDe(LAYOUTS), d.layout),
    papel: escolhaValida(p.papel, valoresDe(PAPEIS), d.papel),
    margem: escolhaValida(p.margem, valoresDe(MARGENS), d.margem),
    padding: escolhaValida(p.padding, valoresDe(PADDINGS), d.padding),
    escala: escalaValida(p.escala),
    fonte: escolhaValida(p.fonte, FONTES, d.fonte),
    posicao: escolhaValida(p.posicao, valoresDe(POSICOES), d.posicao),
    disposicao: escolhaValida(p.disposicao, valoresDe(DISPOSICOES), d.disposicao),
    utilizacao: escolhaValida(p.utilizacao, valoresDe(UTILIZACOES), d.utilizacao),
    repeticao: escolhaValida(p.repeticao, valoresDe(REPETICOES), d.repeticao),
  };
}

/** Largura x altura (px) da previa para o papel e o layout. */
export function dimensoesPagina(papel: string, layout: string): [number, number] {
  const [l, a] = TAMANHOS_PAGINA[papel] ?? (TAMANHOS_PAGINA.A4 as readonly [number, number]);
  return layout === "landscape" ? [a, l] : [l, a];
}

/** Texto entre aspas de uma propriedade `content` do CSS: aspas, barra e quebras de linha escapadas, e `<` para nunca fechar o `<style>`. */
export function textoCss(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/[\r\n]+/g, " ")
    .replace(/</g, "\\3c ");
}

/** So imagem embutida (data URI) ou http(s), sem nada que feche o `url("...")` ou o `<style>`. */
export function srcSeguro(src: string): boolean {
  return /^(data:image\/[a-z0-9.+-]+(;[a-z0-9=.+-]+)*[;,][^"'()<>\s\\]*|https?:\/\/[^"'()<>\s\\]+)$/i.test(src);
}

/** O CSS que vai no `<style>` da ancora (formato do legado, byte a byte para as mesmas opcoes). */
export function montarCssImgBg(src: string, config: ConfigImgBg): string {
  const cabecalho =
    config.cabecalho === ""
      ? ""
      : `body:before { display: block; position: fixed; text-align: center; content: "${textoCss(config.cabecalho)}"; top: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }`;
  const rodape =
    config.rodape === ""
      ? ""
      : `body:after { display: block; position: fixed; text-align: center; content: "${textoCss(config.rodape)}"; bottom: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }`;
  let capa = "";
  if (config.utilizacao === "page_cover") {
    const altura = ALTURA_CAPA[`${config.papel} ${config.layout}`];
    if (altura) capa = `padding-top: ${altura} !important;`;
  }
  return (
    ".imgBgAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }" +
    " html.dark-mode .imgBgAncora, html.dark-mode .imgBgAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }" +
    ' body.cke_editable .imgBgAncora:after { content: " [delete isto para remover]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }' +
    " @media print {" +
    `   @page${config.primeirapg ? ":first" : ""} { size: ${config.papel} ${config.layout}; margin: ${config.margem}; }` +
    (config.visivel ? "" : " }") +
    `   body p, body p * { font-size: ${config.escala}% !important; font-family: ${config.fonte} !important; }` +
    "   .imgBgAncora { display: none; }" +
    `   body { padding: ${config.padding}; ${capa} background-position: ${config.posicao}; background-size: ${config.disposicao}; background-repeat: ${config.repeticao}; background-image: url("${src}"); }` +
    `   ${cabecalho}` +
    `   ${rodape}` +
    (config.visivel ? " }" : "")
  );
}

/** O `title` da ancora: resumo legivel das opcoes (uma por linha). */
export function tituloDaAncora(config: ConfigImgBg): string {
  const partes = [
    `Layout: ${config.layout === "portrait" ? "Retrato" : "Paisagem"}`,
    `Tamanho do Papel: ${config.papel}`,
    `Escala (%): ${config.escala}`,
    `Margens Externas: ${config.margem}`,
    `Margens Internas: ${config.padding}`,
    `Fonte: ${config.fonte}`,
    `Posição da Imagem: ${config.posicao}`,
    `Disposição da Imagem: ${config.disposicao}`,
    `Repetição da Imagem: ${config.repeticao}`,
    `Utilização da Imagem: ${config.utilizacao === "page_cover" ? "Imagem como capa de livro" : "Imagem de fundo"}`,
  ];
  if (config.cabecalho) partes.push(`Texto do Cabeçalho: ${config.cabecalho}`);
  if (config.rodape) partes.push(`Texto do Rodapé: ${config.rodape}`);
  partes.push(`Visível apenas ao imprimir: ${config.visivel ? "Sim" : "Não"}`);
  partes.push(`Aplicar apenas na primeira página: ${config.primeirapg ? "Sim" : "Não"}`);
  partes.push(`Reduzir qualidade da imagem: ${config.reducao ? "Sim" : "Não"}`);
  return partes.join("\n");
}

/** Le a configuracao dos `data-*` da ancora; o que faltar fica no padrao. */
export function lerConfigDaAncora(el: Element): ConfigImgBg {
  const a = (nome: string): string | undefined => el.getAttribute(`data-${nome}`) ?? undefined;
  const b = (nome: string): boolean | undefined => {
    const v = a(nome);
    return v === undefined ? undefined : v === "true";
  };
  return normalizarConfig({
    primeirapg: b("primeirapg"),
    cabecalho: a("cabecalho"),
    rodape: a("rodape"),
    visivel: b("visivel"),
    reducao: b("reducao"),
    layout: a("layout"),
    papel: a("papel"),
    margem: a("margem"),
    padding: a("padding"),
    escala: a("escala"),
    fonte: a("fonte"),
    posicao: a("posicao"),
    disposicao: a("disposicao"),
    utilizacao: a("utilizacao"),
    repeticao: a("repeticao"),
  });
}

/** O `<p>` da ancora e um paragrafo sem a ancora, com `<style>` e nenhum texto visivel (sobra de documento salvo sem o rotulo). */
export function ehAncoraOrfa(p: Element | null): boolean {
  if (!p?.querySelector) return false;
  if (p.querySelector(".imgBgAncora")) return false;
  if (!p.querySelector("style")) return false;
  // o texto do proprio <style> conta em textContent: tira antes de decidir se sobrou algo visivel
  const copia = p.cloneNode(true) as Element;
  for (const s of Array.from(copia.querySelectorAll("style"))) s.remove();
  return (copia.textContent ?? "").replace(/[\s\u00a0]/g, "") === "";
}

type Callback = (src: string, config: ConfigImgBg) => void;

interface Monolito {
  setParamEditor?(this_: Element | null): void;
  alertaBoxPro?(titulo: string, icone: string, texto: string): void;
  qualityImages?(origem: Element, destino: Element): void;
  qualidadeImagens?: unknown;
  enableButtonSavePro?(): void;
  SeiProGhs?: {
    semSujar?(fn: () => void, editor?: Editor): void;
    estaLiberado?(editor?: Editor): boolean;
  };
}

type Janela = Window & typeof globalThis & Monolito;

export const recurso: Recurso = {
  id: "image-background",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as Janela;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    /** O editor "ativo" da sessao do dialogo (no legado, a variavel `_editor`). */
    let editorAtual: Editor | null = null;

    // ---------- DOM do dialogo ----------

    const raizDe = (raiz?: ParentNode | null): ParentNode => raiz ?? c.doc.querySelector(`#${ID_DIALOGO}`) ?? c.doc;
    const campo = <T extends HTMLElement = HTMLInputElement>(raiz: ParentNode, id: string): T | null => raiz.querySelector<T>(`#${id}`);
    const valor = (raiz: ParentNode, id: string): string => campo(raiz, id)?.value ?? "";
    const definir = (raiz: ParentNode, id: string, v: string): void => {
      const el = campo(raiz, id);
      if (el) el.value = v;
    };
    const marcado = (raiz: ParentNode, id: string): boolean => {
      const el = campo(raiz, id);
      // `checked` (propriedade) reflete o clique; o atributo e so o padrao inicial. O linkedom nao tem a propriedade.
      return !!el && (typeof el.checked === "boolean" ? el.checked : el.hasAttribute("checked"));
    };
    const marcar = (raiz: ParentNode, id: string, v: boolean): void => {
      const el = campo(raiz, id);
      if (!el) return;
      el.checked = v;
      if (v) el.setAttribute("checked", "");
      else el.removeAttribute("checked");
    };

    function seletor(id: string, opcoes: readonly Opcao[], padrao: string): HTMLSelectElement {
      return h("select", { id, class: id }, ...opcoes.map(([v, t]) => h("option", { value: v, selected: v === padrao }, t)));
    }

    function montarPagina(): HTMLElement {
      const [l, a] = dimensoesPagina(PADRAO_IMGBG.papel, PADRAO_IMGBG.layout);
      const texto: Array<Node | string> = [];
      LOREM.forEach((t, i) => {
        if (i > 0) texto.push(h("br"));
        texto.push(t);
      });
      return h(
        "div",
        { class: "spro-pagina-previa" },
        h(
          "div",
          { class: "spro-previa papel" },
          h(
            "div",
            {
              id: "boxBgPreview",
              style: `text-align:left;width:${l}px;height:${a}px;margin:18px auto;background:#fff;border:1px solid rgb(204,204,204);border-radius:5px;box-shadow:rgb(219,219,219) 0px 6px 5px -5px;overflow:hidden;font-size:100%;`,
            },
            h(
              "div",
              { id: "imgBgPreview", style: "padding:30px 20px;" },
              h("p", { style: "font-family:Calibri;color:rgb(119,119,119);font-size:100%;white-space:pre-line;" }, ...texto),
            ),
          ),
        ),
      );
    }

    // ---------- Previa ----------

    /** Aplica na previa tudo que os campos dizem (tamanho da pagina, escala, fonte, posicao, disposicao, repeticao, uso, margens). */
    function atualizarPrevia(raiz: ParentNode): void {
      const pagina = campo<HTMLElement>(raiz, "boxBgPreview");
      const imagem = campo<HTMLElement>(raiz, "imgBgPreview");
      if (!pagina || !imagem) return;
      const [largura, altura] = dimensoesPagina(valor(raiz, "tipoPapel"), valor(raiz, "tipoLayout"));
      pagina.style.setProperty("width", `${largura}px`);
      pagina.style.setProperty("height", `${altura}px`);
      const p = pagina.querySelector<HTMLElement>("p");
      if (p) {
        p.style.setProperty("font-size", `${escalaValida(valor(raiz, "tipoEscala"))}%`);
        p.style.setProperty("font-family", valor(raiz, "tipoFonte"));
        p.style.setProperty("visibility", valor(raiz, "tipoUtilizacao") === "page_cover" ? "hidden" : "visible");
      }
      imagem.style.setProperty("background-position", valor(raiz, "tipoPosicao"));
      imagem.style.setProperty("background-size", valor(raiz, "tipoDisposicao"));
      imagem.style.setProperty("background-repeat", valor(raiz, "tipoRepeticao"));
      const espaco = (v: string) => (v === "3cm 2cm 3cm 2cm" ? "30px 20px" : v === "1cm 1cm 1cm 1cm" ? "10px" : "0");
      imagem.style.setProperty("padding", espaco(valor(raiz, "tipoPadding")));
      imagem.style.setProperty("margin", espaco(valor(raiz, "tipoMargem")));
    }

    /** Muda so o fundo da previa (le do upload ou da ancora). */
    function getPreviewImagePageBackground(raiz?: ParentNode | null, editor?: Editor | null): void {
      const r = raizDe(raiz);
      const imagem = campo<HTMLElement>(r, "imgBgPreview");
      getImagePageBackground(r, editor, false, (src) => {
        if (imagem && srcSeguro(src)) imagem.style.setProperty("background-image", `url("${src}")`);
      });
    }

    // ---------- Ancora no documento ----------

    /**
     * O `<style>` fica dentro do `<span>` no CK4; no CK5 o `<span>` vira atributo de texto e o `<style>` um elemento
     * proprio, e a serializacao os separa (irmaos no mesmo `<p>`). Procura nos dois lugares e, em ultimo caso,
     * pelo `data-style` no corpo inteiro.
     */
    function cssDaAncora(ed: Editor, ancora: Element | undefined): string {
      try {
        if (ancora) {
          let style = ancora.querySelector("style");
          if (!style) style = ancora.closest("p")?.querySelector("style") ?? null;
          if (style) return style.textContent ?? "";
        }
        const solto = A.findInBody(ed, SELETOR_STYLE)[0];
        if (solto) return solto.textContent ?? "";
      } catch {
        // corpo inacessivel: sem imagem
      }
      return "";
    }

    function ancoraDoCorpo(ed: Editor): HTMLElement | undefined {
      return A.findInBody(ed, ".imgBgAncora")[0];
    }

    /** Le a ancora existente, mostra a imagem e as opcoes dela na previa e devolve o `src` (ou `false`). */
    function getImagemBgOnEditor(raiz?: ParentNode | null, editor?: Editor | null): string | false {
      const ed = editor ?? editorAtual ?? A.getInstance();
      const r = raizDe(raiz);
      const imagem = campo<HTMLElement>(r, "imgBgPreview");
      if (!ed) {
        imagem?.style.setProperty("background-image", "none");
        return false;
      }
      const ancora = ancoraDoCorpo(ed);
      const config = ancora ? lerConfigDaAncora(ancora) : null;
      const achado = cssDaAncora(ed, ancora).match(/\((.*?)\)/);
      const src = achado?.[1] ? achado[1].replace(/('|")/g, "") : "";
      if (src && srcSeguro(src)) {
        imagem?.style.setProperty("background-image", `url("${src}")`);
        if (config) {
          imagem?.style.setProperty("background-position", config.posicao);
          imagem?.style.setProperty("background-size", config.disposicao);
          imagem?.style.setProperty("background-repeat", config.repeticao);
        }
        return src;
      }
      imagem?.style.setProperty("background-image", "none");
      return false;
    }

    /** Preenche os campos com a configuracao ja aplicada no documento (ou com os padroes). */
    function resetOptionsImgBg(raiz?: ParentNode | null, editor?: Editor | null): void {
      const ed = editor ?? editorAtual ?? A.getInstance();
      const r = raizDe(raiz);
      const ancora = ed ? ancoraDoCorpo(ed) : undefined;
      const cfg = ancora ? lerConfigDaAncora(ancora) : PADRAO_IMGBG;
      const arquivo = campo(r, "fileInputImportImage");
      if (arquivo) arquivo.value = "";
      definir(r, "tipoLayout", cfg.layout);
      definir(r, "tipoPapel", cfg.papel);
      definir(r, "tipoEscala", cfg.escala);
      definir(r, "tipoMargem", cfg.margem);
      definir(r, "tipoPadding", cfg.padding);
      definir(r, "tipoFonte", cfg.fonte);
      definir(r, "tipoPosicao", cfg.posicao);
      definir(r, "tipoDisposicao", cfg.disposicao);
      definir(r, "textoCabecalho", cfg.cabecalho);
      definir(r, "textoRodape", cfg.rodape);
      marcar(r, "visibleOnPrint", cfg.visivel);
      marcar(r, "onlyFirst", cfg.primeirapg);
      marcar(r, "reduceQualityImg", cfg.reducao);
      definir(r, "tipoRepeticao", cfg.repeticao);
      definir(r, "tipoUtilizacao", cfg.utilizacao);
      atualizarPrevia(r);
      if (ed) getImagemBgOnEditor(r, ed);
      getPreviewImagePageBackground(r, ed);
    }

    function lerConfigDosCampos(raiz: ParentNode): ConfigImgBg {
      return normalizarConfig({
        primeirapg: marcado(raiz, "onlyFirst"),
        cabecalho: valor(raiz, "textoCabecalho"),
        rodape: valor(raiz, "textoRodape"),
        visivel: marcado(raiz, "visibleOnPrint"),
        reducao: marcado(raiz, "reduceQualityImg"),
        layout: valor(raiz, "tipoLayout"),
        papel: valor(raiz, "tipoPapel"),
        margem: valor(raiz, "tipoMargem"),
        padding: valor(raiz, "tipoPadding"),
        escala: valor(raiz, "tipoEscala"),
        fonte: valor(raiz, "tipoFonte"),
        posicao: valor(raiz, "tipoPosicao"),
        disposicao: valor(raiz, "tipoDisposicao"),
        utilizacao: valor(raiz, "tipoUtilizacao"),
        repeticao: valor(raiz, "tipoRepeticao"),
      });
    }

    /**
     * Coleta os campos; com arquivo escolhido le a imagem (`loadImagePageBackground`) e entrega ao `callback`;
     * sem arquivo, `insert` remonta o bloco com a imagem que ja esta na ancora e, na previa, o `callback` recebe
     * essa imagem. Devolve `false` quando nao ha imagem nenhuma (nem arquivo nem ancora) ou o arquivo nao e imagem.
     */
    function getImagePageBackground(
      raiz?: ParentNode | null,
      editor?: Editor | null,
      insert = false,
      callback?: Callback | false,
    ): boolean {
      const ed = editor ?? editorAtual ?? A.getInstance();
      const r = raizDe(raiz);
      const src = ed ? getImagemBgOnEditor(r, ed) : false;
      const arquivo = campo(r, "fileInputImportImage")?.files?.[0];
      const config = lerConfigDosCampos(r);
      if (arquivo) {
        if (arquivo.type && !/^image\//i.test(arquivo.type)) {
          avisar("Escolha um arquivo de imagem.");
          return false;
        }
        loadImagePageBackground(arquivo, config, callback || undefined);
        return true;
      }
      if (insert && src) {
        templateImagePageBackground(src, config, ed);
        return true;
      }
      if (!insert && src && typeof callback === "function") {
        callback(src, config);
        return true;
      }
      return false;
    }

    /** Le o arquivo como data URI; reduz a qualidade (monolito, via canvas) quando a opcao esta ligada e entrega o `src` final. */
    function loadImagePageBackground(item: Blob, config: ConfigImgBg, callback?: Callback): void {
      const leitor = new w.FileReader();
      leitor.onload = () => {
        const bruto = String(leitor.result ?? "");
        if (!/^data:image\//i.test(bruto)) {
          avisar("Escolha um arquivo de imagem.");
          return;
        }
        const qualidade = Number(w.qualidadeImagens ?? 0);
        if (qualidade > 0 && config.reducao && typeof w.qualityImages === "function") {
          // `qualityImages` le naturalWidth/Height e escreve `dst.src` quando o `Image` interno carrega (assincrono):
          // um <img> solto serve de origem e de destino; espera o `src` mudar (ate ~3s) em vez de um atraso fixo.
          const img = c.doc.createElement("img");
          img.className = "img-base64";
          img.onload = () => {
            try {
              w.qualityImages?.(img, img);
            } catch {
              // sem reducao: segue com a imagem original
            }
            let tentativas = 0;
            const esperar = () => {
              tentativas += 1;
              const atual = img.getAttribute("src") ?? bruto;
              if (atual !== bruto || tentativas >= 50) callback?.(atual, config);
              else setTimeout(esperar, 60);
            };
            setTimeout(esperar, 60);
          };
          img.src = bruto;
        } else {
          setTimeout(() => callback?.(bruto, config), 10);
        }
      };
      leitor.onerror = () => avisar("Não foi possível ler a imagem.");
      leitor.readAsDataURL(item);
    }

    // ---------- Documento ----------

    /** Documento inerte (DOMParser: nada executa, nenhuma imagem carrega) para reescrever o HTML do corpo. */
    function docInerte(html: string): Document {
      const Parser = (c.win as unknown as { DOMParser?: typeof DOMParser }).DOMParser ?? globalThis.DOMParser;
      return new Parser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
    }

    function criarAncora(doc: Document, src: string, config: ConfigImgBg): HTMLElement {
      const p = doc.createElement("p");
      p.setAttribute("class", "Tabela_Texto_Alinhado_Esquerda");
      const span = doc.createElement("span");
      span.setAttribute("class", "imgBgAncora");
      span.setAttribute("title", tituloDaAncora(config));
      const dados: Array<[string, string]> = [
        ["cabecalho", config.cabecalho],
        ["rodape", config.rodape],
        ["primeirapg", String(config.primeirapg)],
        ["visivel", String(config.visivel)],
        ["reducao", String(config.reducao)],
        ["layout", config.layout],
        ["papel", config.papel],
        ["margem", config.margem],
        ["padding", config.padding],
        ["escala", config.escala],
        ["fonte", config.fonte],
        ["posicao", config.posicao],
        ["disposicao", config.disposicao],
        ["utilizacao", config.utilizacao],
        ["repeticao", config.repeticao],
      ];
      for (const [k, v] of dados) span.setAttribute(`data-${k}`, v);
      span.append(doc.createTextNode(ROTULO_ANCORA));
      const style = doc.createElement("style");
      style.setAttribute("data-style", "seipro-imagebg-print");
      style.setAttribute("type", "text/css");
      style.append(doc.createTextNode(montarCssImgBg(src, config)));
      p.append(span, style);
      return p;
    }

    /** Pisca a ancora recem-inserida e rola ate ela. */
    function destacarAncora(ed: Editor): void {
      const el = ancoraDoCorpo(ed);
      if (!el) return;
      const passos = [0, 1, 0, 1];
      el.style.setProperty("transition", "opacity .1s");
      passos.forEach((o, i) => {
        setTimeout(() => {
          el.style.setProperty("opacity", String(o));
          if (i === passos.length - 1) {
            el.style.removeProperty("opacity");
            el.style.removeProperty("transition");
          }
        }, i * 100);
      });
      try {
        el.scrollIntoView?.();
      } catch {
        // sem rolagem
      }
    }

    /** Monta o paragrafo `.imgBgAncora` e o poe no INICIO do corpo, no lugar da ancora anterior. */
    function templateImagePageBackground(src: string, configBruta: ConfigImgBg, editor?: Editor | null): void {
      const ed = editor ?? editorAtual ?? A.getInstance();
      if (!ed) return;
      if (!srcSeguro(src)) {
        avisar("Imagem de fundo inválida: use uma imagem do computador (PNG, JPG ou SVG).");
        return;
      }
      if (A.somenteLeitura(ed)) {
        A.recusarEscrita();
        return;
      }
      const config = normalizarConfig(configBruta);
      A.focus(ed);
      A.saveSnapshot(ed);
      // `transformBodyHtml` serializa o corpo, aplica a transformacao e reaplica (CK5: `data.set` na raiz do corpo)
      A.transformBodyHtml(ed, (html) => {
        const doc = docInerte(html);
        const corpo = doc.body;
        const anterior = corpo.querySelector(".imgBgAncora");
        if (anterior) (anterior.closest("p") ?? anterior).remove();
        // sobras de documentos salvos antes da liberacao do GHS: o <style> ficava orfao num paragrafo invisivel
        for (const orfao of Array.from(corpo.querySelectorAll(SELETOR_STYLE))) (orfao.closest("p") ?? orfao).remove();
        corpo.prepend(criarAncora(doc, src, config));
        return corpo.innerHTML;
      });
      A.saveSnapshot(ed);
      w.enableButtonSavePro?.();
      setTimeout(() => destacarAncora(ed), 0);
    }

    // ---------- Conserto de ancoras orfas ----------

    function temAncoraOrfa(ed: Editor): boolean {
      return A.findInBody(ed, "style").some((s) => ehAncoraOrfa(s.closest("p")));
    }

    /** Devolve o rotulo visivel a paragrafos que ficaram so com o `<style>` (a impressao continua como esta). */
    function normalizeImgBgAncora(editor?: Editor | null): boolean {
      const ed = editor ?? A.getInstance();
      if (!ed || !temAncoraOrfa(ed)) return false;
      const aplicar = () => {
        A.transformBodyHtml(ed, (html) => {
          const doc = docInerte(html);
          for (const style of Array.from(doc.body.querySelectorAll("p > style"))) {
            const p = style.parentElement;
            if (!p || !ehAncoraOrfa(p)) continue;
            const span = doc.createElement("span");
            span.setAttribute("class", "imgBgAncora");
            span.setAttribute("title", TITULO_RECUPERADO);
            span.append(doc.createTextNode(ROTULO_ANCORA));
            p.prepend(span);
          }
          return doc.body.innerHTML;
        });
      };
      // a correcao ao abrir o documento nao pode deixar o botao Salvar do SEI piscando como se o usuario tivesse editado
      if (w.SeiProGhs?.semSujar) w.SeiProGhs.semSujar(aplicar, ed);
      else aplicar();
      return true;
    }

    // ---------- Dialogo ----------

    function openDialogPageImageBackground(editor?: Editor | null): void {
      const ed = editor ?? editorAtual ?? A.getInstance();
      if (!ed) return;
      editorAtual = ed;

      const arquivo = h("input", { type: "file", id: "fileInputImportImage", accept: "image/*" });
      const escala = h("input", { type: "number", step: "10", id: "tipoEscala", class: "tipoEscala", value: PADRAO_IMGBG.escala });
      const cabecalho = h("input", { type: "text", id: "textoCabecalho", class: "textoCabecalho", value: "" });
      const rodape = h("input", { type: "text", id: "textoRodape", class: "textoRodape", value: "" });
      const fontes: readonly Opcao[] = FONTES.map((f) => [f, f] as const);

      const reiniciar = botaoTexto("Restaurar padrões", () => resetOptionsImgBg(raiz, ed), { id: "resetImgBgLink" });
      const ok = h(
        "button",
        {
          type: "button",
          id: "okImgBg",
          class: "spro-botao primario",
          onclick: () => {
            if (A.somenteLeitura(ed)) {
              A.recusarEscrita();
              return;
            }
            const iniciou = getImagePageBackground(raiz, ed, true, (src, config) => templateImagePageBackground(src, config, ed));
            if (!iniciou) {
              if (!campo(raiz, "fileInputImportImage")?.files?.[0]) avisar("Selecione uma imagem para usar como fundo da página.");
              return;
            }
            dialogo.fechar();
          },
        },
        "OK",
      );

      const opcoes = formulario(
        grupo("Importar imagem (PNG, JPG ou SVG)", { para: "fileInputImportImage" }, arquivo),
        grade(
          "tres",
          grupo("Layout", { para: "tipoLayout" }, seletor("tipoLayout", LAYOUTS, PADRAO_IMGBG.layout)),
          grupo("Tamanho do Papel", { para: "tipoPapel" }, seletor("tipoPapel", PAPEIS, PADRAO_IMGBG.papel)),
          grupo("Escala (%)", { para: "tipoEscala" }, campoComSufixo(escala, "%")),
        ),
        grade(
          "tres",
          grupo("Margens Externas", { para: "tipoMargem" }, seletor("tipoMargem", MARGENS, PADRAO_IMGBG.margem)),
          grupo("Margens Internas", { para: "tipoPadding" }, seletor("tipoPadding", PADDINGS, PADRAO_IMGBG.padding)),
          grupo("Fonte", { para: "tipoFonte" }, seletor("tipoFonte", fontes, PADRAO_IMGBG.fonte)),
        ),
        grade(
          "tres",
          grupo("Posição da Imagem", { para: "tipoPosicao" }, seletor("tipoPosicao", POSICOES, PADRAO_IMGBG.posicao)),
          grupo("Disposição da Imagem", { para: "tipoDisposicao" }, seletor("tipoDisposicao", DISPOSICOES, PADRAO_IMGBG.disposicao)),
          grupo("Repetição da Imagem", { para: "tipoRepeticao" }, seletor("tipoRepeticao", REPETICOES, PADRAO_IMGBG.repeticao)),
        ),
        grade(
          "tres",
          grupo("Utilização da Imagem", { para: "tipoUtilizacao" }, seletor("tipoUtilizacao", UTILIZACOES, PADRAO_IMGBG.utilizacao)),
          grupo("Texto do Cabeçalho", { para: "textoCabecalho" }, cabecalho),
          grupo("Texto do Rodapé", { para: "textoRodape" }, rodape),
        ),
        h(
          "div",
          { class: "spro-checklist" },
          caixa({ id: "visibleOnPrint", class: "visibleOnPrint", checked: true }, "Visível apenas ao imprimir"),
          caixa({ id: "onlyFirst", class: "onlyFirst" }, "Aplicar apenas na primeira página"),
          caixa({ id: "reduceQualityImg", class: "reduceQualityImg", checked: true }, "Reduzir qualidade da imagem"),
        ),
        h("div", { class: "spro-dialogo-rodape" }, reiniciar, ok),
      );

      const raiz = h("div", { id: ID_DIALOGO, class: "spro-lateral-imgbg" }, opcoes, montarPagina());

      // cada alteracao recalcula a previa (a escala tambem enquanto se digita)
      for (const el of Array.from(raiz.querySelectorAll("input, select"))) {
        el.addEventListener("change", () => {
          atualizarPrevia(raiz);
          getPreviewImagePageBackground(raiz, ed);
        });
      }
      escala.addEventListener("input", () => atualizarPrevia(raiz));

      const dialogo = abrirDialogo(c.doc, {
        titulo: "Adicionar Imagem de Fundo e Configurações de Página para Impressão",
        largura: 960,
        conteudo: raiz,
      });
      resetOptionsImgBg(raiz, ed);
    }

    /** Clique do botao da barra: abre o dialogo no editor do clique. */
    function pageImageBackground(this_: Element | null): void {
      w.setParamEditor?.(this_);
      const ed = A.getInstance(this_);
      if (!ed) {
        if (typeof w.alertaBoxPro === "function") w.alertaBoxPro("Atenção", "exclamation-circle", "Editor não encontrado.");
        else avisar("Editor não encontrado.");
        return;
      }
      editorAtual = ed;
      openDialogPageImageBackground(ed);
    }

    return {
      pageImageBackground,
      /** Compat com o `initFunctions` do legado: o dialogo abre sob demanda. */
      getDialogPageImageBackground: () => {},
      openDialogPageImageBackground,
      getImagemBgOnEditor,
      resetOptionsImgBg,
      getPreviewImagePageBackground,
      getImagePageBackground,
      loadImagePageBackground,
      templateImagePageBackground,
      normalizeImgBgAncora,
    };
  },

  /** No SEI 5, depois que o GHS e liberado, devolve o rotulo a ancoras orfas (sem a liberacao o `<span>` seria descartado). */
  iniciar(c: Contexto) {
    if (c.adaptador.versao !== 5) return;
    const g = c.win as Janela;
    const globais = recurso.globais(c) as { normalizeImgBgAncora(e?: Editor | null): boolean };
    let tentativas = 15;
    const esperar = (): void => {
      const editor = c.adaptador.getInstance();
      if (editor && g.SeiProGhs?.estaLiberado?.(editor)) {
        globais.normalizeImgBgAncora(editor);
        return;
      }
      tentativas -= 1;
      if (tentativas > 0) setTimeout(esperar, 200);
    };
    esperar();
  },
};
