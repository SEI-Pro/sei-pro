/**
 * "Processos deste interessado": a pesquisa do SEI (menu "Pesquisa") feita com o contato como interessado, num modal
 * com a lista (número, tipo, unidade, usuário e data), os dois filtros do legado (tramitados na unidade, de mesmo tipo) e
 * "Mais resultados" quando há mais de uma página. Só vêm os processos que o usuário pode ver, e só se lê: nenhuma
 * árvore é aberta. Clicar num processo o abre pelo número, como a pesquisa rápida do SEI.
 */
import { abrirProcesso } from "@comum/pagina/abrir";
import { h, icone } from "@comum/ui/dom";
import type { ResultadoPesquisa } from "@nucleo/dominio/pesquisa";
import { BuscaDeProcessos, type EstadoDaLista } from "../../modelo/buscaProcessos";
import { avisarNoTopo, mensagemDeLeitura } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { gravarFiltroDoInteressado, lerFiltroDoInteressado } from "../opcoes";
import { abrirDialogo, interruptor } from "./comum";

export interface AlvoInteressado {
  nome: string;
  /** `id_contato`. Sem ele (cache antigo), o modal o procura no formulário do processo pelo nome. */
  id?: string;
  /** Id (ou nome) do tipo do processo da tela: o filtro "de mesmo tipo". */
  tipo?: string;
  /** Nome do tipo, só para o rótulo do filtro. */
  tipoNome?: string;
}

const dois = (n: number): string => (n === 1 ? "1 processo" : `${n} processos`);

/** Uma linha da lista: número (abre o processo), tipo e, embaixo, unidade, usuário e data. */
function linhaDoProcesso(p: ResultadoPesquisa, abrir: (p: ResultadoPesquisa, novaAba: boolean) => void): HTMLElement {
  const botao = h(
    "button",
    { type: "button", class: "spro-p-link spro-p-proc-num", "aria-label": `Abrir o processo ${p.protocolo}` },
    icone("pasta", 14),
    p.protocolo,
  );
  botao.addEventListener("click", (ev) => abrir(p, (ev as MouseEvent).ctrlKey || (ev as MouseEvent).metaKey));
  botao.addEventListener("auxclick", (ev) => {
    if ((ev as MouseEvent).button === 1) abrir(p, true);
  });
  const unidade = p.unidade ? (p.unidadeNome && p.unidadeNome !== p.unidade ? `${p.unidade} (${p.unidadeNome})` : p.unidade) : "";
  const usuario = p.usuario ? (p.usuarioNome && p.usuarioNome !== p.usuario ? `${p.usuarioNome} (${p.usuario})` : p.usuario) : "";
  const meta = [unidade, usuario, p.data].filter(Boolean);
  return h(
    "li",
    { class: "spro-p-processo" },
    h("div", { class: "spro-p-processo-topo" }, botao, p.tipoProcesso ? h("span", { class: "spro-p-chip" }, p.tipoProcesso) : null),
    meta.length ? h("div", { class: "spro-p-processo-meta" }, ...meta.map((m) => h("span", {}, m))) : null,
  );
}

export function abrirModalProcessosDoInteressado(ctx: ContextoProcesso, alvo: AlvoInteressado): void {
  const filtro = lerFiltroDoInteressado(ctx.armazenamento);
  const tramitado = interruptor("Tramitados na unidade", filtro.tramitadoNaUnidade, () => recomecar());
  const natureza = interruptor(alvo.tipoNome ? `De mesmo tipo (${alvo.tipoNome})` : "De mesmo tipo", filtro.mesmaNatureza, () => recomecar());
  natureza.input.disabled = !alvo.tipo;
  const resumo = h("div", { class: "spro-p-nota", role: "status", "aria-live": "polite" });
  const lista = h("ul", { class: "spro-p-lista-processos", "aria-label": `Processos de ${alvo.nome}` });
  const rodapeLista = h("div", { class: "spro-p-processos-rodape" });
  const area = h("div", { class: "spro-p-modal-lugar" }, resumo, lista, rodapeLista);
  const d = abrirDialogo(ctx, {
    titulo: "Processos do interessado",
    icone: "pessoa",
    largura: 640,
    conteudo: [
      h("p", { class: "spro-p-interessado-nome" }, alvo.nome),
      h("div", { class: "spro-p-ferramentas", role: "group", "aria-label": "Filtros da pesquisa" }, tramitado.el, natureza.el),
      area,
    ],
  });
  d.el.classList.add("spro-p-dialogo-processos");

  let idDoContato: string | undefined = alvo.id;
  const resolverId = async (): Promise<string> => {
    if (idDoContato) return idDoContato;
    const fp = await ctx.op.formularioDoProcesso();
    const achado = fp.interessados.find((i) => i.texto === alvo.nome) ?? fp.interessados.find((i) => i.texto.startsWith(alvo.nome));
    if (!achado) throw new Error("Não achei este interessado no cadastro do processo.");
    idDoContato = achado.id;
    return achado.id;
  };

  const abrir = (p: ResultadoPesquisa, novaAba: boolean): void => {
    try {
      abrirProcesso(ctx.topo, p.idProcedimento ?? "", p.protocolo, novaAba);
      if (!novaAba) d.fechar();
    } catch (e) {
      avisarNoTopo(ctx, e instanceof Error ? e.message : "Não foi possível abrir o processo.", 6000);
    }
  };

  const busca = new BuscaDeProcessos(
    async (inicio, sinal) =>
      ctx.op.processosDoInteressado(
        {
          interessadoId: await resolverId(),
          inicio,
          tramitadoNaUnidade: tramitado.input.checked,
          ...(natureza.input.checked && alvo.tipo ? { tipoProcesso: alvo.tipo } : {}),
        },
        sinal,
      ),
    (e) => desenhar(e),
    mensagemDeLeitura,
  );
  const recomecar = (): void => {
    gravarFiltroDoInteressado(ctx.armazenamento, { tramitadoNaUnidade: tramitado.input.checked, mesmaNatureza: natureza.input.checked });
    busca.iniciar();
  };

  function desenhar(e: EstadoDaLista): void {
    area.setAttribute("aria-busy", String(e.carregando));
    lista.replaceChildren(...e.processos.map((p) => linhaDoProcesso(p, abrir)));
    rodapeLista.replaceChildren();
    if (e.carregando && !e.processos.length) {
      resumo.textContent = "Pesquisando os processos do interessado…";
      lista.append(h("li", { class: "spro-p-esqueleto", "aria-hidden": "true" }, h("span", { class: "spro-p-barra" }), h("span", { class: "spro-p-barra", style: "width:62%" })));
      return;
    }
    if (e.erro && !e.processos.length) {
      resumo.replaceChildren();
      const de_novo = h("button", { type: "button", class: "spro-p-link" }, "Tentar de novo");
      de_novo.addEventListener("click", () => busca.repetir());
      rodapeLista.append(h("div", { class: "spro-p-erro", role: "alert" }, icone("alerta", 13), ` ${e.erro} `, de_novo));
      return;
    }
    if (e.vazia) {
      resumo.textContent = "Nenhum processo encontrado. A pesquisa só traz os que você pode ver.";
      return;
    }
    resumo.textContent = e.total === null ? "" : `${e.processos.length} de ${dois(e.total)}.`;
    if (e.erro) {
      const de_novo = h("button", { type: "button", class: "spro-p-link" }, "Tentar de novo");
      de_novo.addEventListener("click", () => busca.repetir());
      rodapeLista.append(h("div", { class: "spro-p-erro", role: "alert" }, icone("alerta", 13), ` ${e.erro} `, de_novo));
    } else if (!e.completa) {
      const mais = h(
        "button",
        { type: "button", class: "spro-botao" },
        e.carregando ? "Carregando…" : `Mais resultados (${(e.total ?? 0) - e.processos.length} restantes)`,
      );
      mais.disabled = e.carregando;
      mais.addEventListener("click", () => busca.mais());
      rodapeLista.append(mais);
    }
  }

  d.el.addEventListener("close", () => busca.parar());
  busca.iniciar();
}
