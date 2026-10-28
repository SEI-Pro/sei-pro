/**
 * O app do painel "Projetos" (html/projetos.html#modo=embutido): junta os dois
 * escopos da unidade, desenha abas, cabeçalho e a vista (Gantt com a lista,
 * Lista ou Todos) e faz as ações do dia a dia. Os dados vêm do repositório
 * (chrome.storage.local) e voltam a ser lidos a cada gravação (`aoMudar`), de
 * qualquer contexto. O que só a aba do SEI sabe (processos da caixa, usuários,
 * abrir processo ou documento) vem pelo RPC. A Frappe é reaproveitada entre
 * os redesenhos (a rolagem fica) e remontada na virada do dia; o popover do
 * filtro também fica. Excluir oferece "Desfazer" (o projeto pede confirmação
 * antes); concluir nunca conclui de novo (a data mudaria).
 */

import type { Area } from "@comum/armazenamento/area";
import type { Rpc } from "@comum/ponte/rpc";
import { alturaRedimensionavel } from "@comum/ui/alturaRedimensionavel";
import { avisar } from "@comum/ui/aviso";
import type { AbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { fecharOrfaos } from "@comum/ui/flutuante";
import { criarMenu } from "@comum/ui/menu";
import { csvDosProjetos, nomeDoCsv } from "../arquivo/csv";
import { escalaEditavel } from "../gantt/escalas";
import { linhasDoProjeto } from "../gantt/linhas";
import type { montarGantt } from "../gantt/montar";
import { completarComDependentes, problemasDasMudancas } from "../modelo/dependencias";
import { rotuloDaVis } from "../modelo/escopo";
import { criteriosAtivos, type Eu, FILTRO_VAZIO, type FiltroEtapas, filtrarEtapas, filtroNoContexto } from "../modelo/filtro";
import { planoParaRedefinir } from "../modelo/linhaDeBase";
import { ErroMemoriaSigilo } from "../modelo/memoriaSigilo";
import { datasDaEtapaNova } from "../modelo/operacoes";
import { documentoSemNumero, type SigilosConhecidos } from "../modelo/sigilo";
import type { DataISO, Etapa, MudancaDeDatas, Vinculo, Vis } from "../modelo/tipos";
import { ErroValidacao, nomeLimpo, problemasDoProjeto } from "../modelo/validacao";
import type { ContextoProjetos, DocumentoConferido, ProcessoDaCaixa, TipoAlerta, UsuarioDaUnidade } from "../ponte/tipos";
import { type MudancasEtapa, moverEntreEscopos, type RepositorioProjetos } from "../repositorio";
import { indicadorDeSincronia, limiteDeAbas, montarAbas } from "./componentes/abas";
import { abrirBalaoEtapa, type OpcoesBalao } from "./componentes/balaoEtapa";
import { montarCabecalho } from "./componentes/cabecalho";
import { type Camada, controlesDe } from "./componentes/camada";
import { type BotaoFiltro, criarBotaoFiltro, projetoNoFiltro } from "./componentes/filtro";
import {
  FOCO_TITULO,
  focoDoProjeto,
  type ModoLateral,
  montarAgenda,
  montarMiniGantt,
  montarProjetosLateral,
  topoDoLateral,
} from "./componentes/lateral";
import { criarMenuAjustes, type ExtensoesMenu } from "./componentes/menuAjustes";
import { montarTabelaEtapas } from "./componentes/tabelaEtapas";
import { montarVazio } from "./componentes/vazio";
import { VistaProjeto } from "./componentes/vistaProjeto";
import { montarTabelaProjetos, VistaTodos } from "./componentes/vistaTodos";
import { alertasDaUnidade, carregarUnidade, type DadosUnidade, type ProjetoNaTela } from "./dados";
import { abrirArquivados, abrirInformarDocumento, pedirNomeDoModelo } from "./dialogos/apoio";
import { abrirDialogoEtapa, type ResultadoEtapa } from "./dialogos/etapa";
import { abrirDialogoProjeto, type ResultadoProjeto } from "./dialogos/projeto";
import { avisarErro, CanceladoNaTroca, mensagemDoErro as mensagem } from "./erros";
import { dataCurta, plural } from "./formato";
import type { ParametrosImpressao } from "./impressao";
import { agendaDaUnidade } from "./lateral/agenda";
import {
  chaveAberto,
  escalaDoProjeto,
  gravarPreferencias,
  lerPreferencias,
  normalizarPreferencias,
  PREFERENCIAS_PADRAO,
  type Preferencias,
} from "./preferencias";
import { type ProvedorSincronia, SEM_SINCRONIA } from "./sincronia";

/** A memória do sigilo não pôde ser lida: o número de um processo sigiloso poderia sair na planilha. */
export const MENSAGEM_PLANILHA_SEM_MEMORIA =
  "Não foi possível ler a lista de processos sigilosos deste computador; a planilha não foi gerada. Tente de novo.";

export interface DepsApp {
  raiz: HTMLElement;
  ctx: ContextoProjetos;
  /** `chrome.storage.local` (preferências). */
  area: Area;
  repos: Readonly<Record<Vis, RepositorioProjetos>>;
  rpc: Pick<Rpc, "chamar">;
  abrirModal: AbrirModal;
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  hoje(): DataISO;
  agora(): number;
  /** Abre a página de impressão (main.ts: janela nova com `#modo=impressao`). */
  imprimir?: (p: ParametrosImpressao) => void;
  /** Injetável nas provas (a Frappe de verdade precisa de medidas). */
  montarGantt?: typeof montarGantt;
  /** P4: o Texto Padrão e o arquivo. Sem provedor, "neste navegador". */
  sincronia?: ProvedorSincronia;
  /** P4: itens do menu ajustes (Sincronização, Modelos, Enviar/Receber, Importar, Histórico). */
  extensoesMenu?: ExtensoesMenu;
  /** P4: "Importar meus projetos do servidor do Atividades" no primeiro uso. */
  importarAtividades?: () => void;
  /** P4: faixas acima das abas (convite do texto pessoal, "Entendi" que falta). */
  faixas?: HTMLElement;
  aoRedesenhar?: () => void;
  /** Largura útil para as abas (sem medida: 3 abas). */
  largura?: () => number;
  /** De quanto em quanto o app confere a virada do dia (padrão: 1 minuto). */
  conferirDiaMs?: number;
  /** P5: "lateral" é a aba "Projetos" do painel lateral (Agenda, cartões e mini-Gantt); sem ele, o painel embutido. */
  modo?: "embutido" | "lateral";
  /** P5: as etapas atrasadas da unidade a cada leitura (o contador da aba no painel lateral). */
  aoContar?: (atrasadas: number) => void;
}

/** Mudança de preferências: o pedaço novo, ou uma função do que está gravado (reaplicada na fila). */
type MudancaPrefs = Partial<Preferencias> | ((p: Preferencias) => Partial<Preferencias>);

/** Mapa com a chave por último (o teto de `normalizarPreferencias` guarda as últimas). */
function comChave<T>(mapa: Readonly<Record<string, T>>, chave: string, valor: T): Record<string, T> {
  const { [chave]: _antigo, ...resto } = mapa;
  return { ...resto, [chave]: valor };
}

/** Lista com `id` dentro (por último) ou fora. */
const comItem = (lista: readonly string[], id: string, dentro: boolean): string[] => [
  ...lista.filter((x) => x !== id),
  ...(dentro ? [id] : []),
];

/**
 * Resultado do diálogo da etapa → mudanças do repositório. O diálogo devolve SEM a chave o que foi
 * tirado (responsável, processo, documento, observações, fase); no `editarEtapa` só `undefined`
 * explícito em campo opcional apaga. Por isso as opcionais vão sempre, com `undefined` quando
 * ausentes. Dependências de etapas excluídas (o diálogo não as mostra) continuam gravadas: voltam a
 * valer se a etapa for restaurada.
 */
function mudancasDoDialogo(r: ResultadoEtapa, fase: string | undefined, atual?: Etapa, vivas?: ReadonlySet<string>) {
  const escondidas = atual && vivas ? atual.dependeDe.filter((d) => !vivas.has(d) && !r.dependeDe.includes(d)) : [];
  return {
    nome: r.nome,
    inicio: r.inicio,
    fim: r.fim,
    marco: r.marco,
    dependeDe: [...r.dependeDe, ...escondidas],
    medida: r.medida,
    checklist: r.checklist,
    etiquetas: r.etiquetas,
    fase,
    responsavel: r.responsavel,
    processo: r.processo,
    documento: r.documento,
    observacoes: r.observacoes,
  } satisfies MudancasEtapa;
}

export class AppProjetos {
  private prefs: Preferencias = PREFERENCIAS_PADRAO;
  private dados: DadosUnidade = { ativos: [], arquivados: [], modelos: [] };
  /** O dia com que `dados` (resumos, alertas) foi calculado. */
  private hojeDosDados = "";
  private abertoAtual = "todos";
  private vista: VistaProjeto | VistaTodos | null = null;
  private chaveVista = "";
  /** Quantas abas de projeto couberam no último desenho (o redimensionar só refaz as abas se mudar). */
  private limiteAbas = 0;
  private filtro: BotaoFiltro | null = null;
  private balao: Camada | null = null;
  /** De quem é o balão aberto: o redesenho (gravação, virada do dia) reabre o balão dessa etapa no lugar novo. */
  private balaoDe: { projeto: string; etapa: string } | null = null;
  /** A Frappe falhou: a Lista fica até o usuário escolher "Gantt" de novo (spec 9). */
  private semGantt = false;
  private focarNova = false;
  /** Lateral (P5): o projeto do mini-Gantt e o cartão da agenda com as ações abertas. */
  private projetoLateral: string | null = null;
  private cartaoAberto: string | null = null;
  /** Lateral: onde pôr o foco depois do próximo desenho (a navegação pede; senão, o mesmo controle de antes). */
  private focoLateral: string | null = null;
  private destruido = false;
  private agendado: ReturnType<typeof setTimeout> | null = null;
  private relogio: ReturnType<typeof setInterval> | null = null;
  private paradas: Array<() => void> = [];
  private processosMemo: Promise<ProcessoDaCaixa[]> | null = null;
  private usuariosMemo: Promise<UsuarioDaUnidade[]> | null = null;
  private gravacao: Promise<unknown> = Promise.resolve();
  private readonly eu: Eu;
  private readonly chaveAba: string;
  private readonly slotTopo = h("div", { class: "prj-topo" });
  private readonly slotCab = h("div", {});
  private readonly corpo = h("div", { class: "prj-corpo" });
  private readonly cartao = h("div", { class: "prj-cartao" }, this.slotCab, this.corpo);
  private readonly slotVazio = h("div", {});

  constructor(private readonly d: DepsApp) {
    this.eu = { login: d.ctx.login, nome: d.ctx.nome };
    this.chaveAba = chaveAberto(d.ctx.host, d.ctx.login, d.ctx.unidade?.id ?? "");
  }

  /** "todos" ou o id do projeto aberto (no lateral, o do mini-Gantt). */
  get aberto(): string {
    return this.d.modo === "lateral" ? (this.projetoLateral ?? "todos") : this.abertoAtual;
  }

  async iniciar(): Promise<void> {
    this.prefs = await lerPreferencias(this.d.area);
    this.abertoAtual = this.prefs.abertos[this.chaveAba] ?? "todos";
    await this.recarregar();
    // Fechado enquanto lia: não liga ouvintes nem relógio que ninguém vai desligar.
    if (this.destruido) return;
    for (const r of Object.values(this.d.repos)) this.paradas.push(r.aoMudar(() => this.agendar()));
    this.paradas.push((this.d.sincronia ?? SEM_SINCRONIA).aoMudar(() => this.atualizarSincronia()));
    // O painel fica aberto de um dia para o outro: hoje, atrasos e a linha do Gantt mudam à meia-noite.
    this.relogio = setInterval(() => this.conferirDia(), this.d.conferirDiaMs ?? 60_000);
    this.d.raiz.replaceChildren(h("div", { class: "prj" }, this.d.faixas ?? null, this.slotTopo, this.cartao, this.slotVazio));
    this.render();
  }

  destruir(): void {
    this.destruido = true;
    for (const p of this.paradas) p();
    this.paradas = [];
    if (this.agendado) clearTimeout(this.agendado);
    if (this.relogio) clearInterval(this.relogio);
    this.balao?.fechar();
    this.filtro?.fechar();
    this.descartarVista();
    this.d.raiz.replaceChildren();
    // O menu ou a lista aberta (camada flutuante no body) ficaria sem dono.
    fecharOrfaos();
  }

  /**
   * A janela mudou de tamanho. No painel embutido o iframe cresce quando um balão ou o popover do
   * filtro abre para baixo (e dispara `resize` dentro dele): redesenhar tudo fecharia a camada que
   * acabou de abrir. Só as abas dependem da largura; elas são refeitas quando muda quantas cabem, e
   * nada mais (as camadas se reposicionam sozinhas, `flutuante.ts`).
   */
  aoRedimensionar(): void {
    // O lateral não tem abas: nada nele depende da largura.
    if (this.destruido || this.d.modo === "lateral" || !this.dados.ativos.length) return;
    const limite = this.limiteAtual();
    if (limite === this.limiteAbas) return;
    this.desenharAbas(limite);
    fecharOrfaos();
    this.d.aoRedesenhar?.();
  }

  // ---------- dados ----------

  private agendar(): void {
    if (this.destruido) return;
    if (this.agendado) clearTimeout(this.agendado);
    this.agendado = setTimeout(() => {
      this.agendado = null;
      void this.recarregar()
        .then(() => this.render())
        .catch(() => undefined);
    }, 30);
  }

  private async recarregar(): Promise<void> {
    const hoje = this.d.hoje();
    this.dados = await carregarUnidade(this.d.repos, hoje);
    this.hojeDosDados = hoje;
    // Desmontado no meio da leitura (o lateral trocou de unidade): a contagem velha não vai para a aba.
    if (!this.destruido) this.d.aoContar?.(alertasDaUnidade(this.dados.ativos, hoje).atrasadas);
    if (this.projetoLateral && !this.dados.ativos.some((p) => p.projeto.id === this.projetoLateral)) this.projetoLateral = null;
    if (this.abertoAtual !== "todos" && !this.dados.ativos.some((p) => p.projeto.id === this.abertoAtual)) this.abertoAtual = "todos";
  }

  /** Virou o dia: relê (resumos e alertas dependem de hoje) e redesenha (a vista do projeto remonta). */
  private conferirDia(): void {
    // Já agendado: não adia (reagendar a cada conferida nunca deixaria a releitura acontecer).
    if (!this.destruido && !this.agendado && this.d.hoje() !== this.hojeDosDados) this.agendar();
  }

  private projeto(id: string): ProjetoNaTela | undefined {
    return this.dados.ativos.find((p) => p.projeto.id === id) ?? this.dados.arquivados.find((p) => p.projeto.id === id);
  }

  private projetoAberto(): ProjetoNaTela | undefined {
    return this.abertoAtual === "todos" ? undefined : this.dados.ativos.find((p) => p.projeto.id === this.abertoAtual);
  }

  private repoDe(vis: Vis): RepositorioProjetos {
    return this.d.repos[vis];
  }

  /**
   * A aba do SEI recarregou na mesma unidade (o lateral mantém o app pela carência) ou outra aba da mesma unidade
   * ficou na frente: a caixa pode ser outra, e o próximo diálogo relê os processos. Nada aberto é tocado (um diálogo
   * já aberto fica com a lista que leu).
   */
  aoVoltarAba(): void {
    this.processosMemo = null;
  }

  /** Processos da caixa (uma leitura por carga do app ou volta da aba; a que falhou não fica guardada). */
  private processos(): Promise<ProcessoDaCaixa[]> {
    this.processosMemo ??= this.d.rpc.chamar<ProcessoDaCaixa[]>("processosDaCaixa").catch(() => {
      this.processosMemo = null;
      return [];
    });
    return this.processosMemo;
  }

  private usuarios(): Promise<UsuarioDaUnidade[]> {
    this.usuariosMemo ??= this.d.rpc.chamar<UsuarioDaUnidade[]>("usuariosDaUnidade", undefined, 60_000).catch(() => {
      this.usuariosMemo = null;
      return [];
    });
    return this.usuariosMemo;
  }

  private conferirDocumento = (numero: string): Promise<DocumentoConferido | null> =>
    this.d.rpc.chamar<DocumentoConferido | null>("conferirDocumento", { numero }, 30_000);

  /**
   * Na memória já; no armazenamento em fila (ler-mesclar-gravar não corre em paralelo dentro do app).
   * A mudança em função é reaplicada sobre o que está gravado na hora de gravar: a aba aberta de outra
   * unidade (outra aba do navegador), a escala de outro projeto e o `recolhido` do content script não
   * se perdem.
   */
  private mudarPrefs(m: MudancaPrefs): void {
    this.prefs = normalizarPreferencias({ ...this.prefs, ...(typeof m === "function" ? m(this.prefs) : m) });
    const area = this.d.area;
    this.gravacao = this.gravacao
      .then(async () => gravarPreferencias(area, typeof m === "function" ? m(await lerPreferencias(area)) : m))
      .catch(() => undefined);
  }

  private lembrarAberto(id: string): MudancaPrefs {
    return (p) => ({ abertos: comChave(p.abertos, this.chaveAba, id) });
  }

  // ---------- desenho ----------

  /** Quantas abas de projeto cabem na largura de agora. */
  private limiteAtual(): number {
    return limiteDeAbas(this.d.largura?.() ?? this.d.raiz.ownerDocument.documentElement.clientWidth ?? 0);
  }

  private menuAjustes(): HTMLButtonElement {
    return criarMenuAjustes(() => ({
      mostrarLista: this.prefs.mostrarLista,
      moverDependentes: this.prefs.moverDependentes,
      ordemEtapas: this.prefs.ordemEtapas,
      arquivados: this.dados.arquivados.length,
      semProjetos: !this.dados.ativos.length,
      extensoes: this.d.extensoesMenu,
      aoMostrarLista: (v) => this.ajustar({ mostrarLista: v }),
      aoMoverDependentes: (v) => this.ajustar({ moverDependentes: v }),
      aoOrdenar: (o) => this.ajustar({ ordemEtapas: o }),
      aoExportar: () => void this.exportar().catch((e: unknown) => avisarErro(e)),
      aoImprimir: () => this.imprimir(),
      aoArquivados: () => this.abrirArquivados(),
    }));
  }

  /**
   * O estado da sincronia mudou (o P4 avisa a cada gravação): troca só o indicador ao lado das abas.
   * Balão, popover do filtro e menu abertos ficam; o próximo desenho já sai com o estado novo.
   */
  private atualizarSincronia(): void {
    if (this.destruido) return;
    this.slotTopo.querySelector(".prj-sinc")?.replaceWith(indicadorDeSincronia((this.d.sincronia ?? SEM_SINCRONIA).estado()));
  }

  /** A linha das abas (com o estado da sincronia e o menu): o resto da tela fica como está. */
  private desenharAbas(limite: number): void {
    this.limiteAbas = limite;
    this.slotTopo.replaceChildren(
      montarAbas({
        ativos: this.dados.ativos,
        aberto: this.abertoAtual,
        limite,
        sincronia: (this.d.sincronia ?? SEM_SINCRONIA).estado(),
        menu: this.menuAjustes(),
        aoEscolher: (id) => this.escolher(id),
        aoNovo: () => this.novoProjeto(false),
      }),
    );
  }

  private render(): void {
    if (this.destruido) return;
    if (this.d.modo === "lateral") {
      this.renderLateral();
      return;
    }
    const reabrir = this.balaoParaReabrir();
    this.balao?.fechar();
    if (!this.dados.ativos.length) {
      const sinc = (this.d.sincronia ?? SEM_SINCRONIA).estado();
      const menu = this.menuAjustes();
      this.descartarVista();
      this.filtro?.fechar();
      this.slotTopo.replaceChildren(
        h("div", { class: "prj-abas prj-abas-vazio" }, h("div", { class: "prj-abas-dir" }, indicadorDeSincronia(sinc), menu)),
      );
      this.cartao.hidden = true;
      this.slotVazio.replaceChildren(
        montarVazio({
          aoCriar: () => this.novoProjeto(false),
          aoModelo: () => this.novoProjeto(true),
          aoImportar: this.d.ctx.atividades ? this.d.importarAtividades : undefined,
        }),
      );
      this.depoisDeDesenhar();
      return;
    }
    this.slotVazio.replaceChildren();
    this.cartao.hidden = false;
    this.desenharAbas(this.limiteAtual());
    const p = this.projetoAberto();
    this.filtro?.fechar();
    this.filtro = criarBotaoFiltro({
      filtro: this.prefs.filtro,
      etapas: p ? p.etapas : this.dados.ativos.flatMap((x) => x.etapas),
      fases: p?.fases,
      hoje: this.d.hoje(),
      aoMudar: (f) => this.mudarFiltro(f),
    });
    const vista = this.semGantt ? "lista" : this.prefs.vista;
    const escala = p ? escalaDoProjeto(this.prefs, p.projeto.id) : this.prefs.escalaTodos;
    this.slotCab.replaceChildren(
      montarCabecalho({
        modo: p ? "projeto" : "todos",
        projeto: p,
        totais: { ativos: this.dados.ativos.length, arquivados: this.dados.arquivados.length },
        vista,
        escala,
        filtro: this.filtro.el,
        aoVista: (v) => {
          if (v === "gantt") this.semGantt = false;
          this.ajustar({ vista: v });
        },
        aoEscala: (e) => this.mudarEscala(e),
        aoHoje: () => this.vista?.rolarParaHoje(),
        aoPrimario: () => (p ? this.novaEtapa(p.projeto.id) : this.novoProjeto(false)),
        aoEditarProjeto: () => p && this.editarProjeto(p.projeto.id),
        aoAbrirProcesso: (ev) => p?.projeto.processo && this.abrirProcesso(p.projeto.processo, ev),
      }),
    );
    this.pintarCorpo();
    this.depoisDeDesenhar();
    if (reabrir) this.reabrirBalao(reabrir);
  }

  /** O balão aberto agora (etapa e o controle com o foco, pela posição), para reabrir depois do redesenho. */
  private balaoParaReabrir(): { projeto: string; etapa: string; foco: number } | null {
    if (!this.balao || !this.balaoDe) return null;
    const ativo = this.balao.el.ownerDocument.activeElement;
    return { ...this.balaoDe, foco: ativo ? controlesDe(this.balao.el).indexOf(ativo as HTMLElement) : -1 };
  }

  /**
   * O redesenho trocou as linhas (a âncora saiu da tela). Se a etapa ainda está no projeto aberto e
   * na tela, o balão reabre nela, com o dado novo; o foco volta ao mesmo controle (a régua, pelo
   * teclado) e, se estava fora do balão, fica onde está.
   */
  private reabrirBalao(r: { projeto: string; etapa: string; foco: number }): void {
    const p = this.projetoAberto();
    if (!p || p.projeto.id !== r.projeto || !p.etapas.some((e) => e.id === r.etapa)) return;
    const alvo = this.alvoDaEtapa(r.etapa);
    if (alvo) this.abrirBalao(r.projeto, r.etapa, alvo, (el) => (r.foco >= 0 ? (controlesDe(el)[r.foco] ?? null) : null));
  }

  /** A linha da lista (ou da tabela) da etapa; sem a lista, a barra do Gantt. */
  private alvoDaEtapa(id: string): Element | undefined {
    const comId = [...this.corpo.querySelectorAll("[data-id]")].filter((el) => el.getAttribute("data-id") === id);
    return comId.find((el) => !el.classList.contains("bar-wrapper")) ?? comId[0];
  }

  private depoisDeDesenhar(): void {
    fecharOrfaos();
    this.d.aoRedesenhar?.();
  }

  private descartarVista(): void {
    this.vista?.destruir();
    this.vista = null;
    this.chaveVista = "";
  }

  private semResultado(texto: string): void {
    this.descartarVista();
    this.corpo.replaceChildren(
      h(
        "div",
        { class: "prj-nada" },
        h("p", {}, texto),
        h("button", { type: "button", class: "spro-botao pequeno", onclick: () => this.mudarFiltro(FILTRO_VAZIO) }, "Limpar filtro"),
      ),
    );
  }

  /** O filtro que vale no projeto (ou no Todos, sem `p`): as fases de outro projeto não contam. */
  private filtroDe(p?: Pick<ProjetoNaTela, "fases">): FiltroEtapas {
    return filtroNoContexto(this.prefs.filtro, p?.fases);
  }

  /** Ids das etapas que passam no filtro (undefined = sem filtro). */
  private visiveis(p: ProjetoNaTela): Set<string> | undefined {
    const f = this.filtroDe(p);
    if (!criteriosAtivos(f)) return undefined;
    return new Set(filtrarEtapas(p.etapas, f, this.d.hoje(), this.eu).map((e) => e.id));
  }

  /**
   * As tabelas da vista Lista (etapas do projeto e projetos do "Todos") rolam por dentro: altura de até 520 px, cabeçalho
   * fixo e uma alça no fim para mudar a altura (@comum/ui/alturaRedimensionavel). Uma preferência só para as duas.
   * O Gantt tem a própria rolagem e o painel lateral já rola: ficam como estavam.
   */
  private comAltura(tabela: HTMLElement): HTMLElement {
    if (this.d.modo === "lateral") return tabela;
    const rolagem = h("div", { class: "prj-tabela-rolagem" }, tabela);
    const controle = alturaRedimensionavel({
      rolagem,
      chave: "projetos-lista",
      padraoPx: 520,
      area: this.d.area,
      rotulo: "Redimensionar a altura da lista",
      aoMudar: () => this.d.aoRedesenhar?.(),
    });
    return h("div", { class: "prj-tabela-lugar" }, rolagem, controle.alca);
  }

  private pintarCorpo(): void {
    if (this.destruido) return;
    const hoje = this.d.hoje();
    const vista = this.semGantt ? "lista" : this.prefs.vista;
    const p = this.projetoAberto();
    if (p) {
      const visiveis = this.visiveis(p);
      if (visiveis && !visiveis.size && p.etapas.length) {
        this.semResultado("Nenhuma etapa nesse filtro.");
        return;
      }
      const base = { projeto: p.projeto.id, fases: p.fases, etapas: p.etapas };
      if (vista === "lista") {
        // A tabela agrupa por fase sem recolher: o recolhido é da coluna do Gantt.
        this.descartarVista();
        this.corpo.replaceChildren(
          this.comAltura(
            montarTabelaEtapas(linhasDoProjeto(base, { hoje, ordem: this.prefs.ordemEtapas, recolhidas: new Set(), visiveis }), {
              hoje,
              aoClicar: (id, ancora) => this.abrirBalao(p.projeto.id, id, ancora),
            }),
          ),
        );
        return;
      }
      const dados = {
        linhas: linhasDoProjeto(base, { hoje, ordem: this.prefs.ordemEtapas, recolhidas: new Set(this.prefs.recolhidas), visiveis }),
        mostrarLista: this.prefs.mostrarLista,
        escala: escalaDoProjeto(this.prefs, p.projeto.id),
        hoje,
        moverDependentes: this.prefs.moverDependentes,
      };
      // O dia entra na chave: a vista do projeto não troca o "hoje" da Frappe ao atualizar, remonta.
      const chave = `p:${p.projeto.id}|${hoje}`;
      if (this.vista instanceof VistaProjeto && this.chaveVista === chave && this.corpo.contains(this.vista.el))
        this.vista.atualizar(dados);
      else {
        this.descartarVista();
        const id = p.projeto.id;
        // A falha da Frappe pode chegar aqui dentro, no construtor: `falhouGantt` só troca para a Lista depois.
        this.vista = new VistaProjeto(dados, {
          montarGantt: this.d.montarGantt,
          aoClicarEtapa: (etapa, ancora) => this.abrirBalao(id, etapa, ancora),
          aoAlternarFase: (f) => this.alternarFase(f),
          aoAdicionar: (nome) => this.adicionarEtapa(id, nome),
          validar: (m) => this.validarArraste(id, m),
          aoMudarDatas: (m) => void this.moverDatas(id, m),
          aoRecusar: (msg) => avisar(msg),
          aoFalharGantt: () => this.falhouGantt(),
        });
        this.chaveVista = chave;
        this.corpo.replaceChildren(this.vista.el);
      }
      if (this.focarNova && this.vista instanceof VistaProjeto) {
        this.focarNova = false;
        this.vista.focarNova();
      }
      return;
    }
    const filtroTodos = this.filtroDe();
    const itens = this.dados.ativos.filter((x) => projetoNoFiltro(x, filtroTodos, hoje, this.eu));
    if (!itens.length) {
      this.semResultado("Nenhum projeto com etapas nesse filtro.");
      return;
    }
    if (vista === "lista") {
      this.descartarVista();
      this.corpo.replaceChildren(this.comAltura(montarTabelaProjetos(itens, { aoAbrir: (id) => this.escolher(id) })));
      return;
    }
    const dados = { itens, mostrarLista: this.prefs.mostrarLista, escala: this.prefs.escalaTodos, hoje };
    if (this.vista instanceof VistaTodos && this.chaveVista === "todos" && this.corpo.contains(this.vista.el)) this.vista.atualizar(dados);
    else {
      this.descartarVista();
      this.vista = new VistaTodos(dados, {
        montarGantt: this.d.montarGantt,
        aoAbrir: (id) => this.escolher(id),
        aoFalharGantt: () => this.falhouGantt(),
      });
      this.chaveVista = "todos";
      this.corpo.replaceChildren(this.vista.el);
    }
  }

  /**
   * Spec 9: a Frappe não montou; a vista Lista assume, com um aviso discreto, e fica até o usuário
   * escolher "Gantt" de novo (nenhum redesenho tenta a Frappe outra vez). A troca é adiada: a falha
   * pode chegar de dentro do construtor da vista, antes de ela ir para a tela.
   */
  private falhouGantt(): void {
    if (this.semGantt) return;
    this.semGantt = true;
    avisar("O Gantt não abriu neste navegador; mostrando a lista.");
    queueMicrotask(() => this.render());
  }

  // ---------- navegação e preferências ----------

  private escolher(id: string): void {
    // No lateral, abrir um projeto (criado, duplicado, recebido, importado) é o mini-Gantt dele.
    if (this.d.modo === "lateral") {
      this.focarNoLateral(id);
      return;
    }
    this.abertoAtual = id;
    this.mudarPrefs(this.lembrarAberto(id));
    this.render();
  }

  private ajustar(parcial: Partial<Preferencias>): void {
    this.mudarPrefs(parcial);
    this.render();
  }

  private mudarEscala(e: Preferencias["escalaTodos"]): void {
    const p = this.projetoAberto();
    if (p) {
      const id = p.projeto.id;
      this.mudarPrefs((x) => ({ escalas: comChave(x.escalas, id, e) }));
    } else this.mudarPrefs({ escalaTodos: e });
    this.render();
    if (p && !escalaEditavel(e)) avisar("Nesta escala as datas ficam só para leitura: arraste em Dia ou Semana.", undefined, 5000);
  }

  private mudarFiltro(f: FiltroEtapas): void {
    this.mudarPrefs({ filtro: f });
    this.filtro?.definir(this.prefs.filtro);
    this.pintarCorpo();
    this.d.aoRedesenhar?.();
  }

  private alternarFase(faseId: string): void {
    const recolher = !this.prefs.recolhidas.includes(faseId);
    this.mudarPrefs((p) => ({ recolhidas: comItem(p.recolhidas, faseId, recolher) }));
    this.pintarCorpo();
    this.d.aoRedesenhar?.();
  }

  /** Pílula do título do painel (pela aba): abre o projeto se só um tem o alerta; senão o Todos filtrado. */
  aplicarAlerta(tipo: TipoAlerta): void {
    const al = alertasDaUnidade(this.dados.ativos, this.d.hoje());
    const ids = tipo === "atrasadas" ? al.comAtraso : al.comSemana;
    const aberto = ids.length === 1 ? (ids[0] ?? "todos") : "todos";
    this.abertoAtual = aberto;
    const filtro: FiltroEtapas = { ...FILTRO_VAZIO, situacoes: [tipo === "atrasadas" ? "atrasadas" : "semana"] };
    // Decidido agora: a função é reaplicada na gravação, quando `this.prefs.vista` já mudou.
    const paraGantt: Partial<Preferencias> = this.prefs.vista === "lista" ? { vista: "gantt" } : {};
    this.mudarPrefs((p) => ({ filtro, abertos: comChave(p.abertos, this.chaveAba, aberto), ...paraGantt }));
    this.render();
  }

  /** P4 (diálogo Modelos de projeto): o "Novo projeto" já no modelo escolhido. */
  novoProjetoDeModelo(id: string): void {
    this.novoProjeto(true, id);
  }

  /** P4 (receber, importar): relê (a gravação acabou de acontecer) e abre o projeto, se ele está ativo. */
  async abrirProjeto(id: string): Promise<void> {
    await this.recarregar();
    if (this.destruido) return;
    if (this.dados.ativos.some((p) => p.projeto.id === id)) this.escolher(id);
    else this.render();
  }

  /** "Abrir no painel" (P5: caixa, árvore, lateral): o projeto e, se vier, o balão da etapa. */
  focarProjeto(id: string, etapa?: string): boolean {
    if (this.d.modo === "lateral") return this.focarNoLateral(id, etapa);
    const p = this.dados.ativos.find((x) => x.projeto.id === id);
    if (!p) return false;
    const e = etapa ? p.etapas.find((x) => x.id === etapa) : undefined;
    // A etapa pedida tem de aparecer: sai o filtro que a esconde e abre a fase dela.
    if (e && this.visiveis(p)?.has(e.id) === false) this.mudarPrefs({ filtro: FILTRO_VAZIO });
    const fase = e?.fase;
    if (fase && this.prefs.recolhidas.includes(fase)) this.mudarPrefs((x) => ({ recolhidas: comItem(x.recolhidas, fase, false) }));
    this.escolher(id);
    // A linha da lista (ou da tabela); sem a lista, a barra; sem nada medido, o próprio corpo.
    if (e) this.abrirBalao(id, e.id, this.alvoDaEtapa(e.id) ?? this.corpo);
    return true;
  }

  // ---------- painel lateral (P5) ----------

  /**
   * O lateral: o topo (Agenda | Projetos, a unidade, a sincronia, "+" e o menu) e a Agenda, os cartões
   * dos projetos ou o mini-Gantt do aberto. Um balão aberto volta depois do redesenho (a régua do
   * progresso, uma gravação de outro computador), já com os dados novos e na linha nova. O foco que
   * estava num controle do lateral volta ao mesmo controle (`data-foco`), ou vai aonde a navegação pediu.
   */
  private renderLateral(): void {
    // Antes de fechar o balão: fechar devolve o foco à linha de onde ele abriu.
    const ativo = this.d.raiz.ownerDocument.activeElement;
    const manter = ativo && this.d.raiz.contains(ativo) ? ativo.getAttribute("data-foco") : null;
    const reabrir = this.balaoParaReabrir();
    this.balao?.fechar();
    this.cartao.hidden = true;
    const modo: ModoLateral = this.prefs.modoLateral;
    this.slotTopo.replaceChildren(
      topoDoLateral({
        modo,
        sigla: this.sigla(),
        sincronia: (this.d.sincronia ?? SEM_SINCRONIA).estado(),
        menu: this.menuLateral(),
        aoModo: (m) => {
          this.projetoLateral = null;
          this.ajustar({ modoLateral: m });
        },
        aoNovo: () => this.novoProjeto(false),
      }),
    );
    const hoje = this.d.hoje();
    const p = this.projetoLateral ? this.dados.ativos.find((x) => x.projeto.id === this.projetoLateral) : undefined;
    if (!this.dados.ativos.length)
      this.slotVazio.replaceChildren(
        montarVazio({
          aoCriar: () => this.novoProjeto(false),
          aoModelo: () => this.novoProjeto(true),
          aoImportar: this.d.ctx.atividades ? this.d.importarAtividades : undefined,
        }),
      );
    else if (modo === "agenda")
      this.slotVazio.replaceChildren(
        montarAgenda({
          grupos: agendaDaUnidade(this.dados.ativos, hoje, { soMinhas: this.prefs.soMinhas, eu: this.eu }),
          soMinhas: this.prefs.soMinhas,
          aberta: this.cartaoAberto,
          aoSoMinhas: (v) => this.ajustar({ soMinhas: v }),
          aoAlternar: (id) => {
            this.cartaoAberto = this.cartaoAberto === id ? null : id;
            this.render();
          },
          // O mesmo concluir do painel: relê antes (não conclui de novo) e grava pelo repositório que pede o "Entendi".
          aoConcluir: (i) => void this.concluir(i.projeto, i.etapa).catch((e) => avisarErro(e)),
          aoEditar: (i) => this.dialogoEtapa(i.projeto, i.etapa),
          aoVer: (i) => this.focarNoLateral(i.projeto.projeto.id, i.etapa.id),
        }),
      );
    else if (p)
      this.slotVazio.replaceChildren(
        montarMiniGantt({
          projeto: p,
          hoje,
          ordem: this.prefs.ordemEtapas,
          aoVoltar: () => {
            this.focoLateral = focoDoProjeto(p.projeto.id);
            this.projetoLateral = null;
            this.render();
          },
          aoAbrirNoPainel: () => this.abrirNoPainel(p.projeto.id),
          aoEtapa: (id, ancora) => this.abrirBalao(p.projeto.id, id, ancora),
        }),
      );
    else
      this.slotVazio.replaceChildren(
        montarProjetosLateral({
          ativos: this.dados.ativos,
          hoje,
          aoAbrir: (id) => {
            this.projetoLateral = id;
            this.focoLateral = FOCO_TITULO;
            this.render();
          },
        }),
      );
    // Como no painel (reabrirBalao): a etapa ainda na tela, o balão volta nela, com o foco no mesmo controle.
    const alvo = reabrir ? this.linhaDoLateral(reabrir.etapa) : null;
    if (reabrir && alvo)
      this.abrirBalao(reabrir.projeto, reabrir.etapa, alvo, (el) => (reabrir.foco >= 0 ? (controlesDe(el)[reabrir.foco] ?? null) : null));
    const pedido = this.focoLateral;
    this.focoLateral = null;
    // O controle que saiu da tela (o cartão da etapa concluída): o foco vai ao modo de agora, não se perde.
    if (pedido || manter)
      (this.controleDoLateral(pedido ?? manter ?? "") ?? this.controleDoLateral(`modo:${modo}`))?.focus?.({ preventScroll: true });
    this.depoisDeDesenhar();
  }

  /** O controle do lateral com esta chave de foco (sem montar seletor com o id). */
  private controleDoLateral(chave: string): HTMLElement | undefined {
    return [...this.d.raiz.querySelectorAll<HTMLElement>("[data-foco]")].find((el) => el.getAttribute("data-foco") === chave);
  }

  /**
   * O menu do lateral (decisão 17), curto: Sincronização e Modelos (P4), os arquivados, a planilha de todos os
   * projetos, Enviar/Receber/Importar (P4) e o Histórico. Sem imprimir nem os marcáveis do Gantt (ficam no painel).
   */
  private menuLateral(): HTMLButtonElement {
    const menu = criarMenu({
      rotulo: "Ajustes dos projetos",
      icone: "ajustes",
      largura: 260,
      itens: () => {
        const ext = this.d.extensoesMenu ?? {};
        const semProjetos = !this.dados.ativos.length;
        return [
          ...(ext.sincronia?.() ?? []),
          this.dados.arquivados.length
            ? {
                rotulo: "Projetos arquivados",
                icone: "pasta",
                dica: String(this.dados.arquivados.length),
                fazer: () => this.abrirArquivados(),
              }
            : null,
          "-",
          semProjetos
            ? null
            : {
                rotulo: "Exportar planilha (CSV)",
                icone: "planilha",
                fazer: () => void this.exportar().catch((e: unknown) => avisarErro(e)),
              },
          ...(ext.arquivo?.({ semProjetos }) ?? []),
          "-",
          ...(ext.fim?.() ?? []),
        ];
      },
    });
    menu.setAttribute("data-foco", "menu");
    return menu;
  }

  /** A linha do mini-Gantt de uma etapa (âncora do balão). */
  private linhaDoLateral(etapa: string): Element | null {
    return [...this.slotVazio.querySelectorAll(".prj-mg-linha")].find((el) => el.getAttribute("data-id") === etapa) ?? null;
  }

  /**
   * "Ver no projeto", o projeto criado ou recebido e o "Abrir no painel" que vem da caixa ou da árvore: o
   * mini-Gantt do projeto e o balão da etapa (sem etapa, o foco vai ao nome do projeto).
   */
  private focarNoLateral(id: string, etapa?: string): boolean {
    const p = this.dados.ativos.find((x) => x.projeto.id === id);
    if (!p) return false;
    this.projetoLateral = id;
    this.cartaoAberto = null;
    const e = etapa ? p.etapas.find((x) => x.id === etapa) : undefined;
    if (!e) this.focoLateral = FOCO_TITULO;
    if (this.prefs.modoLateral !== "projetos") this.mudarPrefs({ modoLateral: "projetos" });
    this.render();
    const alvo = e ? this.linhaDoLateral(e.id) : null;
    if (e && alvo) this.abrirBalao(id, e.id, alvo);
    return true;
  }

  /** "Abrir no painel" do lateral: a aba do SEI rola até o painel no Controle de Processos (ou vai até ele) e abre o projeto. */
  private abrirNoPainel(id: string): void {
    void this.d.rpc
      .chamar<string>("focarNoPainel", { id }, 15_000)
      .then((r) => {
        if (r === "navegou") avisar("Abrindo o Controle de Processos no projeto…");
      })
      .catch((e) => avisarErro(e));
  }

  // ---------- projetos ----------

  private sigla(): string {
    return this.d.ctx.unidade?.sigla || "unidade";
  }

  /** `modeloId` (P4, diálogo Modelos): já em "De um modelo", com ele escolhido (o primeiro da lista). */
  private novoProjeto(deModelo: boolean, modeloId?: string): void {
    const modelos = modeloId
      ? [...this.dados.modelos].sort((a, b) => Number(b.id === modeloId) - Number(a.id === modeloId))
      : this.dados.modelos;
    abrirDialogoProjeto({
      abrirModal: this.d.abrirModal,
      hoje: this.d.hoje(),
      sigla: this.sigla(),
      modelos,
      comecarDeModelo: deModelo || modeloId !== undefined,
      processos: () => this.processos(),
      salvar: async (r) => {
        const repo = this.repoDe(r.vis);
        const dados = { nome: r.nome, processo: r.processo };
        const novo = r.modelo ? await repo.criarProjetoDeModelo(dados, r.modelo.modelo, r.modelo.inicio) : await repo.criarProjeto(dados);
        await this.recarregar();
        this.escolher(novo.id);
      },
    });
  }

  private editarProjeto(id: string): void {
    const p = this.projeto(id);
    if (!p) return;
    const repo = this.repoDe(p.vis);
    const nome = p.projeto.nome;
    // As ações que falham deixam o diálogo aberto com a mensagem (o diálogo mostra o erro).
    abrirDialogoProjeto({
      abrirModal: this.d.abrirModal,
      hoje: this.d.hoje(),
      sigla: this.sigla(),
      projeto: p,
      modelos: this.dados.modelos,
      processos: () => this.processos(),
      salvar: (r) => this.salvarProjeto(p, r),
      arquivar: async () => {
        await repo.arquivarProjeto(id);
        if (this.destruido) return;
        avisar(`Projeto “${nome}” arquivado.`, {
          rotulo: "Desfazer",
          fazer: () => void repo.reativarProjeto(id).catch((e) => avisarErro(e)),
        });
      },
      reativar: async () => {
        await repo.reativarProjeto(id);
      },
      duplicar: async () => {
        const copia = await repo.duplicarProjeto(id);
        await this.recarregar();
        this.escolher(copia.id);
      },
      salvarComoModelo: () =>
        pedirNomeDoModelo({
          abrirModal: this.d.abrirModal,
          sugestao: nome,
          salvar: async (n) => {
            const m = await repo.salvarComoModelo(id, n);
            avisar(`Modelo “${m.nome}” salvo.`);
          },
        }),
      redefinirPlano: () => this.redefinirPlano(p),
      excluir: () => this.excluirProjeto(p),
    });
  }

  /**
   * "Redefinir plano original" (spec 5.4): confirma e iguala o plano das etapas replanejadas às datas
   * atuais. Sem "Desfazer": o repositório não regrava o plano antigo (a confirmação é a guarda).
   * Desistir devolve `false`: o diálogo fica.
   */
  private async redefinirPlano(p: ProjetoNaTela): Promise<boolean> {
    const n = p.etapas.filter(planoParaRedefinir).length;
    const texto = `Redefinir o plano original de “${p.projeto.nome}”? As datas atuais de ${plural(n, "etapa replanejada", "etapas replanejadas")} passam a ser o plano.`;
    if (!(await this.d.confirmar(texto, "Redefinir"))) return false;
    const feitas = await this.repoDe(p.vis).redefinirPlanoOriginal(p.projeto.id);
    avisar(`Plano original redefinido em ${plural(feitas, "etapa", "etapas")}.`);
    return true;
  }

  /** O aviso do impacto de mudar "Quem vê" (spec 6.2). */
  private textoQuemVe(nome: string, destino: Vis): string {
    const sigla = this.sigla();
    return destino === "unidade"
      ? `“${nome}” vai ficar visível para toda a unidade (${sigla}): quem usa o SEI Pro nela vê e edita.`
      : `“${nome}” vai sair de “${rotuloDaVis("unidade")}” e ficar só para você, nesta unidade: quem usa o SEI Pro na ${sigla} deixa de ver.`;
  }

  /**
   * Salva nome e processo (ausente = tirar). Se "Quem vê" mudou: valida, confirma o impacto ANTES de gravar
   * qualquer coisa, leva o projeto para o outro escopo e só então edita, já no destino. Assim sair de "Toda a
   * unidade" não pede o "Entendi" (nela só fica a lápide da saída, que não pergunta), e entrar nela pergunta
   * uma vez, antes da primeira gravação: recusar não deixa nada pela metade. Desistir devolve `false`: o
   * diálogo fica.
   *
   * Se a edição no destino falha depois de mover, o erro diz que o projeto já mudou; o diálogo continua aberto
   * (com o escopo antigo) e salvar de novo acha o projeto já no destino: não confirma nem move outra vez, só edita.
   */
  private async salvarProjeto(p: ProjetoNaTela, r: ResultadoProjeto): Promise<boolean> {
    const id = p.projeto.id;
    const mudancas = { nome: r.nome, processo: r.processo };
    if (r.vis === p.vis) {
      await this.repoDe(p.vis).editarProjeto(id, mudancas);
      return true;
    }
    const problemas = problemasDoProjeto({ nome: nomeLimpo(r.nome), etiquetas: p.projeto.etiquetas });
    if (problemas.length) throw new ErroValidacao(problemas);
    const origem = this.repoDe(p.vis);
    const destino = this.repoDe(r.vis);
    const jaMovido = !(await origem.obterProjeto(id)) && !!(await destino.obterProjeto(id));
    if (!jaMovido) {
      if (!(await this.d.confirmar(this.textoQuemVe(r.nome, r.vis), "Mudar"))) return false;
      await moverEntreEscopos(origem, destino, id);
    }
    try {
      await destino.editarProjeto(id, mudancas);
    } catch (e) {
      if (e instanceof CanceladoNaTroca) throw e;
      const motivo = mensagem(e);
      throw new ErroValidacao([
        `O projeto já está em “${rotuloDaVis(r.vis)}”, mas o nome e o processo novos não foram salvos: ${/[.!?]$/.test(motivo) ? motivo : `${motivo}.`} Salve de novo.`,
      ]);
    }
    return true;
  }

  /** Confirma (com o número de etapas) e exclui com "Desfazer". Desistir devolve `false`. */
  private async excluirProjeto(p: ProjetoNaTela): Promise<boolean> {
    const n = p.etapas.length;
    const texto = `Excluir o projeto “${p.projeto.nome}”${n ? ` e ${plural(n, "etapa", "etapas")}` : ""}?`;
    if (!(await this.d.confirmar(texto, "Excluir"))) return false;
    const repo = this.repoDe(p.vis);
    await repo.removerProjeto(p.projeto.id);
    if (this.destruido) return true;
    avisar(`Projeto “${p.projeto.nome}” excluído.`, {
      rotulo: "Desfazer",
      fazer: () => void repo.restaurarProjeto(p.projeto.id).catch((e) => avisarErro(e)),
    });
    return true;
  }

  private abrirArquivados(): void {
    abrirArquivados({
      abrirModal: this.d.abrirModal,
      arquivados: this.dados.arquivados,
      reativar: async (id) => {
        const p = this.projeto(id);
        if (p) await this.repoDe(p.vis).reativarProjeto(id);
      },
      // O diálogo apaga direto: a confirmação (e o "Desfazer") vem daqui.
      excluir: async (id) => {
        const p = this.projeto(id);
        return p ? this.excluirProjeto(p) : true;
      },
    });
  }

  // ---------- etapas ----------

  private etiquetasEmUso(): string[] {
    return [...new Set(this.dados.ativos.flatMap((p) => [...p.projeto.etiquetas, ...p.etapas.flatMap((e) => e.etiquetas)]))];
  }

  private dialogoEtapa(p: ProjetoNaTela, etapa?: Etapa, secao?: "historico"): void {
    const repo = this.repoDe(p.vis);
    abrirDialogoEtapa({
      abrirModal: this.d.abrirModal,
      projeto: p,
      etapa,
      inicial: etapa ? undefined : datasDaEtapaNova(p.etapas, this.d.hoje()),
      hoje: this.d.hoje(),
      agora: this.d.agora(),
      usuarios: () => this.usuarios(),
      processos: () => this.processos(),
      etiquetas: this.etiquetasEmUso(),
      historico: () => repo.historico(p.projeto.id),
      conferirDocumento: this.conferirDocumento,
      secaoAberta: secao,
      salvar: (r) => this.salvarEtapa(p, r, etapa),
      excluir: etapa ? () => this.excluirEtapa(p, etapa) : undefined,
    });
  }

  private novaEtapa(projetoId: string): void {
    const p = this.projeto(projetoId);
    if (p) this.dialogoEtapa(p);
  }

  private async salvarEtapa(p: ProjetoNaTela, r: ResultadoEtapa, etapa?: Etapa): Promise<void> {
    const repo = this.repoDe(p.vis);
    const fase = r.novaFase ? (await repo.criarFase(p.projeto.id, r.novaFase)).id : r.fase;
    const campos = mudancasDoDialogo(r, fase, etapa, new Set(p.etapas.map((e) => e.id)));
    if (etapa) await repo.editarEtapa(etapa.id, campos, this.d.hoje());
    else await repo.criarEtapa({ projeto: p.projeto.id, ...campos });
  }

  /** "Adicionar etapa… (Enter)": `true` quando gravou (a vista limpa o campo); senão avisa e o texto fica. */
  private async adicionarEtapa(projetoId: string, nome: string): Promise<boolean> {
    const p = this.projeto(projetoId);
    if (!p) return false;
    try {
      this.focarNova = true;
      await this.repoDe(p.vis).criarEtapa({ projeto: projetoId, nome, ...datasDaEtapaNova(p.etapas, this.d.hoje()) });
      return true;
    } catch (e) {
      this.focarNova = false;
      avisarErro(e);
      return false;
    }
  }

  private abrirBalao(projetoId: string, etapaId: string, ancora: Element, foco?: OpcoesBalao["foco"]): void {
    const p = this.projeto(projetoId);
    const e = p?.etapas.find((x) => x.id === etapaId);
    if (!p || !e) return;
    const repo = this.repoDe(p.vis);
    const hoje = this.d.hoje();
    const tentar = (f: () => Promise<unknown>) => void f().catch((erro) => avisarErro(erro));
    this.balao?.fechar();
    const camada: Camada = abrirBalaoEtapa(
      ancora,
      { etapa: e, projeto: p, hoje },
      {
        aoConcluir: () => tentar(() => this.concluir(p, e)),
        aoReabrir: () =>
          tentar(async () => {
            const atual = await repo.obterEtapa(e.id);
            if (!atual?.concluidaEm) return;
            await repo.reabrirEtapa(e.id);
            avisar(`“${atual.nome}” reaberta.`);
          }),
        aoEditar: (s) => this.dialogoEtapa(p, e, s),
        aoProgresso: (n) => {
          if (!Number.isFinite(n)) return;
          tentar(() => repo.editarEtapa(e.id, { progresso: Math.max(0, Math.min(100, Math.round(n))) }, hoje));
        },
        aoAbrirDocumento: (numero) => tentar(() => this.d.rpc.chamar("abrirDocumento", { numero })),
        aoAbrirProcesso: (v, ev) => this.abrirProcesso(v, ev),
        // A cópia grava como cópia (o vínculo copiado, talvez de um colega, não é marcar aqui).
        aoDuplicar: () =>
          tentar(async () => {
            await repo.duplicarEtapa(e.id);
            avisar("Etapa duplicada.");
          }),
        aoMoverFase: (f) => tentar(() => repo.editarEtapa(e.id, { fase: f }, hoje)),
        aoExcluir: () => tentar(() => this.excluirEtapa(p, e)),
      },
      () => {
        if (this.balao !== camada) return;
        this.balao = null;
        this.balaoDe = null;
      },
      { foco },
    );
    this.balao = camada;
    this.balaoDe = { projeto: projetoId, etapa: etapaId };
  }

  /**
   * Concluir com 1 clique (data de hoje) + aviso "Informar documento" | "Desfazer". A etapa é relida
   * antes: se já está concluída (outro computador, outra aba), não conclui de novo (a data mudaria).
   */
  private async concluir(p: ProjetoNaTela, e: Etapa): Promise<void> {
    const repo = this.repoDe(p.vis);
    const hoje = this.d.hoje();
    const atual = await repo.obterEtapa(e.id);
    if (!atual || atual.concluidaEm) return;
    await repo.concluirEtapa(e.id, hoje);
    // Desmontado no meio (o lateral trocou de unidade): o "Desfazer" não fica na tela da unidade nova.
    if (this.destruido) return;
    avisar(`“${atual.nome}” ${atual.marco ? "cumprido" : "concluída"} hoje (${dataCurta(hoje)}).`, [
      { rotulo: "Informar documento", fazer: () => void this.informarDocumento(repo, e.id).catch((x) => avisarErro(x)) },
      { rotulo: "Desfazer", fazer: () => void this.desfazerConclusao(repo, e.id, hoje).catch((x) => avisarErro(x)) },
    ]);
  }

  /** O documento que comprova a conclusão: troca o número e a data sem reabrir (só de etapa ainda concluída). */
  private async informarDocumento(repo: RepositorioProjetos, id: string): Promise<void> {
    const viva = await repo.obterEtapa(id);
    if (!viva) return avisar("A etapa não existe mais.");
    if (!viva.concluidaEm) return avisar(`“${viva.nome}” não está mais concluída.`);
    abrirInformarDocumento({
      abrirModal: this.d.abrirModal,
      etapa: viva,
      hoje: this.d.hoje(),
      conferirDocumento: this.conferirDocumento,
      salvar: async (numero, data) => {
        const atual = await repo.obterEtapa(id);
        if (!atual) throw new ErroValidacao(["A etapa não existe mais."]);
        if (!atual.concluidaEm) throw new ErroValidacao([`“${atual.nome}” não está mais concluída.`]);
        // Campo vazio tira o documento (`null`), salvo o marcador do texto (documento de processo sigiloso cujo
        // número este computador não tem): fica, para não apagar o número de quem o tem. O mesmo número guarda o
        // título já conferido.
        const vazio = documentoSemNumero(atual.documento) ? atual.documento : null;
        await repo.concluirEtapa(id, data, numero ? (numero === atual.documento?.numero ? atual.documento : { numero }) : vazio);
      },
    });
  }

  /** "Desfazer" do aviso: só reabre se a conclusão ainda é a de hoje (alguém pode ter mexido no meio). */
  private async desfazerConclusao(repo: RepositorioProjetos, id: string, hoje: DataISO): Promise<void> {
    const viva = await repo.obterEtapa(id);
    if (viva?.concluidaEm === hoje) await repo.reabrirEtapa(id);
  }

  private async excluirEtapa(p: ProjetoNaTela, e: Etapa): Promise<void> {
    const repo = this.repoDe(p.vis);
    await repo.removerEtapa(e.id);
    if (this.destruido) return;
    avisar(`Etapa “${e.nome}” excluída.`, {
      rotulo: "Desfazer",
      fazer: () => void repo.restaurarEtapa(e.id).catch((x) => avisarErro(x)),
    });
  }

  /** O lote do arraste com as dependentes (preferência "mover dependentes"), contado sobre TODAS as etapas do projeto. */
  private completar(p: ProjetoNaTela, m: MudancaDeDatas[]): MudancaDeDatas[] {
    return this.prefs.moverDependentes ? completarComDependentes(p.etapas, m) : m;
  }

  /** Recusa antes de gravar exatamente o que o `moverDatas` do repositório recusaria (violação NOVA, data fora da faixa). */
  private validarArraste(projetoId: string, m: MudancaDeDatas[]): string | null {
    const p = this.projeto(projetoId);
    if (!p) return "O projeto não existe mais.";
    return problemasDasMudancas(p.etapas, this.completar(p, m))[0] ?? null;
  }

  private async moverDatas(projetoId: string, m: MudancaDeDatas[]): Promise<void> {
    const p = this.projeto(projetoId);
    if (!p) return;
    try {
      await this.repoDe(p.vis).moverDatas(this.completar(p, m), this.d.hoje());
    } catch (e) {
      avisarErro(e);
      // O Gantt já mostra as barras no lugar novo: `atualizar` com as linhas gravadas (as de antes).
      this.pintarCorpo();
    }
  }

  private abrirProcesso(v: Vinculo, ev?: MouseEvent): void {
    const novaAba = !!(ev?.ctrlKey || ev?.metaKey);
    void this.d.rpc.chamar("abrirProcesso", { id: v.idProcedimento ?? "", protocolo: v.protocolo, novaAba }).catch((e) => avisarErro(e));
  }

  // ---------- exportar e imprimir ----------

  /** O que está na tela: a aba aberta (ou o portfólio), com o filtro aplicado às etapas. */
  private itensNaTela(): ProjetoNaTela[] {
    const hoje = this.d.hoje();
    const p = this.projetoAberto();
    const f = this.filtroDe(p);
    const base = p ? [p] : this.dados.ativos.filter((x) => projetoNoFiltro(x, f, hoje, this.eu));
    if (!criteriosAtivos(f)) return base;
    return base.map((x) => ({ ...x, etapas: filtrarEtapas(x.etapas, f, hoje, this.eu) }));
  }

  /**
   * A planilha da tela, com o sigilo pela regra e pela memória deste computador. Sem conseguir ler a memória, nada é
   * baixado (falha fechada: o número de um processo sigiloso iria na planilha) e o aviso diz isso; outro erro lança
   * (quem chama mostra a mensagem dele, como nas outras ações).
   */
  private async exportar(): Promise<void> {
    const hoje = this.d.hoje();
    // No lateral a planilha é a de todos os projetos (decisão 17): o projeto aberto e o filtro são os do painel.
    const lateral = this.d.modo === "lateral";
    const p = lateral ? undefined : this.projetoAberto();
    const itens = lateral ? this.dados.ativos : this.itensNaTela();
    let conhecidos: SigilosConhecidos;
    try {
      conhecidos = await this.d.repos.unidade.sigilosConhecidos();
    } catch (e) {
      if (!(e instanceof ErroMemoriaSigilo)) throw e;
      console.warn("[SEI Pro] projetos: planilha sem a memória do sigilo:", mensagem(e));
      avisar(MENSAGEM_PLANILHA_SEM_MEMORIA);
      return;
    }
    this.d.baixar(nomeDoCsv(p?.projeto.nome ?? null, hoje), csvDosProjetos(itens, hoje, conhecidos), "text/csv;charset=utf-8");
  }

  private imprimir(): void {
    const p = this.projetoAberto();
    if (!this.d.imprimir || !this.d.ctx.unidade) return;
    this.d.imprimir({
      host: this.d.ctx.host,
      login: this.d.ctx.login,
      unidade: this.d.ctx.unidade.id,
      projeto: p?.projeto.id ?? "todos",
      escala: p ? escalaDoProjeto(this.prefs, p.projeto.id) : this.prefs.escalaTodos,
    });
  }
}
