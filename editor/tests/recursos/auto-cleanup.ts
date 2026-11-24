import { criarAdaptador } from "../../src/adaptador";
import {
  ATRIBUTOS_PRESERVADOS_CK4_PRO,
  recurso as autoCleanup,
  limparHtml,
  precisaLimpar,
  rgbParaHex,
} from "../../src/recursos/auto-cleanup";
import type { Contexto } from "../../src/recursos/tipos";
import { type CasoEditor, criarCk4, criarCk5, type FalsoCk4, type FalsoCk5, nosDoisEditores, paginaFalsa } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
// biome-ignore lint/suspicious/noExplicitAny: os falsos do CKEditor nao tem tipos para o model/filtros
type Qualquer = any;

const ctxDe = (win: Window, doc: Document): Contexto => ({
  adaptador: criarAdaptador(win),
  doc,
  win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

const espera = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** Regra `$` do htmlFilter do CK4 aplicada a cada elemento do HTML (o que o `getData` do CK4 faz com o filtro de saida). */
function saidaCk4(regras: Qualquer[], html: string, doc: Document): string {
  const Parser = (doc.defaultView as Qualquer).DOMParser;
  const inerte = new Parser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
  for (const el of Array.from(inerte.body.querySelectorAll("*")) as Element[]) {
    const attrs: Record<string, string> = {};
    for (const a of Array.from(el.attributes)) attrs[a.name] = a.value;
    for (const r of regras) r.regras.elements.$({ attributes: attrs });
    for (const a of Array.from(el.attributes)) if (!(a.name in attrs)) el.removeAttribute(a.name);
    for (const k of Object.keys(attrs)) if (el.getAttribute(k) !== attrs[k]) el.setAttribute(k, attrs[k] as string);
  }
  return inerte.body.innerHTML;
}

interface Armadilha {
  /** CK4: regras do htmlFilter registradas. CK5: escutas do `data.on`. */
  regras: Qualquer[];
  /** O que o editor entrega ao SEI ao salvar, partindo de `html` (sem tocar no editor). */
  saida(html: string, opcoes?: Qualquer): string;
}

/** Liga ao falso o que o editor real tem e o falso nao: `dataProcessor.htmlFilter` (CK4) ou o evento `get` de `data` (CK5). */
function armarSaida(c: CasoEditor): Armadilha {
  const regras: Qualquer[] = [];
  if (c.versao === 4) {
    ((c.ed as FalsoCk4).instancia("txaEditor_1") as Qualquer).dataProcessor = {
      htmlFilter: { addRules: (r: unknown, o: unknown) => regras.push({ regras: r, opcoes: o }) },
    };
    return { regras, saida: (html) => saidaCk4(regras, html, c.doc) };
  }
  const inst = (c.ed as FalsoCk5).instancia() as Qualquer;
  inst.data.on = (evento: string, fn: Fn, o: unknown) => regras.push({ evento, fn, o });
  return {
    regras,
    saida(html, opcoes) {
      const evt = { return: html };
      for (const r of regras) if (r.evento === "get") (r.fn as Fn)(evt, [opcoes]);
      return evt.return;
    },
  };
}

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
const editorDe = (c: CasoEditor): object => (c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1") : (c.ed as FalsoCk5).instancia());
const globaisDe = (c: CasoEditor): Record<string, Fn> => autoCleanup.globais(ctxDe(c.win, c.doc)) as Record<string, Fn>;

/** HTML sujo de exemplo: tudo o que a limpeza conhece, mais conteudo legitimo. */
const SUJO =
  '<p class="cke_editable dark-mode-x keep" style="color: rgb(255, 0, 0)" spellcheck="true" data-cke-saved-href="/x" data-sfc-a="1" data-copy-service-id="9" data-hveid="3" data-editor="e" data-processed="1" data-complete="1">' +
  'texto<!--{cke_protected}%3Cb%3E--><span style="background-color:rgba(0,0,0,0.05)">y</span></p>';

export async function verificarAutoCleanup(): Promise<void> {
  // ======== contrato ========
  secao("recurso auto-cleanup: contrato de globais");
  {
    const { doc, win } = paginaFalsa();
    const g = autoCleanup.globais(ctxDe(win, doc));
    igual("id do recurso", autoCleanup.id, "auto-cleanup");
    igual(
      "globais: exatamente os nomes que o monolito/legado exportava",
      Object.keys(g).sort(),
      [
        "ATRIBUTOS_LIXO_PRO",
        "PREFIXOS_ATRIBUTO_LIXO_PRO",
        "PREFIXOS_CLASSE_LIXO_PRO",
        "ATRIBUTOS_PRESERVADOS_CK4_PRO",
        "precisaLimparEditorPro",
        "rgbParaHexPro",
        "limparRaizEditorPro",
        "limparHtmlEditorPro",
        "limparEditorPro",
        "registrarLimpezaAutomaticaPro",
      ].sort(),
    );
    checar("registrarLimpezaAutomaticaPro (necessario ao monolito) e funcao", typeof g.registrarLimpezaAutomaticaPro === "function");
    igual("listas de lixo (atributos)", g.ATRIBUTOS_LIXO_PRO, [
      "contenteditable",
      "spellcheck",
      "data-editor",
      "data-processed",
      "data-complete",
      "data-hveid",
    ]);
    igual("listas de lixo (prefixos de atributo)", g.PREFIXOS_ATRIBUTO_LIXO_PRO, ["data-cke-saved-", "data-sfc-", "data-copy-service"]);
    igual("listas de lixo (prefixos de classe)", g.PREFIXOS_CLASSE_LIXO_PRO, ["cke_", "dark-mode-"]);
    igual("atributo preservado (CK4 e CK5): contenteditable", g.ATRIBUTOS_PRESERVADOS_CK4_PRO, ["contenteditable"]);
    checar("tem iniciar", typeof autoCleanup.iniciar === "function");
  }

  // ======== cores ========
  secao("recurso auto-cleanup: conversao de cores rgb()/rgba() para hexadecimal");
  {
    const { doc, win } = paginaFalsa();
    const g = autoCleanup.globais(ctxDe(win, doc)) as Record<string, Fn>;
    const tabela: Array<[string, string, string]> = [
      ["rgb com virgulas e espacos", "rgb(255, 0, 0)", "#ff0000"],
      ["rgb sem espacos", "rgb(255,0,0)", "#ff0000"],
      ["rgb com espacos extras", "rgb( 255 , 0 , 0 )", "#ff0000"],
      ["RGB em caixa alta", "RGB(1, 2, 3)", "#010203"],
      ["rgba em caixa mista", "RgBa(1, 2, 3, 1)", "#010203"],
      ["sintaxe CSS Color 4 (espacos)", "rgb(206 206 206)", "#cecece"],
      ["rgba alfa 1", "rgba(0, 0, 0, 1)", "#000000"],
      ["rgba alfa maior que 1", "rgba(0, 0, 0, 1.5)", "#000000"],
      ["rgba alfa 0 vira transparent", "rgba(0, 0, 0, 0)", "transparent"],
      ["rgba alfa 0.0 vira transparent", "rgba(10, 20, 30, 0.0)", "transparent"],
      ["rgba alfa .05 composto sobre branco", "rgba(0,0,0,.05)", "#f2f2f2"],
      ["rgba alfa 0.5 composto sobre branco", "rgba(0, 0, 0, 0.5)", "#808080"],
      ["alfa em percentual 50%", "rgb(0 0 0 / 50%)", "#808080"],
      ["alfa em percentual 0%", "rgb(10 20 30 / 0%)", "transparent"],
      ["alfa em percentual 100%", "rgb(10 20 30 / 100%)", "#0a141e"],
      ["alfa com barra e fracao", "rgb(255 0 0 / 0.25)", "#ffbfbf"],
      ["cor ja hexadecimal nao muda", "#ff0000", "#ff0000"],
      ["transparent nao muda", "transparent", "transparent"],
      ["nome de cor nao muda", "red", "red"],
      ["valor invalido (letras) nao muda", "rgb(a, b, c)", "rgb(a, b, c)"],
      ["valor invalido (so dois componentes) nao muda", "rgb(1, 2)", "rgb(1, 2)"],
      ["percentual nos componentes (nao suportado pelo legado) nao muda", "rgb(10%, 20%, 30%)", "rgb(10%, 20%, 30%)"],
      ["dentro de style", "color: rgb(255, 0, 0); font-size: 12px", "color: #ff0000; font-size: 12px"],
      ["border composto", "border: 1px solid rgb(0, 0, 0)", "border: 1px solid #000000"],
      [
        "varias cores na mesma string",
        "background:rgba(255,255,255,1);border-top:2px dotted rgb(1 2 3)",
        "background:#ffffff;border-top:2px dotted #010203",
      ],
      ["sombra com cor e deslocamentos", "box-shadow: 1px 2px 3px rgba(0,0,0,0.2)", "box-shadow: 1px 2px 3px #cccccc"],
    ];
    for (const [nome, entrada, esperado] of tabela) igual(`rgbParaHexPro: ${nome}`, g.rgbParaHexPro(entrada), esperado);
    igual("rgbParaHexPro: vazio volta vazio", g.rgbParaHexPro(""), "");
    igual("rgbParaHexPro: nulo volta nulo", g.rgbParaHexPro(null), null);
    igual("modulo: rgbParaHex puro (sem pagina) usa o hexadecimal local", rgbParaHex("rgb(255, 0, 0)"), "#ff0000");

    // o rgbToHex do monolito, quando existe, manda (como no legado)
    (win as Qualquer).rgbToHex = (r: number, gg: number, b: number) => `#M${r}-${gg}-${b}`;
    igual("rgbToHex do monolito e usado quando existe", g.rgbParaHexPro("rgb(1, 2, 3)"), "#M1-2-3");
    delete (win as Qualquer).rgbToHex;
    igual("sem rgbToHex no monolito, o local assume", g.rgbParaHexPro("rgb(1, 2, 3)"), "#010203");
  }

  // ======== limpeza pura ========
  secao("recurso auto-cleanup: limpeza de HTML (lixo, cores, conteudo legitimo)");
  {
    const { doc, win } = paginaFalsa();
    const g = autoCleanup.globais(ctxDe(win, doc)) as Record<string, Fn>;
    const limpar = (html: string, preservar?: string[]): string => g.limparHtmlEditorPro(html, preservar) as string;
    const P = ATRIBUTOS_PRESERVADOS_CK4_PRO;

    const l = limpar(SUJO, P);
    checar(
      "remove spellcheck, data-editor, data-processed, data-complete, data-hveid",
      !/spellcheck|data-editor|data-processed|data-complete|data-hveid/.test(l),
      l,
    );
    checar("remove prefixos data-cke-saved-*, data-sfc-*, data-copy-service-*", !/data-cke-saved|data-sfc|data-copy-service/.test(l), l);
    checar("remove classes cke_* e dark-mode-*, mantem as demais", /class="keep"/.test(l) && !/cke_|dark-mode-/.test(l), l);
    checar("remove o marcador {cke_protected}", !/cke_protected/.test(l), l);
    checar("converte rgb/rgba do style para hexadecimal", /#ff0000/.test(l) && /#f2f2f2/.test(l) && !/rgba?\(/.test(l), l);
    checar("preserva o texto", l.includes("texto") && l.includes(">y<"), l);

    // classe: todas lixo -> o atributo class some
    const so = limpar('<p class="cke_a dark-mode-b">x</p>', P);
    checar("todas as classes lixo: o atributo class some", !/class/.test(so) && so.includes("<p>x</p>"), so);
    checar(
      "class vazio de origem: a passada de classes nao quebra e o lixo sai",
      /^<p[^>]*>x<\/p>$/.test(limpar('<p class="" data-hveid="1">x</p>', P)) &&
        !/hveid/.test(limpar('<p class="" data-hveid="1">x</p>', P)),
    );

    // conteudo legitimo
    const link =
      '<p><span contenteditable="false"><a class="ancora_sei" href="controlador.php?acao=x" data-cke-saved-href="controlador.php?acao=x" target="_blank">SEI 123</a></span></p>';
    const lk = limpar(link, P);
    checar("link do SEI: contenteditable preservado (CK4 e CK5)", /<span contenteditable="false">/.test(lk), lk);
    checar(
      "link do SEI: classe ancora_sei, href e target preservados",
      /class="ancora_sei"/.test(lk) && /href="controlador\.php\?acao=x"/.test(lk) && /target="_blank"/.test(lk),
      lk,
    );
    checar("link do SEI: data-cke-saved-href removido", !/data-cke-saved/.test(lk), lk);
    checar("sem a lista de preservados, contenteditable e removido (legado)", !/contenteditable/.test(limpar(link)), limpar(link));
    checar("lista vazia de preservados tambem remove contenteditable", !/contenteditable/.test(limpar(link, [])));
    igual(
      "html legitimo e identico (nada a limpar)",
      limpar('<p class="Texto_Justificado">ok <strong>sim</strong></p>', P),
      '<p class="Texto_Justificado">ok <strong>sim</strong></p>',
    );
    igual(
      "so contenteditable e preservado: nada a limpar, volta o mesmo texto",
      limpar(link.replace(' data-cke-saved-href="controlador.php?acao=x"', ""), P),
      link.replace(' data-cke-saved-href="controlador.php?acao=x"', ""),
    );

    // Dark Reader / modo escuro
    const dr = limpar(
      '<p class="dark-mode-contrast keep" data-darkreader-inline-color="" style="--darkreader-inline-color:#fff; color: rgb(1, 2, 3)">x</p>',
      P,
    );
    checar("classes dark-mode-* (realce de contraste) saem do HTML gravado", !/dark-mode-/.test(dr) && /class="keep"/.test(dr), dr);
    checar("cor em rgb no mesmo elemento do Dark Reader e convertida", /color: #010203/.test(dr), dr);
    checar(
      "legado: data-darkreader-* NAO esta na lista de lixo (so aparece junto de outro gatilho)",
      /data-darkreader-inline-color/.test(dr),
      dr,
    );
    igual(
      "legado: so data-darkreader-*, sem gatilho, nao e tocado",
      limpar('<p data-darkreader-inline-color="">x</p>', P),
      '<p data-darkreader-inline-color="">x</p>',
    );

    // cores fora de style
    const att = limpar(
      '<table bgcolor="rgb(255, 0, 0)" border="1"><tr><td color="rgb(1,2,3)" style="border: 1px solid rgba(0,0,0,1)">a</td></tr></table>',
      P,
    );
    checar("border composto dentro de style e convertido", /border: 1px solid #000000/.test(att), att);
    checar(
      "legado: atributos bgcolor/color (fora de style) NAO sao convertidos",
      /bgcolor="rgb\(255, 0, 0\)"/.test(att) && /color="rgb\(1,2,3\)"/.test(att),
      att,
    );

    // heuristica
    igual("precisaLimparEditorPro: HTML limpo", g.precisaLimparEditorPro("<p>oi</p>", P), false);
    igual("precisaLimparEditorPro: rgb", g.precisaLimparEditorPro('<p style="color:rgb(0,0,0)">', P), true);
    igual("precisaLimparEditorPro: classe cke_", g.precisaLimparEditorPro('<p class="cke_x">', P), true);
    igual("precisaLimparEditorPro: contenteditable com preservados", g.precisaLimparEditorPro('<span contenteditable="false">', P), false);
    igual(
      "precisaLimparEditorPro: contenteditable sem preservados",
      g.precisaLimparEditorPro('<span contenteditable="false">', undefined),
      true,
    );
    igual("precisaLimparEditorPro: on* em tag", g.precisaLimparEditorPro('<img src="x" onerror="a()">', P), true);
    igual("precisaLimparEditorPro: javascript: em href", g.precisaLimparEditorPro('<a href="javascript:a()">', P), true);
    checar("precisaLimpar exportado do modulo e o mesmo da global", precisaLimpar('<p class="cke_x">') === true);

    // limparRaizEditorPro in-place
    const raiz = doc.createElement("div");
    for (const n of (await import("../../src/adaptador/html")).htmlParaNos(doc, SUJO + '<p contenteditable="false">cc</p>')) raiz.append(n);
    const volta = g.limparRaizEditorPro(raiz, P);
    checar("limparRaizEditorPro devolve a propria raiz", volta === raiz);
    checar(
      "limparRaizEditorPro: in-place (lixo some, contenteditable fica)",
      !/cke_|data-sfc|spellcheck|rgb/.test(raiz.innerHTML) && /contenteditable="false"/.test(raiz.innerHTML),
      raiz.innerHTML,
    );

    // idempotencia
    const uma = limpar(SUJO, P);
    igual("idempotencia: limpar duas vezes = limpar uma", limpar(uma, P), uma);
    igual("idempotencia (sem preservados)", limpar(limpar(SUJO)), limpar(SUJO));
  }

  // ======== entradas degeneradas / hostis ========
  secao("recurso auto-cleanup: HTML vazio, enorme e hostil");
  {
    const { doc, win } = paginaFalsa();
    const g = autoCleanup.globais(ctxDe(win, doc)) as Record<string, Fn>;
    const limpar = (html: unknown): unknown => g.limparHtmlEditorPro(html, ATRIBUTOS_PRESERVADOS_CK4_PRO);
    igual("vazio", limpar(""), "");
    igual("nao-string passa direto (nulo)", limpar(null), null);
    igual("nao-string passa direto (indefinido)", limpar(undefined), undefined);
    igual("so espacos", limpar("   "), "   ");

    const hostil = limpar(
      '<p onclick="a()" onmouseover = "b()">x<img src="x" onerror="alert(1)"><a href="javascript:alert(1)" class="cke_x">l</a><a href=" JaVaScRiPt:alert(2)">m</a><a href="data:text/html,<b>x</b>">n</a><iframe src="vbscript:x"></iframe></p>',
    ) as string;
    checar("remove atributos de evento (on*)", !/onclick|onmouseover|onerror/i.test(hostil), hostil);
    checar(
      "remove URL javascript:/vbscript:/data:text/html (inclusive com espaco e caixa mista)",
      !/javascript:|vbscript:|data:text\/html/i.test(hostil),
      hostil,
    );
    checar("conserva o texto dos links", hostil.includes(">l<") && hostil.includes(">m<") && hostil.includes(">n<"), hostil);
    const legit = limpar(
      '<p><img src="data:image/png;base64,AAAA"><a href="https://exemplo.gov.br/a?b=1">ok</a> <span class="cke_x">z</span></p>',
    ) as string;
    checar(
      "imagem em data:image e link https sao conservados",
      /src="data:image\/png;base64,AAAA"/.test(legit) && /href="https:\/\/exemplo\.gov\.br\/a\?b=1"/.test(legit),
      legit,
    );
    const script = limpar('<p class="cke_x">a</p><script>var x = "rgb(1,2,3)";</script>') as string;
    checar(
      "legado: <script> nao e removido (so o lixo conhecido); fica inerte no parser",
      /<script>/.test(script) && !/class/.test(script),
      script,
    );

    // enorme
    const N = 4000;
    const grande = Array.from({ length: N }, (_, i) => `<p class="cke_a k${i}" style="color: rgb(${i % 256}, 0, 0)">linha ${i}</p>`).join(
      "",
    );
    const t0 = Date.now();
    const gl = limpar(grande) as string;
    const dt = Date.now() - t0;
    checar(
      `documento enorme (${N} paragrafos): limpo e rapido (${dt} ms)`,
      !/rgb|cke_/.test(gl) && gl.includes("linha 3999") && dt < 5000,
      { dt },
    );
    igual("documento enorme: mesmo numero de paragrafos", (gl.match(/<p /g) ?? []).length, N);
    const profundo = `${"<div>".repeat(300)}<span class="cke_x" style="color:rgb(1,2,3)">fundo</span>${"</div>".repeat(300)}`;
    checar("aninhamento profundo e tratado", /#010203/.test(limpar(profundo) as string));
    // leading comment/whitespace preservados no corpo (o embrulho do DOMParser)
    checar("espaco inicial e comentario comum sao preservados", /^ <!--oi-->/.test(limpar(' <!--oi--><p class="cke_x">a</p>') as string));
    igual(
      "comentario sem cke_protected NAO e removido",
      (limpar('<p class="cke_x">a<!-- fica --></p>') as string).includes("<!-- fica -->"),
      true,
    );
    checar(
      "{cke_protected} dentro de elemento aninhado e removido",
      !/cke_protected/.test(limpar("<div><p>a<!--{cke_protected}%3Cx%3E-->b</p></div>") as string),
    );
    checar(
      "modulo: limparHtml com Parser explicito",
      limparHtml('<p class="cke_x">a</p>', undefined, (doc.defaultView as Qualquer).DOMParser) === "<p>a</p>",
    );
  }

  // ======== filtro de saida ========
  await nosDoisEditores("auto-cleanup filtro de saida", async (c) => {
    secao(`recurso auto-cleanup: filtro de saida ao salvar [CK${c.versao}]`);
    const g = globaisDe(c);
    const e = editorDe(c) as Qualquer;
    const arm = armarSaida(c);
    const corpo = corpoDe(c);
    // o DOM vivo traz lixo legitimo para o editor: contenteditable e classes de contraste do modo escuro
    corpo.innerHTML = `${SUJO}<p><span contenteditable="false"><a class="ancora_sei" href="x">SEI 1</a></span></p>`;
    const antes = corpo.innerHTML;
    const dadosAntes = c.versao === 5 ? (c.ed as FalsoCk5).instancia().dadosPorRaiz.main : "";
    const sel = c.versao === 4 ? JSON.stringify((c.ed as FalsoCk4).instancia("txaEditor_1").selecao) : "";

    g.registrarLimpezaAutomaticaPro(e);
    igual("registra o filtro uma vez", arm.regras.length, 1);
    g.registrarLimpezaAutomaticaPro(e);
    igual("idempotente: registrar de novo nao duplica", arm.regras.length, 1);
    checar("marca a instancia como registrada", e._limpezaProRegistrada === true);

    const html = `${SUJO}<p><span contenteditable="false" spellcheck="false"><a class="ancora_sei" href="x" data-cke-saved-href="x">SEI 1</a></span></p>`;
    const saida = arm.saida(html);
    checar(
      "saida: remove lixo (atributos, prefixos, classes)",
      !/spellcheck|data-hveid|data-editor|data-sfc|data-copy-service|cke_[a-oq-z]|dark-mode-/.test(saida),
      saida,
    );
    checar("saida: converte as cores para hexadecimal", /#ff0000/.test(saida) && /#f2f2f2/.test(saida) && !/rgba?\(/.test(saida), saida);
    checar("saida: contenteditable do link do SEI preservado", /<span contenteditable="false">/.test(saida), saida);
    checar("saida: classe legitima e link do SEI preservados", /class="keep"/.test(saida) && /class="ancora_sei"/.test(saida), saida);
    if (c.versao === 4) {
      checar("CK4: data-cke-saved-href fica por conta do CK4 (o filtro nao o toca)", /data-cke-saved-href/.test(saida), saida);
      igual("CK4: regra com applyToAll", arm.regras[0].opcoes, { applyToAll: true });
    } else {
      checar("CK5: marcador {cke_protected} da saida e removido", !/cke_protected/.test(saida), saida);
      igual("CK5: prioridade baixa (depois do HTML montado)", arm.regras[0].o, { priority: "low" });
      igual("CK5: vai-e-volta interno (seiProInterno) nao e filtrado", arm.saida(html, { seiProInterno: true }), html);
    }
    // nao mexe no editor vivo
    igual("DOM vivo intacto (nada reescrito, cursor/atributos como estavam)", corpo.innerHTML, antes);
    if (c.versao === 4) {
      const i = (c.ed as FalsoCk4).instancia("txaEditor_1");
      igual(
        "CK4: sem setData/comandos/snapshot/foco (cursor nao se mexe)",
        [i.comandos.length, i.snapshots, i.focos, JSON.stringify(i.selecao)],
        [0, 0, 0, sel],
      );
    } else {
      const i = (c.ed as FalsoCk5).instancia();
      igual(
        "CK5: model intacto (sem model.change, sem selecao, sem data.set)",
        [i.mudancas, i.selecoesDefinidas.length, i.dadosPorRaiz.main],
        [0, 0, dadosAntes],
      );
    }
    igual("saida idempotente", arm.saida(saida), saida);
    igual("saida de HTML limpo e identica", arm.saida("<p>ok</p>"), "<p>ok</p>");
    if (c.versao === 5)
      checar(
        "hostil na saida: on* e javascript: saem",
        !/onerror|javascript:/i.test(arm.saida('<img src="x" onerror="a()"><a href="javascript:a()">x</a>')),
      );
  });

  // CK5: a saida filtrada e a que o adaptador entrega a quem le o corpo (getFullData do SEI)
  secao("recurso auto-cleanup: CK5 getData do adaptador passa pelo filtro, o model fica");
  {
    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: SUJO, principal: true }] });
    const i = f5.instancia() as Qualquer;
    const bruto = i.data.get;
    const escutas: Qualquer[] = [];
    i.data.on = (ev: string, fn: Fn, o: unknown) => escutas.push({ ev, fn, o });
    i.data.get = (o?: unknown) => {
      const evt = { return: bruto(o) };
      for (const r of escutas) (r.fn as Fn)(evt, [o]);
      return evt.return;
    };
    const g = globaisDe({ versao: 5, doc: f5.doc, win: f5.win, ed: f5 });
    g.registrarLimpezaAutomaticaPro(i);
    const A = criarAdaptador(f5.win);
    const saida = A.getData(i) as string;
    checar("getData do adaptador: sem lixo", !/cke_|rgba?\(|data-sfc/.test(saida), saida);
    igual("model guarda o original", i.dadosPorRaiz.main, SUJO);
    igual("limparEditorPro: a saida ja esta limpa, nada a fazer (false)", g.limparEditorPro(i), false);
    igual("limparEditorPro: model continua intacto", i.dadosPorRaiz.main, SUJO);
  }

  // ======== colagem CK4 ========
  secao("recurso auto-cleanup: colagem no CK4 (evt.data.dataValue limpo in-place)");
  {
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    const i = f4.instancia("txaEditor_1") as Qualquer;
    const regras: Qualquer[] = [];
    i.dataProcessor = { htmlFilter: { addRules: (r: unknown, o: unknown) => regras.push({ r, o }) } };
    const g = globaisDe({ versao: 4, doc: f4.doc, win: f4.win, ed: f4 });
    g.registrarLimpezaAutomaticaPro(i);
    const evt: Qualquer = { data: { dataValue: SUJO + '<p><span contenteditable="false">k</span></p>' } };
    i.fire("paste", evt);
    checar(
      "dataValue limpo no proprio objeto do evento",
      !/cke_|rgba?\(|data-sfc|spellcheck|cke_protected/.test(evt.data.dataValue),
      evt.data.dataValue,
    );
    checar("colagem preserva contenteditable", /contenteditable="false"/.test(evt.data.dataValue), evt.data.dataValue);
    const limpo: Qualquer = { data: { dataValue: "<p>ok</p>" } };
    i.fire("paste", limpo);
    igual("colagem de HTML limpo nao muda", limpo.data.dataValue, "<p>ok</p>");
    const semDados: Qualquer = { data: {} };
    i.fire("paste", semDados);
    igual("evento sem dataValue string e ignorado", semDados, { data: {} });
    i.fire("paste", undefined);
    checar("evento nulo nao quebra", true);
  }

  // ======== colagem CK5 / caminho de reserva ========
  secao("recurso auto-cleanup: caminho de reserva (editor sem evento get / sem htmlFilter)");
  {
    // CK5 sem data.on: colagem limpa o corpo no tick seguinte, via transformBodyHtml
    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const i = f5.instancia() as Qualquer;
    const mud: Fn[] = [];
    i.model.document.on = (n: string, fn: Fn) => {
      if (n === "change:data") mud.push(fn);
    };
    const g = globaisDe({ versao: 5, doc: f5.doc, win: f5.win, ed: f5 });
    let habilitou = 0;
    (f5.win as Qualquer).enableButtonSavePro = () => {
      habilitou++;
    };
    const sets: unknown[] = [];
    const set = i.data.set;
    i.data.set = (v: unknown) => {
      sets.push(v);
      set(v);
    };
    i.dadosPorRaiz.main = SUJO;
    g.registrarLimpezaAutomaticaPro(i);
    igual("reserva CK5: registra o ouvinte de change", mud.length, 1);
    f5.elemento("main").dispatchEvent(new (f5.doc.defaultView as Qualquer).Event("paste"));
    igual("reserva CK5: a colagem nao limpa na hora (evento pre-insercao)", sets.length, 0);
    await espera(20);
    igual("reserva CK5: no tick seguinte limpa o corpo (data.set da raiz)", sets.length, 1);
    checar("reserva CK5: model limpo", !/cke_|rgba?\(|data-sfc/.test(i.dadosPorRaiz.main), i.dadosPorRaiz.main);
    igual("reserva CK5: a selecao e restaurada depois do data.set", i.selecoesDefinidas.length, 1);
    await espera(10);
    igual("reserva CK5: a guarda de reentrancia e liberada", i._limpezaProEmAndamento, false);

    // change: coalesce numa unica passada apos 400 ms
    i.dadosPorRaiz.main = SUJO;
    sets.length = 0;
    for (const fn of mud) {
      fn();
      fn();
      fn();
    }
    await espera(100);
    igual("reserva CK5: change nao limpa a cada tecla", sets.length, 0);
    await espera(450);
    igual("reserva CK5: uma unica passada apos a rajada", sets.length, 1);
    checar("reserva CK5: passada limpou", !/cke_|rgba?\(/.test(i.dadosPorRaiz.main));
    // idempotencia: o corpo ja limpo nao dispara nova passada
    for (const fn of mud) fn();
    await espera(450);
    igual("reserva CK5: corpo ja limpo, change nao reescreve", sets.length, 1);

    // mousedown no botao Salvar: limpa antes de serializar (sem esperar)
    i.dadosPorRaiz.main = SUJO;
    sets.length = 0;
    const outro = f5.doc.createElement("button");
    outro.setAttribute("aria-label", "Outro");
    f5.doc.body.append(outro);
    const salvar = f5.doc.createElement("button");
    salvar.setAttribute("aria-label", "Salvar");
    f5.doc.body.append(salvar);
    const Ev = (f5.doc.defaultView as Qualquer).Event;
    outro.dispatchEvent(new Ev("mousedown", { bubbles: true }));
    igual("reserva: mousedown em outro botao nao limpa", sets.length, 0);
    salvar.dispatchEvent(new Ev("mousedown", { bubbles: true }));
    igual("reserva: mousedown no botao Salvar limpa na hora", sets.length, 1);
    await espera(10);
    // hook por instancia: registrar de novo nao liga outro mousedown
    g.registrarLimpezaAutomaticaPro(i);
    i.dadosPorRaiz.main = SUJO;
    sets.length = 0;
    salvar.dispatchEvent(new Ev("mousedown", { bubbles: true }));
    igual("reserva: registrar de novo nao duplica o hook do Salvar", sets.length, 1);
    igual("reserva: limparEditorPro nao reabilita o Salvar sozinho", habilitou, 0);
  }
  {
    // CK4 sem htmlFilter: colagem in-place e change coalescido via transformBodyHtml
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    const i = f4.instancia("txaEditor_1") as Qualquer;
    const g = globaisDe({ versao: 4, doc: f4.doc, win: f4.win, ed: f4 });
    g.registrarLimpezaAutomaticaPro(i);
    const evt: Qualquer = { data: { dataValue: SUJO } };
    i.fire("paste", evt);
    checar("reserva CK4: colagem limpa o dataValue", !/cke_|rgba?\(|spellcheck/.test(evt.data.dataValue), evt.data.dataValue);
    i.corpo.innerHTML = `${SUJO}<p><span contenteditable="false">k</span></p>`;
    i.fire("change");
    await espera(450);
    checar(
      "reserva CK4: change limpa o corpo, mantendo contenteditable",
      !/cke_|rgba?\(|spellcheck|data-sfc/.test(i.corpo.innerHTML) && /contenteditable="false"/.test(i.corpo.innerHTML),
      i.corpo.innerHTML,
    );
    igual("reserva CK4: sem foco/comandos extras", [i.focos, i.comandos.length], [0, 0]);
  }

  // ======== sob demanda ========
  await nosDoisEditores("auto-cleanup sob demanda", async (c) => {
    secao(`recurso auto-cleanup: limparEditorPro() sob demanda [CK${c.versao}]`);
    const g = globaisDe(c);
    const e = editorDe(c) as Qualquer;
    let habilitou = 0;
    (c.win as Qualquer).enableButtonSavePro = () => {
      habilitou++;
    };
    const html = `${SUJO}<p><span contenteditable="false">k</span></p>`;
    if (c.versao === 4) {
      (c.ed as FalsoCk4).instancia("txaEditor_1").corpo.innerHTML = html;
    } else {
      (c.ed as FalsoCk5).instancia().dadosPorRaiz.main = html;
    }
    const lido = (): string => (c.versao === 4 ? corpoDe(c).innerHTML : (c.ed as FalsoCk5).instancia().dadosPorRaiz.main);
    igual("sem argumento usa a instancia atual e limpa (true)", g.limparEditorPro(), true);
    checar(
      "conteudo limpo, contenteditable preservado",
      !/cke_|rgba?\(|data-sfc|spellcheck/.test(lido()) && /contenteditable="false"/.test(lido()),
      lido(),
    );
    igual("reabilita o botao Salvar quando algo mudou", habilitou, 1);
    igual("segunda chamada: nada a limpar (false, idempotente)", g.limparEditorPro(e), false);
    igual("segunda chamada: nao reabilita o Salvar", habilitou, 1);
    const apos = lido();
    g.limparEditorPro(e);
    igual("terceira chamada: conteudo identico", lido(), apos);
  });

  secao("recurso auto-cleanup: sem editor na pagina");
  {
    const { doc, win } = paginaFalsa();
    const g = autoCleanup.globais(ctxDe(win, doc)) as Record<string, Fn>;
    igual("limparEditorPro sem editor: false", g.limparEditorPro(), false);
    g.registrarLimpezaAutomaticaPro(null);
    g.registrarLimpezaAutomaticaPro(undefined);
    checar("registrar sem editor nao quebra", true);
    autoCleanup.iniciar?.(ctxDe(win, doc));
    checar("iniciar sem editor nao quebra", true);
  }

  // ======== somente leitura ========
  secao("recurso auto-cleanup: secao somente leitura");
  {
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Cabecalho", html: SUJO, somenteLeitura: true }] });
    const i = f4.instancia("txaEditor_1") as Qualquer;
    const g = globaisDe({ versao: 4, doc: f4.doc, win: f4.win, ed: f4 });
    const antes = i.corpo.innerHTML;
    g.limparEditorPro(i);
    igual("CK4 somente leitura: o corpo nao e reescrito (escrita recusada pelo adaptador)", i.corpo.innerHTML, antes);
    // a saida filtrada e leitura: continua limpando
    const regras: Qualquer[] = [];
    i.dataProcessor = { htmlFilter: { addRules: (r: unknown, o: unknown) => regras.push({ regras: r, opcoes: o }) } };
    g.registrarLimpezaAutomaticaPro(i);
    const saida = saidaCk4(regras, SUJO, f4.doc);
    checar("CK4 somente leitura: o filtro de saida ainda limpa o que e gravado", !/spellcheck|cke_[a-oq-z]|rgba?\(/.test(saida), saida);

    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: SUJO, principal: true, somenteLeitura: true }] });
    const arm = armarSaida({ versao: 5, doc: f5.doc, win: f5.win, ed: f5 });
    globaisDe({ versao: 5, doc: f5.doc, win: f5.win, ed: f5 }).registrarLimpezaAutomaticaPro(f5.instancia());
    checar(
      "CK5 raiz somente leitura: a saida filtrada limpa e o model nao muda",
      !/cke_|rgba?\(/.test(arm.saida(SUJO)) && f5.instancia().dadosPorRaiz.main === SUJO,
    );
  }

  // ======== iniciar ========
  secao("recurso auto-cleanup: iniciar");
  {
    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const i = f5.instancia() as Qualquer;
    const escutas: unknown[] = [];
    i.data.on = (e: string) => escutas.push(e);
    autoCleanup.iniciar?.(ctxDe(f5.win, f5.doc));
    autoCleanup.iniciar?.(ctxDe(f5.win, f5.doc));
    igual("iniciar CK5: registra o filtro de saida (uma vez, idempotente por flag)", escutas, ["get"]);

    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    const regras: unknown[] = [];
    (f4.instancia("txaEditor_1") as Qualquer).dataProcessor = { htmlFilter: { addRules: (r: unknown) => regras.push(r) } };
    autoCleanup.iniciar?.(ctxDe(f4.win, f4.doc));
    igual("iniciar CK4: nao registra (o monolito registra por instancia)", regras.length, 0);
  }
}
