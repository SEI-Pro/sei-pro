/**
 * "Processos deste interessado": a lista incremental (paginação, filtros, corrida) e o modal sobre a pesquisa REAL do
 * SEI SP (fixtures do núcleo, parseadas pelo próprio `lerResultados`).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lerResultados, type PaginaDeProcessos } from "@nucleo/dominio/pesquisa";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { BuscaDeProcessos, type EstadoDaLista } from "../src/modelo/buscaProcessos";
import type { ContextoProcesso } from "../src/pagina/contexto";
import { abrirModalProcessosDoInteressado } from "../src/pagina/modais/interessado";
import { lerFiltroDoInteressado } from "../src/pagina/opcoes";
import { fingirDialogos } from "./dialogo";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

function pagina(arquivo: string, inicio: number): PaginaDeProcessos {
  const bruto = readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41", arquivo), "utf8");
  const html = bruto.replace(/^<!-- url: .*? -->\n/, "");
  const doc = new DOMParser().parseFromString(html, "text/html") as unknown as Document;
  const { itens, total } = lerResultados(paginaDe(doc, "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=protocolo_pesquisar"));
  return { total, inicio, processos: itens };
}

const p0 = pagina("p_pesquisa_interessado_p0.html", 0);
const p1 = pagina("p_pesquisa_interessado_p1.html", 10);

const armazenamento = (inicial: Record<string, string> = {}) => {
  const m = new Map(Object.entries(inicial));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};

export async function verificarProcessosDoInteressado(): Promise<void> {
  secao("busca de processos: paginas, repeticao, filtro e corrida");
  {
    const estados: EstadoDaLista[] = [];
    const pedidos: number[] = [];
    const b = new BuscaDeProcessos(
      async (inicio) => {
        pedidos.push(inicio);
        return inicio === 0 ? p0 : p1;
      },
      (e) => estados.push(e),
    );
    b.iniciar();
    checar("iniciar publica 'carregando' na hora", estados[0]?.carregando === true && estados[0].processos.length === 0);
    await tique(10);
    const e1 = b.atual();
    checar(
      "primeira pagina: 10 de 13, nao completa",
      e1.processos.length === 10 && e1.total === 13 && !e1.completa && !e1.carregando && !e1.vazia,
      e1,
    );
    b.mais();
    await tique(10);
    const e2 = b.atual();
    checar(
      "mais resultados: acrescenta a segunda (13), pedindo a partir de 10",
      e2.processos.length === 13 && e2.completa && pedidos.join() === "0,10",
      [e2.processos.length, pedidos],
    );
    b.mais();
    await tique(5);
    checar("completa: mais() nao pede nada", pedidos.length === 2);
    b.iniciar();
    await tique(10);
    checar("iniciar de novo recomeca do zero", b.atual().processos.length === 10 && pedidos.join() === "0,10,0");
  }
  {
    // pagina repetida (a lista andou entre uma pagina e outra): nenhum processo duplicado
    const b = new BuscaDeProcessos(
      async (inicio) => (inicio === 0 ? p0 : { total: 13, inicio, processos: [...p0.processos.slice(8), ...p1.processos] }),
      () => undefined,
    );
    b.iniciar();
    await tique(10);
    b.mais();
    await tique(10);
    checar(
      "processo que reaparece na pagina seguinte nao duplica",
      b.atual().processos.length === 13 && new Set(b.atual().processos.map((p) => p.idProcedimento)).size === 13,
    );
  }
  {
    let falhar = true;
    let n = 0;
    const b = new BuscaDeProcessos(
      async () => {
        n += 1;
        if (falhar) throw new Error("Sem conexao");
        return p0;
      },
      () => undefined,
    );
    b.iniciar();
    await tique(10);
    checar(
      "erro na primeira: mensagem, sem lista",
      b.atual().erro === "Sem conexao" && !b.atual().carregando && b.atual().processos.length === 0,
    );
    falhar = false;
    b.repetir();
    await tique(10);
    checar("repetir recarrega a primeira pagina", b.atual().erro === null && b.atual().processos.length === 10 && n === 2);
    falhar = true;
    b.mais();
    await tique(10);
    checar(
      "erro ao pedir mais: a lista que veio fica, com a mensagem",
      b.atual().processos.length === 10 && b.atual().erro === "Sem conexao",
    );
  }
  {
    const b = new BuscaDeProcessos(
      async () => ({ total: 0, inicio: 0, processos: [] }),
      () => undefined,
    );
    b.iniciar();
    await tique(10);
    checar("nenhum processo: vazia e completa", b.atual().vazia && b.atual().completa && b.atual().total === 0);
  }
  {
    // corrida: o filtro muda com a primeira ainda a caminho
    let soltar!: (p: PaginaDeProcessos) => void;
    const sinais: AbortSignal[] = [];
    let chamada = 0;
    const b = new BuscaDeProcessos(
      (_i, sinal) => {
        sinais.push(sinal);
        chamada += 1;
        return chamada === 1
          ? new Promise<PaginaDeProcessos>((r) => (soltar = r))
          : Promise.resolve({ total: 3, inicio: 0, processos: p1.processos });
      },
      () => undefined,
    );
    b.iniciar();
    await tique(5);
    const antiga = soltar;
    b.iniciar();
    await tique(10);
    antiga(p0);
    await tique(10);
    checar(
      "resposta atrasada de um filtro antigo e descartada; a anterior foi cancelada",
      sinais[0]?.aborted === true && b.atual().processos.length === 3 && b.atual().total === 3,
    );
    b.parar();
  }

  secao("filtros guardados com as chaves do legado");
  {
    const st = armazenamento({
      optionsPro: JSON.stringify({ panelDadosArvoreInteressados_tramiteUnidade: true, panelDadosArvoreInteressados_mesmaNatureza: "true" }),
    });
    const f = lerFiltroDoInteressado(st);
    checar("true e 'true' valem", f.tramitadoNaUnidade && f.mesmaNatureza);
    const v = lerFiltroDoInteressado(armazenamento());
    checar("sem nada: tudo desligado", !v.tramitadoNaUnidade && !v.mesmaNatureza);
  }

  secao("modal: lista real, filtros, paginacao e abrir o processo");
  const doc = instalarDom(
    `<html><head></head><body><form id="frmProtocoloPesquisaRapida"><input id="txtPesquisaRapida"></form></body></html>`,
  );
  const restaurar = fingirDialogos(doc);
  const form = doc.getElementById("frmProtocoloPesquisaRapida") as HTMLFormElement;
  const aberturas: string[] = [];
  form.requestSubmit = () =>
    void aberturas.push(
      (doc.getElementById("txtPesquisaRapida") as HTMLInputElement).value + (form.getAttribute("target") === "_blank" ? "|aba" : ""),
    );
  const pedidos: Array<{ interessadoId: string; inicio?: number; tramitadoNaUnidade?: boolean; tipoProcesso?: string }> = [];
  let falhar = false;
  const st = armazenamento();
  const ctx = {
    topo: doc,
    doc,
    armazenamento: st,
    op: {
      processosDoInteressado: async (c: (typeof pedidos)[number]) => {
        pedidos.push(c);
        if (falhar) throw Object.assign(new Error("x"), { codigo: "SEI_REDE" });
        if (c.tramitadoNaUnidade) return { total: 2, inicio: 0, processos: p0.processos.slice(0, 2) };
        return (c.inicio ?? 0) === 0 ? p0 : p1;
      },
      formularioDoProcesso: async () => ({ interessados: [{ id: "100000913", texto: "Secretaria da Seguranca Publica (SSP)" }] }),
    },
  } as unknown as ContextoProcesso;
  const dlg = () => doc.querySelector<HTMLDialogElement>("dialog.spro-dialogo[open]");
  const botao = (rotulo: string) =>
    [...(dlg()?.querySelectorAll("button") ?? [])].find(
      (b) => (b.textContent ?? "").trim().startsWith(rotulo) || b.getAttribute("aria-label") === rotulo,
    ) as HTMLButtonElement | undefined;

  abrirModalProcessosDoInteressado(ctx, {
    nome: "Secretaria da Seguranca Publica (SSP)",
    id: "100000913",
    tipo: "100000442",
    tipoNome: "Expediente de atendimento",
  });
  checar(
    "abre pesquisando (aria-busy)",
    dlg()?.querySelector("[aria-busy]")?.getAttribute("aria-busy") === "true" && /Pesquisando/.test(dlg()?.textContent ?? ""),
  );
  await tique(15);
  checar(
    "lista os 10 processos reais, com o resumo '10 de 13 processos'",
    dlg()?.querySelectorAll(".spro-p-processo").length === 10 && /10 de 13 processos/.test(dlg()?.textContent ?? ""),
    dlg()?.textContent?.slice(0, 120),
  );
  const primeira = dlg()?.querySelector(".spro-p-processo");
  checar(
    "linha: numero, tipo, unidade (sigla e nome), usuario e data",
    /033\.00000024\/2026-10/.test(primeira?.textContent ?? "") &&
      /Expediente de atendimento/.test(primeira?.textContent ?? "") &&
      /PMSP-CG \(Chefia de Gabinete\)/.test(primeira?.textContent ?? "") &&
      /Usuário 01 \(usuario01\)/.test(primeira?.textContent ?? "") &&
      /22\/04\/2026/.test(primeira?.textContent ?? ""),
    primeira?.textContent,
  );
  checar(
    "a pesquisa pediu o interessado, primeira pagina, sem filtros",
    pedidos[0]?.interessadoId === "100000913" &&
      pedidos[0].inicio === 0 &&
      !pedidos[0].tramitadoNaUnidade &&
      pedidos[0].tipoProcesso === undefined,
    pedidos[0],
  );
  checar(
    "sem Cancelar; X e Fechar; sem title; aria-label na lista e nos botoes",
    !botao("Cancelar") &&
      !!botao("Fechar (Esc)") &&
      dlg()?.querySelector("[title]") === null &&
      dlg()?.querySelector("ul")?.getAttribute("aria-label") === "Processos de Secretaria da Seguranca Publica (SSP)" &&
      /Abrir o processo 033/.test(dlg()?.querySelector(".spro-p-processo button")?.getAttribute("aria-label") ?? ""),
  );
  checar("ha mais: botao com o que resta", /Mais resultados \(3 restantes\)/.test(botao("Mais resultados")?.textContent ?? ""));
  botao("Mais resultados")?.click();
  await tique(15);
  checar(
    "mais resultados: 13 processos, sem o botao, pedindo a partir de 10",
    dlg()?.querySelectorAll(".spro-p-processo").length === 13 &&
      !botao("Mais resultados") &&
      pedidos[1]?.inicio === 10 &&
      /13 de 13 processos/.test(dlg()?.textContent ?? ""),
  );
  const filtros = [...(dlg()?.querySelectorAll("input[type=checkbox]") ?? [])] as HTMLInputElement[];
  checar(
    "dois filtros do legado, com os rotulos",
    filtros.length === 2 &&
      /Tramitados na unidade/.test(dlg()?.textContent ?? "") &&
      /De mesmo tipo \(Expediente de atendimento\)/.test(dlg()?.textContent ?? ""),
  );
  filtros[0].checked = true;
  disparar(filtros[0], "change");
  await tique(15);
  checar(
    "filtro tramitado na unidade: recomeca, pede com o filtro e mostra 2",
    pedidos[2]?.tramitadoNaUnidade === true &&
      pedidos[2].inicio === 0 &&
      dlg()?.querySelectorAll(".spro-p-processo").length === 2 &&
      /2 de 2 processos/.test(dlg()?.textContent ?? ""),
    pedidos[2],
  );
  checar(
    "o filtro fica gravado com a chave do legado",
    /"panelDadosArvoreInteressados_tramiteUnidade":true/.test(st.m.get("optionsPro") ?? ""),
  );
  filtros[1].checked = true;
  disparar(filtros[1], "change");
  await tique(15);
  checar("filtro de mesmo tipo: manda o id do tipo", pedidos[3]?.tipoProcesso === "100000442", pedidos[3]);

  const antes = aberturas.length;
  (dlg()?.querySelector(".spro-p-processo button") as HTMLButtonElement).click();
  checar(
    "clicar abre o processo pelo numero (pesquisa rapida) e fecha o modal",
    aberturas.length === antes + 1 && aberturas[antes] === "033.00000024/2026-10" && dlg() === null,
    aberturas,
  );

  // com Ctrl: nova aba e o modal fica
  abrirModalProcessosDoInteressado(ctx, { nome: "X", id: "1" });
  await tique(15);
  const b2 = dlg()?.querySelector(".spro-p-processo button") as HTMLButtonElement;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  b2.dispatchEvent(Object.assign(new Ev("click", { bubbles: true }), { ctrlKey: true }));
  checar(
    "Ctrl+clique: nova aba e o modal continua aberto",
    aberturas[aberturas.length - 1]?.endsWith("|aba") === true && dlg() !== null,
    aberturas[aberturas.length - 1],
  );
  dlg()?.close();

  // erro (sem os filtros que o teste anterior gravou)
  st.m.clear();
  falhar = true;
  abrirModalProcessosDoInteressado(ctx, { nome: "Y", id: "2" });
  await tique(15);
  checar(
    "erro: mensagem do SEI sem spinner, com Tentar de novo",
    /Sem conexão com o SEI/.test(dlg()?.querySelector(".spro-p-processos-rodape .spro-p-erro")?.textContent ?? "") &&
      !!botao("Tentar de novo") &&
      dlg()?.querySelector("[aria-busy]")?.getAttribute("aria-busy") === "false",
  );
  falhar = false;
  botao("Tentar de novo")?.click();
  await tique(15);
  checar("Tentar de novo recarrega", dlg()?.querySelectorAll(".spro-p-processo").length === 10, [
    dlg()?.querySelectorAll(".spro-p-processo").length,
    dlg()?.textContent?.slice(0, 200),
    pedidos.length,
  ]);
  dlg()?.close();

  // sem id (cache antigo): resolve pelo formulario do processo
  pedidos.length = 0;
  abrirModalProcessosDoInteressado(ctx, { nome: "Secretaria da Seguranca Publica (SSP)" });
  await tique(20);
  checar(
    "sem o id no cache: acha pelo nome no formulario do processo",
    pedidos[0]?.interessadoId === "100000913" && dlg()?.querySelectorAll(".spro-p-processo").length === 10,
  );
  dlg()?.close();
  restaurar();
}
