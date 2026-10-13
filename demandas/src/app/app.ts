/**
 * O app do Gestor de Demandas: junta os dois escopos da unidade (toda a unidade e só eu), desenha cabeçalho, visões,
 * filtros e faixas de limite, e faz as ações do dia a dia. Os dados vêm do repositório e voltam a ser lidos a cada
 * gravação (`aoMudar`, de qualquer contexto, com um debounce de um quadro: `importar` grava muitas chaves de uma vez).
 * Tudo que depende do SEI real entra por `DepsApp` (a ligação é a D13). `atualizar()` nunca lança.
 */

import { avisar } from "@comum/ui/aviso";
import { h } from "@comum/ui/dom";
import { fecharOrfaos } from "@comum/ui/flutuante";
import { criarMenu, type EntradaMenu } from "@comum/ui/menu";
import type { Escala } from "@projetos/gantt/escalas";
import type { ControleGantt } from "@projetos/gantt/montar";
import type { UsuarioDaUnidade } from "@projetos/ponte/tipos";
import { chaveResponsavel, EU, type FiltroDemandas, filtrar } from "../modelo/filtro";
import { COLUNAS_DO_QUADRO, planoDoMovimento } from "../modelo/quadro";
import type { PreferenciasDemandas } from "../preferencias";
import type { EstadoTabela } from "../sincronia/orquestrador";
import {
  arquivarSelecionadas,
  contextoDeDialogos,
  entradasDoMenu,
  excluirSelecionadas,
  moverPara,
  mudarDatas,
  TEXTO_CRIACAO_BLOQUEADA,
} from "./acoes";
import { montarAbas, type Visao } from "./componentes/abas";
import { type EscopoNaTela, montarCabecalho } from "./componentes/cabecalho";
import { montarFaixas } from "./componentes/faixas";
import { type FiltroMontado, montarFiltro } from "./componentes/filtro";
import { montarNada, montarVazio } from "./componentes/vazio";
import { montarVistaCronograma } from "./componentes/vistaCronograma";
import { montarPainel } from "./componentes/vistaPainel";
import { montarQuadro } from "./componentes/vistaQuadro";
import { type ColunaTabela, montarTabelaDemandas } from "./componentes/vistaTabela";
import { carregarDados, type DemandaNaTela, etiquetasUsadas, responsaveisUsados } from "./dados";
import { abrirDialogoDemanda } from "./dialogos/demanda";
import { avisarErro } from "./erros";
import { rotuloDaColuna } from "./formato";
import type { AppMontado, DepsApp } from "./tipos";

interface Estado {
  dados: DemandaNaTela[];
  filtro: FiltroDemandas;
  visao: Visao;
  escopo: EscopoNaTela;
  tabelas: EstadoTabela[];
  ordenar: { coluna: ColunaTabela; sentido: 1 | -1 };
  selecionadas: Set<string>;
  concluidasDias: number;
  escalaCronograma: Escala;
  agrupamento: "responsavel" | "situacao";
  periodo: PreferenciasDemandas["periodoPainel"];
  falhou: boolean;
}

export async function montarApp(deps: DepsApp): Promise<AppMontado> {
  const prefs = await deps.preferencias.ler().catch(() => undefined);
  const estado: Estado = {
    dados: [],
    filtro: {},
    visao: prefs?.visao ?? "quadro",
    escopo: prefs?.escopo ?? "ambos",
    tabelas: [],
    ordenar: { coluna: "prazo", sentido: 1 },
    selecionadas: new Set(),
    concluidasDias: prefs?.concluidasNoQuadroDias ?? 30,
    escalaCronograma: prefs?.escalaCronograma ?? "Semana",
    agrupamento: prefs?.agrupamentoCronograma ?? "responsavel",
    periodo: prefs?.periodoPainel ?? "90",
    falhou: false,
  };
  let usuarios: UsuarioDaUnidade[] = [];
  let vivo = true;
  let leitura = 0;
  let cronograma: ControleGantt | null = null;

  const eu = { login: deps.contexto.login, nome: deps.contexto.nome };
  const gravarPrefs = (p: Partial<PreferenciasDemandas>) => void deps.preferencias.gravar(p).catch(() => undefined);

  const cabecalhoEl = h("div", {});
  const abasEl = h("div", {});
  const faixasEl = h("div", {});
  const loteEl = h("div", {});
  const vistaEl = h("div", { class: "dem-vista", role: "tabpanel" });
  const filtroMontado: FiltroMontado = montarFiltro({
    filtro: estado.filtro,
    usuarios,
    etiquetas: [],
    aoMudar: (f) => {
      estado.filtro = f;
      pintarVista();
    },
  });
  const raiz = h("div", { class: "dem", "data-modo": deps.modo }, cabecalhoEl, abasEl, filtroMontado.el, faixasEl, loteEl, vistaEl);
  deps.raiz.replaceChildren(raiz);

  // ---------- o que está na tela ----------
  const visiveis = (): DemandaNaTela[] => {
    const doEscopo = estado.dados.filter((x) => estado.escopo === "ambos" || x.vis === estado.escopo);
    const ids = new Set(
      filtrar(
        doEscopo.map((x) => x.demanda),
        estado.filtro,
        { hoje: deps.hoje(), eu },
      ).map((d) => d.id),
    );
    return doEscopo.filter((x) => ids.has(x.demanda.id));
  };
  const bloqueioDaCriacao = (): boolean =>
    estado.escopo !== "eu" && estado.tabelas.some((t) => t.vis === "unidade" && t.tabela === "d" && t.faixa === "bloqueio");

  // ---------- ações ----------
  // Exceção ao abrir o diálogo não pode ser engolida pelo `void`: o usuário veria o menu fechar e nada mais.
  const abrirNova = async () => {
    try {
      const r = await abrirDialogoDemanda(contextoDeDialogos(deps), { vis: estado.escopo === "eu" ? "eu" : "unidade" });
      if (r) await atualizar();
    } catch (e) {
      avisarErro(e);
    }
  };
  const editar = async (alvo: DemandaNaTela) => {
    try {
      const r = await abrirDialogoDemanda(contextoDeDialogos(deps), { demanda: alvo });
      if (r) await atualizar();
    } catch (e) {
      avisarErro(e);
    }
  };
  const arquivarAntigas = () => {
    const c = deps.colaboracao;
    if (c) c.arquivarAntigas();
    else avisar("O arquivamento em massa chega com a colaboração entre computadores.");
  };
  const editarInline = async (alvo: DemandaNaTela, campo: "titulo" | "etiquetas", valor: string) => {
    try {
      const repo = deps.repos[alvo.vis];
      if (campo === "titulo") await repo.editar(alvo.demanda.id, { titulo: valor });
      else await repo.editar(alvo.demanda.id, { etiquetas: valor.split(",") });
      await atualizar();
    } catch (e) {
      avisarErro(e);
    }
  };
  const reordenar = async (alvo: DemandaNaTela, antesId: string | null, depoisId: string | null) => {
    try {
      await deps.repos[alvo.vis].reordenar(alvo.demanda.id, antesId, depoisId);
      await atualizar();
    } catch (e) {
      avisarErro(e);
    }
  };
  const verMais = () => {
    estado.concluidasDias = estado.concluidasDias < 90 ? 90 : 365;
    gravarPrefs({ concluidasNoQuadroDias: estado.concluidasDias });
    pintarVista();
  };
  /** A alternativa por teclado do arrastar: "Mover para" só com as colunas que o movimento permite. */
  const menuDoCartao = (alvo: DemandaNaTela): EntradaMenu[] =>
    entradasDoMenu(deps, alvo, {
      aoEditar: (a) => void editar(a),
      extras: [...COLUNAS_DO_QUADRO, "arquivada" as const]
        .filter((s) => planoDoMovimento(alvo.demanda, s).tipo !== "recusar")
        .map((s) => ({ rotulo: `Mover para ${rotuloDaColuna[s]}`, icone: "mover" as const, fazer: () => void moverPara(deps, alvo, s) })),
    });
  const menuDe = (alvo: DemandaNaTela): EntradaMenu[] => entradasDoMenu(deps, alvo, { aoEditar: (a) => void editar(a) });

  const menuAjustes = (): HTMLElement =>
    criarMenu({
      rotulo: "Ajustes",
      icone: "ajustes",
      itens: () => {
        const uso = estado.tabelas.find((t) => t.vis === "unidade" && t.tabela === "d" && t.bytes !== undefined);
        const usoItem: EntradaMenu | null = uso
          ? { rotulo: `Uso do Texto Padrão: ${uso.percentual}%`, icone: "nuvem", desativado: true, fazer: () => undefined }
          : null;
        const colab = deps.colaboracao;
        return colab
          ? [usoItem, ...colab.itensDoMenu()]
          : [usoItem, { rotulo: "Arquivar concluídas antigas…", icone: "pasta", fazer: arquivarAntigas }];
      },
    });
  const ajustes = menuAjustes();

  // ---------- desenho ----------
  function pintarCabecalho(): void {
    const bloqueada = bloqueioDaCriacao();
    cabecalhoEl.replaceChildren(
      montarCabecalho({
        escopo: estado.escopo,
        ...(bloqueada ? { novaDesabilitada: TEXTO_CRIACAO_BLOQUEADA } : {}),
        menu: ajustes,
        semTitulo: deps.modo === "embutido",
        ...(deps.colaboracao
          ? {
              indicador: deps.colaboracao.estadoDoIndicador(),
              aoIndicador: () => void deps.colaboracao?.abrirDialogoSincronizacao().catch(avisarErro),
            }
          : {}),
        aoEscopo: (e) => {
          estado.escopo = e;
          gravarPrefs({ escopo: e });
          pintar();
        },
        aoNova: () => void abrirNova(),
      }),
    );
  }
  function pintarAbas(): void {
    abasEl.replaceChildren(
      montarAbas({
        visao: estado.visao,
        aoEscolher: (v) => {
          estado.visao = v;
          gravarPrefs({ visao: v });
          pintarAbas();
          pintarVista();
        },
      }),
    );
  }
  function pintarFaixas(): void {
    const ativas = estado.dados.filter((x) => x.situacao !== "arquivada" && x.vis === "unidade").length;
    const f = montarFaixas({ tabelas: estado.tabelas, ativas, aoArquivarAntigas: arquivarAntigas });
    const erro = estado.falhou
      ? h(
          "div",
          { class: "dem-faixa bloqueio", role: "alert" },
          h("span", { class: "dem-faixa-texto" }, "Não foi possível ler as demandas"),
          h("button", { type: "button", class: "spro-botao pequeno", onclick: () => void atualizar() }, "Tentar de novo"),
        )
      : null;
    faixasEl.replaceChildren(...[deps.colaboracao?.faixas, erro, f].filter((x): x is HTMLElement => !!x));
  }
  function pintarLote(): void {
    const n = estado.selecionadas.size;
    if (!n) return void loteEl.replaceChildren();
    const itens = () => estado.dados.filter((x) => estado.selecionadas.has(x.demanda.id));
    const limpar = () => {
      estado.selecionadas.clear();
      pintarLote();
      pintarVista();
    };
    loteEl.replaceChildren(
      h(
        "div",
        { class: "dem-lote", role: "region", "aria-label": "Seleção" },
        h("span", { class: "dem-lote-qtd" }, `${n} ${n === 1 ? "selecionada" : "selecionadas"}`),
        h(
          "button",
          {
            type: "button",
            class: "spro-botao pequeno",
            onclick: async () => {
              await arquivarSelecionadas(deps, itens());
              limpar();
              await atualizar();
            },
          },
          `Arquivar (${n})`,
        ),
        h(
          "button",
          {
            type: "button",
            class: "spro-botao pequeno perigo",
            onclick: async () => {
              await excluirSelecionadas(deps, itens());
              limpar();
              await atualizar();
            },
          },
          `Excluir (${n})`,
        ),
        h("button", { type: "button", class: "spro-botao fantasma pequeno", onclick: limpar }, "Limpar seleção"),
      ),
    );
  }
  function pintarVista(): void {
    fecharOrfaos();
    cronograma?.destruir();
    cronograma = null;
    const lista = visiveis();
    vistaEl.setAttribute("data-visao", estado.visao);
    if (!estado.dados.length) {
      vistaEl.replaceChildren(
        estado.falhou
          ? h("div", {})
          : montarVazio({ aoCriar: () => void abrirNova(), ...(bloqueioDaCriacao() ? { desabilitado: TEXTO_CRIACAO_BLOQUEADA } : {}) }),
      );
      return;
    }
    if (!lista.length && estado.visao !== "painel") {
      vistaEl.replaceChildren(montarNada("Nenhuma demanda com esses filtros.", { rotulo: "Limpar filtros", fazer: () => limparFiltros() }));
      return;
    }
    switch (estado.visao) {
      case "tabela":
        vistaEl.replaceChildren(
          montarTabelaDemandas({
            itens: lista,
            hoje: deps.hoje(),
            ordenar: estado.ordenar,
            aoOrdenar: (coluna) => {
              estado.ordenar = { coluna, sentido: estado.ordenar.coluna === coluna && estado.ordenar.sentido === 1 ? -1 : 1 };
              pintarVista();
            },
            itensDoMenu: menuDe,
            aoEditarInline: editarInline,
            selecionadas: estado.selecionadas,
            aoSelecionar: (id, marcada) => {
              if (marcada) estado.selecionadas.add(id);
              else estado.selecionadas.delete(id);
              pintarLote();
            },
            ...(deps.abrirProcesso ? { abrirProcesso: deps.abrirProcesso } : {}),
          }),
        );
        break;
      case "quadro":
        vistaEl.replaceChildren(
          montarQuadro({
            itens: lista,
            hoje: deps.hoje(),
            mostrarArquivadas: !!estado.filtro.mostrarArquivadas,
            concluidasDias: estado.concluidasDias,
            aoMover: (alvo, destino) => moverPara(deps, alvo, destino),
            aoReordenar: reordenar,
            itensDoMenu: menuDoCartao,
            aoVerMais: verMais,
          }),
        );
        break;
      case "cronograma": {
        let desenhou = true;
        cronograma = montarVistaCronograma(vistaEl, {
          itens: lista,
          hoje: deps.hoje(),
          escala: estado.escalaCronograma,
          agrupar: estado.agrupamento,
          aoClicar: (alvo) => void editar(alvo),
          aoMudarDatas: async (alvo, inicio, fim) => {
            if (!(await mudarDatas(deps, alvo, inicio, fim)) && vivo && estado.visao === "cronograma") pintarVista();
          },
          aoEscala: (e) => {
            estado.escalaCronograma = e;
            gravarPrefs({ escalaCronograma: e });
            pintarVista();
          },
          aoAgrupar: (a) => {
            estado.agrupamento = a;
            gravarPrefs({ agrupamentoCronograma: a });
            pintarVista();
          },
          aoRecusar: (m) => avisar(m),
          aoFalhar: () => {
            desenhou = false;
          },
          ...(deps.montarGantt ? { montarGantt: deps.montarGantt } : {}),
        });
        if (!desenhou) {
          estado.visao = "tabela";
          avisar("Não foi possível desenhar o cronograma. Mostrando a Tabela.");
          pintarAbas();
          pintarVista();
        }
        break;
      }
      case "painel":
        vistaEl.replaceChildren(
          montarPainel({
            // O painel olha o escopo inteiro (arquivadas contam como entregas), sem o filtro das outras visões.
            itens: estado.dados.filter((x) => estado.escopo === "ambos" || x.vis === estado.escopo),
            hoje: deps.hoje(),
            periodo: estado.periodo,
            aoFiltrarTabela: (f) => {
              estado.filtro = f;
              filtroMontado.definir(f);
              estado.visao = "tabela";
              gravarPrefs({ visao: "tabela" });
              pintarAbas();
              pintarVista();
            },
            aoPeriodo: (p) => {
              estado.periodo = p;
              gravarPrefs({ periodoPainel: p });
            },
          }),
        );
        break;
    }
  }
  function limparFiltros(): void {
    estado.filtro = {};
    filtroMontado.definir({});
    pintarVista();
  }
  function pintar(): void {
    pintarCabecalho();
    pintarAbas();
    pintarFaixas();
    pintarLote();
    pintarVista();
  }

  // ---------- leitura ----------
  async function atualizar(): Promise<void> {
    if (!vivo) return;
    const minha = ++leitura;
    try {
      const [dados, tabelas, us] = await Promise.all([
        carregarDados(deps.repos, deps.hoje()),
        deps.tabelas().catch(() => [] as EstadoTabela[]),
        deps.usuarios().catch(() => [] as UsuarioDaUnidade[]),
      ]);
      if (!vivo || minha !== leitura) return;
      estado.dados = dados;
      estado.tabelas = tabelas;
      estado.falhou = false;
      const porChave = new Map<string, UsuarioDaUnidade>();
      for (const u of [eu, ...us, ...responsaveisUsados(dados)]) porChave.set(chaveResponsavel(u), u);
      usuarios = [...porChave.values()];
      filtroMontado.opcoes(usuarios, etiquetasUsadas(dados));
      const presentes = new Set(dados.map((x) => x.demanda.id));
      for (const id of [...estado.selecionadas]) if (!presentes.has(id)) estado.selecionadas.delete(id);
    } catch {
      if (!vivo || minha !== leitura) return;
      estado.falhou = true;
    }
    pintar();
  }

  let agendado: ReturnType<typeof setTimeout> | null = null;
  const agendar = () => {
    if (agendado !== null) return;
    agendado = setTimeout(() => {
      agendado = null;
      void atualizar();
    }, 0);
  };
  const soltar = [deps.repos.unidade.aoMudar(agendar), deps.repos.eu.aoMudar(agendar)];
  // O status gravado pela aba e o consentimento mudam o indicador, as faixas de limite e o uso do texto.
  if (deps.colaboracao) soltar.push(deps.colaboracao.aoMudar(agendar));

  pintar();
  await atualizar();
  return {
    aplicarAlerta(tipo) {
      if (!vivo) return;
      // As minhas, abertas, na Tabela (a mesma saída do painel de estatísticas).
      estado.filtro = { responsaveis: [EU], prazo: tipo };
      filtroMontado.definir(estado.filtro);
      estado.visao = "tabela";
      gravarPrefs({ visao: "tabela" });
      pintarAbas();
      pintarVista();
    },
    async focarDemanda(id) {
      if (!vivo) return false;
      // A gravação do colega pode ter chegado depois da última leitura.
      if (!estado.dados.some((x) => x.demanda.id === id)) await atualizar();
      const alvo = estado.dados.find((x) => x.demanda.id === id);
      if (!vivo) return false;
      if (!alvo) {
        avisar("Esta demanda não está mais na lista.");
        return false;
      }
      await editar(alvo);
      return true;
    },
    atualizar,
    destruir() {
      vivo = false;
      cronograma?.destruir();
      cronograma = null;
      if (agendado !== null) clearTimeout(agendado);
      for (const s of soltar) s();
      fecharOrfaos();
      deps.raiz.replaceChildren();
    },
    aoRedimensionar() {
      if (estado.visao === "cronograma") pintarVista();
    },
  };
}
