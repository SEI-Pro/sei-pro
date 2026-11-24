import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { htmlDaMarca, recurso as minuta } from "../../src/recursos/minuta-watermark";
import type { Contexto } from "../../src/recursos/tipos";
import { type CasoEditor, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

/** CK5 falso: semeia os dados da raiz e faz `data.set` refletir no DOM da editavel (o proximo render do editor real). */
function preparar(c: CasoEditor): void {
  if (c.versao !== 5) return;
  const inst = (c.ed as FalsoCk5).instancia();
  const el = (c.ed as FalsoCk5).elemento("main");
  inst.dadosPorRaiz.main = el.innerHTML;
  const original = inst.data.set;
  inst.data.set = (v) => {
    original(v);
    el.replaceChildren(...htmlParaNos(el.ownerDocument, inst.dadosPorRaiz.main));
  };
}

function ctxDe(c: CasoEditor): Contexto {
  preparar(c);
  return {
    adaptador: criarAdaptador(c.win),
    doc: c.doc,
    win: c.win,
    base: "",
    checkOpcao: () => true,
    verifyOpcao: () => false,
  };
}

/** Corpo vivo do editor (CK4: corpo do iframe; CK5: editavel da raiz). */
const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

const ancoras = (c: CasoEditor) => [...corpoDe(c).querySelectorAll(".minutaAncora")];
const estilos = (c: CasoEditor) => corpoDe(c).querySelectorAll('style[data-style="seipro-watermark"]').length;

/** Poe o documento atual na pagina: URL com `id_documento` e a lista do processo. */
function documentoAtual(c: CasoEditor, nome: string | null): void {
  const w = c.win as unknown as Record<string, unknown>;
  w.location = { href: "https://sei.exemplo/controlador.php?acao=editor_montar&id_documento=77" };
  w.dadosProcessoPro =
    nome === null
      ? undefined
      : {
          listDocumentos: [
            { id_protocolo: "1", documento: "Outro" },
            { id_protocolo: "77", documento: nome },
          ],
        };
}

export async function verificarMinutaWatermark(): Promise<void> {
  secao("recurso minuta-watermark");

  await nosDoisEditores("minuta-watermark: contrato", (c) => {
    const g = minuta.globais(ctxDe(c));
    igual("globais do contrato", Object.keys(g).sort(), ["getMinutaWatermark", "insertAutomaticMinutaWatermark", "insertMinutaWatermark"]);
    igual("id do recurso e sem iniciar", [minuta.id, minuta.iniciar], ["minuta-watermark", undefined]);
  });

  // HTML/CSS da marca
  const m = htmlDaMarca("MINUTA", "auto");
  checar(
    "html da marca: paragrafo, ancora e regras de CK4/CK5 e do modo escuro",
    m.startsWith('<p class="Texto_Alinhado_Esquerda">\n   <span contenteditable="false" class="minutaAncora" data-type="auto">') &&
      m.includes('body:after, .ck-editor__editable_inline:after { content: "MINUTA"; font-size: 9em; color: rgb(167 167 167 / 20%);') &&
      m.includes(
        "html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }",
      ) &&
      m.includes("body.cke_editable .minutaAncora:after, .ck-editor__editable_inline .minutaAncora:after") &&
      m.includes("* MINUTA DE DOCUMENTO      </a>   </span>&nbsp;&nbsp;\n</p>\n") &&
      htmlDaMarca("MODELO", "manual").includes('data-type="manual"') &&
      htmlDaMarca("MODELO", "manual").includes('content: "MODELO"'),
  );

  await nosDoisEditores("minuta-watermark: automatica por nome", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    let salvou = 0;
    (c.win as unknown as Record<string, unknown>).enableButtonSavePro = () => {
      salvou += 1;
    };

    documentoAtual(c, "Minuta de Oficio");
    g.insertAutomaticMinutaWatermark();
    igual(
      "nome com 'minuta': insere 1 ancora auto com MINUTA e 1 <style>",
      [
        ancoras(c).length,
        estilos(c),
        ancoras(c)[0]?.getAttribute("data-type"),
        ancoras(c)[0]?.textContent?.includes("* MINUTA DE DOCUMENTO"),
      ],
      [1, 1, "auto", true],
    );
    checar(
      "marca no inicio do corpo e texto original preservado",
      corpoDe(c).firstElementChild?.querySelector(".minutaAncora") != null && corpoDe(c).textContent?.includes("texto") === true,
    );
    igual("avisa o botao Salvar", salvou, 1);

    g.insertAutomaticMinutaWatermark();
    igual("idempotente: rodar de novo nao duplica ancora nem <style>", [ancoras(c).length, estilos(c), salvou], [1, 1, 1]);

    documentoAtual(c, "Oficio");
    g.insertAutomaticMinutaWatermark();
    igual(
      "deixou de ser minuta: remove a marca automatica (e o paragrafo)",
      [ancoras(c).length, estilos(c), corpoDe(c).querySelectorAll("p").length],
      [0, 0, 1],
    );
  });

  await nosDoisEditores("minuta-watermark: automatica preserva marca manual", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    documentoAtual(c, "Oficio");
    g.insertMinutaWatermark(null, "manual");
    g.insertAutomaticMinutaWatermark();
    igual("nao-minuta: a marca manual fica", [ancoras(c).length, ancoras(c)[0]?.getAttribute("data-type")], [1, "manual"]);
  });

  await nosDoisEditores("minuta-watermark: documento nao-minuta e dados ausentes", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    documentoAtual(c, "Oficio");
    g.insertAutomaticMinutaWatermark();
    igual("nao-minuta sem marca: nada muda", [ancoras(c).length, estilos(c)], [0, 0]);
    documentoAtual(c, null);
    g.insertAutomaticMinutaWatermark();
    igual("sem lista do processo: nada muda", ancoras(c).length, 0);
    (c.win as unknown as Record<string, unknown>).location = undefined;
    g.insertAutomaticMinutaWatermark();
    igual("sem URL utilizavel: nada muda e nao quebra", ancoras(c).length, 0);
  });

  await nosDoisEditores("minuta-watermark: botao alterna MINUTA e MODELO", async (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    documentoAtual(c, "Oficio");
    const botao = c.doc.createElement("a");

    g.getMinutaWatermark(botao);
    igual(
      "1o clique: insere MINUTA manual",
      [
        ancoras(c).length,
        estilos(c),
        ancoras(c)[0]?.getAttribute("data-type"),
        ancoras(c)[0]?.textContent?.includes("* MINUTA DE DOCUMENTO"),
      ],
      [1, 1, "manual", true],
    );

    g.getMinutaWatermark(botao);
    igual(
      "2o clique: troca para MODELO sem duplicar",
      [
        ancoras(c).length,
        estilos(c),
        ancoras(c)[0]?.textContent?.includes("* MODELO DE DOCUMENTO"),
        ancoras(c)[0]?.textContent?.includes("* MINUTA"),
      ],
      [1, 1, true, false],
    );

    g.getMinutaWatermark(botao);
    igual(
      "3o clique: volta para MINUTA",
      [ancoras(c).length, estilos(c), ancoras(c)[0]?.textContent?.includes("* MINUTA DE DOCUMENTO")],
      [1, 1, true],
    );
    checar("o texto original continua uma unica vez", (corpoDe(c).textContent?.match(/texto/g) ?? []).length === 1);

    // destaque adiado: rola ate a nova ancora e devolve a opacidade
    let rolou = 0;
    (ancoras(c)[0] as unknown as { scrollIntoView: () => void }).scrollIntoView = () => {
      rolou += 1;
    };
    await new Promise((r) => setTimeout(r, 650));
    checar("destaque agendado termina sem quebrar", rolou >= 0 && ancoras(c).length === 1);
  });

  await nosDoisEditores("minuta-watermark: nome com 'modelo' forca MODELO", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    documentoAtual(c, "Documento Modelo");
    g.insertMinutaWatermark(null, "manual");
    igual("insert com nome 'modelo': MODELO", ancoras(c)[0]?.textContent?.includes("* MODELO DE DOCUMENTO"), true);
  });

  await nosDoisEditores("minuta-watermark: insercao direta usa o modo pedido", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    documentoAtual(c, "Oficio");
    g.insertMinutaWatermark(null, "manual", "modelo");
    igual("mode=modelo: MODELO", ancoras(c)[0]?.textContent?.includes("* MODELO DE DOCUMENTO"), true);
  });

  await nosDoisEditores("minuta-watermark: tema escuro e claro no style persistido", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    documentoAtual(c, "Minuta X");
    g.insertAutomaticMinutaWatermark();
    const css = corpoDe(c).querySelector('style[data-style="seipro-watermark"]')?.textContent ?? "";
    checar(
      "regras html.dark-mode e tema claro presentes",
      css.includes("html.dark-mode .minutaAncora") && css.includes("background: #e4e4e4"),
    );
  });

  await nosDoisEditores("minuta-watermark: editor ausente", (c) => {
    const g = minuta.globais(ctxDe(c)) as Record<string, Fn>;
    (c.win as unknown as Record<string, unknown>).CKEDITOR = undefined;
    (c.win as unknown as Record<string, unknown>).INFRA_EDITOR_CONFIG = undefined;
    let erro = "";
    try {
      g.insertAutomaticMinutaWatermark();
      g.insertMinutaWatermark(null, "auto");
      g.getMinutaWatermark(c.doc.createElement("a"));
    } catch (e) {
      erro = String(e);
    }
    igual("sem editor: nao lanca", erro, "");
  });
}
