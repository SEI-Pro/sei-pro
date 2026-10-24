/**
 * Editor da anotação NO LUGAR (sem modal): o post-it do painel vira área de texto, com a mesma pele do cartão. Como no legado
 * (`sticknoteEdit` / `sticknoteSave_` / `sticknoteCancel` em `sei-pro-arvore.js`):
 *  - sair do campo (clicar noutro lugar da página) GRAVA o que mudou, e o botão Salvar faz o mesmo na hora;
 *  - descartar volta ao cartão; o limite é o do SEI (500 caracteres, `definirAnotacao`), com contador;
 *  - prioridade, checklist (alterna `[ ]` nas linhas selecionadas) e data ficam numa barra própria, em linha à parte.
 * Diferenças deliberadas em relação ao legado: sair da JANELA (trocar de aba) não grava; texto vazio nunca grava sozinho (apagar
 * a anotação pede confirmação); Enter dentro da checklist abre o próximo item e Alt+setas reordenam as linhas.
 *
 * Quem remonta o painel a cada mudança de fatia NÃO pode derrubar este editor: o painel devolve sempre o MESMO elemento (a
 * casca não o recoloca, ver `sincronizarFilhos`) e avisa as mudanças por `fatiaMudou`, que só mostra um aviso.
 */
import { h } from "@comum/ui/dom";
import type { AnotacaoProcesso } from "@nucleo/dominio/painelProcesso";
import {
  alternarChecklist,
  continuarChecklist,
  dataIsoDaAnotacao,
  definirDataNaAnotacao,
  LIMITE_ANOTACAO,
  linhaDaPosicao,
  moverLinhas,
  posicaoDaLinha,
} from "../../modelo/texto";
import { glifo } from "../../ui/glifos";
import { mensagemDeErro } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { confirmar } from "../modais/comum";

export type Encerramento = { gravou: false } | { gravou: true; valor: AnotacaoProcesso | null };

export interface AmbienteEditor {
  /**
   * O foco do SEI está agora em OUTRO quadro da mesma janela (o visualizador do documento, por exemplo)? É o que diferencia
   * "cliquei em outra parte do SEI" (grava, como no legado) de "troquei de aba ou de programa" ou de uma captura de tela (não grava).
   */
  focoEmOutroQuadro(): boolean;
  /** O elemento que tem o foco agora. */
  ativo(): Element | null;
}

export interface OpcoesEditor {
  inicial: AnotacaoProcesso | null;
  aoEncerrar(r: Encerramento): void;
  confirmar?(texto: string, rotulo: string): Promise<boolean>;
  ambiente?: AmbienteEditor;
  /** Espera depois de o foco sair, para o clique em outro botão do editor ser visto antes (padrão 150 ms). */
  esperaSaidaMs?: number;
}

export interface EditorAnotacao {
  el: HTMLElement;
  /** O texto que está no campo (sem mexer em nada). */
  texto(): string;
  prioridade(): boolean;
  /** Mudou alguma coisa em relação ao que o SEI tinha quando a edição começou? */
  sujo(): boolean;
  /** A fatia da anotação mudou enquanto se editava: só mostra o aviso, sem tocar no texto nem no foco. */
  fatiaMudou(atual: AnotacaoProcesso | null): void;
  focar(): void;
  /** O foco saiu do editor (o ouvinte de `focusout` chama isto; os testes também). */
  saiuDoFoco(): void;
  salvar(): Promise<void>;
  descartar(): Promise<void>;
  /** Solta os temporizadores; chamado ao encerrar. */
  destruir(): void;
}

const normalizar = (t: string): string => t.replace(/\r\n?/g, "\n").trim();
const igual = (a: AnotacaoProcesso | null, b: AnotacaoProcesso | null): boolean =>
  (a === null || normalizar(a.texto) === "") && (b === null || normalizar(b.texto) === "")
    ? true
    : a !== null && b !== null && normalizar(a.texto) === normalizar(b.texto) && a.prioridade === b.prioridade;

export function criarEditorAnotacao(ctx: Pick<ContextoProcesso, "doc" | "topo" | "op">, o: OpcoesEditor): EditorAnotacao {
  const doc = ctx.doc;
  const perguntar = o.confirmar ?? ((texto, rotulo) => confirmar(ctx, texto, rotulo));
  const ambiente: AmbienteEditor = o.ambiente ?? {
    focoEmOutroQuadro: () => {
      const ativo = ctx.topo.activeElement;
      const meu = doc.defaultView?.frameElement ?? null;
      // Só vale um quadro que o usuário VÊ: o SEI Pro guarda quadros ocultos (o verificador de dados) que as capturas de tela e
      // alguns scripts focam sem gesto nenhum.
      return !!ativo && ativo.tagName === "IFRAME" && ativo !== meu && ativo.getClientRects().length > 0;
    },
    ativo: () => doc.activeElement,
  };

  /** O que o SEI tem (a verdade de partida); muda quando gravamos ou quando o usuário pede a versão do SEI. */
  let origem: AnotacaoProcesso | null = o.inicial && normalizar(o.inicial.texto) ? o.inicial : null;
  let prioritaria = origem?.prioridade ?? false;
  let estado: "editando" | "salvando" | "erro" = "editando";
  let confirmando = false;
  /** Há um clique em andamento dentro do editor (em navegadores em que o botão não toma o foco ao ser clicado). */
  let pressionando = false;
  /**
   * Só um gesto do usuário vale como "sair do campo": clique fora do editor neste quadro, Tab, ou o foco ir para OUTRO quadro do
   * SEI. O foco que some sem gesto (diálogo, captura de tela, script da página) nunca grava sozinho.
   */
  let gestoFora = 0;
  let janelaPerdeuFocoEm = 0;
  const recente = (t: number): boolean => Date.now() - t < 1500;
  let encerrado = false;
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  let divergente: AnotacaoProcesso | null | undefined;

  const campo = h("textarea", {
    class: "spro-p-post-it-texto",
    rows: "4",
    maxlength: String(LIMITE_ANOTACAO),
    "aria-label": "Anotação",
    placeholder: "Escreva a anotação",
  });
  campo.value = origem?.texto ?? "";

  const contador = h("span", { class: "spro-p-contador" });
  const situacao = h("span", { class: "spro-p-post-it-situacao", role: "status", "aria-live": "polite" });
  const erroTexto = h("span", { class: "spro-p-post-it-aviso-texto" });
  const tentar = h("button", { type: "button", class: "spro-p-link spro-p-post-it-tentar" }, "Tentar de novo");
  const erro = h("div", { class: "spro-p-post-it-aviso erro", role: "alert", hidden: true }, erroTexto, tentar);
  const usarSei = h("button", { type: "button", class: "spro-p-link spro-p-post-it-tentar" }, "Usar a versão do SEI");
  const avisoSei = h(
    "div",
    { class: "spro-p-post-it-aviso desatualizado", role: "status", hidden: true },
    h(
      "span",
      { class: "spro-p-post-it-aviso-texto" },
      "Esta anotação mudou no SEI enquanto você editava. Se salvar, a sua versão substitui a do SEI.",
    ),
    usarSei,
  );

  const botao = (rotulo: string, icone: Parameters<typeof glifo>[0], texto: string | null, classe = ""): HTMLButtonElement =>
    h(
      "button",
      { type: "button", class: `spro-p-post-it-botao${texto ? "" : " so-icone"}${classe ? ` ${classe}` : ""}`, "aria-label": rotulo },
      glifo(icone, 16),
      texto ? h("span", { class: "spro-p-post-it-botao-texto" }, texto) : null,
    );
  const bSalvar = botao("Salvar anotação", "disquete", "Salvar", "primario");
  const bPrioridade = botao("Prioridade", "alerta", "Prioridade", "prioridade");
  bPrioridade.setAttribute("aria-pressed", String(prioritaria));
  const bChecklist = botao("Transformar as linhas selecionadas em checklist", "checkQuadro", "Checklist");
  const bSobe = botao("Subir as linhas selecionadas", "cima", null);
  const bDesce = botao("Descer as linhas selecionadas", "baixo", null);
  const data = h("input", { type: "date", class: "spro-p-post-it-data", "aria-label": "Data para inserir na anotação" });
  data.value = dataIsoDaAnotacao(campo.value) ?? "";
  const bRemover = botao("Remover anotação", "lixeira", null, "perigo");
  const bDescartar = botao("Descartar alterações (Esc)", "fechar", null);

  const barra = h(
    "div",
    { class: "spro-p-post-it-barra", role: "toolbar", "aria-label": "Ferramentas da anotação" },
    bSalvar,
    bPrioridade,
    bChecklist,
    bSobe,
    bDesce,
    h("span", { class: "spro-p-post-it-data-rotulo" }, glifo("calendarioMais", 16), data),
    h("span", { class: "spro-p-post-it-espaco" }),
    origem ? bRemover : null,
    bDescartar,
  );

  const el = h(
    "div",
    { class: "spro-p-post-it spro-p-post-it-edicao", "data-estado": "editando" },
    campo,
    h("div", { class: "spro-p-post-it-rodape" }, contador, situacao),
    avisoSei,
    erro,
    barra,
  );

  // ---------------------------------------------------------------------------------------------------------- estado
  const sujo = (): boolean => {
    const agora = normalizar(campo.value);
    if (agora !== normalizar(origem?.texto ?? "")) return true;
    return agora === "" ? false : prioritaria !== (origem?.prioridade ?? false);
  };

  const desenharContador = () => {
    const resta = LIMITE_ANOTACAO - campo.value.length;
    contador.textContent = resta <= 0 ? "Você atingiu o número máximo de caracteres." : `${resta} caracteres restantes`;
  };

  const ajustarAltura = () => {
    // `field-sizing: content` (CSS) faz isto sozinho onde existe; aqui é o plano B, medindo o conteúdo.
    campo.style.height = "auto";
    const alto = campo.scrollHeight;
    if (alto) campo.style.height = `${alto}px`;
  };

  const aoMudar = () => {
    desenharContador();
    ajustarAltura();
  };

  const definirEstado = (e: typeof estado, mensagem = "") => {
    estado = e;
    el.setAttribute("data-estado", e);
    const ocupado = e === "salvando";
    campo.readOnly = ocupado;
    for (const b of [bSalvar, bChecklist, bSobe, bDesce, bRemover, bDescartar, bPrioridade]) b.disabled = ocupado;
    data.disabled = ocupado;
    if (ocupado) el.setAttribute("aria-busy", "true");
    else el.removeAttribute("aria-busy");
    situacao.textContent = ocupado ? "Salvando…" : "";
    erro.hidden = e !== "erro";
    erroTexto.textContent = e === "erro" ? mensagem : "";
  };

  const soltar = () => {
    clearTimeout(temporizador);
    doc.removeEventListener("pointerdown", aoPonteiroNoQuadro, true);
    doc.defaultView?.removeEventListener("blur", aoBlurDaJanela);
  };
  const encerrar = (r: Encerramento) => {
    if (encerrado) return;
    encerrado = true;
    soltar();
    o.aoEncerrar(r);
  };

  // ---------------------------------------------------------------------------------------------------------- seleção
  const selecao = (): { ini: number; fim: number } => ({
    ini: campo.selectionStart ?? campo.value.length,
    fim: campo.selectionEnd ?? campo.value.length,
  });
  const marcar = (ini: number, fim = ini) => {
    try {
      campo.setSelectionRange(ini, fim);
    } catch {
      campo.selectionStart = ini;
      campo.selectionEnd = fim;
    }
  };
  const linhasSelecionadas = (): { de: number; ate: number } => {
    const { ini, fim } = selecao();
    const de = linhaDaPosicao(campo.value, ini);
    // Seleção que termina no começo de uma linha não leva essa linha (como nos editores de texto).
    const ateBruto = linhaDaPosicao(campo.value, fim);
    const ate = fim > ini && posicaoDaLinha(campo.value, ateBruto) === fim && ateBruto > de ? ateBruto - 1 : ateBruto;
    return { de, ate };
  };

  // ---------------------------------------------------------------------------------------------------------- ações
  const salvar = async (): Promise<void> => {
    if (encerrado || estado === "salvando") return;
    const texto = normalizar(campo.value).slice(0, LIMITE_ANOTACAO);
    if (!sujo() && estado !== "erro") {
      encerrar({ gravou: false });
      return;
    }
    if (texto === "") {
      if (!origem) {
        encerrar({ gravou: false });
        return;
      }
      confirmando = true;
      const sim = await perguntar("Tem certeza que deseja remover esta anotação?", "Remover");
      confirmando = false;
      if (!sim) {
        campo.focus();
        return;
      }
    }
    const prioridade = texto === "" ? false : prioritaria;
    definirEstado("salvando");
    try {
      await ctx.op.anotar({ texto, prioridade });
    } catch (e) {
      definirEstado("erro", mensagemDeErro(e));
      campo.focus();
      return;
    }
    definirEstado("editando");
    origem = texto === "" ? null : { texto, prioridade };
    encerrar({ gravou: true, valor: origem });
  };

  const descartar = async (): Promise<void> => {
    if (encerrado || estado === "salvando") return;
    if (sujo()) {
      confirmando = true;
      const sim = await perguntar("Descartar as alterações desta anotação?", "Descartar");
      confirmando = false;
      if (!sim) {
        campo.focus();
        return;
      }
    }
    encerrar({ gravou: false });
  };

  const remover = async (): Promise<void> => {
    if (encerrado || estado === "salvando" || !origem) return;
    confirmando = true;
    const sim = await perguntar("Tem certeza que deseja remover esta anotação?", "Remover");
    confirmando = false;
    if (!sim) {
      campo.focus();
      return;
    }
    definirEstado("salvando");
    try {
      await ctx.op.anotar({ texto: "", prioridade: false });
    } catch (e) {
      definirEstado("erro", mensagemDeErro(e));
      return;
    }
    definirEstado("editando");
    origem = null;
    encerrar({ gravou: true, valor: null });
  };

  const saiuDoFoco = (): void => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      if (encerrado || confirmando || pressionando || estado !== "editando") return;
      const ativo = ambiente.ativo();
      if (ativo && el.contains(ativo)) return;
      // Sem gesto do usuário (ou com o foco fora do SEI, como ao trocar de aba): continua editando; nada é gravado.
      const paraOutroQuadro = recente(janelaPerdeuFocoEm) && ambiente.focoEmOutroQuadro();
      if (!recente(gestoFora) && !paraOutroQuadro) return;
      if (!sujo()) {
        encerrar({ gravou: false });
        return;
      }
      // Texto apagado de propósito não some sozinho: pede confirmação só quando o usuário usar Salvar ou Remover.
      if (normalizar(campo.value) === "" && origem) return;
      void salvar();
    }, o.esperaSaidaMs ?? 150);
  };

  // ---------------------------------------------------------------------------------------------------------- ligações
  campo.addEventListener("input", () => {
    aoMudar();
    if (estado === "erro") erro.hidden = false; // o aviso fica até gravar (o texto digitado continua valendo)
  });
  campo.addEventListener("keydown", (ev) => {
    const k = ev as KeyboardEvent;
    if (k.key === "Escape") {
      k.preventDefault();
      k.stopPropagation();
      void descartar();
      return;
    }
    if (k.key === "Enter" && (k.ctrlKey || k.metaKey)) {
      k.preventDefault();
      void salvar();
      return;
    }
    if (k.key === "Enter" && !k.shiftKey && !k.altKey && !k.isComposing) {
      const { ini, fim } = selecao();
      if (ini !== fim) return;
      const r = continuarChecklist(campo.value, ini);
      if (!r || r.texto.length > LIMITE_ANOTACAO) return;
      k.preventDefault();
      campo.value = r.texto;
      marcar(r.pos);
      aoMudar();
      return;
    }
    if (k.altKey && (k.key === "ArrowUp" || k.key === "ArrowDown")) {
      k.preventDefault();
      mover(k.key === "ArrowUp" ? -1 : 1);
    }
  });

  const mover = (sentido: -1 | 1) => {
    const { ini, fim } = selecao();
    const { de, ate } = linhasSelecionadas();
    const r = moverLinhas(campo.value, de, ate, sentido);
    if (!r) return;
    const coluna = ini - posicaoDaLinha(campo.value, de);
    campo.value = r.texto;
    const inicioDaFaixa = posicaoDaLinha(r.texto, r.de);
    if (ini === fim) {
      // Cursor sem seleção: continua na mesma coluna da linha que subiu ou desceu (digitar não apaga nada).
      const tamanho = (r.texto.split("\n")[r.de] ?? "").length;
      marcar(inicioDaFaixa + Math.min(coluna, tamanho));
    } else {
      // Com seleção: as mesmas linhas continuam selecionadas, para mover de novo.
      marcar(inicioDaFaixa, Math.max(posicaoDaLinha(r.texto, r.ate + 1) - 1, inicioDaFaixa));
    }
    aoMudar();
    campo.focus();
  };

  bSalvar.addEventListener("click", () => void salvar());
  bDescartar.addEventListener("click", () => void descartar());
  bRemover.addEventListener("click", () => void remover());
  bSobe.addEventListener("click", () => mover(-1));
  bDesce.addEventListener("click", () => mover(1));
  bPrioridade.addEventListener("click", () => {
    prioritaria = !prioritaria;
    bPrioridade.setAttribute("aria-pressed", String(prioritaria));
    el.classList.toggle("prioridade", prioritaria);
  });
  el.classList.toggle("prioridade", prioritaria);
  bChecklist.addEventListener("click", () => {
    const { de, ate } = linhasSelecionadas();
    campo.value = alternarChecklist(campo.value, de, ate).slice(0, LIMITE_ANOTACAO);
    aoMudar();
    campo.focus();
  });
  data.addEventListener("change", () => {
    if (!data.value) return;
    campo.value = definirDataNaAnotacao(campo.value, data.value).slice(0, LIMITE_ANOTACAO);
    aoMudar();
  });
  tentar.addEventListener("click", () => void salvar());
  usarSei.addEventListener("click", () => {
    const sei = divergente ?? null;
    origem = sei && normalizar(sei.texto) ? sei : null;
    campo.value = origem?.texto ?? "";
    prioritaria = origem?.prioridade ?? false;
    bPrioridade.setAttribute("aria-pressed", String(prioritaria));
    el.classList.toggle("prioridade", prioritaria);
    data.value = dataIsoDaAnotacao(campo.value) ?? "";
    divergente = undefined;
    avisoSei.hidden = true;
    el.removeAttribute("data-desatualizado");
    aoMudar();
    campo.focus();
  });
  el.addEventListener("pointerdown", () => {
    pressionando = true;
    // Se o botão do mouse for solto fora do editor, o `click` não chega aqui: a trava não pode ficar para sempre.
    setTimeout(() => {
      pressionando = false;
    }, 600);
  });
  for (const t of ["pointerup", "pointercancel", "click"]) {
    el.addEventListener(t, () => {
      pressionando = false;
    });
  }
  const aoPonteiroNoQuadro = (ev: Event) => {
    if (!el.contains(ev.target as Node | null)) gestoFora = Date.now();
  };
  const aoBlurDaJanela = () => {
    janelaPerdeuFocoEm = Date.now();
    saiuDoFoco();
  };
  doc.addEventListener("pointerdown", aoPonteiroNoQuadro, true);
  doc.defaultView?.addEventListener("blur", aoBlurDaJanela);
  el.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key === "Tab") gestoFora = Date.now();
  });
  el.addEventListener("focusout", (ev) => {
    const para = (ev as FocusEvent).relatedTarget as Node | null;
    if (para && el.contains(para)) return;
    saiuDoFoco();
  });

  desenharContador();
  definirEstado("editando");
  // Fora do navegador (testes) `scrollHeight` não existe: o ajuste é inofensivo.
  ajustarAltura();

  return {
    el,
    texto: () => campo.value,
    prioridade: () => prioritaria,
    sujo,
    fatiaMudou(atual) {
      if (encerrado) return;
      // Igual ao que o editor tem como origem, ou ao que o usuário já escreveu: nada a avisar.
      const doUsuario: AnotacaoProcesso | null = normalizar(campo.value)
        ? { texto: normalizar(campo.value), prioridade: prioritaria }
        : null;
      const mudou = !igual(atual, origem) && !igual(atual, doUsuario);
      divergente = mudou ? atual : undefined;
      avisoSei.hidden = !mudou;
      el.toggleAttribute("data-desatualizado", mudou);
    },
    focar() {
      campo.focus();
      marcar(campo.value.length);
      ajustarAltura();
    },
    saiuDoFoco,
    salvar,
    descartar,
    destruir() {
      encerrado = true;
      soltar();
    },
  };
}
