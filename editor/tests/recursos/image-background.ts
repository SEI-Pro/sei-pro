import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import {
  type ConfigImgBg,
  dimensoesPagina,
  ehAncoraOrfa,
  escalaValida,
  recurso as imageBackground,
  lerConfigDaAncora,
  montarCssImgBg,
  normalizarConfig,
  PADRAO_IMGBG,
  ROTULO_ANCORA,
  srcSeguro,
  textoCss,
  tituloDaAncora,
} from "../../src/recursos/image-background";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk4, criarCk5, type FalsoCk4, type FalsoCk5, nosDoisEditores, paginaFalsa } from "../falsos";
import { checar, disparar, escolher, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
type Janela = Record<string, unknown>;

const PNG = "data:image/png;base64,AAAA";
const JPG = "data:image/jpeg;base64,BBBB";
const ROTULO_RECUPERADO = "Configurações de impressão (rótulo recuperado pelo SEI Pro)";

/** Arquivo falso: o `FileReader` falso devolve `dados` (ou falha). */
interface ArquivoFalso {
  name: string;
  type: string;
  dados: string;
  falhar?: boolean;
}

const aviso = (doc: Document): string => doc.querySelector(".spro-aviso > span")?.textContent ?? "";

function instalarLeitor(w: Janela): { lidos: string[] } {
  const lidos: string[] = [];
  w.FileReader = class {
    result: string | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    readAsDataURL(b: ArquivoFalso) {
      lidos.push(b.name);
      setTimeout(() => {
        if (b.falhar) this.onerror?.();
        else {
          this.result = b.dados;
          this.onload?.();
        }
      }, 0);
    }
  };
  return { lidos };
}

function escolherArquivo(d: HTMLElement, arq: ArquivoFalso | null): void {
  const entrada = d.querySelector("#fileInputImportImage") as HTMLInputElement;
  Object.defineProperty(entrada, "files", { value: arq ? [arq] : [], configurable: true });
  disparar(entrada, "change");
}

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

/** Poe `html` no corpo (CK4: o DOM; CK5: o DOM da editavel e os dados da raiz, que `transformBodyHtml` le). */
function semear(c: CasoEditor, html: string): void {
  const corpo = corpoDe(c);
  corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, html));
  if (c.versao === 5) (c.ed as FalsoCk5).instancia().dadosPorRaiz.main = html;
}

/** O HTML que o editor guardou depois da escrita (CK5: o `data.set` da raiz; o DOM so muda no proximo render). */
function htmlGravado(c: CasoEditor): string {
  return c.versao === 4 ? corpoDe(c).innerHTML : (c.ed as FalsoCk5).instancia().dadosPorRaiz.main;
}

/** No CK5 o DOM e a view: reflete o que foi gravado (o proximo render do editor). */
function refletir(c: CasoEditor): void {
  if (c.versao === 5) semear(c, htmlGravado(c));
}

function analisar(doc: Document, html: string): HTMLElement {
  const div = doc.createElement("div");
  div.append(...htmlParaNos(doc, html));
  return div;
}

function criarCtx(c: { doc: Document; win: CasoEditor["win"] }): Contexto {
  return { adaptador: criarAdaptador(c.win), doc: c.doc, win: c.win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
}

const campo = (d: ParentNode, id: string) => d.querySelector(`#${id}`) as HTMLInputElement;
const estilo = (el: Element, prop: string) => (el as HTMLElement).style.getPropertyValue(prop);
const mudar = (d: ParentNode, id: string, v: string) => {
  const sel = campo(d, id);
  if (sel.tagName === "SELECT") escolher(sel as unknown as HTMLSelectElement, v);
  else {
    sel.value = v;
    disparar(sel, "change");
  }
};
const marcarCaixa = (d: ParentNode, id: string, v: boolean) => {
  const el = campo(d, id);
  el.checked = v;
  disparar(el, "change");
};

const IDS_CAMPOS = [
  "fileInputImportImage",
  "tipoLayout",
  "tipoPapel",
  "tipoEscala",
  "tipoMargem",
  "tipoPadding",
  "tipoFonte",
  "tipoPosicao",
  "tipoDisposicao",
  "tipoRepeticao",
  "tipoUtilizacao",
  "textoCabecalho",
  "textoRodape",
  "visibleOnPrint",
  "onlyFirst",
  "reduceQualityImg",
  "boxBgPreview",
  "imgBgPreview",
  "resetImgBgLink",
];

/** A ancora no formato do legado (CK4: o `<style>` dentro do `<span>`), para provar que documentos antigos continuam sendo lidos. */
function ancoraLegado(src: string): string {
  const css = `@media print {   @page:first { size: A3 landscape; margin: 1cm 1cm 1cm 1cm; }   body p, body p * { font-size: 90% !important; font-family: Arial !important; }   .imgBgAncora { display: none; }   body { padding: 0cm;  background-position: bottom right; background-size: cover; background-repeat: repeat-x; background-image: url("${src}"); }   body:before { display: block; position: fixed; text-align: center; content: "Cab"; top: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }    }`;
  return (
    '<p class="Tabela_Texto_Alinhado_Esquerda"><span class="imgBgAncora" title="x" data-cabecalho="Cab" data-rodape="" data-primeirapg="true"' +
    ' data-visivel="true" data-reducao="false" data-layout="landscape" data-papel="A3" data-margem="1cm 1cm 1cm 1cm" data-padding="0cm"' +
    ' data-escala="90" data-fonte="Arial" data-posicao="bottom right" data-disposicao="cover" data-utilizacao="background"' +
    ' data-repeticao="repeat-x">' +
    ROTULO_ANCORA +
    `<style data-style="seipro-imagebg-print" type="text/css">${css}</style></span></p><p>texto</p>`
  );
}

export async function verificarImageBackground(): Promise<void> {
  secao("recurso image-background");

  // ---------- funcoes puras ----------
  igual(
    "escalaValida: numero positivo passa; lixo, zero, negativo e enorme viram 100",
    [
      escalaValida("85"),
      escalaValida("12.5"),
      escalaValida("abc"),
      escalaValida(""),
      escalaValida("0"),
      escalaValida("-5"),
      escalaValida("100; }"),
      escalaValida("5000"),
    ],
    ["85", "12.5", "100", "100", "100", "100", "100", "100"],
  );
  igual(
    "textoCss: escapa aspas, barra, quebra de linha e o < que fecharia o <style>",
    [textoCss('Meu "cab"'), textoCss("a\\b"), textoCss("a\nb"), textoCss("</style>"), textoCss("Simples & normal")],
    ['Meu \\"cab\\"', "a\\\\b", "a b", "\\3c /style>", "Simples & normal"],
  );
  igual(
    "srcSeguro: so data URI de imagem ou http(s) sem aspas, parenteses ou <",
    [
      srcSeguro(PNG),
      srcSeguro("data:image/svg+xml;base64,PHN2Zz4="),
      srcSeguro("https://exemplo.gov.br/f.png"),
      srcSeguro("javascript:alert(1)"),
      srcSeguro("data:text/html;base64,AAAA"),
      srcSeguro('data:image/png;base64,AA"A'),
      srcSeguro("data:image/png;base64,AA)A"),
      srcSeguro(""),
    ],
    [true, true, true, false, false, false, false, false],
  );
  igual(
    "dimensoesPagina: retrato, paisagem e papel desconhecido cai em A4",
    [
      dimensoesPagina("A4", "portrait"),
      dimensoesPagina("A4", "landscape"),
      dimensoesPagina("A3", "landscape"),
      dimensoesPagina("letter", "portrait"),
      dimensoesPagina("x", "portrait"),
    ],
    [
      [210, 297],
      [297, 210],
      [420, 297],
      [215.9, 279.4],
      [210, 297],
    ],
  );
  igual(
    "normalizarConfig: valor fora das opcoes volta ao padrao; texto e booleanos passam",
    normalizarConfig({
      layout: "x",
      papel: "A3",
      margem: "9cm",
      fonte: "Papyrus",
      posicao: "nada",
      cabecalho: 12,
      visivel: false,
      primeirapg: "true",
      escala: "abc",
    }),
    { ...PADRAO_IMGBG, papel: "A3", cabecalho: "12", visivel: false },
  );

  const A4: ConfigImgBg = { ...PADRAO_IMGBG };
  const esperadoPadrao =
    ".imgBgAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }" +
    " html.dark-mode .imgBgAncora, html.dark-mode .imgBgAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }" +
    ' body.cke_editable .imgBgAncora:after { content: " [delete isto para remover]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }' +
    " @media print {   @page { size: A4 portrait; margin: 0cm; }" +
    "   body p, body p * { font-size: 100% !important; font-family: Calibri !important; }" +
    "   .imgBgAncora { display: none; }" +
    `   body { padding: 3cm 2cm 3cm 2cm;  background-position: top center; background-size: contain; background-repeat: no-repeat; background-image: url("${PNG}"); }` +
    `${" ".repeat(7)}}`;
  igual("montarCssImgBg: formato do legado, byte a byte (padroes)", montarCssImgBg(PNG, A4), esperadoPadrao);
  const completo: ConfigImgBg = {
    ...PADRAO_IMGBG,
    primeirapg: true,
    visivel: false,
    layout: "landscape",
    papel: "A3",
    margem: "1cm 1cm 1cm 1cm",
    padding: "0cm",
    escala: "90",
    fonte: "Arial",
    posicao: "bottom right",
    disposicao: "cover",
    repeticao: "repeat-x",
    utilizacao: "page_cover",
    cabecalho: "CAB",
    rodape: "ROD",
  };
  igual(
    "montarCssImgBg: primeira pagina, capa, nao-so-impressao, cabecalho e rodape",
    montarCssImgBg(PNG, completo).slice(montarCssImgBg(PNG, completo).indexOf(" @media print {")),
    " @media print {   @page:first { size: A3 landscape; margin: 1cm 1cm 1cm 1cm; } }" +
      "   body p, body p * { font-size: 90% !important; font-family: Arial !important; }" +
      "   .imgBgAncora { display: none; }" +
      `   body { padding: 0cm; padding-top: 29.7cm !important; background-position: bottom right; background-size: cover; background-repeat: repeat-x; background-image: url("${PNG}"); }` +
      '   body:before { display: block; position: fixed; text-align: center; content: "CAB"; top: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }' +
      '   body:after { display: block; position: fixed; text-align: center; content: "ROD"; bottom: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }',
  );
  const titulo = tituloDaAncora(completo).split("\n");
  igual(
    "tituloDaAncora: resumo legivel, uma opcao por linha, cabecalho e rodape so quando existem",
    [
      titulo[0],
      titulo[1],
      titulo[9],
      titulo[10],
      titulo[11],
      titulo.at(-3),
      titulo.at(-2),
      titulo.at(-1),
      tituloDaAncora(A4).split("\n").length,
    ],
    [
      "Layout: Paisagem",
      "Tamanho do Papel: A3",
      "Utilização da Imagem: Imagem como capa de livro",
      "Texto do Cabeçalho: CAB",
      "Texto do Rodapé: ROD",
      "Visível apenas ao imprimir: Não",
      "Aplicar apenas na primeira página: Sim",
      "Reduzir qualidade da imagem: Sim",
      13,
    ],
  );

  const { doc: docPuro } = criarCk4({ secoes: [{ nome: "t", titulo: "t", html: "" }] });
  usarDocumento(docPuro);
  const orfa = analisar(
    docPuro,
    '<p><style data-style="seipro-imagebg-print">a{}</style></p><p>x <style>b{}</style></p><p><style>c{}</style><span class="imgBgAncora">r</span></p>',
  );
  igual(
    "ehAncoraOrfa: so o paragrafo com <style> e sem texto nem ancora",
    [...orfa.querySelectorAll("p")].map((p) => ehAncoraOrfa(p)).concat(ehAncoraOrfa(null)),
    [true, false, false, false],
  );
  const legado = analisar(docPuro, ancoraLegado(PNG));
  igual(
    "lerConfigDaAncora: le os data-* de uma ancora no formato legado",
    lerConfigDaAncora(legado.querySelector(".imgBgAncora") as Element),
    {
      ...PADRAO_IMGBG,
      primeirapg: true,
      cabecalho: "Cab",
      reducao: false,
      layout: "landscape",
      papel: "A3",
      margem: "1cm 1cm 1cm 1cm",
      padding: "0cm",
      escala: "90",
      fonte: "Arial",
      posicao: "bottom right",
      disposicao: "cover",
      repeticao: "repeat-x",
    },
  );
  igual(
    "lerConfigDaAncora: ancora sem data-* cai nos padroes",
    lerConfigDaAncora(analisar(docPuro, '<span class="imgBgAncora"></span>').firstElementChild as Element),
    PADRAO_IMGBG,
  );

  // ---------- dois editores ----------
  await nosDoisEditores("image-background", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Janela;
    const leitor = instalarLeitor(w);
    const chamadas = { param: 0, salvar: 0, alertas: [] as unknown[][] };
    w.setParamEditor = () => {
      chamadas.param += 1;
    };
    w.enableButtonSavePro = () => {
      chamadas.salvar += 1;
    };
    w.qualidadeImagens = 0;
    const ctx = criarCtx(c);
    const g = imageBackground.globais(ctx) as Record<string, Fn>;
    igual(`image-background ${v}: id do recurso`, imageBackground.id, "image-background");
    igual(`image-background ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDialogPageImageBackground",
      "getImagePageBackground",
      "getImagemBgOnEditor",
      "getPreviewImagePageBackground",
      "loadImagePageBackground",
      "normalizeImgBgAncora",
      "openDialogPageImageBackground",
      "pageImageBackground",
      "resetOptionsImgBg",
      "templateImagePageBackground",
    ]);
    igual(
      `image-background ${v}: getDialogPageImageBackground e vazio (o dialogo abre sob demanda)`,
      [g.getDialogPageImageBackground(), !!dialogoAberto(c.doc)],
      [undefined, false],
    );

    // ---- abrir ----
    g.pageImageBackground(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(`image-background ${v}: o clique abre o dialogo e avisa o monolito do editor`, !!d && chamadas.param === 1);
    igual(
      `image-background ${v}: os ids do dialogo estao todos la`,
      IDS_CAMPOS.filter((id) => !d.querySelector(`#${id}`)),
      [],
    );
    checar(
      `image-background ${v}: a raiz do dialogo tem o id dialogPageImageBackground`,
      !!d.querySelector("#dialogPageImageBackground .spro-lateral-imgbg") ||
        d.querySelector("#dialogPageImageBackground")?.className.includes("spro-lateral-imgbg") === true,
    );
    checar(
      `image-background ${v}: sem botao Cancelar`,
      ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    checar(
      `image-background ${v}: o titulo do dialogo e o do legado`,
      d.getAttribute("aria-label") === "Adicionar Imagem de Fundo e Configurações de Página para Impressão",
    );
    const lista = (id: string) => [...campo(d, id).querySelectorAll("option")].map((o) => o.getAttribute("value"));
    igual(
      `image-background ${v}: opcoes de papel, layout e uso como no legado`,
      [lista("tipoPapel"), lista("tipoLayout"), lista("tipoUtilizacao")],
      [
        ["A5", "A4", "A3", "tabloid", "letter", "legal"],
        ["landscape", "portrait"],
        ["background", "page_cover"],
      ],
    );
    igual(`image-background ${v}: 21 fontes e 8 posicoes`, [lista("tipoFonte").length, lista("tipoPosicao").length], [21, 8]);
    igual(
      `image-background ${v}: valores padrao dos campos`,
      [
        "tipoLayout",
        "tipoPapel",
        "tipoEscala",
        "tipoMargem",
        "tipoPadding",
        "tipoFonte",
        "tipoPosicao",
        "tipoDisposicao",
        "tipoRepeticao",
        "tipoUtilizacao",
        "textoCabecalho",
        "textoRodape",
      ].map((id) => campo(d, id).value),
      ["portrait", "A4", "100", "0cm", "3cm 2cm 3cm 2cm", "Calibri", "top center", "contain", "no-repeat", "background", "", ""],
    );
    igual(
      `image-background ${v}: caixas padrao (visivel e reducao ligadas, primeira pagina desligada)`,
      ["visibleOnPrint", "onlyFirst", "reduceQualityImg"].map((id) => campo(d, id).hasAttribute("checked")),
      [true, false, true],
    );
    const pagina = campo(d, "boxBgPreview");
    const imagem = campo(d, "imgBgPreview");
    igual(
      `image-background ${v}: previa abre em A4 retrato, sem imagem`,
      [estilo(pagina, "width"), estilo(pagina, "height"), estilo(imagem, "background-image")],
      ["210px", "297px", "none"],
    );

    // ---- previa ao vivo ----
    mudar(d, "tipoLayout", "landscape");
    igual(
      `image-background ${v}: layout paisagem: pagina 297x210`,
      [estilo(pagina, "width"), estilo(pagina, "height")],
      ["297px", "210px"],
    );
    mudar(d, "tipoPapel", "A3");
    igual(`image-background ${v}: A3 paisagem: 420x297`, [estilo(pagina, "width"), estilo(pagina, "height")], ["420px", "297px"]);
    mudar(d, "tipoPapel", "letter");
    igual(
      `image-background ${v}: letter paisagem: 279.4x215.9`,
      [estilo(pagina, "width"), estilo(pagina, "height")],
      ["279.4px", "215.9px"],
    );
    mudar(d, "tipoLayout", "portrait");
    igual(
      `image-background ${v}: letter retrato: 215.9x279.4`,
      [estilo(pagina, "width"), estilo(pagina, "height")],
      ["215.9px", "279.4px"],
    );
    for (const [papel, l, a] of [
      ["legal", 216, 356],
      ["tabloid", 279, 432],
      ["A5", 148, 210],
      ["A3", 297, 420],
      ["A4", 210, 297],
    ] as const) {
      mudar(d, "tipoPapel", papel);
      igual(
        `image-background ${v}: ${papel} retrato: ${l}x${a}`,
        [estilo(pagina, "width"), estilo(pagina, "height")],
        [`${l}px`, `${a}px`],
      );
    }
    const texto = pagina.querySelector("p") as HTMLElement;
    mudar(d, "tipoEscala", "150");
    mudar(d, "tipoFonte", "Georgia");
    igual(
      `image-background ${v}: escala e fonte vao para o texto da previa`,
      [estilo(texto, "font-size"), estilo(texto, "font-family")],
      ["150%", "Georgia"],
    );
    mudar(d, "tipoEscala", "abc");
    igual(`image-background ${v}: escala invalida na previa volta a 100%`, estilo(texto, "font-size"), "100%");
    mudar(d, "tipoPosicao", "bottom right");
    mudar(d, "tipoDisposicao", "cover");
    mudar(d, "tipoRepeticao", "repeat-x");
    igual(
      `image-background ${v}: posicao, disposicao e repeticao vao para o fundo da previa`,
      [estilo(imagem, "background-position"), estilo(imagem, "background-size"), estilo(imagem, "background-repeat")],
      ["bottom right", "cover", "repeat-x"],
    );
    mudar(d, "tipoUtilizacao", "page_cover");
    igual(`image-background ${v}: capa de livro esconde o texto da previa`, estilo(texto, "visibility"), "hidden");
    mudar(d, "tipoUtilizacao", "background");
    igual(`image-background ${v}: fundo mostra o texto de novo`, estilo(texto, "visibility"), "visible");
    mudar(d, "tipoPadding", "0cm");
    mudar(d, "tipoMargem", "3cm 2cm 3cm 2cm");
    igual(
      `image-background ${v}: margens internas e externas na previa`,
      [estilo(imagem, "padding"), estilo(imagem, "margin")],
      ["0", "30px 20px"],
    );
    mudar(d, "tipoPadding", "1cm 1cm 1cm 1cm");
    mudar(d, "tipoMargem", "1cm 1cm 1cm 1cm");
    igual(`image-background ${v}: margem minima`, [estilo(imagem, "padding"), estilo(imagem, "margin")], ["10px", "10px"]);

    // ---- OK sem imagem: nao grava nada ----
    const antes = htmlGravado(c);
    clicar(d, "OK");
    igual(
      `image-background ${v}: OK sem imagem avisa, mantem o dialogo e nao mexe no documento`,
      [aviso(c.doc), !!dialogoAberto(c.doc), htmlGravado(c) === antes, chamadas.salvar],
      ["Selecione uma imagem para usar como fundo da página.", true, true, 0],
    );

    // ---- arquivo que nao e imagem / leitura que falha ----
    escolherArquivo(d, { name: "a.pdf", type: "application/pdf", dados: "data:application/pdf;base64,AAAA" });
    await tique(20);
    igual(
      `image-background ${v}: arquivo que nao e imagem e recusado sem ler`,
      [aviso(c.doc), leitor.lidos.length],
      ["Escolha um arquivo de imagem.", 0],
    );
    escolherArquivo(d, { name: "b.bin", type: "", dados: "data:application/octet-stream;base64,AAAA" });
    await tique(20);
    igual(`image-background ${v}: dados lidos que nao sao imagem avisam`, aviso(c.doc), "Escolha um arquivo de imagem.");
    escolherArquivo(d, { name: "c.png", type: "image/png", dados: PNG, falhar: true });
    await tique(20);
    igual(`image-background ${v}: erro de leitura avisa`, aviso(c.doc), "Não foi possível ler a imagem.");

    // ---- imagem do computador: previa e gravacao ----
    mudar(d, "textoCabecalho", 'Meu "cab" </style><b>');
    mudar(d, "textoRodape", "Rodape & CIA");
    marcarCaixa(d, "onlyFirst", true);
    mudar(d, "tipoEscala", "abc");
    escolherArquivo(d, { name: "fundo.png", type: "image/png", dados: PNG });
    await tique(30);
    igual(`image-background ${v}: a imagem escolhida aparece na previa`, estilo(imagem, "background-image"), `url("${PNG}")`);
    clicar(d, "OK");
    await tique(30);
    checar(`image-background ${v}: OK com imagem fecha o dialogo`, !dialogoAberto(c.doc));
    const gravado = analisar(c.doc, htmlGravado(c));
    const ancora = gravado.querySelector(".imgBgAncora") as HTMLElement;
    checar(
      `image-background ${v}: a ancora e o primeiro paragrafo, antes do texto`,
      gravado.firstElementChild?.className === "Tabela_Texto_Alinhado_Esquerda" &&
        gravado.firstElementChild.contains(ancora) &&
        gravado.lastElementChild?.textContent === "texto",
    );
    igual(
      `image-background ${v}: o rotulo visivel vem antes do <style>`,
      [ancora.textContent, ancora.nextElementSibling?.tagName ?? ancora.querySelector("style")?.tagName],
      [ROTULO_ANCORA, "STYLE"],
    );
    igual(
      `image-background ${v}: data-* gravados`,
      [
        "cabecalho",
        "rodape",
        "primeirapg",
        "visivel",
        "reducao",
        "layout",
        "papel",
        "margem",
        "padding",
        "escala",
        "fonte",
        "posicao",
        "disposicao",
        "utilizacao",
        "repeticao",
      ].map((k) => ancora.getAttribute(`data-${k}`)),
      [
        'Meu "cab" </style><b>',
        "Rodape & CIA",
        "true",
        "true",
        "true",
        "portrait",
        "A4",
        "1cm 1cm 1cm 1cm",
        "1cm 1cm 1cm 1cm",
        "100",
        "Georgia",
        "bottom right",
        "cover",
        "background",
        "repeat-x",
      ],
    );
    checar(
      `image-background ${v}: o title resume as opcoes`,
      (ancora.getAttribute("title") ?? "").startsWith("Layout: Retrato\nTamanho do Papel: A4\nEscala (%): 100"),
    );
    const styles = gravado.querySelectorAll("style");
    igual(`image-background ${v}: um unico <style> (o texto do cabecalho nao fecha a tag)`, styles.length, 1);
    const css = styles[0]?.textContent ?? "";
    checar(
      `image-background ${v}: o <style> tem o data-style e o CSS de impressao`,
      styles[0]?.getAttribute("data-style") === "seipro-imagebg-print" &&
        css.includes("@page:first { size: A4 portrait; margin: 1cm 1cm 1cm 1cm; }") &&
        css.includes(`background-image: url("${PNG}")`),
    );
    checar(
      `image-background ${v}: cabecalho e rodape escapados no CSS`,
      css.includes('content: "Meu \\"cab\\" \\3c /style>b>"') === false &&
        css.includes('content: "Meu \\"cab\\" \\3c /style>\\3c b>"') &&
        css.includes('content: "Rodape & CIA"'),
    );
    checar(`image-background ${v}: escala invalida gravada como 100%`, css.includes("font-size: 100% !important"));
    igual(`image-background ${v}: o monolito foi avisado para habilitar Salvar`, chamadas.salvar, 1);
    if (c.versao === 4)
      igual(
        `image-background ${v}: escrita em um passo (snapshot antes e depois)`,
        (c.ed as FalsoCk4).instancia("txaEditor_1").snapshots >= 2,
        true,
      );

    // ---- reabrir le o que foi gravado ----
    refletir(c);
    g.openDialogPageImageBackground();
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `image-background ${v}: reabrir restaura os campos a partir da ancora`,
      [
        "tipoPapel",
        "tipoEscala",
        "tipoMargem",
        "tipoFonte",
        "tipoPosicao",
        "tipoDisposicao",
        "tipoRepeticao",
        "textoCabecalho",
        "textoRodape",
      ].map((id) => campo(d2, id).value),
      ["A4", "100", "1cm 1cm 1cm 1cm", "Georgia", "bottom right", "cover", "repeat-x", 'Meu "cab" </style><b>', "Rodape & CIA"],
    );
    igual(
      `image-background ${v}: reabrir marca primeira pagina e mantem a imagem na previa`,
      [campo(d2, "onlyFirst").checked, estilo(campo(d2, "imgBgPreview"), "background-image")],
      [true, `url("${PNG}")`],
    );
    // sem novo arquivo, OK reaproveita a imagem da ancora com as opcoes novas e SUBSTITUI a ancora
    mudar(d2, "tipoPapel", "A3");
    mudar(d2, "textoCabecalho", "");
    clicar(d2, "OK");
    await tique(30);
    const regravado = analisar(c.doc, htmlGravado(c));
    igual(
      `image-background ${v}: sem arquivo novo reaproveita a imagem, troca as opcoes e mantem uma unica ancora`,
      [
        regravado.querySelectorAll(".imgBgAncora").length,
        regravado.querySelectorAll("style").length,
        regravado.querySelector(".imgBgAncora")?.getAttribute("data-papel"),
        (regravado.querySelector("style")?.textContent ?? "").includes(`url("${PNG}")`),
        (regravado.querySelector("style")?.textContent ?? "").includes("body:before"),
      ],
      [1, 1, "A3", true, false],
    );
    igual(`image-background ${v}: o texto do documento segue depois da ancora`, regravado.lastElementChild?.textContent, "texto");

    // ---- restaurar padroes ----
    refletir(c);
    g.openDialogPageImageBackground();
    const d3 = dialogoAberto(c.doc) as HTMLElement;
    mudar(d3, "tipoPapel", "legal");
    mudar(d3, "textoRodape", "x");
    marcarCaixa(d3, "visibleOnPrint", false);
    clicar(d3, "Restaurar padrões");
    igual(
      `image-background ${v}: restaurar volta aos valores da ancora do documento`,
      [
        campo(d3, "tipoPapel").value,
        campo(d3, "textoRodape").value,
        campo(d3, "visibleOnPrint").checked,
        estilo(campo(d3, "boxBgPreview"), "width"),
      ],
      ["A3", "Rodape & CIA", true, "297px"],
    );
    igual(`image-background ${v}: o link tem o id resetImgBgLink`, d3.querySelector("#resetImgBgLink")?.tagName, "BUTTON");

    // ---- ancora no formato legado (documentos antigos) ----
    semear(c, ancoraLegado(PNG));
    refletir(c);
    const velho = g.getImagemBgOnEditor(null);
    igual(`image-background ${v}: ancora do legado: getImagemBgOnEditor devolve o src`, velho, PNG);
    clicar(d3, "Restaurar padrões");
    igual(
      `image-background ${v}: ancora do legado: restaurar mostra as opcoes dela`,
      [
        "tipoLayout",
        "tipoPapel",
        "tipoEscala",
        "tipoMargem",
        "tipoPadding",
        "tipoFonte",
        "tipoPosicao",
        "tipoDisposicao",
        "tipoRepeticao",
        "textoCabecalho",
      ].map((id) => campo(d3, id).value),
      ["landscape", "A3", "90", "1cm 1cm 1cm 1cm", "0cm", "Arial", "bottom right", "cover", "repeat-x", "Cab"],
    );
    igual(
      `image-background ${v}: ancora do legado: caixas e previa`,
      [
        campo(d3, "onlyFirst").checked,
        campo(d3, "reduceQualityImg").checked,
        estilo(campo(d3, "boxBgPreview"), "width"),
        estilo(campo(d3, "imgBgPreview"), "background-image"),
      ],
      [true, false, "420px", `url("${PNG}")`],
    );
    const antesLegado = htmlGravado(c);
    clicar(d3, "OK");
    await tique(30);
    const novoDeLegado = analisar(c.doc, htmlGravado(c));
    igual(
      `image-background ${v}: regravar um documento antigo troca a ancora velha por uma so`,
      [
        htmlGravado(c) !== antesLegado,
        novoDeLegado.querySelectorAll(".imgBgAncora").length,
        novoDeLegado.querySelectorAll("style").length,
        novoDeLegado.querySelector(".imgBgAncora")?.getAttribute("data-layout"),
      ],
      [true, 1, 1, "landscape"],
    );

    // ---- src inseguro vindo de uma ancora adulterada ----
    semear(c, ancoraLegado("javascript:alert(1)"));
    refletir(c);
    igual(`image-background ${v}: src inseguro na ancora nao vira imagem`, g.getImagemBgOnEditor(null), false);
    const htmlRuim = htmlGravado(c);
    g.templateImagePageBackground("javascript:alert(1)", A4, undefined);
    igual(
      `image-background ${v}: template recusa src inseguro e avisa`,
      [htmlGravado(c) === htmlRuim, aviso(c.doc)],
      [true, "Imagem de fundo inválida: use uma imagem do computador (PNG, JPG ou SVG)."],
    );

    // ---- reducao de qualidade ----
    semear(c, "<p>texto</p>");
    refletir(c);
    const imgs: Array<HTMLElement & { onload?: () => void }> = [];
    const criar = c.doc.createElement.bind(c.doc);
    (c.doc as unknown as { createElement: (t: string) => HTMLElement }).createElement = (t: string) => {
      const el = criar(t) as HTMLElement & { onload?: () => void };
      if (t === "img") imgs.push(el);
      return el;
    };
    w.qualidadeImagens = 60;
    const reduzidas: Element[] = [];
    w.qualityImages = (o: Element, dst: Element) => {
      reduzidas.push(o);
      setTimeout(() => dst.setAttribute("src", JPG), 20);
    };
    const resultados: Array<[string, ConfigImgBg]> = [];
    g.loadImagePageBackground(
      { name: "g.png", type: "image/png", dados: PNG } as never,
      { ...A4, reducao: true },
      (s: string, cfg: ConfigImgBg) => resultados.push([s, cfg]),
    );
    await tique(20);
    const img = imgs[0];
    checar(
      `image-background ${v}: com reducao ligada o <img> solto recebe a imagem lida`,
      !!img && img.getAttribute("src") === PNG && img.className === "img-base64",
    );
    img?.onload?.();
    await tique(150);
    igual(
      `image-background ${v}: reducao de qualidade: entrega a imagem reduzida`,
      [reduzidas.length, resultados.map((r) => r[0])],
      [1, [JPG]],
    );
    g.loadImagePageBackground({ name: "g2.png", type: "image/png", dados: PNG } as never, { ...A4, reducao: false }, (s: string) =>
      resultados.push([s, A4]),
    );
    await tique(40);
    igual(`image-background ${v}: reducao desligada entrega a imagem original`, [reduzidas.length, resultados.at(-1)?.[0]], [1, PNG]);
    w.qualidadeImagens = 0;
    g.loadImagePageBackground({ name: "g3.png", type: "image/png", dados: PNG } as never, { ...A4, reducao: true }, (s: string) =>
      resultados.push([s, A4]),
    );
    await tique(40);
    igual(`image-background ${v}: qualidade 0 nao reduz`, [reduzidas.length, resultados.at(-1)?.[0]], [1, PNG]);
    (c.doc as unknown as { createElement: unknown }).createElement = criar;
    w.qualityImages = undefined;
    g.loadImagePageBackground({ name: "g4.png", type: "image/png", dados: PNG } as never, A4, undefined);
    await tique(30);
    checar(`image-background ${v}: sem callback nao quebra`, true);

    // ---- sem editor ----
    const pagVazia =
      c.versao === 4
        ? paginaFalsa()
        : criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "", principal: true }], montarLogo: false });
    usarDocumento(pagVazia.doc);
    const wv = pagVazia.win as unknown as Janela;
    const gv = imageBackground.globais(criarCtx(pagVazia)) as Record<string, Fn>;
    gv.pageImageBackground(null);
    igual(
      `image-background ${v}: sem editor sem alertaBoxPro: aviso e nenhum dialogo`,
      [aviso(pagVazia.doc), !!dialogoAberto(pagVazia.doc)],
      ["Editor não encontrado.", false],
    );
    wv.alertaBoxPro = (...a: unknown[]) => chamadas.alertas.push(a);
    gv.pageImageBackground(null);
    igual(`image-background ${v}: sem editor chama o alertaBoxPro do monolito`, chamadas.alertas, [
      ["Atenção", "exclamation-circle", "Editor não encontrado."],
    ]);
    igual(
      `image-background ${v}: sem editor: abrir, normalizar e ler a ancora nao fazem nada`,
      [gv.openDialogPageImageBackground(), gv.normalizeImgBgAncora(), gv.getImagemBgOnEditor(null)],
      [undefined, false, false],
    );
    usarDocumento(c.doc);
  });

  // ---------- somente leitura ----------
  for (const versao of [4, 5] as const) {
    const ed =
      versao === 4
        ? criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Cabecalho", html: "<p>texto</p>", somenteLeitura: true }] })
        : criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>texto</p>", principal: true, somenteLeitura: true }] });
    usarDocumento(ed.doc);
    const v = `[CK${versao}]`;
    const w = ed.win as unknown as Janela;
    instalarLeitor(w);
    w.qualidadeImagens = 0;
    const ctx = criarCtx(ed);
    let recusas = 0;
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const g = imageBackground.globais(ctx) as Record<string, Fn>;
    g.pageImageBackground(null);
    const d = dialogoAberto(ed.doc) as HTMLElement;
    escolherArquivo(d, { name: "f.png", type: "image/png", dados: PNG });
    await tique(30);
    clicar(d, "OK");
    await tique(30);
    const corpo = versao === 4 ? (ed as FalsoCk4).instancia("txaEditor_1").corpo.innerHTML : (ed as FalsoCk5).instancia().dadosPorRaiz.main;
    igual(
      `image-background ${v}: secao somente leitura: OK recusa a escrita, avisa e mantem o dialogo`,
      [recusas, !!dialogoAberto(ed.doc), corpo],
      [1, true, "<p>texto</p>"],
    );
    g.templateImagePageBackground(PNG, A4, undefined);
    igual(`image-background ${v}: somente leitura: template tambem recusa`, [recusas, corpo], [2, "<p>texto</p>"]);
  }

  // ---------- normalizeImgBgAncora e iniciar ----------
  await nosDoisEditores("image-background-normalizar", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Janela;
    const g = imageBackground.globais(criarCtx(c)) as Record<string, Fn>;
    const ORFA = `<p><style data-style="seipro-imagebg-print" type="text/css">@media print { body { background-image: url("${PNG}"); } }</style></p><p>texto</p>`;
    semear(c, "<p>texto</p>");
    igual(
      `image-background ${v}: normalizar sem ancora orfa devolve false e nao escreve`,
      [g.normalizeImgBgAncora(), htmlGravado(c)],
      [false, "<p>texto</p>"],
    );
    semear(c, ancoraLegado(PNG));
    igual(`image-background ${v}: normalizar com ancora completa devolve false`, g.normalizeImgBgAncora(), false);
    semear(c, ORFA);
    igual(`image-background ${v}: normalizar com ancora orfa devolve true`, g.normalizeImgBgAncora(), true);
    const r = analisar(c.doc, htmlGravado(c));
    const span = r.querySelector("p > span.imgBgAncora");
    igual(
      `image-background ${v}: devolve o rotulo visivel antes do <style> e preserva o CSS`,
      [
        span?.textContent,
        span?.getAttribute("title"),
        span?.nextElementSibling?.tagName,
        (r.querySelector("style")?.textContent ?? "").includes(`url("${PNG}")`),
        r.querySelectorAll("p").length,
      ],
      [ROTULO_ANCORA, ROTULO_RECUPERADO, "STYLE", true, 2],
    );
    refletir(c);
    igual(`image-background ${v}: depois de recuperada a ancora deixa de ser orfa`, g.normalizeImgBgAncora(), false);
    // com o GHS: roda dentro de semSujar
    semear(c, ORFA);
    let sujar = 0;
    w.SeiProGhs = {
      semSujar: (fn: () => void) => {
        sujar += 1;
        fn();
      },
      estaLiberado: () => true,
    };
    g.normalizeImgBgAncora();
    igual(
      `image-background ${v}: a correcao roda dentro de SeiProGhs.semSujar`,
      [sujar, htmlGravado(c).includes("imgBgAncora")],
      [1, true],
    );

    // iniciar: so no SEI 5 e so com o GHS liberado
    semear(c, ORFA);
    sujar = 0;
    imageBackground.iniciar?.(criarCtx(c));
    igual(
      `image-background ${v}: iniciar ${c.versao === 5 ? "recupera a ancora quando o GHS esta liberado" : "nao faz nada no CK4"}`,
      [sujar, htmlGravado(c).includes("imgBgAncora")],
      c.versao === 5 ? [1, true] : [0, false],
    );
    if (c.versao === 5) {
      semear(c, ORFA);
      sujar = 0;
      w.SeiProGhs = { semSujar: (fn: () => void) => fn(), estaLiberado: () => false };
      imageBackground.iniciar?.(criarCtx(c));
      igual(
        `image-background ${v}: iniciar espera o GHS (nao escreve enquanto nao liberado)`,
        htmlGravado(c).includes("imgBgAncora"),
        false,
      );
    }
  });
}
