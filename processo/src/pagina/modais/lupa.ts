/**
 * Modal de lista com pesquisa (assuntos e interessados do processo): o que já está no processo, com "Retirar", e uma busca
 * incremental no autocompletar do próprio SEI, com "Adicionar". Só grava no "Salvar", pela lupa do formulário do
 * processo (`alterarProcesso`, com prova de sucesso). Sem botão Cancelar (o X e o Esc fecham).
 */
import { h, icone, type NomeIcone } from "@comum/ui/dom";
import type { ResultadoEscrita } from "@nucleo/dominio/escrita";
import type { ItemLupa } from "@nucleo/formulario/formulario";
import { ListaEditavel } from "../../modelo/lista";
import { type EstadoDaBusca, Pesquisador } from "../../modelo/pesquisador";
import { mensagemDeLeitura } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, rodape } from "./comum";

export interface CargaLupa {
  atuais: ItemLupa[];
  /** id -> sigla da unidade que acrescentou: esta unidade não pode retirar. */
  negados: ReadonlyMap<string, string>;
  pesquisar(termo: string, sinal: AbortSignal): Promise<ItemLupa[]>;
}

export interface ConfigLupa {
  titulo: string;
  icone: NomeIcone;
  /** "assunto", "interessado": entra nos rótulos de acessibilidade. */
  nome: string;
  nomePlural: string;
  /** Texto de ajuda sob o campo de busca. */
  dica: string;
  carregar(): Promise<CargaLupa>;
  gravar(itens: ItemLupa[]): Promise<ResultadoEscrita>;
  /** Depois de gravar: refaz a leitura do painel. */
  depois(): void;
  /** Se preenchido, a lista final não pode ficar vazia e esta é a mensagem. */
  obrigatorio?: string;
  /** Para os testes. */
  esperaMs?: number;
}

const resumo = (c: { retirados: number; novos: number }): string => {
  const partes: string[] = [];
  if (c.novos) partes.push(`${c.novos} a acrescentar`);
  if (c.retirados) partes.push(`${c.retirados} a retirar`);
  return partes.join(", ");
};

export function abrirModalLupa(ctx: ContextoProcesso, cfg: ConfigLupa): void {
  const lugar = h("div", { class: "spro-p-modal-lugar" }, h("p", { class: "spro-p-nota" }, `Carregando ${cfg.nomePlural} do processo…`));
  const d = abrirDialogo(ctx, { titulo: cfg.titulo, icone: cfg.icone, largura: 560, conteudo: [lugar] });

  const montar = (carga: CargaLupa): void => {
    const lista = new ListaEditavel(carga.atuais, carga.negados);
    const titulo = h("h3", { class: "spro-p-lupa-titulo" });
    const atuais = h("ul", { class: "spro-p-lista-modal", "aria-label": `${cfg.nomePlural} no processo` });
    const campo = h("input", {
      type: "search",
      class: "spro-campo",
      autocomplete: "off",
      "aria-label": `Pesquisar ${cfg.nome} para adicionar`,
      "aria-controls": "spro-p-lupa-resultados",
      placeholder: "Pesquisar…",
    });
    const estado = h("div", { class: "spro-p-nota spro-p-lupa-estado", role: "status", "aria-live": "polite" });
    const resultados = h("ul", {
      class: "spro-p-lista-modal spro-p-resultados",
      id: "spro-p-lupa-resultados",
      "aria-label": "Resultados da pesquisa",
    });
    const situacao = h("span", { class: "spro-p-nota spro-p-lupa-situacao", "aria-live": "polite" });
    const salvar = botaoPrimario("Salvar", () => void enviar());
    let ultimaBusca: EstadoDaBusca = { tipo: "ocioso" };

    const desenharAtuais = (): void => {
      const linhas = lista.linhas();
      const c = lista.contagem();
      titulo.textContent = `No processo (${c.atuais + c.novos})`;
      atuais.replaceChildren(
        ...(linhas.length
          ? linhas.map((l) => {
              let acao: HTMLElement;
              if (l.negadoPor) {
                acao = h("span", { class: "spro-p-chip" }, `Acrescentado por ${l.negadoPor}`);
              } else {
                const b = h(
                  "button",
                  l.estado === "novo"
                    ? { type: "button", class: "spro-p-acao perigo", "aria-label": `Desfazer a inclusão de ${l.item.texto}` }
                    : {
                        type: "button",
                        class: "spro-p-acao perigo",
                        "aria-pressed": String(l.estado === "retirado"),
                        "aria-label": `${l.estado === "retirado" ? "Manter" : "Retirar"} ${l.item.texto}`,
                      },
                  l.estado === "novo" ? "Desfazer" : l.estado === "retirado" ? "Manter" : "Retirar",
                );
                b.addEventListener("click", () => {
                  if (l.estado === "novo") lista.removerNovo(l.item.id);
                  else lista.alternarRetirada(l.item.id);
                  atualizar();
                });
                acao = b;
              }
              return h(
                "li",
                { class: "spro-p-linha-modal", "data-estado": l.estado },
                l.estado === "novo" ? h("span", { class: "spro-p-chip ok" }, "Novo") : null,
                h("span", { class: "spro-p-texto-modal" }, l.item.texto),
                acao,
              );
            })
          : [h("li", { class: "spro-p-vazio" }, `O processo não tem ${cfg.nomePlural}.`)]),
      );
      salvar.disabled = !lista.mudou();
      situacao.textContent = resumo(c);
    };

    const desenharResultados = (e: EstadoDaBusca): void => {
      ultimaBusca = e;
      resultados.replaceChildren();
      resultados.removeAttribute("aria-busy");
      if (e.tipo === "ocioso") estado.textContent = cfg.dica;
      else if (e.tipo === "curto") estado.textContent = `Digite mais ${e.falta === 1 ? "1 letra" : `${e.falta} letras`} para pesquisar.`;
      else if (e.tipo === "pesquisando") {
        estado.textContent = "Pesquisando…";
        resultados.setAttribute("aria-busy", "true");
      } else if (e.tipo === "vazio") estado.textContent = `Nenhum resultado para “${e.termo}”.`;
      else if (e.tipo === "erro") {
        const de_novo = h("button", { type: "button", class: "spro-p-link" }, "Tentar de novo");
        de_novo.addEventListener("click", () => pesquisador.repetir(campo.value));
        estado.replaceChildren(icone("alerta", 13), ` ${e.mensagem} `, de_novo);
      } else {
        estado.textContent = e.itens.length === 1 ? "1 resultado." : `${e.itens.length} resultados.`;
        for (const item of e.itens) {
          const ja = lista.tem(item.id);
          const botao = h(
            "button",
            { type: "button", class: "spro-p-acao", "aria-label": ja ? `${item.texto} (já está no processo)` : `Adicionar ${item.texto}` },
            ja ? "No processo" : "Adicionar",
          );
          botao.disabled = ja;
          botao.addEventListener("click", () => {
            if (lista.adicionar(item)) {
              atualizar();
              desenharResultados(ultimaBusca);
              // Foco no próximo "Adicionar" livre para quem adiciona vários só pelo teclado.
              (resultados.querySelector("button:not([disabled])") as HTMLElement | null)?.focus();
            }
          });
          resultados.append(h("li", { class: "spro-p-linha-modal" }, h("span", { class: "spro-p-texto-modal" }, item.texto), botao));
        }
        return;
      }
    };

    const atualizar = (): void => desenharAtuais();

    const pesquisador = new Pesquisador({
      pesquisar: carga.pesquisar,
      aoMudar: desenharResultados,
      mensagemDeErro: mensagemDeLeitura,
      ...(cfg.esperaMs !== undefined ? { esperaMs: cfg.esperaMs } : {}),
    });
    campo.addEventListener("input", () => pesquisador.digitou(campo.value));
    campo.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        pesquisador.agora(campo.value);
      } else if (ev.key === "ArrowDown") {
        const primeiro = resultados.querySelector<HTMLElement>("button:not([disabled])");
        if (primeiro) {
          ev.preventDefault();
          primeiro.focus();
        }
      }
    });
    resultados.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
      const botoes = [...resultados.querySelectorAll<HTMLElement>("button:not([disabled])")];
      const i = botoes.indexOf(ev.target as HTMLElement);
      if (i < 0) return;
      ev.preventDefault();
      if (ev.key === "ArrowDown") botoes[Math.min(i + 1, botoes.length - 1)]?.focus();
      else if (i === 0) campo.focus();
      else botoes[i - 1]?.focus();
    });
    d.el.addEventListener("close", () => pesquisador.parar());

    const enviar = async (): Promise<void> => {
      const final = lista.resultado();
      if (cfg.obrigatorio && !final.length) {
        d.erro(cfg.obrigatorio);
        return;
      }
      const ok = await d.gravar(() => cfg.gravar(final), [salvar]);
      if (ok) cfg.depois();
    };

    lugar.replaceChildren(
      titulo,
      atuais,
      h(
        "div",
        { class: "spro-p-lupa-busca" },
        h("label", { class: "spro-p-campo" }, h("span", { class: "spro-p-campo-rotulo" }, `Adicionar ${cfg.nome}`), campo),
        estado,
        resultados,
      ),
      rodape(situacao, salvar),
    );
    desenharAtuais();
    desenharResultados({ tipo: "ocioso" });
    campo.focus({ preventScroll: true });
  };

  const carregar = (): void => {
    lugar.replaceChildren(h("p", { class: "spro-p-nota" }, `Carregando ${cfg.nomePlural} do processo…`));
    cfg
      .carregar()
      .then((carga) => {
        if (d.el.isConnected) montar(carga);
      })
      .catch((e: unknown) => {
        if (!d.el.isConnected) return;
        const de_novo = h("button", { type: "button", class: "spro-p-link" }, "Tentar de novo");
        de_novo.addEventListener("click", carregar);
        lugar.replaceChildren(h("div", { class: "spro-p-erro", role: "alert" }, icone("alerta", 13), ` ${mensagemDeLeitura(e)} `, de_novo));
      });
  };
  carregar();
}
