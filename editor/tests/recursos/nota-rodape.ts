import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as notaRodape } from "../../src/recursos/nota-rodape";
import type { Contexto } from "../../src/recursos/tipos";
import { montarAbnt } from "../../src/util/abnt";
import { dataPorExtenso } from "../../src/util/data-por-extenso";
import { planejarNotas, removerNotasCk4, removerNotasCk5, renumerarNotasCk4, renumerarNotasCk5 } from "../../src/util/notas";
import { clicar, dialogoAberto, digitar, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk5, cursorEm, type FalsoCk4, type FalsoCk5, nosDoisEditores, paginaFalsa } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

const ctxDe = (c: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

/* ----- um model minimo do CK5 (raiz > paragrafos > textos com atributos) para os executores ----- */
interface TextoM {
  tipo: "texto";
  data: string;
  attrs: Record<string, unknown>;
  parent: BlocoM | null;
}
interface BlocoM {
  tipo: "bloco";
  attrs: Record<string, unknown>;
  filhos: TextoM[];
  parent: RaizM | null;
}
interface RaizM {
  tipo: "raiz";
  rootName: string;
  filhos: BlocoM[];
}
const classe = (...c: string[]) => ({ classes: c });
const span = (cls: string[], ref: string, n: number) => ({
  classes: cls,
  attributes: { "data-ntrodape-ref": ref, "data-ntrodape": String(n), contenteditable: "false" },
});

function texto(data: string, attrs: Record<string, unknown> = {}): TextoM {
  return { tipo: "texto", data, attrs, parent: null };
}
function bloco(classes: string[], ...filhos: TextoM[]): BlocoM {
  const b: BlocoM = { tipo: "bloco", attrs: { htmlPAttributes: classe(...classes) }, filhos, parent: null };
  for (const f of filhos) f.parent = b;
  return b;
}
const chamada = (ref: string, n: number) =>
  texto(`[${n}]`, { htmlSpan: span(["ntRodape_item", "ancoraSei"], ref, n), linkHref: `#footer_${ref}`, superscript: true });
const marcaRodape = (ref: string, n: number) =>
  texto(`[${n}]`, { htmlSpan: span(["ntRodape_footer", "ancoraSei"], ref, n), linkHref: `#item_${ref}` });

function montarModelo(blocos: BlocoM[]) {
  const raiz: RaizM = { tipo: "raiz", rootName: "main", filhos: blocos };
  for (const b of blocos) b.parent = raiz;
  const wrap = (n: TextoM | BlocoM | RaizM) => {
    const x = n as unknown as Record<string, unknown>;
    return Object.assign(x, {
      is: (t: string) =>
        n.tipo === "texto" ? t === "$textProxy" || t === "$text" : n.tipo === "bloco" ? t === "element" : t === "rootElement",
      getAttribute: (k: string) => (n as { attrs?: Record<string, unknown> }).attrs?.[k],
      getAttributes: () => Object.entries((n as { attrs?: Record<string, unknown> }).attrs ?? {}),
    });
  };
  const todos = (): unknown[] => {
    const out: unknown[] = [];
    for (const b of raiz.filhos) {
      out.push(wrap(b));
      for (const t of b.filhos) out.push(wrap(t));
    }
    return out;
  };
  const w = {
    createRangeIn: (n: RaizM | BlocoM) => ({
      getItems: () => (n.tipo === "raiz" ? todos() : (n as BlocoM).filhos.map((t) => wrap(t))),
    }),
    createRangeOn: (n: TextoM | BlocoM) => {
      const pai = n.parent as BlocoM | RaizM;
      return { item: n, start: { pai, indice: (pai.filhos as unknown[]).indexOf(n) } };
    },
    createPositionAt: (pai: RaizM, onde: string) => ({ pai, indice: onde === "end" ? pai.filhos.length : 0 }),
    remove: (r: { item: TextoM | BlocoM }) => {
      const pai = r.item.parent as BlocoM | RaizM;
      (pai.filhos as unknown[]).splice((pai.filhos as unknown[]).indexOf(r.item), 1);
    },
    insertText: (data: string, attrs: Record<string, unknown>, pos: { pai: BlocoM; indice: number }) => {
      const t = texto(data, { ...attrs });
      t.parent = pos.pai;
      pos.pai.filhos.splice(pos.indice, 0, t);
    },
    move: (r: { item: BlocoM }, pos: { pai: RaizM; indice: number }) => {
      const origem = r.item.parent as RaizM;
      origem.filhos.splice(origem.filhos.indexOf(r.item), 1);
      r.item.parent = pos.pai;
      pos.pai.filhos.push(r.item);
    },
  };
  const ed = { model: { change: <T>(f: (x: typeof w) => T) => f(w) } };
  const resumo = () =>
    raiz.filhos.map((b) => {
      const cls = (b.attrs.htmlPAttributes as { classes: string[] }).classes.join(".");
      return `${cls}|${b.filhos.map((t) => t.data).join("")}`;
    });
  return { raiz, ed, resumo };
}

const corpoHtml = (n: number) =>
  `<p>t <sup><a href="#footer_R${n}" name="item_R${n}"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="R${n}" contenteditable="false">[?]</span></a></sup></p>`;
const rodapeHtml = (n: number, t: string) =>
  `<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_R${n}" href="#item_R${n}"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="R${n}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${t}</p>`;
const SEP = '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____</p>';

export async function verificarNotaRodape(): Promise<void> {
  secao("util: data por extenso e referencia ABNT");
  igual("dataPorExtenso: 2024-01-05 -> 5 de jan de 2024", dataPorExtenso("2024-01-05"), "5 de jan de 2024");
  igual("dataPorExtenso: 2023-12-25 -> 25 de dez de 2023", dataPorExtenso("2023-12-25"), "25 de dez de 2023");
  igual(
    "dataPorExtenso: invalida ou vazia -> vazio",
    [dataPorExtenso(""), dataPorExtenso("2024-02-30"), dataPorExtenso("abc")],
    ["", "", ""],
  );
  const vazio = {
    nome: "",
    sobrenome: "",
    titulo: "",
    edicao: "",
    ano: "",
    local: "",
    editora: "",
    volume: "",
    paginas: "",
    link: "",
    data: "",
  };
  igual("ABNT: tudo vazio -> vazio (a previa some)", montarAbnt(vazio), "");
  igual(
    "ABNT: a referencia completa na ordem e com a pontuacao do legado",
    montarAbnt({
      nome: "joão da",
      sobrenome: "silva",
      titulo: "direito dos portos",
      edicao: "2",
      ano: "2020",
      local: "são paulo",
      editora: "atlas",
      volume: "3",
      paginas: "10-20",
      link: "https://exemplo.gov.br/x?a=1&b=2",
      data: "2024-01-05",
    }),
    'SILVA, João da. <strong>Direito dos Portos</strong>. 2. ed., São Paulo: Atlas, 2020, v. 3. p.10-20. Disponível em: <a href="https://exemplo.gov.br/x?a=1&amp;b=2" target="_blank">&lt;https://exemplo.gov.br/x?a=1&amp;b=2&gt;</a>. Acesso em: 5 de jan de 2024.',
  );
  igual("ABNT: so sobrenome e titulo", montarAbnt({ ...vazio, sobrenome: "silva", titulo: "obra" }), "SILVA. <strong>Obra</strong>.");
  checar(
    "ABNT: link que nao e http(s) e descartado",
    !montarAbnt({ ...vazio, sobrenome: "x", link: "javascript:alert(1)" }).includes("javascript"),
  );
  const hostil = montarAbnt({ ...vazio, sobrenome: "<img src=x onerror=1>", titulo: "<script>x</script>", editora: "a&b" });
  checar(
    "ABNT: o que o usuario digita entra ESCAPADO (nada de marcacao)",
    !hostil.includes("<img") && !hostil.includes("<script") && hostil.includes("&amp;") && hostil.includes("&lt;"),
    hostil,
  );

  secao("util notas: o planejador (numeracao e ordem)");
  const plano = planejarNotas([
    { tipo: "item", ref: "b" },
    { tipo: "item", ref: "a" },
    { tipo: "footer", ref: "a", numero: 1 },
    { tipo: "footer", ref: "b", numero: 2 },
    { tipo: "footer", ref: "morta", numero: 3 },
  ]);
  igual(
    "planejarNotas: chamadas numeram 1..N na ordem do documento; rodapes seguem a ordem das chamadas; sem chamada = orfao",
    [[...plano.numeroDe], plano.ordem, plano.orfaos],
    [
      [
        ["b", 1],
        ["a", 2],
      ],
      ["b", "a"],
      ["morta"],
    ],
  );
  const outra = planejarNotas(
    [
      { tipo: "footer", ref: "x", numero: 4 },
      { tipo: "item", ref: "a" },
      { tipo: "footer", ref: "a", numero: 1 },
    ],
    new Set(["x"]),
  );
  igual(
    "planejarNotas: rodape cuja chamada esta em OUTRA secao nao e orfao e mantem o numero",
    [outra.ordem, outra.orfaos],
    [["a", "x"], []],
  );
  igual("planejarNotas: sem nada", [planejarNotas([]).ordem, planejarNotas([]).orfaos], [[], []]);

  secao("util notas: CK4 (DOM)");
  {
    const { doc } = paginaFalsa("");
    const corpo = doc.createElement("div");
    corpo.append(
      ...htmlParaNos(
        doc,
        `${corpoHtml(2)}${corpoHtml(1)}<p>fim</p>${SEP}${rodapeHtml(1, "um")}${rodapeHtml(2, "dois")}${rodapeHtml(9, "orfa")}`,
      ),
    );
    renumerarNotasCk4(corpo);
    const chamadas = [...corpo.querySelectorAll(".ntRodape_item")].map((e) => [
      e.getAttribute("data-ntrodape-ref"),
      e.textContent,
      e.getAttribute("data-ntrodape"),
    ]);
    igual("CK4: as chamadas viram [1], [2] na ordem do documento", chamadas, [
      ["R2", "[1]", "1"],
      ["R1", "[2]", "2"],
    ]);
    const rodapes = [...corpo.querySelectorAll("p.ntRodape")].map((p) => p.textContent?.replace(/\s+/g, " ").trim());
    igual("CK4: rodapes renumerados, ordenados pela chamada e sem o orfao", rodapes, ["[1] dois", "[2] um"]);
    checar("CK4: os rodapes ficam no fim do corpo", corpo.lastElementChild === corpo.querySelectorAll("p.ntRodape")[1]);
    removerNotasCk4(corpo);
    igual(
      "CK4: remover tira chamadas (com o <sup>), rodapes e separador",
      [corpo.querySelectorAll(".ntRodape_item, .ntRodape, .ntRodape_tr, sup").length, corpo.textContent?.replace(/\s+/g, " ").trim()],
      [0, "t t fim"],
    );
    // sem notas sobrando, o separador vai embora
    const c2 = doc.createElement("div");
    c2.append(...htmlParaNos(doc, `<p>x</p>${SEP}${rodapeHtml(7, "orfa")}`));
    renumerarNotasCk4(c2);
    checar("CK4: so orfaos -> rodape e separador saem", !c2.querySelector(".ntRodape, .ntRodape_tr"));
  }

  secao("util notas: CK5 (model)");
  {
    const m = montarModelo([
      bloco(["Texto_Justificado"], texto("a "), chamada("R2", 5), texto(" b "), chamada("R1", 6)),
      bloco(["ntRodape_tr"], texto("____")),
      bloco(["ntRodape"], marcaRodape("R1", 1), texto(" um")),
      bloco(["ntRodape"], marcaRodape("R2", 2), texto(" dois")),
      bloco(["ntRodape"], marcaRodape("R9", 3), texto(" orfa")),
      bloco(["Texto_Justificado"], texto("fim")),
    ]);
    renumerarNotasCk5(m.ed, m.raiz);
    igual("CK5: chamadas [1] e [2]; rodapes na ordem, no fim da raiz; orfao fora", m.resumo(), [
      "Texto_Justificado|a [1] b [2]",
      "ntRodape_tr|____",
      "Texto_Justificado|fim",
      "ntRodape|[1] dois",
      "ntRodape|[2] um",
    ]);
    const primeira = m.raiz.filhos[0]?.filhos[1] as TextoM;
    igual(
      "CK5: o texto novo mantem os atributos do model (link, sobrescrito, classes do span) e o data-ntrodape novo",
      [
        primeira.attrs.linkHref,
        primeira.attrs.superscript,
        (primeira.attrs.htmlSpan as { classes: string[] }).classes,
        (primeira.attrs.htmlSpan as { attributes: Record<string, string> }).attributes["data-ntrodape"],
      ],
      ["#footer_R2", true, ["ntRodape_item", "ancoraSei"], "1"],
    );
    // outra chamada em outra secao: o rodape dela fica
    const m2 = montarModelo([bloco(["ntRodape_tr"], texto("__")), bloco(["ntRodape"], marcaRodape("OUTRA", 4), texto(" x"))]);
    renumerarNotasCk5(m2.ed, m2.raiz, new Set(["OUTRA"]));
    igual("CK5: rodape de chamada em outra secao nao e orfao", m2.resumo(), ["ntRodape_tr|__", "ntRodape|[4] x"]);
    // so orfaos: o separador sai
    const m3 = montarModelo([bloco(["ntRodape_tr"], texto("__")), bloco(["ntRodape"], marcaRodape("Z", 1), texto(" x"))]);
    renumerarNotasCk5(m3.ed, m3.raiz);
    igual("CK5: so orfaos -> rodape e separador saem", m3.resumo(), []);
    // remover tudo
    const m4 = montarModelo([
      bloco(["Texto_Justificado"], texto("a "), chamada("R1", 1), texto(" b")),
      bloco(["ntRodape_tr"], texto("__")),
      bloco(["ntRodape"], marcaRodape("R1", 1), texto(" um")),
    ]);
    removerNotasCk5(m4.ed, m4.raiz);
    igual("CK5: remover tira chamadas (so o texto delas), rodapes e separador", m4.resumo(), ["Texto_Justificado|a  b"]);
  }

  secao("recurso nota-rodape");
  await nosDoisEditores("nota-rodape", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const g = notaRodape.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`nota-rodape ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDialogNotaRodape",
      "getNotaRodape",
      "insertNtRodape",
      "openDialogNotaRodape",
      "removeNtRodape",
      "reorderNtRodape",
      "updateNrABNT",
      "updateNtRodape",
    ]);
    const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
    const ed4 = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1") : null;
    const ed5 = c.versao === 5 ? (c.ed as FalsoCk5).instancia() : null;
    if (ed4) ed4.inserirNoDom = true;
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, "<p>texto da peça</p>"));
    cursorEm(c, corpo.querySelector("p"));

    // sem notas: Atualizar e Remover avisam e nao mexem
    const antes = ed4?.snapshots ?? 0;
    g.updateNtRodape();
    g.removeNtRodape(null);
    checar(
      `nota-rodape ${v}: sem notas, Atualizar e Remover avisam e nao abrem passo de desfazer`,
      /não tem notas de rodapé/.test(c.doc.body.textContent ?? "") && (ed4?.snapshots ?? 0) === antes && (ed5?.mudancas ?? 0) === 0,
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // dialogo: 4 abas acessiveis, sem Cancelar
    g.getNotaRodape(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `nota-rodape ${v}: abas role=tab Texto livre, Padrão ABNT, Atualizar notas, Remover notas`,
      [...d.querySelectorAll('[role="tab"]')].map((t) => t.textContent),
      ["Texto livre", "Padrão ABNT", "Atualizar notas", "Remover notas"],
    );
    igual(
      `nota-rodape ${v}: so a aba Texto livre esta selecionada e visivel`,
      [
        [...d.querySelectorAll('[role="tab"]')].map((t) => t.getAttribute("aria-selected")),
        [...d.querySelectorAll('[role="tabpanel"]')].map((p) => p.hasAttribute("hidden")),
      ],
      [
        ["true", "false", "false", "false"],
        [false, true, true, true],
      ],
    );
    clicar(d, "Padrão ABNT");
    checar(
      `nota-rodape ${v}: clicar numa aba mostra o painel dela`,
      !d.querySelector("#ntPainel_abnt")?.hasAttribute("hidden") && !!d.querySelector("#ntPainel_livre")?.hasAttribute("hidden"),
    );
    checar(`nota-rodape ${v}: sem Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    // texto livre vazio: avisa e mantem o dialogo
    clicar(d, "Inserir");
    checar(
      `nota-rodape ${v}: sem texto avisa e mantem o dialogo`,
      !!dialogoAberto(c.doc) && /Digite o texto/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // previa ABNT ao digitar (escapada)
    clicar(d, "Padrão ABNT");
    digitar(d.querySelector("#nr_Sobrenome") as HTMLInputElement, "silva");
    digitar(d.querySelector("#nr_Titulo") as HTMLInputElement, "obra <b>");
    igual(`nota-rodape ${v}: a previa ABNT acompanha os campos`, d.querySelector("#nrABNTResult")?.textContent, "SILVA. Obra <b>.");
    checar(`nota-rodape ${v}: a previa nao cria marcacao do que foi digitado`, !d.querySelector("#nrABNTResult b"));
    // Inserir na aba ABNT usa a referencia
    clicar(d, "Inserir");
    checar(`nota-rodape ${v}: Inserir com a previa ABNT preenchida insere e fecha o dialogo`, !dialogoAberto(c.doc));
    if (ed4)
      checar(
        `nota-rodape ${v}: a nota ABNT entrou no rodape`,
        /SILVA\. Obra <b>\./.test(corpo.querySelector("p.ntRodape")?.textContent ?? ""),
      );
  });

  // inserir (CK4: DOM real; CK5: chamadas ao adaptador dentro de um unico model.change)
  {
    const f4 = (await import("../falsos")).criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>x</p>" }] });
    usarDocumento(f4.doc);
    const ed = f4.instancia("txaEditor_1");
    ed.inserirNoDom = true;
    const g = notaRodape.globais(ctxDe(f4)) as Record<string, Fn>;
    ed.corpo.replaceChildren(...htmlParaNos(ed.corpo.ownerDocument, "<p id='p1'>primeiro</p><p id='p2'>segundo</p>"));
    f4.selecionar("txaEditor_1", { elemento: ed.corpo.querySelector("#p2") });
    g.insertNtRodape("Nota <b>A</b> &amp;", ed);
    f4.selecionar("txaEditor_1", { elemento: ed.corpo.querySelector("#p1") });
    g.insertNtRodape("Nota B", ed);
    const rod = [...ed.corpo.querySelectorAll("p.ntRodape")].map((p) => p.textContent?.replace(/\s+/g, " ").trim());
    igual("nota-rodape [CK4]: 2 notas; a inserida ANTES vira [1] e o rodape dela vem primeiro", rod, ["[1] Nota B", "[2] Nota A &"]);
    igual(
      "nota-rodape [CK4]: as chamadas no texto: p1 -> [1], p2 -> [2]",
      [ed.corpo.querySelector("#p1 .ntRodape_item")?.textContent, ed.corpo.querySelector("#p2 .ntRodape_item")?.textContent],
      ["[1]", "[2]"],
    );
    igual("nota-rodape [CK4]: um unico separador", ed.corpo.querySelectorAll(".ntRodape_tr").length, 1);
    const snaps = ed.snapshots;
    g.removeNtRodape(null, ed);
    checar(
      "nota-rodape [CK4]: Remover tira tudo num passo de desfazer",
      !ed.corpo.querySelector(".ntRodape_item, .ntRodape, .ntRodape_tr") && ed.snapshots - snaps === 2,
    );
    igual(
      "nota-rodape [CK4]: o texto do documento volta ao que era",
      ed.corpo.textContent?.replace(/\s+/g, " ").trim(),
      "primeiro segundo",
    );
  }
  {
    const f5 = criarCk5({
      secoes: [
        { raiz: "cab", label: "Cabeçalho", html: "<p>cab</p>", somenteLeitura: true },
        { raiz: "main", label: "Corpo do Texto", html: "<p>corpo</p>", principal: true },
      ],
    });
    usarDocumento(f5.doc);
    const ed = f5.instancia();
    const ctx = ctxDe(f5);
    const g = notaRodape.globais(ctx) as Record<string, Fn>;
    const profundidades: number[] = [];
    const insereOriginal = ed.model.insertContent;
    ed.model.insertContent = (...a: Parameters<typeof insereOriginal>) => {
      profundidades.push(ed.profundidade);
      return insereOriginal(...a);
    };
    // cursor no cabecalho (somente leitura): a nota vai para o corpo (o cursor e levado ao fim do corpo)
    f5.selecionar({ raiz: "cab", elemento: f5.elemento("cab").querySelector("p") });
    g.insertNtRodape("Nota & <i>x</i>", ed);
    igual(
      "nota-rodape [CK5]: cursor fora do corpo -> o cursor vai para o fim do corpo; separador, rodape e chamada nesta ordem",
      [
        ed.selecoesDefinidas.length,
        ed.insercoes.map((i) =>
          /ntRodape_tr/.test(i.html ?? "")
            ? "separador"
            : /ntRodape_footer/.test(i.html ?? "")
              ? "rodape"
              : /ntRodape_item/.test(i.html ?? "")
                ? "chamada"
                : "outro",
        ),
      ],
      [1, ["separador", "rodape", "chamada"]],
    );
    igual(
      "nota-rodape [CK5]: as 3 insercoes (e a selecao) dentro do model.change do withEdit (um passo de desfazer)",
      profundidades,
      [2, 2, 2],
    );
    // o rodape leva o texto como veio (ja e HTML escapado pelo dialogo)
    checar(
      "nota-rodape [CK5]: o rodape leva o HTML da nota",
      ed.insercoes.some((i) => (i.html ?? "").includes("Nota & <i>x</i>")),
    );
  }
}
