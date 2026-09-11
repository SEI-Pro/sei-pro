/**
 * Uma página no visualizador de tarja: canvas + camada de texto + marcacoes.
 *
 * SEIS COISAS QUE QUEBRAM AQUI, na ordem em que quebram:
 *
 * 1. As variaveis CSS `--scale-factor` e companhia PRECISAM estar no elemento
 *    da página. Sem elas o `setLayerDimensions` do pdf.js escreve uma largura
 *    invalida, a camada de texto nasce com tamanho zero e a selecao nao
 *    funciona -- sem erro no console. Ver o bloco no CSS.
 *
 * 2. Render obsoleto: se o zoom muda no meio de um desenho, o anterior termina
 *    depois e deixa a página na escala errada. Dai cancelar antes de comecar.
 *
 * 3. `canvas.width = canvas.height = 0` ao liberar. So remover o no deixa o
 *    bitmap presos na memoria -- com 300 paginas isso derruba a aba.
 *
 * 4. As marcacoes ficam SEMPRE montadas, mesmo sobre página ainda nao
 *    desenhada. Marcacao que some ao rolar e indistinguivel de marcacao
 *    removida por engano.
 *
 * 5. O retangulo em desenho vive numa variavel e e mutado direto no nó. Se uma
 *    sincronizacao reconstruir as marcacoes no meio do arrasto, o no que tem o
 *    `setPointerCapture` desaparece e o `pointerup` nunca chega: o arrasto nao
 *    vira marcacao, so com mouse rapido, e sem erro nenhum. Dai `congelar()`.
 *
 * 6. Coordenadas em PONTOS DE PDF, nunca em pixels de tela, e posicionamento em
 *    PORCENTAGEM -- que e o mesmo sistema da camada de texto. Assim o zoom nao
 *    desalinha a marcacao do texto que ela cobre.
 */

import type { DimensaoPagina, Marcacao } from "@/lib/ferramentas/tarjar/estado";
import type { Caixa } from "@/lib/ferramentas/tarjar/geometria";
import {
  deFracaoDoViewport,
  paraFracaoDoViewport,
} from "@/lib/ferramentas/tarjar/geometria";
import { el, limpar } from "@/ui/dom";

export interface OpcoesPagina {
  numero: number;
  dimensao: DimensaoPagina;
  escala: number;
  aoAlternarMarcacao(id: string): void;
  aoDesenhar(página: number, caixa: Caixa): void;
  /** Renderiza a página no canvas. Devolve funcao de cancelamento. */
  renderizar(numero: number, canvas: HTMLCanvasElement, escala: number): {
    promessa: Promise<void>;
    cancelar(): void;
  };
  /** Monta a camada de texto do pdf.js sobre a página. */
  montarTexto?(numero: number, camada: HTMLElement, escala: number): Promise<void>;
  /** Chamado quando o desenho falha por motivo que não seja cancelamento. */
  aoFalhar?(erro: unknown): void;
}

export interface PaginaTarjar {
  raiz: HTMLElement;
  numero: number;
  renderizar(): void;
  liberar(): void;
  definirEscala(escala: number): void;
  definirModo(modo: "marcar" | "desenhar"): void;
  sincronizarMarcacoes(marcacoes: Marcacao[], realce: string | null): void;
  destruir(): void;
}

export function criarPaginaTarjar(opcoes: OpcoesPagina): PaginaTarjar {
  const { numero, dimensao, aoAlternarMarcacao, aoDesenhar, renderizar, montarTexto, aoFalhar } =
    opcoes;

  let escala = opcoes.escala;
  let desenhada = false;
  let renderEmCurso: { cancelar(): void } | null = null;
  let congelado = false;
  let marcacoesAtuais: Marcacao[] = [];
  let realceAtual: string | null = null;

  const canvas = el("canvas", { "aria-hidden": "true" });
  const camadaTexto = el("div", { class: "textLayer" });
  const camadaMarcas = el("div", { class: "tarjar-marcas" });

  const raiz = el(
    "div",
    {
      class: "tarjar-pagina",
      dataset: { pagina: String(numero), modo: "marcar" },
    },
    canvas,
    camadaTexto,
    camadaMarcas,
  );

  aplicarDimensao();

  function aplicarDimensao() {
    const largura = dimensao.larguraExibida * escala;
    const altura = dimensao.alturaExibida * escala;
    raiz.style.width = `${largura}px`;
    raiz.style.height = `${altura}px`;
    // Sem esta linha a camada de texto nasce com tamanho zero. Ver o topo.
    raiz.style.setProperty("--scale-factor", String(escala));
  }

  function renderizarAgora() {
    if (desenhada) return;
    // Um render anterior que termine depois deixaria a página na escala errada.
    renderEmCurso?.cancelar();
    const tarefa = renderizar(numero, canvas, escala);
    renderEmCurso = tarefa;
    void tarefa.promessa
      .then(async () => {
        desenhada = true;
        renderEmCurso = null;
        if (montarTexto) {
          limpar(camadaTexto);
          await montarTexto(numero, camadaTexto, escala);
        }
      })
      .catch((e: unknown) => {
        renderEmCurso = null;
        // Cancelamento NÃO é erro: a página saiu da tela ou o zoom mudou, e o
        // pdf.js aborta o desenho de propósito.
        const nome = (e as { name?: string })?.name ?? "";
        if (nome === "RenderingCancelledException" || nome === "AbortException") return;
        // Qualquer outra falha precisa aparecer. Engolir tudo aqui foi o que
        // fez uma página em branco parecer "o pdf.js não rodou", sem pista
        // nenhuma de por quê.
        aoFalhar?.(e);
      });
  }

  function liberar() {
    renderEmCurso?.cancelar();
    renderEmCurso = null;
    desenhada = false;
    // So remover o no deixaria o bitmap preso na memoria.
    canvas.width = 0;
    canvas.height = 0;
    limpar(camadaTexto);
  }

  function sincronizarMarcacoes(marcacoes: Marcacao[], realce: string | null) {
    marcacoesAtuais = marcacoes;
    realceAtual = realce;
    // Reconstruir no meio de um arrasto mataria o `setPointerCapture`.
    if (congelado) return;

    const daPagina = marcacoes.filter((m) => m.pagina === numero);
    const foco = document.activeElement as HTMLElement | null;
    const idFoco = foco?.dataset?.marcacao;

    limpar(camadaMarcas);
    for (const m of daPagina) {
      // Uma caixa por LINHA VISUAL: um CPF quebrado em duas linhas precisa de
      // duas tarjas, e um retangulo unico cobrindo as duas apagaria o texto
      // entre elas.
      m.caixas.forEach((caixa, i) => {
        const f = paraFracaoDoViewport(caixa, dimensao.view, dimensao.giro);
        if (!f) return;
        const botao = el("button", {
          type: "button",
          class: "tarjar-marca",
          "aria-pressed": String(m.ativa),
          "aria-label": `${m.ativa ? "Desligar" : "Ligar"} tarja de ${m.amostra}, página ${numero}`,
          dataset: { marcacao: m.id, realce: String(realce === m.id), parte: String(i) },
          estilo: {
            // Porcentagem, nao pixel: o mesmo sistema da camada de texto, entao
            // o zoom nao desalinha a marca do texto que ela cobre.
            left: `${f.esquerda * 100}%`,
            top: `${f.topo * 100}%`,
            width: `${f.largura * 100}%`,
            height: `${f.altura * 100}%`,
          },
          onclick: () => aoAlternarMarcacao(m.id),
        });
        camadaMarcas.appendChild(botao);
      });
    }

    if (idFoco) {
      camadaMarcas.querySelector<HTMLElement>(`[data-marcacao="${idFoco}"]`)?.focus();
    }
  }

  // ---- desenho de retangulo ----

  let rascunho: HTMLElement | null = null;
  let inicio: { x: number; y: number } | null = null;

  function aoPressionar(ev: PointerEvent) {
    if (raiz.dataset.modo !== "desenhar" || ev.button !== 0) return;
    ev.preventDefault();
    const caixa = raiz.getBoundingClientRect();
    inicio = { x: ev.clientX - caixa.left, y: ev.clientY - caixa.top };
    congelado = true;
    rascunho = el("div", { class: "tarjar-rascunho" });
    raiz.appendChild(rascunho);
    raiz.setPointerCapture(ev.pointerId);
  }

  function aoMover(ev: PointerEvent) {
    if (!inicio || !rascunho) return;
    const caixa = raiz.getBoundingClientRect();
    const x = ev.clientX - caixa.left;
    const y = ev.clientY - caixa.top;
    // Mutacao direta do no, sem passar por estado: e o que torna o arrasto
    // rapido impossivel de perder.
    rascunho.style.left = `${Math.min(inicio.x, x)}px`;
    rascunho.style.top = `${Math.min(inicio.y, y)}px`;
    rascunho.style.width = `${Math.abs(x - inicio.x)}px`;
    rascunho.style.height = `${Math.abs(y - inicio.y)}px`;
  }

  function aoSoltar(ev: PointerEvent) {
    if (!inicio || !rascunho) return;
    const caixa = raiz.getBoundingClientRect();
    const x = ev.clientX - caixa.left;
    const y = ev.clientY - caixa.top;

    const esquerda = Math.min(inicio.x, x);
    const topo = Math.min(inicio.y, y);
    const largura = Math.abs(x - inicio.x);
    const altura = Math.abs(y - inicio.y);

    rascunho.remove();
    rascunho = null;
    inicio = null;
    congelado = false;
    if (raiz.hasPointerCapture(ev.pointerId)) raiz.releasePointerCapture(ev.pointerId);

    // Clique sem arrasto nao vira tarja de tamanho zero.
    if (largura > 4 && altura > 4) {
      const total = raiz.getBoundingClientRect();
      // O caminho de volta ate o espaco do usuario e do nucleo: refazer a
      // matriz aqui erraria o sinal de Y em página girada.
      const caixaPdf = deFracaoDoViewport(
        {
          esquerda: esquerda / total.width,
          topo: topo / total.height,
          largura: largura / total.width,
          altura: altura / total.height,
        },
        dimensao.view,
        dimensao.giro,
      );
      if (caixaPdf) aoDesenhar(numero, caixaPdf);
    }
    sincronizarMarcacoes(marcacoesAtuais, realceAtual);
  }

  raiz.addEventListener("pointerdown", aoPressionar);
  raiz.addEventListener("pointermove", aoMover);
  raiz.addEventListener("pointerup", aoSoltar);
  raiz.addEventListener("pointercancel", aoSoltar);

  return {
    raiz,
    numero,
    renderizar: renderizarAgora,
    liberar,
    definirEscala(nova: number) {
      if (nova === escala) return;
      escala = nova;
      aplicarDimensao();
      // Forca novo desenho na escala nova.
      liberar();
      sincronizarMarcacoes(marcacoesAtuais, realceAtual);
    },
    definirModo(modo) {
      raiz.dataset.modo = modo;
    },
    sincronizarMarcacoes,
    destruir() {
      liberar();
      raiz.removeEventListener("pointerdown", aoPressionar);
      raiz.removeEventListener("pointermove", aoMover);
      raiz.removeEventListener("pointerup", aoSoltar);
      raiz.removeEventListener("pointercancel", aoSoltar);
    },
  };
}
