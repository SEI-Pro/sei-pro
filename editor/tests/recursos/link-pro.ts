import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as linkPro } from "../../src/recursos/link-pro";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, digitar, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk5, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

function contexto(c: CasoEditor, copiados: string[]): Contexto {
  return {
    adaptador: criarAdaptador(c.win),
    doc: c.doc,
    win: c.win,
    base: "",
    checkOpcao: () => true,
    verifyOpcao: () => false,
    areaDeTransferencia: {
      writeText: async (t: string) => {
        copiados.push(t);
      },
    },
  };
}

const HTML =
  '<p id="p">veja <a id="l" href="https://sei.antaq.gov.br/doc/1">o documento</a> e <a id="m" href="mailto:a@b.gov.br">email</a> e <a id="j" href="javascript:alert(1)">js</a></p>';

/** Corpo do caso com o HTML dos links; devolve o corpo e os links. */
function montar(c: CasoEditor) {
  const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
  corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, HTML));
  const q = (id: string) => corpo.querySelector(`#${id}`) as HTMLAnchorElement;
  return { corpo, http: q("l"), mailto: q("m"), js: q("j") };
}

const baloes = (c: CasoEditor) => [...c.doc.querySelectorAll(".linkDisplayPro")];
const botoes = (b: Element) => [...b.querySelectorAll("button, a")].map((x) => (x.textContent ?? "").trim());

export async function verificarLinkPro(): Promise<void> {
  secao("recurso link-pro");
  await nosDoisEditores("link-pro", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const copiados: string[] = [];
    const g = linkPro.globais(contexto(c, copiados)) as Record<string, Fn>;
    igual(`link-pro ${v}: globais do contrato`, Object.keys(g).sort(), [
      "copyLinkPro",
      "editLinkPro",
      "getDialogLinkPro",
      "hideLinkTips",
      "openDialogLinkPro",
      "openLinkPro",
      "removeLinkPro",
      "showLinkTips",
    ]);
    const { corpo, http, mailto, js } = montar(c);

    // o balao so aparece sobre links http/https e fica FORA do documento
    g.showLinkTips(http);
    igual(
      `link-pro ${v}: balao sobre link http com abrir, copiar, editar e remover`,
      [baloes(c).length, botoes(baloes(c)[0] as Element).filter(Boolean).length >= 4],
      [1, true],
    );
    checar(
      `link-pro ${v}: o balao fica na pagina do editor, nunca dentro do documento`,
      !corpo.querySelector(".linkDisplayPro") && baloes(c)[0]?.parentElement === c.doc.body,
    );
    checar(`link-pro ${v}: o documento nao ganha atributo nenhum (data-reflinkpro)`, !corpo.innerHTML.includes("data-reflinkpro"));
    const abrir = baloes(c)[0]?.querySelector("a[href]") as HTMLAnchorElement;
    igual(
      `link-pro ${v}: "abrir" e um link real em outra aba sem vazar o opener`,
      [abrir?.getAttribute("href"), abrir?.getAttribute("target"), abrir?.getAttribute("rel")],
      ["https://sei.antaq.gov.br/doc/1", "_blank", "noopener noreferrer"],
    );
    g.showLinkTips(http);
    igual(`link-pro ${v}: mostrar de novo substitui o balao (so um)`, baloes(c).length, 1);
    for (const nao of [mailto, js]) {
      g.showLinkTips(nao);
      checar(`link-pro ${v}: sem balao para ${nao.getAttribute("href")}`, baloes(c).length === 0);
    }
    g.showLinkTips(http);
    g.hideLinkTips();
    igual(`link-pro ${v}: hideLinkTips remove o balao`, baloes(c).length, 0);

    // copiar
    g.showLinkTips(http);
    const botaoCopiar = (baloes(c)[0] as Element).querySelector("button.spro-copiar") as HTMLElement;
    botaoCopiar.dispatchEvent(new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }));
    await tique();
    igual(`link-pro ${v}: copiar manda a URL para a area de transferencia`, copiados, ["https://sei.antaq.gov.br/doc/1"]);
    checar(`link-pro ${v}: copiar avisa "Link copiado!"`, /Link copiado/.test(c.doc.body.textContent ?? ""));

    // remover: o texto fica, o link some, um passo de desfazer
    g.showLinkTips(http);
    g.removeLinkPro();
    if (c.versao === 4) {
      const ed = (c.ed as FalsoCk4).instancia("txaEditor_1");
      checar(
        `link-pro ${v}: remover troca <a> pelo texto`,
        !corpo.querySelector("#l") && corpo.textContent?.includes("o documento") === true,
      );
      igual(`link-pro ${v}: remover e um unico passo (2 snapshots)`, ed.snapshots, 2);
    } else {
      const ed = (c.ed as FalsoCk5).instancia();
      igual(
        `link-pro ${v}: remover seleciona o intervalo do link e executa unlink`,
        [ed.selecoesDefinidas.length, ed.executados.at(-1)?.[0]],
        [1, "unlink"],
      );
    }
    igual(`link-pro ${v}: remover tambem fecha o balao`, baloes(c).length, 0);
  });

  // editar (diálogo) em CK4 e CK5
  await nosDoisEditores("link-pro editar", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const g = linkPro.globais(contexto(c, [])) as Record<string, Fn>;
    const { http } = montar(c);
    g.showLinkTips(http);
    g.editLinkPro();
    const d = dialogoAberto(c.doc) as HTMLElement;
    const nome = d.querySelector("#linkProNome") as HTMLInputElement;
    const url = d.querySelector("#linkProUrl") as HTMLInputElement;
    igual(
      `link-pro ${v}: o dialogo traz o texto e a URL atuais`,
      [d.querySelector("h2")?.textContent, nome.value, url.value],
      ["Editar link", "o documento", "https://sei.antaq.gov.br/doc/1"],
    );
    checar(`link-pro ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));

    // URL vazia e esquema executavel: recusa e nao muda nada
    for (const [valor, msg] of [
      ["", /Digite um link/],
      ["javascript:alert(1)", /inválido/],
      ["  JaVa\tScRiPt:x", /inválido/],
      ["data:text/html,<b>", /inválido/],
    ] as const) {
      c.doc.body.querySelector(".spro-aviso")?.remove();
      digitar(url, valor);
      clicar(d, "Salvar");
      await tique();
      checar(
        `link-pro ${v}: URL ${JSON.stringify(valor)} e recusada com aviso e o documento nao muda`,
        msg.test(c.doc.body.textContent ?? "") && http.getAttribute("href") === "https://sei.antaq.gov.br/doc/1" && !!dialogoAberto(c.doc),
      );
    }

    // salvar
    digitar(nome, "novo texto");
    digitar(url, "https://exemplo.gov.br/x?a=1&b=2");
    clicar(d, "Salvar");
    await tique();
    if (c.versao === 4) {
      igual(
        `link-pro ${v}: salvar atualiza href, data-cke-saved-href e texto`,
        [http.getAttribute("href"), http.getAttribute("data-cke-saved-href"), http.textContent],
        ["https://exemplo.gov.br/x?a=1&b=2", "https://exemplo.gov.br/x?a=1&b=2", "novo texto"],
      );
    } else {
      const ed = (c.ed as FalsoCk5).instancia();
      igual(
        `link-pro ${v}: salvar substitui o intervalo por texto com linkHref`,
        ed.insercoes.at(-1)?.html,
        'texto:novo texto|{"linkHref":"https://exemplo.gov.br/x?a=1&b=2"}',
      );
    }
    checar(`link-pro ${v}: o dialogo fecha`, !dialogoAberto(c.doc));

    // nome vazio usa a URL
    g.showLinkTips(http);
    g.editLinkPro();
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    digitar(d2.querySelector("#linkProNome") as HTMLInputElement, "");
    digitar(d2.querySelector("#linkProUrl") as HTMLInputElement, "https://a.gov.br/");
    clicar(d2, "Salvar");
    await tique();
    if (c.versao === 4) igual(`link-pro ${v}: nome vazio usa a URL como texto`, http.textContent, "https://a.gov.br/");
    else
      igual(
        `link-pro ${v}: nome vazio usa a URL como texto`,
        (c.ed as FalsoCk5).instancia().insercoes.at(-1)?.html,
        'texto:https://a.gov.br/|{"linkHref":"https://a.gov.br/"}',
      );
  });

  // secao somente leitura (CK5): nao remove nem edita
  {
    const f = criarCk5({
      secoes: [
        { raiz: "cab", label: "Cabeçalho", html: '<p><a id="l" href="https://x.gov.br/">cab</a></p>', somenteLeitura: true },
        { raiz: "main", label: "Corpo do Texto", html: "<p>corpo</p>", principal: true },
      ],
    });
    const c = { versao: 5, doc: f.doc, win: f.win, ed: f } as unknown as CasoEditor;
    const g = linkPro.globais(contexto(c, [])) as Record<string, Fn>;
    const link = f.elemento("cab").querySelector("#l") as HTMLAnchorElement;
    let recusas = 0;
    const ctx = contexto(c, []);
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const g2 = linkPro.globais(ctx) as Record<string, Fn>;
    g2.showLinkTips(link);
    g2.removeLinkPro();
    checar(
      "link-pro [CK5]: link numa raiz somente leitura nao e removido (avisa a recusa)",
      f.instancia().executados.length === 0 && f.instancia().selecoesDefinidas.length === 0 && recusas === 1,
    );
    void g;
  }

  // CK5: o balao abre pelo mousedown no documento (no CK4 o monolito liga o evento no iframe)
  await nosDoisEditores("link-pro boot", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const ctx = contexto(c, []);
    const r = linkPro;
    const { http, corpo } = montar(c);
    r.iniciar?.(ctx);
    const Ev = (c.doc.defaultView as unknown as { Event: typeof Event }).Event;
    http.dispatchEvent(new Ev("mousedown", { bubbles: true }));
    const abriu = baloes(c).length;
    corpo.querySelector("#p")?.dispatchEvent(new Ev("mousedown", { bubbles: true }));
    igual(
      `link-pro ${v}: mousedown no link ${c.versao === 5 ? "abre" : "NAO abre (o monolito cuida)"} o balao e fora dele fecha`,
      [abriu, baloes(c).length],
      [c.versao === 5 ? 1 : 0, 0],
    );
  });
}
