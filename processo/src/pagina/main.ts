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
import { LojaProcesso } from "../modelo/loja";
import { paineisHabilitados } from "../modelo/paineis";
import { aguardarArvore, fatiasNecessarias, manterMontagem } from "./arvore";
import { criarContexto, escopoDoUsuario, lerUsuarioEUnidade } from "./contexto";
import { definirCss } from "./estilo";
import { criarLeituras } from "./leituras";
import { dentroDoVerificadorOculto, ehQuadroDaArvore, marcarAtivo, marcarMenu } from "./marca";
import { ligarMenuDaArvore } from "./menuDoc/ligar";
import { ligarMarcaDoMenu } from "./menuTopo";
import { lerSelecao, painelLigado } from "./opcoes";

definirCss(`${base}\n${proprio}`);
if (ehQuadroDaArvore(window)) {
  marcarAtivo(document);
  marcarMenu(document);
}

const global = window as unknown as { __seiProProcessoPaineis?: boolean };
if (!global.__seiProProcessoPaineis && ehQuadroDaArvore(window) && !dentroDoVerificadorOculto(window)) {
  global.__seiProProcessoPaineis = true;
  const iniciar = () => void principal().catch((e) => console.warn("[SEI Pro] painéis do processo:", e));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}

async function principal(): Promise<void> {
  if (!document.querySelector("#topmenu") && !document.querySelector("#divArvore") && !document.getElementById("frmArvore")) return;
  const { dataValues } = (await chrome.storage.sync.get("dataValues")) as { dataValues?: unknown };
  const comPaineis = opcaoLegadaLigada(dataValues, "infoarvore") && painelLigado(localStorage);
  const comMenu = opcaoLegadaLigada(dataValues, "menurapido");
  if (!comPaineis && !comMenu) return;
  const arv = await aguardarArvore(document);
  if (!arv) {
    console.warn("[SEI Pro] painéis do processo: a árvore não chegou no prazo.");
    return;
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
  const ctx = criarContexto({
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
  if (comPaineis) {
    manterMontagem(ctx);
    ligarMarcaDoMenu(ctx);
    for (const n of fatiasNecessarias(ctx)) ctx.recarregar(n);
  }
  if (comMenu) ligarMenuDaArvore({ ctx, dataValues, http });
}
