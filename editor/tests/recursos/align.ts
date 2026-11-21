import { criarAdaptador } from "../../src/adaptador";
import { recurso as align } from "../../src/recursos/align";
import type { Contexto } from "../../src/recursos/tipos";
import { criarCk4, criarCk5 } from "../falsos";
import { checar, igual, secao } from "../util";

type Modo = "left" | "center" | "right" | "justify";
const ctxDe = (f: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(f.win),
  doc: f.doc,
  win: f.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});
const globais = (f: { win: Window; doc: Document }) => align.globais(ctxDe(f)) as Record<string, (...a: unknown[]) => void>;

/** Documento com `n` paragrafos de classes dadas, no editor CK4 ou CK5. */
function montar(versao: 4 | 5, classes: Array<string | null>) {
  const html = classes.map((c, i) => `<p${c === null ? "" : ` class="${c}"`} id="p${i}">t${i}</p>`).join("");
  if (versao === 4) {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html }] });
    const corpo = f.instancia("txaEditor_1").corpo;
    const ps = [...corpo.querySelectorAll("p")];
    return {
      f,
      ps,
      selecionar: (a: number, z = a) =>
        f.selecionar("txaEditor_1", { elemento: ps[a], ancora: ps[a]?.firstChild, foco: ps[z]?.firstChild }),
      classe: (i: number) => ps[i]?.getAttribute("class"),
      estilo: (i: number) => ps[i]?.getAttribute("style"),
    };
  }
  const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html, principal: true }] });
  const ed = f.instancia();
  const ps = [...f.elemento("main").querySelectorAll("p")];
  classes.forEach((c, i) => {
    if (c !== null) ed.atributos.set(ps[i] as Element, { estilo: c });
  });
  return {
    f,
    ps,
    selecionar: (a: number, z = a) =>
      f.selecionar({
        raiz: "main",
        elemento: ps[a],
        ancora: ps[a]?.firstChild,
        foco: ps[z]?.firstChild,
        blocos: ps.slice(Math.min(a, z), Math.max(a, z) + 1),
      }),
    classe: (i: number) => ed.atributos.get(ps[i] as Element)?.estilo ?? null,
    estilo: () => null,
  };
}

export function verificarAlign(): void {
  secao("recurso align");
  const base = montar(4, [null]);
  igual("align: globais do contrato (setAlignText, openAlignText, closeAlignText)", Object.keys(globais(base.f)).sort(), [
    "closeAlignText",
    "openAlignText",
    "setAlignText",
  ]);

  const familias: Array<[string, string[], Record<Modo, string>]> = [
    [
      "normal",
      ["Texto_Alinhado_Esquerda", "Texto_Centralizado", "Texto_Alinhado_Direita", "Texto_Justificado"],
      { left: "Texto_Alinhado_Esquerda", center: "Texto_Centralizado", right: "Texto_Alinhado_Direita", justify: "Texto_Justificado" },
    ],
    [
      "tabela",
      ["Tabela_Texto_Alinhado_Esquerda", "Tabela_Texto_Centralizado", "Tabela_Texto_Alinhado_Direita", "Tabela_Texto_Justificado"],
      {
        left: "Tabela_Texto_Alinhado_Esquerda",
        center: "Tabela_Texto_Centralizado",
        right: "Tabela_Texto_Alinhado_Direita",
        justify: "Tabela_Texto_Justificado",
      },
    ],
    [
      "maiusculas",
      ["Texto_Alinhado_Esquerda_Maiusc", "Texto_Centralizado_Maiusculas", "Texto_Alinhado_Direita_Maiusc", "Texto_Justificado_Maiusculas"],
      {
        left: "Texto_Alinhado_Esquerda_Maiusc",
        center: "Texto_Centralizado_Maiusculas",
        right: "Texto_Alinhado_Direita_Maiusc",
        justify: "Texto_Justificado_Maiusculas",
      },
    ],
  ];
  for (const versao of [4, 5] as const) {
    for (const [nome, membros, alvo] of familias) {
      for (const modo of ["left", "center", "right", "justify"] as Modo[]) {
        const t = montar(versao, [membros[0] as string]);
        t.selecionar(0);
        globais(t.f).setAlignText(null, modo);
        igual(`CK${versao} familia ${nome}: ${modo} troca para ${alvo[modo]}`, t.classe(0), alvo[modo]);
      }
    }

    // varios paragrafos, inclusive selecao de baixo para cima; cada um fica na sua familia
    const m = montar(versao, ["Texto_Justificado", "Tabela_Texto_Justificado", "Texto_Justificado_Maiusculas", "Texto_Justificado"]);
    m.selecionar(0, 2);
    globais(m.f).setAlignText(null, "center");
    igual(
      `CK${versao}: selecao de 3 paragrafos, cada um na sua familia (o 4o fica)`,
      [0, 1, 2, 3].map((i) => m.classe(i)),
      ["Texto_Centralizado", "Tabela_Texto_Centralizado", "Texto_Centralizado_Maiusculas", "Texto_Justificado"],
    );
    m.selecionar(2, 0); // de baixo para cima
    globais(m.f).setAlignText(null, "right");
    igual(
      `CK${versao}: selecao de baixo para cima tambem cobre os 3`,
      [0, 1, 2].map((i) => m.classe(i)),
      ["Texto_Alinhado_Direita", "Tabela_Texto_Alinhado_Direita", "Texto_Alinhado_Direita_Maiusc"],
    );

    const sem = montar(versao, [null]);
    sem.selecionar(0);
    const antes = sem.classe(0);
    globais(sem.f).setAlignText(null, "center");
    if (versao === 4) {
      igual(
        "CK4: paragrafo fora das familias usa text-align inline e mantem a classe",
        [sem.estilo(0), sem.classe(0)],
        ["text-align:center", antes],
      );
    } else {
      checar("CK5: paragrafo fora das familias nao troca o estilo", sem.classe(0) === antes);
      const chamadas: unknown[][] = [];
      (sem.f.win as unknown as Record<string, unknown>).SeiProGhs = { setEstilos: (...a: unknown[]) => chamadas.push(a) };
      globais(sem.f).setAlignText(null, "right");
      igual(
        "CK5: o alinhamento inline vai pelo SeiProGhs.setEstilos",
        [chamadas.length, chamadas[0]?.[0] === sem.ps[0], chamadas[0]?.[1]],
        [1, true, { "text-align": "right" }],
      );
    }
  }

  // somente leitura: o cursor no Cabecalho nao altera nada
  const ck4 = criarCk4({
    secoes: [
      { nome: "txaEditor_1", titulo: "Cabeçalho", html: '<p class="Texto_Justificado">cab</p>', somenteLeitura: true },
      { nome: "txaEditor_2", titulo: "Corpo do Texto", html: "<p>corpo</p>" },
    ],
  });
  const pCab = ck4.instancia("txaEditor_1").corpo.querySelector("p") as Element;
  const pCorpo = ck4.instancia("txaEditor_2").corpo.querySelector("p") as Element;
  ck4.selecionar("txaEditor_2", { elemento: pCorpo });
  ck4.selecionar("txaEditor_1", { elemento: pCab });
  ck4.focar("txaEditor_1");
  globais(ck4).setAlignText(null, "center");
  igual(
    "CK4: foco no Cabecalho (somente leitura) nao muda a classe dele nem a do Corpo",
    [pCab.getAttribute("class"), pCorpo.getAttribute("style"), pCorpo.getAttribute("class") || null],
    ["Texto_Justificado", null, null],
  );

  const ck5 = criarCk5({
    secoes: [
      { raiz: "cab", label: "Cabeçalho", html: "<p>cab</p>", somenteLeitura: true },
      { raiz: "corpo", label: "Corpo do Texto", html: "<p>corpo</p>", principal: true },
    ],
  });
  const pCab5 = ck5.elemento("cab").querySelector("p") as Element;
  ck5.instancia().atributos.set(pCab5, { estilo: "Texto_Justificado" });
  ck5.selecionar({ raiz: "cab", elemento: pCab5, blocos: [pCab5] });
  globais(ck5).setAlignText(null, "center");
  igual("CK5: cursor na raiz somente leitura nao muda o estilo", ck5.instancia().atributos.get(pCab5)?.estilo, "Texto_Justificado");

  // dropdown
  const t = montar(4, [null]);
  const doc = t.f.doc;
  const barra = doc.createElement("div");
  barra.className = "cke_top";
  barra.innerHTML = '<a class="getAlignButtom cke_button_off"></a><div class="divAlignText" style="display:none;"></div>';
  doc.body.append(barra);
  const botao = barra.querySelector(".getAlignButtom") as HTMLElement;
  const dd = barra.querySelector(".divAlignText") as HTMLElement;
  const g = globais(t.f);
  g.openAlignText(botao);
  igual(
    "openAlignText abre: botao on e dropdown visivel",
    [botao.className, dd.style.display === "none"],
    ["getAlignButtom cke_button_on", false],
  );
  g.openAlignText(botao);
  igual("openAlignText de novo fecha", [botao.className, dd.style.display], ["getAlignButtom cke_button_off", "none"]);
  g.openAlignText(botao);
  g.closeAlignText();
  igual(
    "closeAlignText reseta o botao e esconde o dropdown",
    [botao.className, dd.style.display],
    ["getAlignButtom cke_button_off", "none"],
  );
}
