/**
 * Painel do resultado: baixar, e -- quando ha SEI do outro lado -- devolver o
 * arquivo ao processo.
 *
 * O botao de devolver so aparece com a ponte ativa. Saida multipla envia N
 * documentos, um a um, NUNCA um ZIP: zip como documento de processo e ma
 * pratica, e quem receber nao consegue ler sem baixar e extrair.
 */

import { formatarBytes } from "@/lib/ferramentas/formatarBytes";
import { el, icone, repor } from "@/ui/dom";
import { CLASSE_GIRANDO, comCarregamento } from "@/ui/carregando";
import type { SaidaWorker } from "@/lib/ferramentas/protocoloWorker";

export interface AcoesResultado {
  aoBaixar(): void;
  /** Devolve promessa: o envio fala com o SEI e o botão indica o progresso. */
  aoEnviarAoSei?(): void | Promise<void>;
  aoRecomecar(): void;
}

export interface PainelResultado {
  raiz: HTMLElement;
  sincronizar(props: {
    saidas: SaidaWorker[] | null;
    bytes: number;
    podeEnviarAoSei: boolean;
    enviando?: boolean;
    mensagemEnvio?: string | null;
  }): void;
}

export function criarPainelResultado(acoes: AcoesResultado): PainelResultado {
  const titulo = el("h3", { class: "fpdf-resultado__titulo" });
  const detalhe = el("p", { class: "fpdf-resultado__detalhe" });
  const listaSaidas = el("ul", { class: "fpdf-resultado__saidas" });

  const baixar = el(
    "button",
    { type: "button", class: "fpdf-botao fpdf-botao--primario", onclick: acoes.aoBaixar },
    icone("fas fa-download"),
    " Baixar",
  );

  const enviar = acoes.aoEnviarAoSei
    ? el(
        "button",
        {
          type: "button",
          class: "fpdf-botao fpdf-botao--secundario",
          hidden: true,
          onclick: () => {
            // Enviar documento ao processo passa por várias etapas no SEI e
            // pode demorar bastante em rede de órgão.
            void comCarregamento(enviar, async () => {
              await acoes.aoEnviarAoSei?.();
            });
          },
        },
        icone("fas fa-sitemap"),
        " Enviar ao processo",
      )
    : null;

  const aviso = el("p", { class: "fpdf-resultado__aviso", hidden: true });

  const raiz = el(
    "div",
    { class: "fpdf-resultado", hidden: true },
    el("div", { class: "fpdf-resultado__marca" }, icone("fas fa-check-circle")),
    titulo,
    detalhe,
    listaSaidas,
    aviso,
    el(
      "div",
      { class: "fpdf-resultado__acoes" },
      baixar,
      enviar,
      el(
        "button",
        { type: "button", class: "fpdf-botao fpdf-botao--texto", onclick: acoes.aoRecomecar },
        "Começar de novo",
      ),
    ),
  );

  return {
    raiz,
    sincronizar({ saidas, bytes, podeEnviarAoSei, enviando = false, mensagemEnvio = null }) {
      if (!saidas || saidas.length === 0) {
        raiz.hidden = true;
        return;
      }
      raiz.hidden = false;

      repor(titulo, saidas.length === 1 ? "Documento pronto" : `${saidas.length} arquivos gerados`);
      repor(
        detalhe,
        saidas.length === 1
          ? formatarBytes(bytes)
          : `${formatarBytes(bytes)} no total. O download vem em um arquivo ZIP.`,
      );

      // So lista os nomes quando ha mais de um: com um arquivo so, o nome ja
      // esta no titulo e a lista viraria ruido.
      listaSaidas.hidden = saidas.length < 2;
      if (saidas.length >= 2) {
        repor(
          listaSaidas,
          ...saidas.map((s) =>
            el(
              "li",
              {},
              el("span", { class: "fpdf-resultado__nome" }, s.nome),
              el("span", { class: "fpdf-resultado__tamanho" }, formatarBytes(s.bytes.byteLength)),
            ),
          ),
        );
      }

      if (enviar) {
        enviar.hidden = !podeEnviarAoSei;
        // O ESTADO OCUPADO É REAFIRMADO AQUI, e não apenas preservado.
        //
        // `comCarregamento` põe o indicador no clique, o que basta enquanto
        // nada mais mexe no botão. Só que o envio dura vários segundos e
        // atravessa várias sincronizações -- progresso, mudança da ponte,
        // chegada do resultado. Bastava UMA delas reconstruir o conteúdo para
        // o botão voltar a parecer parado no meio da operação, e o usuário
        // clicar de novo. Declarar o estado a cada sincronização remove a
        // corrida inteira: enquanto `enviando`, o botão está girando, tenha
        // quem tiver desenhado por último.
        if (enviando) {
          const indicador = enviar.querySelector("i");
          if (indicador) indicador.className = CLASSE_GIRANDO;
          else enviar.prepend(icone(CLASSE_GIRANDO));
          enviar.disabled = true;
          enviar.setAttribute("aria-busy", "true");
        } else {
          repor(enviar, icone("fas fa-sitemap"), " Enviar ao processo");
          enviar.disabled = false;
          enviar.removeAttribute("aria-busy");
        }
      }
      // Baixar fica fora do ar durante o envio: são os mesmos bytes, e deixar
      // os dois caminhos abertos ao mesmo tempo só gera confusão.
      baixar.disabled = enviando;

      aviso.hidden = !mensagemEnvio;
      if (mensagemEnvio) repor(aviso, mensagemEnvio);
    },
  };
}
