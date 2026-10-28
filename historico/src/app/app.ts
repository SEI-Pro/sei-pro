/**
 * O app do histórico: estado da tela e orquestração, nos dois modos (modal
 * sobre o SEI e aba da barra lateral). Não toca o navegador direto (diálogo,
 * download, área de transferência e a aba do SEI chegam por `DepsApp`), e por
 * isso roda inteiro nos testes com linkedom. Mesma estrutura do AppFavoritos:
 * o construtor monta o DOM fixo, `iniciar` lê e liga os ouvintes, e
 * `redesenhar` só troca as partes que mudam.
 */

import type { Area } from "@comum/armazenamento/area";
import { gerarCsv } from "@comum/csv";
import type { Rpc } from "@comum/ponte/rpc";
import { avisar } from "@comum/ui/aviso";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h, icone, type NomeIcone } from "@comum/ui/dom";
import { fecharOrfaos } from "@comum/ui/flutuante";
import { criarMenu } from "@comum/ui/menu";
import { CHAVE_PREFERENCIAS, PAGINA_LISTA } from "../modelo/constantes";
import { linhasCsv } from "../modelo/csv";
import { type ApoioFiltro, contar, filtrar, ordenar } from "../modelo/operacoes";
import {
  type ContextoHistorico,
  type Filtro,
  type Limite,
  type MetaHistorico,
  type PeriodoApagar,
  PREFERENCIAS_PADRAO,
  type Preferencias,
  type Visita,
} from "../modelo/tipos";
import { gravarPreferencias, lerPreferencias } from "../preferencias";
import type { RepositorioHistorico } from "../repositorio";
import { montarApagar, montarLimite } from "./componentes/dialogos";
import { type BarraFiltros, criarFiltros, type EstadoFiltros } from "./componentes/filtros";
import type { AcoesItem } from "./componentes/item";
import { renderLista } from "./componentes/lista";
import { numero, processos } from "./formato";

export type { AbrirModal } from "@comum/ui/dialogo";

/** A ponte com os Favoritos (Task 15). null = Favoritos novo inativo: sem estrela, filtro nem "Favoritar". */
export interface FavoritosDoApp {
  ids(): Promise<Set<string>>;
  favoritar(v: Visita): Promise<{ lista: string; desfazer(): Promise<void> }>;
  tirar(id: string): Promise<{ desfazer(): Promise<void> } | null>;
  aoMudar(cb: () => void): () => void;
}

export interface DepsApp {
  modo: "modal" | "lateral";
  ctx: ContextoHistorico;
  /** chrome.storage.local (preferências e visitas). */
  area: Area;
  repo: RepositorioHistorico;
  /** abrirProcesso, fechar e apagarLegado, atendidos pela aba do SEI. */
  rpc: Pick<Rpc, "chamar">;
  favoritos: FavoritosDoApp | null;
  historicoLigado(): Promise<boolean>;
  abrirModal: AbrirModal;
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  copiar(texto: string): Promise<void>;
  agora(): number;
  /** Só no modal: ao iniciar, o foco vai para a busca. O painel lateral não rouba o foco ao trocar de aba. */
  focarBusca?: boolean;
  /** Só no modal. */
  fechar?(): void;
  /** Só no modal, quando o pacote tem barra lateral. */
  abrirLateral?(): void;
  abrirOpcoes(): void;
}

const mensagem = (e: unknown): string => (e instanceof Error ? e.message : String(e));
const dois = (n: number) => String(n).padStart(2, "0");

const botaoLote = (nome: NomeIcone, rotulo: string, fazer: () => void, classe = "") =>
  h(
    "button",
    { type: "button", class: `spro-botao pequeno ${classe}`.trim(), "aria-label": rotulo, title: rotulo, onclick: fazer },
    icone(nome, 14),
    h("span", { class: "spro-lista-lote-texto" }, rotulo),
  );

export class AppHistorico {
  private todas: Visita[] = [];
  /** null = sem Favoritos (ou a leitura deles falhou). */
  private favs: Set<string> | null = null;
  private filtro: Filtro = {};
  private readonly selecao = new Set<string>();
  private visiveis = PAGINA_LISTA;
  private prefs: Preferencias = { ...PREFERENCIAS_PADRAO };
  private meta: MetaHistorico = {};
  private ligado = true;
  private chaveFaixas = "";
  private recargaAgendada = false;
  private destruido = false;
  private readonly parar: Array<() => void> = [];
  private readonly el: {
    faixas: HTMLElement;
    total: HTMLElement;
    ferramentas: HTMLElement;
    busca: HTMLInputElement;
    barra: BarraFiltros;
    resumo: HTMLElement;
    lote: HTMLElement;
    corpo: HTMLElement;
  };

  constructor(
    private readonly raiz: HTMLElement,
    private readonly d: DepsApp,
  ) {
    const busca = h("input", {
      type: "search",
      class: "spro-lista-busca",
      placeholder: "Buscar número, tipo, especificação, interessado ou assunto",
      "aria-label": "Buscar no histórico",
      "aria-keyshortcuts": "/",
    });
    let espera: ReturnType<typeof setTimeout> | undefined;
    busca.addEventListener("input", () => {
      clearTimeout(espera);
      espera = setTimeout(() => this.filtrar(this.comBusca(busca.value)), 150);
    });
    busca.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape" || !busca.value) return;
      // Sem isto, o Esc também fecharia o modal (o diálogo do app).
      ev.preventDefault();
      clearTimeout(espera);
      busca.value = "";
      this.filtrar(this.comBusca(""));
    });
    const barra = criarFiltros(this.estadoFiltros(d.agora()), {
      filtrar: (f) => this.filtrar(f),
      ordenar: (o) => this.gravar({ ordem: o }),
      agrupar: (v) => this.gravar({ agruparPorDia: v }),
    });
    const modal = d.modo === "modal";
    this.el = {
      faixas: h("div", { class: "spro-lista-faixas" }),
      total: h("span", { class: "spro-lista-total" }),
      ferramentas: h(
        "div",
        { class: "spro-lista-ferramentas" },
        h(
          "label",
          { class: "spro-lista-busca-caixa" },
          icone("busca", 15),
          busca,
          h("kbd", { class: "spro-lista-atalho", title: "Atalho: tecla /", "aria-hidden": "true" }, "/"),
        ),
        barra.el,
      ),
      busca,
      barra,
      resumo: h("div", { class: "spro-lista-resumo", hidden: true }),
      lote: h("div", { class: "spro-lista-lote-lugar", hidden: true }),
      corpo: h("div", { class: "spro-lista-corpo" }),
    };
    raiz.replaceChildren(
      this.el.faixas,
      h(
        "header",
        { class: "spro-lista-topo" },
        // Na lateral, a aba já diz o que é: sem título.
        modal ? h("div", { class: "spro-lista-titulo" }, icone("historico", 18), h("h1", {}, "Histórico"), this.el.total) : null,
        h(
          "div",
          { class: "spro-lista-topo-acoes" },
          d.abrirLateral
            ? h(
                "button",
                {
                  type: "button",
                  class: "spro-botao-icone",
                  "aria-label": "Abrir na barra lateral",
                  title: "Abrir na barra lateral",
                  onclick: () => this.d.abrirLateral?.(),
                },
                icone("painel", 18),
              )
            : null,
          this.menu(),
          modal
            ? h(
                "button",
                {
                  type: "button",
                  class: "spro-botao-icone",
                  "aria-label": "Fechar",
                  title: "Fechar (Esc)",
                  onclick: () => this.d.fechar?.(),
                },
                icone("fechar", 18),
              )
            : null,
        ),
      ),
      this.el.ferramentas,
      barra.ativos,
      this.el.resumo,
      this.el.lote,
      this.el.corpo,
    );
    // "/" leva à busca, fora de campos de texto, de listas flutuantes e de diálogos
    // abertos por cima (o próprio app, no modo modal, mora num <dialog>).
    const atalho = (ev: KeyboardEvent) => {
      if (ev.key !== "/" || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const alvo = ev.target as HTMLElement | null;
      if (alvo?.closest?.("input, textarea, select, [contenteditable], .spro-combo-pop, .spro-menu-pop")) return;
      const dialogo = alvo?.closest?.("dialog");
      if (dialogo && !dialogo.contains(this.raiz)) return;
      ev.preventDefault();
      busca.focus();
      busca.select?.();
    };
    document.addEventListener("keydown", atalho);
    this.parar.push(() => document.removeEventListener("keydown", atalho));
  }

  async iniciar(): Promise<void> {
    this.ligado = await this.d.historicoLigado();
    if (this.destruido) return;
    if (!this.ligado) {
      this.redesenhar();
      return;
    }
    // Ouvintes antes da 1ª leitura: o que mudar no meio só agenda outra.
    this.parar.push(
      this.d.repo.aoMudar(() => this.agendarRecarga()),
      this.d.area.aoMudar((m) => {
        if (CHAVE_PREFERENCIAS in m) this.agendarRecarga();
      }),
    );
    if (this.d.favoritos) this.parar.push(this.d.favoritos.aoMudar(() => this.agendarRecarga()));
    await this.recarregar();
    if (this.d.focarBusca && !this.destruido) this.el.busca.focus({ preventScroll: true });
  }

  /** O painel lateral troca de app quando a aba da frente é de outro SEI ou outro usuário. */
  destruir(): void {
    this.destruido = true;
    for (const p of this.parar.splice(0)) p();
  }

  private agendarRecarga(): void {
    if (this.recargaAgendada || this.destruido) return;
    this.recargaAgendada = true;
    setTimeout(() => {
      this.recargaAgendada = false;
      this.recarregar().catch((e) => console.warn("[SEI Pro] histórico: recarga falhou", e));
    }, 30);
  }

  async recarregar(): Promise<void> {
    if (this.destruido) return;
    if (this.ligado) {
      const [todas, favs, prefs, meta] = await Promise.all([
        this.d.repo.listar(),
        this.d.favoritos
          ? this.d.favoritos.ids().catch((e) => {
              console.warn("[SEI Pro] histórico: favoritos não lidos (sem estrela nesta recarga)", e);
              return null;
            })
          : Promise.resolve(null),
        lerPreferencias(this.d.area),
        this.d.repo.meta(),
      ]);
      this.todas = todas;
      this.favs = favs;
      this.prefs = prefs;
      this.meta = meta;
    }
    this.redesenhar();
  }

  private apoio(agora: number): ApoioFiltro {
    return { agora, favoritos: this.favs };
  }

  private filtradas(agora = this.d.agora()): Visita[] {
    return ordenar(filtrar(this.todas, this.filtro, this.apoio(agora)), this.prefs.ordem);
  }

  /** As linhas desenhadas: as primeiras `visiveis` do filtro ("Mostrar mais" desenha mais). */
  private desenhadas(filtradas = this.filtradas()): Visita[] {
    return filtradas.slice(0, this.visiveis);
  }

  /** Os selecionados entre as linhas desenhadas: o lote nunca age sobre item escondido pelo filtro nem ainda não desenhado. */
  private selecionados(): Visita[] {
    return this.desenhadas().filter((v) => this.selecao.has(v.id));
  }

  private estadoFiltros(agora: number): EstadoFiltros {
    return {
      filtro: this.filtro,
      ordem: this.prefs.ordem,
      agrupar: this.prefs.agruparPorDia,
      contagens: contar(this.todas, this.apoio(agora)),
      favoritosAtivo: this.favs !== null,
    };
  }

  private comBusca(texto: string): Filtro {
    const f: Filtro = { ...this.filtro };
    delete f.busca;
    if (texto) f.busca = texto;
    return f;
  }

  private filtrar(f: Filtro): void {
    this.filtro = f;
    this.visiveis = PAGINA_LISTA;
    this.redesenhar();
  }

  private gravar(m: Partial<Preferencias>): void {
    void gravarPreferencias(this.d.area, m).catch((e) => avisar(mensagem(e)));
  }

  private redesenhar(): void {
    if (this.destruido) return;
    this.desenhar();
    // Menu ou seletor aberto num item que acabou de ser redesenhado: a camada ficaria solta.
    fecharOrfaos();
  }

  private desenhar(): void {
    this.desenharFaixas();
    this.el.total.hidden = !this.ligado;
    this.el.total.textContent = processos(this.todas.length);
    this.el.ferramentas.hidden = !this.ligado;
    if (!this.ligado) {
      this.el.barra.ativos.hidden = true;
      this.el.resumo.hidden = true;
      this.el.lote.hidden = true;
      const abrir = h("button", { type: "button", class: "spro-botao primario", onclick: () => this.d.abrirOpcoes() }, "Abrir opções");
      this.el.corpo.replaceChildren(
        this.vazio("historico", "O histórico está desligado nas opções do SEI Pro.", abrir, "spro-lista-desligado"),
      );
      return;
    }
    const agora = this.d.agora();
    const filtradas = this.filtradas(agora);
    const desenhadas = this.desenhadas(filtradas);
    // A seleção só guarda o que está desenhado: trocar o filtro (que volta a 200 linhas) tira quem sumiu.
    const aVista = new Set(desenhadas.map((v) => v.id));
    for (const id of [...this.selecao]) if (!aVista.has(id)) this.selecao.delete(id);
    this.el.barra.atualizar(this.estadoFiltros(agora));
    if (this.el.busca.value !== (this.filtro.busca ?? "") && document.activeElement !== this.el.busca)
      this.el.busca.value = this.filtro.busca ?? "";
    this.desenharResumo(filtradas);
    this.desenharLote(desenhadas);
    if (!this.todas.length) {
      this.el.corpo.replaceChildren(
        this.vazio(
          "historico",
          "Nenhum processo visitado ainda.",
          h("p", { class: "spro-lista-vazio-dica" }, "Abra um processo no SEI e ele aparece aqui."),
        ),
      );
      return;
    }
    if (!filtradas.length) {
      // Aqui "Limpar filtros" tira também a busca: é o caminho de volta da tela vazia.
      const limpar = () => {
        this.el.busca.value = "";
        this.filtrar({});
      };
      const botao = h("button", { type: "button", class: "spro-botao", onclick: limpar }, "Limpar filtros");
      this.el.corpo.replaceChildren(this.vazio("busca", "Nada com esses filtros.", botao));
      return;
    }
    this.el.corpo.replaceChildren(
      renderLista(filtradas, {
        agora,
        // O agrupamento por dia só vale na ordem "Mais recentes".
        agrupar: this.prefs.agruparPorDia && this.prefs.ordem === "recentes",
        visiveis: this.visiveis,
        selecao: this.selecao,
        favoritos: this.favs,
        acoes: this.acoes,
        mostrarMais: () => {
          this.visiveis += PAGINA_LISTA;
          this.redesenhar();
        },
      }),
    );
  }

  /** Vazio, vazio com filtro e desligado: a mesma arte, um texto e uma ação ou dica. */
  private vazio(nome: NomeIcone, texto: string, extra: HTMLElement, classe = ""): HTMLElement {
    return h(
      "div",
      { class: `spro-lista-vazio ${classe}`.trim() },
      h("span", { class: "spro-lista-vazio-arte", "aria-hidden": "true" }, icone(nome, 28)),
      h("p", { class: "spro-lista-vazio-texto" }, texto),
      extra,
    );
  }

  /** Pausado e migração. Só remonta quando muda: um botão em foco não perde o foco a cada recarga. */
  private desenharFaixas(): void {
    const pausado = this.ligado && !this.prefs.registrar;
    const migrados = this.ligado && !this.meta.avisoMigracao ? (this.meta.migrados ?? 0) : 0;
    const chave = `${pausado}|${migrados}`;
    if (chave === this.chaveFaixas) return;
    this.chaveFaixas = chave;
    const faixa = (nome: NomeIcone, texto: string, rotulo: string, fazer: () => void) =>
      h(
        "div",
        { class: "spro-lista-faixa", role: "note" },
        icone(nome, 16),
        h("span", {}, texto),
        h("button", { type: "button", class: "spro-botao", onclick: fazer }, rotulo),
      );
    this.el.faixas.replaceChildren(
      ...(pausado
        ? [faixa("alerta", "O registro está pausado: nada novo entra no histórico.", "Retomar", () => this.gravar({ registrar: true }))]
        : []),
      ...(migrados
        ? [
            faixa("historico", `Histórico antigo trazido para cá: ${processos(migrados)}.`, "Entendi", () => {
              this.meta = { ...this.meta, avisoMigracao: true };
              this.desenharFaixas();
              void this.d.repo.gravarMeta({ avisoMigracao: true }).catch((e) => avisar(mensagem(e)));
            }),
          ]
        : []),
    );
  }

  /** "12 de 340 processos", com a caixa de selecionar todos os visíveis (como no Favoritos). */
  private desenharResumo(filtradas: Visita[]): void {
    const total = this.todas.length;
    this.el.resumo.hidden = !total;
    if (!total) {
      this.el.resumo.replaceChildren();
      return;
    }
    // "Visíveis" = as linhas desenhadas, e não as que ainda estão atrás do "Mostrar mais".
    const aVista = this.desenhadas(filtradas);
    const marcados = aVista.filter((v) => this.selecao.has(v.id)).length;
    const estado = marcados === 0 ? "false" : marcados === aVista.length ? "true" : "mixed";
    const todos = h(
      "button",
      {
        type: "button",
        role: "checkbox",
        class: "spro-lista-sel-todos",
        "aria-checked": estado,
        "aria-label": "Selecionar todos os visíveis",
        title: estado === "true" ? "Desmarcar todos" : "Selecionar todos os visíveis",
        disabled: !aVista.length,
        onclick: () => {
          for (const v of aVista) {
            if (estado === "true") this.selecao.delete(v.id);
            else this.selecao.add(v.id);
          }
          this.redesenhar();
        },
      },
      estado === "true" ? icone("check", 12) : estado === "mixed" ? h("span", { class: "spro-lista-traco" }) : null,
    );
    const filtrado = filtradas.length !== total;
    this.el.resumo.replaceChildren(
      todos,
      h(
        "span",
        { class: "spro-lista-contagem" },
        h("strong", {}, filtrado ? `${numero(filtradas.length)} de ${numero(total)}` : numero(total)),
        ` ${total === 1 ? "processo" : "processos"}`,
      ),
    );
  }

  private desenharLote(desenhadas: Visita[]): void {
    const sel = desenhadas.filter((v) => this.selecao.has(v.id));
    const qtd = sel.length;
    const entrando = this.el.lote.hidden;
    this.el.lote.hidden = qtd === 0;
    if (!qtd) {
      this.el.lote.replaceChildren();
      return;
    }
    const favs = this.favs;
    const favoritaveis = favs ? sel.filter((v) => !favs.has(v.id)).length : 0;
    const lote = h(
      "div",
      { class: "spro-lista-lote", role: "toolbar", "aria-label": "Ações nos selecionados" },
      h(
        "div",
        { class: "spro-lista-lote-qtd" },
        h(
          "button",
          {
            type: "button",
            class: "spro-botao-icone pequeno",
            "aria-label": "Limpar seleção",
            title: "Limpar seleção",
            onclick: () => {
              this.selecao.clear();
              this.redesenhar();
            },
          },
          icone("fechar", 14),
        ),
        h("strong", {}, `${qtd} selecionado${qtd === 1 ? "" : "s"}`),
      ),
      h(
        "div",
        { class: "spro-lista-lote-acoes" },
        favoritaveis ? botaoLote("alvo", "Monitorar", () => void this.favoritarLote()) : null,
        botaoLote("copiar", "Copiar números", () => this.copiarNumeros(this.selecionados())),
        botaoLote("planilha", "Exportar CSV", () => this.baixarCsv(this.selecionados())),
        botaoLote("lixeira", "Remover do histórico", () => void this.removerLote(), "perigo"),
      ),
    );
    // Anima só quando a barra aparece, e não a cada marcação.
    if (entrando) lote.classList.add("spro-lista-lote-entrar");
    this.el.lote.replaceChildren(lote);
    fecharOrfaos();
  }

  private readonly acoes: AcoesItem = {
    abrir: (v, novaAba) => this.abrir(v, novaAba),
    alternarSelecao: (v, marcado) => {
      if (marcado) this.selecao.add(v.id);
      else this.selecao.delete(v.id);
      // Sem redesenhar a lista: a caixa clicada guarda o foco.
      for (const li of this.el.corpo.querySelectorAll<HTMLElement>("li.spro-lista-item"))
        if (li.dataset.id === v.id) li.classList.toggle("spro-lista-item-selecionado", marcado);
      const filtradas = this.filtradas();
      this.desenharResumo(filtradas);
      this.desenharLote(this.desenhadas(filtradas));
    },
    alternarFavorito: (v) => void this.alternarFavorito(v),
    copiar: (v) => this.copiarNumeros([v]),
    copiarTexto: (t) =>
      this.d.copiar(t).then(
        () => true,
        () => false,
      ),
    remover: (v) => void this.removerVisitas([v]),
  };

  private abrir(v: Visita, novaAba: boolean): void {
    this.d.rpc
      .chamar("abrirProcesso", { id: v.id, protocolo: v.protocolo, novaAba }, 15_000)
      .then(() => {
        // No modal, abrir na própria aba leva ao processo: o modal sai da frente.
        if (!novaAba && this.d.modo === "modal") this.d.fechar?.();
      })
      .catch((e) => avisar(mensagem(e)));
  }

  private async alternarFavorito(v: Visita): Promise<void> {
    const f = this.d.favoritos;
    if (!f || !this.favs) return;
    try {
      if (this.favs.has(v.id)) {
        const r = await f.tirar(v.id);
        if (r) avisar("Tirado dos monitorados", { rotulo: "Desfazer", fazer: () => void r.desfazer().catch((e) => avisar(mensagem(e))) });
      } else {
        const r = await f.favoritar(v);
        avisar(`Monitorado em ${r.lista}`, { rotulo: "Desfazer", fazer: () => void r.desfazer().catch((e) => avisar(mensagem(e))) });
      }
    } catch (e) {
      avisar(mensagem(e));
    }
    this.agendarRecarga();
  }

  private async favoritarLote(): Promise<void> {
    const f = this.d.favoritos;
    const favs = this.favs;
    if (!f || !favs) return;
    const alvo = this.selecionados().filter((v) => !favs.has(v.id));
    if (!alvo.length) return;
    const feitos: Array<{ lista: string; desfazer(): Promise<void> }> = [];
    let erro: unknown = null;
    try {
      for (const v of alvo) feitos.push(await f.favoritar(v));
    } catch (e) {
      erro = e;
    }
    this.agendarRecarga();
    const lista = feitos[0]?.lista;
    if (!lista) {
      if (erro) avisar(mensagem(erro));
      return;
    }
    const desfazer = {
      rotulo: "Desfazer",
      fazer: () => void Promise.all(feitos.map((x) => x.desfazer())).catch((e) => avisar(mensagem(e))),
    };
    // Um aviso só: o de sucesso não pode esconder a falha no meio do lote.
    if (erro) avisar(`${feitos.length} de ${alvo.length} monitorados em ${lista}. ${mensagem(erro)}`, desfazer);
    else avisar(feitos.length === 1 ? `Monitorado em ${lista}` : `${processos(feitos.length)} monitorados em ${lista}`, desfazer);
  }

  private copiarNumeros(vs: Visita[]): void {
    if (!vs.length) return;
    this.d
      .copiar(vs.map((v) => v.protocolo).join("\n"))
      .then(() => avisar(vs.length === 1 ? "Número copiado" : "Números copiados"))
      .catch((e) => avisar(mensagem(e)));
  }

  private baixarCsv(vs: Visita[]): void {
    if (!vs.length) return;
    const d = new Date(this.d.agora());
    const data = `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
    this.d.baixar(`historico-seipro-${data}.csv`, gerarCsv(linhasCsv(vs)), "text/csv;charset=utf-8");
  }

  private async removerLote(): Promise<void> {
    // Os de agora: se a lista recarregar durante a confirmação, o lote não muda.
    const alvo = this.selecionados();
    if (!alvo.length) return;
    if (!(await this.d.confirmar(`Remover ${processos(alvo.length)} do histórico?`, "Remover"))) return;
    await this.removerVisitas(alvo);
  }

  /** Remove e oferece Desfazer, que grava de volta as mesmas visitas. */
  private async removerVisitas(vs: Visita[]): Promise<void> {
    if (!vs.length) return;
    const repo = this.d.repo;
    try {
      await repo.remover(vs.map((v) => v.id));
    } catch (e) {
      avisar(mensagem(e));
      return;
    }
    for (const v of vs) this.selecao.delete(v.id);
    avisar(vs.length === 1 ? "Removido do histórico" : `${processos(vs.length)} removidos do histórico`, {
      rotulo: "Desfazer",
      fazer: () => void repo.importar(vs).catch((e) => avisar(mensagem(e))),
    });
  }

  private menu(): HTMLElement {
    return criarMenu({
      rotulo: "Mais ações do histórico",
      icone: "menu",
      classe: "spro-botao-icone spro-lista-menu",
      largura: 248,
      itens: () => {
        const apagar = { rotulo: "Apagar histórico…", icone: "lixeira" as const, perigo: true, fazer: () => this.abrirApagar() };
        const opcoes = { rotulo: "Opções do SEI Pro", icone: "ajustes" as const, fazer: () => this.d.abrirOpcoes() };
        // Desligado, a lista nem é lida: só apagar o que ficou e ir às opções. No painel lateral
        // desligado não há SEI nem login (escopo "|"): não há o que apagar, só as opções.
        if (!this.ligado) return this.d.repo.valido ? [apagar, "-", opcoes] : [opcoes];
        const filtradas = this.filtradas();
        return [
          { rotulo: "Exportar CSV", icone: "planilha", desativado: !filtradas.length, fazer: () => this.baixarCsv(filtradas) },
          this.prefs.registrar
            ? { rotulo: "Pausar o registro", icone: "relogio", fazer: () => this.gravar({ registrar: false }) }
            : { rotulo: "Retomar o registro", icone: "restaurar", fazer: () => this.gravar({ registrar: true }) },
          apagar,
          { rotulo: "Limite de processos…", icone: "camadas", fazer: () => void this.abrirLimite() },
          "-",
          opcoes,
        ];
      },
    });
  }

  private abrirApagar(): void {
    let modal: { fechar(): void } | null = null;
    const conteudo = montarApagar({
      aoApagar: (p) => {
        modal?.fechar();
        void this.apagar(p);
      },
      aoCancelar: () => modal?.fechar(),
    });
    modal = this.d.abrirModal({ titulo: "Apagar histórico", icone: "lixeira", conteudo });
  }

  private async apagar(p: PeriodoApagar): Promise<void> {
    let n: number;
    try {
      n = await this.d.repo.apagarPeriodo(p, this.d.agora());
    } catch (e) {
      avisar(mensagem(e));
      return;
    }
    if (p === "tudo") {
      // A chave antiga mora no localStorage da página do SEI: a aba apaga. Sem a aba (lateral
      // sem SEI, porta caída), fica a pendência na meta e o content script apaga na próxima tela.
      let legado: "apagado" | "ausente" | "pendente" = "ausente";
      try {
        legado = (await this.d.rpc.chamar<boolean>("apagarLegado", undefined, 5000)) ? "apagado" : "ausente";
      } catch {
        // Sem SEI nem login não há meta onde deixar a pendência (nem histórico antigo a apagar).
        if (this.d.repo.valido) {
          try {
            await this.d.repo.gravarMeta({ apagarLegado: true });
            legado = "pendente";
          } catch (e) {
            console.warn("[SEI Pro] histórico: pendência de apagar o histórico antigo não gravada", e);
            avisar(n ? "Histórico apagado, mas o histórico antigo do SEI não foi apagado." : "O histórico antigo do SEI não foi apagado.");
            return;
          }
        }
      }
      // "Apagado" só quando algo saiu.
      if (n || legado === "apagado") avisar("Histórico apagado");
      else if (legado === "pendente") avisar("O histórico antigo do SEI será apagado na próxima vez que você abrir o SEI.");
      else avisar("Nada para apagar.");
      return;
    }
    avisar(n ? `Histórico apagado: ${processos(n)}` : "Nenhum processo nesse período");
  }

  private async abrirLimite(): Promise<void> {
    let total: number;
    try {
      total = await this.d.repo.contar();
    } catch (e) {
      avisar(mensagem(e));
      return;
    }
    let modal: { fechar(): void } | null = null;
    const conteudo = montarLimite({
      atual: this.prefs.limite,
      total,
      aoSalvar: (l) => {
        modal?.fechar();
        void this.mudarLimite(l);
      },
      aoCancelar: () => modal?.fechar(),
    });
    modal = this.d.abrirModal({ titulo: "Limite de processos", icone: "camadas", conteudo });
  }

  private async mudarLimite(l: Limite): Promise<void> {
    try {
      await gravarPreferencias(this.d.area, { limite: l });
      // A poda roda na hora: não espera a próxima visita.
      const n = await this.d.repo.podar(l);
      avisar(n ? `${processos(n)} mais antigos saíram do histórico` : "Limite salvo");
    } catch (e) {
      avisar(mensagem(e));
    }
  }
}
