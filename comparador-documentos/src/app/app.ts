/**
 * App do Comparador de Documentos (o conteúdo do `<dialog>` de html/comparador-documentos.html).
 *
 * A (documento marcado na árvore) fica fixo; B vem de um seletor com busca. A aba entrega o HTML de cada documento
 * (`conteudo`); aqui ele vira blocos (DOMParser), o Worker compara e o resultado, já sanitizado, entra num iframe
 * `sandbox` sem scripts. Cada documento lido fica em cache: inverter ou trocar o B não refaz pedido do que já veio.
 */

import { lerBlocos } from "@cd/modelo/blocos";
import { DOCTYPE_DOWNLOAD } from "@cd/modelo/constantes";
import { montarResultado, semDiferencas } from "@cd/modelo/resultado";
import type { Rpc } from "@comum/ponte/rpc";
import { criarCombo } from "@comum/ui/combobox";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import type { Comparador } from "./trabalhador";

export interface DepsApp {
  rpc: Pick<Rpc, "chamar">;
  comparador: Comparador;
  fechar(): void;
  abrirModal: AbrirModal;
  baixar(nome: string, conteudo: string, tipo: string): void;
  /** DOMParser das provas (o do linkedom); no navegador, o nativo. */
  parser?: DOMParser;
  /** Nome do produto no arquivo baixado (o `short_name` do manifest). */
  produto?: string;
}

type Falha = { ok: false; erro: string; sessao?: true };
type Estado =
  | { tipo: "inicial" }
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "iguais" }
  | { tipo: "pronto"; html: string };

interface Candidato {
  id: string;
  numero: string;
  titulo: string;
}

/** Tempos (ms) de cada fase da última comparação; ficam em `globalThis.__sproComparadorTempos` para a depuração. */
export interface Tempos {
  lerB: number;
  blocos: number;
  diff: number;
  montar: number;
}

const ROTULO_INVERTER = "Inverter (A/B → B/A)";
const MSG_SEM_A = "Nenhum documento selecionado na árvore do processo";
const MSG_A_ILEGIVEL =
  "O documento A não pode ser comparado (anexo, cancelado ou sem acesso). Só documentos gerados no SEI entram na comparação.";

const agora = (): number => (typeof performance !== "undefined" ? performance.now() : Date.now());

export class AppComparador {
  private idA: string | null = null;
  private tituloA = "";
  private candidatos: Candidato[] = [];
  private idB: string | null = null;
  private invertido = false;
  private estado: Estado = { tipo: "inicial" };
  private readonly cache = new Map<string, Promise<string>>();
  private geracao = 0;
  private aborto: AbortController | null = null;
  private destruido = false;

  private readonly corpo = h("div", { class: "cmp-corpo", "aria-live": "polite" });
  private readonly blocoA = h("div", { class: "cmp-a" });
  private readonly status = h("p", { class: "cmp-status", role: "status", hidden: true });
  private readonly botaoInverter = h(
    "button",
    { type: "button", class: "spro-botao", "aria-pressed": "false", disabled: true, onclick: () => this.inverter() },
    icone("ordenar", 16),
    ROTULO_INVERTER,
  );
  private readonly botaoBaixar = h(
    "button",
    { type: "button", class: "spro-botao", disabled: true, onclick: () => this.baixar() },
    icone("baixar", 16),
    "Baixar",
  );
  private readonly botaoCriar = h(
    "button",
    { type: "button", class: "spro-botao primario", disabled: true, onclick: () => void this.abrirCriar() },
    icone("documento", 16),
    "Criar Novo Documento",
  );
  private readonly comboB = criarCombo({
    rotulo: "Documento B",
    opcoes: () => this.candidatos.map((c) => ({ valor: c.id, rotulo: c.titulo, complemento: c.numero })),
    vazio: "Selecione o documento para comparação",
    busca: true,
    aoMudar: (v) => void this.escolherB(v[0] ?? null),
  });

  constructor(
    raiz: HTMLElement,
    private readonly d: DepsApp,
  ) {
    const cabecalho = h(
      "header",
      { class: "spro-lista-topo" },
      h("div", { class: "spro-lista-titulo" }, icone("documento", 18), h("h1", {}, "Comparar Documentos")),
      h(
        "div",
        { class: "spro-lista-topo-acoes" },
        h(
          "button",
          { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", title: "Fechar (Esc)", onclick: () => this.d.fechar() },
          icone("fechar", 18),
        ),
      ),
    );
    const escolha = h(
      "div",
      { class: "cmp-docs" },
      this.blocoA,
      h("div", { class: "cmp-b" }, h("span", { class: "cmp-rotulo" }, "B"), this.comboB.el, this.botaoInverter),
    );
    const rodape = h(
      "div",
      { class: "spro-dialogo-rodape cmp-rodape" },
      this.status,
      h("span", { class: "cmp-espaco" }),
      this.botaoBaixar,
      this.botaoCriar,
    );
    raiz.replaceChildren(cabecalho, escolha, this.corpo, rodape);
    this.comboB.el.disabled = true;
    this.pintarCorpo();
  }

  async iniciar(): Promise<void> {
    this.estado = { tipo: "carregando" };
    this.pintarCorpo();
    try {
      const ctx = await this.chamar<{ idA: string | null; tituloA: string }>("contexto");
      this.idA = ctx.idA;
      this.tituloA = ctx.tituloA;
      this.pintarA();
      if (!this.idA) {
        this.estado = { tipo: "inicial" };
        this.pintarCorpo();
        return;
      }
      // O A e a lista vêm juntos: quando o usuário escolher o B, o A já está lido.
      const lista = await this.chamar<{ candidatos: Candidato[]; aLegivel: boolean }>("candidatos");
      this.candidatos = lista.candidatos;
      if (!lista.aLegivel) {
        this.estado = { tipo: "erro", mensagem: MSG_A_ILEGIVEL };
        this.pintarCorpo();
        return;
      }
      void this.html(this.idA).catch(() => undefined);
      this.comboB.atualizar();
      this.comboB.el.disabled = false;
      this.estado = { tipo: "inicial" };
    } catch (e) {
      this.estado = { tipo: "erro", mensagem: mensagemDe(e) };
    }
    this.pintarCorpo();
  }

  destruir(): void {
    this.destruido = true;
    this.aborto?.abort();
    this.d.comparador.encerrar();
  }

  // ---------- Dados ----------

  private async chamar<T>(op: string, args?: unknown, prazo?: number): Promise<T> {
    const r = await this.d.rpc.chamar<({ ok: true } & T) | Falha>(op, args, prazo);
    if (!r || (r as Falha).ok === false) throw new Error((r as Falha | undefined)?.erro ?? "Falha ao falar com o SEI.");
    return r as T;
  }

  /** HTML de um documento, lido uma vez (a promessa fica em cache; se falhar, sai do cache para tentar de novo). */
  private html(id: string): Promise<string> {
    let p = this.cache.get(id);
    if (!p) {
      p = this.chamar<{ html: string }>("conteudo", { id }).then((r) => r.html);
      p.catch(() => this.cache.delete(id));
      this.cache.set(id, p);
    }
    return p;
  }

  // ---------- Comparação ----------

  private async escolherB(id: string | null): Promise<void> {
    this.idB = id;
    this.limparStatus();
    await this.comparar();
  }

  private inverter(): void {
    this.invertido = !this.invertido;
    this.botaoInverter.setAttribute("aria-pressed", String(this.invertido));
    void this.comparar();
  }

  private async comparar(): Promise<void> {
    this.aborto?.abort();
    const minha = ++this.geracao;
    if (!this.idA || !this.idB) {
      this.estado = { tipo: "inicial" };
      this.pintarCorpo();
      return;
    }
    this.estado = { tipo: "carregando" };
    this.pintarCorpo();
    const ctl = new AbortController();
    this.aborto = ctl;
    const vigente = (): boolean => minha === this.geracao && !this.destruido;
    try {
      const t: Tempos = { lerB: 0, blocos: 0, diff: 0, montar: 0 };
      let t0 = agora();
      const [htmlA, htmlB] = await Promise.all([this.html(this.idA), this.html(this.idB)]);
      t.lerB = agora() - t0;
      if (!vigente()) return;
      const [antesHtml, depoisHtml] = this.invertido ? [htmlB, htmlA] : [htmlA, htmlB];
      t0 = agora();
      const antes = lerBlocos(antesHtml, this.d.parser);
      const depois = lerBlocos(depoisHtml, this.d.parser);
      t.blocos = agora() - t0;
      t0 = agora();
      const edicao = await this.d.comparador.comparar(antes.blocos, depois.blocos, ctl.signal);
      t.diff = agora() - t0;
      if (!vigente()) return;
      t0 = agora();
      this.estado = semDiferencas(edicao) ? { tipo: "iguais" } : { tipo: "pronto", html: montarResultado(depois, edicao, this.d.parser) };
      t.montar = agora() - t0;
      (globalThis as { __sproComparadorTempos?: Tempos }).__sproComparadorTempos = t;
    } catch (e) {
      if (!vigente() || (e as { name?: string })?.name === "AbortError") return;
      this.estado = { tipo: "erro", mensagem: mensagemDe(e) };
    }
    this.pintarCorpo();
  }

  // ---------- Tela ----------

  private pintarA(): void {
    this.blocoA.replaceChildren(
      h("span", { class: "cmp-rotulo" }, "A"),
      this.idA ? h("span", { class: "cmp-titulo" }, this.tituloA) : h("span", { class: "cmp-aviso" }, icone("alerta", 16), MSG_SEM_A),
    );
  }

  private pintarCorpo(): void {
    const e = this.estado;
    this.botaoInverter.disabled = !this.idA || !this.idB;
    this.botaoBaixar.disabled = e.tipo !== "pronto";
    this.botaoCriar.disabled = e.tipo !== "pronto";
    if (e.tipo === "pronto") {
      this.corpo.replaceChildren(
        h(
          "p",
          { class: "cmp-legenda" },
          h("span", { class: "cmp-ret" }, "retirado"),
          " e ",
          h("span", { class: "cmp-acr" }, "acrescentado"),
          this.invertido ? " (B → A)" : " (A → B)",
        ),
        h("iframe", { class: "cmp-resultado", title: "Resultado da comparação", sandbox: "", srcdoc: e.html }),
      );
      return;
    }
    const texto =
      e.tipo === "carregando"
        ? "Comparando…"
        : e.tipo === "iguais"
          ? "Os dois documentos são iguais."
          : e.tipo === "erro"
            ? e.mensagem
            : this.idA
              ? "Escolha o documento B para ver o que mudou."
              : "Feche o comparador, clique no documento A na árvore do processo e abra de novo.";
    this.corpo.replaceChildren(h("p", { class: e.tipo === "erro" ? "cmp-erro" : "cmp-dica" }, texto));
  }

  private mostrarStatus(texto: string): void {
    this.status.textContent = texto;
    this.status.hidden = false;
  }

  private limparStatus(): void {
    this.status.hidden = true;
    this.status.textContent = "";
  }

  // ---------- Ações ----------

  private baixar(): void {
    if (this.estado.tipo !== "pronto") return;
    const b = this.candidatos.find((c) => c.id === this.idB);
    const nome = `Comparativo ${this.tituloA} - ${b?.titulo ?? ""} (${this.d.produto ?? "SEI Pro"}).html`;
    this.d.baixar(nome, `﻿${DOCTYPE_DOWNLOAD}${this.estado.html}`, "text/html;charset=utf-8");
  }

  private async abrirCriar(): Promise<void> {
    if (this.estado.tipo !== "pronto") return;
    const html = this.estado.html;
    const idB = this.idB;
    let tipos: Array<{ id: string; nome: string }>;
    try {
      tipos = (await this.chamar<{ tipos: Array<{ id: string; nome: string }> }>("tipos")).tipos;
    } catch (e) {
      this.mostrarStatus(mensagemDe(e));
      return;
    }
    let escolhido: string | null = null;
    const criar = h("button", { type: "button", class: "spro-botao primario", disabled: true }, "Criar");
    const tipo = criarCombo({
      rotulo: "Tipo do documento",
      opcoes: tipos.map((t) => ({ valor: t.id, rotulo: t.nome })),
      vazio: "Selecione o tipo de documento",
      busca: true,
      aoMudar: (v) => {
        escolhido = v[0] ?? null;
        criar.disabled = !escolhido;
      },
    });
    const erro = h("p", { class: "cmp-erro", hidden: true });
    const modal = this.d.abrirModal({
      titulo: "Criar novo documento comparado",
      icone: "documento",
      conteudo: h(
        "div",
        { class: "cmp-criar" },
        h("p", {}, "Selecione o tipo de documento que deseja criar:"),
        tipo.el,
        erro,
        h("div", { class: "spro-dialogo-rodape" }, criar),
      ),
    });
    criar.addEventListener("click", async () => {
      if (!escolhido || !idB) return;
      criar.disabled = true;
      erro.hidden = true;
      try {
        const nomeTipo = tipos.find((t) => t.id === escolhido)?.nome;
        const r = await this.chamar<{ numero: string }>(
          "criar",
          { tipoId: escolhido, ...(nomeTipo ? { tipoNome: nomeTipo } : {}), html, idB },
          60_000,
        );
        modal.fechar();
        this.mostrarStatus(`Documento ${r.numero} criado no processo.`);
      } catch (e) {
        erro.textContent = mensagemDe(e);
        erro.hidden = false;
        criar.disabled = false;
      }
    });
  }
}

function mensagemDe(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
