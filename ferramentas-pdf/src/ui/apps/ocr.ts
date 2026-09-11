/**
 * OCR: torna pesquisavel um PDF digitalizado.
 *
 * NAO USA A MOLDURA porque a operacao nao passa pelo worker de PDF: depende do
 * pdf.js e do Tesseract, que ja abrem workers proprios, e worker aninhado nao e
 * confiavel em todo navegador. Roda na thread da aba, com progresso por página.
 *
 * O DOCUMENTO ORIGINAL E PRESERVADO. O texto reconhecido entra como camada
 * INVISIVEL por cima da imagem existente -- nada e rasterizado de novo. Um OCR
 * que remonta o documento degradaria a digitalizacao e incharia o arquivo, o
 * que e o oposto do que se quer antes de protocolar.
 */

import { mensagemDaPonte } from "@/ui/mensagens";
import { DPI_PADRAO, MAX_PAGINAS_OCR } from "@/lib/ferramentas/tesseract";
import { el, icone, repor } from "@/ui/dom";
import { criarFerramenta } from "@/ui/ferramenta";
import { criarProgresso } from "@/ui/componentes/progresso";
import { criarRegiaoAnuncio, criarZonaDeArquivos } from "@/ui/componentes/zonaDeArquivos";
import { criarPainelResultado } from "@/ui/componentes/painelResultado";
import { ponte } from "@/ui/contexto";
import type { FerramentaMontada } from "@/ui/moldura";
import type { ResultadoOcr } from "@/lib/ferramentas/ocr";

export function montar(): FerramentaMontada {
  const f = criarFerramenta();
  const anuncio = criarRegiaoAnuncio();
  let processando = false;
  let cancelado = false;
  let enviando = false;
  let mensagemEnvio: string | null = null;
  let ultimo: { resultado: ResultadoOcr } | null = null;

  const erro = el("p", { class: "fpdf-erro", role: "alert", hidden: true });
  const relatorio = el("div", { class: "fpdf-relatorio", hidden: true });
  const progresso = criarProgresso(() => {
    cancelado = true;
    anuncio.anunciar("Cancelando...");
  });

  const zona = criarZonaDeArquivos({
    titulo: "Solte o PDF digitalizado aqui",
    apoio: "ou escolha o arquivo do seu computador",
    rotuloBotao: "Escolher PDF",
    ajuda: `Um documento por vez, até ${MAX_PAGINAS_OCR} páginas. O reconhecimento roda nesta máquina: o modelo de português já vem com a extensão e nada é enviado para fora.`,
    multiplo: false,
    aoEscolher: async (arquivos) => {
      limpar();
      await f.adicionar(arquivos.slice(0, 1));
    },
  });

  const resultado = criarPainelResultado({
    aoBaixar: () => void baixar(),
    aoEnviarAoSei: () => void enviarAoSei(),
    aoRecomecar: () => {
      limpar();
      f.limparTudo();
    },
  });

  const pularComTexto = el("input", { type: "checkbox", id: "ocr-pular", checked: true });
  const qualidade = el(
    "select",
    { class: "fpdf-campo", id: "ocr-dpi" },
    el("option", { value: String(DPI_PADRAO), selected: true }, "200 dpi (recomendado)"),
    el("option", { value: "300" }, "300 dpi (mais lento)"),
  ) as HTMLSelectElement;

  const botao = el(
    "button",
    {
      type: "button",
      class: "fpdf-botao fpdf-botao--primario fpdf-botao--grande",
      disabled: true,
      onclick: () => void reconhecer(),
    },
    "Tornar pesquisável",
  );

  const raiz = el(
    "section",
    { class: "fpdf-ferramenta" },
    el(
      "header",
      { class: "fpdf-ferramenta__cabecalho" },
      el("h2", {}, "OCR: PDF pesquisável"),
      el(
        "p",
        { class: "fpdf-ferramenta__descricao" },
        "Torne pesquisável um PDF digitalizado, sem enviar o arquivo a servidor nenhum.",
      ),
    ),
    anuncio.raiz,
    zona.raiz,
    el(
      "div",
      { class: "fpdf-opcoes" },
      el(
        "div",
        { class: "fpdf-opcoes__linha" },
        el(
          "div",
          { class: "fpdf-opcoes__caixa" },
          pularComTexto,
          el("label", { for: "ocr-pular" }, "Pular páginas que já tem texto"),
        ),
      ),
      el(
        "div",
        { class: "fpdf-opcoes__linha" },
        el("label", { for: "ocr-dpi" }, "Qualidade da leitura"),
        qualidade,
      ),
    ),
    el("div", { class: "fpdf-ferramenta__acoes" }, botao),
    progresso.raiz,
    erro,
    relatorio,
    resultado.raiz,
  );

  function limpar() {
    ultimo = null;
    mensagemEnvio = null;
    relatorio.hidden = true;
    erro.hidden = true;
  }

  async function reconhecer() {
    const item = f.estado.itens[0];
    if (!item || item.erro) return;

    const { ocrDisponivel } = await import("@/lib/ferramentas/ocr");
    if (!ocrDisponivel()) {
      repor(
        erro,
        "Este navegador não tem os recursos necessários para o reconhecimento de texto. Atualize o navegador e tente de novo.",
      );
      erro.hidden = false;
      return;
    }

    limpar();
    processando = true;
    cancelado = false;
    sincronizar();

    try {
      const { ocrPdf } = await import("@/lib/ferramentas/ocr");
      const r = await ocrPdf(item, {
        dpi: Number(qualidade.value) || DPI_PADRAO,
        pularPaginasComTexto: pularComTexto.checked,
        cancelado: () => cancelado,
        aoProgredir: (feito, total) => {
          f.estado.progresso = { feito, total };
          sincronizar();
        },
      });
      ultimo = { resultado: r };
      mostrarRelatorio(r);
      anuncio.anunciar(
        r.semTexto
          ? "Nenhum texto reconhecido."
          : `${r.palavrasReconhecidas} palavras reconhecidas em ${r.paginasProcessadas} páginas.`,
      );
    } catch (e) {
      const { ErroFerramenta, mensagemDeErro } = await import("@/lib/ferramentas/erros");
      const { OperacaoCancelada } = await import("@/lib/ferramentas/juntar");
      if (e instanceof OperacaoCancelada) {
        anuncio.anunciar("Reconhecimento cancelado.");
      } else {
        const codigo = e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA";
        repor(erro, mensagemDeErro(codigo as never, { nome: item.nome }));
        erro.hidden = false;
      }
    } finally {
      processando = false;
      sincronizar();
    }
  }

  function mostrarRelatorio(r: ResultadoOcr) {
    relatorio.hidden = false;
    const linhas: string[] = [];
    if (r.semTexto) {
      linhas.push(
        "Nenhum texto foi reconhecido. Isso costuma acontecer com digitalização de baixa resolução, documento manuscrito ou página muito inclinada. O arquivo devolvido continua válido, apenas sem camada de texto.",
      );
    } else {
      linhas.push(
        `${r.palavrasReconhecidas} palavras reconhecidas em ${r.paginasProcessadas} ${r.paginasProcessadas === 1 ? "página" : "páginas"}.`,
      );
    }
    if (r.paginasPuladas > 0) {
      linhas.push(
        `${r.paginasPuladas} ${r.paginasPuladas === 1 ? "página já tinha" : "páginas já tinham"} texto e ${r.paginasPuladas === 1 ? "foi preservada" : "foram preservadas"} como estavam.`,
      );
    }
    linhas.push(
      "A imagem original foi preservada: o texto entra como camada invisível por cima, então o documento continua com a mesma aparência.",
    );
    repor(relatorio, ...linhas.map((t) => el("p", {}, t)));
  }

  async function baixar() {
    if (!ultimo) return;
    const { baixarPdf } = await import("@/lib/ferramentas/baixar");
    baixarPdf(ultimo.resultado.bytes, ultimo.resultado.nomeArquivo);
  }

  async function enviarAoSei() {
    if (!ultimo) return;
    enviando = true;
    sincronizar();
    try {
      await ponte().enviarAoProcesso({
        nome: ultimo.resultado.nomeArquivo,
        bytes: ultimo.resultado.bytes,
      });
      mensagemEnvio = "Documento enviado ao processo.";
    } catch (e) {
      // O erro carrega o codigo do que aconteceu, e a mensagem certa vem
      // dele. A versao anterior descartava o erro e dizia sempre "nao foi
      // possivel enviar": diante de sessao expirada, o usuario relogava as
      // cegas -- ou nem isso, porque nao sabia que era esse o problema.
      mensagemEnvio = `${mensagemDaPonte(e)} O reconhecimento não se perdeu: use Baixar.`;
    } finally {
      enviando = false;
      sincronizar();
    }
  }

  function sincronizar() {
    const e = f.estado;
    const pronto = e.itens.length === 1 && !e.itens[0]?.erro;
    zona.sincronizar({ desabilitado: processando });
    progresso.sincronizar({ processando, ...e.progresso });
    botao.disabled = processando || !pronto;
    repor(
      botao,
      icone(processando ? "fas fa-spinner fa-spin" : "fas fa-search"),
      processando ? " Reconhecendo..." : " Tornar pesquisável",
    );
    pularComTexto.disabled = processando;
    qualidade.disabled = processando;

    resultado.sincronizar({
      saidas: ultimo
        ? [{ nome: ultimo.resultado.nomeArquivo, bytes: ultimo.resultado.bytes }]
        : null,
      bytes: ultimo?.resultado.bytes.byteLength ?? 0,
      podeEnviarAoSei: ponte().disponivel(),
      enviando,
      mensagemEnvio,
    });
    anuncio.anunciar(e.anuncio);
  }

  const cancelarAssinatura = f.assinar(sincronizar);

  return {
    raiz,
    destruir() {
      cancelado = true;
      cancelarAssinatura();
      progresso.destruir();
      void f.destruir();
    },
  };
}
