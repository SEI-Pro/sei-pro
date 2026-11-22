import { criarAdaptador } from "../../src/adaptador";
import { recurso as notaRodape } from "../../src/recursos/nota-rodape";
import { recurso as qrCode } from "../../src/recursos/qr-code";
import { recurso as refInterna } from "../../src/recursos/ref-interna";
import { recurso as sumario } from "../../src/recursos/sumario";
import type { Contexto } from "../../src/recursos/tipos";
import { comoBotao } from "../../src/ui/teclado";
import { CORES, estilosDaTabela } from "../../src/util/estilos-tabela";
import { editarLink, removerLink, rotularLinks } from "../../src/util/links";
import { ligarRolagem } from "../../src/util/rolagem";
import { estilizarTabela } from "../../src/util/tabelas";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { criarCk4, criarCk5 } from "../falsos";
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
const avisos = (doc: Document): string => [...doc.querySelectorAll(".spro-aviso")].map((e) => e.textContent).join(" | ");

/** Os "menores" que a revisao do plano 2 deixou: um teste por correcao. */
export async function verificarMenores(): Promise<void> {
  secao("menores: link que faz papel de botao responde a Enter e Espaco");
  {
    let n = 0;
    const b = comoBotao(() => {
      n += 1;
    });
    let barrado = 0;
    const ev = (key: string) => ({ key, preventDefault: () => (barrado += 1) }) as unknown as Event;
    b.onkeydown(ev("Enter"));
    b.onkeydown(ev(" "));
    b.onkeydown(ev("a"));
    b.onkeydown(ev("Tab"));
    b.onclick(ev("x"));
    igual("comoBotao: Enter, Espaco e clique ativam; outras teclas nao", n, 3);
    igual("comoBotao: Enter e Espaco nao rolam a pagina (preventDefault)", barrado, 2);
  }

  secao("menores: nota de rodape em secao somente leitura nao anuncia sucesso");
  {
    const f = criarCk4({
      secoes: [
        {
          nome: "txaEditor_1",
          titulo: "Cabeçalho",
          html: "<p>a<span class='ntRodape_item' data-ntrodape-ref='x'>[1]</span></p>",
          somenteLeitura: true,
        },
      ],
    });
    usarDocumento(f.doc);
    const g = notaRodape.globais(ctxDe(f)) as Record<string, Fn>;
    g.updateNtRodape(f.instancia("txaEditor_1"));
    checar("updateNtRodape em secao RO: nao diz 'com sucesso'", !/atualizadas com sucesso/.test(avisos(f.doc)), avisos(f.doc));
    checar("updateNtRodape em secao RO: nada foi escrito (nenhum snapshot)", f.instancia("txaEditor_1").snapshots === 0);
  }

  secao("menores: Atualizar referencias em secao somente leitura nao anuncia sucesso");
  {
    const f = criarCk4({
      secoes: [
        {
          nome: "txaEditor_1",
          titulo: "Cabeçalho",
          html: '<p class="Paragrafo_Numerado_Nivel1"><a name="RefPro_AAAAAAAAAAAAAAAA" class="refpro"></a>um</p><p><a href="#RefPro_AAAAAAAAAAAAAAAA">[9]</a></p>',
          somenteLeitura: true,
        },
      ],
    });
    usarDocumento(f.doc);
    const g = refInterna.globais(ctxDe(f)) as Record<string, Fn>;
    g.getRefInterna(null);
    const d = dialogoAberto(f.doc) as HTMLElement;
    clicar(d, "Atualizar referências");
    checar("sem 'com sucesso' quando a escrita foi recusada", !/atualizadas com sucesso/.test(avisos(f.doc)), avisos(f.doc));
    igual("o rotulo antigo continua", f.instancia("txaEditor_1").corpo.querySelector("a[href]")?.textContent, "[9]");
  }

  secao("menores: QR em secao somente leitura nao insere e devolve false (o dialogo fica aberto)");
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Cabeçalho", html: "<p>x</p>", somenteLeitura: true }] });
    usarDocumento(f.doc);
    const g = qrCode.globais(ctxDe(f)) as Record<string, Fn>;
    const caixa = f.doc.createElement("div");
    caixa.id = "qrCodeResult";
    caixa.innerHTML = '<img src="data:image/png;base64,AAAA">';
    f.doc.body.append(caixa);
    igual("setQrCode em RO devolve false", g.setQrCode("texto", f.instancia("txaEditor_1")), false);
    const f2 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    usarDocumento(f2.doc);
    const g2 = qrCode.globais(ctxDe(f2)) as Record<string, Fn>;
    const caixa2 = f2.doc.createElement("div");
    caixa2.id = "qrCodeResult";
    caixa2.innerHTML = '<img src="data:image/png;base64,AAAA">';
    f2.doc.body.append(caixa2);
    igual("setQrCode numa secao editavel devolve true", g2.setQrCode("texto", f2.instancia("txaEditor_1")), true);
  }

  secao("menores: QR abre com o texto selecionado no iframe do CK4 (nao so na janela da pagina)");
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>meu link</p>" }] });
    usarDocumento(f.doc);
    f.selecionar("txaEditor_1", { elemento: f.instancia("txaEditor_1").corpo.querySelector("p"), texto: "meu link", html: "meu link" });
    const g = qrCode.globais(ctxDe(f)) as Record<string, Fn>;
    g.getQrCode(null);
    const campo = dialogoAberto(f.doc)?.querySelector<HTMLInputElement>("#qrCodeText");
    igual("o campo traz o texto selecionado", campo?.value, "meu link");
  }

  secao("menores: sumario sem nenhuma ancora gravada nao insere so o titulo");
  {
    const f = criarCk5({
      secoes: [
        {
          raiz: "main",
          label: "Corpo do Texto",
          html: '<p class="Item_Nivel1">Um</p><p class="Texto_Justificado">fim</p>',
          principal: true,
        },
      ],
    });
    usarDocumento(f.doc);
    // sem SeiProGhs na janela, o CK5 nao consegue gravar o `id`: nenhuma ancora, nenhum link
    (f.win as unknown as { SeiProGhs?: unknown }).SeiProGhs = undefined;
    const g = sumario.globais(ctxDe(f)) as Record<string, Fn>;
    const ed = f.instancia();
    f.selecionar({ raiz: "main", elemento: f.elemento("main").querySelectorAll("p")[1] });
    const antes = ed.insercoes.length;
    igual("insertSumarioDocumento sem ancora devolve false", g.insertSumarioDocumento([".Item_Nivel1"], ed), false);
    igual("nada foi inserido (nem o 'SUMARIO' sozinho)", ed.insercoes.length, antes);
    checar("avisa que nao foi possivel", /nenhum título aceitou a âncora/.test(avisos(f.doc)), avisos(f.doc));
  }

  secao("menores: link obsoleto (fora do documento) avisa em vez de falhar calado");
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    usarDocumento(f.doc);
    const c = ctxDe(f);
    const solto = f.doc.createElement("a");
    solto.setAttribute("href", "https://x.org");
    igual("editarLink com <a> solto devolve false", editarLink(c, solto, "t", "https://y.org"), false);
    checar("... e avisa", /não está mais no documento/.test(avisos(f.doc)), avisos(f.doc));
    f.doc.querySelector(".spro-aviso")?.remove();
    igual("removerLink com <a> solto devolve false", removerLink(c, solto), false);
    checar("... e avisa", /não está mais no documento/.test(avisos(f.doc)), avisos(f.doc));
  }

  secao("menores: CK5 — rotular um link mantem negrito e italico do rotulo antigo");
  {
    const f = criarCk5({
      secoes: [
        { raiz: "main", label: "Corpo do Texto", html: '<p><a href="#RefPro_X"><strong><i>[1]</i></strong></a></p>', principal: true },
      ],
    });
    usarDocumento(f.doc);
    const c = ctxDe(f);
    const a = f.elemento("main").querySelector("a") as Element;
    const ed = f.instancia();
    c.adaptador.withEdit(ed, () => rotularLinks(c, [{ a, texto: "[2]" }]));
    const ins = ed.textosInseridos.at(-1);
    igual("o texto novo", ins?.texto, "[2]");
    igual(
      "herda negrito, italico e o href",
      [ins?.atributos.bold, ins?.atributos.italic, ins?.atributos.linkHref],
      [true, true, "#RefPro_X"],
    );
  }

  secao("menores: CK4 — rotular um link mantem a formatacao de dentro");
  {
    const f = criarCk4({
      secoes: [
        {
          nome: "txaEditor_1",
          titulo: "Corpo",
          html: '<p><a href="#RefPro_X"><strong><em>[1]</em></strong></a> e <a href="#RefPro_Y">[2]</a></p>',
        },
      ],
    });
    usarDocumento(f.doc);
    const c = ctxDe(f);
    const [a1, a2] = Array.from(f.instancia("txaEditor_1").corpo.querySelectorAll("a")) as Element[];
    c.adaptador.withEdit(f.instancia("txaEditor_1"), () =>
      rotularLinks(c, [
        { a: a1 as Element, texto: "[7]" },
        { a: a2 as Element, texto: "[8]" },
      ]),
    );
    igual("negrito e italico continuam", (a1 as Element).innerHTML, "<strong><em>[7]</em></strong>");
    igual("link simples troca o texto", (a2 as Element).innerHTML, "[8]");
  }

  secao("menores: tabela aninhada — linhas e celulas internas ficam como estao");
  {
    const f = criarCk4({
      secoes: [
        {
          nome: "txaEditor_1",
          titulo: "Corpo",
          html: '<table id="ext"><tbody><tr><td>a<table id="int"><tbody><tr id="tri"><td id="tdi"><p id="pi">i</p></td></tr></tbody></table></td><td>b</td></tr></tbody></table>',
        },
      ],
    });
    usarDocumento(f.doc);
    const ed = f.instancia("txaEditor_1");
    const tabela = ed.corpo.querySelector("#ext") as Element;
    const todos = estilosDaTabela(CORES[Object.keys(CORES)[0] as string] as never, 100);
    const estilos = todos[Object.keys(todos)[0] as string];
    if (!estilos) throw new Error("sem estilo de tabela");
    estilizarTabela(ctxDe(f), ed, tabela, { ...estilos, cabecalho: false });
    const interna = ed.corpo.querySelector("#int") as Element;
    checar(
      "tr, td e p da tabela interna nao ganharam estilo da externa",
      !interna.getAttribute("style") &&
        !ed.corpo.querySelector("#tri")?.getAttribute("style") &&
        !ed.corpo.querySelector("#tdi")?.getAttribute("style") &&
        !ed.corpo.querySelector("#pi")?.getAttribute("class"),
    );
    checar("a tabela externa foi estilizada", !!tabela.getAttribute("style"));
  }

  secao("menores: rolagem religa sozinha quando o iframe do CK4 e reescrito (contentDom)");
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    const c = ctxDe(f);
    ligarRolagem(c);
    ligarRolagem(c);
    const escutas = (f.instancia("txaEditor_1") as unknown as { escutas: Map<string, unknown[]> }).escutas.get("contentDom") ?? [];
    igual("um unico ouvinte de contentDom por instancia (mesmo chamando duas vezes)", escutas.length, 1);
  }
}
