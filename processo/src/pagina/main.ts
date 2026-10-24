/**
 * Content script do quadro da árvore do processo (mundo isolado, todos os quadros, document_start).
 * Marca o documento de forma síncrona (o legado não desenha mais os painéis) e, com o DOM pronto, monta os
 * painéis abaixo da árvore. Os dados vêm da loja do processo: cada painel carrega e falha sozinho.
 */
import { areaChrome } from "@comum/armazenamento/area";
import { opcaoLegadaLigada, opcaoLegadaMarcada } from "@comum/opcoes/legadas";
import base from "@comum/ui/base.css";
import { criarHttp } from "@nucleo/sessao/http";
import { documentoTopo } from "@nucleo/sessao/pagina";
import proprio from "../../estatico/processo.css";
import { restaurarBlocoInterno } from "../gantt/coleta";
import { ligarGantt } from "../gantt/ligar";
import { OPCAO_FILTRO_ARVORE } from "../modelo/constantes";
import { LojaProcesso } from "../modelo/loja";
import { paineisHabilitados } from "../modelo/paineis";
import { aguardarArvore, fatiasNecessarias, manterMontagem } from "./arvore";
import { ehEnviarProcesso, ligarAviso } from "./aviso/ligar";
import { type ContextoProcesso, criarContexto, escopoDoUsuario, lerUsuarioEUnidade } from "./contexto";
import { definirCss } from "./estilo";
import { ligarFiltro } from "./filtro/barra";
import { criarLeituras } from "./leituras";
import {
  dentroDoVerificadorOculto,
  ehQuadroDaArvore,
  ehTopoDoProcesso,
  marcarAtivo,
  marcarCapa,
  marcarGantt,
  marcarMenu,
  marcarTituloEAviso,
} from "./marca";
import { ligarMenuDaArvore } from "./menuDoc/ligar";
import { ligarMarcaDoMenu } from "./menuTopo";
import { lerSelecao, painelLigado } from "./opcoes";
import { ligarPonteDaCapa } from "./ponteCapa";
import { ligarTitulo } from "./titulo";

let contextoDaPagina: Promise<ContextoProcesso | null> | null = null;

definirCss(`${base}\n${proprio}`);
if (ehTopoDoProcesso(window)) {
  marcarCapa(document);
  marcarTituloEAviso(document);
}
if (ehQuadroDaArvore(window)) {
  marcarAtivo(document);
  marcarMenu(document);
  marcarGantt(document);
}

const global = window as unknown as { __seiProProcessoPaineis?: boolean };
if (!global.__seiProProcessoPaineis && ehQuadroDaArvore(window) && !dentroDoVerificadorOculto(window)) {
  global.__seiProProcessoPaineis = true;
  // O Gantt abre por pedido (o link da capa legada), com ou sem os painéis e o menu ligados: o ouvinte vale sempre que
  // o atributo `data-seipro-processo-gantt` foi posto, senão o link ficaria morto.
  ligarGantt(document, obterContexto);
  // A capa (quadro do visualizador) pede as fatias e a coleta do histórico por evento: o dono da escrita é este quadro.
  ligarPonteDaCapa(document, obterContexto);
  const iniciar = () => void principal().catch((e) => console.warn("[SEI Pro] painéis do processo:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}

// O aviso de documentos não assinados mora no quadro do Enviar Processo (outro quadro, sem painéis nem loja de escrita).
if (ehEnviarProcesso(window) && !dentroDoVerificadorOculto(window)) {
  const iniciarAviso = () => void ligarAviso().catch((e) => console.warn("[SEI Pro] aviso de não assinados:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarAviso, { once: true });
  else iniciarAviso();
}

/** O contexto do processo, montado uma vez e só quando alguém precisa (painéis, menu ou o pedido do Gantt). */
function obterContexto(): Promise<ContextoProcesso | null> {
  contextoDaPagina ??= montarContexto().catch((e) => {
    contextoDaPagina = null;
    throw e;
  });
  return contextoDaPagina;
}

async function montarContexto(): Promise<ContextoProcesso | null> {
  const { dataValues } = (await chrome.storage.sync.get("dataValues")) as { dataValues?: unknown };
  const arv = await aguardarArvore(document);
  if (!arv) {
    console.warn("[SEI Pro] painéis do processo: a árvore não chegou no prazo.");
    return null;
  }
  const topo = documentoTopo();
  const u = lerUsuarioEUnidade(topo);
  const sigiloso = arv.nivel === "sigiloso";
  // Sem login conhecido o escopo fica sem usuário e o cache não grava (loja.escopoValido).
  const loja = new LojaProcesso(areaChrome(chrome.storage.local, "local"), escopoDoUsuario(u.host, u.login), arv.idProcedimento, {
    sigiloso,
  });
  const http = criarHttp(location.href);
  const consultasDesativadas = opcaoLegadaMarcada(dataValues, "disablequery");
  const leituras = criarLeituras({ http, arv, loja, unidadeSigla: u.unidade.sigla, consultasDesativadas });
  return criarContexto({
    doc: document,
    topo,
    arv,
    loja,
    ...u,
    habilitados: paineisHabilitados(lerSelecao(localStorage)),
    armazenamento: localStorage,
    consultasDesativadas,
    reaberturaProgramada: opcaoLegadaMarcada(dataValues, "reaberturaprogramada"),
    usaTrancado: chrome.runtime.getManifest().short_name === "SEI Pro Lab",
    recarregar: (n) => {
      const buscar = leituras[n];
      if (buscar) void loja.carregar(n, buscar);
    },
  });
}

async function principal(): Promise<void> {
  if (!document.querySelector("#topmenu") && !document.querySelector("#divArvore") && !document.getElementById("frmArvore")) return;
  const { dataValues } = (await chrome.storage.sync.get("dataValues")) as { dataValues?: unknown };
  const comPaineis = opcaoLegadaLigada(dataValues, "infoarvore") && painelLigado(localStorage);
  const comMenu = opcaoLegadaLigada(dataValues, "menurapido");
  // O filtro vale por si (não depende dos painéis nem do menu) e vem ligado: só esconde nós quando o usuário pede.
  const comFiltro = opcaoLegadaLigada(dataValues, OPCAO_FILTRO_ARVORE);
  // O título da aba vem da especificação (um GET do formulário do processo, ou o cache): vale sem painéis e sem menu.
  // Só na janela de topo do processo (não em janela auxiliar) e sem `disablequery`, como o legado.
  const comTitulo = !opcaoLegadaMarcada(dataValues, "disablequery") && ehTopoDoProcesso(window.top as Window);
  if (!comPaineis && !comMenu && !comFiltro && !comTitulo) return;
  const ctx = await obterContexto();
  if (!ctx) return;
  if (comTitulo && !ctx.sigiloso) {
    ligarTitulo(ctx);
    if (!comPaineis) ctx.recarregar("dadosProcesso");
  }
  if (comPaineis) {
    manterMontagem(ctx);
    ligarMarcaDoMenu(ctx);
    const fatias = new Set(fatiasNecessarias(ctx));
    if (comTitulo && !ctx.sigiloso) fatias.add("dadosProcesso");
    for (const n of fatias) ctx.recarregar(n);
    // Histórico completo ainda válido no cache (coletado por clique há menos de 30 min): o Bloco Interno aparece sem rede.
    void restaurarBlocoInterno(ctx).catch(() => undefined);
  }
  if (comMenu) ligarMenuDaArvore({ ctx, dataValues, http: criarHttp(location.href) });
  if (comFiltro) ligarFiltro(ctx);
}
