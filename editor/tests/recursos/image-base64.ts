import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { bytesDoBase64, formatarTamanhoBytes, recurso as imageBase64, lerEstilo } from "../../src/recursos/image-base64";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, tique, usarDocumento } from "../dialogo";
import {
  type CasoEditor,
  criarCk4,
  criarCk5,
  cursorEm,
  type FalsoCk4,
  type FalsoCk5,
  nosDoisEditores,
  totalInseridos,
  ultimoInserido,
} from "../falsos";
import { checar, disparar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
type Rec = Record<string, unknown>;

const DADOS = "data:image/png;base64,AAAA";
const DADOS_LARGA = "data:image/png;base64,WIDE";
const JPEG_CURTO = "data:image/jpeg;base64,B";

const avisos = (doc: Document) => doc.body.textContent ?? "";
const limparAvisos = (doc: Document) => {
  for (const a of doc.body.querySelectorAll(".spro-aviso")) a.remove();
};
const campoDe = (d: ParentNode, id: string) => d.querySelector(`#${id}`) as HTMLInputElement;
const definir = (d: ParentNode, id: string, valor: string, evento?: string) => {
  const el = campoDe(d, id);
  el.value = valor;
  if (evento) disparar(el, evento);
};
const arquivoFalso = (conteudo: string, tipo = "image/png") => ({ name: "a.png", type: tipo, conteudo }) as unknown as File;
const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
const htmlInserido = (c: CasoEditor): string => {
  const u = ultimoInserido(c) ?? "";
  return c.versao === 4 && u.startsWith("el:") ? (JSON.parse(u.slice(3)) as { html: string }).html : u;
};

/** Falsos que o linkedom nao tem: Image (carrega em microtarefa), FileReader e canvas. */
function instalarFalsos(c: CasoEditor) {
  const w = c.win as unknown as Rec;
  const dimensoes: Record<string, [number, number]> = { [DADOS_LARGA]: [400, 100] };
  const falhas = new Set<string>();
  const carregadas: string[] = [];
  w.Image = function FalsaImagem() {
    const el = c.doc.createElement("img") as unknown as Rec & HTMLImageElement;
    Object.defineProperty(el, "src", {
      configurable: true,
      get: () => el.getAttribute("src") ?? "",
      set: (v: string) => {
        el.setAttribute("src", v);
        carregadas.push(v);
        queueMicrotask(() => {
          if (falhas.has(v)) return void el.onerror?.(new Event("error"));
          const [lw, lh] = dimensoes[v] ?? [200, 100];
          Object.defineProperty(el, "naturalWidth", { value: lw, configurable: true });
          Object.defineProperty(el, "naturalHeight", { value: lh, configurable: true });
          el.onload?.(new Event("load"));
        });
      },
    });
    return el;
  };
  w.FileReader = class {
    result: string | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;
    readAsDataURL(f: { conteudo: string }) {
      this.result = f.conteudo;
      queueMicrotask(() => this.onload?.());
    }
  };
  const canvasChamadas: Array<[string, number]> = [];
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({ fillStyle: "", fillRect: () => {}, drawImage: () => {} }),
    toDataURL: (tipo: string, q: number) => {
      canvasChamadas.push([tipo, q]);
      return JPEG_CURTO;
    },
  };
  const original = c.doc.createElement.bind(c.doc);
  (c.doc as unknown as Rec).createElement = (tag: string) => (tag === "canvas" ? canvas : original(tag));
  return { w, dimensoes, falhas, carregadas, canvasChamadas };
}

function contexto(c: { win: Window; doc: Document }, extra: Partial<Contexto> = {}): Contexto {
  return {
    adaptador: criarAdaptador(c.win),
    doc: c.doc,
    win: c.win,
    base: "",
    checkOpcao: () => true,
    verifyOpcao: () => false,
    ...extra,
  };
}

export async function verificarImageBase64(): Promise<void> {
  secao("recurso image-base64");

  // ---------- puros ----------
  igual(
    "formatarTamanhoBytes: Kb, Mb e Gb",
    [formatarTamanhoBytes(3), formatarTamanhoBytes(2 * 1048576 + 1), formatarTamanhoBytes(3 * 1073741824)],
    ["0 Kb", "2 Mb", "3 Gb"],
  );
  igual(
    "bytesDoBase64: conta sem decodificar; invalido vira null",
    [bytesDoBase64("AAAA"), bytesDoBase64("AA=="), bytesDoBase64("AAA="), bytesDoBase64("@@")],
    [3, 1, 2, null],
  );
  igual(
    "lerEstilo: declaracoes do atributo style",
    [...lerEstilo(htmlParaNos(document0(), '<span style="a:1; B : 2px;;c"></span>')[0] as Element)],
    [
      ["a", "1"],
      ["b", "2px"],
    ],
  );

  await nosDoisEditores("image-base64", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const ctx = contexto(c);
    const g = imageBase64.globais(ctx) as Record<string, Fn>;
    igual(`image-base64 ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDialogUploadImgBase64",
      "initDialogUploadImgBase64",
      "openDialogUploadImgBase64",
    ]);
    checar(
      `image-base64 ${v}: id do recurso e init/get sao no-op`,
      imageBase64.id === "image-base64" && g.initDialogUploadImgBase64() === undefined,
    );

    // ---- sem FileReader: so a URL ----
    g.openDialogUploadImgBase64(null);
    let d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      `image-base64 ${v}: sem FileReader so ha o campo de URL`,
      !!d && !d.querySelector("#b64_dropzone") && !d.querySelector("#b64_filecheckbox") && !!d.querySelector("#b64_url"),
    );
    clicar(c.doc.body, "Fechar");
    checar(`image-base64 ${v}: o X fecha`, !dialogoAberto(c.doc));

    const f = instalarFalsos(c);
    f.w.qualityImages = undefined;

    // ---- dialogo ----
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    const ids = [
      "dialogUploadImgBase64Pro",
      "b64Tabs",
      "b64TabSource",
      "b64TabProps",
      "b64_filecheckbox",
      "b64_dropzone",
      "b64_file",
      "b64_urlcheckbox",
      "b64_url",
      "b64_loading",
      "b64_preview",
      "b64_alt",
      "b64_width",
      "b64_height",
      "b64_lock",
      "b64_vmargin",
      "b64_hmargin",
      "b64_border",
      "b64_maxwidth",
      "b64_maxheight",
      "b64_align",
      "b64_quality",
      "b64_filter",
      "b64_imglength",
    ];
    igual(
      `image-base64 ${v}: todos os ids do legado existem`,
      ids.filter((i) => !d.querySelector(`#${i}`)),
      [],
    );
    checar(
      `image-base64 ${v}: titulo Imagem, botao Inserir, sem Cancelar`,
      d.querySelector("h2")?.textContent === "Imagem" &&
        [...d.querySelectorAll("button")].some((b) => b.textContent === "Inserir") &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    igual(
      `image-base64 ${v}: padroes (margens 0, qualidade 60, travar marcado)`,
      [
        ids.slice(15, 18).map((i) => campoDe(d, i).value),
        campoDe(d, "b64_quality").value,
        campoDe(d, "b64_lock").hasAttribute("checked"),
        d.querySelector("#b64Tab_source")?.getAttribute("aria-selected"),
      ].flat(),
      ["0", "0", "0", "60", true, "true"],
    );
    checar(
      `image-base64 ${v}: previa vazia e legenda de arrastar`,
      (d.querySelector("#b64_preview")?.childNodes.length ?? 1) === 0 &&
        /Arraste arquivos para cá/.test(d.querySelector("#b64_dropzone")?.textContent ?? ""),
    );

    // ---- vazio e hostil ----
    clicar(d, "Inserir");
    await tique(10);
    checar(
      `image-base64 ${v}: sem imagem nem URL avisa e nao fecha`,
      /Escolha uma imagem ou informe a URL/.test(avisos(c.doc)) && !!dialogoAberto(c.doc),
    );
    limparAvisos(c.doc);
    definir(d, "b64_url", "javascript:alert(1)");
    clicar(d, "Inserir");
    await tique(10);
    checar(
      `image-base64 ${v}: URL que nao e http(s) e recusada`,
      /URL de imagem válida/.test(avisos(c.doc)) && totalInseridos(c) === 0 && !!dialogoAberto(c.doc),
    );
    limparAvisos(c.doc);
    definir(d, "b64_url", "");

    // ---- arquivo que nao e imagem ----
    const entrada = campoDe(d, "b64_file") as unknown as Rec;
    entrada.files = [arquivoFalso("x", "text/plain")];
    disparar(entrada as unknown as Element, "change");
    await tique(10);
    checar(
      `image-base64 ${v}: arquivo que nao e imagem avisa e nao deixa "Carregando"`,
      /Escolha um arquivo de imagem/.test(avisos(c.doc)) &&
        d.querySelector("#b64_loading")?.textContent === "" &&
        d.querySelectorAll("#b64_preview img").length === 0,
    );
    limparAvisos(c.doc);

    // ---- arquivo de imagem: previa, tamanho natural e insercao ----
    entrada.files = [arquivoFalso(DADOS)];
    disparar(entrada as unknown as Element, "change");
    checar(`image-base64 ${v}: mostra Carregando enquanto le`, d.querySelector("#b64_loading")?.textContent === "Carregando...");
    await tique(10);
    igual(
      `image-base64 ${v}: previa carregada e tamanho natural nos campos`,
      [
        d.querySelectorAll("#b64_preview img.previewImage").length,
        campoDe(d, "b64_width").value,
        campoDe(d, "b64_height").value,
        d.querySelector("#b64_loading")?.textContent,
        d.querySelector("#b64_preview img")?.getAttribute("data-width"),
      ],
      [1, "200", "100", "", "200"],
    );
    // travar proporcoes: largura mexe na altura (proporcao 2:1); destravado, nao
    definir(d, "b64_width", "400", "keyup");
    igual(`image-base64 ${v}: travar proporcoes recalcula a altura`, campoDe(d, "b64_height").value, "200");
    definir(d, "b64_height", "50", "keyup");
    igual(`image-base64 ${v}: e a largura a partir da altura`, campoDe(d, "b64_width").value, "100");
    definir(d, "b64_width", "50%", "keyup");
    igual(`image-base64 ${v}: em % mantem a unidade`, [campoDe(d, "b64_width").value, campoDe(d, "b64_height").value], ["50%", "25%"]);
    const lock = campoDe(d, "b64_lock");
    lock.removeAttribute("checked");
    (lock as unknown as Rec).checked = false;
    disparar(lock, "change");
    definir(d, "b64_width", "300", "keyup");
    igual(`image-base64 ${v}: destravado a altura nao muda`, campoDe(d, "b64_height").value, "25%");
    (lock as unknown as Rec).checked = true;
    lock.setAttribute("checked", "checked");
    definir(d, "b64_width", "200px");
    disparar(lock, "change");
    igual(
      `image-base64 ${v}: travar de novo recalcula pela largura`,
      [campoDe(d, "b64_width").value, campoDe(d, "b64_height").value],
      ["200", "100"],
    );

    // margens: so inteiros
    definir(d, "b64_vmargin", "12abc", "keyup");
    definir(d, "b64_hmargin", "", "keyup");
    definir(d, "b64_border", "7%", "keyup");
    igual(
      `image-base64 ${v}: campos de margem e borda ficam inteiros`,
      ["b64_vmargin", "b64_hmargin", "b64_border"].map((i) => campoDe(d, i).value),
      ["12", "0", "7%"],
    );
    definir(d, "b64_vmargin", "0", "keyup");
    definir(d, "b64_border", "0", "keyup");

    // 1. tamanho natural intacto: cada arquivo guarda o seu
    definir(d, "b64_width", "200", "keyup");
    clicar(d, "Inserir");
    await tique(20);
    checar(`image-base64 ${v}: Inserir fecha o dialogo`, !dialogoAberto(c.doc));
    checar(`image-base64 ${v}: uma unica insercao`, totalInseridos(c) === 1, totalInseridos(c));
    let html = htmlInserido(c);
    if (c.versao === 4) {
      igual(
        `image-base64 ${v}: CK4 insere <img> com alt, tamanho natural e qualidade (60%)`,
        html,
        `<img src="${DADOS}" alt="" width="200" height="100" vspace="0" hspace="0" border="0" quality="0.6" ` +
          `style="margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px;border:0px solid black;">`,
      );
    } else {
      igual(
        `image-base64 ${v}: CK5 recomprime em JPEG e poe a largura no estilo`,
        html,
        `<img src="${JPEG_CURTO}" alt="" style="width:200px;">`,
      );
      igual(`image-base64 ${v}: o canvas recebeu jpeg e a qualidade (0.6)`, f.canvasChamadas.at(-1), ["image/jpeg", 0.6]);
    }

    // 2. propriedades: alt, margens, borda, alinhamento, filtro, qualidade
    f.canvasChamadas.length = 0;
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    (campoDe(d, "b64_file") as unknown as Rec).files = [arquivoFalso(DADOS)];
    disparar(campoDe(d, "b64_file"), "change");
    await tique(10);
    definir(d, "b64_alt", '  foto "A" <b>  ');
    definir(d, "b64_width", "300", "keyup");
    definir(d, "b64_vmargin", "5");
    definir(d, "b64_hmargin", "-3");
    definir(d, "b64_border", "2");
    definir(d, "b64_align", "left");
    definir(d, "b64_filter", "grayscale");
    definir(d, "b64_quality", "80");
    clicar(d, "Inserir");
    await tique(20);
    html = htmlInserido(c);
    if (c.versao === 4) {
      igual(
        `image-base64 ${v}: CK4 atributos e estilos na ordem do legado (margem horizontal negativa ignorada)`,
        html,
        `<img src="${DADOS}" alt="foto &quot;A&quot; &lt;b&gt;" width="300" height="150" vspace="5" align="left" filter="grayscale" border="2" quality="0.8" ` +
          `style="width:300px;height:150px;margin-top:5px;margin-bottom:5px;float:left;filter:grayscale(1);border:2px solid black;">`,
      );
    } else {
      igual(
        `image-base64 ${v}: CK5 poe margem, borda, filtro e alinhamento num span; alt escapado`,
        html,
        `<span style="display:inline-block;margin-top:5px;margin-bottom:5px;float:left;filter:grayscale(1);border:2px solid black;">` +
          `<img src="${JPEG_CURTO}" alt="foto &quot;A&quot; &lt;b&gt;" style="width:300px;"></span>`,
      );
      igual(`image-base64 ${v}: qualidade 80 chega ao canvas`, f.canvasChamadas.at(-1), ["image/jpeg", 0.8]);
    }
    checar(`image-base64 ${v}: alt hostil nunca vira marcacao`, !/<b>|alt="foto "A/.test(html));

    // 3. largura maxima descarta a altura; valores invalidos sao ignorados; qualidade invalida cai na configurada
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    (campoDe(d, "b64_file") as unknown as Rec).files = [arquivoFalso(DADOS)];
    disparar(campoDe(d, "b64_file"), "change");
    await tique(10);
    definir(d, "b64_width", "abc");
    definir(d, "b64_height", "0");
    definir(d, "b64_maxwidth", "150");
    definir(d, "b64_vmargin", "-3");
    definir(d, "b64_quality", "abc");
    clicar(d, "Inserir");
    await tique(20);
    html = htmlInserido(c);
    if (c.versao === 4) {
      igual(
        `image-base64 ${v}: largura maxima descarta altura; invalidos somem; qualidade invalida usa a configurada`,
        html,
        `<img src="${DADOS}" alt="" maxwidth="150" hspace="0" border="0" quality="0.6" ` +
          `style="max-width:150px;object-fit: contain;margin-left:0px;margin-right:0px;border:0px solid black;">`,
      );
    } else {
      igual(
        `image-base64 ${v}: CK5 leva a largura maxima so no span (sem object-fit)`,
        html,
        `<span style="max-width:150px;"><img src="${JPEG_CURTO}" alt=""></span>`,
      );
    }

    // 4. qualidade acima de 100% e limitada a 100%; qualidade 0 configurada nao grava o atributo
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    (campoDe(d, "b64_file") as unknown as Rec).files = [arquivoFalso(DADOS)];
    disparar(campoDe(d, "b64_file"), "change");
    await tique(10);
    definir(d, "b64_quality", "500");
    clicar(d, "Inserir");
    await tique(20);
    html = htmlInserido(c);
    checar(
      `image-base64 ${v}: qualidade acima de 100 vira 1`,
      c.versao === 4 ? /quality="1"/.test(html) : html === `<img src="${DADOS}" alt="" style="width:200px;">`,
      html,
    );
    f.w.qualidadeImagens = 0;
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    igual(`image-base64 ${v}: qualidade 0 na configuracao abre o campo em 1`, campoDe(d, "b64_quality").value, "1");
    (campoDe(d, "b64_file") as unknown as Rec).files = [arquivoFalso(DADOS)];
    disparar(campoDe(d, "b64_file"), "change");
    await tique(10);
    clicar(d, "Inserir");
    await tique(20);
    checar(`image-base64 ${v}: sem qualidade configurada nao ha atributo quality`, !/quality=/.test(htmlInserido(c)), htmlInserido(c));
    f.w.qualidadeImagens = undefined;

    // 5. varios arquivos (arrastar e soltar): um por vez, na ordem, cada um com o seu tamanho natural
    const antes = totalInseridos(c);
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    const Ev = (c.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const soltar = new Ev("drop", { bubbles: true, cancelable: true });
    (soltar as unknown as Rec).dataTransfer = { files: [arquivoFalso(DADOS), arquivoFalso(DADOS_LARGA), arquivoFalso("t", "text/plain")] };
    const sobre = new Ev("dragover", { bubbles: true, cancelable: true });
    d.querySelector("#b64_dropzone")?.dispatchEvent(sobre);
    d.querySelector("#b64_dropzone")?.dispatchEvent(soltar);
    await tique(10);
    igual(
      `image-base64 ${v}: arrastar e soltar carrega as duas imagens (ignora o texto) e cancela o padrao do navegador`,
      [d.querySelectorAll("#b64_preview img.previewImage").length, sobre.defaultPrevented, soltar.defaultPrevented],
      [2, true, true],
    );
    clicar(d, "Inserir");
    await tique(30);
    igual(`image-base64 ${v}: duas insercoes`, totalInseridos(c) - antes, 2);
    if (c.versao === 4) {
      const ins = (c.ed as FalsoCk4)
        .instancia("txaEditor_1")
        .inseridos.slice(-2)
        .map((s) => (JSON.parse(s.slice(3)) as { html: string }).html);
      igual(
        `image-base64 ${v}: cada arquivo mantem a sua largura natural`,
        ins.map((h) => /width="(\d+)"/.exec(h)?.[1]),
        ["200", "400"],
      );
    }

    // 6. URL: previa + conversao em base64 (change e blur juntos nao duplicam)
    const convertidas: string[] = [];
    const ctxUrl = contexto(c, {
      imagemParaDataUri: async (s: string) => {
        convertidas.push(s);
        return DADOS;
      },
    });
    const gUrl = imageBase64.globais(ctxUrl) as Record<string, Fn>;
    gUrl.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    definir(d, "b64_url", "https://exemplo.gov.br/foto.png", "change");
    disparar(campoDe(d, "b64_url"), "blur");
    await tique(10);
    igual(
      `image-base64 ${v}: a URL vira uma unica previa convertida em base64`,
      [d.querySelectorAll("#b64_preview img").length, d.querySelector("#b64_preview img")?.getAttribute("src"), convertidas],
      [1, DADOS, ["https://exemplo.gov.br/foto.png"]],
    );
    clicar(d, "Inserir");
    await tique(20);
    checar(
      `image-base64 ${v}: insere a imagem convertida`,
      htmlInserido(c).includes(DADOS) || htmlInserido(c).includes(JPEG_CURTO),
      htmlInserido(c),
    );

    // URL que o servidor nao deixa copiar: fica com a URL, a insercao e recusada e o dialogo continua
    const total = totalInseridos(c);
    const ctxFalha = contexto(c, { imagemParaDataUri: () => Promise.reject(new Error("CORS")) });
    (imageBase64.globais(ctxFalha) as Record<string, Fn>).openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    definir(d, "b64_url", "https://exemplo.gov.br/outra.png", "change");
    await tique(10);
    clicar(d, "Inserir");
    await tique(20);
    checar(
      `image-base64 ${v}: URL nao convertida avisa, nao insere e nao fecha`,
      /não permite a cópia/.test(avisos(c.doc)) && totalInseridos(c) === total && !!dialogoAberto(c.doc),
    );
    limparAvisos(c.doc);
    // sem previa carregada (imagem quebrada): a URL http entra direto
    f.falhas.add("https://exemplo.gov.br/quebrada.png");
    definir(d, "b64_url", "https://exemplo.gov.br/quebrada.png", "change");
    await tique(10);
    checar(`image-base64 ${v}: imagem que nao carrega limpa o Carregando`, d.querySelector("#b64_loading")?.textContent === "");
    clicar(c.doc.body, "Fechar");

    const ctxQuebrada = contexto(c);
    (imageBase64.globais(ctxQuebrada) as Record<string, Fn>).openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    definir(d, "b64_url", "https://exemplo.gov.br/quebrada.png");
    const total2 = totalInseridos(c);
    clicar(d, "Inserir");
    await tique(20);
    checar(
      `image-base64 ${v}: so a URL preenchida (sem previa) entra como <img src=url>`,
      totalInseridos(c) === total2 + 1 && htmlInserido(c).includes('src="https://exemplo.gov.br/quebrada.png"'),
      htmlInserido(c),
    );

    // URL hostil com aspas nunca escapa do atributo
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    definir(d, "b64_url", 'https://a.gov.br/x"onerror="alert(1)');
    clicar(d, "Inserir");
    await tique(20);
    checar(
      `image-base64 ${v}: aspas na URL ficam escapadas`,
      htmlInserido(c).includes("&quot;onerror=&quot;") && !htmlInserido(c).includes('"onerror="'),
      htmlInserido(c),
    );
    for (const dlg of c.doc.querySelectorAll("dialog")) dlg.remove();
    f.falhas.clear();

    // ---- imagem selecionada: pre-preenche, "Aplicar" e atualiza no lugar ----
    const corpo = corpoDe(c);
    const base = `src="${DADOS}" width="50" height="25" alt="foto" hspace="3" vspace="4" border="1" align="left" filter="sepia" quality="0.29"`;
    const marcado =
      c.versao === 4
        ? `<p id="pi"><img id="im" ${base}></p>`
        : `<p id="pi"><span style="display:inline-block;margin-top:9px;margin-bottom:9px;margin-left:8px;margin-right:8px;border:2px solid black;float:right;filter:invert(1);max-width:70px;">` +
          `<span class="ck-widget"><img id="im" ${base}></span></span></p>`;
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, marcado));
    const img = corpo.querySelector("#im") as HTMLElement;
    cursorEm(c, img);
    const antesSel = totalInseridos(c);
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      `image-base64 ${v}: com imagem selecionada o botao e Aplicar e abre em Propriedades`,
      [...d.querySelectorAll("button")].some((b) => b.textContent === "Aplicar") &&
        d.querySelector("#b64Tab_props")?.getAttribute("aria-selected") === "true",
    );
    igual(
      `image-base64 ${v}: pre-preenche os campos a partir da imagem`,
      ["b64_alt", "b64_width", "b64_height", "b64_quality", "b64_align", "b64_filter"].map((i) => campoDe(d, i).value),
      c.versao === 4 ? ["foto", "50", "25", "29", "left", "sepia"] : ["foto", "50", "25", "29", "right", "invert"],
    );
    igual(
      `image-base64 ${v}: margens e borda (CK5 le o span do widget)`,
      ["b64_hmargin", "b64_vmargin", "b64_border", "b64_maxwidth"].map((i) => campoDe(d, i).value),
      c.versao === 4 ? ["3", "4", "1", "0"] : ["8", "9", "2", "70"],
    );
    igual(`image-base64 ${v}: mostra o tamanho do arquivo`, d.querySelector("#b64_imglength")?.textContent, "Tamanho da imagem: 0 Kb");
    await tique(10);
    igual(`image-base64 ${v}: a propria imagem aparece na previa`, d.querySelectorAll("#b64_preview img.previewImage").length, 1);
    definir(d, "b64_alt", "nova legenda");

    if (c.versao === 4) {
      clicar(d, "Aplicar");
      await tique(20);
      igual(
        `image-base64 ${v}: CK4 troca os atributos da imagem selecionada no lugar`,
        [img.getAttribute("alt"), img.getAttribute("width"), img.getAttribute("align"), totalInseridos(c) - antesSel],
        ["nova legenda", "50", "left", 0],
      );
      checar(
        `image-base64 ${v}: o estilo da imagem foi montado`,
        /float:left/.test(img.getAttribute("style") ?? ""),
        img.getAttribute("style"),
      );
    } else {
      // modelo do CK5 falso: a imagem em linha, e o que o conversor do HTML do dialogo devolve
      const ed = (c.ed as FalsoCk5).instancia() as unknown as Rec & {
        editing: { mapper: Rec };
        data: { toModel: unknown; processor: { toView: unknown } };
        model: Rec;
      };
      const registro: { html: string; removidos: string[]; definidos: Array<[string, unknown]>; inseridos: unknown[] } = {
        html: "",
        removidos: [],
        definidos: [],
        inseridos: [],
      };
      const no = (name: string, attrs: Array<[string, unknown]>) => ({
        name,
        is: (t: string) => t === "element",
        getChildren: () => [],
        getAttributes: () => attrs,
        getAttributeKeys: () => attrs.map((a) => a[0]),
      });
      const atual = no("imageInline", [
        ["src", DADOS],
        ["alt", "foto"],
        ["resizedWidth", "50px"],
      ]);
      ed.editing.mapper.toModelElement = () => atual;
      ed.data.processor.toView = (h: string) => {
        registro.html = h;
        return { html: h };
      };
      ed.data.toModel = () => ({
        getChildren: () => [
          no("imageInline", [
            ["src", DADOS],
            ["alt", "nova legenda"],
          ]),
        ],
      });
      ed.model.createRangeOn = (e: unknown) => ({ em: e });
      ed.model.insertContent = (conteudo: unknown) => registro.inseridos.push(conteudo);
      ed.model.change = (fn: (w: unknown) => void) =>
        fn({
          removeAttribute: (k: string) => registro.removidos.push(k),
          setAttribute: (k: string, val: unknown) => registro.definidos.push([k, val]),
        });
      clicar(d, "Aplicar");
      await tique(20);

      checar(
        `image-base64 ${v}: CK5 passa o HTML com o span e atualiza os atributos do model (remove o que sobrou)`,
        registro.html.startsWith(
          '<span style="display:inline-block;max-width:70px;margin-top:9px;margin-bottom:9px;margin-left:8px;margin-right:8px;float:right;filter:invert(1);border:2px solid black;">',
        ) && registro.html.includes('alt="nova legenda"'),
        registro.html,
      );
      igual(
        `image-base64 ${v}: so remove o atributo que o novo nao tem e grava o resto`,
        [registro.removidos, registro.definidos, totalInseridos(c) - antesSel],
        [
          ["resizedWidth"],
          [
            ["src", DADOS],
            ["alt", "nova legenda"],
          ],
          0,
        ],
      );
      // imagem em bloco: sem span, avisa onde ficam as margens
      cursorEm(c, img);
      limparAvisos(c.doc);
      registro.html = "";
      registro.removidos.length = 0;
      registro.definidos.length = 0;
      ed.editing.mapper.toModelElement = () => no("imageBlock", [["src", DADOS]]);
      ed.data.toModel = () => ({
        getChildren: () => [
          no("imageBlock", [
            ["src", DADOS],
            ["alt", "x"],
          ]),
        ],
      });
      g.openDialogUploadImgBase64(null);
      d = dialogoAberto(c.doc) as HTMLElement;
      await tique(10);
      clicar(d, "Aplicar");
      await tique(20);
      checar(
        `image-base64 ${v}: imagem em bloco: sem span e com o aviso do SEI 5`,
        !registro.html.startsWith("<span") && /Texto ao redor/.test(avisos(c.doc)),
        registro.html,
      );
      // sem mapeamento para o model: cai na insercao pelo adaptador
      ed.editing.mapper.toModelElement = () => null;
      const antesFallback = registro.inseridos.length;
      g.openDialogUploadImgBase64(null);
      d = dialogoAberto(c.doc) as HTMLElement;
      await tique(10);
      clicar(d, "Aplicar");
      await tique(20);
      igual(`image-base64 ${v}: sem model da imagem insere pelo adaptador`, registro.inseridos.length - antesFallback, 1);
    }
    checar(`image-base64 ${v}: Aplicar fecha o dialogo`, !dialogoAberto(c.doc));

    // imagem informada pelo chamador (menu de contexto/barra da imagem) ganha da selecao
    const outra = c.doc.createElement("img");
    outra.setAttribute("src", "https://x/y.png");
    outra.setAttribute("alt", "informada");
    g.openDialogUploadImgBase64(null, outra);
    d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `image-base64 ${v}: imagem informada pre-preenche e URL externa vai para o campo de URL`,
      [campoDe(d, "b64_alt").value, campoDe(d, "b64_url").value],
      ["informada", "https://x/y.png"],
    );
    clicar(c.doc.body, "Fechar");

    // cursor num paragrafo com imagem dentro: pega a imagem (como o legado); sem imagem: Inserir
    cursorEm(c, corpo.querySelector("#pi"));
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      `image-base64 ${v}: cursor num paragrafo com imagem a trata como selecionada`,
      [...d.querySelectorAll("button")].some((b) => b.textContent === "Aplicar"),
    );
    clicar(c.doc.body, "Fechar");
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, '<p id="vazio">so texto</p>'));
    cursorEm(c, corpo.querySelector("#vazio"));
    g.openDialogUploadImgBase64(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      `image-base64 ${v}: sem imagem no cursor o botao e Inserir`,
      [...d.querySelectorAll("button")].some((b) => b.textContent === "Inserir"),
    );
    clicar(c.doc.body, "Fechar");

    // aceita a instancia do editor no lugar do elemento
    const instancia = ctx.adaptador.getInstance();
    g.openDialogUploadImgBase64(instancia);
    checar(`image-base64 ${v}: aceita a instancia do editor como primeiro argumento`, !!dialogoAberto(c.doc));
    clicar(c.doc.body, "Fechar");
  });

  // ---------- compressao do CK4 pelo monolito ----------
  {
    const ck4 = criarCk4({
      secoes: [
        {
          nome: "txaEditor_1",
          titulo: "Corpo do Texto",
          html: '<p>t</p><img id="velha" src="a.png"><img id="marcada" src="b.png" data-cke-quality-applied="1" quality="0.5">',
        },
      ],
    });
    const c: CasoEditor = { versao: 4, doc: ck4.doc, win: ck4.win, ed: ck4 };
    usarDocumento(c.doc);
    const f = instalarFalsos(c);
    const chamadas: Array<[Element, Element, number]> = [];
    f.w.qualityImages = (o: Element, dst: Element, q: number) => chamadas.push([o, dst, q]);
    f.w.qualidadeImagens = "70";
    const g = imageBase64.globais(contexto(c)) as Record<string, Fn>;
    g.openDialogUploadImgBase64(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    (campoDe(d, "b64_file") as unknown as Rec).files = [arquivoFalso(DADOS)];
    disparar(campoDe(d, "b64_file"), "change");
    await tique(10);
    clicar(d, "Inserir");
    await tique(30);
    const corpo = ck4.instancia("txaEditor_1").corpo;
    igual(
      "image-base64 [CK4]: o qualityImages do monolito roda nas imagens ainda nao tratadas (e so uma vez)",
      [
        chamadas.length,
        Math.round((chamadas[0]?.[2] ?? 0) * 100) / 100,
        corpo.querySelector("#velha")?.getAttribute("data-cke-quality-applied"),
      ],
      [1, 0.7, "1"],
    );
    igual("image-base64 [CK4]: a insercao tambem passou pelo editor", ck4.instancia("txaEditor_1").inseridos.length, 1);
    igual("image-base64 [CK4]: o campo de qualidade abriu na configuracao (70)", campoDe(d, "b64_quality").value, "70");
  }

  // ---------- secao somente leitura ----------
  for (const cenario of [
    { nome: "CK4", ed: criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>t</p>", somenteLeitura: true }] }) },
    {
      nome: "CK5",
      ed: criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>t</p>", principal: true, somenteLeitura: true }] }),
    },
  ]) {
    const c: CasoEditor = { versao: cenario.ed.versao, doc: cenario.ed.doc, win: cenario.ed.win, ed: cenario.ed };
    usarDocumento(c.doc);
    const f = instalarFalsos(c);
    const ctx = contexto(c);
    let recusas = 0;
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    f.w.qualidadeImagens = undefined;
    const g = imageBase64.globais(ctx) as Record<string, Fn>;
    g.openDialogUploadImgBase64(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    (campoDe(d, "b64_file") as unknown as Rec).files = [arquivoFalso(DADOS)];
    disparar(campoDe(d, "b64_file"), "change");
    await tique(10);
    clicar(d, "Inserir");
    await tique(20);
    checar(
      `image-base64 [${cenario.nome}]: secao somente leitura recusa, nao insere e mantem o dialogo aberto`,
      recusas === 1 && totalInseridos(c) === 0 && !!dialogoAberto(c.doc),
      { recusas, inseridos: totalInseridos(c) },
    );
  }
}

/** Documento sem relacao com o dialogo, so para o `DOMParser` dos puros. */
function document0(): Document {
  return criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "t", html: "<p>t</p>" }] }).doc;
}
