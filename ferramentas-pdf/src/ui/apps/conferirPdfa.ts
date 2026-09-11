/**
 * Conferir PDF/A.
 *
 * NAO USA A MOLDURA porque nao transforma nada: le o documento e explica o que
 * encontrou. Nao ha botao de baixar, nem de enviar ao processo.
 *
 * E DE PROPOSITO QUE NAO EXISTE "CONVERTER PARA PDF/A". Converter de verdade
 * exigiria Ghostscript ou mupdf, que sao AGPL, e um conversor pela metade e
 * pior que nenhum: entregaria um arquivo que parece PDF/A, passa no olho do
 * usuario e e recusado pelo orgao depois do prazo.
 *
 * Pela mesma razao o resultado NUNCA diz "este arquivo e PDF/A". As checagens
 * sao necessarias, nao suficientes: dizem o que foi conferido e o que falta.
 */

import type { DiagnosticoPdfA, SituacaoVerificacao } from "@/lib/ferramentas/pdfa";
import { el, icone, repor } from "@/ui/dom";
import { criarFerramenta } from "@/ui/ferramenta";
import { criarRegiaoAnuncio, criarZonaDeArquivos } from "@/ui/componentes/zonaDeArquivos";
import type { FerramentaMontada } from "@/ui/moldura";

const APARENCIA: Record<SituacaoVerificacao, { icone: string; classe: string; rotulo: string }> = {
  ok: { icone: "fas fa-check-circle", classe: "ok", rotulo: "Conferido" },
  falha: { icone: "fas fa-times-circle", classe: "falha", rotulo: "Impede" },
  atencao: { icone: "fas fa-exclamation-triangle", classe: "atencao", rotulo: "Atenção" },
  indeterminado: { icone: "fas fa-question-circle", classe: "indeterminado", rotulo: "Não verificável" },
};

export function montar(): FerramentaMontada {
  const f = criarFerramenta();
  const anuncio = criarRegiaoAnuncio();
  let analisando = false;

  const saida = el("div", { class: "fpdf-pdfa", hidden: true });
  const erro = el("p", { class: "fpdf-erro", role: "alert", hidden: true });

  const zona = criarZonaDeArquivos({
    titulo: "Solte o PDF aqui",
    apoio: "ou escolha o arquivo do seu computador",
    rotuloBotao: "Escolher PDF",
    ajuda: "Um documento por vez. Nada é alterado: esta ferramenta só lê e explica.",
    multiplo: false,
    aoEscolher: async (arquivos) => {
      f.limparTudo();
      await f.adicionar(arquivos.slice(0, 1));
      await conferir();
    },
  });

  const raiz = el(
    "section",
    { class: "fpdf-ferramenta" },
    el(
      "header",
      { class: "fpdf-ferramenta__cabecalho" },
      el("h2", {}, "Conferir PDF/A"),
      el(
        "p",
        { class: "fpdf-ferramenta__descricao" },
        "Descubra por que o seu PDF não é aceito como PDF/A, e o que fazer para corrigir.",
      ),
    ),
    anuncio.raiz,
    zona.raiz,
    erro,
    saida,
  );

  async function conferir() {
    const item = f.estado.itens[0];
    if (!item) return;
    if (item.erro) {
      const { mensagemDeErro } = await import("@/lib/ferramentas/erros");
      repor(erro, mensagemDeErro(item.erro, { nome: item.nome }));
      erro.hidden = false;
      saida.hidden = true;
      return;
    }
    analisando = true;
    erro.hidden = true;
    zona.sincronizar({ desabilitado: true });
    try {
      const { diagnosticarPdfA } = await import("@/lib/ferramentas/pdfa");
      mostrar(await diagnosticarPdfA(item));
    } catch (e) {
      const { ErroFerramenta, mensagemDeErro } = await import("@/lib/ferramentas/erros");
      const codigo = e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA";
      repor(erro, mensagemDeErro(codigo as never, { nome: item.nome }));
      erro.hidden = false;
      saida.hidden = true;
    } finally {
      analisando = false;
      zona.sincronizar({ desabilitado: false });
    }
  }

  function mostrar(d: DiagnosticoPdfA) {
    saida.hidden = false;

    const cabecalho = d.perfilDeclarado
      ? `Este arquivo se declara PDF/A-${d.perfilDeclarado}.`
      : "Este arquivo não se declara PDF/A.";

    const veredito =
      d.falhas === 0
        ? "Nenhum dos pontos conferidos impede o uso como PDF/A."
        : `${d.falhas} ${d.falhas === 1 ? "ponto impede" : "pontos impedem"} o uso como PDF/A.`;

    repor(
      saida,
      el(
        "div",
        { class: "fpdf-pdfa__resumo" },
        el("h3", {}, d.nomeArquivo),
        el("p", {}, cabecalho, " ", veredito),
      ),
      el(
        "ul",
        { class: "fpdf-pdfa__lista" },
        ...d.verificacoes.map((v) => {
          const ap = APARENCIA[v.situacao];
          return el(
            "li",
            { class: `fpdf-pdfa__item fpdf-pdfa__item--${ap.classe}` },
            el(
              "div",
              { class: "fpdf-pdfa__cabecalho" },
              icone(ap.icone),
              el("h4", {}, v.titulo),
              el("span", { class: "fpdf-pdfa__selo" }, ap.rotulo),
            ),
            el("p", { class: "fpdf-pdfa__detalhe" }, v.detalhe),
            v.comoResolver ? el("p", { class: "fpdf-pdfa__resolver" }, v.comoResolver) : null,
          );
        }),
      ),
      // A ressalva nao e rodape decorativo: e o que impede alguem de tratar
      // "nenhuma falha" como certificado de conformidade.
      el(
        "p",
        { class: "fpdf-pdfa__ressalva" },
        "Estas verificações são necessárias, não suficientes: elas apontam os motivos mais comuns de recusa, mas não substituem um validador completo de PDF/A. Esta ferramenta não converte arquivos — converter de verdade exige software que não pode ser distribuído aqui, e um conversor pela metade entregaria um arquivo que só seria recusado depois do prazo.",
      ),
    );
    anuncio.anunciar(`${cabecalho} ${veredito}`);
  }

  const cancelarAssinatura = f.assinar(() => {
    zona.sincronizar({ desabilitado: analisando });
    anuncio.anunciar(f.estado.anuncio);
  });

  return {
    raiz,
    destruir() {
      cancelarAssinatura();
      void f.destruir();
    },
  };
}
