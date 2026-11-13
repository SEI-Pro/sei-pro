/**
 * A grade: estado, barra de ferramentas, tabela/quadro, lote e atalhos, num Shadow DOM. Só lê o modelo e emite
 * intenções; quem fala com o SEI são as dependências recebidas (`DepsApp`), que os testes substituem.
 */
import { gerarCsv } from '../../../sei-comum/src/csv';
import { type Combo, criarCombo } from '../../../sei-comum/src/ui/combobox';
import { h, icone as iconeComum, type NomeIcone } from '../../../sei-comum/src/ui/dom';
import { aplicarSelecao, lerSelecao, observarSelecao } from '../acoes/selecao';
import { executarAcaoNativa } from '../acoes/barra';
import { chavePagina, type PlanoAcao, planejarAcao, temSigiloso } from '../acoes/foraDaPagina';
import { urlDaAcao } from '../leitura/barra';
import { criarFila, type DepsMover } from '../acoes/mover';
import type { AcaoNativa } from '../leitura/barra';
import { lerTabelas } from '../leitura/tabela';
import { acrescentar, interpretar, filtrarPorBusca, remover } from '../modelo/busca';
import type { Ctx } from '../modelo/contexto';
import { facetasDe } from '../modelo/facetas';
import { linhasCsv, nomeArquivo } from '../modelo/exportar';
import { agrupar, ROTULO_AGRUPAR } from '../modelo/grupos';
import { abrirVisita, comIdade, type EstadoIdade, registrarVistos } from '../modelo/idade';
import { achatar, type LinhaLista } from '../modelo/linhas';
import { alternarOrdem, ordenar } from '../modelo/ordem';
import { aplicarMovimento, type ExtrasQuadro, planejarMovimento } from '../modelo/quadro';
import { type AgruparPor, type CampoOrdem, COLUNAS, type Coluna, type LeituraTabela, type Processo, ROTULO_COLUNA, type Visao } from '../modelo/tipos';
import { excluirVisao, mudouDe, salvarVisao, visaoPadrao } from '../modelo/visoes';
import type { Grupo, SelecaoDaPagina } from '../modelo/tipos';
import type { Fonte, Progresso } from '../paginas/carregar';
import { carregarRestante } from '../paginas/carregar';
import type { Armazem } from '../persistencia/armazem';
import type { DadosColeta } from '../andamentos/coletar';
import { criarAndamentos, ehAgrupamentoAndamento } from './andamentos';
import { desenharQuadro } from './quadro';
import { iconeGrade } from './icones';
import { vigiarTitulos } from './dica';
import { assinaturaIcones, criarClonador, estilosDosModulos } from './iconesNativos';
import { editarAnotacao, editarMarcadores, editarResponsavel, type DepsEdicao } from './edicoes';
import { criarTabela, type PropsTabela } from './tabela';

export interface DepsApp {
  doc: Document;
  inicial: LeituraTabela;
  agora(): number;
  hoje(): string;
  eu?: string;
  armazem: Armazem;
  fonte: Fonte | null;
  mover: DepsMover;
  acoes(): AcaoNativa[];
  css: string;
  escuro: boolean;
  baixar(nome: string, conteudo: string, tipo: string): void;
  novoId(): string;
  /** Marcadores e usuários da unidade, para o quadro mostrar colunas vazias. Falha = só o que está carregado. */
  extras?(): Promise<ExtrasQuadro>;
  aoVoltarNativa(): void;
  /** Envia a acao do SEI com os pares de outra pagina (processos que nao estao na tabela nativa). */
  enviarAcao(url: string, plano: PlanoAcao): void;
  editarEspecificacao(protocolo: string, texto: string): Promise<void>;
  /** Pede ao modulo de prazos que abra o menu do prazo do processo. */
  abrirPrazo(id: string): void;
  anotar(protocolo: string, a: { texto: string; prioridade: boolean }): Promise<void>;
  /** Consulta o andamento de um processo (datas e unidade de envio). Sem isso, os agrupamentos por andamento não existem. */
  consultarAndamento?(p: Processo, sinal: AbortSignal): Promise<DadosColeta | null>;
  /** Para os testes. */
  andamentoSimultaneas?: number;
  andamentoPausaMs?: number;
  /** Para os testes: não reagir ao relógio. */
  semDebounce?: boolean;
}

const ATALHOS: Array<[string, string]> = [
  ['/', 'Buscar'], ['j / k', 'Linha seguinte / anterior'], ['x', 'Marcar a linha'], ['Enter', 'Abrir o processo'],
  ['g t', 'Ver a tabela'], ['g q', 'Ver o quadro'], ['Esc', 'Limpar a busca ou a seleção'], ['?', 'Esta ajuda'],
];
type IconeRapido = { comum: NomeIcone } | { grade: Parameters<typeof iconeGrade>[0] };
/** Recebidos e Gerados se excluem: ligar um desliga o outro (os dois juntos nunca achariam nada). */
const termoExcludente = (t: string): string | null => (t === 'grupo:recebidos' ? 'grupo:gerados' : t === 'grupo:gerados' ? 'grupo:recebidos' : null);
/** O que cada filtro rapido faz (vai na dica, que aparece na hora). */
const DESCRICAO_RAPIDO: Record<string, string> = {
  'resp:eu': 'Processos atribuídos a você',
  'grupo:recebidos': 'Processos que vieram de outra unidade',
  'grupo:gerados': 'Processos autuados nesta unidade',
  'prazo:atrasado': 'Prazo vencido e ainda não concluído',
  'prazo:semana': 'Vencem nos próximos 7 dias',
  'resp:sem': 'Processos sem responsável',
  'novo:sim': 'Ainda não abertos nesta unidade',
  'novo:visita': 'Chegaram depois da sua última visita',
  'parado:>30d': 'Sem movimentação há mais de 30 dias (visão detalhada do SEI)',
};
const FILTROS_RAPIDOS: Array<[string, string, IconeRapido, string]> = [
  ['Meus', 'resp:eu', { comum: 'pessoa' }, ''],
  ['Recebidos', 'grupo:recebidos', { grade: 'recebido' }, ''],
  ['Gerados', 'grupo:gerados', { grade: 'gerado' }, ''],
  ['Atrasados', 'prazo:atrasado', { comum: 'alerta' }, 'perigo'],
  ['Vencem na semana', 'prazo:semana', { comum: 'calendario' }, 'aviso'],
  ['Sem responsável', 'resp:sem', { grade: 'semPessoa' }, ''],
  ['Não visualizados', 'novo:sim', { grade: 'olhoFechado' }, ''],
  ['Novos desde a última visita', 'novo:visita', { comum: 'brilho' }, 'novo'],
  ['Parados há +30 dias', 'parado:>30d', { comum: 'historico' }, ''],
];

export function criarApp(d: DepsApp) {
  const { doc } = d;
  let todos: Processo[] = d.inicial.processos;
  let visao: Visao = visaoPadrao();
  let salvas: Visao[] = [];
  let visaoSalvaId = '';
  let recolhidos = new Set<string>();
  let selecionados = new Set<string>(lerSelecao(doc));
  let foco: string | null = null;
  let idade: EstadoIdade = { vistoEm: {} };
  let visitaAnterior: number | undefined;
  let progresso: Progresso | null = null;
  let carregando = false;
  let completo = false;
  let erroCarga = '';
  let extras: ExtrasQuadro = {};
  let extrasPedido = false;
  let encerrado = false;
  let buscaTimer: ReturnType<typeof setTimeout> | undefined;
  let aguardandoG = false;
  const fila = criarFila(d.mover);
  const ctl = new AbortController();

  const ctx = (): Ctx => ({ hoje: d.hoje(), agora: d.agora(), ...(d.eu ? { eu: d.eu } : {}), ...(visitaAnterior !== undefined ? { visitaAnterior } : {}), ...(andamentos ? { andamentos: andamentos.dados() } : {}) });

  // ---------- DOM ----------
  const host = doc.createElement('div');
  host.id = 'spro-grade';
  host.setAttribute('data-spro-grade-host', '1');
  host.setAttribute('data-tema', d.escuro ? 'escuro' : 'claro');
  const sombra = host.attachShadow({ mode: 'open' });
  const estilo = doc.createElement('style');
  estilo.textContent = d.css;
  const raiz = h('div', { class: `spro-app${d.escuro ? ' spro-escuro' : ''}` });
  const estiloModulos = doc.createElement('style');
  sombra.append(estilo, estiloModulos, raiz);
  const pararTitulos = vigiarTitulos(sombra);
  /** Datas e unidade de envio tiradas do andamento (só existe se quem montou a grade sabe consultá-lo). */
  const andamentos = d.consultarAndamento
    ? criarAndamentos({
        sombra,
        agora: () => d.agora(), armazem: d.armazem, consultar: (p, s) => d.consultarAndamento!(p, s),
        processos: () => todos, aoMudar: () => render(), aviso: (t) => aviso(t),
        simultaneas: d.andamentoSimultaneas, pausaMs: d.andamentoPausaMs, semDebounce: d.semDebounce,
      })
    : null;

  const busca = h('input', { type: 'search', class: 'spro-busca', placeholder: 'Buscar: texto, resp:ana, prazo:<7d, marcador:urgente...', 'aria-label': 'Buscar processos', spellcheck: 'false', autocomplete: 'off' });
  const chips = h('div', { class: 'spro-chips' });
  const rapidos = h('div', { class: 'spro-rapidos' });
  const status = h('div', { class: 'spro-status', role: 'status', 'aria-live': 'polite' });
  const lote = h('div', { class: 'spro-lote', hidden: true });
  const conteudo = h('div', { class: 'spro-conteudo' });
  const painel = h('div', { class: 'spro-painel', hidden: true });
  const avisos = h('div', { class: 'spro-avisos', 'aria-live': 'polite' });
  const ajuda = h('div', { class: 'spro-ajuda-atalhos', hidden: true }, h('strong', {}, 'Atalhos'), ...ATALHOS.map(([k, t]) => h('div', {}, h('kbd', {}, k), ` ${t}`)));

  const ORDENS: Array<[CampoOrdem, string]> = [['protocolo', 'Número do processo'], ['prazo', 'Prazo'], ['tipo', 'Tipo'], ['responsavel', 'Responsável'], ['marcador', 'Marcador'], ['caixa', 'Tempo na caixa'], ['parado', 'Parado há'], ['novo', 'Não visualizados']];
  const comboAgrupar = criarCombo({
    rotulo: 'Agrupar por', icone: 'camadas', classe: 'spro-combo-compacto', busca: false, vazio: 'Sem agrupamento',
    opcoes: (Object.keys(ROTULO_AGRUPAR) as AgruparPor[])
      .filter((k) => andamentos || !ehAgrupamentoAndamento(k))
      .map((k) => ({ valor: k, rotulo: k === 'nenhum' ? 'Sem agrupamento' : `Agrupar: ${ROTULO_AGRUPAR[k]}`, ...(ehAgrupamentoAndamento(k) ? { descricao: 'Consulta o andamento de cada processo' } : {}) })),
    valor: ['nenhum'],
    aoMudar: ([v]) => {
      const novo = (v ?? 'nenhum') as AgruparPor;
      const anterior = visao.agrupar;
      alterar({ agrupar: novo });
      // Agrupar por andamento pede o aval do usuario (consulta processo a processo); se ele desiste e nada ha guardado, volta ao anterior.
      if (andamentos && ehAgrupamentoAndamento(novo)) void andamentos.aoEscolherAgrupamento().then((ok) => { if (!ok && visao.agrupar === novo) alterar({ agrupar: anterior }); });
    },
  });
  const comboOrdem = criarCombo({
    rotulo: 'Ordenar por', icone: 'ordenar', classe: 'spro-combo-compacto', busca: false, vazio: 'Ordem do SEI',
    opcoes: [{ valor: '', rotulo: 'Ordem do SEI' }, ...ORDENS.flatMap(([k, t]) => [{ valor: `${k}:a`, rotulo: `${t} \u2191`, descricao: 'Crescente' }, { valor: `${k}:d`, rotulo: `${t} \u2193`, descricao: 'Decrescente' }])],
    valor: [''], aoMudar: ([v]) => { const [campo, sentido] = (v ?? '').split(':'); alterar({ ordem: campo ? [{ campo: campo as CampoOrdem, decrescente: sentido === 'd' }] : [] }); },
  });
  let facetas = facetasDe([], ctx());
  const comboFiltro = (rotulo: string, vazio: string, campo: 'resp' | 'tipo' | 'marcador', icone: NomeIcone, pegar: () => Array<{ valor: string; rotulo: string; n: number }>) => {
    const c: Combo = criarCombo({
      rotulo, vazio, icone, classe: 'spro-combo-compacto', busca: true, larguraLista: 260,
      opcoes: () => pegar().map((f) => ({ valor: f.valor, rotulo: f.rotulo, contagem: f.n })),
      aoMudar: ([v]) => { if (!v) return; alterar({ busca: acrescentar(visao.busca, campo, v) }); busca.value = visao.busca; c.definir([], false); },
    });
    return c;
  };
  const fResp = comboFiltro('Filtrar por responsável', 'Responsável…', 'resp', 'pessoa', () => facetas.responsaveis);
  const fTipo = comboFiltro('Filtrar por tipo', 'Tipo…', 'tipo', 'documento', () => facetas.tipos);
  const fMarc = comboFiltro('Filtrar por marcador', 'Marcador…', 'marcador', 'etiqueta', () => facetas.marcadores);

  const botaoModo = (m: 'tabela' | 'quadro', rotulo: string) => h('button', { type: 'button', class: 'spro-seg-b', 'data-modo': m, title: rotulo, onclick: () => alterar({ modo: m }) }, iconeGrade(m === 'tabela' ? 'lista' : 'quadro', 16), h('span', {}, rotulo));
  const segmentado = h('div', { class: 'spro-seg', role: 'group', 'aria-label': 'Modo de exibição' }, botaoModo('tabela', 'Tabela'), botaoModo('quadro', 'Quadro'));
  const btn = (icone: Parameters<typeof iconeGrade>[0], rotulo: string, fn: () => void, classe = '') => h('button', { type: 'button', class: `spro-bt ${classe}`.trim(), title: rotulo, 'aria-label': rotulo, onclick: fn }, iconeGrade(icone, 16), h('span', {}, rotulo));
  const btnColunas = btn('colunas', 'Colunas', () => abrirPainel('colunas'));
  const btnVisoes = btn('disquete', 'Visões', () => abrirPainel('visoes'));
  const btnCsv = btn('lista', 'Exportar CSV', () => exportar());
  const btnAjuda = h('button', { type: 'button', class: 'spro-bt spro-bt-icone', title: 'Atalhos de teclado (?)', 'aria-label': 'Atalhos de teclado', onclick: () => { ajuda.hidden = !ajuda.hidden; } }, '?');
  const btnDensidade = btn('densidade', 'Densidade', () => alterar({ densidade: visao.densidade === 'compacta' ? 'confortavel' : 'compacta' }));
  const opcoesQuadro = h('div', { class: 'spro-quadro-cfg', hidden: true });

  raiz.append(
    h('div', { class: 'spro-barra' },
      segmentado,
      h('div', { class: 'spro-busca-caixa' }, busca),
      comboAgrupar.el, comboOrdem.el,
      btnColunas, btnDensidade, btnVisoes, btnCsv, btnAjuda),
    chips,
    h('div', { class: 'spro-faixa' }, rapidos, fResp.el, fTipo.el, fMarc.el),
    opcoesQuadro, ajuda, painel, status, ...(andamentos ? [andamentos.faixa] : []), lote, conteudo, avisos);

  // ---------- estado ----------
  const comId = (): Processo[] => comIdade(todos, idade);
  /** Termo da pesquisa rápida do SEI (módulo Pesquisa Rápida): soma-se à busca da visão sem alterá-la nem gravá-la. */
  let filtroExterno = '';
  const filtrados = (): Processo[] => filtrarPorBusca(comId(), `${visao.busca} ${filtroExterno}`.trim(), ctx());
  const ordenados = (): Processo[] => ordenar(filtrados(), visao.ordem, ctx());

  function alterar(p: Partial<Visao>) {
    visao = { ...visao, ...p };
    if (p.busca === undefined) void d.armazem.gravarVisao(visao).catch(() => undefined);
    else agendarGravar();
    render();
  }
  let gravarTimer: ReturnType<typeof setTimeout> | undefined;
  function agendarGravar() {
    clearTimeout(gravarTimer);
    gravarTimer = setTimeout(() => void d.armazem.gravarVisao(visao).catch(() => undefined), 400);
  }

  function aviso(texto: string, acao?: { rotulo: string; fazer(): void }) {
    const el = h('div', { class: 'spro-aviso', role: 'status' }, h('span', {}, texto));
    if (acao) el.append(h('button', { type: 'button', class: 'spro-link', onclick: () => { acao.fazer(); el.remove(); } }, acao.rotulo));
    el.append(h('button', { type: 'button', class: 'spro-aviso-x', 'aria-label': 'Fechar aviso', onclick: () => el.remove() }, '×'));
    avisos.append(el);
    const t = setTimeout(() => el.remove(), acao ? 9000 : 6000);
    (t as unknown as { unref?: () => void }).unref?.();
  }

  // ---------- seleção ----------
  function selecionar(ids: string[], marcado: boolean) {
    const novo = new Set(selecionados);
    for (const id of ids) marcado ? novo.add(id) : novo.delete(id);
    selecionados = novo;
    aplicarSelecao(doc, novo);
    renderLote();
    renderConteudo();
  }

  // ---------- movimentos do quadro ----------
  // O que a grade mudou por conta propria (otimista ou ja gravado) e a linha nativa ainda nao mostra: a sincronia
  // reaplica por cima da leitura nativa ate a linha nativa concordar (ou a pagina ser recarregada).
  const locais = new Map<string, Record<string, unknown>>();
  function substituir(id: string, novo: Processo) {
    const antigo = todos.find((p) => p.id === id);
    if (antigo) {
      const reg = locais.get(id) ?? {};
      for (const k of new Set([...Object.keys(antigo), ...Object.keys(novo)])) {
        if (JSON.stringify((antigo as unknown as Record<string, unknown>)[k]) !== JSON.stringify((novo as unknown as Record<string, unknown>)[k])) reg[k] = (novo as unknown as Record<string, unknown>)[k];
      }
      locais.set(id, reg);
    }
    todos = todos.map((p) => (p.id === id ? novo : p));
  }
  let serie: Promise<unknown> = Promise.resolve();
  function gravarEmSerie<T>(fn: () => Promise<T>): Promise<T> {
    emVoo += 1;
    const r = serie.then(fn, fn);
    serie = r.catch(() => undefined).finally(() => { emVoo -= 1; });
    return r;
  }
  let extrasPromessa: Promise<ExtrasQuadro> | null = null;
  const carregarExtras = (): Promise<ExtrasQuadro> => {
    extrasPromessa ??= (d.extras ? d.extras().then((e) => { extras = e; return e; }) : Promise.resolve({})).catch((e) => { extrasPromessa = null; throw e; });
    return extrasPromessa;
  };
  const edicao: DepsEdicao = {
    raiz: sombra, extras: carregarExtras, todos: () => todos, selecionados: () => selecionados,
    corDoMarcador: (nome) => todos.flatMap((p) => p.marcadores).find((m) => m.nome === nome)?.cor ?? '',
    autor: d.eu ?? '',
    aplicarLocal: (id, novo) => { substituir(id, novo); render(); },
    gravar: gravarEmSerie,
    atribuir: (prot, sigla) => d.mover.atribuir(prot, sigla),
    marcar: (prot, m) => d.mover.marcador(prot, m),
    anotar: (prot, a) => d.anotar(prot, a),
    aviso: (t) => aviso(t),
  };
  async function mover(id: string, de: string, para: string) {
    const original = todos.find((p) => p.id === id);
    if (!original) return;
    const plano = planejarMovimento(visao.quadro.colunas, original, de, para);
    if (!plano.ok) return aviso(plano.motivo);
    const nomes = Object.fromEntries((extras.responsaveis ?? []).map((u) => [u.sigla, u.nome]));
    substituir(id, aplicarMovimento(original, plano.movimento, nomes));
    render();
    emVoo += 1;
    const r = await fila.mover(plano.movimento).finally(() => { emVoo -= 1; });
    if (encerrado) return;
    if (!r.ok) {
      substituir(id, original);
      render();
      return aviso(`Não foi possível mover ${original.protocolo}: ${r.erro}`);
    }
    aviso(`${original.protocolo} movido.`, {
      rotulo: 'Desfazer',
      fazer: () => {
        const atual = todos.find((p) => p.id === id) ?? original;
        substituir(id, aplicarMovimento(atual, r.desfazer, nomes));
        render();
        void fila.mover(r.desfazer).then((rr) => {
          if (rr.ok || encerrado) return;
          substituir(id, atual);
          render();
          aviso(`Não foi possível desfazer: ${rr.erro}`);
        });
      },
    });
  }

  // ---------- render ----------
  const clonarIcones = criarClonador();
  /** O par (ids, hash) de cada pagina lida: e o que o SEI exige para aceitar uma acao em lote. */
  const selecoesPaginas = new Map<string, SelecaoDaPagina>([
    [chavePagina('recebidos', 0), d.inicial.selecoes.recebidos],
    [chavePagina('gerados', 0), d.inicial.selecoes.gerados],
    [chavePagina('detalhado', 0), d.inicial.selecoes.detalhado],
  ]);
  const detalhada = d.inicial.visao === 'detalhada';
  function acionar(a: AcaoNativa) {
    const marcados = todos.filter((p) => selecionados.has(p.id));
    const regra = urlDaAcao(a);
    if (regra?.requerSelecao && !marcados.length) return aviso('Marque ao menos um processo.');
    if (regra && !regra.aceitaSigiloso && temSigiloso(marcados)) return aviso('Operação não aplicável em processo sigiloso.');
    const r = planejarAcao(marcados, selecoesPaginas, detalhada ? 'detalhada' : 'resumida');
    if (!r.ok) return aviso(r.motivo);
    // Tudo na pagina que o usuario ve: o caminho nativo (o clique do botao, com a selecao ja espelhada nas caixas).
    if (r.plano.todosNaPaginaAtual || !regra) { const x = executarAcaoNativa(a, marcados.length); if (!x.ok && x.motivo) aviso(x.motivo); return; }
    try { d.enviarAcao(regra.url, r.plano); } catch (e) { aviso(`Não foi possível enviar a ação: ${e instanceof Error ? e.message : String(e)}`); }
  }
  let emVoo = 0;
  let editando: string | null = null;
  let rascunho = '';
  let nomesCompletos = false;
  const propsDaTabela = (linhas: LinhaLista[]): PropsTabela => ({
    linhas, colunas: visao.colunas, densidade: visao.densidade, ctx: ctx(), ordem: visao.ordem, selecionados, foco,
    icones: (id) => clonarIcones(doc, id),
    nomesCompletos, editando, rascunho, semOrigem: detalhada,
    aoOrdenar: (campo, mais) => alterar({ ordem: alternarOrdem(visao.ordem, campo, mais) }),
    aoSelecionar: (id, m) => selecionar([id], m),
    aoGrupo: (chave) => { const n = new Set(recolhidos); n.has(chave) ? n.delete(chave) : n.add(chave); recolhidos = n; void d.armazem.gravarRecolhidos([...n]).catch(() => undefined); renderConteudo(); },
    aoMarcarGrupo: (ids, m) => selecionar(ids, m),
    aoEditarEspec: (id) => { editando = id; rascunho = todos.find((x) => x.id === id)?.especificacao ?? ''; renderConteudo(); },
    aoDigitarEspec: (t) => { rascunho = t; },
    aoCancelarEspec: () => { editando = null; renderConteudo(); },
    aoSalvarEspec: (id) => void salvarEspec(id),
    aoAbrirPrazo: (id) => d.abrirPrazo(id),
    aoEditar: (id, que) => { const p = todos.find((x) => x.id === id); if (!p) return; if (que === 'responsavel') editarResponsavel(edicao, p); else if (que === 'anotacao') editarAnotacao(edicao, p); else editarMarcadores(edicao, p); },
  });
  const tabela = criarTabela(propsDaTabela([]));

  async function salvarEspec(id: string) {
    const original = todos.find((p) => p.id === id);
    const texto = rascunho.trim();
    editando = null;
    if (!original || texto === original.especificacao.trim()) return renderConteudo();
    if (!texto) { aviso('A especificação não pode ficar vazia.'); return renderConteudo(); }
    substituir(id, { ...original, especificacao: texto });
    render();
    emVoo += 1;
    try {
      await d.editarEspecificacao(original.protocolo, texto);
      aviso(`Especificação de ${original.protocolo} salva.`);
    } catch (e) {
      substituir(id, original);
      render();
      aviso(`Não foi possível salvar a especificação: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      emVoo -= 1;
    }
  }

  function renderConteudo() {
    const lista = ordenados();
    if (visao.modo === 'quadro') {
      conteudo.replaceChildren(desenharQuadro({ processos: lista, cfg: visao.quadro, ctx: ctx(), extras, selecionados, aoMover: (i, a, b) => void mover(i, a, b), aoSelecionar: (i, m) => selecionar([i], m), aoAbrirPrazo: (i) => d.abrirPrazo(i) }));
      return;
    }
    const grupos = agrupar(lista, visao.agrupar, ctx());
    tabela.atualizar(propsDaTabela(achatar(grupos, recolhidos, visao.agrupar !== 'nenhum')));
    if (conteudo.firstElementChild !== tabela.el) conteudo.replaceChildren(tabela.el);
  }

  function renderStatus(n: number) {
    const partes = [`${n} de ${todos.length} processo${todos.length === 1 ? '' : 's'}`];
    if (filtroExterno) partes.push(`filtro da pesquisa rápida: ${filtroExterno}`);
    const totalSei = d.inicial.totais.recebidos + d.inicial.totais.gerados;
    if (carregando && progresso) partes.push(`carregando ${progresso.grupo} (${progresso.paginasLidas}/${progresso.paginasTotal})…`);
    else if (!completo && totalSei > todos.length) partes.push(`o SEI informa ${totalSei}; os demais não foram carregados`);
    if (erroCarga) partes.push(`aviso: ${erroCarga}`);
    status.replaceChildren(partes.join(' · '));
    status.classList.toggle('spro-status-alerta', !!erroCarga || (!completo && !carregando && totalSei > todos.length));
  }

  function renderLote() {
    const n = selecionados.size;
    lote.hidden = n === 0;
    if (!n) return lote.replaceChildren();
    const visiveis = new Set(filtrados().map((p) => p.id));
    const fora = [...selecionados].filter((id) => !visiveis.has(id)).length;
    lote.replaceChildren(
      h('strong', {}, `${n} selecionado${n === 1 ? '' : 's'}`),
      ...(fora ? [h('span', { class: 'spro-suave' }, `(${fora} fora do filtro atual)`)] : []),
      ...d.acoes().map((a) => h('button', { type: 'button', class: 'spro-bt', title: a.rotulo, onclick: () => acionar(a) }, h('img', { src: a.icone, alt: '', width: '16', height: '16' }), h('span', {}, a.rotulo))),
      h('button', { type: 'button', class: 'spro-link', onclick: () => selecionar([...selecionados], false) }, 'Limpar seleção'));
  }

  function renderChips() {
    const c = interpretar(visao.busca);
    chips.replaceChildren(...c.tokens.map((t) => h('span', { class: `spro-chip${t.termo.negado ? ' spro-chip-neg' : ''}` }, t.texto, h('button', { type: 'button', 'aria-label': `Remover ${t.texto}`, onclick: () => { alterar({ busca: remover(visao.busca, t.texto) }); busca.value = visao.busca; } }, '×'))));
    chips.hidden = !c.tokens.length;
    const ativos = new Set(c.tokens.map((t) => t.texto));
    // Na visao detalhada o SEI nao distingue Recebidos de Gerados: esses dois filtros nao fazem sentido.
    rapidos.replaceChildren(...FILTROS_RAPIDOS.filter(([, termo]) => !(detalhada && termo.startsWith('grupo:'))).map(([rotulo, termo, ic, tom]) => h('button', { type: 'button', 'data-tip': `${rotulo}\n${DESCRICAO_RAPIDO[termo] ?? ''}\nBusca: ${termo}${ativos.has(termo) ? '\nClique para desligar' : ''}`, 'aria-label': rotulo, class: `spro-rapido${tom ? ` spro-rapido-${tom}` : ''}${ativos.has(termo) ? ' spro-rapido-on' : ''}`, 'aria-pressed': String(ativos.has(termo)), onclick: () => { alterar({ busca: ativos.has(termo) ? remover(visao.busca, termo) : `${termoExcludente(termo) ? remover(visao.busca, termoExcludente(termo)!) : visao.busca} ${termo}`.trim() }); busca.value = visao.busca; } }, 'comum' in ic ? iconeComum(ic.comum, 14, doc) : iconeGrade(ic.grade, 14, doc), h('span', { class: 'spro-rapido-rotulo' }, rotulo))));
    ajustarFaixa();
  }

  /**
   * A faixa dos filtros rapidos e dos seletores fica SEMPRE numa linha so. Sem espaco: primeiro os filtros rapidos
   * perdem o rotulo (so icone, o texto vai na dica); se ainda faltar, os seletores encolhem.
   */
  const faixa = host.shadowRoot!.querySelector<HTMLElement>('.spro-faixa')!;
  function ajustarFaixa() {
    if (encerrado) return;
    faixa.classList.remove('spro-faixa-c1', 'spro-faixa-c2');
    if (!faixa.clientWidth) return; // sem layout (testes, aba oculta)
    if (faixa.scrollWidth > faixa.clientWidth + 1) faixa.classList.add('spro-faixa-c1');
    if (faixa.scrollWidth > faixa.clientWidth + 1) faixa.classList.add('spro-faixa-c2');
  }
  const ObsTamanho = doc.defaultView?.ResizeObserver;
  const observadorTamanho = ObsTamanho ? new ObsTamanho(() => ajustarFaixa()) : null;
  observadorTamanho?.observe(faixa);

  function render() {
    if (encerrado) return;
    const f = facetasDe(comId(), ctx());
    facetas = f;
    for (const c of [fResp, fTipo, fMarc]) c.atualizar();
    comboAgrupar.definir([visao.agrupar], false);
    comboAgrupar.el.disabled = visao.modo === 'quadro';
    comboOrdem.definir([visao.ordem[0] ? `${visao.ordem[0].campo}:${visao.ordem[0].decrescente ? 'd' : 'a'}` : ''], false);
    for (const b of segmentado.querySelectorAll<HTMLElement>('[data-modo]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-modo') === visao.modo));
    btnDensidade.title = visao.densidade === 'compacta' ? 'Linhas confortáveis' : 'Linhas compactas';
    btnColunas.hidden = visao.modo === 'quadro';
    renderQuadroCfg();
    renderChips();
    andamentos?.definirAtivo(ehAgrupamentoAndamento(visao.agrupar) && visao.modo === 'tabela');
    renderConteudo();
    renderStatus(filtrados().length);
    renderLote();
    if (visao.modo === 'quadro' && !extrasPedido && d.extras) {
      extrasPedido = true;
      void d.extras().then((e) => { extras = e; if (!encerrado) renderConteudo(); }).catch(() => undefined);
    }
  }

  function renderQuadroCfg() {
    opcoesQuadro.hidden = visao.modo !== 'quadro';
    if (opcoesQuadro.hidden) return;
    const q = visao.quadro;
    const sel = criarCombo({
      rotulo: 'Colunas do quadro', icone: 'mapa', classe: 'spro-combo-compacto', busca: false,
      opcoes: [{ valor: 'marcador', rotulo: 'Colunas: marcador' }, { valor: 'responsavel', rotulo: 'Colunas: responsável' }, { valor: 'prazo', rotulo: 'Colunas: prazo (leitura)' }, { valor: 'tipo', rotulo: 'Colunas: tipo (leitura)' }],
      valor: [q.colunas], aoMudar: ([v]) => { extrasPedido = false; alterar({ quadro: { ...q, colunas: (v ?? 'marcador') as typeof q.colunas } }); },
    });
    const lim = h('input', { type: 'number', min: '0', max: '99', class: 'spro-num', value: String(q.limite), 'aria-label': 'Limite de cartões por coluna (0 = sem limite)', title: 'Limite de cartões por coluna (0 = sem limite)', onchange: (ev: Event) => alterar({ quadro: { ...q, limite: Math.max(0, Math.min(99, Number((ev.target as HTMLInputElement).value) || 0)) } }) });
    const raia = h('input', { type: 'checkbox', onchange: (ev: Event) => alterar({ quadro: { ...q, raiasPorResponsavel: (ev.target as HTMLInputElement).checked } }) });
    raia.checked = q.raiasPorResponsavel;
    opcoesQuadro.replaceChildren(sel.el, h('label', { class: 'spro-rotulo-inline' }, 'Limite ', lim), h('label', { class: 'spro-rotulo-inline' }, raia, ' Raias por responsável'),
      h('span', { class: 'spro-suave' }, q.colunas === 'marcador' || q.colunas === 'responsavel' ? 'Arraste os cartões entre as colunas.' : 'Esta divisão é só de leitura.'));
  }

  // ---------- painéis (colunas e visões) ----------
  function abrirPainel(qual: 'colunas' | 'visoes') {
    if (!painel.hidden && painel.getAttribute('data-qual') === qual) { painel.hidden = true; return; }
    painel.setAttribute('data-qual', qual);
    painel.hidden = false;
    if (qual === 'colunas') {
      painel.replaceChildren(h('strong', {}, 'Colunas'), ...COLUNAS.map((c) => {
        const cb = h('input', { type: 'checkbox', disabled: c === 'processo' });
        cb.checked = visao.colunas.includes(c);
        cb.addEventListener('change', () => {
          const novas = cb.checked ? COLUNAS.filter((x) => x === c || visao.colunas.includes(x)) : visao.colunas.filter((x) => x !== c);
          alterar({ colunas: novas as Coluna[] });
        });
        return h('label', { class: 'spro-rotulo-linha' }, cb, ` ${ROTULO_COLUNA[c]}`);
      }), h('button', { type: 'button', class: 'spro-link', onclick: () => alterar({ colunas: visaoPadrao().colunas }) }, 'Restaurar padrão'));
      return;
    }
    const nome = h('input', { type: 'text', class: 'spro-nome', maxlength: '40', placeholder: 'Nome da visão', 'aria-label': 'Nome da visão' });
    const atual = salvas.find((v) => v.id === visaoSalvaId);
    nome.value = atual?.nome ?? '';
    const gravar = async (lista: Visao[], anteriores = salvas) => { salvas = lista; await d.armazem.gravarVisoes(lista, anteriores).catch(() => aviso('Não foi possível sincronizar as visões.')); };
    const salvar = async (como: 'nova' | 'atualizar') => {
      const base = { ...visao, nome: nome.value.trim() || 'Minha visão', id: como === 'atualizar' ? visaoSalvaId : '' };
      const r = salvarVisao(salvas, base, d.novoId);
      if (!r) return aviso('Limite de visões salvas atingido.');
      visaoSalvaId = r.visao.id;
      await gravar(r.lista);
      aviso(`Visão "${r.visao.nome}" salva.`);
      abrirPainel('visoes'); abrirPainel('visoes');
    };
    painel.replaceChildren(
      h('strong', {}, 'Visões salvas'),
      salvas.length ? h('ul', { class: 'spro-lista-visoes' }, ...salvas.map((v) => h('li', {},
        h('button', { type: 'button', class: `spro-link${v.id === visaoSalvaId ? ' spro-ativa' : ''}`, onclick: () => { visaoSalvaId = v.id; busca.value = v.busca; alterar({ ...v, id: '' }); } }, v.nome),
        h('button', { type: 'button', class: 'spro-aviso-x', 'aria-label': `Excluir ${v.nome}`, title: 'Excluir', onclick: async () => { await gravar(excluirVisao(salvas, v.id), salvas); if (visaoSalvaId === v.id) visaoSalvaId = ''; abrirPainel('visoes'); abrirPainel('visoes'); } }, '×')))) : h('p', { class: 'spro-suave' }, 'Nenhuma visão salva ainda.'),
      h('div', { class: 'spro-linha-form' }, nome,
        h('button', { type: 'button', class: 'spro-bt', onclick: () => void salvar('nova') }, 'Salvar como nova'),
        atual && mudouDe(visao, atual) ? h('button', { type: 'button', class: 'spro-bt', onclick: () => void salvar('atualizar') }, 'Atualizar') : null));
  }

  function exportar() {
    const linhas = linhasCsv(ordenados(), visao.modo === 'quadro' ? [...COLUNAS] : visao.colunas, ctx());
    d.baixar(nomeArquivo(d.hoje()), gerarCsv(linhas), 'text/csv;charset=utf-8');
    aviso(`${linhas.length - 1} processos exportados.`);
  }

  // ---------- eventos ----------
  busca.addEventListener('input', () => {
    const v = busca.value;
    if (d.semDebounce) return alterar({ busca: v });
    clearTimeout(buscaTimer);
    buscaTimer = setTimeout(() => alterar({ busca: v }), 120);
  });
  busca.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { busca.value = ''; alterar({ busca: '' }); busca.blur(); }
  });

  function aoTeclar(ev: KeyboardEvent) {
    if (encerrado || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const alvo = ev.target as HTMLElement | null;
    const digitando = alvo && (/^(input|textarea|select)$/i.test(alvo.tagName) || alvo.isContentEditable);
    if (digitando || host.hidden) return;
    const k = ev.key;
    if (aguardandoG) {
      aguardandoG = false;
      if (k === 't') alterar({ modo: 'tabela' });
      else if (k === 'q') alterar({ modo: 'quadro' });
      return;
    }
    const ids = ordenados().map((p) => p.id);
    const i = foco ? ids.indexOf(foco) : -1;
    if (k === '/') { ev.preventDefault(); busca.focus(); }
    else if (k === '?') ajuda.hidden = !ajuda.hidden;
    else if (k === 'g') aguardandoG = true;
    else if (k === 'Escape') { if (selecionados.size) selecionar([...selecionados], false); }
    else if ((k === 'j' || k === 'k') && visao.modo === 'tabela' && ids.length) {
      foco = ids[Math.max(0, Math.min(ids.length - 1, i + (k === 'j' ? 1 : -1)))]!;
      renderConteudo();
      tabela.mostrar(foco);
    } else if (k === 'x' && foco) {
      const p = todos.find((x) => x.id === foco);
      if (p) selecionar([foco], !selecionados.has(foco));
    } else if (k === 'Enter' && foco) {
      const link = todos.find((x) => x.id === foco)?.link;
      if (link) doc.defaultView?.location.assign(link);
    }
  }
  doc.addEventListener('keydown', aoTeclar);
  const pararSelecao = observarSelecao(doc, (ids) => { selecionados = ids; renderLote(); renderConteudo(); });
  const pararVisoes = d.armazem.aoMudarVisoes(() => void d.armazem.lerVisoes().then((v) => { salvas = v; }).catch(() => undefined));

  // ---------- sincronia com a linha nativa ----------
  // A linha nativa (oculta) continua sendo a fonte da verdade: os outros modulos e o proprio SEI a atualizam
  // (estrela, prazo, anotacao, icones), e a grade relê o que mudou. Enquanto ha escrita em andamento, nao relê
  // (a atualizacao otimista ainda nao chegou ao SEI e seria desfeita).
  const assinaturas = new Map<string, string>();
  function sincronizar() {
    if (encerrado || emVoo > 0) return;
    const leitura = lerTabelas(doc);
    const novos = new Map(leitura.processos.map((p) => [p.id, p]));
    let mudou = false;
    todos = todos.map((p) => {
      if (!p.naPaginaAtual) return p;
      const n = novos.get(p.id);
      if (!n) return p;
      const local = locais.get(p.id);
      const assinatura = assinaturaIcones(doc, p.id);
      const assinaturaAntes = assinaturas.get(p.id);
      assinaturas.set(p.id, assinatura);
      let resultado = n;
      if (local) {
        // A linha nativa ja concorda com o que a grade mudou? Entao o registro local cumpriu o papel.
        for (const k of Object.keys(local)) if (JSON.stringify((n as unknown as Record<string, unknown>)[k]) === JSON.stringify(local[k])) delete local[k];
        if (!Object.keys(local).length) locais.delete(p.id);
        else resultado = { ...n, ...local } as Processo;
      }
      const mesmoModelo = JSON.stringify(resultado) === JSON.stringify(p);
      if (mesmoModelo && assinaturaAntes === assinatura) return p;
      mudou = true;
      return mesmoModelo ? p : resultado;
    });
    if (mudou) { atualizarEstilosModulos(); render(); }
  }
  let sincTimer: ReturnType<typeof setTimeout> | undefined;
  const Obs = doc.defaultView?.MutationObserver;
  const observadorNativo = Obs ? new Obs(() => { clearTimeout(sincTimer); sincTimer = setTimeout(sincronizar, d.semDebounce ? 0 : 150); }) : null;
  const alvoNativo = doc.querySelector('#frmProcedimentoControlar') ?? doc.body;
  if (observadorNativo && alvoNativo) observadorNativo.observe(alvoNativo, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'aria-label', 'onmouseover', 'src', 'href', 'class'] });
  function atualizarEstilosModulos() {
    const css = estilosDosModulos(doc);
    if (estiloModulos.textContent !== css) estiloModulos.textContent = css;
  }

  // ---------- partida ----------
  async function carregarTudo() {
    if (!d.fonte) { completo = true; return finalizarCarga(true); }
    carregando = true;
    render();
    const aoSair = () => d.fonte?.restaurarAoSair?.();
    doc.defaultView?.addEventListener('pagehide', aoSair);
    const r = await carregarRestante(d.inicial, d.fonte, {
      sinal: ctl.signal,
      aoProgresso: (p) => { progresso = p; renderStatus(filtrados().length); },
      aoSelecao: (g, n, s) => { selecoesPaginas.set(chavePagina(g, n), s); },
      aoPagina: (novos) => { todos = [...todos, ...novos]; render(); },
    });
    doc.defaultView?.removeEventListener('pagehide', aoSair);
    carregando = false;
    completo = r.completo;
    if (r.erro) erroCarga = r.erro;
    finalizarCarga(r.completo);
  }
  function finalizarCarga(completa: boolean) {
    idade = registrarVistos(idade, todos.map((p) => p.id), d.agora(), completa);
    void d.armazem.gravarIdade(idade).catch(() => undefined);
    render();
  }

  async function iniciar() {
    try {
      const e = await d.armazem.lerEstado();
      visao = e.visao; recolhidos = new Set(e.recolhidos);
      idade = abrirVisita(e.idade, d.agora());
      visitaAnterior = idade.visitaAnterior;
      salvas = await d.armazem.lerVisoes();
    } catch { /* sem preferências legíveis: segue com o padrão */ }
    idade = registrarVistos(idade, todos.map((p) => p.id), d.agora(), false);
    if (andamentos) await andamentos.carregar();
    busca.value = visao.busca;
    atualizarEstilosModulos();
    for (const [id] of todos.map((p) => [p.id])) assinaturas.set(id!, assinaturaIcones(doc, id!));
    render();
    void carregarTudo();
    for (const ms of [1200, 3500]) { const t = setTimeout(() => { atualizarEstilosModulos(); sincronizar(); }, ms); (t as unknown as { unref?: () => void }).unref?.(); }
  }

  return {
    host,
    iniciar,
    render,
    estado: () => ({ visao, todos, selecionados, completo, carregando, filtrados: filtrados().length }),
    definirVisao: (v: Partial<Visao>) => { visao = { ...visao, ...v }; busca.value = visao.busca; render(); },
    fechar() {
      encerrado = true;
      ctl.abort();
      andamentos?.fechar();
      clearTimeout(buscaTimer); clearTimeout(gravarTimer); clearTimeout(sincTimer);
      observadorNativo?.disconnect();
      observadorTamanho?.disconnect();
      pararTitulos();
      doc.removeEventListener('keydown', aoTeclar);
      pararSelecao(); pararVisoes();
      host.remove();
    },
    mostrar: (v: boolean) => { host.hidden = !v; },
    /** Troca claro/escuro com a grade aberta (o tema do SEI mudou). */
    definirTema: (escuro: boolean) => {
      host.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
      raiz.classList.toggle('spro-escuro', escuro);
    },
    definirNomesCompletos: (v: boolean) => { nomesCompletos = v; render(); },
    /** Filtro vindo da pesquisa rápida do SEI; vazio limpa. */
    definirFiltroExterno: (texto: string) => { const novo = texto.trim(); if (novo === filtroExterno) return; filtroExterno = novo; render(); },
    sincronizar,
    /** So para os testes: registra o par de uma pagina como se o carregador a tivesse lido. */
    registrarSelecaoParaTeste: (g: Grupo | 'detalhado', n: number, sel: SelecaoDaPagina) => void selecoesPaginas.set(chavePagina(g, n), sel),
  };
}

export type App = ReturnType<typeof criarApp>;
export type { Processo };
