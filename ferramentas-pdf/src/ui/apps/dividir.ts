/**
 * Dividir PDF: por intervalos, por numero de paginas ou por tamanho.
 *
 * O corte por TAMANHO e o que resolve o problema real de quem protocola: o
 * arquivo nao cabe no limite do orgao. Quando ha ponte com o SEI, o limite vem
 * lido da instalacao, com a margem de seguranca ja aplicada.
 */

import { formatarBytes } from "@/lib/ferramentas/formatarBytes";
import { limiteComMargem } from "@/lib/ferramentas/protocolo/tipos";
import { el, repor } from "@/ui/dom";
import { montarMoldura, type FerramentaMontada } from "@/ui/moldura";
import { aoMudarPerfil } from "@/ui/contexto";
import { MODOS_DIVISAO, opcoesDaDivisao, type ModoDaTela } from "@/ui/apps/dividirOpcoes";

export function montar(): FerramentaMontada {
  let cancelarPerfil: (() => void) | null = null;

  const montada = montarMoldura({
    operacao: "dividir",
    titulo: "Dividir PDF",
    descricao:
      "Separe páginas, intervalos, ou parta o arquivo em partes que caibam num limite de tamanho.",
    rotuloAcao: "Dividir documento",
    multiplo: false,
    nomeZip: "partes",
    zona: {
      titulo: "Solte o PDF aqui",
      apoio: "ou escolha o arquivo do seu computador",
      rotuloBotao: "Escolher PDF",
      ajuda: "Um documento por vez. O resultado com várias partes vem num arquivo ZIP.",
    },
    validar: (f) => (f.prontos.length !== 1 ? "Escolha um documento para dividir." : null),
    painelOpcoes: (_f, sincronizar) => {
      const seletor = el(
        "select",
        { class: "fpdf-campo", id: "dividir-modo", onchange: () => trocarModo() },
        ...MODOS_DIVISAO.map((m) => el("option", { value: m.valor }, m.rotulo)),
      ) as HTMLSelectElement;

      const intervalos = el("input", {
        type: "text",
        class: "fpdf-campo",
        id: "dividir-intervalos",
        placeholder: "1-3, 5, 8-10",
      });
      const porPaginas = el("input", {
        type: "number",
        class: "fpdf-campo",
        id: "dividir-paginas",
        min: "1",
        value: "10",
      });
      const porTamanho = el("input", {
        type: "number",
        class: "fpdf-campo",
        id: "dividir-tamanho",
        min: "1",
        value: "10",
      });

      const linhaIntervalos = linha("dividir-intervalos", "Intervalos", intervalos,
        "Separe por vírgula. Exemplo: 1-3, 5, 8-10.");
      const linhaPaginas = linha("dividir-paginas", "Páginas por parte", porPaginas);
      const procedencia = el("p", { class: "fpdf-opcoes__ajuda" });
      const linhaTamanho = linha("dividir-tamanho", "Tamanho máximo por parte (MB)", porTamanho);
      linhaTamanho.append(procedencia);

      const raiz = el(
        "div",
        { class: "fpdf-opcoes" },
        linha("dividir-modo", "Como dividir", seletor),
        linhaIntervalos,
        linhaPaginas,
        linhaTamanho,
      );

      function trocarModo() {
        const modo = seletor.value as ModoDaTela;
        linhaIntervalos.hidden = modo !== "porIntervalos";
        linhaPaginas.hidden = modo !== "porQuantidade";
        linhaTamanho.hidden = modo !== "porTamanho";
        sincronizar();
      }

      // O limite do orgao, quando conhecido, entra como sugestao -- com a
      // procedencia na tela. Nunca afirmamos um limite sem dizer de onde veio.
      cancelarPerfil = aoMudarPerfil((perfil) => {
        const teto = perfil.limites.bytesPorArquivo;
        if (teto) {
          const comMargem = limiteComMargem(teto);
          porTamanho.value = String(Math.max(1, Math.floor(comMargem / (1024 * 1024))));
          repor(
            procedencia,
            `Sugerido a partir do limite desta instalação do SEI (${formatarBytes(teto)}), com margem de segurança: ${formatarBytes(comMargem)}. A assinatura digital acrescenta bytes depois desta etapa.`,
          );
        } else {
          repor(
            procedencia,
            "O limite por arquivo é configurado por cada instalação do SEI. Abra as Ferramentas de PDF a partir do SEI para ler o valor do seu órgão, ou confira na própria tela de envio.",
          );
        }
      });

      trocarModo();

      return {
        raiz,
        valores: () =>
          opcoesDaDivisao(seletor.value as ModoDaTela, {
            intervalos: intervalos.value,
            paginasPorParte: porPaginas.value,
            tamanhoMb: porTamanho.value,
          }),
        sincronizar: (desabilitado) => {
          for (const campo of [seletor, intervalos, porPaginas, porTamanho]) {
            (campo as HTMLInputElement).disabled = desabilitado;
          }
        },
      };
    },
  });

  return {
    raiz: montada.raiz,
    destruir() {
      cancelarPerfil?.();
      montada.destruir();
    },
  };
}

function linha(idCampo: string, rotulo: string, campo: HTMLElement, ajuda?: string) {
  return el(
    "div",
    { class: "fpdf-opcoes__linha" },
    el("label", { for: idCampo }, rotulo),
    campo,
    ajuda ? el("p", { class: "fpdf-opcoes__ajuda" }, ajuda) : null,
  );
}
