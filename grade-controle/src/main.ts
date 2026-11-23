/**
 * Content script isolado (`document_start`): a grade nova do Controle de Processos, com a opção `gradecontrole`
 * (ligada por padrão). Ligada, só mostra o botão ao lado do título: a grade abre quando o usuário clica nele (a escolha fica lembrada).
 *
 * Ordem importa: a bandeira síncrona (localStorage) marca o `<html>` ANTES do corpo existir, e o CSS injetado
 * esconde a tabela nativa e desenha o esqueleto. Só depois, com o DOM pronto, a grade lê a tabela e se monta.
 * Falhou ou demorou: `desativar` devolve a nativa e o legado (que se cala enquanto o atributo existe).
 */
import { areaChrome } from '../../sei-comum/src/armazenamento/area';
import { hojeISO } from '../../sei-comum/src/datas/dias';
import { opcaoLegadaLigada, opcaoLegadaMarcada } from '../../sei-comum/src/opcoes/legadas';
import { aoMudarEsquemaSei, esquemaDoEstilo2, temaEscuroLegado } from '../../sei-comum/src/pagina/tema';
import { novoId } from '../../sei-comum/src/id';
import cssBase from '../../sei-comum/src/ui/base.css';
import { baixar } from '../../sei-comum/src/ui/dialogo';
import { listarOpcoes } from '../../sei-nucleo/src/dominio/opcoes';
import { alterarProcesso } from '../../sei-nucleo/src/dominio/processo';
import { atribuirProcesso, definirAnotacao, definirMarcador } from '../../sei-nucleo/src/dominio/acoesProcesso';
import { consultarAndamento } from './andamentos/consultar';
import { Sei, lerContexto } from '../../sei-nucleo/src/sei';
import { paginaDe } from '../../sei-nucleo/src/sessao/pagina';
import { enviarAcao } from './acoes/foraDaPagina';
import { acoesDaBarra } from './leitura/barra';
import { acompanharRecolhimento } from './ativacao/recolher';
import { instalarDicas } from './ui/dica';
import { ativarCedo, desativar, estaAtiva, gravarDica, lerDica, marcarPronta, vigiar } from './ativacao/inicio';
import { ligarCliqueDoBotao, manterBotao } from './ativacao/botao';
import { lerTabelas, SELETOR_TABELAS } from './leitura/tabela';
import { consultarDatasMarcadores } from './leitura/datasMarcadores';
import { criarFonteSei } from './paginas/carregar';
import { criarArmazem } from './persistencia/armazem';
import { criarApp, type App } from './ui/app';
import cssGrade from './style.css';
import cssPagina from './pagina.css';

const OPCAO = 'gradecontrole';
const ATRIBUTO_PESQUISA = 'data-spro-pesquisa-rapida';

function noControle(): boolean {
  return new URL(location.href).searchParams.get('acao') === 'procedimento_controlar';
}

/** O Estilo Avançado 2, quando ligado, manda (inclusive para dizer "claro"); senão vale o modo noturno antigo. */
const escuro = (): boolean => {
  const novo = esquemaDoEstilo2(document);
  return novo ? novo === 'escuro' : !!document.body?.classList.contains('dark-mode') || temaEscuroLegado(localStorage);
};

/** A opção do SEI Pro (liga o recurso e mostra o botão). */
let habilitada: boolean | null = null;
/** A escolha do usuário pelo botão: só com ela a grade substitui a lista do SEI (começa sempre na lista nativa). */
let ligada = false;
let app: App | null = null;
let vigia: ReturnType<typeof vigiar> | null = null;
let pararBotao: (() => void) | null = null;
let remontagens = 0;
let nomesCompletos = false;
let vigiaHost: MutationObserver | null = null;
let pararTema: (() => void) | null = null;
let vigiaPesquisa: MutationObserver | null = null;
let domPronto = document.readyState !== 'loading';

function ancora(): Element | null {
  const tabela = document.querySelector(SELETOR_TABELAS);
  return document.getElementById('divTabelaProcesso') ?? tabela?.parentElement ?? null;
}

function voltarNativa(motivo?: string) {
  vigia?.pronta();
  app?.mostrar(false);
  desativar(document);
  if (motivo && motivo !== 'usuario') console.warn('[SEI Pro] Grade do controle indisponível, usando a visão nativa:', motivo);
}

function montar() {
  if (app || !ligada) return;
  const sei = new Sei(location.href, () => paginaDe(document, location.href));
  const contexto = lerContexto(paginaDe(document, location.href));
  const unidade = contexto.unidade.id;
  const armazem = criarArmazem({ local: areaChrome(chrome.storage.local, 'local'), sync: areaChrome(chrome.storage.sync, 'sync') }, String(unidade), contexto.usuario.login);
  // Uma carga interrompida (aba fechada no meio) pode ter deixado o SEI numa pagina que nao e a primeira: a tela
  // mostraria so um trecho. Volta para a primeira e recarrega uma unica vez.
  const fora = ['hdnRecebidosPaginaAtual', 'hdnGeradosPaginaAtual', 'hdnDetalhadoPaginaAtual'].some((id) => (document.getElementById(id) as HTMLInputElement | null)?.value && (document.getElementById(id) as HTMLInputElement).value !== '0');
  if (fora && !sessionStorage.getItem('spro_grade_reset')) {
    try { sessionStorage.setItem('spro_grade_reset', '1'); } catch { /* segue */ }
    void criarFonteSei(sei.http, paginaDe(document, location.href)).restaurar().then(() => location.reload()).catch(() => voltarNativa('pagina intermediaria'));
    return;
  }
  try { sessionStorage.removeItem('spro_grade_reset'); } catch { /* segue */ }
  const inicial = lerTabelas(document);
  if (!inicial.processos.length && !inicial.totais.recebidos && !inicial.totais.gerados) {
    // Caixa vazia: nada a projetar; a tela nativa já diz "nenhum processo".
    vigia?.pronta();
    return voltarNativa('caixa vazia');
  }
  const alvo = ancora();
  if (!alvo) return voltarNativa('sem ponto de encaixe');
  const candidatos = inicial.processos.filter((p) => !p.sigiloso && p.naPaginaAtual).slice(0, 6).map((p) => p.protocolo);
  app = criarApp({
    doc: document,
    inicial,
    agora: () => Date.now(),
    hoje: () => hojeISO(),
    eu: contexto.usuario.login || undefined,
    armazem,
    fonte: criarFonteSei(sei.http, paginaDe(document, location.href), inicial.visao),
    mover: {
      marcador: async (protocolo, m) => void (await definirMarcador(sei, protocolo, m, { aplicar: true })),
      atribuir: async (protocolo, usuario) => void (await atribuirProcesso(sei, protocolo, usuario, { aplicar: true })),
    },
    acoes: () => acoesDaBarra(document),
    css: `${cssBase}\n${cssGrade}`,
    escuro: escuro(),
    baixar: (n, c, t) => baixar(n, c, t),
    novoId: () => novoId(),
    extras: candidatos.length
      ? async () => {
          // Cada lista e lida de um processo ABERTO na unidade; o primeiro pode ser sigiloso ou estar so em outra unidade.
          const ler = async (lista: 'marcadores' | 'usuarios') => {
            let ultimo: unknown;
            for (const ref of candidatos) {
              try {
                return await listarOpcoes(sei, lista, ref);
              } catch (e) {
                ultimo = e;
              }
            }
            console.warn(`[SEI Pro] Grade: nao foi possivel ler a lista de ${lista}`, ultimo instanceof Error ? ultimo.message : ultimo);
            return [];
          };
          const [m, u] = await Promise.all([ler('marcadores'), ler('usuarios')]);
          return { marcadores: m.map((x) => x.nome), responsaveis: u.map((x) => { const [sigla, ...resto] = x.nome.split(' - '); return { sigla: sigla!.trim(), nome: resto.join(' - ').trim() || sigla!.trim() }; }) };
        }
      : undefined,
    aoVoltarNativa: () => alternar(),
    enviarAcao: (url, plano) => enviarAcao(document, url, plano),
    editarEspecificacao: async (protocolo, texto) => void (await alterarProcesso(sei, protocolo, { especificacao: texto }, { aplicar: true })),
    abrirPrazo: (id) => {
      // O modulo de Prazos escuta este evento (o mesmo que o legado dispara) e abre o menu do prazo do processo.
      document.documentElement.setAttribute('data-spro-prazos-alvo', id);
      document.dispatchEvent(new CustomEvent('spro-prazos-abrir'));
    },
    anotar: async (protocolo, a) => void (await definirAnotacao(sei, protocolo, a, { aplicar: true })),
    consultarAndamento: (p, sinal) => consultarAndamento(sei, p, { sigla: contexto.unidade.sigla, nome: contexto.unidade.nome }, sinal),
    consultarDatasMarcadores: (p, sinal) => consultarDatasMarcadores(sei, p, sinal),
  });
  app.definirNomesCompletos(nomesCompletos);
  acompanharPesquisaRapida(app);
  // O tema do SEI pode mudar com a grade aberta (opcoes do Estilo Avancado 2, tema do sistema).
  pararTema?.();
  pararTema = aoMudarEsquemaSei(document, () => app?.definirTema(escuro()));
  alvo.before(app.host);
  acompanharRecolhimento(document, app.host);
  guardarHost();
  void app.iniciar().then(() => {
    vigia?.pronta();
    if (estaAtiva(document)) marcarPronta(document);
  }).catch((e) => voltarNativa(String(e)));
}

/**
 * A Pesquisa Rápida (outro content script, mundo isolado próprio) não alcança as linhas da grade: com ela ativa a
 * tabela nativa fica escondida. O termo digitado viaja por um atributo do `<html>`, o único canal comum aos dois mundos.
 */
function acompanharPesquisaRapida(alvo: App) {
  vigiaPesquisa?.disconnect();
  const ler = () => alvo.definirFiltroExterno(document.documentElement.getAttribute(ATRIBUTO_PESQUISA) ?? '');
  ler();
  vigiaPesquisa = new window.MutationObserver(ler);
  vigiaPesquisa.observe(document.documentElement, { attributes: true, attributeFilter: [ATRIBUTO_PESQUISA] });
}

/**
 * O legado reorganiza a tela depois do carregamento (`$.fn.moveTo` CLONA o formulario inteiro): o clone leva o host
 * sem o Shadow DOM e sem os ouvintes, e o original some. Quando isso acontece, refazemos a grade a partir da tabela
 * que sobrou (a nativa tambem foi clonada, entao a leitura continua valida).
 */
function guardarHost() {
  vigiaHost?.disconnect();
  const Obs = window.MutationObserver;
  let agendado = false;
  vigiaHost = new Obs(() => {
    if (agendado) return;
    agendado = true;
    setTimeout(() => {
      agendado = false;
      if (!app || !ligada) return;
      const sadio = app.host.isConnected && !!app.host.shadowRoot && document.querySelectorAll('#spro-grade').length === 1;
      if (sadio || remontagens >= 6) return;
      remontagens += 1;
      app.fechar();
      app = null;
      vigiaPesquisa?.disconnect(); vigiaPesquisa = null;
      for (const h of document.querySelectorAll('#spro-grade')) h.remove();
      if (estaAtiva(document) || ligada) montar();
    }, 150);
  });
  vigiaHost.observe(document.body ?? document.documentElement, { childList: true, subtree: true });
}

/** O botão: troca entre o Novo Controle de Processos e a lista nativa; a escolha fica lembrada neste navegador. */
function alternar() {
  if (!habilitada) return;
  if (estaAtiva(document)) {
    ligada = false;
    gravarDica(localStorage, false);
    app?.mostrar(false);
    desativar(document);
  } else {
    ligada = true;
    gravarDica(localStorage, true);
    ativarCedo(document, escuro());
    if (app && app.host.isConnected && app.host.shadowRoot) {
      app.mostrar(true);
      marcarPronta(document);
    } else {
      if (app) {
        app.fechar();
        app = null;
      }
      vigia = vigiar(voltarNativa);
      vigia.iniciarContagem();
      montar();
    }
  }
  pararBotao?.();
  pararBotao = manterBotao(document, () => estaAtiva(document), alternar);
}

function configurar(valor: boolean) {
  if (valor === habilitada) return;
  habilitada = valor;
  if (valor) {
    if (domPronto) pararBotao ??= manterBotao(document, () => estaAtiva(document), alternar);
    if (ligada) {
      ativarCedo(document, escuro());
      vigia ??= vigiar(voltarNativa);
      if (domPronto) { vigia.iniciarContagem(); montar(); }
    }
  } else {
    ligada = false;
    gravarDica(localStorage, false);
    pararBotao?.(); pararBotao = null;
    vigiaHost?.disconnect();
    vigiaPesquisa?.disconnect(); vigiaPesquisa = null;
    app?.fechar(); app = null;
    vigia?.pronta();
    desativar(document);
  }
}

function partir() {
  if (!noControle()) return;
  const estilo = document.createElement('style');
  estilo.textContent = cssPagina;
  (document.head ?? document.documentElement).append(estilo);
  // Pré-pintura síncrona: a escolha do usuário (botão) no localStorage decide antes do storage responder.
  if (lerDica(localStorage)) {
    ligada = true;
    ativarCedo(document, escuro());
    vigia = vigiar(voltarNativa);
  }
  ligarCliqueDoBotao(document, alternar);
  instalarDicas(document, escuro); // so age em elementos da grade; o resto do SEI mantem as suas dicas
  const aoDom = () => {
    domPronto = true;
    if (ligada) {
      vigia?.iniciarContagem();
      montar();
    }
    if (habilitada) pararBotao ??= manterBotao(document, () => estaAtiva(document), alternar);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aoDom, { once: true });
  else aoDom();

  const ler = (dataValues: unknown) => {
    nomesCompletos = opcaoLegadaMarcada(dataValues, 'nomesusuarios');
    app?.definirNomesCompletos(nomesCompletos);
    // Ligada por padrao (como Prazos e Projetos): so `false` gravado desliga.
    configurar(opcaoLegadaLigada(dataValues, OPCAO));
  };
  let mudou = false;
  chrome.storage.onChanged.addListener((m, area) => {
    if (area !== 'sync' || !('dataValues' in m)) return;
    mudou = true;
    ler(m.dataValues!.newValue);
  });
  chrome.storage.sync.get('dataValues').then((i) => { if (!mudou) ler(i.dataValues); }).catch(() => { if (ligada) voltarNativa('sem preferências'); });
}

partir();
