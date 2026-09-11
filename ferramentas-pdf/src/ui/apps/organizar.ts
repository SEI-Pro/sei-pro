/**
 * Organizar PDF: reordenar, girar e remover paginas.
 *
 * Nao usa a moldura comum porque o objeto manipulado nao e "a lista de
 * arquivos", e sim "as páginas de um arquivo" -- com miniatura, giro e
 * remocao individuais.
 *
 * MEMORIA: cada miniatura e um object URL. Sem revogar, um documento de 300
 * paginas deixa 300 bitmaps presos mesmo depois de trocar de ferramenta. O
 * `destruir()` revoga todos.
 */

import { mensagemDaPonte } from "@/ui/mensagens";
import { el, icone, repor } from "@/ui/dom";
import { criarFerramenta } from "@/ui/ferramenta";
import { criarProgresso } from "@/ui/componentes/progresso";
import { criarRegiaoAnuncio, criarZonaDeArquivos } from "@/ui/componentes/zonaDeArquivos";
import { criarPainelResultado } from "@/ui/componentes/painelResultado";
import { ponte } from "@/ui/contexto";
import type { FerramentaMontada } from "@/ui/moldura";

interface Pagina {
  /** Indice ORIGINAL da página, base 1. E o que o nucleo espera em `ordem`. */
  original: number;
  giro: number;
  removida: boolean;
  miniatura?: string;
}

/** Largura da miniatura. Suficiente para reconhecer a página, barato de gerar. */
const LARGURA_MINIATURA = 150;

export function montar(): FerramentaMontada {
  const f = criarFerramenta();
  const anuncio = criarRegiaoAnuncio();
  let paginas: Pagina[] = [];
  const urls: string[] = [];
  let carregando = false;
  let enviando = false;
  let mensagemEnvio: string | null = null;

  const grade = el("div", { class: "fpdf-paginas", hidden: true });
  const progresso = criarProgresso(() => f.cancelar());
  const erro = el("p", { class: "fpdf-erro", role: "alert", hidden: true });

  const zona = criarZonaDeArquivos({
    titulo: "Solte o PDF aqui",
    apoio: "ou escolha o arquivo do seu computador",
    rotuloBotao: "Escolher PDF",
    ajuda: "Um documento por vez. Você verá as páginas para reordenar, girar ou remover.",
    multiplo: false,
    aoEscolher: async (arquivos) => {
      await f.limparTudo();
      await f.adicionar(arquivos.slice(0, 1));
      await gerarMiniaturas();
    },
  });

  const resultado = criarPainelResultado({
    aoBaixar: () => void f.baixar("paginas-organizadas"),
    aoEnviarAoSei: () => void enviarAoSei(),
    aoRecomecar: () => {
      limparPaginas();
      f.limparTudo();
    },
  });

  const botaoAplicar = el(
    "button",
    {
      type: "button",
      class: "fpdf-botao fpdf-botao--primario fpdf-botao--grande",
      onclick: () => void aplicar(),
    },
    "Aplicar alterações",
  );

  const raiz = el(
    "section",
    { class: "fpdf-ferramenta" },
    el(
      "header",
      { class: "fpdf-ferramenta__cabecalho" },
      el("h2", {}, "Organizar PDF"),
      el(
        "p",
        { class: "fpdf-ferramenta__descricao" },
        "Reordene, gire e remova páginas antes de protocolar.",
      ),
    ),
    anuncio.raiz,
    zona.raiz,
    grade,
    el("div", { class: "fpdf-ferramenta__acoes" }, botaoAplicar),
    progresso.raiz,
    erro,
    resultado.raiz,
  );

  async function gerarMiniaturas() {
    const item = f.estado.itens[0];
    if (!item || item.erro) return;
    carregando = true;
    sincronizar();
    try {
      const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
      const pdfjs = await carregarPdfJs();
      // Copia: o pdf.js DESTACA o buffer, e os bytes originais ainda serao
      // usados pelo pdf-lib na hora de aplicar as alteracoes.
      const tarefa = pdfjs.getDocument(
        opcoesDocumento(new Uint8Array(item.bytes), item.senha),
      );
      const doc = await tarefa.promise;

      paginas = [];
      for (let n = 1; n <= doc.numPages; n += 1) {
        const página = await doc.getPage(n);
        const escala = LARGURA_MINIATURA / página.getViewport({ scale: 1 }).width;
        const viewport = página.getViewport({ scale: escala });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) break;
        await página.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.7));
        // Libera o bitmap: so remover o no deixa a memoria presa no Chrome.
        canvas.width = 0;
        canvas.height = 0;
        página.cleanup();
        const url = blob ? URL.createObjectURL(blob) : undefined;
        if (url) urls.push(url);
        paginas.push({ original: n, giro: 0, removida: false, miniatura: url });
      }
      await tarefa.destroy();
      anuncio.anunciar(`${paginas.length} páginas carregadas.`);
    } catch {
      repor(erro, "Não foi possível ler as páginas deste documento.");
      erro.hidden = false;
    } finally {
      carregando = false;
      sincronizar();
    }
  }

  function limparPaginas() {
    for (const url of urls.splice(0)) URL.revokeObjectURL(url);
    paginas = [];
    mensagemEnvio = null;
  }

  async function aplicar() {
    const ativas = paginas.filter((p) => !p.removida);
    if (ativas.length === 0) {
      repor(erro, "Não sobrou nenhuma página: o documento ficaria vazio.");
      erro.hidden = false;
      return;
    }
    mensagemEnvio = null;
    const rotacoes: Record<number, number> = {};
    ativas.forEach((p, i) => {
      if (p.giro % 360 !== 0) rotacoes[i + 1] = ((p.giro % 360) + 360) % 360;
    });
    await f.processar("organizar", {
      ordem: ativas.map((p) => p.original),
      rotacoes: Object.keys(rotacoes).length ? rotacoes : undefined,
    });
  }

  async function enviarAoSei() {
    const saidas = f.estado.resultado?.saidas;
    if (!saidas?.length) return;
    enviando = true;
    sincronizar();
    try {
      for (const s of saidas) await ponte().enviarAoProcesso({ nome: s.nome, bytes: s.bytes });
      mensagemEnvio = "Documento enviado ao processo.";
    } catch (e) {
      // O erro carrega o codigo do que aconteceu, e a mensagem certa vem
      // dele. A versao anterior descartava o erro e dizia sempre "nao foi
      // possivel enviar": diante de sessao expirada, o usuario relogava as
      // cegas -- ou nem isso, porque nao sabia que era esse o problema.
      mensagemEnvio = mensagemDaPonte(e);
    } finally {
      enviando = false;
      sincronizar();
    }
  }

  function cartaoDaPagina(p: Pagina, indice: number) {
    const total = paginas.length;
    const img = p.miniatura
      ? el("img", {
          class: "fpdf-pagina__imagem",
          src: p.miniatura,
          alt: `Página ${p.original}`,
          estilo: { transform: `rotate(${p.giro}deg)` },
        })
      : el("div", { class: "fpdf-pagina__vazia" });

    function acao(titulo: string, classe: string, aoClicar: () => void, desabilitado = false) {
      return el(
        "button",
        {
          type: "button",
          class: "fpdf-pagina__acao",
          title: titulo,
          "aria-label": `${titulo}, página ${p.original}`,
          disabled: desabilitado || f.estado.processando,
          dataset: { acao: classe, pagina: String(p.original) },
          onclick: aoClicar,
        },
        icone(classe),
      );
    }

    return el(
      "figure",
      {
        class: `fpdf-pagina${p.removida ? " fpdf-pagina--removida" : ""}`,
        dataset: { pagina: String(p.original) },
      },
      img,
      el(
        "figcaption",
        { class: "fpdf-pagina__rodape" },
        el("span", {}, `${indice + 1}`),
        p.removida ? el("span", { class: "fpdf-pagina__marca" }, "removida") : null,
      ),
      el(
        "div",
        { class: "fpdf-pagina__acoes" },
        acao("Mover para a esquerda", "fas fa-arrow-left", () => mover(indice, indice - 1), indice === 0),
        acao("Girar", "fas fa-redo", () => {
          p.giro += 90;
          anuncio.anunciar(`Página ${p.original} girada.`);
          sincronizar();
        }),
        acao(p.removida ? "Restaurar" : "Remover", p.removida ? "fas fa-undo" : "fas fa-trash-alt", () => {
          p.removida = !p.removida;
          anuncio.anunciar(`Página ${p.original} ${p.removida ? "removida" : "restaurada"}.`);
          sincronizar();
        }),
        acao("Mover para a direita", "fas fa-arrow-right", () => mover(indice, indice + 1), indice === total - 1),
      ),
    );
  }

  function mover(de: number, para: number) {
    if (para < 0 || para >= paginas.length) return;
    const copia = [...paginas];
    const [p] = copia.splice(de, 1);
    copia.splice(para, 0, p);
    paginas = copia;
    anuncio.anunciar(`Página ${p.original} movida para a posição ${para + 1} de ${copia.length}.`);
    sincronizar();
  }

  function sincronizar() {
    const e = f.estado;
    zona.sincronizar({ desabilitado: e.processando || carregando });
    progresso.sincronizar({ processando: e.processando, ...e.progresso });

    grade.hidden = paginas.length === 0;
    if (paginas.length) {
      // Preserva o foco: recriar os cartoes joga o foco no <body> e a
      // navegacao por teclado para de funcionar depois do primeiro clique.
      const ativo = document.activeElement as HTMLElement | null;
      const focoAcao = ativo?.dataset?.acao;
      const focoPagina = ativo?.dataset?.pagina;

      repor(grade, ...paginas.map((p, i) => cartaoDaPagina(p, i)));

      if (focoAcao && focoPagina) {
        grade
          .querySelector<HTMLElement>(`[data-acao="${focoAcao}"][data-pagina="${focoPagina}"]`)
          ?.focus();
      }
    }

    const ativas = paginas.filter((p) => !p.removida).length;
    botaoAplicar.disabled = e.processando || carregando || ativas === 0;
    repor(
      botaoAplicar,
      carregando ? "Lendo páginas..." : `Aplicar alterações (${ativas} de ${paginas.length})`,
    );

    if (!e.resultado) mensagemEnvio = mensagemEnvio ?? null;
    erro.hidden = !e.erroGeral;
    if (e.erroGeral) repor(erro, e.erroGeral);

    resultado.sincronizar({
      saidas: e.resultado?.saidas ?? null,
      bytes: e.resultado?.bytes ?? 0,
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
      cancelarAssinatura();
      progresso.destruir();
      limparPaginas();
      void f.destruir();
    },
  };
}
