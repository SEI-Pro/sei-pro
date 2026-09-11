/**
 * Comprimir PDF.
 *
 * O relatorio no fim NAO e decoracao: a compressao pode nao render nada, e
 * quando isso acontece o usuario precisa saber por que -- documento so de texto
 * ja e pequeno, imagem em JBIG2 nao e reamostrada, PDF assinado e recusado.
 * Sem o relatorio, "nao reduziu" viraria silencio e o usuario tentaria de novo.
 */

import { formatarBytes } from "@/lib/ferramentas/formatarBytes";
import type { SaidaWorker } from "@/lib/ferramentas/protocoloWorker";
import { limiteComMargem } from "@/lib/ferramentas/protocolo/tipos";
import { el, repor } from "@/ui/dom";
import { montarMoldura, type FerramentaMontada } from "@/ui/moldura";
import { aoMudarPerfil } from "@/ui/contexto";

export function montar(): FerramentaMontada {
  let cancelarPerfil: (() => void) | null = null;

  const montada = montarMoldura({
    operacao: "comprimir",
    titulo: "Comprimir PDF",
    descricao:
      "Reduza o tamanho do arquivo para caber no limite exigido pelo órgão, sem enviar nada para fora.",
    rotuloAcao: "Comprimir documento",
    multiplo: false,
    zona: {
      titulo: "Solte o PDF aqui",
      apoio: "ou escolha o arquivo do seu computador",
      rotuloBotao: "Escolher PDF",
      ajuda:
        "Um documento por vez. Documento assinado digitalmente não é comprimido: alterar os bytes invalidaria a assinatura.",
    },
    validar: (f) => (f.prontos.length !== 1 ? "Escolha um documento para comprimir." : null),
    aoConcluir: relatorioDaCompressao,
    painelOpcoes: (_f, sincronizar) => {
      const nivel = el(
        "select",
        { class: "fpdf-campo", id: "comprimir-nivel", onchange: () => sincronizar() },
        el("option", { value: "estrutural" }, "Estrutural (não mexe nas imagens)"),
        el("option", { value: "equilibrado", selected: true }, "Equilibrado"),
        el("option", { value: "agressivo" }, "Agressivo (imagens menores)"),
      ) as HTMLSelectElement;

      const usarAlvo = el("input", {
        type: "checkbox",
        id: "comprimir-usar-alvo",
        onchange: () => {
          alvo.disabled = !usarAlvo.checked;
          sincronizar();
        },
      });
      const alvo = el("input", {
        type: "number",
        class: "fpdf-campo",
        id: "comprimir-alvo",
        min: "1",
        value: "10",
        disabled: true,
      });
      const procedencia = el("p", { class: "fpdf-opcoes__ajuda" });

      cancelarPerfil = aoMudarPerfil((perfil) => {
        const teto = perfil.limites.bytesPorArquivo;
        if (teto) {
          const comMargem = limiteComMargem(teto);
          alvo.value = String(Math.max(1, Math.floor(comMargem / (1024 * 1024))));
          repor(
            procedencia,
            `Limite desta instalação do SEI: ${formatarBytes(teto)}. Sugerimos ${formatarBytes(comMargem)}, com margem de segurança.`,
          );
        } else {
          repor(
            procedencia,
            "Não há um limite padrão do SEI: cada instalação configura o seu. Confira o valor na tela de envio do seu órgão.",
          );
        }
      });

      const raiz = el(
        "div",
        { class: "fpdf-opcoes" },
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el("label", { for: "comprimir-nivel" }, "Nivel"),
          nivel,
        ),
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el(
            "div",
            { class: "fpdf-opcoes__caixa" },
            usarAlvo,
            el("label", { for: "comprimir-usar-alvo" }, "Tentar caber num tamanho (MB)"),
          ),
          alvo,
          procedencia,
        ),
      );

      return {
        raiz,
        valores: () => ({
          nivel: nivel.value,
          alvoBytes: usarAlvo.checked ? (Number(alvo.value) || 1) * 1024 * 1024 : undefined,
        }),
        sincronizar: (desabilitado) => {
          nivel.disabled = desabilitado;
          usarAlvo.disabled = desabilitado;
          alvo.disabled = desabilitado || !usarAlvo.checked;
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

/**
 * Relatorio do que a compressao fez.
 *
 * Existe porque a compressao pode nao render nada, e o usuario precisa saber
 * por que -- senao tenta de novo, com outro nivel, e chega ao mesmo lugar.
 */
function relatorioDaCompressao(saidas: SaidaWorker[]): Node | null {
  const meta = saidas[0]?.meta as Record<string, unknown> | undefined;
  if (!meta) return null;

  const linhas: string[] = [];

  if (meta.semGanho) {
    linhas.push(
      "Não foi possível reduzir este documento. O arquivo devolvido é o ORIGINAL, intacto: comprimir teria deixado o resultado maior.",
    );
  } else {
    const de = Number(meta.bytesOriginais);
    const para = Number(meta.bytesFinais);
    const pct = de > 0 ? Math.round((1 - para / de) * 100) : 0;
    linhas.push(`De ${formatarBytes(de)} para ${formatarBytes(para)} -- ${pct}% menor.`);
  }

  if (Number(meta.imagensReamostradas) > 0) {
    linhas.push(`${meta.imagensReamostradas} imagem(ns) foram reduzidas.`);
  }

  if (Number(meta.imagensPuladas) > 0) {
    // Nao e defeito: a lista de aceitacao e estrita de proposito. Imagem com
    // mascara, em JBIG2 ou com perfil de cor embutido sai corrompida ou muito
    // pior se recomprimida -- e digitalizacao de processo tem muito disso.
    linhas.push(
      `${meta.imagensPuladas} imagem(ns) foram preservadas como estavam: são formatos em que recomprimir degradaria ou corromperia o conteúdo.`,
    );
  }

  if (meta.reamostragemIndisponivel) {
    linhas.push(
      "Este navegador não permite reamostrar imagens, então só a compressão estrutural foi aplicada.",
    );
  }

  if (meta.alvoNaoAlcancado) {
    linhas.push(
      "Não foi possível chegar ao tamanho pedido sem degradar demais o documento. Considere dividi-lo em partes.",
    );
  }

  return el("div", {}, ...linhas.map((t) => el("p", {}, t)));
}
