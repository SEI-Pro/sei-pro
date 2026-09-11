/**
 * Area de selecao de arquivos.
 *
 * ACESSIBILIDADE: o alvo clicavel e um `<label>` ligado a um `<input
 * type="file">` visualmente oculto, e nao uma `<div>` com onclick. Isso entrega
 * de graca o foco por teclado, o acionamento por Enter e Espaco e o nome
 * acessivel do campo, sem simular nada com `role` e `tabindex`. Arrastar e
 * soltar e um atalho por cima disso, nunca o unico caminho.
 *
 * Escrito sem dependencia nova de proposito: a extensao ate embarca uma
 * biblioteca de dropzone, mas carrega-la aqui so para desenhar uma moldura
 * contraria o argumento de uma página que precisa ser leve.
 */

import { el, icone, repor } from "@/ui/dom";
import { comCarregamento } from "@/ui/carregando";

export interface OpcoesZona {
  /** Extensoes aceitas, no formato do atributo accept. */
  aceita?: string;
  multiplo?: boolean;
  titulo: string;
  apoio: string;
  rotuloBotao: string;
  ajuda: string;
  aoEscolher: (arquivos: File[]) => void;
  /**
   * Trazer documentos do processo aberto no SEI.
   *
   * Devolve uma promessa porque a operação fala com o SEI e pode demorar: o
   * botão fica com indicador de carregamento até ela terminar.
   */
  aoTrazerDoSei?: () => void | Promise<void>;
}

export interface Zona {
  raiz: HTMLElement;
  sincronizar(props: {
    desabilitado?: boolean;
    podeTrazerDoSei?: boolean;
    /**
     * Já há documento em trabalho.
     *
     * A zona encolhe para uma faixa: com o documento aberto, ela deixou de ser
     * o assunto da tela e a altura que ocupava faz falta para o que importa --
     * ver a página. Continua acessível, porque trocar de arquivo é justamente o
     * que se faz depois de olhar o resultado.
     */
    recolhida?: boolean;
  }): void;
}

let contador = 0;

export function criarZonaDeArquivos(opcoes: OpcoesZona): Zona {
  const {
    aceita = "application/pdf,.pdf",
    multiplo = true,
    titulo,
    apoio,
    rotuloBotao,
    ajuda,
    aoEscolher,
    aoTrazerDoSei,
  } = opcoes;

  const idInput = `zona-arquivos-${++contador}`;
  const idAjuda = `${idInput}-ajuda`;

  const input = el("input", {
    type: "file",
    id: idInput,
    class: "sr-only",
    accept: aceita,
    multiple: multiplo,
    "aria-describedby": idAjuda,
    onchange: (ev: Event) => {
      const alvo = ev.target as HTMLInputElement;
      const arquivos = Array.from(alvo.files ?? []);
      if (arquivos.length) aoEscolher(arquivos);
      // Zera para que escolher O MESMO arquivo de novo dispare `change`.
      alvo.value = "";
    },
  });

  const botaoSei = aoTrazerDoSei
    ? el(
        "button",
        {
          type: "button",
          class: "fpdf-botao fpdf-botao--secundario",
          hidden: true,
          onclick: () => {
            // Ler a árvore de um processo grande leva alguns segundos. Sem o
            // indicador, a espera parece um clique que não funcionou.
            void comCarregamento(botaoSei, async () => {
              await aoTrazerDoSei();
            });
          },
        },
        icone("fas fa-sitemap"),
        " Trazer do processo aberto",
      )
    : null;

  const label = el(
    "label",
    { class: "fpdf-zona__alvo", for: idInput },
    el("span", { class: "fpdf-zona__icone" }, icone("fas fa-file-upload")),
    el("span", { class: "fpdf-zona__titulo" }, titulo),
    el("span", { class: "fpdf-zona__apoio" }, apoio),
    el("span", { class: "fpdf-botao fpdf-botao--primario fpdf-zona__botao" }, rotuloBotao),
  );

  const raiz = el(
    "div",
    { class: "fpdf-zona" },
    input,
    label,
    el("p", { class: "fpdf-zona__ajuda", id: idAjuda }, ajuda),
    botaoSei,
  );

  // Contador de entrada e saida: `dragleave` dispara ao passar sobre qualquer
  // filho, e um booleano simples faria a moldura piscar durante o arrasto.
  let profundidade = 0;
  const marcar = (ativo: boolean) => raiz.classList.toggle("fpdf-zona--arrastando", ativo);

  raiz.addEventListener("dragenter", (ev) => {
    ev.preventDefault();
    profundidade += 1;
    marcar(true);
  });
  raiz.addEventListener("dragover", (ev) => ev.preventDefault());
  raiz.addEventListener("dragleave", () => {
    profundidade = Math.max(0, profundidade - 1);
    if (profundidade === 0) marcar(false);
  });
  raiz.addEventListener("drop", (ev) => {
    ev.preventDefault();
    profundidade = 0;
    marcar(false);
    if (raiz.classList.contains("fpdf-zona--desabilitada")) return;
    const arquivos = Array.from(ev.dataTransfer?.files ?? []);
    if (arquivos.length) aoEscolher(arquivos);
  });

  return {
    raiz,
    sincronizar({ desabilitado = false, podeTrazerDoSei = false, recolhida = false }) {
      input.disabled = desabilitado;
      raiz.classList.toggle("fpdf-zona--desabilitada", desabilitado);
      raiz.classList.toggle("fpdf-zona--recolhida", recolhida);
      // Ausência ESCONDE o controle, não o desabilita: botão cinza sem
      // explicação é pior que botão inexistente.
      if (botaoSei) botaoSei.hidden = !podeTrazerDoSei;
    },
  };
}

/** Regiao que anuncia mudancas a leitor de tela. */
export function criarRegiaoAnuncio(): { raiz: HTMLElement; anunciar(t: string): void } {
  const raiz = el("div", {
    class: "sr-only",
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true",
  });
  let ultimo = "";
  return {
    raiz,
    anunciar(texto: string) {
      if (texto === ultimo) return;
      ultimo = texto;
      repor(raiz, texto);
    },
  };
}
